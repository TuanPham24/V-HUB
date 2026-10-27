/** Trang Giải pháp: tổng quan, 3 nhóm người xem, chi tiết từng giải pháp, công cụ ước tính. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { PACKAGES, SOLUTIONS, AUDIENCE_PAGES, getSolution, solutionsByGroup } from '../lib/catalog-solutions.js'
import { PROCESS, SERVICE_PROMISES, ORG } from '../lib/catalog-site.js'
import { MARKET_PROVINCES } from '../lib/catalog-provinces.js'
import { media, linkArrow, sectionHead, iconTile, badgeDemo, breadcrumb, accordion } from '../components/ui.js'
import { leadFormMarkup } from '../components/forms.js'
import { estimatorMarkup, attachEstimator } from '../components/estimator.js'

function packageCard(p) {
  return `<article class="plan ${p.highlight ? 'plan--highlight' : ''}">
    ${p.highlight ? `<span class="plan__flag">${tr('Khuyên dùng', 'Recommended')}</span>` : ''}
    <span class="badge badge--primary">${tr('Gói', 'Package')} ${esc(p.id)}</span>
    <h3 style="font-size:1.125rem">${esc(p.name.replace(/^[A-E] — /, ''))}</h3>
    <div class="plan__price">${esc(p.priceLabel)}</div>
    ${p.priceNote ? `<p class="xsmall muted">${esc(p.priceNote)}</p>` : ''}
    <p class="card__body">${esc(p.suitableFor)}</p>
    <ul class="plan__list">${p.includes.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}</ul>
    <div class="spec-list" style="font-size:0.8125rem">
      <div><span class="spec-label">${tr('Tần suất', 'Frequency')}</span><span class="spec-value">${esc(p.frequency)}</span></div>
      <div><span class="spec-label">${tr('Cam kết', 'Commitment')}</span><span class="spec-value">${esc(p.commitment)}</span></div>
    </div>
    <a class="btn btn--ghost btn--sm" href="#/lien-he?goi=${esc(p.id)}">${tr('Nhận báo giá', 'Request a quote')}</a>
  </article>`
}

function packagesSection(title = tr('Khung gói tham khảo', 'Reference packages'), sub = '') {
  return `<section class="section" id="goi">
    <div class="container">
      ${sectionHead({ kicker: tr('Gói dịch vụ', 'Packages'), title, sub, action: `<a class="btn btn--ghost btn--sm" href="#/lien-he">${tr('Đặt lịch tư vấn', 'Book a consultation')}</a>` })}
      <div class="grid grid--3">${PACKAGES.slice(0, 3).map(packageCard).join('')}</div>
      <div class="grid grid--2 mt-4">
        ${PACKAGES.slice(3)
          .map(packageCard)
          .join('')}
      </div>
      <p class="small muted mt-3">${tr('Giá chỉ ghi "từ…" hoặc "Liên hệ". Mọi mức giá và cam kết được ghi rõ trong đề xuất chính thức.', 'Prices are shown as “from…” or “contact”. Final scope and commitments are stated in the proposal.')} ${badgeDemo(tr('Giá minh hoạ', 'Illustrative pricing'))}</p>
    </div>
  </section>`
}

/* ---------- Tổng quan ---------- */
function overviewPage() {
  const groups = [
    {
      id: 'nhan-hang',
      title: tr('Nhãn hàng & tập đoàn', 'Brands & corporations'),
      body: tr('Livestream chuẩn truyền hình, KOC định danh, doanh số đo được. Một hợp đồng cho cả chiến dịch và vận hành dài hạn.', 'Broadcast-grade livestream, verified creators, measurable sales. One contract for campaigns and ongoing operations.'),
      slugs: ['brand-live-house', 'van-hanh-tmdt-da-tuyen', 'thuong-hieu-ip-vtv', 'video-ai-tvc-ai'],
    },
    {
      id: 'sme',
      title: tr('Doanh nghiệp vừa và nhỏ', 'Small & medium businesses'),
      body: tr('Bắt đầu từ gian hàng đầu tiên, kết thúc bằng đội ngũ tự vận hành trong 90 ngày.', 'Start with your first storefront, finish with a self-sufficient team in 90 days.'),
      slugs: ['khoi-dong-tmdt', 'dao-tao-doi-ngu'],
    },
    {
      id: 'dia-phuong',
      title: tr('Địa phương & OCOP', 'Localities & OCOP'),
      body: tr('Đưa đặc sản ra cả nước trong một mùa Chợ Phiên, có đào tạo tại chỗ và minh bạch quỹ.', 'Take specialties nationwide in one market season, with on-site training and fund transparency.'),
      slugs: ['cho-phien-dia-phuong', 'mega-xuc-tien'],
    },
  ]
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'Giải pháp' }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${tr('Giải pháp', 'Solutions')}</span>
          <h1>${tr('Một đầu mối cho mọi tuyến bán hàng', 'One partner across every sales channel')}</h1>
          <p class="lede">${tr('V-HUB tổ chức giải pháp theo người xem, không theo cơ cấu nội bộ — để bạn thấy ngay việc của mình nằm ở đâu và bắt đầu từ đâu.', 'We organise solutions by audience, not internal structure — so you can see where you fit and where to start.')}</p>
          <div class="row" style="gap:10px">
            <a class="btn" href="#estimator">${tr('Ước tính chi phí livestream', 'Estimate livestream cost')}${icon('arrowRight', 'btn__icon')}</a>
            <a class="btn btn--ghost" href="#/lien-he">${tr('Đặt lịch tư vấn', 'Book a consultation')}</a>
          </div>
        </div>
        ${media({ label: tr('Ảnh thật: đội ngũ vận hành V-HUB tại phòng điều khiển', 'Real photo: V-HUB operations team in the control room'), ratio: '4x3' })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="grid grid--3">
          ${groups
            .map(
              (g) => `<article class="card reveal" id="nhom-${g.id}">
                <h2 class="card__title">${esc(g.title)}</h2>
                <p class="card__body">${esc(g.body)}</p>
                <ul class="plan__list">
                  ${g.slugs
                    .map((s) => {
                      const sol = getSolution(s)
                      return sol ? `<li>${icon('check')}<a href="#/giai-phap/${esc(sol.slug)}" style="color:var(--secondary)">${esc(sol.title)}</a></li>` : ''
                    })
                    .join('')}
                </ul>
                <a class="btn btn--sm mt-3" href="#/giai-phap/${esc(g.id === 'nhan-hang' ? 'nhan-hang' : g.id === 'sme' ? 'doanh-nghiep-vua-va-nho' : 'dia-phuong-ocop')}">${tr('Xem giải pháp cho nhóm này', 'See solutions')}${icon('arrowRight', 'btn__icon')}</a>
              </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>
    ${packagesSection()}
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Cam kết dịch vụ', 'Service commitments'), title: tr('Ba điều bạn luôn nhận được', 'Three things you always get'), sub: '' })}
        <div class="grid grid--3">
          ${SERVICE_PROMISES.map((s) => `<article class="card"><h3 class="card__title">${esc(s.title)}</h3><p class="card__body">${esc(s.body)}</p></article>`).join('')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Quy trình', 'Process'), title: tr('Hợp tác trong 5 bước', 'Five steps to work together') })}
        <div class="timeline">
          ${PROCESS.map((p) => `<div class="timeline__item"><span class="timeline__num">${p.step}</span><div class="timeline__body"><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></div></div>`).join('')}
        </div>
      </div>
    </section>
    <section class="section section--tight cta-band">
      <div class="container">
        <div class="cta-band__inner">
          <div class="stack"><span class="kicker">${tr('Bắt đầu', 'Start')}</span><h2>${tr('Đặt lịch tư vấn 60 phút', 'Book a 60-minute consultation')}</h2><p class="lede">${tr('Chúng tôi phân tích hiện trạng và phác thảo lộ trình, không ràng buộc.', 'We review your situation and outline a plan — no obligation.')}</p></div>
          <div class="card" style="background:var(--surface)">${leadFormMarkup({ id: 'solutions-lead', compact: true })}</div>
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Trang theo người xem ---------- */
function audiencePage(slug) {
  const page = AUDIENCE_PAGES[slug]
  if (!page) return null
  const related = page.relatedSolutions.map(getSolution).filter(Boolean)
  const isBrand = slug === 'nhan-hang'
  const isLocal = slug === 'dia-phuong-ocop'
  const packageIds = isBrand ? ['A', 'B', 'C'] : ['A', 'B']
  return `<div class="page-hero ${isBrand ? 'page-hero--navy' : ''}">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Giải pháp', 'Solutions'), href: '#/giai-phap' }, { label: page.title }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${esc(page.kicker)}</span>
          <h1>${esc(isBrand ? tr('Livestream chuẩn truyền hình, nhà sáng tạo định danh, doanh số đo được', page.heroTitle) : page.heroTitle)}</h1>
          <p class="lede">${esc(isBrand ? tr('V-HUB nhận trách nhiệm từ khâu chọn người, sản xuất nội dung đến vận hành phiên bán và báo cáo kết quả — trong một hợp đồng, một đầu mối.', page.heroSub) : page.heroSub)}</p>
          <div class="row" style="gap:10px">
            <a class="btn ${isBrand ? 'btn--on-dark' : ''}" href="#tu-van">${esc(page.ctaLabel)}${icon('arrowRight', 'btn__icon')}</a>
            <a class="btn ${isBrand ? 'btn--outline-light' : 'btn--ghost'}" href="#/studio">${tr('Xem studio', 'View studios')}</a>
          </div>
        </div>
        ${media({ src: null, label: isBrand ? tr('Ảnh thật: phiên live tại Super-Megalive Studio', 'Real photo: live session at Super-Megalive Studio') : isLocal ? tr('Ảnh thật: vườn trái cây miền Tây', 'Real photo: Mekong orchard') : tr('Ảnh thật: đội ngũ doanh nghiệp tại studio V-HUB', 'Real photo: business team at V-HUB studio'), ratio: '4x3', dark: isBrand })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Vấn đề', 'The problem'), title: tr('Bạn đang gặp…', 'What you are facing'), sub: tr('Bốn vấn đề thường gặp nhất, và cách V-HUB xử lý từng vấn đề.', 'Four common problems and how V-HUB handles each.') })}
        <div class="grid grid--2">
          ${page.pains
            .map(
              (p, i) => `<article class="card">
                <div class="row" style="gap:10px">${iconTile(['alert', 'camera', 'layers', 'target'][i] || 'alert')}<h3 class="card__title">${esc(p.title)}</h3></div>
                <p class="card__body">${esc(p.body)}</p>
              </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Mô hình', 'Model'), title: isLocal ? tr('Hai lớp triển khai', 'Two layers of delivery') : tr('Hai động cơ: đều đặn và bứt phá', 'Two engines: steady and surge') })}
        <div class="grid grid--2">
          ${page.models.map((m) => `<article class="card"><h3 class="card__title">${esc(m.title)}</h3><p class="card__body">${esc(m.body)}</p></article>`).join('')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Giải pháp liên quan', 'Related solutions'), title: tr('Chọn theo mục tiêu của bạn', 'Choose by objective') })}
        <div class="grid grid--3">
          ${related
            .map(
              (s) => `<article class="card card--link">
                <span class="badge badge--primary">${esc(s.kicker)}</span>
                <h3 class="card__title">${esc(s.title)}</h3>
                <p class="card__body">${esc(s.summary)}</p>
                <div class="card__foot"><a class="btn btn--link" href="#/giai-phap/${esc(s.slug)}">${tr('Xem chi tiết', 'Details')}${icon('arrowRight', 'btn__icon btn__arrow')}</a></div>
              </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Khung gói', 'Packages'), title: tr('Gói phù hợp với nhóm của bạn', 'Packages for your segment'), sub: tr('Giá ghi "từ…" hoặc "Liên hệ"; phạm vi và cam kết được chốt trong đề xuất.', 'Prices are “from…” or “contact”; scope and commitments are set in the proposal.') })}
        <div class="grid grid--3">${PACKAGES.filter((p) => packageIds.includes(p.id)).map(packageCard).join('')}</div>
      </div>
    </section>
    ${
      page.safety
        ? `<section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('An toàn thương hiệu', 'Brand safety'), title: isLocal ? tr('Kiểm soát và minh bạch', 'Control and transparency') : tr('Năm lớp kiểm soát an toàn thương hiệu', 'Five layers of brand safety'), sub: tr('Áp dụng cho mọi phiên có nhãn hàng, không phụ thuộc quy mô.', 'Applied to every branded session regardless of size.') })}
        <div class="timeline">${page.safety.map((s, i) => `<div class="timeline__item"><span class="timeline__num">${i + 1}</span><div class="timeline__body"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div></div>`).join('')}</div>
      </div>
    </section>`
        : ''
    }
    ${
      isLocal
        ? `<section class="section section--navy" id="cac-tinh">
      <div class="container">
        ${sectionHead({ kicker: tr('Bản đồ tham gia', 'Participation map'), title: tr('Các tỉnh trong và ngoài chương trình', 'Provinces in and beyond the programme'), sub: tr('Danh sách hiển thị theo trạng thái: mùa 1, phiên thí điểm, dự kiến.', 'Listed by status: season 1, pilot, planned.') })}
        <div class="province-chips">
          ${MARKET_PROVINCES.map((p) => `<span class="province-chip province-chip--${p.status === 'season1' ? 'season1' : p.status === 'pilot' ? 'pilot' : 'planned'}">${esc(p.name)}${p.status === 'season1' ? ' · Mùa 1' : p.status === 'pilot' ? ' · Thí điểm' : ''}</span>`).join('')}
        </div>
        <div class="row mt-4"><a class="btn btn--on-dark" href="#/cho-phien">${tr('Xem Chợ Phiên Phương Nam', 'Explore Southern Market Days')}${icon('arrowRight', 'btn__icon')}</a></div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack">
            <span class="kicker">${tr('Tài liệu', 'Documents')}</span>
            <h2>${tr('Tải hồ sơ năng lực và mẫu công văn', 'Download our capability profile and templates')}</h2>
            <p class="lede">${tr('Điền 4 trường để nhận hồ sơ năng lực V-HUB, mẫu công văn phối hợp và checklist hồ sơ OCOP.', 'Fill in four fields to receive our capability profile, coordination template and OCOP checklist.')}</p>
            <ul class="stack stack--sm small muted">
              <li class="row" style="gap:8px">${icon('check', 'btn__icon')} ${tr('Hồ sơ năng lực V-HUB (PDF)', 'V-HUB capability profile (PDF)')}</li>
              <li class="row" style="gap:8px">${icon('check', 'btn__icon')} ${tr('Mẫu công văn phối hợp tổ chức phiên', 'Coordination letter template')}</li>
              <li class="row" style="gap:8px">${icon('check', 'btn__icon')} ${tr('Checklist hồ sơ sản phẩm OCOP', 'OCOP product checklist')}</li>
              <li class="row" style="gap:8px">${icon('check', 'btn__icon')} ${tr('Khung chương trình mùa tiếp theo', 'Next season programme outline')}</li>
            </ul>
            <p class="note-box">${tr('Tài liệu chính thức đang được hoàn thiện. Sau khi gửi thông tin, đội V-HUB sẽ gửi bản cập nhật mới nhất qua email.', 'Official documents are being finalised. Submit your details and we will email the latest versions.')}</p>
          </div>
          <div class="card" id="tu-van">
            <h3 style="font-size:1.125rem">${tr('Nhận hồ sơ năng lực', 'Get the capability profile')}</h3>
            ${leadFormMarkup({ id: 'local-lead', presetAudience: 'dia-phuong', submitLabel: tr('Tải hồ sơ năng lực', 'Get the profile') })}
          </div>
        </div>
      </div>
    </section>`
        : ''
    }
    ${
      isBrand
        ? `<section class="section section--alt" id="uoc-tinh">
      <div class="container">
        ${sectionHead({ kicker: tr('Công cụ', 'Tool'), title: tr('Ước tính chi phí livestream cho nhãn hàng', 'Livestream cost estimator for brands'), sub: tr('Bốn câu hỏi ngắn, nhận khung chi phí tham khảo và gói gợi ý. Không phải cam kết doanh số.', 'Four short questions for a reference budget and suggested package. Not a sales commitment.') })}
        <div style="max-width:860px">${estimatorMarkup()}</div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div>${media({ label: tr('Ảnh thật: dashboard báo cáo phiên live (dữ liệu mẫu)', 'Real screenshot: live session report dashboard (sample data)'), ratio: '16x10', badge: badgeDemo() })}</div>
          <div class="stack">
            <span class="kicker">${tr('Báo cáo', 'Reporting')}</span>
            <h2>${tr('Bạn nhận báo cáo gì sau mỗi phiên?', 'What reporting do you get?')}</h2>
            <ul class="plan__list">
              ${[
                tr('Người xem đồng thời cao nhất và thời lượng xem trung bình', 'Peak concurrent viewers and average watch time'),
                tr('Số đơn, doanh thu, giá trị đơn trung bình theo từng khung giờ', 'Orders, revenue and AOV by time block'),
                tr('Chi phí trên mỗi đơn và tỷ lệ hoàn hàng', 'Cost per order and return rate'),
                tr('Hiệu quả từng KOC tham gia phiên', 'Performance per participating creator'),
                tr('Đề xuất tối ưu cho phiên kế tiếp', 'Recommendations for the next session'),
              ]
                .map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`)
                .join('')}
            </ul>
            <p class="small muted">${tr('Báo cáo gửi trong 24 giờ sau phiên. Dữ liệu trong ảnh là dữ liệu minh hoạ.', 'Reports are sent within 24 hours. The dashboard image uses sample data.')}</p>
          </div>
        </div>
      </div>
    </section>`
        : ''
    }
    ${
      page.faq
        ? `<section class="section section--alt">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack"><span class="kicker">${tr('Hỏi đáp', 'FAQ')}</span><h2>${tr('Câu hỏi thường gặp', 'Frequently asked questions')}</h2><p class="lede">${tr('Không thấy câu trả lời? Gọi hotline hoặc để lại thông tin, V-HUB phản hồi trong 15 phút giờ hành chính.', 'Not answered here? Call us or leave your details — we reply within 15 minutes during office hours.')}</p><a class="btn btn--ghost btn--sm" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${esc(ORG.hotline)}</span></a></div>
          ${accordion(page.faq.map((f) => ({ title: f.title, body: `<p>${esc(f.body)}</p>` })), 'faq')}
        </div>
      </div>
    </section>`
        : ''
    }
    <section class="section section--tight cta-band" id="tu-van-form">
      <div class="container">
        <div class="cta-band__inner">
          <div class="stack">
            <span class="kicker">${tr('Bắt đầu', 'Start')}</span>
            <h2>${esc(page.ctaLabel)}</h2>
            <p class="lede">${tr('Điền thông tin hoặc gọi trực tiếp. V-HUB phản hồi trong 15 phút giờ hành chính.', 'Submit your details or call us. We reply within 15 minutes during office hours.')}</p>
            <div class="row" style="gap:10px"><a class="btn btn--ghost" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>Zalo OA</span></a><a class="btn btn--ghost" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${esc(ORG.hotline)}</span></a></div>
          </div>
          <div class="card" style="background:var(--surface)" id="tu-van">
            ${leadFormMarkup({ id: `audience-lead-${slug}`, presetAudience: page.slug, submitLabel: page.ctaLabel })}
          </div>
        </div>
      </div>
    </section>
  </main>`
}

/* ---------- Trang chi tiết giải pháp ---------- */
function solutionPage(solution) {
  const siblings = SOLUTIONS.filter((s) => s.slug !== solution.slug && s.group === solution.group).slice(0, 3)
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: 'Giải pháp', href: '#/giai-phap' }, { label: solution.title }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${esc(solution.kicker)}</span>
          <h1>${esc(solution.title)}</h1>
          <p class="lede">${esc(solution.summary)}</p>
          <div class="row" style="gap:10px">
            <a class="btn" href="#tu-van-solution">${tr('Đặt lịch tư vấn', 'Book a consultation')}${icon('arrowRight', 'btn__icon')}</a>
            <span class="badge badge--primary" style="min-height:44px;padding-inline:16px">${esc(solution.priceLabel)}</span>
          </div>
          <ul class="plan__list" style="margin-top:8px">
            ${solution.bullets.map((b) => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}
          </ul>
        </div>
        ${media({ label: tr('Ảnh thật: triển khai dịch vụ tại V-HUB', 'Real photo: service delivery at V-HUB'), ratio: '4x3' })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Phạm vi công việc', 'Scope of work'), title: tr('V-HUB làm những gì', 'What V-HUB delivers') })}
        <div class="grid grid--3">
          ${solution.deliverables
            .map(
              (d, i) => `<article class="card"><span class="badge badge--primary">0${i + 1}</span><h3 class="card__title">${esc(d.title)}</h3><p class="card__body">${esc(d.body)}</p></article>`,
            )
            .join('')}
        </div>
      </div>
    </section>
    ${
      solution.metrics
        ? `<section class="section section--tight section--alt"><div class="container"><div class="grid grid--3">${solution.metrics
            .map((m) => `<div class="card" style="gap:4px"><strong style="font-family:var(--font-heading);font-size:1.125rem">${esc(m.value)}</strong><span class="small muted">${esc(m.label)}</span></div>`)
            .join('')}</div></div></section>`
        : ''
    }
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div class="stack">
            <span class="kicker">${tr('Vì sao V-HUB', 'Why V-HUB')}</span>
            <h2>${tr('Một đầu mối, chịu trách nhiệm kết quả', 'One partner, accountable for results')}</h2>
            <p class="lede">${tr('Bạn không phải điều phối nhiều nhà cung cấp. V-HUB nhận trách nhiệm từ người lên sóng đến báo cáo cuối kỳ.', 'No vendor juggling. V-HUB is accountable from who goes on air to the final report.')}</p>
            <div class="grid grid--2" style="gap:12px">
              ${SERVICE_PROMISES.map((s) => `<div class="card card--flat" style="gap:6px"><strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(s.title)}</strong><span class="small muted">${esc(s.body)}</span></div>`).join('')}
            </div>
          </div>
          <div class="card" id="tu-van-solution">
            <h3 style="font-size:1.125rem">${tr('Nhận đề xuất cho giải pháp này', 'Get a proposal for this solution')}</h3>
            ${leadFormMarkup({ id: `solution-lead-${solution.slug}`, compact: true, presetAudience: solution.group === 'dia-phuong' ? 'dia-phuong' : solution.group === 'sme' ? 'sme' : 'nhan-hang', submitLabel: tr('Nhận đề xuất', 'Send me a proposal') })}
          </div>
        </div>
      </div>
    </section>
    ${
      solution.faq
        ? `<section class="section section--alt"><div class="container"><div class="split split--5-7"><div><span class="kicker">${tr('Hỏi đáp', 'FAQ')}</span><h2>${tr('Câu hỏi thường gặp', 'FAQ')}</h2></div>${accordion(solution.faq.map((f) => ({ title: f.title, body: `<p>${esc(f.body)}</p>` })), 'sol-faq')}</div></div></section>`
        : ''
    }
    ${
      siblings.length
        ? `<section class="section"><div class="container">${sectionHead({ kicker: tr('Liên quan', 'Related'), title: tr('Giải pháp khác', 'Other solutions') })}<div class="grid grid--3">${siblings
            .map((s) => `<article class="card card--link"><span class="badge">${esc(s.kicker)}</span><h3 class="card__title">${esc(s.title)}</h3><p class="card__body">${esc(s.summary)}</p><div class="card__foot">${linkArrow(tr('Xem chi tiết', 'Details'), `#/giai-phap/${s.slug}`)}</div></article>`)
            .join('')}</div></div></section>`
        : ''
    }
  </main>`
}

/* ---------- Entry ---------- */
export function render(ctx) {
  const page = renderPage(ctx)
  if (!page) return null
  return {
    ...page,
    mount(root) {
      attachEstimator(root)
      if (typeof page.mount === 'function') page.mount(root)
    },
  }
}

function renderPage(ctx) {
  const seg = ctx.segments
  const slug = seg[1]
  let html = ''
  let title = 'Giải pháp — V-HUB'
  let description = 'Giải pháp theo người xem: nhãn hàng & tập đoàn, doanh nghiệp vừa và nhỏ, địa phương & OCOP.'
  if (!slug) {
    html = overviewPage()
    title = 'Giải pháp — V-HUB | Nhãn hàng, doanh nghiệp vừa và nhỏ, địa phương & OCOP'
  } else if (AUDIENCE_PAGES[slug]) {
    html = audiencePage(slug)
    title = `${AUDIENCE_PAGES[slug].title} — V-HUB`
    description = AUDIENCE_PAGES[slug].heroSub
  } else {
    const solution = getSolution(slug)
    if (!solution) return null
    html = solutionPage(solution)
    title = `${solution.title} — Giải pháp V-HUB`
    description = solution.summary
  }
  return {
    title,
    description,
    html,
    jsonLd: slug && getSolution(slug) ? { '@context': 'https://schema.org', '@type': 'Service', name: getSolution(slug).title, description: getSolution(slug).summary, provider: { '@type': 'Organization', name: 'V-HUB' }, areaServed: 'VN' } : null,
  }
}

export function solutionLinks(group) {
  return solutionsByGroup(group)
}
