# Animavidi UX Guidelines

> Permanente bron van waarheid voor de gebruikerservaring, informatiearchitectuur en interactiepatronen van Animavidi.

## 1. Doel en reikwijdte

Dit document bepaalt hoe Animavidi op elk scherm werkt en aanvoelt. Het geldt voor publieke pagina’s, navigatie, onboarding, zoeken en filteren, formulieren, media, accountfuncties, systeemstatussen en toekomstige productflows.

De richtlijnen beschrijven een compleet UX-systeem, maar keuren geen specifieke functie uit de Roadmap automatisch goed. Functionaliteit wordt pas gebouwd wanneer de productbehoefte en scope zijn vastgesteld.

De `Brand_Guide.md` bepaalt de visuele identiteit. Deze UX Guidelines vertalen die identiteit naar gedrag:

- **premium** betekent rustig, zorgvuldig en voorspelbaar;
- **safari** betekent ontdekken, context en verwondering, nooit themaparkclichés;
- **filmisch** betekent dat beeld en verhaal ruimte krijgen zonder bediening te verbergen;
- **respectvol** betekent waardige representatie, transparante bronnen en geen manipulatieve patronen;
- **toegankelijk** betekent minimaal WCAG 2.2 niveau AA als productvereiste.

Bij conflict gaan veiligheid, toegankelijkheid, duidelijkheid en gebruikerscontrole vóór visuele expressie.

## 2. Kernprincipes van de ervaring

### 2.1 Rust is functioneel

Toon alleen wat nodig is voor het huidige begrip of de huidige taak. Gebruik witruimte, typografie en volgorde om hiërarchie te maken. Voeg geen kaarten, badges, iconen of animaties toe om lege ruimte te vullen.

### 2.2 Ontdekken zonder verdwalen

Animavidi mag nieuwsgierigheid opwekken, maar gebruikers weten altijd:

- waar ze zijn;
- wat ze hier kunnen doen;
- wat de primaire vervolgstap is;
- hoe ze teruggaan of de flow verlaten;
- wat er met hun invoer of gegevens gebeurt.

### 2.3 Eén duidelijke hoofdactie

Elk scherm en elk beslisgebied heeft maximaal één visueel dominante primaire actie. Secundaire en tertiaire acties blijven herkenbaar maar concurreren niet.

### 2.4 Verhaal en inhoud leiden

De interface ondersteunt fotografie, video, tekst en context. Bediening blijft vindbaar en toegankelijk, maar wordt niet decoratief dominant. Belangrijke informatie mag nooit uitsluitend in beeld, audio of animatie bestaan.

### 2.5 Gebruikers houden controle

Automatische acties zijn beperkt. Gebruikers kunnen pauzeren, teruggaan, annuleren en waar mogelijk herstellen. De app gebruikt geen dark patterns, verborgen gevolgen, vooraangevinkte toestemming of kunstmatige urgentie.

### 2.6 Consistentie is vertrouwen

Dezelfde actie heeft overal dezelfde naam, visuele stijl en uitkomst. Nieuwe interactiepatronen worden alleen toegevoegd wanneer bestaande patronen het probleem niet oplossen.

### 2.7 Progressieve complexiteit

Begin met de essentie. Plaats verdieping achter duidelijke keuzes zoals “Lees verder”, filters, accordions of detailpagina’s. Verberg geen noodzakelijke informatie achter hover, swipe of onduidelijke iconen.

## 3. Informatiearchitectuur

### 3.1 Structuurprincipes

- Organiseer de app rond gebruikersdoelen en herkenbare onderwerpen, niet rond interne systemen.
- Geef elk inhoudelijk hoofdonderwerp een unieke, stabiele URL zodra routing bestaat.
- Houd navigatieniveaus ondiep; streef naar maximaal drie betekenisvolle niveaus.
- Gebruik één vaste term per concept en beheer terminologie in de Brand Guide.
- Voorkom dubbele routes naar inhoud wanneer dat oriëntatie, SEO of analytics vertroebelt.
- Elke pagina heeft een eigenaar, doel, primaire doelgroep en gewenste vervolgstap.

### 3.2 Paginasoorten

Toekomstige schermen vallen bij voorkeur in één van deze patronen:

1. **Ontdekkingspagina:** inspireert en biedt duidelijke ingangen naar onderwerpen.
2. **Overzichtspagina:** maakt zoeken, vergelijken, filteren of browsen mogelijk.
3. **Detailpagina:** vertelt één volledig verhaal over een dier, locatie, productie of onderwerp.
4. **Taakpagina:** ondersteunt één concrete handeling, zoals aanmelden of voorkeuren beheren.
5. **Systeempagina:** behandelt foutstatus, lege inhoud, onderhoud of ontbrekende pagina’s.

Combineer patronen alleen wanneer de primaire bedoeling duidelijk blijft.

### 3.3 Metadata en context

