/** Trang chủ — 13 khối nội dung (mobile gộp còn ~10 khối). */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ORG, AUDIENCES, REASONS, WHEEL, PROCESS } from '../lib/catalog-site.js'
import { CASES } from '../lib/catalog-cases.js'
import { COURSES, courseSlug } from '../lib/catalog-academy.js'
import { STUDIOS } from '../lib/catalog-studios.js'
import { KOCS, formatFollowers } from '../lib/catalog-koc.js'
import { weekDays, liveState, liveEndsAt } from '../lib/catalog-schedule.js'
import { marketState } from '../lib/catalog-provinces.js'
import { formatDate, formatDateTime, formatNumber, formatTime, weekdayShort } from '../lib/format.js'
import { getLives, getCurrentLive, getNextMarket, getFund, getStats, getMarkets } from '../lib/data.js'
import {
  media,
  badgeLive,
  badgeVerified,
  badgeDemo,
  linkArrow,
  sectionHead,
  iconTile,
  liveCard,
  countdownMarkup,
  statMarkup,
  emptyState,
} from '../components/ui.js'
import { leadFormMarkup } from '../components/forms.js'

/* 1. Hero */
function heroSection() {
  return `<section class="commerce-hero" aria-labelledby="home-title">
    <div class="commerce-hero__image"><img src="/images/home/creator-studio.png" alt="Minh họa nhà sáng tạo giới thiệu sản phẩm trong studio livestream" fetchpriority="high" decoding="async" /><span class="commerce-hero__image-note">${tr('Ảnh minh họa', 'Illustration')}</span></div>
    <div class="container commerce-hero__inner">
      <div class="commerce-hero__copy">
        <span class="commerce-hero__eyebrow">${tr('MCN thương mại điện tử · V-HUB', 'E-commerce MCN · V-HUB')}</span>
        <h1 id="home-title">${tr('MCN thương mại điện tử', 'E-commerce MCN')}<em>${tr('Kiến tạo giá trị thật', 'Creating real value')}</em>${tr('cùng nhà sáng tạo', 'with creators')}</h1>
        <p>${tr('Đồng hành cùng nhà sáng tạo, thương hiệu và doanh nghiệp bứt phá doanh số với livestream, social commerce và giải pháp tăng trưởng toàn diện.', 'Helping creators, brands and businesses grow through livestream, social commerce and comprehensive growth solutions.')}</p>
        <div class="commerce-hero__actions">
          <a class="btn commerce-button" href="#/lien-he">${tr('Hợp tác cùng V-HUB', 'Partner with V-HUB')}${icon('arrowRight', 'btn__icon')}</a>
          <a class="btn commerce-button commerce-button--outline" href="#/giai-phap">${tr('Tìm hiểu dịch vụ', 'Explore services')}</a>
        </div>
        <div class="commerce-hero__facts">
          <div><strong>14</strong><span>${tr('Studio theo biên bản ghi nhớ', 'Studios in the MOU')}</span></div>
          <div><strong>4</strong><span>${tr('Khóa học tại trường quay', 'On-set courses')}</span></div>
          <div><strong>10%</strong><span>${tr('Doanh thu Chợ Phiên trích quỹ', 'Market revenue to charity')}</span></div>
        </div>
      </div>
    </div>
  </section>`
}

