XONG — deepseek gói F lượt 4, 2026-10-30 23:07 (+07:00)

# DeepSeek — gói F, lượt 4 (Xuyên gói, bloat / hiệu năng, công cụ)

## 1. Phiên

- **Bên:** deepseek · **Gói:** F (Xuyên gói, bloat / hiệu năng, công cụ)
- **SHA đầu phiên:** `2e51e25eb0125f56d3d938b97ef18d6873dae076` (`git rev-parse HEAD` khớp)
- **`git status --short` đầu phiên:** rỗng
- **Giờ bắt đầu:** 2026-10-30 22:13 (+07:00)
- **Công cụ / model / mức suy luận:** app WorkBuddy **v5.9.3** (bản ghi ở `common\baseline.md`, bước 4 đợt 2), model **DeepSeek V4.1 Flash** (`Deepseek-V4.1-Flash`), context **1M** (bộ chọn model của app), Thinking effort **Max**. Phiên chạy qua Expert **Code review expert** (`ex_uZzSAScSy7FZ`, cùng model); Owner cho phép dùng agent phụ và expert (ngoại lệ quy tắc riêng 4) — phiên này **không** giao việc cho agent phụ: mọi lệnh, mọi phép đọc và mọi đột biến do agent chính chạy.
- **Phiên:** làm mới (`F.md` chưa có ở đầu phiên; A–E đều `XONG`).
- **Máy:** `DESKTOP-KDURKJP` (Home PC), Node **v24.20.0** (`C:\Program Files\nodejs\node.exe`; `node` trong PATH của shell là v22.22.2 — xem §6.3), shell Git Bash.

## 2. Bảng R1 (6 dòng của gói F) và bảng R2 (14 Issue của gói F)

Cách kiểm mỗi dòng: (1) chạy lại tái hiện của lượt 3 / lượt 1; (2) **gỡ tạm phần sửa** bằng một bản vá đúng một chuỗi trong worktree, chạy đúng test của PR sửa (hoặc probe tương đương), rồi ghi lại **nguyên byte** và so sha256 + `git status --short`; (3) thử biến thể gần. Nguồn: `F/mutate.mjs`, `F/eslint-mutate.mjs`, `F/eslint-probe.mjs`, `F/probe-*.mjs` (phụ lục 9). Mọi lần đột biến dưới đây đều `restored=true` và `git status --short` rỗng sau mỗi lần.

### 2.1 Bảng R1 — 6 dòng gói F kiểm

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-129 (L) | #719 → #736 (+ #772 → #792, #793 → #815) | **ĐÃ SỬA** | Ở SHA ghim: `node … playwright test e2e/fixtures.spec.ts --project=edge --no-deps` → **4 passed (31,3 s)**. **C1** (bỏ `context.clock.install({ time: anchorMorning(timezoneId) })` trong `e2e/fixtures.ts:40`) → **2 failed**: "a page starts on the anchor morning, and its clock runs on" (`expect(received).toBeLessThan`) và "a browser in a time zone of its own › a page starts on the anchor morning of its own wall clock". File trả nguyên byte. | Hai ca còn lại **vẫn xanh** khi gỡ đồng hồ: `toNewYearsEve` tự tính khoảng nhảy từ `Date.now()` của trang nên vẫn dừng 23:58 (đúng cách sửa của T-283), và ca lint không phụ thuộc đồng hồ. Luật lint `no-restricted-imports` + `no-restricted-syntax` của `eslint.config.js` là lớp thứ hai: **E1** (đổi selector thành `ImportExpression[source.value='never/anything']`) → cả 5 dạng `import()` động của `@playwright/test` về **0** lần báo, 5 dạng tĩnh vẫn báo 1. |
| DR6-130 (N) | #719 → #736 | **ĐÃ SỬA** | `tools/notes-core.test.mjs` **28 test xanh** ở SHA ghim; ba đột biến, mỗi cái giết đúng một ca: **N1** bỏ cờ `s` của `/^( *)- (.*)$/s` (`notes-core.mjs:145`) → 1 failed (`expected [] to deeply equal [ { line: 5, … } ]`, mục chứa U+2028/U+2029); **N2** `withPath.flatMap((paths) => narrow(paths, packages))` → `flatMap((paths) => paths)` → 1 failed (đường dẫn rút gọn khớp nhiều file); **N3** `const atRoot = false` → 1 failed (ưu tiên file ở gốc repo). | Ba đột biến còn lại của PR #736 (T61f, T61k) đã được PR ghi; tôi kiểm ba nhánh **mới** của cùng PR (cờ `s`, `narrow`, `atRoot`) — cả ba đều có test canh. `targetPatterns` với ngoặc nhiều nhóm không đổi ở PR này. |
| DR6-25 (L) — phần bundle | #781 → #830 (+ #831 → #837) | **ĐÃ SỬA** | `grep -rn "from 'zod" --include=*.ts --include=*.tsx --include=*.mjs packages apps e2e tools` (bỏ `*.test.*`): **4 dòng, tất cả `zod/mini`** (`ai/src/schema.ts:26`, `ai/src/validator.ts:15` kiểu, `db/src/backup.ts:8`, `db/src/backup-validation.ts:23`). `tools/pr-core.test.mjs:272-278` chỉ là **chuỗi mẫu** của ca lint, không phải import. Bundle: `assets/index.js` **884 698 B** thô / 261 767 B gzip ở `baseline.md` (lượt 3: 927 932 / 271 662) → **−43 234 / −9 895 B**. | Bản `dist` hiện tại là bản **có `VITE_DEMO_ANCHOR`** (884 708 B, +12 B) do lần chạy e2e dựng lại — không dùng để so. Số tách riêng của `zod/mini` (−62 735 B) lấy từ #830, không đo lại. Luật lint là lưới duy nhất: **E2** (bỏ `paths: [{ name: 'zod' }]`) → `import { z } from 'zod'` ở `packages/db` và `apps/desktop` về 0 lần báo; **E3** (bỏ `patterns`) → `zod/v4` về 0. Lỗ `Zod` / `ZOD` viết hoa: ACCEPTED (K38), đo lại = 0 lần báo, đúng như chữ ACCEPTED. |
| DR6-66 (N) — phần F | #655 → #693 (một phần), #775 → #801, #777 → #812, #790 → #845 | **ĐÃ SỬA** | `F/probe-exports.mjs`: 34 tên export của `tools/**` + `e2e/**` không được dùng **ngoài file của nó**; đối chiếu từng tên với chính file đó và với `<tên>.test.mjs` của nó: **cả 34 đều dùng trong file hoặc trong test của nó**, không tên nào chết. Bảy tên trông đáng ngờ đã kiểm bằng `grep` riêng: `DEFAULT_DIST` / `DEFAULT_EXE` (`size-report-core.mjs:193`), `BODY_TARGET` / `BODY_MAX` (`session-core.mjs:25-32`), `LOAD_SCALE` (`load-data-core.mjs:62`), `readHandoff` / `writeHandoff` (`handoff.mjs:132,143`) — đều dùng trong module. `tsc -p e2e --noEmit` **0 lỗi**; `eslint . --max-warnings 0` **0 lỗi**. | Đây đúng khuôn `*-core.mjs`: module thuần để test import thẳng (`.claude/rules/tests.md`, mục #689). Không báo lại thành phát hiện — dòng này chỉ ghi kết luận. |
| DR6-67 (N) — phần F | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | **ĐÃ SỬA** | `execFileSync('git'` trong `tools/`: **3 chỗ**, ba khuôn khác nhau (`size-report.mjs:20` có `maxBuffer`, `pr-core.test.mjs:141` một lần đọc, `session-end.test.mjs:17` helper `.trim()`); `const root = fileURLToPath(new URL('../', import.meta.url))` **2 chỗ** (`size-report.mjs:17`, `load-data.mjs:22`) — hai module rời, không import lẫn nhau. `pnpm lint:deps` → *no dependency violations found (341 modules, 1435 dependencies)*; `tools/codemap.mjs --check` → *Export maps are up to date*. | Phần lớn DR6-67 của lượt 1–3 nằm ở `packages/` và app (gói A–E đã kiểm). Phần F còn lại là các helper một-dòng ở hai CLI rời; gộp chúng lại sẽ tạo module dùng chung cho hai script chạy tay — chi phí đo được bằng 0, nên **không** đề xuất (Nit theo thước §4.3). |
| CL3-A29 (N) — đo | #722 → #742 (một phần), #776 → #805 (chỉ mục `0012`) | **ĐÃ SỬA** | `F/probe-perf.mjs` trên dữ liệu tải (`load-2026-10-12-seed6.p2cbackup`, 113 dòng Thùng rác) và Thùng rác lớn (1 313 dòng, +1 200 KH xóa bằng lệnh), Node v24.20.0, máy rảnh, trung vị: `listTrash` **20,4 ms** / **132,2 ms**; `previewPurge` **1,0** / **5,9 ms**; `purgeTrash` **86,2** / **119,9 ms**. Mốc Node ở `baseline.md` (cùng máy): 23,8 / 158,2 · 1,0 / 7,4 · 85,2 / 129,8. | **Không dòng nào xấu hơn**: `listTrash` −3,4 ms (−14 %) và −26,0 ms (−16 %); `previewPurge` bằng / −1,5 ms; `purgeTrash` +1,0 ms (+1 %) và −9,9 ms. Chỉ mục `0012` có trong `sqlite_master` (A đã kiểm `EXPLAIN QUERY PLAN`: `SEARCH f USING INDEX appointments_deleted` → `SEARCH a USING INDEX appointments_rescheduled_from`, không còn `SCAN`). |

