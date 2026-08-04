import type { PrototypePoi } from '@/features/map/model/parkMap'

/**
 * Positions align visually with named labels in kruger-prototype-background.svg.
 * They are SVG map coordinates, not GPS coordinates, and are unsuitable for navigation.
 */
export const krugerPrototypePois: readonly PrototypePoi[] = [
  { id: 'camp-skukuza', name: 'Skukuza', category: 'camp', mapX: 1225, mapY: 2965, description: 'Main-camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Skukuza#camps' },
  { id: 'camp-lower-sabie', name: 'Lower Sabie', category: 'camp', mapX: 1612, mapY: 3117, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Lower%20Sabie#camps' },
  { id: 'camp-satara', name: 'Satara', category: 'camp', mapX: 1382, mapY: 2315, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Satara#camps' },
  { id: 'camp-olifants', name: 'Olifants', category: 'camp', mapX: 1412, mapY: 1929, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Olifants#camps' },
  { id: 'camp-letaba', name: 'Letaba', category: 'camp', mapX: 1173, mapY: 1744, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Letaba#camps' },
  { id: 'camp-mopani', name: 'Mopani', category: 'camp', mapX: 978, mapY: 1378, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Mopani#camps' },
  { id: 'camp-shingwedzi', name: 'Shingwedzi', category: 'camp', mapX: 1079, mapY: 938, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Shingwedzi#camps' },
  { id: 'camp-punda-maria', name: 'Punda Maria', category: 'camp', mapX: 628, mapY: 474, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Punda%20Maria#camps' },
  { id: 'camp-pretoriuskop', name: 'Pretoriuskop', category: 'camp', mapX: 900, mapY: 3187, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Pretoriuskop#camps' },
  { id: 'camp-berg-en-dal', name: 'Berg-en-Dal', category: 'camp', mapX: 1006, mapY: 3479, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Berg-en-Dal#camps' },
  { id: 'camp-crocodile-bridge', name: 'Crocodile Bridge', category: 'camp', mapX: 1572, mapY: 3383, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Crocodile%20Bridge#camps' },
  { id: 'camp-orpen', name: 'Orpen', category: 'camp', mapX: 980, mapY: 2398, description: 'Camp marker aligned to the supplied prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information?search=Orpen#camps' },
  { id: 'gate-phalaborwa', name: 'Phalaborwa Gate', category: 'gate', mapX: 656, mapY: 1840, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
  { id: 'gate-paul-kruger', name: 'Paul Kruger Gate', category: 'gate', mapX: 1097, mapY: 2949, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
  { id: 'gate-phabeni', name: 'Phabeni Gate', category: 'gate', mapX: 863, mapY: 2997, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
  { id: 'gate-numbi', name: 'Numbi Gate', category: 'gate', mapX: 802, mapY: 3144, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
  { id: 'gate-malelane', name: 'Malelane Gate', category: 'gate', mapX: 1177, mapY: 3474, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
  { id: 'gate-crocodile-bridge', name: 'Crocodile Bridge Gate', category: 'gate', mapX: 1528, mapY: 3415, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
  { id: 'gate-orpen', name: 'Orpen Gate', category: 'gate', mapX: 1027, mapY: 2453, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
  { id: 'gate-punda-maria', name: 'Punda Maria Gate', category: 'gate', mapX: 538, mapY: 555, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
  { id: 'gate-pafuri', name: 'Pafuri Gate', category: 'gate', mapX: 649, mapY: 167, description: 'Gate marker aligned to the named entrance on the prototype artwork.', prototypeStatus: 'visual-reference-only', route: '/parks/kruger/information#gate-times' },
]

