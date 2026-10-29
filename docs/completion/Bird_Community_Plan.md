# Revised bird scope — approved 29 October 2026

The user approved a first collection of 100 frequently recorded Kruger birds, with other species supplied through administrator-approved community suggestions. The previous target to fully illustrate/profile all 546 checklist birds is superseded for the first release. Existing checklist records and sighting IDs remain available; nothing is deleted.

## Implemented in this batch

- Public name/description suggestion form, optional scientific name/source link. Text only; no public photo upload is introduced.
- Central D1 pending queue; suggestions are not publicly listed until the existing authenticated administrator approves them.
- Private moderator edits, notes, rejection, review-status filters and paginated queue.
- Atomic approval/publication through a SQL trigger; a fixed community species ID is allocated at submission and preserved through edits/approval.
- Duplicate name/scientific-name checks, bounded request bodies, exact-origin writes, server-side submission limits and optimistic review revisions.
- Public approved catalogue feeds search, detail pages, the species picker, sightings, map labels and Passport. Public catalogue cache supports previously fetched species when offline; existing IndexedDB records are unchanged.
- Public clients refresh on bird-page entry, focus and every 30 seconds while visible. The server makes an approved record available immediately; existing open clients update on their next refresh, not through a push notification.

## Infrastructure/release requirements

Migration `0002_bird_proposals.sql` adds only new tables/indexes/triggers. It has been exercised locally, not applied to the live database. The new Worker and frontend are not deployed. Apply the reviewed migration to the verified Animavidi content database as part of a coordinated tested release. The old Worker will not support the new form/catalogue endpoints.

The existing single-administrator login is retained. Suggestions do not create explorer accounts or publish the submitter's identity. No external notifications are sent. Pending/rejected content and review notes remain private.

## 100-species content checkpoint

Selection, photo rights/visual checks and sourced profiles remain separate completion requirements. Initial regional SABAP2 API requests timed out. The published [Birda Kruger checklist](https://birda.org/kruger-national-park-birding-checklist/) supplies 531 rows of historical SABAP2 observation counts. `scripts/select-starter-birds.mjs` extracts the highest 100 confidently matched existing species IDs into `src/features/birds/data/starterBirds.json`, with counts, source names, a table checksum and unmatched rows. Its companion PDF confirms the Cape Starling / Cape glossy starling, Hadada / Hadeda Ibis and Striated / Green-backed Heron common-name mappings through matching scientific names. Broader/split taxa are not silently matched: examples include Northern Red-billed Hornbill, White-browed Coucal, Eurasian Hoopoe and Northern Carmine Bee-eater. This is a prioritisation shortlist, not a definitive current top 100.

Historical reporting frequency is not a 2026 abundance estimate, a probability of a sighting, or a guarantee of occurrence in every season/region. The source does not supply observation periods/effort per row; the page's publication date could not be extracted reliably, and is recorded as unknown. All 546 checklist species remain searchable. The default list is the starter selection plus approved community birds; the full list remains a button away.

Current starter content: **10/100 attributed, visually reviewed photographs and 2/100 complete sourced profiles**. Seven new bird photos were reviewed in this batch; swift/swallow/distant eagle candidates remain quarantined. Profiles for African Fish Eagle and Saddle-billed Stork cite the 2025 BirdLife South Africa accounts and distinguish regional assessments from their reported global assessments. No population counts or current sighting probabilities were invented.

`pnpm validate:starter-birds` is the strict 100-bird content gate and intentionally fails until content is complete. `--inventory-only` checks the selected IDs and reports progress without approving a release. `pnpm validate:release-starter-images -- --manifest=...` explicitly checks 148 mammals plus 100 selected birds. The old full-checklist image audit remains available; it is not silently changed to pass. Community suggestions require name/description and approval; photographs are optional and remain a separate administrator photo workflow.

Do not label 100 profiles/photos complete merely because a priority list exists. Do not mark the old whole-checklist image gate passed by excluding species silently; document the revised release set and its validation explicitly.


## Beta implementation update, 29 October 2026

All checklist birds remain usable without full profiles or photography. Moderated contributions now cover missing species, photo uploads, name corrections and supplementary information. Existing-species contributions attach to stable IDs as credited community material; official checklist names and IDs remain intact. Only approved rows are public. Original author, target, contribution kind and photo permission cannot be changed by moderator edits. Photos require a declared ownership grant under CC BY 4.0, browser re-encoding, bounded server upload and visual administrator review; pending/rejected image URLs return 404 publicly. Migration 0003 narrows catalogue publication to new-species approvals while preserving the original queue and history.

Verified locally: private submission, origin/session/body/rate checks, text and photo approval/rejection, stale-write protection, duplicate identities, immutable author/rights, binary photo round-trip, failed storage, catalogue pagination and browser image decoding. Actual Cloudflare preview validation remains pending. Local journals have no cloud identity or automatic device sync.

Final verification: real isolated Cloudflare D1/R2, authenticated private image review, approval/publication, primary image CRUD, CMS revisions/conflicts and data persistence passed. See `Beta_Verification.md`; all cloud test fixtures were removed.
