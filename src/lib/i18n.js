/**
 * Hạ tầng i18n tối giản (không phụ thuộc thư viện).
 * - Tiếng Việt là ngôn ngữ gốc: mọi chuỗi không có bản dịch sẽ hiển thị tiếng Việt.
 * - Tiếng Anh áp dụng cho khung chung, trang chủ, Giải pháp nhãn hàng và Studio.
 * - Lựa chọn ngôn ngữ lưu ở localStorage (chỉ là tuỳ chọn giao diện, không phải dữ liệu người dùng).
 */

const KEY = 'vhub.lang'
const SUPPORTED = ['vi', 'en']
let current = 'vi'
const listeners = new Set()

function read() {
  try {
    const fromUrl = new URLSearchParams(location.search).get('lang')
    if (fromUrl && SUPPORTED.includes(fromUrl)) return fromUrl
    const saved = localStorage.getItem(KEY)
    if (saved && SUPPORTED.includes(saved)) return saved
  } catch (_) {
    /* môi trường không có localStorage */
  }
  return 'vi'
}

export function initI18n() {
  current = read()
  try {
    document.documentElement.lang = current
  } catch (_) {}
  return current
}

export function getLang() {
  return current
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return
  current = lang
  try {
    localStorage.setItem(KEY, lang)
    document.documentElement.lang = lang
  } catch (_) {}
  listeners.forEach((fn) => fn(lang))
}

export function onLangChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Dịch nhanh tại chỗ: tr('Tiếng Việt', 'English'). Thiếu bản dịch → tiếng Việt. */
export function tr(vi, en) {
  if (current === 'en' && en) return en
  return vi
}

export function isEnglish() {
  return current === 'en'
}
