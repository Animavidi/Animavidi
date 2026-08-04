import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import prototypeBackgroundUrl from '@/assets/maps/kruger/kruger-prototype-background.svg'
import type { MapFilter, PrototypePoi, UnplacedSighting } from '@/features/map/model/parkMap'

import { MapBottomSheet } from './MapBottomSheet'
import { MapControls } from './MapControls'
import { MapFilterPanel } from './MapFilterPanel'
import { MapMarker } from './MapMarker'
import { MapOverlayLayer } from './MapOverlayLayer'
import { MapViewport } from './MapViewport'
import type { MapViewportHandle } from './MapViewport'
import styles from './KrugerVectorMap.module.css'

type KrugerVectorMapProps = {
  filter: MapFilter
  filterOpen: boolean
  fullscreen: boolean
  onFilterChange: (filter: MapFilter) => void
  onFilterToggle: () => void
  onFullscreenToggle: () => void
  onSelect: (marker: PrototypePoi | undefined) => void
  pois: readonly PrototypePoi[]
  selected?: PrototypePoi
  sightings: readonly UnplacedSighting[]
}

export function KrugerVectorMap({ filter, filterOpen, fullscreen, onFilterChange, onFilterToggle, onFullscreenToggle, onSelect, pois, selected, sightings }: KrugerVectorMapProps) {
  const [loadState, setLoadState] = useState<'error' | 'loaded' | 'loading'>('loading')
  const [imageKey, setImageKey] = useState(0)
  const [viewport, setViewport] = useState<MapViewportHandle | null>(null)
  const visiblePois = useMemo(() => filter === 'all' ? pois : pois.filter((poi) => poi.category === filter), [filter, pois])
  const showSightings = filter === 'all' || filter === 'sighting'

  if (loadState === 'error') {
    return <div className={styles.errorState} role="alert">
      <span aria-hidden="true" className={styles.errorMark}>!</span>
      <h2>The prototype map could not be opened</h2>
      <p>Your navigation and saved safari journal are still available.</p>
      <div><button onClick={() => { setLoadState('loading'); setImageKey((value) => value + 1) }} type="button">Retry map</button><Link to="/parks/kruger">Return to Kruger Home</Link></div>
    </div>
  }

  return <>
    <MapViewport handleRef={setViewport}>
      <img alt="" className={styles.background} draggable={false} key={imageKey} onError={() => setLoadState('error')} onLoad={() => setLoadState('loaded')} src={prototypeBackgroundUrl} />
      <MapOverlayLayer label="Prototype camps and gates">{visiblePois.map((poi) => <MapMarker key={poi.id} marker={poi} onSelect={onSelect} />)}</MapOverlayLayer>
      <MapOverlayLayer label="Placed My Sightings locations" />
      {selected ? <MapOverlayLayer label="Selected location highlight" selected><MapMarker marker={selected} onSelect={onSelect} selected /></MapOverlayLayer> : null}
    </MapViewport>
    {loadState === 'loading' ? <div className={styles.loading} role="status"><span /><strong>Opening the Kruger map</strong><small>Preparing the detailed vector artwork…</small></div> : null}
    <MapControls filterOpen={filterOpen} fullscreen={fullscreen} onFilterToggle={onFilterToggle} onFullscreenToggle={onFullscreenToggle} viewport={viewport} />
    {filterOpen ? <MapFilterPanel active={filter} onChange={(next) => { onFilterChange(next); onSelect(undefined) }} onClose={onFilterToggle} /> : null}
    {showSightings ? <section className={styles.unplacedTray} aria-label="Unplaced sightings">
      <div><p>My Sightings</p><h2>Unplaced sightings</h2></div>
      {sightings.length ? <div className={styles.sightingScroller}>{sightings.map(({ sighting, speciesName }) => <Link key={sighting.id} to={`/parks/kruger/sightings/${sighting.id}`}><strong>{speciesName}</strong><span>{sighting.date} · {sighting.location}</span></Link>)}</div> : <p className={styles.emptySightings}>No saved sightings yet. Sightings without verified coordinates will appear here, never at a made-up map position.</p>}
    </section> : null}
    {selected ? <MapBottomSheet marker={selected} onClose={() => onSelect(undefined)} /> : null}
  </>
}
