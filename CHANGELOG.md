# Changelog

Alle noemenswaardige wijzigingen aan Animavidi worden in dit document
vastgelegd. Dit project volgt [Semantic Versioning](https://semver.org/) en de
structuur van [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

- Added ANI-024 Content Admin V1 with a separate protected admin shell, server-validated single-admin sessions, complete 148-mammal photo management, Cloudflare Worker/R2 upload and removal, dynamic photo coverage/filtering, and central R2-to-packaged-to-neutral image resolution. Status: Visual review pending.
- Added secure Worker configuration and setup documentation for the existing `animavidi-mammal-photos` bucket, exact-origin credentialed CORS, PBKDF2 password hashing, signed HttpOnly cookies, client-side 1600 px WebP preparation, server-side MIME/signature/size validation, local-only Wrangler development and no-secret frontend configuration.
- Added a targeted Content Admin validator covering route protection, 148-species coverage, original 22 packaged photos, known-ID enforcement, auth rejection, upload/delete behavior, file validation, secret isolation and photo-resolution precedence.
- Expanded the Kruger mammal dataset from 22 to the complete 148-species SANParks checklist, preserving all legacy IDs, photographs and detailed profiles while adding recognizable-name sorting, grouped Small Mammals, neutral per-species fallbacks, full picker/detail support and Passport progress out of 148.
- Added a dedicated complete-dataset validator covering totals, unique stable IDs, official scientific names, Main/Small Mammal grouping, all 22 legacy records and images, and distinct Black/White Rhinoceros records.
- Completed all five Big Five medallion reliefs in the approved classical engraving style, using individual etched linework for Lion, Elephant, Leopard, Buffalo and Rhinoceros.
- Restored the redesigned Safari Passport's Journey, Achievements, Species Discovered, Recent Memories, Animals statistic and concrete rank requirements, with working in-page collection navigation.
- Corrected Passport responsiveness so all five Big Five medallions remain in one fluid row without horizontal scrolling, and removed the paw motif from the restrained tone-on-tone Explorer blind stamp.
- Refined the Big Five collection into text-free engraved bronze medallions with layered metal depth, concise labels beneath each collectible, and stronger unseen-versus-discovered material states.
- Replaced the Passport paw badge with a leather-embossed lion emblem and rebuilt all Big Five collectibles as uniform relief medallions with distinct unseen and officially stamped visual states.
- Redesigned the Passport Explorer mark as a restrained vintage ink stamp with irregular rings, authentic wear, classic arc lettering and a simple safari paw motif integrated into the leather cover.
- Rebuilt Safari Passport v2 as a mobile-first luxury leather travel document with a reusable PassportCard, compact 3×2 statistics, rank and Big Five panels, and focused collection navigation while preserving all Passport data and routes.
- Refined the Welcome Screen with taller single-line actions, increased sponsor spacing, and a personal returning-explorer greeting backed by the existing local demo-user state.
- Simplified the Welcome screen to two focused explorer actions, removed the introductory copy and demo shortcut, and gave the cinematic wildlife background more uninterrupted visual space without changing the remaining routes or branding.
- Added Vercel SPA rewrite configuration so every React Router route resolves through `index.html` during direct navigation and browser refreshes; the production script uses Vite's runner config loader for a reproducible sandbox-safe build.
- Added the first-completion-only Big Five achievement celebration with the untouched user-created piano theme, Passport-backed transition detection, persisted sound preference, autoplay fallback and an accessible premium achievement dialog.
- Added an expandable label interaction to the universal Add Sighting FAB: a one-time two-second introduction, hover/focus disclosure, touch-first explanation and second-tap activation, while preserving direct Animal Detail routing and Species Picker behaviour.
- Replaced the generated Add Sighting lion derivative with the supplied final `Button.svg` exactly as delivered, including its original geometry, colours and circular surround; the approved FAB dimensions, position, visibility and behaviour remain unchanged.
- Rebuilt Species Picker V2 as a near-full-height Animavidi field-guide bottom sheet with grouped mammal sections, repository-derived recent species, compact search, independent scrolling and stronger accessible modal separation; the approved FAB and all routes remain unchanged.
- Added one route-aware global Add Sighting FAB across the seven active safari screens, with direct Animal Detail launching and an accessible searchable 22-species picker everywhere else; excluded creation, editing, detail, loading, error and full-screen states.
- Rebuilt Sighting Flow v2 for visual review: New Sighting is now a three-part premium memory capture experience with a truthful saved-record confirmation, while Sighting Detail and Edit use cinematic photography, journal styling and the existing repository-backed data without schema or route changes.
- Completed the final Animal Detail v2 visual-polish pass for user review: strengthened species photography and branding, converted category pills to editorial labels, tightened truthful observation/statistics cards, enriched SVG fact rows, refined recent-sighting cards and removed excess navigation clearance without changing behaviour.
- Rebuilt Animal Detail v2 as one premium data-driven field-guide and safari-journal template for all 22 mammals, with central hero crops, local SVG facts, real IndexedDB-derived observation statistics, recent sighting cards, honest empty/error states and validated mobile-through-desktop navigation clearance.
- Completed and froze the Mammals Overview visual polish: refined the lion hero transition, compacted search controls, standardised Quick Access proportions and category imagery, corrected the Greater Kudu photograph, added central species crop focus, protected the final cards from bottom-navigation overlap and removed the editorial footer sentence.
- Imported the final user-supplied African Buffalo and African Wild Dog WebP assets without processing; all twenty-two demo mammals now use verified, species-specific local photographs across overview, detail and fallback rendering.
- Imported and visually verified seventeen user-supplied final mammal photographs without image processing; twenty of twenty-two demo species now have real local photography, with African Buffalo and African Wild Dog still explicitly missing.
- Added an auditable per-species image asset structure, manifest and validator; connected three verified local photographs and explicitly tracked nineteen missing photographs without presenting placeholders as completed photography.
- Enlarged Mammals Quick Access into a horizontal photographic carousel, increased species imagery to 90–100 px, strengthened category labels and replaced the technical dataset note with editorial collection copy.
- Rebuilt the Mammals Overview presentation to its approved editorial reference with a cinematic Kruger hero, premium search treatment, photographic Quick Access cards and spacious species cards while retaining all existing search, filter and navigation behaviour.
- Rebuilt Kruger Home to its approved v2 cinematic composition with an integrated hero, wildlife statistics, Passport entry, compact editorial navigation tiles, primary safari action and branded sponsor footer.
- Compressed the Kruger introduction's vertical rhythm at mobile viewport heights so its CTA and Other Parks section remain visible without scrolling at 390 × 844 px.
- Rebuilt the Kruger introduction and park-selection screen to match its approved cinematic reference while preserving the existing Demo Mode entry route and Kruger production flow.
- Refined the Demo Mode Welcome screen with more cinematic image treatment, premium button materials, tighter typography and calmer interaction feedback without changing its behaviour.

### Changed

- Welcome Page in Demo Mode visueel gepolijst voor 390 px: hogere leeuwencompositie, sterkere leesbaarheidsgradient, compacte 64 px-acties, 24 px-hoekradius en nieuwe lokale kompas-, verrekijker- en oogiconen volgens de goedgekeurde specificatie.
- Curated Demo Mode toegevoegd: nieuwe en terugkerende ontdekkingsreizigers gebruiken zonder authenticatie dezelfde lokale demo-identiteit en alleen afgeronde productroutes blijven bereikbaar.
- Oude login-, account-, onboarding- en placeholderroutes redirecten naar de actuele demo-flow; onbekende of verborgen functies tonen uitsluitend “Available in the full version”.
- Park Map gebruikt nu standaard de afzonderlijke, door de gebruiker aangepaste Kruger-prototype-SVG met onafhankelijke React-overlays, lokale pan/zoom en uitsluitend aantoonbaar geplaatste camps en gates.
- Willekeurige demo-POI's en verzonnen posities voor My Sightings zijn verwijderd; waarnemingen zonder coördinaten verschijnen in een aparte unplaced tray.
- Kruger vector-mapbron voorbereid als beperkt intern prototype; de bestaande Park Map-interface en routes blijven ongewijzigd.
- Alle drie Welcome-acties gebruiken nu uitsluitend de productieflow: Location/Account of Login openen direct het huidige Safari Passport en vervolgen naar het huidige Kruger Home; oude onboarding-Passport-routes redirecten veilig.
- De laatste zichtbare `/demo`-bestemming voor Park Information gebruikt nu een productie-URL.
- Safari Passport structure rebuilt to match `docs/designs/06-passport.png`, including a landscape leather cover, local SVG Explorer stamp and icons, premium statistics and rank panels, collectible Big Five stamps, passport-spread sections and editorial memories.
- Park Map is functionally approved with visual redesign deferred; Safari Passport is now the active roadmap task.
- Alle zichtbare Park Map-bestemmingen openen nu `/parks/kruger/map`; My Sightings is Demo Approved en Park Map is de actieve roadmaptaak.
- Alle zichtbare My Sightings-bestemmingen openen nu het lokale Kruger-safarijournaal.
- Animal Detail combineert voortaan de demo-status met duurzaam lokaal opgeslagen waarnemingen.
- De Mammal-detailplaceholder is vervangen door een volledige lokale soortpresentatie met demo-waarnemingsstatus.
- De Mammals-kaart op Kruger Home opent nu de echte route `/parks/kruger/mammals`.

- Kruger Home visueel verfijnd volgens de goedgekeurde referentie, met warmere hero-compositie, duidelijkere statistieken en ruimere editorial navigatiekaarten.
- De demoactie op de Welcome Page en de eindactie van zowel de nieuwe als terugkerende onboarding-flow openen nu rechtstreeks `/parks/kruger`.
- Welcome Page nauwkeurig herbouwd op basis van de goedgekeurde mobiele referentie `docs/designs/01-welcome.png`, met een afzonderlijke toegankelijke interface en lokale leeuwenfotografie.
- `AppLogo` uitgebreid met een vaste gedetailleerde lockup die later zonder layoutwijziging door het definitieve logo-asset kan worden vervangen.
- Park Selection-scherm herbouwd volgens `docs/designs/02-park-selection.png`, met behoud van de transparante GPS-demo en bestaande handmatige parkselectie.
- Handmatige parkselectie verplaatst naar `/onboarding/location?mode=manual`; het hoofdscherm bevat nu alleen de goedgekeurde keuzes, privacytekst en compacte sponsorvermelding.
- Mobiele Welcome Page verfijnd voor 320â€“430 px: actiecopy kan volledig afbreken, kaartafstand volgt de referentie en de sponsorzone heeft ruimere verticale ademruimte.

### Added

- Centrale Demo Mode-configuratie, demo-entryroute en premium full-version-melding voor bewust verborgen functionaliteit.
- Herbruikbare vector-mapcomponenten voor viewport, overlaylagen, markers, bediening, filters, bottom sheet en prototype-/navigatiedisclaimers.
- Getypeerde visuele prototypecoördinaten voor twaalf camps en negen entry gates, plus architectuurtypen voor toekomstige geverifieerde sightingcoördinaten.
- Ongewijzigde Kruger-masterbron met checksum, reproduceerbare SVG-voorbereiding, gedeelde kaartuitsnede, toegankelijke bronlabel-lagen, getypeerd manifest, beperkingsdocumentatie en validatiepreviews. Niet-bewijsbare boundary-, wegen- en rivierlagen zijn bewust leeg gebleven.
- Complete offline Kruger Park Information feature sourced from `Park Map.pdf`, with monthly gate times, camp search, emergency contacts, rules, safety guidance, safari tips and history timeline.
- Complete lazy-loaded Safari Passport with repository-derived statistics, rank progression, Big Five stamps, journey, species collection, achievements, recent memories and privacy-safe sharing.
- Central typed Passport aggregation, demo-profile, Explorer Rank thresholds and achievement criteria.
- Interactieve, lazy-loaded Kruger Park Map met een sleutelvrije illustratieve Leaflet-laag, filters, bediening, legenda, disclaimer en mobiele detailsheet.
- Typed kaartconfiguratie, duidelijk gelabelde representatieve markers en integratie van lokaal opgeslagen My Sightings.
- Volledige My Sightings-ervaring met samenvatting, filters, sortering, journal cards, detailweergave, bewerken en bevestigde verwijdering.
- Typed IndexedDB-repositorymethoden voor ophalen, tellen, wijzigen en verwijderen van duurzame lokale sightings.
- Volledige New Sighting-flow met toegankelijke invoervelden, lokale fotovoorvertoning en soortspecifieke copy.
- Typed IndexedDB-repository voor duurzame lokale waarnemingen en foto-Blobs zonder backend of synchronisatie.
- Premium Animal Detail-pagina met zeven informatiesecties, Seen-status, waarnemingsteller en compacte sponsor- en ondernavigatie.
- Tijdelijke werkende Add Sighting-route per diersoort.
- Responsive Kruger Mammals-pagina met directe aliaszoekfunctie, vijf Quick Access-filters, alfabetische resultaten en herstel van filter-, zoek- en scrollstatus.
- Typed lokale dataset met 22 representatieve Kruger-soorten en uitbreidbare categorieën en aliassen.
- Werkende tijdelijke detailroute `/parks/kruger/mammals/:animalId`.

- Complete responsive onboarding-flow voor nieuwe en terugkerende safari’s.
- Handmatige locatiekeuze en transparante GPS-placeholder zonder browser- of netwerkrequest.
- Frontendformulieren voor accountaanmaak en login zonder opslag of authenticatieprovider.
- Safari Passport-introductie en afrondingsscherm.
- Herbruikbare `Button`, `FormField` en `OnboardingLayout`-componenten.
- Flow-afhankelijke, toegankelijke voortgangsindicatie.
- Herbruikbare, toetsenbordtoegankelijke `ParkChoiceCard` voor locatiekeuzes.
- Herbruikbare compacte `SponsorFooter` voor subtiele partnervermelding.

## [0.1.0] - 2026-08-02

### Added

- Productieklaar fundament met React 19, TypeScript en Vite.
- Responsive Welcome Page met premium safari-uitstraling.
- Herbruikbare `AppLogo`, `ActionLink` en `PlaceholderPage`-componenten.
- React Router-routes voor een eerste safari, een bestaande safari en de demo.
- Klikbare sponsorvermelding voor LuxurySafariHomes.com.
- Tijdelijke full-screen Unsplash-placeholder voor de hero-afbeelding.
- Centrale kleuren-, typografie-, spacing-, radius- en motiontokens.
- Cloudflare Pages-headers en SPA-redirects.
- Permanente Brand Guide, UX Guidelines, Development Guide en Roadmap.
- GitHub-voorbereiding met MIT License en uitgebreide ignore-regels.

### Changed

- Vite gebruikt een expliciete projectroot voor consistente lokale en
  CI-uitvoering.
- Projectdocumentatie beschrijft de installatie-, build- en releaseworkflow.