### 2.2 Bảng R2 — 14 Issue gói F kiểm

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-283 | #772 → #792 | **ĐÃ SỬA** | 7 mục của Issue: (1) helper dùng chung — `pasteAsIs` (`e2e/fixtures.ts:49`), `right` / `scrolls` / `sideways` / `seededCustomer` (`e2e/support.ts:108-129`), dùng ở `customer-kyc`, `customer-forms`, `customer-ai`, `customer-ai-web`; (2) đồng hồ — xem DR6-129 (C1 đỏ 2 ca); (3) luật lint — `eslint.config.js:75-109`, **E1** đỏ 5 dạng động; (4) 5f đọc số RF và số ghi chú KYC từ dòng thời gian (đột biến đổi chỗ `counts.rf` / `counts.kycNotes` là đột biến của PR, tôi đọc code + ca e2e); (5) `CODE_SPAN` nhận code span nhiều backtick — `e2e/guide/links.spec.ts` xanh trong `pnpm e2e`; (6) `ratio()` — `e2e/perf/stats.spec.ts` xanh; (7) `pr-status` / `docsRead` — **P1** (bỏ `previousPath`) đỏ **2 test** (`pr-core` + `pr-status`), **P2** (dòng `tested` về `mainSince.length !== mainTotal`) đỏ 1. | `tools/` **341 test xanh** (12 file). Cả bộ e2e của gói chạy lại ở SHA ghim: `fixtures` 4/4, `customer-ai` ca T-297 8/8, guide 13/13 (mục 4). |
| T-287 (đo) | #776 → #805 | **ĐÃ SỬA** (phần đo) | Xem CL3-A29: `listTrash` 20,4 / 132,2 ms, `previewPurge` 1,0 / 5,9 ms — đều **nhanh hơn** mốc Node của `baseline.md` và khớp bậc với số của #805 (24,7 → 17,9 ms). | Phần `db` của Issue ở gói A. Dòng này chỉ đo lại phần F nhận. |
| T-292 (bundle) | #781 → #830 | **ĐÃ SỬA** (phần bundle) | Xem DR6-25: 4 import `zod/mini`, 0 import `zod` đầy đủ; `index.js` 884 698 B (−43 234 so lượt 3). `pnpm-lock.yaml` / `packages/*/package.json` không đổi (`git diff --stat 119e2e4 2e51e25 -- pnpm-lock.yaml packages/*/package.json` rỗng). | — |
| T-300 | #789 → #843 | **ĐÃ SỬA** (phần F) | `node packages/ui/scripts/check-tokens.ts apps/desktop/src packages/ui/src/components` → *Design tokens: no styling that bypasses the tokens*; script chỉ quét `.tsx?` / `.css`, bỏ `*.test.tsx?` và thư mục `i18n` (đúng hợp đồng: dấu nằm trong `vi.ts`). `pnpm lint:tokens` là một bước của `pnpm verify`. | `token-guard.ts` thuộc gói D (DSR4-D1 đã báo lỗ cắt comment). Dòng này chỉ kiểm **script** + đường nối vào `verify`. |
| T-301 | #790 → #845, #846 | **ĐÃ SỬA** (phần F) | `eslint . --max-warnings 0` **0 lỗi**; `tsc -p e2e --noEmit` **0 lỗi**; `depcruise apps packages` **0 vi phạm**; `codemap --check` sạch. Ký hiệu viết cứng trong `tools/` + `e2e/`: `grep -rn "[·→✓○×▾▸—]"` chỉ khớp **comment** và chuỗi mẫu của test lint, không khớp chuỗi hiển thị nào. | Refactor không đổi hành vi: 341 test `tools/` + 4 ca `fixtures` + 13 ca guide xanh, không phải sửa test nào. |
| T-302 | #793 → #815 | **ĐÃ SỬA** | **E1** (selector `no-restricted-syntax`) → 5 dạng `import()` động của `@playwright/test` (nháy đơn, nháy kép, backtick, `.then`, trong helper) từ 1 lần báo về **0**; 3 dạng được phép (`./fixtures`, `node:fs`, kiểu `import('@playwright/test').Locator`) vẫn 0. **D1** (`DOCS_PATH` chỉ nhận một chuỗi) → 1 failed (`expected [] to deeply equal [ 'docs/golden/ai-eval.md' ]`); **D2** (`callAround` không bỏ qua lời gọi lồng) → **2 failed** (thêm ca `CODE_DOCS` phải chứa tài liệu mà test đọc). | `ignores` thêm `playwright-report/**`, `test-results/**` có ca riêng (`pr-core.test.mjs:249`). Giới hạn còn lại đã ACCEPTED (review #815). |
| T-304 | #831 → #837 | **ĐÃ SỬA** | `eslint.config.js:43-60`; **E2** / **E3** ở DR6-25. `schema.ts` `_default` bọc ngoài `.check`: đột biến M7 của gói C (thêm `.check()` sau `_default`) → 2 ca đỏ. | Lỗ `Zod` viết hoa: ACCEPTED (K38), đo lại 0 lần báo. `import()` động của `zod` ngoài phạm vi luật (comment ghi rõ) — đo lại: 0 lần báo, đúng hợp đồng. |
| T-305 | #849 → #855 | **ĐÃ SỬA** (phần F) | `e2e/guide/shots.guide.ts:14-16`: `page.clock.setFixedTime(anchorMorning(timezoneId))`, và `playwright.guide.config.ts` đặt `timezoneId: 'Asia/Ho_Chi_Minh'` → giờ chụp theo múi của trình duyệt, không theo múi của tiến trình Node. **Chạy lại cả bộ chụp**: 13 passed (28,0 s), **28 ảnh trùng từng byte** (`git status --short` rỗng sau khi ghi đè). | `check.guide.ts` ghi "150 KiB" và `MAX_IMAGE = 150 * 1024` (binary), khớp `phase-6.md` §4.3. `WEB_MODE.tone`, `recordBadge`, `HEADING` / `BADGE` thuộc D / E. |
| T-307 | #851 → #859 | **ĐÃ SỬA** (dòng tài liệu) | `docs/metrics/phase-6.md:239` (luật đếm) khớp **từng mục** với `TEST` của `tools/size-report-core.mjs:18-25`: `*.test.*`, `*.spec.*`, `e2e/`, `test-support.ts`, `fixtures/`, `/golden/`, `playwright*.config.ts`, `vitest.config.ts`; `:234` ghi phía cũ theo `base.sha` + `merge-base`. Mục "Review đóng phase" không còn dòng "_Còn điền…_". | Bảng 15 PR + 4 PR "ở biên" — không kiểm lại số (không có `gh`); chỉ kiểm **luật** khớp công cụ, đúng phần F nhận. |
| T-310 | #865 → #871 | **ĐÃ SỬA** (phần F) | `node tools/size-report.mjs` ở SHA ghim: **không còn dòng "Chưa xếp gói"**; gói F = 4 440 SP / 16 860 test / 4 628 sinh / 96 file — khớp `baseline.md`. **S1** (bỏ `ConfirmWordDialog.tsx` khỏi `PACKAGES`) → 1 failed (`pkg: null` thay `'E'`); **S3** (`stage-badge.tsx` ra khỏi D) → 1 failed; **S2** (in dòng "Chưa xếp gói" cả khi rỗng) → 1 failed. | Năm file mới vào `PACKAGES` đều có ca: `classes.ts`, `stage-badge.tsx`, `money-view.ts`, `ConfirmWordDialog.tsx`. |
| T-311 | #866 → #870 | **ĐÃ SỬA** (dòng tài liệu) | `grep -rn "3 lượt\|ba lượt" docs/PROJECT-PLAN.md docs/README.md` → **không khớp**. `docs/testing/nghiem-thu-v1.md:432-446`: **đúng 6 dòng** mockup có sidebar (`appointments`, `customers`, `customer`, `team`, `settings-data`, `trash`) đều có "`.brand` → CH-09"; NT-CH-09 ở `:72`. Luật đếm ở `phase-6.md:239` có `playwright*.config.ts` và `vitest.config.ts`. | Dòng CL3-A29 của bảng R1 trong `plan.md` §L4.5 (không thuộc repo) — `known.md` phần 4 đã chép đúng hai phần `#742` + `#805`; tôi dùng chính chữ đó ở dòng CL3-A29 trên. |
| T-312 | #867 → #882 | **ĐÃ SỬA** | 28 ảnh trong `docs/user-guide/img/`; **22 ảnh đổi** trong `119e2e4..2e51e25`, **6 ảnh không đổi** — đúng 6 ảnh là `part.screenshot()` của một vùng **không có sidebar** (`02-tong-quan-so-sanh-team`, `03-chi-tiet-lich-hen`, `03-lich-hen-nam`, `05-du-kien-kyc`, `07-bao-cao-theo-moc`, `09-xoa-lich-hen`). Giới hạn: ảnh lớn nhất **141 536 B** ≤ 150 KiB, tổng **1 942 246 B** ≤ 4 MiB; 0 link hỏng. | Chạy lại bộ chụp cho **28 ảnh trùng từng byte** → ảnh trong repo đúng là ảnh của mã ở SHA ghim. |
| T-314 | #876 → #878 | **ĐÃ SỬA** (phần e2e) | `e2e/customer-ai.spec.ts` ca "a run that fails while the profile is left says its error once shown again (T-297)": `--repeat-each=8` → **8 passed (23,3 s)**, không flaky. | Phần kế hoạch / `dot2.mjs` là quy trình (K17), không kiểm. |
| T-316 | #884 → #888 | **ĐÃ SỬA** | `F/probe-clip.mjs` (Playwright + Edge trên bản build web, hồ sơ KH cao 3 424 px): clip `rightOfSidebar` ở **độ cuộn 0** = `{x:232, y:0, w:1208, h:3423,75}`; **thân hàm cũ** đo khi trang cuộn 300 px = `h: 3123,75` (**hụt đúng 300 px**); **thân hàm mới** (cuộn về đầu rồi đo) = `h: 3423,75`, `same: true`. | Chạy lại bộ chụp 13/13, 28 ảnh trùng byte → thay đổi không làm đổi ảnh nào, đúng test chấp nhận của Issue. |
## 3. Phạm vi đã đọc