Toon relevante context op een vaste plek, bijvoorbeeld locatie, datum, duur, soort content, bron of partner. Metadata ondersteunt begrip en staat niet als decoratieve verzameling badges rond de titel.

## 4. Globale navigatie

### 4.1 Hoofdnavigatie

- Plaats het Animavidi-logo links en laat het naar de startpagina leiden.
- Toon maximaal vijf tot zeven primaire navigatie-items op desktop.
- Gebruik korte, concrete labels van bij voorkeur één of twee woorden.
- Markeer de actuele sectie met meer dan kleur alleen, bijvoorbeeld gewicht en underline.
- Gebruik links voor navigatie en knoppen voor acties.
- Houd een eventuele account- of primaire productactie visueel gescheiden van inhoudsnavigatie.
- Laat sponsorlogo’s nooit onderdeel lijken van de hoofdnavigatie.

De header mag transparant boven een hero starten wanneer leesbaarheid gegarandeerd is. Zodra de pagina scrollt, krijgt deze een solide `sand-50`- of `savanna-950`-achtergrond zonder zichtbare layoutsprong.

### 4.2 Desktopmenu’s

- Open dropdowns op click; hover mag ondersteunen maar is nooit vereist.
- Houd eenvoudige menu’s één kolom breed.
- Gebruik een megamenu alleen bij aantoonbaar complexe informatiearchitectuur.
- De menu-trigger toont open/dicht-status aan hulptechnologie.
- Escape sluit het menu en herstelt focus naar de trigger.
- Click of focus buiten het menu sluit het zonder onverwacht contextverlies.

### 4.3 Mobiele navigatie

- Gebruik een duidelijke menuknop met tekst of toegankelijke naam.
- Open navigatie als volledig of bijna volledig schermvlak; vermijd smalle, moeilijk bedienbare zijpanelen.
- Behoud het logo en een zichtbare sluitknop bovenaan.
- Toon primaire items eerst en secundaire links daarna.
- Vergrendel achtergrondscroll zolang het menu open is.
- Plaats focus in het menu, houd focus daarbinnen en herstel focus bij sluiten.
- Gebruik accordions alleen voor echte subnavigatie; maak hoofdniveaus afzonderlijk navigeerbaar waar relevant.
- Ondersteun systeem-terug op mobiel om eerst het menu of de overlay te sluiten.

### 4.4 Breadcrumbs

Gebruik breadcrumbs op hiërarchische detailpagina’s, niet op de startpagina of eenvoudige taakflows. Toon minimaal het bovenliggende niveau en de huidige context. Op smalle schermen mag de huidige paginanaam worden weggelaten wanneer de `h1` direct volgt.

### 4.5 Footer

De footer biedt consistente toegang tot secundaire navigatie, contact, toegankelijkheid, privacy, voorwaarden en relevante partnerinformatie. Gebruik de donkere `savanna-950`-stijl uit de Brand Guide. De footer is informatief en rustig, geen tweede hoofdnavigatie.

## 5. Schermopbouw

### 5.1 Semantische basis

Elk scherm bevat in logische volgorde:

1. skiplink;
2. globale header en navigatie;
3. één uniek `main`-gebied;
4. één `h1` die het scherm benoemt;
5. inhoud in een logische koppenstructuur;
6. globale footer waar passend.

Modals en tijdelijke overlays veranderen deze structuur niet en krijgen correcte dialoogsemantiek.

### 5.2 Standaard pagina-anatomie

Een standaard inhoudspagina bestaat uit:

- optionele breadcrumb of eyebrow;
- paginatitel;
- korte introductie van maximaal twee tot vier regels;
- eventuele primaire actie;
- hoofdinhoud in duidelijke secties;
- relevante vervolgstappen;
- bron-, partner- of sponsorvermelding waar vereist.

Gebruik de maximale contentbreedte van 1280 px en leesbreedte van circa 720 px uit de Brand Guide. Verticale sectieruimte is 64–80 px op mobiel en 96–128 px op desktop.

### 5.3 Hero’s

- Een hero introduceert het paginaonderwerp en bevat geen volledige applicatieflow.
- Toon maximaal één eyebrow, één kop, een korte introductie en één primaire actie.
- Plaats langere tekst onder of naast het beeld.
- Gebruik tekst op beeld alleen met de gecontroleerde `savanna-950`-overlay uit de Brand Guide.
- Zorg dat het onderwerp bij responsieve uitsneden zichtbaar blijft.
- Een videohero speelt niet automatisch met geluid en heeft zichtbare bediening.

### 5.4 Overzichten en grids

- Plaats zoeken en filters vóór de resultaten.
- Toon resultaatomvang en actieve filters in tekst.
- Gebruik consistente kaartverhoudingen en metadata.
- Behoud dezelfde leesvolgorde in DOM en visuele layout.
- Laat pagination, “meer laden” of oneindig scrollen afhangen van het gebruiksdoel; kies niet automatisch oneindig scrollen.
- Wanneer gebruikers terugkeren uit een detailpagina, herstel waar haalbaar scrollpositie en filterstatus.

