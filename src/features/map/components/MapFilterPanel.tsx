import { mapFilterLabels } from '@/features/map/model/parkMap'
import type { MapFilter } from '@/features/map/model/parkMap'

import styles from './KrugerVectorMap.module.css'

const filters: readonly MapFilter[] = ['all', 'camp', 'gate', 'sighting']

type MapFilterPanelProps = {
  active: MapFilter
  onChange: (filter: MapFilter) => void
  onClose: () => void
}

export function MapFilterPanel({ active, onChange, onClose }: MapFilterPanelProps) {
  return <section aria-label="Map filters and legend" className={styles.filterPanel}>
    <header><div><p>Map layers</p><h2>What would you like to see?</h2></div><button aria-label="Close filters" onClick={onClose} type="button">×</button></header>
    <div className={styles.filterGrid}>{filters.map((filter) => <button aria-pressed={active === filter} key={filter} onClick={() => onChange(filter)} type="button"><i className={styles[`legend-${filter}`]} />{mapFilterLabels[filter]}</button>)}</div>
    <p className={styles.filterNote}>Only camps and gates confidently aligned to labels in the supplied prototype are shown.</p>
  </section>
}
