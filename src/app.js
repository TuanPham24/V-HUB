/** V-HUB — điểm vào ứng dụng: router hash, khung chung, SEO, đo lường, i18n. */

import { setTitle, setMeta, setCanonical, setJsonLd, observeReveal, scrollTop } from './lib/dom.js'
import { initI18n, onLangChange, tr } from './lib/i18n.js'
import { loadBootstrap, captureUtm, track } from './lib/store.js'
import { injectTracking } from './lib/analytics.js'
import { headerMarkup, footerMarkup, ctaBarMarkup, floatingContactMarkup, attachLayout, markActiveNav, updateHeaderLive } from './components/layout.js'
import { attachAccordions, attachReminders, attachDocButtons, startCountdowns, animateStats, toast } from './components/ui.js'
import { attachLeadForm } from './components/forms.js'
import { openChat, closeChat } from './components/chat.js'
import { getLives } from './lib/data.js'

import * as home from './pages/home.js'
import * as solutions from './pages/solutions.js'
import * as studio from './pages/studio.js'
import * as koc from './pages/koc.js'
import * as chophien from './pages/chophien.js'
import * as live from './pages/live.js'
import * as academy from './pages/academy.js'
import * as stories from './pages/stories.js'
import * as contact from './pages/contact.js'
import * as admin from './pages/admin.js'

const ROUTES = {
  '': () => home.render(),
  'giai-phap': (ctx) => solutions.render(ctx),
  studio: (ctx) => studio.render(ctx),
  kocviet: (ctx) => koc.render(ctx),
  'cho-phien': (ctx) => chophien.render(ctx),
  'lich-live': () => live.render(),
  'hoc-vien': (ctx) => academy.render(ctx),
  'du-an': (ctx) => stories.renderCases(ctx),
  'tin-tuc': (ctx) => stories.renderNews(ctx),
  've-v-hub': () => stories.renderAbout(),
  'lien-he': (ctx) => contact.renderContact(ctx),
  'chinh-sach-bao-mat': () => contact.renderPrivacy(),
  'dieu-khoan': () => contact.renderTerms(),
  'cam-on': (ctx) => contact.renderThanks(ctx),
  admin: () => admin.render(),
}

const app = document.getElementById('app')
let retryCount = 0
let countdownRefreshPending = false
let lastAutoRefresh = 0
let renderedHash = ''

/* ==========================================================================
   Cầu nối kiểm thử tất định (deterministic test hooks)
   Trước đây test phải ngủ một khoảng cố định rồi mới đọc DOM, trong khi lần
   render đầu còn chờ fetch('/api/bootstrap') → cùng một mã nguồn lúc PASS lúc
   FAIL. Từ đây mỗi lần render phát sự kiện `vhub:rendered`, và mọi thứ đều
   await được: await window.__VHUB_APP__.nav('#/studio').
   ========================================================================== */

const renderWaiters = new Set()

function normalizeHash(target) {
  const raw = String(target == null ? '' : target).trim()
  if (!raw || raw === '/' || raw === '#/' || raw === '#') return '#/'
  const body = raw.startsWith('#') ? raw.slice(1) : raw
  return `#${body.startsWith('/') ? body : `/${body}`}`
}

function currentHash() {
  return normalizeHash(location.hash || '#/')
}

function notifyRendered(hashValue) {
  renderedHash = hashValue
  try {
    document.dispatchEvent(new CustomEvent('vhub:rendered', { detail: { hash: hashValue } }))
  } catch (_) {
    /* môi trường không hỗ trợ CustomEvent */
  }
  for (const waiter of Array.from(renderWaiters)) {
    if (!waiter.match(hashValue)) continue
    renderWaiters.delete(waiter)
    waiter.resolve({ hash: hashValue, timedOut: false })
  }
}

function waitForRender(hashValue, timeout = 5000) {
  return new Promise((resolve) => {
    const waiter = { match: (h) => h === hashValue, resolve }
    renderWaiters.add(waiter)
    setTimeout(() => {
      if (!renderWaiters.delete(waiter)) return
      resolve({ hash: renderedHash, timedOut: true })
    }, timeout)
  })
}

