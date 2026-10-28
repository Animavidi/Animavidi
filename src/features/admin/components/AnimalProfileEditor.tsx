import { useState, type FormEvent } from 'react'
import { useContent } from '@/features/content/components/ContentProvider'
import type { AnimalEditorial } from '@/features/content/model/content'
import type { Mammal } from '@/features/mammals/model/mammal'
import { saveManagedContent } from '../services/adminApi'
import styles from '../routes/Admin.module.css'

export function AnimalProfileEditor({ animal }: { animal: Mammal }) {
  const { entries, loading, error, refresh } = useContent()
  const entry = entries[`animal/${animal.id}`]
  const initial: AnimalEditorial = entry?.content.kind === 'animal' ? entry.content : {
    kind: 'animal', id: animal.id, introduction: animal.profile.introduction,
    identificationFeatures: [...animal.profile.identificationFeatures], interestingFacts: [...animal.profile.interestingFacts],
    habitat: animal.profile.habitat, behaviour: animal.profile.behaviour, diet: animal.profile.diet,
    groupStructure: animal.profile.groupStructure, conservationStatus: animal.profile.conservationStatus,
    sourceUrl: animal.overviewSection === 'birds' ? 'https://www.sanparks.org/parks/kruger/explore/fauna-flora/birds/checklist' : '',
  }
  if (loading) return <p role="status">Loading editorial content…</p>
  if (error) return <div role="alert"><p>{error}</p><button type="button" onClick={() => void refresh()}>Retry loading content</button></div>
  return <ProfileForm key={`${animal.id}:${entry?.revision ?? 'new'}`} initial={initial} revision={entry?.revision ?? 'new'} refresh={refresh} />
}

function ProfileForm({ initial, revision, refresh }: { initial: AnimalEditorial; revision: string; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('')
    try { await saveManagedContent(draft, revision); setMessage('Profile saved.'); await refresh() }
    catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Saving failed.') }
    finally { setBusy(false) }
  }
  const fields = [['introduction', 'Introduction'], ['habitat', 'Habitat'], ['behaviour', 'Behaviour'], ['diet', 'Diet'], ['groupStructure', 'Group structure'], ['conservationStatus', 'Conservation status']] as const
  return <form className={styles.editor} onSubmit={(event) => void save(event)}><h2>Animal profile</h2><p>Changes are stored on the server. Stable species IDs and existing sightings are preserved.</p>
    {fields.map(([field, label]) => <label key={field}>{label}<textarea maxLength={4000} rows={field === 'introduction' ? 5 : 3} value={draft[field]} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} disabled={busy} /></label>)}
    {([['identificationFeatures', 'Identification features'], ['interestingFacts', 'Interesting facts']] as const).map(([field, label]) => <label key={field}>{label} (one per line)<textarea rows={4} value={draft[field].join('\n')} onChange={(event) => setDraft({ ...draft, [field]: event.target.value.split('\n') })} disabled={busy} /></label>)}
    <label>Source URL<input type="url" required value={draft.sourceUrl} onChange={(event) => setDraft({ ...draft, sourceUrl: event.target.value })} disabled={busy} /></label>
    <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button><p role="status">{message}</p>
  </form>
}
