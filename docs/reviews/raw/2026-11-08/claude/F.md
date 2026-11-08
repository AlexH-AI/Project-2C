XONG — claude gói F lượt 6, 2026-11-07 20:32 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, gói F (Xuyên gói, bloat / hiệu năng, công cụ)

## 1. Phiên

- Bên: claude · gói: F · lượt 6.
- SHA đầu phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD`, worktree `C:\workspace\Project-2C-review`, detached).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-11-07 19:39 (+07:00), Home PC.
- Công cụ: Claude Code (app desktop, tab Code); model Claude Opus 5.5 (`claude-opus-5-5`); mức suy luận: max.
- Subagent (công cụ Agent, `general-purpose`, không fork; mỗi tin nhắn giao việc nêu đường dẫn đủ `C:\workspace\deep-review-1-6-r6\common\prompt-claude.md`, gói F, và bảo đọc quy tắc riêng 2–4 + phần chung trước; không subagent nào gọi subagent khác; probe ở `F\s<n>-…\`): **4 lần gọi**, cùng lúc ≈ 19:45, mỗi lần một subagent; không gọi thêm, không tiếp tục subagent nào bằng tin nhắn:
  - S1 — `opus` (Claude Opus 5.5), `xhigh`: đọc sâu `tools/**` (trừ `auto-wait*`), `.claude/hooks`, `.githooks`, `.github/**`, file cấu hình gốc, `packages/ui/scripts`; tìm lỗi mới, đột biến công cụ.
  - S2 — `opus`, `xhigh`: đọc sâu `e2e/**` và ba config Playwright; chỗ hở của e2e mới / đổi, flaky, `perf/stats.ts`, `guide/*`.
  - S3 — `sonnet` (Claude Sonnet 5.5), `xhigh`: mục Bloat toàn codebase (chạy lại script lượt 5) và đo hiệu năng chỗ nghi của diff (A/B xen kẽ với `37a80b6`).
  - S4 — `opus`, `xhigh`: chuỗi nhiều bước qua nhiều gói trên bản web / lớp dữ liệu của app.
  - Phiên chính tự làm: bảng R1 / R2 của gói F và bảng gộp, `tools/auto-wait*` và skill `auto-issues`, đo DR6-165 trên màn, kiểm lại mọi phát hiện của subagent trên code trước khi ghi.
- Bốn subagent xong (giờ ước theo thời lượng trong thông báo của app): S4 ≈ 20:04 (1 130 s, 111 lần gọi công cụ), S3 ≈ 20:05 (1 186 s, 98), S1 ≈ 20:13 (1 661 s, 164), S2 ≈ 20:24 (2 349 s, 219). Mọi phát hiện của chúng được phiên chính kiểm lại trên code (đọc lại và / hoặc chạy lại probe, đột biến) trước khi ghi; S1–S4 báo `git status --short` rỗng lúc xong.
- Bước 0: `F.md` chưa có → làm mới; `A.md`…`E.md` có đủ, dòng đầu đều `XONG`.

## 2. Bảng R

Cách làm chung của phần gói F (mọi file ở `C:\workspace\deep-review-1-6-r6\claude\F\`; Node v24.20.0 đặt đầu PATH ở mọi lệnh; repo không ghi byte nào):

- **Đột biến công cụ** (`mut6.mjs` + `mutant-config.mjs`, chép cách làm của Claude F lượt 5 `C:\workspace\deep-review-1-6-r5\claude\F\mut5.mjs`): hook `load` của Vite phục vụ bản đột biến của đúng một file cho vitest; chỉ tính KILLED khi có `[mutant] served` và có ca đỏ; sống ở test nhắm thì chạy lại cả bộ. Đối chứng: `auto-wait-core.test.mjs` + `notes-core.test.mjs` + `review-hint-core.test.mjs` **97 / 97** (`vitest-control-tools.log`).

### 2.1 Bảng R1 — phần gói F (6 dòng)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-165 (phần gói F: đo trên màn; mốc và số Node: `claude\C.md`) | #1052 → #1074 (tài liệu) | **ĐÃ SỬA** | Dòng tài liệu: `docs/metrics/phase-6.md:348-362` ("Mốc Mock trích xuất (DR6-165, T-370)": Q2 (a), ba số mốc ở `37a80b6` 28,5 / 103,5 / 53 ms so `2e51e25` 9,2 / 62,2 / 31, Home PC, Node v24.20.0, nguồn CLR5-C2, luật nhiễu so mốc này, ngưỡng < 200 ms giữ). **Số đo lượt 6 trên màn, cùng cách lượt 5** (probe của Claude C lượt 5 chép theo đường dẫn đủ vào `dr165\`: `p08-mock-long-note.mjs` với `SAME_PAGE=1`, `p18-first-click.mjs`; bản web ghim `web\dist-base` ở 127.0.0.1:4941; Edge, mạng ngoài 127.0.0.1 bị chặn, `window.open` thay; Home PC, Node v24.20.0): lần bấm AI trích xuất đầu của trang, ghi chú "độc thân" 4 503 ký tự, 5 trình duyệt mới: **71 / 64 / 48 / 49 / 46 ms, trung vị 49 ms** (mốc 53 ms; luật nhiễu: xấu hơn khi > 63,6 ms) (`dr165\p08-same-page-r6.log`; CPU 60 % lúc bắt đầu vì bốn subagent chạy song song, 12 % lúc xong; hai lần đầu cao nhất); ghi chú dạng seed, lần bấm 1 / 2 / 3, 5 trang: trung vị **38 / 34 / 33 ms**, trang đầu 53 ms (lượt 5: 40 / 34 / 33, trang đầu 49) (`dr165\p18-first-click-r6.log`) | Khớp mốc, trong luật nhiễu; dưới ngưỡng 200 ms. Số Node lượt 6 (gói C, xen kẽ với `37a80b6`): trong nhiễu. Không ghi phát hiện P |
| DR6-167 (phần gói F: `.dependency-cruiser.cjs`; cây thử và gỡ rule: `claude\C.md`) | #1047 → #1066 (+ #1080 → #1086) | **ĐÃ SỬA** (rule; phần còn hở → **CLR6-C5** của gói C, không báo lại) | `.dependency-cruiser.cjs:7` `TEST_FILES = '(\\.test\\.tsx?|/test-support\\.ts)$'`; rule `test-files-only-in-tests` (`:33-40`): `from: { pathNot: TEST_FILES }, to: { path: TEST_FILES }`, `comment` nêu DR6-167 / review #1066; `ai-only-on-domain-and-zod` (`:25-32`) dùng cùng hằng. `lint:deps` = `depcruise apps packages` (`package.json`): ở SHA ghim 0 vi phạm, 354 module / 1 582 dependency (`baseline.md`). Gói C dựng lại CXR5-C3 trên cây thử (file sản phẩm `apps/desktop/src` re-export `packages/ai/src/test-support.ts` → ghim báo, `37a80b6` không) và chặn 8 / 8 cạnh tới file test / test-support của mọi package | Gỡ phần sửa (bỏ rule) thì `lint:deps` vẫn xanh: không test nào giữ rule (Issue chốt test chấp nhận là probe ở thân PR) → CLR6-C5 (gồm cả import `vitest` từ file sản phẩm ngoài `ai` / `domain`). Phạm vi `depcruise apps packages` không gồm `tools/`, `e2e/`: hai thư mục này không phải code sản phẩm, đúng ADR-0006 |
| DR6-171 | #1052 → #1074 (tài liệu) | **ĐÃ SỬA** | (a) `docs/testing/nghiem-thu-v1.md:407`, mục "Ô chọn" của "Lệch mockup đã biết", nay nêu cả 7c và 7d: "Hộp 7c và 7d của `kyc-forms.html` không vẽ ô chọn mà vẽ hàng `.radio` … 7c hai hàng **Cập nhật** / **Đánh dấu mâu thuẫn**, mỗi hàng một câu mô tả riêng … Ở 7c, hai ô chọn có nhãn "Trường đã có giá trị" và một dòng help chung". Khớp app: `KycDialogs.tsx:154-164` (`Choices` nhãn `kycNote.mode`, help `kycNote.modeHelp`), `vi.ts:552-556` (chữ help trùng nguyên văn câu dẫn ở dòng 407); khớp mockup: `git grep -n 'class="radio' 5b1328a -- docs/design/mockups` chỉ ra `kyc-forms.html:241`, `:245` (7c, hai câu mô tả riêng `:243`, `:247`) và `:272`, `:276` (7d). (b) NT-AI-17 (`:219`) cột Ghi chú: "Mock chỉ đề xuất Tình trạng hôn nhân (Đã kết hôn, Độc thân, Ly hôn, Góa, Ly thân) và Số con (kể cả "<n> bé", trừ số con đã mất), theo luật ở §10" — khớp `phase-5-ai.md:375` (danh sách Hôn nhân, "con / bé", "<k> con / bé đã mất") | Kết quả mong đợi của NT-AI-17 không đổi. Sau T-375 (§10 thêm "đứa / thằng … đã mất" không tính Số con, `phase-5-ai.md:381`), chữ "trừ số con đã mất" vẫn đúng ý; ghi chú trỏ §10 nên không phải đổi theo |
| DR6-175 | #1051 → #1056 | **ĐÃ SỬA** | Bốn đột biến sống của Claude F lượt 5 (cùng chữ đổi như `mut5.mjs`) nay bị giết (`mut6.log`): **R156b** (`globMeetsFolder` `return true`, `tools/notes-core.mjs:207`) KILLED 1 đỏ `notes-core.test.mjs` "reads a glob against a folder note one folder at a time (DR6-156)"; **W15** (`waitFor` bỏ `failures = 0`, `auto-wait-core.mjs:332`) KILLED "counts only failed reads in a row: a good read between them starts the count again"; **W13b** (`titleRegExp` bỏ lookbehind, `:287`) KILLED "does not take a longer number for the PR asked for"; **H6** (`APP_BLOCK` tham lam, `review-hint-core.mjs:19`) KILLED "still reads the review brief and the Owner around those blocks". Lượt 5: cả bốn sống cả bộ 4 387 test | Biến thể gần: R156d (`>=` thay `>`) KILLED (cùng ca). Code của ba công cụ không đổi từ `37a80b6` ngoài phần T-369…T-383 ở dòng dưới (phần sửa DR6-175 chỉ thêm test: `notes-core.test.mjs` +3, `review-hint-core.test.mjs` +2, `auto-wait-core.test.mjs`) |
| DR6-176 | #1051 → #1056 (+ #1059 → #1061, #1083 → #1103) | **ĐÃ SỬA** | **Tái hiện lượt 5** (CXR5-F1, F07 của Codex F; `p-cxr5f1.mjs`, `p-cxr5f1.log`: cùng đầu vào cho `ciState` của `37a80b6` — bản chép byte từ git ở `old-37a80b6\tools\` — và của code ghim): rollup chỉ có check cũ xanh + run `workflow_dispatch` sau mốc: `37a80b6` `{"done":true,"code":0,"text":"CI green @abc1234: 1 pass"}` → ghim `{"done":false,…"no pull_request run of PR #941 since 2026-11-02T10:56:33Z yet"}`; + run `pull_request` của PR bị `cancelled`: `37a80b6` xanh mã 0 → ghim `{"done":true,"code":3,"text":"CI run 2 of PR #941 ended cancelled @abc1234"}`. **Gỡ phần sửa** (`mut6.log`): S01 (run mọi event tính là run của PR) KILLED 2, S02 (mọi nhánh) KILLED 1, S03 (đọc mọi check của head) KILLED 3, S04 (bỏ nhánh mã 3 của run không kết luận) KILLED 1, S05 (không chờ run sau mốc) KILLED 2, S06 (lấy run cũ nhất) KILLED 2, S07 (run xong mà head chưa có check của nó → xanh ngay) KILLED 1, S08 (`>` thay `>=` với mốc) KILLED 1, S09 (`runOf` không đọc được id) KILLED 3, S10 (`VERDICTS` nhận `cancelled`) KILLED 1 | Biến thể gần (`p-cxr5f1.log`): run `startup_failure` → mã 3; run `push` `failure` sau mốc → vẫn chờ run của PR; run của PR `success` mà rollup chỉ có check cũ → chờ "no check of run 2 yet" (`37a80b6`: xanh). Chạy cả `tools/auto-wait.mjs` trên bản chép với `session-io.mjs` giả (`aw-fake\`, không tiến trình `gh`, không mạng; `--once`): `ci 941 --since 2026-11-02T10:56:33Z` → mã 3 "CI run 2 of PR #941 ended cancelled", lệnh đọc runs đúng `actions/runs?head_sha=<head>&per_page=100` (`aw-fake\run.log`, `calls.log`) |
| DR6-177 | #1051 → #1056 (+ #1058 → #1077) | **ĐÃ SỬA** | **Tái hiện lượt 5 trên bản web** (CXR5-F2; `web\p-metrows.mjs`, `web\p-metrows.log`: bản dựng `web\dist-base` neo 15/09/2026 ở 127.0.0.1:4941, Edge chặn mạng ngoài 127.0.0.1 và thay `window.open` từ lần chạy đầu, đồng hồ trang ở sáng ngày neo như `e2e/fixtures.ts`; KH "Khách Đã gặp Gói F6" có lịch 20/09/2026 (Dự kiến) và lịch nhập bù 02/01/2026 (Chưa ghi kết quả), tạo qua 5a / 6b): kỳ Tuần, mới nhất trước: locator `37a80b6` (`filter({ hasText: 'Đã gặp' })`) đếm 12, `metRows` ghim 11 = số ô Trạng thái "Đã gặp" của DOM 11; dòng "đã gặp" đầu tiên của locator cũ là lịch **Dự kiến** của KH đó, chi tiết có **0** nút "Tạo lịch hẹn tiếp theo" (đúng CXR5-F2: probe dừng chờ nút), của `metRows` là lịch Đã gặp thật, **1** nút. Kỳ Năm 2026, cũ nhất trước (như `metYear`): cũ 82 (gồm dòng "Chưa ghi kết quả" của KH), ghim 81 = DOM 81. `getByRole('cell').nth(column)` trong `has` tính theo từng dòng (số ghim = số DOM ở cả hai kỳ) | Không có test cố định giữ phần sửa: probe là công cụ đo (chạy trên exe, ngoài CI), Issue #1051 chốt kiểm bằng spec tạm như thân PR #1056; probe tạm trên cho thấy bản gỡ sửa (locator cũ) chọn sai dòng → coi là test đỏ khi gỡ. Probe chạy trọn trên exe ở bước chuẩn bị (`baseline.md`: "Lịch năm 2026, 0 back: 79 met", 35 thao tác). Quét cùng mẫu (lọc dòng theo chữ trạng thái trên cả dòng; Grep `hasText: ['"/](Đã gặp|Dự kiến|Chưa ghi kết quả|Dời lịch|Không đến|Đã hủy)` trên `e2e/`): 15 chỗ ở spec e2e và bộ chụp ảnh (vd. `customer-appointments.spec.ts:16`, `customer-policies.spec.ts:17`, `dialog-keyboard.spec.ts:19`, `appointments.spec.ts:523`, `guide/shots.guide.ts:111`) — chạy trên seed demo cố định, không tên KH nào chứa chữ trạng thái, nên không sai; không ghi phát hiện |

### 2.2 Bảng R2 — phần gói F (7 dòng)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-371 | #1054 → #1075 (tài liệu) | **ĐÃ SỬA** | `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md`: §1 `:49` "Bảy mục chênh mức: CLR5-D1, CLR5-E3, DSR5-D2 Nit → Low; CXR5-A1, CXR5-C1, CXR5-C2, CXR5-F2 Low → Nit (§5.1)."; §2.2 `:108` "2 / 16 (D1, E3 lên) · 4 / 20 (A1, C1, C2, F2 xuống) · 1 / 5 (D2 lên)"; §11 `:605` "chênh mức bảy mục". Đếm lại bảng §5.1 (`:260-269`): đúng bảy phát hiện có mức chốt khác mức reviewer (CLR5-E3 ↑, CXR5-A1 ↓, CXR5-C1 ↓, CXR5-C2 ↓, CXR5-F2 ↓, CLR5-D1 ↑, DSR5-D2 ↑); CXR5-B1 "Bác", CXR5-A2, CLR5-F1 / F2 giữ mức | Không còn chữ "năm mục" / "chênh mức năm" trong file (`Select-String`) |
| T-372 | #1058 → #1077 | **ĐÃ SỬA** | `e2e/perf/probe.perf.ts`: chỉ còn một khai báo `status` (hàm `:200`, dùng ở `:394`, `:539`, `:543`); `metRows` (`:210-215`) dùng `header` (`:211-212`). Hành vi `metRows` kiểm ở dòng DR6-177 | Chỉ đổi tên biến: gỡ (đặt lại tên `status`) không đổi hành vi nào, ESLint không có luật `no-shadow` (`eslint.config.js`), nên không test nào đỏ được — đúng Issue (không cần test mới) |
| T-373 | #1059 → #1061 | **ĐÃ SỬA** | Test chấp nhận trên code: sàn `failure` ở `auto-wait-core.mjs:219-226` (nay đọc `newest`, T-378), ca "calls a failed run red even when the head shows no red check of it yet" (`auto-wait-core.test.mjs:364`, ba rollup). Tái hiện (`p-cxr5f1.log` V1): `--since`, run của PR `failure`, rollup chỉ có check cũ xanh → `37a80b6` "CI green … 1 pass" → ghim mã 1 "CI red @abc1234: run 2 failed, no red check of it yet". **Gỡ sửa:** F01 (bỏ sàn) KILLED 2 ca; F06 (sàn đặt trước bước nêu tên check đỏ) KILLED (ca "reads only the checks of that run…" đòi "CI red @abc1234: e2e") | Có check đỏ của run → vẫn nêu tên check (ca `:351-357`); `cancelled` / `startup_failure` → mã 3 (dòng DR6-176) |
| T-375 (phần gói F: rule chung test-support; phần Mock, câu dán trống: `claude\C.md`) | #1080 → #1086 | **ĐÃ SỬA** (phần còn hở → **CLR6-C5**, **CLR6-C6** của gói C) | Mục 3 của Issue trên code: một rule chung `test-files-only-in-tests` thay `ai-test-support-only-in-tests` (`.dependency-cruiser.cjs:33-40`, xem dòng DR6-167); gói C chạy cây thử: chặn ai → domain test, db → test-support, app → db test-support; `lint:deps` trên code 0 vi phạm (`baseline.md`) | Như DR6-167: không test nào đỏ khi gỡ rule (CLR6-C5) |
| T-378 | #1083 → #1103 | **ĐÃ SỬA** | Không `--since`: `newestRunOfPr(pr, all, null)` (`:128-137`, `since === null` bỏ lọc giờ), sàn theo `newest` (`:220`). Ba ca `describe('without since (a push after a fix)')` (`auto-wait-core.test.mjs:226`, `:230`, `:242`, `:253`). Tái hiện (`p-cxr5f1.log` V5): run `pull_request` mới nhất `failure`, rollup xanh → `37a80b6` xanh → ghim mã 1; V6: run PR `success` + run `push` `failure` mới hơn → xanh (không đỏ nhầm). **Gỡ sửa:** F02 (sàn chỉ khi `--since`, như T-373) KILLED; F04 (`newest` chỉ khi `--since`) KILLED; F05 (bỏ nhánh `since === null`) KILLED; S01 (run mọi event) KILLED ca "does not take a failed run of another event on the head for the PR" | — |
| T-379 | #1085 → #1104 | **ĐÃ SỬA** (mục "chạy thật" làm ở T-383) | (1) `ciState` `--not`: `readBranch(branch)` (`:166`), nhánh ở `H` → chờ push (`:167-169`), ở `X ≠ H` dưới `STALE_HEAD_MS` 3 phút → chờ (`:177`), từ 3 phút → mã 3 "PR head stale: branch at <X>, head still <H> (GitHub missed the push)" (`:171-176`); `heldFor` (`:308-314`). Tái hiện (`p-cxr5f1.log` V8): nhánh ở X 3 phút → `37a80b6` "head still abc1234: waiting for a push" (chờ hết giờ như PR #1070) → ghim mã 3. **Gỡ sửa:** G01 (ngưỡng 0) KILLED, G02 (`>` thay `>=`) KILLED, G03 (nhánh ở head coi như đi trước) KILLED, G04 (không đọc nhánh) KILLED 3, G05 (`heldFor` không đếm lại khi đổi giá trị) KILLED, G06 (mã 0 thay mã 3) KILLED. (2) Skill `auto-issues`: `Select-String` trên `SKILL.md` không còn `--timeout 30` / `60`; trần 15 phút cho `pr` / `ci` / `review` / `title` (`:112-118`, `:143-146`, `:272`, `:275`), `sleep --timeout 5` cho §6 (`:147`, `:312`, `:314`, `:323`), brief chờ `sleep --timeout 1` (`:142`); luật "Chờ lâu cho cùng một việc" theo tổng 60 phút (`:152`), §5 sửa theo; đoạn "Lệnh chờ là tín hiệu đánh thức chính" (tin báo bị giữ, `notify_when_idle`); §4 "Head của PR kẹt" | `auto-wait.mjs` trên bản chép với `gh` giả (`aw-fake\`, `--once`): nhánh ở X → mã 2 "not yet: head still abc1234, branch at fedcba9: waiting for the PR to follow"; nhánh có `#`, dấu cách, `%` → đường dẫn `git/ref/heads/task/T-9%231%20x%25y` (mỗi đoạn mã hóa riêng, `/` giữ). Luật chờ lâu 60 phút: ACCEPTED (Owner 06/11, `known.md` phần 1) |
| T-383 | #1107 → #1113 | **ĐÃ SỬA** | (1) `readBranch` (`auto-wait-core.mjs:118-125`): lỗi có `(HTTP 404)` → `null` → "head still <H>: waiting for a push"; lỗi khác ném ra cho `waitFor` đếm. Ca `auto-wait-core.test.mjs:438` (404), `:445` (`connect ETIMEDOUT`, `(HTTP 500)`). **Gỡ sửa:** B02 (ném cả 404, như trước T-383) KILLED; B01 (nuốt mọi lỗi) KILLED. `aw-fake\`: 404 → mã 2 "waiting for a push"; `connect ETIMEDOUT` → mã 3 "read failed: …" với `--once` (đúng `waitFor` `:337`). (2) `SKILL.md:111`: head mới (`ĐÃ PUSH @<X>`) → `ci <N> --not <H> --timeout 15`, nêu `--once` / `branch at <X>`, trỏ §4, không nhắc phiên con. (3) Ca "goes by the checks when the newest pull_request run was cancelled or failed to start" (`:265`): F03 (sàn `!== 'success'`) KILLED. (4) Kết quả chạy thật ghi ở thân PR #1113 (`fixes.md`) | B03 (khớp `404` ở bất cứ đâu trong thông điệp thay `\(HTTP 404\)`) **sống cả bộ 4 493 test**: chỉ khác code ghim khi lỗi mạng của một nhánh có "404" trong tên (vd. `task/T-404-…`) bị coi là "không có nhánh" — code ghim đúng; gần tương đương, không ghi phát hiện. Mục §3.7 "auto mode của `coding-ses1` chặn `gh issue create`" thân PR ghi là ngoài phạm vi, Owner quyết |

### 2.3 Bảng R1 gộp đủ 20 dòng (Claude lượt 6, A–F)

Dòng của gói A–E tóm từ mục 2 của `claude\A.md` … `E.md` (bằng chứng đủ ở đó); dòng của gói F như mục 2.1.

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-158 | #1045 → #1063 | **ĐÃ SỬA** (A) | Tái hiện lượt 5: bộ nhớ khóa lấp 20 000 tên rồi sắp 2 022 tên trộn chữ số, 20 lần xáo → 1 thứ tự. Gỡ sửa: `R158-old-file` (đúng lỗi DR6-136) và `R158-past-max-raw` (đưa lại DR6-112) đều KILLED | Ba đột biến sống chỉ đổi bộ nhớ / thời gian, không ghi |
| DR6-159 | #1045 → #1063 | **ĐÃ SỬA** (A) | U+200B / U+2060 / U+0085 / U+3164 / U+180E / NBSP / U+3000 → `isLabel` false, luật nhập 12 từ chối; `R159-isLabel-trim` KILLED 8 | Không còn chỗ hỏi "trống" bằng `trim()` trong code sản phẩm |
| DR6-160 | #1050 → #1072 (+ #1082 → #1088, #1094 → #1097, #1101 → #1109) | **ĐÃ SỬA** (A: mã KH trong `TrashOwner`, luật nhập 15; E: tên nút trên màn) | A: hai KH "Trần Thu Hà" → tên nút mang mã, trùng 0 (lượt 5: 2 / 4); luật 15 KILLED 9; 6 file của app cũ vẫn nhập (K50). E: trên bản web 14 dòng, 14 tên nút khác nhau (KH cùng tên, ba nhân sự trùng tới giây); `R160a/b/c` KILLED, `R160s` KILLED `trash.spec.ts:663` | Tên chỉ khác hoa / thường, chỗ đặt dấu thanh → **CLR6-A1** (Nit) |
| DR6-161 | #1046 → #1064 (+ #1079 → #1090, #1095 → #1099, #1101 → #1109, #1111 → #1115) | **ĐÃ SỬA** (B) | CAP1–CAP5 của CLR5-B1 và nguồn của thân PR KILLED (đúng ca, đúng `expect`); trên test `37a80b6` cả 6 sống. Exe dựng từ bản chép xác nhận quyền | Còn hở (`generate_context!(capabilities = …)`, `--config` qua `pnpm build:exe`, `tauri_config`, khóa `build` thụt lề, composite action) → **CLR6-B1** |
| DR6-162 | #1046 → #1064 (+ #1079 → #1090, #1095 → #1099) | **ĐÃ SỬA** (B) | Probe CXR5-B2 qua lớp dữ liệu: `maxInFlight 1`, file lúc đóng đủ ba team (bản `37a80b6`: 2, thiếu Team C); Q1 KILLED | F1–F9 lượt 5 trùng từng dòng |
| DR6-163 | #1046 → #1064 | **ĐÃ SỬA** (B) | Nhánh `if (!storage) return;` không còn (`app-data.ts:279-285`); coverage V8 không nhánh chết mới | S1 / S2 tương đương theo cấu trúc |
| DR6-164 | #1047 → #1066 | **ĐÃ SỬA** (C) | Câu của CLR5-C1 vẫn ra đề xuất; `R164-T6` KILLED 5 (đúng 5 ca mới) | — |
| DR6-165 | #1052 → #1074 (tài liệu) | **ĐÃ SỬA** (C: mốc và số Node; F: số trên màn) | `phase-6.md:348-362` có mốc Q2 (a). C (Node, xen kẽ cùng máy): lần gọi đầu 29,52 (`37a80b6`) → 28,20 ms, cả bộ 3 551 ghi chú 74,51 → 77,30 ms: trong nhiễu. F (trên màn): lần bấm đầu trung vị 49 ms (mốc 53), ghi chú dạng seed 38 / 34 / 33 ms (lượt 5: 40 / 34 / 33) | — |
| DR6-166 | #1047 → #1066 (+ #1080 → #1086) | **ĐÃ SỬA** (C) | "nhỏ bé" → Số con 3, "– KH đã kết hôn" → Đã kết hôn; `R166a`, `R166b` KILLED; 66 câu §10 khớp; 3 551 ghi chú thật 1 972 → 1 972 đề xuất | — |
| DR6-167 | #1047 → #1066 (+ #1080 → #1086) | **ĐÃ SỬA** (C, F) | Cây thử: chặn 8 / 8 cạnh tới file test / test-support (`37a80b6`: 1 / 8); rule ở `.dependency-cruiser.cjs:33-40` | Gỡ rule không test nào đỏ; `vitest` từ file sản phẩm ngoài ai / domain → **CLR6-C5** |
| DR6-168 | #1047 → #1066 (+ #1080 → #1086) | **ĐÃ SỬA** (C) | Trên màn: câu dán chỉ có ký tự vô hình → nút tắt, không tính lần thử; `R168-trim` KILLED 4, `E168-button-trim` KILLED (e2e) | — |
| DR6-169 | #1048 → #1068 (+ #1081 → #1092) | **ĐÃ SỬA** (D) | Probe lượt 5: 11 / 11 ký hiệu / escape / thực thể bị báo; cắm dấu nối 507 / 507 bị báo; đối chiếu cây cú pháp 356 file: 0 bỏ sót; 23 đột biến KILLED | Còn hở → **CLR6-D1** (năm ký hiệu của `vi.ts`, `sep.slash`), **CLR6-D2** (`` ` `` trong regex literal) |
| DR6-170 | #1049 → #1070 (+ #1081 → #1092) | **ĐÃ SỬA** (D: (1), (2), (6); E: (3), (4), (5), (7), (8); C: (9)) | D, E: trang = cửa sổ ở 1 100 / 1 440 với tên liền 81 / 160 chữ ở mọi chỗ của lượt 5; đột biến bị ca quét `long-names.spec.ts:357` giết (D 9 / 9, E 14 / 16); C: đột biến X1 (`KycHistory`) bị e2e giết | Còn hở → **CLR6-D3** (trần `max-w-60` không ca nào giữ), **CLR6-E1** (dòng chỉ hiện sau thao tác), **CLR6-E2** (b), (c) |
| DR6-171 | #1052 → #1074 (tài liệu) | **ĐÃ SỬA** (F) | Mục 2.1 | — |
| DR6-172 | #1050 → #1072 (+ #1082 → #1088) | **ĐÃ SỬA** (E) | Trên màn: U+200B / NBSP / hai dấu cách → 6b 1 khớp, Thùng rác 2 dòng (lượt 5: 0); `R172a/b/c` KILLED | Hàm chung `searchText` (A, T-377) |
| DR6-173 | #1050 → #1072 | **ĐÃ SỬA** (E) | 8a: ô chỉ có ký tự vô hình không báo lỗi trước khi Lưu; `R173a` KILLED (`customer-policies.spec.ts:135`, `:165`) | — |
| DR6-174 | #1050 → #1072 (a, b), #1049 → #1070 (c) | **ĐÃ SỬA** (E) | Ba đột biến sống của lượt 5 nay KILLED: E154d (`dialog-keyboard.spec.ts:186`), E350c / E350d (`trash.spec.ts:199`), E148e (`long-names.spec.ts:251`) | Phần màn của T-380 không ca nào giữ → **CLR6-E2** |
| DR6-175 | #1051 → #1056 | **ĐÃ SỬA** (F) | Mục 2.1 | — |
| DR6-176 | #1051 → #1056 (+ #1059 → #1061, #1083 → #1103) | **ĐÃ SỬA** (F) | Mục 2.1 | — |
| DR6-177 | #1051 → #1056 (+ #1058 → #1077) | **ĐÃ SỬA** (F) | Mục 2.1 | — |

Đếm R1: **20 / 20 ĐÃ SỬA**, 0 SỬA MỘT PHẦN, 0 CHƯA SỬA, 0 HỒI QUY. Biến thể còn hở đã ghi thành phát hiện ở gói phát hiện ra: CLR6-A1, B1, C5, D1, D2, D3, E1, E2.

### 2.4 Bảng R2 gộp đủ 14 dòng (Claude lượt 6, A–F)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-371 | #1054 → #1075 (tài liệu) | **ĐÃ SỬA** (F) | Mục 2.2 | — |
| T-372 | #1058 → #1077 | **ĐÃ SỬA** (F) | Mục 2.2 | Chỉ đổi tên biến |
| T-373 | #1059 → #1061 | **ĐÃ SỬA** (F) | Mục 2.2 | — |
| T-374 | #1079 → #1090 | **ĐÃ SỬA** (B) | `idle()` lặp `while (running)`; Q4, Q5, Q6 KILLED; T374a–d (nguồn quyền) KILLED, sống trên test `37a80b6` | Khóa `build` thụt lề / trong ngoặc kép, `generate_context!` → **CLR6-B1** |
| T-375 | #1080 → #1086 | **ĐÃ SỬA** (C: câu dán trống, Mock; F: rule) | `isBlankWebAnswer` một luật, R375-no-cap KILLED; Mock "đứa / thằng … đã mất" R375-no-words KILLED 3; rule chung `test-files-only-in-tests` | Phần nút không ca nào giữ → **CLR6-C6**; rule không test giữ → **CLR6-C5**; chữ spec §3.1 → **CLR6-C11** |
| T-376 | #1081 → #1092 | **ĐÃ SỬA** (D) | `JOINS` gồm `concat`, `T376-concat` KILLED; `CELL_NAME` một lớp, `T376-cell-nowrap` KILLED; khung `SelectField` đúng chuỗi class | `T376-cell-nocap` sống → **CLR6-D3** |
| T-377 | #1082 → #1088 | **ĐÃ SỬA** (A: `searchText` về domain; E: tên nút tới giây, team trùng tên, e2e 8b) | `T377-search-no-normalize` KILLED 5; `T377a/b/c` KILLED; `T377d` KILLED `customer-policies.spec.ts:165`; trên màn ba nhân sự trùng tới giây, hai team trùng tên | — |
| T-378 | #1083 → #1103 | **ĐÃ SỬA** (F) | Mục 2.2 | — |
| T-379 | #1085 → #1104 | **ĐÃ SỬA** (F) | Mục 2.2 | Mục chạy thật làm ở T-383 |
| T-380 | #1094 → #1097 | **ĐÃ SỬA** (E) | `teamsDeletedAt`, `blockedReason`, `ownerParts`, `restoreRow` nhận `teams`; trên màn đúng giờ xóa; `T380a–d` KILLED | Phần màn (`T380s1–s4`) sống, 13 / 13 `trash.spec.ts` → **CLR6-E2** |
| T-381 | #1095 → #1099 | **ĐÃ SỬA** (B) | T381a (`--config` ở script `dev`), T381b (`TAURI_CONFIG` trong `ci.yml`) KILLED; helper `saveTwiceAfterFirst` dùng ở hai ca | `--config` chuyển qua `pnpm build:exe`, `tauri_config` chữ thường → **CLR6-B1** |
| T-382 | #1101 → #1109 | **ĐÃ SỬA** (B: ca capability; E: `deletionWords`) | T382b–d KILLED, TM2 KILLED; `deletionWords` dùng ở hai nơi, `T382a/b` KILLED | Composite action → **CLR6-B1** |
| T-383 | #1107 → #1113 | **ĐÃ SỬA** (F) | Mục 2.2 | B03 sống, gần tương đương |
| T-384 | #1111 → #1115 | **ĐÃ SỬA** (B) | T384a–c (`npx`, `.bin\tauri.cmd`, `pnpm dlx`) KILLED; TM1 KILLED | Ba dạng của ACCEPTED review #1115: KNOWN; `node …/tauri.js`, regex cờ không ca mẫu → gộp **CLR6-B1** |

Đếm R2: **14 / 14 ĐÃ SỬA**, 0 SỬA MỘT PHẦN, 0 CHƯA SỬA, 0 HỒI QUY. Phần còn hở ghi thành phát hiện: CLR6-B1, C5, C6, C11, D3, E2.

## 3. Phạm vi đã đọc

**Diff `37a80b6..5b1328a` của gói F** (`git diff --numstat -M 37a80b6 5b1328a -- tools e2e .github .githooks .claude packages/ui/scripts apps/desktop/vite.config.ts eslint.config.js .dependency-cruiser.cjs playwright*.ts vitest.config.ts pnpm-workspace.yaml package.json`): 17 file, +911 / −79 — `tools/auto-wait-core.mjs` +115 / −14, `tools/auto-wait.mjs` +33 / −7, `tools/auto-wait-core.test.mjs` +269 / −19, `tools/notes-core.test.mjs` +3, `tools/review-hint-core.test.mjs` +2, `e2e/long-names.spec.ts` +243 / −1, `e2e/customer-policies.spec.ts` +70, `e2e/appointments.spec.ts` +28, `e2e/trash.spec.ts` +26, `e2e/dialog-keyboard.spec.ts` +8, `e2e/customer-ai-web.spec.ts` +4, `e2e/perf/probe.perf.ts` +12 / −4, `.dependency-cruiser.cjs` +11 / −7, `.github/ISSUE_TEMPLATE/task.yml` +17, `.github/pull_request_template.md` +22 / −1, `.claude/skills/auto-issues/SKILL.md` +25 / −23, `.claude/skills/review-pr/SKILL.md` +23 / −3. 12 commit chạm gói F (T-365, T-367, T-368, T-369, T-372, T-373, T-375, T-377, T-378, T-379, T-383, T-386). Không đổi schema / migration / Rust từ `37a80b6` (`git diff --stat 37a80b6 5b1328a -- packages/db/src/migrations packages/db/src/schema.ts apps/desktop/src-tauri/src` rỗng); không đổi dependency (`git diff --stat` trên mọi `package.json` và `pnpm-lock.yaml` rỗng).

- **Phân công đọc `files-F.txt` (99 file):** phiên chính `tools/auto-wait*` (3 file) và phần R; S1 mọi file khác của `tools/` (cả `.ps1`), `.claude/hooks/*`, `.githooks/pre-push`, `.github/**`, `.dependency-cruiser.cjs`, `eslint.config.js`, `vitest.config.ts`, `pnpm-workspace.yaml`, `apps/desktop/vite.config.ts`, `packages/ui/scripts/check-tokens.ts`; S2 mọi file `e2e/**` và ba `playwright*.config.ts`; S3 đo toàn codebase; S4 dựng chuỗi xuyên gói.
- **S1 đọc kỹ từng dòng:** `tools/{pr-core,merge-pr,pr-status,session-core,session-io,notes-core,notes-for,review-hint-core,handoff,status,ts-hooks,ts-hooks-core,load-data,load-data-core,codemap,codemap-core,size-report,size-report-core,retro,retro-core,eval-ai,eval-ai-core}.mjs`, `tools/{bootstrap,session-start,session-end}.ps1`, `tools/{session-end,pr-core,pr-status}.test.mjs`, hai hook, `.claude/settings.json`, `.githooks/pre-push`, `ci.yml`, hai mẫu Issue, mẫu PR, diff `37a80b6..5b1328a` của `.claude/skills/review-pr` và `.github` (cùng §0–§3 của skill), file cấu hình gốc, `vite.config.ts`, `check-tokens.ts`, các tsconfig.
- **S2 đọc kỹ:** 33 spec (31 ở gốc `e2e/`, `guide/links.spec.ts`, `perf/stats.spec.ts`), `support.ts`, `fixtures.ts`, `anchor.ts`, `serve.mjs`, `seeded-snapshot.ts`, `e2e/tsconfig.json`, `guide/{links,check.guide,shots.guide}.ts`, `perf/{probe.perf.ts,stats.ts,README.md}`, ba config Playwright, phần e2e của `eslint.config.js`; từng hunk diff của 7 file e2e; chỗ code các ca chạm (`AppointmentDialog.tsx`, `EditOutcomeDialog.tsx`, `PolicyDialogs.tsx`, `Segmented.tsx`, `Dialog.tsx`, `SelectField.tsx`, `useRoute.ts`, `today.ts`, `app-data.ts`, `main.tsx`).
- **File của `files-F.txt` không đọc kỹ từng dòng, và vì sao:**
  - `tools/{codemap-core,eval-ai-core,load-data-core,retro-core,review-hint-core,session-core,size-report-core,ts-hooks-core}.test.mjs`, `tools/notes-core.test.mjs` (trừ phần diff và dòng 1–60, 95–110, 254–264, 339–390): S1 đọc tên ca và đoạn liên quan; độ mạnh của các test này đo bằng 142 đột biến (mục 9.2) thay cho đọc từng dòng. Phần diff của `notes-core.test.mjs`, `review-hint-core.test.mjs` phiên chính đọc (DR6-175).
  - `tools/fixtures/ai-eval.mjs`: S1 đọc dòng 1–60; file là bản chép golden G2 mà test so nguyên văn với tài liệu.
  - `e2e/customer-ai.spec.ts` (từ khoảng dòng 600), `e2e/settings-ai.spec.ts`: S2 đọc nhanh; vùng AI, gói C đã đột biến e2e ở đây.
  - Còn lại của `files-F.txt`: đọc kỹ (phiên chính hay S1 / S2).
- **Ngoài `files-F.txt` trong vùng gói F:** `.claude/skills/auto-issues/SKILL.md` (phiên chính: diff, `:1-228`; phần còn lại xem qua diff), `.claude/skills/review-pr/SKILL.md` (S1: diff, §0–§3), `.github/pull_request_template.md` (S1), `.claude/commands/session-start.md` (S1, phiên chính đọc `:13-16`), `docs/user-guide/*.md` (S2 quét bằng probe link, không đọc nội dung).
- **Chỗ gói khác nối vào (đọc để dựng chuỗi / kiểm phát hiện):** `apps/desktop/src/routes/trash-view.ts:185-215`, `:368-502`, `:612-640`, `SettingsTrash.tsx`, `RestoreDialog.tsx`, `i18n/vi.ts` (khóa `trash.*`), `packages/db/src/backup.ts:40-90`, `packages/ai/src/blocklists.ts:26-41`, `:101-108`, `AppointmentDialog.tsx`, `Dialog.tsx`, `Segmented.tsx`, `e2e/perf/stats.ts`, `docs/metrics/phase-6.md`, `docs/testing/nghiem-thu-v1.md` (NT-AI-17, NT-LH-17, "Lệch mockup đã biết"), `docs/design/phase-5-ai.md` §10.
- **Tài liệu:** `CLAUDE.md` gốc, `.claude/rules/{ci,tests}.md`; `common\{prompt-claude.md, plan.md §L6.0–§L6.11, known.md (phần 1 lọc theo vùng F, phần 2, 4, 5), fixes.md (Issue + PR của T-369…T-373, T-378, T-379, T-383, T-380; phần dependency-cruiser của T-365, T-375), baseline.md (đủ), files-F.txt}`; tổng hợp lượt 5 §5–§7; báo cáo gốc lượt 5 `claude/F.md` (mục 3–6, 9) và `codex/F.md` (mục 4, 5); `claude\A.md` … `E.md` lượt 6 (mục 1, 2, 5, 7 và trường "Chặn phát hành").
- Phiên chính đọc hết: `tools/auto-wait-core.mjs`, `tools/auto-wait.mjs`, `tools/auto-wait-core.test.mjs`, `tools/session-io.mjs`, `checkCounts` / `latestReview` của `tools/session-core.mjs`, diff `notes-core.test.mjs`, `review-hint-core.test.mjs`, `e2e/perf/probe.perf.ts:195-300` và diff của nó, `.dependency-cruiser.cjs`, `vitest.config.ts`, `.github/workflows/ci.yml`, diff `.claude/skills/auto-issues/SKILL.md` (và `:1-107` của file), file gốc không có trong `files-F.txt` (`.claude/settings.json`, `.claude/launch.json`, `.gitattributes`, `.gitignore`, `.prettierignore`, `.nvmrc`, `.editorconfig`, `rust-toolchain.toml`, `tsconfig.base.json`, `pnpm-workspace.yaml`).

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| F1 | 30 đột biến `tools/auto-wait-core.mjs`, `notes-core.mjs`, `review-hint-core.mjs` qua hook `load` (`mut6.mjs`) | 29 KILLED, B03 sống cả bộ (gần tương đương) | mục 2 |
| F2 | `ciState` của `37a80b6` ↔ ghim trên 11 bộ đầu vào gh giả (CXR5-F1 và biến thể; `p-cxr5f1.mjs`) | Ghim đúng ở cả 11; `37a80b6` xanh sai ở 6 | DR6-176, T-373, T-378, T-379, T-383 |
| F3 | `tools/auto-wait.mjs` chạy thật trên bản chép, `session-io.mjs` giả (không tiến trình `gh`), `--once`: nhánh đi trước, nhánh 404, lỗi mạng, nhánh có `#` / dấu cách / `%`, `--since` với run bị hủy (`aw-fake\`) | Mã thoát 2 / 2 / 3 / 2 / 3 đúng usage; đường dẫn ref mã hóa từng đoạn | T-379, T-383 |
| F4 | Bản web: KH tên chứa "Đã gặp" có lịch Dự kiến và lịch nhập bù → locator `metRows` cũ ↔ ghim ↔ DOM, kỳ Tuần và Năm (`web\p-metrows.mjs`) | Cũ chọn dòng Dự kiến (0 nút hẹn tiếp); ghim = DOM | DR6-177 |
| F5 | Bản web: lần bấm AI trích xuất đầu của trang (Mock), probe lượt 5 (`dr165\`) | Trung vị 49 ms (mốc 53), ghi chú dạng seed 38 / 34 / 33 ms | DR6-165 |
| F6 | Bản web: 6b, ArrowDown ×2 trên ô "Thêm người phối hợp" đang đóng rồi Tạo lịch hẹn (kiểm độc lập đề xuất chặn CLR6-E4 của gói E; `web\p-e4-arrows.mjs`) | Hai chip được thêm, Chi tiết ghi "Phối hợp IS Bùi Văn Nga, BDM Hoàng Minh Quang" — khớp CLR6-E4 | (CLR6-E4) |
| F7 | (S4; phiên chính đọc lại code và log) Bản web: hai KH trùng tên khác mã, hai RE trùng tên, hai IS trùng tên, mỗi bản ghi chặn một dòng khác → Thùng rác → khôi phục một bản → đọc dòng lý do, "Thuộc", hộp 11b, thông báo 11e (`s4-chains\c1-namesake-lines.mjs`, `c1b-notice.mjs`, `c1c-dialog.mjs`) | Tên nút tách được; dòng lý do / "Thuộc" / tiêu đề hộp 11b chỉ có tên trần, như nhau giữa các dòng trùng tên; sau khi khôi phục một RE, dòng của KH kia vẫn "RE Đinh Quang Vũ đã xóa — khôi phục RE trước." | CLR6-F1 |
| F8 | (S4) Bản web: dữ liệu có tên trùng → khôi phục một KH → Xuất backup → Nhập đúng file đó → Dọn sạch → Xuất → Nhập (luật 15), so Thùng rác / Tổng quan / Báo cáo ở ba mốc (`s4-chains\c2-roundtrip.mjs`) | Cả hai lần nhập được nhận; Thùng rác 9 dòng giống từng chữ; Tổng quan, Báo cáo giống ở cả ba mốc; 11j "Xóa hẳn 3 KH · 4 lịch hẹn · 2 nhân sự" | — |
| F9 | (S4) Fuzz lệnh `@p2c/db` (40 seed × 600 bước): đặt lịch → MET / CANCELLED / NO_SHOW → đổi nhóm tay → sửa kết quả 6f (dời ngày) → xóa lịch / KH → khôi phục; so điều `listTrash` hứa (`stageChange`, `stageKept`, `none`, số lịch) với kết quả thật (`s4-chains\c3-effect-fuzz.mjs`) | 3 896 lần khôi phục, 0 lệch; 1 940 dòng bị chặn đúng mã; `stageKept` chỉ 1 ca | — |
| F10 | Quan sát trong chính phiên này (≈ 20:10): lượt chỉ gồm báo cáo trả về của subagent S3 (có câu "theo review PR 674", trích chú thích code) và một thông báo tác vụ; hook `UserPromptSubmit` thêm "Owner asked to review PR #674. Invoke the project skill `review-pr`…". Dựng lại bằng `reviewedPr` ghim trên khối có thẻ đóng mang thuộc tính (`p-hint-id.mjs`) | Thẻ đóng `</system-reminder id="…">` không được bỏ → 674; cùng khối với thẻ đóng trần → `null`. Phiên không chạy `review-pr` (quy tắc riêng 4; Owner không hỏi) | CLR6-F3 |
| F11 | (S3) Bloat toàn codebase: chạy lại script lượt 5 (`exports-f`, `dup-scan` 25, `dup-scan-struct` 35, `p9-error-keys`, `split-build`) và script mới (`exports-all`, `dup-scan-tests`, `deps-used`, cặp build có sourcemap `37a80b6` ↔ ghim) | Mục 6.1 | CLR6-F11 |
| F12 | (S3) A/B xen kẽ cùng tiến trình `37a80b6` ↔ ghim, 3 lần: `filterTrash`, `searchCustomers` mỗi phím; dựng mọi dòng Thùng rác 113 / 1 313 / 2 626 dòng; sắp cột "Thuộc"; câu dán 100 000 ký tự | Mục 6.2: chênh lớn nhất +5,26 ms mỗi phím, không ⚠️ | — |
| F13 | (S1) 142 đột biến trên lõi công cụ (`pr-core`, `pr-status`, `session-core`, `notes-core`, `size-report-core`, `codemap-core`, `retro-core`, `ts-hooks-core`, `load-data-core`, `eval-ai-core`, `review-hint-core`), đối chứng 405 / 405; cổng merge bản ghim ↔ đột biến sống trên đầu vào test không có (`p-gate-survivors.mjs`) | 112 KILLED, 30 sống; bản ghim đúng ở mọi ca | CLR6-F6 |
| F14 | (S1) `notes-for` (lõi) trên sổ thật ở SHA ghim với file của `review-pr` / `size-report`; `allowedPatterns` trên thân Issue theo mẫu T-386, LF và CRLF | Lời nhắc vẫn "Gộp vào task…" với 5 mục [sau v1.0]; `allowedPatterns` đúng | CLR6-F8 |
| F15 | (S1) PR sửa xếp chồng trên repo nháp: cỡ theo mẫu PR ↔ theo `review-pr` (`p-stacked-size.mjs`) | 71 ↔ 10 dòng sản phẩm | CLR6-F9 |
| F16 | (S1) ESLint `lintText` / tsc trên file trong bộ nhớ dùng `window` / `process` ở domain, db, ai, tools | ESLint không báo ở TS; tsc chặn | CLR6-F12 |
| F17 | (S1) `.githooks/pre-push` chạy bằng `sh` với 6 dạng ref (thường, nhiều dòng, xóa `main`, CRLF, tag `main`); hook `review-pr-hint.mjs` với 6 prompt (thường, `[auto-issues]` có CRLF, `#N` trần, chữ thường, JSON hỏng, `null`); eval: trả lời 200 độn tới 2 097 162 B; `codemap --check`; vị trí `#[cfg(test)]` của Rust; đường dẫn non-ASCII | pre-push chặn mọi cách đẩy / xóa `refs/heads/main`, nhánh task và tag qua; hook đúng ở 6 prompt (thẻ đóng trần); eval ghim báo `AI_BAD_RESPONSE` như Rust; codemap sạch (416 ms); `#[cfg(test)]` chỉ ở `ai.rs:579`, `storage.rs:683` (`mod tests` tới cuối file); 0 đường dẫn non-ASCII | — |
| F18 | (S2) Cả bộ e2e của repo trên bản chép (`s2-e2e\mirror\e2e`, chỉ `fixtures.ts` thêm chặn mạng / thay `window.open`) và bản web `dist-base` riêng, cổng 4950: 4 worker, rồi 6 worker; cộng hai lần cả bộ trên bản đột biến | 328 / 328 cả bốn lần (185 s, 126 s); 0 request bị chặn; không ca chập chờn (`appointment-outcome.spec.ts:351`, ca gói D thấy đỏ một lần, xanh cả bốn) | — |
| F19 | (S2) Quét chờ cố định, đọc không chờ, `test.skip` / `only`, `retries` trong `e2e/` | Chỉ `demo-data.spec.ts:83` `waitForTimeout(6000)` (có chủ ý); `count()` không chờ ở `appointment-outcome.spec.ts:522` | CLR6-F5 |
| F20 | (S2) Tên TL / IS 160 chữ, KH 81 chữ, RE 160 chữ trong 16–22 trạng thái hộp (5a, 6b ×2, 6c, 6e, 6f, 6g, 6h, 8a, 8b, 8d, 8e, 9a–9d, 10a / 10b) và ngoài màn Team; phiên chính chạy lại trên cổng 4941 | Đối chứng 0 / 15, tên dài 4 / 16 (6b ×2, 6h, 6f; 8d 1 250 / 446 ở probe khác); trang không cuộn | CLR6-F2 |
| F21 | (S2) Ô Segmented: → ở lựa chọn cuối; "Các lần hẹn trước" của 6b với KH có 6 lịch; mỗi cái ghim ↔ đột biến (cả bộ e2e) | Ghim vòng / 5 dòng; đột biến sống cả bộ | CLR6-F4, F5 |
| F22 | (S2) Bộ kiểm link hướng dẫn: quét 224 đích (105 có `#anchor`), sửa tạm chữ hướng dẫn trên bản chép (anchor hỏng, anchor trong trang, sai hoa / thường, ảnh thiếu), đột biến `links.ts` | 0 link hỏng hôm nay; ba dạng hỏng và hai đột biến sống | CLR6-F7 |
| F23 | (S2) `stats.ts` (bản chép trùng sha256): biên luật nhiễu, dấu Δ, ngưỡng, MB, thao tác chỉ có ở nền; luật lint `test` theo đuôi file; `chart.spec` / `theme.spec` đọc `dist` nào | Biên 20 % / 10 ms đúng; bốn lệch ở bảng; luật lint chỉ `.ts`; hai ca đọc `dist` của checkout | CLR6-F10, F14, F13 |

## 5. Phát hiện mới

Gói F có **14** phát hiện mới: 5 Low, 9 Nit; 0 đề xuất chặn phát hành (K48); 13 CONFIRMED, 1 KNOWN có bằng chứng mới (F9). Phát hiện của A–E không ghi lại ở đây (dẫn ID ở mục 2, 7, 10). Thứ tự theo mức rồi theo trục.

### CLR6-F1 — Thùng rác: dòng lý do TR-1, ô "Thuộc" và hộp 11b chỉ nêu tên trần của KH / RE / người phối hợp / người đánh giá đang chặn, nên không biết phải khôi phục bản ghi trùng tên nào (T-380 chỉ làm cho team)

```
ID: CLR6-F1
Mức: Low
Trục: C (A)
Vị trí: apps/desktop/src/routes/trash-view.ts:384-385 (chỉ TEAM_NOT_FOUND nhận `teams`), :386-389 (PERSON_NOT_FOUND re / coordinator / reviewer → `trash.blocked.${as}`), :416-424 (CUSTOMER_NOT_FOUND → `trash.blocked.${code}`), :195-196 (phần KH / RE của "Thuộc" không có giờ xóa hay mã), :455, :498 (tiêu đề hộp 11b chỉ có tên); apps/desktop/src/i18n/vi.ts:307-308, :330-332, :335, :394; packages/db/src/common.ts:177, packages/db/src/appointments.ts:470 (params lỗi chỉ có `name`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-380 (#1094 → #1097, chỉ team), DR6-160 / K50 Q1 (a), CLR6-A1, CLR6-D13 · có từ trước (dòng TR-1 từ #72), lộ rõ sau T-377 / T-380; S4 tìm, phiên chính đọc lại code và log
```

- **Mô tả:** Thùng rác tách hai bản ghi trùng tên ở **tên nút** khôi phục (KH thêm mã, nhân sự thêm "xóa lúc", K50 Q1 (a)), và T-380 tách tiếp **dòng lý do / "Thuộc"** khi bản ghi chặn là team. Với bản ghi chặn là KH, RE, người phối hợp hay người đánh giá, dòng lý do TR-1, ô "Thuộc" và tiêu đề hộp 11b vẫn chỉ có tên, nên hai dòng bị chặn bởi hai bản ghi trùng tên đọc giống hệt nhau, và không nói phải khôi phục bản nào trong hai nút. Sau khi khôi phục một bản, dòng bị chặn bởi bản kia vẫn ghi "RE Đinh Quang Vũ đã xóa — khôi phục RE trước." trong khi màn Team đã có một RE tên đó, và thông báo 11e "Đã khôi phục nhân sự Đinh Quang Vũ" đứng ngay trên dòng ấy.
- **Tái hiện / bằng chứng:** S4 dựng bản web (`s4-chains\dist`, neo 15/09/2026, 127.0.0.1:4960, Edge chặn mạng ngoài 127.0.0.1, `window.open` thay) và tạo dữ liệu qua giao diện (5a, 6b, 5f, 9b): `node c1-namesake-lines.mjs 4960` → `c1-namesake-lines.log` (phiên chính đọc lại):
  - hai RE "Đinh Quang Vũ · RE · Hừng Đông" có nút "… xóa lúc 15/09/2026 19:53:37" / "… 19:53:34"; KH "Khách Hai Thử" và "Khách Một Thử" (mỗi KH của một RE) cùng `"owner":"RE Đinh Quang Vũ (đã xóa) · Hừng Đông"`, cùng `"reason":"RE Đinh Quang Vũ đã xóa — khôi phục RE trước."`;
  - hai lịch của hai KH "Hà Thị Ngọc Diệp": nút "… của KH Hà Thị Ngọc Diệp (K-6YJ0)" / "(K-DQQK)", cùng `"reason":"Khôi phục KH Hà Thị Ngọc Diệp trước."`;
  - hai lịch có người phối hợp là hai IS "Tạ Minh Khôi" khác nhau: cùng `"reason":"Người phối hợp Tạ Minh Khôi đã xóa — khôi phục trước."`, trong khi hai dòng IS có "xóa lúc …:41" / "…:38";
  - sau khi khôi phục RE xóa lúc 19:53:37, KH "Khách Một Thử" vẫn `"disabled":true,"reason":"RE Đinh Quang Vũ đã xóa — khôi phục RE trước."`; `c1b-notice.log`: thông báo "✓ Đã khôi phục nhân sự Đinh Quang Vũ" ngay trên dòng đó; `c1c-dialog.log`: hai hộp 11b mở từ hai nút có mã khác nhau giống nhau từng chữ ("Khôi phục Hà Thị Ngọc Diệp? KH · xóa lúc 15/09/2026 20:01 …"). `page errors []`, `requests blocked []`.
  - Phiên chính đọc lại `trash-view.ts:192-204` (`ownerParts`: chỉ phần team lấy `teams.get(team.id)`), `:373-427` (`reasonSentence`: chỉ nhánh `TEAM_NOT_FOUND` dùng `teams`), `:451-502` (`restoreView`), `SettingsTrash.tsx:83`, `:94`, `:334-335`, `RestoreDialog.tsx:31-33`; Issue #1094 (`fixes.md`) chốt phạm vi chỉ team.
- **Cùng mẫu:** `rg -n "trash\.blocked\.\$\{as\}|trash\.blocked\.\$\{code\}|trash\.owner\.(customer|re)'|trash\.restore\.title'|trash\.restored\.(customer|person)'" apps/desktop/src` (S4) và đọc lại: sai `trash-view.ts:195`, `:196`, `:388`, `:424` (CUSTOMER_NOT_FOUND, và cả RE_REQUIRED / INVALID_* dùng `name`), `:455`, `:498` (hộp 11b), `:620`, `:638` (thông báo 11e, chỉ tên); đúng: `:384-385` (team). Params lỗi không mang id để màn tra: `common.ts:177`, `appointments.ts:470` (`PERSON_NOT_FOUND` chỉ `{ name, as }`).
- **Ảnh hưởng:** chỉ khi Thùng rác có hai bản ghi trùng tên (seed có tên KH trùng; RE / IS trùng tên hiếm). Người dùng có thể khôi phục nhầm bản, rồi phải xóa lại; trình đọc màn hình nghe tên nút có mã / "xóa lúc" nhưng mô tả (`aria-describedby` là dòng lý do) thì không. Không sai dữ liệu đã lưu; khôi phục nhầm đảo ngược được.
- **Chặn phát hành:** không — Low trục C (A), chỉ chữ trên màn, đảo ngược được (K48).
- **Đề xuất:** một luật cho mọi bản ghi chặn: chữ ở dòng lý do / "Thuộc" / tiêu đề 11b dùng đúng vế phân biệt của nút khôi phục bản ghi đó (mã KH khi `toldApart` có `code`, "xóa lúc" của nhân sự như của team); tổng quát `teamsDeletedAt` thành map theo id cho nhân sự và team; thêm `id` vào params của `PERSON_NOT_FOUND`. ≈ 40–70 dòng SP (gồm 4–5 khóa `vi.ts`), ≈ 80–120 dòng test (unit `trash-view` + một ca e2e).

### CLR6-F2 — Hộp 6b / 6h / 6f / 8d cuộn ngang khi có tên liền dài: thân hộp không ngắt chữ (Dialog chỉ ngắt tiêu đề và phụ đề)

```
ID: CLR6-F2
Mức: Low
Trục: E
Vị trí: packages/ui/src/components/Dialog.tsx:83-90 (`wrap-anywhere` chỉ bọc tiêu đề và phụ đề; `{children}` :90 không ngắt); apps/desktop/src/routes/appointments/AppointmentDialog.tsx:38 (`CHIP` không ngắt chữ), :227 (`<fieldset>` của `CoordinatorsField` không `min-w-0`, giãn theo ô chọn), :236-239 (chip người phối hợp), :244-251 (`SelectField` "Thêm người phối hợp" không trần), :341 (`<b>{customer.name}</b>`), :393 (`<b>{match.name}</b>`); apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:252; apps/desktop/src/routes/customers/PolicyDialogs.tsx:262-270 (dòng "Khi lưu" của 8d, `effectText(effect, re?.name)`); e2e/long-names.spec.ts:126-164 (đặt lịch qua 6b với KH 81 chữ nhưng chỉ đo 6c / 6e / 6g), :357 (ca quét không có TL / IS dài, không đo hộp) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ DR6-117 / DR6-148 / DR6-170 (T-367 #1049 → PR #1070), CLR6-E1, CLR6-C4 · có từ trước, lượt 1–5 bỏ sót; S2 tìm (S2-1), phiên chính chạy lại probe trên bản web của mình
```

- **Mô tả:** `Dialog` ngắt chữ ở tiêu đề và phụ đề (DR6-148) nhưng không ở thân hộp. Tên liền dài trong thân làm hộp cuộn ngang (trang không cuộn): KH 81 chữ ở dòng KH đã chọn và danh sách "KH khớp" của 6b / 6h; TL / IS (cả BD / BDM) 160 chữ ở ô "Thêm người phối hợp" và chip của 6b / 6h / 6f (fieldset giãn theo ô chọn); RE 160 chữ ở các dòng "Khi lưu" của 8d.
- **Tái hiện / bằng chứng:** phiên chính chạy lại probe của S2 trên bản web ghim của mình (`web\dist-base`, 127.0.0.1:4941; Edge chặn mạng ngoài 127.0.0.1, `window.open` thay; dữ liệu đặt qua giao diện): `node s2-e2e\p-long-dialogs2.mjs 4941 --control` → "dialogs that scroll sideways: 0 / 15 — none"; `node s2-e2e\p-long-dialogs2.mjs 4941` → "dialogs that scroll sideways: 4 / 16 — 6b from the profile | 6b with two coordinators | 6h Lịch hẹn tiếp theo | 6f Sửa kết quả", vd. "6b from the profile: @1100 dialog 1192/446 page 1100/1100 ✗ · @1440 dialog 1192/446 page 1440/1440 ✗" (`web\v-s2-long-dialogs2.log`; `requests blocked []`, `page errors []`). S2 thêm: chỉ KH E×81 → "6b, KH khớp listing the name @1100: dialog 661/446", "the customer picked: 632/446", "6h: 632/446" (`p-long-6b-customer.log`; thủ phạm `<b>` tên KH, `p-long-6b-where.log`: `right 959 > 772`); "8d Sửa HĐ with the "Khi lưu" lines: @1100 dialog 1250/446 ✗", đối chứng 446/446 (`p-long-dialogs3.log`). Phiên chính đọc lại `Dialog.tsx:76-93`, `AppointmentDialog.tsx:38`, `:225-252`, `:339-342`, `:391-394`.
- **Cùng mẫu:** `rg -n "\.name\b" apps/desktop/src/routes --glob "*Dialog*.tsx"` (S2): tên trong thân hộp chỉ ở `AppointmentDialog.tsx:341`, `:393`, `PolicyDialogs.tsx:267`, cộng `personLabel` trong `CoordinatorsField`; các chỗ khác ở tiêu đề / phụ đề (có ngắt). Đã đo không tràn: 5a, 5c (ô RE 414 px), 8a, 8b, 8e, 9a–9d, 6c, 6e, 6g, 10a / 10b (tên file 150 chữ); gói E đã đo 11b.
- **Ảnh hưởng:** chỉ khi có tên liền dài bất thường (như DR6-170): hộp có thanh cuộn ngang, nút "Bỏ" của chip, cuối tên và dòng "Khi lưu" nằm ngoài khung tới khi cuộn. Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục E (K48).
- **Đề xuất:** một chỗ cho cả họ: ngắt chữ cho cả thân hộp (đưa `wrap-anywhere` lên `<form>` của `Dialog`), `fieldset` của `CoordinatorsField` thêm `min-w-0`, chip thêm `wrap-anywhere`, `SelectField` trong hộp `w-full` / `max-w-full`; e2e: ca 2 của `long-names` đo thêm 6b (danh sách khớp, KH đã chọn), ca quét thêm TL / IS 160 chữ và một helper đo mọi hộp mở được (6b, 6f, 6h, 8d). ≈ 3–5 dòng SP + ≈ 25–30 dòng e2e.

### CLR6-F3 — Hook gợi ý review đọc báo cáo của subagent / phiên con là lời Owner khi app ghi thẻ đóng có thuộc tính (`</system-reminder id="…">`): bảo phiên chạy `review-pr` cho một PR không ai hỏi

```
ID: CLR6-F3
Mức: Low
Trục: C (E)
Vị trí: tools/review-hint-core.mjs:19 (`APP_BLOCK` đòi thẻ đóng trần `<\/\1>`), :24 (`prompt.replace(APP_BLOCK, '\n')`); .claude/hooks/review-pr-hint.mjs:18-27; tools/review-hint-core.test.mjs:62-72 (mọi khối mẫu đều có thẻ đóng trần) (5b1328a)
Tình trạng: CONFIRMED (khối system-reminder: thấy trực tiếp trong phiên này và dựng lại bằng code ghim); PLAUSIBLE với `<side-sessions-event>` của pipeline (chưa thấy app ghi thuộc tính ở thẻ đóng của khối này)
Liên quan: T-338 (#952 → PR #954: "bỏ các khối app chép vào lượt"), review #944 · có từ trước; lộ ra khi app ghi `id` ở cả thẻ mở lẫn thẻ đóng của khối báo cáo subagent
```

- **Mô tả:** T-338 cho hook bỏ các khối app chép vào lượt (`<system-reminder>`, `<task-notification>`, `<side-sessions-event>`), để báo cáo của phiên con, ghi chú "Linked sessions now" và tin lệnh chờ không gây gợi ý review (`.claude/skills/auto-issues/SKILL.md:194`). `APP_BLOCK` nhận thuộc tính ở thẻ mở (`\b[^>]*>`) nhưng đòi thẻ đóng đúng `</system-reminder>`. App hiện ghi báo cáo trả về của subagent trong `<system-reminder id="636c1418d7a384d6">` … `</system-reminder id="636c1418d7a384d6">`: khối không được bỏ, và một câu "review … PR <số>" trong đó thành yêu cầu của Owner.
- **Tái hiện / bằng chứng:**
  - Trong chính phiên này: lượt chỉ gồm báo cáo của subagent S3 (dòng bảng có "… theo review PR 674 …", trích chú thích `withIndexKeyOff`) và một thông báo tác vụ; hook thêm ngữ cảnh "Owner asked to review PR #674. Invoke the project skill `review-pr` (Skill tool, args "674") and follow it…". Không ai hỏi review PR #674; phiên không làm theo (quy tắc riêng 4 cấm `review-pr`).
  - `node p-hint-id.mjs` (`reviewedPr` ghim, `p-hint-id.log`): báo cáo subagent với thẻ đóng có `id` → **674**; cùng báo cáo, thẻ đóng trần → `null`; `<side-sessions-event id="x1">AUTO-CHILD: [PR #1109] REVIEW PASS @4d38a72</side-sessions-event id="x1">` → **1109** (thẻ đóng trần → `null`); "Linked sessions now: review-1 … reviewed PR #1109" trong `system-reminder` có `id` ở thẻ đóng → **1109** (trần → `null`); đối chứng: Owner gõ "review PR #674" → 674.
- **Cùng mẫu:** `git grep -n "system-reminder\|side-sessions-event\|task-notification\|cross-session-message" 5b1328a -- tools .claude e2e apps packages`: chỗ duy nhất đọc khối app là `review-hint-core.mjs:19`; test `review-hint-core.test.mjs:62-72`, `:80-85` chỉ dựng thẻ đóng trần.
- **Ảnh hưởng:** phiên nào nhận báo cáo subagent (hay — nếu `<side-sessions-event>` cũng mang `id` ở thẻ đóng — phiên điều phối của `auto-issues` nhận "AUTO-CHILD: [PR #N] REVIEW PASS …") được hook bảo chạy `review-pr` cho PR đó; harness coi đầu ra hook là phản hồi của người dùng. Phiên điều phối không được review (§3.2), phiên deep review bị cấm `review-pr`: làm theo thì lệch quy trình. Không chạm code sản phẩm.
- **Chặn phát hành:** không — Low trục C / E ở công cụ phát triển (K48); K49 đóng băng `review-hint-core*` / hook (rào "không tự sửa"): [sau v1.0] trừ khi Owner chọn.
- **Đề xuất:** thẻ đóng nhận thuộc tính (`<\/\1\b[^>]*>`), thêm ca test với `id` ở cả hai thẻ cho ba loại khối; ≈ 1 dòng SP, ≈ 10 dòng test.

### CLR6-F4 — Phím → ở lựa chọn cuối của ô Segmented (vòng về đầu) không ca nào giữ, dù tên ca nói "wrapping at both ends"

```
ID: CLR6-F4
Mức: Low
Trục: T
Vị trí: e2e/dialog-keyboard.spec.ts:114-148 (bắt đầu ở lựa chọn đang chọn, → một lần, rồi chỉ thử vòng ở đầu trái :142-147); packages/ui/src/components/Segmented.tsx:25-35 (`onKeyDown`, vòng bằng `% options.length` :30, :34) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: CLR6-D8 (b) của gói D (phím ↓ của cùng component, cùng ca; nên gộp một phát hiện ở tổng hợp) · có từ trước; S2 tìm (S2-3), phiên chính đọc lại ca và component
```

- **Mô tả:** ca "arrow keys move the choice around a segmented control, wrapping at both ends" bắt đầu ở "Tháng" của "Loại kỳ", nhấn → một lần (tới "Năm"), rồi ←, ↑ và vòng ở đầu trái; không bước nào nhấn → ở lựa chọn cuối.
- **Tái hiện / bằng chứng:** S2 `node s2-e2e\e2e-run.mjs mut S2M-seg-right` (bản dựng đột biến ngoài repo: → ở lựa chọn cuối đứng yên, ← vẫn vòng; chạy cả bộ e2e của repo): "S2M-seg-right | … | SURVIVED — 328 ran, 328 passed, 0 control-green failed (163 s; served components/segmented.tsx x1)" (`s2-e2e\e2e-mut.log`; đối chứng "328 passed, 0 not passed"). Không tương đương: `p-seg-wrap-base.log` "→ on the last: checked Ngày (index 0) … WRAPS to the first" ↔ `p-seg-wrap-m1.log` "checked Tùy chọn (index 4) … STAYS / no wrap". Phiên chính đọc lại `dialog-keyboard.spec.ts:114-148`, `Segmented.tsx:25-35`.
- **Cùng mẫu:** `rg -n "ArrowRight|ArrowLeft|ArrowUp|ArrowDown" e2e` (S2): chỉ ca này (cộng Alt+Arrow của `navigation`); `onKeyDown` có mũi tên chỉ ở `Segmented`.
- **Ảnh hưởng:** một lần sửa làm mất vòng ở đầu phải của mọi ô Segmented (góc nhìn, loại kỳ, cách xem…) mà CI vẫn xanh. Code ghim đúng.
- **Chặn phát hành:** không — Low trục T (K48).
- **Đề xuất:** thêm vào ca này bước "→ từ lựa chọn cuối về lựa chọn đầu" (gộp với bước ↓ của CLR6-D8). ≈ 3 dòng test.

### CLR6-F5 — "Các lần hẹn trước" của 6a / 6b: trần 5 dòng mới nhất (NT-LH-17) không ca nào giữ

```
ID: CLR6-F5
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/appointments/AppointmentDialog.tsx:442 (`history.rows.slice(0, MAX_HISTORY)`), appointment-form.ts:18 (`MAX_HISTORY = 5`); e2e/appointment-outcome.spec.ts:521-522 ("At most the five latest": `expect(await …count()).toBeLessThanOrEqual(5)`, đếm một lần, không chờ, trên KH có ít hơn 6 lần hẹn trước); e2e/customer-appointments.spec.ts:277-294, e2e/topbar-focus.spec.ts:129-150 (dựng > 5 lịch nhưng không đếm dòng); docs/testing/nghiem-thu-v1.md:132 (NT-LH-17), mockup appointment-forms.html:41-48 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ CLR6-D14 (CLOSED_LIMIT của gói D) · có từ trước; S2 tìm (S2-4), phiên chính đọc lại ca và code
```

- **Mô tả:** NT-LH-17 và mockup 6a đòi "Các lần hẹn trước" tối đa 5 dòng mới nhất. Ca duy nhất nhắc trần (`appointment-outcome.spec.ts:521-522`) đếm một lần trên KH không có đủ 6 lần hẹn trước, nên không phân biệt được có trần hay không; hai ca dựng > 5 lịch thì không đếm dòng.
- **Tái hiện / bằng chứng:** S2 `node s2-e2e\e2e-run.mjs mut S2M-hist-all` (bỏ `slice`, chạy cả bộ e2e): "SURVIVED — 328 ran, 328 passed, 0 control-green failed (172 s; served appointments/appointmentdialog.tsx x1)" (`e2e-mut.log`). Không tương đương: `p-history-cap-base.log` "6b history: 5 rows: 14/09, 13/09, 12/09, 11/09, 10/09; link: Xem tất cả (6) →" ↔ `p-history-cap-m2.log` "6 rows: … 09/09". Phiên chính đọc lại `appointment-outcome.spec.ts:510-525`, `AppointmentDialog.tsx:440-443`, `appointment-form.ts:18`, NT-LH-17.
- **Cùng mẫu:** các trần hiển thị (S2): `COLUMN_LIMIT` 6 (`customers.spec.ts:46` giữ), 100 dòng (T-150, `data-table` giữ), `CLOSED_LIMIT` 5 (CLR6-D14, đã báo), `MAX_KEY_CHARS` (`settings-ai.spec.ts:233` giữ); `MATCHES` 6 của danh sách KH khớp không có spec / mockup / NT nêu số, không ghi.
- **Ảnh hưởng:** một lần sửa làm hộp liệt kê mọi lần hẹn mà CI không đỏ. Code ghim đúng.
- **Chặn phát hành:** không — Low trục T.
- **Đề xuất:** trong ca đã dựng 6 lịch (`customer-appointments.spec.ts:277` hay `topbar-focus.spec.ts:129`) đếm đúng 5 dòng, mới nhất trước, bằng locator có chờ (`toHaveCount(5)`). ≈ 3 dòng.

### CLR6-F6 — Test hở của công cụ phát triển (tiếp DR6-175): bốn nhánh an toàn của cổng merge và 18 nhánh của các công cụ khác không ca nào giữ

```
ID: CLR6-F6
Mức: Nit (S1 đề xuất Low cho phần (a) vì là cổng "không merge PR code khi CI chưa xanh"; lượt 4–5 chấm test hở của công cụ phát triển là Nit — DR6-155, DR6-175 — để phiên tổng hợp thống nhất)
Trục: T
Vị trí: (a) tools/pr-core.test.mjs:216-218 (ca "does not treat a docs-like name outside docs/ as docs" gộp hai đường dẫn không phải docs vào một lần gọi `every`); tools/pr-core.mjs:40-45 (`isDocsOnly`), :184 (`untested`), :309 (`!dirty.has(main.path)`), :74, :79 (`EXE_PATHS` Cargo / tauri.conf.json); (b) tools/notes-core.mjs:9, :21, :35, :94, :216, :280; tools/session-core.mjs:87, :92; tools/size-report-core.mjs:14, :27, :177, :228, :359; tools/codemap-core.mjs:164, :184; tools/retro-core.mjs:149; tools/eval-ai-core.mjs:187, :225 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ DR6-155 / DR6-175 · có từ trước, lượt 1–5 bỏ sót; S1 tìm (S1-1, S1-5), phiên chính chạy lại sáu đột biến
```

- **Mô tả:** (a) Cổng merge (`pr-core.mjs`): ca `:217` gộp `apps/docs/x.ts` và `README.mdx` vào một lần gọi, nên đổi luật của một trong hai vẫn cho `false`; không ca nào có commit của `main` mà GitHub trả danh sách file rỗng (code ghim coi là code và chặn); không ca nào có checkout chính ở `main` mà bẩn (code ghim không fast-forward); hai regex `EXE_PATHS` (`Cargo.*`, `tauri.conf.json`) không được thử ở chỗ nào ngoài `src-tauri/` (với bố cục hiện nay không bao giờ quyết định kết quả). (b) 18 nhánh của `notes-core`, `session-core`, `size-report-core`, `codemap-core`, `retro-core`, `eval-ai-core` (vd. `MAX_PLACES` của `notes-core` — tên ca nói "up to three" mà chỉ thử 2 và 5 chỗ; `eval-ai-core` bỏ kiểm `bytes.length > MAX_BODY` — ca "too long" dùng JSON bị cắt nên lỗi parse che mất phép kiểm cỡ).
- **Tái hiện / bằng chứng:** S1 `node s1-tools\mut6.mjs` (142 đột biến, 112 KILLED, 30 sống; đối chứng 405 / 405 test `tools/`). Phiên chính chạy lại `node mut6.mjs P31 P16c P23 E13 N07b P04`: cả sáu `SURVIVED (all tools tests) — 405 passed (405)`, `git status --short after: ""`. `p-gate-survivors.log` (S1): bản ghim chặn "Code PR with no CI check on head abc1234." với PR chỉ đổi `apps/desktop/src/docs/x.ts` / chỉ `README.mdx` / chỉ `docsite/x.ts`, và chặn "main got code since feed000 …" với commit không file; đột biến P31 / P31b / P35 / P16c cho `[]` (merge được không CI); P23 fast-forward checkout chính bẩn. `p-eval-padded.mjs` (phiên chính chạy lại): body 2 097 162 B có JSON trọn → ghim `AI_BAD_RESPONSE` (như Rust), đột biến E13 `ACCEPTED content="{\"a\":1}"`.
- **Cùng mẫu:** `git grep -n -E "isDocsOnly\(|isNotesOnly\(|needsExe\(" -- 'tools/*.test.mjs'` (S1): chỉ `:217` gộp nhiều đầu vào phủ định; `:125`, `:209` đúng cách. `isDocsOnly` còn dùng qua `prFiles` ở `tools/auto-wait-core.mjs:182` (phép "docs-only thì xong ngay" của `auto-wait ci`), cùng lỗ test. Đột biến sống gần tương đương, không tính: P02, PS1, S09, N01, C03.
- **Ảnh hưởng:** chỉ công cụ phát triển; code ghim đúng ở mọi ca. Một lần sửa sau làm hỏng (a) thì `merge-pr` merge PR code không có CI, hay fast-forward checkout chính đang bẩn, mà 405 test vẫn xanh.
- **Chặn phát hành:** không — trục T (K48); code đúng, chỉ test hở; K49 đóng băng công cụ.
- **Đề xuất:** tách ca `:217` thành từng đường dẫn và thêm `docsite/x.ts`; thêm ca commit `main` không file, ca checkout chính ở `main` mà bẩn, `needsExe('Cargo.toml')` / `needsExe('x/tauri.conf.json')` (hay gỡ hai regex chết); 18 ca cho (b). ≈ 0 SP + ≈ 45–55 dòng test, sau v1.0.

### CLR6-F7 — Bộ kiểm link của hướng dẫn: không kiểm `#anchor`, so tên file không phân biệt hoa / thường, và không ca nào chứng minh nó bắt được link hỏng

```
ID: CLR6-F7
Mức: Nit (S2 đề xuất Low; công cụ kiểm, xếp như test hở của công cụ phát triển DR6-155 / DR6-175 — để phiên tổng hợp thống nhất)
Trục: T (C)
Vị trí: e2e/guide/links.ts:26-31 (`localPath`: đích chỉ là `#…` → `null`; bỏ phần `#…` trước `existsSync`), :41-51 (`brokenLinks`, `existsSync` của Windows không phân biệt hoa / thường); e2e/guide/links.spec.ts:7-23 (chỉ thử `linkTargets`); e2e/guide/check.guide.ts:11-13; spec docs/design/phase-6-hoan-thien.md:236, :245 ("mọi link / ảnh tương đối tồn tại") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-283 (CODE_SPAN), DR6-155 · có từ trước, lượt 1–5 bỏ sót; S2 tìm (S2-2), phiên chính đọc lại `links.ts`, `links.spec.ts`
```

- **Mô tả:** (a) link `#anchor` (trong trang hay `file.md#…`) không được kiểm: 105 / 224 đích của hướng dẫn có anchor; (b) đường dẫn so bằng `existsSync` của Windows, không phân biệt hoa / thường, trong khi GitHub phân biệt; (c) không ca nào cho thấy bộ kiểm bắt được link hỏng: tắt hẳn phần phát hiện, mọi test vẫn xanh.
- **Tái hiện / bằng chứng:** S2 (bản chép `mirror-g`, trả lại sau mỗi lần): `node s2-e2e\guide\p-anchors.mjs` → "12 md, 224 targets…, 105 with an #anchor", hiện 0 anchor hỏng, 0 sai hoa / thường; `guide-mut.mjs` chạy `check.guide.ts` của repo trên chữ đã sửa tạm: G-anchor (đổi "### Nhập backup" → "… từ file", hỏng 3 link) SURVIVED, G-inpage SURVIVED, G-case (`img/02-Tong-Quan.png`) SURVIVED, G-control (ảnh thiếu) KILLED; `links-mut.mjs`: L-localPath-null, L-exists-never SURVIVED (`links.spec` 2 ✓, `check.guide` 2 ✓), L-no-images, L-sizes-empty-dir KILLED. Phiên chính đọc lại `links.ts:26-58`, `links.spec.ts:1-23`.
- **Cùng mẫu:** `git grep -n "brokenLinks\|linkTargets\|localPath"` (S2): chỉ `e2e/guide`; repo không có bộ kiểm link nào khác.
- **Ảnh hưởng:** sửa một tiêu đề hướng dẫn thì link anchor trên GitHub rơi về đầu trang mà bộ kiểm vẫn xanh; ảnh sai hoa / thường xanh trên máy Owner nhưng không hiện trên GitHub. Hôm nay chưa có link hỏng.
- **Chặn phát hành:** không — trục T (K48).
- **Đề xuất:** `brokenLinks` kiểm anchor theo id tiêu đề kiểu GitHub và so tên đúng hoa / thường (`readdirSync`); `links.spec` thêm một ca trên cây giả có link hỏng, anchor hỏng, sai hoa / thường. ≈ 25 dòng + ≈ 25 dòng test.

### CLR6-F8 — Luật K49 "mục [sau v1.0] không gộp, PR ghi 'để lại (K49)'" chưa vào lời nhắc của `notes-for`, ô "Ghi chú OPEN liên quan" của mẫu Issue và bước 6 của `/session-start`

```
ID: CLR6-F8
Mức: Nit
Trục: C
Vị trí: tools/notes-for.mjs:37-42 (`PLAN` "Gộp vào task những mục "Trùng file" còn vừa phạm vi và cỡ…", `ANSWER`, `CHECK`); .github/ISSUE_TEMPLATE/task.yml:36-44 (ô "Ghi chú OPEN liên quan"); .claude/commands/session-start.md:15 ("các mục "Trùng file" của `notes-for` sẽ gộp vào task") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-386 (#1120, PR #1127) · mới do đợt sửa sau lượt 5 (sửa một phần); S1 tìm (S1-2), phiên chính đọc lại
```

- **Mô tả:** T-386 đưa luật K49 vào `CLAUDE.md:40`, `.github/pull_request_template.md:13`, `.claude/skills/review-pr/SKILL.md:91`, `docs/agents/issue-tracker.md:10`, `.claude/skills/auto-issues/SKILL.md:241`. Ba chỗ khác cùng nói về mục "Trùng file" chưa có: lời nhắc của `notes-for` (chế độ `<issue>` / `--files` vẫn bảo "Gộp vào task…", `--diff` không nhắc "để lại (K49)", `--pr` không nhắc luật chặn PR sửa mục [sau v1.0]); mô tả ô "Ghi chú OPEN liên quan" của `task.yml` ("ghi mục nào gộp vào task … và mục nào để lại"); bước 6 của `/session-start`.
- **Tái hiện / bằng chứng:** `node s1-tools\p-notes-k49.mjs` (S1, lõi `notes-core` trên sổ thật ở `5b1328a`; `p-notes-k49.log`): 5 mục lá OPEN, cả 5 `**[sau v1.0]**`; với đích `.claude/skills/review-pr/SKILL.md` lệnh in "Trùng file (2): L16 …, L18 …" rồi "Gộp vào task những mục "Trùng file" còn vừa phạm vi và cỡ…". Phiên chính đọc lại `notes-for.mjs:36-42`, `task.yml:36-44`, `session-start.md:15`, `CLAUDE.md:40`.
- **Cùng mẫu:** `git grep -n -E "notes-for|Ghi chú OPEN liên quan|Trùng file" -- ':!docs/reviews/**' ':!docs/state/**' ':!docs/process/**' ':!tools/*.test.mjs'` (S1): có K49 ở 5 chỗ trên; thiếu ở 3 chỗ trên; `to-tickets/SKILL.md:86` trỏ `issue-tracker.md` nên đủ.
- **Ảnh hưởng:** phiên code chạy `notes-for <I>` (auto-issues §3.1 bước 2) đọc "Gộp vào task", có thể gộp một mục [sau v1.0], rồi review chặn: mất một vòng review. Nhãn [sau v1.0] vẫn hiện ở đầu mục.
- **Chặn phát hành:** không — Nit trục C.
- **Đề xuất:** ba hằng chuỗi của `notes-for` nhắc K49 (hay `formatRelated` tách riêng mục [sau v1.0]); một câu cho `task.yml` và `session-start.md`. ≈ 3–10 SP + ≈ 10 test. `notes-for` trong rào "không tự sửa" và đóng băng K49; `session-start.md` là PR docs, sửa được ngay.

### CLR6-F9 — (KNOWN, bằng chứng mới) Cỡ "so ngân sách" của PR sửa: mẫu PR tính so `main`, review tính so nhánh base — PR xếp chồng luôn lệch

```
ID: CLR6-F9
Mức: Nit
Trục: C
Vị trí: .github/pull_request_template.md:33 (`git diff --numstat -M origin/main...HEAD`) ↔ .claude/skills/review-pr/SKILL.md:104 (`origin/<baseRefName>...<headRefOid>`) (5b1328a)
Tình trạng: KNOWN (mục OPEN [sau v1.0] của sổ, review PR #1127: cùng `SKILL.md:104` / mẫu PR `:33`, "hai người hai số"), có bằng chứng mới: nguyên nhân thứ tư mà mục sổ không nêu
Liên quan: T-386 (PR #1127) · mới do đợt sửa sau lượt 5; S1 tìm (S1-3)
```

- **Mô tả:** với PR xếp chồng (base là nhánh khác `main`), mẫu PR tính cỡ trên `main...HEAD` (gồm cả diff của nhánh base), review tính trên `<base>...<head>`. Mục "Cỡ so ngân sách" của thân PR khi đó luôn "không khớp diff" (chặn) hay bị so 1,5 lần sai.
- **Tái hiện / bằng chứng:** `node s1-tools\p-stacked-size.mjs` (S1; repo nháp tự xóa; `p-stacked-size.log`): nhánh base thêm 60 dòng, PR sửa thêm 10 → theo mẫu PR 71 dòng sản phẩm, theo review-pr 10.
- **Cùng mẫu:** `grep -n "origin/main\.\.\.\|baseRefName"` trên skill, mẫu PR, `CLAUDE.md`, `issue-tracker.md` (S1): chỉ hai dòng này nêu cách tính cỡ.
- **Ảnh hưởng:** chỉ PR sửa xếp chồng, làm tay (pipeline không dùng PR xếp chồng).
- **Chặn phát hành:** không — Nit trục C.
- **Đề xuất:** mẫu PR ghi `origin/<base>...HEAD`; gộp vào cách sửa của mục sổ đã có. 1 dòng.

### CLR6-F10 — Bảng so của probe hiệu năng (`markdownTable`): thao tác chỉ có ở nền bị mất, dấu của Δ làm tròn không nhất quán, ngưỡng so trên trung vị đã làm tròn, luật bộ nhớ lệch chữ `phase-6.md`

```
ID: CLR6-F10
Mức: Nit
Trục: C (T)
Vị trí: e2e/perf/stats.ts:139-170 (`markdownTable` chỉ duyệt `run.ops` :143), :122-129 (`format` / `signed`), :147 (so ngưỡng trên `op.median` đã làm tròn ở :59), :95-99 (MB: cả +20 % và +5 MB) ↔ docs/metrics/phase-6.md:99 ("nền + 5 MB, như luật ⚠️ của probe"), e2e/perf/README.md:86 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-283 (#572 `ratio`) · có từ trước; S2 tìm (S2-5), phiên chính đọc lại `stats.ts:52-62`, `:88-100`, `:118-172`, `phase-6.md:99`
```

- **Mô tả:** (a) thao tác chỉ có ở nền (vd. `app.open-data` khi probe nối vào exe đã tải lại) biến mất khỏi bảng so, dù `compareRuns` có tính; (b) Δ làm tròn về 0 lúc ghi "0 ms (−2%)", lúc "+0 ms (+2%)" (đã có ở bảng của `baseline.md` và `phase-6.md`); (c) trung vị 199,96 ms hiện "< 200 ms ❌"; (d) luật bộ nhớ của code chỉ khác chữ `phase-6.md` khi heap nền > 25 MB (hiện 16,5–17,1 MB).
- **Tái hiện / bằng chứng:** S2 `node s2-e2e\stats\p-stats.mjs` (bản chép `stats.ts` trùng sha256) → `p-stats.log`: "| `a` | … | 20 ms | 0 ms (−2%) |" và "+0 ms (+2%)"; "median 199.96 → stored {median:200…} … < 200 ms ❌"; "heap 30 → 35.5 MB (+5.5 MB, +18%): worse=false"; `compareRuns` có `app.open-data` (nền 387) mà bảng chỉ có một dòng. Phiên chính đọc code tương ứng (vd. `signed`: `value >= 0 ? '+' : ''` trên số chưa làm tròn).
- **Cùng mẫu:** `markdownTable` dùng ở `probe.perf.ts:624` và script so lượt của kế hoạch deep review (S2).
- **Ảnh hưởng:** người đọc bảng so không thấy thao tác bị thiếu; dấu và ✅ / ❌ lệch ở biên. Không đổi số đo.
- **Chặn phát hành:** không — Nit.
- **Đề xuất:** thêm dòng cho thao tác chỉ có ở nền; `signed` theo giá trị đã làm tròn; so ngưỡng trên trung vị chưa làm tròn; chép lại một câu luật MB cho khớp. ≈ 10 + 10 dòng.

### CLR6-F11 — Hai helper e2e chép nguyên văn giữa hai spec (`openProfile`, `pickTeam`)

```
ID: CLR6-F11
Mức: Nit
Trục: B
Vị trí: e2e/customer-appointments.spec.ts:7-24 và e2e/customer-policies.spec.ts:8-25 (`openProfile`, 17 dòng giống từng chữ); e2e/appointments.spec.ts:801 và e2e/customers.spec.ts:91 (`pickTeam`, 7 dòng) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót (cùng nhóm ở `37a80b6`); S3 tìm, phiên chính so hai thân hàm
```

- **Mô tả:** hai helper chép vào hai spec thay vì nằm ở `e2e/support.ts` (nơi đã có `createKycCustomer`, `panelOf`…); `openProfile` còn hai biến thể gần giống ở `e2e/dialog-keyboard.spec.ts:7` và `e2e/guide/shots.guide.ts:107`.
- **Tái hiện / bằng chứng:** `node s3-bloat-perf\dup-scan-tests.mjs 35` (S3): "files 163, bodies grouped 3005, repeated in ≥ 2 files: 3" — `openProfile` ×2 (17 dòng), `pickTeam` ×2 (7 dòng), `withIndexKeyOff` ×2 (chép có chủ ý theo review PR 674, không tính); cùng lệnh trên cây `37a80b6`: cùng ba nhóm. Phiên chính in `customer-appointments.spec.ts:5-25` và `customer-policies.spec.ts:6-26`: thân giống từng chữ.
- **Cùng mẫu:** ba nhóm trên là mọi nhóm trùng ≥ 35 token ở 163 file test / e2e (S3; bản cấu trúc 100 / 150 token chỉ ra hai nhóm này).
- **Ảnh hưởng:** chỉ chi phí giữ test (sửa bước mở hồ sơ, như T-262, phải sửa ở hai–bốn nơi); ≈ 24 dòng test chép.
- **Chặn phát hành:** không — Nit trục B (K48); K49: không gỡ vì bloat.
- **Đề xuất:** đưa hai helper vào `e2e/support.ts`; ≈ −24 dòng test, 0 dòng SP; chỉ khi Owner chọn.

### CLR6-F12 — Các khối `languageOptions.globals` của ESLint cho file TS không có tác dụng (`no-undef` đã tắt cho TS)

```
ID: CLR6-F12
Mức: Nit
Trục: B
Vị trí: eslint.config.js:29-32 (packages/domain: `globals: {}`), :39-42 (packages/db: `globals: { crypto }`), :33-38 (apps/desktop/src/**/*.{ts,tsx}: `globals.browser`), :61-69 (`*.config.{js,ts}`: `globals.node`, phần `.ts`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót; S1 tìm (S1-4), phiên chính chạy lại
```

- **Mô tả:** `tseslint.configs.recommended` tắt `no-undef` cho file TS, nên mọi khối `globals` gắn cho `.ts` / `.tsx` không đổi gì; khối `globals: {}` của domain trông như luật cấm global nhưng không cấm. Việc cấm thật do tsconfig (domain, ai: lib ES2023, `types: []`).
- **Tái hiện / bằng chứng:** phiên chính chạy lại `node s1-tools\p-eslint-globals.mjs` (ESLint `lintText`, không ghi file): `packages/domain/src/probe-s1.ts => (no message)`, `packages/db/src/probe-s1.ts => (no message)` (dùng `window.location.href`), `tools/probe-s1.mjs => no-undef: 'window' is not defined. | no-undef: 'process' is not defined.` S1 `p-tsc-globals.mjs`: tsc của domain / ai chặn `window`, `process`, `crypto`, `console`; db chặn `process`.
- **Cùng mẫu:** bốn khối ở Vị trí; khối `**/*.cjs` (`sourceType`) có tác dụng.
- **Ảnh hưởng:** chỉ gây hiểu nhầm khi đọc cấu hình; không đo được chi phí.
- **Chặn phát hành:** không — Nit trục B; K49.
- **Đề xuất:** gỡ các khối đó hay ghi chú "tsc giữ, ESLint không"; ≈ 8 dòng cấu hình, sau v1.0.

### CLR6-F13 — Hai ca e2e đọc `apps/desktop/dist` trên đĩa thay vì bản server đang phục vụ

```
ID: CLR6-F13
Mức: Nit
Trục: T
Vị trí: e2e/chart.spec.ts:121 (`join(import.meta.dirname, '../apps/desktop/dist/assets')`); e2e/theme.spec.ts:286 (`readdir(new URL('../apps/desktop/dist/', import.meta.url))`); playwright.config.ts:41-42 (`reuseExistingServer: process.env.PW_REUSE === '1'`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR-79 · có từ trước; S2 tìm (S2-6), phiên chính `rg "apps/desktop/dist|PW_REUSE"` trên `e2e`, `playwright.config.ts`
```

- **Mô tả:** hai ca kiểm chunk / file trên đĩa của checkout, không phải bản server đang chạy. Với `PW_REUSE=1` (config cho phép) ca kiểm một bản khác bản đang chạy, hay ENOENT nếu chưa dựng.
- **Tái hiện / bằng chứng:** trong lần đối chứng của S2, server phục vụ `dist-base` (`assets/index-Bsl_6Gio.js`) còn `chart.spec.ts` đọc dist của repo qua junction (`index-BRZxFXc1.js`, dựng 11:48); ca vẫn xanh vì chunk chart trùng tên và cỡ (`chart-Zomw1zIK.js` 513 302 B).
- **Cùng mẫu:** `rg -n "apps/desktop/dist" e2e` → chỉ hai chỗ trên (`serve.mjs` ghi, không đọc).
- **Ảnh hưởng:** chỉ khi chạy lại với server cũ; CI luôn dựng mới.
- **Chặn phát hành:** không — Nit.
- **Đề xuất:** lấy chunk qua `request.get` từ trang (tên chunk đọc từ `index.html`), hay ghi rõ trong comment rằng hai ca chỉ đúng khi không `PW_REUSE`. ≈ 5 dòng.

### CLR6-F14 — Luật lint "lấy `test` từ `e2e/fixtures.ts`" chỉ áp cho `e2e/**/*.ts`, còn Playwright chạy cả spec `.tsx` / `.mts` / `.js` / `.mjs`

```
ID: CLR6-F14
Mức: Nit
Trục: T
Vị trí: eslint.config.js:79-80 (`files: ['e2e/**/*.ts']`) ↔ playwright.config.ts:11 (`testDir: 'e2e'`, không đặt `testMatch`: mặc định nhận `.spec` / `.test` mọi đuôi JS / TS) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-129, T-283 mục 3 · có từ trước; S2 tìm (S2-7), phiên chính đọc lại `eslint.config.js:75-96`, `playwright.config.ts:11`, `:35-36`
```

- **Mô tả:** luật chặn `test` của Playwright (đọc ngày giờ của máy, DR6-129) chỉ áp cho `.ts`; một spec `.tsx` / `.mts` / `.js` / `.mjs` trong `e2e/` vẫn được Playwright chạy mà lint không báo.
- **Tái hiện / bằng chứng:** S2 `node s2-e2e\mirror\p-lint-ext.mjs` (ESLint và config của repo trên bản chép) → `p-lint-ext.log`: "e2e/probe.spec.ts: no-restricted-* 1 … probe.spec.tsx: 0, .mts: 0, .js: 0, .mjs: 0; probe.test.ts: 1".
- **Cùng mẫu:** `tsc -p e2e` cũng chỉ đọc `.ts`; hiện mọi spec đều `.ts`.
- **Ảnh hưởng:** chỉ khi ai đó viết spec đuôi khác.
- **Chặn phát hành:** không — Nit.
- **Đề xuất:** `files: ['e2e/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']`, hay đặt `testMatch: '**/*.spec.ts'`; thêm một ca vào `fixtures.spec.ts`. ≈ 2 + 2 dòng.

## 6. Bloat và Hiệu năng (toàn codebase)

### 6.1 Bloat

Số cổng, bundle, exe, coverage ở `common\baseline.md` (bước chuẩn bị, cùng máy). S3 chạy lại các phép đo của Claude F lượt 5 và thêm vài phép trên cả hai bản (`37a80b6` ↔ ghim, cùng mã); log ở `F\s3-bloat-perf\logs\`. Không cài công cụ mới.

| Đã chạy / đo | Trên | Kết quả (so lượt 5) | ID |
|---|---|---|---|
| `exports-f.mjs` (= lượt 1–5) | `tools/*.mjs`, helper e2e, hook `.claude`, `ui/scripts` | 62 dòng (lượt 5: 61): thêm `STALE_HEAD_MS` (T-379; hằng dùng trong file, export cho test biên, đúng mẫu seam); không dòng "nowhere" mới | — |
| `exports-all.mjs` (mới; mọi export của file sản phẩm theo `classifyFile`, cùng mã trên `37a80b6` và ghim) | 213 file SP | 1 141 export (`37a80b6`: 1 132): +10 (`CELL_NAME`, `TeamsDeletedAt`, `ToldBy`, `goneText`, `teamsDeletedAt`, `toldApart`, `isBlankWebAnswer`, `searchText`, `STALE_HEAD_MS`, `heldFor`), −1 (`codedCustomers`); mọi export mới có nơi dùng sản phẩm trừ `STALE_HEAD_MS` (seam test). Không dùng bởi code sản phẩm: 172 (`37a80b6`: 171; 75 chỉ test, 26 kiểu qua barrel, 71 dùng trong file) | — |
| Thân hàm trùng nguyên văn ≥ 25 token (`dup-scan.mjs`) | 216 file SP | 0 nhóm (1 137 thân; lượt 5: 1 128) | — |
| Trùng theo cấu trúc ≥ 35 token (`dup-scan-struct.mjs`) | như trên | 6 nhóm, đúng 6 nhóm của lượt 4–5; không nhóm mới | — |
| Trùng ở test / e2e (`dup-scan-tests.mjs` 35 / 60 / 120, bản cấu trúc 100 / 150; mới) | 163 file test / e2e | 3 nhóm, y hệt ở `37a80b6`: `openProfile` ×2, `pickTeam` ×2, `withIndexKeyOff` ×2 (chép có chủ ý) | CLR6-F11 |
| Khóa i18n (`keys.mjs`) | `vi.ts` ↔ `apps/desktop/src` | 1 197 khóa (lượt 5: 1 194; +3 `trash.goneAt`, `trash.blocked.teamDeletedAt`, `trash.restoreLabel.deletedAt`), 0 không dùng, 0 chỉ test dùng | — |
| Mã lỗi ↔ câu (`p9-error-keys.mjs`) | `DB_ERROR_CODES` 59, AI 10 | thiếu câu đúng 5 mã như lượt 1–5 (mỗi mã có đường hiện riêng) | — |
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` | `apps/desktop`, `e2e`, `packages/ui` | 0 lỗi | — |
| Dependency (`git diff --stat 37a80b6 5b1328a` trên mọi `package.json`, `pnpm-lock.yaml`, `Cargo.toml`, `Cargo.lock`; `deps-used.mjs`) | 6 manifest | không đổi; mọi dependency có nơi dùng | — |
| Cấu thành bundle (`split-build.mjs`, một chunk mỗi package / dependency) | `vite build` ghim | JS + CSS 2 373 815 B (lượt 5: 2 371 007, +2 808; gzip +813). Chunk đổi: `app-routes` +2 127, `app-i18n` +177, `pkg-db` +137, `pkg-ui` +95, `index.css` +92, `pkg-ai` +82, `pkg-domain` +54, `app-data-shell` +44. **Mọi chunk dependency trùng từng byte lượt 5** | — |
| Cấu thành +2 716 B JS theo file (cặp build có sourcemap `37a80b6` ↔ ghim, `cmp-attr.mjs`) | 149 module SP trong bundle | cụm Thùng rác ≈ 1 787 B (66 %: `trash-view.ts` +1 305, `SettingsTrash.tsx` +295, `vi.ts` +177, `RestoreDialog` +10; DR6-160, T-368, T-377, T-380, T-382); lớp chống tràn tên liền dài ≈ 600 B (`AppointmentsScreen` +180, `CustomersScreen` +125, `SelectField` +95, `StageBlock` +63, `KycHistory` +42, `classes.ts` +34; DR6-170, T-376); phần còn lại vài chục byte (sourcemap gán sai một ít khi minifier gộp: chỉ tin cấp chunk) | — |
| Code chỉ cho test / công cụ lọt vào bundle | sourcemap + `git grep` | 0 module khớp `test|spec|golden|fixture|test-support|token-guard|scripts/` trong 149 module; `demo-snapshot.ts` góp 269 B; không file sản phẩm nào import `vitest` / `test-support` | — |
| Bản dựng thật, exe (`baseline.md`) | `pnpm build:exe` ở SHA ghim | `index.js` 894 865 B (+2 681 so lượt 5), `index.css` 30 387 B (+92), JS / CSS 2 369 229 B (+2 773, +0,12 %); "Tệp khác" 1 022 121 B (= lượt 5); exe 5 649 408 B (= lượt 5, lượt 4, G7) | — |
| `lint:deps`, `codemap:check`, coverage (`baseline.md`) | cổng | 0 vi phạm (354 module, 1 582 dependency, = lượt 5); codemap khớp; coverage 99,24 / 97,45 / 99,15 / 99,39 % (lượt 5: 99,21 / 97,4 / 99,13 / 99,38) | — |
| Cỡ dòng (`baseline.md`) | 6 gói | SP 39 586 (+509), test 57 352 (+1 524); diff sửa ngoài tài liệu 61 file, +2 269 / −236 (gói F: SP +176 / −28, test +665 / −24) | — |

Phát hiện B: **CLR6-F11** (Nit). Không có code chết có chi phí đo được, không export chết mới, không khóa i18n thừa, không dependency đổi, không code test / công cụ trong bundle. Gần 2 / 3 phần bundle tăng là cụm tên nút / dòng lý do của Thùng rác (họ DR6-160, Nit): phiên chủ đề G xét chi phí giữ so với ca Nit. Công cụ nên có (G4, chỉ đề xuất, như lượt 4–5): visualizer bundle, `cargo-bloat`, `knip` / `jscpd`; các script `exports-all.mjs`, `dup-scan*.mjs`, `split-build-ab.mjs` + `cmp-attr.mjs` của S3 thay được một phần.

### 6.2 Hiệu năng

**Exe ở SHA ghim** (bước chuẩn bị, `baseline.md`; Home PC; không đo lại vì bên khác chạy e2e / đo trong lúc gói F chạy): **không dòng nào ⚠️** ở cả ba bảng (so mốc sau #656, G7 `233c77e`, lượt 5 `37a80b6`); mọi thao tác trong ngưỡng `phase-6.md`.

| Thao tác (exe) | Lượt 6 | Lượt 5 | G7 | Mốc sau #656 | Ngưỡng |
|---|---|---|---|---|---|
| Mở lần đầu, gọi exe → LCP | 3 612 ms | 3 535 | 3 420 | 3 663 | xấu hơn khi > 4 396 ms; "không chậm hơn exe Phase 4" > 4 724 ms ✅ |
| Mở lại trên dữ liệu tải (LCP) | 688 ms | 710 | 617 | — | luật nhiễu so G7: > 740 ms ✅ |
| `app.open-data` / `db.save` | 364 / 147 ms | 330 / 150 | 320 / 148 | 387 / 151 | ≤ 600 / ≤ 400 ✅ |
| `reload.*` (6 màn) | 281–406 ms | 285–407 | 280–395 | 283–398 | < 500 ✅ |
| Thao tác màn còn lại (lịch hẹn, KH, AI, Tổng quan, Báo cáo, Thùng rác; 20 dòng) | 4–33 ms | 2–33 | 2–33 | 2–34 | < 200 ✅ |
| `backup.read` / `import` / `export` | 979 / 44 / 427 ms | 983 / 50 / 438 | 975 / 44 / 435 | 835 / 43 / 438 | ≤ 2 000 / 500 / 1 000 ✅ |
| `appointments.next-month` / `next-year` | 109 / 107 ms | 111 / 108 | 112 / 109 | 101 / 107 | ≤ 300; Năm − Tháng ≤ 50 ✅ |
| JS heap | 16,8 MB | 16,7 | 16,7 | 16,5 | ≤ 21 MB ✅ |
| Dọn sạch: bấm → 11j (dữ liệu tải) | 120,5 ms | 128,0 | 130,5 | — | ≤ 500 ms (K30) ✅ |

Dòng tăng nhiều nhất so lượt 5 đều dưới luật nhiễu: `appointments.period-week` +8 ms (+67 %, 19 ms), `customer.ai-history` +7 ms (+300 %, 10 ms), `reports.export-excel` +6 ms (+27 %): mọi Δ ≤ 10 ms. Lần lưu DB đầu của lần mở đầu 151 ms (lượt 5: 150): chênh so #656 / G7 như lượt 5 đã giải thích (máy / thư mục lúc đo).

**Hàm thuần trong Node, A/B xen kẽ cùng tiến trình `37a80b6` ↔ ghim** (S3, `perf-ab.mjs`, 40 vòng × 3 lần, Node v24.20.0; CPU trung bình lần 2 57 %, lần 3 20,6 % vì các phiên / subagent khác chạy song song; chỉ kết luận từ cặp xen kẽ; `s3-bloat-perf\logs\perf-ab-aggregate.log`):

| Phép đo (dữ liệu tải) | `37a80b6` | Ghim | Δ | ⚠️ (> 20 % và > 10 ms) |
|---|---|---|---|---|
| `filterTrash` mỗi phím, 113 / 1 313 dòng | 0,107 / 1,299 ms | 0,178 / 2,005 ms | +0,07 / +0,71 ms | không |
| `filterTrash` mỗi phím, 1 313 dòng, tên KH ≈ 129 ký tự | 5,23 ms | 9,10 ms | +3,87 ms (+74 %) | không |
| `searchCustomers` (6b) mỗi phím, 1 481 KH / tên ≈ 129 ký tự | 2,07 / 7,52 ms | 3,56 / 12,78 ms | +1,49 / +5,26 ms | không |
| Dựng mọi dòng Thùng rác (`toldApart`, `teamsDeletedAt`, tên, "Thuộc", nhãn nút, lý do), 113 / 1 313 / 2 626 dòng | 0,67 / 5,84 / 14,06 ms | 0,74 / 6,99 / 17,00 ms | +0,07 / +1,14 / +2,95 ms | không |
| Sắp cột "Thuộc", 1 313 dòng | 13,98 ms | 14,03 ms | 0 | không |
| Câu tìm dán 100 000 ký tự (`searchText`) | 0,03–2,22 ms | 0,31–3,60 ms | ≤ +1,4 ms | không |

`searchText` (T-377) làm mỗi phím ở hai ô tìm chậm ≈ 1,7× (thêm ba lượt regex của `normalizeText` mỗi dòng), nhưng tuyệt đối ≤ 12,8 ms mỗi phím ở trường hợp xấu nhất, ≪ 200 ms; `useMemo` giữ kết quả theo chữ gõ. **DR6-165 trên màn** (phiên chính, mục 2.1): lần bấm AI trích xuất đầu trung vị 49 ms (mốc 53). `importBackup`, `listTrash`, `byName`, Mock trong Node: A, C đo lại, không đổi quá luật nhiễu.

**Không có phát hiện P.** Không thao tác chính nào vượt ngưỡng `phase-6.md`; không dòng nào quá luật nhiễu so mốc sau #656, G7, lượt 5.

## 7. Bảng đếm mức × trục

### Gói F (14 phát hiện)

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 (F2) | 2 (F1, F3) | 0 | 0 | 0 | 0 | 0 | 2 (F4, F5) | 0 | **5** |
| Nit | 0 | 3 (F8, F9, F10) | 0 | 0 | 0 | 0 | 2 (F11, F12) | 4 (F6, F7, F13, F14) | 0 | **9** |
| **Cộng** | 1 | 5 | 0 | 0 | 0 | 0 | 2 | 6 | 0 | **14** |

Trong bảng, Fn = CLR6-Fn. Mỗi phát hiện đếm một lần ở trục chính (F1: C, phụ A; F3: C, phụ E; F7: T, phụ C; F10: C, phụ T). **CONFIRMED 13 / 14**, **KNOWN có bằng chứng mới 1** (F9); PLAUSIBLE 0 (riêng F3 có phần với `<side-sessions-event>` của pipeline ghi PLAUSIBLE vì chưa thấy app ghi thuộc tính ở thẻ đóng của khối đó). **Đề xuất chặn phát hành (K48): 0 / 14**; không chặn: 14. Phát hiện do subagent tìm đều được phiên chính kiểm lại trên code (đọc lại và / hoặc chạy lại probe, đột biến) trước khi ghi: F1 (S4), F2, F4, F5, F7, F10, F13, F14 (S2), F6, F8, F9, F12 (S1), F11 (S3); F3 là quan sát của chính phiên chính.

### Cả sáu báo cáo lượt 6 của Claude (A–F)

| Gói | Phát hiện | Critical / High / Medium | Low | Nit | Đề xuất chặn (K48) |
|---|---:|---:|---:|---:|---|
| A | 6 | 0 | 4 | 2 | 1 — CLR6-A5 (Low, D) |
| B | 1 | 0 | 1 | 0 | 0 |
| C | 13 | 0 | 10 | 3 | 1 — CLR6-C1 (Low, G) |
| D | 17 | 0 | 8 | 9 | 0 |
| E | 15 | 0 | 9 | 6 | 1 — CLR6-E4 (Low, D (A)) |
| F | 14 | 0 | 5 | 9 | 0 |
| **Cộng** | **66** | **0** | **37** | **29** | **3** |

Số của A–E lấy từ mục 5 và mục 7 của `claude\A.md` … `E.md` (mức, trục, trường "Chặn phát hành" của từng phát hiện). Họ lặp lại qua gói (để phiên tổng hợp gộp): tên liền dài (DR6-170: CLR6-C4, D3, E1, E2, F2), tên truy cập / chữ trùng giữa bản ghi trùng tên (DR6-160: CLR6-A1, C13, D5, D13, E3, F1), test hở, trục T (CLR6-A2–A4, A6, B1, C5–C10, D3, D8, D14, E2, F4–F7, F13, F14), quy trình mới của T-386 / K48–K49 chưa khớp mọi chỗ (CLR6-F8, F9 và các mục OPEN [sau v1.0] của sổ).

## 8. Đã xét, không thấy (gói F, theo trục)

- **E:** `auto-wait`: `parseArgs` (cờ thiếu / thừa / trùng, `--once`), `ciState` với `--not` (nhánh ở head, đi trước dưới / từ 3 phút, 404, lỗi mạng), `--since` (run cũ, `workflow_dispatch`, `push`, nhánh khác, `cancelled`, `startup_failure`, run xong chưa có check), sàn `failure` có / không `--since`; chạy cả `auto-wait.mjs` với `gh` giả và tên nhánh có `#` / dấu cách / `%` (F2, F3 của mục 4). `metRows` với tên KH chứa chữ trạng thái (F4). S1: pre-push 6 dạng ref, thân Issue LF / CRLF, hook gợi ý review với 6 prompt (thẻ đóng trần), đường dẫn non-ASCII, vị trí `#[cfg(test)]`. S2: neo ngày, múi giờ, giao thừa của e2e. S4: xuất → nhập file của chính app sau khôi phục, sau Dọn sạch, dữ liệu có tên trùng (F8); 3 896 lần khôi phục so điều Thùng rác hứa (F9). Thấy: CLR6-F2.
- **C:** dòng R tài liệu (DR6-171, T-371) khớp app / mockup / spec; skill `auto-issues` khớp `auto-wait` (trần chờ, mã thoát, "head của PR kẹt", hàng `:111`); `paths` của `ci.yml` = `CODE_DOCS` (có test); `EXE_PATHS` đủ theo hợp đồng; tham chiếu §L6.x trong skill `review-pr` có thật; nhãn trong assertion e2e theo nghĩa thường; luật nhiễu 20 % / 10 ms của README perf và `phase-6.md` khớp `stats.ts`. Thấy: CLR6-F1, F3, F8, F9 (KNOWN), F10.
- **D:** không đường dữ liệu nào của gói F đổi; không schema / migration / Rust đổi từ `37a80b6`; dữ liệu tải `tables` = lượt 5; chuỗi xuất → nhập, Dọn sạch, khôi phục: 0 lệch (S4); công cụ không ghi dữ liệu app (S1). Không thấy.
- **G:** không gọi dịch vụ AI; `eval-ai-core`: 27 đột biến, 25 bị giết (E07, E13 ở F6); Mock trích xuất trên màn trong nhiễu (DR6-165). Không thấy ngoài CLR6-C1 của gói C.
- **S:** cổng merge: `pr-core` 22 / 27, `pr-status` 3 / 4, `session-core` 9 / 12 đột biến bị giết, bản ghim đúng ở mọi đầu vào thử; pre-push chặn mọi cách đẩy / xóa `refs/heads/main`; `ci.yml` `permissions` chỉ đọc, `run:` chỉ nội suy số PR và tên repo; mọi probe trình duyệt 0 request ra ngoài 127.0.0.1. Hook gợi ý sai (F3) không phải ranh giới của sản phẩm. Không thấy.
- **P:** mục 6.2. Không thấy.
- **B:** mục 6.1. Thấy: CLR6-F11, F12.
- **T:** đột biến: phiên chính 29 / 30 bị giết (B03 gần tương đương); S1 112 / 142 bị giết (sống → F6 và năm con gần tương đương); S2: hai đột biến e2e sống (F4, F5), bộ kiểm hướng dẫn (F7); e2e đối chứng 328 / 328 bốn lần, không ca chập chờn. Thấy: CLR6-F4, F5, F6, F7, F13, F14.
- **A:** ngoài phần phụ của F1 (mô tả `aria-describedby` là dòng lý do chỉ có tên trần), không thấy; công cụ không có màn.

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r6\claude\F\`)

| File | Việc | Log / đầu ra | Dùng ở |
|---|---|---|---|
| `mut6.mjs`, `mutant-config.mjs` (chép cách làm của `-r5\claude\F\mut5.mjs`) | 30 đột biến `auto-wait-core`, `notes-core`, `review-hint-core` qua hook `load` | `mut6.log`, `mut6.stdout.txt`, `mut\<id>.out`, `vitest-control-tools.log` | DR6-175, 176, T-373, 378, 379, 383 |
| `old-37a80b6\tools\` | `auto-wait-core.mjs`, `pr-core.mjs`, `session-core.mjs` của `37a80b6` (byte từ `git show`) | — | DR6-176 |
| `p-cxr5f1.mjs` | `ciState` cũ ↔ ghim, 11 bộ đầu vào | `p-cxr5f1.log` | DR6-176, T-373, 378, 379, 383 |
| `aw-fake\tools\` | bản chép `tools/*.mjs` với `session-io.mjs` giả; `auto-wait.mjs --once` 5 ca | `aw-fake\run.log`, `aw-fake\calls.log` | T-379, T-383 |
| `web\build-dist.mjs`, `web\serve-dist.mjs`, `web\browser.mjs`, `web\pw-f.config.mjs` (chép lượt 5 / 4), `web\dist-base\` | bản web ghim neo 15/09/2026, 127.0.0.1:4941 (đã tắt) | `web\serve-4941.log` | mục 2, 5 |
| `web\p-metrows.mjs` | `metRows` cũ ↔ ghim ↔ DOM | `web\p-metrows.log` | DR6-177 |
| `dr165\p08-mock-long-note.mjs`, `dr165\p18-first-click.mjs`, `dr165\browser.mjs` (chép `-r5\claude\C\`) | lần bấm AI trích xuất trên màn | `dr165\p08-same-page-r6.log`, `dr165\p18-first-click-r6.log` | DR6-165 |
| `web\p-e4-arrows.mjs` | kiểm độc lập CLR6-E4 | `web\p-e4-arrows.log` | mục 4 F6, mục 10 |
| `p-hint-id.mjs` | `reviewedPr` trên khối app có thẻ đóng mang thuộc tính | `p-hint-id.log` | CLR6-F3 |
| `web\v-s2-long-dialogs2.log` | chạy lại `s2-e2e\p-long-dialogs2.mjs` của S2 trên cổng 4941 | — | CLR6-F2 |
| `r-tables-AE.txt`, `ae-findings.txt`, `known-accepted-heads.txt` | trích bảng R / trường phát hiện của A–E, đầu mục ACCEPTED để gộp | — | mục 2.3, 2.4, 7 |
| `new-findings.md`, `tail.md` | bản nháp các mục của báo cáo | — | — |
| `s1-tools\` (S1) | `mut6.mjs` (142 đột biến), `p-gate-survivors`, `p-notes-k49`, `p-stacked-size`, `p-eslint-globals`, `p-tsc-globals`, `p-eval-padded`, `p-issue-body`, `p-tool-exports` (`.mjs` + `.log`), `control-tools.log` | — | CLR6-F6, F8, F9, F12 |
| `s2-e2e\` (S2) | bản web `dist-base` (cổng 4950–4953, đã tắt), `mirror\`, `mirror-g\`, `pw.config.mjs`, `e2e-run.mjs`, `mut-list.mjs`, `p-long-*`, `p-seg-wrap-*`, `p-history-cap-*`, `p-lint-ext`, `stats\p-stats`, `guide\{p-anchors,guide-mut,links-mut}` | `e2e-mut.log`, `build-base.log`, các `.log` | CLR6-F2, F4, F5, F7, F10, F13, F14 |
| `s3-bloat-perf\` (S3) | `exports-f`, `exports-all`, `dup-scan*`, `keys`, `p9-error-keys`, `deps-used`, `bundle\{split-build,mk-tree,split-build-ab,cmp-attr}`, `perf-ab`, `agg`, `big-query` | `logs\*` | mục 6, CLR6-F11 |
| `s4-chains\` (S4) | bản web `dist` (cổng 4960, đã tắt), `c1-namesake-lines`, `c1b-notice`, `c1c-dialog`, `c2-roundtrip`, `c3-effect-fuzz` | `.log` cùng tên | CLR6-F1, mục 4 F7–F9 |

### 9.2 Đột biến

- **Phiên chính (`mut6.mjs`, 07/11 19:47–19:50):** 30 đột biến; **29 KILLED**, **B03 sống** cả bộ 4 493 test (khớp "404" ở bất cứ đâu trong thông điệp — gần tương đương). Phiên chính chạy lại sáu đột biến sống của S1 (P31, P16c, P23, E13, N07b, P04): cả sáu sống (405 / 405 test `tools/`).
- **S1 (`s1-tools\mut6.mjs`):** 142 đột biến; 112 KILLED; 30 sống: P04, P05, P16c, P23, P31, P31b, P35 (cổng merge, → F6), N02, N03, N07b, N12, N14, N19, S12, S13, Z01, Z10b, Z13, Z15, Z17, C07, C08, R10, E07, E13 (→ F6); P02, PS1, S09, N01, C03 gần tương đương.
- **S2:** đột biến e2e qua bản dựng ngoài repo, chạy cả bộ 328 ca: S2M-seg-right, S2M-hist-all sống (F4, F5); bộ kiểm hướng dẫn: G-anchor, G-inpage, G-case, L-localPath-null, L-exists-never sống, G-control, L-no-images, L-sizes-empty-dir bị giết (F7).

### 9.3 Chạy ngoài repo, tác dụng phụ, ranh giới đọc

- **Repo:** không ghi file nào. Đột biến qua hook `load` của Vite; bản web, Playwright, probe, `auto-wait.mjs` với `gh` giả đều chạy trên bản chép / thư mục của gói F. Dòng cuối `mut6.log` (phiên chính và S1): `repo git status --short after: ""`; mỗi lần dựng web: `git status --short after: ""`; S3 gỡ 30 junction của `bundle\tree-37a80b6` trước khi xong, kiểm `node_modules` của worktree còn nguyên.
- **Mạng / AI:** không gọi `gh`, không công cụ repo nào gọi GitHub, không dịch vụ AI; mọi probe trình duyệt chặn mạng ngoài 127.0.0.1 và thay `window.open` từ lần chạy đầu (mọi log `requests blocked []`). Không exe nào chạy trong gói F (`Get-Process project2c` = 0).
- **Cổng:** phiên chính 4941; S2 4950–4953; S4 4960; S3 không dùng; cuối phiên không cổng nào trong 4940–4989 còn nghe. Không dùng 4173, `pnpm e2e`, `PW_REUSE`.
- **Hook gợi ý review sai (CLR6-F3):** lượt sau báo cáo của S3 có ngữ cảnh hook "Owner asked to review PR #674. Invoke the project skill `review-pr`…"; Owner không hỏi, quy tắc riêng 4 cấm `review-pr`: phiên không gọi skill nào.
- **Ranh giới đọc:** ngoài repo chỉ mở bằng đường dẫn đủ: `-r6\common\` (`prompt-claude.md`, `plan.md` §L6, `known.md`, `fixes.md`, `baseline.md`, `files-F.txt`), `-r6\claude\A.md` … `E.md`, probe lượt 5 của chính Claude theo tên mà báo cáo gốc lượt 5 ghi (`-r5\claude\F\{mut5,mutant-config,build-dist,serve-dist,pw-f.config,exports-f,dup-scan,dup-scan-struct,p9-error-keys,hooks,ui-stub}.mjs`, `-r5\claude\F\r4copy\browser.mjs`, `-r5\claude\F\bundle\split-build.mjs`, `-r5\claude\C\{p08-mock-long-note,p18-first-click,browser}.mjs`; `Test-Path` từng tên). Phiên chính có liệt kê (không đệ quy) hai lần chính thư mục kết quả của gói này (`-r6\claude\F\`, `-r6\claude\F\s4-chains\`) để xem tên probe — không thư mục nào khác của `-r6`. Không mở, không liệt kê, không tìm kiếm thư mục `codex\`, `workbuddy\`, `deepseek\`, `muse\` ở bất cứ lượt nào; không đọc báo cáo lượt 6 của bên khác. Bốn subagent nhận cùng ranh giới (tin giao việc nêu `prompt-claude.md`, quy tắc riêng 2–4 và phần chung) và báo không vi phạm.

### 9.4 Cuối phiên

- `git rev-parse HEAD`: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (= SHA ghim); `git status --short` của `C:\workspace\Project-2C-review`: **rỗng**, như đầu phiên.
- Không tiến trình `project2c`, không cổng 4940–4989 nào còn nghe.
- Giờ xong: **2026-11-07 20:32 (+07:00)**, Home PC (bắt đầu 19:39). git status --short kiểm lần cuối lúc 20:32: rỗng; HEAD 5b1328a.

## 10. Kết luận cho v1.0 ở SHA `5b1328a` (Claude, tham khảo — kết luận thật ở phiên tổng hợp)

**CHƯA SẴN SÀNG** theo K48: sáu báo cáo lượt 6 của Claude có **3 phát hiện đề xuất chặn phát hành** (đều Low ở trục chặn của K48), dù không có Critical / High / Medium nào và mọi dòng R đều ĐÃ SỬA.

1. **Đề xuất chặn (3):**
   - **CLR6-C1** (Low, **G**): V3 / V6 lọt "sẵn sàng / tiềm năng mua (F12)" và tên luật trong ngoặc kép / ngoặc đơn sau "Luật". Gói F đọc lại `packages/ai/src/blocklists.ts:35-38` (lớp sau cụm chỉ `[.,;:!?)]`) và `:108` (`LAW_NAME` đòi `\p{Lu}` ngay sau "luật"): khớp mô tả. Trục G thì K48 chặn; sửa cần một đợt G5 (version prompt mới) trong đóng băng K49.
   - **CLR6-E4** (Low, D (A)): ArrowDown trên ô "Thêm người phối hợp" đang đóng thêm người, rồi được lưu. Gói F chạy lại độc lập trên bản web (`web\p-e4-arrows.log`): hai lần ArrowDown → hai chip, Chi tiết sau khi tạo ghi "Phối hợp IS Bùi Văn Nga, BDM Hoàng Minh Quang". Chặn nếu tổng hợp xếp D (dữ liệu đã lưu, người phối hợp chặn xóa / đổi vai trò nhân sự); không chặn nếu xếp A.
   - **CLR6-A5** (Low, D): `.p2cbackup` của chính app trên 100 MB xuất được mà không nhập lại được. Gói F đọc lại `packages/db/src/backup.ts:44-66` (xuất không so cỡ) và `:80-83` (nhập từ chối `BACKUP_TOO_LARGE`): khớp. Chưa chạm được với dữ liệu v1.0 (≈ 0,15 trần); gói A ghi tổng hợp có thể hạ.
2. **Bảng R:** R1 **20 / 20 ĐÃ SỬA**, R2 **14 / 14 ĐÃ SỬA**; 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY (mục 2.3, 2.4). Phần còn hở của các dòng đều là Low / Nit trục T, E, A, đã ghi thành phát hiện không chặn (CLR6-A1, B1, C5, C6, C11, D1–D3, E1, E2).
3. **Mức:** 0 Critical / High / Medium trong 66 phát hiện (37 Low, 29 Nit). Gói F: 14 phát hiện, 0 đề xuất chặn; nặng nhất là hiển thị (F1 dòng lý do Thùng rác với bản ghi trùng tên, F2 hộp cuộn ngang với tên liền dài) và công cụ / test (F3 hook gợi ý review sai, F4–F7, F13, F14).
4. **Hiệu năng và bloat:** mọi thao tác trên exe trong ngưỡng `phase-6.md`, không dòng nào quá luật nhiễu so mốc sau #656, G7, lượt 5; DR6-165 trên màn trong nhiễu; bundle +2 773 B (+0,12 %), exe 0 B, không dependency đổi, không code test / công cụ trong bundle (mục 6).
5. **Nếu phiên tổng hợp hạ cả ba đề xuất chặn** (A5: chưa chạm với dữ liệu v1.0; E4: trục A; C1: chấp nhận như phần "Mất" của G5): không còn vấn đề chặn từ Claude A–F → SẴN SÀNG ở `5b1328a` theo K48, mọi phát hiện khác vào sổ [sau v1.0]. Chủ đề G, H, I của Claude chưa chạy.
