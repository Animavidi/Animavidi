import raw from './reviewedBirdProfiles.json'
import { isManagedContent, type AnimalEditorial } from '@/features/content/model/content'
export function getReviewedBirdContent(id: string): AnimalEditorial | undefined {
  const entry: unknown = (raw as Readonly<Record<string,unknown>>)[id]
  if(!entry || typeof entry!=='object' || !('content' in entry))return undefined
  return isManagedContent(entry.content) && entry.content.kind==='animal' && entry.content.id===id ? entry.content : undefined
}
