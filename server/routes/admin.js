/** API quản trị: lead, đặt lịch, lịch live, số liệu, Chợ Phiên & quỹ, xuất CSV. */

import { json, readJson, badRequest, notFound, str, text, csvCell } from '../lib/http.js'
import { requireAdmin, login, logout } from '../lib/auth.js'
import {
  listLeads,
  listBookings,
  listLives,
  listMarkets,
  listMetrics,
  updateStatus,
  upsertLive,
  deleteLive,
  updateMetrics,
  updateMarkets,
} from '../lib/db.js'

const PLATFORMS = ['tiktok', 'shopee', 'facebook', 'youtube', 'vhub']

function fmtDateTime(ms) {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(Number(ms)))
  } catch (_) {
    return String(ms || '')
  }
}

function buildLeadsCsv(leads) {
  const headers = [
    'Thời gian',
    'Loại',
    'Nhóm',
    'Họ tên',
    'Điện thoại',
    'Email',
    'Công ty',
    'Tỉnh',
    'Nhu cầu',
    'Ngân sách',
    'Nội dung',
    'Trạng thái',
    'Trang nguồn',
    'UTM source',
    'UTM medium',
    'UTM campaign',
  ]
  const rows = leads.map((l) =>
    [
      fmtDateTime(l.created_at),
      l.type,
      l.audience || '',
      l.name,
      l.phone,
      l.email || '',
      l.company || '',
      l.province || '',
      l.needs || '',
      l.budget || '',
      l.message || '',
      l.status,
      l.source_page || '',
      l.utm_source || '',
      l.utm_medium || '',
      l.utm_campaign || '',
    ]
      .map(csvCell)
      .join(','),
  )
  return `\uFEFF${headers.map(csvCell).join(',')}\r\n${rows.join('\r\n')}`
}

function buildBookingsCsv(rows) {
  const headers = ['Mã', 'Tạo lúc', 'Studio', 'Ngày', 'Ca', 'Giờ', 'Gói', 'Dịch vụ thêm', 'Ước tính', 'Khách', 'Điện thoại', 'Email', 'Công ty', 'Ghi chú', 'Trạng thái']
  const body = rows.map((b) =>
    [
      b.code,
      fmtDateTime(b.created_at),
      b.studio_id,
      b.date,
      b.slot,
      b.hours,
      b.package_id,
      b.addons || '',
      b.estimate,
      b.name,
      b.phone,
      b.email || '',
      b.company || '',
      b.notes || '',
      b.status,
    ]
      .map(csvCell)
      .join(','),
  )
  return `\uFEFF${headers.map(csvCell).join(',')}\r\n${body.join('\r\n')}`
}

