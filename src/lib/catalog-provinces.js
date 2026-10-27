/**
 * Chợ Phiên Phương Nam — mùa 1 (dự kiến) + 3 phiên thí điểm (dữ liệu mẫu)
 * và cấu hình minh bạch quỹ thiện nguyện.
 * Mọi trạng thái được suy ra từ thời gian thực, không lưu cứng.
 */

export const MARKET_DURATION_MIN = 180

export const MARKET_MESSAGE = 'Mỗi đơn hàng góp một phần yêu thương — đặc sản của quê hương, trở về với quê hương.'

/** @typedef {{id:string, slug:string, name:string, season:number, heldAt:string, ambassador:string, summary:string, imageSrc:string, imageLabel:string, products:{name:string, priceLabel:string, note:string}[], revenue:number, donation:number, auction:number, orders:number, transferredAt?:string|null, statementUrl?:string|null, minutesUrl?:string|null}} Market */

/** @type {Market[]} */
export const MARKETS = [
  {
    id: 'vinh-long-2026',
    slug: 'vinh-long',
    name: 'Vĩnh Long',
    season: 1,
    heldAt: '2026-11-11T19:30:00+07:00',
    ambassador: 'Nghệ sĩ đại sứ VTV Nam Bộ (đang cập nhật)',
    summary: 'Phiên mở màn mùa 1: trái cây, gạo, mắm và thủ công mỹ nghệ từ các huyện ven sông Tiền.',
    imageSrc: '/images/cho-phien/vinh-long.jpg',
    imageLabel: 'Ảnh thật: vườn trái cây Vĩnh Long',
    products: [
      { name: 'Bưởi Năm Roi', priceLabel: 'từ 45.000đ/kg', note: 'Chủ thể OCOP huyện Bình Tân' },
      { name: 'Gạo thơm Vĩnh Long', priceLabel: 'từ 32.000đ/kg', note: 'Hợp tác xã (tên minh hoạ)' },
      { name: 'Mắm cá linh', priceLabel: 'từ 85.000đ/hũ', note: 'Làng nghề ven sông' },
    ],
    revenue: 0,
    donation: 0,
    auction: 0,
    orders: 0,
    transferredAt: null,
    statementUrl: null,
    minutesUrl: null,
  },
  {
    id: 'can-tho-2026',
    slug: 'can-tho',
    name: 'Cần Thơ',
    season: 1,
    heldAt: '2026-11-28T19:30:00+07:00',
    ambassador: 'Nghệ sĩ đại sứ VTV Nam Bộ (đang cập nhật)',
    summary: 'Phiên thứ hai: gạo, thủy sản khô, bánh dân gian và đặc sản chợ nổi.',
    imageSrc: '/images/cho-phien/can-tho.jpg',
    imageLabel: 'Ảnh thật: chợ nổi Cần Thơ',
    products: [
      { name: 'Gạo ST25', priceLabel: 'từ 38.000đ/kg', note: 'Chủ thể OCOP' },
      { name: 'Khô cá lóc', priceLabel: 'từ 120.000đ/khay', note: 'Cơ sở sản xuất (tên minh hoạ)' },
      { name: 'Bánh tét lá cẩm', priceLabel: 'từ 65.000đ/đòn', note: 'Làng nghề truyền thống' },
    ],
    revenue: 0,
    donation: 0,
    auction: 0,
    orders: 0,
    transferredAt: null,
    statementUrl: null,
    minutesUrl: null,
  },
  {
    id: 'an-giang-2026',
    slug: 'an-giang',
    name: 'An Giang',
    season: 1,
    heldAt: '2026-12-12T19:30:00+07:00',
    ambassador: 'Nghệ sĩ đại sứ VTV Nam Bộ (đang cập nhật)',
    summary: 'Phiên thứ ba: gạo, đường thốt nốt, mắm và sản phẩm từ vùng Bảy Núi.',
    imageSrc: '/images/cho-phien/an-giang.jpg',
    imageLabel: 'Ảnh thật: vùng Bảy Núi, An Giang',
    products: [
      { name: 'Đường thốt nốt', priceLabel: 'từ 55.000đ/kg', note: 'Chủ thể OCOP' },
      { name: 'Gạo nàng Nhen', priceLabel: 'từ 42.000đ/kg', note: 'Hợp tác xã (tên minh hoạ)' },
      { name: 'Mắm thái Châu Đốc', priceLabel: 'từ 95.000đ/hũ', note: 'Cơ sở truyền thống' },
    ],
    revenue: 0,
    donation: 0,
    auction: 0,
    orders: 0,
    transferredAt: null,
    statementUrl: null,
    minutesUrl: null,
  },
  {
    id: 'ca-mau-2026',
    slug: 'ca-mau',
    name: 'Cà Mau',
    season: 1,
    heldAt: '2026-12-27T19:30:00+07:00',
    ambassador: 'Nghệ sĩ đại sứ VTV Nam Bộ (đang cập nhật)',
    summary: 'Phiên khép mùa: tôm, cua, mắm và sản phẩm từ rừng ngập mặn.',
    imageSrc: '/images/cho-phien/ca-mau.jpg',
    imageLabel: 'Ảnh thật: rừng ngập mặn Cà Mau',
    products: [
      { name: 'Tôm sú khô', priceLabel: 'từ 260.000đ/kg', note: 'Chủ thể OCOP' },
      { name: 'Cua Cà Mau', priceLabel: 'theo giá phiên', note: 'Hợp tác xã (tên minh hoạ)' },
      { name: 'Mật ong rừng tràm', priceLabel: 'từ 180.000đ/lít', note: 'Cơ sở khai thác' },
    ],
    revenue: 0,
    donation: 0,
    auction: 0,
    orders: 0,
    transferredAt: null,
    statementUrl: null,
    minutesUrl: null,
  },
  {
    id: 'ben-tre-2026-07',
    slug: 'ben-tre',
    name: 'Bến Tre',
    season: 0,
    heldAt: '2026-07-18T19:30:00+07:00',
    ambassador: 'Nghệ sĩ đại sứ VTV Nam Bộ (đang cập nhật)',
    summary: 'Phiên thí điểm: dừa và sản phẩm từ dừa, kết nối 4 KOC nông sản.',
    imageSrc: '/images/cho-phien/ben-tre.jpg',
    imageLabel: 'Ảnh thật: vườn dừa Bến Tre',
    products: [],
    revenue: 124800000,
    donation: 12480000,
    auction: 3500000,
    orders: 860,
    transferredAt: '2026-08-05',
    statementUrl: null,
    minutesUrl: null,
  },
  {
    id: 'tien-giang-2026-08',
    slug: 'tien-giang',
    name: 'Tiền Giang',
    season: 0,
    heldAt: '2026-08-15T19:30:00+07:00',
    ambassador: 'Nghệ sĩ đại sứ VTV Nam Bộ (đang cập nhật)',
    summary: 'Phiên thí điểm: trái cây và đặc sản miệt vườn, có đào tạo người bán tại chỗ.',
    imageSrc: '/images/cho-phien/tien-giang.jpg',
    imageLabel: 'Ảnh thật: vườn trái cây Tiền Giang',
    products: [],
    revenue: 183500000,
    donation: 18350000,
    auction: 4200000,
    orders: 1140,
    transferredAt: '2026-09-02',
    statementUrl: null,
    minutesUrl: null,
  },
  {
    id: 'long-an-2026-09',
    slug: 'long-an',
    name: 'Long An',
    season: 0,
    heldAt: '2026-09-19T19:30:00+07:00',
    ambassador: 'Nghệ sĩ đại sứ VTV Nam Bộ (đang cập nhật)',
    summary: 'Phiên thí điểm: gạo, thanh long và thực phẩm chế biến.',
    imageSrc: '/images/cho-phien/long-an.jpg',
    imageLabel: 'Ảnh thật: đồng lúa Long An',
    products: [],
    revenue: 97600000,
    donation: 9760000,
    auction: 2600000,
    orders: 690,
    transferredAt: '2026-10-03',
    statementUrl: null,
    minutesUrl: null,
  },
]

