import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repositoryRoot = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(readFileSync(resolve(repositoryRoot, 'src/assets/mammals/mammal-images.json'), 'utf8'))
const failures = []
const hashes = new Map()

if (manifest.length !== 22) failures.push(`Expected 22 records, found ${manifest.length}.`)
for (const record of manifest) {
  const absolutePath = resolve(repositoryRoot, record.expected)
  const exists = existsSync(absolutePath)
  if (record.status === 'real-photo' && !exists) failures.push(`${record.name}: photo missing at ${record.expected}.`)
  if (record.status === 'missing' && exists) failures.push(`${record.name}: file exists but manifest is still marked missing.`)
  if (exists) {
    const hash = createHash('sha256').update(readFileSync(absolutePath)).digest('hex')
    const prior = hashes.get(hash)
    if (prior && prior !== record.id) failures.push(`${record.name}: image duplicates unrelated species ${prior}.`)
    hashes.set(hash, record.id)
  }
}

const mammalsSource = readFileSync(resolve(repositoryRoot, 'src/features/mammals/model/mammals.ts'), 'utf8')
const overviewSource = readFileSync(resolve(repositoryRoot, 'src/features/mammals/components/MammalCard/MammalCard.tsx'), 'utf8')
const detailSource = readFileSync(resolve(repositoryRoot, 'src/features/mammals/routes/MammalDetailPage.tsx'), 'utf8')
if (!mammalsSource.includes('imageAlt: `${commonName} in Kruger National Park`')) failures.push('Alt text is not derived from the resolved Mammal common name.')
if (!mammalsSource.includes('imageFallback: primaryImage ?? missingPhotoFallback')) failures.push('Image fallback does not retain the species primary image or shared neutral fallback.')
if (!mammalsSource.includes('image: primaryImage ?? missingPhotoFallback')) failures.push('Missing photography does not resolve through the shared neutral fallback.')
if (mammalsSource.includes('ANIMAVIDI SPECIES PLACEHOLDER') || mammalsSource.includes('<text x=')) failures.push('Missing-photo fallback still contains visible placeholder text.')
if (!overviewSource.includes('src={mammal.image}') || !overviewSource.includes('mammal.imageFallback')) failures.push('Overview image and fallback are not sourced from the Mammal object.')
if (!detailSource.includes('src={mammal.image}') || !detailSource.includes('mammal.imageFallback')) failures.push('Detail image and fallback are not sourced from the Mammal object.')

if (failures.length) { console.error(failures.join('\n')); process.exit(1) }
const ready = manifest.filter((record) => record.status === 'real-photo').length
console.log(`Mammal image validation passed: ${ready}/22 real photos; ${22 - ready} explicitly tracked as missing.`)
