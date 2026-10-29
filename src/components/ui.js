/**
 * Thư viện component dùng chung cho toàn site.
 * Quy ước: hàm trả về chuỗi HTML (đã escape dữ liệu động), hàm attach* gắn hành vi.
 */

import { esc, $$, el, on, prefersReducedMotion } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { formatDate, formatDateTime, formatNumber, formatTime, pad2, downloadFile } from '../lib/format.js'
import { liveState, buildIcs, liveEndsAt } from '../lib/catalog-schedule.js'
import { PLATFORMS } from '../lib/catalog-site.js'
import { tr } from '../lib/i18n.js'

/* ---------- Media & placeholder ---------- */
export function kocPortrait(k) {
  const initials = k.name.split(' ').map((p) => p[0]).join('').slice(0, 2)
  return `<span class="koc-initials" aria-hidden="true">${esc(initials)}</span>
    ${k.avatarSrc ? `<img class="koc-portrait" src="${esc(k.avatarSrc)}" alt="${esc(tr(`Chân dung AI minh họa cho ${k.name}`, `AI-generated illustrative portrait of ${k.name}`))}" loading="lazy" decoding="async" onerror="this.remove()" />` : ''}
    <span class="koc-ai-label">${tr('Ảnh AI minh họa', 'AI illustration')}</span>`
}

export function media({ src, alt = '', label = 'Ảnh thật đang cập nhật', ratio = '16x9', className = '', badge = '', dark = false, caption = '', imgClass = '' }) {
  return `<figure class="media media--${ratio} ${dark ? 'media--on-dark' : ''} ${className}">
    <div class="media__placeholder">${icon('camera')}<span>${esc(label)}</span></div>
    ${src ? `<img class="media__img ${imgClass}" src="${esc(src)}" alt="${esc(alt || label)}" loading="lazy" decoding="async" onerror="this.remove()" />` : ''}
    ${badge ? `<div class="media__badge">${badge}</div>` : ''}
    ${caption ? `<figcaption class="media__caption">${esc(caption)}</figcaption>` : ''}
  </figure>`
}

/* ---------- Huy hiệu ---------- */
export function badgeLive(label = 'LIVE') {
  return `<span class="badge badge--live"><span class="badge__dot" aria-hidden="true"></span>${esc(label)}</span>`
}

export function badgeVerified(text = 'Đã định danh KOCViet') {
  return `<span class="badge badge--verified">${icon('verified')}${esc(text)}</span>`
}

export function badgeDemo(text = 'Dữ liệu minh hoạ') {
  return `<span class="badge badge--demo">${esc(text)}</span>`
}

export function badgeNew(text = 'Mới') {
  return `<span class="badge badge--new">${esc(text)}</span>`
}

/* ---------- Nút ---------- */
export function btn({ label, href, variant = '', iconName = '', className = '', attrs = '', type = 'button', ariaLabel = '' }) {
  const cls = `btn ${variant ? `btn--${variant}` : ''} ${className}`.trim()
  const inner = `${iconName ? icon(iconName, 'btn__icon') : ''}<span>${esc(label)}</span>`
  if (href) {
    return `<a class="${cls}" href="${esc(href)}" ${ariaLabel ? `aria-label="${esc(ariaLabel)}"` : ''} ${attrs}>${inner}</a>`
  }
  return `<button class="${cls}" type="${type}" ${ariaLabel ? `aria-label="${esc(ariaLabel)}"` : ''} ${attrs}>${inner}</button>`
}

export function linkArrow(label, href, className = 'btn btn--link') {
  return `<a class="${className}" href="${esc(href)}"><span>${esc(label)}</span>${icon('arrowRight', 'btn__arrow btn__icon')}</a>`
}

/* ---------- Section head ---------- */
export function sectionHead({ kicker, title, sub, align = 'left', action = '', level = 2, className = '' }) {
  return `<div class="section-head ${align === 'center' ? 'section-head--center' : ''} ${action ? 'section-head--row' : ''} ${className}">
    <div class="section-head__text">
      ${kicker ? `<span class="kicker">${esc(kicker)}</span>` : ''}
      <h${level}>${esc(title)}</h${level}>
      ${sub ? `<p class="lede">${esc(sub)}</p>` : ''}
    </div>
    ${action || ''}
  </div>`
}

export function iconTile(name, variant = '') {
  return `<span class="icon-tile ${variant ? `icon-tile--${variant}` : ''}" aria-hidden="true">${icon(name)}</span>`
}

