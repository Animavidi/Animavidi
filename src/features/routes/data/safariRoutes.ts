import type { SafariRoute } from '../../content/model/content'

export const safariRoutes: readonly SafariRoute[] = [
  {
    kind: 'route', id: 'sabie-river-road', title: 'Along the Sabie River', region: 'south',
    start: 'Skukuza', end: 'Lower Sabie', roads: ['H4-1'], stops: ['Nkuhlu picnic site'],
    description: 'Follow the signed H4-1 between Skukuza and Lower Sabie. Nkuhlu provides a designated picnic stop on the river. Allow time for wildlife stops and return within gate hours.',
    sourceUrl: 'https://www.sanparks.org/parks/kruger/what-to-do/facilities/picnic-sites', sourcePages: 'Park Map brochure, pages 7–8', reviewedAt: '2026-10-28', published: true,
  },
  {
    kind: 'route', id: 'orpen-to-satara', title: 'Orpen to Satara', region: 'central',
    start: 'Orpen Gate', end: 'Satara', roads: ['H7'], stops: [],
    description: 'Use the signed H7 connection between Orpen Gate and Satara. SANParks reported flood repairs and restrictions in 2026; confirm the current conditions with reception before setting off.',
    sourceUrl: 'https://www.sanparks.org/news/update-on-road-infrastructure-in-kruger-national-park-following-january-2026-floods', sourcePages: 'Park Map brochure, pages 9–10', reviewedAt: '2026-10-28', published: true,
  },
  {
    kind: 'route', id: 'skukuza-tshokwane-lower-sabie', title: 'Via Tshokwane', region: 'south',
    start: 'Skukuza', end: 'Lower Sabie', roads: ['H1-2', 'H10'], stops: ['Tshokwane picnic site'],
    description: 'Travel from Skukuza towards Tshokwane on H1-2 and continue towards Lower Sabie on H10. This is a longer alternative to the direct river road. Check road conditions and your available daylight before choosing it.',
    sourceUrl: 'https://www.sanparks.org/news/update-on-road-and-tourism-camp-access-following-sever-weather-conditions-in-kruger-national-park', sourcePages: 'Park Map brochure, pages 7–10', reviewedAt: '2026-10-28', published: true,
  },
]
