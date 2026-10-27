/**
 * Học viện V-HUB — 4 khoá do VTV Nam Bộ chủ trì. Dữ liệu cố định theo chỉ đạo.
 * Học phí, thời lượng không sửa; lịch khai giảng có thể cập nhật trong file này.
 */

/** @typedef {{date:string, label:string, status:'open'|'almost'|'full'|'past', seats:string}} StartDate */
/** @typedef {{title:string, duration:string, hours:number, feeLabel:string, feeNote?:string, audience:string, format:string, summary:string, outputs:string[], sessions:{title:string, body:string}[], instructors:{name:string, role:string, note:string}[], startDates:StartDate[], prerequisites:string[], showNote?:string}} Course */

/** @type {Course[]} */
export const COURSES = [
  {
    title: 'Video AI',
    duration: '5 buổi',
    hours: 20,
    feeLabel: '8.000.000đ',
    audience: 'Chủ shop, nhân sự marketing, nhà sáng tạo mới bắt đầu làm video bằng AI.',
    format: 'Học trực tiếp tại V-HUB, lớp tối đa 12 học viên, 60% thời lượng thực hành.',
    summary: 'Làm chủ quy trình sản xuất video ngắn bằng AI: từ ý tưởng, kịch bản, sinh hình, giọng đọc đến dựng hoàn chỉnh trong 48 giờ.',
    outputs: ['3 video ngắn hoàn chỉnh theo sản phẩm thật', 'Bộ prompt và quy trình sản xuất dùng lại', 'Tài khoản và quy trình xuất bản đa nền tảng'],
    sessions: [
      { title: 'Buổi 1 — Tư duy nội dung & cấu trúc video bán hàng', body: 'Hook 3 giây, cấu trúc 5 nhịp, chọn thông điệp theo ngành hàng. Thực hành: viết 3 kịch bản cho sản phẩm của học viên.' },
      { title: 'Buổi 2 — Sinh hình ảnh và video bằng AI', body: 'Chọn công cụ, viết prompt hình ảnh, kiểm soát nhận diện thương hiệu và tỉ lệ khung hình.' },
      { title: 'Buổi 3 — Giọng đọc, phụ đề và âm thanh', body: 'Tạo giọng đọc tiếng Việt tự nhiên, xử lý nhạc nền, phụ đề và nhịp cắt.' },
      { title: 'Buổi 4 — Dựng và hoàn thiện', body: 'Dựng trên công cụ phổ biến, chỉnh màu, xuất bản 3 tỉ lệ khung hình. Thực hành có giảng viên kèm.' },
      { title: 'Buổi 5 — Xuất bản, đo hiệu quả và bàn giao', body: 'Đăng tải, đọc chỉ số 48 giờ đầu, nhận xét sản phẩm cuối khoá và lộ trình tiếp theo.' },
    ],
    instructors: [
      { name: 'Giảng viên V-HUB', role: 'Đội sản xuất nội dung', note: 'Giảng viên đang trực tiếp vận hành các kênh nội dung của V-HUB.' },
      { name: 'Giảng viên VTV Nam Bộ', role: 'Đào tạo chuyên môn', note: 'Phụ trách chuẩn nội dung và tiêu chuẩn phát sóng.' },
    ],
    startDates: [
      { date: '2026-11-04', label: '04/11/2026', status: 'open', seats: 'Còn 5 chỗ' },
      { date: '2026-12-02', label: '02/12/2026', status: 'open', seats: 'Còn 9 chỗ' },
    ],
    prerequisites: ['Máy tính cá nhân dùng được trong lớp', 'Sản phẩm hoặc dịch vụ thật để làm bài tập'],
    showNote: 'Học viên dưới 18 tuổi cần cha mẹ hoặc người giám hộ đăng ký cùng.',
  },
  {
    title: 'TVC AI',
    duration: '8 buổi',
    hours: 32,
    feeLabel: '11.000.000đ',
    audience: 'Nhân sự marketing, nhà sản xuất nội dung đã biết làm video ngắn, cần sản xuất TVC.',
    format: 'Học trực tiếp tại V-HUB, lớp tối đa 10 học viên, thực hành tại studio.',
    summary: 'Sản xuất TVC 30 giây bằng quy trình AI kết hợp quay bổ sung tại studio: đúng nhận diện, đủ tiêu chuẩn phát sóng.',
    outputs: ['1 TVC 30 giây hoàn chỉnh', 'Storyboard và hồ sơ sản xuất', 'Quy trình duyệt nội dung nội bộ'],
    sessions: [
      { title: 'Buổi 1 — Brief và định vị thông điệp', body: 'Phân tích brief, chọn thông điệp chính, xác định khách hàng mục tiêu và ràng buộc pháp lý.' },
      { title: 'Buổi 2 — Storyboard và bố cục', body: 'Chuyển brief thành storyboard 8 khung, tính thời lượng và nhịp cảm xúc.' },
      { title: 'Buổi 3 — Tiền kỳ tại studio', body: 'Chọn bối cảnh, đạo cụ, ánh sáng và danh sách cảnh quay bổ sung.' },
      { title: 'Buổi 4 — Sinh hình AI cho TVC', body: 'Prompt nâng cao, kiểm soát nhân vật và sản phẩm, xử lý cảnh chuyển động.' },
      { title: 'Buổi 5 — Quay bổ sung tại studio', body: 'Thực hành quay sản phẩm và cảnh tay, kết hợp footage AI.' },
      { title: 'Buổi 6 — Dựng, màu và âm thanh', body: 'Dựng 30 giây, chỉnh màu, thiết kế âm thanh và nhạc bản quyền.' },
      { title: 'Buổi 7 — Duyệt nội dung và tuân thủ', body: 'Checklist 20 điểm trước khi phát sóng, xử lý tình huống phải sửa.' },
      { title: 'Buổi 8 — Trình chiếu và bàn giao', body: 'Trình chiếu TVC, nhận xét hội đồng và bàn giao file gốc.' },
    ],
    instructors: [
      { name: 'Giảng viên V-HUB', role: 'Đội sản xuất phim', note: 'Phụ trách sản xuất TVC và phim thương hiệu.' },
      { name: 'Giảng viên VTV Nam Bộ', role: 'Duyệt nội dung', note: 'Hướng dẫn tiêu chuẩn nội dung phát sóng.' },
    ],
    startDates: [
      { date: '2026-11-11', label: '11/11/2026', status: 'almost', seats: 'Sắp đầy — còn 2 chỗ' },
      { date: '2026-12-09', label: '09/12/2026', status: 'open', seats: 'Còn 7 chỗ' },
    ],
    prerequisites: ['Đã hoàn thành khoá Video AI hoặc có sản phẩm video tương đương', 'Mang theo brief sản phẩm thật'],
    showNote: 'Học viên dưới 18 tuổi cần cha mẹ hoặc người giám hộ đăng ký cùng.',
  },
  {
    title: 'Phim AI',
    duration: '8 buổi',
    hours: 32,
    feeLabel: '13.000.000đ',
    audience: 'Nhà sáng tạo nội dung, đội sản xuất muốn làm phim ngắn và phim thương hiệu.',
    format: 'Học trực tiếp tại V-HUB, lớp tối đa 10 học viên, có buổi quay tại Super-Megalive.',
    summary: 'Làm phim ngắn 5–8 phút bằng AI: từ kịch bản, tạo bối cảnh, nhân vật đến dựng hoàn chỉnh và trình chiếu.',
    outputs: ['1 phim ngắn 5–8 phút', 'Bộ hồ sơ sản xuất phim', 'Buổi trình chiếu tại V-HUB'],
    sessions: [
      { title: 'Buổi 1 — Kể chuyện và kịch bản phim ngắn', body: 'Cấu trúc 3 hồi, xây nhân vật, viết kịch bản 5–8 phút.' },
      { title: 'Buổi 2 — Bảng cảnh và thiết kế mỹ thuật', body: 'Chia cảnh, chọn bối cảnh, xây bảng màu và phong cách hình ảnh.' },
      { title: 'Buổi 3 — Tạo nhân vật và bối cảnh bằng AI', body: 'Giữ nhận diện nhân vật qua nhiều cảnh, xử lý ánh sáng và thời tiết.' },
      { title: 'Buổi 4 — Sinh cảnh và kiểm soát chuyển động', body: 'Kỹ thuật sinh cảnh dài, nối cảnh và xử lý lỗi hình.' },
      { title: 'Buổi 5 — Quay bổ sung tại Super-Megalive', body: 'Quay cảnh diễn viên và cảnh sản phẩm, kết hợp với footage AI.' },
      { title: 'Buổi 6 — Dựng phim và nhịp kể', body: 'Dựng thô, chọn nhịp, xử lý chuyển cảnh và âm thanh.' },
      { title: 'Buổi 7 — Màu, âm nhạc và phụ đề', body: 'Chỉnh màu theo bảng màu đã chọn, thiết kế âm thanh, phụ đề tiếng Việt.' },
      { title: 'Buổi 8 — Trình chiếu và bàn giao', body: 'Trình chiếu phim, phản hồi từ hội đồng và bàn giao bản master.' },
    ],
    instructors: [
      { name: 'Giảng viên V-HUB', role: 'Đạo diễn / biên tập', note: 'Phụ trách phim thương hiệu và nội dung dài kỳ.' },
      { name: 'Giảng viên VTV Nam Bộ', role: 'Cố vấn sản xuất', note: 'Cố vấn kỹ thuật hình ảnh và tiêu chuẩn phát sóng.' },
    ],
    startDates: [
      { date: '2026-11-18', label: '18/11/2026', status: 'open', seats: 'Còn 6 chỗ' },
      { date: '2026-12-16', label: '16/12/2026', status: 'open', seats: 'Còn 10 chỗ' },
    ],
    prerequisites: ['Đã hoàn thành Video AI hoặc TVC AI', 'Máy tính cấu hình trung bình trở lên'],
    showNote: 'Học viên dưới 18 tuổi cần cha mẹ hoặc người giám hộ đăng ký cùng.',
  },
  {
    title: 'Livestream bán hàng',
    duration: '6 buổi',
    hours: 24,
    feeLabel: 'Liên hệ',
    feeNote: 'Học phí theo hình thức lớp doanh nghiệp hoặc lớp cá nhân',
    audience: 'Chủ shop, nhân sự bán hàng, người mới bắt đầu livestream bán hàng chuyên nghiệp.',
    format: 'Học trực tiếp tại V-HUB, thực hành trên sân khấu thật, lớp tối đa 15 học viên.',
    summary: 'Kỹ năng livestream bán hàng tại trường quay: kịch bản, xử lý tình huống, kỹ thuật và đọc số liệu sau phiên.',
    outputs: ['2 phiên live thực hành có ghi hình', 'Bộ kịch bản và checklist phiên', 'Kết nối với KOCViet để định danh'],
    sessions: [
      { title: 'Buổi 1 — Hiểu người xem và cấu trúc phiên', body: 'Hành vi người xem, khung giờ vàng, cấu trúc 90 phút một phiên.' },
      { title: 'Buổi 2 — Kịch bản và lời chốt', body: 'Viết kịch bản theo block, luyện lời chốt và xử lý câu hỏi khó.' },
      { title: 'Buổi 3 — Kỹ thuật và ánh sáng', body: 'Bố trí camera, micro, đèn và cách phối hợp cùng kỹ thuật viên.' },
      { title: 'Buổi 4 — Thực hành phiên 1', body: 'Live 30 phút có ghi hình, nhận xét trực tiếp từ giảng viên.' },
      { title: 'Buổi 5 — Đọc số liệu và tối ưu', body: 'Đọc chỉ số phiên, xác định điểm rơi và cách điều chỉnh.' },
      { title: 'Buổi 6 — Thực hành phiên 2 và định danh', body: 'Live hoàn chỉnh, tổng kết và hướng dẫn đăng ký định danh KOCViet.' },
    ],
    instructors: [
      { name: 'Giảng viên V-HUB', role: 'Host & vận hành phiên', note: 'Giảng viên đang trực tiếp dẫn các phiên Daily Live của V-HUB.' },
      { name: 'Giảng viên VTV Nam Bộ', role: 'Đào tạo chuẩn phát sóng', note: 'Hướng dẫn tiêu chuẩn hình ảnh và phát ngôn.' },
    ],
    startDates: [
      { date: '2026-11-07', label: '07/11/2026', status: 'open', seats: 'Còn 8 chỗ' },
      { date: '2026-12-05', label: '05/12/2026', status: 'open', seats: 'Còn 12 chỗ' },
    ],
    prerequisites: ['Sản phẩm thật để thực hành', 'Sẵn sàng xuất hiện trên camera'],
    showNote: 'Học viên dưới 18 tuổi cần cha mẹ hoặc người giám hộ đăng ký cùng.',
  },
]

