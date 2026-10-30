/**
 * Studio: hạ tầng, bảng giá, gói kèm, dịch vụ thêm, cấu hình tour 360°.
 * Giá là dữ liệu mẫu — cập nhật trong file này hoặc qua /admin (lịch live, số liệu, quỹ).
 */

/** @typedef {{id:string, label:string, pricePerHour:number, description:string, features:string[]}} StudioPackage */
/** @typedef {{id:string, label:string, price:number, unit:string, note?:string}} Addon */
/** @typedef {{id:string, slug:string, name:string, type:'super'|'standard'|'pod', typeLabel:string, area:number, capacity:number, pricePerHour:number, priceLabel:string, summary:string, equipment:string[], images:{src:string|null, alt:string, label:string, pending?:boolean}[], panoramaUrl:string|null, embedUrl:string|null, tags:string[]}} Studio */

/** @type {StudioPackage[]} */
export const STUDIO_PACKAGES = [
  {
    id: 'studio-only',
    label: 'Chỉ studio',
    pricePerHour: 0,
    description: 'Không gian, ánh sáng cơ bản, điện nước, wifi, điều hoà. Khách tự mang thiết bị và ekip.',
    features: ['Sân khấu và phông nền theo cấu hình', 'Hệ thống đèn cơ bản', 'Wifi và phòng chờ'],
  },
  {
    id: 'tech',
    label: 'Kèm kỹ thuật',
    pricePerHour: 300000,
    description: 'Studio kèm kỹ thuật viên trực, multi-cam, âm thanh và chuyển tín hiệu lên nền tảng.',
    features: ['1 kỹ thuật viên trực phiên', 'Multi-cam 3 góc', 'Âm thanh và livestream operator'],
  },
  {
    id: 'tech-host',
    label: 'Kèm kỹ thuật và host',
    pricePerHour: 750000,
    description: 'Trọn gói vận hành: kỹ thuật, host chuyên nghiệp, kịch bản và điều phối phiên.',
    features: ['Kỹ thuật trực và multi-cam', 'Host theo kịch bản đã duyệt', 'Điều phối viên phiên và tổng kết'],
  },
]

/** @type {Addon[]} */
export const STUDIO_ADDONS = [
  { id: 'teleprompter', label: 'Teleprompter', price: 400000, unit: 'ca' },
  { id: 'makeup', label: 'Make-up & làm tóc', price: 800000, unit: 'ca' },
  { id: 'post', label: 'Hậu kỳ clip highlight', price: 1500000, unit: 'clip' },
  { id: 'operator', label: 'Livestream operator (đa nền tảng)', price: 1000000, unit: 'ca' },
  { id: 'led-booth', label: 'LED booth di động', price: 1500000, unit: 'ca' },
  { id: 'camera-extra', label: 'Camera bổ sung', price: 900000, unit: 'ca' },
]

export const TIME_SLOTS = [
  { id: 'sang', label: 'Ca sáng', time: '08:00 – 12:00', start: 8, hours: 4 },
  { id: 'chieu', label: 'Ca chiều', time: '13:00 – 17:00', start: 13, hours: 4 },
  { id: 'toi', label: 'Ca tối', time: '18:00 – 22:00', start: 18, hours: 4 },
]

