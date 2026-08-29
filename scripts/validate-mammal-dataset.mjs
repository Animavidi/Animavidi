import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { krugerMammalChecklist } from '../src/features/mammals/data/krugerMammalChecklist.ts'
import { mammalAchievementTiers } from '../src/features/achievements/config/sightingAchievementTiers.ts'

const root = resolve(import.meta.dirname, '..')
const failures = []
const existingIds = ['african-lion', 'african-elephant', 'african-buffalo', 'black-rhinoceros', 'chacma-baboon', 'cheetah', 'greater-kudu', 'giraffe', 'honey-badger', 'impala', 'leopard', 'nyala', 'porcupine', 'southern-bushbuck', 'spotted-hyena', 'steenbok', 'vervet-monkey', 'warthog', 'waterbuck', 'african-wild-dog', 'white-rhinoceros', 'zebra']
const stableId = (entry) => entry.existingId ?? entry.officialName.normalize('NFKD').replace(/[’']/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()
const ids = krugerMammalChecklist.map(stableId)
const names = krugerMammalChecklist.map((entry) => entry.displayName ?? entry.officialName)
const main = krugerMammalChecklist.filter((entry) => entry.section === 'main')
const small = krugerMammalChecklist.filter((entry) => entry.section === 'small-mammals')
const groups = Object.fromEntries(['bats', 'rodents', 'shrews-moles'].map((group) => [group, small.filter((entry) => entry.smallMammalGroup === group)]))

if (krugerMammalChecklist.length !== 148) failures.push(`Expected 148 mammals, found ${krugerMammalChecklist.length}.`)
if (new Set(ids).size !== 148) failures.push('Mammal IDs are not unique.')
if (new Set(names.map((name) => name.toLowerCase())).size !== 148) failures.push('Display names are not unique.')
if (krugerMammalChecklist.some((entry) => !entry.scientificName.trim())) failures.push('Every mammal must have a scientific name.')
if (krugerMammalChecklist.some((entry) => entry.scientificName.trim().split(/\s+/).length < 2)) failures.push('Every mammal must have a complete binomial scientific name.')
if (main.length !== 75 || small.length !== 73) failures.push(`Expected 75 main and 73 small mammals; found ${main.length} and ${small.length}.`)
if (groups.bats.length !== 42 || groups.rodents.length !== 23 || groups['shrews-moles'].length !== 8) failures.push(`Unexpected Small Mammals totals: ${groups.bats.length} bats, ${groups.rodents.length} rodents, ${groups['shrews-moles'].length} shrews/moles.`)
if (small.some((entry) => !entry.smallMammalGroup)) failures.push('A Small Mammal is missing its group.')
for (const id of existingIds) if (!ids.includes(id)) failures.push(`Existing mammal ID missing: ${id}.`)
if (!ids.includes('black-rhinoceros') || !ids.includes('white-rhinoceros')) failures.push('Black and White Rhinoceros must remain distinct records.')
for (const [id, tier] of Object.entries(mammalAchievementTiers)) {
  if (!ids.includes(id)) failures.push(`Achievement tier references unknown mammal: ${id}.`)
  if (!['standard', 'notable', 'rare', 'legendary'].includes(tier)) failures.push(`Invalid achievement tier for ${id}: ${tier}.`)
}

const passportService = await import('node:fs').then(({ readFileSync }) => readFileSync(resolve(root, 'src/features/passport/services/passportService.ts'), 'utf8'))
if (!passportService.includes("ids.has('white-rhinoceros') || ids.has('black-rhinoceros')")) failures.push('Passport Big Five Rhino aggregation is not intact.')

const imageRoot = resolve(root, 'src/assets/mammals')
for (const id of existingIds) if (!existsSync(resolve(imageRoot, id, 'primary.webp'))) failures.push(`Existing primary image missing: ${id}.`)

const expectedDisplayNames = new Map([
  ['african-buffalo', 'Buffalo (African)'], ['african-elephant', 'Elephant (African)'], ['african-lion', 'Lion (African)'],
  ['greater-kudu', 'Kudu'], ['spotted-hyena', 'Hyena (Spotted)'], ['vervet-monkey', 'Monkey (Vervet)'],
  ['african-wild-dog', 'Wild Dog (African)'], ['black-rhinoceros', 'Rhinoceros (Black)'],
  ['white-rhinoceros', 'Rhinoceros (White)'], ['zebra', "Zebra (Burchell's)"],
])
for (const [id, expectedName] of expectedDisplayNames) {
  const entry = krugerMammalChecklist.find((candidate) => stableId(candidate) === id)
  if ((entry?.displayName ?? entry?.officialName) !== expectedName) failures.push(`${id}: expected display name “${expectedName}”.`)
}

if (failures.length) { console.error(failures.join('\n')); process.exit(1) }
console.log(`Complete mammal dataset validation passed: ${ids.length} unique species; ${main.length} main; ${small.length} small (${groups.bats.length} bats, ${groups.rodents.length} rodents, ${groups['shrews-moles'].length} shrews/moles); all 22 legacy IDs and images retained.`)
