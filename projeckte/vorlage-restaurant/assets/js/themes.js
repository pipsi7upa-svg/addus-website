/* ============================================
   THEME DATA — All 4 business types
   ============================================ */

var THEMES = {

    /* ─── RESTAURANT ─── */
    restaurant: {
        colors: {
            primary: '#B8704A',
            primaryDark: '#9C5B38',
            accent: '#C9A96E',
            cream: '#FAF6F1',
            warmWhite: '#FFF9F3',
            sand: '#E8DFD4',
            dark: '#1A1816',
            charcoal: '#2C2826'
        },
        fonts: {
            display: "'Cormorant Garamond', Georgia, serif",
            body: "'Inter', sans-serif"
        },
        logo: { icon: 'LT', text: 'La Tavola' },
        hero: {
            img: 'https://images.pexels.com/photos/29109683/pexels-photo-29109683.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            sub: 'Ristorante & Bar',
            title: 'La Tavola',
            desc: 'Wo Tradition auf Leidenschaft trifft.<br>Seit 1998 im Herzen der Stadt.',
            cta1: 'Speisekarte',
            cta2: 'Reservieren',
            address: 'Musterstraße 12, Lüneburg',
            hours: 'Di – So, 11:30 – 23:00'
        },
        about: {
            img1: 'https://images.pexels.com/photos/8629081/pexels-photo-8629081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            img2: 'https://images.pexels.com/photos/13499008/pexels-photo-13499008.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            badgeNum: '25+', badgeText: 'Jahre Erfahrung',
            label: 'Unsere Philosophie',
            title: 'Kochen mit Herz<br>& besten Zutaten',
            p1: 'Jedes Gericht erzählt eine Geschichte. Wir verwenden ausschließlich frische, saisonale Zutaten von regionalen Erzeugern — und verbinden sie mit Rezepten, die seit Generationen in unserer Familie weitergegeben werden.',
            p2: 'Unsere Küche ist ehrlich, ohne Schnickschnack, aber mit viel Liebe zum Detail. Vom handgemachten Nudelteig bis zur langsam geschmorten Sauce — bei uns schmeckt man den Unterschied.',
            stat1: { num: '100%', label: 'Frische Zutaten' },
            stat2: { num: '50+', label: 'Gerichte' },
            stat3: { num: '12k+', label: 'Zufriedene Gäste' }
        },
        features: [
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', title: 'Handgemachte Pasta', desc: 'Täglich frisch nach traditionellen Familienrezepten aus der Emilia-Romagna.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M8 2h8l4 10H4L8 2z"/><path d="M12 12v6"/><path d="M8 22h8"/><path d="M7 18h10"/></svg>', title: 'Erlesene Weine', desc: 'Über 80 Weine aus Italien, Frankreich und Deutschland.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>', title: 'Private Events', desc: 'Von der Familienfeier bis zum Firmen-Dinner.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>', title: 'Herzliche Gastgeber', desc: 'Bei uns sind Sie nicht nur Gast — Sie sind Teil der Familie.' }
        ],
        menu: {
            label: 'Unsere Küche',
            title: 'Ausgewählte Gerichte',
            ctaText: 'Komplette Speisekarte (PDF)',
            tabs: [
                { id: 'tab1', label: 'Antipasti' },
                { id: 'tab2', label: 'Primi Piatti' },
                { id: 'tab3', label: 'Secondi' },
                { id: 'tab4', label: 'Dolci' }
            ],
            panels: {
                tab1: [
                    { img: 'https://images.pexels.com/photos/4870431/pexels-photo-4870431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Bruschetta Classica', price: '€8,90', desc: 'Geröstetes Ciabatta mit marinierten Tomaten, Basilikum und Olivenöl.', tag: 'Klassiker' },
                    { img: 'https://images.pexels.com/photos/1639559/pexels-photo-1639559.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Carpaccio di Manzo', price: '€14,50', desc: 'Hauchdünn geschnittenes Rinderfilet mit Rucola und Trüffelöl.', tag: 'Empfehlung' },
                    { img: 'https://images.pexels.com/photos/24289165/pexels-photo-24289165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Burrata con Pesto', price: '€12,90', desc: 'Cremige Burrata auf Basilikum-Pesto mit Kirschtomaten.', tag: 'Vegetarisch' }
                ],
                tab2: [
                    { img: 'https://images.pexels.com/photos/23947763/pexels-photo-23947763.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Tagliatelle al Ragù', price: '€16,90', desc: 'Frische Eiernudeln mit 8h geschmortem Ragù.', tag: 'Hausspezialität' },
                    { img: 'https://images.pexels.com/photos/29220390/pexels-photo-29220390.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Risotto ai Funghi', price: '€18,50', desc: 'Cremiges Risotto mit Steinpilzen und Pecorino.', tag: 'Saisonal' },
                    { img: 'https://images.pexels.com/photos/15671273/pexels-photo-15671273.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Ravioli Ricotta e Spinaci', price: '€15,90', desc: 'Handgemachte Ravioli in Salbeibutter.', tag: 'Vegetarisch' }
                ],
                tab3: [
                    { name: 'Saltimbocca alla Romana', price: '€24,90', desc: 'Kalbsschnitzel mit Salbei und Parmaschinken.' },
                    { name: 'Branzino al Forno', price: '€26,50', desc: 'Im Ofen gebackener Wolfsbarsch mit Zitrone.' },
                    { name: 'Ossobuco alla Milanese', price: '€28,90', desc: 'Geschmorte Kalbshaxe mit Gremolata.', tag: 'Empfehlung' }
                ],
                tab4: [
                    { name: 'Tiramisù della Casa', price: '€9,50', desc: 'Locker, cremig, mit echtem Espresso.', tag: 'Bestseller' },
                    { name: 'Panna Cotta', price: '€8,90', desc: 'Vanille-Panna-Cotta mit Waldbeeren-Sauce.' },
                    { name: 'Affogato al Caffè', price: '€6,50', desc: 'Vanilleeis mit doppeltem Espresso.' }
                ]
            }
        },
        parallax: {
            img: 'https://images.pexels.com/photos/10135116/pexels-photo-10135116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            quote: '&bdquo;Das Geheimnis guter Küche liegt nicht in komplizierten Rezepten — sondern in der Liebe, mit der man kocht.&ldquo;',
            cite: '— Marco, Küchenchef & Inhaber'
        },
        gallery: [
            { img: 'https://images.pexels.com/photos/32568165/pexels-photo-32568165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Unser Gastraum', wide: true },
            { img: 'https://images.pexels.com/photos/4870431/pexels-photo-4870431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Frische Zutaten' },
            { img: 'https://images.pexels.com/photos/14833624/pexels-photo-14833624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Küche in Aktion' },
            { img: 'https://images.pexels.com/photos/30787468/pexels-photo-30787468.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Abendstimmung' },
            { img: 'https://images.pexels.com/photos/1639559/pexels-photo-1639559.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Kreative Küche', wide: true }
        ],
        testimonials: [
            { text: '&bdquo;Die beste Pasta außerhalb Italiens. Die Tagliatelle al Ragù sind ein Traum!&ldquo;', name: 'Stefan M.', initials: 'SM', source: 'Google' },
            { text: '&bdquo;Perfekter Abend! Aufmerksamer Service, exquisites Essen. Unser neuer Lieblingsitaliener.&ldquo;', name: 'Katrin & Lars', initials: 'KL', source: 'Google' },
            { text: '&bdquo;Familiäre Atmosphäre, ehrliche Küche und eine Weinkarte die keine Wünsche offen lässt.&ldquo;', name: 'Julia R.', initials: 'JR', source: 'TripAdvisor' }
        ],
        contact: {
            hours: 'Di – Do: 11:30 – 22:00<br>Fr – Sa: 11:30 – 23:00<br>So: 12:00 – 21:00<br>Mo: Ruhetag',
            formTitle: 'Tisch reservieren',
            submitText: 'Reservierung anfragen'
        },
        footer: {
            tagline: 'Ristorante & Bar — seit 1998',
            hours: 'Di – Do: 11:30 – 22:00<br>Fr – Sa: 11:30 – 23:00<br>So: 12:00 – 21:00'
        },
        navCta: 'Reservieren'
    },

    /* ─── IMBISS ─── */
    imbiss: {
        colors: {
            primary: '#D4451A',
            primaryDark: '#B8380F',
            accent: '#F5A623',
            cream: '#FFFAF5',
            warmWhite: '#FFF7EE',
            sand: '#F0E4D4',
            dark: '#1C1410',
            charcoal: '#2D2219'
        },
        fonts: {
            display: "'Space Grotesk', sans-serif",
            body: "'Inter', sans-serif"
        },
        logo: { icon: 'SB', text: 'Street Bites' },
        hero: {
            img: 'https://images.pexels.com/photos/28760169/pexels-photo-28760169.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            sub: 'Street Food & Grill',
            title: 'Street Bites',
            desc: 'Ehrliches Street Food — frisch, schnell, unfassbar lecker.<br>Dein Lieblingsimbiss in der Stadt.',
            cta1: 'Unsere Karte',
            cta2: 'Jetzt bestellen',
            address: 'Marktplatz 5, Lüneburg',
            hours: 'Mo – Sa, 11:00 – 22:00'
        },
        about: {
            img1: 'https://images.pexels.com/photos/28760171/pexels-photo-28760171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            img2: 'https://images.pexels.com/photos/27668672/pexels-photo-27668672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            badgeNum: '#1', badgeText: 'in Lüneburg',
            label: 'Wer wir sind',
            title: 'Frisch vom Grill<br>auf die Hand',
            p1: 'Bei Street Bites gibt es keine Kompromisse: Jeder Burger wird frisch gegrillt, jede Sauce ist hausgemacht und unsere Pommes werden täglich von Hand geschnitten. Punkt.',
            p2: 'Wir sind keine Kette — wir sind dein Laden um die Ecke. Mit Leidenschaft fürs Handwerk und dem besten Fleisch von regionalen Metzgern.',
            stat1: { num: '100%', label: 'Frisch gegrillt' },
            stat2: { num: '15+', label: 'Burger-Varianten' },
            stat3: { num: '8k+', label: 'Bewertungen' }
        },
        features: [
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', title: 'Schnell & Frisch', desc: 'Fertig in unter 10 Minuten — ohne Abstriche bei der Qualität.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', title: 'Alles Hausgemacht', desc: 'Saucen, Patties, Brötchen — alles frisch und selbst gemacht.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>', title: 'Offene Küche', desc: 'Sieh zu, wie dein Essen vor deinen Augen zubereitet wird.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>', title: 'Online Bestellen', desc: 'Bestelle bequem vor und hol dein Essen fertig ab.' }
        ],
        menu: {
            label: 'Unsere Karte',
            title: 'Das gibt\'s bei uns',
            ctaText: 'Komplette Karte ansehen',
            tabs: [
                { id: 'tab1', label: 'Burger' },
                { id: 'tab2', label: 'Döner & Wraps' },
                { id: 'tab3', label: 'Beilagen' },
                { id: 'tab4', label: 'Getränke' }
            ],
            panels: {
                tab1: [
                    { img: 'https://images.pexels.com/photos/28760169/pexels-photo-28760169.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Classic Smash Burger', price: '€7,90', desc: 'Double Smash Patty, Cheddar, Zwiebeln, Burger-Sauce, Brioche Bun.', tag: 'Bestseller' },
                    { img: 'https://images.pexels.com/photos/28760172/pexels-photo-28760172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'BBQ Bacon Burger', price: '€9,90', desc: 'Angus-Patty, knuspriger Bacon, BBQ-Sauce, Jalapeños.', tag: 'Scharf' },
                    { img: 'https://images.pexels.com/photos/28760164/pexels-photo-28760164.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Veggie Crunch', price: '€8,50', desc: 'Knuspriges Gemüse-Patty, Avocado, Sriracha-Mayo.', tag: 'Vegetarisch' }
                ],
                tab2: [
                    { img: 'https://images.pexels.com/photos/32801356/pexels-photo-32801356.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Döner Classic', price: '€6,90', desc: 'Frisch geschnittenes Drehspießfleisch, Salat, Sauce, hausgemachtes Brot.', tag: 'Klassiker' },
                    { img: 'https://images.pexels.com/photos/32801357/pexels-photo-32801357.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Chicken Wrap', price: '€7,50', desc: 'Gegrilltes Hähnchen, Rucola, Tomaten, Knoblauch-Joghurt.', tag: 'Beliebt' },
                    { img: 'https://images.pexels.com/photos/27668672/pexels-photo-27668672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Falafel Teller', price: '€8,90', desc: 'Hausgemachte Falafel, Hummus, Taboulé, Fladenbrot.', tag: 'Vegan' }
                ],
                tab3: [
                    { name: 'Handcut Pommes', price: '€3,90', desc: 'Täglich frisch geschnitten, knusprig frittiert.' },
                    { name: 'Loaded Fries', price: '€6,50', desc: 'Pommes mit Cheddar, Bacon, Jalapeños und Sour Cream.', tag: 'Beliebt' },
                    { name: 'Chicken Wings (6 Stk.)', price: '€7,90', desc: 'Mariniert, knusprig, mit Buffalo oder BBQ Sauce.' }
                ],
                tab4: [
                    { name: 'Hausgemachte Limonade', price: '€3,50', desc: 'Zitrone-Minze oder Mango-Maracuja.' },
                    { name: 'Craft Beer (0,33l)', price: '€4,50', desc: 'Wechselnde Sorten von lokalen Brauereien.' },
                    { name: 'Ayran', price: '€2,50', desc: 'Erfrischend, hausgemacht.' }
                ]
            }
        },
        parallax: {
            img: 'https://images.pexels.com/photos/28760171/pexels-photo-28760171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            quote: '&bdquo;Gutes Essen muss nicht teuer sein — aber es muss mit Liebe gemacht werden.&ldquo;',
            cite: '— Ali, Gründer von Street Bites'
        },
        gallery: [
            { img: 'https://images.pexels.com/photos/28760169/pexels-photo-28760169.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Smash Burger', wide: true },
            { img: 'https://images.pexels.com/photos/32801356/pexels-photo-32801356.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Döner Classic' },
            { img: 'https://images.pexels.com/photos/28760172/pexels-photo-28760172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'BBQ Burger' },
            { img: 'https://images.pexels.com/photos/27668672/pexels-photo-27668672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Falafel Teller' },
            { img: 'https://images.pexels.com/photos/28760164/pexels-photo-28760164.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Frisch & Knusprig', wide: true }
        ],
        testimonials: [
            { text: '&bdquo;Bester Smash Burger in Lüneburg — keine Diskussion. Die Handcut Pommes sind auch der Hammer!&ldquo;', name: 'Markus K.', initials: 'MK', source: 'Google' },
            { text: '&bdquo;Endlich ein Imbiss wo alles frisch ist. Man sieht wie alles zubereitet wird. Top Qualität!&ldquo;', name: 'Sarah L.', initials: 'SL', source: 'Google' },
            { text: '&bdquo;Schnell, lecker, fair. Die Loaded Fries allein sind schon einen Besuch wert.&ldquo;', name: 'Tim B.', initials: 'TB', source: 'Lieferando' }
        ],
        contact: {
            hours: 'Mo – Sa: 11:00 – 22:00<br>So: 12:00 – 21:00',
            formTitle: 'Vorbestellen',
            submitText: 'Bestellung aufgeben'
        },
        footer: {
            tagline: 'Street Food & Grill — frisch seit 2020',
            hours: 'Mo – Sa: 11:00 – 22:00<br>So: 12:00 – 21:00'
        },
        navCta: 'Bestellen'
    },

    /* ─── BAKLAVA / SÜßWAREN ─── */
    baklava: {
        colors: {
            primary: '#8B6914',
            primaryDark: '#73570F',
            accent: '#D4A843',
            cream: '#FDF9F0',
            warmWhite: '#FFFCF5',
            sand: '#EDE4D0',
            dark: '#1A1608',
            charcoal: '#2D2810'
        },
        fonts: {
            display: "'Playfair Display', Georgia, serif",
            body: "'Inter', sans-serif"
        },
        logo: { icon: 'ZG', text: 'Zum Goldenen' },
        hero: {
            img: 'https://images.pexels.com/photos/33317234/pexels-photo-33317234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            sub: 'Feinste orientalische Süßwaren',
            title: 'Zum Goldenen',
            desc: 'Handgemachte Baklava & orientalische Patisserie.<br>Tradition trifft auf Genuss.',
            cta1: 'Unsere Süßwaren',
            cta2: 'Geschenkbox bestellen',
            address: 'Altstadt-Gasse 8, Lüneburg',
            hours: 'Mo – Sa, 09:00 – 19:00'
        },
        about: {
            img1: 'https://images.pexels.com/photos/8635161/pexels-photo-8635161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            img2: 'https://images.pexels.com/photos/10038707/pexels-photo-10038707.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            badgeNum: '3.', badgeText: 'Generation',
            label: 'Unsere Geschichte',
            title: 'Süße Kunst<br>seit Generationen',
            p1: 'Unsere Baklava wird nach einem Familienrezept hergestellt, das seit drei Generationen weitergegeben wird. Jedes Stück wird von Hand gerollt, Schicht für Schicht, mit echtem Butterschmalz und frischen Pistazien.',
            p2: 'Wir verwenden keine künstlichen Aromen oder Konservierungsstoffe. Nur die besten Nüsse, reiner Blütenhonig und feinster Filoteig — so schmeckt echte Handwerkskunst.',
            stat1: { num: '100%', label: 'Handgemacht' },
            stat2: { num: '30+', label: 'Süße Sorten' },
            stat3: { num: '5k+', label: 'Geschenkboxen/Jahr' }
        },
        features: [
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>', title: 'Mit Liebe gemacht', desc: 'Jedes Stück wird von Hand gefertigt — mit Geduld und Hingabe.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', title: 'Premium-Zutaten', desc: 'Iranische Pistazien, türkischer Honig, frische Walnüsse.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>', title: 'Geschenkboxen', desc: 'Elegant verpackt für jeden Anlass — perfekt zum Verschenken.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>', title: 'Catering & Events', desc: 'Süße Platten für Hochzeiten, Feiern und Firmenmeetings.' }
        ],
        menu: {
            label: 'Unsere Spezialitäten',
            title: 'Orientalische Süßkunst',
            ctaText: 'Geschenkbox zusammenstellen',
            tabs: [
                { id: 'tab1', label: 'Baklava' },
                { id: 'tab2', label: 'Künefe & Warm' },
                { id: 'tab3', label: 'Gebäck' },
                { id: 'tab4', label: 'Getränke' }
            ],
            panels: {
                tab1: [
                    { img: 'https://images.pexels.com/photos/33317234/pexels-photo-33317234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Pistazie Baklava', price: '€3,50/Stk.', desc: '40 Schichten Filoteig, echtes Butterschmalz, iranische Pistazien.', tag: 'Bestseller' },
                    { img: 'https://images.pexels.com/photos/8635161/pexels-photo-8635161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Walnuss Baklava', price: '€2,90/Stk.', desc: 'Knusprig-süß mit frischen Walnüssen und Blütenhonig.', tag: 'Klassiker' },
                    { img: 'https://images.pexels.com/photos/18543473/pexels-photo-18543473.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Burma Kadayıf', price: '€3,20/Stk.', desc: 'Gerollte Kadayıf-Fäden mit Pistazien-Füllung.', tag: 'Spezialität' }
                ],
                tab2: [
                    { img: 'https://images.pexels.com/photos/16557595/pexels-photo-16557595.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Künefe', price: '€8,90', desc: 'Knuspriger Kadayıf mit geschmolzenem Käse und Zuckersirup. Warm serviert.', tag: 'Muss man probieren' },
                    { img: 'https://images.pexels.com/photos/16557600/pexels-photo-16557600.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Sütlaç', price: '€5,50', desc: 'Traditioneller türkischer Milchreis, im Ofen karamellisiert.', tag: 'Beliebt' },
                    { img: 'https://images.pexels.com/photos/31472830/pexels-photo-31472830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Tulumba', price: '€4,90/6 Stk.', desc: 'Frittiertes Spritzgebäck in Zuckersirup getränkt.' }
                ],
                tab3: [
                    { name: 'Maamoul', price: '€2,50/Stk.', desc: 'Buttermürbes Gebäck mit Dattel- oder Walnussfüllung.' },
                    { name: 'Lokum (Turkish Delight)', price: '€12,90/Box', desc: 'Rosenwasser, Pistazie, Granatapfel — gemischte Box.', tag: 'Geschenk-Tipp' },
                    { name: 'Şöbiyet', price: '€3,90/Stk.', desc: 'Knuspriger Blätterteig mit Sahne und Pistazien.' }
                ],
                tab4: [
                    { name: 'Türkischer Mokka', price: '€3,50', desc: 'Im Kupferkännchen traditionell zubereitet.' },
                    { name: 'Çay (Schwarztee)', price: '€2,50', desc: 'Türkischer Schwarztee im Tulpenglas.' },
                    { name: 'Ayran', price: '€2,90', desc: 'Erfrischend, leicht gesalzen, hausgemacht.' }
                ]
            }
        },
        parallax: {
            img: 'https://images.pexels.com/photos/10038707/pexels-photo-10038707.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            quote: '&bdquo;Jede Schicht erzählt von Geduld, jeder Bissen von Tradition. Süßes ist unsere Sprache der Gastfreundschaft.&ldquo;',
            cite: '— Familienrezept, dritte Generation'
        },
        gallery: [
            { img: 'https://images.pexels.com/photos/33317234/pexels-photo-33317234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Frische Baklava', wide: true },
            { img: 'https://images.pexels.com/photos/16557595/pexels-photo-16557595.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Warme Künefe' },
            { img: 'https://images.pexels.com/photos/29696186/pexels-photo-29696186.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Unsere Auslage' },
            { img: 'https://images.pexels.com/photos/18543473/pexels-photo-18543473.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Handarbeit' },
            { img: 'https://images.pexels.com/photos/8635161/pexels-photo-8635161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Geschenkboxen', wide: true }
        ],
        testimonials: [
            { text: '&bdquo;Die beste Baklava die ich je gegessen habe — und ich komme aus Istanbul! Knusprig, nicht zu süß, perfekt.&ldquo;', name: 'Elif A.', initials: 'EA', source: 'Google' },
            { text: '&bdquo;Wir bestellen regelmäßig Geschenkboxen für unsere Kunden. Die Qualität ist immer herausragend.&ldquo;', name: 'Hamburg Events GmbH', initials: 'HE', source: 'Google' },
            { text: '&bdquo;Die Künefe ist ein Traum. Warm, knusprig, mit dem perfekten Käse-Fäden-Verhältnis. Suchtgefahr!&ldquo;', name: 'Mira S.', initials: 'MS', source: 'Instagram' }
        ],
        contact: {
            hours: 'Mo – Fr: 09:00 – 19:00<br>Sa: 09:00 – 18:00<br>So: 10:00 – 16:00',
            formTitle: 'Bestellung aufgeben',
            submitText: 'Bestellung senden'
        },
        footer: {
            tagline: 'Orientalische Patisserie — seit 3 Generationen',
            hours: 'Mo – Fr: 09:00 – 19:00<br>Sa: 09:00 – 18:00<br>So: 10:00 – 16:00'
        },
        navCta: 'Bestellen'
    },

    /* ─── CAFÉ ─── */
    cafe: {
        colors: {
            primary: '#5C7A5C',
            primaryDark: '#4A664A',
            accent: '#A8886E',
            cream: '#F8F6F2',
            warmWhite: '#FDFCF8',
            sand: '#E6DFD5',
            dark: '#191A17',
            charcoal: '#2A2C26'
        },
        fonts: {
            display: "'Cormorant Garamond', Georgia, serif",
            body: "'Inter', sans-serif"
        },
        logo: { icon: 'KB', text: 'Kaffeeblüte' },
        hero: {
            img: 'https://images.pexels.com/photos/2251756/pexels-photo-2251756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            sub: 'Specialty Coffee & Kuchen',
            title: 'Kaffeeblüte',
            desc: 'Handgebrühter Specialty Coffee & hausgebackener Kuchen.<br>Dein Ruhepol in der Stadt.',
            cta1: 'Unsere Karte',
            cta2: 'Platz reservieren',
            address: 'Gartenstraße 3, Lüneburg',
            hours: 'Mo – So, 08:00 – 18:00'
        },
        about: {
            img1: 'https://images.pexels.com/photos/171346/pexels-photo-171346.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            img2: 'https://images.pexels.com/photos/162886/coffee-glass-beverage-coffee-mug-162886.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            badgeNum: '100%', badgeText: 'Specialty',
            label: 'Unsere Leidenschaft',
            title: 'Kaffee ist<br>unsere Kunst',
            p1: 'Wir rösten unsere Bohnen selbst — in kleinen Chargen, langsam und schonend. Jeder Ursprung hat seinen eigenen Charakter, den wir in jeder Tasse herausarbeiten.',
            p2: 'Dazu servieren wir täglich frisch gebackene Kuchen, Tartes und Gebäck. Alles aus der eigenen Backstube, mit saisonalen Zutaten und ohne künstliche Zusätze.',
            stat1: { num: '12+', label: 'Kaffeesorten' },
            stat2: { num: '100%', label: 'Eigene Röstung' },
            stat3: { num: '4.9', label: 'Google Bewertung' }
        },
        features: [
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', title: 'Eigene Rösterei', desc: 'Kleine Chargen, schonende Trommelröstung für bestes Aroma.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', title: 'Hausgemachte Kuchen', desc: 'Täglich frisch — Tartes, Cheesecake, Zimtschnecken und mehr.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', title: 'Gemütliches Ambiente', desc: 'Vintage-Möbel, Pflanzen, natürliches Licht — dein zweites Wohnzimmer.' },
            { icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>', title: 'Coworking-freundlich', desc: 'Kostenloses WLAN, Steckdosen und eine ruhige Arbeitsatmosphäre.' }
        ],
        menu: {
            label: 'Unsere Karte',
            title: 'Kaffee & Genuss',
            ctaText: 'Komplette Karte ansehen',
            tabs: [
                { id: 'tab1', label: 'Kaffee' },
                { id: 'tab2', label: 'Kuchen & Gebäck' },
                { id: 'tab3', label: 'Frühstück' },
                { id: 'tab4', label: 'Kalt & Erfrischend' }
            ],
            panels: {
                tab1: [
                    { img: 'https://images.pexels.com/photos/171346/pexels-photo-171346.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Flat White', price: '€4,20', desc: 'Doppelter Espresso mit samtig aufgeschäumter Milch.', tag: 'Bestseller' },
                    { img: 'https://images.pexels.com/photos/31386559/pexels-photo-31386559.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Pour Over', price: '€4,90', desc: 'Handgebrüht, single origin, wechselnde Röstung.', tag: 'Specialty' },
                    { img: 'https://images.pexels.com/photos/162886/coffee-glass-beverage-coffee-mug-162886.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Cappuccino', price: '€3,80', desc: 'Klassisch mit Latte Art — unser Dauerbrenner.', tag: 'Klassiker' }
                ],
                tab2: [
                    { img: 'https://images.pexels.com/photos/29696186/pexels-photo-29696186.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'New York Cheesecake', price: '€5,20', desc: 'Cremig, mit Beerenspiegel und Sahne.', tag: 'Beliebt' },
                    { img: 'https://images.pexels.com/photos/32459865/pexels-photo-32459865.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Zimtschnecke', price: '€3,90', desc: 'Warm, soft, mit Cream Cheese Glasur.', tag: 'Frisch gebacken' },
                    { img: 'https://images.pexels.com/photos/14363849/pexels-photo-14363849.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', name: 'Tarte au Citron', price: '€5,50', desc: 'Französische Zitronentarte mit Baiser.', tag: 'Saisonal' }
                ],
                tab3: [
                    { name: 'Avocado Toast', price: '€9,90', desc: 'Sauerteigbrot, Avocado, pochiertes Ei, Chili-Flocken.', tag: 'Beliebt' },
                    { name: 'Granola Bowl', price: '€8,50', desc: 'Hausgemachtes Granola, Joghurt, saisonales Obst.' },
                    { name: 'French Toast', price: '€10,90', desc: 'Brioche, Ahornsirup, Beeren und Mascarpone.' }
                ],
                tab4: [
                    { name: 'Cold Brew', price: '€4,50', desc: '24 Stunden kalt extrahiert. Smooth und aromatisch.' },
                    { name: 'Matcha Latte', price: '€4,90', desc: 'Bio-Matcha aus Japan mit Hafer- oder Kuhmilch.' },
                    { name: 'Hausgemachte Limo', price: '€3,90', desc: 'Holunderblüte, Zitrone-Ingwer oder Rhabarber.' }
                ]
            }
        },
        parallax: {
            img: 'https://images.pexels.com/photos/2251756/pexels-photo-2251756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            quote: '&bdquo;Kaffee ist mehr als ein Getränk — es ist ein Moment der Ruhe in einer lauten Welt.&ldquo;',
            cite: '— Lisa, Gründerin & Rösterin'
        },
        gallery: [
            { img: 'https://images.pexels.com/photos/2251756/pexels-photo-2251756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Unser Café', wide: true },
            { img: 'https://images.pexels.com/photos/171346/pexels-photo-171346.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Latte Art' },
            { img: 'https://images.pexels.com/photos/29696186/pexels-photo-29696186.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Kuchen-Auswahl' },
            { img: 'https://images.pexels.com/photos/31386559/pexels-photo-31386559.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Pour Over' },
            { img: 'https://images.pexels.com/photos/162886/coffee-glass-beverage-coffee-mug-162886.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', caption: 'Gemütliche Ecken', wide: true }
        ],
        testimonials: [
            { text: '&bdquo;Der beste Kaffee in der ganzen Stadt. Die eigene Röstung schmeckt man — smooth und komplex zugleich.&ldquo;', name: 'Anna W.', initials: 'AW', source: 'Google' },
            { text: '&bdquo;Mein zweites Wohnzimmer! Gemütlich, tolles WLAN, und der Cheesecake ist der Wahnsinn.&ldquo;', name: 'Felix D.', initials: 'FD', source: 'Google' },
            { text: '&bdquo;Wir haben hier unsere Hochzeitstorte bestellen lassen. Unglaublich lecker und wunderschön dekoriert.&ldquo;', name: 'Nina & Tobias', initials: 'NT', source: 'Instagram' }
        ],
        contact: {
            hours: 'Mo – Fr: 08:00 – 18:00<br>Sa – So: 09:00 – 18:00',
            formTitle: 'Platz reservieren',
            submitText: 'Reservierung senden'
        },
        footer: {
            tagline: 'Specialty Coffee & Kuchen — seit 2019',
            hours: 'Mo – Fr: 08:00 – 18:00<br>Sa – So: 09:00 – 18:00'
        },
        navCta: 'Reservieren'
    }
};
