# Animavidi Brand Guide

> Permanente bron van waarheid voor de visuele identiteit en merkuitstraling van Animavidi.

## 1. Merkessentie

Animavidi heeft een **premium safari-uitstraling**: warm, avontuurlijk, verfijnd en respectvol voor natuur en dieren. De identiteit is geïnspireerd op het gouden licht van zonsopkomst, droge savannegrassen, donkere acaciabomen, mineraalrijke aarde en het diepe groen van beschermde natuurgebieden.

De uitstraling mag nooit aanvoelen als een pretpark, tekenfilm of goedkope “jungle”-thematisering. Animavidi is geen verzameling clichés over Afrika, maar een kalm en modern merk dat verwondering, vakmanschap en natuurbehoud uitstraalt.

### Merkbelofte

Animavidi brengt mensen dichter bij de levende wereld door beeld, verhaal en een zorgvuldig ontworpen digitale ervaring.

### Merkkenmerken

- **Filmisch:** krachtige beelden, royaal formaat en doordachte kadrering.
- **Verfijnd:** beheerste typografie, subtiele details en weinig visuele ruis.
- **Warm:** aardse kleuren, menselijk taalgebruik en uitnodigende interacties.
- **Avontuurlijk:** gevoel van ontdekking zonder drukte of spektakel.
- **Betrouwbaar:** heldere informatie, voorspelbare patronen en transparante partnerschappen.
- **Respectvol:** dieren, natuurgebieden, lokale gemeenschappen en culturen worden waardig weergegeven.

## 2. Algemene ontwerpprincipes

Elke toekomstige pagina en component volgt deze principes, in deze volgorde:

1. **Beeld en verhaal leiden.** De interface ondersteunt de inhoud en concurreert er niet mee.
2. **Rust is luxe.** Gebruik minder elementen, meer witruimte en een heldere visuele hiërarchie.
3. **Warmte boven hard contrast.** Gebruik gebroken wit en bijna-zwart in plaats van puur wit en zwart.
4. **Natuurlijk, niet letterlijk.** Ontleen kleur, ritme en textuur aan de natuur; vermijd decoratieve dierenprints en safari-clichés.
5. **Tijdloos boven trendy.** Vermijd overmatig glas-effect, neon, extreme gradients en vluchtige UI-trends.
6. **Toegankelijkheid is onderdeel van het merk.** Streef minimaal naar WCAG 2.2 AA; merkstijl mag nooit leesbaarheid of bediening hinderen.
7. **Eén duidelijke hoofdactie.** Elk scherm heeft maximaal één visueel dominante primaire actie.
8. **Consistentie boven improvisatie.** Gebruik de tokens en patronen uit dit document; introduceer geen bijna-gelijke varianten.

## 3. Kleurenpalet

### 3.1 Primaire kleuren

| Token | Hex | Gebruik |
| --- | --- | --- |
| `savanna-950` | `#17231C` | Donkere achtergronden, premium secties, footer |
| `savanna-900` | `#223128` | Primaire donkere vlakken en navigatie |
| `savanna-700` | `#3D5947` | Secundaire acties, iconen, ondersteunende accenten |
| `gold-600` | `#A66E22` | Kleine accenten en interactieve hover-status |
| `gold-500` | `#C78B36` | Primaire merkaccenten en focusdetails |
| `gold-300` | `#E5BE78` | Accenten op donkere achtergronden |
| `sand-50` | `#FAF7F0` | Standaard pagina-achtergrond |
| `sand-100` | `#F3EBDD` | Afwisselende secties en rustige kaarten |
| `sand-200` | `#E7D8C3` | Borders, separators en subtiele vlakken |
| `ink-950` | `#1B1D1A` | Primaire tekst |
| `ink-700` | `#4C514A` | Secundaire tekst |
| `ink-500` | `#737970` | Metadata en rustige labels |

`savanna-950` en `sand-50` vormen de belangrijkste merkcombinatie. `gold-500` wordt spaarzaam toegepast: goud is een accent, geen standaard achtergrondkleur voor grote oppervlakken.

