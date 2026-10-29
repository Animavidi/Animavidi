# Kruger completion work, updated 29 October 2026

Status: IN PROGRESS. This branch is not a production release and does not claim that the whole Animavidi roadmap is complete.

## Latest resumed checkpoint, 29 October 2026

This section supersedes earlier counts and connectivity observations below; historical checkpoints are retained for audit.

- Resumed from verified remote commit `9e38d30e135e72faa452eda0109eedea6d2a16ce` on the existing branch/PR. Complete per-species inventory and recovery queue: `docs/completion/Work_Queue.md`, `Species_Tasks.md` and `species-inventory.json`. Regenerate with `node scripts/inventory-completion.mjs`.
- Packaged photographs: **44/694** (original 22, previous 8 birds, 14 newly reviewed mammals). **650 missing**: 112 mammals and 538 birds. Individual source/author/licence, transformation and checksum records are in the bird/mammal credit manifests. New image candidates are collected automatically and kept outside the app until explicit visual approval. Uncertain cat/otter/gerbil/hare/mongoose/rhebok candidates are recorded separately.
- Four factual profile summaries now include sources, authors and checked dates, with conservation assessment/current taxonomy explicitly pending. 668 species still lack a sourced expanded profile; the original 22 profiles also need source review. These four summaries are not counted as fully reviewed complete profiles.
- Source errors corrected without changing any stable ID: European roller → `Coracias garrulus` (BirdLife South Africa); Golden weaver → `Ploceus xanthops` (SANParks Roberts number 816 matched to SABAP account); Barred owlet → `Glaucidium capense` (Roberts 399 matched to the SABAP record). Original scientific names are retained in each record. This is not a full-catalogue taxonomy audit.
- Admin now has a protected content report with filters and CSV export, plus authenticated paginated revision inspection and restore through existing optimistic writes/history. User accounts remain a placeholder because there is no central explorer identity store; IndexedDB sightings were not migrated or exposed. Full user/account administration and species creation remain incomplete.
- Read-only live probes now succeed from Node: `/api/photos` returns HTTP 200 with an empty override map; `/api/admin/session` correctly returns 401 without a session from the allowed origin and 403 from an unapproved origin. `/api/content` and `/api/admin/content` return 404 on the currently deployed Worker. The branch Worker has not been deployed; no live data was written. Evidence is in `docs/completion/live-readiness.json` and `current-photo-manifest.json`.
- The original 36-page brochure is now accessible from the Windows Downloads path supplied by the user. Printed map pages 7–16 (PDF pages 8–17) were visually reviewed. The three previous guides were corrected and seven main-road guides added, for **10 reviewed guides** across all three regions. Page references, document hash, connection sequences and limitations are in `docs/completion/Route_Review.md` and `route-connectivity.json`. Tshokwane's H1-3 out-and-back, Satara's H1-4 connection and Lower Sabie's H10 bridge connection are explicit. This resolves the missing-brochure blocker; live access/full road-network coverage remain unverified. The Animavidi map is unchanged.
- Local checks cover the complete baseline validators, additional sourced-profile/photo checks, real multiline saves, paginated history, restore/publication, report CSV download and retained sightings/Passport. See the queue for per-batch results. The full-image release check intentionally fails while 650 species lack images. Actual authenticated-domain/R2 integration and final release tests remain outstanding.

## Implemented in this branch

- 546 numbered bird checklist entries from the current SANParks page, with stable `bird-` identifiers, common/scientific name search, detail pages and the existing sighting creation flow.
- Existing 148 mammals, original 22 packaged photographs, existing sighting IDs, IndexedDB schema, Passport and achievement logic retained.
- Birds included in the global species chooser, personal sightings and Passport species collection.
- Three initial route guides: H4-1 Skukuza–Lower Sabie, H7 Orpen–Satara, and Skukuza–Tshokwane–Lower Sabie via H1-2/H10. Region filtering, sources and content-review dates are visible. These are planning descriptions, not live road status or GPS navigation.
- Administrator profile editing for all checklist entries and route creation/editing/publishing/unpublishing.
- Content stored in Cloudflare D1, with SQL migration, atomic optimistic concurrency checks and revision-history trigger. R2 remains the photo store.
- Existing authenticated photo operations accept bird IDs. A failed photo replacement preserves the previous photograph.
- Runtime validation of content responses, bounded streamed write bodies, source URL validation and exact-origin authenticated writes.

## Evidence and limitations

Bird source: https://www.sanparks.org/parks/kruger/explore/fauna-flora/birds/checklist (checked 2026-10-28). All numbered entries 1–546 were transcribed. The list is retained as source data, not a claim that SANParks taxonomy has no errors. Examples needing editorial reconciliation before release include European roller/Lilac-breasted roller sharing `Coracias caudatus`, Golden weaver/Yellow weaver sharing `Ploceus subaureus`, and the scientific name supplied for Barred owlet. Do not source images solely from these scientific names until reconciled.

Brochure: user-supplied `Park Map.pdf`, 36 scanned PDF pages. Printed map pages 7–10 support the initial route descriptions. The scan is a reference; its artwork and photography have not been republished. Numeric distance/arrival estimates and map coordinates were not inferred from unreliable OCR.

Route corroboration:

- https://www.sanparks.org/parks/kruger/what-to-do/facilities/picnic-sites
- https://www.sanparks.org/news/update-on-road-infrastructure-in-kruger-national-park-following-january-2026-floods
- https://www.sanparks.org/news/update-on-road-and-tourism-camp-access-following-sever-weather-conditions-in-kruger-national-park

