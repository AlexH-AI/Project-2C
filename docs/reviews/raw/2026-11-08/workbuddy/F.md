XONG — workbuddy gói F lượt 6, 13:28 08/11/2026

# Báo cáo deep review Phase 1–6, lượt 6 — gói F (Xuyên gói, bloat / hiệu năng, công cụ), bên workbuddy

## 1. Bên, gói, môi trường

- **Bên / gói:** workbuddy, gói **F — Xuyên gói, bloat / hiệu năng, công cụ** (`tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo gồm `eslint.config.js`, `.dependency-cruiser.cjs`; luồng xuyên gói; toàn codebase cho bloat và hiệu năng). Reviewer độc lập, chỉ đọc (ADR-0001 phụ lục M13); **không làm bảng R1 / R2** — theo `common\prompt-workbuddy.md` (Việc của gói mục 1) và `common\known.md` phần 4, 5, mọi dòng R1 (DR6-165 đo, 167, 171, 175–177) và R2 (T-371, 372, 373, 375, 378, 379, 383) là KNOWN.
- **SHA đầu phiên:** `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD`), đúng SHA ghim `5b1328a`.
- **`git status --short` đầu phiên:** rỗng (không có dòng nào).
- **Giờ bắt đầu:** 13:16 08/11/2026; **giờ xong:** 13:28 08/11/2026 (máy `DESKTOP-KDURKJP`, Home PC, GMT+7).
- **Công cụ:** app desktop WorkBuddy (bản theo `common\baseline.md`; baseline không ghi số bản của lượt 6 — Owner đã đăng xuất app lúc ≈ 11:02 07/11, phiên này không đọc thư mục dữ liệu của app), shell Git Bash của app, công cụ đọc / ghi file. **Không dùng agent phụ** (mọi việc làm trực tiếp). Không cài skill, không connector, không mạng ngoài, không `gh`, không đọc thư mục cấm, không chạy `common\dot2.mjs`.
- **Expert:** `CodeReviewExpert` (đã chọn trong phiên; mã không thấy).
- **Model:** ngữ cảnh phiên ghi `Deepseek-V4.1-Flash`; Owner chọn **Hy4** cho gói A–F (`common\baseline.md`, ghi chú sau phiên thử ≈ 23:35 07/11). Ghi cả hai, không khẳng định thay Owner. **Context:** không thấy trong ngữ cảnh phiên. **Mức suy luận:** không thấy trong ngữ cảnh phiên.
- **Node:** `v24.20.0` (`C:\Program Files\nodejs` đặt đầu PATH ngay trong từng lệnh, in ở lệnh shell đầu tiên của phiên: `node --version` → `v24.20.0`).

## 2. Bảng R1 / R2

Không có: agent WorkBuddy không làm bảng R (`common\prompt-workbuddy.md`, Việc của gói mục 1). Mọi dòng R1 / R2 là KNOWN; phần sửa nào hỏng lại thì ghi ở mục 5 với "Liên quan".

## 3. Phạm vi đã đọc

**Diff `37a80b6..5b1328a` của gói F** — `git diff --stat` 17 file, +911 / −79. Đọc **toàn bộ** 17 diff:

- `tools/auto-wait-core.mjs` (+129) và `tools/auto-wait.mjs` (+40): `STALE_HEAD_MS`, `readBranch`, `newestRunOfPr`, `runOf`, `VERDICTS`, `heldFor`, nhánh `--since` / `--not` mới. Đọc cả file ở SHA ghim (`auto-wait-core.mjs` 366 dòng, `auto-wait.mjs` 149 dòng) để đối chiếu nhánh cũ.
- `tools/auto-wait-core.test.mjs` (+288): đọc toàn bộ phần thêm (ba `describe` mới, `heldFor`, ca "failed reads in a row").
- `tools/notes-core.test.mjs` (+3), `tools/review-hint-core.test.mjs` (+2): đọc cả hai.
- `.dependency-cruiser.cjs` (+18): hằng `TEST_FILES` thay `AI_TEST_FILES`, rule `ai-test-support-only-in-tests` → `test-files-only-in-tests` (DR6-167).
- `.github/ISSUE_TEMPLATE/task.yml` (+17, mục "Ngân sách" / "Quét cùng mẫu"), `.github/pull_request_template.md` (+23, ba mục của PR sửa phát hiện).
- `.claude/skills/review-pr/SKILL.md` (+26) và `.claude/skills/auto-issues/SKILL.md` (+48): mục K48, "PR sửa phát hiện", trần chờ 15 phút, luật 60 phút, hàng "head của PR kẹt".
- `e2e/appointments.spec.ts` (+28), `e2e/customer-ai-web.spec.ts` (+4), `e2e/customer-policies.spec.ts` (+70), `e2e/dialog-keyboard.spec.ts` (+8), `e2e/long-names.spec.ts` (+244), `e2e/trash.spec.ts` (+26), `e2e/perf/probe.perf.ts` (+16).

**Phần còn lại của gói** (`common\files-F.txt`, 99 file): đọc kỹ phần lớn `tools/*.mjs` (file nào không đọc kỹ ghi ở dưới), cả ba `tools/*.ps1`, `.githooks/pre-push`, `.github/workflows/ci.yml`, hai hook `.claude/hooks/*.mjs`, `eslint.config.js`, `.dependency-cruiser.cjs`, `apps/desktop/vite.config.ts`, `packages/ui/scripts/check-tokens.ts`, `vitest.config.ts`, `playwright.config.ts`, `e2e/{support.ts,fixtures.ts,anchor.ts,seeded-snapshot.ts,serve.mjs}`, và `e2e/backup.spec.ts` quanh dòng 110–145.

**File của `files-F.txt` không đọc kỹ, và vì sao:**

- `tools/eval-ai-core.mjs` (808 dòng) và `tools/eval-ai-core.test.mjs` (1 325): harness của `pnpm eval:ai`, chỉ chạy khi Owner bấm và gọi dịch vụ AI thật — quy tắc chung 2 cấm chạy; đọc `tools/eval-ai.mjs` (phần I/O, 38 dòng) là đủ để biết nó ghi gì và ở đâu. Ghi nhận: `create` dùng cờ `wx`, `rename` / `remove` chỉ trên đường dẫn trong repo.
- `tools/retro-core.mjs` (260) + `retro.mjs` (73) + test: sinh bản retro từ GitHub; không nằm trên đường chạy của app hay pipeline merge. Đọc chữ đầu file và `retro.mjs`; không đọc thân `retro-core.mjs`.
- `tools/codemap-core.mjs` (200) + test, `tools/size-report.mjs` (48), `tools/load-data.mjs` (33), `tools/session-start.ps1` (72): đọc phần gọi và hợp đồng (`codemap.mjs`, `size-report-core.mjs`, `load-data-core.mjs`, `session-end.ps1`); phần render của `codemap-core` và test của nó không đọc kỹ — `pnpm codemap:check` xanh ở `baseline.md` là bằng chứng mạnh hơn.
- Các file `*.test.mjs` còn lại (`session-core.test`, `pr-core.test`, `pr-status.test`, `size-report-core.test`, `codemap-core.test`, `ts-hooks-core.test`, `session-end.test`, `notes-core.test` phần cũ): đọc lướt theo tên ca, không đọc từng dòng — gói F không có bảng R, và `pnpm verify` 4 493 test xanh ở `baseline.md` đã phủ phần này.
- **`e2e/*.spec.ts` không đổi trong diff (khoảng 50 file, vd. `customer-kyc`, `customer-ai`, `team`, `theme`, `navigation`, `reports`, `overview`, `data-table`, `save-state`, `settings-ai`, `full-cycle`, `appointment-outcome`, `period-picker`, `topbar-focus`, `chart`, `customers`, `customer-forms`, `customer-appointments`, `smoke`, `screen-error`, `demo-data`, `seeded-snapshot`, `seed-timing`, `fixtures`, `guide/*`):** không đọc kỹ. Lý do: không dòng nào đổi từ lượt 5, chúng đã được gói A–E của lượt 6 đọc theo màn, và phần F cần ở chúng là *khung* chạy (fixtures / support / serve / anchor / config) — đã đọc hết. Đọc thêm `backup.spec.ts:110–145` vì đó là chỗ duy nhất trong e2e nhắc nút "Mở thư mục".
- `pnpm-workspace.yaml`, `.github/ISSUE_TEMPLATE/config.yml`, `e2e/guide/{links.ts,links.spec.ts,check.guide.ts,shots.guide.ts}`, `playwright.guide.config.ts`, `playwright.perf.config.ts`, `e2e/perf/{stats.ts,stats.spec.ts}`: đọc tên và mục đích, không đọc thân. Lý do: cấu hình / ảnh hướng dẫn / bảng số của probe; `baseline.md` đã chạy chúng và ba bảng probe không có dòng ⚠️.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Dựng lại bundle web ở `5b1328a` (`pnpm build:web`, không đặt biến môi trường) rồi `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` | Trùng **mọi số** của bảng trong `baseline.md`: JS / CSS 2 369 229 B, `index.js` 894 865 B, `index.css` 30 387 B, "tệp khác" 19 file / 1 022 121 B. Cỡ theo gói cũng trùng (F 5 034 SP / 19 068 test / 100 file) | — |
| 2 | Tìm dấu vết công cụ / test trong bundle vừa dựng: `grep -c` cho `AUTO-WAIT`, `classifyFile`, `asExe`, `playwright` trên `dist/assets/index-*.js` | 0 cho cả bốn → code `tools/` và `e2e/` không lọt vào bundle | — |
| 3 | Đo lại bảng hàm thuần của Phase 4 trong Node trên dữ liệu tải (`F\perf-probe.mjs`, 5 lần mỗi hàm) | `importBackup` 819,2 ms · `listAppointments` 47,3 · `countRecords` 4,9 · `listTrash` 25,7 · `listAiAnalyses` 0,2 · `exportBackup` 191,1 — mọi hàm trong ngưỡng `phase-6.md` (bảng ở mục 6) | — |
| 4 | Chuỗi xuyên gói **Dọn sạch → xuất backup → nhập lại → xuất lần nữa** trên dữ liệu tải (`F\purge-roundtrip.mjs`, `F\diff-export.mjs`) | Thùng rác 113 → 0 dòng; số đếm "sống" không đổi (15 KH / 83 lịch hẹn / 5 HĐ / 49 ghi chú / 1 phân tích bị dọn đã nằm ngoài số đếm từ trước — đúng); file 16 034 517 → 15 487 370 B; nhập lại **được**; xuất lần hai **trùng từng byte** sau khi bỏ `exportedAt` (chỉ khác đồng hồ) | — |
| 5 | So **bộ lệnh Tauri của `asExe`** (`e2e/support.ts`) với `generate_handler!` của `apps/desktop/src-tauri/src/lib.rs` (`F\tauri-fake-vs-rust.mjs`) | 11 lệnh Rust; bộ giả trả lời 10, **thiếu `open_folder`**; mọi lệnh plugin (`event|listen`, `event|unlisten`, `window|destroy`, `window|set_title`) có đủ | **WBR6-F1** |
| 6 | Quét họ "hỏi trống bằng `trim()`" trên toàn code sản phẩm: `rg "\.trim\(\)"` trong `apps/desktop/src` + `packages/*/src`, bỏ test | 13 chỗ. Từng chỗ: `optionalText` (`db/common.ts:76`) và `rescheduleReason` (`appointment-form.ts:92`) cắt khoảng trắng để **lưu**, hỏi trống bằng `normalizeText`; `readOutcome` (`outcome-form.ts:213`) cũng vậy; `extraction-view.ts:19` là **độ dài** ghi chú đã chuẩn hóa khi lưu; `settings-ai-view.ts:31` là ô key (`NOT_ASCII` chặn ký tự vô hình); còn lại là `normalizeText` / `collapseSpaces` / token CSS. Không chỗ nào là mục mới của họ DR6-150 | — |
| 7 | Quét export không ai dùng (`F\unused-exports.mjs`): 1 063 tên export trong code sản phẩm | 76 tên không được nhắc ngoài file, **toàn bộ là type / interface** trừ 4 hằng số dùng ngay trong file mình (`AI_MODES`, `AI_OPENCODE_PLANS`, `AI_ANALYSIS_MODES`, `APPOINTMENT_TODAY`). Không có hàm / component chết | — |
| 8 | Quét khóa i18n không dùng (`F\i18n-unused.mjs`): 1 202 khóa của `vi.ts`, kể cả khóa ghép bằng template (`` `stage.${…}` ``, `` `policyForm.effect${…}` ``) | 0 khóa thừa (bốn khóa `policyForm.effect*` là khóa ghép, không phải thừa) | — |
| 9 | Đọc lại nhánh `ciState` mới theo 6 ca của `auto-wait` (`--not` + nhánh kẹt, `--since` + run `pull_request`, run cancelled, run failure chưa có check đỏ, run của event khác, 404 nhánh fork) đối chiếu bộ test thêm | Mỗi ca có ca test tương ứng; không thấy nhánh nào không kiểm được. `newestRunOfPr` lọc theo `head_branch` **và** `head_sha` (qua `runsOf(head)`), nên không bắt nhầm run của nhánh khác | — |
| 10 | Kiểm `git status --short` sau khi dựng bundle và chạy probe | Rỗng; `dist` bị ignore, không file lạ | — |

## 5. Phát hiện mới

```
ID: WBR6-F1
Mức: Low
Trục: T
Vị trí: e2e/support.ts:187 (bộ `commands` của `asExe`, tới :242) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: không có DR6 / T · có từ trước, lượt 1–5 bỏ sót (bộ giả `asExe` và lệnh `open_folder` đều có trước `37a80b6`)
Mô tả: Bộ giả Tauri của e2e (`asExe`) không trả lời lệnh `open_folder`, lệnh duy nhất trong 11 lệnh Rust mà app có gọi; nút "Mở thư mục" ở Cài đặt → Dữ liệu vì thế không có đường nào được chạy thật trong e2e, và ai viết ca cho nó sẽ nhận `unexpected command open_folder` thay vì một kết quả.
Tái hiện / bằng chứng:
  - `node C:\workspace\deep-review-1-6-r6\workbuddy\F\tauri-fake-vs-rust.mjs` →
    `fake commands (24): db_open, db_save, db_backup, db_latest_backup, export_write, ai_key_status, ai_key_set, open_chatgpt, ai_key_delete, ai_complete, plugin:event|listen, …`
    `rust commands (11): db_open, db_save, db_backup, db_latest_backup, export_write, open_folder, ai_complete, ai_key_set, ai_key_delete, ai_key_status, open_chatgpt`
    `app commands the fake does not answer: open_folder`
  - `apps/desktop/src/data/tauri-storage.ts:88`: `await invoke('open_folder', { kind });` — chỉ có một chỗ gọi.
  - `apps/desktop/src/routes/SettingsDataFile.tsx:92` vẽ `<OpenFolderButton folder="backups" />` trong `FileFacts`, khối chỉ hiện khi app có file (`data.hasFile`), tức khi `isTauri()` — mà `asExe` đặt `isTauri: true` (`e2e/support.ts:245`). Vì thế nút **có mặt** ở mọi ca dùng `asExe` mà mở Cài đặt → Dữ liệu: `customer-ai`, `dialog-keyboard`, `full-cycle`, `save-state`, `settings-ai`, `team`, `trash` (7 spec, `grep -ln asExe` ∩ `grep -ln "File dữ liệu|Xuất / nhập backup"`).
  - `rg "Mở thư mục" e2e` → đúng một dòng, `e2e/backup.spec.ts:137`, và đó là ca **bản web**: `toHaveCount(0)`. Không ca nào bấm nút.
  - Đường đi thật khi bấm: `OpenFolderButton` → `data.openFolder('backups')` → `storage.openFolder` → `invoke('open_folder')`; trong `asExe`, `invoke` tra `commands['open_folder']` = `undefined` → `throw new Error('unexpected command open_folder')` (`e2e/support.ts:256`), UI hiện `settings.file.openFailed`.
Cùng mẫu: `node …\F\tauri-fake-vs-rust.mjs` (so cả hai chiều) và `rg -n "open_folder|OpenFolderButton|isTauri" apps packages e2e`. Mọi lệnh khác của app đều có trong bộ giả; `open_chatgpt` có (`e2e/support.ts:213`), `export_write` khớp chữ ký thật (`invoke('export_write', bytes, { headers })` ↔ `export_write(request)`), `db_*` khớp. Không có chỗ thứ hai cùng mẫu.
Ảnh hưởng: người dùng exe bấm "Mở thư mục" ở Cài đặt → Dữ liệu (mở `Project2C-data\backups\` trong Explorer) là đường duy nhất bị bỏ ngoài e2e; một hồi quy ở `openFolder` (sai `kind`, lỗi không hiện, nút hiện cả ở bản web) không có ca nào bắt. Unit test chỉ ghim chuỗi lệnh và đối số (`tauri-storage.test.ts:71–73`), không đi qua component.
Chặn phát hành: không — Low ở trục T (K48: Low ngoài D / S / G vào sổ, nhãn [sau v1.0]).
Đề xuất: thêm một khóa vào bộ giả, `open_folder: (args) => { exe.folders.push(args.kind as string); return null; }`, cộng một ca trong một spec đã dùng `asExe` (vd. `save-state.spec.ts` hoặc `full-cycle.spec.ts`): mở Cài đặt → Dữ liệu, bấm "Mở thư mục", `expect(await page.evaluate(() => window.exe.folders)).toEqual(['backups'])`; thêm một ca âm cho nhánh lỗi bằng `failFolders`. Cỡ: ≈ 4 dòng test (harness) + ≈ 10 dòng test. Biến thể cùng họ, không tách ID: `db_backup` của bộ giả trả tên cố định `project2c-20260915-0930.db` (`e2e/support.ts:200`), trong khi app thật ghi `project2c-s<seq>-<ngày giờ>.db` (`baseline.md`, thông báo 11j) — ca nào in tên file backup sẽ ghim một tên exe không bao giờ ghi.
```

## 6. Bloat và Hiệu năng

### Bloat (toàn codebase)

| Đã chạy / đọc gì | Trên cái gì | Kết quả (số) | Phát hiện |
|---|---|---|---|
| `F\unused-exports.mjs` (đọc `git ls-files`, bỏ `docs/`, bỏ test) | 1 063 tên export của code sản phẩm | 76 tên không được nhắc ngoài file mình; **0 hàm / component chết**; 4 hằng số chỉ dùng trong file (`AI_MODES`, `AI_OPENCODE_PLANS`, `AI_ANALYSIS_MODES`, `APPOINTMENT_TODAY`) → chỉ là chữ `export` thừa | không (Nit, không đo được chi phí; K49 cấm gỡ) |
| `F\i18n-unused.mjs` | 1 202 khóa `vi.ts`, kể cả khóa ghép template | 0 khóa thừa | không |
| `pnpm build:web` + `node tools/size-report.mjs --compare …` | `apps/desktop/dist` ở `5b1328a` | JS / CSS 2 369 229 B (gzip 700 524), `index.js` 894 865, `chart.js` 513 302, `exceljs.min.js` 929 569, `index.css` 30 387, tệp khác 19 file / 1 022 121 B — **trùng mọi số trong `baseline.md`**; so lượt 5: +2 773 B (+0,12 %) | không |
| `grep -c` dấu vết `AUTO-WAIT` / `classifyFile` / `asExe` / `playwright` trong `dist/assets/index-*.js` | bundle | 0 / 0 / 0 / 0 | không — `tools/` và `e2e/` không vào bundle |
| `rg` import từ `e2e/` hay `tools/` trong `apps/desktop/src`, `packages/*/src`; `rg "exceljs"` | code sản phẩm | 0 import; `exceljs` chỉ vào bằng `await import('exceljs')` (`report-workbook.ts:133`) nên nằm ở chunk riêng | không |
| Cỡ theo gói (`size-report`) | gói F | 5 034 SP / 19 068 test / 100 file; so lượt 5: +148 SP, +641 test; `tools/*.mjs` + `tools/*.ps1` (không tính test) = 4 438 dòng, tức phần lớn dòng sản phẩm của F, và **không vào exe** | không — tỉ lệ test/sản phẩm 3,8 : 1 của gói F là bình thường với một gói công cụ |

Kết luận bloat: **không có code chết có chi phí đo được, không có code test / công cụ lọt vào bundle hay exe.** Phần lớn dòng sản phẩm của F là `tools/` (không vào exe) và `e2e/` (test).

### Hiệu năng

Máy `DESKTOP-KDURKJP` (Home PC), Node `v24.20.0`, dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (1 496 KH / 10 414 lịch hẹn / 113 dòng Thùng rác), đo 13:18–13:26 08/11/2026, máy rảnh (chỉ tiến trình probe của tôi chạy). Trung vị (min–max) của 5 lần, ms.

| Hàm (bảng hàm thuần của Phase 4, `phase-6.md` cuối mục thời gian) | Trung vị | Min–max | Ngưỡng | Kết quả |
|---|---:|---|---|---|
| `importBackup` | 819,2 | 791,0–846,2 | ≤ 1 100 ms | ✅ |
| `listAppointments` (10 255 dòng sống) | 47,3 | 45,0–51,3 | ≤ 65 ms | ✅ |
| `countRecords` | 4,9 | 4,8–5,3 | ≤ 15 ms | ✅ |
| `listTrash` (113 dòng) | 25,7 | 23,7–41,0 | < 200 ms (Nhóm C); `baseline.md` Node: 24,1 | ✅ |
| `listAiAnalyses` (KH có 2 phân tích — phần AI của hồ sơ) | 0,2 | 0,1–0,7 | < 200 ms | ✅ |
| `exportBackup` (15,5 MB) | 191,1 | 177,9–242,7 | ≤ 1 000 ms (`backup.export` trên exe: 427) | ✅ |

So mốc **cùng máy** (`baseline.md`): mọi dòng probe trên exe ở `5b1328a` đã trong ngưỡng và không dòng nào ⚠️ so mốc sau #656, G7 và lượt 5; bảng hàm thuần ở trên chỉ để đối chiếu ngưỡng, không so với số Phase 4 (khác máy, probe ngoài repo) — đúng §L6.6. Không có phát hiện P: không hàm nào gần ngưỡng (xa nhất là `importBackup` 819 / 1 100 = 74 %).

## 7. Đếm và kết luận

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

- 1 phát hiện; **0 xếp chặn phát hành**, 1 không chặn (WBR6-F1, Low / T).
- **0 PLAUSIBLE** — phát hiện duy nhất đã chạy lệnh và dán kết quả.
- Không có dòng R nào để nêu; không thấy phần sửa nào của lượt 5 hỏng lại (đã đọc kỹ `auto-wait-core.mjs` và `.dependency-cruiser.cjs`, hai chỗ đợt sửa chạm nhiều nhất trong gói).

**Kết luận cho v1.0 ở `5b1328a`: SẴN SÀNG** (đề xuất; phiên tổng hợp chốt). Lý do theo K48: gói F không có phát hiện nào xếp chặn phát hành; phát hiện duy nhất là Low ở trục T (một lỗ của bộ giả e2e), vào sổ [sau v1.0]. Ba chuỗi đã dựng — dựng lại bundle, dọn sạch rồi xuất / nhập lại backup, và so bộ lệnh Tauri của bộ giả với Rust — đều cho kết quả khớp; mọi số hiệu năng trong ngưỡng, cách mốc cùng máy không quá luật nhiễu.

## 8. Đã xét, không thấy

- **E — Edge case:** `ciState` với `--not` khi nhánh không có (404) / nhánh đã đi trước head 3 phút / head đã đổi; `--since` khi run bị cancelled, `startup_failure`, run của `push` / `workflow_dispatch`, run chưa có check, run failure chưa có check đỏ; PR không còn mở. Đọc `tools/auto-wait-core.mjs:158–238` + 18 ca test thêm. Không thấy.
- **C — Đúng hợp đồng:** mô tả `ciState` (khối chú thích 139–157) khớp từng nhánh code; `tools/auto-wait.mjs` usage (dòng 5–24) khớp mã thoát; `.claude/skills/auto-issues/SKILL.md` (hàng "head của PR kẹt", luật 60 phút, `--timeout 15`) khớp hành vi mới (exit 3 sau 3 phút, `--since` chờ run `pull_request`); `ci.yml` `paths` khớp `CODE_DOCS` của `pr-core.mjs` (test của repo giữ); tên rule mới `test-files-only-in-tests` không còn tài liệu sống nào dùng tên cũ (`rg` chỉ ra báo cáo lịch sử). Không thấy.
- **D — Dữ liệu:** chuỗi Dọn sạch → xuất → nhập lại (kịch bản 4): không mất dòng, không sinh dòng, file nhỏ đi 3,4 %, nhập lại được, xuất lại trùng từng byte sau `exportedAt`. Không thấy.
- **G — Guardrail AI:** gói F chỉ chạm guardrail ở `tools/eval-ai.mjs` (I/O của harness) và `tools/eval-ai-core.mjs:59–65` (đọc `OPENCODE_GO_KEY` từ `env`, chỉ trả lỗi "thiếu biến", `OPENCODE_PLAN` chỉ nhận GO / CREDIT); không đọc hết thân `eval-ai-core.mjs` (808 dòng) nên không khẳng định gì thêm về nó. Ở bộ giả, `ai_key_set` giữ key trong bộ nhớ trang, như Rust giữ ngoài webview. Không thấy.
- **S — An toàn ranh giới:** `tools/*.mjs` ghi file đúng ba chỗ (`codemap.mjs:83` ghi `CLAUDE.md`, `handoff.mjs` ghi cache trong git dir + file `--out`, `load-data.mjs` ghi `--out`), `eval-ai.mjs` chỉ ghi `docs/metrics/ai-eval-*` với cờ `wx`; `.githooks/pre-push` chặn mọi push vào `refs/heads/main` kể cả xóa; `check-tokens.ts` chỉ đọc; hook `.claude/hooks/*` chỉ đọc. Không script nào gọi `rm -rf` hay `git reset`. Không thấy.
- **P — Hiệu năng:** bảng ở mục 6; thêm `importBackup` 819 ms (74 % ngưỡng) là chỗ gần ngưỡng nhất, không phải phát hiện. Không thấy.
- **B — Bloat:** mục 6; 0 code chết, 0 khóa i18n thừa, bundle không lẫn code công cụ. Không thấy.
- **T — Chất lượng test:** đọc toàn bộ test thêm của `auto-wait-core` (mỗi nhánh mới có ca, kể cả ca âm: 404, 500, run cancelled, head đã đổi, `heldFor` trả về 0 khi giá trị đổi); `probe.perf.ts` `metRows` đọc ô Trạng thái theo `cellIndex` (đúng: `filter({has})` neo lại trong từng dòng) và `e2e/perf` vẫn ra đúng kỳ của lượt 5; các e2e mới của DR6-168, 172, 173, 174 và NT-TR-07 đều có ca âm (ký tự vô hình một mình → không lưu / không nhập lại; bấm nút đang chạy → một lần nhập). Chỉ một lỗ: WBR6-F1.
- **A — Trợ năng / i18n:** 0 khóa i18n thừa; `check-tokens` phủ `apps/desktop/src` + `packages/ui/src/components` (kể cả dấu phân cách); không chuỗi cứng mới trong diff (ba e2e mới dùng nhãn có sẵn). Không thấy.

## 9. Phụ lục

**Nguồn probe / script tạm** (đều trong `C:\workspace\deep-review-1-6-r6\workbuddy\F\`, không file nào trong repo):

| File | Việc | Kết quả |
|---|---|---|
| `perf-probe.mjs` | đo 6 hàm thuần trên dữ liệu tải, 5 lần mỗi hàm | bảng ở mục 6 |
| `purge-roundtrip.mjs` | Dọn sạch → xuất → nhập lại trên dữ liệu tải | 113 → 0 dòng; nhập lại OK; 15 487 370 B |
| `diff-export.mjs` | so lần xuất thứ hai với lần đầu sau khi bỏ `exportedAt` | `same after stripping exportedAt: true`; chỉ `exportedAt` khác |
| `unused-exports.mjs` | 1 063 tên export, đối chiếu toàn repo | 76 không dùng ngoài file, toàn type + 4 hằng |
| `i18n-unused.mjs` | 1 202 khóa `vi.ts`, kể cả khóa ghép template | 0 thừa |
| `tauri-fake-vs-rust.mjs` | so `asExe` với `generate_handler!` | thiếu `open_folder` → WBR6-F1 |

**Đột biến:** không làm. Gói F không có bảng R; phần sửa của lượt 5 trong gói (DR6-175, 176, 177, T-371…383) là KNOWN, và câu hỏi "test có đỏ khi gỡ phần sửa" thuộc bảng R của Claude.

**Việc đã chạy trong repo (chỉ đọc / chỉ ghi thư mục bị ignore):** `pnpm build:web` (dựng `apps/desktop/dist`, bị ignore), `node tools/size-report.mjs --compare …` (chỉ đọc), `git rev-parse` / `git status`. Không sửa file nào; không chạy `pnpm e2e` (cổng 4173 để trống cho bên khác), không chạy `gh`, không gọi mạng.

**`git status --short` cuối phiên:** rỗng.

**Giờ xong:** 13:28 08/11/2026.
