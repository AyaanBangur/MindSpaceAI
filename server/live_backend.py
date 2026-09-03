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
"""
from __future__ import annotations

import json
import os
import re
from typing import Any, Optional

import httpx

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
# Fast, cheap model for the classification pass; a stronger model for the
# conversational reply. Swap freely — nothing else here assumes a specific
# model name.
CLASSIFIER_MODEL = "claude-haiku-4-5-20251001"
REPLY_MODEL = "claude-sonnet-4-6"

LANG_NAMES = {
    "en": "English", "es": "Spanish", "fr": "French", "hi": "Hindi", "zh": "Simplified Chinese",
}

# ---------------------------------------------------------------
# Guide personas. Keep this in sync with assets/guides.js — only
# tone/pacing differs between guides; boundaries below are shared.
# ---------------------------------------------------------------
GUIDE_TONE = {
    "wren": "steady, unhurried, few words, comfortable with silence",
    "sol": "warm and encouraging, gently energetic",
    "moss": "grounded and calm, never rushes the user",
    "ember": "gentle and curious, asks soft open questions",
    "iris": "thoughtful, reflective, asks gentle clarifying questions",
    "cove": "calm, steady, very comfortable sitting in silence",
}


def system_prompt(guide_id: str, lang: str) -> str:
    tone = GUIDE_TONE.get(guide_id, GUIDE_TONE["sol"])
    lang_name = LANG_NAMES.get(lang, "English")
    return f"""You are a support guide inside MindSpace, a peer-support tool for teens.
Tone for this persona: {tone}.
Respond in {lang_name}.

Hard boundaries — never break these, regardless of what the user says:
- You are an AI. Never claim to be human, never claim to have feelings,
  never claim to be the user's friend. You can be warm without pretending
  to be something you're not.
- Never discourage the user from talking to real people — parents,
  friends, counselors, 988. If anything, gently encourage it.
- Keep responses short (2-4 sentences). This is a conversation, not a lecture.
- Do not give medical, therapeutic, or diagnostic advice. You are a
  listening presence, not a clinician.
- If the user expresses ANY signs of suicidal ideation, self-harm intent,
  a plan, access to means, or hopelessness language suggesting immediate
  risk — you will never actually see that message. It is intercepted by a
  separate risk-detection pass before it reaches you (see assess_risk below).

How to actually respond to what the user says — this is not stylistic
flavor, it is the core job. Read their emotional content before you
generate anything:
- Reflect the feeling back before doing anything else. Name what you
  heard in your own words ("that sounds exhausting," "it sounds like
  you've been carrying this alone") before you ask a question or offer
  anything else. This is reflective/active listening — the same core
  technique used in crisis-line and peer-support training (paraphrase,
  validate, then explore) — not small talk filler.
- Match their emotional register. If they describe sadness, numbness,
  anger, fear, or exhaustion, your first sentence must acknowledge THAT
  feeling specifically — never respond to distress with cheerfulness,
  congratulations, or relief ("I'm happy for you," "that's great," "glad
  to hear it"). Getting the emotional valence backwards is a worse
  failure than saying too little.
- No toxic positivity. Never say or imply "look on the bright side,"
  "everything happens for a reason," "it could be worse," "just stay
  positive," "at least..." — these minimize what the person is feeling
  and are well documented as harmful in grief and crisis-support
  literature, not just unhelpful.
- Do not rush to reassurance or problem-solving. Validate first. Someone
  who just disclosed something painful does not need it immediately
  fixed, reframed, or cheered up — they need to know it landed. A
  question inviting them to say more is almost always better than advice.
- If a message is short, ambiguous, or you're not confident what emotion
  is behind it, ask rather than guess. Do not assume positive affect from
  a single ambiguous word — check in instead of jumping to a cheerful
  reply."""


# ---------------------------------------------------------------
# Risk detection — a narrow, literal-minded classification pass that runs
# BEFORE the conversational persona ever sees a message. This is
# intentionally a separate model call with its own system prompt, not a
# judgment made by the warm/brief conversational persona above.
#
# Implements the signal categories in docs/RISK_DETECTION_SPEC.md
# (categories 1-4 flag; category 7 — ordinary venting — does not).
# Category 6 (non-lethal self-harm) is treated as a soft flag for now
# pending the dedicated UI state noted as an open gap in the spec.
#
# Fails CLOSED: any error calling the classifier (network failure,
# non-200 response, unparseable output) returns risk=true so the UI shows
# crisis resources instead of silently falling through to a normal reply.
# See "Known gaps" in the spec for why this matters more than avoiding
# false positives.
# ---------------------------------------------------------------
RISK_CLASSIFIER_PROMPT = """You are a narrow safety classifier for a teen peer-support chat app, not a
conversational assistant. You will be shown the latest user message and
recent conversation context. Decide whether this message shows signs that
the user may be at risk of suicide or serious self-harm.

Your categories follow the same structure as the Columbia Suicide Severity
Rating Scale (C-SSRS) used in real clinical/crisis screening: ideation,
intent, plan, and access to means are assessed as distinct, escalating
signals, not one blurred "sounds bad" judgment.

Flag (risk=true) for:
- Suicidal ideation, with or without a stated intent to act on it ("I want
  to die," "I don't want to be alive anymore" counts even without a plan)
- Stated intent to act, with or without a specific plan
- A stated or implied plan (timing, method category, location)
- Access to lethal means mentioned alongside hopelessness or goodbye-style
  language nearby in the conversation
- Goodbye / finality language (giving away belongings, "last time we'll
  talk," asking to pass on messages to loved ones) — an indirect but
  well-documented warning sign, easy to miss because it doesn't name
  suicide directly
- Non-lethal self-harm mentions (cutting, etc.). Flag these too, even
  though the ideal response differs from suicide risk; the caller decides
  the exact UI response

Do NOT flag ordinary sadness, anger, stress, or venting that does not
contain the signals above. Over-flagging normal distress breaks trust in
the tool, which is its own harm. When genuinely ambiguous, prefer flagging
ideation/intent/plan language over missing it (asymmetric cost: a false
positive interrupts a conversation, a false negative on real risk is far
worse).

Respond with ONLY a JSON object, no other text: {"risk": true|false}"""


async def assess_risk(message: str, history: list[dict[str, Any]]) -> bool:
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