function waitForElement(selector, timeout = 5000, root = document) {
  return new Promise((resolve) => {
    const found = root.querySelector(selector)
    if (found) {
      resolve(found)
      return
    }
    const scope = root === document ? document.body : root
    if (!scope) {
      resolve(null)
      return
    }
    const observer = new MutationObserver(() => {
      const node = root.querySelector(selector)
      if (!node) return
      observer.disconnect()
      clearTimeout(timer)
      resolve(node)
    })
    observer.observe(scope, { childList: true, subtree: true })
    const timer = setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, timeout)
  })
}

/** Điều hướng và CHỜ render xong — dùng trong test thay cho setTimeout. */
async function nav(target, timeout = 5000) {
  const hashValue = normalizeHash(target)
  const done = waitForRender(hashValue, timeout)
  if (currentHash() === hashValue) renderRoute()
  else location.hash = hashValue
  return done
}

window.__VHUB_APP__ = {
  ready: false,
  nav,
  waitFor: waitForElement,
  hash: () => renderedHash,
  onRendered: (fn) => {
    const handler = (e) => fn(e.detail)
    document.addEventListener('vhub:rendered', handler)
    return () => document.removeEventListener('vhub:rendered', handler)
  },
}

/** Không tự render lại khi người dùng đang tương tác (tránh mất focus/nội dung đang nhập). */
function canAutoRefresh() {
  if (document.querySelector('.modal')) return false
  const chat = document.getElementById('chat-panel')
  if (chat && chat.classList.contains('is-open')) return false
  const focused = document.activeElement
  if (focused && /^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName)) return false
  return Date.now() - lastAutoRefresh > 20000
}

function parseHash() {
  const raw = (location.hash || '').replace(/^#/, '')
  const [pathAndQuery, anchor = ''] = raw.split('#')
  const [pathname, search = ''] = pathAndQuery.split('?')
  const segments = pathname.split('/').filter(Boolean)
  return { segments, query: new URLSearchParams(search), anchor, pathname: `/${segments.join('/')}` }
}

function pageShell(content) {
  return `${headerMarkup()}${content}${footerMarkup()}${ctaBarMarkup()}${floatingContactMarkup()}`
}

function applyMeta(page, pathname) {
  const title = page.title || 'V-HUB'
  const description = page.description || ''
  setTitle(title)
  setMeta('description', description)
  setMeta('og:title', title, 'property')
  setMeta('og:description', description, 'property')
  setMeta('twitter:title', title)
  setMeta('twitter:description', description)
  const url = `https://vhub.vn/#${pathname === '/' ? '/' : pathname}`
  setMeta('og:url', url, 'property')
  setCanonical(url)
  setJsonLd('page-jsonld', page.jsonLd || null)
}

function errorView(message) {
  return `<main id="main"><div class="container"><div class="nf">
    <span class="nf__code">!</span>
    <h1>${tr('Có lỗi khi tải trang', 'Something went wrong')}</h1>
    <p class="lede">${tr('Vui lòng thử lại. Nếu lỗi tiếp diễn, gọi hotline 028 7300 8686.', 'Please try again. If the issue persists, call 028 7300 8686.')}</p>
    <p class="form-note">${String(message || '').slice(0, 240)}</p>
    <button class="btn" type="button" onclick="location.reload()">${tr('Tải lại trang', 'Reload')}</button>
  </div></div></main>`
}

function renderRoute() {
  const { segments, query, anchor, pathname } = parseHash()
  const key = segments[0] || ''
  const handler = ROUTES[key]

  // Giữ vị trí cuộn khi chỉ đổi ngôn ngữ
  const keepScroll = renderRoute._langSwitch === true
  renderRoute._langSwitch = false

  let page = null
  try {
    page = handler ? handler({ segments, query, anchor }) : null
  } catch (err) {
    console.error(err)
    page = { title: 'Lỗi tải trang — V-HUB', description: '', html: errorView(err && err.message) }
  }
  if (!page) page = contact.render404()

  app.innerHTML = pageShell(page.html)
  applyMeta(page, pathname)

  // Lịch live phải có TRƯỚC khi dựng header, nếu không huy hiệu LIVE phụ thuộc
  // vào lần render trước đó (nguồn sai lệch giữa các lần tải).
  window.__VHUB_LIVES__ = getLives()
  window.__VHUB_ATTACH_FORMS__ = (root) => attachLeadForm(root)

  try {
    attachLayout(app)
    attachAccordions(app)
    attachReminders(app)
    attachDocButtons(app)
    attachLeadForm(app)
    startCountdowns(app, () => {
      // Khi đồng hồ về 0 (phiên bắt đầu/kết thúc), render lại để tự đổi trạng thái.
      // Chỉ làm khi người dùng không tương tác và không quá dày.
      if (countdownRefreshPending || !canAutoRefresh()) return
      countdownRefreshPending = true
      lastAutoRefresh = Date.now()
      setTimeout(() => {
        countdownRefreshPending = false
        renderRoute()
      }, 1500)
    })
    observeReveal(app)
    animateStats(app)
    if (typeof page.mount === 'function') page.mount(app)
    markActiveNav(pathname)
    updateHeaderLive()
  } catch (err) {
    console.error(err)
    toast(tr('Một phần giao diện không tải được. Vui lòng tải lại trang.', 'Part of the page failed to load. Please reload.'), 'error')
  }

  if (anchor) {
    const target = document.getElementById(anchor)
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    }
  } else if (!keepScroll) {
    scrollTop()
  }

  track('page_view', { page_path: pathname || '/', language: document.documentElement.lang })
  document.body.classList.add('has-cta-bar')

  notifyRendered(currentHash())
}

