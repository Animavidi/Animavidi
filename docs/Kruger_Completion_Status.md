# Kruger completion work, 28 October 2026

Status: IN PROGRESS. This branch is not a production release and does not claim that the whole Animavidi roadmap is complete.

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

1. Images: only the original 22 packaged photographs are confirmed locally. The other 126 mammals and all 546 birds still use the existing neutral fallback unless a live R2 override exists. Public photo-manifest and Wikimedia retrieval returned HTTP 403 in this environment, so remote coverage could not be audited. No stock images or brochure artwork were substituted without a verified source and rights record.
2. Editorial profiles: the original detailed 22 mammal profiles remain; the other profiles still need reviewed species content. The editor is functional, but empty text has not been disguised as complete content.
3. Route coverage: three sourced guides are present; this is not a complete road network or complete northern route collection. Expand only using verified road connections and sources.
4. Production infrastructure: Cloudflare is not connected in this work session. A real D1 database ID, binding and applied migration are required. No fake database ID is committed. Without `CONTENT_DB`, content endpoints return a deliberate 503 and packaged public content still works.
5. Production smoke tests, authentication/CORS on actual domains, R2 upload verification, D1 binding and visual approval remain release requirements.
6. Original broader roadmap limitations still apply, including demo identity/account flows, sync, premium/community, offline app shell and production map licensing. These features have not been represented as completed.

## Checks

Run `pnpm typecheck`, `pnpm lint`, `pnpm build`, every `scripts/validate-*.mjs` and `pnpm exec wrangler deploy --dry-run --config worker/wrangler.jsonc`.

`pnpm validate:kruger-content` uses Node 24 and an in-memory SQLite database with the actual D1 migration. It exercises persisted content, auth/origin restrictions, validation, stale writes, history, draft visibility, and failed photo replacement. It does not connect to production.

Browser checks use Chromium against a local Vite server, preserving production data. The suite is in `scripts/test-browser.mjs`. It also exercises admin login, persisted profiles, route editing and unpublishing through the real Worker handler with isolated SQLite/R2 fixtures. Install Playwright locally or supply `PLAYWRIGHT_MODULE_PATH`; optionally set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chromium binary. No production credentials or data are used. The recorded completed checks and remaining release gates are described in the PR.

No production deployment or merge is authorized by this status file. The user requested a tested complete release; the blockers above must be resolved first.