### 5.5 Detailpagina’s

- Begin met identiteit en kerncontext, niet met promotie.
- Gebruik hoogwaardige fotografie als inhoud, met alt-tekst, bron en bijschrift waar relevant.
- Groepeer feiten en verhalen; presenteer geen lange reeks losse kaarten.
- Gebruik een sticky inhoudsopgave alleen bij lange pagina’s en houd deze toetsenbordtoegankelijk.
- Eindig met één inhoudelijk relevante vervolgstap, niet met een willekeurige carrousel.

### 5.6 Taakpagina’s

- Verwijder afleidende navigatie alleen wanneer de taak echt lineair en gevoelig is.
- Toon doel, voortgang en mogelijkheid tot annuleren.
- Vraag per stap alleen wat nodig is.
- Bewaar geldige invoer bij teruggaan of herstellen van fouten.
- Bevestig expliciet wanneer de taak is afgerond en wat er daarna gebeurt.

## 6. Responsief ontwerp en mobiele bediening

### 6.1 Mobile first

Ontwerp eerst voor een smal viewport en schaal daarna op basis van inhoud, niet op basis van apparaatnamen. De mobiele ervaring behoudt alle essentiële inhoud, transparantie en functionaliteit.

### 6.2 Aanraakbediening

- Minimale interactieve maat: 44 × 44 px; standaardknoppen zijn minimaal 48 px hoog.
- Houd minimaal 8 px effectieve ruimte tussen afzonderlijke touch targets.
- Plaats primaire mobiele acties binnen comfortabel duimbereik wanneer dit de taak ondersteunt.
- Gebruik geen hover-afhankelijke informatie of bediening.
- Gebruik swipen alleen als aanvullende bediening; bied altijd zichtbare knoppen of links.
- Voorkom acties direct aan schermranden wanneer systeemgebaren ermee kunnen conflicteren.
- Respecteer safe-area-insets op apparaten met uitsparingen.

### 6.3 Sticky mobiele acties

Een sticky actiebalk is toegestaan bij een langdurige taak of belangrijke beslissing. Deze:

- bevat maximaal één primaire en één secundaire actie;
- bedekt geen inhoud, foutmelding of browserbediening;
- houdt rekening met toetsenbord en safe-area;
- verdwijnt niet uitsluitend door scrollrichting;
- wordt niet gebruikt als permanente advertentiebanner.

### 6.4 Mobiele formulieren

- Gebruik passende invoertypen en `inputmode` voor toetsenbordkeuze.
- Laat de pagina niet onverwacht inzoomen bij focus; gebruik minimaal 16 px invoertekst.
- Scroll het eerste foutieve veld gecontroleerd in beeld zonder de context te verbergen.
- Houd submitbediening bereikbaar wanneer het schermtoetsenbord open is.
- Splits een formulier alleen in stappen wanneer dit aantoonbaar begrip of voltooiing verbetert.

### 6.5 Oriëntatie en zoom

Ondersteun portret en landschap waar de inhoud dit toelaat. Blokkeer oriëntatie of browserzoom nooit. De app blijft bruikbaar bij 200% browserzoom en tekstvergroting volgens WCAG-eisen.

## 7. Onboarding

### 7.1 Wanneer onboarding nodig is

Gebruik onboarding alleen wanneer gebruikers zonder uitleg geen kernwaarde kunnen bereiken, expliciete toestemming moeten geven of essentiële voorkeuren moeten instellen. Een begrijpelijke interface heeft geen rondleiding nodig.

### 7.2 Onboardingprincipes

- Laat eerst waarde en context zien; vraag daarna om gegevens of toestemming.
- Houd de eerste ervaring kort en taakgericht.
- Toon voortgang bij meerdere stappen, bijvoorbeeld “Stap 2 van 4”.
- Maak overslaan mogelijk voor niet-essentiële stappen.
- Leg uit waarom informatie nodig is en hoe deze wordt gebruikt.
- Vraag notificaties, locatie of tracking pas op het relevante moment.
- Gebruik geen vooraf geselecteerde marketingtoestemming.
- Bewaar voortgang alleen wanneer dat veilig en verwacht is.
- Bied instellingen later opnieuw aan; onboarding is geen eenmalige val.

### 7.3 Welkomstscherm

Een welkomstscherm bevat:

- een korte merkbelofte;
- maximaal één sterk beeld volgens de Brand Guide;
- één primaire actie om te beginnen;
- een duidelijke route voor bestaande gebruikers indien accounts bestaan;
- geen carrousel met meerdere marketingdia’s.

### 7.4 Personalisatie

Vraag alleen voorkeuren die direct zichtbaar voordeel geven. Maak duidelijk dat voorkeuren later wijzigbaar zijn. Label aanbevolen keuzes als aanbeveling, niet als standaard die instemming suggereert.

