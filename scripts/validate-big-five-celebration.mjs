import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

import { shouldCelebrateBigFive } from '../src/features/passport/services/bigFiveCelebration.ts'

const scenarios = [
  ['no sightings', { beforeCount: 0, afterCount: 1, savedAnimalIsBigFive: true, alreadyCelebrated: false }, false],
  ['four categories', { beforeCount: 4, afterCount: 4, savedAnimalIsBigFive: true, alreadyCelebrated: false }, false],
  ['fifth category', { beforeCount: 4, afterCount: 5, savedAnimalIsBigFive: true, alreadyCelebrated: false }, true],
  ['already celebrated', { beforeCount: 4, afterCount: 5, savedAnimalIsBigFive: true, alreadyCelebrated: true }, false],
  ['later Big Five sighting', { beforeCount: 5, afterCount: 5, savedAnimalIsBigFive: true, alreadyCelebrated: true }, false],
  ['non Big Five save', { beforeCount: 4, afterCount: 5, savedAnimalIsBigFive: false, alreadyCelebrated: false }, false],
  ['existing completed profile', { beforeCount: 5, afterCount: 5, savedAnimalIsBigFive: true, alreadyCelebrated: false }, false],
  ['deleted later sighting', { beforeCount: 4, afterCount: 5, savedAnimalIsBigFive: true, alreadyCelebrated: true }, false],
]

for (const [name, input, expected] of scenarios) {
  const actual = shouldCelebrateBigFive(input)
  if (actual !== expected) throw new Error(`${name}: expected ${expected}, received ${actual}`)
}

const audio = await readFile(new URL('../src/assets/audio/big-five-complete.wav', import.meta.url))
if (audio.subarray(0, 4).toString('ascii') !== 'RIFF' || audio.subarray(8, 12).toString('ascii') !== 'WAVE') throw new Error('Achievement audio is not a valid RIFF/WAVE asset.')
if (audio.byteLength !== 598028) throw new Error(`Achievement audio size changed: ${audio.byteLength}`)
const hash = createHash('sha256').update(audio).digest('hex').toUpperCase()
if (hash !== 'B384F1928FB9D61D6C1DA17C1393FA044FF86A57A4DDABAC78FF4AE562E58BD5') throw new Error('Achievement audio differs from the supplied original.')

const passportService = await readFile(new URL('../src/features/passport/services/passportService.ts', import.meta.url), 'utf8')
if (!passportService.includes("ids.has('white-rhinoceros') || ids.has('black-rhinoceros')")) throw new Error('Shared Passport aggregation no longer combines White and Black Rhinoceros.')

const celebration = await readFile(new URL('../src/features/passport/components/BigFiveCelebration/BigFiveCelebration.tsx', import.meta.url), 'utf8')
for (const contract of ['aria-modal="true"', 'aria-live="assertive"', 'role="dialog"', 'handleKeyDown', 'Mute achievement theme', 'Play achievement theme']) {
  if (!celebration.includes(contract)) throw new Error(`Missing celebration accessibility contract: ${contract}`)
}

console.log('Big Five celebration validation passed: transition scenarios, Rhino aggregation, accessibility contracts and untouched WAV verified.')
