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
- **Backend:** fully implemented (`supabase/functions/chat/index.ts`) —
  a two-pass design where every message is screened by a narrow risk
  classifier *before* it ever reaches the conversational persona, per
  `docs/RISK_DETECTION_SPEC.md`. **Not yet deployed to real users.**
  That spec has not been reviewed by anyone with clinical/crisis
  background, which is the gate for turning this on for anyone other
  than the developer and reviewers. Until then, `chat.html` runs on a
  local scripted mock (`assets/backend.js`) — fully demoable, no API
  key or backend required.
- **Conversations are not saved.** No accounts, no resume-later feature —
  each chat exists only in that browser tab, consistent with the
  anonymity promise throughout the site.

## Structure

```
index.html      home page + guide picker (6 guides, language + voice UI)
about.html      mission, what this is/isn't
resources.html  988, Crisis Text Line, how to help a friend
chat.html       conversation UI (local mock by default; see assets/backend.js)
assets/guides.js    shared guide roster (id/color/voice tuning/names/vibes)
assets/avatar.js    animated SVG avatar renderer (blink/talk/idle-bob)
assets/avatar.css   avatar animation styles
assets/i18n.js      shared language dictionary (en/es/fr/hi/zh)
assets/backend.js   chat client: real Supabase call if configured, else mock
assets/config.example.js   copy to assets/config.js (gitignored) to go live
supabase/functions/chat/index.ts   real two-pass backend, not yet deployed
docs/RISK_DETECTION_SPEC.md        risk-detection spec — DRAFT, unreviewed
mindspace_project_plan.md          original build plan
```

## Running locally

No build step — open `index.html` directly in a browser, or serve the
folder with any static server (e.g. the VS Code "Live Server" extension).
Works fully offline/without any API key: chat runs on the local mock
backend until `assets/config.js` points at a deployed Supabase project.

## Before deploying the real backend to real users

1. `docs/RISK_DETECTION_SPEC.md` reviewed by someone with clinical/crisis
   background (a counselor, psych professor, or crisis-line volunteer
   trainer), and its "Known gaps" section addressed or explicitly
   accepted.
2. Adversarial test pass against `supabase/functions/chat/index.ts`'s
   classifier — vague distress, explicit risk language, sarcasm, and
   non-English risk language specifically (see the spec's note that
   non-English risk phrasing hasn't been tested).
3. Supabase project created, `ANTHROPIC_API_KEY` set as a project secret
   (never in this repo).
4. `supabase functions deploy chat`, then copy
   `assets/config.example.js` to `assets/config.js` (gitignored) and
   fill in the deployed project's `SUPABASE_URL` / `SUPABASE_ANON_KEY`.
