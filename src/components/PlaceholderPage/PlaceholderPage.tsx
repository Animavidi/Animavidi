import { Link } from 'react-router-dom'

import { AppLogo } from '@/components/AppLogo/AppLogo'

import styles from './PlaceholderPage.module.css'

export function PlaceholderPage() {
  return (
    <main className={styles.page}>
      <AppLogo className={styles.logo} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Your Personal Safari Passport</p>
        <h1 className={styles.title}>This trail opens soon.</h1>
        <p className={styles.copy}>
          This destination is ready for the next stage of your safari.
        </p>
        <Link className={styles.backLink} to="/">
          Return to welcome
        </Link>
      </div>
    </main>
  )
}
