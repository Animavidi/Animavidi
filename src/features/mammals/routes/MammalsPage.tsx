import { useEffect, useMemo } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

import heroImage from '@/assets/onboarding/park-selection-lion.webp'
import { AppLogo } from '@/components/AppLogo/AppLogo'
import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import { MammalCard } from '@/features/mammals/components/MammalCard/MammalCard'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import type { MammalCategory, MammalFilter } from '@/features/mammals/model/mammal'
import { mammals } from '@/features/mammals/model/mammals'
import { AddSightingLauncher } from '@/features/sightings/components/AddSightingLauncher/AddSightingLauncher'

import styles from './MammalsPage.module.css'

const scrollKey = 'animavidi:kruger-mammals-scroll'
const imageFor = (id: string) => mammals.find((mammal) => mammal.id === id)?.image ?? heroImage

const filters: ReadonlyArray<{ image: string; label: string; value: MammalCategory }> = [
  { image: imageFor('african-lion'), label: 'Big Five', value: 'big-five' },
  { image: imageFor('greater-kudu'), label: 'Antelopes', value: 'antelopes' },
  { image: imageFor('cheetah'), label: 'Predators', value: 'predators' },
  { image: imageFor('chacma-baboon'), label: 'Primates', value: 'primates' },
  { image: imageFor('honey-badger'), label: 'Small mammals', value: 'small-mammals' },
]

const validFilters = new Set<MammalFilter>(['all', ...filters.map((filter) => filter.value)])

export function MammalsPage() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const requestedFilter = searchParams.get('filter') ?? 'all'
  const activeFilter: MammalFilter = validFilters.has(requestedFilter as MammalFilter) ? (requestedFilter as MammalFilter) : 'all'

  useEffect(() => {
    const storedPosition = Number(sessionStorage.getItem(scrollKey) ?? '0')
    if (storedPosition > 0) requestAnimationFrame(() => window.scrollTo({ top: storedPosition }))
  }, [])

  const visibleMammals = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return mammals
      .filter((mammal) => activeFilter === 'all' || mammal.categories.includes(activeFilter))
      .filter((mammal) => {
        if (!normalizedQuery) return true
        return [mammal.commonName, mammal.scientificName ?? '', ...mammal.aliases].join(' ').toLocaleLowerCase().includes(normalizedQuery)
      })
      .slice()
      .sort((left, right) => left.sortName.localeCompare(right.sortName) || left.commonName.localeCompare(right.commonName))
  }, [activeFilter, query])

  const mainMammals = visibleMammals.filter((mammal) => mammal.overviewSection === 'main')
  const smallMammalGroups = [
    { id: 'bats', label: 'Bats' },
    { id: 'rodents', label: 'Rodents' },
    { id: 'shrews-moles', label: 'Shrews & Moles' },
  ] as const

  function updateSearch(nextQuery: string) {
    const next = new URLSearchParams(searchParams)
    if (nextQuery) next.set('q', nextQuery)
    else next.delete('q')
    void setSearchParams(next, { replace: true })
  }

  function updateFilter(filter: MammalFilter) {
    const next = new URLSearchParams(searchParams)
    if (filter === 'all') next.delete('filter')
    else next.set('filter', filter)
    void setSearchParams(next, { replace: true })
  }

  function rememberScrollPosition() {
    sessionStorage.setItem(scrollKey, String(window.scrollY))
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.topbar}>
          <Link aria-label="Back to Kruger National Park" className={styles.back} to="/parks/kruger"><span aria-hidden="true" /></Link>
          <Link aria-label="Animavidi welcome" className={styles.logoLink} to="/"><AppLogo className={styles.logo} detailed tone="dark" /></Link>
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.parkName}>Kruger National Park</p>
          <span aria-hidden="true" className={styles.goldRule} />
          <h1>Mammals</h1>
          <p>Explore Kruger’s complete 148-mammal checklist.</p>
        </div>
      </header>

      <section className={styles.content}>
        <label className={styles.search}>
          <span className="srOnly">Search mammals by common, scientific or alternative name</span>
          <span aria-hidden="true" className={styles.searchIcon} />
          <input onChange={(event) => updateSearch(event.target.value)} placeholder="Search mammals…" type="search" value={query} />
          <span aria-hidden="true" className={styles.filterIcon}><i /><i /><i /></span>
        </label>

        <section aria-labelledby="quick-access-title" className={styles.quickAccess}>
          <div className={styles.sectionHeading}>
            <h2 id="quick-access-title">Quick access</h2>
            {activeFilter !== 'all' ? <button onClick={() => updateFilter('all')} type="button">Show all</button> : null}
          </div>
          <div className={styles.filterGrid}>
            {filters.map((filter) => (
              <button aria-pressed={activeFilter === filter.value} className={activeFilter === filter.value ? styles.selectedFilter : undefined} key={filter.value} onClick={() => updateFilter(activeFilter === filter.value ? 'all' : filter.value)} style={{ backgroundImage: `url(${filter.image})` }} type="button">
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="mammal-list-title" className={styles.listSection}>
          <h2 id="mammal-list-title">{activeFilter === 'all' ? 'Main mammals' : filters.find((filter) => filter.value === activeFilter)?.label}<span> ({activeFilter === 'all' ? mainMammals.length : visibleMammals.length})</span></h2>
          {mainMammals.length ? <div className={styles.list}>{mainMammals.map((mammal) => <MammalCard key={mammal.id} mammal={mammal} onSelect={rememberScrollPosition} returnTo={`${location.pathname}${location.search}`} />)}</div> : null}
          {smallMammalGroups.map((group) => {
            const entries = visibleMammals.filter((mammal) => mammal.smallMammalGroup === group.id)
            if (!entries.length) return null
            return <section aria-labelledby={`small-${group.id}-title`} className={styles.smallGroup} key={group.id}><h3 id={`small-${group.id}-title`}>{group.label}<span> ({entries.length})</span></h3><div className={styles.list}>{entries.map((mammal) => <MammalCard key={mammal.id} mammal={mammal} onSelect={rememberScrollPosition} returnTo={`${location.pathname}${location.search}`} />)}</div></section>
          })}
          {!visibleMammals.length ? <p className={styles.empty}>No mammals match this search yet. Try another name or clear the active filter.</p> : null}
        </section>

        <SponsorFooter tone="light" />
      </section>
      <AddSightingLauncher />
      <MammalsBottomNav />
    </main>
  )
}
