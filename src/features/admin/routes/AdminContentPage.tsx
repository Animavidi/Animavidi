import { Link } from 'react-router-dom'
import { useWildlifeCatalogue } from '@/features/birds/components/BirdCatalogueProvider'

import { PageHeading } from './AdminHomePage'
import styles from './Admin.module.css'

export function AdminContentPage() {
  const animals = useWildlifeCatalogue()
  return <main className={styles.adminPage}><PageHeading eyebrow="Content" title="Content library" copy="Curate the trusted content shown across Animavidi." />
    <section aria-labelledby="libraries-title"><h2 id="libraries-title">Libraries</h2><article className={styles.libraryCard}><div><span aria-hidden="true">{animals.length}</span><h3>Animals</h3><p>Review Kruger’s mammal and bird checklists, approved community birds and primary photography.</p></div><Link to="/admin/content/animals">Manage animals</Link></article><Link to="/admin/bird-proposals">Review bird proposals</Link></section>
  </main>
}
