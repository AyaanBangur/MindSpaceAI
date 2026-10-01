"""Live Gemini-backed chat logic — same two-gate guardrail architecture as
live_backend.py (Anthropic), just talking to Google's Generative Language
API instead. Added as a second provider option so either an Anthropic key
or a Gemini key (or both) can drive the live path — see main.py for how
the two are chosen between.

STATUS: fully implemented, NOT yet reviewed. Do not point a deployed
instance of this at real users until the risk-detection logic below has
been reviewed by someone with clinical/crisis background — see
docs/RISK_DETECTION_SPEC.md and docs/AGENT_GUARDRAILS_SPEC.md. Those specs
were written against Claude's behavior; if Gemini is the active provider,
re-run their adversarial test passes against Gemini specifically before
trusting it in production — a classifier prompt that reliably gets a
particular category right on one model is not guaranteed to transfer
exactly to another.

Requires GEMINI_API_KEY in the environment (e.g. via a local .env file
loaded with python-dotenv — see .env.example). Never commit a real key.

All persona/guardrail prompt text lives in prompts.py, shared with
live_backend.py — this file only does Gemini's specific HTTP request shape
and response parsing (contents/parts instead of Anthropic's
messages/content, role "model" instead of "assistant", system_instruction
instead of a top-level "system" field). It must never redefine or rephrase
any guardrail text itself.
"""
from __future__ import annotations

import json
import os
import re
from typing import Any

import httpx

from prompts import (
    RISK_CLASSIFIER_PROMPT,
    SCOPE_CLASSIFIER_PROMPT,
    VALID_SCOPE_CATEGORIES,
    scope_redirect_message,
    system_prompt,
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
# Fast, cheap model for the classification passes; a stronger model for the
# conversational reply. Swap freely (e.g. to whatever the current latest
# Gemini model names are) — nothing else here assumes a specific model name.
CLASSIFIER_MODEL = "gemini-2.0-flash"
REPLY_MODEL = "gemini-2.5-pro"


def _headers() -> dict[str, str]:
    return {"Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY or ""}


def _extract_text(data: dict) -> str:
    candidates = data.get("candidates") or []
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts") or []
    return "".join(p.get("text", "") for p in parts)


def _history_to_contents(history: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Gemini uses role "model" where Anthropic/the rest of this app uses
    "assistant", and wraps text in a parts list rather than a plain string."""
    contents = []
    for m in history or []:
        role = "model" if m.get("role") == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": m.get("content", "")}]})
    return contents


async def assess_scope(message: str) -> str:
    """Fails OPEN (returns "in_scope") on any error — see prompts.py and
    docs/AGENT_GUARDRAILS_SPEC.md for why this is the opposite default
    from assess_risk() below."""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.post(
                f"{GEMINI_BASE_URL}/{CLASSIFIER_MODEL}:generateContent",
                headers=_headers(),
                json={
                    "system_instruction": {"parts": [{"text": SCOPE_CLASSIFIER_PROMPT}]},
                    "contents": [{"role": "user", "parts": [{"text": f"Latest message to classify:\n{message}"}]}],
                    "generationConfig": {"maxOutputTokens": 40, "temperature": 0},
                },
            )

        if res.status_code != 200:
            return "in_scope"

        text = _extract_text(res.json())
        match = re.search(r"\{[^}]*\}", text)
        if not match:
            return "in_scope"

        parsed = json.loads(match.group(0))
        category = parsed.get("category")
        return category if category in VALID_SCOPE_CATEGORIES else "in_scope"
    except Exception:
        return "in_scope"


async def assess_risk(message: str, history: list[dict[str, Any]]) -> bool:
    """Fails CLOSED (returns True) on any error — see prompts.py and
    docs/RISK_DETECTION_SPEC.md for why."""
    if not GEMINI_API_KEY:
        return True  # fail closed if misconfigured

    try:
        context_messages = history[-6:] if isinstance(history, list) else []
        context_text = "\n".join(
            f"{'User' if m.get('role') == 'user' else 'Guide'}: {m.get('content')}"
            for m in context_messages
        )
        content = (
            f"Recent context:\n{context_text}\n\nLatest message to classify:\n{message}"
            if context_text
            else f"Latest message to classify:\n{message}"
        )

        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.post(
                f"{GEMINI_BASE_URL}/{CLASSIFIER_MODEL}:generateContent",
                headers=_headers(),
                json={
                    "system_instruction": {"parts": [{"text": RISK_CLASSIFIER_PROMPT}]},
                    "contents": [{"role": "user", "parts": [{"text": content}]}],
                    "generationConfig": {"maxOutputTokens": 40, "temperature": 0},
                },
            )

        if res.status_code != 200:
            return True  # fail closed

        text = _extract_text(res.json())
        match = re.search(r"\{[^}]*\}", text)
        if not match:
            return True  # fail closed on unparseable output

        parsed = json.loads(match.group(0))
        return parsed.get("risk") is True
    except Exception:
        return True  # fail closed


async def send_to_guide_gemini(guide_id: str, lang: str, history: list[dict[str, Any]], message: str) -> dict:
    # Risk check happens BEFORE any conversational response is generated,
    # and the conversational persona never sees a flagged message.
    risk_flag = await assess_risk(message, history or [])
    if risk_flag:
        return {"reply": None, "risk_flag": True}

    # Scope check runs next — see live_backend.py's identical comment and
    # docs/AGENT_GUARDRAILS_SPEC.md for why this is a hardcoded redirect
    # rather than trusting the reply model to decline on its own.
    scope_category = await assess_scope(message)
    if scope_category != "in_scope":
        return {"reply": scope_redirect_message(scope_category, lang), "risk_flag": False}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(
                f"{GEMINI_BASE_URL}/{REPLY_MODEL}:generateContent",
                headers=_headers(),
                json={
                    "system_instruction": {"parts": [{"text": system_prompt(guide_id, lang or "en")}]},
                    "contents": [*_history_to_contents(history), {"role": "user", "parts": [{"text": message}]}],
                    "generationConfig": {"maxOutputTokens": 300},
                },
            )
    except Exception:
        # Fail closed here too: an upstream error becomes a safe escalation
        # screen, not a silently dropped message or a broken chat state.
        return {"reply": None, "risk_flag": True}

    if res.status_code != 200:
        return {"reply": None, "risk_flag": True}

    reply = _extract_text(res.json())
    return {"reply": reply, "risk_flag": False}
