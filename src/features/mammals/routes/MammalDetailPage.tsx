import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'

import { AppLogo } from '@/components/AppLogo/AppLogo'
import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import { AnimalDetailIcon, type AnimalDetailIconName } from '@/features/mammals/components/AnimalDetailIcon/AnimalDetailIcon'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import { animalDetailImagePositions } from '@/features/mammals/config/animalDetailImagePositions'
import { findMammal } from '@/features/mammals/model/mammals'
import { aggregateAnimalSightings, type AnimalSightingSummary } from '@/features/mammals/services/animalDetailService'
import { SightingImage } from '@/features/sightings/components/SightingImage/SightingImage'
import { AddSightingLauncher } from '@/features/sightings/components/AddSightingLauncher/AddSightingLauncher'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'

import styles from './MammalDetailPage.module.css'

const emptySummary: AnimalSightingSummary = { locations: 0, recentSightings: [], sightings: 0 }

function formatDate(value?: string) {
  if (!value) return 'Not recorded'
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function categoryLabel(value: string) {
  return value.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function MammalDetailPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { animalId = '' } = useParams()
  const mammal = findMammal(animalId)
  const [summary, setSummary] = useState<AnimalSightingSummary>(emptySummary)
  const [loadState, setLoadState] = useState<'error' | 'loading' | 'ready'>('loading')
  const [expanded, setExpanded] = useState(false)
  const detailState = location.state as { returnTo?: string } | null
  const returnTo = detailState?.returnTo ?? '/parks/kruger/mammals'

  useEffect(() => {
    if (!mammal) return
    let isCurrent = true
    setLoadState('loading')
    void sightingRepository.getAll().then((sightings) => {
      if (!isCurrent) return
      setSummary(aggregateAnimalSightings(sightings, mammal.id))
      setLoadState('ready')
    }).catch(() => {
      if (!isCurrent) return
      setSummary(emptySummary)
      setLoadState('error')
    })
    return () => { isCurrent = false }
  }, [mammal])

  useEffect(() => setExpanded(false), [animalId])

  const facts = useMemo(() => mammal ? [
    { content: mammal.profile.identificationFeatures.join(' · '), icon: 'recognise' as const, title: 'How to recognise' },
    { content: mammal.profile.habitat, icon: 'habitat' as const, title: 'Habitat' },
    { content: mammal.profile.behaviour, icon: 'behaviour' as const, title: 'Behaviour' },
    { content: mammal.profile.diet, icon: 'diet' as const, title: 'Diet' },
    { content: mammal.profile.groupStructure, icon: 'group' as const, title: 'Group structure' },
    { content: mammal.profile.conservationStatus, icon: 'conservation' as const, title: 'Conservation' },
    { content: mammal.profile.interestingFacts.join(' · '), icon: 'spark' as const, title: 'Interesting facts' },
  ].filter((fact) => fact.content.trim()) : [], [mammal])

  if (!mammal) return <AnimalDetailError title="Mammal not found" message="This species is not available in the current Kruger collection." />

  const observed = summary.sightings > 0
  const longIntroduction = mammal.profile.introduction.length > 155
  const heroStyle = { '--hero-position': animalDetailImagePositions[mammal.id] ?? '50% 40%' } as CSSProperties

  return (
    <main className={styles.page}>
      <header className={styles.hero} style={heroStyle}>
        <img alt={mammal.imageAlt} className={styles.heroImage} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = mammal.imageFallback }} src={mammal.image} />
        <div className={styles.topbar}>
          <Link aria-label="Back to mammals" className={styles.back} to={returnTo}><span aria-hidden="true" /></Link>
          <Link aria-label="Animavidi welcome" className={styles.logoLink} to="/"><AppLogo className={styles.logo} detailed tone="dark" /></Link>
        </div>
        <div className={styles.heroCopy}>
          {mammal.categories.length ? <div aria-label={`Categories: ${mammal.categories.map(categoryLabel).join(', ')}`} className={styles.tags}>{mammal.categories.slice(0, 2).map((category) => <span key={category}>{categoryLabel(category)}</span>)}</div> : null}
          <h1>{mammal.commonName}</h1>
          {mammal.scientificName ? <p>{mammal.scientificName}</p> : null}
        </div>
      </header>

      <article className={styles.content}>
        {searchParams.get('sighting') === 'created' ? <p className={styles.success} role="status">Sighting saved locally.</p> : null}

        <section aria-labelledby="observation-title" className={styles.observationCard}>
          <div className={styles.observationHeader}>
            <span aria-hidden="true" className={observed ? styles.observedMark : styles.unobservedMark}>{observed ? '✓' : '○'}</span>
            <div><h2 id="observation-title">{observed ? 'Observed' : 'Not yet observed'}</h2><p>{loadState === 'loading' ? 'Checking your safari journal…' : observed ? `First observed: ${formatDate(summary.firstObserved)}` : 'Your first encounter can begin here.'}</p></div>
          </div>
          {loadState === 'error' ? <p className={styles.inlineError} role="alert">Your local sightings could not be read. You can still browse this field guide and add a sighting.</p> : null}
          <div className={styles.observationActions}>
            <Link className={styles.addSighting} to={`/parks/kruger/mammals/${mammal.id}/sightings/new`}><span aria-hidden="true">+</span> Add sighting</Link>
            {observed ? <Link className={styles.viewSightings} to="/parks/kruger/sightings">View my sightings</Link> : null}
          </div>
        </section>

        <section aria-label="Personal sighting statistics" className={styles.statistics}>
          <Statistic icon="sightings" label="Sightings" value={loadState === 'ready' ? String(summary.sightings) : '—'} />
          <Statistic icon="count" label="Most in one sighting" value={loadState === 'ready' ? String(summary.maximumCount ?? 'Not recorded') : '—'} />
          <Statistic icon="date" label="Last observed" value={loadState === 'ready' ? formatDate(summary.lastObserved) : '—'} />
          <Statistic icon="location" label="Locations" value={loadState === 'ready' ? (summary.locations ? String(summary.locations) : 'Not recorded') : '—'} />
        </section>

        <section aria-labelledby="about-title" className={styles.about}>
          <h2 id="about-title">About</h2>
          <p className={!expanded && longIntroduction ? styles.clamped : undefined}>{mammal.profile.introduction}</p>
          {longIntroduction ? <button aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} type="button">{expanded ? 'Show less' : 'Read more'} <span aria-hidden="true">⌄</span></button> : null}
          {mammal.aliases.length ? <small><strong>Also known as</strong> {mammal.aliases.join(', ')}</small> : null}
        </section>

        {facts.length ? <section aria-labelledby="facts-title" className={styles.factsCard}>
          <h2 className="srOnly" id="facts-title">Field guide information</h2>
          {facts.map((fact) => <FactRow {...fact} key={fact.title} />)}
        </section> : null}

        <section aria-labelledby="recent-title" className={styles.recentSection}>
          <div className={styles.sectionHeading}><h2 id="recent-title">Your recent sightings</h2>{observed ? <Link to="/parks/kruger/sightings">View all</Link> : null}</div>
          {loadState === 'loading' ? <p className={styles.recentState} role="status">Opening your safari journal…</p> : null}
          {loadState === 'error' ? <p className={styles.recentState}>Recent sightings are temporarily unavailable.</p> : null}
          {loadState === 'ready' && !summary.recentSightings.length ? <div className={styles.emptyRecent}><p>No sightings recorded for {mammal.commonName} yet.</p><Link to={`/parks/kruger/mammals/${mammal.id}/sightings/new`}>Add first sighting</Link></div> : null}
          {summary.recentSightings.length ? <div className={styles.recentList}>{summary.recentSightings.map((sighting) => <Link className={styles.sightingCard} key={sighting.id} to={`/parks/kruger/sightings/${sighting.id}`}><SightingImage className={styles.sightingImage} mammal={mammal} photo={sighting.photos[0]} /><div><strong>{formatDate(sighting.date)}</strong><span>{sighting.time} · {sighting.location || 'Location not recorded'}</span><small>{sighting.count} animal{sighting.count === 1 ? '' : 's'} · {categoryLabel(sighting.behaviour)}</small></div><i aria-hidden="true" /></Link>)}</div> : null}
        </section>

        <p className={styles.demoNote}>Checklist inclusion follows SANParks; extended editorial profiles remain under review.</p>
        <SponsorFooter tone="light" />
      </article>
      <AddSightingLauncher />
      <MammalsBottomNav />
    </main>
  )
}

function Statistic({ icon, label, value }: { icon: AnimalDetailIconName; label: string; value: string }) {
  return <div><AnimalDetailIcon name={icon} /><span>{label}</span><strong>{value}</strong></div>
}

function FactRow({ content, icon, title }: { content: string; icon: AnimalDetailIconName; title: string }) {
  if (!content) return null
  return <div className={styles.factRow}><AnimalDetailIcon name={icon} /><div><h3>{title}</h3><p>{content}</p></div></div>
}

function AnimalDetailError({ message, title }: { message: string; title: string }) {
  return <main className={styles.notFound}><div><span aria-hidden="true">!</span><h1>{title}</h1><p>{message}</p><Link to="/parks/kruger/mammals">Return to mammals</Link><Link to="/parks/kruger">Kruger Home</Link></div><MammalsBottomNav /></main>
}
