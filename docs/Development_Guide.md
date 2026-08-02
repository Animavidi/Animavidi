# Animavidi Development Guide

> Permanente bron van waarheid voor de technische architectuur, ontwikkelwerkwijze en kwaliteitsnormen van Animavidi.

## 1. Doel en status

Dit document bepaalt hoe Animavidi technisch wordt ontworpen, gebouwd, getest en uitgebracht. Het beschrijft de doelarchitectuur voor toekomstige ontwikkeling; onderdelen worden pas geïmplementeerd wanneer de Roadmap en productscope daar aanleiding toe geven.

De technische architectuur ondersteunt rechtstreeks:

- de premium safari-identiteit uit `Brand_Guide.md`;
- de toegankelijke, rustige en voorspelbare ervaring uit `UX_Guidelines.md`;
- gefaseerde levering volgens `Roadmap.md`.

Bij conflict gelden deze prioriteiten:

1. veiligheid en privacy;
2. toegankelijkheid en gegevensintegriteit;
3. correctheid en onderhoudbaarheid;
4. performance en betrouwbaarheid;
5. visuele verfijning.

## 2. Technische uitgangspunten

### 2.1 Kernstack

| Onderdeel | Keuze | Rol |
| --- | --- | --- |
| UI | React 19 | Componenten, rendering en interactie |
| Taal | TypeScript met strict mode | Types, contracten en refactorveiligheid |
| Tooling | Vite | Development server, bundling en optimalisatie |
| Package manager | pnpm | Reproduceerbare dependency-installatie |
| Hosting | Cloudflare Pages | Preview- en productiehosting van de statische app |
| Edge/backend | Cloudflare Pages Functions of Workers | Toekomstige serverlogica en API-routes |
| Versiebeheer | Git | Historie, review en releasecontrole |

De actuele, ondersteunde versies staan in `package.json` en het lockbestand. Major upgrades zijn afzonderlijke wijzigingen met release notes, migratiecontrole en volledige testuitvoering.

### 2.2 Architectuurprincipes

1. **Begin eenvoudig.** Voeg architectuurlagen of libraries alleen toe voor een concreet probleem.
2. **Feature-first.** Productcode wordt per domein gegroepeerd, niet uitsluitend per technisch bestandstype.
3. **Expliciete grenzen.** UI, domeinlogica, data-access en infrastructuur kennen ieder een duidelijke verantwoordelijkheid.
4. **Types aan de grens.** Externe data is `unknown` totdat runtimevalidatie heeft plaatsgevonden.
5. **Serverstate is geen clientstate.** Cache, URL-status, lokale UI-status en persistente data worden niet in één generieke store gemengd.
6. **Toegankelijkheid by design.** Semantiek, focus, toetsenbord en reduced motion worden in component-API’s meegenomen.
7. **Performance by default.** Laad alleen code, data, fonts en media die een scherm nodig heeft.
8. **Cloudflare-portabel.** Servercode gebruikt webstandaarden en geen Node-only API’s tenzij de gekozen runtime dit expliciet ondersteunt.
9. **Geen stille fouten.** Verwachte fouten worden getypeerd, afgehandeld en observeerbaar gemaakt.
10. **Documenteer beslissingen.** Materiële afwijkingen van deze gids vereisen een Architecture Decision Record.

## 3. Repositorystructuur

### 3.1 Doelstructuur

```text
animavidi/
├── docs/                       # Permanente product-, merk-, UX- en techniekdocumentatie
├── public/                     # Ongewijzigd gekopieerde statische bestanden
│   ├── _headers                # Cloudflare Pages responseheaders
│   └── _redirects              # Cloudflare Pages redirects en SPA-fallback
├── src/
│   ├── app/                    # App-shell, router, providers en globale foutgrenzen
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers/
│   ├── assets/                 # Door de bundler verwerkte lokale assets
│   ├── components/             # Productonafhankelijke herbruikbare UI
│   │   ├── Button/
│   │   ├── Field/
│   │   └── ...
│   ├── features/               # Domein- en featuremodules
│   │   └── example-feature/
│   │       ├── api/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── model/
│   │       ├── routes/
│   │       ├── schemas/
│   │       └── index.ts
│   ├── hooks/                  # Alleen werkelijk generieke hooks
│   ├── lib/                    # Gedeelde technische infrastructuur
│   │   ├── api/
│   │   ├── config/
│   │   ├── errors/
│   │   ├── observability/
│   │   └── validation/
│   ├── styles/                 # Tokens, reset, globals en utilities
│   ├── test/                   # Gedeelde testsetup en testhelpers
│   ├── types/                  # Kleine, domeinoverschrijdende typen
│   ├── main.tsx                # Browser-entrypoint
│   └── vite-env.d.ts
├── functions/                  # Toekomstige Cloudflare Pages Functions, indien gekozen
├── migrations/                 # Toekomstige versiebeheerde databasemigraties
├── e2e/                        # End-to-endtests en fixtures
├── .env.example                # Alleen publieke namen en placeholders
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig*.json
└── vite.config.ts
```

Mappen worden pas aangemaakt wanneer ze code bevatten of bewust als uitbreidingspunt dienen. Lege architectuur mag geen schijn van bestaande functionaliteit wekken.

