/** Tiện ích DOM tối giản — không phụ thuộc thư viện. */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ESC[c])
}

export function el(html) {
  const tpl = document.createElement('template')
  tpl.innerHTML = String(html).trim()
  return tpl.content.firstElementChild
}

export const $ = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel))

export function on(root, event, selector, handler) {
  if (!root) return () => {}
  const listener = (e) => {
    const target = e.target instanceof Element ? e.target.closest(selector) : null
    if (target && root.contains(target)) handler(e, target)
  }
  root.addEventListener(event, listener)
  return () => root.removeEventListener(event, listener)
}

export function debounce(fn, wait = 200) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

export function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch (_) {
    return false
  }
}

export function setTitle(title) {
  document.title = title
}

/** Gắn/thay meta theo tên hoặc property. */
export function setMeta(key, value, attr = 'name') {
  if (!value) return
  let node = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!node) {
    node = document.createElement('meta')
    node.setAttribute(attr, key)
    document.head.appendChild(node)
  }
  node.setAttribute('content', value)
}

export function setCanonical(href) {
  let node = document.head.querySelector('link[rel="canonical"]')
  if (!node) {
    node = document.createElement('link')
    node.rel = 'canonical'
    document.head.appendChild(node)
  }
  node.href = href
}

/** JSON-LD theo trang — xoá bản cũ trước khi thêm mới. */
export function setJsonLd(id, data) {
  const prev = document.getElementById(id)
  if (prev) prev.remove()
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export function scrollTop(behavior = 'auto') {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : behavior })
}

/** Quan sát phần tử để chạy hiệu ứng xuất hiện (tôn trọng prefers-reduced-motion). */
export function observeReveal(root = document) {
  const nodes = $$('.reveal', root)
  if (!nodes.length) return
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    nodes.forEach((n) => n.classList.add('is-visible'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  nodes.forEach((n) => io.observe(n))
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0))
}
