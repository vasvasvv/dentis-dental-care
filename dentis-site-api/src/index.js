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

export default {
  async fetch(request, env) {
    const { pathname: p } = new URL(request.url)
    const m = request.method

    if (m === 'OPTIONS') return new Response(null, { headers: CORS })

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
      await env.DB.prepare('DELETE FROM doctors WHERE id=?').bind(idFrom(p)).run()
      return json({ ok: true })
    }

    // ── PUSH ──────────────────────────────────────────────────────────────────
    if (p === '/api/push/subscribe' && m === 'POST') {
      const b = await request.json()
      await env.DB.prepare(
        'INSERT OR REPLACE INTO push_subscriptions (endpoint,p256dh,auth) VALUES (?,?,?)'
      ).bind(b.endpoint, b.keys.p256dh, b.keys.auth).run()
      return json({ ok: true })
    }

    if (p === '/api/push/send' && m === 'POST') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const row = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM push_subscriptions'
      ).first()
      return json({ sent: row?.count ?? 0 })
    }

    if (p === '/api/push/count' && m === 'GET') {
      if (!isAdmin(env, request)) return json({ error: 'Unauthorized' }, 401)
      const row = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM push_subscriptions'
      ).first()
      return json({ count: row?.count ?? 0 })
    }

    // ── HEALTH ────────────────────────────────────────────────────────────────
    if (p === '/api/health') return json({ ok: true, ts: Date.now() })

    return json({ error: 'Not found' }, 404)
  },
}