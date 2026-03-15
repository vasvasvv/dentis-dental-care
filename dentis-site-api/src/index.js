const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

function isAdmin(env, req) {
  return req.headers.get('Authorization') === `Bearer ${env.ADMIN_SECRET}`
}

function idFrom(path) {
  return path.split('/').pop()
}

// ── WEB PUSH ──────────────────────────────────────────────────────────────────
function base64urlToUint8(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  const bin = atob(str)
  return Uint8Array.from(bin, c => c.charCodeAt(0))
}

function uint8ToBase64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function importVapidPrivateKey(pkcs8Base64url) {
  const keyData = base64urlToUint8(pkcs8Base64url)
  return crypto.subtle.importKey(
    'pkcs8', keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  )
}

async function makeVapidJwt(audience, vapidPublicKey, vapidPrivateKey, subject) {
  const now = Math.floor(Date.now() / 1000)
  const header = uint8ToBase64url(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })))
  const payload = uint8ToBase64url(new TextEncoder().encode(JSON.stringify({
    aud: audience, exp: now + 43200, sub: subject
  })))
  const signingInput = `${header}.${payload}`
  const privKey = await importVapidPrivateKey(vapidPrivateKey)
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privKey,
    new TextEncoder().encode(signingInput)
  )
  return `${signingInput}.${uint8ToBase64url(sig)}`
}

