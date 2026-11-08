# Chỉ số Phase 6 — Hoàn thiện & phát hành v1.0

Theo bảng chỉ số của `docs/COMPARISON.md` (mẫu từ `phase-5.md`), thêm phần đánh giá cuối dự án (thay `FINAL.md`, `docs/metrics/README.md`). Tới cuối phase file này mới có mục **Số đo nền** (T-219, spec Phase 6 §5.1, ghi trước lượt review 1 của 6D), mốc Home PC sau lượt 2 (T-225), mốc Home PC sau #656 (T-264), số đo deep review lượt 3 (T-267) và lượt 4 (T-318), số đo G7 NT-HN-01 (T-348), số đo deep review lượt 5 (T-362), số liệu năm lượt review đóng phase cùng các đợt sửa giữa chúng, và bảng PR vượt ngưỡng tới 27/10 (T-307). Các mục khác để trống tới khi đóng phase.

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

Trung vị (min–max) của 5 lần, trừ khi ghi khác. Cột Ngưỡng: `< 200 ms` là Nhóm C của deep review Phase 1–4 (thao tác màn), probe đã kiểm; ngưỡng ghi "Owner chốt 13/10" là ngưỡng mới T-219 đề xuất, Owner chốt trên PR #575. Ngưỡng Dọn sạch Thùng rác (dòng cuối) Owner chốt 21/10 (tổng hợp lượt 3 §9 Q6 (a)).

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
| Dọn sạch Thùng rác: bấm "Backup rồi dọn sạch" → thông báo 11j (exe, dữ liệu tải, đo tay) | — | — | — (chưa có ở `b139d8a`; lượt 3 Home PC ≈ 150 ms, mục "Số đo deep review lượt 3") | ≤ 500 ms (Owner chốt 21/10) | mới |

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

Mốc Home PC ở `4217ed4`, thay `perf-ref` lượt 1 Home PC (DR6-98). G7 so với mốc sau #656 (mục dưới). Từ #620 (DR6-06), mỗi lần mở dữ liệu có file chạy `quick_check`, nên so với số cũ thì `app.open-data` và `reload.*` luôn báo ⚠️.

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
| Các thao tác màn còn lại (trừ `customer.ai-history`) | 6–22 ms | 5–22 ms | < 200 ms ✅ |
| `backup.read` / `backup.import` / `backup.export` | 794 / 49 / 424 ms | 814 / 43 / 422 ms | ≤ 2 000 / 500 / 1 000 ms ✅ |
| `reports.export-excel` | 24 ms | 27 ms | ≤ 500 ms ✅ |
| `appointments.next-month` / `next-year` | 102 / 106 ms | 99 / 106 ms | ≤ 300 ms; Năm − Tháng ≤ 50 ms ✅ |
| `db.save` | 140 ms | 147 ms | ≤ 400 ms ✅ |
| `memory.js-heap` | 16,4 MB | 16,5 MB | ≤ 21 MB ✅ |
| Gọi exe → màn đầu có số liệu (LCP, 3 lần, cách T-227) | — | 3 526 ms (3 505–3 597) | xấu hơn khi > 4 724 ms ✅ |

- **Bảy dòng ⚠️ là chi phí có chủ ý.** `quick_check` lúc mở tốn 60–68 ms, hai bên đo độc lập. Cộng thêm file lớn hơn 4,6 %. Riêng `app.open-data` (1 mẫu) còn phụ thuộc trạng thái profile WebView2: profile mới ≈ 406 ms, mở lại 301 ms.
- **`trash.open` khi gắn DevTools chậm ×2,4–3,3**, vì thao tác chạy nhiều câu SQL. Exe không gắn DevTools: 31,6 / 48,3 / 87,6 / 138,3 ms ở 113 / 263 / 713 / 1 313 dòng, tức ≈ 0,09 ms / dòng, chạm 200 ms ở ≈ 2 000 dòng (DR6-84). Probe sẽ đo `trash.open` khi không gắn DevTools ở #660 (T-256). Thùng rác lớn được xử lý bằng chức năng "Dọn sạch Thùng rác" ở #662 (T-258).
- **Đã đo lại sau #656** (T-252 đổi `quick_check` → `integrity_check`): mục dưới, mốc cho G7.

### Mốc Home PC sau #656 (T-264, 18/10/2026)

Mốc để G7 và mọi lần đo sau trên Home PC so "không xấu đi", thay mốc lượt 2 ở trên. Từ #656 (T-252, DR6-73), mỗi lần mở dữ liệu có file chạy `integrity_check` thay `quick_check`.

