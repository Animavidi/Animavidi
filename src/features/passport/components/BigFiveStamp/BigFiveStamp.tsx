import { Link } from 'react-router-dom'

import { BigFiveRelief, type BigFiveReliefName } from '@/features/passport/components/BigFiveRelief/BigFiveRelief'
import type { BigFiveEntry } from '@/features/passport/model/passport'

import styles from './BigFiveStamp.module.css'

type BigFiveStampProps = {
  earnedDate?: string
  entry: BigFiveEntry
  formatDate: (date?: string) => string
}

const shortNames: Record<string, string> = {
  'african-lion': 'Lion',
  'african-elephant': 'Elephant',
  leopard: 'Leopard',
  'african-buffalo': 'Buffalo',
  'white-rhinoceros': 'Rhinoceros',
}

export function BigFiveStamp({ entry, earnedDate, formatDate }: BigFiveStampProps) {
  return (
    <Link aria-label={`${entry.title}: ${entry.seen ? 'Seen' : 'Not yet seen'}`} className={`${styles.stamp} ${entry.seen ? styles.seen : styles.unseen}`} to={`/parks/kruger/mammals/${entry.id}`}>
      <span className={styles.medallion}>
        <BigFiveRelief className={styles.animal} name={entry.id as BigFiveReliefName} />
      </span>
      <strong>{shortNames[entry.id] ?? entry.title}</strong>
      <small>{earnedDate ? `First sighting: ${formatDate(earnedDate)}` : 'Not yet discovered'}</small>
    </Link>
  )
}
