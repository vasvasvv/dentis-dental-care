// ── CORS & Security Headers ───────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://dentis.kr.ua',
  'https://www.dentis.kr.ua',
  'http://localhost:5173',
  'http://localhost:4173',
]

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'none'; frame-ancestors 'none'",
}

function getCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin)
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Vary': 'Origin',
  }
}

function json(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(origin),
      ...SECURITY_HEADERS,
    },
  })
}

// ── JWT auth (replaces plain Bearer-token) ────────────────────────────────────
// Admin sends password → Worker issues short-lived JWT → Admin sends JWT on each request
// JWT is HS256, signed with env.JWT_SECRET (set once in Cloudflare dashboard)

function b64u(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
function fromb64u(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Uint8Array.from(atob(s), c => c.charCodeAt(0))
}

async function signJwt(payload, secret) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const header = b64u(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const body = b64u(enc.encode(JSON.stringify(payload)))
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${body}`))
  return `${header}.${body}.${b64u(sig)}`
}

async function verifyJwt(token, secret) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )
    const ok = await crypto.subtle.verify(
      'HMAC', key,
      fromb64u(parts[2]),
      enc.encode(`${parts[0]}.${parts[1]}`)
    )
    if (!ok) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp < Math.floor(Date.now() / 1000)) return null // expired
    return payload
  } catch {
    return null
  }
}

// Check Authorization header: supports both legacy Bearer (ADMIN_SECRET) for
// backwards compat during migration AND new JWT tokens
async function isAdmin(env, req) {
  const auth = req.headers.get('Authorization') || ''
  if (!auth.startsWith('Bearer ')) return false
  const token = auth.slice(7)

  // New path: verify JWT
  if (env.JWT_SECRET) {
    const payload = await verifyJwt(token, env.JWT_SECRET)
    if (payload?.role === 'admin') return true
  }

  // Legacy path: plain ADMIN_SECRET (kept for transition period)
  return token === env.ADMIN_SECRET
}

// ── Rate Limiter (IP + endpoint based, stored in D1) ─────────────────────────
async function checkRateLimit(db, ip, endpoint, maxAttempts = 10, windowSecs = 60) {
  const key = `rl:${endpoint}:${ip}`
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - windowSecs

  try {
    // Clean old entries and count recent ones atomically
    await db.prepare(
      'DELETE FROM rate_limit WHERE key=? AND ts<?'
    ).bind(key, windowStart).run()

    const { count } = await db.prepare(
      'SELECT COUNT(*) as count FROM rate_limit WHERE key=?'
    ).bind(key).first() ?? { count: 0 }

    if (count >= maxAttempts) {
      return { limited: true, remaining: 0 }
    }

    await db.prepare(
      'INSERT INTO rate_limit (key,ts) VALUES (?,?)'
    ).bind(key, now).run()

    return { limited: false, remaining: maxAttempts - count - 1 }
  } catch {
    // If rate_limit table doesn't exist yet, allow the request
    return { limited: false, remaining: maxAttempts }
  }
}

function getClientIp(req) {
  return req.headers.get('CF-Connecting-IP') ||
    req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
}

function idFrom(path) {
  return path.split('/').pop()
}

function normalizePhone(raw) {
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  let normalized
  if (digits.startsWith('380') && digits.length === 12) {
    normalized = digits
  } else if (digits.startsWith('0') && digits.length === 10) {
    normalized = '38' + digits
  } else {
    return null
  }
  return '+' + normalized
}

// ── WEB PUSH (RFC 8291 / RFC 8292) ────────────────────────────────────────────
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
  let prev = new Uint8Array(0), remaining = length, counter = 1
  while (remaining > 0) {
    const data = concat(prev, info, new Uint8Array([counter++]))
    prev = new Uint8Array(await crypto.subtle.sign('HMAC', key, data))
    blocks.push(prev); remaining -= prev.length
  }
  return concat(...blocks).subarray(0, length)
}
async function makeVapidJwt(audience, privateKeyB64u, publicKeyB64u) {
  const now = Math.floor(Date.now() / 1000)
  const enc = new TextEncoder()
  const header = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })))
  const payload = b64u(enc.encode(JSON.stringify({ aud: audience, exp: now + 43200, sub: 'mailto:nesterenkovasil9@gmail.com' })))
  const sigInput = `${header}.${payload}`
  const privKey = await crypto.subtle.importKey('pkcs8', fromb64u(privateKeyB64u), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privKey, enc.encode(sigInput))
  return `${sigInput}.${b64u(sig)}`
}
async function encryptPush(plaintext, p256dhB64u, authB64u) {
  const enc = new TextEncoder()
  const receiverPubRaw = fromb64u(p256dhB64u)
  const authSecret = fromb64u(authB64u)
  const senderPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
  const senderPubRaw = new Uint8Array(await crypto.subtle.exportKey('raw', senderPair.publicKey))
  const receiverPub = await crypto.subtle.importKey('raw', receiverPubRaw, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
  const ikm = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: receiverPub }, senderPair.privateKey, 256))
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const prkInfo = concat(enc.encode('WebPush: info\x00'), receiverPubRaw, senderPubRaw)
  const prk = await hkdfExtract(authSecret, ikm)
  const ikm2 = await hkdfExpand(prk, prkInfo, 32)
  const prk2 = await hkdfExtract(salt, ikm2)
  const cek = await hkdfExpand(prk2, enc.encode('Content-Encoding: aes128gcm\x00'), 16)
  const nonce = await hkdfExpand(prk2, enc.encode('Content-Encoding: nonce\x00'), 12)
  const aesKey = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt'])
  const data = concat(enc.encode(plaintext), new Uint8Array([2]))
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, data))
  const rs = new Uint8Array(4)
  new DataView(rs.buffer).setUint32(0, 4096, false)
  const header = concat(salt, rs, new Uint8Array([senderPubRaw.length]), senderPubRaw)
  return concat(header, encrypted)
}
async function sendPush(sub, payload, env) {
  const origin = new URL(sub.endpoint)
  const audience = `${origin.protocol}//${origin.host}`
  const [jwt, body] = await Promise.all([
    makeVapidJwt(audience, env.VAPID_PRIVATE_KEY, env.VAPID_PUBLIC_KEY),
    encryptPush(JSON.stringify(payload), sub.p256dh, sub.auth),
  ])
  const res = await fetch(sub.endpoint, {
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

async function pushToPhone(db, phone, payload, env) {
  const { results } = await db.prepare(
    'SELECT endpoint,p256dh,auth FROM push_subscriptions WHERE phone=?'
  ).bind(phone).all()
  if (!results?.length) return { sent: 0, noSub: true }
  let sent = 0
  const expired = []
  await Promise.allSettled(results.map(async sub => {
    try {
      const status = await sendPush(sub, payload, env)
      if (status === 201 || status === 200 || status === 202) sent++
      else if (status === 404 || status === 410) expired.push(sub.endpoint)
    } catch (e) { console.error('push error', e?.message) }
  }))
  if (expired.length) {
    await Promise.allSettled(expired.map(ep =>
      db.prepare('DELETE FROM push_subscriptions WHERE endpoint=?').bind(ep).run()
    ))
  }
  return { sent }
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
    } catch { failed++ }
  }))
  if (expired.length) {
    await Promise.allSettled(expired.map(ep =>
      db.prepare('DELETE FROM push_subscriptions WHERE endpoint=?').bind(ep).run()
    ))
  }
  return { sent, failed }
}

