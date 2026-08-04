import { Link } from 'react-router-dom'

import type { PrototypePoi } from '@/features/map/model/parkMap'

import styles from './KrugerVectorMap.module.css'

type MapBottomSheetProps = {
  marker: PrototypePoi
  onClose: () => void
}

export function MapBottomSheet({ marker, onClose }: MapBottomSheetProps) {
  return <aside aria-label="Selected prototype location" aria-live="polite" className={styles.sheet}>
    <button aria-label="Close location details" className={styles.close} onClick={onClose} type="button">×</button>
    <p className={styles.eyebrow}>{marker.category === 'camp' ? 'Main camp' : 'Entry gate'}</p>
    <h2>{marker.name}</h2>
    <span className={styles.prototypeBadge}>Prototype position</span>
    <p>{marker.description}</p>
    <div className={styles.sheetActions}>{marker.route ? <Link to={marker.route}>{marker.category === 'camp' ? 'View park information' : 'View gate times'}</Link> : null}<button onClick={onClose} type="button">Close</button></div>
  </aside>
}
