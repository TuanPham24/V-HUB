/**
 * Thông tin tổ chức + cấu trúc điều hướng + nội dung khung dùng chung.
 * Dữ liệu tĩnh, có kiểu qua JSDoc. Sửa nội dung tại đây, không sửa trong component.
 */

/** @typedef {{id:string, label:string}} NavLink */
/** @typedef {{id:string, label:string, href:string, children?:NavLink[], mega?:string, groups?:{title:string,links:NavLink[]}[]}} NavItem */
/** @typedef {{id:string, title:string, short:string, benefit:string, icon:string, href:string}} Audience */

export const ORG = {
  name: 'V-HUB',
  fullName: 'V-HUB — Hệ thống MCN thương mại điện tử VTV Nam Bộ',
  legalName: 'Công ty Cổ phần Truyền thông và Thương mại số V-HUB',
  tagline: 'Value | Innovate | Trust',
  headline: 'Đưa hàng Việt lên sóng — chính danh, chuyên nghiệp, ra doanh số.',
  concept: 'Trường quay của thương mại số Việt',
  address: '232/14 Võ Thị Sáu, phường Xuân Hòa, TP.HCM',
  addressShort: '232/14 Võ Thị Sáu, P. Xuân Hòa, TP.HCM',
  hotline: '028 7300 8686',
  hotlineHref: 'tel:+842873008686',
  zalo: 'https://zalo.me/vhub',
  zaloLabel: 'Zalo OA V-HUB',
  email: 'hello@vhub.vn',
  emailHref: 'mailto:hello@vhub.vn',
  hours: 'Thứ 2 – Thứ 7, 08:30 – 18:00',
  mapEmbed:
    'https://www.google.com/maps?q=232/14%20V%C3%B5%20Th%E1%BB%8B%20S%C3%A1u%2C%20Xu%C3%A2n%20H%C3%B2a%2C%20TP.HCM&output=embed',
  kocvietAppUrl: 'https://kocviet.vn/dang-ky',
  fanpage: 'https://facebook.com/vhub.vn',
  youtube: 'https://youtube.com/@vhub',
  tiktok: 'https://tiktok.com/@vhub',
  /** Ghi chú pháp lý hiển thị ở footer — cập nhật số giấy phép thật khi có. */
  license: 'Giấy phép kinh doanh số [đang cập nhật] · Đơn vị vận hành: V-HUB',
  copyrightYear: 2026,
}

/** Cảnh báo dữ liệu mẫu dùng lại trong toàn site. */
export const DEMO_NOTICE = 'Dữ liệu minh hoạ — thay bằng dữ liệu thật trước khi công bố.'

/** @type {Audience[]} */
export const AUDIENCES = [
  {
    id: 'nhan-hang',
    title: 'Nhãn hàng & tập đoàn',
    short: 'Livestream chuẩn truyền hình, KOC định danh, doanh số đo được.',
    benefit: 'Livestream chuẩn truyền hình, KOC định danh, doanh số đo được.',
    icon: 'brand',
    href: '#/giai-phap/nhan-hang',
  },
  {
    id: 'sme',
    title: 'Doanh nghiệp vừa và nhỏ',
    short: 'Một đầu mối vận hành sàn, nội dung và livestream.',
    benefit: 'Một đầu mối vận hành sàn, nội dung và livestream.',
    icon: 'store',
    href: '#/giai-phap/doanh-nghiep-vua-va-nho',
  },
  {
    id: 'dia-phuong',
    title: 'Địa phương & OCOP',
    short: 'Đưa đặc sản ra cả nước cùng VTV Nam Bộ.',
    benefit: 'Đưa đặc sản ra cả nước cùng VTV Nam Bộ.',
    icon: 'map',
    href: '#/giai-phap/dia-phuong-ocop',
  },
  {
    id: 'nha-sang-tao',
    title: 'Nhà sáng tạo',
    short: 'Định danh KOCViet, nhận booking từ nhãn hàng uy tín.',
    benefit: 'Định danh KOCViet, nhận booking từ nhãn hàng uy tín.',
    icon: 'creator',
    href: '#/kocviet',
  },
  {
    id: 'hoc-vien',
    title: 'Học viên',
    short: 'Học livestream, Video AI, TVC AI, Phim AI tại trường quay.',
    benefit: 'Học livestream, Video AI, TVC AI, Phim AI tại trường quay.',
    icon: 'academy',
    href: '#/hoc-vien',
  },
]

