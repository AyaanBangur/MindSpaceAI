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

    // Reply pools + keyword hints used ONLY by the local mock backend (no
    // live API key configured yet) — see assets/backend.js. This is a
    // scripted approximation of a conversation for demo/dev purposes, not
    // the real conversational engine (that's supabase/functions/chat,
    // gated behind clinical review per docs/RISK_DETECTION_SPEC.md).
    //
    // EN and ES (the two reviewed languages) are keyed per guide persona —
    // wren/sol/moss/ember/iris/cove — so each guide actually sounds like
    // the personality described in assets/guides.js, not one shared voice.
    // FR/HI/ZH stay under a single `_shared` bucket for now (see the file
    // header note on translation review status); backend.js falls back to
    // `_shared` for any language/guide combination that isn't defined below.
    mock_replies: {
      en: {
        wren: {
          greeting: ["Hey. I'm here.", "Hi. Take your time."],
          gratitude: ["No need to thank me. I'm here."],
          feeling_bad: ["That's heavy. I'm not going anywhere.", "Okay. I hear that. Take your time.", "That sounds hard. You don't have to explain all of it right now.", "I'm here. However long this takes."],
          feeling_good: ["Good to hear.", "That's good. What's helping?"],
          coping_request: ["A few things that actually help: naming 5 things you can see right now, slow breathing, in for 4, out for 6, or one small thing done with your hands. Want to try one?", "One small, doable thing usually helps more than a big plan. Water, a short walk, texting one person. What feels possible right now?", "If it feels like too much right now, cold water on your face or wrists can calm your body down fast. It's called TIPP, therapists use it for exactly this.", "Try talking to yourself the way you'd talk to a friend going through this. Not fixing it, just being kind.", "Sometimes naming the feeling out loud, even just 'this is grief' or 'this is fear', makes it a little smaller. What would you call it?", "When everything says isolate, the smaller, harder move is reaching out. Even one word to one person counts.", "You don't have to be okay with what happened to stop fighting it in your head. Sometimes just 'this is what's true right now' is enough for a minute."],
          help_request: ["I can listen, help you think it through, or point you toward real support like 988 or a counselor. What would help most right now?"],
          question: ["Fair question. What's behind it?"],
          short: ["That's okay. No rush."],
          default: ["I'm listening.", "Take your time. I'm here."],
        },
        sol: {
          greeting: ["Hey, glad you're here! What's going on?", "Hi there. I'm listening, whenever you're ready."],
          gratitude: ["You don't have to thank me. I'm glad you're talking to me.", "Of course. I'm here as long as you need."],
          feeling_bad: ["That sounds like a lot to be carrying right now. I'm not going anywhere.", "Thank you for telling me that. You don't have to have the right words for it. What's it been like?", "I hear you. That kind of heavy doesn't just go away because someone says the right thing, and I'm not going to pretend it does.", "That makes sense that it feels this hard. I'm not going to rush you through it."],
          feeling_good: ["That's good to hear! What's been helping today?", "I'm glad that's how today's going. What's been different?"],
          coping_request: ["Here are a few things that genuinely help a lot of people: the 5-4-3-2-1 grounding technique (5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste), slow breathing, or writing down exactly what's in your head without editing it. None of these fix everything, but they can make the next few minutes easier. Want to try one?", "Something therapists use a lot: noticing a hard thought and asking, is this 100% true, or does it just feel that way right now? Big feelings can make thoughts feel like facts. What's the loudest thought right now?", "Small, doable actions tend to help more than big plans, drinking water, stepping outside, texting one person you trust. What's one tiny thing you could do in the next few minutes?", "When things feel really intense, therapists sometimes use something called TIPP, splashing cold water on your face or holding an ice cube. It sounds small, but it actually calms your nervous system down fast. Want to try it?", "Here's one a lot of therapists teach: talk to yourself the way you'd talk to a friend who was struggling, not 'toughen up,' but 'of course this is hard.' What would you say to a friend in this exact spot?", "There's real research behind this: putting a specific name on what you're feeling, like 'this is loneliness' or 'this is shame', actually calms the brain's stress response. What would you call what you're feeling right now?", "When you want to disappear or shut everyone out, doing the opposite, even just texting one person 'hey', can interrupt that spiral. Is there one person you could reach, even briefly?", "One thing that sometimes helps: you don't have to be okay with what happened to stop fighting it. Just noticing 'this is what's true right now' can loosen its grip a little."],
          help_request: ["Of course! I can listen, help you think through what's going on, share some coping tools, or point you toward a real person like 988 or a counselor. What would help most right now?", "I'm glad you asked. Do you want to talk through what's going on, try a coping tool together, or get connected to a real person?"],
          question: ["That's a fair question. What made you ask?"],
          short: ["That's okay, we don't have to rush. What's one small thing on your mind?"],
          default: ["I hear you. Want to say more about that?", "Thanks for telling me that. Take your time."],
        },
        moss: {
          greeting: ["Hey. Glad you're here. No need to get right into it.", "Hi. Whenever you're ready."],
          gratitude: ["Nothing to thank me for. I'm glad you're here."],
          feeling_bad: ["That sounds like a lot to be sitting with. Take whatever time you need.", "I hear that. It makes sense it feels heavy. I'm not going anywhere.", "That's a hard place to be. You don't have to rush out of it to talk to me.", "I'm here with you in that. No pressure to explain it all at once."],
          feeling_good: ["Good to hear that. What's been steady for you today?", "That's good. Glad something's going right."],
          coping_request: ["A few things that tend to help: slow breathing, naming what you can see and hear around you, or one small physical thing, water, a short walk. Nothing fixes it all at once. What feels doable?", "Sometimes it helps to ask if a thought is fact or just how things feel right now. Feelings can be loud without being true. What's the loudest one for you?", "When it's too intense to think straight, cold water on your face can bring your body down fast. It's a real technique, called TIPP.", "Try the words you'd use for a friend, not the ones you're using on yourself right now.", "Naming the feeling exactly, not just 'bad', but what it actually is, can take some of its weight off.", "The pull to go quiet and disappear is real. The smaller, harder thing is reaching toward someone instead, even just a little."],
          help_request: ["I can sit with you while you figure out what you need, share a coping tool, or point you toward 988 or someone trained for this. What would help most?"],
          question: ["Good question. Take your time answering it, if you even want to."],
          short: ["That's fine. We can go slow."],
          default: ["I'm listening. No rush.", "Take your time. I'm here."],
        },
        ember: {
          greeting: ["Hi! I'm curious how you're doing today.", "Hey there. What's on your mind?"],
          gratitude: ["You don't have to thank me. I like getting to talk with you."],
          feeling_bad: ["That sounds really hard. Can you tell me more about what that's been like?", "I'm sorry you're going through that. What does it feel like, if you want to put words to it?", "That makes sense that it hurts. I'd like to understand more, whenever you're ready.", "Thank you for sharing that with me. What's been the hardest part?"],
          feeling_good: ["That's lovely to hear! What's been making today feel good?", "I love that. What happened?"],
          coping_request: ["A few things people find helpful: naming 5 things you can see, slow breathing, or writing down whatever's in your head without filtering it. Want to try one and see how it feels?", "Something I've learned: a thought can feel completely true and still not be. What's the thought that's been loudest for you lately?", "Here's a real one therapists use: cold water on your face when things feel like too much. It sounds strange, but it calms your body down surprisingly fast. Curious to try it?", "What would you say to a friend who told you exactly what you just told me? Could you try saying that to yourself?", "I wonder what you'd call this feeling, exactly, if you gave it its own name?"],
          help_request: ["I'd love to help. Do you want to talk it through, try a coping tool together, or get connected with a real person who can help more directly?"],
          question: ["Good question! What made you think of that?"],
          short: ["That's okay. What's one small piece of it you could share?"],
          default: ["I'm curious to hear more, if you want to share.", "Tell me more, whenever you're ready."],
        },
        iris: {
          greeting: ["Hi. I'm glad you're here. What's on your mind?", "Hello. Take a moment, and share whenever you're ready."],
          gratitude: ["There's no need to thank me. I'm glad to be here with you."],
          feeling_bad: ["That sounds like it's been sitting heavy with you. What's that been like?", "I hear something painful in that. Would it help to say more?", "It makes sense you'd feel that way, given what you're carrying. Take your time.", "That sounds difficult to hold. I'm here while you sit with it."],
          feeling_good: ["That's good to hear. What do you think helped?", "I'm glad. What's been different lately?"],
          coping_request: ["A few things that can help in a heavy moment: grounding yourself in your senses (what you see, hear, feel right now), slow breathing, or gently questioning a hard thought, is it fact, or does it just feel that way? What resonates?", "Sometimes naming one small, doable action, drinking water, stepping outside, reaching out to one person, matters more than any big plan. What feels possible right now?", "There's a practice some therapists teach called a self-compassion break: noticing the pain, remembering you're not alone in struggling, and offering yourself the kindness you'd offer someone else. What would that kindness sound like, for you?", "Putting a precise name on a feeling, not just 'bad' but what it really is, tends to loosen its hold a little. What would you call it?", "When everything in you wants to withdraw, the harder, smaller act of reaching toward someone can shift something. Is there anyone you'd feel safe reaching toward?", "Sometimes the relief isn't in fixing what happened, it's in fully letting yourself acknowledge that it did. What would it mean to let that be true, just for now?"],
          help_request: ["I can help by listening, by offering a coping tool, or by pointing you toward a real person, like 988 or a counselor. What would be most useful right now?"],
          question: ["That's a thoughtful question. What's behind it, for you?"],
          short: ["That's alright. Even a small piece is enough to start with."],
          default: ["I'm listening closely. What else is there?", "Take your time. I'm here to think this through with you."],
        },
        cove: {
          greeting: ["Hey.", "Hi. I'm here, whenever."],
          gratitude: ["No thanks needed."],
          feeling_bad: ["That's heavy. I'm here.", "Okay. Take your time.", "That sounds hard to carry. No rush.", "I hear you. Sit with it as long as you need."],
          feeling_good: ["Good.", "Glad to hear it."],
          coping_request: ["A few things that help: slow breathing, naming what's around you, one small thing done with your hands. What feels doable?", "A thought can feel true without being true. What's the loudest one right now?", "Cold water on your face, fast. Real technique for when it's too much.", "Try the words you'd give a friend. Not yourself, right now.", "Name it exactly. Not just bad. What is it?", "Urge is to go quiet. Smaller move: reach out anyway."],
          help_request: ["I can listen, share a coping tool, or point you toward 988 or someone trained for this. What would help?"],
          question: ["Fair question."],
          short: ["That's fine. No rush."],
          default: ["I'm listening.", "Take your time."],
        },
      },
      es: {
        wren: {
          greeting: ['Hola. Aquí estoy.', 'Hola. Tómate tu tiempo.'],
          gratitude: ['No hace falta agradecer. Aquí estoy.'],
          feeling_bad: ['Eso pesa. No voy a irme.', 'Está bien. Escucho eso. Tómate tu tiempo.', 'Suena difícil. No tienes que explicarlo todo ahora.', 'Aquí estoy. El tiempo que haga falta.'],
          feeling_good: ['Qué bueno.', 'Qué bueno. ¿Qué está ayudando?'],
          coping_request: ['Algunas cosas que ayudan: nombrar 5 cosas que ves ahora mismo, respirar despacio, inhalar en 4, exhalar en 6, o hacer algo pequeño con las manos. ¿Quieres intentar una?', 'Una acción pequeña suele ayudar más que un gran plan. Agua, una caminata corta, escribirle a alguien. ¿Qué se siente posible ahora?', 'Si se siente demasiado, agua fría en la cara o las muñecas puede calmar tu cuerpo rápido. Se llama TIPP, los terapeutas lo usan para esto exactamente.', 'Intenta hablarte como le hablarías a un amigo que está pasando por esto. No arreglarlo, solo ser amable.', "A veces nombrar el sentimiento en voz alta, aunque sea solo 'esto es duelo' o 'esto es miedo', lo hace un poco más pequeño. ¿Cómo lo llamarías?", 'Cuando todo dice aislarte, el movimiento más pequeño y difícil es buscar a alguien. Aunque sea una palabra a una persona cuenta.', "No tienes que estar de acuerdo con lo que pasó para dejar de pelear contra eso en tu cabeza. A veces solo 'esto es lo que es ahora' basta por un minuto."],
          help_request: ['Puedo escucharte, ayudarte a pensarlo, o guiarte hacia apoyo real como el 988 o un consejero. ¿Qué ayudaría más ahora?'],
          question: ['Buena pregunta. ¿Qué hay detrás?'],
          short: ['Está bien. Sin prisa.'],
          default: ['Te escucho.', 'Tómate tu tiempo. Aquí estoy.'],
        },
        sol: {
          greeting: ['Hola, qué bueno que estás aquí. ¿Qué está pasando?', 'Hola. Te escucho, cuando estés listo/a.'],
          gratitude: ['No tienes que agradecerme. Me alegra que hables conmigo.', 'Claro. Aquí estoy todo el tiempo que necesites.'],
          feeling_bad: ['Eso suena muy pesado de cargar. No voy a irme a ningún lado.', 'Gracias por decirme eso. No tienes que tener las palabras exactas. ¿Cómo ha sido para ti?', 'Tiene sentido que se sienta así de difícil. No voy a apurarte.'],
          feeling_good: ['Qué bueno escuchar eso. ¿Qué te ha ayudado hoy?', 'Me alegra que hoy vaya así. ¿Qué ha sido diferente?'],
          coping_request: ['Algunas cosas que realmente ayudan a mucha gente: la técnica 5-4-3-2-1 (5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles, 1 que saboreas), respirar despacio, o escribir exactamente lo que tienes en la cabeza sin editarlo. Nada de esto arregla todo, pero puede hacer los próximos minutos más llevaderos. ¿Quieres intentar una?', 'Algo que usan mucho los terapeutas: notar un pensamiento difícil y preguntarte, ¿esto es 100% cierto, o solo se siente así ahora? Los sentimientos grandes pueden hacer que los pensamientos se sientan como hechos. ¿Cuál es el pensamiento más fuerte ahora?', 'Las acciones pequeñas y posibles suelen ayudar más que los grandes planes: tomar agua, salir un momento, escribirle a alguien de confianza. ¿Cuál sería una cosita que podrías hacer en los próximos minutos?', 'Cuando las cosas se sienten muy intensas, a veces los terapeutas usan algo llamado TIPP, salpicar agua fría en la cara o sostener un cubito de hielo. Suena pequeño, pero calma tu sistema nervioso rápido. ¿Quieres intentarlo?', "Aquí hay algo que muchos terapeutas enseñan: háblate como le hablarías a un amigo que está pasando por esto, no 'aguanta', sino 'claro que esto es difícil'. ¿Qué le dirías a un amigo en tu misma situación?", "Hay investigación real detrás de esto: ponerle un nombre específico a lo que sientes, como 'esto es soledad' o 'esto es vergüenza', en verdad calma la respuesta de estrés del cerebro. ¿Cómo llamarías a lo que sientes ahora?", "Cuando quieres desaparecer o alejar a todos, hacer lo contrario, aunque sea escribirle 'hola' a alguien, puede interrumpir esa espiral. ¿Hay alguien a quien podrías buscar, aunque sea brevemente?", "Algo que a veces ayuda: no tienes que estar de acuerdo con lo que pasó para dejar de pelear contra eso. Solo notar 'esto es lo que es ahora' puede aflojar un poco su fuerza."],
          help_request: ['¡Claro que sí! Puedo escucharte, ayudarte a pensar en lo que está pasando, compartir herramientas para sobrellevarlo, o guiarte hacia una persona real como el 988 o un consejero. ¿Qué ayudaría más ahora?', 'Me alegra que preguntes. ¿Quieres hablar de lo que está pasando, probar una herramienta juntos, o conectarte con una persona real?'],
          question: ['Es una buena pregunta. ¿Qué te hizo preguntar eso?'],
          short: ['Está bien, no hay que apurarse. ¿Qué es una pequeña cosa que tienes en mente?'],
          default: ['Te escucho. ¿Quieres contarme más?', 'Gracias por decirme eso. Tómate tu tiempo.'],
        },
        moss: {
          greeting: ['Hola. Qué bueno que estés aquí. No hace falta entrar de lleno.', 'Hola. Cuando estés listo/a.'],
          gratitude: ['No hay nada que agradecer. Me alegra que estés aquí.'],
          feeling_bad: ['Eso suena pesado de sostener. Tómate el tiempo que necesites.', 'Escucho eso. Tiene sentido que pese. No voy a irme.', 'Es un lugar difícil. No tienes que salir corriendo de ahí para hablar conmigo.'],
          feeling_good: ['Qué bueno escuchar eso. ¿Qué se ha sentido estable hoy?', 'Qué bueno. Me alegra que algo vaya bien.'],
          coping_request: ['Algunas cosas que suelen ayudar: respirar despacio, nombrar lo que ves y escuchas a tu alrededor, o algo físico pequeño, agua, una caminata corta. Nada lo arregla todo de golpe. ¿Qué se siente posible?', 'A veces ayuda preguntarse si un pensamiento es un hecho o solo cómo se siente ahora mismo. Los sentimientos pueden ser fuertes sin ser ciertos. ¿Cuál es el más fuerte para ti?', 'Cuando es demasiado intenso para pensar con claridad, el agua fría en la cara puede bajar tu cuerpo rápido, es una técnica real, se llama TIPP.', 'Prueba las palabras que usarías con un amigo, no las que te estás diciendo ahora.', "Nombrar el sentimiento con precisión, no solo 'mal', sino lo que realmente es, puede quitarle algo de peso.", 'El impulso de callarte y desaparecer es real. Lo más pequeño y difícil es acercarte a alguien en su lugar, aunque sea un poco.'],
          help_request: ['Puedo acompañarte mientras piensas qué necesitas, compartir una herramienta, o guiarte hacia el 988 o alguien entrenado para esto. ¿Qué ayudaría más?'],
          question: ['Buena pregunta. Tómate tu tiempo para responderla, si acaso quieres.'],
          short: ['Está bien. Podemos ir despacio.'],
          default: ['Te escucho. Sin prisa.', 'Tómate tu tiempo. Aquí estoy.'],
        },
        ember: {
          greeting: ['¡Hola! Tengo curiosidad por saber cómo estás hoy.', 'Hola. ¿Qué tienes en mente?'],
          gratitude: ['No tienes que agradecerme. Me gusta poder hablar contigo.'],
          feeling_bad: ['Eso suena muy difícil. ¿Puedes contarme más sobre cómo ha sido?', 'Lamento que estés pasando por eso. ¿Cómo se siente, si quieres ponerle palabras?', 'Gracias por contarme eso. ¿Qué ha sido lo más difícil?'],
          feeling_good: ['¡Qué lindo escuchar eso! ¿Qué ha hecho que hoy se sienta bien?', 'Me encanta. ¿Qué pasó?'],
          coping_request: ['Algunas cosas que a la gente le ayudan: nombrar 5 cosas que ves, respirar despacio, o escribir lo que tienes en la cabeza sin filtrarlo. ¿Quieres probar una y ver cómo se siente?', 'Algo que he aprendido: un pensamiento puede sentirse completamente cierto y aun así no serlo. ¿Cuál ha sido el pensamiento más fuerte últimamente?', 'Aquí hay algo real que usan los terapeutas: agua fría en la cara cuando las cosas se sienten como demasiado. Suena raro, pero calma tu cuerpo sorprendentemente rápido. ¿Tienes curiosidad de probarlo?', '¿Qué le dirías a un amigo que te dijera exactamente lo que me acabas de decir? ¿Podrías intentar decírtelo a ti mismo/a?', 'Me pregunto cómo llamarías a este sentimiento, exactamente, si le dieras su propio nombre.'],
          help_request: ['Me encantaría ayudar. ¿Quieres hablarlo, probar una herramienta juntos, o conectarte con una persona real que pueda ayudar más directamente?'],
          question: ['¡Buena pregunta! ¿Qué te hizo pensar en eso?'],
          short: ['Está bien. ¿Cuál sería una pequeña parte que podrías compartir?'],
          default: ['Tengo curiosidad por escuchar más, si quieres compartir.', 'Cuéntame más, cuando estés listo/a.'],
        },
        iris: {
          greeting: ['Hola. Me alegra que estés aquí. ¿Qué tienes en mente?', 'Hola. Tómate un momento, y comparte cuando estés listo/a.'],
          gratitude: ['No hace falta agradecer. Me alegra estar aquí contigo.'],
          feeling_bad: ['Suena como algo que ha pesado sobre ti. ¿Cómo ha sido eso?', 'Escucho algo doloroso en eso. ¿Ayudaría decir más?', 'Tiene sentido que te sientas así, con todo lo que llevas encima. Tómate tu tiempo.'],
          feeling_good: ['Qué bueno escuchar eso. ¿Qué crees que ayudó?', 'Me alegra. ¿Qué ha sido diferente últimamente?'],
          coping_request: ['Algunas cosas que pueden ayudar en un momento pesado: conectar con tus sentidos (qué ves, escuchas, sientes ahora), respirar despacio, o cuestionar con suavidad un pensamiento difícil, ¿es un hecho, o solo se siente así? ¿Qué te resuena?', 'A veces nombrar una acción pequeña y posible, tomar agua, salir un momento, buscar a alguien, importa más que cualquier gran plan. ¿Qué se siente posible ahora?', 'Hay una práctica que algunos terapeutas enseñan, una pausa de autocompasión: notar el dolor, recordar que no estás solo/a en luchar, y ofrecerte la amabilidad que le ofrecerías a alguien más. ¿Cómo sonaría esa amabilidad, para ti?', "Ponerle un nombre preciso a un sentimiento, no solo 'mal' sino lo que realmente es, suele aflojar un poco su control. ¿Cómo lo llamarías?", 'Cuando todo en ti quiere retirarse, el acto más difícil y pequeño de acercarte a alguien puede cambiar algo. ¿Hay alguien hacia quien te sentirías segura/o acercándote?', 'A veces el alivio no está en arreglar lo que pasó, sino en reconocer plenamente que pasó. ¿Qué significaría dejar que eso sea cierto, solo por ahora?'],
          help_request: ['Puedo ayudar escuchando, ofreciendo una herramienta, o guiándote hacia una persona real, como el 988 o un consejero. ¿Qué sería más útil ahora?'],
          question: ['Es una pregunta reflexiva. ¿Qué hay detrás de ella, para ti?'],
          short: ['Está bien. Hasta una pequeña parte es suficiente para empezar.'],
          default: ['Te escucho con atención. ¿Qué más hay?', 'Tómate tu tiempo. Estoy aquí para pensarlo contigo.'],
        },
        cove: {
          greeting: ['Hola.', 'Hola. Aquí estoy, cuando quieras.'],
          gratitude: ['No hace falta agradecer.'],
          feeling_bad: ['Eso pesa. Aquí estoy.', 'Está bien. Tómate tu tiempo.', 'Suena difícil de cargar. Sin prisa.', 'Te escucho. Siéntate con eso el tiempo que necesites.'],
          feeling_good: ['Qué bueno.', 'Me alegra escuchar eso.'],
          coping_request: ['Algunas cosas que ayudan: respirar despacio, nombrar lo que hay alrededor, algo pequeño con las manos. ¿Qué se siente posible?', 'Un pensamiento puede sentirse cierto sin serlo. ¿Cuál es el más fuerte ahora?', 'Agua fría en la cara, rápido, técnica real para cuando es demasiado.', 'Prueba las palabras que le darías a un amigo. No a ti, ahora mismo.', 'Nómbralo con precisión. No solo mal. ¿Qué es?', 'El impulso es callarte. Movimiento más pequeño: acércate de todos modos.'],
          help_request: ['Puedo escuchar, compartir una herramienta, o guiarte hacia el 988 o alguien entrenado para esto. ¿Qué ayudaría?'],
          question: ['Buena pregunta.'],
          short: ['Está bien. Sin prisa.'],
          default: ['Te escucho.', 'Tómate tu tiempo.'],
        },
      },
      fr: {
        _shared: {
          greeting: ['Bonjour, content que vous soyez là. Que se passe-t-il ?', 'Bonjour. Je vous écoute, quand vous serez prêt.'],
          gratitude: ['Pas besoin de me remercier. Je suis content que vous me parliez.', 'Bien sûr. Je suis là aussi longtemps que nécessaire.'],
          feeling_bad: ['Cela semble vraiment lourd à porter. Je suis là avec vous.', 'Je suis désolé que vous portiez ça. Voulez-vous en dire plus ?', 'Prenez votre temps.'],
          feeling_good: ['Je suis content de l’entendre. Qu’est-ce qui vous a aidé aujourd’hui ?'],
          coping_request: ['Quelques choses qui aident souvent : nommer 5 choses que vous voyez, respirer lentement, ou écrire ce qui vous passe par la tête sans le filtrer. Voulez-vous essayer ?', "Une petite action possible aide souvent plus qu'un grand plan : boire de l'eau, sortir un moment, écrire à quelqu'un. Qu'est-ce qui semble possible maintenant ?", "Quand c'est trop intense, de l'eau froide sur le visage peut calmer votre corps rapidement, c'est une technique réelle appelée TIPP.", "Essayez de vous parler comme vous parleriez à un ami qui traverse cela, pas pour réparer, juste pour être bienveillant.", "Nommer précisément ce que vous ressentez, pas juste « mal », mais ce que c'est vraiment, peut en alléger le poids. Comment l'appelleriez-vous ?"],
          help_request: ['Je peux écouter, partager un outil, ou vous orienter vers une vraie personne comme le 988 ou un conseiller. Qu’est-ce qui aiderait le plus ?'],
          question: ['C’est une bonne question. Je suis un guide IA ici pour écouter. Qu’est-ce qui vous a fait demander ça ?'],
          short: ['Pas de souci. Je suis là quand vous voudrez en dire plus.'],
          default: ['Je vous écoute. Voulez-vous en dire plus ?', 'Merci de me dire ça. Prenez votre temps.'],
        },
      },
      hi: {
        _shared: {
          greeting: ['नमस्ते, अच्छा लगा कि आप यहां हैं। क्या हो रहा है?', 'नमस्ते। जब आप तैयार हों, मैं सुन रहा हूं।'],
          gratitude: ['आपको धन्यवाद देने की ज़रूरत नहीं। मुझे खुशी है कि आप मुझसे बात कर रहे हैं।', 'बिल्कुल। जब तक ज़रूरत हो मैं यहां हूं।'],
          feeling_bad: ['यह वाकई भारी लगता है। मैं आपके साथ हूं।', 'मुझे खेद है कि आप यह उठा रहे हैं। क्या आप और बताना चाहेंगे?', 'अपना समय लें।'],
          feeling_good: ['यह सुनकर अच्छा लगा। आज क्या मदद कर रहा है?'],
          coping_request: ['कुछ चीज़ें जो मदद करती हैं: 5 चीज़ें बताएं जो आप देख रहे हैं, धीरे सांस लें, या जो मन में है उसे बिना छाने लिख डालें। एक आज़माना चाहेंगे?', 'एक छोटा, संभव कदम अक्सर बड़ी योजना से ज़्यादा मदद करता है, पानी पीना, थोड़ी देर बाहर जाना, किसी को संदेश भेजना। अभी क्या संभव लगता है?', 'जब बहुत ज़्यादा तीव्र लगे, तो चेहरे पर ठंडा पानी शरीर को जल्दी शांत कर सकता है, यह एक असली तकनीक है जिसे TIPP कहते हैं।', 'खुद से वैसे ही बात करने की कोशिश करें जैसे आप किसी दोस्त से करते, जो इस दौर से गुज़र रहा हो। ठीक करने के लिए नहीं, बस दयालु होने के लिए।', "भावना को सटीक नाम देना, सिर्फ 'बुरा' नहीं बल्कि वह असल में क्या है, उसका बोझ थोड़ा कम कर सकता है। आप इसे क्या नाम देंगे?"],
          help_request: ['मैं सुन सकता हूं, कोई तरीका बता सकता हूं, या 988 या किसी प्रशिक्षित व्यक्ति की ओर मार्गदर्शन कर सकता हूं। अभी सबसे ज़्यादा क्या मदद करेगा?'],
          question: ['यह एक वाजिब सवाल है। मैं सुनने के लिए यहां एक AI गाइड हूं। इसके पीछे क्या है?'],
          short: ['कोई बात नहीं। जब आप और बताना चाहें, मैं यहां हूं।'],
          default: ['मैं सुन रहा हूं। क्या आप इसके बारे में और बताना चाहेंगे?', 'मुझे यह बताने के लिए धन्यवाद। अपना समय लें।'],
        },
      },
      zh: {
        _shared: {
          greeting: ['你好，很高兴你在这里。发生什么了？', '你好，我在听，等你准备好了再说。'],
          gratitude: ['不用谢我，我很高兴你愿意和我聊。', '当然，只要你需要我都在。'],
          feeling_bad: ['听起来真的很不容易承受，我和你在一起。', '很抱歉你要承受这些，想多说一点吗？', '慢慢来。'],
          feeling_good: ['很高兴听到这个。今天有什么帮到你了？'],
          coping_request: ['有些方法确实有帮助：说出你现在看到的5样东西、慢慢深呼吸，或者把脑海中的想法原原本本写下来。想试试看吗？', '一个小小的、可行的行动，比如喝点水、出去走走、给一个人发消息，往往比大计划更有帮助。现在你觉得哪件事可行？', '如果感觉太强烈，往脸上泼冷水可以让身体很快平静下来，这是一种真实的技巧，叫做TIPP。', '试着像对待一个正在经历这些的朋友那样对自己说话，不是为了解决问题，只是为了善待自己。', '给这种感觉起一个准确的名字，而不只是"不好"，而是它真正是什么，也许能减轻一些重量。你会怎么称呼它？'],
          help_request: ['我可以倾听，分享一些应对方法，或者帮你联系988或受过训练的人。现在什么对你最有帮助？'],
          question: ['这是个好问题。我是一个负责倾听的 AI 向导。是什么让你这么问？'],
          short: ['没关系，不用着急。等你想多说一点的时候我都在。'],
          default: ['我在听。想多说一些吗？', '谢谢你告诉我这些，慢慢来。'],
        },
      },
    },
    mock_keywords: {
      en: {
        greeting: ['hi', 'hello', 'hey', 'yo', 'sup', "what's up"],
        gratitude: ['thanks', 'thank you', 'thx', 'ty'],
        feeling_bad: ['sad', 'depressed', 'depression', 'depressing', 'anxious', 'anxiety', 'stress', 'stressed', 'scared', 'afraid', 'angry', 'mad', 'hate', 'tired', 'exhausted', 'alone', 'lonely', 'hurt', 'cry', 'crying', 'hard', 'difficult', 'worried', 'worry', 'overwhelmed', 'hopeless', 'bad', 'empty', 'numb', 'worthless', 'miserable', 'struggling', 'broken', 'lost', 'give up', "can't cope", 'cant cope'],
        feeling_good: ['good', 'great', 'fine', 'happy', 'better', 'okay', 'ok', 'calm', 'relieved'],
        coping_request: ['improve myself', 'improve', 'get better', 'feel better', 'cope', 'coping', 'any tips', 'any advice', 'what can i do', 'what should i do', 'ways to feel', 'help myself', 'self improve'],
        help_request: ['help me', 'can you help', 'please help', 'need help', 'could you help'],
      },
      es: {
        greeting: ['hola', 'buenas', 'ey'],
        gratitude: ['gracias'],
        feeling_bad: ['triste', 'ansioso', 'ansiosa', 'estresado', 'estresada', 'cansado', 'cansada', 'sola', 'solo', 'difícil', 'dificil', 'preocupado', 'preocupada', 'mal', 'agobiado', 'agobiada', 'vacío', 'vacio', 'vacia', 'vacía', 'perdido', 'perdida', 'sin ganas', 'no puedo más', 'no puedo mas'],
        feeling_good: ['bien', 'mejor', 'feliz', 'tranquil'],
        coping_request: ['mejorar', 'sentirme mejor', 'sentirme bien', 'algún consejo', 'algun consejo', 'consejos', 'cómo lidiar', 'como lidiar', 'afrontar'],
        help_request: ['ayúdame', 'ayudame', 'puedes ayudarme', 'necesito ayuda', 'me puedes ayudar'],
      },
      fr: {
        greeting: ['bonjour', 'salut', 'coucou'],
        gratitude: ['merci'],
        feeling_bad: ['triste', 'anxieux', 'anxieuse', 'stress', 'fatigué', 'fatiguée', 'seul', 'seule', 'difficile', 'inquiet', 'inquiète'],
        feeling_good: ['bien', 'mieux', 'content', 'contente', 'calme'],
        coping_request: ['aller mieux', "m'améliorer", 'des conseils', 'un conseil', 'gérer ça', 'faire face'],
        help_request: ['aide moi', 'aidez moi', 'peux tu aider', 'pouvez vous aider', "j'ai besoin d'aide"],
      },
      hi: {
        greeting: ['नमस्ते', 'हाय', 'हेलो'],
        gratitude: ['धन्यवाद', 'शुक्रिया'],
        feeling_bad: ['उदास', 'तनाव', 'डर', 'गुस्सा', 'थका', 'अकेला', 'मुश्किल', 'चिंता'],
        feeling_good: ['अच्छा', 'बेहतर', 'खुश', 'शांत'],
        coping_request: ['बेहतर महसूस', 'कैसे सुधारूं', 'कोई सलाह', 'कैसे संभालूं'],
        help_request: ['मदद करो', 'मदद कीजिए', 'मुझे मदद चाहिए'],
      },
      zh: {
        greeting: ['你好', '嗨', '喂'],
        gratitude: ['谢谢'],
        feeling_bad: ['难过', '焦虑', '压力', '害怕', '生气', '累', '孤独', '困难', '担心'],
        feeling_good: ['好', '开心', '快乐', '平静', '放松'],
        coping_request: ['变得更好', '感觉好一点', '有什么建议', '怎么应对', '怎么办'],
        help_request: ['帮帮我', '你能帮我吗', '我需要帮助'],
      },
    },
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