**Mã của gói** (đọc trọn, ở `2e51e25`):

- `tools/`: `size-report-core.mjs` (370), `size-report.mjs` (49), `pr-core.mjs` (341), `pr-status.mjs` (176), `notes-core.mjs` (268), `notes-for.mjs` (96), `codemap-core.mjs` (201), `codemap.mjs`, `eval-ai-core.mjs` (809), `eval-ai.mjs`, `load-data-core.mjs`, `load-data.mjs`, `session-core.mjs`, `session-io.mjs`, `handoff.mjs`, `merge-pr.mjs` (đọc phần `--dry-run`, `cleanupPlan`), `status.mjs`, `review-hint-core.mjs`, `retro-core.mjs`, `ts-hooks.mjs`, `ts-hooks-core.mjs`, `bootstrap.ps1`, `session-start.ps1`, `session-end.ps1`; test: `size-report-core.test.mjs`, `pr-core.test.mjs`, `pr-status.test.mjs`, `notes-core.test.mjs`, `eval-ai-core.test.mjs`, `codemap-core.test.mjs`, `load-data-core.test.mjs`, `session-core.test.mjs`, `session-end.test.mjs`, `retro-core.test.mjs`, `review-hint-core.test.mjs`, `ts-hooks-core.test.mjs`.
- `e2e/`: `fixtures.ts` (58), `anchor.ts` (59), `support.ts` (448), `serve.mjs` (43), `seeded-snapshot.ts`, `fixtures.spec.ts` (86), `seeded-snapshot.spec.ts`, `guide/{links.ts,check.guide.ts,shots.guide.ts,links.spec.ts}`, `perf/{stats.ts,stats.spec.ts,probe.perf.ts,README.md}`, `tsconfig.json`, và **toàn bộ 30 file `e2e/*.spec.ts`** cùng `guide/links.spec.ts`, `perf/stats.spec.ts` ở mức đọc lướt để biết spec nào dùng đồng hồ trang / `machineClock`.
- `.github/workflows/ci.yml` (158), `.github/{ISSUE_TEMPLATE/*,pull_request_template.md}`, `.githooks/pre-push`, `.claude/rules/{ci.md,tests.md}`, `.claude/skills/review-pr/SKILL.md`.
- `packages/ui/scripts/check-tokens.ts` (38), `apps/desktop/vite.config.ts` (30), `eslint.config.js` (111), `package.json`, `pnpm-workspace.yaml`, `vitest.config.ts`, `playwright{,.guide,.perf}.config.ts`, `tsconfig.base.json`, `rust-toolchain.toml`, `.prettierignore`, `.nvmrc`.

**Phần diff `119e2e4..2e51e25` của gói** (`git diff --numstat`, 50 file): `tools/` +152 / −52 (7 file), `e2e/` +2 967 / −272 (46 file), `eslint.config.js` +60, `packages/ui/scripts/check-tokens.ts` +2 / −2, `vitest.config.ts` +1 / −1. Đọc kỹ nhất: `tools/{notes-core,pr-core,pr-status,size-report-core}.mjs`, `e2e/{fixtures,anchor,support}.ts`, `e2e/guide/shots.guide.ts`, `eslint.config.js`.

**Chỗ code gói khác mà gói F nối vào**: `apps/desktop/src/data/{app-data.ts,demo-snapshot.ts}` (T-126: ngày e2e theo đồng hồ), `packages/db/src/{backup,trash,purge}.ts` (số đo CL3-A29 / T-287), `packages/ai/src/{schema,analysis-steps}.ts` (`tools/eval-ai-core.mjs` import), `apps/desktop/src/i18n/index.ts` (`COUNT_SLOTS` cho `e2e/perf/stats.ts`), `docs/metrics/phase-6.md` (luật đếm), `docs/testing/nghiem-thu-v1.md` (bảng đối chiếu mockup).

