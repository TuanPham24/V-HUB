/**
 * Dự án tiêu biểu + Tin tức & kiến thức. Dữ liệu mẫu có gắn cờ demo.
 */

export const CASES = [
  {
    slug: 'nha-may-thoi-trang',
    client: 'Nhà Mây',
    clientNote: 'Thương hiệu thời trang nữ (tên minh hoạ)',
    industry: 'Thời trang nữ',
    title: 'Từ 4 phiên live rời rạc đến nhà live vận hành 5 ngày mỗi tuần',
    summary: 'Nhà Mây có sản phẩm tốt nhưng lịch live không đều, kịch bản phụ thuộc cảm hứng và không đo được chi phí trên mỗi đơn.',
    challenge: 'Doanh thu tập trung vào 2 đợt sale lớn, các tuần còn lại gần như trống. Đội nội bộ 3 người vừa chụp ảnh, vừa viết mô tả, vừa live nên chất lượng phiên không ổn định.',
    approach: [
      'Chuẩn hoá 42 SKU và bộ ảnh theo tiêu chuẩn sàn.',
      'Dựng lịch live cố định 5 ngày/tuần tại Studio Tiêu chuẩn 02.',
      'Đưa 3 KOC định danh vào các phiên chủ đề phối đồ.',
      'Cắt mỗi phiên thành 6 clip affiliate dùng lại trong tuần.',
    ],
    results: [
      { label: 'Tăng trưởng doanh thu sau 90 ngày', value: '3,2×', demo: true },
      { label: 'Chi phí trên mỗi đơn giảm', value: '−38%', demo: true },
      { label: 'Phiên live mỗi tháng', value: '22 phiên', demo: true },
    ],
    quote: { text: 'Điều chúng tôi cần không phải thêm một phiên live, mà là một lịch vận hành ổn định và người chịu trách nhiệm.', author: 'Đại diện Nhà Mây', role: 'Giám đốc thương mại (nhân vật minh hoạ)' },
    imageSrc: null,
    imagePending: true,
    imageLabel: 'Đang chờ ảnh: phiên live thời trang Nhà Mây tại studio V-HUB',
  },
  {
    slug: 'bep-co-tu',
    client: 'Bếp Cô Tư',
    clientNote: 'Thương hiệu thực phẩm (tên minh hoạ)',
    industry: 'Thực phẩm',
    title: 'Đưa bếp Việt lên sóng: từ bán online nhỏ lẻ đến Megalive 3 giờ',
    summary: 'Bếp Cô Tư cần một cú hích cho dòng gia vị truyền thống nhưng chưa có nội dung đủ sức thuyết phục người mua xa.',
    challenge: 'Sản phẩm có câu chuyện tốt nhưng hình ảnh cũ, chưa có video hướng dẫn nấu và chưa từng tham gia phiên live quy mô lớn.',
    approach: [
      'Quay bộ 12 video nấu thử tại Studio Tiêu chuẩn 03 có bếp demo.',
      'Xây kịch bản Megalive 3 giờ theo mạch bữa cơm gia đình.',
      'Mời 2 KOC ẩm thực đã định danh tham gia phiên.',
      'Thiết lập combo và quà tặng riêng cho phiên.',
    ],
    results: [
      { label: 'Người xem đồng thời cao nhất', value: '4.800', demo: true },
      { label: 'Tỷ lệ chốt đơn trong phiên', value: '6,4%', demo: true },
      { label: 'Video nội dung dùng lại', value: '18 video', demo: true },
    ],
    quote: { text: 'Khán giả tin mình khi họ thấy món ăn được nấu thật, trong một căn bếp thật.', author: 'Đại diện Bếp Cô Tư', role: 'Nhà sáng lập (nhân vật minh hoạ)' },
    imageSrc: null,
    imagePending: true,
    imageLabel: 'Đang chờ ảnh: bếp demo và phiên nấu ăn Bếp Cô Tư tại studio',
  },
  {
    slug: 'dua-xanh-ben-tre',
    client: 'Dừa Xanh',
    clientNote: 'Hợp tác xã OCOP (tên minh hoạ)',
    industry: 'Nông sản / OCOP',
    title: 'Một phiên Chợ Phiên, ba tháng đơn hàng đều hơn',
    summary: 'Hợp tác xã dừa tại Bến Tre tham gia Chợ Phiên với mong muốn mở thị trường phía Bắc, nhưng chưa có kênh bán ổn định.',
    challenge: 'Sản phẩm OCOP đạt chuẩn nhưng chưa có hồ sơ hình ảnh, chưa có người bán hàng số tại địa phương và vận chuyển còn yếu.',
    approach: [
      'Chuẩn hoá câu chuyện vùng trồng và hồ sơ OCOP trên trang tỉnh.',
      'Đào tạo 6 người bán hàng số tại địa phương trong 2 ngày.',
      'Tổ chức phiên Megalive 3 giờ trong Chợ Phiên Phương Nam.',
      'Kết nối 4 KOC nông sản nhận affiliate sau phiên.',
    ],
    results: [
      { label: 'Đơn hàng trong 30 ngày sau phiên', value: '2.100 đơn', demo: true },
      { label: 'Số tỉnh có người mua', value: '31 tỉnh', demo: true },
      { label: 'Trích quỹ thiện nguyện', value: '10% doanh thu', demo: false },
    ],
    quote: { text: 'Đặc sản của quê hương, trở về với quê hương — chúng tôi hiểu câu đó khi nhận lại phần quỹ trao cho địa phương.', author: 'Đại diện hợp tác xã Dừa Xanh', role: 'Giám đốc hợp tác xã (nhân vật minh hoạ)' },
    imageSrc: '/images/cho-phien/ben-tre.jpg',
    imageLabel: 'Ảnh minh họa: vùng trồng dừa Bến Tre',
  },
]

