// Supabase Edge Function — mindspace chat backend
//
// STATUS: template only. Not deployed, not wired to the frontend yet.
// Do not deploy this until:
//   1. The risk-detection spec (Week 1 task) is written and reviewed
//      by someone with clinical/crisis background.
//   2. ANTHROPIC_API_KEY and any other secrets are set as Supabase
//      project secrets (Project Settings → Edge Functions → Secrets),
//      never committed to this repo.
//
// Deploy with the Supabase CLI: `supabase functions deploy chat`
// Call from chat.html with:
//   fetch(`${SUPABASE_URL}/functions/v1/chat`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
//     body: JSON.stringify({ guideId, lang, history, message })
//   })

// deno-lint-ignore-file
// @ts-ignore — Deno global exists in the Supabase Edge Functions runtime
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

// ---------------------------------------------------------------
// Guide personas. Keep this in sync with the guide list in the
// frontend (index.html / chat.html). Boundaries are shared across
// all guides — only tone/pacing differs.
// ---------------------------------------------------------------
const GUIDE_TONE: Record<string, string> = {
  wren: "steady, unhurried, few words, comfortable with silence",
  sol: "warm and encouraging, gently energetic",
  moss: "grounded and calm, never rushes the user",
  ember: "gentle and curious, asks soft open questions",
};

function systemPrompt(guideId: string, lang: string): string {
  const tone = GUIDE_TONE[guideId] || GUIDE_TONE.sol;
  return `
You are a support guide inside mindspace, a peer-support tool for teens.
Tone for this persona: ${tone}.
Respond in ${lang === "es" ? "Spanish" : "English"}.

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
  risk — do not attempt to handle this yourself. That is handled by a
  separate risk-detection pass, not by you improvising a response.
`.trim();
}

// ---------------------------------------------------------------
// PLACEHOLDER — risk detection.
// This is intentionally NOT implemented yet. It returns false always.
// This is the single most important piece of this entire codebase and
// must be built from the reviewed Week 1 spec, not improvised here.
// Likely shape once built: a fast classification pass (either a
// dedicated Claude call with a narrow prompt, or a lighter classifier)
// that runs on every user message BEFORE the conversational reply is
// generated, so a flagged message never reaches the "chat" persona at all.
// ---------------------------------------------------------------
async function assessRisk(_message: string, _history: unknown[]): Promise<boolean> {
  // TODO(Week 3, after advisor review): replace with real detection.
  return false;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { guideId, lang, history, message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
    }

    // Risk check happens BEFORE any conversational response is generated.
    const risk_flag = await assessRisk(message, history ?? []);
    if (risk_flag) {
      return new Response(JSON.stringify({ reply: null, risk_flag: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const anthropicRes = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: systemPrompt(guideId, lang || "en"),
        messages: [
          ...(Array.isArray(history) ? history : []),
          { role: "user", content: message },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Anthropic API error:", errText);
      return new Response(JSON.stringify({ error: "Upstream error" }), { status: 502 });
    }

    const data = await anthropicRes.json();
    const reply = data.content?.find((b: any) => b.type === "text")?.text ?? "";

    return new Response(JSON.stringify({ reply, risk_flag: false }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chat function error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
});
