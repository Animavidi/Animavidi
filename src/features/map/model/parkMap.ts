import type { Sighting } from '@/features/sightings/model/sighting'

export const krugerPrototypeViewBox = {
  height: 3586.14,
  width: 1777.31,
  x: 0,
  y: 0,
} as const

export type PrototypePoiCategory = 'camp' | 'gate'
export type MapFilter = 'all' | PrototypePoiCategory | 'sighting'

export type PrototypeMapPosition = {
  readonly mapX: number
  readonly mapY: number
}

export type PrototypePoi = PrototypeMapPosition & {
  readonly category: PrototypePoiCategory
  readonly description: string
  readonly id: string
  readonly name: string
  readonly prototypeStatus: 'visual-reference-only'
  readonly route?: string
}

export type MapViewportState = {
  readonly scale: number
  readonly x: number
  readonly y: number
}

export type FutureSightingCoordinates = {
  readonly accuracy?: number
  readonly coordinateSource: 'device-gps' | 'manual' | 'verified-import'
  readonly latitude: number
  readonly longitude: number
  readonly mapPosition?: PrototypeMapPosition
  readonly privacyLevel: 'exact' | 'approximate' | 'private'
}

export type UnplacedSighting = {
  readonly sighting: Sighting
  readonly speciesName: string
}

export const mapFilterLabels: Record<MapFilter, string> = {
  all: 'All',
  camp: 'Camps',
  gate: 'Gates',
  sighting: 'My Sightings',
}

