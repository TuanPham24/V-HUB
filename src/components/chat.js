/** Trợ lý tư vấn: kịch bản 4 bước + thu lead, tự chuyển sang LLM khi có AI_API_KEY. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { state } from '../lib/store.js'
import { getUtm, sourcePage, track } from '../lib/store.js'
import { submitLead, chatAsk } from '../lib/api.js'
import { isValidPhone } from '../lib/format.js'
import { toast } from './ui.js'

const AUDIENCE_CHOICES = [
  { id: 'nhan-hang', label: 'Nhãn hàng & tập đoàn', next: 'need-brand' },
  { id: 'sme', label: 'Doanh nghiệp vừa và nhỏ', next: 'need-sme' },
  { id: 'dia-phuong', label: 'Địa phương & OCOP', next: 'need-local' },
  { id: 'nha-sang-tao', label: 'Nhà sáng tạo / KOC', next: 'creator' },
  { id: 'hoc-vien', label: 'Học viên', next: 'course' },
]

const NEEDS = {
  'need-brand': ['Livestream & Megalive', 'Booking KOC định danh', 'Video AI / TVC AI', 'Vận hành TMĐT đa tuyến'],
  'need-sme': ['Khởi động TMĐT 90 ngày', 'Đào tạo đội ngũ', 'Thuê studio'],
  'need-local': ['Chợ Phiên Phương Nam', 'Megalive xúc tiến', 'Đào tạo tại địa phương'],
  course: ['Video AI', 'TVC AI', 'Phim AI', 'Livestream bán hàng'],
}

const TIMELINES = ['Trong 2 tuần tới', 'Trong 1 tháng tới', 'Đang tìm hiểu']

const SUGGESTIONS = {
  'nhan-hang': { text: 'Với nhãn hàng, V-HUB thường bắt đầu bằng buổi tư vấn 60 phút và gói B (Tăng trưởng & cam kết số). Bạn có thể xem khung gói trước.', href: '#/giai-phap/nhan-hang', cta: 'Xem giải pháp nhãn hàng', pkg: 'B — Tăng trưởng & cam kết số' },
  sme: { text: 'Doanh nghiệp vừa và nhỏ phù hợp với gói A (Khởi động TMĐT) — 90 ngày để dựng nền và bàn giao quy trình.', href: '#/giai-phap/khoi-dong-tmdt', cta: 'Xem gói Khởi động TMĐT', pkg: 'A — Khởi động TMĐT' },
  'dia-phuong': { text: 'Địa phương nên bắt đầu từ Chợ Phiên Phương Nam: một phiên Megalive 3 giờ, có đào tạo tại chỗ và trích 10% doanh thu vào quỹ.', href: '#/cho-phien', cta: 'Xem Chợ Phiên Phương Nam', pkg: 'E — Địa phương / OCOP' },
  'nha-sang-tao': { text: 'Nhà sáng tạo cần định danh KOCViet trước. Hồ sơ gồm CCCD, ảnh chân dung và kênh đang vận hành; xử lý trung bình 3 ngày.', href: '#/kocviet/dinh-danh', cta: 'Đăng ký định ký KOCViet', pkg: '' },
  'hoc-vien': { text: 'Lộ trình gợi ý: Video AI (5 buổi, 8 triệu) → TVC AI hoặc Phim AI. Livestream học song song nếu bạn muốn lên sóng sớm.', href: '#/hoc-vien', cta: 'Xem học viện', pkg: '' },
}

let el = null
let state_ = { step: 'greet', audience: '', need: '', timeline: '', messages: [] }

function bubble(text, who = 'bot') {
  return `<div class="chat-msg chat-msg--${who}">${esc(text)}</div>`
}

function optionsMarkup(options, action = 'choice') {
  if (!options.length) return ''
  return `<div class="chat-options">${options
    .map((o, i) => `<button class="chat-option" type="button" data-chat-action="${action}" data-value="${esc(typeof o === 'string' ? o : o.id)}" data-index="${i}">${esc(typeof o === 'string' ? o : o.label)}</button>`)
    .join('')}</div>`
}

function messagesHtml() {
  return state_.messages.map((m) => bubble(m.text, m.who)).join('')
}

function render() {
  if (!el) return
  const body = el.querySelector('#chat-body')
  const opts = el.querySelector('#chat-options')
  if (body) {
    body.innerHTML = messagesHtml()
    body.scrollTop = body.scrollHeight
  }
  if (!opts) return
  if (state_.step === 'greet') opts.innerHTML = optionsMarkup(AUDIENCE_CHOICES.map((a) => ({ id: a.id, label: a.label })), 'audience')
  else if (NEEDS[state_.step]) opts.innerHTML = optionsMarkup(NEEDS[state_.step], 'need')
  else if (state_.step === 'timeline') opts.innerHTML = optionsMarkup(TIMELINES, 'timeline')
  else if (state_.step === 'contact') opts.innerHTML = ''
  else if (state_.step === 'done') opts.innerHTML = optionsMarkup([{ id: 'restart', label: 'Hỏi câu khác' }], 'restart')
  else opts.innerHTML = optionsMarkup(AUDIENCE_CHOICES.map((a) => ({ id: a.id, label: a.label })), 'audience')
  const foot = el.querySelector('#chat-foot')
  if (foot) foot.hidden = state_.step === 'contact'
}

function say(text, who = 'bot') {
  state_.messages.push({ text, who })
  render()
}

function typing() {
  const body = el.querySelector('#chat-body')
  if (!body) return
  const node = document.createElement('div')
  node.className = 'chat-msg chat-msg--bot chat-msg--typing'
  node.id = 'chat-typing'
  node.innerHTML = '<span></span><span></span><span></span>'
  body.appendChild(node)
  body.scrollTop = body.scrollHeight
}

function clearTyping() {
  const node = el.querySelector('#chat-typing')
  if (node) node.remove()
}

function leadForm() {
  return `<div class="chat-lead-form" id="chat-lead-form">
    <p class="xsmall" style="color:var(--on-surface-muted)">${tr('Để lại số điện thoại, V-HUB gọi lại trong 15 phút giờ hành chính.', 'Leave your phone number and we will call within 15 minutes during office hours.')}</p>
    <input class="input" id="chat-name" placeholder="${tr('Họ tên', 'Your name')}" autocomplete="name" />
    <input class="input" id="chat-phone" type="tel" inputmode="tel" placeholder="${tr('Số điện thoại', 'Phone number')}" autocomplete="tel" />
    <button class="btn btn--sm btn--block" type="button" id="chat-send-lead">${tr('Gửi thông tin', 'Send')}</button>
    <p class="xsmall" style="color:var(--on-surface-muted)">${tr('Bằng việc gửi, bạn đồng ý với', 'By sending you agree to our')} <a href="#/chinh-sach-bao-mat" style="text-decoration:underline">${tr('Chính sách bảo mật', 'Privacy Policy')}</a>.</p>
  </div>`
}

function showLeadForm() {
  const opts = el.querySelector('#chat-options')
  if (!opts) return
  state_.step = 'contact'
  opts.innerHTML = leadForm()
  const btn = opts.querySelector('#chat-send-lead')
  btn.addEventListener('click', async () => {
    const name = opts.querySelector('#chat-name').value.trim()
    const phone = opts.querySelector('#chat-phone').value.trim()
    if (!name || !isValidPhone(phone)) {
      toast(tr('Vui lòng nhập tên và số điện thoại hợp lệ.', 'Please enter a valid name and phone number.'), 'error')
      return
    }
    btn.disabled = true
    btn.textContent = tr('Đang gửi…', 'Sending…')
    try {
      await submitLead({
        type: 'chat',
        name,
        phone,
        email: '',
        audience: state_.audience,
        needs: state_.need,
        message: `Trợ lý tư vấn: ${state_.need} · thời gian: ${state_.timeline}`,
        consent: true,
        page: sourcePage(),
        utm: getUtm(),
      })
      track('chat_lead_submit', { audience: state_.audience })
      opts.innerHTML = ''
      state_.step = 'done'
      say(tr('Đã gửi. V-HUB sẽ gọi lại trong 15 phút giờ hành chính. Cảm ơn bạn!', 'Sent. We will call within 15 minutes during office hours. Thank you!'))
      render()
    } catch (err) {
      toast(err.message || 'Không gửi được.', 'error')
      btn.disabled = false
      btn.textContent = tr('Gửi thông tin', 'Send')
    }
  })
  opts.scrollIntoView({ block: 'nearest' })
}

async function handleChoice(action, value) {
  if (action === 'restart') {
    state_ = { step: 'greet', audience: '', need: '', timeline: '', messages: state_.messages }
    say(tr('Bạn muốn hỏi về hướng nào?', 'Which path would you like to explore?'))
    return
  }
  if (action === 'audience') {
    const found = AUDIENCE_CHOICES.find((a) => a.id === value)
    state_.audience = value
    say(found.label, 'user')
    state_.step = found.next
    render()
    typing()
    setTimeout(() => {
      clearTyping()
      if (value === 'nha-sang-tao') {
        say(tr('Bạn muốn định danh KOCViet, nhận booking, hay tham gia affiliate?', 'Would you like KOCViet verification, brand bookings, or affiliate?'))
        state_.step = 'need-creator'
        const opts = el.querySelector('#chat-options')
        if (opts) opts.innerHTML = optionsMarkup(['Đăng ký định danh KOCViet', 'Nhận booking từ nhãn hàng', 'Affiliate', 'Đại sứ KOCViet'], 'need')
      } else {
        say(tr('Bạn đang cần hỗ trợ việc gì?', 'What do you need help with?'))
        render()
      }
    }, 420)
    return
  }
  if (action === 'need') {
    state_.need = value
    say(value, 'user')
    state_.step = 'timeline'
    render()
    typing()
    setTimeout(() => {
      clearTyping()
      say(tr('Bạn dự kiến bắt đầu trong khoảng thời gian nào?', 'When would you like to start?'))
      render()
    }, 400)
    return
  }
  if (action === 'timeline') {
    state_.timeline = value
    say(value, 'user')
    const s = SUGGESTIONS[state_.audience] || SUGGESTIONS['nhan-hang']
    typing()
    setTimeout(() => {
      clearTyping()
      say(s.text)
      const opts = el.querySelector('#chat-options')
      if (opts) {
        opts.innerHTML = `<div class="chat-options">
          <a class="chat-option" href="${s.href}">${esc(s.cta)} ${icon('arrowRight')}</a>
          <button class="chat-option" type="button" data-chat-lead>${tr('Để lại số điện thoại để được gọi lại', 'Leave your phone number')}</button>
          <a class="chat-option" href="#/lien-he">${tr('Đặt lịch tư vấn 60 phút', 'Book a 60-minute consultation')}</a>
        </div>`
        const leadBtn = opts.querySelector('[data-chat-lead]')
        if (leadBtn) leadBtn.addEventListener('click', showLeadForm)
      }
      state_.step = 'suggest'
    }, 520)
  }
}

async function handleFreeText(text) {
  say(text, 'user')
  typing()
  try {
    const features = (state.bootstrap && state.bootstrap.features) || {}
    if (features.ai) {
      const res = await chatAsk({ message: text, audience: state_.audience, history: state_.messages.slice(-6) })
      clearTyping()
      say(res.reply || tr('Mình chưa có câu trả lời cho ý này.', 'I do not have an answer for that yet.'))
      render()
      return
    }
    clearTyping()
    say(
      tr(
        'Mình là trợ lý theo kịch bản nên chưa trả lời tự do được. Bạn chọn một hướng bên dưới, hoặc để lại số điện thoại để chuyên viên gọi lại nhé.',
        'I am a scripted assistant, so I cannot answer freely yet. Pick a path below or leave your phone number and a specialist will call.',
      ),
    )
    state_.step = 'greet'
    render()
  } catch (err) {
    clearTyping()
    say(tr('Kết nối đang gián đoạn. Bạn thử lại hoặc gọi hotline 028 7300 8686.', 'Connection issue. Try again or call 028 7300 8686.'))
    render()
  }
}

export function initChat() {
  if (document.getElementById('chat-panel')) return
  el = document.createElement('div')
  el.innerHTML = `<div class="chat-panel" id="chat-panel" role="dialog" aria-label="${tr('Trợ lý tư vấn V-HUB', 'V-HUB advisor')}" aria-modal="false">
    <div class="chat-head">
      <span class="chat-head__avatar">VH</span>
      <div><strong>${tr('Trợ lý tư vấn V-HUB', 'V-HUB advisor')}</strong><span>${tr('Trực trong giờ hành chính', 'Online during office hours')}</span></div>
      <button class="chat-head__close" type="button" aria-label="${tr('Đóng trợ lý', 'Close assistant')}" id="chat-close">${icon('close')}</button>
    </div>
    <div class="chat-body" id="chat-body"></div>
    <div id="chat-options"></div>
    <form class="chat-foot" id="chat-foot">
      <label class="sr-only" for="chat-input">${tr('Nhập câu hỏi', 'Type your question')}</label>
      <input id="chat-input" placeholder="${tr('Nhập câu hỏi…', 'Type a question…')}" autocomplete="off" />
      <button type="submit" aria-label="${tr('Gửi', 'Send')}">${icon('arrowRight')}</button>
    </form>
    <p class="chat-note">${tr('Trợ lý có thể trả lời theo kịch bản. Thông tin bạn gửi được xử lý theo Chính sách bảo mật.', 'This assistant follows a script. Your data is processed per our Privacy Policy.')}</p>
  </div>`
  document.body.appendChild(el.firstElementChild)
  el = document.getElementById('chat-panel')
  const panel = el

  const body = panel.querySelector('#chat-body')
  body.innerHTML = ''
  state_ = { step: 'greet', audience: '', need: '', timeline: '', messages: [] }
  say(tr('Chào bạn, mình là trợ lý của V-HUB. Bạn thuộc nhóm nào dưới đây?', 'Hello, I am the V-HUB assistant. Which group are you in?'))
  render()

  panel.querySelector('#chat-close').addEventListener('click', () => closeChat())
  panel.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-chat-action]')
    if (opt) {
      handleChoice(opt.dataset.chatAction, opt.dataset.value)
    }
  })
  const foot = panel.querySelector('#chat-foot')
  foot.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = panel.querySelector('#chat-input')
    const text = input.value.trim()
    if (!text) return
    input.value = ''
    handleFreeText(text)
  })
  if (window.matchMedia && window.matchMedia('(max-width: 1023px)').matches) {
    document.body.style.overflow = 'hidden'
  }
}

export function openChat() {
  initChat()
  const panel = document.getElementById('chat-panel')
  if (!panel) return
  panel.classList.add('is-open')
  const input = panel.querySelector('#chat-input')
  if (input) setTimeout(() => input.focus(), 120)
}

export function closeChat() {
  const panel = document.getElementById('chat-panel')
  if (!panel) return
  panel.classList.remove('is-open')
  document.body.style.overflow = ''
}