/* ---------- Trạng thái ---------- */
export function emptyState({ title, text, action = '' }) {
  return `<div class="empty-state">
    <div class="empty-state__art" aria-hidden="true"><span></span><span></span><span></span></div>
    <strong>${esc(title)}</strong>
    ${text ? `<p>${esc(text)}</p>` : ''}
    ${action}
  </div>`
}

export function skeletonCards(count = 3, ratio = '4x5') {
  return `<div class="grid grid--3" aria-hidden="true">${Array.from({ length: count })
    .map(
      () => `<div class="card" style="padding:10px">
        <div class="skeleton media--${ratio}" style="border-radius:14px"></div>
        <div class="skeleton" style="height:14px;width:70%"></div>
        <div class="skeleton" style="height:12px;width:45%"></div>
      </div>`,
    )
    .join('')}</div>`
}

/* ---------- Toast ---------- */
export function toast(message, type = 'info', timeout = 4200) {
  const stack = document.getElementById('toast-stack')
  if (!stack) return
  const node = el(`<div class="toast toast--${type}" role="status">${icon(type === 'error' ? 'alert' : type === 'success' ? 'check' : 'info')}<span>${esc(message)}</span></div>`)
  stack.appendChild(node)
  setTimeout(() => {
    node.style.opacity = '0'
    node.style.transition = 'opacity 200ms'
    setTimeout(() => node.remove(), 220)
  }, timeout)
}

/* ---------- Modal ---------- */
let lastFocused = null

export function openModal(html, options = {}) {
  closeModal()
  lastFocused = document.activeElement
  const wrap = el(`<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(options.label || 'Hộp thoại')}">
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__panel">
      <button class="modal__close" type="button" aria-label="Đóng" data-modal-close>${icon('close')}</button>
      ${html}
    </div>
  </div>`)
  document.body.appendChild(wrap)
  document.body.style.overflow = 'hidden'
  const closeBtn = wrap.querySelector('.modal__close')
  if (closeBtn) closeBtn.focus()
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal-close]')) closeModal()
  })
  const onKey = (e) => {
    if (e.key === 'Escape') closeModal()
    if (e.key === 'Tab') {
      const focusables = $$('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])', wrap).filter((n) => !n.disabled)
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }
  document.addEventListener('keydown', onKey)
  wrap._onKey = onKey
  return wrap
}

export function closeModal() {
  const existing = document.querySelector('.modal')
  if (existing) {
    if (existing._onKey) document.removeEventListener('keydown', existing._onKey)
    existing.remove()
  }
  document.body.style.overflow = ''
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus()
}

/* ---------- Accordion ---------- */
export function accordion(items, idPrefix = 'acc') {
  return `<div class="accordion">${items
    .map(
      (item, i) => `<div class="accordion-item">
      <button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="${idPrefix}-${i}" id="${idPrefix}-btn-${i}">
        <span>${esc(item.title)}</span>${icon('chevronDown')}
      </button>
      <div class="accordion-panel" id="${idPrefix}-${i}" role="region" aria-labelledby="${idPrefix}-btn-${i}">${item.body}</div>
    </div>`,
    )
    .join('')}</div>`
}

const accordionRoots = new WeakSet()

export function attachAccordions(root = document) {
  if (!root || accordionRoots.has(root)) return
  accordionRoots.add(root)
  on(root, 'click', '.accordion-trigger', (_e, trigger) => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true'
    const panel = document.getElementById(trigger.getAttribute('aria-controls'))
    trigger.setAttribute('aria-expanded', String(!expanded))
    if (panel) panel.classList.toggle('is-open', !expanded)
  })
}

/* ---------- Tabs (nút) ---------- */
export function tabButton({ label, active = false, attrs = '', count = '' }) {
  return `<button class="tab ${active ? 'is-active' : ''}" type="button" role="tab" aria-selected="${active ? 'true' : 'false'}" ${attrs}>${esc(label)}${count ? `<span class="badge">${esc(count)}</span>` : ''}</button>`
}