### 3.2 Verantwoordelijkheden

#### `src/app`

Bevat uitsluitend applicatiecompositie: router, globale providers, app-shell, top-level error boundary en globale metadata-integratie. Domeinlogica hoort hier niet.

#### `src/components`

Bevat generieke UI-primitieven en samengestelde, productonafhankelijke componenten. Deze componenten kennen geen route, API-endpoint of featurecontext. Zij implementeren de Brand Guide en UX Guidelines.

#### `src/features`

Elke feature bezit haar routes, componenten, data-access, schemas, hooks en domeintypen. Features importeren niet rechtstreeks uit elkaars interne mappen. Gedeelde interactie loopt via een publieke export of verhuist na bewezen hergebruik naar een gedeelde laag.

#### `src/lib`

Bevat technische infrastructuur zonder productpresentatie: HTTP-client, configuratie, logging, foutnormalisatie, datum- of locale-adapters en validatiehelpers.

#### `src/styles`

Bevat de gecodeerde ontwerptokens en globale stijlbasis. Dit is de technische vertaling van de Brand Guide, niet een plaats voor willekeurige feature-CSS.

#### `public`

Bevat assets die exact dezelfde bestandsnaam nodig hebben of rechtstreeks door Cloudflare Pages worden gelezen. Importeer gewone afbeeldingen waar mogelijk vanuit `src/assets`, zodat Vite hashing en optimalisatie kan toepassen.

## 4. Naamgeving en imports

### 4.1 Bestandsnamen

| Type | Conventie | Voorbeeld |
| --- | --- | --- |
| React-component | PascalCase | `StoryCard.tsx` |
| Componentstijl | PascalCase module | `StoryCard.module.css` |
| Hook | camelCase met `use` | `useStoryFilters.ts` |
| Utility/service | camelCase | `formatDuration.ts` |
| Schema | camelCase met `.schema` | `story.schema.ts` |
| Test | naam plus `.test` | `StoryCard.test.tsx` |
| E2E-test | naam plus `.spec` | `story-detail.spec.ts` |
| Routefolder | kebab-case | `animal-stories/` |
| Constant | camelCase export | `defaultPageSize` |

Gebruik geen algemene bestanden zoals `helpers.ts`, `utils.ts` of `types.ts` wanneer een specifiekere naam mogelijk is.

### 4.2 Exports

- Gebruik named exports voor applicatiecode.
- Een default export is alleen toegestaan waar tooling dit verlangt.
- Gebruik een beperkte `index.ts` als publieke featuregrens, niet als brede barrel voor de hele applicatie.
- Importeer binnen een feature rechtstreeks uit lokale modules om circulaire dependencies te vermijden.
- Gebruik de alias `@/` voor imports vanaf `src`; gebruik relatieve imports binnen dezelfde kleine module.

### 4.3 Typebenamingen

- Gebruik zelfstandige namen: `Story`, `StorySummary`, `CreateStoryInput`.
- Prefix interfaces niet met `I` en types niet met `T`.
- Suffix componentprops met `Props`.
- Gebruik `Request`, `Response`, `Input`, `Result` en `Error` alleen wanneer die betekenis klopt.
- Scheid API-transporttypen van domeinmodellen wanneer vorm of betekenis verschilt.

## 5. React-componentarchitectuur

### 5.1 Componentcategorieën

1. **Primitives:** `Button`, `Link`, `Icon`, `Field`, `Dialog`.
2. **Composites:** productonafhankelijke combinaties zoals `FormField` of `MediaCard`.
3. **Featurecomponenten:** kennen domeindata en featuregedrag.
4. **Routecomponenten:** orkestreren data en paginaopbouw; bevatten zo min mogelijk presentatiedetail.
5. **Providers:** leveren alleen werkelijk brede infrastructuur of context.

### 5.2 Componentregels

- Eén duidelijke verantwoordelijkheid per component.
- Houd props klein, expliciet en semantisch; vermijd ongestructureerde configuratieobjecten.
- Geef voorkeur aan compositie via `children` of slots boven grote aantallen booleans.
- Gebruik discriminated unions voor exclusieve varianten.
- Stuur geen volledige API-responses door de componentboom wanneer een component slechts enkele waarden nodig heeft.
- Bereken afgeleide waarden tijdens render; synchroniseer ze niet onnodig via effects.
- Gebruik `useEffect` uitsluitend voor synchronisatie met externe systemen.
- Gebruik refs voor imperatieve DOM-integratie, niet als alternatieve statecontainer.
- Memoization is een gemeten optimalisatie, geen standaardritueel.
- Gebruik React 19-mogelijkheden alleen wanneer browser-, router- en hostinggedrag duidelijk zijn getest.

### 5.3 Propsvoorbeeld

```ts
type StoryCardProps = {
  title: string
  summary: string
  image: ResponsiveImage
  href: string
  metadata?: React.ReactNode
}
```

Gebruik betekenisvolle props. Een component hoort niet te bepalen waar data vandaan komt.

### 5.4 Toegankelijke componentcontracten

