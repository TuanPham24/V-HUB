/** Định dạng số, tiền, ngày giờ theo múi giờ Asia/Ho_Chi_Minh. */

const TZ = 'Asia/Ho_Chi_Minh'
const dateFmt = new Intl.DateTimeFormat('vi-VN', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('vi-VN', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false })
const DOW_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function toDate(input) {
  if (input instanceof Date) return input
  if (typeof input === 'number') return new Date(input)
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return new Date(`${input}T00:00:00+07:00`)
  return new Date(input)
}

export function formatNumber(value) {
  const n = Number(value) || 0
  return n.toLocaleString('vi-VN')
}

export function formatCurrency(value) {
  return `${formatNumber(Math.round(Number(value) || 0))}đ`
}

/** Rút gọn cho số liệu lớn: 1,2 tỷ · 350 triệu. */
export function formatCompact(value) {
  const n = Number(value) || 0
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1).replace('.', ',')} tỷ`
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1).replace('.', ',')} triệu`
  return formatNumber(n)
}

export function formatDate(input) {
  if (!input) return '—'
  return dateFmt.format(toDate(input))
}

export function formatTime(input) {
  if (!input) return '—'
  return timeFmt.format(toDate(input))
}

export function formatDateTime(input) {
  if (!input) return '—'
  return `${formatTime(input)} · ${formatDate(input)}`
}

export function vnDateKey(input = Date.now()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(toDate(input))
  return parts
}

export function weekdayShort(input) {
  const d = toDate(input)
  const idx = Number(new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }) ? new Date(d).getUTCDay() : 0)
  // Dùng trực tiếp ngày theo giờ VN để tránh lệch múi giờ.
  const vn = new Date(d.getTime() + 7 * 3600 * 1000)
  const map = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  return map[vn.getUTCDay()] || DOW_SHORT[idx] || 'T2'
}

export function weekdayLong(input) {
  const map = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
  const vn = new Date(toDate(input).getTime() + 7 * 3600 * 1000)
  return map[vn.getUTCDay()]
}

export function dayNumber(input) {
  const vn = new Date(toDate(input).getTime() + 7 * 3600 * 1000)
  return String(vn.getUTCDate()).padStart(2, '0')
}

export function monthNumber(input) {
  const vn = new Date(toDate(input).getTime() + 7 * 3600 * 1000)
  return String(vn.getUTCMonth() + 1).padStart(2, '0')
}

export function addDays(input, days) {
  return new Date(toDate(input).getTime() + days * 86400000)
}

/** Các phần của đồng hồ đếm ngược. */
export function countdownParts(target, now = Date.now()) {
  const diff = Math.max(0, Number(target) - now)
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: diff <= 0,
    diff,
  }
}

export function pad2(n) {
  return String(n).padStart(2, '0')
}

export function formatCountdownText(target, now = Date.now()) {
  const p = countdownParts(target, now)
  if (p.done) return 'Đã bắt đầu'
  if (p.days > 0) return `Còn ${p.days} ngày ${pad2(p.hours)}:${pad2(p.minutes)}`
  return `Còn ${pad2(p.hours)}:${pad2(p.minutes)}:${pad2(p.seconds)} nữa`
}

export function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return 'VH'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function isValidPhone(phone) {
  const cleaned = String(phone || '').replace(/[\s.\-()]/g, '')
  return /^(\+?84|0)(\d{9,10})$/.test(cleaned)
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim())
}

export function downloadFile(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
