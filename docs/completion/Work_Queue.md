# Completion work queue

Baseline: `9e38d30e135e72faa452eda0109eedea6d2a16ce`, branch `feat/complete-kruger-content`, existing draft PR #1. No production release until all gates pass. Existing IDs, IndexedDB records and map remain authoritative.

## Beta checkpoint 2026-10-29

The latest user instruction makes functionality and an accessible isolated beta the delivery gate; completing all photography/profiles is deferred. See `Beta_Verification.md` for the final tested scope, preview URL, limitations and evidence.

- [x] All checklist birds usable with placeholders; alias search and correct Passport totals.
- [x] Moderated new birds, photos, corrections and information; immutable author/rights; private review and public approval.
- [x] My Animavidi, visited camps, private photo backups and additive import.
- [x] Existing validators and browser checks; real preview D1/R2/auth and responsive UI.
- [x] Data survives browser reopen, repeat deployment and admin logout/login.
- [x] Real Big Five/rare/legendary browser transitions; cloud CMS/history/conflict checks.
- [x] Remove exact isolated test fixtures and verify removal.
- [ ] Complete deferred photo/profile coverage and original asset rights review before the definitive release.
- [ ] Obtain explicit permission before a production release.

## Original full-content checkpoint (historical)

- [x] Verify remote branch and PR match the supplied commit; clone exact branch.
- [x] Read saved completion notes, roadmap, content models and admin modules.
- [x] Install dependencies with unchanged frozen lockfile.
- [x] Generate complete per-species local photo/profile/task inventory (694 entries).
- [ ] Automate licensed photo candidate collection with resumable metadata and quarantine.
- [ ] Review every candidate visually; approve only identifiable species with suitable rights.
- [ ] Resolve checklist taxonomy collisions before name-based photo matching.
- [ ] Complete reviewed species profiles using the format below and per-claim sources.
- [x] Obtain the original 36-page `Park Map.pdf`; now available from the user-provided Windows Downloads path. Identity and review recorded in `Route_Review.md`.
- [x] Audit the three existing guides and add seven main-road guides across southern, central and northern Kruger. Broader road-network coverage remains incomplete.
- [ ] Test current admin, photo operations, persistence and concurrency locally.
- [ ] Finish missing admin functions and test them with isolated fixtures.
- [ ] Verify real API origins, auth/CORS, D1 and R2 integration; preserve all live data.
- [ ] Run full release gates and inspect app in browser; release only after completion.

## Species format

Stable ID, common/scientific name and taxonomy references; introduction; identification features; habitat; behaviour; diet; group structure; conservation status with assessment source/date; interesting facts. Record checked date and source URLs for every factual section. Rewrite factual summaries; do not copy source prose. Unknown/unverified fields stay visibly pending. Checklists prove inclusion, not all profile claims.

## Initial route inventory (superseded by Route_Review.md)

| Existing guide | Roads currently declared | Outstanding verification |
| --- | --- | --- |
| Along the Sabie River | H4-1 | Brochure junctions, Nkuhlu access, endpoints and road continuity |
| Orpen to Satara | H7 | Brochure endpoint connectors and Satara access; historic repair notice is not current status |
| Via Tshokwane | H1-2 / H10 | Brochure junction at Tshokwane and camp approach connectors |
| Northern coverage | Missing | Brochure-based route selection and connected road sequences |
| Central coverage beyond H7 | Missing | Brochure-based route selection and connected road sequences |

The current route schema contains road names, not a verified road graph. No route can yet be called connectivity-validated. Preserve the Animavidi vector map; do not replace it with brochure artwork.

## Admin inventory

| Function | Repository implementation | Remaining work |
| --- | --- | --- |
| Login/session/logout and protected routes | Implemented | Rerun local browser/auth tests; actual-domain integration |
| Animal search and profiles (694) | Implemented | Recheck saves/errors/stale writes; reviewed source coverage |
| Photo add/replace/remove | Implemented, R2 | Local and actual R2 integration, attribution workflow |
| Route create/edit/publish/unpublish | Implemented, D1 | Recheck persistence/conflicts and public visibility |
| Revision history | Database trigger | Inspect/recover workflow not exposed to administrator |
| Users | Coming-later placeholder | No server user-account store; personal sightings are local IndexedDB. Do not invent users or migrate personal data silently |
| Reports & Analytics | Coming-later placeholder | Implement honest content coverage/reporting; no fabricated visitor metrics |
| Species creation | Not implemented | Stable-ID/taxonomy workflow and catalogue consistency required |