### 3.2 Functionele kleuren

| Token | Hex | Gebruik |
| --- | --- | --- |
| `success-700` | `#2F6B45` | Bevestiging en positieve status |
| `warning-700` | `#93661F` | Waarschuwingen en aandachtspunten |
| `danger-700` | `#9A3F35` | Fouten en destructieve acties |
| `info-700` | `#35657A` | Informatieve status |

Gebruik functionele kleuren alleen wanneer ze betekenis dragen. Combineer kleur altijd met tekst en, indien passend, een icoon.

### 3.3 Kleurverhoudingen

Hanteer als uitgangspunt:

- 60% lichte zandtinten;
- 25% witruimte en neutrale oppervlakken;
- 10% diepe savannegroenen;
- maximaal 5% goud en functionele accentkleuren.

### 3.4 Contrast en kleurregels

- Gebruik `ink-950` op `sand-50`, `sand-100` en wit.
- Gebruik `sand-50` of wit op `savanna-900` en `savanna-950`.
- Gebruik goud niet voor kleine lopende tekst op lichte achtergronden.
- Plaats tekst op fotografie alleen boven een gecontroleerde donkere overlay.
- Controleer alle definitieve combinaties op minimaal 4,5:1 voor normale tekst en 3:1 voor grote tekst en UI-componenten.
- Puur wit (`#FFFFFF`) is toegestaan voor kaarten en tekst op donkere vlakken, maar niet als dominante pagina-achtergrond.
- Puur zwart (`#000000`) wordt niet gebruikt.

### 3.5 Gradients

Gradients zijn functioneel en subtiel. Toegestane toepassingen:

- Een fotografische overlay van transparant naar `savanna-950` voor leesbare tekst.
- Een zeer lichte overgang van `sand-50` naar `sand-100` in grote atmosferische vlakken.

Gebruik geen regenbooggradients, glanzende goudgradients of decoratieve kleurwolken.

## 4. Typografie

### 4.1 Lettertypefamilies

Animavidi gebruikt twee complementaire families:

- **Display en redactionele koppen:** `Cormorant Garamond`, met fallback `Georgia, 'Times New Roman', serif`.
- **Interface en lopende tekst:** `Inter`, met fallback `system-ui, -apple-system, 'Segoe UI', sans-serif`.

De serif geeft het merk een filmisch en redactioneel karakter. De sans-serif bewaakt helderheid in navigatie, formulieren, knoppen en langere teksten.

Wanneer webfonts worden gebruikt, laad uitsluitend benodigde gewichten en bied altijd fallbacks. Voorkom onzichtbare tekst tijdens het laden.

### 4.2 Typografische schaal

| Stijl | Desktop | Mobiel | Gewicht | Regelhoogte |
| --- | --- | --- | --- | --- |
| Display XL | 72 px | 46 px | 500 serif | 0,98 |
| Display L | 56 px | 40 px | 500 serif | 1,02 |
| Heading 1 | 44 px | 34 px | 500 serif | 1,08 |
| Heading 2 | 34 px | 28 px | 500 serif | 1,15 |
| Heading 3 | 26 px | 23 px | 600 serif | 1,2 |
| Heading 4 | 20 px | 18 px | 650 sans | 1,3 |
| Body L | 18 px | 17 px | 400 sans | 1,65 |
| Body | 16 px | 16 px | 400 sans | 1,6 |
| Body S | 14 px | 14 px | 400 sans | 1,5 |
| Label | 13 px | 13 px | 650 sans | 1,3 |
| Eyebrow | 12 px | 12 px | 700 sans | 1,3 |

Gebruik bij voorkeur responsieve waarden met `clamp()` tussen de mobiele en desktopwaarden.

### 4.3 Typografische regels

