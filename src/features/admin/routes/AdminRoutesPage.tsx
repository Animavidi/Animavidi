import { useEffect, useState, type FormEvent } from 'react'
import { useContent } from '@/features/content/components/ContentProvider'
import type { SafariRoute } from '@/features/content/model/content'
import { safariRoutes } from '@/features/routes/data/safariRoutes'
import { saveManagedContent } from '../services/adminApi'
import { PageHeading } from './AdminHomePage'
import styles from './Admin.module.css'
import { ContentHistory } from '../components/ContentHistory'

export function AdminRoutesPage() {
  const { entries, refresh, loading, error } = useContent()
  const [selected, setSelected] = useState(safariRoutes[0].id)
  useEffect(() => { void refresh() }, [refresh])
  const merged = new Map(safariRoutes.map((route) => [route.id, route]))
  for (const entry of Object.values(entries)) if (entry.content.kind === 'route') merged.set(entry.content.id, entry.content)
  const route = merged.get(selected)
  const revision = entries[`route/${selected}`]?.revision ?? 'new'
  return <main className={styles.adminPage}><PageHeading eyebrow="Content" title="Safari Routes" copy="Edit, publish and unpublish route guides. Changes retain a server-side revision history." />
    <div className={styles.listTools}><label>Choose a route<select value={selected} onChange={(event) => setSelected(event.target.value)}>{[...merged.values()].map((item) => <option key={item.id} value={item.id}>{item.title}{item.published ? '' : ' (draft)'}</option>)}<option value="__new__">Create new route</option></select></label></div>
    {loading ? <p role="status">Loading route content…</p> : error ? <p role="alert">{error}</p> : <RouteEditor key={`${selected}:${revision}`} initial={route} revision={revision} onSaved={async (id) => { await refresh(); setSelected(id) }} />}
  </main>
}

function RouteEditor({ initial, revision, onSaved }: { initial?: SafariRoute; revision: string; onSaved: (id: string) => Promise<void> }) {
  const [draft, setDraft] = useState<SafariRoute>(initial ?? { kind: 'route', id: '', title: '', region: 'south', start: '', end: '', roads: [], stops: [], description: '', sourceUrl: '', sourcePages: '', reviewedAt: new Date().toISOString().slice(0, 10), published: false })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    try { await saveManagedContent(draft, revision); await onSaved(draft.id) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Save failed.') }
    finally { setBusy(false) }
  }
  return <><form className={styles.editor} onSubmit={(event) => void save(event)}><h2>{initial ? 'Edit route' : 'New route'}</h2><label>Stable ID<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} value={draft.id} disabled={Boolean(initial) || busy} onChange={(event) => setDraft({ ...draft, id: event.target.value })} /></label>
    {([['title', 'Title'], ['start', 'Start'], ['end', 'End'], ['sourcePages', 'Brochure pages / source notes']] as const).map(([field, label]) => <label key={field}>{label}<input required maxLength={4000} value={draft[field]} disabled={busy} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} /></label>)}
    <label>Region<select value={draft.region} disabled={busy} onChange={(event) => setDraft({ ...draft, region: event.target.value as SafariRoute['region'] })}><option value="south">South</option><option value="central">Central</option><option value="north">North</option></select></label>
    <label>Signed roads (one per line)<textarea required rows={3} value={draft.roads.join('\n')} disabled={busy} onChange={(event) => setDraft({ ...draft, roads: event.target.value.split('\n') })} /></label>
    <label>Designated stops (one per line)<textarea rows={3} value={draft.stops.join('\n')} disabled={busy} onChange={(event) => setDraft({ ...draft, stops: event.target.value ? event.target.value.split('\n') : [] })} /></label>
    <label>Description<textarea required maxLength={4000} rows={6} value={draft.description} disabled={busy} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
    <label>Source URL<input required type="url" value={draft.sourceUrl} disabled={busy} onChange={(event) => setDraft({ ...draft, sourceUrl: event.target.value })} /></label>
    <label>Content checked<input required type="date" value={draft.reviewedAt} disabled={busy} onChange={(event) => setDraft({ ...draft, reviewedAt: event.target.value })} /></label>
    <label><input type="checkbox" checked={draft.published} disabled={busy} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} /> Publish in the public route library</label>
    <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save route'}</button>{error ? <p role="alert">{error}</p> : null}
  </form>{initial ? <ContentHistory kind="route" id={initial.id} revision={revision} onRestored={() => onSaved(initial.id)} /> : null}</>
}
