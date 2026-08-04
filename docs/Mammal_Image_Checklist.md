# Mammal Image Checklist

This checklist is the source of truth for demo mammal photography. A species is **verified** only when `primary.webp` visibly depicts that species. Missing entries continue to use their species-specific placeholder and are not completed photography.

| Species | Mammal ID | Expected filename | Status | Source | Overview | Detail | Crop notes |
|---|---|---|---|---|---|---|---|
| African Buffalo | `african-buffalo` | `src/assets/mammals/african-buffalo/primary.webp` | Real photo | User supplied | Verified | Verified | Head and horns visible at 96 px |
| African Elephant | `african-elephant` | `src/assets/mammals/african-elephant/primary.webp` | Real photo | Existing repository; licence pending | Verified | Verified | Face and trunk centred |
| African Lion | `african-lion` | `src/assets/mammals/african-lion/primary.webp` | Real photo | Existing repository; licence pending | Verified | Verified | Keep full head visible |
| African Wild Dog | `african-wild-dog` | `src/assets/mammals/african-wild-dog/primary.webp` | Real photo | User supplied | Verified | Verified | Ears and painted coat visible |
| Black Rhinoceros | `black-rhinoceros` | `src/assets/mammals/black-rhinoceros/primary.webp` | Real photo | User supplied | Verified | Verified | Hooked lip and horns visible |
| Chacma Baboon | `chacma-baboon` | `src/assets/mammals/chacma-baboon/primary.webp` | Real photo | User supplied | Verified | Verified | Face unobstructed |
| Cheetah | `cheetah` | `src/assets/mammals/cheetah/primary.webp` | Real photo | Existing repository; licence pending | Verified | Verified | Tear marks and head visible |
| Giraffe | `giraffe` | `src/assets/mammals/giraffe/primary.webp` | Real photo | User supplied | Verified | Verified | Head and neck visible |
| Greater Kudu | `greater-kudu` | `src/assets/mammals/greater-kudu/primary.webp` | Real photo | User supplied | Verified | Verified | Spiral horns remain in crop |
| Honey Badger | `honey-badger` | `src/assets/mammals/honey-badger/primary.webp` | Real photo | User supplied | Verified | Verified | Pale mantle visible |
| Impala | `impala` | `src/assets/mammals/impala/primary.webp` | Real photo | User supplied | Verified | Verified | Face and horns if male |
| Leopard | `leopard` | `src/assets/mammals/leopard/primary.webp` | Real photo | User supplied | Verified | Verified | Rosettes and face visible |
| Nyala | `nyala` | `src/assets/mammals/nyala/primary.webp` | Real photo | User supplied | Verified | Verified | Stripes and head visible |
| Porcupine | `porcupine` | `src/assets/mammals/porcupine/primary.webp` | Real photo | User supplied | Verified | Verified | Quills distinct from background |
| Southern Bushbuck | `southern-bushbuck` | `src/assets/mammals/southern-bushbuck/primary.webp` | Real photo | User supplied | Verified | Verified | Body markings visible |
| Spotted Hyena | `spotted-hyena` | `src/assets/mammals/spotted-hyena/primary.webp` | Real photo | User supplied | Verified | Verified | Rounded ears and spots visible |
| Steenbok | `steenbok` | `src/assets/mammals/steenbok/primary.webp` | Real photo | User supplied | Verified | Verified | Large ears and head visible |
| Vervet Monkey | `vervet-monkey` | `src/assets/mammals/vervet-monkey/primary.webp` | Real photo | User supplied | Verified | Verified | Black face clearly visible |
| Warthog | `warthog` | `src/assets/mammals/warthog/primary.webp` | Real photo | User supplied | Verified | Verified | Tusks and face visible |
| Waterbuck | `waterbuck` | `src/assets/mammals/waterbuck/primary.webp` | Real photo | User supplied | Verified | Verified | Shaggy coat and horns if male |
| White Rhinoceros | `white-rhinoceros` | `src/assets/mammals/white-rhinoceros/primary.webp` | Real photo | User supplied | Verified | Verified | Square lip and horns visible |
| Zebra | `zebra` | `src/assets/mammals/zebra/primary.webp` | Real photo | User supplied | Verified | Verified | Face and stripes visible |

## Replacement workflow

1. Add a correctly licensed, recognisable WebP photograph at the exact expected path.
2. Keep the filename `primary.webp`; no JSX or CSS change is required.
3. After visual verification, update status and source in `src/assets/mammals/mammal-images.json`.
4. Run `npm run validate:mammal-images` and verify both the overview crop and detail hero crop.
