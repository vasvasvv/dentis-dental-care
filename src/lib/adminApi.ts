// src/lib/adminApi.ts
// Клієнт для Admin панелі — звертається до dentis-site-api Worker
// Auth: JWT (HS256) — отримується через POST /api/auth/login, зберігається в пам'яті

const BASE = import.meta.env.VITE_API_URL ?? 'https://dentis-site-api.nesterenkovasil9.workers.dev'

export type NewsItem = {
  id: number
  type: 'news' | 'promo'
  badge: string
  title: string
  desc: string
  date: string
  hot: boolean | number
}

export type Doctor = {
  id: number
  name: string
  title: string
  speciality: string
  experience: string
  desc: string
  img_url: string
  sort_order: number
}

// ─── JWT Auth ─────────────────────────────────────────────────────────────────

/** Exchange password for a short-lived JWT token (1h). */
export async function loginForToken(password: string): Promise<string> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (res.status === 429) throw new Error('TOO_MANY_ATTEMPTS')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('LOGIN_FAILED')
  const data = await res.json() as { token: string }
  return data.token
}

function authHeader(token: string, contentType = 'application/json') {
  return { Authorization: `Bearer ${token}`, 'Content-Type': contentType }
}

async function apiFetch(url: string, init: RequestInit, token: string): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: { ...authHeader(token), ...(init.headers ?? {}) },
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 429) throw new Error('TOO_MANY_ATTEMPTS')
  return res
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function getNews(): Promise<NewsItem[]> {
  const res = await fetch(`${BASE}/api/news`)
  if (!res.ok) throw new Error('Failed to fetch news')
  return res.json()
}

export async function createNews(item: Omit<NewsItem, 'id'>, token: string) {
  const res = await apiFetch(`${BASE}/api/news`, {
    method: 'POST',
    body: JSON.stringify(item),
  }, token)
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateNews(id: number, item: Omit<NewsItem, 'id'>, token: string) {
  const res = await apiFetch(`${BASE}/api/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }, token)
  if (!res.ok) throw new Error('Failed to update')
}

export async function deleteNews(id: number, token: string) {
  const res = await apiFetch(`${BASE}/api/news/${id}`, { method: 'DELETE' }, token)
  if (!res.ok) throw new Error('Failed to delete')
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export async function getDoctors(): Promise<Doctor[]> {
  const res = await fetch(`${BASE}/api/doctors`)
  if (!res.ok) throw new Error('Failed to fetch doctors')
  return res.json()
}

export async function createDoctor(doc: Omit<Doctor, 'id'>, token: string) {
  const res = await apiFetch(`${BASE}/api/doctors`, {
    method: 'POST',
    body: JSON.stringify(doc),
  }, token)
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateDoctor(id: number, doc: Omit<Doctor, 'id'>, token: string) {
  const res = await apiFetch(`${BASE}/api/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(doc),
  }, token)
  if (!res.ok) throw new Error('Failed to update')
}

export async function deleteDoctor(id: number, token: string) {
  const res = await apiFetch(`${BASE}/api/doctors/${id}`, { method: 'DELETE' }, token)
  if (!res.ok) throw new Error('Failed to delete')
}

// ─── Push ─────────────────────────────────────────────────────────────────────

export async function sendPush(
  payload: { title: string; body: string; url: string },
  token: string
): Promise<{ sent: number }> {
  const res = await apiFetch(`${BASE}/api/push/send`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token)
  if (!res.ok) throw new Error('Failed to send')
  return res.json()
}

export async function getPushCount(token: string): Promise<number> {
  const res = await apiFetch(`${BASE}/api/push/count`, {}, token)
  if (!res.ok) return 0
  const data = await res.json() as { count: number }
  return data.count
}

export async function subscribePush(subscription: PushSubscription) {
  const json = subscription.toJSON()
  await fetch(`${BASE}/api/push/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
    }),
  })
}