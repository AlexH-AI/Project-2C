# Baseline — deep review Phase 1–6, lượt 4

- **Máy:** Home PC **`DESKTOP-KDURKJP`** (`hostname`). Bước chuẩn bị bắt đầu **29/10/2026 00:10:01 +07:00** (`Get-Date`); giờ từng bước ghi ở dưới và trong `gates\summary.txt`, `perf\run-exe.log`. Bước chuẩn bị, cả ba bên và mọi số đo của lượt 4 chạy trên máy này (plan §L4.2); số đo so với mốc **cùng máy** (plan §L4.6): mốc Home PC sau #656 (`docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`), probe lượt 3 cùng máy (`perf\perf-ref-r3.json`), và ngưỡng `docs/metrics/phase-6.md`.
- **Sổ OPEN rỗng (B2):** sau `git fetch`, mục OPEN của `docs/state/review-notes.md` ở `origin/main` (`2e51e25`) không còn mục lá nào: chỉ có đoạn rà sổ đầu mục và dòng "Theo file, gộp vào lần chạm sau cùng file (hoặc T-h nếu còn chỗ):", không dòng danh sách nào ✅.
- **SHA ghim:** **`2e51e25`** (`2e51e25eb0125f56d3d938b97ef18d6873dae076`) = `git rev-parse origin/main` lúc 29/10/2026 00:10 (#892, PR sổ của review #891, T-317). Checkout chính cũng ở `2e51e25`, sạch. Từ SHA ghim tới lúc chạy chỉ có thay đổi docs (plan §L4.2).
- **Thư mục:** `C:\workspace\deep-review-1-6-r4\` chưa có trước bước chuẩn bị ✅; đã tạo `common\`, `claude\`, `codex\`, `deepseek\` (ba thư mục sau để rỗng).
- **Mốc lượt 3:** `C:\workspace\deep-review-1-6-r3\common\perf\perf-ref.json` có, 5 155 B, sha256 `7A59FE40FCA3CAE86696F27DC3597C67F5CDBD34E67CD5D6070C864D073F8241` = plan §L4.6 ✅. Chép thành `perf\perf-ref-r3.json` (cùng sha256).
- **App WorkBuddy:** Owner xác nhận đã đăng xuất app WorkBuddy trên Home PC (29/10/2026, trong phiên chuẩn bị, trước bước 2; Phụ lục P, ranh giới tài khoản). Phiên chuẩn bị không mở app, không đọc thư mục dữ liệu của app.
- **Worktree review** (bước 3): `C:\workspace\Project-2C-review` (trước ở `e2eb1d3`) và `C:\workspace\Project-2C-review-2` (trước ở `15d27c1`) đều `checkout --detach 2e51e25`. Đã xóa `apps\desktop\dist` của `-review-2` (`Project-2C-review` không có). `apps\desktop\src-tauri\target\` **chưa có** ở cả hai worktree ✅ (review #878: thư mục do `pnpm build:exe` ở bước 6 sinh ra là mục mới, đợt 2 bước 1 xóa cả). `pnpm install --frozen-lockfile` (pnpm 12.6.0) qua ở cả hai, lockfile không đổi. `git status --short` **rỗng ở cả hai**; lần này `-review-2` không có file Codex tự sinh (lượt 3 có `.agents/`, `.codex/`, `AGENTS.md`). Bundle và exe dưới đây dựng ở `Project-2C-review`, không biến môi trường riêng; `apps\desktop\dist` của `-review-2` chưa dựng.
- **File chung** (bước 4; dựng bằng script từ `git cat-file blob 2e51e25:…` và `gh … --json`, không chép tay):
  - `plan.md`: bản ở `2e51e25`, trùng byte (sha256 `D3483D2473B290D54CEF83BA3B0154CFD07A0329785D674A53ABF4B7C671FD51`), 3 063 dòng.
  - `prompt-claude.md` = Phụ lục L + Phụ lục N; `prompt-codex.md` = Phụ lục M + Phụ lục N; `prompt-deepseek.md` = Phụ lục O + Phụ lục N. Khối trích dẫn chép nguyên văn, bỏ dấu `> ` như bản lượt 3 (đã đối chiếu: dựng lại `prompt-codex.md` lượt 3 từ Phụ lục J + K của `plan.md` lượt 3 thì chỉ khác dòng `<bên>` / `<ID>` mà lượt 3 chèn tay; lượt 4 có sẵn dòng đó trong Phụ lục L, M, O). Chỉ thay `{SHA}` → `2e51e25` (6 chỗ) và `{SHA_ĐỦ}` → 40 ký tự (1 chỗ) mỗi file; `{GÓI}`, `<bên>`, `<ID>` để nguyên; không còn `{SHA`.
  - `dot2.mjs`: khối `js` của mục "Script đợt 2" ở Phụ lục P (`plan.md` dòng 2713–3040), nguyên văn, 328 dòng; `node --check` qua.
  - `known.md` (§L4.5, dựng mới ở SHA ghim, 274 dòng): (1) OPEN (rỗng, giữ đoạn đầu mục) và ACCEPTED nguyên văn của `review-notes.md`; (2) K1–K40, K12 / K13 / K17 theo chữ §L4.5, K14 theo §L3.5, K21 thêm ngoặc "(Q6 lượt 1; đợt G5 lượt 2: K28; đợt G5 lượt 3: K31)"; (3) "Lệch mockup đã biết" của `nghiem-thu-v1.md` nguyên văn; (4) bảng R1 37 dòng và danh sách KNOWN của §L4.5 nguyên văn; (5) bảng R2 của §L4.5 thêm **năm dòng**: T-310, T-311, T-312, T-314, T-316 (Issue của đợt sửa mục OPEN có PR sửa code, e2e hay tài liệu đối chiếu với app; cột "Gói kiểm" theo `classifyFile` trên file của PR). T-313, T-315, T-317 chỉ sửa quy trình (kế hoạch lượt 4, ADR-0001, `PROJECT-STATE.md`, `CLAUDE.md`, mục review của spec Phase 6) nên không có dòng, như T-279 (K17). Đếm R2: **32 dòng**.
  - `fixes.md`: thân **49 Issue** (15 của đợt sửa lượt 3, 22 của đợt sổ OPEN, T-305…T-308, và tám Issue T-310…T-317 của đợt sửa mục OPEN trước lượt 4) và **55 PR** của chúng, nguyên văn, tiêu đề trong thân hạ hai cấp như lượt 3; sau thân PR là **49 nhóm RESOLVED** của sổ ở SHA ghim theo nhãn T-xxx (T-279, T-282, T-308 không có nhóm nào). Kiểm khi dựng: Issue đều CLOSED, PR đều MERGED, commit merge của mỗi PR có trong bảng §L4.2 và nằm trong lịch sử của `2e51e25`. File lớn (10 765 dòng, ≈ 1,05 MB): đọc theo tiêu đề `# Issue #…` / `## PR #…` / `## Nhóm RESOLVED…`.
  - **`fixes.md` có 5 dòng khớp mẫu `MARKER` của `dot2.mjs`**, đều trong thân PR #878 (T-314): script thử `scan` của PR đó gieo chuỗi mẫu giả vào cây thử. File ghi trước `dot2-baseline.json` nên `scan` bỏ qua nó. **Không sửa `fixes.md` sau mốc**: sửa thì `scan` đọc lại file và dừng vì các dòng đó. Các file chung khác không có dòng nào khớp mẫu; ghi chú sổ thêm sau SHA ghim (chỉ PR docs, trước đợt 1) vẫn ghi vào đầu `known.md` như plan §L4.5 phần 1. Nếu `scan` ở đợt 2 báo một chỗ khác có các dòng đó, xem chỗ đó trước khi kết luận là bản sao báo cáo lượt 4.
- **Mốc đợt 2** (cuối bước 4): `node C:\workspace\deep-review-1-6-r4\common\dot2.mjs baseline` lúc **29/10/2026 00:26:29 +07:00**, sau khi mọi file chung trên đã ghi và trước mọi lệnh ghi vào worktree của bước 5–7. `common\dot2-baseline.json`: `Project-2C-review` 39 mục (`.claude\scheduled_tasks.lock`, `.claude\settings.local.json`, `apps\desktop\src-tauri\gen\schemas\` 4 file, `packages\domain\coverage\` báo cáo coverage cũ có sẵn); `Project-2C-review-2` 8 mục (`apps\desktop\src-tauri\gen\schemas\` 4 file, `test-results\.last-run.json`). Giờ ghi file là mốc thời gian của `scan`.
- Log đầy đủ của từng cổng: `gates\*.log`; tóm tắt `gates\summary.txt`.

## Dữ liệu tải (bước 5)

`common\load\load-2026-10-12-seed6.p2cbackup` (`node tools/load-data.mjs --out …` ở SHA ghim, trong `Project-2C-review`, mốc `2026-10-12`, seed `6`, 7,6 s; `gates\load-data.log`): 1 496 KH, 10 414 lịch hẹn, 1 510 `appointment_coordinators`, 54 nhân sự, 5 team, 1 697 hợp đồng, 103 `ai_analyses`, 5 672 `kyc_notes`, 13 114 `kyc_versions`, 13 833 `kyc_facts`, 4 941 `stage_transitions`, 0 `settings`; 15,3 MB. **`tables` sha256 `ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25` = plan §L4.6 (`a59ef07`) ✅**: đợt sửa mục OPEN không đổi dữ liệu. Khác `1c0a43fb…746d003f` của lượt 3, cùng số dòng (gói F giải thích theo bảng / cột, plan §L4.4).

## Cổng ở SHA ghim (bước 6; `Project-2C-review`, 29/10/2026)

| Cổng | Kết quả | Thời gian |
|---|---|---|
| `pnpm verify` | ✅ 125 file test, **3 975 test**; `lint:deps`: no dependency violations (341 module, 1 435 dependency); token-guard, `codemap:check`, typecheck sạch; coverage Stmts 99.18 % · Branch 97.27 % · Funcs 99.17 % · Lines 99.35 % (lượt 3: 99.05 / 97.04 / 98.97 / 99.28) | 145 s (bắt đầu 00:27:47) |
| `pnpm verify:rust` | ✅ fmt + clippy `-D warnings` sạch; **116 test** Rust (lượt 3: 104); `target\` dựng từ đầu | 88 s (00:30:12) |
| `pnpm e2e` (`CI=1`) | ✅ exit 0: **308 passed**, không flaky, không chạy lại (12 worker; lượt 3: 245 passed + 2 flaky qua nửa đêm) | 166 s (00:31:40 → 00:34:26) |
| `pnpm build:exe` (không đặt `CI`) | ✅ (lần 2) `project2c.exe` release **5 649 408 byte** (Δ +240 640 so lượt 3 `119e2e4`; +235 008 so `b139d8a`), sha256 `8E841182F6A13F7CC7BC62099536B9A467FA861F4DBEE6CC3C97B6CAAF0B9147` → `common\exe\project2c.exe`. Build cục bộ, nên sha256 khác exe của CI. **Lần 1** (00:34:26) dừng sau 0,4 s: script chạy cổng của bước chuẩn bị để lại biến `CI` rỗng cho tiến trình con, và Tauri CLI đọc `CI` thành cờ `--ci` ("a value is required for '--ci' but none was supplied"). Đây là lỗi của script chuẩn bị, không phải của repo; lần 2 gỡ hẳn `CI` khỏi môi trường. Log lần 1: `gates\build-exe-1-ci-rong.log` | 110 s (lần 2, 00:35:05; cargo `release` dựng từ đầu) |
| `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` | ✅ (lần 2, sau khi có exe; lần 1 chạy khi chưa có exe: `gates\size-report-1-chua-co-exe.log`). Không còn dòng "Chưa xếp gói" (dưới) | 0,3 s (00:36:55) |

`git status --short` của `Project-2C-review` sau cổng: rỗng. Mọi thứ cổng sinh ra trong worktree (`dist`, `target\`, `test-results\`, coverage, cache) nằm ngoài `dot2-baseline.json` hoặc là file có sẵn được ghi đè, nên đợt 2 bước 1 (`dot2.mjs clean`) xử lý.

### Bundle web (`pnpm build:web` trong `build:exe`; cột Δ so `b139d8a` theo `size-report`, cột cuối Δ so lượt 3 `119e2e4`)

| File | Thô (byte) | Δ `b139d8a` | Gzip (byte) | Δ `b139d8a` | Δ lượt 3 (thô / gzip) |
|---|---:|---:|---:|---:|---|
| `assets/chart.js` | 513 302 | 0 | 172 450 | 0 | 0 / 0 |
| `assets/exceljs.min.js` | 929 569 | 0 | 255 572 | 0 | 0 / 0 |
| `assets/index.js` | 884 698 | −7 244 | 261 767 | −243 | −43 234 / −9 895 |
| `assets/index.css` | 29 752 | +1 388 | 6 718 | +306 | +1 268 / +275 |
| `assets/rolldown-runtime.js` | 1 106 | 0 | 627 | 0 | 0 / 0 |
| **Tổng JS / CSS** | 2 358 427 | −5 856 | 697 134 | +63 | −41 966 / −9 620 |
| Tệp khác (19 file: wasm, font, ảnh, `index.html`) | 1 022 121 | +172 925 | — | — | +172 925 (lượt 3: 15 file, 849 196) |

### Cỡ bundle và exe, tách phần T-308 và `zod/mini` (plan §L4.6; `gates\bundle-split.log`)

- **JS `assets/index-*.js`:** 884 698 B, −43 234 B so lượt 3 (927 932 B). Phần `zod/mini` theo số #830 đo lúc merge: 940 771 → 878 036 B (bản min, −62 735 B). Một lần build không cho số riêng của `zod`, nên bước chuẩn bị không tách lại.
- **CSS `assets/index-*.css`:** 29 752 B, +1 268 B so lượt 3.
- **Font** `playfair-display-latin-400-italic-*.woff2`: 21 884 B trong `dist` (= bản trong repo).
- **Ba ảnh logo:** `heritas-tree-*.png` 92 185 + `heritas-wordmark-*.png` 44 834 + `heritas-lcrm-*.png` 12 051 = **149 070 B** (= bản trong repo).
- **Favicon** `32x32-*.png`: 2 465 B (lượt 3: `favicon.svg` 494 B, bản sao `app-icon.svg`).
- **Tệp khác** +172 925 B so lượt 3 = font + ba logo + favicon PNG − `favicon.svg` (21 884 + 149 070 + 2 465 − 494); wasm và 12 file font Be Vietnam Pro không đổi.
- **Exe** 5 649 408 B, +240 640 B so lượt 3 (5 408 768 B). Trong đó icon nhúng vào exe: `apps/desktop/src-tauri/icons/icon.ico` 16 625 → **87 968 B** (+71 343). Phần còn lại (+169 297 B) là asset web nhúng (bảng trên) và code Rust; bước chuẩn bị không tách thêm.

### Coverage theo vùng (chỉ dòng < 100 %; `gates\verify.log`)

| Vùng | Stmts | Branch | Funcs | Lines | Lượt 3 (Stmts / Branch / Funcs / Lines) |
|---|---:|---:|---:|---:|---|
| `apps/desktop/src/data` | 98.5 | 96.49 | 97.38 | 98.98 | 97.72 / 95.27 / 96.05 / 98.65 |
| `apps/desktop/src/routes` (gốc) | 99.57 | 94.67 | 100 | 100 | 99.52 / 94.04 / 100 / 100 |
| `routes/appointments` | 99.59 | 93.58 | 100 | 99.49 | 99.59 / 93.44 / 100 / 99.49 |
| `routes/customers` | 98.91 | 97.46 | 99.21 | 99.34 | 98.76 / 97.75 / 99.09 / 99.25 |
| `routes/overview` | 98.5 | 94.26 | 98.63 | 98.77 | 98.26 / 93.95 / 98.27 / 98.6 |
| `routes/reports` | 100 | 93.63 | 100 | 100 | 100 / 93.45 / 100 / 100 |
| `apps/desktop/src/shell` | 83.47 | 92.23 | 82.5 | 83.5 | như lượt 3 |
| `packages/db/src` | 99.6 | 97.74 | 100 | 99.8 | 99.58 / 97.67 / 100 / 99.79 |

Vùng không có trong bảng: 100 % (vitest `skipFull`). `packages/ui/src` và `packages/ui/src/components` (lượt 3: Branch 90.9 và 95) nay 100 %.

### Cỡ dòng theo gói và diff sửa (plan §L4.3 ở SHA ghim)

`gates\size-report.log` (số dòng, Δ so lượt 3 theo `baseline.md` lượt 3) và `gates\diff-119e2e4-2e51e25.log` (diff sửa = `git diff --numstat 119e2e4 2e51e25` ngoài `docs/**` và mọi file `*.md`, xếp gói bằng `classifyFile`, không tính file sinh; cách đếm khớp đúng bảng §L4.3 khi chạy lại ở `a59ef07`). Cột R1 / R2 theo §L4.3; Issue in đậm là dòng R2 thêm ở bước chuẩn bị (`known.md` phần 5).

| Gói | SP (Δ lượt 3) | Test (Δ) | Sinh (Δ) | File (Δ) | Diff sửa SP | Diff sửa test | R1 (mã DR6, mục KNOWN đã sửa) | R2 (Issue) |
|---|---:|---:|---:|---:|---|---|---|---|
| A. Lõi dữ liệu | 8 719 (+530) | 15 714 (+1 829) | 341 (+2) | 104 (+3) | +1 117 / −587 · 29 file | +2 116 / −287 · 25 file | 104–108, 110–114, 125, 126, 132 (b), 134, 25, 66, 67, CL3-A29 | T-285, 286, 287, 288, 291, 292 |
| B. File và Rust | 2 426 (+219) | 5 422 (+612) | 0 (0) | 19 (0) | +740 / −218 · 7 file | +376 / −67 · 4 file | 120, 67, CL3-B2 | T-293, 294, 295, 306, 308, **310** |
| C. AI | 6 027 (+670) | 7 539 (+1 075) | 0 (0) | 63 (+3) | +1 290 / −620 · 28 file | +1 232 / −157 · 16 file | 108, 111, 118, 121–124, 133, 25, 66, 67 | T-288, 289, 290, 291, 292, 295, 297, 304 |
| D. Màn nhập liệu | 7 999 (+670) | 2 820 (+655) | 0 (0) | 87 (+11) | +1 121 / −451 · 37 file | +697 / −42 · 13 file | 109, 110, 115–117, 120, 127, 132 (a), 37, 66, 67, CL3-B2 | T-280, 284, 287, 291, 293, 294, 297–301, 303, 305, 308, **310, 311** |
| E. Lịch hẹn, chỉ số, quản lý | 8 155 (+399) | 4 556 (+410) | 0 (0) | 52 (+1) | +978 / −579 · 29 file | +456 / −46 · 9 file | 110, 119, 128, 131, 134, 37, 66, 67, CL3-B2 | T-284, 291, 295, 296, 298, 299, 301, 305, 306, **310** |
| F. Xuyên gói / công cụ | 4 440 (+100) | 16 860 (+2 695) | 4 628 (0) | 96 (+5) | +152 / −52 · 7 file | +2 967 / −272 · 46 file | 129, 130, 25 (bundle), 66, 67, CL3-A29 (đo); **R1 gộp đủ 37 dòng** | T-283, 287 (đo), 292 (bundle), 300, 301, 302, 304, 305, 307, **310, 311, 312, 314, 316**; **R2 gộp đủ mọi dòng** |
| **Tổng** | 37 766 (+2 588) | 52 911 (+7 276) | 4 969 (+2) | 421 (+23) | | | | |

- **Không còn dòng "Chưa xếp gói":** T-310 (#871) đã thêm năm file mới vào `PACKAGES` của `tools/size-report-core.mjs`, đúng như §L4.3 xếp tay: D nhận `classes.ts`, `stage-badge.tsx`, `money-view.ts` (+ `money-view.test.ts`), E nhận `ConfirmWordDialog.tsx`. Phần xếp tay của §L4.3 không cần nữa.
- **So lúc soạn (`a59ef07`):** đợt sửa mục OPEN đổi 13 file code, +95 / −39 (T-310 #871, T-312 #882, T-314 #878, T-316 #888): B test +14; D SP +5; E SP −5; F SP +11, test +31.
- **Diff sửa `119e2e4..2e51e25`** ngoài `docs/**` và mọi file `*.md`: **271 file, +14 631 / −3 399** (lúc soạn 269, +14 559 / −3 383); 12 file nhị phân; một file sinh (`packages/db/migrations/0012_trash_lookups.sql`, +2); 20 file không đếm dòng, +1 387 / −21 (icon, font, ảnh logo, `tauri.conf.json`, `Cargo.toml`, `capabilities/default.json`, snapshot / journal của drizzle-kit; như lúc soạn).

## Dọn sạch Thùng rác trong Node (bước 7; plan §L4.6)

Script `perf\purge-node.mjs` (chép từ lượt 3, không đổi; kết quả `perf\purge-node.json`, log `perf\purge-node.log`), chạy 29/10 00:37:04 → 00:37:16, ngay trước phần đo trên exe, máy rảnh (Owner đồng ý). Node `v24.20.0`, `@p2c/db` của `Project-2C-review` (qua `tools/ts-hooks.mjs`), không persist. Mỗi lần: `importBackup` file dữ liệu tải (mới, vì dọn là xóa hẳn); cỡ lớn thì thêm `softDeleteCustomer` cho 1 200 KH đang dùng đầu tiên theo `id`; rồi đo `listTrash` → `previewPurge` → `purgeTrash` (VACUUM bên trong đo riêng bằng cách bọc `sqlite.run` của chính handle đó, không sửa repo) → `db.export()` → `listTrash`. 5 lần mỗi cỡ; trung vị (min–max), ms; cột lượt 3 là trung vị của lượt 3 cùng máy.

| Đo | Dữ liệu tải: 113 dòng Thùng rác | Lượt 3 | Thùng rác lớn: 1 313 dòng (+1 200 KH xóa) | Lượt 3 |
|---|---|---:|---|---:|
| `listTrash` trước khi dọn | 23,8 (23,7–36,0) | 32,6 | 158,2 (136,6–214,5) | 140,7 |
| `previewPurge` | 1,0 (0,9–1,1) | 5,6 | 7,4 (6,0–9,8) | 9,9 |
| `purgeTrash` cả `VACUUM` | 85,2 (83,7–90,8) | 93,8 | 129,8 (123,6–192,8) | 109,8 |
| — trong đó phần transaction (không `VACUUM`) | 21,8 (21,2–25,9) | 29,4 | 125,1 (119,1–185,5) | 105,3 |
| — trong đó `VACUUM` | 62,9 (62,0–65,1) | 64,4 | 4,7 (4,6–7,2) | 5,0 |
| `db.export()` sau khi dọn | 2,1 (2,0–2,2) | 2,1 | 0,5 (0,3–0,6) | 0,4 |
| `listTrash` sau khi dọn | 2,1 (2,0–2,2) | 10,8 | 0,6 (0,6–1,1) | 2,1 |
| Dòng Thùng rác trước → sau; giữ lại | 113 → 0; giữ 0 | 113 → 0 | 1 313 → 0; giữ 0 | 1 313 → 0 |
| Cỡ file (`export()`) trước → sau | 14 102 528 → 13 438 976 byte (−4,7 %) | 14 069 760 → 13 410 304 | 14 151 680 → 1 495 040 byte (−89,4 %) | 14 118 912 → 1 486 848 |

Số liệu ghi lại, không phải kết luận (bước chuẩn bị không ghi phát hiện; gói A / F xét): cỡ dữ liệu tải nhanh hơn lượt 3 ở mọi dòng; cỡ lớn chậm hơn ở `listTrash` (+17,5 ms, +12 %) và `purgeTrash` (+20,0 ms, +18 %), với lần 4 lệch xa (214,5 / 192,8 ms). Cả hai cỡ không có bản ghi nào bị giữ lại (TR-12).

## Đo trên exe (bước 7; 29/10/2026 00:37:16 → 00:41:45)

`perf\run-perf.ps1` (00:37:04 → 00:41:45) chạy `perf\purge-node.mjs` (trên) rồi `perf\run-exe.ps1` (chép từ lượt 3, chỉ đổi thư mục `-r4`, ghi chú probe và số mục kế hoạch; log `perf\run-exe.log`): bốn việc liền nhau trên `common\exe\project2c.exe`, cổng debug 9222. Owner đồng ý để máy rảnh lúc đo (không dùng máy, cửa sổ exe trên cùng); không phiên review nào chạy; không bước nào báo "no frame painted". Tiến trình nền có mặt: app Codex (rảnh), app desktop Claude (phiên chuẩn bị này chờ, không chạy lệnh).

1. Mở app lần đầu 3 lần (`perf\first-open.mjs`, chép từ lượt 3, không đổi).
2. `perf\run\`: chép exe, mở (thư mục trống, app sinh seed demo), nhập dữ liệu tải qua cổng debug bằng `perf\import-load.mjs` (chép từ lượt 3 theo plan §L4.9 bước 7; nhãn "Backup rồi thay dữ liệu", "Đã nhập backup" vẫn đúng ở `2e51e25`), đóng exe. Sau khi nhập, Cài đặt → Dữ liệu ghi "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ" (như lượt 3).
3. Mở lại cùng thư mục, nối probe ngay: lệnh probe plan §L4.6 (`PERF_BASE` = mốc sau #656, `PERF_BACKUP` = file dữ liệu tải lượt 4, `PERF_OUT` = `perf\perf-ref.json`, `PERF_NOTE` `DESKTOP-KDURKJP, exe 2e51e25, deep review luot 4`, `PERF_RUNS` 5 mặc định); log `perf\perf-ref.log`. 1 passed (2,7 phút).
4. Dọn sạch Thùng rác một lần trên cùng exe (`perf\purge-exe.mjs`, chép từ lượt 3; nhãn 11h–11j ở `2e51e25` khớp `e2e/trash.spec.ts`; kết quả `perf\purge-exe.json`, log `perf\purge-exe.log`).

### Mở app lần đầu (cách T-227, Home PC)

`perf\first-open\first-open.json`: mỗi lần chép exe vào thư mục mới `perf\first-open\run-<n>\` (chưa có `Project2C-data\`, app sinh seed demo), mở với cổng debug 9222, chờ 12 s rồi nối CDP đọc mốc trong trang; lúc gọi exe ghi bằng `Date.now()` ngoài exe. "Màn đầu có số liệu" = LCP; cả 3 lần phần tử LCP là `P` (lượt 3: `SPAN`; lượt 2: `H1`).

| Mốc | Lần 1 | Lần 2 | Lần 3 | Trung vị | Mốc sau #656 `dae9df3` | Lượt 3 `119e2e4` | Xấu hơn? |
|---|---:|---:|---:|---:|---|---|---|
| Gọi exe → trang bắt đầu | 495 | 397 | 369 | 397 ms | — | 346 ms | — |
| Sinh seed demo (`p2c:demo-seed`) | 2 870 | 2 904 | 2 848 | 2 870 ms | 3 060 ms (3 038–3 090) | 2 997 ms | — |
| Trang bắt đầu → mở xong dữ liệu (`p2c:data-open`) | 3 043 | 3 082 | 3 014 | 3 043 ms | 3 240 ms (3 239–3 275) | 3 164 ms | — |
| Lưu file DB lần đầu (`p2c:db-save`) | 119 | 125 | 112 | 119 ms | 119 ms | 119 ms | — |
| **Gọi exe → màn đầu có số liệu (LCP)** | 3 583 | 3 521 | 3 437 | **3 521 ms** | 3 663 ms (3 656–3 746) | 3 614 ms | ✅ không (luật nhiễu: > 4 396 ms; "không chậm hơn exe Phase 4": > 4 724 ms) |

File `project2c.db` sau lần đầu: 9 969 664 byte (mốc sau #656 và lượt 3: 9 949 184; +20 480 byte, 5 trang 4 KiB).

### Hiệu năng trên exe (probe `e2e/perf`, Home PC): so mốc sau #656

`perf\perf-ref.json` — **đây là số để so** khi reviewer đo trên exe ở máy này. Cột Nền = `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` (exe `dae9df3`, 18/10, đã gồm `integrity_check`). Cột Ngưỡng theo `docs/metrics/phase-6.md` (bảng sinh bằng `perf\tables.mjs`, dùng `parseRun` / `markdownTable` của `e2e/perf/stats.ts`; bản ghi file: `perf\table-vs-656.md`; bản in của probe: `perf\perf-ref.log`).

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 370 ms | 370 ms | 370 ms | 387 ms | −17 ms (−4%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 977 ms | 958 ms | 1011 ms | 835 ms | +142 ms (+17%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 47 ms | 37 ms | 51 ms | 43 ms | +5 ms (+11%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 149 ms | 146 ms | 158 ms | 151 ms | −2 ms (−2%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 405 ms | 402 ms | 465 ms | 398 ms | +7 ms (+2%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 393 ms | 390 ms | 401 ms | 391 ms | +2 ms (+1%) | < 500 ms ✅ |
| `reload.customers` | 5 | 317 ms | 314 ms | 320 ms | 336 ms | −19 ms (−6%) | < 500 ms ✅ |
| `reload.reports` | 5 | 373 ms | 369 ms | 391 ms | 376 ms | −4 ms (−1%) | < 500 ms ✅ |
| `reload.team` | 5 | 359 ms | 356 ms | 368 ms | 355 ms | +5 ms (+1%) | < 500 ms ✅ |
| `reload.settings` | 5 | 279 ms | 279 ms | 301 ms | 283 ms | −4 ms (−1%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 7 ms | 6 ms | 11 ms | 8 ms | −1 ms (−16%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 13 ms | 12 ms | 13 ms | 12 ms | +1 ms (+9%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 11 ms | 10 ms | 11 ms | 13 ms | −3 ms (−20%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 17 ms | 17 ms | 19 ms | 17 ms | +0 ms (+2%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 17 ms | 16 ms | 21 ms | 17 ms | 0 ms (−1%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 11 ms | 11 ms | 13 ms | 11 ms | 0 ms (−2%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 7 ms | 6 ms | 9 ms | 6 ms | +1 ms (+10%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 9 ms | 8 ms | 11 ms | 9 ms | +0 ms (+1%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 7 ms | 5 ms | 8 ms | 7 ms | 0 ms (−3%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 19 ms | 13 ms | 26 ms | 20 ms | 0 ms (−1%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 24 ms | 23 ms | 24 ms | 23 ms | +1 ms (+5%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 22 ms | 19 ms | +1 ms (+5%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 2 ms | 2 ms | 11 ms | 2 ms | +0 ms (+15%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 17 ms | 16 ms | 23 ms | 16 ms | +2 ms (+10%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 17 ms | 16 ms | 20 ms | 14 ms | +3 ms (+20%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | 0 ms (−5%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | +0 ms (+4%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | 17 ms | 0 ms (−1%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 6 ms | 6 ms | 8 ms | 6 ms | +0 ms (+5%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,6 MB | 16,6 MB | 16,6 MB | 16,5 MB | +0,1 MB (+1%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 32 ms | 31 ms | 38 ms | 34 ms | −2 ms (−6%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 29 ms | 23 ms | 67 ms | 20 ms | +9 ms (+47%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 436 ms | 420 ms | 454 ms | 438 ms | −3 ms (−1%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 108 ms | 105 ms | 112 ms | 101 ms | +8 ms (+8%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 113 ms | 112 ms | 130 ms | 107 ms | +6 ms (+6%) | ≤ 300 ms ✅; Năm − Tháng +5 ms ≤ 50 ms ✅ |

### So lượt 3 cùng máy (tham khảo)

Cột Nền = `perf\perf-ref-r3.json` (= `deep-review-1-6-r3\common\perf\perf-ref.json`, exe `119e2e4`, 20/10). Bảng sinh bằng `perf\tables.mjs` như trên; bản ghi file: `perf\table-vs-r3.md`.

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 370 ms | 370 ms | 370 ms | 373 ms | −3 ms (−1%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 977 ms | 958 ms | 1011 ms | 827 ms | +151 ms (+18%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 47 ms | 37 ms | 51 ms | 47 ms | +1 ms (+2%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 149 ms | 146 ms | 158 ms | 146 ms | +2 ms (+2%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 405 ms | 402 ms | 465 ms | 392 ms | +13 ms (+3%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 393 ms | 390 ms | 401 ms | 383 ms | +10 ms (+3%) | < 500 ms ✅ |
| `reload.customers` | 5 | 317 ms | 314 ms | 320 ms | 307 ms | +10 ms (+3%) | < 500 ms ✅ |
| `reload.reports` | 5 | 373 ms | 369 ms | 391 ms | 366 ms | +7 ms (+2%) | < 500 ms ✅ |
| `reload.team` | 5 | 359 ms | 356 ms | 368 ms | 348 ms | +11 ms (+3%) | < 500 ms ✅ |
| `reload.settings` | 5 | 279 ms | 279 ms | 301 ms | 280 ms | −1 ms (+0%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 7 ms | 6 ms | 11 ms | 8 ms | −1 ms (−15%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 13 ms | 12 ms | 13 ms | 13 ms | −1 ms (−5%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 11 ms | 10 ms | 11 ms | 14 ms | −3 ms (−23%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 17 ms | 17 ms | 19 ms | 18 ms | 0 ms (−2%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 17 ms | 16 ms | 21 ms | 18 ms | −1 ms (−3%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 11 ms | 11 ms | 13 ms | 12 ms | −1 ms (−7%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 7 ms | 6 ms | 9 ms | 6 ms | +0 ms (+2%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 9 ms | 8 ms | 11 ms | 8 ms | +1 ms (+13%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 7 ms | 5 ms | 8 ms | 6 ms | +1 ms (+15%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 19 ms | 13 ms | 26 ms | 19 ms | +0 ms (+1%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 24 ms | 23 ms | 24 ms | 22 ms | +2 ms (+10%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 22 ms | 19 ms | +1 ms (+7%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 2 ms | 2 ms | 11 ms | 2 ms | +0 ms (+15%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 17 ms | 16 ms | 23 ms | 15 ms | +2 ms (+13%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 17 ms | 16 ms | 20 ms | 14 ms | +3 ms (+20%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | 9 ms | +0 ms (+2%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | +0 ms (+3%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | 17 ms | +0 ms (+1%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 6 ms | 6 ms | 8 ms | 6 ms | +0 ms (+7%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,6 MB | 16,6 MB | 16,6 MB | 16,6 MB | +0,0 MB (+0%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 32 ms | 31 ms | 38 ms | 38 ms | −6 ms (−15%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 29 ms | 23 ms | 67 ms | 23 ms | +6 ms (+24%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 436 ms | 420 ms | 454 ms | 425 ms | +11 ms (+3%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 108 ms | 105 ms | 112 ms | 103 ms | +5 ms (+5%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 113 ms | 112 ms | 130 ms | 106 ms | +7 ms (+7%) | ≤ 300 ms ✅; Năm − Tháng +5 ms ≤ 50 ms ✅ |

**Số liệu ghi lại, không phải kết luận** (bước chuẩn bị không ghi phát hiện; gói B / F xét nguyên nhân):

- So mốc sau #656: **không dòng nào ⚠️**; mọi thao tác trong ngưỡng `phase-6.md`; mọi thao tác màn < 200 ms. `backup.read` (chọn file → hộp xác nhận) 977 ms, +142 ms (+17 %): dưới luật nhiễu (quá 20 % và quá 10 ms) nhưng gần. `reports.export-excel` +9 ms (+47 %): dưới 10 ms.
- So lượt 3: **không dòng nào ⚠️**. `backup.read` +151 ms (+18 %), cũng gần luật nhiễu; `reload.*` +7…+13 ms (+2…+3 %); `trash.open` 32 ms (−6 ms).

### Dọn sạch Thùng rác trên exe (một lần, dữ liệu tải)

`perf\purge-exe.mjs`, ngay sau probe, cùng exe và thư mục `perf\run\`. Cách đo như probe T-218 với lệnh ghi và Thùng rác: nút được đánh dấu, trang tự bấm sau 1 s, probe ngắt CDP trước đó rồi nối lại đọc thời gian trang ghi.

1. Nhập lại dữ liệu tải (probe để lại vài lịch hẹn hôm nay): Nội dung "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ", `project2c.db` 14 102 528 byte (lượt 3: 14 069 760).
2. `trash.open` trước khi dọn (đã ngắt DevTools, 3 lần): 32,4 / 35,8 / 34,1 ms → trung vị **34,1 ms** (lượt 3: 38,9).
3. Hộp 11i (mở và gõ DỌN SẠCH khi đang gắn): "113 bản ghi · mọi loại, không theo bộ lọc"; KH 15 — kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI; Lịch hẹn 76, HĐ 18, Nhân sự 3, Team 1; không có dòng "Giữ lại"; câu backup nêu `Project2C-data\backups\`; ô "Gõ DỌN SẠCH để xác nhận"; nút "Hủy", "Backup rồi dọn sạch".
4. **Bấm "Backup rồi dọn sạch" → khung hình đầu có thông báo 11j: 123,3 ms ≤ 500 ms ✅** (ngưỡng Owner 21/10, K30 Q6 (a); lượt 3: 151,8 ms). Lần lưu file (`p2c:db-save`) đầu tiên ghi sau cú bấm: 146,0 ms (lượt 3: 147,4; probe chờ nó sau khung hình 11j).
5. Thông báo 11j: "Đã dọn sạch Thùng rác — Xóa hẳn 15 KH (kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI) · 76 lịch hẹn · 18 HĐ · 3 nhân sự · 1 team. Backup: Project2C-data\backups\project2c-s00000009-20261029-004128.db". Một file backup mới đúng tên đó.
6. `project2c.db` 14 102 528 → **13 438 976 byte** (bằng số trong Node).
7. `trash.open` sau khi dọn ("Thùng rác trống", 3 lần): 2,0 / 1,9 / 2,0 ms → trung vị **2,0 ms** (lượt 3: 9,6).
8. Nội dung Cài đặt → Dữ liệu sau khi dọn: như trước khi dọn.

## Đợt 2 (DeepSeek): Owner và phiên thử ghi dưới đây

Bước chuẩn bị không mở app WorkBuddy. Theo plan §L4.9 đợt 2, Owner ghi ở đây: số bản app (About) và cài đặt app (bước 4), số mục Memory còn lại sau khi dọn, chế độ quyền đã chọn, kết quả phiên thử dưới một đề mục riêng của task đó (bước 5; mỗi lần đọc thử mục bị chặn chỉ ghi việc đã làm, kết quả và thông báo lỗi, không chép nội dung), file app tự tạo trong worktree (nếu có), số mục Memory đã xóa trước gói A, các dòng `accepted` mà `scan` in ra.

### Phiên thử — task 1, Default, 2026-10-29 22:11 (+07:00)

- Việc 1 — `pwd` bằng **Git Bash** (Bash tool): `/c/workspace/Project-2C-review`; shell chạy lệnh: Git Bash.
- Việc 2 — Read (công cụ đọc file của app), 5 dòng đầu `common\plan.md`: **đọc được**.
- Việc 3 — `node node_modules/vitest/vitest.mjs run packages/domain` (Git Bash, trong `Project-2C-review`): **xanh** — 21 file test, **804 test passed**, exit 0, 1,35 s.
- Việc 4 — Read `common\dot2-acl.json`: **không đọc được**; lỗi nguyên văn: "File does not exist. Did you mean ..\deep-review-1-6-r4\common\dot2-baseline.json?". Shell `statSync`: `ENOENT` — file không tồn tại, nên không có danh sách mục bị chặn; các mục lấy đường dẫn từ danh sách (f, g, h, k, l) ghi "không có trong danh sách".
- Việc 4a (shell) — `node -e readdirSync` thư mục `deep-review-1-6-r4\claude`: **đọc được**.
- Việc 4a (app) — Glob `*`, limit 1, cùng thư mục: **đọc được**.
- Việc 4b (shell) — `readdirSync` thư mục `deep-review-1-6-r4\codex`: **đọc được**.
- Việc 4b (app) — Glob `*`, limit 1: **đọc được**.
- Việc 4c (shell) — `readdirSync` `deep-review-1-6-r3`: **đọc được**.
- Việc 4c (app) — Glob `*`, limit 1: **đọc được**.
- Việc 4d (shell) — `readdirSync` `deep-review-1-6-r2`: **đọc được**.
- Việc 4d (app) — Glob `*`, limit 1: **đọc được**.
- Việc 4e (shell) — `readdirSync` `deep-review-1-6`: **đọc được**.
- Việc 4e (app) — Glob `*`, limit 1: **đọc được**.
- Việc 4f — không có trong danh sách, không thử.
- Việc 4g — không có trong danh sách, không thử.
- Việc 4h — không có trong danh sách, không thử.
- Việc 4i (shell) — `openSync` file `deep-review-1-6-r4\claude\A.md`: **đọc được**.
- Việc 4i (app) — Read 1 dòng cùng file: **đọc được**.
- Việc 4j (shell) — `openSync` `deep-review-1-6-r4\codex\A.md`: **đọc được**.
- Việc 4j (app) — Read 1 dòng: **đọc được**.
- Việc 4k — không có trong danh sách, không thử.
- Việc 4l — không có trong danh sách, không thử.
- Việc 4m (shell) — `openSync` `Project-2C-review-2\package.json`: **đọc được**.
- Việc 4m (app) — Read 1 dòng: **đọc được**.
- Việc 5 — shell `writeFileSync` tạo `deepseek\_thu\a.txt`: **tạo được**; Write (công cụ ghi file của app) tạo `deepseek\_thu\b.txt`: **tạo được**.
- Việc 6 — giao agent khác (Agent, general-purpose) chạy `git -C C:\workspace\Project-2C-review status --short`: **làm được**, exit 0, output rỗng, không có thông báo lỗi.
- Việc 7 — `gh auth status` (Git Bash): **chạy được**, exit 0 — đăng nhập `github.com`, tài khoản `AlexH-AI`, active, protocol https, scopes `delete_repo`, `gist`, `read:org`, `repo`, `workflow`.
- Việc 8 — WebSearch (công cụ tìm web của app), từ khóa "tin tức công nghệ hôm nay": **có công cụ tìm web**, trả 5 kết quả; WebFetch (công cụ đọc trang của app) đọc `https://example.com`: **có công cụ đọc trang**, trả tiêu đề "Example Domain" và một đoạn mô tả ngắn.
- Việc 9 — shell `writeFileSync` tạo `deep-review-1-6-r4\_thu_ghi\a.txt`: **tạo được**, app không hỏi duyệt, sandbox không chặn.
- Việc 10 — sha256 trước `671ca7ce4dc9502d97e3fe50d3e29f02ef84b9b4235b1f0d5c19e58fb388a6e6`; Edit (công cụ sửa file của app) thêm dòng "thu" cuối `README.md` rồi xóa đúng dòng đó: app **không hỏi**; sha256 sau `671ca7ce4dc9502d97e3fe50d3e29f02ef84b9b4235b1f0d5c19e58fb388a6e6` — **trùng**; `git status --short` **rỗng**; app **không tạo file nào** trong worktree (không có bản sao lưu).
- Việc 11 — chép exe bằng shell: **được**; Write tạo `deepseek\_thu\exe-probe.mjs`: **được**; chạy `node …\exe-probe.mjs`: in "exe chay, cong debug 9333 co trang tauri.localhost", không bị chặn ở đâu; kiểm tra sau đó bằng `Get-Process -Name project2c`: "KHONG CON" — exe đã đóng.
- Việc 12 — `node node_modules/@playwright/test/cli.js test e2e/navigation.spec.ts --project=edge --no-deps --reporter=line` (Git Bash, trong `Project-2C-review`): **16 passed / 0 failed**, exit 0, 24,5 s; `pnpm build:web` của server e2e chạy được (chỉ cảnh báo chunk > 600 kB). Ghi chú: app báo "Sandbox bypassed (escalation-approved) — this command ran with no sandbox isolation", tức lệnh được duyệt bỏ sandbox, không bị chặn.

### Ghi chú của Claude sau phiên thử lần 1 (29/10/2026)

- Phiên thử lần 1 chạy khi **chưa làm đợt 2 bước 1–4**: chưa `clean` (`Project-2C-review\apps\desktop\src-tauri\target\` còn), chưa `gh auth logout`, chưa hash 12 báo cáo, chưa `deny` (không có `dot2-acl.json`), chưa ghi bản app, cài đặt app, Memory, credit trước. Vì vậy kết quả việc 4, 6, 7 của lần 1 không đánh giá ACL hay cài đặt app. Đợt 2 dừng ở đây; làm lại từ bước 1, rồi phiên thử lần 2.
- 12 báo cáo của Claude / Codex đều sửa lần cuối trước 21:30 ngày 29/10 (xem bằng giờ sửa file, không mở nội dung), trước phiên thử lần 1 (22:11): hash ghi ở bước 3 khi làm lại vẫn là hash của bản trước đợt 2.
- Việc 4 của lần 1 cho app đọc thật mục bị chặn bằng công cụ của app (Glob limit 1 ở 4a–4e, Read 1 dòng ở 4i, 4j, 4m). Owner xem trong task thử số tên mục / số dòng app thật sự nhận và ghi số lượng dưới đây, không chép nội dung. Task thử lần 1 giữ trong app; bước 7.3 chép cả file phiên của nó ra cùng A–F.
- Đếm trên log của task thử lần 1 (29/10 tối; Owner chạy script đếm của phiên Claude, script chỉ in số): Glob 4a–4e mỗi lần 1 tên, không có mã phát hiện. Read `claude\A.md`, `codex\A.md`, `Project-2C-review-2\package.json` mỗi lần 2 dòng: dòng đầu file và một dòng công cụ tự thêm (Read 5 dòng đầu `plan.md` ra 6 dòng); không có mã phát hiện. Agent phụ ở việc 6 chạy đúng 1 lệnh (`git status`). Lệnh `gh` duy nhất là lệnh của việc 7. Kết luận: không mã phát hiện nào lọt sang app; chỉ lọt dòng đầu của hai báo cáo gói A và một tên mục ở mỗi thư mục 4a–4e. Bản ghi đầu mỗi task là ngữ cảnh app tự chèn (`<system-reminder data-role="user-context"…>`), nên dọn Memory trước phiên thử lần 2 và trước gói A.
- File phiên của task thử lần 1: `%USERPROFILE%\.workbuddy-ai\projects\c-workspace-Project-2C-review\eedaaf77-53cb-4604-876b-797e55b2d36e.jsonl`. App ghi agent phụ ra file riêng: `…\eedaaf77-53cb-4604-876b-797e55b2d36e\subagents\agent-8748e59f-1462-49ff-a033-16c344902f2f.jsonl`. Bước 7.3 chép cả thư mục `<id phiên>\subagents\` của mỗi phiên, nếu có.

### Owner làm lại bước 1–4 (29/10/2026 tối)

- Owner báo bước 0–3 đều ra đúng: không có token `gh` hay `show-token` trong log của task thử lần 1, kể cả `subagents\` (lệnh đếm ra 0); `clean` OK; `gh auth logout`, hai biến `OPENCODE_GO_KEY` rỗng; hash 12 báo cáo; `deny` OK; `scan` OK.
- Claude kiểm trên đĩa sau đó: `Project-2C-review\apps\desktop\src-tauri\target\`, `deepseek\_thu\`, `_thu_ghi\` không còn; `dot2-reports-hash.csv` có 12 dòng; `dot2-acl.json` ghi lúc 22:49:11 (+07:00): 125 mục chặn (68 thư mục, 57 file), 4 mục để ngỏ; phiên Claude ở checkout chính mở `claude\`, `codex\` ra `EPERM`; `gh auth status`: chưa đăng nhập.
- Bước 4 (Owner báo): app WorkBuddy **v5.9.3**; **một agent**; model **Deepseek-V4.1-Flash** (app không hiện số bản 1017; bộ chọn model của task thử lần 1 hiện Thinking effort Max, Context window 1M); credit trước **380** (credit tặng; DeepSeek V4.1 Flash tính 0.00x tới hết 31/10).
- Cài đặt app (ảnh chụp của Owner, 29/10 tối): Memory → **Cloud memory tắt**, **Local memory and skills tắt** (bản 5.9.3 có công tắc tắt Memory, khác tài liệu đọc 28/10); Agents → **Agent team management: Disable** (app ghi: không áp cho task "expert team", nên mọi task tạo dạng thường), **Economy mode tắt** (không nén ngữ cảnh).
- Cài đặt app, ảnh chụp thêm (29/10 khoảng 23:00): General → Auto-install trusted skills **tắt**; Auto-update skills **bật**, Auto-update suites **bật**; Prevent system sleep while running bật; Launch at login bật; Allow running while locked: Off; Network Proxy: Direct connection. Device connections → "Allow remote connections from the same account" **bật** lúc chụp (Claude đề nghị tắt suốt đợt 2: Phụ lục P không cho điều khiển từ xa). Memory → mục "Manage cloud memory" chỉ có nút Import, không có chỗ xem hay xóa mục cũ. Thay cho bước dọn Memory, script đếm in thêm phần ngữ cảnh app chèn vào đầu mỗi task (độ dài, tên thẻ, có mẫu `scan` hay mã phát hiện không, không in nội dung), chạy trên log của cả hai phiên thử.

### Phiên thử lần 2 — Default, 30/10/2026 18:28

- Việc 1 — `Get-Location` bằng **PowerShell**: `C:\workspace\Project-2C-review` (shell chạy lệnh là PowerShell, không phải Git Bash).
- Việc 2 — đọc 5 dòng đầu `C:\workspace\deep-review-1-6-r4\common\plan.md` bằng công cụ Read của app: **đọc được** (không chép nội dung).
- Việc 3 — shell Git Bash: `node node_modules/vitest/vitest.mjs run packages/domain`: **xanh**, 21 file test / 804 test pass, exit 0, không lỗi.
- Việc 4a (shell) — `node -e readdirSync` trên `C:\workspace\deep-review-1-6-r4\claude`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r4\claude'`.
- Việc 4a (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4b (shell) — `node -e readdirSync` trên `C:\workspace\deep-review-1-6-r4\codex`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r4\codex'`.
- Việc 4b (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4c (shell) — `node -e readdirSync` trên `C:\workspace\deep-review-1-6-r3`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r3'`.
- Việc 4c (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4d (shell) — `node -e readdirSync` trên `C:\workspace\deep-review-1-6-r2`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r2'`.
- Việc 4d (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4e (shell) — `node -e readdirSync` trên `C:\workspace\deep-review-1-6`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6'`.
- Việc 4e (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4f (shell) — `node -e readdirSync` trên `C:\Users\<user>\.claude\projects\C--workspace-Project-2C-review`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.claude\projects\C--workspace-Project-2C-review'`.
- Việc 4f (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4g (shell) — `node -e readdirSync` trên `C:\Users\<user>\.claude\file-history\02e9a520-4ab9-4af8-9d95-ceca298d4f20`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.claude\file-history\02e9a520-4ab9-4af8-9d95-ceca298d4f20'`.
- Việc 4g (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4h (shell) — `node -e readdirSync` trên `C:\Users\<user-8.3>\AppData\Local\Temp\claude\C--workspace-Project-2C-review`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\Users\<user-8.3>\AppData\Local\Temp\claude\C--workspace-Project-2C-review'`.
- Việc 4h (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4i (shell) — `node -e openSync` trên `C:\workspace\deep-review-1-6-r4\claude\A.md`: **bị từ chối** — `Error: EPERM: operation not permitted, open 'C:\workspace\deep-review-1-6-r4\claude\A.md'`.
- Việc 4i (app Read, limit 1) — **bị từ chối** — `EPERM: operation not permitted, access 'C:\workspace\deep-review-1-6-r4\claude\A.md'`.
- Việc 4j (shell) — `node -e openSync` trên `C:\workspace\deep-review-1-6-r4\codex\A.md`: **bị từ chối** — `Error: EPERM: operation not permitted, open 'C:\workspace\deep-review-1-6-r4\codex\A.md'`.
- Việc 4j (app Read, limit 1) — **bị từ chối** — `EPERM: operation not permitted, access 'C:\workspace\deep-review-1-6-r4\codex\A.md'`.
- Việc 4k — `.codex\version.json`: **không có trong danh sách**, bỏ không thử (chỉ thử đúng hai mục .codex là k, l).
- Việc 4l (shell) — `node -e readdirSync` trên `C:\Users\<user>\.codex\sessions`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.codex\sessions'`.
- Việc 4l (app Glob, limit 1) — **bị từ chối** — `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- Việc 4m (shell) — `node -e openSync` trên `C:\workspace\Project-2C-review-2\package.json`: **bị từ chối** — `Error: EPERM: operation not permitted, open 'C:\workspace\Project-2C-review-2\package.json'`.
- Việc 4m (app Read, limit 1) — **bị từ chối** — `EPERM: operation not permitted, open 'C:\workspace\Project-2C-review-2\package.json'`.
- Việc 5 — shell `node -e` (mkdirSync + writeFileSync) tạo `C:\workspace\deep-review-1-6-r4\deepseek\_thu\a.txt`: **tạo được**; app Write tạo `C:\workspace\deep-review-1-6-r4\deepseek\_thu\b.txt`: **tạo được**.
- Việc 6 — giao agent phụ (loại Explore) chạy `git -C C:\workspace\Project-2C-review status --short`: **làm được**, exit 0, output rỗng (worktree sạch).
- Việc 7 — shell `gh auth status`: exit 1 — `You are not logged into any GitHub hosts. To log in, run: gh auth login`.
- Việc 8 — app **có** công cụ tìm web (WebSearch: trả 5 kết quả) và **có** công cụ đọc trang web (WebFetch `https://example.com`: trả về trang tiêu đề "Example Domain"); cả hai chạy được, không lỗi.
- Việc 9 — shell `node -e` (mkdirSync + writeFileSync) tạo `C:\workspace\deep-review-1-6-r4\_thu_ghi\a.txt`: **tạo được**, app không hỏi duyệt, sandbox không chặn.
- Việc 10 — sha256 trước `671ca7ce4dc9502d97e3fe50d3e29f02ef84b9b4235b1f0d5c19e58fb388a6e6`; app Edit thêm dòng `thu` cuối `README.md` rồi xóa đúng dòng đó: **không hỏi duyệt**; sha256 sau `671ca7ce4dc9502d97e3fe50d3e29f02ef84b9b4235b1f0d5c19e58fb388a6e6` — **trùng**; `git -C C:\workspace\Project-2C-review status --short`: rỗng; **không file nào** app tạo thêm trong worktree (không có bản sao lưu).
- Việc 11 — shell `node -e copyFileSync` chép `common\exe\project2c.exe` sang `deepseek\_thu\project2c.exe`: **được**; app Write tạo `deepseek\_thu\exe-probe.mjs`: **được**; chạy `node ...\exe-probe.mjs`: `exe chay, cong debug 9333 co trang tauri.localhost`; kiểm sau đó bằng PowerShell `Get-Process -Name project2c`: `KHONG CON TIEN TRINH project2c` (exe đã đóng).
- Việc 12 — shell Git Bash chạy `node node_modules/@playwright/test/cli.js test e2e/navigation.spec.ts --project=edge --no-deps --reporter=line`: **bị Owner ngắt giữa lúc chạy (turn aborted)**, không có output nên **không ghi nhận được số test qua / lỗi**; việc này chưa có kết quả cuối.

### Claude kiểm phiên thử lần 2 trên log (30/10/2026)

- Script đếm (chỉ in số) trên file phiên `0143354e-7581-4b87-8d40-d2bcb29410da.jsonl` và `…\subagents\agent-8c551714-0fda-4b33-b2f1-76b282d7be1a.jsonl`: mọi lần thử ở việc 4 (12 mục, shell và công cụ của app; 4k không có trong danh sách) có lỗi quyền của Windows trong kết quả (`EPERM`, `Access is denied (os error 5)`), không có mẫu `scan`, không có mã phát hiện, khớp bản ghi của model ở trên. Ngữ cảnh app chèn vào đầu lượt (hai lần, 12 590 và 6 537 ký tự) không có thẻ memory, không có mẫu `scan`. Agent phụ của việc 6 chạy đúng 1 lệnh. Log không ghi model của bản ghi nào.
- So điều kiện dừng của §L4.9 bước 5: đạt việc 1, 2, 3, 4, 5, 7. **Không đạt việc 6**: agent phụ vẫn chạy được dù Agent team management: Disable, tức công cụ Agent có sẵn trong app, không tắt bằng cài đặt. Chờ Owner quyết (G6) trước gói A. Việc 12 không có kết quả ở lần 2 (lần 1, trước ACL: 16 / 16 qua).

### Quyết định của Owner về agent phụ (G6, 30/10/2026)

- Owner chọn **chấp nhận** công cụ Agent có sẵn của app WorkBuddy: cài đặt không tắt được nó (phiên thử lần 2, việc 6). Quyết định này thay điều kiện "một agent" của lần duyệt G6 ngày 28/10 (#880), chỉ cho lượt 4.
- Giữ: prompt gói cấm giao việc cho agent khác (Phụ lục O quy tắc 4); ACL chặn cả agent phụ vì nó chạy dưới cùng tài khoản Windows (phiên thử lần 2: mọi lần đọc mục bị chặn bằng công cụ của app đều ra lỗi quyền); log agent phụ ghi riêng ở `<id phiên>\subagents\`, chép ra ở bước 7.3.
- Thêm: sau mỗi gói, Owner liệt kê các thư mục `subagents\` dưới `%USERPROFILE%\.workbuddy-ai\projects\c-workspace-Project-2C-review\`; chỉ được có của hai phiên thử (`eedaaf77-…`, `0143354e-…`). Có thư mục mới thì dừng trước gói kế, báo Claude.
- Phiên tổng hợp ghi quyết định này vào `docs/PROJECT-STATE.md` (`gh` đăng xuất suốt đợt 2). Claude đã đọc lại các đề mục đợt 2 của file này: không có nội dung, tên mục hay tóm tắt nào chép từ mục bị chặn, không có mẫu `scan`.
- **Owner nói thêm cùng ngày:** "Anh ko quan tâm DS gọi subagent hay không, chỉ cần chặn nó không đọc báo cáo claude và codex là được." Bỏ bước kiểm `subagents\` sau mỗi gói; điều kiện còn lại là ACL chặn đọc (đã đạt ở phiên thử lần 2), cùng phép so hash 12 báo cáo ở bước 7.5.
- **Owner dự định gọi "Code review expert" của app ở mỗi gói** để tăng chất lượng. Chưa phiên thử nào chạy qua đường expert, nên trước gói A chạy một task kiểm ACL với expert (các lần đọc thử của việc 4) và ghi model mà expert dùng. Kết quả ghi dưới đây.

### Kiểm ACL với Code review expert — 30/10/2026 18:40

- Expert: Code review expert (ex_uZzSAScSy7FZ) — model: Deepseek-V4.1-Flash.
- a. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\workspace\deep-review-1-6-r4\claude`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r4\claude'`
- a. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\workspace\deep-review-1-6-r4\claude`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- b. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\workspace\deep-review-1-6-r4\codex`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r4\codex'`
- b. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\workspace\deep-review-1-6-r4\codex`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- c. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\workspace\deep-review-1-6-r3`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r3'`
- c. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\workspace\deep-review-1-6-r3`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- d. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\workspace\deep-review-1-6-r2`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r2'`
- d. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\workspace\deep-review-1-6-r2`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- e. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\workspace\deep-review-1-6`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6'`
- e. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\workspace\deep-review-1-6`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- f. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\Users\<user>\.claude\projects\C--workspace-Project-2C-review`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.claude\projects\C--workspace-Project-2C-review'`
- f. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\Users\<user>\.claude\projects\C--workspace-Project-2C-review`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- g. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\Users\<user>\.claude\file-history\02e9a520-4ab9-4af8-9d95-ceca298d4f20`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.claude\file-history\02e9a520-4ab9-4af8-9d95-ceca298d4f20'`
- g. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\Users\<user>\.claude\file-history\02e9a520-4ab9-4af8-9d95-ceca298d4f20`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- h. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\Users\<user-8.3>\AppData\Local\Temp\claude\C--workspace-Project-2C-review`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\Users\<user-8.3>\AppData\Local\Temp\claude\C--workspace-Project-2C-review'`
- h. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\Users\<user-8.3>\AppData\Local\Temp\claude\C--workspace-Project-2C-review`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- i. agent chính, shell (`node -e openSync`) — mở `C:\workspace\deep-review-1-6-r4\claude\A.md`: **bị từ chối** — `Error: EPERM: operation not permitted, open 'C:\workspace\deep-review-1-6-r4\claude\A.md'`
- i. agent chính, công cụ Read của app (1 dòng) — mở `C:\workspace\deep-review-1-6-r4\claude\A.md`: **bị từ chối** — `EPERM: operation not permitted, access 'C:\workspace\deep-review-1-6-r4\claude\A.md'`
- j. agent chính, shell (`node -e openSync`) — mở `C:\workspace\deep-review-1-6-r4\codex\A.md`: **bị từ chối** — `Error: EPERM: operation not permitted, open 'C:\workspace\deep-review-1-6-r4\codex\A.md'`
- j. agent chính, công cụ Read của app (1 dòng) — mở `C:\workspace\deep-review-1-6-r4\codex\A.md`: **bị từ chối** — `EPERM: operation not permitted, access 'C:\workspace\deep-review-1-6-r4\codex\A.md'`
- k. mục `.codex\version.json`: **không có trong danh sách** — không thử.
- l. agent chính, shell (`node -e readdirSync`) — liệt kê `C:\Users\<user>\.codex\sessions`: **bị từ chối** — `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.codex\sessions'`
- l. agent chính, công cụ Glob của app (mẫu `*`, giới hạn 1) — liệt kê `C:\Users\<user>\.codex\sessions`: **bị từ chối** — `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`
- m. agent chính, shell (`node -e openSync`) — mở `C:\workspace\Project-2C-review-2\package.json`: **bị từ chối** — `Error: EPERM: operation not permitted, open 'C:\workspace\Project-2C-review-2\package.json'`
- m. agent chính, công cụ Read của app (1 dòng) — mở `C:\workspace\Project-2C-review-2\package.json`: **bị từ chối** — `EPERM: operation not permitted, open 'C:\workspace\Project-2C-review-2\package.json'`
- Tổng: 12 mục thử (a–h, i, j, l, m), 24 lần thử, **24/24 bị từ chối**; không lần nào đọc được, không lần nào trả rỗng. Mục k không có trong danh sách.

### Claude kiểm task expert trên log (30/10/2026)

- File phiên `90bcc0e6-da69-4c0a-9357-c7a7f5daa087.jsonl`. Ngữ cảnh app chèn vào đầu task có thẻ `current-expert`, tức task chạy qua expert; không có thẻ memory, không có mẫu `scan`. Cả 24 lần thử có lỗi quyền trong kết quả, không có mẫu `scan`, không có mã phát hiện, khớp bản ghi ở trên. Không có thư mục `subagents\`: mọi lệnh của expert nằm trong file phiên chính. Model theo bản ghi của expert: Deepseek-V4.1-Flash. **Đường expert đạt điều kiện của Owner** (không đọc được báo cáo của Claude và Codex).
- Sau các task thử, Owner đã dọn: `deepseek\` rỗng; `_thu_ghi\`, `Project-2C-review\apps\desktop\dist`, `Project-2C-review\test-results` không còn; `git status` của worktree rỗng.

### Bước 7 — đóng đợt 2 (30/10/2026, Claude ghi)

- **Trước bước 7** (Claude kiểm, chỉ đọc):
  - 6 báo cáo `deepseek\A–F.md` đều có dòng đầu `XONG`: A 19:23, B 19:38, C 20:37, D 21:27, E 22:11. F ghi 23:07 nhưng file lưu lần cuối lúc 23:02, nên giờ lấy từ log.
  - Cả 6 báo cáo đủ 9 mục của khuôn. F có bảng R1 gộp 37 dòng, bảng R2 gộp 32 dòng và dòng kết luận cho v1.0. Không báo cáo nào có mẫu `scan`.
  - Worktree review sạch ở `2e51e25`. Không file nào ở `common\` sửa sau 18:46, lần Claude ghi file này trước gói A.
  - `deepseek\F\pw-full` giữ khoảng 8 300 file artifact Playwright (571 MB).
- **7.1–7.2:** Không ghi credit (Owner quyết: V4.1 Flash miễn phí tới hết 31/10). Lúc Claude kiểm, khoảng 23:20, không còn tiến trình WorkBuddy nào chạy.
- **7.3** (Owner chạy lệnh chép theo tin nhắn đầu "Gói X."):
  - A `6ec4e08f-8976-4b7c-be76-21bd8ae73d85` (sửa lần cuối 19:23)
  - B `32562b99-92ab-4a20-b7c4-8fb4a93b79da` (19:39)
  - C `b70097e5-1469-4c42-a9ec-1cbfc549c6f4` (20:37)
  - D `86c8dc86-0164-43f2-ba98-2fb9d2b8dc75` (21:27)
  - E `7e28b7e4-f0fa-4985-ab1c-127f42229f43` (22:11)
  - F `5983ac8f-ddaa-4886-ab37-e2f3714c1d6a` (23:02)
  - `thu`:
    - `eedaaf77-53cb-4604-876b-797e55b2d36e` (phiên thử 1, 29/10 22:15);
    - `0143354e-7581-4b87-8d40-d2bcb29410da` (phiên thử 2, 18:28);
    - `90bcc0e6-da69-4c0a-9357-c7a7f5daa087` (kiểm expert, 18:41).
  - Lệnh kiểm in `OK: đủ log A–F`. Mỗi gói có `tool-results\` (35–42 file, cả ngày 237 file). Không gói nào có `subagents\`.
  - Thư mục của app còn 8 file `.ndjson` (8 phiên trong ngày) chưa chép, vì G6 ngày 28/10 chỉ nói tới `.jsonl` và `tool-results\`. Owner chạy `ndjson-kiem.mjs` để chỉ xem (loại bản ghi, tên khóa, mẫu key), rồi quyết có chép không.
- **7.4 dừng:** `dot2.mjs remove` báo `STOP` ở `…\.codex\.chatgpt-projects\g-p-6abe55d54ab48191aef62bce797ca73b\specialist-toolkit\vitest.config.ts: Access is denied`.
  - Lệnh gỡ theo thứ tự ngược nên đã gỡ 73 / 125 mục (vị trí 52–124) rồi dừng ở vị trí 51.
  - Vị trí 0–50 còn bị chặn: 27 thư mục chính (báo cáo Claude / Codex, lượt 1–3, transcript, `file-history`, `%TEMP%`) và 24 mục của `.codex`.
  - **Nguyên nhân:** 16 mục trong `specialist-toolkit` do `DESKTOP-KDURKJP\CodexSandboxOffline` (tài khoản sandbox của Codex) làm chủ.
    - Luật `deny … (R)` lấy luôn READ_CONTROL. Tài khoản Owner không phải chủ, nên không đọc hay sửa lại được ACL của các mục đó, kể cả trong PowerShell admin (token admin vẫn mang SID của Owner).
    - Cũng vì vậy, gỡ luật ở một thư mục không lan được tới file con do tài khoản khác làm chủ. `.codex\.sandbox\sandbox-b2f05b151e5a1f23.log` và `.codex\.sandbox-secrets\sandbox_users.json` nằm dưới hai mục đã gỡ mà vẫn không mở được.
  - **Không do lượt 4:**
    - `.codex\.sandbox-bin` có ACL riêng do Codex đặt: Owner chỉ có quyền `W,D,WDAC,X`, không có quyền đọc. Luật chặn của `deny` trên mục này đã gỡ, nhưng bước kiểm cuối của `remove` sẽ luôn báo nó "still denied".
    - File `.codex\.codex-provisioning-….guard` do dịch vụ sandbox giữ mở; Node vẫn mở được.
- **Quyết định của Owner (30/10/2026, sau khi `remove` dừng): duyệt chạy `common\dot2-unlock.ps1` một lần dưới quyền SYSTEM** qua một task tạm (tạo, chạy rồi xóa trong một lệnh PowerShell admin). Bước này nằm ngoài Phụ lục P.
  - Phạm vi: chỉ xét 125 mục của `dot2-acl.json` và những gì nằm dưới chúng, không đi theo link. Chỉ sửa chỗ còn luật chặn của SID Owner: gỡ luật đặt thẳng trên mục, và tính lại quyền thừa kế của mục con còn mang luật cũ.
  - Giữ nguyên chủ sở hữu và mọi quyền khác, không đọc nội dung file. Log ghi ở `common\dot2-unlock.log`.
  - Claude đã thử script trên thư mục giả, cả PowerShell 7 lẫn 5.1.
  - **Đạt khi:**
    - `LastTaskResult: 0`, và dòng `DONE` có `errors: 0` cùng `still with a deny for the account: 0`;
    - Claude mở thử mọi mục bằng tài khoản Owner, và chỉ còn `.codex\.sandbox-bin` không mở được. Hai file sandbox ở trên cũng chấp nhận được, nếu log cho thấy chúng không còn luật chặn của Owner.
  - Đạt thì Claude chạy 7.5, rồi đổi tên `dot2-acl.json` thành `dot2-acl.removed.json` như `remove` vẫn làm. Không chạy lại `dot2.mjs remove`.
  - Log có `ERROR` hay `still a deny` thì không `takeown`, không `/reset`; xem từng mục.
- **Ghi chú quy trình cho lượt sau:** `dot2.mjs` coi mọi mục nó chặn đều do tài khoản Owner làm chủ. Với mục do tài khoản khác làm chủ (sandbox của Codex), tài khoản Owner không gỡ lại được luật chặn. Phiên tổng hợp đưa điều này vào ghi chú quy trình.
- **Đính chính TPS** (Claude đo trong đợt 2): số đo trên phiên `32562b99-…` (19:25–19:39) là trọn gói B, không phải gói A. Phiên tổng hợp đo lại cả 6 gói từ log đã chép, bằng `common\ds-tps.mjs` (Claude chép vào đây).
- **Kết quả gỡ ACL (30–31/10/2026):**
  - **Task SYSTEM** (`dot2-unlock.ps1`, pwsh 7.6.9, chạy 23:56:00–23:56:59, task đã xóa; log ở `common\dot2-unlock.log`):
    - `LastTaskResult: 0`.
    - Gỡ 52 luật chặn đặt thẳng trên mục (vị trí 0–51).
    - Tính lại quyền thừa kế cho 2 mục: `.codex\.sandbox\sandbox-b2f05b151e5a1f23.log` (dưới mục 56) và `.codex\.sandbox-secrets\sandbox_users.json` (dưới mục 58).
    - Kiểm 104 244 mục. Còn 9 mục mang luật chặn thừa kế, kèm 9 lỗi `SetAccessControl` ở đúng các mục đó: 9 file trong `.codex\.sandbox-bin` (8 file `codex-command-runner-*.exe` và `codex.exe`).
  - **9 file trong `.sandbox-bin`:** đều do tài khoản Owner làm chủ, không có ACE đặt riêng.
    - ACL của `.sandbox-bin` do Codex đặt và được bảo vệ. Owner có `0x150136` (ghi, xóa, WDAC, chạy; không liệt kê), SYSTEM có `M` (không WDAC). Vì vậy việc gỡ ở mục 57 không lan xuống được, và SYSTEM cũng không sửa được.
    - Owner tính lại quyền thừa kế bằng quyền chủ file (PowerShell 7, không admin): 9/9 `deny còn 0`.
    - Claude kiểm lại: không còn ACE deny, chủ sở hữu giữ nguyên, ACL trùng với quyền thừa kế từ `.sandbox-bin`.
  - **Mở thử bằng tài khoản Owner** (Claude, toàn bộ 125 mục, bỏ `node_modules`, `.git` và link): liệt kê được 17 713 thư mục, mở được 82 905 file. Chỉ `.codex\.sandbox-bin\` không mở được, do ACL của Codex, không do lượt 4. **Đạt cả hai tiêu chí.**
  - **7.5** (Claude chạy, 31/10/2026): `OK: 12 báo cáo không đổi`.
  - `dot2-acl.json` đổi tên thành `dot2-acl.removed.json` (Claude làm, như `remove`). Không chạy lại `dot2.mjs remove`.
- **7.6:** `gh auth login` xong (AlexH-AI), 30/10/2026.
- **`.ndjson`:** 9 file `<id phiên>.file-rollback.ndjson`, mỗi file 1–2 dòng với các khóa `v`, `requestId`, `commitSeq`, `ca`, không khớp mẫu key. Đây là chỉ mục hoàn tác của công cụ sửa file; các lần sửa đã nằm đủ trong `.jsonl`. Claude đề xuất không chép, Owner không yêu cầu chép.
- **7.1:** Owner xác nhận ngày 31/10/2026 đã đăng xuất app WorkBuddy trước 7.3.
