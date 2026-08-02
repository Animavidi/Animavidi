import { ActionLink } from '@/components/ActionLink/ActionLink'
import { AppLogo } from '@/components/AppLogo/AppLogo'

import styles from './WelcomePage.module.css'

export function WelcomePage() {
  return (
    <main className={styles.page}>
      <div aria-hidden="true" className={styles.backdrop} />
      <div aria-hidden="true" className={styles.overlay} />

      <header className={styles.header}>
        <AppLogo />
      </header>

      <section aria-labelledby="welcome-title" className={styles.hero}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Your Personal Safari Passport</p>
          <h1 className={styles.title} id="welcome-title">
            Every journey begins in the wild.
          </h1>
        </div>

        <nav aria-label="Begin your Animavidi journey" className={styles.actions}>
          <ActionLink to="/safari/new">Start my first safari</ActionLink>
          <ActionLink to="/safari/continue" variant="secondary">
            Continue my safari
          </ActionLink>
          <ActionLink to="/demo" variant="tertiary">
            View demo
          </ActionLink>
        </nav>
      </section>

      <footer className={styles.footer}>
        <a
          className={styles.sponsor}
          href="https://luxurysafarihomes.com"
          rel="noreferrer"
          target="_blank"
        >
          Sponsored by LuxurySafariHomes.com
          <span className="srOnly"> (opens in a new tab)</span>
        </a>
      </footer>
    </main>
  )
}
