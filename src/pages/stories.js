/** Dự án tiêu biểu, Tin tức & kiến thức, Về V-HUB. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ORG, REASONS } from '../lib/catalog-site.js'
import { CASES, NEWS, getCase, getPost } from '../lib/catalog-cases.js'
import { formatDate } from '../lib/format.js'
import { media, linkArrow, sectionHead, iconTile, badgeDemo, breadcrumb, emptyState } from '../components/ui.js'
import { leadFormMarkup } from '../components/forms.js'

/* ---------- Dự án ---------- */
export function renderCases(ctx) {
  const slug = ctx.segments[1]
  if (!slug) {
    return {
      title: 'Dự án tiêu biểu — V-HUB',
      description: 'Case study của V-HUB: bối cảnh, thách thức, cách triển khai và kết quả. Số liệu minh hoạ được ghi rõ.',
      html: `<div class="page-hero">
        <div class="container">
          ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Dự án tiêu biểu', 'Case studies') }])}
          <div class="stack" style="max-width:760px">
            <span class="kicker">${tr('Bằng chứng', 'Evidence')}</span>
            <h1>${tr('Dự án tiêu biểu', 'Case studies')}</h1>
            <p class="lede">${tr('Mỗi case ghi rõ bối cảnh, thách thức, cách làm và kết quả. Số liệu minh hoạ được đánh dấu để nhãn hàng biết phần nào cần xác minh.', 'Each case states context, challenge, approach and results. Illustrative figures are flagged.')}</p>
            ${badgeDemo()}
          </div>
        </div>
      </div>
      <main id="main"><section class="section"><div class="container"><div class="grid grid--3">
        ${CASES.map(
          (c) => `<article class="case-card">
            ${media({ src: c.imageSrc, label: c.imageLabel, ratio: '16x9', badge: badgeDemo() })}
            <div class="case-card__body">
              <span class="xsmall muted">${esc(c.industry)} · ${esc(c.client)}</span>
              <h2 style="font-size:1.125rem">${esc(c.title)}</h2>
              <p class="card__body">${esc(c.summary)}</p>
              <div class="case-card__metrics">${c.results.slice(0, 2).map((r) => `<div><strong>${esc(r.value)}</strong><span>${esc(r.label)}</span></div>`).join('')}</div>
              ${linkArrow(tr('Đọc case', 'Read case'), `#/du-an/${c.slug}`)}
            </div>
          </article>`,
        ).join('')}
      </div></div></section></main>`,
    }
  }
  const c = getCase(slug)
  if (!c) return null
  const related = CASES.filter((x) => x.slug !== c.slug)
  return {
    title: `${c.client} — Dự án tiêu biểu V-HUB`,
    description: c.summary,
    html: `<div class="page-hero">
      <div class="container">
        ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Dự án tiêu biểu', 'Case studies'), href: '#/du-an' }, { label: c.client }])}
        <div class="page-hero__inner page-hero__inner--split">
          <div class="page-hero__copy">
            <span class="kicker">${esc(c.industry)}</span>
            <h1>${esc(c.title)}</h1>
            <p class="lede">${esc(c.summary)}</p>
            <div class="row" style="gap:8px"><span class="badge badge--primary">${esc(c.client)}</span><span class="badge">${esc(c.clientNote)}</span>${badgeDemo()}</div>
          </div>
          ${media({ src: c.imageSrc, label: c.imageLabel, ratio: '4x3' })}
        </div>
      </div>
    </div>
    <main id="main">
      <section class="section section--tight">
        <div class="container">
          <div class="grid grid--3">
            ${c.results.map((r) => `<div class="card" style="gap:4px"><strong style="font-family:var(--font-heading);font-size:var(--fs-stat);color:var(--primary-deep);line-height:1">${esc(r.value)}</strong><span class="small muted">${esc(r.label)}</span>${r.demo ? `<span class="badge badge--demo">${tr('Dữ liệu minh hoạ', 'Illustrative')}</span>` : ''}</div>`).join('')}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="split split--7-5">
            <div class="stack">
              <h2>${tr('Bối cảnh & thách thức', 'Context & challenge')}</h2>
              <p class="lede">${esc(c.challenge)}</p>
              <h2 style="margin-top:12px">${tr('Cách V-HUB triển khai', 'Our approach')}</h2>
              <ul class="plan__list">${c.approach.map((a) => `<li>${icon('check')}<span>${esc(a)}</span></li>`).join('')}</ul>
              <h2 style="margin-top:12px">${tr('Video highlight', 'Highlight video')}</h2>
              ${media({ label: tr('Video thật: highlight chiến dịch (đang chờ tư liệu)', 'Real video: campaign highlight (assets pending)'), ratio: '16x9' })}
            </div>
            <div class="stack">
              <div class="card card--accent">
                <span class="icon-tile icon-tile--navy" style="background:var(--surface);color:var(--primary-strong)">${icon('quote')}</span>
                <p style="font-family:var(--font-heading);font-size:1.0625rem;line-height:1.55">“${esc(c.quote.text)}”</p>
                <div class="xsmall muted">${esc(c.quote.author)} · ${esc(c.quote.role)}</div>
              </div>
              <div class="card">
                <h3 style="font-size:1rem">${tr('Bạn có dự án tương tự?', 'Have a similar project?')}</h3>
                <p class="card__body">${tr('Đặt lịch tư vấn 60 phút để V-HUB phân tích hiện trạng và đề xuất lộ trình.', 'Book a 60-minute consultation for a review and roadmap.')}</p>
                <a class="btn btn--sm" href="#/lien-he">${tr('Đặt lịch tư vấn', 'Book a consultation')}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container">${sectionHead({ kicker: tr('Liên quan', 'Related'), title: tr('Dự án khác', 'Other cases') })}<div class="grid grid--2">${related
          .map((x) => `<article class="card card--link" style="padding:10px">${media({ src: x.imageSrc, label: x.imageLabel, ratio: '16x9' })}<div style="padding:6px"><h3 class="card__title">${esc(x.title)}</h3><p class="card__body">${esc(x.summary)}</p>${linkArrow(tr('Đọc case', 'Read case'), `#/du-an/${x.slug}`)}</div></article>`)
          .join('')}</div></div>
      </section>
    </main>`,
  }
}

