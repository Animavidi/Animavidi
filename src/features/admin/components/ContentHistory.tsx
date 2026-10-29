import { useState } from 'react'
import type { ContentHistoryItem, ManagedContent } from '@/features/content/model/content'
import { fetchContentHistory, saveManagedContent } from '../services/adminApi'
import styles from '../routes/Admin.module.css'

export function ContentHistory({ kind, id, revision, onRestored }: { kind: ManagedContent['kind']; id: string; revision: string; onRestored: () => Promise<void> }) {
  const [items, setItems] = useState<ContentHistoryItem[]>([])
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function load(before?: number) {
    setBusy(true); setMessage('')
    try { const page = await fetchContentHistory(kind, id, before); setItems((previous) => before ? [...previous, ...page.items] : page.items); setNextCursor(page.nextCursor); setLoaded(true) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'History could not be loaded.') }
    finally { setBusy(false) }
  }
  async function restore(item: ContentHistoryItem) {
    setBusy(true); setMessage('')
    try { await saveManagedContent(item.content, revision); await onRestored() }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Restore failed.') }
    finally { setBusy(false) }
  }
  return <section className={styles.editor} aria-label="Revision history"><h2>Revision history</h2><p>Restoring saves a new revision and retains the current version in history. Route publication status is restored too.</p>
    <button type="button" disabled={busy || revision === 'new'} onClick={() => void load()}>Load revision history</button>
    {revision === 'new' ? <p>History starts after the first saved edit.</p> : null}
    {loaded && !items.length ? <p>No earlier revisions.</p> : null}
    {items.map((item) => <article key={item.historyId}><h3>{item.updatedAt}</h3><p>{item.content.kind === 'route' ? `${item.content.title} · ${item.content.published ? 'Published' : 'Draft'}` : item.content.introduction}</p><details><summary>Inspect saved fields</summary><pre className={styles.historyFields}>{JSON.stringify(item.content, null, 2)}</pre></details><button type="button" disabled={busy} onClick={() => void restore(item)}>Restore revision {item.historyId}</button></article>)}
    {nextCursor ? <button type="button" disabled={busy} onClick={() => void load(nextCursor)}>Load older revisions</button> : null}
    <p role="status">{busy ? 'Working…' : message}</p>
  </section>
}
