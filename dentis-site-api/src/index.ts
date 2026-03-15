import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = { DB: D1Database; ADMIN_SECRET: string }
const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors({
  origin: ['https://dentis.kr.ua', 'http://localhost:8080', 'http://localhost:4173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

function auth(secret: string, header: string | null) {
  return !!header && header === `Bearer ${secret}`
}

app.get('/api/news', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM news ORDER BY hot DESC, created_at DESC').all()
  return c.json(results)
})
app.post('/api/news', async (c) => {
  if (!auth(c.env.ADMIN_SECRET, c.req.header('Authorization'))) return c.json({ error: 'Unauthorized' }, 401)
  const b = await c.req.json<{ type: string; badge: string; title: string; desc: string; date: string; hot: boolean }>()
  const { meta } = await c.env.DB.prepare('INSERT INTO news (type,badge,title,desc,date,hot) VALUES (?,?,?,?,?,?)').bind(b.type,b.badge,b.title,b.desc,b.date,b.hot?1:0).run()
  return c.json({ id: meta.last_row_id }, 201)
})
app.put('/api/news/:id', async (c) => {
  if (!auth(c.env.ADMIN_SECRET, c.req.header('Authorization'))) return c.json({ error: 'Unauthorized' }, 401)
  const b = await c.req.json<{ type: string; badge: string; title: string; desc: string; date: string; hot: boolean }>()
  await c.env.DB.prepare("UPDATE news SET type=?,badge=?,title=?,desc=?,date=?,hot=?,updated_at=datetime('now') WHERE id=?").bind(b.type,b.badge,b.title,b.desc,b.date,b.hot?1:0,c.req.param('id')).run()
  return c.json({ ok: true })
})
app.delete('/api/news/:id', async (c) => {
  if (!auth(c.env.ADMIN_SECRET, c.req.header('Authorization'))) return c.json({ error: 'Unauthorized' }, 401)
  await c.env.DB.prepare('DELETE FROM news WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ ok: true })
})

app.get('/api/doctors', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM doctors ORDER BY sort_order ASC').all()
  return c.json(results)
})
app.post('/api/doctors', async (c) => {
  if (!auth(c.env.ADMIN_SECRET, c.req.header('Authorization'))) return c.json({ error: 'Unauthorized' }, 401)
  const b = await c.req.json<{ name: string; title: string; speciality: string; experience: string; desc: string; img_url: string; sort_order?: number }>()
  const { meta } = await c.env.DB.prepare('INSERT INTO doctors (name,title,speciality,experience,desc,img_url,sort_order) VALUES (?,?,?,?,?,?,?)').bind(b.name,b.title,b.speciality,b.experience,b.desc,b.img_url,b.sort_order??99).run()
  return c.json({ id: meta.last_row_id }, 201)
})
app.put('/api/doctors/:id', async (c) => {
  if (!auth(c.env.ADMIN_SECRET, c.req.header('Authorization'))) return c.json({ error: 'Unauthorized' }, 401)
  const b = await c.req.json<{ name: string; title: string; speciality: string; experience: string; desc: string; img_url: string; sort_order?: number }>()
  await c.env.DB.prepare("UPDATE doctors SET name=?,title=?,speciality=?,experience=?,desc=?,img_url=?,sort_order=?,updated_at=datetime('now') WHERE id=?").bind(b.name,b.title,b.speciality,b.experience,b.desc,b.img_url,b.sort_order??99,c.req.param('id')).run()
  return c.json({ ok: true })
})
app.delete('/api/doctors/:id', async (c) => {
  if (!auth(c.env.ADMIN_SECRET, c.req.header('Authorization'))) return c.json({ error: 'Unauthorized' }, 401)
  await c.env.DB.prepare('DELETE FROM doctors WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ ok: true })
})

app.post('/api/push/subscribe', async (c) => {
  const b = await c.req.json<{ endpoint: string; keys: { p256dh: string; auth: string } }>()
  await c.env.DB.prepare('INSERT OR REPLACE INTO push_subscriptions (endpoint,p256dh,auth) VALUES (?,?,?)').bind(b.endpoint,b.keys.p256dh,b.keys.auth).run()
  return c.json({ ok: true })
})
app.post('/api/push/send', async (c) => {
  if (!auth(c.env.ADMIN_SECRET, c.req.header('Authorization'))) return c.json({ error: 'Unauthorized' }, 401)
  const b = await c.req.json<{ title: string; body: string; url: string }>()
  const { results } = await c.env.DB.prepare('SELECT * FROM push_subscriptions').all()
  console.log('Push payload:', b, 'Subscribers:', results.length)
  return c.json({ sent: results.length })
})
app.get('/api/push/count', async (c) => {
  if (!auth(c.env.ADMIN_SECRET, c.req.header('Authorization'))) return c.json({ error: 'Unauthorized' }, 401)
  const row = await c.env.DB.prepare('SELECT COUNT(*) as count FROM push_subscriptions').first<{ count: number }>()
  return c.json({ count: row?.count ?? 0 })
})

app.get('/api/health', (c) => c.json({ ok: true }))

export default app