function formatDt(dt) {
  const d = new Date(dt)
  const day = d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })
  const time = d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
  return { day, time }
}

// ── CRON: нагадування ─────────────────────────────────────────────────────────
async function runReminders(db, env) {
  const now = Date.now()
  const in24h = new Date(now + 24 * 60 * 60 * 1000)
  const in1h  = new Date(now +      60 * 60 * 1000)
  const window = 30 * 60 * 1000

  const { results: remind24 } = await db.prepare(`
    SELECT * FROM appointments
    WHERE status='scheduled' AND reminded_24h=0
      AND appointment_dt >= ? AND appointment_dt <= ?
  `).bind(
    new Date(in24h.getTime() - window).toISOString().slice(0,16),
    new Date(in24h.getTime() + window).toISOString().slice(0,16)
  ).all()

  for (const appt of (remind24 || [])) {
    const { day, time } = formatDt(appt.appointment_dt)
    await pushToPhone(db, appt.phone, {
      title: '📅 Нагадування про прийом',
      body: `${appt.patient_name}, завтра о ${time} — ${appt.doctor || 'Дентіс'}`,
      url: '/', icon: '/icon-192.png',
    }, env)
    if (env.TELEGRAM_BOT_TOKEN) {
      await tgSendReminder(db, appt, env.TELEGRAM_BOT_TOKEN, '24h')
      await db.prepare('UPDATE appointments SET reminded_24h=1, tg_reminded_24h=1 WHERE id=?').bind(appt.id).run()
    } else {
      await db.prepare('UPDATE appointments SET reminded_24h=1 WHERE id=?').bind(appt.id).run()
    }
    void day
  }

  const { results: remind1 } = await db.prepare(`
    SELECT * FROM appointments
    WHERE status='scheduled' AND reminded_1h=0
      AND appointment_dt >= ? AND appointment_dt <= ?
  `).bind(
    new Date(in1h.getTime() - window).toISOString().slice(0,16),
    new Date(in1h.getTime() + window).toISOString().slice(0,16)
  ).all()

  for (const appt of (remind1 || [])) {
    const { time } = formatDt(appt.appointment_dt)
    await pushToPhone(db, appt.phone, {
      title: '⏰ Прийом через годину',
      body: `${appt.patient_name}, сьогодні о ${time} — ${appt.doctor || 'Дентіс'}`,
      url: '/', icon: '/icon-192.png',
    }, env)
    if (env.TELEGRAM_BOT_TOKEN) {
      await tgSendReminder(db, appt, env.TELEGRAM_BOT_TOKEN, '1h')
      await db.prepare('UPDATE appointments SET reminded_1h=1, tg_reminded_1h=1 WHERE id=?').bind(appt.id).run()
    } else {
      await db.prepare('UPDATE appointments SET reminded_1h=1 WHERE id=?').bind(appt.id).run()
    }
  }
}

