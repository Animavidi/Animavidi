import type { Mammal } from '@/features/mammals/model/mammal'
import { findMammal } from '@/features/mammals/model/mammals'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'

export async function loadRecentlyObservedMammals(limit = 4): Promise<readonly Mammal[]> {
  const sightings = await sightingRepository.getAll()
  const newestFirst = sightings.slice().sort((left, right) => {
    const leftMoment = `${left.date}T${left.time || '00:00'}|${left.createdAt}`
    const rightMoment = `${right.date}T${right.time || '00:00'}|${right.createdAt}`
    return rightMoment.localeCompare(leftMoment)
  })
  const seen = new Set<string>()
  const recent: Mammal[] = []
  for (const sighting of newestFirst) {
    if (seen.has(sighting.animalId)) continue
    seen.add(sighting.animalId)
    const mammal = findMammal(sighting.animalId)
    if (mammal) recent.push(mammal)
    if (recent.length === limit) break
  }
  return recent
}