### 7.5 Afronding

Bevestig wat is ingesteld, welke gegevens zijn opgeslagen en wat de logische volgende stap is. Vermijd feestanimaties; gebruik de beheerste succesfeedback en beweging uit de Brand Guide.

## 8. Interactiepatronen

### 8.1 Links en knoppen

- Links navigeren; knoppen voeren acties uit.
- Knoplabels benoemen de uitkomst: “Sla voorkeuren op” in plaats van “OK”.
- Gebruik maximaal één primaire knop per beslisgebied.
- Volg voor maat, radius, kleur, focus en status exact de Brand Guide.
- Open externe links alleen in een nieuw tabblad wanneer contextbehoud noodzakelijk is en maak dit kenbaar.

### 8.2 Kaarten

- Maak een hele kaart alleen klikbaar wanneer deze één bestemming heeft.
- Geneste interactieve elementen binnen een volledig klikbare kaart zijn niet toegestaan.
- Kop, beeld en eventuele pijl communiceren dezelfde bestemming.
- Hover en focus mogen maximaal een subtiele translate van 1 px en `shadow-sm` gebruiken.
- Kaarten zijn inhoudscontainers, geen standaardoplossing voor elke sectie.

### 8.3 Accordions

- Gebruik accordions voor aanvullende, zelfstandige informatie.
- Laat de trigger de volledige rij beslaan.
- Toon open/dicht-status visueel en via `aria-expanded`.
- Ondersteun Enter en spatie.
- Houd essentiële beslisinformatie buiten een standaard gesloten accordion.
- Gebruik niet meer dan één genest niveau.

### 8.4 Tabs

- Gebruik tabs voor gelijkwaardige weergaven binnen dezelfde context.
- Gebruik tabs niet als vervanging voor hoofdnavigatie of een proces in stappen.
- Activeer tabs met pijltjestoetsen volgens het gekozen ARIA-patroon.
- Op mobiel mogen tabs horizontaal scrollen mits de actieve tab zichtbaar blijft en de scrollrichting duidelijk is.
- Geef deelbare inhoud een URL wanneer dit gebruikers helpt.

### 8.5 Modals en dialogs

Gebruik een modal alleen voor een korte, contextgebonden beslissing of taak. Gebruik een volledige pagina voor lange formulieren, complexe uitleg of deelbare inhoud.

- Geef elke dialog een titel.
- Verplaats focus bij openen en herstel focus bij sluiten.
- Houd toetsenbordfocus binnen de dialog.
- Escape sluit niet-destructieve dialogs.
- Bied een zichtbare sluitknop.
- Voorkom achtergrondscroll.
- Plaats destructieve bevestiging niet op dezelfde positie en stijl als een gebruikelijke veilige actie.

### 8.6 Tooltips en popovers

- Tooltips verduidelijken korte labels; zij bevatten geen essentiële of interactieve inhoud.
- Toon tooltips op hover én focus en laat ze met Escape sluiten.
- Popovers met bediening zijn toetsenbordtoegankelijk en sluiten voorspelbaar.
- Gebruik op touch geen informatie die uitsluitend via lang indrukken bereikbaar is.

### 8.7 Carrousels

Vermijd carrousels wanneer een grid of redactionele volgorde duidelijker is. Indien noodzakelijk:

- speel niet automatisch af;
- toon vorige/volgende bediening en positie;
- ondersteun toetsenbord en touch zonder swipe te vereisen;
- pauzeer beweging bij interactie;
- maak slide-inhoud semantisch begrijpelijk;
- toon sponsorinhoud nooit als onduidelijke redactionele slide.

### 8.8 Filters en sorteren

- Toon de meest gebruikte filters direct en aanvullende filters progressief.
- Geef actieve filters weer als tekst of chips met afzonderlijke verwijderactie.
- Bied “Wis alle filters” wanneer meerdere filters actief kunnen zijn.
- Werk resultaataantal en URL bij waar passend.
- Op mobiel opent een uitgebreid filterpaneel als toegankelijke sheet of pagina met duidelijke toepas- en herstelacties.
- Sorteeropties benoemen concreet wat eerst komt.

### 8.9 Zoeken

- Gebruik een zichtbaar label of duidelijke toegankelijke naam.
- Start zoeken na expliciete invoer of gebruik een rustige debounce; voorkom verzoeken per toetsaanslag zonder noodzaak.
- Toon de zoekterm en het aantal resultaten.
- Geef suggesties met toetsenbordbediening en correcte combobox-semantiek.
- Maak “geen resultaten” behulpzaam met spellingcontrole, filterherstel of alternatieven.
- Verwijder de zoekterm nooit onverwacht.

## 9. Formulieren

### 9.1 Algemene regels