/* ---------- Tin tức ---------- */
export function renderNews(ctx) {
  const slug = ctx.segments[1]
  if (!slug) {
    const cats = Array.from(new Set(NEWS.map((n) => n.category)))
    return {
      title: 'Tin tức & kiến thức — V-HUB',
      description: 'Kiến thức vận hành livestream, chuẩn mực nội dung, chuyển đổi số cho OCOP và tin tức từ V-HUB.',
      html: `<div class="page-hero">
        <div class="container">
          ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Tin tức & kiến thức', 'News & insights') }])}
          <div class="stack" style="max-width:760px">
            <span class="kicker">${tr('Tin tức & kiến thức', 'News & insights')}</span>
            <h1>${tr('Ghi chép từ trường quay', 'Notes from the studio')}</h1>
            <p class="lede">${tr('Kinh nghiệm vận hành, chuẩn mực nội dung và những bài học từ các phiên live thật.', 'Operational experience, content standards and lessons from real sessions.')}</p>
            <div class="row">${cats.map((c) => `<span class="tag">${esc(c)}</span>`).join('')}</div>
          </div>
        </div>
      </div>
      <main id="main"><section class="section"><div class="container"><div class="grid grid--2">
        ${NEWS.map(
          (p) => `<article class="card card--link" style="padding:10px">
            ${media({ src: p.imageSrc, label: p.imageLabel, ratio: '16x9' })}
            <div style="padding:8px" class="stack stack--sm">
              <div class="row" style="gap:8px"><span class="badge badge--primary">${esc(p.category)}</span><span class="xsmall muted">${formatDate(p.date)} · ${esc(p.readingTime)}</span></div>
              <h2 style="font-size:1.125rem">${esc(p.title)}</h2>
              <p class="card__body">${esc(p.excerpt)}</p>
              ${linkArrow(tr('Đọc bài', 'Read article'), `#/tin-tuc/${p.slug}`)}
            </div>
          </article>`,
        ).join('')}
      </div></div></section></main>`,
    }
  }
  const post = getPost(slug)
  if (!post) return null
  const related = NEWS.filter((x) => x.slug !== post.slug).slice(0, 2)
  return {
    title: `${post.title} — V-HUB`,
    description: post.excerpt,
    html: `<div class="page-hero">
      <div class="container">
        ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Tin tức & kiến thức', 'News & insights'), href: '#/tin-tuc' }, { label: post.category }])}
        <div class="stack" style="max-width:820px">
          <span class="kicker">${esc(post.category)}</span>
          <h1>${esc(post.title)}</h1>
          <p class="lede">${esc(post.excerpt)}</p>
          <div class="row" style="gap:8px"><span class="badge">${formatDate(post.date)}</span><span class="badge">${esc(post.readingTime)}</span><span class="badge">V-HUB</span></div>
        </div>
      </div>
    </div>
    <main id="main">
      <section class="section">
        <div class="container">
          ${media({ src: post.imageSrc, label: post.imageLabel, ratio: '16x9' })}
          <div class="split split--7-5 mt-5">
            <article class="prose">
              ${post.body.map((b) => `<h2>${esc(b.heading)}</h2>${b.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')}
              <div class="note-box">${tr('Bài viết thể hiện quan điểm vận hành của V-HUB, không phải tư vấn pháp lý hoặc đầu tư.', 'This article reflects V-HUB operational views, not legal or investment advice.')}</div>
            </article>
            <aside class="stack">
              <div class="card card--accent"><h3 style="font-size:1rem">${tr('Đặt lịch tư vấn 60 phút', 'Book a 60-minute consultation')}</h3><p class="card__body">${tr('Phân tích hiện trạng và phác thảo lộ trình tăng trưởng, không ràng buộc.', 'A review and growth roadmap, no obligation.')}</p><a class="btn btn--sm" href="#/lien-he">${tr('Đặt lịch', 'Book now')}</a></div>
              <div class="card"><h3 style="font-size:1rem">${tr('Đọc tiếp', 'Read next')}</h3>${related.map((r) => `<a class="quick-channel" href="#/tin-tuc/${r.slug}">${icon('arrowRight')}<span>${esc(r.title)}</span></a>`).join('')}</div>
            </aside>
          </div>
        </div>
      </section>
    </main>`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { '@type': 'Organization', name: 'V-HUB' },
      publisher: { '@type': 'Organization', name: 'V-HUB' },
    },
  }
}

/* ---------- Về V-HUB ---------- */
export function renderAbout() {
  return {
    title: 'Về V-HUB — Hệ sinh thái VTV Nam Bộ',
    description: 'V-HUB là hệ thống MCN thương mại điện tử chính danh thuộc hệ sinh thái VTV Nam Bộ, tại 232/14 Võ Thị Sáu, TP.HCM. Câu chuyện, hệ sinh thái, đội ngũ, tuyển dụng và báo chí.',
    html: `<div class="page-hero page-hero--navy">
      <div class="container">
        ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Về V-HUB', 'About') }])}
        <div class="page-hero__inner page-hero__inner--split">
          <div class="page-hero__copy">
            <span class="kicker">${tr('Về V-HUB', 'About V-HUB')}</span>
            <h1>${tr('Trường quay của thương mại số Việt', 'The studio of Vietnamese digital commerce')}</h1>
            <p class="lede">${tr('V-HUB là hệ thống MCN thương mại điện tử chính danh thuộc hệ sinh thái VTV Nam Bộ. Chúng tôi làm một việc: đưa hàng Việt lên sóng một cách chuyên nghiệp và có trách nhiệm.', 'V-HUB is an e-commerce MCN within the VTV Nam Bộ ecosystem. We do one thing: put Vietnamese goods on air professionally and responsibly.')}</p>
            <div class="row" style="gap:10px"><a class="btn btn--on-dark" href="#/lien-he">${tr('Liên hệ V-HUB', 'Contact us')}</a><a class="btn btn--outline-light" href="#/studio">${tr('Tham quan studio', 'Visit the studio')}</a></div>
          </div>
          ${media({ label: tr('Ảnh thật: toà nhà 232/14 Võ Thị Sáu, TP.HCM', 'Real photo: 232/14 Vo Thi Sau, HCMC'), ratio: '4x3', dark: true })}
        </div>
      </div>
    </div>
    <main id="main">
      <section class="section">
        <div class="container">
          <div class="split split--7-5">
            <div class="stack">
              <span class="kicker">${tr('Câu chuyện', 'Our story')}</span>
              <h2>${tr('Một đầu mối lo trọn, thay vì nhiều nhà cung cấp rời rạc', 'One accountable partner instead of many vendors')}</h2>
              <p class="lede">${tr('Thị trường livestream bán hàng Việt Nam tăng nhanh nhưng thiếu chuẩn mực: người lên sóng chưa được xác minh, hạ tầng không đạt chuẩn, báo cáo không minh bạch. V-HUB ra đời để giải quyết đúng ba vấn đề đó.', 'Vietnam’s livestream commerce grows fast but lacks standards: unverified presenters, weak infrastructure and opaque reporting. V-HUB exists to fix those three things.')}</p>
              <p>${tr('Chúng tôi đặt trường quay tại trung tâm TP.HCM, xây nền tảng định danh KOCViet, đào tạo nhà sáng tạo và vận hành bán hàng đa tuyến. Mỗi phiên đều có người chịu trách nhiệm, có báo cáo và có dữ liệu để cải thiện.', 'We built studios in central HCMC, created the KOCViet verification platform, train creators and run multi-channel commerce. Every session has an accountable owner, a report and data to improve.')}</p>
              <div class="grid grid--3" style="gap:12px">
                <div class="card" style="gap:4px"><strong style="font-family:var(--font-heading);font-size:1.5rem;color:var(--primary-deep)">14</strong><span class="xsmall muted">${tr('studio theo biên bản ghi nhớ', 'studios in the MOU')}</span></div>
                <div class="card" style="gap:4px"><strong style="font-family:var(--font-heading);font-size:1.5rem;color:var(--primary-deep)">4</strong><span class="xsmall muted">${tr('khoá học tại trường quay', 'on-set courses')}</span></div>
                <div class="card" style="gap:4px"><strong style="font-family:var(--font-heading);font-size:1.5rem;color:var(--primary-deep)">10%</strong><span class="xsmall muted">${tr('doanh thu Chợ Phiên vào quỹ', 'of Market Days revenue to fund')}</span></div>
              </div>
            </div>
            <div class="stack">
              <h2>${tr('Ba giá trị', 'Three values')}</h2>
              ${[
                { title: 'Value — Giá trị thật', body: tr('Mỗi đồng chi ra phải đo được bằng doanh thu, đơn hàng hoặc năng lực được xây thêm.', 'Every dollar spent must be measurable in revenue, orders or capability built.') },
                { title: 'Innovate — Làm khác một cách có căn cứ', body: tr('AI, dữ liệu và quy trình mới chỉ được dùng khi giải quyết vấn đề thật.', 'AI, data and new processes are used only when they solve real problems.') },
                { title: 'Trust — Niềm tin phải chứng minh', body: tr('Định danh, sao kê quỹ và báo cáo công khai là cách chúng tôi chứng minh niềm tin.', 'Verification, fund statements and public reporting are how we earn trust.') },
              ]
                .map((v) => `<div class="card" style="gap:6px"><strong style="font-family:var(--font-heading)">${esc(v.title)}</strong><span class="small muted">${esc(v.body)}</span></div>`)
                .join('')}
            </div>
          </div>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container">
          ${sectionHead({ kicker: tr('Hệ sinh thái', 'Ecosystem'), title: tr('V-HUB nằm ở đâu trong hệ sinh thái VTV Nam Bộ', 'Where V-HUB sits in the VTV Nam Bộ ecosystem'), sub: tr('Sơ đồ tổ chức ở mức công khai. Logo đối tác chỉ được đưa lên khi có văn bản cho phép.', 'Public-level structure. Partner logos appear only with written permission.') })}
          <div class="grid grid--3">
            ${[
              { title: 'VTV Nam Bộ', body: tr('Bảo chứng nội dung, tiêu chuẩn phát sóng và hệ sinh thái truyền thông.', 'Content endorsement, broadcast standards and media ecosystem.'), icon: 'signal' },
              { title: 'V-HUB', body: tr('Đơn vị vận hành MCN: đào tạo, định danh, sản xuất, livestream và TMĐT đa tuyến.', 'The MCN operator: training, verification, production, livestream and multi-channel commerce.'), icon: 'brand' },
              { title: 'Đối tác', body: tr('Nhãn hàng, KOC, chủ thể OCOP, đơn vị vận chuyển và nền tảng thương mại điện tử.', 'Brands, creators, OCOP producers, logistics partners and e-commerce platforms.'), icon: 'link' },
            ]
              .map((n) => `<article class="card">${iconTile(n.icon, 'navy')}<h3 class="card__title">${esc(n.title)}</h3><p class="card__body">${esc(n.body)}</p><div class="logo-slot" style="margin-top:8px">${tr('Ô chờ logo', 'Logo slot')}</div></article>`)
              .join('')}
          </div>
          <p class="small muted mt-3">${tr('Việc sử dụng tên và logo VTV, VTV Nam Bộ và logo đối tác phải có văn bản cho phép trước khi công bố.', 'Use of VTV, VTV Nam Bộ and partner logos requires written permission before publication.')}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="split split--5-7">
            <div class="stack"><span class="kicker">${tr('Đội ngũ', 'Team')}</span><h2>${tr('Đội ngũ vận hành tại trường quay', 'The on-set operations team')}</h2><p class="lede">${tr('Đội ngũ gồm sản xuất, kỹ thuật, booking, đào tạo và vận hành sàn. Ảnh và hồ sơ lãnh đạo sẽ được cập nhật khi có tư liệu chính thức.', 'Production, engineering, booking, training and marketplace operations. Leadership photos and bios will be added when official assets are available.')}</p></div>
            <div class="grid grid--2" style="gap:12px">
              ${['Đội sản xuất', 'Đội kỹ thuật', 'Đội booking & KOC', 'Đội đào tạo'].map((t) => `<div class="card" style="padding:10px">${media({ label: `Ảnh thật: ${t}`, ratio: '4x3' })}<div style="padding:6px"><strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(t)}</strong></div></div>`).join('')}
            </div>
          </div>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container">
          <div class="grid grid--2">
            <div class="card" id="tuyen-dung">
              <span class="kicker">${tr('Tuyển dụng', 'Careers')}</span>
              <h2 style="font-size:var(--fs-h2)">${tr('Cùng xây trường quay này', 'Build this studio with us')}</h2>
              <p class="card__body">${tr('V-HUB tìm người làm sản xuất nội dung, kỹ thuật livestream, booking KOC và vận hành sàn. Ưu tiên người đã làm thực tế, chịu được nhịp phiên live.', 'We are hiring for content production, livestream engineering, creator booking and marketplace operations.')}</p>
              <div class="stack" style="gap:8px">
                ${[
                  tr('Chuyên viên sản xuất nội dung (Video AI)', 'Content producer (Video AI)'),
                  tr('Kỹ thuật viên livestream', 'Livestream engineer'),
                  tr('Chuyên viên booking KOC', 'Creator booking executive'),
                  tr('Chuyên viên vận hành sàn', 'Marketplace operations executive'),
                ].map((j) => `<div class="row row--between" style="gap:8px;border-bottom:1px solid var(--outline);padding-bottom:8px"><span class="small">${esc(j)}</span><span class="badge">${tr('Đang tuyển', 'Open')}</span></div>`).join('')}
              </div>
              <a class="btn btn--sm" href="${ORG.emailHref}?subject=Ứng tuyển V-HUB">${tr('Gửi CV qua email', 'Send your CV')}</a>
            </div>
            <div class="card" id="bao-chi">
              <span class="kicker">${tr('Báo chí', 'Press')}</span>
              <h2 style="font-size:var(--fs-h2)">${tr('Báo chí nói về V-HUB', 'Press coverage')}</h2>
              <p class="card__body">${tr('Danh sách bài báo sẽ được cập nhật khi có link chính thức. V-HUB không tự trích dẫn bài viết chưa được xác nhận.', 'Coverage will be listed once official links are available. We do not cite unconfirmed articles.')}</p>
              ${emptyState({ title: tr('Chưa có bài báo được xác nhận', 'No confirmed coverage yet'), text: tr('Liên hệ bộ phận truyền thông để nhận thông cáo và tư liệu hình ảnh.', 'Contact our communications team for releases and media assets.') })}
              <a class="btn btn--ghost btn--sm" href="${ORG.emailHref}?subject=Liên hệ báo chí V-HUB">${tr('Liên hệ báo chí', 'Press contact')}</a>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          ${sectionHead({ kicker: tr('Vì sao chọn V-HUB', 'Why V-HUB'), title: tr('Sáu lý do, một cam kết', 'Six reasons, one commitment') })}
          <div class="grid grid--3">
            ${REASONS.map((r) => `<article class="card">${iconTile(r.icon)}<h3 class="card__title">${esc(r.title)}</h3><p class="card__body">${esc(r.body)}</p></article>`).join('')}
          </div>
        </div>
      </section>
      <section class="section section--tight cta-band">
        <div class="container">
          <div class="cta-band__inner">
            <div class="stack"><span class="kicker">${tr('Liên hệ', 'Contact')}</span><h2>${tr('Đến thăm trường quay', 'Visit the studio')}</h2><p class="lede">${esc(ORG.address)}<br />${esc(ORG.hours)} · ${esc(ORG.hotline)}</p></div>
            <div class="card" style="background:var(--surface)">${leadFormMarkup({ id: 'about-lead', compact: true })}</div>
          </div>
        </div>
      </section>
    </main>`,
  }
}
