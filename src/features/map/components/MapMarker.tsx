import type { PrototypePoi } from '@/features/map/model/parkMap'
import { krugerPrototypeViewBox } from '@/features/map/model/parkMap'

import styles from './KrugerVectorMap.module.css'

type MapMarkerProps = {
  marker: PrototypePoi
  onSelect: (marker: PrototypePoi) => void
  selected?: boolean
}

export function MapMarker({ marker, onSelect, selected = false }: MapMarkerProps) {
  return <button
    aria-label={`${marker.name}, ${marker.category}, prototype location`}
    aria-pressed={selected}
    className={`${styles.marker} ${styles[marker.category]} ${selected ? styles.markerSelected : ''}`}
    onClick={(event) => { event.stopPropagation(); onSelect(marker) }}
    style={{ left: `${marker.mapX / krugerPrototypeViewBox.width * 100}%`, top: `${marker.mapY / krugerPrototypeViewBox.height * 100}%` }}
    title={marker.name}
    type="button"
  ><span aria-hidden="true">{marker.category === 'camp' ? 'C' : 'G'}</span></button>
}
