# V-HUB — Trường quay của thương mại số Việt

Website hệ thống MCN thương mại điện tử **V-HUB** (thuộc hệ sinh thái VTV Nam Bộ) — 232/14 Võ Thị Sáu, phường Xuân Hòa, TP.HCM.

- Concept: *Trường quay của thương mại số Việt* — website luôn ở trạng thái “đang sáng đèn”.
- Headline: **Đưa hàng Việt lên sóng — chính danh, chuyên nghiệp, ra doanh số.**
- Tagline: **Value | Innovate | Trust**

---

## 1. Cách chạy

### 1.1 Trên nền tảng Nexrall (bản đang chạy)

Website được triển khai dưới dạng **Cloudflare Worker + tệp tĩnh** (không có bước bundling):

- `index.html` + `/styles` + `/src` được phục vụ tĩnh.
- `server.js` là entrypoint Worker, định tuyến `/api/*`.
- Dữ liệu vận hành nằm trong `env.DB` (CF Durable Object SQLite), phiên quản trị nằm trong `env.KV`.

Nhấn **Deploy/Preview** trong Nexrall, hoặc dùng công cụ `verify()` của trợ lý để triển khai.

### 1.2 Chạy cục bộ để xem giao diện (không cần npm install)

```bash
npm start          # http://localhost:4173 — chỉ phục vụ giao diện tĩnh
npm run build      # kiểm tra cú pháp toàn bộ file + tài nguyên + sitemap
```

`npm install` không cần thiết vì dự án **không có dependency** (xem ASSUMPTIONS). Máy chủ tĩnh không có API:
form, đặt lịch và quản trị cần Worker đã triển khai.

### 1.3 Smoke test trên bản đã triển khai

```bash
BASE_URL=https://your-app.example ADMIN_PASSWORD=... npm run smoke
```

Kiểm tra: trang chủ + CSS/JS, sitemap, `/api/health`, `/api/bootstrap`, gửi lead hợp lệ/không hợp lệ,
honeypot, lịch trống studio, đặt lịch thành công, **đặt trùng khung giờ bị chặn 409**, admin sai mật khẩu bị chặn,
xuất CSV, và router khai báo đủ 13 nhánh trang.

Script này **idempotent**: trước khi đặt lịch, nó quét 16 ngày kể từ +30 ngày để tìm khung giờ còn trống, nên chạy
lại nhiều lần không còn 409 giả do dữ liệu của lần trước.

### 1.4 Kiểm thử giao diện tất định trong trình duyệt

`scripts/browser-check.js` chứa bộ kiểm thử chạy trong trang thật. Dán nội dung file đó vào `run_test_script`
(hoặc DevTools console trên bản deploy), rồi gọi:

```js
await window.__VHUB_BROWSER_CHECK__({ iterations: 3 })
```

Nó kiểm tra 23 route (render, `h1`, độ dài nội dung, tràn ngang), số liệu ổn định giữa hai lần render,
luồng đặt lịch tới bước 3 + validate client, chuyển ngôn ngữ VI/EN, và trợ lý tư vấn — rồi so sánh kết quả
giữa các lần chạy, **báo lỗi nếu khác nhau**. Xem lý do thiết kế ở mục 9.1.

---

## 2. Kiến trúc & ASSUMPTIONS

### 2.1 Vì sao không phải Next.js

Yêu cầu gốc ghi Next.js (App Router) + TypeScript + Tailwind. Runtime của nền tảng là **một Cloudflare Worker
phục vụ tệp tĩnh**, không có `npm install`, không có bước build Next.js, không có Node server. Vì vậy bản này
giữ **kiến trúc tương đương** và chạy thật:

| Yêu cầu gốc | Cách hiện thực trong bản này |
| --- | --- |
| Next.js App Router, Server Components | SPA nhiều module ES (`/src/pages/*`), render từ dữ liệu; `server.js` xử lý API |
| TypeScript | JavaScript ES2022 + JSDoc typedefs trong `src/lib/catalog-*` (esbuild của Worker bundle server) |
| Tailwind + token DESIGN.md | CSS thuần với **CSS variables** đặt tên theo token DESIGN.md (`/styles/main.css`) |
| `next/font` Montserrat + Inter | Google Fonts, `display=swap`, preconnect (không có bước build font) |
| API routes Next | `/api/*` trong `server.js` + `server/routes/*` |
| Middleware/SSR metadata | Metadata theo route bằng JS (`setMeta`, `setJsonLd`) + JSON-LD tĩnh trong `index.html` |
| Lưu file JSON `/data` | Storage adapter trong `server/lib/db.js` dùng `env.DB` (thiết kế thay được bằng database khác) |

