# Kruger vector map prototype assets

These assets are an **internal prototype only**. Publication and redistribution
rights for the supplied artwork have not been confirmed. Do not import these
files into a public route, ship them in a production bundle, publish them, or
distribute derivatives until the rights holder has granted permission.

## Source and reproducibility

- `Kruger_Master.svg` is an untouched byte-for-byte copy of the supplied source.
- `kruger-prototype-background.svg` is a separate, visually modified SVG supplied
  by the user for the internal interactive demo. It does not replace the master.
- Source SHA-256: `F83E804EF681A7CFEB9A65BC391B406F65BC5ABC4C9242580236536FFCC14049`.
- `scripts/prepare-kruger-map.py` regenerates every derivative asset.
- Source viewBox: `0 0 2487.6 4146.66`.
- Shared derivative viewBox: `1025 275 1025 3500`.
- `kruger-preparation-report.json` records generated element counts and unresolved layers.

The master contains 13,107 SVG elements, 1,900 styling classes, 933 clip paths,
8 embedded raster images and one anonymous top-level Illustrator group. It has
no semantic layer names for the park boundary, road types, rivers or facilities.
Class colour is therefore not sufficient evidence for feature classification.

The user-modified prototype background has viewBox `0 0 1777.31 3586.14`, is
loaded as one external image asset, and is never converted into React paths.
Interactive camps, gates, selections and sightings are independent React overlay
layers using this shared visual coordinate system. Its SHA-256 is
`D9D4539CA7560E86B72E93BDA40D27D87A83D12D39763988FED39A313345B72F`.

## Generated assets

| Asset | Representation | Features |
| --- | --- | ---: |
| `kruger-base.svg` | Combined cropped vector source, raster images removed | 13,101 elements |
| `kruger-boundary.svg` | Intentionally empty; source separation unresolved | 0 |
| `kruger-roads-tar.svg` | Intentionally empty; source separation unresolved | 0 |
| `kruger-roads-gravel.svg` | Intentionally empty; source separation unresolved | 0 |
| `kruger-rivers.svg` | Intentionally empty; source separation unresolved | 0 |
| `kruger-camps.svg` | Source labels containing camp terminology | 8 |
| `kruger-gates.svg` | Source labels containing gate/border-post terminology | 19 |
| `kruger-hides.svg` | Source labels containing hide terminology | 13 |
| `kruger-picnic.svg` | Source labels containing picnic terminology | 1 |
| `kruger-viewpoints.svg` | Source labels containing lookout/viewpoint terminology | 10 |
| `kruger-waterholes.svg` | Source labels naming dams, pans, lakes or waterholes | 35 |
| `kruger-labels.svg` | All positioned source text in the shared crop | 1,250 |

All derivatives contain an accessible `<title>` and `<desc>`, a stable layer
group ID, `data-map-category`, and the same viewBox. Extracted labels receive a
stable slug-based ID and retain the original source wording in
`data-source-label`. Category assets explicitly declare
`data-representation="source-label-only"` so they cannot be mistaken for
verified point or polygon data.

## Visual treatment

The combined prototype crop converts prominent print-map colours to the
Animavidi palette: ivory `#F6F3EC`, safari green `#1E3328`, gold `#B78C45`, and
muted derived greens for water/context. This is a presentation conversion, not
a semantic classification. Original paths, labels, transforms, clip paths and
source coordinates remain intact. Embedded raster illustrations are omitted.

## Known limitations

- The crop is based on the geographic concentration of source labels and hides
  print panels outside the viewBox; it is not a verified official boundary.
- Roads, rivers and the park boundary require a layered source file or verified
  geospatial dataset before they can be separated safely.
- Source-label category files are not authoritative POI datasets.
- Some labels describe legends or neighbouring context rather than in-park POIs.
- The base remains relatively large because aggressive path simplification would
  risk visible damage and alter source geometry.
- The assets must never be presented as official, complete, current, or suitable
  for navigation.
- The prototype background was visually modified by the user, but publication
  and redistribution rights are still unconfirmed. Production requires licensed
  artwork or a replacement map with documented rights.
- POI `mapX` and `mapY` values align overlays to visible labels only. They are not
  longitude/latitude values and must never be used for directions.

## Validation previews

`validation-previews/` contains raster renders for visual QA only. Transparent
unresolved layers intentionally render as blank ivory canvases. These previews
are also internal and inherit the same publication restriction.
