/**
 * hero.js — Hero Section Interactions
 * addus. Web Agency
 */

(function () {
  'use strict';

  /* ─── Debug logger + persistent on-page panel (dev only) ───── */
  (function buildDebugPanel() {
    var isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.search.includes('debug');
    if (!isDev) { window._addusDBG = { addLine: function() {} }; return; }
    // Create the floating panel
    const panel = document.createElement('div');
    panel.id = 'addus-debug-panel';
    panel.innerHTML = `
      <div id="addus-dbg-header">
        <span>🐛 addus. debug</span>
        <div style="display:flex;gap:6px">
          <button id="addus-dbg-clear" title="Clear">✕ clear</button>
          <button id="addus-dbg-toggle" title="Minimize">▼</button>
        </div>
      </div>
      <div id="addus-dbg-body"></div>
    `;
    const style = document.createElement('style');
    style.textContent = `
      #addus-debug-panel {
        position: fixed; bottom: 16px; right: 16px; z-index: 99999;
        width: 420px; max-height: 320px;
        background: rgba(8,14,24,0.97); border: 1px solid rgba(0,194,255,0.35);
        border-radius: 10px; font-family: monospace; font-size: 11px;
        color: #e2e8f0; box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        display: flex; flex-direction: column; overflow: hidden;
        backdrop-filter: blur(12px);
      }
      #addus-dbg-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 6px 10px; background: rgba(0,194,255,0.12);
        border-bottom: 1px solid rgba(0,194,255,0.2);
        font-weight: 700; color: #00C2FF; cursor: move; user-select: none;
      }
      #addus-dbg-header button {
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
        color: #94a3b8; border-radius: 4px; padding: 2px 7px;
        font-size: 10px; cursor: pointer; font-family: monospace;
      }
      #addus-dbg-header button:hover { background: rgba(255,255,255,0.15); color: #fff; }
      #addus-dbg-body {
        overflow-y: auto; padding: 6px 8px; flex: 1;
        display: flex; flex-direction: column; gap: 2px;
      }
      #addus-dbg-body::-webkit-scrollbar { width: 4px; }
      #addus-dbg-body::-webkit-scrollbar-track { background: transparent; }
      #addus-dbg-body::-webkit-scrollbar-thumb { background: rgba(0,194,255,0.3); border-radius: 4px; }
      .dbg-line { padding: 2px 4px; border-radius: 3px; line-height: 1.4; word-break: break-all; }
      .dbg-line--log   { color: #cbd5e1; }
      .dbg-line--warn  { color: #fbbf24; background: rgba(251,191,36,0.07); }
      .dbg-line--error { color: #f87171; background: rgba(248,113,113,0.10); font-weight:700; }
      .dbg-line--group { color: #00C2FF; font-weight: 700; margin-top: 4px; border-top: 1px solid rgba(0,194,255,0.15); padding-top: 4px; }
      .dbg-ts { color: rgba(148,163,184,0.5); margin-right: 5px; }
      #addus-debug-panel.is-collapsed #addus-dbg-body { display: none; }
      #addus-debug-panel.is-collapsed { max-height: none; }
    `;
    document.head.appendChild(style);
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(panel), { once: true });
    // If DOM already ready:
    if (document.body) document.body.appendChild(panel);

    const body = () => document.getElementById('addus-dbg-body');

    const addLine = (level, ...args) => {
      const el = body();
      if (!el) return;
      const ts = new Date().toISOString().slice(11, 23);
      const text = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      const line = document.createElement('div');
      line.className = `dbg-line dbg-line--${level}`;
      line.innerHTML = `<span class="dbg-ts">${ts}</span>${text}`;
      el.appendChild(line);
      el.scrollTop = el.scrollHeight;
      // Keep max 120 entries
      while (el.children.length > 120) el.removeChild(el.firstChild);
    };

    // Buttons
    document.addEventListener('click', (e) => {
      if (e.target.id === 'addus-dbg-clear') {
        const el = body(); if (el) el.innerHTML = '';
      }
      if (e.target.id === 'addus-dbg-toggle') {
        panel.classList.toggle('is-collapsed');
        e.target.textContent = panel.classList.contains('is-collapsed') ? '▲' : '▼';
      }
    });

    // Draggable header
    const header = panel.querySelector('#addus-dbg-header');
    if (header) {
      let ox = 0, oy = 0, dragging = false;
      header.addEventListener('mousedown', (e) => {
        dragging = true;
        ox = e.clientX - panel.offsetLeft;
        oy = e.clientY - panel.offsetTop;
      });
      document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.left = (e.clientX - ox) + 'px';
        panel.style.top  = (e.clientY - oy) + 'px';
      });
      document.addEventListener('mouseup', () => { dragging = false; });
    }

    // Expose to DBG
    window._addusDBG = { addLine };
  })();

  const DBG = {
    _prefix: '%c[addus.showcase]',
    _style:  'color:#00C2FF;font-weight:700;font-family:monospace',
    _p(level, ...a) {
      console[level === 'log' ? 'log' : level === 'warn' ? 'warn' : 'error'](
        this._prefix, this._style, ...a
      );
      window._addusDBG?.addLine(level, ...a);
    },
    log  (...a) { this._p('log',   ...a); },
    warn (...a) { this._p('warn',  ...a); },
    error(...a) { this._p('error', ...a); },
    group(label) {
      console.group(`%c[addus.showcase] ${label}`, this._style);
      window._addusDBG?.addLine('group', `▶ ${label}`);
    },
    groupEnd() { console.groupEnd(); },
    table(data) {
      console.table(data);
      // Render as key:value lines in panel
      Object.entries(data).forEach(([k, v]) =>
        window._addusDBG?.addLine('log', `  ${k}: ${v}`)
      );
    },
  };

  DBG.log('hero.js loaded');

  /* ─── Respect reduced-motion preference ─────────── */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  DBG.log('prefersReducedMotion:', prefersReducedMotion);

  /* ─── Navbar scroll behavior ─────────────────────── */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    DBG.log('Navbar found — scroll listener attached');
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  } else {
    DBG.warn('Navbar element #navbar not found');
  }


  /* ─── Blob parallax (desktop + pointer device only) ─ */
  if (!prefersReducedMotion) {
    const blobs = document.querySelectorAll('.blob');
    const isHoverDevice = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;

    if (blobs.length && isHoverDevice) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let rafId = null;
      let blobsVisible = true;

      const onMouseMove = (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 50;
        targetY = (e.clientY / window.innerHeight - 0.5) * 50;
      };

      const tickBlobs = () => {
        if (!blobsVisible) return;
        currentX += (targetX - currentX) * 0.045;
        currentY += (targetY - currentY) * 0.045;

        blobs.forEach((blob, i) => {
          const factor = [1, -0.65, 0.45][i] ?? 1;
          blob.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
        });

        rafId = requestAnimationFrame(tickBlobs);
      };

      document.addEventListener('mousemove', onMouseMove, { passive: true });
      rafId = requestAnimationFrame(tickBlobs);

      // Pause when hero is out of view to save CPU
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        new IntersectionObserver(([entry]) => {
          blobsVisible = entry.isIntersecting;
          if (blobsVisible && !rafId) rafId = requestAnimationFrame(tickBlobs);
        }, { threshold: 0 }).observe(heroEl);
      }

      // Pause when tab is hidden to save CPU
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(rafId);
          rafId = null;
        } else if (blobsVisible) {
          rafId = requestAnimationFrame(tickBlobs);
        }
      });
    }
  }

  /* ─── Primary CTA ripple effect ──────────────────── */
  const primaryBtn = document.querySelector('.btn-primary');

  if (primaryBtn) {
    primaryBtn.addEventListener('click', function (e) {
      if (prefersReducedMotion) return;

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.22);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleOut 0.55s linear forwards;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  /* ─── Showcase iframe scaling ────────────────────── */
  const frames         = Array.from(document.querySelectorAll('.showcase-iframe'));
  const browserContent = document.querySelector('.showcase-panel--front');

  DBG.log(`Showcase: ${frames.length} iframes, front panel: ${!!browserContent}`);
  if (!frames.length)  DBG.error('No .showcase-iframe elements found');
  if (!browserContent) DBG.error('.showcase-panel--front not found — cannot scale frames');

  // Each iframe reads its own data-rw / data-rh for the best fit.
  // Fallback values if attributes are missing.
  const DEF_RW = 1300;
  const DEF_RH = 1100;

  const updateFrameScale = () => {
    if (!browserContent || !frames.length) return;
    const cw = browserContent.offsetWidth;
    const ch = browserContent.offsetHeight;
    if (cw < 10 || ch < 10) {
      DBG.warn(`updateFrameScale: container too small (${cw}×${ch}px)`);
      return;
    }
    frames.forEach((f) => {
      const rw = parseInt(f.dataset.rw, 10) || DEF_RW;
      const rh = parseInt(f.dataset.rh, 10) || DEF_RH;
      const scale = cw / rw;
      f.style.width           = rw + 'px';
      f.style.height          = rh + 'px';
      f.style.transform       = `scale(${scale})`;
      f.style.transformOrigin = '0 0';
    });
    DBG.log(`updateFrameScale: panel=${cw}×${ch}px, ${frames.length} frames scaled`);
  };

  window.addEventListener('resize', updateFrameScale, { passive: true });

  // ── Boot: scale iframes once DOM is painted ──
  if (frames.length) {
    DBG.log(`Showcase: ${frames.length} preloaded frames found — scaling on next paint`);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      DBG.log('double-RAF — running updateFrameScale');
      updateFrameScale();
    }));
    window.addEventListener('load', () => {
      DBG.log('window.load — re-running updateFrameScale for final layout');
      updateFrameScale();
    }, { once: true, passive: true });
  } else {
    DBG.warn('Showcase: no .showcase-iframe elements found');
  }

  /* ─── Preview Modal ──────────────────────────────── */
  const previewModal    = document.getElementById('previewModal');
  const previewFrame    = document.getElementById('previewFrame');
  const previewClose    = document.getElementById('previewClose');
  const previewBackdrop = document.getElementById('previewBackdrop');
  const previewModalUrl = document.getElementById('modalUrl');
  const browserExpandBtn = document.getElementById('browserExpandBtn');

  const openPreview = () => {
    if (!previewModal || !previewFrame) return;
    const activeFrame = frames.find(f => f.classList.contains('is-active')) || frames[0];
    if (activeFrame) {
      previewFrame.src = activeFrame.getAttribute('src');
    }
    if (previewModalUrl) previewModalUrl.textContent = activeFrame?.src || '';
    previewModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    DBG.log('Preview modal opened');
  };

  const closePreview = () => {
    if (!previewModal) return;
    previewModal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { if (previewFrame) previewFrame.src = 'about:blank'; }, 350);
    DBG.log('Preview modal closed');
  };

  if (browserExpandBtn) browserExpandBtn.addEventListener('click', openPreview);
  if (previewClose)     previewClose.addEventListener('click', closePreview);
  if (previewBackdrop)  previewBackdrop.addEventListener('click', closePreview);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal?.classList.contains('is-open')) closePreview();
  });

  /* ─── Mobile nav burger toggle ───────────────────── */
  const burger = document.querySelector('.navbar__burger');
  const navEl = document.querySelector('.navbar__nav');

  if (burger && navEl) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      burger.classList.toggle('is-active');
      navEl.classList.toggle('navbar__nav--open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        navEl.classList.contains('navbar__nav--open') &&
        !navEl.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        burger.setAttribute('aria-expanded', 'false');
        burger.classList.remove('is-active');
        navEl.classList.remove('navbar__nav--open');
      }
    });
  }


})();
