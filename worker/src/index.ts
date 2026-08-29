import { getMammalId, krugerMammalChecklist } from '../../src/features/mammals/data/krugerMammalChecklist.ts'

type AdminEnv = Env & {
  ADMIN_PASSWORD_HASH: string
  ADMIN_SESSION_SECRET: string
  ADMIN_USERNAME: string
}

type R2Photo = {
  contentType: string
  uploadedAt: string
  url: string
}

const knownMammalIds = new Set(krugerMammalChecklist.map(getMammalId))
const allowedImageTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])
const sessionCookie = 'animavidi_admin_session'
const maxUploadBytes = 10 * 1024 * 1024
const sessionDurationSeconds = 8 * 60 * 60

export default {
  async fetch(request: Request, env: AdminEnv): Promise<Response> {
    const origin = request.headers.get('Origin')
    const cors = corsHeaders(origin, env)
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })

    try {
      const url = new URL(request.url)
      let response: Response
      if (url.pathname.startsWith('/api/admin/') && !isAllowedOrigin(origin, env)) response = json({ error: 'Origin not allowed.' }, 403)
      else if (request.method === 'GET' && url.pathname === '/api/photos') response = await listPhotos(env)
      else if (request.method === 'POST' && url.pathname === '/api/admin/login') response = await login(request, env)
      else if (request.method === 'POST' && url.pathname === '/api/admin/logout') response = logout(request)
      else if (request.method === 'GET' && url.pathname === '/api/admin/session') response = await sessionStatus(request, env)
      else {
        const match = url.pathname.match(/^\/api\/admin\/mammals\/([^/]+)\/photo$/)
        if (match && request.method === 'PUT') response = await uploadPhoto(request, env, decodeURIComponent(match[1]))
        else if (match && request.method === 'DELETE') response = await deletePhoto(request, env, decodeURIComponent(match[1]))
        else response = json({ error: 'Not found' }, 404)
      }
      return withHeaders(response, cors)
    } catch (error) {
      console.error(JSON.stringify({ event: 'admin_api_error', message: error instanceof Error ? error.message : 'Unknown error' }))
      return withHeaders(json({ error: 'The photo service is temporarily unavailable.' }, 500), cors)
    }
  },
} satisfies ExportedHandler<AdminEnv>

async function login(request: Request, env: AdminEnv): Promise<Response> {
  const body = await readJson(request)
  if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') return json({ error: 'Enter your administrator credentials.' }, 400)
  const usernameValid = await secureEqual(body.username, env.ADMIN_USERNAME)
  const passwordValid = await verifyPassword(body.password, env.ADMIN_PASSWORD_HASH)
  if (!usernameValid || !passwordValid) return json({ error: 'The administrator credentials are not valid.' }, 401)

  const expiresAt = Math.floor(Date.now() / 1000) + sessionDurationSeconds
  const token = await createSessionToken(env.ADMIN_USERNAME, expiresAt, env.ADMIN_SESSION_SECRET)
  return json({ administrator: env.ADMIN_USERNAME, expiresAt }, 200, { 'Set-Cookie': cookieValue(token, sessionDurationSeconds, new URL(request.url).protocol === 'https:') })
}

function logout(request: Request): Response {
  if (!request.headers.get('Cookie')?.includes(`${sessionCookie}=`)) return json({ ok: true })
  return json({ ok: true }, 200, { 'Set-Cookie': cookieValue('', 0, new URL(request.url).protocol === 'https:') })
}

async function sessionStatus(request: Request, env: AdminEnv): Promise<Response> {
  const session = await authenticate(request, env)
  return session ? json({ authenticated: true, administrator: session.sub, expiresAt: session.exp }) : json({ authenticated: false }, 401)
}

async function uploadPhoto(request: Request, env: AdminEnv, mammalId: string): Promise<Response> {
  if (!await authenticate(request, env)) return json({ error: 'Your admin session has expired.' }, 401)
  if (!knownMammalIds.has(mammalId)) return json({ error: 'Unknown mammal ID.' }, 404)
  const contentLength = Number(request.headers.get('Content-Length') ?? '0')
  if (contentLength > maxUploadBytes + 1024 * 128) return json({ error: 'The photo is larger than 10 MB.' }, 413)

  const form = await request.formData()
  const photo = form.get('photo')
  if (!(photo instanceof File)) return json({ error: 'Choose a photo to upload.' }, 400)
  const extension = allowedImageTypes.get(photo.type)
  if (!extension) return json({ error: 'Use a JPEG, PNG or WebP photo.' }, 415)
  if (photo.size <= 0 || photo.size > maxUploadBytes) return json({ error: 'The photo must be between 1 byte and 10 MB.' }, 413)
  const bytes = await photo.arrayBuffer()
  if (!matchesImageSignature(new Uint8Array(bytes), photo.type)) return json({ error: 'The file content does not match its image type.' }, 415)

  const key = photoKey(mammalId, extension)
  await deletePhotoVariants(env, mammalId)
  const uploadedAt = new Date().toISOString()
  const stored = await env.MAMMAL_PHOTOS.put(key, bytes, {
    httpMetadata: { cacheControl: 'public, max-age=3600', contentType: photo.type },
    customMetadata: { mammalId, uploadedAt },
  })
  if (!stored) return json({ error: 'The photo could not be stored.' }, 500)
  return json({ mammalId, photo: photoResponse(env, key, photo.type, uploadedAt, stored.etag) })
}

