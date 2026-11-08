# Baseline — deep review Phase 1–6, lượt 6

- **Máy:** Home PC **`DESKTOP-KDURKJP`** (`hostname`). Bước chuẩn bị bắt đầu **07/11/2026 10:49:29 +07:00** (`Get-Date`); giờ từng bước ghi ở dưới và trong `gates\summary.txt`, `perf\run-exe.log`. Bước chuẩn bị, cả ba bên và mọi số đo của lượt 6 chạy trên máy này (plan §L6.2); số đo so với mốc **cùng máy** (plan §L6.6): mốc Home PC sau #656, G7 (`233c77e`) và lượt 5 (`37a80b6`). Phiên chuẩn bị chạy ở checkout chính `C:\workspace\Project-2C` (phiên app "coding-ses1" `local_2acafecb`, phiên CLI mới `56704a9f…`; xem mục "Mốc đợt 2").
- **Sổ ghi chú:** sau `git fetch`, mục OPEN của `docs/state/review-notes.md` ở `origin/main` (`5b1328a`) không còn mục lá chặn phát hành ✅: 5 mục lá, đều nhãn **[sau v1.0]** (K48): 4 từ review PR #1127 (T-386), 1 từ review PR #1128 (T-388). Không PR mở; Issue mở duy nhất là HANDOFF #284.
- **SHA ghim:** **`5b1328a`** (`5b1328ae236aa62981dbf43066ff544a9e832c8c`) = `git rev-parse origin/main` lúc 07/11/2026 10:49 (#1130, PR sổ của review #1128, T-388). Checkout chính cũng ở `5b1328a`, sạch. Từ SHA ghim tới lúc chạy chỉ có thay đổi docs (plan §L6.2); từ đây tới phát hành v1.0 là đóng băng code (K49).
- **Code so với lượt 5:** `git diff --stat 37a80b6 5b1328a -- . ':(exclude)docs/**' ':(exclude)*.md'`: **61 file, +2 269 / −236** (`gates\diff-stat-37a80b6-5b1328a.log`). Lúc soạn kế hoạch (`b3721f4`): 60 file, +2 252 / −236; phần thêm từ `b3721f4` là `.github/ISSUE_TEMPLATE/task.yml` (+17) của T-386 (#1120, PR #1127). Từ `b3721f4` tới SHA ghim có 10 commit (`gates\commits-b3721f4-5b1328a.log`): T-385 (kế hoạch, #1118 + PR sổ #1119, #1122), T-387 (`dot2.mjs` lượt 6, #1123 + #1124, #1126), T-386 (#1127 + #1129), T-388 (#1128 + #1130). Ngoài T-386, không Issue nào đổi code hay test, nên **không thêm dòng R2** (plan §L6.9 bước 1).
- **Thư mục:** `C:\workspace\deep-review-1-6-r6\` chưa có trước bước chuẩn bị ✅; đã tạo `common\`, `claude\`, `codex\`, `workbuddy\` (ba thư mục sau để rỗng).
- **Hai file mốc** (plan §L6.6, §L5.6), có và đúng sha256 ✅:
  - `C:\workspace\deep-review-1-6-r5\common\perf\perf-ref.json`: 5 155 B, sha256 `1B889F52DFB5E5A5CCA1AD8F9A49E0FCE64EA5A6B9B664E5F5A0C40BA42186B9`; chép thành `perf\perf-ref-r5.json` (cùng sha256);
  - `C:\workspace\g7-home-pc\lan-2\perf\perf-g7.json`: 5 143 B, sha256 `995E92383FED0A857D255596F9C3246517B7CE53E8B6B6D95B301EA6043CDFEE`; chép thành `perf\perf-g7.json` (cùng sha256).
- **App WorkBuddy:** Owner xác nhận đã đăng xuất app WorkBuddy trên Home PC (07/11/2026 ≈ 11:02, trong phiên chuẩn bị; Phụ lục P, ranh giới tài khoản). Phiên chuẩn bị không mở app, không đọc thư mục dữ liệu của app.
- **Worktree review** (bước 3): `C:\workspace\Project-2C-review` (trước ở `c3bd22e`, head PR #1128 vừa review) và `C:\workspace\Project-2C-review-2` (trước ở `e5daf5d`) đều `checkout --detach 5b1328a`. Không phiên Claude nào đang chạy ở hai worktree (danh sách phiên của app, `isRunning` false). Đã xóa `apps\desktop\dist` ở cả hai và `apps\desktop\src-tauri\target\` ở `Project-2C-review` (`-review-2` không có); `pnpm install --frozen-lockfile` (pnpm 12.6.0) ở cả hai; `git status --short` rỗng ở cả hai.
- **File chung** (bước 4; dựng bằng script từ `git cat-file blob 5b1328a:…` và `gh … --json`, không chép tay; script trong scratchpad của phiên chuẩn bị). Cách trích prompt và khối code đã thử trước trên `-r5\common\plan.md`: tái tạo đúng từng byte `prompt-claude.md`, `prompt-codex.md`, `prompt-deepseek.md` và `dot2.mjs` của lượt 5.
  - `plan.md`: bản ở `5b1328a`, trùng blob (`git hash-object` = `6d430c6`), 5 847 dòng, sha256 `1A96CC7DDD48DE6266A0119F9112E0A75A98DA46D9140E2A34D7A1E7C484A726`.
  - `prompt-claude.md` = Phụ lục W + Phụ lục Y (171 dòng); `prompt-codex.md` = Phụ lục X + Phụ lục Y (169 dòng); `prompt-workbuddy.md` = phần prompt của Phụ lục Z + Phụ lục Y (179 dòng). Khối trích dẫn chép nguyên văn, bỏ dấu `> `, hai phần cách một dòng trống, như lượt 3–5. `{SHA}` → `5b1328a`, `{SHA_ĐỦ}` → đủ 40 ký tự; `{GÓI}` để nguyên (23 / 19 / 21 chỗ). Không còn chỗ `{SHA` nào.
  - `dot2.mjs`: khối `js` của Phụ lục Z (T-387, T-388; `plan.md` dòng 5323–5846), nguyên văn, 524 dòng, sha256 `04A5BC57685BBC0C965A1859540F57DCF9A0CE7103C90CC5FF3AB8C7CEECFA0F`; `node --check` qua.
  - `known.md` (§L6.5, dựng mới ở SHA ghim, 277 dòng): (1) OPEN (5 mục [sau v1.0], giữ đoạn đầu mục) và ACCEPTED nguyên văn của `review-notes.md`; (2) K1–K46 chép từ bảng của `docs/reviews/raw/2026-11-05/common-known.md`, K17 thêm "agent WorkBuddy" và M13 (cả cột nguồn), K40 thêm câu cuối "Lượt 6: thay bằng K48 (mục [sau v1.0] không chặn ghim SHA)", K47 một dòng "Lượt 6: thay bằng K48", cộng K48–K50 nguyên văn bảng §L6.5; (3) "Lệch mockup đã biết" của `nghiem-thu-v1.md` nguyên văn (34 dòng); (4) bảng R1 (20 dòng) và KNOWN theo mã, (5) bảng R2 (14 dòng), nguyên văn §L6.5, cộng một dòng của bước chuẩn bị (không thêm dòng R2).
  - `fixes.md` (3 232 dòng): thân **22 Issue** của hai bảng §L6.2 và **22 PR** của chúng (mỗi Issue đúng một PR, theo `closedByPullRequestsReferences`), nguyên văn, tiêu đề trong thân hạ hai cấp như lượt 4–5; sau thân PR là **14 nhóm RESOLVED** của sổ ở SHA ghim theo nhãn "— T-xxx (" ở dòng đầu nhóm (8 Issue không có nhóm nào: T-363…T-366, T-368…T-370, T-379). Kiểm khi dựng: Issue đều CLOSED, PR đều MERGED, commit merge trùng cột Commit của §L6.2 và nằm trong lịch sử của `5b1328a`; không nhóm nào khác nêu các mã T đó ở dòng đầu. Thân PR chép cả, như lượt 4–5 (PR theo mẫu "Thay đổi", "Test chấp nhận", "Ghi chú OPEN liên quan", "Kiểm tra").
  - `files-A.txt` … `files-F.txt`: mọi file git theo dõi ở `5b1328a` mà `classifyFile` (`tools/size-report-core.mjs` ở SHA ghim) xếp vào gói, trừ file sinh tự động; mỗi dòng đường dẫn, tab, loại (`product`, `test`, `product+test` = file Rust có khối `#[cfg(test)]`). Số file: A 91 (+13 sinh = 104), B 21, C 65, D 89, E 52, F 99 (+1 sinh = 100); tổng kể cả file sinh 431, như §L6.3; không file nào "Chưa xếp gói".
  - Các file chung trên **không có dòng nào khớp `MARKER`** của `dot2.mjs` (kiểm từng dòng sau khi dựng, chỉ in số đếm).
- **File đã có chuỗi lượt 6 trước mốc** (plan §L6.9 bước 4, T-388). Trước khi ghi mốc, phiên chuẩn bị chạy thử vòng đọc của `scan` (bản chép tạm của `dot2.mjs` trong scratchpad, `COMMON` ghim vào `-r6\common`, chỉ gọi `marked(-Infinity)`, không ghi mốc, không `icacls`; 197 200 file đọc, 232 s), rồi `baseline` thật in lại đúng danh sách đó. **17 file**, chỉ in đường dẫn, không mở file nào, không in dòng khớp; thuộc 6 phiên CLI (id là tên `<id>.jsonl` / thư mục `<id>`), đối chiếu với danh sách phiên của app (`%APPDATA%\Claude\claude-code-sessions\local_*.json`, chỉ đọc id, tên phiên, `isArchived`):

  | Id CLI | File | Phiên app (`cliSessionId` hiện tại hay `priorCliSessionIds`) | Việc của phiên (§L6.9 bước 4) |
  |---|---|---|---|
  | `444c84c2…` | transcript ở checkout chính; 7 file `file-history`; 2 file scratchpad (`%TEMP%\claude\4f7e6602815f66dc\…`) | "coding-ses1" `local_2acafecb` (**chính phiên app chuẩn bị**), id CLI trước `/clear` | soạn kế hoạch, tạo #1121 |
  | `2d37b077…` | transcript ở checkout chính | "Auto-issues skill queue runner" `local_6fbde9c2`, id trước | phiên điều phối `auto-issues` |
  | `78643e86…` | transcript ở checkout chính | "coding-ses1" `local_d854029e`, id trước | `coding-ses1` |
  | `e468a70f…` | transcript ở checkout chính | "coding-ses2" `local_96dec901`, id trước | `coding-ses2` |
  | `eac7a5f3…` | transcript ở `Project-2C-review`; scratchpad `%TEMP%\claude\9baf74bac889a6ec\…` | "review-1" `local_b2936db6`, id trước | review PR #1118 |
  | `13151be9…` | transcript ở `Project-2C-review-2`; scratchpad `%TEMP%\claude\172d166a8e27758b\…` | "review-2" `local_f7ffb665`, **id hiện tại** | review PR #1123 |

  - Mọi file ghi lần cuối trước khi phiên chuẩn bị mở (muộn nhất 09:39:36; phiên CLI chuẩn bị `56704a9f…` tạo 10:48:47). Bản kế hoạch ở `Project-2C-review` không còn trong danh sách (bước 3 đã đưa worktree về SHA ghim). Không file nào của phiên CLI chuẩn bị `56704a9f…`.
  - **Lệch §L6.9 bước 4, Owner quyết 07/11/2026 ≈ 11:37:** kế hoạch bảo Owner lưu trữ các phiên đó trước `baseline`, và dừng khi gặp file của chính phiên chuẩn bị. Phiên chuẩn bị hỏi; Owner trả lời "không lưu" (5 phiên kia) và "không cần lưu" (file `444c84c2…` của chính phiên app này, phiên CLI trước `/clear`). Không phiên nào được lưu trữ; `baseline` chạy tiếp.
  - **Hệ quả cho đợt 2:** `scan` dừng ở mọi file trên sửa sau mốc. Tới hết `scan` của đợt 2, không gửi tin nhắn nào vào phiên "review-2" `local_f7ffb665` (id CLI hiện tại của nó là `13151be9…`, có trong danh sách), không chạy lại phiên CLI cũ nào trong bảng. Bốn phiên app còn lại ghi vào id CLI hiện tại của chúng, không có trong danh sách; chúng chỉ làm `scan` dừng nếu đọc lại kế hoạch bản cũ, thân #1121 hay báo cáo lượt 6.
- **Mốc đợt 2** (cuối bước 4): `node C:\workspace\deep-review-1-6-r6\common\dot2.mjs baseline` từ 07/11/2026 11:38:18 tới **11:41:55 +07:00** (giờ ghi `dot2-baseline.json`), sau khi mọi file chung trên đã ghi và trước mọi lệnh ghi vào worktree của bước 6–7 (bước 5 chạy ở checkout chính). `common\dot2-baseline.json`: `Project-2C-review` 9 mục (`.claude\settings.local.json`, `apps\desktop\src-tauri\gen\` và 5 mục trong đó, `test-results\`, `test-results\.last-run.json`), `Project-2C-review-2` 8 mục (`gen\` và 5 mục trong đó, `test-results\`, `test-results\.last-run.json`). Lượt 5: 7 / 6 mục; thêm `test-results\` có từ trước (bước 3 không xóa).
- Log đầy đủ của từng cổng: `gates\*.log`; tóm tắt `gates\summary.txt`.

## Dữ liệu tải (bước 5)

`common\load\load-2026-10-12-seed6.p2cbackup` (`node tools/load-data.mjs --out …` ở SHA ghim, mốc `2026-10-12`, seed `6`, 6,4 s, bắt đầu 10:57:10; `gates\load-data.log`). Chạy ở **checkout chính** (cùng `5b1328a`, sạch) thay vì `Project-2C-review` như lượt 5, vì bước này chạy trước mốc đợt 2 mà không được ghi gì vào worktree review trước mốc; code giống hệt. 1 496 KH, 10 414 lịch hẹn, 1 510 `appointment_coordinators`, 54 nhân sự, 5 team, 1 697 hợp đồng, 103 `ai_analyses`, 5 672 `kyc_notes`, 13 114 `kyc_versions`, 13 833 `kyc_facts`, 4 941 `stage_transitions`; 16 034 517 B, sha256 file `F952E0625879A271726610D3388E42C6C366EF5933CFA062768727F139EC13A0`.

**`tables` sha256 `e256e4f18699f4a4e494b59a92ef46865eb4d2c9887f4ff1e7a6b872b4b345a2`** = hash lượt 5 và G7 (plan §L6.6) ✅, cùng số dòng. Luật nhập mã KH của T-368 (K50) không đổi dữ liệu tải.

## Cổng ở SHA ghim (bước 6; `Project-2C-review`, 07/11/2026)

`gates\run-gates.ps1` chạy liền sau mốc đợt 2, gỡ hẳn biến `CI` trước `pnpm build:exe` (bài học lượt 4, lần 1), nên `build:exe` qua ngay lần đầu. Node `v24.20.0`, pnpm 12.6.0, rustc / cargo 1.98.1 (`gates\summary.txt`). `git status --short` trước cổng: rỗng.

| Cổng | Kết quả | Thời gian |
|---|---|---|
| `pnpm verify` | ✅ 130 file test, **4 493 test** (lượt 5: 130 / 4 387); `lint:deps`: no dependency violations (354 module, 1 582 dependency; như lượt 5); token-guard, `codemap:check` ("Export maps are up to date"), typecheck sạch; coverage Stmts 99.24 % · Branch 97.45 % · Funcs 99.15 % · Lines 99.39 % (lượt 5: 99.21 / 97.4 / 99.13 / 99.38) | 143 s (bắt đầu 11:42:11) |
| `pnpm verify:rust` | ✅ fmt + clippy `-D warnings` sạch; **120 test** Rust (như lượt 5); `target\` dựng từ đầu | 85 s (11:44:33) |
| `pnpm e2e` (`CI=1`) | ✅ exit 0: **329 passed**, không flaky, không chạy lại (12 worker; lượt 5: 324 passed) | 172 s (11:45:59 → 11:48:50) |
| `pnpm build:exe` (không đặt `CI`) | ✅ `project2c.exe` release **5 649 408 byte** (= lượt 5 `37a80b6`, lượt 4 và G7 `233c77e`; +235 008 so `b139d8a`), sha256 `E8C4B5D260329728451502E822E1EAEA069164CCE9326111110D8309CD2483D8` → `common\exe\project2c.exe`. Build cục bộ, nên sha256 khác exe của CI và khác bản build cục bộ của lượt 5 | 108 s (11:48:50) |
| `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` | ✅ chạy sau khi có exe. Không có dòng "Chưa xếp gói" | 0,3 s (11:50:38) |
| `node gates\diff-by-package.mjs 37a80b6 5b1328a` | ✅ diff sửa theo gói (`gates\diff-37a80b6-5b1328a.log`) | 0,1 s (11:50:38) |

`git status --short` của `Project-2C-review` sau cổng: rỗng. Mọi thứ cổng sinh ra trong worktree (`dist`, `target\`, `test-results\`, coverage, cache) nằm ngoài `dot2-baseline.json` hoặc là file có sẵn được ghi đè (`test-results\.last-run.json`), nên đợt 2 bước 1 (`dot2.mjs clean`) xử lý. `target\` lúc ghi mốc chưa có (bước 3), nên `clean` xóa trọn bản build của bước 6.

### Bundle web (`pnpm build:web` trong `build:exe`; cột Δ so `b139d8a` theo `size-report`, cột cuối Δ so lượt 5 `37a80b6`)

| File | Thô (byte) | Δ `b139d8a` | Gzip (byte) | Δ `b139d8a` | Δ lượt 5 (thô / gzip) |
|---|---:|---:|---:|---:|---|
| `assets/chart.js` | 513 302 | 0 | 172 450 | 0 | 0 / 0 |
| `assets/exceljs.min.js` | 929 569 | 0 | 255 572 | 0 | 0 / 0 |
| `assets/index.js` | 894 865 | +2 923 | 265 040 | +3 030 | +2 681 / +749 |
| `assets/index.css` | 30 387 | +2 023 | 6 835 | +423 | +92 / +14 |
| `assets/rolldown-runtime.js` | 1 106 | 0 | 627 | 0 | 0 / 0 |
| **Tổng JS / CSS** | 2 369 229 | +4 946 | 700 524 | +3 453 | +2 773 / +763 |
| Tệp khác (19 file: wasm, font, ảnh, `index.html`) | 1 022 121 | +172 925 | — | — | 0 (như lượt 5) |

So plan §L6.6 (lượt 5: JS / CSS 2 366 456 B, `index.js` 892 184 B, exe 5 649 408 B): JS / CSS +2 773 B (+0,12 %), `index.js` +2 681 B (+0,30 %), exe 0 B. Số liệu ghi lại, không phải kết luận (bước chuẩn bị không ghi phát hiện; Claude G và gói F xét).

### Coverage theo vùng (chỉ dòng < 100 %; `gates\verify.log`)

| Vùng | Stmts | Branch | Funcs | Lines | Lượt 5 (Stmts / Branch / Funcs / Lines) |
|---|---:|---:|---:|---:|---|
| `apps/desktop/src/data` | 98.73 | 97.22 | 97.45 | 99 | 98.52 / 96.7 / 97.45 / 98.99 |
| `apps/desktop/src/routes` (gốc) | 99.66 | 95.12 | 100 | 100 | 99.6 / 94.84 / 100 / 100 |
| `routes/appointments` | 99.59 | 93.58 | 100 | 99.49 | như lượt 5 |
| `routes/customers` | 98.91 | 97.46 | 99.21 | 99.34 | như lượt 5 |
| `routes/overview` | 98.5 | 94.26 | 98.63 | 98.77 | như lượt 5 |
| `routes/reports` | 100 | 93.63 | 100 | 100 | như lượt 5 |
| `apps/desktop/src/shell` | 85.03 | 92.52 | 82.22 | 85.04 | như lượt 5 |
| `packages/db/src` | 99.6 | 97.75 | 100 | 99.8 | 99.6 / 97.74 / 100 / 99.8 |

Vùng không có trong bảng: 100 % (vitest `skipFull`).

### Cỡ dòng theo gói và diff sửa (plan §L6.3 ở SHA ghim)

`gates\size-report.log` (số dòng) và `gates\diff-37a80b6-5b1328a.log` (diff sửa = `git diff --numstat -M 37a80b6 5b1328a` ngoài `docs/**` và mọi file `*.md`, xếp gói bằng `classifyFile`, file Rust tính cả phần test là SP; script `gates\diff-by-package.mjs` của lượt 5, không đổi). So bảng §L6.3 lúc soạn (`b3721f4`): **chỉ gói F đổi**, vì `.github/ISSUE_TEMPLATE/task.yml` (+17, T-386) là file sản phẩm của gói F; mọi gói khác trùng từng số. Cột R1 / R2 theo §L6.3; bước chuẩn bị không thêm dòng R2 (`known.md` phần 5).

| Gói | SP (Δ lượt 5) | Test (Δ) | Sinh (Δ) | File (Δ) | Diff sửa SP | Diff sửa test | R1 (Claude) | R2 (Claude) |
|---|---:|---:|---:|---:|---|---|---|---|
| A. Lõi dữ liệu | 8 781 (+33) | 15 965 (+160) | 341 (0) | 104 (0) | +41 / −8 · 6 file | +182 / −22 · 7 file | 158, 159, 160 | T-377 |
| B. File và Rust | 2 465 (+8) | 5 762 (+162) | 0 (0) | 21 (0) | +13 / −5 · 2 file | +172 / −10 · 2 file | 161–163 | T-374, 381, 382, 384 |
| C. AI | 6 610 (+30) | 8 262 (+60) | 0 (0) | 65 (0) | +46 / −16 · 5 file | +65 / −5 · 2 file | 164–168 | T-375 |
| D. Màn nhập liệu | 8 230 (+96) | 3 271 (+177) | 0 (0) | 89 (0) | +124 / −28 · 8 file | +177 / −0 · 1 file | 169, 170 | T-376 |
| E. Lịch hẹn, chỉ số, quản lý | 8 466 (+194) | 5 024 (+324) | 0 (0) | 52 (0) | +274 / −80 · 12 file | +334 / −10 · 2 file | 160, 170, 172–174 | T-377, 380, 382 |
| F. Xuyên gói, bloat / hiệu năng, công cụ | 5 034 (+148) | 19 068 (+641) | 4 628 (0) | 100 (0) | +176 / −28 · 4 file | +665 / −24 · 10 file | 165 (đo), 167, 171, 175–177; **R1 gộp đủ 20 dòng** | T-371, 372, 373, 375, 378, 379, 383; **R2 gộp đủ 14 dòng** |
| **Tổng** | 39 586 (+509) | 57 352 (+1 524) | 4 969 (0) | 431 (0) | | | | |

- **Diff sửa `37a80b6..5b1328a`** ngoài `docs/**` và mọi file `*.md`: **61 file, +2 269 / −236**; không file nhị phân, không file sinh, không migration; mọi file đều xếp được gói.
- `.yml` là đuôi được đếm (không có ở dòng "Không đếm" của `size-report`); `task.yml` vào gói F theo luật `^\.(?:github|githooks|claude)\/` của `PACKAGES` (lúc soạn: F SP 5 017, nay 5 034).

## Đo trên exe và trong Node (bước 7; 07/11/2026 11:50:54 → 11:56:20)

`perf\run-perf.ps1` chạy liền ngay sau cổng, máy rảnh, cửa sổ exe ở trên cùng (Owner đồng ý trước khi chạy: "Chạy ngay khi cổng xong"): `perf\purge-node.mjs` (11:50:54 → 11:51:03) rồi `perf\run-exe.ps1` (11:51:03 → 11:56:20; log `perf\run-exe.log`), trên `common\exe\project2c.exe` (sha256 `E8C4B5D2…2483D8`), cổng debug 9222.

- Script: chép từ `C:\workspace\deep-review-1-6-r5\common\perf\` các `.ps1`, `.mjs` (`run-perf.ps1`, `run-exe.ps1`, `first-open.mjs`, `import-load.mjs`, `reopen-marks.mjs`, `purge-exe.mjs`, `purge-node.mjs`, `tables.mjs`, `compare.mjs`; không chép kết quả). `run-exe.ps1` chỉ đổi chú thích đầu, `$c` = `-r6\common` và `PERF_NOTE` = `DESKTOP-KDURKJP, exe 5b1328a, deep review luot 6`; `run-perf.ps1` chỉ đổi chú thích và thư mục. `$repo` = `C:\workspace\Project-2C-review` ở SHA ghim, như lượt 4–5.
- Thứ tự trong `run-exe.ps1`: (1) mở app lần đầu 3 lần (cách T-227); (2) `perf\run\`: mở exe (seed demo), nhập dữ liệu tải qua cổng debug, đóng. Sau khi nhập, Cài đặt → Dữ liệu ghi "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ" (như lượt 5, G7); (3) mở lại trên dữ liệu tải 3 lần; (4) mở lại lần nữa, nối probe ngay (`PERF_RUNS` 5 mặc định; 1 passed, 2,8 phút); (5) Dọn sạch Thùng rác một lần trên exe.
- Kỳ của probe: **kỳ Năm 2026** (`Lịch năm 2026, 0 back: 79 met`), **kỳ Tháng 10/2026** (`Lịch tháng 10/2026, 1 back: 10 days met`), như lượt 5 và G7, nên cả ba bảng so được mọi dòng.
- `perf\perf-ref.json`: 5 138 B, sha256 `A08FAEA77329CF2DCF21EFBBAAC61C7DD9F1A9625F1D85C97DBBD403B6A3FD6C`.

**Kết quả: không dòng nào ⚠️ ở cả ba bảng probe (so mốc sau #656, so G7, so lượt 5); mọi thao tác trong ngưỡng `phase-6.md` (không ô ❌).** Mở lần đầu (LCP), mở lại và Dọn sạch đều trong ngưỡng; không dòng phụ nào quá luật nhiễu so lượt 5. Số liệu ghi lại, không phải kết luận (bước chuẩn bị không ghi phát hiện; gói F xét).

### Mở app lần đầu (cách T-227, Home PC)

`perf\first-open\first-open.json`: mỗi lần chép exe vào thư mục mới `perf\first-open\run-<n>\` (chưa có `Project2C-data\`, app sinh seed demo), mở với cổng debug 9222, chờ 12 s rồi nối CDP đọc mốc trong trang; lúc gọi exe ghi bằng `Date.now()` ngoài exe. "Màn đầu có số liệu" = LCP; cả 3 lần phần tử LCP là `IMG` (như lượt 5).

| Mốc | Lần 1 | Lần 2 | Lần 3 | Trung vị | Mốc sau #656 `dae9df3` | G7 `233c77e` | Lượt 5 `37a80b6` | Xấu hơn? |
|---|---:|---:|---:|---:|---|---|---|---|
| Gọi exe → trang bắt đầu | 431 | 370 | 404 | 404 ms | — | 354 ms | 395 ms | — |
| Sinh seed demo (`p2c:demo-seed`) | 2 911 | 2 884 | 2 892 | 2 892 ms | 3 060 ms | 2 847 ms | 2 800 ms | — (+92 ms, +3 % so lượt 5) |
| Trang bắt đầu → mở xong dữ liệu (`p2c:data-open`) | 3 107 | 3 062 | 3 051 | 3 062 ms | 3 240 ms | 2 994 ms | 2 974 ms | — (+88 ms, +3 % so lượt 5) |
| Lưu file DB lần đầu (`p2c:db-save`) | 150 | 151 | 153 | 151 ms | 119 ms | 123 ms | 150 ms | +1 ms so lượt 5. So mốc sau #656 (+32 ms, +27 %) và G7 (+28 ms, +23 %) vẫn quá luật nhiễu như lượt 5 đã ghi; plan chỉ đặt ngưỡng mở lần đầu cho LCP |
| **Gọi exe → màn đầu có số liệu (LCP)** | 3 759 | 3 578 | 3 612 | **3 612 ms** | 3 663 ms | 3 420 ms | 3 535 ms | ✅ không (+77 ms, +2 % so lượt 5; luật nhiễu: > 4 396 ms; "không chậm hơn exe Phase 4": > 4 724 ms) |

File `project2c.db` sau lần đầu: 9 969 664 byte (= lượt 5 và G7).

### Mở lại trên dữ liệu tải (3 lần; `perf\reopen.json`)

Cùng cách đo như mở lần đầu (chờ 12 s rồi nối CDP), thư mục `perf\run\` đã nhập dữ liệu tải; `project2c.db` 14 102 528 byte. Phần tử LCP `DIV` cả 3 lần (như lượt 5, G7).

| Mốc | Lần 1 | Lần 2 | Lần 3 | Trung vị | G7 `233c77e` | Lượt 5 `37a80b6` | Xấu hơn? |
|---|---:|---:|---:|---:|---|---|---|
| Gọi exe → trang bắt đầu | 267 | 264 | 264 | 264 ms | 245 ms | 270 ms | — |
| Trang bắt đầu → mở xong dữ liệu (`p2c:data-open`) | 372 | 361 | 365 | 365 ms | 317 ms | 334 ms | ✅ không (+31 ms, +9 % so lượt 5; +48 ms, +15 % so G7) |
| **Gọi exe → màn đầu có số liệu (LCP)** | 691 | 680 | 688 | **688 ms** | 617 ms | 710 ms | ✅ không (−22 ms so lượt 5; +71 ms, +12 % so G7; luật nhiễu so G7: > 740 ms) |

### Hiệu năng trên exe (probe `e2e/perf`, Home PC): so mốc sau #656

`perf\perf-ref.json` — **đây là số để so** khi reviewer đo trên exe ở máy này. Cột Nền = `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` (exe `dae9df3`, 18/10). Cột Ngưỡng theo `docs/metrics/phase-6.md`. Bảng sinh bằng `perf\tables.mjs` (`parseRun` / `markdownTable` của `e2e/perf/stats.ts`); bản ghi file: `perf\table-vs-656.md`.

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 364 ms | 364 ms | 364 ms | 387 ms | −23 ms (−6%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 979 ms | 970 ms | 1011 ms | 835 ms | +144 ms (+17%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 44 ms | 41 ms | 49 ms | 43 ms | +1 ms (+2%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 147 ms | 144 ms | 156 ms | 151 ms | −4 ms (−3%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 406 ms | 394 ms | 456 ms | 398 ms | +8 ms (+2%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 383 ms | 378 ms | 391 ms | 391 ms | −8 ms (−2%) | < 500 ms ✅ |
| `reload.customers` | 5 | 311 ms | 309 ms | 313 ms | 336 ms | −26 ms (−8%) | < 500 ms ✅ |
| `reload.reports` | 5 | 369 ms | 368 ms | 385 ms | 376 ms | −8 ms (−2%) | < 500 ms ✅ |
| `reload.team` | 5 | 351 ms | 349 ms | 369 ms | 355 ms | −4 ms (−1%) | < 500 ms ✅ |
| `reload.settings` | 5 | 281 ms | 277 ms | 294 ms | 283 ms | −2 ms (−1%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 4 ms | 4 ms | 8 ms | 8 ms | −4 ms (−46%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 19 ms | 14 ms | 21 ms | 12 ms | +7 ms (+64%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 15 ms | 13 ms | −8 ms (−63%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 13 ms | 17 ms | −7 ms (−40%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 23 ms | 17 ms | 23 ms | 17 ms | +5 ms (+31%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 12 ms | 13 ms | 11 ms | +0 ms (+3%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | 6 ms | +0 ms (+7%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 7 ms | 4 ms | 8 ms | 9 ms | −2 ms (−26%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 5 ms | 5 ms | 5 ms | 7 ms | −2 ms (−35%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 20 ms | 19 ms | 21 ms | 20 ms | +0 ms (+0%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 24 ms | 23 ms | 24 ms | 23 ms | +1 ms (+6%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 21 ms | 19 ms | 21 ms | 19 ms | +1 ms (+7%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 10 ms | 2 ms | 11 ms | 2 ms | +8 ms (+380%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 16 ms | 15 ms | 21 ms | 16 ms | +1 ms (+5%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 15 ms | 14 ms | 16 ms | 14 ms | +0 ms (+2%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | +0 ms (+1%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 10 ms | 10 ms | 10 ms | +0 ms (+3%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | 17 ms | +0 ms (+0%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 6 ms | 6 ms | 20 ms | 6 ms | +0 ms (+7%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,8 MB | 16,8 MB | 16,8 MB | 16,5 MB | +0,3 MB (+2%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 33 ms | 33 ms | 36 ms | 34 ms | −1 ms (−3%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 27 ms | 17 ms | 72 ms | 20 ms | +7 ms (+38%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 427 ms | 418 ms | 433 ms | 438 ms | −11 ms (−3%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 109 ms | 106 ms | 110 ms | 101 ms | +8 ms (+8%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 107 ms | 106 ms | 108 ms | 107 ms | 0 ms (+0%) | ≤ 300 ms ✅; Năm − Tháng −2 ms ≤ 50 ms ✅ |

### So G7 cùng máy, cùng bản probe (tham khảo chính)

Cột Nền = `perf\perf-g7.json` (exe `233c77e`, 03/11, probe sau T-347; chép từ `g7-home-pc\lan-2\perf\`). Bản ghi file: `perf\table-vs-g7.md`.

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 364 ms | 364 ms | 364 ms | 320 ms | +44 ms (+14%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 979 ms | 970 ms | 1011 ms | 975 ms | +4 ms (+0%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 44 ms | 41 ms | 49 ms | 44 ms | −1 ms (−2%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 147 ms | 144 ms | 156 ms | 148 ms | −1 ms (−1%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 406 ms | 394 ms | 456 ms | 395 ms | +11 ms (+3%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 383 ms | 378 ms | 391 ms | 385 ms | −3 ms (−1%) | < 500 ms ✅ |
| `reload.customers` | 5 | 311 ms | 309 ms | 313 ms | 308 ms | +3 ms (+1%) | < 500 ms ✅ |
| `reload.reports` | 5 | 369 ms | 368 ms | 385 ms | 367 ms | +2 ms (+1%) | < 500 ms ✅ |
| `reload.team` | 5 | 351 ms | 349 ms | 369 ms | 350 ms | +1 ms (+0%) | < 500 ms ✅ |
| `reload.settings` | 5 | 281 ms | 277 ms | 294 ms | 280 ms | +1 ms (+0%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 4 ms | 4 ms | 8 ms | 6 ms | −1 ms (−25%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 19 ms | 14 ms | 21 ms | 11 ms | +8 ms (+74%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 15 ms | 5 ms | +0 ms (+7%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 13 ms | 10 ms | 0 ms (−1%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 23 ms | 17 ms | 23 ms | 18 ms | +5 ms (+29%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 12 ms | 13 ms | 12 ms | +0 ms (+2%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | 6 ms | +0 ms (+2%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 7 ms | 4 ms | 8 ms | 7 ms | +0 ms (+0%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 5 ms | 5 ms | 5 ms | 5 ms | +0 ms (+0%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 20 ms | 19 ms | 21 ms | 20 ms | +0 ms (+0%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 24 ms | 23 ms | 24 ms | 23 ms | +2 ms (+7%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 21 ms | 19 ms | 21 ms | 20 ms | +0 ms (+1%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 10 ms | 2 ms | 11 ms | 2 ms | +8 ms (+405%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 16 ms | 15 ms | 21 ms | 17 ms | 0 ms (−2%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 15 ms | 14 ms | 16 ms | 14 ms | +1 ms (+4%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | +0 ms (+1%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 10 ms | 10 ms | 10 ms | +0 ms (+0%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | 17 ms | 0 ms (−1%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 6 ms | 6 ms | 20 ms | 9 ms | −2 ms (−27%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,8 MB | 16,8 MB | 16,8 MB | 16,7 MB | +0,1 MB (+1%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 33 ms | 33 ms | 36 ms | 33 ms | +1 ms (+2%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 27 ms | 17 ms | 72 ms | 25 ms | +3 ms (+10%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 427 ms | 418 ms | 433 ms | 435 ms | −8 ms (−2%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 109 ms | 106 ms | 110 ms | 112 ms | −3 ms (−3%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 107 ms | 106 ms | 108 ms | 109 ms | −2 ms (−2%) | ≤ 300 ms ✅; Năm − Tháng −2 ms ≤ 50 ms ✅ |

### So lượt 5 cùng máy (tham khảo)

Cột Nền = `perf\perf-ref-r5.json` (exe `37a80b6`, 04/11; chép từ `-r5\common\perf\perf-ref.json`). Probe lượt 6 = probe lượt 5 cộng hai đổi của đợt sửa: T-369 (#1056, `metRows` chỉ đếm "Đã gặp" ở ô Trạng thái, DR6-177) và T-372 (#1077, đổi tên biến), `e2e/perf/probe.perf.ts` +12 / −4. Hai đổi chỉ chạm cách đếm dòng Đã gặp khi chọn kỳ; kỳ chọn ra như lượt 5 (Năm 2026: 79 Đã gặp; Tháng 10/2026, lùi 1: 10 ngày Đã gặp, cả lượt 5 và lượt 6), nên mọi dòng so trực tiếp. Bản ghi file: `perf\table-vs-r5.md`.

| Thao tác | Lần | Trung vị | Min | Max | Nền | Δ (⚠️ = xấu hơn theo luật nhiễu) | Ngưỡng `phase-6.md` |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 364 ms | 364 ms | 364 ms | 330 ms | +35 ms (+10%) | ≤ 600 ms ✅ |
| `backup.read` | 5 | 979 ms | 970 ms | 1011 ms | 983 ms | −4 ms (+0%) | ≤ 2 000 ms ✅ |
| `backup.import` | 5 | 44 ms | 41 ms | 49 ms | 50 ms | −6 ms (−12%) | ≤ 500 ms ✅ |
| `db.save` | 15 | 147 ms | 144 ms | 156 ms | 150 ms | −4 ms (−3%) | ≤ 400 ms ✅ |
| `reload.overview` | 5 | 406 ms | 394 ms | 456 ms | 407 ms | −1 ms (+0%) | < 500 ms ✅ |
| `reload.appointments` | 5 | 383 ms | 378 ms | 391 ms | 391 ms | −9 ms (−2%) | < 500 ms ✅ |
| `reload.customers` | 5 | 311 ms | 309 ms | 313 ms | 316 ms | −5 ms (−2%) | < 500 ms ✅ |
| `reload.reports` | 5 | 369 ms | 368 ms | 385 ms | 371 ms | −3 ms (−1%) | < 500 ms ✅ |
| `reload.team` | 5 | 351 ms | 349 ms | 369 ms | 362 ms | −11 ms (−3%) | < 500 ms ✅ |
| `reload.settings` | 5 | 281 ms | 277 ms | 294 ms | 285 ms | −4 ms (−1%) | < 500 ms ✅ |
| `appointments.period-day` | 5 | 4 ms | 4 ms | 8 ms | 6 ms | −1 ms (−20%) | < 200 ms ✅ |
| `appointments.period-week` | 5 | 19 ms | 14 ms | 21 ms | 11 ms | +8 ms (+67%) | < 200 ms ✅ |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 15 ms | 5 ms | +0 ms (+2%) | < 200 ms ✅ |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 13 ms | 10 ms | 0 ms (−1%) | < 200 ms ✅ |
| `appointments.sort-date-asc` | 5 | 23 ms | 17 ms | 23 ms | 17 ms | +5 ms (+32%) | < 200 ms ✅ |
| `appointments.sort-date-desc` | 5 | 12 ms | 12 ms | 13 ms | 12 ms | +0 ms (+1%) | < 200 ms ✅ |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | 6 ms | +0 ms (+7%) | < 200 ms ✅ |
| `appointments.select-day-month` | 5 | 7 ms | 4 ms | 8 ms | 7 ms | +0 ms (+3%) | < 200 ms ✅ |
| `appointments.select-row-month` | 5 | 5 ms | 5 ms | 5 ms | 5 ms | 0 ms (−2%) | < 200 ms ✅ |
| `customers.view-table` | 5 | 20 ms | 19 ms | 21 ms | 19 ms | +1 ms (+5%) | < 200 ms ✅ |
| `customers.sort-name` | 5 | 24 ms | 23 ms | 24 ms | 24 ms | +1 ms (+3%) | < 200 ms ✅ |
| `customer.open-ai` | 5 | 21 ms | 19 ms | 21 ms | 20 ms | +0 ms (+1%) | < 200 ms ✅ |
| `customer.ai-history` | 5 | 10 ms | 2 ms | 11 ms | 2 ms | +7 ms (+300%) | < 200 ms ✅ |
| `overview.filter-year` | 5 | 16 ms | 15 ms | 21 ms | 16 ms | 0 ms (−1%) | < 200 ms ✅ |
| `overview.filter-month` | 5 | 15 ms | 14 ms | 16 ms | 14 ms | +0 ms (+1%) | < 200 ms ✅ |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | 10 ms | +0 ms (+4%) | < 200 ms ✅ |
| `reports.filter-month` | 5 | 10 ms | 10 ms | 10 ms | 10 ms | +0 ms (+3%) | < 200 ms ✅ |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | 17 ms | +0 ms (+1%) | < 200 ms ✅ |
| `trash.kind-appointments` | 5 | 6 ms | 6 ms | 20 ms | 8 ms | −2 ms (−25%) | < 200 ms ✅ |
| `memory.js-heap` | 1 | 16,8 MB | 16,8 MB | 16,8 MB | 16,7 MB | +0,1 MB (+1%) | ≤ 21 MB ✅ |
| `trash.open` | 5 | 33 ms | 33 ms | 36 ms | 33 ms | +1 ms (+2%) | < 200 ms ✅ |
| `reports.export-excel` | 5 | 27 ms | 17 ms | 72 ms | 21 ms | +6 ms (+27%) | ≤ 500 ms ✅ |
| `backup.export` | 5 | 427 ms | 418 ms | 433 ms | 438 ms | −11 ms (−3%) | ≤ 1 000 ms ✅ |
| `appointments.next-month` | 5 | 109 ms | 106 ms | 110 ms | 111 ms | −2 ms (−2%) | ≤ 300 ms ✅ |
| `appointments.next-year` | 5 | 107 ms | 106 ms | 108 ms | 108 ms | 0 ms (+0%) | ≤ 300 ms ✅; Năm − Tháng −2 ms ≤ 50 ms ✅ |

### Dọn sạch Thùng rác trên exe (một lần, dữ liệu tải)

`perf\purge-exe.mjs`, ngay sau probe, cùng exe và thư mục `perf\run\` (kết quả `perf\purge-exe.json`, log `perf\purge-exe.log`). Cách đo như lượt 4–5: nút được đánh dấu, trang tự bấm sau khi đã ngắt CDP, rồi nối lại đọc thời gian trang ghi.

1. Nhập lại dữ liệu tải: Nội dung "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ", `project2c.db` 14 102 528 byte (= lượt 5).
2. `trash.open` trước khi dọn (đã ngắt DevTools, 3 lần): 33,0 / 32,7 / 30,8 ms → trung vị **32,7 ms** (lượt 5: 30,1).
3. Hộp 11i: "113 bản ghi · mọi loại, không theo bộ lọc"; KH 15 — kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI; Lịch hẹn 76, HĐ 18, Nhân sự 3, Team 1; không có dòng "Giữ lại"; câu backup nêu `Project2C-data\backups\`; ô "Gõ DỌN SẠCH để xác nhận"; nút "Hủy", "Backup rồi dọn sạch" (như lượt 5).
4. **Bấm "Backup rồi dọn sạch" → khung hình đầu có thông báo 11j: 120,5 ms ≤ 500 ms ✅** (ngưỡng K30; lượt 5: 128,0 ms; G7: 130,5 ms). Lần lưu file (`p2c:db-save`) đầu tiên sau cú bấm: 146,8 ms (lượt 5: 162,2).
5. Thông báo 11j: "Đã dọn sạch Thùng rác — Xóa hẳn 15 KH (kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI) · 76 lịch hẹn · 18 HĐ · 3 nhân sự · 1 team. Backup: Project2C-data\backups\project2c-s00000009-20261107-115603.db". Một file backup mới đúng tên đó.
6. `project2c.db` 14 102 528 → **13 438 976 byte** (bằng số trong Node, = lượt 5).
7. `trash.open` sau khi dọn ("Thùng rác trống", 3 lần): 2,0 / 1,8 / 1,9 ms → trung vị **1,9 ms** (lượt 5: 2,0).
8. Nội dung Cài đặt → Dữ liệu sau khi dọn: như trước khi dọn.

### Dọn sạch Thùng rác trong Node (plan §L6.6, như §L4.6)

`perf\purge-node.mjs` (chép từ lượt 5, không đổi; kết quả `perf\purge-node.json`, log `perf\purge-node.log`), 11:50:54 → 11:51:03, ngay trước phần đo trên exe, máy rảnh. Node `v24.20.0`, `@p2c/db` của `Project-2C-review` ở SHA ghim (qua `tools/ts-hooks.mjs`), không persist; mỗi lần nhập lại file dữ liệu tải; 5 lần mỗi cỡ. Trung vị (min–max), ms.

| Đo | Dữ liệu tải: 113 dòng Thùng rác | Lượt 5 | Thùng rác lớn: 1 313 dòng (+1 200 KH xóa) | Lượt 5 |
|---|---|---:|---|---:|
| `listTrash` trước khi dọn | 24,1 (23,2–36,6) | 24,6 | 135,7 (134,4–148,0) | 134,6 |
| `previewPurge` | 0,9 (0,9–1,2) | 1,0 | 6,2 (6,0–6,3) | 6,1 |
| `purgeTrash` cả `VACUUM` | 86,2 (83,4–89,2) | 88,5 | 117,6 (117,4–118,4) | 117,5 |
| — trong đó phần transaction (không `VACUUM`) | 24,4 (21,2–25,6) | 23,8 | 113,5 (113,2–114,2) | 112,7 |
| — trong đó `VACUUM` | 62,2 (60,8–63,6) | 65,5 | 4,2 (4,1–4,3) | 4,3 |
| `db.export()` sau khi dọn | 2,2 (2,0–3,3) | 2,1 | 0,4 (0,4–0,4) | 0,4 |
| `listTrash` sau khi dọn | 2,1 (0,9–2,3) | 2,3 | 0,6 (0,6–0,7) | 0,6 |
| Dòng Thùng rác trước → sau; giữ lại | 113 → 0; giữ 0 | 113 → 0 | 1 313 → 0; giữ 0 | 1 313 → 0 |
| Cỡ file (`export()`) trước → sau | 14 102 528 → 13 438 976 byte (−4,7 %) | = | 14 151 680 → 1 495 040 byte (−89,4 %) | = |

Cả hai cỡ trong ngưỡng ≤ 500 ms; không bản ghi nào bị giữ lại (TR-12).

## Trạng thái cuối bước chuẩn bị (07/11/2026 ≈ 12:05)

- `git status --short` của `Project-2C-review`, `Project-2C-review-2` và checkout chính: rỗng; cả ba ở `5b1328a` = `origin/main` (kiểm lại sau `git fetch`).
- `C:\workspace\deep-review-1-6-r6\claude\`, `codex\`, `workbuddy\`: rỗng.
- **Thử vòng đọc của `scan` sau mốc** (bản chép tạm chỉ đọc như trên, mốc = giờ ghi `dot2-baseline.json`, không ACL): 703 file sửa sau mốc được đọc, gồm mọi file của bước 5–7 ở `-r6\common` và transcript của phiên chuẩn bị; **0 file khớp `MARKER`**.
- Nhắc cho đợt 2 (mục "File đã có chuỗi lượt 6 trước mốc"): không phiên nào được lưu trữ (Owner 07/11); không gửi tin nhắn vào phiên "review-2" `local_f7ffb665`, không chạy lại các phiên CLI cũ trong bảng đó trước khi `scan` của đợt 2 xong.
- **Sẵn sàng chạy lượt 6** (plan §L6.9 bước 8): Owner chạy đợt 1, Claude ở `Project-2C-review` (A → F rồi G → H → I, mỗi gói một phiên mới, không ultracode) và Codex ở `Project-2C-review-2` (A → F, mỗi gói một phiên mới).

## Đợt 2 (agent WorkBuddy): Owner và phiên thử ghi dưới đây

### Bước 1–3 (07/11/2026 tối; phiên Claude hỗ trợ ở checkout chính, CLI `4dad8968…`)

- **Điều kiện bắt đầu** (≈ 22:51, script chỉ in số đếm, không in dòng đầu báo cáo): 15 / 15 báo cáo đạt (Claude A–I, Codex A–F), không thiếu, không file `.md` thừa; `Project-2C-review` và `Project-2C-review-2` ở `5b1328a`, `git status --short` rỗng. Lúc kiểm còn tiến trình Codex chạy và một transcript ở `Project-2C-review` ghi lúc 22:47 (gói I vừa xong); phiên hỗ trợ nhắc Owner đóng cả hai trước bước 1 (output bước 1–2 không dán vào phiên hỗ trợ). Transcript, scratchpad của phiên hỗ trợ: 0 file khớp `MARKER`.
- **Bước 3, hash:** `dot2-reports-hash.csv` ghi 15 dòng (lệnh không dừng).
- **Bước 3, `deny`:** `OK: 251 entries denied (1 unreadable before, 0 more inside), 306 not denied (another account's), 4 left readable`.
  - Thư mục tạm bị chặn: `%TEMP%\claude\C--workspace-Project-2C-review`, `…\172d166a8e27758b`, `…\9baf74bac889a6ec`, `…\a984f69ba7857da9` (mới so với 07/11 sáng; `reviewTempDirs` nhận theo tên phiên), `…\C--workspace-Project-2C-review-2`. Không có `…\4f7e6602815f66dc` (checkout chính).
  - Không đọc được từ trước `deny`: `.codex\.sandbox-bin` (như lượt 4–5). Không chặn vì của tài khoản khác: `CodexSandboxOffline` (13 file lượt 1 ở `deep-review-1-6\codex\F\`, cây `.codex\.chatgpt-projects\…\specialist-toolkit`), `NT AUTHORITY\SYSTEM` (`-r4\common\dot2-unlock.log`, 3 file `.codex\.sandbox*`). Để ngỏ: `.git`, `node_modules` của `Project-2C-review-2` và của `specialist-toolkit`.
- **Bước 3, `scan`:** `546 files read; 134 folders / files not readable`; không đọc (> 64 MB): `.codex\logs_2.sqlite` (đã bị `deny`).
  - **Chấp nhận (Phụ lục P, danh sách phiên của app):** `%APPDATA%\Claude\claude-code-sessions\4b36e7f7-…\03eadf50-…\local_15113077-f0e0-44c2-b1de-0d3310ba2429.json`, phiên app "rev r6" (cwd `Project-2C-review`, chưa lưu trữ); trường khớp: `turnWrapUp` (recap của phiên review đợt 1).
  - **`STOP` ở đúng 1 file:** transcript `13151be9…jsonl` trong `~\.claude\projects\C--workspace-Project-2C-review-2\`, phiên app "review-2" `local_f7ffb665` (id CLI hiện tại), có trong mục "File đã có chuỗi lượt 6 trước mốc" ở trên.
  - **Kiểm file đó** (script chỉ in số dòng, loại, giờ, khóa; không in dòng khớp): 539 dòng; 4 dòng khớp (L75, L143 `user`; L194 `assistant`; L201 `api-request-blob`), giờ ghi 2026-11-06T19:36:07Z…19:39:17Z = 07/11 02:36–02:39 +07, trước khi phiên chuẩn bị mở (10:48) và trước mốc (11:41:55), trong lần review PR #1123. Không dòng nào có giờ sau mốc. Sau dòng cuối có giờ trước mốc (L537) chỉ có 2 dòng không ghi giờ: `last-prompt` (`type, leafUuid, sessionId`) và `cost-state` (số liệu chi phí), không dòng nào khớp. Giờ sửa file 2026-11-07T12:58:20Z (19:58:20 +07); file phiên app `local_f7ffb665…json` sửa 12:58:21Z: tiến trình CLI của phiên kết thúc, không có tin nhắn nào gửi vào. Trong thư mục `C--workspace-Project-2C-review-2`, đây là file duy nhất sửa sau mốc.
  - **Owner quyết 07/11/2026 ≈ 23:00 (trả lời câu hỏi của phiên hỗ trợ): chấp nhận, đi tiếp bước 4** (như lượt 5 ngày 05/11). Lệch §L6.9 đợt 2 bước 5 ("phiên thử chỉ khi `scan` in `OK`"). Các lần `scan` sau trong đợt 2 coi là đạt khi `STOP` chỉ nêu đúng file này và phiên hỗ trợ kiểm lại bằng script trên: vẫn 4 dòng khớp, cùng giờ ghi 07/11 02:36–02:39 +07. Khác thế → dừng, báo Claude.

### Phiên thử — task 1, quyền mặc định (không thấy mã chế độ quyền trong ngữ cảnh; chế độ Agent), 2026-11-07 23:06 +07:00

Ghi chú ghi file: hai lệnh ghi đầu bị từ chối — (1) `cat >>` qua Git Bash: `Command blocked for security: Invoking PowerShell from Bash bypasses PowerShell security checks; use the PowerShell tool instead`; (2) công cụ PowerShell với nội dung có cú pháp biến môi trường kiểu cmd.exe: `Command blocked for security: cmd.exe environment variable syntax is not PowerShell syntax`. Bản ghi này được nối vào cuối file bằng công cụ PowerShell (`Add-Content`); không đọc lại nội dung cũ của file.

1. Model theo ngữ cảnh phiên: `claude-opus-6`; context: không thấy; mức suy luận: không thấy. (Định danh hệ thống: WorkBuddy AI / Tencent Hunyuan Hy.) Task có chạy qua Code review expert: có — tên `CodeReviewExpert`; mã: không thấy.
2. `Get-Location` (PowerShell) → `C:\workspace\Project-2C-review`; `pwd` (Git Bash) → `/c/workspace/Project-2C-review`. Cả hai shell của app đều chạy được, không lỗi.
3. `node --version` trần (PowerShell, không prefix PATH, đúng một lần) → `v22.22.2`, exit 0. `& 'C:\Program Files\nodejs\node.exe' --version` (PowerShell, có prefix PATH) → `v24.20.0`, exit 0; ≥ 24 nên tiếp tục phiên.
4. Công cụ đọc file của app, 5 dòng đầu `C:\workspace\deep-review-1-6-r6\common\plan.md` → đọc được; không lỗi.
5. Vitest `packages/domain`:
   - PowerShell (có prefix PATH): Node `v24.20.0`; 21/21 file đạt, 810/810 test đạt, 0 test đỏ; exit 0; không lỗi.
   - Git Bash (có prefix PATH): Node `v24.20.0`; 21/21 file đạt, 810/810 test đạt, 0 test đỏ; exit 0; không lỗi.
6. Công cụ đọc file của app, `C:\workspace\deep-review-1-6-r6\common\dot2-acl.json` → đọc được; không lỗi. Mỗi mục dưới thử đúng 2 lần: (S) PowerShell có prefix PATH theo quy tắc 2 — liệt kê = `readdirSync` không in kết quả, đọc = mở rồi đóng; (A) công cụ của app — glob giới hạn 1 kết quả / đọc 1 dòng. Thông báo lỗi (viết tắt dùng ở các dòng dưới):
   - `S-scan` = `EPERM: operation not permitted, scandir '<đường dẫn>'` (errno -4048, code EPERM, syscall scandir; Node.js v24.20.0).
   - `S-open` = `EPERM: operation not permitted, open '<đường dẫn>'` (errno -4048, code EPERM, syscall open).
   - `S-ENOENT` = `ENOENT: no such file or directory, open '<đường dẫn>'` (errno -4058).
   - `A-glob` = `glob error: Error during glob search operation: ripgrep exited with code 2: rg: .: IO error for operation on .: Access is denied. (os error 5)`.
   - `A-glob-con` = như `A-glob` nhưng lỗi kèm tên mục con; đã thay mọi tên mục con bằng `<mục con>`.
   - `A-read` = `EPERM: operation not permitted, access '<đường dẫn>'` / `open '<đường dẫn>'`.
   - `A-none` = `File does not exist. Did you mean ..\..\Users\<user>\.codex\<mục con>?`.
   - a. `C:\workspace\deep-review-1-6-r6\claude` (liệt kê): S — bị từ chối, S-scan; A glob — bị từ chối, A-glob.
   - b. `C:\workspace\deep-review-1-6-r6\codex` (liệt kê): S — bị từ chối, S-scan; A glob — bị từ chối, A-glob.
   - c. `C:\workspace\deep-review-1-6-r5` (liệt kê): S — bị từ chối, S-scan; A glob — bị từ chối, A-glob.
   - d. `C:\workspace\deep-review-1-6-r4` (liệt kê): S — liệt kê được (exit 0, không in kết quả); A glob — bị từ chối, A-glob-con. `C:\workspace\deep-review-1-6-r4\claude`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob. `C:\workspace\deep-review-1-6-r4\codex`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob.
   - e. `C:\workspace\deep-review-1-6-r3`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob. `C:\workspace\deep-review-1-6-r2`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob.
   - f. `C:\workspace\deep-review-1-6` (liệt kê): S — liệt kê được (exit 0, không in kết quả); A glob — bị từ chối, A-glob-con. `C:\workspace\deep-review-1-6\claude`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob.
   - g. `C:\Users\<user>\.claude\projects\C--workspace-Project-2C-review`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob. `C:\Users\<user>\.claude\file-history\<id>` (id lấy trong `entries`): S — bị từ chối, S-scan; A glob — bị từ chối, A-glob. `$env:TEMP\claude\C--workspace-Project-2C-review`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob. `$env:TEMP\claude\9baf74bac889a6ec`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob. `$env:TEMP\claude\172d166a8e27758b`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob. `$env:TEMP\claude\a984f69ba7857da9`: S — bị từ chối, S-scan; A glob — bị từ chối, A-glob. (Shell dùng `$env:TEMP`, công cụ của app dùng đường dẫn tương ứng.)
   - h. `C:\workspace\deep-review-1-6-r6\claude\A.md` (đọc): S — bị từ chối, S-open; A đọc — bị từ chối, A-read. `C:\workspace\deep-review-1-6-r6\codex\A.md` (đọc): S — bị từ chối, S-open; A đọc — bị từ chối, A-read.
   - i. `~\.codex\version.json` (đọc): S — không có, S-ENOENT; A đọc — không có, A-none; bỏ theo chỉ dẫn, không đụng mục khác của `.codex`. `~\.codex\sessions` (liệt kê): S — bị từ chối, S-scan; A glob — bị từ chối, A-glob.
   - j. `C:\workspace\Project-2C-review-2\package.json` (đọc): S — bị từ chối, S-open; A đọc — bị từ chối, A-read.
7. Shell (PowerShell) tạo `C:\workspace\deep-review-1-6-r6\workbuddy\_thu\a.txt` → tạo được; công cụ ghi file của app tạo `C:\workspace\deep-review-1-6-r6\workbuddy\_thu\b.txt` → tạo được. App không hỏi, sandbox không chặn, không lỗi.
8. Giao cho đúng một agent phụ (general-purpose) đúng một việc, kèm nguyên văn khối QUY TẮC. Agent báo: shell PowerShell, liệt kê `C:\workspace\deep-review-1-6-r6\claude` — bị từ chối; thông báo lỗi `EPERM: operation not permitted, scandir 'C:\workspace\deep-review-1-6-r6\claude'` (errno -4048, code EPERM, syscall scandir; Node.js v24.20.0). Không có lỗi nào khác.
9. `gh auth status` (Git Bash) → `You are not logged into any GitHub hosts. To log in, run: gh auth login`; exit code của `gh` = 1 (lệnh gộp thêm `echo` nên exit code tổng của vỏ lệnh = 0).
10. App có công cụ tìm web: có, chạy được với truy vấn "Tauri 2 release notes". App có công cụ đọc trang: có, chạy được với `https://tauri.app`. Không chép kết quả.
11. Shell (PowerShell) tạo `C:\workspace\deep-review-1-6-r6\_thu_ghi\a.txt` (ngoài workspace) → tạo được. App không hỏi, sandbox không chặn, không lỗi.
12. `C:\workspace\Project-2C-review\README.md`: sha256 (1) `671CA7CE4DC9502D97E3FE50D3E29F02EF84B9B4235B1F0D5C19E58FB388A6E6`; thêm một dòng `thu` ở cuối bằng công cụ sửa file của app → sha256 (2) `98555C0B1D3E879564CF9A6E49EF37DD2F709E45E3AA9F287529558C4A8A146F`; xóa đúng dòng đó bằng công cụ sửa file → sha256 (3) `671CA7CE4DC9502D97E3FE50D3E29F02EF84B9B4235B1F0D5C19E58FB388A6E6` (trùng lần đầu). `git status --short` → không có dòng nào, exit 0. App không hỏi, công cụ sửa file không báo lỗi. Không có file sao lưu nào do app tạo trong worktree.
13. Chép `C:\workspace\deep-review-1-6-r6\common\exe\project2c.exe` sang `C:\workspace\deep-review-1-6-r6\workbuddy\_thu\` → chép được. Mở bản chép (PowerShell `Start-Process -PassThru`) với `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333` → mở được, PID 7120. Cổng 9333 → mở (có tiến trình ở trạng thái Listen). Trang `http://tauri.localhost/` → không nhận được trang thành công: `Response status code does not indicate success: 502 (Bad Gateway)`. `taskkill /PID 7120 /T /F` → exit 0, đã kết thúc cả cây tiến trình. Kiểm còn tiến trình `project2c.exe` → 0. Sandbox không chặn bước nào.
14. PowerShell có prefix PATH: Node `v24.20.0`. `pnpm build:web` → exit 0, không lỗi (chỉ có cảnh báo chunk > 600 kB). `& 'C:\Program Files\nodejs\node.exe' node_modules/@playwright/test/cli.js test e2e/navigation.spec.ts --project=edge --no-deps --output C:\workspace\deep-review-1-6-r6\workbuddy\_thu\pw` → exit 0; 16 test đạt, 0 test đỏ. Sandbox không chặn.
15. `git -C C:\workspace\Project-2C-review status --short` (PowerShell) → không có dòng nào, exit 0. Không xóa `workbuddy\_thu\` hay `_thu_ghi\`.

### Ghi chú của Claude sau phiên thử (07/11/2026 ≈ 23:38; phiên hỗ trợ ở checkout chính)

- **Phiên thử** chạy theo `common\prompt-thu.md` (15 việc; phiên hỗ trợ soạn theo phiên thử lượt 5 và §L6.9 đợt 2 bước 5), qua Code review expert, chế độ quyền Default, model **GLM 5.3** (Owner chọn lúc đó; model tự ghi ở việc 1 không khớp tên trên giao diện, nên chỉ lấy tên Owner chọn).
- **So với kết quả dự kiến: đạt.**
  - Việc 6: mọi mục chặn bị từ chối bằng lỗi quyền của Windows (`EPERM`, `Access is denied (os error 5)`), cả shell lẫn công cụ của app. Lần đọc được: `dot2-acl.json` (không chặn) và liệt kê bằng shell thư mục gốc `-r4`, `deep-review-1-6` (có mục của tài khoản khác bên trong, §L6.9 bước 5). `-r5` và ba thư mục tạm theo mã băm bị từ chối. `.codex\version.json` không có, như lượt 5.
  - Việc 8: agent phụ bị từ chối (`EPERM`). Việc 9: `gh` chưa đăng nhập. Việc 12: sha256 cuối trùng lần đầu, `git status` rỗng. Việc 3, 5, 14: Node 24.20.0 khi đặt PATH; vitest xanh ở cả hai shell; Playwright 16 / 16.
  - Việc 13: cổng 9333 mở, nhưng model kiểm bằng một yêu cầu HTTP thẳng tới `http://tauri.localhost/` (502), thay vì đọc danh sách trang của cổng debug như lượt 5. `tauri.localhost` chỉ có trong WebView2, nên 502 không cho biết exe lỗi; sandbox không chặn mở / đóng exe. Không phải lỗi môi trường.
  - Việc 10, 11: như lượt 4–5 (app có công cụ web; ghi được ra ngoài workspace không hỏi). Chỉ ghi lại: prompt cấm cả hai.
- **Owner quyết 07/11/2026 ≈ 23:35:** GLM 5.3 tốn credit quá, model cho gói A–F là **Hy4** (một trong hai model §L6.7 đã chốt). Không chạy lại phiên thử với Hy4: "không cần phải thử thêm, các round 5 đã test rồi". Lệch §L6.9 bước 5 (phiên thử cùng model với các gói): ACL, sandbox, Node, Playwright, exe là của app và tài khoản Windows, không theo model; mục 1 của mỗi báo cáo ghi tên model, context, mức suy luận đúng như app hiện.
- **Đoạn "Xong", phần file** (Claude, 23:38): đã xóa `workbuddy\_thu\` (a.txt, b.txt, bản chép exe, `Project2C-data\project2c.lock`, `pw\.last-run.json`) và `-r6\_thu_ghi\` (a.txt). `workbuddy\` rỗng; `git -C C:\workspace\Project-2C-review status --short` rỗng; không còn tiến trình `project2c`. `apps\desktop\dist` do việc 14 dựng lại (bị ignore, các gói dùng được). App không để file nào trong worktree.
- Đọc lại các đề mục của phiên thử: không chép nội dung file hay tên mục bị chặn (tên mục con thay bằng `<mục con>`); 0 dòng khớp `MARKER`.

### Bước 7 — đóng đợt 2 (08/11/2026, phiên tổng hợp ở checkout chính ghi)

- **Kiểm lúc mở phiên (13:31):** 6 báo cáo WorkBuddy A–F có dòng đầu `XONG` (A 00:11 … F 13:28 ngày 08/11); `-r6\claude`, `-r6\codex` còn bị chặn; 9 tiến trình `WorkBuddyAI` còn chạy; chưa có `workbuddy\<gói>\session\`; `gh` chưa đăng nhập; `Project-2C-review` ở `5b1328a`, sạch.
- **7.1–7.2** (Owner): đăng xuất và thoát app; phiên kiểm lại: 0 tiến trình `WorkBuddyAI`.
- **7.6 trước 7.4** (Owner): `gh auth login` làm ngay sau khi thoát app, trước `remove` (lệch thứ tự §L5.9 bước 7; app đã thoát nên không agent nào dùng được `gh`). `gh auth status`: đăng nhập `AlexH-AI`.
- **7.3** (Owner bảo Claude chạy; lệch lượt 4–5, nơi Owner chạy lệnh chép): `node common\copy-sessions.mjs` (phiên tổng hợp viết; từ chối khi app còn chạy — đã thử lúc app còn mở: `STOP`). Lệnh chỉ đọc file `<id>.jsonl` sửa sau 07/11 22:30 ở `.workbuddy-ai\projects\c-workspace-Project-2C-review\` để nhận gói theo tin nhắn "Gói X." / `prompt-thu.md`, chỉ chép `<id>.jsonl`, `<id>\tool-results\`, `<id>\subagents\`; không mở file nào khác của thư mục dữ liệu app. In `OK: đủ log A–F`:
  - `thu\session\`: `1026bd70-…` (23:05–23:25, 75 lệnh gọi, có `subagents\`), `766e8cfd-…` (6 dòng, 0 lệnh gọi), `8c2e2423-…` (23:26–23:35, 57 lệnh gọi, có `subagents\`);
  - A `59a94ae9-…` (444 dòng, `subagents\` 8 file); B `aff5e14d-…` (00:28–00:30, phiên bị cắt) và `f3b8f34d-…` (00:31–01:16); C `8b32d892-…`; D `32c22d94-…`; E `9885b8ec-…`; F `a0421083-…`. Mọi phiên A–F có tin nhắn "Gói X." đúng gói ở tin nhắn người dùng đầu tiên.
- **Model theo log** (`providerData.model` của mọi bản ghi; phiên tổng hợp đếm, không in nội dung):
  - phiên thử `1026bd70` (23:06, phiên ghi ở mục "Phiên thử" trên): `hy4-free`; `8c2e2423` (23:26–23:35): `glm-5.3`. Ghi chú "model GLM 5.3" của phiên hỗ trợ ở mục trên vì vậy là của task thử thứ hai, không phải task ghi các việc 1–15;
  - **A và phiên B bị cắt: `hy4-free`; phiên B tiếp và C–F: `deepseek-v4.1-flash-sg`.** Lệch §L6.7 ("mọi gói dùng cùng model", Hy4 hoặc GLM 5.3). Báo cáo B, C, D, F mục 1 ghi "ngữ cảnh phiên ghi `Deepseek-V4.1-Flash`"; báo cáo E ghi Hy4 / `claude-opus-6`, khác log.
- **7.4** `dot2.mjs remove` (≈ 13:52; chép xong 13:51): `OK: denies removed from 252 entries, all readable again but the 1 above, which did not read before deny either` (mục đó: `.codex\.sandbox-bin`, như lượt 4–5). `dot2-acl.json` → `dot2-acl.removed.json`. Đọc lại được: `-r6\claude`, `-r6\codex`, `-r5\claude`, `-r4\claude`, `-r3`, `-r2`, `deep-review-1-6\claude`, `.codex\sessions`, `projects\C--workspace-Project-2C-review`, `%TEMP%\claude\9baf74bac889a6ec`, `Project-2C-review-2\package.json`. `Project-2C-review-2` ở `5b1328a`, `git status --short` rỗng.
- **7.5** so hash: `OK: 15 báo cáo không đổi`.
