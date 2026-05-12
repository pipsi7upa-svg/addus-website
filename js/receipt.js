// Sonderangebot — Quittungs-Animation (Motion One)
// Receipt items typewriter-stagger + price counter + stamp drop on view
import { animate, inView, stagger } from 'https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm';

(function () {
  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const receipt = document.getElementById('receipt');
  if (!receipt) return;

  // — Live date stamp (looks like real receipt) —
  const dateEl = document.getElementById('receiptDate');
  if (dateEl) {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    dateEl.textContent = `${dd} · ${mm} · MMXXVI`;
  }

  const items = receipt.querySelectorAll('[data-line]');
  const counter = document.getElementById('priceCounter');
  const stamp = document.getElementById('receiptStamp');
  const sigPath = document.getElementById('receiptSigPath');

  // Reset stamp inline state (override earlier styles for clean animation)
  if (stamp) {
    stamp.style.opacity = '0';
    stamp.style.transform = 'scale(2.6) rotate(-32deg)';
  }

  inView(receipt, () => {
    // 1) Items typewriter-style stagger
    if (items.length) {
      animate(
        items,
        { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0px)'] },
        { duration: 0.5, delay: stagger(0.06), easing: [0.2, 0.8, 0.2, 1] }
      );
    }

    // 2) Counter 1999 → 699 with smooth ease, kicks in after items finish
    if (counter) {
      const from = parseInt(counter.dataset.from, 10);
      const to   = parseInt(counter.dataset.to, 10);
      animate(
        (progress) => {
          const v = Math.round(from + (to - from) * progress);
          counter.textContent = v;
        },
        { duration: 1.2, delay: 1.0, easing: [0.16, 0.84, 0.3, 1] }
      );
    }

    // 3) Stamp drop with spring-like overshoot at counter end
    if (stamp) {
      animate(
        stamp,
        {
          opacity: [0, 1, 0.92],
          transform: [
            'scale(2.6) rotate(-32deg)',
            'scale(0.85) rotate(-4deg)',
            'scale(1) rotate(-9deg)'
          ]
        },
        { duration: 0.7, delay: 2.05, easing: [0.34, 1.56, 0.64, 1] }
      );

      // Tiny secondary shake — like ink settling
      setTimeout(() => {
        animate(
          stamp,
          { transform: ['scale(1) rotate(-9deg)', 'scale(1.02) rotate(-9.5deg)', 'scale(1) rotate(-9deg)'] },
          { duration: 0.18, easing: 'ease-out' }
        );
      }, 2820);
    }

    // 4) Signature draws after stamp
    if (sigPath) {
      animate(
        sigPath,
        { strokeDashoffset: [100, 0] },
        { duration: 1.4, delay: 2.3, easing: [0.65, 0, 0.35, 1] }
      );
    }
  }, { amount: 0.25 });
})();
