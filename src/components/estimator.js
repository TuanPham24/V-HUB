/** Công cụ ước tính chi phí livestream — 4 bước, công thức trong src/lib/catalog-estimator.js. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { ESTIMATOR_CONFIG } from '../lib/catalog-estimator.js'
import { estimateResultBlock } from './estimator-result.js'

const state = { step: 1, industry: '', priceBand: '', hours: 24, needKol: false, megalive: 0, done: false }

function progress() {
  return `<div class="stepper" aria-label="${tr('Tiến trình ước tính', 'Estimate progress')}">
    ${[1, 2, 3, 4]
      .map(
        (i) => `<span class="stepper__item ${state.step === i ? 'is-current' : state.step > i ? 'is-done' : ''}">
          <span class="stepper__num">${state.step > i ? '✓' : i}</span>
          ${i === 1 ? tr('Ngành hàng', 'Category') : i === 2 ? tr('Giá bán', 'Price') : i === 3 ? tr('Tần suất', 'Frequency') : tr('KOC & Megalive', 'Creators')}
        </span>`,
      )
      .join('')}
  </div>`
}

function stepContent() {
  if (state.step === 1) {
    return `<div class="stack">
      <h3>${tr('Ngành hàng của bạn là gì?', 'What is your category?')}</h3>
      <div class="grid grid--2">
        ${ESTIMATOR_CONFIG.industries
          .map(
            (i) => `<button class="card card--link" type="button" data-industry="${i.id}" style="text-align:left;gap:6px;min-height:44px">
              <strong style="font-family:var(--font-heading)">${esc(i.label)}</strong>
              <span class="xsmall muted">${esc(i.note)}</span>
            </button>`,
          )
          .join('')}
      </div>
    </div>`
  }
  if (state.step === 2) {
    return `<div class="stack">
      <h3>${tr('Giá trung bình một sản phẩm?', 'Average product price?')}</h3>
      <div class="grid grid--2">
        ${ESTIMATOR_CONFIG.priceBands
          .map(
            (p) => `<button class="chip" type="button" data-band="${p.id}" aria-pressed="${state.priceBand === p.id}" style="justify-content:center;min-height:56px">${esc(p.label)}</button>`,
          )
          .join('')}
      </div>
    </div>`
  }
  if (state.step === 3) {
    return `<div class="stack">
      <h3>${tr('Mỗi tháng bạn dự kiến live bao nhiêu giờ?', 'How many live hours per month?')}</h3>
      <div class="row" style="gap:8px">
        ${ESTIMATOR_CONFIG.hourOptions
          .map(
            (h) => `<button class="chip" type="button" data-hours="${h}" aria-pressed="${state.hours === h}">${h} ${tr('giờ', 'h')}</button>`,
          )
          .join('')}
      </div>
      <label class="field" style="max-width:320px">
        <span class="label">${tr('Hoặc tự chọn số giờ', 'Or choose hours')}: <strong>${state.hours}</strong></span>
        <input class="input" type="range" min="4" max="120" step="4" value="${state.hours}" data-hours-range />
      </label>
      <p class="small muted">${tr('Gợi ý: 4 phiên Daily Live mỗi tuần tương đương 32–40 giờ/tháng.', 'Typical: four Daily Live sessions a week is about 32–40 hours per month.')}</p>
    </div>`
  }
  return `<div class="stack">
    <h3>${tr('Bạn có cần KOC định danh và phiên Megalive?', 'Do you need verified creators and Megalive?')}</h3>
    <label class="check" style="padding:12px;border:1px solid var(--outline);border-radius:12px">
      <input type="checkbox" data-kol ${state.needKol ? 'checked' : ''} />
      <span><strong>${tr('Booking KOC định danh', 'Book verified creators')}</strong><br />${tr('Mỗi 20 giờ live dự kiến có 1 phiên KOC tham gia.', 'One creator session per 20 live hours.')}</span>
    </label>
    <div class="field">
      <span class="label">${tr('Số phiên Megalive mỗi tháng', 'Megalive sessions per month')}: <strong>${state.megalive}</strong></span>
      <div class="row" style="gap:8px">
        ${[0, 1, 2, 3]
          .map(
            (n) => `<button class="chip" type="button" data-mega="${n}" aria-pressed="${state.megalive === n}">${n === 0 ? tr('Không', 'None') : `${n} ${tr('phiên', 'session(s)')}`}</button>`,
          )
          .join('')}
      </div>
    </div>
  </div>`
}

export function estimatorMarkup() {
  return `<div class="card" id="estimator" style="gap:var(--sp-4)">
    <div class="row row--between">
      <div>
        <span class="kicker">${tr('Công cụ', 'Tool')}</span>
        <h2 style="font-size:var(--fs-h2);margin-top:6px">${tr('Ước tính chi phí livestream', 'Livestream cost estimator')}</h2>
      </div>
      ${badgeHidden()}
    </div>
    <div id="estimator-body">
      ${progress()}
      ${stepContent()}
      <div class="row mt-4" style="gap:10px">
        <button class="btn" type="button" data-estimator-next ${state.step === 1 ? 'disabled' : ''}>${tr('Tiếp tục', 'Continue')}${icon('arrowRight', 'btn__icon')}</button>
        ${state.step > 1 ? `<button class="btn btn--ghost" type="button" data-estimator-back">${icon('chevronLeft', 'btn__icon')}<span>${tr('Quay lại', 'Back')}</span></button>` : ''}
      </div>
    </div>
  </div>`
}

/* Ba ô pixel nhỏ dùng làm biểu tượng tải như mô tả trong tài liệu thiết kế. */
function badgeHidden() {
  return `<span class="badge">${tr('4 bước · không cam kết doanh số', '4 steps · no sales commitment')}</span>`
}