/* 2. Các dịch vụ chính */
function doorsSection() {
  const services = [
    { icon: 'camera', title: tr('Livestream bán hàng', 'Livestream commerce'), body: tr('Sản xuất, vận hành và tối ưu livestream đa nền tảng, giúp thương hiệu bứt phá doanh số.', 'Produce, operate and optimise multi-platform livestreams to grow your brand.'), href: '#/giai-phap/brand-live-house' },
    { icon: 'users', title: tr('Mạng lưới nhà sáng tạo', 'Creator network'), body: tr('Kết nối và phát triển cộng đồng creator đa lĩnh vực, từ nhà sáng tạo mới đến chuyên nghiệp.', 'Connect and develop creators across categories, from emerging talent to professionals.'), href: '#/kocviet' },
    { icon: 'shopee', title: 'Social Commerce', body: tr('Xây dựng kênh bán hàng trên TikTok, Shopee, Facebook và nhiều nền tảng khác.', 'Build commerce channels on TikTok, Shopee, Facebook and beyond.'), href: '#/giai-phap/van-hanh-tmdt-da-tuyen' },
    { icon: 'signal', title: tr('Giải pháp tăng trưởng', 'Growth solutions'), body: tr('Chiến lược toàn diện về nội dung, vận hành và dữ liệu, đồng hành cùng thương hiệu tăng trưởng bền vững.', 'Comprehensive content, operations and data strategies for sustainable brand growth.'), href: '#/giai-phap' },
  ]
  return `<section class="commerce-services" aria-label="${tr('Dịch vụ V-HUB', 'V-HUB services')}"><div class="container commerce-services__grid">${services.map(s => `<a class="commerce-service" href="${s.href}"><div class="commerce-service__heading">${icon(s.icon)}<div><h2>${esc(s.title)}</h2><span class="tricolor tricolor--sm" aria-hidden="true"><span></span><span></span><span></span></span></div></div><p>${esc(s.body)}</p><span class="commerce-service__arrow">${icon('arrowRight')}</span></a>`).join('')}</div></section>`
}

/* 3. Bảo chứng + 6 lý do */
function reasonsSection() {
  const cards = REASONS.map(
    (r, i) => `<article class="card reveal">
      ${iconTile(r.icon)}
      <h3 class="card__title">${esc(tr(r.title, ['State-backed credibility', 'Creators verified before going live', 'Broadcast-grade infrastructure', 'One accountable partner', 'Amplified media reach', 'Commerce with purpose'][i]))}</h3>
      <p class="card__body">${esc(tr(r.body, [
        'Part of the VTV Nam Bộ ecosystem, operating under the network’s content and commerce standards.',
        'ID verification, live-session history and compliance commitments are checked before a creator appears in a brand session.',
        'Multi-cam, LED and audio with a broadcast engineering team, all at one address in central Ho Chi Minh City.',
        'From training and verification to content and commerce operations — one contract, one accountable partner.',
        'Content travels across broadcast, digital platforms and events within the VTV Nam Bộ ecosystem.',
        'Southern Market Days contributes 10% of revenue to the VTV Nam Bộ charity fund, with published statements.',
      ]))}</p>
    </article>`,
  ).join('')
  return `<section class="section">
    <div class="container">
      <div class="trust-strip" aria-label="${tr('Đối tác và bảo chứng', 'Partners and endorsements')}">
        <span class="partner-logo"><img src="/images/brand/vtv-logo.png" alt="VTV" width="1222" height="504" loading="lazy" /></span>
        <span class="partner-logo partner-logo--wide"><img src="/images/brand/netviettv-logo.png" alt="NetVietTV" loading="lazy" /></span>
        <span class="partner-logo"><img src="/images/brand/hoa-binh-film-logo.png" alt="Hòa Bình Film" width="2048" height="2048" loading="lazy" /></span>
        <span class="small muted">${tr('Bảo chứng nhà đài · Nhà sáng tạo định danh · Hạ tầng chuẩn truyền hình', 'Broadcaster-backed · Verified creators · Broadcast-grade infrastructure')}</span>
      </div>
      ${sectionHead({
        kicker: tr('Vì sao chọn V-HUB', 'Why V-HUB'),
        title: tr('Sáu lý do để một thương hiệu chọn lên sóng cùng V-HUB', 'Six reasons brands go on air with V-HUB'),
        sub: tr('Chúng tôi không bán một phiên live đơn lẻ. Chúng tôi nhận trách nhiệm từ người lên sóng đến con số cuối cùng.', 'We do not sell a single livestream. We take responsibility from who goes on air to the final number.'),
      })}
      <div class="hscroll">${cards}</div>
    </div>
  </section>`
}

