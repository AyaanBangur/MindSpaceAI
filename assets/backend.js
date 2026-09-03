// MindSpace — chat backend client.
//
// The entire chat backend — the local scripted mock (keyword classifier,
// risk-phrase detection, reply pools) AND the live Claude-backed path —
// now lives in Python (server/), not here. This file's only job is to
// POST each message to that server and return its response. See
// server/README.md (or the root README) for how to run it.
//
// Both paths resolve the same shape: { reply: string|null, risk_flag: bool }
(function () {
  const cfg = window.MINDSPACE_CONFIG || {};
  const BACKEND_URL = cfg.BACKEND_URL || 'http://localhost:8787';

  async function sendToGuide(guideId, lang, history, message) {
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideId, lang, history, message }),
      });
      if (!res.ok) {
        // Fail closed toward safety, never toward a silent normal reply —
        // see the "Known gaps" section of docs/RISK_DETECTION_SPEC.md.
        return { reply: null, risk_flag: true, backend_error: true };
      }
      return res.json();
    } catch (err) {
      // Server not running / unreachable. Same fail-closed rule applies:
      // show the crisis panel rather than silently pretending nothing was
      // typed, or worse, generating a fake normal-sounding reply.
      console.error('MindSpace backend unreachable:', err);
      return { reply: null, risk_flag: true, backend_error: true };
    }
  }

  async function checkHealth() {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, { method: 'GET' });
      if (!res.ok) return { reachable: false, live: false };
      const data = await res.json();
      return { reachable: true, live: !!data.live };
    } catch (err) {
      return { reachable: false, live: false };
    }
  }

  window.MindspaceBackend = { sendToGuide, checkHealth, backendUrl: BACKEND_URL };
})();
