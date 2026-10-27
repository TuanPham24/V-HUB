/** Tiện ích HTTP, kiểm tra dữ liệu và giới hạn tần suất phía máy chủ. */

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
  })
}

export function badRequest(message, fields) {
  return json({ error: message, fields: fields || undefined }, 400)
}

export function unauthorized(message = 'Cần đăng nhập.') {
  return json({ error: message }, 401)
}

export function forbidden(message = 'Không có quyền.') {
  return json({ error: message }, 403)
}

export function notFound(message = 'Không tìm thấy.') {
  return json({ error: message }, 404)
}

export function tooMany(message = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.') {
  return json({ error: message }, 429)
}

export function serverError(message = 'Máy chủ gặp sự cố. Vui lòng thử lại.') {
  return json({ error: message }, 500)
}

export function missingSecret(name) {
  return json({ error: `Chưa cấu hình ${name}.`, missingSecret: name }, 503)
}

export async function readJson(request) {
  try {
    const data = await request.json()
    return data && typeof data === 'object' ? data : null
  } catch (_) {
    return null
  }
}

/** Chuỗi sạch: bỏ ký tự điều khiển, cắt độ dài. */
export function str(value, max = 500) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Giữ xuống dòng cho textarea nhưng vẫn bỏ ký tự điều khiển. */
export function text(value, max = 2000) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max)
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim())
}

export function isPhone(value) {
  const cleaned = String(value || '').replace(/[\s.\-()]/g, '')
  return /^(\+?84|0)\d{9,10}$/.test(cleaned)
}

export function isDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))
}

export function isHttpUrl(value) {
  try {
    const u = new URL(String(value))
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch (_) {
    return false
  }
}

export function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown'
}

/**
 * Giới hạn tần suất dùng endpoint nội bộ của nền tảng.
 * Lỗi mạng → cho phép (fail-open) để không chặn người dùng thật.
 */
export async function rateLimit(request, key, limit, windowSeconds) {
  try {
    const res = await fetch(`https://${request.headers.get('host')}/__nexrall/ratelimit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, limit, windowSeconds }),
    })
    if (!res.ok) return true
    const data = await res.json()
    return data && data.allowed !== false
  } catch (_) {
    return true
  }
}

/** So sánh chuỗi theo thời gian tương đối ổn định (giảm rủi ro timing). */
export async function safeEqual(a, b) {
  const enc = new TextEncoder()
  const ha = await crypto.subtle.digest('SHA-256', enc.encode(String(a || '')))
  const hb = await crypto.subtle.digest('SHA-256', enc.encode(String(b || '')))
  const va = new Uint8Array(ha)
  const vb = new Uint8Array(hb)
  let diff = 0
  for (let i = 0; i < va.length; i += 1) diff |= va[i] ^ vb[i]
  return diff === 0
}

/** CSV an toàn cho Excel: bọc nháy kép, chống formula injection. */
export function csvCell(value) {
  let v = String(value == null ? '' : value)
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`
  return `"${v.replace(/"/g, '""')}"`
}
