# Animavidi Roadmap

> Permanente bron van waarheid voor de productvolgorde, versies, afhankelijkheden en acceptatiecriteria van Animavidi.

## 1. Doel en status

Deze roadmap beschrijft de ontwikkeling van **versie 0.1 tot en met versie 2.0**. De versies zijn beslis- en kwaliteitsmijlpalen, geen automatisch toegezegde releasedata.

### Huidige status

**Versie 0.1 — Fundament: inhoudelijk gereed**

Het technische fundament en de permanente documentatie zijn aanwezig. Er zijn nog geen productpagina’s of functies goedgekeurd of geïmplementeerd.

### Belangrijke scopegrens

De huidige bron-documenten leggen het volgende vast:

- de premium safari-identiteit;
- algemene navigatie-, scherm-, onboarding-, formulier- en interactiepatronen;
- de technische doelarchitectuur;
- de kwaliteitseisen voor toekomstige ontwikkeling.

Er is nog **geen concrete doelgroep, kernpropositie, benoemde schermenset, uitgewerkte gebruikersflow, datamodel, accountfunctie of contentfunctie goedgekeurd**. Algemene voorbeelden in de Brand Guide, UX Guidelines en Development Guide zijn illustraties, geen featurebesluiten.

Daarom bevat deze roadmap geen verzonnen productfuncties. Vanaf versie 0.2 zijn expliciete goedkeuringspoorten opgenomen. Zodra een flow of scherm samen is vastgesteld, wordt die vóór implementatie met naam, scope en acceptatiecriteria aan deze roadmap toegevoegd.

## 2. Roadmapregels

1. **Geen feature zonder besluit.** Alleen expliciet goedgekeurde functionaliteit krijgt een releaseversie.
2. **Geen scherm zonder doel.** Elk scherm heeft een doelgroep, gebruikersdoel, primaire actie en meetbare uitkomst.
3. **Geen implementatie vóór flowgoedkeuring.** Eerst probleem en flow, daarna ontwerp en techniek.
4. **Must Have bepaalt releasegereedheid.** Een versie is niet gereed zolang een Must Have-criterium ontbreekt.
5. **Should Have blokkeert niet automatisch.** Uitstel vereist wel een vastgelegde afweging.
6. **Future Ideas zijn geen backlogtoezegging.** Zij worden pas gepland na validatie en expliciete goedkeuring.
7. **Toegankelijkheid, privacy, security, responsiveness en performance zijn altijd Must Have.** Deze mogen niet naar een latere versie worden doorgeschoven.
8. **Kleinste bruikbare bouwsteen eerst.** Elke versie levert een controleerbare uitkomst op.
9. **Datums worden afzonderlijk goedgekeurd.** Versienummers geven volgorde aan, geen kalenderdatum.
10. **Bron van waarheid blijft synchroon.** Product-, merk-, UX- en technische besluiten worden in de juiste documenten bijgewerkt.

## 3. Prioriteitsdefinities

### Must Have

Noodzakelijk om het doel en de acceptatiecriteria van een versie veilig en bruikbaar te halen. Ontbrekende Must Haves blokkeren de versie.

### Should Have

Waardevol en passend binnen het versie-doel, maar niet noodzakelijk voor een veilige release. Een Should Have mag alleen worden uitgevoerd wanneer alle Must Haves stabiel zijn.

### Future Ideas

Een nog niet goedgekeurde richting, hypothese of mogelijkheid. Future Ideas hebben geen planning, ontwerp- of implementatiestatus en mogen geen architectuurcomplexiteit veroorzaken.

## 4. Overzicht van versies

