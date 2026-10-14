# Kết quả cổng ở SHA ghim — deep review Phase 1–6, lượt 1

Bước chuẩn bị `plan.md` §9 bước 6–7, chạy 14/10/2026 trên **Office Laptop `D13_THINKPAD`**, worktree `C:\workspace\Project-2C-review` detached ở `8855345` (`885534549808f42aec7f9af5743bbf86642ee4bd`), sau `pnpm install --frozen-lockfile`. Không có việc nặng nào khác chạy song song. Log đầy đủ: `common\logs\*.log`. `git status --short` của worktree trước và sau: rỗng.

| Cổng | Lệnh | Kết quả | Thời gian (bắt đầu) |
|---|---|---|---|
| Verify | `pnpm verify` (format, lint, `lint:deps`, `lint:tokens`, `codemap:check`, typecheck, `test:coverage`) | ✅ exit 0 · **110 file test, 2 755 test** pass · `lint:deps`: no dependency violations (309 module, 1 244 dependency) · ngưỡng coverage theo vùng đạt | 129 s (09:10) |
| Rust | `pnpm verify:rust` (`cargo fmt --check`, clippy `-D warnings`, `cargo test --lib`) | ✅ exit 0 · **91 test** pass, không cảnh báo clippy | 56 s (09:12) |
| E2E | `CI=1 pnpm e2e` (Edge) | ✅ exit 0 · **210 passed** | 130 s (09:13) |
| Build exe | `pnpm build:exe` (gồm `build:web`) | ✅ exit 0 · `project2c.exe` **5 414 400 byte** | 115 s (09:15) |
| Kích thước | `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` | ✅ Δ 0 mọi dòng trừ test gói F +365 dòng / +1 file (`e2e/full-cycle.spec.ts`, `e2e/support.ts` của T-220, đúng `plan.md` §3) | < 1 s (09:17) |

## Coverage theo vùng (`pnpm verify` → `test:coverage`)

Vitest ẩn dòng của thư mục đạt 100 % mọi cột (`packages/domain/src`, `packages/ai/src`… — ngưỡng 100 % ở `vitest.config.ts`). Các dòng còn hiện:

| Vùng | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| **Tất cả** | 98,99 | 97,03 | 98,94 | 99,24 |
| `packages/db/src` | 99,61 | 97,91 | 100 | 99,85 |
| `apps/desktop/src/data` | 97,78 | 95 | 96,5 | 98,54 |
| `apps/desktop/src/routes` (file gốc) | 98,87 | 93,15 | 100 | 100 |
| `routes/appointments` | 99,53 | 92,93 | 100 | 99,43 |
| `routes/customers` | 98,6 | 97,46 | 98,97 | 99,15 |
| `routes/overview` | 98,26 | 93,95 | 98,27 | 98,6 |
| `routes/reports` | 100 | 93,45 | 100 | 100 |
| `apps/desktop/src/shell` | 81,37 | 90,8 | 81,57 | 81,17 |

## Bundle web (`apps/desktop/dist`, từ `build:exe`)

| File | Thô (byte) | Gzip (byte) | Δ so `b139d8a` |
|---|---:|---:|---:|
| `assets/exceljs.min.js` | 929 569 | 255 572 | 0 |
| `assets/index.js` | 891 942 | 262 010 | 0 |
| `assets/chart.js` | 513 302 | 172 450 | 0 |
| `assets/index.css` | 28 364 | 6 412 | 0 |
| `assets/rolldown-runtime.js` | 1 106 | 627 | 0 |
| **Tổng JS / CSS** | **2 364 283** | **697 071** | 0 |
| Tệp khác (15 file: `sql-wasm` 658 KB, 12 font, …) | 849 196 | — | 0 |

Vite cảnh báo chunk > 600 kB (`exceljs.min.js`, `index.js`) — như số đo nền.

## Exe

- `common\exe\project2c.exe`: **5 414 400 byte** (Δ 0 so `b139d8a`), SHA-256 `3033AEA07AB89E5B9737B0455443D25DC7454097C8248BD679C5DCFC625FD835`. Muốn đo trên exe thì chép file này vào thư mục kết quả của mình (`plan.md` §6).