- Interactieve componenten gebruiken standaard native elementen.
- Een icon-only control vereist een toegankelijke naam.
- Componenten behouden zichtbare focus volgens `gold-500` uit de Brand Guide.
- Dialogs beheren focus, Escape en achtergrondscroll.
- Tabs, accordions en comboboxes volgen het toepasselijke WAI-ARIA-patroon.
- Motion respecteert `prefers-reduced-motion`.
- Componentdocumentatie beschrijft keyboardgedrag en alle statussen uit de UX Guidelines.

### 5.5 Error boundaries en Suspense

- Plaats een globale error boundary rond de app-shell.
- Gebruik route- of featuregrenzen zodat één fout niet de hele app uitschakelt.
- Toon gebruikersgerichte herstelopties en log technische context veilig.
- Gebruik Suspense alleen bij een data- of code-laag die het patroon daadwerkelijk ondersteunt.
- Loadinggrenzen corresponderen met stabiele visuele regio’s en veroorzaken geen layoutverschuiving.

## 6. Routing

### 6.1 Routerkeuze

Zodra meerdere routes nodig zijn, is **React Router** de standaardkeuze. Voeg de router pas toe wanneer de eerste goedgekeurde routearchitectuur bestaat. Gebruik route-level lazy loading en behoud deelbare, betekenisvolle URL’s.

### 6.2 Routeontwerp

- URLs zijn lowercase, leesbaar en gebruiken koppeltekens.
- Gebruik zelfstandige naamwoorden voor content en werkwoorden alleen voor echte acties.
- Zet filters, sortering, zoekterm en pagination in queryparameters wanneer delen of terugnavigeren waarde heeft.
- Gebruik routeparameters alleen voor stabiele identifiers of slugs.
- Voeg geen bestandsextensies, implementatiedetails of onnodige nesting toe.
- Definieer een expliciete 404-route.
- Behandel ontbrekende rechten en serverfouten als afzonderlijke ervaringen.

Voorbeeld, uitsluitend ter illustratie:

```text
/
/verhalen
/verhalen/:storySlug
/zoeken?q=leeuw&gebied=serengeti
```

### 6.3 Routeorganisatie

Elke route definieert waar relevant:

- pagina-element en lazy import;
- loader of query-prefetch;
- foutgrens;
- metadata, titel en canonical URL;
- toegangscontrole;
- scroll- en focusgedrag.

Na client-side navigatie verplaatst de app focus naar het begin van de nieuwe hoofdinhoud of hanteert een gelijkwaardig, getest patroon. Browser terug/vooruit herstelt waar praktisch scroll- en filterstatus.

### 6.4 Cloudflare Pages fallback

Voor client-side routes blijft `public/_redirects` de SPA-fallback leveren:

```text
/* /index.html 200
```

Als Pages Functions later `/api/*` afhandelen, worden API-routes expliciet uitgesloten of door Cloudflare vóór de fallback gerouteerd. Controleer dit in preview én productie.

## 7. State management

### 7.1 Beslisvolgorde

Plaats state zo dicht mogelijk bij het gebruik:

1. afgeleide renderwaarde;
2. lokale componentstate met `useState` of `useReducer`;
3. URL-state voor deelbare navigatiecontext;
4. formulierstate binnen het formulier;
5. serverstate via een query/cachelaag;
6. context voor stabiele appbrede concerns;
7. pas daarna een externe clientstore.

### 7.2 Lokale state

Gebruik lokale state voor open/dicht, geselecteerde tijdelijke tab, invoer en vergelijkbaar kortlevend gedrag. Houd state minimaal en sla geen afleidbare waarden dubbel op.

### 7.3 URL-state

Zoekterm, filters, sortering, pagination en geselecteerde deelbare weergave horen in de URL wanneer dit terugnavigatie en delen ondersteunt. Parse en valideer queryparameters aan de routegrens.

### 7.4 Serverstate

Wanneer API-data wordt toegevoegd, is **TanStack Query** de voorkeursoplossing voor cache, deduplicatie, retries, invalidatie en achtergrondverversing. Voeg de library pas toe wanneer de eerste serverstate-feature wordt gebouwd.

- Querykeys zijn centraal en getypeerd per feature.
- `queryFn` roept uitsluitend de gedeelde API-client of feature-service aan.
- Stel `staleTime` vast op basis van datavolatiliteit.
- Retry geen validatie-, authenticatie- of autorisatiefouten.
- Gebruik optimistic updates alleen wanneer rollback veilig en ontworpen is.
- Houd API-cache en persistente database nooit impliciet gelijk.

### 7.5 Context

React Context is geschikt voor stabiele afhankelijkheden zoals locale, thema-instellingen, authenticatiesessie of dependency injection. Plaats hoogfrequent veranderende grote objecten niet zonder selectors in één globale context.

### 7.6 Externe clientstore

Voeg geen Redux-, Zustand- of vergelijkbare store toe zonder Architecture Decision Record en aantoonbare cross-feature behoefte. Een externe store bevat geen servercache die al door TanStack Query wordt beheerd.

### 7.7 Persistente browserstate

