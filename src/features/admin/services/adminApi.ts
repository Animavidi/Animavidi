import { getAdminApiBaseUrl } from '@/features/mammals/services/mammalPhotoApi'

export type AdminSession = { administrator: string; authenticated: true; expiresAt: number }

export class AdminApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); this.name = 'AdminApiError' }
}

export async function getAdminSession(signal?: AbortSignal): Promise<AdminSession | undefined> {
  const response = await adminFetch('/api/admin/session', { signal })
  if (response.status === 401) return undefined
  if (!response.ok) throw new Error('The admin service is unavailable.')
  return response.json() as Promise<AdminSession>
}

export async function loginAdmin(username: string, password: string): Promise<AdminSession> {
  const response = await adminFetch('/api/admin/login', { body: JSON.stringify({ password, username }), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
  if (!response.ok) throw new AdminApiError(await responseMessage(response, 'Login failed.'), response.status)
  return response.json() as Promise<AdminSession>
}

export async function logoutAdmin(): Promise<void> {
  const response = await adminFetch('/api/admin/logout', { method: 'POST' })
  if (!response.ok) throw new Error('Logout failed.')
}

export async function uploadMammalPhoto(mammalId: string, photo: Blob): Promise<void> {
  const body = new FormData()
  body.set('photo', photo, 'primary.webp')
  const response = await adminFetch(`/api/admin/mammals/${encodeURIComponent(mammalId)}/photo`, { body, method: 'PUT' })
  if (!response.ok) throw new AdminApiError(await responseMessage(response, 'Upload failed.'), response.status)
}

export async function deleteMammalPhoto(mammalId: string): Promise<void> {
  const response = await adminFetch(`/api/admin/mammals/${encodeURIComponent(mammalId)}/photo`, { method: 'DELETE' })
  if (!response.ok) throw new AdminApiError(await responseMessage(response, 'Remove failed.'), response.status)
}

function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const baseUrl = getAdminApiBaseUrl()
  if (!baseUrl) return Promise.reject(new Error('Set VITE_ADMIN_API_BASE_URL to use Content Admin.'))
  return fetch(`${baseUrl}${path}`, { ...init, credentials: 'include' })
}

async function responseMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') return body.error
  } catch { /* Use the safe fallback. */ }
  return fallback
}
