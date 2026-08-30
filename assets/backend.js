// MindSpace — chat backend client.
//
// If assets/config.js has a SUPABASE_URL configured, sendToGuide() calls
// the real edge function (supabase/functions/chat/index.ts). Otherwise it
// falls back to a local scripted mock — this is the default, so the site
// is fully demoable without any backend deployed or any API key anywhere.
//
// Both paths resolve the same shape: { reply: string|null, risk_flag: bool }
(function () {
  const cfg = window.MINDSPACE_CONFIG || {};
  const live = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);

  async function sendToGuideLive(guideId, lang, history, message) {
    const res = await fetch(`${cfg.SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: cfg.SUPABASE_ANON_KEY },
      body: JSON.stringify({ guideId, lang, history, message }),
    });
    if (!res.ok) {
      // Fail closed toward safety, never toward a silent normal reply —
      // see the "Known gaps" section of docs/RISK_DETECTION_SPEC.md.
      return { reply: null, risk_flag: true, backend_error: true };
    }
    return res.json();
  }

  // Very small keyword classifier so the local mock at least responds to
  // *something* about what was typed, rather than a pure random pick —
  // this is a scripted demo stand-in, not the real conversational engine
  // (that's the live Anthropic-backed path above).
  //
  // BUG FIXED HERE (root cause of "it gives random answers"): every keyword
  // check below used to be a raw text.includes(word) substring test, with
  // no word boundaries. Short keywords collide constantly with unrelated
  // words: "ok" is inside "brOKe", "hi" is inside "tHIs"/"tHInk"/"HIs",
  // "mad" is inside "Made", "numb" is inside "NUMBer", "yo" is inside "YOu".
  // A message like "my girlfriend broke up with me" was matching "ok" and
  // getting a cheerful feeling_good reply purely by accident. tokenize()
  // splits the message into whole words (Unicode-aware, so it also works
  // for Hindi/Devanagari), and matchesKeyword() only substring-matches
  // multi-word phrases ("kill myself", "what's up") — those are specific
  // enough that collision risk is negligible — while single words require
  // an exact whole-word match against the token list. Chinese has no
  // spaces between words, so CJK keywords keep the old substring behavior
  // (a real limitation, noted in RISK_PHRASES below, not solved by this).
  function tokenize(text) {
    return text.split(/[^\p{L}'’]+/u).filter(Boolean);
  }

  function matchesKeyword(text, tokens, phrase, lang) {
    if (lang === 'zh' || phrase.includes(' ')) return text.includes(phrase);
    return tokens.includes(phrase);
  }

  // BUG FIXED HERE: a plain substring match on feeling_good words (good,
  // fine, okay...) has no idea that "I don't feel good" or "I'm not okay"
  // is a distress signal, not a positive one — the negated word still
  // matches, so the bot replied cheerfully to someone saying they were NOT
  // okay. isNegated() checks for a negation word in the few characters
  // right before the match; a negated "good"/"fine"/"okay" is routed to
  // feeling_bad instead of feeling_good.
  const NEGATIONS = {
    en: ['not', "n't", 'never', 'no ', 'hardly', 'barely'],
    es: ['no ', 'nunca', 'jamás', 'jamas', 'sin '],
    fr: ['pas', 'jamais', 'aucun', 'aucune', 'sans '],
    hi: ['नहीं', 'कभी नहीं', 'ना '],
    zh: ['不', '没', '别', '从不'],
  };

  function isNegated(text, matchIndex, lang) {
    const negWords = NEGATIONS[lang] || NEGATIONS.en;
    const windowStart = Math.max(0, matchIndex - 18);
    const before = text.slice(windowStart, matchIndex);
    return negWords.some((neg) => before.includes(neg));
  }

  // The local demo previously only ever flagged risk on the exact literal
  // string "TESTESCALATION" — it had NO actual suicide-risk detection, so
  // a real message like "i want to suicide" fell through to the ordinary
  // keyword classifier below and got a generic "want to say more?" reply.
  // The always-visible crisis bar was the only safety net. This is a
  // keyword/phrase net covering the same signal categories the live
  // classifier and docs/RISK_DETECTION_SPEC.md use — explicit intent
  // (with or without a plan), access-to-means + distress, and goodbye/
  // finality language. It is deliberately blunt and over-inclusive: per
  // the spec's own stated asymmetric cost, a false positive here costs an
  // interrupted conversation; a false negative on real risk is far worse.
  // This is still a substring match, not a real classifier — it cannot
  // replace the live, reviewed backend, only avoid leaving zero net when
  // no backend is configured.
  // This list was found to miss the large majority of realistic phrasings
  // in testing (11 of 15 common ways someone actually expresses suicidal
  // ideation, intent, a plan, or access to means went undetected — only
  // messages containing the literal words "kill myself" were caught).
  // Expanded to cover contraction variants ("isn't worth living", not just
  // "not worth living"), indirect intent phrasing ("ending things", "not
  // existing", "not being here anymore"), and — previously entirely
  // absent — explicit method/means mentions (hanging, jumping, firearms,
  // stockpiling pills), which are category-1/3 signals in
  // docs/RISK_DETECTION_SPEC.md and among the most severe. Deliberately
  // excludes a few very common, genuinely ambiguous phrases ("I want this
  // to be over," "I can't do this anymore") that the spec itself places in
  // category 5/7 (ordinary hopelessness/venting) precisely because they
  // are said constantly about mundane things (exams, a bad week) and
  // auto-flagging them would erode trust in the tool for everyone, per the
  // spec's own stated trade-off.
  const RISK_PHRASES = {
    en: [
      'suicide', 'suicidal', 'kill myself', 'kill my self', 'killing myself',
      'end my life', 'ending my life', 'end my own life', 'ending my own life',
      'end it all', 'ending it all', 'end things', 'ending things',
      'end everything', 'ending everything', 'end it tonight', 'end it today',
      'going to end it', 'end it soon',
      "don't want to be alive", 'do not want to be alive',
      "don't want to live", 'do not want to live', 'dont want to live',
      "don't want to wake up", 'do not want to wake up', 'dont want to wake up',
      'not want to wake up',
      'want to die', 'wanna die', 'better off dead', 'no reason to live',
      'no point in living', 'no point living', 'not worth living',
      "isn't worth living", 'is not worth living', 'isnt worth living',
      "what's the point of living", 'what is the point of living',
      'whats the point of living', 'point of living',
      'take my own life', 'take my life',
      'want to disappear forever', 'give up on life',
      "won't be here anymore", 'wont be here anymore', 'not going to be here',
      'not being here anymore', 'not be here anymore', 'not be alive anymore',
      "wish i wasn't here", "wish i weren't here", "wasn't here anymore",
      'not existing', 'not exist anymore', 'thinking about not existing',
      'this is goodbye', 'last time we talk', "last time we'll talk",
      'tell my family i love them', 'tell everyone i love them',
      'better off without me', 'hurt myself', 'hurting myself',
      'self harm', 'self-harm', 'cutting myself', 'overdose', 'over dose',
      'jump off a bridge', 'jump off the bridge', 'jumping off a bridge',
      'jump off a building', 'jumping off a building',
      'jump in front of a train', 'jump in front of a car',
      'hang myself', 'hanging myself', 'shoot myself', 'shooting myself',
      'slit my wrists', 'slitting my wrists',
      'saving up pills', 'saving pills', 'stockpiling pills', 'enough pills to',
    ],
    es: [
      'suicid', 'matarme', 'quitarme la vida', 'terminar con mi vida',
      'no quiero vivir', 'no quiero seguir viviendo', 'quiero morir',
      'mejor muerto', 'mejor muerta', 'hacerme daño', 'lastimarme',
      'autolesion', 'autolesión', 'cortarme',
      'acabar con todo', 'acabar con mi vida', 'terminar con todo',
      'no vale la pena vivir', 'no tiene sentido vivir',
      'no quiero despertar', 'no quiero seguir', 'ya no puedo más con esto',
      'desaparecer para siempre', 'no voy a estar aquí',
      'esta es la despedida', 'última vez que hablamos',
      'saltar de un puente', 'saltar del puente', 'ahorcarme', 'dispararme',
      'cortarme las venas', 'guardando pastillas', 'juntando pastillas',
      // Spanish reflexive verbs can put the pronoun before the verb instead
      // of attached to it ("me quiero ahorcar" vs "ahorcarme") — same
      // meaning, but the earlier attached-pronoun-only forms above missed
      // this common word order entirely.
      'me quiero matar', 'me voy a matar', 'voy a matarme',
      'me quiero ahorcar', 'me voy a ahorcar', 'voy a ahorcarme',
      'me quiero disparar', 'me voy a disparar', 'voy a dispararme',
      'me quiero lastimar', 'me voy a lastimar', 'voy a lastimarme',
      'me quiero cortar', 'me voy a cortar', 'voy a cortarme',
    ],
    fr: [
      'suicide', 'suicidaire', 'me tuer', 'me suicider', 'en finir',
      'mettre fin à mes jours', 'je veux mourir', 'je ne veux plus vivre',
      'me faire du mal', 'automutilation', 'me couper',
      'ça ne vaut pas la peine de vivre', 'je ne veux plus me réveiller',
      'je ne veux plus exister', 'disparaître pour toujours',
      'je ne serai plus là', "c'est un adieu", 'sauter du pont',
      'me pendre', 'me tirer une balle', 'me trancher les veines',
    ],
    hi: [
      'आत्महत्या', 'खुदकुशी', 'खुद को मारना', 'जीना नहीं चाहता',
      'जीना नहीं चाहती', 'मरना चाहता हूं', 'मरना चाहती हूं',
      'खुद को नुकसान', 'खुद को चोट',
      'जीने का कोई मतलब नहीं', 'जीने लायक नहीं', 'उठना नहीं चाहता',
      'हमेशा के लिए गायब', 'यहां नहीं रहूंगा', 'यह अलविदा है',
      'पुल से कूदना', 'फांसी लगाना', 'खुद को गोली मारना',
    ],
    zh: [
      '自杀', '想死', '不想活', '结束自己的生命', '伤害自己', '自残',
      '活着没有意义', '不值得活', '不想醒来', '永远消失', '不会在这里了',
      '这是告别', '跳桥', '上吊', '开枪打自己', '割腕',
    ],
  };

  function detectsMockRisk(message, lang) {
    const text = message.trim().toLowerCase();
    if (!text) return false;
    const phrases = RISK_PHRASES[lang] || RISK_PHRASES.en;
    return phrases.some((p) => text.includes(p));
  }

  let lastMockReply = null;
  function classifyMock(message, lang) {
    const kw = (window.MindspaceI18n.I18N.mock_keywords[lang] || window.MindspaceI18n.I18N.mock_keywords.en);
    const text = message.trim().toLowerCase();
    if (!text) return 'default';
    const tokens = tokenize(text);
    const hits = (list) => list.some((w) => matchesKeyword(text, tokens, w, lang));
    if (hits(kw.greeting) && text.split(/\s+/).length <= 4) return 'greeting';
    if (hits(kw.gratitude)) return 'gratitude';
    if (hits(kw.feeling_bad)) return 'feeling_bad';
    // Checked before feeling_good: an explicit request like "any tips for
    // feeling better?" or "how can I improve" contains a feeling_good word
    // ("better"/"improve") but is clearly asking for help, not reporting a
    // positive mood — the request should win over the incidental word.
    if (hits(kw.coping_request)) return 'coping_request';
    if (hits(kw.help_request)) return 'help_request';
    const negatedGood = kw.feeling_good.some((w) => {
      if (!matchesKeyword(text, tokens, w, lang)) return false;
      const idx = text.indexOf(w);
      return idx !== -1 && isNegated(text, idx, lang);
    });
    if (negatedGood) return 'feeling_bad';
    if (hits(kw.feeling_good)) return 'feeling_good';
    if (text.endsWith('?')) return 'question';
    if (text.split(/\s+/).length <= 2) return 'short';
    return 'default';
  }

  // mock_replies is keyed [lang][guideId][category] for languages that have
  // been given persona-specific pools (en, es); languages that only have a
  // single shared voice so far use a `_shared` bucket instead of one per
  // guide. Falling back guideId -> _shared -> lang.en keeps every guide/lang
  // combination working even before every persona has been written for
  // every language.
  function getReplyPool(lang, guideId, category) {
    const byLang = window.MindspaceI18n.I18N.mock_replies;
    const langData = byLang[lang] || byLang.en;
    const guideData = langData[guideId] || langData._shared || byLang.en.sol;
    return guideData[category] || guideData.default;
  }

  function sendToGuideMock(guideId, lang, history, message) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (message.trim().toUpperCase() === 'TESTESCALATION' || detectsMockRisk(message, lang)) {
          resolve({ reply: null, risk_flag: true });
          return;
        }
        const category = classifyMock(message, lang);
        const pool = getReplyPool(lang, guideId, category);
        let choices = pool;
        if (pool.length > 1 && lastMockReply) {
          choices = pool.filter((r) => r !== lastMockReply);
        }
        const reply = choices[Math.floor(Math.random() * choices.length)];
        lastMockReply = reply;
        resolve({ reply, risk_flag: false });
      }, 500);
    });
  }

  async function sendToGuide(guideId, lang, history, message) {
    return live
      ? sendToGuideLive(guideId, lang, history, message)
      : sendToGuideMock(guideId, lang, history, message);
  }

  window.MindspaceBackend = { sendToGuide, isLive: live };
})();