**Đánh đổi đã biết**: vì là SPA hash routing nên mỗi trang không có URL path riêng cho crawler; `sitemap.xml`
liệt kê đúng cấu trúc trang dưới dạng `/#/...`. Khi chuyển sang Next.js, thay router hash bằng route file và
đổi sitemap sang URL sạch — nội dung và component dùng lại gần như nguyên vẹn.

### 2.2 ASSUMPTIONS (những điểm tự quyết)

1. **Stack**: dùng Worker + ESM + CSS token thay Next.js/Tailwind (lý do ở trên). Không thêm thư viện ngoài.
2. **Lưu trữ**: `env.DB` là nguồn sự thật cho lead, booking, lịch live, số liệu, Chợ Phiên/quỹ; `env.KV` chỉ
   cho phiên admin (TTL 8 giờ). Việc “ghi file JSON trong /data” được hiện thực bằng adapter DB có thể thay thế
   (`server/lib/db.js`), vì Worker không có ổ đĩa ghi được.
3. **Giờ Chợ Phiên**: các phiên mùa 1 bắt đầu **19:30**, dài **180 phút**, theo giờ Asia/Ho_Chi_Minh (UTC+7, không DST).
4. **Daily Live mẫu**: 20:00 hằng ngày, 120 phút; Megalive 210 phút; Super-Megalive 240 phút.
5. **Studio**: theo biên bản ghi nhớ có 14 studio (13 tiêu chuẩn + 1 Super-Megalive). Website hiển thị
   **6 studio đang mở đặt lịch** (dữ liệu mẫu) và số “studio đang vận hành” đọc từ bảng `metrics`.
6. **Ca thuê studio**: 3 ca × 4 giờ (08:00–12:00, 13:00–17:00, 18:00–22:00); có thể chọn 4 hoặc 8 giờ.
   Giá theo giờ + phụ phí gói kỹ thuật/host + dịch vụ thêm; **chưa gồm VAT**.
7. **Định dạng mã đặt chỗ**: `VH` + 6 ký tự (bỏ ký tự dễ nhầm như O/0, I/1).
8. **Lead**: form ngắn 4 trường ở trang chủ; form đầy đủ đổi trường theo “Bạn là”. Newsletter chỉ cần email.
   Trường `audience` dùng cho định tuyến lead; `type` gồm `lead`, `newsletter`, `chat`, `booking-koc`.
9. **Trợ lý tư vấn**: kịch bản chạy phía client (4 bước + thu lead). Khi có `AI_API_KEY`, tin nhắn tự do được
   gửi `/api/chat` để trả lời bằng LLM dựa trên dữ liệu nội dung; không có key thì trả lời theo kịch bản.
10. **i18n**: tiếng Việt đầy đủ; tiếng Anh cho khung chung, trang chủ, Giải pháp nhãn hàng và Studio.
    Trang chưa dịch hiển thị tiếng Việt (theo yêu cầu). Lựa chọn lưu ở `localStorage` (chỉ là UI preference).
11. **Huy hiệu LIVE**: suy ra từ `starts_at + duration_min`, không lưu cứng; phiên minh hoạ được tạo lúc seed
    để demo trạng thái LIVE ngay sau khi triển khai (hết hạn sau 4 giờ).
12. **Trang 404**: mọi hash route không khớp rơi vào 404 “Trang này đã tắt sóng”.
13. **Số liệu**: các con số ngoài “14 studio” là **dữ liệu minh hoạ có gắn nhãn**; không có thành tích bịa
    nào được trình bày như số thật.
14. **Logo & ảnh**: chưa có file trong `public/brand` hay ảnh thật, nên website dùng ô chờ logo và khung giữ chỗ
    đúng tỉ lệ kèm ghi chú “Ảnh thật: …”. Không sinh ảnh, không dùng ảnh stock, không base64.
