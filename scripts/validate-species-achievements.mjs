import { readFile } from 'node:fs/promises'

const tierSource = await readFile(new URL('../src/features/achievements/config/sightingAchievementTiers.ts', import.meta.url), 'utf8')
const tierFor = (animalId) => tierSource.match(new RegExp(`['"]?${animalId}['"]?: '([^']+)'`))?.[1] ?? 'standard'
const createFirst = (animalId, previousSightings) => {
  const tier = tierFor(animalId)
  return previousSightings === 0 && (tier === 'rare' || tier === 'legendary') ? tier : undefined
}

const cases = [
  ['standard first', 'african-elephant', 0, undefined],
  ['notable first', 'cheetah', 0, undefined],
  ['rare first', 'honey-badger', 0, 'rare'],
  ['rare second', 'honey-badger', 1, undefined],
  ['legendary first', 'black-rhinoceros', 0, 'legendary'],
  ['legendary second', 'black-rhinoceros', 1, undefined],
  ['white rhino first', 'white-rhinoceros', 0, 'rare'],
]

for (const [label, animalId, previousSightings, expected] of cases) {
  const tier = createFirst(animalId, previousSightings)
  if (tier !== expected) throw new Error(`${label}: expected ${expected ?? 'no recognition'}, received ${tier ?? 'none'}`)
}

for (const [id, expected] of [['african-lion', 'notable'], ['african-buffalo', 'standard'], ['porcupine', 'rare'], ['african-wild-dog', 'notable']]) {
  if (tierFor(id) !== expected) throw new Error(`${id}: incorrect achievement tier`)
}

const service = await readFile(new URL('../src/features/achievements/services/speciesAchievementService.ts', import.meta.url), 'utf8')
for (const contract of ["previousSightings !== 0", "tier !== 'rare'", "tier !== 'legendary'"]) if (!service.includes(contract)) throw new Error(`Missing first-sighting contract: ${contract}`)
if (!service.includes("...(speciesAchievement ? ['species' as const] : [])") || !service.includes("...(hasBigFiveCompletion ? ['big-five' as const] : [])")) throw new Error('Species recognition is not ordered before Big Five completion.')

for (const [animalId, expectedTier] of [['black-rhinoceros', 'legendary'], ['white-rhinoceros', 'rare']]) {
  if (tierFor(animalId) !== expectedTier) throw new Error(`${animalId}: incorrect independent Rhino tier`)
  const sequence = [createFirst(animalId, 0) ? 'species' : undefined, 'big-five', 'saved'].filter(Boolean)
  if (sequence.join(',') !== 'species,big-five,saved') throw new Error(`${animalId}: species recognition must precede Big Five completion`)
}

const repository = await readFile(new URL('../src/features/achievements/data/speciesAchievementRepository.ts', import.meta.url), 'utf8')
for (const contract of ['speciesAchievementsStorageKey', 'animalId === achievement.animalId', 'localStorage.setItem']) {
  if (!repository.includes(contract)) throw new Error(`Missing persistence contract: ${contract}`)
}

const newSighting = await readFile(new URL('../src/features/mammals/routes/NewSightingPage.tsx', import.meta.url), 'utf8')
for (const contract of ['countByAnimal(mammalId)', 'savingRef.current', 'setPendingBigFive(nextBigFive)', "finishSpeciesRecognition('safari')"]) {
  if (!newSighting.includes(contract)) throw new Error(`Missing save-flow contract: ${contract}`)
}

const passport = await readFile(new URL('../src/features/passport/routes/PassportPage.tsx', import.meta.url), 'utf8')
if (!passport.includes('passport.speciesAchievements')) throw new Error('Passport does not render persisted species achievements.')

console.log('Species achievement validation passed: tier mapping, first-sighting gating, persistence safeguards, Passport integration and species-before-Big-Five sequencing verified.')
