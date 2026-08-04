import { Link } from 'react-router-dom'

import styles from './WelcomeAction.module.css'

type WelcomeActionProps = {
  icon: 'account' | 'login' | 'preview'
  subtitle: string
  title: string
  to: string
  variant?: 'green' | 'ivory' | 'outline'
}

export function WelcomeAction({
  icon,
  subtitle,
  title,
  to,
  variant = 'green',
}: WelcomeActionProps) {
  return (
    <Link className={`${styles.action} ${styles[variant]}`} to={to}>
      <WelcomeActionIcon name={icon} />
      <span className={styles.copy}>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </span>
      <span aria-hidden="true" className={styles.chevron} />
    </Link>
  )
}

function WelcomeActionIcon({ name }: { name: WelcomeActionProps['icon'] }) {
  if (name === 'account') return <svg aria-hidden="true" className={styles.icon} viewBox="0 0 48 48"><circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="3"/><path d="m29 15-3.2 9.2L16 33l3.2-9.2L29 15Z"/><path d="M24 7v3M24 38v3M7 24h3M38 24h3"/></svg>
  if (name === 'login') return <svg aria-hidden="true" className={styles.icon} viewBox="0 0 48 48"><path d="M8 20v-5c0-3 2-5 5-5h5c3 0 5 2 5 5v6M25 21v-6c0-3 2-5 5-5h5c3 0 5 2 5 5v6"/><path d="M7 21h15l3 8v8c0 2-2 4-4 4H10c-2 0-4-2-4-4v-8l1-8ZM26 21h15l1 8v8c0 2-2 4-4 4H27c-2 0-4-2-4-4v-8l-1-8Z"/><path d="M22 29h4"/></svg>
  return <svg aria-hidden="true" className={styles.icon} viewBox="0 0 48 48"><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24Z"/><circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="2"/></svg>
}
