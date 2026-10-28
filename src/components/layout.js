/** Khung chung: header + mega menu, điều hướng mobile, thanh CTA đáy, nút liên hệ nổi, footer. */

import { esc, $, $$, on } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr, getLang, setLang } from '../lib/i18n.js'
import { ORG, NAV, AUDIENCES } from '../lib/catalog-site.js'
import { currentLive } from '../lib/catalog-schedule.js'
import { nextMarket } from '../lib/catalog-provinces.js'
import { formatDate } from '../lib/format.js'
import { media, badgeLive, toast } from './ui.js'
import { submitLead } from '../lib/api.js'
import { getUtm, sourcePage, track } from '../lib/store.js'

let globalBound = false

const MEGA_FEATURE = () => {
  const m = nextMarket()
  return `<a class="mega__feature" href="#/cho-phien">
    ${media({ label: `Ảnh thật: ${m.name}`, ratio: '16x9', dark: true })}
    <div class="mega__feature-body">
      <span class="kicker kicker--plain" style="color:var(--primary-on-dark)">${tr('Phiên kế tiếp', 'Next session')}</span>
      <strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(m.name)} · ${formatDate(m.heldAt)}</strong>
      <span style="font-size:.75rem;color:var(--on-secondary-muted)">${tr('Chợ Phiên Phương Nam', 'Southern Market Days')}</span>
    </div>
  </a>`
}

function megaMarkup(item) {
  if (!item.groups || !item.groups.length) return ''
  const groups = item.groups
    .map(
      (g) => `<div>
      <p class="mega__title">${esc(g.title)}</p>
      <div class="mega__list">${g.links.map((l) => `<a class="mega__link" href="${esc(l.href)}">${esc(l.label)}${icon('chevronRight')}</a>`).join('')}</div>
    </div>`,
    )
    .join('')
  const feature = item.mega === 'solutions' ? MEGA_FEATURE() : ''
  return `<div class="mega" role="group" aria-label="${esc(item.label)}">
    <div class="container mega__inner" style="${feature ? '' : 'grid-template-columns:1fr'}">
      <div class="mega__groups" style="${item.groups.length < 3 ? 'grid-template-columns:repeat(2,minmax(0,1fr))' : ''}">${groups}</div>
      ${feature}
    </div>
  </div>`
}

export function headerMarkup() {
  const lang = getLang()
  const nav = NAV.map(
    (item) => `<div class="has-mega" data-nav-item="${esc(item.id)}">
      <a class="nav-link" href="${esc(item.href)}" data-nav-link="${esc(item.id)}">${esc(item.label)}</a>
      ${megaMarkup(item)}
    </div>`,
  ).join('')

  return `<header class="site-header" id="site-header">
    <div class="container header__inner">
      <a class="brand" href="#/" aria-label="V-HUB — về trang chủ">
        <span class="brand__mark">VH</span>
        <span class="brand__text">
          <span class="brand__name">V-HUB</span>
          <span class="brand__sub">VTV Nam Bộ</span>
        </span>
      </a>
      <nav class="header__nav" aria-label="Điều hướng chính">${nav}</nav>
      <div class="header__actions">
        <span id="header-live" class="header__live"></span>
        <a class="header__hotline" href="${ORG.hotlineHref}" aria-label="Gọi hotline ${esc(ORG.hotline)}">${icon('phone')}<span>${esc(ORG.hotline)}</span></a>
        <div class="header__lang" role="group" aria-label="Ngôn ngữ">
          <button type="button" data-lang="vi" aria-pressed="${lang === 'vi'}">VI</button>
          <button type="button" data-lang="en" aria-pressed="${lang === 'en'}">EN</button>
        </div>
        <a class="btn btn--sm header__cta" href="#/lien-he">${tr('Đặt lịch tư vấn', 'Book a consultation')}</a>
        <button class="menu-toggle" type="button" aria-label="${tr('Mở menu', 'Open menu')}" aria-expanded="false" aria-controls="mobile-nav" id="menu-toggle">${icon('menu')}</button>
      </div>
    </div>
  </header>
  ${mobileNavMarkup()}`
}

