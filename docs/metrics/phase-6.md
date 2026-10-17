# Chỉ số Phase 6 — Hoàn thiện & phát hành v1.0

Theo bảng chỉ số của `docs/COMPARISON.md` (mẫu từ `phase-5.md`), thêm phần đánh giá cuối dự án (thay `FINAL.md`, `docs/metrics/README.md`). Tới cuối phase file này mới có mục **Số đo nền** (T-219, spec Phase 6 §5.1, ghi trước lượt review 1 của 6D), mốc Home PC sau lượt 2 (T-225) và số liệu hai lượt review đóng phase. Các mục khác để trống tới khi đóng phase.

- **Milestone:** "Phase 6 — Hoàn thiện & phát hành" — _điền cuối phase_
- **Bắt đầu:** 2026-10-11 (spec G1 #515) · **Task code cuối merge:** _cuối phase_ · **Đóng milestone:** _G7_
- **Máy:** _cuối phase_
- **Spec:** `docs/design/phase-6-hoan-thien.md` (G1 #515; G2 / G3 Owner duyệt 11/10)

## Task

_Điền cuối phase._

## Chỉ số

_Điền cuối phase._ Kích thước exe và thời gian khởi động lấy mốc từ mục "Số đo nền" dưới.

## Số đo nền (T-219, 13/10/2026)

Mốc để lượt 2 của deep review Phase 1–6 so "không xấu đi" (spec §5.1, §6.3).

- **Máy:** Office Laptop `D13_THINKPAD` (cùng máy đo Phase 4; Owner quyết đo ở đây 13/10). Office Laptop yếu hơn Home PC.
- **Code:** `main` `b139d8a` (sau T-216 #566, T-217 #568, T-218 #572, T-226 #570). Exe build release tại máy (`pnpm build:exe`), chép ra thư mục riêng `C:\perf-exe\`.
- **Dữ liệu tải:** `node tools/load-data.mjs`, mặc định mốc `2026-10-12`, seed `6` → `load-2026-10-12-seed6.p2cbackup` (15,3 MB). `tables` sha256 `1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd`. Số dòng: `customers` 1 496, `appointments` 10 414, `appointment_coordinators` 1 510, `policies` 1 697, `people` 54, `teams` 5, `kyc_notes` 5 672, `kyc_versions` 13 114, `kyc_facts` 13 833, `stage_transitions` 4 941, `ai_analyses` 103, `settings` 0. Sau khi nhập, Cài đặt → Dữ liệu ghi "4 team · 51 nhân sự · 1.481 KH · 10.252 lịch hẹn · 1.674 HĐ" (không tính dòng ở Thùng rác).
- **Cách đo:** probe T-218 (`e2e/perf/README.md`), `PERF_RUNS=5`, cửa sổ exe ở trên cùng, không dùng máy trong lúc đo (2,5 phút). Mở app lần đầu / mở lại: Owner bấm giờ, 3 lần mỗi loại. Lần đầu dùng 3 bản exe ở 3 thư mục chưa có `Project2C-data\`; mở lại dùng `C:\perf-exe\` đã có dữ liệu tải.
- **So với Phase 4:** số Phase 4 lấy từ `docs/metrics/phase-4.md` mục "Đo đầu-cuối" (exe `3e84ce8`, cùng máy, bộ dữ liệu tải của deep review Phase 1–4 cùng cỡ: 1 496 KH, 10 434 lịch hẹn) và dòng "Thời gian khởi động". Probe Phase 4 khác probe T-218, nên chỉ so được các thao tác giống nhau. Ở đây "xấu hơn" tính theo luật nhiễu của probe (Owner chốt 13/10): trung vị lớn hơn **quá 20 % và quá 10 ms**. Với khoảng Phase 4 (min–max) thì so với max. Theo luật này, chỉ có **mở app lần đầu** xấu hơn Phase 4 → #574. Đo lại hai exe trên cùng máy thì không có chậm đi thật: số ≈ 2 s của Phase 4 là bấm giờ ước chừng (mục "Mở app lần đầu, đo lại" dưới).
- **File JSON:** `docs/metrics/phase-6-baseline/perf.json` (probe), `docs/metrics/phase-6-baseline/size.json` (kích thước). Lượt 2 so bằng `PERF_BASE=docs/metrics/phase-6-baseline/perf.json` khi chạy probe, và `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json`. So mỗi file với chính nó: Δ 0 ở mọi dòng (probe: 35 thao tác qua `compareRuns` của `e2e/perf/stats.ts`; kích thước: mọi cột Δ = 0).

### Thời gian thao tác

Trung vị (min–max) của 5 lần, trừ khi ghi khác. Cột Ngưỡng: `< 200 ms` là Nhóm C của deep review Phase 1–4 (thao tác màn), probe đã kiểm; ngưỡng ghi "Owner chốt 13/10" là ngưỡng mới T-219 đề xuất, Owner chốt trên PR #575.

| Thao tác | Tên probe | Phase 4 `3e84ce8` | Phase 6 `b139d8a` | Ngưỡng | So Phase 4 |
|---|---|---|---|---|---|
| Mở app lần đầu (Owner bấm giờ, 3 lần) | — | ≈ 2 s (bấm giờ ước chừng; đo lại exe này: như Phase 6) | ≈ 3 s (3 / 3 / 3 s) | Không chậm hơn exe Phase 4 đo cùng cách, cùng máy (Owner chấp nhận 13/10, #574) | ≈ (đo lại, mục dưới) |
| Mở app lại, dữ liệu tải (Owner bấm giờ, 3 lần) | — | ≈ 1 s | ≈ 0,5 s (0,5 / 0,5 / 0,5 s) | ≤ 1 s (Owner chốt 13/10) | tốt hơn |
| Mở app: trang bắt đầu → mở xong dữ liệu (1 lần, mở lại) | `app.open-data` | ≈ 0,5–0,6 s (mở exe, 06/10) | 251 ms | ≤ 600 ms (Owner chốt 13/10) | tốt hơn |
| Màn đầu sau tải lại: Tổng quan | `reload.overview` | 318 ms | 338 ms (335–409) | < 500 ms (Owner chốt 13/10) | ≈ (+6 %) |
| Màn đầu sau tải lại: Lịch hẹn | `reload.appointments` | 310 ms | 330 ms (327–351) | < 500 ms (Owner chốt 13/10) | ≈ (+6 %) |
| Màn đầu sau tải lại: Khách hàng | `reload.customers` | 237 ms | 245 ms (245–247) | < 500 ms (Owner chốt 13/10) | ≈ (+3 %) |
| Màn đầu sau tải lại: Báo cáo | `reload.reports` | 309 ms | 314 ms (308–324) | < 500 ms (Owner chốt 13/10) | ≈ (+2 %) |
| Màn đầu sau tải lại: Team & nhân sự | `reload.team` | 284 ms | 293 ms (289–312) | < 500 ms (Owner chốt 13/10) | ≈ (+3 %) |
| Màn đầu sau tải lại: Cài đặt | `reload.settings` | 194 ms | 206 ms (202–218) | < 500 ms (Owner chốt 13/10) | ≈ (+6 %) |
| Lịch hẹn, kỳ Ngày | `appointments.period-day` | 13 ms | 10 ms (8–11) | < 200 ms ✅ | ≈ |
| Lịch hẹn, kỳ Tuần | `appointments.period-week` | 14 ms | 15 ms (14–15) | < 200 ms ✅ | ≈ |
| Lịch hẹn, kỳ Tháng | `appointments.period-month` | 14 ms | 15 ms (13–16) | < 200 ms ✅ | ≈ |
| Lịch hẹn, kỳ Năm | `appointments.period-year` | 14 ms | 18 ms (18–20) | < 200 ms ✅ | ≈ (+4 ms) |
| Lịch hẹn kỳ Năm, sắp cột Ngày tăng / giảm | `appointments.sort-date-asc` / `-desc` | 6 / 20 ms (2 lần, không ghi chiều) | 20 ms (19–21) / 12 ms (11–13) | < 200 ms ✅ | ≈ (lần chậm hơn: 20 / 20 ms) |
| Lịch hẹn kỳ Năm, chọn một dòng | `appointments.select-row-year` | 4–7 ms | 7 ms (6–9) | < 200 ms ✅ | ≈ |
| Lịch hẹn kỳ Tháng, bấm một ngày | `appointments.select-day-month` | 10–11 ms (Toàn bộ) | 9 ms (7–9) | < 200 ms ✅ | ≈ |
| Lịch hẹn kỳ Tháng, chọn một lịch | `appointments.select-row-month` | 7–9 ms | 6 ms (6–7) | < 200 ms ✅ | ≈ |
| Khách hàng → Bảng | `customers.view-table` | 23 ms | 19 ms (16–20) | < 200 ms ✅ | ≈ |
| Khách hàng, sắp Họ tên | `customers.sort-name` | 13–19 ms | 19 ms (14–23) | < 200 ms ✅ | ≈ |
| Hồ sơ KH có panel AI | `customer.open-ai` | — | 24 ms (23–24) | < 200 ms (Nhóm C) (Owner chốt 13/10) | mới |
| Bấm một lần trong Lịch sử phân tích | `customer.ai-history` | — | 3 ms (2–18) | < 200 ms (Nhóm C) (Owner chốt 13/10) | mới |
| Tổng quan, Lọc kỳ Năm | `overview.filter-year` | 18–24 ms (Toàn bộ) / 32–36 ms (Team) | 17 ms (17–21) | < 200 ms ✅ | ≈ |
| Tổng quan, Lọc kỳ Tháng | `overview.filter-month` | (như trên) | 16 ms (15–17) | < 200 ms ✅ | ≈ |
| Báo cáo, Lọc kỳ Năm | `reports.filter-year` | 9–14 ms | 10 ms (10–11) | < 200 ms ✅ | ≈ |
| Báo cáo, Lọc kỳ Tháng | `reports.filter-month` | 9–14 ms | 9 ms (8–10) | < 200 ms ✅ | ≈ |
| Báo cáo, bảng Theo RE | `reports.table-re` | — | 17 ms (15–17) | < 200 ms ✅ | mới |
| Thùng rác, mở | `trash.open` | — | 89 ms (85–97) | < 200 ms (Nhóm C) (Owner chốt 13/10) | mới |
| Thùng rác, lọc Lịch hẹn | `trash.kind-appointments` | — | 8 ms (7–22) | < 200 ms (Nhóm C) (Owner chốt 13/10) | mới |
| Nhập backup: chọn file → hộp xác nhận (không debugger) | `backup.read` | 1 197–1 241 ms | 1 035 ms (1 006–1 496) | ≤ 2 000 ms (Owner chốt 13/10) | tốt hơn |
| Nhập backup: xác nhận → báo đã nhập (không debugger) | `backup.import` | — | 50 ms (42–53) | ≤ 500 ms (Owner chốt 13/10) | mới |
| Xuất backup (không debugger) | `backup.export` | — | 481 ms (467–486) | ≤ 1 000 ms (Owner chốt 13/10) | mới |
| Xuất Excel ở Báo cáo (không debugger) | `reports.export-excel` | — | 35 ms (34–86) | ≤ 500 ms (Owner chốt 13/10) | mới |
| Tạo lịch hẹn tiếp theo, chọn ở kỳ Tháng (không debugger) | `appointments.next-month` | 211–217 ms | 116 ms (113–118) | ≤ 300 ms (Owner chốt 13/10) | tốt hơn |
| Tạo lịch hẹn tiếp theo, chọn ở kỳ Năm (không debugger) | `appointments.next-year` | 177–206 ms | 134 ms (120–141) | Năm không chậm hơn Tháng quá 50 ms ✅ (+18 ms); ≤ 300 ms (Owner chốt 13/10) | tốt hơn |
| Lưu file DB (15 lần: 5 lần nhập backup + 10 lần tạo lịch hẹn) | `db.save` | — | 162 ms (157–210) | ≤ 400 ms (Owner chốt 13/10) | mới |

Cách đặt ngưỡng mới: thao tác màn mới (panel AI, lịch sử phân tích, Thùng rác) dùng luôn Nhóm C (< 200 ms). Các thao tác còn lại lấy khoảng gấp đôi số đo trên Office Laptop rồi làm tròn, để lượt 2 không báo đỏ vì nhiễu. Hai ngưỡng mở app giữ bằng số Phase 4; ngưỡng mở lần đầu đổi sau khi đo lại (mục dưới).

#### Mở app lần đầu, đo lại (T-227, 13/10/2026)

Đo lại vì số Phase 6 (≈ 3 s) chậm hơn số Phase 4 (≈ 2 s) (#574). Cách đo: Home PC `DESKTOP-KDURKJP`; hai exe build release tại máy, exe Phase 4 `3e84ce8` và exe của `main` `b0f2f50` (code app giống `b139d8a`); mỗi exe 3 lần. Mỗi lần chép exe vào một thư mục mới (chưa có `Project2C-data\`, app sinh seed demo), mở với cổng debug WebView2, chờ 12 s rồi mới nối CDP đọc mốc trong trang. Nối muộn để debugger không làm chậm lúc mở. Lúc gọi exe ghi bằng `Date.now()` ngoài exe, so với `performance.timeOrigin` của trang. "Màn đầu có số liệu" là mốc vẽ nội dung lớn nhất (LCP).

| Mốc (min–max của 3 lần) | Phase 4 `3e84ce8` | Phase 6 (`b0f2f50`) |
|---|---|---|
| Gọi exe → trang bắt đầu | 581–585 ms | 621–679 ms |
| Sinh seed demo (`p2c:demo-seed`) | 2 960–3 072 ms | 3 016–3 046 ms |
| Trang bắt đầu → mở xong dữ liệu (`p2c:data-open`) | (chưa có mốc) | 3 185–3 216 ms |
| Lưu file DB lần đầu (`p2c:db-save`, chạy song song lúc vẽ màn) | (chưa có mốc) | 171–187 ms |
| **Gọi exe → màn đầu có số liệu** | **3 822–3 937 ms** | **3 989–4 019 ms** |
| File `project2c.db` | 9 306 112 byte | 9 580 544 byte |

- **Không có chậm đi thật:** chênh ≈ 0,1 s (≈ +3 %), trong luật nhiễu (quá 20 % và quá 10 ms mới là xấu hơn). Gần hết thời gian là sinh seed, và seed Phase 4 cũng mất ≈ 3 s. Trong Node (Vitest, cùng máy), một lần seed mất ≈ 3,6 s ở cả hai mốc. Số ≈ 2 s ghi ở Phase 4 là bấm giờ ước chừng, đo lại exe Phase 4 không ra số đó.
- **Office Laptop** (exe `b139d8a`, mục trên): `p2c:data-open` 3 140 ms, Owner bấm giờ ≈ 3 s; chưa đo riêng sinh seed / lưu file ở máy này. Code mở lần đầu giống Home PC nên phần sinh seed cũng chiếm gần hết.
- **Seed tốn thời gian ở đâu** (profile V8 một lần seed trong Node): khoảng 40 % là drizzle dựng câu SQL ở mỗi lần gọi lệnh (riêng hàm `is()` của drizzle ≈ 0,75 s trên 4,2 s). Muốn nhanh hơn thì phải sửa các lệnh ở `packages/db` (dựng sẵn câu SQL), không sửa ở seed được vì seed phải chạy qua lệnh. Việc này không làm.
- **Owner quyết 13/10 (#574):** chấp nhận số mới. Ngưỡng mở lần đầu là "không chậm hơn exe Phase 4 đo cùng cách, cùng máy", không phải ≤ 2 s.
- **Số tham chiếu cho lượt 2** (khỏi build lại exe `3e84ce8`): đo trên Home PC theo cách trên, mốc "gọi exe → màn đầu có số liệu" (LCP), Phase 4 max **3 937 ms**. Lượt 2 đo exe mới cùng cách, cùng máy, 3 lần; xấu hơn khi trung vị quá 3 937 ms thêm **quá 20 % và quá 10 ms** (tức > 4 724 ms). Owner quyết 17/10 (ADR-0001 phụ lục M7): đo trên Home PC thì so với số này; đo trên Office Laptop thì so với số T-219 ở trên, không build lại exe Phase 4. Lượt 2 đo ở Home PC: 3 526 ms, không xấu hơn (mục "Mốc Home PC sau deep review lượt 2" dưới).

Không đo lại ở đây: các thao tác Phase 4 không có trong §5.2 ("Đổi tên team", "Vào Tổng quan / Báo cáo / Team" bằng sidebar khi không tải lại). Bảng hàm thuần trong Node của Phase 4 (`importBackup` ≤ 1,1 s, `listAppointments` ≤ 65 ms, `teamCompare` / `reportRows` ≤ 15 ms, `monthGrid` ≤ 2 ms, `countRecords` ≤ 15 ms) cũng không đo lại: đó là probe Vitest riêng của deep review, nằm ngoài repo, không phải thao tác trên exe. Gói F của lượt 1 (T-222) quyết định có đo lại hay không.

### Bộ nhớ webview

| Chỉ số | Tên probe | Phase 4 | Phase 6 `b139d8a` | Ngưỡng |
|---|---|---|---|---|
| JS heap của webview sau khi đi hết các màn (sau GC; không gồm bộ nhớ WebAssembly của sql.js, nơi giữ DB) | `memory.js-heap` | chưa đo | 16,4 MB (1 lần) | ≤ 21 MB (nền + 5 MB, như luật ⚠️ của probe) (Owner chốt 13/10) |

### Kích thước

`node tools/size-report.mjs` sau `pnpm build:exe` (build web nằm trong đó) ở `b139d8a`, cùng máy.

Bundle web (`apps/desktop/dist`):

| File | Thô (byte) | Gzip (byte) |
|---|---:|---:|
| `assets/index.js` | 891 942 | 262 010 |
| `assets/exceljs.min.js` | 929 569 | 255 572 |
| `assets/chart.js` | 513 302 | 172 450 |
| `assets/index.css` | 28 364 | 6 412 |
| `assets/rolldown-runtime.js` | 1 106 | 627 |
| **Tổng JS / CSS** | **2 364 283** | **697 071** |
| Tệp khác (15 file: wasm, font, ảnh…) | 849 196 | — |

Exe:

| File | Phase 4 `3e84ce8` | Phase 5 `2b4f43d` | Phase 6 `b139d8a` |
|---|---:|---:|---:|
| `project2c.exe` (release, build tại máy) | 4 179 968 byte (3,99 MB) | 5 395 968 byte (5,15 MB) | **5 414 400 byte (5,16 MB)** |

Dòng code theo gói review (spec §6.2; file git theo dõi; test gồm `*.test.*`, `e2e/`, `test-support.ts`, fixture, golden, `#[cfg(test)]` của Rust; sinh tự động: migration, `pnpm-lock.yaml`):

| Gói | Sản phẩm | Test | Sinh tự động | File |
|---|---:|---:|---:|---:|
| A. Lõi dữ liệu | 7 473 | 11 847 | 289 | 93 |
| B. File và Rust | 2 001 | 3 968 | 0 | 19 |
| C. AI | 5 129 | 5 985 | 0 | 60 |
| D. Màn nhập liệu | 6 820 | 1 748 | 0 | 73 |
| E. Lịch hẹn, chỉ số, quản lý | 7 032 | 3 545 | 0 | 51 |
| F. Xuyên gói / công cụ | 3 761 | 10 898 | 4 628 | 83 |
| **Tổng** | **32 216** | **37 991** | **4 917** | **379** |

Không đếm 278 file tài liệu / dữ liệu / ảnh / font / lockfile (`.md` 169, `.png` 34, `.json` 29…; danh sách đủ trong output của lệnh).

### Mốc Home PC sau deep review lượt 2 (T-225, 17/10/2026)

Mốc để G7 và mọi lần đo sau trên Home PC so "không xấu đi", thay `perf-ref` lượt 1 Home PC (DR6-98). Từ #620 (DR6-06), mỗi lần mở dữ liệu có file chạy `quick_check`, nên so với số cũ thì `app.open-data` và `reload.*` luôn báo ⚠️.

- **Máy:** Home PC `DESKTOP-KDURKJP`.
- **Code:** `4217ed4`. Exe release build tại máy: 5 404 672 byte (Δ −9 728 so `b139d8a`: phiên bản, `crate-type`).
- **Dữ liệu tải:** `load-2026-10-12-seed6.p2cbackup` sinh ở SHA đó, `tables` sha256 `1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591`. Sau khi nhập, `project2c.db` 14 069 760 byte (+4,6 %, ba chỉ mục 0009).
- **Cách đo:** probe T-218, `PERF_RUNS=5`, gắn DevTools như mọi lần. Mở lại exe trên dữ liệu tải rồi nối probe ngay. Lần chạy ngay sau mở lần đầu bị bỏ, vì khi đó `app.open-data` đo lúc sinh seed (3 070 ms).
- **File JSON:** `docs/metrics/phase-6-baseline/perf-home-pc-luot-2.json` → so bằng `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-luot-2.json`.
- **Bảng đủ 35 thao tác:** `docs/reviews/raw/2026-10-17/common-baseline.md`. Phân tích: tổng hợp lượt 2 §7.

| Thao tác | Lượt 1 Home PC `8855345` | Lượt 2 `4217ed4` | Ngưỡng |
|---|---|---|---|
| `app.open-data` | 189 ms | 301 ms ⚠️ | ≤ 600 ms ✅ |
| `reload.*` (6 màn) | 180–293 ms | 247–355 ms ⚠️ (+62…+67 ms) | < 500 ms ✅ |
| `trash.open` | 80 ms | 73 ms | < 200 ms ✅ |
| Các thao tác màn còn lại | 6–22 ms | 5–22 ms | < 200 ms ✅ |
| `backup.read` / `backup.import` / `backup.export` | 794 / 49 / 424 ms | 814 / 43 / 422 ms | ≤ 2 000 / 500 / 1 000 ms ✅ |
| `reports.export-excel` | 24 ms | 27 ms | ≤ 500 ms ✅ |
| `appointments.next-month` / `next-year` | 102 / 106 ms | 99 / 106 ms | ≤ 300 ms; Năm − Tháng ≤ 50 ms ✅ |
| `db.save` | 140 ms | 147 ms | ≤ 400 ms ✅ |
| `memory.js-heap` | 16,4 MB | 16,5 MB | ≤ 21 MB ✅ |
| Gọi exe → màn đầu có số liệu (LCP, 3 lần, cách T-227) | — | 3 526 ms (3 505–3 597) | xấu hơn khi > 4 724 ms ✅ |

- **Bảy dòng ⚠️ là chi phí có chủ ý.** `quick_check` lúc mở tốn 60–68 ms, hai bên đo độc lập. Cộng thêm file lớn hơn 4,6 %. Riêng `app.open-data` (1 mẫu) còn phụ thuộc trạng thái profile WebView2: profile mới ≈ 406 ms, mở lại 301 ms.
- **`trash.open` khi gắn DevTools chậm ×2,4–3,3**, vì thao tác chạy nhiều câu SQL. Exe không gắn DevTools: 31,6 / 48,3 / 87,6 / 138,3 ms ở 113 / 263 / 713 / 1 313 dòng, tức ≈ 0,09 ms / dòng, chạm 200 ms ở ≈ 2 000 dòng (DR6-84). Probe sẽ đo `trash.open` khi không gắn DevTools ở #660 (T-256). Thùng rác lớn được xử lý bằng chức năng "Dọn sạch Thùng rác" ở #662 (T-258).
- **Mốc này phải đo lại trước G7.** #656 (T-252) đổi `quick_check` → `integrity_check`, thêm ≈ 30 ms mỗi lần mở (ước `app.open-data` ≈ 330 ms). Sau khi merge, đo lại `app.open-data` / `reload.*` trên Home PC, ghi số mới vào đây.

## Kiểm tra trên `main`

_Điền cuối phase._

## Kích thước PR vượt ngưỡng

_Điền cuối phase._

## Review đóng phase

Deep review Phase 1–6 (6D, kế hoạch `docs/process/deep-review-phase-1-6.md`), gói A–F; báo cáo gốc ở `docs/reviews/raw/<ngày>/`.

- **Lượt 1 (15/10, `8855345`):**
  - Reviewer: Claude, Codex, Muse Spark 1.3. Office Laptop chính thức, Home PC tham khảo.
  - Tổng hợp: `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md`.
  - **67** vấn đề DR6-01…67: **2 Medium**, 48 Low, 17 Nit. Hai Medium: khôi phục cuộc gặp giữ nhóm; bàn giao KH.
  - Owner chọn Phương án 2: 16 Issue #592–#607.
- **Lượt 2 (17/10, `4217ed4`):**
  - Reviewer: Claude, Codex; một đợt trên Home PC (ADR-0001 M7).
  - Tổng hợp: `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md`.
  - 59 DR6 có Issue: 52 đã sửa, 4 sửa một phần, 3 hồi quy.
  - 57 phát hiện mới → **36** vấn đề DR6-68…103: **1 Medium** (DR6-68, hồi quy do #616), 23 Low, 12 Nit. 0 bị bác.
  - Kết luận: chưa sẵn sàng ở `4217ed4`.
  - Owner chọn Phương án 3 (sửa hết): 12 Issue #652–#663. Không có lượt 3.

_Còn điền: kết quả đợt sửa lượt 2, kiểm lại trước G7._

## Điều hướng (riêng 2C, `docs/metrics/README.md`)

_Điền cuối phase._

## Đánh giá cuối dự án

_Điền ở G7 (thay `FINAL.md`)._

## Việc hoãn sau v1.0

_Điền cuối phase._

## Ghi chú

_Điền cuối phase._
