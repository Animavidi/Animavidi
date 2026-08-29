/* eslint-disable react-refresh/only-export-components -- Provider and its colocated hooks share one photo-resolution boundary. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { getMammalPrimaryImage } from '@/assets/mammals/mammalPrimaryImages'
import type { Mammal } from '@/features/mammals/model/mammal'
import { fetchMammalPhotoManifest } from '@/features/mammals/services/mammalPhotoApi'
import { resolveMammalPhoto, type MammalPhotoManifest, type ResolvedMammalPhoto } from '@/features/mammals/services/mammalPhotoResolution'

type MammalPhotoContextValue = {
  readonly error: boolean
  readonly loading: boolean
  readonly manifest: MammalPhotoManifest
  readonly refresh: () => Promise<void>
}

const MammalPhotoContext = createContext<MammalPhotoContextValue | null>(null)

export function MammalPhotoProvider({ children }: { children: ReactNode }) {
  const [manifest, setManifest] = useState<MammalPhotoManifest>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      setManifest(await fetchMammalPhotoManifest(signal))
      setError(false)
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === 'AbortError') return
      setError(true)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  const value = useMemo<MammalPhotoContextValue>(() => ({ error, loading, manifest, refresh: () => load() }), [error, load, loading, manifest])
  return <MammalPhotoContext.Provider value={value}>{children}</MammalPhotoContext.Provider>
}

export function useMammalPhotoContext(): MammalPhotoContextValue {
  const context = useContext(MammalPhotoContext)
  if (!context) throw new Error('useMammalPhotoContext must be used within MammalPhotoProvider')
  return context
}

export function useMammalPhoto(mammal: Mammal): ResolvedMammalPhoto {
  const { manifest } = useMammalPhotoContext()
  return resolveMammalPhoto(getMammalPrimaryImage(mammal.id), mammal.imageFallback, manifest[mammal.id])
}
