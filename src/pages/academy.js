/** Học viện V-HUB: danh sách khoá, chi tiết khoá, lộ trình, đầu ra. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ORG } from '../lib/catalog-site.js'
import { COURSES, LEARNING_PATH, ACADEMY_OUTCOMES, getCourse, courseSlug } from '../lib/catalog-academy.js'
import { media, sectionHead, iconTile, badgeDemo, breadcrumb, accordion } from '../components/ui.js'
import { leadFormMarkup } from '../components/forms.js'

const STATUS_LABEL = () => ({
  open: tr('Còn chỗ', 'Open'),
  almost: tr('Sắp đầy', 'Almost full'),
  full: tr('Đã đầy', 'Full'),
  past: tr('Đã khai giảng', 'Started'),
})

function courseCard(c) {
  return `<article class="course-card">
    <div class="row row--between"><span class="badge badge--primary">${esc(c.duration)} · ${c.hours} ${tr('giờ', 'hours')}</span>${c.feeLabel === 'Liên hệ' ? `<span class="badge">${tr('Học phí liên hệ', 'Fee on request')}</span>` : ''}</div>
    <h3>${esc(c.title)}</h3>
    <p class="card__body">${esc(c.summary)}</p>
    <div class="course-card__fee">${esc(c.feeLabel)}</div>
    <div class="course-card__meta"><span>${esc(c.format.split(',')[0])}</span>${c.startDates[0] ? `<span>${tr('Khai giảng', 'Starts')} ${esc(c.startDates[0].label)}</span>` : ''}</div>
    <a class="btn btn--ghost btn--sm" href="#/hoc-vien/${courseSlug(c.title)}">${tr('Xem khoá học', 'View course')}${icon('arrowRight', 'btn__icon')}</a>
  </article>`
}

function listPage() {
  return `<div class="page-hero page-hero--navy">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Học viện', 'Academy') }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${tr('Học viện V-HUB', 'V-HUB Academy')}</span>
          <h1>${tr('Học tại trường quay, thực hành với nhãn hàng thật', 'Learn on set, practise with real brands')}</h1>
          <p class="lede">${tr('Bốn khoá do VTV Nam Bộ chủ trì, học trực tiếp tại V-HUB. Lộ trình rõ: Video AI → TVC AI hoặc Phim AI; Livestream học song song.', 'Four courses chaired by VTV Nam Bộ, taught on site at V-HUB. A clear path: Video AI → TVC AI or Film AI, with Livestream in parallel.')}</p>
          <div class="row" style="gap:10px"><a class="btn btn--on-dark" href="#khoa-hoc">${tr('Xem khoá học', 'View courses')}${icon('arrowRight', 'btn__icon')}</a><a class="btn btn--outline-light" href="#tu-van-hoc">${tr('Đăng ký tư vấn', 'Request advice')}</a></div>
        </div>
        ${media({ label: tr('Ảnh thật: lớp học tại trường quay V-HUB', 'Real photo: class at V-HUB studio'), ratio: '4x3', dark: true })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        ${sectionHead({ kicker: tr('Lộ trình', 'Learning path'), title: tr('Học theo lộ trình, không học rời rạc', 'A path, not isolated classes'), sub: tr('Bắt đầu từ Video AI, rẽ nhánh theo mục tiêu nghề nghiệp. Livestream học song song để vận hành phiên thực tế.', 'Start with Video AI, then branch by goal. Livestream runs in parallel for real operations.') })}
        <div class="path-rail">
          ${LEARNING_PATH.map(
            (p) => `<a class="card card--link" href="${esc(p.href)}" style="gap:8px">
              <span class="badge badge--primary">${tr('Bước', 'Step')} ${p.step}</span>
              <h3 style="font-size:1.125rem">${esc(p.title)}</h3>
              <p class="card__body">${esc(p.body)}</p>
              <span class="link-chip">${tr('Xem khoá', 'View course')} ${icon('arrowRight')}</span>
            </a>`,
          ).join('')}
        </div>
      </div>
    </section>
    <section class="section section--alt" id="khoa-hoc">
      <div class="container">
        ${sectionHead({ kicker: tr('Khoá học', 'Courses'), title: tr('Bốn khoá học tại V-HUB', 'Four courses at V-HUB'), sub: tr('Học phí và thời lượng theo quy định của VTV Nam Bộ. Lịch khai giảng cập nhật trong từng khoá.', 'Fees and duration follow VTV Nam Bộ standards. Start dates are listed per course.') })}
        <div class="grid grid--4">${COURSES.map(courseCard).join('')}</div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack"><span class="kicker">${tr('Đầu ra', 'Outcomes')}</span><h2>${tr('Sau khoá học, bạn có gì?', 'What do you leave with?')}</h2><p class="lede">${tr('Không chỉ kiến thức: sản phẩm hoàn chỉnh, hồ sơ định danh và kết nối với đội sản xuất V-HUB.', 'Not just knowledge: finished work, a verification profile and connections to the V-HUB production team.')}</p></div>
          <div class="grid grid--1" style="gap:12px">${ACADEMY_OUTCOMES.map((o) => `<div class="card" style="flex-direction:row;gap:12px;align-items:flex-start">${iconTile('check')}<div><strong style="font-family:var(--font-heading);display:block">${esc(o.title)}</strong><span class="small muted">${esc(o.body)}</span></div></div>`).join('')}</div>
        </div>
        <p class="note-box mt-4">${tr('Học viên dưới 18 tuổi cần cha mẹ hoặc người giám hộ đăng ký cùng.', 'Students under 18 must register with a parent or guardian.')}</p>
      </div>
    </section>
    <section class="section cta-band" id="tu-van-hoc">
      <div class="container">
        <div class="cta-band__inner">
          <div class="stack"><span class="kicker">${tr('Tư vấn', 'Advice')}</span><h2>${tr('Đăng ký tư vấn khoá học', 'Request course advice')}</h2><p class="lede">${tr('Cho chúng tôi biết mục tiêu của bạn, V-HUB gợi ý lộ trình và lịch khai giảng phù hợp.', 'Tell us your goal and we will suggest a path and start date.')}</p><div class="row" style="gap:10px"><a class="btn btn--ghost" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${esc(ORG.hotline)}</span></a><a class="btn btn--ghost" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>Zalo OA</span></a></div></div>
          <div class="card" style="background:var(--surface)">${leadFormMarkup({ id: 'academy-lead', presetAudience: 'hoc-vien', submitLabel: tr('Đăng ký tư vấn', 'Request advice') })}</div>
        </div>
      </div>
    </section>
  </main>`
}

function detailPage(c) {
  const related = COURSES.filter((x) => x.title !== c.title).slice(0, 3)
  return `<div class="page-hero">
    <div class="container">
      ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Học viện', 'Academy'), href: '#/hoc-vien' }, { label: c.title }])}
      <div class="page-hero__inner page-hero__inner--split">
        <div class="page-hero__copy">
          <span class="kicker">${tr('Khoá học', 'Course')}</span>
          <h1>${esc(c.title)}</h1>
          <p class="lede">${esc(c.summary)}</p>
          <div class="row" style="gap:8px"><span class="badge badge--primary">${esc(c.duration)}</span><span class="badge">${c.hours} ${tr('giờ', 'hours')}</span><span class="badge">${esc(c.feeLabel)}</span></div>
          <div class="row" style="gap:10px"><a class="btn" href="#dang-ky">${tr('Đăng ký tư vấn', 'Request advice')}${icon('arrowRight', 'btn__icon')}</a><a class="btn btn--ghost" href="#/hoc-vien">${tr('Tất cả khoá học', 'All courses')}</a></div>
        </div>
        ${media({ label: `Ảnh thật: lớp ${c.title} tại V-HUB`, ratio: '4x3' })}
      </div>
    </div>
  </div>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div class="stack">
            <h2>${tr('Nội dung từng buổi', 'Session-by-session')}</h2>
            ${accordion(c.sessions.map((s) => ({ title: s.title, body: `<p>${esc(s.body)}</p>` })), 'course-sessions')}
            <h2 style="margin-top:16px">${tr('Sản phẩm đầu ra', 'Deliverables')}</h2>
            <ul class="plan__list">${c.outputs.map((o) => `<li>${icon('check')}<span>${esc(o)}</span></li>`).join('')}</ul>
            <h2 style="margin-top:16px">${tr('Giảng viên', 'Instructors')}</h2>
            <div class="grid grid--2" style="gap:12px">${c.instructors.map((i) => `<div class="card card--flat" style="gap:4px"><strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(i.name)}</strong><span class="xsmall" style="color:var(--primary-deep)">${esc(i.role)}</span><span class="small muted">${esc(i.note)}</span></div>`).join('')}</div>
          </div>
          <div class="stack">
            <div class="summary-card">
              <h3 style="font-size:1rem">${tr('Thông tin chung', 'Key facts')}</h3>
              <div class="spec-list">
                <div><span class="spec-label">${tr('Thời lượng', 'Duration')}</span><span class="spec-value">${esc(c.duration)} · ${c.hours} ${tr('giờ', 'hours')}</span></div>
                <div><span class="spec-label">${tr('Hình thức', 'Format')}</span><span class="spec-value">${tr('Trực tiếp tại V-HUB', 'On site at V-HUB')}</span></div>
                <div><span class="spec-label">${tr('Đối tượng', 'Audience')}</span><span class="spec-value">${esc(c.audience)}</span></div>
                <div><span class="spec-label">${tr('Học phí', 'Fee')}</span><span class="spec-value">${esc(c.feeLabel)}</span></div>
              </div>
              ${c.feeNote ? `<p class="xsmall muted">${esc(c.feeNote)}</p>` : ''}
              <a class="btn btn--block" href="#dang-ky">${tr('Đăng ký tư vấn', 'Request advice')}</a>
            </div>
            <div class="card" style="gap:8px">
              <h3 style="font-size:1rem">${tr('Lịch khai giảng', 'Start dates')}</h3>
              <div class="stack" style="gap:8px">
                ${c.startDates
                  .map(
                    (d) => `<div class="row row--between" style="gap:8px;border-bottom:1px solid var(--outline);padding-bottom:8px">
                      <div><strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(d.label)}</strong><div class="xsmall muted">${esc(d.seats)}</div></div>
                      <span class="badge ${d.status === 'almost' ? 'badge--warning' : d.status === 'open' ? 'badge--verified' : ''}">${esc(STATUS_LABEL()[d.status] || d.status)}</span>
                    </div>`,
                  )
                  .join('')}
              </div>
            </div>
            <div class="card" style="gap:8px">
              <h3 style="font-size:1rem">${tr('Điều kiện tham gia', 'Prerequisites')}</h3>
              <ul class="plan__list">${c.prerequisites.map((p) => `<li>${icon('check')}<span>${esc(p)}</span></li>`).join('')}</ul>
              ${c.showNote ? `<p class="note-box">${esc(c.showNote)}</p>` : ''}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Showcase', 'Showcase'), title: tr('Sản phẩm học viên', 'Student work'), sub: tr('Sản phẩm cuối khoá được trình chiếu tại V-HUB và đăng trên kênh của học viên.', 'Final projects are screened at V-HUB and published on student channels.'), action: badgeDemo(tr('Đang chờ tư liệu thật', 'Real assets pending')) })}
        <div class="grid grid--3">${[1, 2, 3].map((i) => media({ label: `Ảnh/video thật: sản phẩm học viên ${i}`, ratio: '16x9' })).join('')}</div>
      </div>
    </section>
    <section class="section" id="dang-ky">
      <div class="container">
        <div class="split split--5-7">
          <div class="stack"><span class="kicker">${tr('Đăng ký', 'Register')}</span><h2>${tr('Đăng ký tư vấn khoá', 'Request course advice')} ${esc(c.title)}</h2><p class="lede">${tr('Để lại thông tin, V-HUB gọi tư vấn lộ trình và lịch khai giảng phù hợp.', 'Leave your details and we will call with a path and start date.')}</p><p class="note-box">${esc(c.showNote || '')}</p></div>
          <div class="card">${leadFormMarkup({ id: `course-lead-${courseSlug(c.title)}`, presetAudience: 'hoc-vien', submitLabel: tr('Đăng ký tư vấn', 'Request advice') })}</div>
        </div>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ kicker: tr('Liên quan', 'Related'), title: tr('Khoá học khác', 'Other courses') })}
        <div class="grid grid--3">${related.map(courseCard).join('')}</div>
      </div>
    </section>
  </main>`
}

export function render(ctx) {
  const slug = ctx.segments[1]
  if (!slug) {
    return {
      title: 'Học viện V-HUB — Học tại trường quay, thực hành với nhãn hàng thật',
      description: 'Khoá học Video AI (8 triệu), TVC AI (11 triệu), Phim AI (13 triệu) và Livestream bán hàng tại V-HUB, do VTV Nam Bộ chủ trì.',
      html: listPage(),
    }
  }
  const course = getCourse(slug)
  if (!course) return null
  return {
    title: `${course.title} — Học viện V-HUB`,
    description: `${course.summary} ${course.duration}, ${course.hours} giờ, học phí ${course.feeLabel}.`,
    html: detailPage(course),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.summary,
      provider: { '@type': 'Organization', name: 'V-HUB — VTV Nam Bộ', sameAs: 'https://vhub.vn/' },
      offers: { '@type': 'Offer', priceCurrency: 'VND', price: course.feeLabel === 'Liên hệ' ? undefined : Number(course.feeLabel.replace(/[^\d]/g, '')), category: 'Vocational' },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'onsite',
        courseWorkload: `PT${course.hours}H`,
        location: { '@type': 'Place', name: 'V-HUB Studio', address: '232/14 Võ Thị Sáu, TP.HCM' },
      },
    },
  }
}
