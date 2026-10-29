import { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import { BirdDraftFields } from '@/features/birds/components/BirdDraftFields'
import { useBirdCatalogue } from '@/features/birds/components/BirdCatalogueProvider'
import type { BirdProposal } from '@/features/birds/model/communityBird'
import { loadBirdProposals,reviewBird } from '@/features/birds/services/birdApi'
import { getAdminApiBaseUrl } from '@/features/mammals/services/mammalPhotoApi'
import styles from './Admin.module.css'
export function AdminBirdProposalsPage() {
  const [status,setStatus] = useState<BirdProposal['status']>('pending'), [items,setItems] = useState<BirdProposal[]>([]), [cursor,setCursor] = useState<number | null>(null)
  const [error,setError] = useState(''), [loading,setLoading] = useState(false)
  const catalogue = useBirdCatalogue()
  async function load(before?: number) {
    setLoading(true); setError('')
    try { const result = await loadBirdProposals(status,before); setItems((old) => before ? [...old,...result.items] : result.items); setCursor(result.nextCursor) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Queue unavailable.') } finally { setLoading(false) }
  }
  useEffect(() => { let current = true; setLoading(true); setItems([]); setCursor(null); setError(''); void loadBirdProposals(status).then((result) => { if(current) { setItems(result.items); setCursor(result.nextCursor) } }).catch((reason: unknown) => { if(current) setError(reason instanceof Error ? reason.message : 'Queue unavailable.') }).finally(() => { if(current) setLoading(false) }); return () => { current = false } },[status])
  return <main className={styles.adminPage}><h1>Bird proposals</h1><p>Review and edit suggestions before making them visible to everyone. Approval assigns a permanent species ID. Rejected suggestions remain private.</p><label>Review status<select value={status} onChange={(event) => setStatus(event.target.value as BirdProposal['status'])}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label><button type="button" disabled={loading} onClick={() => void load()}>Refresh proposals</button>
    {loading ? <p role="status">Loading proposals…</p> : null}{error ? <p role="alert">{error}</p> : null}{!loading && !error && !items.length ? <p>No {status} proposals.</p> : null}
    {items.map((item) => <ProposalEditor key={`${item.id}:${item.revision}`} proposal={item} onSaved={async () => { await catalogue.refresh(); await load() }} />)}
    {cursor ? <button type="button" disabled={loading} onClick={() => void load(cursor)}>Load older proposals</button> : null}
  </main>
}
function ProposalEditor({ proposal,onSaved }: { proposal: BirdProposal; onSaved: () => Promise<void> }) {
  const [draft,setDraft] = useState(proposal.draft), [note,setNote] = useState(proposal.reviewNote), [busy,setBusy] = useState(false), [error,setError] = useState('')
  async function review(action: 'save' | 'approve' | 'reject') { setBusy(true); setError(''); try { await reviewBird(proposal,draft,action,note); await onSaved() } catch (reason) { setError(reason instanceof Error ? reason.message : 'Review failed.') } finally { setBusy(false) } }
  return <section className={styles.editor} aria-label={`Proposal: ${proposal.draft.commonName}`}><h2>{proposal.draft.commonName}</h2><small>Submitted {proposal.createdAt} · {proposal.status}</small><BirdDraftFields draft={draft} onChange={setDraft} disabled={busy || proposal.status !== 'pending'} /><label>Private review note<textarea maxLength={1000} value={note} onChange={(event) => setNote(event.target.value)} disabled={busy || proposal.status !== 'pending'} /></label>
    <p>Type: {proposal.draft.kind ?? 'new'} · Original contributor: {proposal.draft.author ?? 'Anonymous contributor'}</p>
    {proposal.draft.targetId ? <p>Attached to species ID: {proposal.draft.targetId}. Approval adds credited community content; it preserves the official checklist name and ID.</p> : null}
    {proposal.draft.photoType ? <figure><img crossOrigin="use-credentials" style={{width:'100%',maxWidth:640,height:'auto'}} src={`${getAdminApiBaseUrl()}/api/admin/bird-proposals/${proposal.id}/photo`} alt="Photo submitted for species and rights review" /><figcaption>Contributor declared ownership and CC BY 4.0 permission. Verify the depicted species before approval; reject doubtful photos.</figcaption></figure> : null}
    {proposal.status === 'pending' ? <div className={styles.proposalActions}><button disabled={busy} type="button" onClick={() => void review('save')}>Save edits</button><button disabled={busy} type="button" onClick={() => void review('approve')}>Approve and publish bird</button><button disabled={busy} type="button" onClick={() => void review('reject')}>Reject proposal</button></div> : proposal.status === 'approved' ? <Link to={`/admin/content/animals/${proposal.draft.targetId ?? proposal.publishedId}`}>Manage approved bird</Link> : null}{error ? <p role="alert">{error}</p> : null}
  </section>
}
