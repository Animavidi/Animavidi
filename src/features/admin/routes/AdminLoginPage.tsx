import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAdminAuth } from '@/features/admin/components/AdminAuthProvider'

import styles from './Admin.module.css'

export function AdminLoginPage() {
  const auth = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (auth.session) return <Navigate replace to="/admin" />
  const state = location.state as { from?: string } | null

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    try { await auth.login(username, password); void navigate(state?.from ?? '/admin', { replace: true }) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Login failed.') }
    finally { setBusy(false) }
  }

  return <main className={styles.loginPage}>
    <section aria-labelledby="admin-login-title" className={styles.loginCard}>
      <div className={styles.loginBrand}><span aria-hidden="true">A</span><p>Animavidi</p><small>Content Admin</small></div>
      <h1 id="admin-login-title">Administrator sign in</h1><p>Manage approved Animavidi wildlife media.</p>
      <form onSubmit={(event) => void submit(event)}>
        <label><span>Username</span><input autoComplete="username" onChange={(event) => setUsername(event.target.value)} required value={username} /></label>
        <label><span>Password</span><input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
        {error || auth.error ? <p className={styles.formError} role="alert">{error || auth.error}</p> : null}
        <button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </section>
  </main>
}