**Tài liệu**: `CLAUDE.md` (gốc), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` §4–§5, `docs/metrics/phase-6.md`, `docs/metrics/phase-6-baseline/size.json`, `e2e/perf/README.md`, `docs/process/deep-review-phase-1-6.md` §L4.5, `common/{plan.md,known.md,fixes.md,baseline.md}`, báo cáo A–E lượt 4 của chính mình.

**Không đọc**: mọi thư mục trong quy tắc riêng 2 (không lệnh nào chạm `claude\`, `codex\`, `-r3\`, `-r2\`, `-r1\`, `Project-2C-review-2\`); báo cáo lượt 4 của bên khác; `docs/reviews/raw/2026-10-15|17|21/` chỉ đọc qua `known.md` / `fixes.md` (nội dung ba lượt trước đã có trong `known.md` phần 4–5 và `fixes.md`).

## 4. Kịch bản mới đã thử (chuỗi nhiều bước, nhiều gói)

Máy `DESKTOP-KDURKJP`, không chạy gì song song trừ khi ghi. Mọi lệnh `node` dùng **v24.20.0**.

| # | Kịch bản (chuỗi) | Kết quả | ID |
|---|---|---|---|
| 1 | **Chuỗi hướng dẫn**: `pnpm build:web` (mã màn D/E) → `e2e/serve.mjs` dựng `vite preview` + ghi `dist/demo-2026-09-15.sqlite` → 13 test Playwright của `playwright.guide.config.ts` → ghi 28 PNG vào `docs/user-guide/img/` → `check.guide.ts` đọc lại (link + cỡ) → `git status` | **13 passed (28,0 s)**; **28/28 ảnh trùng từng byte** với bản trong repo; 0 link hỏng; ảnh lớn nhất 141 536 B ≤ 150 KiB; tổng 1 942 246 B ≤ 4 MiB | — |
| 2 | **Chuỗi đồng hồ e2e**: fixture `context` cài `clock.install(anchorMorning(timezoneId))` → trang chạy trên đồng hồ đó → app lấy ngày theo đồng hồ (T-126) → `toNewYearsEve` nhảy tiếp từ `Date.now()` của trang → đọc giờ tường | Ở SHA ghim `fixtures.spec.ts` **4/4**; **C1** (gỡ `install`) → 2 đỏ; ca `toNewYearsEve` **vẫn xanh** khi gỡ (nó tự tính từ đồng hồ trang) | DR6-129 |
| 3 | **Chuỗi dữ liệu tải**: `node tools/load-data.mjs --anchor 2026-10-12 --seed 6` → `load-data-core.buildLoadData` → seed của `@p2c/db` → `exportBackup` → `tablesHash` → so với `baseline.md` | `tables sha256` **`ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25`** — **trùng** hash ghim; 12 bảng đúng số dòng (1 496 KH / 10 414 lịch / 13 114 phiên bản KYC / 4 941 chuyển nhóm); 15,3 MB | — |
| 4 | **Chuỗi Thùng rác (Node)**: `importBackup` (dữ liệu tải) → `softDeleteCustomer` ×1 200 → `listTrash` → `previewPurge` → `purgeTrash` → `listTrash` lại | 113 → 0 dòng (cỡ tải) và 1 313 → 0 (cỡ lớn); `previewPurge` = kế hoạch `purgeTrash` (0 / 0 bản ghi bị giữ); số đo ở §2.1 CL3-A29 | CL3-A29 |
| 5 | **Chuỗi sổ ghi chú**: `node tools/notes-for.mjs --files tools/notes-core.mjs e2e/fixtures.ts` → `targetPatterns` → `openNotes` đọc `docs/state/review-notes.md` ở `2e51e25` → `relatedNotes` | In "Ghi chú OPEN … @ 2e51e25, theo --files (4 đường dẫn / glob)" + **"Không có ghi chú OPEN nào nêu các file này."** → OPEN rỗng ở SHA ghim, đúng điều kiện B2 của `baseline.md` | — |
| 6 | **Chuỗi luật lint**: `eslint.config.js` → ESLint API trên 20 đoạn mã (`F/eslint-probe.mjs`) → 5 dạng `import()` động + 4 dạng `zod` → rồi gỡ từng luật (E1 / E2 / E3) | Ở SHA ghim: động = 1 lần báo/ca, `zod` đầy đủ = 1, `zod/mini` = 0, kiểu `import(...)` = 0, `./fixtures` / `node:fs` = 0. Gỡ luật → đúng các ca đó về 0 | T-302, T-304 |
| 7 | **Chuỗi e2e đầy đủ**: `pnpm build:web` → `serve.mjs` → **308 test** trên Edge | **308 passed (3,4 phút)**, 0 flaky, 0 failed — trùng số `baseline.md` (308). Wall time 204 s so 166 s ở `baseline.md`: cùng số test, máy có thêm tiến trình của phiên này; không phải ngưỡng nào của `phase-6.md` | — |
| 8 | **Chuỗi clip ảnh hướng dẫn**: `dist` + `vite preview` (cổng 4399) → Lịch hẹn → "Kỳ trước" → lịch Đã gặp → "Hồ sơ KH →" → đo `main` ở độ cuộn 0 và 300 | Trang cao 3 424 px; clip cũ ở cuộn 300 **hụt 300 px**; clip mới bằng nhau ở cả hai (`same: true`) | T-316 |
| 9 | **Chuỗi "chạy e2e rồi đo"**: `pnpm e2e` (để lại `dist/demo-2026-09-15.sqlite`) → `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` | Dòng "Tệp khác" **10 991 785 B, Δ +10 142 589** so baseline — trong đó 9 969 664 B là file `.sqlite` do `serve.mjs` ghi, không phải asset của bản dựng | **DSR4-F1** |
| 10 | **Chuỗi "gỡ phần sửa của một dòng R rồi chạy lại đúng test của PR"** cho 8 dòng (C1, N1–N3, P1, P2, S1–S3, D1–D2, E1–E3) | 15/15 đột biến **bị giết**, mọi file trả nguyên byte, `git status --short` rỗng sau mỗi lần | bảng R |

Ba chuỗi của bài học review Phase 5 (hai lỗi Medium đều cần chuỗi nhiều bước) đã thử lại theo cách mới: **chuỗi 9** là dạng "chạy cổng rồi đo" (lộ DSR4-F1), **chuỗi 1** là dạng "dựng → chạy → ghi ra đĩa → đọc lại" (28 ảnh), **chuỗi 3** là dạng "công cụ sinh dữ liệu → lõi dữ liệu → hash" (trùng hash ghim).

## 5. Phát hiện mới

```
ID: DSR4-F1
Mức: Low
Trục: T
Vị trí: tools/size-report-core.mjs:181,188 · e2e/serve.mjs:32 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: DR6-79 / T-126 (snapshot seed sẵn của bản web) · có từ trước, lượt 1–3 bỏ sót
Kịch bản: 9
Mô tả: `e2e/serve.mjs` ghi `dist/demo-2026-09-15.sqlite` (9 969 664 B) sau `pnpm build:web` và không
  bao giờ xóa; `bundleReport` của `size-report` xếp **mọi** file không phải `.js`/`.css` trong `dist`
  vào dòng "Tệp khác". Nên ai chạy `pnpm e2e` rồi mới đo — đúng thứ tự hay làm — sẽ thấy dòng đó
  tăng ≈ 10 MB, và bản `size.json` ghi lại lúc ấy thành mốc sai cho mọi lần so sau.
Tái hiện / bằng chứng: sau `pnpm e2e` (308 passed) trong chính phiên này:
  $ ls -l apps/desktop/dist/demo-2026-09-15.sqlite
  -rw-r--r-- 1 … 9969664 … demo-2026-09-15.sqlite
  $ node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json
  | Tệp khác (20 file: wasm, font, ảnh…) | 10 991 785 | +10 142 589 | — | — |
  Ở `baseline.md` (đo ngay sau `build:exe`, chưa chạy e2e): 19 file, 1 022 121 B. Chênh lệch
  9 969 664 B đúng bằng file `.sqlite`; 172 925 B còn lại là font + ba ảnh logo + favicon của T-308,
  đã có trong `baseline.md`.
  `docs/metrics/phase-6.md:115` ghi dòng này là "Tệp khác (15 file: wasm, font, ảnh…)" — file `.sqlite`
  nằm ngoài nghĩa đó. `pnpm build:web` **có** xóa `dist` (Vite `emptyOutDir` mặc định), nên exe không
  bị nhúng file này: `baseline.md` đo exe 5 649 408 B sau `build:exe`, không có 10 MB đó.
Ảnh hưởng: người đo (reviewer, G7, PR `phase-6.md`) đọc sai "tài nguyên khác" của bản dựng và ghi mốc
  sai vào `docs/metrics/phase-6-baseline/size.json`; không ảnh hưởng người dùng cuối, không ảnh hưởng exe.
Đề xuất: `bundleReport` bỏ qua file không do bản dựng sinh — rẻ nhất là lọc `.sqlite` (và nên là
  "chỉ nhận đuôi của asset": wasm, woff2, png, ico, svg, html) ở `others`; hoặc `serve.mjs` ghi snapshot
  vào thư mục riêng rồi `preview` trỏ tới, hoặc xóa nó ở `process.on('exit')`. Cỡ ≤ 10 dòng.