async function sendPushNotification(subscription, payload, env) {
  const { endpoint, p256dh, auth } = subscription
  const url = new URL(endpoint)
  const audience = `${url.protocol}//${url.host}`

  const jwt = await makeVapidJwt(
    audience,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY,
    'mailto:nesterenkovasil9@gmail.com'
  )

  // Encrypt payload using Web Push encryption (RFC 8291)
  const authSecret = base64urlToUint8(auth)
  const receiverPublicKey = base64urlToUint8(p256dh)

  // Generate ephemeral key pair
  const ephemeralKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']
  )
  const ephemeralPublicKeyRaw = await crypto.subtle.exportKey('raw', ephemeralKeyPair.publicKey)

  // Import receiver public key
  const receiverKey = await crypto.subtle.importKey(
    'raw', receiverPublicKey, { name: 'ECDH', namedCurve: 'P-256' }, false, []
  )

  // Derive shared secret
  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: receiverKey }, ephemeralKeyPair.privateKey, 256
  )

  // HKDF to derive encryption key and nonce
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))

  async function hkdf(ikm, salt, info, length) {
    const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits'])
    return crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8)
  }

  const prk = await hkdf(sharedBits, authSecret, encoder.encode('WebPush: info\x00' +
    String.fromCharCode(...new Uint8Array(receiverPublicKey)) +
    String.fromCharCode(...new Uint8Array(ephemeralPublicKeyRaw))), 32)

  const encKey = await crypto.subtle.importKey('raw',
    await hkdf(prk, salt, encoder.encode('Content-Encoding: aes128gcm\x00'), 16),
    { name: 'AES-GCM' }, false, ['encrypt'])

  const nonce = await hkdf(prk, salt, encoder.encode('Content-Encoding: nonce\x00'), 12)

  // Encrypt
  const payloadBytes = encoder.encode(JSON.stringify(payload))
  const paddedPayload = new Uint8Array(payloadBytes.length + 1)
  paddedPayload.set(payloadBytes)
  paddedPayload[payloadBytes.length] = 2 // record delimiter

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce }, encKey, paddedPayload
  )

  // Build record header: salt(16) + rs(4) + keyid_len(1) + keyid
  const ephPubRaw = new Uint8Array(ephemeralPublicKeyRaw)
  const header = new Uint8Array(16 + 4 + 1 + ephPubRaw.length)
  header.set(salt, 0)
  new DataView(header.buffer).setUint32(16, 4096 + paddedPayload.length + 16, false) // rs
  header[20] = ephPubRaw.length
  header.set(ephPubRaw, 21)

  const body = new Uint8Array(header.length + encrypted.byteLength)
  body.set(header)
  body.set(new Uint8Array(encrypted), header.length)

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${jwt},k=${env.VAPID_PUBLIC_KEY}`,
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
    },
    body,
  })

  return res.status
}

async function broadcastPush(db, payload, env) {
  const { results } = await db.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions').all()
  if (!results?.length) return { sent: 0, failed: 0 }

  let sent = 0, failed = 0
  const expired = []

  await Promise.allSettled(results.map(async (sub) => {
    try {
      const status = await sendPushNotification(sub, payload, env)
      if (status === 201 || status === 200) { sent++ }
      else if (status === 404 || status === 410) { expired.push(sub.endpoint); failed++ }
      else { failed++ }
    } catch { failed++ }
  }))

  // Cleanup expired subscriptions
  if (expired.length) {
    await Promise.allSettled(expired.map(ep =>
      db.prepare('DELETE FROM push_subscriptions WHERE endpoint=?').bind(ep).run()
    ))
  }

  return { sent, failed }
}

export default {
  async fetch(request, env) {
    const { pathname: p } = new URL(request.url)
    const m = request.method

    if (m === 'OPTIONS') return new Response(null, { headers: CORS })

    // ── VAPID PUBLIC KEY ───────────────────────────────────────────────────────
    if (p === '/api/vapid-public-key' && m === 'GET') {
      return json({ key: env.VAPID_PUBLIC_KEY })
    }

    // ── NEWS ──────────────────────────────────────────────────────────────────
    if (p === '/api/news' && m === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM news ORDER BY hot DESC, created_at DESC'
      ).all()
      return json(results)
    }

    if (p === '/api/news' && m === 'POST') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      const { meta } = await env.DB.prepare(
        'INSERT INTO news (type,badge,title,desc,date,hot) VALUES (?,?,?,?,?,?)'
      ).bind(b.type, b.badge, b.title, b.desc, b.date, b.hot ? 1 : 0).run()

      // Автоматичний push при додаванні новини
      if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
        broadcastPush(env.DB, {
          title: b.badge || 'Дентіс',
          body: b.title,
          url: '/#news',
          icon: '/icon-192.png',
        }, env).catch(() => {})
      }

      return json({ id: meta.last_row_id }, 201)
    }

    if (p.match(/^\/api\/news\/\d+$/) && m === 'PUT') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      await env.DB.prepare(
        "UPDATE news SET type=?,badge=?,title=?,desc=?,date=?,hot=?,updated_at=datetime('now') WHERE id=?"
      ).bind(b.type, b.badge, b.title, b.desc, b.date, b.hot ? 1 : 0, idFrom(p)).run()
      return json({ ok: true })
    }

    if (p.match(/^\/api\/news\/\d+$/) && m === 'DELETE') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      await env.DB.prepare('DELETE FROM news WHERE id=?').bind(idFrom(p)).run()
      return json({ ok: true })
    }

    // ── DOCTORS ───────────────────────────────────────────────────────────────
    if (p === '/api/doctors' && m === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM doctors ORDER BY sort_order ASC'
      ).all()
      return json(results)
    }

    if (p === '/api/doctors' && m === 'POST') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      const { meta } = await env.DB.prepare(
        'INSERT INTO doctors (name,title,speciality,experience,desc,img_url,sort_order) VALUES (?,?,?,?,?,?,?)'
      ).bind(b.name, b.title, b.speciality, b.experience, b.desc, b.img_url ?? '', b.sort_order ?? 99).run()
      return json({ id: meta.last_row_id }, 201)
    }

    if (p.match(/^\/api\/doctors\/\d+$/) && m === 'PUT') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      await env.DB.prepare(
        "UPDATE doctors SET name=?,title=?,speciality=?,experience=?,desc=?,img_url=?,sort_order=?,updated_at=datetime('now') WHERE id=?"
      ).bind(b.name, b.title, b.speciality, b.experience, b.desc, b.img_url ?? '', b.sort_order ?? 99, idFrom(p)).run()
      return json({ ok: true })
    }

    if (p.match(/^\/api\/doctors\/\d+$/) && m === 'DELETE') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const doc = await env.DB.prepare('SELECT img_url FROM doctors WHERE id=?').bind(idFrom(p)).first()
      if (doc?.img_url && doc.img_url.includes('/api/doctors/photo/')) {
        const key = doc.img_url.split('/api/doctors/photo/')[1]
        await env.DOCTORS_BUCKET.delete(key).catch(() => {})
      }
      await env.DB.prepare('DELETE FROM doctors WHERE id=?').bind(idFrom(p)).run()
      return json({ ok: true })
    }

    // ── DOCTOR PHOTO ──────────────────────────────────────────────────────────
    if (p === '/api/doctors/photo' && m === 'POST') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const ct = request.headers.get('Content-Type') || ''
      if (!ct.startsWith('image/')) return json({ error: 'Only images allowed' }, 400)
      const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg'
      const key = `doctor-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const body = await request.arrayBuffer()
      if (body.byteLength > 5 * 1024 * 1024) return json({ error: 'File too large (max 5MB)' }, 413)
      await env.DOCTORS_BUCKET.put(key, body, { httpMetadata: { contentType: ct } })
      const url = `${new URL(request.url).origin}/api/doctors/photo/${key}`
      return json({ url }, 201)
    }

    if (p.startsWith('/api/doctors/photo/') && m === 'GET') {
      const key = p.replace('/api/doctors/photo/', '')
      const obj = await env.DOCTORS_BUCKET.get(key)
      if (!obj) return new Response('Not Found', { status: 404 })
      return new Response(obj.body, {
        headers: {
          'Content-Type': obj.httpMetadata?.contentType ?? 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // ── PUSH ──────────────────────────────────────────────────────────────────
    if (p === '/api/push/subscribe' && m === 'POST') {
      const b = await request.json()
      await env.DB.prepare(
        'INSERT OR REPLACE INTO push_subscriptions (endpoint,p256dh,auth) VALUES (?,?,?)'
      ).bind(b.endpoint, b.keys.p256dh, b.keys.auth).run()
      return json({ ok: true })
    }

    if (p === '/api/push/unsubscribe' && m === 'POST') {
      const b = await request.json()
      await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint=?').bind(b.endpoint).run()
      return json({ ok: true })
    }

    if (p === '/api/push/send' && m === 'POST') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      const result = await broadcastPush(env.DB, {
        title: b.title || 'Дентіс',
        body: b.body || '',
        url: b.url || '/',
        icon: '/icon-192.png',
      }, env)
      return json(result)
    }

    if (p === '/api/push/count' && m === 'GET') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const row = await env.DB.prepare('SELECT COUNT(*) as count FROM push_subscriptions').first()
      return json({ count: row?.count ?? 0 })
    }

    // ── HEALTH ────────────────────────────────────────────────────────────────
    if (p === '/api/health') return json({ ok: true, ts: Date.now() })

    return json({ error: 'Not found' }, 404)
  },
}
