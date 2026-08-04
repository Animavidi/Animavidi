import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import { findMammal } from '@/features/mammals/model/mammals'
import { SightingIcon } from '@/features/sightings/components/SightingIcon/SightingIcon'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'
import type { Sighting, SightingBehaviour, SightingComposition } from '@/features/sightings/model/sighting'

import styles from './SightingsPages.module.css'

const compositions: readonly SightingComposition[] = ['unknown', 'single', 'pair', 'family-group', 'group', 'male', 'female-with-young']
const behaviours: readonly SightingBehaviour[] = ['resting', 'walking', 'feeding', 'drinking', 'hunting', 'playing', 'calling', 'other']

export function EditSightingPage() {
  const navigate = useNavigate()
  const { sightingId = '' } = useParams()
  const [sighting, setSighting] = useState<Sighting>()
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { let current = true; void sightingRepository.getById(sightingId).then((record) => { if (current) setSighting(record) }).catch(() => { if (current) setError('This sighting could not be opened.') }); return () => { current = false } }, [sightingId])
  function update<K extends keyof Sighting>(key: K, value: Sighting[K]) { setSighting((current) => current ? { ...current, [key]: value } : current) }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!sighting || !sighting.date || !sighting.time || !sighting.location.trim()) { setError('Date, time and location are required.'); return }
    setIsSaving(true); setError('')
    try {
      await sightingRepository.update({ animalId: sighting.animalId, behaviour: sighting.behaviour, composition: sighting.composition, count: Math.max(1, sighting.count), date: sighting.date, id: sighting.id, location: sighting.location.trim(), notes: sighting.notes.trim(), parkId: sighting.parkId, photos: sighting.photos, time: sighting.time })
      void navigate(`/parks/kruger/sightings/${sighting.id}?updated=1`, { replace: true })
    } catch { setError('Your changes could not be saved.'); setIsSaving(false) }
  }

  if (!sighting) return <main className={styles.page}><p className={styles.state}>{error || 'Opening sighting…'}</p></main>
  const mammal = findMammal(sighting.animalId)
  return <main className={styles.page}>
    <header className={styles.header}><Link aria-label="Cancel editing" className={styles.back} to={`/parks/kruger/sightings/${sighting.id}`}><span /></Link><div><p>Safari memory</p><h1>Edit sighting</h1><strong>{mammal?.commonName ?? 'Unknown species'}</strong></div></header>
    <form className={styles.editForm} onSubmit={(event) => void save(event)}>
      <section className={styles.editSection}><div className={styles.editSectionHeading}><SightingIcon name="calendar" /><h2>When &amp; where</h2></div><div className={styles.filterGrid}><label><span>Date</span><input onChange={(event) => update('date', event.target.value)} required type="date" value={sighting.date} /></label><label><span>Time</span><input onChange={(event) => update('time', event.target.value)} required type="time" value={sighting.time} /></label></div><label><span>Location</span><input onChange={(event) => update('location', event.target.value)} required value={sighting.location} /></label></section>
      <section className={styles.editSection}><div className={styles.editSectionHeading}><SightingIcon name="behaviour" /><h2>What happened</h2></div><div className={styles.editCounter}><span>Number seen</span><div><button aria-label="Decrease number seen" disabled={sighting.count <= 1} onClick={() => update('count', Math.max(1, sighting.count - 1))} type="button">−</button><output>{sighting.count}</output><button aria-label="Increase number seen" onClick={() => update('count', sighting.count + 1)} type="button">+</button></div></div><label><span>Composition</span><select onChange={(event) => update('composition', event.target.value as SightingComposition)} value={sighting.composition}>{compositions.map((value) => <option key={value} value={value}>{value.replaceAll('-', ' ')}</option>)}</select></label><label><span>Behaviour</span><select onChange={(event) => update('behaviour', event.target.value as SightingBehaviour)} value={sighting.behaviour}>{behaviours.map((value) => <option key={value} value={value}>{value}</option>)}</select></label></section>
      <section className={styles.editSection}><div className={styles.editSectionHeading}><SightingIcon name="memory" /><h2>Your memory</h2></div><label><span>What made this sighting special?</span><textarea maxLength={500} onChange={(event) => update('notes', event.target.value)} rows={6} value={sighting.notes} /><small>{sighting.notes.length} of 500 characters</small></label></section>
      {error ? <p className={styles.state} role="alert">{error}</p> : null}<button className={styles.primaryButton} disabled={isSaving} type="submit">{isSaving ? 'Saving…' : 'Save changes'}</button><SponsorFooter tone="light" />
    </form><MammalsBottomNav active="sightings" />
  </main>
}