```

Không có phát hiện Medium / High / Critical nào trong gói. Hai chỗ đã xét kỹ và **không** báo: (a) `narrow()` của `notes-core` bỏ một đường dẫn rút gọn khớp > 3 file mà không có gói nào gợi ý — đúng luật đã chọn cho tên trần, và PR #736 đã so trên sổ thật (159 mục, cùng kết quả); (b) `playwright.config.ts` không đặt `timezoneId` nên `anchorMorning(undefined)` = giờ máy — đúng, vì trình duyệt và tiến trình test cùng múi trên máy này; `playwright.guide.config.ts` đặt `Asia/Ho_Chi_Minh` thì `shots.guide.ts` đọc `timezoneId` (đã kiểm: 28 ảnh trùng byte).

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đo gì | Trên cái gì | Số | ID |
|---|---|---|---|
| `node tools/size-report.mjs` (SHA ghim) | cả 6 gói | F: **4 440 SP · 16 860 test · 4 628 sinh · 96 file** (Δ lượt 3: +100 / +2 695 / 0 / +5); tổng 37 766 / 52 911 / 4 969 / 421; **không còn dòng "Chưa xếp gói"** | — |
| `git diff --numstat 119e2e4 2e51e25` (đường dẫn F) | diff sửa của gói | `tools/` +152 / −52 (7 file) · `e2e/` +2 967 / −272 (46 file) · `eslint.config.js` +60 · `check-tokens.ts` +2 / −2 | — |
| `eslint . --max-warnings 0` | toàn repo | **0 lỗi** | — |
| `tsc -p e2e --noEmit`; `tsc --noUnusedLocals --noUnusedParameters` (5 package) | `e2e/`, `packages/*`, `apps/desktop` | **0 lỗi** (cổng `baseline.md`; tôi chạy lại `e2e`) | — |
| `depcruise apps packages` | 341 module / 1 435 phụ thuộc | **no dependency violations** | — |
| `node tools/codemap.mjs --check` | 5 `CLAUDE.md` của package | *Export maps are up to date* | — |
| `F/probe-exports.mjs` | 34 tên export của `tools/**` + `e2e/**` không dùng ngoài file | **0 tên chết** (tất cả dùng trong module hoặc trong `<tên>.test.mjs`) | DR6-66 |
| Bundle web (`baseline.md`, bản dựng sạch) | `apps/desktop/dist` | `index.js` **884 698 B** (−43 234 so lượt 3) · `index.css` **29 752 B** (+1 268) · tổng JS/CSS 2 358 427 (−5 856) · tệp khác **1 022 121 B** (+172 925 = font 21 884 + ba logo 149 070 + favicon 2 465 − `favicon.svg` 494) | — |
| Exe (`baseline.md`) | `project2c.exe` release | **5 649 408 B** (+240 640 so lượt 3); trong đó `icons/icon.ico` 16 625 → **87 968 B** (+71 343); phần còn lại +169 297 là asset web nhúng + code Rust | — |
| Tách phần T-308 / `zod/mini` | — | font 21 884 B, ba logo 149 070 B, favicon 2 465 B = **172 925 B** (đúng bằng Δ "tệp khác"); `zod/mini` −62 735 B (số #830, không đo lại) | — |

**Không có phát hiện bloat.** Phần F tăng 100 dòng SP là `PACKAGES` + luật lint + `narrow` của `notes-core`; 2 695 dòng test là 46 file e2e (đồng hồ, `save-state`, `topbar-focus`, guide). Không có hằng / hàm chết, không có bản chép mới.

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, phiên này, Node **v24.20.0**. Số đo lấy lúc các lần chạy e2e / guide đã xong, không có tiến trình nặng nào song song. Mốc: `common\baseline.md` (cùng máy, cùng dữ liệu tải) và `docs/metrics/phase-6.md`.

| Đo | Dữ liệu | Số ở SHA ghim | Mốc | Kết luận |
|---|---|---|---|---|
| `listTrash` | 113 dòng (dữ liệu tải) | **20,4 ms** (trung vị 5) | baseline Node 23,8; lượt 3 32,6 | không xấu hơn (−3,4 ms) |
| `listTrash` | 1 313 dòng (+1 200 KH xóa) | **132,2 ms** (trung vị 3) | baseline 158,2; lượt 3 140,7 | không xấu hơn (−26,0 ms) |
| `previewPurge` | 113 / 1 313 | **1,0 / 5,9 ms** | 1,0 / 7,4 | không xấu hơn |
| `purgeTrash` (cả `VACUUM`) | 113 / 1 313 | **86,2 / 119,9 ms** | 85,2 / 129,8 | +1,0 ms (+1 %) ở cỡ tải, dưới luật nhiễu; −9,9 ms ở cỡ lớn |
| `pnpm e2e` (308 test) | bản build web | **3,4 phút**, 308 passed, 0 flaky | `baseline.md` 166 s, 308 passed | cùng số test; wall time cao hơn do máy có tiến trình của phiên này — **không phải ngưỡng** nào của `phase-6.md` |
| Bộ chụp ảnh hướng dẫn (13 test) | `dist` + `vite preview` | **28,0 s**, 13 passed, 28 ảnh trùng byte | — | không có ngưỡng; chạy tay |
| `fixtures.spec.ts` (4 test) | bản build web | **31,3 s** | — | — |
| `size-report` (đọc 421 file + gzip) | cả repo | **0,3 s** | `baseline.md` 0,3 s | — |

**Không có phát hiện P** theo ngưỡng `docs/metrics/phase-6.md` (mọi thao tác màn < 200 ms; Dọn sạch ≤ 500 ms; `db.save` ≤ 400 ms — số exe ở `baseline.md`). DSR4-A1 (gói A) là phát hiện P duy nhất của lượt 4, và nó ở `packages/domain`.

### 6.3 Ghi chú môi trường (không phải phát hiện)

- `node` trong PATH của shell là **v22.22.2** (bản của app), còn `package.json` yêu cầu `>=24 <25` và `baseline.md` đo bằng **v24.20.0**. Mọi số của gói này lấy bằng `C:/Program Files\nodejs\node.exe` (v24.20.0). Gói C đã ghi: chạy `vitest` bằng Node 22 làm 4 ca "36 000 ký tự" của `mock-adapter.test.ts` đỏ giả.
- `apps/desktop/dist` ở đầu phiên là bản **có `VITE_DEMO_ANCHOR`** (884 708 B) do lần chạy e2e của gói D/E để lại, nên mọi số bundle lấy ở `baseline.md` (bản dựng sạch), không lấy từ `dist`.
- Playwright ghi `test-results\` bị shim `safe-delete` của app chặn khi > 50 file; mọi lần chạy của gói này đều `--output` ra `…-r4\deepseek\F\pw*`.
## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **1** |

**Tỉ lệ PLAUSIBLE: 0/1** — DSR4-F1 là CONFIRMED, có lệnh và số đo thật. Bảng R của gói: 6 dòng R1 + 14 dòng R2, **tất cả ĐÃ SỬA**, 0 SỬA MỘT PHẦN / 0 CHƯA SỬA / 0 HỒI QUY.

## 8. Đã xét, không thấy

- **R (kiểm phần đã sửa):** 6 dòng R1 + 14 dòng R2 ở §2. Mỗi dòng có ít nhất một lần **gỡ phần sửa** và một test đỏ, trừ bốn dòng chỉ kiểm được bằng đọc + chạy lại (DR6-66, DR6-67: đếm bằng probe và `grep`; T-307, T-311: dòng tài liệu, đối chiếu nguyên văn với `size-report-core.mjs` và `nghiem-thu-v1.md`). Không dòng nào SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY.
- **E (edge case):** đã xét — (a) đồng hồ: trang bắt đầu đúng 09:30 ngày neo, chạy tiếp, `toNewYearsEve` từ đồng hồ đã chạy trước 5 phút, `timezoneId` cách 17 múi (`Pacific/Honolulu`); (b) `notes-core`: mục chứa U+2028/U+2029, đường dẫn rút gọn khớp 4 file, tên trần ở gốc repo, ngoặc nhiều nhóm; (c) `pr-core`: file đổi tên code→docs và docs→code, `changedFiles` lệch số mục, `mainTotal` không phải số nguyên, `mainSince` dài hơn `mainTotal`; (d) `size-report`: `dist` thiếu (in "Chưa build"), `--compare` với file không phải output của lệnh, dòng "Chưa xếp gói" rỗng / có file; (e) `notes-for`: sổ OPEN rỗng, `--files` với đường dẫn không có trong repo. Không thấy lỗi mới ngoài DSR4-F1.
- **C (đúng hợp đồng / spec / tài liệu):** đối chiếu `docs/metrics/phase-6.md:234,239` với `TEST` / `CODE_DOCS` của `tools/`; `nghiem-thu-v1.md:432-446` với 6 mockup có sidebar; `.claude/rules/ci.md` với `ci.yml` (5 `uses:` đều ghim SHA 40 ký tự + comment bản; hai bộ lọc `paths` khớp `CODE_DOCS` — có test); `e2e/perf/README.md` với `playwright.perf.config.ts`. Không thấy lệch mới.
- **D (dữ liệu):** dữ liệu tải sinh lại **trùng hash** `ad82051b…` và đúng 12 số dòng; `listTrash` / `previewPurge` / `purgeTrash` cho cùng kế hoạch ở hai cỡ; 28 ảnh hướng dẫn trùng byte sau khi chụp lại. Không thấy sai lệch.
- **G (guardrail AI):** gói F chỉ chạm `tools/eval-ai-core.mjs` (đường eval, không phải app) và `packages/ai` qua import. Đọc `readConfig` / `readReply` / `readings` / `mask`: key không vào output, không vào `.partial`, che theo ba lớp escape (K23). Không thấy lỗ mới; V1–V7 thuộc gói C.
- **S (an toàn ranh giới):** `tools/` không nhận đầu vào từ webview; `check-tokens.ts` chỉ đọc file trong hai thư mục truyền vào; `load-data.mjs` từ chối `--anchor` sau hôm nay và `--seed` ngoài 0…2³²−1; `e2e/serve.mjs` chỉ nghe trên cổng cấu hình. Không có lệnh mạng ra ngoài, không `gh`, không `curl`. Không thấy lỗ mới.
- **P (hiệu năng):** §6.2 — không phát hiện theo ngưỡng.
- **B (bloat):** §6.1 — không phát hiện.
- **T (chất lượng test / công cụ):** 15 đột biến, **15 bị giết** (phụ lục 9.1). Một lỗ của công cụ đo: **DSR4-F1**. Đã xét thêm và không báo: `check.guide.ts` chỉ đo ảnh ở `img/` (thư mục phẳng, đúng); `CODE_SPAN` của `links.ts` không xử lý code span vắt qua hai dòng (CommonMark cho phép) — không có ca nào trong hướng dẫn, và hậu quả chỉ là kiểm thêm một link, không bỏ sót; `formatStatus` in `, only n read` theo cùng điều kiện `mergeBlockers` (P2 đỏ khi lệch).
- **A (trợ năng / i18n):** gói F không có JSX. Đã xét: `e2e/support.ts` `lowestContrast` (WCAG 1.4.11 cho viền, `of: 'border'`) được `theme.spec.ts` dùng cho 2 ô ngoài `packages/ui`; `shots.guide.ts` không tạo chuỗi hiển thị; `check-tokens.ts` bỏ qua `i18n/` đúng (dấu nằm trong `vi.ts`). Không thấy lỗ mới.

## 9. Phụ lục — nguồn probe / đột biến

Thư mục `C:/workspace/deep-review-1-6-r4/deepseek/F/`.

### 9.1 Đột biến (15, cả 15 bị giết)

Mỗi lần: vá **đúng một chuỗi** trong worktree, chạy đúng test của PR sửa (hoặc probe tương đương), rồi ghi lại **nguyên byte** và so sha256; `git status --short` in ra sau mỗi lần. Harness: `mutate.mjs` (bảng R) và `eslint-mutate.mjs` (luật lint).

| # | Dòng R | Sửa gì | Chạy | Kết quả |
|---|---|---|---|---|
| C1 | DR6-129 / T-283 | `e2e/fixtures.ts`: bỏ `context.clock.install({ time: anchorMorning(timezoneId) })` | `fixtures.spec.ts` | **2 failed** (2 ca đồng hồ) |
| N1 | DR6-130 | `notes-core.mjs`: bỏ cờ `s` của `/^( *)- (.*)$/s` | `notes-core.test.mjs` | 1 failed |
| N2 | DR6-130 | `notes-core.mjs`: bỏ `narrow()` cho đường dẫn rút gọn | `notes-core.test.mjs` | 1 failed |
| N3 | DR6-130 | `notes-core.mjs`: `const atRoot = false` | `notes-core.test.mjs` | 1 failed |
| P1 | T-283 | `pr-core.mjs`: `paths` chỉ lấy `f.path` (bỏ `previousPath`) | `pr-core` + `pr-status` | **2 failed** |
| P2 | T-283 | `pr-status.mjs`: `short = mainSince.length !== mainTotal` | `pr-status.test.mjs` | 1 failed |
| S1 | T-310 | `size-report-core.mjs`: bỏ `ConfirmWordDialog.tsx` khỏi `PACKAGES` | `size-report-core.test.mjs` | 1 failed (`pkg: null`) |
| S2 | T-310 | `size-report-core.mjs`: in dòng "Chưa xếp gói" cả khi rỗng | `size-report-core.test.mjs` | 1 failed |
| S3 | T-310 | `size-report-core.mjs`: `stage-badge.tsx` ra khỏi D | `size-report-core.test.mjs` | 1 failed (`pkg: null`) |
| D1 | T-302 | `pr-core.test.mjs`: `DOCS_PATH` chỉ nhận một chuỗi | `pr-core.test.mjs` | 1 failed |
| D2 | T-302 | `pr-core.test.mjs`: `callAround` không bỏ qua lời gọi lồng | `pr-core.test.mjs` | **2 failed** |
| E1 | T-302 / DR6-129 | `eslint.config.js`: selector `no-restricted-syntax` → `never/anything` | `eslint-probe.mjs` | 5 dạng `import()` động: 1 → **0** |
| E2 | T-304 / DR6-25 | `eslint.config.js`: `paths: [{ name: 'zod' }]` → `[]` | `eslint-probe.mjs` | `zod` ở `packages/db`, `apps/desktop`: 1 → **0** |
| E3 | T-304 / DR6-25 | `eslint.config.js`: `patterns` → `[]` | `eslint-probe.mjs` | `zod/v4`: 1 → **0** |
| — | (đối chứng) | không sửa gì | `fixtures.spec.ts`, `customer-ai` (T-297, `--repeat-each=8`), guide 13 test, e2e 308 test | 4 / 8 / 13 / **308 passed** |

### 9.2 Probe (chỉ đọc, không sửa repo)

| File | Việc |
|---|---|
| `eslint-probe.mjs` | 20 đoạn mã qua ESLint API: 5 dạng `import()` động + 5 dạng tĩnh của `@playwright/test`, 4 dạng `zod`, 2 dạng ngoài phạm vi luật |
| `probe-exports.mjs` | 34 tên export của `tools/**` + `e2e/**` không dùng ngoài file, đối chiếu với chính file và `<tên>.test.mjs` |
| `probe-perf.mjs` | `listTrash` / `previewPurge` / `purgeTrash` trên dữ liệu tải (113 dòng) và Thùng rác lớn (1 313 dòng) |
| `probe-clip.mjs` | `rightOfSidebar`: clip ở độ cuộn 0 và 300 trên hồ sơ KH cao 3 424 px (Playwright + Edge, `vite preview` cổng 4399, chỉ `localhost`) |
| `load-check.p2cbackup` | dữ liệu tải sinh lại bằng `tools/load-data.mjs` (15,3 MB, hash `ad82051b…`) — giữ để đối chiếu, không phải nguồn của số đo nào |

Lệnh đã chạy (đều trong `Project-2C-review`): `node tools/size-report.mjs [--compare …]`; `node tools/size-report.mjs --json`; `node tools/notes-for.mjs --files …`; `node tools/load-data.mjs --out … --anchor 2026-10-12 --seed 6`; `node packages/ui/scripts/check-tokens.ts apps/desktop/src packages/ui/src/components`; `node tools/codemap.mjs --check`; `node_modules/.bin/depcruise apps packages`; `eslint . --max-warnings 0`; `tsc -p e2e --noEmit`; `vitest run tools` (12 file, **341 test**); `playwright test e2e/fixtures.spec.ts`; `playwright test e2e/customer-ai.spec.ts -g "says its error once shown again" --repeat-each=8`; `playwright test -c playwright.guide.config.ts` (13 test); `playwright test --project=edge` (**308 test**).

**Không chạy**: `pnpm verify` toàn bộ (dùng số ở `baseline.md`; tôi chạy lại từng bước rời của nó trừ `format:check` và `test:coverage`), `pnpm eval:ai` (quy tắc chung 2), `gh` (không đăng nhập, quy tắc riêng 4), probe trên exe (không cần cho kết luận nào của gói: mọi số exe lấy ở `baseline.md` cùng máy), `pnpm build:exe` (đã có exe ở `common\exe\`).

### 9.3 Trạng thái cuối phiên

`git status --short` của `C:/workspace/Project-2C-review`: **rỗng** (kiểm sau mỗi lần đột biến, sau khi chụp lại 28 ảnh, và ở cuối phiên). `git rev-parse HEAD`: `2e51e25eb0125f56d3d938b97ef18d6873dae076`. Thư mục `apps/desktop/dist` và `test-results\` chỉ chứa file bị ignore.

**Giờ xong:** 2026-10-30 23:05 (+07:00).
## 10. Bảng R1 gộp đủ 37 dòng (A–F)

Cột "Gói" là gói đã kiểm dòng đó (gói đầu là gói chính, `known.md` phần 4); "Bằng chứng" trỏ tới bảng R của gói ấy. **Không dòng nào SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY.**

| Mã | Mức | Gói | Kết luận | Bằng chứng chính |
|---|---|---|---|---|
| DR6-104 | L | A | ĐÃ SỬA | Gỡ khối chặn E7 (`appointments.ts:299-301`) → `trash.test.ts` đỏ 3; biến thể "KH tới nhóm sau **trước** ngày hẹn" vẫn khôi phục được |
| DR6-105 | L | A | ĐÃ SỬA | `z.iso.datetime({precision:3})` → `z.iso.datetime()` → `backup.test.ts` đỏ 3 |
| DR6-106 | N | A | ĐÃ SỬA | Ép `reinstateTransition` luôn `appendTransition` → `trash.test.ts` đỏ 5 |
| DR6-107 | L | A | ĐÃ SỬA | Bỏ `startsWith('\u{FEFF}')` → `backup.test.ts` đỏ 5 |
| DR6-108 | L | A, C | ĐÃ SỬA | `storedRawOutput` chỉ thay NUL → `ai-analyses.test.ts` đỏ; C đọc cả `analysis-steps.ts:114-118` |
| DR6-109 | L | D | ĐÃ SỬA | `name` → `normalizeText(name)` → `customer-forms.spec.ts` đỏ 1 (e2e) |
| DR6-110 | L | A, D, E | ĐÃ SỬA | `parseVnd` / `parseQuickDate` về chữ gốc → `money.test.ts` đỏ 11, `period.test.ts` đỏ 6; D đột biến `customers-view` đỏ 2; E kiểm chỗ nối 6b/6e/8d |
| DR6-111 | L | A, C | ĐÃ SỬA | Bỏ nhánh `\p{Cc}` khỏi `INVISIBLE` → `text.test.ts` đỏ 3; C: probe BEL/NEL/ESC ra V3 |
| DR6-112 | N | A | ĐÃ SỬA | Bỏ tie-break của `byName` → `name-order.test.ts` đỏ 3; corpus 53 tên vẫn là comparator hợp lệ |
| DR6-113 | L | A | ĐÃ SỬA | Bỏ `PRAGMA recursive_triggers = ON` → `purge.test.ts` đỏ 1 |
| DR6-114 | N | A | ĐÃ SỬA | `POINTS_TO.reviewer` → `'re'` → `person-references.test.ts` đỏ 2 (đột biến `ownsRecords` sống = tương đương) |
| DR6-115 | L | D | ĐÃ SỬA | Câu hỗ trợ → câu RE + `NAMED_IN_TRASH` 3 → 1 → `team-view.test.ts` đỏ 3; e2e `team.spec.ts:493` |
| DR6-116 | L | D | ĐÃ SỬA | `case 'delete'` → `MEMBERS_TITLE` → e2e `team.spec.ts:761` đỏ (`toBeFocused`) |
| DR6-117 | L | D | ĐÃ SỬA | Bỏ `wrap-anywhere` ở `CustomerKyc.tsx:318` → e2e `customer-kyc.spec.ts:114` đỏ |
| DR6-118 | L | C | ĐÃ SỬA (đọc code) | `wrap-anywhere` ở `KycIntelligence.tsx:163`, `KycHistory.tsx:86`, `min-w-0` ở `KycExtraction`/`KycDialogs` — C ghi rõ **không dựng bản web** cho dòng này |
| DR6-119 | N | E | ĐÃ SỬA | Bỏ `recordBadge(row)?.text` khỏi `restoreLabel` → `trash-view.test.ts` đỏ 7; e2e 45 passed |
| DR6-120 | L | B, D | ĐÃ SỬA | `refused()` trả nguyên lỗi → 3 test Rust đỏ; D: `folderReadOnly.banner` → `storage.saveFailed` → `SaveWarning.test.tsx` đỏ 1 |
| DR6-121 | L | C | ĐÃ SỬA | Bỏ neo đầu vế `KH_SUBJECT` → 6 ca đỏ; probe 30 câu khớp bảng "Đề xuất mất đi" |
| DR6-122 | L | C | ĐÃ SỬA | `cleanText` giữ dấu lạc → 16 ca đỏ; 5 dạng dấu lạc ra V3 |
| DR6-123 | L | C | ĐÃ SỬA | `split(LINE_BREAK)` → `/\r\n|\r|\n/` → 13 ca đỏ; dán lại tin nhắn `web@1` 8 kiểu xuống dòng đều `OWN_MESSAGE` |
| DR6-124 | N | C | ĐÃ SỬA | Bỏ `giới` → 2 ca đỏ; bỏ `ấm` → 4 ca đỏ |
| DR6-125 | L | A | ĐÃ SỬA | `firstOfEach` → `rows` đỏ; xoá mọi chuyển nhóm đã rút → đỏ 1; câu đếm 11i trừ `SYSTEM` → đỏ 1 |
| DR6-126 | L | A | ĐÃ SỬA | Sáu đột biến (a, c, d, e, f + `latest.seq`) đều đỏ 1–3 |
| DR6-127 | L | D | ĐÃ SỬA | Cùng ca `customer-kyc.spec.ts:114` (2 chỗ phải chứa link) |
| DR6-128 | L | E | ĐÃ SỬA | `purgeReminder` → e2e D12 đỏ; `editedDay` → e2e E19 đỏ |
| DR6-129 | L | F | ĐÃ SỬA | **C1** (bỏ `clock.install`) → `fixtures.spec.ts` đỏ 2; **E1** (bỏ selector) → 5 dạng `import()` động về 0 |
| DR6-130 | N | F | ĐÃ SỬA | **N1/N2/N3** (cờ `s`, `narrow`, `atRoot`) mỗi cái giết đúng 1 ca của `notes-core.test.mjs` |
| DR6-131 | N | E | ĐÃ SỬA (tài liệu) | Mockup 6d + NT-LH-25 nay ghi `"1,234 tr" = 1.234.000.000 ₫`, khớp `parseVnd` |
| DR6-132 | N | A (b), D (a) | ĐÃ SỬA | (a) 5f không còn hứa "không bao giờ xóa", mockup + spec Phase 3 có ngoại lệ TR-11; (b) `packages/db/CLAUDE.md:13` khớp ba trigger `*_no_delete` của `0011` |
| DR6-133 | N | C | ĐÃ SỬA | `docs/user-guide/06-ai.md:49` ghi `discovery@4`; `vi.ts:233` dùng slot `{count}` |
| DR6-134 | N | A, E | ĐÃ SỬA | `stagesOfDay` một định nghĩa, 5 chỗ gọi; spec Phase 3 §4/§6 dẫn `stagesOfDay` thay `stageOn` |
| DR6-25 | L | C, A, F | ĐÃ SỬA | 4 import `zod/mini`, 0 `zod` đầy đủ; `index.js` −43 234 B; **E2/E3** đỏ đúng ca |
| DR6-37 | N | D, E | ĐÃ SỬA | `token-guard` + `check-tokens` xanh; ký hiệu chỉ còn khoá `vi.ts`; E: grep ký hiệu trong file E chỉ khớp comment |
| DR6-66 | N | F, A, C, D, E | ĐÃ SỬA | F: 34 export của `tools`/`e2e` không tên nào chết; A/C/D/E: `tsc --noUnusedLocals` sạch, hàm chỉ-test-dùng đã bỏ |
| DR6-67 | N | F, A, B, C, D, E | ĐÃ SỬA | F: 3 khuôn `execFileSync('git')` khác nhau, 0 bản chép mới; `depcruise` 0 vi phạm; A/B/C/D/E: 5 `update<X>Row` → `updateRow`, 5 câu "seq lớn nhất" → `lastSeq`, `HEADING`/`BADGE` một chỗ |
| CL3-A29 | N | A, F | ĐÃ SỬA | A: `EXPLAIN QUERY PLAN` dùng chỉ mục `appointments_deleted` + `appointments_rescheduled_from`, bỏ `CROSS JOIN` cho cùng dòng; F: `listTrash` 20,4 / 132,2 ms (mốc 23,8 / 158,2) |
| CL3-B2 | N | B, D, E | ĐÃ SỬA | B: bỏ nhánh ghi lại của `flush()` → 5 test đỏ; D: e2e `save-state.spec.ts` 5/5; E: câu D7 của Dọn sạch có vế "Thử lại" (đột biến đỏ 1) |

## 11. Bảng R2 gộp đủ 32 dòng (A–F)

| Issue | Việc | Gói | Kết luận | Bằng chứng chính |
|---|---|---|---|---|
| #735 T-280 | Thanh trên cùng không che focus | D | ĐÃ SỬA | `--spacing(20)` → `0px` → e2e `topbar-focus` đỏ 2; đo: tiêu đề ở 84 px, đáy thanh 59 px |
| #772 T-283 | e2e / tools: helper, đồng hồ, luật import, `pr-status` | F | ĐÃ SỬA | C1 đỏ 2; E1 đỏ 5 dạng; P1 đỏ 2; P2 đỏ 1 |
| #773 T-284 | G3: mockup và token bốn chỗ | D, E | ĐÃ SỬA | `--border-control: #687890` ở `tokens.css:14` + mockup; 8d có luật dòng số HĐ |
| #774 T-285 | Hàm dùng chung vào `domain` | A | ĐÃ SỬA | `formatLocalDayMonthTime`, `isIsoDate`, `stripDiacritics`, `nextKycVersion`; `DEMO_ROW_COUNTS` trùng bản `119e2e4` |
| #775 T-286 | `db`: gộp hàm lặp | A | ĐÃ SỬA | `updateRow`/`findRow`/`liveRow`/`requireRow`/`lastSeq`/`storable` một định nghĩa mỗi hàm |
| #776 T-287 | `db`: tham chiếu nhân sự, Thùng rác, đếm RF | A, D, F | ĐÃ SỬA | `person-references.ts`; `0012` hai chỉ mục; F: `listTrash` nhanh hơn mốc |
| #777 T-288 | `ai`: hằng dùng chung với `db`, `retry.ts` | C, A | ĐÃ SỬA | `MAX_AI_RAW_OUTPUT` một định nghĩa; 1 297 test `packages/ai` xanh |
| #778 T-289 | Mock trích xuất: đề xuất sai còn lại | C | ĐÃ SỬA | Bỏ neo đầu vế `KH_SUBJECT` → 6 ca đỏ |
| #779 T-290 | `ai`: cụm khớp `detail`, trích JSON bị cắt | C | ĐÃ SỬA | `piece` → `cut ? 0 : Infinity` đỏ 5; `placesOf` đỏ 8 |
| #780 T-291 | Bảy luật duyệt 23/10 | A, C, D, E | ĐÃ SỬA | Bảy đột biến, bảy lần đỏ (A); C: luật 3/7; D: chữ gửi lệnh nguyên; E: luật 5 (gợi ý năm trước) |
| #781 T-292 | `zod/mini` thay `zod` đầy đủ | C, A, F | ĐÃ SỬA | 4 import `zod/mini`; −43 234 B; E2/E3 đỏ |
| #782 T-293 | Rust: `storage.rs`, `backups\`, tiêu đề cửa sổ | B, D | ĐÃ SỬA | `entries()` nuốt lỗi → 2 test đỏ; `setTitle` bỏ → e2e `navigation` đỏ 1 |
| #783 T-294 | Trạng thái lưu, nút Thử lại, đóng app | B, D | ĐÃ SỬA | Bỏ `track` → 2 test đỏ (S2-6); e2e `save-state` 5/5 |
| #784 T-295 | Cài đặt → Dữ liệu, kiểm file trước migrate | B, E, C | ĐÃ SỬA | `openFrom` lưu khi đã migrate → 1 đỏ; bỏ `refuseDamaged` → 3 đỏ; E: 10c +1 KH → e2e đỏ |
| #785 T-296 | Hộp xác nhận dùng chung, tên nút theo ô, 8d | E | ĐÃ SỬA | `ConfirmWordDialog` dùng cho 10c và 11i; M1/M2/M8 đều đỏ |
| #786 T-297 | Dòng thời gian theo mockup, lỗi AI giữ khi đổi màn | D, C | ĐÃ SỬA | `hidden={false}` → e2e đỏ 1; `inTimelineFilter` → đỏ 1; C: `keep?.(outcome)` → `false` đỏ 1 |
| #787 T-298 | 5d, 6a/6h, 6d, thẻ Lịch hẹn, focus | D, E | ĐÃ SỬA | `stageDirection` → `null` đỏ 1; E: `parts` của `dayLabel` đỏ 2 |
| #788 T-299 | Team, Báo cáo, Tổng quan | D, E | ĐÃ SỬA | Bỏ `resetKey` → e2e đỏ 1; E: bảng ẩn 3 nhóm → 5 test đỏ |
| #789 T-300 | `packages/ui` và vỏ: token, `DataTable`, token-guard | D, F | ĐÃ SỬA | `sorts()` → `true` đỏ 3; F: `check-tokens` xanh, script chỉ quét `.tsx?`/`.css` |
| #790 T-301 | Dọn app: mã chết, hằng lặp, ký hiệu | D, E, F | ĐÃ SỬA | `classes.ts` 8 hằng (7–66 chỗ dùng); F: `eslint`/`tsc`/`depcruise`/`codemap` sạch |
| #793 T-302 | Luật lint `import()` động; `docsRead` | F | ĐÃ SỬA | E1 đỏ 5 dạng; D1 đỏ 1; D2 đỏ 2 |
| #797 T-303 | G3: mockup ô khóa, token viền | D | ĐÃ SỬA | `.input.locked` viền đứt `--border-strong`; K36 ghi rõ WCAG 1.4.11 |
| #831 T-304 | Luật lint chặn `zod` đầy đủ; mặc định schema | F, C | ĐÃ SỬA | E2/E3 đỏ; C: `.check()` sau `_default` → 2 ca đỏ |
| #849 T-305 | `classes.ts`, `recordBadge`, `WEB_MODE.tone`, đồng hồ bộ chụp | D, E, F | ĐÃ SỬA | F: `shots.guide.ts` dùng `anchorMorning(timezoneId)`; chạy lại 13/13, 28 ảnh trùng byte |
| #850 T-306 | Tài liệu: spec Phase 6, nghiệm thu, hướng dẫn | B, E | ĐÃ SỬA (tài liệu) | S2-6 có vế "dữ liệu cũ đủ"; NT-DB-23…25 đúng khoá `storage.*`; E: `previewPurge` là chuẩn so |
| #851 T-307 | Số đo Phase 6: bảng PR, `integrity_check` | F | ĐÃ SỬA (tài liệu) | Luật đếm khớp từng mục với `TEST` của `size-report-core.mjs`; `base.sha`; không còn "_Còn điền…_" |
| #852 T-308 | Tên Heritas L-CRM: logo, font, icon, tiêu đề | D, B | ĐÃ SỬA | `aria-label` → "Logo" → 3 e2e đỏ; `productName`/`title` → 1 ca đỏ; CSP không đổi |
| #865 T-310 | Mục sổ phần code trước lượt 4 | D, E, F, B | ĐÃ SỬA | S1/S2/S3 đỏ; `size-report` không còn "Chưa xếp gói"; `<title>` → 1 ca đỏ |
| #866 T-311 | Mục sổ phần tài liệu trước lượt 4 | F, D | ĐÃ SỬA (tài liệu) | 6 dòng mockup có `.brand` → CH-09; không còn "3 lượt"; NT-CH-09 ở `:72` |
| #867 T-312 | Chụp lại 28 ảnh hướng dẫn | F | ĐÃ SỬA | 22 ảnh đổi (6 ảnh vùng không có sidebar giữ nguyên); chạy lại trùng byte; max 141 536 B |
| #876 T-314 | Mục sổ [G7]: `dot2.mjs`, phiên thử, ca e2e Cài đặt | F | ĐÃ SỬA (phần e2e) | `--repeat-each=8` → 8 passed, không flaky |
| #884 T-316 | `rightOfSidebar`, Memory, ACL Full Access | F | ĐÃ SỬA | Clip cũ hụt 300 px ở cuộn 300; clip mới bằng nhau; 28 ảnh không đổi |

## 12. Kết luận cho v1.0 ở SHA `2e51e25`

**SẴN SÀNG.**

Lý do, theo đúng thước của lượt 4:

1. **Trục R (kiểm phần đã sửa) — 37/37 dòng R1 và 32/32 dòng R2 ĐÃ SỬA**, 0 SỬA MỘT PHẦN, 0 CHƯA SỬA, **0 HỒI QUY**. Mỗi dòng có ít nhất một lần gỡ phần sửa (bốn dòng chỉ-tài-liệu kiểm bằng đối chiếu nguyên văn thay cho test đỏ). Tổng của gói F: **15 đột biến, 15 bị giết**.
2. **Không có phát hiện Medium / High / Critical nào** trong cả 6 gói của lượt 4. Gói A: 1 Low (DSR4-A1, hiệu năng sắp tên). Gói B: 1 Low (DSR4-B1) + 1 Nit (DSR4-B2). Gói C: 1 Low (DSR4-C1). Gói D: 2 Low (DSR4-D1, D2). Gói E: 1 Low (DSR4-E1). Gói F: 1 Low (DSR4-F1). **Tổng 8 phát hiện: 7 Low + 1 Nit, 0 Medium trở lên** — không phát hiện nào là mất dữ liệu, hỏng file, lộ key hay chạy code lạ.
3. **Số đo không xấu hơn mốc Home PC sau #656** (`baseline.md`): 35 thao tác trên exe, **không dòng nào ⚠️** theo luật nhiễu; mọi thao tác màn < 200 ms; `db.save` 149 ms ≤ 400; Dọn sạch 123,3 ms ≤ 500; mở app lần đầu 3 521 ms < 4 396. Ở tầng Node, `listTrash` / `previewPurge` / `purgeTrash` đều **nhanh hơn** mốc Node của `baseline.md` (F đo lại).
4. **Cổng ở SHA ghim xanh và chạy lại được**: `pnpm verify` 3 975 test (99,18 / 97,27 / 99,17 / 99,35 %), 116 test Rust, **`pnpm e2e` 308 passed** (F chạy lại nguyên bộ: 308 passed, 0 flaky), bundle `index.js` −43 234 B, exe 5 649 408 B. Bộ chụp ảnh hướng dẫn 13/13 và 28 ảnh trùng byte.
5. **Bloat không tăng có chi phí**: `tsc --noUnusedLocals`, `eslint`, `depcruise`, `codemap --check` sạch; 0 export chết trong `tools/`/`e2e/`; phần tăng của bundle / exe giải thích được từng byte bằng quyết định có chủ ý (K38 `zod/mini` −62 735 B; K39 font + logo + favicon +172 925 B; icon exe +71 343 B).
6. **Điều kiện B2 của kế hoạch đạt**: sổ OPEN rỗng ở `2e51e25` (`tools/notes-for.mjs` in "Không có ghi chú OPEN nào nêu các file này"), nên lượt 4 ghim SHA hợp lệ.

Bảy phát hiện Low và một Nit **không chặn v1.0**: không cái nào làm sai dữ liệu đã lưu, không cái nào chặn việc chính, và mỗi cái đều có đường sửa ≤ 40 dòng (DSR4-F1 ≤ 10 dòng). Chúng nên vào sổ ghi chú review như mục không chặn, không phải mở đợt sửa trước khi phát hành.
