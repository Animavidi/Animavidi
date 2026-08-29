export type MammalCategory =
  | 'antelopes'
  | 'big-five'
  | 'predators'
  | 'primates'
  | 'small-mammals'

export type Mammal = {
  readonly aliases: readonly string[]
  readonly categories: readonly MammalCategory[]
  readonly commonName: string
  readonly id: string
  readonly image: string
  readonly imageAlt: string
  readonly imageFallback: string
  readonly officialCommonName: string
  readonly overviewSection: 'main' | 'small-mammals'
  readonly profile: MammalProfile
  readonly scientificName: string
  readonly smallMammalGroup?: 'bats' | 'rodents' | 'shrews-moles'
  readonly sortName: string
}

export type MammalProfile = {
  readonly behaviour: string
  readonly conservationStatus: string
  readonly demoProgress: {
    readonly seen: boolean
    readonly sightingsCount: number
  }
  readonly diet: string
  readonly groupStructure: string
  readonly habitat: string
  readonly identificationFeatures: readonly string[]
  readonly interestingFacts: readonly string[]
  readonly introduction: string
}

export type MammalFilter = MammalCategory | 'all'
