import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import informationPreview from '@/assets/parks/kruger/information-preview.webp'
import mammalsPreview from '@/assets/parks/kruger/mammals-preview.webp'
import mapPreview from '@/assets/parks/kruger/map-preview.webp'
import sightingsPreview from '@/assets/parks/kruger/sightings-preview.webp'
import heroImage from '@/assets/onboarding/park-selection-lion.webp'
import { AppLogo } from '@/components/AppLogo/AppLogo'
import { ParkNavigationCard } from '@/features/parks/components/ParkNavigationCard/ParkNavigationCard'
import { AddSightingLauncher } from '@/features/sightings/components/AddSightingLauncher/AddSightingLauncher'

import styles from './KrugerHomePage.module.css'

const navigationCards = [
  { icon: 'mammals' as const, image: mammalsPreview, subtitle: 'Discover and learn', title: 'Mammals', to: '/parks/kruger/mammals' },
  { icon: 'sightings' as const, image: sightingsPreview, subtitle: 'Your personal sightings', title: 'My Sightings', to: '/parks/kruger/sightings' },
  { icon: 'map' as const, image: mapPreview, subtitle: 'Explore routes and landmarks', title: 'Park Map', to: '/parks/kruger/map' },
  { icon: 'information' as const, image: informationPreview, subtitle: 'Everything you need to know', title: 'Park Information', to: '/parks/kruger/information' },
]

function StatisticIcon({ type }: { type: 'birds' | 'mammals' | 'trees' }) {
  if (type === 'birds') return <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M3 19c6-1 10-4 13-10 1 4 3 6 6 8 3 1 5 2 8 1-5 5-10 6-15 4-4-1-8-2-12-3Z" /></svg>
  if (type === 'trees') return <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 27V16" /><path d="M16 20c-4 0-6-2-6-5-3-2-2-6 2-7 2-4 8-3 9 0 5-1 6 5 3 7 2 4-2 7-5 6-1 1-2 0-3-1Z" /><path d="M11 27h10" /></svg>
  return <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M12 11c2 0 2-3 2-4s-1-3-2-3-3 1-3 3 1 4 3 4Zm8 0c-2 0-2-3-2-4s1-3 2-3 3 1 3 3-1 4-3 4ZM7 15c2 0 3-2 3-4s-1-3-3-3-3 1-3 3 1 4 3 4Zm18 0c-2 0-3-2-3-4s1-3 3-3 3 1 3 3-1 4-3 4Zm-9-2c-4 0-8 5-8 9 0 3 3 5 6 3 2-1 3-1 5 0 3 2 6 0 6-3 0-4-5-9-9-9Z" /></svg>
}

export function KrugerHomePage() {
  return (
    <main className={styles.page} style={{ '--hero-image': `url(${heroImage})` } as CSSProperties}>
      <div aria-hidden="true" className={styles.backdrop} />
      <section aria-labelledby="kruger-title" className={styles.hero}>
        <Link aria-label="Back to park selection" className={styles.back} to="/onboarding/location"><span aria-hidden="true" /></Link>
        <Link aria-label="Animavidi welcome" className={styles.logoLink} to="/"><AppLogo className={styles.logo} detailed tone="dark" /></Link>

        <div className={styles.heroContent}>
          <h1 id="kruger-title">Kruger<br />National Park</h1>
          <p className={styles.location}>South Africa <span aria-hidden="true" /></p>
          <p className={styles.introduction}>The greatest wildlife<br />destination in Africa.</p>
        </div>

        <dl aria-label="Kruger National Park wildlife statistics" className={styles.statistics}>
          <div><StatisticIcon type="mammals" /><dt>147</dt><dd>Mammals</dd></div>
          <div><StatisticIcon type="birds" /><dt>500+</dt><dd>Birds</dd></div>
          <div><StatisticIcon type="trees" /><dt>336</dt><dd>Trees</dd></div>
        </dl>
      </section>

      <section aria-label="Explore Kruger National Park" className={styles.content}>
        <nav aria-label="Kruger National Park sections" className={styles.navigation}>
          <Link className={styles.passportLink} to="/passport">
            <span aria-hidden="true" className={styles.passportIcon}>✦</span>
            <strong>Open Safari Passport</strong>
            <span aria-hidden="true" className={styles.chevron} />
          </Link>
          {navigationCards.map((card) => <ParkNavigationCard key={card.title} {...card} />)}
        </nav>

        <Link className={styles.startButton} to="/parks/kruger/mammals"><span aria-hidden="true">→</span><strong>Start your safari</strong></Link>

        <footer className={styles.sponsor}>
          <div><span /><small>Sponsored by</small><span /></div>
          <a href="https://luxurysafarihomes.com" rel="noreferrer" target="_blank">
            <strong>Luxury Safari Homes</strong>
            <span>luxurysafarihomes.com ↗</span>
            <span className="srOnly"> (opens in a new tab)</span>
          </a>
        </footer>
      </section>
      <AddSightingLauncher />
    </main>
  )
}
