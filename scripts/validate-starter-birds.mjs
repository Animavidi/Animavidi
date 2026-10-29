import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { krugerBirdChecklist } from '../src/features/birds/data/krugerBirdChecklist.ts'
import { isManagedContent } from '../src/features/content/model/content.ts'
const read = async (path) => JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'))
const selection = await read('src/features/birds/data/starterBirds.json'), profiles = await read('src/features/birds/data/reviewedBirdProfiles.json'), credits = await read('src/assets/birds/photo-credits.json')
assert.equal(selection.birds.length,100)
assert.equal(new Set(selection.birds.map((bird)=>bird.id)).size,100)
const known = new Set(krugerBirdChecklist.map((bird)=>bird.id))
for(const [index,bird] of selection.birds.entries()) { assert.ok(known.has(bird.id));assert.equal(bird.rank,index+1);assert.ok(bird.historicalObservations>0);if(index)assert.ok(selection.birds[index-1].historicalObservations>=bird.historicalObservations) }
let complete = 0
for(const bird of selection.birds) {
  const entry = profiles[bird.id]
  if(!entry)continue
  assert.ok(isManagedContent(entry.content) && entry.content.kind==='animal' && entry.content.id===bird.id)
  if(entry.checkedAt && Array.isArray(entry.sources) && entry.sources.length && ['introduction','habitat','behaviour','diet','groupStructure','conservationStatus'].every((key)=>entry.content[key].trim()) && entry.content.identificationFeatures.length && entry.content.interestingFacts.length)complete++
}
const photographed = selection.birds.filter((bird)=>credits[bird.id]).length
console.log(`Starter collection: 100 existing bird IDs; ${photographed}/100 attributed photos and ${complete}/100 reviewed complete profiles. Historical-frequency priority; not a current abundance ranking.`)
if(!process.argv.includes('--inventory-only') && (photographed!==100 || complete!==100))process.exitCode=1
