import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { AppLogo } from '@/components/AppLogo/AppLogo'

import styles from './OnboardingLayout.module.css'

type OnboardingLayoutProps = {
  actions?: ReactNode
  children: ReactNode
  currentStep: number
  description: string
  eyebrow: string
  title: string
  totalSteps?: number
}

export function OnboardingLayout({ actions, children, currentStep, description, eyebrow, title, totalSteps = 5 }: OnboardingLayoutProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <header className={styles.header}>
        <Link aria-label="Animavidi welcome" className={styles.logoLink} to="/">
          <AppLogo tone="dark" />
        </Link>
        <p aria-live="polite" className={styles.progressText}>Step {currentStep} of {totalSteps}</p>
      </header>
      <div aria-hidden="true" className={styles.progressTrack}>
        <span className={styles.progressValue} style={{ inlineSize: `${(currentStep / totalSteps) * 100}%` }} />
      </div>
      <main className={styles.main} id="main-content">
        <div className={styles.content}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title} ref={titleRef} tabIndex={-1}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.body}>{children}</div>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
      </main>
      <aside aria-hidden="true" className={styles.visual} />
    </div>
  )
}
