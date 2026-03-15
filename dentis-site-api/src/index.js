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

// Нормалізація телефону → завжди +380XXXXXXXXX або null
function normalizePhone(raw) {
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  // 0XXXXXXXXX → 380XXXXXXXXX
  // 380XXXXXXXXX → 380XXXXXXXXX
  // 38XXXXXXXXX (без нуля) → помилка
  let normalized
  if (digits.startsWith('380') && digits.length === 12) {
    normalized = digits
  } else if (digits.startsWith('0') && digits.length === 10) {
    normalized = '38' + digits
  } else {
    return null // невалідний формат
  }
  return '+' + normalized
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

// Надіслати push конкретному номеру телефону
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

// Broadcast усім
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

// Форматування дати для сповіщення
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
  const window = 30 * 60 * 1000 // ±30 хв вікно

  // Нагадування за 24 години
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
      url: '/',
      icon: '/icon-192.png',
    }, env)
    await db.prepare('UPDATE appointments SET reminded_24h=1 WHERE id=?').bind(appt.id).run()
    console.log(`Reminded 24h: appt ${appt.id} for ${appt.phone}`)
    void day
  }

  // Нагадування за 1 годину
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
      url: '/',
      icon: '/icon-192.png',
    }, env)
    await db.prepare('UPDATE appointments SET reminded_1h=1 WHERE id=?').bind(appt.id).run()
    console.log(`Reminded 1h: appt ${appt.id} for ${appt.phone}`)
  }
}