| Versie | Mijlpaal | Hoofduitkomst | Status |
| --- | --- | --- | --- |
| 0.1 | Fundament | Werkende basis en permanente richtlijnen | Gereed |
| 0.2 | Productbesluit | Doelgroep, probleem en kernwaarde goedgekeurd | Niet gestart |
| 0.3 | Flow- en schermcontract | Concrete kernflow en schermenset goedgekeurd | Geblokkeerd door 0.2 |
| 0.4 | UI- en contentfundament | Gedeelde bouwstenen voor goedgekeurde schermen | Geblokkeerd door 0.3 |
| 0.5 | App-shell en navigatie | Werkende structuur rond de goedgekeurde flow | Geblokkeerd door 0.3–0.4 |
| 0.6 | Eerste verticale slice | Eén bruikbare end-to-end kernroute | Geblokkeerd door 0.5 |
| 0.7 | Complete MVP-flow | Alle goedgekeurde MVP-stappen verbonden | Geblokkeerd door 0.6 |
| 0.8 | Robuustheid | Alle statussen, data- en kwaliteitsgrenzen | Geblokkeerd door 0.7 |
| 0.9 | Release candidate | Productieproef en formele go/no-go | Geblokkeerd door 0.8 |
| 1.0 | Eerste productieversie | Goedgekeurde MVP publiek en beheersbaar | Geblokkeerd door 0.9 |
| 1.1 | Eerste leerrelease | Kritieke bevindingen en bewezen verbeteringen | Geblokkeerd door 1.0-data |
| 1.2 | Stabilisatie | Betrouwbaarheid, toegankelijkheid en beheer verdiept | Geblokkeerd door 1.1 |
| 1.5 | Gevalideerde uitbreiding | Alleen bewezen uitbreiding van de kernwaarde | Nog niet gespecificeerd |
| 2.0 | Tweede productgeneratie | Nieuwe, expliciet goedgekeurde hoofdscope | Nog niet gespecificeerd |

## 5. Versie 0.1 — Technisch en documentair fundament

### Doel

Een schoon, werkend en uitbreidbaar fundament opleveren zonder productpagina’s of functionaliteit vooruit te lopen.

### Must Have

- React 19-, TypeScript- en Vite-projectbasis.
- Strict TypeScript- en ESLint-configuratie.
- Reproduceerbaar pnpm-lockbestand.
- Git-repository met `main` als primaire branch.
- Cloudflare Pages-voorbereiding met productiebuild naar `dist`.
- Schaalbare bronmappen zonder fictieve productcode.
- Permanente `Brand_Guide.md`, `UX_Guidelines.md`, `Development_Guide.md` en `Roadmap.md`.
- Succesvolle typecheck, lintcontrole en productiebuild.

### Should Have

- Geen. Deze mijlpaal is bewust beperkt tot het overeengekomen fundament.

### Acceptatiecriteria

- Het project kan lokaal worden geïnstalleerd en gestart.
- De productiebuild slaagt en is geschikt voor Cloudflare Pages.
- Er zijn geen productpagina’s, routes of functies toegevoegd.
- Alle vier bron-documenten bestaan en spreken elkaar niet tegen.
- Gegenereerde output, dependencies en lokale secrets worden niet gevolgd door Git.

### Afhankelijkheden

Geen; dit is het startpunt.

### Status

**Gereed.**

## 6. Versie 0.2 — Productdefinitie en scopebesluit

### Doel

Vaststellen voor wie Animavidi bestaat, welk probleem het als eerste oplost en welke uitkomst versie 1.0 moet bewijzen.

### Must Have

- Eén primaire doelgroep en relevante gebruikscontext.
- Eén kernprobleem, beschreven vanuit de gebruiker.
- Een heldere kernpropositie zonder onbewezen claims.
- Eén meetbare primaire succesuitkomst.
- Expliciete MVP-scope en expliciete non-goals.
- Inventarisatie van benodigde content, data, rechten, partners en operationeel eigenaarschap.
- Vastgelegde privacy-, veiligheids- en toegankelijkheidsrisico’s.
- Besluit of onderzoek/prototyping nodig is vóór flowontwerp.

### Should Have

- Secundaire doelgroep als deze de kernscope niet verbreedt.
- Eerste overzicht van contentbronnen en redactioneel eigenaarschap.
- Eerste aannames en validatievragen.

### Acceptatiecriteria

