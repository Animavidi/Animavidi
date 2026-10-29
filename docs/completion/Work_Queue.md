# Completion work queue

Baseline: `9e38d30e135e72faa452eda0109eedea6d2a16ce`, branch `feat/complete-kruger-content`, existing draft PR #1. No production release until all gates pass. Existing IDs, IndexedDB records and map remain authoritative.

## Checkpoint 2026-10-29

- [x] Verify remote branch and PR match the supplied commit; clone exact branch.
- [x] Read saved completion notes, roadmap, content models and admin modules.
- [x] Install dependencies with unchanged frozen lockfile.
- [x] Generate complete per-species local photo/profile/task inventory (694 entries).
- [ ] Automate licensed photo candidate collection with resumable metadata and quarantine.
- [ ] Review every candidate visually; approve only identifiable species with suitable rights.
- [ ] Resolve checklist taxonomy collisions before name-based photo matching.
- [ ] Complete reviewed species profiles using the format below and per-claim sources.
- [ ] Obtain the original 36-page `Park Map.pdf`; path requested from user. Absent from checkout and Codex work folders.
- [ ] Audit every existing route junction against brochure; expand southern, central and northern coverage.
- [ ] Test current admin, photo operations, persistence and concurrency locally.
- [ ] Finish missing admin functions and test them with isolated fixtures.
- [ ] Verify real API origins, auth/CORS, D1 and R2 integration; preserve all live data.
- [ ] Run full release gates and inspect app in browser; release only after completion.

## Species format

Stable ID, common/scientific name and taxonomy references; introduction; identification features; habitat; behaviour; diet; group structure; conservation status with assessment source/date; interesting facts. Record checked date and source URLs for every factual section. Rewrite factual summaries; do not copy source prose. Unknown/unverified fields stay visibly pending. Checklists prove inclusion, not all profile claims.

## Route inventory

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
