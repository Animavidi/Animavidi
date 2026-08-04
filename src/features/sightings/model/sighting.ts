export type SightingComposition = 'family-group' | 'female-with-young' | 'group' | 'male' | 'pair' | 'single' | 'unknown'
export type SightingBehaviour = 'calling' | 'drinking' | 'feeding' | 'hunting' | 'other' | 'playing' | 'resting' | 'walking'

export type SightingPhoto = {
  readonly blob: Blob
  readonly id: string
  readonly name: string
  readonly type: string
}

export type Sighting = {
  readonly animalId: string
  readonly behaviour: SightingBehaviour
  readonly composition: SightingComposition
  readonly count: number
  readonly createdAt: string
  readonly date: string
  readonly id: string
  readonly location: string
  readonly notes: string
  readonly parkId: 'kruger'
  readonly photos: readonly SightingPhoto[]
  readonly syncStatus: 'local'
  readonly time: string
  readonly updatedAt: string
}

export type CreateSightingInput = Omit<Sighting, 'createdAt' | 'id' | 'syncStatus' | 'updatedAt'>
export type UpdateSightingInput = Omit<Sighting, 'createdAt' | 'syncStatus' | 'updatedAt'>