- De productdefinitie is schriftelijk goedgekeurd.
- Elke MVP-functie kan direct aan het kernprobleem worden gekoppeld.
- De non-goals voorkomen dat versie 1.0 ongemerkt uitbreidt.
- Er is geen schermlijst of architectuur gekozen om een nog onbewezen feature te rechtvaardigen.
- Roadmap en relevante documentatie zijn bijgewerkt met het besluit.

### Afhankelijkheden

- Versie 0.1 is gereed.
- Besluitvorming door producteigenaar en relevante inhoudelijke stakeholders.

### Releasepoort

Versie 0.3 start pas nadat doelgroep, probleem, kernwaarde, succesmaat en non-goals expliciet zijn goedgekeurd.

## 7. Versie 0.3 — Gebruikersflow en schermcontract

### Doel

De overeengekomen kernwaarde vertalen naar één concrete, testbare gebruikersflow en de minimale schermenset die daarvoor nodig is.

### Must Have

- Eén primaire happy flow van ingang tot duidelijke uitkomst.
- Alternatieve routes voor teruggaan, annuleren en herstellen.
- Schermeninventaris met per scherm:
  - unieke naam;
  - gebruikersdoel;
  - ingang en uitgang;
  - primaire actie;
  - noodzakelijke inhoud en data;
  - loading-, lege-, succes- en foutstatus;
  - mobiele en toetsenbordinteractie;
  - privacy-, sponsor- en bronvermelding waar relevant.
- Informatiearchitectuur en navigatieniveaus.
- Route- en URL-contract voor alle goedgekeurde schermen.
- Contentmodel en terminologielijst.
- Low-fidelity wireframes of gelijkwaardige interactiespecificaties.
- Toegankelijkheidscontrole volgens `UX_Guidelines.md`.
- Besluit welke onderdelen statisch, client-side of server-side zijn.

### Should Have

- Getest klikbaar prototype voor risicovolle interacties.
- Contentproef met realistische lange en korte teksten.
- Vroege gebruikerstest op begrip, navigatie en taakvoltooiing.

### Acceptatiecriteria

- Elk scherm is noodzakelijk voor de goedgekeurde kernflow.
- De flow heeft geen doodlopende route.
- De gebruiker weet op elk punt waar die is, wat de hoofdactie is en wat daarna gebeurt.
- Mobiele bediening vereist geen hover en geen verborgen swipe.
- Fout- en herstelroutes zijn even concreet als de happy flow.
- De schermenset is expliciet goedgekeurd en in deze roadmap opgenomen voordat code wordt gebouwd.

### Afhankelijkheden

- Goedgekeurde versie 0.2-productdefinitie.
- Beschikbaarheid van representatieve content en data-eisen.
- Brand Guide en UX Guidelines blijven leidend.

### Releasepoort

Versie 0.4 en 0.5 mogen geen productschermen implementeren zolang de schermenset hier niet met naam en scope is vastgelegd.

## 8. Versie 0.4 — UI-, merk- en contentfundament

### Doel

Alleen de gedeelde visuele en interactieve bouwstenen maken die de goedgekeurde 0.3-schermen aantoonbaar nodig hebben.

### Must Have

- Technische designtokens uit `Brand_Guide.md`:
  - kleuren;
  - typografie;
  - spacing;
  - radii;
  - schaduwen;
  - motion en reduced motion.
- Globale semantische HTML- en CSS-basis.
- Benodigde UI-primitieven, elk met gedocumenteerde statussen.
- Toegankelijke focus-, toetsenbord- en foutpatronen.
- Responsieve media- en beeldstrategie.
- Goedgekeurde font- en iconenstrategie.
- Componenttests voor gedrag en toegankelijkheid.

### Should Have

- Geïsoleerde componentpreview of catalogus wanneer dit review aantoonbaar versnelt.
- Visuele regressietests voor stabiele kerncomponenten.

### Acceptatiecriteria

- Iedere component is gekoppeld aan minimaal één goedgekeurd scherm.
- Geen ongebruikte generieke componentbibliotheek wordt vooruit gebouwd.
- Alle componentstatussen uit de Development Guide zijn geïmplementeerd waar relevant.
- Kleurcontrast, focus, touch targets en reduced motion voldoen aan de richtlijnen.
- Geen nieuwe visuele token is buiten de Brand Guide geïntroduceerd.
- Component-API’s bevatten geen feature- of routekennis.

