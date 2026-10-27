/** Form thu lead dùng chung: trường thay đổi theo "Bạn là", kiểm tra hai lớp, chống spam. */

import { esc, $$ } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { isValidEmail, isValidPhone } from '../lib/format.js'
import { submitLead } from '../lib/api.js'
import { getUtm, sourcePage, track } from '../lib/store.js'
import { COURSES } from '../lib/catalog-academy.js'

const AUDIENCE_OPTIONS = [
  { id: 'nhan-hang', label: 'Nhãn hàng & tập đoàn' },
  { id: 'sme', label: 'Doanh nghiệp vừa và nhỏ' },
  { id: 'dia-phuong', label: 'Địa phương & OCOP' },
  { id: 'nha-sang-tao', label: 'Nhà sáng tạo / KOC' },
  { id: 'hoc-vien', label: 'Học viên' },
  { id: 'khac', label: 'Khác' },
]

const NEEDS = {
  'nhan-hang': ['Livestream & Megalive', 'Booking KOC định danh', 'Sản xuất Video AI / TVC AI', 'Vận hành TMĐT đa tuyến', 'Tư vấn tổng thể'],
  sme: ['Khởi động TMĐT', 'Đào tạo đội ngũ', 'Thuê studio', 'Tư vấn tổng thể'],
  'dia-phuong': ['Chợ Phiên Phương Nam', 'Megalive xúc tiến thương mại', 'Đào tạo tại địa phương', 'Tải hồ sơ năng lực'],
  'nha-sang-tao': ['Đăng ký định danh KOCViet', 'Nhận booking từ nhãn hàng', 'Đại sứ KOCViet', 'Affiliate'],
  'hoc-vien': COURSES.map((c) => `Khoá ${c.title}`),
  khac: ['Tư vấn chung', 'Hợp tác truyền thông', 'Khác'],
}

const BUDGETS = ['Dưới 20 triệu/tháng', '20 – 50 triệu/tháng', '50 – 100 triệu/tháng', 'Trên 100 triệu/tháng', 'Chưa xác định']

function options(list) {
  return list.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join('')
}

function field({ id, label, type = 'text', required = false, placeholder = '', autocomplete = '', inputmode = '', hint = '', tag = 'input', optionsList = [], optionPairs = null, extra = '' }) {
  const req = required ? 'required aria-required="true"' : ''
  const common = `id="${id}" name="${id}" class="input" ${req} placeholder="${esc(placeholder)}" ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${inputmode ? `inputmode="${inputmode}"` : ''} ${extra}`
  const control =
    tag === 'select'
      ? `<select id="${id}" name="${id}" class="select" ${req}><option value="">Chọn…</option>${optionPairs ? optionPairs.map((o) => `<option value="${esc(o.value !== undefined ? o.value : o.id)}">${esc(o.label)}</option>`).join('') : options(optionsList)}</select>`
      : tag === 'textarea'
        ? `<textarea id="${id}" name="${id}" class="textarea" ${req} placeholder="${esc(placeholder)}" rows="3"></textarea>`
        : `<input type="${type}" ${common} />`
  return `<div class="field" data-field="${id}">
    <label for="${id}">${esc(label)}${required ? ' <span aria-hidden="true" style="color:var(--primary-deep)">*</span>' : ''}</label>
    ${control}
    <span class="field__error" id="${id}-error">${icon('alert')}<span></span></span>
    ${hint ? `<span class="hint">${esc(hint)}</span>` : ''}
  </div>`
}