/* ---------- Breadcrumb ---------- */
export function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="Đường dẫn">${items
    .map((item, i) => {
      if (i === items.length - 1) return `<span aria-current="page">${esc(item.label)}</span>`
      return `<a href="${esc(item.href)}">${esc(item.label)}</a><span aria-hidden="true">/</span>`
    })
    .join('')}</nav>`
}

/* ---------- Đồng hồ đếm ngược ---------- */
export function countdownMarkup({ target, variant = '', id = '' }) {
  return `<div class="countdown ${variant}" ${id ? `id="${id}"` : ''} data-countdown="${Number(target)}" role="timer" aria-live="off">
    <div class="countdown__box"><span class="countdown__num" data-cd="days">00</span><span class="countdown__label">${tr('Ngày', 'Days')}</span></div>
    <div class="countdown__box"><span class="countdown__num" data-cd="hours">00</span><span class="countdown__label">${tr('Giờ', 'Hours')}</span></div>
    <div class="countdown__box"><span class="countdown__num" data-cd="minutes">00</span><span class="countdown__label">${tr('Phút', 'Min')}</span></div>
    <div class="countdown__box"><span class="countdown__num" data-cd="seconds">00</span><span class="countdown__label">${tr('Giây', 'Sec')}</span></div>
  </div>`
}

let countdownTimer = null

export function startCountdowns(root = document, onDone) {
  const nodes = $$('[data-countdown]', root)
  if (!nodes.length) return
  const tick = () => {
    const now = Date.now()
    nodes.forEach((node) => {
      if (!document.body.contains(node)) return
      const target = Number(node.dataset.countdown)
      const done = target <= now
      const diff = Math.max(0, target - now)
      const secs = Math.floor(diff / 1000)
      const parts = { days: Math.floor(secs / 86400), hours: Math.floor((secs % 86400) / 3600), minutes: Math.floor((secs % 3600) / 60), seconds: secs % 60 }
      Object.entries(parts).forEach(([key, val]) => {
        const cell = node.querySelector(`[data-cd="${key}"]`)
        if (cell) cell.textContent = pad2(val)
      })
      if (done && !node.dataset.done) {
        node.dataset.done = '1'
        if (typeof onDone === 'function') onDone(node)
      }
    })
  }
  tick()
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(tick, 1000)
}

/* ---------- Bộ đếm số liệu ---------- */
/**
 * `data-stat-final` là giá trị CUỐI, ghi ngay khi render — test và SEO đọc thuộc tính này
 * thay vì đọc text đang chạy animation (nguồn gây flaky trước đây).
 */
export function statMarkup({ value, label, display, note = '' }) {
  const final = display || formatNumber(value)
  return `<div class="stat">
    <span class="stat__value" data-stat-value="${display ? '' : Number(value) || 0}" data-stat-display="${esc(display || '')}" data-stat-final="${esc(final)}">${esc(final)}</span>
    <span class="stat__label">${esc(label)}</span>
    ${note ? `<span class="stat__note">${esc(note)}</span>` : ''}
  </div>`
}

export function animateStats(root = document) {
  const nodes = $$('[data-stat-value]', root).filter((n) => !n.dataset.animated)
  if (!nodes.length) return
  const run = (node) => {
    node.dataset.animated = '1'
    const display = node.dataset.statDisplay
    const final = node.dataset.statFinal || display
    if (display) {
      node.textContent = display
      node.dataset.statDone = '1'
      return
    }
    const target = Number(node.dataset.statValue) || 0
    if (prefersReducedMotion()) {
      node.textContent = final || formatNumber(target)
      node.dataset.statDone = '1'
      return
    }
    const duration = 1200
    const started = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      node.textContent = formatNumber(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(step)
      else {
        node.textContent = final || formatNumber(target)
        node.dataset.statDone = '1'
      }
    }
    requestAnimationFrame(step)
  }
  if (!('IntersectionObserver' in window)) {
    nodes.forEach(run)
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target)
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 },
  )
  nodes.forEach((n) => io.observe(n))
}

/* ---------- Thẻ phiên live ---------- */
export function liveCard(session) {
  const state = liveState(session)
  const platform = PLATFORMS[session.platform] || PLATFORMS.vhub
  const when = state === 'live' ? `Đang phát · kết thúc ${formatTime(liveEndsAt(session))}` : state === 'ended' ? `Đã kết thúc · ${formatDateTime(session.starts_at)}` : `${formatTime(session.starts_at)} · ${formatDate(session.starts_at)}`
  const badge = state === 'live' ? badgeLive() : ''
  const actions =
    state === 'upcoming'
      ? `<button class="btn btn--ghost btn--sm" type="button" data-remind="${esc(session.id)}">${icon('bell', 'btn__icon')}<span>${tr('Nhắc tôi', 'Remind me')}</span></button>
         <a class="btn btn--link btn--sm" href="#/lich-live">${tr('Chi tiết', 'Details')}${icon('arrowRight', 'btn__arrow btn__icon')}</a>`
      : state === 'live'
        ? `<a class="btn btn--hero btn--sm" href="${esc(session.url || '#/lich-live')}" ${session.url ? 'target="_blank" rel="noopener"' : ''}>${icon('play', 'btn__icon')}<span>${tr('Xem ngay', 'Watch now')}</span></a>
           <button class="btn btn--ghost btn--sm" type="button" data-remind="${esc(session.id)}">${icon('bell', 'btn__icon')}<span>${tr('Lưu lịch', 'Save')}</span></button>`
        : `<a class="btn btn--ghost btn--sm" href="${esc(session.url || '#/lich-live')}" ${session.url ? 'target="_blank" rel="noopener"' : ''}>${icon('rotate', 'btn__icon')}<span>${tr('Xem lại', 'Replay')}</span></a>`
  return `<article class="live-card">
    ${media({ label: `Ảnh thật: phiên live "${session.title}"`, ratio: '16x9', badge })}
    <div class="live-card__body">
      <div class="row" style="gap:8px;justify-content:space-between">
        <span class="live-card__time">${state === 'live' ? tr('ĐANG PHÁT', 'ON AIR') : formatTime(session.starts_at)}</span>
        <span class="platform">${icon(platform.icon)}${esc(platform.label)}</span>
      </div>
      <h3 class="live-card__title">${esc(session.title)}</h3>
      <div class="live-card__meta">
        <span>${esc(session.brand || 'V-HUB')}</span>
        <span>${esc(when)}</span>
      </div>
      <div class="live-card__actions">${actions}</div>
    </div>
  </article>`
}

/* ---------- Nhắc lịch ---------- */
export function openReminder(session) {
  const start = Number(session.starts_at)
  const end = liveEndsAt(session)
  const gcal = new Date(start).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const gcalEnd = new Date(end).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const zalo = 'https://zalo.me/vhub'
  const html = `<h2 style="font-size:1.25rem;padding-right:36px">${tr('Nhắc tôi phiên live', 'Remind me')}</h2>
    <p class="muted small" style="margin-top:6px">${esc(session.title)}<br />${formatDateTime(start)} · ${esc(session.brand || 'V-HUB')}</p>
    <div class="stack mt-4">
      <button class="quick-channel" type="button" data-ics="1">${icon('download')}<span>${tr('Tải file lịch (.ics)', 'Download .ics')}</span></button>
      <a class="quick-channel" href="${gcal ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`V-HUB · ${session.title}`)}&dates=${gcal}/${gcalEnd}&details=${encodeURIComponent('Xem lịch live tại vhub.vn')}&location=${encodeURIComponent('V-HUB, 232/14 Võ Thị Sáu, TP.HCM')}` : '#'}" target="_blank" rel="noopener">${icon('calendar')}<span>${tr('Thêm vào Google Calendar', 'Add to Google Calendar')}</span></a>
      <a class="quick-channel" href="${zalo}" target="_blank" rel="noopener">${icon('zalo')}<span>${tr('Nhận nhắc qua Zalo OA', 'Get reminders via Zalo')}</span></a>
    </div>
    <p class="form-note mt-3">${tr('V-HUB gửi nhắc trước phiên 30 phút qua Zalo nếu bạn đã quan tâm Zalo OA.', 'We remind you 30 minutes before the session if you follow our Zalo OA.')}</p>`
  const modal = openModal(html, { label: 'Nhắc tôi phiên live' })
  const icsBtn = modal.querySelector('[data-ics]')
  if (icsBtn) {
    icsBtn.addEventListener('click', () => {
      downloadFile(`vhub-${session.id}.ics`, buildIcs(session), 'text/calendar;charset=utf-8')
      toast('Đã tải file lịch. Mở file để thêm vào ứng dụng lịch của bạn.', 'success')
    })
  }
}

/** Gắn hành vi cho mọi nút [data-remind] trong một vùng. */
export function attachReminders(root = document) {
  on(root, 'click', '[data-remind]', (e, btn) => {
    e.preventDefault()
    const id = btn.getAttribute('data-remind')
    const sessions = (window.__VHUB_LIVES__ || []).concat(window.__VHUB_BOOTSTRAP_LIVES__ || [])
    const session = sessions.find((s) => String(s.id) === String(id))
    if (session) openReminder(session)
  })
}

/* ---------- Nút tải tài liệu (placeholder có thông báo) ---------- */
export function attachDocButtons(root = document) {
  on(root, 'click', '[data-doc-pending]', (e, _btn) => {
    e.preventDefault()
    toast('Tài liệu đang được V-HUB cập nhật bản chính thức. Vui lòng để lại thông tin để nhận khi phát hành.', 'info', 5200)
  })
}
