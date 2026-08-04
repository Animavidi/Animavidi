import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { AppLogo } from '@/components/AppLogo/AppLogo'
import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import { animalDetailImagePositions } from '@/features/mammals/config/animalDetailImagePositions'
import { findMammal } from '@/features/mammals/model/mammals'
import { BigFiveCelebration, bigFiveCelebratedKey } from '@/features/passport/components/BigFiveCelebration/BigFiveCelebration'
import type { PassportSummary } from '@/features/passport/model/passport'
import { shouldCelebrateBigFive } from '@/features/passport/services/bigFiveCelebration'
import { loadPassport } from '@/features/passport/services/passportService'
import { SightingIcon } from '@/features/sightings/components/SightingIcon/SightingIcon'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'
import type { Sighting, SightingBehaviour, SightingComposition } from '@/features/sightings/model/sighting'

import styles from './NewSightingPage.module.css'

type PhotoDraft = { file: File; id: string; url: string }

function localDateAndTime() {
  const now = new Date()
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return { date: offsetDate.toISOString().slice(0, 10), time: offsetDate.toISOString().slice(11, 16) }
}

function animalPlural(commonName: string) {
  const base = commonName.replace(/^(African|Black|Chacma|Greater|Southern|Spotted|Vervet|White) /, '').toLocaleLowerCase()
  if (base === 'rhinoceros') return 'rhinoceroses'
  if (base === 'buffalo') return 'buffalo'
  if (base.endsWith('y')) return `${base.slice(0, -1)}ies`
  if (base.endsWith('s')) return base
  return `${base}s`
}

function categoryLabel(categories: readonly string[]) {
  return categories.length ? categories[0].replaceAll('-', ' ').toLocaleUpperCase() : 'KRUGER MAMMAL'
}

const compositionOptions: ReadonlyArray<{ label: string; value: SightingComposition }> = [
  { label: 'Unknown', value: 'unknown' }, { label: 'Single animal', value: 'single' }, { label: 'Pair', value: 'pair' },
  { label: 'Family group', value: 'family-group' }, { label: 'Group', value: 'group' }, { label: 'Male', value: 'male' },
  { label: 'Female with young', value: 'female-with-young' },
]

const behaviourOptions: ReadonlyArray<{ label: string; value: SightingBehaviour }> = [
  { label: 'Resting', value: 'resting' }, { label: 'Walking', value: 'walking' }, { label: 'Feeding', value: 'feeding' },
  { label: 'Drinking', value: 'drinking' }, { label: 'Hunting', value: 'hunting' }, { label: 'Playing', value: 'playing' },
  { label: 'Calling', value: 'calling' }, { label: 'Other', value: 'other' },
]

