# mindspace — build plan to September 1

**Today:** Aug 3, 2026 · **Deadline:** Sept 1, 2026 · **29 days**

## Read this part first

Three decisions this plan is built around. If you disagree with any of them, say so before you start building — they change the code, not just the copy.

1. **Guide, not friend.** The avatar is a calm, honest presence, not a simulated best friend. It never claims feelings, never discourages the user from talking to real people, and always stays visibly "a support tool," even while being warm. This is the single most important change from your original brief.
2. **Safety logic ships before personality polish.** Risk-detection and escalation to 988/911 get built in Week 1–2, not bolted on in Week 4. If you're short on time at the end, the thing that gets cut is a voice option or a language — never this.
3. **Scope is cut to fit 29 days, solo.** v1 = English + Spanish, browser-native voice (Web Speech API, free), 4 illustrated companion characters, one solid risk-detection pass reviewed by at least one adult with relevant background (counselor, psych professor, crisis-line volunteer trainer — doesn't have to be a licensed clinician to be useful, but it can't be just you). Multi-voice premium TTS, more languages, and a 3D avatar are v2, after Sept 1.

**Definition of done for Sept 1:** a working site (home, about, resources, check-in flow) where a user can pick a companion, have a supportive text conversation, hear a preview voice, switch language, and — critically — get correctly routed to 988/911 language if the conversation shows signs of risk. Not a finished company. A working, honest, safe v1.

---

## Week 1 (Aug 3–9): Safety foundations, not features

The instinct is to start with the fun part. Don't. This week has no visible UI progress and that's fine.

- **Mon Aug 3** — Write down, in plain language, what counts as a risk signal in a conversation (explicit intent, plans, means, hopelessness language, goodbye language). This becomes your spec, not your gut feel in the moment.
- **Tue Aug 4** — List every adult you can plausibly reach who has relevant background: campus counseling staff, a psych professor, a crisis-line volunteer coordinator, a school counselor you know. Draft a short outreach message asking for 30 minutes to review your risk-detection logic before launch. Send at least 3.
- **Wed Aug 5** — Draft the escalation behavior: exact wording the AI uses when risk signals appear, how 988/911 gets surfaced (not buried), what happens to the conversation after (does it end, does it stay open alongside the crisis info). Write it as a flowchart, not just prose.
- **Thu Aug 6** — Write the "what this is / isn't" language for the about page and the first-load disclaimer. Reuse and sharpen what's already live ("not therapy or medical treatment") rather than starting over.
- **Fri Aug 7** — Set up the repo structure and Supabase project (continuing your existing GH Pages + Supabase pattern). No feature code yet — just scaffolding, env vars, edge function skeleton for the chat endpoint.
- **Sat Aug 8** — Light day. Sketch the 4 companion characters on paper or in Figma: name, one-line "vibe," color. Keep them abstract/illustrated, not human faces.
- **Sun Aug 9** — Review week. If none of your outreach emails got a response, send 3 more. This can't quietly slip.

**Week 1 exit condition:** risk-detection spec written, escalation flow drafted, at least one advisor conversation scheduled or held.

## Week 2 (Aug 10–16): Core site + companion UI

- **Mon Aug 10** — Build home page shell: hero, persistent crisis bar, nav. (Starter code below.)
- **Tue Aug 11** — Build about page: mission, what this is/isn't, origin story, safety approach. (Starter code below.)
- **Wed Aug 12** — Build the companion selection UI: 4 characters, descriptions, voice preview via Web Speech API. (Included in home page code below.)
- **Thu Aug 13** — Build resources page: 988, Crisis Text Line, Trevor Project, campus counseling info, "if you're worried about a friend" section.
- **Fri Aug 14** — Language toggle (EN/ES) wired to a copy dictionary; get the Spanish copy reviewed by a fluent speaker, don't ship machine-translated crisis language unchecked.
- **Sat Aug 15** — Accessibility pass: keyboard navigation, screen reader labels, color contrast, reduced-motion support.
- **Sun Aug 16** — Mobile responsiveness pass. Most teens will hit this on a phone, not a laptop.

**Week 2 exit condition:** full static site navigable, companion picker functional, no chat intelligence yet.

## Week 3 (Aug 17–23): The actual chat + risk detection

- **Mon Aug 17** — Build the chat UI (message thread, input, companion avatar present but quiet — not performing).
- **Tue Aug 18** — Wire the chat to Claude API via your Supabase edge function. System prompt encodes the "guide not friend" boundaries explicitly: no claiming feelings, no discouraging real-world help, always aware of its own limits.
- **Wed Aug 19** — Implement the risk-detection logic from Week 1's spec. This is the most important engineering day of the whole project. Don't rush it into one evening.
- **Thu Aug 20** — Implement the escalation UI: what actually appears on screen when risk is detected, tested against your Week 1 flowchart exactly.
- **Fri Aug 21** — Voice: hook Web Speech API to companion responses, respecting the per-companion pitch/rate you set. Add a mute toggle — sound-on-load is a bad default for a support tool.
- **Sat Aug 22** — Write 15–20 adversarial test conversations yourself (vague distress, explicit risk language, sarcasm, testing the boundaries) and run them through. Fix what breaks.
- **Sun Aug 23** — Send your risk-detection implementation (not just the spec) to whichever advisor responded in Week 1. This review has to happen before other people use it, including friends testing it for you.

**Week 3 exit condition:** end-to-end chat works, escalation triggers correctly on your test set, at least one outside review of the risk logic has happened or is scheduled before any wider testing.

## Week 4 (Aug 24–30): Testing, not new features

- **Mon Aug 24** — Fix whatever your advisor review flagged. This can reshuffle the rest of the week — leave room for it.
- **Tue Aug 25** — Small, controlled test group (a handful of people you trust, told explicitly they're testing a prototype, not in crisis themselves). Do not soft-launch this publicly to strangers yet.
- **Wed Aug 26** — Bug fixes from testing.
- **Thu Aug 27** — Performance pass: load time, mobile data usage, error states (what happens if the API call fails — it can't fail silently or leave someone stuck mid-conversation).
- **Fri Aug 28** — Copy polish across the whole site with fresh eyes.
- **Sat Aug 29** — Buffer day. Something in the above will have run over — use it here.
- **Sun Aug 30** — Final QA pass on every page, every link, every disclaimer.

## Aug 31–Sept 1: Ship

- **Mon Aug 31** — Deploy, verify production environment matches what you tested, write the short project writeup for your portfolio/application (origin story, the safety decisions you made and why — this is genuinely a strong narrative for what you're using this for).
- **Tue Sept 1** — Done.

---

## What's explicitly out of scope for v1 (and why)

- **More than 2 languages** — machine-translated crisis language is a real risk; each additional language needs a fluent human review, which takes time you don't have.
- **Premium/multi-provider TTS** — Web Speech API is free and good enough; ElevenLabs-style voices are a nice v2 upgrade, not a v1 requirement.
- **3D or hyper-realistic avatars** — illustrated/abstract reads as calmer for this context and is dramatically faster to build well.
- **Public launch beyond a small trusted test group** — this ships when you and your advisor both think the risk logic is solid, not on a fixed calendar date, even if that's a few days after Sept 1.

## Open item that isn't a coding task

You need at least one real conversation with someone who has relevant background before this goes in front of strangers. If Week 1's outreach doesn't land, that's the thing to escalate to me — I can help you think through who else to ask or how to frame the request, but I can't substitute for it.
