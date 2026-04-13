/**
 * analytics.js — Clarity + GA4 init (loaded with data-cookieconsent="statistics")
 */
(function () {
  'use strict';

  /* Microsoft Clarity */
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'w2c26qvw8j');

  /* Google Analytics 4 */
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-R840KKM8JB', { anonymize_ip: true });
})();