export default {
  // ── HTTP handler ────────────────────────────────────────────────────────────
  async fetch(request, env) {
    const { pathname: p } = new URL(request.url)
    const m = request.method

    if (m === 'OPTIONS') return new Response(null, { headers: CORS })

    if (p === '/api/vapid-public-key' && m === 'GET') {
      return json({ key: env.VAPID_PUBLIC_KEY })
    }

    // ── NEWS ────────────────────────────────────────────────────────────────
    if (p === '/api/news' && m === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM news ORDER BY hot DESC, created_at DESC').all()
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
      await env.DB.prepare("UPDATE news SET type=?,badge=?,title=?,desc=?,date=?,hot=?,updated_at=datetime('now') WHERE id=?")
        .bind(b.type, b.badge, b.title, b.desc, b.date, b.hot ? 1 : 0, idFrom(p)).run()
      return json({ ok: true })
    }
    if (p.match(/^\/api\/news\/\d+$/) && m === 'DELETE') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      await env.DB.prepare('DELETE FROM news WHERE id=?').bind(idFrom(p)).run()
      return json({ ok: true })
    }

    // ── DOCTORS ─────────────────────────────────────────────────────────────
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
      await env.DB.prepare("UPDATE doctors SET name=?,title=?,speciality=?,experience=?,desc=?,img_url=?,sort_order=?,updated_at=datetime('now') WHERE id=?")
        .bind(b.name, b.title, b.speciality, b.experience, b.desc, b.img_url ?? '', b.sort_order ?? 99, idFrom(p)).run()
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
        headers: { 'Content-Type': obj.httpMetadata?.contentType ?? 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // ── APPOINTMENTS ─────────────────────────────────────────────────────────
    if (p === '/api/appointments' && m === 'GET') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const url = new URL(request.url)
      const date = url.searchParams.get('date') // фільтр по даті YYYY-MM-DD
      let query = 'SELECT * FROM appointments'
      const args = []
      if (date) { query += ' WHERE appointment_dt LIKE ?'; args.push(`${date}%`) }
      query += ' ORDER BY appointment_dt ASC'
      const { results } = await env.DB.prepare(query).bind(...args).all()
      return json(results)
    }

    if (p === '/api/appointments' && m === 'POST') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      const { patient_name, phone, appointment_dt, doctor, notes } = b

      // Нормалізуємо телефон
      const normalPhone = normalizePhone(phone)
      if (!normalPhone) return json({ error: 'Невалідний номер телефону. Введіть у форматі +380XXXXXXXXX або 0XXXXXXXXX' }, 400)

      const { meta } = await env.DB.prepare(
        'INSERT INTO appointments (patient_name,phone,appointment_dt,doctor,notes) VALUES (?,?,?,?,?)'
      ).bind(patient_name, normalPhone, appointment_dt, doctor || null, notes || null).run()

      const id = meta.last_row_id

      // Перевіряємо чи є push-підписка для цього телефону
      const sub = await env.DB.prepare('SELECT endpoint FROM push_subscriptions WHERE phone=? LIMIT 1').bind(normalPhone).first()
      const { day, time } = formatDt(appointment_dt)

      // Надсилаємо підтвердження якщо є підписка
      if (sub && env.VAPID_PUBLIC_KEY) {
        pushToPhone(env.DB, normalPhone, {
          title: '✅ Запис підтверджено',
          body: `${patient_name}, ваш прийом ${day} о ${time}${doctor ? ` — ${doctor}` : ''}`,
          url: '/',
          icon: '/icon-192.png',
        }, env).catch(() => {})
      }

      return json({ id, hasPush: !!sub }, 201)
    }

    if (p.match(/^\/api\/appointments\/\d+$/) && m === 'PUT') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      const id = idFrom(p)
      const old = await env.DB.prepare('SELECT * FROM appointments WHERE id=?').bind(id).first()
      if (!old) return json({ error: 'Not found' }, 404)

      const { patient_name, phone, appointment_dt, doctor, notes, status } = b
      const normalPhone = normalizePhone(phone || old.phone)
      if (!normalPhone) return json({ error: 'Невалідний номер телефону' }, 400)

      await env.DB.prepare(`
        UPDATE appointments SET patient_name=?,phone=?,appointment_dt=?,doctor=?,notes=?,status=?,
        reminded_24h=CASE WHEN appointment_dt!=? THEN 0 ELSE reminded_24h END,
        reminded_1h=CASE WHEN appointment_dt!=? THEN 0 ELSE reminded_1h END,
        updated_at=datetime('now') WHERE id=?
      `).bind(patient_name, normalPhone, appointment_dt, doctor || null, notes || null, status || old.status,
        appointment_dt, appointment_dt, id).run()

      // Сповіщення про зміни
      if (env.VAPID_PUBLIC_KEY) {
        const { day, time } = formatDt(appointment_dt)
        if (status === 'cancelled' && old.status !== 'cancelled') {
          pushToPhone(env.DB, normalPhone, {
            title: '❌ Запис скасовано',
            body: `${patient_name}, ваш прийом ${day} о ${time} скасовано. Зателефонуйте нам для перезапису.`,
            url: '/',
            icon: '/icon-192.png',
          }, env).catch(() => {})
        } else if (appointment_dt !== old.appointment_dt) {
          pushToPhone(env.DB, normalPhone, {
            title: '🔄 Час прийому змінено',
            body: `${patient_name}, ваш прийом перенесено на ${day} о ${time}`,
            url: '/',
            icon: '/icon-192.png',
          }, env).catch(() => {})
        }
      }

      return json({ ok: true })
    }

    if (p.match(/^\/api\/appointments\/\d+$/) && m === 'DELETE') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
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
      return json({ ok: true })
    }

    // ── PUSH ─────────────────────────────────────────────────────────────────
    if (p === '/api/push/subscribe' && m === 'POST') {
      const b = await request.json()
      // phone опціональний — передається якщо є
      const phone = b.phone ? normalizePhone(b.phone) : null
      await env.DB.prepare(
        'INSERT OR REPLACE INTO push_subscriptions (endpoint,p256dh,auth,phone) VALUES (?,?,?,?)'
      ).bind(b.endpoint, b.keys.p256dh, b.keys.auth, phone).run()
      return json({ ok: true })
    }
    if (p === '/api/push/unsubscribe' && m === 'POST') {
      const b = await request.json()
      await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint=?').bind(b.endpoint).run()
      return json({ ok: true })
    }
    if (p === '/api/push/send-to' && m === 'POST') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      if (!b.phone) return json({ error: 'phone required' }, 400)
      const phone = normalizePhone(b.phone)
      if (!phone) return json({ error: 'Invalid phone' }, 400)
      const result = await pushToPhone(env.DB, phone, {
        title: b.title || 'Дентіс',
        body: b.body || '',
        url: b.url || '/',
        icon: '/icon-192.png',
      }, env)
      return json(result)
    }

    if (p === '/api/push/send' && m === 'POST') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const b = await request.json()
      const result = await broadcast(env.DB, { title: b.title || 'Дентіс', body: b.body || '', url: b.url || '/', icon: '/icon-192.png' }, env)
      return json(result)
    }
    if (p === '/api/push/count' && m === 'GET') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const row = await env.DB.prepare('SELECT COUNT(*) as count FROM push_subscriptions').first()
      return json({ count: row?.count ?? 0 })
    }

    // ── HEALTH ───────────────────────────────────────────────────────────────
    if (p === '/api/health') return json({ ok: true, ts: Date.now() })

    return json({ error: 'Not found' }, 404)
  },

  // ── CRON handler ────────────────────────────────────────────────────────────
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runReminders(env.DB, env))
  },
}
