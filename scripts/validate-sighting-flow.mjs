import { readFile } from 'node:fs/promises'

const repository = await readFile(new URL('../src/features/sightings/data/sightingRepository.ts', import.meta.url), 'utf8')
const model = await readFile(new URL('../src/features/sightings/model/sighting.ts', import.meta.url), 'utf8')
const newPage = await readFile(new URL('../src/features/mammals/routes/NewSightingPage.tsx', import.meta.url), 'utf8')
const detailPage = await readFile(new URL('../src/features/sightings/routes/SightingDetailPage.tsx', import.meta.url), 'utf8')
const editPage = await readFile(new URL('../src/features/sightings/routes/EditSightingPage.tsx', import.meta.url), 'utf8')

const requiredFields = ['animalId', 'behaviour', 'composition', 'count', 'date', 'location', 'notes', 'parkId', 'photos', 'time']
const requiredMethods = ['create', 'delete', 'getAll', 'getById', 'update']

for (const field of requiredFields) if (!model.includes(`readonly ${field}`)) throw new Error(`Missing Sighting field: ${field}`)
for (const method of requiredMethods) if (!repository.includes(`${method}(`)) throw new Error(`Missing repository method: ${method}`)
for (const [name, source] of [['New Sighting', newPage], ['Sighting Detail', detailPage], ['Edit Sighting', editPage]]) {
  if (source.includes('indexedDB.')) throw new Error(`${name} duplicates IndexedDB access.`)
  if (!source.includes('sightingRepository.')) throw new Error(`${name} does not use the repository abstraction.`)
}
if (!newPage.includes('const saved = await sightingRepository.create')) throw new Error('Save confirmation is not based on the created record.')
if (!editPage.includes('sightingRepository.update')) throw new Error('Edit does not update the existing record.')
if (!detailPage.includes('sightingRepository.delete')) throw new Error('Detail does not delete through the repository.')

console.log('Sighting Flow validation passed: schema unchanged, repository abstraction retained, create/update/delete paths verified.')
