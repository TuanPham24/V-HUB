/** Chợ Phiên Phương Nam: chương trình, trang tỉnh, minh bạch quỹ. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ORG } from '../lib/catalog-site.js'
import { MARKETS, MARKET_MESSAGE, MARKET_STEPS, FUND_POLICY, MARKET_PROVINCES, marketState } from '../lib/catalog-provinces.js'
import { getMarkets, getFund, getNextMarket } from '../lib/data.js'
import { formatCurrency, formatDate, formatDateTime, formatNumber } from '../lib/format.js'
import { media, sectionHead, iconTile, badgeDemo, badgeLive, breadcrumb, countdownMarkup, emptyState } from '../components/ui.js'
import { leadFormMarkup } from '../components/forms.js'

function stateLabel(state) {
  return state === 'live' ? tr('Đang phát', 'Live') : state === 'ended' ? tr('Đã diễn ra', 'Ended') : tr('Sắp diễn ra', 'Upcoming')
}

function marketCard(m) {
  const state = m.state || marketState(m)
  return `<article class="card card--link" style="padding:10px;gap:12px">
    ${media({ src: m.imageSrc, label: m.imageLabel, ratio: '16x9', badge: state === 'live' ? badgeLive() : `<span class="badge">${stateLabel(state)}</span>` })}
    <div style="padding:6px" class="stack stack--sm">
      <div class="row row--between"><h3 class="card__title">${esc(m.name)}</h3><span class="badge badge--primary">${tr('Mùa', 'Season')} ${m.season || 1}</span></div>
      <p class="small muted">${formatDateTime(m.heldAt)}</p>
      <p class="card__body">${esc(m.summary)}</p>
      ${m.season === 0 && m.revenue ? `<div class="case-card__metrics"><div><strong>${formatNumber(m.orders)}</strong><span>${tr('đơn hàng', 'orders')}</span></div><div><strong>${formatCurrency(m.donation + m.auction)}</strong><span>${tr('trích quỹ', 'to fund')}</span></div></div>` : ''}
      <a class="btn btn--ghost btn--sm" href="#/cho-phien/${esc(m.slug)}">${tr('Xem trang tỉnh', 'Province page')}${icon('arrowRight', 'btn__icon')}</a>
    </div>
  </article>`
}

/* ---------- Trang chương trình ---------- */
function programPage() {
  const market = getNextMarket()
  const state = marketState(market)
  const fund = getFund()
  const target = new Date(market.heldAt).getTime()
  const season1 = getMarkets().filter((m) => m.season === 1)
  const pilots = getMarkets().filter((m) => m.season === 0)
  return `<div class="page-hero page-hero--navy">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'Chợ Phiên Phương Nam' }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${tr('Chợ Phiên Phương Nam', 'Southern Market Days')}</span>
          <h1>${tr('Đặc sản của quê hương, trở về với quê hương', 'Specialties of the homeland, returning to the homeland')}</h1>
          <p class="lede">${esc(MARKET_MESSAGE)}</p>
          <div class="card card--navy" style="padding:14px 16px;gap:6px">
            <div class="row row--between"><span class="badge badge--on-dark">${tr('Phiên kế tiếp', 'Next session')}</span>${state === 'live' ? badgeLive() : `<span class="badge badge--on-dark">${stateLabel(state)}</span>`}</div>
            <strong style="font-family:var(--font-heading);font-size:1.125rem">${esc(market.name)} · ${formatDateTime(market.heldAt)}</strong>
            <span class="small" style="color:var(--on-secondary-muted)">${tr('Nghệ sĩ đại sứ', 'Ambassador')}: ${esc(market.ambassador)}</span>
          </div>
          ${state === 'live' ? `<a class="btn btn--on-dark" href="#/lich-live">${icon('live', 'btn__icon')}<span>${tr('Vào chợ phiên', 'Join the market')}</span></a>` : state === 'upcoming' ? countdownMarkup({ target, variant: 'countdown--compact' }) : `<span class="badge badge--on-dark">${tr('Mùa 1 đã khép lại', 'Season 1 completed')}</span>`}
          <div class="row" style="gap:10px">
            <a class="btn btn--on-dark" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('bell', 'btn__icon')}<span>${tr('Nhắc tôi', 'Remind me')}</span></a>
            <a class="btn btn--outline-light" href="#/cho-phien/minh-bach">${tr('Minh bạch quỹ', 'Fund transparency')}</a>
          </div>
        </div>
        ${media({ src: market.imageSrc, label: market.imageLabel, ratio: '4x3', dark: true, badge: badgeDemo() })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="fund-hero">
          <div class="stack">
            <span class="kicker">${tr('Quỹ thiện nguyện', 'Charity fund')}</span>
            <div class="fund-total" data-stat-value="${fund.total}" data-stat-display="${esc(formatNumber(fund.total))}đ">${formatNumber(fund.total)}đ</div>
            <p class="lede">${tr('đã trao cho quỹ thiện nguyện VTV Nam Bộ, cộng dồn từ kết quả từng phiên.', 'contributed to the VTV Nam Bộ charity fund, accumulated per session.')}</p>
            <div class="row" style="gap:10px"><a class="btn btn--ghost btn--sm" href="#/cho-phien/minh-bach">${tr('Xem bảng minh bạch', 'View transparency table')}${icon('arrowRight', 'btn__icon')}</a>${badgeDemo()}</div>
          </div>
          <div class="card card--accent" style="gap:8px">
            <strong style="font-family:var(--font-heading)">${tr('Trích 10% doanh thu mỗi phiên', '10% of every session')}</strong>
            <p class="card__body">${esc(FUND_POLICY.note)}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Sản phẩm', 'Products'), title: tr('Đặc sản trong phiên kế tiếp', 'Specialties in the next session'), sub: tr('Danh mục sản phẩm được chốt trước phiên 7 ngày và công bố trên trang tỉnh.', 'Product lists are locked seven days before each session and published on the province page.'), action: `<a class="btn btn--ghost btn--sm" href="#/cho-phien/${esc(market.slug)}">${tr('Trang tỉnh', 'Province page')}</a>` })}
        <div class="grid grid--3">
          ${(market.products || [])
            .map(
              (p) => `<article class="card"><span class="badge">${esc(p.note)}</span><h3 class="card__title">${esc(p.name)}</h3><p class="card__body">${esc(p.priceLabel)}</p><span class="xsmall muted">${tr('Giá tham khảo, công bố chính thức trong phiên.', 'Reference price; final price announced during the session.')}</span></article>`,
            )
            .join('') || emptyState({ title: tr('Danh mục đang được chốt', 'Products being finalised'), text: tr('Danh mục sản phẩm sẽ công bố trước phiên 7 ngày.', 'The product list is published seven days before the session.') })}
        </div>
      </div>
    </section>
    <section class="section" id="cac-tinh">
      <div class="container">
        ${sectionHead({ kicker: tr('Mùa 1', 'Season 1'), title: tr('Bốn tỉnh, bốn phiên, một thông điệp', 'Four provinces, four sessions, one message'), sub: tr('Lịch mùa 1 (dự kiến): Vĩnh Long 11/11/2026 · Cần Thơ 28/11/2026 · An Giang 12/12/2026 · Cà Mau 27/12/2026.', 'Season 1 (planned): Vinh Long 11 Nov 2026 · Can Tho 28 Nov 2026 · An Giang 12 Dec 2026 · Ca Mau 27 Dec 2026.') })}
        <div class="grid grid--4">${season1.map(marketCard).join('')}</div>
        <div class="divider"></div>
        <h3 style="font-size:1.125rem;margin-bottom:12px">${tr('Phiên thí điểm đã diễn ra', 'Completed pilot sessions')}</h3>
        <div class="grid grid--3">${pilots.map(marketCard).join('')}</div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack">
            <span class="kicker">${tr('Các tỉnh', 'Provinces')}</span>
            <h2>${tr('Bản đồ tham gia', 'Participation map')}</h2>
            <p class="lede">${tr('Tỉnh đã tham gia, đang triển khai và dự kiến trong các mùa tiếp theo.', 'Provinces that joined, are participating, or are planned for future seasons.')}</p>
            <div class="province-chips">
              ${MARKET_PROVINCES.map((p) => `<span class="province-chip province-chip--${p.status === 'season1' ? 'season1' : p.status === 'pilot' ? 'pilot' : 'planned'}">${esc(p.name)}${p.status === 'season1' ? ' · Mùa 1' : p.status === 'pilot' ? ' · Thí điểm' : ''}</span>`).join('')}
            </div>
            <p class="small muted">${tr('Danh sách dự kiến, có thể thay đổi theo kế hoạch phối hợp với địa phương.', 'Planned list, subject to coordination with local authorities.')}</p>
          </div>
          <div class="stack">
            <h2>${tr('Quy trình tham gia', 'How to join')}</h2>
            <div class="timeline">
              ${MARKET_STEPS.map((s) => `<div class="timeline__item"><span class="timeline__num">${s.step}</span><div class="timeline__body"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section cta-band" id="dang-ky-tinh">
      <div class="container">
        <div class="cta-band__inner">
          <div class="stack">
            <span class="kicker">${tr('Dành cho tỉnh', 'For provinces')}</span>
            <h2>${tr('Đăng ký tham gia mùa tiếp theo', 'Register for the next season')}</h2>
            <p class="lede">${tr('Để lại thông tin đầu mối, V-HUB gửi checklist hồ sơ và khung chương trình trong 48 giờ.', 'Leave a contact and we will send the document checklist and programme outline within 48 hours.')}</p>
            <div class="row" style="gap:10px"><a class="btn btn--ghost" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${esc(ORG.hotline)}</span></a><a class="btn btn--ghost" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>Zalo OA</span></a></div>
          </div>
          <div class="card" style="background:var(--surface)">${leadFormMarkup({ id: 'market-lead', presetAudience: 'dia-phuong', submitLabel: tr('Đăng ký tham gia', 'Register') })}</div>
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Trang tỉnh ---------- */
function provincePage(m) {
  const state = marketState(m)
  const related = getMarkets().filter((x) => x.slug !== m.slug).slice(0, 3)
  const isPast = state === 'ended'
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'Chợ Phiên Phương Nam', href: '#/cho-phien' }, { label: m.name }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <div class="row" style="gap:8px"><span class="badge badge--primary">${tr('Mùa', 'Season')} ${m.season || 1}</span><span class="badge">${stateLabel(state)}</span></div>
          <h1>${tr('Chợ Phiên', 'Market Days')} ${esc(m.name)}</h1>
          <p class="lede">${esc(m.summary)}</p>
          <div class="spec-list" style="max-width:520px">
            <div><span class="spec-label">${tr('Thời gian', 'Time')}</span><span class="spec-value">${formatDateTime(m.heldAt)}</span></div>
            <div><span class="spec-label">${tr('Nghệ sĩ đại sứ', 'Ambassador')}</span><span class="spec-value">${esc(m.ambassador)}</span></div>
            <div><span class="spec-label">${tr('Hình thức', 'Format')}</span><span class="spec-value">Megalive 3 ${tr('giờ', 'hours')} · ${tr('đa nền tảng', 'multi-platform')}</span></div>
          </div>
          ${state === 'upcoming' ? `<div style="width:100%;max-width:420px">${countdownMarkup({ target: new Date(m.heldAt).getTime(), variant: 'countdown--light countdown--compact' })}</div>` : ''}
          <div class="row" style="gap:10px">
            ${state === 'upcoming' ? `<a class="btn" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('bell', 'btn__icon')}<span>${tr('Nhắc tôi', 'Remind me')}</span></a>` : ''}
            <a class="btn btn--ghost" href="#/cho-phien/minh-bach">${tr('Minh bạch quỹ', 'Fund transparency')}</a>
          </div>
        </div>
        ${media({ src: m.imageSrc, label: m.imageLabel, ratio: '4x3', badge: badgeDemo() })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div class="stack">
            <h2>${tr('Phim ngắn về vùng đất', 'Short film about the region')}</h2>
            ${media({ label: tr('Video thật: phim ngắn giới thiệu vùng đất (đang chờ tư liệu)', 'Real video: regional short film (assets pending)'), ratio: '16x9' })}
            <p class="small muted">${tr('Phim ngắn 90 giây được sản xuất trước phiên và phát trên các nền tảng của V-HUB.', 'A 90-second film produced before the session and published on V-HUB platforms.')}</p>
          </div>
          <div class="stack">
            <h2>${tr('Kết quả phiên', 'Session results')}</h2>
            ${isPast
              ? `<div class="card" style="gap:12px">
                  <div class="case-card__metrics"><div><strong>${formatNumber(m.orders)}</strong><span>${tr('đơn hàng', 'orders')}</span></div><div><strong>${formatCurrency(m.revenue)}</strong><span>${tr('doanh thu thực thu', 'net revenue')}</span></div></div>
                  <div class="case-card__metrics"><div><strong>${formatCurrency(m.donation)}</strong><span>${tr('trích 10% vào quỹ', '10% to fund')}</span></div><div><strong>${formatCurrency(m.auction)}</strong><span>${tr('đấu giá', 'auction')}</span></div></div>
                  <div class="spec-list"><div><span class="spec-label">${tr('Ngày chuyển quỹ', 'Fund transfer date')}</span><span class="spec-value">${m.transferredAt ? formatDate(m.transferredAt) : tr('Đang cập nhật', 'Pending')}</span></div></div>
                  <div class="row" style="gap:10px">${m.statementUrl ? `<a class="btn btn--ghost btn--sm" href="${esc(m.statementUrl)}" target="_blank" rel="noopener">${tr('Sao kê', 'Statement')}</a>` : `<span class="badge badge--warning">${tr('Sao kê đang được công bố', 'Statement pending')}</span>`}${m.minutesUrl ? `<a class="btn btn--ghost btn--sm" href="${esc(m.minutesUrl)}" target="_blank" rel="noopener">${tr('Biên bản trao tặng', 'Handover minutes')}</a>` : ''}</div>
                </div>`
              : `<div class="empty-state"><strong>${tr('Phiên chưa diễn ra', 'Session not held yet')}</strong><p>${tr('Kết quả doanh thu và trích quỹ được công bố trong 7 ngày làm việc sau phiên.', 'Revenue and fund results are published within seven working days after the session.')}</p></div>`}
            <h2 style="margin-top:12px">${tr('Danh mục sản phẩm', 'Product list')}</h2>
            ${(m.products || []).length
              ? `<div class="stack" style="gap:8px">${m.products.map((p) => `<div class="card" style="flex-direction:row;justify-content:space-between;align-items:center;gap:10px;padding:12px"><div><strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(p.name)}</strong><div class="xsmall muted">${esc(p.note)}</div></div><span class="badge badge--primary">${esc(p.priceLabel)}</span></div>`).join('')}</div>`
              : emptyState({ title: tr('Danh mục đang được chốt', 'Products being finalised'), text: tr('Danh mục sẽ công bố trước phiên 7 ngày.', 'The list is published seven days before the session.') })}
          </div>
        </div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Album', 'Album'), title: tr('Hình ảnh trao tặng và hậu trường', 'Handover and behind-the-scenes photos'), sub: tr('Ảnh thật sẽ được cập nhật sau mỗi phiên. Khung dưới đây giữ đúng tỉ lệ hiển thị.', 'Real photos are added after each session. Frames below keep the intended aspect ratio.') })}
        <div class="grid grid--3">
          ${[1, 2, 3].map((i) => media({ label: `Ảnh thật: ${m.name} — album ${i}`, ratio: '4x3' })).join('')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Liên quan', 'Related'), title: tr('Các phiên khác', 'Other sessions') })}
        <div class="grid grid--3">${related.map(marketCard).join('')}</div>
      </div>
    </section>
  </main>`
}

/* ---------- Minh bạch quỹ ---------- */
function transparencyPage() {
  const fund = getFund()
  const rows = fund.rows
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'Chợ Phiên Phương Nam', href: '#/cho-phien' }, { label: tr('Minh bạch quỹ', 'Fund transparency') }])}
      <div class="stack" style="max-width:760px">
        <span class="kicker">${tr('Minh bạch quỹ', 'Fund transparency')}</span>
        <h1>${tr('Mỗi đơn hàng góp một phần yêu thương', 'Every order contributes')}</h1>
        <p class="lede">${tr('Quỹ thiện nguyện VTV Nam Bộ nhận 10% doanh thu thực thu của mỗi phiên Chợ Phiên, cộng với khoản đấu giá (nếu có). Toàn bộ được công bố theo từng phiên.', 'The VTV Nam Bộ charity fund receives 10% of net revenue from every Market Day session, plus auction proceeds where applicable.')}</p>
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="fund-hero">
          <div class="stack">
            <span class="kicker">${tr('Tổng cộng dồn', 'Accumulated total')}</span>
            <div class="fund-total" data-stat-value="${fund.total}" data-stat-display="${esc(formatNumber(fund.total))}đ">${formatNumber(fund.total)}đ</div>
            <p class="small muted">${tr('Tổng số tiền đã ghi nhận vào quỹ từ các phiên đã kết thúc.', 'Total recorded from completed sessions.')}</p>
            <div class="row" style="gap:10px">${badgeDemo(tr('Số liệu minh hoạ', 'Illustrative figures'))}</div>
          </div>
          <div class="grid grid--2" style="gap:12px">
            <div class="card"><span class="small muted">${tr('Trích 10% doanh thu', '10% of revenue')}</span><strong style="font-family:var(--font-heading);font-size:1.375rem;color:var(--primary-deep)">${formatCurrency(fund.donation)}</strong></div>
            <div class="card"><span class="small muted">${tr('Đấu giá', 'Auction')}</span><strong style="font-family:var(--font-heading);font-size:1.375rem;color:var(--primary-deep)">${formatCurrency(fund.auction)}</strong></div>
            <div class="card"><span class="small muted">${tr('Số phiên đã kết thúc', 'Completed sessions')}</span><strong style="font-family:var(--font-heading);font-size:1.375rem;color:var(--secondary)">${rows.length}</strong></div>
            <div class="card"><span class="small muted">${tr('Quy định trích', 'Contribution rate')}</span><strong style="font-family:var(--font-heading);font-size:1.375rem;color:var(--secondary)">10%</strong></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container">
        ${sectionHead({ kicker: tr('Bảng minh bạch', 'Transparency table'), title: tr('Từng phiên, từng khoản', 'Session by session'), sub: tr('Sao kê và biên bản trao tặng được cập nhật khi đơn vị vận hành công bố. Ô “Đang cập nhật” nghĩa là tài liệu chưa được phát hành.', 'Statements and handover minutes are added when published. “Pending” means the document has not been released.') })}
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>${tr('Tỉnh', 'Province')}</th><th>${tr('Ngày', 'Date')}</th><th>${tr('Doanh thu thực thu', 'Net revenue')}</th><th>${tr('10% trích quỹ', '10% to fund')}</th><th>${tr('Đấu giá', 'Auction')}</th><th>${tr('Ngày chuyển', 'Transfer date')}</th><th>${tr('Sao kê', 'Statement')}</th><th>${tr('Biên bản', 'Minutes')}</th></tr></thead>
            <tbody>
              ${rows
                .map(
                  (r) => `<tr>
                    <td><a href="#/cho-phien/${esc(MARKETS.find((m) => m.id === r.id)?.slug || '')}"><strong>${esc(r.name)}</strong></a></td>
                    <td>${formatDate(r.heldAt)}</td>
                    <td class="num">${formatCurrency(r.revenue)}</td>
                    <td class="num" style="color:var(--primary-deep)">${formatCurrency(r.donation)}</td>
                    <td class="num">${formatCurrency(r.auction)}</td>
                    <td>${r.transferredAt ? formatDate(r.transferredAt) : tr('Đang cập nhật', 'Pending')}</td>
                    <td>${r.statementUrl ? `<a class="link-chip" href="${esc(r.statementUrl)}" target="_blank" rel="noopener">${tr('Xem', 'View')}${icon('external')}</a>` : `<span class="xsmall muted">${tr('Đang cập nhật', 'Pending')}</span>`}</td>
                    <td>${r.minutesUrl ? `<a class="link-chip" href="${esc(r.minutesUrl)}" target="_blank" rel="noopener">${tr('Xem', 'View')}${icon('external')}</a>` : `<span class="xsmall muted">${tr('Đang cập nhật', 'Pending')}</span>`}</td>
                  </tr>`,
                )
                .join('') || `<tr><td colspan="8" class="muted">${tr('Chưa có phiên nào được ghi nhận.', 'No sessions recorded yet.')}</td></tr>`}
            </tbody>
            <tfoot><tr><th colspan="3">${tr('Tổng cộng', 'Total')}</th><th class="num">${formatCurrency(fund.donation)}</th><th class="num">${formatCurrency(fund.auction)}</th><th colspan="3">${formatCurrency(fund.total)}</th></tr></tfoot>
          </table>
        </div>
        <div class="card card--accent mt-4">
          <div class="row" style="gap:10px">${iconTile('shield')}<h3 class="card__title">${tr('Nguyên tắc công bố', 'Disclosure principles')}</h3></div>
          <p class="card__body">${esc(FUND_POLICY.updatedNote)}</p>
          <ul class="plan__list">
            <li>${icon('check')}<span>${tr('Chỉ công bố doanh thu thực thu sau khi trừ hoàn hàng và huỷ đơn.', 'Only net revenue after returns and cancellations is reported.')}</span></li>
            <li>${icon('check')}<span>${tr('Sao kê ngân hàng và biên bản trao tặng được đăng cùng ngày công bố.', 'Bank statements and handover minutes are published together.')}</span></li>
            <li>${icon('check')}<span>${tr('Mọi điều chỉnh sau công bố đều được ghi chú thời điểm và lý do.', 'Any post-publication adjustment notes the date and reason.')}</span></li>
          </ul>
        </div>
      </div>
    </section>
  </main>`
}

export function render(ctx) {
  const slug = ctx.segments[1]
  if (!slug) {
    return {
      title: 'Chợ Phiên Phương Nam — V-HUB | Đặc sản của quê hương, trở về với quê hương',
      description: 'Chợ Phiên Phương Nam: đưa đặc sản các tỉnh lên sóng cùng VTV Nam Bộ, trích 10% doanh thu vào quỹ thiện nguyện, minh bạch theo từng phiên.',
      html: programPage(),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Chợ Phiên Phương Nam — Mùa 1',
        startDate: MARKETS.filter((m) => m.season === 1)[0].heldAt,
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'VirtualLocation', url: 'https://vhub.vn/#/cho-phien' },
        organizer: { '@type': 'Organization', name: 'V-HUB' },
        description: MARKET_MESSAGE,
      },
    }
  }
  if (slug === 'minh-bach') {
    return {
      title: 'Minh bạch quỹ thiện nguyện — Chợ Phiên Phương Nam',
      description: 'Bảng minh bạch quỹ thiện nguyện VTV Nam Bộ: doanh thu thực thu, 10% trích quỹ, đấu giá, ngày chuyển, sao kê và biên bản trao tặng.',
      html: transparencyPage(),
    }
  }
  const market = MARKETS.find((m) => m.slug === slug)
  if (!market) return null
  const merged = getMarkets().find((m) => m.slug === slug) || market
  return {
    title: `Chợ Phiên ${market.name} — Chợ Phiên Phương Nam`,
    description: `${market.summary} Thời gian: ${formatDateTime(market.heldAt)}. Trích 10% doanh thu vào quỹ thiện nguyện VTV Nam Bộ.`,
    html: provincePage(merged),
  }
}
