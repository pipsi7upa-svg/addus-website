/* CookieConsent v3 — Konfiguration für addus-web.de */
(function () {
  if (typeof CookieConsent === 'undefined') return;

  CookieConsent.run({
    revision: 1,
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom right', equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: 'box', position: 'right', equalWeightButtons: true, flipButtons: false },
    },
    categories: {
      necessary: { readOnly: true, enabled: true },
      analytics: {
        autoClear: {
          cookies: [
            { name: /^_ga/ }, { name: '_gid' },
            { name: /^_clck/ }, { name: /^_clsk/ }, { name: /^CLID/ }, { name: /^MUID/ },
          ],
        },
      },
    },
    language: {
      default: 'de',
      translations: {
        de: {
          consentModal: {
            title: 'Cookies & Tracking',
            description: 'Wir nutzen Cookies, um die Nutzung der Website zu analysieren und zu verbessern. Notwendige Cookies sind immer aktiv. Statistik-Cookies (Google Analytics, Microsoft Clarity) helfen uns zu verstehen, wie Besucher mit der Seite interagieren — anonymisiert. <a href="/datenschutz.html">Datenschutz</a>',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Nur Notwendige',
            showPreferencesBtn: 'Einstellungen',
            footer: '<a href="/datenschutz.html">Datenschutz</a> · <a href="/impressum.html">Impressum</a>',
          },
          preferencesModal: {
            title: 'Cookie-Einstellungen',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Nur Notwendige',
            savePreferencesBtn: 'Auswahl speichern',
            closeIconLabel: 'Schließen',
            sections: [
              { title: 'Cookie-Nutzung', description: 'Wir verwenden Cookies, um die grundlegenden Funktionen der Seite sicherzustellen und das Nutzererlebnis anonymisiert zu analysieren. Sie können Ihre Einwilligung jederzeit ändern oder widerrufen.' },
              { title: 'Notwendige Cookies <span class="pm__badge">Immer aktiv</span>', description: 'Erforderlich für den Betrieb der Website (z.B. Cookie-Einstellungen selbst). Ohne diese funktioniert die Seite nicht korrekt.', linkedCategory: 'necessary' },
              {
                title: 'Statistik & Analyse',
                description: 'Anonymisierte Auswertung des Nutzerverhaltens via Google Analytics 4 und Microsoft Clarity. IP-Adressen werden anonymisiert.',
                linkedCategory: 'analytics',
                cookieTable: {
                  caption: 'Verwendete Cookies',
                  headers: { name: 'Name', domain: 'Domain', desc: 'Beschreibung' },
                  body: [
                    { name: '_ga, _ga_*', domain: 'google-analytics.com', desc: 'Google Analytics 4 — Besucher-ID, Sitzungsanalyse. Speicherdauer: 2 Jahre.' },
                    { name: '_clck, _clsk, MUID, CLID', domain: 'clarity.ms', desc: 'Microsoft Clarity — Heatmaps & Session-Recording (anonymisiert). Speicherdauer: 1 Jahr.' },
                  ],
                },
              },
              { title: 'Mehr Informationen', description: 'Bei Fragen zur Cookie-Richtlinie kontaktieren Sie uns: <a href="/impressum.html">Impressum</a>' },
            ],
          },
        },
      },
    },
  });

  // Wire up the "Cookie-Einstellungen" footer link via data-attribute
  // (replaces inline onclick — required for CSP without 'unsafe-hashes').
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('[data-cookie-settings]');
    if (!t) return;
    e.preventDefault();
    if (typeof CookieConsent !== 'undefined' && CookieConsent.showPreferences) {
      CookieConsent.showPreferences();
    }
  });
})();