- Gebruik maximaal één `h1` per pagina.
- Gebruik serif voor expressieve koppen en citaten, niet voor knoppen of invoervelden.
- Beperk lopende tekst tot ongeveer 60–72 tekens per regel.
- Gebruik normale zinskapitalisatie; geen Title Case voor Nederlandse koppen.
- Eyebrows mogen hoofdletters gebruiken met `0.12em` letterspatiëring.
- Gebruik geen volledig kapitalen voor lange labels of lopende tekst.
- Gebruik maximaal drie lettergewichten per scherm.
- Onderstreep links in lopende tekst; kleur alleen is onvoldoende.
- Vermijd gecentreerde alinea’s langer dan drie regels.
- Weduwen en wezen in grote redactionele koppen moeten waar praktisch worden voorkomen.

## 5. Witruimte en layout

### 5.1 Basiseenheid

De basismaat is **4 px**. Gebruik de volgende vaste ruimteschaal:

| Token | Waarde |
| --- | --- |
| `space-1` | 4 px |
| `space-2` | 8 px |
| `space-3` | 12 px |
| `space-4` | 16 px |
| `space-5` | 24 px |
| `space-6` | 32 px |
| `space-7` | 48 px |
| `space-8` | 64 px |
| `space-9` | 96 px |
| `space-10` | 128 px |

Gebruik geen willekeurige tussenwaarden tenzij een technisch detail dit aantoonbaar vereist.

### 5.2 Pagina-opbouw

- Maximale algemene contentbreedte: **1280 px**.
- Maximale leesbreedte: **720 px**.
- Horizontale paginamarge: 20 px mobiel, 32 px tablet en 48–64 px desktop.
- Verticale sectieruimte: 64–80 px mobiel en 96–128 px desktop.
- Standaard grid: 4 kolommen mobiel, 8 tablet en 12 desktop.
- Grid-gutter: 16 px mobiel, 24 px tablet en 32 px desktop.

Grote fotografische of atmosferische secties mogen schermbreed zijn. Tekst en bediening blijven binnen de contentcontainer.

### 5.3 Compositieregels

- Laat grote beelden en koppen ademen; vul open ruimte niet automatisch op.
- Wissel lichte en donkere secties doelgericht af, niet volgens een rigide zebra-patroon.
- Gebruik asymmetrie voor redactionele composities, maar behoud een helder grid.
- Plaats gerelateerde elementen dicht bij elkaar en scheid verschillende onderwerpen royaal.
- Toon op mobiel altijd de belangrijkste inhoud en actie eerst.

## 6. Afgeronde hoeken

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `radius-sm` | 6 px | Kleine tags, tooltips, compacte controls |
| `radius-md` | 10 px | Invoervelden en standaardknoppen |
| `radius-lg` | 16 px | Kaarten en panelen |
| `radius-xl` | 24 px | Grote beeldkaarten en promotionele blokken |
| `radius-pill` | 999 px | Badges, filters en pill-controls |

Niet elk vlak heeft afgeronde hoeken nodig. Volledig schermbrede secties, fotografie aan de rand van het viewport en structurele containers blijven meestal recht. Gebruik maximaal twee verschillende radiusmaten binnen één componentgroep.

## 7. Schaduwen en diepte

Schaduwen zijn warm, zacht en terughoudend. Ze simuleren natuurlijk licht en mogen nooit zwaar of blauwgrijs ogen.

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `shadow-sm` | `0 1px 2px rgba(23, 35, 28, 0.08)` | Subtiele scheiding |
| `shadow-md` | `0 8px 24px rgba(23, 35, 28, 0.10)` | Zwevende kaarten en menu’s |
| `shadow-lg` | `0 18px 50px rgba(23, 35, 28, 0.14)` | Modals en prominente media |

- Borders hebben de voorkeur boven schaduwen voor standaardkaarten.
- Gebruik slechts één elevatieniveau per oppervlak.
- Vergroot schaduwen niet sterk bij hover; combineer een minimale verschuiving met een subtiele schaduwverandering.
- Gebruik geen gloed, neonrand of harde zwarte slagschaduw.

## 8. Knoppen en interactieve bediening