- Vraag alleen gegevens die nodig zijn voor het verklaarde doel.
- Rangschik velden in de volgorde waarin gebruikers erover denken.
- Gebruik één kolom voor primaire invoer; zet alleen sterk gerelateerde korte velden naast elkaar.
- Plaats labels permanent boven het veld.
- Gebruik placeholders uitsluitend als voorbeeld, nooit als label.
- Markeer optionele velden met “optioneel”; vermijd een overvloed aan sterretjes.
- Geef vereisten vóór invoer, niet pas na een fout.
- Ondersteun browser-autofill, wachtwoordmanagers en kopiëren/plakken.
- Vraag invoer niet dubbel als deze betrouwbaar kan worden bevestigd of getoond.

### 9.2 Veldtypen

- Gebruik native controls waar mogelijk.
- Gebruik radio’s voor één keuze uit een kleine zichtbare set.
- Gebruik checkboxes voor onafhankelijke keuzes.
- Gebruik een select voor een middelgrote vaste lijst; bied zoeken bij lange lijsten.
- Gebruik een toggle uitsluitend voor een instelling die direct aan of uit gaat, niet voor toestemmingsbevestiging.
- Gebruik datum- en tijdinvoer passend bij locale en taak; accepteer verschillende geldige invoerformaten waar haalbaar.
- Gebruik tekstareas voor langere vrije invoer en toon een tekenlimiet alleen wanneer deze werkelijk bestaat.

### 9.3 Validatie

- Valideer formaat na blur of wanneer de gebruiker verdergaat, niet bij elke onvolledige toetsaanslag.
- Toon servervalidatie naast het relevante veld én in een foutoverzicht bij langere formulieren.
- Behoud alle geldige invoer na een fout.
- Plaats focus bij submit op het foutoverzicht; links daarin brengen focus naar het veld.
- Schrijf specifiek: “Vul een geldig e-mailadres in” in plaats van “Ongeldige invoer”.
- Leg complexe eisen uit en toon welke eis nog niet is behaald.
- Gebruik `danger-700`, tekst en een icoon; kleur alleen is onvoldoende.

### 9.4 Verzenden

- Voorkom dubbele verzending na activatie.
- Behoud knopbreedte tijdens loading en gebruik een duidelijk werkwoord met voortgang, bijvoorbeeld “Wordt opgeslagen…”.
- Schakel het hele formulier niet onnodig uit.
- Geef na succes een duidelijke bevestiging en vervolgstap.
- Als verwerking lang duurt, geef aan dat de gebruiker veilig kan vertrekken en hoe de status later terug te vinden is.

### 9.5 Meerstapsformulieren

- Gebruik stappen voor inhoudelijk onderscheidbare delen, niet om een kort formulier langer te laten lijken.
- Toon huidige stap en totaal aantal stappen.
- Laat teruggaan toe zonder gegevensverlies.
- Vat belangrijke keuzes samen vóór definitieve verzending.
- Maak duidelijk op welk moment iets definitief wordt opgeslagen, aangevraagd of gedeeld.

### 9.6 Privacy en toestemming

- Plaats privacyuitleg op het moment van verzamelen.
- Splits noodzakelijke verwerking en optionele marketingtoestemming.
- Gebruik geen vooraangevinkte optionele toestemming.
- Maak intrekken even eenvoudig als geven.
- Link naar volledige voorwaarden zonder de kernuitleg daar te verbergen.

## 10. Feedback, meldingen en foutafhandeling

### 10.1 Schrijfstructuur van fouten

Elke foutmelding beantwoordt waar mogelijk:

1. Wat ging er mis?
2. Wat is wel veilig gebleven?
3. Wat kan de gebruiker nu doen?

Gebruik kalme, blame-free taal. Toon geen stacktraces, interne codes of technische details als primaire boodschap. Een ondersteuningscode mag als secundaire informatie verschijnen wanneer die daadwerkelijk helpt.

### 10.2 Inline fouten

Gebruik bij een veld of lokale actie een inline melding direct bij de bron. Verwijder de melding zodra het probleem aantoonbaar is opgelost, zonder de gebruiker te laten raden.

### 10.3 Formulierfouten

Bij meerdere fouten verschijnt boven het formulier een toegankelijk foutoverzicht met links naar de relevante velden. Houd veldmeldingen daarnaast zichtbaar.

### 10.4 Banners

Gebruik een banner voor pagina- of systeembrede informatie. Een banner:

- heeft een duidelijke titel en korte uitleg;
- gebruikt functionele kleur plus icoon en tekst;
- bevat alleen een sluitknop als wegklikken veilig is;
- verschijnt op een vaste, voorspelbare plek;
- wordt niet gebruikt voor commerciële promotie.

### 10.5 Toasts

Toasts zijn alleen geschikt voor korte, niet-kritieke bevestiging zoals “Opgeslagen”.

- Verdwijn niet sneller dan gebruikers de tekst kunnen lezen.
- Pauzeer bij hover en focus.
- Bied undo wanneer de actie herstelbaar is.
- Gebruik geen toast voor fouten die een actie vereisen.
- Laat kritieke informatie persistent op de relevante pagina staan.