function matchesImageSignature(bytes: Uint8Array, contentType: string): boolean {
  if (contentType === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (contentType === 'image/png') return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte)
  return bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
}

async function deletePhoto(request: Request, env: AdminEnv, mammalId: string): Promise<Response> {
  if (!await authenticate(request, env)) return json({ error: 'Your admin session has expired.' }, 401)
  if (!knownMammalIds.has(mammalId)) return json({ error: 'Unknown mammal ID.' }, 404)
  await deletePhotoVariants(env, mammalId)
  return json({ mammalId, removed: true })
}

async function listPhotos(env: AdminEnv): Promise<Response> {
  const photos: Record<string, R2Photo> = {}
  let cursor: string | undefined
  do {
    const page = await env.MAMMAL_PHOTOS.list({ cursor, include: ['customMetadata', 'httpMetadata'], prefix: 'mammals/' })
    for (const object of page.objects) {
      const match = object.key.match(/^mammals\/([^/]+)\/primary\.(?:jpg|png|webp)$/)
      if (!match || !knownMammalIds.has(match[1])) continue
      const contentType = object.httpMetadata?.contentType ?? contentTypeForKey(object.key)
      const uploadedAt = object.customMetadata?.uploadedAt ?? object.uploaded.toISOString()
      photos[match[1]] = photoResponse(env, object.key, contentType, uploadedAt, object.etag)
    }
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)
  return json({ photos }, 200, { 'Cache-Control': 'no-store' })
}

async function deletePhotoVariants(env: AdminEnv, mammalId: string): Promise<void> {
  await env.MAMMAL_PHOTOS.delete([...allowedImageTypes.values()].map((extension) => photoKey(mammalId, extension)))
}

function photoKey(mammalId: string, extension: string): string {
  return `mammals/${mammalId}/primary.${extension}`
}

function photoResponse(env: AdminEnv, key: string, contentType: string, uploadedAt: string, version: string): R2Photo {
  return { contentType, uploadedAt, url: `${env.MEDIA_BASE_URL.replace(/\/$/, '')}/${key}?v=${encodeURIComponent(version)}` }
}

function contentTypeForKey(key: string): string {
  if (key.endsWith('.png')) return 'image/png'
  if (key.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

type SessionPayload = { exp: number; sub: string }

async function authenticate(request: Request, env: AdminEnv): Promise<SessionPayload | undefined> {
  const token = readCookie(request.headers.get('Cookie'), sessionCookie)
  if (!token) return undefined
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return undefined
  const expected = await sign(encodedPayload, env.ADMIN_SESSION_SECRET)
  if (!await secureEqual(signature, expected)) return undefined
  try {
    const payload: unknown = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload)))
    if (!isSessionPayload(payload) || payload.exp <= Math.floor(Date.now() / 1000)) return undefined
    return payload
  } catch {
    return undefined
  }
}

async function createSessionToken(sub: string, exp: number, secret: string): Promise<string> {
  const payload = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ exp, sub } satisfies SessionPayload)))
  return `${payload}.${await sign(payload, secret)}`
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { hash: 'SHA-256', name: 'HMAC' }, false, ['sign'])
  return base64UrlEncode(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))))
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [iterationsText, salt, expected] = stored.split(':')
  const iterations = Number(iterationsText)
  if (!iterations || !salt || !expected || iterations < 100_000) return false
  try {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
    const result = await crypto.subtle.deriveBits({ hash: 'SHA-256', iterations, name: 'PBKDF2', salt: base64UrlDecode(salt) }, key, 256)
    return secureEqual(base64UrlEncode(new Uint8Array(result)), expected)
  } catch {
    return false
  }
}

async function secureEqual(left: string, right: string): Promise<boolean> {
  const leftHash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(left)))
  const rightHash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(right)))
  let difference = 0
  for (let index = 0; index < leftHash.length; index += 1) difference |= leftHash[index] ^ rightHash[index]
  return difference === 0
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function readCookie(header: string | null, name: string): string | undefined {
  return header?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1)
}

function cookieValue(value: string, maxAge: number, secure: boolean): string {
  return `${sessionCookie}=${value}; HttpOnly;${secure ? ' Secure; SameSite=None;' : ' SameSite=Lax;'} Path=/; Max-Age=${maxAge}`
}

async function readJson(request: Request): Promise<Record<string, unknown> | undefined> {
  if (!request.headers.get('Content-Type')?.toLocaleLowerCase().includes('application/json')) return undefined
  try {
    const value: unknown = await request.json()
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined
  } catch {
    return undefined
  }
}

function isSessionPayload(value: unknown): value is SessionPayload {
  return Boolean(value && typeof value === 'object' && 'exp' in value && typeof value.exp === 'number' && 'sub' in value && typeof value.sub === 'string')
}

function corsHeaders(origin: string | null, env: AdminEnv): Headers {
  const headers = new Headers({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'DELETE,GET,POST,PUT,OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  })
  if (isAllowedOrigin(origin, env) && origin) headers.set('Access-Control-Allow-Origin', origin)
  return headers
}

function isAllowedOrigin(origin: string | null, env: AdminEnv): boolean {
  return Boolean(origin && env.ADMIN_ALLOWED_ORIGINS.split(',').map((entry) => entry.trim()).includes(origin))
}

function json(body: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff', ...headers }, status })
}

function withHeaders(response: Response, extra: Headers): Response {
  const headers = new Headers(response.headers)
  extra.forEach((value, key) => headers.set(key, value))
  return new Response(response.body, { headers, status: response.status, statusText: response.statusText })
}
