# Website-Strategie & Konzeptdokument
## Webagentur für KMU – Vollständige Sektionsplanung

**Dokument-Version:** 1.0
**Datum:** 24. März 2026
**Zielgruppe:** Kleine und mittlere Unternehmen (KMU)
**Dokumenttyp:** Konzept & Copywriting-Strategie

---

## Design-System Grundlagen

### Farbpalette
| Token | Farbe | HEX | Verwendung |
|---|---|---|---|
| `--color-primary` | Mitternachtsblau | `#0F1B2D` | Hintergrundanker, Autorität |
| `--color-accent` | Elektrisches Cyan | `#00C2FF` | CTAs, Highlights, Links |
| `--color-warm` | Bernstein-Gold | `#F5A623` | Trust-Badges, Sterne, Erfolge |
| `--color-success` | Smaragd | `#1DB954` | Ergebniszahlen, Fortschritt |
| `--color-neutral-100` | Off-White | `#F8F9FC` | Sektionshintergründe |
| `--color-neutral-900` | Tiefschwarz | `#0A0A0F` | Primärer Text |
| `--color-glass` | Weißglas | `rgba(255,255,255,0.08)` | Glassmorphism-Karten |

### Typografie-System
- **Display / H1:** `Syne` (700–800 Weight) – Geometrisch, selbstsicher, modern
- **Headings H2–H4:** `Inter` (600–700) – Klar lesbar, professionell
- **Body:** `Inter` (400–500, 16–18px, Line-Height 1.65) – Optimal für Lesbarkeit
- **Akzent / Zahlen:** `JetBrains Mono` (für KPIs, Metriken, Code-Aesthetik)
- **Mikro-Labels:** `Inter` (500, Uppercase, 0.1em Letter-Spacing)

### Animations-Design-System
```
Easing-Funktion: cubic-bezier(0.16, 1, 0.3, 1)  // Expo-Out – fühlt sich "teuer" an
Standard-Duration: 0.6s Entrance, 0.3s Hover, 0.15s Click
Stagger-Delay: 80ms pro Element bei Listen
Scroll-Threshold: 20% Sichtbarkeit für Entrance-Animationen
```

---

## 1. Hero-Sektion

### Strategische Zielsetzung
**Psychologische Trigger:** Pattern Interrupt (unerwarteter visueller Einstieg), Social Proof durch Zahlen, FOMO durch Knappheitsrhetorik, Klarheit über den Nutzen in unter 5 Sekunden.
**Primäres Ziel:** Visitor-to-Lead-Konversion in 8–12 Sekunden, Absprungrate unter 40%.

---

### Copywriting

