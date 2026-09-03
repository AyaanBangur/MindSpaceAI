# MindSpace

Anonymous, guide-style peer support for teens — built for the moments
*before* a crisis, not a replacement for one. Not therapy, not a crisis
line replacement; always points to 988/911 when it matters.

## Status

- **Frontend:** built. Home page with a 6-guide picker (animated 2D
  avatars, voice preview), about, resources, and the chat UI, all
  supporting 5 languages (English, Spanish, French, Hindi, Chinese) and
  browser-native multi-voice text-to-speech.
- **Language maturity:** English and Spanish have been reviewed by a
  fluent speaker. French, Hindi, and Chinese are machine-assisted
  translations, clearly labeled "beta" in the UI — see
  `assets/i18n.js`. Do not remove that label without a native-speaker
  review; machine-translated crisis language is a real safety risk, not
  a polish detail.
- **Backend:** fully implemented as a Python service (`server/`, FastAPI)
  — a two-pass design where every message is screened by a narrow risk
  classifier *before* it ever reaches the conversational persona, per
  `docs/RISK_DETECTION_SPEC.md`. **Not yet deployed to real users.** That
  spec has not been reviewed by anyone with clinical/crisis background,
  which is the gate for turning this on for anyone other than the
  developer and reviewers. Until then, the server runs a local scripted
  mock (`server/classifier.py`) whenever no `ANTHROPIC_API_KEY` is
  configured — fully demoable, no live model required, but you do need
  this server running (see "Running locally" below).
- **Conversations are not saved.** No accounts, no resume-later feature —
  each chat exists only in that browser tab, consistent with the
  anonymity promise throughout the site. (The one exception: an explicit,
  opt-in "save this chat" toggle in `chat.html` that stores a transcript
  in that browser's `localStorage` only — see `assets/history.js` and
  `history.html`. Nothing is ever sent to the backend to be stored.)

## Structure

```
index.html      home page + guide picker (6 guides, language + voice UI)
about.html      mission, what this is/isn't
resources.html  988, Crisis Text Line, how to help a friend
guides.html     the guide picker as its own page
history.html    locally-saved chat history (opt-in, browser-only)
chat.html       conversation UI (calls the Python backend; see server/)
assets/guides.js    shared guide roster (id/color/voice tuning/names/vibes)
assets/avatar.js    animated SVG avatar renderer (blink/talk/idle-bob)
assets/avatar.css   avatar animation styles
assets/i18n.js      shared UI language dictionary (en/es/fr/hi/zh)
assets/history.js   local-only (localStorage) opt-in chat history
assets/backend.js   thin chat client — POSTs every message to server/
assets/config.example.js   copy to assets/config.js (gitignored) to override the backend URL
server/main.py          FastAPI app — decides live vs. mock per request
server/classifier.py    local scripted mock (keyword classifier, risk-phrase net, reply pools)
server/live_backend.py  live Claude-backed path (risk classifier + conversational persona)
server/data/            mock reply pools / keyword lists / risk phrases, as JSON
docs/RISK_DETECTION_SPEC.md        risk-detection spec — DRAFT, unreviewed
mindspace_project_plan.md          original build plan
```

## Running locally

The frontend is still no-build — open `index.html` directly, or serve the
folder with any static server. But it now always talks to the Python
backend for chat (there's no more all-client-side fallback), so start
that first:

```
cd server
pip install -r requirements.txt
cp .env.example .env        # leave ANTHROPIC_API_KEY empty to run the mock
uvicorn main:app --reload --port 8787
```

With no `ANTHROPIC_API_KEY` set, `/chat` runs the local scripted mock —
safe for demos, no live model required. `chat.html` shows a note under the
composer if it can't reach the server at all, or if it's reachable but
running in mock mode.

## Before deploying the real backend to real users

1. `docs/RISK_DETECTION_SPEC.md` reviewed by someone with clinical/crisis
   background (a counselor, psych professor, or crisis-line volunteer
   trainer), and its "Known gaps" section addressed or explicitly
   accepted.
2. Adversarial test pass against `server/live_backend.py`'s classifier —
   vague distress, explicit risk language, sarcasm, and non-English risk
   language specifically (see the spec's note that non-English risk
   phrasing hasn't been tested).
3. Set a real `ANTHROPIC_API_KEY` in `server/.env` (or your host's secret
   manager — never in this repo) and deploy `server/` somewhere that can
   run a long-lived Python process (Render, Railway, Fly.io, a VM, etc.).
4. Copy `assets/config.example.js` to `assets/config.js` (gitignored) and
   set `BACKEND_URL` to that deployment's URL.
