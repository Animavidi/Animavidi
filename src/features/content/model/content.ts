export type AnimalEditorial = {
  kind: 'animal'
  id: string
  introduction: string
  identificationFeatures: string[]
  habitat: string
  behaviour: string
  diet: string
  groupStructure: string
  conservationStatus: string
  interestingFacts: string[]
  sourceUrl: string
}

export type SafariRoute = {
  kind: 'route'
  id: string
  title: string
  region: 'south' | 'central' | 'north'
  start: string
  end: string
  roads: string[]
  stops: string[]
  description: string
  sourceUrl: string
  sourcePages: string
  reviewedAt: string
  published: boolean
}

export type ManagedContent = AnimalEditorial | SafariRoute
export type ContentEntry = { content: ManagedContent; revision: string }
export type ContentManifest = Record<string, ContentEntry>
export type ContentHistoryItem = ContentEntry & { historyId: number; updatedAt: string }
export type ContentHistoryPage = { items: ContentHistoryItem[]; nextCursor: number | null }

const boundedText = (value: unknown, maximum = 4000): value is string => typeof value === 'string' && value.length <= maximum
const textList = (value: unknown): value is string[] => Array.isArray(value) && value.length <= 30 && value.every((item) => boundedText(item, 500))
export function isSourceUrl(value: unknown): value is string {
  if (value === '') return true
  if (typeof value !== 'string' || value.length > 2000) return false
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
}
export function isManagedContent(value: unknown): value is ManagedContent {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  if (!boundedText(entry.id, 100) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || !isSourceUrl(entry.sourceUrl)) return false
  if (entry.kind === 'animal') return ['introduction', 'habitat', 'behaviour', 'diet', 'groupStructure', 'conservationStatus'].every((key) => boundedText(entry[key])) && textList(entry.identificationFeatures) && textList(entry.interestingFacts)
  return entry.kind === 'route' && ['title', 'start', 'end', 'description', 'sourcePages'].every((key) => boundedText(entry[key])) && (entry.published === false || ['title', 'start', 'end', 'description', 'sourceUrl'].every((key) => typeof entry[key] === 'string' && entry[key].trim().length > 0)) && ['south', 'central', 'north'].includes(String(entry.region)) && textList(entry.roads) && entry.roads.length > 0 && entry.roads.every((road) => /^(H|S)\d+(?:-\d+)?$/.test(road)) && textList(entry.stops) && typeof entry.published === 'boolean' && typeof entry.reviewedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedAt) && !Number.isNaN(Date.parse(entry.reviewedAt)) && new Date(entry.reviewedAt).toISOString().slice(0, 10) === entry.reviewedAt
}
export function isContentManifest(value: unknown): value is ContentManifest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.entries(value as Record<string, unknown>).every(([key, value]) => {
    if (!value || typeof value !== 'object') return false
    const entry = value as Record<string, unknown>
    return isManagedContent(entry.content) && key === `${entry.content.kind}/${entry.content.id}` && typeof entry.revision === 'string'
  })
}
