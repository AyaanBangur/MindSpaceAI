"""Live Claude-backed chat logic — a faithful Python port of
supabase/functions/chat/index.ts, now running as a FastAPI route instead of
a Supabase Edge Function (Supabase Edge Functions only run Deno/TS/JS, so
moving this to Python meant moving off that host entirely).

STATUS: fully implemented, NOT yet reviewed. Do not point a deployed
instance of this at real users until the risk-detection logic below has
been reviewed by someone with clinical/crisis background — see
docs/RISK_DETECTION_SPEC.md for the spec this implements and its
"Known gaps" section for what a reviewer still needs to weigh in on.

Requires ANTHROPIC_API_KEY in the environment (e.g. via a local .env file
loaded with python-dotenv — see .env.example). Never commit a real key.

All persona/guardrail prompt text lives in prompts.py, shared with
gemini_backend.py — this file only does Anthropic's specific HTTP request
shape and response parsing. See prompts.py's docstring for why.
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

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
# Fast, cheap model for the classification passes; a stronger model for the
# conversational reply. Swap freely — nothing else here assumes a specific
# model name.
CLASSIFIER_MODEL = "claude-haiku-4-5-20251001"
REPLY_MODEL = "claude-sonnet-4-6"


async def assess_scope(message: str) -> str:
    """Fails OPEN (returns "in_scope") on any error — see prompts.py and
    docs/AGENT_GUARDRAILS_SPEC.md for why this is the opposite default
    from assess_risk() below."""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.post(
                ANTHROPIC_URL,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": ANTHROPIC_API_KEY or "",
                    "anthropic-version": ANTHROPIC_VERSION,
                },
                json={
                    "model": CLASSIFIER_MODEL,
                    "max_tokens": 40,
                    "temperature": 0,
                    "system": SCOPE_CLASSIFIER_PROMPT,
                    "messages": [{"role": "user", "content": f"Latest message to classify:\n{message}"}],
                },
            )

        if res.status_code != 200:
            return "in_scope"

        data = res.json()
        text = next((b.get("text", "") for b in data.get("content", []) if b.get("type") == "text"), "")
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
    if not ANTHROPIC_API_KEY:
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
                ANTHROPIC_URL,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": ANTHROPIC_VERSION,
                },
                json={
                    "model": CLASSIFIER_MODEL,
                    "max_tokens": 40,
                    "temperature": 0,
                    "system": RISK_CLASSIFIER_PROMPT,
                    "messages": [{"role": "user", "content": content}],
                },
            )

        if res.status_code != 200:
            return True  # fail closed

        data = res.json()
        text = next((b.get("text", "") for b in data.get("content", []) if b.get("type") == "text"), "")
        match = re.search(r"\{[^}]*\}", text)
        if not match:
            return True  # fail closed on unparseable output

        parsed = json.loads(match.group(0))
        return parsed.get("risk") is True
    except Exception:
        return True  # fail closed


async def send_to_guide_live(guide_id: str, lang: str, history: list[dict[str, Any]], message: str) -> dict:
    # Risk check happens BEFORE any conversational response is generated,
    # and the conversational persona never sees a flagged message.
    risk_flag = await assess_risk(message, history or [])
    if risk_flag:
        return {"reply": None, "risk_flag": True}

    # Scope check runs next: is this something the peer-support persona
    # should actually engage with? If not, return a fixed redirect instead
    # of letting the conversational model decide — the system prompt tells
    # the model to refuse these too, but a hardcoded response is a stronger
    # guarantee than trusting the model to hold the line under a clever or
    # persistent prompt. This also skips the (more expensive) reply-model
    # call entirely for out-of-scope messages.
    scope_category = await assess_scope(message)
    if scope_category != "in_scope":
        return {"reply": scope_redirect_message(scope_category, lang), "risk_flag": False}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(
                ANTHROPIC_URL,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": ANTHROPIC_API_KEY or "",
                    "anthropic-version": ANTHROPIC_VERSION,
                },
                json={
                    "model": REPLY_MODEL,
                    "max_tokens": 300,
                    "system": system_prompt(guide_id, lang or "en"),
                    "messages": [*(history or []), {"role": "user", "content": message}],
                },
            )
    except Exception:
        # Fail closed here too: an upstream error becomes a safe escalation
        # screen, not a silently dropped message or a broken chat state.
        return {"reply": None, "risk_flag": True}

    if res.status_code != 200:
        return {"reply": None, "risk_flag": True}

    data = res.json()
    reply = next((b.get("text", "") for b in data.get("content", []) if b.get("type") == "text"), "")
    return {"reply": reply, "risk_flag": False}
