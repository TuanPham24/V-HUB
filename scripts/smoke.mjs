#!/usr/bin/env node
/* eslint-env node */
/* global process, console, fetch */
/**
 * Smoke test chạy trên bản đã triển khai (hoặc local có API).
 * Dùng: BASE_URL=https://your-app.example ADMIN_PASSWORD=... npm run smoke
 *
 * Kiểm tra: trang chủ + tài nguyên, sitemap, health, bootstrap, form lead,
 * kiểm tra dữ liệu, chống trùng lịch studio, chặn admin khi sai mật khẩu.
 */
const BASE = (process.env.BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
const PASSWORD = process.env.ADMIN_PASSWORD || ''

let pass = 0
let fail = 0
const results = []

function ok(name, detail = '') {
  pass += 1
  results.push(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function bad(name, detail = '') {
  fail += 1
  results.push(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  const text = await res.text()
  let data = null
  try {
    data = JSON.parse(text)
  } catch (_) {}
  return { res, text, data }
}

function expect(name, condition, detail) {
  if (condition) ok(name, detail)
  else bad(name, detail)
}

async function main() {
  console.log(`\nV-HUB smoke test → ${BASE}\n`)

  const home = await req('/')
  expect('GET / trả 200', home.res.status === 200, `status ${home.res.status}`)
  expect('Trang chủ có app.js', home.text.includes('/src/app.js'))
  expect('Trang chủ có meta description', /name="description"/.test(home.text))

  const css = await req('/styles/main.css')
  expect('GET /styles/main.css', css.res.status === 200, `status ${css.res.status}`)
  const appjs = await req('/src/app.js')
  expect('GET /src/app.js', appjs.res.status === 200, `status ${appjs.res.status}`)

  const sitemap = await req('/sitemap.xml')
  const urlCount = (sitemap.text.match(/<loc>/g) || []).length
  expect('Sitemap có >= 40 URL', urlCount >= 40, `${urlCount} URL`)
  const robots = await req('/robots.txt')
  expect('robots.txt tồn tại', robots.res.status === 200 && robots.text.includes('Sitemap:'))

  const health = await req('/api/health')
  expect('GET /api/health', health.res.status === 200 && health.data && health.data.ok === true)

  const bootstrap = await req('/api/bootstrap')
  expect('GET /api/bootstrap có lịch live', bootstrap.res.status === 200 && Array.isArray(bootstrap.data.lives) && bootstrap.data.lives.length > 0, `${bootstrap.data && bootstrap.data.lives ? bootstrap.data.lives.length : 0} phiên`)
  expect('Bootstrap có bảng quỹ', Array.isArray(bootstrap.data.markets) && bootstrap.data.markets.length >= 4)

  const badLead = await req('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', phone: 'abc', consent: false }),
  })
  expect('Lead thiếu dữ liệu bị chặn 400', badLead.res.status === 400)

  const lead = await req('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'lead',
      name: 'Kiểm thử tự động',
      phone: '0901234567',
      email: 'smoke@example.com',
      audience: 'nhan-hang',
      needs: 'Smoke test',
      consent: true,
      page: '#/lien-he',
      utm: { utm_source: 'smoke' },
      message: '<script>alert(1)</script>',
    }),
  })
  expect('Gửi lead hợp lệ trả 200', lead.res.status === 200 && lead.data.ok === true)

  const honeypot = await req('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bot', phone: '0901234567', consent: true, website: 'http://spam.example' }),
  })
  expect('Honeypot bị lọc (không lưu)', honeypot.res.status === 200 && honeypot.data.filtered === true)

  // --- Đặt lịch: quét tìm khung giờ còn trống để test KHÔNG phụ thuộc dữ liệu
  // của lần chạy trước (trước đây dùng một ngày cố định nên chạy lại là 409).
  const vnDate = (offsetDays) => new Date(Date.now() + 7 * 3600 * 1000 + offsetDays * 86400000).toISOString().slice(0, 10)
  let free = null
  let availabilityChecked = false
  for (let offset = 30; offset < 46; offset += 1) {
    const date = vnDate(offset)
    const res = await req(`/api/bookings/availability?studio=super-megalive&date=${date}`)
    if (res.res.status !== 200 || !Array.isArray(res.data?.slots) || res.data.slots.length !== 3) continue
    if (!availabilityChecked) {
      expect('Lịch trống trả 3 ca', true, `${date} · 3 ca`)
      availabilityChecked = true
    }
    const slot = res.data.slots.find((s) => !s.booked)
    if (slot) {
      free = { date, slot: slot.id }
      break
    }
  }
  if (!availabilityChecked) expect('Lịch trống trả 3 ca', false, 'không đọc được /api/bookings/availability')

  if (!free) {
    results.push('• Bỏ qua kiểm tra đặt lịch: không còn khung giờ trống trong 16 ngày tới (dữ liệu tích luỹ)')
  } else {
    const bookingBody = {
      studio_id: 'super-megalive',
      date: free.date,
      slot: free.slot,
      package_id: 'tech',
      addons: ['teleprompter'],
      hours: 4,
      name: 'Kiểm thử tự động',
      phone: '0901234567',
      email: 'smoke@example.com',
      company: 'Smoke Co',
      notes: 'Đặt bởi smoke test',
      consent: true,
    }
    const booking1 = await req('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingBody),
    })
    expect(
      'Đặt lịch thành công có mã',
      booking1.res.status === 200 && /^VH[A-Z0-9]{6}$/.test(booking1.data?.booking?.code || ''),
      `${free.date} · ${free.slot} · ${booking1.data?.booking?.code || booking1.res.status}`,
    )

    const booking2 = await req('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingBody),
    })
    expect('Đặt trùng khung giờ bị chặn 409', booking2.res.status === 409)
  }

  // Kiểm tra dữ liệu không hợp lệ phải bị chặn (không phụ thuộc dữ liệu tích luỹ)
  const badBooking = await req('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studio_id: 'khong-ton-tai', date: vnDate(40), slot: 'sang', name: 'X', phone: '123', consent: true }),
  })
  expect('Đặt lịch sai dữ liệu bị chặn 400', badBooking.res.status === 400)

  const overview = await req('/api/admin/overview')
  expect('Admin overview không token bị chặn 401', overview.res.status === 401)

  const wrongLogin = await req('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'sai-mat-khau' }),
  })
  expect('Admin sai mật khẩu bị chặn', [401, 503].includes(wrongLogin.res.status), `status ${wrongLogin.res.status}`)

  if (PASSWORD) {
    const login = await req('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: PASSWORD }),
    })
    expect('Admin đăng nhập đúng', login.res.status === 200 && Boolean(login.data?.token))
    if (login.data?.token) {
      const withToken = await req('/api/admin/overview', { headers: { Authorization: `Bearer ${login.data.token}` } })
      expect('Admin overview có dữ liệu', withToken.res.status === 200 && Array.isArray(withToken.data.leads))
      const csv = await req('/api/admin/export.csv', { headers: { Authorization: `Bearer ${login.data.token}` } })
      expect('Xuất CSV', csv.res.status === 200 && csv.text.includes('Họ tên'))
    }
  } else {
    results.push('• Bỏ qua kiểm tra đăng nhập đúng (chưa đặt ADMIN_PASSWORD)')
  }

  // Kiểm tra các route hash: tất cả phải được khai báo trong app.js
  const routes = [
    'giai-phap', 'studio', 'kocviet', 'cho-phien', 'lich-live', 'hoc-vien',
    'du-an', 'tin-tuc', 've-v-hub', 'lien-he', 'chinh-sach-bao-mat', 'dieu-khoan', 'admin',
  ]
  const missing = routes.filter((r) => !appjs.text.includes(`'${r}'`) && !appjs.text.includes(`${r}:`))
  expect('Router khai báo đủ 13 nhánh trang', missing.length === 0, missing.join(', '))

  console.log(results.join('\n'))
  console.log(`\nKết quả: ${pass} đạt, ${fail} lỗi (chạy lúc ${new Date().toISOString()})\n`)
  if (fail) process.exit(1)
}

main().catch((err) => {
  console.error('Smoke test lỗi:', err)
  process.exit(1)
})
