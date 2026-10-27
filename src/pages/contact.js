/** Liên hệ, chính sách bảo mật, điều khoản, trang cảm ơn và 404. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ORG, AUDIENCES } from '../lib/catalog-site.js'
import { iconTile, breadcrumb } from '../components/ui.js'
import { leadFormMarkup } from '../components/forms.js'

export function renderContact(ctx) {
  const preset = (ctx.query.get('audience') || '').replace(/[^a-z-]/g, '')
  const pkg = (ctx.query.get('goi') || '').replace(/[^A-E]/g, '')
  return {
    title: 'Liên hệ V-HUB — Đặt lịch tư vấn 60 phút',
    description: 'Liên hệ V-HUB: 232/14 Võ Thị Sáu, phường Xuân Hòa, TP.HCM. Hotline 028 7300 8686. Đặt lịch tư vấn 60 phút, phản hồi trong 15 phút giờ hành chính.',
    html: `<div class="page-hero">
      <div class="container">
        ${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Liên hệ', 'Contact') }])}
        <div class="page-hero__inner page-hero__inner--split">
          <div class="page-hero__copy">
            <span class="kicker">${tr('Liên hệ', 'Contact')}</span>
            <h1>${tr('Đặt lịch tư vấn 60 phút', 'Book a 60-minute consultation')}</h1>
            <p class="lede">${tr('Phân tích hiện trạng và phác thảo lộ trình tăng trưởng, không ràng buộc. V-HUB phản hồi trong 15 phút giờ hành chính.', 'We review your situation and outline a growth plan — no obligation. We reply within 15 minutes during office hours.')}</p>
            <div class="spec-list" style="max-width:480px">
              <div><span class="spec-label">${tr('Hotline', 'Hotline')}</span><span class="spec-value"><a href="${ORG.hotlineHref}">${esc(ORG.hotline)}</a></span></div>
              <div><span class="spec-label">Email</span><span class="spec-value"><a href="${ORG.emailHref}">${esc(ORG.email)}</a></span></div>
              <div><span class="spec-label">${tr('Địa chỉ', 'Address')}</span><span class="spec-value">${esc(ORG.address)}</span></div>
              <div><span class="spec-label">${tr('Giờ làm việc', 'Hours')}</span><span class="spec-value">${esc(ORG.hours)}</span></div>
            </div>
            <div class="row" style="gap:10px">
              <a class="btn btn--ghost" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>Zalo OA</span></a>
              <a class="btn btn--ghost" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${tr('Gọi ngay', 'Call now')}</span></a>
            </div>
          </div>
          <div class="card" id="form-lien-he">
            <h2 style="font-size:1.125rem">${tr('Để lại thông tin', 'Leave your details')}</h2>
            ${pkg ? `<p class="small muted">${tr('Bạn đang quan tâm gói', 'You are interested in package')} <strong>${esc(pkg)}</strong>.</p>` : ''}
            ${leadFormMarkup({ id: 'contact-lead', presetAudience: preset || '' })}
          </div>
        </div>
      </div>
    </div>
    <main id="main">
      <section class="section section--tight">
        <div class="container">
          <div class="grid grid--3">
            ${[
              { icon: 'pin', title: tr('Đến trực tiếp', 'Visit us'), body: `${ORG.address}<br />${tr('Bãi xe toà nhà, cổng Võ Thị Sáu', 'Building parking, Vo Thi Sau entrance')}`, href: ORG.mapEmbed.replace('&output=embed', ''), label: tr('Xem bản đồ', 'Open map') },
              { icon: 'phone', title: tr('Gọi điện', 'Call'), body: `${ORG.hotline}<br />${ORG.hours}`, href: ORG.hotlineHref, label: tr('Gọi hotline', 'Call now') },
              { icon: 'zalo', title: 'Zalo OA', body: tr('Nhắn tin để nhận lịch live, báo giá và hỗ trợ nhanh.', 'Message us for schedules, quotes and quick support.'), href: ORG.zalo, label: tr('Mở Zalo', 'Open Zalo') },
            ]
              .map(
                (c) => `<article class="card">${iconTile(c.icon)}<h2 class="card__title">${esc(c.title)}</h2><p class="card__body">${esc(c.body)}</p><a class="link-chip" href="${esc(c.href)}" ${c.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${esc(c.label)} ${icon('arrowUpRight')}</a></article>`,
              )
              .join('')}
          </div>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container">
          <div class="split split--7-5">
            <div class="footer__map" style="border-color:var(--outline);min-height:320px"><iframe src="${esc(ORG.mapEmbed)}" title="Bản đồ V-HUB — 232/14 Võ Thị Sáu, TP.HCM" loading="lazy"></iframe></div>
            <div class="stack">
              <span class="kicker">${tr('Đến V-HUB', 'Getting here')}</span>
              <h2>${tr('Hướng dẫn đến trường quay', 'Directions to the studio')}</h2>
              <ul class="plan__list">
                <li>${icon('check')}<span>${tr('Từ trung tâm Quận 1: 15 phút theo Võ Thị Sáu, rẽ vào hẻm 232/14.', 'From District 1: 15 minutes via Vo Thi Sau, turn into alley 232/14.')}</span></li>
                <li>${icon('check')}<span>${tr('Gửi xe tại bãi toà nhà, báo lễ tân “V-HUB Studio”.', 'Park in the building lot and tell reception “V-HUB Studio”.')}</span></li>
                <li>${icon('check')}<span>${tr('Vui lòng có mặt trước 15 phút nếu có lịch thuê studio.', 'Please arrive 15 minutes early for studio bookings.')}</span></li>
              </ul>
              <a class="btn btn--ghost btn--sm" href="#/studio#tham-quan-360">${tr('Tham quan 360° trước', 'Take a 360° tour first')}</a>
            </div>
          </div>
        </div>
      </section>
    </main>`,
  }
}

export function renderPrivacy() {
  return {
    title: 'Chính sách bảo mật — V-HUB',
    description: 'Chính sách bảo mật và xử lý dữ liệu cá nhân của V-HUB theo Nghị định 13/2023/NĐ-CP.',
    html: `<div class="page-hero"><div class="container">${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Chính sách bảo mật', 'Privacy policy') }])}<div class="stack" style="max-width:760px"><span class="kicker">${tr('Pháp lý', 'Legal')}</span><h1>${tr('Chính sách bảo mật', 'Privacy policy')}</h1><p class="lede">${tr('Cập nhật lần cuối: 26/10/2026. Chính sách này giải thích V-HUB thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn như thế nào.', 'Last updated 26 October 2026. This policy explains how V-HUB collects, uses and protects personal data.')}</p><p class="note-box">${tr('Bản này là bản mẫu kỹ thuật, cần được bộ phận pháp lý rà soát trước khi công bố chính thức.', 'This is a technical template and must be reviewed by legal counsel before official publication.')}</p></div></div></div>
    <main id="main"><section class="section"><div class="container"><div class="split split--5-7"><nav class="toc" aria-label="${tr('Mục lục', 'Contents')}"><strong>${tr('Mục lục', 'Contents')}</strong><a href="#muc-1">1. ${tr('Đơn vị xử lý dữ liệu', 'Data controller')}</a><a href="#muc-2">2. ${tr('Dữ liệu chúng tôi thu thập', 'Data we collect')}</a><a href="#muc-3">3. ${tr('Mục đích xử lý', 'Purposes')}</a><a href="#muc-4">4. ${tr('Lưu trữ và bảo mật', 'Storage and security')}</a><a href="#muc-5">5. ${tr('Chia sẻ dữ liệu', 'Sharing')}</a><a href="#muc-6">6. ${tr('Quyền của bạn', 'Your rights')}</a><a href="#muc-7">7. ${tr('Liên hệ', 'Contact')}</a></nav>
      <article class="prose">
        <h2 id="muc-1">1. ${tr('Đơn vị xử lý dữ liệu', 'Data controller')}</h2>
        <p>${esc(ORG.legalName)} — ${esc(ORG.address)}. Email: ${esc(ORG.email)} · Hotline: ${esc(ORG.hotline)}.</p>
        <h2 id="muc-2">2. ${tr('Dữ liệu chúng tôi thu thập', 'Data we collect')}</h2>
        <ul>
          <li>${tr('Thông tin bạn tự cung cấp qua biểu mẫu: họ tên, số điện thoại, email, công ty, nhu cầu, ngân sách dự kiến.', 'Information you submit: name, phone, email, company, needs, budget.')}</li>
          <li>${tr('Thông tin đặt lịch studio: studio, ngày giờ, gói dịch vụ, ghi chú kỹ thuật.', 'Studio booking details: studio, date and time, package, technical notes.')}</li>
          <li>${tr('Dữ liệu kỹ thuật: trình duyệt, thiết bị, trang nguồn và tham số UTM dùng để đo hiệu quả kênh.', 'Technical data: browser, device, referring page and UTM parameters.')}</li>
          <li>${tr('Nội dung trao đổi với trợ lý tư vấn (nếu bạn sử dụng).', 'Messages exchanged with the advisory assistant, if used.')}</li>
        </ul>
        <h2 id="muc-3">3. ${tr('Mục đích xử lý', 'Purposes')}</h2>
        <ul>
          <li>${tr('Liên hệ, tư vấn và gửi đề xuất dịch vụ theo yêu cầu của bạn.', 'Contacting you, advising and sending proposals you request.')}</li>
          <li>${tr('Xác nhận và vận hành lịch thuê studio, lịch booking KOC.', 'Confirming and operating studio rentals and creator bookings.')}</li>
          <li>${tr('Đo lường hiệu quả truyền thông và cải thiện chất lượng dịch vụ.', 'Measuring marketing effectiveness and improving services.')}</li>
          <li>${tr('Tuân thủ nghĩa vụ pháp lý về kế toán, thuế và lưu trữ.', 'Complying with accounting, tax and record-keeping obligations.')}</li>
        </ul>
        <h2 id="muc-4">4. ${tr('Lưu trữ và bảo mật', 'Storage and security')}</h2>
        <p>${tr('Dữ liệu được lưu trên hạ tầng đám mây có mã hoá đường truyền. Quyền truy cập được giới hạn cho nhân sự vận hành và quản trị. Thời gian lưu: tối đa 24 tháng kể từ lần tương tác cuối, trừ khi pháp luật yêu cầu lâu hơn.', 'Data is stored on cloud infrastructure with encrypted transport. Access is limited to operations and admin staff. Retention: up to 24 months from the last interaction unless law requires longer.')}</p>
        <h2 id="muc-5">5. ${tr('Chia sẻ dữ liệu', 'Sharing')}</h2>
        <p>${tr('V-HUB không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ với: đơn vị vận hành nền tảng website, nhà cung cấp dịch vụ email/CRM khi cần gửi thông tin bạn yêu cầu, và cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp.', 'V-HUB does not sell personal data. Data is shared only with our website platform operator, email/CRM providers when needed to send requested information, and competent authorities upon lawful request.')}</p>
        <h2 id="muc-6">6. ${tr('Quyền của bạn', 'Your rights')}</h2>
        <p>${tr('Bạn có quyền truy cập, chỉnh sửa, xoá, hạn chế xử lý, phản đối xử lý và rút lại sự đồng ý. Gửi yêu cầu tới', 'You may access, correct, delete, restrict or object to processing and withdraw consent. Send requests to')} <a href="${ORG.emailHref}">${esc(ORG.email)}</a>. ${tr('V-HUB phản hồi trong 72 giờ làm việc.', 'We respond within 72 working hours.')}</p>
        <h2 id="muc-7">7. ${tr('Liên hệ', 'Contact')}</h2>
        <p>${esc(ORG.legalName)} · ${esc(ORG.address)} · ${esc(ORG.email)} · ${esc(ORG.hotline)}</p>
      </article></div></div></section></main>`,
  }
}

export function renderTerms() {
  return {
    title: 'Điều khoản sử dụng — V-HUB',
    description: 'Điều khoản sử dụng website, dịch vụ tư vấn, đặt lịch studio và booking KOC của V-HUB.',
    html: `<div class="page-hero"><div class="container">${breadcrumb([{ label: 'Trang chủ', href: '#/' }, { label: tr('Điều khoản sử dụng', 'Terms of use') }])}<div class="stack" style="max-width:760px"><span class="kicker">${tr('Pháp lý', 'Legal')}</span><h1>${tr('Điều khoản sử dụng', 'Terms of use')}</h1><p class="lede">${tr('Cập nhật lần cuối: 26/10/2026. Khi sử dụng website và dịch vụ của V-HUB, bạn đồng ý với các điều khoản dưới đây.', 'Last updated 26 October 2026. By using V-HUB’s website and services you agree to these terms.')}</p><p class="note-box">${tr('Bản mẫu kỹ thuật, cần bộ phận pháp lý rà soát trước khi công bố chính thức.', 'Technical template requiring legal review before official publication.')}</p></div></div></div>
    <main id="main"><section class="section"><div class="container"><article class="prose" style="margin-inline:auto">
      <h2>1. ${tr('Phạm vi', 'Scope')}</h2>
      <p>${tr('Website cung cấp thông tin về dịch vụ MCN, livestream, studio, đào tạo, KOCViet và Chợ Phiên Phương Nam; cho phép gửi yêu cầu tư vấn và đặt lịch studio.', 'This website provides information about MCN, livestream, studio, training, KOCViet and Southern Market Days services, and allows consultation requests and studio bookings.')}</p>
      <h2>2. ${tr('Đặt lịch và xác nhận', 'Bookings and confirmation')}</h2>
      <p>${tr('Yêu cầu đặt lịch studio là đề nghị, chưa phải hợp đồng. V-HUB xác nhận qua điện thoại; lịch chỉ có hiệu lực sau khi hai bên xác nhận và (nếu cần) đặt cọc. Hệ thống chặn trùng lịch nhưng không bảo đảm giữ chỗ nếu bạn không phản hồi trong 24 giờ.', 'Studio booking requests are offers, not contracts. V-HUB confirms by phone; a booking is valid only after mutual confirmation and, where required, deposit. The system blocks conflicts but does not hold slots beyond 24 hours without a response.')}</p>
      <h2>3. ${tr('Huỷ và hoàn tiền', 'Cancellation and refunds')}</h2>
      <p>${tr('Huỷ trước 48 giờ: miễn phí. Trong vòng 48 giờ: giữ 50% giá trị hoặc đổi sang ca còn trống. Không hoàn tiền với ca đã bắt đầu.', 'Free cancellation up to 48 hours ahead. Within 48 hours, 50% is retained or you may rebook an available slot. No refunds once a session starts.')}</p>
      <h2>4. ${tr('Nội dung và thương hiệu', 'Content and brand')}</h2>
      <p>${tr('Việc sử dụng tên, logo VTV, VTV Nam Bộ và logo đối tác phải có văn bản cho phép. Nội dung do V-HUB sản xuất được bàn giao theo phạm vi ghi trong hợp đồng; các trường hợp khác cần thoả thuận riêng bằng văn bản.', 'Use of VTV, VTV Nam Bộ and partner names or logos requires written permission. Content produced by V-HUB is delivered per the contract scope; other uses require separate written agreement.')}</p>
      <h2>5. ${tr('Số liệu công bố', 'Published figures')}</h2>
      <p>${tr('Số liệu trên website mang tính minh hoạ hoặc tham khảo và được ghi rõ. V-HUB không cam kết doanh số trừ khi có thoả thuận riêng trong hợp đồng. Kết quả thực tế phụ thuộc sản phẩm, giá, tồn kho và nguồn lực của khách hàng.', 'Figures on this website are illustrative or indicative and labelled as such. V-HUB does not guarantee sales unless expressly agreed in a contract. Results depend on product, pricing, stock and client resources.')}</p>
      <h2>6. ${tr('Trách nhiệm', 'Liability')}</h2>
      <p>${tr('V-HUB không chịu trách nhiệm với thiệt hại gián tiếp, mất lợi nhuận hoặc mất dữ liệu phát sinh ngoài phạm vi hợp đồng. Trách nhiệm tối đa không vượt quá giá trị dịch vụ đã thanh toán cho hạng mục liên quan.', 'V-HUB is not liable for indirect damages, lost profits or data loss outside the contract scope. Maximum liability does not exceed the fees paid for the relevant service.')}</p>
      <h2>7. ${tr('Liên hệ', 'Contact')}</h2>
      <p>${esc(ORG.legalName)} · ${esc(ORG.address)} · ${esc(ORG.email)} · ${esc(ORG.hotline)}</p>
      <p class="small muted">${tr('Điều khoản được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp được giải quyết tại toà án có thẩm quyền tại TP.HCM.', 'These terms are governed by Vietnamese law. Disputes are resolved by the competent court in Ho Chi Minh City.')}</p>
    </article></div></section></main>`,
  }
}

export function renderThanks(ctx) {
  const type = ctx.query.get('type') || ''
  const label = AUDIENCES.find((a) => a.id === type)?.title || tr('Quý khách', 'you')
  return {
    title: 'Cảm ơn bạn đã liên hệ V-HUB',
    description: 'V-HUB đã nhận thông tin và sẽ phản hồi trong 15 phút giờ hành chính.',
    html: `<main id="main"><div class="container"><div class="thanks">
      <span class="thanks__icon">${icon('check')}</span>
      <span class="kicker">${tr('Đã gửi thành công', 'Submitted')}</span>
      <h1>${tr('Cảm ơn bạn, V-HUB đã nhận thông tin', 'Thank you — we have your details')}</h1>
      <p class="lede">${tr('Đội ngũ V-HUB sẽ liên hệ trong 15 phút giờ hành chính. Nếu cần gấp, gọi hotline hoặc nhắn Zalo OA.', 'Our team will contact you within 15 minutes during office hours. For urgent matters, call or message us on Zalo.')}</p>
      <div class="row" style="gap:10px">
        <a class="btn" href="${ORG.zalo}" target="_blank" rel="noopener">${icon('zalo', 'btn__icon')}<span>${tr('Chat Zalo OA', 'Chat on Zalo')}</span></a>
        <a class="btn btn--ghost" href="${ORG.hotlineHref}">${icon('phone', 'btn__icon')}<span>${esc(ORG.hotline)}</span></a>
      </div>
      <div class="divider"></div>
      <h2 style="font-size:var(--fs-h3)">${tr('Trong lúc chờ, bạn có thể xem', 'While you wait')}</h2>
      <div class="grid grid--3" style="width:100%">
        ${[
          { href: '#/studio', label: tr('Studio & bảng giá', 'Studios & rates'), icon: 'camera' },
          { href: '#/cho-phien', label: tr('Chợ Phiên Phương Nam', 'Southern Market Days'), icon: 'heart' },
          { href: '#/hoc-vien', label: tr('Học viện V-HUB', 'V-HUB Academy'), icon: 'academy' },
        ]
          .map((c) => `<a class="card card--link" href="${c.href}" style="gap:8px">${iconTile(c.icon)}<strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(c.label)}</strong></a>`)
          .join('')}
      </div>
      <p class="small muted">${tr('Thông tin bạn gửi được xử lý theo', 'Your data is processed per our')} <a href="#/chinh-sach-bao-mat">${tr('Chính sách bảo mật', 'Privacy Policy')}</a>. ${esc(label ? `(${label})` : '')}</p>
    </div></div></main>`,
  }
}

export function render404() {
  return {
    title: 'Trang này đã tắt sóng — V-HUB',
    description: 'Không tìm thấy trang. Vui lòng quay về trang chủ hoặc chọn một trong bốn cửa vào của V-HUB.',
    html: `<main id="main"><div class="container"><div class="nf">
      <span class="nf__code">404</span>
      <h1>${tr('Trang này đã tắt sóng', 'This page is off air')}</h1>
      <p class="lede" style="text-align:center">${tr('Đường dẫn không tồn tại hoặc đã được thay đổi. Chọn một cửa vào bên dưới để tiếp tục.', 'The link does not exist or has changed. Choose one of the paths below.')}</p>
      <a class="btn" href="#/">${tr('Về trang chủ', 'Back to home')}${icon('arrowRight', 'btn__icon')}</a>
      <div class="grid grid--2" style="width:100%;max-width:720px;margin-top:16px">
        ${AUDIENCES.slice(0, 4)
          .map((a) => `<a class="card card--link" href="${esc(a.href)}" style="gap:8px">${iconTile(a.icon)}<strong style="font-family:var(--font-heading);font-size:.9375rem">${esc(a.title)}</strong><span class="small muted">${esc(a.short)}</span></a>`)
          .join('')}
      </div>
      <p class="small muted">${tr('Bạn cần hỗ trợ? Gọi', 'Need help? Call')} <a href="${ORG.hotlineHref}">${esc(ORG.hotline)}</a></p>
    </div></div></main>`,
  }
}
