// src/lib/adminApi.ts
// Клієнт для Admin панелі — звертається до dentis-site-api Worker

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

function authHeader(secret: string) {
  return { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function getNews(): Promise<NewsItem[]> {
  const res = await fetch(`${BASE}/api/news`)
  if (!res.ok) throw new Error('Failed to fetch news')
  return res.json()
}

export async function createNews(item: Omit<NewsItem, 'id'>, secret: string) {
  const res = await fetch(`${BASE}/api/news`, {
    method: 'POST',
    headers: authHeader(secret),
    body: JSON.stringify(item),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateNews(id: number, item: Omit<NewsItem, 'id'>, secret: string) {
  const res = await fetch(`${BASE}/api/news/${id}`, {
    method: 'PUT',
    headers: authHeader(secret),
    body: JSON.stringify(item),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Failed to update')
}

export async function deleteNews(id: number, secret: string) {
  const res = await fetch(`${BASE}/api/news/${id}`, {
    method: 'DELETE',
    headers: authHeader(secret),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Failed to delete')
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export async function getDoctors(): Promise<Doctor[]> {
  const res = await fetch(`${BASE}/api/doctors`)
  if (!res.ok) throw new Error('Failed to fetch doctors')
  return res.json()
}

export async function createDoctor(doc: Omit<Doctor, 'id'>, secret: string) {
  const res = await fetch(`${BASE}/api/doctors`, {
    method: 'POST',
    headers: authHeader(secret),
    body: JSON.stringify(doc),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateDoctor(id: number, doc: Omit<Doctor, 'id'>, secret: string) {
  const res = await fetch(`${BASE}/api/doctors/${id}`, {
    method: 'PUT',
    headers: authHeader(secret),
    body: JSON.stringify(doc),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Failed to update')
}

export async function deleteDoctor(id: number, secret: string) {
  const res = await fetch(`${BASE}/api/doctors/${id}`, {
    method: 'DELETE',
    headers: authHeader(secret),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Failed to delete')
}

// ─── Push ─────────────────────────────────────────────────────────────────────

export async function sendPush(
  payload: { title: string; body: string; url: string },
  secret: string
): Promise<{ sent: number }> {
  const res = await fetch(`${BASE}/api/push/send`, {
    method: 'POST',
    headers: authHeader(secret),
    body: JSON.stringify(payload),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Failed to send')
  return res.json()
}

export async function getPushCount(secret: string): Promise<number> {
  const res = await fetch(`${BASE}/api/push/count`, {
    headers: authHeader(secret),
  })
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