### Afhankelijkheden

- Goedgekeurde 0.3-schermen en interactiepatronen.
- Definitieve of expliciet tijdelijke merkassets met bekende rechten.

## 9. Versie 0.5 — App-shell, routing en navigatie

### Doel

De structurele laag bouwen waarmee gebruikers de goedgekeurde schermen kunnen bereiken en begrijpen, nog zonder de volledige kernfunctionaliteit.

### Must Have

- React Router-configuratie voor uitsluitend goedgekeurde routes.
- App-shell met skiplink, header, `main` en footer waar relevant.
- Desktop- en mobiele hoofdnavigatie volgens `UX_Guidelines.md`.
- Actieve route, focusherstel en browser terug/vooruit.
- Route-level lazy loading en foutgrenzen.
- Pagina-title en basis metadata per route.
- 404- en algemene foutstructuur.
- Cloudflare Pages SPA-fallback gevalideerd.
- Keyboard-, screenreader- en mobiele navigatietests.

### Should Have

- Breadcrumbs voor goedgekeurde hiërarchische routes.
- Scrollrestoration wanneer dit voor de flow relevant is.

### Acceptatiecriteria

- Elke route heeft een betekenisvolle URL en unieke titel.
- Gebruikers kunnen alle beschikbare routes zonder muis bereiken.
- Mobiele navigatie beheert focus en achtergrondscroll correct.
- De shell bevat geen placeholderlinks naar niet-goedgekeurde functies.
- Directe URL-open, refresh en Cloudflare preview werken.
- Geen routebundel laadt onnodig zware featurecode.

### Afhankelijkheden

- Versie 0.3 route- en schermcontract.
- Versie 0.4 benodigde UI-primitieven.

## 10. Versie 0.6 — Eerste verticale slice

### Doel

Eén klein maar volledig werkend pad door de goedgekeurde kernflow opleveren, van route tot zichtbare uitkomst.

### Must Have

- Exact één in 0.3 benoemd kernpad.
- Werkende UI, noodzakelijke data-access en runtimevalidatie.
- Loading-, lege-, succes- en relevante foutstatussen.
- Mobiele, toetsenbord- en screenreaderbediening.
- Veilige foutnormalisatie en herstelactie.
- Unit-, component-, integratie- en minimaal één end-to-endtest.
- Previewdeployment voor review.
- Basisobservability zonder onnodige persoonsgegevens.

### Should Have

- Gebruikstest met de primaire doelgroep.
- Performanceprofiel op representatieve mobiele verbinding.

### Acceptatiecriteria

- Het pad levert de in 0.2 afgesproken gebruikerswaarde aantoonbaar op.
- Een gebruiker kan het pad starten, voltooien, annuleren en waar relevant herstellen.
- Geen mock of tijdelijke data bereikt productie zonder expliciete markering en besluit.
- De Definition of Done uit de Development Guide is behaald.
- Bevindingen zijn verwerkt in 0.7-scope of als expliciete blokkade vastgelegd.

### Afhankelijkheden

- Versie 0.5 app-shell en navigatie.
- Goedgekeurde data- en contentbron.
- API- en databasebesluit wanneer de slice persistente data vereist.

## 11. Versie 0.7 — Complete goedgekeurde MVP-flow

### Doel

Alle in versie 0.3 goedgekeurde stappen verbinden tot één coherente MVP-ervaring.

### Must Have

- Alle Must Have-schermen uit het goedgekeurde schermcontract.
- Volledige primaire flow en goedgekeurde alternatieve routes.
- Consistente navigatie, microcopy en terminologie.
- Gevalideerde data-, formulier- en interactiecontracten.
- Behoud van geldige invoer en relevante gebruikerscontext.
- Alle systeemstatussen die per scherm zijn vastgesteld.
- Transparante bron-, rechten-, privacy- en sponsorinformatie waar vereist.
- Geautomatiseerde tests voor kritieke flow en herstelroutes.

