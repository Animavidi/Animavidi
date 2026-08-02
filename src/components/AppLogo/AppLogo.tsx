import styles from './AppLogo.module.css'

type AppLogoProps = {
  className?: string
}

export function AppLogo({ className = '' }: AppLogoProps) {
  return (
    <div
      aria-label="Animavidi"
      className={`${styles.logo} ${className}`.trim()}
      role="img"
    >
      <span aria-hidden="true" className={styles.wordmark}>
        Animavidi
      </span>
      <span aria-hidden="true" className={styles.rule} />
    </div>
  )
}
