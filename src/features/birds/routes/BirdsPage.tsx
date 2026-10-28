import { AddSightingLauncher } from '@/features/sightings/components/AddSightingLauncher/AddSightingLauncher'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { birds } from '@/features/mammals/model/mammals'
import { MammalCard } from '@/features/mammals/components/MammalCard/MammalCard'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import styles from '@/features/mammals/routes/MammalsPage.module.css'
import birdStyles from './BirdsPage.module.css'

export function BirdsPage() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const query = params.get('q') ?? ''
  const normalized = query.trim().toLocaleLowerCase()
  const visible = birds.filter((bird) => [bird.commonName, bird.scientificName].join(' ').toLocaleLowerCase().includes(normalized))
  return <main className={styles.page}>
    <header className={`${styles.hero} ${birdStyles.hero}`}><div className={styles.topbar}><Link className={styles.back} aria-label="Back to Kruger" to="/parks/kruger"><span aria-hidden="true" /></Link></div><div className={`${styles.heroCopy} ${birdStyles.copy}`}><p className={styles.parkName}>Kruger National Park</p><h1>Birds</h1><p>Explore all {birds.length} birds in the SANParks checklist.</p></div></header>
    <section className={styles.content}><label className={styles.search}><span className="srOnly">Search birds</span><span aria-hidden="true" className={styles.searchIcon} /><input className={birdStyles.searchInput} type="search" value={query} placeholder="Search common or scientific name…" onChange={(event) => { const next = new URLSearchParams(params); if (event.target.value) next.set('q', event.target.value); else next.delete('q'); void setParams(next, { replace: true }) }} /><button type="button" className={styles.filterIcon} aria-label="Clear bird search" disabled={!query} onClick={() => { const next = new URLSearchParams(params); next.delete('q'); void setParams(next, { replace: true }) }}>×</button></label>
    <section className={styles.listSection}><h2 aria-live="polite">Birds ({visible.length})</h2><div className={styles.list}>{visible.map((bird) => <MammalCard key={bird.id} mammal={bird} onSelect={() => undefined} returnTo={`${location.pathname}${location.search}`} />)}</div>{!visible.length ? <p className={styles.empty}>No birds match your search.</p> : null}</section>
    <p>Checklist: <a href="https://www.sanparks.org/parks/kruger/explore/fauna-flora/birds/checklist" target="_blank" rel="noreferrer">SANParks</a>, checked 28 October 2026. Names follow this source; taxonomy may differ between field guides.</p><SponsorFooter tone="light" /></section><AddSightingLauncher /><MammalsBottomNav active="birds" />
  </main>
}