export async function handleAdmin(request, env, url) {
  const path = url.pathname

  if (path === '/api/admin/login' && request.method === 'POST') {
    return login(request, env)
  }

  const auth = await requireAdmin(request, env)
  if (auth.error) return auth.error

  if (path === '/api/admin/logout' && request.method === 'POST') {
    return logout(request, env, auth.token)
  }

  if (path === '/api/admin/overview' && request.method === 'GET') {
    const [leads, bookings, lives, metrics, markets] = await Promise.all([
      listLeads(env, 200),
      listBookings(env, 200),
      listLives(env),
      listMetrics(env),
      listMarkets(env),
    ])
    return json({
      ok: true,
      leads,
      bookings,
      lives,
      metrics: metrics.map((m) => ({ key: m.metric_key, value: Number(m.value) || 0, label: m.label, updated_at: (Number(m.updated_at) || 0) * 1000 })),
      markets,
    })
  }

  const leadMatch = path.match(/^\/api\/admin\/leads\/([A-Za-z0-9-]{6,64})$/)
  if (leadMatch && request.method === 'PATCH') {
    const body = await readJson(request)
    const status = str(body && body.status, 20)
    const res = await updateStatus(env, 'leads', leadMatch[1], status)
    if (res.invalid) return badRequest('Trạng thái không hợp lệ.')
    if (!res.changes) return notFound('Không tìm thấy lead.')
    return json({ ok: true })
  }

  const bookingMatch = path.match(/^\/api\/admin\/bookings\/([A-Za-z0-9-]{6,64})$/)
  if (bookingMatch && request.method === 'PATCH') {
    const body = await readJson(request)
    const status = str(body && body.status, 20)
    const res = await updateStatus(env, 'bookings', bookingMatch[1], status)
    if (res.invalid) return badRequest('Trạng thái không hợp lệ.')
    if (!res.changes) return notFound('Không tìm thấy đặt lịch.')
    return json({ ok: true })
  }

  if (path === '/api/admin/lives' && request.method === 'POST') {
    const body = await readJson(request)
    if (!body) return badRequest('Dữ liệu không hợp lệ.')
    const title = str(body.title, 200)
    const startsAt = Number(body.starts_at)
    const duration = Math.min(600, Math.max(15, Number(body.duration_min) || 120))
    const platform = PLATFORMS.includes(body.platform) ? body.platform : 'vhub'
    if (!title) return badRequest('Cần nhập tiêu đề phiên.')
    if (!Number.isFinite(startsAt) || startsAt < 1e12) return badRequest('Thời gian bắt đầu không hợp lệ.')
    const id = /^[A-Za-z0-9_-]{4,64}$/.test(String(body.id || '')) ? String(body.id) : crypto.randomUUID()
    await upsertLive(env, {
      id,
      title,
      brand: str(body.brand, 120),
      platform,
      starts_at: Math.round(startsAt),
      duration_min: duration,
      url: str(body.url, 500),
    })
    return json({ ok: true, id })
  }

  const liveMatch = path.match(/^\/api\/admin\/lives\/([A-Za-z0-9_-]{4,64})$/)
  if (liveMatch && request.method === 'DELETE') {
    const changes = await deleteLive(env, liveMatch[1])
    if (!changes) return notFound('Không tìm thấy phiên live.')
    return json({ ok: true })
  }

  if (path === '/api/admin/metrics' && request.method === 'PUT') {
    const body = await readJson(request)
    const items = Array.isArray(body && body.items) ? body.items : []
    const allowed = ['studios', 'live_hours', 'koc_verified']
    const clean = items.filter((i) => i && allowed.includes(String(i.key)))
    if (!clean.length) return badRequest('Không có số liệu hợp lệ.')
    await updateMetrics(env, clean.map((i) => ({ key: String(i.key), value: Number(i.value) || 0 })))
    return json({ ok: true })
  }

  if (path === '/api/admin/markets' && request.method === 'PUT') {
    const body = await readJson(request)
    const rows = Array.isArray(body && body.markets) ? body.markets : []
    if (!rows.length) return badRequest('Không có dữ liệu quỹ.')
    const clean = rows.filter((r) => r && /^[A-Za-z0-9-]{4,64}$/.test(String(r.id)))
    if (!clean.length) return badRequest('Mã phiên không hợp lệ.')
    await updateMarkets(env, clean)
    return json({ ok: true })
  }

  if (path === '/api/admin/export.csv' && request.method === 'GET') {
    const type = str(url.searchParams.get('type'), 20) || 'leads'
    const stamp = new Date().toISOString().slice(0, 10)
    if (type === 'bookings') {
      const rows = await listBookings(env, 500)
      return new Response(buildBookingsCsv(rows), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="vhub-bookings-${stamp}.csv"`,
          'Cache-Control': 'no-store',
        },
      })
    }
    const leads = await listLeads(env, 500)
    return new Response(buildLeadsCsv(leads), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="vhub-leads-${stamp}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  // Ghi chú cho lead (tính năng phụ, dùng cho đội vận hành)
  const noteMatch = path.match(/^\/api\/admin\/leads\/([A-Za-z0-9-]{6,64})\/note$/)
  if (noteMatch && request.method === 'PUT') {
    const body = await readJson(request)
    const note = text(body && body.note, 1000)
    const { run } = await import('../lib/db.js')
    const res = await run(env, 'UPDATE leads SET note = ? WHERE id = ?', note, noteMatch[1])
    if (!res || !res.meta || !Number(res.meta.changes)) return notFound('Không tìm thấy lead.')
    return json({ ok: true })
  }

  return notFound('Không tìm thấy API quản trị.')
}
