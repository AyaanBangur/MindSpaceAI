// MindSpace — voice matching.
//
// The Web Speech API doesn't expose a real gender attribute on voices, so
// this is a best-effort heuristic match against common voice name patterns
// shipped by browsers/OSes (Windows/Edge, Chrome, Safari/macOS, Android).
// It's approximate by nature — some platforms only ship one or two voices
// per language and a match may not exist, in which case we still pick
// *some* voice deterministically per guide so different guides at least
// sound different, rather than all silently falling back to the same
// single default voice (which was the original bug this file fixes).
(function () {
  const FEMALE_HINTS = [
    'female', 'zira', 'susan', 'samantha', 'victoria', 'karen', 'moira', 'tessa',
    'fiona', 'veena', 'kendra', 'salli', 'joanna', 'ivy', 'aria', 'jenny',
    'natasha', 'libby', 'olivia', 'emma', 'ana', 'sabina', 'anna', 'catherine',
    'elsa', 'hazel', 'linda', 'heera', 'sonia', 'paulina', 'monica', 'amelie',
    'yaoyao', 'xiaoxiao', 'ting-ting', 'sinji',
  ];
  const MALE_HINTS = [
    'male', 'david', 'mark', 'james', 'daniel', 'alex', 'fred', 'guy', 'ryan',
    'christopher', 'eric', 'george', 'thomas', 'diego', 'jorge', 'pablo',
    'hemant', 'ravi', 'rishi', 'yunjian', 'kangkang', 'yunus', 'liam',
  ];

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  function scoreVoice(voice, gender) {
    const n = voice.name.toLowerCase();
    const isFemaleHint = FEMALE_HINTS.some((h) => n.includes(h));
    const isMaleHint = MALE_HINTS.some((h) => n.includes(h));
    if (gender === 'female') {
      if (isFemaleHint) return 2;
      if (isMaleHint) return -1;
    } else if (gender === 'male') {
      if (isMaleHint) return 2;
      if (isFemaleHint) return -1;
    }
    return 0;
  }

  // Returns the best-matching SpeechSynthesisVoice for a language + guide
  // (gender + id used for the match/tiebreak), or null if no voices are
  // available yet for that language.
  function pick(lang, gender, guideId) {
    if (!('speechSynthesis' in window)) return null;
    const all = window.speechSynthesis.getVoices();
    const prefix = lang.split('-')[0].toLowerCase();
    const candidates = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
    if (candidates.length === 0) return null;

    let bestScore = -Infinity;
    candidates.forEach((v) => { bestScore = Math.max(bestScore, scoreVoice(v, gender)); });
    const top = candidates.filter((v) => scoreVoice(v, gender) === bestScore);
    const idx = hashString(guideId || '') % top.length;
    return top[idx];
  }

  window.MindspaceVoices = { pick };
})();
