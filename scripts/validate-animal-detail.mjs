import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(readFileSync(resolve(root, 'src/assets/mammals/mammal-images.json'), 'utf8'))
const data = readFileSync(resolve(root, 'src/features/mammals/model/mammals.ts'), 'utf8')
const page = readFileSync(resolve(root, 'src/features/mammals/routes/MammalDetailPage.tsx'), 'utf8')
const service = readFileSync(resolve(root, 'src/features/mammals/services/animalDetailService.ts'), 'utf8')
const router = readFileSync(resolve(root, 'src/app/router.tsx'), 'utf8')
const crops = readFileSync(resolve(root, 'src/features/mammals/config/animalDetailImagePositions.ts'), 'utf8')
const failures = []

if (manifest.length !== 22) failures.push(`Expected 22 mammal routes, found ${manifest.length} manifest records.`)
for (const mammal of manifest) {
  if (!data.includes(`id: '${mammal.id}'`)) failures.push(`${mammal.name}: missing from the typed mammals dataset.`)
  if (!data.includes(`'${mammal.id}': profile(`) && !data.includes(`${mammal.id}: profile(`)) failures.push(`${mammal.name}: missing typed profile content.`)
  if (!crops.includes(`'${mammal.id}'`) && !crops.includes(`${mammal.id}:`)) failures.push(`${mammal.name}: missing central hero crop metadata.`)
}
if (!router.includes("path: '/parks/kruger/mammals/:animalId'")) failures.push('Production Animal Detail route is missing.')
if (!page.includes('findMammal(animalId)')) failures.push('Selected Mammal object is not used by the detail template.')
if (!page.includes('src={mammal.image}') || !page.includes('mammal.imageFallback')) failures.push('Hero image and fallback are not derived from the selected Mammal object.')
if (!page.includes('/sightings/new`')) failures.push('Add sighting does not retain the selected mammal ID.')
if (!page.includes('aggregateAnimalSightings(sightings, mammal.id)')) failures.push('Observation state is not derived through the central sighting aggregation.')
if (!service.includes('.filter((sighting) => sighting.animalId === animalId)')) failures.push('Recent sightings are not restricted to the selected animal.')
if (page.includes('demoProgress.seen') || page.includes('demoProgress.sightingsCount')) failures.push('Static demo progress is incorrectly used as real observation state.')
if ((page.match(/export function MammalDetailPage/g) ?? []).length !== 1) failures.push('Animal Detail is not implemented as one reusable template.')

if (failures.length) { console.error(failures.join('\n')); process.exit(1) }
console.log('Animal Detail validation passed: one data-driven template covers all 22 mammal IDs with real sighting state.')
