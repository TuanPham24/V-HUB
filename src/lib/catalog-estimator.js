/**
 * Cấu hình công cụ ước tính chi phí livestream.
 * Toàn bộ công thức nằm ở đây — KHÔNG hard-code trong component.
 * Đây là ước tính tham khảo, không phải cam kết doanh số.
 */

export const ESTIMATOR_CONFIG = {
  disclaimer: 'Đây là ước tính tham khảo để lập ngân sách, không phải báo giá và không phải cam kết doanh số. V-HUB sẽ gửi đề xuất chi tiết sau khi trao đổi.',
  currency: 'đ',
  costs: {
    studioPerHour: 1800000,
    opsPerHour: 900000,
    contentFoundation: 6000000,
    kolPerSession: 12000000,
    megalivePerSession: 55000000,
    vatRate: 0.08,
  },
  industries: [
    { id: 'thoi-trang', label: 'Thời trang & phụ kiện', factor: 1.0, note: 'Nhiều SKU, cần phối đồ và đổi trả.' },
    { id: 'my-pham', label: 'Mỹ phẩm & chăm sóc', factor: 1.15, note: 'Cần hồ sơ công bố và duyệt nội dung.' },
    { id: 'gia-dung', label: 'Gia dụng & nội thất', factor: 1.05, note: 'Cần demo và giải thích bảo hành.' },
    { id: 'thuc-pham', label: 'Thực phẩm & OCOP', factor: 0.95, note: 'Cần bếp demo và câu chuyện vùng miền.' },
    { id: 'cong-nghe', label: 'Công nghệ & phụ kiện', factor: 1.1, note: 'Cần so sánh và thông số chính xác.' },
  ],
  priceBands: [
    { id: 'under-200', label: 'Dưới 200.000đ', factor: 0.9 },
    { id: '200-500', label: '200.000 – 500.000đ', factor: 1.0 },
    { id: '500-1500', label: '500.000 – 1.500.000đ', factor: 1.12 },
    { id: 'over-1500', label: 'Trên 1.500.000đ', factor: 1.25 },
  ],
  hourOptions: [8, 16, 24, 40, 60, 80],
  packages: {
    A: { id: 'A', name: 'A — Khởi động TMĐT', href: '#/giai-phap/khoi-dong-tmdt', why: 'Phù hợp để dựng nền vận hành và nội dung trước khi tăng tần suất.' },
    B: { id: 'B', name: 'B — Tăng trưởng & cam kết số', href: '#/giai-phap/brand-live-house', why: 'Phù hợp khi đã có sản phẩm tốt và cần tăng trưởng có cam kết chỉ số.' },
    C: { id: 'C', name: 'C — Thương hiệu & IP gắn VTV', href: '#/giai-phap/thuong-hieu-ip-vtv', why: 'Phù hợp khi mục tiêu là hình ảnh thương hiệu dài hạn và phủ sóng.' },
  },
}

/**
 * @param {{industry:string, priceBand:string, hours:number, needKol:boolean, megalive:number}} input
 */
export function estimateLiveCost(input) {
  const cfg = ESTIMATOR_CONFIG
  const industry = cfg.industries.find((i) => i.id === input.industry) || cfg.industries[0]
  const band = cfg.priceBands.find((p) => p.id === input.priceBand) || cfg.priceBands[1]
  const hours = Math.max(4, Math.min(120, Number(input.hours) || 16))
  const megalive = Math.max(0, Math.min(4, Number(input.megalive) || 0))
  const factor = industry.factor * band.factor
  const lines = []
  lines.push({ label: `Studio & hạ tầng (${hours} giờ)`, amount: Math.round(cfg.costs.studioPerHour * hours * factor) })
  lines.push({ label: `Đội vận hành & kỹ thuật (${hours} giờ)`, amount: Math.round(cfg.costs.opsPerHour * hours) })
  lines.push({ label: 'Nội dung nền 30 ngày', amount: cfg.costs.contentFoundation })
  if (input.needKol) {
    const sessions = Math.max(1, Math.round(hours / 20))
    lines.push({ label: `Booking KOC định danh (${sessions} phiên)`, amount: cfg.costs.kolPerSession * sessions })
  }
  if (megalive > 0) {
    lines.push({ label: `Megalive (${megalive} phiên)`, amount: cfg.costs.megalivePerSession * megalive })
  }
  const subtotal = lines.reduce((s, l) => s + l.amount, 0)
  const vat = Math.round(subtotal * cfg.costs.vatRate)
  const total = subtotal + vat
  const rangeMin = Math.round((total * 0.85) / 100000) * 100000
  const rangeMax = Math.round((total * 1.2) / 100000) * 100000
  let packageId = 'A'
  if (megalive > 0 || total > 70000000) packageId = 'C'
  else if (total > 26000000) packageId = 'B'
  return { lines, subtotal, vat, total, rangeMin, rangeMax, package: cfg.packages[packageId], industry, band, hours, megalive }
}
