/* eslint-disable react-refresh/only-export-components -- Catalogue provider and hook. */
import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { getAdminApiBaseUrl } from '@/features/mammals/services/mammalPhotoApi'
import { getWildlifeSnapshot, registerApprovedBirds, subscribeWildlife } from '@/features/mammals/model/mammals'
import { isPublishedBird, type PublishedBird } from '../model/communityBird'

const key = 'animavidi.approvedBirdCatalogue.v1'
const CatalogueContext = createContext<{ refresh: () => Promise<void>; error: string; loading: boolean }>({ refresh: async () => {}, error: '', loading: true })
export const useWildlifeCatalogue = () => useSyncExternalStore(subscribeWildlife,getWildlifeSnapshot,getWildlifeSnapshot)
export const useBirdCatalogue = () => useContext(CatalogueContext)
export function BirdCatalogueProvider({ children }: { children: ReactNode }) {
  const generation = useRef(0)
  const [loading,setLoading] = useState(true), [error,setError] = useState('')
  const refresh = useCallback(async () => {
    const requestGeneration = ++generation.current
    const base = getAdminApiBaseUrl()
    if (!base) { setError('Community birds are unavailable. The packaged checklist is available.'); setLoading(false); return }
    try {
      const entries: PublishedBird[] = []; let cursor: number | null = null
      do {
        const response = await fetch(`${base}/api/birds${cursor === null ? '' : `?after=${cursor}`}`, { signal: AbortSignal.timeout(15000) })
        if (!response.ok) throw new Error('Community birds are temporarily unavailable. Showing the last available catalogue.')
        const data: unknown = await response.json()
        if (!data || typeof data !== 'object' || !('birds' in data) || !Array.isArray(data.birds) || !data.birds.every(isPublishedBird) || !('nextCursor' in data) || !(data.nextCursor === null || (typeof data.nextCursor === 'number' && Number.isSafeInteger(data.nextCursor) && data.nextCursor > (cursor ?? 0)))) throw new Error('Invalid bird catalogue response.')
        entries.push(...data.birds); cursor = data.nextCursor
      } while (cursor !== null)
      if (requestGeneration !== generation.current) return
      registerApprovedBirds(entries)
      try { localStorage.setItem(key,JSON.stringify(entries)) } catch { /* Public-cache storage is optional. */ }
      setError('')
    } catch (reason) { if (requestGeneration === generation.current) setError(reason instanceof Error ? reason.message : 'Community birds unavailable.') }
    finally { if (requestGeneration === generation.current) setLoading(false) }
  },[])
  useEffect(() => {
    try { const cached: unknown = JSON.parse(localStorage.getItem(key) ?? '[]'); if (Array.isArray(cached) && cached.every(isPublishedBird)) registerApprovedBirds(cached) } catch { /* Malformed caches never replace packaged species. */ }
    void refresh()
    const onFocus = () => { void refresh() }
    window.addEventListener('focus',onFocus)
    const interval = window.setInterval(() => { if(document.visibilityState === 'visible') void refresh() },30000)
    return () => { window.removeEventListener('focus',onFocus); window.clearInterval(interval) }
  },[refresh])
  // Initial catalogue resolution precedes route loaders, so direct community
  // detail/sighting/Passport URLs resolve after reload, including offline cache.
  return <CatalogueContext.Provider value={{ refresh,error,loading }}>{loading ? <p role="status">Opening bird catalogue…</p> : children}</CatalogueContext.Provider>
}