## Recovery and storage

Run inventory again after each accepted batch. Keep candidates separate from approved assets. For a failed/uncertain GitHub write, read the remote head/files before retrying. Record each batch, tests and verified commit below. Never mark a test passed from a prior-run note.

## Current validation

Pending this checkout's baseline tests. Historical tests are described in `../Kruger_Completion_Status.md` and require a fresh run.

### Batch 1: photo workflow and eight mammals

- Eight visually checked mammal images prepared; 38 packaged photos total, 656 missing.
- Candidate metadata and explicit review decisions saved; unapproved images remain in ignored work/photo-candidates.
- Commons sometimes reports cirrussearch-too-busy-error. Collector saves each species, throttles requests and stops on backpressure.
- Fresh typecheck, lint, production build, SQLite Worker tests and reviewed-photo validator passed. Browser passed on installed Edge, including real multiline profile/route persistence, bird sightings/Passport, mammal/bird image loading and public attribution.
- Browser loader now accepts Windows module paths. No multiline editor bug was found; source was already correct.
- Brochure path supplied by user is unavailable in both current local and connector environments; waiting for accessible original.


### Batch 2: content reports and revision recovery

- Added protected /admin/reports with actual catalogue/remote-manifest coverage, profile-field/source gaps, filtering and CSV export. No visitor analytics or user records invented.
- Added authenticated paginated history inspection (20 rows/page), field preview and restore through existing conditional writes. Restoring retains the displaced version via the existing D1 trigger; no migration or production writes required.
- Fresh tests passed for unauthorized/disallowed-origin history access, invalid cursors, 25-version pagination without duplicates, restoration and retained history; browser passed restore-to-published and report CSV download.
- All baseline validators passed, along with typecheck, lint, production build and Wrangler dry-run. Full-image release gate remains expected to fail for incomplete coverage.
- Desktop/mobile report screenshots inspected; summary cards compacted afterwards.


### Batch 3: sourced profiles, taxonomy and live-readiness evidence

- Four source-linked profile summaries added (aardvark, aardwolf, banded mongoose, black-backed jackal), with source authors/sections and review dates. Conservation assessment and current taxonomy remain pending; 668 species have no sourced expanded profile, four have partial sourced profiles and 22 legacy profiles still need source review.
- Six additional visually approved mammal photos added; packaged total 44/694, missing 650 (112 mammals, 538 birds). Doubtful candidates and non-animal plates/maps remain quarantined.
- Corrected the European roller, Golden weaver and Barred owlet source-name errors with primary taxonomy/Roberts evidence, preserving source names and stable IDs. All other taxonomy remains subject to review.
- Collector now checks exact Commons taxon categories before search, stores checkpoints and backs off on overload. Added exact-hash candidate recovery after a new checkout.
- Read-only live probes: photo manifest HTTP 200 and empty; allowed-origin unauthenticated session HTTP 401; bad-origin session HTTP 403; deployed content endpoints HTTP 404. Actual manifest is saved. No login, upload, live content write, deployment or merge attempted.
- Final lint/typecheck/build and all local validators passed after fixing strict unknown-object validation in the new history client. Wrangler dry-run passed. Full-image release gate fails as expected. Final browser run recorded separately below.
- Required input: original 36-page brochure must be made accessible; the supplied Linux upload path is absent from this session.


- Final Edge browser run passed: bird sighting create/edit/delete and Passport; animal source/image/credit loading; admin multiline persistence; route unpublish and history restore; filtered report CSV export. Final mobile report screenshot inspected. No JavaScript errors.


### Batch 4: original brochure and ten reviewed route guides

