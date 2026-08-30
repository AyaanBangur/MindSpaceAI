// MindSpace — shared guide roster.
// Used by index.html (picker) and chat.html (conversation). Keep this file
// as the single source of truth for guide id/color/voice tuning so the two
// pages never drift out of sync.
(function () {
  const GUIDES = [
    {
      id: 'wren', color: '#6FBF8B', pitch: 0.85, rate: 0.95, gender: 'male',
      name: { en: 'Wren', es: 'Wren', fr: 'Wren', hi: 'रेन', zh: '雷恩' },
      vibe: {
        en: 'steady and quiet', es: 'firme y tranquilo/a', fr: 'posé et discret',
        hi: 'स्थिर और शांत', zh: '沉稳而安静',
      },
    },
    {
      id: 'sol', color: '#FFB84D', pitch: 1.2, rate: 1.0, gender: 'female',
      name: { en: 'Sol', es: 'Sol', fr: 'Sol', hi: 'सोल', zh: '索尔' },
      vibe: {
        en: 'warm and encouraging', es: 'cálido/a y alentador/a', fr: 'chaleureux et encourageant',
        hi: 'गर्मजोश और उत्साहवर्धक', zh: '温暖而鼓励人心',
      },
    },
    {
      id: 'moss', color: '#4F9E6E', pitch: 0.75, rate: 0.9, gender: 'male',
      name: { en: 'Moss', es: 'Moss', fr: 'Moss', hi: 'मॉस', zh: '莫斯' },
      vibe: {
        en: 'grounded, doesn’t rush you', es: 'con los pies en la tierra, sin prisa', fr: 'ancré, ne vous presse jamais',
        hi: 'धैर्यवान, जल्दबाज़ी नहीं करता', zh: '踏实，从不催促你',
      },
    },
    {
      id: 'ember', color: '#FF8F6B', pitch: 1.15, rate: 1.0, gender: 'female',
      name: { en: 'Ember', es: 'Ember', fr: 'Ember', hi: 'एम्बर', zh: '艾姆伯' },
      vibe: {
        en: 'gentle and curious', es: 'suave y curioso/a', fr: 'doux et curieux',
        hi: 'सौम्य और जिज्ञासु', zh: '温柔而好奇',
      },
    },
    {
      id: 'iris', color: '#A78BFA', pitch: 1.25, rate: 0.97, gender: 'female',
      name: { en: 'Iris', es: 'Iris', fr: 'Iris', hi: 'आइरिस', zh: '艾莉丝' },
      vibe: {
        en: 'thoughtful, asks gentle questions', es: 'reflexivo/a, hace preguntas suaves', fr: 'réfléchi, pose des questions douces',
        hi: 'विचारशील, सौम्य प्रश्न पूछता है', zh: '善于思考，会温柔地提问',
      },
    },
    {
      id: 'cove', color: '#5FA8D3', pitch: 0.8, rate: 0.92, gender: 'male',
      name: { en: 'Cove', es: 'Cove', fr: 'Cove', hi: 'कोव', zh: '科夫' },
      vibe: {
        en: 'calm, comfortable with silence', es: 'tranquilo/a, cómodo/a con el silencio', fr: 'calme, à l’aise avec le silence',
        hi: 'शांत, मौन के साथ सहज', zh: '平静，能自在地与沉默相处',
      },
    },
  ];

  function getGuide(id) {
    return GUIDES.find((g) => g.id === id) || GUIDES[1];
  }

  window.MindspaceGuides = { GUIDES, getGuide };
})();
