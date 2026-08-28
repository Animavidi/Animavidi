import type { PassportProfile } from '@/features/passport/model/passport'
import { BigFiveRelief } from '@/features/passport/components/BigFiveRelief/BigFiveRelief'
import { ExplorerStamp } from '@/features/passport/components/ExplorerStamp/ExplorerStamp'

import styles from './PassportCard.module.css'

type PassportCardProps = {
  profile: PassportProfile
}

export function PassportCard({ profile }: PassportCardProps) {
  return (
    <section aria-labelledby="passport-card-title" className={styles.card}>
      <div className={styles.title}>
        <p>Animavidi</p>
        <h2 id="passport-card-title">Safari<br />Passport</h2>
        <span>Your adventure. Your legacy.</span>
      </div>

      <div className={styles.stamp}><ExplorerStamp /></div>
      <div aria-hidden="true" className={styles.emblem}><BigFiveRelief name="african-lion" /></div>

      <dl className={styles.identity}>
        <div className={styles.name}><dt>Explorer</dt><dd>{profile.name}</dd></div>
        <div><dt>Passport no.</dt><dd>{profile.number}</dd></div>
        <div><dt>Explorer since</dt><dd>{profile.explorerSince}</dd></div>
        <div><dt>Primary park</dt><dd>{profile.primaryPark}</dd></div>
        <div><dt>Country</dt><dd>{profile.country}</dd></div>
      </dl>
    </section>
  )
}