/** @type {NavItem[]} */
export const NAV = [
  {
    id: 'giai-phap',
    label: 'Giải pháp',
    href: '#/giai-phap',
    mega: 'solutions',
    groups: [
      {
        title: 'Nhãn hàng & tập đoàn',
        links: [
          { id: 'brand-live-house', label: 'Brand Live House', href: '#/giai-phap/brand-live-house' },
          { id: 'van-hanh-tmdt-da-tuyen', label: 'Vận hành TMĐT đa tuyến', href: '#/giai-phap/van-hanh-tmdt-da-tuyen' },
          { id: 'thuong-hieu-ip-vtv', label: 'Thương hiệu & IP gắn VTV', href: '#/giai-phap/thuong-hieu-ip-vtv' },
          { id: 'video-ai-tvc-ai', label: 'Video AI / TVC AI', href: '#/giai-phap/video-ai-tvc-ai' },
        ],
      },
      {
        title: 'Doanh nghiệp vừa & nhỏ',
        links: [
          { id: 'khoi-dong-tmdt', label: 'Khởi động TMĐT', href: '#/giai-phap/khoi-dong-tmdt' },
          { id: 'dao-tao-doi-ngu', label: 'Đào tạo đội ngũ bán hàng số', href: '#/giai-phap/dao-tao-doi-ngu' },
        ],
      },
      {
        title: 'Địa phương & OCOP',
        links: [
          { id: 'cho-phien-dia-phuong', label: 'Chợ Phiên Phương Nam', href: '#/giai-phap/cho-phien-dia-phuong' },
          { id: 'mega-xuc-tien', label: 'Megalive xúc tiến thương mại', href: '#/giai-phap/mega-xuc-tien' },
        ],
      },
    ],
  },
  {
    id: 'studio',
    label: 'Studio',
    href: '#/studio',
    groups: [
      {
        title: 'Hạ tầng',
        links: [
          { id: 'studio-list', label: 'Danh sách studio', href: '#/studio' },
          { id: 'studio-book', label: 'Đặt lịch & bảng giá', href: '#/studio#dat-lich' },
          { id: 'studio-360', label: 'Tham quan 360°', href: '#/studio#tham-quan-360' },
        ],
      },
      {
        title: 'Dịch vụ đi kèm',
        links: [
          { id: 'studio-tech', label: 'Kỹ thuật & multi-cam', href: '#/studio' },
          { id: 'studio-host', label: 'Host & đào tạo host', href: '#/giai-phap/dao-tao-doi-ngu' },
        ],
      },
    ],
  },
  {
    id: 'kocviet',
    label: 'KOCViet',
    href: '#/kocviet',
    groups: [
      {
        title: 'Cho doanh nghiệp',
        links: [
          { id: 'koc-search', label: 'Tìm nhà sáng tạo', href: '#/kocviet/tim-kiem' },
          { id: 'koc-booking', label: 'Booking & ký quỹ', href: '#/kocviet/tim-kiem' },
        ],
      },
      {
        title: 'Cho nhà sáng tạo',
        links: [
          { id: 'koc-verify', label: 'Trở thành KOC chính danh', href: '#/kocviet/dinh-danh' },
          { id: 'koc-ambassador', label: 'Đại sứ KOCViet', href: '#/kocviet/dai-su' },
          { id: 'koc-affiliate', label: 'Affiliate', href: '#/kocviet/affiliate' },
        ],
      },
    ],
  },
  {
    id: 'cho-phien',
    label: 'Chợ Phiên Phương Nam',
    href: '#/cho-phien',
    groups: [
      {
        title: 'Chương trình',
        links: [
          { id: 'market-program', label: 'Tổng quan chương trình', href: '#/cho-phien' },
          { id: 'market-province', label: 'Các tỉnh tham gia', href: '#/cho-phien#cac-tinh' },
          { id: 'market-fund', label: 'Minh bạch quỹ thiện nguyện', href: '#/cho-phien/minh-bach' },
        ],
      },
    ],
  },
  {
    id: 'hoc-vien',
    label: 'Học viện',
    href: '#/hoc-vien',
    groups: [
      {
        title: 'Khoá học',
        links: [
          { id: 'academy-list', label: 'Tất cả khoá học', href: '#/hoc-vien' },
          { id: 'academy-video-ai', label: 'Video AI', href: '#/hoc-vien/video-ai' },
          { id: 'academy-tvc-ai', label: 'TVC AI', href: '#/hoc-vien/tvc-ai' },
          { id: 'academy-phim-ai', label: 'Phim AI', href: '#/hoc-vien/phim-ai' },
        ],
      },
    ],
  },
  {
    id: 've-v-hub',
    label: 'Về V-HUB',
    href: '#/ve-v-hub',
    groups: [
      {
        title: 'V-HUB',
        links: [
          { id: 'about', label: 'Câu chuyện & hệ sinh thái', href: '#/ve-v-hub' },
          { id: 'projects', label: 'Dự án tiêu biểu', href: '#/du-an' },
          { id: 'news', label: 'Tin tức & kiến thức', href: '#/tin-tuc' },
          { id: 'contact', label: 'Liên hệ', href: '#/lien-he' },
        ],
      },
    ],
  },
]

