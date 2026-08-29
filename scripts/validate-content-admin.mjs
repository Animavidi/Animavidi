import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { webcrypto } from 'node:crypto'

import worker from '../worker/src/index.ts'
import { getMammalId, krugerMammalChecklist } from '../src/features/mammals/data/krugerMammalChecklist.ts'
import { resolveMammalPhoto } from '../src/features/mammals/services/mammalPhotoResolution.ts'

if (!globalThis.crypto) globalThis.crypto = webcrypto

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const localAssets = await readdir(join(projectRoot, 'src/assets/mammals'), { withFileTypes: true })
const photoIds = new Set(localAssets.filter((entry) => entry.isDirectory()).map((entry) => entry.name))
const ids = krugerMammalChecklist.map(getMammalId)

assert.equal(ids.length, 148, 'Admin must expose all 148 checklist mammals')
assert.equal(new Set(ids).size, 148, 'Admin stable IDs must be unique')
assert.equal(photoIds.size, 22, 'Original packaged-photo coverage must remain 22')
for (const id of photoIds) assert.ok(ids.includes(id), `Packaged photo ${id} must resolve to a known mammal`)

const override = { contentType: 'image/webp', uploadedAt: '2026-08-29T00:00:00.000Z', url: 'https://media.animavidi.com/mammals/aardvark/primary.webp?v=1' }
assert.deepEqual(resolveMammalPhoto('/local.webp', '/fallback.svg', override), { fallback: '/local.webp', source: 'r2', src: override.url })
assert.deepEqual(resolveMammalPhoto('/local.webp', '/fallback.svg', undefined), { fallback: '/fallback.svg', source: 'local', src: '/local.webp' })
assert.deepEqual(resolveMammalPhoto(undefined, '/fallback.svg', undefined), { fallback: '/fallback.svg', source: 'fallback', src: '/fallback.svg' })

const objects = new Map()
const bucket = {
  async delete(keys) { for (const key of Array.isArray(keys) ? keys : [keys]) objects.delete(key) },
  async list() { return { cursor: undefined, objects: [...objects.entries()].map(([key, value]) => ({ customMetadata: value.customMetadata, etag: value.etag, httpMetadata: value.httpMetadata, key, uploaded: value.uploaded })), truncated: false } },
  async put(key, value, options) { const stored = { customMetadata: options.customMetadata, etag: `etag-${objects.size + 1}`, httpMetadata: options.httpMetadata, uploaded: new Date('2026-08-29T12:00:00.000Z'), value }; objects.set(key, stored); return { etag: stored.etag } },
}

const username = 'visual-review-admin'
const password = 'local-test-password'
const passwordHash = await createPasswordHash(password)
const env = { ADMIN_ALLOWED_ORIGINS: 'http://localhost:5173', ADMIN_PASSWORD_HASH: passwordHash, ADMIN_SESSION_SECRET: 'local-validator-session-secret-at-least-32-chars', ADMIN_USERNAME: username, MAMMAL_PHOTOS: bucket, MEDIA_BASE_URL: 'https://media.animavidi.com' }
const fetchWorker = (request) => worker.fetch(request, env, { waitUntil() {} })
const origin = 'http://localhost:5173'

let response = await fetchWorker(new Request('http://worker/api/admin/mammals/aardvark/photo', { method: 'DELETE', headers: { Origin: origin } }))
assert.equal(response.status, 401, 'Protected delete must reject unauthenticated requests')
response = await fetchWorker(new Request('http://worker/api/admin/session', { headers: { Origin: 'https://attacker.invalid' } }))
assert.equal(response.status, 403, 'Admin endpoints must reject unapproved origins before auth handling')

response = await fetchWorker(new Request('https://worker/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify({ username, password }) }))
assert.equal(response.status, 200, 'Valid server-side credentials must create a session')
const cookie = response.headers.get('set-cookie')
assert.match(cookie ?? '', /HttpOnly/i)
assert.match(cookie ?? '', /Secure/i)
assert.match(cookie ?? '', /SameSite=None/i)

const authHeaders = { Cookie: cookie.split(';')[0], Origin: origin }
const validWebp = new Uint8Array([0x52,0x49,0x46,0x46,0,0,0,0,0x57,0x45,0x42,0x50,0x56,0x50,0x38,0x20])
const validForm = new FormData(); validForm.set('photo', new File([validWebp], 'aardvark.webp', { type: 'image/webp' }))
response = await fetchWorker(new Request('http://worker/api/admin/mammals/aardvark/photo', { method: 'PUT', headers: authHeaders, body: validForm }))
assert.equal(response.status, 200, 'Known mammal WebP upload must succeed')
assert.ok(objects.has('mammals/aardvark/primary.webp'), 'Server must determine the R2 object key')

const invalidForm = new FormData(); invalidForm.set('photo', new File(['not an image'], 'aardvark.webp', { type: 'image/webp' }))
response = await fetchWorker(new Request('http://worker/api/admin/mammals/aardvark/photo', { method: 'PUT', headers: authHeaders, body: invalidForm }))
assert.equal(response.status, 415, 'MIME label without a matching file signature must be rejected')

response = await fetchWorker(new Request('http://worker/api/admin/mammals/not-a-real-mammal/photo', { method: 'PUT', headers: authHeaders, body: validForm }))
assert.equal(response.status, 404, 'Unknown mammal IDs must be rejected')
response = await fetchWorker(new Request('http://worker/api/admin/mammals/aardvark/photo', { method: 'PUT', headers: { ...authHeaders, 'Content-Length': String(11 * 1024 * 1024) } }))
assert.equal(response.status, 413, 'Oversized requests must be rejected before multipart parsing')

response = await fetchWorker(new Request('http://worker/api/photos', { headers: { Origin: origin } }))
assert.equal(response.status, 200, 'Manifest endpoint must remain available without admin credentials')
const manifest = await response.json()
assert.equal(manifest.photos.aardvark.url.startsWith('https://media.animavidi.com/mammals/aardvark/primary.webp?v='), true)

response = await fetchWorker(new Request('http://worker/api/admin/mammals/aardvark/photo', { method: 'DELETE', headers: authHeaders }))
assert.equal(response.status, 200, 'Authenticated delete must succeed')
assert.equal(objects.size, 0, 'Delete must remove the R2 override only')

const router = readFileSync(join(projectRoot, 'src/app/router.tsx'), 'utf8')
for (const route of ['/admin', 'login', 'content/animals', 'content/animals/:mammalId']) assert.ok(router.includes(route), `Admin route ${route} must exist`)
assert.ok(router.includes('AdminProtectedRoute'), 'Admin routes must be protected')

const frontendSources = [
  'src/features/admin/services/adminApi.ts',
  'src/features/admin/components/AdminAuthProvider.tsx',
  'src/features/admin/routes/AdminLoginPage.tsx',
].map((path) => readFileSync(join(projectRoot, path), 'utf8')).join('\n')
assert.equal(/ADMIN_PASSWORD_HASH|ADMIN_SESSION_SECRET|local-test-password/.test(frontendSources), false, 'Frontend must not contain admin secrets')

console.log('Content Admin validator passed: 148 species, 22 packaged photos, protected Worker CRUD, manifest, validation, and R2/local/fallback precedence.')

async function createPasswordHash(value) {
  const iterations = 120_000
  const salt = new TextEncoder().encode('animavidi-validator-salt')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(value), 'PBKDF2', false, ['deriveBits'])
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations, salt }, key, 256))
  return `${iterations}:${base64Url(salt)}:${base64Url(bits)}`
}

function base64Url(bytes) { return Buffer.from(bytes).toString('base64url') }
