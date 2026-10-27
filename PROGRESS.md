# PROGRESS — V-HUB website

Cập nhật lần cuối: phiên dựng đầu tiên (26/10/2026) — đã deploy và kiểm thử trên Cloudflare Worker.

## Trạng thái module

| Module | Nội dung | Trạng thái |
| --- | --- | --- |
| M1 | Nền tảng: token DESIGN.md → CSS variables, font Montserrat/Inter, component gốc, layout | ✅ |
| M2 | Lớp dữ liệu: JSDoc types, toàn bộ nội dung `src/lib/catalog-*`, storage adapter (`env.DB`), API lead, hàm thời gian (live, đếm ngược), `.env.example` | ✅ |
| M3 | Khung chung: header + mega menu, mobile nav, CTA bar, nút liên hệ nổi, footer, pháp lý, 404 | ✅ |
| M4 | Trang chủ 13 khối (mobile gộp ~10; xem ASSUMPTIONS) | ✅ |
| M5 | Giải pháp: tổng quan, 3 nhóm người xem, 9 trang chi tiết, 5 gói, công cụ ước tính | ✅ |
| M6 | Studio: danh sách, chi tiết, 360°, đặt lịch 3 bước, chống trùng lịch, mã đặt chỗ | ✅ |
| M7 | Chợ Phiên (chương trình, trang tỉnh, minh bạch quỹ), Lịch Live, nhắc lịch .ics | ✅ |
| M8 | KOCViet: hub 2 vai trò, tìm/lọc, hồ sơ, định danh, đại sứ, affiliate | ✅ |
| M9 | Học viện, Dự án, Tin tức, Về V-HUB, Liên hệ | ✅ |
| M10 | Admin: lead, booking, lịch live, số liệu, Chợ Phiên & quỹ, CSV | ✅ (chờ `ADMIN_PASSWORD` để kiểm thử luồng đăng nhập thật) |
| M11 | Trợ lý tư vấn theo kịch bản + adapter LLM | ✅ |
| M12 | SEO/JSON-LD/sitemap/robots, GA4–Meta–TikTok (bật bằng biến), i18n, a11y, hiệu năng | ✅ |
| M13 | Smoke test, rà giao diện, README, PROGRESS | ✅ |

## Lệnh chạy

```bash
npm start                 # xem giao diện tĩnh tại http://localhost:4173
npm run build             # kiểm tra cú pháp + tài nguyên + sitemap (không cần dependency)
BASE_URL=... ADMIN_PASSWORD=... npm run smoke   # smoke test trên bản đã triển khai
```

Trên Nexrall: Deploy/Preview (Cloudflare Worker + `env.DB` + `env.KV`).

## Đã kiểm tra trong phiên này

- `npm run build`: 44 file JS/ESM hợp lệ · 5 tài nguyên index.html đủ · sitemap 55 URL.
- `check_backend()` OK · `lint_frontend()` OK · `get_diagnostics()` 0 phát hiện.
- API test tự động trên bản deploy: **14/14 đạt**.
- Kiểm thử giao diện **tất định** (`scripts/browser-check.js`, `window.__VHUB_BROWSER_CHECK__`): 23 route × 3 lần
  chạy liên tiếp cho kết quả **giống nhau 3/3**, 0 vấn đề; số liệu ổn định giữa hai lần render; luồng đặt lịch tới
  bước 3 + validate client; VI/EN; trợ lý tư vấn.
- Công cụ ước tính: chạy đủ 4 bước → ra khung chi phí + gói gợi ý + form nhận đề xuất (khối kết quả đã tách sang
  `src/components/estimator-result.js` để `estimator.js` chỉ còn điều khiển wizard).
- Bộ đếm quỹ: thuộc tính `data-stat-final` cho giá trị cuối ổn định (50.890.000đ với dữ liệu mẫu).
- `document.documentElement.dataset.vhub === 'ready'` sau render đầu; `boot()` có fallback 4 giây nên API treo
  không làm kẹt màn hình khởi động; `api()` có timeout (12s, chat 30s) thay vì treo vô hạn.

### Cảnh báo được xác nhận là BÁO NHẦM của bộ quét thô

- `"estimateResultBlock(…)" is called but defined nowhere`: hàm **có** `export function estimateResultBlock`
  trong `src/components/estimator-result.js` và được import đúng ở `estimator.js`. `get_diagnostics()`
  (TypeScript + ESLint thật) trả **0 phát hiện**; app chạy thật đã render đúng khối kết quả.
  Bộ quét thô này cũng từng báo nhầm `resultContent`, `renderResultBlock` (cùng một hàm, đổi tên bao nhiêu lần
  cũng báo) và `OCOP(` — một chuỗi không hề tồn tại trong mã.
- `scripts/*.mjs` từng bị báo `process is not defined`: đã thêm `/* eslint-env node */` + `/* global process */`.
- Lưu ý công cụ: `bash`/`grep` trong môi trường này có thể đọc **bản sao lệch** của file vừa ghi; `read_file`,
  `get_diagnostics`, `verify()` và hành vi trên bản deploy là nguồn đúng.

