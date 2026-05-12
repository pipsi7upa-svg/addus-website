// Werkschau-Notiz — Cinematic fountain-pen handwriting
// • opentype.js converts Caveat text → SVG glyph paths
// • Each glyph drawn via stroke-dashoffset, pen follows getPointAtLength
// • Continuous lerp loop smooths pen motion (independent of stroke clock)
// • Arc-lift between glyphs simulates pen-up transitions
// • Velocity-based micro-tilt + hand tremor sells the realism
import { animate } from 'https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm';
import * as opentype from 'https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.module.js';

(function () {
  const plak    = document.getElementById('werkschauPlak');
  const idEl    = document.getElementById('plakId');
  const descEl  = document.getElementById('plakDesc');
  const buildEl = document.getElementById('plakBuild');
  const sizeEl  = document.getElementById('plakSize');
  const scoreEl = document.getElementById('plakScore');
  const co2El   = document.getElementById('plakCo2');
  if (!plak || !scoreEl || !descEl) return;

  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const works = [
    { id:'N° I — 2026 / 04', desc:'Toskanische Trattoria, Lüneburg. Reservierungs-System mit Live-Tischbelegung, dreisprachig. Vier Wochen, lief sofort.', build:'4 Wo.', size:'12 KB', score:98, co2:'0,28 g' },
    { id:'N° II — 2026 / 03', desc:'Kanzlei mit Mandanten-Portal. Termin-Buchung über Calendly, alles DSGVO-konform dokumentiert.',                          build:'5 Wo.', size:'18 KB', score:96, co2:'0,34 g' },
    { id:'N° III — 2026 / 02', desc:'Elektro-Betrieb, Lüneburg. Notdienst-Hotline, Foto-Upload, 24-Stunden-Anfrage. Immer erreichbar.',                build:'3 Wo.', size:'14 KB', score:99, co2:'0,22 g' },
    { id:'N° IV — 2026 / 01', desc:'Sport-Shop, Headless-Commerce. 1.200 Produkte, Stripe-Checkout, Wishlist. Sauber und schnell.',                    build:'7 Wo.', size:'24 KB', score:94, co2:'0,41 g' }
  ];

  // ════════════════════════════════════════════════════════════════════
  // 1. PEN — refined SVG fountain pen, Mont-Blanc inspired
  // ════════════════════════════════════════════════════════════════════
  const pen = document.createElement('div');
  pen.className = 'plak__pen';
  pen.setAttribute('aria-hidden', 'true');
  pen.innerHTML = `
    <svg viewBox="0 0 60 60" width="44" height="44">
      <defs>
        <linearGradient id="penBarrelG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0"   stop-color="#1a0e05"/>
          <stop offset=".35" stop-color="#5a3a1c"/>
          <stop offset=".5"  stop-color="#9a6d3b"/>
          <stop offset=".65" stop-color="#5a3a1c"/>
          <stop offset="1"   stop-color="#0e0703"/>
        </linearGradient>
        <linearGradient id="penNibG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0"   stop-color="#f6d68e"/>
          <stop offset=".25" stop-color="#d4b07a"/>
          <stop offset=".55" stop-color="#a07a3e"/>
          <stop offset=".85" stop-color="#5a3a1c"/>
          <stop offset="1"   stop-color="#2a1a0a"/>
        </linearGradient>
        <linearGradient id="penSheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0"   stop-color="rgba(255,255,255,0)"/>
          <stop offset=".5"  stop-color="rgba(255,235,200,0.55)"/>
          <stop offset="1"   stop-color="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      <g transform="rotate(32 4 56)">
        <!-- Barrel body -->
        <path d="M 0.2 -3 L 7.8 -3 L 7.2 36 L 0.8 36 Z" fill="url(#penBarrelG)"/>
        <!-- Barrel sheen (sub-pixel highlight) -->
        <path d="M 1.6 -2.5 L 2.9 -2.5 L 2.5 35.5 L 1.4 35.5 Z" fill="url(#penSheen)" opacity=".8"/>
        <!-- Cap ring (engraved gold band) -->
        <rect x="0.4" y="33.6" width="7.2" height="0.45" fill="#3a2410"/>
        <rect x="0.4" y="34"   width="7.2" height="3"    fill="#c9a96e"/>
        <rect x="0.4" y="34"   width="7.2" height="0.35" fill="#f4d490"/>
        <rect x="0.4" y="36.6" width="7.2" height="0.4"  fill="#5a3a1c"/>
        <rect x="0.4" y="37"   width="7.2" height="0.45" fill="#1a0e05"/>
        <!-- Nib shoulder -->
        <path d="M 0.6 37.5 L 7.4 37.5 L 6.9 41 L 1.1 41 Z" fill="url(#penNibG)"/>
        <!-- Main nib (diamond profile) -->
        <path d="M 1.1 41 L 6.9 41 L 6.5 49.5 L 4 56 L 1.5 49.5 Z"
              fill="url(#penNibG)" stroke="#2a1a0a" stroke-width="0.25"/>
        <!-- Breather hole -->
        <circle cx="4" cy="45.5" r="0.95" fill="#1a0e05"/>
        <!-- Slit -->
        <line x1="4" y1="46.6" x2="4" y2="55.5"
              stroke="#1a0e05" stroke-width="0.5" stroke-linecap="round"/>
        <!-- Engraved scrolls (decorative curves) -->
        <path d="M 2.1 42.5 C 1.4 43.8, 1.8 45.2, 2.5 46.8" fill="none" stroke="#5a3a1c" stroke-width="0.2" opacity=".75"/>
        <path d="M 5.9 42.5 C 6.6 43.8, 6.2 45.2, 5.5 46.8" fill="none" stroke="#5a3a1c" stroke-width="0.2" opacity=".75"/>
        <!-- Tipping (iridium ball at nib tip) -->
        <circle cx="4" cy="56" r="0.6" fill="#e8d9b8" stroke="#1a0e05" stroke-width="0.15"/>
      </g>
    </svg>
  `;
  plak.appendChild(pen);

  // Tip in plak coords. SVG 60×60 → rendered 44×44, tip at viewBox (4, 56)
  const TIP_X = 4 * 44 / 60;   // ≈ 2.93
  const TIP_Y = 56 * 44 / 60;  // ≈ 41.07
  // CRITICAL: rotate around the nib tip, not the wrapper origin —
  // otherwise the visible tip drifts off the writing position whenever
  // the pen tilts (the rotation pivot must coincide with the tip).
  pen.style.transformOrigin = `${TIP_X}px ${TIP_Y}px`;

  // ════════════════════════════════════════════════════════════════════
  // 1b. ARCHIVE STAMP — drops on completion, marks the entry, fades
  // ════════════════════════════════════════════════════════════════════
  const stamp = document.createElement('div');
  stamp.className = 'plak__stamp';
  stamp.setAttribute('aria-hidden', 'true');
  stamp.innerHTML = `
    <svg viewBox="0 0 140 140" width="118" height="118" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="wsArcTop" d="M 70,70 m -52,0 a 52,52 0 1,1 104,0"/>
        <path id="wsArcBot" d="M 70,70 m 52,0 a 52,52 0 1,1 -104,0"/>
      </defs>
      <circle cx="70" cy="70" r="62" fill="none" stroke="currentColor" stroke-width="2.4" opacity=".95"/>
      <circle cx="70" cy="70" r="55" fill="none" stroke="currentColor" stroke-width="0.7" opacity=".55"/>
      <text font-family="JetBrains Mono, monospace" font-size="8.6" letter-spacing="3.6" fill="currentColor" font-weight="600">
        <textPath href="#wsArcTop" startOffset="50%" text-anchor="middle">· ARCHIVIERT ·</textPath>
      </text>
      <text font-family="JetBrains Mono, monospace" font-size="7.4" letter-spacing="3" fill="currentColor" opacity=".9">
        <textPath href="#wsArcBot" startOffset="50%" text-anchor="middle">ATELIER · ADDUS</textPath>
      </text>
      <text x="70" y="66" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="22" font-weight="700" fill="#f6efdc"
            font-variation-settings='"opsz" 144,"WONK" 1,"SOFT" 60'>geprüft</text>
      <text x="70" y="88" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2.2" fill="currentColor" opacity=".95">MMXXVI</text>
    </svg>
  `;
  plak.appendChild(stamp);

  // ════════════════════════════════════════════════════════════════════
  // 2. PEN RENDER LOOP — continuous, lerped, velocity-aware
  // ════════════════════════════════════════════════════════════════════
  const penState = {
    tx: 0, ty: 0,            // target (writing tip in plak coords)
    x: 0, y: 0,              // current rendered position
    lastTx: 0, lastTy: 0,    // for velocity computation
    rot: 32,
    active: false,
    raf: null
  };

  const POS_DAMP = 0.32;     // higher = snappier
  const ROT_DAMP = 0.18;

  // 30fps throttle — halves the per-frame work without visible difference
  // (lerp damping is adjusted for the longer dt automatically by the higher
  // single-step interpolation factor).
  const FRAME_MS = 33;
  let lastFrameTime = 0;
  function penFrame(now) {
    if (!penState.active) { penState.raf = null; return; }
    if (now - lastFrameTime < FRAME_MS) {
      penState.raf = requestAnimationFrame(penFrame);
      return;
    }
    lastFrameTime = now;
    // Position lerp
    penState.x += (penState.tx - penState.x) * POS_DAMP;
    penState.y += (penState.ty - penState.y) * POS_DAMP;
    // Velocity (per frame, in target-space)
    const vx = penState.tx - penState.lastTx;
    const vy = penState.ty - penState.lastTy;
    const speed = Math.hypot(vx, vy);
    // Direction-based tilt — capped, subtle
    const dirTilt = Math.max(-4, Math.min(4, vx * 0.55));
    // Speed-based forward lean (drag)
    const speedLean = Math.min(2.5, speed * 0.12);
    // Adaptive hand tremor — stronger at rest (steady-hand micro-shake),
    // dampened when moving fast (motion masks it).
    const speedNorm = Math.min(1, speed / 12);
    const tremorAmp = 1 - speedNorm * 0.7;
    const tremor =
      (Math.sin(now * 0.013) * 0.55 + Math.sin(now * 0.029) * 0.32) * tremorAmp;
    const targetRot = 32 + dirTilt + speedLean + tremor;
    penState.rot += (targetRot - penState.rot) * ROT_DAMP;

    pen.style.transform =
      `translate3d(${(penState.x - TIP_X).toFixed(2)}px, ${(penState.y - TIP_Y).toFixed(2)}px, 0)` +
      ` rotate(${penState.rot.toFixed(2)}deg)`;

    penState.lastTx = penState.tx;
    penState.lastTy = penState.ty;
    penState.raf = requestAnimationFrame(penFrame);
  }

  function startPen() {
    if (penState.active) return;
    penState.active = true;
    penState.raf = requestAnimationFrame(penFrame);
  }
  function stopPen() {
    penState.active = false;
    if (penState.raf) cancelAnimationFrame(penState.raf);
    penState.raf = null;
  }
  function snapPen(x, y) {
    penState.x = penState.tx = penState.lastTx = x;
    penState.y = penState.ty = penState.lastTy = y;
  }

  // ════════════════════════════════════════════════════════════════════
  // 3. FONT LOADING (Caveat-Regular.ttf)
  // ════════════════════════════════════════════════════════════════════
  let fontPromise = null;
  function loadFont() {
    if (fontPromise) return fontPromise;
    fontPromise = new Promise((resolve, reject) => {
      opentype.load('assets/ArchitectsDaughter-Regular.ttf', (err, font) => {
        if (err) {
          console.error('[werkschau] Failed to load ArchitectsDaughter-Regular.ttf — falling back to italic serif rendering.', err);
          // Reset so a future call can retry instead of staying stuck on rejected promise
          fontPromise = null;
          reject(err);
        } else {
          resolve(font);
        }
      });
    });
    return fontPromise;
  }

  // ════════════════════════════════════════════════════════════════════
  // 4. TEXT LAYOUT → glyph path data with word-wrap
  // ════════════════════════════════════════════════════════════════════
  function layoutText(font, text, fontSize, maxWidth) {
    const scale = fontSize / font.unitsPerEm;
    const lineHeight = fontSize * 1.45;
    const ascent = font.ascender * scale;
    const spaceW = font.charToGlyph(' ').advanceWidth * scale;

    const tokens = text.split(/(\s+)/).filter(s => s.length);
    const out = [];
    let x = 0, y = ascent;

    const wordWidth = (w) => {
      let total = 0;
      for (const ch of w) total += (font.charToGlyph(ch).advanceWidth || 0) * scale;
      return total;
    };

    // Split a glyph's path data into subpaths (each "M" starts a new one)
    const splitSubpaths = (d) => d.match(/[Mm][^Mm]*/g) || [d];

    for (const tok of tokens) {
      if (/^\s+$/.test(tok)) {
        x += spaceW;
        continue;
      }
      const ww = wordWidth(tok);
      if (x + ww > maxWidth && x > 0) { x = 0; y += lineHeight; }
      for (const ch of tok) {
        const glyph = font.charToGlyph(ch);
        const path = glyph.getPath(x, y, fontSize);
        const d = path.toPathData(2);
        const subs = splitSubpaths(d);
        subs.forEach((sd, subIdx) => {
          out.push({
            d: sd,
            char: ch,
            subIdx,                       // 0 = main body, >0 = hole or dot
            isFirstOfGlyph: subIdx === 0
          });
        });
        x += glyph.advanceWidth * scale;
      }
    }
    return { paths: out, svgWidth: maxWidth, svgHeight: y + lineHeight * 0.45 };
  }

  // ════════════════════════════════════════════════════════════════════
  // 5. HUMAN-FEEL primitives — timing, easing, approach
  // ════════════════════════════════════════════════════════════════════
  let writeToken = 0;
  let activeRaf  = null;

  const svgPointToPlak = (pt, plakRect, svgRect) => ({
    x: pt.x + (svgRect.left - plakRect.left),
    y: pt.y + (svgRect.top  - plakRect.top)
  });

  // Pause after writing a character — based on what it is.
  // Real handwriting has long pauses at sentence ends, medium at clauses,
  // short between letters, longer between words.
  function dwellAfter(ch) {
    if (!ch) return 35 + Math.random() * 25;
    if ('.!?'.includes(ch))  return 280 + Math.random() * 120;
    if (',;:'.includes(ch))  return 130 + Math.random() * 60;
    if ('—-–'.includes(ch))  return 65 + Math.random() * 30;
    if (ch.trim() === '')    return 55 + Math.random() * 30;
    return 6 + Math.random() * 12;
  }

  // How to lift the pen between glyphs — depends on context.
  function liftSpec(prevCh, nextCh) {
    const afterSentence = prevCh && '.!?'.includes(prevCh);
    const afterClause   = prevCh && ',;:'.includes(prevCh);
    const intoSpace     = !nextCh || nextCh.trim() === '';
    if (afterSentence) return { duration: 180, liftMult: 1.40, jitter: 0.12 };
    if (afterClause)   return { duration: 135, liftMult: 1.10, jitter: 0.10 };
    if (intoSpace)     return { duration: 95,  liftMult: 0.70, jitter: 0.08 };
    return                    { duration: 75,  liftMult: 0.60, jitter: 0.06 };
  }

  // Natural per-stroke easing — base ease-out with damped mid-stroke wobble.
  // `seed` parameter shifts the curve so consecutive glyphs feel slightly different.
  function naturalEase(t, seed) {
    const power = 1.65 + (seed % 7) * 0.06;
    const base = 1 - Math.pow(1 - t, power);
    const wobbleFreq = 2 + (seed % 4);
    const wobble = Math.sin(t * Math.PI * wobbleFreq) * 0.025 * (1 - t);
    return Math.max(0, Math.min(1, base + wobble));
  }

  // Draw one glyph stroke. `seed` is the glyph index — used to randomize easing.
  function drawStroke(pathEl, durationMs, plakRect, svgRect, seed) {
    return new Promise(resolve => {
      const len = parseFloat(pathEl.dataset.len) || pathEl.getTotalLength();
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = naturalEase(t, seed);
        const drawn = len * eased;
        pathEl.style.strokeDashoffset = (len - drawn).toFixed(2);
        const pt = pathEl.getPointAtLength(drawn);
        const p  = svgPointToPlak(pt, plakRect, svgRect);
        penState.tx = p.x;
        penState.ty = p.y;
        if (t < 1) activeRaf = requestAnimationFrame(tick);
        else resolve();
      }
      activeRaf = requestAnimationFrame(tick);
    });
  }

  // Pen-up arc move from current target to (toX, toY). Hovers slightly above
  // final point so a separate approachTap can do the contact descent.
  function liftTo(toX, toY, durationMs = 180, liftMult = 1.0, hoverAbove = 0) {
    return new Promise(resolve => {
      const fromX = penState.tx, fromY = penState.ty;
      const dist = Math.hypot(toX - fromX, toY - fromY);
      const lift = Math.min(24, (dist * 0.28 + 5) * liftMult);
      const targetY = toY - hoverAbove;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / durationMs);
        // ease-in-out cubic
        const eased = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
        penState.tx = fromX + (toX - fromX) * eased;
        penState.ty = fromY + (targetY - fromY) * eased - lift * Math.sin(Math.PI * t);
        if (t < 1) activeRaf = requestAnimationFrame(tick);
        else resolve();
      }
      activeRaf = requestAnimationFrame(tick);
    });
  }

  // Quick "tap down" — pen descends the last few px to make page contact.
  function approachTap(toX, toY, durationMs = 95) {
    return new Promise(resolve => {
      const fromX = penState.tx, fromY = penState.ty;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / durationMs);
        const e = 1 - Math.pow(1 - t, 2.4);
        penState.tx = fromX + (toX - fromX) * e;
        penState.ty = fromY + (toY - fromY) * e;
        if (t < 1) activeRaf = requestAnimationFrame(tick);
        else resolve();
      }
      activeRaf = requestAnimationFrame(tick);
    });
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // ════════════════════════════════════════════════════════════════════
  // 6. WRITE HANDWRITING — choreographed glyph sequence
  // ════════════════════════════════════════════════════════════════════
  async function writeHandwriting(text) {
    const font = await loadFont();
    const token = writeToken;

    const fontSize = 26;
    const maxWidth = descEl.getBoundingClientRect().width
      || (plak.getBoundingClientRect().width - 44);

    const layout = layoutText(font, text, fontSize, maxWidth);

    // Replace descEl content. Keep a visually-hidden span for screen readers.
    descEl.style.opacity = '1';
    descEl.innerHTML = '';
    const sr = document.createElement('span');
    sr.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
    sr.textContent = text;
    descEl.appendChild(sr);

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', layout.svgWidth);
    svg.setAttribute('height', layout.svgHeight);
    svg.setAttribute('viewBox', `0 0 ${layout.svgWidth} ${layout.svgHeight}`);
    svg.style.display = 'block';
    svg.style.overflow = 'visible';
    descEl.appendChild(svg);

    const pathEls = layout.paths.map((p, i) => {
      const el = document.createElementNS(svgNS, 'path');
      el.setAttribute('d', p.d);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', '#f0e2c4');
      // Thick stroke (2.4–3.0) so the inner + outer outlines merge into a
      // single brush-like body — letters appear "inked in" as the pen
      // travels around them, not as a thin line tracing the perimeter.
      const sw = (2.4 + Math.random() * 0.6).toFixed(2);
      el.setAttribute('stroke-width', sw);
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(el);
      const len = el.getTotalLength();
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.dataset.len = len;
      return el;
    });

    // Fade pen in (Motion)
    animate(pen, { opacity: [0, 1] }, { duration: 0.4, easing: [0.16, 0.84, 0.3, 1] });
    startPen();

    const plakRect = plak.getBoundingClientRect();
    const svgRect  = svg.getBoundingClientRect();

    // Classify a non-first subpath relative to its glyph's body:
    //   'hole' — bbox sits inside main body bbox (e.g. inner of "o", "a")
    //   'dot'  — bbox sits ABOVE main body (e.g. dot on "i", "j", umlauts)
    //   'side' — sits adjacent (rare; accents)
    function classifySubpath(currEl, mainEl) {
      const c = currEl.getBBox();
      const m = mainEl.getBBox();
      const inside =
        c.x >= m.x - 0.5 && c.x + c.width  <= m.x + m.width  + 0.5 &&
        c.y >= m.y - 0.5 && c.y + c.height <= m.y + m.height + 0.5;
      if (inside) return 'hole';
      const cMidY = c.y + c.height / 2;
      if (cMidY < m.y) return 'dot';
      return 'side';
    }

    let mainGlyphEl = null;  // current glyph's main body path el
    let prevChar    = '';

    for (let i = 0; i < pathEls.length; i++) {
      if (token !== writeToken) break;
      const el   = pathEls[i];
      const meta = layout.paths[i];
      const ch   = meta.char;
      const isFirstSub = meta.isFirstOfGlyph;
      const isSpaceLike = !ch || ch.trim() === '';

      const firstPt = el.getPointAtLength(0);
      const first   = svgPointToPlak(firstPt, plakRect, svgRect);

      // ── Entry choreography ──
      // Compute glyph top-left (bbox) once for the entry. A human writer
      // approaches each letter from above-left, then makes contact where
      // the actual stroke begins — not at a random point on the outline.
      let bboxTL = null;
      if (isFirstSub) {
        const bbox = el.getBBox();
        bboxTL = svgPointToPlak({ x: bbox.x, y: bbox.y }, plakRect, svgRect);
      }

      if (i === 0) {
        snapPen(bboxTL.x, bboxTL.y - 22);
        await liftTo(bboxTL.x, bboxTL.y - 1, 260, 0.8, 3);
        await sleep(40 + Math.random() * 30);
        const dist = Math.hypot(first.x - bboxTL.x, first.y - bboxTL.y);
        const swoopDur = 50 + Math.min(80, dist * 4);
        await approachTap(first.x, first.y, swoopDur);
        mainGlyphEl = el;
      } else if (isFirstSub) {
        const spec = liftSpec(prevChar, ch);
        const jit  = 1 + (Math.random() - 0.5) * 2 * spec.jitter;
        await liftTo(bboxTL.x, bboxTL.y - 1, spec.duration * jit, spec.liftMult, 2);
        const dist = Math.hypot(first.x - bboxTL.x, first.y - bboxTL.y);
        const swoopDur = 45 + Math.min(80, dist * 4);
        await approachTap(first.x, first.y, swoopDur);
        mainGlyphEl = el;
      } else {
        const kind = mainGlyphEl ? classifySubpath(el, mainGlyphEl) : 'dot';
        if (kind === 'hole') {
          await liftTo(first.x, first.y, 55, 0.25, 1);
          await approachTap(first.x, first.y, 28);
        } else if (kind === 'dot') {
          await liftTo(first.x, first.y, 100, 0.85, 2);
          await sleep(18 + Math.random() * 14);
          await approachTap(first.x, first.y, 42);
        } else {
          await liftTo(first.x, first.y, 75, 0.6, 1.5);
          await approachTap(first.x, first.y, 35);
        }
      }

      // ── Draw the subpath ──
      const len = parseFloat(el.dataset.len);
      const speedJit = 0.85 + Math.random() * 0.30;
      // Faster: was len * 4.6 → now 2.8. Plus tighter cap so very long
      // subpaths don't drag.
      const dur = Math.max(35, Math.min(150, len * 2.8 * speedJit));
      await drawStroke(el, dur, plakRect, svgRect, i);

      // ── Post-glyph dwell (only after the LAST subpath of the glyph) ──
      const nextMeta = layout.paths[i + 1];
      const isLastSubOfGlyph = !nextMeta || nextMeta.isFirstOfGlyph;
      if (isLastSubOfGlyph) {
        await sleep(dwellAfter(ch));
        prevChar = ch;
      }
    }

    if (token !== writeToken) return;

    // Pen lifts off the page (small upward arc) before fading
    const startY = penState.ty;
    const offY   = startY - 26;
    const startX = penState.tx;
    await new Promise(resolve => {
      const t0 = performance.now();
      function f(now) {
        const t = Math.min(1, (now - t0) / 360);
        const e = 1 - Math.pow(1 - t, 2.2);
        penState.tx = startX + 4 * e; // tiny drift to the right (hand pulling back)
        penState.ty = startY + (offY - startY) * e;
        if (t < 1) activeRaf = requestAnimationFrame(f);
        else resolve();
      }
      activeRaf = requestAnimationFrame(f);
    });

    animate(pen, { opacity: [1, 0] }, { duration: 0.55, easing: [0.16, 0.84, 0.3, 1] });
    setTimeout(() => { if (token === writeToken) stopPen(); }, 650);
  }

  // ════════════════════════════════════════════════════════════════════
  // 7. SCORE COUNTER + STATIC FIELD UPDATES
  // ════════════════════════════════════════════════════════════════════
  let scoreCtrl = null;
  function animateScore(target) {
    if (scoreCtrl && scoreCtrl.stop) scoreCtrl.stop();
    if (reduce) { scoreEl.textContent = target; return; }
    const from = parseInt(scoreEl.textContent, 10) || 0;
    scoreCtrl = animate(
      (p) => { scoreEl.textContent = Math.round(from + (target - from) * p); },
      { duration: 1.0, easing: [0.16, 0.84, 0.3, 1] }
    );
  }

  let currentIdx = 0;
  let cycleTimer = null;
  const DWELL_MS = 2000; // pause after writing completes before advancing

  function setStatic(w) {
    if (idEl)    idEl.textContent    = w.id;
    if (buildEl) buildEl.textContent = w.build;
    if (sizeEl)  sizeEl.textContent  = w.size;
    if (co2El)   co2El.textContent   = w.co2;
  }
  function fadeStatsIn() {
    [idEl, buildEl, sizeEl, co2El].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      setTimeout(() => animate(el, { opacity: [0, 1] },
        { duration: 0.45, easing: [0.16, 0.84, 0.3, 1] }), i * 70);
    });
  }

  // ── Stamp drop animation (returns when stamp has settled) ──
  async function dropStamp() {
    return new Promise(resolve => {
      animate(stamp,
        {
          opacity: [0, 1, 0.96],
          transform: [
            'translate(-50%, -50%) scale(2.8) rotate(-22deg)',
            'translate(-50%, -50%) scale(0.92) rotate(-5deg)',
            'translate(-50%, -50%) scale(1) rotate(-8deg)'
          ]
        },
        { duration: 0.5, easing: [0.34, 1.56, 0.64, 1] }
      );
      // Tiny secondary "settle" wobble after drop — like ink absorbing
      setTimeout(() => {
        animate(stamp,
          { transform: [
              'translate(-50%, -50%) scale(1) rotate(-8deg)',
              'translate(-50%, -50%) scale(1.018) rotate(-8.4deg)',
              'translate(-50%, -50%) scale(1) rotate(-8deg)'
            ]
          },
          { duration: 0.16, easing: 'ease-out' }
        );
      }, 510);
      // Stamp dwell — full visible
      setTimeout(resolve, 950);
    });
  }

  // ── Page-out: slide existing content left + fade, stamp fades with it ──
  async function pageOut() {
    const body = plak.querySelector('.plak__body');
    if (!body) return;
    // Concurrent: body slides + fades, stamp fades
    animate(body,
      { opacity: [1, 0], transform: ['translate(0px, 0px)', 'translate(-28px, 0px)'] },
      { duration: 0.45, easing: [0.65, 0, 0.35, 1] }
    );
    animate(stamp, { opacity: [0.96, 0] }, { duration: 0.45, easing: [0.65, 0, 0.35, 1] });
    await sleep(470);
    // Reset body to right side, invisible, for the slide-in
    body.style.transform = 'translate(28px, 0px)';
    body.style.opacity = '0';
    // Brief blank pause — the page is empty
    await sleep(80);
  }

  // ── Page-in: slide new content from right back to center ──
  // Returns a Promise that resolves once the slide is complete — measurements
  // (descEl width, svgRect) must NOT run while body is mid-slide or pen
  // coordinates end up offset by the slide distance.
  function pageIn() {
    return new Promise(resolve => {
      const body = plak.querySelector('.plak__body');
      if (!body) { resolve(); return; }
      animate(body,
        { opacity: [0, 1], transform: ['translate(28px, 0px)', 'translate(0px, 0px)'] },
        { duration: 0.5, easing: [0.16, 0.84, 0.3, 1] }
      );
      setTimeout(() => {
        // Clear inline transform so subsequent measurements see clean state
        body.style.transform = '';
        body.style.opacity = '';
        resolve();
      }, 520);
    });
  }

  let pausedOffScreen = false;
  let pendingSchedule = false;

  function scheduleNext() {
    // While the plak is off-screen, never set or fire the transition timer.
    // Remember the intent and replay it when the user returns.
    if (pausedOffScreen) { pendingSchedule = true; return; }
    if (cycleTimer) clearTimeout(cycleTimer);
    cycleTimer = setTimeout(async () => {
      cycleTimer = null;
      // Re-check: user may have scrolled away during the 2s dwell
      if (pausedOffScreen) { pendingSchedule = true; return; }
      await dropStamp();
      if (pausedOffScreen) { pendingSchedule = true; return; }
      await pageOut();
      if (pausedOffScreen) { pendingSchedule = true; return; }
      update((currentIdx + 1) % works.length);
    }, DWELL_MS);
  }

  async function update(idx) {
    if (idx === currentIdx) return;
    if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null; }
    currentIdx = idx;
    const w = works[idx] || works[0];

    writeToken++;
    const token = writeToken;
    if (activeRaf) cancelAnimationFrame(activeRaf);

    if (reduce) {
      setStatic(w);
      descEl.textContent = w.desc;
      animateScore(w.score);
      scheduleNext();
      return;
    }

    setStatic(w);
    scoreEl.textContent = '0';
    // Slide the fresh page in from the right (only if it was paged-out).
    // Must AWAIT — measurements inside writeHandwriting depend on body
    // being at its final position, otherwise pen coordinates drift.
    const body = plak.querySelector('.plak__body');
    if (body && body.style.opacity === '0') {
      fadeStatsIn();
      await pageIn();
    } else {
      fadeStatsIn();
    }

    try {
      await writeHandwriting(w.desc);
    } catch (e) {
      console.error('handwriting failed:', e);
      descEl.style.opacity = '1';
      descEl.textContent = w.desc;
    }

    if (token !== writeToken) return; // newer update started
    animateScore(w.score);
    scheduleNext();
  }

  // ════════════════════════════════════════════════════════════════════
  // 8. INIT + BINDINGS
  // ════════════════════════════════════════════════════════════════════
  setStatic(works[0]);
  descEl.textContent = '';

  // Visibility-aware: when plak is completely off-screen, we set
  // pausedOffScreen=true. scheduleNext() + its timer-callback all
  // bail under that flag, so no transition / next-text can fire while
  // the user can't see. Returning replays a pending schedule if there
  // was one, otherwise the current text just stays put.
  let everVisible = false;
  if ('IntersectionObserver' in window) {
    const visObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const nowVisible = e.isIntersecting;
        if (!nowVisible) {
          pausedOffScreen = true;
          // Cancel any active dwell timer so it can't fire off-screen
          if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null; pendingSchedule = true; }
        } else {
          pausedOffScreen = false;
          if (!everVisible) {
            everVisible = true;
            currentIdx = -1;
            update(0);
          } else if (pendingSchedule) {
            pendingSchedule = false;
            scheduleNext();
          }
        }
      });
    }, { threshold: 0 });
    visObs.observe(plak);
  } else {
    descEl.textContent = works[0].desc;
    animateScore(works[0].score);
  }

  document.querySelectorAll('.exhibit').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10) || 0;
      update(idx);
    });
  });
  // Note: showcase iframe MutationObserver removed — the plak now runs its
  // own auto-cycle (write text → wait 2s → next), independent of the showcase
  // rotation. Manual exhibit clicks still override.
})();
