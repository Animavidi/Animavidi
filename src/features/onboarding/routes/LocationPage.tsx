import { useEffect, useRef } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import parkSelectionLion from '@/assets/onboarding/park-selection-lion.webp'
import { AppLogo } from '@/components/AppLogo/AppLogo'
import { activateDemoUser } from '@/features/demo/config/demoMode'

import styles from './LocationPage.module.css'

type StatisticIconProps = {
  type: 'mammals' | 'birds' | 'trees'
}

function StatisticIcon({ type }: StatisticIconProps) {
  if (type === 'birds') {
    return <svg aria-hidden="true" viewBox="0 0 48 48"><path d="M6 28c8-1 13-5 17-12 1 5 4 8 8 10 4 2 8 2 12 1-7 7-14 9-21 6-5-2-10-3-16-5Z" /><path d="m20 22-4-7 8 4" /></svg>
  }

  if (type === 'trees') {
    return <svg aria-hidden="true" viewBox="0 0 48 48"><path d="M24 39V24" /><path d="M24 29c-6 0-9-4-8-8-5-2-4-9 1-10 2-6 11-6 14-2 6-1 9 6 5 10 3 5-2 10-7 9-1 2-3 1-5 1Z" /><path d="M17 39h14" /></svg>
  }

  return <svg aria-hidden="true" viewBox="0 0 48 48"><path d="M18 17c2 0 3-3 3-5s-1-4-3-4-4 2-4 4 2 5 4 5Zm12 0c-2 0-3-3-3-5s1-4 3-4 4 2 4 4-2 5-4 5ZM11 24c2 0 4-2 4-5s-2-5-4-5-4 2-4 5 2 5 4 5Zm26 0c-2 0-4-2-4-5s2-5 4-5 4 2 4 5-2 5-4 5ZM24 19c-6 0-12 7-12 13 0 5 4 8 8 6 3-2 5-2 8 0 4 2 8-1 8-6 0-6-6-13-12-13Z" /></svg>
}

const statistics = [
  { icon: 'mammals' as const, label: 'Mammals', value: '147' },
  { icon: 'birds' as const, label: 'Birds', value: '500+' },
  { icon: 'trees' as const, label: 'Trees', value: '336' },
]

export function LocationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const isManualSelection = searchParams.get('mode') === 'manual'

  useEffect(() => {
    if (!isManualSelection) titleRef.current?.focus()
  }, [isManualSelection])

  if (isManualSelection) return <Navigate replace to="/full-version?feature=manual-park-selection" />

  const startSafari = () => {
    activateDemoUser()
    void navigate('/parks/kruger')
  }

  return (
    <div className={styles.page}>
      <div aria-hidden="true" className={styles.backdrop} style={{ backgroundImage: `url(${parkSelectionLion})` }} />
      <div aria-hidden="true" className={styles.overlay} />
      <a className={styles.skipLink} href="#kruger-introduction">Skip to Kruger introduction</a>

      <header className={styles.header}>
        <Link aria-label="Animavidi welcome" className={styles.logoLink} to="/">
          <AppLogo className={styles.logo} detailed tone="dark" />
        </Link>
      </header>

      <main className={styles.main} id="kruger-introduction">
        <section className={styles.intro}>
          <p className={styles.eyebrow}>Welcome to</p>
          <h1 ref={titleRef} tabIndex={-1}>Kruger<br />National Park</h1>
          <div aria-hidden="true" className={styles.divider}><span>◆</span></div>
          <p className={styles.description}>The greatest wildlife<br />destination in Africa.</p>
        </section>

        <section aria-label="Kruger wildlife statistics" className={styles.statistics}>
          {statistics.map((statistic) => (
            <div className={styles.statistic} key={statistic.label}>
              <span className={styles.statisticIcon}><StatisticIcon type={statistic.icon} /></span>
              <strong>{statistic.value}</strong>
              <span>{statistic.label}</span>
            </div>
          ))}
        </section>

        <button className={styles.startButton} onClick={startSafari} type="button">
          <span aria-hidden="true" className={styles.arrow}>→</span>
          <span>Start your safari</span>
        </button>

        <section className={styles.otherParks}>
          <div className={styles.sectionTitle}><span /> <h2>Other Parks</h2> <span /></div>
          <div className={styles.comingSoon}>
            <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 29S6 20 6 12a10 10 0 0 1 20 0c0 8-10 17-10 17Z" /><circle cx="16" cy="12" r="3" /></svg>
            <p><strong>More parks coming soon</strong><span>Available in the full version</span></p>
          </div>
        </section>
      </main>
    </div>
  )
}