- Gebruik `localStorage` alleen voor niet-gevoelige apparaatvoorkeuren.
- Gebruik `sessionStorage` alleen voor kortlevende sessiecontext.
- Versieer en valideer opgeslagen waarden.
- Sla geen tokens, gevoelige persoonsgegevens of bron-van-waarheiddata onbeveiligd op.
- Maak wissen en migreren expliciet.

## 8. Styling en designsysteem

### 8.1 Aanpak

Gebruik gewone CSS met:

- globale CSS custom properties voor goedgekeurde tokens;
- een kleine reset en basisstijlen;
- CSS Modules voor component- en featurestijlen;
- semantische utilityclasses uitsluitend voor bewezen herhaling.

Voeg geen CSS-in-JS-framework of utilityframework toe zonder Architecture Decision Record. De standaardaanpak houdt runtimekosten laag en Cloudflare Pages-output statisch.

### 8.2 Tokenlagen

Technische tokens volgen drie lagen:

1. **Basis:** ruwe waarden zoals `--color-savanna-900`.
2. **Semantisch:** doel zoals `--color-surface-inverse` of `--color-text-primary`.
3. **Component:** uitzonderlijk, zoals `--button-primary-background`.

Componenten gebruiken bij voorkeur semantische tokens, zodat merkupdates centraal blijven.

De kleuren, typografie, spacing, radii, shadows en motionwaarden komen exact uit `Brand_Guide.md`. Nieuwe waarden worden eerst daar goedgekeurd.

### 8.3 CSS-regels

- Gebruik mobile-first media queries.
- Gebruik `rem` voor typografie en spacing die met gebruikersinstellingen moet schalen.
- Gebruik pixels alleen voor fijne borders, iconische details en vastgelegde technische grenzen.
- Gebruik `clamp()` voor de responsieve typografische schaal.
- Beperk nesting en specificiteit.
- Gebruik geen `!important` behalve in gedocumenteerde accessibility- of integratiegevallen.
- Style op class of semantische state; koppel styling niet aan fragiele DOM-nesting.
- Gebruik logische properties waar dit internationalisatie ondersteunt.
- Zorg dat forced-colors en reduced-motion bruikbaar blijven.

### 8.4 Assetstrategie

- Gebruik de fotografie-eisen en beeldverhoudingen uit de Brand Guide.
- Sla goedgekeurde masters buiten gegenereerde output op; commit uitsluitend assets met bekende rechten.
- Lever responsieve afmetingen en moderne formaten waar de pipeline dit ondersteunt.
- Reserveer afmetingen om Cumulative Layout Shift te voorkomen.
- Gebruik één goedgekeurde outline-iconset; importeer alleen gebruikte iconen.
- Laad Cormorant Garamond en Inter met beperkte gewichten, font-displaystrategie en systeemfallbacks.

## 9. API-architectuur

### 9.1 Grens tussen frontend en backend

De browser praat via HTTPS met versieerbare API-contracten. Geheime sleutels, partnercredentials en vertrouwelijke transformaties blijven in Cloudflare Pages Functions, Workers of een andere goedgekeurde serveromgeving.

De frontend importeert nooit servermodules. Deel eventueel alleen zuivere schemas en types via een expliciete package- of buildgrens.

### 9.2 Clientstructuur

```text
src/lib/api/
├── apiClient.ts        # Fetch-wrapper, basisheaders en request-id
├── apiError.ts         # Gestandaardiseerde foutvorm
└── endpoints.ts        # Basis-URL en gedeelde routehelpers

src/features/example-feature/api/
├── getExample.ts       # Eén use-case per functie
├── example.keys.ts     # Querykeys
└── example.schema.ts   # Runtimevalidatie
```

De gedeelde client:

- gebruikt de standaard `fetch` API;
- accepteert een `AbortSignal`;
- stelt timeouts gecontroleerd in waar nodig;
- verstuurt en leest een request/correlation-id;
- parseert responsen veilig;
- normaliseert netwerk-, HTTP- en validatiefouten;
- logt geen gevoelige data;
- bepaalt niet zelf productcopy.

### 9.3 Runtimevalidatie

TypeScript controleert geen netwerkdata. Valideer requests en responses met een schema-library zodra API’s worden toegevoegd. De schema’s zijn leidend; afgeleide TypeScript-typen voorkomen duplicatie.

Onverwachte data levert een gecontroleerde fout op en wordt observeerbaar gemaakt. Render nooit half-vertrouwde velden zonder validatie of escaping.

### 9.4 API-conventies

- Gebruik `/api/v1/` wanneer een publiek of langdurig contract versiebeheer nodig heeft.
- Gebruik zelfstandige resources en consistente HTTP-methoden.
- Maak pagination, filters en sortering expliciet.
- Gebruik ISO 8601 voor timestamps in UTC.
- Gebruik stabiele machinecodes plus veilige gebruikerscontext voor fouten.
- Retourneer passende HTTP-statuscodes.
- Ontwerp mutaties idempotent waar dubbele verzending risico geeft.
- Geef geen stacktrace, secret of database-detail terug.

Een gestandaardiseerde fout kan deze vorm volgen:

```ts
type ApiErrorResponse = {
  error: {
    code: string
    message: string
    requestId: string
    fieldErrors?: Record<string, string[]>
  }
}
```

