import type { Sighting } from '@/features/sightings/model/sighting'

export type AnimalSightingSummary = {
  readonly firstObserved?: string
  readonly lastObserved?: string
  readonly locations: number
  readonly maximumCount?: number
  readonly recentSightings: readonly Sighting[]
  readonly sightings: number
}

export function aggregateAnimalSightings(allSightings: readonly Sighting[], animalId: string): AnimalSightingSummary {
  const sightings = allSightings
    .filter((sighting) => sighting.animalId === animalId)
    .slice()
    .sort((left, right) => `${right.date}T${right.time}`.localeCompare(`${left.date}T${left.time}`))
  const locations = new Set(sightings.map((sighting) => sighting.location.trim().toLocaleLowerCase()).filter(Boolean))

  return {
    firstObserved: sightings.at(-1)?.date,
    lastObserved: sightings[0]?.date,
    locations: locations.size,
    maximumCount: sightings.length ? Math.max(...sightings.map((sighting) => sighting.count)) : undefined,
    recentSightings: sightings.slice(0, 2),
    sightings: sightings.length,
  }
}
