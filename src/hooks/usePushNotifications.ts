import { useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'https://dentis-site-api.nesterenkovasil9.workers.dev'

export type PushState = 'unsupported' | 'loading' | 'denied' | 'subscribed' | 'unsubscribed'

export function usePushNotifications() {
  const [state, setState] = useState<PushState>(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return 'unsupported'
    if (Notification.permission === 'denied') return 'denied'
    return 'loading'
  })

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return
    }
    if (Notification.permission === 'denied') {
      return
    }
    navigator.serviceWorker.ready.then(reg =>
      reg.pushManager.getSubscription()
    ).then(sub => {
      setState(sub ? 'subscribed' : 'unsubscribed')
    }).catch(() => setState('unsubscribed'))
  }, [])

  const subscribe = useCallback(async (phone?: string) => {
    if (!('serviceWorker' in navigator)) return false
    try {
      setState('loading')
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setState('denied'); return false }

      const res = await fetch(`${API}/api/vapid-public-key`)
      const { key } = await res.json() as { key: string }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      })

      const body: Record<string, unknown> = { ...sub.toJSON() }
      if (phone) body.phone = phone.replace(/\D/g, '')

      await fetch(`${API}/api/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      setState('subscribed')
      return true
    } catch (e) {
      console.error('Push subscribe error:', e)
      setState('unsubscribed')
      return false
    }
  }, [])

  const unsubscribe = useCallback(async () => {
    try {
      setState('loading')
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch(`${API}/api/push/unsubscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setState('unsubscribed')
    } catch {
      setState('subscribed')
    }
  }, [])

  return { state, subscribe, unsubscribe }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}
