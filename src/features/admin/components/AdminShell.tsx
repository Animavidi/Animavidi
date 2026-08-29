import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAdminAuth } from './AdminAuthProvider'
import styles from '../routes/Admin.module.css'

export function AdminShell() {
  const auth = useAdminAuth()
  const navigate = useNavigate()
  const logout = async () => { await auth.logout(); void navigate('/admin/login', { replace: true }) }
  return <div className={styles.shell}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}><span aria-hidden="true">A</span><div><strong>Animavidi</strong><small>Content Admin</small></div></div>
      <nav aria-label="Admin navigation">
        <NavLink end to="/admin">Home</NavLink>
        <NavLink to="/admin/content">Content</NavLink>
        <span aria-disabled="true">Safari Routes <small>Coming later</small></span>
        <span aria-disabled="true">Users <small>Coming later</small></span>
        <span aria-disabled="true">Reports &amp; Analytics <small>Coming later</small></span>
      </nav>
      <div className={styles.identity}><span aria-hidden="true">A</span><div><strong>{auth.session?.administrator}</strong><small>Administrator</small></div><button onClick={() => void logout()} type="button">Log out</button></div>
    </aside>
    <div className={styles.workspace}><header className={styles.mobileHeader}><strong>Animavidi Admin</strong><button onClick={() => void logout()} type="button">Log out</button></header><Outlet /></div>
  </div>
}
