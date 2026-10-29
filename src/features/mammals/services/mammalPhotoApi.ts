import type { MammalPhotoManifest } from './mammalPhotoResolution'

const configuredBaseUrl = (import.meta.env.VITE_ADMIN_API_BASE_URL as string | undefined)?.replace(/\/$/, '')
const apiBaseUrl = configuredBaseUrl === 'same-origin' ? window.location.origin : configuredBaseUrl

export function getAdminApiBaseUrl(): string | undefined {
  return apiBaseUrl
}

export async function fetchMammalPhotoManifest(signal?: AbortSignal): Promise<MammalPhotoManifest> {
  if (!apiBaseUrl) return {}
  const response = await fetch(`${apiBaseUrl}/api/photos`, { signal })
  if (!response.ok) throw new Error('Photo service unavailable')
  const payload: unknown = await response.json()
  if (!isManifestResponse(payload)) throw new Error('Photo service returned invalid data')
  return payload.photos
}

function isManifestResponse(value: unknown): value is { photos: MammalPhotoManifest } {
  if (!value || typeof value !== 'object' || !('photos' in value)) return false
  const photos = value.photos
  if (!photos || typeof photos !== 'object' || Array.isArray(photos)) return false
  return Object.values(photos).every(isManifestPhoto)
}

function isManifestPhoto(photo: unknown): boolean {
  return Boolean(photo && typeof photo === 'object' && 'url' in photo && typeof photo.url === 'string')
}
