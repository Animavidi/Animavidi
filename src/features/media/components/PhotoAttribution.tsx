import { Link } from 'react-router-dom'
import credits from '@/assets/birds/photo-credits.json'
import type { Mammal } from '@/features/mammals/model/mammal'
import { useMammalPhoto } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'

type PhotoCredit = { author: string; license: string; licenseUrl: string; sourceUrl: string; changes: string }
const photoCredits: Readonly<Record<string, PhotoCredit>> = credits

export function PhotoAttribution({ animal }: { animal: Mammal }) {
  const photo = useMammalPhoto(animal)
  const credit = photoCredits[animal.id]
  if (!credit || photo.source !== 'local') return null
  return <p><small>Photo: <a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.author}</a> · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>. {credit.changes} <Link to="/photo-credits">Photo credits</Link></small></p>
}
