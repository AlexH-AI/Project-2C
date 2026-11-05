XONG — claude gói F lượt 5, 2026-11-05 02:14 (+07:00)

# Deep review Phase 1–6, lượt 5 — Claude — gói F (Xuyên gói, bloat / hiệu năng, công cụ)

## 1. Phiên

- Bên: claude · Gói: F · ID: `CLR5-F`
- Repo: `C:\workspace\Project-2C-review`, detached `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`git rev-parse HEAD` đầu phiên = SHA ghim)
- `git status --short` đầu phiên: **rỗng**
- Giờ bắt đầu: 2026-11-05 01:19 (+07:00), Home PC `DESKTOP-KDURKJP`
- Công cụ: Claude Code (app desktop, tab Code), model **Claude Opus 5.5** (`claude-opus-5-5`); mức suy luận do Owner chọn cho phiên (phiên không đọc được tên mức); **ultracode tắt**: không subagent, không Workflow.
- Bước 0: `{GÓI}` = F; `claude\F.md` chưa có (phiên mới); `claude\A.md`…`E.md` có đủ, dòng đầu đều `XONG` (A 22:33, B 23:04, C 23:57, D 00:48, E 01:17).
- Chạy song song trong phiên: Codex đợt 1 ở `Project-2C-review-2` (2 tiến trình `codex` lúc đo); app desktop Claude. Node v24.20.0 (`C:\Program Files\nodejs` đặt đầu PATH ở mọi lệnh chạy `node`, vitest, Playwright).

## 2. Bảng R

**Cách làm chung** (mọi probe, log, nguồn ở `C:\workspace\deep-review-1-6-r5\claude\F\`):

- **Probe lượt 4 của chính Claude F** chép theo tên đầy đủ (`Test-Path` từng tên, phụ lục 9.1 của `docs/reviews/raw/2026-10-31/claude/F.md`) vào `F\r4copy\`; bản làm việc ở `F\` chỉ đổi đường dẫn r4 → r5 và cổng (9731 → 9831 / 9832, 4721 → 4741).
- **Đột biến `tools/`:** `F\mut5.mjs` + `F\mutant-config.mjs` (hook `load` của Vite phục vụ bản đột biến của đúng một file; repo không đổi byte nào; chỉ tính khi có dòng `[mutant] served`; đột biến sống ở test nhắm thì chạy lại cả bộ). Đối chứng `tools/` qua cùng config: **388 / 388** xanh (13 file, 9 s). **40 đột biến: 35 bị giết, 5 sống** (`F\mut5.log`). Dòng cuối: `repo git status --short after: ""`.
- **Bản chép ngoài repo:** `F\mirror\e2e` (bản chép `e2e/` ở SHA ghim, `docs\user-guide` chép cạnh để bộ chụp ảnh ghi vào đó; junction `packages`, `apps`, `node_modules`), `F\mirror-old\e2e` (như trên, `perf/probe.perf.ts` thay bằng blob `d040b4f` của `2e51e25`), `F\dc\` (bản chép `packages/ai/src` + `packages/domain` cho dependency-cruiser), `F\dist-anchor` (bản dựng web của worktree ghim, neo 15/09/2026 + ảnh chụp demo như `e2e/serve.mjs`, `build-dist.mjs`), phục vụ ở 127.0.0.1:4741 (không 4173 / 4174, không `pnpm e2e`, không `PW_REUSE`).
- **Exe:** bản chép trong `F\exe\<ca>\` của exe ghim `common\exe\project2c.exe` (sha256 `167D4B3B…5832A`), exe lượt 4 (bản chép của Claude B lượt 4 `r4\claude\B\exe\held\project2c.exe`, sha256 `8E841182…9147`), exe lượt 3 (`r3\claude\F\exe\upgrade\project2c.exe`, sha256 `E93C8BAA…0CE1`); hồ sơ WebView2 riêng, cổng debug 9831 / 9832, DNS mọi host ngoài máy bị chặn (`--host-resolver-rules`) và `route` hủy mọi request không local, `window.open` thay ngay (`F\exe-lib.mjs`); không bấm nút AI / key nào; `Get-Process project2c` = 0 trước mỗi lần chạy.

### 2.1 Bảng R1 của gói F (5 dòng)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-136 (đo) | #896 → #907 | **ĐÃ SỬA** (phần đo; test hở của chính phần sửa: `claude\A.md` CLR5-A2) | **Cặp xen kẽ trong một tiến trình** (`F\p-byname.mjs`, `logs\p-byname.log`; `name-order.ts` của `2e51e25` ↔ bản chép trùng byte file ghim ↔ collator trần; 10 255 lịch hẹn sống của dữ liệu tải lượt 5 sắp theo tên KH rồi giờ; 21 vòng sau một lần khởi động; CPU 6 %, Codex 2 tiến trình): collator trần **8,64 ms**, `2e51e25` **65,08 ms**, ghim **12,24 ms (1,42× trần; Issue: ≤ ~2×)**; thứ tự `2e51e25` ↔ ghim **trùng**. Cùng kết quả với Node của gói A (11,19 / 71,87 / 9,67 ms, 41 lần) và bản web của gói E (sắp theo KH 25,7 ms, lượt 4 60,4). Exe (probe của gói F, mục 6.2): `customers.sort-name` 23 ms (mốc sau #656 23, G7 23, lượt 4 24) | Probe `e2e/perf` không có thao tác "sắp Lịch hẹn theo KH", nên dòng này kết luận bằng Node + bản web. Phần còn hở (không test nào giữ bộ nhớ khóa): CLR5-A2 của gói A, không báo lại |
| DR6-155 | #904 → #926 | **ĐÃ SỬA** (a) và (b) | (a) Đột biến lượt 4 **T83c** (`Read ${paths.length}`) chạy lại = **R155a: KILLED** ("takes a PR it could not read every file of as code (DR6-57)", `tools/pr-core.test.mjs`; lượt 4: sống cả bộ 3 975). (b) Bộ chụp ảnh chạy trên `F\mirror\e2e` (`F\pw-guide.config.mjs`, `F\guide-mut.mjs`, `F\guide-mut.log`): bản ghim **13 passed**, 28 / 28 ảnh trùng byte ảnh repo; **G1** (gỡ cả dòng `style`, = đột biến CXR4-F2) **đỏ** ở "04, 05 hồ sơ KH" — `foot of the part in the shot`; **G2** (gỡ `style` và bỏ `expectShotWhole`, tức kiểm của `2e51e25`) **xanh 13 / 13** dù `05-du-kien-kyc.png` khác ảnh repo — chính lỗ lượt 4 | Biến thể: **G3** (gỡ nửa `header { position: static }`) đỏ ở "06 AI" — `top of the part`; **G4** (gỡ nửa `scroll-margin-top`) đỏ ở "04, 05" — `foot`; **G5** (kiểm chỉ đầu phần chụp) xanh khi `style` còn — đúng: kiểm chỉ đỏ khi `style` hỏng, như thân PR #926 tả. Mirror trả về byte repo sau mỗi đột biến |
| DR6-156 | #904 → #926 (+ #934 → #965) | **ĐÃ SỬA**; một nhánh của phần sửa không ca nào giữ → **CLR5-F1** | Tái hiện CXR4-F1 bằng chuỗi `notes-for --files` (`openNotes` → `targetPatterns` → `relatedNotes`) trên sổ tự dựng và danh sách file thật của repo (`F\p-notes.mjs`, `F\p-notes.log`, `notes-core.mjs` của `2e51e25` ↔ ghim): đích `packages/*/src/schema.ts` với ghi chú `packages/ai/src/` → `2e51e25` **(none)**, ghim **`packages/ai/src/`** (và `packages/db/`). Gỡ sửa: **R156a** (`covers` về cách cũ) **KILLED** 2 ca ("reads a glob against a folder note one folder at a time (DR6-156)", "finds a folder note from a glob given on the command line (DR6-156)"); **R156c** (đoạn không khớp vẫn cho qua) KILLED 3 | 18 đích (p-notes): `apps/*/src/routes/*/CustomerProfile.tsx`, `apps/desktop/src/routes/*/`, `e2e/*/probe.perf.ts`, `*/ui/src/components/*.tsx` nay thấy ghi chú thư mục (cũ: không); `e2e/*.ts`, `packages/*`, `tools/*.mjs` như cũ (không). Một glob kết thúc bằng `/` (`packages/*/`) chỉ gặp thư mục đúng độ sâu (`packages/db/`, không `packages/ai/src/`) — không Issue nào viết đích kiểu này (`grep` `fixes.md`: 0), không ghi phát hiện. **R156b** (`return parts.length > names.length` → `return true`) **sống cả bộ 4 387** → CLR5-F1 |
| DR6-157 | #904 → #926 | **ĐÃ SỬA** | `F\p-size.mjs` (`F\p-size.log`): `bundleReport` của `2e51e25` ↔ ghim trên `apps/desktop/dist` thật của cổng (24 file, chỉ đọc): bản dựng sạch cả hai **19 file / 1 022 121 B** (= `baseline.md`); thêm `demo-2026-09-15.sqlite` 9 969 664 B (trong bộ nhớ, không ghi `dist`): `2e51e25` **20 file / 10 991 785 B**, ghim **19 / 1 022 121**. Gỡ sửa: **R157a** (đếm mọi file không phải JS / CSS) KILLED ("counts as other files those a build writes, not the database e2e leaves next to them (DR6-157)"); R157b (bỏ `wasm`), R157c (thêm `sqlite`), R157d (bỏ font) KILLED | Biến thể: `.js.map`, `.PNG` viết hoa, `.json`, `.webmanifest`, `.mp4`, `.txt`, `project2c.db`, `*.sqlite-journal` → không vào "Tệp khác" ở ghim. Bản dựng hiện chỉ sinh html / wasm / woff2 / png (asset nguồn của app: 3 png, 13 woff2; 2 txt là giấy phép font, không import), nên không thiếu gì hôm nay; ghi lại: một loại asset mới sau này (vd. `.map` của bản `TAURI_ENV_DEBUG`) sẽ không vào số đo mà không báo |
| CLR4-F2 (KNOWN) | #905 → #928 (tài liệu) | **ĐÃ SỬA** (dòng ghi có, khớp app) | `docs/testing/nghiem-thu-v1.md:343` (NT-EX-08, cột Ghi chú) và `:344` (NT-EX-09) có câu ngoại lệ (K1, R2-02, CLR4-F2). **Chuỗi K1** trên exe (`F\kf5-upgrade.mjs K1`, `logs\kf5-K1.log`): exe lượt 3 (`119e2e4`, trước T-291) dán "Lý do dời" U+200B U+0085 U+200B qua 6e → DB `["01M6NSCN…","RESCHEDULED","E2808BC285E2808B",0]` → Xuất backup. (a) Exe **ghim** nhập file đó ở thư mục mới: hộp 10b "Không nhập được file … File hỏng hoặc không phải backup Project-2C · Chỉ nhận file .p2cbackup do Project-2C xuất … Dữ liệu hiện tại không bị đổi." (b) Exe ghim mở tại chỗ thư mục exe lượt 3 (mở không lỗi, backup lúc mở `project2c-s00000001-…`), Xuất backup, nhập **chính file vừa xuất**: cùng hộp 10b — đúng từng vế của ghi chú NT-EX-08 / 09 | Hành vi dưới dòng vẫn là KNOWN K1 (Q4 (a) của lượt 4), không báo lại. Ghi chú nêu cả "lịch đã xóa cũng tính": khớp luật 4 của `backup-validation.ts` (áp cho mọi dòng `appointments`, đọc ở `claude\A.md`) |

### 2.2 Bảng R2 của gói F (18 dòng)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-333 (phần F: `globMeetsFolder`) | #934 → #965 | **ĐÃ SỬA** (phần F; bộ chặn ký hiệu: `claude\D.md`) | Mục 3 của Issue (đoạn glob có `**` lẫn chữ, review #926): **T333a** (đoạn có `**` gặp mọi thư mục) **KILLED**, **T333b** (`**` đọc như `*`) **KILLED** — cả hai ở "meets a folder at a part with `**` and more only where the folder begins as that part" | p-notes: `packages/ui/src/c**/Button.tsx` thấy `packages/ui/src/components/`, `**/components/Button.tsx` thấy mọi ghi chú thư mục (đúng nghĩa "có thể có file khớp") — như `2e51e25`. Chỗ hở của DR6-156: CLR5-F1 |
| T-334 | #935 → #948 | **ĐÃ SỬA** (tài liệu) | Năm test chấp nhận có trên file ở SHA ghim: `phase-6.md:411` "các đợt sửa từ sau lượt 3"; `phase-5-ai.md:311` "không quá 100 code unit (UTF-16)"; `PROJECT-STATE.md:148-157` (quyết định Owner #899 / PR #917, mỗi ý trỏ comment) và `:168` (G8 01/11 của #901 / PR #920); `nghiem-thu-v1.md:407` mục "Ô chọn" có vế 7d riêng; bản tổng hợp lượt 4 §1 / §6 / §8.3 / §10.1 như thân PR | Mục "Ô chọn" chưa nêu 7c: `claude\D.md` CLR5-D4, không báo lại |
| T-335 | #942 → #944 | **ĐÃ SỬA**; hai nhánh không test nào giữ → **CLR5-F2** | Đọc hết `tools/auto-wait.mjs`, `auto-wait-core.mjs`, `review-hint-core.mjs` (phần #944), `pr-status.mjs` (`loadPrFiles`). Gỡ sửa (`F\mut5.mjs`), phần #944: **W01–W04, W06–W14, W16–W18, W20–W22** (isTime cuộn ngày, SHA không hạ chữ, `--once` đi cùng `--timeout`, 30 s tối thiểu, run còn chạy, docs-only, `--not`, CHANGES đọc là tốt, `sameSha` một chiều, nhiều PR đóng Issue, PR đóng không merge, số dính sau, PR cũ nhất, `--once` đọc lỗi là "not yet", giấc cuối < 30 s, report giữ xuống dòng, đọc run mỗi lượt, đỏ trước khi run xong, `MAX_FAILURES` 6): **19 / 19 KILLED** ở `auto-wait-core.test.mjs`; **H3, H4** (dòng "review PR #N" không neo, bỏ nhánh `[auto-issues]`) KILLED. **Sống:** W15 (lần đọc tốt không đặt lại đếm lỗi liên tiếp), W13b (bỏ lookbehind của `titleRegExp`) → CLR5-F2. Tổng phần #944: 21 / 23 bị giết | Cách làm của pipeline: K45 / K17, không xét. `pr-status` dùng chung `loadPrFiles` (refactor, không đổi hành vi: diff 16 dòng chỉ dời khối) |
| T-336 (phần F: dependency-cruiser) | #950 → #956 | **ĐÃ SỬA** (phần F; Mock trích xuất: `claude\C.md`) | `F\dc-probe.mjs` (`logs\dc-probe.log`): `depcruise packages` trên bản chép `F\dc` với cấu hình ghim / `2e51e25` / đột biến. Đối chứng ghim: 0 vi phạm thật (chỉ `not-to-unresolvable` tới `docs/…?raw`, do bản chép không có `docs/`). **P4** (file SP import `vitest`): ghim báo `ai-only-on-domain-and-zod: …/zz-probe.ts → …/vitest/dist/index.d.ts`; `2e51e25` **không báo**; **M2** (`exclude` cũ `(^|/)(dist|coverage|src-tauri)/`) **không báo** — đúng lỗ review #937. **M4** (bỏ miễn `test-support`) → đúng 1 lỗi `test-support.ts → vitest` như thân PR #963 | **P7** (biến thể): `test-support.ts` import `@p2c/db` → ghim **không báo** (`2e51e25` báo `ai-only-on-domain-and-zod`): phần miễn không chỉ cho `vitest` mà cho mọi import, như file `*.test.ts` vốn được; `test-support` chỉ test được import (P1) nên không vào bundle. Không ghi phát hiện |
| T-338 | #952 → #954 | **ĐÃ SỬA**; một nhánh không test nào giữ → **CLR5-F2** | `--since` (chờ CI sau `close` + `reopen`): **W05** (`>=` → `>`) KILLED, **W05b** (bỏ `since`) KILLED, **W19** (đọc file mọi lượt) KILLED. Skill dùng `closedAt` của GitHub làm mốc (`SKILL.md:274`), nên không lệch đồng hồ máy. Khối app trong gợi ý review: **H1** (giữ khối) KILLED, **H5** (bỏ `side-sessions-event`) KILLED. **Sống:** H6 (khối khớp tham lam tới thẻ đóng cuối) → CLR5-F2; H2 (thay khối bằng chuỗi rỗng thay vì xuống dòng) sống, gần tương đương (`F\p-hint.mjs`: chỉ khác khi có chữ đứng trước khối trên cùng dòng và dòng "review PR #N" theo ngay sau khối). Tổng phần #954: 5 / 7 bị giết | Phần skill (giữ nhánh local, §3.8, rào) là tài liệu của pipeline (K45); `.claude/rules/*.md` có trong rào (`SKILL.md:19`) |
| T-339 (phần F: `AI_TEST_FILES`) | #960 → #963 | **ĐÃ SỬA** (phần F; test thời gian và ca qua dòng: `claude\C.md`) | `.dependency-cruiser.cjs:4` một hằng `AI_TEST_FILES = '(\\.test|/test-support)\\.ts$'`, dùng ở `from.pathNot` của hai rule và `to.path` của rule sau. dc-probe: **P2** `latest-support.ts` có `vitest` → ghim báo rule đầu, `2e51e25` không; **P3** `web-test-support.ts` → ghim báo, `2e51e25` không; **P1** SP import `./test-support` → ghim báo `ai-test-support-only-in-tests`; **M3** (tắt rule sau) → P1 không báo; **P5** SP import một file `.test.ts` → ghim báo (thêm của #963); **P6** `sub/test-support.ts` → ghim báo rule sau | **M1** (mẫu không neo, như #956): P2 / P3 vẫn bị báo, nhưng ở rule sau (`to.path` khớp cả `latest-support.ts`) thay vì rule đầu — hai cấu hình chỉ khác tên rule báo |
| T-340 | #961 → #967 | **ĐÃ SỬA** (tài liệu) | `.claude/skills/auto-issues/SKILL.md:259` (brief §3.8): "chạy `node tools/notes-for.mjs --diff`, cập nhật mục "Ghi chú OPEN liên quan" của thân PR nếu đổi"; câu trỏ dòng ở §4 không còn "như dòng cuối của danh sách này" (`grep`: 0) | — |
| T-342 (phần F: bảng PR vượt ngưỡng) | #973 → #975 | **ĐÃ SỬA** (tài liệu, khớp số) | `F\pr-range.mjs 859 974` (`logs\pr-range-859-974.log`; commit squash trên `main` có tiêu đề "(#N)", `classifyFile` ghim, luật đầu bảng, phần Rust từ `#[cfg(test)]` tách theo từng hunk): **83 PR merge, 25 có code / test, 4 vượt ngưỡng**: #917 SP 465 (+387 / −78) tổng 938; #937 SP 1 451 (+735 / −716) tổng 3 431 − 3 dòng codemap = 3 428; #939 SP 441 tổng 690; #944 SP 394 tổng 1 297 — **trùng `phase-6.md:334-381`** ("83 PR, 25 có code hoặc test", "4 / 25, cả bốn ở bảng chính"); không PR nào trong dải ở biên | Ca ghim thẻ mở: `claude\D.md`. Không đếm lại #515…#858 (dòng R2 của T-307 lượt 4) |
| T-343 | #977 → #978 | **ĐÃ SỬA** (ảnh, khớp app) | Bộ chụp ảnh của SHA ghim chạy trên `F\mirror\e2e` + `F\dist-anchor` (neo 15/09/2026): **28 / 28 ảnh trùng từng byte** `docs/user-guide/img/*.png` (`Get-FileHash`), 13 passed | Ảnh là ảnh của code ghim (code `37a80b6` = `3d237b0`); DR6-155 (b) đỏ khi gỡ `style` (dòng DR6-155) |
| T-345 | #983 → #984 | **ĐÃ SỬA** | **Gỡ phần sửa trên exe:** probe `e2e/perf` của `2e51e25` (`F\mirror-old\e2e\perf`, blob `d040b4f`) trên bản chép exe ghim + dữ liệu tải nhập qua Cài đặt → Dữ liệu, cổng 9832 (`F\perf-run.mjs`, `logs\perf-old-probe.log`): **đỏ sau 72 s** ở `appointments.select-day-month` — `waiting for getByRole('region', { name: /^Lịch tháng/ }).getByRole('button', { name: /Đã gặp/ }).first()` (tháng 11/2026 không có ngày Đã gặp: đúng lỗi Issue nêu). **Probe ghim** cùng cách dựng (`logs\perf-pinned-probe.log`): **1 passed (2,8 phút)**, in `Lịch tháng 10/2026, 1 back: 10 days met` | `metDays` (`probe.perf.ts:231-263`) đọc tiêu đề tháng một lần và dừng khi lịch không mở ở tháng chứa hôm nay |
| T-346 | #986 → #988 | **ĐÃ SỬA** | `metYear` / `stepYears` / `toMetYear` / `checkPeriods` (`probe.perf.ts:280-340`): kỳ Năm lùi tối đa `YEARS_BACK` = 1 năm, kiểm trước vòng nhập backup (`:592`); probe ghim chạy hết trên exe (dòng T-345), `baseline.md` in `Lịch năm 2026, 0 back: 79 met`. Không tái hiện được ca "sang năm mới" trên exe (đồng hồ máy 11/2026; không đổi đồng hồ máy) | Đọc: năm 2028 trở đi cần lùi 2 năm → probe dừng với câu `MORE_MET` chỉ cách sinh dữ liệu tải mới (README bước 1, 3, 4): có chủ ý |
| T-347 | #990 → #992 | **ĐÃ SỬA** | `metRows()` một locator cho `metYear` và `nextAppointment` (`:207`, `:556`); `metDays` kiểm tháng chứa hôm nay (`:239-241`); probe ghim xanh, `next-month` 111 ms, `next-year` 110 ms (Năm − Tháng −1 ms ≤ 50) | — |
| T-348 | #994 → #995 | **ĐÃ SỬA** (số đo khớp file gốc) | Bảng probe của `phase-6.md` mục "Số đo G7, NT-HN-01" (`:243-330`) so với `common\perf\perf-g7.json` (bản chép của `g7-home-pc\lan-2`, sha256 `995E9238…`): **35 / 35 dòng trùng** (số lần, trung vị, min, max) | Số ngoài probe (LCP, mở lại, Dọn sạch) không có file gốc trong `common\`: cùng cỡ với `baseline.md` của lượt 5 cùng máy |
| T-349 | #997 → #999 | **ĐÃ SỬA** (tài liệu) | Ghi chú NT-HN-01 (`nghiem-thu-v1.md:388`) không chép số, trỏ "`phase-6.md` mục "Số đo G7, NT-HN-01""; Cách đo của mục đó có bước 3 mở lại 3 lần, ghi "lượt 4 không đo mở lại" | — |
| T-351 | #1002 → #1003 | **ĐÃ SỬA** (tài liệu, đếm khớp) | Đếm lại cột Đạt / Lỗi của 243 dòng NT (`node -e` trên `nghiem-thu-v1.md`): `L2` **222 ✅ · 1 ⚠️ (NT-LH-19) · 1 ❌ (NT-TR-07) · 18 —**, 1 dòng không có L2 (NT-HN-01, L1) — trùng ô Kết quả của dòng L2 (`:39`) | 6 dòng `L2 ✅` còn phần Owner được nêu ở ô Phạm vi |
| T-352 (phần F: nghiệm thu) | #1004 → #1007 | **ĐÃ SỬA** (tài liệu, khớp app) | Mục "Dữ liệu" (`:21`) nêu "Seed vừa sinh không có lịch Chưa ghi kết quả" và danh sách dòng cần tạo — **khớp exe**: chuỗi K2 trên exe lượt 4 tìm 4 tháng không thấy lịch Chưa ghi kết quả nào trong seed, phải nhập bù; ô Phạm vi L2 nêu 6 dòng còn phần Owner; chú giải ⚠️ ở "Ghi kết quả" (`:29`); NT-AI-03 (`:205`) không còn liên kết "Xem ở Dữ kiện KYC →" | Rà các dòng có "Ghi kết quả" / "đã qua" ở Thao tác: NT-LH-24, 27, 30, NT-TR-18…20 không cần lịch Chưa ghi kết quả có sẵn (tự tạo, hoặc dùng lịch tương lai / hôm nay theo đúng ý dòng) |
| T-354 | #1012 → #1014 | **ĐÃ SỬA** (tài liệu) | NT-TR-12 có trong danh sách của mục "Dữ liệu" (`:21`); Kết quả mong đợi của NT-AI-03 không còn dấu chấm thừa sau câu trong ngoặc kép | — |
| T-355 | #1017 → #1020 | **ĐÃ SỬA** (tài liệu, đếm khớp) | Đếm lại: `L3` **38 ✅ · 0 ⚠️ · 1 ❌ (NT-HD-01) · 0 —** trên 39 dòng có L3 — trùng ô Kết quả của dòng L3 (`:40`); ô Exe ghi `3d237b0` và "cũng là exe của `main` tới `331e7a0`" (ghi chú review #1020, đã gộp vào T-356) | NT-HD-01 vẫn `L3 ❌ #1019` ở SHA ghim: #1019 (T-356) chỉ sửa hướng dẫn, chưa có lượt nghiệm thu nào sau đó — việc G7 (mục 10), không phải phát hiện |

### 2.3 Bảng R1 gộp đủ 25 dòng (Claude lượt 5, A–F)

| Mã | Issue → PR | Kết luận | Bằng chứng (báo cáo) | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-135 | #896 → #907 | **ĐÃ SỬA** | A: tái hiện lượt 4 (`same-day-kept`) → `STAGE_KEPT_BY_MEETING` ở cả ba đường; đột biến `date > ?` → cả ba `OK`, xuất → nhập `BACKUP_INVALID {"rule":4}`; gỡ sửa KILLED 1 ca | A: biến thể xóa / khôi phục ngược thứ tự, 6f, nhập backup giữa chuỗi đều đúng |
| DR6-136 | #896 → #907 | **ĐÃ SỬA** | A (Node 11,19 / 71,87 / 9,67 ms), E (web 25,7 ms ↔ lượt 4 60,4), F (cặp xen kẽ 12,24 / 65,08 / 8,64 ms, thứ tự trùng) | Gỡ phần sửa không test nào đỏ → **CLR5-A2** |
| DR6-137 | #896 → #907 (+ #933 → #946) | **ĐÃ SỬA** | A: ba nhãn model hỏng → `AI_ANALYSIS_INVALID`, ca biên 100 đơn vị xuất / nhập được; 3 đột biến KILLED; `readsBackAsIs` ⇔ "đọc lại y như lưu" trên 200 020 chuỗi. C: nhãn app ghi được qua `isLabel` | Nhãn chỉ có ký tự vô hình → **CLR5-A3** |
| DR6-138 | #897 → #915 | **ĐÃ SỬA** | B: 8 đột biến lượt 4 (CSP, `identifier`, `is_file`, `DISK_FULL`) nay KILLED; seam `backup_with` không đổi hành vi (14 trạng thái, `diff` rỗng) | Test hợp đồng chỉ đọc `default.json#permissions` → **CLR5-B1** |
| DR6-139 | #898 → #911 | **ĐÃ SỬA** | B: tái hiện lượt 4 → `flush` xong sau lần thay; F1, F2, F4, F5 KILLED | F3 sống, gần tương đương |
| DR6-140 | #898 → #911 (+ #933 → #946) | **ĐÃ SỬA** | B: L0, L5 KILLED; qua lớp dữ liệu: listener ném / tự gỡ không làm `reloadDemoData` reject | — |
| DR6-141 | #899 → #917 (+ #930, #931, #950, #960) | **ĐÃ SỬA** | C: 20 câu sai lượt 4 → 0 đề xuất; R141a / b / c KILLED; 3 556 ghi chú thật: 640 đổi, đều chỉ thêm "Ly hôn" (có chủ ý) | Biến thể mới của C: CLR5-C1 (test), CLR5-C2 (hiệu năng) |
| DR6-142 | #900 → #909, #913 (+ #930) | **ĐÃ SỬA** | C: tái hiện DSR4-C1 → V3 / V4 / V5 / V6 chặn; R142a / b KILLED | Phần "Mất" §14.5: K43 |
| DR6-143 | #900 → #909, #913 (+ #930) | **ĐÃ SỬA** | C: 5 câu lượt 4 → V6; R143a / b KILLED | Tác dụng phụ đã duyệt (K43) |
| DR6-144 | #899 → #917 (+ #933 → #946) | **ĐÃ SỬA** | C: lỗi giữ lại hết sau Nhập backup / Nạp lại; R144a / b / c KILLED | — |
| DR6-145 | #901 → #920 (+ #934, #969, #973) | **SỬA MỘT PHẦN** → **CLR5-D1** | D: (a), (c) và các dạng Issue #901 nêu đã bị báo; `←`, `–`, `…`, ngoặc kép cong, ký hiệu escape / thực thể của mô tả DR6-145 (b) vẫn `missed` 6 / 6; không quyết định Owner nào chốt bỏ | Dấu nối JSX bị Prettier ngắt dòng bỏ sót → **CLR5-D2** |
| DR6-146 | #902 → #922 (a), #898 → #911 (b) | **ĐÃ SỬA** | D: R109c, RB2c (sống ở lượt 4) nay KILLED | — |
| DR6-147 | #898 → #911 | **ĐÃ SỬA** | B (hàng đợi báo đồng bộ, hộp hiện 1 lần), D (tái hiện K1, K7 lượt 4 trên bản build: focus về `H1`, hộp tự đóng) | — |
| DR6-148 | #902 → #922 (+ #932, #951) | **ĐÃ SỬA** (đủ bốn chỗ của mô tả) | D (hộp thoại, màn Team: đột biến KILLED), E (So sánh team, Báo cáo: tái hiện lượt 4 hết tràn; E148c, E148d KILLED) | Chỗ mô tả chưa nêu còn tràn → **CLR5-D3**, **CLR5-E1**; cột Team của Theo RE không ca nào giữ → **CLR5-E4** (c) |
| DR6-149 | #901 → #920 (+ #905, #935) | **ĐÃ SỬA** | D: sáu điểm của mô tả; CH1, CH2 KILLED; 9a / 7c đúng `.choice` | Mockup 7c chưa ghi ở "Lệch mockup đã biết" → **CLR5-D4** |
| DR6-150 | #903 → #924 (+ #933, #951) | **ĐÃ SỬA** | E: tái hiện lượt 4 → Case size vô hình lưu được; E150a–d KILLED | Hộp HĐ 8a–8d → **CLR5-E3**; hai ô tìm → **CLR5-E2** |
| DR6-151 | #903 → #924 (+ #933 → #946) | **ĐÃ SỬA** | A (mã KH của `TrashRow`, 1 215 / 1 215), E (Thùng rác lớn: 0 tên KH dùng chung; E151a–c KILLED) | Lịch hẹn / HĐ của hai KH cùng tên → **CLR5-A1** |
| DR6-152 | #903 → #924 | **ĐÃ SỬA** | E: `PURGE_REMINDER` không còn `export`; scanner không còn liệt kê | — |
| DR6-153 | #903 → #924 | **ĐÃ SỬA** | E: RB2e, T305b (sống ở lượt 4) nay KILLED | F (chuỗi F3, exe): câu từ chối của Nhập backup có vế "Thử lại" đúng chữ |
| DR6-154 | #903 → #924 (+ #933, #951) | **ĐÃ SỬA** | E: focus ở nút `aria-disabled` "Đang …", chạy một lần; E154a–c KILLED | Nhánh chặn chạy lại của 10a không ca nào giữ → **CLR5-E4** (a) |
| DR6-155 | #904 → #926 | **ĐÃ SỬA** | F: R155a (= T83c) KILLED; bộ chụp ảnh đỏ khi gỡ `style` (G1, G3, G4), kiểm của `2e51e25` xanh (G2) | — |
| DR6-156 | #904 → #926 (+ #934 → #965) | **ĐÃ SỬA** | F: đích `packages/*/src/schema.ts` thấy ghi chú `packages/ai/src/` (`2e51e25`: không); R156a, R156c KILLED | R156b sống → **CLR5-F1** |
| DR6-157 | #904 → #926 | **ĐÃ SỬA** | F: `.sqlite` không vào "Tệp khác" (`2e51e25`: +9 969 664 B); R157a–d KILLED | — |
| DR6-37 | #790 → #845, #901 → #920 | **ĐÃ SỬA** (theo mô tả lượt 1, phần D và E) | D: bốn vị trí L·CL-D5 lượt 1 (gồm vị trí đầu "{trường}: {giá trị}" mà lượt 4 sót) qua i18n; E: tám chỗ L·CL-E5, đặt lại ký hiệu → bộ chặn bắt 6 / 6 | Chỗ hở của bộ chặn giữ DR6-37: dòng DR6-145 (CLR5-D1, D2) |
| CLR4-F2 | #905 → #928 (tài liệu) | **ĐÃ SỬA** (dòng có, khớp app) | F: chuỗi K1 trên exe ghim từ chối cả bản xuất exe lượt 3 lẫn bản tự xuất sau nâng cấp tại chỗ, đúng câu 10b ghi ở NT-EX-08 / 09 | Hành vi vẫn là K1 |

**Đếm R1 gộp: 24 ĐÃ SỬA · 1 SỬA MỘT PHẦN (DR6-145 → CLR5-D1) · 0 CHƯA SỬA · 0 HỒI QUY.**

### 2.4 Bảng R2 gộp đủ 28 dòng (Claude lượt 5, A–F)

| Mã | Issue → PR | Kết luận | Gói (bằng chứng) | Ghi chú |
|---|---|---|---|---|
| T-329 | #930 → #937 | **ĐÃ SỬA** | C: hai bản chép `97876b4` ↔ `b6d4388` cho **61 703 / 61 703 dòng giống hệt** (regex dựng lúc nạp, Mock trên 60 000 ghi chú, V3–V6) | Refactor không đổi hành vi |
| T-330 | #931 → #939 | **ĐÃ SỬA** | C: R330a–i KILLED (62 / 20 / 2 / 11 / 5 / 3 / 3 / 3 / 3 ca) | — |
| T-331 | #932 → #941 | **ĐÃ SỬA** | D (mục 1, 2, 4: DT1, T1, T2, T5, D2 KILLED), E (mục 3: E331a KILLED) | Khách hàng → Bảng: CLR5-D3 |
| T-332 | #933 → #946 | **ĐÃ SỬA** (đủ sáu mục) | E (ô Giờ, focus 10a / 10b, chú thích e2e), A (`readsBackAsIs`: 0 khác trên 200 020 chuỗi), B (`listeners.ts`: L1–L7 KILLED, không đổi hành vi với listener tự gỡ / thêm), D (khóa `customer.withCode`), C (`AiJobs` qua `notify`: R332c KILLED) | `listeners.ts` không làm hỏng việc của listener khác hay của lệnh (B, F8 qua lớp dữ liệu) |
| T-333 | #934 → #965 | **ĐÃ SỬA** | D (bộ chặn: G7, G7b, G8 KILLED; 0 báo nhầm trên 356 file), F (`globMeetsFolder`: T333a, T333b KILLED) | — |
| T-334 | #935 → #948 | **ĐÃ SỬA** (tài liệu) | F | — |
| T-335 | #942 → #944 | **ĐÃ SỬA** | F: 21 / 23 đột biến của phần #944 KILLED | Test hở → **CLR5-F2** |
| T-336 | #950 → #956 | **ĐÃ SỬA** | C (R336a–c KILLED), F (dependency-cruiser: P4 báo ở ghim, không báo ở `2e51e25` / `exclude` cũ) | Phép thử chữ cái của `worded` không test nào giữ → **CLR5-C1** |
| T-337 | #951 → #958 | **ĐÃ SỬA** | E (ô Giờ: E337a KILLED), D (`Button`: B1 KILLED) | — |
| T-338 | #952 → #954 | **ĐÃ SỬA** | F: W05, W05b, W19, H1, H5 KILLED (5 / 7) | Khối khớp tham lam không ca nào giữ → **CLR5-F2** |
| T-339 | #960 → #963 | **ĐÃ SỬA** | C (R339a, R339b KILLED), F (`AI_TEST_FILES`: P1–P6) | — |
| T-340 | #961 → #967 | **ĐÃ SỬA** (tài liệu) | F | — |
| T-341 | #969 → #971 | **ĐÃ SỬA** | D: G9 (cách sửa của mục ACCEPTED) KILLED đúng ca ghim | Mục ACCEPTED: KNOWN |
| T-342 | #973 → #975 | **ĐÃ SỬA** | D (G10 KILLED ca ghim thẻ mở), F (đếm lại #859…#974 trùng bảng) | — |
| T-343 | #977 → #978 | **ĐÃ SỬA** (ảnh) | F: 28 / 28 ảnh trùng byte bộ chụp của code ghim | — |
| T-344 | #980 → #981 | **ĐÃ SỬA** (tài liệu) | D: hàng "Chuyển nhóm" khớp `customer-forms.html` 5d–5e | — |
| T-345 | #983 → #984 | **ĐÃ SỬA** | F: probe `2e51e25` đỏ đúng chỗ trên exe; probe ghim xanh | — |
| T-346 | #986 → #988 | **ĐÃ SỬA** | F (đọc + probe ghim xanh; ca sang năm mới không tái hiện được trên exe) | — |
| T-347 | #990 → #992 | **ĐÃ SỬA** | F | — |
| T-348 | #994 → #995 | **ĐÃ SỬA** (số đo) | F: 35 / 35 dòng trùng `perf-g7.json` | — |
| T-349 | #997 → #999 | **ĐÃ SỬA** (tài liệu) | F | — |
| T-350 | #1001 → #1011 | **ĐÃ SỬA** | A (`appointmentGroup`: 588 phép so, 0 lệch; đột biến KILLED 12 ca), E (màn: dòng, tên nút, hộp 11b; E350a, b KILLED), F (chuỗi F2 exe lượt 4 → exe ghim; F5, F6 trên bản web) | Phần nối `today` ở màn không ca nào giữ → **CLR5-E4** (b) |
| T-351 | #1002 → #1003 | **ĐÃ SỬA** (tài liệu) | F: đếm L2 trùng | — |
| T-352 | #1004 → #1007 | **ĐÃ SỬA** (tài liệu) | F (nghiệm thu), D (bảng cổng KYC của hướng dẫn khớp bản web) | — |
| T-353 | #1005 → #1009 | **ĐÃ SỬA** (tài liệu) | E: NT-LH-19, NT-LH-28 khớp màn (cả ca 30/04/2027) | — |
| T-354 | #1012 → #1014 | **ĐÃ SỬA** (tài liệu) | F | — |
| T-355 | #1017 → #1020 | **ĐÃ SỬA** (tài liệu) | F: đếm L3 trùng | NT-HD-01 còn `L3 ❌` chờ lượt nghiệm thu sau T-356 (G7) |
| T-356 | #1019 → #1023 | **ĐÃ SỬA** (tài liệu) | D: `01-bat-dau.md`, `02-tong-quan.md` khớp bản web (`p2c.lastRoute`) | — |

**Đếm R2 gộp: 28 / 28 ĐÃ SỬA · 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY.** Refactor / hiệu năng không đổi hành vi (plan §L5.4): T-329 (C, 61 703 dòng giống hệt), `listeners.ts` của T-332 (B), `readsBackAsIs` (A), `byName` (A, F: thứ tự trùng `2e51e25`), dữ liệu tải `2e51e25` ↔ ghim chỉ khác `prompt_version` (F, mục 4 F9).

## 3. Phạm vi đã đọc (gói F)

- **Diff `2e51e25..37a80b6` của gói F** (`git diff --stat` trên `tools`, `e2e`, `.github`, `.githooks`, `.claude`, `packages/ui/scripts`, `apps/desktop/vite.config.ts`, file gốc): 21 file code + 3 file `.claude` (skill `auto-issues` 344 dòng, `review-pr` 5 dòng, README skill). **Đọc hết:** `tools/auto-wait.mjs`, `tools/auto-wait-core.mjs`, `tools/review-hint-core.mjs`, `tools/session-core.mjs` (`latestReview`, `checkCounts`), `tools/session-io.mjs`, `tools/pr-status.mjs`, `tools/pr-core.mjs:59-95`, `tools/notes-core.mjs:179-260`, `tools/size-report.mjs`, `tools/size-report-core.mjs:160-200`, `.dependency-cruiser.cjs`, `e2e/perf/probe.perf.ts` (phần diff: `:31-42`, `:203-340`, `:409-445`, `:535-610`), `e2e/guide/shots.guide.ts:1-120`, `e2e/guide/check.guide.ts`, `e2e/guide/links.ts:1-30`, `e2e/serve.mjs`, `playwright.guide.config.ts`, `playwright.perf.config.ts`, `e2e/perf/README.md` (bước, biến môi trường); test: tên ca và phần thân liên quan của `tools/{auto-wait-core,review-hint-core,notes-core,size-report-core,pr-core}.test.mjs`. Không đổi từ `2e51e25`: `.github/**`, `.githooks/**`, `tools/merge-pr.mjs`, `apps/desktop/vite.config.ts`, `playwright.config.ts`, `e2e/{fixtures,support,anchor}.ts`, `e2e/perf/stats.ts`.
- **Chỗ gói khác nối vào** (để dựng chuỗi): `apps/desktop/src/data/app-data.ts:340-420` (`inTurn`, `replace`, `backUp`), `apps/desktop/src/shell/{CloseGuard.tsx,close-guard.ts}`, `apps/desktop/src/routes/SettingsBackup.tsx:49-260`, `apps/desktop/src-tauri/src/storage.rs` (`backup`: dùng lại bản trùng byte, `:246-320`, `:623-640`), `apps/desktop/src/routes/appointments/{AppointmentsScreen.tsx:675-705,DeleteAppointmentDialog.tsx,AppointmentDialog.tsx:360-400}`, `apps/desktop/src/routes/customers/extraction-view.ts:55-95`, `packages/db/src/customers.ts:510-545` (`plannedOff`), `packages/domain/src/name-order.ts`, `apps/desktop/src/i18n/vi.ts` (khóa `appointmentForm.*`, `appointmentDelete.*`, `trash.*`, `customerForm.*`, `extraction.*`, `settings.backup.*`).
- **Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/ai/CLAUDE.md` (mục File hay tìm), `.claude/rules/tests.md`, `.claude/skills/auto-issues/SKILL.md` (`:17-31`, `:96-137`, `:170`, `:254-274`), `docs/metrics/phase-6.md:243-381`, `docs/testing/nghiem-thu-v1.md` (đủ: mục Cách dùng, 243 dòng NT, "Lệch mockup đã biết"), `docs/design/phase-3-du-lieu.md:180` (bàn giao), `docs/design/phase-5-ai.md:311`, `:322`, `docs/PROJECT-STATE.md:148-168`, `docs/design/mockups/ai.html:756-764`; `common\{prompt-claude.md, known.md (đủ), baseline.md (đủ), plan.md §L5.1–§L5.6, §L5.8, fixes.md (Issue + PR của #904/#926 đủ; phần dependency-cruiser của #950/#956, #960/#963; test chấp nhận của #935/#948)}`; tổng hợp lượt 4 §6.6, §7, §8.4; báo cáo gốc Claude F lượt 4 (đủ); `claude\A.md`–`E.md` lượt 5 (mục 1, 2, 6, 7 và trường "Liên quan").
- **Ngoài repo, đọc theo tên đầy đủ (sau `Test-Path`):** probe lượt 4 của Claude F (35 tên, mục 9.1), `r4\claude\F\load\load-2e51e25.p2cbackup`, `r4\claude\B\exe\held\project2c.exe`, `r3\claude\F\exe\upgrade\project2c.exe`; `common\{load\load-2026-10-12-seed6.p2cbackup, exe\project2c.exe, perf\perf-g7.json}`. Không mở thư mục nào của `codex\`, `deepseek\`, `muse\` ở bất cứ lượt nào; không liệt kê / tìm kiếm trên `C:\workspace\` hay các thư mục `deep-review-1-6*`.

## 4. Kịch bản mới đã thử

Chưa có trong báo cáo lượt 1–4 (đọc mục 4 của Claude F lượt 4: F1–F12, và tổng hợp lượt 4) và trong `claude\A.md`–`E.md` lượt 5. **Chuỗi nhiều bước qua nhiều gói: F2, F3, F4, F5, F6** (cùng F1, chuỗi chạy lại của R1 CLR4-F2).

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| F1 | **Exe lượt 3 → exe ghim, CLR4-F2** (R1; = F11 lượt 4 với exe ghim thay exe lượt 4): 6e dán lý do U+200B U+0085 U+200B → xuất → exe ghim nhập (thư mục mới); exe ghim mở tại chỗ → xuất → nhập file của chính nó | Hai lần từ chối, đúng câu 10b ghi ở NT-EX-08 / 09; mở tại chỗ không lỗi, có backup lúc mở | — |
| F2 | **Exe lượt 4 → exe ghim qua Thùng rác (T-350; A / E / F):** exe `2e51e25`, thư mục mới (seed theo hôm nay): seed không có lịch Chưa ghi kết quả → nhập bù 02/11 10:00 (6b) → Xóa (6g: "· Chưa ghi kết quả") → Thùng rác exe lượt 4 ghi "02/11/2026 10:00 · **Dự kiến**", tên nút "… · Dự kiến của KH …" (lỗi NT-TR-07 của exe cũ) → Xuất backup → exe ghim nhập (10a "schema v13 (bằng app)") → Thùng rác: "· **Chưa ghi kết quả**" ở dòng, tên nút, hộp 11b → Khôi phục → Lịch hẹn tháng 11/2026 "450 lịch · 43 đã gặp · 1 chưa ghi kết quả" (trước khôi phục 449 · 43) → Xuất → nhập lại file của chính nó: nhận → exe ghim mở tại chỗ thư mục exe lượt 4: Thùng rác "Chưa ghi kết quả" (`logs\kf5-K2.log`) | Đúng ở mọi bước; dữ liệu do exe lượt 4 ghi đọc đúng ở exe ghim cả hai đường (nhập, mở tại chỗ) | — |
| F3 | **Lưu lỗi × Nhập backup × đóng app (B / D / E):** exe ghim: `Project2C-data` cấm `(WD)` giữa phiên → + Team → dải lưu lỗi + Thử lại (vẫn cấm: dải ở lại) → Nhập backup dữ liệu tải → "Backup rồi thay dữ liệu" → câu D7 "Chưa nhập: lần lưu gần nhất bị lỗi … Bấm "Thử lại" ở dải cảnh báo đầu màn …" (`backups\` không đổi) → gỡ cấm → Thử lại → "Đã lưu 01:44" → Nhập backup dữ liệu tải rồi **X ngay** → thoát 0 sau 595 ms, `backups` 0 → 1 → mở lại: "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ", team mới không còn → tạo team "Team K3 trước lần nhập 2" (đã lưu) → Nhập backup, X, X lần hai (tiến trình đã thoát trước lần hai) → mở lại: team đó không còn (lần nhập đã chạy) (`logs\kf5-K3.log`) | Đóng app chờ lần thay và lần lưu của nó (S2-6, K13) cả khi X ngay sau khi bấm; số file backup lần hai không tăng vì Rust dùng lại bản trùng byte (`storage.rs:246-249`), không phải bỏ bước backup. Không còn ACL DENY | — |
| F4 | **Ghi chú KYC dài → AI trích xuất (Mock) → xác nhận → phân tích → xóa KH → Thùng rác → khôi phục (C / D / E):** bản web neo 15/09/2026 (`F\mirror\e2e\zz-k4-chain.spec.ts`): KH mới; ghi chú 35 237 ký tự mở bằng "KH độc thân." và kết bằng "KH đã kết hôn, có 2 con." → AI trích xuất 64 ms (tính cả vòng Playwright) → đề xuất "Đã kết hôn", "Số con: 2" (giá trị cuối về KH, K42) → Xác nhận cả hai → + "Nghề nghiệp: Bác sĩ" → Phân tích (Mock) CURRENT `kyc v4 · discovery@5` → 5c → Xóa KH… → 5f ("Ghi chú KYC 3") → Thùng rác "khôi phục kèm 0 lịch hẹn · 0 HĐ · 3 ghi chú KYC" → 11b "… 3 ghi chú KYC · 1 phân tích AI" → Khôi phục → hồ sơ: ba dữ kiện, phân tích CURRENT, ghi chú nguyên chữ → AI trích xuất lại: "AI không tìm thấy dữ kiện mới trong ghi chú này." (`logs\k4-chain.log`) | Đúng; hai đề xuất đều trùng giá trị đang có thì hiện 3e (mockup `ai.html:762-764`, spec §8 mục 4), không phải dòng "đã ẩn" | — |
| F5 | **Nhập bù → Báo cáo / Excel → xóa → Thùng rác → khôi phục → Báo cáo / Excel / Tổng quan (A / E):** bản web neo 15/09/2026 (`zz-k5-chain.spec.ts`): lịch 10/09 10:00 nhập bù → Báo cáo Tổng hợp "Chưa ghi kết quả" 0 → 1, Tổng 471 → 472; Excel sheet "Tổng hợp" dòng 4 cột 4 = 1; Tổng quan "Chưa ghi kết quả 1"; Lịch hẹn "472 lịch · 177 đã gặp · 1 chưa ghi kết quả" → Xóa → 0 / 471 → Thùng rác "10/09/2026 10:00 · Chưa ghi kết quả", tên nút và 11b cùng chữ → Khôi phục → Báo cáo, Excel, Tổng quan, Lịch hẹn về đúng như sau khi nhập bù (`logs\k5-chain.log`) | Một nghĩa "Chưa ghi kết quả" ở năm nơi (màn, Excel, Thùng rác, hộp, Tổng quan) qua xóa / khôi phục | — |
| F6 | **Bàn giao KH có cả lịch Chưa ghi kết quả và lịch Dự kiến (A / D / E, K19):** bản web neo (`zz-k6-chain.spec.ts`): KH Đặng Bảo Dũng (RE Huỳnh Kim Hùng) + nhập bù 10/09 + lịch 20/09 → 5c đổi RE sang Bùi Kim Hùng: "Khi lưu: 2 lịch hẹn Dự kiến chuyển sang RE mới." → lịch 10/09 giữ RE cũ ("Chưa ghi kết quả"), 20/09 sang RE mới ("Dự kiến") → Báo cáo Theo RE: "Chưa ghi kết quả" 1 ở RE cũ, 0 ở RE mới → xóa lịch 10/09 → Thùng rác "RE Huỳnh Kim Hùng" → khôi phục: vẫn RE cũ, Báo cáo như trước (`logs\k6-chain.log`) | Đúng spec Phase 3 §4 (`plannedOff`: `SCHEDULED`, ngày từ hôm nay): nhãn "Dự kiến" của câu 5c khớp nghĩa (lịch đã qua không tính) | — |
| F7 | **Probe hiệu năng `2e51e25` ↔ ghim trên cùng exe ghim + dữ liệu tải** (gỡ T-345…T-347 trên exe; `F\perf-run.mjs`) | Bản cũ đỏ ở `select-day-month` sau 72 s; bản ghim xanh 2,8 phút | — |
| F8 | **Bộ chụp ảnh hướng dẫn với từng nửa của `style`** (`F\guide-mut.mjs`, G1–G5) | Gỡ mỗi nửa làm đỏ đúng một ca khác nhau ("06 AI" top / "04, 05" foot) | — |
| F9 | **Dữ liệu tải `2e51e25` ↔ `37a80b6` theo bảng / cột** (plan §L5.4; `F\load-diff.mjs`, file `2e51e25` của probe lượt 4) | 12 bảng trùng từng dòng trừ `ai_analyses.prompt_version` 103 / 103 (`discovery@4` → `@5` ×58, `analysis@4` → `@5` ×45): đúng K43 (#913). Giải thích đủ `tables` `ad82051b…` → `e256e4f1…` | — |
| F10 | **`notes-for --files` với 18 đích glob** trên sổ tự dựng (`F\p-notes.mjs`) | Mục 2.1 dòng DR6-156 | CLR5-F1 |
| F11 | **Ranh giới `test-support` của `packages/ai`: 7 kịch bản × 6 cấu hình** (`F\dc-probe.mjs`) | Mục 2.2 dòng T-336, T-339; phần miễn rộng hơn chữ "may use vitest" (P7), có chủ ý như file test | — |
| F12 | **`size-report` trên `dist` thật + file lạ** (`.sqlite`, `.map`, `.PNG`, `.json`, `.webmanifest`, `.mp4`, `.txt`, `.db`, `-journal`; `F\p-size.mjs`) | Chỉ asset của bản dựng được đếm | — |
| F13 | **`waitFor` với lần đọc lỗi xen lần đọc tốt; `titleState` với số / chữ dính trước; `reviewedPr` với yêu cầu kẹp giữa hai khối `<system-reminder>`** (bản ghim ↔ bản đột biến sống, `F\p-survivors.mjs`, `F\p-hint.mjs`) | Bản ghim đúng ở mọi ca; ba đột biến đổi kết quả mà không test nào đỏ | CLR5-F2 |
| F14 | **Đếm lại số liệu tài liệu G7:** bảng PR vượt ngưỡng #859…#974 (`F\pr-range.mjs`), bảng probe G7 ↔ `perf-g7.json`, cột Đạt / Lỗi L2 / L3 của 243 dòng NT | Trùng ở cả ba | — |

## 5. Phát hiện mới

Gói F có **2** phát hiện mới (cả hai Nit, trục T, CONFIRMED). Phát hiện của A–E không ghi lại ở đây (dẫn ID ở mục 2, 6, 7).

### CLR5-F1 — `globMeetsFolder` (DR6-156): không ca nào giữ điều kiện "glob còn đoạn dưới thư mục"; bỏ nó thì ghi chú thư mục hiện thừa với đích như `e2e/*` mà cả bộ vẫn xanh

```
ID: CLR5-F1
Mức: Nit
Trục: T
Vị trí: tools/notes-core.mjs:207 (`return parts.length > names.length;` của globMeetsFolder, :199-208); ca gần nhất tools/notes-core.test.mjs:271-289 ("reads a glob against a folder note one folder at a time (DR6-156)") (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-156 / T-327 · mới do đợt sửa sau lượt 4 (PR #926)
Kịch bản: F10
```

- **Mô tả:** phần sửa DR6-156 so glob với thư mục theo từng đoạn và chỉ cho qua khi glob còn đoạn bên dưới thư mục (`parts.length > names.length`). Các ca của PR đều thoát vòng trước dòng đó (đích ngắn hơn thư mục như `packages/*` thoát ở `part === undefined`), nên không ca nào có đích glob kết thúc đúng ở độ sâu của thư mục.
- **Tái hiện / bằng chứng:** `node F\mut5.mjs R156b` (dòng đó → `return true`, qua hook `load`, repo không đổi): `R156b | … | SURVIVED (whole suite) — Tests 4387 passed (4387)` (`F\mut5.log`). `node F\p-survivors.mjs` (bản ghim ↔ bản đột biến, sổ có ghi chú `e2e/perf/` và `packages/ai/src/`): `R156b e2e/*: pinned (none) | mutant e2e/perf/`; `packages/*/src: pinned (none) | mutant packages/ai/src/`; `packages/a*/src: … mutant packages/ai/src/`; `e2e/perf*: … mutant e2e/perf/` (`F\p-survivors.log`).
- **Ảnh hưởng:** chỉ công cụ phát triển (`notes-for`, mục "Ghi chú OPEN liên quan" của PR). Code ghim đúng; một lần sửa sau làm hỏng điều kiện này thì `notes-for` liệt kê thêm ghi chú thư mục ở mục "area" (thừa, không sót) mà CI không đỏ.
- **Đề xuất:** thêm vào ca `:271` hai đích không thấy ghi chú `packages/ai/src/`: `packages/*/src` và `packages/a*/src` (glob dừng đúng ở thư mục); ≈ 2 dòng test, 0 dòng SP.
- **Mức:** Nit, như DR6-155 ở tổng hợp lượt 4 (test hở của công cụ phát triển, không chạm sản phẩm). Thước §4.3 xếp "test hở" vào Low; A–E lượt 5 chấm test hở của sản phẩm là Low — để phiên tổng hợp thống nhất.

### CLR5-F2 — Test hở của công cụ pipeline (T-335, T-338): "năm lần đọc lỗi **liên tiếp**" của `waitFor`, lookbehind của `titleRegExp` và khớp không tham lam của khối app trong gợi ý review không ca nào giữ

```
ID: CLR5-F2
Mức: Nit
Trục: T
Vị trí: tools/auto-wait-core.mjs:231 (`failures = 0;` trong waitFor, :223-252), :199 (`before` của titleRegExp); tools/review-hint-core.mjs:19 (`[\s\S]*?` của APP_BLOCK); ca gần nhất tools/auto-wait-core.test.mjs:465-477 ("retries a failed read and stops after five in a row"), :357 ("does not take a longer number for the PR asked for"), tools/review-hint-core.test.mjs:78 ("still reads the review brief and the Owner around those blocks") (37a80b6)
Tình trạng: CONFIRMED
Liên quan: T-335 (#942 → PR #944), T-338 (#952 → PR #954) · mới do đợt sửa sau lượt 4 (PR #944, #954)
Kịch bản: F13
```

- **Mô tả:** ba nhánh của code pipeline mới không test nào giữ:
  - (a) `waitFor` đặt lại số lần đọc lỗi khi có một lần đọc tốt, để chỉ dừng sau `MAX_FAILURES` lần lỗi **liên tiếp** (chú thích `auto-wait-core.mjs:219` và `auto-wait.mjs:19`). Ca `:465` có hai lỗi rồi xanh, và năm lỗi liền nhau; không ca nào xen lần đọc tốt giữa các lần lỗi.
  - (b) `titleRegExp` chặn chữ / số dính cả hai phía; ca `:357` chỉ thử phía sau ("PR 939" ↔ "PR 9390").
  - (c) `APP_BLOCK` khớp không tham lam tới thẻ đóng gần nhất; các ca chỉ có một khối mỗi loại.
- **Tái hiện / bằng chứng:** `node F\mut5.mjs` → `W15 | waitFor: a good read does not reset the failures in a row | SURVIVED (whole suite) — Tests 4387 passed (4387)`, `W13b | title: glued after a longer word counts (no lookbehind) | SURVIVED (whole suite)`, `H6 | a block runs greedily to the last closing tag | SURVIVED (whole suite)` (`F\mut5.log`). Hệ quả (`F\p-survivors.log`, `F\p-hint.log`): với chuỗi đọc lỗi / chờ xen nhau 5 lần (gh chập chờn) bản ghim **xanh ở lần đọc 11** (`code 0: CI green @abc1234`), bản W15 **dừng ở lần đọc 9** với `code 3: 5 reads failed in a row` (sai chữ); `titleState(["…PR 1939…"], "939")` bản ghim "no … PR … yet", W13b `PR #1939 (MERGED)`; title "…rerecord the notes of the PR 1040 review…" với chữ skill dùng: W13b nhận nhầm `PR #1041`; lời Owner "review PR #950 giúp anh" kẹp giữa hai khối `<system-reminder>`: bản ghim `950`, H6 `null`.
- **Ảnh hưởng:** chỉ công cụ phát triển. Code ghim đúng ở mọi ca. Một lần sửa sau làm hỏng (a) thì một lần chờ 45–60 phút ở mạng chập chờn dừng sớm với mã 3 ("look at it") và chữ sai, phiên điều phối dừng hàng đợi; hỏng (c) thì gợi ý review không hiện khi Owner gõ giữa hai khối của app. (b) ít gặp với chữ skill dùng (bắt đầu bằng "record").
- **Đề xuất:** thêm ba ca: `reads(boom, wait, boom, wait, boom, wait, boom, wait, boom, wait, green)` → `green`; `titleState` với text "939" và title chứa "1939" → chưa có; `reviewedPr(\`${linked}\nreview PR #950 giúp anh\n${linked}\`)` → 950. ≈ 10 dòng test, 0 dòng SP.
- **Mức:** Nit, như CLR5-F1.

## 6. Bloat và Hiệu năng (toàn codebase)

### 6.1 Bloat

Số của A–E lấy từ mục 6.1 của `claude\A.md`…`E.md` lượt 5 (cùng SHA, cùng máy), không đo lại; gói F đo phần của mình và các phép toàn repo. Không cài công cụ mới.

| Đã chạy / đo | Trên | Kết quả (so lượt 4, Home PC) | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | `tsconfig.base.json:12-13` bật sẵn hai cờ → `pnpm typecheck` (gồm `tsc -p e2e`) xanh ở `baseline.md`; A, C, E chạy tạm lệnh cho `domain`, `db`, `ai`, app: exit 0; `tools/*.mjs` qua ESLint `no-unused-vars` trong `pnpm verify` | 0 biến / tham số thừa | — |
| Export không có nơi dùng ngoài file | `F\exports-f.mjs` (= lượt 1–4) trên `tools/*.mjs`, helper e2e, hook `.claude`, `ui/scripts` → `logs\exports-f.log`; A–E: scanner từng gói | F: **61 dòng** (lượt 4: 62), đều là seam test của `*-core.mjs`, helper e2e chỉ spec dùng hay kiểu / hằng dùng trong file (10 "nowhere": `GUIDE`, `localPath`, `Summary`, `OpResult`, `BODY_TARGET`, `BODY_MAX`, `DEFAULT_DIST`, `DEFAULT_EXE`…); export của `auto-wait-core.mjs` và `review-hint-core.mjs` đều có nơi dùng sản phẩm (`auto-wait.mjs`, hook `review-pr-hint.mjs`). A–E: không export chết mới; `PURGE_REMINDER` đã hết (DR6-152) | — |
| Code lặp, thân hàm trùng nguyên văn ≥ 25 token | `F\dup-scan.mjs 25` → `logs\dup-scan-25.log` | **216 file, 1 128 thân hàm, 0 nhóm** (lượt 4: 212 / 1 090 / 0) | — |
| Code lặp theo cấu trúc ≥ 35 token | `F\dup-scan-struct.mjs 35` → `logs\dup-scan-struct-35.log` | **6 nhóm**, đúng 6 nhóm của lượt 4 (`restore<X>` ×4, `list<X>` ×3, `remove` của ba hộp xóa ×3, `analysesOf` / `notesOf` / `factsOf` ×3, `remove` nhân sự / team ×2, `toggle` ×2); không nhóm mới. Vòng gọi listener nay một nơi (`listeners.ts`, B); `unlessAfter` một hàm (C) | — |
| Cấu thành bundle theo package | `F\bundle\split-build.mjs` (= script lượt 2–4; `vite build` của worktree ghim ra `F\bundle\out`, một chunk mỗi package / dependency) → `bundle\split-build.log` | Tổng JS + CSS **2 371 007 B** (lượt 4: 2 362 976, **+8 031**; gzip 707 484). Tăng: **`pkg-ai` 42 494 → 48 101 (+5 607)** — Mock trích xuất (K42) và G5 `@5` (K43), khớp C (+5 712 bằng esbuild); `app-routes` +960, `app-data-shell` +548 (`listeners.ts`, `flush`), `index.css` +543, `app-i18n` +29, `pkg-db` +28. **Mọi dependency trùng từng byte lượt 4** (exceljs 931 625, ECharts 512 882, `react-dom` 207 089, `drizzle-orm` 63 688, `sql.js` 39 781, `tanstack` 35 611, `zod` 27 220, `tauri-api` 15 114) | — |
| Bản dựng thật (`baseline.md`, `apps/desktop/dist/index.html` của cổng) | `pnpm build:web` trong `build:exe` | `index.js` 892 184 B (+7 486), `index.css` 30 295 B (+543), JS / CSS 2 366 456 B (+8 029); "Tệp khác" 19 file / 1 022 121 B (= lượt 4); `chart.js` vẫn `modulepreload`, `exceljs` nạp lười (như lượt 1–4) | — |
| Exe | `baseline.md`, B | 5 649 408 B = lượt 4 = G7 (0 B); không dependency / quyền / icon mới (B) | — |
| Dependency | `git diff --stat 2e51e25 37a80b6 -- package.json pnpm-lock.yaml apps/*/package.json packages/*/package.json Cargo.toml Cargo.lock` (A–E) | rỗng | — |
| Mã lỗi ↔ câu i18n | `F\p9-error-keys.mjs` (= lượt 3–4) → `logs\p9-error-keys.log` | `DB_ERROR_CODES` 59, `AI_ERROR_CODES` 10; thiếu câu đúng 5 mã như lượt 1–4 (`SEED_DATABASE_NOT_EMPTY`, `SCHEMA_TOO_NEW`, `BACKUP_INVALID`, `BACKUP_TOO_LARGE`, `AI_BAD_REQUEST`), mỗi mã có đường hiện riêng; khóa i18n 1 194, 0 không dùng (D) | — |
| `pnpm lint:deps`, `codemap:check`, coverage | `baseline.md` | 0 vi phạm (354 module, 1 582 dependency; lượt 4: 341 / 1 435); codemap khớp; coverage 99,21 / 97,4 / 99,13 / 99,38 % (lượt 4: 99,18 / 97,27 / 99,17 / 99,35) | — |
| Cỡ dòng (`baseline.md`) | 6 gói | SP 39 077 (+1 311), test 55 828 (+2 917); diff sửa `2e51e25..37a80b6` ngoài tài liệu 93 file, +5 761 / −1 533; phần F: SP +460 / −14 (7 file, chủ yếu `tools/auto-wait*` 388 dòng), test +1 597 / −30 | — |

Không có phát hiện B. Đề xuất refactor bloat: không có mục mới. Công cụ nên có (G4, chỉ đề xuất, như lượt 4): visualizer bundle, `cargo-bloat`.

### 6.2 Hiệu năng

**Máy, lúc đo:** Home PC `DESKTOP-KDURKJP`, Node v24.20.0; 05/11 01:46–02:10 (+07:00). Chạy song song: Codex đợt 1 (2 tiến trình `codex`), app desktop Claude; CPU 6–7 % ngay trước các lần đo exe / Node (`Win32_Processor.LoadPercentage`). Không `pnpm e2e` cổng 4173, không exe nào khác lúc đo exe (`Get-Process project2c` = 0). Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms.

**A. Exe ghim, probe `e2e/perf` của chính gói F** (`F\perf-run.mjs perf-pinned`, bản chép `F\exe\perf-pinned\`, dữ liệu tải nhập qua UI, cửa sổ ở trên cùng, `PERF_RUNS` 5, `PERF_BASE` = mốc sau #656; bảng đủ ở `logs\perf-pinned-probe.log`, JSON `F\perf\perf-f.json`). So với `baseline.md` (bước chuẩn bị, cùng exe, cùng máy):

| Thao tác | Gói F | `baseline.md` lượt 5 | Mốc sau #656 | G7 | Lượt 4 | Ngưỡng | |
|---|---:|---:|---:|---:|---:|---|---|
| `backup.read` / `backup.import` / `backup.export` | 872 / 51 / 445 ms | 983 / 50 / 438 | 835 / 43 / 438 | 975 / 44 / 435 | 977 / 47 / 436 | ≤ 2 000 / 500 / 1 000 | ✅ |
| `db.save` | 153 ms | 150 | 151 | 148 | 149 | ≤ 400 | ✅ |
| `reload.*` (6 màn) | 282–396 ms | 285–407 | 283–398 | 280–395 | 279–405 | < 500 | ✅ |
| Lịch hẹn (đổi kỳ, sắp, chọn) | 5–18 ms | 5–17 | 6–17 | 5–18 | 7–17 | < 200 | ✅ |
| `customers.view-table` / `sort-name` | 19 / 23 ms | 19 / 24 | 20 / 23 | 20 / 23 | 19 / 24 | < 200 | ✅ |
| `customer.open-ai` / `ai-history` | 20 / 2 ms | 20 / 2 | 19 / 2 | 20 / 2 | 20 / 2 | < 200 | ✅ |
| Tổng quan / Báo cáo (lọc, Theo RE) | 9–18 ms | 10–17 | 10–17 | 10–17 | 10–17 | < 200 | ✅ |
| `trash.open` / `trash.kind-appointments` | 33 / 8 ms | 33 / 8 | 34 / 6 | 33 / 9 | 32 / 6 | < 200 | ✅ |
| `reports.export-excel` | 27 ms | 21 | 20 | 25 | 29 | ≤ 500 | ✅ (+7 ms so mốc: dưới 10 ms) |
| `appointments.next-month` / `next-year` | 111 / 110 ms | 111 / 108 | 101 / 107 | 112 / 109 | 108 / 113 | ≤ 300; Năm − Tháng ≤ 50 | ✅ |
| JS heap | 17,1 MB | 16,7 | 16,5 | 16,7 | 16,6 | ≤ 21 MB | ✅ (+0,6 MB) |
| `app.open-data` | (3 147 ms — không dùng) | 330 | 387 | 320 | 370 | ≤ 600 | xem dưới |

- **`app.open-data` của gói F không là số mở lại:** `perf-run.mjs` mở exe ở thư mục mới (sinh seed), nhập dữ liệu tải rồi mới nối probe, nên mốc `p2c:data-open` probe đọc là của lần mở đầu có sinh seed (README: "chỉ có khi probe nối vào exe vừa mở, chưa tải lại"). Số mở lại đúng cách ở `baseline.md` (330 ms; mở lại LCP 710 ms ≤ 1 s). Không phải phát hiện.
- Mọi dòng khác trong ngưỡng `phase-6.md` và không xấu hơn mốc sau #656, G7 hay lượt 4 theo luật nhiễu; gói F lặp lại kết quả của bước chuẩn bị trong biên nhiễu.

**B. Node, gói F** (DR6-136; `F\p-byname.mjs`): sắp 10 255 lịch hẹn theo KH rồi giờ, cặp xen kẽ trong một tiến trình: collator trần 8,64 ms · `2e51e25` 65,08 ms · ghim **12,24 ms** (−52,8 ms, −81 %; 1,42× trần) — ✅ (mốc trước #828: 9,4 ms).

**C. Chuỗi trên exe** (mục 4): Nhập backup dữ liệu tải rồi X ngay: exe thoát 495–595 ms sau lệnh đóng (gồm lúc PowerShell gửi `WM_CLOSE`), sau khi lần thay và lần lưu xong (F3). AI trích xuất trên ghi chú 35 237 ký tự (bản web): 64 ms từ cú bấm tới câu báo, tính cả vòng Playwright (F4); C đo trong trang 51 ms ở 36 003 ký tự.

**D. Gộp số của cả lượt 5 (Claude, Home PC, cùng SHA):**

| Vùng | Số chính lượt 5 | So mốc cùng máy / ngưỡng | ID |
|---|---|---|---|
| Exe, probe `e2e/perf` (`baseline.md` + gói F) | mọi thao tác màn ≤ 33 ms; `backup.read` 872–983, `backup.import` 50–51, `backup.export` 438–445, `db.save` 150–153, `reports.export-excel` 21–27, `next-month` / `next-year` 111 / 108–110 ms; JS heap 16,7–17,1 MB; mở lần đầu LCP 3 535 ms; mở lại LCP 710 ms; Dọn sạch bấm → 11j 128,0 ms | **không dòng nào ⚠️** so mốc sau #656, G7, lượt 4; mọi ngưỡng `phase-6.md` | — |
| Lần lưu DB đầu của lần mở đầu (`p2c:db-save`) | `baseline.md` 150 ms (+31 ms so mốc) | B: exe ghim ↔ exe lượt 4 xen kẽ 185,1 ↔ 188,5 ms → chênh là máy / thư mục lúc đo, không do code | — |
| Gói A (Node, lệnh) | `importBackup` 909,6 (+47, +5 %), `listTrash` 1 313 dòng 157,4 (+13, +9 %), `purgeTrash` 97–137 ms; `byName` 1 481 tên 1,41 ms (−82 %) | dưới luật nhiễu; ≤ ngưỡng | — |
| Gói B (Rust / lưu) | `save` 10,5 ms, `open` 4,5 ms, backup 7–51 ms, `openAppData` + `flush` 105 ms | như lượt 4 | — |
| Gói C (AI) | phần AI của hồ sơ 0,42 ms; **Mock trích xuất cả bộ 3 551 ghi chú 103,5 ms (×1,66 so `2e51e25`); lần gọi đầu 28,5 ms (×3,1)**; bấm AI trích xuất trên màn 53 ms lần đầu (+22 ms) | dưới mọi ngưỡng (< 200 ms); quá luật nhiễu | **CLR5-C2** (Low) |
| Gói D (bản web) | mọi thao tác ≤ 52 ms; đọc file → 10c 1 208–1 320 ms (+17 %) | dưới luật nhiễu | — |
| Gói E (bản web) | Lịch hẹn sắp theo KH 25,7 ms (lượt 4 60,4); Thùng rác 1 313 dòng 419 ms (DR6-84, Owner đã chữa bằng Dọn sạch); Dọn sạch 99,7 / 134,8 ms | ≤ ngưỡng ngoài DR6-84 | — |
| Gói F | bảng A, B, C trên | không thao tác nào xấu hơn theo luật nhiễu | — |

**Không có phát hiện P ở gói F.** Phát hiện P của cả lượt 5 (Claude): chỉ **CLR5-C2** (Low). Không thao tác chính nào vượt ngưỡng `phase-6.md` trên dữ liệu tải.

## 7. Bảng đếm mức × trục

### Gói F

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | | | | | | | | | 0 |
| Nit | | | | | | | | | F1, F2 | | 2 |
| **Tổng** | | | | | | | | | 2 | | **2** |

2 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới. Cả hai "mới do đợt sửa sau lượt 4" (#926; #944, #954). Đột biến của gói F: **40 `tools/`** (35 bị giết; sống: R156b, W13b, W15, H6 → F1, F2; H2 gần tương đương), **5 bộ chụp ảnh qua bản chép** (G1, G3, G4 đỏ; G2 = kiểm của `2e51e25` và G5 xanh như dự kiến), **6 cấu hình dependency-cruiser × 7 kịch bản**, **1 probe hiệu năng `2e51e25`** (đỏ ở `select-day-month`).

### Cả sáu báo cáo lượt 5 của Claude (A–F)

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | | 0 |
| High | | | | | | | | | | | 0 |
| Medium | | | | | | | | | | | 0 |
| Low | | D3, E1, E2 | | | | | C2 | | A2, B1, C1, D2, E4 | | **9** |
| Nit | | E3 | A3, D4 | | | | | | F1, F2 | A1, D1 | **7** |
| **Tổng** | 0 | 4 | 2 | 0 | 0 | 0 | 1 | 0 | 7 | 2 | **16** |

- Đếm theo trục chính (B1 thêm S; D1 thêm T; D2 thêm A; D3, E1, E3 thêm A).
- **16 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới.**
- "Mới do đợt sửa sau lượt 4" (theo trường Liên quan của từng báo cáo): A2, C1, C2, D2, E4, F1, F2 (7). "Có từ trước, lượt 1–4 bỏ sót hay Issue thu hẹp": A1, A3, B1, D1, D3, D4, E1, E2, E3 (9).
- Bảng R gộp: **R1 24 / 25 ĐÃ SỬA + 1 SỬA MỘT PHẦN** (DR6-145 → D1); **R2 28 / 28 ĐÃ SỬA**; **0 CHƯA SỬA, 0 HỒI QUY** (lượt 4: 0; lượt 3: 0; lượt 2: 3).
- So lượt 4 (Claude): 18 → 16 phát hiện (11 Low + 7 Nit → 9 Low + 7 Nit), trên diff bằng khoảng 1/3.

## 8. Đã xét, không thấy (gói F, theo trục)

- **R:** 5 dòng R1 và 18 dòng R2 của gói F (mục 2.1, 2.2), mỗi dòng có tái hiện / đếm lại và gỡ phần sửa (đột biến `tools/`, bộ chụp ảnh qua bản chép, cấu hình dependency-cruiser, probe `2e51e25` trên exe), trừ phần chỉ tài liệu / ảnh (đối chiếu số / ảnh). Không HỒI QUY: đối chứng `tools/` 388 / 388, bộ chụp ảnh bản ghim 13 / 13 và 28 / 28 ảnh trùng byte, probe ghim xanh, dữ liệu tải chỉ khác `prompt_version` (F9).
- **E:** đóng app ngay sau khi bấm Nhập backup, và X lần hai (F3); lần đọc `gh` lỗi xen lần đọc tốt (F13); `--since` theo `closedAt` của GitHub (không lệch đồng hồ máy); glob kết thúc bằng `/` (chỉ gặp thư mục đúng độ sâu — không Issue nào viết đích kiểu này); asset loại mới / viết hoa trong `dist` (F12); probe chạy ở tháng sau mốc dữ liệu tải (F7); seed không có lịch Chưa ghi kết quả (F2, F5). `ciState` khi mọi check là SKIPPED / NEUTRAL thì `checkCounts` ra 0 và nhánh "no checks yet" chờ tới hết giờ — Verify và e2e luôn chạy ở PR code, nên không gặp; không ghi.
- **C:** nhãn "Dự kiến" / "Chưa ghi kết quả" theo nghĩa thường ở Thùng rác, tên nút, hộp 11b, Báo cáo, Excel, Tổng quan, Lịch hẹn và câu 5c (F2, F5, F6); câu ngoại lệ NT-EX-08 / 09 khớp exe (F1); 3e khi mọi đề xuất trùng (F4); bảng PR vượt ngưỡng, bảng G7, đếm L2 / L3 (F14); hướng dẫn: ảnh trùng code ghim (T-343).
- **D:** nâng cấp exe lượt 3 / lượt 4 → exe ghim cả hai đường (nhập, mở tại chỗ) (F1, F2); nhập lại bản xuất của chính exe ghim (F2); lưu lỗi rồi thay dữ liệu và đóng app (F3); xóa / khôi phục KH có phân tích AI và ghi chú 35 237 ký tự (F4); bàn giao KH giữ lịch Chưa ghi kết quả ở RE cũ, qua xóa / khôi phục (F6). Không thấy mất / sai dữ liệu.
- **G:** không gọi dịch vụ AI, không đọc key; exe không bấm nút AI; Mock trên bản web (F4). G5 `@5`: gói C.
- **S:** mọi exe chặn mạng ngoài máy từ lần chạy đầu; Edge của Playwright chặn DNS ngoài 127.0.0.1 / localhost; không chạy `gh`; ACL `(WD)` chỉ đặt trên thư mục probe của chính phiên và đã gỡ (kiểm `icacls`: 0 dòng DENY ở 7 thư mục `F\exe\*\Project2C-data`). Ranh giới `test-support`: phần miễn cho mọi import, có chủ ý như file test (F11). CSP / quyền: gói B.
- **P:** mục 6.2.
- **B:** mục 6.1.
- **T:** mục 7 (đột biến); ngoài CLR5-F1, F2 không thấy test hở mới ở `tools/`, helper e2e, bộ chụp ảnh, cấu hình dependency-cruiser.
- **A:** gói F không có màn riêng; kiểm qua chuỗi: dải lưu lỗi `role="alert"` có "Thử lại", câu từ chối D7 của Nhập backup (F3); tên nút khôi phục đọc đúng trạng thái (F2, F5). Focus sau hộp 10b bị từ chối nằm ở nút "Dữ liệu" của menu là do probe đặt file thẳng vào `input` (không bấm "Chọn file…"), không phải đường của người dùng (E đã kiểm đường bấm thật: focus về "Chọn file…").

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r5\claude\F\`)

| File | Việc | Log / đầu ra | Dùng ở |
|---|---|---|---|
| `r4copy\` | 35 probe lượt 4 của Claude F chép theo tên đầy đủ (+ `browser.mjs` từ `r4\claude\F\r3copy\`) | — | nguồn |
| `mut5.mjs`, `mutant-config.mjs` | 40 đột biến `tools/` qua hook `load` của Vite | `mut5.log`, `mut5.stdout.txt`, `mut\<id>.out`, `mut\<id>__<file>` | DR6-155…157, T-333, T-335, T-338, CLR5-F1, F2 |
| `old-2e51e25\` | `tools/{size-report-core,notes-core,pr-core,session-core}.mjs` của `2e51e25`; `name-order.ts` của `2e51e25` và bản chép ghim | — | DR6-156, DR6-157, DR6-136 |
| `p-size.mjs` | `bundleReport` cũ ↔ mới trên `dist` thật + file lạ trong bộ nhớ | `p-size.log` | DR6-157 |
| `p-notes.mjs` | chuỗi `notes-for --files`, 18 đích | `p-notes.log` | DR6-156, T-333 |
| `mutcopy\tools\`, `p-survivors.mjs`, `p-hint.mjs` | bản đột biến sống ↔ bản ghim | `p-survivors.log`, `p-hint.log` | CLR5-F1, F2 |
| `build-dist.mjs`, `serve-dist.mjs`, `dist-anchor\` | bản dựng web neo 15/09/2026 ngoài repo, phục vụ 127.0.0.1:4741 (đã tắt) | — | F4–F6, T-343, DR6-155 |
| `mirror\` (`e2e`, `docs\user-guide`, junction), `pw-guide.config.mjs`, `guide-mut.mjs` | bộ chụp ảnh hướng dẫn trên bản chép; đột biến G1–G5 | `guide-g0.log`, `guide-mut.log`, `guide-mut.stdout.txt`, `pw-guide\` | DR6-155 (b), T-343 |
| `mirror\e2e\zz-k4-chain.spec.ts`, `zz-k5-chain.spec.ts`, `zz-k6-chain.spec.ts`, `pw-f.config.mjs` | chuỗi F4, F5, F6 trên bản web (chỉ trong bản chép, không phải file repo) | `logs\k4-chain.log`, `logs\k5-chain.log`, `logs\k6-chain.log`, `pw-results\` | mục 4 |
| `exe-lib.mjs` (lượt 4, cổng 9831, `EXE_R3`, `EXE_R4`), `topmost.ps1`, `peek-db.mjs` | dựng / mở / đóng exe | — | F1–F3, F7 |
| `kf5-upgrade.mjs` | K1 (exe lượt 3 → ghim), K2 (exe lượt 4 → ghim qua Thùng rác) | `logs\kf5-K1.log`, `logs\kf5-K2.log`, `exe\k1-*`, `exe\k2-*` | CLR4-F2, F1, F2, T-350, T-352 |
| `kf5-save-import.mjs` | K3 (lưu lỗi × Nhập backup × đóng app) | `logs\kf5-K3.log`, `exe\k3-save-import\` | F3 |
| `mirror-old\` (probe `2e51e25`), `pw-perf.config.mjs`, `perf-run.mjs` | probe `e2e/perf` cũ ↔ ghim trên bản chép exe ghim, cổng 9832 | `logs\perf-old-probe.log`, `logs\perf-pinned-probe.log`, `perf\perf-f.json`, `pw-perf\`, `exe\perf-*` | T-345…T-347, 6.2 A |
| `load\load-2e51e25.p2cbackup`, `load-diff.mjs` | dữ liệu tải `2e51e25` (probe lượt 4) ↔ lượt 5 | `logs\load-diff.log` | F9 |
| `dc\`, `dc-probe.mjs` | dependency-cruiser trên bản chép `packages/ai` + `packages/domain` | `logs\dc-probe.log` | T-336, T-339, F11 |
| `pr-range.mjs` | đếm lại cỡ PR #859…#974 | `logs\pr-range-859-974.log` | T-342 |
| `exports-f.mjs`, `dup-scan.mjs`, `dup-scan-struct.mjs`, `p9-error-keys.mjs`, `hooks.mjs`, `ui-stub.mjs` | bloat (= lượt 1–4) | `logs\exports-f.log`, `logs\dup-scan-25.log`, `logs\dup-scan-struct-35.log`, `logs\p9-error-keys.log` | 6.1 |
| `bundle\split-build.mjs` | cấu thành bundle theo package | `bundle\split-build.log`, `bundle\out\` | 6.1 |
| `p-byname.mjs` | `byName` cũ ↔ mới ↔ trần | `logs\p-byname.log` | DR6-136, 6.2 B |
| `ae-section6.txt` | trích mục 6 của `claude\A.md`–`E.md` để gộp | — | 6.2 D |

Lệnh đếm L2 / L3 và đối chiếu bảng G7: `node -e` một dòng trên `docs/testing/nghiem-thu-v1.md` và `docs/metrics/phase-6.md` + `common\perf\perf-g7.json` (chỉ đọc; kết quả dán ở mục 2.2).

### 9.2 Đột biến

- **`tools/` (40, `F\mut5.mjs`, 05/11 01:27–01:38):** DR6-155: R155a KILLED. DR6-156: R156a, R156c KILLED, **R156b sống** (→ F1). T-333: T333a, T333b KILLED. DR6-157: R157a–d KILLED. `auto-wait-core` (T-335, T-338): W01–W12, W05b, W13, W14, W16–W22 KILLED, **W13b, W15 sống** (→ F2). `review-hint-core`: H1, H3, H4, H5 KILLED, **H6 sống** (→ F2), H2 sống, gần tương đương. Tổng 35 bị giết, 5 sống. Dòng cuối `mut5.log`: `repo git status --short after: ""`.
- **Bộ chụp ảnh (5, `F\guide-mut.mjs`, 01:30):** G1, G3, G4 đỏ; G2, G5 xanh (dự kiến). Mirror trả về byte của `e2e/guide/shots.guide.ts` và ảnh repo sau mỗi đột biến; `repo git status --short after: ""`.
- **dependency-cruiser (6 cấu hình × 7 kịch bản, `F\dc-probe.mjs`):** đọc ở mục 2.2 (T-336, T-339). File thử chỉ tạo trong `F\dc\packages\ai\src\` và xóa ngay sau mỗi kịch bản.
- **Probe hiệu năng `2e51e25`:** đỏ ở `appointments.select-day-month` (T-345).

### 9.3 Chạy ngoài repo, tác dụng phụ, ranh giới đọc

- **Repo:** không ghi file nào. Đột biến qua hook `load`; bộ chụp ảnh, chuỗi Playwright, probe hiệu năng, dependency-cruiser đều chạy trên bản chép trong `F\`. Hai junction của `F\dc` lúc đầu trỏ vào `packages/domain` và `packages/ai/node_modules` của repo; đã gỡ chính junction (không đụng đích) và thay bằng bản chép / junction mới; kiểm lại `packages/ai/node_modules/{@p2c,zod}` và `packages/domain` của repo còn nguyên, `git status --short` rỗng.
- **Exe:** 7 thư mục `F\exe\{k1-r3, k1-pinned-import, k2-r4, k2-pinned-import, k3-save-import, perf-old, perf-pinned}\`, mỗi thư mục hồ sơ WebView2 riêng. Năm lần chạy K2 đầu dừng vì lỗi của chính probe (seed không có lịch Chưa ghi kết quả; locator ô chọn KH; RE / Trigger của 6b; tìm dòng trong danh sách tháng 100 dòng mới nhất; thư mục `exports` chưa có) — tiến trình exe của probe đã dừng (`Stop-Process` theo đường dẫn trong `F\`), sửa probe, chạy lại từ đầu trên thư mục mới; chỉ dùng kết quả lần chạy cuối. K3 chạy ba lần (lần 1 lỗi gọi X lần hai khi tiến trình đã thoát; lần 2 thêm đếm backup; lần 3 thêm team phân biệt) — kết quả ở log là lần 3.
- **Máy chủ web tạm:** `serve-dist.mjs` của `F\dist-anchor` ở 127.0.0.1:4741, đã dừng (không cổng nào của phiên còn nghe).
- **Ngoài repo, đọc theo tên đầy đủ:** như mục 3. Không mở, không liệt kê, không tìm kiếm thư mục nào của `codex\`, `deepseek\`, `muse\`; không đọc báo cáo lượt 5 của bên khác.

### 9.4 Cuối phiên

- `git rev-parse HEAD` cuối phiên: `37a80b662861d308a110d1e2b0f65ad13b91fb51` (= SHA ghim). `git status --short` cuối phiên (`C:\workspace\Project-2C-review`): **rỗng**, như đầu phiên.
- Không còn `project2c.exe` nào (`Get-Process project2c` = 0); không cổng 4741 / 9831 / 9832 nào còn nghe; 0 dòng DENY trên mọi thư mục `F\exe\*\Project2C-data`.
- Giờ xong: **2026-11-05 02:14 (+07:00)**, Home PC (bắt đầu 01:19).

## 10. Kết luận cho v1.0 ở SHA `37a80b6` (Claude, tham khảo — kết luận thật ở phiên tổng hợp)

**CHƯA SẴN SÀNG ở chính `37a80b6`** — không vì mức (0 Critical / High / Medium), mà vì quyết định Owner K47 (`plan.md` §L5.11: "sau tổng hợp sửa hết mọi phát hiện, rồi G7"): còn **16 phát hiện mới** và **một dòng R1 SỬA MỘT PHẦN** (DR6-145 → CLR5-D1). SHA phát hành phải là SHA sau đợt sửa lượt 5.

Lý do:

1. **Mức: 0 Critical / High / Medium** trong sáu báo cáo lượt 5 của Claude. **9 Low + 7 Nit = 16**, cả 16 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới (mục 7). Không phát hiện nào làm mất / sai dữ liệu đã lưu hay chặn việc chính; nặng nhất là hiển thị (tên liền dài tràn: D3, E1; ô tìm: E2), test hở của phần sửa (A2, B1, C1, D2, E4) và hiệu năng dưới ngưỡng nhưng quá luật nhiễu (C2).
2. **Bảng R: R1 24 / 25 ĐÃ SỬA + 1 SỬA MỘT PHẦN, R2 28 / 28 ĐÃ SỬA, 0 CHƯA SỬA, 0 HỒI QUY** (mục 2.3, 2.4).
   - DR6-145 → CLR5-D1 (Nit): mô tả DR6-145 (b) ở tổng hợp lượt 4 gồm `←`, `–`, `…`, ngoặc kép cong và ký hiệu escape mà bộ chặn vẫn không bắt; Issue #901 thu hẹp phạm vi, không quyết định Owner nào chốt bỏ.
   - Ba đợt sau lượt 4 **không làm hỏng chỗ nào trước đó đúng**: refactor T-329 cho 61 703 / 61 703 dòng giống hệt (C), `listeners.ts` giữ hành vi với listener tự gỡ / thêm (B), `readsBackAsIs` 0 khác trên 200 020 chuỗi (A), thứ tự `byName` trùng `2e51e25` (A, F), dữ liệu tải chỉ khác `prompt_version` theo K43 (F9), 28 ảnh hướng dẫn trùng byte code ghim (F).
3. **Đường nâng cấp** (điều kiện G7 NT-EX-07…09): thư mục và bản xuất của exe lượt 4 mở / nhập được ở exe ghim, Thùng rác đọc đúng nhãn mới, tự xuất / nhập lại được (F2); thư mục của exe lượt 3 mở được, còn bản xuất có chữ chỉ gồm ký tự vô hình bị từ chối đúng như ghi chú NT-EX-08 / 09 (F1, KNOWN K1).
4. **Lưu và đóng app** (S2-6): đóng ngay sau Nhập backup chờ lần thay và lần lưu xong, cả với X lần hai; câu D7 có vế "Thử lại" (F3).
5. **Số đo:** probe exe (bước chuẩn bị và gói F) không dòng nào xấu hơn mốc sau #656, G7 hay lượt 4; mọi thao tác trong ngưỡng `phase-6.md`; mở lần đầu LCP 3 535 ms, mở lại 710 ms, Dọn sạch 128 ms ≤ 500 ms; `byName` về 1,4× collator trần. Phát hiện P duy nhất: CLR5-C2 (Low). Bundle +8 031 B (chủ yếu `pkg-ai`, K42 / K43), exe 0 B, dependency không đổi.
6. **Gợi ý thứ tự cho đợt sửa** (gom theo việc; tổng hợp quyết): hành vi thấy được: D3 + E1 (tên liền dài ở các màn còn lại), E2 (ô tìm), E3 (ô ngày / FYP của HĐ), C2 (hiệu năng Mock), A1 (tên nút lịch hẹn / HĐ của hai KH cùng tên), A3; bộ chặn ký hiệu: D1 (phần còn của DR6-145), D2; tài liệu: D4; test hở: A2, B1, C1, E4, F1, F2.
7. **Ngoài phạm vi review, vẫn là điều kiện G7** (HANDOFF bước kế tiếp): nghiệm thu của Owner trên exe phát hành (gồm NT-HD-01 còn `L3 ❌ #1019` — #1019 chỉ sửa hướng dẫn, chưa có lượt nghiệm thu sau đó — và các dòng mà đợt sửa lượt 5 đổi màn, K46), NT-EV-01 eval AI thật với `analysis@5` / `discovery@5` (tốn tiền, Owner), chụp lại ảnh hướng dẫn nếu đợt sửa đổi màn, cổng trên SHA phát hành, `phase-6.md` đủ mục, GitHub Release v1.0.0.

Nếu đợt sửa lượt 5 làm xong các mục trên (review phiên sạch như thường) mà không sinh hồi quy, phần Claude thấy không còn gì chặn v1.0.