15. **Pháp lý**: trang Chính sách bảo mật và Điều khoản là **bản mẫu kỹ thuật**, cần bộ phận pháp lý rà soát trước
    khi công bố (đã ghi rõ trong trang).
16. **Vị trí thư mục dữ liệu**: nội dung hiển thị nằm ở `src/lib/catalog-*.js` (JSDoc types) thay vì `/content`,
    vì máy chủ tĩnh của nền tảng (a) phục vụ `/content/*.js` với MIME `text/plain` khiến trình duyệt chặn ES module,
    và (b) **không phục vụ tài sản tĩnh đối với module mà `server.js` import** (coi là mã riêng của Worker).
    Vì vậy phía máy chủ dùng bản sao tối thiểu `server/lib/content-mirror.js` (seed lịch live, bảng giá studio,
    ngữ cảnh trợ lý AI). Khi sửa giá/ngày ở `src/lib/catalog-*`, cập nhật cả mirror — đây là đánh đổi có chủ đích
    để website chạy được trên hạ tầng hiện tại.

### 2.3 Sơ đồ thư mục

```
index.html                 # shell + meta + JSON-LD Organization/LocalBusiness
styles/main.css            # token DESIGN.md + component nền tảng
styles/pages.css           # component theo trang (hero, live, booking, admin, chat…)
src/lib/catalog-*.js       # dữ liệu có kiểu (nguồn sự thật nội dung hiển thị)
  site solutions studios koc academy cases provinces schedule estimator
src/lib/                   # dom, format, api, store, data, i18n, icons, analytics
src/components/            # ui, layout, forms, estimator, chat, studio360
src/pages/                 # home, solutions, studio, koc, chophien, live,
                           # academy, stories, contact, admin
server.js                  # entrypoint Worker (router mỏng)
server/lib/                # db (migration + seed + adapter), http, auth, adapters, content-mirror
server/routes/             # public.js, admin.js
scripts/                   # serve-local, build-check, smoke
```

### 2.4 Dữ liệu & API

Bảng trong `env.DB` (migration chạy một lần, đánh dấu trong `_migrations`):

| Bảng | Cột chính |
| --- | --- |
| `leads` | id, created_at, type, audience, name, phone, email, company, province, needs, budget, message, source_page, utm_*, consent, status |
| `bookings` | id, code, created_at, studio_id, date, slot, hours, package_id, addons, estimate, name, phone, email, company, notes, status |
| `live_sessions` | id, title, brand, platform, starts_at, duration_min, url, is_demo |
| `markets` | id, name, held_at, revenue, donation, auction, orders, transferred_at, statement_url, minutes_url |
| `metrics` | metric_key, value, label, updated_at |
| `settings` | setting_key, value, updated_at |

API:

| Method | Route | Mục đích |
| --- | --- | --- |
| GET | `/api/health` | kiểm tra sống |
| GET | `/api/bootstrap` | lịch live, số liệu, Chợ Phiên, cờ tính năng, mã đo lường |
| POST | `/api/leads` | nhận lead / newsletter / chat / booking KOC (validate + rate limit + honeypot) |
| GET | `/api/bookings/availability?studio=&date=` | lịch trống theo ca |
| POST | `/api/bookings` | tạo đặt chỗ (chống trùng ở DB + kiểm tra phía server) |
| POST | `/api/chat` | trợ lý LLM (503 nếu chưa có `AI_API_KEY`) |
| POST | `/api/admin/login` | đăng nhập bằng `ADMIN_PASSWORD`, trả token (KV, TTL 8h) |
| POST | `/api/admin/logout` | huỷ phiên |
| GET | `/api/admin/overview` | lead, booking, lịch live, số liệu, quỹ |
| PATCH | `/api/admin/leads/:id` | đổi trạng thái lead |
| PATCH | `/api/admin/bookings/:id` | đổi trạng thái booking |
| POST | `/api/admin/lives` | thêm/cập nhật phiên live |
| DELETE | `/api/admin/lives/:id` | xoá phiên |
| PUT | `/api/admin/metrics` | cập nhật bộ đếm trang chủ |
| PUT | `/api/admin/markets` | cập nhật doanh thu/quỹ/sao kê |
| GET | `/api/admin/export.csv` | xuất CSV lead (`?type=bookings` để xuất booking) |

---

## 3. Biến môi trường

