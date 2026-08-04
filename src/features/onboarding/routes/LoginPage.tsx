import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button/Button'
import { FormField } from '@/components/FormField/FormField'
import { OnboardingLayout } from '@/components/OnboardingLayout/OnboardingLayout'
import { onboardingCompletionKey } from '@/features/passport/config/passportConfig'

import styles from './OnboardingPages.module.css'

export function LoginPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    localStorage.setItem(onboardingCompletionKey, 'true')
    void navigate('/passport?flow=continue')
  }

  return (
    <OnboardingLayout currentStep={2} description="Enter your details to return to your Safari Passport. This preview does not authenticate or send them." eyebrow="Passport access" title="Log in" totalSteps={4}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField autoComplete="email" id="login-email" label="Email address" name="email" required type="email" />
        <FormField autoComplete="current-password" id="login-password" label="Password" name="password" required type="password" />
        <div className={styles.formActions}><Button type="submit">Continue my safari</Button></div>
      </form>
      <p className={styles.switchPrompt}>Starting fresh? <Link to="/onboarding/location">Create a new passport</Link></p>
    </OnboardingLayout>
  )
}