/* 4. Số liệu */
function statsSection() {
  const { items, updatedAt } = getStats()
  return `<section class="section section--tight section--navy">
    <div class="container">
      <div class="row row--between" style="margin-bottom:var(--sp-4)">
        <h2 style="font-size:var(--fs-h3)">${tr('V-HUB đang vận hành', 'V-HUB in operation')}</h2>
        ${badgeDemo()}
      </div>
      <div class="stats-band">
        ${items
          .map((s) =>
            statMarkup({
              value: s.value,
              label: tr(s.label, s.key === 'studios' ? 'studios in operation' : s.key === 'live_hours' ? 'livestream hours broadcast' : s.key === 'koc_verified' ? 'creators verified' : 'VND contributed through the charity fund'),
              display: s.key === 'fund' ? `${formatNumber(s.value)}đ` : '',
            }),
          )
          .join('')}
      </div>
      <p class="stats-updated">${icon('clock')} ${tr('Cập nhật ngày', 'Updated')} ${formatDate(updatedAt)} · ${tr('Số liệu minh hoạ, thay bằng dữ liệu vận hành thật.', 'Illustrative figures — replace with real operational data.')}</p>
    </div>
  </section>`
}

/* 5. Vòng quay */
function wheelSection() {
  const nodes = WHEEL.map((w, i) => {
    const angle = -90 + i * 60
    return `<button class="wheel__node ${i === 2 ? 'wheel__node--primary' : ''}" type="button" data-wheel="${i}" style="--angle:${angle}deg" aria-label="Bước ${w.step}: ${esc(w.title)}">
      <span class="wheel__step">0${w.step}</span>
      <span class="wheel__label">${esc(w.title)}</span>
    </button>`
  }).join('')
  const mobile = WHEEL.map(
    (w) => `<div class="timeline__item">
      <span class="timeline__num">${w.step}</span>
      <div class="timeline__body"><h3>${esc(w.title)}</h3><p>${esc(w.body)}</p><a class="link-chip" href="${esc(w.href)}">${tr('Xem chi tiết', 'Learn more')} ${icon('arrowRight', 'btn__icon')}</a></div>
    </div>`,
  ).join('')
  return `<section class="section">
    <div class="container">
      ${sectionHead({
        kicker: tr('Hệ sinh thái', 'Ecosystem'),
        title: tr('Một hệ sinh thái, không chỉ một phòng live', 'An ecosystem, not just a live room'),
        sub: tr('Sáu bước khép kín: người mới được đào tạo, được định danh, lên sóng, có nội dung, có kênh và trở thành người dẫn dắt thế hệ tiếp theo.', 'Six connected steps: newcomers are trained, verified, go on air, build content, gain channels and become mentors.'),
      })}
      <div class="wheel-layout">
        <div class="wheel" aria-hidden="true">
          ${nodes}
          <div class="wheel__center"><span class="pixels" aria-hidden="true"><span></span><span></span><span></span></span><strong>${tr('Bảo chứng VTV Nam Bộ · Studio V-HUB', 'VTV Nam Bộ backing · V-HUB Studio')}</strong></div>
        </div>
        <div class="wheel-panel" id="wheel-panel" aria-live="polite">
          <span class="wheel-panel__step">${tr('Bước', 'Step')} 01</span>
          <h3>${esc(WHEEL[0].title)}</h3>
          <p>${esc(WHEEL[0].body)}</p>
          <a class="btn btn--link" href="${esc(WHEEL[0].href)}">${tr('Xem chi tiết', 'Learn more')}${icon('arrowRight', 'btn__icon btn__arrow')}</a>
        </div>
        <div class="wheel-mobile timeline">${mobile}</div>
      </div>
    </div>
  </section>`
}

