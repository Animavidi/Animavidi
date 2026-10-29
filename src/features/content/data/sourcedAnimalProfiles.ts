import type { AnimalEditorial } from '../model/content'

export type SourcedAnimalProfile = {
  content: AnimalEditorial
  checkedAt: string
  sourceTitle: string
  sourceAuthor: string
  sections: readonly string[]
  pending: readonly string[]
}

// Independently written summaries of the cited ADW accounts. Conservation
// assessment and current taxonomy are intentionally pending, not inferred.
export const sourcedAnimalProfiles: Readonly<Record<string, SourcedAnimalProfile>> = {
  aardvark: {
    content: {
      kind: 'animal', id: 'aardvark',
      introduction: 'A burrowing African mammal that searches for ants and termites after dark.',
      identificationFeatures: ['Elongated snout and large ears', 'Heavy body, strong digging claws and tapering tail'],
      habitat: 'Grassland and savanna with plentiful ants or termites and soil suitable for digging.',
      behaviour: 'Usually shelters underground by day and forages at night, locating food with a strong sense of smell.',
      diet: 'Ants and termites, collected with a long sticky tongue.',
      groupStructure: 'Generally solitary; a female may be accompanied by her young.',
      conservationStatus: '',
      interestingFacts: ['Its cheek teeth contain many small dentine tubes and lack enamel.'],
      sourceUrl: 'https://animaldiversity.org/accounts/Orycteropus_afer/',
    },
    checkedAt: '2026-10-29', sourceTitle: 'Animal Diversity Web: Orycteropus afer', sourceAuthor: 'Elizabeth Ratzloff',
    sections: ['Geographic Range', 'Habitat', 'Physical Description', 'Behavior', 'Food Habits', 'Reproduction'],
    pending: ['Current conservation assessment', 'Independent current taxonomy reconciliation'],
  },
  aardwolf: {
    content: {
      kind: 'animal', id: 'aardwolf',
      introduction: 'A small member of the hyena family specialised for feeding on termites.',
      identificationFeatures: ['Dark vertical stripes on a pale coat', 'Large pointed ears, sloping back and a long mane'],
      habitat: 'Dry open grassland and savanna; rests in underground dens.',
      behaviour: 'Mostly active at night, with some late-afternoon winter foraging. Raises its mane when threatened.',
      diet: 'Mainly termites, licked from the ground with a sticky tongue.',
      groupStructure: 'Usually forages alone; partners may share a territory and care for cubs.',
      conservationStatus: '',
      interestingFacts: ['It may occupy a den originally dug by another animal.'],
      sourceUrl: 'https://animaldiversity.org/accounts/Proteles_cristata/',
    },
    checkedAt: '2026-10-29', sourceTitle: 'Animal Diversity Web: Proteles cristata', sourceAuthor: 'Meghan Stump',
    sections: ['Habitat', 'Physical Description', 'Behavior', 'Food Habits', 'Reproduction'],
    pending: ['Current conservation assessment', 'Proteles cristata / cristatus nomenclature reconciliation'],
  },
  'banded-mongoose': {
    content: {
      kind: 'animal', id: 'banded-mongoose',
      introduction: 'A social mongoose often recognised by the dark bands across its back.',
      identificationFeatures: ['Repeated dark bands across the middle and rear of the back', 'Pointed muzzle and dark feet and tail tip'],
      habitat: 'Grassland, woodland, riverine habitats and rocky areas.',
      behaviour: 'Active by day. Group members travel together while individuals scratch and dig for food.',
      diet: 'Mostly insects and other invertebrates, supplemented by fruit, eggs and small vertebrates.',
      groupStructure: 'Lives in packs; adults share care and protection of young.',
      conservationStatus: '',
      interestingFacts: ['Hard food items such as eggs may be thrown against a solid surface to break them.'],
      sourceUrl: 'https://animaldiversity.org/accounts/Mungos_mungo/',
    },
    checkedAt: '2026-10-29', sourceTitle: 'Animal Diversity Web: Mungos mungo', sourceAuthor: 'Regina Ladd',
    sections: ['Habitat', 'Physical Description', 'Behavior', 'Food Habits', 'Reproduction'],
    pending: ['Current conservation assessment', 'Independent current taxonomy reconciliation'],
  },
  'black-backed-jackal': {
    content: {
      kind: 'animal', id: 'black-backed-jackal',
      introduction: 'An adaptable African canid with a conspicuous dark saddle over reddish flanks.',
      identificationFeatures: ['Black and silver saddle from neck towards the tail', 'Pointed muzzle and tall triangular ears'],
      habitat: 'Open habitats, including grassland and dry scrub; generally avoids dense forest.',
      behaviour: 'Forages during daylight and darkness, hunting and scavenging opportunistically.',
      diet: 'Small mammals, insects, carrion and other animal foods, with some fruit and plant material.',
      groupStructure: 'Long-term pairs and their young form the usual family unit; both parents help rear pups.',
      conservationStatus: '',
      interestingFacts: ['A vacated aardvark burrow may provide a den for its young.'],
      sourceUrl: 'https://animaldiversity.org/accounts/Canis_mesomelas/',
    },
    checkedAt: '2026-10-29', sourceTitle: 'Animal Diversity Web: Canis mesomelas', sourceAuthor: 'Benjamin Fishman',
    sections: ['Habitat', 'Physical Description', 'Behavior', 'Food Habits', 'Reproduction'],
    pending: ['Current conservation assessment', 'Canis / Lupulella genus reconciliation'],
  },
}
