export type AchievementTier = 'standard' | 'notable' | 'rare' | 'legendary'

export type SpeciesSightingAchievement = {
  readonly animalId: string
  readonly date: string
  readonly id: string
  readonly sightingId: string
  readonly tier: Extract<AchievementTier, 'rare' | 'legendary'>
  readonly unlockedAt: string
}
