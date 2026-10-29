/* eslint-disable react-refresh/only-export-components -- Colocated content context and hooks. */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { getAdminApiBaseUrl } from '@/features/mammals/services/mammalPhotoApi'
import { isContentManifest, type ContentManifest } from '../model/content'

type ContentContextValue = { entries: ContentManifest; error: string; loading: boolean; refresh: () => Promise<void> }
const ContentContext = createContext<ContentContextValue | undefined>(undefined)
export function ContentProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ContentManifest>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    const base = getAdminApiBaseUrl()
    if (!base) { setLoading(false); return }
    try {
      const response = await fetch(`${base}${window.location.pathname.startsWith('/admin') ? '/api/admin/content' : '/api/content'}`, { signal, credentials: window.location.pathname.startsWith('/admin') ? 'include' : 'omit' })
      if (!response.ok) throw new Error('Content service unavailable. Showing packaged content.')
      const data: unknown = await response.json()
      if (!isContentManifest(data)) throw new Error('Invalid content response. Showing packaged content.')
      if (!signal?.aborted) { setEntries(data); setError('') }
    } catch (reason) { if (!signal?.aborted) setError(reason instanceof Error ? reason.message : 'Content unavailable.') }
    finally { if (!signal?.aborted) setLoading(false) }
  }, [])
  useEffect(() => { const controller = new AbortController(); void refresh(controller.signal); return () => controller.abort() }, [refresh])
  return <ContentContext.Provider value={{ entries, error, loading, refresh }}>{children}</ContentContext.Provider>
}
export function useContent() {
  const context = useContext(ContentContext)
  if (!context) throw new Error('ContentProvider is required')
  return context
}
