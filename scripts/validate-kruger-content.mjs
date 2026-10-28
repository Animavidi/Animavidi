import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { webcrypto } from 'node:crypto'
import worker from '../worker/src/index.ts'
import { krugerBirdChecklist } from '../src/features/birds/data/krugerBirdChecklist.ts'
import { isContentManifest, isManagedContent } from '../src/features/content/model/content.ts'

if (!globalThis.crypto) globalThis.crypto = webcrypto
assert.equal(krugerBirdChecklist.length, 546)
assert.equal(new Set(krugerBirdChecklist.map((item) => item.id)).size, 546)
assert.ok(krugerBirdChecklist.every((item, index) => item.sourceChecklistNumber === index + 1))
assert.ok(krugerBirdChecklist.every((item) => item.id.startsWith('bird-') && item.scientificName && item.source.startsWith('https://www.sanparks.org/')))
const objects = new Map()
let sequence = 0
let failPut = false
const bucket = {
  async get(key) { const object = objects.get(key); return object ? { ...object, async json() { return JSON.parse(object.body) }, async arrayBuffer() { return new TextEncoder().encode(object.body).buffer } } : null },
  async list({ prefix = '' } = {}) { return { objects: [...objects.values()].filter((item) => item.key.startsWith(prefix)), truncated: false } },
  async delete(keys) { for (const key of Array.isArray(keys) ? keys : [keys]) objects.delete(key) },
  async put(key, body, options = {}) {
    if (failPut) return null
    const existing = objects.get(key)
    if (options.onlyIf?.etagMatches && options.onlyIf.etagMatches !== existing?.etag) return null
    if (options.onlyIf?.etagDoesNotMatch === '*' && existing) return null
    const object = { key, body, etag: `revision-${++sequence}`, uploaded: new Date(), ...options }
    objects.set(key, object); return object
  },
}
const password = 'integration-test-only'
const salt = crypto.getRandomValues(new Uint8Array(16))
const encode = (value) => Buffer.from(value).toString('base64url')
const passwordKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
const hash = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, passwordKey, 256)
const sqlite = new DatabaseSync(':memory:')
sqlite.exec(readFileSync(new URL('../worker/migrations/0001_content.sql', import.meta.url), 'utf8'))
const database = {
  prepare(sql) {
    const statement = sqlite.prepare(sql)
    let args = []
    return {
      bind(...values) { args = values; return this },
      async first() { return statement.get(...args) ?? null },
      async all() { return { results: statement.all(...args), success: true } },
    }
  },
}
const env = { CONTENT_DB: database, ADMIN_ALLOWED_ORIGINS: 'http://localhost:5173', ADMIN_USERNAME: 'test-admin', ADMIN_PASSWORD_HASH: `100000:${encode(salt)}:${encode(hash)}`, ADMIN_SESSION_SECRET: 'test-session-secret-not-for-production', MEDIA_BASE_URL: 'https://media.animavidi.com', MAMMAL_PHOTOS: bucket }
const origin = 'http://localhost:5173'
const call = (path, init = {}) => worker.fetch(new Request(`http://worker${path}`, init), env)
const login = await call('/api/admin/login', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ username: env.ADMIN_USERNAME, password }) })
assert.equal(login.status, 200)
const cookie = login.headers.get('set-cookie').split(';')[0]
const auth = { Origin: origin, Cookie: cookie, 'Content-Type': 'application/json', 'If-Match': 'new' }
const bird = krugerBirdChecklist[0]
const content = { kind: 'animal', id: bird.id, introduction: 'Reviewed introduction.', identificationFeatures: ['Feature'], habitat: 'Habitat', behaviour: '', diet: '', groupStructure: '', conservationStatus: '', interestingFacts: [], sourceUrl: bird.source }
assert.ok(isManagedContent(content))
assert.ok(!isManagedContent({ ...content, sourceUrl: 'javascript:alert(1)' }))
assert.ok(!isManagedContent({ ...content, id: '../bad' }))
let response = await call(`/api/admin/content/animal/${bird.id}`, { method: 'PUT', headers: { ...auth, Cookie: '' }, body: JSON.stringify(content) })
assert.equal(response.status, 401)
response = await call(`/api/admin/content/animal/${bird.id}`, { method: 'PUT', headers: { ...auth, Origin: 'https://attacker.invalid' }, body: JSON.stringify(content) })
assert.equal(response.status, 403)
response = await call(`/api/admin/content/animal/${bird.id}`, { method: 'PUT', headers: auth, body: JSON.stringify(content) })
assert.equal(response.status, 200)
const saved = await response.json()
response = await call('/api/content')
assert.equal((await response.json())[`animal/${bird.id}`].content.introduction, content.introduction)
response = await call(`/api/admin/content/animal/${bird.id}`, { method: 'PUT', headers: auth, body: JSON.stringify({ ...content, introduction: 'Stale overwrite' }) })
assert.equal(response.status, 412)
response = await call(`/api/admin/content/animal/${bird.id}`, { method: 'PUT', headers: { ...auth, 'If-Match': saved.revision }, body: JSON.stringify({ ...content, introduction: 'Updated' }) })
assert.equal(response.status, 200)
assert.equal(sqlite.prepare('SELECT COUNT(*) AS total FROM content_history WHERE kind = ? AND id = ?').get('animal', bird.id).total, 1)
response = await call('/api/admin/content/animal/unknown-species', { method: 'PUT', headers: auth, body: JSON.stringify({ ...content, id: 'unknown-species' }) })
assert.equal(response.status, 404)
response = await call(`/api/admin/content/animal/${bird.id}`, { method: 'PUT', headers: auth, body: 'x'.repeat(65537) })
assert.equal(response.status, 413)
const route = { kind: 'route', id: 'test-route', title: 'Draft route', region: 'south', start: 'Skukuza', end: 'Lower Sabie', roads: ['H4-1'], stops: [], description: 'Draft description', sourceUrl: bird.source, sourcePages: 'Review notes', reviewedAt: '2026-10-28', published: false }
assert.ok(isManagedContent(route))
assert.ok(!isManagedContent({ ...route, roads: ['invented-road'] }))
response = await call('/api/admin/content/route/test-route', { method: 'PUT', headers: auth, body: JSON.stringify(route) })
assert.equal(response.status, 200)
response = await call('/api/content')
const publicRoutes = await response.json()
assert.ok(isContentManifest(publicRoutes), 'Public draft tombstones must remain valid content for the browser')
assert.equal(publicRoutes['route/test-route'].content.published, false)
assert.equal(publicRoutes['route/test-route'].content.description, '')
response = await call('/api/admin/content', { headers: auth })
assert.equal((await response.json())['route/test-route'].content.description, route.description)
// A failed replacement must preserve the original photograph.
objects.set(`mammals/${bird.id}/primary.png`, { key: `mammals/${bird.id}/primary.png`, body: 'original' })
failPut = true
const form = new FormData(); form.set('photo', new File([new Uint8Array([82,73,70,70,0,0,0,0,87,69,66,80])], 'photo.webp', { type: 'image/webp' }))
response = await call(`/api/admin/mammals/${bird.id}/photo`, { method: 'PUT', headers: { Origin: origin, Cookie: cookie }, body: form })
assert.equal(response.status, 500)
assert.ok(objects.has(`mammals/${bird.id}/primary.png`))
sqlite.close()
console.log('Kruger content tests passed: 546 stable bird IDs; authenticated persisted editorial/route CRUD; stale-write protection; revision history; draft visibility; validation; failed photo replacement preserves original.')
