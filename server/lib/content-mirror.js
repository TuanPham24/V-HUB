/**
 * Bản sao dữ liệu TỐI THIỂU dùng riêng phía máy chủ (seed, kiểm tra giá, ngữ cảnh trợ lý).
 *
 * Vì sao có file này: nền tảng không phục vụ tài sản tĩnh đối với module mà server.js
 * import (coi là mã riêng của Worker). Nếu server import thẳng `src/lib/catalog-*`
 * thì trình duyệt sẽ nhận 404 cho các module đó. Vì vậy phía máy chủ giữ bản sao nhỏ,
 * còn toàn bộ nội dung hiển thị nằm ở `src/lib/catalog-*` (một nguồn cho giao diện).
 *
 * Khi sửa giá/ngày ở `src/lib/catalog-*`, cập nhật lại các hằng số dưới đây.
 */

export const ORG_BRIEF =
  'V-HUB — Hệ thống MCN thương mại điện tử chính danh thuộc hệ sinh thái VTV Nam Bộ. Địa chỉ: 232/14 Võ Thị Sáu, phường Xuân Hòa, TP.HCM. Hotline: 028 7300 8686. Giờ làm việc: Thứ 2 – Thứ 7, 08:30 – 18:00. Tagline: Value | Innovate | Trust.'

export const TIME_SLOTS = [
  { id: 'sang', label: 'Ca sáng', time: '08:00 – 12:00', start: 8, hours: 4 },
  { id: 'chieu', label: 'Ca chiều', time: '13:00 – 17:00', start: 13, hours: 4 },
  { id: 'toi', label: 'Ca tối', time: '18:00 – 22:00', start: 18, hours: 4 },
]

/** Giá thuê theo giờ (đồng) — khớp với src/lib/catalog-studios.js */
export const STUDIO_NAMES = {
  'super-megalive': 'Super-Megalive Studio',
  'megalive-01': 'Megalive Studio 01',
  'tieu-chuan-02': 'Studio Tiêu chuẩn 02',
  'tieu-chuan-03': 'Studio Tiêu chuẩn 03',
  'mini-pod-01': 'Mini Pod 01',
  'mini-pod-02': 'Mini Pod 02',
}

export const STUDIO_RATES = {
  'super-megalive': 4500000,
  'megalive-01': 2800000,
  'tieu-chuan-02': 1800000,
  'tieu-chuan-03': 1800000,
  'mini-pod-01': 650000,
  'mini-pod-02': 650000,
}

/** Phụ phí gói kèm theo ca 4 giờ */
export const STUDIO_PACKAGE_RATES = {
  'studio-only': 0,
  tech: 300000,
  'tech-host': 750000,
}

export const STUDIO_ADDON_RATES = {
  teleprompter: 400000,
  makeup: 800000,
  post: 1500000,
  operator: 1000000,
  'led-booth': 1500000,
  'camera-extra': 900000,
}

export function isKnownStudio(id) {
  return Object.prototype.hasOwnProperty.call(STUDIO_RATES, String(id || ''))
}

/** Ước tính chi phí thuê studio — công thức phải khớp với catalog-studios.js */
export function estimateStudioCost(studioId, packageId, hours, addonIds) {
  const rate = STUDIO_RATES[studioId]
  if (!rate) return 0
  const h = Number(hours) === 8 ? 8 : 4
  const pkgRate = STUDIO_PACKAGE_RATES[packageId] || 0
  let total = rate * h + pkgRate * Math.ceil(h / 4)
  for (const id of addonIds || []) {
    total += STUDIO_ADDON_RATES[id] || 0
  }
  return total
}

export const MARKET_SEED = [
  { id: 'vinh-long-2026', name: 'Vĩnh Long', heldAt: '2026-11-11T19:30:00+07:00', revenue: 0, donation: 0, auction: 0, orders: 0, transferredAt: null, statementUrl: null, minutesUrl: null },
  { id: 'can-tho-2026', name: 'Cần Thơ', heldAt: '2026-11-28T19:30:00+07:00', revenue: 0, donation: 0, auction: 0, orders: 0, transferredAt: null, statementUrl: null, minutesUrl: null },
  { id: 'an-giang-2026', name: 'An Giang', heldAt: '2026-12-12T19:30:00+07:00', revenue: 0, donation: 0, auction: 0, orders: 0, transferredAt: null, statementUrl: null, minutesUrl: null },
  { id: 'ca-mau-2026', name: 'Cà Mau', heldAt: '2026-12-27T19:30:00+07:00', revenue: 0, donation: 0, auction: 0, orders: 0, transferredAt: null, statementUrl: null, minutesUrl: null },
  { id: 'ben-tre-2026-07', name: 'Bến Tre', heldAt: '2026-07-18T19:30:00+07:00', revenue: 124800000, donation: 12480000, auction: 3500000, orders: 860, transferredAt: '2026-08-05', statementUrl: null, minutesUrl: null },
  { id: 'tien-giang-2026-08', name: 'Tiền Giang', heldAt: '2026-08-15T19:30:00+07:00', revenue: 183500000, donation: 18350000, auction: 4200000, orders: 1140, transferredAt: '2026-09-02', statementUrl: null, minutesUrl: null },
  { id: 'long-an-2026-09', name: 'Long An', heldAt: '2026-09-19T19:30:00+07:00', revenue: 97600000, donation: 9760000, auction: 2600000, orders: 690, transferredAt: '2026-10-03', statementUrl: null, minutesUrl: null },
]

export function epochOf(iso) {
  const ms = new Date(iso).getTime()
  return Number.isFinite(ms) ? ms : Date.now()
}

