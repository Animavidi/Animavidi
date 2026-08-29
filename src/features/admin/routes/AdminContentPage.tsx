import { Link } from 'react-router-dom'

import { PageHeading } from './AdminHomePage'
import styles from './Admin.module.css'

export function AdminContentPage() {
  return <main className={styles.adminPage}><PageHeading eyebrow="Content" title="Content library" copy="Curate the trusted content shown across Animavidi." />
    <section aria-labelledby="libraries-title"><h2 id="libraries-title">Libraries</h2><article className={styles.libraryCard}><div><span aria-hidden="true">148</span><h3>Animals</h3><p>Review Kruger’s complete mammal checklist and manage primary photography.</p></div><Link to="/admin/content/animals">Manage animals</Link></article></section>
  </main>
}