### 8.1 Algemene vorm

- Minimale hoogte: **48 px** voor standaardknoppen en **40 px** voor compacte bediening.
- Horizontale padding: 20–24 px.
- Hoekradius: `radius-md`.
- Lettertype: sans-serif, 14–16 px, gewicht 650.
- Label is kort, actief en specifiek, bijvoorbeeld “Bekijk de expeditie”.
- De volledige knop heeft een minimaal aanraakvlak van 44 × 44 px.

### 8.2 Primaire knop

- Achtergrond: `savanna-900`.
- Tekst: `sand-50`.
- Hover: `savanna-950` met maximaal 1 px opwaartse verplaatsing.
- Actief: geen verplaatsing; visueel iets donkerder.
- Focus: 2 px ring in `gold-500` met 2 px offset.
- Disabled: duidelijk gedempt, zonder hover-effect; behoud leesbaar label.

Gebruik maximaal één primaire knop per beslisgebied.

### 8.3 Secundaire knop

- Transparante of `sand-50` achtergrond.
- Tekst en border: `savanna-900`.
- Hover: `sand-100`.
- Dezelfde afmetingen en focusbehandeling als de primaire knop.

### 8.4 Tertiaire knop en tekstlink

Tertiaire acties hebben geen container en gebruiken `savanna-900`. Een directioneel icoon mag rechts van het label staan. Tekstlinks in lopende tekst zijn onderstreept; standalone links krijgen bij hover een zichtbare underline of pijlovergang.

### 8.5 Knopregels

- Gebruik geen goudkleurige tekst op een goudkleurige of lichte achtergrond.
- Gebruik geen uitsluitend iconische knop wanneer een tekstlabel praktisch is.
- Iconische knoppen hebben altijd een toegankelijke naam en tooltip waar de betekenis niet universeel is.
- Loading-status behoudt de knopbreedte, voorkomt dubbele activatie en communiceert voortgang.
- Destructieve acties gebruiken de functionele danger-kleur en zijn nooit de standaard primaire stijl.

## 9. Iconen

Iconen zijn helder, organisch en functioneel.

- Gebruik één consistente outline-familie met een lijngewicht van circa 1,75–2 px.
- Standaardmaten: 16, 20 en 24 px; 32 px alleen voor grotere informatieve accenten.
- Lijnuiteinden en hoeken zijn licht afgerond.
- Gebruik geen ingevulde cartooniconen, emoji of een mix van verschillende iconsets.
- Iconen ondersteunen labels; ze vervangen tekst alleen bij algemeen bekende acties.
- Decoratieve iconen zijn verborgen voor hulptechnologie.
- Betekenisvolle iconen hebben een toegankelijke naam of horen bij zichtbare tekst.
- Dier- en natuuriconen worden spaarzaam en anatomisch respectvol gebruikt, nooit als speelse mascotte zonder expliciete merkbeslissing.

## 10. Afbeeldingen en fotografie

### 10.1 Fotografische stijl

Fotografie is het belangrijkste expressieve merkmiddel. Kies beelden met:

- natuurlijk gouden ochtend- of avondlicht;
- aardse, licht gedempte kleuren;
- zichtbare leefomgeving en context;
- rustige compositie met ruimte voor verhaal of typografie;
- authentiek gedrag van wilde dieren;
- documentair gevoel met hoogwaardige, filmische afwerking;
- perspectieven die respect en nabijheid uitstralen zonder dieren te vermenselijken.

### 10.2 Vermijd

- Oververzadigde groenen, oranje filters en kunstmatige HDR.
- Slecht gemonteerde composities of generieke stockfoto-esthetiek.
- Dieren in onnatuurlijke situaties of zichtbaar verstoord gedrag.
- Beelden die onveilige nabijheid, voeren, aanraken of uitbuiting normaliseren.
- Culturele stereotypen, exotisering of mensen als decoratief element.
- Drukke fotocollages en decoratieve dierenprints.

### 10.3 Beeldverhoudingen

