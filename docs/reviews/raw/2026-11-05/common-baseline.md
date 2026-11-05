# Baseline — deep review Phase 1–6, lượt 5

- **Máy:** Home PC **`DESKTOP-KDURKJP`** (`hostname`). Bước chuẩn bị bắt đầu **04/11/2026 21:40:20 +07:00** (`Get-Date`); giờ từng bước ghi ở dưới và trong `gates\summary.txt`, `perf\run-exe.log`. Bước chuẩn bị, cả ba bên và mọi số đo của lượt 5 chạy trên máy này (plan §L5.2); số đo so với mốc **cùng máy** (plan §L5.6): mốc Home PC sau #656, G7 (`g7-home-pc\lan-2`) và lượt 4.
- **Sổ OPEN rỗng:** sau `git fetch`, mục OPEN của `docs/state/review-notes.md` ở `origin/main` (`37a80b6`) không còn mục lá nào: chỉ có đoạn rà sổ đầu mục và dòng "Theo file, gộp vào lần chạm sau cùng file (hoặc T-h nếu còn chỗ):", không dòng danh sách nào ✅. Mục cuối vừa chuyển sang RESOLVED ở PR sổ #1041 (T-361, review #1040).
- **SHA ghim:** **`37a80b6`** (`37a80b662861d308a110d1e2b0f65ad13b91fb51`) = `git rev-parse origin/main` lúc 04/11/2026 21:40 (#1041, PR sổ của review #1040, T-361). Checkout chính cũng ở `37a80b6`, sạch. Từ SHA ghim tới lúc chạy chỉ có thay đổi docs (plan §L5.2).
- **Code so với exe ứng viên L3:** `git diff --stat 3d237b0 37a80b6 -- . ':(exclude)docs/**' ':(exclude)*.md'` **rỗng** ✅: code ở SHA ghim trùng `3d237b0` (exe ứng viên đã nghiệm thu L3). Từ `571b8b0` (lúc soạn kế hoạch) tới SHA ghim có 12 commit, đều docs: T-357 (kế hoạch lượt 5, #1026) và T-358…T-361 (`dot2.mjs` lượt 5, Phụ lục V; #1030, #1034, #1037, #1040), cùng các PR sổ / gắn nhãn sổ của chúng. Không thêm dòng R2.
- **Thư mục:** `C:\workspace\deep-review-1-6-r5\` chưa có trước bước chuẩn bị ✅; đã tạo `common\`, `claude\`, `codex\`, `deepseek\` (ba thư mục sau để rỗng).
- **Hai file mốc** (plan §L5.6), có và đúng sha256 ✅:
  - `C:\workspace\deep-review-1-6-r4\common\perf\perf-ref.json`: 5 143 B, sha256 `A4E8E4E9872C9487F6C9E991BB86AA2195C2B650FC726A69D834205AB5557BAD`; chép thành `perf\perf-ref-r4.json` (cùng sha256);
  - `C:\workspace\g7-home-pc\lan-2\perf\perf-g7.json`: 5 143 B, sha256 `995E92383FED0A857D255596F9C3246517B7CE53E8B6B6D95B301EA6043CDFEE`; chép thành `perf\perf-g7.json` (cùng sha256).
- **App WorkBuddy:** Owner xác nhận đã đăng xuất app WorkBuddy trên Home PC (04/11/2026 21:40, trong phiên chuẩn bị, trước bước 2; Phụ lục P, ranh giới tài khoản). Phiên chuẩn bị không mở app, không đọc thư mục dữ liệu của app.
- **Worktree review** (bước 3): `C:\workspace\Project-2C-review` (trước ở `fc97998`, head PR #1040 vừa review) và `C:\workspace\Project-2C-review-2` (trước ở `235b01e`) đều `checkout --detach 37a80b6`. Ngoài chính phiên chuẩn bị (mở ở `Project-2C-review`, phiên vừa review PR #1040), không phiên Claude nào đang chạy ở hai worktree (danh sách phiên của app). Đã xóa `apps\desktop\dist` của cả hai. `apps\desktop\src-tauri\target\` **chưa có** ở cả hai worktree, nên không xóa gì (plan §L5.9 bước 3, đề xuất 10). `pnpm install --frozen-lockfile` ở cả hai: lockfile không đổi, không cài thêm. `git status --short` rỗng ở cả hai ✅.
- **File chung** (bước 4; dựng bằng script từ `git cat-file blob 37a80b6:…` và `gh … --json`, không chép tay; script trong scratchpad của phiên chuẩn bị):
  - `plan.md`: bản ở `37a80b6`, trùng blob (`git hash-object` = `af892ef`), 4 516 dòng, sha256 `51701719222297E14E642D7685F06C88E5FFCB09BEE057EB5706D56FA8DDE271`.
  - `prompt-claude.md` = Phụ lục Q + Phụ lục T (159 dòng); `prompt-codex.md` = Phụ lục S + Phụ lục T (160 dòng); `prompt-deepseek.md` = Phụ lục U + Phụ lục T (175 dòng). Khối trích dẫn chép nguyên văn, bỏ dấu `> `, hai phần cách một dòng trống, như lượt 3–4. `{SHA}` → `37a80b6`, `{SHA_ĐỦ}` → đủ 40 ký tự; `{GÓI}` để nguyên. Đã thử cách dựng: cùng script chạy trên `deep-review-1-6-r4\common\plan.md` (Phụ lục L / M / O + N, SHA `2e51e25…`) ra trùng byte cả ba `prompt-*.md` và `dot2.mjs` của lượt 4.
  - `dot2.mjs`: khối `js` của Phụ lục V (`plan.md` dòng 4038–4515), nguyên văn, 478 dòng; `node --check` qua.
  - `known.md` (§L5.5, dựng mới ở SHA ghim, 272 dòng): (1) OPEN (rỗng, giữ đoạn đầu mục) và ACCEPTED nguyên văn của `review-notes.md`; (2) K1–K40 chép từ bảng của `docs/reviews/raw/2026-10-31/common-known.md`, K17 theo chữ §L5.5 (bốn gạch nối bằng dấu chấm phẩy như lượt 4), cộng K41–K47 của §L5.5; (3) "Lệch mockup đã biết" của `nghiem-thu-v1.md` nguyên văn; (4) bảng R1 25 dòng và danh sách KNOWN; (5) bảng R2 28 dòng, kèm dòng của bước chuẩn bị (không thêm Issue).
  - `fixes.md` (6 347 dòng): thân **38 Issue** của ba bảng §L5.2 và **39 PR** của chúng (gồm PR G5 #909 của #900), nguyên văn, tiêu đề trong thân hạ hai cấp như lượt 4; sau thân PR là **25 nhóm RESOLVED** của sổ ở SHA ghim theo nhãn T-xxx (13 Issue không có nhóm nào: T-319, 320, 321, 324, 325, 326, 327, 335, 343, 345, 348, 350, 351; ghi "Không có nhóm nào mang nhãn này."). Kiểm khi dựng: Issue đều CLOSED, PR đều MERGED, commit merge trùng cột Commit của §L5.2 và nằm trong lịch sử của `37a80b6`.
  - **Thân PR, lệch so với chữ của §L5.9 bước 4:** bước này nói chép mục "Lệch so với Issue", "Chưa làm", "Sửa sau review", "Ghi chú OPEN liên quan" của thân PR. 39 PR đều theo mẫu PR ("Thay đổi", "Test chấp nhận", "Ghi chú OPEN liên quan", "Kiểm tra"); không PR nào có mục tên "Lệch so với Issue" hay "Chưa làm", một PR có "Sửa theo review …". Phần lệch / chưa làm / sửa sau review nằm rải trong các mục đó, nên `fixes.md` chép **cả thân PR**, như lượt 4 đã làm với cùng chữ của §L4.9 bước 4.
  - Các file chung trên **không có dòng nào khớp `MARKER`** của `dot2.mjs` (kiểm từng dòng sau khi dựng).
- **Mốc đợt 2** (cuối bước 4): `node C:\workspace\deep-review-1-6-r5\common\dot2.mjs baseline` lúc **04/11/2026 21:47:52 +07:00**, sau khi mọi file chung trên đã ghi và trước mọi lệnh ghi vào worktree của bước 5–7. `common\dot2-baseline.json`: `Project-2C-review` 7 mục (`.claude\settings.local.json`, `apps\desktop\src-tauri\gen\` và 4 file schema trong đó), `Project-2C-review-2` 6 mục (`gen\` và 4 file schema).
- Log đầy đủ của từng cổng: `gates\*.log`; tóm tắt `gates\summary.txt`.

## Dữ liệu tải (bước 5)

`common\load\load-2026-10-12-seed6.p2cbackup` (`node tools/load-data.mjs --out …` ở SHA ghim, trong `Project-2C-review`, mốc `2026-10-12`, seed `6`, 6,2 s, bắt đầu 21:48:00; `gates\load-data.log`): 1 496 KH, 10 414 lịch hẹn, 1 510 `appointment_coordinators`, 54 nhân sự, 5 team, 1 697 hợp đồng, 103 `ai_analyses`, 5 672 `kyc_notes`, 13 114 `kyc_versions`, 13 833 `kyc_facts`, 4 941 `stage_transitions`, 0 `settings`. File 16 034 517 byte (15,3 MB), sha256 file `B3C9903321ABCCDF3301818D35DAD7D7C6EAC48D73814286694B554C94C77293`.

**`tables` sha256 `e256e4f18699f4a4e494b59a92ef46865eb4d2c9887f4ff1e7a6b872b4b345a2`** = hash G7 ở `233c77e` (plan §L5.6) ✅, cùng số dòng như lượt 1–4.

## Cổng ở SHA ghim (bước 6; `Project-2C-review`, 04/11/2026)

Script chạy cổng gỡ hẳn biến `CI` trước `pnpm build:exe` (bài học lượt 4, lần 1), nên `build:exe` qua ngay lần đầu. Node `v24.20.0`, pnpm 12.6.0, rustc / cargo 1.98.1 (`gates\summary.txt`).

| Cổng | Kết quả | Thời gian |
|---|---|---|
| `pnpm verify` | ✅ 130 file test, **4 387 test** (lượt 4: 125 / 3 975); `lint:deps`: no dependency violations (354 module, 1 582 dependency; lượt 4: 341 / 1 435); token-guard, `codemap:check` ("Export maps are up to date"), typecheck sạch; coverage Stmts 99.21 % · Branch 97.4 % · Funcs 99.13 % · Lines 99.38 % (lượt 4: 99.18 / 97.27 / 99.17 / 99.35) | 159 s (bắt đầu 21:48:42) |
| `pnpm verify:rust` | ✅ fmt + clippy `-D warnings` sạch; **120 test** Rust (lượt 4: 116); `target\` dựng từ đầu | 91 s (21:51:21) |
| `pnpm e2e` (`CI=1`) | ✅ exit 0: **324 passed**, không flaky, không chạy lại (12 worker; lượt 4: 308 passed) | 174 s (21:52:52 → 21:55:46) |
| `pnpm build:exe` (không đặt `CI`) | ✅ `project2c.exe` release **5 649 408 byte** (= lượt 4 `2e51e25` và G7 `233c77e`; +235 008 so `b139d8a`), sha256 `167D4B3BA7CB2644E5544BCDF68300D293A4290FBBDF214FAE971F37BE75832A` → `common\exe\project2c.exe`. Build cục bộ, nên sha256 khác exe của CI (artifact `3d237b0`) và khác bản build cục bộ của lượt 4 | 114 s (21:55:46) |
| `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` | ✅ chạy sau khi có exe. Không có dòng "Chưa xếp gói" | 0,3 s (21:57:39) |

`git status --short` của `Project-2C-review` sau cổng: rỗng. Mọi thứ cổng sinh ra trong worktree (`dist`, `target\`, `test-results\`, coverage, cache) nằm ngoài `dot2-baseline.json` hoặc là file có sẵn được ghi đè, nên đợt 2 bước 1 (`dot2.mjs clean`) xử lý. `target\` lúc ghi mốc chưa có (bước 3), nên `clean` xóa trọn bản build của bước 6 (review #878).

### Bundle web (`pnpm build:web` trong `build:exe`; cột Δ so `b139d8a` theo `size-report`, cột cuối Δ so lượt 4 `2e51e25`)

| File | Thô (byte) | Δ `b139d8a` | Gzip (byte) | Δ `b139d8a` | Δ lượt 4 (thô / gzip) |
|---|---:|---:|---:|---:|---|
| `assets/chart.js` | 513 302 | 0 | 172 450 | 0 | 0 / 0 |
| `assets/exceljs.min.js` | 929 569 | 0 | 255 572 | 0 | 0 / 0 |
| `assets/index.js` | 892 184 | +242 | 264 291 | +2 281 | +7 486 / +2 524 |
| `assets/index.css` | 30 295 | +1 931 | 6 821 | +409 | +543 / +103 |
| `assets/rolldown-runtime.js` | 1 106 | 0 | 627 | 0 | 0 / 0 |
| **Tổng JS / CSS** | 2 366 456 | +2 173 | 699 761 | +2 690 | +8 029 / +2 627 |
| Tệp khác (19 file: wasm, font, ảnh, `index.html`) | 1 022 121 | +172 925 | — | — | 0 (như lượt 4) |

So plan §L5.6 (lượt 4: JS / CSS 2 358 427 B, `index.js` 884 698 B, exe 5 649 408 B): JS / CSS +8 029 B, `index.js` +7 486 B, exe 0 B. G7 (`233c77e`): exe cùng 5 649 408 B; plan không ghi bundle của G7. Số liệu ghi lại, không phải kết luận (bước chuẩn bị không ghi phát hiện; gói F xét).

### Coverage theo vùng (chỉ dòng < 100 %; `gates\verify.log`)

| Vùng | Stmts | Branch | Funcs | Lines | Lượt 4 (Stmts / Branch / Funcs / Lines) |
|---|---:|---:|---:|---:|---|
| `apps/desktop/src/data` | 98.52 | 96.7 | 97.45 | 98.99 | 98.5 / 96.49 / 97.38 / 98.98 |
| `apps/desktop/src/routes` (gốc) | 99.6 | 94.84 | 100 | 100 | 99.57 / 94.67 / 100 / 100 |
| `routes/appointments` | 99.59 | 93.58 | 100 | 99.49 | như lượt 4 |
| `routes/customers` | 98.91 | 97.46 | 99.21 | 99.34 | như lượt 4 |
| `routes/overview` | 98.5 | 94.26 | 98.63 | 98.77 | như lượt 4 |
| `routes/reports` | 100 | 93.63 | 100 | 100 | như lượt 4 |
| `apps/desktop/src/shell` | 85.03 | 92.52 | 82.22 | 85.04 | 83.47 / 92.23 / 82.5 / 83.5 |
| `packages/db/src` | 99.6 | 97.74 | 100 | 99.8 | như lượt 4 |

Vùng không có trong bảng: 100 % (vitest `skipFull`).

### Cỡ dòng theo gói và diff sửa (plan §L5.3 ở SHA ghim)

`gates\size-report.log` (số dòng) và `gates\diff-2e51e25-37a80b6.log` (diff sửa = `git diff --numstat -M 2e51e25 37a80b6` ngoài `docs/**` và mọi file `*.md`, xếp gói bằng `classifyFile` của `tools/size-report-core.mjs`, file Rust tính cả phần test là SP; script `gates\diff-by-package.mjs`, chạy lại ở `571b8b0` ra đúng bảng §L5.3). **Mọi số trùng bảng §L5.3 lúc soạn (`571b8b0`)**: từ `571b8b0` tới SHA ghim không đổi file code nào. Cột R1 / R2 theo §L5.3; bước chuẩn bị không thêm dòng R2 (`known.md` phần 5).

| Gói | SP (Δ lượt 4) | Test (Δ) | Sinh (Δ) | File (Δ) | Diff sửa SP | Diff sửa test | R1 (mã DR6, mục KNOWN đã sửa) | R2 (Issue) |
|---|---:|---:|---:|---:|---|---|---|---|
| A. Lõi dữ liệu | 8 748 (+29) | 15 805 (+91) | 341 (0) | 104 (0) | +53 / −24 · 5 file | +110 / −19 · 6 file | 135–137, 151 | T-332, 350 |
| B. File và Rust | 2 457 (+31) | 5 600 (+178) | 0 (0) | 21 (+2) | +113 / −15 · 4 file | +119 / −8 · 4 file | 138–140, 147 | T-332 |
| C. AI | 6 580 (+553) | 8 202 (+663) | 0 (0) | 65 (+2) | +1 051 / −498 · 11 file | +1 396 / −733 · 10 file | 137, 141–144 | T-329, 330, 332, 336, 339 |
| D. Màn nhập liệu | 8 134 (+135) | 3 094 (+274) | 0 (0) | 89 (+2) | +208 / −73 · 12 file | +276 / −2 · 4 file | 37, 145–149 | T-331, 332, 333, 337, 341, 342, 344, 352, 356 |
| E. Lịch hẹn, chỉ số, quản lý | 8 272 (+117) | 4 700 (+144) | 0 (0) | 52 (0) | +178 / −61 · 13 file | +200 / −56 · 3 file | 37, 148, 150–154 | T-331, 332, 337, 350, 353 |
| F. Xuyên gói / công cụ | 4 886 (+446) | 18 427 (+1 567) | 4 628 (0) | 100 (+4) | +460 / −14 · 7 file | +1 597 / −30 · 14 file | 136 (đo), 155–157, CLR4-F2; **R1 gộp đủ 25 dòng** | T-333, 334, 335, 336, 338, 339, 340, 342, 343, 345–349, 351, 352, 354, 355; **R2 gộp đủ mọi dòng** |
| **Tổng** | 39 077 (+1 311) | 55 828 (+2 917) | 4 969 (0) | 431 (+10) | | | | |

- **Diff sửa `2e51e25..37a80b6`** ngoài `docs/**` và mọi file `*.md`: **93 file, +5 761 / −1 533**; không file nhị phân, không file sinh, không migration; mọi file đều xếp được gói. 25 commit có code hoặc test.

## Đo trên exe và trong Node (bước 7; 04/11/2026 21:57:59 → 22:03:28)

`perf\run-perf.ps1` chạy liền, máy rảnh, cửa sổ exe ở trên cùng (Owner đồng ý trước khi chạy): `perf\purge-node.mjs` (21:57:59 → 21:58:10) rồi `perf\run-exe.ps1` (21:58:10 → 22:03:28; log `perf\run-exe.log`), trên `common\exe\project2c.exe` (sha256 `167D4B3B…5832A`), cổng debug 9222.

- Script: chép `g7-home-pc\lan-2\perf\` (`run-exe.ps1`, `first-open.mjs`, `import-load.mjs`, `reopen-marks.mjs`, `purge-exe.mjs`, `tables.mjs`, `compare.mjs`; không chép kết quả). `run-exe.ps1` chỉ đổi 8 dòng: chú thích đầu, `$repo` = `C:\workspace\Project-2C-review` (ở SHA ghim, như lượt 4; G7 dùng checkout chính), `$c` = `-r5\common`, file kết quả probe `perf-ref.json` / `perf-ref.log`, `PERF_NOTE` = `DESKTOP-KDURKJP, exe 37a80b6, deep review luot 5` (plan §L5.6). `purge-node.mjs` chép từ `deep-review-1-6-r4\common\perf\`, không đổi; `run-perf.ps1` như lượt 4, chỉ đổi thư mục.
- Thứ tự trong `run-exe.ps1`: (1) mở app lần đầu 3 lần (cách T-227); (2) `perf\run\`: mở exe (seed demo), nhập dữ liệu tải qua cổng debug, đóng. Sau khi nhập, Cài đặt → Dữ liệu ghi "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ" (như lượt 4, G7); (3) mở lại trên dữ liệu tải 3 lần; (4) mở lại lần nữa, nối probe ngay (lệnh §L5.6, `PERF_RUNS` 5 mặc định; 1 passed, 2,8 phút); (5) Dọn sạch Thùng rác một lần trên exe.
- Kỳ của probe: **kỳ Năm 2026** (`Lịch năm 2026, 0 back: 79 met`), **kỳ Tháng 10/2026** (`Lịch tháng 10/2026, 1 back: 10 days met`), như G7. Probe lượt 4 (trước T-345…T-347) chọn lịch khác ở hai dòng `appointments.next-month` / `appointments.next-year` và các dòng chọn lịch của kỳ Tháng / Năm: so lượt 4 ở các dòng đó chỉ để tham khảo.

**Kết quả: không dòng nào ⚠️ ở cả ba bảng probe (so mốc sau #656, so G7, so lượt 4); mọi thao tác trong ngưỡng `phase-6.md`.** Mở lần đầu (LCP), mở lại và Dọn sạch đều trong ngưỡng. Một dòng phụ của mở lần đầu (lần lưu DB đầu) lớn hơn mốc quá luật nhiễu, ghi ở bảng dưới. Số liệu ghi lại, không phải kết luận (bước chuẩn bị không ghi phát hiện; gói A / F xét).

### Mở app lần đầu (cách T-227, Home PC)

`perf\first-open\first-open.json`: mỗi lần chép exe vào thư mục mới `perf\first-open\run-<n>\` (chưa có `Project2C-data\`, app sinh seed demo), mở với cổng debug 9222, chờ 12 s rồi nối CDP đọc mốc trong trang; lúc gọi exe ghi bằng `Date.now()` ngoài exe. "Màn đầu có số liệu" = LCP; cả 3 lần phần tử LCP là `IMG` (G7: `DIV`; lượt 4: `P`).

| Mốc | Lần 1 | Lần 2 | Lần 3 | Trung vị | Mốc sau #656 `dae9df3` | Lượt 4 `2e51e25` | G7 `233c77e` | Xấu hơn? |
|---|---:|---:|---:|---:|---|---|---|---|
| Gọi exe → trang bắt đầu | 454 | 388 | 395 | 395 ms | — | 397 ms | 354 ms | — |
| Sinh seed demo (`p2c:demo-seed`) | 2 869 | 2 785 | 2 800 | 2 800 ms | 3 060 ms | 2 870 ms | 2 847 ms | — |
| Trang bắt đầu → mở xong dữ liệu (`p2c:data-open`) | 3 040 | 2 938 | 2 974 | 2 974 ms | 3 240 ms | 3 043 ms | 2 994 ms | — |
| Lưu file DB lần đầu (`p2c:db-save`) | 152 | 150 | 149 | 150 ms | 119 ms | 119 ms | 123 ms | trung vị +31 ms (+26 %) so mốc sau #656 và lượt 4, +27 ms (+22 %) so G7: quá luật nhiễu (> 20 % và > 10 ms). Plan §L5.6 chỉ đặt ngưỡng mở lần đầu cho LCP; ghi lại để gói F xét |
| **Gọi exe → màn đầu có số liệu (LCP)** | 3 650 | 3 480 | 3 535 | **3 535 ms** | 3 663 ms | 3 521 ms | 3 420 ms | ✅ không (luật nhiễu: > 4 396 ms; "không chậm hơn exe Phase 4": > 4 724 ms) |

File `project2c.db` sau lần đầu: 9 969 664 byte (= lượt 4 và G7).

### Mở lại trên dữ liệu tải (3 lần; `perf\reopen.json`)

Cùng cách đo như mở lần đầu (chờ 12 s rồi nối CDP), thư mục `perf\run\` đã nhập dữ liệu tải; `project2c.db` 14 102 528 byte. Phần tử LCP `DIV` cả 3 lần (như G7). Lượt 4 không đo.

| Mốc | Lần 1 | Lần 2 | Lần 3 | Trung vị | G7 `233c77e` | Xấu hơn? |
|---|---:|---:|---:|---:|---|---|
| Gọi exe → trang bắt đầu | 328 | 270 | 263 | 270 ms | 245 ms | — |
| Trang bắt đầu → mở xong dữ liệu (`p2c:data-open`) | 334 | 385 | 329 | 334 ms | 317 ms | ✅ không (+17 ms, +5 %) |
| **Gọi exe → màn đầu có số liệu (LCP)** | 720 | 710 | 651 | **710 ms** | 617 ms | ✅ không (+93 ms, +15 %; luật nhiễu: > 740 ms) |

### Hiệu năng trên exe (probe `e2e/perf`, Home PC): so mốc sau #656

`perf\perf-ref.json` — **đây là số để so** khi reviewer đo trên exe ở máy này. Cột Nền = `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` (exe `dae9df3`, 18/10). Cột Ngưỡng theo `docs/metrics/phase-6.md`. Bảng sinh bằng `perf\tables.mjs` (`parseRun` / `markdownTable` của `e2e/perf/stats.ts`); bản ghi file: `perf\table-vs-656.md`.

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 330 ms | 330 ms | 330 ms | 387 ms | −57 ms (−15%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 983 ms | 975 ms | 1007 ms | 835 ms | +148 ms (+18%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 50 ms | 37 ms | 52 ms | 43 ms | +7 ms (+16%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 150 ms | 148 ms | 157 ms | 151 ms | −1 ms (+0%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 407 ms | 398 ms | 461 ms | 398 ms | +9 ms (+2%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 391 ms | 388 ms | 395 ms | 391 ms | +1 ms (+0%) | < 500 ms ✅ |
| `reload.customers` | 5 | 316 ms | 315 ms | 319 ms | 336 ms | −20 ms (−6%) | < 500 ms ✅ |
| `reload.reports` | 5 | 371 ms | 369 ms | 389 ms | 376 ms | −5 ms (−1%) | < 500 ms ✅ |
| `reload.team` | 5 | 362 ms | 355 ms | 374 ms | 355 ms | +7 ms (+2%) | < 500 ms ✅ |
| `reload.settings` | 5 | 285 ms | 283 ms | 294 ms | 283 ms | +2 ms (+1%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 6 ms | 5 ms | 9 ms | 8 ms | −3 ms (−33%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 11 ms | 11 ms | 15 ms | 12 ms | 0 ms (−2%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 5 ms | 13 ms | −8 ms (−64%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 13 ms | 17 ms | −7 ms (−40%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 17 ms | 17 ms | 24 ms | 17 ms | 0 ms (−1%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 11 ms | 13 ms | 11 ms | +0 ms (+2%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | 6 ms | +0 ms (+0%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 7 ms | 3 ms | 8 ms | 9 ms | −3 ms (−28%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 5 ms | 5 ms | 8 ms | 7 ms | −2 ms (−33%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 19 ms | 17 ms | 21 ms | 20 ms | −1 ms (−5%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 24 ms | 22 ms | 25 ms | 23 ms | +1 ms (+4%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 21 ms | 19 ms | +1 ms (+6%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 2 ms | 2 ms | 10 ms | 2 ms | +0 ms (+20%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 16 ms | 16 ms | 21 ms | 16 ms | +1 ms (+6%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 14 ms | 14 ms | 17 ms | 14 ms | +0 ms (+1%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | 0 ms (−3%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 10 ms | 10 ms | 10 ms | +0 ms (+0%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | 17 ms | 0 ms (−1%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 8 ms | 6 ms | 11 ms | 6 ms | +3 ms (+42%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,7 MB | 16,7 MB | 16,7 MB | 16,5 MB | +0,2 MB (+1%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 33 ms | 31 ms | 37 ms | 34 ms | −1 ms (−4%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 21 ms | 16 ms | 71 ms | 20 ms | +2 ms (+9%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 438 ms | 426 ms | 454 ms | 438 ms | 0 ms (+0%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 111 ms | 108 ms | 112 ms | 101 ms | +10 ms (+10%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 108 ms | 105 ms | 123 ms | 107 ms | +0 ms (+0%) | ≤ 300 ms ✅; Năm − Tháng −3 ms ≤ 50 ms ✅ |

### So G7 cùng máy, cùng bản probe (tham khảo chính)

Cột Nền = `perf\perf-g7.json` (exe `233c77e`, 03/11, probe sau T-347; chép từ `g7-home-pc\lan-2\perf\`). Bản ghi file: `perf\table-vs-g7.md`.

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 330 ms | 330 ms | 330 ms | 320 ms | +9 ms (+3%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 983 ms | 975 ms | 1007 ms | 975 ms | +8 ms (+1%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 50 ms | 37 ms | 52 ms | 44 ms | +5 ms (+12%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 150 ms | 148 ms | 157 ms | 148 ms | +3 ms (+2%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 407 ms | 398 ms | 461 ms | 395 ms | +12 ms (+3%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 391 ms | 388 ms | 395 ms | 385 ms | +6 ms (+2%) | < 500 ms ✅ |
| `reload.customers` | 5 | 316 ms | 315 ms | 319 ms | 308 ms | +8 ms (+3%) | < 500 ms ✅ |
| `reload.reports` | 5 | 371 ms | 369 ms | 389 ms | 367 ms | +5 ms (+1%) | < 500 ms ✅ |
| `reload.team` | 5 | 362 ms | 355 ms | 374 ms | 350 ms | +12 ms (+3%) | < 500 ms ✅ |
| `reload.settings` | 5 | 285 ms | 283 ms | 294 ms | 280 ms | +5 ms (+2%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 6 ms | 5 ms | 9 ms | 6 ms | 0 ms (−7%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 11 ms | 11 ms | 15 ms | 11 ms | +1 ms (+5%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 5 ms | 5 ms | +0 ms (+4%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 13 ms | 10 ms | +0 ms (+0%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 17 ms | 17 ms | 24 ms | 18 ms | 0 ms (−2%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 11 ms | 13 ms | 12 ms | +0 ms (+1%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | 6 ms | 0 ms (−5%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 7 ms | 3 ms | 8 ms | 7 ms | 0 ms (−3%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 5 ms | 5 ms | 8 ms | 5 ms | +0 ms (+2%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 19 ms | 17 ms | 21 ms | 20 ms | −1 ms (−5%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 24 ms | 22 ms | 25 ms | 23 ms | +1 ms (+4%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 21 ms | 20 ms | +0 ms (+0%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 2 ms | 2 ms | 10 ms | 2 ms | +1 ms (+26%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 16 ms | 16 ms | 21 ms | 17 ms | 0 ms (−2%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 14 ms | 14 ms | 17 ms | 14 ms | +0 ms (+2%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | 0 ms (−3%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 10 ms | 10 ms | 10 ms | 0 ms (−3%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | 17 ms | 0 ms (−1%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 8 ms | 6 ms | 11 ms | 9 ms | 0 ms (−2%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,7 MB | 16,7 MB | 16,7 MB | 16,7 MB | +0,0 MB (+0%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 33 ms | 31 ms | 37 ms | 33 ms | +0 ms (+0%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 21 ms | 16 ms | 71 ms | 25 ms | −3 ms (−13%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 438 ms | 426 ms | 454 ms | 435 ms | +3 ms (+1%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 111 ms | 108 ms | 112 ms | 112 ms | −1 ms (−1%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 108 ms | 105 ms | 123 ms | 109 ms | −1 ms (−1%) | ≤ 300 ms ✅; Năm − Tháng −3 ms ≤ 50 ms ✅ |

### So lượt 4 cùng máy (tham khảo)

Cột Nền = `perf\perf-ref-r4.json` (exe `2e51e25`, 29/10). Probe lượt 4 có trước T-345…T-347: hai dòng `appointments.next-month` (kỳ Tháng) và `appointments.next-year` (kỳ Năm), cùng các dòng chọn lịch / chọn ngày của hai kỳ, chọn lịch khác bản lượt 5, nên Δ ở các dòng đó không so trực tiếp. Bản ghi file: `perf\table-vs-r4.md`.

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 330 ms | 330 ms | 330 ms | 370 ms | −41 ms (−11%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 983 ms | 975 ms | 1007 ms | 977 ms | +5 ms (+1%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 50 ms | 37 ms | 52 ms | 47 ms | +2 ms (+5%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 150 ms | 148 ms | 157 ms | 149 ms | +2 ms (+1%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 407 ms | 398 ms | 461 ms | 405 ms | +2 ms (+0%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 391 ms | 388 ms | 395 ms | 393 ms | −2 ms (+0%) | < 500 ms ✅ |
| `reload.customers` | 5 | 316 ms | 315 ms | 319 ms | 317 ms | −1 ms (+0%) | < 500 ms ✅ |
| `reload.reports` | 5 | 371 ms | 369 ms | 389 ms | 373 ms | −1 ms (+0%) | < 500 ms ✅ |
| `reload.team` | 5 | 362 ms | 355 ms | 374 ms | 359 ms | +2 ms (+1%) | < 500 ms ✅ |
| `reload.settings` | 5 | 285 ms | 283 ms | 294 ms | 279 ms | +6 ms (+2%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 6 ms | 5 ms | 9 ms | 7 ms | −1 ms (−20%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 11 ms | 11 ms | 15 ms | 13 ms | −1 ms (−10%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 5 ms | 11 ms | −6 ms (−54%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 13 ms | 17 ms | −7 ms (−41%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 17 ms | 17 ms | 24 ms | 17 ms | +0 ms (+0%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 11 ms | 13 ms | 11 ms | +0 ms (+4%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | 7 ms | −1 ms (−9%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 7 ms | 3 ms | 8 ms | 9 ms | −3 ms (−29%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 5 ms | 5 ms | 8 ms | 7 ms | −2 ms (−31%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 19 ms | 17 ms | 21 ms | 19 ms | −1 ms (−4%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 24 ms | 22 ms | 25 ms | 24 ms | 0 ms (−2%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 21 ms | 20 ms | +0 ms (+1%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 2 ms | 2 ms | 10 ms | 2 ms | +0 ms (+4%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 16 ms | 16 ms | 21 ms | 17 ms | −1 ms (−4%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 14 ms | 14 ms | 17 ms | 17 ms | −3 ms (−16%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | +0 ms (+2%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 10 ms | 10 ms | 10 ms | 0 ms (−4%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | 17 ms | +0 ms (+0%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 8 ms | 6 ms | 11 ms | 6 ms | +2 ms (+35%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,7 MB | 16,7 MB | 16,7 MB | 16,6 MB | +0,1 MB (+1%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 33 ms | 31 ms | 37 ms | 32 ms | +1 ms (+3%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 21 ms | 16 ms | 71 ms | 29 ms | −8 ms (−26%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 438 ms | 426 ms | 454 ms | 436 ms | +3 ms (+1%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 111 ms | 108 ms | 112 ms | 108 ms | +2 ms (+2%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 108 ms | 105 ms | 123 ms | 113 ms | −6 ms (−5%) | ≤ 300 ms ✅; Năm − Tháng −3 ms ≤ 50 ms ✅ |

### Dọn sạch Thùng rác trên exe (một lần, dữ liệu tải)

`perf\purge-exe.mjs`, ngay sau probe, cùng exe và thư mục `perf\run\` (kết quả `perf\purge-exe.json`, log `perf\purge-exe.log`). Cách đo như lượt 4: nút được đánh dấu, trang tự bấm sau khi đã ngắt CDP, rồi nối lại đọc thời gian trang ghi.

1. Nhập lại dữ liệu tải: Nội dung "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ", `project2c.db` 14 102 528 byte (= lượt 4).
2. `trash.open` trước khi dọn (đã ngắt DevTools, 3 lần): 31,9 / 30,1 / 29,9 ms → trung vị **30,1 ms** (lượt 4: 34,1).
3. Hộp 11i: "113 bản ghi · mọi loại, không theo bộ lọc"; KH 15 — kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI; Lịch hẹn 76, HĐ 18, Nhân sự 3, Team 1; không có dòng "Giữ lại"; câu backup nêu `Project2C-data\backups\`; ô "Gõ DỌN SẠCH để xác nhận"; nút "Hủy", "Backup rồi dọn sạch" (như lượt 4).
4. **Bấm "Backup rồi dọn sạch" → khung hình đầu có thông báo 11j: 128,0 ms ≤ 500 ms ✅** (ngưỡng K30; lượt 4: 123,3 ms; G7: 130,5 ms). Lần lưu file (`p2c:db-save`) đầu tiên sau cú bấm: 162,2 ms (lượt 4: 146,0).
5. Thông báo 11j: "Đã dọn sạch Thùng rác — Xóa hẳn 15 KH (kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI) · 76 lịch hẹn · 18 HĐ · 3 nhân sự · 1 team. Backup: Project2C-data\backups\project2c-s00000009-20261104-220310.db". Một file backup mới đúng tên đó.
6. `project2c.db` 14 102 528 → **13 438 976 byte** (bằng số trong Node, = lượt 4).
7. `trash.open` sau khi dọn ("Thùng rác trống", 3 lần): 2,0 / 2,0 / 2,0 ms → trung vị **2,0 ms** (lượt 4: 2,0).
8. Nội dung Cài đặt → Dữ liệu sau khi dọn: như trước khi dọn.

### Dọn sạch Thùng rác trong Node (plan §L5.6, như §L4.6)

`perf\purge-node.mjs` (chép từ lượt 4, không đổi; kết quả `perf\purge-node.json`, log `perf\purge-node.log`), 21:57:59 → 21:58:10, ngay trước phần đo trên exe, máy rảnh. Node `v24.20.0`, `@p2c/db` của `Project-2C-review` ở SHA ghim (qua `tools/ts-hooks.mjs`), không persist; mỗi lần nhập lại file dữ liệu tải; 5 lần mỗi cỡ. Trung vị (min–max), ms.

| Đo | Dữ liệu tải: 113 dòng Thùng rác | Lượt 4 | Thùng rác lớn: 1 313 dòng (+1 200 KH xóa) | Lượt 4 |
|---|---|---:|---|---:|
| `listTrash` trước khi dọn | 24,6 (22,4–36,3) | 23,8 | 134,6 (130,6–143,1) | 158,2 |
| `previewPurge` | 1,0 (0,9–1,2) | 1,0 | 6,1 (6,0–6,2) | 7,4 |
| `purgeTrash` cả `VACUUM` | 88,5 (82,8–94,4) | 85,2 | 117,5 (115,7–118,7) | 129,8 |
| — trong đó phần transaction (không `VACUUM`) | 23,8 (22,1–25,8) | 21,8 | 112,7 (111,6–114,4) | 125,1 |
| — trong đó `VACUUM` | 65,5 (59,7–68,7) | 62,9 | 4,3 (4,2–4,8) | 4,7 |
| `db.export()` sau khi dọn | 2,1 (2,0–2,9) | 2,1 | 0,4 (0,4–0,5) | 0,5 |
| `listTrash` sau khi dọn | 2,3 (0,9–2,4) | 2,1 | 0,6 (0,6–0,7) | 0,6 |
| Dòng Thùng rác trước → sau; giữ lại | 113 → 0; giữ 0 | 113 → 0 | 1 313 → 0; giữ 0 | 1 313 → 0 |
| Cỡ file (`export()`) trước → sau | 14 102 528 → 13 438 976 byte (−4,7 %) | = | 14 151 680 → 1 495 040 byte (−89,4 %) | = |

Cả hai cỡ trong ngưỡng ≤ 500 ms; không bản ghi nào bị giữ lại (TR-12).

## Trạng thái cuối bước chuẩn bị (04/11/2026 22:05)

- `git status --short` của `Project-2C-review` và `Project-2C-review-2`: rỗng; cả hai ở `37a80b6`.
- `C:\workspace\deep-review-1-6-r5\claude\`, `codex\`, `deepseek\`: rỗng.
- **Sẵn sàng chạy lượt 5** (plan §L5.9 bước 8): Owner chạy đợt 1 (Claude ở `Project-2C-review`, Codex ở `Project-2C-review-2`, mỗi gói một phiên mới, A → F).

## Đợt 2 (DeepSeek): Owner và phiên thử ghi dưới đây

### Chuẩn bị đợt 2 (Claude, phiên ở checkout chính, 05/11/2026)

Phiên này không mở app WorkBuddy, không đọc thư mục dữ liệu của app, không chạy `clean` / `deny` / `scan` / `remove` (chỉ `deny --dry-run`, không đổi ACL).

- **Điều kiện bắt đầu** (plan §L5.9 đợt 2), kiểm lúc ≈ 08:10:
  - đủ 12 báo cáo đợt 1, dòng đầu đều là `XONG`; gói F của Claude xong 02:14, của Codex xong 00:46 ngày 05/11;
  - hai worktree review ở `37a80b6`, `git status --short` rỗng;
  - `gh` còn đăng nhập (bước 2 Owner đăng xuất); `OPENCODE_GO_KEY` rỗng ở cả User lẫn Machine; `C:\Program Files\nodejs\node.exe` = v24.20.0;
  - Codex còn chạy (tiến trình `codex`, `codex-code-mode-host`): Owner đóng ở bước 1, trước `clean`;
  - 6 phiên Claude ở hai worktree review còn trong sidebar, đều rảnh. Owner chọn không archive; không mở lại chúng tới hết đợt 2 (transcript của chúng bị chặn ghi sau `deny`).
- **Hard link trong `file-history`.** Lần chạy `deny --dry-run` đầu tiên in `STOP: nothing denied`.
  - `~\.claude\file-history\cb4c07af-bda1-4d1c-a11e-f7d7eece1182\1dc16a9cc0ef1da4@v1` và `…\de741a8a-6635-4e9e-8bc7-e64d2c2c555a\1dc16a9cc0ef1da4@v1` là hai link của một file (45 003 B, 01/11/2026 17:40). Đó là bản lưu của phiên `review-1` và phiên rẽ nhánh "Đoạn chat phụ" của nó, cả hai ở `Project-2C-review`; không phải tài liệu lượt 5.
  - Hai thư mục đều là mục chặn cả, nhưng `walkTree` xét từng mục riêng nên coi là link ra ngoài.
  - Claude thay link ở `de741a8a-…` bằng một bản chép (sha256 trùng, giữ giờ sửa). `fsutil hardlink list` sau đó: mỗi file một link.
- **Thư mục tạm của phiên Claude ở `Project-2C-review`** (Owner chọn 05/11).
  - Claude Code bản hiện tại để thư mục tạm của phiên (scratchpad, `tasks\*.output`) ở `%TEMP%\claude\<mã băm của thư mục làm việc>\<id phiên>\`, không còn ở `%TEMP%\claude\C--workspace-Project-2C-review\` mà `dot2.mjs` chặn. Với `Project-2C-review`, mã băm là `9baf74bac889a6ec`: chứa `tasks\*.output` của 6 phiên gói A–F (13 file, ≈ 24 KB, không khớp mẫu `scan`) và scratchpad của phiên chuẩn bị lượt 5.
  - Claude chuyển nguyên `%TEMP%\claude\9baf74bac889a6ec\` (18 thư mục phiên, 95 file, 5 108 950 B) sang `C:\workspace\deep-review-1-6-r5\claude\_temp-9baf74bac889a6ec\`, để `deny` chặn cùng `claude\`. Hash 12 báo cáo ở bước 3 chỉ tính `claude\*.md` và `codex\*.md`, nên không đổi.
  - Hai thư mục mã băm còn lại trong `%TEMP%\claude\`: `4f7e6602815f66dc` (checkout chính) và `4fc713fa22ddbfd6` (3 scratchpad rỗng). `05db6d84c5f1545b` rỗng.
- **`deny --dry-run`**, sau hai việc trên (05/11 ≈ 09:04): exit 0.
  - 234 mục sẽ chặn. `deep-review-1-6-r4` và `deep-review-1-6` bị tách quanh mục của tài khoản khác, nên chặn theo mục con.
  - 306 mục không chặn vì của tài khoản khác:
    - `CodexSandboxOffline`: 290 mục trong `.codex\.chatgpt-projects\…\specialist-toolkit` (dự án khác) và 12 probe lượt 1 trong `deep-review-1-6\codex\F\`;
    - `NT AUTHORITY\SYSTEM`: 3 file trong `.codex\.sandbox*` và `deep-review-1-6-r4\common\dot2-unlock.log`.
  - 1 mục không đọc được từ trước `deny`: `.codex\.sandbox-bin`, như lượt 4.
  - 4 mục để ngỏ: `node_modules` và `.git` của `Project-2C-review-2` và của `specialist-toolkit`.
- **`clean` dự kiến xóa** (đếm bằng hàm `leftovers` của `dot2.mjs`, không xóa gì):
  - `Project-2C-review`: 10 678 mục ngoài mốc — `apps\desktop\dist`, `apps\desktop\src-tauri\target\` (bản build ở bước 6 chuẩn bị), `coverage\`, `playwright-report\`, `test-results\.last-run.json`;
  - `Project-2C-review-2`: 26 mục — `apps\desktop\dist`;
  - thêm cache `node_modules\.vite*`, `%TEMP%\playwright*`, `%TEMP%\codex-*` và thư mục `ssr` trong `%TEMP%`.
- **`scan` ở bước 3 dự kiến in `STOP` với đúng 2 file** (Owner chấp nhận 05/11). Claude đoán trước bằng cách chạy lại phần quét của `scan` trên mọi chỗ ngoài phạm vi `deny`, chỉ in đường dẫn.
  - `~\.claude\projects\C--workspace-Project-2C\83cbf8a1-c821-4809-b6e5-2727a714446d.jsonl`: transcript của phiên chuẩn bị đợt 2 này. Khi kiểm điều kiện bắt đầu, phiên in dòng đầu của 12 báo cáo (trạng thái và giờ xong; không mã phát hiện, không nội dung).
  - `~\.claude\projects\C--workspace-Project-2C\ee02c71b-e824-4c9d-b5d0-f079729a59e8.jsonl`: phiên T-359 (`/session-start` #1032). Trong đó có chuỗi mẫu giả của bộ thử `dot2.mjs` trên cây giả, ghi lúc 19:54 ngày 04/11, trước đợt 1. Giờ sửa file sau mốc vì phiên còn dùng tới sáng 05/11.
  - `scan` in `STOP` mà danh sách chỉ có đúng 2 đường dẫn này thì coi là đạt: ghi vào đây rồi đi tiếp bước 4. Có đường dẫn khác thì dừng, báo Claude. Hai file nằm dưới `~\.claude*`, chỗ quy tắc riêng 3 của prompt DeepSeek cấm đọc.
  - Phiên Claude nào hỗ trợ đợt 2 từ đây không in dòng đầu hay mã phát hiện của báo cáo Claude / Codex.
- **Sau `deny` ở bước 3**, kiểm thêm thư mục đã chuyển: mở một file trong `claude\_temp-9baf74bac889a6ec\` theo đường dẫn đủ phải bị từ chối.
- **Kiểm sau bước 1–3** (Claude, 05/11 ≈ 09:20; Owner báo `clean`, `deny`, `scan` đã chạy):
  - `dot2-acl.json` ghi lúc 09:13:42: 234 mục chặn (1 mục `readBefore: false`: `.codex\.sandbox-bin`), `unreadableBefore` 0, 306 mục không chặn, 4 mục để ngỏ. `dot2-reports-hash.csv`: 12 dòng.
  - Mở `-r5\claude`, `-r5\codex`, `Project-2C-review-2\package.json` và một file trong `claude\_temp-9baf74bac889a6ec\`: đều bị từ chối (`UnauthorizedAccessException`).
  - `gh auth status`: chưa đăng nhập. Không còn tiến trình Codex. `Project-2C-review`: `git status --short` rỗng, `apps\desktop\src-tauri\target\` không còn.
  - **Liệt kê `C:\workspace\deep-review-1-6-r4` và `C:\workspace\deep-review-1-6` đọc được**, khác chữ "→ bị từ chối" ở plan §L5.9 bước 5. Đúng thiết kế Phụ lục V điểm 3: hai thư mục này có mục do tài khoản khác làm chủ (`-r4\common\dot2-unlock.log` của `NT AUTHORITY\SYSTEM`; 12 probe lượt 1 trong `deep-review-1-6\codex\F\` của `CodexSandboxOffline`), nên `deny` chặn từng mục con, không chặn chính thư mục. Liệt kê chỉ thấy tên mục con. Claude kiểm từng thư mục con: `-r4\claude`, `-r4\codex`, `-r4\deepseek`, `deep-review-1-6\claude`, `\common`, `\muse` bị từ chối; `-r4\common`, `deep-review-1-6\codex` và `\codex\F` (đường tới mục của tài khoản khác) liệt kê được tên, còn file của Owner trong đó bị chặn từng file. Phiên thử ghi hai lần liệt kê này "đọc được" là kết quả dự kiến, không dừng đợt 2.

### Phiên thử — task 1, Default, 2026-11-05 09:22 +07:00

**1. App hiện:** model `DeepSeek-V4.1-Flash` (dòng "This conversation is powered by DeepSeek-V4.1-Flash" trong ngữ cảnh phiên); cửa sổ ngữ cảnh và mức suy luận không hiện ở chỗ nào tôi đọc được, nên không ghi được số. Expert: không có expert nào đang dùng (không có khối expert trong ngữ cảnh phiên), nên không có model của expert.

**2.** `Get-Location` trong PowerShell → `C:\workspace\Project-2C-review`. Shell chạy lệnh: PowerShell (công cụ PowerShell của app).

**3.** `node --version` → `v22.22.2`; `& 'C:\Program Files\nodejs\node.exe' --version` → `v24.20.0`. Bản thứ hai ≥ 24 nên đi tiếp, không dừng.

**4.** Đọc 5 dòng đầu `common\plan.md` bằng công cụ đọc file của app: **đọc được** (không chép nội dung).

**5. vitest `packages/domain`, mỗi shell một lần:**
- PowerShell: Node `v24.20.0`; `Test Files 21 passed (21)`; `Tests 805 passed (805)`; exit code 0.
- Git Bash: Node `v24.20.0`; `Test Files 20 passed (20)`; `Tests 794 passed (794)`; exit code **1**, kèm 1 unhandled error: `[vitest-pool]: Failed to start forks worker for test files C:/workspace/Project-2C-review/packages/domain/src/number.test.ts` / `Caused by: [vitest-pool-runner]: Timeout waiting for worker to respond`.

**6.** `common\dot2-acl.json`: đọc được bằng công cụ đọc file của app. Từng mục, hai lần (shell = `node -e "require('fs').readdirSync(...)"` hoặc `openSync`, công cụ app = glob limit 1 / đọc 1 dòng):
- a. `-r5\claude` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r5\claude'`. App: **bị từ chối**, `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- b. `-r5\codex` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r5\codex'`. App: **bị từ chối**, cùng dạng lỗi `rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- c. `-r4` — shell: **đọc được** (exit 0). App: **bị từ chối**, `Error: glob error: Error during glob search operation: ripgrep exited with code 2:` rồi lặp dòng `rg: .\<mục con>: IO error for operation on .\<mục con>: Access is denied. (os error 5)` cho từng mục con bị chặn.
  `-r4\claude` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r4\claude'`. App: **bị từ chối**, `rg: .: IO error for operation on .: Access is denied. (os error 5)`.
  `-r4\codex` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r4\codex'`. App: **bị từ chối**, cùng dạng lỗi trên.
- d. `-r3` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r3'`. App: **bị từ chối**, `rg: .: IO error for operation on .: Access is denied. (os error 5)`. `-r2` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r2'`. App: **bị từ chối**, cùng dạng lỗi.
- e. `deep-review-1-6` — shell: **đọc được** (exit 0). App: **bị từ chối**, `Error: glob error: Error during glob search operation: ripgrep exited with code 2:` rồi lặp dòng `rg: .\<mục con>: IO error for operation on .\<mục con>: Access is denied. (os error 5)`. `deep-review-1-6\claude` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6\claude'`. App: **bị từ chối**, cùng dạng lỗi `rg: .: ... Access is denied. (os error 5)`.
- f. `~\.claude\projects\C--workspace-Project-2C-review` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.claude\projects\C--workspace-Project-2C-review'`. App: **bị từ chối**, `rg: .: IO error for operation on .: Access is denied. (os error 5)`. `~\.claude\file-history\02e9a520-4ab9-4af8-9d95-ceca298d4f20` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.claude\file-history\02e9a520-4ab9-4af8-9d95-ceca298d4f20'`. App: **bị từ chối**, cùng dạng lỗi. `%TEMP%\claude\C--workspace-Project-2C-review` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\Users\<user-8.3>\AppData\Local\Temp\claude\C--workspace-Project-2C-review'`. App: **bị từ chối**, cùng dạng lỗi.
- g. `-r5\claude\_temp-9baf74bac889a6ec` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r5\claude\_temp-9baf74bac889a6ec'`. App: **bị từ chối**, `Error: glob error : Error: Invalid parameters provided. Reason: Error: EPERM: operation not permitted, stat 'C:\workspace\deep-review-1-6-r5\claude\_temp-9baf74bac889a6ec'`.
- h. `-r5\claude\A.md` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, open 'C:\workspace\deep-review-1-6-r5\claude\A.md'`. App: **bị từ chối**, `EPERM: operation not permitted, access 'C:\workspace\deep-review-1-6-r5\claude\A.md'`. `-r5\codex\A.md` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, open 'C:\workspace\deep-review-1-6-r5\codex\A.md'`. App: **bị từ chối**, `EPERM: operation not permitted, access 'C:\workspace\deep-review-1-6-r5\codex\A.md'`.
- i. `.codex\version.json`: **không có, bỏ** (không kiểm, không đụng `.codex`). Chỉ `~\.codex\sessions` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.codex\sessions'`. App: **bị từ chối**, `rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- j. `Project-2C-review-2\package.json` — shell: **bị từ chối**, `Error: EPERM: operation not permitted, open 'C:\workspace\Project-2C-review-2\package.json'`. App: **bị từ chối**, `EPERM: operation not permitted, open 'C:\workspace\Project-2C-review-2\package.json'`.

**7.** `deepseek\_thu\a.txt` bằng shell: **tạo được**. `...\b.txt` bằng công cụ ghi file của app: **tạo được**.

**8.** Một agent phụ, đúng một việc (chạy lệnh liệt kê việc 6 trên `-r5\claude`, kèm nguyên văn QUY TẮC): báo **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r5\claude'` (errno -4048, code 'EPERM', syscall 'scandir').

**9.** `gh auth status`: `You are not logged into any GitHub hosts. To log in, run: gh auth login`; exit code 1.

**10.** App **có** cả hai công cụ: tìm web (`WebSearch`) và đọc trang (`WebFetch`). Đã gọi cả hai; cả hai chạy được. Không chép kết quả.

**11.** Tạo `_thu_ghi\a.txt` bằng shell: **tạo được**; app không hỏi, sandbox không chặn.

**12.** Công cụ sửa file của app **không hỏi** khi thêm/xóa dòng. sha256 trước: `671ca7ce4dc9502d97e3fe50d3e29f02ef84b9b4235b1f0d5c19e58fb388a6e6`. Sau khi thêm dòng `thu` ở cuối: `98555c0b1d3e879564cf9a6e49ef37dd2f709e45e3aa9f287529558c4a8a146f`. Sau khi xóa đúng dòng đó: `671ca7ce4dc9502d97e3fe50d3e29f02ef84b9b4235b1f0d5c19e58fb388a6e6` (khớp lại nguyên byte). `git status --short` sau cùng: rỗng. Không thấy file sao lưu nào app tạo trong worktree.

**13.** Chép exe sang `deepseek\_thu\`: **được** (5 649 408 byte). Script `run-exe.mjs` để trong `_thu`, chạy bằng Node 24 đặt đầu PATH. Mở bản chép với `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333`: cổng 9333 mở và có trang `http://tauri.localhost/` (`DEBUG_PORT=OK`, `TAURI_PAGE=YES`). Đóng exe bằng `taskkill /PID <pid> /T /F`: OK; sau 3 s `tasklist` không còn tiến trình `project2c.exe` (`REMAINING_PROCESSES=0`). Sandbox **không chặn** bước nào.

**14.** Node `v24.20.0`. `pnpm build:web`: exit code 0. Playwright `e2e/navigation.spec.ts --project=edge --no-deps`: **16 passed, 0 failed**, exit code 0. Sandbox **không chặn**.

**15.** `git -C C:\workspace\Project-2C-review status --short`: rỗng. Không xóa `_thu` / `_thu_ghi`.

### Ghi chú của Claude sau phiên thử (05/11/2026 ≈ 09:40)

- **So với kết quả dự kiến: đạt, không dừng đợt 2.** Credit của phiên thử: 9,74 (Owner báo).
- Việc 6: mọi mục chặn đều bị từ chối bằng lỗi quyền của Windows (`EPERM`, `Access is denied (os error 5)`), cả ở shell, công cụ của app lẫn agent phụ (việc 8).
  - Ở 6c (`-r4`) và 6e (`deep-review-1-6`), shell liệt kê được: đúng dự kiến ghi ở phần chuẩn bị, vì hai thư mục bị tách quanh mục của tài khoản khác.
  - Công cụ glob của app báo lỗi ở hai chỗ đó vì `rg` đi vào các mục con bị chặn. Bản ghi không chép tên mục con.
- **Việc 5, Git Bash:** 1 / 21 file test đỏ vì worker của vitest không khởi động kịp (`Timeout waiting for worker to respond`), không phải lỗi quyền.
  - Claude chạy lại đúng lệnh Git Bash đó hai lần (Node v24.20.0, cùng tài khoản và ACL): cả hai lần 21 / 21 file, 805 / 805 test xanh, exit 0.
  - Kết luận: lần đỏ là lỗi chập chờn, ACL không lan vào `node_modules`. Lượt chạy của Claude chỉ ghi cache của vitest (bị ignore); `git status --short` vẫn rỗng.
- Việc 1: model không thấy context, mức suy luận và expert trong ngữ cảnh của nó. **Owner ghi từ giao diện app (05/11):**
  - WorkBuddy **v5.9.4** (lượt 4: v5.9.3); model **Deepseek-V4.1-Flash**, Owner đã kiểm bằng fingerprint test là bản 1017; reasoning **Max**; context **1M**.
  - Phiên thử **không** tạo qua Code review expert; các gói A–F sẽ tạo qua expert. Vì vậy trước gói A chạy thêm một task kiểm ACL qua expert, như lượt 4 (`docs/reviews/raw/2026-10-31/common-baseline.md`, "Kiểm ACL với Code review expert"). Phụ lục V bỏ task này chỉ khi phiên thử đã chạy qua expert.
  - App hỏi duyệt **1 lần** trong phiên thử (một lệnh xóa). Chế độ quyền cho các gói: **Default**.
  - Credit dùng cho phiên thử: **9,74**. Owner chỉ theo dõi credit đã dùng, không ghi credit còn lại.
- **Log của app** (Owner chạy lệnh của plan §L4.9 đợt 2 bước 5, 05/11; output Owner dán cho Claude):
  - thư mục dữ liệu `C:\Users\<user>\.workbuddy-ai`; thư mục của worktree review `projects\c-workspace-Project-2C-review\`; file phiên đặt tên `<uuid>.jsonl`, như lượt 4;
  - file phiên của phiên thử: `bbdd4359-bf2f-49d4-bc50-57467aea0d2b.jsonl` (bước 7.3 chép cả file này, cùng thư mục `bbdd4359-…\subagents\` nếu có);
  - `types: session-meta, message, file-history-snapshot, ai-title, reasoning, function_call, function_call_result, credit-usage`;
  - 5 dòng là lệnh gọi công cụ có chữ `vitest` (`PowerShell`, `Bash`, `Agent`, `Bash`, `Edit`); dòng cuối **`True`**. Log có lệnh gọi công cụ, nên kiểm độc lập theo §L5.10 được.
- Việc 10, 11: như lượt 4. App có công cụ tìm web / đọc trang; ở Default, app ghi được ra ngoài workspace mà không hỏi. Chỉ ghi lại: prompt cấm cả hai.
- Việc 13, 14: ở Default, sandbox không chặn exe (cổng debug 9333) hay Playwright. Gói A–F vì vậy đo được trên exe và bản build web; không có lý do sandbox để ghi PLAUSIBLE.
- Đoạn "Xong", phần file (Claude làm, 05/11 ≈ 09:45): đã xóa `deepseek\_thu\` (a.txt, b.txt, bản chép exe, `run-exe.mjs`, `Project2C-data\project2c.lock`, `pw\.last-run.json`) và `-r5\_thu_ghi\` (a.txt). `deepseek\` giờ rỗng; `git -C C:\workspace\Project-2C-review status --short` rỗng. `Project-2C-review\apps\desktop\dist` do việc 14 dựng lại (bị ignore, các gói dùng được). Không còn tiến trình `project2c`.

### Kiểm ACL với Code review expert — 05/11/2026 09:40:54 +07:00

**1. Expert và model.** Expert đang dùng: **CodeReviewExpert**, đúng như khối expert của ngữ cảnh phiên; ngữ cảnh không hiện mã expert nên không ghi được mã. Model của expert: ngữ cảnh phiên không nêu; dòng model duy nhất ở đó là "This conversation is powered by DeepSeek-V4.1-Flash", là model của phiên, không phải của expert.

**2. `common\dot2-acl.json`** — đọc bằng công cụ đọc file của app: **đọc được**.

Từng mục, hai lần (shell = PowerShell, `& 'C:\Program Files\nodejs\node.exe' -e "…"`; công cụ app = glob limit 1 khi liệt kê, đọc 1 dòng khi đọc file):

- a. `-r5\claude` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r5\claude'`. App (glob limit 1): **bị từ chối**, `Error: glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- b. `-r5\codex` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r5\codex'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi `rg: .: IO error for operation on .: Access is denied. (os error 5)`.
- c. `-r4\claude` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r4\claude'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi `rg: .: … Access is denied. (os error 5)`.
  `-r4\codex` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r4\codex'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi trên.
- d. `-r3` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r3'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi `rg: .: … Access is denied. (os error 5)`.
  `-r2` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r2'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi.
- e. `deep-review-1-6\claude` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6\claude'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi `rg: .: … Access is denied. (os error 5)`.
- f. `~\.claude\projects\C--workspace-Project-2C-review` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.claude\projects\C--workspace-Project-2C-review'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi.
  `~\.claude\file-history\cb4c07af-bda1-4d1c-a11e-f7d7eece1182` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.claude\file-history\cb4c07af-bda1-4d1c-a11e-f7d7eece1182'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi.
  `%TEMP%\claude\C--workspace-Project-2C-review` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\Users\<user-8.3>\AppData\Local\Temp\claude\C--workspace-Project-2C-review'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi.
- g. `-r5\claude\_temp-9baf74bac889a6ec` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r5\claude\_temp-9baf74bac889a6ec'`. App (glob limit 1): **bị từ chối**, `Error: glob error : Error: Invalid parameters provided. Reason: Error: EPERM: operation not permitted, stat 'C:\workspace\deep-review-1-6-r5\claude\_temp-9baf74bac889a6ec'`.
- h. `-r5\claude\A.md` — shell (`openSync`): **bị từ chối**, `Error: EPERM: operation not permitted, open 'C:\workspace\deep-review-1-6-r5\claude\A.md'` (errno -4048, code `EPERM`, syscall `open`). App (đọc 1 dòng): **bị từ chối**, `EPERM: operation not permitted, access 'C:\workspace\deep-review-1-6-r5\claude\A.md'`.
  `-r5\codex\A.md` — shell (`openSync`): **bị từ chối**, `Error: EPERM: operation not permitted, open 'C:\workspace\deep-review-1-6-r5\codex\A.md'`. App (đọc 1 dòng): **bị từ chối**, `EPERM: operation not permitted, access 'C:\workspace\deep-review-1-6-r5\codex\A.md'`.
- i. `~\.codex\sessions` — shell (`readdirSync`): **bị từ chối**, `Error: EPERM: operation not permitted, scandir 'C:\Users\<user>\.codex\sessions'`. App (glob limit 1): **bị từ chối**, cùng dạng lỗi `rg: .: … Access is denied. (os error 5)`.
- j. `Project-2C-review-2\package.json` — shell (`openSync`): **bị từ chối**, `Error: EPERM: operation not permitted, open 'C:\workspace\Project-2C-review-2\package.json'`. App (đọc 1 dòng): **bị từ chối**, `EPERM: operation not permitted, open 'C:\workspace\Project-2C-review-2\package.json'`.

**Tổng:** 31 lần thử (1 lần đọc `dot2-acl.json` + 30 lần cho a–j) — **30 lần bị từ chối**, **1 lần đọc được**.

### Ghi chú của Claude sau task kiểm ACL qua expert (05/11/2026 ≈ 09:55)

- **Đạt.** Task chạy qua Code review expert: ngữ cảnh phiên có khối expert `CodeReviewExpert`; model của phiên là `DeepSeek-V4.1-Flash`. Lượt 4 expert (`ex_uZzSAScSy7FZ`) dùng cùng model.
- 30 / 30 lần thử mục bị chặn đều bị từ chối bằng lỗi quyền của Windows, cả ở shell lẫn công cụ của app. Lần đọc được duy nhất là `common\dot2-acl.json`, không bị chặn và đúng dự kiến.
- Tin nhắn trả lời của model trong app nói thư mục gốc `-r4` và `deep-review-1-6` "lần này bị chặn ngay". Đề mục trên không có lần thử nào ở hai thư mục gốc đó: mục c, e chỉ thử `-r4\claude`, `-r4\codex`, `deep-review-1-6\claude` như prompt. Câu đó là model tả sai trong tin nhắn; bản ghi ở đây đúng. Hai thư mục gốc vẫn liệt kê được như ghi ở phần chuẩn bị.
- Bước 7.3 chép thêm file phiên của task này (file `.jsonl` mới nhất sau phiên thử), cùng phiên thử và A–F.
- Owner báo sau task này (05/11):
  - file phiên của task kiểm ACL qua expert: `8f6369dd-3393-4803-bc62-883921c89edb.jsonl` (sửa lần cuối 09:42:04); credit dùng: **3,59**;
  - chạy lại `scan`: 2 274 file đọc, 119 thư mục / file không đọc được; `STOP` chỉ liệt kê đúng 2 transcript dự kiến (`83cbf8a1-…`, `ee02c71b-…`) → **đạt**, như đã chấp nhận ở phần chuẩn bị;
  - `scan` in thêm "not read (over 64 MB): `.codex\logs_2.sqlite`". File này nằm trong `entries` của `dot2-acl.json`; Claude mở thử: bị từ chối (65 MB). `scan` lấy được cỡ file qua thư mục cha nên in dòng này trước khi thử đọc. Không phải chỗ hở.
- Memory (Owner, 05/11): Memory của app đang tắt, nên không có mục nào để xem hay xóa ở bước 4 và trước gói A (0 mục). Lượt 4 tắt cả Cloud memory lẫn Local memory and skills.

### Các gói DeepSeek (Owner báo, Claude ghi)

| Gói | File phiên (`.workbuddy-ai\projects\c-workspace-Project-2C-review\`) | Credit dùng | Báo cáo |
|---|---|---|---|
| A | `b3d7c19a-7f24-4ef5-b9ea-295b16d20150.jsonl` | 33,12 | `deepseek\A.md` sửa lần cuối 10:05:28; dòng đầu `XONG`, nhưng ghi giờ "10:38", muộn hơn giờ sửa file: giờ model tự ghi, không đúng. `deepseek\A\` 21 file. Sau gói: `Project-2C-review` ở `37a80b6`, `git status --short` rỗng. |
| B | `6d93ee5e-8cd7-448f-8369-63035aba327a.jsonl` | 41,53 | `deepseek\B.md` sửa lần cuối 10:30:06; dòng đầu `XONG`, giờ 10:29. `deepseek\B\` 20 file. Sau gói: `37a80b6`, `git status --short` rỗng. |
| C | `701f6b50-c63b-4924-af34-2660ee58d3ea.jsonl` | 55,22 | `deepseek\C.md` sửa lần cuối 10:55:32; dòng đầu `XONG`, giờ 10:56. `deepseek\C\` 44 file. Sau gói: `37a80b6`, `git status --short` rỗng. |
| D | `78e46895-73b9-409a-a954-1e56484afc18.jsonl` | 16,69 | `deepseek\D.md` sửa lần cuối 11:14:50; dòng đầu `XONG`, giờ 11:14. `deepseek\D\` 651 file, phần lớn là output Playwright `pw\` (631 file, ≈ 100 MB). Sau gói: `37a80b6`, `git status --short` rỗng. |
| E | `1b395b0e-e995-4f12-84c7-7b93d78cf858.jsonl` | 18,74 | `deepseek\E.md` sửa lần cuối 12:21:01; dòng đầu `XONG`, giờ 12:21. `deepseek\E\` 1 752 file, phần lớn là output Playwright `pw\` (1 721 file, ≈ 161 MB). Sau gói: `37a80b6`, `git status --short` rỗng; `deepseek\A\`–`D\` không có file nào sửa sau báo cáo của gói đó. |
| F | `3b530e6f-9e88-4b60-ac29-e0cada0af3be.jsonl` | 22,08 | `deepseek\F.md` sửa lần cuối 12:40:49; dòng đầu `XONG`, giờ 12:40. `deepseek\F\` 24 file. Sau gói: `37a80b6`, `git status --short` rỗng; `deepseek\A\`–`E\` không có file nào sửa sau báo cáo của gói đó. |

Credit đã dùng: 6 gói 187,38; hai task thử 13,33 (phiên thử 9,74, kiểm expert 3,59); cả đợt 2 **200,71**.

### Bước 7 — đóng đợt 2 (05/11/2026, Claude ghi)

- **7.1–7.2** (Owner): đã đăng xuất app WorkBuddy và thoát app. Claude kiểm lúc ≈ 12:55: không còn tiến trình nào chạy từ thư mục WorkBuddy.
- **7.3** (Owner chạy lệnh chép Claude đưa): chỉ chép `<id>.jsonl` cùng `<id>\tool-results\` và `<id>\subagents\` (nếu có), không chép gì khác của thư mục dữ liệu app.
  - Gói A–F: `deepseek\<gói>\session\`, mỗi gói có `tool-results\`, không gói nào có `subagents\`.
  - Hai task thử: `deepseek\thu\session\` — `bbdd4359-…` (phiên thử, có `subagents\` của việc 8) và `8f6369dd-…` (kiểm ACL qua expert).
  - Lệnh kiểm in `OK: đủ log A–F`.
- **Claude kiểm nhanh bản chép** (chỉ đếm, không in nội dung; kiểm đủ theo §L5.10 là việc của phiên tổng hợp):
  - Mỗi phiên A–F có tin nhắn mở "Gói X." đúng gói đó; lệnh gọi công cụ đầu tiên là Read file `prompt-deepseek.md`.
  - Không gói nào gọi Agent, WebSearch hay WebFetch. Đầu vào lệnh gọi công cụ của A–F không chạm `-r5\claude`, `-r5\codex`, `-r4` / `-r3` / `-r2`, `deep-review-1-6\`, `Project-2C-review-2`, `.codex`, `.claude`, `%TEMP%\claude`, `icacls`, `dot2.mjs`.
  - Ba chỗ khớp mẫu đều không phải vi phạm:
    - B: câu "Không đọc: … `~/.workbuddy*`" trong báo cáo;
    - D: chữ "curly quotes" khớp mẫu `curl` trong một probe ký hiệu;
    - F: gói F dựng một `gh` giả (`deepseek\F\shim\`, `fake-gh.mjs`) để chạy `tools/auto-wait.mjs` không cần mạng. Lệnh có chữ `gh` là `which -a gh` và các lệnh chạy qua bản giả; suốt đợt 2 `gh` thật đã đăng xuất. Phiên tổng hợp xem lại khi kiểm log.
  - Hai task thử chạm các mục bị chặn, vì đó là việc của chúng.
- **7.4** `dot2.mjs remove`: `OK: denies removed from 236 entries, all readable again but the 1 above, which did not read before deny either`. Mục đó là `.codex\.sandbox-bin` (owner `DESKTOP-KDURKJP\<user>`), như dự kiến. `dot2-acl.json` đã đổi tên thành `dot2-acl.removed.json`.
  - Claude mở lại được: `-r5\claude`, `-r5\codex`, `claude\_temp-9baf74bac889a6ec`, `-r4\claude`, `-r3`, `-r2`, `deep-review-1-6\claude`, `.codex\sessions`, `projects\C--workspace-Project-2C-review`, `%TEMP%\claude\C--workspace-Project-2C-review`, `Project-2C-review-2\node_modules`, `Project-2C-review-2\package.json`.
  - Không cần quyền SYSTEM như lượt 4.
- **7.5** so hash: `OK: 12 báo cáo không đổi`.
- **7.6** `gh auth status`: đã đăng nhập `AlexH-AI`.
- `claude\_temp-9baf74bac889a6ec\` (thư mục tạm của các phiên Claude ở worktree review, chuyển vào ở phần chuẩn bị) để nguyên ở đó làm bằng chứng.
- **Ghi chú quy trình cho lượt sau** (phiên tổng hợp đưa vào ghi chú, cùng các ghi chú khác của đợt 2):
  - `dot2.mjs` chỉ chặn `%TEMP%\claude\<tên thư mục làm việc>`, mà Claude Code bản hiện tại để thư mục tạm của phiên ở `%TEMP%\claude\<mã băm>\<id phiên>\`;
  - `deny` coi hard link giữa hai mục cùng bị chặn (hai thư mục `file-history` của phiên gốc và phiên rẽ nhánh) là link ra ngoài, nên `STOP` cả lệnh.