De servermessage is niet automatisch geschikte UI-copy. De feature vertaalt foutcodes naar de patronen uit `UX_Guidelines.md`.

### 9.5 Authenticatievoorbereiding

Voeg authenticatie pas toe wanneer de Roadmap dit vereist. Voorkeur voor veilige, HTTP-only, Secure, SameSite-cookies boven tokens in `localStorage`. Bescherm mutaties tegen CSRF waar het gekozen patroon dat vereist. Autorisatie vindt altijd server-side plaats; verborgen UI is geen beveiliging.

### 9.6 Caching

- Statische assets krijgen content hashes en lange immutable caching.
- HTML blijft hercontroleerbaar zodat releases snel zichtbaar worden.
- API-cacheheaders volgen gevoeligheid en datavolatiliteit.
- Cache geen persoonlijke responses publiek.
- Gebruik ETags of conditional requests waar dit aantoonbaar waarde geeft.
- Stem browsercache, TanStack Query en Cloudflare edge-cache expliciet op elkaar af.

## 10. Databasevoorbereiding

### 10.1 Uitgangspunt

De frontend heeft geen directe databaseverbinding. Toekomstige opslag wordt benaderd via server-side API’s. **Cloudflare D1** is de voorkeurskandidaat voor relationele data wanneer de productbehoefte past; R2 is geschikt voor objecten en media, KV voor kleine read-heavy configuratie en Durable Objects voor gecoördineerde state. Een definitieve keuze vereist een Architecture Decision Record.

### 10.2 Mappen en migraties

Wanneer een database wordt toegevoegd:

```text
migrations/
├── 0001_initial.sql
├── 0002_add_story_status.sql
└── ...

functions/_shared/db/
├── schema.ts
├── queries/
└── repositories/
```

- Iedere schemawijziging is een nieuwe, oplopende migratie.
- Reeds uitgevoerde migraties worden niet herschreven.
- Migraties zijn klein, reviewbaar en waar mogelijk achterwaarts compatibel.
- Test migraties op een lege én representatieve database.
- Leg rollback of roll-forwardstrategie vast.
- Seeddata bevat geen echte persoonsgegevens.

### 10.3 Datamodelregels

- Gebruik stabiele, niet-semantische primaire sleutels.
- Leg constraints vast in de database, niet alleen in formulieren.
- Gebruik consistente `created_at`- en `updated_at`-timestamps in UTC waar relevant.
- Maak soft delete alleen mogelijk met een concrete herstel-, audit- of bewaarbehoefte.
- Indexeer op gemeten querypatronen.
- Vermijd het opslaan van afleidbare data zonder reden.
- Documenteer eigenaarschap, gevoeligheid en bewaartermijn per dataset.

### 10.4 Data-accesslaag

Pages Functions of Workers gebruiken repositories of gerichte querymodules. Routehandlers valideren input, controleren autorisatie en roepen domein- of repositoryfuncties aan. SQL staat niet verspreid door handlers.

Gebruik transacties voor wijzigingen die atomair moeten zijn. Behandel concurrency en retries expliciet. Databasefouten worden vertaald naar veilige domein- of API-fouten.

### 10.5 Privacy en lifecycle

- Verzamel minimale gegevens.
- Scheid operationele, analytische en marketingdoeleinden.
- Leg bewaartermijnen en verwijderprocessen vast vóór productiegebruik.
- Ondersteun export, correctie en verwijdering wanneer wettelijke of productvereisten dit vragen.
- Versleutel tijdens transport en gebruik platformbeveiliging voor opslag.
- Sla secrets uitsluitend in Cloudflare secrets/environment bindings op.
- Log geen volledige persoonlijke records of credentials.

### 10.6 Back-ups en herstel

Voor productieopslag bestaat vóór livegang een gedocumenteerd plan voor back-up/PITR, hersteltest, incidentrespons en eigenaarschap. Een back-up telt pas als bruikbaar nadat herstel aantoonbaar is getest.

## 11. Configuratie en omgevingen

### 11.1 Omgevingen

Minimaal:

- **local:** lokale ontwikkeling en mocks;
- **preview:** Cloudflare preview per branch of pull request;
- **production:** goedgekeurde release vanaf `main`.

Preview gebruikt nooit ongecontroleerd productiegegevens. Externe integraties hebben aparte testcredentials waar mogelijk.

### 11.2 Omgevingsvariabelen

- Alleen variabelen met prefix `VITE_` zijn beschikbaar in de clientbundle.
- Behandel iedere `VITE_`-waarde als publiek.
- Valideer configuratie één keer bij appstart en faal duidelijk bij ontbrekende verplichte waarden.
- Houd `.env.example` actueel met namen en uitleg, zonder secrets.
- Commit geen `.env`, tokens of credentials.
- Beheer serversecrets via Cloudflare bindings/secrets.

### 11.3 Feature flags

Gebruik flags alleen voor gefaseerde release, experiment of risicobeheersing. Elke flag heeft eigenaar, doel en verwijderdatum. Autorisatie of beveiliging mag nooit uitsluitend van een clientflag afhangen.

## 12. Git-workflow

### 12.1 Branches