### 10.6 Bevestigingsdialogs

Vraag bevestiging alleen bij moeilijk herstelbare of onverwachte gevolgen. Benoem het concrete object en gevolg. De veilige actie krijgt normale nadruk; de destructieve actie gebruikt de danger-stijl en een specifiek label, bijvoorbeeld “Verwijder opgeslagen reis”.

### 10.7 404, 403 en systeemfouten

- **404:** leg uit dat de inhoud niet is gevonden en bied start, zoeken of relevante hoofdroutes.
- **403:** leg uit dat toegang ontbreekt en hoe de juiste toegang verkregen kan worden.
- **500 of onbekend:** erken het probleem, behoud eventueel ingevoerde gegevens en bied opnieuw proberen of contact.
- **Offline:** meld verbindingsverlies, toon welke inhoud nog beschikbaar is en probeer niet onbeperkt stil opnieuw.

Gebruik passende merkfotografie alleen wanneer deze de boodschap ondersteunt; maak fouten nooit luchtig ten koste van duidelijkheid.

## 11. Systeemstatussen

Elke data-afhankelijke ervaring ontwerpt vooraf:

- initiële loading;
- achtergrondverversing;
- lege staat;
- gedeeltelijke data;
- succes;
- validatiefout;
- herstelbare fout;
- onherstelbare fout;
- offline of trage verbinding;
- verlopen sessie;
- ontbrekende rechten.

### 11.1 Loading

- Geef binnen circa 100 ms directe visuele respons op interactie.
- Gebruik skeletons alleen wanneer de uiteindelijke layout bekend is.
- Reserveer ruimte en voorkom layoutverschuiving.
- Gebruik een spinner voor kleine, lokale processen zonder voorspelbare vorm.
- Toon na langere wachttijd wat er gebeurt en of annuleren mogelijk is.
- Respecteer reduced motion; skeletons pulseren niet fel.

### 11.2 Lege staten

Een lege staat legt uit waarom er niets is en biedt één relevante vervolgstap. Onderscheid:

- nog geen inhoud aangemaakt;
- geen resultaten door filters;
- tijdelijk geen beschikbare inhoud;
- inhoud waarvoor toestemming of toegang nodig is.

Gebruik geen groot decoratief beeld wanneer een korte uitleg en actie voldoende zijn.

### 11.3 Succes

Bevestig de concrete uitkomst en eventuele gevolgen. Houd succesfeedback rustig: `success-700`, heldere tekst en maximaal een subtiele animatie volgens de Brand Guide.

## 12. Content en microcopy

### 12.1 Stem

Schrijf warm, helder, feitelijk en respectvol. Gebruik actieve zinnen, concrete werkwoorden en normale zinskapitalisatie.

- Vermijd superlatieven, clickbait en kunstmatige urgentie.
- Vermijd koloniale beeldspraak, exotisering en culturele stereotypen.
- Vermenselijk dieren niet wanneer dit hun gedrag verkeerd voorstelt.
- Benoem locaties, soorten, gemeenschappen en organisaties correct.
- Onderbouw natuur-, impact- en duurzaamheidsclaims.
- Gebruik maximaal één uitroepteken alleen in uitzonderlijke, passende context.

### 12.2 Labels en acties

- Gebruik “Lees het verhaal” in plaats van “Meer”.
- Gebruik “Probeer opnieuw” in plaats van “Refresh”.
- Gebruik “Bewaar voorkeuren” in plaats van “Verzenden” wanneer dat de uitkomst is.
- Gebruik “Annuleren” alleen wanneer een actieve handeling wordt afgebroken.
- Gebruik geen “Ja/Nee”-knoppen wanneer de concrete acties benoemd kunnen worden.

### 12.3 Getallen, datum en tijd

- Gebruik de ingestelde locale voor datum, tijd, valuta en getallen.
- Maak tijdzones expliciet wanneer ze relevant zijn.
- Gebruik relatieve tijd alleen waar precisie niet nodig is en bied zo nodig de exacte datum.
- Schrijf eenheden consistent en zet belangrijke conversies erbij wanneer de doelgroep die nodig heeft.

### 12.4 Sponsor- en partnercontent

- Label commerciële en partnerinhoud expliciet volgens de Brand Guide.
- Maak duidelijk waarom een partner wordt genoemd en of die invloed heeft op inhoud.
- Plaats partnerlogo’s niet als interactieve afleiding midden in een kerntaak.
- Houd sponsortransparantie zichtbaar op mobiel.

## 13. Media-ervaring

### 13.1 Afbeeldingen

- Volg de fotografische stijl, kadrering en beeldrechten uit de Brand Guide.
- Geef betekenisvolle afbeeldingen passende alt-tekst.
- Gebruik lege alt-tekst voor decoratie.
- Dupliceer een zichtbaar bijschrift niet woordelijk in alt-tekst.
- Maak zoom of lightbox alleen beschikbaar wanneer detailweergave waarde toevoegt.

