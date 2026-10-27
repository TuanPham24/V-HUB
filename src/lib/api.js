/** Lớp gọi API — tất cả đường dẫn tương đối, cùng origin với Worker. */

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data || null
  }
}

export async function api(path, options = {}) {
  const { method = 'GET', body, token, headers = {}, raw = false, timeoutMs = 12000 } = options
  const opts = { method, headers: { Accept: 'application/json', ...headers } }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  if (token) opts.headers.Authorization = `Bearer ${token}`
  // Chặn trường hợp request treo vô hạn (mạng rớt giữa chừng) → luôn có lỗi để UI hiển thị.
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    opts.signal = AbortSignal.timeout(timeoutMs)
  }

  let res
  try {
    res = await fetch(path, opts)
  } catch (err) {
    const timedOut = err && (err.name === 'TimeoutError' || err.name === 'AbortError')
    throw new ApiError(
      timedOut
        ? 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.'
        : 'Không kết nối được tới máy chủ. Vui lòng kiểm tra mạng và thử lại.',
      0,
    )
  }

  if (raw) {
    if (!res.ok) throw new ApiError('Yêu cầu không thành công.', res.status)
    return res
  }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch (_) {
      data = { raw: text }
    }
  }
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || 'Yêu cầu không thành công.'
    throw new ApiError(message, res.status, data)
  }
  return data
}

export const apiGet = (path, options) => api(path, { ...options, method: 'GET' })
export const apiPost = (path, body, options) => api(path, { ...options, method: 'POST', body })

export function getBootstrap() {
  return apiGet('/api/bootstrap')
}

export function submitLead(payload) {
  return apiPost('/api/leads', payload)
}

export function getAvailability(studioId, date) {
  return apiGet(`/api/bookings/availability?studio=${encodeURIComponent(studioId)}&date=${encodeURIComponent(date)}`)
}

export function createBooking(payload) {
  return apiPost('/api/bookings', payload)
}

export function chatAsk(payload) {
  return apiPost('/api/chat', payload, { timeoutMs: 30000 })
}

export function adminLogin(password) {
  return apiPost('/api/admin/login', { password })
}

export function adminLogout(token) {
  return apiPost('/api/admin/logout', {}, { token })
}

export function adminGet(path, token) {
  return apiGet(path, { token })
}

export function adminPatch(path, body, token) {
  return api(path, { method: 'PATCH', body, token })
}

export function adminPut(path, body, token) {
  return api(path, { method: 'PUT', body, token })
}

export function adminPost(path, body, token) {
  return api(path, { method: 'POST', body, token })
}

export function adminDelete(path, token) {
  return api(path, { method: 'DELETE', token })
}

export async function adminExportCsv(token) {
  const res = await fetch('/api/admin/export.csv', { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    let message = 'Không xuất được CSV.'
    try {
      const data = await res.json()
      if (data && data.error) message = data.error
    } catch (_) {}
    throw new ApiError(message, res.status)
  }
  return res.blob()
}
