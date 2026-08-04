import type { InputHTMLAttributes } from 'react'

import styles from './FormField.module.css'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  hint?: string
  label: string
}

export function FormField({ hint, id, label, ...props }: FormFieldProps) {
  const hintId = hint && id ? `${id}-hint` : undefined

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      {hint ? <p className={styles.hint} id={hintId}>{hint}</p> : null}
      <input aria-describedby={hintId} className={styles.input} id={id} {...props} />
    </div>
  )
}
