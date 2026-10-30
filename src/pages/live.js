/** Trang Lịch Live: tuần, danh sách, bộ lọc, nhắc lịch. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ORG, PLATFORMS } from '../lib/catalog-site.js'
import { weekDays, liveEndsAt } from '../lib/catalog-schedule.js'
import { getLives, getCurrentLive } from '../lib/data.js'
import { formatDate, formatTime, weekdayShort } from '../lib/format.js'
import { media, sectionHead, badgeLive, badgeDemo, breadcrumb, liveCard, emptyState, attachReminders } from '../components/ui.js'

function liveNowBanner(live) {
  if (!live) return ''
  return `<div class="card card--accent" style="flex-direction:row;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:var(--sp-4)">
    <div class="row" style="gap:12px">${badgeLive()}<div><strong style="font-family:var(--font-heading);display:block">${esc(live.title)}</strong><span class="small muted">${esc(live.brand)} · ${tr('kết thúc', 'ends')} ${formatTime(liveEndsAt(live))} · ${formatDate(live.starts_at)}</span></div></div>
    <a class="btn" href="${esc(live.url || '#/lich-live')}" ${live.url ? 'target="_blank" rel="noopener"' : ''}>${icon('play', 'btn__icon')}<span>${tr('Xem ngay', 'Watch now')}</span></a>
  </div>`
}

function schedulePage() {
  const lives = getLives()
  const live = getCurrentLive()
  const days = weekDays(lives, Date.now(), 14)
  const selected = days[0]
  const brands = Array.from(new Set(lives.map((l) => l.brand).filter(Boolean)))
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Lịch Live', 'Live schedule') }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${tr('Lịch phát sóng', 'Broadcast schedule')}</span>
          <h1>${tr('Lịch Live', 'Live schedule')}</h1>
          <p class="lede">${tr('Toàn bộ phiên Daily Live, Megalive và Super-Megalive. Giờ hiển thị theo múi giờ Việt Nam (UTC+7). Huy hiệu LIVE chỉ xuất hiện khi phiên đang phát.', 'All Daily Live, Megalive and Super-Megalive sessions. Times are Vietnam time (UTC+7). The LIVE badge only appears while a session is on air.')}</p>
          <div class="row" style="gap:10px"><a class="btn" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('bell', 'btn__icon')}<span>${tr('Nhận nhắc qua Zalo', 'Get reminders on Zalo')}</span></a><a class="btn btn--ghost" href="#/cho-phien">${tr('Chợ Phiên Phương Nam', 'Southern Market Days')}</a></div>
        </div>
        ${media({ src: '/images/operations/phong-dieu-khien.jpg', label: tr('Phòng điều khiển đang phát sóng', 'Control room on air'), ratio: '4x3', badge: live ? badgeLive() : badgeDemo() })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        ${liveNowBanner(live)}
        <div class="day-tabs" role="tablist" aria-label="${tr('Chọn ngày', 'Choose a day')}" style="margin-bottom:var(--sp-4)">
          ${days
            .map(
              (d, i) => `<button class="day-tab" type="button" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" data-live-day="${d.key}">
                <span class="day-tab__dow">${weekdayShort(d.dayStart)}</span>
                <span class="day-tab__date">${String(d.date.day).padStart(2, '0')}/${String(d.date.month).padStart(2, '0')}</span>
              </button>`,
            )
            .join('')}
        </div>
        <div class="row row--between" style="margin-bottom:var(--sp-3)">
          <p class="small muted" id="live-day-label">${formatDate(selected.dayStart)} · ${selected.items.length} ${tr('phiên', 'sessions')}</p>
          <div class="row" style="gap:8px">
            <label class="sr-only" for="live-brand">${tr('Lọc theo nhãn hàng', 'Filter by brand')}</label>
            <select class="select" id="live-brand" style="min-height:44px;width:auto;font-size:.8125rem"><option value="">${tr('Tất cả nhãn hàng', 'All brands')}</option>${brands.map((b) => `<option>${esc(b)}</option>`).join('')}</select>
            <label class="sr-only" for="live-platform">${tr('Lọc theo nền tảng', 'Filter by platform')}</label>
            <select class="select" id="live-platform" style="min-height:44px;width:auto;font-size:.8125rem"><option value="">${tr('Tất cả nền tảng', 'All platforms')}</option>${Object.entries(PLATFORMS).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('')}</select>
          </div>
        </div>
        <div class="live-strip" id="live-day-grid" data-day="${selected.key}">
          ${selected.items.length ? selected.items.map(liveCard).join('') : emptyState({ title: tr('Ngày này chưa có phiên live', 'No sessions on this day'), text: tr('Chọn ngày khác hoặc đăng ký nhận lịch qua Zalo.', 'Pick another day or subscribe on Zalo.') })}
        </div>
        <p class="small muted mt-3">${tr('Lịch live được cập nhật từ dữ liệu vận hành. Phiên minh hoạ được gắn nhãn dữ liệu mẫu.', 'The schedule comes from operational data. Demo sessions are labelled.')} ${badgeDemo()}</p>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Cách nhận nhắc', 'Reminders'), title: tr('Không bỏ lỡ phiên quan trọng', 'Never miss a session'), sub: tr('Chọn cách nhắc phù hợp: tải file lịch, thêm vào Google Calendar hoặc nhận thông báo qua Zalo OA.', 'Download a calendar file, add to Google Calendar or follow our Zalo OA.') })}
        <div class="grid grid--3">
          ${[
            { icon: 'download', title: tr('Tải file .ics', 'Download .ics'), body: tr('Mở bằng ứng dụng lịch trên điện thoại hoặc máy tính. Có nhắc trước 30 phút.', 'Open in your calendar app. Includes a 30-minute reminder.') },
            { icon: 'calendar', title: tr('Google Calendar', 'Google Calendar'), body: tr('Thêm trực tiếp vào lịch Google với đầy đủ thông tin phiên.', 'Add directly to Google Calendar with session details.') },
            { icon: 'zalo', title: tr('Zalo OA', 'Zalo OA'), body: tr('Quan tâm Zalo OA V-HUB để nhận nhắc tự động trước mỗi phiên.', 'Follow our Zalo OA for automatic reminders.') },
          ]
            .map((c) => `<article class="card"><span class="icon-tile">${icon(c.icon)}</span><h3 class="card__title">${esc(c.title)}</h3><p class="card__body">${esc(c.body)}</p></article>`)
            .join('')}
        </div>
        <div class="row mt-4"><a class="btn" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>${tr('Quan tâm Zalo OA', 'Follow on Zalo')}</span></a><a class="btn btn--ghost" href="#/lien-he">${tr('Đặt lịch tư vấn', 'Book a consultation')}</a></div>
      </div>
    </section>
  </main>`
}

export function render() {
  return {
    title: 'Lịch Live — V-HUB | Daily Live, Megalive, Super-Megalive',
    description: 'Lịch phát sóng V-HUB: Daily Live, Megalive và Super-Megalive. Xem phiên đang phát, tải file lịch .ics và nhận nhắc qua Zalo.',
    html: schedulePage(),
    mount(root) {
      attachReminders(root)
      const lives = getLives()
      const days = weekDays(lives, Date.now(), 14)
      const grid = root.querySelector('#live-day-grid')
      const label = root.querySelector('#live-day-label')
      const brandFilter = root.querySelector('#live-brand')
      const platformFilter = root.querySelector('#live-platform')
      let currentDay = days[0]

      const paint = () => {
        if (!grid) return
        let items = currentDay.items
        if (brandFilter && brandFilter.value) items = items.filter((s) => s.brand === brandFilter.value)
        if (platformFilter && platformFilter.value) items = items.filter((s) => s.platform === platformFilter.value)
        grid.innerHTML = items.length
          ? items.map(liveCard).join('')
          : emptyState({
              title: tr('Không có phiên phù hợp', 'No matching sessions'),
              text: tr('Thử bỏ bộ lọc hoặc chọn ngày khác.', 'Try clearing filters or picking another day.'),
              action: `<button class="btn btn--ghost btn--sm" type="button" data-clear-live>${tr('Xoá bộ lọc', 'Clear filters')}</button>`,
            })
        if (label) label.textContent = `${formatDate(currentDay.dayStart)} · ${items.length} ${tr('phiên', 'sessions')}`
      }

      root.querySelectorAll('[data-live-day]').forEach((tab) => {
        tab.addEventListener('click', () => {
          root.querySelectorAll('[data-live-day]').forEach((t) => {
            t.setAttribute('aria-selected', 'false')
            t.classList.remove('is-active')
          })
          tab.setAttribute('aria-selected', 'true')
          tab.classList.add('is-active')
          currentDay = days.find((d) => d.key === tab.dataset.liveDay) || currentDay
          paint()
        })
      })
      if (brandFilter) brandFilter.addEventListener('change', paint)
      if (platformFilter) platformFilter.addEventListener('change', paint)
      const scope = root.querySelector('#main') || root
      scope.addEventListener('click', (e) => {
        if (e.target.closest('[data-clear-live]')) {
          if (brandFilter) brandFilter.value = ''
          if (platformFilter) platformFilter.value = ''
          paint()
        }
      })
      paint()
    },
  }
}
