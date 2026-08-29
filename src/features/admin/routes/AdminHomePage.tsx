import { Link } from 'react-router-dom'

import styles from './Admin.module.css'

const futureModules = [
  ['Safari Routes', 'Plan and publish future guided safari experiences.'],
  ['Users', 'Manage future explorer accounts and access.'],
  ['Reports & Analytics', 'Understand content and safari engagement.'],
] as const

export function AdminHomePage() {
  return <main className={styles.adminPage}><PageHeading eyebrow="Administration" title="Good morning" copy="Manage Animavidi content from one focused workspace." />
    <section aria-labelledby="modules-title"><h2 id="modules-title">Admin modules</h2><div className={styles.moduleGrid}>
      <article className={styles.activeModule}><span aria-hidden="true">01</span><h3>Content</h3><p>Manage animals and their approved photography.</p><Link to="/admin/content">Open Content</Link></article>
      {futureModules.map(([title, copy], index) => <article className={styles.futureModule} key={title}><span aria-hidden="true">0{index + 2}</span><h3>{title}</h3><p>{copy}</p><small>Coming later</small></article>)}
    </div></section>
  </main>
}

export function PageHeading({ copy, eyebrow, title }: { copy: string; eyebrow: string; title: string }) {
  return <header className={styles.pageHeading}><p>{eyebrow}</p><h1>{title}</h1><span>{copy}</span></header>
}
