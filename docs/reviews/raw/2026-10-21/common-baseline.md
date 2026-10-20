# Baseline — deep review Phase 1–6, lượt 3

- **Máy:** Home PC **`DESKTOP-KDURKJP`** (`hostname`). Bước chuẩn bị bắt đầu **19/10/2026 23:54:44 +07:00** (`Get-Date`); giờ từng bước ghi ở dưới và trong `gates\summary.txt`, `perf\run-exe.log`. Bước chuẩn bị, cả hai bên (Claude Workflow, Codex) và mọi số đo của lượt 3 chạy trên máy này; số đo so với mốc **cùng máy** (plan §L3.6): mốc Home PC sau #656 (`docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`), probe lượt 2 cùng máy (`perf\perf-ref-r2.json`), và ngưỡng `docs/metrics/phase-6.md`.
- **SHA ghim:** `119e2e4` (`119e2e45cbce54d8a3943757bd826a7f1e9b694f`).
- **`main` lúc chuẩn bị:** `98d0016` (#716). `git diff --name-only 119e2e4 origin/main` chỉ có `CLAUDE.md` gốc và `docs/**` (`PROJECT-STATE.md`, ADR-0001, `decisions/README.md`, `design/phase-6-hoan-thien.md`, `process/deep-review-phase-1-6.md`, `state/review-notes.md`) → SHA ghim giữ nguyên (plan §L3.2).
- **Thư mục:** `C:\workspace\deep-review-1-6-r3\` chưa có trước bước chuẩn bị; đã tạo `common\`, `claude\`, `codex\` (rỗng). `deep-review-1-6-r2\common\perf\perf-ref.json` có, chép thành `perf\perf-ref-r2.json`; file này **trùng byte** với bản trong repo `docs/metrics/phase-6-baseline/perf-home-pc-luot-2.json` (sha256 `85E82FEA44747012A2FA91AF3F6057EC1742575A2987EE8288098A6E23C44348`, như ghi chú review PR #715).
- **Worktree review:** `C:\workspace\Project-2C-review` (trước ở `3a6b8b0`) và `C:\workspace\Project-2C-review-2` (trước ở `17ca209`) đều `checkout --detach 119e2e4`, đã xóa `apps\desktop\dist`, `pnpm install --frozen-lockfile` (lockfile không đổi). `git status --short`: `Project-2C-review` rỗng (cả sau khi chạy cổng); `Project-2C-review-2`: `?? .agents/`, `?? .codex/`, `?? AGENTS.md` (Codex tự sinh, để nguyên — plan §8). Bundle và exe dưới đây dựng ở `Project-2C-review`, không biến môi trường riêng; `apps\desktop\dist` của `-review-2` chưa dựng.
- **File chung:**
  - `plan.md`: bản ở `main` `98d0016` (sau #715, #716), 1 543 dòng.
  - `known.md`: OPEN + ACCEPTED nguyên văn của `review-notes.md` ở `119e2e4`; K1–K29 (K14, K17 theo chữ đã sửa ở §L3.5; K21 thêm chỉ dẫn "(Q6 lượt 1; đợt G5 lượt 2: K28)" theo ghi chú review PR #715); bảng 39 DR6 và danh sách KNOWN.
  - `fixes.md`: thân 18 Issue của §L3.2 và 23 PR (gồm PR docs #707, #677, #692, #665), lấy bằng `gh issue view` / `gh pr view --json`; Issue đều CLOSED, PR đều MERGED, commit merge trùng bảng §L3.2.
  - `prompt-claude.md`, `prompt-codex.md`: đoạn prompt của Phụ lục I / J + một dòng ghi `<bên>` / `<ID>` (`claude` / `CL3`, `codex` / `CX3`) + nguyên văn Phụ lục K.
  - `workflow-claude.mjs`: script Phụ lục I nguyên văn (38 dòng). Kiểm cú pháp bằng `node --check` trong một hàm `async` bọc ngoài (Workflow chạy thân script trong ngữ cảnh `async`, cho `return` ở cấp ngoài); `meta` là literal thuần, `phase('Review')` trùng `meta.phases`, `agent(…, { label, phase, schema })`, `log`, `args` đúng API Workflow.
- Log đầy đủ của từng cổng: `gates\*.log`; tóm tắt `gates\summary.txt`.

## Cổng ở SHA ghim (`Project-2C-review`, 19–20/10)

| Cổng | Kết quả | Thời gian |
|---|---|---|
| `pnpm verify` | ✅ 118 file test, **3 159 test**; `lint:deps`: no dependency violations (320 module, 1 312 dependency); coverage Stmts 99.05 % · Branch 97.04 % · Funcs 98.97 % · Lines 99.28 % (lượt 2: 99.03 / 96.99 / 98.93 / 99.28) | 116 s (bắt đầu 23:55:49) |
| `pnpm verify:rust` | ✅ fmt + clippy `-D warnings` sạch; **104 test** Rust | 20 s |
| `pnpm e2e` (`CI=1`) | ✅ exit 0: **245 passed, 2 flaky** (qua ở lần chạy lại), tổng 247 — chi tiết dưới | 155 s (23:58:05 → 00:00:40) |
| `pnpm build:exe` (không đặt `CI`) | ✅ `project2c.exe` release **5 408 768 byte** (Δ −5 632 so `b139d8a`; bằng exe CI `6526793` và exe mốc sau #656 `dae9df3`), sha256 `E93C8BAA2BACA8EEC30B230EE7375888E109CB28EF6A202BE42D662D4F720CE1` → `common\exe\project2c.exe`. Build cục bộ nên sha256 khác exe CI `6526793` (`509CB7B3…D807AE`) | 73 s (cargo `release` 1 m 06 s) |
| `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` | ✅ số dòng / file từng gói **trùng đúng bảng plan §L3.3** | 0,4 s |

**Hai test e2e flaky** (`gates\e2e.log` dòng 292–380; số liệu ghi lại, không phải kết luận — bước chuẩn bị không ghi phát hiện):

- `e2e\full-cycle.spec.ts:178` ("the whole round…", bước "the data shows the same as before the export", `full-cycle.spec.ts:105`): chờ `Đang xem:` chứa `Tháng 09/2026MTD 01/09 – 15/09/2026 · Team`, nhận `… 01/09 – 16/09/2026 · Team (4 team)`; lần đầu 56,8 s, lần chạy lại 14,9 s qua.
- `e2e\team.spec.ts:458` ("an RE and an IS kept only by a customer in the trash: 9b counts it…", `team.spec.ts:425`): `locator.check` radio `/giữ nguyên$/` của hộp "Kết quả cuộc gặp" quá 30 s; lần chạy lại 2,6 s qua.
- Hai lần chạy đầu đều rơi vào lúc **qua nửa đêm thật** (e2e chạy 23:58:05 → 00:00:40). Bản build e2e mở app ở ngày ghim 15/09/2026 rồi theo đồng hồ qua nửa đêm (T-126, `e2e/period-picker.spec.ts:250`); hai test này không cố định đồng hồ. Lần chạy lại (sau 00:00) qua. Lượt 2 (227 test) không có flaky.

### Bundle web (`pnpm build:web` trong `build:exe`; Δ so `b139d8a` theo `size-report`, cột cuối Δ so lượt 2 `4217ed4`)

| File | Thô (byte) | Δ `b139d8a` | Gzip (byte) | Δ `b139d8a` | Δ lượt 2 (thô / gzip) |
|---|---:|---:|---:|---:|---|
| `assets/chart.js` | 513 302 | 0 | 172 450 | 0 | 0 / 0 |
| `assets/exceljs.min.js` | 929 569 | 0 | 255 572 | 0 | 0 / 0 |
| `assets/index.js` | 927 932 | +35 990 | 271 662 | +9 652 | +18 263 / +4 618 |
| `assets/index.css` | 28 484 | +120 | 6 443 | +31 | +94 / +27 |
| `assets/rolldown-runtime.js` | 1 106 | 0 | 627 | 0 | 0 / 0 |
| **Tổng JS / CSS** | 2 400 393 | +36 110 | 706 754 | +9 683 | +18 357 / +4 645 |
| Tệp khác (15 file: wasm, font, ảnh…) | 849 196 | 0 | — | — | 0 |

### Coverage theo vùng (chỉ dòng < 100 %; `gates\verify.log`)

| Vùng | Stmts | Branch | Funcs | Lines | Lượt 2 (Stmts / Branch / Funcs / Lines) |
|---|---:|---:|---:|---:|---|
| `apps/desktop/src/data` | 97.72 | 95.27 | 96.05 | 98.65 | 97.69 / 95.27 / 95.94 / 98.63 |
| `apps/desktop/src/routes` (gốc) | 99.52 | 94.04 | 100 | 100 | 98.9 / 92.46 / 100 / 100 |
| `routes/appointments` | 99.59 | 93.44 | 100 | 99.49 | 99.58 / 93.57 / 100 / 99.48 |
| `routes/customers` | 98.76 | 97.75 | 99.09 | 99.25 | như lượt 2 |
| `routes/overview` | 98.26 | 93.95 | 98.27 | 98.6 | như lượt 2 |
| `routes/reports` | 100 | 93.45 | 100 | 100 | như lượt 2 |
| `apps/desktop/src/shell` | 83.47 | 92.23 | 82.5 | 83.5 | như lượt 2 |
| `packages/db/src` | 99.58 | 97.67 | 100 | 99.79 | 99.63 / 97.76 / 100 / 99.85 |
| `packages/ui/src` | 100 | 90.9 | 100 | 100 | như lượt 2 |
| `packages/ui/src/components` | 100 | 95 | 100 | 100 | 100 / 93.75 / 100 / 100 |

Vùng không có trong bảng: 100 % (vitest `skipFull`).

### Cỡ dòng theo gói (`gates\size-report.log`; Δ so `b139d8a`)

Số dòng / file trùng đúng bảng plan §L3.3 ✅ (bảng đó ghi Δ so lượt 2).

| Gói | Sản phẩm (Δ) | Test (Δ) | Sinh tự động (Δ) | File (Δ) |
|---|---:|---:|---:|---:|
| A. Lõi dữ liệu | 8 189 (+716) | 13 885 (+2 038) | 339 (+50) | 101 (+8) |
| B. File và Rust | 2 207 (+206) | 4 810 (+842) | 0 | 19 (0) |
| C. AI | 5 357 (+228) | 6 464 (+479) | 0 | 60 (0) |
| D. Màn nhập liệu | 7 329 (+509) | 2 165 (+417) | 0 | 76 (+3) |
| E. Lịch hẹn, chỉ số, quản lý | 7 756 (+724) | 4 146 (+601) | 0 | 51 (0) |
| F. Xuyên gói / công cụ | 4 340 (+579) | 14 165 (+3 267) | 4 628 (0) | 91 (+8) |
| **Tổng** | 35 178 (+2 962) | 45 635 (+7 644) | 4 967 (+50) | 398 (+19) |

## Dữ liệu tải

`common\load\load-2026-10-12-seed6.p2cbackup` (16 034 517 byte, 15,3 MB; `node tools/load-data.mjs --out …` ở SHA ghim, mốc `2026-10-12`, seed `6`, 8,8 s; `gates\load-data.log`): 1 496 KH, 10 414 lịch hẹn, 1 510 `appointment_coordinators`, 54 nhân sự, 5 team, 1 697 hợp đồng, 103 `ai_analyses`, 5 672 `kyc_notes`, 13 114 `kyc_versions`, 13 833 `kyc_facts`, 4 941 `stage_transitions`, 0 `settings`. **`tables` sha256 `1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f` = plan §L3.6 ✅** (khác `1c306cfb…589591` của lượt 2, số dòng như cũ). File lượt 1, lượt 2 (`deep-review-1-6\…`, `deep-review-1-6-r2\…`) không dùng.

## Dọn sạch Thùng rác trong Node (plan §L3.6)

Script `perf\purge-node.mjs` (kết quả `perf\purge-node.json`, log `perf\purge-node.log`), chạy 20/10 ≈ 00:05 sau khi cổng xong, máy không chạy việc nặng khác. Node `v24.20.0`, `@p2c/db` của `Project-2C-review` (qua `tools/ts-hooks.mjs`), không persist. Mỗi lần: `importBackup` file dữ liệu tải (mới, vì dọn là xóa hẳn); cỡ lớn thì thêm `softDeleteCustomer` cho **1 200 KH đang dùng đầu tiên theo `id`**; rồi đo `listTrash` → `previewPurge` → `purgeTrash` (VACUUM bên trong đo riêng bằng cách bọc `sqlite.run` của chính handle đó, không sửa repo) → `db.export()` → `listTrash`. 5 lần mỗi cỡ; trung vị (min–max), ms.

| Đo | Dữ liệu tải: 113 dòng Thùng rác | Thùng rác lớn: 1 313 dòng (+1 200 KH xóa) |
|---|---|---|
| `listTrash` trước khi dọn | 32,6 (31,4–43,3) | 140,7 (136,5–159,2) |
| `previewPurge` | 5,6 (5,4–6,0) | 9,9 (9,8–10,2) |
| `purgeTrash` cả `VACUUM` | 93,8 (90,0–95,6) | 109,8 (108,3–123,6) |
| — trong đó phần transaction (không `VACUUM`) | 29,4 (28,6–31,3) | 105,3 (102,7–118,6) |
| — trong đó `VACUUM` | 64,4 (61,4–64,5) | 5,0 (4,5–5,6) |
| `db.export()` sau khi dọn | 2,1 (2,0–2,2) | 0,4 (0,4–0,4) |
| `listTrash` sau khi dọn | 10,8 (9,7–10,9) | 2,1 (1,6–2,4) |
| Dòng Thùng rác trước → sau; giữ lại | 113 → 0; giữ 0 | 1 313 → 0; giữ 0 |
| Cỡ file (`export()`) trước → sau | 14 069 760 → 13 410 304 byte (−4,7 %) | 14 118 912 → 1 486 848 byte (−89,5 %) |

- Dữ liệu tải không có bản ghi nào bị giữ lại (TR-12) ở cả hai cỡ.
- Cỡ lớn xóa 1 200 trong 1 481 KH đang dùng, nên dọn xong file chỉ còn ≈ 1,5 MB; `VACUUM` và `export()` nhanh vì file nhỏ.
- Spec không đặt ngưỡng cho thao tác này nên chỉ ghi số (plan §L3.6).

## Đo trên exe (20/10/2026 00:07:32 → 00:12:00)

Một script `perf\run-exe.ps1` (log `perf\run-exe.log`) chạy liền bốn việc trên `common\exe\project2c.exe`, cổng debug 9222. Owner đồng ý để máy rảnh lúc đo (không dùng máy, cửa sổ exe trên cùng); không phiên review nào chạy; không bước nào báo "no frame painted". Tiến trình nền có mặt: app Codex (một `node.exe` của runtime Codex, rảnh).

1. Mở app lần đầu 3 lần (`perf\first-open.mjs`, chép từ lượt 2, không đổi).
2. `perf\run\`: chép exe, mở (thư mục trống, app sinh seed demo), **nhập dữ liệu tải qua cổng debug** bằng `perf\import-load.mjs` (đúng thao tác `e2e/perf/README.md` bước 3: Cài đặt → Dữ liệu → Nhập backup → Backup rồi thay dữ liệu, chờ báo đã nhập và lần lưu file), đóng exe. Plan §L3.9 bước 7 ghi Owner tự nhập; Owner đồng ý 20/10 để script làm thay. Sau khi nhập: Cài đặt → Dữ liệu ghi "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ" (như mốc sau #656).
3. Mở lại cùng thư mục, nối probe ngay: lệnh probe plan §L3.6 (`PERF_BASE` = mốc sau #656, `PERF_BACKUP` = file dữ liệu tải lượt 3, `PERF_OUT` = `perf\perf-ref.json`, `PERF_NOTE` `DESKTOP-KDURKJP, exe 119e2e4, deep review luot 3`, `PERF_RUNS` 5 mặc định); log `perf\perf-ref.log`. 1 passed (2,7 phút).
4. Dọn sạch Thùng rác một lần trên cùng exe (`perf\purge-exe.mjs`, kết quả `perf\purge-exe.json`, log `perf\purge-exe.log`).

### Mở app lần đầu (cách T-227, Home PC)

`perf\first-open\first-open.json`: mỗi lần chép exe vào thư mục mới `perf\first-open\run-<n>\` (chưa có `Project2C-data\`, app sinh seed demo), mở với cổng debug 9222, chờ 12 s rồi nối CDP đọc mốc trong trang; lúc gọi exe ghi bằng `Date.now()` ngoài exe. "Màn đầu có số liệu" = LCP; cả 3 lần phần tử LCP là `SPAN` (lượt 2: `H1`).

| Mốc | Lần 1 | Lần 2 | Lần 3 | Trung vị | Mốc sau #656 `dae9df3` | Lượt 2 `4217ed4` | Xấu hơn? |
|---|---:|---:|---:|---:|---|---|---|
| Gọi exe → trang bắt đầu | 400 | 346 | 345 | 346 ms | — | 377 ms | — |
| Sinh seed demo (`p2c:demo-seed`) | 2 997 | 3 009 | 2 996 | 2 997 ms | 3 060 ms (3 038–3 090) | 2 940 ms | — |
| Trang bắt đầu → mở xong dữ liệu (`p2c:data-open`) | 3 162 | 3 186 | 3 164 | 3 164 ms | 3 240 ms (3 239–3 275) | 3 113 ms | — |
| Lưu file DB lần đầu (`p2c:db-save`) | 119 | 120 | 118 | 119 ms | 119 ms | 124 ms | — |
| **Gọi exe → màn đầu có số liệu (LCP)** | 3 636 | 3 614 | 3 593 | **3 614 ms** | 3 663 ms (3 656–3 746) | 3 526 ms | ✅ không (luật nhiễu: > 4 396 ms; "không chậm hơn exe Phase 4": > 4 724 ms) |

File `project2c.db` sau lần đầu: 9 949 184 byte (bằng mốc sau #656 và lượt 2).

### Hiệu năng trên exe (probe `e2e/perf`, Home PC): so mốc sau #656

`perf\perf-ref.json` — **đây là số để so** khi reviewer đo trên exe ở máy này. Cột Nền = `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` (exe `dae9df3`, 18/10, đã gồm `integrity_check`). Cột Ngưỡng theo `docs/metrics/phase-6.md` (bảng sinh bằng `perf\tables.mjs`, dùng `parseRun` / `markdownTable` của `e2e/perf/stats.ts`; bản in của probe ở `perf\perf-ref.log`).

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 373 ms | 373 ms | 373 ms | 387 ms | −14 ms (−4%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 827 ms | 812 ms | 863 ms | 835 ms | −9 ms (−1%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 47 ms | 38 ms | 49 ms | 43 ms | +4 ms (+9%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 146 ms | 145 ms | 150 ms | 151 ms | −5 ms (−3%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 392 ms | 389 ms | 451 ms | 398 ms | −6 ms (−1%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 383 ms | 381 ms | 393 ms | 391 ms | −7 ms (−2%) | < 500 ms ✅ |
| `reload.customers` | 5 | 307 ms | 305 ms | 318 ms | 336 ms | −29 ms (−9%) | < 500 ms ✅ |
| `reload.reports` | 5 | 366 ms | 363 ms | 374 ms | 376 ms | −11 ms (−3%) | < 500 ms ✅ |
| `reload.team` | 5 | 348 ms | 345 ms | 361 ms | 355 ms | −6 ms (−2%) | < 500 ms ✅ |
| `reload.settings` | 5 | 280 ms | 279 ms | 290 ms | 283 ms | −3 ms (−1%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 8 ms | 7 ms | 10 ms | 8 ms | 0 ms (−1%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 13 ms | 13 ms | 14 ms | 12 ms | +2 ms (+16%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 14 ms | 13 ms | 14 ms | 13 ms | +1 ms (+4%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 18 ms | 17 ms | 19 ms | 17 ms | +1 ms (+4%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 18 ms | 18 ms | 24 ms | 17 ms | +1 ms (+3%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 11 ms | 13 ms | 11 ms | +1 ms (+5%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | 6 ms | +1 ms (+8%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 8 ms | 6 ms | 11 ms | 9 ms | −1 ms (−11%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 6 ms | 5 ms | 9 ms | 7 ms | −1 ms (−15%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 19 ms | 15 ms | 21 ms | 20 ms | 0 ms (−2%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 22 ms | 18 ms | 27 ms | 23 ms | −1 ms (−4%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 19 ms | 18 ms | 21 ms | 19 ms | 0 ms (−2%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 2 ms | 2 ms | 3 ms | 2 ms | +0 ms (+0%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 15 ms | 15 ms | 19 ms | 16 ms | 0 ms (−3%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 14 ms | 14 ms | 16 ms | 14 ms | +0 ms (+1%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 9 ms | 8 ms | 10 ms | 10 ms | −1 ms (−7%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | +0 ms (+1%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 15 ms | 17 ms | 17 ms | 0 ms (−2%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 6 ms | 6 ms | 17 ms | 6 ms | 0 ms (−2%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,6 MB | 16,6 MB | 16,6 MB | 16,5 MB | +0,1 MB (+1%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 38 ms | 37 ms | 42 ms | 34 ms | +4 ms (+10%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 23 ms | 21 ms | 68 ms | 20 ms | +4 ms (+19%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 425 ms | 417 ms | 438 ms | 438 ms | −14 ms (−3%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 103 ms | 98 ms | 115 ms | 101 ms | +2 ms (+2%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 106 ms | 104 ms | 108 ms | 107 ms | −1 ms (−1%) | ≤ 300 ms ✅; Năm − Tháng +3 ms ≤ 50 ms ✅ |

### So lượt 2 cùng máy (tham khảo)

Cột Nền = `perf\perf-ref-r2.json` (= `docs/metrics/phase-6-baseline/perf-home-pc-luot-2.json`, exe `4217ed4`, 17–18/10). Bảng đầy đủ: `perf\table-vs-r2.md`. Chỉ ghi dòng khác bảng trên đáng kể:

| Thao tác | Lượt 3 | Lượt 2 | Δ | Ngưỡng `phase-6.md` |
|---|---|---|---|---|
| `app.open-data` | 373 ms | 301 ms | +72 ms (+24%) ⚠️ | ≤ 600 ms ✅ |
| `reload.overview` / `appointments` / `customers` / `reports` / `team` / `settings` | 392 / 383 / 307 / 366 / 348 / 280 ms | 355 / 349 / 272 / 328 / 311 / 247 ms | +34…+38 ms (+10…+14 %), không ⚠️ | < 500 ms ✅ |
| `trash.open` | 38 ms (đã ngắt DevTools) | 73 ms (gắn DevTools) | không so được (cách đo đổi ở #689, DR6-98) | < 200 ms ✅ |
| `appointments.period-day` | 8 ms | 5 ms | +3 ms (+62%), không ⚠️ (≤ 10 ms) | < 200 ms ✅ |
| Các dòng còn lại | | | trong luật nhiễu | ✅ |

**Số liệu ghi lại, không phải kết luận** (bước chuẩn bị không ghi phát hiện; gói B / F xét nguyên nhân):

- So mốc sau #656: **không dòng nào ⚠️**; mọi thao tác trong ngưỡng `phase-6.md`; mọi thao tác màn < 200 ms.
- So lượt 2: một dòng ⚠️ (`app.open-data`, 1 mẫu). `reload.*` +34…+38 ms. Cả hai cùng hướng với chi phí `integrity_check` lúc mở (K24, ≈ +30–40 ms; mốc sau #656 ghi `reload.*` +27…+35 ms do code). Riêng `reload.customers` mốc sau #656 ghi +55 ms "chưa rõ nguyên nhân"; lần này 307 ms, thấp hơn mốc đó 29 ms.

### Dọn sạch Thùng rác trên exe (một lần, dữ liệu tải)

`perf\purge-exe.mjs`, ngay sau probe, cùng exe và thư mục `perf\run\`. Cách đo như probe T-218 với lệnh ghi và Thùng rác: nút được đánh dấu, trang tự bấm sau 1 s, probe ngắt CDP trước đó rồi nối lại đọc thời gian trang ghi.

1. Nhập lại dữ liệu tải (probe để lại vài lịch hẹn hôm nay): Nội dung "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ", `project2c.db` 14 069 760 byte.
2. `trash.open` trước khi dọn (đã ngắt DevTools, 3 lần): 38,9 / 36,8 / 64,5 ms → trung vị **38,9 ms**.
3. Hộp 11i (mở và gõ DỌN SẠCH khi đang gắn): "113 bản ghi · mọi loại, không theo bộ lọc"; KH 15 — kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI; Lịch hẹn 76, HĐ 18, Nhân sự 3, Team 1; không có dòng "Giữ lại".
4. **Bấm "Backup rồi dọn sạch" → khung hình đầu có thông báo 11j: 151,8 ms.** Lần lưu file (`p2c:db-save`) đầu tiên ghi sau cú bấm: 147,4 ms (probe chờ nó sau khung hình 11j; nó có thể kết thúc sau thông báo).
5. Thông báo 11j: "Đã dọn sạch Thùng rác — Xóa hẳn 15 KH (kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI) · 76 lịch hẹn · 18 HĐ · 3 nhân sự · 1 team. Backup: Project2C-data\backups\project2c-s00000009-20261020-001142.db". Một file backup mới đúng tên đó.
6. `project2c.db` 14 069 760 → **13 410 304 byte** (bằng số trong Node).
7. `trash.open` sau khi dọn ("Thùng rác trống", 3 lần): 9,6 / 9,3 / 9,7 ms → trung vị **9,6 ms**.
8. Nội dung Cài đặt → Dữ liệu sau khi dọn: như trước khi dọn.

Spec không đặt ngưỡng cho Dọn sạch nên chỉ ghi số (plan §L3.6). Cùng máy, cùng đường hàng đợi thay thế: `backup.import` 47 ms, `backup.export` 425 ms (bảng trên).
