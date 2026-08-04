import { achievementDefinitions, demoPassportProfile, explorerRanks, onboardingCompletionKey } from '@/features/passport/config/passportConfig'
import type { BigFiveEntry, PassportSummary, SpeciesDiscovery } from '@/features/passport/model/passport'
import { findMammal } from '@/features/mammals/model/mammals'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'
import type { Sighting } from '@/features/sightings/model/sighting'

const ordered = (items: readonly Sighting[]) => [...items].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
const rhinoSeen = (ids: Set<string>) => ids.has('white-rhinoceros') || ids.has('black-rhinoceros')

export async function loadPassport(): Promise<PassportSummary> {
  const sightings = ordered(await sightingRepository.getAll()); const ids = new Set(sightings.map((item) => item.animalId)); const onboardingComplete = localStorage.getItem(onboardingCompletionKey) === 'true'; const hasKrugerVisit = onboardingComplete || sightings.some((item) => item.parkId === 'kruger')
  const species: SpeciesDiscovery[] = [...ids].flatMap((id) => { const mammal = findMammal(id); if (!mammal) return []; const records = sightings.filter((item) => item.animalId === id); return [{ mammal, sightings: records.length, firstSeen: records[0].date, lastSeen: records.at(-1)!.date }] }).sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
  const bigFive: BigFiveEntry[] = [
    ['african-lion', 'African Lion'], ['african-elephant', 'African Elephant'], ['leopard', 'Leopard'], ['african-buffalo', 'African Buffalo'], ['white-rhinoceros', 'Rhinoceros'],
  ].flatMap(([id, title]) => { const mammal = findMammal(id); return mammal ? [{ id, title, mammal, seen: title === 'Rhinoceros' ? rhinoSeen(ids) : ids.has(id) }] : [] })
  const parksVisited = hasKrugerVisit ? 1 : 0; const uniqueSpecies = species.length; const totalSightings = sightings.length
  const rankIndex = explorerRanks.reduce((result, rank, index) => uniqueSpecies >= rank.uniqueSpecies && totalSightings >= rank.totalSightings && parksVisited >= rank.parksVisited ? index : result, 0)
  const rank = explorerRanks[rankIndex]; const nextRank = explorerRanks[rankIndex + 1]
  const rankProgress = nextRank ? Math.min(100, Math.round(((uniqueSpecies / nextRank.uniqueSpecies + totalSightings / nextRank.totalSightings + parksVisited / nextRank.parksVisited) / 3) * 100)) : 100
  const rankMessage = nextRank ? `Next: ${nextRank.title}. Reach ${nextRank.uniqueSpecies} species, ${nextRank.totalSightings} sightings and ${nextRank.parksVisited} park${nextRank.parksVisited === 1 ? '' : 's'}.` : 'You have reached the highest current explorer rank.'
  const values = { sightings: totalSightings, photos: sightings.reduce((sum, item) => sum + item.photos.length, 0), species: uniqueSpecies, 'big-five': bigFive.filter((item) => item.seen).length, parks: parksVisited }
  const achievementDate = (kind: keyof typeof values, target: number) => { if (values[kind] < target) return undefined; if (kind === 'photos') return sightings.find((item) => item.photos.length)?.date; if (kind === 'parks') return sightings[0]?.date ?? (onboardingComplete ? new Date().toISOString().slice(0, 10) : undefined); if (kind === 'species') { const seen = new Set<string>(); return sightings.find((item) => { seen.add(item.animalId); return seen.size >= target })?.date } if (kind === 'big-five') { const seen = new Set<string>(); return sightings.find((item) => { const mammal = findMammal(item.animalId); if (mammal?.categories.includes('big-five')) seen.add(item.animalId.includes('rhinoceros') ? 'rhinoceros' : item.animalId); return seen.size >= target })?.date } return sightings[target - 1]?.date }
  return { profile: demoPassportProfile, sightings: [...sightings].reverse(), totalSightings, uniqueSpecies, parksVisited, countriesExplored: parksVisited, bigFive, totalAnimals: sightings.reduce((sum, item) => sum + item.count, 0), photographs: values.photos, firstSighting: sightings[0]?.date, recentSighting: sightings.at(-1)?.date, rank, nextRank, rankProgress, rankMessage, species, achievements: achievementDefinitions.map((item) => ({ id: item.id, title: item.title, requirement: item.requirement, earnedDate: achievementDate(item.kind, item.target) })), hasKrugerVisit }
}