### Đã sửa trong vòng “test flip”

- **Test từng flaky** vì ngủ cố định chờ render, click node đã bị thay thế, đặt lịch vào ngày cố định, và đọc text
  animation. Đã thêm hook tất định (`__VHUB_APP__.nav/waitFor`, sự kiện `vhub:rendered`/`vhub:ready`),
  thuộc tính `data-stat-final`, và viết lại test theo hướng không ghi dữ liệu.
- **Bug thật do test tất định phát hiện**: tràn ngang trên trang chi tiết studio (`.wizard` dùng cột grid mặc định
  `auto`, dải ngày cuộn ngang kéo rộng cột → `scrollWidth` 1332px ở viewport 800px). Đã sửa bằng
  `grid-template-columns: minmax(0, 1fr)` + `min-width: 0`.
- **Bug thật thứ hai**: `.mobile-nav` khi đóng dùng `translateX(100%)` với `position: fixed` → đẩy document rộng
  thêm 1 viewport. Đã đổi sang opacity + translateY (không tạo tràn ngang) và giữ `pointer-events: none` khi đóng.
- **Huy hiệu LIVE ở header**: `window.__VHUB_LIVES__` nay gán trước khi dựng khung (trước đây gán sau nên lần render
  đầu có thể thiếu huy hiệu).
- **Không tự render lại khi đang tương tác**: bỏ qua khi có modal/chat mở, con trỏ ở ô nhập, hoặc chưa quá 20 giây.

## Vấn đề còn mở / việc tiếp theo

1. **ADMIN_PASSWORD chưa được đặt** — API đăng nhập trả 503 `missingSecret` (đúng thiết kế). Thêm secret rồi kiểm thử
   luồng lead/booking/lịch live/số liệu/quỹ và xuất CSV.
2. **Thay ảnh thật & logo** theo README mục 5 (hiện là khung giữ chỗ đúng tỉ lệ).
3. **Dữ liệu demo** cần thay: xem README mục 6.
4. **Tích hợp thật**: KOCViet API, Zalo OA, CRM, link sao kê/biên bản quỹ (README mục 7).
5. **Đo lường**: điền GA4/Meta/TikTok ID thật.
6. **Pháp lý**: rà soát Chính sách bảo mật/Điều khoản, bổ sung số giấy phép.
7. **Font**: Google Fonts có thể bị chặn ở môi trường xem trước (header xác thực cross-origin); production nên tự host woff2.
8. **Giới hạn đã biết**: SPA hash routing nên crawler không có URL path riêng; chuyển sang Next.js/route path khi lên
   production chính thức (README mục 2.1 và 8.2).
9. **Nguồn dữ liệu phía máy chủ**: `server/lib/content-mirror.js` là bản sao tối thiểu (seed, giá, ngữ cảnh AI).
   Khi sửa giá/ngày ở `src/lib/catalog-*`, cập nhật mirror tương ứng — lý do ở README ASSUMPTIONS mục 16.

## Ghi chú kỹ thuật quan trọng (đừng lặp lại lỗi cũ)

- **Test tất định**: dùng `await window.__VHUB_APP__.nav('#/route')` và `await window.__VHUB_APP__.waitFor(selector)`;
  KHÔNG dùng `setTimeout` để chờ render. Đọc số liệu qua `[data-stat-final]`, không đọc text animation.
  Sự kiện: `vhub:rendered`, `vhub:ready`. Lý do đầy đủ ở README mục 9.1 (nguồn gây test “flip” trước đây).
- **Test không được phụ thuộc dữ liệu tích luỹ**: không đặt lịch vào một ngày cố định (lần chạy sau sẽ 409);
  quét tìm khung giờ trống, hoặc kiểm tra luồng UI tới bước 3 mà không submit.
- **Không click vào node đã bị thay thế**: sau mỗi lần render lại, query lại phần tử trước khi click.
- Adapter SQLite của nền tảng **không cho phép `PRAGMA user_version`** (SQLITE_AUTH). Migration dùng bảng `_migrations`,
  DDL chạy qua `env.DB.exec()`, DML qua `prepare().run()`.
- **Không để `server.js` import module frontend**: nền tảng không phục vụ tĩnh module mà Worker import (404).
  Vì vậy nội dung hiển thị nằm ở `src/lib/catalog-*` và máy chủ dùng bản sao `server/lib/content-mirror.js`.
- Thư mục `/content` ở gốc bị phục vụ với MIME `text/plain` → trình duyệt chặn ES module. Không quay lại `/content`.
- `bash`/`grep` trong môi trường này có thể đọc **bản sao lệch** của file vừa ghi; `read_file` là nguồn đúng.
  Đừng kết luận “edit không áp dụng” chỉ dựa vào grep.
- Di chuyển/đổi tên file dùng `rename_file` với đúng `old_path`/`new_path`; nếu một loạt lệnh đổi tên lỗi,
  kiểm tra lại cây file trước khi giả định đã hoàn tất (bài học: `README.md`/`PROGRESS.md` từng bị mất và phải tạo lại).
