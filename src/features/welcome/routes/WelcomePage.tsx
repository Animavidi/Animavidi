import { AppLogo } from '@/components/AppLogo/AppLogo'
import lionSunsetHero from '@/assets/welcome/lion-sunset-hero.webp'
import { WelcomeAction } from '@/features/welcome/components/WelcomeAction/WelcomeAction'
import { demoMode } from '@/features/demo/config/demoMode'

import styles from './WelcomePage.module.css'

export function WelcomePage() {
  return (
    <main className={styles.page}>
      <div aria-hidden="true" className={styles.backdrop} style={{ backgroundImage: `url(${lionSunsetHero})` }} />
      <div aria-hidden="true" className={styles.overlay} />

      <header className={styles.header}>
        <AppLogo className={styles.logo} detailed tone="dark" />
        <p>Jouw wildlife. Jouw verhaal. Jouw bijdrage.</p>
      </header>

      <section aria-labelledby="welcome-title" className={styles.hero}>
        <div className={styles.intro}>
          <h1 className={styles.title} id="welcome-title">Welkom bij Animavidi</h1>
          <p className={styles.introCopy}>Bouw jouw persoonlijke wildlife-journaal op.<br />Ontdek dieren, leer ze herkennen en bewaar<br />al jouw waarnemingen op één plek.</p>
        </div>

        <nav aria-label="Begin your Animavidi journey" className={styles.actions}>
          <WelcomeAction icon="account" subtitle="Start met de demo-ontdekkingsreiziger" title="Nieuwe ontdekkingsreiziger" to={demoMode.routes.newExplorer} />
          <WelcomeAction icon="login" subtitle="Ga verder als demo-ontdekkingsreiziger" title="Verder waar ik gebleven was" to={demoMode.routes.returningExplorer} variant="ivory" />
          <WelcomeAction icon="preview" subtitle="Ontdek eerst wat Animavidi kan doen" title="Bekijk een voorbeeld" to="/parks/kruger" variant="outline" />
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
