/**
 * Giải pháp theo người xem + gói dịch vụ + trang chi tiết từng giải pháp.
 * Giá chỉ ghi "từ …" hoặc "Liên hệ" theo quy định.
 */

/** @typedef {{id:string, name:string, priceLabel:string, priceNote?:string, suitableFor:string, frequency:string, team:string, report:string, commitment:string, highlight?:boolean, includes:string[]}} ServicePackage */
/** @typedef {{title:string, body:string}} TextBlock */
/** @typedef {{slug:string, imageSrc:string|null, imagePending?:boolean, imageLabel?:string, group:'nhan-hang'|'sme'|'dia-phuong', title:string, kicker:string, summary:string, priceLabel:string, bullets:string[], deliverables:TextBlock[], metrics?:{label:string, value:string}[], faq?:TextBlock[]}} Solution */

/** @type {ServicePackage[]} */
export const PACKAGES = [
  {
    id: 'A',
    name: 'A — Khởi động TMĐT',
    priceLabel: 'từ 18.000.000đ/tháng',
    suitableFor: 'Doanh nghiệp mới lên sàn, cần dựng nền móng vận hành và nội dung.',
    frequency: '4 phiên live/tháng',
    team: '1 host, 1 kỹ thuật, 1 nội dung',
    report: 'Báo cáo tuần + tổng kết tháng',
    commitment: 'Không cam kết doanh số',
    includes: ['Chuẩn hoá gian hàng trên sàn', 'Bộ 8 nội dung nền (ảnh, video ngắn)', '4 phiên live tại studio tiêu chuẩn', 'Đào tạo 4 buổi cho đội ngũ nội bộ'],
  },
  {
    id: 'B',
    name: 'B — Tăng trưởng & cam kết số',
    priceLabel: 'Liên hệ',
    priceNote: 'Báo giá theo ngành hàng và mục tiêu doanh thu',
    suitableFor: 'Thương hiệu đã có sản phẩm tốt, cần tăng trưởng có kiểm soát và cam kết chỉ số.',
    frequency: '12–20 phiên live/tháng',
    team: 'Đội dự án 6 người + nhóm KOC định danh',
    report: 'Dashboard realtime, báo cáo tuần',
    commitment: 'Cam kết theo KPI thoả thuận',
    highlight: true,
    includes: ['Daily Live theo khung giờ vàng', '2 Megalive/tháng', 'Booking KOC theo hạng', 'Sản xuất Video AI & TVC AI', 'Tối ưu giá – tồn kho – voucher'],
  },
  {
    id: 'C',
    name: 'C — Thương hiệu & IP gắn VTV',
    priceLabel: 'Liên hệ',
    suitableFor: 'Tập đoàn cần xây dựng hình ảnh thương hiệu dài hạn gắn với hệ sinh thái VTV Nam Bộ.',
    frequency: 'Theo chiến dịch (3–12 tháng)',
    team: 'Đội sản xuất phim + đội thương hiệu',
    report: 'Báo cáo chiến dịch + báo cáo lan toả',
    commitment: 'Cam kết theo phạm vi chiến dịch',
    includes: ['Phim thương hiệu và TVC AI', 'Chương trình livestream đặc biệt', 'Talkshow và toạ đàm trong hệ sinh thái', 'Đại sứ thương hiệu KOCViet'],
  },
  {
    id: 'D',
    name: 'D — Booking Creator',
    priceLabel: 'từ 12.000.000đ/phiên',
    suitableFor: 'Nhãn hàng cần booking nhanh một nhà sáng tạo đã định danh cho phiên cụ thể.',
    frequency: 'Theo yêu cầu',
    team: 'Booking desk + KOC',
    report: 'Báo cáo phiên trong 24 giờ',
    commitment: 'Cam kết chất lượng phiên',
    includes: ['Lọc và đề xuất KOC theo ngành, khu vực, ngân sách', 'Hợp đồng số và ký quỹ', 'Kịch bản phiên và duyệt nội dung', 'Đối soát và thanh toán minh bạch'],
  },
  {
    id: 'E',
    name: 'E — Địa phương / OCOP',
    priceLabel: 'Liên hệ',
    suitableFor: 'Sở, ngành, hợp tác xã và chủ thể OCOP cần đưa đặc sản ra toàn quốc.',
    frequency: 'Theo mùa Chợ Phiên',
    team: 'Đội dự án địa phương + KOC + đơn vị vận chuyển',
    report: 'Báo cáo mùa + báo cáo quỹ thiện nguyện',
    commitment: 'Cam kết theo phạm vi mùa',
    includes: ['Chuẩn hoá câu chuyện sản phẩm', 'Đào tạo người bán hàng số tại địa phương', 'Megalive xúc tiến thương mại', 'Affiliate toàn quốc', 'Truyền thông trong hệ sinh thái VTV Nam Bộ'],
  },
]

