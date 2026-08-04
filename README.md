# Animavidi

Animavidi is een responsive React-app met een premium safari-uitstraling. De
huidige versie bevat de definitieve Welcome Page en tijdelijke
routebestemmingen voor de drie welkomstacties.

## Stack

- React 19
- TypeScript in strict mode
- Vite
- React Router
- CSS Modules en centrale designtokens
- Cloudflare Pages

## Start binnen 5 minuten

### Vereisten

- Git
- Node.js 22 LTS
- pnpm 11, aanbevolen via Corepack

Controleer de installatie:

```bash
node --version
pnpm --version
```

### 1. Clone en open het project

```bash
git clone <github-repository-url>
cd animavidi
```

Vervang `<github-repository-url>` nadat de GitHub-repository is aangemaakt.

### 2. Installeer dependencies

```bash
corepack enable
pnpm install --frozen-lockfile
```

### 3. Start de ontwikkelserver

```bash
pnpm dev
```

Open de lokale URL die Vite toont, standaard
`http://localhost:5173`.

Voor het uitvoeren van scripts kan ook npm worden gebruikt nadat de
dependencies met pnpm zijn geïnstalleerd:

```bash
npm run dev
npm run build
```

Gebruik pnpm voor dependencywijzigingen zodat `pnpm-lock.yaml` de enige bron
van waarheid blijft. Commit geen aanvullend `package-lock.json`.

## Beschikbare scripts

| Script | Doel |
| --- | --- |
| `pnpm dev` | Start de Vite-ontwikkelserver |
| `pnpm typecheck` | Controleert TypeScript zonder output te genereren |
| `pnpm lint` | Controleert de code met ESLint |
| `pnpm build` | Voert typecheck en productiebuild uit |
| `pnpm preview` | Start een lokale preview van `dist` |

Voer vóór iedere pull request minimaal uit:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Routes

| Route | Status |
| --- | --- |
| `/` | Definitieve Welcome Page |
| `/onboarding/start` | Start van een eerste safari |
| `/safari/continue` | Terugkeer naar een bestaande safari |
| `/onboarding/location` | GPS-placeholder of handmatige locatiekeuze |
| `/account/create` | Frontendformulier voor accountaanmaak |
| `/login` | Frontendformulier voor login |
| `/onboarding/passport` | Safari Passport-introductie |
| `/onboarding/complete` | Voltooide onboarding |
| `/demo` | Tijdelijke routebestemming |

Account-, login- en locatiegegevens worden uitsluitend lokaal gevalideerd en
niet opgeslagen of verzonden. De demo bevat bewust nog geen
productfunctionaliteit.

## Projectstructuur

```text
src/
├── app/          # Router en applicatiecompositie
├── components/   # Herbruikbare, productonafhankelijke UI
├── features/     # Featuremodules en routes
├── hooks/        # Gedeelde React-hooks
├── lib/          # Technische infrastructuur en helpers
├── styles/       # Globale tokens en basisstijlen
└── types/        # Gedeelde TypeScript-typen

docs/             # Permanente merk-, UX-, techniek- en roadmapdocumentatie
public/           # Cloudflare Pages-bestanden en statische assets
```

## Documentatie

Lees deze bronnen voordat product- of interfacewerk wordt uitgevoerd:

- `docs/Brand_Guide.md` — visuele identiteit en designtokens
- `docs/UX_Guidelines.md` — interactie-, toegankelijkheids- en schermregels
- `docs/Development_Guide.md` — technische architectuur en conventies
- `docs/Roadmap.md` — versieplanning, scope en releasepoorten

Deze documenten zijn de permanente bron van waarheid voor verdere
ontwikkeling.

## Approved visual references

De goedgekeurde referenties in `docs/designs/` zijn de verplichte visuele bron
van waarheid voor layout, compositie, typografie, witruimte, kleuren en
visuele hiërarchie. Een scherm met een goedgekeurde referentie wordt tegen die
afbeelding ontworpen en beoordeeld.

## Omgevingsvariabelen

Kopieer `.env.example` alleen wanneer een toekomstige feature dit vereist:

```bash
cp .env.example .env.local
```

Alleen variabelen met prefix `VITE_` zijn beschikbaar in de browser en moeten
als openbaar worden beschouwd. Commit nooit `.env.local`, tokens of secrets.

## Tijdelijke hero-afbeelding

De Welcome Page gebruikt tijdelijk een externe Unsplash-placeholder. Vervang
deze vóór een definitieve contentrelease door een goedgekeurde lokale merkasset
met vastgelegde rechten en een geschikt responsief brandpunt.

## Cloudflare Pages

| Instelling | Waarde |
| --- | --- |
| Framework preset | `Vite` |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Node.js | `22` |

`public/_headers` en `public/_redirects` worden tijdens de build automatisch
naar `dist` gekopieerd. De redirects ondersteunen directe navigatie naar
client-side routes.

## Licentie

Animavidi wordt beschikbaar gesteld onder de MIT License. Zie `LICENSE`.