- Hero: 16:9, 3:2 of gecontroleerd schermvullend.
- Redactionele kaarten: bij voorkeur 4:3 of 3:2.
- Portretten en verhalen: 4:5.
- Vierkante uitsneden alleen voor compacte lijsten of profielen.

Definieer het brandpunt per afbeelding zodat responsieve uitsneden het onderwerp behouden. Gebruik lazy loading onder de vouw, moderne bestandsformaten en passende resoluties. Reserveer altijd de beeldruimte om layoutverschuiving te voorkomen.

### 10.4 Tekst op beeld

- Plaats tekst alleen in aantoonbaar rustige beeldruimte.
- Gebruik een donkere overlay die doorgaans verloopt van 20% naar 70% `savanna-950`.
- Beperk overlays tot een korte eyebrow, kop, korte introductie en maximaal één hoofdactie.
- Controleer contrast op elke responsieve uitsnede.
- Verplaats tekst naast of onder het beeld wanneer leesbaarheid niet gegarandeerd is.

### 10.5 Rechten en bijschriften

Leg bron, maker, licentie, gebruiksgebied en vervaldatum vast. Vermeld fotograaf of organisatie waar contractueel of redactioneel vereist. Alt-tekst beschrijft relevante inhoud en functie; decoratieve afbeeldingen krijgen lege alt-tekst.

## 11. Logo-gebruik

### 11.1 Hoofdlogo

Het toekomstige hoofdlogo bestaat bij voorkeur uit een verfijnd woordmerk “Animavidi” en eventueel een afzonderlijk, eenvoudig beeldmerk. Totdat goedgekeurde masterbestanden bestaan, mag tekst in de merktypografie niet als definitief logo worden beschouwd.

### 11.2 Goedgekeurde varianten

Zodra assets zijn vastgesteld, zijn uitsluitend deze varianten toegestaan:

- Donker woordmerk op een lichte zand- of witte achtergrond.
- Licht woordmerk op `savanna-900`, `savanna-950` of voldoende donkere fotografie.
- Enkelkleurige variant voor beperkte reproductie.
- Compact beeldmerk voor favicon, app-icoon en kleine vierkante context.

### 11.3 Vrije ruimte en minimummaat

- Vrije ruimte rondom het logo: minimaal de hoogte van de letter “A” uit het woordmerk.
- Minimum digitale breedte woordmerk: 120 px.
- Minimum digitale maat beeldmerk: 24 × 24 px.
- Onder de minimummaat wordt geen woordmerk met onderschrift gebruikt.

### 11.4 Niet toegestaan

- Uitrekken, schuinzetten, roteren of herschikken.
- Andere kleuren, gradients, contouren of slagschaduwen toevoegen.
- Plaatsen op drukke fotografie zonder voldoende contrastvlak.
- Combineren met sponsorlogo’s alsof het één merk is.
- Zelf een alternatieve logo-lockup maken.

## 12. Sponsorvermelding en partnermerken

Sponsor- en partnervermeldingen zijn transparant, waardig en visueel ondergeschikt aan Animavidi.

### 12.1 Taalgebruik

Gebruik een feitelijk label zoals:

- “Mede mogelijk gemaakt door”
- “In samenwerking met”
- “Hoofdpartner”

Gebruik “sponsor” alleen wanneer dit de juridisch en inhoudelijk juiste relatie beschrijft. Maak commerciële inhoud herkenbaar en voorkom verwarring met redactionele aanbevelingen.

### 12.2 Visuele hiërarchie

- Plaats sponsorvermeldingen in een rustige, afzonderlijke zone.
- Animavidi blijft het primaire merk in navigatie en paginahiërarchie.
- Partnerlogo’s staan nooit groter dan het Animavidi-logo in dezelfde context.
- Gebruik bij meerdere partners een neutraal grid met gelijke visuele bounding boxes, niet noodzakelijk gelijke pixelbreedtes.
- Geef elk logo voldoende vrije ruimte en respecteer de merkrichtlijnen van de partner.
- Gebruik bij voorkeur éénkleurige partnerlogo’s wanneer partners dit toestaan en de leesbaarheid behouden blijft.

