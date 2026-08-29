import type { AchievementTier } from '@/features/achievements/model/sightingAchievement'

export const mammalAchievementTiers = {
  'african-lion': 'notable',
  'african-elephant': 'standard',
  'african-buffalo': 'standard',
  'black-rhinoceros': 'legendary',
  'chacma-baboon': 'standard',
  cheetah: 'notable',
  'greater-kudu': 'standard',
  giraffe: 'standard',
  'honey-badger': 'rare',
  impala: 'standard',
  leopard: 'notable',
  nyala: 'standard',
  porcupine: 'rare',
  'southern-bushbuck': 'standard',
  'spotted-hyena': 'standard',
  steenbok: 'standard',
  'vervet-monkey': 'standard',
  warthog: 'standard',
  waterbuck: 'standard',
  'african-wild-dog': 'notable',
  'white-rhinoceros': 'rare',
  zebra: 'standard',
} as const satisfies Readonly<Record<string, AchievementTier>>

export function getSightingAchievementTier(animalId: string): AchievementTier {
  return mammalAchievementTiers[animalId as keyof typeof mammalAchievementTiers] ?? 'standard'
}
