import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAnimalPrimaryImage } from '@/assets/wildlife/animalPrimaryImages'
import { photoCredits } from '@/assets/wildlife/photoCredits'
import { useContent } from '@/features/content/components/ContentProvider'
import { sourcedAnimalProfiles } from '@/features/content/data/sourcedAnimalProfiles'
import { useMammalPhotoContext } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'
import { wildlife } from '@/features/mammals/model/mammals'
import { safariRoutes } from '@/features/routes/data/safariRoutes'
import { PageHeading } from './AdminHomePage'
import styles from './Admin.module.css'

const recordedCredits: Readonly<Record<string, unknown>> = photoCredits
export function AdminReportsPage() {
  const content = useContent(), photos = useMammalPhotoContext()
  const [query, setQuery] = useState('')
  const [missingOnly, setMissingOnly] = useState(true)
  const rows = useMemo(() => wildlife.map((animal) => {
    const managed = content.entries[`animal/${animal.id}`]?.content
    const profile = managed?.kind === 'animal' ? managed : animal.profile
    const fields = ['introduction', 'habitat', 'behaviour', 'diet', 'groupStructure', 'conservationStatus'] as const
    const missing = fields.filter((field) => !profile[field].trim())
    const image = photos.manifest[animal.id] ? 'R2 override (rights review required)' : getAnimalPrimaryImage(animal.id) ? 'Packaged' : 'Missing'
    const attribution = image === 'Packaged' && recordedCredits[animal.id] ? 'Recorded' : 'Review required'
    const source = managed?.kind === 'animal' ? managed.sourceUrl : sourcedAnimalProfiles[animal.id]?.content.sourceUrl ?? ''
    const completeFields = !missing.length && profile.identificationFeatures.some((value) => value.trim()) && profile.interestingFacts.some((value) => value.trim())
    return { id: animal.id, name: animal.commonName, image, attribution, missing: [...missing, ...(!profile.identificationFeatures.some((value) => value.trim()) ? ['identificationFeatures'] : []), ...(!profile.interestingFacts.some((value) => value.trim()) ? ['interestingFacts'] : [])], source, completeFields }
  }), [content.entries, photos.manifest])
  const visible = rows.filter((row) => (!missingOnly || row.image === 'Missing' || !row.completeFields || !row.source || row.attribution !== 'Recorded') && `${row.id} ${row.name}`.toLowerCase().includes(query.trim().toLowerCase()))
  const routes = new Map(safariRoutes.map((route) => [route.id, route]))
  for (const entry of Object.values(content.entries)) if (entry.content.kind === 'route') routes.set(entry.content.id, entry.content)
  function download() {
    const cell = (value: string) => `"${(/^[=+@-]/.test(value) ? "'" : '') + value.replaceAll('"', '""')}"`
    const lines = [['ID', 'Species', 'Photo', 'Attribution', 'Missing profile fields', 'Editorial source'], ...visible.map((row) => [row.id, row.name, row.image, row.attribution, row.missing.join('; '), row.source])]
    const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.map((line) => line.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = 'animavidi-content-report.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <main className={styles.adminPage}><PageHeading eyebrow="Administration" title="Content reports" copy="Review coverage and export the current content work queue." />
    <p>These counts describe available content records. Filled fields and recorded attribution still require factual and visual review.</p>
    {content.loading || photos.loading ? <p role="status">Refreshing coverage…</p> : null}
    {content.error || photos.error ? <p role="alert">Some services are unavailable. Packaged data is shown; remote coverage is incomplete. {content.error}</p> : null}
    <section className={styles.reportMetrics} aria-label="Coverage totals"><article className={styles.activeModule}><h2>Species</h2><strong>{rows.length}</strong></article><article className={styles.activeModule}><h2>Missing photo</h2><strong>{rows.filter((row) => row.image === 'Missing').length}</strong></article><article className={styles.activeModule}><h2>Incomplete profile fields</h2><strong>{rows.filter((row) => !row.completeFields).length}</strong></article><article className={styles.activeModule}><h2>Published routes</h2><strong>{[...routes.values()].filter((route) => route.published).length}</strong></article></section>
    <section className={styles.editor}><h2>Species work queue</h2><label>Search report<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label><input type="checkbox" checked={missingOnly} onChange={(event) => setMissingOnly(event.target.checked)} /> Show entries requiring review</label><p role="status">{visible.length} species in report</p><button type="button" onClick={download}>Download CSV report</button>
      <div className={styles.reportTable}><table><thead><tr><th>Species</th><th>Photo</th><th>Attribution</th><th>Missing profile fields</th><th>Source</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id}><td><Link to={`/admin/content/animals/${row.id}`}>{row.name}</Link></td><td>{row.image}</td><td>{row.attribution}</td><td>{row.missing.join(', ') || 'All fields filled; review required'}</td><td>{row.source ? <a href={row.source} target="_blank" rel="noreferrer">Editorial source</a> : 'Source review required'}</td></tr>)}</tbody></table></div>
    </section>
  </main>
}