- Original Park Map.pdf received at the supplied Windows Downloads path; 36 pages, identity hash and printed/PDF page offset recorded in Route_Review.md. Missing-file blocker resolved.
- Visually inspected printed map pages 7–16, enlarged Satara/Tshokwane junctions and cross-page northern connections. Added seven guides; ten total (3 south, 3 central, 4 north). Corrected existing approach/connector descriptions and the Tshokwane H1-3 out-and-back.
- Added machine-readable route evidence and validator for endpoint/stop sequences, road order and critical connector regressions. This is reviewed planning-level topology, not surveyed navigation or current access certification.
- Added dated official Skukuza access notice and linked current park information. No brochure artwork/scans/photos copied into the app. Animavidi map files, sighting persistence and user data remain unchanged.
- Validation passed: route validator, ESLint, typecheck/production build and full Edge browser suite (all region filters, northern guide, corrected Tshokwane text, existing admin save/unpublish/history restore, reports and sightings). Desktop route screenshot inspected. No deployment or merge.


### Batch 5: approved 100-bird scope and community moderation

- User-approved first-release scope: 100 frequently recorded birds plus community additions after administrator approval; retain all 546 checklist IDs and all saved sightings.
- Added central pending/rejected/approved proposal lifecycle, private editing/review notes, atomic approval/publication, history, fixed IDs, duplicate checks, exact-origin writes, bounded bodies, submission limits and stale-review protection. Additive migration 0002 is local only; no remote migration or deployment.
- Public approved catalogue integrated with list/search/picker/details/sightings/map labels/Passport and offline public-catalogue cache. Initial browse uses selected100 plus approved birds; full checklist/search retained. Existing clients refresh on focus/entry and every30 seconds while visible.
- Reproducible100-ID priority list sourced from531 published historical Kruger SABAP2-count rows at Birda. Date/effort of snapshot not established; not labelled current2026 abundance. Three verified common-name aliases used; uncertain split taxa/source names remain unmapped.
- Seven bird photographs visually approved and credited; uncertain swift/swallow/distant eagle candidates quarantined. Starter coverage10/100 photos,2/100 sourced complete profiles. BirdLife2025 regional/global assessment distinctions retained.
- Added explicit starter content/image gates; both remain blocked for incomplete content. Overall inventory51 packaged photos,643 missing; old exhaustive bird content requirement superseded for first release.
- Backend tests passed for privacy, moderation, stable IDs, history, duplicates, optimistic revisions, body/origin/auth/rate checks and catalogue pagination. Browser passed independent visitor visibility only after approval, direct links/search, sighting creation and Passport after reload. Final source/visual checks recorded below.


- Final checks: lint, typecheck/build, all functional validators and Wrangler dry-run passed. Full browser suite passed for default100/full546 toggle, existing flows, moderation across separate visitor/admin contexts, and Passport reload with simulated catalogue outage. Mobile submission/review screenshots inspected. Strict starter content/image gates correctly remain failing (10 photos,2 profiles;46/248 starter-scope image records including mammals).



## Account/cloud/PWA follow-up — 29 October 2026

Implementation and local/native Cloudflare tests completed; see [Account_Cloud_Status.md](Account_Cloud_Status.md) for evidence and resumable release gates. Real activation/reset email and physical-device installation remain unverified. Shared beta and production were not promoted.


## Resend continuation — 29 October 2026

- [x] Server-only Resend transport, fixed sender, bounded retries/idempotency and mock tests.
- [x] Atomic single-use activation and reset expiry/replay tests, generic non-blocking reset responses.
- [x] Repeat backend and integrated offline/migration/browser tests.
- [ ] Guido: verified mail.animavidi.com and RESEND_API_KEY Worker-version secret; see Resend_Integration.md.
- [ ] Live delivery test, physical-device install checks and controlled beta-only promotion remain gates.


## Final beta activation — 29 October 2026

- [x] Exact candidate audited; source/secret/binding correspondence and private rollback backup recorded.
- [x] Account, existing CMS/catalogue, privacy, two-browser sync, conflict, offline bird/mammal/photo browser-restart and PWA update/installability gates passed.
- [x] Candidate e0cf3b4d-0b1f-43ec-9da0-8e8ddc95e082 activated on the existing beta URL at 100%, with no new build/upload or main merge.
- [x] Beta erasure retry schedule applied and read back; full native smoke suite, existing-data comparison and zero-critical-error log window passed.
- [x] Production resources and main unchanged; prior Worker and cron configuration available for rollback.
- [ ] Manual physical-device iOS/iPadOS/Android PWA install acceptance; natural full token lifetime waiting remains unclaimed. These are recorded acceptance limits, not a request to modify production.
