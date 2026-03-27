/**
 * main.js — All Section Interactions
 * addus. Web Agency
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ─── Scroll reveal ──────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ─── KPI CountUp animation ──────────────────────── */
  const countUp = (el) => {
    const raw = el.dataset.target || '0';
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isDecimal = raw.includes('.');
    const end = parseFloat(raw);
    const duration = 2200;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = end * eased;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          countUp(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('[data-counter]').forEach((el) => counterObserver.observe(el));

  /* ─── Price counter for offer section ────────────── */
  const offerPriceEl = document.querySelector('[data-price-target]');
  if (offerPriceEl) {
    const offerTarget = parseInt(offerPriceEl.dataset.priceTarget, 10);
    const offerPriceObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !offerPriceEl.dataset.animated) {
          offerPriceEl.dataset.animated = 'true';
          const dur = 1800;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -12 * p);
            offerPriceEl.textContent = Math.floor(offerTarget * eased) + ' €';
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    offerPriceObs.observe(offerPriceEl);
  }

  /* ─── Pain/Dream flashlight + hint ──────────────── */
  var pdRows = document.querySelector('.pain-dream__rows');
  var pdHint = document.querySelector('.pain-dream__hint');
  if (pdRows) {
    var pdTicking = false;
    var updateFlash = function (cx, cy) {
      if (pdTicking) return;
      pdTicking = true;
      requestAnimationFrame(function () {
        var r = pdRows.getBoundingClientRect();
        pdRows.style.setProperty('--flash-x', (cx - r.left) + 'px');
        pdRows.style.setProperty('--flash-y', (cy - r.top) + 'px');
        pdTicking = false;
      });
    };
    pdRows.addEventListener('mousemove', function (e) {
      updateFlash(e.clientX, e.clientY);
    });
    pdRows.addEventListener('touchmove', function (e) {
      var t = e.touches[0];
      updateFlash(t.clientX, t.clientY);
    }, { passive: true });
    if (pdHint) {
      pdRows.addEventListener('mouseenter', function () {
        pdHint.classList.add('is-hidden');
      });
      pdRows.addEventListener('mouseleave', function () {
        pdHint.classList.remove('is-hidden');
      });
      pdRows.addEventListener('touchstart', function () {
        pdHint.classList.add('is-hidden');
      }, { passive: true });
      pdRows.addEventListener('touchend', function () {
        pdHint.classList.remove('is-hidden');
      }, { passive: true });
    }
  }

  /* ─── FAQ Accordion ──────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('is-open');

      // Close all
      document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ─── Leistungen Accordion ──────────────────────── */
  document.querySelectorAll('.lst__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.lst__item');
      var wasOpen = item.classList.contains('is-open');

      // Close all
      document.querySelectorAll('.lst__item.is-open').forEach(function (open) {
        open.classList.remove('is-open');
        open.querySelector('.lst__trigger').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─── Testimonial Carousel ───────────────────────── */
  const carousel = document.querySelector('.carousel-slides');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoplayTimer = null;

  const goToSlide = (index) => {
    currentSlide = index;
    if (carousel) carousel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  };

  const nextSlide = () => {
    const total = dots.length;
    goToSlide((currentSlide + 1) % total);
  };

  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    autoplayTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoplay = () => clearInterval(autoplayTimer);

  if (dots.length) {
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        stopAutoplay();
        goToSlide(i);
        startAutoplay();
      });
    });

    goToSlide(0);
    startAutoplay();

    // Pause on hover
    document.querySelector('.testimonial-carousel')?.addEventListener('mouseenter', stopAutoplay);
    document.querySelector('.testimonial-carousel')?.addEventListener('mouseleave', startAutoplay);
  }

  /* ─── Portfolio filter ───────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card[data-category]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      portfolioCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = show ? '1' : '0.2';
        card.style.transform = show ? '' : 'scale(0.96)';
        card.style.pointerEvents = show ? '' : 'none';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      });
    });
  });

  /* ─── Industry pills ─────────────────────────────── */
  document.querySelectorAll('.industry-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.industry-pill').forEach((p) =>
        p.classList.remove('is-active')
      );
      pill.classList.add('is-active');
    });
  });

  /* ─── Contact form ───────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const firstNameInput = document.getElementById('firstName');
  let contactTurnstileVerified = false;

  // Turnstile callbacks
  window.onTurnstileSuccess = function () {
    contactTurnstileVerified = true;
    if (contactForm) checkFormValidity();
  };
  window.onTurnstileExpired = function () {
    contactTurnstileVerified = false;
    if (submitBtn) submitBtn.disabled = true;
  };

  let checkFormValidity;

  if (contactForm) {
    const requiredInputs = contactForm.querySelectorAll('[required]');
    const dsgvoCheck = document.getElementById('dsgvoCheck');

    checkFormValidity = () => {
      const allFilled = [...requiredInputs].every((input) => input.value.trim().length > 0);
      const dsgvoChecked = dsgvoCheck ? dsgvoCheck.checked : true;
      submitBtn.disabled = !(allFilled && dsgvoChecked && contactTurnstileVerified);
    };

    requiredInputs.forEach((input) => input.addEventListener('input', checkFormValidity));
    if (dsgvoCheck) dsgvoCheck.addEventListener('change', checkFormValidity);

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = firstNameInput?.value || 'Guten Tag';

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        Wird gesendet…`;

      try {
        const formData = new FormData(contactForm);
        const res = await fetch('https://formspree.io/f/xdkodwkw', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error('Senden fehlgeschlagen');

        contactForm.style.opacity = '0';
        contactForm.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          contactForm.style.display = 'none';
          if (formSuccess) {
            formSuccess.classList.add('is-visible');
            const nameSpan = formSuccess.querySelector('.success-name');
            if (nameSpan) nameSpan.textContent = name;
          }
        }, 400);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Fehler — nochmal versuchen →';
        submitBtn.style.background = '#c0392b';
        setTimeout(() => {
          submitBtn.style.background = '';
          submitBtn.textContent = 'Nachricht senden →';
        }, 3000);
      }
    });
  }

  /* ─── Newsletter form (inline + footer) ─────────── */
  document.querySelectorAll('.newsletter-form, .nl-mini-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input || !input.validity.valid) return;
      btn.textContent = 'Abonniert';
      btn.style.background = 'linear-gradient(135deg, #1DB954, #0E7C31)';
      input.value = '';
      input.disabled = true;
      setTimeout(() => {
        btn.textContent = btn.dataset.origText || 'Abonnieren →';
        btn.style.background = '';
        input.disabled = false;
      }, 4000);
    });
  });

  /* ─── Sticky "Termin buchen" floating button ─────── */
  const stickyCtaEl = document.getElementById('stickyCtaBtn');
  if (stickyCtaEl) {
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      new IntersectionObserver(
        ([entry]) => stickyCtaEl.classList.toggle('is-visible', !entry.isIntersecting),
        { threshold: 0 }
      ).observe(heroEl);
    }
  }

  /* Industry website cycler is handled by hero.js */

  /* ─── Website Cost Calculator ──────────────────────── */
  var calcModal = document.getElementById('calcModal');
  var openBtn   = document.getElementById('openCalcBtn');
  var closeBtn  = document.getElementById('calcCloseBtn');
  var closeBg   = document.getElementById('calcClose');
  var bar       = document.getElementById('calcBar');
  var priceEl   = document.getElementById('calcPrice');
  var restartBtn= document.getElementById('calcRestart');
  var multiNext = document.getElementById('calcMultiNext');

  if (calcModal && openBtn) {
    var TOTAL_STEPS = 9;
    var currentStep = 1;
    var totalPrice = 0;
    var answers = {};

    function openCalc() {
      calcModal.classList.add('is-open');
      calcModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('calc-active');
      document.body.style.overflow = 'hidden';
    }

    function closeCalc() {
      calcModal.classList.remove('is-open');
      calcModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('calc-active');
      document.body.style.overflow = '';
    }

    function showResult() {
      var steps = calcModal.querySelectorAll('.calc-step');
      steps.forEach(function(s) { s.classList.remove('is-active'); });
      var resultStep = calcModal.querySelector('[data-step="result"]');
      resultStep.classList.add('is-active');
      bar.style.width = '100%';

      // Clamp price: minimum 300, maximum 1200
      var finalPrice = Math.max(300, Math.min(totalPrice, 1200));
      // Round to nearest 50
      finalPrice = Math.round(finalPrice / 50) * 50;

      // Count-up animation
      var display = 0;
      var increment = Math.ceil(finalPrice / 40);
      var counter = setInterval(function() {
        display += increment;
        if (display >= finalPrice) {
          display = finalPrice;
          clearInterval(counter);
        }
        priceEl.textContent = display.toLocaleString('de-DE');
      }, 20);
    }

    function goToStep(n) {
      currentStep = n;
      var steps = calcModal.querySelectorAll('.calc-step');
      steps.forEach(function(s) { s.classList.remove('is-active'); });

      var stepEl = calcModal.querySelector('[data-step="' + n + '"]');
      if (stepEl) stepEl.classList.add('is-active');
      bar.style.width = Math.min((n / TOTAL_STEPS * 100), 95) + '%';
    }

    function selectOption(btn, isMulti) {
      var price = parseInt(btn.dataset.price) || 0;

      if (isMulti) {
        btn.classList.toggle('is-selected');
      } else {
        var siblings = btn.parentElement.querySelectorAll('.calc-opt');
        siblings.forEach(function(s) { s.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        totalPrice += price;
        answers['step' + currentStep] = btn.dataset.val;

        setTimeout(function() {
          var nextStep = currentStep + 1;

          // If landingpage selected in step 1, set base price and skip unterseiten (step 4)
          if (currentStep === 1 && btn.dataset.val === 'landingpage') {
            totalPrice += 300; // Landingpage Fixpreis
          }
          if (currentStep === 3 && answers['step1'] === 'landingpage') {
            nextStep = 5; // Skip step 4 (Unterseiten)
          }

          goToStep(nextStep);
        }, 250);
      }
    }

    // Open (hero button + pain/dream button)
    openBtn.addEventListener('click', openCalc);
    var openBtn2 = document.getElementById('openCalcBtn2');
    if (openBtn2) openBtn2.addEventListener('click', openCalc);

    // Close
    closeBtn.addEventListener('click', closeCalc);
    closeBg.addEventListener('click', closeCalc);

    // Option clicks
    calcModal.addEventListener('click', function(e) {
      var opt = e.target.closest('.calc-opt');
      if (!opt) return;
      // Don't handle in step 9 (contact form) or result
      var step = opt.closest('.calc-step');
      if (!step || step.dataset.step === '9' || step.dataset.step === 'result') return;
      var isMulti = opt.parentElement.classList.contains('calc-options--multi');
      selectOption(opt, isMulti);
    });

    // Intro next button (step 2)
    var introNext = document.getElementById('calcIntroNext');
    if (introNext) {
      introNext.addEventListener('click', function() {
        goToStep(3);
      });
    }

    // Multi-select next (step 8)
    if (multiNext) {
      multiNext.addEventListener('click', function() {
        var selected = calcModal.querySelectorAll('[data-step="8"] .calc-opt.is-selected');
        selected.forEach(function(s) {
          totalPrice += parseInt(s.dataset.price) || 0;
        });
        goToStep(currentStep + 1);
      });
    }

    // Submit contact form (step 9) → show result
    var calcSubmit = document.getElementById('calcSubmit');
    var calcConsent = document.getElementById('calcConsent');
    var calcTurnstileVerified = false;

    // Turnstile callbacks for calculator
    window.onCalcTurnstileSuccess = function () {
      calcTurnstileVerified = true;
      if (calcConsent && calcConsent.checked && calcSubmit) calcSubmit.disabled = false;
    };
    window.onCalcTurnstileExpired = function () {
      calcTurnstileVerified = false;
      if (calcSubmit) calcSubmit.disabled = true;
    };

    // Consent checkbox enables/disables submit (+ Turnstile check)
    if (calcConsent && calcSubmit) {
      calcConsent.addEventListener('change', function() {
        calcSubmit.disabled = !(this.checked && calcTurnstileVerified);
      });
    }

    var formSubmitted = false;
    if (calcSubmit) {
      calcSubmit.addEventListener('click', function() {
        // Rate limit: prevent double submission
        if (formSubmitted) return;

        var calcNameEl = document.getElementById('calcName');
        var calcEmailEl = document.getElementById('calcEmail');
        var calcHoneyEl = document.getElementById('calcHoney');
        if (!calcNameEl || !calcEmailEl) return;
        var nameVal = calcNameEl.value.trim();
        var emailVal = calcEmailEl.value.trim();
        var honeyVal = calcHoneyEl ? calcHoneyEl.value : '';

        // Honeypot check
        if (honeyVal) return;

        // Consent + Turnstile check
        if (!calcConsent.checked || !calcTurnstileVerified) return;

        // Name validation
        if (!nameVal || nameVal.length < 2) {
          calcNameEl.style.borderColor = '#ff4757';
          calcNameEl.focus();
          return;
        }

        // Basic email format check
        if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
          calcEmailEl.style.borderColor = '#ff4757';
          calcEmailEl.focus();
          return;
        }

        // Build phone with country code
        var calcCountryEl = document.getElementById('calcCountry');
        var calcPhoneEl = document.getElementById('calcPhone');
        var countryCode = calcCountryEl ? calcCountryEl.value : '+49';
        var phoneRaw = calcPhoneEl ? calcPhoneEl.value.trim() : '';
        var fullPhone = phoneRaw ? countryCode + ' ' + phoneRaw : '';

        // Store contact info
        answers.name = nameVal;
        answers.email = emailVal;
        var calcFirmaEl = document.getElementById('calcFirma');
        answers.firma = calcFirmaEl ? calcFirmaEl.value.trim() : '';
        answers.phone = fullPhone;

        // Calculate final price
        var finalPrice = Math.max(300, Math.min(totalPrice, 1200));
        finalPrice = Math.round(finalPrice / 50) * 50;

        // Collect extras
        var extras = [];
        calcModal.querySelectorAll('[data-step="8"] .calc-opt.is-selected').forEach(function(s) {
          extras.push(s.textContent.trim());
        });

        // Send to Formspree in background
        var formData = new FormData();
        formData.append('Name', nameVal);
        formData.append('Firma', answers.firma || '—');
        formData.append('E-Mail', emailVal);
        formData.append('Telefon', answers.phone || 'Nicht angegeben');
        formData.append('Typ', answers.step1 === 'landingpage' ? 'Landingpage' : 'Webseite');
        formData.append('Bestehende Website', answers.step3 || '—');
        formData.append('Unterseiten', answers.step4 || 'Landingpage (keine Unterseiten)');
        formData.append('Bildmaterial', answers.step5 || '—');
        formData.append('Texte', answers.step6 || '—');
        formData.append('Design', answers.step7 || '—');
        formData.append('Extras', extras.length ? extras.join(', ') : 'Keine');
        formData.append('Geschätzter Preis', finalPrice + ',00 €');

        formSubmitted = true;
        calcSubmit.disabled = true;

        fetch('https://formspree.io/f/mojpqqyy', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        }).catch(function() {});

        showResult();
      });
    }

    // Reset border on input focus
    calcModal.querySelectorAll('.calc-input').forEach(function(inp) {
      inp.addEventListener('focus', function() {
        this.style.borderColor = '';
      });
    });

    // Restart
    if (restartBtn) {
      restartBtn.addEventListener('click', function() {
        totalPrice = 0;
        answers = {};
        calcModal.querySelectorAll('.calc-opt').forEach(function(o) {
          o.classList.remove('is-selected');
        });
        calcModal.querySelectorAll('.calc-input').forEach(function(inp) {
          inp.value = '';
          inp.style.borderColor = '';
        });
        // Also reset Firma field
        var firmaEl = document.getElementById('calcFirma');
        if (firmaEl) { firmaEl.value = ''; firmaEl.style.borderColor = ''; }
        goToStep(1);
      });
    }

    // CTA closes modal
    var calcCta = document.getElementById('calcCta');
    if (calcCta) {
      calcCta.addEventListener('click', function() { closeCalc(); });
    }

    // ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && calcModal.classList.contains('is-open')) closeCalc();
    });
  }

})();
