import { getAdminApiBaseUrl } from '@/features/mammals/services/mammalPhotoApi'
import { isBirdDraft, type BirdDraft, type BirdProposal } from '../model/communityBird'
async function call(path: string, init?: RequestInit, admin = false): Promise<unknown> {
  const base = getAdminApiBaseUrl(); if (!base) throw new Error('The bird service is not configured yet.')
  const response = await fetch(base+path,{ ...init,credentials: admin ? 'include' : 'omit' })
  const data: unknown = await response.json()
  if (!response.ok) throw new Error(data && typeof data === 'object' && 'error' in data && typeof data.error === 'string' ? data.error : 'The bird service is unavailable.')
  return data
}
export async function submitBird(draft: BirdDraft, photo?: Blob): Promise<void> {
  if(photo) { const form = new FormData(); form.set('draft',JSON.stringify(draft)); form.set('photo',photo,'contribution.webp'); await call('/api/bird-proposals',{method:'POST',body:form}) }
  else await call('/api/bird-proposals',{ method: 'POST',headers: { 'Content-Type': 'application/json' },body: JSON.stringify(draft) })
}
export async function loadBirdContributions(targetId:string): Promise<{id:string;draft:BirdDraft;approvedAt:string}[]> {
  const data = await call(`/api/bird-contributions?target=${encodeURIComponent(targetId)}`)
  if(!data || typeof data !== 'object' || !('items' in data) || !Array.isArray(data.items)) throw new Error('Invalid contribution response.')
  return data.items.filter((item:unknown): item is {id:string;draft:BirdDraft;approvedAt:string} => Boolean(item && typeof item === 'object' && 'id' in item && typeof item.id === 'string' && 'draft' in item && isBirdDraft(item.draft) && 'approvedAt' in item && typeof item.approvedAt === 'string'))
}
function isProposal(value: unknown): value is BirdProposal {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string,unknown>
  return Number.isSafeInteger(entry.number) && typeof entry.id === 'string' && isBirdDraft(entry.draft) && ['pending','approved','rejected'].includes(String(entry.status)) && typeof entry.revision === 'string' && typeof entry.createdAt === 'string' && typeof entry.reviewNote === 'string' && typeof entry.publishedId === 'string'
}
export async function loadBirdProposals(status: BirdProposal['status'], before?: number): Promise<{ items: BirdProposal[]; nextCursor: number | null }> {
  const data = await call(`/api/admin/bird-proposals?status=${status}${before ? `&before=${before}` : ''}`,undefined,true)
  if (!data || typeof data !== 'object' || !('items' in data) || !Array.isArray(data.items) || !data.items.every(isProposal) || !('nextCursor' in data) || !(data.nextCursor === null || (typeof data.nextCursor === 'number' && Number.isSafeInteger(data.nextCursor)))) throw new Error('Invalid proposal queue response.')
  return { items: data.items, nextCursor: data.nextCursor }
}
export async function reviewBird(proposal: BirdProposal, draft: BirdDraft, action: 'save' | 'approve' | 'reject', reviewNote: string): Promise<void> {
  await call(`/api/admin/bird-proposals/${proposal.id}`,{ method: 'PUT',headers: { 'Content-Type': 'application/json','If-Match': proposal.revision },body: JSON.stringify({ draft,action,reviewNote }) },true)
}