export const MARKET_PROVINCES = [
  { name: 'Vĩnh Long', status: 'season1' },
  { name: 'Cần Thơ', status: 'season1' },
  { name: 'An Giang', status: 'season1' },
  { name: 'Cà Mau', status: 'season1' },
  { name: 'Bến Tre', status: 'pilot' },
  { name: 'Tiền Giang', status: 'pilot' },
  { name: 'Long An', status: 'pilot' },
  { name: 'Đồng Tháp', status: 'planned' },
  { name: 'Trà Vinh', status: 'planned' },
  { name: 'Sóc Trăng', status: 'planned' },
  { name: 'Bạc Liêu', status: 'planned' },
  { name: 'Kiên Giang', status: 'planned' },
  { name: 'Hậu Giang', status: 'planned' },
  { name: 'Tây Ninh', status: 'planned' },
]

export const MARKET_STEPS = [
  { step: 1, title: 'Đăng ký mùa', body: 'Tỉnh gửi danh sách chủ thể OCOP và đầu mối phối hợp qua form đăng ký.' },
  { step: 2, title: 'Chuẩn hoá hồ sơ', body: 'V-HUB rà soát hồ sơ pháp lý, nhãn mác, hình ảnh và câu chuyện sản phẩm.' },
  { step: 3, title: 'Đào tạo tại chỗ', body: 'Đào tạo 2 ngày cho người bán hàng số của tỉnh và các chủ thể tham gia.' },
  { step: 4, title: 'Tổ chức phiên', body: 'Megalive 3 giờ tại Super-Megalive, bán đa nền tảng, có KOC định danh tham gia.' },
  { step: 5, title: 'Công bố kết quả & quỹ', body: 'Báo cáo doanh thu, sao kê 10% trích quỹ và biên bản trao tặng trong 7 ngày làm việc.' },
]

