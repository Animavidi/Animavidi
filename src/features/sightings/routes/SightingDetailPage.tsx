import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { AppLogo } from '@/components/AppLogo/AppLogo'
import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import { animalDetailImagePositions } from '@/features/mammals/config/animalDetailImagePositions'
import { findMammal } from '@/features/mammals/model/mammals'
import { SightingIcon } from '@/features/sightings/components/SightingIcon/SightingIcon'
import { SightingImage } from '@/features/sightings/components/SightingImage/SightingImage'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'
import type { Sighting, SightingPhoto } from '@/features/sightings/model/sighting'

import styles from './SightingsPages.module.css'

function readable(value: string) { return value ? value.replaceAll('-', ' ') : 'Not recorded' }

export function SightingDetailPage() {
  const navigate = useNavigate()
  const { sightingId = '' } = useParams()
  const [sighting, setSighting] = useState<Sighting>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [openPhoto, setOpenPhoto] = useState<SightingPhoto>()

  useEffect(() => {
    let current = true
    void sightingRepository.getById(sightingId).then((record) => { if (current) { setSighting(record); setIsLoading(false) } }).catch(() => { if (current) { setError('This journal entry could not be opened.'); setIsLoading(false) } })
    return () => { current = false }
  }, [sightingId])

  async function deleteSighting() {
    if (!window.confirm('Delete this sighting permanently from this browser?')) return
    try { await sightingRepository.delete(sightingId); void navigate('/parks/kruger/sightings?deleted=1', { replace: true }) }
    catch { setError('This sighting could not be deleted.') }
  }

  if (isLoading) return <main className={styles.page}><p aria-live="polite" className={styles.state}>Opening journal entry…</p></main>
  if (!sighting) return <main className={styles.page}><p className={styles.state}>{error || 'This sighting no longer exists.'}</p><Link className={styles.primaryAction} to="/parks/kruger/sightings">Return to My Sightings</Link></main>
  const mammal = findMammal(sighting.animalId)
  const crop = mammal ? animalDetailImagePositions[mammal.id] : undefined
  const remainingPhotos = sighting.photos.slice(1)

  return <main className={styles.page}>
    <header className={styles.detailHero}>
      <SightingImage className={styles.detailHeroImage} mammal={mammal} objectPosition={crop} photo={sighting.photos[0]} />
      <Link aria-label="Back to My Sightings" className={styles.back} to="/parks/kruger/sightings"><span /></Link>
      <Link aria-label="Animavidi welcome" className={styles.detailLogo} to="/"><AppLogo /></Link>
      <div className={styles.detailHeroCopy}><p>{sighting.date} · {sighting.time}</p><h1>{mammal?.commonName ?? 'Unknown species'}</h1><em>{mammal?.scientificName ?? 'Species record unavailable'}</em></div>
    </header>
    <article className={styles.content}>
      {error ? <p className={styles.state} role="alert">{error}</p> : null}
      <section aria-label="Sighting summary" className={styles.detailGrid}>
        <div><SightingIcon name="location" /><span>Location</span><strong>{sighting.location || 'Not recorded'}</strong></div>
        <div><SightingIcon name="count" /><span>Number seen</span><strong>{sighting.count}</strong></div>
        <div><SightingIcon name="composition" /><span>Composition</span><strong>{readable(sighting.composition)}</strong></div>
        <div><SightingIcon name="behaviour" /><span>Behaviour</span><strong>{readable(sighting.behaviour)}</strong></div>
      </section>
      {sighting.notes ? <section className={styles.journalNote}><p>Personal field note</p><h2>Your notes</h2><blockquote>{sighting.notes}</blockquote></section> : null}
      {remainingPhotos.length ? <section className={styles.gallery}><div><p>More from this encounter</p><h2>Photographs</h2></div><div>{remainingPhotos.map((photo) => <button aria-label={`Open ${photo.name}`} key={photo.id} onClick={() => setOpenPhoto(photo)} type="button"><SightingImage mammal={mammal} photo={photo} /></button>)}</div></section> : null}
      <div className={styles.actions}><Link to={`/parks/kruger/sightings/${sighting.id}/edit`}>Edit sighting</Link><button onClick={() => void deleteSighting()} type="button">Delete sighting</button></div>
      <SponsorFooter tone="light" />
    </article>
    <MammalsBottomNav active="sightings" />
    {openPhoto ? <section aria-label="Photo preview" aria-modal="true" className={styles.lightbox} role="dialog"><button aria-label="Close photo preview" onClick={() => setOpenPhoto(undefined)} type="button">×</button><SightingImage mammal={mammal} photo={openPhoto} /></section> : null}
  </main>
}