Khai báo dưới dạng **secret của ứng dụng** (cùng tên trong `.env.example`). Website chạy đủ tính năng khi thiếu
mọi biến tuỳ chọn.

| Biến | Bắt buộc | Tác dụng |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Có (để vào `/admin`) | mật khẩu quản trị; thiếu → API login trả 503 `missingSecret` |
| `LEAD_WEBHOOK_URL` | Không | gửi JSON lead ra webhook/CRM ngoài |
| `CRM_WEBHOOK_URL`, `CRM_API_KEY` | Không | đẩy lead sang CRM |
| `ZALO_OA_ACCESS_TOKEN`, `ZALO_TEMPLATE_ID` | Không | gửi thông báo Zalo OA (hiện là adapter giả lập khi thiếu) |
| `KOCVIET_API_URL`, `KOCVIET_API_KEY` | Không | tra cứu định danh KOC thật |
| `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` | Không | bật trợ lý LLM (OpenAI-compatible) |
| `GA4_MEASUREMENT_ID`, `META_PIXEL_ID`, `TIKTOK_PIXEL_ID` | Không | nhúng mã đo lường; client tự chèn script |

---

## 4. Cập nhật nội dung

### 4.1 Nội dung ít thay đổi — `src/lib/catalog-*`

| File | Nội dung |
| --- | --- |
| `catalog-site.js` | thông tin tổ chức, hotline, Zalo, email, địa chỉ, menu, 4 cửa vào, 6 lý do, vòng quay, quy trình |
| `catalog-solutions.js` | 5 gói A–E, 9 trang giải pháp, nội dung 3 nhóm người xem |
| `catalog-studios.js` | studio, thiết bị, bảng giá, gói kèm, dịch vụ thêm, ca thuê |
| `catalog-koc.js` | 12 hồ sơ KOC (mẫu), thang hạng, đại sứ, hoa hồng affiliate |
| `catalog-academy.js` | 4 khoá học (thời lượng, học phí, buổi, lịch khai giảng) |
| `catalog-cases.js` | 3 case study + 4 bài tin tức |
| `catalog-provinces.js` | 4 tỉnh mùa 1 + 3 phiên thí điểm, sản phẩm, quy trình, chính sách quỹ |
| `catalog-schedule.js` | hàm sinh lịch live mẫu, trạng thái LIVE, file .ics |
| `catalog-estimator.js` | công thức ước tính chi phí livestream |

Sửa file → deploy lại. Không cần đụng component.

> Lưu ý: giá/ngày phía máy chủ lấy từ `server/lib/content-mirror.js`. Khi đổi giá studio, khung giờ hoặc ngày
> Chợ Phiên trong `catalog-*`, cập nhật mirror tương ứng để bước kiểm tra phía server khớp giao diện.

### 4.2 Dữ liệu vận hành — `/admin`

1. Vào `#/admin`, đăng nhập bằng `ADMIN_PASSWORD`.
2. **Lead**: xem toàn bộ lead (tên, liên hệ, loại, nhu cầu, nguồn UTM), đổi trạng thái, xuất CSV.
3. **Đặt lịch**: xem mã đặt chỗ, studio, ca, chi phí ước tính; đổi trạng thái (chờ → xác nhận → hoàn tất/huỷ).
   Huỷ một booking sẽ **giải phóng khung giờ** đó.
4. **Lịch live**: thêm/sửa/xoá phiên; giờ nhập theo UTC+7. Huy hiệu LIVE tự tính.
5. **Số liệu**: cập nhật 3 bộ đếm (studio, giờ live, KOC đã định danh) và ngày cập nhật.
6. **Chợ Phiên & quỹ**: nhập doanh thu thực thu, 10% trích quỹ, đấu giá, số đơn, link sao kê, link biên bản.
   Bộ đếm quỹ trên website **tự cộng dồn** từ bảng này.

Ảnh hưởng tức thì sau khi bấm Lưu (client tải lại dữ liệu).

---

## 5. Thay ảnh và logo

- **Logo**: đặt file gốc vào `public/brand/` (ví dụ `public/brand/logo-vhub.svg`) rồi thay khối
  `<span class="brand__mark">VH</span>` trong `src/components/layout.js` bằng
  `<img src="/public/brand/logo-vhub.svg" alt="V-HUB" />`.
  Không vẽ lại logo, không dùng logo VTV/đối tác khi chưa có văn bản cho phép.