export function mobileNavMarkup() {
  const doors = AUDIENCES.slice(0, 4)
    .map((a) => `<a class="mobile-door" href="${esc(a.href)}">${esc(a.title)}<span>${esc(a.short)}</span></a>`)
    .join('')
  const items = NAV.map(
    (item, i) => `<div class="accordion-item">
      <button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="mnav-${i}">
        <span>${esc(item.label)}</span>${icon('chevronDown')}
      </button>
      <div class="accordion-panel" id="mnav-${i}">
        <a href="${esc(item.href)}" style="font-weight:600;color:var(--secondary)">${tr('Xem tổng quan', 'Overview')}</a>
        ${(item.groups || [])
          .flatMap((g) => g.links)
          .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`)
          .join('')}
      </div>
    </div>`,
  ).join('')

  return `<div class="mobile-nav" id="mobile-nav" aria-label="${tr('Menu di động', 'Mobile menu')}" aria-hidden="true">
    <div class="mobile-nav__head">
      <a class="brand" href="#/"><span class="brand__mark">VH</span><span class="brand__text"><span class="brand__name">V-HUB</span><span class="brand__sub">VTV Nam Bộ</span></span></a>
      <button class="menu-toggle" type="button" aria-label="${tr('Đóng menu', 'Close menu')}" id="menu-close">${icon('close')}</button>
    </div>
    <div class="mobile-nav__body">
      <div>
        <p class="kicker" style="margin-bottom:10px">${tr('Bạn là ai?', 'Who are you?')}</p>
        <div class="mobile-nav__doors">${doors}</div>
      </div>
      <div>${items}</div>
      <div class="stack">
        <a class="btn btn--block" href="#/lien-he">${tr('Đặt lịch tư vấn', 'Book a consultation')}</a>
        <a class="btn btn--ghost btn--block" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${esc(ORG.hotline)}</span></a>
        <a class="btn btn--ghost btn--block" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>${tr('Chat Zalo OA', 'Chat on Zalo')}</span></a>
        <div class="header__lang" style="align-self:flex-start">
          <button type="button" data-lang="vi" aria-pressed="${getLang() === 'vi'}">VI</button>
          <button type="button" data-lang="en" aria-pressed="${getLang() === 'en'}">EN</button>
        </div>
      </div>
    </div>
  </div>`
}

export function ctaBarMarkup() {
  return `<nav class="cta-bar" aria-label="${tr('Liên hệ nhanh', 'Quick contact')}">
    <a class="cta-bar__btn" href="${ORG.hotlineHref}">${icon('phone')}<span>${tr('Gọi', 'Call')}</span></a>
    <a class="cta-bar__btn" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo')}<span>Zalo</span></a>
    <a class="cta-bar__btn cta-bar__btn--primary" href="#/lien-he">${icon('calendar')}<span>${tr('Đặt lịch tư vấn', 'Book a call')}</span></a>
  </nav>`
}

export function floatingContactMarkup() {
  return `<div class="floating-contact" id="floating-contact">
    <div class="floating-contact__panel" id="floating-panel" role="dialog" aria-label="${tr('Liên hệ V-HUB', 'Contact V-HUB')}">
      <h2>${tr('V-HUB có thể giúp gì cho bạn?', 'How can V-HUB help?')}</h2>
      <a class="quick-channel" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo')}<span>${tr('Chat Zalo OA', 'Chat on Zalo')}</span></a>
      <a class="quick-channel" href="${ORG.hotlineHref}">${icon('phone')}<span>${esc(ORG.hotline)}</span></a>
      <button class="quick-channel" type="button" data-open-chat>${icon('chat')}<span>${tr('Để lại thông tin', 'Leave your details')}</span></button>
      <a class="quick-channel" href="#/lien-he">${icon('calendar')}<span>${tr('Đặt lịch tư vấn 60 phút', 'Book a 60-minute call')}</span></a>
    </div>
    <button class="floating-contact__trigger" type="button" aria-expanded="false" aria-controls="floating-panel" aria-label="${tr('Mở kênh liên hệ', 'Open contact options')}" id="floating-trigger">
      ${icon('chat')}
    </button>
  </div>`
}

export function footerMarkup() {
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <div class="footer__logo">
            <span class="brand__mark">VH</span>
            <span class="brand__text"><span class="brand__name">V-HUB</span><span class="brand__sub">VTV Nam Bộ</span></span>
          </div>
          <p class="footer__tagline">${esc(ORG.tagline)}</p>
          <p class="footer__desc">${tr('Hệ thống MCN thương mại điện tử thuộc hệ sinh thái VTV Nam Bộ. Đào tạo, định danh nhà sáng tạo, sản xuất nội dung, livestream và vận hành TMĐT đa tuyến.', 'An e-commerce MCN in the VTV Nam Bộ ecosystem: training, creator verification, content production, livestream and multi-channel commerce operations.')}</p>
          <form class="newsletter" id="newsletter-form" novalidate>
            <label class="sr-only" for="newsletter-email">${tr('Email nhận tin', 'Email')}</label>
            <input type="email" id="newsletter-email" name="email" placeholder="${tr('Email nhận tin V-HUB', 'Your email')}" autocomplete="email" required />
            <button class="btn btn--on-dark" type="submit">${tr('Đăng ký', 'Subscribe')}</button>
          </form>
          <p class="xsmall" id="newsletter-note" style="color:var(--on-secondary-muted)">${tr('Nhận lịch live và báo cáo Chợ Phiên. Không gửi quá 2 lần/tháng.', 'Live schedule and market reports. Max two emails per month.')}</p>
        </div>
        <div class="footer__cols">
          <div class="footer__col">
            <h3>${tr('Giải pháp', 'Solutions')}</h3>
            <a href="#/giai-phap/nhan-hang">${tr('Nhãn hàng & tập đoàn', 'Brands & corporations')}</a>
            <a href="#/giai-phap/doanh-nghiep-vua-va-nho">${tr('Doanh nghiệp vừa và nhỏ', 'Small & medium business')}</a>
            <a href="#/giai-phap/dia-phuong-ocop">${tr('Địa phương & OCOP', 'Localities & OCOP')}</a>
            <a href="#/giai-phap">${tr('Tất cả giải pháp', 'All solutions')}</a>
          </div>
          <div class="footer__col">
            <h3>Studio & KOCViet</h3>
            <a href="#/studio">${tr('Studio & bảng giá', 'Studios & rates')}</a>
            <a href="#/studio#dat-lich">${tr('Đặt lịch studio', 'Book a studio')}</a>
            <a href="#/kocviet/tim-kiem">${tr('Tìm nhà sáng tạo', 'Find creators')}</a>
            <a href="#/kocviet/dinh-danh">${tr('Trở thành KOC chính danh', 'Become a verified KOC')}</a>
          </div>
          <div class="footer__col">
            <h3>${tr('Chợ Phiên & Học viện', 'Market Days & Academy')}</h3>
            <a href="#/cho-phien">${tr('Chợ Phiên Phương Nam', 'Southern Market Days')}</a>
            <a href="#/cho-phien/minh-bach">${tr('Minh bạch quỹ', 'Fund transparency')}</a>
            <a href="#/hoc-vien">${tr('Khoá học', 'Courses')}</a>
            <a href="#/lich-live">${tr('Lịch live', 'Live schedule')}</a>
          </div>
          <div class="footer__col">
            <h3>${tr('Về V-HUB', 'About')}</h3>
            <a href="#/ve-v-hub">${tr('Câu chuyện & hệ sinh thái', 'Story & ecosystem')}</a>
            <a href="#/du-an">${tr('Dự án tiêu biểu', 'Case studies')}</a>
            <a href="#/tin-tuc">${tr('Tin tức & kiến thức', 'News & insights')}</a>
            <a href="#/lien-he">${tr('Liên hệ', 'Contact')}</a>
          </div>
        </div>
      </div>
      <div class="footer__meta">
        <div class="footer__contact">
          <p style="color:#fff;font-weight:600">${esc(ORG.legalName)}</p>
          <p>${icon('pin')} ${esc(ORG.address)}</p>
          <p>${icon('phone')} <a href="${ORG.hotlineHref}">${esc(ORG.hotline)}</a> · ${icon('mail')} <a href="${ORG.emailHref}">${esc(ORG.email)}</a></p>
          <p>${icon('clock')} ${esc(ORG.hours)}</p>
          <p class="xsmall">${esc(ORG.license)}</p>
          <div class="footer__social">
            <a href="${esc(ORG.fanpage)}" target="_blank" rel="noopener" aria-label="Facebook V-HUB">${icon('facebook')}</a>
            <a href="${esc(ORG.youtube)}" target="_blank" rel="noopener" aria-label="YouTube V-HUB">${icon('youtube')}</a>
            <a href="${esc(ORG.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok V-HUB">${icon('tiktok')}</a>
            <a href="${esc(ORG.zalo)}" target="_blank" rel="noopener" aria-label="Zalo OA V-HUB">${icon('zalo')}</a>
          </div>
        </div>
        <div class="footer__map">
          <iframe src="${esc(ORG.mapEmbed)}" title="Bản đồ V-HUB — 232/14 Võ Thị Sáu, TP.HCM" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="footer__legal">
          <span>© ${ORG.copyrightYear} V-HUB. ${tr('Bảo lưu mọi quyền.', 'All rights reserved.')}</span>
          <a href="#/chinh-sach-bao-mat">${tr('Chính sách bảo mật', 'Privacy policy')}</a>
          <a href="#/dieu-khoan">${tr('Điều khoản sử dụng', 'Terms of use')}</a>
          <a href="#/admin">${tr('Quản trị', 'Admin')}</a>
        </div>
        <div class="row" style="gap:12px">
          <span class="xsmall">Value | Innovate | Trust</span>
          <span class="tricolor tricolor--sm" aria-hidden="true"><span></span><span></span><span></span></span>
        </div>
      </div>
    </div>
    <div class="footer__ornament" aria-hidden="true"><span class="tricolor"><span></span><span></span><span></span></span></div>
  </footer>`
}

