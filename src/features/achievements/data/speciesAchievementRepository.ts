import type { SpeciesSightingAchievement } from '@/features/achievements/model/sightingAchievement'

export const speciesAchievementsStorageKey = 'animavidi.achievements.species.v1'

function read(): SpeciesSightingAchievement[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(speciesAchievementsStorageKey) ?? '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item): item is SpeciesSightingAchievement => {
      if (!item || typeof item !== 'object') return false
      const candidate = item as Partial<SpeciesSightingAchievement>
      return typeof candidate.id === 'string' && typeof candidate.animalId === 'string' && typeof candidate.date === 'string'
        && typeof candidate.sightingId === 'string' && typeof candidate.unlockedAt === 'string'
        && (candidate.tier === 'rare' || candidate.tier === 'legendary')
    })
  } catch { return [] }
}

export const speciesAchievementRepository = {
  getAll(): readonly SpeciesSightingAchievement[] { return read() },
  has(animalId: string): boolean { return read().some((item) => item.animalId === animalId) },
  unlock(achievement: SpeciesSightingAchievement): { achievement: SpeciesSightingAchievement; isNew: boolean } {
    const current = read()
    const existing = current.find((item) => item.animalId === achievement.animalId)
    if (existing) return { achievement: existing, isNew: false }
    try {
      localStorage.setItem(speciesAchievementsStorageKey, JSON.stringify([...current, achievement]))
      return { achievement, isNew: true }
    } catch { return { achievement, isNew: false } }
  },
} as const