export function NewSightingPage() {
  const navigate = useNavigate()
  const { animalId = '' } = useParams()
  const mammal = findMammal(animalId)
  const defaults = localDateAndTime()
  const [date, setDate] = useState(defaults.date)
  const [time, setTime] = useState(defaults.time)
  const [location, setLocation] = useState('Kruger National Park')
  const [count, setCount] = useState(1)
  const [composition, setComposition] = useState<SightingComposition>('unknown')
  const [behaviour, setBehaviour] = useState<SightingBehaviour>('resting')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<PhotoDraft[]>([])
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedSighting, setSavedSighting] = useState<Sighting>()
  const [celebration, setCelebration] = useState<{ completionDate: string; passport: PassportSummary }>()

  if (!mammal) return <main className={styles.notFound}><p>Mammal not found.</p><Link to="/parks/kruger/mammals">Return to mammals</Link></main>
  const mammalId = mammal.id
  const isBigFive = mammal.categories.includes('big-five')

  function addPhotos(files: FileList | null) {
    if (!files) return
    const available = Math.max(0, 5 - photos.length)
    const next = Array.from(files).filter((file) => file.type.startsWith('image/')).slice(0, available).map((file) => ({ file, id: crypto.randomUUID(), url: URL.createObjectURL(file) }))
    setPhotos((current) => [...current, ...next])
    setError(files.length > available ? 'You can add up to 5 photos.' : '')
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const selected = current.find((photo) => photo.id === id)
      if (selected) URL.revokeObjectURL(selected.url)
      return current.filter((photo) => photo.id !== id)
    })
  }

  async function saveSighting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!date || !time || !location.trim()) { setError('Enter a date, time and location before saving.'); return }
    setIsSaving(true)
    setError('')
    let passportBefore: PassportSummary | undefined
    try { passportBefore = await loadPassport() } catch { /* Summary failures must never block the save. */ }
    try {
      const saved = await sightingRepository.create({ animalId: mammalId, behaviour, composition, count, date, location: location.trim(), notes: notes.trim(), parkId: 'kruger', photos: photos.map((photo) => ({ blob: photo.file, id: photo.id, name: photo.file.name, type: photo.file.type })), time })
      photos.forEach((photo) => URL.revokeObjectURL(photo.url))
      let showCelebration = false
      try {
        const alreadyCelebrated = localStorage.getItem(bigFiveCelebratedKey) === 'true'
        const beforeCount = passportBefore?.bigFive.filter((entry) => entry.seen).length
        if (beforeCount !== undefined && isBigFive && !alreadyCelebrated) {
          const passportAfter = await loadPassport()
          const afterCount = passportAfter.bigFive.filter((entry) => entry.seen).length
          if (shouldCelebrateBigFive({ afterCount, alreadyCelebrated, beforeCount, savedAnimalIsBigFive: isBigFive })) {
            setCelebration({ completionDate: saved.date, passport: passportAfter })
            showCelebration = true
          }
        }
      } catch { /* Preserve the normal confirmation after an aggregation failure. */ }
      if (!showCelebration) setSavedSighting(saved)
    } catch {
      setError('The sighting could not be saved locally. Please try again.')
      setIsSaving(false)
    }
  }

  return <main className={styles.page}>
    <header className={styles.speciesHero}>
      <img alt={mammal.imageAlt} className={styles.heroImage} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = mammal.imageFallback }} src={mammal.image} style={{ objectPosition: animalDetailImagePositions[mammal.id] }} />
      <Link aria-label={`Back to ${mammal.commonName}`} className={styles.back} to={`/parks/kruger/mammals/${mammal.id}`}><span aria-hidden="true" /></Link>
      <Link aria-label="Animavidi welcome" className={styles.logo} to="/"><AppLogo /></Link>
      <div className={styles.heroCopy}><p>{categoryLabel(mammal.categories)}</p><h1>New sighting</h1><strong>{mammal.commonName}</strong><em>{mammal.scientificName}</em></div>
    </header>

    <form className={styles.form} noValidate onSubmit={(event) => void saveSighting(event)}>
      <section aria-labelledby="when-where-heading" className={styles.formSection}>
        <div className={styles.sectionHeading}><span><SightingIcon name="calendar" /></span><div><p>01</p><h2 id="when-where-heading">When &amp; where</h2></div></div>
        <div className={styles.twoColumns}><label className={styles.field}><span>Date</span><input onChange={(event) => setDate(event.target.value)} required type="date" value={date} /></label><label className={styles.field}><span>Time</span><input onChange={(event) => setTime(event.target.value)} required type="time" value={time} /></label></div>
        <label className={styles.field}><span>Location</span><input aria-describedby={error && !location.trim() ? 'location-error' : 'location-help'} aria-invalid={Boolean(error && !location.trim())} maxLength={120} onChange={(event) => setLocation(event.target.value)} placeholder="For example Kruger National Park" required value={location} />{error && !location.trim() ? <small className={styles.fieldError} id="location-error" role="alert">Location is required.</small> : <small id="location-help">Location can be refined later.</small>}</label>
      </section>

      <section aria-labelledby="happened-heading" className={styles.formSection}>
        <div className={styles.sectionHeading}><span><SightingIcon name="behaviour" /></span><div><p>02</p><h2 id="happened-heading">What happened</h2></div></div>
        <div className={styles.counterField}><div><SightingIcon name="count" /><span>Number of {animalPlural(mammal.commonName)}</span></div><div className={styles.counterControl}><button aria-label="Decrease number of animals" disabled={count <= 1} onClick={() => setCount((current) => Math.max(1, current - 1))} type="button">−</button><output aria-live="polite">{count}</output><button aria-label="Increase number of animals" onClick={() => setCount((current) => current + 1)} type="button">+</button></div></div>
        <div className={styles.twoColumns}><label className={styles.field}><span>Composition</span><select onChange={(event) => setComposition(event.target.value as SightingComposition)} value={composition}>{compositionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className={styles.field}><span>Behaviour</span><select onChange={(event) => setBehaviour(event.target.value as SightingBehaviour)} value={behaviour}>{behaviourOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div>
      </section>

      <section aria-labelledby="memory-heading" className={styles.formSection}>
        <div className={styles.sectionHeading}><span><SightingIcon name="memory" /></span><div><p>03</p><h2 id="memory-heading">Your memory</h2></div></div>
        <label className={`${styles.field} ${styles.notesField}`}><span>What made this sighting special?</span><textarea maxLength={500} onChange={(event) => setNotes(event.target.value)} placeholder="Capture the moment in your own words…" rows={5} value={notes} /><small aria-live="polite">{notes.length} of 500 characters</small></label>
        <section className={styles.photosField} aria-labelledby="photo-heading"><label className={styles.photoButton}><SightingIcon name="camera" /><span id="photo-heading">Add your photographs</span><small>{photos.length} of 5 photos · Stored privately on this device</small><input accept="image/*" multiple onChange={(event) => addPhotos(event.target.files)} type="file" /></label>{photos.length ? <div className={styles.thumbnails}>{photos.map((photo) => <figure key={photo.id}><img alt={`Selected photo of ${mammal.commonName}: ${photo.file.name}`} src={photo.url} /><button aria-label={`Remove ${photo.file.name}`} onClick={() => removePhoto(photo.id)} type="button">×</button></figure>)}</div> : null}</section>
      </section>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <button className={styles.save} disabled={isSaving} type="submit">{isSaving ? 'Saving…' : 'Save sighting'}</button>
      <SponsorFooter tone="light" />
    </form>
    <MammalsBottomNav active="sightings" fixed />
    {celebration ? <BigFiveCelebration completionDate={celebration.completionDate} completedAnimalId={mammal.id} onContinue={() => void navigate('/parks/kruger')} onViewPassport={() => void navigate('/passport')} passport={celebration.passport} /> : null}
    {savedSighting ? <section aria-labelledby="saved-heading" aria-live="polite" className={styles.savedOverlay} role="dialog"><div className={styles.savedPanel}><span className={styles.savedMark}>✓</span><p>Saved to your Safari Passport</p><h2 id="saved-heading">A memory worth keeping</h2><dl><div><dt>Species</dt><dd>{mammal.commonName}</dd></div><div><dt>Encounter</dt><dd>{savedSighting.count} · {behaviourOptions.find((option) => option.value === savedSighting.behaviour)?.label}</dd></div><div><dt>Place</dt><dd>{savedSighting.location}</dd></div><div><dt>Date</dt><dd>{savedSighting.date} · {savedSighting.time}</dd></div></dl><button onClick={() => void navigate('/parks/kruger')} type="button">Continue safari</button><Link to={`/parks/kruger/sightings/${savedSighting.id}`}>View sighting</Link></div></section> : null}
  </main>
}
