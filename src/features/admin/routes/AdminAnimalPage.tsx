import { useRef, useState, type ChangeEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getMammalPrimaryImage } from '@/assets/mammals/mammalPrimaryImages'
import { MammalImage } from '@/features/mammals/components/MammalImage/MammalImage'
import { useMammalPhotoContext } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'
import { findMammal } from '@/features/mammals/model/mammals'
import { AdminApiError, deleteMammalPhoto, uploadMammalPhoto } from '@/features/admin/services/adminApi'
import { prepareAdminPhoto } from '@/features/admin/services/prepareAdminPhoto'
import { getSightingAchievementTier } from '@/features/achievements/config/sightingAchievementTiers'

import styles from './Admin.module.css'

export function AdminAnimalPage() {
  const { mammalId = '' } = useParams()
  const mammal = findMammal(mammalId)
  const { manifest, refresh } = useMammalPhotoContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  if (!mammal) return <main className={styles.adminPage}><div className={styles.emptyState}><h1>Animal not found</h1><p>This ID is not part of the approved Kruger checklist.</p><Link to="/admin/content/animals">Return to Animals</Link></div></main>
  const currentMammal = mammal
  const remotePhoto = manifest[mammal.id]
  const packagedPhoto = Boolean(getMammalPrimaryImage(mammal.id))
  const tier = getSightingAchievementTier(mammal.id)

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setBusy(true); setError(''); setMessage('Preparing photo…')
    try {
      const prepared = await prepareAdminPhoto(file)
      setMessage('Uploading photo…')
      await uploadMammalPhoto(currentMammal.id, prepared)
      await refresh()
      setMessage(remotePhoto ? 'Photo replaced successfully.' : 'Photo added successfully.')
    } catch (reason) { if (reason instanceof AdminApiError && reason.status === 401) { window.location.assign('/admin/login'); return }; setMessage(''); setError(reason instanceof Error ? reason.message : 'The photo could not be uploaded.') }
    finally { setBusy(false) }
  }

  async function remove() {
    if (!remotePhoto || !window.confirm(`Remove the R2 photo override for ${currentMammal.commonName}? ${packagedPhoto ? 'The packaged photo will be shown again.' : 'The neutral fallback will be shown.'}`)) return
    setBusy(true); setError(''); setMessage('Removing photo…')
    try { await deleteMammalPhoto(currentMammal.id); await refresh(); setMessage(packagedPhoto ? 'Override removed. The packaged photo is active again.' : 'Photo removed. The neutral fallback is active.') }
    catch (reason) { if (reason instanceof AdminApiError && reason.status === 401) { window.location.assign('/admin/login'); return }; setMessage(''); setError(reason instanceof Error ? reason.message : 'The photo could not be removed.') }
    finally { setBusy(false) }
  }

  return <main className={styles.adminPage}>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link to="/admin/content/animals">Animals</Link><span aria-hidden="true">/</span><span>{mammal.commonName}</span></nav>
    <header className={styles.editHeading}><div><p>Edit animal</p><h1>{mammal.commonName}</h1><span>{mammal.scientificName}</span></div><span className={remotePhoto || packagedPhoto ? styles.photoAdded : styles.photoMissing}>{remotePhoto ? 'R2 photo active' : packagedPhoto ? 'Packaged photo active' : 'Missing photo'}</span></header>
    <div className={styles.editGrid}>
      <section aria-labelledby="media-title" className={styles.mediaPanel}><div><p>Media</p><h2 id="media-title">Primary photograph</h2></div><MammalImage mammal={mammal} /><p>{remotePhoto ? 'This R2 photo overrides the packaged image everywhere in Animavidi.' : packagedPhoto ? 'The original packaged demo image is currently used.' : 'The shared neutral Animavidi fallback is currently used.'}</p>
        <input accept="image/jpeg,image/png,image/webp" aria-hidden="true" className="srOnly" onChange={(event) => void upload(event)} ref={inputRef} tabIndex={-1} type="file" />
        <div className={styles.mediaActions}><button disabled={busy} onClick={() => inputRef.current?.click()} type="button">{remotePhoto || packagedPhoto ? 'Replace photo' : 'Add photo'}</button>{remotePhoto ? <button className={styles.removeButton} disabled={busy} onClick={() => void remove()} type="button">Remove R2 photo</button> : null}</div>
        <small>JPEG, PNG or WebP · maximum 10 MB · prepared as WebP up to 1600 px on the longest side.</small>
        {message ? <p className={styles.successMessage} role="status">{message}</p> : null}{error ? <p className={styles.formError} role="alert">{error}</p> : null}
      </section>
      <aside className={styles.readOnlyPanel}><div><p>Animal</p><h2>Approved dataset</h2></div><dl>
        <ReadOnly label="Name" value={mammal.commonName} /><ReadOnly label="Scientific name" value={mammal.scientificName} /><ReadOnly label="Official/common name" value={mammal.officialCommonName} /><ReadOnly label="Aliases" value={mammal.aliases.join(', ') || 'None'} /><ReadOnly label="Group" value={mammal.overviewSection === 'main' ? 'Main Mammal' : `Small Mammal · ${mammal.smallMammalGroup?.replace('-', ' & ')}`} /><ReadOnly label="Achievement tier" value={tier.charAt(0).toUpperCase() + tier.slice(1)} /><ReadOnly label="Stable ID" value={mammal.id} />
      </dl><p>These fields remain read-only in ANI-024. Text editing will use a future approved content source.</p></aside>
    </div>
  </main>
}

function ReadOnly({ label, value }: { label: string; value: string }) { return <div><dt>{label}</dt><dd>{value}</dd></div> }
