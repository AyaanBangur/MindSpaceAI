// MindSpace — local backend config.
//
// Copy this file to assets/config.js (gitignored — never commit real
// values) and fill in your Supabase project's public values once the chat
// edge function has been deployed AND the risk-detection logic has been
// reviewed per docs/RISK_DETECTION_SPEC.md. The anon key is safe to expose
// client-side (it's what Supabase's client libraries are designed for) —
// the real secret (ANTHROPIC_API_KEY) lives only in Supabase project
// secrets and is never referenced from this repo.
//
// Leaving SUPABASE_URL empty (the default) keeps the site running on the
// local scripted mock backend — safe for demos, portfolio review, and UI
// development without touching a real AI backend at all.
window.MINDSPACE_CONFIG = {
  SUPABASE_URL: '',       // e.g. 'https://xxxxxxxx.supabase.co'
  SUPABASE_ANON_KEY: '',  // Supabase project's public anon key
};