- **Ảnh thật**: các đường dẫn đã khai báo trong `src/lib/catalog-studios.js` (ví dụ `/images/studio/super-megalive-01.jpg`).
  Chỉ cần đặt file đúng đường dẫn — khung giữ chỗ sẽ tự thay bằng ảnh.
  Khi chưa có file, website hiện khung đúng tỉ lệ kèm ghi chú “Ảnh thật: …”.
- **Ảnh OG**: thay `images/og/vhub-og.svg` bằng JPG/PNG 1200×630 và cập nhật `og:image` trong `index.html`
  (nhiều mạng xã hội không hỗ trợ SVG).
- **Ảnh 360°**: điền `panoramaUrl` (ảnh toàn cảnh) hoặc `embedUrl` (iframe) trong `src/lib/catalog-studios.js`;
  chưa có thì trình xem hiển thị ảnh tĩnh.

---

## 6. Dữ liệu demo cần thay trước khi công bố

| Nhóm | Vị trí | Ghi chú |
| --- | --- | --- |
| Hotline, Zalo OA, email, fanpage | `catalog-site.js` → `ORG` | đang là số/URL mẫu |
| Logo VTV Nam Bộ, logo đối tác | ô chờ logo ở trang chủ & Về V-HUB | cần văn bản cho phép |
| Toàn bộ ảnh | `/images/**` | xem mục 5 |
| Số liệu trang chủ | `/admin` → Số liệu | 1.280 giờ live, 186 KOC đã định danh là minh hoạ |
| 12 hồ sơ KOC | `catalog-koc.js` | tên và chỉ số giả |
| 2 đại sứ | `catalog-koc.js` | nhân vật minh hoạ |
| 3 case study | `catalog-cases.js` | số liệu có gắn nhãn “Dữ liệu minh hoạ” |
| 4 bài viết | `catalog-cases.js` | nội dung mẫu |
| 3 phiên Chợ Phiên thí điểm + số quỹ | `/admin` → Chợ Phiên & quỹ | doanh thu/đấu giá là minh hoạ |
| Lịch live 10 ngày | `/admin` → Lịch live | nhãn hàng và tiêu đề giả |
| Logo/ảnh đội ngũ, lãnh đạo | trang Về V-HUB | khung giữ chỗ |
| Giấy phép kinh doanh | `catalog-site.js` → `ORG.license` | đang “[đang cập nhật]” |
| Bảng hoa hồng affiliate | `catalog-koc.js` | mức tham khảo |
| Giá gói & studio | `catalog-solutions.js`, `catalog-studios.js` | “từ …” hoặc “Liên hệ” |

---

## 7. Việc còn lại để tích hợp thật

1. **API KOCViet**: hiện `lookupKoc()` trong `server/lib/adapters.js` là giả lập. Điền `KOCVIET_API_URL/KEY`,
   xác nhận contract thật (endpoint tra cứu, trường trả về) rồi thay phần mock. Trang tìm KOC nên chuyển sang
   gọi API (có phân trang) thay vì lọc 12 hồ sơ mẫu trong trình duyệt.
2. **Zalo OA**: cần access token + template ID đã duyệt; hiện adapter gửi mock. Luồng “Nhắc tôi” hiện dùng
   file `.ics` + link Zalo (đúng phạm vi MVP).
3. **CRM/webhook**: đã có `LEAD_WEBHOOK_URL`/`CRM_WEBHOOK_URL`; cần khớp schema với CRM thật.
4. **Sao kê quỹ & biên bản trao tặng**: hiện là ô “Đang cập nhật” — tải PDF lên nơi lưu trữ và dán URL vào
   `/admin` → Chợ Phiên & quỹ.
5. **Định danh KOC**: cần quy trình xác minh CCCD thật (hiện chỉ mô tả quy trình).
6. **Thanh toán/ký quỹ**: không nằm trong phạm vi website (không có giỏ hàng/thanh toán); cần tích hợp ở
   nền tảng KOCViet.
7. **Đo lường**: đã có chỗ nhúng GA4/Meta/TikTok; cần ID thật và cấu hình sự kiện chuyển đổi.
8. **Pháp lý**: rà soát Chính sách bảo mật/Điều khoản, bổ sung số giấy phép, thông tin đơn vị vận hành.

