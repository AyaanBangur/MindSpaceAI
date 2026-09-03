// MindSpace — local backend config.
//
// Copy this file to assets/config.js (gitignored — never commit real
// values) to point the site at a Python chat backend running somewhere
// other than the default. Leaving this file absent (or BACKEND_URL empty)
// falls back to http://localhost:8787, which is what `uvicorn main:app
// --port 8787` inside server/ listens on by default.
//
// The backend itself decides mock vs. live: run it with no
// ANTHROPIC_API_KEY set (server/.env) for the local scripted mock — safe
// for demos and UI work — or with a real key once the risk-detection
// logic has been reviewed per docs/RISK_DETECTION_SPEC.md.
window.MINDSPACE_CONFIG = {
  BACKEND_URL: '', // e.g. 'http://localhost:8787' or a deployed URL
};
