import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { krugerBirdChecklist } from '../src/features/birds/data/krugerBirdChecklist.ts'
const root = fileURLToPath(new URL('../', import.meta.url))
const credits = JSON.parse(await readFile(join(root, 'src/assets/birds/photo-credits.json'), 'utf8'))
const ids = new Set(krugerBirdChecklist.map((bird) => bird.id))
assert.ok(Object.keys(credits).length > 0)
for (const [id, credit] of Object.entries(credits)) {
  assert.ok(ids.has(id), `Unknown bird ID: ${id}`)
  assert.equal(credit.assetPath, `src/assets/birds/${id}/primary.webp`)
  assert.ok(credit.author && credit.fileTitle && credit.changes && credit.reviewedAt)
  assert.equal(new URL(credit.sourceUrl).hostname, 'commons.wikimedia.org')
  assert.equal(new URL(credit.downloadUrl).hostname, 'upload.wikimedia.org')
  assert.equal(new URL(credit.licenseUrl).hostname, 'creativecommons.org')
  assert.match(credit.license, /^CC BY(?:-SA)? (?:2\.0|3\.0|4\.0)$/)
  assert.match(credit.originalSha256, /^[a-f0-9]{64}$/)
  assert.ok(credit.width > 0 && credit.height > 0 && Math.max(credit.width, credit.height) <= 1600)
  const bytes = await readFile(join(root, credit.assetPath))
  assert.equal(bytes.subarray(0, 4).toString(), 'RIFF')
  assert.equal(bytes.subarray(8, 12).toString(), 'WEBP')
  assert.equal(createHash('sha256').update(bytes).digest('hex'), credit.sha256, `Image and attribution record drift: ${id}`)
}
console.log(`Reviewed photo checks passed: ${Object.keys(credits).length} species-linked WebP assets, source/author/licence records and checksums.`)
