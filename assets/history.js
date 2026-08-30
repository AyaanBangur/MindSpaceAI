// MindSpace — optional, on-device-only chat history.
//
// This is NOT an account system. There is no login and nothing is ever
// sent to a server. When a user opts in (via the save toggle in chat.html),
// the conversation is written to this browser's localStorage only, so they
// can look back at their own progress later. Deleting a chat, or clearing
// all history, removes it permanently — nothing to recover, because
// nothing ever left the device.
(function () {
  const KEY = 'mindspace_chat_history';

  function readAll() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeAll(sessions) {
    try {
      localStorage.setItem(KEY, JSON.stringify(sessions));
    } catch (e) {
      // Storage full or unavailable (private browsing, quota, etc.) —
      // saving locally is a nice-to-have, never worth breaking the chat over.
    }
  }

  function listSessions() {
    return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function getSession(id) {
    return readAll().find((s) => s.id === id) || null;
  }

  function upsertSession(session) {
    const all = readAll();
    const idx = all.findIndex((s) => s.id === session.id);
    if (idx === -1) all.push(session);
    else all[idx] = session;
    writeAll(all);
  }

  function deleteSession(id) {
    writeAll(readAll().filter((s) => s.id !== id));
  }

  function clearAll() {
    writeAll([]);
  }

  function newSessionId() {
    return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  window.MindspaceHistory = {
    listSessions,
    getSession,
    upsertSession,
    deleteSession,
    clearAll,
    newSessionId,
  };
})();
