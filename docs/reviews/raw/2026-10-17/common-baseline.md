# Baseline — deep review Phase 1–6, lượt 2

- **Máy:** Home PC **`DESKTOP-KDURKJP`** (`hostname`), 17–18/10/2026. Bước chuẩn bị, cả hai bên (Claude, Codex) và mọi số đo của lượt 2 chạy trên máy này; số đo chỉ so với mốc **cùng máy** (plan §L2.6): `perf-ref` lượt 1 Home PC (`common\perf\perf-ref-r1.json`), T-227 cho mở lần đầu, cột Home PC của tổng hợp lượt 1 §7.1, và ngưỡng `docs/metrics/phase-6.md`. **Không so nền T-219** (đo ở Office Laptop).
- **SHA ghim:** `4217ed4` (`4217ed4cd3300af1d63aa61db9eb13902fe75f16`).
- **`main` lúc chuẩn bị:** `d33dda9` (#648). `git diff --name-only 4217ed4 origin/main` chỉ có `CLAUDE.md` gốc và `docs/**` (`PROJECT-STATE.md`, ADR-0001, `decisions/README.md`, `design/phase-6-hoan-thien.md`, `process/deep-review-phase-1-6.md`, `state/review-notes.md`) → SHA ghim giữ nguyên (plan §L2.2).
- **Worktree review:** `C:\workspace\Project-2C-review` và `C:\workspace\Project-2C-review-2` đều `checkout --detach 4217ed4`, đã xóa `apps\desktop\dist` trước khi chạy cổng, `pnpm install --frozen-lockfile`. `git status --short`: `Project-2C-review` rỗng; `Project-2C-review-2`: `?? .agents/`, `?? .codex/`, `?? AGENTS.md` (Codex tự sinh, để nguyên — plan §8). Bundle dưới đây dựng ở `Project-2C-review`, không biến môi trường riêng; `apps\desktop\dist` của `-review-2` chưa dựng.
- **File chung:** `plan.md` (bản ở `main` `d33dda9`), `known.md`, `fixes.md` (thân 17 Issue + 21 PR sửa), `prompt-claude.md`, `prompt-codex.md` (Phụ lục E / F + một dòng ghi `<bên>` / `<ID>` + nguyên văn Phụ lục H).
- Log đầy đủ của từng cổng: `common\gates\*.log`; tóm tắt `gates\summary.txt`.

## Cổng ở SHA ghim (`Project-2C-review`)

| Cổng | Kết quả | Thời gian |
|---|---|---|
| `pnpm verify` | ✅ 113 file test, 2 898 test; `lint:deps`: no dependency violations (315 module, 1 277 dependency) | 136 s |
| `pnpm verify:rust` | ✅ fmt + clippy `-D warnings` sạch; 101 test Rust | 25 s |
| `pnpm e2e` (`CI=1`) | ✅ 227 passed | 116 s |
| `pnpm build:exe` | ✅ `project2c.exe` release **5 404 672 byte** (Δ −9 728 so `b139d8a`), sha256 `E2C421FD63B77766C11CD6D4B6DA9F8CD52A4D8A48F468690ECB23ADCD964504` → `common\exe\project2c.exe`. Lần đầu chạy kèm `CI=1` nên Tauri báo `invalid value '1' for '--ci'`; chạy lại không đặt `CI` thì xanh | 104 s (cargo `release` 1 m 37 s) |
| `pnpm test:coverage` | ✅ Stmts 99.03 % · Branch 96.99 % · Funcs 98.93 % · Lines 99.28 % (lượt 1: 98.99 / 97.03 / 98.94 / 99.24) | 90 s |

**Thời gian build release (DR6-13, plan §L2.4):** trên Home PC chỉ ghi lại, không so (lượt 1 chưa có số build Home PC). `cargo` biên dịch lại crate của dự án và một phần dependency (thư mục `target` còn bản build của lượt 1 ở `8855345`), `Finished release in 1m 37s`; cả `pnpm build:exe` 104 s (lượt 1 Home PC: 133 s, cache khác nên không phải phép so). Kiểm DR6-13 trên Home PC bằng `Cargo.toml` và cỡ `target` (plan §L2.4).

### Bundle web (`pnpm build:web` trong `build:exe`; Δ so `b139d8a`, cũng là Δ so lượt 1 vì bundle lượt 1 = nền)

| File | Thô (byte) | Δ | Gzip (byte) | Δ |
|---|---:|---:|---:|---:|
| `assets/chart.js` | 513 302 | 0 | 172 450 | 0 |
| `assets/exceljs.min.js` | 929 569 | 0 | 255 572 | 0 |
| `assets/index.js` | 909 669 | +17 727 | 267 044 | +5 034 |
| `assets/index.css` | 28 390 | +26 | 6 416 | +4 |
| `assets/rolldown-runtime.js` | 1 106 | 0 | 627 | 0 |
| **Tổng JS / CSS** | 2 382 036 | +17 753 | 702 109 | +5 038 |
| Tệp khác (15 file: wasm, font, ảnh…) | 849 196 | 0 | — | — |

### Coverage theo vùng (chỉ dòng < 100 %; `gates\coverage.log`)

| Vùng | Stmts | Branch | Funcs | Lines |
|---|---:|---:|---:|---:|
| `apps/desktop/src/data` | 97.69 | 95.27 | 95.94 | 98.63 |
| `apps/desktop/src/routes` (gốc) | 98.9 | 92.46 | 100 | 100 |
| `routes/appointments` | 99.58 | 93.57 | 100 | 99.48 |
| `routes/customers` | 98.76 | 97.75 | 99.09 | 99.25 |
| `routes/overview` | 98.26 | 93.95 | 98.27 | 98.6 |
| `routes/reports` | 100 | 93.45 | 100 | 100 |
| `apps/desktop/src/shell` | 83.47 | 92.23 | 82.5 | 83.5 |
| `packages/db/src` | 99.63 | 97.76 | 100 | 99.85 |
| `packages/ui/src` | 100 | 90.9 | 100 | 100 |
| `packages/ui/src/components` | 100 | 93.75 | 100 | 100 |

Vùng không có trong bảng: 100 % (vitest `skipFull`).

### Cỡ dòng theo gói (`node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json`)

Trùng đúng bảng plan §L2.3 ✅ (`gates\size-report.log`).

| Gói | Sản phẩm (Δ) | Test (Δ) | Sinh tự động (Δ) | File (Δ) |
|---|---:|---:|---:|---:|
| A. Lõi dữ liệu | 7 867 (+394) | 12 807 (+960) | 311 (+22) | 98 (+5) |
| B. File và Rust | 2 162 (+161) | 4 433 (+465) | 0 | 19 (0) |
| C. AI | 5 250 (+121) | 6 110 (+125) | 0 | 60 (0) |
| D. Màn nhập liệu | 7 196 (+376) | 2 023 (+275) | 0 | 74 (+1) |
| E. Lịch hẹn, chỉ số, quản lý | 7 374 (+342) | 3 843 (+298) | 0 | 51 (0) |
| F. Xuyên gói / công cụ | 3 939 (+178) | 12 417 (+1 519) | 4 628 (0) | 84 (+1) |
| **Tổng** | 33 788 (+1 572) | 41 633 (+3 642) | 4 939 (+22) | 386 (+7) |

## Dữ liệu tải

`common\load\load-2026-10-12-seed6.p2cbackup` (15.3 MB, `node tools/load-data.mjs` ở SHA ghim, mốc `2026-10-12`, seed `6`): 1 496 KH, 10 414 lịch hẹn, 1 510 `appointment_coordinators`, 54 nhân sự, 5 team, 1 697 hợp đồng, 103 `ai_analyses`, 5 672 `kyc_notes`, 13 114 `kyc_versions`, 13 833 `kyc_facts`, 4 941 `stage_transitions`, 0 `settings`. `tables` sha256 `1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591` = plan §L2.6 ✅. File lượt 1 (`deep-review-1-6\common\load\…`) không dùng.

## Mở app lần đầu (cách T-227, Home PC)

Script `common\perf\first-open.mjs` (kết quả `perf\first-open\first-open.json`): mỗi lần chép `common\exe\project2c.exe` vào thư mục mới `perf\first-open\run-<n>\` (chưa có `Project2C-data\`, app sinh seed demo), mở với cổng debug WebView2 9222, chờ 12 s rồi mới nối CDP đọc mốc trong trang; lúc gọi exe ghi bằng `Date.now()` ngoài exe, so với `performance.timeOrigin`. "Màn đầu có số liệu" = LCP (cả 3 lần là `H1`). 3 lần, máy rảnh.

| Mốc | Lần 1 | Lần 2 | Lần 3 | Trung vị | T-227 Phase 6 `b0f2f50` (min–max) | Mốc so (T-227 Phase 4 max) | Xấu hơn? |
|---|---:|---:|---:|---:|---|---|---|
| Gọi exe → trang bắt đầu | 401 | 377 | 362 | 377 ms | 621–679 ms | — | — |
| Sinh seed demo (`p2c:demo-seed`) | 2 940 | 2 917 | 2 946 | 2 940 ms | 3 016–3 046 ms | — | — |
| Trang bắt đầu → mở xong dữ liệu (`p2c:data-open`) | 3 113 | 3 094 | 3 119 | 3 113 ms | 3 185–3 216 ms | — | — |
| Lưu file DB lần đầu (`p2c:db-save`) | 124 | 118 | 124 | 124 ms | 171–187 ms | — | — |
| **Gọi exe → màn đầu có số liệu (LCP)** | 3 597 | 3 505 | 3 526 | **3 526 ms** | 3 989–4 019 ms | 3 937 ms (xấu hơn khi > 4 724 ms) | ✅ không |

File `project2c.db` sau lần đầu: 9 949 184 byte (T-227 Phase 6: 9 580 544).

## Hiệu năng trên exe (probe `e2e/perf`, Home PC)

`common\perf\perf-ref.json` (log `perf\perf-ref.log`): probe `e2e/perf` (T-218) chạy từ `Project-2C-review` trên bản chép `common\exe\project2c.exe` ở `common\perf\run\`, cổng debug 9222, `PERF_RUNS` 5, sau khi Owner nhập dữ liệu tải trong exe; Home PC rảnh, cửa sổ exe trên cùng, 18/10/2026. Lệnh: plan §L2.6 "Probe, Home PC" (`PERF_BASE = common\perf\perf-ref-r1.json` = `perf-ref` lượt 1 Home PC, exe `8855345`, 13/10; `PERF_NOTE` `DESKTOP-KDURKJP, exe 4217ed4, deep review luot 2`). **Đây là số để so** khi reviewer đo trên exe ở máy này. **Không so nền T-219** (Office Laptop, plan §L2.6).

- **Lần chạy thứ nhất bỏ** (`perf\perf-ref-try1-after-first-open.{json,log}`): exe được mở lần đầu với thư mục trống (sinh seed demo) rồi nhập dữ liệu tải, không mở lại, nên `app.open-data` đo lúc sinh seed (3 070 ms), không phải lúc mở lại trên dữ liệu tải như `e2e/perf/README.md`. Các dòng khác của lần đó trùng lần chạy dưới trong luật nhiễu (`reload.*` cũng +60–67 ms).
- **Lần chạy dưới:** đóng exe, mở lại cùng thư mục (đã có dữ liệu tải), nối probe ngay.
- **Một lần nhập trong UI bị từ chối trước đó** (không phải lỗi): Owner chọn nhầm file lượt 1 cùng tên `deep-review-1-6\common\load\…`; `importBackup` ở SHA ghim từ chối `BACKUP_INVALID` luật 4 (luật nhập backup đổi ở #616 / #640, K1); file lượt 2 nhập được (kiểm cả trong Node).

| Thao tác | Lần | Trung vị | Min | Max | Lượt 1 Home PC (`perf-ref-r1`) | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 301 ms | 301 ms | 301 ms | 189 ms | +113 ms (+60%) ⚠️ | ≤ 600 ms ✅ |
| `backup.read` | 5 | 814 ms | 802 ms | 838 ms | 794 ms | +21 ms (+3%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 43 ms | 37 ms | 47 ms | 49 ms | −6 ms (−12%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 147 ms | 144 ms | 152 ms | 140 ms | +7 ms (+5%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 355 ms | 354 ms | 413 ms | 293 ms | +62 ms (+21%) ⚠️ | < 500 ms ✅ |
| `reload.appointments` | 5 | 349 ms | 342 ms | 366 ms | 283 ms | +67 ms (+24%) ⚠️ | < 500 ms ✅ |
| `reload.customers` | 5 | 272 ms | 269 ms | 273 ms | 206 ms | +66 ms (+32%) ⚠️ | < 500 ms ✅ |
| `reload.reports` | 5 | 328 ms | 328 ms | 348 ms | 264 ms | +64 ms (+24%) ⚠️ | < 500 ms ✅ |
| `reload.team` | 5 | 311 ms | 311 ms | 327 ms | 248 ms | +64 ms (+26%) ⚠️ | < 500 ms ✅ |
| `reload.settings` | 5 | 247 ms | 240 ms | 255 ms | 180 ms | +67 ms (+37%) ⚠️ | < 500 ms ✅ |
| `appointments.period-day` | 5 | 5 ms | 5 ms | 12 ms | 8 ms | −3 ms (−34%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 13 ms | 13 ms | 16 ms | 13 ms | +1 ms (+6%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 18 ms | 13 ms | 21 ms | 13 ms | +4 ms (+32%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 17 ms | 17 ms | 21 ms | 17 ms | +1 ms (+3%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 18 ms | 17 ms | 19 ms | 17 ms | +0 ms (+2%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 12 ms | 14 ms | 12 ms | +1 ms (+7%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 8 ms | 6 ms | 17 ms | 6 ms | +2 ms (+38%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 10 ms | 9 ms | 12 ms | 10 ms | +0 ms (+0%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 7 ms | 6 ms | 9 ms | 7 ms | 0 ms (−6%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 19 ms | 17 ms | 26 ms | 18 ms | +1 ms (+8%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 22 ms | 13 ms | 24 ms | 22 ms | +0 ms (+0%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 18 ms | 18 ms | 21 ms | 20 ms | −2 ms (−9%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 2 ms | 2 ms | 18 ms | 12 ms | −10 ms (−83%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 15 ms | 15 ms | 19 ms | 15 ms | +0 ms (+2%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 15 ms | 14 ms | 16 ms | 14 ms | +1 ms (+5%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 9 ms | 8 ms | 10 ms | 9 ms | +0 ms (+2%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | +0 ms (+3%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 18 ms | 17 ms | 18 ms | 17 ms | +0 ms (+2%) | < 200 ms ✅ |
| `trash.open` | 5 | 73 ms | 71 ms | 82 ms | 80 ms | −7 ms (−9%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 6 ms | 5 ms | 8 ms | 6 ms | −1 ms (−9%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,5 MB | 16,5 MB | 16,5 MB | 16,4 MB | +0,1 MB (+1%) | ≤ 21 MB ✅ |
| `reports.export-excel` | 5 | 27 ms | 21 ms | 86 ms | 24 ms | +3 ms (+10%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 422 ms | 418 ms | 439 ms | 424 ms | −2 ms (+0%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 99 ms | 97 ms | 103 ms | 102 ms | −3 ms (−3%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 106 ms | 105 ms | 108 ms | 106 ms | +0 ms (+0%) | ≤ 300 ms ✅; Năm − Tháng +7 ms ≤ 50 ms ✅ |

**Số liệu ghi lại, không phải kết luận** (bước chuẩn bị không ghi phát hiện; gói B / F xét nguyên nhân):

- Mọi thao tác đều trong ngưỡng `phase-6.md`; mọi thao tác màn < 200 ms.
- **7 dòng ⚠️ so lượt 1 cùng máy:** sáu dòng `reload.*` chậm hơn đều ≈ +62–67 ms (+21–37 %), lặp lại ở cả hai lần chạy; `app.open-data` 301 ms.
- **Cờ `app.open-data`** (`review-notes.md`, plan §L2.6): 301 ms so 188,5 ms của `perf-ref` lượt 1 Home PC (+60 %, ⚠️), ≤ 600 ms. Lượt 1 Codex F đo trên exe `8855345` cùng máy: 279 ms (thêm 230–283 ms).
- `trash.open` 73 ms so 80 ms (−9 %), trong nhiễu (DR6-44 so trong Node ở gói F).