### Should Have

- Alleen de in 0.3 expliciet als Should Have goedgekeurde schermen of interacties.
- Geen nieuwe functie omdat deze technisch eenvoudig lijkt.

### Acceptatiecriteria

- De volledige flow werkt op smal mobiel tot breed desktop.
- Er zijn geen dode links, placeholders of onbereikbare acties.
- Browserrefresh en terug/vooruit behouden correcte staat waar afgesproken.
- Alle kritieke fouten bieden begrijpelijke uitleg en herstel.
- Merk- en UX-review constateren geen ongedocumenteerde afwijkingen.
- De scope blijft binnen de goedgekeurde 0.2- en 0.3-besluiten.

### Afhankelijkheden

- Gevalideerde versie 0.6 verticale slice.
- Beschikbare en juridisch bruikbare content/assets.
- Eventuele backend-, database- en authenticatievoorzieningen uit afzonderlijke goedgekeurde ADR’s.

## 12. Versie 0.8 — Robuustheid, data en operationele kwaliteit

### Doel

De complete MVP bestand maken tegen realistische data, fouten, netwerken, apparaten en operationele omstandigheden.

### Must Have

- Alle loading-, empty-, partial-, success-, error-, offline- en sessiestatussen uit de UX Guidelines.
- Runtimevalidatie op iedere externe datagrens.
- Securityreview van invoer, headers, secrets en eventuele autorisatie.
- Privacyreview, bewaartermijnen en toestemming waar relevant.
- Accessibility-audit volgens WCAG 2.2 AA en herstel van blokkerende bevindingen.
- Performancecontrole tegen de budgetten uit de Development Guide.
- Test van lange content, ontbrekende media en extreme maar geldige waarden.
- Monitoring, veilige logging en request-id’s waar servercode bestaat.
- Back-up- en hersteltest wanneer persistente data bestaat.
- Content- en beeldrechten gecontroleerd.

### Should Have

- Visuele regressietests voor stabiele, kritieke schermen.
- Geautomatiseerde smoke test tegen Cloudflare preview.
- Gecontroleerde netwerkdegradatie voor niet-kritieke content.

### Acceptatiecriteria

- Geen bekende blocker of kritieke bevinding voor toegankelijkheid, security, privacy of dataverlies.
- Kritieke flow werkt bij trage verbinding en herstelt van verwachte fouten.
- Logging bevat geen secrets of onnodige persoonsgegevens.
- Persistente data kan aantoonbaar worden hersteld indien van toepassing.
- Build en preview zijn reproduceerbaar vanaf een schone checkout.

### Afhankelijkheden

- Functioneel complete versie 0.7.
- Representatieve previewomgeving en testdata.

## 13. Versie 0.9 — Release candidate

### Doel

Een productie-identieke kandidaat valideren en een expliciet go/no-go-besluit voorbereiden.

### Must Have

- Bevroren feature scope.
- Volledige CI met frozen lockfile, typecheck, lint, tests en build.
- Cloudflare preview met productie-equivalente configuratie zonder productie-secrets te lekken.
- Cross-browser- en apparaatcontrole voor de kernflow.
- Handmatige toegankelijkheidscontrole.
- Content-, juridische, privacy-, sponsor- en merksign-off.
- Monitoringdashboard, incidentproces en technisch eigenaar.
- Release-, rollback- en eventuele migratieprocedure getest.
- Bekende beperkingen gedocumenteerd.
- Formeel go/no-go-overzicht.

### Should Have

- Beperkte, gecontroleerde acceptatietest met representatieve gebruikers.
- Runbook voor veelvoorkomende operationele problemen.

### Acceptatiecriteria

- Alle Must Have-criteria van 0.1 tot en met 0.9 zijn aantoonbaar behaald.
- Er zijn geen open blocker- of kritieke defects.
- Iedere hoge prioriteit is opgelost of door de verantwoordelijke expliciet geaccepteerd.
- Rollback is getest en kan door de aangewezen eigenaar worden uitgevoerd.
- Productiegegevens, domein, analytics en support zijn gereed indien van toepassing.

