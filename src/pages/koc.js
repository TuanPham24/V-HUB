/** KOCViet: hub 2 vai trò, tìm & lọc nhà sáng tạo, hồ sơ, định danh, đại sứ, affiliate. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ORG } from '../lib/catalog-site.js'
import {
  KOCS,
  KOC_FILTERS,
  KOC_TIERS,
  AMBASSADORS,
  AFFILIATE_GROUPS,
  KOC_BOOKING_STEPS,
  getKoc,
  formatFollowers,
} from '../lib/catalog-koc.js'
import { PLATFORMS } from '../lib/catalog-site.js'
import { getLives } from '../lib/data.js'
import { liveState } from '../lib/catalog-schedule.js'
import { formatCurrency, formatDate, isValidPhone } from '../lib/format.js'
import { kocPortrait, media, linkArrow, sectionHead, iconTile, badgeVerified, badgeDemo, breadcrumb, emptyState, openModal } from '../components/ui.js'
import { leadFormMarkup } from '../components/forms.js'
import { submitLead } from '../lib/api.js'
import { getUtm, sourcePage, track } from '../lib/store.js'

function kocCard(k) {
  return `<article class="koc-card">
    <a class="koc-card__avatar" href="#/kocviet/${esc(k.slug)}" aria-label="${esc(k.name)}">
      ${kocPortrait(k)}
      <span class="koc-verified">${badgeVerified('Đã định danh')}</span>
    </a>
    <div class="koc-card__body">
      <div class="row row--between">
        <a class="koc-card__name" href="#/kocviet/${esc(k.slug)}">${esc(k.name)}</a>
        <span class="badge badge--primary">${esc(k.tier)}</span>
      </div>
      <div class="koc-card__meta"><span>${esc(k.industry)}</span><span>${esc(k.region)}</span></div>
      <div class="koc-card__stats">
        <div><strong>${formatFollowers(k.followers)}</strong>${tr('theo dõi', 'followers')}</div>
        <div><strong>${k.engagement.toString().replace('.', ',')}%</strong>${tr('tương tác', 'engagement')}</div>
        <div><strong>${k.liveSessions}</strong>${tr('phiên V-HUB', 'V-HUB sessions')}</div>
      </div>
      <div class="row" style="gap:6px">${k.platforms.map((p) => `<span class="platform">${icon(PLATFORMS[p]?.icon || 'play')}${esc(PLATFORMS[p]?.label || p)}</span>`).join('')}</div>
      <div class="row" style="gap:8px;margin-top:4px">
        <a class="btn btn--ghost btn--sm" href="#/kocviet/${esc(k.slug)}">${tr('Xem hồ sơ', 'View profile')}</a>
        <span class="xsmall muted">${formatCurrency(k.budgetMin)} – ${formatCurrency(k.budgetMax)}/${tr('phiên', 'session')}</span>
      </div>
    </div>
  </article>`
}

/* ---------- Hub ---------- */
function hubPage() {
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'KOCViet' }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">KOCViet</span>
          <h1>${tr('Nhà sáng tạo được định danh. Nhãn hàng yên tâm lên sóng.', 'Verified creators. Confident brands.')}</h1>
          <p class="lede">${tr('KOCViet là nền tảng định danh nhà sáng tạo của V-HUB: xác minh danh tính, lịch sử phiên live, hợp đồng số, ký quỹ và đối soát tự động.', 'KOCViet is V-HUB’s creator verification platform: ID checks, session history, digital contracts, escrow and automatic reconciliation.')}</p>
          <div class="tabs" role="tablist" aria-label="${tr('Chọn vai trò', 'Choose your role')}" style="margin-top:8px">
            <button class="tab is-active" type="button" role="tab" aria-selected="true" data-koc-tab="brand">${tr('Tôi là doanh nghiệp', 'I am a brand')}</button>
            <button class="tab" type="button" role="tab" aria-selected="false" data-koc-tab="creator">${tr('Tôi là nhà sáng tạo', 'I am a creator')}</button>
          </div>
        </div>
        ${media({ src: '/images/koc/xac-minh-ho-so.jpg', label: tr('Buổi định danh KOC tại V-HUB', 'Creator verification day at V-HUB'), ratio: '4x3', badge: badgeDemo() })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section" data-koc-panel="brand">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack">
            <span class="kicker">${tr('Cho doanh nghiệp', 'For brands')}</span>
            <h2>${tr('Tìm đúng người, chốt đúng phiên', 'Find the right creator, book the right session')}</h2>
            <p class="lede">${tr('Hồ sơ có huy hiệu định danh, chỉ số và lịch sử phiên tại V-HUB. Booking có hợp đồng số và ký quỹ, không thoả thuận miệng.', 'Profiles show verification badges, metrics and V-HUB session history. Booking includes digital contracts and escrow.')}</p>
            <div class="grid grid--2" style="gap:10px">
              ${KOC_BOOKING_STEPS.map(
                (s) => `<div class="card card--flat" style="gap:4px"><span class="badge badge--primary">0${s.step}</span><strong style="font-family:var(--font-heading);font-size:.875rem">${esc(s.title)}</strong><span class="small muted">${esc(s.body)}</span></div>`,
              ).join('')}
            </div>
            <div class="row" style="gap:10px"><a class="btn" href="#/kocviet/tim-kiem">${tr('Tìm nhà sáng tạo', 'Find creators')}${icon('arrowRight', 'btn__icon')}</a><a class="btn btn--ghost" href="#/lien-he">${tr('Nhờ V-HUB đề xuất', 'Ask V-HUB to shortlist')}</a></div>
          </div>
          <div class="grid grid--2">${KOCS.slice(0, 4).map(kocCard).join('')}</div>
        </div>
      </div>
    </section>
    <section class="section section--alt" data-koc-panel="creator" hidden>
      <div class="container">
        <div class="split split--5-7">
          <div class="stack">
            <span class="kicker">${tr('Cho nhà sáng tạo', 'For creators')}</span>
            <h2>${tr('Định danh để nhận booking từ nhãn hàng uy tín', 'Get verified to receive trusted brand bookings')}</h2>
            <p class="lede">${tr('Hồ sơ định danh mở khoá booking, ký quỹ, lộ trình thăng hạng và mức hoa hồng affiliate cao hơn.', 'Verification unlocks bookings, escrow, tier progression and higher affiliate commissions.')}</p>
            <ul class="plan__list">
              <li>${icon('verified')}<span>${tr('Huy hiệu “Đã định danh KOCViet” trên hồ sơ công khai.', '“KOCViet verified” badge on your public profile.')}</span></li>
              <li>${icon('wallet')}<span>${tr('Thanh toán qua ký quỹ, đối soát tự động sau phiên.', 'Escrow payment with automatic reconciliation.')}</span></li>
              <li>${icon('award')}<span>${tr('Lộ trình: Tân binh → Chính danh → Ngôi sao → Nghệ sĩ.', 'Tier path: Rookie → Verified → Star → Artist.')}</span></li>
            </ul>
            <div class="row" style="gap:10px"><a class="btn" href="#/kocviet/dinh-danh">${tr('Đăng ký định danh', 'Get verified')}${icon('arrowRight', 'btn__icon')}</a><a class="btn btn--ghost" href="#/kocviet/affiliate">${tr('Xem hoa hồng affiliate', 'Affiliate commissions')}</a></div>
          </div>
          <div class="stack">
            ${KOC_TIERS.map((t, i) => `<div class="card" style="gap:6px"><div class="row row--between"><strong style="font-family:var(--font-heading)">${esc(t.tier)}</strong><span class="badge">${tr('Cấp', 'Level')} ${i + 1}</span></div><span class="small muted">${esc(t.criteria[0])}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Đại sứ', 'Ambassadors'), title: tr('Đại sứ KOCViet', 'KOCViet ambassadors'), action: linkArrow(tr('Xem tất cả', 'View all'), '#/kocviet/dai-su') })}
        <div class="grid grid--2">
          ${AMBASSADORS.map(
            (a) => `<article class="card" style="padding:10px">
              ${media({ src: a.imageSrc, label: tr(`Chân dung AI minh họa: ${a.name}`, `AI portrait: ${a.name}`), ratio: '4x5', badge: `<span class="badge badge--demo">${tr('Ảnh AI minh họa', 'AI illustration')}</span>` })}
              <div style="padding:6px"><h3 class="card__title">${esc(a.name)}</h3><p class="small muted">${esc(a.role)} · ${esc(a.note)}</p></div>
            </article>`,
          ).join('')}
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Tìm kiếm ---------- */
function searchPage() {
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'KOCViet', href: '#/kocviet' }, { label: tr('Tìm nhà sáng tạo', 'Find creators') }])}
      <div class="stack" style="max-width:760px">
        <span class="kicker">${tr('Tìm nhà sáng tạo', 'Find creators')}</span>
        <h1>${tr('Chọn người phù hợp với sản phẩm của bạn', 'Choose creators who fit your product')}</h1>
        <p class="lede">${tr('Lọc theo ngành, khu vực, nền tảng, hạng và ngân sách. Hồ sơ có huy hiệu định nghĩa và lịch sử phiên tại V-HUB.', 'Filter by category, region, platform, tier and budget. Profiles show verification and V-HUB session history.')}</p>
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="search-layout">
          <aside class="filter-panel" aria-label="${tr('Bộ lọc', 'Filters')}">
            <div class="field">
              <label for="koc-q">${tr('Từ khoá', 'Keyword')}</label>
              <input class="input" id="koc-q" type="search" placeholder="${tr('Tên, ngành hàng…', 'Name, category…')}" />
            </div>
            <div class="filter-group"><h3>${tr('Ngành hàng', 'Category')}</h3><select class="select" id="koc-industry"><option value="">${tr('Tất cả ngành', 'All categories')}</option>${KOC_FILTERS.industries.map((i) => `<option>${esc(i)}</option>`).join('')}</select></div>
            <div class="filter-group"><h3>${tr('Khu vực', 'Region')}</h3><select class="select" id="koc-region"><option value="">${tr('Toàn quốc', 'Nationwide')}</option>${KOC_FILTERS.regions.map((i) => `<option>${esc(i)}</option>`).join('')}</select></div>
            <div class="filter-group"><h3>${tr('Nền tảng', 'Platform')}</h3><select class="select" id="koc-platform"><option value="">${tr('Tất cả nền tảng', 'All platforms')}</option>${Object.entries(PLATFORMS).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('')}</select></div>
            <div class="filter-group"><h3>${tr('Hạng', 'Tier')}</h3><select class="select" id="koc-tier"><option value="">${tr('Tất cả hạng', 'All tiers')}</option>${KOC_FILTERS.tiers.map((i) => `<option>${esc(i)}</option>`).join('')}</select></div>
            <div class="filter-group"><h3>${tr('Ngân sách mỗi phiên', 'Budget per session')}</h3><select class="select" id="koc-budget"><option value="">${tr('Mọi ngân sách', 'Any budget')}</option>${KOC_FILTERS.budgets.map((b) => `<option value="${b.id}">${esc(b.label)}</option>`).join('')}</select></div>
            <button class="btn btn--ghost btn--sm" type="button" id="koc-reset">${icon('rotate', 'btn__icon')}<span>${tr('Xoá bộ lọc', 'Reset filters')}</span></button>
          </aside>
          <div>
            <div class="result-bar">
              <span class="small muted" id="koc-count">${tr('Đang tải…', 'Loading…')}</span>
              <div class="row" style="gap:8px">
                <label class="sr-only" for="koc-sort">${tr('Sắp xếp', 'Sort')}</label>
                <select class="select" id="koc-sort" style="min-height:44px;font-size:.8125rem;width:auto">
                  <option value="relevant">${tr('Phù hợp nhất', 'Most relevant')}</option>
                  <option value="tier">${tr('Hạng cao nhất', 'Highest tier')}</option>
                  <option value="price-asc">${tr('Giá thấp đến cao', 'Price: low to high')}</option>
                  <option value="price-desc">${tr('Giá cao đến thấp', 'Price: high to low')}</option>
                </select>
              </div>
            </div>
            <div class="grid grid--3" id="koc-results"></div>
          </div>
        </div>
        <p class="small muted mt-4">${tr('Tên, chỉ số và mức giá là dữ liệu minh hoạ cho bản demo. Hồ sơ thật được đồng bộ từ nền tảng KOCViet khi kết nối API.', 'Names, metrics and rates are illustrative for this demo. Real profiles sync from KOCViet once the API is connected.')} ${badgeDemo()}</p>
      </div>
    </section>
  </main>`
}

/* ---------- Hồ sơ ---------- */
function profilePage(k) {
  const similar = KOCS.filter((x) => x.slug !== k.slug && (x.industry === k.industry || x.region === k.region)).slice(0, 3)
  const sessions = getLives()
    .filter((s) => liveState(s) === 'ended')
    .slice(0, 3)
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'KOCViet', href: '#/kocviet' }, { label: tr('Tìm nhà sáng tạo', 'Find creators'), href: '#/kocviet/tim-kiem' }, { label: k.name }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <div class="row" style="gap:8px">${badgeVerified()} <span class="badge badge--primary">${esc(k.tier)}</span> <span class="badge">${esc(k.industry)}</span> <span class="badge">${esc(k.region)}</span></div>
          <h1>${esc(k.name)}</h1>
          <p class="lede">${esc(k.bio)}</p>
          <div class="row" style="gap:6px">${k.platforms.map((p) => `<span class="platform">${icon(PLATFORMS[p]?.icon || 'play')}${esc(PLATFORMS[p]?.label || p)}</span>`).join('')}</div>
          <div class="spec-row" style="max-width:520px">
            <div><strong>${formatFollowers(k.followers)}</strong><span>${tr('người theo dõi', 'followers')}</span></div>
            <div><strong>${k.engagement.toString().replace('.', ',')}%</strong><span>${tr('tương tác', 'engagement')}</span></div>
            <div><strong>${k.liveSessions}</strong><span>${tr('phiên tại V-HUB', 'V-HUB sessions')}</span></div>
          </div>
        </div>
        <div class="card" style="padding:10px">
          <div class="koc-card__avatar" style="aspect-ratio:1">
            ${kocPortrait(k)}
            <span class="koc-verified">${badgeVerified()}</span>
          </div>
          <div style="padding:10px" class="stack stack--sm">
            <div class="spec-list">
              <div><span class="spec-label">${tr('Ngân sách tham khảo', 'Reference budget')}</span><span class="spec-value">${formatCurrency(k.budgetMin)} – ${formatCurrency(k.budgetMax)}</span></div>
              <div><span class="spec-label">${tr('Hạng', 'Tier')}</span><span class="spec-value">${esc(k.tier)}</span></div>
              <div><span class="spec-label">${tr('Trạng thái', 'Status')}</span><span class="spec-value">${tr('Đang nhận booking', 'Accepting bookings')}</span></div>
            </div>
            <button class="btn btn--block" type="button" data-book-koc="${esc(k.slug)}">${icon('calendar', 'btn__icon')}<span>${tr('Gửi yêu cầu booking', 'Send booking request')}</span></button>
            <a class="btn btn--ghost btn--block btn--sm" href="#/lien-he">${tr('Nhờ V-HUB tư vấn', 'Ask V-HUB for advice')}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div class="stack">
            <h2>${tr('Lịch sử phiên tại V-HUB', 'V-HUB session history')}</h2>
            ${sessions.length ? `<div class="stack" style="gap:8px">${sessions
              .map(
                (s) => `<div class="card" style="flex-direction:row;align-items:center;justify-content:space-between;gap:12px;padding:14px">
                  <div><strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(s.title)}</strong><div class="xsmall muted">${formatDate(s.starts_at)} · ${esc(s.brand)}</div></div>
                  <span class="badge">${tr('Đã kết thúc', 'Ended')}</span>
                </div>`,
              )
              .join('')}</div>` : emptyState({ title: tr('Chưa có phiên nào được ghi nhận', 'No sessions recorded yet'), text: tr('Lịch sử phiên sẽ xuất hiện sau khi nhà sáng tạo tham gia phiên tại V-HUB.', 'History appears after the creator joins a V-HUB session.') })}
            <h2 style="margin-top:16px">${tr('Nhóm hàng phù hợp', 'Suitable categories')}</h2>
            <div class="row">${[k.industry, ...KOC_FILTERS.industries.filter((i) => i !== k.industry).slice(0, 3)].map((i) => `<span class="tag">${esc(i)}</span>`).join('')}</div>
            <p class="note-box">${tr('Chỉ số và lịch sử phiên là dữ liệu minh hoạ cho bản demo. Hồ sơ chính thức được đồng bộ từ KOCViet.', 'Metrics and session history are illustrative for this demo. The official profile syncs from KOCViet.')}</p>
          </div>
          <div class="stack">
            <h2>${tr('Quy trình booking', 'Booking process')}</h2>
            <div class="timeline">
              ${KOC_BOOKING_STEPS.map((s) => `<div class="timeline__item"><span class="timeline__num">${s.step}</span><div class="timeline__body"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
    ${
      similar.length
        ? `<section class="section section--alt"><div class="container">${sectionHead({ kicker: tr('Tương tự', 'Similar'), title: tr('Nhà sáng tạo cùng ngành hoặc khu vực', 'Creators in the same category or region') })}<div class="grid grid--3">${similar.map(kocCard).join('')}</div></div></section>`
        : ''
    }
  </main>`
}

function openBookingModal(k) {
  const html = `<h2 style="font-size:1.25rem;padding-right:36px">${tr('Gửi yêu cầu booking', 'Booking request')}</h2>
    <p class="small muted" style="margin-top:6px">${esc(k.name)} · ${esc(k.industry)} · ${esc(k.tier)}</p>
    <form class="stack mt-4" id="koc-booking-form" novalidate>
      <div class="field"><label for="kb-product">${tr('Sản phẩm / nhãn hàng', 'Product / brand')}</label><input class="input" id="kb-product" required placeholder="${tr('Tên sản phẩm cần booking', 'Product to promote')}" /></div>
      <div class="field-grid field-grid--2">
        <div class="field"><label for="kb-time">${tr('Thời gian dự kiến', 'Preferred timing')}</label><input class="input" id="kb-time" type="date" required /></div>
        <div class="field"><label for="kb-budget">${tr('Ngân sách', 'Budget')}</label><select class="select" id="kb-budget"><option>${tr('Dưới 10 triệu', 'Under 10m')}</option><option>${tr('10 – 20 triệu', '10 – 20m')}</option><option>${tr('20 – 30 triệu', '20 – 30m')}</option><option>${tr('Trên 30 triệu', 'Over 30m')}</option></select></div>
      </div>
      <div class="field"><label for="kb-name">${tr('Người liên hệ', 'Contact name')}</label><input class="input" id="kb-name" autocomplete="name" required /></div>
      <div class="field"><label for="kb-phone">${tr('Số điện thoại', 'Phone')}</label><input class="input" id="kb-phone" type="tel" inputmode="tel" required /></div>
      <div class="field"><label for="kb-note">${tr('Ghi chú', 'Notes')}</label><textarea class="textarea" id="kb-note" rows="2" placeholder="${tr('Kịch bản mong muốn, sản phẩm chủ lực…', 'Desired format, hero product…')}"></textarea></div>
      <label class="check"><input type="checkbox" id="kb-terms" required /><span>${tr('Tôi đồng ý điều khoản booking và xử lý dữ liệu cá nhân của V-HUB.', 'I accept V-HUB’s booking terms and privacy policy.')}</span></label>
      <div class="form-status" id="kb-status" role="alert"></div>
      <div class="row" style="gap:10px"><button class="btn" type="submit">${tr('Gửi yêu cầu', 'Send request')}</button><button class="btn btn--ghost" type="button" data-modal-close>${tr('Đóng', 'Close')}</button></div>
    </form>`
  const modal = openModal(html, { label: 'Gửi yêu cầu booking' })
  const form = modal.querySelector('#koc-booking-form')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const status = form.querySelector('#kb-status')
    const product = form.querySelector('#kb-product').value.trim()
    const time = form.querySelector('#kb-time').value
    const name = form.querySelector('#kb-name').value.trim()
    const phone = form.querySelector('#kb-phone').value.trim()
    const terms = form.querySelector('#kb-terms').checked
    if (!product || !time || !name || !isValidPhone(phone) || !terms) {
      status.className = 'form-status is-error'
      status.textContent = tr('Vui lòng điền đủ thông tin, số điện thoại hợp lệ và đồng ý điều khoản.', 'Please complete all fields, use a valid phone number and accept the terms.')
      return
    }
    try {
      await submitLead({
        type: 'booking-koc',
        name,
        phone,
        email: '',
        audience: 'nhan-hang',
        company: product,
        needs: 'Booking KOC',
        message: `Booking ${k.name} (${k.slug}) · thời gian ${time} · ngân sách ${form.querySelector('#kb-budget').value} · ${form.querySelector('#kb-note').value.trim()}`,
        consent: true,
        page: sourcePage(),
        utm: getUtm(),
      })
      track('koc_booking_submit', { koc: k.slug })
      modal.querySelector('.modal__panel').innerHTML = `<div class="stack" style="padding:8px"><span class="badge badge--verified">${icon('check')}${tr('Đã gửi yêu cầu', 'Request sent')}</span><h2 style="font-size:1.25rem">${tr('V-HUB sẽ phản hồi trong 15 phút', 'We will reply within 15 minutes')}</h2><p class="small muted">${tr('Đội booking sẽ gọi xác nhận và gửi danh sách KOC thay thế nếu cần.', 'Our booking desk will call to confirm and suggest alternatives if needed.')}</p><a class="btn" href="#/kocviet/tim-kiem" data-modal-close>${tr('Tiếp tục tìm KOC', 'Keep browsing')}</a></div>`
    } catch (err) {
      status.className = 'form-status is-error'
      status.textContent = err.message || tr('Không gửi được yêu cầu.', 'Could not send the request.')
    }
  })
}

