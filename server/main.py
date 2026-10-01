"""MindSpace — chat backend (Python/FastAPI).

Replaces the previous two-piece backend (assets/backend.js's client-side
mock + supabase/functions/chat/index.ts's Deno edge function) with a single
Python service. The frontend (assets/backend.js) now just POSTs every
message here; this process decides which of three paths handles it: the
local scripted mock, live Gemini, or live Claude — that decision used to
be split between the browser (mock) and Supabase (live), and now lives in
one place, in active_provider() below.

Run locally:
    cd server
    pip install -r requirements.txt
    cp .env.example .env          # then fill in GEMINI_API_KEY and/or
                                   # ANTHROPIC_API_KEY if you have one —
                                   # leave both unset to run the mock,
                                   # exactly like before
    uvicorn main:app --reload --port 8787

The site (served via .claude/launch.json's mindspace-static config, or any
static file server) then just needs this running alongside it.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv(Path(__file__).parent / ".env")

import classifier
import gemini_backend
import live_backend

app = FastAPI(title="MindSpace chat backend")

# Local dev only: the static site can be opened via file://, a plain
# `python -m http.server`, or any port, so allow_origins is left wide open
# rather than pinned to one dev port. Tighten this before any real
# deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    guideId: str
    lang: str = "en"
    history: list[dict[str, Any]] = []
    message: str


class ChatResponse(BaseModel):
    reply: Optional[str]
    risk_flag: bool


def active_provider() -> str:
    """Gemini takes priority when both keys happen to be set — this was a
    deliberate choice, not an accident, when Gemini support was added: the
    person configuring this server gets what they most recently asked for
    without needing a separate explicit provider switch. If you want
    Anthropic instead while a Gemini key is also present, unset
    GEMINI_API_KEY rather than relying on ordering."""
    if gemini_backend.GEMINI_API_KEY:
        return "gemini"
    if live_backend.ANTHROPIC_API_KEY:
        return "anthropic"
    return "mock"


@app.get("/health")
def health():
    provider = active_provider()
    return {"status": "ok", "live": provider != "mock", "provider": provider}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message or not req.message.strip():
        return ChatResponse(reply=None, risk_flag=False)

    provider = active_provider()
    if provider == "gemini":
        result = await gemini_backend.send_to_guide_gemini(req.guideId, req.lang, req.history, req.message)
    elif provider == "anthropic":
        result = await live_backend.send_to_guide_live(req.guideId, req.lang, req.history, req.message)
    else:
        result = classifier.send_to_guide_mock(req.guideId, req.lang, req.message)

    return ChatResponse(**result)