function renderBody(root) {
  const body = root.querySelector('#estimator-body')
  if (!body) return
  if (state.done) {
    body.innerHTML = estimateResultBlock(state)
  } else {
    body.innerHTML = `${progress()}${stepContent()}
      <div class="row mt-4" style="gap:10px">
        <button class="btn" type="button" data-estimator-next>${state.step === 4 ? tr('Xem kết quả', 'See estimate') : tr('Tiếp tục', 'Continue')}${icon('arrowRight', 'btn__icon')}</button>
        ${state.step > 1 ? `<button class="btn btn--ghost" type="button" data-estimator-back">${icon('chevronLeft', 'btn__icon')}<span>${tr('Quay lại', 'Back')}</span></button>` : ''}
      </div>`
    if (state.done) attachLeadAgain(root)
  }
  if (state.done) attachLeadAgain(root)
}

function attachLeadAgain(root) {
  // Form lead trong kết quả được gắn lại mỗi lần render
  if (typeof window.__VHUB_ATTACH_FORMS__ === 'function') window.__VHUB_ATTACH_FORMS__(root)
}

export function attachEstimator(root = document) {
  const host = root.querySelector('#estimator')
  if (!host) return

  host.addEventListener('click', (e) => {
    const industry = e.target.closest('[data-industry]')
    if (industry) {
      state.industry = industry.dataset.industry
      state.step = 2
      renderBody(root)
      return
    }
    const band = e.target.closest('[data-band]')
    if (band) {
      state.priceBand = band.dataset.band
      state.step = 3
      renderBody(root)
      return
    }
    const hours = e.target.closest('[data-hours]')
    if (hours) {
      state.hours = Number(hours.dataset.hours)
      renderBody(root)
      return
    }
    const mega = e.target.closest('[data-mega]')
    if (mega) {
      state.megalive = Number(mega.dataset.mega)
      renderBody(root)
      return
    }
    const next = e.target.closest('[data-estimator-next]')
    if (next) {
      if (state.step === 1 && !state.industry) return
      if (state.step === 2 && !state.priceBand) return
      if (state.step < 4) {
        state.step += 1
      } else {
        state.done = true
      }
      renderBody(root)
      return
    }
    const back = e.target.closest('[data-estimator-back]')
    if (back) {
      if (state.done) {
        state.done = false
        state.step = 1
        state.industry = ''
        state.priceBand = ''
      } else {
        state.step = Math.max(1, state.step - 1)
      }
      renderBody(root)
    }
  })

  host.addEventListener('input', (e) => {
    const range = e.target.closest('[data-hours-range]')
    if (range) state.hours = Number(range.value)
  })
  host.addEventListener('change', (e) => {
    const range = e.target.closest('[data-hours-range]')
    if (range) {
      state.hours = Number(range.value)
      renderBody(root)
      return
    }
    const kol = e.target.closest('[data-kol]')
    if (kol) state.needKol = kol.checked
  })
}
