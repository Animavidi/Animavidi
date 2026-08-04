import { ActionLink } from '@/components/ActionLink/ActionLink'
import { OnboardingLayout } from '@/components/OnboardingLayout/OnboardingLayout'

import styles from './OnboardingPages.module.css'

export function ContinueSafariPage() {
  return (
    <OnboardingLayout
      actions={<ActionLink to="/login">Log in to continue</ActionLink>}
      currentStep={1}
      description="Return to the passport and safari progress connected to your account."
      eyebrow="Welcome back"
      title="Continue your safari"
      totalSteps={4}
    >
      <ul className={styles.featureList}>
        <li>Pick up from your most recent safari location.</li>
        <li>Review the passport moments already collected.</li>
        <li>Keep your journey together across future visits.</li>
      </ul>
      <p className={styles.previewNote}>Account access is simulated in this frontend-only release.</p>
    </OnboardingLayout>
  )
}
