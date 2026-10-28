import { isManagedContent, type ContentManifest } from '../../src/features/content/model/content.ts'

type ContentEnv = { CONTENT_DB?: D1Database }
const maximumBodyBytes = 64 * 1024

export async function listContent(env: ContentEnv, includeDrafts = false): Promise<Response> {
  if (!env.CONTENT_DB) return response({ error: 'Content database is not configured.' }, 503)
  const entries: ContentManifest = {}
  const rows = await env.CONTENT_DB.prepare('SELECT kind, id, body, revision FROM content ORDER BY kind, id').all<{ kind: string; id: string; body: string; revision: string }>()
  for (const row of rows.results) {
    const content: unknown = JSON.parse(row.body)
    if (!isManagedContent(content) || row.kind !== content.kind || row.id !== content.id) continue
    if (!includeDrafts && content.kind === 'route' && !content.published) {
      entries[`route/${content.id}`] = { content: { ...content, title: 'Unpublished route', description: '', start: '', end: '', stops: [], sourceUrl: '', sourcePages: '' }, revision: row.revision }
      continue
    }
    entries[`${content.kind}/${content.id}`] = { content, revision: row.revision }
  }
  return response(entries)
}

export async function saveContent(request: Request, env: ContentEnv, kind: string, id: string, knownIds: ReadonlySet<string>): Promise<Response> {
  if (!env.CONTENT_DB) return response({ error: 'Content database is not configured.' }, 503)
  if (Number(request.headers.get('Content-Length') ?? 0) > maximumBodyBytes) return response({ error: 'Content is too large.' }, 413)
  if (!request.headers.get('Content-Type')?.includes('application/json')) return response({ error: 'JSON is required.' }, 415)
  // Bound the streamed body as well as declared Content-Length.
  const reader = request.body?.getReader()
  if (!reader) return response({ error: 'Content is required.' }, 400)
  const chunks: Uint8Array[] = []; let size = 0
  while (true) {
    const chunk = await reader.read()
    if (chunk.done) break
    size += chunk.value.byteLength
    if (size > maximumBodyBytes) { await reader.cancel(); return response({ error: 'Content is too large.' }, 413) }
    chunks.push(chunk.value)
  }
  const bytes = new Uint8Array(size); let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
  let content: unknown
  try { content = JSON.parse(new TextDecoder().decode(bytes)) } catch { return response({ error: 'Invalid JSON.' }, 400) }
  if (!isManagedContent(content) || content.kind !== kind || content.id !== id) return response({ error: 'Check the content fields, road numbers and source URL.' }, 400)
  if (kind === 'animal' && !knownIds.has(id)) return response({ error: 'Unknown species.' }, 404)
  const revision = request.headers.get('If-Match')
  if (!revision) return response({ error: 'A content revision is required.' }, 428)
  const nextRevision = crypto.randomUUID()
  const now = new Date().toISOString()
  const body = JSON.stringify(content)
  const saved = revision === 'new'
    ? await env.CONTENT_DB.prepare('INSERT INTO content(kind, id, body, revision, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(kind, id) DO NOTHING RETURNING revision').bind(kind, id, body, nextRevision, now).first<{ revision: string }>()
    : await env.CONTENT_DB.prepare('UPDATE content SET body = ?, revision = ?, updated_at = ? WHERE kind = ? AND id = ? AND revision = ? RETURNING revision').bind(body, nextRevision, now, kind, id, revision).first<{ revision: string }>()
  if (!saved) return response({ error: 'This content changed in another session. Reload before saving.' }, 412)
  return response({ content, revision: saved.revision })
}

function response(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
}