// ── TELEGRAM HELPERS ──────────────────────────────────────────────────────────
async function tgSend(botToken, chatId, text) {
  if (!botToken || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
  } catch {}
}

async function tgSendReminder(db, appt, botToken, kind) {
  // Find telegram_chat_id: stored directly on appointment OR looked up by phone
  let chatId = appt.telegram_chat_id
  if (!chatId && appt.phone) {
    // Try to find chat_id from other appointments with same phone that have it set
    const row = await db.prepare(
      'SELECT telegram_chat_id FROM appointments WHERE phone=? AND telegram_chat_id IS NOT NULL LIMIT 1'
    ).bind(appt.phone).first()
    chatId = row?.telegram_chat_id
  }
  if (!chatId) return false

  const { day, time } = formatDt(appt.appointment_dt)
  const text = kind === '24h'
    ? `⏰ <b>Нагадування від Дентіс</b>\n\nДобрий день, ${appt.patient_name}!\nЗавтра о <b>${time}</b> ви записані на прийом.${appt.doctor ? `\n👨‍⚕️ Лікар: ${appt.doctor}` : ''}\n\n📍 Кропивницький, вул. Велика Перспективна 34\n\nЧекаємо вас! 🦷`
    : `⏰ <b>Прийом через годину!</b>\n\n${appt.patient_name}, сьогодні о <b>${time}</b> у вас прийом у Дентіс.${appt.doctor ? `\n👨‍⚕️ Лікар: ${appt.doctor}` : ''}\n\nБудь ласка, не запізнюйтесь 🙏`
  await tgSend(botToken, chatId, text)
  void day
  return true
}

// ── CRON: автопублікація запланованих статей ──────────────────────────────────
async function publishScheduledArticles(db, env) {
  const now = new Date().toISOString().slice(0, 19) // 'YYYY-MM-DDTHH:MM:SS'

  const { results } = await db.prepare(`
    SELECT * FROM scheduled_articles
    WHERE published = 0 AND publish_at <= ?
    ORDER BY publish_at ASC
  `).bind(now).all()

  if (!results?.length) return { published: 0 }

  let published = 0
  for (const article of results) {
    try {
      const today = new Date().toLocaleDateString('uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Kiev'
      })

      const { meta } = await db.prepare(
        'INSERT INTO news (type, badge, title, desc, date, hot) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        article.type || 'blog',
        article.badge || 'Стаття',
        article.title,
        article.desc,
        today,
        article.hot ?? 0
      ).run()

      await db.prepare(
        "UPDATE scheduled_articles SET published = 1 WHERE id = ?"
      ).bind(article.id).run()

      // Push-сповіщення всім підписникам
      if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
        broadcast(db, {
          title: article.badge || 'Дентіс',
          body: article.title,
          url: '/#news',
          icon: '/icon-192.png',
        }, env).catch(() => {})
      }

      published++
      void meta
    } catch (e) {
      console.error('publishScheduledArticles error:', e?.message)
    }
  }

  return { published }
}

