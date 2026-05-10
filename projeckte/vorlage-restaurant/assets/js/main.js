/* ============================================
   LA TAVOLA DEMO — Main JS + Theme Switcher
   ============================================ */

(function () {
    'use strict';

    var currentTheme = 'restaurant';
    var autoSlide = null;
    var testCurrent = 0;

    /* ─── THEME SWITCHER ─── */
    function applyTheme(name) {
        var t = THEMES[name];
        if (!t) return;
        currentTheme = name;
        var r = document.documentElement.style;

        // Colors
        r.setProperty('--primary', t.colors.primary);
        r.setProperty('--primary-dark', t.colors.primaryDark);
        r.setProperty('--accent', t.colors.accent);
        r.setProperty('--cream', t.colors.cream);
        r.setProperty('--warm-white', t.colors.warmWhite);
        r.setProperty('--sand', t.colors.sand);
        r.setProperty('--dark', t.colors.dark);
        r.setProperty('--charcoal', t.colors.charcoal);

        // Fonts
        r.setProperty('--font-display', t.fonts.display);

        // Logo
        setText('logoIcon', t.logo.icon);
        setText('logoText', t.logo.text);
        setText('footerLogoIcon', t.logo.icon);
        setText('footerLogoText', t.logo.text);
        setText('footerName', t.logo.text);

        // Hero
        setImg('heroImg', t.hero.img);
        setText('heroSub', t.hero.sub);
        setText('heroTitle', t.hero.title);
        setHTML('heroDesc', t.hero.desc);
        setText('heroCta1', t.hero.cta1);
        setText('heroCta2', t.hero.cta2);
        setText('heroAddress', t.hero.address);
        setText('heroHours', t.hero.hours);

        // About
        setImg('aboutImg1', t.about.img1);
        setImg('aboutImg2', t.about.img2);
        setText('badgeNum', t.about.badgeNum);
        setText('badgeText', t.about.badgeText);
        setText('aboutLabel', t.about.label);
        setHTML('aboutTitle', t.about.title);
        setText('aboutP1', t.about.p1);
        setText('aboutP2', t.about.p2);
        setText('stat1Num', t.about.stat1.num);
        setText('stat1Label', t.about.stat1.label);
        setText('stat2Num', t.about.stat2.num);
        setText('stat2Label', t.about.stat2.label);
        setText('stat3Num', t.about.stat3.num);
        setText('stat3Label', t.about.stat3.label);

        // Features
        buildFeatures(t.features);

        // Menu
        setText('menuLabel', t.menu.label);
        setText('menuTitle', t.menu.title);
        setText('menuCtaBtn', t.menu.ctaText);
        buildMenu(t.menu);

        // Parallax
        setImg('parallaxImg', t.parallax.img);
        setHTML('quoteText', t.parallax.quote);
        setText('quoteCite', t.parallax.cite);

        // Gallery
        setHTML('galleryTitle', 'Momente bei ' + t.logo.text);
        buildGallery(t.gallery);

        // Testimonials
        buildTestimonials(t.testimonials);

        // Contact
        setHTML('contactHours', t.contact.hours);
        setText('formTitle', t.contact.formTitle);
        setText('formSubmitBtn', t.contact.submitText);

        // Nav CTA
        setText('navCta', t.navCta);
        setText('navCtaMobile', t.navCta);

        // Footer
        setHTML('footerTagline', t.footer.tagline);
        setHTML('footerHours', t.footer.hours);

        // Re-run scroll reveal
        initScrollReveal();

        // Update title
        document.title = t.logo.text + ' | Webdesign von addus';
    }

    function setText(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function setHTML(id, val) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = val;
    }

    function setImg(id, src) {
        var el = document.getElementById(id);
        if (el) el.src = src;
    }

    /* ─── BUILD FEATURES ─── */
    function buildFeatures(items) {
        var grid = document.getElementById('featuresGrid');
        grid.innerHTML = '';
        items.forEach(function (f) {
            var div = document.createElement('div');
            div.className = 'feature';
            div.setAttribute('data-anim', '');
            div.innerHTML =
                '<div class="feature__icon">' + f.icon + '</div>' +
                '<h3>' + f.title + '</h3>' +
                '<p>' + f.desc + '</p>';
            grid.appendChild(div);
        });
    }

    /* ─── BUILD MENU ─── */
    function buildMenu(menu) {
        var tabsEl = document.getElementById('menuTabs');
        var panelsEl = document.getElementById('menuPanels');
        tabsEl.innerHTML = '';
        panelsEl.innerHTML = '';

        menu.tabs.forEach(function (tab, i) {
            var btn = document.createElement('button');
            btn.className = 'menu__tab' + (i === 0 ? ' active' : '');
            btn.setAttribute('data-tab', tab.id);
            btn.textContent = tab.label;
            tabsEl.appendChild(btn);

            var panel = document.createElement('div');
            panel.className = 'menu__panel' + (i === 0 ? ' active' : '');
            panel.setAttribute('data-panel', tab.id);

            var items = menu.panels[tab.id] || [];
            var gridDiv = document.createElement('div');
            gridDiv.className = 'menu__grid';

            items.forEach(function (item) {
                var card = document.createElement('div');
                card.className = 'menu-card' + (item.img ? '' : ' menu-card--text');
                var html = '';
                if (item.img) {
                    html += '<div class="menu-card__img"><img src="' + item.img + '" alt="' + item.name + '" loading="lazy"></div>';
                }
                html += '<div class="menu-card__body">';
                html += '<div class="menu-card__head"><h3>' + item.name + '</h3><span class="menu-card__price">' + item.price + '</span></div>';
                html += '<p>' + item.desc + '</p>';
                if (item.tag) {
                    html += '<span class="menu-card__tag">' + item.tag + '</span>';
                }
                html += '</div>';
                card.innerHTML = html;
                gridDiv.appendChild(card);
            });

            panel.appendChild(gridDiv);
            panelsEl.appendChild(panel);
        });

        // Re-bind tab clicks
        initMenuTabs();
    }

    /* ─── BUILD GALLERY ─── */
    function buildGallery(items) {
        var grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';
        items.forEach(function (item) {
            var div = document.createElement('div');
            div.className = 'gallery__item' + (item.wide ? ' gallery__item--wide' : '');
            div.setAttribute('data-anim', '');
            div.innerHTML =
                '<img src="' + item.img + '" alt="' + item.caption + '" loading="lazy">' +
                '<div class="gallery__caption">' + item.caption + '</div>';
            grid.appendChild(div);
        });
    }

    /* ─── BUILD TESTIMONIALS ─── */
    function buildTestimonials(items) {
        var track = document.getElementById('testimonialTrack');
        var dotsEl = document.getElementById('testimonialDots');
        track.innerHTML = '';
        dotsEl.innerHTML = '';

        items.forEach(function (t, i) {
            var div = document.createElement('div');
            div.className = 'testimonial';
            div.innerHTML =
                '<div class="testimonial__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
                '<p class="testimonial__text">' + t.text + '</p>' +
                '<div class="testimonial__author">' +
                '<div class="testimonial__avatar">' + t.initials + '</div>' +
                '<div><strong>' + t.name + '</strong><span>' + t.source + '</span></div>' +
                '</div>';
            track.appendChild(div);

            var dot = document.createElement('button');
            dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', 'Bewertung ' + (i + 1));
            dotsEl.appendChild(dot);
        });

        testCurrent = 0;
        track.style.transform = 'translateX(0)';
        initTestimonialSlider();
    }

    /* ─── TESTIMONIAL SLIDER ─── */
    function initTestimonialSlider() {
        var track = document.getElementById('testimonialTrack');
        var dotsEl = document.getElementById('testimonialDots');
        var dots = dotsEl.querySelectorAll('.testimonials__dot');
        var total = track.children.length;

        function goTo(i) {
            if (i < 0) i = total - 1;
            if (i >= total) i = 0;
            testCurrent = i;
            track.style.transform = 'translateX(-' + (i * 100) + '%)';
            dots.forEach(function (d, idx) {
                d.classList.toggle('active', idx === i);
            });
        }

        document.getElementById('testPrev').onclick = function () { goTo(testCurrent - 1); };
        document.getElementById('testNext').onclick = function () { goTo(testCurrent + 1); };

        dotsEl.onclick = function (e) {
            if (e.target.classList.contains('testimonials__dot')) {
                goTo(parseInt(e.target.getAttribute('data-index')));
            }
        };

        if (autoSlide) clearInterval(autoSlide);
        autoSlide = setInterval(function () { goTo(testCurrent + 1); }, 6000);

        var slider = document.getElementById('testimonialSlider');
        slider.onmouseenter = function () { clearInterval(autoSlide); };
        slider.onmouseleave = function () {
            autoSlide = setInterval(function () { goTo(testCurrent + 1); }, 6000);
        };

        // Touch
        var sx = 0;
        track.ontouchstart = function (e) { sx = e.changedTouches[0].screenX; };
        track.ontouchend = function (e) {
            var diff = sx - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? testCurrent + 1 : testCurrent - 1);
        };
    }

    /* ─── MENU TABS ─── */
    function initMenuTabs() {
        var tabsEl = document.getElementById('menuTabs');
        tabsEl.onclick = function (e) {
            var btn = e.target.closest('.menu__tab');
            if (!btn) return;
            var target = btn.getAttribute('data-tab');
            tabsEl.querySelectorAll('.menu__tab').forEach(function (t) { t.classList.remove('active'); });
            document.querySelectorAll('.menu__panel').forEach(function (p) { p.classList.remove('active'); });
            btn.classList.add('active');
            var panel = document.querySelector('[data-panel="' + target + '"]');
            if (panel) panel.classList.add('active');
        };
    }

    /* ─── SCROLL REVEAL ─── */
    function initScrollReveal() {
        var els = document.querySelectorAll('[data-anim], .feature, .gallery__item');
        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        var siblings = Array.from(el.parentElement.children);
                        var i = siblings.indexOf(el);
                        setTimeout(function () { el.classList.add('visible'); }, i * 120);
                        obs.unobserve(el);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
            els.forEach(function (el) {
                el.classList.remove('visible');
                obs.observe(el);
            });
        } else {
            els.forEach(function (el) { el.classList.add('visible'); });
        }
    }

    /* ─── NAV SCROLL ─── */
    var nav = document.getElementById('nav');

    function handleNavScroll() {
        nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    /* ─── ACTIVE NAV LINK ─── */
    function updateActiveLink() {
        var scrollY = window.scrollY + 120;
        document.querySelectorAll('section[id]').forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            document.querySelectorAll('.nav__links a').forEach(function (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                }
            });
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ─── MOBILE MENU ─── */
    var burger = document.getElementById('burger');
    var mobileMenu = document.getElementById('mobileMenu');

    burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            burger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ─── SMOOTH SCROLL ─── */
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            var offset = nav.offsetHeight + document.getElementById('demoBar').offsetHeight;
            var top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    });

    /* ─── RESERVATION FORM ─── */
    document.getElementById('reservationForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = this.querySelector('button[type="submit"]');
        var orig = btn.textContent;
        btn.textContent = 'Wird gesendet...';
        btn.disabled = true;
        setTimeout(function () {
            btn.textContent = 'Erfolgreich gesendet!';
            btn.style.background = '#2d7d46';
            setTimeout(function () {
                btn.textContent = orig;
                btn.style.background = '';
                btn.disabled = false;
                document.getElementById('reservationForm').reset();
            }, 3000);
        }, 1200);
    });

    /* ─── DATE MIN ─── */
    var dateInput = document.getElementById('date');
    if (dateInput) {
        var today = new Date();
        dateInput.setAttribute('min', today.toISOString().split('T')[0]);
    }

    /* ─── DEMO BAR — THEME SWITCHING ─── */
    var demoBtns = document.querySelectorAll('.demo-bar__btn');
    demoBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var theme = this.getAttribute('data-theme');
            if (theme === currentTheme) return;

            demoBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            // Fade transition
            document.body.classList.add('theme-transitioning');
            setTimeout(function () {
                applyTheme(theme);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(function () {
                    document.body.classList.remove('theme-transitioning');
                }, 100);
            }, 300);
        });
    });

    /* ─── INIT ─── */
    applyTheme('restaurant');

})();
