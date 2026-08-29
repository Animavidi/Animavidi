import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { MammalImage } from '@/features/mammals/components/MammalImage/MammalImage'
import { useMammalPhotoContext } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'
import { mammals } from '@/features/mammals/model/mammals'
import { getMammalPrimaryImage } from '@/assets/mammals/mammalPrimaryImages'

import { PageHeading } from './AdminHomePage'
import styles from './Admin.module.css'

type PhotoFilter = 'all' | 'added' | 'missing'

export function AdminAnimalsPage() {
  const { error, loading, manifest } = useMammalPhotoContext()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PhotoFilter>('all')
  const totalPhotos = mammals.filter((mammal) => manifest[mammal.id] || getMammalPrimaryImage(mammal.id)).length
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    return mammals.filter((mammal) => {
      const hasPhoto = Boolean(manifest[mammal.id] || getMammalPrimaryImage(mammal.id))
      return (filter === 'all' || (filter === 'added' ? hasPhoto : !hasPhoto)) && (!normalized || [mammal.commonName, mammal.scientificName, mammal.officialCommonName, ...mammal.aliases].join(' ').toLocaleLowerCase().includes(normalized))
    }).slice().sort((left, right) => left.sortName.localeCompare(right.sortName) || left.commonName.localeCompare(right.commonName))
  }, [filter, manifest, query])

  return <main className={styles.adminPage}><PageHeading eyebrow="Content · Animals" title="Animals" copy="Manage primary photography without changing the approved 148-species dataset." />
    <div className={styles.listSummary}><strong>{totalPhotos} of {mammals.length} photos added</strong><button disabled title="Adding species will be available in a future release" type="button">Add animal <small>Coming later</small></button></div>
    {loading ? <p role="status">Checking R2 photo overrides…</p> : null}{error ? <p className={styles.notice} role="status">R2 is unavailable. Packaged photos remain visible; remote status may be incomplete.</p> : null}
    <div className={styles.listTools}><label><span className="srOnly">Search animals</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search name, scientific name or alias…" type="search" value={query} /></label><div aria-label="Photo status" className={styles.filters}>{(['all', 'missing', 'added'] as const).map((value) => <button aria-pressed={filter === value} key={value} onClick={() => setFilter(value)} type="button">{value === 'all' ? 'All' : value === 'missing' ? 'Missing photo' : 'Photo added'}</button>)}</div></div>
    <p className={styles.resultCount} role="status">{visible.length} animal{visible.length === 1 ? '' : 's'}</p>
    {visible.length ? <div className={styles.animalList}>{visible.map((mammal) => { const hasPhoto = Boolean(manifest[mammal.id] || getMammalPrimaryImage(mammal.id)); return <Link key={mammal.id} to={`/admin/content/animals/${mammal.id}`}><MammalImage mammal={mammal} /><span><strong>{mammal.commonName}</strong><em>{mammal.scientificName}</em></span><small className={hasPhoto ? styles.photoAdded : styles.photoMissing}>{hasPhoto ? 'Photo added' : 'Missing photo'}</small><i aria-hidden="true">›</i></Link> })}</div> : <div className={styles.emptyState}><h2>No animals found</h2><p>Clear the search or choose another photo filter.</p><button onClick={() => { setQuery(''); setFilter('all') }} type="button">Clear filters</button></div>}
  </main>
}
