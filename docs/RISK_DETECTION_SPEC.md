# Risk detection spec — v0.1 (drafted by AI, NOT yet reviewed)

**Status: DRAFT. Do not treat this as sufficient on its own.** This document
is a starting point so the engineering work has something concrete to build
against. Per the project plan, it must be reviewed by someone with real
clinical/crisis background (a counselor, psych professor, or crisis-line
volunteer trainer) before `assessRisk()` is allowed to gate real
conversations with real users. Nothing in this repo should be treated as
"launched" until that review has happened and its feedback is incorporated.

This document covers *risk* detection specifically (is the user in
danger). For the separate guardrail covering agent role/scope — what the
persona should and shouldn't engage with at all (medical/legal advice,
romantic/sexual roleplay, off-topic tasks, jailbreak attempts) — see
`docs/AGENT_GUARDRAILS_SPEC.md`.

## Why a separate pass, not the conversational model

The conversational persona (Wren/Sol/Moss/Ember) is tuned for warmth and
brevity. Warmth and brevity are the wrong properties for a safety classifier
— they encourage hedging, missing signals to stay "gentle," or false
reassurance. So risk detection runs as its own narrow, literal-minded pass
**before** any user message reaches the conversational persona. If risk is
flagged, the persona never generates a reply to that message at all — the
UI shows the escalation state instead (see `chat.html`'s `showEscalation()`).

## Signal categories (highest to lowest severity)

1. **Explicit intent + plan + means** — "I'm going to kill myself tonight
   with [specific method]." Immediate, unambiguous. Always flags.
2. **Explicit intent, no stated plan** — "I want to kill myself" / "I don't
   want to be alive anymore" / "I want to end it." Always flags, even
   without a plan.
3. **Access to lethal means mentioned in a distress context** — mentions of
   pills, a weapon, a specific location/height, etc., combined with any
   hopelessness or goodbye framing nearby in the conversation. Flags.
4. **Goodbye / finality language** — "tell my family I love them," "you
   won't have to deal with me anymore," giving away possessions, "this is
   the last time we'll talk." Flags — this category is easy to miss because
   it's indirect, and it's one of the most reliable real-world signals.
5. **Hopelessness + burdenhood language without explicit intent** — "everyone
   would be better off without me," "there's no point anymore," "nothing is
   ever going to get better." Does not auto-flag on a single instance, but
   escalates the *sensitivity* of the classifier for the rest of that
   session (lower threshold for categories 2-4 for the remainder of the
   conversation).
6. **Self-harm (non-lethal) mentions** — cutting, other self-injury without
   suicidal intent. Does not trigger the 988/911 escalation screen (wrong
   resource), but should trigger a *softer* redirect to the Crisis Text Line
   and to talking to a trusted adult — this needs its own UI state, not
   reused from the suicide-risk escalation. **Open item, not yet
   implemented in chat.html — flag this to the reviewer explicitly.**
7. **Ambiguous distress** — venting, sadness, anger, "I hate my life" without
   1-5. Does not flag. This is the normal operating range of the tool and
   over-flagging here breaks trust and pushes users away from using it at
   all, which is its own harm.

## False positive / false negative tradeoff

This tool is explicitly designed to err toward **over-flagging category
2-4 language and under-flagging category 7**. A false positive costs a user
an interrupted conversation and a redirect to 988 — mildly annoying, not
harmful. A false negative on category 1-4 language is the failure mode that
matters most. Any tuning pass should be judged against that asymmetry, not
against minimizing false positives.

## What "flags" actually does (current implementation)

- The risk-classification call runs on every user message, before the
  conversational reply is generated.
- If it returns `risk: true`, the backend returns `{ reply: null,
  risk_flag: true }` and the conversational persona is never invoked for
  that turn.
- The frontend (`chat.html`) shows the escalation panel: acknowledges the
  message came through heavy, states plainly that the AI can't provide the
  help a person can right now, and surfaces 988 (call/text) and Crisis Text
  Line (741741) as the two primary actions — not buried, not secondary to
  "continue chatting."
- The conversation thread stays visible above the escalation panel (does
  not clear/reset) so the user doesn't feel erased or punished for what
  they said.
- After an escalation, the composer stays available — the user is not
  locked out — but the system prompt for the *next* message should carry a
  note that this session already had a flagged turn, per the "escalates
  sensitivity for rest of session" rule above. **Open item: this session
  memory is not yet threaded through in the current backend — see
  `server/live_backend.py`.**

## Escalation copy (EN)

> It sounds like you're in a lot of pain right now, and maybe even thinking
> about ending your life.
> That doesn't mean something is wrong with you. It means the pain got
> bigger than what feels possible to carry alone right now. I can't help
> you think through safety the way a trained person can, but 988 and
> Crisis Text Line counselors are trained for exactly this moment, and
> they're available right now.
> If you can, try to be near another person right now, even just in the
> same room, and away from anything you could use to hurt yourself.
> [Call 988 now] [Text HOME to 741741] [In immediate danger? Call 911]
> I'm still here. This conversation isn't going anywhere, and you can
> always come back to it, no matter what you say.

### Clinical grounding for this copy

This wording was drafted against several well-established, publicly
documented frameworks — named here explicitly so a real reviewer can check
each claim rather than trusting an AI's paraphrase of it:

- **Direct language, not euphemism.** The panel names "ending your life"
  rather than "things feeling heavy." This follows the Columbia Protocol
  (C-SSRS) practice of asking about suicide directly and literally, and the
  finding (e.g. Dazzi et al., 2014, *Psychological Medicine* — "Does asking
  about suicide and related behaviours induce suicidal ideation?") that
  direct questions about suicide do not increase risk. `resources.html`
  already made this same claim in its "help a friend" section; this
  extends the same principle to the AI's own crisis copy instead of only
  advising it for humans.
- **Validate the pain, not the act.** "That doesn't mean something is
  wrong with you" reflects the core-conditions approach from person-centered
  practice (unconditional positive regard, non-judgment) combined with
  Thomas Joiner's Interpersonal Theory of Suicide framing of
  hopelessness/burdensomeness language as pain rather than pathology —
  without endorsing or normalizing the act itself.
- **A generic environmental-safety nudge, not means-specific questioning.**
  "Be near another person... away from anything you could use to hurt
  yourself" gestures at means restriction — one of the most consistently
  evidence-backed suicide-prevention interventions in the public-health
  literature (see Harvard T.H. Chan School of Public Health's "Means
  Matter" project) — without asking the user what method they're
  considering. Asking for method specifics is a clinical/safety-planning
  action that belongs to a trained human, not this tool; see "Known gaps."
- **Non-abandonment.** The closing line ("I'm still here... you can always
  come back") reflects crisis-line training's emphasis on never ending
  contact abruptly with someone at risk. It does not imply the AI will
  continue the crisis conversation itself — it only signals the user isn't
  being cut off or punished for what they said, matching the "conversation
  thread stays visible" behavior below.
- **911 added as a distinct, higher tier.** 988/Crisis Text Line are for
  support and safety planning; 911 is for imminent physical danger. Keeping
  them visually distinct (911 as a ghost/secondary action, not styled the
  same as the primary two) mirrors how 988's own public messaging
  distinguishes the two.

None of the above qualifies as this tool performing therapy or a safety
plan itself — it performs the same first ~30 seconds a trained crisis
responder would (acknowledge directly, validate, one safety nudge, warm
handoff to a human), then gets out of the way. Full safety planning
(Stanley & Brown's Safety Planning Intervention — warning signs, coping
strategies, contacts, reasons for living, means restriction in detail)
is explicitly NOT attempted here; that requires a trained human and is the
job of 988/Crisis Text Line, not this panel. **This section is itself a
draft grounded in publicly known frameworks, not a substitute for the
clinical review this whole spec is gated behind — a reviewer should verify
each citation above before this copy reaches real users.**

## Known gaps / things a real reviewer needs to weigh in on

- No handling yet for a user reporting risk **about someone else** ("my
  friend told me they want to kill themselves") — this needs different
  language (can't call 988 on their behalf without their consent in most
  cases; needs "how to help a friend" framing, which partially exists on
  `resources.html` but isn't linked from an escalation triggered this way).
- No handling for self-harm-without-suicidal-intent as its own category
  (see #6 above).
- No plan yet for what happens if the classifier call itself fails (network
  error, API down) — right now that would likely surface as a generic
  error, not a safe default. **This should fail closed toward showing
  crisis resources, never fail silently into a normal chat reply.**
- Sensitivity-escalation-within-a-session (category 5) is specified here
  but not yet implemented in code.
- Non-English risk language: the classifier prompt in
  `server/live_backend.py` is written to reason in whatever language the
  user writes in, but it has not been tested against Spanish (or other
  language) risk language specifically, and idioms for hopelessness/
  goodbye framing don't always translate literally. This is a concrete
  thing to test adversarially before trusting it in a non-English
  conversation.
- **The local demo's keyword net (`detects_mock_risk` in
  `server/classifier.py`) is fundamentally limited and this was confirmed
  directly**: an initial
  version was tested against 15 realistic phrasings of suicidal ideation,
  intent, a plan, or access to means, and missed 11 of them — it only
  caught messages containing the literal words "kill myself." Common real
  phrasings like "I've been thinking about ending things," "life isn't
  worth living," "what's the point of living," and explicit method
  mentions (jumping, hanging, firearms, stockpiling pills) were completely
  absent from the list and went undetected, producing a normal
  conversational reply instead of the crisis panel. The list has since been
  substantially expanded (contraction variants, indirect phrasing, method
  mentions, Spanish reflexive-verb word-order variants), but **this remains
  a hardcoded phrase list, not language understanding** — it will always
  miss phrasings not anticipated by whoever wrote the list, which is a
  categorically different (weaker) guarantee than the live Claude-based
  `assessRisk()` above, which understands paraphrase and context. Nothing
  should be inferred about the live backend's reliability from the local
  demo's keyword coverage, and the demo net should never be treated as a
  substitute for shipping the reviewed live backend.
