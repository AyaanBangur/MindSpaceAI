// MindSpace — shared language dictionary.
//
// IMPORTANT: English and Spanish are the only translations that have been
// reviewed by a fluent speaker for this project so far (see
// docs/RISK_DETECTION_SPEC.md and mindspace_project_plan.md — machine
// translation of crisis-related language is a real safety risk, not just a
// polish detail). French, Hindi, and Chinese are included so the multi-
// language experience can be demoed end-to-end, but are marked `reviewed:
// false` below and the UI shows a visible "beta translation" note for them.
// Do not remove that note without getting a native-speaker review first.
(function () {
  const LANGS = [
    { code: 'en', label: 'English', speech: 'en-US', reviewed: true },
    { code: 'es', label: 'Español', speech: 'es-ES', reviewed: true },
    { code: 'fr', label: 'Français', speech: 'fr-FR', reviewed: false },
    { code: 'hi', label: 'हिंदी', speech: 'hi-IN', reviewed: false },
    { code: 'zh', label: '中文', speech: 'zh-CN', reviewed: false },
  ];

  const I18N = {
    crisis1: { en: 'In crisis right now?', es: '¿Estás en crisis ahora mismo?', fr: 'En crise en ce moment ?', hi: 'क्या आप अभी संकट में हैं?', zh: '现在正处于危机中吗？' },
    crisis2: { en: 'Call or text 988', es: 'Llama o envía un mensaje al 988', fr: 'Appelez ou envoyez un SMS au 988', hi: '988 पर कॉल या टेक्स्ट करें', zh: '拨打或短信 988' },
    crisis3: { en: 'Text HOME to 741741', es: 'Envía HOME al 741741', fr: 'Envoyez HOME au 741741', hi: '741741 पर HOME टेक्स्ट करें', zh: '发送 HOME 至 741741' },
    crisis4: { en: 'Emergency: call 911', es: 'Emergencia: llama al 911', fr: 'Urgence : appelez le 911', hi: 'आपातकाल: 911 पर कॉल करें', zh: '紧急情况：拨打 911' },

    nav_about: { en: 'About', es: 'Nosotros', fr: 'À propos', hi: 'हमारे बारे में', zh: '关于' },
    nav_guides: { en: 'Guides', es: 'Guías', fr: 'Guides', hi: 'गाइड', zh: '向导' },
    nav_resources: { en: 'Resources', es: 'Recursos', fr: 'Ressources', hi: 'संसाधन', zh: '资源' },
    nav_history: { en: 'History', es: 'Historial', fr: 'Historique', hi: 'इतिहास', zh: '记录' },

    lang_label: { en: 'Language', es: 'Idioma', fr: 'Langue', hi: 'भाषा', zh: '语言' },
    lang_beta_note: {
      en: 'This translation is machine-assisted and has not yet been reviewed by a fluent speaker. English and Spanish are the most tested.',
      es: 'Esta traducción es asistida por máquina y aún no ha sido revisada por un hablante fluido.',
      fr: 'Cette traduction est assistée par ordinateur et n’a pas encore été relue par une personne francophone.',
      hi: 'यह अनुवाद मशीन की सहायता से किया गया है और अभी तक किसी धाराप्रवाह वक्ता द्वारा समीक्षा नहीं किया गया है।',
      zh: '此翻译由机器辅助完成，尚未经过母语者审校。',
    },
    voice_label: { en: 'Voice', es: 'Voz', fr: 'Voix', hi: 'आवाज़', zh: '语音' },

    hero_eyebrow: { en: 'available right now · 100% anonymous', es: 'disponible ahora · 100% anónimo', fr: 'disponible maintenant · 100 % anonyme', hi: 'अभी उपलब्ध · 100% गुमनाम', zh: '现在可用 · 100% 匿名' },
    hero_h1: { en: 'Someone To Talk To Before Things Become A Crisis.', es: 'alguien con quien hablar antes de que se convierta en una crisis.', fr: 'quelqu’un à qui parler avant que les choses ne deviennent une crise.', hi: 'स्थिति संकट बनने से पहले बात करने के लिए कोई।', zh: '在事情变成危机之前，有人可以倾诉。' },
    hero_lede: {
      en: "A calm, anonymous space to say what's going on: no login, nothing saved, no pressure. This is a support tool, not a replacement for the people in your life or for professional care.",
      es: 'Un espacio tranquilo y anónimo para contar lo que pasa: sin cuenta, sin guardar nada, sin presión. Es una herramienta de apoyo, no un reemplazo de las personas en tu vida ni de la atención profesional.',
      fr: 'Un espace calme et anonyme pour dire ce qui se passe : sans compte, rien n’est enregistré, aucune pression. C’est un outil de soutien, pas un remplacement des personnes dans votre vie ni des soins professionnels.',
      hi: 'जो हो रहा है उसे कहने के लिए एक शांत, गुमनाम जगह: कोई लॉगिन नहीं, कुछ भी सहेजा नहीं जाता, कोई दबाव नहीं। यह एक सहायता उपकरण है, आपके जीवन के लोगों या पेशेवर देखभाल का विकल्प नहीं।',
      zh: '一个安静、匿名的空间，让你说出正在经历的事：无需登录，不保存任何内容，没有压力。这是一个支持工具，不能替代你生活中的人或专业护理。',
    },
    cta_primary: { en: 'Choose a guide →', es: 'Elegir una guía →', fr: 'Choisir un guide →', hi: 'एक गाइड चुनें →', zh: '选择一位向导 →' },
    cta_secondary: { en: 'How it works', es: 'Cómo funciona', fr: 'Comment ça marche', hi: 'यह कैसे काम करता है', zh: '工作原理' },
    tag1: { en: 'Anonymous', es: 'Anónimo', fr: 'Anonyme', hi: 'गुमनाम', zh: '匿名' },
    tag2: { en: 'Free', es: 'Gratis', fr: 'Gratuit', hi: 'मुफ़्त', zh: '免费' },
    tag3: { en: 'No signup', es: 'Sin registro', fr: 'Sans inscription', hi: 'साइनअप नहीं', zh: '无需注册' },
    tag4: { en: '988 always available', es: '988 siempre disponible', fr: '988 toujours disponible', hi: '988 हमेशा उपलब्ध', zh: '988 全天候可用' },
    disc_strong: { en: 'This is not therapy or medical treatment.', es: 'Esto no es terapia ni tratamiento médico.', fr: 'Ceci n’est ni une thérapie ni un traitement médical.', hi: 'यह चिकित्सा या चिकित्सकीय उपचार नहीं है।', zh: '这不是心理治疗或医疗行为。' },
    disc_rest: {
      en: " It's a place to be heard between the moments that feel too big. If you're in danger right now, call 988 or 911. This page will always keep that option one tap away.",
      es: ' Es un lugar para sentirte escuchado/a entre los momentos que se sienten demasiado grandes. Si estás en peligro ahora, llama al 988 o al 911. Esta opción siempre estará a un toque de distancia.',
      fr: ' C’est un endroit pour être entendu entre les moments qui semblent trop lourds. Si vous êtes en danger maintenant, appelez le 988 ou le 911. Cette option restera toujours à portée d’un clic.',
      hi: ' यह उन पलों के बीच सुने जाने की जगह है जो बहुत भारी लगते हैं। अगर आप अभी खतरे में हैं, तो 988 या 911 पर कॉल करें। यह विकल्प हमेशा एक टैप दूर रहेगा।',
      zh: '这是一个在感觉难以承受的时刻被倾听的地方。如果你现在处于危险中，请拨打 988 或 911。此选项将始终触手可及。',
    },
    guides_eyebrow: { en: 'Choose a guide', es: 'Elige una guía', fr: 'Choisissez un guide', hi: 'एक गाइड चुनें', zh: '选择一位向导' },
    guides_h2: { en: 'Pick whichever presence feels comfortable.', es: 'Elige la presencia que te resulte más cómoda.', fr: 'Choisissez la présence qui vous convient le mieux.', hi: 'जो भी उपस्थिति सहज लगे उसे चुनें।', zh: '选择让你感到自在的陪伴形象。' },
    guides_p: {
      en: 'These are support guides, not simulated friends. Each has a different pace and tone. Preview a voice before you start. You can switch anytime.',
      es: 'Son guías de apoyo, no amigos simulados. Cada una tiene un ritmo y tono distinto. Escucha una voz antes de empezar. Puedes cambiar cuando quieras.',
      fr: 'Ce sont des guides de soutien, pas des amis simulés. Chacun a un rythme et un ton différents. Écoutez une voix avant de commencer. Vous pouvez changer à tout moment.',
      hi: 'ये सहायता गाइड हैं, नकली दोस्त नहीं। प्रत्येक की गति और स्वर अलग है। शुरू करने से पहले एक आवाज़ सुनें। आप कभी भी बदल सकते हैं।',
      zh: '这些是支持型向导，而非模拟朋友。每一位的节奏和语气都不同。开始前可以先试听一段声音，随时都能切换。',
    },
    guides_note: {
      en: 'Every guide follows the same boundaries: honest about being an AI, never a replacement for real people, always pointing you to 988/911 if things feel urgent.',
      es: 'Todas las guías siguen los mismos límites: honestas sobre ser una IA, nunca un reemplazo de personas reales, siempre te guían al 988/911 si algo se siente urgente.',
      fr: 'Chaque guide respecte les mêmes limites : honnête sur le fait d’être une IA, jamais un remplacement des personnes réelles, et vous oriente toujours vers le 988/911 en cas d’urgence.',
      hi: 'हर गाइड समान सीमाओं का पालन करता है: एक AI होने के बारे में ईमानदार, वास्तविक लोगों का विकल्प कभी नहीं, और अगर स्थिति गंभीर लगे तो हमेशा 988/911 की ओर इशारा करता है।',
      zh: '每一位向导都遵循相同的边界：坦诚自己是 AI，绝不替代真实的人，一旦情况紧急，始终会引导你联系 988/911。',
    },
    start_cta: { en: 'Start talking with this guide →', es: 'Empezar a hablar con esta guía →', fr: 'Commencer à parler avec ce guide →', hi: 'इस गाइड से बात करना शुरू करें →', zh: '开始与这位向导对话 →' },
    how_eyebrow: { en: 'Built for the moments before a crisis', es: 'Creado para los momentos antes de una crisis', fr: 'Conçu pour les moments avant une crise', hi: 'संकट से पहले के पलों के लिए बनाया गया', zh: '为危机之前的时刻而设计' },
    how_h2: { en: 'Three steps. Nothing more required.', es: 'Tres pasos. Nada más se requiere.', fr: 'Trois étapes. Rien de plus n’est requis.', hi: 'तीन चरण। और कुछ आवश्यक नहीं।', zh: '三个步骤，仅此而已。' },
    step1_h: { en: 'Check in', es: 'Registra cómo estás', fr: 'Faites le point', hi: 'चेक इन करें', zh: '签到' },
    step1_p: { en: "Tap how you're feeling. One word is enough.", es: 'Toca cómo te sientes. Una palabra basta.', fr: 'Indiquez ce que vous ressentez. Un mot suffit.', hi: 'आप कैसा महसूस कर रहे हैं टैप करें। एक शब्द काफी है।', zh: '点选你此刻的感受，一个词就够了。' },
    step2_h: { en: 'Say anything', es: 'Di lo que sea', fr: 'Dites ce que vous voulez', hi: 'कुछ भी कहें', zh: '畅所欲言' },
    step2_p: { en: 'No name, no account, nothing saved. Just type.', es: 'Sin nombre, sin cuenta, nada se guarda. Solo escribe.', fr: 'Pas de nom, pas de compte, rien n’est enregistré. Écrivez simplement.', hi: 'कोई नाम नहीं, कोई खाता नहीं, कुछ भी सहेजा नहीं जाता। बस लिखें।', zh: '无需姓名，无需账户，不保存任何内容。写下来就好。' },
    step3_h: { en: 'Feel heard', es: 'Siéntete escuchado/a', fr: 'Sentez-vous écouté', hi: 'सुना हुआ महसूस करें', zh: '被倾听' },
    step3_p: { en: 'A calm, non-judgmental guide responds. Tools when you want them, 988 if you need it.', es: 'Una guía tranquila y sin juicios responde. Herramientas cuando las quieras, 988 si lo necesitas.', fr: 'Un guide calme et sans jugement vous répond. Des outils si vous le souhaitez, le 988 si vous en avez besoin.', hi: 'एक शांत, निर्णय-मुक्त गाइड जवाब देता है। जब चाहें उपकरण, ज़रूरत पड़े तो 988।', zh: '一位平静、不予评判的向导会回应你。需要时可使用工具，紧急时拨打 988。' },

    foot_about: { en: 'About', es: 'Nosotros', fr: 'À propos', hi: 'हमारे बारे में', zh: '关于' },
    foot_mission: { en: 'Our mission', es: 'Nuestra misión', fr: 'Notre mission', hi: 'हमारा मिशन', zh: '我们的使命' },
    foot_notwhat: { en: "What this isn't", es: 'Lo que no somos', fr: 'Ce que ce n’est pas', hi: 'यह क्या नहीं है', zh: '我们不是什么' },
    foot_support: { en: 'Support', es: 'Apoyo', fr: 'Soutien', hi: 'सहायता', zh: '支持' },
    foot_resources: { en: 'Resources', es: 'Recursos', fr: 'Ressources', hi: 'संसाधन', zh: '资源' },
    foot_legal: {
      en: 'MindSpace is a student-built peer-support project. It is not a licensed medical or mental health service and does not replace professional care. If you or someone you know is in immediate danger, call or text 988, or call 911.',
      es: 'MindSpace es un proyecto de apoyo entre pares creado por un estudiante. No es un servicio médico o de salud mental con licencia y no reemplaza la atención profesional. Si tú o alguien que conoces está en peligro inmediato, llama o envía un mensaje al 988, o llama al 911.',
      fr: 'MindSpace est un projet de soutien par les pairs créé par un étudiant. Ce n’est pas un service médical ou de santé mentale agréé et cela ne remplace pas les soins professionnels. Si vous ou quelqu’un que vous connaissez est en danger immédiat, appelez ou envoyez un SMS au 988, ou appelez le 911.',
      hi: 'MindSpace एक छात्र द्वारा बनाई गई सहकर्मी-सहायता परियोजना है। यह लाइसेंस प्राप्त चिकित्सा या मानसिक स्वास्थ्य सेवा नहीं है और पेशेवर देखभाल की जगह नहीं लेती। यदि आप या आपका कोई परिचित तत्काल खतरे में है, तो 988 पर कॉल या टेक्स्ट करें, या 911 पर कॉल करें।',
      zh: 'MindSpace 是一个由学生创建的同伴支持项目，并非持证的医疗或心理健康服务，不能替代专业护理。如果你或你认识的人正处于紧急危险中，请拨打或短信 988，或拨打 911。',
    },

    // ---------------- chat.html ----------------
    composer_placeholder: { en: 'Type anything. Nothing is saved.', es: 'Escribe lo que sea. Nada se guarda.', fr: 'Écrivez ce que vous voulez. Rien n’est enregistré.', hi: 'कुछ भी लिखें। कुछ भी सहेजा नहीं जाता।', zh: '写下任何内容，不会被保存。' },
    composer_note: { en: 'Anonymous · nothing saved · not a replacement for 988 or a real person', es: 'Anónimo · nada se guarda · no reemplaza al 988 ni a una persona real', fr: 'Anonyme · rien n’est enregistré · ne remplace pas le 988 ni une vraie personne', hi: 'गुमनाम · कुछ भी सहेजा नहीं जाता · 988 या किसी वास्तविक व्यक्ति का विकल्प नहीं', zh: '匿名 · 不保存任何内容 · 不能替代 988 或真人' },
    mute_title: { en: 'Mute voice', es: 'Silenciar voz', fr: 'Couper la voix', hi: 'आवाज़ म्यूट करें', zh: '静音语音' },
    unmute_title: { en: 'Unmute voice', es: 'Activar voz', fr: 'Réactiver la voix', hi: 'आवाज़ अनम्यूट करें', zh: '取消静音' },
    mic_start_title: { en: 'Speak instead of typing', es: 'Hablar en lugar de escribir', fr: 'Parler au lieu d’écrire', hi: 'लिखने के बजाय बोलें', zh: '说话代替打字' },
    mic_stop_title: { en: 'Stop listening', es: 'Dejar de escuchar', fr: 'Arrêter l’écoute', hi: 'सुनना बंद करें', zh: '停止聆听' },
    listening_state: { en: 'listening…', es: 'escuchando…', fr: 'écoute…', hi: 'सुन रहा हूं…', zh: '正在聆听…' },
    mic_unsupported: { en: "Voice input isn't supported in this browser. Try Chrome or Edge.", es: 'La entrada de voz no es compatible con este navegador. Prueba Chrome o Edge.', fr: 'La saisie vocale n’est pas prise en charge par ce navigateur. Essayez Chrome ou Edge.', hi: 'इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। Chrome या Edge आज़माएं।', zh: '此浏览器不支持语音输入，请尝试 Chrome 或 Edge。' },
    end_chat: { en: 'End chat', es: 'Terminar chat', fr: 'Terminer la discussion', hi: 'चैट समाप्त करें', zh: '结束对话' },
    save_chat_off_title: { en: 'Save this chat on this device (off)', es: 'Guardar este chat en este dispositivo (desactivado)', fr: 'Enregistrer cette discussion sur cet appareil (désactivé)', hi: 'इस चैट को इस डिवाइस पर सहेजें (बंद)', zh: '在此设备上保存此对话（已关闭）' },
    save_chat_on_title: { en: 'Saving this chat on this device (on). Tap to stop', es: 'Guardando este chat en este dispositivo (activado). Toca para detener', fr: 'Enregistrement de cette discussion sur cet appareil (activé). Appuyez pour arrêter', hi: 'यह चैट इस डिवाइस पर सहेजी जा रही है (चालू)। रोकने के लिए टैप करें', zh: '正在此设备上保存此对话（已开启），点按可停止' },
    composer_note_saving: {
      en: 'Saved only on this device · you can delete it anytime in History · not a replacement for 988 or a real person',
      es: 'Guardado solo en este dispositivo · puedes borrarlo cuando quieras en Historial · no reemplaza al 988 ni a una persona real',
      fr: 'Enregistré uniquement sur cet appareil · vous pouvez le supprimer à tout moment dans Historique · ne remplace pas le 988 ni une vraie personne',
      hi: 'केवल इस डिवाइस पर सहेजा गया · आप इसे इतिहास में कभी भी हटा सकते हैं · 988 या किसी वास्तविक व्यक्ति का विकल्प नहीं',
      zh: '仅保存在此设备上 · 你可以随时在“记录”中删除 · 不能替代 988 或真人',
    },
    // Escalation copy is written to reflect how a trained crisis responder
    // actually opens this conversation, not a generic "get help" message:
    // (1) name what's happening directly rather than with a vague euphemism
    // — research on direct suicide screening (e.g. Dazzi et al. 2014) finds
    // asking directly does not increase risk and is standard practice in
    // frameworks like the Columbia Protocol (C-SSRS); (2) validate the pain
    // without validating the act; (3) a brief, generic environmental-safety
    // nudge, reflecting means-restriction counseling — one of the most
    // evidence-backed suicide-prevention interventions in the public-health
    // literature — without asking the user for method specifics, which is
    // not this tool's role; (4) explicit non-abandonment, since ending
    // contact abruptly with someone at risk is itself a known bad pattern
    // in crisis-line training. See docs/RISK_DETECTION_SPEC.md.
    escalation_h: {
      en: "It sounds like you're in a lot of pain right now, and maybe even thinking about ending your life.",
      es: 'Parece que estás sintiendo mucho dolor ahora mismo, y tal vez incluso pensando en terminar con tu vida.',
      fr: 'On dirait que vous ressentez beaucoup de douleur en ce moment, et peut-être même que vous pensez à mettre fin à vos jours.',
      hi: 'ऐसा लगता है कि आप अभी बहुत दर्द महसूस कर रहे हैं, और शायद अपनी जान खत्म करने के बारे में भी सोच रहे हैं।',
      zh: '听起来你现在承受着很大的痛苦，也许还在想结束自己的生命。',
    },
    escalation_p: {
      en: "That doesn't mean something is wrong with you. It means the pain got bigger than what feels possible to carry alone right now. I can't help you think through safety the way a trained person can, but 988 and Crisis Text Line counselors are trained for exactly this moment, and they're available right now.",
      es: 'Eso no significa que algo esté mal contigo. Significa que el dolor se volvió más grande de lo que se siente posible cargar solo/a en este momento. Yo no puedo ayudarte a pensar en tu seguridad como lo haría una persona capacitada, pero los consejeros de 988 y Crisis Text Line están entrenados exactamente para este momento, y están disponibles ahora mismo.',
      fr: "Cela ne veut pas dire qu'il y a quelque chose qui ne va pas chez vous. Cela veut dire que la douleur est devenue plus grande que ce qui semble possible à porter seul en ce moment. Je ne peux pas vous aider à réfléchir à votre sécurité comme le ferait une personne formée, mais les conseillers du 988 et de Crisis Text Line sont formés exactement pour ce moment, et ils sont disponibles maintenant.",
      hi: 'इसका मतलब यह नहीं कि आपमें कुछ गलत है। इसका मतलब है कि दर्द इतना बड़ा हो गया है जितना अकेले सहना संभव नहीं लगता। मैं किसी प्रशिक्षित व्यक्ति की तरह आपकी सुरक्षा के बारे में सोचने में मदद नहीं कर सकता, लेकिन 988 और Crisis Text Line के काउंसलर ठीक इसी पल के लिए प्रशिक्षित हैं, और वे अभी उपलब्ध हैं।',
      zh: '这并不代表你有什么问题。这代表这份痛苦已经大到一个人难以独自承受的地步。我无法像受过训练的人那样帮你思考安全问题，但988和危机短信热线的辅导员正是为这一刻而训练的，他们现在就可以提供帮助。',
    },
    escalation_safety: {
      en: 'If you can, try to be near another person right now, even just in the same room, and away from anything you could use to hurt yourself.',
      es: 'Si puedes, intenta estar cerca de otra persona ahora mismo, aunque sea en la misma habitación, y lejos de cualquier cosa que pudieras usar para hacerte daño.',
      fr: "Si vous le pouvez, essayez de rester près d'une autre personne en ce moment, même juste dans la même pièce, et loin de tout ce que vous pourriez utiliser pour vous faire du mal.",
      hi: 'अगर हो सके, तो अभी किसी और के पास रहने की कोशिश करें, भले ही सिर्फ उसी कमरे में हों, और ऐसी किसी भी चीज़ से दूर जिससे आप खुद को नुकसान पहुंचा सकें।',
      zh: '如果可以，尽量待在有其他人的地方，哪怕只是同一个房间，并远离任何可能用来伤害自己的东西。',
    },
    escalation_stay: {
      en: "I'm still here. This conversation isn't going anywhere, and you can always come back to it, no matter what you say.",
      es: 'Sigo aquí. Esta conversación no va a ninguna parte, y siempre puedes volver a ella, sin importar lo que digas.',
      fr: 'Je suis toujours là. Cette conversation ne va nulle part, et vous pouvez toujours y revenir, peu importe ce que vous dites.',
      hi: 'मैं अभी भी यहां हूं। यह बातचीत कहीं नहीं जा रही, और आप जो भी कहें, आप हमेशा वापस आ सकते हैं।',
      zh: '我还在这里。这段对话不会消失，无论你说了什么，你都可以随时回来。',
    },
    escalation_call: { en: 'Call 988 now', es: 'Llama al 988 ahora', fr: 'Appelez le 988 maintenant', hi: 'अभी 988 पर कॉल करें', zh: '立即拨打 988' },
    escalation_text: { en: 'Text HOME to 741741', es: 'Envía HOME al 741741', fr: 'Envoyez HOME au 741741', hi: '741741 पर HOME टेक्स्ट करें', zh: '发送 HOME 至 741741' },
    escalation_911: { en: "In immediate danger? Call 911", es: '¿Estás en peligro inmediato? Llama al 911', fr: 'En danger immédiat ? Appelez le 911', hi: 'तुरंत खतरे में हैं? 911 पर कॉल करें', zh: '情况危急？请拨打911' },
    opener: {
      en: 'Hi, I’m {name}. No pressure, I’m just here if you want to talk. What’s on your mind?',
      es: 'Hola, soy {name}. Sin presión, estoy aquí si quieres hablar. ¿Qué tienes en mente?',
      fr: 'Bonjour, je suis {name}. Aucune pression, je suis simplement là si vous voulez parler. Qu’avez-vous en tête ?',
      hi: 'नमस्ते, मैं {name} हूं। कोई दबाव नहीं, अगर आप बात करना चाहें तो मैं यहां हूं। आपके मन में क्या है?',
      zh: '你好，我是 {name}。不用有压力，如果你想聊聊，我一直在这里。你现在在想什么？',
    },
    voice_preview_greeting: {
      en: 'Hi, I’m {name}. No pressure, I’m just here if you want to talk.',
      es: 'Hola, soy {name}. Sin presión, estoy aquí si quieres hablar.',
      fr: 'Bonjour, je suis {name}. Aucune pression, je suis simplement là si vous voulez parler.',
      hi: 'नमस्ते, मैं {name} हूं। कोई दबाव नहीं, अगर आप बात करना चाहें तो मैं यहां हूं।',
      zh: '你好，我是 {name}。不用有压力，如果你想聊聊，我一直在这里。',
    },
    preview_btn: { en: '🔊 Hear a hello', es: '🔊 Escuchar un saludo', fr: '🔊 Écouter un bonjour', hi: '🔊 नमस्ते सुनें', zh: '🔊 试听问候' },

    // ---------------- history.html ----------------
    history_eyebrow: { en: 'Your progress', es: 'Tu progreso', fr: 'Vos progrès', hi: 'आपकी प्रगति', zh: '你的记录' },
    history_h2: { en: 'Past chats, saved only on this device.', es: 'Chats anteriores, guardados solo en este dispositivo.', fr: 'Discussions passées, enregistrées uniquement sur cet appareil.', hi: 'पिछली चैट्स, केवल इस डिवाइस पर सहेजी गई हैं।', zh: '过往对话，仅保存在此设备上。' },
    history_p: {
      en: 'MindSpace never creates accounts and never sends chats to a server to store them. If you turned on "Save this chat" during a conversation, it stays here, in this browser, until you delete it.',
      es: 'MindSpace nunca crea cuentas ni envía los chats a un servidor para guardarlos. Si activaste "Guardar este chat" durante una conversación, se queda aquí, en este navegador, hasta que lo borres.',
      fr: 'MindSpace ne crée jamais de compte et n’envoie jamais les discussions à un serveur pour les stocker. Si vous avez activé « Enregistrer cette discussion » pendant une conversation, elle reste ici, dans ce navigateur, jusqu’à ce que vous la supprimiez.',
      hi: 'MindSpace कभी खाता नहीं बनाता और चैट्स को सहेजने के लिए कभी सर्वर पर नहीं भेजता। अगर आपने बातचीत के दौरान "इस चैट को सहेजें" चालू किया था, तो यह यहीं, इस ब्राउज़र में, तब तक रहेगी जब तक आप इसे हटा नहीं देते।',
      zh: 'MindSpace 从不创建账户，也从不将对话发送到服务器进行存储。如果你在对话中开启了“保存此对话”，它会一直留在这个浏览器里，直到你删除它。',
    },
    history_empty: {
      en: "No saved chats yet. Turn on \"Save this chat\" from the icon in a conversation if you'd like to look back later.",
      es: 'Aún no hay chats guardados. Activa "Guardar este chat" desde el ícono en una conversación si quieres volver a verlo más tarde.',
      fr: 'Aucune discussion enregistrée pour l’instant. Activez « Enregistrer cette discussion » depuis l’icône d’une conversation si vous souhaitez la retrouver plus tard.',
      hi: 'अभी तक कोई सहेजी गई चैट नहीं है। यदि आप बाद में देखना चाहते हैं तो बातचीत में आइकन से "इस चैट को सहेजें" चालू करें।',
      zh: '目前还没有已保存的对话。如果想以后回顾，请在对话中点击图标开启“保存此对话”。',
    },
    history_clear_all: { en: 'Clear all history', es: 'Borrar todo el historial', fr: 'Effacer tout l’historique', hi: 'सारा इतिहास साफ़ करें', zh: '清除全部记录' },
    history_clear_confirm: {
      en: 'Delete all saved chats from this device? This cannot be undone.',
      es: '¿Borrar todos los chats guardados de este dispositivo? Esto no se puede deshacer.',
      fr: 'Supprimer toutes les discussions enregistrées sur cet appareil ? Cette action est irréversible.',
      hi: 'इस डिवाइस से सभी सहेजी गई चैट्स हटाएं? इसे पूर्ववत नहीं किया जा सकता।',
      zh: '要从此设备删除所有已保存的对话吗？此操作无法撤销。',
    },
    history_delete_one_confirm: {
      en: 'Delete this saved chat? This cannot be undone.',
      es: '¿Borrar este chat guardado? Esto no se puede deshacer.',
      fr: 'Supprimer cette discussion enregistrée ? Cette action est irréversible.',
      hi: 'यह सहेजी गई चैट हटाएं? इसे पूर्ववत नहीं किया जा सकता।',
      zh: '要删除这条已保存的对话吗？此操作无法撤销。',
    },
    history_view: { en: 'View', es: 'Ver', fr: 'Voir', hi: 'देखें', zh: '查看' },
    history_hide: { en: 'Hide', es: 'Ocultar', fr: 'Masquer', hi: 'छुपाएं', zh: '收起' },
    history_delete: { en: 'Delete', es: 'Borrar', fr: 'Supprimer', hi: 'हटाएं', zh: '删除' },
    history_continue: { en: 'Continue this guide →', es: 'Continuar con esta guía →', fr: 'Continuer avec ce guide →', hi: 'इस गाइड के साथ जारी रखें →', zh: '继续与此向导对话 →' },
    history_messages: { en: 'messages', es: 'mensajes', fr: 'messages', hi: 'संदेश', zh: '条消息' },

  };

  function t(lang, key, vars) {
    const entry = I18N[key];
    if (!entry) return key;
    let s = entry[lang] || entry.en || '';
    if (vars) {
      Object.keys(vars).forEach((k) => { s = s.replace(`{${k}}`, vars[k]); });
    }
    return s;
  }

  function langMeta(code) {
    return LANGS.find((l) => l.code === code) || LANGS[0];
  }

  window.MindspaceI18n = { LANGS, I18N, t, langMeta };
})();
