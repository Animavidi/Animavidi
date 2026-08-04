import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button/Button'
import { FormField } from '@/components/FormField/FormField'
import { OnboardingLayout } from '@/components/OnboardingLayout/OnboardingLayout'
import { onboardingCompletionKey } from '@/features/passport/config/passportConfig'

import styles from './OnboardingPages.module.css'

export function CreateAccountPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    localStorage.setItem(onboardingCompletionKey, 'true')
    void navigate('/passport?flow=first')
  }

  return (
    <OnboardingLayout currentStep={3} description="Create the profile that will hold your Safari Passport when connected services are added." eyebrow="Your details" title="Create your account">
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField autoComplete="name" id="full-name" label="Full name" name="full-name" required type="text" />
        <FormField autoComplete="email" id="email" label="Email address" name="email" required type="email" />
        <FormField autoComplete="new-password" hint="Use at least 8 characters." id="password" label="Password" minLength={8} name="password" required type="password" />
        <p className={styles.helper}>This frontend preview validates your entries locally, then discards them. Nothing is saved or sent.</p>
        <div className={styles.formActions}><Button type="submit">Create my passport</Button></div>
      </form>
      <p className={styles.switchPrompt}>Already have an account? <Link to="/login">Log in</Link></p>
    </OnboardingLayout>
  )
}
