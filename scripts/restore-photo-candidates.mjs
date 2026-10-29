import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const root = new URL('../', import.meta.url)
const queue = JSON.parse(await readFile(new URL('docs/completion/photo-candidates.json', root), 'utf8'))
const directory = new URL('work/photo-candidates/', root)
await mkdir(directory, { recursive: true })
let restored = 0
for (const entry of Object.values(queue.candidates)) for (const file of entry.files ?? []) {
  if (!/^[a-z0-9-]+\.jpg$/.test(file.fileName)) throw new Error('Unsafe recorded filename')
  const path = new URL(file.fileName, directory)
  try { await access(path); continue } catch { /* Recover an ignored review asset after a new checkout. */ }
  if (!['upload.wikimedia.org', 'thumb.wikimedia.org'].includes(new URL(file.downloadUrl).hostname)) throw new Error('Unexpected download host')
  const response = await fetch(file.downloadUrl, { headers: { 'User-Agent': 'AnimavidiContentReview/1.0 (https://github.com/Animavidi/Animavidi)' }, signal: AbortSignal.timeout(45000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}; resume later`)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`Candidate source changed; new review required: ${file.fileName}`)
  await writeFile(path, bytes); restored++
}
console.log(`Restored ${restored} exact candidate assets. No files promoted to the application.`)
