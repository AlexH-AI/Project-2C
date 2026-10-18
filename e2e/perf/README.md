# Probe hiệu năng trên exe release (spec Phase 6 §5.2)

Đo các thao tác của spec Phase 6 §5.2 trên **exe release** đã nạp **dữ liệu tải** (§5.1), qua cổng debug WebView2. Chạy tay, không chạy trong CI, không nằm trong `pnpm e2e` (file `*.perf.ts`, cấu hình riêng `playwright.perf.config.ts`). Phần thuần (`stats.ts`: trung vị / min / max, bảng, so hai lần đo, kiểm dữ liệu tải) có unit test `stats.spec.ts`, chạy trong `pnpm e2e`.

## Các bước

1. **Dữ liệu tải** (một lần mỗi máy, ≈ 15 MB, không commit):

   ```powershell
   node tools/load-data.mjs
   ```

   Ghi `.local/load-data/load-2026-10-12-seed6.p2cbackup`. Dùng `--anchor` / `--seed` khác thì đặt `PERF_BACKUP` tới file đó ở bước 4.

2. **Build exe release và mở với cổng debug.** Exe portable giữ dữ liệu ở `Project2C-data\` cạnh nó: chép exe ra một thư mục riêng để không đụng dữ liệu đang dùng.

   ```powershell
   pnpm build:exe
   New-Item -ItemType Directory -Force C:\perf-exe
   Copy-Item apps\desktop\src-tauri\target\release\project2c.exe C:\perf-exe\
   $env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = '--remote-debugging-port=9222'
   Start-Process C:\perf-exe\project2c.exe
   ```

   Biến môi trường chỉ có tác dụng với exe mở **từ chính cửa sổ PowerShell đó**. Kiểm: `http://127.0.0.1:9222/json/list` có một trang `http://tauri.localhost/…`. Probe báo "No WebView2 debug port" khi exe chưa chạy, hoặc chạy mà không có biến này. Cổng khác 9222 → đặt `PERF_CDP` (vd. `http://127.0.0.1:9333`).

3. **Nạp dữ liệu tải** trong exe: Cài đặt → Dữ liệu → Nhập backup → chọn file của bước 1 → Backup rồi thay dữ liệu. Probe kiểm dòng "Nội dung" ở Cài đặt → Dữ liệu (ít nhất 1 400 KH và 9 000 lịch hẹn; seed demo có 1 200 KH) và dừng, báo số đang có, nếu không phải dữ liệu tải.

4. **Chạy probe**, để cửa sổ exe **ở trên cùng, không thu nhỏ, không bị che**: WebView2 ngừng vẽ khung hình khi cửa sổ bị che, probe khi đó báo "no frame painted". Không dùng máy trong lúc đo (≈ 3–5 phút với 5 lần).

   ```powershell
   pnpm exec playwright test -c playwright.perf.config.ts
   ```

   | Biến | Mặc định | Việc |
   |---|---|---|
   | `PERF_RUNS` | `5` | Số lần mỗi thao tác |
   | `PERF_BACKUP` | `.local/load-data/load-2026-10-12-seed6.p2cbackup` | File dữ liệu tải exe đã nhập (probe nhập lại file này, và chọn KH có lịch sử phân tích AI từ đó) |
   | `PERF_OUT` | `.local/perf/perf-<thời điểm>.json` | File JSON kết quả |
   | `PERF_BASE` | — | File JSON của lần đo trước: bảng thêm cột Nền và Δ |
   | `PERF_NOTE` | — | Ghi chú vào JSON (máy, SHA của exe) |
   | `PERF_CDP` | `http://127.0.0.1:9222` | Cổng debug WebView2 |