function boot() {
  initI18n()
  captureUtm()

  let booted = false
  const firstRender = () => {
    if (booted) return
    booted = true
    try {
      renderRoute()
    } catch (err) {
      console.error(err)
      app.innerHTML = pageShell(errorView(err && err.message))
      notifyRendered(currentHash())
    }
    document.documentElement.dataset.vhub = 'ready'
    window.__VHUB_APP__.ready = true
    try {
      document.dispatchEvent(new CustomEvent('vhub:ready'))
    } catch (_) {}
  }

  // Nếu API chậm/treo, vẫn phải dựng được giao diện (không kẹt ở màn hình khởi động).
  const fallback = setTimeout(firstRender, 4000)

  loadBootstrap()
    .catch(() => null)
    .then(() => {
      injectTracking()
      clearTimeout(fallback)
      firstRender()
      retryCount = 0
    })
    .catch((err) => {
      clearTimeout(fallback)
      console.error(err)
      firstRender()
    })
}

window.addEventListener('hashchange', renderRoute)

onLangChange(() => {
  renderRoute._langSwitch = true
  renderRoute()
})

// Mở trợ lý tư vấn từ bất kỳ nút nào có data-open-chat
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-open-chat]')
  if (trigger) {
    e.preventDefault()
    const panel = document.getElementById('floating-panel')
    if (panel) panel.classList.remove('is-open')
    openChat()
    return
  }
  const chatPanel = document.getElementById('chat-panel')
  if (chatPanel && chatPanel.classList.contains('is-open') && !e.target.closest('#chat-panel') && !e.target.closest('#floating-contact')) {
    closeChat()
  }
})

document.addEventListener('click', (e) => {
  const skip = e.target.closest('[data-skip-link]')
  if (!skip) return
  e.preventDefault()
  const main = document.getElementById('main')
  if (main) {
    main.setAttribute('tabindex', '-1')
    main.focus({ preventScroll: false })
  }
})

window.addEventListener('online', () => toast(tr('Đã có kết nối trở lại.', 'Back online.'), 'success'))
window.addEventListener('offline', () => toast(tr('Mất kết nối mạng. Một số chức năng có thể không dùng được.', 'You are offline. Some features may not work.'), 'error'))

window.onerror = (message, _source, _lineno, _colno, error) => {
  console.error('V-HUB runtime error:', message, error)
  if (retryCount < 1) retryCount += 1
}

boot()
