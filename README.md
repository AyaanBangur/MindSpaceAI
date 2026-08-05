# mindspace

Anonymous, guide-style peer support for teens — built for the moments *before*
a crisis, not a replacement for one. Not therapy, not a crisis line
replacement; always points to 988/911 when it matters.

## Status
Front-end (home, about, resources, chat UI) is built. The chat UI currently
uses scripted mock responses — it is **not** connected to a real AI backend
yet. That connection is gated on the risk-detection spec being written and
reviewed by someone with clinical/crisis background (see
`docs/mindspace_project_plan.md`).

## Structure
```
index.html      home page + guide picker
about.html      mission, what this is/isn't
resources.html  988, Crisis Text Line, how to help a friend
chat.html       conversation UI (mock responses for now)
supabase/functions/chat/index.ts   backend template, not yet deployed
docs/mindspace_project_plan.md     full build plan
```

## Running locally
No build step — open `index.html` directly in a browser, or serve the
folder with any static server (e.g. the VS Code "Live Server" extension).

## Before deploying the real backend
1. Risk-detection spec written and reviewed.
2. Supabase project created, `ANTHROPIC_API_KEY` set as a project secret
   (never in this repo).
3. `supabase functions deploy chat`, then wire `chat.html`'s `sendToGuide()`
   to call it.