export function leadFormMarkup({ id = 'lead-form', presetAudience = '', compact = false, submitLabel = 'Gửi thông tin', note = '' }) {
  const audience = AUDIENCE_OPTIONS.find((a) => a.id === presetAudience)
  return `<form id="${id}" class="stack" novalidate data-lead-form data-compact="${compact ? '1' : '0'}">
    <div class="field-grid field-grid--2">
      ${field({ id: 'lead-name', label: tr('Họ và tên', 'Full name'), required: true, placeholder: 'Nguyễn Văn A', autocomplete: 'name' })}
      ${field({ id: 'lead-phone', label: tr('Số điện thoại', 'Phone number'), type: 'tel', required: true, placeholder: '09xx xxx xxx', autocomplete: 'tel', inputmode: 'tel' })}
    </div>
    <div class="field-grid field-grid--2">
      ${field({ id: 'lead-email', label: tr('Email', 'Email'), type: 'email', placeholder: 'ban@congty.vn', autocomplete: 'email' })}
      ${field({ id: 'lead-audience', label: tr('Bạn là', 'You are'), required: true, tag: 'select', optionPairs: AUDIENCE_OPTIONS, extra: audience ? '' : '' })}
    </div>
    <div id="lead-dynamic" class="stack"></div>
    ${compact ? '' : field({ id: 'lead-message', label: tr('Nhu cầu cụ thể (không bắt buộc)', 'Details (optional)'), tag: 'textarea', placeholder: 'Ví dụ: cần 12 phiên live/tháng cho ngành gia dụng, đang bán trên Shopee…' })}
    <div class="honeypot" aria-hidden="true">
      <label for="lead-website">Website</label>
      <input type="text" id="lead-website" name="website" tabindex="-1" autocomplete="off" />
    </div>
    <label class="check">
      <input type="checkbox" id="lead-consent" name="consent" required />
      <span>${tr('Tôi đồng ý để V-HUB xử lý dữ liệu cá nhân theo', 'I agree that V-HUB may process my personal data per the')} <a href="#/chinh-sach-bao-mat">${tr('Chính sách bảo mật', 'Privacy Policy')}</a>.</span>
    </label>
    <div class="field has-error" data-consent-field style="display:none">
      <span class="field__error" style="display:flex">${icon('alert')}<span>Vui lòng đồng ý xử lý dữ liệu cá nhân.</span></span>
    </div>
    <div class="form-status" data-form-status role="alert"></div>
    <div class="row" style="gap:12px">
      <button class="btn" type="submit" data-submit>${esc(submitLabel)}${icon('arrowRight', 'btn__icon')}</button>
      <span class="form-note">${note || tr('V-HUB phản hồi trong 15 phút giờ hành chính.', 'We reply within 15 minutes during office hours.')}</span>
    </div>
  </form>`
}

function dynamicFields(audienceLabel) {
  const found = AUDIENCE_OPTIONS.find((a) => a.label === audienceLabel)
  const id = found ? found.id : 'khac'
  const labelMap = {
    'nhan-hang': 'Công ty / nhãn hàng',
    sme: 'Tên doanh nghiệp',
    'dia-phuong': 'Đơn vị / địa phương',
    'nha-sang-tao': 'Kênh của bạn',
    'hoc-vien': 'Trình độ hiện tại',
    khac: 'Đơn vị',
  }
  const placeholderMap = {
    'nhan-hang': 'Tên công ty',
    sme: 'Tên doanh nghiệp',
    'dia-phuong': 'Sở, hợp tác xã, chủ thể OCOP…',
    'nha-sang-tao': 'Link TikTok / Shopee / Facebook',
    'hoc-vien': 'Mới bắt đầu / đã có kênh',
    khac: 'Tên đơn vị',
  }
  let extra = ''
  if (id === 'dia-phuong') {
    extra += field({ id: 'lead-province', label: 'Tỉnh / thành phố', placeholder: 'Ví dụ: Vĩnh Long' })
  }
  if (id === 'nhan-hang' || id === 'sme') {
    extra += `<div class="field" data-field="lead-budget"><label for="lead-budget">Ngân sách dự kiến (không bắt buộc)</label><select id="lead-budget" name="budget" class="select"><option value="">Chọn…</option>${options(BUDGETS)}</select></div>`
  }
  return `
    ${field({ id: 'lead-company', label: labelMap[id], placeholder: placeholderMap[id] })}
    ${extra}
    ${field({ id: 'lead-needs', label: 'Nhu cầu chính', tag: 'select', optionsList: NEEDS[id] || NEEDS.khac })}
  `
}

function setError(form, fieldName, message) {
  const wrapper = form.querySelector(`[data-field="${fieldName}"]`)
  if (!wrapper) return
  const box = wrapper.querySelector('.field__error span')
  wrapper.classList.toggle('has-error', Boolean(message))
  if (box) box.textContent = message || ''
}