### Afhankelijkheden

- Versie 0.8 is volledig geaccepteerd.
- Beschikbaarheid van alle release-eigenaren.

## 14. Versie 1.0 — Eerste productieversie

### Doel

De goedgekeurde MVP veilig via Cloudflare Pages beschikbaar stellen en de afgesproken kernwaarde betrouwbaar leveren.

### Must Have

- Exact de in 0.2 en 0.3 goedgekeurde MVP-scope.
- Productiedeployment vanaf een goedgekeurde `main`-commit.
- Werkende kernflow en herstelroutes.
- Productiemonitoring en foutopvolging.
- Privacy-, toegankelijkheids- en supportinformatie bereikbaar.
- Herleidbare releaseversie en commit-SHA.
- Direct uitvoerbaar rollbackplan.
- Meetplan voor de in 0.2 vastgelegde succesuitkomst, met minimale dataverzameling.

### Should Have

- Alleen 0.x Should Haves die zonder risico zijn voltooid en expliciet zijn geaccepteerd.

### Acceptatiecriteria

- Post-deployment smoke tests slagen.
- Hoofdroutes, assets, headers en eventuele API’s functioneren in productie.
- Er zijn geen kritieke regressies ten opzichte van de release candidate.
- Monitoring en supportownership zijn actief.
- De productieversie bevat geen niet-goedgekeurde Future Ideas.

### Afhankelijkheden

- Formeel go-besluit op versie 0.9.

## 15. Versie 1.1 — Eerste leerrelease

### Doel

Kritieke productiebevindingen oplossen en uitsluitend verbeteringen leveren die door gegevens, support of gebruikersonderzoek zijn onderbouwd.

### Must Have

- Triage van productieproblemen op impact en urgentie.
- Oplossing van blocker- en kritieke defects.
- Controle van de primaire succesuitkomst zonder scopeverbreding.
- Vastgelegde kwalitatieve feedback en toegankelijkheidsbevindingen.
- Regressietests voor opgeloste productiebugs.
- Bijgewerkte documentatie en bekende beperkingen.

### Should Have

- Kleine copy-, navigatie- of interactieverbeteringen binnen de bestaande flow, alleen na aantoonbare validatie.
- Performanceverbeteringen binnen bestaande schermen.

### Acceptatiecriteria

- Geen nieuwe hoofdflow, schermcategorie of data-entiteit is toegevoegd.
- Iedere wijziging verwijst naar een defect, meting of gevalideerde observatie.
- Kernflow en bestaande contracten blijven achterwaarts compatibel waar nodig.
- Accessibility en performance zijn gelijk gebleven of verbeterd.

### Afhankelijkheden

- Voldoende, privacyverantwoorde signalen uit versie 1.0.

## 16. Versie 1.2 — Stabilisatie en beheer

### Doel

De eerste generatie structureel betrouwbaarder, beter beheerbaar en eenvoudiger onderhoudbaar maken zonder nieuwe productscope.

### Must Have

- Analyse van foutpercentages, latency, Core Web Vitals en supportpatronen.
- Oplossing van terugkerende betrouwbaarheidsproblemen.
- Herhaalde WCAG 2.2 AA-controle op de volledige productieflow.
- Dependency-, security- en platformonderhoud.
- Herstel-, rollback- en eventuele back-upprocedure opnieuw getest.
- Verwijdering van tijdelijke feature flags, workarounds en verouderde code.
- Actualisatie van runbooks, ADR’s en bron-documenten.

### Should Have

- Developer-experienceverbeteringen die doorlooptijd of foutkans aantoonbaar verbeteren.
- Verdere bundle- en mediaoptimalisatie.
- Aanvullende visuele regressiedekking voor stabiele schermen.

### Acceptatiecriteria

- Geen bekende structurele fout wordt alleen handmatig omzeild.
- Alle kritieke operationele procedures zijn recent getest.
- Tijdelijke code heeft een eigenaar en verwijderdatum of is verwijderd.
- Er is een onderbouwd besluit om 1.x te onderhouden, naar 1.5 uit te breiden of te stoppen.

