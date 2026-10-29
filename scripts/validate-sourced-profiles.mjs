import assert from 'node:assert/strict'
import { sourcedAnimalProfiles } from '../src/features/content/data/sourcedAnimalProfiles.ts'
import { getMammalId, krugerMammalChecklist } from '../src/features/mammals/data/krugerMammalChecklist.ts'
import { isManagedContent } from '../src/features/content/model/content.ts'
const knownIds = new Set(krugerMammalChecklist.map(getMammalId))
for (const [id, entry] of Object.entries(sourcedAnimalProfiles)) {
  assert.ok(knownIds.has(id))
  assert.equal(entry.content.id, id)
  assert.ok(isManagedContent(entry.content))
  assert.ok(entry.checkedAt && entry.sourceTitle && entry.sourceAuthor && entry.sections.length)
  assert.equal(new URL(entry.content.sourceUrl).hostname, 'animaldiversity.org')
  assert.ok(entry.pending.includes('Current conservation assessment'))
  assert.equal(entry.content.conservationStatus, '', 'Do not disguise an unverified assessment as complete')
  assert.ok(entry.content.identificationFeatures.length >= 2)
  for (const field of ['introduction', 'habitat', 'behaviour', 'diet', 'groupStructure']) assert.ok(entry.content[field].trim())
}
console.log(`${Object.keys(sourcedAnimalProfiles).length} sourced profile summaries validated; conservation/taxonomy review remains explicitly pending.`)