function validate(form) {
  let ok = true
  const name = form.querySelector('#lead-name')
  const phone = form.querySelector('#lead-phone')
  const email = form.querySelector('#lead-email')
  const audience = form.querySelector('#lead-audience')
  const consent = form.querySelector('#lead-consent')
  const consentField = form.querySelector('[data-consent-field]')

  if (!name.value.trim() || name.value.trim().length < 2) {
    setError(form, 'lead-name', 'Vui lòng nhập họ tên (ít nhất 2 ký tự).')
    ok = false
  } else setError(form, 'lead-name', '')

  if (!isValidPhone(phone.value)) {
    setError(form, 'lead-phone', 'Số điện thoại chưa hợp lệ (ví dụ 0901 234 567).')
    ok = false
  } else setError(form, 'lead-phone', '')

  if (email.value.trim() && !isValidEmail(email.value)) {
    setError(form, 'lead-email', 'Email chưa hợp lệ.')
    ok = false
  } else setError(form, 'lead-email', '')

  if (!audience.value) {
    setError(form, 'lead-audience', 'Vui lòng chọn nhóm bạn thuộc về.')
    ok = false
  } else setError(form, 'lead-audience', '')

  if (consentField) consentField.style.display = consent.checked ? 'none' : 'block'
  if (!consent.checked) ok = false

  return ok
}

function collect(form) {
  const val = (sel) => {
    const node = form.querySelector(sel)
    return node ? node.value.trim() : ''
  }
  return {
    type: 'lead',
    name: val('#lead-name'),
    phone: val('#lead-phone'),
    email: val('#lead-email'),
    audience: val('#lead-audience'),
    company: val('#lead-company'),
    province: val('#lead-province'),
    budget: val('#lead-budget'),
    needs: val('#lead-needs'),
    message: val('#lead-message'),
    consent: Boolean(form.querySelector('#lead-consent') && form.querySelector('#lead-consent').checked),
    website: val('#lead-website'),
    page: sourcePage(),
    utm: getUtm(),
  }
}

export function attachLeadForm(root = document, options = {}) {
  $$('[data-lead-form]', root).forEach((form) => {
    const audienceSelect = form.querySelector('#lead-audience')
    const dyn = form.querySelector('#lead-dynamic')
    const renderDynamic = () => {
      if (!dyn) return
      dyn.innerHTML = audienceSelect && audienceSelect.value ? dynamicFields(audienceSelect.value) : ''
    }
    if (audienceSelect) {
      audienceSelect.addEventListener('change', renderDynamic)
      if (audienceSelect.value) renderDynamic()
    }

    // Kiểm tra khi rời trường
    ;['#lead-name', '#lead-phone', '#lead-email', '#lead-audience'].forEach((sel) => {
      const node = form.querySelector(sel)
      if (!node) return
      node.addEventListener('blur', () => {
        if (node.id === 'lead-name' && !node.value.trim()) setError(form, 'lead-name', 'Vui lòng nhập họ tên.')
        if (node.id === 'lead-phone' && node.value && !isValidPhone(node.value)) setError(form, 'lead-phone', 'Số điện thoại chưa hợp lệ.')
        if (node.id === 'lead-email' && node.value && !isValidEmail(node.value)) setError(form, 'lead-email', 'Email chưa hợp lệ.')
      })
    })

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const status = form.querySelector('[data-form-status]')
      if (status) {
        status.className = 'form-status'
        status.textContent = ''
      }
      if (!validate(form)) {
        const firstError = form.querySelector('.has-error .input, .has-error .select')
        if (firstError) firstError.focus()
        return
      }
      const payload = collect(form)
      if (payload.website) return // honeypot
      const submit = form.querySelector('[data-submit]')
      const original = submit ? submit.innerHTML : ''
      if (submit) {
        submit.disabled = true
        submit.innerHTML = '<span>Đang gửi…</span>'
      }
      try {
        const res = await submitLead(payload)
        track('lead_submit', { audience: payload.audience, type: 'lead' })
        form.reset()
        if (dyn) dyn.innerHTML = ''
        if (options.onSuccess) {
          options.onSuccess(res, payload)
        } else if (typeof window.__VHUB_AFTER_LEAD__ === 'function') {
          window.__VHUB_AFTER_LEAD__(res, payload)
        } else {
          location.hash = `#/cam-on?type=${encodeURIComponent(payload.audience || 'chung')}`
        }
      } catch (err) {
        if (status) {
          status.className = 'form-status is-error'
          status.textContent = err.message || 'Không gửi được thông tin. Vui lòng thử lại sau.'
        }
      } finally {
        if (submit) {
          submit.disabled = false
          submit.innerHTML = original
        }
      }
    })
  })
}
