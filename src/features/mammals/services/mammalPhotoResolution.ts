export type MammalPhotoOverride = {
  readonly contentType: string
  readonly uploadedAt: string
  readonly url: string
}

export type MammalPhotoManifest = Readonly<Record<string, MammalPhotoOverride>>

export type ResolvedMammalPhoto = {
  readonly fallback: string
  readonly source: 'fallback' | 'local' | 'r2'
  readonly src: string
}

export function resolveMammalPhoto(localPhoto: string | undefined, fallback: string, override: MammalPhotoOverride | undefined): ResolvedMammalPhoto {
  if (override) return { fallback: localPhoto ?? fallback, source: 'r2', src: override.url }
  if (localPhoto) return { fallback, source: 'local', src: localPhoto }
  return { fallback, source: 'fallback', src: fallback }
}
