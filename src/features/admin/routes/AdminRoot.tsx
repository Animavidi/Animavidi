import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { AdminAuthProvider, useAdminAuth } from '@/features/admin/components/AdminAuthProvider'

export function AdminRoot() {
  return <AdminAuthProvider><Outlet /></AdminAuthProvider>
}

export function AdminProtectedRoute() {
  const auth = useAdminAuth()
  const location = useLocation()
  if (auth.loading) return <main aria-busy="true"><p role="status">Checking administrator session…</p></main>
  if (!auth.session) return <Navigate replace state={{ from: location.pathname }} to="/admin/login" />
  return <Outlet />
}