// ── MAIN HANDLER ──────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const { pathname: p } = new URL(request.url)
    const m = request.method
    const origin = request.headers.get('Origin') || ''

    if (m === 'OPTIONS') {
      return new Response(null, {
        headers: { ...getCorsHeaders(origin), ...SECURITY_HEADERS }
      })
    }

    // ── AUTH: Issue JWT token ────────────────────────────────────────────────
    // POST /api/auth/login  { password: "..." }  → { token: "...", expiresIn: 3600 }
    if (p === '/api/auth/login' && m === 'POST') {
      const ip = getClientIp(request)

      // Rate limit: 5 attempts per 60s per IP on login endpoint
      const rl = await checkRateLimit(env.DB, ip, 'login', 5, 60)
      if (rl.limited) {
        return json({ error: 'Too many attempts. Try again in 60 seconds.' }, 429, origin)
      }

      let body
      try { body = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400, origin) }

      if (body.password !== env.ADMIN_SECRET) {
        return json({ error: 'Invalid credentials' }, 401, origin)
      }

      if (!env.JWT_SECRET) {
        return json({ error: 'Server misconfigured: JWT_SECRET not set' }, 500, origin)
      }

      const token = await signJwt(
        { role: 'admin', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 },
        env.JWT_SECRET
      )
      return json({ token, expiresIn: 3600 }, 200, origin)
    }

    // ── PUSH SUBSCRIBE (public) ──────────────────────────────────────────────
    if (p === '/api/push/subscribe' && m === 'POST') {
      const b = await request.json()
      const phone = b.phone ? normalizePhone(b.phone) : null
      await env.DB.prepare(
        'INSERT OR REPLACE INTO push_subscriptions (endpoint,p256dh,auth,phone) VALUES (?,?,?,?)'
      ).bind(b.endpoint, b.keys.p256dh, b.keys.auth, phone).run()
      return json({ ok: true }, 200, origin)
    }
    if (p === '/api/push/unsubscribe' && m === 'POST') {
      const b = await request.json()
      await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint=?').bind(b.endpoint).run()
      return json({ ok: true }, 200, origin)
    }

    // ── VAPID public key (public) ────────────────────────────────────────────
    if (p === '/api/vapid-public-key' && m === 'GET') {
      return json({ key: env.VAPID_PUBLIC_KEY }, 200, origin)
    }

    // ── HEALTH (public) ──────────────────────────────────────────────────────
    if (p === '/api/health') return json({ ok: true, ts: Date.now() }, 200, origin)

    // ── Rate limit on push/count — used by admin login screen ───────────────
    // This endpoint verifies the admin password — limit brute-force attempts
    if (p === '/api/push/count' && m === 'GET') {
      const ip = getClientIp(request)
      const rl = await checkRateLimit(env.DB, ip, 'push-count', 10, 60)
      if (rl.limited) {
        return json({ error: 'Too many requests' }, 429, origin)
      }
      if (!await isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401, origin)
      const row = await env.DB.prepare('SELECT COUNT(*) as count FROM push_subscriptions').first()
      return json({ count: row?.count ?? 0 }, 200, origin)
    }

    // ── PUBLIC: News and Doctors (read-only, no auth) ─────────────────────────
    if (p === '/api/news' && m === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM news ORDER BY hot DESC, created_at DESC').all()
      return json(results, 200, origin)
    }
    if (p === '/api/doctors' && m === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM doctors ORDER BY sort_order ASC').all()
      return json(results, 200, origin)
    }
    if (p.startsWith('/api/doctors/photo/') && m === 'GET') {
      const obj = await env.DOCTORS_BUCKET.get(p.replace('/api/doctors/photo/', ''))
      if (!obj) return new Response('Not Found', { status: 404, headers: SECURITY_HEADERS })
      return new Response(obj.body, {
        headers: {
          'Content-Type': obj.httpMetadata?.contentType ?? 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
          ...SECURITY_HEADERS,
        },
      })
    }

    // ── All remaining routes require admin auth ──────────────────────────────
    if (!await isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401, origin)

    // ── NEWS ─────────────────────────────────────────────────────────────────
    if (p === '/api/news' && m === 'POST') {
      const b = await request.json()
      const { meta } = await env.DB.prepare(
        'INSERT INTO news (type,badge,title,desc,date,hot) VALUES (?,?,?,?,?,?)'
      ).bind(b.type, b.badge, b.title, b.desc, b.date, b.hot ? 1 : 0).run()
      if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
        broadcast(env.DB, { title: b.badge || 'Дентіс', body: b.title, url: '/#news', icon: '/icon-192.png' }, env).catch(() => {})
      }
      return json({ id: meta.last_row_id }, 201, origin)
    }
    if (p.match(/^\/api\/news\/\d+$/) && m === 'PUT') {
      const b = await request.json()
      await env.DB.prepare("UPDATE news SET type=?,badge=?,title=?,desc=?,date=?,hot=?,updated_at=datetime('now') WHERE id=?")
        .bind(b.type, b.badge, b.title, b.desc, b.date, b.hot ? 1 : 0, idFrom(p)).run()
      return json({ ok: true }, 200, origin)
    }
    if (p.match(/^\/api\/news\/\d+$/) && m === 'DELETE') {
      await env.DB.prepare('DELETE FROM news WHERE id=?').bind(idFrom(p)).run()
      return json({ ok: true }, 200, origin)
    }

    // ── SCHEDULED ARTICLES ───────────────────────────────────────────────────
    // GET  /api/scheduled-articles          — список (admin)
    // POST /api/scheduled-articles          — додати в чергу (admin)
    // DELETE /api/scheduled-articles/:id    — видалити зі черги (admin)
    if (p === '/api/scheduled-articles' && m === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM scheduled_articles ORDER BY publish_at ASC'
      ).all()
      return json(results, 200, origin)
    }
    if (p === '/api/scheduled-articles' && m === 'POST') {
      const b = await request.json()
      if (!b.title || !b.desc || !b.publish_at) {
        return json({ error: 'title, desc, publish_at — обовʼязкові поля' }, 400, origin)
      }
      const { meta } = await env.DB.prepare(
        'INSERT INTO scheduled_articles (type, badge, title, desc, hot, publish_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        b.type   || 'blog',
        b.badge  || 'Стаття',
        b.title,
        b.desc,
        b.hot ? 1 : 0,
        b.publish_at
      ).run()
      return json({ id: meta.last_row_id }, 201, origin)
    }
    if (p.match(/^\/api\/scheduled-articles\/\d+$/) && m === 'DELETE') {
      await env.DB.prepare(
        'DELETE FROM scheduled_articles WHERE id = ?'
      ).bind(idFrom(p)).run()
      return json({ ok: true }, 200, origin)
    }

    // ── DOCTORS ──────────────────────────────────────────────────────────────
    if (p === '/api/doctors' && m === 'POST') {
      const b = await request.json()
      const { meta } = await env.DB.prepare(
        'INSERT INTO doctors (name,title,speciality,experience,desc,img_url,sort_order) VALUES (?,?,?,?,?,?,?)'
      ).bind(b.name, b.title, b.speciality, b.experience, b.desc, b.img_url ?? '', b.sort_order ?? 99).run()
      return json({ id: meta.last_row_id }, 201, origin)
    }
    if (p.match(/^\/api\/doctors\/\d+$/) && m === 'PUT') {
      const b = await request.json()
      await env.DB.prepare("UPDATE doctors SET name=?,title=?,speciality=?,experience=?,desc=?,img_url=?,sort_order=?,updated_at=datetime('now') WHERE id=?")
        .bind(b.name, b.title, b.speciality, b.experience, b.desc, b.img_url ?? '', b.sort_order ?? 99, idFrom(p)).run()
      return json({ ok: true }, 200, origin)
    }
    if (p.match(/^\/api\/doctors\/\d+$/) && m === 'DELETE') {
      const doc = await env.DB.prepare('SELECT img_url FROM doctors WHERE id=?').bind(idFrom(p)).first()
      if (doc?.img_url?.includes('/api/doctors/photo/')) {
        await env.DOCTORS_BUCKET.delete(doc.img_url.split('/api/doctors/photo/')[1]).catch(() => {})
      }
      await env.DB.prepare('DELETE FROM doctors WHERE id=?').bind(idFrom(p)).run()
      return json({ ok: true }, 200, origin)
    }
    if (p === '/api/doctors/photo' && m === 'POST') {
      const ct = request.headers.get('Content-Type') || ''
      if (!ct.startsWith('image/')) return json({ error: 'Only images allowed' }, 400, origin)
      const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg'
      const key = `doctor-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const body = await request.arrayBuffer()
      if (body.byteLength > 5 * 1024 * 1024) return json({ error: 'File too large' }, 413, origin)
      await env.DOCTORS_BUCKET.put(key, body, { httpMetadata: { contentType: ct } })
      return json({ url: `${new URL(request.url).origin}/api/doctors/photo/${key}` }, 201, origin)
    }
    // ── APPOINTMENTS ─────────────────────────────────────────────────────────
    if (p === '/api/appointments' && m === 'GET') {
      const url = new URL(request.url)
      const date = url.searchParams.get('date')
      let query = 'SELECT * FROM appointments'
      const args = []
      if (date) { query += ' WHERE appointment_dt LIKE ?'; args.push(`${date}%`) }
      query += ' ORDER BY appointment_dt ASC'
      const { results } = await env.DB.prepare(query).bind(...args).all()
      return json(results, 200, origin)
    }
    if (p === '/api/appointments' && m === 'POST') {
      const b = await request.json()
      const { patient_name, phone, appointment_dt, doctor, notes, telegram_chat_id } = b
      const normalPhone = normalizePhone(phone)
      if (!normalPhone) return json({ error: 'Невалідний номер телефону' }, 400, origin)

      // Check if we already know their Telegram chat_id from previous appointments
      const suffix = normalPhone.slice(-9)
      let tgChatId = telegram_chat_id || null
      if (!tgChatId) {
        const existing = await env.DB.prepare(
          'SELECT telegram_chat_id FROM appointments WHERE phone LIKE ? AND telegram_chat_id IS NOT NULL LIMIT 1'
        ).bind(`%${suffix}`).first()
        tgChatId = existing?.telegram_chat_id || null
      }

      const { meta } = await env.DB.prepare(
        'INSERT INTO appointments (patient_name,phone,appointment_dt,doctor,notes,telegram_chat_id) VALUES (?,?,?,?,?,?)'
      ).bind(patient_name, normalPhone, appointment_dt, doctor || null, notes || null, tgChatId).run()
      const id = meta.last_row_id
      const sub = await env.DB.prepare('SELECT endpoint FROM push_subscriptions WHERE phone=? LIMIT 1').bind(normalPhone).first()
      const { day, time } = formatDt(appointment_dt)
      if (sub && env.VAPID_PUBLIC_KEY) {
        pushToPhone(env.DB, normalPhone, {
          title: '✅ Запис підтверджено',
          body: `${patient_name}, ваш прийом ${day} о ${time}${doctor ? ` — ${doctor}` : ''}`,
          url: '/', icon: '/icon-192.png',
        }, env).catch(() => {})
      }
      // Telegram підтвердження
      if (tgChatId && env.TELEGRAM_BOT_TOKEN) {
        tgSend(env.TELEGRAM_BOT_TOKEN, tgChatId,
          `✅ <b>Запис підтверджено!</b>\n\n📅 ${day} о <b>${time}</b>${doctor ? `\n👨‍⚕️ Лікар: ${doctor}` : ''}\n\n📍 Кропивницький, вул. Велика Перспективна 34\n\nЧекаємо вас у клініці Дентіс! 🦷`
        ).catch(() => {})
      }
      return json({ id, hasPush: !!sub, hasTelegram: !!tgChatId }, 201, origin)
    }
    if (p.match(/^\/api\/appointments\/\d+$/) && m === 'PUT') {
      const b = await request.json()
      const id = idFrom(p)
      const old = await env.DB.prepare('SELECT * FROM appointments WHERE id=?').bind(id).first()
      if (!old) return json({ error: 'Not found' }, 404, origin)
      const { patient_name, phone, appointment_dt, doctor, notes, status } = b
      const normalPhone = normalizePhone(phone || old.phone)
      if (!normalPhone) return json({ error: 'Невалідний номер телефону' }, 400, origin)
      await env.DB.prepare(`
        UPDATE appointments SET patient_name=?,phone=?,appointment_dt=?,doctor=?,notes=?,status=?,
        reminded_24h=CASE WHEN appointment_dt!=? THEN 0 ELSE reminded_24h END,
        reminded_1h=CASE WHEN appointment_dt!=? THEN 0 ELSE reminded_1h END,
        updated_at=datetime('now') WHERE id=?
      `).bind(patient_name, normalPhone, appointment_dt, doctor || null, notes || null, status || old.status,
        appointment_dt, appointment_dt, id).run()
      if (env.VAPID_PUBLIC_KEY) {
        const { day, time } = formatDt(appointment_dt)
        if (status === 'cancelled' && old.status !== 'cancelled') {
          pushToPhone(env.DB, normalPhone, {
            title: '❌ Запис скасовано',
            body: `${patient_name}, ваш прийом ${day} о ${time} скасовано.`,
            url: '/', icon: '/icon-192.png',
          }, env).catch(() => {})
        } else if (appointment_dt !== old.appointment_dt) {
          pushToPhone(env.DB, normalPhone, {
            title: '🔄 Час прийому змінено',
            body: `${patient_name}, ваш прийом перенесено на ${day} о ${time}`,
            url: '/', icon: '/icon-192.png',
          }, env).catch(() => {})
        }
      }
      return json({ ok: true }, 200, origin)
    }
    if (p.match(/^\/api\/appointments\/\d+$/) && m === 'DELETE') {
      const appt = await env.DB.prepare('SELECT * FROM appointments WHERE id=?').bind(idFrom(p)).first()
      if (appt && env.VAPID_PUBLIC_KEY) {
        const { day, time } = formatDt(appt.appointment_dt)
        pushToPhone(env.DB, appt.phone, {
          title: '❌ Запис скасовано',
          body: `${appt.patient_name}, ваш прийом ${day} о ${time} скасовано.`,
          url: '/', icon: '/icon-192.png',
        }, env).catch(() => {})
      }
      await env.DB.prepare('DELETE FROM appointments WHERE id=?').bind(idFrom(p)).run()
      return json({ ok: true }, 200, origin)
    }

    // ── PUSH (admin) ─────────────────────────────────────────────────────────
    if (p === '/api/push/send-to' && m === 'POST') {
      const b = await request.json()
      if (!b.phone) return json({ error: 'phone required' }, 400, origin)
      const phone = normalizePhone(b.phone)
      if (!phone) return json({ error: 'Invalid phone' }, 400, origin)
      const result = await pushToPhone(env.DB, phone, {
        title: b.title || 'Дентіс', body: b.body || '', url: b.url || '/', icon: '/icon-192.png',
      }, env)
      return json(result, 200, origin)
    }
    if (p === '/api/push/send' && m === 'POST') {
      const b = await request.json()
      const result = await broadcast(env.DB, {
        title: b.title || 'Дентіс', body: b.body || '', url: b.url || '/', icon: '/icon-192.png',
      }, env)
      return json(result, 200, origin)
    }

    // ── TELEGRAM WEBHOOK (public — called by Telegram servers) ───────────────
    if (p === '/api/telegram/webhook' && m === 'POST') {
      let upd
      try { upd = await request.json() } catch { return new Response('ok') }
      const msg = upd?.message
      if (!msg) return new Response('ok')

      const chatId = String(msg.chat.id)
      const firstName = msg.chat.first_name || ''
      const text = (msg.text || '').trim()
      const contact = msg.contact

      if (text === '/start') {
        // Save pending registration — admin will link phone manually or user shares contact
        await env.DB.prepare(
          'INSERT OR REPLACE INTO telegram_pending (chat_id, first_name) VALUES (?, ?)'
        ).bind(chatId, firstName).run()

        const botToken = env.TELEGRAM_BOT_TOKEN
        if (botToken) {
          await tgSend(botToken, chatId,
            `👋 Вітаємо у клініці <b>Дентіс</b>, ${firstName}!\n\nЩоб отримувати нагадування про ваші візити, поділіться номером телефону (кнопка нижче) або зверніться до адміністратора.`
          )
          // Ask for contact via custom keyboard
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: '📱 Натисніть кнопку нижче, щоб поділитися номером:',
              reply_markup: {
                keyboard: [[{ text: '📱 Поділитися номером телефону', request_contact: true }]],
                one_time_keyboard: true,
                resize_keyboard: true,
              },
            }),
          })
        }
      }

      if (contact?.phone_number) {
        const raw = contact.phone_number.replace(/\D/g, '')
        const normalized = raw.startsWith('380') && raw.length === 12 ? raw
          : raw.startsWith('0') && raw.length === 10 ? '38' + raw
          : raw.length === 9 ? '380' + raw : null

        if (normalized) {
          // Link this chat_id to all matching appointments
          const suffix = normalized.slice(-9)
          await env.DB.prepare(`
            UPDATE appointments SET telegram_chat_id=?
            WHERE phone LIKE ? AND (telegram_chat_id IS NULL OR telegram_chat_id='')
          `).bind(chatId, `%${suffix}`).run()

          // Remove from pending
          await env.DB.prepare('DELETE FROM telegram_pending WHERE chat_id=?').bind(chatId).run()

          if (env.TELEGRAM_BOT_TOKEN) {
            await tgSend(env.TELEGRAM_BOT_TOKEN, chatId,
              `✅ <b>Готово!</b> Ваш номер +${normalized} прив'язано до акаунту Дентіс.\n\nВи отримуватимете нагадування про прийоми у цьому чаті. 🦷`
            )
            // Remove keyboard
            await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: 'Очікуйте нагадувань від клініки Дентіс 😊',
                reply_markup: { remove_keyboard: true },
              }),
            })
          }
        }
      }

      return new Response('ok')
    }

    // ── TELEGRAM ADMIN API ────────────────────────────────────────────────────
    // POST /api/telegram/link — вручну прив'язати chat_id до телефону
    if (p === '/api/telegram/link' && m === 'POST') {
      if (!await isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401, origin)
      const { phone, telegram_chat_id: chatId } = await request.json()
      const normalPhone = normalizePhone(phone)
      if (!normalPhone || !chatId) return json({ error: 'phone and telegram_chat_id required' }, 400, origin)
      const suffix = normalPhone.slice(-9)
      const { meta } = await env.DB.prepare(`
        UPDATE appointments SET telegram_chat_id=?
        WHERE phone LIKE ? AND status='scheduled'
      `).bind(String(chatId), `%${suffix}`).run()
      return json({ updated: meta.changes }, 200, origin)
    }

    // GET /api/telegram/pending — список тих хто написав /start але не прив'язаний
    if (p === '/api/telegram/pending' && m === 'GET') {
      if (!await isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401, origin)
      const { results } = await env.DB.prepare(
        'SELECT * FROM telegram_pending ORDER BY created_at DESC LIMIT 50'
      ).all()
      return json(results || [], 200, origin)
    }

    // GET /api/telegram/status?phone=... — чи є chat_id для цього телефону
    if (p === '/api/telegram/status' && m === 'GET') {
      if (!await isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401, origin)
      const phone = new URL(request.url).searchParams.get('phone')
      const normalPhone = normalizePhone(phone)
      if (!normalPhone) return json({ linked: false }, 200, origin)
      const suffix = normalPhone.slice(-9)
      const row = await env.DB.prepare(
        'SELECT telegram_chat_id FROM appointments WHERE phone LIKE ? AND telegram_chat_id IS NOT NULL LIMIT 1'
      ).bind(`%${suffix}`).first()
      return json({ linked: !!row?.telegram_chat_id, chat_id: row?.telegram_chat_id || null }, 200, origin)
    }

    // POST /api/telegram/send — вручну надіслати повідомлення у Telegram конкретному пацієнту
    if (p === '/api/telegram/send' && m === 'POST') {
      if (!await isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401, origin)
      if (!env.TELEGRAM_BOT_TOKEN) return json({ error: 'TELEGRAM_BOT_TOKEN not set' }, 503, origin)
      const { chat_id, text } = await request.json()
      if (!chat_id || !text) return json({ error: 'chat_id and text required' }, 400, origin)
      await tgSend(env.TELEGRAM_BOT_TOKEN, String(chat_id), text)
      return json({ ok: true }, 200, origin)
    }

    return json({ error: 'Not found' }, 404, origin)
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(Promise.all([
      runReminders(env.DB, env),
      publishScheduledArticles(env.DB, env),
    ]))
  },
}
