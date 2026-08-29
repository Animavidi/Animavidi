/* eslint-disable react-refresh/only-export-components -- Provider and its colocated hook form one private feature boundary. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { getAdminSession, loginAdmin, logoutAdmin, type AdminSession } from '@/features/admin/services/adminApi'

type AuthContextValue = {
  readonly error: string
  readonly loading: boolean
  readonly login: (username: string, password: string) => Promise<void>
  readonly logout: () => Promise<void>
  readonly session?: AdminSession
}

const AdminAuthContext = createContext<AuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    void getAdminSession(controller.signal).then(setSession).catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      setError(reason instanceof Error ? reason.message : 'Admin service unavailable.')
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  const login = useCallback(async (username: string, password: string) => { setError(''); setSession(await loginAdmin(username, password)) }, [])
  const logout = useCallback(async () => { await logoutAdmin(); setSession(undefined) }, [])
  const value = useMemo<AuthContextValue>(() => ({ error, loading, login, logout, session }), [error, loading, login, logout, session])
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AuthContextValue {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return context
}
