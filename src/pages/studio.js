/** Trang Studio: danh sách, chi tiết, tham quan 360° và luồng đặt lịch 3 bước. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ORG } from '../lib/catalog-site.js'
import { STUDIOS, STUDIO_PACKAGES, STUDIO_ADDONS, TIME_SLOTS, STUDIO_FACTS, getStudio, estimateStudio } from '../lib/catalog-studios.js'
import { formatCurrency, formatDate, vnDateKey, weekdayShort } from '../lib/format.js'
import { media, sectionHead, badgeDemo, breadcrumb, emptyState, toast, accordion } from '../components/ui.js'
import { getAvailability, createBooking } from '../lib/api.js'
import { downloadFile } from '../lib/format.js'
import { viewer360Markup, attach360 } from '../components/studio360.js'

function studioCard(s) {
  return `<article class="card card--link" style="padding:10px;gap:12px">
    ${media({ src: s.images[0]?.src, label: s.images[0]?.label || `Ảnh thật: ${s.name}`, ratio: '4x3', badge: `<span class="badge">${esc(s.typeLabel)}</span>` })}
    <div class="stack stack--sm" style="padding:4px">
      <h3 class="card__title">${esc(s.name)}</h3>
      <div class="row" style="gap:8px 14px">
        <span class="xsmall muted">${s.area}m²</span>
        <span class="xsmall muted">${tr('Sức chứa', 'Capacity')} ${s.capacity} ${tr('người', 'people')}</span>
        <span class="xsmall muted">${esc(s.typeLabel)}</span>
      </div>
      <p class="card__body">${esc(s.summary)}</p>
      <div class="spec-list" style="font-size:0.8125rem">
        <div><span class="spec-label">${tr('Giá thuê', 'Rate')}</span><span class="spec-value">${esc(s.priceLabel)}</span></div>
      </div>
      <div class="row" style="gap:8px">
        <a class="btn btn--ghost btn--sm" href="#/studio/${esc(s.slug)}">${tr('Xem chi tiết', 'Details')}</a>
        <a class="btn btn--sm" href="#/studio/${esc(s.slug)}#dat-lich">${tr('Đặt lịch', 'Book')}</a>
      </div>
    </div>
  </article>`
}

function listPage() {
  return `<div class="page-hero page-hero--navy">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'Studio' }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${tr('Hạ tầng', 'Infrastructure')}</span>
          <h1>${tr('Studio chuẩn truyền hình giữa trung tâm TP.HCM', 'Broadcast-grade studios in central Ho Chi Minh City')}</h1>
          <p class="lede">${tr('Cụm 14 studio theo biên bản ghi nhớ, gồm 13 studio tiêu chuẩn và 1 Super-Megalive. Đặt theo ca, có kỹ thuật viên và host nếu cần.', 'A 14-studio cluster per the MOU: 13 standard studios and one Super-Megalive. Book by session, with technicians and hosts available.')}</p>
          <div class="row" style="gap:10px">
            <a class="btn btn--on-dark" href="#danh-sach">${tr('Xem studio & bảng giá', 'Studios & rates')}${icon('arrowDown', 'btn__icon')}</a>
            <a class="btn btn--outline-light" href="#tham-quan-360">${tr('Tham quan 360°', '360° tour')}</a>
          </div>
        </div>
        ${viewer360Markup({ label: tr('Ảnh toàn cảnh 360°: Super-Megalive Studio', '360° panorama: Super-Megalive Studio') })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section section--tight">
      <div class="container">
        <div class="grid grid--3" style="gap:12px">
          <div class="card" style="gap:4px"><span class="stat__value" style="color:var(--primary-deep);font-size:1.75rem">${STUDIO_FACTS.totalFromMou}</span><span class="small muted">${tr('studio theo biên bản ghi nhớ', 'studios in the MOU')}</span></div>
          <div class="card" style="gap:4px"><span class="stat__value" style="color:var(--primary-deep);font-size:1.75rem">${STUDIO_FACTS.standardCount}</span><span class="small muted">${tr('studio tiêu chuẩn', 'standard studios')}</span></div>
          <div class="card" style="gap:4px"><span class="stat__value" style="color:var(--primary-deep);font-size:1.75rem">${STUDIO_FACTS.superCount}</span><span class="small muted">${tr('Super-Megalive', 'Super-Megalive')}</span></div>
        </div>
        <p class="small muted mt-3">${tr('Danh sách dưới đây hiển thị 6 studio đang mở đặt lịch trên website (dữ liệu mẫu). Số studio đang vận hành lấy từ dữ liệu vận hành.', 'Six bookable studios are shown below (sample data). The operating count comes from operational data.')} ${badgeDemo()}</p>
      </div>
    </section>
    <section class="section" id="danh-sach">
      <div class="container">
        ${sectionHead({ kicker: tr('Danh sách', 'Studios'), title: tr('Chọn studio theo quy mô', 'Choose by scale'), sub: tr('Lọc theo loại studio. Giá hiển thị theo giờ, chưa gồm kỹ thuật và dịch vụ thêm.', 'Filter by type. Rates are per hour, excluding technicians and add-ons.'), action: `<a class="btn btn--ghost btn--sm" href="#dat-lich">${tr('Đặt lịch nhanh', 'Quick booking')}</a>` })}
        <div class="tabs" role="tablist" aria-label="${tr('Lọc loại studio', 'Filter studio type')}" style="margin-bottom:var(--sp-4)">
          <button class="tab is-active" type="button" data-studio-filter="all" aria-selected="true">${tr('Tất cả', 'All')}</button>
          <button class="tab" type="button" data-studio-filter="super" aria-selected="false">Super-Megalive</button>
          <button class="tab" type="button" data-studio-filter="standard" aria-selected="false">${tr('Tiêu chuẩn', 'Standard')}</button>
          <button class="tab" type="button" data-studio-filter="pod" aria-selected="false">Mini pod</button>
        </div>
        <div class="grid grid--3" id="studio-grid">${STUDIOS.map(studioCard).join('')}</div>
      </div>
    </section>
    <section class="section section--alt" id="tham-quan-360">
      <div class="container">
        <div class="split split--7-5">
          <div>${viewer360Markup({ label: tr('Ảnh toàn cảnh 360°: Super-Megalive Studio', '360° panorama: Super-Megalive Studio') })}</div>
          <div class="stack">
            <span class="kicker">${tr('Tham quan', 'Tour')}</span>
            <h2>${tr('Xem trường quay trước khi đặt lịch', 'See the studio before you book')}</h2>
            <p class="lede">${tr('Ảnh toàn cảnh 360° giúp bạn hình dung sân khấu, ánh sáng và luồng di chuyển. Khi chưa có file toàn cảnh, website hiển thị ảnh tĩnh đúng tỉ lệ.', 'The panorama helps you picture the stage, lighting and flow. Until a panorama file is available, a correctly proportioned still image is shown.')}</p>
            <div class="card card--accent" style="gap:8px">
              <strong style="font-family:var(--font-heading)">${tr('Đặt lịch tham quan trực tiếp', 'Book an on-site tour')}</strong>
              <p class="card__body">${tr('Tham quan 30 phút tại 232/14 Võ Thị Sáu, TP.HCM. Có hướng dẫn viên kỹ thuật, không phí.', 'A 30-minute tour at 232/14 Vo Thi Sau, HCMC. Technical host included, free of charge.')}</p>
              <a class="btn btn--sm" href="#/lien-he">${tr('Đặt lịch tham quan', 'Book a tour')}</a>
            </div>
            <p class="small muted">${tr('Ảnh và video thật của từng studio sẽ được cập nhật khi đội vận hành bàn giao tư liệu.', 'Real photos and video will be added when the operations team delivers the assets.')}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div class="stack">
            <span class="kicker">${tr('Đến V-HUB', 'Getting here')}</span>
            <h2>${tr('Địa chỉ, giờ mở cửa và hướng dẫn', 'Address, opening hours and directions')}</h2>
            <div class="spec-list">
              <div><span class="spec-label">${tr('Địa chỉ', 'Address')}</span><span class="spec-value">${esc(ORG.address)}</span></div>
              <div><span class="spec-label">${tr('Giờ mở cửa', 'Opening hours')}</span><span class="spec-value">${esc(ORG.hours)}</span></div>
              <div><span class="spec-label">${tr('Đỗ xe', 'Parking')}</span><span class="spec-value">${tr('Bãi xe toà nhà, cổng Võ Thị Sáu', 'Building parking, Vo Thi Sau entrance')}</span></div>
              <div><span class="spec-label">${tr('Hotline', 'Hotline')}</span><span class="spec-value"><a href="${ORG.hotlineHref}">${esc(ORG.hotline)}</a></span></div>
            </div>
            <div class="row" style="gap:10px"><a class="btn btn--ghost" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${tr('Gọi hotline', 'Call us')}</span></a><a class="btn btn--ghost" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>Zalo OA</span></a></div>
          </div>
          <div class="footer__map" style="border-color:var(--outline)"><iframe src="${esc(ORG.mapEmbed)}" title="Bản đồ V-HUB" loading="lazy"></iframe></div>
        </div>
      </div>
    </section>
    <section class="section section--tight cta-band" id="dat-lich">
      <div class="container">
        <div class="cta-band__inner">
          <div class="stack"><span class="kicker">${tr('Đặt lịch', 'Booking')}</span><h2>${tr('Chọn studio và khung giờ phù hợp', 'Pick a studio and a time slot')}</h2><p class="lede">${tr('Chọn studio để xem lịch trống theo tuần và đặt lịch. Hệ thống chống trùng lịch phía máy chủ và cấp mã đặt chỗ.', 'Choose a studio to see weekly availability and book. Conflicts are blocked server-side and a booking code is issued.')}</p></div>
          <div class="card" style="background:var(--surface)">
            <div class="stack" style="gap:8px">
              ${STUDIOS.map(
                (s) => `<a class="quick-channel" href="#/studio/${esc(s.slug)}#dat-lich" style="justify-content:space-between">
                  <span>${esc(s.name)}</span><span class="xsmall muted">${esc(s.priceLabel)}</span>
                </a>`,
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Chi tiết + đặt lịch ---------- */
function detailPage(s) {
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'Studio', href: '#/studio' }, { label: s.name }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${esc(s.typeLabel)}</span>
          <h1>${esc(s.name)}</h1>
          <p class="lede">${esc(s.summary)}</p>
          <div class="row" style="gap:8px">
            <span class="badge">${s.area}m²</span>
            <span class="badge">${tr('Sức chứa', 'Capacity')} ${s.capacity}</span>
            ${s.tags.map((t) => `<span class="badge badge--primary">${esc(t)}</span>`).join('')}
          </div>
          <div class="row" style="gap:10px">
            <a class="btn" href="#dat-lich">${tr('Đặt lịch studio', 'Book this studio')}${icon('arrowRight', 'btn__icon')}</a>
            <span class="badge" style="min-height:44px;padding-inline:14px">${esc(s.priceLabel)}</span>
          </div>
        </div>
        ${media({ src: s.images[0]?.src, label: s.images[0]?.label || `Ảnh thật: ${s.name}`, ratio: '4x3' })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div class="stack">
            <div id="gallery-main">${media({ src: s.images[0]?.src, label: s.images[0]?.label || `Ảnh thật: ${s.name}`, ratio: '4x3' })}</div>
            <div class="thumb-row" style="grid-template-columns:repeat(2,1fr);margin-top:0">
              ${s.images
                .map(
                  (img, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}" data-gallery="${esc(img.src || '')}" data-gallery-label="${esc(img.label)}" aria-label="${esc(img.label)}">
                    ${media({ src: img.src, label: img.label, ratio: '4x3' })}
                  </button>`,
                )
                .join('')}
            </div>
            ${viewer360Markup({ studio: s, label: `Ảnh toàn cảnh 360°: ${s.name}` })}
          </div>
          <div class="stack">
            <h2 style="font-size:var(--fs-h2)">${tr('Thiết bị & cấu hình', 'Equipment & setup')}</h2>
            <ul class="plan__list">
              ${s.equipment.map((e) => `<li>${icon('check')}<span>${esc(e)}</span></li>`).join('')}
            </ul>
            <div class="spec-list">
              <div><span class="spec-label">${tr('Diện tích', 'Area')}</span><span class="spec-value">${s.area} m²</span></div>
              <div><span class="spec-label">${tr('Sức chứa', 'Capacity')}</span><span class="spec-value">${s.capacity} ${tr('người', 'people')}</span></div>
              <div><span class="spec-label">${tr('Giá theo giờ', 'Hourly rate')}</span><span class="spec-value">${formatCurrency(s.pricePerHour)}/giờ</span></div>
              <div><span class="spec-label">${tr('Ca tiêu chuẩn', 'Standard slot')}</span><span class="spec-value">4 ${tr('giờ', 'hours')}</span></div>
            </div>
            <p class="note-box">${tr('Giá chưa gồm VAT và dịch vụ thêm. Kỹ thuật viên và host có thể chọn ở bước 2 của luồng đặt lịch.', 'Rates exclude VAT and add-ons. Technicians and hosts can be selected in step 2.')}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--alt" id="dat-lich">
      <div class="container">
        ${sectionHead({ kicker: tr('Đặt lịch', 'Booking'), title: tr('Đặt lịch studio theo 3 bước', 'Book in three steps'), sub: tr('Lịch trống cập nhật theo dữ liệu đặt chỗ thật. Hệ thống chặn trùng lịch ở phía máy chủ.', 'Availability reflects real bookings. Conflicts are blocked server-side.') })}
        <div class="wizard" id="booking-wizard" data-studio="${esc(s.id)}" data-price="${s.pricePerHour}">
          <div>
            <div class="stepper" id="booking-stepper">
              <span class="stepper__item is-current" data-step-label="1"><span class="stepper__num">1</span>${tr('Chọn ngày & giờ', 'Date & time')}</span>
              <span class="stepper__item" data-step-label="2"><span class="stepper__num">2</span>${tr('Gói & dịch vụ', 'Package & add-ons')}</span>
              <span class="stepper__item" data-step-label="3"><span class="stepper__num">3</span>${tr('Thông tin & xác nhận', 'Details & confirm')}</span>
            </div>
            <div id="booking-step-body"></div>
          </div>
          <aside class="wizard__summary">
            <div class="summary-card" id="booking-summary"></div>
            <p class="form-note mt-3">${tr('Đặt chỗ giữ tối đa 24 giờ. V-HUB xác nhận qua điện thoại trong giờ hành chính.', 'Holds are kept for 24 hours. We confirm by phone during office hours.')}</p>
          </aside>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack"><span class="kicker">${tr('Hỏi đáp', 'FAQ')}</span><h2>${tr('Câu hỏi về đặt lịch', 'Booking questions')}</h2></div>
          ${accordion(
            [
              { title: tr('Tôi có thể huỷ hoặc đổi lịch không?', 'Can I cancel or reschedule?'), body: tr('Có. Huỷ miễn phí trước 48 giờ. Trong vòng 48 giờ, V-HUB giữ 50% giá trị đặt chỗ hoặc đổi sang ca khác nếu còn trống.', 'Yes. Free cancellation up to 48 hours ahead. Within 48 hours, 50% is retained or you may move to another available slot.') },
              { title: tr('Có kỹ thuật viên trực không?', 'Is a technician included?'), body: tr('Gói "Chỉ studio" không gồm kỹ thuật. Chọn gói "Kèm kỹ thuật" hoặc "Kèm kỹ thuật và host" ở bước 2.', 'The studio-only package excludes technicians. Choose a technician or technician-plus-host package in step 2.') },
              { title: tr('Có thể thuê dài hạn theo tháng?', 'Monthly rental?'), body: tr('Có. V-HUB có hợp đồng theo tháng cho khung giờ cố định, ưu đãi 10–15% so với giá theo giờ. Liên hệ để nhận báo giá.', 'Yes. Monthly contracts for fixed slots receive 10–15% off hourly rates. Contact us for a quote.') },
            ],
            'studio-faq',
          )}
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Logic đặt lịch chạy phía client ---------- */
function bookingMixin(root, studio) {
  const wizard = root.querySelector('#booking-wizard')
  if (!wizard) return
  const addonList = STUDIO_ADDONS
  const st = { step: 1, date: vnDateKey(), slot: '', packageId: 'tech', addons: [], hours: 4, availability: null, loading: false, booking: null }

  const body = root.querySelector('#booking-step-body')
  const summary = root.querySelector('#booking-summary')

  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() + i * 86400000)
    return { key: vnDateKey(d), dow: weekdayShort(d), day: d.getDate(), month: d.getMonth() + 1 }
  })

  const estimate = () => estimateStudio(studio, st.packageId, st.hours, st.addons)

  function summaryHtml() {
    const e = estimate()
    const slot = TIME_SLOTS.find((x) => x.id === st.slot)
    return `<h3 style="font-size:1rem">${tr('Tóm tắt đặt chỗ', 'Booking summary')}</h3>
      <div class="summary-line"><span>${tr('Studio', 'Studio')}</span><strong>${esc(studio.name)}</strong></div>
      <div class="summary-line"><span>${tr('Ngày', 'Date')}</span><strong>${formatDate(st.date)}</strong></div>
      <div class="summary-line"><span>${tr('Ca', 'Slot')}</span><strong>${slot ? `${slot.label} · ${slot.time}` : tr('Chưa chọn', 'Not selected')}</strong></div>
      <div class="summary-line"><span>${tr('Gói', 'Package')}</span><strong>${esc(STUDIO_PACKAGES.find((p) => p.id === st.packageId)?.label || '')}</strong></div>
      ${e.lines.map((l) => `<div class="summary-line"><span>${esc(l.label)}</span><strong>${formatCurrency(l.amount)}</strong></div>`).join('')}
      <div class="summary-total"><span>${tr('Ước tính', 'Estimate')}</span><strong>${formatCurrency(e.total)}</strong></div>
      <p class="form-note">${tr('Chưa gồm VAT. V-HUB xác nhận giá cuối cùng khi xác nhận lịch.', 'Excludes VAT. Final pricing is confirmed with the booking.')}</p>`
  }

  function render() {
    root.querySelectorAll('[data-step-label]').forEach((node) => {
      const n = Number(node.dataset.stepLabel)
      node.classList.toggle('is-current', n === st.step)
      node.classList.toggle('is-done', n < st.step)
    })
    if (summary) summary.innerHTML = summaryHtml()
    if (!body) return
    if (st.booking) {
      body.innerHTML = `<div class="booking-success">
        <span class="badge badge--verified">${icon('check')}${tr('Đã ghi nhận đặt chỗ', 'Booking received')}</span>
        <h3 style="font-size:var(--fs-h2)">${tr('Mã đặt chỗ của bạn', 'Your booking code')}</h3>
        <span class="booking-code">${esc(st.booking.code)}</span>
        <div class="spec-list" style="width:100%">
          <div><span class="spec-label">${tr('Studio', 'Studio')}</span><span class="spec-value">${esc(studio.name)}</span></div>
          <div><span class="spec-label">${tr('Thời gian', 'Time')}</span><span class="spec-value">${formatDate(st.booking.date)} · ${esc(TIME_SLOTS.find((x) => x.id === st.booking.slot)?.time || st.booking.slot)}</span></div>
          <div><span class="spec-label">${tr('Chi phí ước tính', 'Estimated cost')}</span><span class="spec-value">${formatCurrency(st.booking.estimate)}</span></div>
        </div>
        <p class="small muted">${tr('V-HUB sẽ gọi xác nhận trong 15 phút giờ hành chính. Vui lòng có mặt trước 15 phút.', 'We will call to confirm within 15 minutes during office hours. Please arrive 15 minutes early.')}</p>
        <div class="row" style="gap:10px">
          <button class="btn btn--ghost" type="button" data-booking-ics>${icon('calendar', 'btn__icon')}<span>${tr('Thêm vào lịch', 'Add to calendar')}</span></button>
          <a class="btn btn--ghost" href="${esc(ORG.mapEmbed.replace('&output=embed', ''))}" target="_blank" rel="noopener">${icon('pin', 'btn__icon')}<span>${tr('Xem đường đi', 'Directions')}</span></a>
          <a class="btn" href="#/lich-live">${tr('Xem lịch live', 'View live schedule')}</a>
        </div>
      </div>`
      const icsBtn = body.querySelector('[data-booking-ics]')
      if (icsBtn) {
        icsBtn.addEventListener('click', () => {
          const slot = TIME_SLOTS.find((x) => x.id === st.booking.slot)
          const start = new Date(`${st.booking.date}T${String(slot?.start || 8).padStart(2, '0')}:00:00+07:00`).getTime()
          const end = start + (slot?.hours || 4) * 3600000
          const fmt = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
          const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//V-HUB//Studio Booking//VI', 'BEGIN:VEVENT', `UID:${st.booking.code}@vhub.vn`, `DTSTAMP:${fmt(Date.now())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`, `SUMMARY:Thuê studio ${studio.name} — V-HUB`, `DESCRIPTION:Mã đặt chỗ ${st.booking.code}`, 'LOCATION:232/14 Võ Thị Sáu, P. Xuân Hòa, TP.HCM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
          downloadFile(`vhub-studio-${st.booking.code}.ics`, ics, 'text/calendar;charset=utf-8')
        })
      }
      return
    }
    if (st.step === 1) {
      const slots = st.availability?.slots || TIME_SLOTS.map((s) => ({ ...s, booked: false }))
      body.innerHTML = `<div class="stack">
        <h3>${tr('Chọn ngày', 'Choose a date')}</h3>
        <div class="date-strip" role="group" aria-label="${tr('Chọn ngày', 'Choose a date')}">
          ${dates
            .map(
              (d) => `<button class="date-pill" type="button" data-bdate="${d.key}" aria-pressed="${st.date === d.key}">
                <span>${d.dow}</span><strong>${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}</strong>
              </button>`,
            )
            .join('')}
        </div>
        <div class="row row--between" style="margin-top:8px">
          <h3 style="font-size:1.0625rem">${tr('Chọn ca', 'Choose a slot')}</h3>
          ${st.loading ? `<span class="small muted">${tr('Đang kiểm tra lịch trống…', 'Checking availability…')}</span>` : `<span class="small muted">${tr('4 giờ/ca · giờ Việt Nam', '4 hours per slot · Vietnam time')}</span>`}
        </div>
        <div class="slot-grid" id="slot-grid">
          ${slots
            .map(
              (s) => `<button class="slot ${s.booked ? 'slot--booked' : ''}" type="button" data-slot="${esc(s.id)}" ${s.booked ? 'disabled' : ''} aria-pressed="${st.slot === s.id}">
                <strong>${esc(s.label)}</strong><span>${esc(s.time)}</span><span>${s.booked ? tr('Đã có lịch', 'Booked') : tr('Còn trống', 'Available')}</span>
              </button>`,
            )
            .join('')}
        </div>
        ${st.availability?.error ? `<div class="form-status is-error" style="display:block">${esc(st.availability.error)} <button class="btn btn--link btn--sm" type="button" data-retry-availability>${tr('Thử lại', 'Retry')}</button></div>` : ''}
        <div class="row mt-3">
          <button class="btn" type="button" data-bnext ${st.slot ? '' : 'disabled'}>${tr('Tiếp tục', 'Continue')}${icon('arrowRight', 'btn__icon')}</button>
        </div>
      </div>`
    } else if (st.step === 2) {
      body.innerHTML = `<div class="stack">
        <h3>${tr('Chọn gói', 'Choose a package')}</h3>
        <div class="grid" style="gap:10px">
          ${STUDIO_PACKAGES.map(
            (p) => `<button class="card card--link" type="button" data-package="${p.id}" style="text-align:left;gap:6px;${st.packageId === p.id ? 'border-color:var(--primary);background:var(--primary-container)' : ''}">
              <div class="row row--between"><strong style="font-family:var(--font-heading)">${esc(p.label)}</strong><span class="small">${p.pricePerHour ? `+${formatCurrency(p.pricePerHour)}/ca` : tr('Theo giá studio', 'Base rate')}</span></div>
              <span class="small muted">${esc(p.description)}</span>
            </button>`,
          ).join('')}
        </div>
        <h3 style="margin-top:12px">${tr('Dịch vụ thêm', 'Add-ons')}</h3>
        <div class="grid grid--2" style="gap:8px">
          ${addonList
            .map(
              (a) => `<label class="check" style="padding:10px 12px;border:1px solid var(--outline);border-radius:12px;align-items:center">
                <input type="checkbox" data-addon="${a.id}" ${st.addons.includes(a.id) ? 'checked' : ''} />
                <span style="flex:1">${esc(a.label)}</span>
                <span class="xsmall muted">+${formatCurrency(a.price)}</span>
              </label>`,
            )
            .join('')}
        </div>
        <h3 style="margin-top:12px">${tr('Số giờ dự kiến', 'Hours')}</h3>
        <div class="row" style="gap:8px">
          ${[4, 8]
            .map((h) => `<button class="chip" type="button" data-hours="${h}" aria-pressed="${st.hours === h}">${h} ${tr('giờ', 'hours')}</button>`)
            .join('')}
        </div>
        <div class="row mt-3" style="gap:10px">
          <button class="btn" type="button" data-bnext>${tr('Tiếp tục', 'Continue')}${icon('arrowRight', 'btn__icon')}</button>
          <button class="btn btn--ghost" type="button" data-bback>${tr('Quay lại', 'Back')}</button>
        </div>
      </div>`
    } else {
      const slot = TIME_SLOTS.find((x) => x.id === st.slot)
      body.innerHTML = `<form class="stack" id="booking-form" novalidate>
        <h3>${tr('Thông tin liên hệ', 'Contact details')}</h3>
        <div class="field-grid field-grid--2">
          <div class="field" data-field="b-name"><label for="b-name">${tr('Họ và tên', 'Full name')} <span aria-hidden="true" style="color:var(--primary-deep)">*</span></label><input class="input" id="b-name" name="name" autocomplete="name" required /><span class="field__error">${icon('alert')}<span></span></span></div>
          <div class="field" data-field="b-phone"><label for="b-phone">${tr('Số điện thoại', 'Phone')} <span aria-hidden="true" style="color:var(--primary-deep)">*</span></label><input class="input" id="b-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required /><span class="field__error">${icon('alert')}<span></span></span></div>
        </div>
        <div class="field-grid field-grid--2">
          <div class="field"><label for="b-email">Email</label><input class="input" id="b-email" name="email" type="email" autocomplete="email" /></div>
          <div class="field"><label for="b-company">${tr('Công ty / nhãn hàng', 'Company / brand')}</label><input class="input" id="b-company" name="company" /></div>
        </div>
        <div class="field"><label for="b-notes">${tr('Yêu cầu kỹ thuật hoặc ghi chú', 'Technical requirements or notes')}</label><textarea class="textarea" id="b-notes" name="notes" rows="3" placeholder="${tr('Ví dụ: cần 3 camera, phông nền màu trắng, có host…', 'e.g. three cameras, white backdrop, host needed…')}"></textarea></div>
        <label class="check"><input type="checkbox" id="b-consent" required /><span>${tr('Tôi đồng ý để V-HUB xử lý dữ liệu cá nhân theo', 'I agree that V-HUB may process my personal data per the')} <a href="#/chinh-sach-bao-mat">${tr('Chính sách bảo mật', 'Privacy Policy')}</a>.</span></label>
        <div class="form-status" id="booking-status" role="alert"></div>
        <div class="row" style="gap:10px">
          <button class="btn" type="submit" data-bsubmit>${tr('Xác nhận đặt chỗ', 'Confirm booking')}${icon('arrowRight', 'btn__icon')}</button>
          <button class="btn btn--ghost" type="button" data-bback>${tr('Quay lại', 'Back')}</button>
        </div>
        <p class="form-note">${tr('Bằng việc đặt chỗ, bạn đồng ý nhận cuộc gọi xác nhận từ V-HUB.', 'By booking you agree to receive a confirmation call from V-HUB.')} ${slot ? `· ${esc(slot.time)}` : ''}</p>
      </form>`
      const form = body.querySelector('#booking-form')
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault()
          const name = form.querySelector('#b-name')
          const phone = form.querySelector('#b-phone')
          const consent = form.querySelector('#b-consent')
          const status = form.querySelector('#booking-status')
          const setErr = (id, msg) => {
            const wrap = form.querySelector(`[data-field="${id}"]`)
            if (!wrap) return
            wrap.classList.toggle('has-error', Boolean(msg))
            const box = wrap.querySelector('.field__error span')
            if (box) box.textContent = msg || ''
          }
          let ok = true
          if (!name.value.trim()) {
            setErr('b-name', tr('Vui lòng nhập họ tên.', 'Please enter your name.'))
            ok = false
          } else setErr('b-name', '')
          if (!/^(\+?84|0)\d{9,10}$/.test(phone.value.replace(/[\s.\-()]/g, ''))) {
            setErr('b-phone', tr('Số điện thoại chưa hợp lệ.', 'Invalid phone number.'))
            ok = false
          } else setErr('b-phone', '')
          if (!consent.checked) {
            ok = false
            if (status) {
              status.className = 'form-status is-error'
              status.textContent = tr('Vui lòng đồng ý xử lý dữ liệu cá nhân.', 'Please accept the privacy consent.')
            }
          }
          if (!ok) return
          const submit = form.querySelector('[data-bsubmit]')
          if (submit) submit.disabled = true
          try {
            const res = await createBooking({
              studio_id: studio.id,
              date: st.date,
              slot: st.slot,
              package_id: st.packageId,
              addons: st.addons,
              hours: st.hours,
              name: name.value.trim(),
              phone: phone.value.trim(),
              email: form.querySelector('#b-email').value.trim(),
              company: form.querySelector('#b-company').value.trim(),
              notes: form.querySelector('#b-notes').value.trim(),
              consent: true,
            })
            st.booking = res.booking
            toast(tr('Đã ghi nhận đặt chỗ.', 'Booking received.'), 'success')
            render()
          } catch (err) {
            if (status) {
              status.className = 'form-status is-error'
              status.textContent = err.message || tr('Không gửi được đặt chỗ. Vui lòng thử lại.', 'Could not send the booking. Please try again.')
            }
            if (err.status === 409) {
              loadAvailability()
            }
          } finally {
            if (submit) submit.disabled = false
          }
        })
      }
    }
  }

  async function loadAvailability() {
    st.loading = true
    if (st.step === 1) render()
    try {
      const res = await getAvailability(studio.id, st.date)
      st.availability = res
    } catch (err) {
      st.availability = { slots: TIME_SLOTS.map((s) => ({ ...s, booked: false })), error: err.message }
    } finally {
      st.loading = false
      if (st.step === 1) render()
    }
  }

  const scope = root.querySelector('#main') || root

  scope.addEventListener('click', (e) => {
    const dateBtn = e.target.closest('[data-bdate]')
    if (dateBtn) {
      st.date = dateBtn.dataset.bdate
      st.slot = ''
      loadAvailability()
      render()
      return
    }
    const slotBtn = e.target.closest('[data-slot]')
    if (slotBtn && !slotBtn.disabled) {
      st.slot = slotBtn.dataset.slot
      render()
      return
    }
    const pkg = e.target.closest('[data-package]')
    if (pkg) {
      st.packageId = pkg.dataset.package
      render()
      return
    }
    const hours = e.target.closest('[data-hours]')
    if (hours) {
      st.hours = Number(hours.dataset.hours)
      render()
      return
    }
    const next = e.target.closest('[data-bnext]')
    if (next && !next.disabled) {
      if (st.step === 1 && !st.slot) return
      st.step = Math.min(3, st.step + 1)
      render()
      return
    }
    const back = e.target.closest('[data-bback]')
    if (back) {
      st.step = Math.max(1, st.step - 1)
      render()
      return
    }
    const retry = e.target.closest('[data-retry-availability]')
    if (retry) {
      loadAvailability()
      return
    }
    const gallery = e.target.closest('[data-gallery]')
    if (gallery) {
      root.querySelectorAll('[data-gallery]').forEach((b) => b.classList.remove('is-active'))
      gallery.classList.add('is-active')
      const main = root.querySelector('#gallery-main')
      if (main) {
        const src = gallery.getAttribute('data-gallery') || ''
        const label = gallery.getAttribute('data-gallery-label') || 'Ảnh thật studio'
        main.innerHTML = `<figure class="media media--4x3"><div class="media__placeholder">${icon('camera')}<span>${esc(label)}</span></div>${src ? `<img class="media__img" src="${esc(src)}" alt="${esc(label)}" onerror="this.remove()" />` : ''}</figure>`
      }
    }
  })

  scope.addEventListener('change', (e) => {
    const addon = e.target.closest('[data-addon]')
    if (addon) {
      const id = addon.dataset.addon
      st.addons = addon.checked ? Array.from(new Set([...st.addons, id])) : st.addons.filter((a) => a !== id)
      render()
    }
  })

  loadAvailability()
  render()
}

/* ---------- Entry ---------- */
export function render(ctx) {
  const seg = ctx.segments
  const slug = seg[1]
  if (!slug) {
    return {
      title: 'Studio V-HUB — Studio chuẩn truyền hình tại TP.HCM',
      description: 'Cụm 14 studio theo biên bản ghi nhớ, gồm 13 studio tiêu chuẩn và 1 Super-Megalive. Bảng giá, thiết bị, lịch trống và đặt lịch trực tuyến.',
      html: listPage(),
      mount(root) {
        attach360(root)
        root.querySelectorAll('[data-studio-filter]').forEach((tab) => {
          tab.addEventListener('click', () => {
            root.querySelectorAll('[data-studio-filter]').forEach((t) => {
              t.classList.remove('is-active')
              t.setAttribute('aria-selected', 'false')
            })
            tab.classList.add('is-active')
            tab.setAttribute('aria-selected', 'true')
            const type = tab.dataset.studioFilter
            const list = type === 'all' ? STUDIOS : STUDIOS.filter((s) => s.type === type)
            const grid = root.querySelector('#studio-grid')
            if (grid) grid.innerHTML = list.length ? list.map(studioCard).join('') : emptyState({ title: 'Chưa có studio phù hợp', text: 'Vui lòng chọn loại studio khác.' })
          })
        })
      },
    }
  }
  if (slug === 'dat-lich') {
    return {
      title: 'Đặt lịch studio — V-HUB',
      description: 'Chọn studio, xem lịch trống theo tuần và đặt lịch thuê studio tại V-HUB.',
      html: listPage().replace('<main id="main">', '<main id="main" data-book-landing="1">'),
      mount(root) {
        attach360(root)
        const target = root.querySelector('#dat-lich')
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
    }
  }
  const studio = getStudio(slug)
  if (!studio) return null
  return {
    title: `${studio.name} — Studio V-HUB`,
    description: `${studio.summary} Diện tích ${studio.area}m², sức chứa ${studio.capacity} người, ${studio.priceLabel}.`,
    html: detailPage(studio),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: studio.name,
      description: studio.summary,
      brand: { '@type': 'Brand', name: 'V-HUB' },
      offers: { '@type': 'Offer', priceCurrency: 'VND', price: studio.pricePerHour, availability: 'https://schema.org/InStock' },
    },
    mount(root) {
      attach360(root)
      bookingMixin(root, studio)
    },
  }
}
