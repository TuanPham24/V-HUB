/**
 * Khối kết quả của công cụ ước tính chi phí livestream.
 * Tách riêng khỏi `estimator.js` để file điều khiển wizard gọn và dễ đọc hơn.
 * Nhận `state` (không giữ tham chiếu module) để dễ kiểm thử.
 */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ESTIMATOR_CONFIG, estimateLiveCost } from '../lib/catalog-estimator.js'
import { formatCurrency } from '../lib/format.js'
import { leadFormMarkup } from './forms.js'

/**
 * @param {{industry:string, priceBand:string, hours:number, needKol:boolean, megalive:number}} state
 * @returns {string} HTML khối kết quả (khung chi phí, gói gợi ý, form nhận đề xuất)
 */
export function estimateResultBlock(state) {  const estimate = estimateLiveCost(state)
  return `<div class="stack">
    <span class="kicker">${tr('Kết quả ước tính', 'Your estimate')}</span>
    <h3 style="font-size:var(--fs-h2)">${formatCurrency(estimate.rangeMin)} – ${formatCurrency(estimate.rangeMax)}</h3>
    <p class="small muted">${tr('Khung chi phí tham khảo cho', 'Reference range for')} ${estimate.hours} ${tr('giờ live/tháng', 'live hours/month')}, ${esc(estimate.industry.label.toLowerCase())}.</p>
    <div class="summary-card" style="box-shadow:none">
      ${estimate.lines.map((l) => `<div class="summary-line"><span>${esc(l.label)}</span><strong>${formatCurrency(l.amount)}</strong></div>`).join('')}
      <div class="summary-line"><span>${tr('Tạm tính', 'Subtotal')}</span><strong>${formatCurrency(estimate.subtotal)}</strong></div>
      <div class="summary-line"><span>VAT 8%</span><strong>${formatCurrency(estimate.vat)}</strong></div>
      <div class="summary-total"><span>${tr('Tổng ước tính', 'Estimated total')}</span><strong>${formatCurrency(estimate.total)}</strong></div>
    </div>
    <div class="card card--accent" style="gap:8px">
      <span class="badge badge--primary">${tr('Gói gợi ý', 'Suggested package')}</span>
      <strong style="font-family:var(--font-heading)">${esc(estimate.package.name)}</strong>
      <p class="card__body">${esc(estimate.package.why)}</p>
      <a class="btn btn--link" href="${esc(estimate.package.href)}">${tr('Xem gói chi tiết', 'See package')}${icon('arrowRight', 'btn__icon btn__arrow')}</a>
    </div>
    <p class="note-box">${esc(ESTIMATOR_CONFIG.disclaimer)}</p>
    <div class="card">
      <h4 style="font-size:1rem">${tr('Nhận đề xuất chi tiết', 'Get a detailed proposal')}</h4>
      ${leadFormMarkup({ id: 'estimator-lead', compact: true, presetAudience: 'nhan-hang', submitLabel: tr('Nhận đề xuất', 'Send me a proposal') })}
    </div>
    <div class="row"><button class="btn btn--ghost btn--sm" type="button" data-estimator-back>${icon('chevronLeft', 'btn__icon')}<span>${tr('Làm lại', 'Start over')}</span></button></div>
  </div>`
}