`main` is altijd releasebaar en beschermd. Werk in korte branches:

```text
feature/korte-omschrijving
fix/korte-omschrijving
docs/korte-omschrijving
refactor/korte-omschrijving
chore/korte-omschrijving
```

Houd branches klein en actueel. Gebruik een pull request voor review. Verwijder de branch na merge.

### 12.2 Commits

Gebruik korte, gebiedende commitmessages. Conventional Commits zijn de voorkeursvorm:

```text
feat(stories): add story filter controls
fix(navigation): restore focus after menu close
docs(ux): define mobile filter behavior
```

- Eén coherent doel per commit.
- Mix geen formattering of brede refactor met een functionele wijziging.
- Commit geen gegenereerde `dist`, secrets, logs of editorstate.
- Het lockbestand wordt gecommit wanneer dependencies wijzigen.
- Force-push niet op gedeelde branches zonder expliciete afstemming.

### 12.3 Pull requests

Een pull request bevat:

- probleem en oplossing;
- scope en expliciete non-goals;
- visuele of gedragsmatige impact;
- testbewijs;
- toegankelijkheids-, privacy- en performancegevolgen;
- screenshots of video bij UI-wijzigingen, inclusief relevante viewports en statussen;
- gekoppelde roadmap- of besluitcontext.

Minimaal één reviewer controleert architectuur en gedrag. Materiële UX- of merkafwijkingen vereisen review tegen de bijbehorende gids.

### 12.4 Merge en releases

Gebruik bij voorkeur squash merge voor een heldere `main`-historie, tenzij afzonderlijke commits blijvende waarde hebben. Tags en release notes volgen SemVer wanneer externe contracten of formele releases bestaan.

## 13. Teststrategie

### 13.1 Testpiramide

1. **Statische controles:** TypeScript, ESLint en build.
2. **Unit tests:** zuivere functies, schemas en domeinlogica.
3. **Component-/integratietests:** gedrag vanuit gebruikersperspectief.
4. **API-integratietests:** handlers, validatie, autorisatie en databasegrenzen.
5. **End-to-endtests:** een kleine set kritieke gebruikersreizen.
6. **Handmatige kwaliteitscontrole:** toegankelijkheid, visueel gedrag en realistische apparaten.

Test waardevolle risico’s, niet implementatieregels of percentages om het percentage.

### 13.2 Tooling

Voorkeursstack wanneer tests worden toegevoegd:

- **Vitest** voor unit- en integratietests;
- **React Testing Library** en `@testing-library/user-event` voor componentgedrag;
- **MSW** voor realistische netwerkinterceptie;
- **Playwright** voor end-to-end en belangrijke browserflows;
- **axe-core-integratie** voor aanvullende automatische accessibilitychecks.

Voeg tooling pas toe samen met de eerste relevante tests.

### 13.3 Testregels

- Test observeerbaar gebruikersgedrag, niet interne state of componentstructuur.
- Query bij voorkeur op role, label en zichtbare naam.
- Vermijd snapshots van grote DOM-bomen.
- Mock de grens, niet de functie die wordt getest.
- Gebruik vaste, betekenisvolle fixtures zonder echte persoonsgegevens.
- Maak tijd, randomness en netwerkgedrag deterministisch.
- Een bugfix krijgt een regressietest waar praktisch.
- Tests zijn parallel uitvoerbaar en laten geen gedeelde state achter.

### 13.4 Minimale dekking per wijziging

- Nieuwe domeinlogica: unit tests voor normale, grens- en foutgevallen.
- Nieuw interactief component: keyboard, focus, statussen en toegankelijke naam.
- Nieuw formulier: validatie, behoud van invoer, loading, succes en serverfout.
- Nieuwe API-route: inputvalidatie, authenticatie/autorisatie, succes en veilige foutvorm.
- Nieuwe kritieke flow: één succesvolle en relevante herstel-E2E-route.

### 13.5 Accessibility- en UX-tests

Automatisering vervangt geen handmatige controle. Volg de testset en acceptatiecriteria uit `UX_Guidelines.md`, waaronder toetsenbord, screenreader, 200% zoom, reduced motion, forced colors, touch, lange content en trage verbinding.

### 13.6 Visuele regressie

Introduceer visuele regressietests pas wanneer stabiele kerncomponenten en schermen bestaan. Test geselecteerde representatieve viewports en toestanden. Een gewijzigde screenshot wordt inhoudelijk beoordeeld en niet blind geaccepteerd.

## 14. Foutafhandeling en observability

### 14.1 Foutcategorieën

Maak onderscheid tussen:

- invoer- en validatiefouten;
- authenticatie- en autorisatiefouten;
- niet-gevonden data;
- conflict of verouderde state;
- netwerk- en timeoutfouten;
- onverwachte client- of serverfouten.

Elke categorie heeft een veilige gebruikersreactie volgens `UX_Guidelines.md` en technische context voor diagnose.

### 14.2 Logging

- Gebruik gestructureerde logs in servercode.
- Voeg request-id, route, status en duur toe.
- Redact secrets, tokens en persoonsgegevens.
- Gebruik loglevels consequent.
- Gebruik `console` in productiecode alleen via een afgesproken logger of voor expliciet toegestane platformlogging.

