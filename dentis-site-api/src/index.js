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

// ── WEB PUSH (RFC 8291 / RFC 8292) ────────────────────────────────────────────
function b64u(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromb64u(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Uint8Array.from(atob(s), c => c.charCodeAt(0))
}

function concat(...arrays) {
  const total = arrays.reduce((n, a) => n + a.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const a of arrays) { out.set(a, offset); offset += a.length }
  return out
}

async function hkdfExtract(salt, ikm) {
  const key = await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, ikm))
}

async function hkdfExpand(prk, info, length) {
  const key = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const blocks = []
  let prev = new Uint8Array(0)
  let remaining = length
  let counter = 1
  while (remaining > 0) {
    const data = concat(prev, info, new Uint8Array([counter++]))
    prev = new Uint8Array(await crypto.subtle.sign('HMAC', key, data))
    blocks.push(prev)
    remaining -= prev.length
  }
  return concat(...blocks).subarray(0, length)
}

async function makeVapidJwt(audience, privateKeyB64u, publicKeyB64u) {
  const now = Math.floor(Date.now() / 1000)
  const enc = new TextEncoder()
  const header = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })))
  const payload = b64u(enc.encode(JSON.stringify({
    aud: audience,
    exp: now + 43200,
    sub: 'mailto:nesterenkovasil9@gmail.com',
  })))
  const sigInput = `${header}.${payload}`
  const privKey = await crypto.subtle.importKey(
    'pkcs8', fromb64u(privateKeyB64u),
    { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, privKey, enc.encode(sigInput)
  )
  return `${sigInput}.${b64u(sig)}`
}

async function encryptPush(plaintext, p256dhB64u, authB64u) {
  const enc = new TextEncoder()
  const receiverPubRaw = fromb64u(p256dhB64u)
  const authSecret = fromb64u(authB64u)

  // Ephemeral sender key pair
  const senderPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
  const senderPubRaw = new Uint8Array(await crypto.subtle.exportKey('raw', senderPair.publicKey))

  // Import receiver public key
  const receiverPub = await crypto.subtle.importKey(
    'raw', receiverPubRaw, { name: 'ECDH', namedCurve: 'P-256' }, false, []
  )

  // ECDH shared secret
  const ikm = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'ECDH', public: receiverPub }, senderPair.privateKey, 256
  ))

  // PRK via HKDF-Extract with info = "WebPush: info\0" + receiverPub + senderPub
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const prkInfo = concat(enc.encode('WebPush: info\x00'), receiverPubRaw, senderPubRaw)
  const prk = await hkdfExtract(authSecret, ikm)
  const ikm2 = await hkdfExpand(prk, prkInfo, 32)
  const prk2 = await hkdfExtract(salt, ikm2)

  // Content encryption key (16 bytes) and nonce (12 bytes)
  const cekInfo = enc.encode('Content-Encoding: aes128gcm\x00')
  const nonceInfo = enc.encode('Content-Encoding: nonce\x00')
  const cek = await hkdfExpand(prk2, cekInfo, 16)
  const nonce = await hkdfExpand(prk2, nonceInfo, 12)

  // Import CEK
  const aesKey = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt'])

  // Plaintext + padding delimiter byte (0x02)
  const data = concat(enc.encode(plaintext), new Uint8Array([2]))
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, data))

  // aes128gcm header: salt(16) + rs(4 BE) + idlen(1) + keyid(senderPub)
  const rs = new Uint8Array(4)
  new DataView(rs.buffer).setUint32(0, 4096, false)
  const header = concat(salt, rs, new Uint8Array([senderPubRaw.length]), senderPubRaw)

  return concat(header, encrypted)
}

async function sendPush(sub, payload, env) {
  const { endpoint, p256dh, auth } = sub
  const origin = new URL(endpoint)
  const audience = `${origin.protocol}//${origin.host}`

  const [jwt, body] = await Promise.all([
    makeVapidJwt(audience, env.VAPID_PRIVATE_KEY, env.VAPID_PUBLIC_KEY),
    encryptPush(JSON.stringify(payload), p256dh, auth),
  ])

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

async function broadcast(db, payload, env) {
  const { results } = await db.prepare('SELECT endpoint,p256dh,auth FROM push_subscriptions').all()
  if (!results?.length) return { sent: 0, failed: 0 }
  let sent = 0, failed = 0
  const expired = []
  await Promise.allSettled(results.map(async sub => {
    try {
      const status = await sendPush(sub, payload, env)
      if (status === 201 || status === 200 || status === 202) sent++
      else if (status === 404 || status === 410) { expired.push(sub.endpoint); failed++ }
      else failed++
    } catch (e) {
      console.error('push error', sub.endpoint, e?.message)
      failed++
    }
  }))
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
      if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
        broadcast(env.DB, { title: b.badge || 'Дентіс', body: b.title, url: '/#news', icon: '/icon-192.png' }, env).catch(() => {})
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
      const { results } = await env.DB.prepare('SELECT * FROM doctors ORDER BY sort_order ASC').all()
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
      if (doc?.img_url?.includes('/api/doctors/photo/')) {
        await env.DOCTORS_BUCKET.delete(doc.img_url.split('/api/doctors/photo/')[1]).catch(() => {})
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
      if (body.byteLength > 5 * 1024 * 1024) return json({ error: 'File too large' }, 413)
      await env.DOCTORS_BUCKET.put(key, body, { httpMetadata: { contentType: ct } })
      return json({ url: `${new URL(request.url).origin}/api/doctors/photo/${key}` }, 201)
    }

    if (p.startsWith('/api/doctors/photo/') && m === 'GET') {
      const obj = await env.DOCTORS_BUCKET.get(p.replace('/api/doctors/photo/', ''))
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
      const result = await broadcast(env.DB, {
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
