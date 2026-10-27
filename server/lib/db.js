/**
 * Lớp truy cập dữ liệu (storage adapter) — mặc định dùng env.DB (CF Durable Object SQLite).
 * Toàn bộ schema nằm trong MIGRATIONS, chạy một lần và đánh dấu trong bảng `_migrations`.
 * Muốn chuyển sang database khác: thay các hàm all/first/run/batch bên dưới.
 */

import { MARKET_SEED, buildSeedLives } from './content-mirror.js'

let _migrated = false

export const MIGRATIONS = [
  // v1 — lead
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'lead',
    audience TEXT,
    name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    email TEXT,
    company TEXT,
    province TEXT,
    needs TEXT,
    budget TEXT,
    message TEXT,
    source_page TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    consent INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'new',
    note TEXT
  )`,
  // v2 — đặt lịch studio
  `CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    studio_id TEXT NOT NULL,
    date TEXT NOT NULL,
    slot TEXT NOT NULL,
    hours INTEGER NOT NULL DEFAULT 4,
    package_id TEXT NOT NULL,
    addons TEXT,
    estimate INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    consent INTEGER NOT NULL DEFAULT 1
  )`,
  // v3 — lịch live
  `CREATE TABLE IF NOT EXISTS live_sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    brand TEXT,
    platform TEXT NOT NULL DEFAULT 'vhub',
    starts_at INTEGER NOT NULL,
    duration_min INTEGER NOT NULL DEFAULT 120,
    url TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    is_demo INTEGER NOT NULL DEFAULT 1
  )`,
  // v4 — Chợ Phiên & quỹ
  `CREATE TABLE IF NOT EXISTS markets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    held_at INTEGER NOT NULL,
    revenue INTEGER NOT NULL DEFAULT 0,
    donation INTEGER NOT NULL DEFAULT 0,
    auction INTEGER NOT NULL DEFAULT 0,
    orders INTEGER NOT NULL DEFAULT 0,
    transferred_at TEXT,
    statement_url TEXT,
    minutes_url TEXT
  )`,
  // v5 — số liệu vận hành
  `CREATE TABLE IF NOT EXISTS metrics (
    metric_key TEXT PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0,
    label TEXT,
    updated_at INTEGER NOT NULL
  )`,
  // v6 — cấu hình
  `CREATE TABLE IF NOT EXISTS settings (
    setting_key TEXT PRIMARY KEY,
    value TEXT,
    updated_at INTEGER
  )`,
  // v7 — chống trùng lịch ở tầng dữ liệu
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_slot ON bookings (studio_id, date, slot) WHERE status != 'cancelled'`,
  // v8 — chỉ mục tra cứu
  `CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_lives_start ON live_sessions (starts_at)`,
]

function epochOf(iso) {
  const ms = new Date(iso).getTime()
  return Number.isFinite(ms) ? ms : Date.now()
}

async function seed(env) {
  const now = Math.floor(Date.now() / 1000)

  const livesCount = await first(env, 'SELECT COUNT(*) AS c FROM live_sessions')
  if (!livesCount || Number(livesCount.c) === 0) {
    const sessions = buildSeedLives(Date.now())
    await batch(
      env,
      sessions.map((s) =>
        env.DB.prepare(
          'INSERT INTO live_sessions (id, title, brand, platform, starts_at, duration_min, url, status, is_demo) VALUES (?,?,?,?,?,?,?,?,?)',
        ).bind(s.id, s.title, s.brand, s.platform, s.starts_at, s.duration_min, s.url, 'scheduled', s.is_demo),
      ),
    )
  }

  const marketCount = await first(env, 'SELECT COUNT(*) AS c FROM markets')
  if (!marketCount || Number(marketCount.c) === 0) {
    await batch(
      env,
      MARKET_SEED.map((m) =>
        env.DB.prepare(
          'INSERT INTO markets (id, name, held_at, revenue, donation, auction, orders, transferred_at, statement_url, minutes_url) VALUES (?,?,?,?,?,?,?,?,?,?)',
        ).bind(m.id, m.name, epochOf(m.heldAt), m.revenue, m.donation, m.auction, m.orders, m.transferredAt || null, m.statementUrl || null, m.minutesUrl || null),
      ),
    )
  }

  const metricCount = await first(env, 'SELECT COUNT(*) AS c FROM metrics')
  if (!metricCount || Number(metricCount.c) === 0) {
    const rows = [
      ['studios', 14, 'Studio đang vận hành'],
      ['live_hours', 1280, 'Giờ livestream đã phát'],
      ['koc_verified', 186, 'Nhà sáng tạo đã định danh'],
    ]
    await batch(
      env,
      rows.map(([key, value, label]) =>
        env.DB.prepare('INSERT INTO metrics (metric_key, value, label, updated_at) VALUES (?,?,?,?)').bind(key, value, label, now),
      ),
    )
  }

  const settingsCount = await first(env, 'SELECT COUNT(*) AS c FROM settings')
  if (!settingsCount || Number(settingsCount.c) === 0) {
    await batch(env, [
      env.DB.prepare('INSERT INTO settings (setting_key, value, updated_at) VALUES (?,?,?)').bind('demo_seed', '1', now),
    ])
  }
}

