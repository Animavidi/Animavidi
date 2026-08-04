import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import { KrugerVectorMap } from '@/features/map/components/KrugerVectorMap'
import { MapDisclaimer } from '@/features/map/components/MapDisclaimer'
import { krugerPrototypePois } from '@/features/map/data/krugerMapConfig'
import type { MapFilter, PrototypePoi, UnplacedSighting } from '@/features/map/model/parkMap'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import { findMammal } from '@/features/mammals/model/mammals'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'
import { AddSightingLauncher } from '@/features/sightings/components/AddSightingLauncher/AddSightingLauncher'
import type { Sighting } from '@/features/sightings/model/sighting'

import styles from './ParkMapPage.module.css'

export function ParkMapPage() {
  const [sightings, setSightings] = useState<readonly Sighting[]>([])
  const [filter, setFilter] = useState<MapFilter>('all')
  const [selected, setSelected] = useState<PrototypePoi>()
  const [filterOpen, setFilterOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    let current = true
    void sightingRepository.getAll()
      .then((items) => { if (current) setSightings(items) })
      .catch(() => { if (current) setStorageError('Saved sightings could not be loaded. Camps and gates remain available.') })
    return () => { current = false }
  }, [])

  const unplacedSightings = useMemo<readonly UnplacedSighting[]>(() => sightings.map((sighting) => ({
    sighting,
    speciesName: findMammal(sighting.animalId)?.commonName ?? 'Unknown species',
  })), [sightings])

  return <main className={`${styles.page} ${fullscreen ? styles.fullscreen : ''}`}>
    <header className={styles.header}>
      <Link aria-label="Back to Kruger Home" className={styles.back} to="/parks/kruger"><span /></Link>
      <div><p>Kruger National Park</p><h1>Park Map</h1></div>
      <span className={styles.internalBadge}>Internal prototype</span>
    </header>
    <section className={styles.mapShell} aria-label="Interactive Kruger prototype map">
      <KrugerVectorMap filter={filter} filterOpen={filterOpen} fullscreen={fullscreen} onFilterChange={setFilter} onFilterToggle={() => setFilterOpen((value) => !value)} onFullscreenToggle={() => setFullscreen((value) => !value)} onSelect={setSelected} pois={krugerPrototypePois} selected={selected} sightings={unplacedSightings} />
    </section>
    {!fullscreen ? <footer className={styles.footer}><MapDisclaimer />{storageError ? <p className={styles.error} role="alert">{storageError}</p> : null}<SponsorFooter tone="light" /></footer> : null}
    <AddSightingLauncher disabled={fullscreen || Boolean(storageError)} />
    <MammalsBottomNav active="map" fixed />
  </main>
}
