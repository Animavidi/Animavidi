import { birdNameKey, isBirdDraft, type BirdDraft, type BirdProposal } from '../../src/features/birds/model/communityBird.ts'
import { krugerBirdChecklist } from '../../src/features/birds/data/krugerBirdChecklist.ts'

type BirdEnv = { CONTENT_DB?: D1Database; ADMIN_SESSION_SECRET: string }
const response = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
const knownNames = new Set(krugerBirdChecklist.flatMap((bird) => [birdNameKey(bird.commonName), birdNameKey(bird.scientificName)]))
const normalized = (draft: BirdDraft): BirdDraft => ({ commonName: draft.commonName.trim(), scientificName: draft.scientificName.trim(), description: draft.description.trim(), sourceUrl: draft.sourceUrl.trim(), author: draft.author?.trim() || 'Anonymous contributor' })
type ProposalRow = { proposal_no: number; id: string; body: string; status: BirdProposal['status']; revision: string; created_at: string; review_note: string; published_id: string }
const proposal = (row: ProposalRow): BirdProposal => ({ number: row.proposal_no, id: row.id, draft: JSON.parse(row.body) as BirdDraft, status: row.status, revision: row.revision, createdAt: row.created_at, reviewNote: row.review_note, publishedId: row.published_id })

async function boundedJson(request: Request): Promise<unknown> {
  if (!request.headers.get('Content-Type')?.includes('application/json')) throw new Error('JSON_REQUIRED')
  const reader = request.body?.getReader(); if (!reader) throw new Error('INVALID_BODY')
  const chunks: Uint8Array[] = []; let length = 0
  while (true) { const part = await reader.read(); if (part.done) break; length += part.value.length; if (length > 16000) { await reader.cancel(); throw new Error('BODY_TOO_LARGE') } chunks.push(part.value) }
  const bytes = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  try { return JSON.parse(new TextDecoder().decode(bytes)) as unknown } catch { throw new Error('INVALID_BODY') }
}
async function duplicate(env: BirdEnv, draft: BirdDraft): Promise<boolean> {
  const common = birdNameKey(draft.commonName), scientific = birdNameKey(draft.scientificName)
  return knownNames.has(common) || Boolean(scientific && knownNames.has(scientific)) || Boolean(await env.CONTENT_DB!.prepare('SELECT id FROM approved_birds WHERE name_key = ? OR (scientific_key <> ? AND scientific_key = ?) LIMIT 1').bind(common, '', scientific).first())
}
export async function handleBirds(request: Request, env: BirdEnv, administrator?: string): Promise<Response> {
  if (!env.CONTENT_DB) return response({ error: 'Bird submissions are not configured.' }, 503)
  const db = env.CONTENT_DB, url = new URL(request.url)
  try {
    if (request.method === 'GET' && url.pathname === '/api/birds') {
      const after = Number(url.searchParams.get('after') ?? 0)
      if (!Number.isSafeInteger(after) || after < 0) return response({ error: 'Invalid catalogue cursor.' }, 400)
      const rows = await db.prepare('SELECT sequence,id,body,approved_at FROM approved_birds WHERE sequence > ? ORDER BY sequence LIMIT 101').bind(after).all<{ sequence: number; id: string; body: string; approved_at: string }>()
      return response({ birds: rows.results.slice(0,100).map((row) => ({ ...JSON.parse(row.body) as BirdDraft, id: row.id, approvedAt: row.approved_at })), nextCursor: rows.results.length > 100 ? rows.results[99].sequence : null })
    }
    if (request.method === 'POST' && url.pathname === '/api/bird-proposals') {
      const body = await boundedJson(request)
      if (!isBirdDraft(body)) return response({ error: 'Enter a name and a description of 20–4000 characters. Source links must use HTTPS.' }, 400)
      const draft = normalized(body)
      const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.ADMIN_SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(request.headers.get('CF-Connecting-IP') ?? 'local'))
      const clientKey = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2,'0')).join('')
      const window = Math.floor(Date.now() / 3600000)
      const limit = await db.prepare('INSERT INTO bird_submission_limits(client_key,window_start,attempts) VALUES (?,?,1) ON CONFLICT(client_key) DO UPDATE SET attempts = CASE WHEN window_start = excluded.window_start THEN attempts + 1 ELSE 1 END, window_start = excluded.window_start RETURNING attempts').bind(clientKey, window).first<{ attempts: number }>()
      if (!limit || limit.attempts > 5) return response({ error: 'Too many proposals. Try again in an hour.' }, 429)
      if (await duplicate(env, draft)) return response({ error: 'This bird is already in the catalogue. Search the existing birds first.' }, 409)
      const id = crypto.randomUUID(), publishedId = `bird-community-${crypto.randomUUID()}`, revision = crypto.randomUUID(), now = new Date().toISOString()
      await db.prepare('INSERT INTO bird_proposals(id,body,name_key,scientific_key,revision,published_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?) RETURNING id').bind(id,JSON.stringify(draft),birdNameKey(draft.commonName),birdNameKey(draft.scientificName),revision,publishedId,now,now).first()
      return response({ id, status: 'pending', message: 'Submitted for administrator approval. This bird is not public yet.' }, 201)
    }
    if (!administrator) return response({ error: 'Your admin session has expired.' }, 401)
    if (request.method === 'GET' && url.pathname === '/api/admin/bird-proposals') {
      const status = url.searchParams.get('status') ?? 'pending', before = Number(url.searchParams.get('before') ?? Number.MAX_SAFE_INTEGER)
      if (!['pending','approved','rejected'].includes(status) || !Number.isSafeInteger(before) || before < 1) return response({ error: 'Invalid queue filter.' }, 400)
      const rows = await db.prepare('SELECT * FROM bird_proposals WHERE status = ? AND proposal_no < ? ORDER BY proposal_no DESC LIMIT 26').bind(status,before).all<ProposalRow>()
      return response({ items: rows.results.slice(0,25).map(proposal), nextCursor: rows.results.length > 25 ? rows.results[24].proposal_no : null })
    }
    const match = url.pathname.match(/^\/api\/admin\/bird-proposals\/([a-f0-9-]{36})$/)
    if (request.method === 'PUT' && match) {
      const body = await boundedJson(request)
      if (!body || typeof body !== 'object' || !('draft' in body) || !isBirdDraft(body.draft) || !('action' in body) || !['save','approve','reject'].includes(String(body.action)) || !('reviewNote' in body) || typeof body.reviewNote !== 'string' || body.reviewNote.length > 1000) return response({ error: 'Invalid review fields.' },400)
      const revision = request.headers.get('If-Match'); if (!revision) return response({ error: 'Reload the proposal before reviewing.' },428)
      const current = await db.prepare('SELECT revision,status,body FROM bird_proposals WHERE id = ?').bind(match[1]).first<{ revision: string; status: string; body: string }>()
      if (!current || current.revision !== revision || current.status !== 'pending') return response({ error: 'This proposal was changed or reviewed already. Reload before saving.' },412)
      const draft = normalized(body.draft)
      draft.author = (JSON.parse(current.body) as BirdDraft).author ?? 'Anonymous contributor'
      if (body.action !== 'reject' && await duplicate(env,draft)) return response({ error: 'A bird with this name or scientific name already exists.' },409)
      const status = body.action === 'approve' ? 'approved' : body.action === 'reject' ? 'rejected' : 'pending'
      const row = await db.prepare('UPDATE bird_proposals SET body=?,name_key=?,scientific_key=?,status=?,revision=?,updated_at=?,reviewer=?,review_note=? WHERE id=? AND revision=? AND status=? RETURNING *').bind(JSON.stringify(draft),birdNameKey(draft.commonName),birdNameKey(draft.scientificName),status,crypto.randomUUID(),new Date().toISOString(),administrator,body.reviewNote.trim(),match[1],revision,'pending').first<ProposalRow>()
      return row ? response(proposal(row)) : response({ error: 'This proposal was changed or reviewed already. Reload before saving.' },412)
    }
    return response({ error: 'Not found.' },404)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message.includes('UNIQUE constraint')) return response({ error: 'This bird has already been proposed or approved.' },409)
    if (message === 'BODY_TOO_LARGE') return response({ error: 'Submission is too large.' },413)
    if (message === 'JSON_REQUIRED' || message === 'INVALID_BODY') return response({ error: 'A valid JSON submission is required.' },400)
    // Fail closed during a rollout where migration 0002 has not yet been applied.
    console.error(JSON.stringify({ event: 'bird_catalogue_error', message }))
    return response({ error: 'The bird catalogue is temporarily unavailable.' },503)
  }
}
export async function isApprovedBird(env: BirdEnv, id: string): Promise<boolean> {
  return Boolean(env.CONTENT_DB && /^bird-community-[a-f0-9-]{36}$/.test(id) && await env.CONTENT_DB.prepare('SELECT id FROM approved_birds WHERE id = ?').bind(id).first())
}