### 13.2 Video

- Speel video niet automatisch af met geluid.
- Bied play/pause, tijdlijn, volume, fullscreen en waar mogelijk snelheid.
- Lever ondertiteling voor gesproken inhoud en betekenisvol geluid.
- Bied transcriptie wanneer inhoudelijk passend.
- Gebruik audiodescriptie of een gelijkwaardig alternatief wanneer visuele informatie essentieel is.
- Behoud bediening zichtbaar en toetsenbordtoegankelijk.
- Een posterframe volgt de premium, filmische merkstijl.

### 13.3 Audio

- Start audio alleen na expliciete actie.
- Toon duur, voortgang en duidelijke pauze-/stopbediening.
- Bied transcriptie voor gesproken audio.
- Gebruik omgevingsgeluid niet als verplichte informatiedrager.

### 13.4 Immersieve ervaringen

Panorama, kaart, parallax of interactieve natuurervaringen hebben altijd een begrijpelijk alternatief. Zij blokkeren scroll of browsernavigatie niet en respecteren reduced motion.

## 14. Toegankelijkheid

### 14.1 Norm

Alle vrijgegeven ervaringen voldoen minimaal aan WCAG 2.2 niveau AA. Toegankelijkheid wordt ontworpen, ontwikkeld én handmatig gecontroleerd; een automatische scan is niet voldoende.

### 14.2 Toetsenbord en focus

- Alle functies werken met toetsenbord zonder tijdsdruk.
- Focusvolgorde volgt de visuele en semantische volgorde.
- Focus is altijd zichtbaar met de `gold-500`-ring uit de Brand Guide.
- Focus wordt alleen programmatisch verplaatst wanneer context verandert of een foutgerichte flow dit vereist.
- Geen keyboard traps, behalve correct beheerde modals.
- Bied een skiplink naar de hoofdinhoud.

### 14.3 Semantiek

- Gebruik native HTML-elementen voordat ARIA wordt toegevoegd.
- Geef pagina’s unieke, beschrijvende titels.
- Gebruik één `h1` en een logische koppenhiërarchie zonder niveaus puur voor styling over te slaan.
- Geef controls een toegankelijke naam, rol en status.
- Gebruik landmarks voor header, navigatie, main en footer.
- Maak dynamische statusupdates hoorbaar zonder overmatige aankondigingen.

### 14.4 Visueel

- Minimaal contrast: 4,5:1 voor normale tekst en 3:1 voor grote tekst en noodzakelijke UI-grenzen.
- Informatie is nooit afhankelijk van kleur alleen.
- Tekst blijft bruikbaar bij 200% zoom en verhoogde tekstgrootte.
- Vermijd tekst in afbeeldingen, behalve een goedgekeurd logo.
- Ondersteun high-contrast- en forced-colors-modi waar mogelijk.
- Gebruik de gebroken witte en bijna-zwarte merkcombinaties zonder contrast te verlagen.

### 14.5 Beweging en tijd

- Respecteer `prefers-reduced-motion` volgens de Brand Guide.
- Voeg geen tijdslimiet toe tenzij functioneel noodzakelijk; bied verlenging en waarschuwing.
- Pauzeer, stop of verberg bewegende inhoud.
- Gebruik geen flitsen of snelle luminantiewisselingen.

### 14.6 Cognitieve toegankelijkheid

- Gebruik consistente plaatsing en terminologie.
- Splits complexe taken in begrijpelijke stappen.
- Vermijd dubbele ontkenningen en onnodig jargon.
- Houd foutmeldingen naast het probleem en geef herstelactie.
- Vraag niet onnodig opnieuw om eerder ingevoerde informatie.
- Ondersteun kopiëren, plakken en wachtwoordmanagers.

### 14.7 Testset

Controleer minimaal:

- toetsenbord zonder muis;
- gangbare screenreader- en browsercombinaties;
- 200% zoom en tekstvergroting;
- reduced motion;
- forced colors of verhoogd contrast;
- smalle mobiele en brede desktopviewports;
- touch en grove pointer;
- lange vertalingen en realistische contentextremen.

## 15. Privacy, veiligheid en vertrouwen

- Verzamel alleen noodzakelijke gegevens.
- Leg doel, bewaartermijn en delen uit op het relevante moment.
- Maak zichtbaar of informatie concept, opgeslagen, verzonden, gedeeld of openbaar is.
- Verberg privacykeuzes niet achter meerdere lagen.
- Maak toestemming specifiek, vrijwillig en intrekbaar.
- Toon sessieverloop vóór gegevens verloren gaan.
- Maskeer gevoelige informatie zonder kopiëren of controle onmogelijk te maken.
- Laat beveiligingswaarschuwingen geen technische schuld bij de gebruiker leggen.
- Open externe partnerpagina’s transparant en onderscheid ze van Animavidi-inhoud.

## 16. Performance als ervaring