### Afhankelijkheden

- Inzichten uit versie 1.0 en 1.1.

## 17. Versie 1.5 — Gevalideerde uitbreiding

### Doel

De bestaande kernwaarde uitbreiden met uitsluitend functionaliteit die na versie 1.0 expliciet is gevalideerd en goedgekeurd.

### Must Have

- Een nieuwe productbeslissing volgens dezelfde eisen als versie 0.2.
- Benoemde aanvullende flow en schermen volgens versie 0.3.
- Bewijs dat de uitbreiding een werkelijk gebruikersprobleem oplost.
- Expliciete non-goals en impactanalyse.
- Beoordeling van informatiearchitectuur, data, privacy, security en operations.
- Bijgewerkte Brand Guide, UX Guidelines, Development Guide en Roadmap waar nodig.
- Volledige implementatie- en kwaliteitscyclus volgens 0.4 tot en met 0.9 voor de nieuwe scope.

### Should Have

- Alleen afzonderlijk goedgekeurde verbeteringen die de nieuwe flow ondersteunen.

### Acceptatiecriteria

- De exacte 1.5-featurelijst is vóór implementatie aan dit hoofdstuk toegevoegd.
- Bestaande gebruikers kunnen de 1.0-kernflow zonder extra complexiteit blijven uitvoeren.
- Nieuwe data en bediening zijn optioneel tenzij de productbeslissing anders motiveert.
- Er is geen regressie in merkconsistentie, toegankelijkheid, performance of betrouwbaarheid.

### Afhankelijkheden

- Stabiele versie 1.2.
- Voldoende bewijs en expliciete productgoedkeuring.

### Huidige featurescope

**Nog leeg.** Er is samen nog geen uitbreidingsfunctionaliteit overeengekomen.

## 18. Versie 2.0 — Tweede productgeneratie

### Doel

Een nieuwe hoofdversie leveren wanneer gevalideerde gebruikersbehoeften een materiële wijziging van productmodel, informatiearchitectuur of technisch contract rechtvaardigen.

### Must Have

- Een expliciet besluit waarom een major versie nodig is.
- Nieuwe of gewijzigde doelgroep, kernflow en schermcontract.
- Migratieplan voor bestaande gebruikers, content en data.
- Backward-compatibility- en deprecatiebeleid.
- Informatiearchitectuur- en navigatietest.
- Security-, privacy- en accessibility threat/risk assessment.
- Data- en API-migratie met rollback of roll-forwardstrategie.
- Communicatie- en supportplan.
- Gefaseerde release en observability.
- Volledige acceptatie tegen Brand Guide, UX Guidelines en Development Guide.

### Should Have

- Gecontroleerde pilot of gefaseerde uitrol.
- Tijdelijke compatibiliteitslaag wanneer dit migratierisico verlaagt.
- Vergelijkend onderzoek tussen 1.x en 2.0 voor de primaire flow.

### Acceptatiecriteria

- De exacte 2.0-functionaliteit is vóór ontwerp en implementatie schriftelijk goedgekeurd.
- Bestaande waarde en data gaan niet onverwacht verloren.
- De migratie kan veilig worden gepauzeerd of teruggedraaid waar haalbaar.
- Alle kritieke journeys voldoen aan WCAG 2.2 AA en de Definition of Done.
- De major release is gerechtvaardigd door gebruikerswaarde, niet door technische nieuwigheid.

### Afhankelijkheden

- Bewezen beperkingen of nieuwe behoeften die niet verantwoord binnen 1.x passen.
- Formeel product-, UX-, technisch en operationeel besluit.

### Huidige featurescope

**Nog leeg.** Er is samen nog geen versie 2.0-functionaliteit overeengekomen.

## 19. Future Ideas

### Status

Er zijn momenteel **geen Future Ideas als productfunctionaliteit goedgekeurd of zelfs als kandidaat vastgelegd**. Dit is bewust: algemene mogelijkheden uit technische of UX-documentatie vormen geen productbacklog.

