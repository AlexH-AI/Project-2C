# Baseline — deep review Phase 1–6, lượt 1

- **SHA ghim:** `8855345` (`885534549808f42aec7f9af5743bbf86642ee4bd`). Code sản phẩm giống hệt `b139d8a` (số đo nền T-219).
- **Máy:** Home PC `DESKTOP-KDURKJP`, 13/10/2026. Worktree `C:\workspace\Project-2C-review` (detached `8855345`, `git status --short` rỗng); `pnpm install --frozen-lockfile`.
- **`main` lúc chuẩn bị:** `1f618f3` (#583). Từ `8855345` chỉ đổi tài liệu (`CLAUDE.md` gốc, `docs/**`), không có code → SHA ghim giữ nguyên (plan §2).
- **Trạng thái đầu worktree review:** `Project-2C-review`: rỗng. `Project-2C-review-2`: `?? .agents/`, `?? .codex/`, `?? AGENTS.md` (Codex tự sinh 10/10, để nguyên — plan §8).
- Log đầy đủ của từng cổng: `common\gates\*.log`.

## Cổng ở SHA ghim

| Cổng | Kết quả | Thời gian |
|---|---|---|
| `pnpm verify` | ✅ 110 file test, 2 755 test; `lint:deps`: no dependency violations (309 module, 1 244 dependency) | 118 s |
| `pnpm verify:rust` | ✅ fmt + clippy `-D warnings` sạch; 91 test Rust | 49 s |
| `pnpm e2e` (`CI=1`) | ✅ 210 passed | 108 s |
| `pnpm build:exe` | ✅ `project2c.exe` release 5 414 400 byte (Δ 0 so `b139d8a`), sha256 `DFA985F13AE2A4A8E1A8EC1B61696663A1A8873B318DE60B5A9A1BC2BC481201` → `common\exe\project2c.exe` | 133 s |
| `pnpm test:coverage` | ✅ Stmts 98.99 % · Branch 97.03 % · Funcs 98.94 % · Lines 99.24 % | 103 s |

### Bundle web (`pnpm build:web` trong `build:exe`, Δ so `b139d8a` đều 0)

| File | Thô (byte) | Gzip (byte) |
|---|---:|---:|
| `assets/chart.js` | 513 302 | 172 450 |
| `assets/exceljs.min.js` | 929 569 | 255 572 |
| `assets/index.js` | 891 942 | 262 010 |
| `assets/index.css` | 28 364 | 6 412 |
| `assets/rolldown-runtime.js` | 1 106 | 627 |
| **Tổng JS / CSS** | 2 364 283 | 697 071 |
| Tệp khác (15 file: wasm, font, ảnh…) | 849 196 | — |

### Coverage theo vùng (chỉ dòng < 100 %; `gates\coverage.log`)

| Vùng | Stmts | Branch | Funcs | Lines |
|---|---:|---:|---:|---:|
| `apps/desktop/src/data` | 97.78 | 95 | 96.5 | 98.54 |
| `apps/desktop/src/routes` (gốc) | 98.87 | 93.15 | 100 | 100 |
| `routes/appointments` | 99.53 | 92.93 | 100 | 99.43 |
| `routes/customers` | 98.6 | 97.46 | 98.97 | 99.15 |
| `routes/overview` | 98.26 | 93.95 | 98.27 | 98.6 |
| `routes/reports` | 100 | 93.45 | 100 | 100 |
| `apps/desktop/src/shell` | 81.37 | 90.8 | 81.57 | 81.17 (`useRoute.ts` 0 %) |
| `packages/db/src` | 99.61 | 97.91 | 100 | 99.85 |

Vùng không có trong bảng: 100 % (vitest `skipFull`).

### Cỡ dòng theo gói (`node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json`)

| Gói | Sản phẩm | Test | Sinh tự động | File |
|---|---:|---:|---:|---:|
| A. Lõi dữ liệu | 7 473 | 11 847 | 289 | 93 |
| B. File và Rust | 2 001 | 3 968 | 0 | 19 |
| C. AI | 5 129 | 5 985 | 0 | 60 |
| D. Màn nhập liệu | 6 820 | 1 748 | 0 | 73 |
| E. Lịch hẹn, chỉ số, quản lý | 7 032 | 3 545 | 0 | 51 |
| F. Xuyên gói / công cụ | 3 761 | 11 263 (+365) | 4 628 | 84 (+1) |
| **Tổng** | 32 216 | 38 356 | 4 917 | 380 |

## Dữ liệu tải

`common\load\load-2026-10-12-seed6.p2cbackup` (15.3 MB, `node tools/load-data.mjs` ở SHA ghim, mốc `2026-10-12`, seed `6`): 1 496 KH, 10 414 lịch hẹn, 54 nhân sự, 5 team, 1 697 hợp đồng, 103 `ai_analyses`, 13 114 `kyc_versions`, 4 941 `stage_transitions`. `tables` sha256 `1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd` = plan §6 ✅.

## Hiệu năng tham chiếu cùng máy

`common\perf\perf-ref.json` (log `perf\perf-ref.log`): probe `e2e/perf` (T-218) trên bản chép `common\exe\project2c.exe` ở `common\perf\run\`, cổng debug 9222, `PERF_RUNS` 5, sau khi Owner nhập dữ liệu tải trong exe; Home PC rảnh, cửa sổ exe trên cùng, 13/10/2026. **Đây là số để so** (plan §6): reviewer đo trên Home PC so với file này; không so trực tiếp với số đo nền T-219 (Office Laptop). Lượt 2 so bằng `PERF_BASE=…\perf-ref.json`.

| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng |
|---|---|---|---|---|---|
| `app.open-data` | 1 | 189 ms | 189 ms | 189 ms | — |
| `backup.read` | 5 | 794 ms | 764 ms | 802 ms | — |
| `backup.import` | 5 | 49 ms | 40 ms | 50 ms | — |
| `db.save` | 15 | 140 ms | 138 ms | 154 ms | — |
| `reload.overview` | 5 | 293 ms | 289 ms | 349 ms | — |
| `reload.appointments` | 5 | 283 ms | 280 ms | 295 ms | — |
| `reload.customers` | 5 | 206 ms | 205 ms | 212 ms | — |
| `reload.reports` | 5 | 264 ms | 261 ms | 282 ms | — |
| `reload.team` | 5 | 248 ms | 247 ms | 261 ms | — |
| `reload.settings` | 5 | 180 ms | 177 ms | 193 ms | — |
| `appointments.period-day` | 5 | 8 ms | 7 ms | 10 ms | < 200 ms ✅ |
| `appointments.period-week` | 5 | 13 ms | 12 ms | 13 ms | < 200 ms ✅ |
| `appointments.period-month` | 5 | 13 ms | 13 ms | 14 ms | < 200 ms ✅ |
| `appointments.period-year` | 5 | 17 ms | 16 ms | 19 ms | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 17 ms | 17 ms | 23 ms | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 11 ms | 12 ms | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 10 ms | 9 ms | 11 ms | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 7 ms | 6 ms | 9 ms | < 200 ms ✅ |
| `customers.view-table` | 5 | 18 ms | 16 ms | 20 ms | < 200 ms ✅ |
| `customers.sort-name` | 5 | 22 ms | 19 ms | 25 ms | < 200 ms ✅ |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 25 ms | < 200 ms ✅ |
| `customer.ai-history` | 5 | 12 ms | 2 ms | 17 ms | < 200 ms ✅ |
| `overview.filter-year` | 5 | 15 ms | 15 ms | 19 ms | < 200 ms ✅ |
| `overview.filter-month` | 5 | 14 ms | 13 ms | 15 ms | < 200 ms ✅ |
| `reports.filter-year` | 5 | 9 ms | 9 ms | 10 ms | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 8 ms | 10 ms | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | < 200 ms ✅ |
| `trash.open` | 5 | 80 ms | 77 ms | 90 ms | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 6 ms | 6 ms | 15 ms | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,4 MB | 16,4 MB | 16,4 MB | — |
| `reports.export-excel` | 5 | 24 ms | 17 ms | 76 ms | — |
| `backup.export` | 5 | 424 ms | 418 ms | 450 ms | — |
| `appointments.next-month` | 5 | 102 ms | 102 ms | 115 ms | — |
| `appointments.next-year` | 5 | 106 ms | 106 ms | 121 ms | — |

Mọi thao tác màn < 200 ms. Exe tham chiếu dùng cổng 9222; reviewer đo trên exe thì chép `common\exe\project2c.exe` vào thư mục của mình và dùng cổng khác (plan §6).
