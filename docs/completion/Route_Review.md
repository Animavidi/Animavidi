# Brochure route review — 29 October 2026

The original user-provided `Park Map.pdf` is now accessible and has been inspected visually. This resolves the earlier missing-file blocker.

- 36 PDF pages; SHA-256 `757f5095149e5502bdfbd1cb4db44a550618703d80ede0cbef151c8e2cc41468`.
- Printed map pages **7–16** correspond to PDF pages **8–17**, not the same page numbers. The five map spreads cover southern, central and northern Kruger.
- Numbered roads and intersections were traced on rendered pages, with enlarged inspection of the Satara and Tshokwane junctions. OCR alone was not used as road evidence.
- The brochure is historical/undated in this review and includes a 2011 animal-count table. It does not establish current road openings, gate arrangements, animal numbers or journey times.
- No brochure scan, artwork or photographs were added to the app or repository. The existing Animavidi map and overlays were retained unchanged.

## Reviewed guides

| Guide | Signed main-road sequence | Printed pages | Connection review |
| --- | --- | --- | --- |
| Along the Sabie River | H4-1 | 7–8 | Camp approaches and Nkuhlu access distinguished from numbered road |
| Orpen to Satara | H7 → H1-4 | 9–10 | Northward turn at H7 eastern junction before Satara camp access |
| Via Tshokwane | H1-2 → H1-3 → H1-3 return → H10 | 8, 10 | Picnic site is north of H10 junction; short out-and-back made explicit |
| Lower Sabie to Crocodile Bridge | H10 → H4-2 | 8 | Includes Sabie River road-bridge connector before southbound H4-2 |
| Satara to N’wanetsi | H1-4 → H1-3 → H6 | 10 | H6 starts south of Satara, not at the camp entrance |
| Olifants to Letaba | H8 → H1-5 → H1-6 | 12 | Westbound H8 then northbound main road; final camp access explicit |
| Letaba to Mopani | H1-6 | 12–14 | Cross-spread continuity checked; H15/Giriyondo turn excluded |
| Mopani to Shingwedzi | H1-6 | 13–14 | S143/S144 alternatives excluded from the main-road guide |
| Shingwedzi to Babalala | H1-6 → H1-7 | 14–16 | Main-road continuation and northern S56 picnic access checked |
| Punda Maria Gate to Pafuri Gate | H13-1 → H1-8 → H1-9 | 15–16 | North across Luvuvhu, then west to park entrance; international border post distinguished |

Unnumbered facility/camp approaches are explicitly represented as `null` road entries between named adjacent nodes in `route-connectivity.json`. They are not newly invented numbered roads. The evidence records the planning-level sequence, not surveyed turn geometry or every internal driveway. Run `node scripts/validate-safari-routes.mjs` to check catalogue/evidence consistency, endpoint/stop inclusion, road order and the Tshokwane return leg.

## Online corroboration and access notices

- [SANParks picnic facilities](https://www.sanparks.org/parks/kruger/what-to-do/facilities/picnic-sites) independently identifies Tshokwane on H1-3 and N’wanetsi at the end of H6, along with the named designated stops.
- [SANParks Skukuza notice, 26 October 2026](https://www.sanparks.org/news/temporary-closure-of-skukuza-rest-camp-main-gate-for-essential-maintenance) announces main-gate works planned for 2 November–4 December 2026 and temporary access via Hippo Circle Street, AM Spa and Skukuza Safari Lodge. Planned completion is conditional; it is not an automatic reopening guarantee.
- [SANParks park information/news](https://www.sanparks.org/parks/kruger) is the public reference for further announcements. The public guides direct visitors to current reception advice and local signs.

The named sources were retrieved via web research. Direct Node requests to the SANParks website returned HTTP 403 in this environment, so successful direct HTTP link checks are not claimed.

## Remaining route limitations

Ten main-road planning guides are now reviewed; this is not the whole Kruger road network. Gravel loops, restricted/private roads, 4×4 trails, live closures, distances/ETAs and geographic routing remain outside this reviewed set. Any route added or edited through D1 needs its own factual/junction review; a successful save validates document structure, not physical connectivity. Existing map artwork publication rights remain an independent release issue.