/**
 * Chạy migration và đánh dấu trong bảng `_migrations`.
 * Adapter SQLite của nền tảng KHÔNG cho phép PRAGMA user_version (SQLITE_AUTH);
 * DDL chạy qua env.DB.exec(), DML chạy qua prepare().run().
 */
let _migrationPromise = null

export async function migrate(env) {
  if (_migrated) return
  if (_migrationPromise) return _migrationPromise
  _migrationPromise = (async () => {
    try {
      await env.DB.exec('CREATE TABLE IF NOT EXISTS _migrations (id INTEGER PRIMARY KEY, applied_at INTEGER NOT NULL)')
      const rows = await all(env, 'SELECT id FROM _migrations')
      const applied = new Set(rows.map((r) => Number(r.id)))
      for (let i = 0; i < MIGRATIONS.length; i += 1) {
        const id = i + 1
        if (applied.has(id)) continue
        try {
          await env.DB.exec(MIGRATIONS[i])
          await run(env, 'INSERT INTO _migrations (id, applied_at) VALUES (?, ?)', id, Math.floor(Date.now() / 1000))
        } catch (err) {
          const message = String((err && err.message) || '')
          console.error('Migration failed', id, message)
          if (/already exists|duplicate/i.test(message)) {
            try {
              await run(env, 'INSERT INTO _migrations (id, applied_at) VALUES (?, ?)', id, Math.floor(Date.now() / 1000))
            } catch (_) {}
          }
        }
      }
      await seed(env)
      _migrated = true
    } catch (err) {
      console.error('migrate failed', err && err.message)
    } finally {
      _migrationPromise = null
    }
  })()
  return _migrationPromise
}

/* ---------- Các hàm truy cập dùng chung ---------- */
export async function all(env, sql, ...params) {
  const stmt = params.length ? env.DB.prepare(sql).bind(...params) : env.DB.prepare(sql)
  const res = await stmt.all()
  return (res && res.results) || []
}

export async function first(env, sql, ...params) {
  const stmt = params.length ? env.DB.prepare(sql).bind(...params) : env.DB.prepare(sql)
  return stmt.first()
}

export async function run(env, sql, ...params) {
  const stmt = params.length ? env.DB.prepare(sql).bind(...params) : env.DB.prepare(sql)
  return stmt.run()
}

export async function batch(env, statements) {
  if (!statements || !statements.length) return []
  return env.DB.batch(statements)
}

/* ---------- Truy vấn nghiệp vụ ---------- */
export async function listLives(env) {
  return all(env, 'SELECT * FROM live_sessions ORDER BY starts_at ASC')
}

export async function listMarkets(env) {
  return all(env, 'SELECT * FROM markets ORDER BY held_at ASC')
}

export async function listMetrics(env) {
  return all(env, 'SELECT * FROM metrics ORDER BY metric_key ASC')
}

export async function listLeads(env, limit = 200) {
  return all(env, 'SELECT * FROM leads ORDER BY created_at DESC LIMIT ?', Math.min(500, Math.max(1, limit)))
}

export async function listBookings(env, limit = 200) {
  return all(env, 'SELECT * FROM bookings ORDER BY created_at DESC LIMIT ?', Math.min(500, Math.max(1, limit)))
}

