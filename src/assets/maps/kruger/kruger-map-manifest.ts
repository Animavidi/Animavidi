export type KrugerMapLayerStatus = 'available' | 'source-label-only' | 'unresolved'

export type KrugerMapLayerId =
  | 'base'
  | 'boundary'
  | 'roads-tar'
  | 'roads-gravel'
  | 'rivers'
  | 'camps'
  | 'gates'
  | 'hides'
  | 'picnic'
  | 'viewpoints'
  | 'waterholes'
  | 'labels'

export interface KrugerMapLayerManifestEntry {
  readonly id: KrugerMapLayerId
  readonly file: string
  readonly featureCount: number
  readonly status: KrugerMapLayerStatus
  readonly description: string
}

export interface KrugerMapAssetManifest {
  readonly prototypeOnly: true
  readonly publicationRightsConfirmed: false
  readonly sourceFile: string
  readonly prototypeBackgroundFile: string
  readonly prototypeBackgroundViewBox: string
  readonly sourceViewBox: string
  readonly viewBox: string
  readonly layers: readonly KrugerMapLayerManifestEntry[]
}

export const krugerMapManifest = {
  prototypeOnly: true,
  publicationRightsConfirmed: false,
  sourceFile: 'Kruger_Master.svg',
  prototypeBackgroundFile: 'kruger-prototype-background.svg',
  prototypeBackgroundViewBox: '0 0 1777.31 3586.14',
  sourceViewBox: '0 0 2487.6 4146.66',
  viewBox: '1025 275 1025 3500',
  layers: [
    {
      id: 'base',
      file: 'kruger-base.svg',
      featureCount: 13101,
      status: 'available',
      description: 'Cropped vector master without embedded raster decoration.',
    },
    {
      id: 'boundary',
      file: 'kruger-boundary.svg',
      featureCount: 0,
      status: 'unresolved',
      description: 'No semantic boundary group exists in the supplied artwork.',
    },
    {
      id: 'roads-tar',
      file: 'kruger-roads-tar.svg',
      featureCount: 0,
      status: 'unresolved',
      description: 'Tar-road geometry cannot be proven from the flat source structure.',
    },
    {
      id: 'roads-gravel',
      file: 'kruger-roads-gravel.svg',
      featureCount: 0,
      status: 'unresolved',
      description: 'Gravel-road geometry cannot be proven from the flat source structure.',
    },
    {
      id: 'rivers',
      file: 'kruger-rivers.svg',
      featureCount: 0,
      status: 'unresolved',
      description: 'River geometry cannot be proven from colour alone.',
    },
    {
      id: 'camps',
      file: 'kruger-camps.svg',
      featureCount: 8,
      status: 'source-label-only',
      description: 'Only text explicitly containing camp terminology.',
    },
    {
      id: 'gates',
      file: 'kruger-gates.svg',
      featureCount: 19,
      status: 'source-label-only',
      description: 'Only text explicitly containing gate or border-post terminology.',
    },
    {
      id: 'hides',
      file: 'kruger-hides.svg',
      featureCount: 13,
      status: 'source-label-only',
      description: 'Only text explicitly containing hide terminology.',
    },
    {
      id: 'picnic',
      file: 'kruger-picnic.svg',
      featureCount: 1,
      status: 'source-label-only',
      description: 'Only text explicitly containing picnic terminology.',
    },
    {
      id: 'viewpoints',
      file: 'kruger-viewpoints.svg',
      featureCount: 10,
      status: 'source-label-only',
      description: 'Only text explicitly containing lookout or viewpoint terminology.',
    },
    {
      id: 'waterholes',
      file: 'kruger-waterholes.svg',
      featureCount: 35,
      status: 'source-label-only',
      description: 'Only text explicitly naming dams, pans, lakes or waterholes.',
    },
    {
      id: 'labels',
      file: 'kruger-labels.svg',
      featureCount: 1250,
      status: 'available',
      description: 'All geographically positioned text inside the prototype crop.',
    },
  ],
} as const satisfies KrugerMapAssetManifest
