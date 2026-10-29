import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { krugerBirdChecklist } from '../src/features/birds/data/krugerBirdChecklist.ts'
import { getMammalId, krugerMammalChecklist } from '../src/features/mammals/data/krugerMammalChecklist.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
const species = [
  ...krugerMammalChecklist.map((entry) => ({ id: getMammalId(entry), name: entry.officialName, group: 'mammal' })),
  ...krugerBirdChecklist.map((entry) => ({ id: entry.id, name: entry.commonName, group: 'bird' })),
]
const packaged = new Set()
for (const entry of await readdir(join(root, 'src/assets/mammals'), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  try { if ((await readFile(join(root, 'src/assets/mammals', entry.name, 'primary.webp'))).byteLength > 0) packaged.add(entry.name) } catch { /* Not a confirmed image. */ }
}
const manifestPath = process.argv.find((arg) => arg.startsWith('--manifest='))?.slice('--manifest='.length)
let photos = {}
if (manifestPath) {
  const data = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (!data || typeof data !== 'object' || !data.photos || typeof data.photos !== 'object' || Array.isArray(data.photos)) throw new Error('Expected a current /api/photos manifest with a photos map.')
  photos = data.photos
}
const confirmedRemote = (id) => {
  const photo = photos[id]
  if (!photo || typeof photo !== 'object' || typeof photo.url !== 'string') return false
  try { const url = new URL(photo.url); return url.protocol === 'https:' && url.hostname === 'media.animavidi.com' && !url.username && !url.password } catch { return false }
}
const uncovered = species.filter((entry) => !packaged.has(entry.id) && !confirmedRemote(entry.id))
console.log(`Confirmed image records: ${species.length - uncovered.length}/${species.length}; ${packaged.size} packaged photographs.`)
if (!manifestPath) console.log('R2 coverage is unverified: provide a current /api/photos response with --manifest=/path/to/manifest.json. This check cannot approve a release without it.')
if (uncovered.length) console.log(`${uncovered.length} entries ${manifestPath ? 'lack an image record' : 'have no locally confirmed image'} (${uncovered.filter((entry) => entry.group === 'mammal').length} mammals; ${uncovered.filter((entry) => entry.group === 'bird').length} birds).`)
console.log('An image record alone does not verify the image loads, depicts the correct species, or has approved usage rights. Those remain release review requirements.')
if (uncovered.length || !manifestPath) process.exitCode = 1