/* ---------- Định danh ---------- */
function verifyPage() {
  return `<div class="page-hero page-hero--navy">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'KOCViet', href: '#/kocviet' }, { label: tr('Trở thành KOC chính danh', 'Become a verified KOC') }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${tr('Định danh', 'Verification')}</span>
          <h1>${tr('Trở thành KOC chính danh', 'Become a verified KOC')}</h1>
          <p class="lede">${tr('Định danh không phải thủ tục hành chính. Đó là cách bảo vệ nhãn hàng, người xem và chính bạn trước những rủi ro không lường trước.', 'Verification is not paperwork. It protects brands, audiences and you.')}</p>
          <div class="row" style="gap:10px">
            <a class="btn btn--on-dark" href="${esc(ORG.kocvietAppUrl)}" target="_blank" rel="noopener">${tr('Đăng ký trên KOCViet', 'Register on KOCViet')}${icon('external', 'btn__icon')}</a>
            <a class="btn btn--outline-light" href="#dang-ky">${tr('Để V-HUB liên hệ trước', 'Ask V-HUB to contact you')}</a>
          </div>
          <p class="xsmall" style="color:var(--on-secondary-muted)">${tr('Nút đăng ký dẫn sang ứng dụng KOCViet (URL cấu hình trong src/lib/catalog-site.js).', 'The register button opens the KOCViet app (URL configured in src/lib/catalog-site.js).')}</p>
        </div>
        ${media({ src: '/images/koc/xac-minh-ho-so.jpg', label: tr('Buổi xác minh hồ sơ KOC', 'Creator verification'), ratio: '4x3', dark: true })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Ba lớp xác minh', 'Three verification layers'), title: tr('Điều gì được xác minh?', 'What gets verified?') })}
        <div class="grid grid--3">
          ${[
            { icon: 'shield', title: tr('Danh tính', 'Identity'), body: tr('CCCD và thông tin liên hệ, đối chiếu với tài khoản nhận thanh toán.', 'ID document and contact details, matched with the payout account.') },
            { icon: 'target', title: tr('Năng lực', 'Capability'), body: tr('Lịch sử phiên live, chỉ số tương tác và đánh giá từ nhãn hàng trước.', 'Session history, engagement metrics and previous brand ratings.') },
            { icon: 'check', title: tr('Cam kết', 'Commitment'), body: tr('Quy định nội dung, hàng cấm, trách nhiệm bồi thường khi vi phạm.', 'Content rules, prohibited goods and liability for violations.') },
          ]
            .map((t) => `<article class="card">${iconTile(t.icon)}<h3 class="card__title">${esc(t.title)}</h3><p class="card__body">${esc(t.body)}</p></article>`)
            .join('')}
        </div>
        <p class="note-box mt-4">${tr('Thời gian xử lý trung bình: 3 ngày làm việc. Hồ sơ chưa đạt sẽ được hướng dẫn bổ sung cụ thể.', 'Average processing time: 3 working days. Incomplete applications receive specific guidance.')}</p>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Thang hạng', 'Tiers'), title: tr('Bốn cấp bậc KOCViet', 'Four KOCViet tiers'), sub: tr('Tiêu chí công khai, xét theo dữ liệu phiên thật và đánh giá của nhãn hàng.', 'Public criteria based on real session data and brand ratings.') })}
        <div class="grid grid--4">
          ${KOC_TIERS.map(
            (t, i) => `<article class="card"><span class="badge badge--primary">${tr('Cấp', 'Level')} ${i + 1}</span><h3 class="card__title">${esc(t.tier)}</h3><ul class="plan__list">${t.criteria.map((c) => `<li>${icon('check')}<span>${esc(c)}</span></li>`).join('')}</ul><div class="divider"></div><p class="xsmall muted">${tr('Quyền lợi', 'Benefits')}</p><ul class="plan__list">${t.benefits.map((c) => `<li>${icon('star')}<span>${esc(c)}</span></li>`).join('')}</ul></article>`,
          ).join('')}
        </div>
      </div>
    </section>
    <section class="section" id="dang-ky">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack">
            <span class="kicker">${tr('Bắt đầu', 'Start')}</span>
            <h2>${tr('Để lại thông tin, V-HUB gọi trước', 'Leave your details and we will call')}</h2>
            <p class="lede">${tr('Nếu bạn chưa muốn đăng ký trực tiếp trên ứng dụng KOCViet, để lại thông tin để đội định danh liên hệ hướng dẫn.', 'If you prefer not to register in the app yet, leave your details and our verification team will guide you.')}</p>
            <ul class="plan__list">
              <li>${icon('check')}<span>${tr('Hồ sơ cần: CCCD, ảnh chân dung, kênh đang vận hành.', 'Required: ID, portrait photo, current channels.')}</span></li>
              <li>${icon('check')}<span>${tr('Không thu phí định danh. Phí chỉ phát sinh khi booking hoặc thuê studio.', 'Verification is free. Fees apply only for bookings or studio rental.')}</span></li>
              <li>${icon('check')}<span>${tr('Học viên V-HUB được hỗ trợ hoàn thiện hồ sơ.', 'V-HUB students receive support completing the profile.')}</span></li>
            </ul>
          </div>
          <div class="card">
            <h3 style="font-size:1.125rem">${tr('Đăng ký định danh', 'Verification request')}</h3>
            ${leadFormMarkup({ id: 'verify-lead', presetAudience: 'nha-sang-tao', submitLabel: tr('Gửi đăng ký định danh', 'Submit request') })}
          </div>
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Đại sứ ---------- */
function ambassadorPage() {
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'KOCViet', href: '#/kocviet' }, { label: tr('Đại sứ KOCViet', 'KOCViet ambassadors') }])}
      <div class="stack" style="max-width:720px">
        <span class="kicker">${tr('Đại sứ', 'Ambassadors')}</span>
        <h1>${tr('Đại sứ KOCViet', 'KOCViet ambassadors')}</h1>
        <p class="lede">${tr('Đại sứ là nhà sáng tạo đã ký thoả thuận với V-HUB, đại diện cho chuẩn mực nội dung và tham gia các chương trình của hệ sinh thái.', 'Ambassadors sign an agreement with V-HUB, represent content standards and join ecosystem programmes.')}</p>
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="grid grid--2">
          ${AMBASSADORS.map(
            (a) => `<article class="card" style="padding:10px">
              ${media({ src: a.imageSrc, label: tr(`Chân dung AI minh họa: ${a.name}`, `AI portrait: ${a.name}`), ratio: '4x5', badge: `<span class="badge badge--demo">${tr('Ảnh AI minh họa', 'AI illustration')}</span>` })}
              <div style="padding:8px" class="stack stack--sm">
                <h2 style="font-size:1.25rem">${esc(a.name)}</h2>
                <p class="small muted">${esc(a.role)} · ${tr('từ', 'since')} ${esc(a.since)}</p>
                <p class="card__body">${esc(a.note)}</p>
              </div>
            </article>`,
          ).join('')}
        </div>
        <div class="grid grid--3 mt-5">
          ${[
            { title: tr('Quyền lợi', 'Benefits'), body: tr('Ưu tiên booking, hỗ trợ sản xuất nội dung, tham gia chương trình sóng VTV Nam Bộ.', 'Priority bookings, content production support and VTV Nam Bộ broadcasts.') },
            { title: tr('Trách nhiệm', 'Responsibilities'), body: tr('Tuân thủ quy định nội dung, tham gia tối thiểu 4 chương trình mỗi năm.', 'Follow content rules and join at least four programmes per year.') },
            { title: tr('Điều kiện ứng tuyển', 'Eligibility'), body: tr('Hạng Ngôi sao trở lên, tối thiểu 12 tháng hoạt động, không vi phạm quy định.', 'Star tier or above, at least 12 months active, no violations.') },
          ]
            .map((b) => `<article class="card"><h3 class="card__title">${esc(b.title)}</h3><p class="card__body">${esc(b.body)}</p></article>`)
            .join('')}
        </div>
        <div class="row mt-4"><a class="btn" href="#ung-tuyen">${tr('Ứng tuyển đại sứ', 'Apply to be an ambassador')}${icon('arrowRight', 'btn__icon')}</a></div>
      </div>
    </section>
    <section class="section section--alt" id="ung-tuyen">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack"><span class="kicker">${tr('Ứng tuyển', 'Apply')}</span><h2>${tr('Gửi hồ sơ ứng tuyển đại sứ', 'Submit your ambassador application')}</h2><p class="lede">${tr('Đội KOCViet sẽ liên hệ trong 5 ngày làm việc để trao đổi điều kiện cụ thể.', 'Our team will contact you within five working days to discuss terms.')}</p></div>
          <div class="card">${leadFormMarkup({ id: 'ambassador-lead', presetAudience: 'nha-sang-tao', submitLabel: tr('Gửi hồ sơ ứng tuyển', 'Submit application'), note: tr('Chúng tôi phản hồi trong 5 ngày làm việc.', 'We reply within five working days.') })}</div>
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Affiliate ---------- */
function affiliatePage() {
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'KOCViet', href: '#/kocviet' }, { label: 'Affiliate' }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">Affiliate</span>
          <h1>${tr('Hoa hồng công khai, đối soát tự động', 'Published commissions, automatic reconciliation')}</h1>
          <p class="lede">${tr('Nhận link affiliate theo nhóm hàng, hoa hồng công bố trước phiên và đối soát sau phiên. Không phí ẩn, không chậm thanh toán.', 'Get affiliate links by category with commissions published before the session and reconciled afterwards.')}</p>
          <div class="row" style="gap:10px"><a class="btn" href="${esc(ORG.kocvietAppUrl)}" target="_blank" rel="noopener">${tr('Nhận link trên KOCViet', 'Get links on KOCViet')}${icon('external', 'btn__icon')}</a><a class="btn btn--ghost" href="#/kocviet/tim-kiem">${tr('Xem nhà sáng tạo', 'Browse creators')}</a></div>
        </div>
        ${media({ pending: true, label: tr('Đang chờ ảnh: kho nội dung affiliate tại V-HUB', 'Image pending: V-HUB affiliate content library'), ratio: '4x3' })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Bảng hoa hồng', 'Commission table'), title: tr('Hoa hồng theo nhóm hàng', 'Commission by category'), sub: tr('Mức hoa hồng tham khảo, có thể thay đổi theo từng chiến dịch và được công bố trước khi nhận link.', 'Reference rates; campaigns may differ and are published before links are issued.') })}
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>${tr('Nhóm hàng', 'Category')}</th><th>${tr('Hoa hồng', 'Commission')}</th><th>${tr('Ghi chú', 'Note')}</th></tr></thead>
            <tbody>${AFFILIATE_GROUPS.map((g) => `<tr><td><strong>${esc(g.group)}</strong></td><td class="num">${esc(g.commission)}</td><td class="muted">${esc(g.note)}</td></tr>`).join('')}</tbody>
          </table>
        </div>
        <p class="small muted mt-3">${tr('Dữ liệu minh hoạ. Bảng hoa hồng chính thức sẽ đồng bộ từ KOCViet khi kết nối API.', 'Illustrative data. Official rates sync from KOCViet once connected.')}</p>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Cách hoạt động', 'How it works'), title: tr('Bốn bước nhận thu nhập', 'Four steps to earn') })}
        <div class="grid grid--4">
          ${[
            tr('Định danh KOCViet để mở khoá affiliate.', 'Get verified on KOCViet to unlock affiliate.'),
            tr('Chọn nhóm hàng và nhận link riêng.', 'Pick a category and get your own links.'),
            tr('Lên nội dung, gắn link, theo dõi đơn.', 'Create content, attach links, track orders.'),
            tr('Đối soát và nhận thanh toán theo kỳ.', 'Reconcile and get paid each cycle.'),
          ]
            .map((t, i) => `<article class="card"><span class="badge badge--primary">0${i + 1}</span><p class="card__body">${esc(t)}</p></article>`)
            .join('')}
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Entry ---------- */
export function render(ctx) {
  const slug = ctx.segments[1]
  let page = null
  if (!slug) page = { title: 'KOCViet — Nhà sáng tạo được định danh', description: 'Tìm nhà sáng tạo đã định danh, gửi yêu cầu booking, đăng ký định danh KOCViet, đại sứ và affiliate.', html: hubPage(), mount: mountHub }
  else if (slug === 'tim-kiem') page = { title: 'Tìm nhà sáng tạo — KOCViet', description: 'Lọc nhà sáng tạo theo ngành, khu vực, nền tảng, hạng và ngân sách.', html: searchPage(), mount: mountSearch }
  else if (slug === 'dinh-danh') page = { title: 'Trở thành KOC chính danh — KOCViet', description: 'Quy trình định danh, thang hạng và quyền lợi dành cho nhà sáng tạo KOCViet.', html: verifyPage() }
  else if (slug === 'dai-su') page = { title: 'Đại sứ KOCViet', description: 'Đại sứ KOCViet: quyền lợi, trách nhiệm và điều kiện ứng tuyển.', html: ambassadorPage() }
  else if (slug === 'affiliate') page = { title: 'Affiliate — KOCViet', description: 'Bảng hoa hồng affiliate theo nhóm hàng và quy trình nhận thu nhập.', html: affiliatePage() }
  else {
    const k = getKoc(slug)
    if (!k) return null
    page = {
      title: `${k.name} — Hồ sơ KOCViet`,
      description: `${k.name} · ${k.industry} · ${k.region} · ${k.tier}. Hồ sơ đã định danh KOCViet, ngân sách tham khảo và lịch sử phiên tại V-HUB.`,
      html: profilePage(k),
      mount(root) {
        root.querySelectorAll('[data-book-koc]').forEach((b) => b.addEventListener('click', () => openBookingModal(k)))
      },
    }
  }
  return page
}

function mountHub(root) {
  const tabs = root.querySelectorAll('[data-koc-tab]')
  const panels = root.querySelectorAll('[data-koc-panel]')
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active')
        t.setAttribute('aria-selected', 'false')
      })
      tab.classList.add('is-active')
      tab.setAttribute('aria-selected', 'true')
      panels.forEach((p) => {
        p.hidden = p.dataset.kocPanel !== tab.dataset.kocTab
      })
    })
  })
}

const TIER_ORDER = { 'Tân binh': 1, 'Chính danh': 2, 'Ngôi sao': 3, 'Nghệ sĩ': 4 }

function mountSearch(root) {
  const results = root.querySelector('#koc-results')
  const count = root.querySelector('#koc-count')
  const q = root.querySelector('#koc-q')
  const industry = root.querySelector('#koc-industry')
  const region = root.querySelector('#koc-region')
  const platform = root.querySelector('#koc-platform')
  const tier = root.querySelector('#koc-tier')
  const budget = root.querySelector('#koc-budget')
  const sort = root.querySelector('#koc-sort')

  const apply = () => {
    const text = (q.value || '').trim().toLowerCase()
    const budgetRule = KOC_FILTERS.budgets.find((b) => b.id === budget.value)
    let list = KOCS.filter((k) => {
      if (text && !`${k.name} ${k.industry} ${k.region}`.toLowerCase().includes(text)) return false
      if (industry.value && k.industry !== industry.value) return false
      if (region.value && k.region !== region.value) return false
      if (platform.value && !k.platforms.includes(platform.value)) return false
      if (tier.value && k.tier !== tier.value) return false
      if (budgetRule && !(k.budgetMin <= budgetRule.max && k.budgetMax >= budgetRule.min)) return false
      return true
    })
    if (sort.value === 'tier') list = list.sort((a, b) => TIER_ORDER[b.tier] - TIER_ORDER[a.tier])
    if (sort.value === 'price-asc') list = list.sort((a, b) => a.budgetMin - b.budgetMin)
    if (sort.value === 'price-desc') list = list.sort((a, b) => b.budgetMax - a.budgetMax)
    results.innerHTML = list.length
      ? list.map(kocCard).join('')
      : emptyState({
          title: tr('Không tìm thấy nhà sáng tạo phù hợp', 'No matching creators'),
          text: tr('Thử nới bộ lọc hoặc để V-HUB đề xuất theo ngành hàng của bạn.', 'Try widening the filters or ask V-HUB to shortlist for you.'),
          action: `<a class="btn btn--sm" href="#/lien-he">${tr('Nhờ V-HUB đề xuất', 'Ask V-HUB')}</a>`,
        })
    count.textContent = `${list.length} ${tr('nhà sáng tạo', 'creators')}`
  }
  ;[q, industry, region, platform, tier, budget, sort].forEach((node) => {
    node.addEventListener('input', apply)
    node.addEventListener('change', apply)
  })
  root.querySelector('#koc-reset').addEventListener('click', () => {
    ;[q, industry, region, platform, tier, budget].forEach((n) => {
      n.value = ''
    })
    sort.value = 'relevant'
    apply()
  })
  apply()
}