/* 6. Studio */
function studioSection() {
  const thumbs = STUDIOS.slice(0, 4)
    .map(
      (s, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}" data-studio-thumb="${esc(s.slug)}" aria-label="Xem ${esc(s.name)}">
        ${media({ label: s.name, ratio: '4x3' })}
      </button>`,
    )
    .join('')
  return `<section class="section section--alt">
    <div class="container">
      <div class="split split--7-5">
        <div>
          <div class="viewer-360" id="home-360">
            <div class="viewer-360__stage" data-360-stage>
              ${media({ label: tr('Ảnh toàn cảnh 360°: Super-Megalive Studio', '360° panorama: Super-Megalive Studio'), ratio: '16x10' })}
              <a class="viewer-360__btn" href="#/studio#tham-quan-360">${icon('rotate')}${tr('Xem 360°', 'View 360°')}</a>
              <span class="viewer-360__hint">${tr('Ảnh thật sẽ được thay khi có file toàn cảnh', 'Real panorama pending')}</span>
            </div>
          </div>
          <div class="thumb-row">${thumbs}</div>
        </div>
        <div class="stack">
          <span class="kicker">${tr('Hạ tầng', 'Infrastructure')}</span>
          <h2>${tr('Studio chuẩn truyền hình giữa trung tâm TP.HCM', 'Broadcast-grade studios in central Ho Chi Minh City')}</h2>
          <p class="lede">${tr('Cụm 14 studio theo biên bản ghi nhớ, gồm 13 studio tiêu chuẩn và 1 Super-Megalive. Website hiển thị số studio đang vận hành từ dữ liệu.', 'A 14-studio cluster per the MOU: 13 standard studios and one Super-Megalive. The number shown comes from operational data.')}</p>
          <div class="spec-row">
            <div><strong>14</strong><span>${tr('studio theo biên bản ghi nhớ', 'studios in the MOU')}</span></div>
            <div><strong>6</strong><span>${tr('camera tại Super-Megalive', 'cameras at Super-Megalive')}</span></div>
            <div><strong>220m²</strong><span>${tr('sân khấu lớn nhất', 'largest stage')}</span></div>
          </div>
          <div class="row" style="gap:10px">
            <a class="btn" href="#/studio">${tr('Xem studio & bảng giá', 'Studios & rates')}${icon('arrowRight', 'btn__icon')}</a>
            <a class="btn btn--ghost" href="#/studio#tham-quan-360">${tr('Đặt lịch tham quan', 'Book a tour')}</a>
          </div>
          <p class="small muted">${tr('Thiết bị, diện tích và giá tham khảo cho từng studio có trong trang chi tiết.', 'Equipment, area and reference rates for each studio are on the detail page.')}</p>
        </div>
      </div>
    </div>
  </section>`
}

/* 7. Lịch live tuần này */
function liveSection() {
  const lives = getLives()
  const days = weekDays(lives)
  const todayKey = days[0].key
  const dayTabs = days
    .map(
      (d, i) => `<button class="day-tab" type="button" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" data-day="${d.key}">
        <span class="day-tab__dow">${weekdayShort(d.dayStart)}</span>
        <span class="day-tab__date">${String(d.date.day).padStart(2, '0')}/${String(d.date.month).padStart(2, '0')}</span>
      </button>`,
    )
    .join('')
  const firstDay = days[0]
  const cards = firstDay.items.length
    ? firstDay.items.map(liveCard).join('')
    : emptyState({
        title: tr('Ngày này chưa có phiên live', 'No sessions on this day'),
        text: tr('Lịch live đang được cập nhật. Đăng ký nhận lịch qua Zalo để không bỏ lỡ.', 'The schedule is being updated. Get reminders on Zalo.'),
        action: `<a class="btn btn--sm" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>${tr('Nhận lịch qua Zalo', 'Get schedule on Zalo')}</span></a>`,
      })
  return `<section class="section" id="lich-live-tuan">
    <div class="container">
      ${sectionHead({
        kicker: tr('Đang lên sóng', 'On air'),
        title: tr('Lịch live tuần này', 'This week’s live schedule'),
        sub: tr('Daily Live giữ nhịp mỗi ngày, Megalive cho chiến dịch. Huy hiệu LIVE chỉ xuất hiện khi có phiên thật đang phát.', 'Daily Live keeps the rhythm, Megalive powers campaigns. The LIVE badge only appears while a session is on air.'),
        action: linkArrow(tr('Xem toàn bộ lịch live', 'Full schedule'), '#/lich-live'),
      })}
      <div class="day-tabs" role="tablist" aria-label="${tr('Chọn ngày', 'Pick a day')}" style="margin-bottom:var(--sp-4)">${dayTabs}</div>
      <div class="live-strip" id="home-live-strip" data-day="${todayKey}">${cards}</div>
      <p class="small muted mt-3">${tr('Giờ hiển thị theo múi giờ Việt Nam (UTC+7).', 'Times shown in Vietnam time (UTC+7).')}</p>
    </div>
  </section>`
}

/* 8. Chợ Phiên */
function marketSection() {
  const market = getNextMarket()
  const fund = getFund()
  const target = new Date(market.heldAt).getTime()
  const state = marketState(market)
  return `<section class="section section--navy market-section">
    <div class="container">
      <div class="market-grid">
        <div class="stack" style="gap:var(--sp-3)">
          <span class="kicker">${tr('Chợ Phiên Phương Nam', 'Southern Market Days')}</span>
          <h2 style="font-size:var(--fs-h1);max-width:16ch">${tr('Đặc sản của quê hương, trở về với quê hương', 'Specialties of the homeland, returning to the homeland')}</h2>
          <p class="lede">${esc(tr('Mỗi đơn hàng góp một phần yêu thương — đặc sản của quê hương, trở về với quê hương.', 'Every order contributes — local specialties returning to the homeland.'))}</p>
          <div class="card card--navy" style="padding:14px 16px;gap:6px">
            <div class="row row--between">
              <span class="badge badge--on-dark">${tr('Phiên kế tiếp', 'Next session')} · ${tr('Mùa', 'Season')} 1</span>
              ${state === 'live' ? badgeLive() : `<span class="badge badge--on-dark">${tr('Sắp diễn ra', 'Upcoming')}</span>`}
            </div>
            <strong style="font-family:var(--font-heading);font-size:1.125rem">${esc(market.name)} · ${formatDateTime(market.heldAt)}</strong>
            <span class="small" style="color:var(--on-secondary-muted)">${esc(market.summary)}</span>
          </div>
          ${state === 'live' ? `<a class="btn btn--on-dark" href="#/cho-phien">${icon('live', 'btn__icon')}<span>${tr('Vào chợ phiên', 'Join the market')}</span></a>` : state === 'upcoming' ? countdownMarkup({ target, variant: 'countdown--compact' }) : `<span class="badge badge--on-dark">${tr('Mùa 1 đã khép lại', 'Season 1 completed')}</span>`}
          <div class="fund-counter">
            <span class="fund-counter__value" data-stat-value="${fund.total}" data-stat-display="${esc(formatNumber(fund.total))}đ"></span>
            <span class="fund-counter__label">${tr('đã trao cho quỹ thiện nguyện VTV Nam Bộ · trích 10% doanh thu mỗi phiên', 'contributed to the VTV Nam Bộ charity fund · 10% of each session')} · <a href="#/cho-phien/minh-bach" style="color:var(--primary-on-dark);text-decoration:underline">${tr('Xem sao kê', 'View statements')}</a></span>
          </div>
          <div class="row" style="gap:10px">
            <a class="btn btn--on-dark" href="#/cho-phien">${tr('Xem chương trình', 'Explore the programme')}${icon('arrowRight', 'btn__icon')}</a>
            <a class="btn btn--outline-light" href="#/cho-phien#cac-tinh">${tr('Các tỉnh tham gia', 'Participating provinces')}</a>
          </div>
        </div>
        <div>
          ${media({ label: `Ảnh thật: ${market.name} — ${market.imageLabel.replace('Ảnh thật: ', '')}`, ratio: '4x3', dark: true, badge: badgeDemo() })}
          <div class="grid grid--3 mt-3" style="gap:10px">
            ${getMarkets()
              .filter((m) => m.season === 1)
              .slice(0, 3)
              .map(
                (m) => `<div class="card card--navy" style="padding:12px;gap:2px">
                  <strong style="font-family:var(--font-heading);font-size:.875rem">${esc(m.name)}</strong>
                  <span class="xsmall" style="color:var(--on-secondary-muted)">${formatDate(m.heldAt)}</span>
                </div>`,
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  </section>`
}

/* 9. KOCViet */
function kocSection() {
  const cards = KOCS.slice(0, 3)
    .map(
      (k) => `<article class="koc-card">
        <div class="koc-card__avatar">
          <span class="koc-initials" aria-hidden="true">${esc(k.name.split(' ').map((p) => p[0]).join('').slice(0, 2))}</span>
          <span class="koc-verified">${badgeVerified()}</span>
        </div>
        <div class="koc-card__body">
          <h3 class="koc-card__name">${esc(k.name)}</h3>
          <div class="koc-card__meta"><span>${esc(k.industry)}</span><span>${esc(k.region)}</span></div>
          <div class="koc-card__stats">
            <div><strong>${formatFollowers(k.followers)}</strong>${tr('người theo dõi', 'followers')}</div>
            <div><strong>${k.liveSessions}</strong>${tr('phiên tại V-HUB', 'V-HUB sessions')}</div>
            <div><strong>${k.tier}</strong>${tr('hạng', 'tier')}</div>
          </div>
          <a class="btn btn--ghost btn--sm" href="#/kocviet/${esc(k.slug)}">${tr('Xem hồ sơ', 'View profile')}</a>
        </div>
      </article>`,
    )
    .join('')
  return `<section class="section">
    <div class="container">
      ${sectionHead({
        kicker: 'KOCViet',
        title: tr('Nhà sáng tạo đã định danh, sẵn sàng cho phiên của bạn', 'Verified creators, ready for your session'),
        sub: tr('Hồ sơ có huy hiệu định danh, lịch sử phiên live tại V-HUB và mức ngân sách tham khảo. Nhãn hàng booking qua hợp đồng số và ký quỹ.', 'Profiles carry a verification badge, V-HUB session history and reference budgets. Brands book via digital contracts and escrow.'),
        action: linkArrow(tr('Tìm nhà sáng tạo', 'Find creators'), '#/kocviet/tim-kiem'),
      })}
      <div class="grid grid--3">${cards}</div>
      <div class="grid grid--2 mt-4" style="gap:var(--sp-3)">
        <div class="card card--accent">
          <div class="row" style="gap:10px">${iconTile('creator')}<h3 class="card__title">${tr('Bạn là nhà sáng tạo?', 'Are you a creator?')}</h3></div>
          <p class="card__body">${tr('Định danh KOCViet để nhận booking từ nhãn hàng uy tín, thanh toán qua ký quỹ và lộ trình thăng hạng rõ ràng: Tân binh → Chính danh → Ngôi sao → Nghệ sĩ.', 'Get verified on KOCViet to receive bookings from trusted brands, escrow payments and a clear tier path.')}</p>
          <a class="btn btn--sm" href="#/kocviet/dinh-danh">${tr('Đăng ký định danh', 'Get verified')}${icon('arrowRight', 'btn__icon')}</a>
        </div>
        <div class="card">
          <div class="row" style="gap:10px">${iconTile('wallet')}<h3 class="card__title">${tr('Affiliate minh bạch', 'Transparent affiliate')}</h3></div>
          <p class="card__body">${tr('Nhận link theo nhóm hàng, hoa hồng công bố trước phiên, đối soát tự động sau phiên. Không phí ẩn.', 'Get links by category, commissions published before the session and automatic reconciliation.')}</p>
          <a class="btn btn--link" href="#/kocviet/affiliate">${tr('Xem bảng hoa hồng', 'Commission table')}${icon('arrowRight', 'btn__icon btn__arrow')}</a>
        </div>
      </div>
    </div>
  </section>`
}

/* 10. Dự án */
function casesSection() {
  const cards = CASES.map(
    (c) => `<article class="case-card">
      ${media({ label: c.imageLabel, ratio: '16x9', badge: badgeDemo() })}
      <div class="case-card__body">
        <span class="xsmall muted">${esc(c.industry)} · ${esc(c.client)}</span>
        <h3 style="font-size:1.0625rem">${esc(c.title)}</h3>
        <p class="card__body">${esc(c.summary)}</p>
        <div class="case-card__metrics">${c.results
          .slice(0, 2)
          .map((r) => `<div><strong>${esc(r.value)}</strong><span>${esc(r.label)}</span></div>`)
          .join('')}</div>
        <a class="btn btn--link" href="#/du-an/${esc(c.slug)}">${tr('Đọc case', 'Read case')}${icon('arrowRight', 'btn__icon btn__arrow')}</a>
      </div>
    </article>`,
  ).join('')
  return `<section class="section section--alt">
    <div class="container">
      ${sectionHead({
        kicker: tr('Bằng chứng', 'Evidence'),
        title: tr('Dự án tiêu biểu', 'Case studies'),
        sub: tr('Số liệu trong case là dữ liệu minh hoạ, có ghi rõ để nhãn hàng biết phần nào cần xác minh.', 'Case figures are illustrative and labelled so brands know what to verify.'),
        action: linkArrow(tr('Xem tất cả dự án', 'All cases'), '#/du-an'),
      })}
      <div class="grid grid--3">${cards}</div>
    </div>
  </section>`
}

/* 11. Học viện */
function academySection() {
  const cards = COURSES.map(
    (c) => `<article class="course-card">
      <div class="row row--between">
        <span class="badge badge--primary">${esc(c.duration)} · ${c.hours} ${tr('giờ', 'hours')}</span>
        ${c.startDates[0] ? `<span class="xsmall muted">${tr('Khai giảng', 'Starts')} ${esc(c.startDates[0].label)}</span>` : ''}
      </div>
      <h3>${esc(c.title)}</h3>
      <p class="card__body">${esc(c.summary)}</p>
      <div class="course-card__fee">${esc(c.feeLabel)}</div>
      <a class="btn btn--ghost btn--sm" href="#/hoc-vien/${courseSlug(c.title)}">${tr('Xem chi tiết khoá', 'Course details')}${icon('arrowRight', 'btn__icon')}</a>
    </article>`,
  ).join('')
  return `<section class="section">
    <div class="container">
      ${sectionHead({
        kicker: tr('Học viện V-HUB', 'V-HUB Academy'),
        title: tr('Học tại trường quay, thực hành với nhãn hàng thật', 'Learn on set, practise with real brands'),
        sub: tr('Bốn khoá do VTV Nam Bộ chủ trì. Lộ trình rõ: Video AI → TVC AI hoặc Phim AI; Livestream học song song.', 'Four courses chaired by VTV Nam Bộ. A clear path: Video AI → TVC AI or Film AI; Livestream in parallel.'),
        action: linkArrow(tr('Xem học viện', 'Visit academy'), '#/hoc-vien'),
      })}
      <div class="grid grid--4">${cards}</div>
    </div>
  </section>`
}

/* 12. Quy trình */
function processSection() {
  return `<section class="section section--tight section--alt">
    <div class="container">
      ${sectionHead({
        kicker: tr('Quy trình', 'Process'),
        title: tr('Hợp tác trong 5 bước', 'Five steps to work together'),
        sub: tr('Mỗi bước có đầu ra rõ ràng, không phí thời gian của cả hai bên.', 'Each step has a clear output.'),
      })}
      <div class="path-rail">
        ${PROCESS.map(
          (p) => `<div class="card" style="gap:8px">
            <div class="row row--between"><span class="timeline__num" style="width:36px;height:36px;border-width:1.5px">${p.step}</span>${icon('arrowRight', 'muted')}</div>
            <h3 style="font-size:1rem">${esc(p.title)}</h3>
            <p class="card__body">${esc(p.body)}</p>
          </div>`,
        ).join('')}
      </div>
    </div>
  </section>`
}

/* 13. CTA cuối */
function finalCta() {
  return `<section class="section cta-band">
    <div class="container">
      <div class="cta-band__inner">
        <div class="stack">
          <span class="kicker">${tr('Bắt đầu', 'Start here')}</span>
          <h2>${tr('Đặt lịch tư vấn 60 phút', 'Book a 60-minute consultation')}</h2>
          <p class="lede">${tr('Phân tích hiện trạng và phác thảo lộ trình tăng trưởng, không ràng buộc.', 'We review your current state and outline a growth plan — no obligation.')}</p>
          <ul class="stack stack--sm small muted">
            <li class="row" style="gap:8px">${icon('check', 'btn__icon')} ${tr('Gặp trực tiếp đội vận hành, không qua sale trung gian.', 'Meet the operations team directly.')}</li>
            <li class="row" style="gap:8px">${icon('check', 'btn__icon')} ${tr('Xem studio thật trước khi quyết định.', 'See the real studios before deciding.')}</li>
            <li class="row" style="gap:8px">${icon('check', 'btn__icon')} ${tr('Nhận khung gói và chỉ số đo dự kiến trong 48 giờ.', 'Get package options and KPIs within 48 hours.')}</li>
          </ul>
          <div class="row" style="gap:10px">
            <a class="btn btn--ghost" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${esc(ORG.hotline)}</span></a>
            <a class="btn btn--ghost" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>Zalo OA</span></a>
          </div>
        </div>
        <div class="card" style="background:var(--surface)">
          <h3 style="font-size:1.125rem">${tr('Để lại thông tin', 'Leave your details')}</h3>
          ${leadFormMarkup({ id: 'home-lead-form', compact: true, submitLabel: tr('Đặt lịch tư vấn', 'Book a consultation') })}
        </div>
      </div>
    </div>
  </section>`
}

export function render() {
  return {
    title: 'V-HUB — Trường quay của thương mại số Việt | Đưa hàng Việt lên sóng',
    description:
      'V-HUB là hệ thống MCN thương mại điện tử chính danh thuộc hệ sinh thái VTV Nam Bộ: đào tạo, định danh KOCViet, livestream, sản xuất nội dung AI, vận hành TMĐT đa tuyến và Chợ Phiên Phương Nam.',
    html: `${heroSection()}
      <main id="main">
        ${doorsSection()}
        ${reasonsSection()}
        ${statsSection()}
        ${wheelSection()}
        ${studioSection()}
        ${liveSection()}
        ${marketSection()}
        ${kocSection()}
        ${casesSection()}
        ${academySection()}
        ${processSection()}
        ${finalCta()}
      </main>`,
    mount(root) {
      // Vòng quay: đổi nội dung panel
      const panel = root.querySelector('#wheel-panel')
      root.querySelectorAll('[data-wheel]').forEach((node) => {
        const activate = () => {
          const idx = Number(node.dataset.wheel)
          const item = WHEEL[idx]
          if (!panel || !item) return
          root.querySelectorAll('[data-wheel]').forEach((n) => n.classList.remove('is-active'))
          node.classList.add('is-active')
          panel.innerHTML = `<span class="wheel-panel__step">${tr('Bước', 'Step')} 0${item.step}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p><a class="btn btn--link" href="${esc(item.href)}">${tr('Xem chi tiết', 'Learn more')}${icon('arrowRight', 'btn__icon btn__arrow')}</a>`
        }
        node.addEventListener('click', activate)
        node.addEventListener('mouseenter', activate)
      })

      // Tab ngày cho lịch live
      const strip = root.querySelector('#home-live-strip')
      const lives = getLives()
      const days = weekDays(lives)
      root.querySelectorAll('[data-day]').forEach((tab) => {
        tab.addEventListener('click', () => {
          root.querySelectorAll('[data-day]').forEach((t) => {
            t.setAttribute('aria-selected', 'false')
            t.classList.remove('is-active')
          })
          tab.setAttribute('aria-selected', 'true')
          tab.classList.add('is-active')
          const day = days.find((d) => d.key === tab.dataset.day)
          if (!strip || !day) return
          strip.innerHTML = day.items.length
            ? day.items.map(liveCard).join('')
            : emptyState({
                title: 'Ngày này chưa có phiên live',
                text: 'Lịch live đang được cập nhật. Đăng ký nhận lịch qua Zalo để không bỏ lỡ.',
                action: `<a class="btn btn--sm" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>Nhận lịch qua Zalo</span></a>`,
              })
        })
      })
    },
  }
}
