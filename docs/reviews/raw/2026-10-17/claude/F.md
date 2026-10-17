XONG — claude gói F lượt 2, 2026-10-17 17:50 (+07, giờ máy)

# Deep review Phase 1–6 lượt 2 — Claude — gói F (Xuyên gói, bloat / hiệu năng, công cụ)

## 1. Phiên

- Bên: Claude (reviewer, phiên sạch, chỉ đọc). Gói: **F — Xuyên gói, bloat / hiệu năng, công cụ** (`tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; luồng xuyên gói; toàn codebase cho bloat và hiệu năng). ID phát hiện `CL2-F<số>`.
- Worktree: `C:\workspace\Project-2C-review`, detached.
- SHA đầu phiên: `4217ed4cd3300af1d63aa61db9eb13902fe75f16` (khớp SHA ghim) — cả phiên 1 và phiên làm tiếp.
- `git status --short` đầu phiên: rỗng (cả hai phiên).
- Giờ bắt đầu: **phiên 1** 2026-10-17 16:20:23 +0700 (đồng hồ máy), bị cắt ≈ 17:09 (file cuối của nó: `p05-seed-dates-….jsonl` 17:09:20). **Phiên làm tiếp** 2026-10-17 17:12:55 +0700.
- Máy: Home PC `DESKTOP-KDURKJP` (`$env:COMPUTERNAME`, `Win32_ComputerSystem`), i9-12900K, Node v24.20.0; `CLAUDE_CONFIG_DIR` = `C:\Users\<user>\.claude-b` ở phiên 1, `C:\Users\<user>\.claude-c` ở phiên làm tiếp (máy có ba thư mục cấu hình Claude Code — CL2-F8).
- Công cụ / model / mức (cả hai phiên): Claude Code (desktop app, tab Code), model Claude Opus 5.5 (`claude-opus-5-5`), mức suy luận do Owner đặt cho phiên (không ghim; phiên không tự đọc được giá trị); không subagent, không `review-pr` / `code-review`, không `gh`.
- Bước 0 — phiên 1: chữ gói `F` hợp lệ; `claude\F.md` chưa có (`Test-Path` → False) → làm mới; `claude\A.md` … `E.md` có đủ, dòng đầu đều `XONG` (A 02:39, B 08:17, C 12:01, D 12:57, E 16:01 ngày 17/10). Phiên làm tiếp: `Test-Path` từng file theo tên đầy đủ; `claude\F.md` có, dòng đầu `ĐANG LÀM — claude gói F lượt 2, bắt đầu 2026-10-17 16:20` → làm tiếp; A–E vẫn `XONG`; in `Bắt đầu gói F lượt 2 (Xuyên gói, bloat / hiệu năng, công cụ) → claude\F.md — làm tiếp phiên trước`. Đã đọc hết `F.md` và thư mục `claude\F\` (liệt kê một cấp thư mục của chính mình, đọc mọi bản nháp `final-*.md`, `sec-*.md`, `r-merged.md` và các log).
- **Phiên 1 làm:** bảng R phần F (7 dòng), 81 đột biến `tools/`, K1–K3, K5, K7–K9, `p05` (K4, xong 17:09), bloat (6.1), CL2-F1…F6, bản nháp các mục. **Phiên làm tiếp làm:** chạy `p08-node-perf` (bảng hàm thuần; sửa 3 lỗi của chính probe trước khi có số), `p14-load-variants` (K10), `exe-trash` (K6, DR6-44 trên exe), `exe-readonly` + `exe-reload` (K11 → CL2-F7), chạy lại có log ca 8.3 của CL2-F4 (`p03b`) và ca 250 commit của CL2-F3 theo thứ tự tài liệu REST (`p04b`, sửa mô tả CL2-F3), kiểm lại mọi `path:dòng` của F1–F6 ở SHA ghim, mục Hiệu năng, bảng R gộp, kết luận; ghép báo cáo. Mọi phát hiện phiên 1 giữ nguyên (CL2-F3, CL2-F4 sửa phần mô tả / bằng chứng, ghi rõ ở mục 5).
- Song song: tiến trình nền của Codex app (`codex.exe` app-server và `node` của Codex, mở từ 01:58) trong suốt hai phiên, không thấy chạy exe / cổng nào. Không chạy `pnpm e2e` trên cổng 4173 (e2e duy nhất là `stats.spec.ts` bằng config riêng, không server — phiên 1). Trước mỗi lần đo trên exe đã kiểm: không `project2c.exe` nào khác, không cổng 4173 / 9222 / 9333 / 9338 / 9339 / 9348 nào nghe, CPU 0–10 %.
- Ranh giới đọc: chỉ mở file theo tên đầy đủ trong `deep-review-1-6-r2\common\`, `…-r2\claude\` (A–E và thư mục `F\` của mình; dùng lại `A\hooks.mjs`, `B\exe-lib.mjs`, `E\p18-make-n.mjs` làm mẫu) và probe lượt 1 của chính Claude máy này `deep-review-1-6\claude\F\` (chép sang `F\r1\`, chỉ các file tên đã biết từ báo cáo gốc). Không mở, không liệt kê thư mục `codex\` / `muse\` nào, không liệt kê / tìm kiếm trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`. Đếm transcript của máy (DR6-58) chỉ đếm tên file trong `%USERPROFILE%\.claude*\projects\C--workspace-Project-2C*`, không đọc nội dung; probe `retro.mjs` chạy trên home giả. Phiên làm tiếp đọc thêm một trang tài liệu công khai của GitHub (REST "Compare two commits", docs.github.com, qua WebFetch) cho CL2-F3; không gọi API GitHub, không `gh`.

## 2. Bảng R (phần gói F)

**Cách kiểm.** (1) Tái hiện lượt 1 chạy lại: probe lượt 1 của chính Claude Home PC (`deep-review-1-6\claude\F\`, chép sang `F\r1\`) và ca của báo cáo gốc laptop / Codex (`docs/reviews/raw/2026-10-15/`) dựng lại; mã `8855345` chạy từ bản `git archive` ở `F\old-8855345\` (`P2C_REPO`). (2) Gỡ phần sửa: `F\mut.mjs` + `F\mut-list.mjs` vá **một** file của worktree, chạy `vitest run tools --bail=1` (sống thì cả bộ vitest 2 898), trả nguyên byte, so sha256 với `git show HEAD:` trước / sau; với phần sửa nằm ở test (DR6-65) thì ghi bản `8855345` của file đè tạm rồi trả lại (`p11-tz.mjs`, `p13-stats-spec.mjs`, cùng kiểm sha256). Đột biến 16:32–16:48: **81 cái, 74 KILLED, 7 sống**, dòng cuối `mut.log`: `git status --short after: ""`. (3) Biến thể gần: mục 4.

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 1 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú (ID phát hiện) |
|---|---|---|---|---|
| 44 (phần F: đo) | #601 → #630 | **ĐÃ SỬA** | Node (`p08-node-perf.mjs`, dữ liệu tải lượt 2, cùng cách đo `p5-perf.mjs` lượt 1 Home PC): `listTrash` dữ liệu tải 20,95 ms / 113 dòng (lượt 1 Home PC 48,7 ms / 117 dòng); +100 KH xóa → 26,7 ms (lượt 1 211 ms, ×7,9), +400 → 52,1 ms (815 ms, ×15,6), +1 200 → 115,9 ms. Exe release (`exe-trash.mjs`, K6): `trash.open` 113 / 263 / 713 / 1 313 dòng = 74,8 / 126,5 / 264,9 / 450,8 ms khi gắn DevTools (cách probe đo; 113 dòng khớp `baseline.md` 73 ms) và 31,6 / 48,3 / 87,6 / 138,3 ms khi đã ngắt. Hành vi không đổi: gói A so JSON `listTrash` + đếm từng KH có / bỏ 3 chỉ mục 0009 (giống hệt), gói E so nội dung màn hai bản; gỡ sửa ở gói A (K 2). Lượt 1 không có số exe theo cỡ Thùng rác | CL2-E7 (gói E: thời gian vẫn tuyến tính — số exe ở K6: gắn DevTools vượt 200 ms từ ≈ 510 dòng, không gắn < 200 ms tới 1 313 dòng, ngoại suy ≈ 2 000); **CL2-F7** (Nit: probe đo `trash.open` khi gắn DevTools, phóng đại ×2,4–3,3) |
| 55 | #605 → #642 | **ĐÃ SỬA** | Tái hiện lượt 1 (`p01-eval-key.mjs` = `r1\p1-eval-key.mjs` ca A–C, `evalMain` với fetch giả, key giả): A trả lời chứa key → `LỖI AI_BAD_RESPONSE`, **0** lần key trong file kết quả + log (lượt 1: 25 lần, dòng `raw`); B HTTP 500 có key `%XX` → `bad header Bearer%20***` (lượt 1: 75 lần dạng `%XX`); C đối chứng `***`. Một lớp JSON / URL / JSON→URL / URL→JSON → `AI_BAD_RESPONSE`, 0 lần. Gỡ sửa: R55a (bỏ `reveals(content, key)`) → KILLED `openCodeAdapter > refuses an answer that holds the key, as it is or escaped, as Rust (DR6-55)`; R55b (che bằng `replaceAll` như lượt 1) / L2-E1 (không che) → KILLED `masks the key and the session in URL and JSON escapes too, as Rust (DR6-55)` / `maps HTTP statuses as Rust does…`; R55c / R55d (bỏ cách đọc JSON→URL / URL→JSON) → KILLED; R55f (`finish_reason` chứa key được truyền) → KILLED; R55g (che trùng đoạn), N6 (chỉ đọc nguyên văn), N7 (sai vị trí cuối escape) → KILLED; **R55e sống** (cách đọc một lượt `both` thay bằng chỉ JSON: tương đương — hai cách đọc hai lượt đã phủ mọi dạng trộn) | **CL2-F1** (hai lớp cùng loại vẫn vào file kết quả: cùng kẽ hở CL2-B4 của `ai.rs`) |
| 56 | #605 → #642 | **ĐÃ SỬA** | Ca L·CX-F2 / H·CX-F2 dựng lại (`p02-eval-cut.mjs`, `runEval` E01 + X01 qua `openCodeAdapter` + fetch giả, lần sau trả lời như Mock): `content: null` + `finish_reason: length` → mã ghim E01 **ACCEPTED sau 2 lần**, lần 1 V1 `CUT_ANSWER`, X01 OK sau 2 lần (bản `8855345`: E01 `ERROR AI_BAD_RESPONSE` sau 1 lần); "unfinishedOuter" (JSON Mock trong khối ngoài chưa đóng, `length`) → thử lại như app (bản `8855345`: ACCEPTED ngay lần 1); đối chứng JSON đủ + `length` → ACCEPTED 1 lần ở cả hai. Gỡ sửa: R56a (`null` + `length` lại thành lỗi) → KILLED `reads an answer cut before any content as an empty cut one, as Rust (R2-16)`; R56b (chấm như không bị cắt) → KILLED `runEval > retries an answer cut before any content as the app does, then accepts (DR6-56)`; R56c (không truyền `finishReason`), R56d (truyền mọi chuỗi), N4 (33 ký tự), N8 (`null` + mọi lý do là cắt) → KILLED | N5 (`completion_tokens: 0` đọc thành "không biết") sống: chỉ đổi chữ `+?` ở cột token của file kết quả, không ghi phát hiện |
| 57 | #605 → #642 (+ #646 docs) | **ĐÃ SỬA** | (a) Re-run trên SHA cũ: `p04-merge-gate.mjs` chạy **`tools/pr-status.mjs` và `tools/merge-pr.mjs --dry-run` thật** với `gh` giả (`fake-gh.mjs`: không gọi `gh` thật, git chỉ lệnh đọc): S1 run có notice `Tested base`, `main` chỉ thêm commit docs → `ready`; S2 thêm commit code → `blocked … main got code since feed000, the main CI tested on head abc1234 (…): gh pr update-branch 9…` (lượt 1 L·CL-F2: luật so giờ cho qua re-run); S5 Verify không có link `/job/<id>` → `CI on head abc1234 noted no tested main … gh pr close 9 + gh pr reopen 9`; S8 thêm một check Verify của run `workflow_dispatch` (không notice) đứng trước → chặn (an toàn). Bước CI: khối PowerShell của "Note the tested base" (`ci.yml:64-69`) chạy nguyên văn trên clone `--depth 1` dựng ở `F\ci-notice\` → `HEAD^1` không có, notice in **đúng tip `main`** (cha thứ nhất), không phải head của PR. (b) PR > 100 file (L·CL-F3): S3 150 file (2 trang REST) → `files 150 changed, 150 read · docs-only no`; S4 3 001 file (REST trả tối đa 3 000) → `Read 3000 of the 3001 files of the PR: check them by hand.` Gỡ sửa: R57a (bỏ chặn "noted no tested") → KILLED `mergeBlockers > stops a green code PR whose CI noted no tested main (a run from before DR6-57)`; R57b / R57c / R57d (coi như đọc đủ file / docs-only / notes-only dù thiếu) → KILLED `takes a PR it could not read every file of as code (DR6-57)`; R57e (SHA ngắn), R57f (annotation đầu tiên), N1 (không `trim`), N2 (hex hoa) → KILLED `the main CI tested (DR6-57) > is read from the notice of the Verify run, null without a whole SHA`; R57g / R57h (check khác / run id thay job id) → KILLED `comes from the Verify check of the head, by the job id in its link`; L2-P9 / L2-P10 (luật "main có code sau tested base" bỏ / chặn cả docs) → KILLED `stops a code PR when main got code since the main its CI tested (DR-80)`. **Sống:** R57i (`compare` đảo chiều) và R57j (đọc file PR không `--paginate`) — phần I/O của `pr-status.mjs`, không có unit test theo `.claude/rules/tests.md` (KNOWN #552: `pr-status.mjs` chưa có file test); `p04` chạy chính phần I/O đó; N3 (commit không file coi là docs) — code hiện chặn, an toàn | **CL2-F3** (Nit: commit của `main` từ tested base đọc bằng một lần `compare` không phân trang — tối đa 250 commit, theo tài liệu REST là 250 commit mới nhất — nên khi > 250 commit, commit code ở phần cũ hơn không được xét: S6a cổng mở) |
| 58 | #605 → #642 | **ĐÃ SỬA** | Tái hiện lượt 1 (L·CL-F1): máy này (phiên 1) đặt `CLAUDE_CONFIG_DIR = …\.claude-b`; đếm tên file (không đọc nội dung): `.claude-b\projects\C--workspace-Project-2C*` có 77 transcript của repo (63 + 13 + 1) mà `retro.mjs` lượt 1 không đọc. `p03-retro.mjs` chạy `tools/retro.mjs` thật trên **home giả** (transcript giả): `CLAUDE_CONFIG_DIR = ~\.claude-b` → `Transcripts read from: ~\.claude-b\projects, ~\.claude\projects`, 2 phiên; không đặt biến → `~\.claude\projects`, 1 phiên. Gỡ sửa: R58a (bỏ `CLAUDE_CONFIG_DIR`) / R58b (không khử trùng) → KILLED `project directories > reads the config folder in use (CLAUDE_CONFIG_DIR) and ~/.claude, once each (DR6-58)`; R58c (`join` thay `resolve`) sống: tương đương với đường dẫn tuyệt đối | **CL2-F4** (KNOWN #642 + bằng chứng mới: dạng 8.3 cũng đọc trùng, log `p03b-retro-83.log`; cách sửa "so chữ thường" của sổ không đủ); **CL2-F6** (Nit: README chưa đổi); **CL2-F8** (Low: thư mục cấu hình thứ hai của máy — `.claude-b` / `.claude-c` — không được đọc) |
| 64 | #605 → #642 | **ĐÃ SỬA** | Áp lại 4 đột biến sống của lượt 1 (H·CL-F4, `r1\mutate.mjs`): L1-P3 → KILLED `mergeBlockers > still needs a REVIEW for another file under docs/state/ (DR6-64 P3)`; L1-P5 → KILLED `stops on a verdict that only says PASS further on (DR6-64 P5)`; L1-S3 → KILLED `latestReview > takes no SHA of fewer than 7 hex characters: it would match many heads (DR6-64 S3)`; L1-S9 → KILLED `fitOutput > cuts to the room left after a long header (DR6-64 S9)`. Cả 46 đột biến lượt 1 còn áp được (P9 / P10 / P25 / E1 viết lại thành L2-* vì dòng đã đổi): 45 KILLED, L1-P4 sống như lượt 1 (tương đương: PR không file nào vẫn bị chặn vì không có CI) | — |
| 65 | #606 → #644 | **ĐÃ SỬA** | (1) `tables.test.ts` (`p11-tz.mjs`): bản `8855345` dưới `TZ=America/Los_Angeles` → `2 failed (2)` (dưới UTC `2 passed`); bản ghim → `2 passed`; **cả bộ dưới LA: 113 file, 2 898 / 2 898** (lượt 1 L·CL-F4: 2 failed). (2) `stats.ts` (`p13-stats-spec.mjs`: `e2e/perf/stats.spec.ts` chạy bằng config Playwright riêng, không server, không cổng 4173): bản ghim `9 passed`; gỡ sửa (đè tạm `stats.ts` của `8855345`, trả nguyên byte) → `1 failed | 8 passed` (`markdownTable gives no percent against a base median of 0 (#572)`); `p06-stats.mjs`: nền 0 → `+8 ms (—)`, `+0 ms (—)` (bản cũ: `+8 ms (+Infinity%)`, `+0 ms (−NaN%)`). (3) `e2e/customer-ai.spec.ts:757-770`: chỉ quét `messages[*].content`, không quét `sessionId` (đọc; ca chập chờn 0,049 % của #524 không tái hiện bằng đột biến được) | **CL2-F5** (một test khác có đồng hồ riêng 10:00 UTC đỏ ở UTC−11, trong khoảng comment DR-15 bảo đảm). Ngoài khoảng: `Pacific/Chatham` (+13:45) 2 failed, `Pacific/Kiritimati` (+14) 24 failed (lượt 1: 22) — đúng ACCEPTED (TR-5 Auckland) |

Kết luận bảng R gói F: **7 / 7 ĐÃ SỬA**; biến thể còn hở: CL2-F7 (DR6-44, cách đo), CL2-F1 (DR6-55), CL2-F3 (DR6-57), CL2-F4, CL2-F6, CL2-F8 (DR6-58), CL2-F5 (DR6-65). Bảng gộp đủ 59 DR6 ở mục 10.

## 3. Phạm vi đã đọc

**Diff sửa của gói F** (`git diff --numstat 8855345 4217ed4` trên file gói F; 45 commit trong khoảng): SP — `tools/eval-ai-core.mjs` +120 / −26, `tools/pr-core.mjs` +53 / −17, `tools/pr-status.mjs` +49 / −28, `tools/merge-pr.mjs` +8 / −7, `tools/retro.mjs` +14 / −8, `tools/retro-core.mjs` +12 / −1, `.github/workflows/ci.yml` +9, `vitest.config.ts` +16, `e2e/perf/stats.ts` +3 / −2 (`.claude/rules/ci.md` +1 là tài liệu, #646); test — `tools/eval-ai-core.test.mjs` +185, `tools/pr-core.test.mjs` +112 / −30, `tools/retro-core.test.mjs` +14, `tools/session-core.test.mjs` +12, `e2e/perf/stats.spec.ts` +15, và e2e của các gói khác (+≈ 1 000 dòng ở 15 spec: quét mẫu yếu, đọc phần của gói F: `full-cycle`, `guide/shots`, `overview`, `reports`, `customer-ai` "1984"). Đọc từng hunk.

**Đọc hết ở SHA ghim:** `tools/pr-core.mjs` (331), `pr-status.mjs` (158), `merge-pr.mjs` (160), `session-core.mjs` (121), `session-io.mjs` (15), `eval-ai-core.mjs` (807), `eval-ai.mjs` (58), `retro.mjs` (63), `retro-core.mjs` (254), `.github/workflows/ci.yml` (158), `.claude/rules/ci.md`; `e2e/perf/stats.ts` (diff + chữ ký), `e2e/perf/probe.perf.ts` 40–360 (cách đo `trash.open`, `reload.*`, tách debugger), `e2e/perf/README.md`, `docs/metrics/README.md` (mục `retro.mjs`). Không đổi từ `8855345` (`git diff --stat` rỗng; lượt 1 đã đọc hết, lượt này đọc lại chỗ probe dùng): `tools/{load-data*,codemap*,size-report*,handoff,status,session-start.ps1,session-end.ps1,bootstrap.ps1,review-hint-core}`, `.githooks/pre-push`, `.claude/{settings.json,hooks/*,launch.json}`, `packages/ui/scripts/check-tokens.ts`, `apps/desktop/vite.config.ts`, `package.json` gốc, `pnpm-workspace.yaml`, `tsconfig.base.json`, `eslint.config.js`, `.dependency-cruiser.cjs`, `playwright*.config.ts`, `e2e/{serve.mjs,support.ts,anchor.ts}`.

**Chỗ gói khác nối vào (luồng xuyên gói):** `packages/db/src/customers.ts` 131–220 (`updateCustomerProfile`, `changeStageManually`, `softDeleteCustomer` / `restoreCustomer`), 233–295 (`appendTransition`, `checkTransition` + E20), 357–474 (`withdrawAppointmentTransition`, `keptMeetings`, `transitionWithdrawnAt`, `reinstateTransition`, `latestTransition`); `appointments.ts` 60–180, 265–364 (`restoreAppointment`, `checkRestoreAppointment`, `restoreStageMove`, `outcomeFields`); `seed.ts` 90–199 (`seedDemoData`, `DEMO_SCALE`); `test-support.ts` 9–14 (DR-15); `backup-invariants.test.ts` 1076–1141; `apps/desktop/src/data/app-data.ts` 87–148 (API `AppData`), 200–260, 326–470 (`openAppData`, `seedDemo`); `data/ai-analysis.ts` 160–254 (`analyseCustomer`); `routes/reports/reports-view.ts` 200–328, `report-workbook.ts` 85–190; `routes/trash-view.ts` (chữ ký, `restoreRow`); `apps/desktop/src-tauri/src/ai.rs` 232–349 (`reply`, `is_finish_word`, `reveals`, `mask`, `readings` — để so với port của script).

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/{ci,tests,i18n-ui}.md`; `docs/design/phase-6-hoan-thien.md` §1 (tiêu chí phát hành), `docs/metrics/phase-6.md` (ngưỡng, bảng hàm thuần); `common\{prompt-claude.md, plan.md (đủ: §1–§12, §L2.1–§L2.11, Phụ lục A–H), known.md (đủ), fixes.md (bảng đầu, #605 / #642 / #646, #606 / #644), baseline.md}`; tổng hợp lượt 1 §1–§2, §5.7–§7.3; báo cáo gốc lượt 1 gói F: Claude laptop (`raw/2026-10-15/claude/F.md`, đủ), Claude Home PC (`raw/…/home-pc/claude/F.md`, đủ), Codex laptop / Home PC (các dòng CX-F2, phần probe eval); báo cáo lượt 2 của chính Claude `claude\A.md` … `E.md` (bảng R, kịch bản, phát hiện, bloat / hiệu năng, đã xét).

**Phiên làm tiếp đọc thêm (ở SHA ghim, trừ ghi chú khác):** `tools/pr-status.mjs` (đủ 158 dòng, lần nữa), `tools/retro.mjs` (đủ 63 dòng), `tools/retro-core.mjs` 194–206, `git diff 8855345 4217ed4` của `.github/workflows/ci.yml`, `vitest.config.ts`, `tools/merge-pr.mjs`, `tools/retro*.mjs`; `e2e/perf/README.md` (đủ), `e2e/perf/probe.perf.ts` 40–200, 252–365 (`timeInPage`, `click`, `detached`, `reloads`, `appointments`, `customers`, `filters`, `trash`); `apps/desktop/src/data/tables.ts` (đủ: `readTables` đọc lười), `packages/db/src/database.ts` 60–170 (`export()` xóa statement đã cache trước `sqlite.export()`), `apps/desktop/src/data/app-data.ts` 224–236 (`seedDemo`), `packages/db/src/seed.ts` 175–185, `packages/db/src/team.ts` (chữ ký `renameTeam`), `packages/db/src/customers.ts` 228–290 (cách cấp `seq`, `checkTransition`), `appointments.ts` 262–306, `backup-invariants.test.ts` 1074–1114, `test-support.ts` 8–14, `docs/metrics/README.md` 22–26, `apps/desktop/src-tauri/src/storage.rs` (bố cục `Project2C-data`), `apps/desktop/src/i18n/vi.ts` (khóa `settings.nav.*`, `trash.table`, `settings.backup.tooNew*`), bản `8855345` của `SettingsBackup.tsx` / `vi.ts` (K5); `docs/design/phase-6-hoan-thien.md` §1 (tiêu chí phát hành). `common\`: `plan.md` §1–§12 và §L2.1–§L2.11 (lần nữa), `baseline.md` (đủ), `known.md` 115–177 (OPEN của #572 … #644, DR6 hoãn, cờ `app.open-data`), `fixes.md` (Issue #605, PR #642). Lượt 1: báo cáo gốc Claude Home PC F §4–§8 (`raw/2026-10-15/home-pc/claude/F.md`), Claude laptop F §7 (cách ghi phụ lục), Claude Home PC B (tìm thư mục dữ liệu của exe lượt 1: không có), tổng hợp lượt 1 §1, §2, §7. Lượt 2 của chính Claude: đếm `Mức:` / `Tình trạng:` của mọi khối `ID:` ở `A.md` … `E.md`, bảng R A–E, CL2-A1, K5 của A, K5 / K9 / CL2-B7 của B, DR6-19 / CL2-C4 của C, K1 của D, K14 / CL2-E7 của E. Ngoài repo: tài liệu REST GitHub "Compare two commits" (docs.github.com, WebFetch, chỉ đọc trang công khai) cho CL2-F3.

## 4. Kịch bản mới đã thử

Mọi probe Node đi qua lớp dữ liệu của app (`openAppData`, `app.run`, `readBackup` / `importBackup`, `exportBackup`, `tables()`, hàm view của màn) khi kết luận về màn / dữ liệu người dùng thấy; lệnh `db` gọi thẳng chỉ khi kết luận về lệnh. K2, K4, K5, K6, K9 là chuỗi nhiều bước qua nhiều gói (domain + db + backup + app data + màn / exe); K1, K3 qua công cụ ↔ gói khác (`@p2c/ai`, luật Rust; `ci.yml` ↔ `pr-core` ↔ I/O của `pr-status` / `merge-pr`); K10 công cụ ↔ `db` ↔ luật nhập backup; K11 đo trên exe. Chuỗi "mở `Project2C-data\` do exe lượt 1 tạo bằng exe lượt 2" của trọng tâm gói F đã có ở gói B (K5 của `claude\B.md`) nên không làm lại (mục 8 D).

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | Script eval ↔ luật key của Rust ↔ file kết quả: `evalMain` + fetch giả, key giả ở 8 dạng trong `content` (nguyên văn, JSON, URL, JSON→URL, URL→JSON, **JSON+JSON** hai cách viết, **URL+URL**) và trong thông điệp 401; đếm mọi dạng trong file kết quả, `.partial`, log, và số lần giải để ra key (`p01-eval-key.mjs`) | 5 dạng một lớp / hai lớp khác loại → `AI_BAD_RESPONSE`, 0 lần; hai lớp cùng loại → REJECTED, 25 lần trong file kết quả, giải 2 lần ra key; 401 URL+URL không che | CL2-F1 |
| K2 | E20 qua hai máy của Owner (K12): máy A ghi chuyển tay N3→N4 lúc 13:00 rồi cuộc gặp N4→N2 lúc 13:01 cùng ngày → xuất → máy B nhập, xóa cuộc gặp lúc thật 13:02 với đồng hồ B chậm 5 phút / đúng giờ → Thùng rác → khôi phục; chiều ngược: B nhanh 5 phút xóa, xuất, A nhập rồi chuyển tay N4→N1 lúc 13:04 → khôi phục (`p09-e20-skew.mjs`, `openAppData` hai đồng hồ) | B chậm: chặn `TRANSITION_BEFORE_LATEST`, không khôi phục được; B đúng giờ: khôi phục OK. Chiều ngược: không chặn, khôi phục thêm `N1→N2 (cuộc gặp)` sau chuyển tay; đối chứng đúng giờ: chặn như E20 | CL2-F2 |
| K3 | Cổng merge đầu-cuối: `pr-status.mjs` và `merge-pr.mjs --dry-run` **thật** của repo, `gh` giả (`fake-gh.mjs`: patch `child_process` + `module.syncBuiltinESMExports`, git chỉ lệnh đọc), 9 kịch bản: re-run + commit docs / commit code trên `main`, PR 150 file (2 trang REST), 3 001 file, Verify không có link job, 251 commit sau tested base, PR chỉ sổ ghi chú, hai check Verify, PR xếp chồng (`p04-merge-gate.mjs`); phiên làm tiếp: hai ca 251 commit với `compare` trả như tài liệu REST — 250 commit mới nhất (`p04b-merge-gate-250.mjs`) | S1 ready, S2 chặn, S3 đọc 150 / 150, S4 chặn "Read 3000 of the 3001", S5 / S8 chặn "noted no tested", S7 ready, S9 chặn base chưa merge; S6 (mô hình "250 commit đầu" của phiên 1) ready; **S6a — commit cũ nhất là code, 250 commit mới nhất docs-only → ready**; S6b — commit mới nhất là code → chặn; dry-run không chạy lệnh ghi nào (fake chặn mọi git ghi, không bị gọi), `git status` rỗng | CL2-F3 |
| K4 | Mở app lần đầu / "Nạp lại" vào **mọi ngày** từ 17/10/2026 tới 31/12/2027 (+ 28–29/02/2028, 01/03/2028, 31/12/2028, 01/01/2029): `seedDemoData(seed 1, DEMO_SCALE)` như `seedDemo` của app với đồng hồ 09:00 ngày đó (lệnh giờ chặt hơn ở đợt sửa: D7 mở rộng, nhóm của ngày…), rồi luật nhập backup (`validateBackupValues` + `validateBackupInvariants`) trên dữ liệu sinh ra (`p05-seed-dates.mjs`, 3 worker) | **446 / 446 ngày OK** (`p05-seed-dates.log`: `days 446, failures 0, 770 s`): mỗi ngày 3 team, 36 nhân sự, 1 200 KH, 6 229 lịch, 988 HĐ; luật nhập nhận hết; sinh 3,4–6,0 s mỗi ngày trong worker (3 worker song song, không phải số đo hiệu năng) | không thấy |
| K5 | Hai máy lúc nâng cấp v1.0 từng máy một: demo 17/10 do **app lượt 1** (`8855345`, bản `git archive`) xuất → app ghim nhập; demo do app ghim xuất → app lượt 1 nhập (`p10-cross-version.mjs`, lớp dữ liệu của app mỗi bên) | v1.0 nhập bản 0.1.0: OK (1 200 KH, 6 229 lịch); 0.1.0 nhập bản v1.0: `SCHEMA_TOO_NEW {"version":11,"supported":9}` → hộp nhập backup của bản 0.1.0 có câu riêng `settings.backup.tooNew` "File tạo từ bản app mới hơn (schema v{version}, app này v{supported})" + "Cập nhật app rồi nhập lại. Dữ liệu hiện tại không bị đổi." (`SettingsBackup.tsx:261`, `vi.ts:1017-1018` ở `8855345`) — đúng, K12 | không thấy |
| K6 | DR6-44 / CL2-E7 trên **exe release**: dữ liệu tải + 0 / 150 / 600 / 1 200 KH xóa dựng trên lớp dữ liệu của app (`p07`, `project2c.db` = byte app lưu), exe bản chép mỗi cỡ, Cài đặt → "Thùng rác" đo như `trash.open` của probe (bấm → khung hình sau), 5 lần còn gắn DevTools và 5 lần đã ngắt DevTools (`exe-trash.mjs`) | 113 / 263 / 713 / 1 313 dòng: gắn DevTools 74,8 / 126,5 / **264,9** / **450,8** ms; ngắt 31,6 / 48,3 / 87,6 / 138,3 ms (trung vị 5 lần); bảng hiện 100 dòng ở mọi cỡ; exe mở được cả 4 file, tự backup lúc mở (`backups\project2c-s00000001-….db`), đóng bằng nút X (`CloseMainWindow`) → exit 0 | CL2-F7; (CL2-E7: số mới) |
| K7 | Bộ unit test dưới 6 múi giờ (#644 viết comment DR-15: bảo đảm UTC−11…+12): `America/Los_Angeles`, `Pacific/Pago_Pago` (−11), `Pacific/Honolulu` (−10), `Asia/Kathmandu` (+5:45), `Pacific/Chatham` (+13:45), `Pacific/Kiritimati` (+14); `tables.test.ts` cũ đè tạm dưới LA (`p11-tz.mjs`) | LA, Honolulu, Kathmandu: 2 898 / 2 898; **Pago Pago: 1 failed** (`backup-invariants.test.ts`, đồng hồ riêng 10:00 UTC); Chatham 2 / Kiritimati 24 failed (ngoài khoảng, ACCEPTED); `tables.test.ts` cũ đỏ 2 ca dưới LA, bản ghim xanh | CL2-F5 |
| K8 | `retro.mjs` trên home giả: `CLAUDE_CONFIG_DIR` = `.claude-b` (như phiên 1), không đặt, `.CLAUDE` (khác hoa / thường), đường dẫn tương đối (`p03-retro.mjs`), dạng 8.3 của `~\.claude` (`p03b-retro-83.mjs`, ShortPath của Scripting.FileSystemObject); ba thư mục cấu hình `.claude` / `.claude-b` / `.claude-c` như máy này hiện có (`p03c-retro-multi.mjs`) | `.claude-b`: đọc cả hai, 2 phiên (DR6-58 đã sửa); `.CLAUDE` và 8.3: cùng phiên đếm hai lần; tương đối: giải theo thư mục đang đứng, không có → bỏ, dòng "Transcripts read from" cho thấy; ba thư mục: chỉ đọc thư mục của phiên + `~\.claude` → 2 of 3 phiên | CL2-F4 (KNOWN + bằng chứng mới), CL2-F8 |
| K9 | Chuỗi qua tháng mới (`p12-chain-month.mjs`): demo neo 31/10/2026 → 5c bàn giao KH N3 (cổng PAIN_POINT_ANALYSIS) sang RE team khác → 6c ghi Đã gặp N3→N2 kèm hẹn 01/11 → Phân tích (Mock) → 5f xóa KH lúc 23:59 → Xuất backup → máy khác 01/11 00:01 nhập → Thùng rác → `restoreRow` của màn → mọi ô Báo cáo (Tháng 10 + Năm 2026 × Toàn bộ / 2 team / 2 RE × Tổng hợp / Theo team / Theo RE / Theo mốc, 209 dòng) và file Excel tháng 10, xem như ngày 31/10; KH, lịch hẹn, lịch sử AI | Phân tích `ACCEPTED`; xóa đổi 78 / 209 dòng màn; 01/11: dòng Thùng rác không bị chặn, nút "Khôi phục KH Phạm Thị An"; khôi phục `OK`; **0 / 209 dòng màn, 0 / 49 dòng Excel khác trước khi xóa**; KH, 9 lịch hẹn (cuộc gặp 31/10 và hẹn 01/11 ở RE mới), phân tích CURRENT y như cũ; 01/11, RE mới, tháng 11: Dự kiến 15 | không thấy |
| K10 | Lệnh dữ liệu tải (`tools/load-data-core.mjs` `buildLoadData`, LOAD_SCALE + Thùng rác qua lệnh xóa) với 5 ngày neo (12/10, 17/10, 30/09, 28/02/2026, 31/12/2025) × 8 seed, rồi `importBackup` từng file (như Cài đặt → Nhập backup, hôm nay 17/10) (`p14-load-variants.mjs`) | **40 / 40 OK** (`p14-load-variants.log`: `runs 40, failures 0, 92 s`): mỗi file 1 496 KH (15 KH trong Thùng rác), 10 380–10 453 lịch theo seed (không theo ngày neo), 40 hash `tables` khác nhau; neo 12/10 seed 6 → `1c306cfb8203…` = plan §L2.6 (tất định cả trong worker); dựng 5,4–6,4 s, nhập 0,79–0,89 s (3 worker song song) | không thấy |
| K11 | DevTools gắn có làm chậm thao tác khác của probe không (exe release, dữ liệu tải, cửa sổ luôn trên): 3 thao tác không chạy SQL (`appointments.period-year`, `customers.view-table`, `reports.filter-year`, selector và cách đo của `probe.perf.ts`), 5 lần gắn + 5 lần ngắt (`exe-readonly.mjs`); mở dữ liệu khi tải lại (`p2c:data-open` của tài liệu mới), 5 lần gắn + 5 lần ngắt (`exe-reload.mjs`) | 16,4 / 15,1 · 13,7 / 14,7 · 7,9 / 7,2 ms (lệch ±1 ms); mở dữ liệu 235,7 / 221,1 ms (+6,6 %) → chỉ `trash.open` bị phóng đại (×2,4–3,3) | CL2-F7 |

## 5. Phát hiện mới

### CL2-F1 — Script eval chép đúng kẽ hở CL2-B4 của Rust: key qua hai lớp escape cùng loại (JSON rồi JSON, URL rồi URL) vẫn vào file kết quả `docs/metrics/ai-eval-*.md` và không bị che trong thông điệp 401

```
ID: CL2-F1
Mức: Low
Trục: S
Vị trí: tools/eval-ai-core.mjs:127-141 (readings: "Never two passes of JSON"), :144-145 (reveals), :148-164 (mask), :236 (trả lời chứa key → AI_BAD_RESPONSE), :602, :626 (raw của REJECTED / INVALID chép nguyên văn vào file kết quả) (4217ed4)
Tình trạng: CONFIRMED (fetch giả, key giả)
Liên quan: DR6-55 (biến thể còn hở), CL2-B4 (cùng luật ở apps/desktop/src-tauri/src/ai.rs:337-338) · có từ trước; PR #642 port đúng 4 cách đọc của Rust
Kịch bản: K1
```

- **Mô tả:** #642 port nguyên `readings` / `reveals` / `mask` của Rust (DR6-55): bốn cách đọc, cố ý không có hai lượt JSON và không có hai lượt URL. Một trả lời 2xx mà `content` chứa key viết bằng escape JSON hai lớp (`\\u0073\\u006b…` hoặc `\u005Cu0073…`) hay `%XX` hai lớp (`%2573%256B…`) qua được kiểm, bị validator đánh REJECTED / INVALID, rồi `raw` được chép nguyên văn vào file kết quả (file để commit vào repo public). Thông điệp lỗi 401 / 429 có key `%XX` hai lớp không bị che (dạng JSON hai lớp dài hơn 200 ký tự nên bị cắt trước khi đủ key).
- **Tái hiện:** `node p01-eval-key.mjs` (log `F\p01-eval-key.log`; `evalMain` với `fetch` giả, file trong bộ nhớ): `answer jsonJson` → `E01 | discovery | REJECTED | 2`, `forms of the key found in result+log {"jsonJson":25}`, `decodes that give the key back: ["2× JSON","3× JSON"]`; `answer jsonJsonU005C` → 25 lần, `2× JSON`; `answer urlUrl` → 25 lần, `2× URL`; `401 urlUrl` → `LỖI AI_UNAUTHORIZED (HTTP 401: bad %2573%256B%252D…`, 3 lần, `2× URL`. Đối chứng: một lớp JSON / URL / JSON→URL / URL→JSON → `AI_BAD_RESPONSE`, 0 lần (DR6-55 đã sửa).
- **Ảnh hưởng:** như CL2-B4: cần server / proxy bất thường dội key ở đúng dạng đó → Low; khi gặp, key (giải hai lần là ra) nằm trong file kết quả eval mà Owner commit vào repo public — dòng nhắc "đọc lại trước khi commit" chỉ hiện khi có thông điệp lỗi server, không khi key nằm trong `raw`.
- **Đề xuất:** sửa cùng CL2-B4, cùng một luật ở hai nơi: thêm hai cách đọc JSON→JSON và URL→URL vào `readings` (6 thay 4) ở cả `ai.rs` và `eval-ai-core.mjs`, ca test hai lớp cùng loại ở `eval-ai-core.test.mjs` (`twoLayers` thêm hai dạng). ≈ 2 dòng SP + 2 ca test cho script.

### CL2-F2 — E20 so lúc ghi chuyển tay với lúc xóa bằng đồng hồ của hai máy khác nhau: xuất / nhập giữa hai máy lệch giờ vài phút làm cuộc gặp Đã gặp vừa xóa không khôi phục được (máy xóa chậm giờ), hoặc khôi phục đè lên chuyển tay ghi sau lúc xóa (máy xóa nhanh giờ)

```
ID: CL2-F2
Mức: Low
Trục: D, E
Vị trí: packages/db/src/customers.ts:286 (sameDayLater = latest.createdAt > recordedAfter); packages/db/src/appointments.ts:303 (recordedAfter = deleted_at của lần xóa); packages/db/src/customers.ts:261 (created_at = db.now() của máy ghi chuyển nhóm), packages/db/src/appointments.ts:268-269 (deleted_at = stampDeleted của máy xóa) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-03 (E20) · mới do đợt sửa (PR #614, spec E20 #615); cùng chỗ với CL2-A5 (so mốc dạng chữ) nhưng khác nguyên nhân
Kịch bản: K2
```

- **Mô tả:** E20 coi chuyển nhóm "cùng ngày nhưng ghi sau lúc xóa" là ngày sau (chặn khôi phục). Code so `created_at` của chuyển nhóm mới nhất với `deleted_at` của lần xóa — hai mốc do **hai máy khác nhau** ghi khi Owner làm trên hai máy (xuất ở máy này, nhập ở máy kia — K12). Máy xóa chậm giờ hơn máy ghi chuyển tay thì một chuyển tay ghi **trước** lúc xóa bị coi là ghi sau → chặn sai; máy xóa nhanh giờ thì một chuyển tay ghi **sau** lúc xóa bị coi là ghi trước → không chặn, khôi phục ghi chuyển nhóm của cuộc gặp **sau** chuyển tay đó.
- **Tái hiện:** `node p09-e20-skew.mjs` (log `F\p09-e20-skew.log`), mọi bước qua lớp dữ liệu của app (`openAppData` với đồng hồ riêng mỗi "máy", `app.run`, `exportBackup`, `readBackup` / `importBackup`, `listTrash`): máy A (đúng giờ) ghi chuyển tay N3→N4 ngày 12/10 lúc 13:00 rồi cuộc gặp 12/10 N4→N2 lúc 13:01, xuất; máy B nhập và xóa cuộc gặp lúc thật 13:02:
  - B chậm 5 phút (`deleted_at` 12:57) → Thùng rác `blocked {"code":"TRANSITION_BEFORE_LATEST","params":{"date":"12/10/2026"}}`, `restoreAppointment: refused TRANSITION_BEFORE_LATEST`; đối chứng C đúng giờ (13:02) → `blocked null`, `restoreAppointment: OK`, KH về N2.
  - Chiều ngược (D): B nhanh 5 phút xóa (đọc 13:07), xuất; về A, người dùng chuyển tay N4→N1 lúc 13:04 (sau lúc xóa) → Thùng rác `blocked null`, khôi phục `OK`: thêm `#5 N1→N2 (cuộc gặp)`, KH từ N1 về N2; đối chứng E (máy xóa đúng giờ) → `blocked TRANSITION_BEFORE_LATEST` như E20.
- **Ảnh hưởng:** cần đồng hồ hai máy lệch quá khoảng thời gian thật giữa chuyển tay và lần xóa (Windows đồng bộ giờ thường giữ lệch dưới 1 s; lệch vài phút khi đồng bộ hỏng / máy không có quyền admin) và thao tác cùng ngày qua lại giữa hai máy → Low. Khi gặp: (B) cuộc gặp nằm mãi trong Thùng rác (TR-6), "Đã gặp" và RF của nó mất khỏi chỉ số, câu chặn nói "Nhóm KH đã đổi ngày 12/10/2026, sau ngày cuộc hẹn này" (CL2-E2); (D) khôi phục đổi nhóm KH ngược lại chuyển tay sau đó (hộp TR-8 có báo "N1 → N2", nên không lặng lẽ).
- **Đề xuất:** E20 so theo `seq` thay cho đồng hồ: lúc xóa, D7 buộc chuyển nhóm của cuộc gặp là mới nhất, nên mọi chuyển nhóm có `seq` lớn hơn `seq` của chuyển nhóm đã rút đều ghi sau lúc xóa — `sameDayLater = latest.seq > withdrawn.seq`, không phụ thuộc đồng hồ máy nào (sửa luôn CL2-A5). ≈ 3–5 dòng SP (`checkTransition` nhận `afterSeq`, `checkRestoreAppointment` truyền `move.withdrawn.seq`) + 2 ca `trash.test.ts` (mốc thời gian đảo ngược với `seq`).

### CL2-F3 — Cổng "tested base" đọc `compare` một trang: quá 250 commit trên `main` sau bản đã test thì chỉ 250 commit (theo tài liệu REST: 250 commit mới nhất) được xét, commit code ở phần cũ hơn không chặn

```
ID: CL2-F3
Mức: Nit
Trục: S
Vị trí: tools/pr-status.mjs:53-60 (loadMainSince: `gh api compare/<tested>...<base> --jq '[.commits[].sha]'`, không --paginate, không so total_commits), :116-118 (dòng "tested … N commit(s) on it since"); tools/pr-core.mjs:173 (untested chỉ lọc mainSince đã đọc) (4217ed4)
Tình trạng: PLAUSIBLE (hành vi của code CONFIRMED: `pr-status.mjs` thật với `gh` giả trả 250 commit; giới hạn 250 và thứ tự lấy từ tài liệu REST "Compare two commits" trên docs.github.com, chưa gọi GitHub)
Liên quan: DR6-57 (cùng loại "đọc thiếu thì chặn" mà #642 làm cho danh sách file PR) · mới do đợt sửa (PR #642 thay so giờ bằng compare từ tested base)
Kịch bản: K3
```

- **Mô tả:** #642 chặn khi đọc thiếu file của PR, nhưng danh sách commit của `main` từ bản đã test lấy bằng một lần `gh api compare` không phân trang. Tài liệu REST nói gọi không `page` / `per_page` thì "the returned list is limited to 250 commits, and the last commit in the list is the most recent of the entire comparison", theo thứ tự thời gian — tức khi có hơn 250 commit, các commit **cũ nhất** (ngay sau tested base) bị bỏ. `loadMainSince` không so `total_commits`, nên các commit bị bỏ không được xét, và dòng `tested` in "250 commit(s)".
- **Tái hiện:** `node p04b-merge-gate-250.mjs` (log `F\p04b-merge-gate-250.log`; `fake-gh.mjs` với `compareLimit: 'newest'` trả 250 commit mới nhất như tài liệu): **S6a** — 251 commit sau tested base, commit cũ nhất sửa `apps/desktop/src/main.tsx`, 250 commit sau chỉ sửa `docs/state/review-notes.md` → `tested   main feed000, 250 commit(s) on it since` · `merge    ready: node tools/merge-pr.mjs 9` (`commits read one by one: 250`); **S6b** (commit mới nhất là code) → `blocked … main got code since feed000`. Phiên 1 (`p04-merge-gate.mjs` S6, log `F\p04-merge-gate.log`) mô hình "250 commit đầu, cũ nhất trước" nên dựng ca ngược chiều (commit thứ 251 là code → `ready`); phiên làm tiếp đọc tài liệu và sửa: theo tài liệu ca đó bị chặn đúng, ca hở là S6a. `git status --short after: ""`.
- **Ảnh hưởng:** cần > 250 commit trên `main` từ lần chạy CI của PR, có commit code nằm trong phần cũ bị bỏ, và cả 250 commit mới nhất đều docs-only — với nhịp merge của repo (PR code xen PR docs) gần như không xảy ra → Nit. Khi gặp, `merge-pr` cho merge một PR chưa từng test cùng code mới.
- **Đề xuất:** đọc thêm `total_commits` (`--jq '{n: .total_commits, shas: [.commits[].sha]}'`) và chặn "đọc thiếu" khi `shas.length < n`, như `prFiles`; hoặc đọc đủ các trang (`page` / `per_page`). ≈ 3–5 dòng `pr-status.mjs` (I/O, không unit test theo quy ước) + một ca `pr-core.test.mjs` nếu đưa phép so vào `mergeBlockers`.

### CL2-F4 — `retro.mjs` đếm trùng phiên khi `CLAUDE_CONFIG_DIR` trỏ `~/.claude` ở dạng 8.3 (`C:\WORKSP~1\…\CLAUDE~1`): cách sửa "so chữ thường" của sổ ghi chú không đủ

```
ID: CL2-F4
Mức: Nit
Trục: C
Vị trí: tools/retro-core.mjs:200-203 (projectRoots: khử trùng bằng so chuỗi sau resolve) (4217ed4)
Tình trạng: KNOWN (sổ review-notes, ghi chú #642 thứ tư: khác hoa / thường) — bằng chứng mới, CONFIRMED có log: đường vào thứ hai (8.3), và đề xuất "so theo chữ thường trên win32" của sổ không chặn được nó
Liên quan: DR6-58 · mới do đợt sửa (PR #642)
Kịch bản: K8
```

- **Tái hiện:** (home giả, transcript giả) `node p03-retro.mjs` (log `F\p03-retro.log`): `CLAUDE_CONFIG_DIR = ~\.CLAUDE` → `read from: ~\.CLAUDE\projects, ~\.claude\projects`, phiên `aaaa1111` hiện **hai lần** (đúng ghi chú KNOWN). Dòng "8.3" của `p03-retro.log` không thử được gì (đường dẫn ngắn qua `cmd /c for … %~sI` gọi bằng `execFileSync` bị hỏng thành `C:\"C:\…\.claude\"`, nên chỉ đọc `~\.claude`); số 8.3 phiên 1 ghi lấy từ một lệnh PowerShell không lưu log, nên phiên làm tiếp chạy lại có log: `node p03b-retro-83.mjs` (log `F\p03b-retro-83.log`): ShortPath (Scripting.FileSystemObject) của `~\.claude` = `C:\WORKSP~1\DEEP-R~1\claude\F\retro\home\CLAUDE~1` → `read from: C:\WORKSP~1\DEEP-R~1\claude\F\retro\home\CLAUDE~1\projects, C:\workspace\deep-review-1-6-r2\claude\F\retro\home\.claude\projects`, `sessions counted: 2`, phiên `aaaa1111` hai dòng; đối chứng dạng dài → 1 phiên; `same folder (realpathSync.native): true`. `git status --short after: ""`.
- **Ảnh hưởng:** chỉ số "Điều hướng" của `docs/metrics/phase-<N>.md` đếm đôi phiên khi biến môi trường viết theo dạng khác của cùng thư mục (máy này: phiên 1 đặt dạng dài `…\.claude-b`, phiên làm tiếp `…\.claude-c`, nên chưa gặp) → Nit.
- **Đề xuất:** khử trùng theo `fs.realpathSync.native(root)` của các thư mục có thật (giải cả hoa / thường lẫn 8.3), thay cho so chuỗi; ≈ 2 dòng `retro.mjs` (I/O) hoặc truyền hàm `realpath` vào `projectRoots` để giữ test thuần.

### CL2-F5 — Một test khác có đồng hồ riêng 10:00 UTC đỏ ở UTC−11, trong khoảng UTC−11…+12 mà comment DR-15 (sửa ở #644) bảo đảm cho cả bộ test

```
ID: CL2-F5
Mức: Nit
Trục: T
Vị trí: packages/db/src/backup-invariants.test.ts:1078 (`now = () => new Date(Date.UTC(2026, 8, 15, 10, 0, 0))`), :1107-1113 (cuộc gặp 15/09 đặt rồi ghi kết quả); so với packages/db/src/test-support.ts:10-12 (DR-15: 11:00 UTC "from UTC−11 to UTC+12") (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-65 (biến thể còn hở: #644 chỉ sửa đồng hồ riêng của tables.test.ts) · có từ trước, lượt 1 bỏ sót (lượt 1 chỉ chạy UTC, UTC−7, UTC+14)
Kịch bản: K7
```

- **Mô tả:** DR6-65 tìm `tables.test.ts` có đồng hồ riêng hẹp hơn khoảng múi giờ comment DR-15 hứa; #644 sửa đúng file đó và viết lại comment: bộ test đúng từ UTC−11 tới UTC+12. Ca này của `backup-invariants.test.ts` cũng tự đặt đồng hồ, 10:00 UTC: ở UTC−11 đó là 23:00 ngày 14/09, nên ghi kết quả cuộc gặp ngày 15/09 bị `OUTCOME_IN_FUTURE`.
- **Tái hiện:** `node p11-tz.mjs` (log `F\p11-tz.log`): `TZ=Pacific/Pago_Pago: exit 1 — 1 failed | 112 passed (113) — 1 failed | 2897 passed (2898)`; chạy riêng file: `× imports again after each main command ran on the imported demo data` · `DbError: OUTCOME_IN_FUTURE ❯ requireOutcomeDay packages/db/src/appointments.ts:506:11`. `TZ=Pacific/Honolulu` (UTC−10): 2 898 / 2 898.
- **Ảnh hưởng:** chỉ người chạy test trên máy UTC−11 (Samoa thuộc Mỹ, Niue, Midway); CI và hai máy ở UTC / UTC+7. Comment DR-15 nói sai phạm vi thật của bộ test.
- **Đề xuất:** đồng hồ của ca này 11:00 UTC như `setup()` (1 dòng), hoặc dùng `setup()`; một lệnh kiểm `TZ=Pacific/Pago_Pago` cạnh `TZ=America/Los_Angeles` khi chạm lại comment DR-15.

### CL2-F6 — Tài liệu của `retro.mjs` vẫn nói chỉ đọc `~/.claude/projects` sau DR6-58

```
ID: CL2-F6
Mức: Nit
Trục: C
Vị trí: docs/metrics/README.md:24 ("Đọc transcript Claude Code của máy đang chạy (`~/.claude/projects/<thư mục repo>*/*.jsonl` …)") ↔ tools/retro.mjs:6-8, :38, :57 (đọc thêm CLAUDE_CONFIG_DIR, in "Transcripts read from") (4217ed4)
Tình trạng: CONFIRMED (đọc; `p03-retro.mjs` cho thấy hành vi mới)
Liên quan: DR6-58 · mới do đợt sửa (PR #642 sửa code, không sửa README — Issue #605 liệt kê README ở "Tài liệu cần đọc")
```

- **Mô tả / ảnh hưởng:** người lấy số "Điều hướng" cho `docs/metrics/phase-<N>.md` (G7) đọc README thấy lệnh chỉ đọc `~/.claude`, trong khi lệnh nay đọc thêm thư mục `CLAUDE_CONFIG_DIR` của phiên (máy này: `.claude-b` ở phiên 1, `.claude-c` ở phiên làm tiếp — và vẫn bỏ thư mục kia, CL2-F8); chỉ chữ, output đã nói thư mục đã đọc → Nit.
- **Đề xuất:** README dòng 24: "`<thư mục cấu hình>/projects/…` của `CLAUDE_CONFIG_DIR` và của `~/.claude`, dòng đầu output ghi các thư mục đã đọc" (PR docs).

### CL2-F7 — Probe `e2e/perf` đo `trash.open` khi còn gắn DevTools: số chậm hơn người dùng thấy ×2,4–3,3 và lệch tăng theo số dòng Thùng rác; các thao tác không chạy SQL không bị

```
ID: CL2-F7
Mức: Nit
Trục: P
Vị trí: e2e/perf/probe.perf.ts:344-348 (`trash()`: `click('trash.open', …)` đo khi đang nối CDP), :152-156 (`click`), :158-177 (`detached`, chỉ dùng cho lệnh ghi); e2e/perf/README.md mục "Debugger làm chậm lệnh ghi qua IPC" (4217ed4)
Tình trạng: CONFIRMED (số đo trên exe release)
Liên quan: DR6-44, CL2-E7 (số mới cho phát hiện của gói E) · có từ trước (T-218), lượt 1 bỏ sót
Kịch bản: K6, K11
```

- **Mô tả:** probe đo mọi thao tác chỉ đọc khi còn nối CDP; chỉ lệnh ghi đo khi đã ngắt, vì README chỉ nói debugger làm chậm lệnh ghi qua IPC. Trên exe, CDP gắn làm `trash.open` chậm ×2,4–3,3, phần chậm thêm tăng theo số dòng Thùng rác (tức phần `listTrash`, nhiều câu SQL nhỏ), trong khi ba thao tác không chạy SQL lệch ±1 ms và mở dữ liệu khi tải lại chỉ +6,6 % (nguyên nhân chưa tách). Cột `trash.open` của probe — và mọi phép so ngưỡng / mốc dựa trên nó, như "vượt 200 ms từ ≈ 500 dòng" của CL2-E7 — vì vậy mô tả số khi gắn DevTools, không phải thời gian người dùng thấy.
- **Tái hiện:** `node exe-trash.mjs 0` + `node exe-trash.mjs 150 600 1200` (log `F\exe-trash-0.log`, `F\exe-trash.log`): 113 / 263 / 713 / 1 313 dòng → gắn `74.8 / 126.5 / 264.9 / 450.8` ms, ngắt `31.6 / 48.3 / 87.6 / 138.3` ms (trung vị 5 lần mỗi cách); `node exe-readonly.mjs` (log `F\exe-readonly.log`): `appointments.period-year: attached … (median 16.4) ms; detached … (median 15.1)`, `customers.view-table` 13.7 / 14.7, `reports.filter-year` 7.9 / 7.2; `node exe-reload.mjs` (log `F\exe-reload.log`): `reload, attached: p2c:data-open … (median 235.7) ms`, `detached: … (median 221.1) ms`.
- **Ảnh hưởng:** chỉ cách đo. Ngưỡng < 200 ms của `trash.open` theo probe chặt hơn thật (an toàn: báo đỏ sớm), nhưng mốc theo dõi Thùng rác (đề xuất của CL2-E7) và mức của CL2-E7 nên dựa cả trên số không DevTools: người dùng chỉ chạm 200 ms ở ≈ 2 000 dòng (ngoại suy tuyến tính 0,089 ms / dòng), trong khi probe báo ❌ từ ≈ 510 dòng → Nit.
- **Đề xuất:** đo `trash.open` cả hai cách (thêm một dòng `detached('trash.open-detached', …)` cạnh `click('trash.open', …)`, giữ tên cũ làm khóa so), hoặc ghi một câu trong README / `docs/metrics/phase-6.md`: "thao tác chạy nhiều câu SQL (Thùng rác) đo khi gắn DevTools chậm ×2–3 so với không gắn". ≈ 3–10 dòng `probe.perf.ts` + README; không đổi SP.

### CL2-F8 — `retro.mjs` chỉ đọc thư mục cấu hình của phiên đang chạy và `~/.claude`: máy dùng nhiều thư mục cấu hình (Home PC: `.claude-b` và `.claude-c`) thì transcript của thư mục kia bị bỏ khỏi chỉ số "Điều hướng" mà không báo

```
ID: CL2-F8
Mức: Low
Trục: C
Vị trí: tools/retro-core.mjs:196-203 (projectRoots: chỉ [CLAUDE_CONFIG_DIR, ~/.claude]); tools/retro.mjs:38-39 (đọc đúng các thư mục đó), :57 (in thư mục đã đọc, không nói thư mục nào bị bỏ) (4217ed4)
Tình trạng: CONFIRMED (`retro.mjs` thật trên home giả; trên máy này chỉ đếm tên file)
Liên quan: DR6-58 (biến thể còn hở: Issue #605 chỉ đòi CLAUDE_CONFIG_DIR + ~/.claude) · có từ trước, phần sửa chưa phủ
Kịch bản: K8
```

- **Mô tả:** máy này có **ba** thư mục cấu hình Claude Code chứa transcript của repo (đếm tên file `*.jsonl` trong `projects\C--workspace-Project-2C*`, không đọc nội dung): `~\.claude` 76 (71 của checkout chính, 1 của một worktree Claude, 4 của `-review`), `~\.claude-b` 77 (63 / 13 `-review` / 1 `-review-2`), `~\.claude-c` 16 (5 / 11 `-review`). Phiên 1 của gói này chạy với `CLAUDE_CONFIG_DIR = …\.claude-b`, phiên làm tiếp với `…\.claude-c`. `projectRoots` chỉ lấy `CLAUDE_CONFIG_DIR` của phiên đang chạy và `~/.claude`, nên chạy `retro.mjs` từ một phiên `.claude-c` thì 77 transcript của `.claude-b` (46 % của 169) không vào báo cáo; từ một phiên `.claude-b` thì thiếu 16 của `.claude-c`. Dòng `Transcripts read from:` chỉ nêu thư mục đã đọc.
- **Tái hiện:** `node p03c-retro-multi.mjs` (log `F\p03c-retro-multi.log`; `tools/retro.mjs` của repo, home giả có một phiên giả ở mỗi `.claude`, `.claude-b`, `.claude-c`): `CLAUDE_CONFIG_DIR = ~\.claude-c` → `read from: ~\.claude-c\projects, ~\.claude\projects` · `sessions counted: 2 of 3` (thiếu `bbbb2222` của `.claude-b`); `= ~\.claude-b` → `2 of 3` (thiếu `cccc3333`); không đặt → `1 of 3`. `git status --short after: ""`. Số trên máy: lệnh đếm ở phụ lục 9.3 (`Get-ChildItem -Filter *.jsonl | Measure-Object`, `$env:CLAUDE_CONFIG_DIR` = `C:\Users\<user>\.claude-c` ở phiên này).
- **Ảnh hưởng:** chỉ số "Điều hướng" của `docs/metrics/phase-<N>.md` (lấy ở G7, 30 phiên gần nhất) thiếu phiên của thư mục cấu hình kia mà người chạy không thấy; trên Home PC đây là tình trạng thật hiện nay, cùng loại hậu quả với DR6-58 (lượt 1 chấm Low) → Low.
- **Đề xuất:** đọc mọi thư mục `~/.claude*` có `projects\` cùng `CLAUDE_CONFIG_DIR`, khử trùng theo `fs.realpathSync.native` (sửa luôn CL2-F4), in đủ danh sách; giữ hàm thuần: `projectRoots(env, home, names)` nhận tên các mục của home (≈ 5 dòng SP + 2 ca `retro-core.test.mjs`); README dòng 24 nói cách chọn thư mục (cùng CL2-F6).

## 6. Bloat và hiệu năng

### 6.1 Bloat (toàn codebase)

Số của gói A–E lấy từ báo cáo lượt 2 của chính Claude các gói đó (cùng SHA, cùng máy), không đo lại; gói F đo phần của mình và các phép toàn repo.

| Đã chạy / đo | Trên | Kết quả (lượt 2 so lượt 1 Home PC) | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | mọi package + app + `e2e` (hai cờ bật sẵn ở `tsconfig.base.json:12-13`, `pnpm typecheck` trong `pnpm verify` xanh ở SHA ghim — `common\baseline.md`); gói C, D chạy tạm lệnh cho `packages/ai`, `packages/ui`, app: exit 0, 0 dòng; `tools/*.mjs` qua ESLint `no-unused-vars` (`pnpm lint`) | 0 biến / tham số thừa (như lượt 1) | — |
| Export không có nơi dùng ngoài file (`r1\exports-f.mjs` của lượt 1 chạy lại → `F\exports-f.log`, 59 dòng; gói A–E: scanner của từng gói) | `tools/`, `e2e/` helper, hook, `ui/scripts`; A–E: `packages/*`, app | F: chỉ seam test của `*-core.mjs` và hằng / kiểu dùng trong file như lượt 1; mới của đợt sửa: `VERIFY_CHECK` (test hợp đồng với `ci.yml` dùng), `prFiles`, `testedBaseOf`, `verifyRunId`, `projectRoots` đều có nơi dùng SP. A–E: export runtime mới của đợt sửa đều có nơi dùng SP; còn lại là DR6-66 (KNOWN, hoãn), không có bằng chứng mới | — |
| Code lặp nguyên thân hàm ≥ 25 token (`r1\dup-scan.mjs` → `F\dup-scan.log`) | 195 file SP (lượt 1: 194), 993 thân hàm (952) | **2 nhóm, như lượt 1**, đều KNOWN: hook `resolve` của `tools/eval-ai.mjs:18` ≡ `tools/load-data.mjs:20` (#566); `plain` `appointment-form.ts:128` ≡ `trash-view.ts:48` (#543) | — |
| Code lặp theo cấu trúc ≥ 35 token (`r1\dup-scan-struct.mjs 35` → `F\dup-scan-struct-35.log`) | như trên | 9 nhóm (lượt 1: 8): `update<X>Row` ×4, `list<X>` ×3, `restore<X>` ×3, `analysesOf / notesOf / factsOf` ×3, `resolve` ×2, `isCustomerLive / reviewsLiveAppointment` ×2, `toggle` ×2 như lượt 1; `remove` ×5 nay tách 3 + 2 (hai hộp Xóa của gói D đổi ở #636 — `retriesDelete`). Cùng họ DR6-67 (KNOWN, hoãn). Port luật key Rust → JS ở `eval-ai-core.mjs` (`readings` / `unescape` / `reveals` / `mask`, ≈ 80 dòng, #642) là lặp khác ngôn ngữ có chủ ý (Issue #605 đòi "cùng luật của Rust"), có test riêng; hai bản phải sửa cùng nhau (CL2-F1 / CL2-B4) | (CL2-F1) |
| Cấu thành bundle theo package (`r1\bundle\split-build.mjs` chạy lại, `vite build` của repo ra `F\bundle\out\`, một chunk mỗi package / dependency → `F\bundle\split-build.log`) | bản build web ở SHA ghim, không biến môi trường | Tổng JS + CSS **2 385 800 B** (lượt 1 2 367 844, **+17 956**; gzip 709 201, +5 024). Phần tăng: `app-routes` +6 447 (196 424), `app-i18n` +3 619 (70 004), `pkg-db` +3 371 (53 587), `app-data-shell` +1 630 (21 341), `pkg-db-migrations` +1 390 (0009 / 0010), `pkg-ai` +543, `pkg-domain` +304, `pkg-ui` +262, `pkg-db-seed` +240, `dep-drizzle-orm` +124, `index.css` +26. **Mọi dependency khác byte-for-byte như lượt 1** (`react-dom` 207 089, `zod` 89 716, `sql.js` 39 781, `tanstack` 35 611, `tauri-api` 15 114, `react` 11 751, ECharts 512 882, nhóm `other-node_modules` (exceljs) 931 625). Khớp Δ của `baseline.md` (`index.js` +17 727, khác vì cách chia chunk) | — |
| Dependency khai báo | `git diff 8855345 4217ed4` trên mọi `package.json`, `pnpm-lock.yaml`, `Cargo.toml`, `Cargo.lock` | chỉ phiên bản `1.0.0` và `crate-type = ["rlib"]` (DR6-13): không thêm / bớt dependency | — |
| Exe | `common\baseline.md` | 5 404 672 B (Δ −9 728 so nền, chỉ khác phiên bản / `crate-type`); tách theo crate cần `cargo-bloat` (G4, chỉ đề xuất) | — |
| Mã lỗi ↔ câu i18n (`r1\p9-error-keys.mjs` → `F\p9-error-keys.log`) | `DB_ERROR_CODES` (59, lượt 1: 55), `AI_ERROR_CODES` + `AI_LOCAL_ERROR_CODES` (11) ↔ `vi.ts` | 4 mã mới (`INVALID_CHOICE`, `TRANSITION_BEFORE_MEETING`, `STAGE_KEPT_BY_MEETING`, `STAGE_NOT_ON_DAY`) có câu; thiếu đúng 5 mã như lượt 1, mỗi mã có đường hiện riêng | — |
| Khóa i18n (gói D) | `vi.ts` ↔ app | 1 113 khóa (+33), 0 khóa không dùng, 0 khóa chỉ test dùng | — |
| Cỡ dòng (`node tools/size-report.mjs --compare`, `common\baseline.md`) | 6 gói | F: SP 3 939 (+178), test 12 417 (+1 519); toàn repo SP 33 788 (+1 572), test 41 633 (+3 642) | — |
| `pnpm lint:deps` | `baseline.md` | 0 vi phạm (315 module, 1 277 phụ thuộc; lượt 1: 309 / 1 244) | — |

Đề xuất refactor bloat: không có đề xuất mới ở gói F. Của các gói: CL2-A6 (≈ −15 dòng, luật D7 mở rộng viết ba lần) — gộp khi chạm file; DR6-25 / 66 / 67 vẫn hoãn (KNOWN). Công cụ nên có (G4, chỉ đề xuất): visualizer bundle, `cargo-bloat`.

### 6.2 Hiệu năng (toàn codebase)

**Máy, lúc đo:** Home PC `DESKTOP-KDURKJP` (i9-12900K), Node v24.20.0. Mốc so (plan §L2.6, Home PC): `common\perf\perf-ref-r1.json` qua bảng `common\baseline.md` (exe), số lượt 1 Claude F **Home PC** (`docs/reviews/raw/2026-10-15/home-pc/claude/F.md` §4b, cùng máy, `8855345`) và tổng hợp lượt 1 §7.1 cột Home PC. Không so nền T-219 (laptop). Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms. Ngưỡng: `docs/metrics/phase-6.md` (màn < 200 ms; Phase 4: `importBackup` ≤ 1,1 s, `listAppointments` ≤ 65 ms, `teamCompare` / `reportRows` ≤ 15 ms, `monthGrid` ≤ 2 ms, `countRecords` ≤ 15 ms).

**A. Bảng hàm thuần trong Node** (`node --expose-gc p08-node-perf.mjs`, log `F\p08-node-perf.log`; lần chạy có số 17:17:09–17:17:27, CPU trước khi chạy 1–5 %). Cùng phép đo, cùng thứ tự với `p5-perf.mjs` lượt 1 Home PC, thêm phần của `p3-node-table.mjs` lượt 1 laptop và `listTrash` theo số KH xóa. Phiên làm tiếp sửa 3 lỗi của chính probe trước khi có số (không đổi phép đo): `renameTeam(db, id, newName)` nhận chuỗi; `readTables` đọc lười nên phải chạm đủ 6 getter (bản đầu ra 0,00 ms); `Database.export()` thay `sqlite.export()` thô (bản thô đóng statement đã cache → `Statement closed`). Dữ liệu tải lượt 2 nhập bằng `importBackup`: 1 481 KH sống, 10 255 lịch, 1 674 HĐ, 4 884 chuyển nhóm, 51 nhân sự, 4 team, Thùng rác 113 dòng; hôm nay 12/10/2026. Trung vị (min–max).

| Hàm (Node) | n | Lượt 2 | Lượt 1 Home PC (Claude F / Codex F; tổng hợp lượt 1 §7.1) | Ngưỡng | So lượt 1 |
|---|---:|---|---|---|---|
| `importBackup` (15 676 559 ký tự) | 5 | 731,1 ms (718,5–834,6) | 710 / 729 | ≤ 1 100 ms ✅ | +3 %, trong nhiễu |
| `listAppointments` (10 255 lịch) | 7 | 44,7 ms (43,7–46,0) | 46,5 / 47,7 | ≤ 65 ms ✅ | — |
| `teamCompare` năm / tháng | 7 | 2,95 / 1,46 ms | 3,5 / 2,1 | ≤ 15 ms ✅ | — |
| `reportRows` năm / tháng · Toàn bộ | 7 | 7,51 / 5,93 ms (max 11,0 / 7,2) | 10,4 / 6,5 | ≤ 15 ms ✅ | — |
| `monthGrid` tháng | 7 | 0,77 ms | 1,0 / 0,64 | ≤ 2 ms ✅ | — |
| `countRecords` | 7 | 5,02 ms | 4,8 / 4,9 | ≤ 15 ms ✅ | +0,2 ms |
| `listTrash` dữ liệu tải (113 dòng; lượt 1: 117 dòng) | 7 | 20,95 ms | 48,7 / 45,6 | màn < 200 ms ✅ | ×2,3 nhanh hơn (DR6-44) |
| `listTrash` +75 / +100 / +150 / +300 / +400 / +600 / +1 200 KH xóa (188 / 213 / 263 / 413 / 513 / 713 / 1 313 dòng) | 7 | 26,7 / 26,7 / 31,5 / 43,4 / 52,1 / 68,2 / 115,9 ms | Home PC +100 → 211, +400 → 815; laptop 75 → 197, 150 → 368, 300 → 703 | màn < 200 ms ✅ | DR6-44: ×7,9 (+100), ×15,6 (+400) |
| `readTables` 6 bảng (mỗi revision, đọc đủ 6 getter) | 15 | 67,2 ms (64,9–68,1) | `tables()` 80,6 (gói B lượt 1) | — | — |
| Một lệnh ghi + đọc lại đủ 6 bảng (`app.run(renameTeam)` + `app.tables()`; không storage nên không `export`) | 15 | 66,9 ms (65,7–69,5); riêng lệnh ghi 0,19 ms | laptop 84,5 | màn < 200 ms ✅ | — |
| `Database.export()` (bytes lưu sau mỗi lệnh ghi) | 9 | 1,90 ms (1,56–7,65) | — | — | — |
| `exportBackup` (JSON) | 5 | 170,4 ms (169,1–175,6) | — (chỉ laptop đo) | — | — |
| Phần AI của hồ sơ KH (KH nhiều phân tích nhất / 95 KH một lượt) | 20 / 3 | 0,37 / 28,7 ms | 0,42 / 36,8 | < 200 ms ✅ | — |
| Bộ nhớ: 8 lần `readBackup` + `importBackup` (`rss` / `heapUsed` / `arrayBuffers` MB) | 8 | 502–506 / 55,6–55,9 / 40–42, không tăng | laptop 478–489 / 63,4–63,5 | — | không rò |

Không hàm nào xấu hơn lượt 1 cùng máy theo luật nhiễu (> 20 % và > 10 ms); mọi hàm trong ngưỡng Phase 4.

**B. Exe release** (`common\exe\project2c.exe` bản chép ở `F\exe\<ca>\`, cổng debug 9348, profile WebView2 riêng, DNS chặn mọi host ngoài máy, `window.open` thay ngay; cửa sổ đặt "luôn trên", không kích hoạt — `F\topmost.ps1`, `e2e/perf/README.md` bước 4; cách đo `timeInPage` của `probe.perf.ts`: bấm → khung hình kế tiếp; "ngắt" = bấm hẹn giờ trong trang, ngắt CDP, nối lại đọc số — cách probe đo lệnh ghi). Exe chạy 17:19:17–17:21:26 (K6), 17:33:57–17:35:18 và 17:36:09–17:36:44 (K11).

| Đo | Trên | Lượt 2 (trung vị, 5 lần) | Mốc cùng máy / ngưỡng | ID |
|---|---|---|---|---|
| Probe `e2e/perf` của bước chuẩn bị (không đo lại) | `common\baseline.md`, dữ liệu tải | mọi thao tác trong ngưỡng; 7 dòng ⚠️ so lượt 1 (6 `reload.*` +62…+67 ms, `app.open-data` 301 so 189 ms) | `perf-ref-r1.json`; ngưỡng `phase-6.md` ✅ | CL2-B7 (gói B quy nguyên nhân: `quick_check` + file lớn hơn 4,6 %) |
| Mở lần đầu (cách T-227, không đo lại) | `baseline.md` | LCP 3 526 ms | xấu hơn khi > 4 724 ✅ | — |
| `trash.open` theo cỡ Thùng rác, **gắn DevTools** (cách probe đo) — K6 | dữ liệu tải + 0 / 150 / 600 / 1 200 KH xóa (113 / 263 / 713 / 1 313 dòng) | 74,8 / 126,5 / **264,9** / **450,8** ms | `baseline.md` 73 ms (113 dòng), lượt 1 80 ms; < 200 ✅ tới 263 dòng, ❌ từ ≈ 510 dòng | CL2-F7; (CL2-E7) |
| `trash.open`, **đã ngắt DevTools** (người dùng thật) — K6 | như trên | 31,6 / 48,3 / 87,6 / 138,3 ms | < 200 ✅ tới 1 313 dòng (ngoại suy ≈ 2 000 dòng) | CL2-F7; (CL2-E7) |
| 3 thao tác không chạy SQL, gắn / ngắt — K11 | dữ liệu tải | `appointments.period-year` 16,4 / 15,1 · `customers.view-table` 13,7 / 14,7 · `reports.filter-year` 7,9 / 7,2 ms | `baseline.md` 17 / 19 / 9 ms ✅ | — |
| Mở dữ liệu khi tải lại (`p2c:data-open` của tài liệu mới), gắn / ngắt — K11 | dữ liệu tải | 235,7 / 221,1 ms (+6,6 %) | `reload.settings` 247 ms (`baseline.md`), < 500 ✅ | — |
| `app.open-data` lần mở **đầu tiên của một profile WebView2 mới** (CDP gắn từ đầu) | 5 lần mở (4 cỡ Thùng rác + `exe-reload`) | 383 / 393 / 406 / 406,6 / 408 ms → trung vị 406 ms | ≤ 600 ✅; không cùng cách `baseline.md` (mở lại cùng profile: 301 ms) | — |

- **Cờ `app.open-data`** (`common\known.md:177`, mục OPEN "Cờ đo cho lượt 2": lượt 1 Codex Home PC 279 so 188,5 ms, "cùng exe, khác profile WebView2"): cùng exe, cùng dữ liệu tải, máy này đo được ba mức — mở đầu của profile mới ≈ 406 ms, mở lại cùng profile 301 ms (`baseline.md`), tải lại trang 221–236 ms. Chênh lớn nhất nằm ở trạng thái profile WebView2 (lần đầu của profile), phần còn lại so lượt 1 là `quick_check` của DR6-06 (CL2-B7). Mọi mức ≤ 600 ms.
- **DevTools gắn chỉ phóng đại `trash.open`** (×2,4–3,3, phần tăng theo số dòng ≈ phần `listTrash` chạy nhiều câu SQL nhỏ): các thao tác không chạy SQL lệch ±1 ms, mở dữ liệu khi tải lại +6,6 %. Nên 7 dòng ⚠️ của `baseline.md` không do cách đo (hai lượt cùng đo gắn); còn cột `trash.open` của probe và CL2-E7 mô tả số khi gắn DevTools → CL2-F7.

**C. Tổng hợp số của cả lượt 2 (Claude, cùng máy Home PC, cùng SHA):**

| Vùng | Số chính (lượt 2) | So mốc cùng máy / ngưỡng | ID |
|---|---|---|---|
| Exe, probe `e2e/perf` (`common\baseline.md`, bước chuẩn bị) | mọi thao tác màn ≤ 73 ms (lớn nhất `trash.open`, lượt 1 80); `backup.read` 814 ms, `backup.import` 43, `backup.export` 422, `db.save` 147, `reports.export-excel` 27, `appointments.next-month` / `-year` 99 / 106; JS heap 16,5 MB | trong mọi ngưỡng `phase-6.md`; **7 dòng ⚠️ so lượt 1**: sáu `reload.*` +62…+67 ms (+21…+37 %), `app.open-data` 301 so 189 ms — gói B quy cho `quick_check` của DR6-06 (60,5–63,5 ms đo trong WebView2) + file lớn hơn 4,6 % (chỉ mục 0009); vẫn < 500 / ≤ 600 ms | CL2-B7 (Nit: ghi mốc mới) |
| Mở app lần đầu (exe, cách T-227) | LCP 3 526 ms, `p2c:demo-seed` 2 940 ms (`baseline.md`) | mốc xấu hơn khi > 4 724 ms ✅; K15 | — |
| Gói A (Node, lệnh) | mọi lệnh ≤ 0,8 ms trung vị; `listTrash` 15 / 100 / 400 KH xóa 23,4 / 31,6 / 59,2 ms (lượt 1 Home PC 43,9 / 211,2 / 814,8) | DR6-44 ✅ | — |
| Gói B (Rust / exe) | `storage::save` 10 ms / 14 MB; `quick_check` / `integrity_check` 60–63 / 92–94 ms trong WebView2 | `db.save` ≤ 400 ✅ | CL2-B7 |
| Gói C (AI) | phần AI hồ sơ 0,36 ms / KH; `validateOutput` 2,8 ms | ✅; **Mock trích xuất ghi chú một dòng dài: 18 003 ký tự 570 ms, 72 003 → 8,8 s** (bản `8855345`: 1–7 ms) | CL2-C4 (Low, hồi quy của DR6-19) |
| Gói D (bản web, dữ liệu tải) | mọi thao tác ≤ 35 ms trung vị (max 75,8); `countCustomerRecords` ×18 nhanh hơn | ✅ | — |
| Gói E (Node / bản web) | mọi thao tác màn ≤ 88 ms; Thùng rác bản web 113 / 263 / 413 / 713 dòng: 83 / 137 / 172 / **269 ms** (có DevTools) | 263 dòng ×3,5 nhanh hơn khi có chỉ mục; **> 200 ms từ ≈ 500 dòng** khi gắn DevTools; exe không DevTools 138 ms ở 1 313 dòng (bảng B) | CL2-E7 (Low), CL2-F7 |
| Gói F (Node + exe) | bảng A: mọi hàm thuần trong ngưỡng Phase 4, không dòng nào xấu hơn lượt 1 cùng máy; bảng B: `trash.open` 113 → 1 313 dòng 74,8 → 450,8 ms gắn DevTools, 31,6 → 138,3 ms ngắt; 3 thao tác không SQL ±1 ms; mở dữ liệu khi tải lại +6,6 % khi gắn | DR6-44 ✅; ngưỡng ✅ trừ `trash.open` theo cách đo của probe từ ≈ 510 dòng | CL2-F7 (Nit) |

Phát hiện P của gói F: chỉ CL2-F7 (Nit, cách đo của probe). Không có phát hiện P mức Low trở lên ở gói F; phát hiện P của cả lượt (Claude): CL2-C4 (Low, hồi quy của DR6-19 trên ghi chú suy biến), CL2-E7 (Low), CL2-B7 (Nit), CL2-F7 (Nit).

## 7. Bảng đếm mức × trục

### Gói F

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | CL2-F8 | CL2-F2* | | CL2-F1 | | | | | 3 |
| Nit | | | CL2-F4, CL2-F6 | | | CL2-F3 | CL2-F7 | | CL2-F5 | | 5 |
| **Tổng** | 0 | 0 | 3 | 1 | 0 | 2 | 1 | 0 | 1 | 0 | **8** |

\* CL2-F2 gắn D + E, đếm một lần ở trục chính D. Tình trạng: 6 CONFIRMED (F1, F2, F5, F6, F7, F8), 1 PLAUSIBLE (CL2-F3: hành vi code chạy được với `gh` giả, phần "GitHub trả tối đa 250 commit, mới nhất" lấy từ tài liệu REST, chưa gọi GitHub), 1 KNOWN có bằng chứng mới (CL2-F4, nay có log). Tỉ lệ PLAUSIBLE 1 / 8, ở công cụ, không đụng sản phẩm. Trục R (mục 2): 7 / 7 ĐÃ SỬA. "Mới do đợt sửa": CL2-F2 (#614 / #615), CL2-F3, CL2-F4, CL2-F6 (#642); "có từ trước, phần sửa chưa phủ / lượt 1 bỏ sót": CL2-F1, CL2-F5, CL2-F7, CL2-F8. Phiên làm tiếp thêm CL2-F7, CL2-F8, sửa mô tả CL2-F3 và bằng chứng CL2-F4.

### Cả sáu báo cáo lượt 2 của Claude (A–F, để làm kết luận mục 11; không so với bên khác)

| Gói | Critical | High | Medium | Low | Nit | Trong đó PLAUSIBLE | KNOWN có bằng chứng mới | Bảng R |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| A | 0 | 0 | 0 | 4 | 2 | 0 | 0 | 12 / 12 ĐÃ SỬA |
| B | 0 | 0 | 0 | 5 | 2 | 0 | 0 | 10 / 10 ĐÃ SỬA |
| C | 0 | 0 | 0 | 5 | 2 | 0 | 0 | 8 / 8 ĐÃ SỬA |
| D | 0 | 0 | 0 | 5 | 3 | 0 | 0 | 12 ĐÃ SỬA · 1 SỬA MỘT PHẦN (DR6-62) |
| E | 0 | 0 | 0 | 5 | 3 | 0 (phần "exe không DevTools nhanh hơn" của CL2-E7 PLAUSIBLE ở gói E, nay CONFIRMED ở K6) | 0 | 15 / 15 ĐÃ SỬA |
| F | 0 | 0 | 0 | 3 | 5 | 1 | 1 | 7 / 7 ĐÃ SỬA |
| **Tổng** | 0 | 0 | 0 | **27** | **17** | 1 | 1 | **58 / 59 ĐÃ SỬA, 1 SỬA MỘT PHẦN** (DR6-01, 02, 04, 44 ghi ở nhiều gói, đếm một lần) |

Đếm lại từ khuôn của từng báo cáo (`Mức:` / `Tình trạng:` của mọi khối `ID: CL2-…` trong `claude\A.md` … `E.md`): A 6, B 7, C 7, D 8, E 8, F 8 = **44 phát hiện**, 42 CONFIRMED.

## 8. Đã xét, không thấy (gói F và phần xuyên gói)

- **R — đã sửa.** 7 DR6 của gói F (44 đo, 55, 56, 57, 58, 64, 65): tái hiện lượt 1 (cả hai máy, Codex lượt 1 cho DR6-56) chạy lại nay ra kết quả đúng; 81 đột biến "gỡ phần sửa" / áp lại lượt 1 trên `tools/*-core.mjs`: 74 bị giết, 7 sống (R55e, R58c tương đương; R57i, R57j phần I/O không có unit test theo `.claude/rules/tests.md` — `p04` / `p04b` chạy thật phần đó; L1-P4 tương đương như lượt 1; N3 chặt hơn cần; N5 chỉ chữ). Không HỒI QUY: `pnpm verify` 2 898 ở SHA ghim (`baseline.md`), cả bộ unit xanh dưới UTC−7 / UTC−10 / UTC+5:45; e2e 227 / 227 (`baseline.md`). Biến thể còn hở → CL2-F1 (55), CL2-F3 (57), CL2-F4, CL2-F6, CL2-F8 (58), CL2-F5 (65), CL2-F7 (44, cách đo). DR6-44 nhanh hơn mà kết quả không đổi (A, E; F đo Node + exe — mục 6.2).
- **E — biên.** Công cụ: PR 150 / 3 001 file, 251 commit sau tested base theo hai mô hình thứ tự, Verify không có link job, hai check Verify, PR xếp chồng, PR chỉ sổ ghi chú (K3); key ở 8 dạng (K1); `CLAUDE_CONFIG_DIR` 5 dạng + ba thư mục cấu hình (K8); bộ test 6 múi giờ (K7); lệnh dữ liệu tải 5 ngày neo × 8 seed (K10). Xuyên gói: hai máy lệch giờ (K2), qua tháng mới giữa xuất và nhập (K9), app 0.1.0 ↔ v1.0 (K5), demo sinh cho mọi ngày 17/10/2026 → 31/12/2027 + 29/02/2028, 31/12/2028, 01/01/2029 (K4), Thùng rác 113 → 1 313 dòng trên exe (K6). Ngoài CL2-F2 … F8 không thấy.
- **C — hợp đồng.** `ci.yml` (job Verify, notice `Tested base`) ↔ `VERIFY_CHECK` / `TESTED_BASE` của `pr-core.mjs` (test có sẵn) ↔ bước PowerShell chạy thật trên clone nông (cha thứ nhất đúng); `CLAUDE.md` bước 5 và `.claude/rules/ci.md` (#646) ↔ `mergeBlockers`: khớp; `CODE_DOCS` ↔ `paths` (test có sẵn, L1-P1 bị giết); eval script ↔ luật key của Rust (4 cách đọc như `ai.rs:337-349`, kể cả kẽ hở CL2-B4 → CL2-F1); `finish_reason` / `null` + `length` ↔ Rust (`ai.rs:246-272`) và luồng thử lại của app (K1, `p02`). Số Báo cáo ↔ Excel ↔ trước / sau xóa – khôi phục qua xuất / nhập ở ngày khác (K9: 0 / 209, 0 / 49). `seedDemo` của app ↔ probe K4 (`app-data.ts:228-231`: seed 1, DEMO_SCALE mặc định). Thấy: CL2-F6 (README của `retro.mjs`), CL2-F4, CL2-F8.
- **D — dữ liệu.** Xóa → xuất → nhập ở máy khác → khôi phục: về đúng như trước (K9); demo do app 0.1.0 nhập vào v1.0 được, chiều ngược bị chặn đúng (K5); demo của mọi ngày qua luật nhập backup (K4); dữ liệu tải 40 biến thể qua `importBackup` (K10); cổng merge không cho PR code chưa test cùng `main` mới (K3, trừ CL2-F3). Mở `Project2C-data\` do code lượt 1 ghi bằng exe lượt 2: gói B đã làm (K5 của `claude\B.md`: schema 9 → mở 512 ms, backup đúng file trước migration, lần lưu sau là schema 11) — không làm lại. Thấy: CL2-F2 (E20 phụ thuộc đồng hồ máy).
- **G — guardrail AI.** Gói F chỉ có script eval: đi đúng luồng `runAnalysis` / `runExtraction` của `@p2c/ai` (cổng → prompt → validator → một lần thử lại; `CUT_ANSWER` khi `length`, `p02`); key không vào file kết quả / `.partial` / log ở 5 dạng (K1). Không gọi dịch vụ AI thật (fetch giả). Thấy: CL2-F1.
- **S — ranh giới (CI / script / hook).** `ci.yml`: quyền chỉ đọc, `uses:` ghim SHA, bước mới chỉ đọc commit (`git cat-file`) và `throw` khi HEAD không phải commit gộp, không đổi gì từ lượt 1 ngoài bước đó; `pre-push`, hook `.claude`, `settings.json` không đổi (`git diff` rỗng). `merge-pr --dry-run` với `gh` giả: không lệnh ghi nào chạy (fake chặn mọi git ghi, không lần nào bị gọi). Đọc file PR: phân trang, đọc thiếu → chặn (S4); lỗi `gh` khi đọc `compare` → `pr-status` thoát 1 (đóng cổng, đọc code `pr-status.mjs:151-156`). Thấy: CL2-F3.
- **P — hiệu năng.** Mục 6.2: bảng hàm thuần Node (A), exe (B: K6, K11); không dòng nào xấu hơn lượt 1 cùng máy ngoài 7 dòng ⚠️ của `baseline.md` (gói B: CL2-B7). Thấy: CL2-F7 (Nit, cách đo của probe).
- **B — bloat.** Mục 6.1.
- **T — test.** 81 đột biến `tools/` (trên); e2e mới của đợt sửa (+≈ 1 000 dòng): quét mẫu yếu (`waitForTimeout`, `.catch(`, `skip` / `only`, `expect.soft`, `toBeGreaterThan(0)`, kiểm có điều kiện) — chỉ có `setTimeout(…, 1_000)` của ca phủ định "không đổi màn trong 1 s" (DR6-34, có chủ ý) và `\d+` ở số phiên bản KYC của snapshot; các gói D, E đã đột biến TSX trên bản dựng ngoài repo. `vitest.config.ts` (#644): hai vùng `coverage.include` mới (`i18n/index.ts` 100 %, `packages/ui/src/**` nhánh 92 — KNOWN #644 ghi lý do). Test múi giờ: CL2-F5. Coverage `tools/` không thuộc `coverage.include` (như lượt 1).
- **A — trợ năng / i18n.** Gói F không có màn; mã lỗi mới đều có câu i18n (`p9-error-keys`); câu in của `tools/` là cho người phát triển; hộp nhập backup của bản 0.1.0 có câu riêng cho `SCHEMA_TOO_NEW` (K5, `SettingsBackup.tsx:261` ở `8855345`). Phần xuyên gói: gói D, E (CL2-D3, D8, E3, E8).

## 9. Phụ lục

### 9.1 Probe, log (thư mục `C:\workspace\deep-review-1-6-r2\claude\F\`)

Probe Node nạp TypeScript của repo qua `hooks.mjs` (hook của lượt 1 gói F + `P2C_REPO` của gói A lượt 2; `@p2c/ui` → `ui-stub.mjs`; `LOAD` = file dữ liệu tải lượt 2), chỉ đọc repo ở SHA ghim, chỉ ghi trong thư mục này (nguồn đầy đủ trong từng file, giữ tới khi phát hành v1.0 theo `plan.md` §L2.10). Mã lượt 1 chạy từ `old-8855345\` (`git archive 8855345 tools packages/ai packages/domain packages/db/src packages/db/migrations apps/desktop/src e2e/perf`). Probe lượt 1 của chính Claude (Home PC) chép nguyên sang `r1\` (kèm log lượt 1 để so). Không gọi `gh` thật, không gọi dịch vụ AI, không đọc key, không mở chatgpt.com; exe chạy bản chép ở `exe\<ca>\`, cổng 9348, DNS chặn mọi host ngoài máy, `window.open` thay ngay.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `p01-eval-key.mjs` | `r1\p1-eval-key.mjs` (A–C) + 8 dạng key trong trả lời và trong 401, đếm trong file kết quả / log | `p01-eval-key.log` | DR6-55, K1, CL2-F1 |
| `p02-eval-cut.mjs` | ca emptyCut / unfinishedOuter của Codex lượt 1, mã ghim và `8855345` | `p02-eval-cut.log`, `.old.log` | DR6-56 |
| `fake-gh.mjs` + `p04-merge-gate.mjs` | `pr-status.mjs` / `merge-pr.mjs --dry-run` thật với `gh` giả, 9 kịch bản (`merge-gate\S*.json`, `S*.calls.log`) | `p04-merge-gate.log` | DR6-57, K3 |
| `p04b-merge-gate-250.mjs` (phiên làm tiếp; `fake-gh.mjs` thêm `compareLimit: 'newest'`, mặc định giữ như phiên 1) | S6a / S6b: 251 commit, `compare` trả 250 commit mới nhất như tài liệu REST | `p04b-merge-gate-250.log` | K3, CL2-F3 |
| `ci-notice\` | bước "Note the tested base" chạy trên clone `--depth 1` | (mục 2) | DR6-57 |
| `p03-retro.mjs` | `retro.mjs` thật trên home giả (`retro\home\`), 5 dạng `CLAUDE_CONFIG_DIR` (dòng "8.3" của log này hỏng đường dẫn — xem `p03b`) | `p03-retro.log` | DR6-58, K8, CL2-F4 |
| `p03b-retro-83.mjs` (phiên làm tiếp) | ca 8.3 có log: ShortPath của Scripting.FileSystemObject, so `realpathSync.native` | `p03b-retro-83.log` | K8, CL2-F4 |
| `p03c-retro-multi.mjs` (phiên làm tiếp) | ba thư mục cấu hình trên home giả (`retro\home-multi\`) | `p03c-retro-multi.log` | K8, CL2-F8 |
| `p06-stats.mjs`, `p13-stats-spec.mjs` + `pw-stats.config.mjs` | `markdownTable` nền 0; `stats.spec.ts` chạy bằng config riêng, bản ghim và bản `stats.ts` cũ đè tạm | `p06-stats.log`, `p13-stats-spec.log` | DR6-65 |
| `p11-tz.mjs` | `tables.test.ts` cũ đè tạm dưới LA; cả bộ vitest dưới 6 múi giờ | `p11-tz.log`, `p11-tz.out` | DR6-65, K7, CL2-F5 |
| `p09-e20-skew.mjs` | E20 qua hai máy lệch giờ, hai chiều + đối chứng | `p09-e20-skew.log` | K2, CL2-F2 |
| `p10-cross-version.mjs` | demo 0.1.0 ↔ v1.0 xuất / nhập (`data\r1-demo-*.p2cbackup`, `r2-demo-*`) | `p10-cross-version.log` | K5 |
| `p12-chain-month.mjs` | chuỗi bàn giao → kết quả + hẹn → AI → xóa KH → xuất 31/10 → nhập 01/11 → khôi phục → Báo cáo / Excel | `p12-chain-month.log` | K9 |
| `p05-seed-dates.mjs` | demo cho mọi ngày neo + luật nhập backup (worker) | `p05-seed-dates.log`, `p05-seed-dates-2026-10-17-2027-12-31.jsonl` | K4 |
| `p14-load-variants.mjs` | `buildLoadData` 5 ngày neo × 8 seed + `importBackup` | `p14-load-variants.log`, `.jsonl` | K10 |
| `p07-make-trash-dbs.mjs` | dữ liệu tải + N KH xóa trên lớp dữ liệu của app → `data\trash-<N>.db` | `p07-make-trash-dbs.log` | DR6-44, K6 |
| `exe-lib.mjs` + `topmost.ps1` (phiên làm tiếp: cửa sổ luôn trên, không kích hoạt) + `exe-trash.mjs` | exe release bản chép, `trash.open` gắn / ngắt DevTools theo cỡ Thùng rác | `exe-trash-0.log`, `exe-trash.log` | DR6-44, K6, CL2-F7 |
| `exe-readonly.mjs`, `exe-reload.mjs` (phiên làm tiếp) | 3 thao tác không SQL gắn / ngắt; mở dữ liệu khi tải lại gắn / ngắt | `exe-readonly.log`, `exe-reload.log` | K11, CL2-F7 |
| `p08-node-perf.mjs` (phiên làm tiếp sửa 3 lỗi của probe, ghi chú trong file) | bảng hàm thuần Phase 4 + phần thêm của lượt 1 laptop, `listTrash` theo N, bộ nhớ | `p08-node-perf.log` | mục 6.2 A |
| `mut.mjs` + `mut-list.mjs` | 81 đột biến (`mut-out\<id>.out`) | `mut.log`, `mut-results.json`, `mut-run.out`, bảng `mut-table.md` (9.2) | mục 2, 9.2 |
| `r1\exports-f.mjs`, `r1\dup-scan*.mjs`, `r1\p9-error-keys.mjs`, `bundle\split-build.mjs` | bloat (chạy lại script lượt 1) | `exports-f.log`, `dup-scan.log`, `dup-scan-struct-35.log`, `p9-error-keys.log`, `bundle\split-build.log` | mục 6.1 |
| `final-*.md`, `sec-*.md`, `r-merged.md`, `fin-*.md`, `assemble.mjs` | bản nháp các mục và lệnh ghép báo cáo (không phải bằng chứng) | — | — |

### 9.2 Đột biến (`mut.mjs`, 16:32–16:48: 81 cái, 74 KILLED, 7 sống)

Mỗi đột biến vá đúng một chỗ (mẫu phải khớp đúng một lần) của một file `tools/*.mjs` trong worktree, chạy `pnpm exec vitest run tools --bail=1` (275 test), sống thì chạy cả bộ vitest (2 898); trả nguyên byte trong `finally`, so sha256 với `git show HEAD:<file>` trước và sau; đầu ra từng cái ở `mut-out\<id>.out`. Tên test giết từng đột biến ở `mut.log`.

- **R (gỡ phần sửa, 24):** R55a–d, R55f, R55g, R56a–d, R57a–h, R58a, R58b → KILLED (20); **sống 4:** R55e (tương đương), R57i, R57j (I/O `pr-status.mjs`, không unit test theo quy ước; `p04` chạy chính phần đó), R58c (tương đương với đường dẫn tuyệt đối).
- **L1 (46 đột biến lượt 1 Home PC còn áp được):** P1–P8, P11–P24, P26, S1–S11, H1, H2, L1, L2, C1, C2, Z1, Z2, E2–E5 → KILLED 45, gồm P3, P5, S3, S9 (bốn cái sống ở lượt 1 → DR6-64); **sống 1:** P4 (tương đương, như lượt 1). P9, P10, P25, E1 của lượt 1 đánh vào dòng #642 đã viết lại → thay bằng L2-P9, L2-P10, L2-E1 trên dòng mới → KILLED (3).
- **N (mới, 8):** N1, N2, N4, N6, N7, N8 → KILLED; **sống 2:** N3 (commit không file coi là docs-only: code hiện chặn, an toàn hơn), N5 (`completion_tokens: 0` thành "không biết": chỉ chữ `+?` của file kết quả).
- Đè tạm file để "gỡ" phần sửa nằm ở test / `e2e/perf` (không thuộc `mut.mjs`): `apps/desktop/src/data/tables.test.ts` bản `8855345` (`p11-tz.mjs`) → đỏ 2 ca dưới UTC−7; `e2e/perf/stats.ts` bản `8855345` (`p13-stats-spec.mjs`) → `stats.spec.ts` đỏ 1 ca. Cả hai trả nguyên byte, sha256 = `HEAD`.

Bảng 81 đột biến (sinh từ `mut.log`; "giết" = có test đỏ — cột cuối là test đỏ đầu tiên; "sống" = `vitest run tools` và cả bộ 2 898 vẫn xanh):

| ID | Kết quả | Đột biến | Test đỏ / ghi chú |
|---|---|---|---|
| R55a | giết | DR6-55: an answer holding the key is no longer AI_BAD_RESPONSE | refuses an answer that holds the key, as it is or escaped, as Rust (DR6-55) |
| R55b | giết | DR6-55: server message masked only as it is (round 1 replaceAll) | masks the key and the session in URL and JSON escapes too, as Rust (DR6-55) |
| R55c | giết | DR6-55: no JSON-then-URL reading | refuses an answer that holds the key, as it is or escaped, as Rust (DR6-55) |
| R55d | giết | DR6-55: no URL-then-JSON reading | refuses an answer that holds the key, as it is or escaped, as Rust (DR6-55) |
| R55e | **sống** | DR6-55: the one-pass reading undoes JSON escapes only | cả bộ 2 898 xanh |
| R55f | giết | DR6-55: finish_reason holding the key passed on | passes finish_reason on as Rust: only a short word, never the key (DR6-56) |
| R55g | giết | DR6-55: overlapping finds masked twice | maps HTTP statuses as Rust does, with the server message and the key masked |
| R56a | giết | DR6-56: content null + length is AI_BAD_RESPONSE again | reads an answer cut before any content as an empty cut one, as Rust (R2-16) |
| R56b | giết | DR6-56: attempts graded as never cut | retries an answer cut before any content as the app does, then accepts (DR6-56) |
| R56c | giết | DR6-56: finish_reason not passed on | passes finish_reason on as Rust: only a short word, never the key (DR6-56) |
| R56d | giết | DR6-56: any finish_reason passed on unchecked | passes finish_reason on as Rust: only a short word, never the key (DR6-56) |
| R57a | giết | DR6-57: a green run with no tested-base notice passes | stops a green code PR whose CI noted no tested main (a run from before DR6-57) |
| R57b | giết | DR6-57: every file counted as read | takes a PR it could not read every file of as code (DR6-57) |
| R57c | giết | DR6-57: docs-only though not every file was read | takes a PR it could not read every file of as code (DR6-57) |
| R57d | giết | DR6-57: notes-only though not every file was read | takes a PR it could not read every file of as code (DR6-57) |
| R57e | giết | DR6-57: a short SHA taken as the tested base | is read from the notice of the Verify run, null without a whole SHA |
| R57f | giết | DR6-57: the first annotation taken whatever its title | is read from the notice of the Verify run, null without a whole SHA |
| R57g | giết | DR6-57: the first check with a link taken as Verify | comes from the Verify check of the head, by the job id in its link |
| R57h | giết | DR6-57: the run id taken instead of the job id | comes from the Verify check of the head, by the job id in its link |
| R57i | **sống** | DR6-57 (I/O): compare the other way round, base...tested (no unit test by rule) | cả bộ 2 898 xanh |
| R57j | **sống** | DR6-57 (I/O): PR files read without --paginate (no unit test by rule) | cả bộ 2 898 xanh |
| R58a | giết | DR6-58: CLAUDE_CONFIG_DIR ignored again | reads the config folder in use (CLAUDE_CONFIG_DIR) and ~/.claude, once each (DR6-58) |
| R58b | giết | DR6-58: the same folder read twice | reads the config folder in use (CLAUDE_CONFIG_DIR) and ~/.claude, once each (DR6-58) |
| R58c | **sống** | DR6-58: folders compared without resolve | cả bộ 2 898 xanh |
| L1-P1 | giết | docs-only ignores CODE_DOCS | treats a package CLAUDE.md as code: pnpm verify checks its codemap block (DR-74) |
| L1-P2 | giết | empty file list is docs-only | is false for an empty file list |
| L1-P3 | giết | any docs/state file needs no REVIEW (DR6-64) | still needs a REVIEW for another file under docs/state/ (DR6-64 P3) |
| L1-P4 | **sống** | empty file list needs no REVIEW | cả bộ 2 898 xanh |
| L1-P5 | giết | verdict PASS anywhere on the line (DR6-64) | stops on a verdict that only says PASS further on (DR6-64 P5) |
| L1-P6 | giết | REVIEW SHA not compared with head | stops when the PASS names another SHA than the head (P-1) |
| L1-P7 | giết | code PR without any CI check | stops a code PR with a failing, pending or missing check |
| L1-P8 | giết | pending checks allowed | stops a code PR with a failing, pending or missing check |
| L1-P11 | giết | package.json needs no exe build | stops a PR whose files need the exe build but that has no build-exe label (DR-09) |
| L1-P12 | giết | skipped exe check accepted | with build-exe, waits for the exe check and refuses it skipped |
| L1-P13 | giết | risk:med merged without --owner | still needs risk:low (or --owner) for a notes PR |
| L1-P14 | giết | review level ignored for risk | takes the higher level when the review raised it |
| L1-P15 | giết | stacked base merged anyway | stops when the base is another branch that is not merged yet |
| L1-P16 | giết | stacked PR squashed | asks for --merge when another PR is stacked on this branch |
| L1-P17 | giết | draft merged | stops on a draft |
| L1-P18 | giết | merge not pinned to the head | merges pinned to the head, then fetches |
| L1-P19 | giết | remote branch deleted though not the merged head | keeps a remote branch that moved after the merge |
| L1-P20 | giết | local branch deleted though not the merged head | moves the main checkout off a branch with unmerged commits but keeps the branch |
| L1-P21 | giết | task worktree removed though not at the merged head | keeps a clean task worktree and the local branch holding commits that were not merged (DR-22) |
| L1-P22 | giết | review worktree by prefix | matches Project-2C-review and Project-2C-review-N only |
| L1-P23 | giết | dirty main checkout switched | stops at a dirty main checkout and keeps the local branch |
| L1-P24 | giết | any push --delete failure counts as done | keeps any other failure of the remote delete a failure |
| L1-P26 | giết | stacked branch deleted | keeps the branch, local and remote, while another PR is stacked on it |
| L1-S1 | giết | REVIEW from anyone | ignores REVIEW comments from anyone without write access |
| L1-S2 | giết | first REVIEW instead of the last | returns the last REVIEW comment with its verdict, head SHA and level |
| L1-S3 | giết | one-character SHA (DR6-64) | takes no SHA of fewer than 7 hex characters: it would match many heads (DR6-64 S3) |
| L1-S4 | giết | skipped check counts as pass | counts passing, failing and pending checks |
| L1-S5 | giết | running check not pending | counts passing, failing and pending checks |
| L1-S6 | giết | HANDOFF changed since read: written anyway | refuses when the issue changed since the file was saved |
| L1-S7 | giết | base kept after the other machine wrote | is null when the other machine wrote between the edit and the fetch |
| L1-S8 | giết | HANDOFF max doubled | refuses above 9,000 characters |
| L1-S9 | giết | hook output cut against the whole limit (DR6-64) | cuts to the room left after a long header (DR6-64 S9) |
| L1-S10 | giết | several handoff issues accepted | fails when there are several, naming them |
| L1-S11 | giết | REVIEW level ignored | returns the last REVIEW comment with its verdict, head SHA and level |
| L1-H1 | giết | a bare #N is a PR | does not take an issue number for a PR |
| L1-H2 | giết | review anywhere in the prompt | needs review near the PR number |
| L1-L1 | giết | anchor after today allowed | refuses ["--anchor","2026-10-13"] |
| L1-L2 | giết | seed over 32 bits allowed | refuses ["--seed","4294967296"] |
| L1-C1 | giết | two start markers accepted | refuses a file with a missing, repeated or reversed marker |
| L1-C2 | giết | end before start accepted | refuses a file with a missing, repeated or reversed marker |
| L1-Z1 | giết | root files in no package | eslint.config.js → F product |
| L1-Z2 | giết | Rust tests counted as product | counts a Rust test module as test lines of the same file |
| L1-E2 | giết | result file overwritten | never overwrites a result or the part of a stopped run, before any call |
| L1-E3 | giết | reply body read without limit | stops reading a 32 MiB reply past 2 MB, with the code of Rust |
| L1-E4 | giết | redirects followed | posts what the Rust command posts, with its 120 s for the whole call |
| L1-E5 | giết | a key error does not stop the run | records an error and goes on, but stops on a key or limit error |
| L2-P9 | giết | main commits since the tested base never block (P9/P10/P25 on the new rule) | stops a code PR when main got code since the main its CI tested (DR-80) |
| L2-P10 | giết | docs-only main commits block too | stops a code PR when main got code since the main its CI tested (DR-80) |
| L2-E1 | giết | key not masked in server messages at all | maps HTTP statuses as Rust does, with the server message and the key masked |
| N1 | giết | tested base: no trim of the notice | is read from the notice of the Verify run, null without a whole SHA |
| N2 | giết | tested base: upper-case hex taken | is read from the notice of the Verify run, null without a whole SHA |
| N3 | **sống** | a commit with no file is docs-only (empty list) | cả bộ 2 898 xanh |
| N4 | giết | finish_reason up to 33 characters | passes finish_reason on as Rust: only a short word, never the key (DR6-56) |
| N5 | **sống** | tokens: 0 is not a count | cả bộ 2 898 xanh |
| N6 | giết | readings: never the escapes undone (plain only) | refuses an answer that holds the key, as it is or escaped, as Rust (DR6-55) |
| N7 | giết | mask: the key read at the wrong place (end of the escape lost) | masks the key and the session in URL and JSON escapes too, as Rust (DR6-55) |
| N8 | giết | cut: content null + any reason read as cut | reads an answer cut before any content as an empty cut one, as Rust (R2-16) |

### 9.3 Cuối phiên

- **Đếm transcript cho CL2-F8 / DR6-58** (chỉ tên file, không đọc nội dung): `foreach ($cfg in '.claude','.claude-b','.claude-c') { Get-ChildItem -LiteralPath "$env:USERPROFILE\$cfg\projects" -Directory | Where-Object Name -like 'C--workspace-Project-2C*' | ForEach-Object { (Get-ChildItem -LiteralPath $_.FullName -Filter *.jsonl -File | Measure-Object).Count } }` → `.claude` 71 + 1 + 4 = 76 (các thư mục khác 0), `.claude-b` 63 + 13 + 1 = 77, `.claude-c` 5 + 11 = 16; `$env:CLAUDE_CONFIG_DIR` của phiên làm tiếp = `C:\Users\<user>\.claude-c`.
- **Tác dụng phụ ngoài repo** (chỉ trong `…-r2\claude\F\`): bản chép exe + profile WebView2 + `Project2C-data\` của từng ca ở `exe\{trash-0,trash-150,trash-600,trash-1200,readonly,reload}\` (≈ 40 MB mỗi ca, exe tự backup một bản lúc mở); `data\` (4 file `trash-<N>.db` ≈ 14 MB, 2 file demo `.p2cbackup` ≈ 10 MB); `old-8855345\` (`git archive`); `retro\home\`, `retro\home-multi\` (home giả, transcript giả); `merge-gate\` (kịch bản `gh` giả); `ci-notice\` (clone nông); `bundle\out\` (bản dựng web tách chunk, phiên 1); `pw-stats-results\`. Không exe nào còn chạy (`Get-Process project2c` rỗng sau mỗi ca: đóng bằng `CloseMainWindow`, exit 0).
- **Trong repo:** phiên 1 vá tạm `tools/*-core.mjs` (81 đột biến), đè tạm `apps/desktop/src/data/tables.test.ts` và `e2e/perf/stats.ts` bằng bản `8855345`, mỗi lần trả nguyên byte và so sha256 với `git show HEAD:` (dòng cuối mỗi log: `git status --short after: ""`). Phiên làm tiếp không ghi gì vào repo (probe chỉ đọc; `p03b`, `p03c`, `p04b` in `git status --short after: ""`). Cache build / test bị ignore (`node_modules/.vite`, thư mục tạm của test) không tính.
- `git rev-parse HEAD` cuối phiên: `4217ed4cd3300af1d63aa61db9eb13902fe75f16` (= SHA ghim).
- `git status --short` cuối phiên: rỗng (như đầu phiên; `git -C C:\workspace\Project-2C-review status --short` lúc 17:50:12).
- **Giờ xong:** 2026-10-17 17:50 (+07:00, đồng hồ máy).

## 10. Bảng R gộp đủ 59 DR6 (Claude, A–F lượt 2)

Gộp từ bảng R của chính Claude ở `claude\A.md` … `E.md` (lượt 2) và mục 2 của báo cáo này. "Gói" là gói đã ghi dòng R (gói đầu là gói chính); "Gỡ sửa" đếm đột biến "gỡ tạm phần sửa" / áp lại đột biến lượt 1 của dòng đó (K = bị test giết, S = sống); chi tiết ở báo cáo của gói. Một DR6 nhiều gói: kết luận gộp là kết luận yếu nhất của các gói (ở lượt 2 mọi gói chấm giống nhau). Hai DR6 mà phần sửa đổi một hành vi trước đó đúng nhưng gói chính vẫn chấm ĐÃ SỬA (đường lỗi lượt 1 đã hết, có test đỏ khi gỡ sửa), hậu quả ghi thành phát hiện riêng: **DR6-04** — CL2-A1 (ghi bù cuộc gặp Đã gặp trước ngày tạo KH nay bị từ chối: luật K18 mâu thuẫn K2 / DR-43; nếu Owner giữ K2 thì đây là hồi quy), **DR6-19** — CL2-C4 (hồi quy hiệu năng chỉ với ghi chú một dòng rất dài, gói C chấm "suy biến"). Gói F giữ chấm của gói chính.

| DR6 | Mức L1 | Issue → PR | Gói | Kết luận gộp | Bằng chứng chính (lượt 2) | Gỡ sửa | Biến thể / phát hiện lượt 2 |
|---|---|---|---|---|---|---|---|
| 01 | M | #592 → #614 | A, E | **ĐÃ SỬA** | Dữ liệu tải: xóa → khôi phục ngay 4 249 / 4 249 cuộc gặp giữ nhóm (lượt 1: 2 690 / 4 254 bị chặn); màn: 60 / 60, 130 / 130 bản ghi về, 0 / 1 170 ô Báo cáo lệch | K 6 (A 4, E 2) | CL2-A4, CL2-A5, CL2-E2, CL2-F2 |
| 02 | M | #594 → #618 | A, D, E | **ĐÃ SỬA** | H2: lịch hôm nay và hẹn tiếp ở RE mới; 5c nói đúng số lịch chuyển; 6h / 6c lấy RE hiện tại; số Tổng quan ↔ Báo cáo ↔ Excel 0 lệch sau bàn giao (E K2) | K 7 · S 1 (R16) | CL2-A3 (test hở `previewHandover`) |
| 03 | L | #592 → #614 | A | **ĐÃ SỬA** | P1a / P1b không thêm chuyển nhóm; P5a chặn E20 đúng câu | K 2 | CL2-A5, CL2-E2, CL2-F2 |
| 04 | L | #593 → #616 | E, A | **ĐÃ SỬA** | S1 / S2, H·CL-E4, L·CL-E1 nay đúng; 7 503 cuộc gặp lưu nguyên 6f 0 lệch | K 8 · S 3 (R04g, N1, N2) | CL2-A1 (ghi bù trước ngày tạo KH bị từ chối, trái DR-43 / K2 — Owner chọn), CL2-E1, CL2-E4 |
| 05 | L | #593 → #616 | A | **ĐÃ SỬA** | `p10-manual-backdate` → `TRANSITION_BEFORE_MEETING`; bất biến dữ liệu tải 0 ca | K 4 | CL2-A6 (Nit, luật D7 mở rộng viết 3 lần) |
| 06 | L | #595 → #620 | B | **ĐÃ SỬA** | 382 trang ghi đè: 0 lọt; exe từ chối, không backup | K 4 | CL2-B1 (`quick_check` không thấy chỉ mục lệch bảng), CL2-B7 (chi phí `quick_check`) |
| 07 | L | #595 → #620 | B | **ĐÃ SỬA** | `FILE_IN_USE` / `ACCESS_DENIED` / đĩa đầy đúng câu, trên exe | K 10 · S 1 (G07d) | CL2-B2, CL2-B3, CL2-B6 |
| 08 | L | #595 → #620 | B | **ĐÃ SỬA** | lần lưu cuối schema 11 (lượt 1: schema 0) | K 1 | — |
| 09 | N | #595 → #620 | B | **ĐÃ SỬA** | 40 lần giết giữa backup: 0 `.tmp` còn lại; `%TEMP%` không tăng | K 2 | — |
| 10 | L | #596 → #617 | B | **ĐÃ SỬA** | key URL-encode rồi `%`: `AI_BAD_RESPONSE`, che `***` | K 4 | CL2-B4 (hai lớp cùng loại), CL2-F1 (cùng kẽ hở ở script eval) |
| 11 | L | #596 → #617 | B | **ĐÃ SỬA** | tên model sai → `AI_BAD_REQUEST` | K 2 | CL2-B5 (Nit, test hợp đồng tên model) |
| 12 | N | #596 → #617 | B | **ĐÃ SỬA** | exe `FileVersion 1.0.0`; `package.json`, `tauri.conf.json`, `Cargo.toml` 1.0.0 | K 1 | — |
| 13 | L | #596 → #617 | B | **ĐÃ SỬA** (Home PC: kiểm bằng `Cargo.toml` + `target`) | chỉ `rlib`, không `.lib` 186 MB; thời gian build không đo (plan §L2.4) | K 1 | — |
| 14 | N | #596 → #617 | B | **ĐÃ SỬA** | 9 lệnh `core:default` cũ "not allowed by ACL" trên exe; CSP chặn `base-uri`, `form-action` | K 2 | — |
| 15 | L | #598 → #628 | C | **ĐÃ SỬA** | S1–S3 lượt 1 → `discarded`; màn: phiên rời panel khi thay dữ liệu | K 2 · S 2 (R15b, R15d) | CL2-C7 (test hở) |
| 16 | L | #598 → #628 | C | **ĐÃ SỬA** | V1 đếm sau `\p{Cf}`; `LAW_NAME` mọi kiểu chữ đúng G5 | K 3 | CL2-C1 (V1 không còn trần chuỗi gốc), CL2-C3 (Nit, "kỉ / qui") |
| 18 | L | #598 → #628 | C | **ĐÃ SỬA** | seed / dữ liệu tải / snapshot `@2` | K 2 | — |
| 19 | L | #598 → #628 | C | **ĐÃ SỬA** | 4 câu lượt 1 → đúng | K 5 · S 1 (N19d) | CL2-C2 (người thân / con vật khác), CL2-C4 (hồi quy hiệu năng ghi chú một dòng dài) |
| 20 | L | #603 → #638 | C | **ĐÃ SỬA** | Hủy / Thử lại: focus ở chữ ghi chú (lượt 1: BODY) | K 1 (e2e) | — |
| 21 | L | #599 → #632 | C | **ĐÃ SỬA** | thấp nhất 4,81:1 mọi khối mờ | K 1 (e2e) · S 1 (R21c) | CL2-C5 (test hở khối AI lịch hẹn) |
| 22 | N | #598 → #628, #599 → #632 | C | **ĐÃ SỬA** | chữ "1 024 token", "200.000", `ai-eval.md:13` đúng | — | CL2-C6 (Nit, hướng dẫn còn "200 000") |
| 26 | L | #602 → #636 | D | **ĐÃ SỬA** | IS chỉ đánh giá → 9b tắt Xóa, câu riêng | K 3 | CL2-D2 (câu hướng dẫn không làm được với lịch Dời lịch / Dự kiến) |
| 27 | L | #597 → #623 | D | **ĐÃ SỬA** | 7b "6 tỷ" → dòng đọc lại; chữ tự do không | K 2 | CL2-D4 (Nit, đọc lại trên chữ chưa chuẩn hóa) |
| 28 | L | #597 → #623 | D | **ĐÃ SỬA** | 7d / 7c có mã F, 173 + 240 trường 0 lệch | K 3 | — |
| 29 | L | #597 → #623, #607 → #619 | D | **ĐÃ SỬA**; ô Kỳ: dòng ghi lệch có, khớp app | "tính 1 RF" = 5f = chỉ số 473 / 686 KH 0 lệch | K 3 | — |
| 30 | L | #597 → #623 | D | **ĐÃ SỬA** | exe 1 440: 3 cột 371 px | K 1 (e2e) | CL2-D7 (link dài tràn cột) |
| 31 | L | #602 → #636 | D | **ĐÃ SỬA** | điền sẵn RE góc nhìn; dòng báo ngoài góc nhìn | K 2 (e2e) | CL2-D6 (Nit, chưa có dòng nghiệm thu) |
| 32 | L | #602 → #636 | D | **ĐÃ SỬA** | e2e 111 RE / team | K 1 (e2e) | — |
| 33 | L | #602 → #636 | D | **ĐÃ SỬA** (hành vi); test giữ 3 / 6 phần | ô Ngày 7a, Giới tính, hai nút Xóa đúng | K 3 · S 3 (R33c–e) | CL2-D5 (test hở) |
| 34 | L | #603 → #638 | D | **ĐÃ SỬA** | exe, input thật Windows: 6 / 6 input bị chặn, hộp + chữ còn | K 5 | CL2-D6 |
| 35 | L | #603 → #638 | D | **ĐÃ SỬA** | focus `h1` + `document.title` mọi đường vào | K 6 | CL2-D3 (giữ vị trí cuộn), CL2-E8 (nút tự gỡ ở gói E) |
| 36 | N | #607 → #619 | D | **ĐÃ SỬA** (ghi lệch đã biết) | `nghiem-thu-v1.md:388-391`, khớp app | — | — |
| 38 | L | #600 → #634 | E | **ĐÃ SỬA** | giao thừa 5 hộp: ngày giữ năm cũ | K 2 · S 3 (R38c–e) | CL2-E5 (test hở phần nối ở 3 hộp) |
| 39 | L | #600 → #634 | E | **ĐÃ SỬA** | 415 KH: cuộc gặp gần nhất trống → không hiện | K 2 | — |
| 40 | L | #600 → #634 | E | **ĐÃ SỬA** | 8d so FYP nộp đang gõ | K 2 | — |
| 41 | L | #600 → #634 | E | **ĐÃ SỬA** | 8d bốn dòng tháng cũ / mới | K 7 | — |
| 42 | L | #600 → #634 | E | **ĐÃ SỬA** | 6c chuyển tới lịch mới | K 1 (e2e) | — |
| 43 | L | #601 → #630 | E | **ĐÃ SỬA** | sắp cột, `aria-label`, TR-5 sang ngày (e2e) | K 5 · S 1 (R43e) | CL2-E3 (Nit, tên nút trùng), CL2-E6 (Nit, test hở), CL2-D8 (Nit, `headerHidden` ở gói D) |
| 44 | L | #601 → #630 | E, A, F | **ĐÃ SỬA** | cùng kết quả; Node `listTrash` ×10,5 nhanh hơn ở 263 dòng (A), +100 / +400 KH xóa 26,7 / 52,1 ms so lượt 1 Home PC 211 / 815 ms (F); màn web ×3,5 (E); exe `trash.open` 263 dòng 126,5 ms gắn / 48,3 ms ngắt DevTools (F, K6) | K 2 (A) | CL2-E7 (Thùng rác vẫn tăng tuyến tính, TR-6), CL2-F7 (probe phóng đại `trash.open` ×2,4–3,3) |
| 45 | L | #601 → #630 | E | **ĐÃ SỬA** | một thông báo mỗi lúc | K 1 (e2e) | — |
| 46 | L | #597 → #623 | E | **ĐÃ SỬA** | "Năm 2026 · 01/01 – 15/09/2026" | K 1 (e2e) | — |
| 47 | N | #607 → #619 | E | **ĐÃ SỬA** (ghi lệch đã biết) | NT-TQ-06 theo golden, khớp `formatPercent` | — | — |
| 48 | N | #607 → #619 | E | **ĐÃ SỬA** (ghi lệch đã biết) | 7 điểm `nghiem-thu-v1.md:392-398` khớp app | — | — |
| 49 | L | #604 → #640 | A | **ĐÃ SỬA** | U+200B / NBSP / NFD / surrogate bị chặn ở lệnh + nhập | K 7 | CL2-A2 (ký tự vô hình ngoài `\p{Cf}`) |
| 50 | L | #604 → #640 | A | **ĐÃ SỬA** | mâu thuẫn 2 / `2.0` → luật 7 | K 2 | — |
| 51 | N | #604 → #640 | A | **ĐÃ SỬA** | `INVALID_CHOICE` / `INVALID_TRANSITION`… thay lỗi CHECK thô | K 2 | — |
| 52 | N | #604 → #640 | A | **ĐÃ SỬA** | CHECK `people_team_none` sau migration 0010 | K 1 | — |
| 54 | N | #607 → #619, #604 → #640 | A | **ĐÃ SỬA** (ghi chú golden) | ghi chú L-09 có, khớp app (RE phối hợp bị từ chối) | — | — |
| 55 | L | #605 → #642 | F | **ĐÃ SỬA** | trả lời chứa key → `AI_BAD_RESPONSE`, 0 lần trong file kết quả (lượt 1: 25); `%XX` trong thông điệp 500 bị che (lượt 1: 75 lần) | K 9 · S 1 (R55e, tương đương) | CL2-F1 (hai lớp cùng loại, như CL2-B4) |
| 56 | L | #605 → #642 | F | **ĐÃ SỬA** | `null` + `length` → thử lại, ACCEPTED sau 2 lần như app (lượt 1: `AI_BAD_RESPONSE`); JSON trong khối chưa đóng + `length` → thử lại | K 6 · S 1 (N5, chỉ chữ cột token) | — |
| 57 | L | #605 → #642 (+ #646) | F | **ĐÃ SỬA** | `pr-status` / `merge-pr --dry-run` thật với `gh` giả: re-run + code mới trên main → chặn; PR 150 file đọc đủ, 3 001 file → chặn; bước CI ghi đúng cha thứ nhất trên clone nông | K 12 · S 3 (R57i, R57j: I/O không unit test theo quy ước; N3: commit không file — code hiện chặn, an toàn) | CL2-F3 (Nit: `compare` một trang, > 250 commit) |
| 58 | L | #605 → #642 | F | **ĐÃ SỬA** | `retro.mjs` đọc `CLAUDE_CONFIG_DIR` + `~/.claude`, in thư mục đã đọc | K 2 · S 1 (R58c, tương đương) | CL2-F4 (KNOWN + 8.3), CL2-F6 (Nit, README), CL2-F8 (Low: thư mục cấu hình thứ hai bị bỏ) |
| 59 | L | #606 → #644 | A | **ĐÃ SỬA** | A-M31, M15, M10, N19 bị giết (lượt 1: sống) | K 4 | — |
| 60 | L | #595 → #620, #596 → #617, #606 → #644 | B | **ĐÃ SỬA** | RS4 / R8, RS9 / R7, RS7 / R4, A14, MJ15 bị giết | K 5 | J5 / MJ9, MJ30 vẫn sống (ngoài Issue, lượt 1 đã ghi lý do) |
| 61 | L | #598 → #628 | C | **ĐÃ SỬA** | C25 / C25b / C26, C74 / C75, V3 / V14 bị giết | K 8 | (CL2-B5) |
| 62 | L | #606 → #644 | D | **SỬA MỘT PHẦN** | X5, X6, D6, BR4 bị giết; `coverage.include` có hai vùng mới | K 5 · S 1 (BR3) | CL2-D1 (BR3 vẫn sống: Issue #606 không gồm BR3) |
| 63 | L | #606 → #644 | E | **ĐÃ SỬA** | CX-E4 ×5, AV8 bị giết | K 6 | — |
| 64 | L | #605 → #642 | F | **ĐÃ SỬA** | P3, P5, S3, S9 của lượt 1 nay bị giết; 45 / 46 đột biến lượt 1 còn áp được bị giết (P4 tương đương) | K 4 | — |
| 65 | N | #606 → #644 | F | **ĐÃ SỬA** | `tables.test.ts` cũ đỏ dưới UTC−7, mới xanh; cả bộ dưới UTC−7 2 898 / 2 898; `stats.spec.ts` đỏ khi gỡ sửa `stats.ts`; e2e chỉ quét `messages[*].content` | K 2 (tables cũ, stats cũ) | CL2-F5 (Nit: một test khác đỏ ở UTC−11) |

Đếm: **58 ĐÃ SỬA** (trong đó các phần "ghi lệch đã biết" của quyết định Owner — DR6-29 ô Kỳ, 36, 47, 48, 54 — dòng ghi có và khớp app), **1 SỬA MỘT PHẦN** (DR6-62: BR3 không thuộc Issue #606, CL2-D1), 0 CHƯA SỬA, 0 HỒI QUY. Mọi dòng có bằng chứng lượt 2 ở báo cáo gói (tái hiện lượt 1 chạy lại, hoặc dòng ghi lệch đối chiếu app); 54 dòng có đột biến / bản cũ đè tạm "gỡ phần sửa" bị test giết (cộng cột "Gỡ sửa": 195 lần giết, 23 lần sống — mỗi lần sống đã giải thích ở dòng của nó: tương đương, phần I/O không unit test theo quy ước, hoặc thành phát hiện T); 5 dòng không có phần code để gỡ (22, 36, 47, 48, 54: chữ / ghi lệch đã biết).

## 11. Kết luận cho v1.0 ở SHA `4217ed4` (Claude, tham khảo — kết luận thật ở phiên tổng hợp T-225)

**SẴN SÀNG** — phía Claude không còn gì chặn theo tiêu chí phát hành 3 của `docs/design/phase-6-hoan-thien.md:14` ("mọi phát hiện từ Medium trở lên đã sửa, phần còn lại Owner đã quyết"); phần "Owner đã quyết" cho 44 phát hiện Low / Nit mới của lượt 2 là bước còn lại (sửa / hoãn sau v1.0 / chấp nhận), không phải lỗi chặn.

Lý do:

1. **Không có Critical / High / Medium** trong sáu báo cáo lượt 2 của Claude (A–F: 0 / 0 / 0). Phát hiện mới: **27 Low + 17 Nit = 44**, 42 CONFIRMED, 1 PLAUSIBLE (CL2-F3, công cụ), 1 KNOWN có bằng chứng mới (CL2-F4). Hai Medium của lượt 1 đã sửa: DR6-01 — 4 249 / 4 249 cuộc gặp giữ nhóm trên dữ liệu tải khôi phục được ngay sau khi xóa (lượt 1: 2 690 / 4 254 bị chặn), màn 0 / 1 170 ô Báo cáo lệch; DR6-02 — bàn giao chuyển lịch Dự kiến sang RE mới, "Hẹn tiếp" / "Hẹn lần tiếp theo" lấy RE hiện tại, số Tổng quan ↔ Báo cáo ↔ Excel 0 lệch sau bàn giao; cả hai có test đỏ khi gỡ phần sửa. Các chuỗi nhiều bước mới qua nhiều gói của lượt 2 (gói F: K2, K4, K5, K6, K9, K10; gói A: K2, K5, K8; gói E: K2, K11…) không lộ lỗi mức Medium.
2. **Bảng R: 58 / 59 ĐÃ SỬA, 1 SỬA MỘT PHẦN** (DR6-62: đột biến BR3 vẫn sống vì Issue #606 không gồm BR3 — test hở, CL2-D1 Low), 0 CHƯA SỬA, 0 HỒI QUY. Hai chỗ phần sửa đổi hành vi ngoài ý đã thành phát hiện riêng: CL2-A1 (Low: ghi bù cuộc gặp Đã gặp trước ngày tạo KH nay luôn bị từ chối — luật K18 "nhóm của KH tại ngày cuộc hẹn" mâu thuẫn K2 / DR-43, Owner chọn) và CL2-C4 (Low: hồi quy hiệu năng của Mock trích xuất, chỉ với ghi chú một dòng rất dài).
3. **Cổng và số đo ở SHA ghim** (`common\baseline.md`): `pnpm verify` 2 898 test, `verify:rust` 101, e2e 227, build exe, coverage 99,03 % — xanh. Probe exe: mọi thao tác trong ngưỡng `phase-6.md`; mở lần đầu LCP 3 526 ms (mốc xấu hơn > 4 724 ms); 7 dòng ⚠️ so lượt 1 cùng máy đã quy được nguyên nhân (`quick_check` của DR6-06 + file lớn hơn, CL2-B7 Nit; không do cách đo — mục 6.2 B). Bảng hàm thuần Node không dòng nào xấu hơn lượt 1 cùng máy; DR6-44 nhanh ×7,9–15,6 trong Node, kết quả không đổi. Thùng rác vẫn tuyến tính theo số dòng (CL2-E7, Low): theo probe (gắn DevTools) vượt 200 ms từ ≈ 510 dòng, người dùng thật (không DevTools) 138 ms ở 1 313 dòng (CL2-F7).
4. **Owner nên quyết trước G7** (gom theo việc; chi tiết ở báo cáo từng gói):
   - Chạm quyết định Owner / spec: CL2-A1 (giữ DR-43 hay bỏ, G2), CL2-D2 (câu hướng dẫn 9b không làm được với lịch Dời lịch / Dự kiến), CL2-C2 (Mock trích xuất vẫn đề xuất điều nói về người thân / con vật khác).
   - Thao tác thường có hậu quả thấy được: CL2-C4 (trang đứng 0,5 s – hàng chục giây khi bấm AI trích xuất trên ghi chú một dòng rất dài), CL2-E1 (6f dời ngày cuộc gặp đã chuyển nhóm qua một lần đổi nhóm khác), CL2-D3 / CL2-E8 (cuộn / focus khi đổi màn, khi nút tự gỡ), CL2-D7 (link dài tràn cột), CL2-A2 (ký tự vô hình ngoài `\p{Cf}`), CL2-C1 (V1 không còn trần chuỗi gốc).
   - File / máy bất thường: CL2-B1 (`quick_check` không bắt chỉ mục lệch bảng: chọn `integrity_check` ≈ +30 ms hay ghi giới hạn), CL2-B2 (file DB chỉ đọc), CL2-B6, CL2-A4, họ E20 (CL2-F2 hai máy lệch giờ, CL2-A5 mốc không phần nghìn giây, CL2-E2 câu chặn — sửa chung bằng so `seq`).
   - Key (một luật hai nơi): CL2-B4 (Rust) + CL2-F1 (script eval) — hai lớp escape cùng loại.
   - Tài liệu / danh mục nghiệm thu G7: CL2-D6 (hành vi mới của đợt sửa chưa có dòng nghiệm thu), CL2-C6 (hướng dẫn sử dụng còn chữ "200 000"), CL2-B7 (ghi mốc mới vào `phase-6.md`), CL2-E7 + CL2-F7 (Thùng rác tuyến tính; dòng theo dõi theo cỡ, ghi cả số không DevTools).
   - Công cụ phát triển (không vào exe): CL2-F8 (Low: `retro.mjs` bỏ thư mục cấu hình thứ hai của máy), CL2-F3, CL2-F4, CL2-F6.
   - Test hở, không đổi hành vi: CL2-A3, B3, B5, C5, C7, D1, D5, E4, E5, E6, F5; chữ / trợ năng / bloat (Nit): CL2-A6, C3, D4, D8, E3.
5. **Ngoài phạm vi review, vẫn là điều kiện G7** (tiêu chí 2 và 4 của spec §1): eval AI thật sau đợt G5 (luật lượt này cấm gọi dịch vụ AI), exe trên một máy Windows sạch và nâng từ exe Phase 5, danh mục nghiệm thu của Owner. Phần lượt 2 đã chạm tới: exe ghim mở được dữ liệu schema 9 do code `8855345` ghi (gói B K5); backup của app 0.1.0 nhập được vào v1.0, chiều ngược bị chặn đúng `SCHEMA_TOO_NEW` (K5 của gói F); demo sinh được và qua luật nhập backup ở mọi ngày tới hết 2027 (K4).

Nếu Owner quyết xong các mục Low / Nit trên (phần sửa review phiên sạch như thường), phần Claude thấy không còn gì chặn v1.0 ở `4217ed4` hay ở SHA sửa sau đó.
