/**
 * V-HUB — kiểm thử giao diện TẤT ĐỊNH (dán vào `run_test_script` của Nexrall,
 * hoặc chạy trong DevTools console trên bản deploy).
 *
 * Nguyên tắc (xem README mục 9.1):
 *  - KHÔNG `setTimeout` mù để chờ render → dùng `window.__VHUB_APP__.nav()` / `waitFor()`.
 *  - KHÔNG đọc text đang animation → đọc `[data-stat-final]`.
 *  - KHÔNG đặt lịch/lead thật trong test UI (tránh phụ thuộc dữ liệu tích luỹ).
 *  - Query lại phần tử sau mỗi lần render (không giữ tham chiếu cũ).
 *  - Chat là singleton trong trang → remove panel trước mỗi lần chạy để reset state.
 *
 * Trả về object tổng kết; ném lỗi nếu có vấn đề hoặc kết quả khác nhau giữa các lần chạy.
 */
async function runVhubBrowserCheck({ iterations = 3 } = {}) {
  const A = window.__VHUB_APP__
  if (!A) throw new Error('Thiếu window.__VHUB_APP__ — bản deploy chưa có hook tất định.')
  if (!A.ready) throw new Error('App chưa sẵn sàng (__VHUB_APP__.ready = false).')

  const until = async (fn, timeout = 4000) => {
    const t0 = Date.now()
    while (Date.now() - t0 < timeout) {
      const v = fn()
      if (v) return v
      await new Promise((r) => setTimeout(r, 50))
    }
    return null
  }
  const q = (s) => document.querySelector(s)
  const qa = (s) => Array.from(document.querySelectorAll(s))

  const ROUTES = [
    '/', '/giai-phap', '/giai-phap/nhan-hang', '/giai-phap/brand-live-house', '/studio',
    '/studio/super-megalive', '/kocviet', '/kocviet/tim-kiem', '/kocviet/ngoc-han',
    '/cho-phien', '/cho-phien/minh-bach', '/cho-phien/vinh-long', '/lich-live', '/hoc-vien',
    '/hoc-vien/video-ai', '/du-an', '/tin-tuc', '/ve-v-hub', '/lien-he',
    '/chinh-sach-bao-mat', '/dieu-khoan', '/admin', '/trang-khong-ton-tai',
  ]

  async function runOnce() {
    const problems = []

    for (const r of ROUTES) {
      const res = await A.nav('#' + r)
      if (res.timedOut) problems.push(r + ':nav-timeout')
      if (!(await A.waitFor('#main', 2000))) problems.push(r + ':no-main')
      if (!q('h1')) problems.push(r + ':no-h1')
      if (document.body.innerText.trim().length < 150) problems.push(r + ':short')
      if (document.documentElement.scrollWidth - window.innerWidth > 1) problems.push(r + ':overflow')
    }

    // Số liệu: thuộc tính cuối + so sánh giữa hai lần render
    await A.nav('#/')
    const statA = qa('[data-stat-final]').map((n) => n.getAttribute('data-stat-final'))
    await A.nav('#/ve-v-hub')
    await A.nav('#/')
    const statB = qa('[data-stat-final]').map((n) => n.getAttribute('data-stat-final'))
    if (!statA.length) problems.push('stats:missing')
    if (JSON.stringify(statA) !== JSON.stringify(statB)) problems.push('stats:unstable')

    // Wizard đặt lịch: tới bước 3, KHÔNG submit
    await A.nav('#/studio/super-megalive')
    if (!(await A.waitFor('#booking-wizard', 3000))) problems.push('wizard:missing')
    let picked = null
    for (const d of qa('[data-bdate]').map((b) => b.dataset.bdate)) {
      const res = await fetch(`/api/bookings/availability?studio=super-megalive&date=${d}`)
      const json = await res.json()
      const free = (json.slots || []).find((s) => !s.booked)
      if (free) {
        picked = { date: d, slot: free.id }
        break
      }
    }
    if (!picked) problems.push('wizard:no-free-slot')
    else {
      q(`[data-bdate="${picked.date}"]`).click()
      const slotBtn = await until(() => q(`[data-slot="${picked.slot}"]:not(:disabled)`))
      if (!slotBtn) problems.push('wizard:slot-missing')
      else slotBtn.click()
      q('[data-bnext]').click()
      if (qa('[data-package]').length !== 3) problems.push('wizard:packages')
      q('[data-package="tech"]').click()
      q('[data-bnext]').click()
      if (!(await A.waitFor('#booking-form', 2000))) problems.push('wizard:form-missing')
      if (!/\d/.test((q('#booking-summary') || {}).innerText || '')) problems.push('wizard:summary-empty')
      const hashBefore = location.hash
      q('#booking-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      if (!(await until(() => q('#booking-form .field.has-error')))) problems.push('wizard:no-validation')
      if (location.hash !== hashBefore) problems.push('wizard:navigated-on-invalid')
    }

    // i18n — phải kiểm tra trên trang chủ (hero)
    await A.nav('#/')
    q('[data-lang="en"]').click()
    if (!(await until(() => document.documentElement.lang === 'en' && /Bring Vietnamese/.test((q('.hero__title') || {}).innerText || '')))) problems.push('i18n:en')
    q('[data-lang="vi"]').click()
    if (!(await until(() => document.documentElement.lang === 'vi'))) problems.push('i18n:vi')

    // Trợ lý tư vấn — reset singleton để không dính state giữa các lần chạy
    const oldPanel = document.getElementById('chat-panel')
    if (oldPanel) oldPanel.remove()
    document.body.style.overflow = ''
    q('[data-open-chat]').click()
    const optionCount = await until(() => {
      const n = qa('#chat-options .chat-option').length
      return n === 5 ? n : null
    })
    if (optionCount !== 5) problems.push('chat:options')
    const first = q('#chat-options .chat-option')
    if (first) first.click()
    if (!(await until(() => qa('#chat-body .chat-msg').length >= 3))) problems.push('chat:reply')
    q('#chat-close').click()
    if (!(await until(() => !q('#chat-panel').classList.contains('is-open')))) problems.push('chat:close')

    return { problems, stats: statA, picked, lang: document.documentElement.lang, options: optionCount }
  }

  const runs = []
  for (let i = 0; i < iterations; i += 1) runs.push(await runOnce())
  const digests = runs.map((r) => JSON.stringify(r))
  const identical = digests.every((d) => d === digests[0])

  if (runs.some((r) => r.problems.length)) throw new Error('Lỗi: ' + JSON.stringify(runs.map((r) => r.problems)))
  if (!identical) throw new Error('KHÔNG tất định, khác nhau giữa các lần chạy:\n' + digests.join('\n'))

  return { verdict: `DETERMINISTIC (${iterations}/${iterations} giống nhau)`, routes: ROUTES.length, sample: runs[0] }
}

// Nexrall run_test_script: gọi trực tiếp
window.__VHUB_BROWSER_CHECK__ = runVhubBrowserCheck