export async function bookedSlots(env, studioId, date) {
  return all(env, "SELECT slot FROM bookings WHERE studio_id = ? AND date = ? AND status != 'cancelled'", studioId, date)
}

export async function findBookingSlot(env, studioId, date, slot) {
  return first(env, "SELECT id FROM bookings WHERE studio_id = ? AND date = ? AND slot = ? AND status != 'cancelled'", studioId, date, slot)
}

export async function insertBooking(env, row) {
  return run(
    env,
    `INSERT INTO bookings (id, code, created_at, studio_id, date, slot, hours, package_id, addons, estimate, name, phone, email, company, notes, status, consent)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    row.id,
    row.code,
    row.created_at,
    row.studio_id,
    row.date,
    row.slot,
    row.hours,
    row.package_id,
    row.addons,
    row.estimate,
    row.name,
    row.phone,
    row.email,
    row.company,
    row.notes,
    row.status,
    row.consent,
  )
}

export async function insertLead(env, row) {
  return run(
    env,
    `INSERT INTO leads (id, created_at, type, audience, name, phone, email, company, province, needs, budget, message, source_page, utm_source, utm_medium, utm_campaign, utm_content, utm_term, consent, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    row.id,
    row.created_at,
    row.type,
    row.audience,
    row.name,
    row.phone,
    row.email,
    row.company,
    row.province,
    row.needs,
    row.budget,
    row.message,
    row.source_page,
    row.utm_source,
    row.utm_medium,
    row.utm_campaign,
    row.utm_content,
    row.utm_term,
    row.consent,
    row.status,
  )
}

export async function updateStatus(env, table, id, status) {
  const allowed = { leads: ['new', 'contacted', 'qualified', 'won', 'closed'], bookings: ['pending', 'confirmed', 'done', 'cancelled'] }
  if (!allowed[table] || !allowed[table].includes(status)) return { changes: 0, invalid: true }
  const res = await run(env, `UPDATE ${table} SET status = ? WHERE id = ?`, status, id)
  return { changes: (res && res.meta && res.meta.changes) || 0 }
}

export async function upsertLive(env, s) {
  const exists = await first(env, 'SELECT id FROM live_sessions WHERE id = ?', s.id)
  if (exists) {
    await run(
      env,
      'UPDATE live_sessions SET title=?, brand=?, platform=?, starts_at=?, duration_min=?, url=?, is_demo=0 WHERE id=?',
      s.title,
      s.brand,
      s.platform,
      s.starts_at,
      s.duration_min,
      s.url,
      s.id,
    )
  } else {
    await run(
      env,
      'INSERT INTO live_sessions (id, title, brand, platform, starts_at, duration_min, url, status, is_demo) VALUES (?,?,?,?,?,?,?,?,0)',
      s.id,
      s.title,
      s.brand,
      s.platform,
      s.starts_at,
      s.duration_min,
      s.url,
      'scheduled',
    )
  }
}

export async function deleteLive(env, id) {
  const res = await run(env, 'DELETE FROM live_sessions WHERE id = ?', id)
  return (res && res.meta && res.meta.changes) || 0
}

export async function updateMetrics(env, items) {
  const now = Math.floor(Date.now() / 1000)
  const statements = items.map((it) => env.DB.prepare('UPDATE metrics SET value = ?, updated_at = ? WHERE metric_key = ?').bind(Math.max(0, Math.round(Number(it.value) || 0)), now, String(it.key)))
  return batch(env, statements)
}

export async function updateMarkets(env, rows) {
  const statements = rows.map((r) =>
    env.DB.prepare('UPDATE markets SET revenue=?, donation=?, auction=?, orders=?, statement_url=?, minutes_url=? WHERE id=?').bind(
      Math.max(0, Math.round(Number(r.revenue) || 0)),
      Math.max(0, Math.round(Number(r.donation) || 0)),
      Math.max(0, Math.round(Number(r.auction) || 0)),
      Math.max(0, Math.round(Number(r.orders) || 0)),
      String(r.statement_url || '').trim() || null,
      String(r.minutes_url || '').trim() || null,
      String(r.id),
    ),
  )
  return batch(env, statements)
}
