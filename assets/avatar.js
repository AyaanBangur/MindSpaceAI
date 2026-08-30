// MindSpace — animated 2D avatar faces.
// Deliberately illustrated/abstract, not photorealistic: calmer for a
// distress-support context and far cheaper to build well. Each avatar is a
// plain SVG face (two eyes + a mouth) with CSS-driven blink/bob and a
// JS-toggled "talking" class synced to speech start/end.
(function () {
  function render(guide, size, opts) {
    opts = opts || {};
    const bob = opts.bob !== false; // idle bob on by default
    const blinkDelay = (Math.random() * 4).toFixed(2);
    const cls = ['avatar-face'];
    if (bob) cls.push('idle-bob');
    if (opts.extraClass) cls.push(opts.extraClass);
    return `
      <svg class="${cls.join(' ')}" data-guide="${guide.id}" viewBox="0 0 100 100"
           width="${size}" height="${size}" style="--blink-delay:${blinkDelay}s" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="${guide.color}" opacity="0.95"></circle>
        <circle cx="50" cy="50" r="46" fill="none" stroke="${guide.color}" stroke-opacity="0.35" stroke-width="6"></circle>
        <ellipse class="eye eye-l" cx="36" cy="45" rx="5" ry="6.2" fill="#1F3B3E"></ellipse>
        <ellipse class="eye eye-r" cx="64" cy="45" rx="5" ry="6.2" fill="#1F3B3E"></ellipse>
        <ellipse class="avatar-mouth" cx="50" cy="67" rx="11" ry="4" fill="#1F3B3E" opacity="0.85"></ellipse>
      </svg>`;
  }

  // Toggle the talking animation on every avatar instance for a given
  // guide id within `root` (defaults to the whole document). Multiple
  // instances of the same guide (e.g. a card + a header avatar) all animate
  // together.
  function setTalking(root, guideId, isTalking) {
    const scope = root || document;
    scope.querySelectorAll(`.avatar-face[data-guide="${guideId}"]`).forEach((el) => {
      el.classList.toggle('is-talking', !!isTalking);
    });
  }

  window.MindspaceAvatar = { render, setTalking };
})();