/** @type {Studio[]} */
export const STUDIOS = [
  {
    id: 'super-megalive',
    slug: 'super-megalive',
    name: 'Super-Megalive Studio',
    type: 'super',
    typeLabel: 'Super-Megalive',
    area: 220,
    capacity: 60,
    pricePerHour: 4500000,
    priceLabel: 'từ 4.500.000đ/giờ',
    summary: 'Sân khấu lớn nhất trong cụm 14 studio, dành cho Megalive, Super-Megalive và chương trình có khán giả.',
    equipment: ['6 camera (3 PTZ, 3 studio)', 'LED P3 12m × 4m', 'Hệ thống âm thanh line array', 'Bàn trộn hình 8 kênh', 'Đèn sân khấu 48 kênh', 'Phòng điều khiển riêng'],
    images: [
      { src: '/images/studio/studio-megalive.jpg', alt: 'Toàn cảnh Studio Megalive V-HUB', label: 'Studio Megalive V-HUB' },
    ],
    panoramaUrl: null,
    embedUrl: null,
    tags: ['Megalive', 'Có khán giả', 'Multi-cam 6'],
  },
  {
    id: 'megalive-01',
    slug: 'megalive-01',
    name: 'Megalive Studio 01',
    type: 'standard',
    typeLabel: 'Megalive',
    area: 140,
    capacity: 30,
    pricePerHour: 2800000,
    priceLabel: 'từ 2.800.000đ/giờ',
    summary: 'Phòng live cỡ trung cho chiến dịch nhiều khung giờ, phù hợp Daily Live quy mô lớn và Megalive ngành hàng.',
    equipment: ['4 camera', 'LED P2.5 6m × 3m', 'Âm thanh 4 loa', 'Bàn trộn hình 6 kênh', 'Đèn studio 24 kênh'],
    images: [{ src: '/images/studio/studio-megalive.jpg', alt: 'Không gian Studio Megalive V-HUB', label: 'Studio Megalive V-HUB' }],
    panoramaUrl: null,
    embedUrl: null,
    tags: ['Megalive', 'Multi-cam 4'],
  },
  {
    id: 'tieu-chuan-02',
    slug: 'tieu-chuan-02',
    name: 'Studio Tiêu chuẩn 02',
    type: 'standard',
    typeLabel: 'Tiêu chuẩn',
    area: 90,
    capacity: 20,
    pricePerHour: 1800000,
    priceLabel: 'từ 1.800.000đ/giờ',
    summary: 'Studio tiêu chuẩn cho Daily Live: phông nền linh hoạt, thay đổi bố cục theo ngành hàng trong 30 phút.',
    equipment: ['3 camera', 'Phông nền module', 'Âm thanh 2 loa', 'Đèn studio 16 kênh', 'Teleprompter'],
    images: [{ src: '/images/studio/studio-tieu-chuan.jpg', alt: 'Studio tiêu chuẩn V-HUB', label: 'Studio tiêu chuẩn V-HUB' }],
    panoramaUrl: null,
    embedUrl: null,
    tags: ['Daily Live', 'Phông module'],
  },
  {
    id: 'tieu-chuan-03',
    slug: 'tieu-chuan-03',
    name: 'Studio Tiêu chuẩn 03',
    type: 'standard',
    typeLabel: 'Tiêu chuẩn',
    area: 90,
    capacity: 20,
    pricePerHour: 1800000,
    priceLabel: 'từ 1.800.000đ/giờ',
    summary: 'Studio tiêu chuẩn có bếp và quầy demo, phù hợp ngành thực phẩm, gia dụng và nông sản.',
    equipment: ['3 camera', 'Bếp demo và quầy chế biến', 'Âm thanh 2 loa', 'Đèn studio 16 kênh', 'Tủ mát'],
    images: [{ src: null, alt: 'Studio Tiêu chuẩn 03 có bếp demo', label: 'Đang chờ ảnh: Studio Tiêu chuẩn 03 có bếp demo và quầy chế biến', pending: true }],
    panoramaUrl: null,
    embedUrl: null,
    tags: ['Daily Live', 'Bếp demo'],
  },
  {
    id: 'mini-pod-01',
    slug: 'mini-pod-01',
    name: 'Mini Pod 01',
    type: 'pod',
    typeLabel: 'Mini pod',
    area: 35,
    capacity: 6,
    pricePerHour: 650000,
    priceLabel: 'từ 650.000đ/giờ',
    summary: 'Phòng nhỏ cho nhà sáng tạo mới: đủ đèn, micro và điện thoại gimbal, đặt theo giờ.',
    equipment: ['2 camera', 'Đèn LED 3 điểm', 'Micro không dây', 'Gimbal điện thoại', 'Màn hình review'],
    images: [{ src: null, alt: 'Mini Pod 01', label: 'Đang chờ ảnh: Mini Pod 01 — phòng nhỏ với đèn, micro và điện thoại gimbal', pending: true }],
    panoramaUrl: null,
    embedUrl: null,
    tags: ['Nhà sáng tạo mới', 'Theo giờ'],
  },
  {
    id: 'mini-pod-02',
    slug: 'mini-pod-02',
    name: 'Mini Pod 02',
    type: 'pod',
    typeLabel: 'Mini pod',
    area: 35,
    capacity: 6,
    pricePerHour: 650000,
    priceLabel: 'từ 650.000đ/giờ',
    summary: 'Phòng nhỏ có phông nền thay đổi, phù hợp video review và phiên live ngắn cho học viên.',
    equipment: ['2 camera', 'Phông nền 3 màu', 'Đèn LED 3 điểm', 'Micro không dây', 'Teleprompter nhỏ'],
    images: [{ src: null, alt: 'Mini Pod 02', label: 'Đang chờ ảnh: Mini Pod 02 — phòng nhỏ có phông nền thay đổi để quay review', pending: true }],
    panoramaUrl: null,
    embedUrl: null,
    tags: ['Học viên', 'Video review'],
  },
]

export const STUDIO_FACTS = {
  totalFromMou: 14,
  standardCount: 13,
  superCount: 1,
  note: 'Theo biên bản ghi nhớ: cụm 14 studio gồm 13 studio tiêu chuẩn và 1 Super-Megalive. Website hiển thị số studio đang vận hành từ dữ liệu vận hành.',
}

export function getStudio(slug) {
  return STUDIOS.find((s) => s.slug === slug) || null
}

/** Ước tính chi phí thuê studio (chưa VAT). */
export function estimateStudio(studio, packageId, hours, addonIds) {
  if (!studio) return { total: 0, lines: [] }
  const pkg = STUDIO_PACKAGES.find((p) => p.id === packageId) || STUDIO_PACKAGES[0]
  const lines = [{ label: `${studio.name} · ${hours} giờ`, amount: studio.pricePerHour * hours }]
  if (pkg.pricePerHour > 0) {
    lines.push({ label: `${pkg.label} · ${Math.ceil(hours / 4)} ca`, amount: pkg.pricePerHour * Math.ceil(hours / 4) })
  }
  for (const id of addonIds || []) {
    const addon = STUDIO_ADDONS.find((a) => a.id === id)
    if (addon) lines.push({ label: addon.label, amount: addon.price })
  }
  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  return { total, lines }
}