/** @type {Solution[]} */
export const SOLUTIONS = [
  {
    slug: 'brand-live-house',
    imageSrc: '/images/studio/studio-tieu-chuan.jpg',
    group: 'nhan-hang',
    title: 'Brand Live House',
    kicker: 'Nhãn hàng & tập đoàn',
    summary: 'Dựng và vận hành "nhà live" riêng cho thương hiệu: studio cố định, đội ngũ cố định, lịch phát cố định, chỉ số tăng dần theo tuần.',
    priceLabel: 'từ 18.000.000đ/tháng',
    bullets: ['Studio riêng theo khung giờ cố định', 'Đội host – kỹ thuật – nội dung chuyên trách', 'KOC định danh theo từng dòng hàng', 'Báo cáo hiệu suất từng phiên'],
    deliverables: [
      { title: 'Thiết kế nhà live', body: 'Bố trí sân khấu, đèn, phông nền, góc máy và luồng chạy phiên theo ngành hàng và nhận diện thương hiệu.' },
      { title: 'Lịch phát & kịch bản', body: 'Khung giờ vàng theo hành vi mua, kịch bản theo chủ đề tuần, kịch bản xử lý tình huống và câu chốt đơn.' },
      { title: 'Vận hành & tối ưu', body: 'Đo chỉ số từng phiên, A/B kịch bản, tối ưu combo và voucher theo dữ liệu bán thực tế.' },
    ],
    metrics: [
      { label: 'Tần suất', value: '4–20 phiên/tháng' },
      { label: 'Thời lượng mỗi phiên', value: '2–4 giờ' },
      { label: 'Báo cáo', value: 'Trong 24 giờ' },
    ],
    faq: [
      { title: 'Có cam kết doanh số không?', body: 'Gói A không cam kết doanh số. Gói B có cam kết theo KPI được hai bên thoả thuận và ghi rõ trong hợp đồng.' },
      { title: 'Nhãn hàng có được duyệt kịch bản?', body: 'Có. Mọi kịch bản, danh mục sản phẩm và ngôn từ đều được duyệt trước khi phát sóng.' },
    ],
  },
  {
    slug: 'van-hanh-tmdt-da-tuyen',
    imageSrc: null,
    imagePending: true,
    imageLabel: 'Đang chờ ảnh: đội vận hành gian hàng, đơn hàng và dữ liệu TMĐT đa nền tảng',
    group: 'nhan-hang',
    title: 'Vận hành TMĐT đa tuyến',
    kicker: 'Nhãn hàng & tập đoàn',
    summary: 'Một đầu mối vận hành nhiều sàn và nhiều kênh: chuẩn hoá gian hàng, tồn kho, giá, voucher, chăm sóc khách và đối soát.',
    priceLabel: 'Liên hệ',
    bullets: ['Chuẩn hoá gian hàng đa sàn', 'Quản trị tồn kho và giá bán', 'Đối soát đơn hàng – hoàn tiền', 'Báo cáo hợp nhất theo kênh'],
    deliverables: [
      { title: 'Kiểm toán gian hàng', body: 'Rà soát 32 điểm chuẩn trên từng sàn: hình ảnh, mô tả, chính sách, vận chuyển, đánh giá.' },
      { title: 'Vận hành hằng ngày', body: 'Đăng bán, cập nhật giá, xử lý đơn, chăm sóc khách, xử lý khiếu nại theo SLA.' },
      { title: 'Báo cáo hợp nhất', body: 'Một bảng duy nhất cho mọi kênh: doanh thu, chi phí sàn, tỷ lệ hoàn, lợi nhuận gộp.' },
    ],
    metrics: [
      { label: 'Sàn hỗ trợ', value: 'Shopee · TikTok · Lazada · Tiki' },
      { label: 'SLA phản hồi khách', value: '≤ 2 giờ' },
      { label: 'Báo cáo', value: 'Hằng ngày' },
    ],
  },
  {
    slug: 'thuong-hieu-ip-vtv',
    imageSrc: '/images/team/doi-san-xuat.jpg',
    group: 'nhan-hang',
    title: 'Thương hiệu & IP gắn VTV',
    kicker: 'Nhãn hàng & tập đoàn',
    summary: 'Xây dựng hình ảnh thương hiệu dài hạn bằng phim, talkshow và chương trình gắn với hệ sinh thái VTV Nam Bộ.',
    priceLabel: 'Liên hệ',
    bullets: ['Phim thương hiệu và phóng sự', 'Talkshow, toạ đàm trong hệ sinh thái', 'Đại sứ thương hiệu KOCViet', 'Truyền thông đa nền tảng'],
    deliverables: [
      { title: 'Định vị & thông điệp', body: 'Xây dựng câu chuyện thương hiệu gắn với giá trị vùng miền và tiêu chuẩn nhà đài.' },
      { title: 'Sản xuất', body: 'Phim thương hiệu, TVC AI, phóng sự và chương trình livestream đặc biệt.' },
      { title: 'Lan toả', body: 'Phân phối trên sóng, nền tảng số và hệ sinh thái sự kiện của VTV Nam Bộ.' },
    ],
    faq: [{ title: 'Có được dùng logo VTV không?', body: 'Việc sử dụng thương hiệu VTV và logo đối tác phải có văn bản cho phép trước khi công bố. V-HUB chỉ đưa logo vào website sau khi có xác nhận.' }],
  },
  {
    slug: 'video-ai-tvc-ai',
    imageSrc: null,
    imagePending: true,
    imageLabel: 'Đang chờ ảnh: quy trình sản xuất Video AI / TVC AI tại máy trạm',
    group: 'nhan-hang',
    title: 'Video AI / TVC AI',
    kicker: 'Nhãn hàng & tập đoàn',
    summary: 'Sản xuất video ngắn, TVC và phim bằng quy trình AI kết hợp hậu kỳ chuyên nghiệp — nhanh, đúng nhận diện, đủ tiêu chuẩn phát sóng.',
    priceLabel: 'từ 8.000.000đ/video',
    bullets: ['Storyboard và kịch bản trong 48 giờ', 'Quy trình AI + hậu kỳ tại V-HUB', 'Định dạng dọc, vuông, ngang', 'Kho nội dung dùng lại đa kênh'],
    deliverables: [
      { title: 'Tiền kỳ', body: 'Ý tưởng, storyboard, lựa chọn giọng đọc và phong cách hình ảnh.' },
      { title: 'Sản xuất', body: 'Sinh hình bằng AI, quay bổ sung tại studio khi cần, dựng và chỉnh màu.' },
      { title: 'Hậu kỳ & bàn giao', body: 'Motion, phụ đề tiếng Việt, phiên bản 9:16 – 1:1 – 16:9 kèm file gốc.' },
    ],
    metrics: [
      { label: 'Thời gian sản xuất', value: '3–5 ngày làm việc' },
      { label: 'Phiên bản bàn giao', value: '3 tỉ lệ khung hình' },
      { label: 'Bản quyền', value: 'Thuộc về nhãn hàng' },
    ],
  },
  {
    slug: 'booking-creator',
    imageSrc: '/images/team/doi-booking-koc.jpg',
    group: 'nhan-hang',
    title: 'Booking Creator',
    kicker: 'Nhãn hàng & tập đoàn',
    summary: 'Booking nhà sáng tạo đã định danh KOCViet cho phiên live, video review hoặc chiến dịch affiliate — hợp đồng số, ký quỹ, đối soát tự động.',
    priceLabel: 'từ 12.000.000đ/phiên',
    bullets: ['Đề xuất KOC theo ngành và ngân sách', 'Hồ sơ định danh và lịch sử phiên', 'Hợp đồng số và ký quỹ', 'Đối soát sau phiên'],
    deliverables: [
      { title: 'Lọc và đề xuất', body: 'Trong 48 giờ, V-HUB gửi danh sách 3–5 KOC phù hợp kèm chỉ số và mức giá tham khảo.' },
      { title: 'Hợp đồng & ký quỹ', body: 'Điều khoản nội dung, thời gian, mức phí và ký quỹ được xử lý trên nền tảng KOCViet.' },
      { title: 'Đối soát', body: 'Báo cáo phiên, đơn hàng và thanh toán được đối soát tự động sau khi kết thúc.' },
    ],
  },
  {
    slug: 'khoi-dong-tmdt',
    imageSrc: null,
    imagePending: true,
    imageLabel: 'Đang chờ ảnh: đội ngũ thiết lập gian hàng TMĐT cho doanh nghiệp mới',
    group: 'sme',
    title: 'Khởi động TMĐT',
    kicker: 'Doanh nghiệp vừa và nhỏ',
    summary: 'Gói dành cho doanh nghiệp mới lên sàn: dựng gian hàng, làm nội dung nền, tập live và có đội ngũ tự vận hành sau 90 ngày.',
    priceLabel: 'từ 18.000.000đ/tháng',
    bullets: ['Gian hàng chuẩn 32 điểm', 'Bộ nội dung nền 30 ngày', '4 phiên live/tháng tại studio', 'Đào tạo đội ngũ 4 buổi'],
    deliverables: [
      { title: '30 ngày đầu', body: 'Chuẩn hoá gian hàng, chụp ảnh sản phẩm, viết mô tả, thiết lập chính sách và vận chuyển.' },
      { title: '60 ngày tiếp theo', body: 'Tập live tại studio tiêu chuẩn, xây kịch bản và luyện xử lý tình huống cùng kỹ thuật viên.' },
      { title: '90 ngày', body: 'Bàn giao bộ quy trình, checklist và lịch nội dung để doanh nghiệp tự vận hành.' },
    ],
    faq: [{ title: 'Doanh nghiệp chưa có sản phẩm thì sao?', body: 'V-HUB tư vấn chọn nhóm sản phẩm phù hợp với năng lực sản xuất và ngân sách trước khi khởi động.' }],
  },
  {
    slug: 'dao-tao-doi-ngu',
    imageSrc: '/images/team/doi-dao-tao.jpg',
    group: 'sme',
    title: 'Đào tạo đội ngũ bán hàng số',
    kicker: 'Doanh nghiệp vừa và nhỏ',
    summary: 'Đào tạo tại trường quay cho đội ngũ nội bộ: kỹ năng live, xử lý tình huống, sản xuất video AI và đọc số liệu bán hàng.',
    priceLabel: 'Liên hệ',
    bullets: ['Học tại studio thật', 'Thực hành trên sản phẩm của doanh nghiệp', 'Giảng viên là người vận hành phiên thật', 'Bộ checklist mang về'],
    deliverables: [
      { title: 'Khảo sát năng lực', body: 'Đánh giá kỹ năng hiện tại của đội ngũ và xác định khoảng trống cần đào tạo.' },
      { title: 'Đào tạo thực hành', body: '60% thời lượng là thực hành trên sân khấu, có ghi hình và nhận xét từng người.' },
      { title: 'Đánh giá sau đào tạo', body: 'Bài kiểm tra tình huống và báo cáo tiến bộ cho quản lý.' },
    ],
  },
  {
    slug: 'cho-phien-dia-phuong',
    imageSrc: '/images/cho-phien/vinh-long.jpg',
    group: 'dia-phuong',
    title: 'Gói địa phương — Chợ Phiên Phương Nam',
    kicker: 'Địa phương & OCOP',
    summary: 'Đưa đặc sản của tỉnh lên sóng toàn quốc trong một mùa Chợ Phiên: chuẩn hoá sản phẩm, đào tạo người bán, Megalive và affiliate.',
    priceLabel: 'Liên hệ',
    bullets: ['Chuẩn hoá và kể chuyện sản phẩm', 'Đào tạo người bán hàng số tại chỗ', 'Megalive xúc tiến thương mại', 'Trích 10% doanh thu vào quỹ thiện nguyện'],
    deliverables: [
      { title: 'Trước phiên 30 ngày', body: 'Chọn sản phẩm, chuẩn hoá hồ sơ OCOP, chụp ảnh, viết câu chuyện và đào tạo người bán.' },
      { title: 'Ngày phiên', body: 'Megalive 3 giờ tại studio Super-Megalive, kết nối KOC toàn quốc và bán trên đa nền tảng.' },
      { title: 'Sau phiên', body: 'Báo cáo kết quả, sao kê quỹ, biên bản trao tặng và kế hoạch mùa tiếp theo.' },
    ],
    metrics: [
      { label: 'Thời lượng Megalive', value: '3 giờ' },
      { label: 'Trích quỹ', value: '10% doanh thu' },
      { label: 'Báo cáo', value: 'Trong 7 ngày' },
    ],
  },
  {
    slug: 'mega-xuc-tien',
    imageSrc: '/images/studio/studio-megalive.jpg',
    group: 'dia-phuong',
    title: 'Megalive xúc tiến thương mại',
    kicker: 'Địa phương & OCOP',
    summary: 'Chương trình livestream quy mô lớn cho sở, ngành và hiệp hội: một phiên, nhiều tỉnh, nhiều sản phẩm, một thông điệp.',
    priceLabel: 'Liên hệ',
    bullets: ['Sân khấu Super-Megalive', 'Nhiều tỉnh tham gia cùng phiên', 'Nghệ sĩ đại sứ và KOC định danh', 'Truyền thông hệ sinh thái VTV'],
    deliverables: [
      { title: 'Kịch bản chương trình', body: 'Kịch bản 3 giờ với các phân đoạn theo tỉnh, theo nhóm sản phẩm và phần trao đổi với nghệ sĩ.' },
      { title: 'Điều phối đa tỉnh', body: 'Mỗi tỉnh có đầu mối, danh mục sản phẩm và người đại diện tham gia phát sóng.' },
      { title: 'Truyền thông', body: 'Bộ ấn phẩm truyền thông, clip hậu trường và nội dung lan toả sau chương trình.' },
    ],
  },
]