## Dữ liệu tải

`node tools/load-data.mjs --out common\load\load-2026-10-12-seed6.p2cbackup` (ở `8855345`): 15,3 MB; `customers` 1 496, `appointments` 10 414, `appointment_coordinators` 1 510, `policies` 1 697, `people` 54, `teams` 5, `kyc_notes` 5 672, `kyc_versions` 13 114, `kyc_facts` 13 833, `stage_transitions` 4 941, `ai_analyses` 103, `settings` 0. `tables` sha256 `1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd` — **khớp** `plan.md` §6.

## Probe tham chiếu cùng máy — `common\perf\perf-ref.json`

Probe T-218 (`e2e/perf/README.md`) chạy từ `Project-2C-review` (`8855345`) trên bản chép `common\perf\run\project2c.exe` (cùng file với `common\exe\`), cổng debug 9222, `PERF_RUNS=5`, `PERF_BACKUP` = dữ liệu tải ở trên, `PERF_BASE=docs/metrics/phase-6-baseline/perf.json` (số đo nền T-219, `b139d8a`, cùng máy). Owner đã nhập dữ liệu tải vào exe qua Cài đặt → Dữ liệu → Nhập backup, sau đó để máy rảnh. Máy cắm sạc, power plan Balanced. **Chạy lúc 09:28–09:30 ngày 14/10, exe mở lại khi đã có dữ liệu tải.** Log: `common\logs\probe.log`.

**Kết quả: không thao tác nào xấu hơn nền** (luật ⚠️ của probe: hơn 20 % **và** hơn 10 ms, bộ nhớ hơn 5 MB). Mọi thao tác màn < 200 ms ✅.

| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng | Nền | Δ |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 273 ms | 273 ms | 273 ms | — | 251 ms | +21 ms (+9%) |
| `backup.read` | 5 | 886 ms | 841 ms | 898 ms | — | 1035 ms | −149 ms (−14%) |
| `backup.import` | 5 | 51 ms | 38 ms | 55 ms | — | 50 ms | +1 ms (+2%) |
| `db.save` | 15 | 160 ms | 156 ms | 193 ms | — | 162 ms | −1 ms (−1%) |
| `reload.overview` | 5 | 349 ms | 333 ms | 399 ms | — | 338 ms | +11 ms (+3%) |
| `reload.appointments` | 5 | 336 ms | 328 ms | 346 ms | — | 330 ms | +6 ms (+2%) |
| `reload.customers` | 5 | 241 ms | 232 ms | 255 ms | — | 245 ms | −4 ms (−2%) |
| `reload.reports` | 5 | 307 ms | 305 ms | 318 ms | — | 314 ms | −7 ms (−2%) |
| `reload.team` | 5 | 289 ms | 283 ms | 304 ms | — | 293 ms | −4 ms (−1%) |
| `reload.settings` | 5 | 207 ms | 202 ms | 231 ms | — | 206 ms | +1 ms (+0%) |
| `appointments.period-day` | 5 | 10 ms | 9 ms | 12 ms | < 200 ms ✅ | 10 ms | +0 ms (+4%) |
| `appointments.period-week` | 5 | 14 ms | 14 ms | 15 ms | < 200 ms ✅ | 15 ms | 0 ms (−1%) |
| `appointments.period-month` | 5 | 15 ms | 14 ms | 16 ms | < 200 ms ✅ | 15 ms | +0 ms (+1%) |
| `appointments.period-year` | 5 | 18 ms | 18 ms | 27 ms | < 200 ms ✅ | 18 ms | 0 ms (−1%) |
| `appointments.sort-date-asc` | 5 | 21 ms | 17 ms | 24 ms | < 200 ms ✅ | 20 ms | +1 ms (+5%) |
| `appointments.sort-date-desc` | 5 | 13 ms | 12 ms | 16 ms | < 200 ms ✅ | 12 ms | +1 ms (+7%) |
| `appointments.select-row-year` | 5 | 8 ms | 6 ms | 10 ms | < 200 ms ✅ | 7 ms | +1 ms (+9%) |
| `appointments.select-day-month` | 5 | 7 ms | 7 ms | 9 ms | < 200 ms ✅ | 9 ms | −1 ms (−13%) |
| `appointments.select-row-month` | 5 | 6 ms | 6 ms | 6 ms | < 200 ms ✅ | 6 ms | +0 ms (+2%) |
| `customers.view-table` | 5 | 20 ms | 19 ms | 21 ms | < 200 ms ✅ | 19 ms | +1 ms (+7%) |
| `customers.sort-name` | 5 | 22 ms | 19 ms | 23 ms | < 200 ms ✅ | 19 ms | +3 ms (+13%) |
| `customer.open-ai` | 5 | 23 ms | 22 ms | 25 ms | < 200 ms ✅ | 24 ms | 0 ms (−2%) |
| `customer.ai-history` | 5 | 7 ms | 2 ms | 16 ms | < 200 ms ✅ | 3 ms | +3 ms (+110%) |
| `overview.filter-year` | 5 | 17 ms | 16 ms | 22 ms | < 200 ms ✅ | 17 ms | 0 ms (−2%) |
| `overview.filter-month` | 5 | 16 ms | 14 ms | 18 ms | < 200 ms ✅ | 16 ms | +0 ms (+1%) |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | < 200 ms ✅ | 10 ms | 0 ms (−3%) |
| `reports.filter-month` | 5 | 8 ms | 8 ms | 10 ms | < 200 ms ✅ | 9 ms | −1 ms (−11%) |
| `reports.table-re` | 5 | 16 ms | 16 ms | 18 ms | < 200 ms ✅ | 17 ms | 0 ms (−2%) |
| `trash.open` | 5 | 91 ms | 91 ms | 100 ms | < 200 ms ✅ | 89 ms | +2 ms (+2%) |
| `trash.kind-appointments` | 5 | 8 ms | 7 ms | 16 ms | < 200 ms ✅ | 8 ms | +1 ms (+8%) |
| `memory.js-heap` | 1 | 16,4 MB | 16,4 MB | 16,4 MB | — | 16,4 MB | +0,0 MB (+0%) |
| `reports.export-excel` | 5 | 36 ms | 35 ms | 94 ms | — | 35 ms | +1 ms (+3%) |
| `backup.export` | 5 | 484 ms | 466 ms | 487 ms | — | 481 ms | +3 ms (+1%) |
| `appointments.next-month` | 5 | 117 ms | 114 ms | 129 ms | — | 116 ms | +1 ms (+0%) |
| `appointments.next-year` | 5 | 120 ms | 119 ms | 136 ms | — | 134 ms | −13 ms (−10%) |

### Hai lần chạy khác (giữ để biết độ nhiễu, không dùng làm tham chiếu)

- `perf\perf-first-open.json` (09:22–09:24, log `logs\probe-first-open.log`): exe mở **lần đầu** (sinh seed demo) rồi mới nhập dữ liệu tải, nên `app.open-data` = **3 426 ms** là số mở lần đầu (laptop đo T-219: 3 140 ms), không so được với nền mở lại. Mọi thao tác khác khớp nền; `backup.import` 68 ms (⚠️ +17 ms) là do các lần đo nhảy giữa 51 và 68 ms, cách nhau một khung hình (16,7 ms).
- `perf\perf-reopen-run2.json` (09:25–09:27, log `logs\probe-reopen-run2.log`): cả 6 `reload.*` chậm hơn nền 20–39 % (vd. `reload.reports` 402 ms), `trash.open` 114 ms, `app.open-data` 310 ms. Cùng exe và dữ liệu, chạy ngay trước và ngay sau đều khớp nền, nên đây là **nhiễu của máy** (laptop vừa build và đo liên tục, có tiến trình nền), không phải code chậm. **Lưu ý cho reviewer:** trên laptop này một lần đo đơn lẻ có thể lệch +20–40 % ở các màn `reload.*`. Thấy ⚠️ thì đo lại trước khi ghi phát hiện P.
