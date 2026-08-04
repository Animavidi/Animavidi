import styles from './AppLogo.module.css'

type AppLogoProps = {
  className?: string
  detailed?: boolean
  tone?: 'light' | 'dark'
}

export function AppLogo({ className = '', detailed = false, tone = 'light' }: AppLogoProps) {
  return (
    <div
      aria-label="Animavidi"
      className={`${styles.logo} ${styles[tone]} ${className}`.trim()}
      role="img"
    >
      {detailed ? (
        <span aria-hidden="true" className={styles.assetFrame}>
          <span className={styles.cameraMark}><span /></span>
          <span className={styles.wordmark}>Anima<span className={styles.accent}>v</span>idi</span>
          <span className={styles.rule} />
          <span className={styles.tagline}>Ontdek. Herken. Bewaar.</span>
        </span>
      ) : (
        <>
          <span aria-hidden="true" className={styles.wordmark}>Animavidi</span>
          <span aria-hidden="true" className={styles.rule} />
        </>
      )}
    </div>
  )
}
