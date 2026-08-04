import type { Mammal } from '@/features/mammals/model/mammal'
import type { Sighting } from '@/features/sightings/model/sighting'

export type ExplorerRankId = 'new' | 'observer' | 'tracker' | 'seasoned' | 'master'
export type ExplorerRank = { id: ExplorerRankId; title: string; uniqueSpecies: number; totalSightings: number; parksVisited: number }
export type PassportProfile = { name: string; number: string; explorerSince: string; primaryPark: string; country: string }
export type PassportAchievement = { id: string; title: string; requirement: string; earnedDate?: string }
export type SpeciesDiscovery = { mammal: Mammal; sightings: number; firstSeen: string; lastSeen: string }
export type BigFiveEntry = { id: string; title: string; mammal: Mammal; seen: boolean }
export type PassportSummary = {
  profile: PassportProfile; sightings: readonly Sighting[]; totalSightings: number; uniqueSpecies: number; parksVisited: number; countriesExplored: number;
  bigFive: readonly BigFiveEntry[]; totalAnimals: number; photographs: number; firstSighting?: string; recentSighting?: string;
  rank: ExplorerRank; nextRank?: ExplorerRank; rankProgress: number; rankMessage: string; species: readonly SpeciesDiscovery[];
  achievements: readonly PassportAchievement[]; hasKrugerVisit: boolean
}
