import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'

// Collect only. Nothing from this quarantine is imported by the application.
const root = new URL('../', import.meta.url)
const inventory = JSON.parse(await readFile(new URL('docs/completion/species-inventory.json', root), 'utf8'))
const directory = new URL('work/photo-candidates/', root)
await mkdir(directory, { recursive: true })
const limit = Number(process.argv.find((arg) => arg.startsWith('--limit='))?.split('=')[1] ?? 10)
if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new Error('Use --limit=1..1000')
const selectedIds = process.argv.find((arg) => arg.startsWith('--ids='))?.slice(6).split(',')
const userAgent = 'AnimavidiContentReview/1.0 (https://github.com/Animavidi/Animavidi)'
const plain = (text = '') => text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim()
const approvedLicenses = new Set(['CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.0', 'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC0'])
const checkpointUrl = new URL('docs/completion/photo-candidates.json', root)
let checkpoint
try { checkpoint = JSON.parse(await readFile(checkpointUrl, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error; checkpoint = { schemaVersion: 1, candidates: {} } }
async function save() { await writeFile(new URL('docs/completion/photo-candidates.json.tmp', root), JSON.stringify(checkpoint, null, 2) + '\n'); await rename(new URL('docs/completion/photo-candidates.json.tmp', root), checkpointUrl) }
async function get(url) {
  const response = await fetch(url, { headers: { 'User-Agent': userAgent }, signal: AbortSignal.timeout(45000) })
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${new URL(url).hostname}`)
  return response
}
let completed = 0
for (const species of inventory.species) {
  if (selectedIds ? !selectedIds.includes(species.id) : species.photo !== 'missing') continue
  if (checkpoint.candidates[species.id]?.status === 'pending-visual-review' || checkpoint.candidates[species.id]?.status === 'no-suitable-candidate') continue
  if (completed >= limit) break
  if (species.taxonomyReview === 'shared-scientific-name') {
    checkpoint.candidates[species.id] = { status: 'quarantined-taxonomy', reason: 'Shared scientific name in source checklist; resolve identity before sourcing.' }
    await save(); continue
  }
  const entry = { name: species.name, scientificName: species.scientificName, checkedAt: '2026-10-29', status: 'collecting', files: [] }
  checkpoint.candidates[species.id] = entry
  try {
    const api = new URL('https://commons.wikimedia.org/w/api.php')
    api.search = new URLSearchParams({ action: 'query', format: 'json', generator: 'search', gsrsearch: `filetype:bitmap "${species.scientificName}"`, gsrnamespace: '6', gsrlimit: '5', prop: 'imageinfo', iiprop: 'url|extmetadata|size', iiurlwidth: '960' })
    const data = await (await get(api)).json()
    if (data.error) throw new Error(`Commons: ${data.error.code}`)
    for (const page of Object.values(data.query?.pages ?? {}).sort((a, b) => a.index - b.index)) {
      const info = page.imageinfo?.[0], meta = info?.extmetadata
      const license = plain(meta?.LicenseShortName?.value), author = plain(meta?.Artist?.value)
      if (!info?.thumburl || !author || !approvedLicenses.has(license)) continue
      const licenseUrl = meta.LicenseUrl?.value
      if (!licenseUrl || !/^https?:\/\/creativecommons\.org\//.test(licenseUrl)) continue
      const sourceUrl = info.descriptionurl
      if (new URL(sourceUrl).hostname !== 'commons.wikimedia.org') continue
      if (!['upload.wikimedia.org', 'thumb.wikimedia.org'].includes(new URL(info.thumburl).hostname)) continue
      const imageResponse = await get(info.thumburl)
      if (!imageResponse.headers.get('content-type')?.startsWith('image/')) throw new Error('Candidate is not an image')
      const bytes = Buffer.from(await imageResponse.arrayBuffer())
      if (bytes.length > 10 * 1024 * 1024) throw new Error('Candidate exceeds 10 MB')
      const fileName = `${species.id}-${entry.files.length + 1}.jpg`
      await writeFile(new URL(fileName, directory), bytes)
      entry.files.push({ fileName, fileTitle: page.title, sourceUrl, author, license, licenseUrl: licenseUrl.replace(/^http:/, 'https:'), downloadUrl: info.thumburl, originalUrl: info.url, description: plain(meta.ImageDescription?.value), sha256: createHash('sha256').update(bytes).digest('hex'), width: info.thumbwidth, height: info.thumbheight, status: 'pending-visual-review' })
      if (entry.files.length >= 2) break
    }
    entry.status = entry.files.length ? 'pending-visual-review' : 'no-suitable-candidate'
  } catch (error) { entry.status = 'retry-required'; entry.error = error.message }
  await save()
  console.log(`${species.id}: ${entry.status} (${entry.files.length})`)
  completed++
  // Respect Commons search backpressure. Checkpoint first, then stop for a later retry.
  if (/429|503|too-busy/.test(entry.error ?? '')) { console.log('Commons backpressure: checkpoint saved; retry later.'); break }
  await delay(1500)
}
console.log(`Saved ${completed} species checkpoints. Candidates remain outside the app until visually reviewed.`)