#### Pre-Headline (Mikro-Label, animiert eingeblendet)
```
IHRE KONKURRENZ SCHLÄFT NICHT — SIE ABER VIELLEICHT ONLINE
```
*Darstellung: Uppercase, Cyan (#00C2FF), 13px, Tracking 0.2em, mit kleinem Blitz-Icon links — erscheint 0.4s vor der H1*

#### Haupt-Headline (H1)
```
Websites, die
Kunden gewinnen.
Nicht nur gut aussehen.
```
*"Kunden gewinnen" in einem Gradient-Clip-Text: #00C2FF → #F5A623, animiertes Underline-Reveal*

#### Sub-Headline
```
Wir bauen performante, konversionsoptimierte Webauftritte für
mittelständische Unternehmen — messbar mehr Anfragen, messbar
mehr Umsatz, messbar mehr Sichtbarkeit. Garantiert.
```
*18px, Inter 400, #6B7280, max-width: 560px*

#### Trust-Micro-Block (unter Sub-Headline)
```
✓ Fertig in 21 Tagen   ✓ SEO-ready ab Tag 1   ✓ 24/7 Support inklusive
```
*12px Flex-Row, Abstand 24px, Grün-Häkchen animated check-draw (SVG stroke)*

#### Primärer CTA
```
[ Kostenlose Strategie-Session buchen → ]
```
*Button: Gradient #00C2FF → #0088FF, Border-Radius 12px, Padding 18px 36px, Font-Size 17px, Font-Weight 600*
*Hover: Box-Shadow 0 8px 32px rgba(0,194,255,0.4), Transform translateY(-2px)*
*Sub-Text unter Button: "Keine Kreditkarte. Kein Verkaufsgespräch. 30 Minuten, die alles ändern."*

#### Sekundärer CTA
```
[ Portfolio ansehen ↓ ]
```
*Ghost-Button: Border 1.5px solid rgba(255,255,255,0.2), Backdrop-Blur, Hover: Border-Color #00C2FF*

---

### Visuelle Elemente & Layout

#### Layout-Struktur
```
Desktop (1440px):
┌─────────────────────────────────────────────────────┐
│  NAV                                          [CTA]  │
├───────────────────────────┬─────────────────────────┤
│                           │                         │
│   PRE-HEADLINE            │   [3D WEBSITE MOCKUP    │
│   H1 (2-3 Zeilen)         │    ANIMATION]           │
│   SUB-HEADLINE            │                         │
│   TRUST-MICRO             │   Schwebend, rotierend  │
│   [CTA PRIMARY]           │   Glassmorphism-Device  │
│   [CTA SECONDARY]         │                         │
│                           │                         │
├───────────────────────────┴─────────────────────────┤
│   SOCIAL PROOF TICKER                               │
└─────────────────────────────────────────────────────┘

Mobile (390px): Vollständig gestapelt, CTA full-width
```

#### Hero-Hintergrund: Animated Mesh Gradient
- Basis: `#0F1B2D` (Mitternachtsblau)
- 3 animierte Blobs: Cyan (#00C2FF, opacity 0.12), Violett (#7C3AED, opacity 0.08), Gold (#F5A623, opacity 0.06)
- Animation: `@keyframes blob-drift` – 12s, ease-in-out, alternate, infinite
- Grain-Texture-Overlay: SVG-Noise, opacity 0.03 (für Premium-Feel)

#### 3D Website-Mockup (rechte Seite)
- Three.js oder Spline-Embed: Browser-Frame mit schwebender Website-Preview
- Floating-Elemente: kleine UI-Chips ("SEO Score: 98", "+47% Anfragen", "Ladezeit: 0.8s") erscheinen um das Mockup herum
- Animation: Kontinuierliches sanftes Schweben (translateY -12px zu 0, 4s loop), leichte Y-Achsen-Rotation (±5°) bei Mouse-Move (Parallax)
- Auf Mobile: Statisches Bild mit CSS-Only-Float-Animation

#### Social Proof Ticker (Hero-Footer)
```
Endloser horizontaler Ticker, Marquee-Effect:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⭐ 4.9/5 Google-Bewertung  •  147 zufriedene Kunden  •
  +380% durchschnittliches Umsatzwachstum  •
  TOP 3 Webagentur Bayern 2025  •
  ISO-zertifiziert  •  Google Partner  •  Shopify Expert  •  ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
*Hintergrund: Semi-transparentes Dark-Panel, Blur-Backdrop, Separator mit Gradient-Fade an den Rändern*

---

### Micro-Interactions

| Element | Trigger | Reaktion |
|---|---|---|
| H1 "Kunden gewinnen" | Page Load | Gradient-Text-Shimmer-Effekt, 1.2s, einmalig |
| Trust-Häkchen | In Viewport | SVG Stroke-Drawthrough, gestaffelt 150ms |
| Primär-CTA | Hover | Glow-Pulse + translateY(-2px) + Ripple beim Click |
| Sekundär-CTA | Hover | Border füllt sich mit Cyan von links (::before pseudo) |
| 3D-Mockup | Mouse-Move | CSS perspective() + rotateX/Y basierend auf Maus-Position (max ±8°) |
| Ticker | Hover über Item | Pause-Animation + leichtes Scale(1.05) des Items |

---

### Frontend-Implementierung

```html
<!-- Performance-Notizen -->
<!--
  - LCP-Element (H1): Preload-Font für "Syne" via <link rel="preload">
  - Hero-Bild/3D: Conditional Loading — Desktop lädt Three.js, Mobile lädt statisches WebP
  - Ticker: CSS-only marquee (animation: scroll linear infinite) — kein JS nötig
  - Blob-Hintergrund: CSS Custom Properties + @keyframes — kein JS, GPU-beschleunigt
  - CTA-Tracking: data-analytics="hero-primary-cta" für GTM-Events

  Core Web Vitals Ziele:
  - LCP < 1.8s (H1-Text ist LCP, kein Bild)
  - CLS = 0 (min-height auf Hero-Container gesetzt, Fonts preloaded)
  - FID < 50ms (keine schweren Scripts im Critical Path)
-->
```

**Responsiveness-Breakpoints:**
- `< 768px` (Mobile): Single-Column, Mockup ausgeblendet, CTAs full-width, Ticker deaktiviert
- `768px–1024px` (Tablet): 60/40 Split, vereinfachte Mockup-Animation
- `> 1024px` (Desktop): Vollständiges Layout mit Mouse-Parallax

---

## 2. Vertrauens- und Autoritätsbereich

### Strategische Zielsetzung
**Psychologische Trigger:** Autorität (Awards, Zertifizierungen), Social Proof (Logos, Zahlen), Bandwagon-Effekt (viele andere vertrauen uns), Reziproziät (wir zeigen Erfolge anderer).
**Primäres Ziel:** Vertrauensaufbau und Einwandbeseitigung vor dem Portfolio.

---

### Sektion 2a: Kunden-Logos (Immediately After Hero)

#### Headline
```
Vertraut von über 140 Unternehmen in der DACH-Region
```
*H3, Inter 600, 20px, Centered, #6B7280 — bewusst dezent, nicht dominant*

#### Logo-Reihe
```
Darstellung: 6–8 Kundenlogos in einer horizontal gescrollten Reihe
Alle Logos: Grayscale (filter: grayscale(1) opacity(0.6))
Hover auf Logo: filter: grayscale(0) opacity(1) + Scale(1.08) — zeigt Farbe
Tooltip bei Hover: "[Kundenname] — +[X]% Anfragen nach Relaunch"
```

*Layout: CSS Grid, `repeat(auto-fit, minmax(140px, 1fr))`, Gap 48px, Align-Items Center*
*Mobile: Horizontal Scroll Snap Container, Logo-Größe 100px*

---

### Sektion 2b: Metriken-Block (KPI-Showcase)

#### Headline
```
Zahlen, die für uns sprechen.
```

#### Sub-Headline
```
Keine Hochglanzversprechen. Echte Ergebnisse unserer Kunden —
dokumentiert, nachweisbar, reproduzierbar.
```

#### KPI-Karten (4er-Grid)

**Karte 1:**
```
[Counter-Animation]
+380%
━━━━━━━━
Durchschnittliches
Umsatzwachstum
nach 6 Monaten

"Wir haben im ersten
Jahr 3x mehr Anfragen
bekommen."
— Markus H., Sanitärmeister
```

**Karte 2:**
```
[Counter-Animation]
147
━━━━━━━━
Zufriedene Kunden
in 8 Jahren

⭐⭐⭐⭐⭐
4.9 von 5 Sternen
(98 Google-Bewertungen)
```

**Karte 3:**
```
[Counter-Animation]
0.8s
━━━━━━━━
Durchschnittliche
Ladezeit unserer Websites

Top 2% aller Websites
weltweit (Lighthouse-Score 98)
```

**Karte 4:**
```
[Counter-Animation]
21
━━━━━━━━
Werktage bis
zur Go-Live

Inkl. Design, Entwicklung,
SEO-Setup & Content-Migration
```

*Counter-Animation: IntersectionObserver trigger → CountUp.js (0 → Endwert, 2.5s, Easing: easeOutExpo)*
*Karten-Design: Glassmorphism auf Dark Background, Border: 1px solid rgba(255,255,255,0.08)*
*Hover: Box-Shadow mit Accent-Color-Glow, Border-Color-Transition zu #00C2FF*

---

### Sektion 2c: Awards & Zertifizierungen

#### Layout
```
Horizontale Badge-Reihe, zentriert:

[🏆 TOP 3 Webagentur] [🎯 Google Partner] [⚡ Shopify Expert]
[ISO 9001:2015] [🔒 DSGVO-Konform] [♿ WCAG 2.1 AA]
```

*Jedes Badge: Weißes Icon auf Dunklem Hintergrund, Pill-Shape (Border-Radius 100px)*
*Hover: Tooltip erscheint mit Erklärungstext (Framer Motion AnimatePresence)*

---

### Sektion 2d: Video-Testimonial (Flagship-Testimonial)

#### Layout
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [VIDEO THUMBNAIL mit Play-Button]  │  Quote-Block  │
│  Kunde: Thomas Müller                │               │
│  Geschäftsführer, Müller GmbH        │  "Innerhalb   │
│  [Bewertungs-Sterne ⭐⭐⭐⭐⭐]         │  von 3 Monaten│
│                                      │  haben wir    │
│                                      │  unsere       │
│                                      │  Online-      │
│                                      │  Anfragen     │
│                                      │  verdrei-     │
│                                      │  facht."      │
│                                      │               │
│                                      │ [Mehr Stories]│
└─────────────────────────────────────────────────────┘
```

#### Quote-Text (Full)
```
"Wir haben jahrelang mit einer veralteten Website gekämpft.
Null Anfragen, schlechte Google-Platzierungen, und ich war
ehrlich gesagt skeptisch, ob eine neue Website wirklich
etwas bringt. Nach dem Relaunch mit [Agentur]:
3x mehr Anfragen, Seite 1 bei Google für unsere
wichtigsten Keywords, und plötzlich rufen Kunden
bei uns an — nicht mehr umgekehrt."

— Thomas Müller, Geschäftsführer Müller Haustechnik GmbH
   Ergebnis nach 3 Monaten | Branche: SHK-Handwerk
```

*Video: Autoplay muted im Thumbnail, Sound aktiviert erst bei Click — Respektiert Nutzer-Präferenzen*
*Play-Button: Animated Pulse-Ring in Cyan, 2s Loop*

---

### Micro-Interactions (Vertrauensbereich)

| Element | Trigger | Reaktion |
|---|---|---|
| KPI-Counter | 20% in Viewport | CountUp startet, einmalig |
| Kunden-Logos | Hover | Grayscale → Farbe, Tooltip slide-up |
| Award-Badges | Hover | Scale(1.1) + Tooltip fade-in |
| Video-Thumbnail | Hover | Brightness(1.15), Play-Icon scale(1.2) |
| Testimonial-Quote | Scroll | Fade + SlideUp, 0.6s |

---

### Frontend-Implementierung

```javascript
// Counter Animation mit IntersectionObserver
const initCounters = () => {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        countUp(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
};

// Lazy-Loading für Logo-Reihe
// <img loading="lazy" decoding="async" src="logo.webp" alt="Kundenname">
// Alle Logos: WebP-Format, max 120x60px, < 5KB pro Logo
```

---

## 3. Leistungsübersicht (Services)

### Strategische Zielsetzung
**Psychologische Trigger:** Klarheit & Reduktion der Entscheidungskomplexität, Wahrnehmung von Vollständigkeit (wir lösen alle Probleme), Ankering (Premium-Paket zuerst zeigen).
**Primäres Ziel:** Qualifizierung des Leads, Weiterleitung zu konkreten Service-Detail-Pages.

---

### Headline-Block

#### Sektion-Pre-Label
```
WAS WIR TUN
```

#### H2
```
Alles, was Ihr Unternehmen
online erfolgreich macht.
```

#### Sub-Text
```
Von der ersten Skizze bis zum Google-Ranking Nummer 1:
Wir begleiten Sie auf dem gesamten Weg zu einer Website,
die nicht nur existiert — sondern arbeitet.
```

---

### Service-Karten (3+1 Layout)

#### Service 1: Webdesign & Entwicklung
```
┌──────────────────────────────────────────┐
│  [Icon: Browser/Code — Animated SVG]     │
│                                          │
│  WEBDESIGN & ENTWICKLUNG                 │
│  ──────────────────────                  │
│  Konversionsoptimierte Websites,         │
│  die Besucher in Kunden verwandeln.      │
│                                          │
│  ✓ Individuelles UI/UX-Design            │
│  ✓ Mobile-First Entwicklung              │
│  ✓ Lightning-Fast (Lighthouse 95+)       │
│  ✓ CMS-Integration (WordPress/Webflow)   │
│                                          │
│  Typisches Ergebnis:                     │
│  [⬆ +240% Conversion Rate]               │
│                                          │
│  [Mehr erfahren →]                       │
└──────────────────────────────────────────┘
```

#### Service 2: SEO & Sichtbarkeit
```
┌──────────────────────────────────────────┐
│  [Icon: Trend-Pfeil/Lupe — Animated SVG] │
│                                          │
│  SEO & ONLINE-SICHTBARKEIT               │
│  ──────────────────────                  │
│  Gefunden werden, wenn Kunden suchen.    │
│  Nicht irgendwann — ab sofort.           │
│                                          │
│  ✓ Technisches SEO-Audit                 │
│  ✓ Keyword-Strategie & Content           │
│  ✓ Lokales SEO (Google My Business)      │
│  ✓ Monatliches Reporting-Dashboard       │
│                                          │
│  Typisches Ergebnis:                     │
│  [⬆ Top 3 bei 87% unserer Kunden]        │
│                                          │
│  [Mehr erfahren →]                       │
└──────────────────────────────────────────┘
```

#### Service 3: E-Commerce & Shopentwicklung
```
┌──────────────────────────────────────────┐
│  [Icon: Warenkorb/Store — Animated SVG]  │
│                                          │
│  E-COMMERCE & ONLINE-SHOPS               │
│  ──────────────────────                  │
│  Shops, die verkaufen. Nicht nur         │
│  Produkte zeigen.                        │
│                                          │
│  ✓ Shopify & WooCommerce Entwicklung     │
│  ✓ Checkout-Optimierung                  │
│  ✓ Produktfotografie-Beratung            │
│  ✓ Payment & Versand-Integration         │
│                                          │
│  Typisches Ergebnis:                     │
│  [⬆ +165% mehr Online-Umsatz]            │
│                                          │
│  [Mehr erfahren →]                       │
└──────────────────────────────────────────┘
```

#### Service 4: KI & Automatisierung (Highlight-Karte — größer, hervorgehoben)
```
┌────────────────────────────────────────────────────┐
│  [BADGE: NEU]              [Animated AI Chip Icon] │
│                                                    │
│  KI-INTEGRATION & AUTOMATISIERUNG                  │
│  ────────────────────────────────                  │
│  Die Zukunft ist schon hier. Ihre Konkurrenz       │
│  schläft noch. Wir bringen KI-gestützte            │
│  Funktionen in Ihren Webauftritt:                  │
│                                                    │
│  ✓ KI-Chatbot & 24/7-Kundenbetreuung               │
│  ✓ Personalisierte Nutzererlebnisse                 │
│  ✓ Automatisierte Lead-Qualifizierung              │
│  ✓ KI-gestützter Content & Übersetzung             │
│  ✓ Predictive SEO & Content-Empfehlungen           │
│                                                    │
│  "Der Chatbot qualifiziert pro Monat 40+ Leads     │
│   — ohne dass ich einen Finger rühre."             │
│  — Sandra K., Immobilienmaklerin                   │
│                                                    │
│  [KI-Demo anfordern →]                             │
└────────────────────────────────────────────────────┘
```
*Highlight-Karte: Border: 1px solid #00C2FF, Hintergrund: Gradient von #0F1B2D zu #001524, Glow-Shadow*
*Badge "NEU": Cyan Pill mit Pulse-Animation*

---

### Branchen-Spezialisierung (Nischen-Positionierung)

#### Headline
```
Wir kennen Ihre Branche.
Nicht nur Ihre Website.
```

#### Sub-Text
```
Generische Webagenturen bauen generische Websites.
Wir haben tiefes Branchenwissen und wissen, welche
Keywords, welche Bildsprache und welche CTAs in
Ihrem Markt wirklich funktionieren.
```

#### Branchen-Pills (horizontal scrollbar, klickbar)
```
[ Handwerk & Bau ] [ Medizin & Gesundheit ] [ Recht & Beratung ]
[ Immobilien ] [ Gastronomie ] [ E-Commerce & Retail ]
[ Finanzdienstleistungen ] [ Bildung & Coaching ] [ Industrie & B2B ]
```

*Pills: Rounded, klickbar → öffnet Branch-specific Case Study*
*Active-State: Cyan-Hintergrund, Weiß-Text*
*Animation: Slide-in from bottom, gestaffelt 60ms pro Pill beim ersten Viewport-Enter*

---

### CTA-Block (Sektion-Footer)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Nicht sicher, was Sie brauchen?                       │
│   Kein Problem.                                         │
│                                                         │
│   In unserem kostenlosen 30-Minuten-Gespräch analysieren│
│   wir Ihren aktuellen Webauftritt und zeigen Ihnen      │
│   konkret, wo Umsatz verloren geht.                     │
│                                                         │
│   [Gratis Website-Analyse sichern →]                    │
│                                                         │
│   "Das ehrlichste Gespräch, das ich je mit einer        │
│    Agentur hatte." — Peter W., Steuerberater            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Micro-Interactions (Services)

| Element | Trigger | Reaktion |
|---|---|---|
| Service-Karte | Hover | translateY(-8px), Shadow-Intensivierung, Icon animiert sich |
| Branchen-Pills | Hover | Hintergrund füllt sich von links (::before, transition 0.3s) |
| "Mehr erfahren"-Link | Hover | Pfeil-Icon bewegt sich 4px nach rechts |
| AI-Service-Badge | Page Load | Repeat: Pulse-Glow alle 4s (Aufmerksamkeit erzeugen) |
| Ergebnis-Metriken | Hover über Karte | Zahl animiert kurz (Scale 1.2, 0.2s) |

---

## 4. Portfolio / Case Studies

### Strategische Zielsetzung
**Psychologische Trigger:** Beweis (Show, don't tell), Identifikation (Besucher sieht sich im Kunden), Spezifität (konkrete Zahlen > vage Versprechen), FOMO (andere profitieren bereits).
**Primäres Ziel:** Tiefes Engagement, Verweildauer erhöhen, direkter Kontaktwunsch aus Portfolio.

---

### Headline-Block

#### Pre-Label
```
REFERENZEN & ERGEBNISSE
```

#### H2
```
Echte Projekte.
Echte Ergebnisse.
Echte Zahlen.
```

#### Sub-Text
```
Keine Stock-Fotos. Keine erfundenen Metriken.
Jedes Projekt hier ist dokumentiert, messbar und —
auf Wunsch — verifizierbar durch unsere Kunden.
```

---

### Portfolio-Filter-System

```
[Alle Projekte] [Handwerk] [E-Commerce] [B2B] [Medizin] [Gastronomie] [KI-Projekte]
```

*Filter: Pill-Buttons, Active-State mit Cyan-Füllung*
*Filter-Animation: Masonry-Layout reflow mit Framer Motion `layout` prop — smooth reorder*

---

### Case Study Karte (Featured — Große Karte)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [VOLLBREITES BEFORE/AFTER WEBSITE SCREENSHOT — Toggle-Slider]  │
│                                                                 │
│  ┌─────────────────────────────────────┐                        │
│  │  CASE STUDY                         │                        │
│  │  ─────────────────────────────────  │                        │
│  │  Müller Haustechnik GmbH            │                        │
│  │  Branche: SHK-Handwerk, München     │                        │
│  │                                     │                        │
│  │  HERAUSFORDERUNG:                   │                        │
│  │  Veraltete Website, Seite 8 bei     │                        │
│  │  Google, 0 Online-Anfragen/Monat    │                        │
│  │                                     │                        │
│  │  UNSERE LÖSUNG:                     │                        │
│  │  Kompletter Relaunch, Local-SEO-    │                        │
│  │  Kampagne, Chatbot-Integration      │                        │
│  │                                     │                        │
│  │  ERGEBNISSE NACH 90 TAGEN:          │                        │
│  │  ┌──────┐ ┌──────┐ ┌──────────────┐ │                        │
│  │  │ +340%│ │  #1  │ │  21 Tage     │ │                        │
│  │  │Anfr. │ │Google│ │  bis Live    │ │                        │
│  │  └──────┘ └──────┘ └──────────────┘ │                        │
│  │                                     │                        │
│  │  [Vollständige Case Study lesen →]  │                        │
│  └─────────────────────────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Before/After Slider
```
Technologie: CSS clip-path + range input (nativer Schieberegler)
Drag-Interaktion: Vertikale Linie mit Circle-Handle (#00C2FF, 48px)
Label Links: "Vorher" (Rot-Tint Badge)
Label Rechts: "Nachher" (Grün-Tint Badge)
Touch-Support: pointer events für Mobile-Swipe
```

---

### Portfolio-Grid (Standard-Karten, 3er-Spalten)

#### Karten-Struktur
```
┌────────────────────────┐
│  [PROJECT SCREENSHOT]  │
│  [Hover: Video Preview]│
│                        │
│  BRANCHE-TAG           │
│  Projektname           │
│  ──────────────────    │
│  Kurzbeschreibung      │
│  (max. 80 Zeichen)     │
│                        │
│  [+X% Conversion]      │
│  [↑ Ranking: #1]       │
│                        │
│  [→ Details]           │
└────────────────────────┘
```

*Hover auf Karte: Screenshot-Bild wird zu 3-Sekunden-Screen-Recording (autoplay muted video)*
*Karten-Hover: translateY(-6px), Shadow-Upgrade*

---

### Vollständige Case Study (Sub-Page Template)

#### Seiten-Struktur
```
1. HERO: Projektname + Branche + 3 Haupt-KPIs (groß, sofort sichtbar)
2. AUSGANGSLAGE: Was war das Problem? (mit Screenshot "Vorher")
3. UNSERE STRATEGIE: Was haben wir wie gemacht? (Timeline-Format)
4. ERGEBNISSE: Detaillierte Charts + Metriken (Chart.js, Lazy-Loaded)
5. KUNDENZITAT: Video oder Text-Testimonial
6. TECHNOLOGIE-STACK: Icons der verwendeten Tools
7. CTA: "Ähnliche Ergebnisse für Ihr Unternehmen?"
```

---

### Testimonial-Karussell (Portfolio-Sektion-Ende)

#### Karussell-Headlines (rotierend, 4s Autoplay mit Pause-on-Hover)

**Testimonial 1:**
```
"Wir hatten vorher 2-3 Anfragen im Monat online. Heute sind
es 30-40. Die neue Website hat unser Unternehmen verändert."

— Anna Bergmann, Bergmann Physiotherapie Köln
   Branche: Gesundheit | +1.200% Online-Anfragen
```

**Testimonial 2:**
```
"Ich war skeptisch wegen des Preises. Aber schon im ersten
Monat hat die neue Website mehr als das Doppelte der
Investition reingeholt. Bester ROI in meiner Geschichte."

— Klaus Richter, Richter Steuerberatung Hamburg
   Branche: Finanzen/Beratung | ROI: 340% im ersten Quartal
```

**Testimonial 3:**
```
"Die haben wirklich verstanden, wie mein Handwerksbetrieb
tickt. Nicht einfach irgendeine Website gebaut, sondern
eine, die meinen Kunden überzeugt. Läuft."

— Ibrahim Al-Hassan, Al-Hassan Elektro GmbH Dortmund
   Branche: Elektrohandwerk | Seite 1 Google in 6 Wochen
```

*Karussell: Keine Auto-Animation ohne User-Trigger auf Mobile (Accessibility)*
*Dots-Navigation: Klickbar, ARIA-Labels*
*Transition: Crossfade + SlideLeft, 0.5s ease*

---

### CTA-Block (Portfolio-Ende)

```
Ihr Unternehmen könnte die nächste Erfolgsgeschichte sein.

[Jetzt kostenlose Analyse anfragen →]

oder: Rufen Sie uns direkt an: +49 89 XXX XXXX
```

---

## 5. Über Uns / Team

### Strategische Zielsetzung
**Psychologische Trigger:** Sympathie & Ähnlichkeit (Menschen kaufen von Menschen), Autorität (Expertise zeigen), Authentizität (kein Hochglanz-Fake), Vertrauen durch Transparenz (echte Menschen, echte Namen).
**Primäres Ziel:** Menschliche Verbindung schaffen, letzten Vertrauens-Einwand beseitigen.

---

### Headline-Block

#### Pre-Label
```
WER WIR SIND
```

#### H2
```
Keine Agentur.
Ihr digitales Team.
```

#### Sub-Text (Unternehmensphilosophie)
```
2016 gegründet mit einer einfachen Überzeugung:
Gute Websites sind keine Frage des Budgets — sondern
der richtigen Strategie. Seitdem haben wir über 147
Unternehmen geholfen, online zu wachsen. Und wir haben
gelernt: Es geht nie nur um Design. Es geht um Ihre Ziele.
```

---

### Gründer-Statement (Persönliche Note)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [FOTO: Gründer — authentisch, kein Stockfoto,             │
│   leicht lächelnd, professionell aber zugänglich]           │
│                                                             │
│  "Ich habe früher selbst einen kleinen Betrieb geführt.     │
│   Ich weiß, wie frustrierend es ist, wenn die Website       │
│   nichts bringt und man nicht weiß warum.                   │
│                                                             │
│   Deshalb bauen wir keine Websites. Wir bauen               │
│   Wachstumsmaschinen für Unternehmen wie Ihres."            │
│                                                             │
│  — [Gründername]                                            │
│     Geschäftsführer & Head of Strategy                      │
│                                                             │
│  [LinkedIn-Profil →]  [Direktgespräch buchen →]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

*Foto: Hohe Qualität, natürliches Licht, Hintergrund dezent (Büro oder Studio)*
*Animation: Foto faded in + leichter Parallax-Scroll-Effekt*

---

### Team-Grid

#### Team-Karte Template
```
┌──────────────────────────┐
│   [QUADRATISCHES FOTO]   │
│   [Hover: Kurzvideo 3s]  │
│                          │
│   Vorname Nachname       │
│   POSITION               │
│   ──────────────────     │
│   Spezialgebiet:         │
│   "SEO & Technical Web"  │
│                          │
│   [8 Jahre Erfahrung]    │
│   [47 Projekte betreut]  │
│                          │
│   [LinkedIn Icon]        │
└──────────────────────────┘
```

#### Team-Mitglieder (Beispiel-Positionen)

**Slot 1 — Webdesign-Lead:**
```
Name: [Vorname], [Nachname]
Position: LEAD DESIGNER & UX-STRATEGE
Spezialgebiet: "Conversion-Optimiertes UI/UX Design"
Fakt 1: 9 Jahre Erfahrung
Fakt 2: 60+ Websites designed
Fun Fact (Hover): "Hört beim Designen ausschließlich Lo-Fi Hip-Hop"
```

**Slot 2 — Dev-Lead:**
```
Name: [Vorname], [Nachname]
Position: LEAD DEVELOPER
Spezialgebiet: "Performance & Core Web Vitals"
Fakt 1: Lighthouse-Scores durchschnittlich 97
Fakt 2: 8 Jahre Frontend-Entwicklung
Fun Fact (Hover): "Hat noch keinen Server-Fehler nicht gelöst"
```

**Slot 3 — SEO-Lead:**
```
Name: [Vorname], [Nachname]
Position: HEAD OF SEO & CONTENT
Spezialgebiet: "Lokales SEO & B2B-Sichtbarkeit"
Fakt 1: 200+ Websites auf Seite 1 gebracht
Fakt 2: Google-zertifiziert seit 2018
Fun Fact (Hover): "Checkt morgens zuerst die Search Console, dann E-Mails"
```

**Slot 4 — Projekt-Management:**
```
Name: [Vorname], [Nachname]
Position: PROJECT MANAGER & CLIENT SUCCESS
Spezialgebiet: "Ihr persönlicher Ansprechpartner"
Fakt 1: 100% Kundenzufriedenheitsrate
Fakt 2: Spricht: DE, EN, FR
Fun Fact (Hover): "Hat noch nie ein Projekt-Deadline verpasst"
```

---

### Unternehmenswerte (Values-Block)

#### Headline
```
Was uns antreibt.
```

#### Value-Cards (3er-Grid, Icons + Text)

**Wert 1:**
```
[Icon: Zielscheibe]
ERGEBNISORIENTIERUNG
────────────────────
Wir messen alles. Jede Entscheidung
basiert auf Daten, nicht auf Bauchgefühl.
Ihr ROI ist unser Qualitätsmaßstab.
```

**Wert 2:**
```
[Icon: Glühbirne]
EHRLICHE BERATUNG
──────────────────
Wir sagen Ihnen, was Sie brauchen —
nicht was Sie hören wollen. Auch wenn
das manchmal unbequem ist.
```

**Wert 3:**
```
[Icon: Herz/Handshake]
LANGFRISTIGE PARTNERSCHAFT
──────────────────────────
Wir sind kein Projekt-Dienstleister.
Wir werden Ihr digitales Team.
Durchschnittliche Kundenbeziehung: 4,2 Jahre.
```

---

### Büro & Kultur (Optional — Social Proof durch Authentizität)

```
Bildergalerie: 4-6 authentische Bürofotos (kein Stockfoto-Feeling)
- Team beim Whiteboard-Workshop
- Einzelne Team-Mitglieder am Arbeitsplatz
- Team-Event / Feiern eines Kunden-Erfolgs

Format: CSS Masonry Grid, verschiedene Seitenverhältnisse
Hover: Leichtes Zoom-In (scale 1.05, overflow hidden)
```

---

### Micro-Interactions (Über Uns)

| Element | Trigger | Reaktion |
|---|---|---|
| Team-Foto | Hover | Schwarzweiß → Farbe ODER Foto → Kurzvideo |
| Fun-Fact | Hover über Karte | Kleine Sprechblase erscheint (CSS tooltip, slideUp) |
| Gründer-Foto | Scroll-Parallax | Foto bewegt sich 30% langsamer als Content (Tiefe) |
| Value-Cards | Hover | Icon animiert sich (Lottie oder CSS-Animation) |
| LinkedIn-Icons | Hover | Rotate 15° + Scale(1.2) |

---

## 6. Wissensbereich / Blog

### Strategische Zielsetzung
**Psychologische Trigger:** Reziprozität (kostenloser Mehrwert schafft Schuldgefühl → Kontaktbereitschaft), Expertise-Signal, SEO-Content-Strategie, Top-of-Funnel Lead-Generierung.
**Primäres Ziel:** Organischer Traffic, Newsletter-Anmeldungen, Positionierung als Thought Leader.

---

### Headline-Block

#### Pre-Label
```
WISSEN & INSIGHTS
```

#### H2
```
Was wirklich funktioniert.
Kein Bullshit.
```

#### Sub-Text
```
Praxiswissen für Unternehmer, die ihre Online-Präsenz
selbst besser verstehen wollen. Kein Fachjargon,
keine Verkaufsmaschen — nur ehrliche Einblicke aus
8 Jahren Agenturerfahrung.
```

---

### Featured Article (Hero-Card)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [FEATURED ARTICLE HEADER IMAGE — Aspect 16:9]          │
│                                                         │
│  [TAG: SEO]   [Lesezeit: 7 Min]   [Datum: März 2026]    │
│                                                         │
│  Warum 87% aller Handwerker-Websites keine              │
│  einzige Online-Anfrage generieren                      │
│  — und wie Sie das in 30 Tagen ändern                   │
│                                                         │
│  Die erschreckende Wahrheit: Die meisten kleinen        │
│  Unternehmen haben eine Website, die wie ein            │
│  Schaufenster in einer Einbahnstraße steht.             │
│  Wir zeigen Ihnen warum — und was Sie dagegen tun       │
│  können.                                                │
│                                                         │
│  [Jetzt lesen →]             [Autor: [Name], SEO-Lead]  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Blog-Grid (3er-Spalten)

#### Artikel-Karten-Struktur
```
┌──────────────────────────┐
│  [ARTIKEL-THUMBNAIL]     │
│  [Hover: Color-Overlay   │
│   mit Lese-Icon]         │
│                          │
│  [TAG] · [LESEZEIT]      │
│                          │
│  Artikel-Titel           │
│  (max. 2 Zeilen, 60 Z.)  │
│  ──────────────────      │
│  Teaser-Text             │
│  (max. 3 Zeilen)         │
│                          │
│  [Autor-Avatar] Name     │
│  [Datum]    [Weiterlesen]│
└──────────────────────────┘
```

#### Beispiel-Artikel-Titel (SEO-optimiert, klickstark)

```
Artikel 1:
"5 Website-Fehler, die Ihr Handwerksunternehmen
täglich Kunden kosten" [Tag: Handwerk] [8 Min]

Artikel 2:
"Google My Business 2026: Der komplette
Leitfaden für lokale Unternehmen" [Tag: SEO] [12 Min]

Artikel 3:
"KI im Mittelstand: Diese 3 Tools haben unsere
Kunden auf Autopilot gebracht" [Tag: KI] [6 Min]

Artikel 4:
"Was kostet eine gute Website wirklich?
(Ehrliche Aufschlüsselung mit Zahlen)" [Tag: Kosten] [5 Min]

Artikel 5:
"E-Commerce für Handwerker: Wie Werkzeugverkauf
online 40% mehr Umsatz bringt" [Tag: E-Commerce] [9 Min]

Artikel 6:
"Core Web Vitals 2026: Warum Ihre Website-
Geschwindigkeit über Ihr Google-Ranking entscheidet" [Tag: Tech] [7 Min]
```

---

### Newsletter-CTA (Inline, zwischen Artikel-Grid)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Envelope Icon mit Animations-Brieföffnen bei Hover]       │
│                                                             │
│  Monatlich. Wertvoll. Kostenlos.                            │
│                                                             │
│  Unser Newsletter für Unternehmer:                          │
│  ✓ 1 umsetzbarer Website-Tipp                               │
│  ✓ 1 SEO-Quick-Win der Woche                                │
│  ✓ Aktuelle Google-Updates, die Ihr Business betreffen      │
│                                                             │
│  Kein Spam. Kein Verkaufen. Abmeldung jederzeit.            │
│                                                             │
│  [E-Mail eingeben ................] [Jetzt abonnieren →]     │
│                                                             │
│  Bereits 2.840 Unternehmer abonniert                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

*Input-Animation: Placeholder float-label bei Focus*
*Button: Disabled bis valide E-Mail eingegeben (native HTML5 + CSS :valid Selektor)*
*Success-State: Input-Zeile wird grün, Checkmark-Animation, "Willkommen an Bord!"*

---

### Artikel-Detail-Page Template

#### Lese-Erlebnis-Optimierungen
```
1. READING PROGRESS BAR: Thin Cyan Bar am Top (position: fixed)
2. ESTIMATED READING TIME: Prominent im Header
3. INHALTSVERZEICHNIS: Sticky Left-Sidebar ab 1200px,
   Collapsible Accordion auf Mobile
4. HIGHLIGHT-FUNKTIONALITÄT: User kann Text markieren →
   Share-Bubble erscheint (Twitter/LinkedIn)
5. RELATED ARTICLES: Am Ende, 3 thematisch verwandte Artikel
6. INLINE CTAs: Nach Absatz 3 und 6 diskrete "Haben Sie Fragen?"-Banner
7. AUTHOR BIO: Am Ende mit Foto + LinkedIn + weitere Artikel
```

---

### Micro-Interactions (Blog)

| Element | Trigger | Reaktion |
|---|---|---|
| Artikel-Karte | Hover | Image-Zoom (scale 1.05), Title-Color zu Cyan |
| Reading Progress | Scroll | Linear Fortschrittsanzeige |
| Newsletter-Submit | Click nach Validierung | Confetti-Animation (Canvas), Formular → Danke-Nachricht |
| TOC-Links | Scroll | Aktiver Abschnitt wird hervorgehoben (Highlight) |
| Tag-Buttons | Click | Filter-Animation, nicht relevante Artikel fade-out |

---

### Frontend-Implementierung (Blog)

```javascript
// Lazy Loading für Blog-Bilder
// Alle Bilder: loading="lazy", decoding="async"
// Format: WebP mit JPEG-Fallback via <picture>
// Thumbnails: 400x250px, < 30KB

// Reading Progress Bar
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  document.querySelector('.reading-progress').style.width = `${progress}%`;
});

// Paginated Loading (Blog-Grid)
// Initial: 6 Artikel geladen
// "Mehr laden" Button: Weitere 6 via Fetch API oder Static Site Gen
// Infinite Scroll: Optional, mit "Back to Top" Button
```

---

## 7. Kontakt & Footer

### Strategische Zielsetzung
**Psychologische Trigger:** Verknappung durch Buchungskalender (echte Verfügbarkeit), Commitment-Reduktion (niedrigschwelliger Einstieg), Soziale Sicherheit (letzte Einwände beseitigen).
**Primäres Ziel:** Maximale Lead-Konversion, Kontaktaufnahme so einfach wie möglich machen.

---

### Kontakt-Sektion

#### Pre-Label
```
NÄCHSTER SCHRITT
```

#### H2
```
Bereit für mehr Kunden?
Lassen Sie uns reden.
```

#### Sub-Text
```
Kein Hochdruckverkauf. Kein Standardangebot ohne
Analyse. Nur ein ehrliches Gespräch darüber,
ob und wie wir Ihnen helfen können.
```

#### Einwand-Abbau (Kleine Stichpunkte unter H2)
```
✓ 100% kostenlos & unverbindlich
✓ Keine versteckten Verpflichtungen
✓ Antwort innerhalb von 4 Stunden (Mo-Fr)
✓ Sprechen Sie mit einem echten Experten —
   kein Call-Center
```

---

### Kontakt-Layout (2-Spalten)

```
┌────────────────────────────────┬──────────────────────────────┐
│                                │                              │
│   KONTAKTFORMULAR              │   DIREKTKONTAKT              │
│   ────────────────────         │   ─────────────────────      │
│                                │                              │
│   [Vorname] [Nachname]         │   📞 +49 89 XXX XXXX         │
│                                │      Mo-Fr 9-18 Uhr          │
│   [E-Mail-Adresse]             │                              │
│                                │   ✉  hallo@agentur.de        │
│   [Telefon (optional)]         │      Antwort < 4 Std.        │
│                                │                              │
│   Ich interessiere mich für:   │   📍 Musterstraße 42         │
│   [ ] Website-Neuentwicklung   │      80333 München           │
│   [ ] Website-Relaunch         │                              │
│   [ ] SEO & Sichtbarkeit       │   ─────────────────────      │
│   [ ] E-Commerce / Shop        │                              │
│   [ ] KI-Integration           │   ODER: DIREKT BUCHEN        │
│   [ ] Beratung & Strategie     │                              │
│                                │   [Calendly/Cal.com Widget]  │
│   [Ihre Nachricht...]          │   Zeigt echte Verfügbarkeit  │
│   (Textarea, min-height 120px) │   der nächsten 7 Tage        │
│                                │                              │
│   [Nachricht senden →]         │   ─────────────────────      │
│                                │                              │
│   DSGVO-Hinweis (Checkbox):    │   REAKTIONSZEIT:             │
│   ☐ Ich stimme der Datenschutz │   ⚡ Heute noch Rückruf      │
│     erklärung zu. [Link]       │   ⚡ Angebot in 48 Stunden   │
│                                │   ⚡ Projektstart in 7 Tagen │
│                                │                              │
└────────────────────────────────┴──────────────────────────────┘
```

---

### Formular-Details & Validierung

#### Input-Styling
```css
/* Floating Labels */
.form-group {
  position: relative;
}

.form-input:focus ~ .form-label,
.form-input:not(:placeholder-shown) ~ .form-label {
  transform: translateY(-24px) scale(0.85);
  color: #00C2FF;
}

/* Validierungs-States */
.form-input:valid { border-bottom-color: #1DB954; }
.form-input:invalid:not(:placeholder-shown) { border-bottom-color: #EF4444; }
```

#### Formular-Flow
```
1. USER FÜLLT AUS: Echtzeit-Validierung (nach blur, nicht während Tippen)
2. SUBMIT-BUTTON: Disabled solange Pflichtfelder leer,
   Farbe graut aus (visuelles Feedback)
3. LOADING STATE: Button wird zu Spinner
   ("Wird gesendet..." + Spin-Animation)
4. SUCCESS STATE: Formular faded out,
   Success-Message faded in:

   ┌──────────────────────────────────────────────┐
   │                                              │
   │  ✓ Ihre Nachricht ist angekommen!            │
   │                                              │
   │  [Vorname], wir melden uns innerhalb von     │
   │  4 Stunden bei Ihnen — oder noch heute,      │
   │  falls Sie vor 15 Uhr schreiben.             │
   │                                              │
   │  Schon mal neugierig?                        │
   │  → Schauen Sie sich unsere Case Studies an   │
   │                                              │
   └──────────────────────────────────────────────┘

5. ERROR STATE: Freundliche Fehlermeldung,
   Telefonnummer als Fallback anbieten
```

---

### FAQ (Kontakt-Sektion, Accordion)

#### Headline
```
Die häufigsten Fragen.
Ehrliche Antworten.
```

#### FAQ-Einträge

```
▸ Was kostet eine neue Website?
─────────────────────────────────
Eine solide Business-Website liegt bei uns zwischen
2.500 € und 8.000 €, abhängig von Umfang und Funktionen.
Im kostenlosen Erstgespräch bekommen Sie ein transparentes
Angebot — ohne Überraschungen danach.

▸ Wie lange dauert ein Website-Projekt?
─────────────────────────────────────
Unser Standard: 21 Werktage von Kick-off bis Go-Live.
Bei komplexeren Projekten (Shop, Multilinguale Sites)
4-6 Wochen. Immer pünktlich — das ist keine Phrase,
sondern vertragliche Vereinbarung.

▸ Kann ich meine Website danach selbst bearbeiten?
─────────────────────────────────────────────────
Ja. Jede Website liefern wir mit einem 2-stündigen
Einführungs-Workshop und einem Video-Tutorial-Paket.
Sie brauchen kein technisches Vorwissen.

▸ Was, wenn mir das Ergebnis nicht gefällt?
──────────────────────────────────────────
Es gibt 2 Feedback-Runden inklusive. Falls Sie nach
finalem Abschluss unzufrieden sind, gibt es unsere
30-Tage-Zufriedenheitsgarantie — oder wir arbeiten
nach, bis es stimmt.

▸ Übernehmt ihr auch bestehende Websites?
─────────────────────────────────────────
Ja. Website-Audits, Relaunch bestehender Seiten
und Performance-Optimierungen gehören zu unseren
häufigsten Projekten. Wir analysieren, was Sie haben,
und zeigen Ihnen den besten Weg vorwärts.
```

*Accordion: ARIA-konforme Umsetzung (aria-expanded, aria-controls)*
*Animation: max-height Transition, 0.4s ease — kein JS-Jump*
*Icon: Plus/Minus oder Chevron, rotiert 180° bei Open*

---

### Footer

#### Footer-Struktur
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  [LOGO]                                                             │
│  Tagline: Websites, die wachsen.                                    │
│                                                                     │
│  Kurzbeschreibung (2 Zeilen):                                       │
│  Wir helfen kleinen und mittleren Unternehmen,                      │
│  online mehr Kunden zu gewinnen. Seit 2016.                         │
│                                                                     │
│  [LinkedIn] [Instagram] [YouTube] [Xing]                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  LEISTUNGEN          UNTERNEHMEN       RESSOURCEN     KONTAKT       │
│  ─────────────────   ──────────────   ───────────     ──────────    │
│  Webdesign           Über uns          Blog            +49 89 XXX   │
│  SEO                 Team              Newsletter       hallo@...   │
│  E-Commerce          Referenzen        Downloads        München     │
│  KI-Integration      Karriere          Webinare                     │
│  Wartung & Support   Presse            Glossar                      │
│  Preise              Partner           FAQ                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  NEWSLETTER-MINI-SIGNUP                                             │
│  "Einmal im Monat. Nur Wissen. Kein Spam."                          │
│  [E-Mail ..............] [→]                                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TRUST-BADGES ROW:                                                  │
│  [Google Partner] [Shopify Expert] [DSGVO-Konform] [ISO 9001]       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  © 2026 [Agentur GmbH] | Impressum | Datenschutz | AGB |           │
│  Cookie-Einstellungen | Sitemap                                     │
│                                                                     │
│  Mit ♥ gebaut in München — und messbar schnell.                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Footer-Design-Details
```
Hintergrund: #0A0A0F (tiefstes Dunkel — signalisiert Ende der Seite)
Text: #6B7280 (dezent, nicht dominant)
Links: #6B7280 → Hover #00C2FF (Transition 0.2s)
Divider: 1px solid rgba(255,255,255,0.06)
Trust-Badges: Grayscale, Hover → Farbe (wie Logo-Reihe)
Footer-Link-Animation: Underline grow from center (::after pseudo-element)
```

---

### Micro-Interactions (Kontakt & Footer)

| Element | Trigger | Reaktion |
|---|---|---|
| Kalender-Widget | Load | Lazy-Load via IntersectionObserver (schweres Widget) |
| Formular-Submit | Click | Loading-Spinner in Button, dann Success/Error-State |
| FAQ-Accordion | Click | Smooth max-height expand, Icon-Rotation 180° |
| Footer-Links | Hover | Underline wächst von Mitte nach außen |
| Social-Icons | Hover | Bounce-Animation (translateY -4px, 0.3s) |
| Cookie-Banner | First Visit | Slide-Up vom unteren Rand, Blur-Backdrop, DSGVO-Konform |

---

### Frontend-Implementierung (Kontakt & Footer)

```javascript
// Lazy Loading des Kalender-Widgets (Calendly/Cal.com)
const calendarContainer = document.querySelector('.calendar-widget');
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    // Dynamisch Script nachladen
    const script = document.createElement('script');
    script.src = 'https://cal.com/embed.js';
    document.body.appendChild(script);
    observer.disconnect();
  }
}, { rootMargin: '200px' });
observer.observe(calendarContainer);

// Formular-Submission mit Netlify Forms / Formspree / eigene API
// Anti-Spam: Honeypot-Field (display:none, muss leer bleiben)
// Rate Limiting: Max 3 Submissions per IP/Stunde (serverseitig)

// DSGVO-Cookie-Banner: Lighthouse-Score nicht beeinflussen
// Einbinden NACH user-interaction oder nach 3s delay
```

**Performance-Budget (Kontaktseite):**
```
Total Page Weight: < 800KB
Time to Interactive: < 3s auf 4G
Formular-Felder: Native HTML5, kein Framework nötig
Kalender-Widget: Nur bei Bedarf geladen (nicht im Critical Path)
```

---

## Globale Implementierungs-Checkliste

### Core Web Vitals Targets
```
LCP (Largest Contentful Paint): < 2.0s
FID (First Input Delay): < 50ms
CLS (Cumulative Layout Shift): < 0.05
INP (Interaction to Next Paint): < 150ms
```

### Accessibility (WCAG 2.1 AA)
```
☐ Alle Bilder haben aussagekräftige Alt-Texte
☐ Farbkontraste: min. 4.5:1 (Text auf Hintergrund)
☐ Keyboard-Navigation vollständig funktional
☐ Focus-States sichtbar und konsistent
☐ ARIA-Labels auf allen interaktiven Elementen
☐ Keine Information nur durch Farbe kommuniziert
☐ Motion-Reduktion: @media (prefers-reduced-motion: reduce)
☐ Screen-Reader-Tests mit NVDA/VoiceOver
```

### SEO-Technical-Grundlagen
```
☐ Meta-Titles: 50-60 Zeichen, Keyword vorne
☐ Meta-Descriptions: 150-160 Zeichen, CTA enthalten
☐ H1: Einmalig pro Seite, Haupt-Keyword
☐ Schema.org: Organization, LocalBusiness, FAQPage, Review
☐ OG-Tags für Social Sharing
☐ Canonical-URLs gesetzt
☐ robots.txt und sitemap.xml vorhanden
☐ HTTPS überall (kein Mixed Content)
☐ Hreflang falls mehrsprachig
```

### Mobile-Optimierung
```
☐ Viewport-Meta-Tag korrekt gesetzt
☐ Tap-Targets: min. 44x44px
☐ Kein horizontales Scrollen
☐ Schriftgröße: min. 16px für Body (verhindert iOS-Zoom)
☐ CTAs auf Mobile: Full-Width oder min. 280px
☐ Telefonnummern klickbar (tel: Links)
☐ Sticky CTA-Bar auf Mobile (wenn Hero nicht sichtbar)
```

### Analytics & Tracking
```
☐ Google Analytics 4 implementiert
☐ Google Search Console verifiziert
☐ GTM für Event-Tracking eingerichtet
☐ Conversion-Ziele definiert (Formular-Submit, Tel-Click, etc.)
☐ Heatmap-Tool (Hotjar/Microsoft Clarity) aktiv
☐ A/B-Testing-Framework vorbereitet (für CTAs)
☐ Core Web Vitals Monitoring (PageSpeed Insights API)
```

---

## Strategie-Zusammenfassung

### Die 5 wichtigsten Erfolgs-Hebel dieser Website

**1. ROI-Fokus in jeder Zeile**
Jede Headline, jeder Body-Text kommuniziert messbaren Nutzen. Nicht "schöne Websites", sondern "+340% Anfragen", "ROI in 90 Tagen", "Seite 1 Google". Zahlen überzeugen Unternehmer mehr als Adjektive.

**2. Vertrauen durch Spezifität**
Vage Versprechen werden durch konkrete Zahlen, echte Namen, verifizierbare Case Studies ersetzt. Jedes Testimonial hat: Name, Unternehmen, Branche, konkrete Zahl. Das macht den Unterschied zwischen "Glaubwürdig" und "Verdächtig".

**3. Nischen-Positionierung als Wettbewerbsvorteil**
Die Branchen-Pills und branchenspezifischen Case Studies signalisieren: "Wir kennen Ihr Geschäft." Das senkt die wahrgenommene Hürde der Kontaktaufnahme massiv.

**4. Technologische Führerschaft als Differenzierung**
Der KI-Service-Block und die Erwähnung von Lighthouse-Scores, Core Web Vitals und modernen Tech-Stacks positioniert die Agentur als technisch überlegen — ohne den KMU-Kunden zu überfordern.

**5. Jede Sektion hat einen Ausgang**
Kein Besucher soll je in einer Sackgasse landen. Jeder Abschnitt endet mit einem sinnvollen nächsten Schritt — sei es ein CTA, ein Link zu einer Case Study oder ein Kalender-Widget. Der Weg zum Lead ist immer nur einen Klick entfernt.

---

*Dokument-Ende | Version 1.0 | Für interne Verwendung und Kunden-Präsentation*
