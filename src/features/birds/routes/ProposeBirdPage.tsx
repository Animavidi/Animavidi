import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BirdDraftFields } from '../components/BirdDraftFields'
import { useWildlifeCatalogue } from '../components/BirdCatalogueProvider'
import { birdNameKey, type BirdDraft } from '../model/communityBird'
import { submitBird } from '../services/birdApi'
import styles from '@/features/admin/routes/Admin.module.css'
export function ProposeBirdPage() {
  const catalogue = useWildlifeCatalogue()
  const [draft,setDraft] = useState<BirdDraft>({ commonName: '',scientificName: '',description: '',sourceUrl: '',author: '' })
  const [busy,setBusy] = useState(false), [error,setError] = useState(''), [submitted,setSubmitted] = useState(false)
  const duplicate = catalogue.find((bird) => bird.overviewSection === 'birds' && draft.commonName.trim() && birdNameKey(bird.commonName) === birdNameKey(draft.commonName))
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try { await submitBird(draft); setSubmitted(true) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Submission failed. Please retry.') } finally { setBusy(false) }
  }
  return <main className={`${styles.adminPage} ${styles.proposalPage}`}><Link to="/parks/kruger/birds">← Kruger birds</Link><h1>Suggest a bird</h1><p>Search the existing checklist first. A new bird becomes public only after administrator approval. Do not include personal information in the description.</p>
    {submitted ? <section role="status"><h2>Submitted for approval</h2><p>Your suggestion is awaiting review and is not public yet.</p><Link to="/parks/kruger/birds">Return to birds</Link></section> : <form className={styles.editor} onSubmit={(event) => void submit(event)}><label>Your public contributor name<input required minLength={2} maxLength={80} value={draft.author} disabled={busy} onChange={(event) => setDraft({ ...draft,author:event.target.value })} /></label><p>This name will be credited publicly after approval. Use a nickname if you prefer.</p><BirdDraftFields draft={draft} onChange={setDraft} disabled={busy} />{duplicate ? <p>This bird already exists: <Link to={`/parks/kruger/birds/${duplicate.id}`}>{duplicate.commonName}</Link>.</p> : null}<button disabled={busy || Boolean(duplicate)} type="submit">{busy ? 'Submitting…' : 'Submit for approval'}</button>{error ? <p role="alert">{error}</p> : null}</form>}
  </main>
}
