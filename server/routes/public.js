/** API công khai: bootstrap, lead, lịch trống, đặt lịch studio, trợ lý tư vấn, health. */

import {
  json,
  readJson,
  badRequest,
  tooMany,
  notFound,
  str,
  text,
  isEmail,
  isPhone,
  isDateKey,
  clientIp,
  rateLimit,
} from '../lib/http.js'
import {
  listLives,
  listMarkets,
  listMetrics,
  bookedSlots,
  insertBooking,
  insertLead,
  findBookingSlot,
} from '../lib/db.js'
import { TIME_SLOTS, STUDIO_PACKAGE_RATES, STUDIO_ADDON_RATES, STUDIO_NAMES, isKnownStudio, estimateStudioCost, vnDateKey } from '../lib/content-mirror.js'
import { forwardLead, notifyZalo, lookupKoc, askAssistant } from '../lib/adapters.js'

const AUDIENCES = ['nhan-hang', 'sme', 'dia-phuong', 'nha-sang-tao', 'hoc-vien', 'khac']
const TYPES = ['lead', 'newsletter', 'chat', 'booking-koc']

function normalizeUtm(utm) {
  const src = utm && typeof utm === 'object' ? utm : {}
  const pick = (k) => str(src[k], 120)
  return {
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    utm_content: pick('utm_content'),
    utm_term: pick('utm_term'),
  }
}

export async function bootstrap(env) {
  const [lives, markets, metrics] = await Promise.all([listLives(env), listMarkets(env), listMetrics(env)])
  const updatedAt = metrics.reduce((max, m) => Math.max(max, Number(m.updated_at) || 0), 0) * 1000
  return json({
    ok: true,
    now: Date.now(),
    lives: lives.map((l) => ({
      id: l.id,
      title: l.title,
      brand: l.brand,
      platform: l.platform,
      starts_at: Number(l.starts_at),
      duration_min: Number(l.duration_min),
      url: l.url || null,
      is_demo: Number(l.is_demo) || 0,
    })),
    stats: {
      items: metrics.map((m) => ({ key: m.metric_key, value: Number(m.value) || 0, label: m.label, updated_at: (Number(m.updated_at) || 0) * 1000 })),
      updatedAt: updatedAt || Date.now(),
    },
    markets: markets.map((m) => ({
      id: m.id,
      name: m.name,
      held_at: Number(m.held_at),
      revenue: Number(m.revenue) || 0,
      donation: Number(m.donation) || 0,
      auction: Number(m.auction) || 0,
      orders: Number(m.orders) || 0,
      transferred_at: m.transferred_at || null,
      statement_url: m.statement_url || null,
      minutes_url: m.minutes_url || null,
    })),
    features: { ai: Boolean(env.AI_API_KEY), webhook: Boolean(env.LEAD_WEBHOOK_URL) },
    tracking: {
      ga4: str(env.GA4_MEASUREMENT_ID, 40),
      meta: str(env.META_PIXEL_ID, 40),
      tiktok: str(env.TIKTOK_PIXEL_ID, 40),
    },
  })
}

export async function createLead(request, env) {
  const ip = clientIp(request)
  const allowed = await rateLimit(request, `lead:${ip}`, 10, 300)
  if (!allowed) return tooMany('Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.')

  const body = await readJson(request)
  if (!body) return badRequest('Dữ liệu gửi lên không hợp lệ.')

  // Honeypot: bot điền vào trường ẩn → trả về thành công giả, không lưu.
  if (str(body.website, 200)) return json({ ok: true, filtered: true })

  const type = TYPES.includes(body.type) ? body.type : 'lead'
  const name = str(body.name, 120)
  const phone = str(body.phone, 32)
  const email = str(body.email, 160)
  const consent = body.consent === true
  const errors = {}

  if (type === 'newsletter') {
    if (!isEmail(email)) errors.email = 'Email chưa hợp lệ.'
  } else {
    if (name.length < 2) errors.name = 'Vui lòng nhập họ tên (ít nhất 2 ký tự).'
    if (!isPhone(phone)) errors.phone = 'Số điện thoại chưa hợp lệ.'
    if (email && !isEmail(email)) errors.email = 'Email chưa hợp lệ.'
  }
  if (type !== 'newsletter' && !consent) errors.consent = 'Cần đồng ý xử lý dữ liệu cá nhân.'
  if (Object.keys(errors).length) return json({ error: 'Vui lòng kiểm tra lại thông tin.', fields: errors }, 400)

  const audience = AUDIENCES.includes(body.audience) ? body.audience : null
  const utm = normalizeUtm(body.utm)
  const now = Date.now()
  const row = {
    id: crypto.randomUUID(),
    created_at: now,
    type,
    audience,
    name: type === 'newsletter' && !name ? 'Đăng ký nhận tin' : name,
    phone,
    email,
    company: str(body.company, 160),
    province: str(body.province, 120),
    needs: str(body.needs, 200),
    budget: str(body.budget, 120),
    message: text(body.message, 2000),
    source_page: str(body.page, 180),
    ...utm,
    consent: consent ? 1 : 0,
    status: 'new',
  }

  let result
  try {
    result = await insertLead(env, row)
  } catch (err) {
    console.error('insertLead failed', err && err.message)
    return json({ error: 'Không lưu được thông tin. Vui lòng thử lại.' }, 500)
  }
  if (!result || !result.meta || Number(result.meta.changes) === 0) {
    return json({ error: 'Không lưu được thông tin. Vui lòng thử lại.' }, 500)
  }

  // Adapter ngoài — không chặn phản hồi nếu lỗi.
  try {
    await forwardLead(env, row)
  } catch (err) {
    console.error('forwardLead error', err && err.message)
  }
  if (row.phone) {
    notifyZalo(env, {
      phone: row.phone,
      message: `Cảm ơn ${row.name}, V-HUB đã nhận yêu cầu và sẽ liên hệ trong 15 phút giờ hành chính.`,
    }).catch(() => {})
    if (audience === 'nha-sang-tao') {
      lookupKoc(env, { phone: row.phone }).catch(() => {})
    }
  }

  return json({ ok: true, id: row.id, receivedAt: now })
}

