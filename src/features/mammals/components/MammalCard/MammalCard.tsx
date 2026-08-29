import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import { MammalImage } from '@/features/mammals/components/MammalImage/MammalImage'
import type { Mammal } from '@/features/mammals/model/mammal'

import styles from './MammalCard.module.css'

type MammalCardProps = {
  mammal: Mammal
  onSelect: () => void
  returnTo: string
}

const imagePositions: Readonly<Record<string, string>> = {
  'african-buffalo': '43% 48%',
  'african-lion': '52% 37%',
  'african-wild-dog': '50% 40%',
  giraffe: '52% 30%',
  'greater-kudu': '50% 34%',
  leopard: '52% 38%',
  porcupine: '52% 42%',
  'southern-bushbuck': '50% 35%',
  'spotted-hyena': '50% 38%',
  waterbuck: '50% 34%',
  zebra: '50% 38%',
}

export function MammalCard({ mammal, onSelect, returnTo }: MammalCardProps) {
  return (
    <Link className={styles.card} onClick={onSelect} state={{ returnTo }} to={`/parks/kruger/mammals/${mammal.id}`}>
      <MammalImage
        className={styles.image}
        loading="lazy"
        mammal={mammal}
        style={{ '--image-position': imagePositions[mammal.id] ?? '50% 42%' } as CSSProperties}
      />
      <span className={styles.copy}>
        <strong>{mammal.commonName}</strong>
        {mammal.scientificName ? <em>{mammal.scientificName}</em> : null}
        {mammal.categories[0] ? <span>{mammal.categories[0].replace('-', ' ')}</span> : null}
      </span>
      <span aria-hidden="true" className={styles.chevron} />
    </Link>
  )
}
