/* ═══════════════════════════════════════════════════════════
   addus. PLAKAT II — Choreografie
   Lenis (self-hosted) · GSAP 3 + ScrollTrigger (self-hosted)
   Preloader · Punktnetz-Canvas · Custom Cursor · Wort-Masken
   transform/opacity only · prefers-reduced-motion respektiert
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

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
    if (navProg) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      navProg.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
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
      /* Nur bei Breitenänderung neu skalieren — verhindert ResizeObserver-Loop
         (box.style.height unten löst sonst erneut den Observer aus). */
      if (cw < 10 || cw === parseFloat(f.dataset.lastCw)) return;
      f.dataset.lastCw = cw;
      changed = true;
      var rw = parseInt(f.dataset.rw, 10) || 1300;
      var rh = parseInt(f.dataset.rh, 10) || 975;
      /* Demo füllt die Breite exakt; Rahmenhöhe = skalierte Demo + Leiste.
         +1px Overscan schluckt Rundungs-Slivers an den Kanten. */
      var s = (cw + 1) / rw;
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

  if ('IntersectionObserver' in window && frames.length) {
    var frameIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var f = e.target;
        if (f.dataset.src && !f.src) f.src = f.dataset.src;
        frameIO.unobserve(f);
      });
    }, { rootMargin: '900px' });
    frames.forEach(function (f) { frameIO.observe(f); });
  } else {
    frames.forEach(function (f) { if (f.dataset.src) f.src = f.dataset.src; });
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
    window.addEventListener('mousemove', function (e) {
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
            zählen mit dem Scrub (14 Tage · 699 € · Handcode)
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
  intro
    .from('.k-zeile', {
      yPercent: 114, rotate: 4.5, duration: .95, stagger: .13, ease: 'expo.out'
    })
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
    ['Kein Baukasten.', 'Kein Abo.', 'Null Blabla.'].forEach(function (w) {
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
    gsap.to(spur, {
      x: function () { return -dist(); },
      ease: 'none',
      scrollTrigger: {
        trigger: vp,
        start: 'top top',
        end: function () { return '+=' + dist(); },
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        onScrubComplete: function () { rTo.forEach(function (fn) { fn(0); }); },
        onUpdate: function (self) {
          if (balken) balken.style.transform = 'scaleX(' + self.progress + ')';
          if (nr) nr.textContent = '0' + (Math.min(3, Math.floor(self.progress * 4)) + 1);
          var neig = neigClamp(self.getVelocity() / -1600);
          var mitte = window.innerWidth / 2, best = 0, bestD = Infinity;
          for (var i = 0; i < stuecke.length; i++) {
            var r = stuecke[i].getBoundingClientRect();
            var d = r.left + r.width / 2 - mitte;
            xSet[i]((d / window.innerWidth) * -30);
            rTo[i](neig);
            if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
          }
          for (i = 0; i < stuecke.length; i++) {
            stuecke[i].classList.toggle('is-fokus', i === best);
          }
        }
      }
    });
  });

  /* ── WERKSCHAU-AUFTRITT: Tinte-Vorhang hebt sich lamellenweise ── */
  gsap.to('.werk__vorhang i', {
    scaleY: 0, ease: 'expo.inOut', duration: .75, stagger: .07,
    scrollTrigger: { trigger: '.werk', start: 'top 72%', once: true }
  });
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

  /* ── PREIS-ODOMETER: Ziffernsäulen rollen auf 699 ─────── */
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

  /* Nach Font-Load Pins neu messen */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { safeRefresh(); zuAnker(); });
  } else {
    zuAnker();
  }
})();
