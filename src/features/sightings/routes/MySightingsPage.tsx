import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import { findMammal, mammals } from '@/features/mammals/model/mammals'
import { SightingImage } from '@/features/sightings/components/SightingImage/SightingImage'
import { AddSightingLauncher } from '@/features/sightings/components/AddSightingLauncher/AddSightingLauncher'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'
import type { Sighting, SightingBehaviour } from '@/features/sightings/model/sighting'

import styles from './SightingsPages.module.css'

type SortOrder = 'newest' | 'oldest' | 'species'

export function MySightingsPage() {
  const [searchParams] = useSearchParams()
  const [sightings, setSightings] = useState<readonly Sighting[]>([])
  const [total, setTotal] = useState(0)
  const [uniqueSpecies, setUniqueSpecies] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [bigFiveOnly, setBigFiveOnly] = useState(false)
  const [species, setSpecies] = useState('all')
  const [date, setDate] = useState('')
  const [behaviour, setBehaviour] = useState<'all' | SightingBehaviour>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  useEffect(() => {
    let isCurrent = true
    void Promise.all([sightingRepository.getAll(), sightingRepository.countAll(), sightingRepository.countUniqueSpecies()])
      .then(([records, count, speciesCount]) => {
        if (!isCurrent) return
        setSightings(records); setTotal(count); setUniqueSpecies(speciesCount); setIsLoading(false)
      })
      .catch(() => { if (isCurrent) { setError('Your local sightings could not be opened.'); setIsLoading(false) } })
    return () => { isCurrent = false }
  }, [])

  const visibleSightings = useMemo(() => sightings
    .filter((sighting) => !bigFiveOnly || findMammal(sighting.animalId)?.categories.includes('big-five'))
    .filter((sighting) => species === 'all' || sighting.animalId === species)
    .filter((sighting) => !date || sighting.date === date)
    .filter((sighting) => behaviour === 'all' || sighting.behaviour === behaviour)
    .slice()
    .sort((left, right) => {
      if (sortOrder === 'species') return (findMammal(left.animalId)?.commonName ?? '').localeCompare(findMammal(right.animalId)?.commonName ?? '')
      const difference = `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`)
      return sortOrder === 'oldest' ? difference : -difference
    }), [behaviour, bigFiveOnly, date, sightings, sortOrder, species])

  const bigFiveProgress = new Set(sightings.filter((sighting) => findMammal(sighting.animalId)?.categories.includes('big-five')).map((sighting) => sighting.animalId.includes('rhinoceros') ? 'rhinoceros' : sighting.animalId)).size
  const mostRecent = sightings.slice().sort((a, b) => b.date.localeCompare(a.date))[0]?.date

  return (
    <main className={styles.page}>
      <header className={styles.header}><Link aria-label="Back to Kruger Home" className={styles.back} to="/parks/kruger"><span /></Link><div><h1>My Sightings</h1><p>Your personal Kruger safari journal</p></div></header>
      <section className={styles.content}>
        {searchParams.get('created') ? <p className={styles.confirmation} role="status">Sighting saved to your journal.</p> : null}
        {searchParams.get('updated') ? <p className={styles.confirmation} role="status">Sighting updated.</p> : null}
        {searchParams.get('deleted') ? <p className={styles.confirmation} role="status">Sighting deleted.</p> : null}

        <section aria-label="Journal summary" className={styles.summary}>
          <div><strong>{total}</strong><span>Total sightings</span></div><div><strong>{uniqueSpecies}</strong><span>Unique species</span></div>
          <div><strong>{bigFiveProgress}/5</strong><span>Big Five</span></div><div><strong>{mostRecent ? new Date(`${mostRecent}T12:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '—'}</strong><span>Most recent</span></div>
        </section>

        <section aria-labelledby="filters-title" className={styles.filters}>
          <div className={styles.sectionTitle}><h2 id="filters-title">Explore your journal</h2><button onClick={() => { setBigFiveOnly(false); setSpecies('all'); setDate(''); setBehaviour('all') }} type="button">Clear</button></div>
          <div className={styles.chips}><button aria-pressed={!bigFiveOnly} onClick={() => setBigFiveOnly(false)} type="button">All sightings</button><button aria-pressed={bigFiveOnly} onClick={() => setBigFiveOnly(true)} type="button">Big Five</button></div>
          <div className={styles.filterGrid}>
            <label><span>Species</span><select onChange={(event) => setSpecies(event.target.value)} value={species}><option value="all">All species</option>{mammals.map((mammal) => <option key={mammal.id} value={mammal.id}>{mammal.commonName}</option>)}</select></label>
            <label><span>Date</span><input onChange={(event) => setDate(event.target.value)} type="date" value={date} /></label>
            <label><span>Behaviour</span><select onChange={(event) => setBehaviour(event.target.value as 'all' | SightingBehaviour)} value={behaviour}><option value="all">All behaviour</option>{['resting','walking','feeding','drinking','hunting','playing','calling','other'].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span>Sort</span><select onChange={(event) => setSortOrder(event.target.value as SortOrder)} value={sortOrder}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="species">Species A–Z</option></select></label>
          </div>
        </section>

        {isLoading ? <p className={styles.state} role="status">Opening your safari journal…</p> : null}
        {error ? <p className={styles.state} role="alert">{error}</p> : null}
        {!isLoading && !error && !sightings.length ? <section className={styles.empty}><span>✦</span><h2>Your journal is ready</h2><p>Record your first wildlife encounter and begin building a personal Kruger story.</p><Link to="/parks/kruger/mammals">Add first sighting</Link></section> : null}
        {!isLoading && !error && sightings.length ? <section aria-label="Saved sightings" className={styles.list}>{visibleSightings.map((sighting) => { const mammal = findMammal(sighting.animalId); return <Link className={styles.card} key={sighting.id} to={`/parks/kruger/sightings/${sighting.id}`}><SightingImage className={styles.cardImage} mammal={mammal} photo={sighting.photos[0]} /><div className={styles.cardCopy}><p>{sighting.date} · {sighting.time}</p><h2>{mammal?.commonName ?? 'Unknown species'}</h2><span>{sighting.location}</span><small>{sighting.count} animal{sighting.count === 1 ? '' : 's'} · {sighting.behaviour}{sighting.photos.length ? ` · ${sighting.photos.length} photo${sighting.photos.length === 1 ? '' : 's'}` : ''}</small></div><span aria-hidden="true" className={styles.chevron} /></Link>})}{!visibleSightings.length ? <p className={styles.state}>No journal entries match these filters.</p> : null}</section> : null}

        <Link className={styles.primaryAction} to="/parks/kruger/mammals">+ Add new sighting</Link>
        <SponsorFooter tone="light" />
      </section>
      {!isLoading && !error ? <AddSightingLauncher /> : null}
      <MammalsBottomNav active="sightings" />
    </main>
  )
}