---

## 8. Triển khai

### 8.1 VPS / Node (dùng ngay, không cần build)

- Phục vụ tĩnh: `npm start` (hoặc Nginx trỏ root vào thư mục dự án).
- API: chạy `server.js` trên Cloudflare Workers (bind `DB`, `KV`). Nếu triển khai Node thuần, thay
  `server/lib/db.js` bằng adapter ghi file JSON/PostgreSQL — các hàm `all/first/run/batch` là điểm thay thế duy nhất.
- Biến môi trường: đặt theo bảng mục 3.

### 8.2 Vercel

Vercel không chạy Cloudflare Worker. Cần:
1. Chuyển frontend sang Next.js (giữ nguyên nội dung `catalog-*` và logic component) để có SSR/route path.
2. Thay `server/lib/db.js` bằng Postgres/Supabase (bảng giữ nguyên schema trong `MIGRATIONS`).
3. Thay phiên admin bằng cookie HttpOnly + bảng session (thay KV).
4. Đổi `sitemap.xml` sang route động với URL sạch.

### 8.3 Bảo mật đã áp dụng

- Mật khẩu admin so sánh qua SHA-256 + so sánh không rò rỉ thời gian; giới hạn 8 lần thử/10 phút.
- Phiên admin lưu KV có TTL 8 giờ; mọi API quản trị yêu cầu Bearer token.
- Toàn bộ SQL dùng `.bind()`; không nội suy giá trị từ request.
- Escape toàn bộ dữ liệu động khi render (chống XSS); dữ liệu chat không đưa vào `innerHTML`.
- Honeypot + rate limit cho form lead/chat/booking; kiểm tra dữ liệu cả client và server.
- Chống trùng lịch bằng **unique index có điều kiện** ở tầng DB, không chỉ kiểm tra trước khi ghi.
- CSV chống formula injection (`=`, `+`, `-`, `@`) và có BOM UTF-8 cho Excel.

---

## 9. Chất lượng & truy cập

- Mobile-first 375 → 1440; breakpoint 640/768/1024/1280.
- Vùng chạm ≥ 44px; focus ring 3px `#0057D9`; nhãn form luôn hiển thị; ảnh có alt tiếng Việt.
- Không dùng `#EE4D2D` cho chữ nhỏ (chỉ dùng cho chữ lớn/số liệu/đồ hoạ); chữ cam nhỏ dùng `#B8301A`,
  chữ cam trên nền navy dùng `#FF8A6B`.
- Tôn trọng `prefers-reduced-motion`: tắt hiệu ứng xuất hiện, bộ đếm chạy số và chuyển động.
- Huy hiệu LIVE luôn có chữ “LIVE”, không truyền đạt chỉ bằng màu.
- Ảnh dùng `loading="lazy"` + `decoding="async"`; hero dùng khung ảnh (không tải video) để giữ LCP thấp.
- **Font**: Montserrat/Inter tải từ Google Fonts với `display=swap` và có font dự phòng trong biến CSS
  (`--font-heading`, `--font-body`). Một số môi trường xem trước chèn header xác thực vào request cross-origin
  khiến Google Fonts bị chặn — khi đó website tự dùng font hệ thống, không vỡ layout. Khi lên production chính thức,
  nên tự host file font (woff2) trong `/styles/fonts` để loại bỏ phụ thuộc bên thứ ba.

### 9.1 Kiểm thử tất định (vì sao trước đây có lúc PASS lúc FAIL)

Một test từng “flip” trên cùng một mã nguồn. Nguyên nhân nằm ở **test**, không phải ở tính năng:

1. Test ngủ một khoảng cố định (`setTimeout`) rồi mới đọc DOM, trong khi lần render đầu còn chờ
   `fetch('/api/bootstrap')` (migration + seed + 3 truy vấn). Máy chậm → DOM chưa có → FAIL.
2. Test click vào nút đã bị **thay thế** sau khi innerHTML render lại (tham chiếu cũ) → click vô hiệu.
3. Test đặt lịch dùng **ngày cố định**; lần chạy sau khung giờ đó đã bị đặt → 409 → FAIL.
4. Test đọc **text đang chạy animation** của bộ đếm số liệu (`0` → giá trị cuối) → phụ thuộc thời điểm đọc.
5. Đồng hồ đếm ngược có thể tự gọi `renderRoute()` giữa lúc test đang thao tác, làm mất node.