### 12.3 Achtergronden en interactie

- Gebruik `sand-100`, wit of `savanna-950` als rustige sponsorachtergrond.
- Zorg dat alle logo’s voldoende contrast hebben; plaats indien nodig afzonderlijke neutrale tegels.
- Een partnerlogo mag linken naar de relevante partnerpagina en krijgt een duidelijke toegankelijke naam.
- Voeg geen automatische carrousel, knipperende banner of indringende advertentiestijl toe.

## 13. Animatie en beweging

Beweging voelt als een rustige camerabeweging: doelgericht, natuurlijk en beheerst.

### 13.1 Timing

| Token | Duur | Gebruik |
| --- | --- | --- |
| `motion-fast` | 120–160 ms | Hover, focus en kleine statuswissel |
| `motion-base` | 200–260 ms | Menu, accordion en componenttransitie |
| `motion-slow` | 400–600 ms | Redactionele reveal en grote beeldtransitie |

Standaard easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Gebruik voor afsluiten een iets snellere ease-in, zodat de interface direct reageert.

### 13.2 Toegestane beweging

- Subtiele opacity- en translate-overgangen van maximaal 8–16 px.
- Rustige beeldcrossfades.
- Kleine pijl- of icoonverplaatsing bij hover.
- Gerichte loading-feedback en skeletons zonder pulserende felheid.
- Zeer subtiele parallax uitsluitend wanneer prestaties, toegankelijkheid en leesbaarheid aantoonbaar goed blijven.

### 13.3 Niet toegestaan

- Automatisch bewegende carrousels zonder duidelijke bediening.
- Bounce, elastische effecten, confetti of speelse overshoot als standaardpatroon.
- Grote zoombewegingen, continue zweefanimaties en decoratieve loops.
- Scroll-jacking of animaties die navigatie vertragen.
- Flitsen, snelle strobes of beweging die vestibulaire klachten kan veroorzaken.

### 13.4 Verminderde beweging

Respecteer `prefers-reduced-motion: reduce`. Verwijder niet-essentiële beweging, parallax en automatische overgangen. Functionele statusveranderingen moeten ook zonder animatie begrijpelijk blijven.

## 14. Oppervlakken en componentstijl

### 14.1 Kaarten

- Standaard achtergrond: wit of `sand-100`.
- Radius: `radius-lg`; beeldkaarten mogen `radius-xl` gebruiken.
- Border: 1 px `sand-200` of een zeer subtiele `shadow-sm`, niet beide zonder reden.
- Interne padding: 20–24 px compact, 32 px standaard en 40 px redactioneel.
- Interactieve kaarten hebben een zichtbare focusstatus en maken duidelijk welk deel klikbaar is.

### 14.2 Formuliervelden

- Minimale hoogte: 48 px.
- Achtergrond: wit of transparant op een licht vlak.
- Border: 1 px `sand-200`; actieve border `savanna-700`.
- Focus: 2 px `gold-500` met voldoende offset.
- Labels blijven zichtbaar boven het veld; placeholders vervangen geen label.
- Foutstatus gebruikt tekst plus `danger-700`, niet alleen een rode rand.

### 14.3 Navigatie

- Navigatie is rustig, compact en inhoudelijk duidelijk.
- Actieve items zijn herkenbaar door gewicht, underline of achtergrond, niet alleen kleur.
- Op fotografie krijgt de navigatie voldoende solide of geleidelijke achtergrond voor leesbaarheid.
- Sticky navigatie mag compacter worden tijdens scrollen, zonder storende sprong.

### 14.4 Dividers en borders

Gebruik 1 px `sand-200` op lichte achtergronden en een transparante lichte lijn op donkere achtergronden. Dividers structureren inhoud; ze zijn geen decoratief patroon.

## 15. Patronen, textuur en decoratie

