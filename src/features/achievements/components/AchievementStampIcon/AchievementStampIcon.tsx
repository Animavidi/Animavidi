import type { SpeciesSightingAchievement } from '@/features/achievements/model/sightingAchievement'

export function AchievementStampIcon({ tier }: { tier: SpeciesSightingAchievement['tier'] }) {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 64 64">
    {tier === 'legendary'
      ? <><path d="m10 21 10 10 12-20 12 20 10-10-4 27H14Z" /><path d="M14 53h36M20 17l-4-6m28 6 4-6M32 8V3" /></>
      : <><path d="m32 7 7.2 15.2L56 24.7 43.8 36.5 47 53 32 45.1 17 53l3.2-16.5L8 24.7l16.8-2.5Z" /><path d="M16 58h32" /></>}
  </svg>
}
