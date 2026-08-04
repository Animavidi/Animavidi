import { Link, useSearchParams } from 'react-router-dom'

import { AppLogo } from '@/components/AppLogo/AppLogo'

import styles from './DemoUnavailablePage.module.css'

const featureLabels: Record<string, string> = {
  'manual-park-selection': 'Manual park selection',
  authentication: 'Connected accounts',
}

export function DemoUnavailablePage() {
  const [searchParams] = useSearchParams()
  const feature = featureLabels[searchParams.get('feature') ?? '']

  return <main className={styles.page}>
    <AppLogo className={styles.logo} tone="light" />
    <section className={styles.card}>
      <p>Animavidi Demo</p>
      <h1>Available in the full version</h1>
      {feature ? <h2>{feature}</h2> : null}
      <div aria-hidden="true" className={styles.divider}><span /></div>
      <p>This part of Animavidi is intentionally hidden during the curated demo experience.</p>
      <div className={styles.actions}><Link to="/parks/kruger">Continue the demo</Link><Link to="/">Return to Welcome</Link></div>
    </section>
  </main>
}