export async function availability(env, url) {
  const studioId = str(url.searchParams.get('studio'), 60)
  const date = str(url.searchParams.get('date'), 10)
  if (!isKnownStudio(studioId)) return notFound('Không tìm thấy studio.')
  if (!isDateKey(date)) return badRequest('Ngày không hợp lệ (định dạng YYYY-MM-DD).')

  const today = vnDateKey()
  const isPast = date < today
  let booked = []
  try {
    booked = await bookedSlots(env, studioId, date)
  } catch (err) {
    console.error('bookedSlots failed', err && err.message)
    return json({ error: 'Không tải được lịch trống. Vui lòng thử lại.' }, 500)
  }
  const bookedIds = new Set(booked.map((b) => b.slot))
  const nowHour = new Date(Date.now() + 7 * 3600 * 1000).getUTCHours()
  const slots = TIME_SLOTS.map((s) => {
    const started = isPast || (date === today && nowHour >= s.start + s.hours)
    return { id: s.id, label: s.label, time: s.time, booked: bookedIds.has(s.id) || started, past: started }
  })
  return json({ ok: true, studio: studioId, date, slots })
}

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  let out = ''
  for (const b of bytes) out += alphabet[b % alphabet.length]
  return `VH${out}`
}

export async function createBooking(request, env) {
  const ip = clientIp(request)
  const allowed = await rateLimit(request, `booking:${ip}`, 6, 600)
  if (!allowed) return tooMany('Bạn đã đặt lịch quá nhiều lần. Vui lòng gọi hotline để được hỗ trợ.')

  const body = await readJson(request)
  if (!body) return badRequest('Dữ liệu gửi lên không hợp lệ.')

  const studioId = str(body.studio_id, 60)
  if (!isKnownStudio(studioId)) return badRequest('Studio không hợp lệ.')

  const date = str(body.date, 10)
  if (!isDateKey(date)) return badRequest('Ngày không hợp lệ.')
  const today = vnDateKey()
  if (date < today) return badRequest('Không thể đặt lịch cho ngày đã qua.')

  const slot = TIME_SLOTS.find((s) => s.id === str(body.slot, 20))
  if (!slot) return badRequest('Ca không hợp lệ.')

  const requestedPkg = str(body.package_id, 40)
  const pkgId = Object.prototype.hasOwnProperty.call(STUDIO_PACKAGE_RATES, requestedPkg) ? requestedPkg : 'studio-only'
  const pkgLabel = { 'studio-only': 'Chỉ studio', tech: 'Kèm kỹ thuật', 'tech-host': 'Kèm kỹ thuật và host' }[pkgId]
  const hours = Number(body.hours) === 8 ? 8 : 4
  const addonIds = Array.isArray(body.addons) ? body.addons.filter((a) => Object.prototype.hasOwnProperty.call(STUDIO_ADDON_RATES, a)).slice(0, 6) : []

  const name = str(body.name, 120)
  const phone = str(body.phone, 32)
  const email = str(body.email, 160)
  if (name.length < 2) return badRequest('Vui lòng nhập họ tên.', { name: 'Bắt buộc' })
  if (!isPhone(phone)) return badRequest('Số điện thoại chưa hợp lệ.', { phone: 'Không hợp lệ' })
  if (email && !isEmail(email)) return badRequest('Email chưa hợp lệ.', { email: 'Không hợp lệ' })
  if (body.consent !== true) return badRequest('Cần đồng ý xử lý dữ liệu cá nhân để đặt lịch.')

  const nowHour = new Date(Date.now() + 7 * 3600 * 1000).getUTCHours()
  if (date === today && nowHour >= slot.start) return badRequest('Ca này đã bắt đầu. Vui lòng chọn ca khác.')

  const existing = await findBookingSlot(env, studioId, date, slot.id)
  if (existing) return json({ error: 'Khung giờ này vừa được đặt. Vui lòng chọn ca khác.', conflict: true }, 409)

  const estimate = estimateStudioCost(studioId, pkgId, hours, addonIds)
  const row = {
    id: crypto.randomUUID(),
    code: makeCode(),
    created_at: Date.now(),
    studio_id: studioId,
    date,
    slot: slot.id,
    hours,
    package_id: pkgId,
    addons: JSON.stringify(addonIds),
    estimate,
    name,
    phone,
    email,
    company: str(body.company, 160),
    notes: text(body.notes, 1000),
    status: 'pending',
    consent: 1,
  }

  try {
    const res = await insertBooking(env, row)
    if (!res || !res.meta || Number(res.meta.changes) === 0) {
      return json({ error: 'Không lưu được đặt chỗ. Vui lòng thử lại.' }, 500)
    }
  } catch (err) {
    const message = String((err && err.message) || '')
    if (/UNIQUE/i.test(message)) {
      return json({ error: 'Khung giờ này vừa được đặt. Vui lòng chọn ca khác.', conflict: true }, 409)
    }
    console.error('insertBooking failed', err && err.message)
    return json({ error: 'Không lưu được đặt chỗ. Vui lòng thử lại.' }, 500)
  }

  // Đặt lịch cũng tạo một lead để đội tư vấn theo dõi trong cùng một hàng đợi.
  try {
    await insertLead(env, {
      id: crypto.randomUUID(),
      created_at: row.created_at,
      type: 'lead',
      audience: 'khac',
      name: row.name,
      phone: row.phone,
      email: row.email,
      company: row.company,
      province: '',
      needs: `Thuê studio ${STUDIO_NAMES[studioId] || studioId}`,
      budget: '',
      message: `${date} · ${slot.label} (${slot.time}) · ${pkgLabel} · ${hours} giờ · mã ${row.code}${row.notes ? ` · ${row.notes}` : ''}`,
      source_page: '#/studio/' + studio.slug,
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
      consent: 1,
      status: 'new',
    })
  } catch (err) {
    console.error('booking lead insert failed', err && err.message)
  }

  notifyZalo(env, {
    phone: row.phone,
    message: `V-HUB đã ghi nhận đặt chỗ ${row.code} cho ${STUDIO_NAMES[studioId] || studioId} ngày ${date}, ${slot.time}. Chúng tôi sẽ gọi xác nhận.`,
  }).catch(() => {})

  return json({
    ok: true,
    booking: { code: row.code, studio_id: row.studio_id, date: row.date, slot: row.slot, hours: row.hours, estimate: row.estimate, status: row.status },
  })
}

export async function chat(request, env) {
  const ip = clientIp(request)
  const allowed = await rateLimit(request, `chat:${ip}`, 30, 300)
  if (!allowed) return tooMany('Bạn gửi hơi nhiều tin nhắn. Vui lòng thử lại sau ít phút.')

  const body = await readJson(request)
  if (!body) return badRequest('Dữ liệu không hợp lệ.')
  const message = text(body.message, 1200)
  if (!message) return badRequest('Vui lòng nhập câu hỏi.')
  if (!env.AI_API_KEY) return json({ error: 'Trợ lý AI chưa được bật.', missingSecret: 'AI_API_KEY' }, 503)

  const reply = await askAssistant(env, { message, history: Array.isArray(body.history) ? body.history : [] })
  if (!reply) {
    return json({
      reply:
        'Kết nối trợ lý AI đang gián đoạn. Bạn có thể để lại số điện thoại để chuyên viên V-HUB gọi lại trong 15 phút giờ hành chính, hoặc gọi hotline 028 7300 8686.',
      mode: 'fallback',
    })
  }
  return json({ reply, mode: 'ai' })
}

export async function health(env) {
  return json({ ok: true, service: 'vhub', now: Date.now(), ai: Boolean(env.AI_API_KEY) })
}
