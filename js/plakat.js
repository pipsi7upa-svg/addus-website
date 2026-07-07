/* ═══════════════════════════════════════════════════════════
   addus. PLAKAT II — Choreografie
   Lenis (self-hosted) · GSAP 3 + ScrollTrigger (self-hosted)
   Preloader · Punktnetz-Canvas · Custom Cursor · Wort-Masken
   transform/opacity only · prefers-reduced-motion respektiert
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ── SIGNATUR: Visitenkarte für alle, die F12 drücken ──── */
  try {
    console.log(
      '%c addus. %c handcodiert — keine Templates, kein Baukasten ',
      'background:#2438ff;color:#f6f4ee;font-weight:700;padding:4px 8px;border-radius:3px 0 0 3px',
      'background:#101010;color:#f6f4ee;padding:4px 8px;border-radius:0 3px 3px 0'
    );
    console.log('Stack: HTML5 · CSS3 · ES6 · GSAP + ScrollTrigger · Lenis · SplitType · Canvas — https://addus-web.de/humans.txt');
  } catch (e) {}

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var motion = hasGsap && !reduce;
  if (!motion) document.documentElement.classList.add('motion-off');

  /* ── PRELOADER ────────────────────────────────────────── */
  var lader = document.getElementById('lader');
  var laderZahl = document.getElementById('laderZahl');
  function killLader() {
    if (lader && lader.parentNode) lader.parentNode.removeChild(lader);
    document.body.classList.remove('laden');
  }
  /* Fällt Init-JS aus, darf die Seite nie hinterm Preloader hängen bleiben
     und Inhalte nicht unter [data-reveal]{opacity:0} verschwinden. */
  window.addEventListener('error', function (e) {
    /* Nur eigene Skriptfehler zählen: Drittanbieter (Turnstile, Analytics)
       werfen sonst mitten in der Session motion-off und killen die Choreografie */
    if (!e || !e.filename || e.filename.indexOf(location.origin) !== 0) return;
    document.documentElement.classList.add('motion-off');
    killLader();
  });
  if (!motion) {
    killLader();
  } else {
    document.body.classList.add('laden');
    /* Not-Ausstieg, falls irgendwas hängt — Intro darf dabei nicht verhungern */
    setTimeout(function () {
      killLader();
      if (typeof intro !== 'undefined' && intro && intro.progress() === 0 && !intro.isActive()) intro.play();
    }, 5500);
  }

  /* ── NAV: Zustand + Mobilmenü ─────────────────────────── */
  var nav = document.getElementById('navbar');
  var navProg = document.getElementById('navProgress');
  var lastY = window.scrollY;
  /* scrollHeight NICHT pro Scroll-Event lesen (Forced Reflow) — cachen,
     neu messen bei Resize + ScrollTrigger-Refresh (Pins ändern die Höhe) */
  var scrollMax = 0;
  function messenScrollMax() {
    scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  }
  messenScrollMax();
  window.addEventListener('resize', messenScrollMax);
  if (window.ScrollTrigger) ScrollTrigger.addEventListener('refresh', messenScrollMax);
  /* Progressbar nativ via animation-timeline: scroll(root)?
     Dann übernimmt der Compositor — JS lässt die Finger davon. */
  var nativeProgress = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
  function navState() {
    if (!nav) return;
    var y = window.scrollY;
    var down = y > 40;
    nav.classList.toggle('nav--solid', down);
    nav.classList.toggle('nav--top', !down);
    /* Hide-on-down / Show-on-up (nie bei offenem Menü oder Fokus in der Nav) */
    var verstecken = y > 300 && y > lastY
      && !document.body.classList.contains('menu-open')
      && !nav.contains(document.activeElement);
    nav.classList.toggle('nav--hidden', verstecken);
    lastY = y;
    if (navProg && !nativeProgress) {
      navProg.style.transform = 'scaleX(' + (scrollMax > 0 ? Math.min(1, y / scrollMax) : 0) + ')';
    }
  }
  navState();
  window.addEventListener('scroll', navState, { passive: true });

  var burger = document.getElementById('burger');
  if (burger) {
    var setMenu = function (open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      /* Hintergrund darf hinterm offenen Vollbild-Menü nicht weiterscrollen
         (lenis ist var-gehoisted; existiert erst nach Motion-Init) */
      if (typeof lenis !== 'undefined' && lenis) { open ? lenis.stop() : lenis.start(); }
    };
    burger.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    document.querySelectorAll('.menu a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ── AUDIT-DATUM (Prüfbericht) ────────────────────────── */
  var auditDatum = document.getElementById('auditDatum');
  if (auditDatum) {
    auditDatum.textContent = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  }

  /* ── WERKSCHAU: iframes lazy laden + skalieren ────────── */
  var frames = Array.prototype.slice.call(document.querySelectorAll('.werk__frame'));

  /* ScrollTrigger.refresh() NIE mitten im Scroll: Pins (Hero 340%,
     Werkschau) springen sonst und der Viewport landet im leeren
     Pin-Spacer — "Seite verschwindet". Refresh wartet auf scrollEnd. */
  var refreshWartet = false;
  function safeRefresh() {
    if (!window.ScrollTrigger) return;
    var st = window.ScrollTrigger;
    if (typeof st.isScrolling === 'function' && st.isScrolling()) {
      if (refreshWartet) return;
      refreshWartet = true;
      var onEnd = function () {
        st.removeEventListener('scrollEnd', onEnd);
        refreshWartet = false;
        st.refresh();
      };
      st.addEventListener('scrollEnd', onEnd);
    } else {
      st.refresh();
    }
  }

  function scaleFrames() {
    var changed = false;
    frames.forEach(function (f) {
      var box = f.parentElement;
      if (!box) return;
      var cw = box.clientWidth;
      /* Handy: Demos im Phone-Format rendern (Mobile-Layout, lesbar);
         Desktop: volle Demo-Breite aus data-rw/rh. */
      var mobil = window.innerWidth < 900;
      var rw = mobil ? 420 : (parseInt(f.dataset.rw, 10) || 1300);
      var rh = mobil ? 720 : (parseInt(f.dataset.rh, 10) || 975);
      /* Nur bei Breiten-/Format-Änderung neu skalieren — verhindert ResizeObserver-Loop
         (box.style.height unten löst sonst erneut den Observer aus). */
      var key = cw + 'x' + rw;
      if (cw < 10 || key === f.dataset.lastKey) return;
      f.dataset.lastKey = key;
      changed = true;
      /* Breakpoint gewechselt (z. B. Rotation): passende Quelle nachladen */
      var want = frameSrc(f);
      if (want && f.getAttribute('src') && f.getAttribute('src') !== want) f.src = want;
      /* Demo füllt die Breite exakt; Rahmenhöhe = skalierte Demo + Leiste.
         +1px Overscan schluckt Rundungs-Slivers an den Kanten. */
      var s = (cw + 1) / rw;
      /* aspect-ratio-Platzhalter abschalten, sonst leitet der Browser aus der
         gesetzten Höhe eine NEUE Breite ab (Feedback-Schleife: Rahmen wächst). */
      box.style.aspectRatio = 'auto';
      box.style.width = '100%';
      box.style.height = (Math.ceil(rh * s) + 29) + 'px';
      f.style.width = rw + 'px';
      f.style.height = rh + 'px';
      f.style.left = '0px';
      f.style.transform = 'scale(' + s + ')';
    });
    if (changed) safeRefresh();
  }
  scaleFrames();
  window.addEventListener('resize', scaleFrames);
  /* Spaltenbreite kann sich ohne window-resize ändern (Scrollbar, Fonts, Layout-Shift) */
  if ('ResizeObserver' in window) {
    var frameRO = new ResizeObserver(scaleFrames);
    frames.forEach(function (f) { if (f.parentElement) frameRO.observe(f.parentElement); });
  }

  /* Handy bekommt die extra gebauten Mobile-Poster (demos/mobil/), Desktop die volle Demo */
  function frameSrc(f) {
    return (window.innerWidth < 900 && f.dataset.srcMobil) ? f.dataset.srcMobil : f.dataset.src;
  }
  if ('IntersectionObserver' in window && frames.length) {
    var frameIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var f = e.target;
        var src = frameSrc(f);
        if (src && !f.src) f.src = src;
        frameIO.unobserve(f);
      });
    }, { rootMargin: '900px' });
    frames.forEach(function (f) { frameIO.observe(f); });
  } else {
    frames.forEach(function (f) { var src = frameSrc(f); if (src) f.src = src; });
  }

  /* ── KONTAKTFORMULAR: Formspree + Turnstile ───────────── */
  var form = document.getElementById('contactForm');
  var dsgvo = document.getElementById('dsgvoCheck');
  var submitBtn = document.getElementById('submitBtn');
  var success = document.getElementById('formSuccess');
  var fehler = document.getElementById('formFehler');
  var turnstileToken = null;

  window.onTurnstileSuccess = function (token) { turnstileToken = token; updateSubmitState(); };
  window.onTurnstileExpired = function () { turnstileToken = null; updateSubmitState(); };

  /* Dev-Bypass: Sitekey ist auf addus-web.de registriert; localhost scheitert */
  var isDevHost = ['localhost', '127.0.0.1', '0.0.0.0', ''].indexOf(location.hostname) !== -1
    || location.protocol === 'file:';
  if (isDevHost) {
    turnstileToken = 'dev-bypass';
    var ts = document.querySelector('.cf-turnstile');
    if (ts) ts.style.display = 'none';
  }

  function updateSubmitState() {
    if (!submitBtn) return;
    submitBtn.disabled = !(dsgvo && dsgvo.checked && !!turnstileToken);
  }
  if (dsgvo) dsgvo.addEventListener('change', updateSubmitState);

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      /* Fehleranzeige aus einem vorherigen Versuch bei jedem neuen Submit leeren */
      if (fehler) { fehler.textContent = ''; fehler.classList.remove('is-shown'); }
      if (submitBtn && submitBtn.disabled) return;
      /* Pflichtfelder trotz novalidate prüfen (Button-Gate deckt nur DSGVO+Turnstile) */
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      if (turnstileToken) data.append('cf-turnstile-response', turnstileToken);

      var firstName = data.get('firstName') || '';
      var nameSpan = document.querySelector('.success-name');
      if (nameSpan && firstName) nameSpan.textContent = 'Danke, ' + firstName + '.';

      submitBtn.disabled = true;
      submitBtn.classList.add('is-sending');
      submitBtn.setAttribute('aria-busy', 'true');

      fetch('https://formspree.io/f/mojpqqyy', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.style.display = 'none';
          if (success) { success.classList.add('is-shown'); success.focus(); }
        } else {
          fail('Es gab ein Problem beim Senden. Bitte erneut versuchen oder direkt an info@addus-web.de schreiben.');
        }
      }).catch(function () {
        fail('Senden fehlgeschlagen. Direkt per WhatsApp erreichbar: +49 176 21214416.');
      });

      function fail(msg) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-sending');
        submitBtn.removeAttribute('aria-busy');
        if (fehler) {
          fehler.textContent = msg;
          fehler.classList.add('is-shown');
        }
      }
    });
  }

  /* ── HERO-FILMSTAUB (Canvas: Projektorstaub, driftet träge) ── */
  (function staub() {
    if (!motion) return;
    /* Nur Desktop mit Maus + genug Fläche: spart Mobile-Akku, kein RAF ohne Sichtbarkeit */
    if (!window.matchMedia('(pointer:fine)').matches) return;
    if (window.innerWidth < 900) return;
    var cv = document.getElementById('heroStaub');
    var hero = document.getElementById('hero');
    if (!cv || !hero) return;
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, teilchen = [];
    var mx = -9999, my = -9999;
    var running = false, raf = null;

    function bauen() {
      W = hero.clientWidth; H = hero.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(45, Math.min(130, Math.round(W * H / 24000)));
      teilchen = [];
      for (var i = 0; i < n; i++) {
        teilchen.push({
          x: Math.random() * W, y: Math.random() * H,
          r: .5 + Math.random() * 1.5,
          vx: -.12 - Math.random() * .22,
          vy: -.05 - Math.random() * .16,
          ph: Math.random() * 6.28,
          tw: .004 + Math.random() * .012,
          a: .08 + Math.random() * .3
        });
      }
    }
    function malen() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#f6f3ea';
      for (var i = 0; i < teilchen.length; i++) {
        var p = teilchen[i];
        p.ph += p.tw * 8;
        /* Cursor schiebt den Staub sanft beiseite, wie Luftzug */
        var dx = p.x - mx, dy = p.y - my;
        var d2 = dx * dx + dy * dy;
        if (d2 < 32400) {
          var d = Math.sqrt(d2) || 1, k = 1 - d / 180;
          p.x += (dx / d) * k * 1.6;
          p.y += (dy / d) * k * 1.6;
        }
        p.x += p.vx + Math.sin(p.ph * .35) * .1;
        p.y += p.vy;
        if (p.x < -4) p.x = W + 4;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        ctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(p.ph));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
      }
      raf = requestAnimationFrame(malen);
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(malen); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    bauen();
    window.addEventListener('resize', bauen);
    hero.addEventListener('mousemove', function (e) {
      var b = hero.getBoundingClientRect();
      mx = e.clientX - b.left; my = e.clientY - b.top;
    });
    hero.addEventListener('mouseleave', function () { mx = my = -9999; });

    /* RAF läuft nur, wenn Hero sichtbar UND Tab aktiv ist */
    var heroSichtbar = true;
    function sync() { (heroSichtbar && !document.hidden) ? start() : stop(); }
    if ('IntersectionObserver' in window) {
      heroSichtbar = false;
      new IntersectionObserver(function (e) {
        heroSichtbar = e[0].isIntersecting;
        sync();
      }).observe(hero);
    } else {
      sync();
    }
    document.addEventListener('visibilitychange', sync);
  })();

  /* ── CUSTOM CURSOR ────────────────────────────────────── */
  (function cursor() {
    if (!motion || !window.matchMedia('(pointer: fine)').matches) return;
    var c = document.getElementById('cursor');
    var label = document.getElementById('cursorLabel');
    if (!c) return;
    var qx = gsap.quickTo(c, 'x', { duration: .35, ease: 'power3.out' });
    var qy = gsap.quickTo(c, 'y', { duration: .35, ease: 'power3.out' });
    var cursorAn = false;
    window.addEventListener('mousemove', function (e) {
      if (!cursorAn) {
        /* Erster Move: direkt hinsetzen statt von 0/0 hinzufliegen */
        cursorAn = true;
        gsap.set(c, { x: e.clientX, y: e.clientY });
        c.classList.add('is-an');
      }
      qx(e.clientX); qy(e.clientY);
      var el = e.target;
      var lab = el.closest && el.closest('[data-cursor]');
      var lnk = el.closest && el.closest('a, button');
      if (lab) {
        c.classList.add('is-label'); c.classList.remove('is-link');
        if (label) label.textContent = lab.getAttribute('data-cursor');
      } else if (lnk) {
        c.classList.add('is-link'); c.classList.remove('is-label');
      } else {
        c.classList.remove('is-link', 'is-label');
      }
    }, { passive: true });
  })();

  /* ── LABOR: Tabs + Mini-Syntax-Highlighter ──────────────
     Läuft bewusst VOR dem Motion-Guard: Code lesen und Demos
     wechseln muss auch ohne GSAP / mit reduced motion gehen. */
  (function labor() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.lab__tab'));
    if (!tabs.length) return;

    /* Highlighter: reicht für unsere kontrollierten Snippets —
       Kommentar → String → @-Regel → Keyword → Zahl → Funktion */
    /* Kein Lookbehind: alter Safari wirft sonst beim Parsen der ganzen Datei */
    var TOKEN = /(\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*')|(@[\w-]+)|\b(const|let|var|function|new|for|of|if|else|return|to|from|syntax|initial-value|inherits)\b|(\b\d+(?:\.\d+)?\b)|([\w$-]+)(?=\()/g;
    document.querySelectorAll('.lab__code code').forEach(function (code) {
      var txt = code.textContent
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      var istTrio = !!code.closest('.lab__mehr');
      if (code.getAttribute('data-lang') === 'html') {
        /* HTML: Tag-Namen, Attribute, Attributwerte — EIN Durchlauf,
           sonst zerlegt Pass 2 die in Pass 1 eingefügten Spans */
        code.innerHTML = txt.replace(/(&lt;\/?)([\w-]+)|([\w-]+)(?==")|("[^"]*")/g, function (m, lt, tag, attr, str) {
          if (tag) return lt + '<span class="tk-k">' + tag + '</span>';
          if (attr) return '<span class="tk-f">' + attr + '</span>';
          return '<span class="tk-s">' + str + '</span>';
        });
      } else {
        code.innerHTML = txt.replace(TOKEN, function (m, c, s, p, k, n, f) {
          var cls = c ? 'tk-c' : s ? 'tk-s' : p ? 'tk-p' : k ? 'tk-k' : n ? 'tk-n' : 'tk-f';
          return '<span class="' + cls + '">' + m + '</span>';
        });
      }
      /* Zusammenspiel-Blöcke: Zeilen einzeln ansprechbar machen —
         die Demo tippt sie später Zeile für Zeile hin.
         (Token-Spans liegen hier nie über Zeilengrenzen.) */
      if (istTrio) {
        code.innerHTML = code.innerHTML.split('\n').map(function (l) {
          return '<span class="zeile">' + (l || '&nbsp;') + '</span>';
        }).join('');
      }
    });

    /* Tablist: Klick + Pfeiltasten (roving tabindex) */
    function wahl(tab) {
      tabs.forEach(function (t) {
        var an = t === tab;
        t.setAttribute('aria-selected', an ? 'true' : 'false');
        t.tabIndex = an ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !an;
      });
      /* Panelhöhen differieren um bis zu ~250px — ohne Refresh rechnen
         alle ScrollTrigger unterhalb des Labors mit alten Positionen
         (Ghost-Glyph & Reveals verrutschen sichtbar). */
      safeRefresh();
    }
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { wahl(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length];
        wahl(n); n.focus();
      });
    });
  })();

  /* ── KAPITELZÄHLER: „Akt X / 10" in der Nav ─────────────
     Gespeist aus den vorhandenen data-ghost-Akten. Läuft ohne
     GSAP (IntersectionObserver), damit er auch bei motion-off
     die Orientierung liefert. Nicht-numerische Akte (Labor
     „</>") werden übersprungen — Zähler behält den letzten Akt. */
  (function akte() {
    var out = document.getElementById('navAkt');
    if (!out || !('IntersectionObserver' in window)) return;
    var koepfe = Array.prototype.filter.call(
      document.querySelectorAll('.skopf[data-ghost]'),
      function (k) { return /^\d+$/.test(k.getAttribute('data-ghost')); }
    );
    if (!koepfe.length) return;
    var gesamt = String(koepfe.length).padStart(2, '0');
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sec = e.target, kopf = sec.querySelector('.skopf[data-ghost]');
        var n = kopf ? kopf.getAttribute('data-ghost') : '';
        if (!/^\d+$/.test(n) || out.dataset.akt === n) return;
        out.dataset.akt = n;
        out.textContent = 'Akt ' + n + ' / ' + gesamt;
        out.classList.add('is-an');
      });
    /* schmales Band um die Bildschirmmitte → genau eine Sektion aktiv */
    }, { rootMargin: '-45% 0px -50% 0px' });
    koepfe.forEach(function (k) {
      var sec = k.closest('section');
      if (sec) io.observe(sec);
    });
  })();

  /* ── Ohne GSAP / mit reduced motion: hier Schluss ─────── */
  if (!motion) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'expo.out', duration: 1 });
  /* Mobile: URL-Leiste ein/aus feuert resize → Refresh mitten im
     Scroll verschiebt Pins und blendet die Seite scheinbar aus */
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ── LENIS Smooth-Scroll ──────────────────────────────── */
  var lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    document.documentElement.style.scrollBehavior = 'auto';
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var ziel = document.querySelector(id);
        if (!ziel) return;
        e.preventDefault();
        lenis.scrollTo(ziel, { offset: -60, duration: 1.4 });
      });
    });
  }

  /* ── WORT-MASKEN: h2-Überschriften splitten ───────────── */
  function splitWorte(el) {
    var kids = Array.prototype.slice.call(el.childNodes);
    kids.forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (tok) {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'w';
          var i = document.createElement('span'); i.textContent = tok;
          w.appendChild(i); frag.appendChild(w);
        });
        el.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') {
        splitWorte(n);
      }
    });
  }
  gsap.utils.toArray('.skopf h2').forEach(function (h2) {
    splitWorte(h2);
    gsap.fromTo(h2.querySelectorAll('.w > span'),
      { yPercent: 112 },
      {
        yPercent: 0, duration: .9, stagger: 0.042, ease: 'expo.out',
        scrollTrigger: { trigger: h2, start: 'top 86%', once: true }
      });
  });

  /* ── Buchstaben-Split (Footer-Marke) ──────────────────── */
  function splitBuchstaben(el) {
    var kids = Array.prototype.slice.call(el.childNodes);
    kids.forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split('').forEach(function (ch) {
          if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
          var s = document.createElement('span');
          s.className = 'lq';
          s.textContent = ch;
          frag.appendChild(s);
        });
        el.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        splitBuchstaben(n);
      }
    });
  }

  /* ── TIEFENBÜHNE: Cursor-Tilt + Projektor-Beam ──────────
     Die Bühne kippt träge in 3D Richtung Cursor, die Ebenen
     (data-tiefe → translateZ) erzeugen echte Parallaxe.
     Der Lichtkegel folgt noch träger, wie ein Projektor. */
  (function buehne() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    var hero = document.getElementById('hero');
    var main = document.getElementById('heroMain');
    var beam = document.getElementById('heroBeam');
    if (!hero || !main) return;

    /* Ebenen-Tiefe einmalig setzen; GSAP hält z in allen Folge-Tweens */
    main.querySelectorAll('[data-tiefe]').forEach(function (el) {
      gsap.set(el, { z: parseFloat(el.dataset.tiefe) || 0 });
    });

    var qrx = gsap.quickTo(main, 'rotationX', { duration: .9, ease: 'power3.out' });
    var qry = gsap.quickTo(main, 'rotationY', { duration: .9, ease: 'power3.out' });
    var qbx = beam ? gsap.quickTo(beam, 'x', { duration: 1.4, ease: 'power2.out' }) : null;
    var qby = beam ? gsap.quickTo(beam, 'y', { duration: 1.4, ease: 'power2.out' }) : null;

    if (beam) gsap.set(beam, { x: window.innerWidth / 2, y: window.innerHeight * .42 });

    hero.addEventListener('pointermove', function (e) {
      var nx = e.clientX / window.innerWidth - .5;   /* -0.5 … 0.5 */
      var ny = e.clientY / window.innerHeight - .5;
      qrx(ny * -5);
      qry(nx * 6.5);
      if (qbx) { qbx(e.clientX); qby(e.clientY); }
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      qrx(0); qry(0);
    });
  })();

  /* ── SCROLL-STORY: gepinnter Hero in drei Akten ─────────
     Akt 1: Plakat löst sich auf (Zeilen scheren wie Filmstreifen raus)
     Akt 2: drei Statements fliegen durch die Kamera, Zahlen
            zählen mit dem Scrub (14 Tage · 27 €/Monat · Handcode)
     Akt 3: Letterbox-Abblende
     Akt 4: Abspann auf der Letterbox — Handoff in die Werkschau
     WICHTIG: vor dem Intro erstellen + immediateRender:true —
     die fromTo-Tweens recorden ihren Revert-Zustand beim ersten
     Render, sonst frieren halbfertige Zustände ein. */
  gsap.matchMedia().add('(min-width: 760px)', function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var ztl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=340%',
        pin: true,
        anticipatePin: 1,
        /* Hero steht ganz oben und pinnt 340% — muss VOR Werkschau (Prio 1)
           und allem darunter refreshen, sonst rechnen die ohne Hero-Spacing.
           Prioritaet spiegelt die DOM-Reihenfolge: hoeher = weiter oben. */
        refreshPriority: 2,
        scrub: .9,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          /* Scroll während Intro noch läuft: Intro sofort fertigstellen,
             sonst kämpfen Intro und Scrub um dieselben Props */
          if (self.progress > 0.01 && !window.__introFertig && typeof intro !== 'undefined') intro.progress(1);
        }
      }
    });

    /* ── Akt 1: Plakat löst sich auf ── */
    ztl
      .fromTo('.hero__topline, .hero__sub, .hero__cta, .hero__proof',
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -40, duration: .2, stagger: .02, ease: 'power2.in', immediateRender: true })
      .fromTo('.marquee',
        { autoAlpha: 1, yPercent: 0 },
        { autoAlpha: 0, yPercent: 100, duration: .18, immediateRender: true }, '<')
      .fromTo('.k-line--1 .k-zeile',
        { xPercent: 0 },
        { xPercent: -30, duration: .5, ease: 'power2.in', immediateRender: true }, '-=.06')
      .fromTo('.k-line--2 .k-zeile',
        { xPercent: 0 },
        { xPercent: 30, duration: .5, ease: 'power2.in', immediateRender: true }, '<')
      .fromTo('.hero__h--kino',
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: .3, ease: 'power1.in', immediateRender: true }, '-=.24')
      /* Bühne dunkelt leicht ab, Staub + Beam laufen weiter: Kinosaal-Gefühl */
      .fromTo('.story__schatten',
        { opacity: 0 },
        { opacity: .34, duration: .5, ease: 'none', immediateRender: true }, '<');

    /* ── Akt 2: Statements fliegen durch die Kamera ──
       Pro Slide laufen fünf Ebenen gleichzeitig: Geister-Ziffer
       driftet hinten durch, Kicker steigt aus der Maske, die
       Buchstaben des Statements klappen einzeln aus der Tiefe
       hoch, die Zahl zählt mit dem Scrub, der Beam pulst. */
    gsap.utils.toArray('.story__slide').forEach(function (slide, i) {
      var kicker = slide.querySelector('.story__kicker > span');
      var zahl = slide.querySelector('.story__zahl');
      var geist = slide.querySelector('.story__geist');

      /* Statement-Text in Einzelteile zerlegen (Zahl bleibt ein Block) */
      slide.querySelectorAll('.story__wort').forEach(function (wortEl) {
        Array.prototype.slice.call(wortEl.childNodes).forEach(function (n) {
          if (n.nodeType !== 3) return;
          var frag = document.createDocumentFragment();
          n.textContent.split('').forEach(function (ch) {
            if (ch === ' ' || ch === ' ') { frag.appendChild(document.createTextNode(ch)); return; }
            var s = document.createElement('span');
            s.className = 'st-b';
            s.textContent = ch;
            frag.appendChild(s);
          });
          wortEl.replaceChild(frag, n);
        });
      });
      var teile = Array.prototype.slice.call(slide.querySelectorAll('.story__zahl, .st-b'));

      /* Slide-Container nur als Sichtbarkeits-Schalter */
      ztl.fromTo(slide,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: .08, ease: 'none', immediateRender: true },
        /* Überlappung: nächstes Statement steigt schon hoch,
           während das alte noch an der Kamera vorbeifliegt */
        i === 0 ? '+=.08' : '<+=.3');

      /* Geister-Ziffer: driftet über die ganze Slide-Dauer vorbei */
      if (geist) {
        ztl.fromTo(geist,
          { yPercent: 46, scale: .82, autoAlpha: 0 },
          { yPercent: -38, scale: 1.06, autoAlpha: 1, duration: 1.15, ease: 'none', immediateRender: false }, '<');
      }
      /* Buchstaben klappen einzeln aus der Tiefe hoch */
      ztl.fromTo(teile,
        { yPercent: 130, rotationX: 55, autoAlpha: 0 },
        { yPercent: 0, rotationX: 0, autoAlpha: 1, duration: .42, stagger: .028, ease: 'power3.out', immediateRender: false }, '<+=.04');
      /* Kicker steigt aus der Zeilen-Maske */
      if (kicker) {
        ztl.fromTo(kicker,
          { yPercent: 120 },
          { yPercent: 0, duration: .3, ease: 'power3.out', immediateRender: false }, '<+=.1');
      }
      /* Zahl zählt mit dem Scrub — rückwärts scrollen zählt runter */
      if (zahl) {
        var ziel = parseInt(zahl.dataset.storyZiel, 10) || 0;
        var obj = { v: 0 };
        ztl.to(obj, {
          v: ziel, duration: .4, ease: 'power1.inOut',
          onUpdate: function () { zahl.textContent = Math.round(obj.v); }
        }, '<');
      }
      /* Beam pulst bei jedem Auftritt einmal auf */
      ztl.fromTo('#heroBeam',
        { scale: 1 },
        { scale: 1.3, duration: .2, ease: 'power2.out', immediateRender: false }, '<')
        .to('#heroBeam', { scale: 1, duration: .3, ease: 'power2.in' }, '>');

      /* Abgang: fliegt gekippt an der Kamera vorbei */
      ztl.to(slide,
        { autoAlpha: 0, scale: 7, yPercent: -8, rotation: i % 2 ? 3 : -3, duration: .42, ease: 'power2.in' }, '+=.2');
    });

    /* ── Akt 3: Abblende ── */
    ztl
      .fromTo('.hero__balken--oben',
        { scaleY: 0 },
        { scaleY: 1, duration: .5, ease: 'power3.inOut', immediateRender: true }, '-=.1')
      .fromTo('.hero__balken--unten',
        { scaleY: 0 },
        { scaleY: 1, duration: .5, ease: 'power3.inOut', immediateRender: true }, '<')
      .fromTo('#heroStaub, #heroBeam',
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: .3, immediateRender: true }, '<');

    /* ── Akt 4: Abspann — Kino-Credit auf der geschlossenen Letterbox.
       Hero bleibt sichtbar (Balken decken alles ab): der dunkle Frame
       scrollt nach dem Unpin direkt in die Werkschau, keine weiße Lücke. */
    ztl
      .fromTo('.hero__abspann',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: .06, ease: 'none', immediateRender: true }, '-=.15')
      .fromTo('.abspann__kicker > span',
        { yPercent: 120 },
        { yPercent: 0, duration: .3, ease: 'power3.out', immediateRender: false }, '<')
      .fromTo('.abspann__wort',
        { yPercent: 60, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: .4, ease: 'power3.out', immediateRender: false }, '<+=.08')
      .fromTo('.abspann__cue',
        { y: -12, autoAlpha: 0 },
        { y: 0, autoAlpha: .7, duration: .3, ease: 'power2.out', immediateRender: false }, '<+=.15')
      /* Halten: Abspann steht kurz, bevor der Pin löst */
      .to({}, { duration: .25 });
  });

  /* Mobil: sanfte Parallaxe statt Pin — gleiche Capture-Regel */
  gsap.matchMedia().add('(max-width: 759px)', function () {
    gsap.fromTo('.hero__main',
      { yPercent: 0, autoAlpha: 1 },
      {
        yPercent: -12, autoAlpha: .3, ease: 'none', immediateRender: true,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
  });

  /* ── PRELOADER-SEQUENZ → HERO-INTRO ───────────────────── */
  var intro = gsap.timeline({
    paused: true,
    onComplete: function () {
      window.__introFertig = true;
    }
  });
  /* Headline-Typo als Instrument: SplitType zerlegt die Kino-Zeilen
     in Zeichen — jeder Buchstabe steigt einzeln aus der Zeilenmaske
     (yPercent + Kippung), Stagger läuft als Welle über beide Zeilen.
     .k-zeile bleibt als Hülle intakt: der Scroll-Scrub schert weiter
     ganze Zeilen. Ohne SplitType: bewährter Zeilen-Reveal als Fallback. */
  var kinoChars = null;
  if (typeof window.SplitType !== 'undefined') {
    var kinoH = document.getElementById('hero-headline');
    if (kinoH) {
      /* Screenreader lesen die Headline am Stück, nicht Buchstabensalat */
      kinoH.setAttribute('aria-label', kinoH.textContent.replace(/\s+/g, ' ').trim());
      var split = new SplitType('#hero-headline .k-zeile', { types: 'chars' });
      kinoChars = split.chars && split.chars.length ? split.chars : null;
    }
  }
  intro
    .from(kinoChars || '.k-zeile', kinoChars
      ? { yPercent: 118, rotate: 7, duration: .9, stagger: { each: .028, from: 'start' }, ease: 'expo.out' }
      : { yPercent: 114, rotate: 4.5, duration: .95, stagger: .13, ease: 'expo.out' })
    .from('.hero__topline', { autoAlpha: 0, x: -30, duration: .6 }, '-=.6')
    .from('.hero__sub',     { autoAlpha: 0, y: 26,  duration: .6 }, '-=.5')
    .from('.hero__cta > *', { autoAlpha: 0, y: 22, stagger: .06, duration: .55 }, '-=.45')
    .from('.hero__proof',   { autoAlpha: 0, duration: .6 }, '-=.35')
    .from('.marquee',       { yPercent: 100, duration: .7 }, '-=.55');

  /* ── OUVERTÜRE: Preloader als Titelsequenz ──────────────
     Zähler → drei Hardcut-Worte im Schwarz → Kobalt-Lamellen
     steigen hoch, kippen die Fläche in Markenblau und heben
     sich einzeln in den Hero: Vorhang auf. Nur erster Besuch. */
  var laderGesehen = false;
  try { laderGesehen = sessionStorage.getItem('addus-lader') === '1'; } catch (e) {}

  if (window.scrollY > 50) {
    /* Reload mitten auf der Seite (Scroll-Restoration): Intro unsichtbar
       abzuspielen hinterlässt sonst halbfertige Zustände beim Hochscrollen */
    killLader();
    intro.progress(1);
  } else if (lader && !laderGesehen) {
    try { sessionStorage.setItem('addus-lader', '1'); } catch (e) {}
    var z = { v: 0 };
    var wort = document.getElementById('laderWort');
    var otl = gsap.timeline();
    otl
      .to(z, {
        v: 100, duration: .55, ease: 'power2.inOut',
        onUpdate: function () { if (laderZahl) laderZahl.textContent = Math.round(z.v); }
      })
      .to('.lader__in, .lader__hint', { autoAlpha: 0, y: -20, duration: .2 }, '-=.05');
    /* Hardcuts: Wort knallt rein, kein Fade dazwischen */
    ['Kein Baukasten.', 'Alles inklusive.', 'Null Blabla.'].forEach(function (w) {
      otl.add(function () { if (wort) wort.textContent = w; });
      otl.fromTo(wort,
        { scale: 1.16, autoAlpha: 1 },
        { scale: 1, duration: .42, ease: 'power4.out' });
    });
    otl
      /* Lamellen fluten die Fläche in Kobalt, Wort taucht darunter weg */
      .to('.lader__lamellen i', { scaleY: 1, duration: .4, ease: 'power3.inOut', stagger: .055 }, '+=.05')
      .set(wort, { autoAlpha: 0 })
      .set(lader, { backgroundColor: 'transparent' })
      .set('.lader__in, .lader__hint', { autoAlpha: 0 })
      /* ...und heben sich einzeln in den Hero */
      .to('.lader__lamellen i', {
        scaleY: 0, transformOrigin: 'top', duration: .55, ease: 'expo.inOut', stagger: .055
      })
      .add(function () { intro.play(); }, '-=.5')
      .add(function () { killLader(); });
  } else {
    killLader();
    intro.play();
  }

  /* ── REVEALS ──────────────────────────────────────────── */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 34 },
      {
        autoAlpha: 1, y: 0, duration: .7,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
  });

  /* ── FAHRPLAN: Tages-Ruler füllt sich beim Reinscrollen ──
     Ohne JS/bei motion-off bleiben die Ticks statisch sichtbar. */
  gsap.utils.toArray('.etappe').forEach(function (li) {
    var ticks = li.querySelectorAll('.etappe__ruler i.an');
    if (!ticks.length) return;
    gsap.fromTo(ticks,
      { scaleY: 0, transformOrigin: 'bottom' },
      {
        scaleY: 1, duration: .5, ease: 'power3.out', stagger: .08,
        scrollTrigger: { trigger: li, start: 'top 82%', once: true }
      });
  });

  /* ── PAPIER-CHOREOGRAFIE: Ghost-Parallaxe · Zeilen-Kino ──*/

  /* Ghost-Ziffern hinter den Sektionsköpfen fahren in eigener
     Tiefenebene durchs Bild (CSS-Var → Pseudo-Element) */
  gsap.utils.toArray('.skopf[data-ghost]').forEach(function (kopf) {
    var sec = kopf.closest('section') || kopf;
    gsap.fromTo(kopf, { '--ghost-y': '12vh' }, {
      '--ghost-y': '-12vh', ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });
  });

  /* Leistungen: Titel-Wörter steigen aus der Zeile, Numerale
     driften in eigener Ebene, Info folgt versetzt */
  gsap.utils.toArray('.lst').forEach(function (row, i) {
    var titel = row.querySelector('.lst__titel');
    if (titel) {
      splitWorte(titel);
      gsap.from(titel.querySelectorAll('.w > span'), {
        yPercent: 112, duration: .85, stagger: .05, ease: 'expo.out',
        scrollTrigger: { trigger: row, start: 'top 86%', once: true }
      });
    }
    gsap.from(row.querySelector('.lst__info'), {
      autoAlpha: 0, y: 34, duration: .8, delay: .1, ease: 'expo.out',
      scrollTrigger: { trigger: row, start: 'top 86%', once: true }
    });
  });

  /* ── PROBLEME: Streichliste ──────────────────────────────
     Der Scrub streicht jedes Problem Wort für Wort durch,
     das Mono-Label flippt Problem→Gelöst, die Lösung slammt
     aus der Maske hoch. Rückwärts scrollen macht alles wieder
     zum Problem. */
  gsap.utils.toArray('.streich').forEach(function (row) {
    var problem = row.querySelector('.streich__problem');
    var flip = row.querySelector('.streich__flip');
    var loesung = row.querySelector('.streich__loesung > span');
    if (!problem) return;

    /* Wörter in Spans zerlegen, jedes bekommt seinen Strich —
       so bleibt der Durchstrich auch mehrzeilig korrekt */
    var worte = problem.textContent.trim().split(/\s+/);
    problem.textContent = '';
    worte.forEach(function (w, j) {
      var s = document.createElement('span');
      s.className = 'sw';
      s.textContent = w;
      var strich = document.createElement('i');
      strich.setAttribute('aria-hidden', 'true');
      s.appendChild(strich);
      problem.appendChild(s);
      if (j < worte.length - 1) problem.appendChild(document.createTextNode(' '));
    });
    var striche = row.querySelectorAll('.sw > i');

    var stl = gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 74%', end: 'top 28%', scrub: .7 }
    });
    stl
      .fromTo(striche,
        { scaleX: 0 },
        { scaleX: 1, duration: .5, stagger: .16, ease: 'power3.inOut' })
      .fromTo(problem,
        { opacity: 1 },
        { opacity: .38, duration: .3, ease: 'none' }, '-=.25')
      .fromTo(flip,
        { yPercent: 0 },
        { yPercent: -50, duration: .3, ease: 'power2.inOut' }, '<')
      .fromTo(loesung,
        { yPercent: 125 },
        { yPercent: 0, duration: .55, ease: 'power3.out' }, '-=.15');
  });

  /* Blog: Zeilen kaskadieren seitlich rein, Pfeile zuletzt */
  gsap.utils.toArray('.blg__row').forEach(function (row, i) {
    gsap.from(row, {
      autoAlpha: 0, x: i % 2 ? 70 : -70, duration: .8, ease: 'expo.out',
      scrollTrigger: { trigger: row, start: 'top 90%', once: true }
    });
  });

  /* Stimmen: Reihen kippen leicht versetzt ein */
  gsap.utils.toArray('.stimmen__reihe').forEach(function (reihe, i) {
    gsap.from(reihe, {
      autoAlpha: 0, y: 64, rotation: i % 2 ? 1.4 : -1.4,
      duration: .9, ease: 'expo.out',
      scrollTrigger: { trigger: reihe, start: 'top 92%', once: true }
    });
  });

  /* ── WERKSCHAU: horizontal gepinnt + Fortschritt ──────── */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', function () {
    var spur = document.querySelector('.werk__spur');
    var vp = document.querySelector('.werk__viewport');
    if (!spur || !vp) return;
    var nr = document.getElementById('werkNr');
    var balken = document.getElementById('werkBalken');
    var dist = function () { return spur.scrollWidth - window.innerWidth; };
    /* Tiefe: Mikro-Parallaxe pro Panel + Fokus auf das Panel nächst der Mitte */
    var stuecke = gsap.utils.toArray('.werk__stueck');
    var xSet = stuecke.map(function (s) { return gsap.quickSetter(s, 'x', 'px'); });
    /* Kino-Neigung: Panels lehnen sich gegen die Scroll-Richtung */
    var rTo = stuecke.map(function (s) { return gsap.quickTo(s, 'rotation', { duration: .55, ease: 'power2.out' }); });
    var neigClamp = gsap.utils.clamp(-2.2, 2.2);
    if (stuecke[0]) stuecke[0].classList.add('is-fokus');
    /* Panel-Mitten NICHT pro Frame via getBoundingClientRect messen (Layout-
       Thrash im Pin-Scrub = Ruckeln). Einmal pro Refresh die Layout-Basis
       cachen, pro Frame nur die gecachte Spur-X-Translation addieren. */
    var basen = [];
    var fokusIdx = 0;
    /* Sprach-Boten: „diese Seite ist aus genau diesen Bausteinen
       gebaut" — beim ersten Fokus eines Panels fliegen HTML/CSS/JS
       vom Label in den Rahmen. Einmalig pro Panel (dataset-Flag),
       nutzt das vorhandene botFlug()-System (hoisted). */
    function botenZeigen(stueck) {
      if (stueck.dataset.boten) return;
      stueck.dataset.boten = '1';
      var von = stueck.querySelector('.werk__label');
      var zu = stueck.querySelector('.werk__rahmen');
      if (!von || !zu) return;
      ['html', 'css', 'js'].forEach(function (s, i) {
        gsap.delayedCall(i * .22, function () {
          botFlug(stueck, von, zu, s, { hoehe: 90 + i * 26, seitwaerts: (i - 1) * 110, dauer: .7 });
        });
      });
    }
    function messenBasen() {
      var spurX = Number(gsap.getProperty(spur, 'x')) || 0;
      basen = stuecke.map(function (s) {
        var r = s.getBoundingClientRect();
        var eigenX = Number(gsap.getProperty(s, 'x')) || 0;
        return r.left + r.width / 2 - spurX - eigenX;
      });
    }
    gsap.to(spur, {
      x: function () { return -dist(); },
      ease: 'none',
      scrollTrigger: {
        trigger: vp,
        start: 'top top',
        end: function () { return '+=' + dist(); },
        pin: true,
        anticipatePin: 1,
        /* Werkschau steht im DOM vor #probleme, wird aber spaeter erstellt.
           Ohne Prioritaet berechnet #probleme seine Positionen ohne das
           Pin-Spacing → Scrub steht auf Desktop sofort am Ende (Handy okay,
           da dort kein Pin). Hoehere Prioritaet = zuerst refreshen. */
        refreshPriority: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: messenBasen,
        onScrubComplete: function () { rTo.forEach(function (fn) { fn(0); }); },
        onUpdate: function (self) {
          if (balken) balken.style.transform = 'scaleX(' + self.progress + ')';
          if (nr) nr.textContent = '0' + (Math.min(3, Math.floor(self.progress * 4)) + 1);
          var neig = neigClamp(self.getVelocity() / -1600);
          var spurX = Number(gsap.getProperty(spur, 'x')) || 0;
          var mitte = window.innerWidth / 2, best = 0, bestD = Infinity;
          for (var i = 0; i < stuecke.length; i++) {
            var d = basen[i] + spurX - mitte;
            xSet[i]((d / window.innerWidth) * -30);
            rTo[i](neig);
            if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
          }
          if (best !== fokusIdx) {
            stuecke[fokusIdx].classList.remove('is-fokus');
            stuecke[best].classList.add('is-fokus');
            fokusIdx = best;
            botenZeigen(stuecke[best]);
          }
        }
      }
    });

    /* Erstes Panel bekommt nie einen Fokus-Wechsel — Boten starten,
       sobald die Werkschau ins Bild kommt */
    ScrollTrigger.create({
      trigger: vp, start: 'top 60%', once: true,
      onEnter: function () { botenZeigen(stuecke[0]); }
    });
  });

  /* Handy: Fortschritt (01/04 + Balken) folgt dem nativen Swipe-Scroller */
  mm.add('(max-width: 899px)', function () {
    var spur = document.querySelector('.werk__spur');
    if (!spur) return;
    var nr = document.getElementById('werkNr');
    var balken = document.getElementById('werkBalken');
    var raf = 0;
    function upd() {
      raf = 0;
      var max = spur.scrollWidth - spur.clientWidth;
      var p = max > 0 ? spur.scrollLeft / max : 0;
      if (balken) balken.style.transform = 'scaleX(' + p + ')';
      if (nr) nr.textContent = '0' + (Math.min(3, Math.floor(p * 4)) + 1);
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(upd); }
    spur.addEventListener('scroll', onScroll, { passive: true });
    upd();
    return function () {
      spur.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  });

  /* ── WERKSCHAU-AUFTRITT: Tinte-Vorhang hebt sich lamellenweise ── */
  gsap.to('.werk__vorhang i', {
    scaleY: 0, ease: 'expo.inOut', duration: .75, stagger: .07,
    scrollTrigger: { trigger: '.werk', start: 'top 72%', once: true }
  });
  /* Handy: nur Fade — Transforms auf Kindern des Snap-Scrollers
     erzeugen Sprünge/Ruckler beim Swipen. Desktop: voller Auftritt. */
  if (window.matchMedia('(min-width: 900px)').matches) {
    gsap.from('.werk__stueck', {
      y: 130,
      rotation: function (i) { return i % 2 ? 2.6 : -2.6; },
      scale: .93,
      autoAlpha: 0,
      duration: 1,
      stagger: .11,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.werk__viewport', start: 'top 82%', once: true }
    });
  } else {
    gsap.from('.werk__stueck', {
      autoAlpha: 0,
      duration: .6,
      stagger: .08,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.werk__viewport', start: 'top 85%', once: true }
    });
  }
  gsap.from('.werk__fortschritt', {
    autoAlpha: 0, x: -40, duration: .7,
    scrollTrigger: { trigger: '.werk__viewport', start: 'top 82%', once: true }
  });

  /* ── LAUFBÄNDER: GSAP-Loop + Velocity (Skew + Tempo) ────
     CSS-Keyframes bleiben als motion-off-Fallback; hier ersetzt
     ein xPercent-Endlos-Tween die Animation, damit die Geschwindigkeit
     mit der Scroll-Velocity atmen kann. */
  (function baender() {
    var tracks = gsap.utils.toArray('.marquee__track, .stimmen__track');
    if (!tracks.length) return;
    var tweens = tracks.map(function (tr) {
      tr.style.animation = 'none';
      var rueck = !!tr.closest('.stimmen__reihe--rueck');
      var dauer = tr.classList.contains('marquee__track') ? 26 : 48;
      var tw = gsap.fromTo(tr,
        { xPercent: rueck ? -50 : 0 },
        { xPercent: rueck ? 0 : -50, duration: dauer, ease: 'none', repeat: -1 });
      var reihe = tr.closest('.stimmen__reihe');
      if (reihe) {
        reihe.addEventListener('mouseenter', function () { tw.pause(); });
        reihe.addEventListener('mouseleave', function () { tw.play(); });
      }
      /* Unsichtbare Bänder laufen nicht weiter: spart Frames + Akku (Mobile) */
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) {
          if (!e[0].isIntersecting) tw.pause();
          else if (!reihe || !reihe.matches(':hover')) tw.play();
        }).observe(tr.parentElement || tr);
      }
      return tw;
    });
    var setter = tracks.map(function (tr) { return gsap.quickSetter(tr, 'skewX', 'deg'); });
    var clamp = gsap.utils.clamp(-8, 8);
    var proxy = { s: 0, t: 1 };
    function anwenden() {
      setter.forEach(function (fn) { fn(proxy.s); });
      tweens.forEach(function (tw) { if (!tw.paused()) tw.timeScale(proxy.t); });
    }
    ScrollTrigger.create({
      onUpdate: function (self) {
        var v = self.getVelocity();
        var s = clamp(v / -220);
        var t = 1 + Math.min(2, Math.abs(v) / 1200);
        if (Math.abs(s) > Math.abs(proxy.s) || t > proxy.t) {
          proxy.s = s;
          proxy.t = Math.max(t, proxy.t);
          gsap.to(proxy, { s: 0, t: 1, duration: .8, ease: 'power3.out', overwrite: true, onUpdate: anwenden, onComplete: anwenden });
        }
      }
    });
  })();

  /* ── ZAHLEN-COUNTER (Preis + Stats) ───────────────────── */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var ziel = parseFloat(el.dataset.count);
    var dez = el.dataset.dez ? parseInt(el.dataset.dez, 10) : 0;
    var obj = { v: parseFloat(el.dataset.start || 0) };
    gsap.to(obj, {
      v: ziel, duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: function () {
        el.textContent = obj.v.toFixed(dez).replace('.', ',');
      }
    });
  });

  /* ── PREIS-ODOMETER: Ziffernsäulen rollen auf den Monatspreis (27) ─────── */
  (function odo() {
    var el = document.querySelector('.preis__zahl .odo');
    if (!el) return;
    var ziffern = el.textContent.trim().split('');
    el.textContent = '';
    ziffern.forEach(function (d, i) {
      var slot = document.createElement('span'); slot.className = 'odo__slot';
      var col = document.createElement('span'); col.className = 'odo__col';
      for (var n = 0; n <= 9; n++) {
        var s = document.createElement('span'); s.textContent = n; col.appendChild(s);
      }
      slot.appendChild(col); el.appendChild(slot);
      gsap.fromTo(col, { yPercent: -90 }, {
        yPercent: -parseInt(d, 10) * 10,
        duration: 1.4 + i * .3, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });
  })();

  /* ── AUDIT: Grade-Ticker + Scan-Linie ─────────────────── */
  gsap.utils.toArray('.audit__card').forEach(function (card, i) {
    var grade = card.querySelector('.audit__grade');
    var scan = card.querySelector('.audit__scan');
    if (!grade) return;
    var ziel = grade.dataset.grade || 'A+';
    var stufen = ['F', 'E', 'D', 'C', 'B', 'A', 'A+'];
    var obj = { v: 0 };
    grade.textContent = stufen[0]; /* nur bei aktivem Motion; ohne JS steht A+ im Markup */
    var tl = gsap.timeline({
      delay: i * 0.12,
      scrollTrigger: { trigger: card, start: 'top 82%', once: true }
    });
    if (scan) {
      tl.fromTo(scan,
        { y: 0, autoAlpha: 1 },
        { y: function () { return card.clientHeight; }, autoAlpha: 0, duration: .9, ease: 'power2.inOut' }, 0);
    }
    tl.to(obj, {
      v: stufen.length - 1, duration: 1.1, ease: 'expo.out',
      onUpdate: function () { grade.textContent = stufen[Math.round(obj.v)]; },
      onComplete: function () { grade.textContent = ziel; card.classList.add('is-done'); }
    }, 0.15);
  });

  /* ── ÜBER-FOTO: Scale-Reveal ──────────────────────────── */
  /* clearProps: Inline-Transform nach dem Reveal räumen,
     sonst blockiert er den CSS-Hover-Zoom (scale) */
  gsap.from('.ueber__foto img', {
    scale: 1.12, duration: 1.4, ease: 'expo.out',
    clearProps: 'transform,scale,translate,rotate',
    scrollTrigger: { trigger: '.ueber__foto', start: 'top 88%', once: true }
  });

  /* ── MAGNETIC BUTTONS (nur feine Pointer) ─────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-magnet]').forEach(function (btn) {
      var qx = gsap.quickTo(btn, 'x', { duration: .4, ease: 'power3.out' });
      var qy = gsap.quickTo(btn, 'y', { duration: .4, ease: 'power3.out' });
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * .3);
        qy((e.clientY - r.top - r.height / 2) * .35);
      });
      btn.addEventListener('mouseleave', function () { qx(0); qy(0); });
    });
  }

  /* ── FOOTER-MARKE: Parallaxe + Letter-Stagger ─────────── */
  gsap.from('.ftr__marke', {
    yPercent: 30, ease: 'none',
    scrollTrigger: { trigger: '.ftr', start: 'top bottom', end: 'bottom bottom', scrub: 1 }
  });
  var marke = document.querySelector('.ftr__marke');
  if (marke) {
    splitBuchstaben(marke);
    gsap.from(marke.querySelectorAll('.lq'), {
      yPercent: 60, autoAlpha: 0, duration: .9, stagger: .05, ease: 'expo.out',
      scrollTrigger: { trigger: marke, start: 'top 94%', once: true }
    });
  }

  /* Deep-Link mit #hash (z.B. impressum.html → /#kontakt): erst nach dem
     Pin-Aufbau ist die echte Zielposition bekannt — sonst landet der
     native Sprung vor der Werkschau-Pin-Strecke daneben. */
  function zuAnker() {
    if (!location.hash || location.hash.length < 2) return;
    var z;
    try { z = document.querySelector(location.hash); } catch (e) { return; }
    if (!z) return;
    if (lenis) lenis.scrollTo(z, { offset: -60, immediate: true });
    else z.scrollIntoView();
  }

  /* ── LABOR-DEMOS: die Vorschau-Fenster leben wirklich ──── */

  /* Demo „SVG-Zeichner": Sprach-Boten zeigen die Staffel — SVG liefert
     den Pfad (Geisterlinie), JavaScript zeichnet ihn nach */
  (function labSvg() {
    var linie = document.getElementById('labLinie');
    var knopf = document.getElementById('labLinieBtn');
    var tab = document.getElementById('labt-svg');
    if (!linie || !linie.getTotalLength) return;
    var panel = document.getElementById('labp-svg');
    var duo = panel.querySelector('.lab__duo');
    var mehr = panel.querySelector('.lab__mehr');
    var laenge = linie.getTotalLength();
    gsap.set(linie, { strokeDasharray: laenge, strokeDashoffset: laenge });

    /* Geisterlinie: der "Bauplan", den der SVG-Bote abliefert */
    var geist = linie.cloneNode(false);
    geist.removeAttribute('id');
    geist.removeAttribute('style');
    geist.setAttribute('class', 'linie-geist');
    linie.parentNode.insertBefore(geist, linie);
    gsap.set(geist, { autoAlpha: 0 });

    function blockAktiv(name) {
      mehr.classList.toggle('spielt', !!name);
      mehr.querySelectorAll('.mehr__block').forEach(function (b) {
        b.classList.toggle('aktiv', b.getAttribute('data-block') === name);
      });
    }

    var spielt = false;
    function zeichnen() {
      if (spielt) return;
      spielt = true;
      gsap.set(linie, { strokeDasharray: laenge, strokeDashoffset: laenge });
      gsap.set(geist, { autoAlpha: 0 });
      blockAktiv('svg');
      /* Bote 1: SVG bringt den Bauplan */
      botFlug(duo, mehr.querySelector('[data-block="svg"]'), linie.parentNode, 'svg', {
        beiAnkunft: function () {
          gsap.to(geist, { autoAlpha: .3, duration: .3 });
          blockAktiv('js2');
          /* Bote 2: JavaScript kommt mit dem Stift */
          botFlug(duo, mehr.querySelector('[data-block="js2"]'), linie.parentNode, 'js', {
            beiAnkunft: function () {
              gsap.to(linie, {
                strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', overwrite: true,
                onComplete: function () { blockAktiv(null); spielt = false; }
              });
            }
          });
        }
      });
    }
    if (knopf) knopf.addEventListener('click', zeichnen);
    if (tab) tab.addEventListener('click', zeichnen);
  })();

  /* Demo „Schwerkraft": die Sprachen als werfbare Physik-Bälle —
     Gravitation, Aufprall, Kollision, alles von Hand gerechnet */
  (function labGrav() {
    var cv = document.getElementById('labGrav');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    var w = 0, h = 0, raf = 0, running = false, sichtbar = false;
    var SORTEN = [
      { g: '<>', f: '#E34F26', t: '#fff' },
      { g: '#', f: '#33A9DC', t: '#101010' },
      { g: '{}', f: '#F7DF1E', t: '#101010' },
      { g: '~', f: '#FFB13B', t: '#101010' },
      { g: 'n', f: '#5FA04E', t: '#fff' }
    ];
    var baelle = [], griff = null, letzt = { x: 0, y: 0 };

    function bauen() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!baelle.length) {
        baelle = SORTEN.map(function (s, i) {
          return {
            x: w * (i + 1) / (SORTEN.length + 1), y: h * .25,
            vx: (i % 2 ? 1 : -1) * (1 + i * .4), vy: 0, r: 24, s: s
          };
        });
      }
    }
    function schritt() {
      for (var i = 0; i < baelle.length; i++) {
        var b = baelle[i];
        if (b !== griff) {
          b.vy += .5;                       /* Gravitation */
          b.x += b.vx; b.y += b.vy;
          if (b.y > h - b.r) { b.y = h - b.r; b.vy *= -.78; b.vx *= .99; }
          if (b.x < b.r) { b.x = b.r; b.vx *= -.82; }
          if (b.x > w - b.r) { b.x = w - b.r; b.vx *= -.82; }
        }
        /* Kollision: Impulse entlang der Verbindungslinie tauschen */
        for (var j = i + 1; j < baelle.length; j++) {
          var a = baelle[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d = Math.hypot(dx, dy) || 1, min = a.r + b.r;
          if (d < min) {
            var nx = dx / d, ny = dy / d, ueber = (min - d) / 2;
            a.x += nx * ueber; a.y += ny * ueber;
            b.x -= nx * ueber; b.y -= ny * ueber;
            var pa = a.vx * nx + a.vy * ny, pb = b.vx * nx + b.vy * ny;
            a.vx += (pb - pa) * nx; a.vy += (pb - pa) * ny;
            b.vx += (pa - pb) * nx; b.vy += (pa - pb) * ny;
          }
        }
      }
    }
    function malen() {
      ctx.clearRect(0, 0, w, h);
      baelle.forEach(function (b) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.s.f;
        ctx.fill();
        ctx.fillStyle = b.s.t;
        ctx.font = '700 13px ui-monospace, Consolas, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(b.s.g, b.x, b.y + 1);
      });
      if (running) { schritt(); raf = requestAnimationFrame(malen); }
    }
    function start() { if (!running) { bauen(); running = true; raf = requestAnimationFrame(malen); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    function sync() {
      var offen = !cv.closest('[hidden]');
      (offen && sichtbar && !document.hidden) ? start() : stop();
    }

    function zeiger(e) {
      var r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    cv.addEventListener('pointerdown', function (e) {
      var p = zeiger(e);
      for (var i = baelle.length - 1; i >= 0; i--) {
        var b = baelle[i];
        if (Math.hypot(p.x - b.x, p.y - b.y) < b.r + 6) {
          griff = b; letzt = p;
          cv.setPointerCapture(e.pointerId);
          break;
        }
      }
    });
    cv.addEventListener('pointermove', function (e) {
      if (!griff) return;
      var p = zeiger(e);
      griff.vx = p.x - letzt.x; griff.vy = p.y - letzt.y;
      griff.x = p.x; griff.y = p.y; letzt = p;
    });
    function loslassen() { griff = null; }
    cv.addEventListener('pointerup', loslassen);
    cv.addEventListener('pointercancel', loslassen);

    window.addEventListener('resize', function () { if (running) bauen(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; sync(); }).observe(cv);
    } else { sichtbar = true; }
    document.addEventListener('visibilitychange', sync);
    document.querySelectorAll('.lab__tab').forEach(function (t) {
      t.addEventListener('click', function () { setTimeout(sync, 0); });
    });
  })();

  /* Demo „Partikel-Staub": exakt der gezeigte Code — läuft nur,
     wenn das Panel offen UND im Viewport ist (kein Leerlauf-rAF) */
  (function labStaub() {
    var cv = document.getElementById('labStaub');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    var punkte = [], w = 0, h = 0, raf = 0, running = false, sichtbar = false;
    var maus = { x: -9999, y: -9999 };

    function bauen() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = 'rgba(246,244,238,.9)';
      punkte = [];
      for (var i = 0; i < 90; i++) {
        var x = Math.random() * w, y = Math.random() * h;
        punkte.push({ x: x, y: y, hx: x, hy: y });
      }
    }
    function malen() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < punkte.length; i++) {
        var p = punkte[i];
        var dx = p.x - maus.x, dy = p.y - maus.y;
        var d = Math.hypot(dx, dy) || 1;
        if (d < 80) { p.x += dx / d * 2.4; p.y += dy / d * 2.4; }
        p.x += (p.hx - p.x) * .05;
        p.y += (p.hy - p.y) * .05;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      if (running) raf = requestAnimationFrame(malen);
    }
    function start() { if (!running) { if (!punkte.length) bauen(); running = true; raf = requestAnimationFrame(malen); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    function sync() {
      var offen = !cv.closest('[hidden]');
      (offen && sichtbar && !document.hidden) ? start() : stop();
    }

    cv.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      maus.x = e.clientX - r.left; maus.y = e.clientY - r.top;
    });
    cv.addEventListener('pointerleave', function () { maus.x = maus.y = -9999; });
    window.addEventListener('resize', function () { if (running) bauen(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; sync(); }).observe(cv);
    } else { sichtbar = true; }
    document.addEventListener('visibilitychange', sync);
    document.querySelectorAll('.lab__tab').forEach(function (t) {
      t.addEventListener('click', function () { setTimeout(sync, 0); });
    });
  })();

  /* ── SPRACH-BOTEN: jede Sprache ist ein gebrandeter Ball ────
     Fliegt eine Quadratik-Bezier-Kurve (Bogen), neigt sich in
     Flugrichtung, streckt sich im Flug (Squash & Stretch) und
     hinterlässt eine Funkenspur. Von allen Demos gemeinsam genutzt. */
  var BOTEN = {
    html: { farbe: '#E34F26', glyph: '<>', text: '#fff' },
    css:  { farbe: '#33A9DC', glyph: '#',  text: '#101010' },
    js:   { farbe: '#F7DF1E', glyph: '{}', text: '#101010' },
    svg:  { farbe: '#FFB13B', glyph: '~',  text: '#101010' },
    node: { farbe: '#5FA04E', glyph: 'n',  text: '#fff' }
  };

  function botMitte(container, el) {
    var r = el.getBoundingClientRect(), b = container.getBoundingClientRect();
    return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
  }

  function botFlug(container, vonEl, zuEl, sprache, opts) {
    opts = opts || {};
    var art = BOTEN[sprache];
    var von = botMitte(container, vonEl), zu = botMitte(container, zuEl);
    /* Kontrollpunkt: Bogen wölbt sich quer zur Flugrichtung nach oben */
    var cx = (von.x + zu.x) / 2 + (opts.seitwaerts || 0);
    var cy = Math.min(von.y, zu.y) - (opts.hoehe || 64);

    var ball = document.createElement('span');
    ball.className = 'bote';
    ball.textContent = art.glyph;
    ball.style.background = art.farbe;
    ball.style.color = art.text;
    ball.style.boxShadow = '0 0 14px ' + art.farbe + ', 0 0 30px ' + art.farbe + '66';
    container.appendChild(ball);

    var lauf = { t: 0 }, spurZeit = 0;
    gsap.set(ball, { x: von.x, y: von.y, scale: .3, autoAlpha: 0 });
    gsap.to(ball, { autoAlpha: 1, scale: 1, duration: .14 });
    gsap.to(lauf, {
      t: 1, duration: opts.dauer || .6, ease: 'power1.inOut',
      onUpdate: function () {
        var t = lauf.t, u = 1 - t;
        var x = u * u * von.x + 2 * u * t * cx + t * t * zu.x;
        var y = u * u * von.y + 2 * u * t * cy + t * t * zu.y;
        /* Tangente → Ball neigt sich in Flugrichtung, streckt sich mittig */
        var dx = 2 * u * (cx - von.x) + 2 * t * (zu.x - cx);
        var dy = 2 * u * (cy - von.y) + 2 * t * (zu.y - cy);
        var stretch = 1 + Math.sin(t * Math.PI) * .35;
        gsap.set(ball, {
          x: x, y: y,
          rotation: Math.atan2(dy, dx) * 180 / Math.PI,
          scaleX: stretch, scaleY: 2 - stretch
        });
        /* Funkenspur: alle ~45 ms ein verglühender Punkt */
        var jetzt = lauf.t;
        if (jetzt - spurZeit > .12) {
          spurZeit = jetzt;
          var funke = document.createElement('i');
          funke.className = 'bote__funke';
          funke.style.background = art.farbe;
          container.appendChild(funke);
          gsap.set(funke, { x: x, y: y });
          gsap.to(funke, {
            autoAlpha: 0, scale: .1, duration: .38, ease: 'power1.out',
            onComplete: function () { funke.remove(); }
          });
        }
      },
      onComplete: function () {
        gsap.to(ball, {
          scale: 1.8, autoAlpha: 0, rotation: 0, duration: .22, ease: 'power2.out',
          onComplete: function () { ball.remove(); }
        });
        if (opts.beiAnkunft) opts.beiAnkunft();
      }
    });
  }

  /* Demo „Zusammenspiel": drei Sprachen bauen live EIN Bauteil.
     HTML mauert eine Wand aus echtem Code, der zu Stein wird —
     CSS verputzt sie — JavaScript zieht ein. Die Boten (Bälle)
     tragen die Arbeit vom Code zur Bühne. */
  (function labTrio() {
    var karte = document.getElementById('trioKarte');
    var zahl = document.getElementById('trioZahl');
    var schritt = document.getElementById('trioSchritt');
    var los = document.getElementById('trioLos');
    var replay = document.getElementById('trioReplay');
    var tab = document.getElementById('labt-trio');
    var mehr = document.querySelector('.lab__mehr');
    if (!karte || !mehr) return;
    var bloecke = Array.prototype.slice.call(mehr.querySelectorAll('.mehr__block'));
    var duo = karte.closest('.lab__duo');

    function aktiv(name) {
      mehr.classList.toggle('spielt', !!name);
      bloecke.forEach(function (b) {
        b.classList.toggle('aktiv', b.getAttribute('data-block') === name);
      });
    }
    function sage(text) { if (schritt) schritt.textContent = text; }
    function block(name) { return mehr.querySelector('[data-block="' + name + '"]'); }
    function zeilen(name) { return block(name).querySelectorAll('.zeile'); }

    /* Echte Inhalte VOR dem Ring einsammeln — sonst tweent Akt 1 den Ring mit */
    var kinder = Array.prototype.slice.call(karte.children);
    var bauteile = kinder.slice().reverse();
    var ring = document.createElement('i');
    ring.className = 'mkarte__ring';
    karte.appendChild(ring);

    function ringBlitz(farbe) {
      gsap.set(ring, { borderColor: farbe });
      gsap.fromTo(ring, { autoAlpha: .9, scale: .92 }, { autoAlpha: 0, scale: 1.14, duration: .5, ease: 'power2.out' });
    }

    /* Staffelübergabe: Sprach-Bote fliegt Code → Karte, Ring blitzt */
    function uebergabe(tl, name, pos) {
      tl.add(function () {
        botFlug(duo, block(name), karte, name, {
          beiAnkunft: function () { ringBlitz(BOTEN[name].farbe); }
        });
      }, pos);
      tl.to({}, { duration: .68 }); /* Flugzeit blocken */
    }

    /* ── CODE WIRD STEIN: die Wand mauert sich aus echten Tags,
       jeder Brocken fliegt vom Code-Fenster an seinen Platz im
       Mauerverbund und versteinert dort (Text → Ziegel) ── */
    var WAND = ['<article>', '<h3>', '</h3>', '<p>', '<b id="zahl">', '</p>', '<button>', '</button>', '</article>', 'class="karte"'];
    function mauern() {
      var von = botMitte(duo, block('html'));
      /* Karte ist hier auf scaleY:0 zusammengefaltet — die Bühne ist der stabile Anker */
      var zu = botMitte(duo, karte.parentNode);
      var kw = Math.max(karte.offsetWidth, 200), kh = Math.max(karte.offsetHeight, 150);
      WAND.forEach(function (tok, i) {
        var s = document.createElement('span');
        s.className = 'brocken';
        s.textContent = tok;
        duo.appendChild(s);
        var reihe = Math.floor(i / 2), spalte = i % 2;
        /* Mauerverbund: jede zweite Reihe um einen halben Stein versetzt */
        var tx = zu.x + (spalte ? kw * .21 : -kw * .21) + (reihe % 2 ? kw * .08 : 0);
        var ty = zu.y + kh * .38 - reihe * (kh * .19);
        gsap.fromTo(s,
          { x: von.x, y: von.y + (i - WAND.length / 2) * 5, xPercent: -50, yPercent: -50, autoAlpha: 0, scale: .5, rotation: spalte ? 8 : -8 },
          { x: tx, y: ty, autoAlpha: 1, scale: 1, rotation: 0, duration: .5, delay: i * .07, ease: 'power2.inOut' });
        /* Versteinern: Schrift erlischt, der Ziegel bleibt */
        gsap.to(s, {
          delay: .55 + i * .07, duration: .4, ease: 'power1.in',
          color: 'transparent',
          backgroundColor: 'rgba(246,244,238,.14)',
          borderColor: 'rgba(246,244,238,.38)'
        });
        /* Die Mauer löst sich in die fertige Karte auf */
        gsap.to(s, {
          delay: 1.55, duration: .45, autoAlpha: 0, scale: .85, ease: 'power2.in',
          onComplete: function () { s.remove(); }
        });
      });
    }

    var z = { v: 0 };
    var tl = gsap.timeline({ paused: true });
    tl
      /* ── Akt 1: HTML mauert — Code fliegt, wird Stein, wird Haus ── */
      .add(function () {
        aktiv('html'); sage('01 · HTML mauert die Wand — aus Code …');
        karte.classList.add('mkarte--roh');
        z.v = 0; if (zahl) zahl.textContent = '0';
        gsap.set(kinder, { autoAlpha: 0 });
        gsap.set(karte, { scaleY: 0, transformOrigin: 'bottom center', scale: 1, y: 0 });
      })
      .fromTo(zeilen('html'),
        { autoAlpha: .12, x: -10 },
        { autoAlpha: 1, x: 0, duration: .22, stagger: .07, ease: 'power2.out', immediateRender: false })
      .add(mauern, '+=.05')
      .to({}, { duration: 1.5 })
      /* Hinter der Mauer wachsen die Wände hoch */
      .fromTo(karte,
        { scaleY: 0, transformOrigin: 'bottom center' },
        { scaleY: 1, duration: .55, ease: 'power3.out', immediateRender: false }, '-=.55')
      /* Bauteile stürzen ein: Tür → Fenster → Dach, Bounce beim Landen */
      .fromTo(bauteile,
        { y: -70, autoAlpha: 0, rotation: function (i) { return i % 2 ? 6 : -6; } },
        { y: 0, autoAlpha: 1, rotation: 0, duration: .55, stagger: .2, ease: 'bounce.out', immediateRender: false }, '-=.1')
      .to(karte, { y: 3, duration: .06, yoyo: true, repeat: 3, ease: 'power1.inOut' }, '-=.4')

      /* ── Akt 2: CSS tippt, Bote fliegt, Design morpht drüber ── */
      .add(function () { aktiv('css'); sage('02 · CSS verputzt und streicht …'); }, '+=.3')
      .fromTo(zeilen('css'),
        { autoAlpha: .12, x: -10 },
        { autoAlpha: 1, x: 0, duration: .2, stagger: .06, ease: 'power2.out', immediateRender: false });
    uebergabe(tl, 'css', '+=.05');
    tl
      .add(function () { karte.classList.remove('mkarte--roh'); }, '-=.12')
      .fromTo(karte, { scale: .96 }, { scale: 1, duration: .55, ease: 'back.out(2.4)', immediateRender: false })

      /* ── Akt 3: JS tippt, Bote fliegt, die Karte lebt ── */
      .add(function () { aktiv('js'); sage('03 · JavaScript zieht ein …'); }, '+=.3')
      .fromTo(zeilen('js'),
        { autoAlpha: .12, x: -10 },
        { autoAlpha: 1, x: 0, duration: .2, stagger: .06, ease: 'power2.out', immediateRender: false });
    uebergabe(tl, 'js', '+=.05');
    tl
      .to(z, {
        v: 100, duration: 1.1, ease: 'power2.out',
        onUpdate: function () { if (zahl) zahl.textContent = Math.round(z.v); }
      }, '-=.1')
      .fromTo(los, { scale: 1 }, { scale: 1.12, duration: .16, yoyo: true, repeat: 3, ease: 'power2.inOut', immediateRender: false }, '-=.45')

      /* ── Finale: die drei Boten drehen eine flüssige Ehrenrunde —
         versetzte Bögen, dann saugt das Werk sie auf ── */
      .add(function () {
        aktiv(null); sage('Drei Sprachen · ein Bauteil');
        var zu = botMitte(duo, karte);
        ['html', 'css', 'js'].forEach(function (name, i) {
          var art = BOTEN[name];
          var b = document.createElement('span');
          b.className = 'bote';
          b.textContent = art.glyph;
          b.style.background = art.farbe;
          b.style.color = art.text;
          b.style.boxShadow = '0 0 14px ' + art.farbe;
          duo.appendChild(b);
          var lauf = { w: -Math.PI / 2 + i * (Math.PI * 2 / 3) };
          gsap.set(b, { x: zu.x, y: zu.y, scale: 0, autoAlpha: 0 });
          gsap.to(b, { scale: .9, autoAlpha: 1, duration: .25, delay: i * .08 });
          gsap.to(lauf, {
            w: lauf.w + Math.PI * 2, duration: 1.3, delay: i * .08, ease: 'power1.inOut',
            onUpdate: function () {
              gsap.set(b, { x: zu.x + Math.cos(lauf.w) * 108, y: zu.y + Math.sin(lauf.w) * 64 });
            },
            onComplete: function () {
              gsap.to(b, {
                x: zu.x, y: zu.y, scale: 0, autoAlpha: 0, duration: .32, ease: 'power2.in',
                onComplete: function () { b.remove(); }
              });
            }
          });
        });
        gsap.delayedCall(1.75, function () { ringBlitz('#f6f4ee'); });
      }, '+=.15')
      .to({}, { duration: 2.2 });

    function abspielen() { tl.restart(); }
    if (replay) replay.addEventListener('click', abspielen);
    if (tab) tab.addEventListener('click', abspielen);
    if (los) los.addEventListener('click', function () {
      gsap.fromTo(los, { scale: .9 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)' });
    });
    /* Autoplay beim ersten Scroll ins Labor — nur wenn Trio-Panel offen */
    ScrollTrigger.create({
      trigger: '#labor', start: 'top 55%', once: true,
      onEnter: function () { if (!karte.closest('[hidden]')) abspielen(); }
    });
  })();

  /* Demo „Text-Decoder": exakt der gezeigte Code */
  (function labDecoder() {
    var ziel = document.getElementById('labDecoder');
    var knopf = document.getElementById('labDecoderBtn');
    var tab = document.getElementById('labt-decode');
    if (!ziel) return;
    var GLYPHEN = '!<>-_/[]{}=+*^?#';
    var WORT = 'HANDCODE.';
    var laeuft = false;
    function entschluesseln() {
      if (laeuft) return;
      laeuft = true;
      var frame = 0;
      (function tick() {
        var aus = '';
        for (var i = 0; i < WORT.length; i++) {
          aus += frame / 3 > i ? WORT[i] : GLYPHEN[Math.random() * GLYPHEN.length | 0];
        }
        ziel.textContent = aus;
        if (frame++ < WORT.length * 3 + 3) requestAnimationFrame(tick);
        else { ziel.textContent = WORT; laeuft = false; }
      })();
    }
    if (knopf) knopf.addEventListener('click', entschluesseln);
    if (tab) tab.addEventListener('click', entschluesseln);
  })();

  /* Nach Font-Load Pins neu messen */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { safeRefresh(); zuAnker(); });
  } else {
    zuAnker();
  }
})();
