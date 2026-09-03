"""Local scripted mock chat logic — a faithful Python port of the original
assets/backend.js + assets/i18n.js mock-classification logic.

This is a scripted demo stand-in, not a real conversational engine (that's
live_backend.py, gated behind clinical review per docs/RISK_DETECTION_SPEC.md).
It runs whenever ANTHROPIC_API_KEY is not configured, so the app is fully
demoable with nothing deployed.
"""
from __future__ import annotations

import json
import random
import re
import unicodedata
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent / "data"

with open(DATA_DIR / "mock_replies.json", encoding="utf-8") as f:
    MOCK_REPLIES = json.load(f)
with open(DATA_DIR / "mock_keywords.json", encoding="utf-8") as f:
    MOCK_KEYWORDS = json.load(f)
with open(DATA_DIR / "risk_phrases.json", encoding="utf-8") as f:
    RISK_PHRASES = json.load(f)
with open(DATA_DIR / "negations.json", encoding="utf-8") as f:
    NEGATIONS = json.load(f)

# Tracks the last reply given, across the whole process — matches the
# original JS's module-level `lastMockReply`, which was likewise shared
# across guides/conversations rather than per-session. Kept faithful to
# the original rather than "improved," since this is a straight port.
_last_mock_reply: Optional[str] = None


def _is_letter(ch: str) -> bool:
    return unicodedata.category(ch).startswith("L") or ch in ("'", "’")


def tokenize(text: str) -> list[str]:
    """Unicode-aware word split — mirrors JS's text.split(/[^\\p{L}'’]+/u)."""
    tokens: list[str] = []
    current = []
    for ch in text:
        if _is_letter(ch):
            current.append(ch)
        else:
            if current:
                tokens.append("".join(current))
                current = []
    if current:
        tokens.append("".join(current))
    return tokens


def matches_keyword(text: str, tokens: list[str], phrase: str, lang: str) -> bool:
    """Multi-word phrases and Chinese (no spaces between words) stay a plain
    substring check; single words elsewhere require an exact whole-token
    match, so e.g. "ok" doesn't match inside "broke" or "hi" inside "this"."""
    if lang == "zh" or " " in phrase:
        return phrase in text
    return phrase in tokens


def is_negated(text: str, match_index: int, lang: str) -> bool:
    neg_words = NEGATIONS.get(lang, NEGATIONS["en"])
    window_start = max(0, match_index - 18)
    before = text[window_start:match_index]
    return any(neg in before for neg in neg_words)


def detects_mock_risk(message: str, lang: str) -> bool:
    """Keyword/phrase net covering the signal categories in
    docs/RISK_DETECTION_SPEC.md — explicit intent (with or without a plan),
    access-to-means + distress, and goodbye/finality language. Deliberately
    over-inclusive per the spec's stated asymmetric cost. This is still a
    phrase match, not real language understanding — it cannot replace the
    live, reviewed backend, only avoid leaving zero net when no backend
    (or no API key) is configured."""
    text = message.strip().lower()
    if not text:
        return False
    phrases = RISK_PHRASES.get(lang, RISK_PHRASES["en"])
    return any(p in text for p in phrases)


def classify_mock(message: str, lang: str) -> str:
    kw = MOCK_KEYWORDS.get(lang, MOCK_KEYWORDS["en"])
    text = message.strip().lower()
    if not text:
        return "default"

    tokens = tokenize(text)

    def hits(list_key: str) -> bool:
        return any(matches_keyword(text, tokens, w, lang) for w in kw.get(list_key, []))

    if hits("greeting") and len(text.split()) <= 4:
        return "greeting"
    if hits("gratitude"):
        return "gratitude"
    if hits("feeling_bad"):
        return "feeling_bad"
    # Checked before feeling_good: an explicit request like "any tips for
    # feeling better?" contains a feeling_good word ("better") but is
    # clearly asking for help, not reporting a positive mood.
    if hits("coping_request"):
        return "coping_request"
    if hits("help_request"):
        return "help_request"

    negated_good = False
    for w in kw.get("feeling_good", []):
        if not matches_keyword(text, tokens, w, lang):
            continue
        idx = text.find(w)
        if idx != -1 and is_negated(text, idx, lang):
            negated_good = True
            break
    if negated_good:
        return "feeling_bad"
    if hits("feeling_good"):
        return "feeling_good"

    if text.endswith("?"):
        return "question"
    if len(text.split()) <= 2:
        return "short"
    return "default"


def get_reply_pool(lang: str, guide_id: str, category: str) -> list[str]:
    """mock_replies is keyed [lang][guideId][category] for languages with
    persona-specific pools (en, es); languages with only a single shared
    voice so far use a `_shared` bucket instead. Falls back
    guideId -> _shared -> en.sol so every guide/lang combination works even
    before every persona has been written for every language."""
    by_lang = MOCK_REPLIES.get(lang, MOCK_REPLIES["en"])
    guide_data = by_lang.get(guide_id) or by_lang.get("_shared") or MOCK_REPLIES["en"]["sol"]
    return guide_data.get(category) or guide_data["default"]


def send_to_guide_mock(guide_id: str, lang: str, message: str) -> dict:
    global _last_mock_reply

    if message.strip().upper() == "TESTESCALATION" or detects_mock_risk(message, lang):
        return {"reply": None, "risk_flag": True}

    category = classify_mock(message, lang)
    pool = get_reply_pool(lang, guide_id, category)
    choices = pool
    if len(pool) > 1 and _last_mock_reply in pool:
        choices = [r for r in pool if r != _last_mock_reply]
    reply = random.choice(choices)
    _last_mock_reply = reply
    return {"reply": reply, "risk_flag": False}