export const FUND_POLICY = {
  percent: 10,
  note: 'Mỗi phiên trích 10% doanh thu thực thu vào quỹ thiện nguyện VTV Nam Bộ. Khoản đấu giá (nếu có) được cộng riêng và công bố cùng sao kê.',
  updatedNote: 'Số liệu được cập nhật sau mỗi phiên; sao kê và biên bản trao tặng do đơn vị vận hành công bố.',
}

export function marketEndAt(market) {
  return new Date(market.heldAt).getTime() + MARKET_DURATION_MIN * 60 * 1000
}

/** @returns {'upcoming'|'live'|'ended'} */
export function marketState(market, now = Date.now()) {
  const start = new Date(market.heldAt).getTime()
  if (now < start) return 'upcoming'
  if (now < marketEndAt(market)) return 'live'
  return 'ended'
}

export function upcomingMarkets() {
  return MARKETS.filter((m) => m.season === 1).sort((a, b) => new Date(a.heldAt) - new Date(b.heldAt))
}

export function nextMarket(now = Date.now()) {
  const list = MARKETS.slice().sort((a, b) => new Date(a.heldAt) - new Date(b.heldAt))
  return list.find((m) => marketEndAt(m) > now) || list[list.length - 1]
}

export function endedMarkets() {
  return MARKETS.filter((m) => m.season === 0)
}

export function fundTotals() {
  const rows = endedMarkets().map((m) => ({
    id: m.id,
    name: m.name,
    heldAt: m.heldAt,
    revenue: m.revenue,
    donation: m.donation,
    auction: m.auction,
    transferredAt: m.transferredAt,
    statementUrl: m.statementUrl,
    minutesUrl: m.minutesUrl,
  }))
  const total = rows.reduce((sum, r) => sum + r.donation + r.auction, 0)
  return { rows, total, donation: rows.reduce((s, r) => s + r.donation, 0), auction: rows.reduce((s, r) => s + r.auction, 0) }
}

export function getMarket(slug) {
  return MARKETS.find((m) => m.slug === slug) || null
}
