import type { MapViewportHandle } from './MapViewport'
import styles from './KrugerVectorMap.module.css'

type MapControlsProps = {
  filterOpen: boolean
  fullscreen: boolean
  viewport: MapViewportHandle | null
  onFilterToggle: () => void
  onFullscreenToggle: () => void
}

export function MapControls({ filterOpen, fullscreen, viewport, onFilterToggle, onFullscreenToggle }: MapControlsProps) {
  return <div aria-label="Map controls" className={styles.controls}>
    <button aria-label="Zoom in" onClick={() => viewport?.zoomIn()} type="button">+</button>
    <button aria-label="Zoom out" onClick={() => viewport?.zoomOut()} type="button">−</button>
    <button onClick={() => viewport?.fit()} type="button">Fit</button>
    <button onClick={() => viewport?.centre()} type="button">Centre</button>
    <button aria-expanded={filterOpen} onClick={onFilterToggle} type="button">Filters</button>
    <button aria-pressed={fullscreen} onClick={onFullscreenToggle} type="button">{fullscreen ? 'Exit' : 'Full'}</button>
  </div>
}
