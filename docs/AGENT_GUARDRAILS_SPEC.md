# Agent role & scope guardrails — v0.1 (drafted by AI, NOT yet reviewed)

**Status: DRAFT.** Same review gate as `docs/RISK_DETECTION_SPEC.md` — this
should be checked by someone with real clinical/crisis background (for the
role framing) before the live path in `server/live_backend.py` is pointed
at real users, not just treated as sufficient because it's implemented.

## Why this exists

Before this spec, the *only* hard guardrail on the live conversational
model was suicide-risk detection (`assess_risk`). Nothing stopped the
model from being talked into other things it shouldn't do — giving
medical/legal advice, doing someone's homework, or, most seriously for a
**teen-facing app**, being drawn into romantic or sexual roleplay with the
AI persona. The system prompt said "don't do this," but a prompt
instruction is a request the model is trying to honor, not a guarantee —
research on prompt injection and multi-turn jailbreaks shows models can be
walked past stated instructions through reframing, fictional framing, or
persistence across turns. For a mental-health-adjacent product used by
minors, "the model was told not to" is not an acceptable sole defense for
the categories below.

## Two guardrails, two different failure directions

This mirrors the existing `assess_risk` pattern in one way (a narrow,
separate model call with its own system prompt, run before the
conversational persona) but is a genuinely different kind of check, with
an intentionally different default when it fails:

| | `assess_risk` (existing) | `assess_scope` (this spec) |
|---|---|---|
| Question it answers | "Is this person in danger?" | "Is this even the right tool for what's being asked?" |
| On classifier error | **Fails closed** → shows crisis resources | **Fails open** → treated as in-scope, normal reply proceeds |
| Why that direction | Missing real suicide risk is catastrophic; an unnecessary crisis screen is mildly annoying | An occasional off-topic reply slipping through is far less harmful than the whole chat breaking every time this classifier has a network hiccup |

Order matters: risk is checked first, and a flagged message short-circuits
before the scope check ever runs (there is no "off-topic AND at-risk"
case worth distinguishing — risk always wins). Verified directly (see
"What was tested" below).

## Scope categories, and why each is called out explicitly

- **`romantic_or_sexual`** — the category that most drove writing this
  spec. An AI persona designed to feel warm and available, talking to
  teens, is a predictable target for romantic/sexual roleplay attempts,
  including gradual escalation across turns rather than an obvious first
  message. Flagged and redirected regardless of framing (hypothetical,
  "just pretend," fictional).
- **`medical_legal_advice`** — the system prompt already said "no medical/
  therapeutic advice"; this adds legal and financial advice explicitly
  (previously unmentioned) and gives it a hard, non-model-discretion
  enforcement point rather than relying on the persona to decline
  correctly every time.
