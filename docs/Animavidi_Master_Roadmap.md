# Animavidi Master Roadmap

> Actuele ontwerp- en implementatiestatus. Productscope en releasepoorten blijven vastgelegd in `Roadmap.md`.

## Screen status

| Screen | Reference | Status |
| --- | --- | --- |
| Welcome Page | `docs/designs/01-welcome.png` | Demo Approved |
| Park Selection | `docs/designs/02-park-selection.png` | Demo Approved |
| Kruger Home | `docs/designs/03-kruger-home.png` | Functionally Approved, visual refinement deferred to UI Polish Sprint |
| Mammals | `docs/designs/05-mammals.png.png` | Demo Approved |
| Animal Detail | Approved African Elephant Animal Detail v2 visual | Visual review pending |
| New Sighting | `docs/designs/04-new-sighting.png` | Visual review pending |
| Sighting Detail | Premium memory-page direction | Visual review pending |
| Edit Sighting | Shared Sighting Flow v2 visual system | Visual review pending |
| My Sightings | No approved reference yet | Demo Approved |
| Park Map | User-modified `kruger-prototype-background.svg` | Active Internal Vector Integration |
| Safari Passport | `docs/designs/06-passport.png` | Functionally Complete, visual polish deferred |
| Park Information | `Park Map.pdf` | Functionally Complete, official content verification required |
| Kruger vector map preparation | `Kruger_Master.svg` | Complete, production rights deferred |
| Global Add Sighting FAB | Shared active-safari navigation | Visual review pending |
| Species Picker V2 | Shared Add Sighting bottom sheet | Visual review pending |
| Animavidi Add Sighting Lion Icon | Supplied `Button.svg` | Visual review pending |
| Expandable Add Sighting FAB | Shared active-safari navigation | Visual review pending |
| Big Five Completion Celebration | User-created `Big 5_reverb.wav` | Visual review pending |
| ANI-023 Complete Kruger Mammal Dataset | SANParks Kruger Mammals Checklist | Demo Approved |
| ANI-024 Content Admin V1 | Animavidi admin architecture + existing Cloudflare R2 media domain | Visual review pending |

## Active task

**ANI-024 Content Admin V1 visual review** is active. Only the approved and functionally complete
Welcome, Park Selection, Kruger, Mammals, Animal Detail, New Sighting, My
Sightings, Park Map, Park Information and Safari Passport experiences are
reachable from the demo interface.

Animal Detail v2 is implemented as one reusable template for all 148 Kruger
mammals. Observation status, personal statistics and recent sightings are
derived exclusively from local IndexedDB sightings. The original 22 retain their
detailed profiles and local photographs; newly added checklist species use a
graceful minimal editorial state and neutral Animavidi placeholder until reviewed
content and user-managed photography are available.

ANI-024 introduces a separate lazy-loaded management area for the single Animavidi administrator. Content → Animals reads the existing 148-mammal dataset and supports authenticated R2 photo add, replace and remove operations only. R2 overrides resolve centrally before the original 22 packaged photographs and the shared neutral fallback. Safari Routes, Users, Reports & Analytics, editable animal copy, species creation and D1 persistence remain deliberately deferred. Required Worker binding, secrets, exact-origin CORS and local review setup are documented in `docs/Content_Admin_Setup.md`; the deployed Worker uses the reviewed production origins and existing R2 media domain.

New Sighting, Sighting Detail and Edit Sighting now share the premium memory-capture
visual language while continuing to use the existing SightingRepository, IndexedDB
records, routes and aggregation behaviour. Final approval remains pending visual review.

## Global Add Sighting FAB

Status: **Visual review pending**. One shared, route-aware launcher is available
on Kruger Home, Mammals, valid Animal Detail pages, My Sightings, Park Map,
Park Information and Safari Passport. Animal Detail opens its current species
directly; the other supported routes open the shared searchable picker backed
by the existing typed 22-mammal dataset. Creation, editing, sighting detail,
loading, error and full-screen states intentionally exclude the launcher.

### Species Picker V2

