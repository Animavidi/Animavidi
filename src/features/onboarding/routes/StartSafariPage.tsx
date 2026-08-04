import { ActionLink } from '@/components/ActionLink/ActionLink'
import { OnboardingLayout } from '@/components/OnboardingLayout/OnboardingLayout'

import styles from './OnboardingPages.module.css'

export function StartSafariPage() {
  return (
    <OnboardingLayout actions={<ActionLink to="/onboarding/location">Choose my location</ActionLink>} currentStep={1} description="Set up a personal passport for the places, wildlife and moments that shape your journey." eyebrow="Begin your journey" title="Start your first safari">
      <ul className={styles.featureList}>
        <li>Choose the safari location you are exploring.</li>
        <li>Create a private passport profile in a later connected release.</li>
        <li>Begin with a clear, guided first journey.</li>
      </ul>
      <p className={styles.previewNote}>This frontend preview does not save or send personal information.</p>
    </OnboardingLayout>
  )
}
