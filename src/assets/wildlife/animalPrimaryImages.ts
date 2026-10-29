import { getBirdPrimaryImage } from '@/assets/birds/birdPrimaryImages'
import { getMammalPrimaryImage } from '@/assets/mammals/mammalPrimaryImages'

export function getAnimalPrimaryImage(animalId: string): string | undefined {
  return getMammalPrimaryImage(animalId) ?? getBirdPrimaryImage(animalId)
}