Status: **Visual review pending**. The shared picker is now a near-full-height
bottom sheet with grouped mammal sections, flat search results and up to four
newest unique species derived from genuine local sightings. It continues to
use the existing typed Mammal objects and production New Sighting routes; no
new wildlife groups, persistence models or routes were introduced.

### Animavidi Add Sighting Lion Icon

Status: **Visual review pending**. The supplied final `Button.svg` is preserved
unchanged as `animavidi-add-sighting-final.svg`. The universal FAB now renders
this exact vector asset, including its original circular surround and colours,
without adding a separate plus or any additional icon layer. No FAB behaviour,
route or visibility rule was changed.

### Expandable Add Sighting FAB

Status: **Visual review pending**. The shared FAB now reveals its “Add sighting”
label to the left on first-use introduction, pointer hover and keyboard focus.
Touch users receive a deliberate first-tap explanation followed by second-tap
activation; keyboard activation remains immediate. The current lion SVG is a
temporary brand-action icon: a future official Animavidi image mark can replace
the icon prop without changing the label interaction, routing or launcher logic.

### Big Five Completion Celebration

Status: **Visual review pending**. The untouched, user-created original piano
theme is reserved exclusively for the first genuine transition from fewer than
five to all five Passport Big Five categories after a successful new sighting.
The visual celebration remains available when sound is muted, unavailable or
blocked by browser autoplay policy. Local keys are
`animavidi.achievementSoundsEnabled` and
`animavidi.achievement.bigFiveCompletedCelebrated`; the latter is the documented
development reset key. Other exceptional achievement themes remain deferred.

## Curated Demo Mode

Both Welcome entry choices activate the same local demo explorer without
authentication. New explorers pass through the approved Park Selection screen;
returning explorers open the current Safari Passport directly. Legacy account,
login and onboarding URLs safely redirect into this demo identity.

The old `/demo` placeholder redirects to Kruger Home. Manual multi-park
selection and unknown or unfinished routes show only the branded “Available in
the full version” state. Placeholder pages, obsolete layouts and unfinished
features have no active UI navigation in Demo Mode.

## Park Map vector integration

Implemented: lazy route loading, a local external SVG background, independent
React overlay layers, persistent pan/zoom viewport, fixed prototype camps and
gates, selected-marker highlighting, filter/legend panel, premium mobile bottom
sheet and an unplaced-sightings tray backed by `SightingRepository`. Old
invented demo markers and random sighting positions have been removed.

The overlay architecture uses visual `mapX/mapY` coordinates in the SVG viewBox;
these are not GPS coordinates. Real geolocation collection, verified geographic
coordinates and production map publication rights remain deferred.

## Kruger vector map preparation

Implemented: untouched source archive with SHA-256 verification, a shared
prototype crop, removal of eight embedded raster illustrations, accessible SVG
metadata, stable category IDs, Animavidi palette conversion, typed asset
manifest, source-label extracts and local validation previews.

Unresolved by design: the flat Illustrator export contains no semantic park
boundary, tar-road, gravel-road or river layers. Those derivative files remain
valid but empty rather than classifying geometry from colour alone. Camp, gate,
hide, picnic, viewpoint and waterhole assets contain only directly evidenced
source labels, not claimed POI coordinates or symbols. A layered source or
verified geospatial dataset is required before production integration. The
existing Park Map UI remains unchanged and none of these restricted assets is
reachable from a public application route.

## Park Information implementation

Implemented: source-labelled monthly gate and camp times, restaurant and shop hours, supported camp/shop and restaurant data, emergency contacts, driving guidance, health and malaria precautions, park rules, safari tips, history timeline, local search and production navigation.

Deferred or omitted: the scanned distance matrix was not reliable enough to reconstruct; unclear contact values and unsupported camp facilities were omitted. All operational information requires future verification against official SANParks sources before production release.

## Safari Passport implementation

Implemented: local lifetime summary, deterministic Explorer Rank progression, Big Five stamps, supported Kruger journey, observed-species collection, typed achievements, recent memories and privacy-safe Web Share/copy behaviour.

Known limitations: identity data is a centralised demo profile; only Kruger National Park and South Africa are currently supported; onboarding completion is represented by a local browser flag; no approved Passport visual reference exists yet.
