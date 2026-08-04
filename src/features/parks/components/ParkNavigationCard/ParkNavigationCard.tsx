import { Link } from 'react-router-dom'

import styles from './ParkNavigationCard.module.css'

type ParkNavigationCardProps = {
  icon: 'information' | 'mammals' | 'map' | 'sightings'
  image: string
  subtitle: string
  title: string
  to: string
}

function SafariIcon({ name }: { name: ParkNavigationCardProps['icon'] }) {
  if (name === 'mammals') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M8.2 11.2c-1.3-1.8-3.7-1.3-3.7.8 0 1.5 1.4 2.4 2.8 2.2M15.8 11.2c1.3-1.8 3.7-1.3 3.7.8 0 1.5-1.4 2.4-2.8 2.2M8.3 6.8C9.3 5.6 10.5 5 12 5s2.7.6 3.7 1.8l1.1 4.2c.6 3.8-1.5 7.5-4.8 8.2-3.3-.7-5.4-4.4-4.8-8.2l1.1-4.2Z" />
        <path d="m9.6 15.8 2.4 1.5 2.4-1.5M9.2 10.3h.1M14.7 10.3h.1M10.6 13.1h2.8" />
      </svg>
    )
  }

  if (name === 'sightings') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m12 3.2 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9L6.6 20l1-6.1-4.4-4.3 6.1-.9L12 3.2Z" />
      </svg>
    )
  }

  if (name === 'map') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m3.5 6.2 5-2.7 7 3 5-2.7v14l-5 2.7-7-3-5 2.7v-14Z" />
        <path d="M8.5 3.5v14M15.5 6.5v14" />
        <circle cx="15.5" cy="12.5" r="2.2" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="6.2" r="1.4" />
      <path d="M10.5 10h2.3v8.8h2M9.5 18.8h7" />
    </svg>
  )
}

export function ParkNavigationCard({
  icon,
  image,
  subtitle,
  title,
  to,
}: ParkNavigationCardProps) {
  return (
    <Link className={styles.card} to={to}>
      <span
        aria-hidden="true"
        className={styles.preview}
        style={{ backgroundImage: `url(${image})` }}
      />
      <span aria-hidden="true" className={`${styles.icon} ${styles[icon]}`}>
        <SafariIcon name={icon} />
      </span>
      <span className={styles.copy}>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </span>
      <span aria-hidden="true" className={styles.chevron} />
    </Link>
  )
}
