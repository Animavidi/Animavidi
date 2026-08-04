import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary'
}

export function Button({ children, className = '', type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  )
}