Historical reopening reports establish route identity, not current availability. The app explicitly directs travellers to current SANParks notices and reception.

## Release blockers

1. Images: 30 packaged photographs are present: the original 22 mammals and 8 reviewed, attributed bird images. The other 126 mammals and 538 birds still need photographs. User-provided Cloudflare screenshots on 29 October show one bucket object, `test.jpg.jpg`, which is not a species override. No brochure artwork was copied. Direct Wikimedia image/metadata retrieval now works and the first eight reviewed bird assets are packaged with their individual Creative Commons records.
2. Editorial profiles: the original detailed 22 mammal profiles remain; the other profiles still need reviewed species content. The editor is functional, but empty text has not been disguised as complete content.
3. Route coverage: three sourced guides are present; this is not a complete road network or complete northern route collection. Expand only using verified road connections and sources.
4. Production infrastructure: Cloudflare connected on 29 October. Dedicated `animavidi-content` D1 database created and migration applied; real database/account IDs are in Worker configuration. Version 6 has the D1 binding and retains the existing R2/secret bindings, but is NOT deployed to production traffic. Production HTTP/auth/CORS smoke tests remain required; HTTP requests from this environment returned 403 even for the new version preview.
5. Production smoke tests, authentication/CORS on actual domains, R2 upload verification, D1 binding and visual approval remain release requirements.
6. Original broader roadmap limitations still apply, including demo identity/account flows, sync, premium/community, offline app shell and production map licensing. These features have not been represented as completed.

## Checks

Run `pnpm typecheck`, `pnpm lint`, `pnpm build`, every `scripts/validate-*.mjs` and `pnpm exec wrangler deploy --dry-run --config worker/wrangler.jsonc`.

`pnpm validate:kruger-content` uses Node 24 and an in-memory SQLite database with the actual D1 migration. It exercises persisted content, auth/origin restrictions, validation, stale writes, history, draft visibility, and failed photo replacement. It does not connect to production.

Browser checks use Chromium against a local Vite server, preserving production data. The suite is in `scripts/test-browser.mjs`. It also exercises admin login, persisted profiles, route editing and unpublishing through the real Worker handler with isolated SQLite/R2 fixtures. Install Playwright locally or supply `PLAYWRIGHT_MODULE_PATH`; optionally set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chromium binary. No production credentials or data are used. The recorded completed checks and remaining release gates are described in the PR.

No production deployment or merge is authorized by this status file. The user requested a tested complete release; the blockers above must be resolved first.

## Infrastructure checkpoint, 29 October 2026

- Account: the verified Luxury Safari Homes account, containing the existing Animavidi Worker and R2 binding. Other applications and their databases were not changed.
- D1: `animavidi-content`, ID `b45bb37d-cf6d-4013-8f5f-f827d67e7d9f`. Migration verified to include both tables, history index and revision trigger. Real D1 tests passed for insert, conditional update, rejected stale update and prior-version history. Only the isolated validation record/history were deleted afterwards; the database contains no editorial documents yet.
- Prepared Worker version: `6209c60d-a0a5-44c4-a4e7-e17c7507a269` (version 6). Metadata verification confirms all seven required bindings, including inherited secrets and `animavidi-mammal-photos`. Creating this version did not deploy it.
- Deployment history still sends 100% of production traffic to `bcd07c8e-f840-47c8-b32f-d8566b50a112`, the previous version. No deployment call was made.
- The connector can inspect Worker bindings and D1 but exposes no R2 bucket/object listing operation. R2 object count and photo coverage remain unknown. HTTP requests to the version preview's content/photo/session endpoints returned 403, so no successful endpoint smoke test is claimed.
- `pnpm validate:release-images` intentionally fails while coverage is incomplete/unverified. Without a current manifest it reports 22 locally confirmed photographs out of 694 entries and 672 unverified entries (126 mammals and 546 birds). This does not claim the live bucket is empty. A current manifest is required for the coverage gate; image correctness, successful loading and approved rights still need review.

## Image checkpoint, 29 October 2026

The user's dashboard screenshots show one object in `animavidi-mammal-photos`: `test.jpg.jpg`, 111.81 KiB. This is not a recognized `mammals/<species-id>/primary.*` override. The test object was left untouched. This dashboard evidence supersedes the earlier unknown bucket inventory; live API smoke tests are still pending.

Eight bird images have now been downloaded from their Commons sources, visually reviewed for the depicted species, resized (no source crop) to at most 1600 pixels, converted to WebP, and included in the existing photo-resolution/admin/sighting flow: African fish eagle, Lilac-breasted roller, Kori bustard, Lappet-faced vulture, Martial eagle, Pel's fishing owl, Saddle-billed stork and Southern ground hornbill. `src/assets/birds/photo-credits.json` retains authors, source pages, selected licences, transformation notes and original/optimized checksums. Detail pages and `/photo-credits` provide public attribution; the same recorded licence applies to each WebP derivative.

This is an initial reviewed batch, not complete image coverage. Current packaged coverage is 30/694 entries; 664 still have no approved species image (126 mammals, 538 birds). Existing elephant/lion/cheetah source-rights checks recorded in the original mammal asset manifest also remain open. `validate:reviewed-photos` checks source links, author/licence fields and image hashes. The full-image release gate remains blocked until complete coverage and runtime verification.