/* ---------- Sinh lịch live mẫu (giờ Việt Nam, UTC+7) ---------- */
export const VN_OFFSET_MS = 7 * 60 * 60 * 1000

export function vnParts(ms = Date.now()) {
  const d = new Date(ms + VN_OFFSET_MS)
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes(), weekday: d.getUTCDay() }
}

export function vnEpoch(year, month, day, hour = 0, minute = 0) {
  return Date.UTC(year, month - 1, day, hour, minute) - VN_OFFSET_MS
}

export function vnDateKey(ms = Date.now()) {
  const d = new Date(ms + VN_OFFSET_MS)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

const THEMES = [
  { title: 'Daily Live — Gia dụng thông minh', brand: 'Kim Long Home', platform: 'tiktok' },
  { title: 'Daily Live — Thời trang công sở', brand: 'Nhà Mây', platform: 'shopee' },
  { title: 'Daily Live — Đặc sản miền Tây', brand: 'Sông Tiền Foods', platform: 'facebook' },
  { title: 'Daily Live — Chăm sóc da mùa khô', brand: 'An Nhiên', platform: 'tiktok' },
  { title: 'Daily Live — Bếp Việt mỗi ngày', brand: 'Bếp Cô Tư', platform: 'shopee' },
  { title: 'Daily Live — Phụ kiện công nghệ', brand: 'TechOne', platform: 'youtube' },
  { title: 'Daily Live — Mẹ và bé', brand: 'An Nhiên', platform: 'tiktok' },
]

const SPECIALS = {
  3: { title: 'Megalive — Tuần lễ gia dụng', brand: 'Kim Long Home', platform: 'tiktok', hour: 19, minute: 30, duration: 210 },
  6: { title: 'Megalive — Đặc sản ba miền', brand: 'Sông Tiền Foods', platform: 'facebook', hour: 20, minute: 0, duration: 210 },
  9: { title: 'Super-Megalive — Chợ Phiên Phương Nam', brand: 'V-HUB', platform: 'vhub', hour: 20, minute: 0, duration: 240 },
}

export function buildSeedLives(now = Date.now()) {
  const out = []
  const p = vnParts(now)
  out.push({
    id: 'demo-live-now',
    title: 'Megalive minh hoạ — Đặc sản miền Tây lên sóng',
    brand: 'V-HUB',
    platform: 'vhub',
    starts_at: now - 40 * 60 * 1000,
    duration_min: 240,
    url: null,
    is_demo: 1,
  })
  for (let i = 0; i < 10; i += 1) {
    const special = SPECIALS[i]
    const dayStart = vnEpoch(p.year, p.month, p.day) + i * 86400000
    const day = vnParts(dayStart)
    const theme = THEMES[i % THEMES.length]
    const start = special ? vnEpoch(day.year, day.month, day.day, special.hour, special.minute) : vnEpoch(day.year, day.month, day.day, 20, 0)
    out.push({
      id: `seed-live-${i}`,
      title: special ? special.title : theme.title,
      brand: special ? special.brand : theme.brand,
      platform: special ? special.platform : theme.platform,
      starts_at: start,
      duration_min: special ? special.duration : 120,
      url: null,
      is_demo: 1,
    })
  }
  return out
}

/* ---------- Ngữ cảnh cho trợ lý LLM ---------- */
export const ASSISTANT_BRIEF = [
  ORG_BRIEF,
  'Định vị: "Trường quay của thương mại số Việt". Một đầu mối: đào tạo, định danh KOCViet, sản xuất nội dung & video AI, livestream (Daily Live, Megalive, Super-Megalive), vận hành TMĐT đa tuyến, affiliate, cho thuê studio, Chợ Phiên Phương Nam.',
  'Gói dịch vụ: A — Khởi động TMĐT (từ 18.000.000đ/tháng, không cam kết doanh số); B — Tăng trưởng & cam kết số (liên hệ, cam kết theo KPI thoả thuận); C — Thương hiệu & IP gắn VTV (liên hệ); D — Booking Creator (từ 12.000.000đ/phiên); E — Địa phương/OCOP (liên hệ).',
  'Studio: cụm 14 studio theo biên bản ghi nhớ (13 tiêu chuẩn, 1 Super-Megalive). Giá tham khảo: Super-Megalive từ 4.500.000đ/giờ; Megalive 01 từ 2.800.000đ/giờ; Tiêu chuẩn từ 1.800.000đ/giờ; Mini Pod từ 650.000đ/giờ. Ca 4 giờ: 08:00–12:00, 13:00–17:00, 18:00–22:00.',
  'Khoá học do VTV Nam Bộ chủ trì: Video AI 5 buổi/20 giờ/8.000.000đ; TVC AI 8 buổi/32 giờ/11.000.000đ; Phim AI 8 buổi/32 giờ/13.000.000đ; Livestream bán hàng (học phí liên hệ). Lộ trình: Video AI → TVC AI hoặc Phim AI.',
  'Chợ Phiên Phương Nam mùa 1 (dự kiến): Vĩnh Long 11/11/2026, Cần Thơ 28/11/2026, An Giang 12/12/2026, Cà Mau 27/12/2026. Mỗi phiên trích 10% doanh thu vào quỹ thiện nguyện VTV Nam Bộ, công bố sao kê.',
  'KOCViet: nhà sáng tạo được định danh (CCCD, lịch sử phiên, cam kết). Thang hạng: Tân binh, Chính danh, Ngôi sao, Nghệ sĩ. Booking có hợp đồng số và ký quỹ.',
  'Quy tắc trả lời: không bịa số liệu thành tích, không cam kết doanh số, không chốt giá cuối; mời đặt lịch tư vấn 60 phút hoặc để lại số điện thoại.',
].join('\n')