### 14.3 Monitoring

Voor livegang worden minimaal vastgesteld:

- beschikbaarheid en foutpercentage;
- API-latency;
- Core Web Vitals;
- deploystatus en rollbackmogelijkheid;
- kritieke functionele fouten;
- eigenaar en responsproces.

Analytics verzamelt alleen goedgekeurde, minimale events en respecteert privacy- en consentkeuzes.

## 15. Security

- Valideer en normaliseer alle externe input server-side.
- Escape output via React; gebruik geen `dangerouslySetInnerHTML` zonder gesaniteerde, gedocumenteerde bron.
- Gebruik Content Security Policy zodra toegestane externe bronnen bekend zijn.
- Behoud en verfijn beveiligingsheaders in `public/_headers`.
- Controleer dependencies en lockfilewijzigingen.
- Gebruik least privilege voor Cloudflare bindings en externe services.
- Rate-limit gevoelige of kostbare endpoints.
- Bescherm authenticatie, reset- en mutatieflows tegen misbruik.
- Maak geen secrets beschikbaar via `VITE_`-variabelen.
- Documenteer verwerking van uploads vóór implementatie: bestandstype, omvang, malwarecontrole, metadata en toegang.
- Leg incidentrespons en verantwoordelijk disclosure vóór publieke lancering vast.

## 16. Performancebudgetten

Performance ondersteunt de rustige premiumervaring en wordt niet achteraf toegevoegd.

- Route-split niet-kritieke code.
- Importeer libraries gericht en voorkom brede barrelimports die tree-shaking hinderen.
- Voeg een zware dependency alleen toe na bundle-impactcontrole.
- Optimaliseer hero-media en preload alleen het werkelijk kritieke beeld of font.
- Lazy-load afbeeldingen onder de vouw.
- Reserveer vaste aspect ratios.
- Vermijd main-thread-intensieve animaties; animeer bij voorkeur transform en opacity.
- Meet echte gebruikerservaring waar privacytoestemming dit toelaat.

Initieel richtbudget per eerste route, te herijken met echte productinhoud:

| Middel | Richtbudget |
| --- | --- |
| Initiële eigen JavaScript, gzip | maximaal 200 kB |
| Initiële eigen CSS, gzip | maximaal 40 kB |
| Kritieke webfonts | maximaal 2 families en noodzakelijke gewichten |
| Hero-afbeelding | responsief, doorgaans maximaal circa 300 kB op mobiel |

Een overschrijding vereist meting, reden en review; het budget is geen excuus om toegankelijkheid of essentiële functionaliteit weg te laten.

## 17. Build- en deployproces