- Prioriteer bruikbare hoofdinhoud boven decoratieve assets.
- Optimaliseer de grote fotografie die het merk draagt; laad geen desktopbeeld op mobiel zonder passende variant.
- Reserveer beeldverhoudingen om layoutverschuiving te voorkomen.
- Geef directe feedback op input en voorkom trage, blokkerende transities.
- Gebruik optimistic UI alleen als falen veilig kan worden hersteld.
- Houd kernnavigatie bruikbaar bij trage verbinding.
- Toon geen volledig schermvullende loader wanneer lokale loading volstaat.
- Laat animatie nooit concurreren met responsiviteit.

Als richtdoel voor de 75e percentielervaring gelden de actuele “good”-grenzen van Core Web Vitals; controleer actuele grenswaarden bij implementatie.

## 17. Lokalisatie en internationale bruikbaarheid

- Ontwerp componenten voor langere en kortere teksten.
- Hardcode geen datum-, getal-, valuta- of meervoudsformaten in UI-componenten.
- Houd rekening met woorden die 30–50% langer worden.
- Vermijd tekst in rasterafbeeldingen.
- Gebruik taalattributen en markeer taalwissels in inhoud.
- Ondersteun rechts-naar-links-layout wanneer een goedgekeurde doeltaal dit vereist.
- Vertaal soortnamen, locaties en eigennamen zorgvuldig; behoud wetenschappelijke naam waar relevant.

## 18. Ontwerpregels per componentstatus

Elke interactieve component specificeert en test minimaal:

- standaard;
- hover waar beschikbaar;
- focus-visible;
- active/pressed;
- selected of current;
- disabled indien noodzakelijk;
- loading;
- succes;
- fout;
- readonly waar relevant.

Disabled controls krijgen uitleg wanneer niet duidelijk is waarom ze niet beschikbaar zijn. Verberg een onbeschikbare actie alleen wanneer de gebruiker deze in de huidige context niet hoeft te kennen.

Visuele uitwerking gebruikt uitsluitend de kleuren, typografie, radii, schaduwen, iconen en motiontokens uit de Brand Guide.

## 19. UX-acceptatiecriteria voor elk nieuw scherm

Een scherm is pas gereed wanneer:

- het doel en de primaire doelgroep zijn vastgelegd;
- de `h1`, primaire actie en verwachte vervolgstap duidelijk zijn;
- globale en lokale navigatie kloppen;
- mobiel, tablet, desktop, zoom en lange inhoud zijn ontworpen;
- loading, leeg, succes, gedeeltelijke data en fout zijn uitgewerkt;
- toetsenbord-, focus- en screenreader-gedrag zijn gecontroleerd;
- formulieren invoer behouden en bruikbare validatie geven;
- privacy-, sponsor- en broninformatie zichtbaar is waar nodig;
- fotografie, typografie, ruimte en motion aansluiten op de Brand Guide;
- prestaties en trage verbinding zijn meegewogen;
- microcopy concreet, respectvol en consistent is;
- er geen doodlopende route of onomkeerbare verrassing bestaat.

## 20. Verboden patronen

Animavidi gebruikt niet:

- verborgen of misleidende toestemming;
- vooraangevinkte marketingkeuzes;
- kunstmatige schaarste of aftelklokken zonder echte noodzaak;
- automatisch afspelende media met geluid;
- automatische carrousels zonder controle;
- scroll-jacking of essentiële bediening achter hover/swipe;
- modals voor lange of complexe flows;
- placeholders als enige veldlabels;
- kleur als enige statusindicator;
- meerdere concurrerende primaire knoppen;
- generieke fouttekst zonder herstelpad;
- onverwacht verlies van invoer;
- oneindig scrollen zonder inhoudelijk doel of terugkeerpositie;
- partnercontent die op onafhankelijke redactionele inhoud lijkt;
- safari-, dier- of culturele clichés als vervanging voor heldere UX.

## 21. Beheer en wijzigingsproces

Dit document heeft voorrang op losse wireframes, prototypes en persoonlijke voorkeuren. Een nieuw patroon wordt pas standaard nadat het:

1. een aantoonbaar gebruikersprobleem oplost;
2. toegankelijk en responsief is gespecificeerd;
3. aansluit op de Brand Guide;
4. in realistische inhoud en systeemstatussen is gevalideerd;
5. in dit document is vastgelegd.

Leg bij materiële wijzigingen vast:

- datum en eigenaar;
- probleem en onderbouwing;
- gekozen patroon en alternatieven;
- toegankelijkheids- en privacygevolgen;
- impact op bestaande schermen en componenten;
- benodigde migratie en tests.

De UX Guidelines blijven in lijn met `Brand_Guide.md`, `Development_Guide.md` en `Roadmap.md`. Functionaliteit die nog niet in de Roadmap is goedgekeurd, blijft een richtlijn voor toekomstig ontwerp en geen implementatieopdracht.
