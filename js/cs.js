// Customer Story — minimal editorial animation
// Most reveals are handled by the global .reveal observer (gentle fade-up).
// This module only adds 3 signature touches that reinforce the story:
//   • Portrait develops from top (clip-path) — humanizes Michael B.
//   • Dropcap "Z" spring scale-in — editorial flourish
//   • Stat counters roll from 0 — proof effect
//   • CTA arrow nudges on hover — small life
//
// Everything else (headline, byline, lede/body, quote, data caption,
// CTA fade) is intentionally left static / handled by .reveal — the
// section sits between two animation-heavy sections (Werkschau + Sonderangebot)
// and works best as a calm reading moment.

import { animate, inView } from 'https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm';

(function () {
  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const cs = document.querySelector('.cs');
  if (!cs) return;

  const dropcap     = cs.querySelector('.cs__dropcap');
  const stats       = Array.from(cs.querySelectorAll('.cs__stat'));
  const cta         = cs.querySelector('.cs__cta');

  // ── Initial hidden states (only for the elements we animate specially) ──
  if (dropcap) {
    dropcap.style.opacity = '0';
    dropcap.style.transform = 'scale(0.55) rotate(-6deg)';
    dropcap.style.display = 'inline-block';
    dropcap.style.transformOrigin = 'center';
  }

  const easeOut = [0.16, 0.84, 0.3, 1];
  const backOut = [0.34, 1.56, 0.64, 1];

  // Counter — pure rAF (Motion function-driver was unreliable here).
  // Handles "4", "3", "1,8" — skips zero values.
  function runCounter(emEl, delaySec) {
    const raw = emEl.textContent.trim();
    const isDecimal = raw.includes(',');
    const target = parseFloat(raw.replace(',', '.'));
    if (isNaN(target) || target === 0) return;
    emEl.textContent = isDecimal ? '0,0' : '0';
    const duration = 1400;
    setTimeout(() => {
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        const v = target * eased;
        emEl.textContent = isDecimal
          ? v.toFixed(1).replace('.', ',')
          : Math.round(v).toString();
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delaySec * 1000);
  }

  inView(cs, () => {
    // Dropcap spring-scales in
    if (dropcap) {
      animate(dropcap,
        { opacity: [0, 1], transform: ['scale(0.55) rotate(-6deg)', 'scale(1) rotate(0deg)'] },
        { duration: 0.75, delay: 0.55, easing: backOut });
    }

    // Stat counters roll up (proof)
    stats.forEach((s, i) => {
      const em = s.querySelector('.cs__stat-num em');
      if (em) runCounter(em, 0.9 + i * 0.12);
    });

    // The "0 Nachverhandlungen" stat doesn't roll — instead a red Lektor
    // circle draws around it AFTER the other counters land, marking it
    // visually: "no, this zero is deliberate."
    const zeroEl = cs.querySelector('.cs__stat-zero');
    if (zeroEl) {
      // counters finish at 0.9 + 3*0.12 + 1.4 ≈ 2.66s
      setTimeout(() => zeroEl.classList.add('is-circled'), 2700);
    }
  }, { amount: 0.2 });

  // CTA arrow nudges up-right on hover
  if (cta) {
    const arrow = cta.querySelector('i');
    if (arrow) {
      cta.addEventListener('mouseenter', () => animate(arrow,
        { transform: ['translate(0,0)', 'translate(4px,-4px)'] },
        { duration: 0.35, easing: easeOut }));
      cta.addEventListener('mouseleave', () => animate(arrow,
        { transform: ['translate(4px,-4px)', 'translate(0,0)'] },
        { duration: 0.35, easing: easeOut }));
    }
  }
})();