- **Máy:** Home PC `DESKTOP-KDURKJP`.
- **Code:** `main` `dae9df3` (#694). Exe release build tại máy: 5 408 768 byte (Δ +4 096 so `4217ed4`).
- **Dữ liệu tải:** sinh lại ở `dae9df3`, `tables` sha256 `1c306cfb…589591`, bằng lượt 2. Sau khi nhập, `project2c.db` 14 069 760 byte (bằng lượt 2); Cài đặt → Dữ liệu ghi "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ".
- **Cách đo:** như mốc lượt 2. Probe T-218, `PERF_RUNS=5`, gắn DevTools. Nhập dữ liệu tải, đóng exe, mở lại cùng thư mục rồi nối probe ngay. Mở lần đầu: cách T-227, 3 lần.
- **Đối chứng cùng ngày:** chạy lại cùng probe, cùng dữ liệu trên exe lượt 2 (`4217ed4`, sha256 `E2C421…4504`) ngay sau đó, để tách phần do code khỏi phần do máy hôm nay. Thêm `app.open-data` 5 lần mỗi exe, mở xen kẽ: script đọc mốc `p2c:data-open` như probe, cùng profile WebView2.
- **File JSON:** `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` → so bằng `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`.

Trung vị (min–max của 5 lần ở cột mốc mới). ⚠️ = xấu hơn lượt 2 theo luật nhiễu (quá 20 % và quá 10 ms).

| Thao tác | Lượt 2 `4217ed4` (17/10) | `4217ed4` đo lại (18/10) | **`dae9df3`, mốc mới** | Ngưỡng |
|---|---|---|---|---|
| `app.open-data` (probe, 1 mẫu) | 301 ms | 321 ms | 387 ms ⚠️ | ≤ 600 ms ✅ |
| `app.open-data` (5 lần mở xen kẽ) | — | 308 ms (301–317) | 351 ms (335–354) | ≤ 600 ms ✅ |
| `reload.overview` | 355 ms | 368 ms | 398 ms (394–462) | < 500 ms ✅ |
| `reload.appointments` | 349 ms | 355 ms | 391 ms (384–410) | < 500 ms ✅ |
| `reload.customers` | 272 ms | 281 ms | 336 ms (318–342) ⚠️ | < 500 ms ✅ |
| `reload.reports` | 328 ms | 341 ms | 376 ms (371–391) | < 500 ms ✅ |
| `reload.team` | 311 ms | 325 ms | 355 ms (348–376) | < 500 ms ✅ |
| `reload.settings` | 247 ms | 256 ms | 283 ms (277–308) | < 500 ms ✅ |
| `trash.open` | 73 ms (gắn DevTools) | 34 ms | 34 ms (33–37) | < 200 ms ✅ |
| Các thao tác màn còn lại (19, gồm `customer.ai-history`) | 2–22 ms | 2–24 ms | 2–23 ms | < 200 ms ✅ |
| `backup.read` / `backup.import` / `backup.export` | 814 / 43 / 422 ms | 836 / 42 / 425 ms | 835 / 43 / 438 ms | ≤ 2 000 / 500 / 1 000 ms ✅ |
| `reports.export-excel` | 27 ms | 28 ms | 20 ms | ≤ 500 ms ✅ |
| `appointments.next-month` / `next-year` | 99 / 106 ms | 100 / 108 ms | 101 / 107 ms | ≤ 300 ms; Năm − Tháng ≤ 50 ms ✅ (+7 ms) |
| `db.save` | 147 ms | 149 ms | 151 ms | ≤ 400 ms ✅ |
| `memory.js-heap` | 16,5 MB | 16,5 MB | 16,5 MB | ≤ 21 MB ✅ |
| Gọi exe → màn đầu có số liệu (LCP, 3 lần, cách T-227) | 3 526 ms (3 505–3 597) | — | 3 663 ms (3 656–3 746) | xấu hơn khi > 4 724 ms ✅ |

- **Máy hôm nay gần như hôm đo lượt 2.** Cùng exe `4217ed4`, không dòng nào ⚠️; `app.open-data` và `reload.*` lệch +6…+20 ms (≤ 7 %).
- **Phần do code** (`dae9df3` trừ `4217ed4`, cùng ngày):
  - Năm màn `reload.*` tăng +27…+35 ms, khớp chi phí `integrity_check` (PR #674: +31 ms trong Node, +34 ms trên exe).
  - `app.open-data` 5 lần mở xen kẽ: +43 ms. Số 387 ms của probe chỉ là 1 mẫu, cao hơn cả 5 lần mở (335–354 ms). Như ghi ở mốc lượt 2, số này phụ thuộc trạng thái profile WebView2.
- **Hai dòng ⚠️:**
  - `app.open-data` là chi phí có chủ ý (DR6-73, Q3 (a), Owner 17/10).
  - `reload.customers` tăng +55 ms, hơn chi phí `integrity_check` ≈ 20 ms. Phần dư này chưa rõ nguyên nhân: từ `4217ed4`, màn danh sách Khách hàng (`CustomersScreen.tsx`, `customers-view.ts`) không đổi. Màn vẫn còn cách ngưỡng 164 ms.
- **`trash.open`** đo khi đã ngắt DevTools từ T-256 (#660): 34 ms ở cả hai exe. Số 73 ms của lượt 2 đo khi gắn DevTools nên không so được.
- **Mở lần đầu:** LCP +137 ms (+4 %) so lượt 2, trong luật nhiễu. Lần mở đầu chưa có file nên không chạy `integrity_check`. Các mốc khác:
  - sinh seed 3 060 ms (3 038–3 090);
  - `p2c:data-open` 3 240 ms (3 239–3 275);
  - `p2c:db-save` 119 ms;
  - `project2c.db` 9 949 184 byte, bằng lượt 2.

### Số đo deep review lượt 3 (T-267, 20–21/10/2026)

Không thay mốc sau #656: G7 vẫn so với mốc đó. Phân tích: tổng hợp lượt 3 §7; bảng đủ: `docs/reviews/raw/2026-10-21/common-baseline.md`.

- **Máy:** Home PC `DESKTOP-KDURKJP`. **Code:** `119e2e4`, exe release 5 408 768 byte (bằng exe mốc sau #656).
- **Dữ liệu tải:** sinh ở `119e2e4`, `tables` sha256 `1c0a43fb…746d003f` (khác `1c306cfb…589591` của mốc sau #656, cùng số dòng). Script nạp vào exe qua cổng debug, đúng thao tác `e2e/perf/README.md` bước 3 (Owner cho phép 20/10); Cài đặt → Dữ liệu ghi như mốc sau #656.
- **So mốc sau #656: không dòng nào ⚠️**, mọi thao tác trong ngưỡng:
  - `app.open-data` 373 ms (mốc 387); `reload.*` 280–392 ms; `trash.open` 38 ms; 19 thao tác màn còn lại (gồm `customer.ai-history`) 2–22 ms;
  - `backup.read` / `backup.import` / `backup.export` 827 / 47 / 425 ms; `db.save` 146 ms; JS heap 16,6 MB;
  - mở lần đầu (LCP, 3 lần) 3 614 ms (mốc 3 663).
- **Dọn sạch Thùng rác** (mới, đo lần đầu):
  - exe, bấm "Backup rồi dọn sạch" → khung hình đầu có thông báo 11j: **151,8 ms** ở dữ liệu tải (113 dòng Thùng rác), 148–154 ms ở Thùng rác 1 313 dòng. Ngưỡng ≤ 500 ms (Owner chốt 21/10, ≈ 3× số đo); G7 đo tay như lượt này;
  - `trash.open` trên exe trước → sau khi dọn: 38,9 → 9,6 ms (113 dòng), 151,9 → 3,7 ms (1 313 dòng);
  - Node `purgeTrash` cả `VACUUM`: 93,8 ms (113 dòng), 109,8 ms (1 313 dòng); cỡ file −4,7 % / −89,5 %.
- **`integrity_check` theo cỡ file:** ≈ 7,5 ms / MB trong Node. Trên exe, `p2c:data-open` 366 / 453 / 546 ms ở file 14,1 / 20,0 / 25,4 MB (dữ liệu tải, rồi ×2 / ×3 KH mỗi RE); ngoại suy ≈ 16 ms / MB thì chạm 600 ms ở ≈ 28–29 MB, tức ≈ 2× cỡ file dữ liệu tải. Ngưỡng `app.open-data` ≤ 600 ms chỉ áp cho dữ liệu tải.
- **Hàm thuần trong Node:** không hàm nào xấu hơn lượt 2 cùng máy theo luật nhiễu. `listTrash` +4–6 ms là bước gốc của `KEPT_APPOINTMENTS` trong `keptRecords` mới (KNOWN #709, CL3-A29).

### Số đo deep review lượt 4 (T-318, 29–30/10/2026)

Không thay mốc sau #656: G7 vẫn so với mốc đó. Phân tích: tổng hợp lượt 4 §7; bảng đủ: `docs/reviews/raw/2026-10-31/common-baseline.md`.

- **Máy:** Home PC `DESKTOP-KDURKJP`. **Code:** `2e51e25`, exe release 5 649 408 byte (+240 640 so lượt 3; riêng `icon.ico` +71 343).
- **Dữ liệu tải:** sinh ở `2e51e25`, `tables` sha256 `ad82051b…` (khác lượt 3 chỉ ở cột `prompt_version`, cùng số dòng). Script nạp vào exe qua cổng debug như lượt 3.
- **So mốc sau #656 và so lượt 3: không dòng nào ⚠️**, mọi thao tác trong ngưỡng:
  - `app.open-data` 370 ms (mốc 387); `reload.*` 279–405 ms; `trash.open` 32 ms; các thao tác màn còn lại 2–24 ms;
  - `backup.read` / `backup.import` / `backup.export` 977 / 47 / 436 ms; `db.save` 149 ms; JS heap 16,6 MB;
  - mở lần đầu (LCP, 3 lần) 3 521 ms (mốc 3 663).
- **`backup.read` +142 ms (+17 %) so mốc**, dưới luật nhiễu. Đo theo cặp cùng lúc (exe lượt 3 ↔ lượt 4) thì +55 ms (+6,9 %): chi phí có chủ ý của luật nhập 7 (tính lại hash phiên bản KYC, K33).
- **Dọn sạch Thùng rác:** bấm "Backup rồi dọn sạch" → thông báo 11j 123,3 ms (≤ 500 ms; lượt 3: 151,8); `trash.open` trước → sau 34,1 → 2,0 ms; Node `purgeTrash` cả `VACUUM` 85,2 / 129,8 ms (113 / 1 313 dòng).
- **Bundle:** JS / CSS 2 358 427 B (−41 966 so lượt 3); `index.js` 884 698 B (−43 234: `zod/mini`); tệp khác +172 925 B (font Playfair, ba ảnh logo, favicon PNG).
- **Phát hiện P:** chỉ DR6-136. `byName` làm sắp bảng Lịch hẹn 10 255 dòng theo KH chậm từ 9,4 lên 65,2 ms trong Node (54–60 ms trên bản web): vượt luật nhiễu, dưới ngưỡng < 200 ms.

### Số đo G7, NT-HN-01 (T-348, 03/11/2026)

Lần đo nghiệm thu NT-HN-01 (`docs/testing/nghiem-thu-v1.md`) trên Home PC, so với mốc sau #656 (mốc không đổi). Lần đo trước cùng ngày, trên exe `eaa83c3`, dừng ở `appointments.select-day-month`: probe chỉ chọn lịch Đã gặp trong tháng hiện tại, mà tháng 11 chưa có. T-345…T-347 sửa probe (#984, #988, #992); lần này đo lại đủ.

- **Máy:** Home PC `DESKTOP-KDURKJP`. **Code:** `main` `233c77e` (#993). Exe release build tại máy: 5 649 408 byte (bằng lượt 4), sha256 `94443F07…68115`.
- **Dữ liệu tải:** `node tools/load-data.mjs` mặc định (neo 12/10/2026, seed 6), sinh ở `233c77e`. `tables` sha256 `e256e4f1…b345a2`, cùng số dòng như lượt 4 (lượt 4: `ad82051b…`; sau đó prompt lên `analysis@5` / `discovery@5`, #913). Sau khi nhập, Cài đặt → Dữ liệu ghi "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ"; `project2c.db` 14 102 528 byte.
- **Cách đo:** như lượt 4, thêm bước 3 (mở lại 3 lần; lượt 4 không đo mở lại), một script chạy liền 23:02–23:08, máy rảnh, cửa sổ exe ở trên cùng:
  1. mở lần đầu 3 lần, cách T-227;
  2. thư mục mới: mở exe, nhập dữ liệu tải qua cổng debug (`e2e/perf/README.md` bước 3), đóng;
  3. mở lại trên dữ liệu tải 3 lần: chờ 12 s rồi nối CDP, đọc mốc như mở lần đầu;
  4. mở lại lần nữa, nối probe ngay: probe sau T-347, `PERF_RUNS=5`, `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`. Kỳ Năm dùng năm 2026 (`Lịch năm 2026, 0 back: 79 met`), kỳ Tháng dùng tháng 10/2026 (`Lịch tháng 10/2026, 1 back: 10 days met`);
  5. Dọn sạch Thùng rác một lần trên cùng exe, đo tay như lượt 3, lượt 4: nút được đánh dấu, trang tự bấm sau khi đã ngắt CDP.
- **File JSON của probe, log:** giữ ngoài repo trên Home PC (`C:\workspace\g7-home-pc\lan-2\`), như lượt 3, lượt 4.

**Kết quả: không dòng nào ⚠️ so mốc sau #656, mọi thao tác trong ngưỡng.**

Bảng probe in ra, cột Nền là mốc sau #656 (`dae9df3`). Cột Ngưỡng theo bảng "Thời gian thao tác" và "Bộ nhớ webview" ở trên:

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 320 ms | 320 ms | 320 ms | 387 ms | −67 ms (−17%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 975 ms | 962 ms | 987 ms | 835 ms | +140 ms (+17%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 44 ms | 37 ms | 50 ms | 43 ms | +2 ms (+4%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 148 ms | 144 ms | 154 ms | 151 ms | −3 ms (−2%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 395 ms | 391 ms | 450 ms | 398 ms | −3 ms (−1%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 385 ms | 385 ms | 388 ms | 391 ms | −5 ms (−1%) | < 500 ms ✅ |
| `reload.customers` | 5 | 308 ms | 307 ms | 320 ms | 336 ms | −28 ms (−8%) | < 500 ms ✅ |
| `reload.reports` | 5 | 367 ms | 364 ms | 379 ms | 376 ms | −10 ms (−3%) | < 500 ms ✅ |
| `reload.team` | 5 | 350 ms | 350 ms | 379 ms | 355 ms | −4 ms (−1%) | < 500 ms ✅ |
| `reload.settings` | 5 | 280 ms | 276 ms | 292 ms | 283 ms | −3 ms (−1%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 6 ms | 6 ms | 14 ms | 8 ms | −2 ms (−28%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 11 ms | 11 ms | 13 ms | 12 ms | −1 ms (−6%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 5 ms | 13 ms | −9 ms (−65%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 12 ms | 17 ms | −7 ms (−40%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 18 ms | 17 ms | 20 ms | 17 ms | +0 ms (+2%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 11 ms | 12 ms | 11 ms | +0 ms (+1%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 8 ms | 6 ms | +0 ms (+5%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 7 ms | 3 ms | 7 ms | 9 ms | −2 ms (−26%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 5 ms | 5 ms | 6 ms | 7 ms | −2 ms (−35%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 20 ms | 19 ms | 24 ms | 20 ms | +0 ms (+0%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 23 ms | 14 ms | 25 ms | 23 ms | 0 ms (−1%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 23 ms | 19 ms | +1 ms (+5%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 2 ms | 2 ms | 8 ms | 2 ms | 0 ms (−5%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 17 ms | 16 ms | 21 ms | 16 ms | +1 ms (+8%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 14 ms | 13 ms | 15 ms | 14 ms | 0 ms (−1%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 10 ms | 14 ms | 10 ms | +0 ms (+0%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 10 ms | 11 ms | 10 ms | +0 ms (+3%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 22 ms | 17 ms | +0 ms (+1%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 9 ms | 7 ms | 12 ms | 6 ms | +3 ms (+46%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,7 MB | 16,7 MB | 16,7 MB | 16,5 MB | +0,2 MB (+1%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 33 ms | 31 ms | 44 ms | 34 ms | −1 ms (−4%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 25 ms | 22 ms | 74 ms | 20 ms | +5 ms (+25%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 435 ms | 425 ms | 451 ms | 438 ms | −3 ms (−1%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 112 ms | 110 ms | 114 ms | 101 ms | +11 ms (+11%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 109 ms | 106 ms | 111 ms | 107 ms | +2 ms (+1%) | ≤ 300 ms ✅; Năm − Tháng −3 ms ≤ 50 ms ✅ |

Đo ngoài probe (trung vị, min–max của 3 lần, trừ khi ghi khác):

| Thao tác | G7 `233c77e` | Mốc sau #656 `dae9df3` | Ngưỡng |
|---|---|---|---|
| Mở lần đầu: gọi exe → màn đầu có số liệu (LCP, cách T-227) | 3 420 ms (3 408–3 462) | 3 663 ms (3 656–3 746) | xấu hơn khi > 4 724 ms ✅ |
| Mở lần đầu: sinh seed / `p2c:data-open` / `p2c:db-save` | 2 847 / 2 994 / 123 ms | 3 060 / 3 240 / 119 ms | — |
| Mở lại trên dữ liệu tải: gọi exe → màn đầu có số liệu (LCP) | 617 ms (605–625) | — (chưa đo cách này) | ≤ 1 s ✅ |
| Mở lại: `p2c:data-open` | 317 ms (316–326) | 351 ms (335–354; 5 lần mở xen kẽ) | ≤ 600 ms ✅ |
| Dọn sạch Thùng rác: bấm "Backup rồi dọn sạch" → thông báo 11j (1 lần) | 130,5 ms (lưu file 150,4 ms) | — (lượt 4: 123,3 ms) | ≤ 500 ms ✅ |
| `trash.open` trước → sau khi dọn (3 lần mỗi bên) | 30,6 → 1,9 ms | — (lượt 4: 34,1 → 2,0 ms) | < 200 ms ✅ |

- **`backup.read` +140 ms (+17 %)**, dưới luật nhiễu. Bằng mức lượt 4 (+142 ms): chi phí có chủ ý của luật nhập 7 (tính lại hash phiên bản KYC, K33).
- **Các dòng tăng khác đều dưới luật nhiễu** (phải quá 20 % **và** quá 10 ms). Tăng nhiều nhất: `appointments.next-month` +11 ms (+11 %), `reports.export-excel` +5 ms (+25 %), `trash.kind-appointments` +3 ms (+46 %).
- **`app.open-data` 320 ms** chỉ là 1 mẫu (mốc 387 ms). Như ghi ở mốc lượt 2, số này phụ thuộc trạng thái profile WebView2; 3 lần mở lại ở bảng trên ra 317 ms.
- **Mở lại** tính từ lúc gọi exe, như mở lần đầu, nên gồm cả lúc khởi động tiến trình và tạo cửa sổ. Ngưỡng ≤ 1 s là ngưỡng "Mở app lại" của bảng "Thời gian thao tác" (Owner bấm giờ ở `b139d8a`).
- **Dọn sạch** xóa hẳn 113 dòng Thùng rác của dữ liệu tải: 15 KH (kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI) · 76 lịch hẹn · 18 HĐ · 3 nhân sự · 1 team. Thêm một file backup mới; `project2c.db` 14 102 528 → 13 438 976 byte; Nội dung ở Cài đặt → Dữ liệu trước / sau không đổi.

Kích thước (`node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` sau `pnpm build:exe`, cùng máy):

| Mục | `b139d8a` (mốc) | Lượt 4 `2e51e25` | **G7 `233c77e`** |
|---|---:|---:|---:|
| `project2c.exe` (byte) | 5 414 400 | 5 649 408 | 5 649 408 |
| Bundle JS / CSS, thô (byte) | 2 364 283 | 2 358 427 | 2 366 449 |
| — `assets/index.js` | 891 942 | 884 698 | 892 177 |
| — `assets/index.css` | 28 364 | 29 752 | 30 295 |
| Tệp khác: wasm, font, ảnh… (byte) | 849 196 | 1 022 121 | 1 022 121 |
| Dòng code sản phẩm / test | 32 216 / 37 991 | 37 766 / 52 911 | 39 055 / 55 734 |

- **So lượt 4:** exe và tệp khác giữ nguyên cỡ. Bundle JS / CSS +8 022 B (`index.js` +7 479, `index.css` +543), sản phẩm +1 289 dòng, test +2 823 dòng: đợt sửa lượt 4 (T-319…T-328), đợt sửa sổ OPEN (T-329…T-342) và phần sửa probe (T-345…T-347, chỉ test). Không file CSS nào đổi: `index.css` tăng vì lớp Tailwind mới của các phần sửa giao diện (vd. tên dài xuống dòng, T-325, T-331).
- **So `b139d8a`:** exe +235 008 B là phần tăng của lượt 4 (+240 640 so lượt 3, trong đó `icon.ico` +71 343) trừ 5 632 B exe lượt 3 nhỏ hơn `b139d8a`; tệp khác +172 925 B là font Playfair, ba ảnh logo, favicon PNG. Cả hai đã ghi ở mục "Số đo deep review lượt 4".

### Số đo deep review lượt 5 (T-362, 04–05/11/2026)

Không thay mốc sau #656: G7 vẫn so với mốc đó. Phân tích: tổng hợp lượt 5 §7; bảng đủ: `docs/reviews/raw/2026-11-05/common-baseline.md`.

- **Máy:** Home PC `DESKTOP-KDURKJP`. **Code:** `37a80b6` (code trùng exe ứng viên L3 `3d237b0`), exe release build tại máy 5 649 408 byte (bằng lượt 4 và G7).
- **Dữ liệu tải:** sinh ở `37a80b6`, `tables` sha256 `e256e4f1…` = G7. So `2e51e25` chỉ khác `ai_analyses.prompt_version` (`@4` → `@5`, #913).
- **Cách đo:** script của G7, một lượt liền, như mục "Số đo G7, NT-HN-01": mở lần đầu 3 lần, nhập dữ liệu tải, mở lại 3 lần, probe (`PERF_RUNS=5`, kỳ Năm 2026, kỳ Tháng 10/2026), Dọn sạch một lần.
- **So mốc sau #656, so G7 và so lượt 4: không dòng nào ⚠️**, mọi thao tác trong ngưỡng:
  - `app.open-data` 330 ms; `reload.*` 285–407 ms; `trash.open` 33 ms; các thao tác màn còn lại 2–24 ms;
  - `backup.read` / `backup.import` / `backup.export` 983 / 50 / 438 ms; `db.save` 150 ms; JS heap 16,7 MB;
  - `appointments.next-month` / `next-year` 111 / 108 ms;
  - mở lần đầu (LCP) 3 535 ms (mốc 3 663, G7 3 420); mở lại (LCP) 710 ms (G7 617; luật nhiễu > 740).
- **Lần lưu DB đầu của lần mở đầu** 150 ms (mốc 119, G7 123): quá luật nhiễu ở mốc phụ này. Đo xen kẽ exe lượt 4 ↔ exe `37a80b6` cùng lúc: 188,5 / 185,1 ms. Chênh là do máy / thư mục lúc đo, không do code; đường lưu không đổi từ G7.
- **Dọn sạch Thùng rác:** bấm "Backup rồi dọn sạch" → thông báo 11j 128,0 ms (≤ 500 ms; lượt 4: 123,3; G7: 130,5); `trash.open` trước → sau 30,1 → 2,0 ms; Node `purgeTrash` cả `VACUUM` 88,5 / 117,5 ms (113 / 1 313 dòng).
- **Bundle:** JS / CSS 2 366 456 B (+8 029 so lượt 4, +7 so G7); `index.js` 892 184 B, trong đó `packages/ai` +5 607 B (Mock trích xuất, G5 `@5`); `index.css` 30 295 B (+543); tệp khác 1 022 121 B (=). Mọi chunk dependency trùng từng byte lượt 4.
- **`byName` (DR6-136 đã sửa):** sắp 10 255 lịch hẹn theo KH trong Node 11,2–12,2 ms (lượt 4: 65,2; trước #828: 9,4).
- **Phát hiện P:** chỉ DR6-165. Mock trích xuất sau T-330 / T-336 chậm hơn `2e51e25` quá luật nhiễu, dưới ngưỡng < 200 ms: lần gọi đầu của tiến trình 9,2 → 28,5 ms; cả bộ 3 551 ghi chú thật 62,2 → 103,5 ms; lần bấm AI trích xuất đầu trên màn 31 → 53 ms.

#### Mốc Mock trích xuất (DR6-165, T-370)

Owner 05/11 chọn Q2 (a) của tổng hợp lượt 5: chấp nhận chi phí, không đổi code. Lần bấm AI trích xuất đầu của mỗi phiên app thêm ≈ 20 ms trên thao tác ≈ 30–50 ms; các lần sau ≈ +0,01 ms. Mock chỉ cho demo, e2e và máy chưa có key.

Ba số dưới là **mốc so cho lần đo sau**: xấu hơn khi quá luật nhiễu so với mốc này (quá 20 % **và** quá 10 ms). Ngưỡng thao tác màn < 200 ms giữ nguyên.

| Thao tác | Mốc (`37a80b6`) | `2e51e25` | Ngưỡng |
|---|---|---|---|
| Lần gọi đầu của tiến trình: ghi chú RE dài nhất của dữ liệu tải (173 ký tự), mỗi lần một tiến trình mới, 9 tiến trình mỗi bản, xen kẽ | 28,5 ms | 9,2 ms | < 200 ms ✅ |
| Cả bộ 3 551 ghi chú RE của dữ liệu tải (cộng seed 3 ngày neo), cùng tiến trình, 7 vòng xen kẽ | 103,5 ms (≈ 0,03 ms / ghi chú) | 62,2 ms | < 200 ms mỗi ghi chú ✅ |
| Lần bấm AI trích xuất đầu trên màn (Edge, bản dựng web, ghi chú 4 503 ký tự) | 53 ms | 31 ms (lượt 4, cùng máy) | < 200 ms ✅ |

- **Máy:** Home PC `DESKTOP-KDURKJP`, Node v24.20.0. **Nguồn:** `docs/reviews/raw/2026-11-05/claude/C.md` §6.2 (CLR5-C2).
- **Số tuyệt đối đổi giữa các lần chạy** (cả bộ, cùng code `packages/ai`: 103,5 ms ở lượt 5, 73,7 ms ở thân PR #1066 cùng máy). Hai dòng Node nên đo bản mới xen kẽ với `37a80b6` trong cùng lần chạy, rồi áp luật nhiễu lên cặp đó (như tổng hợp lượt 5 §7.2).
- **Sau mốc:** T-365 (#1066) sửa Mock ("nhỏ bé" của con đã mất, gạch "–"). Thân PR đo xen kẽ trước / sau, trong luật nhiễu: lần gọi đầu 28,47 → 28,49 ms, cả bộ 73,69 → 75,10 ms.

### Số đo deep review lượt 6 (T-389, 07/11/2026)

Không thay mốc sau #656. Phân tích: tổng hợp lượt 6 §7; bảng đủ: `docs/reviews/raw/2026-11-08/common-baseline.md`.

- **Máy:** Home PC `DESKTOP-KDURKJP`. **Code:** `5b1328a` (SHA ghim lượt 6, đóng băng K49), exe release build tại máy 5 649 408 byte (bằng lượt 5, lượt 4, G7).
- **Dữ liệu tải:** sinh ở `5b1328a`, `tables` sha256 = lượt 5 / G7.
- **So mốc sau #656, so G7 và so lượt 5: không dòng nào ⚠️**, mọi thao tác trong ngưỡng:
  - `app.open-data` 364 ms; `reload.*` 281–406 ms; các thao tác màn còn lại 4–33 ms;
  - `backup.read` / `backup.import` / `backup.export` 979 / 44 / 427 ms; `db.save` 147 ms; JS heap 16,8 MB;
  - `appointments.next-month` / `next-year` 109 / 107 ms;
  - mở lần đầu (LCP) 3 612 ms (mốc 3 663, G7 3 420, lượt 5 3 535); mở lại (LCP) 688 ms (G7 617; luật nhiễu > 740).
- **Dọn sạch Thùng rác:** bấm → thông báo 11j 120,5 ms (≤ 500 ms; lượt 5: 128,0).
- **Bundle:** JS / CSS 2 369 229 B (+2 773 so lượt 5, +0,12 %); `index.js` 894 865 B, ≈ 2 / 3 phần tăng là tên nút / dòng lý do của Thùng rác (họ DR6-160); `index.css` 30 387 B (+92); tệp khác 1 022 121 B (=). Mọi chunk dependency trùng từng byte lượt 5.
- **Hàm thuần trong Node** (A/B xen kẽ với `37a80b6`): `searchText` (T-377) làm mỗi phím ở ô KH của 6b và ô tìm của Thùng rác chậm ≈ 1,7×, ≤ 12,8 ms ở ca xấu nhất; DR6-165 trên màn trung vị 49 ms (mốc 53). Không dòng nào > 20 % và > 10 ms.
- **Phát hiện P:** không.

## Kiểm tra trên `main`

_Điền cuối phase._

## Kích thước PR vượt ngưỡng

Tới 03/11/2026 (T-342): 324 PR merge vào `main` sau PR đóng Phase 5 (#514), từ #515 tới #974; 112 PR trong đó có code hoặc test. T-307 đếm tới 27/10 (#515 tới #858: 241 PR, 87 có code hoặc test); T-342 đếm tiếp #859 tới #974 (83 PR, 25 có code hoặc test). PR merge sau #974 ghi thêm ở PR chốt số đo cuối G7. Lệnh đếm và lệnh rà: thân PR của T-307 (#859), trừ một chỗ khi ghi thêm PR. `count.mjs` ở đó đọc phía cũ của file (vùng `#[cfg(test)]`, khối codemap) ở `git merge-base origin/main <head>`; với PR xếp chồng merge bằng `--merge` (#709, #845), lệnh này trả về chính head. Phía cũ lấy theo `base.sha` của PR (`gh api repos/AlexH-AI/Project-2C/pulls/<n> --jq .base.sha`): đọc ở `git merge-base <base.sha> <head>`, đúng cả với PR xếp chồng merge bằng `--merge`. Đếm lại #709, #845 theo `base.sha` ra cùng số ở bảng. Phần đếm tiếp của T-342: lệnh và output ở thân PR #975, phía cũ đã đọc theo `base.sha`.

Ngưỡng ADR-0001 phụ lục: ≤ ~400 dòng code sản phẩm (SP), ≤ ~800 dòng tổng diff. Luật đếm:

- **Nguồn:** `additions` / `deletions` của từng file theo `gh api repos/AlexH-AI/Project-2C/pulls/<n>/files --paginate`. SP và tổng đều cộng dòng thêm với dòng xóa, như sổ đã làm với #801, #833.
- **Phân loại** theo `classifyFile` của `tools/size-report-core.mjs` (spec §6.2). Test: `*.test.*`, `*.spec.*`, `e2e/**`, `test-support.ts`, `fixtures/**`, golden, `playwright*.config.ts` và `vitest.config.ts` ở gốc repo, và phần từ dòng `#[cfg(test)]` trở đi của file Rust. Code còn lại là SP, kể cả `tools/*.mjs` (như #474 ở `phase-5.md`) và migration tự viết (mở đầu `-- Custom SQL migration file`). File mà `classifyFile` không đếm (tài liệu, `.json`, `.toml`) chỉ cộng vào tổng.
- **Không tính** (ADR-0001 phụ lục): lockfile; SQL, snapshot và journal do drizzle-kit sinh; bảng dữ liệu tĩnh của seed (`packages/db/src/seed-data.ts`); khối codemap trong `CLAUDE.md` của các package; `src-tauri/icons/*`.
- **Không xét** PR không đổi dòng code hay test nào. Sáu PR loại này vượt 800 dòng: kết quả eval #518, báo cáo gốc #609, #651, #718, kế hoạch lượt 4 #863, báo cáo gốc lượt 4 #894.
- **Bảng phụ "ở biên":** PR vượt không quá 6 % (SP 401–424, tổng 801–848) và không vượt ngưỡng kia quá 6 %. Vượt quá 6 % ở một ngưỡng thì vào bảng chính.

| PR | Task | Code sản phẩm | Tổng diff | Lý do nêu trong PR |
|---|---|---|---|---|
| #526 | T-201 | 582 (+260 / −322) | 762 (test 172) | không nêu |
| #539 | T-208 | 497 (+442 / −55) | 958 (test 461) | có: hàm kiểm chung và `listTrash` phải đi cùng nhau thì test trùng lỗi mới có nghĩa |
| #543 | T-210 | 433 (+427 / −6) | 915 (test 482) | có: Issue đã là nửa của B4; phần dôi là chuỗi `vi.ts` và fixture test bị Prettier ngắt dòng |
| #545 | T-211 | 457 (+443 / −14) | 828 (test 371) | có: hộp khôi phục cho đủ 5 loại |
| #572 | T-218 | 9 (+8 / −1) | 925 (test 829: probe, `stats.ts`) | có: probe là một luồng chạy liền |
| #669 | T-250 | 298 (+178 / −120) | 946 (test 641) | có: 6 mục test chấp nhận, 4 mục là e2e dựng dữ liệu qua màn |
| #709 | T-258 PR 1/2 | 287 (+281 / −6; gồm migration 0011 tự viết, 28) | 860 (test 573) | có: test D1–D11 dựng Thùng rác đủ năm loại; đây là đường mất dữ liệu duy nhất của app |
| #710 | T-258 PR 2/2 | 477 (+405 / −72) | 1 081 (test 533) | có: hàng đợi, hộp 11i, thông báo 11j và màn đi cùng nhau; task đã tách hai PR |
| #801 | T-286 | 432 (+205 / −227) | 785 (test 353) | có: mỗi lời gọi đổi tên tính một dòng − và một dòng +; Prettier bẻ import dài |
| #805 | T-287 | 418 (+282 / −136) | 930 (test 510) | có: 8 mục và 18 ghi chú sổ trong một Issue |
| #812 | T-288 | 666 (+376 / −290) | 900 (test 220) | có: ≈ 130 dòng dời nguyên văn tính hai lần; 8 mục của Issue cùng 5 ghi chú Mock của review #809 |
| #828 | T-291 | 549 (+405 / −144) | 1 294 (test 733) | có: Issue gom 12 mục; G5 §13.5 kê nhiều ca nhập |
| #833 | T-296 | 527 (+337 / −190) | 878 (test 342) | có: Issue gom 11 mục sổ của 5 review; 190 dòng xóa là hai khung hộp gõ chữ gom về một chỗ |
| #835 | T-297 | 753 (+567 / −186) | 1 578 (test 796) | có: Issue gom 19 mục sổ, thêm hàm đọc `db` Owner duyệt trong phiên |
| #845 | T-301 PR 1/2 | 791 (+385 / −406) | 1 103 (test 312) | có: ≈ 30 màn đổi dòng import, `PLAIN_SLOTS` dời sang test, 17 cột báo cáo viết lại; Owner đã tách task thành hai PR |
| #917 | T-322 | 465 (+387 / −78) | 938 (test 465) | có: phần vượt chủ yếu là test của các mục review và 29 ca Owner đồng ý viết lại; Owner chấp nhận cỡ (31/10) |
| #937 | T-329 | 1 451 (+735 / −716) | 3 428 (test 1 977) | có: tách Mock trích xuất sang file mới, không đổi hành vi; so cả PR thì ≈ 720 dòng dời nguyên văn tính hai lần, `mock-adapter.ts` còn lại nên git không ghép đổi tên; theo từng commit với `-M`: +323 / −288 |
| #939 | T-330 | 441 (+328 / −113) | 690 (test 232) | có: SP quá ~400 một chút, trong khoảng ~400–550 Issue ước lượng |
| #944 | T-335 | 394 (+389 / −5) | 1 297 (test 503) | có: Owner chấp nhận cỡ ngày 01/11, lúc PR còn 1 078 dòng; ngoài code công cụ (trong ngưỡng) và test là skill 334, tài liệu 66 |

Ở biên:

| PR | Task | Code sản phẩm | Tổng diff | Lý do nêu trong PR |
|---|---|---|---|---|
| #566 | T-216 | 287 (+272 / −15) | 833 (test 546) | có: thụt lề `describe.each`, bỏ thụt lề còn ≈ 560 |
| #568 | T-217 | 406 (+406 / −0) | 705 (test 299) | có: SP sát ~400, tính cả comment và dòng trống |
| #616 | T-232 | 423 (+364 / −59) | 768 (test 323) | không nêu |
| #817 | T-294 | 298 (+210 / −88) | 820 (test 473) | có: Issue gộp 6 mục sổ và ba quyết định Owner trong phiên |

- **Số trong bảng thay số của sổ và thân PR**, vì đếm theo cùng một luật: SP cộng cả dòng xóa (sổ ghi #539, #543, #545 theo dòng thêm); khối codemap bỏ, chữ viết tay của `CLAUDE.md` vẫn tính (#828: 1 294, sổ ghi 1 292); `seed-data.ts` không tính (#526: SP 582, không phải 621). #566 (tổng 833) và #817 (820) sổ ghi là vượt, nhưng chỉ vượt tổng ≤ 6 % nên ở bảng phụ.
- **23 / 112 PR có code vượt ngưỡng**, 19 ở bảng chính.
  - Tới #858: 19 / 87, 15 ở bảng chính. 8 PR là của đợt sửa sổ OPEN trước v1.0 (T-283…T-304), nơi mỗi Issue gom nhiều mục sổ; 5 PR của Thùng rác (T-208, T-210, T-211, hai PR của T-258). Hai PR không nêu lý do: #526, và #616 ở biên.
  - Từ #859 tới #974: 4 / 25, cả bốn ở bảng chính, không PR nào ở biên. Ba PR của Mock trích xuất `packages/ai` (#917 của đợt sửa lượt 4, #937 và #939 của đợt sửa sổ OPEN ở G7), một PR của pipeline `auto-issues` (#944). Cả bốn nêu lý do.

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
  - Owner chọn Phương án 3 (sửa hết): 12 Issue #652–#663. Lúc đó Owner quyết không có lượt 3; 19/10 đổi, thêm lượt 3 trước G7 (ADR-0001 M9).
- **Lượt 3 (20–21/10, `119e2e4`):**
  - Reviewer: Claude, Codex; một đợt trên Home PC. Phía Claude mỗi gói một phiên sạch như lượt 2 (Owner đổi 20/10, thay Workflow).
  - Tổng hợp: `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md`.
  - Kết quả đợt sửa lượt 2, 39 DR6: 38 đã sửa, 1 sửa một phần (DR6-69), 0 hồi quy.
  - 54 phát hiện mới → **31** vấn đề DR6-104…134: **0 Medium**, 21 Low, 10 Nit; thêm 3 mục KNOWN có bằng chứng mới. 0 bị bác.
  - Kết luận: chưa sẵn sàng ở `119e2e4`, chỉ vì Owner đã quyết sửa hết trước G7.
  - Owner 21/10 đồng ý cả 6 đề xuất của §9: 11 Issue #719–#729.
- **Đợt sửa lượt 3 (21–23/10):** 11 Issue #719–#729 (T-268…T-278) cho DR6-104…134, cùng #735 (T-280, thanh trên cùng che phần tử nhận focus: mục KNOWN của lượt 3, Owner 21/10 cho làm trước G7) và #752 (T-281: ca review #750 thấy phần sửa DR6-120 còn sót). Đóng hết 23/10.
- **Đợt sửa sổ OPEN trước v1.0 (23–26/10):** Owner 23/10 quyết sửa hết sổ ghi chú review trước v1.0 (#771): 22 Issue T-283…T-304 (#772–#790, #793, #797, #831). Đóng hết 26/10 (PR cuối #846).
- **Đợt sửa mục OPEN trước lượt 4 (28/10):** T-310…T-317 (#865–#868, #876, #880, #884, #889). Sổ OPEN rỗng từ #892 (điều kiện B2).
- **Lượt 4 (29–30/10, `2e51e25`):**
  - Reviewer: Claude, Codex (đợt 1, 29/10) và DeepSeek V4.1 Flash trong app WorkBuddy (đợt 2, 30/10), trên Home PC (ADR-0001 M10). Kế hoạch: T-309 #854.
  - Tổng hợp: `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md`.
  - Kiểm phần đã sửa của các đợt sửa từ sau lượt 3: bảng R1 37 dòng, 36 đã sửa, 1 sửa một phần (DR6-37), 0 hồi quy; bảng R2 32 Issue, đều đã sửa.
  - 34 phát hiện mới → **23** vấn đề DR6-135…157: **0 Medium**, 17 Low, 6 Nit; thêm 1 mục KNOWN có bằng chứng mới. 0 bị bác.
  - Kết luận: chưa sẵn sàng ở `2e51e25`, vì Owner đã quyết sửa hết trước G7 và DR6-37 còn một phần.
  - Owner 31/10 đồng ý cả 4 đề xuất của §9: 10 Issue #896–#905 (T-319…T-328).
- **Đợt sửa lượt 4, mục sổ [G7] và G7 (31/10–04/11):** T-319…T-356, bảng ở kế hoạch §L5.2. Code cuối ở `3d237b0` (T-350); sau đó chỉ tài liệu.
- **Lượt 5 (04–05/11, `37a80b6`):**
  - Reviewer: Claude Opus 5.5, Codex GPT Sol 6.1 (đợt 1, 04–05/11) và DeepSeek V4.1 Flash trong app WorkBuddy (đợt 2, 05/11), trên Home PC (ADR-0001 M12). Kế hoạch: T-357 #1025.
  - Tổng hợp: `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md`.
  - Kiểm phần đã sửa của ba đợt trên: bảng R1 25 dòng, 24 đã sửa, 1 sửa một phần (DR6-145), 0 hồi quy; bảng R2 28 Issue, đều đã sửa.
  - 41 phát hiện mới → **20** vấn đề DR6-158…177: **0 Medium**, 13 Low, 7 Nit. 1 bị bác.
  - Kết luận: chưa sẵn sàng ở `37a80b6`, vì Owner đã quyết sửa hết trước G7 (K47) và DR6-145 còn một phần.
  - Owner 05/11 đồng ý cả 4 đề xuất của §9: 8 Issue #1045–#1052 (T-363…T-370).
- **Đợt sửa lượt 5 và mục sổ G7 (05–06/11):** T-363…T-384, bảng ở kế hoạch §L6.2. Rồi T-386…T-388 (cách làm lượt 6).
- **Lượt 6 (07–08/11, `5b1328a`), lượt toàn bộ code cuối trước G7:**
  - Reviewer: Claude Opus 5.5 (9 phiên: gói A–F, chủ đề G rà gọn, H chữ người dùng, I bất đồng bộ), Codex GPT Sol 6.1 (đợt 1, 07/11) và agent WorkBuddy (đợt 2, 07–08/11; theo log: gói A Hy4, B–F DeepSeek V4.1 Flash), trên Home PC (ADR-0001 M13). Kế hoạch: T-385 #1117. Tiêu chí xong chốt trước (K48), đóng băng code (K49).
  - Tổng hợp: `docs/reviews/2026-11-08-deep-review-phase-1-6-luot-6-tong-hop.md` (T-389 #1131).
  - Bảng R1 20 dòng, R2 14 Issue: đều đã sửa, 0 hồi quy.
  - 103 phát hiện mới → **35** vấn đề DR6-178…212: **0 Medium**; **5 chặn phát hành** theo K48 (4 Low trục D, 1 Low trục G); 30 không chặn (25 Low, 5 Nit) → sổ [sau v1.0]. 0 bị bác.
  - Kết luận: chưa sẵn sàng ở `5b1328a` vì còn 5 vấn đề chặn; sau đợt sửa thì G7, không cần review lại vùng (không có Medium).
  - Owner 08/11 đồng ý cả 7 đề xuất của §9: 5 Issue #1134–#1138 (T-390…T-394). Cùng ngày đổi Q7: giảm dòng code của DR6-211 làm trước G7 (ngoại lệ K49): 3 Issue #1140–#1142 (T-395…T-397); CLR6-G4 vẫn [sau v1.0].

## Điều hướng (riêng 2C, `docs/metrics/README.md`)

_Điền cuối phase._

## Đánh giá cuối dự án

_Điền ở G7 (thay `FINAL.md`)._

## Việc hoãn sau v1.0

_Điền cuối phase._

## Ghi chú

_Điền cuối phase._
