export type BirdDraft = { commonName: string; scientificName: string; description: string; sourceUrl: string; author?: string; kind?: 'new' | 'photo' | 'correction' | 'information'; targetId?: string; photoType?: string; photoRights?: boolean }
export type PublishedBird = BirdDraft & { id: string; approvedAt: string }
export type BirdProposal = { number: number; id: string; draft: BirdDraft; status: 'pending' | 'approved' | 'rejected'; revision: string; createdAt: string; reviewNote: string; publishedId: string }
export const birdNameKey = (name: string) => name.normalize('NFKC').trim().toLocaleLowerCase().replace(/[’']/g, '').replace(/[\s-]+/g, ' ')
const hasControlCharacters = (text: string) => [...text].some((character) => character.charCodeAt(0) < 32)
export function isBirdDraft(value: unknown): value is BirdDraft {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  if (entry.kind !== undefined && (typeof entry.kind !== 'string' || !['new','photo','correction','information'].includes(entry.kind))) return false
  if (entry.kind && entry.kind !== 'new' && (typeof entry.targetId !== 'string' || !/^[a-z0-9-]{2,100}$/.test(entry.targetId))) return false
  if (entry.author !== undefined && (typeof entry.author !== 'string' || entry.author.trim().length < 2 || entry.author.length > 80 || hasControlCharacters(entry.author))) return false
  if (typeof entry.commonName !== 'string' || entry.commonName.trim().length < 2 || entry.commonName.length > 120 || hasControlCharacters(entry.commonName)) return false
  if (typeof entry.scientificName !== 'string' || entry.scientificName.length > 160 || hasControlCharacters(entry.scientificName)) return false
  if (typeof entry.description !== 'string' || entry.description.trim().length < 20 || entry.description.length > 4000 || typeof entry.sourceUrl !== 'string' || entry.sourceUrl.length > 2000) return false
  if (!entry.sourceUrl) return true
  try { const url = new URL(entry.sourceUrl); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
}
export function isPublishedBird(value: unknown): value is PublishedBird {
  return isBirdDraft(value) && 'id' in value && typeof value.id === 'string' && /^bird-community-[a-f0-9-]{36}$/.test(value.id) && 'approvedAt' in value && typeof value.approvedAt === 'string'
}
