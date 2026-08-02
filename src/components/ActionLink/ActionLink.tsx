import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import styles from './ActionLink.module.css'

type ActionLinkProps = {
  children: ReactNode
  to: string
  variant?: 'primary' | 'secondary' | 'tertiary'
}

export function ActionLink({
  children,
  to,
  variant = 'primary',
}: ActionLinkProps) {
  return (
    <Link className={`${styles.actionLink} ${styles[variant]}`} to={to}>
      {children}
    </Link>
  )
}
