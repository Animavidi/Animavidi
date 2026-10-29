import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { prepareAdminPhoto } from '@/features/admin/services/prepareAdminPhoto'
import { BirdDraftFields } from '../components/BirdDraftFields'
import { useWildlifeCatalogue } from '../components/BirdCatalogueProvider'
import { birdNameKey, type BirdDraft } from '../model/communityBird'
import { submitBird } from '../services/birdApi'
import styles from '@/features/admin/routes/Admin.module.css'
export function ProposeBirdPage() {
  const catalogue = useWildlifeCatalogue()
  const [params] = useSearchParams()
  const initial = catalogue.find((bird)=>bird.id===params.get('target') && bird.overviewSection==='birds')
  const [draft,setDraft] = useState<BirdDraft>({ commonName: initial?.commonName ?? '',scientificName: initial?.scientificName ?? '',description: '',sourceUrl: '',author: '',kind:initial ? 'information' : 'new',targetId:initial?.id })
  const [file,setFile] = useState<File>()
  const [busy,setBusy] = useState(false), [error,setError] = useState(''), [submitted,setSubmitted] = useState(false)
  const duplicate = (draft.kind ?? 'new') === 'new' && catalogue.find((bird) => bird.overviewSection === 'birds' && draft.commonName.trim() && birdNameKey(bird.commonName) === birdNameKey(draft.commonName))
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try { await submitBird(draft,file ? await prepareAdminPhoto(file) : undefined); setSubmitted(true) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Submission failed. Please retry.') } finally { setBusy(false) }
  }
  return <main className={`${styles.adminPage} ${styles.proposalPage}`}><Link to="/parks/kruger/birds">← Kruger birds</Link><h1>Suggest a bird</h1><p>Search the existing checklist first. A new bird becomes public only after administrator approval. Do not include personal information in the description.</p>
    {submitted ? <section role="status"><h2>Submitted for approval</h2><p>Your suggestion is awaiting review and is not public yet.</p><Link to="/parks/kruger/birds">Return to birds</Link></section> : <form className={styles.editor} onSubmit={(event) => void submit(event)}>
      <label>Contribution type<select value={draft.kind ?? 'new'} disabled={busy} onChange={(event)=>{ const kind=event.target.value as BirdDraft['kind']; const bird=catalogue.find((entry)=>entry.overviewSection==='birds'); setDraft({...draft,kind,targetId:kind==='new' ? undefined : bird?.id,commonName:kind==='new' ? '' : bird?.commonName ?? '',scientificName:kind==='new' ? '' : bird?.scientificName ?? ''}) }}><option value="new">Missing bird</option><option value="photo">Photo of an existing bird</option><option value="correction">Name correction</option><option value="information">Description or additional information</option></select></label>
      {draft.kind && draft.kind !== 'new' ? <label>Existing bird<select aria-label="Existing bird" required value={draft.targetId ?? ''} disabled={busy} onChange={(event)=>{ const bird=catalogue.find((entry)=>entry.id===event.target.value); setDraft({...draft,targetId:bird?.id,commonName:bird?.commonName ?? '',scientificName:bird?.scientificName ?? ''}) }}>{catalogue.filter((bird)=>bird.overviewSection==='birds').map((bird)=><option key={bird.id} value={bird.id}>{bird.commonName}</option>)}</select></label> : null}
      <label>Your public contributor name<input required minLength={2} maxLength={80} value={draft.author} disabled={busy} onChange={(event) => setDraft({ ...draft,author:event.target.value })} /></label><p>This name will be credited publicly after approval. Use a nickname if you prefer.</p><BirdDraftFields draft={draft} onChange={setDraft} disabled={busy} />
      <label>Photo (optional unless contributing a photo)<input type="file" accept="image/jpeg,image/png,image/webp" required={draft.kind==='photo'} disabled={busy} onChange={(event)=>setFile(event.target.files?.[0])} /></label>
      {file ? <label><input type="checkbox" required checked={draft.photoRights===true} disabled={busy} onChange={(event)=>setDraft({...draft,photoRights:event.target.checked})} />I took this photo and own its rights. If approved, I license it publicly under CC BY 4.0 with my contributor name credited. Photos are resized and location metadata is removed.</label> : null}
      {duplicate ? <p>This bird already exists: <Link to={`/parks/kruger/birds/${duplicate.id}`}>{duplicate.commonName}</Link>. Choose another contribution type to enrich it.</p> : null}<button disabled={busy || Boolean(duplicate)} type="submit">{busy ? 'Submitting…' : 'Submit for approval'}</button>{error ? <p role="alert">{error}</p> : null}</form>}
  </main>
}