### 17.1 Lokale commando’s

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm preview
```

`pnpm test` wordt toegevoegd zodra de eerste testsuite wordt geïmplementeerd. Gebruik `pnpm install --frozen-lockfile` in CI.

### 17.2 Productiebuild

De build voert minimaal uit:

1. TypeScript projectcontrole;
2. Vite production build;
3. asset hashing en bundling;
4. kopiëren van Cloudflare-bestanden uit `public`;
5. generatie van statische output in `dist`.

De build mag geen afhankelijkheid hebben van lokale, niet-gecommitteerde bestanden.

### 17.3 Cloudflare Pages-instellingen

| Instelling | Waarde |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Node.js | versie uit `.nvmrc` / ondersteunde LTS |
| Package manager | versie uit `packageManager` in `package.json` |

Previewdeployments worden per pull request gebruikt voor review. Productiedeploy vindt alleen plaats vanaf een goedgekeurde `main`-commit.

### 17.4 CI-pipeline

Elke pull request draait minimaal:

```text
install --frozen-lockfile
typecheck
lint
unit/component tests
build
e2e smoke test tegen preview, wanneer beschikbaar
```

Alle vereiste checks zijn groen vóór merge. Cache dependencies veilig op basis van het lockbestand; cache nooit secrets of gegenereerde omgevingsconfiguratie.

### 17.5 Release en rollback

- Bewaar de commit-SHA bij iedere deployment.
- Gebruik Cloudflare deploymenthistorie voor snelle rollback.
- Databasewijzigingen zijn zo ontworpen dat een vorige frontendversie tijdelijk kan blijven werken.
- Voer destructieve migraties pas uit na een compatibiliteitsvenster.
- Controleer na release hoofdroutes, headers, assets en kritieke interacties.
- Registreer incidenten en leerpunten zonder schuldtoewijzing.

## 18. Codeconventies

### 18.1 TypeScript

- Behoud `strict: true`.
- Gebruik geen `any`; gebruik `unknown` en narrow expliciet.
- Vermijd `as`-asserties; motiveer onvermijdelijke asserts lokaal.
- Geef publieke functies expliciete returntypes wanneer dit het contract verduidelijkt.
- Gebruik unions boven enums, tenzij interoperabiliteit een enum vereist.
- Modelleer geldige toestanden met discriminated unions.
- Gebruik `satisfies` om configuratie te controleren zonder type-informatie te verliezen.
- Vermijd non-null assertions; behandel ontbrekende waarden.
- Gebruik `readonly` waar mutatie niet bedoeld is.
- Gebruik `import type` voor type-only imports waar passend.

### 18.2 Functies en logica

- Houd functies klein en op één abstractieniveau.
- Geef voorkeur aan pure transformaties.
- Gebruik vroege returns om nesting te beperken.
- Gooi getypeerde of genormaliseerde fouten aan systeemgrenzen.
- Gebruik geen booleaanse parameter zonder duidelijke betekenis; kies een optiesobject of aparte functie.
- Optimaliseer pas na meting.

### 18.3 React

- Function components en hooks zijn de standaard.
- Roep hooks uitsluitend op top-level aan.
- Houd render puur.
- Gebruik geen effect voor state die tijdens render kan worden afgeleid.
- Zorg dat effectdependencies volledig en stabiel zijn.
- Gebruik gecontroleerde of ongecontroleerde formulierelementen bewust en consistent.
- Gebruik keys die stabiel zijn in het domein, niet array-index bij veranderlijke lijsten.
- Zet gebruikerscopy in de feature- of contentlaag, niet diep in generieke primitives.

### 18.4 Async code

- Gebruik `async`/`await` en handel verwachte fouten expliciet af.
- Propageren van `AbortSignal` is verplicht voor annuleerbare requests.
- Vermijd zwevende promises.
- Behandel race conditions bij snel wisselende routes, filters of invoer.
- Maak parallelle, onafhankelijke verzoeken parallel; houd afhankelijke stappen sequentieel.

### 18.5 Comments en documentatie

- Code legt uit **wat**; comments leggen uitzonderlijk **waarom** uit.
- Verwijder verouderde comments samen met codewijzigingen.
- Gebruik geen commented-out code; Git bewaart historie.
- Documenteer publieke componentprops wanneer gebruik of toegankelijkheid niet vanzelfsprekend is.
- Werk deze gids en relevante ADR’s bij bij architectuurwijzigingen.

### 18.6 Formatting en linting

ESLint is leidend voor codekwaliteit. Voeg een formatter toe wanneer teambehoefte dit rechtvaardigt en voorkom overlappende conflicterende regels. Gegenereerde code en buildoutput worden uitgesloten van linting.

## 19. Dependencies

Voor iedere nieuwe runtime-dependency wordt beoordeeld:

- lost deze een daadwerkelijk probleem op;
- kan platform- of bestaande code dit betrouwbaar oplossen;
- onderhoudsstatus en releasefrequentie;
- licentie;
- typekwaliteit;
- bundle- en runtimekosten;
- browser- en Cloudflare-compatibiliteit;
- securityhistorie;
- toegankelijkheidsimpact;
- exitstrategie.

Gebruik exacte resolved versies via `pnpm-lock.yaml`. Combineer dependency-upgrades niet met productwerk tenzij noodzakelijk.

## 20. Architecture Decision Records

Materiële keuzes krijgen een bestand onder `docs/adr/` met nummer en korte naam:

```text
docs/adr/0001-use-react-router.md
```

Een ADR bevat:

- status: proposed, accepted, superseded of rejected;
- datum en eigenaar;
- context en probleem;
- beslissing;
- alternatieven;
- positieve en negatieve consequenties;
- migratie- of terugdraaiplan.

ADR vereist bij onder meer routing, globale state, database, authenticatie, analytics, CMS, CSS-framework, monitoringprovider en grote infrastructuurwijziging.

## 21. Definition of Done

Een wijziging is voltooid wanneer:

- scope en acceptatiecriteria zijn behaald;
- architectuurgrenzen en naamgeving kloppen;
- TypeScript, lint, relevante tests en productiebuild slagen;
- loading, leeg, succes, gedeeltelijke data en fouten zijn behandeld;
- keyboard, focus, screenreader, zoom, touch en reduced motion zijn gecontroleerd waar relevant;
- responsive gedrag en realistische contentextremen zijn getest;
- Brand Guide- en UX Guidelines-tokens en patronen correct zijn gebruikt;
- privacy, security en gegevensminimalisatie zijn beoordeeld;
- performance-impact is gemeten bij materiële UI- of dependencywijzigingen;
- logs bevatten geen gevoelige data;
- documentatie, migraties en `.env.example` actueel zijn;
- preview is beoordeeld en rollback mogelijk is;
- geen warnings, debugcode, secrets of bekende regressies achterblijven.

## 22. Beheer van deze gids

Deze Development Guide heeft voorrang op informele conventies, tijdelijke prototypes en persoonlijke voorkeur. Wijzig de architectuur niet stilzwijgend in een featurepullrequest.

Bij iedere materiële wijziging worden vastgelegd:

- datum en eigenaar;
- aanleiding en gewenste uitkomst;
- gewijzigde architectuurgrenzen of conventies;
- impact op merk, UX, security, data en operations;
- migratie- en testplan;
- gekoppelde ADR en Roadmap-beslissing.

Deze gids blijft volledig in lijn met `Brand_Guide.md`, `UX_Guidelines.md` en `Roadmap.md`. Nieuwe technische mogelijkheden zijn geen productgoedkeuring: alleen de Roadmap bepaalt welke functionaliteit daadwerkelijk wordt gebouwd.