Probe **thay dữ liệu** của exe: mỗi lần đo bắt đầu bằng Nhập backup lại file dữ liệu tải (có đo), nên mỗi lần đo trên dữ liệu như vừa sinh; cuối lần đo, lệnh ghi thêm vài lịch hẹn hôm nay. Mỗi lần nhập, app tự backup dữ liệu cũ vào `Project2C-data\backups\` (giữ 10 bản).

## Đo gì, đo thế nào

Thời gian tính **từ thao tác tới khung hình kế tiếp sau khi màn hiện kết quả** (như số đo Phase 4, `docs/metrics/phase-4.md` mục "Đo đầu-cuối"): đo trong trang bằng `performance.now()`, chờ `requestAnimationFrame` rồi một `setTimeout` để khung hình đã vẽ. Tên thao tác cố định, là khóa khi so hai lần đo — không đổi tên.

| Thao tác | Tên |
|---|---|
| Mở app: từ lúc trang bắt đầu tới khi mở xong dữ liệu (mốc `p2c:data-open`); chỉ có khi probe nối vào exe vừa mở, chưa tải lại | `app.open-data` |
| Màn đầu sau tải lại, từng màn ở sidebar | `reload.overview`, `reload.appointments`, `reload.customers`, `reload.reports`, `reload.team`, `reload.settings` |
| Lịch hẹn: đổi kỳ Ngày / Tuần / Tháng / Năm | `appointments.period-day` … `-year` |
| Lịch hẹn kỳ Năm: sắp cột Ngày (tăng, giảm), chọn một dòng | `appointments.sort-date-asc`, `-desc`, `appointments.select-row-year` |
| Lịch hẹn kỳ Tháng: bấm một ngày, chọn một lịch trong ngày | `appointments.select-day-month`, `appointments.select-row-month` |
| Khách hàng: sang Bảng, sắp Họ tên | `customers.view-table`, `customers.sort-name` |
| Hồ sơ KH có panel AI; bấm một lần trong Lịch sử phân tích | `customer.open-ai`, `customer.ai-history` |
| Tổng quan / Báo cáo: bấm Lọc ở kỳ Năm và Tháng; Báo cáo Theo RE | `overview.filter-year`, `-month`, `reports.filter-year`, `-month`, `reports.table-re` |
| Thùng rác: mở (đo khi đã ngắt debugger), lọc Lịch hẹn | `trash.open`, `trash.kind-appointments` |
| Bộ nhớ JS heap của webview sau khi đi hết các màn (sau GC; không gồm bộ nhớ WebAssembly của sql.js, nơi giữ DB) | `memory.js-heap` (MB) |
| Nhập backup: từ lúc chọn file tới hộp xác nhận; bấm xác nhận tới khi báo đã nhập | `backup.read`, `backup.import` |
| Xuất Excel, Xuất backup (ghi vào `Project2C-data\exports\`, không có hộp chọn file) | `reports.export-excel`, `backup.export` |
| Tạo lịch hẹn tiếp theo từ lịch đã gặp, chọn ở kỳ Tháng / Năm | `appointments.next-month`, `appointments.next-year` |
| Lưu file DB (mốc `p2c:db-save`) sau mỗi lần nhập backup và tạo lịch hẹn | `db.save` |

Ngưỡng: thao tác màn (đổi kỳ, sắp, chọn, Lọc, mở hồ sơ, Thùng rác) **< 200 ms** theo trung vị — Nhóm C của deep review Phase 1–4 (`docs/process/deep-review-phase-1-4.md` §8, spec Phase 6 §5.2). Ngưỡng cho màn Phase 5 / 6 và cho phần còn lại đặt sau số đo nền (T-219).

**Debugger làm chậm lệnh ghi qua IPC** (bài học Phase 4): khi probe nối CDP, mỗi lần lưu file DB (≈ 13 MB) qua IPC chậm hẳn. Vì vậy Nhập backup (bước xác nhận), Xuất Excel, Xuất backup và Tạo lịch hẹn tiếp theo chạy **khi đã ngắt debugger**: probe đánh dấu nút, hẹn trong trang bấm sau 1 s, ngắt CDP, chờ, nối lại rồi đọc thời gian trang đã ghi. Các thao tác khác đo khi đang nối (chỉ đọc, không qua IPC), trừ `trash.open` ở đoạn dưới.

**DevTools cũng làm chậm thao tác chạy nhiều câu SQL** (deep review Phase 1–6 lượt 2, DR6-98). Đo trên exe, mở Thùng rác khi gắn DevTools chậm ×2,4–3,3 so với khi đã ngắt, lệch tăng theo số dòng Thùng rác. Vì vậy `trash.open` cũng đo khi đã ngắt, như lệnh ghi (từ T-256; số `trash.open` đo trước đó là số khi gắn, nên cao hơn). Probe đo nó sau `memory.js-heap`, vì mỗi lần nối lại để lại script của Playwright trong heap (≈ 0,5 MB) tới lần tải lại kế. Thao tác màn không chạy câu SQL mới chỉ lệch ±1 ms; mở dữ liệu khi tải lại màn (`reload.*`) chậm hơn ≈ 7 % khi gắn.

**Đo tay:**

- Mở app tính cả lúc khởi động tiến trình và tạo cửa sổ (trước khi trang bắt đầu, `app.open-data` không tính): bấm giờ từ lúc nhấp đúp exe tới khi màn đầu có số liệu, 3 lần, lấy trung vị. **Lần đầu** = thư mục `Project2C-data\` chưa có (app sinh seed demo); **mở lại** = đã có dữ liệu tải. Nối probe ngay sau khi mở để có thêm `app.open-data`.
- Không có thao tác nào cần hộp chọn file native: nhập backup dùng ô chọn file của webview (probe đặt file qua CDP), xuất ghi thẳng vào `exports\`.

## Đọc kết quả

Cuối lần chạy, probe in bảng Markdown (thao tác, số lần, trung vị, min, max, ngưỡng ✅ / ❌) và đường dẫn file JSON. Với `PERF_BASE`, bảng thêm Nền (trung vị lần trước) và Δ; ⚠️ đánh dấu xấu hơn nền quá nhiễu (hơn 20 % **và** hơn 10 ms, bộ nhớ hơn 5 MB). Dán bảng vào PR / `docs/metrics/phase-6.md`; giữ file JSON để lượt sau so (T-219, spec §6.3).

Khi đo lại để so: cùng máy, cùng file dữ liệu tải, cùng `PERF_RUNS`, exe build release, cửa sổ cùng cỡ.
