# MindSpace chat backend (Python)

Replaces the previous two-piece backend — `assets/backend.js`'s in-browser
mock plus a Supabase/Deno edge function — with a single Python service.
The frontend (`assets/backend.js`) now POSTs every chat message here; this
process decides whether to run the local scripted mock or the live
Claude-backed path.

## Run it

```
cd server
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8787
```

Leave `ANTHROPIC_API_KEY` empty in `.env` to run the local scripted mock —
no live model, safe for demos and UI work. Fill it in to run the real
Claude-backed path (see the "Before deploying" section in the root
`README.md` first — that path is gated behind clinical review of
`docs/RISK_DETECTION_SPEC.md`).

The site itself (`index.html` etc.) doesn't need a build step — open it
directly or serve it with any static file server — but `chat.html` won't
be able to talk to a guide until this server is running.

## Files

- `main.py` — the FastAPI app. One route, `POST /chat`, plus `GET /health`
  (used by `chat.html` to tell the user whether the backend is reachable
  and whether it's running live or mock).
- `classifier.py` — the local scripted mock: keyword-based category
  classification, the risk-phrase safety net, and reply-pool selection.
  A faithful port of the original `assets/backend.js` + the
  `mock_replies`/`mock_keywords` data that used to live in `assets/i18n.js`.
- `live_backend.py` — the live path: a narrow Haiku-based risk classifier
  that runs before anything else, then a Sonnet-based conversational
  reply if nothing was flagged. A faithful port of the original
  `supabase/functions/chat/index.ts`.
- `data/*.json` — the mock backend's content (per-guide reply pools,
  keyword lists, risk phrases, negation words), extracted programmatically
  from the original JS source so the port didn't risk a transcription typo
  in the safety-critical risk-phrase list.

## API

`POST /chat`
```json
{ "guideId": "sol", "lang": "en", "history": [{"role": "user", "content": "..."}], "message": "..." }
```
→
```json
{ "reply": "string or null", "risk_flag": false }
```

`reply` is `null` exactly when `risk_flag` is `true` — the frontend shows
the crisis escalation panel instead of a normal message in that case.

`GET /health` → `{ "status": "ok", "live": true|false }` — `live` reflects
whether `ANTHROPIC_API_KEY` is currently configured.
