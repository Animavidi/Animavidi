import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import worker from '../worker/src/index.ts'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'vite'
const creditCount = Object.keys(JSON.parse(readFileSync(new URL('../src/assets/birds/photo-credits.json', import.meta.url)))).length + Object.keys(JSON.parse(readFileSync(new URL('../src/assets/mammals/photo-credits.json', import.meta.url)))).length
const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const outputDirectory = mkdtempSync(join(tmpdir(), 'animavidi-browser-'))
const server = await createServer({ root: projectRoot, configLoader: 'runner', define: { 'import.meta.env.VITE_ADMIN_API_BASE_URL': JSON.stringify('http://127.0.0.1:8787') }, server: { host: '127.0.0.1', port: 5173 } })
await server.listen()
const playwrightModule = process.env.PLAYWRIGHT_MODULE_PATH ?? (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/playwright/index.mjs' : 'playwright')
const { chromium } = await import(/^[A-Za-z]:[\\/]/.test(playwrightModule) ? pathToFileURL(playwrightModule).href : playwrightModule)
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
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
const env = { CONTENT_DB: database, ADMIN_ALLOWED_ORIGINS: 'http://127.0.0.1:5173', ADMIN_USERNAME: 'test-admin', ADMIN_PASSWORD_HASH: `100000:${encode(salt)}:${encode(hash)}`, ADMIN_SESSION_SECRET: 'test-session-secret-not-for-production', MEDIA_BASE_URL: 'https://media.animavidi.com', MAMMAL_PHOTOS: bucket }
await page.route('http://127.0.0.1:8787/**', async (route) => {
  const original = route.request()
  const response = await worker.fetch(new Request(original.url(), { method: original.method(), headers: await original.allHeaders(), body: original.postDataBuffer() ?? undefined }), env)
  await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) })
})
page.setDefaultTimeout(30000)
page.setDefaultNavigationTimeout(60000)
const errors = []
try {
page.on('pageerror', (error) => errors.push(error.message))
await page.goto('http://127.0.0.1:5173/parks/kruger/birds')
await page.getByRole('heading', { name: 'Birds', exact: true }).waitFor()
assert.equal(await page.locator('a[href^="/parks/kruger/birds/bird-"]').count(), 546)
await page.getByRole('searchbox').fill('fish eagle')
await page.getByRole('heading', { name: 'Birds (1)', exact: true }).waitFor()
assert.equal(await page.locator('a[href^="/parks/kruger/birds/bird-"]').count(), 1)
await page.screenshot({ path: join(outputDirectory, 'birds-mobile.png'), fullPage: true })
await page.locator('a[href^="/parks/kruger/birds/bird-"]').click()
await page.getByRole('heading', { name: 'African fish eagle', exact: true }).first().waitFor()
await page.waitForFunction(() => { const image = document.querySelector('header > img'); return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && !image.currentSrc.startsWith('data:') })
await page.getByRole('link', { name: 'Arturo de Frias Marques', exact: true }).waitFor()
await page.getByRole('link', { name: 'Add sighting', exact: true }).click()
await page.getByRole('heading', { name: 'New sighting', exact: true }).waitFor()
await page.screenshot({ path: join(outputDirectory, 'bird-sighting-mobile.png'), fullPage: true })
await page.getByRole('textbox', { name: /^Location/ }).fill('Nkuhlu test location')
await page.getByLabel('What made this sighting special?', { exact: false }).fill('Browser integration test')
await page.getByRole('button', { name: 'Save sighting', exact: true }).click()
await page.getByRole('heading', { name: 'A memory worth keeping' }).waitFor()
await page.getByRole('link', { name: 'View sighting', exact: true }).click()
await page.getByRole('heading', { name: 'African fish eagle', exact: true }).first().waitFor()
const sightingUrl = page.url()
await page.getByRole('link', { name: 'Edit sighting', exact: true }).click()
await page.getByRole('textbox', { name: /^Location/ }).fill('Updated test location')
await page.getByRole('button', { name: 'Save changes', exact: true }).click()
await page.getByText('Updated test location', { exact: true }).waitFor()
await page.goto('http://127.0.0.1:5173/passport')
await page.getByRole('heading', { name: 'African fish eagle', exact: true }).first().waitFor()
await page.goto(sightingUrl)
page.once('dialog', (dialog) => dialog.accept())
await page.getByRole('button', { name: 'Delete sighting', exact: true }).click()
await page.waitForURL('**/sightings?deleted=1')
console.log('Bird sighting create, edit, Passport integration and delete passed.')
await page.goto('http://127.0.0.1:5173/parks/kruger/routes')
await page.getByRole('heading', { name: 'Safari Routes', exact: true }).waitFor()
assert.equal(await page.locator('article').count(), 3)
await page.getByRole('button', { name: 'central', exact: true }).click()
await page.waitForFunction(() => document.querySelectorAll('article').length === 1)
assert.equal(await page.locator('article').count(), 1)
await page.getByRole('button', { name: 'north', exact: true }).click()
await page.getByRole('status').filter({ hasText: 'No published guides' }).waitFor()
await page.getByRole('button', { name: 'all', exact: true }).click()
await page.waitForFunction(() => document.querySelectorAll('article').length === 3)
await page.screenshot({ path: join(outputDirectory, 'routes-mobile.png'), fullPage: true })
await page.goto('http://127.0.0.1:5173/parks/kruger/mammals')
assert.equal(await page.locator('a[href^="/parks/kruger/mammals/"]').count(), 148)
await page.setViewportSize({ width: 1440, height: 1000 })
await page.goto('http://127.0.0.1:5173/parks/kruger/routes')
await page.screenshot({ path: join(outputDirectory, 'routes-desktop.png'), fullPage: true })
await page.goto('http://127.0.0.1:5173/admin/content/animals/bird-african-fish-eagle')
await page.getByRole('heading', { name: 'Administrator sign in' }).waitFor()
await page.getByLabel('Username').fill(env.ADMIN_USERNAME)
await page.getByLabel('Password').fill(password)
await page.getByRole('button', { name: 'Sign in', exact: true }).click()
await page.getByRole('heading', { name: 'Animal profile', exact: true }).waitFor()
await page.getByRole('textbox', { name: /^Introduction/ }).fill('Reviewed browser test bird profile.')
await page.getByRole('textbox', { name: /^Identification features/ }).fill('White head\nChestnut body')
await page.getByRole('textbox', { name: /^Interesting facts/ }).fill('First test fact\nSecond test fact')
await page.getByRole('button', { name: 'Save profile', exact: true }).click()
await page.waitForFunction(() => !document.querySelector('button[type="submit"]')?.disabled)
await page.goto('http://127.0.0.1:5173/parks/kruger/birds/bird-african-fish-eagle')
await page.getByText('Reviewed browser test bird profile.', { exact: true }).waitFor()
await page.getByText('White head · Chestnut body', { exact: true }).waitFor()
await page.goto('http://127.0.0.1:5173/admin/content/animals/bird-african-fish-eagle')
await page.getByRole('heading', { name: 'Animal profile', exact: true }).waitFor()
assert.equal(await page.getByRole('textbox', { name: /^Identification features/ }).inputValue(), 'White head\nChestnut body')
assert.equal(await page.getByRole('textbox', { name: /^Interesting facts/ }).inputValue(), 'First test fact\nSecond test fact')
await page.goto('http://127.0.0.1:5173/admin/routes')
await page.getByRole('heading', { name: 'Edit route', exact: true }).waitFor()
await page.getByRole('textbox', { name: /^Title/ }).fill('Browser test river route')
await page.getByRole('textbox', { name: /^Signed roads/ }).fill('H1-2\nH10')
await page.getByRole('textbox', { name: /^Designated stops/ }).fill('First test stop\nSecond test stop')
await page.getByRole('button', { name: 'Save route', exact: true }).click()
await page.waitForFunction(() => !document.querySelector('button[type="submit"]')?.disabled)
await page.goto('http://127.0.0.1:5173/parks/kruger/routes')
await page.getByRole('heading', { name: 'Browser test river route', exact: true }).waitFor()
await page.goto('http://127.0.0.1:5173/admin/routes')
await page.getByRole('heading', { name: 'Edit route', exact: true }).waitFor()
assert.equal(await page.getByRole('textbox', { name: /^Signed roads/ }).inputValue(), 'H1-2\nH10')
assert.equal(await page.getByRole('textbox', { name: /^Designated stops/ }).inputValue(), 'First test stop\nSecond test stop')
await page.getByLabel('Publish in the public route library').uncheck()
await page.getByRole('button', { name: 'Save route', exact: true }).click()
await page.waitForFunction(() => !document.querySelector('button[type="submit"]')?.disabled)
await page.goto('http://127.0.0.1:5173/parks/kruger/routes')
await page.waitForFunction(() => document.querySelectorAll('article').length === 2)
assert.equal(await page.getByRole('heading', { name: 'Browser test river route', exact: true }).count(), 0)
console.log('Administrator browser tests passed: protected login, persisted profile, persisted route title, unpublishing suppresses packaged route.')
await page.goto('http://127.0.0.1:5173/photo-credits')
await page.getByRole('heading', { name: 'Photo credits', exact: true }).waitFor()
assert.equal(await page.locator('article').count(), creditCount)
assert.equal(await page.locator('a[href^="https://creativecommons.org/"]').count(), creditCount)
await page.goto('http://127.0.0.1:5173/parks/kruger/mammals/aardvark')
await page.getByRole('link', { name: 'Kelly Abram', exact: true }).waitFor()
await page.waitForFunction(() => { const image = document.querySelector('header > img'); return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && !image.currentSrc.startsWith('data:') })
console.log(`Reviewed-photo browser checks passed: packaged mammal/bird images load, author credit is present, ${creditCount}-image credits gallery is reachable.`)
assert.deepEqual(errors, [])
console.log('Public browser checks passed: 546 birds, search, details, new sighting entry, region filters, 148 retained mammals, no JavaScript errors.')
console.log(`Browser review screenshots: ${outputDirectory}`)
} finally {
  await browser.close()
  await server.close()
  sqlite.close()
}