export const LEARNING_PATH = [
  { step: 1, title: 'Video AI', body: 'Nền tảng sản xuất video ngắn bằng AI — 5 buổi, 20 giờ.', href: '#/hoc-vien/video-ai' },
  { step: 2, title: 'TVC AI hoặc Phim AI', body: 'Rẽ nhánh theo mục tiêu: quảng cáo 30 giây hoặc phim ngắn.', href: '#/hoc-vien/tvc-ai' },
  { step: 3, title: 'Livestream bán hàng', body: 'Học song song để vận hành phiên live chuyên nghiệp.', href: '#/hoc-vien/livestream-ban-hang' },
]

export const ACADEMY_OUTCOMES = [
  { title: 'Định danh KOCViet', body: 'Học viên hoàn thành khoá được hướng dẫn hồ sơ định danh trên KOCViet.' },
  { title: 'Phòng live tại V-HUB', body: 'Được đặt Mini Pod theo giờ với mức ưu đãi dành cho học viên.' },
  { title: 'Đội sản xuất hỗ trợ', body: 'Có thể làm việc cùng đội sản xuất V-HUB trong các dự án thực tế.' },
]

export function getCourse(slug) {
  const key = String(slug || '').toLowerCase()
  const map = {
    'video-ai': 'Video AI',
    'tvc-ai': 'TVC AI',
    'phim-ai': 'Phim AI',
    'livestream-ban-hang': 'Livestream bán hàng',
  }
  return COURSES.find((c) => c.title === map[key]) || null
}

export function courseSlug(title) {
  const map = { 'Video AI': 'video-ai', 'TVC AI': 'tvc-ai', 'Phim AI': 'phim-ai', 'Livestream bán hàng': 'livestream-ban-hang' }
  return map[title] || 'video-ai'
}
