import { getSightingAchievementTier } from '@/features/achievements/config/sightingAchievementTiers'
import type { SpeciesSightingAchievement } from '@/features/achievements/model/sightingAchievement'

export type SpeciesAchievementInput = {
  animalId: string
  date: string
  previousSightings: number
  sightingId: string
}

export function createFirstSightingAchievement(input: SpeciesAchievementInput): SpeciesSightingAchievement | undefined {
  const tier = getSightingAchievementTier(input.animalId)
  if (input.previousSightings !== 0 || (tier !== 'rare' && tier !== 'legendary')) return undefined
  return {
    animalId: input.animalId,
    date: input.date,
    id: `${tier}:${input.animalId}`,
    sightingId: input.sightingId,
    tier,
    unlockedAt: new Date().toISOString(),
  }
}

export function getPostSaveRecognitionSequence(speciesAchievement: SpeciesSightingAchievement | undefined, hasBigFiveCompletion: boolean): readonly ('species' | 'big-five' | 'saved')[] {
  return [...(speciesAchievement ? ['species' as const] : []), ...(hasBigFiveCompletion ? ['big-five' as const] : []), 'saved' as const]
}