Een idee mag pas hieronder worden toegevoegd met:

- het gebruikersprobleem;
- doelgroep en context;
- verwachte waarde;
- bewijs of aanname;
- risico’s en afhankelijkheden;
- reden waarom het niet binnen de huidige Must Have-scope valt;
- eigenaar van validatie.

Gebruik deze tabel wanneer samen een idee wordt vastgelegd:

| Idee | Gebruikersprobleem | Bewijsstatus | Risico/afhankelijkheid | Eigenaar | Besluit |
| --- | --- | --- | --- | --- | --- |
| Nog geen | — | — | — | — | — |

Een Future Idea wordt nooit automatisch een Should Have. Promotie vereist expliciet besluit en plaatsing in een concrete versie.

## 20. Afhankelijkhedenmatrix

| Bouwblok | Vereist vóór start | Levert aan |
| --- | --- | --- |
| Productdefinitie | 0.1 | Flow, succescriteria en scope |
| Flow- en schermcontract | 0.2 | UI-bouwstenen, routing en testscenario’s |
| UI-fundament | 0.3 | App-shell en featureschermen |
| App-shell en routing | 0.3–0.4 | Verticale slice |
| Verticale slice | 0.5 plus data/content | Complete MVP-flow |
| Complete MVP | 0.6 | Robuustheid en releasevoorbereiding |
| Robuustheid | 0.7 | Release candidate |
| Release candidate | 0.8 | Productie 1.0 |
| Productiesignalen | 1.0 | 1.1 en 1.2 |
| Nieuwe gevalideerde scope | stabiele 1.x | 1.5 of 2.0 |

## 21. Acceptatie- en beslisproces

Voor iedere versie worden vastgelegd:

1. eigenaar;
2. concrete scope;
3. Must Haves, Should Haves en non-goals;
4. afhankelijkheden en risico’s;
5. test- en meetplan;
6. bewijs per acceptatiecriterium;
7. go, conditional go of no-go;
8. openstaande punten en opvolgversie.

Een versie krijgt pas status **Gereed** wanneer alle Must Haves zijn geverifieerd. “Gebouwd” is niet hetzelfde als “geaccepteerd”.

## 22. Roadmapstatussen

Gebruik uitsluitend:

- **Niet gestart:** scope is bekend maar uitvoering is niet begonnen.
- **Geblokkeerd:** een benoemde afhankelijkheid ontbreekt.
- **In uitvoering:** actief werk met eigenaar.
- **In review:** implementatie of document wacht op verificatie.
- **Gereed:** alle Must Haves en acceptatiecriteria zijn bewezen.
- **Gestopt:** bewust beëindigd met vastgelegde reden.

## 23. Besluitenlog

| Datum | Besluit | Reden | Impact | Eigenaar |
| --- | --- | --- | --- | --- |
| 2026-08-02 | Versie 0.1 beperkt tot technisch fundament en documentatie | Er zijn nog geen productpagina’s of functies overeengekomen | Productimplementatie wacht op 0.2 en 0.3 | Producteigenaar |
| 2026-08-02 | Geen concrete features opnemen in 0.2–2.0 zonder expliciete goedkeuring | De gevraagde scope mag alleen overeengekomen functionaliteit bevatten | Latere versies gebruiken releasepoorten en lege featurescope | Producteigenaar |

## 24. Wijzigingsbeheer

Iedere materiële roadmapwijziging vermeldt:

- wat is toegevoegd, gewijzigd, verplaatst of verwijderd;
- welke gebruikersbehoefte of welk bewijs de wijziging ondersteunt;
- verandering in Must Have, Should Have of Future Ideas;
- impact op afhankelijkheden en releasecriteria;
- impact op `Brand_Guide.md`, `UX_Guidelines.md` en `Development_Guide.md`;
- eigenaar en beslisdatum.

Nieuwe functionaliteit wordt eerst in deze roadmap en de relevante flow- en schermspecificatie goedgekeurd. Pas daarna ontstaat toestemming om applicatiecode of configuratie voor die functionaliteit te wijzigen.
