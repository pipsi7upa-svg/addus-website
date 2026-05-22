/* addus. — Editorial JS
   Nav burger, FAQ, Reviews-Carousel, Reveal, Contact Form (Formspree + Turnstile)
*/
(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  // ── NAV BURGER ──
  var burger = document.querySelector('.nav__burger');
  var menu = document.getElementById('main-nav');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── NAV SCROLLED STATE ──
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── FAQ ACCORDION ──
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var expanded = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  // ── REVIEWS CAROUSEL (pauses when off-screen) ──
  var slides = Array.from(document.querySelectorAll('.trust__slide'));
  var dots = Array.from(document.querySelectorAll('.trust__dot'));
  if (slides.length && dots.length) {
    var idx = 0;
    var carouselTimer = null;
    var carouselInView = false;
    var trustCounter = document.getElementById('trustCounter');
    function showSlide(n) {
      n = ((n % slides.length) + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === n); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === n); });
      if (trustCounter) trustCounter.textContent = String(n + 1).padStart(2, '0');
      idx = n;
    }
    function next() { showSlide(idx + 1); }
    function startTimer() {
      if (!carouselInView) return;
      stopTimer();
      carouselTimer = setInterval(next, 6000);
    }
    function stopTimer() { if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; } }
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { showSlide(i); startTimer(); });
    });
    var carouselEl = document.getElementById('reviewCarousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopTimer);
      carouselEl.addEventListener('mouseleave', startTimer);
    }
    var trustSection = document.querySelector('.trust');
    if (trustSection && 'IntersectionObserver' in window) {
      var trustObs = new IntersectionObserver(function (entries) {
        carouselInView = entries[0].isIntersecting;
        if (carouselInView) startTimer(); else stopTimer();
      }, { threshold: 0 });
      trustObs.observe(trustSection);
    } else {
      carouselInView = true;
      startTimer();
    }
  }

  // ── REVEAL ON SCROLL ──
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in-view'); });
  }

  // ── CONTACT FORM (Formspree + Turnstile gate) ──
  var form = document.getElementById('contactForm');
  var dsgvo = document.getElementById('dsgvoCheck');
  var submitBtn = document.getElementById('submitBtn');
  var success = document.getElementById('formSuccess');
  var turnstileToken = null;

  // Expose Turnstile callbacks (Cloudflare loads api.js which calls these)
  window.onTurnstileSuccess = function (token) {
    turnstileToken = token;
    updateSubmitState();
  };
  window.onTurnstileExpired = function () {
    turnstileToken = null;
    updateSubmitState();
  };

  // Dev-Bypass: Turnstile-Sitekey ist auf addus-web.de registriert. Auf
  // localhost/file:// rejected Cloudflare die Verifizierung — wir umgehen
  // den Check in dev, damit das Formular trotzdem testbar bleibt.
  var isDevHost = ['localhost','127.0.0.1','0.0.0.0',''].indexOf(location.hostname) !== -1
    || location.protocol === 'file:';
  if (isDevHost) {
    turnstileToken = 'dev-bypass';
    var ts = document.querySelector('.cf-turnstile');
    if (ts) {
      ts.style.display = 'none';
      var devNote = document.createElement('p');
      devNote.className = 'postcard__hint';
      devNote.style.cssText = 'color:#b8421f;font-style:italic;text-transform:none;letter-spacing:.04em;margin:8px 0 0';
      devNote.textContent = '⚙ Dev-Modus: Turnstile-Verifizierung übersprungen (nur localhost)';
      ts.parentNode.insertBefore(devNote, ts);
    }
  }

  function updateSubmitState() {
    if (!submitBtn) return;
    var ok = dsgvo && dsgvo.checked && !!turnstileToken;
    submitBtn.disabled = !ok;
  }

  if (dsgvo) dsgvo.addEventListener('change', updateSubmitState);

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitBtn && submitBtn.disabled) return;
      var data = new FormData(form);
      if (turnstileToken) data.append('cf-turnstile-response', turnstileToken);

      var firstName = data.get('firstName') || '';
      var nameSpan = document.querySelector('.success-name');
      if (nameSpan && firstName) nameSpan.textContent = 'Hallo ' + firstName;

      submitBtn.disabled = true;
      // Postcard button has SVG inside .postcard__send-stamp — replacing
      // textContent would wipe the SVG. Instead toggle a sending state.
      submitBtn.classList.add('is-sending');
      submitBtn.setAttribute('aria-busy', 'true');

      fetch('https://formspree.io/f/mojpqqyy', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          // Trigger postcard send animation (stamp drop → lift-off → success)
          form.classList.add('is-sent');
          // After the lift-off finishes (drop .55s + dwell .85s + lift .85s ≈ 2.25s)
          setTimeout(function () {
            form.style.display = 'none';
            if (success) success.classList.add('is-shown');
          }, 2300);
        } else {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-sending');
          submitBtn.removeAttribute('aria-busy');
          alert('Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie direkt an info@addus-web.de.');
        }
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-sending');
        submitBtn.removeAttribute('aria-busy');
        alert('Verbindungsfehler. Bitte versuchen Sie es erneut.');
      });
    });
  }

  // ── HERO CYCLING WORD — replaced by Lektor-cycle below ──

  // ════════════════════════════════════════════════════════
  //  HERO — Cinematic interactions
  //  • Per-letter spans for magnetic hover
  //  • Lektor-cycle (strikethrough → handwritten replace)
  //  • Watermark parallax on scroll
  //  • Wandering atelier spotlight
  // ════════════════════════════════════════════════════════
  var prefersReduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // — Wrap headline letters into spans (skip the cycle word + underline svg) —
  var headline = document.getElementById('hero-headline');
  if (headline && !prefersReduce) {
    var words = headline.querySelectorAll('.word:not(.word--accent)');
    words.forEach(function (w) {
      var text = w.textContent;
      w.textContent = '';
      Array.prototype.forEach.call(text, function (ch) {
        if (ch === ' ') { w.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span');
        s.className = 'char';
        s.textContent = ch;
        w.appendChild(s);
      });
    });
  }

  // — Magnetic hover: letters tilt toward cursor (rects cached) —
  if (headline && !prefersReduce && window.matchMedia('(pointer:fine)').matches) {
    var allChars = Array.prototype.slice.call(headline.querySelectorAll('.char'));
    var charCache = [];  // cached centers — rebuilt on resize/scroll
    var cacheValid = false;
    var rafId = null;
    var lastEv = null;

    function rebuildCache() {
      charCache = allChars.map(function (c) {
        var r = c.getBoundingClientRect();
        return { el: c, cx: r.left + r.width/2, cy: r.top + r.height/2 };
      });
      cacheValid = true;
    }
    function invalidateCache() { cacheValid = false; }

    function applyMagnetic() {
      rafId = null;
      if (!lastEv) return;
      if (!cacheValid) rebuildCache();
      var mx = lastEv.clientX, my = lastEv.clientY;
      var radius = 140, radiusSq = radius * radius;
      for (var i = 0; i < charCache.length; i++) {
        var c = charCache[i];
        var dx = mx - c.cx, dy = my - c.cy;
        var distSq = dx*dx + dy*dy;
        if (distSq < radiusSq) {
          var dist = Math.sqrt(distSq);
          var pull = 1 - dist / radius;
          var tx = (dx / dist) * pull * 8;
          var ty = (dy / dist) * pull * 8;
          var rot = (dx / radius) * pull * 6;
          c.el.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) rotate(' + rot.toFixed(2) + 'deg)';
        } else if (c.el.style.transform) {
          c.el.style.transform = '';
        }
      }
    }
    headline.addEventListener('mousemove', function (e) {
      lastEv = e;
      if (!rafId) rafId = requestAnimationFrame(applyMagnetic);
    }, { passive: true });
    headline.addEventListener('mouseleave', function () {
      lastEv = null;
      allChars.forEach(function (c) { c.style.transform = ''; });
    });
    window.addEventListener('resize', invalidateCache, { passive: true });
    window.addEventListener('scroll', invalidateCache, { passive: true });
  }

  // — Lektor-cycle: strike old word, write new word —
  // Replaces the previous heroCycle if any.
  var cycleEl = document.getElementById('heroCycle');
  if (cycleEl && !prefersReduce) {
    var cycleWords = [
      'Kunden', 'Aufträge', 'Anfragen', 'Vertrauen',
      'Umsatz', 'Termine', 'Reichweite', 'Wachstum',
      'Bekanntheit'
    ];
    var cycleIdx = 0;
    cycleEl.textContent = cycleWords[0];
    function cycleNext() {
      cycleEl.classList.remove('is-in');
      cycleEl.classList.add('is-out');
      setTimeout(function () {
        cycleIdx = (cycleIdx + 1) % cycleWords.length;
        cycleEl.textContent = cycleWords[cycleIdx];
        cycleEl.classList.remove('is-out');
        void cycleEl.offsetWidth;
        cycleEl.classList.add('is-in');
      }, 350);
    }
    setTimeout(function () {
      setInterval(cycleNext, 1700);
    }, 2000);
  }

  // — Watermark "01" parallax (only while hero is in view) —
  var watermark = document.querySelector('.hero__watermark');
  var heroSec   = document.getElementById('hero');
  if (watermark && heroSec && !prefersReduce) {
    var pTick = null;
    var heroInView = true;
    function pUpdate() {
      pTick = null;
      if (!heroInView) return;
      var rect = heroSec.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var prog = -rect.top / Math.max(1, rect.height);
      watermark.style.setProperty('--pY', (prog * 80).toFixed(1) + 'px');
    }
    function onHeroScroll() {
      if (!heroInView) return;
      if (!pTick) pTick = requestAnimationFrame(pUpdate);
    }
    window.addEventListener('scroll', onHeroScroll, { passive:true });
    if ('IntersectionObserver' in window) {
      var heroObs = new IntersectionObserver(function (entries) {
        heroInView = entries[0].isIntersecting;
      }, { threshold: 0 });
      heroObs.observe(heroSec);
    }
    pUpdate();
  }

  // — Wandering atelier spotlight (only while atelier section is in view) —
  var spot = document.querySelector('.atelier__spot');
  if (spot && !prefersReduce) {
    var spotPos = 50;
    var spotTimer = null;
    var atelierSection = spot.closest('section') || spot.parentElement;
    function spotTick() {
      spotPos = 25 + Math.random() * 50;
      spot.style.setProperty('--sx', spotPos.toFixed(0) + '%');
    }
    function startSpot() {
      if (spotTimer) return;
      spotTimer = setInterval(spotTick, 3200);
    }
    function stopSpot() {
      if (spotTimer) { clearInterval(spotTimer); spotTimer = null; }
    }
    if ('IntersectionObserver' in window && atelierSection) {
      var spotObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) startSpot(); else stopSpot();
        });
      }, { threshold: 0 });
      spotObs.observe(atelierSection);
    } else {
      startSpot();
    }
  }

  // ════════════════════════════════════════════════════════
  //  FEDERKIEL — Reading-progress quill on left edge.
  //  Damped follow: target is set from scroll position, current
  //  is lerped toward it each rAF — smooth glide, no snapping.
  // ════════════════════════════════════════════════════════
  var quill = document.getElementById('readingQuill');
  if (quill) {
    var quillInk = document.getElementById('quillInk');
    var quillPen = document.getElementById('quillPen');
    var quillTrack = quill.querySelector('.quill__track');
    var inkTarget = 0, inkCurrent = 0;     // height in %
    var penTarget = 0, penCurrent = 0;     // pixel y of pen
    var running = false;

    var LERP = 0.18;                       // damping factor (higher = snappier)
    var EPSILON = 0.04;                    // converged threshold

    function computeTarget() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) { inkTarget = 0; penTarget = 0; return; }
      var prog = Math.min(1, Math.max(0, window.scrollY / max));
      var trackH = quillTrack ? quillTrack.getBoundingClientRect().height : 0;
      inkTarget = prog * 100;
      penTarget = prog * trackH - 4;
    }

    function quillLoop(now) {
      // Lerp current toward target
      inkCurrent += (inkTarget - inkCurrent) * LERP;
      penCurrent += (penTarget - penCurrent) * LERP;

      // Subtle 1.5° pen tilt based on progress (sine sway)
      var progNorm = inkCurrent / 100;
      var tilt = Math.sin(progNorm * Math.PI * 2) * 1.5;

      if (quillInk) quillInk.style.height = inkCurrent.toFixed(2) + '%';
      if (quillPen) quillPen.style.transform =
        'translateY(' + penCurrent.toFixed(1) + 'px) rotate(' + tilt.toFixed(2) + 'deg)';

      // Continue while not converged
      if (Math.abs(inkTarget - inkCurrent) > EPSILON ||
          Math.abs(penTarget - penCurrent) > EPSILON) {
        requestAnimationFrame(quillLoop);
      } else {
        running = false;
      }
    }

    function nudge() {
      computeTarget();
      if (!running) {
        running = true;
        requestAnimationFrame(quillLoop);
      }
    }

    window.addEventListener('scroll', nudge, { passive: true });
    window.addEventListener('resize', nudge, { passive: true });
    // Initial snap on load (no lerp delay on first paint)
    computeTarget();
    inkCurrent = inkTarget;
    penCurrent = penTarget;
    if (quillInk) quillInk.style.height = inkCurrent.toFixed(2) + '%';
    if (quillPen) quillPen.style.transform = 'translateY(' + penCurrent.toFixed(1) + 'px)';
  }

  // ════════════════════════════════════════════════════════
  //  MARGINALIA — handgeschriebene Notizen reveal on scroll
  // ════════════════════════════════════════════════════════
  var margs = document.querySelectorAll('[data-marg]');
  if (margs.length && 'IntersectionObserver' in window) {
    var mObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          // stagger
          var idx = Array.prototype.indexOf.call(margs, e.target);
          setTimeout(function () { e.target.classList.add('is-on'); }, idx * 220);
          mObs.unobserve(e.target);
        }
      });
    }, { rootMargin:'-10% 0px -10% 0px', threshold:.1 });
    margs.forEach(function (m) { mObs.observe(m); });
  }

  // ════════════════════════════════════════════════════════
  //  ATELIER 3D-TILT + Pre-Glow on exhibit hover
  // ════════════════════════════════════════════════════════
  var atelierWall = document.querySelector('.atelier__wall');
  // Pre-glow on exhibit hover
  if (atelierWall) {
    var exhibits = document.querySelectorAll('.exhibit');
    exhibits.forEach(function (ex) {
      ex.addEventListener('mouseenter', function () { atelierWall.classList.add('is-pre-glow'); });
      ex.addEventListener('mouseleave', function () { atelierWall.classList.remove('is-pre-glow'); });
    });
  }

  // ════════════════════════════════════════════════════════
  //  CERT — fade cards in when section enters viewport
  // ════════════════════════════════════════════════════════
  var certBlock = document.querySelector('.hero__verified');
  if (certBlock && 'IntersectionObserver' in window) {
    var certObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          certBlock.classList.add('is-stamped');
          certObs.disconnect();
        }
      });
    }, { threshold: 0.18 });
    certObs.observe(certBlock);
  } else if (certBlock) {
    certBlock.classList.add('is-stamped');
  }

  // ════════════════════════════════════════════════════════
  //  EDITOR'S RED PEN — hand-drawn circle injected into .mark elements
  // ════════════════════════════════════════════════════════
  // Several slightly-different irregular ellipse paths so consecutive marks
  // don't look identical (gives the hand-drawn feel).
  var PEN_PATHS = [
    'M 14 30 C 8 12, 50 4, 110 6 C 170 8, 192 16, 195 32 C 192 50, 125 56, 68 53 C 16 50, 12 42, 14 30 Z',
    'M 12 32 C 10 14, 45 6, 105 5 C 168 6, 194 18, 196 33 C 193 49, 135 56, 72 54 C 18 52, 8 44, 12 32 Z',
    'M 16 29 C 12 11, 42 5, 102 7 C 172 9, 190 17, 194 31 C 191 51, 128 57, 70 53 C 20 49, 14 41, 16 29 Z'
  ];
  Array.prototype.forEach.call(document.querySelectorAll('.mark'), function (el, i) {
    if (el.querySelector('.mark__circle')) return; // skip if already injected
    var d = PEN_PATHS[i % PEN_PATHS.length];
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'mark__circle');
    svg.setAttribute('viewBox', '0 0 208 60');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2.2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    el.appendChild(svg);
  });

  // Marginalia (Quill, TOC, Pageno) bleiben permanent in der Ink-Heimfarbe.
  // Kein automatisches Dark-Mode-Switching mehr — zu fragil bei den
  // schwankenden Sektionsgrenzen, vereinfacht zur statischen Lösung.

  // ════════════════════════════════════════════════════════
  //  TOC MARGINALIA — floating chapter nav, active-state via observer
  // ════════════════════════════════════════════════════════
  var toc = document.getElementById('toc');
  if (toc) {
    var tocItems = Array.from(toc.querySelectorAll('.toc__item'));
    var sectionMap = {};
    tocItems.forEach(function (item) {
      var id = item.dataset.section;
      var sec = document.getElementById(id);
      if (sec) sectionMap[id] = { sec: sec, item: item };
    });

    // Show TOC (and page-number indicator) only after passing the hero
    var heroEl = document.getElementById('hero');
    var ftrEl  = document.querySelector('.ftr');
    var pageNoEl = document.getElementById('pageNo');
    function updateTocVisibility() {
      var y = window.scrollY || 0;
      var heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : 0;
      var ftrTop = ftrEl ? ftrEl.offsetTop - 200 : Infinity;
      var on = y > heroBottom - 200 && y < ftrTop;
      toc.classList.toggle('is-on', on);
      if (pageNoEl) pageNoEl.classList.toggle('is-on', on);
    }
    var tocScrollTick = null;
    window.addEventListener('scroll', function () {
      if (tocScrollTick) return;
      tocScrollTick = requestAnimationFrame(function () {
        tocScrollTick = null;
        updateTocVisibility();
      });
    }, { passive: true });
    updateTocVisibility();

    // Active-section tracking: pick the section whose top is just above the
    // viewport's "reading line" (40% from top).
    if ('IntersectionObserver' in window) {
      var activeIds = new Set();
      var tocObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) activeIds.add(e.target.id);
          else activeIds.delete(e.target.id);
        });
        // Pick the topmost intersecting section as current
        var current = null, currentTop = Infinity;
        activeIds.forEach(function (id) {
          var s = sectionMap[id];
          if (!s) return;
          var top = s.sec.getBoundingClientRect().top;
          if (top < currentTop) { currentTop = top; current = id; }
        });
        var currentIdx = -1;
        tocItems.forEach(function (it, i) {
          var isCur = it.dataset.section === current;
          it.classList.toggle('is-current', isCur);
          if (isCur) currentIdx = i;
        });
        // Sync the live page-number indicator
        var pageNoNum = document.getElementById('pageNoNum');
        if (pageNoNum && currentIdx >= 0) {
          pageNoNum.textContent = String(currentIdx + 1).padStart(2, '0');
        }
      }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
      Object.values(sectionMap).forEach(function (s) { tocObs.observe(s.sec); });
    }

    // Smooth scroll on click (overrides default jump)
    toc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var sec = document.getElementById(id);
        if (!sec) return;
        e.preventDefault();
        var nav = document.querySelector('.nav');
        var navH = nav ? nav.offsetHeight : 0;
        var top = sec.getBoundingClientRect().top + window.scrollY - navH - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
        history.replaceState(null, '', '#' + id);
      });
    });
  }

  // ════════════════════════════════════════════════════════
  //  PAGE-CURL — toggle open on click (sticky)
  // ════════════════════════════════════════════════════════
  var curl = document.getElementById('pageCurl');
  if (curl) {
    curl.addEventListener('click', function (e) {
      e.stopPropagation();
      curl.classList.toggle('is-open');
    });
    document.addEventListener('click', function (e) {
      if (!curl.contains(e.target)) curl.classList.remove('is-open');
    });
  }
})();