/** @type {Record<string, {slug:string, title:string, kicker:string, heroTitle:string, heroSub:string, pains:TextBlock[], models?:TextBlock[], safety?:TextBlock[], faq?:TextBlock[], relatedSolutions:string[], ctaLabel:string}>} */
export const AUDIENCE_PAGES = {
  'nhan-hang': {
    slug: 'nhan-hang',
    title: 'Giải pháp cho nhãn hàng & tập đoàn',
    kicker: 'Nhãn hàng & tập đoàn',
    heroTitle: 'Livestream chuẩn truyền hình, nhà sáng tạo định danh, doanh số đo được',
    heroSub: 'V-HUB nhận trách nhiệm từ khâu chọn người, sản xuất nội dung đến vận hành phiên bán và báo cáo kết quả — trong một hợp đồng, một đầu mối.',
    pains: [
      { title: 'Rủi ro từ KOL chưa xác minh', body: 'Người phát ngôn sai phát ngôn, vi phạm quy định quảng cáo hoặc bùng phốt giữa chiến dịch. V-HUB chỉ đưa lên sóng nhà sáng tạo đã định danh KOCViet.' },
      { title: 'Live tự dựng thiếu chuẩn', body: 'Hình ảnh tối, âm thanh rè, kịch bản lan man làm mất giá trị thương hiệu. Studio V-HUB vận hành theo quy chuẩn truyền hình, có kỹ thuật viên trực phiên.' },
      { title: 'Phụ thuộc một sàn', body: 'Doanh thu tập trung vào một kênh, chính sách sàn thay đổi là rủi ro. V-HUB vận hành đa tuyến và xây kênh sở hữu song song.' },
      { title: 'Không đo được hiệu quả', body: 'Báo cáo rời rạc, không rõ chi phí trên mỗi đơn. V-HUB báo cáo từng phiên trong 24 giờ với chi phí, doanh thu và tỷ lệ hoàn.' },
    ],
    models: [
      { title: 'Daily Live — động cơ chuyển đổi hằng ngày', body: 'Khung giờ cố định, kịch bản theo chủ đề, đo chỉ số từng phiên. Mục tiêu: ổn định lượng đơn và giữ nhịp tương tác với tệp khách đã có.' },
      { title: 'Megalive — cú tăng tốc chiến dịch', body: 'Phiên dài 3–4 giờ tại Super-Megalive, kết hợp nghệ sĩ, KOC định danh và ưu đãi theo khung giờ. Mục tiêu: bùng nổ doanh thu và phủ sóng thương hiệu.' },
    ],
    safety: [
      { title: 'Sàng lọc & định danh', body: 'Xác minh CCCD, hợp đồng, lịch sử phát ngôn và cam kết tuân thủ trước khi vào dự án.' },
      { title: 'Duyệt nội dung 2 lớp', body: 'Kịch bản được duyệt bởi đội nội dung và đại diện nhãn hàng; danh mục sản phẩm chốt trước 24 giờ.' },
      { title: 'Kiểm soát phát sóng', body: 'Kỹ thuật viên theo dõi realtime, có quy trình cắt sóng và xử lý sự cố trong 60 giây.' },
      { title: 'Lưu vết & báo cáo', body: 'Toàn bộ phiên được ghi hình, lưu 90 ngày, phục vụ kiểm tra và xử lý khiếu nại.' },
      { title: 'Đối soát sau phiên', body: 'Đối soát đơn hàng, hoàn tiền và chi phí trong 7 ngày làm việc, minh bạch theo từng kênh.' },
    ],
    faq: [
      { title: 'V-HUB có cam kết doanh số không?', body: 'Gói A và D không cam kết doanh số. Gói B cam kết theo KPI thoả thuận, có điều kiện và cơ chế điều chỉnh ghi rõ trong hợp đồng.' },
      { title: 'Cần chuẩn bị gì trước buổi tư vấn?', body: 'Danh mục sản phẩm, giá bán, tồn kho dự kiến, các kênh đang bán và mục tiêu trong 3 tháng tới. Buổi tư vấn kéo dài 60 phút, không ràng buộc.' },
      { title: 'Có thể tham quan studio trước không?', body: 'Có. V-HUB bố trí tham quan và trải nghiệm 360° tại địa chỉ 232/14 Võ Thị Sáu, TP.HCM.' },
    ],
    relatedSolutions: ['brand-live-house', 'van-hanh-tmdt-da-tuyen', 'thuong-hieu-ip-vtv', 'video-ai-tvc-ai', 'booking-creator'],
    ctaLabel: 'Đặt lịch tư vấn 60 phút',
  },
  'doanh-nghiep-vua-va-nho': {
    slug: 'doanh-nghiep-vua-va-nho',
    title: 'Giải pháp cho doanh nghiệp vừa và nhỏ',
    kicker: 'Doanh nghiệp vừa và nhỏ',
    heroTitle: 'Từ gian hàng đầu tiên đến đội ngũ tự vận hành trong 90 ngày',
    heroSub: 'V-HUB không chỉ bán dịch vụ — chúng tôi dựng quy trình, đào tạo người và bàn giao bộ công cụ để doanh nghiệp tự chạy tiếp.',
    pains: [
      { title: 'Chưa biết bắt đầu từ đâu', body: 'Sàn nào cũng có, nhưng không rõ nên ưu tiên kênh nào và chuẩn bị gì trước. V-HUB chẩn đoán và xếp thứ tự việc cần làm.' },
      { title: 'Nhân sự mỏng, kiêm nhiều việc', body: 'Một người vừa đăng bán vừa chăm khách vừa live. V-HUB giảm tải bằng quy trình và gói vận hành theo giờ.' },
      { title: 'Không có nội dung đều', body: 'Nội dung làm ngẫu hứng, không đo hiệu quả. V-HUB đưa lịch nội dung 30 ngày và mẫu kịch bản dùng lại.' },
    ],
    models: [
      { title: 'Khởi động 90 ngày', body: 'Tháng 1 dựng nền, tháng 2 tập live và tối ưu, tháng 3 bàn giao quy trình và đào tạo nâng cao.' },
      { title: 'Đào tạo tại trường quay', body: 'Đội ngũ doanh nghiệp học ngay trên sân khấu với sản phẩm thật, có ghi hình và nhận xét từng buổi.' },
    ],
    safety: [
      { title: 'Lộ trình viết rõ', body: 'Mỗi tuần có đầu việc, người phụ trách và kết quả cần đạt.' },
      { title: 'Báo cáo dễ hiểu', body: 'Báo cáo một trang, tập trung vào doanh thu, chi phí và việc cần làm tiếp theo.' },
      { title: 'Bàn giao thật', body: 'Kết thúc dự án, doanh nghiệp nhận bộ quy trình, checklist và file nội dung gốc.' },
    ],
    faq: [
      { title: 'Doanh nghiệp nhỏ có đủ ngân sách không?', body: 'Gói A thiết kế cho doanh nghiệp mới, chi phí từ 18.000.000đ/tháng và có thể điều chỉnh phạm vi theo ngân sách.' },
      { title: 'Có hỗ trợ sau khi kết thúc gói không?', body: 'Có gói hỗ trợ theo giờ hoặc theo tháng sau bàn giao, không bắt buộc.' },
    ],
    relatedSolutions: ['khoi-dong-tmdt', 'dao-tao-doi-ngu', 'van-hanh-tmdt-da-tuyen'],
    ctaLabel: 'Nhận tư vấn lộ trình 90 ngày',
  },
  'dia-phuong-ocop': {
    slug: 'dia-phuong-ocop',
    title: 'Giải pháp cho địa phương & OCOP',
    kicker: 'Địa phương & OCOP',
    heroTitle: 'Đưa đặc sản ra cả nước — tỉnh không phải tự tổ chức chiến dịch lớn',
    heroSub: 'V-HUB cùng VTV Nam Bộ lo trọn từ chuẩn hoá sản phẩm, đào tạo người bán tại chỗ đến Megalive xúc tiến thương mại và affiliate toàn quốc.',
    pains: [
      { title: 'Sản phẩm tốt nhưng chưa kể được câu chuyện', body: 'Hồ sơ OCOP đầy đủ nhưng hình ảnh, nội dung và câu chuyện chưa đủ sức cạnh tranh trên sàn. V-HUB chuẩn hoá và kể lại.' },
      { title: 'Thiếu người bán hàng số tại địa phương', body: 'Phụ thuộc vào một vài cá nhân. V-HUB đào tạo đội ngũ tại chỗ để duy trì sau chiến dịch.' },
      { title: 'Chiến dịch rời rạc, khó đo', body: 'Mỗi đơn vị làm một kiểu, không có báo cáo hợp nhất. V-HUB vận hành theo mùa với báo cáo và sao kê quỹ rõ ràng.' },
    ],
    models: [
      { title: 'Chợ Phiên Phương Nam', body: 'Mỗi mùa chọn các tỉnh, mỗi tỉnh một phiên Megalive 3 giờ, kèm chuỗi nội dung trước – trong – sau phiên.' },
      { title: 'Đồng hành sau phiên', body: 'Sau mỗi phiên, V-HUB để lại bộ nội dung, danh sách KOC địa phương đã định danh và quy trình bán hàng.' },
    ],
    safety: [
      { title: 'Minh bạch quỹ', body: 'Trích 10% doanh thu mỗi phiên vào quỹ thiện nguyện VTV Nam Bộ, công bố sao kê và biên bản trao tặng.' },
      { title: 'Chuẩn hoá hồ sơ sản phẩm', body: 'Rà soát pháp lý, nhãn mác, hạn dùng và chứng nhận trước khi đưa lên sóng.' },
      { title: 'Đào tạo tại địa phương', body: 'Lớp đào tạo ngắn tại tỉnh, học viên thực hành với chính sản phẩm của địa phương.' },
    ],
    faq: [
      { title: 'Tỉnh cần chuẩn bị gì để tham gia?', body: 'Danh sách chủ thể OCOP, hồ sơ sản phẩm, đầu mối phối hợp và kế hoạch vận chuyển. V-HUB gửi checklist sau khi tiếp nhận đăng ký.' },
      { title: 'Doanh thu và quỹ được xử lý thế nào?', body: 'Doanh thu được đối soát theo phiên; 10% trích vào quỹ, công bố sao kê trong 7 ngày làm việc sau phiên.' },
    ],
    relatedSolutions: ['cho-phien-dia-phuong', 'mega-xuc-tien', 'dao-tao-doi-ngu'],
    ctaLabel: 'Đăng ký tham gia mùa tiếp theo',
  },
}

export function getSolution(slug) {
  return SOLUTIONS.find((s) => s.slug === slug) || null
}

export function solutionsByGroup(group) {
  return SOLUTIONS.filter((s) => s.group === group)
}
