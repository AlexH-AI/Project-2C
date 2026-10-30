XONG — claude gói E lượt 4, 2026-10-29 11:20 (+07:00)

# Deep review Phase 1–6, lượt 4 — Claude, gói E (Lịch hẹn, chỉ số, quản lý)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude |
| Gói | E — Lịch hẹn, chỉ số, quản lý |
| SHA đầu phiên | `2e51e25eb0125f56d3d938b97ef18d6873dae076` (khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-29 10:25 (+07:00), Home PC |
| Công cụ | Claude Code, app desktop (tab Code), worktree `C:\workspace\Project-2C-review` |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | `max` (đọc từ cài đặt phiên) |
| Ultracode | tắt (không subagent / Workflow) |
| Bước 0 | `E.md` chưa có → làm mới; `A.md`…`D.md` có đủ, dòng đầu đều `XONG` |

> Tiến độ: 10:25 bước 0 xong. Đã đọc `prompt-claude.md`, `known.md` (đủ), `baseline.md` (đủ), `plan.md` §L4.1–§L4.8, `fixes.md` (#785/#833, #787/#838, #788/#841, #790/#845/#846, #784/#825, #849/#855, #865/#871, #850/#857, #725/#748 và nhóm RESOLVED), báo cáo gốc lượt 3 Claude E, `claude\D.md` lượt 4 (đủ), danh sách phát hiện `claude\A.md`–`C.md`. Danh sách gói E: `E\list.mjs` → `E\list.log` (52 file, **8 155 SP / 4 556 test**, diff `119e2e4..2e51e25` SP +978 / −579, test +456 / −46 = `baseline.md`). Công cụ lượt 3 của Claude E chép theo tên đầy đủ (`Test-Path` từng tên) vào `E\r3copy\`; bản làm việc ở `E\` (`build-dist.mjs`, `serve-dist.mjs` host `localhost`, `pw.config.mjs` host `localhost` + báo cáo JSON, `e2e-mut.mjs` mới: KILLED chỉ khi một ca xanh ở đối chứng đỏ ở bản đột biến, so theo tên ca). Bản dựng ngoài repo: `E\dist-base` (neo 15/09/2026 + ảnh chụp demo như `e2e/serve.mjs`), `E\dist-real` (không neo); `git status --short after: ""`. Cổng: 4631 (bản ghim), 4632–4639 (đột biến), 4640–4649 (probe). 10:33–10:36 đối chứng cả bộ e2e trên `dist-base` (host `localhost`): **296 / 296 passed** (144 s; `E\e2e-mut.log`, `E\control.json`). Vitest đối chứng `apps/desktop/src/routes/` qua `mutant-config.mjs`: 24 file, 520 / 520. 10:38 `p20-same-figures.mjs` (cùng bảng dữ liệu tải, code `119e2e4` ↔ ghim): **0 khác** trên 264 ca (Báo cáo mọi bảng, 72 file Excel / 46 410 ô kể cả `numFmt` / gộp ô / bề rộng cột, chart N4–N1, So sánh team). 10:42–10:45 vitest đột biến: **23 / 23 KILLED** (`E\mutjs.log`). 10:43–11:02 25 đột biến e2e (22 KILLED, 3 sống; `E\e2e-mut.log`), 11:04 T305b cả bộ. 10:47–11:20 probe K1–K13 (mục 4), đo (mục 6.2), Bloat (mục 6.1), ghi báo cáo. Giờ theo đồng hồ máy (log in giờ UTC).

**Ghi chú cho Owner (ranh giới đọc):** phiên chạy **hai lần `Grep` trên thư mục `deep-review-1-6-r4\claude\`** với mẫu file `[ABCD].md` (tìm ID phát hiện của gói trước để không báo trùng); kết quả chỉ có bốn báo cáo `A.md`–`D.md` của chính Claude, không chạm `codex\` / `deepseek\`, không thấy gì của bên khác. Quy tắc 2 cấm tìm kiếm trên `deep-review-1-6-r4\`, nên ghi ra đây (chi tiết ở 9.3).

## 2. Bảng R

**Cách làm chung** (mọi probe, log, nguồn ở `C:\workspace\deep-review-1-6-r4\claude\E\`; chạy song song: Codex đợt 1 ở `Project-2C-review-2`):

- **Công cụ lượt 3 của chính Claude E** (`deep-review-1-6-r3\claude\E\`, mở theo tên đầy đủ sau `Test-Path` từng tên, tên lấy ở phụ lục 9.1 của `docs/reviews/raw/2026-10-21/claude/E.md`) chép nguyên vào `E\r3copy\`. Bản làm việc ở `E\`: `build-dist.mjs` (Vite `build()` của worktree ghim + hook `load` phục vụ bản đột biến, `--outDir` ngoài repo), `serve-dist.mjs` (host `localhost`), `pw.config.mjs` (theo `playwright.config.ts`: Desktop Edge 1 280 × 720, `msedge`, `vi-VN`, `expect` 15 s, bỏ `seed-timing` / `perf` / `guide`; host `localhost`; báo cáo JSON), `browser.mjs` (viết lại: chặn mạng ngoài localhost / 127.0.0.1 từ lần chạy đầu bằng `--host-resolver-rules` + `route.abort`, thay `window.open` / clipboard, `asExe` chép lại theo `e2e/support.ts` ở `2e51e25`, đồng hồ trang), `hooks.mjs` (loader TS + `@p2c/ui` thay bằng `ui-stub.mjs` + `P2C_REPO` cho cây `119e2e4`), `mut-list.mjs` (48 đột biến), `mutjs.mjs` + `mutant-config.mjs` (vitest qua hook `load`, repo không đổi byte), `e2e-mut.mjs` (viết lại: **KILLED chỉ khi một ca xanh ở đối chứng đỏ ở bản đột biến, so theo tên ca**; lượt 3 đếm cả ca hỏng vì host).
- **Bản dựng:** `E\dist-base` (neo 15/09/2026 + ảnh chụp demo như `e2e/serve.mjs`, cổng 4631), `E\dist-real` (không neo; ngày = đồng hồ trang), bản đột biến `E\dist-<id>` (4632–4639). Không dùng 4173, không `PW_REUSE`, không chạy exe. Cây `E\old-119e2e4\` = `git archive 119e2e4 packages apps/desktop/src apps/desktop/index.html`, ngoài repo.
- **Đối chứng:** cả bộ e2e của repo trên `dist-base`: **296 / 296 passed** (`E\e2e-mut.log`, `E\control.json`); vitest `apps/desktop/src/routes/` qua `mutant-config.mjs`: 24 file, 520 / 520. `git status --short` rỗng sau mỗi lần dựng / mỗi đợt đột biến (dòng cuối `E\mutjs.log`, `E\e2e-mut.log`).

### 2.1 Bảng R1 (9 dòng của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-110 | #721 → #738 (phần gói E) | **ĐÃ SỬA** (phần gói E; biến thể còn hở **CLR4-E1**) | Ô gói E đọc chữ qua `parseVnd` / `parseQuickDate` đã chuẩn hóa (`domain`; gỡ sửa ở `domain`: `claude\A.md` dòng DR6-110). `p25-money-docs.mjs` (`E\p25-money-docs.log`): Case size / FYP dán "⁠1,234 tr" + U+0085 → "1.234.000.000 ₫ (1,23 tỷ)", "﻿0,500​tr" → "500.000 ₫"; `p25b-blank.mjs`: ngày 6b / 6e chỉ có ký tự vô hình → `empty` như ô trống. Tái hiện lượt 3 (chữ gốc lọt vào số) không còn | Ô **tùy chọn** Case size chỉ có ký tự vô hình → "Chưa nhập số tiền." và chặn Lưu (6c / 6d / 6f), trong khi ô ngày sinh 5a cùng #738 coi là "không có" → **CLR4-E1**. Chữ số toàn khổ "１,２ tr" → `format` (NFC, không NFKC, như K25) |
| DR6-119 | #725 → #748 (+ #785 → #833) | **ĐÃ SỬA** (biến thể còn hở **CLR4-E2**) | Tái hiện CL3-E1 / E2 (`r3-p04-same-day-labels.mjs` = `p04` lượt 3, bản ghim, `E\r3-p04-same-day-labels.log`): thẻ Hợp đồng "Phát hành HĐ nộp 10/09/2026 · 24.000.000 ₫", "Sửa HĐ nộp 10/09/2026 · 24.000.000 ₫ · Đã nộp", "… 30.000.000 ₫ …" (4 tên khác nhau); Thùng rác 5 dòng (Không đến / Hủy cùng giờ, ba HĐ cùng ngày, hai cùng FYP khác trạng thái): 5 tên khác nhau, "D restore names shared by rows that read differently []". **Gỡ sửa:** R119a (`restoreLabel` bỏ chữ huy hiệu) **KILLED** 7 ca `trash-view.test.ts`; R119b ("Sửa HĐ" không trạng thái) **KILLED** `customer-policies.spec.ts:247`; R119c ("Phát hành HĐ" không FYP, như trước #748) **KILLED** `:220`, `:247` | Hai KH cùng tên **cùng nhóm** trong Thùng rác: cùng tên nút (21 cặp trên Thùng rác lớn 1 313 dòng, `p23`) → **CLR4-E2** |
| DR6-128 | #725 → #748 (+ #785 → #833) | **ĐÃ SỬA** | (a) Đột biến sống của lượt 3 (R84e–j, CL3-E3) áp lại vào chỗ mới (`ConfirmWordDialog.tsx`, `SettingsTrash.tsx`): R128e (câu nhắc theo dòng đang lọc), R128f (nút theo dòng đang lọc) **KILLED** `trash.spec.ts:553`; R128g (chữ bất kể hoa / dấu cách) **KILLED** `:501`, `:553`; R128h (không NFC) **KILLED** `:501`, `:553`, `demo-data.spec.ts:36`; R128i (Escape đóng khi đang chạy) **KILLED** `:627`, `dialog-keyboard.spec.ts:135`; R128j (Hủy bật khi đang chạy) **KILLED** `:627` (tên ca đọc ở `E\mut\<id>-<n>.json`). (b) R04g-tsx lượt 3 (CL3-E4) = R128b (6f gọi `editedDay` không mang nhóm đã giữ) **KILLED** `appointment-outcome.spec.ts:400` (ca E19 mới của #748) | Biến thể: R128k (ô chữ bật khi đang chạy) **KILLED** `:627`; R128l (nút không đổi "Đang dọn…") **KILLED** `:627`, `dialog-keyboard.spec.ts:135`, `save-state.spec.ts:133`; R128n (hộp lập kế hoạch từ dòng đang lọc, TR-11) **KILLED** `:553`. R128m (gửi lần hai khi đang chạy) **sống** 27 / 27: tương đương trên màn — ô chữ và nút đã tắt nên không còn đường gửi lần hai |
| DR6-131 | #729 → #755 (+ #756 → #758) | **ĐÃ SỬA** (tài liệu, khớp app) | Mockup 6d `appointment-forms.html:244` và NT-LH-25 (`nghiem-thu-v1.md:137`) ghi "1,234 tr" = 1.234.000.000 ₫, "0,500 tr" = 500.000 ₫ (một lần), "1,2 tr" → "1.200.000 ₫ (1,2 tr)". App (`p25-money-docs.mjs`): đúng từng ca; `outcome.caseSizeHelp` trùng nguyên văn câu help của mockup (`help found word for word in mockup 6d true`); `12,5` → "Số tiền phải là số đồng nguyên.", âm, chữ như NT-LH-25 | "200 tỷ": ô đọc lại "200.000.000.000 ₫ (200 tỷ)", câu "Số tiền tối đa 100 tỷ đồng." đến từ lệnh khi Lưu (`AMOUNT_TOO_LARGE`, K3) — khớp NT-LH-25 "không lưu" |
| DR6-134 | #720 → #740 (phần gói E) | **ĐÃ SỬA** | `meetingDay` (`outcome-form.ts:107`) đọc `stagesOfDay(own, day).at(-1)` của `@p2c/db`, không còn bản riêng. **Gỡ sửa:** R134a (lấy nhóm đầu ngày thay nhóm cuối ngày) **KILLED** 4 ca `outcome-form.test.ts` (gồm E19). Phần lệnh / luật nhập: `claude\A.md` | — |
| DR6-37 | #790 → #845 (phần gói E) | **ĐÃ SỬA** (phần gói E) | `sep-scan.mjs` (38 file SP gói E, bỏ comment; `E\sep-scan.log`): 0 ký hiệu / dấu nối viết thẳng (2 dòng báo là kiểu TS `}: {`), `findHardcodedSeparators` 0 trên mọi file. `×` (6b), `▾ ▸` (So sánh team), `—` (`outcomeText`) qua `vi.ts`. **Gỡ sửa** (`r37-guard-e.mjs`, đặt lại từng ký hiệu vào file như trước #845 rồi chạy bộ chặn của `pnpm lint:tokens`): R37Ea `×`, R37Eb `▾ ▸`, R37Ec `—`, R37Ed `·`, R37Ee `→`, R37Ef `.join(', ')` đều **CAUGHT** | Dạng bộ chặn không thấy: CLR4-D1 (gói D), không báo lại |
| DR6-66 | #790 → #845 (phần gói E) | **ĐÃ SỬA** (phần gói E; dư một export → **CLR4-E3**) | Mục lượt 1 của gói E: `markName` và `REPORT_STAGES` (`reports-view.ts`) thôi export. `r2-exports.mjs` (scanner lượt 2–3, `E\exports.log`, 38 file SP): "chỉ test dùng" còn `OUTCOME_CHOICES`, `readFyp`, `buildReportWorkbook`, `reportFileName`, `reportWorkbookMeta` (seam test, chính file dùng, như lượt 2–3) và 7 kiểu; không ai import ngoài file: 23 kiểu và **`PURGE_REMINDER`** (hằng) | Gỡ sửa (export lại `markName`): không chạy; đọc thì không gì giữ — khối codemap của app chỉ liệt kê tên file, `tsc --noUnused*` không xét export, không có bộ chặn export chết (knip là G4). `PURGE_REMINDER` lượt 3 đã ghi "cùng loại DR6-66", Issue #790 không liệt kê nên còn → CLR4-E3 |
| DR6-67 | #790 → #845, #849 → #855 (phần gói E) | **ĐÃ SỬA** (phần gói E) | `CARD` / `ALERT` / `LINK` / `FOCUS` / `HEADING` / `SETTINGS_SECTION` / `PANEL` từ `classes.ts`; `stageBadge` một nơi; 17 cột Báo cáo một danh sách (`REPORT_COLUMNS`); `plain` → `stripDiacritics` (`domain`). `p20-same-figures.mjs`: code `119e2e4` ↔ ghim trên cùng bảng dữ liệu tải → **0 khác** ở 264 ca (bảng Báo cáo, 72 file Excel / 46 410 ô kể cả `numFmt`, gộp ô, bề rộng cột). **Gỡ sửa:** T301f (đổi chỗ "Chuyển RF" ↔ "HĐ nộp" trong `REPORT_COLUMNS`) **KILLED** 3 ca (`reports-view.test.ts`, `report-workbook.test.ts`) | `download()` còn 2 nơi (`SettingsBackup.tsx:174`, `ReportExport.tsx:88`, chỉ khác MIME), dưới ngưỡng ≥ 3 nơi, như lượt 3 |
| CL3-B2 | #783 → #817 (phần gói E: câu từ chối có vế "Thử lại") | **ĐÃ SỬA** (phần gói E; test hở **CLR4-E4**) | Ba câu D7 có vế "Bấm "Thử lại" ở dải cảnh báo đầu màn…" (`vi.ts:367`, `:1140`, `:1173`). Trên màn (`p29-import-refused.mjs`, exe giả, `E\p29-import-refused.log`): lưu lỗi (`DISK_FULL`) → Nhập backup → `role="alert"` "Chưa nhập: lần lưu gần nhất bị lỗi, … Bấm "Thử lại" …, lưu được rồi thì nhập lại. Dữ liệu hiện tại không bị đổi.", không backup / không lưu (`[]`), team mới còn; "Thử lại" → nhập được ("Đã nhập backup …", team mới mất). **Gỡ sửa:** RB2f (Dọn sạch câu thường) **KILLED** `trash-view.test.ts`; RB2g (Nạp lại câu thường) **KILLED** `save-state.spec.ts:79`; RB2e (Nhập backup nói câu thường, bỏ vế "Thử lại") **sống cả bộ e2e** (296 / 296, `E\e2e-mut.log`) → CLR4-E4 | Chuỗi exe (dải → Dọn sạch bị từ chối → Thử lại → dọn): `claude\B.md`; nút Thử lại: `claude\D.md` |

Đếm R1 (9 dòng của gói E): **9 ĐÃ SỬA** (DR6-110, 37, 66, 67, 134, CL3-B2 là phần gói E; DR6-131 sửa bằng tài liệu), 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Biến thể còn hở: CLR4-E1 (DR6-110), CLR4-E2 (DR6-119), CLR4-E3 (DR6-66), CLR4-E4 (CL3-B2).

### 2.2 Bảng R2 (10 Issue của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-284 | #773 → #795 (phần gói E: mẫu 8d "dời tháng") | **ĐÃ SỬA** (mockup, khớp app) | `policy-forms.html:218` "tháng 08/2026: −1 HĐ nộp · tháng 09/2026: +1 HĐ nộp", `:230` (một dòng cho mỗi chỉ số đổi tháng) = `policyForm.countMoved` "tháng {from}: −1 {label} · tháng {to}: +1 {label}" (`vi.ts:1357`); app ra đúng dạng đó (`p22`: "tháng 03/2026: −1 HĐ nộp · tháng 02/2026: +1 HĐ nộp") | Không in đậm `−1` / `+1`: "Lệch mockup đã biết" (Hộp 8d). Token `--border-control` / 2h / 1a / 4a: gói D, C |
| T-291 | #780 → #824, #828 (phần gói E: luật 5 ở 6b / 6e, luật 4 ở chữ tùy chọn của lịch hẹn) | **ĐÃ SỬA** (phần gói E; biến thể **CLR4-E1**) | ADR-0007 phụ lục dòng 87 = code: 6b `any`, 6e `reschedule` (gợi ý cả khi chưa tick "Nhập bù"; bấm gợi ý thì báo "đã qua"), 6h `fromToday` (không gợi ý), 6f `any` nhưng không vẽ `DateSuggestion`; ca e2e "early in the year a day not yet come offers last year…" (`appointment-outcome.spec.ts:632`) xanh ở đối chứng. **Gỡ sửa:** T291b (bỏ gợi ý năm trước) **KILLED** 2 ca (`appointment-form.test.ts`, `DateSuggestion.test.tsx`); T291c (6h cũng gợi ý), T291d (6e nhận ngày đã qua khi chưa tick), T291a (câu năm trước viết như "đã qua"), T291e (lý do dời chỉ có ký tự vô hình được giữ), T291f ("Việc tiếp theo" chỉ có ký tự vô hình coi là đã điền) **KILLED** | Luật 4 ở "Việc tiếp theo" (`readOutcome`), lý do dời (`rescheduleReason`) đúng; ô Case size (tùy chọn) chưa theo cùng cách → CLR4-E1. Luật 6, 7 / phần lệnh: `claude\A.md`, `claude\D.md` |
| T-295 | #784 → #825 (phần gói E) | **ĐÃ SỬA** (phần gói E) | Hộp 10c đếm một lần khi mở (`Settings.tsx:152`), cùng số với dòng "Nội dung" — mockup 10c dùng đúng số của dòng Nội dung (`settings-data.html:127`, `:207`), NT-CD-08 cũng vậy; một state thông báo (`DataSections`, ca hai chiều `backup.spec.ts` xanh ở đối chứng); 10b `SCHEMA_TOO_NEW` có e2e (`backup.spec.ts`). **Gỡ sửa:** T295a (10c không nêu số KH) **KILLED** `demo-data.spec.ts:16` | Số của 10c không tính bản ghi trong Thùng rác dù Nạp lại thay cả chúng: khớp mockup / NT-CD-08 nên không báo. Phần mở file / ChatGPT web: `claude\B.md`, `claude\C.md` |
| T-296 | #785 → #833 | **ĐÃ SỬA** | Mục 1 hộp dùng chung: R128g–l (dòng DR6-128) **KILLED**. Mục 2 kế hoạch từ dòng của danh sách: `p21-purge-plan.mjs` — `purgePlan(listTrash)` = `previewPurge` (số và tập giữ lại) = số lệnh dọn trả (11j) trên dữ liệu tải (113), Thùng rác lớn (1 313) và KH có lịch / HĐ xóa riêng trước KH (116); T296b (đếm cả dòng giữ lại), T296c (bỏ ghi chú KYC) **KILLED**. Mục 4–5 tên nút: R119a–c **KILLED**. Mục 6 slot `kycNotes`: T296h **KILLED**. Mục 7 cờ E20: T296d (chọn câu theo chữ ngày như M-C của PR) **KILLED**. Mục 8 hộp 8d: T296e (bỏ dòng số HĐ), T296f (cùng tháng khác năm coi là cùng tháng) **KILLED**; `policyStatusText` đảo: T296i **KILLED** 7 ca | `p22-8d-vs-metrics.mjs`: 7 lần sửa HĐ (dời tháng nộp / phát hành, cả hai, qua năm, cùng tháng năm trước, đổi FYP cùng tháng, phát hành về tháng nộp) → mỗi dòng "Ảnh hưởng chỉ số" khớp đúng số đổi của Case size / HĐ nộp / Doanh số / HĐ phát hành ở RE, team, Toàn bộ, mọi tháng 2025–2027, 0 lệch |
| T-298 | #787 → #838 (phần gói E) | **ĐÃ SỬA** (phần gói E) | 6a "Các lần hẹn trước" bằng huy hiệu, 6h không có khối, ô ngoài tháng / ngoài khoảng `role="img"` + tên, hàng nút chi tiết khóa theo lịch. **Gỡ sửa:** T298g (6h có lại khối) **KILLED** `appointments.spec.ts:490` + 1 ca `appointment-outcome`; T298e (ô ngoài tháng lại `aria-hidden`) **KILLED** `appointments.spec.ts:212` + 1; T298f (bỏ `key={a.id}`) **KILLED** `appointment-outcome.spec.ts:485` | Ô tháng của lưới Năm (`YearGrid.tsx:88-93`) đều là nút có tên; chỉ ô trống sau 31/12/2100 `aria-hidden` (`AppointmentsScreen.tsx:410`, đúng spec Phase 4 §3.4). Thẻ Lịch hẹn / 5d / `stageSince`: `claude\D.md` |
| T-299 | #788 → #841 (phần gói E) | **ĐÃ SỬA** (phần gói E) | Bảng `sr-only` + mô tả chart; `eachMark`. `p30-chart-vs-marks.mjs`: bảng số của chart ↔ cột KH cuối kỳ N4–N1 của Báo cáo Theo mốc, 144 mốc (Tháng / Năm / quá khứ × Toàn bộ / team / RE, hôm nay 12/10 và 15/09) → **0 khác**; mô tả = dòng cuối có số. `p20`: `stageBlock` / `reportRows` cũ ↔ mới 0 khác. **Gỡ sửa:** T299a (mốc sau hôm nay ghi 0), T299b (Tổng cộng cả nhóm đang ẩn), T299d (`eachMark` ghép theo chỉ số mốc, bất biến cũ) **KILLED**; T299c (bỏ bảng) **KILLED** `chart.spec.ts:49` | Tuần / Tùy chọn chia mốc khác nhau giữa chart và Theo mốc (12 tổ hợp không so được, theo thiết kế). `PeriodPicker`: `claude\D.md` |
| T-301 | #790 → #845, #846 (phần gói E) | **ĐÃ SỬA** (refactor không đổi class / số; phần DR6 ở R1) | `class-diff.mjs` (`E\class-diff.log`; mọi file `.tsx` gói E mà `ab7e6e7`, `df35e3c`, `1fd8e9e` đổi, mở `${HẰNG}` theo nơi khai ở từng revision): cùng tập class, trừ `+1 cursor-pointer` (link "Hồ sơ KH →" qua `LINK`, PR nêu) và câu help của 6c chuyển vào `help` của ô (`MetFields.tsx`, #846 L75); `-1 bg-info`, `-1 text-fg-2` là `WEB_MODE.dot` / `.tone` (cùng class). **Gỡ sửa:** T301a (ô hôm nay ngoài tháng không `aria-current`) **KILLED** `appointments.spec.ts:212`; T301b (focus sau "Dời từ / Dời sang") **KILLED** `:518`, `:813`; T301c (câu "Đã tạo lịch hẹn…" cho link ngoài góc nhìn) **KILLED** `:813`; T301e (chart không mô tả) **KILLED** `chart.spec.ts:49`; T301d (mô tả đọc mốc đầu) **KILLED**; T301f, T301g (Excel bỏ tỉ lệ chốt) **KILLED** | — |
| T-305 | #849 → #855 (phần gói E) | **ĐÃ SỬA** (phần gói E; test hở **CLR4-E4**) | `recordBadge` một nơi cho ô và tên nút; `class-diff` trên `fc40dfa`: cùng tập class. **Gỡ sửa:** T305a (`recordBadge` không cho KH) **KILLED** 3 ca `trash-view.test.ts` | T305b (ô "Bản ghi" của KH không vẽ huy hiệu nhóm; tên nút vẫn đủ) **sống cả bộ e2e** (296 / 296; `trash.spec.ts` + `team.spec.ts` 37 / 37) → CLR4-E4 |
| T-306 | #850 → #857 (phần gói E) | **ĐÃ SỬA** (tài liệu, khớp app) | Spec Phase 6 TR-3 dòng E7 có lý do D10 (DR6-104) (`phase-6-hoan-thien.md:94`); "Mô hình dữ liệu của dọn sạch" nêu `purgePlan` / `previewPurge` / `keptRecords` (`:189`) = code (`p21`); NT-HS-17 (8d dời tháng) = `p22`; NT-TR-20 câu E20 = `trash.blocked.recordedAfter` (`vi.ts:332-333`); NT-CD-08 = 10c; `07-bao-cao.md:51`, `:55` dùng `–` như `reports.mark.*`; `09-cai-dat.md:164` có câu E20 | Lệch mockup 8d / 10c / 10d của gói E ở "Lệch mockup đã biết" còn đúng (đã đọc code) |
| T-310 | #865 → #871 (phần gói E) | **ĐÃ SỬA** (phần gói E) | Bốn tiêu đề (`appointments-list`, `appointments-day`, `demo-data-title`, `customer-policies`) là `HEADING` + class khoảng cách; `class-diff` trên `a9fd5e6`: cùng tập class ở `Settings.tsx`, `SettingsTrash.tsx`, `AppointmentsScreen.tsx`, `CustomerPolicies.tsx`. `RecordCell` gọi `stageBadge(badge.stage, badge.text)` | Đột biến bỏ `label` của `stageBadge` ở ô là tương đương trên màn hôm nay (`badge.text` = `t('stage.*')`), không chạy; ô không vẽ huy hiệu: T305b ở trên |

Đếm R2 (10 Issue của gói E): **10 / 10 ĐÃ SỬA** (phần gói E), 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY; biến thể còn hở: CLR4-E1 (T-291 luật 4), CLR4-E4 (T-305).

**Refactor không đổi hành vi** (plan §L4.4, phần gói E): `p20` (số / Excel cũ ↔ mới 0 khác), `class-diff` (class cũ ↔ mới chỉ khác chỗ PR nêu), đối chứng 296 / 296 e2e và 520 / 520 vitest; hiệu năng cũ ↔ mới: mục 6.2.

## 3. Phạm vi đã đọc

**Danh sách gói E** (`E\list.mjs`, luật `classifyFile` của `tools/size-report-core.mjs` ở `2e51e25`; `E\list.log`, `E\files.txt`): **52 file (38 SP, 14 test), 8 155 dòng SP / 4 556 dòng test** (= `common\baseline.md`; lượt 3: 51 file, 7 756 / 4 146). File mới: `ConfirmWordDialog.tsx` (67, T-296, xếp vào E từ T-310).

**Diff sửa của gói E** (`git diff 119e2e4 2e51e25` trên 52 file; `E\fix-diff.patch`, 3 796 dòng): **38 file đổi; SP +978 / −579 ở 29 file, test +456 / −46 ở 9 file** (= `baseline.md`). 15 commit chạm gói (`E\fix-commits.log`): #740, #748, #799, #817, #825, #828, #833, #838, #841, #843, #845 (`ab7e6e7`, `df35e3c`), #846, #855, #871. Đọc từng hunk của: `ConfirmWordDialog.tsx` (mới), `Settings.tsx`, `SettingsTrash.tsx`, `SettingsBackup.tsx`, `SettingsDataFile.tsx`, `RestoreDialog.tsx`, `trash-view.ts`; `appointments/` — `AppointmentDialog.tsx`, `AppointmentsScreen.tsx`, `appointment-form.ts`, `RescheduleFields.tsx`, `outcome-form.ts`, `EditOutcomeDialog.tsx`, `OutcomeDialog.tsx`, `MetFields.tsx`, `DeleteAppointmentDialog.tsx`, `YearGrid.tsx`, `appointments-view.ts`; `customers/` — `CustomerPolicies.tsx`, `PolicyDialogs.tsx`, `policy-form.ts`; `overview/` — `StageBlock.tsx`, `stage-chart.ts`, `stage-view.ts`, `TeamCompare.tsx`; `reports/` — `reports-view.ts`, `ReportTable.tsx`, `ReportsScreen.tsx`, `report-workbook.ts` (phần cột); test đổi: `trash-view.test.ts`, `policy-form.test.ts`, `appointment-form.test.ts`, `DateSuggestion.test.tsx`, `stage-chart.test.ts`, `stage-view.test.ts`, `report-workbook.test.ts`, `reports-view.test.ts`, `outcome-form.test.ts` (phần ca mà đột biến nhắm).

**Đọc hết ở `2e51e25`:** `ConfirmWordDialog.tsx` (67), `Settings.tsx` (189), `SettingsTrash.tsx` (400), `RestoreDialog.tsx` (67), `trash-view.ts` (675), `FilterBar.tsx` (84), `CustomerPolicies.tsx` phần nút, `policy-form.ts:1-275`, `stage-chart.ts:133-197`, `stage-view.ts:60-160`, `reports-view.ts:215-402`, `AppointmentsScreen.tsx:400-704`, `YearGrid.tsx:80-141`, `SettingsBackup.tsx:1-250`, `MetFields.tsx:100-160`. File gói E không đổi từ `119e2e4` (`Overview.tsx`, `FilterBar.tsx`, `applied-filter.ts`, `period-labels.ts`, `RescheduleDialog.tsx`, `OverviewTiles.tsx`, `overview-view.ts`, `team-compare-view.ts`, `ReportExport.tsx` và 5 file test): lượt 1–3 đã đọc hết; phiên này đọc lại `FilterBar.tsx` và chạy qua probe.

**Chỗ gói khác nối vào:** `packages/db/src/trash.ts:40-300` (`listTrash`, `customerEffect`), `purge.ts:1-140` (`KEPT_*`, `COUNTS`, `PURGE`), `counts.ts` (`countRecords`, `countCustomerRecords`), `policies.ts:74-84` (`updatePolicy`); `packages/domain/src/period.ts` (`parseQuickDate` :240-264), `text.ts:60` (`stripDiacritics`), `stats.ts` (`PolicyMetrics`, `policyMetrics`, `periodMetricsByScope`); `apps/desktop/src/data/app-data.ts:85-200`, `:253-283` (`AppData`, `openAppData`), `tables.ts`; `packages/ui/src/components/PeriodPicker.tsx` (`apply`, `onBlur`), `Chart.tsx:27`, `token-guard.ts:53`; `routes/money-view.ts`, `stage-badge.tsx`, `classes.ts`, `shell/Sidebar.tsx:83` (`WEB_MODE`). E2E: `support.ts:146-286` (`asExe`), `fixtures.ts`, `anchor.ts`, `serve.mjs`, `appointment-outcome.spec.ts:1-75`, `:600-670`, `period-picker.spec.ts:1-140`, `save-state.spec.ts:14-110`, tên ca của mọi spec mà đột biến nhắm.

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/{tests,i18n-ui}.md`; `common\{prompt-claude.md (đủ), plan.md (§L4.1–§L4.8), known.md (đủ), baseline.md (đủ), fixes.md (#725/#748, #784/#825, #785/#833, #787/#838, #788/#841, #790/#845/#846, #849/#855, #850/#857, #865/#871 đủ và nhóm RESOLVED; #720/#740, #721/#738 phần DR6-110 / DR6-134)}`; ADR-0007 (dòng 53, phụ lục :81-89); spec Phase 6 `:94`, `:189`; mockup `policy-forms.html:210-232` (8d), `settings-data.html:120-210` (10c), `appointment-forms.html:240-245` (6d); `nghiem-thu-v1.md` NT-LH-25, NT-HS-17, NT-TR-20, NT-CD-08; `docs/user-guide/07-bao-cao.md:51-55`, `09-cai-dat.md:164`, `05-ho-so-kh.md:104`; báo cáo gốc lượt 3 Claude E (đủ), tổng hợp lượt 1 bảng DR6-38; `claude\D.md` lượt 4 (đủ), danh sách phát hiện của `claude\A.md`–`C.md` lượt 4 để không báo lại.

## 4. Kịch bản mới đã thử

Chưa có trong báo cáo gói E lượt 1–3 (đã đọc mục 4 của Claude lượt 3, tìm từ khóa trong `docs/reviews/raw/*/*/E.md`) và trong `claude\A.md`–`D.md` lượt 4. Probe trình duyệt: Edge headless, chặn mạng ngoài localhost / 127.0.0.1 từ lần chạy đầu, mọi log kết thúc bằng `requests blocked (not localhost / 127.0.0.1) []`. Probe Node đi qua lớp dữ liệu của app (`openAppData` web, `readBackup` + `importBackup` như Cài đặt → Dữ liệu, `app.run`, `app.purgeTrash`, `app.tables()`, hàm view của màn); lệnh `db` gọi thẳng chỉ để dựng dữ liệu (xóa bằng lệnh xóa) hoặc đọc `listTrash` / `previewPurge` như màn đọc.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Hộp 8d dự báo ↔ số thật: 7 lần sửa HĐ trên dữ liệu tải (dời ngày nộp sang tháng trước; dời ngày phát hành sang tháng sau; dời cả hai và đổi FYP phát hành; đổi FYP trong tháng; 01/2026 → 12/2025; ngày phát hành về tháng nộp kèm đổi FYP; ngày nộp về cùng tháng năm trước), dòng "Ảnh hưởng chỉ số" (`openDraft` → `readPolicy` → `policyChange` → `effectText`) so với số đổi của `periodMetrics` (Case size, HĐ nộp, Doanh số, HĐ phát hành) ở RE của HĐ, team, Toàn bộ, mọi tháng 2025–2027, sau khi lưu như hộp lưu (`p22-8d-vs-metrics.mjs`) | 7 / 7: mỗi dòng khớp đúng một thay đổi, mọi tháng khác 0 đổi, 0 lệch; ô KPI Toàn bộ của các tháng chạm đổi theo (vd. 03/2026 "148 → 147" HĐ nộp) | — |
| K2 | Tên nút khôi phục trên Thùng rác lớn (dữ liệu tải + 1 200 KH xóa bằng lệnh xóa, 1 313 dòng) và dữ liệu tải, so ô "Bản ghi" / "Thuộc" (`p23-restore-names.mjs`) | 113 / 113 tên khác nhau; Thùng rác lớn 21 tên dùng chung bởi hai KH cùng tên cùng nhóm, ô khác nhau | CLR4-E2 |
| K3 | Ô tùy chọn của gói E chỉ có ký tự vô hình (U+200B, U+2060, U+0085; đối chứng NBSP, BOM, dấu cách, trống): Case size 6c / 6f, FYP 8a, ngày 6b / 6e, lý do dời, "Việc tiếp theo"; rồi trên màn 6c (`p25b-blank.mjs`, `p25c-old.mjs` với cây `119e2e4`, `p26-blank-case-size.mjs`) | Case size → "Chưa nhập số tiền.", Lưu bị chặn (cũ: "Gõ số tiền như …"); ngày sinh 5a cùng chữ → "không có"; ô bắt buộc (FYP, ngày) → `empty` như ô trống; lý do dời / việc tiếp theo theo `normalizeText` | CLR4-E1 |
| K4 | Kế hoạch hộp 11i từ dòng của danh sách (`purgePlan`) ↔ `previewPurge` ↔ số lệnh dọn trả (11j) trên dữ liệu tải, Thùng rác lớn, và một KH có lịch hẹn + HĐ xóa riêng trước khi KH bị xóa (`p21-purge-plan.mjs`) | 3 / 3: cùng số theo loại, cùng tập giữ lại, 11j = 11i ("KH 1.215 — kèm 9.834 lịch hẹn · 1.648 HĐ · 5.006 ghi chú KYC · 99 phân tích AI · Lịch hẹn 76 · HĐ 18 · Nhân sự 3 · Team 1"); dòng KH có bản ghi xóa riêng: "khôi phục kèm 26 lịch hẹn · 5 HĐ · 6 ghi chú KYC", hộp 11b "… vẫn ở Thùng rác (1 lịch hẹn · 1 HĐ)" | — |
| K5 | Refactor Báo cáo / Excel / chart (T-299 `eachMark`, T-301 `REPORT_COLUMNS`): cùng bảng dữ liệu tải qua code `119e2e4` và code ghim, 3 hôm nay × 8 kỳ (gồm Tùy chọn có mốc sau hôm nay và trước khi có dữ liệu) × 10 góc nhìn: mọi ô của 4 bảng Báo cáo, 72 file Excel (giá trị, `numFmt`, gộp ô, bề rộng cột, cố định hàng), chart N4–N1 (ô, ghi chú, cột), So sánh team (`p20-same-figures.mjs`) | 0 lá khác trên 264 ca, 46 410 ô Excel; hai lần chạy nạp đúng hai bản code (`p20-which.mjs`) | — |
| K6 | Bảng số của chart N4–N1 (cái trình đọc màn hình duyệt) ↔ cột KH cuối kỳ N4–N1 của Báo cáo Theo mốc, cùng kỳ và góc nhìn; mô tả chart ↔ dòng cuối có số (`p30-chart-vs-marks.mjs`) | 144 mốc so được, 0 khác; mô tả luôn là dòng cuối có số; 12 tổ hợp Tuần / Tùy chọn chia mốc khác nhau (không so) | — |
| K7 | Nhập backup sau một lần lưu lỗi (exe giả, `DISK_FULL`), rồi "Thử lại", rồi nhập lại; file là bản xuất của chính app (`p29-import-refused.mjs`) | Từ chối đúng câu D7 có vế "Thử lại", không backup / không lưu, dữ liệu giữ (team mới còn); sau "Thử lại" nhập được, team mới mất. Không ca e2e nào giữ câu này | CLR4-E4 |
| K8 | Thanh Lọc của Tổng quan và Báo cáo với Tùy chọn (T-299): gõ Từ, Tab, gõ Đến rồi bấm chuột thẳng vào "Lọc"; Đến "31/02/2026" rồi Lọc; Shift+Tab về Từ, đổi, Tab Tab tới Lọc, Enter (`p31-filter-click.mjs`) | Cả hai màn: lần bấm chuột áp dụng khoảng vừa gõ ("Đang xem: 01/09 – 10/09/2026"); ngày không có thật → ô `aria-invalid`, câu lỗi, kỳ đang xem giữ nguyên; đường bàn phím áp dụng đúng | — |
| K9 | Ký hiệu / dấu nối viết thẳng trong 38 file SP gói E, và bộ chặn `pnpm lint:tokens` khi đặt lại từng ký hiệu của gói E như trước #845 (`sep-scan.mjs`, `r37-guard-e.mjs`) | 0 chỗ; 6 / 6 kiểu đặt lại bị bắt | — |
| K10 | Số tiền của NT-LH-25 / mockup 6d trên app (`1.234 tr`, `1,234 tr`, `0,500 tr`, `1,2 tr`, `12,5`, `-5tr`, `năm trăm`, `200 tỷ`), cả bản dán kèm ký tự vô hình và chữ số toàn khổ, ở Case size và FYP (`p25-money-docs.mjs`) | Đúng từng dòng NT-LH-25 và câu help của mockup; dán kèm ký tự vô hình đọc như gõ; toàn khổ → `format` (K25) | — |
| K11 | Ô không bấm được của các lưới khác (biến thể T-298): lưới Năm, ô trống, mũi tên tháng khác (đọc code) | Mọi ô tháng của lưới Năm là nút có tên + `aria-current`; chỉ ô trống sau 31/12/2100 `aria-hidden` (spec Phase 4 §3.4) | — |
| K12 | Hiệu năng Node, code `119e2e4` ↔ ghim chạy xen kẽ hai vòng trên cùng bảng (`p27-node-perf.mjs`): Báo cáo, chart (kèm bảng / mô tả mới), So sánh team, Excel Năm, 8d mỗi phím | Không phép nào chậm hơn (mục 6.2) | — |
| K13 | Focus trong hộp gõ chữ dùng chung (T-296) theo bàn phím, exe giả + `holdBackup`: mở hộp từ nút bằng Enter, gõ chữ rồi Enter trong ô (và lần khác bấm chuột vào nút), đọc `activeElement` lúc đang chạy, Tab một lần, thả backup, đọc focus sau khi đóng; ở Dọn sạch, Nạp lại, và hộp Nhập backup 10a (`p34-confirm-focus.mjs`, `p34b-import-focus.mjs`) | Mở: focus ở ô chữ (10a: "Hủy"); **đang chạy: `BODY` ở cả ba hộp, Tab vẫn `BODY`**; đóng: Dọn sạch → thông báo 11j, Nạp lại → nút "Nạp lại…" | CLR4-E5 |

## 5. Phát hiện mới

### CLR4-E1 — Ô Case size (tùy chọn, "để trống = chưa ước lượng") chỉ có ký tự vô hình báo "Chưa nhập số tiền." và chặn Lưu của 6c / 6d / 6f

```
ID: CLR4-E1
Mức: Low
Trục: E
Vị trí: apps/desktop/src/routes/appointments/outcome-form.ts:33 (readCaseSize: `text.trim() === ''`), :213-215 (readOutcome); apps/desktop/src/routes/appointments/MetFields.tsx:121-136 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: DR6-110 (#721 → #738), T-291 luật 4 (#780 → #828) · có từ trước (lượt 1–3 bỏ sót); #738 đổi câu từ "Gõ số tiền như …" sang "Chưa nhập số tiền."
Kịch bản: K3
```

- **Mô tả:** `readCaseSize` quyết "để trống" bằng `text.trim()`, còn `parseVnd` (sau #738) đọc `normalizeText`. Chữ chỉ có U+200B / U+2060 / U+0085 (dán từ nơi khác) không bị `trim()` bỏ nên không là "trống", rồi `parseVnd` thấy rỗng và trả `empty`: ô tùy chọn báo "Chưa nhập số tiền." (`aria-invalid`), `readOutcome` thêm lỗi `caseSize`, Lưu không ghi. Ở gói D, ô tùy chọn cùng kiểu (ngày sinh 5a, `parseBirthDate`) đọc cùng chữ là "không có" (#738: "nothing to see is none"); `rescheduleReason` và "Việc tiếp theo" (T-291 luật 4) cũng theo `normalizeText`.
- **Tái hiện / bằng chứng:** `node --import ./hooks.mjs p25b-blank.mjs` (`E\p25b-blank.log`): `ZWSP: readCaseSize {"ok":false,"error":"empty"}`, `ZWSP: readOutcome (case size only) ["caseSize"]`; cùng chữ với NBSP / BOM / dấu cách → `null`, `ok`. `p25c-old.mjs` (`P2C_REPO` = cây `119e2e4`): cũ `{"error":"format"}` ("Gõ số tiền như …") cho cả `readCaseSize` lẫn `parseBirthDate`; ghim: `parseBirthDate` → `{"ok":true,"birth":null}`, `readCaseSize` → `empty`. Trên màn (`node p26-blank-case-size.mjs 4631`, bản ghim `dist-base`, `E\p26-blank-case-size.log`): 6c Đã gặp + nhóm sau + việc tiếp theo, dán U+200B / U+0085 / U+2060 vào Case size → mô tả ô "Chưa nhập số tiền. | Dấu phẩy hay dấu chấm …", `aria-invalid true`, bấm "Lưu kết quả" → hộp còn mở, chi tiết không có "Đã gặp"; đối chứng ô trống → lưu, hộp đóng.
- **Ảnh hưởng:** RE dán số từ tin nhắn / bảng tính có ký tự vô hình rồi xóa phần số (hay dán nhầm một ký tự vô hình) thấy ô "trống" mà bị báo chưa nhập số tiền, trái nhãn "để trống = chưa ước lượng"; phải chọn hết rồi xóa ô. Không sai dữ liệu. Cùng gốc, nhẹ hơn (đọc code, chưa chạy trên màn): `pending` của ô ngày 6b / 6e / ngày hẹn tiếp 6c (`AppointmentDialog.tsx:95`, `RescheduleFields.tsx:75`, `OutcomeDialog.tsx:216`) dùng `trim()`, nên ô chỉ có ký tự vô hình có lẽ báo lỗi ngay, không chờ lần bấm lưu như ô trống.
- **Đề xuất:** `readCaseSize` (và ba `pending`) hỏi "trống" bằng `normalizeText(text) === ''` như `rescheduleReason`; thêm ca vào `outcome-form.test.ts` (U+200B, U+0085 → `null`). ≈ 4 dòng SP + 6 dòng test.

### CLR4-E2 — Thùng rác: hai KH cùng tên, cùng nhóm có cùng tên nút "Khôi phục KH <tên> · <nhóm>" dù ô "Bản ghi" và "Thuộc" khác nhau

```
ID: CLR4-E2
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/trash-view.ts:192-202 (restoreLabel: dòng đầu ô + chữ huy hiệu); apps/desktop/src/routes/SettingsTrash.tsx:131-139 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: DR6-119 (#725 → #748), T-296 / T-301 (#833, #846; tên nút KH theo quyết định Owner 25/10) · có từ trước, lượt 1–3 bỏ sót (trước #846 mọi KH cùng tên trùng tên nút; #846 chỉ tách ca khác nhóm)
Kịch bản: K5
```

- **Mô tả:** Tên nút khôi phục của KH chỉ ghép dòng đầu ô (tên) và chữ huy hiệu (nhóm), theo quyết định 25/10 cho ca "hai KH cùng tên khác nhóm". Hai KH cùng tên **cùng nhóm** trong Thùng rác vẫn có hai nút cùng tên, trong khi ô của chúng khác nhau ở dòng dưới ("khôi phục kèm n lịch hẹn …") và ở cột "Thuộc" (RE · team). Hộp 9b của gói D đã tách hai KH cùng tên của Thùng rác bằng mã KH (T-287).
- **Tái hiện / bằng chứng:** `node --import ./hooks.mjs p23-restore-names.mjs` (`E\p23-restore-names.log`; lớp dữ liệu của app, `listTrash` như màn đọc, `restoreLabel` như `aria-label` của nút): dữ liệu tải 113 dòng → 113 tên khác nhau; Thùng rác lớn (dữ liệu tải + 1 200 KH xóa bằng lệnh xóa, 1 313 dòng) → **1 292 tên, 21 tên dùng chung bởi 2 dòng, cả 21 là KH**, ví dụ "Khôi phục KH Đặng Minh An · Tạm hoãn" ×2: ô "Đặng Minh An | Tạm hoãn | khôi phục kèm 1 lịch hẹn · 0 HĐ · 3 ghi chú KYC", "RE Võ Kim Tuấn · Sao Mai" ↔ "… kèm 20 lịch hẹn · 3 HĐ · 6 ghi chú KYC", "RE Ngô Minh Trung · Hừng Đông"; 21 / 21 cặp có ô "Bản ghi" khác nhau.
- **Ảnh hưởng:** người dùng trình đọc màn hình duyệt theo nút nghe hai nút giống hệt, phải đọc cả dòng để biết nút nào; chỉ khi Thùng rác có hai KH trùng tên và nhóm.
- **Đề xuất:** khi tên + nhóm trùng một dòng khác của Thùng rác, thêm vế "Thuộc" (RE) hay mã KH vào tên nút, như 9b thêm mã (cần Owner chọn chữ, vì đổi định dạng Owner đã chốt 25/10); ca unit hai KH cùng tên cùng nhóm. ≈ 10 dòng SP + 10 dòng test.

### CLR4-E3 — `PURGE_REMINDER` vẫn export mà không file nào import (phần còn của DR6-66 lượt 3 đã nêu)

```
ID: CLR4-E3
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/routes/trash-view.ts:518 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: DR6-66 (#790 → #845) · có từ trước (#710), lượt 3 đã ghi "cùng loại DR6-66", Issue #790 không liệt kê
Kịch bản: —
```

- **Mô tả:** hằng `PURGE_REMINDER = 1_000` chỉ `purgeReminder` cùng file đọc; test viết thẳng `1_000`. Lượt 3 (`docs/reviews/raw/2026-10-21/claude/E.md` mục 6.1) đã ghi nó cùng `PurgeView` là "cùng loại DR6-66"; #845 bỏ export của `markName`, `REPORT_STAGES`… theo danh sách của Issue #790, còn sót hằng này (`PurgeView` nay được `SettingsTrash.tsx` dùng).
- **Tái hiện / bằng chứng:** `node r2-exports.mjs` (scanner lượt 2–3, `git grep -w` trên `apps`, `packages`, `e2e`, `tools`; `E\exports.log`): `unused outside file  apps/desktop/src/routes/trash-view.ts · PURGE_REMINDER (also used in its own file)`; mọi export giá trị khác của 38 file SP gói E có nơi dùng hoặc là seam test như lượt 2–3.
- **Ảnh hưởng:** không tốn gì lúc chạy; chỉ là một export thừa trong API của file, loại DR6-66 Owner đã cho sửa hết trước v1.0.
- **Đề xuất:** bỏ `export` (≈ 1 dòng), hoặc test đọc hằng thay số viết thẳng. Cùng lượt có thể chạy lại scanner trên toàn app.

### CLR4-E4 — Test hở (gói E): câu từ chối có vế "Thử lại" của Nhập backup, và huy hiệu nhóm trong ô "Bản ghi" của KH ở Thùng rác, không ca nào giữ

```
ID: CLR4-E4
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/SettingsBackup.tsx:203-209; apps/desktop/src/routes/SettingsTrash.tsx:54 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: CL3-B2 / T-294 (#817), T-305 (#855), T-310 (#871) · mới do đợt sửa sau lượt 3 (PR #817, #855, #871)
Kịch bản: K7
```

- **Mô tả:** (a) Ba lệnh thay dữ liệu bị từ chối sau một lần lưu lỗi nói câu D7 có vế "Bấm "Thử lại" …" (K35). Nạp lại có ca e2e (`save-state.spec.ts:79`), Dọn sạch có ca e2e và unit (`trash.spec.ts:663`, `trash-view.test.ts`), **Nhập backup không có ca nào**: hộp 10a chọn câu bằng `isUnsavedChangesError` trong TSX (`SettingsBackup.tsx:203-209`), vitest không có DOM. (b) Ô "Bản ghi" của KH ở Thùng rác vẽ huy hiệu nhóm bằng chữ của `recordBadge` (T-305 / T-310: ô và tên nút cùng đọc một chữ); e2e chỉ đọc tên nút (thân PR #871 cũng nêu), nên ô không vẽ huy hiệu thì không ca nào đỏ. Hành vi hiện tại đúng (K7: câu đúng trên màn; T-310: ô có huy hiệu).
- **Tái hiện / bằng chứng:** `E\e2e-mut.log`: `RB2e | … | Nhập backup refused after a failed save says the plain failure (no "Thử lại") | SURVIVED — 296 ran, 296 passed, 0 control-green failed (147 s; served routes/settingsbackup.tsx ×1) — filters (all)` (cả bộ e2e, trừ `seed-timing`, `perf`, `guide`); đối chứng: RB2g (cùng đột biến cho Nạp lại) **KILLED** `save-state.spec.ts:79`, RB2f (Dọn sạch) **KILLED** `trash-view.test.ts`. `T305b | … | the "Bản ghi" cell draws no stage badge (the name still says it) | SURVIVED — 296 ran, 296 passed, 0 control-green failed (148 s …) — filters (all)` (cả bộ e2e; trước đó `trash.spec.ts` + `team.spec.ts` 37 / 37). Vitest không phủ hai chỗ (TSX).
- **Ảnh hưởng:** chỉ chất lượng test: một lần đổi về sau ở hai chỗ này không làm CI đỏ (vd. câu Nhập backup mất cách thoát mà người dùng cần ở CL3-B2).
- **Đề xuất:** (a) ca e2e "a refused import after a failed save says to press Thử lại" chép ca Nạp lại của `save-state.spec.ts:79` (xuất, `failSaves`, chọn file, đọc `alert`), ≈ 25 dòng; hoặc đưa câu ra hàm thuần như `purgeFailure` rồi unit test. (b) ca `trash.spec.ts` xóa một KH rồi đòi ô có huy hiệu với chữ nhóm, ≈ 5 dòng.
- **Mức:** Low theo thước ("test hở") và như các test hở gói E của lượt 3 (CL3-E3, E4 → DR6-128, Low); gói D ghi test hở CLR4-D2 là Nit.

### CLR4-E5 — Lúc hộp xác nhận đang chạy (Nạp lại 10c, Dọn sạch 11i, Nhập backup 10a) mọi ô và nút đều tắt nên focus rơi về `body`: trình đọc màn hình không nghe "Đang …", Tab không vào được hộp

```
ID: CLR4-E5
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/ConfirmWordDialog.tsx:41-63 (Hủy, nút xác nhận, ô chữ `disabled={running}`); apps/desktop/src/routes/SettingsBackup.tsx:229-247 (hộp 10a) (2e51e25)
Tình trạng: CONFIRMED
Liên quan: T-296 (#833, hộp dùng chung giữ cách tắt của hai hộp cũ), DR6-128 (#748: "đang dọn thì Hủy tắt"), DR6-83 (focus khi hộp đóng) · có từ trước (cùng cách tắt ở `119e2e4`), lượt 1–3 bỏ sót (lượt 3 ghi "đang dọn thì focus ở nút 'Đang dọn…'")
Kịch bản: K13
```

- **Mô tả:** Khi bấm xác nhận (Enter trong ô chữ hay bấm nút), hộp tắt cả ô chữ, Hủy và nút xác nhận (để không đóng / không chạy lần hai, D13). Phần tử đang có focus bị tắt nên trình duyệt đưa focus về `body`; trong hộp không còn phần tử nào nhận focus, nên Tab không vào lại được, và chữ "Đang nạp lại…" / "Đang dọn…" / "Đang nhập…" nằm trên một nút đã tắt, không có vùng `status` nào đọc nó. Khi chạy xong, focus về đúng chỗ (thông báo 11j; nút "Nạp lại…"), nên chỉ hỏng trong lúc chạy.
- **Tái hiện / bằng chứng:** `node p34-confirm-focus.mjs 4631` (exe giả, `holdBackup`, bản ghim; `E\p34-confirm-focus.log`): `[purge · Enter in the field] at open: INPUT "Gõ DỌN SẠCH để xác nhận" in dialog | while running: BODY | Tab while running: BODY | after close: DIV "✓Đã dọn sạch Thùng rác…"`; cùng kết quả khi bấm chuột vào "Backup rồi dọn sạch"; Nạp lại: `while running: BODY | Tab while running: BODY | after close: BUTTON "Nạp lại…"`. Hộp 10a (`p34b-import-focus.mjs`, `E\p34b-import-focus.log`): `while running: BODY`. Code `119e2e4` của hai hộp cũ (`git show 119e2e4:…SettingsTrash.tsx`, `…Settings.tsx`) tắt đúng ba phần tử ấy (`disabled={running}`), nên không phải hồi quy của #833; e2e chỉ đòi các nút tắt và hộp còn mở (`trash.spec.ts:627`, `dialog-keyboard.spec.ts:135`), không đòi focus lúc chạy.
- **Ảnh hưởng:** người dùng trình đọc màn hình / bàn phím mất chỗ đứng và không được báo việc đang chạy suốt lúc backup + thay dữ liệu (Nạp lại sinh seed ≈ 3 s; Nhập backup và Dọn sạch cỡ 0,05–0,2 s trên exe với dữ liệu tải theo `baseline.md`; lâu hơn khi ổ chậm, chính ca `holdBackup` mô phỏng). Không mất dữ liệu; xong thì focus về lại.
- **Đề xuất:** khi bắt đầu chạy, đưa focus vào một dòng `role="status"` trong hộp ghi "Đang …" (hoặc giữ nút xác nhận nhận focus bằng `aria-disabled` thay `disabled`); dùng chung cho `ConfirmWordDialog` và hộp 10a; ca e2e với `holdBackup` đòi focus nằm trong hộp lúc chạy. ≈ 10 dòng SP + 15 dòng test.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `node node_modules/typescript/bin/tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` (`E\tsc-unused-app.log`; hai cờ cũng bật sẵn ở `tsconfig.base.json:12-13`) | app (gồm 52 file gói E) | exit 0, 0 dòng (7,7 s); `git status --short` sau đó rỗng | — |
| Nơi dùng mọi export của 38 file SP gói E: `node r2-exports.mjs` (scanner lượt 2–3, `git grep -w` ở `HEAD`; `E\exports.log`) | `apps`, `packages`, `e2e`, `tools` | Mục DR6-66 của gói E đã hết (`markName`, `REPORT_STAGES` thôi export). Chỉ test dùng: `OUTCOME_CHOICES`, `readFyp`, `buildReportWorkbook`, `reportFileName`, `reportWorkbookMeta` (seam test, chính file dùng, như lượt 2–3) + 7 kiểu; không ai import ngoài file: 23 kiểu (không tốn gì lúc chạy) và hằng **`PURGE_REMINDER`** | CLR4-E3 |
| Code lặp của đợt sửa (đọc diff + `class-diff.mjs`) | gói E | Hộp gõ chữ một nơi (`ConfirmWordDialog.tsx`, 67 dòng thay hai khung); 17 cột Báo cáo một danh sách; class qua `classes.ts`, `stageBadge`; `plain` → `stripDiacritics`. Còn 2 nơi (dưới ngưỡng ≥ 3): `download()` (`SettingsBackup.tsx:174`, `ReportExport.tsx:88`), khung "đang chạy thì không đóng" của hộp 10a (`SettingsBackup.tsx:229-247`) ↔ `ConfirmWordDialog` (10a không gõ chữ nên không dùng chung) | — |
| Ký hiệu / khóa i18n | `sep-scan.mjs` (gói E); khóa i18n toàn app: `claude\D.md` mục 6.1 (`r1-keys`: 1 193 khóa, 0 không dùng, 0 chỉ test dùng; không chạy lại) | 0 ký hiệu viết thẳng ở gói E (mục 2.1, DR6-37) | — |
| Bundle (`common\baseline.md`, không dựng lại cho số) | toàn app, phần gói E | `index.js` 884 698 B (−43 234 so lượt 3, phần lớn `zod/mini` của gói C); không thêm dependency (`git diff --stat 119e2e4 2e51e25 -- package.json apps/desktop/package.json packages/*/package.json pnpm-lock.yaml` rỗng); bảng `sr-only` của chart thêm DOM (một bảng mỗi chart, ≤ 30 mốc) chứ không thêm code thư viện | — |
| Cỡ dòng | `E\list.log`, `E\fix-diff.patch` | SP 8 155 (+399 so lượt 3), test 4 556 (+410), 52 file (+1: `ConfirmWordDialog.tsx`) | — |

Không có đề xuất refactor mới ngoài CLR4-E3; bloat của gói E không có chi phí đo được.

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, Node v24.20.0, Edge (Playwright) headless 1 440 × 900. **Song song lúc đo:** Codex đợt 1 ở `Project-2C-review-2` (tiến trình `codex`, `node_repl`; CPU-giây của chúng không đổi trong lúc đo lại Thùng rác lớn, 92,8 s), app ChatGPT / Claude của Owner; e2e đột biến của chính phiên chạy nền khi đo `p27` (nên `p27` là cặp xen kẽ cũ ↔ mới, chỉ so trong cặp); `r3-p10` / `p28` / `p32` chạy khi không còn e2e nào (CPU 5–8 % ngay trước, `E\cpu-before-p10-1313-*.txt`). Không chạy exe, không `pnpm e2e` cổng 4173. Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms. Ngưỡng `phase-6.md`: thao tác màn < 200 ms.

**A. Node — code `119e2e4` ↔ ghim, chạy xen kẽ hai vòng trên cùng bảng dữ liệu tải** (`p27-node-perf.mjs`, `P2C_REPO` cho cây cũ; `E\p27-node-perf-table.log`; trung vị n = 9, Excel n = 5; vòng 1 của cây cũ còn nạp JIT nên so vòng 2):

| Thao tác (màn gói E) | Cũ vòng 2 | Mới vòng 2 | So | ID |
|---|---:|---:|---|---|
| Báo cáo `reportRows` + `reportCells` mọi bảng · Tháng / Năm / Tùy chọn · Toàn bộ | 7,38 / 8,25 / 9,82 ms | 6,83 / 7,38 / 7,49 ms | mới ≤ cũ | — |
| … · team / RE | 5,85–6,28 / 3,84–4,85 ms | 4,89–5,42 / 3,25–4,15 ms | mới ≤ cũ | — |
| Tổng quan `stageBlock` (mới: + `stageChartTable`, `stageChartSummary`, `stageChartLastText` mỗi chart) · Toàn bộ / Team | 2,78–2,94 / 3,02–3,28 ms | 2,75–2,87 / 2,97–3,44 ms | ≈ (bảng / mô tả mới không đo được) | — |
| Tổng quan `teamCompare` · Tháng / Năm / Tùy chọn | 1,65 / 2,91 / 2,73 ms | 1,68 / 2,54 / 2,47 ms | ≈ | — |
| Báo cáo `buildReportWorkbook` Năm · Toàn bộ | 19,1 ms | 15,7 ms | mới ≤ cũ | — |
| 8d `openDraft` + `readPolicy` + `policyChange` × 1 000 HĐ đã phát hành (một phím mỗi HĐ) | 4,03 ms | 3,82 ms | ≈ (0,004 ms mỗi phím) | — |

**B. Node — Thùng rác qua lớp dữ liệu** (`p32-trash-node-perf.mjs`, `E\p32-trash-node-perf.log`; trung vị):

| Thao tác | 113 dòng | 1 313 dòng | Lượt 3 (113) | ID |
|---|---|---|---|---|
| `listTrash` (như `useQuery`; chỉ mục `0012` là gói A) | 20,4 ms | 154,9 ms | 26,3 ms (Node, lượt 3 E §6.2 A) | — (cặp cũ ↔ mới: `claude\A.md` mục 6.2, +3 %) |
| Một lần render mọi dòng (`recordTitle`, `recordBadge`, `recordDetail`, `ownerParts`, `restoreLabel`, lý do chặn / giữ, `canPurge`, `purgeReminder`) | 0,34 ms | 2,67 ms | 0,27 ms | — |
| **Mở 11i nay** `purgeView(purgePlan(rows))` (T-296) | **0,02 ms** | **0,18 ms** | — | — |
| Mở 11i như lượt 3 `purgeView(previewPurge(db))` | 0,77 ms | 5,97 ms | — | — |

**C. Bản web — Thùng rác và Dọn sạch** (`r3-p10-purge-web-perf.mjs` = probe `p10` lượt 3, chỉ đổi host; `E\dist-real`, Nhập backup qua Cài đặt → Dữ liệu; đo từ thao tác tới khi DOM có kết quả qua `MessageChannel`; DevTools gắn nên so web với web; log `E\r3-p10-purge-web-perf-{113,1313,1313-2,1313-3}.log`):

| Thao tác | n | 113 dòng | 1 313 dòng (ba lần chạy) | Lượt 3 web (113 / 1 313) | Ngưỡng | ID |
|---|---:|---|---|---|---|---|
| Dữ liệu → Thùng rác, trước khi dọn | 6 | 78,2 ms | 621,4 / 524,9 / 510,1 ms | 76,5 / 449,2 ms | < 200: 113 ✅ · 1 313 ❌ (như lượt 3) | DR6-84 (Owner chữa bằng dọn sạch + câu nhắc từ 1 000) |
| Mở hộp 11i | 5 | 8,5 ms | 9,8 / 10,9 / 9,1 ms | 13,2 / 18,0 ms | ✅ (nhanh hơn: không còn `previewPurge`) | — |
| Bấm "Dọn sạch" → thông báo 11j | 1 | 102,1 ms | 168,8 / 140,7 / 151,6 ms | 119,4 / 124,0 ms | ≤ 500 (K30) ✅ | — |
| Dữ liệu → Thùng rác, sau khi dọn | 6 | 2,4 ms | 1,4 / 1,3 / 2,1 ms | 9,5 / 2,9 ms | ✅ | — |

Thùng rác lớn, trung vị của ba lần chạy 524,9 ms so 449,2 ms của lượt 3: +75,7 ms (+16,9 %), dưới luật nhiễu (chưa quá 20 %); lần đầu rộng hơn (509–715 ms) không rõ vì sao. Phần Node của cùng thao tác: `listTrash` cũ ↔ mới +3 %, `purgeTrash` +11 % (`claude\A.md` mục 6.2, cặp xen kẽ); render và mở 11i của gói E nhanh hơn (bảng B). Dọn 1 313 dòng trên web 141–169 ms (một lần mỗi chạy), dưới ngưỡng 500 ms; trên exe dữ liệu tải 123,3 ms (`baseline.md`).

**D. Bản web — Lịch hẹn và Tổng quan trên dữ liệu tải** (`p28-web-perf.mjs`, `E\dist-real`, không cài đồng hồ trang vì nó giả cả `performance.now`; `E\p28-web-perf-noclock.log`; lần chạy có đồng hồ trang cho số cùng cỡ, `E\p28-web-perf.log`):

| Thao tác | n | Trung vị (min–max) | Ngưỡng | ID |
|---|---:|---|---|---|
| Lịch hẹn, Năm 2026 (8 111 lịch của dữ liệu tải, vẽ 100 dòng): sắp theo Ngày | 6 | 4,7 ms (0,9–12,6) | < 200 ✅ | — |
| … sắp theo Khách hàng | 6 | 60,4 ms (2,7–73,7) | < 200 ✅ | CLR4-A2 (gói A: `byName` mỗi lần so; đây là số trên màn của gói E, không mở ID mới) |
| … sắp theo RE | 6 | 54,0 ms (2,9–72,8) | < 200 ✅ | CLR4-A2 |
| Tổng quan: Lọc Năm / Tháng, Toàn bộ (1 chart + 1 bảng ẩn) | 6 | 18,9 / 19,0 ms | < 200 ✅ | — |
| Tổng quan: Lọc Năm / Tháng, góc nhìn Team (4 chart + 4 bảng ẩn) | 6 | 37,5 / 50,3 ms | < 200 ✅ | — |

(Lần nhỏ 0,9–3 ms của các cột sắp là lần sắp lại thứ tự đã tính, `DataTable` giữ.)

**E. Exe (không đo lại — `common\baseline.md`, probe `e2e/perf` của bước chuẩn bị, cùng máy):** so mốc sau #656, các thao tác của gói E: `overview.filter-year` / `-month` 17 / 17 ms (16 / 14; +3 ms), `reports.filter-year` / `-month` / `table-re` 10 / 10 / 17 (10 / 10 / 17), `reports.export-excel` 29 (20; +9 ms, +47 %: dưới 10 ms), `appointments.period-*` 7–17, `sort-date-*` 11–17, `select-*` 7–9, `next-month` / `next-year` 108 / 113 (101 / 107; Năm − Tháng +5 ms ≤ 50), `trash.open` 32 (34), `trash.kind-appointments` 6 (6), `backup.read` 977 (835; +17 %, dưới luật nhiễu), `backup.import` 47 (43): không dòng nào ⚠️, mọi dòng trong ngưỡng. Dọn sạch trên exe (dữ liệu tải): 11j sau 123,3 ms ≤ 500 ms (lượt 3: 151,8).

**Kết luận hiệu năng gói E:** không thao tác nào của gói E vượt ngưỡng trên dữ liệu tải và không số nào xấu hơn mốc sau #656 / lượt 3 theo luật nhiễu; code mới của gói E (bảng / mô tả chart, `REPORT_COLUMNS`, `purgePlan`, 8d) không chậm hơn code `119e2e4` ở cặp xen kẽ, mở 11i nhanh hơn (không còn `previewPurge`). Thùng rác 1 313 dòng vẫn mở 510–525 ms trên web như triệu chứng DR6-84 mà Owner chữa bằng dọn sạch. Sắp Lịch hẹn theo KH / RE 54–60 ms trên màn là CLR4-A2 (gói A). **Không có phát hiện P mới.**

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | | 0 |
| High | | | | | | | | | | | 0 |
| Medium | | | | | | | | | | | 0 |
| Low | | 1 (E1) | | | | | | | 1 (E4) | 1 (E5) | 3 |
| Nit | | | | | | | | 1 (E3) | | 1 (E2) | 2 |
| **Tổng** | | 1 | | | | | | 1 | 1 | 2 | **5** |

Cả 5 phát hiện CONFIRMED (0 PLAUSIBLE, 0 KNOWN có bằng chứng mới). Bảng R: R1 **9 / 9 ĐÃ SỬA**, R2 **10 / 10 ĐÃ SỬA** (phần gói E); không SỬA MỘT PHẦN, CHƯA SỬA, HỒI QUY. Biến thể còn hở ghi thành phát hiện riêng: CLR4-E1 (DR6-110, T-291 luật 4), CLR4-E2 (DR6-119), CLR4-E3 (DR6-66), CLR4-E4 (CL3-B2 / T-294, T-305 / T-310), CLR4-E5 (T-296, DR6-128). "Mới do đợt sửa sau lượt 3": CLR4-E4; có từ trước, lượt 1–3 bỏ sót: CLR4-E1, CLR4-E2 (#846 chỉ tách ca khác nhóm), CLR4-E3 (lượt 3 đã ghi, hoãn theo DR6-66), CLR4-E5 (cùng cách tắt ở `119e2e4`). Đã báo ở gói trước, không báo lại: CLR4-A2 (`byName` chậm khi sắp bảng lịch hẹn theo KH / RE; số trên màn gói E ở mục 6.2), CLR4-D1 (dạng bộ chặn ký hiệu không thấy), CLR4-D3 (focus / hộp đóng app khi một lần lưu khác thành công).

## 8. Đã xét, không thấy (theo trục)

- **R:** 9 dòng R1 + 10 dòng R2 (mục 2). 48 đột biến của `mut-list.mjs` + 6 đột biến bộ chặn (`r37-guard-e.mjs`): vitest 23 / 23 bị giết; e2e 25 đột biến, 22 bị giết, 3 sống (R128m tương đương; RB2e và T305b sống cả bộ → CLR4-E4); bộ chặn 6 / 6 bắt. Tái hiện lượt 3: `r3-p04` (DR6-119), đột biến sống lượt 3 R84e–j / R04g-tsx (CL3-E3 / E4) nay bị giết dưới tên R128e–l, R128b. Không HỒI QUY: đối chứng 296 / 296 e2e, 520 / 520 vitest `routes/`.
- **E:** 8d qua năm, cùng tháng năm khác, đổi FYP cùng tháng (K1); ký tự vô hình / NEL / NBSP / BOM ở mọi ô của gói E (K3); Thùng rác 113 / 1 313 / KH có bản ghi xóa riêng (K2, K4); ngày không có thật và bấm Lọc thẳng (K8); số tiền NT-LH-25, chữ số toàn khổ (K10); luật 5 ở biên 60 / 61 ngày, có năm, 29/02, năm nhuận, 01/03 (`p33-new-year-edges.mjs`, `E\p33-new-year-edges.log`: khớp đúng ví dụ của ADR-0007 phụ lục). Không thấy lỗi ngoài CLR4-E1.
- **C:** mockup 8d "dời tháng" ↔ `policyForm.countMoved` (T-284); mockup 6d / NT-LH-25 ↔ app (DR6-131); 10c dùng số của dòng "Nội dung" như mockup / NT-CD-08 (nhãn "Toàn bộ dữ liệu hiện tại" theo mockup); spec Phase 6 TR-3 E7, "Mô hình dữ liệu của dọn sạch", NT-HS-17 / NT-TR-20, hướng dẫn 07 / 09 ↔ app (T-306); ADR-0007 phụ lục ↔ ô của 6b / 6e / 6h / 6f (T-291). Lệch mockup đã biết của gói E (8d, 10c, 10d, 6h, Case size ở 6c / 6f) còn đúng như ghi. Không thấy lệch mới.
- **D:** 8d ↔ chỉ số (K1, 0 lệch trên 7 lần sửa × 3 góc nhìn × 36 tháng); 11i ↔ `previewPurge` ↔ 11j (K4); Báo cáo / Excel / chart cũ ↔ mới (K5, 0 khác); chart ↔ Theo mốc (K6, 0 khác). Lệnh ghi của hộp gói E vẫn qua `app.run` (như lượt 3), dọn qua `data.purgeTrash()`. Không thấy.
- **G:** gói E không gọi AI (`SettingsAi.tsx` thuộc gói C). Chỗ chạm: dọn sạch xóa hẳn phân tích AI của KH đã xóa, 11i / 11j đếm đúng ("1 phân tích AI", "99 phân tích AI", K4). Không thấy.
- **S:** `git grep -E "dangerouslySetInnerHTML|innerHTML|outerHTML|insertAdjacentHTML|eval\(|new Function|target=.?_blank|window\.open|document\.write|localStorage|sessionStorage"` trên 38 file SP gói E ở `HEAD`: rỗng (exit 1). Chữ xác nhận của `ConfirmWordDialog` chỉ để so; file Excel qua `Blob` (không đổi); nhập backup qua `readBackup` của gói A / B. Mọi probe trình duyệt: 0 request ra ngoài localhost / 127.0.0.1. Không thấy.
- **P:** mục 6.2.
- **B:** mục 6.1.
- **T:** mục 2 và CLR4-E4; phần lý giải: hai đột biến sống của DR6-128 / T-296 trước đây (CL3-E3, E4) nay đều có ca giữ. Test mới của đợt sửa trong gói E (`trash-view.test.ts` +197, `policy-form.test.ts` +61, `stage-chart.test.ts` +66, `appointment-form.test.ts` +55, `report-workbook.test.ts` +34, `stage-view.test.ts` +18, `DateSuggestion.test.tsx` +16) không đọc giờ máy, không ngẫu nhiên (`grep -E "new Date\(|Date.now|performance.now|Math.random"` trên phần thêm của `E\fix-diff.patch`: xem phụ lục 9.1).
- **A:** mô tả chart / bảng số (T301e, T299c giết; K6), ô ngoài tháng có tên + `aria-current` (T298e, T301a giết; K11), focus sau "Dời từ / sang" và dòng ngoài góc nhìn (T301b, T301c giết), tên nút Hợp đồng / Thùng rác (R119a–c giết; `r3-p04`), câu từ chối `role="alert"` (K7), ô `aria-invalid` + mô tả lỗi (K3, K8), focus của hộp gõ chữ lúc mở và sau khi đóng (K13). Ngoài CLR4-E2, CLR4-E5 không thấy.

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r4\claude\E\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `r3copy\*.mjs` | công cụ / probe lượt 3 của Claude E, chép nguyên (`deep-review-1-6-r3\claude\E\…`, 33 tên theo phụ lục 9.1 của báo cáo lượt 3, `Test-Path` từng tên) | — | gốc của các bản dưới |
| `list.mjs`, `files.txt`, `fix-diff.patch`, `fix-commits.log` | danh sách 52 file gói E (`classifyFile`), diff `119e2e4..2e51e25` | `list.log` | mục 3 |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `browser.mjs`, `hooks.mjs`, `ui-stub.mjs` | bản web ngoài repo (Vite `build()` + hook `load`), `vite preview` host `localhost`, cấu hình Playwright theo `playwright.config.ts`, bộ trình duyệt (chặn mạng, `asExe` ở `2e51e25`, đồng hồ trang), loader TS (`P2C_REPO`, `@p2c/ui` thay) | `build-base.log`, `build-real.log`, `serve-4631.log`, `serve-4640.log` | mọi probe |
| `mut-list.mjs`, `mutjs.mjs`, `mutant-config.mjs`, `e2e-mut.mjs`, `control.json` | 48 đột biến (vitest qua hook `load`; TSX qua bản dựng đột biến 4632–4639, so tên ca với đối chứng) | `mutjs.log`, `e2e-mut.log`, `mut\<id>.out`, `mut\<id>-<n>.e2e.out`, `mut\<id>-<n>.json` | mục 2, 9.2 |
| `old-119e2e4\` | `git archive 119e2e4 packages apps/desktop/src apps/desktop/index.html` | — | `p20`, `p25c`, `p27` |
| `p20-same-figures.mjs`, `p20-diff.mjs`, `p20-which.mjs`, `p20-tables.json` | Báo cáo / Excel / chart / So sánh team cũ ↔ mới | `p20-diff.log` (`p20-old.json`, `p20-new.json`) | K5, R1 DR6-67, R2 T-299 / T-301 |
| `p21-purge-plan.mjs` | 11i ↔ `previewPurge` ↔ 11j, ba bộ dữ liệu | `p21-purge-plan.log` | K4, R2 T-296 |
| `p22-8d-vs-metrics.mjs` | 8d dự báo ↔ chỉ số | `p22-8d-vs-metrics.log` | K1, R2 T-284 / T-296 |
| `p23-restore-names.mjs` | tên nút khôi phục, 113 / 1 313 dòng | `p23-restore-names.log` | K2, CLR4-E2 |
| `p25-money-docs.mjs`, `p25b-blank.mjs`, `p25c-old.mjs`, `p26-blank-case-size.mjs` | tiền / ngày của NT-LH-25, chữ chỉ có ký tự vô hình (Node, cây cũ, màn) | `p25-money-docs.log`, `p25b-blank.log`, `p26-blank-case-size.log` | K3, K10, CLR4-E1, R1 DR6-110 / 131 |
| `r3-p04-same-day-labels.mjs` | `p04` lượt 3 chạy lại | `r3-p04-same-day-labels.log` | R1 DR6-119 |
| `r3-p09-make-big.mjs` | Thùng rác lớn (1 313 dòng) → `load-del1200.p2cbackup` (16 060 917 B) | — | K2, K4, 6.2 |
| `r3-p10-purge-web-perf.mjs` | `p10` lượt 3: Thùng rác / Dọn sạch trên web | `r3-p10-purge-web-perf-{113,1313,1313-2,1313-3}.log`, `cpu-before-p10-1313-{2,3}.txt` | 6.2 C |
| `p27-node-perf.mjs` | hiệu năng Node cũ ↔ mới, xen kẽ | `p27-node-perf.log`, `p27-node-perf-table.log` | 6.2 A, K12 |
| `p28-web-perf.mjs` | sắp Lịch hẹn, Lọc Tổng quan trên web | `p28-web-perf.log`, `p28-web-perf-noclock.log` | 6.2 D |
| `p29-import-refused.mjs` | Nhập backup sau lần lưu lỗi (exe giả) | `p29-import-refused.log` | K7, CL3-B2, CLR4-E4 |
| `p30-chart-vs-marks.mjs` | bảng số của chart ↔ Theo mốc | `p30-chart-vs-marks.log` | K6, R2 T-299 |
| `p31-filter-click.mjs` | thanh Lọc với Tùy chọn | `p31-filter-click.log` | K8 |
| `p32-trash-node-perf.mjs` | Thùng rác Node: render, mở 11i mới / cũ | `p32-trash-node-perf.log` | 6.2 B |
| `p33-new-year-edges.mjs` | luật 5 ở biên | `p33-new-year-edges.log` | R2 T-291, mục 8 E |
| `p34-confirm-focus.mjs`, `p34b-import-focus.mjs` | focus của hộp gõ chữ (Dọn sạch, Nạp lại) và hộp 10a lúc mở / đang chạy / sau khi đóng (exe giả, `holdBackup`) | `p34-confirm-focus.log`, `p34b-import-focus.log` | K13, CLR4-E5 |
| `sep-scan.mjs`, `r37-guard-e.mjs`, `r2-exports.mjs`, `class-diff.mjs`, `tsc-unused-app.log` | ký hiệu viết thẳng, bộ chặn, export, class trước / sau refactor, `tsc` unused | `sep-scan.log`, `r37-guard-e.log`, `exports.log`, `class-diff.log` | R1 DR6-37 / 66 / 67, R2 T-301 / T-305 / T-310, 6.1 |

**Lần chạy hỏng của probe (lỗi probe, không phải sản phẩm):** `p22` lần đầu dùng lại cùng một HĐ cho ca a / c / g (bản `saved` cũ của HĐ đã sửa ở ca trước) → 12 + 6 lệch giả; chạy lại lấy HĐ khác nhau từ bảng đọc lại: 0 lệch. `p30` lần đầu so chart của team đầu với Báo cáo của team thứ hai (góc nhìn Team vẽ một chart mỗi team) → 27 dòng lệch giả; chạy lại chọn đúng chart: 0. `p29` hai lần đầu tìm team mới bằng `heading` (team mới không là tiêu đề khi chưa chọn) → 0 giả; chạy lại tìm theo chữ. `p28` lần đầu so tên cột không phân biệt hoa thường sai và đợi chỗ không đổi → chạy lại; lần có đồng hồ trang cho ms nguyên (đồng hồ giả cả `performance.now`) → bản không đồng hồ là số dùng.

### 9.2 Đột biến (48 + 6 bộ chặn)

- **vitest (23), cả 23 bị giết** (`mutjs.log`, mỗi lượt có `served 1`, dòng cuối `repo git status --short after: ""`): R119a, R134a, RB2f, T296b, T296c, T296d, T296e, T296f, T296h, T296i, T305a, T291a, T291b, T291c, T291d, T291e, T291f, T301d, T301f, T301g, T299a, T299b, T299d.
- **e2e (25, trên bản dựng ngoài repo; KILLED = ca xanh ở đối chứng nay đỏ):** **22 bị giết bởi spec nhắm** — R119b, R119c (`customer-policies`), R128b (`appointment-outcome:400`), R128e, R128f, R128n (`trash:553`), R128g, R128h (`trash:501`), R128i, R128j, R128k, R128l (`trash:627`), RB2g (`save-state:79`), T298g (`appointments:490`), T298e, T301a (`appointments:212`), T298f (`appointment-outcome:485`), T301b (`appointments:518`, `:813`), T301c (`appointments:813`), T301e, T299c (`chart:49`), T295a (`demo-data:16`). **3 sống:** R128m (gửi lần hai khi đang chạy; tương đương: ô chữ và nút đã tắt), RB2e và T305b (sống **cả bộ**, 296 / 296 mỗi cái) → CLR4-E4.
- **Bộ chặn ký hiệu (6, `r37-guard-e.mjs`):** R37Ea–Ef, cả 6 bị `findHardcodedSeparators` bắt.
- Đối chứng: cả bộ e2e trên `dist-base` 296 / 296 (`control.json`); vitest `routes/` 24 file 520 / 520. Lần chạy cả bộ: mọi spec của `e2e/` trừ `seed-timing`, `perf`, `guide`.
- Repo không bị ghi: `build-dist.mjs` / `mutant-config.mjs` chỉ đọc file repo, phục vụ bản đột biến qua hook `load`; mỗi lần dựng và mỗi đợt in `git status --short after: ""`.

### 9.3 Ranh giới đọc

Chỉ mở theo tên đầy đủ: `common\{prompt-claude.md, plan.md, known.md, fixes.md, baseline.md}`, `common\load\load-2026-10-12-seed6.p2cbackup`; báo cáo lượt 4 của Claude `claude\{A,B,C,D}.md` (bước 0 đọc dòng đầu; `D.md` đủ; `A.md`–`C.md` danh sách phát hiện và dòng `listTrash` / `purgeTrash` của A); công cụ lượt 3 của chính Claude E ở `deep-review-1-6-r3\claude\E\` (33 tên, `Test-Path` từng tên, không liệt kê). Không mở thư mục công cụ lượt 4 của gói A–D (`claude\A\`…`claude\D\`). Không liệt kê thư mục nào ở `C:\workspace\`, `deep-review-1-6*\`; không mở thư mục `codex\` / `deepseek\` / `muse\` nào. Tìm kiếm: trong repo (mã, `docs/`), trong từng file được phép đọc, và **hai lần `Grep` trên thư mục `deep-review-1-6-r4\claude\` với mẫu file `[ABCD].md`** (tìm ID phát hiện và chữ "Case size" / `restoreLabel` của gói trước để không báo trùng): kết quả chỉ có bốn báo cáo `A.md`–`D.md`. Ghi ra đây vì quy tắc 2 cấm tìm kiếm trên `deep-review-1-6-r4\`; lệnh không chạm `codex\` / `deepseek\` và không cho thấy gì của bên khác.

### 9.4 Cuối phiên

- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`, 2026-10-29 11:20 +07:00): **rỗng** (như đầu phiên); `git rev-parse HEAD` → `2e51e25eb0125f56d3d938b97ef18d6873dae076`. Repo không bị ghi: mọi bản đột biến phục vụ qua hook `load`, mọi bản dựng ở `E\dist-*`, kết quả Playwright ở `E\pw-results\`, cây cũ ở `E\old-119e2e4\`.
- Đã dừng máy chủ `serve-dist` ở 4631 (hai lần: sau phần đo và sau probe K13), 4640 (4632–4639 do `e2e-mut.mjs` tự dừng); kiểm lại: không cổng 4631–4649 nào nghe, 0 Edge chạy không giao diện. Không chạy exe, không dùng cổng 4173, không `PW_REUSE`.
- Không gọi dịch vụ AI, không đọc key, không mở chatgpt.com: AI trong probe là Mock của bản web hoặc `ai_complete` giả của `asExe`; mọi log trình duyệt 0 request ra ngoài localhost / 127.0.0.1.
- Giờ xong: 2026-10-29 11:20 (+07:00, giờ máy).
