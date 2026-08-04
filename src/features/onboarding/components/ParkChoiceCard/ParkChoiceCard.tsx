import { Link } from 'react-router-dom'

import styles from './ParkChoiceCard.module.css'

type ParkChoiceCardProps = {
  assistiveText?: string
  description: string
  icon: 'location' | 'map'
  onClick?: () => void
  recommended?: boolean
  title: string
  to?: string
  variant?: 'primary' | 'secondary'
}

export function ParkChoiceCard({
  assistiveText,
  description,
  icon,
  onClick,
  recommended = false,
  title,
  to,
  variant = 'secondary',
}: ParkChoiceCardProps) {
  const content = (
    <>
      <span aria-hidden="true" className={styles.iconDisc}>
        <span className={`${styles.icon} ${styles[icon]}`} />
      </span>
      <span className={styles.copy}>
        <span className={styles.titleRow}>
          <strong>{title}</strong>
          {recommended ? <span className={styles.badge}>★ Recommended</span> : null}
        </span>
        <span className={styles.description}>{description}</span>
        {assistiveText ? <span className="srOnly"> {assistiveText}</span> : null}
      </span>
      <span aria-hidden="true" className={styles.chevron} />
    </>
  )

  const className = `${styles.card} ${styles[variant]}`

  return to ? <Link className={className} to={to}>{content}</Link> : <button className={className} onClick={onClick} type="button">{content}</button>
}