/* ---------- Hành vi ---------- */
export function attachLayout(_app) {
  document.body.classList.add('has-cta-bar')

  const toggle = $('#menu-toggle')
  const close = $('#menu-close')
  const mobileNav = $('#mobile-nav')

  const openMenu = () => {
    if (!mobileNav) return
    mobileNav.classList.add('is-open')
    mobileNav.setAttribute('aria-hidden', 'false')
    if (toggle) toggle.setAttribute('aria-expanded', 'true')
    document.body.style.overflow = 'hidden'
    const first = mobileNav.querySelector('button, a')
    if (first) first.focus()
  }
  const closeMenu = () => {
    if (!mobileNav) return
    mobileNav.classList.remove('is-open')
    mobileNav.setAttribute('aria-hidden', 'true')
    if (toggle) toggle.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
  }
  if (toggle) toggle.addEventListener('click', openMenu)
  if (close) close.addEventListener('click', closeMenu)
  if (mobileNav) {
    on(mobileNav, 'click', 'a', () => closeMenu())
    on(mobileNav, 'click', '.accordion-trigger', (_e, trigger) => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'))
      const expanded = trigger.getAttribute('aria-expanded') === 'true'
      trigger.setAttribute('aria-expanded', String(!expanded))
      if (panel) panel.classList.toggle('is-open', !expanded)
    })
  }

  // Nút liên hệ nổi
  const trigger = $('#floating-trigger')
  const panel = $('#floating-panel')
  if (trigger && panel) {
    trigger.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open')
      trigger.setAttribute('aria-expanded', String(isOpen))
    })
  }

  // Chỉ gắn listener toàn cục một lần (header được render lại mỗi route)
  if (!globalBound) {
    globalBound = true
    document.addEventListener('click', (e) => {
      const langBtn = e.target.closest('[data-lang]')
      if (langBtn) setLang(langBtn.getAttribute('data-lang'))
      const floatingPanel = document.getElementById('floating-panel')
      const floatingTrigger = document.getElementById('floating-trigger')
      if (floatingPanel && floatingPanel.classList.contains('is-open') && !e.target.closest('#floating-contact')) {
        floatingPanel.classList.remove('is-open')
        if (floatingTrigger) floatingTrigger.setAttribute('aria-expanded', 'false')
      }
    })
    window.addEventListener(
      'scroll',
      () => {
        const header = document.getElementById('site-header')
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 8)
      },
      { passive: true },
    )
  }
  const header = $('#site-header')
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 8)

  // Newsletter
  const nl = $('#newsletter-form')
  if (nl) {
    nl.addEventListener('submit', async (e) => {
      e.preventDefault()
      const input = $('#newsletter-email')
      const note = $('#newsletter-note')
      if (!input || !input.value.includes('@')) {
        if (note) note.textContent = 'Vui lòng nhập email hợp lệ.'
        return
      }
      const btn = nl.querySelector('button[type="submit"]')
      if (btn) btn.disabled = true
      try {
        await submitLead({
          type: 'newsletter',
          email: input.value.trim(),
          name: '',
          phone: '',
          consent: true,
          page: sourcePage(),
          utm: getUtm(),
          message: 'Đăng ký nhận tin từ footer',
        })
        track('newsletter_submit')
        input.value = ''
        if (note) note.textContent = 'Đã đăng ký. V-HUB sẽ gửi lịch live và báo cáo Chợ Phiên.'
        toast('Đã đăng ký nhận tin V-HUB.', 'success')
      } catch (err) {
        if (note) note.textContent = err.message || 'Không gửi được. Vui lòng thử lại.'
        toast(err.message || 'Không gửi được đăng ký.', 'error')
      } finally {
        if (btn) btn.disabled = false
      }
    })
  }

  // Cập nhật huy hiệu LIVE ở header
  updateHeaderLive()
  window.addEventListener('vhub:live-updated', updateHeaderLive)
  return { closeMenu }
}

export function updateHeaderLive() {
  const slot = document.getElementById('header-live')
  if (!slot) return
  const lives = window.__VHUB_LIVES__ || []
  const live = currentLive(lives)
  slot.innerHTML = live
    ? `<a href="#/lich-live" aria-label="${esc(`Đang phát: ${live.title}`)}">${badgeLive()}</a>`
    : ''
}

export function markActiveNav(route) {
  $$('[data-nav-link], .mega__link, .footer__col a').forEach((a) => a.removeAttribute('aria-current'))
  const root = (route || '').split('/')[1] || ''
  const map = {
    'giai-phap': 'giai-phap',
    studio: 'studio',
    kocviet: 'kocviet',
    'cho-phien': 'cho-phien',
    'hoc-vien': 'hoc-vien',
    've-v-hub': 've-v-hub',
    'du-an': 've-v-hub',
    'tin-tuc': 've-v-hub',
    'lien-he': 've-v-hub',
    'lich-live': 'cho-phien',
  }
  const id = map[root]
  if (!id) return
  const link = document.querySelector(`[data-nav-link="${id}"]`)
  if (link) {
    link.classList.add('is-active')
    link.setAttribute('aria-current', 'true')
  }
}
