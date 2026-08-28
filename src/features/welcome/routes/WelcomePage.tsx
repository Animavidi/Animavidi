import { AppLogo } from '@/components/AppLogo/AppLogo'
import lionSunsetHero from '@/assets/welcome/lion-sunset-hero.webp'
import { WelcomeAction } from '@/features/welcome/components/WelcomeAction/WelcomeAction'
import { demoMode, getDemoUserDisplayName } from '@/features/demo/config/demoMode'

import styles from './WelcomePage.module.css'

export function WelcomePage() {
  const displayName = getDemoUserDisplayName()

  return (
    <main className={styles.page}>
      <h1 className="srOnly">Animavidi</h1>
      <div aria-hidden="true" className={styles.backdrop} style={{ backgroundImage: `url(${lionSunsetHero})` }} />
      <div aria-hidden="true" className={styles.overlay} />

      <header className={styles.header}>
        <AppLogo className={styles.logo} detailed tone="dark" />
        <p>{displayName ? `Welkom terug, ${displayName}.` : 'Jouw wildlife. Jouw verhaal. Jouw bijdrage.'}</p>
      </header>

      <section aria-label="Start your Animavidi journey" className={styles.hero}>
        <nav aria-label="Begin your Animavidi journey" className={styles.actions}>
          <WelcomeAction icon="account" title="Start je eerste safari" to={demoMode.routes.newExplorer} />
          <WelcomeAction icon="login" title="Mijn safari" to={demoMode.routes.returningExplorer} variant="ivory" />
        </nav>
      </section>

      <footer className={styles.footer}>
        <a
          className={styles.sponsor}
          href="https://luxurysafarihomes.com"
          rel="noreferrer"
          target="_blank"
        >
          <span>Sponsored by</span>
          <strong>Luxury Safari Homes</strong>
          <span>luxurysafarihomes.com&nbsp; ↗</span>
          <span className="srOnly"> (opens in a new tab)</span>
        </a>
      </footer>
    </main>
  )
}