- Toegestaan: zeer subtiele papier-, zand- of filmgraintextuur met lage opacity.
- Toegestaan: abstracte lijnen geïnspireerd op horizon, topografie of routes, mits rustig en origineel.
- Niet toegestaan: luipaard-, zebra- of giraffenprints als algemeen decoratiemiddel.
- Niet toegestaan: clichématige silhouetten van acacia’s, verrekijkers of jeeps zonder inhoudelijke reden.
- Textuur mag tekstcontrast, performance en beeldkwaliteit nooit aantasten.

## 16. Responsieve merkconsistentie

De mobiele ervaring is geen verkleinde desktopversie.

- Behoud de typografische hiërarchie met de mobiele schaal uit dit document.
- Verminder sectieruimte, maar niet tot onder de vastgelegde mobiele waarden.
- Stapel acties logisch; primaire knoppen mogen op smalle schermen volledige breedte krijgen.
- Herkader fotografie rond het vastgelegde brandpunt.
- Beperk overlays op mobiel en plaats langere tekst onder het beeld.
- Verwijder nooit essentiële informatie of sponsortransparantie om ruimte te winnen.

## 17. Schrijfstijl in de interface

- Schrijf helder, rustig en uitnodigend.
- Gebruik actieve zinnen en concrete werkwoorden.
- Vermijd uitroeptekens, superlatieven en kunstmatige urgentie.
- Benoem dieren, locaties en organisaties correct en consequent.
- Vermijd koloniale beeldspraak, exotisering en claims zonder bron.
- Formuleer fouten zonder schuld bij de gebruiker te leggen.
- Knoppen beschrijven de uitkomst: “Lees het verhaal” in plaats van “Meer”.

## 18. Toegankelijkheid en kwaliteit

Elk nieuw scherm wordt vóór oplevering gecontroleerd op:

- kleurcontrast en betekenis zonder kleur;
- toetsenbordbediening en zichtbare focus;
- semantische koppen en toegankelijke namen;
- tekstzoom en responsief gedrag;
- verminderde beweging;
- alt-teksten en beeldrechten;
- realistische lange tekst, lege staten en foutstaten;
- consistente toepassing van kleur-, ruimte-, radius- en typografietokens.

Afwijkingen van deze gids vereisen een vastgelegde, inhoudelijke reden. “Het zag er mooier uit” is onvoldoende zonder onderbouwing vanuit merk, gebruik of toegankelijkheid.

## 19. Beslisregels voor toekomstige schermen

Gebruik bij twijfel deze volgorde:

1. Kies een lichte zandbasis of een diep savannegroen merkvlak.
2. Bouw de hiërarchie met ruimte en typografie voordat kleur of decoratie wordt toegevoegd.
3. Selecteer één sterk hoofdbeeld of laat beeld weg; gebruik geen middelmatige collage.
4. Geef het scherm één primaire actie.
5. Gebruik goud alleen voor een klein, betekenisvol accent.
6. Houd cards, borders, radii en schaduwen terughoudend.
7. Controleer toegankelijkheid en responsiviteit voordat visuele verfijning wordt toegevoegd.
8. Verwijder elk element dat geen inhoudelijke of functionele rol vervult.

## 20. Beheer van deze gids

Dit document heeft voorrang op losse visuele voorbeelden, tijdelijke prototypes en persoonlijke voorkeuren. Nieuwe kleuren, lettertypen, radii, schaduwen, iconstijlen of componentvarianten worden pas onderdeel van Animavidi nadat ze hier zijn vastgelegd.

Bij iedere materiële wijziging worden minimaal genoteerd:

- datum en eigenaar;
- aanleiding en doel;
- gewijzigde tokens of patronen;
- gevolgen voor bestaande schermen en assets;
- benodigde migratie of kwaliteitscontrole.

De Brand Guide blijft in lijn met `Development_Guide.md`, `UX_Guidelines.md` en `Roadmap.md`. Bij conflict gaan toegankelijkheid, veiligheid en duidelijkheid vóór decoratieve merkexpressie.
