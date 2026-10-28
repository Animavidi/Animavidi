import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '@/features/content/components/ContentProvider'
import type { SafariRoute } from '@/features/content/model/content'
import { safariRoutes } from '../data/safariRoutes'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import styles from './SafariRoutesPage.module.css'

export function SafariRoutesPage() {
  const { entries, error } = useContent()
  const [params, setParams] = useSearchParams()
  const region = params.get('region') ?? 'all'
  const merged = new Map(safariRoutes.map((route) => [route.id, route]))
  for (const entry of Object.values(entries)) if (entry.content.kind === 'route') merged.set(entry.content.id, entry.content)
  const routes: SafariRoute[] = [...merged.values()].filter((route) => route.published && (region === 'all' || route.region === region))
  return <main className={styles.page}><header><Link to="/parks/kruger">← Kruger National Park</Link><p>Explore at your own pace</p><h1>Safari Routes</h1><p>Plan a drive using signed park roads and designated stops.</p></header>
    <aside className={styles.notice}><strong>Before you drive</strong><p>These are planning guides, not live navigation. Confirm road closures and gate times with SANParks or camp reception today. Stay on open public roads and obey local signs. No GPS track or estimated arrival time is supplied.</p><a href="https://www.sanparks.org/parks/kruger/useful-information/notifications" target="_blank" rel="noreferrer">Check SANParks notices ↗</a></aside>
    {error ? <p role="status">Live route updates are unavailable. Packaged guides may be out of date; confirm with reception.</p> : null}
    <nav aria-label="Route region" className={styles.filters}>{['all', 'south', 'central', 'north'].map((value) => <button key={value} aria-pressed={region === value} onClick={() => { const next = new URLSearchParams(params); if (value === 'all') next.delete('region'); else next.set('region', value); void setParams(next, { replace: true }) }}>{value}</button>)}</nav>
    <div className={styles.grid}>{routes.map((route) => <article key={route.id}><span>{route.region} · {route.roads.join(' / ')}</span><h2>{route.title}</h2><p><strong>{route.start} → {route.end}</strong></p><p>{route.description}</p>{route.stops.length ? <><h3>Designated stops</h3><ul>{route.stops.map((stop) => <li key={stop}>{stop}</li>)}</ul></> : null}<footer><p>{route.sourcePages} · Content checked {route.reviewedAt}</p><a href={route.sourceUrl} target="_blank" rel="noreferrer">View source ↗</a><Link to="/parks/kruger/map">Open park map</Link></footer></article>)}</div>
    {!routes.length ? <p role="status">No published guides for this region yet. Choose another region.</p> : null}<MammalsBottomNav active="routes" />
  </main>
}
