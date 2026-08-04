import type { ExplorerRank, PassportProfile } from '@/features/passport/model/passport'

export const demoPassportProfile: PassportProfile = { name: 'Animavidi Explorer', number: 'AV–KR–0001', explorerSince: '2026', primaryPark: 'Kruger National Park', country: 'South Africa' }
export const onboardingCompletionKey = 'animavidi:onboarding-complete'

export const explorerRanks: readonly ExplorerRank[] = [
  { id: 'new', title: 'New Explorer', uniqueSpecies: 0, totalSightings: 0, parksVisited: 0 },
  { id: 'observer', title: 'Wildlife Observer', uniqueSpecies: 1, totalSightings: 1, parksVisited: 1 },
  { id: 'tracker', title: 'Safari Tracker', uniqueSpecies: 3, totalSightings: 5, parksVisited: 1 },
  { id: 'seasoned', title: 'Seasoned Explorer', uniqueSpecies: 5, totalSightings: 10, parksVisited: 1 },
  { id: 'master', title: 'Master Naturalist', uniqueSpecies: 12, totalSightings: 25, parksVisited: 2 },
]

export const achievementDefinitions = [
  { id: 'first-sighting', title: 'First Sighting', requirement: 'Record your first sighting', kind: 'sightings', target: 1 },
  { id: 'first-photo', title: 'First Photograph', requirement: 'Add a photograph', kind: 'photos', target: 1 },
  { id: 'five-sightings', title: 'Five Sightings', requirement: 'Record five sightings', kind: 'sightings', target: 5 },
  { id: 'ten-sightings', title: 'Ten Sightings', requirement: 'Record ten sightings', kind: 'sightings', target: 10 },
  { id: 'three-species', title: 'Three Species', requirement: 'Discover three species', kind: 'species', target: 3 },
  { id: 'five-species', title: 'Five Species', requirement: 'Discover five species', kind: 'species', target: 5 },
  { id: 'first-big-five', title: 'First Big Five', requirement: 'Discover a Big Five species', kind: 'big-five', target: 1 },
  { id: 'big-five-complete', title: 'Big Five Complete', requirement: 'Discover all five', kind: 'big-five', target: 5 },
  { id: 'kruger-explorer', title: 'Kruger Explorer', requirement: 'Begin a Kruger journey', kind: 'parks', target: 1 },
] as const
