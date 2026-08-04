export type BigFiveCompletionTransition = {
  afterCount: number
  alreadyCelebrated: boolean
  beforeCount: number
  savedAnimalIsBigFive: boolean
}

export function shouldCelebrateBigFive({ afterCount, alreadyCelebrated, beforeCount, savedAnimalIsBigFive }: BigFiveCompletionTransition) {
  return savedAnimalIsBigFive && !alreadyCelebrated && beforeCount < 5 && afterCount === 5
}