/** 6 lý do chọn V-HUB (dữ liệu cố định theo chỉ đạo). */
export const REASONS = [
  {
    title: 'Chính danh quốc gia',
    body: 'Thuộc hệ sinh thái VTV Nam Bộ, vận hành theo quy chuẩn nội dung và thương mại của nhà đài.',
    icon: 'shield',
  },
  {
    title: 'KOC định danh trước khi lên sóng',
    body: 'Xác minh CCCD, lịch sử phiên live và cam kết tuân thủ trước khi nhà sáng tạo xuất hiện trong phiên của nhãn hàng.',
    icon: 'verified',
  },
  {
    title: 'Hạ tầng chuẩn truyền hình',
    body: 'Multi-cam, LED, âm thanh và đội kỹ thuật nhà đài trong cùng một địa chỉ tại trung tâm TP.HCM.',
    icon: 'camera',
  },
  {
    title: 'Một đầu mối, chịu trách nhiệm kết quả',
    body: 'Từ đào tạo, định danh, sản xuất nội dung đến vận hành bán hàng — một hợp đồng, một đầu mối chịu trách nhiệm.',
    icon: 'link',
  },
  {
    title: 'Truyền thông cộng hưởng',
    body: 'Nội dung lan toả đồng thời trên sóng, nền tảng số và sự kiện trong hệ sinh thái VTV Nam Bộ.',
    icon: 'signal',
  },
  {
    title: 'Thương mại có ý nghĩa',
    body: 'Chợ Phiên Phương Nam trích 10% doanh thu vào quỹ thiện nguyện VTV Nam Bộ, công bố sao kê từng phiên.',
    icon: 'heart',
  },
]

/** Vòng quay V-HUB 6 bước. */
export const WHEEL = [
  {
    step: 1,
    title: 'Đào tạo',
    body: 'Đào tạo livestream, Video AI, TVC AI và Phim AI ngay tại trường quay.',
    href: '#/hoc-vien',
  },
  {
    step: 2,
    title: 'Định danh KOCViet',
    body: 'Xác minh danh tính, năng lực và cam kết tuân thủ trước khi lên sóng.',
    href: '#/kocviet/dinh-danh',
  },
  {
    step: 3,
    title: 'Live bán hàng',
    body: 'Daily Live, Megalive và Super-Megalive vận hành bởi đội ngũ V-HUB.',
    href: '#/lich-live',
  },
  {
    step: 4,
    title: 'Kho nội dung',
    body: 'Mỗi phiên được cắt thành Video AI, TVC, clip affiliate dùng lại đa nền tảng.',
    href: '#/giai-phap/video-ai-tvc-ai',
  },
  {
    step: 5,
    title: 'Kênh & affiliate',
    body: 'Mở rộng phân phối qua kênh sở hữu, mạng affiliate và hệ thống bán lẻ.',
    href: '#/kocviet/affiliate',
  },
  {
    step: 6,
    title: 'Nhà sáng tạo mới',
    body: 'Nhà sáng tạo trưởng thành, trở thành giảng viên và đại sứ của hệ sinh thái.',
    href: '#/kocviet/dai-su',
  },
]

/** Quy trình hợp tác 5 bước. */
export const PROCESS = [
  { step: 1, title: 'Tư vấn & chẩn đoán', body: '60 phút cùng đội ngũ V-HUB: hiện trạng sản phẩm, kênh, nội dung, nguồn lực.' },
  { step: 2, title: 'Đề xuất & cam kết', body: 'Lộ trình, gói dịch vụ, chỉ số đo và mức cam kết được ghi rõ trong đề xuất.' },
  { step: 3, title: 'Khởi động', body: 'Chuẩn bị studio, KOC, kịch bản, tồn kho và cấu hình kênh bán.' },
  { step: 4, title: 'Vận hành & tối ưu', body: 'Live theo lịch, đo chỉ số từng phiên, tối ưu giá và nội dung mỗi tuần.' },
  { step: 5, title: 'Mở rộng', body: 'Nhân rộng mô hình sang dòng hàng mới, khu vực mới và kênh phân phối mới.' },
]

export const PLATFORMS = {
  tiktok: { label: 'TikTok', icon: 'tiktok' },
  shopee: { label: 'Shopee Live', icon: 'shopee' },
  facebook: { label: 'Facebook Live', icon: 'facebook' },
  youtube: { label: 'YouTube', icon: 'youtube' },
  vhub: { label: 'V-HUB Live', icon: 'play' },
}

/** Ba tầng cam kết dịch vụ dùng lại ở nhiều trang. */
export const SERVICE_PROMISES = [
  { title: 'Định danh trước khi lên sóng', body: 'Mọi nhà sáng tạo tham gia phiên của nhãn hàng đều đã qua xác minh KOCViet.' },
  { title: 'Báo cáo sau 24 giờ', body: 'Mỗi phiên có báo cáo hiệu suất: người xem, đơn hàng, doanh thu, chi phí trên mỗi đơn.' },
  { title: 'Một đầu mối chịu trách nhiệm', body: 'Account manager xuyên suốt, không chuyển tuyến khi có vấn đề phát sinh.' },
]

export const HOTLINE_LABEL = 'Hotline'
