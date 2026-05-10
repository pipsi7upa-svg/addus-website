/* ============================================
   EL PASO LÜNEBURG - Premium JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    function updateHeader() {
        const scrollY = window.scrollY;
        header.classList.toggle('scrolled', scrollY > 60);
        lastScroll = scrollY;
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // --- Mobile Navigation ---
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // --- Menu Tabs ---
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            document.getElementById('tab-' + target).classList.add('active');
        });
    });

    // --- Scroll to Top ---
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll(
        '.section__header, .about__image, .about__content, .menu-item, .gallery__item, .event-card, .review-card, .contact__block, .reservation-form, .highlight, .contact__map'
    );

    revealElements.forEach(el => {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
            el.classList.add('reveal');
        }
    });

    // Add directional reveals
    const aboutImage = document.querySelector('.about__image');
    const aboutContent = document.querySelector('.about__content');
    if (aboutImage) { aboutImage.classList.remove('reveal'); aboutImage.classList.add('reveal-left'); }
    if (aboutContent) { aboutContent.classList.remove('reveal'); aboutContent.classList.add('reveal-right'); }

    // Stagger children
    document.querySelectorAll('.events__grid, .reviews__grid, .gallery__grid, .highlights__grid').forEach(grid => {
        grid.classList.add('stagger-children');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

    // --- Reservation Form ---
    const form = document.getElementById('reservationForm');
    if (form) {
        const dateInput = document.getElementById('res-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            if (!data.name || !data.email || !data.guests || !data.date || !data.time) {
                alert('Bitte füllen Sie alle Pflichtfelder aus.');
                return;
            }

            const message = encodeURIComponent(
                `Reservierungsanfrage:\n` +
                `Name: ${data.name}\n` +
                `E-Mail: ${data.email}\n` +
                `Telefon: ${data.phone || '-'}\n` +
                `Personen: ${data.guests}\n` +
                `Datum: ${data.date}\n` +
                `Uhrzeit: ${data.time}\n` +
                `Anmerkungen: ${data.message || '-'}`
            );

            form.innerHTML = `
                <div style="text-align: center; padding: 48px 0;">
                    <div style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #C9A84C, #A07B2A); color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 32px;">&#10003;</div>
                    <h3 style="font-family: var(--font-display); font-size: 28px; margin-bottom: 12px; color: var(--black);">Vielen Dank!</h3>
                    <p style="color: var(--text-light); margin-bottom: 32px; line-height: 1.7;">Ihre Reservierungsanfrage wurde gesendet.<br>Wir bestätigen diese schnellstmöglich.</p>
                    <a href="https://wa.me/4915758406841?text=${message}" class="btn btn--primary btn--lg" target="_blank" rel="noopener" style="display: inline-flex;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                        Auch per WhatsApp senden
                    </a>
                </div>
            `;
        });
    }

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Counter animation for highlights ---
    const counters = document.querySelectorAll('.highlight__text strong');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseInt(text);
                if (!isNaN(num) && num > 1) {
                    let current = 0;
                    const step = Math.ceil(num / 40);
                    const suffix = text.replace(/\d+/, '');
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= num) {
                            current = num;
                            clearInterval(interval);
                        }
                        el.textContent = current + suffix;
                    }, 30);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

});
