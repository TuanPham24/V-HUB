/** Xác thực quản trị: mật khẩu trong secret ADMIN_PASSWORD, phiên lưu ở env.KV (có TTL). */

import { json, readJson, unauthorized, missingSecret, safeEqual, rateLimit, clientIp, tooMany, str } from './http.js'

export const SESSION_TTL_SECONDS = 8 * 60 * 60

function newToken() {
  const a = crypto.randomUUID().replace(/-/g, '')
  const b = crypto.randomUUID().replace(/-/g, '')
  return `${a}${b.slice(0, 12)}`
}

export async function login(request, env) {
  if (!env.ADMIN_PASSWORD) return missingSecret('ADMIN_PASSWORD')
  const ip = clientIp(request)
  const allowed = await rateLimit(request, `admin-login:${ip}`, 8, 600)
  if (!allowed) return tooMany('Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 10 phút.')

  const body = await readJson(request)
  const password = str(body && body.password, 200)
  if (!password) return json({ error: 'Vui lòng nhập mật khẩu.' }, 400)

  const ok = await safeEqual(password, env.ADMIN_PASSWORD)
  if (!ok) return json({ error: 'Mật khẩu không đúng.' }, 401)

  const token = newToken()
  try {
    await env.KV.put(`admin:${token}`, JSON.stringify({ ip, at: Date.now() }), { expirationTtl: SESSION_TTL_SECONDS })
  } catch (err) {
    console.error('KV session write failed', err && err.message)
    return json({ error: 'Không tạo được phiên đăng nhập. Vui lòng thử lại.' }, 500)
  }
  return json({ ok: true, token, expiresIn: SESSION_TTL_SECONDS })
}

export async function logout(_request, env, token) {
  if (token) {
    try {
      await env.KV.delete(`admin:${token}`)
    } catch (_) {}
  }
  return json({ ok: true })
}

/** Trả về { token } nếu hợp lệ, hoặc { error: Response }. */
export async function requireAdmin(request, env) {
  const header = request.headers.get('Authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) return { error: unauthorized('Cần đăng nhập quản trị.') }
  let raw = null
  try {
    raw = await env.KV.get(`admin:${token}`)
  } catch (err) {
    console.error('KV session read failed', err && err.message)
  }
  if (!raw) return { error: unauthorized('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.') }
  return { token }
}
