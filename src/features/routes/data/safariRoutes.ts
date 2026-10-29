import type { SafariRoute } from '../../content/model/content'

const picnicSites = 'https://www.sanparks.org/parks/kruger/what-to-do/facilities/picnic-sites'
const parkInformation = 'https://www.sanparks.org/parks/kruger'
const reviewedAt = '2026-10-29'
// Printed page numbers; PDF page index is one higher. Connection evidence is
// recorded in docs/completion/route-connectivity.json, not a GPS road network.

export const safariRoutes: readonly SafariRoute[] = [
  {
    kind: 'route', id: 'sabie-river-road', title: 'Along the Sabie River', region: 'south',
    start: 'Skukuza', end: 'Lower Sabie', roads: ['H4-1'], stops: ['Nkuhlu picnic site'],
    description: 'From the signed Skukuza camp approach, join H4-1 eastwards. Continue past the Nkuhlu picnic-site access to the Lower Sabie approach and follow camp signs. Nkuhlu is a designated stop; waterholes and roadside animal sightings are not permission to leave your vehicle.',
    sourceUrl: picnicSites, sourcePages: 'Park Map, printed pp. 7–8 (PDF pp. 8–9)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'orpen-to-satara', title: 'Orpen to Satara', region: 'central',
    start: 'Orpen Gate', end: 'Satara', roads: ['H7', 'H1-4'], stops: [],
    description: 'Travel east on H7 from Orpen. At its eastern junction, turn north onto the short H1-4 approach to Satara and follow the signed camp entrance. H7 does not continue straight into the camp. Confirm current gate access and road conditions before departure.',
    sourceUrl: parkInformation, sourcePages: 'Park Map, printed pp. 9–10 (PDF pp. 10–11)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'skukuza-tshokwane-lower-sabie', title: 'Via Tshokwane', region: 'south',
    start: 'Skukuza', end: 'Lower Sabie', roads: ['H1-2', 'H1-3', 'H10'], stops: ['Tshokwane picnic site'],
    description: 'Join H1-2 northwards from the Skukuza approach. At the H10 junction, continue north on H1-3 for the Tshokwane picnic stop. Afterwards retrace H1-3 south to that junction, then take H10 towards Lower Sabie and follow the signed camp approach. Tshokwane is not directly on H10. This longer alternative includes the short out-and-back to the picnic site.',
    sourceUrl: picnicSites, sourcePages: 'Park Map, printed pp. 8 and 10 (PDF pp. 9 and 11)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'lower-sabie-crocodile-bridge', title: 'Lower Sabie to Crocodile Bridge', region: 'south',
    start: 'Lower Sabie', end: 'Crocodile Bridge', roads: ['H10', 'H4-2'], stops: [],
    description: 'Leave Lower Sabie using the signed approach to H10 and cross the Sabie River on the road bridge. Join H4-2 southwards and remain on it towards Crocodile Bridge, then follow the camp entrance signs. Do not substitute an unsigned river crossing or assume that a mapped bridge is currently open.',
    sourceUrl: parkInformation, sourcePages: 'Park Map, printed p. 8 (PDF p. 9)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'satara-nwanetsi', title: 'Satara to N’wanetsi', region: 'central',
    start: 'Satara', end: 'N’wanetsi picnic site', roads: ['H1-4', 'H1-3', 'H6'], stops: ['N’wanetsi picnic site'],
    description: 'Leave Satara on its signed approach, follow H1-4 south past the H7 junction and continue on H1-3. Turn east onto H6. At the eastern end, follow the designated N’wanetsi picnic-site access. Return over the same roads unless reception confirms another public route is open.',
    sourceUrl: picnicSites, sourcePages: 'Park Map, printed p. 10 (PDF p. 11)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'olifants-letaba', title: 'Olifants to Letaba', region: 'central',
    start: 'Olifants', end: 'Letaba', roads: ['H8', 'H1-5', 'H1-6'], stops: [],
    description: 'Follow the Olifants camp approach onto H8 westwards. At the main-road junction, turn north onto H1-5. Continue towards Letaba, where the main road becomes H1-6, and take the signed camp access. This guide uses the main-road connection, rather than assuming that gravel alternatives or river viewpoints are open.',
    sourceUrl: parkInformation, sourcePages: 'Park Map, printed p. 12 (PDF p. 13)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'letaba-mopani', title: 'Letaba to Mopani', region: 'north',
    start: 'Letaba', end: 'Mopani', roads: ['H1-6'], stops: [],
    description: 'Join H1-6 northwards from the signed Letaba camp access. Cross the Letaba River on the main-road bridge and continue on H1-6 past the H15 junction. Take the signed Mopani camp turn-off. The H15 turn leads towards Giriyondo and is not the Mopani camp approach.',
    sourceUrl: parkInformation, sourcePages: 'Park Map, printed pp. 12–14 (PDF pp. 13–15)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'mopani-shingwedzi', title: 'Mopani to Shingwedzi', region: 'north',
    start: 'Mopani', end: 'Shingwedzi', roads: ['H1-6'], stops: [],
    description: 'Return from Mopani camp to H1-6 and follow it northwards, keeping to the main road at the S143 and S144 junctions. At Shingwedzi, follow the signed camp access. Side loops shown on the brochure are separate choices and are not included in this main-road guide.',
    sourceUrl: parkInformation, sourcePages: 'Park Map, printed pp. 13–14 (PDF pp. 14–15)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'shingwedzi-babalala', title: 'Shingwedzi to Babalala', region: 'north',
    start: 'Shingwedzi', end: 'Babalala picnic site', roads: ['H1-6', 'H1-7'], stops: ['Babalala picnic site'],
    description: 'Follow the Shingwedzi camp access back to the main road. Continue north from H1-6 onto H1-7 and remain on the tarred main road past the S53 and S56 junctions. Use the signed Babalala picnic-site access near the northern S56 junction. Return over the same main-road connection if continuing farther north is not part of your plan.',
    sourceUrl: picnicSites, sourcePages: 'Park Map, printed pp. 14–16 (PDF pp. 15–17)', reviewedAt, published: true,
  },
  {
    kind: 'route', id: 'punda-maria-pafuri-gates', title: 'Punda Maria Gate to Pafuri Gate', region: 'north',
    start: 'Punda Maria Gate', end: 'Pafuri Gate', roads: ['H13-1', 'H1-8', 'H1-9'], stops: [],
    description: 'Follow H13-1 eastwards from Punda Maria Gate to the main-road junction. Turn north onto H1-8 towards Pafuri. Beyond the Luvuvhu crossing, turn west onto H1-9 for Pafuri Gate. Pafuri Gate is the western park entrance; do not follow the eastern road towards Pafuri Border Post by mistake. Punda Maria camp and Pafuri picnic-site detours are not included.',
    sourceUrl: parkInformation, sourcePages: 'Park Map, printed pp. 15–16 (PDF pp. 16–17)', reviewedAt, published: true,
  },
]