export const NEWS = [
  {
    slug: 'chinh-danh-nha-sang-tao-vi-sao-quan-trong',
    title: 'Vì sao nhà sáng tạo cần được định danh trước khi lên sóng?',
    category: 'Chuẩn mực',
    date: '2026-10-18',
    readingTime: '6 phút đọc',
    excerpt: 'Định danh không phải thủ tục hành chính. Đó là cách bảo vệ nhãn hàng, người xem và chính nhà sáng tạo trước những rủi ro không lường trước.',
    imageSrc: '/images/koc/xac-minh-ho-so.jpg',
    imageLabel: 'Ảnh thật: buổi định danh KOC tại V-HUB',
    body: [
      { heading: 'Rủi ro không đến từ nội dung xấu', paragraphs: ['Phần lớn khủng hoảng truyền thông trong livestream bán hàng không bắt đầu từ sản phẩm, mà từ một câu nói sai ngữ cảnh hoặc một cam kết không có căn cứ. Khi người phát ngôn chưa được xác minh, nhãn hàng không có cách nào đánh giá trước rủi ro đó.'] },
      { heading: 'Ba lớp xác minh của KOCViet', paragraphs: ['Lớp thứ nhất là danh tính: xác minh CCCD và thông tin liên hệ. Lớp thứ hai là năng lực: lịch sử phiên live, chỉ số tương tác và đánh giá từ nhãn hàng trước. Lớp thứ ba là cam kết: quy định nội dung, hàng cấm và trách nhiệm bồi thường khi vi phạm.', 'Ba lớp này không làm chậm dự án. Trung bình một hồ sơ được xử lý trong 3 ngày làm việc.'] },
      { heading: 'Định danh mang lại gì cho nhà sáng tạo?', paragraphs: ['Hồ sơ định danh giúp nhà sáng tạo tiếp cận các gói booking của nhãn hàng, được ký quỹ và đối soát minh bạch, đồng thời có lộ trình thăng hạng rõ ràng: Tân binh, Chính danh, Ngôi sao, Nghệ sĩ.'] },
    ],
  },
  {
    slug: 'daily-live-va-megalive-khi-nao-dung-gi',
    title: 'Daily Live và Megalive: khi nào dùng cái nào?',
    category: 'Vận hành',
    date: '2026-10-10',
    readingTime: '5 phút đọc',
    excerpt: 'Daily Live giữ nhịp, Megalive tạo cú nổ. Dùng sai nhịp là lý do nhiều thương hiệu đốt ngân sách mà doanh thu không đều.',
    imageSrc: '/images/studio/studio-megalive.jpg',
    imageLabel: 'Ảnh thật: sân khấu Megalive tại V-HUB',
    body: [
      { heading: 'Daily Live là động cơ, không phải chiến dịch', paragraphs: ['Mục tiêu của Daily Live là giữ nhịp tương tác với tệp khách đã có, thử nghiệm combo và thu dữ liệu hành vi. Một phiên Daily Live tốt không cần quá đông người xem, nhưng cần tỷ lệ chốt đơn ổn định.'] },
      { heading: 'Megalive là cú tăng tốc có tính toán', paragraphs: ['Megalive dài 3–4 giờ, có nghệ sĩ hoặc KOC định danh, có khung ưu đãi theo giờ. Chi phí cao hơn nhiều lần nên phải có mục tiêu rõ: doanh thu, phủ sóng, hay dữ liệu khách mới.'] },
      { heading: 'Cách V-HUB lên lịch', paragraphs: ['V-HUB thường đặt 4 Daily Live mỗi tuần và 1–2 Megalive mỗi tháng. Hai tuần trước Megalive, nội dung Daily được thiết kế để gieo nhu cầu cho sản phẩm chủ lực của phiên lớn.'] },
    ],
  },
  {
    slug: 'chuyen-doi-so-cho-ocop',
    title: 'Chuyển đổi số cho OCOP: bắt đầu từ người, không phải từ thiết bị',
    category: 'Địa phương',
    date: '2026-09-28',
    readingTime: '7 phút đọc',
    excerpt: 'Nhiều địa phương mua thiết bị tốt nhưng không có người vận hành. Bài học từ các phiên Chợ Phiên đầu tiên.',
    imageSrc: '/images/team/doi-dao-tao.jpg',
    imageLabel: 'Đội đào tạo V-HUB hướng dẫn người bán hàng số',
    body: [
      { heading: 'Thiết bị không tạo ra đơn hàng', paragraphs: ['Một bộ thiết bị livestream tốt chỉ có giá trị khi có người biết kể câu chuyện sản phẩm, xử lý tình huống và đọc số liệu sau phiên. Vì vậy V-HUB đặt đào tạo tại chỗ làm bước đầu tiên trong mỗi mùa Chợ Phiên.'] },
      { heading: 'Chuẩn hoá hồ sơ sản phẩm', paragraphs: ['Trước mỗi phiên, hồ sơ sản phẩm được rà soát: nhãn mác, hạn dùng, chứng nhận, hình ảnh, mô tả và chính sách đổi trả. Đây là phần mất thời gian nhất nhưng quyết định tỷ lệ hoàn hàng.'] },
      { heading: 'Để lại năng lực sau chiến dịch', paragraphs: ['Sau mỗi mùa, V-HUB bàn giao bộ nội dung, danh sách KOC địa phương đã định danh và quy trình vận hành để địa phương tiếp tục tự chạy.'] },
    ],
  },
  {
    slug: 'an-toan-thuong-hieu-trong-livestream',
    title: '5 lớp kiểm soát an toàn thương hiệu trong một phiên live',
    category: 'Chuẩn mực',
    date: '2026-09-15',
    readingTime: '4 phút đọc',
    excerpt: 'Từ duyệt kịch bản đến quy trình cắt sóng 60 giây — những lớp kiểm soát V-HUB áp dụng cho mọi phiên của nhãn hàng.',
    imageSrc: '/images/operations/phong-dieu-khien.jpg',
    imageLabel: 'Ảnh thật: phòng điều khiển tại V-HUB',
    body: [
      { heading: 'Kiểm soát bắt đầu từ hợp đồng', paragraphs: ['Danh mục sản phẩm, ngôn từ được phép và trách nhiệm hai bên được ghi rõ trước khi lên lịch. Đây là lớp bảo vệ đầu tiên và cũng là lớp ít tốn kém nhất.'] },
      { heading: 'Duyệt nội dung hai lớp và phòng điều khiển', paragraphs: ['Kịch bản được duyệt bởi đội nội dung và đại diện nhãn hàng. Trong phiên, kỹ thuật viên và điều phối viên theo dõi realtime, có quy trình cắt sóng và xử lý sự cố trong 60 giây.'] },
      { heading: 'Lưu vết để xử lý về sau', paragraphs: ['Toàn bộ phiên được ghi hình và lưu 90 ngày. Khi có khiếu nại, V-HUB có đủ dữ liệu để đối chiếu thay vì tranh luận.'] },
    ],
  },
]

export function getCase(slug) {
  return CASES.find((c) => c.slug === slug) || null
}

export function getPost(slug) {
  return NEWS.find((p) => p.slug === slug) || null
}
