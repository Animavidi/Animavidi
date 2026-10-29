# Mammal photographs

The original 22 user-provided photographs remain unchanged and are recorded separately in `mammal-images.json`. Their source-rights checks are not automatically approved by the application licence.

New reviewed photographs are recorded in `photo-credits.json`. Each record preserves the Commons source page, photographer, selected Creative Commons licence and URL, exact downloaded-source checksum, optimized WebP checksum, dimensions, transformations and visual-review features. Sources may show animals outside Kruger or in captivity; the application does not claim a photograph's location.

The image derivatives retain their recorded source licences, independently of the application's MIT source-code licence. Credits are displayed on species details and `/photo-credits`. A scaled Commons rendition may be used as the downloaded source; the record explicitly distinguishes its checksum from the original full-resolution photograph.

Only the explicit approvals in `docs/completion/photo-review-decisions.json` may be promoted. Other candidates, including range maps, anatomical plates and visually uncertain species, stay outside the application. Restore the ignored review files from their recorded URLs/checksums using `node scripts/restore-photo-candidates.mjs` after a fresh checkout.
