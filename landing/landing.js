/* addus. Landingpage /website.html: Tracking (Consent Mode v2), Formular, Paketwahl, Reveal, CookieConsent.
   Läuft als defer-Script, damit der erste Paint nicht auf das Skript wartet. */
(function () {
'use strict';

  /* ══════════════════════════════════════════════════════════
     TRACKING · Google Ads (Consent Mode v2) + GA4 + Clarity
     Hier die IDs eintragen. Solange die Ads-ID ein Platzhalter ist,
     lädt kein Ads-Tag; GA4 und Clarity laufen unabhängig davon.
     ══════════════════════════════════════════════════════════ */
  var ADS = {
    id: 'AW-XXXXXXXXX',                      /* Google-Ads-Conversion-ID */
    anruf: 'AW-XXXXXXXXX/ANRUF_LABEL',       /* Conversion 1: Klick auf tel: */
    anfrage: 'AW-XXXXXXXXX/ANFRAGE_LABEL'    /* Conversion 2: Formular gesendet */
  };
  var GA4 = 'G-R840KKM8JB';
  var CLARITY = 'w2c26qvw8j';

  var adsReady = /^AW-\d{6,}$/.test(ADS.id);
  var state = { gtag: false, ads: false, analytics: false };

  function loadGtag() {
    if (state.gtag) return;
    state.gtag = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + (adsReady ? ADS.id : GA4);
    document.head.appendChild(s);
    gtag('js', new Date());
  }
  function enableAds() {
    if (state.ads || !adsReady) return;
    state.ads = true;
    loadGtag();
    gtag('config', ADS.id, { allow_enhanced_conversions: false });
  }
  function enableAnalytics() {
    if (state.analytics) return;
    state.analytics = true;
    loadGtag();
    gtag('config', GA4, { anonymize_ip: true });
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY);
    window.clarity('consent', true);
  }
  function applyConsent() {
    var cc = window.CookieConsent;
    if (!cc) return;
    var a = cc.acceptedCategory('analytics');
    var m = cc.acceptedCategory('marketing');
    gtag('consent', 'update', {
      ad_storage: m ? 'granted' : 'denied',
      ad_user_data: m ? 'granted' : 'denied',
      ad_personalization: m ? 'granted' : 'denied',
      analytics_storage: a ? 'granted' : 'denied'
    });
    if (a) enableAnalytics(); else if (window.clarity) window.clarity('consent', false);
    if (m) enableAds();
  }

  /* Conversion-Events: immer in den dataLayer, Tags nur nach Einwilligung */
  function conversion(name, params) {
    var data = { event: name };
    for (var k in params) data[k] = params[k];
    window.dataLayer.push(data);
    if (state.ads) gtag('event', 'conversion', { send_to: ADS[name] });
    if (state.analytics) gtag('event', name, params);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
    if (a) conversion('anruf', { ort: a.getAttribute('data-ort') || 'seite' });
    var w = e.target.closest ? e.target.closest('a[data-wa]') : null;
    if (w) window.dataLayer.push({ event: 'whatsapp' });
  });

  /* ══ Kopfzeile: Schatten nach dem ersten Scroll ══ */
  var top = document.getElementById('top');
  var onScroll = function () { top.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ══ Reveal ══ */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
    /* Sicherheitsnetz: was nach einigen Sekunden noch nicht im Blick war, wird ohne Beobachter sichtbar
       (Elemente außerhalb des Schirms, also ohne sichtbaren Sprung). */
    setTimeout(function () { targets.forEach(function (el) { el.classList.add('is-in'); }); io.disconnect(); }, 6000);
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ══ Paket vorauswählen ══ */
  var select = document.getElementById('f-paket');
  var nameFeld = document.getElementById('f-name');
  document.querySelectorAll('[data-paket]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      select.value = btn.getAttribute('data-paket');
      window.dataLayer.push({ event: 'paket_gewaehlt', paket: select.value });
      setTimeout(function () { nameFeld.focus({ preventScroll: true }); }, reduce ? 50 : 700);
    });
  });

  /* ══ Formular: Formspree + Turnstile ══ */
  var form = document.getElementById('anfrageForm');
  var dsgvo = document.getElementById('f-dsgvo');
  var sendBtn = document.getElementById('sendBtn');
  var erfolg = document.getElementById('formErfolg');
  var fehler = document.getElementById('formFehler');
  var turnstileToken = null;
  var isDev = ['localhost', '127.0.0.1', '0.0.0.0', ''].indexOf(location.hostname) !== -1;

  window.onTurnstileSuccess = function (t) { turnstileToken = t; updateSend(); };
  window.onTurnstileExpired = function () { turnstileToken = null; updateSend(); };
  function updateSend() { sendBtn.disabled = !(dsgvo.checked && !!turnstileToken); }
  dsgvo.addEventListener('change', updateSend);

  if (isDev) {
    turnstileToken = 'dev-bypass';
    document.querySelector('.cf-turnstile').style.display = 'none';
  } else {
    var loadTurnstile = function () {
      if (document.querySelector('script[data-turnstile]')) return;
      var s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true; s.defer = true; s.setAttribute('data-turnstile', '');
      document.head.appendChild(s);
    };
    if ('IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { loadTurnstile(); tio.disconnect(); }
      }, { rootMargin: '400px 0px' });
      tio.observe(form);
    } else { loadTurnstile(); }
    form.addEventListener('focusin', loadTurnstile, { once: true });
  }

  function fail(msg) { fehler.textContent = msg; fehler.classList.add('is-shown'); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fehler.textContent = ''; fehler.classList.remove('is-shown');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (sendBtn.disabled) return;
    var data = new FormData(form);
    if (turnstileToken) data.append('cf-turnstile-response', turnstileToken);
    var vorname = (data.get('name') || '').trim().split(/\s+/)[0];
    sendBtn.setAttribute('aria-busy', 'true');
    sendBtn.textContent = 'Wird gesendet …';

    fetch('https://formspree.io/f/mojpqqyy', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('status ' + res.status);
      form.hidden = true;
      if (vorname) document.getElementById('erfolgTitel').textContent = 'Danke, ' + vorname + '.';
      erfolg.classList.add('is-shown');
      erfolg.focus();
      conversion('anfrage', { paket: data.get('paket') || '' });
    }).catch(function () {
      fail('Das Senden hat nicht geklappt. Bitte noch einmal versuchen oder direkt anrufen: 0176 21214416.');
    }).then(function () {
      sendBtn.removeAttribute('aria-busy');
      sendBtn.textContent = 'Angebot anfordern';
    });
  });

  /* ══════════════════════════════════════════════════════════
     COOKIECONSENT v3 · dieselbe Lösung wie auf der Hauptseite,
     plus Kategorie „Werbung" für die Google-Ads-Conversion-Messung.
     Eigener Cookie-Name, damit Ads-Besucher einmal sauber gefragt werden.
     ══════════════════════════════════════════════════════════ */
  /* Stylesheet erst hier laden (kein Preload im Kopf: nichts konkurriert mit Schrift und LCP),
     der Banner startet, sobald das CSS da ist, also ohne ungestylten Moment. */
  function initConsent() {
    if (typeof CookieConsent === 'undefined') return;
    var cs = document.querySelector('link[data-cc-style]');
    if (!cs) {
      cs = document.createElement('link');
      cs.rel = 'stylesheet'; cs.href = '/landing/cookieconsent.css'; cs.setAttribute('data-cc-style', '');
      cs.addEventListener('load', runConsent, { once: true });
      cs.addEventListener('error', runConsent, { once: true });
      document.head.appendChild(cs);
    } else { runConsent(); }
  }
  function runConsent() {
    CookieConsent.run({
      revision: 1,
      cookie: { name: 'cc_landing', expiresAfterDays: 182 },
      guiOptions: {
        consentModal: { layout: 'box', position: 'bottom right', equalWeightButtons: true, flipButtons: false },
        preferencesModal: { layout: 'box', position: 'right', equalWeightButtons: true, flipButtons: false }
      },
      onConsent: applyConsent,
      onChange: applyConsent,
      categories: {
        necessary: { readOnly: true, enabled: true },
        analytics: {
          autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }, { name: /^_clck/ }, { name: /^_clsk/ }, { name: /^CLID/ }, { name: /^MUID/ }] }
        },
        marketing: {
          autoClear: { cookies: [{ name: /^_gcl/ }, { name: /^_gac_/ }] }
        }
      },
      language: {
        default: 'de',
        translations: {
          de: {
            consentModal: {
              title: 'Cookies & Tracking',
              description: 'Notwendige Cookies laufen immer. Statistik (Google Analytics, Microsoft Clarity) und Werbung (Google Ads misst, ob unsere Anzeige zu einem Anruf oder einer Anfrage geführt hat) nur, wenn Sie zustimmen. Anonymisiert, jederzeit widerrufbar. <a href="/datenschutz.html">Datenschutz</a>',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur Notwendige',
              showPreferencesBtn: 'Einstellungen',
              footer: '<a href="/datenschutz.html">Datenschutz</a> · <a href="/impressum.html">Impressum</a>'
            },
            preferencesModal: {
              title: 'Cookie-Einstellungen',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur Notwendige',
              savePreferencesBtn: 'Auswahl speichern',
              closeIconLabel: 'Schließen',
              sections: [
                { title: 'Ihre Wahl', description: 'Sie entscheiden, was diese Seite speichern darf. Ohne Ihre Zustimmung wird nichts geladen, was Sie wiedererkennt.' },
                { title: 'Notwendig', description: 'Technisch erforderlich: Ihre Cookie-Einstellungen und der Spam-Schutz des Formulars (Cloudflare Turnstile). Ohne diese funktioniert die Seite nicht korrekt.', linkedCategory: 'necessary' },
                {
                  title: 'Statistik & Analyse',
                  description: 'Anonymisierte Auswertung, wie Besucher die Seite nutzen, über Google Analytics 4 und Microsoft Clarity. IP-Adressen werden gekürzt.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    caption: 'Verwendete Cookies',
                    headers: { name: 'Name', domain: 'Domain', desc: 'Beschreibung' },
                    body: [
                      { name: '_ga, _ga_*', domain: 'google-analytics.com', desc: 'Google Analytics 4, Besucher-ID und Sitzungsanalyse. Speicherdauer: 2 Jahre.' },
                      { name: '_clck, _clsk, MUID, CLID', domain: 'clarity.ms', desc: 'Microsoft Clarity, Heatmaps und Aufzeichnungen ohne Klarnamen. Speicherdauer: 1 Jahr.' }
                    ]
                  }
                },
                {
                  title: 'Werbung & Conversion-Messung',
                  description: 'Google Ads misst, ob nach einem Klick auf unsere Anzeige ein Anruf oder eine Anfrage zustande kam. Keine personalisierte Werbung auf anderen Seiten.',
                  linkedCategory: 'marketing',
                  cookieTable: {
                    caption: 'Verwendete Cookies',
                    headers: { name: 'Name', domain: 'Domain', desc: 'Beschreibung' },
                    body: [
                      { name: '_gcl_au, _gcl_aw', domain: 'addus-web.de', desc: 'Google Ads Conversion-Messung. Speicherdauer: 90 Tage.' }
                    ]
                  }
                },
                { title: 'Mehr Informationen', description: 'Bei Fragen zur Cookie-Richtlinie: <a href="/impressum.html">Impressum</a>' }
              ]
            }
          }
        }
      }
    });
  }
  if (typeof CookieConsent !== 'undefined') initConsent();
  else document.addEventListener('DOMContentLoaded', initConsent);
})();