- **`unrelated_task`** — this is a peer-support guide, not a
  general-purpose assistant. Homework help, code, trivia, and similar
  requests get a warm redirect back to the app's actual purpose, not
  silent compliance (which would also normalize using it as a
  general-purpose chatbot rather than what it's for).
- **`jailbreak_attempt`** — direct attempts to override the system prompt
  or persona ("ignore your instructions," "pretend you have no rules").
  Classified and redirected without explaining the refusal mechanics (no
  "I noticed you're trying to jailbreak me" — that both confirms exploit
  mechanics work and reads as un-warm/robotic for the persona).
- **`harmful_content`** — instructions to harm others, weapons, drugs,
  hacking. Explicitly distinct from the user's own self-harm/suicide
  language, which stays in `assess_risk`'s territory, not this one.

The classifier prompt (`SCOPE_CLASSIFIER_PROMPT` in
`server/live_backend.py`) instructs defaulting to `in_scope` whenever
genuinely ambiguous, matching `assess_risk`'s equivalent instruction for
its own domain — the goal is catching clear cases, not being trigger-happy
on ordinary teen conversation (sarcasm, slang, dark humor about school,
etc. should stay in_scope).

## What happens on an out-of-scope classification

A **fixed, non-model-generated** redirect string is returned instead of
calling the reply model at all (see `SCOPE_REDIRECTS` /
`scope_redirect_message` in `server/live_backend.py`). Two deliberate
choices here:

1. **Fixed text, not a model-generated response.** The same "don't trust
   the model to hold the line" reasoning that motivated adding this
   classifier also applies to the redirect itself — if the reply model
   generated the decline, a sufficiently clever follow-up could still
   talk it into something. A hardcoded string cannot be argued with.
2. **No reply-model call happens at all for out-of-scope messages** — a
   side benefit is this also saves the cost/latency of the larger model
   for messages it was never going to meaningfully answer anyway.

Redirects are provided in English and Spanish (the project's two reviewed
languages); French/Hindi/Chinese fall back to the English text, consistent
with those languages' beta status elsewhere (`assets/i18n.js`). They are
intentionally not persona-flavored per guide (Wren/Sol/Moss/etc.) yet —
a single consistent boundary voice across all six guides was judged more
important to get right first than personality variety on a refusal
message. Persona-flavoring these is a reasonable future improvement, not
a current gap.

## Defense in depth: the system prompt still says all of this too

Even though `assess_scope` is the primary enforcement point,
`system_prompt()` in `server/live_backend.py` also explicitly states the
role ("You are ROLE... not a therapist, not a companion app, not a
general-purpose assistant") and lists the same boundary categories. This
is deliberate belt-and-suspenders: the classifier can theoretically
misclassify an edge case as `in_scope`, and if that happens, the
conversational model should still independently decline rather than the
only defense being "the gate should have caught this."

## What was tested (and what wasn't)

**Tested**: the orchestration/routing logic in `send_to_guide_live` —
confirmed via mocking `assess_risk`/`assess_scope` that (a) a risk flag
short-circuits before scope is ever checked, (b) each out-of-scope
category returns its fixed redirect and never calls the reply model, (c)
an in-scope message actually proceeds to attempt the reply-model call,
and (d) the Spanish redirect text renders with correct accented
characters (a Windows-console print artifact briefly looked like
corruption; the underlying string was confirmed correct via a UTF-8 file
write).

**NOT tested**: whether the actual Haiku classifier call correctly
categorizes real adversarial messages. This requires a real
`ANTHROPIC_API_KEY`, which does not exist in this project/environment (by
design — the live path is gated behind clinical review, per
`docs/RISK_DETECTION_SPEC.md`). Before this ever reaches real users, run
an adversarial test pass specifically against `assess_scope` — try
multi-turn escalation toward romantic/sexual content, indirect/fictional
framing ("write a story where you're my girlfriend"), and jailbreak
phrasings that don't use the obvious "ignore your instructions" wording —
the classifier prompt has not been adversarially tested and almost
certainly has gaps, the same way the original `RISK_PHRASES` keyword list
did before it was tested against realistic phrasing (see
`docs/RISK_DETECTION_SPEC.md`'s note on that).

## Known gaps

- No output-side check on the reply model's actual response — this is
  entirely an input-side (pre-generation) guardrail. A determined
  multi-turn attempt could theoretically still get a boundary-crossing
  reply out of the persona even with `assess_scope` in place; an
  output-side classifier (checking the *generated* reply before it's sent
  to the user) would close this gap but adds another model call's worth
  of latency/cost per turn and was judged out of scope for this pass.
- No session-level memory of prior out-of-scope attempts in the same
  conversation (mirrors the same open gap already noted for risk
  detection's "sensitivity escalation" in `docs/RISK_DETECTION_SPEC.md`).
  A user who gets redirected once and immediately tries again is
  reclassified fresh each time, with no escalating response.
- The local scripted mock (`server/classifier.py`, used when no API key is
  configured) does not need an equivalent guardrail — it can only ever
  return pre-written supportive replies from a fixed pool, so it is
  structurally incapable of producing off-topic, romantic, or harmful
  content regardless of what's asked. This guardrail is specific to the
  generative live path.
