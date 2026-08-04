import type { ReactNode } from 'react'

import styles from './KrugerVectorMap.module.css'

type MapOverlayLayerProps = {
  children?: ReactNode
  label: string
  selected?: boolean
}

export function MapOverlayLayer({ children, label, selected = false }: MapOverlayLayerProps) {
  return <div aria-label={label} className={`${styles.overlay} ${selected ? styles.selectedOverlay : ''}`}>{children}</div>
}