Đã sửa tận gốc:

- **Hook tất định** trong `src/app.js`:
  - `await window.__VHUB_APP__.nav('#/studio')` — điều hướng và **chờ render xong** (không cần sleep).
  - `await window.__VHUB_APP__.waitFor('#booking-wizard')` — chờ phần tử xuất hiện (MutationObserver, có timeout).
  - Sự kiện `vhub:rendered` (mỗi lần render) và `vhub:ready` (sau render đầu tiên, kể cả khi API lỗi).
  - `window.__VHUB_APP__.hash()` trả về route đã render.
- **Số liệu**: mỗi bộ đếm có `data-stat-final` (giá trị cuối, ghi ngay khi render) và `data-stat-done` khi
  animation kết thúc — test/SEO đọc thuộc tính thay vì text đang chạy.
- **Không tự render lại khi đang tương tác**: bỏ qua nếu có modal, chat đang mở, con trỏ đang ở ô nhập,
  hoặc lần tự render trước đó chưa quá 20 giây.
- **Huy hiệu LIVE ở header**: `window.__VHUB_LIVES__` được gán **trước** khi dựng khung (trước đây gán sau,
  nên lần render đầu có thể thiếu huy hiệu).
- **`npm run smoke` idempotent**: quét 16 ngày kể từ +30 ngày để tìm khung giờ còn trống trước khi đặt;
  chạy lại nhiều lần không còn 409 giả; nếu hết chỗ thì ghi rõ SKIP thay vì FAIL.
- **Test giao diện không ghi dữ liệu**: luồng đặt lịch được kiểm tra tới bước 3 (không submit), phần tạo
  booking/lead kiểm tra ở tầng API (`run_api_tests`, `smoke`).

### 9.2 Kết quả kiểm thử của phiên dựng này

- `npm run build`: 44 file JS/ESM hợp lệ, 5 tài nguyên index.html tồn tại, sitemap 55 URL.
- `check_backend()`: bundle Worker thành công, không lỗi import/route/CSDL.
- `lint_frontend()`: mọi `fetch('/api/...')` có route, mọi `#id` được query đều tồn tại.
- API test tự động: **21/21 đạt** trên lượt chạy gần nhất (heal`th, bootstrap, lead hợp lệ/không hợp lệ, honeypot,
  lịch trống, đặt lịch, chặn trùng lịch 409, admin 401/503, chat 503 khi thiếu key, CSV).
- Kiểm thử giao diện tất định: 23 route × 3 vòng, kết quả giống nhau 3/3, 0 vấn đề (bảng đầy đủ ở mục 9.1).
  Các kiểm tra thủ công trước đó (form lead → trang cảm ơn, đặt lịch → mã đặt chỗ, VI/EN, menu mobile,
  modal nhắc lịch .ics, admin login) đều đã xác nhận trên bản deploy.
- Công cụ ước tính chi phí: 4 bước → khung chi phí, gói gợi ý, form nhận đề xuất (đã kiểm thử).
  Khối kết quả tách sang `src/components/estimator-result.js`.
- Bộ đếm quỹ Chợ Phiên cộng dồn đúng từ bảng `markets` (50.890.000đ với dữ liệu mẫu).
- Kiểm thử giao diện **tất định** (chạy 3 lần liên tiếp, cùng kết quả): dùng `window.__VHUB_APP__.nav()`
  thay cho sleep, đọc `data-stat-final` thay cho text animation.

---

## 10. Ghi chú vận hành

- `PROGRESS.md` ghi tiến độ theo module và các vấn đề còn mở.
- Migration **chỉ thêm**, không sửa/xoá migration đã chạy. Phiên bản được đánh dấu trong bảng `_migrations`
  (adapter SQLite của nền tảng không cho phép `PRAGMA user_version`). Hiện có 9 migration.
- Seed chỉ chạy khi bảng rỗng — không ghi đè dữ liệu vận hành thật.

## 11. Câu lệnh merge code với nexrall

- Sync V-HUB main tới commit <hash>, chỉ ghi file, KHÔNG deploy