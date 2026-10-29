"""Promote explicit visual decisions only; verify the exact reviewed bytes first.

Run with Pillow available. Candidate collection is scripts/collect-photo-candidates.mjs.
No user images, existing assets or R2 objects are overwritten.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
queue = json.loads((root / 'docs/completion/photo-candidates.json').read_text(encoding='utf-8'))
decisions = json.loads((root / 'docs/completion/photo-review-decisions.json').read_text(encoding='utf-8'))
inventory = json.loads((root / 'docs/completion/species-inventory.json').read_text(encoding='utf-8'))
groups = {entry['id']: 'birds' if entry['group'] == 'bird' else 'mammals' for entry in inventory['species']}
credit_sets = {}
for group in ['birds', 'mammals']:
    path = root / f'src/assets/{group}/photo-credits.json'
    credit_sets[group] = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}
for species_id, decision in decisions['approved'].items():
    group = groups[species_id]
    credits_path = root / f'src/assets/{group}/photo-credits.json'
    credits = credit_sets[group]
    entry = queue['candidates'][species_id]
    candidate = next(item for item in entry['files'] if item['fileName'] == decision['fileName'])
    source = root / 'work/photo-candidates' / candidate['fileName']
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    if source_hash != candidate['sha256']:
        raise ValueError(f'Reviewed source changed: {species_id}')
    asset_path = f'src/assets/{group}/{species_id}/primary.webp'
    output = root / asset_path
    if output.exists():
        if species_id in credits and hashlib.sha256(output.read_bytes()).hexdigest() == credits[species_id]['sha256']:
            continue
        raise ValueError(f'Refusing to overwrite existing asset: {species_id}')
    output.parent.mkdir(parents=True, exist_ok=True)
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    image.thumbnail((1600, 1600))
    image.save(output, 'WEBP', quality=88, method=6)
    credits[species_id] = {
        'speciesName': entry['name'], 'author': candidate['author'],
        'license': candidate['license'], 'licenseUrl': candidate['licenseUrl'],
        'sourceUrl': candidate['sourceUrl'], 'downloadUrl': candidate['downloadUrl'],
        'fileTitle': candidate['fileTitle'], 'assetPath': asset_path,
        'changes': 'Commons-provided scaled source converted to WebP without cropping; display crops may vary.',
        'reviewedAt': decisions['reviewedAt'], 'downloadedSourceSha256': source_hash,
        'sha256': hashlib.sha256(output.read_bytes()).hexdigest(),
        'width': image.width, 'height': image.height,
        'visualReview': decision['features'],
    }
    credits_path.write_text(json.dumps(credits, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Prepared reviewed photo: {species_id}')
