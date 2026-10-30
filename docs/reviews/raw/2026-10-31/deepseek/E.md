XONG — deepseek gói E lượt 4, 2026-10-30 22:11 (+07:00)

# Gói E — Lịch hẹn, chỉ số, quản lý (deepseek, lượt 4)

## 1. Bên, gói, SHA, trạng thái, giờ, công cụ

- Bên: deepseek. Gói: **E** (Lịch hẹn, chỉ số, quản lý).
- SHA đầu phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076` (`git rev-parse HEAD`).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-30 21:29 (+07:00). Giờ xong: 2026-10-30 22:11 (+07:00).
- Công cụ / model: app WorkBuddy **v5.9.3** (theo `common\baseline.md`), model **DeepSeek V4.1 Flash**, context 1M, mức suy luận **cao nhất** (chọn tay trong bộ chọn model của task; app không hiện số bản 1017). Shell Git Bash trên Windows; Node v22.22.2 của máy; Playwright + Edge của repo.
- Phiên: làm mới (`deepseek\E.md` chưa có ở đầu phiên). Không có agent phụ, không skill, không connector, không mạng ngoài máy.

## 2. Bảng R1 và bảng R2

### R1 — theo mã (9 dòng của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-110 (L) | #721 → #738 | **ĐÃ SỬA** (phần E) | Form đọc **chữ gốc** của ô: `readScheduleDate` truyền `text` vào `parseQuickDate` (`appointment-form.ts:69`), `readPolicy` truyền `draft.submittedDate` / `draft.issued.date` vào `parseRecordDate` và `readFyp` (`policy-form.ts:98-110`). `parseVnd('1,234 tr')` → `{ ok: true, amount: 1234000000 }`, `parseVnd('1.234 tr')` cùng kết quả (chạy `node --import tools/ts-hooks.mjs`). 14 file test gói E / **325 test** xanh. | Phần sửa nằm ở `packages/domain` (gói A); E chỉ kiểm chỗ nối. Không đột biến ở E: đột biến `parseVnd` / `parseQuickDate` là của A. |
| DR6-119 (N) | #725 → #748 (+ #785 → #833) | **ĐÃ SỬA** | `restoreLabel` ghép `recordTitle(row)` với chữ của `recordBadge(row)` (`trash-view.ts:198-202`); HĐ thêm trạng thái, lịch hẹn thêm trạng thái, KH thêm nhóm. Đột biến **M1** (bỏ `recordBadge(row)?.text`): `trash-view.test.ts` **7 test đỏ** / 78. e2e `customer-policies.spec.ts` + `appointments.spec.ts` **45 passed**, gồm "two policies submitted the same day have four buttons of four different names (DR6-119)" và "a policy submitted and one issued, of one day and one FYP, have two "Sửa" names". | Biến thể còn hở: hai **nhân sự cùng tên** khác vai trò / team vẫn cùng tên nút — **DSR4-E1**. Hai KH cùng tên cùng nhóm: Owner 25/10 chấp nhận (ghi chú #833), không báo lại. |
| DR6-128 (L) | #725 → #748 | **ĐÃ SỬA** | (a) Hộp Dọn sạch: đột biến **M4** `purgeReminder(shown.length)` → e2e D12 "reminds from 1 000 records…" **đỏ**; bộ ba spec gói E ở bản ghim **37 passed** (gồm "the dialog of a purge that runs stays: Escape does not close it, Hủy is off"). (b) Chỗ nối 6f ↔ `editedDay`: đột biến **M5** `editedDay(…, { ...a, status: 'CANCELLED' }, day)` → e2e E19 "6f holds the stage kept" **đỏ**. | Chưa chạy R84f (`canPurge(shown)`) riêng; cùng ca D12 phủ cả câu nhắc lẫn nút, nhưng tôi chỉ chạy một đột biến của cặp này. |
| DR6-131 (N) | #729 → #755 (+ #756 → #758) | **ĐÃ SỬA** (sửa bằng tài liệu) | Mockup 6d (`docs/design/mockups/appointment-forms.html:244`) nay ghi `"1,234 tr" = 1.234.000.000 ₫` và `"0,500 tr" = 500.000 ₫`, đúng quyết định Owner 27/09 (#106) và đúng câu help của app (`vi.ts:888-889`). NT-LH-25 (`nghiem-thu-v1.md:137`) chép cùng luật, thêm "một lần, không lặp trong ngoặc". `parseVnd('1,234 tr')` → 1 234 000 000 (chạy). | Không sửa code theo mockup cũ: code đúng quyết định G8; chỉ tài liệu đổi. |
| DR6-134 (N) | #720 → #740 (+ #775 → #804) | **ĐÃ SỬA** | Luật "nhóm của ngày" nay một hàm `stagesOfDay` (`packages/db/src/customers.ts`), dùng ở lệnh, ở `meetingDay` của hộp (`outcome-form.ts:107`) và ở luật nhập; spec Phase 3 §4 (dòng `recordMeetingOutcome`) và §6 dẫn `stagesOfDay` thay `stageOn`. `grep -rn "DR-43"` chỉ còn comment / test, không còn bản luật thứ hai. | Phần lớn ở gói A; E kiểm chỗ nối hộp 6c / 6f. |
| DR6-37 (N) | #655 → #693 (một phần), #790 → #845 | **ĐÃ SỬA** (phần E) | Ký hiệu viết cứng trong file E: `grep` `—`, `×`, `▾`, `▸`, `→` chỉ khớp comment / test; màn dùng `t('sep.*')`, `appointments.none`, `policyForm.*`. `packages/ui/src/token-guard.test.ts` **16 passed** (luật `hardcoded-mark`). | `PURGE_REMINDER` vẫn export chỉ dùng trong file — KNOWN DR6-66, không báo lại. |
| DR6-66 (N) | #655 → #693 (một phần), #775 → #801, #777 → #812, #790 → #845 | **ĐÃ SỬA** (phần E) | `tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` → **0 lỗi**; `depcruise apps packages` → "no dependency violations found (341 modules, 1435 dependencies)"; `node tools/codemap.mjs --check` → "Export maps are up to date". | `PURGE_REMINDER` (trash-view.ts:518) là export chỉ dùng trong file, cùng loại DR6-66 đã KNOWN; không có bằng chứng mới. |
| DR6-67 (N) | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | **ĐÃ SỬA** | Chuỗi `HEADING` và chuỗi gốc `BADGE` chỉ còn ở `classes.ts:20` và `:27` (`grep -rn` trên `apps/desktop/src`); `REPORT_COLUMNS` một danh sách 17 cột, `reportCells` / `ReportTable` / `report-workbook` cùng đọc; `recordBadge` một chỗ chọn huy hiệu. | Refactor không đổi hành vi: 325 test gói E + 95 e2e liên quan xanh; không có test nào phải sửa. |
| CL3-B2 (N) | #783 → #817 | **ĐÃ SỬA** (phần E) | Câu từ chối D7 của Dọn sạch nêu đúng "Bấm "Thử lại" ở dải cảnh báo đầu màn, lưu được rồi thì dọn lại" (`vi.ts:366-367`, `purgeFailure` đọc `isUnsavedChangesError`). Đột biến **M6** (bỏ nhánh `failedUnsaved`) → `trash-view.test.ts` **1 test đỏ**. e2e "a purge refused because the last save failed says so and changes nothing, then runs after "Thử lại" (D7; 11j)" **passed** trong bộ 37. | Nút "Thử lại" và hàng đợi lưu thuộc gói B / D; E kiểm câu và đường dẫn tới nút. |

### R2 — theo Issue (10 dòng của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-284 | #773 → #795 | **ĐÃ SỬA** (mockup / tài liệu) | Token `--border-control: #687890` có ở mockup (`mockups.css:12`) và app (`packages/ui/src/tokens.css:14`); 8d có luật dòng số HĐ (`policy-forms.html:230`); 2h mờ dùng khung viền liền (`ai.html`, app `KycIntelligence.tsx:257` ngược với khung không mờ); 1a / 4a không còn "DeepSeek V4 Pro", dòng help khớp `AI_MODELS`. | Bốn mục đều khớp app; không có mục nào chỉ nằm trên giấy. |
| T-291 | #780 → #824, #828 | **ĐÃ SỬA** (phần E: luật 5) | `readScheduleDate` trả `previousYearSuggestion` cho 6b / 6e và **không** cho 6h (`appointment-form.ts:76-84`); `parseQuickDate('31/12', 02/01/2026)` → `previousYearSuggestion: 31/12/2025`, `date` vẫn 31/12/2026 (chạy). Đột biến **M3** (bỏ `previousYearSuggestion`) → `appointment-form.test.ts` + `DateSuggestion.test.tsx` **2 test đỏ** / 28. | "App không tự đổi năm": câu help và nút "Dùng …" chỉ điền ngày; không có nhánh tự sửa `date`. |
| T-295 | #784 → #825 | **ĐÃ SỬA** | 10c đếm một lần lúc mở (`Settings.tsx:152`), câu đúng số KH / lịch hẹn / HĐ: đột biến **M7** (`counts.customers + 1`) → e2e "the reload dialog names how many customers… (10c)" **đỏ**; bộ 37 passed. Một state `{ from, notice }` (`Settings.tsx:81-101`) chỉ giữ thông báo của section vừa đổi. `RefusedDialog` có nhánh `SCHEMA_TOO_NEW` (`SettingsBackup.tsx:271-276`). | `openFrom` ghi một lần, `MAX_SAVE_MEASURES` 50, `startChatGptWeb` so `generation`: thuộc B / C, đọc chéo ở `app-data.ts`; không đột biến trong E. |
| T-296 | #785 → #833 | **ĐÃ SỬA** | Hộp gõ chữ dùng chung `ConfirmWordDialog.tsx` (NFC, chặn đóng / chạy lại khi đang chạy) cho 10c và 11i; hộp 11i đọc kế hoạch một lần từ dòng `listTrash` (`SettingsTrash.tsx:328`, `trash-view.ts:560-585`), `purgePlan` = `previewPurge` trên dữ liệu tải **113 dòng** và Thùng rác lớn **1 313 dòng** (counts bằng, kept bằng); câu 11j từng câu; tên nút theo ô (M1); E20 theo cờ (M2, 1 test đỏ); 8d dòng số HĐ (M8, 2 test đỏ + probe báo cáo); slot `kycNotes` (`vi.ts:308`). | e2e 11i "đang dọn" / "Hủy tắt" / D7 passed; tên "Sửa HĐ" theo trạng thái passed (45 e2e). |
| T-298 | #787 → #838 | **ĐÃ SỬA** | 6a có badge nhóm trước → sau, 6h không có khối lịch sử (`AppointmentDialog.tsx:150-153`); 6d có `help` Case size (`MetFields.tsx:135-136`); ô ngoài tháng / ngoài khoảng là `role="img"` có `dayLabel` (`AppointmentsScreen.tsx:492-503`) — đột biến **M9** (bỏ `parts`) → `appointments-view.test.ts` **2 test đỏ** / 42; hàng nút Chi tiết khóa theo `key={a.id}` (`:682`) và focus về tiêu đề mới (`:110-113`). | 5d, `stageSince`, thẻ Lịch hẹn 1 440 thuộc D; e2e `appointments.spec.ts` 45 passed cùng `customer-policies`. |
| T-299 | #788 → #841 | **ĐÃ SỬA** | Bảng ẩn `sr-only` sinh từ `StageChart.columns` (`stage-chart.ts:145-163`, `StageBlock.tsx:143-171`), `aria-describedby` trỏ dòng tóm tắt; đột biến **M10** (bảng bỏ 3 nhóm) → `stage-chart.test.ts` **5 test đỏ** / 17. Bộ chọn kỳ Tùy chọn: đột biến **M11** (áp dụng ở mỗi lần blur) → e2e "a custom date is refused once the focus leaves both date fields…" **đỏ**; bản ghim `period-picker.spec.ts` **13 passed**. | Cách sắp bảng thành viên, focus "Sửa <tên>" thuộc D; E kiểm phần Tổng quan / Báo cáo. |
| T-301 | #790 → #845, #846 | **ĐÃ SỬA** | Mã chết / hằng lặp: `tsc --noUnusedLocals --noUnusedParameters` 0 lỗi; `depcruise` 0 vi phạm; `codemap:check` sạch; `HEADING` / `BADGE` một chỗ; ký hiệu viết cứng chỉ còn comment / test. | Refactor không đổi hành vi: 325 unit + 95 e2e xanh; không sửa test nào. |
| T-305 | #849 → #855 | **ĐÃ SỬA** | `recordBadge` một hàm, `RecordCell` và `restoreLabel` cùng đọc (M1 chứng minh test giữ); dòng bản web dùng `WEB_MODE.tone` (`SettingsDataFile.tsx:43`); `shots.guide.ts` cài đồng hồ bằng `anchorMorning(timezoneId)` (`:14-15`); `check.guide.ts` ghi "150 KiB" (`:7`, `:15`, `:19`); `HEADING` / `BADGE` chỉ còn `classes.ts`. | Hai class gốc không còn bản chép nào trong `apps/desktop/src` (grep). |
| T-306 | #850 → #857 | **ĐÃ SỬA** (tài liệu) | Spec Phase 6 §4.2 (dòng 189) ghi `previewPurge` là chuẩn so, hộp 11i đọc `purgePlan` từ `listTrash`; §4.3 (dòng 237) ghi "150 KiB" kèm "1 KiB = 1 024 byte"; NT-TR-20 (`nghiem-thu-v1.md:322`) chờ câu E20 "ghi sau lúc xóa"; NT-LH-25 theo luật dấu phẩy. | Ba chỗ đều khớp app ở ghim; không có dòng nào còn câu cũ. |
| T-310 | #865 → #871 | **ĐÃ SỬA** | Bốn tiêu đề còn viết thẳng đã dùng `HEADING` (grep chỉ còn `classes.ts`); `stageBadge(stage, label?)` có nhãn cho ô Thùng rác (`stage-badge.tsx:9`); slogan có `lang="en"` (`Brand.tsx:27`) và sáu mockup có sidebar; `PACKAGES` đã nhận 5 file mới — `node tools/size-report.mjs` **không còn dòng "Chưa xếp gói"**, gói E **8 155 SP / 4 556 test / 52 file**; ca tên app đọc `productName` / `title` khớp `app.title` (`tauri-contract.test.ts:325-327`); dòng `scrollY` = 0 sau `goto` đã bỏ (`navigation.spec.ts:148-165` kiểm > 0 rồi về 0). | `lang="en"` là mã ngôn ngữ, không qua i18n; mockup chỉ thêm thuộc tính, không đổi bố cục. |

## 3. Phạm vi đã đọc

- Đọc hết: `routes/ConfirmWordDialog.tsx` (67), `routes/trash-view.ts` (676), `routes/SettingsTrash.tsx` (401), `routes/Settings.tsx` (190), `routes/SettingsBackup.tsx` (292), `routes/SettingsDataFile.tsx` (135), `routes/RestoreDialog.tsx` (68), `routes/FilterBar.tsx` (85), `routes/applied-filter.ts` (52), `routes/period-labels.ts` (27), `routes/Screen.tsx` (22), `routes/Overview.tsx` (62); `routes/appointments/AppointmentDialog.tsx` (470), `AppointmentsScreen.tsx` (705), `appointment-form.ts` (166), `appointments-view.ts` (472), `outcome-form.ts` (233), `EditOutcomeDialog.tsx` (267), `OutcomeDialog.tsx` (344), `MetFields.tsx` (164), `RescheduleFields.tsx` (147), `YearGrid.tsx` (142), `DeleteAppointmentDialog.tsx` (129); `routes/overview/stage-chart.ts` (198), `stage-view.ts` (159), `StageBlock.tsx` (172), `TeamCompare.tsx` (126), `team-compare-view.ts` (130), `overview-view.ts` (đọc phần KPI); `routes/reports/reports-view.ts` (403), `report-workbook.ts` (231), `ReportTable.tsx` (144), `ReportsScreen.tsx` (113), `ReportExport.tsx` (đọc hook); `routes/customers/policy-form.ts` (276), `PolicyDialogs.tsx` (341), `CustomerPolicies.tsx` (117).
- Đọc chéo khi cần: `packages/db/src/purge.ts` (KEPT_APPOINTMENTS / KEPT_PEOPLE / KEPT_TEAMS / COUNTS), `packages/db/src/trash.ts` (`listTrash`), `packages/db/src/policies.ts` (`updatePolicy`), `packages/db/src/appointments.ts` (`rescheduleAppointment`, `insertScheduled`), `packages/domain/src/period.ts` (`parseQuickDate`), `packages/ui/src/components/PeriodPicker.tsx`, `Dialog.tsx`, `dialog-focus.ts`, `packages/ui/src/tokens.css`, `apps/desktop/src/i18n/vi.ts` (khóa `trash.*`, `policies.*`, `appointmentForm.*`, `outcome.caseSizeHelp`, `reports.excel.*`).
- Diff `119e2e4..2e51e25` của gói: 29 file SP + 9 file test (bản đầy đủ `E\diff-E.txt`, 3 380 dòng); đọc từng hunk của `trash-view.ts`, `SettingsTrash.tsx`, `Settings.tsx`, `SettingsBackup.tsx`, `appointment-form.ts`, `AppointmentsScreen.tsx`, `stage-chart.ts`, `StageBlock.tsx`, `reports-view.ts`, `report-workbook.ts`, `policy-form.ts`, `CustomerPolicies.tsx`, `ConfirmWordDialog.tsx`.
- Báo cáo lượt 1–3 và ba bản tổng hợp: đọc mục 1–4 báo cáo gói E của Claude và Codex lượt 3 (`docs/reviews/raw/2026-10-21/{claude,codex}/E.md`), các mục liên quan trong tổng hợp lượt 3 (§3.1, §6, §8.4) và tổng hợp lượt 1 §3–§5 (DR6-25, 37, 66, 67); `common\known.md`, `common\fixes.md` (các Issue của gói), `common\baseline.md`.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| S1 | Kế hoạch dọn của hộp 11i (`purgePlan(listTrash)`) so `previewPurge` trên dữ liệu tải (113 dòng) và Thùng rác lớn (1 313 dòng, 1 200 KH xóa) | Counts bằng nhau từng trường, `kept` bằng nhau (0 / 0); `purgePlan` 0,1–0,5 ms | — |
| S2 | Dọn sạch một Thùng rác đủ năm loại, có 1 lịch bị giữ: số hộp / thông báo so số dòng **thật sự biến mất** trong DB | Hộp "1 KH — kèm 1 lịch hẹn · 1 HĐ · 1 ghi chú KYC" + "1 lịch hẹn · 1 HĐ · 1 nhân sự · 1 team"; DB mất đúng 1 KH, 2 lịch, 2 HĐ, 1 nhân sự, 1 team, 1 ghi chú; thông báo 11j khớp | — |
| S3 | Khôi phục KH (kéo theo lịch / HĐ / ghi chú KYC) rồi Dọn sạch phần còn lại | Bản ghi vừa khôi phục không bị chạm; chỉ lịch đã xóa riêng bị dọn; `purgeView` "1 bản ghi", DB mất đúng 1 lịch | — |
| S4 | Chuỗi giữ lại ba tầng: dời lịch → xóa lịch cũ → ghi kết quả + bỏ người phối hợp ở lịch mới → xóa nhân sự → xóa team → mở hộp dọn | `listTrash` đánh dấu KEPT cả ba; `purgePlan.kept` = `previewPurge.kept` (3, đúng thứ tự loại); hộp "Giữ lại 3 bản ghi"; `purgeTrash` giữ đủ 3, xóa 0; danh sách còn 3 dòng | — |
| S5 | 8d dời ngày nộp 20/08 → 01/09 của HĐ đã phát hành, rồi dời ngày phát hành 18/09 → 02/10: câu "Ảnh hưởng chỉ số" so báo cáo tháng cũ / mới | Lần 1: câu "tháng 08/2026: −1 HĐ nộp · tháng 09/2026: +1 HĐ nộp"; Báo cáo T8 nộp 1 → 0, T9 nộp 0 → 1. Lần 2: "−1/+1 HĐ phát hành" 09 → 10; báo cáo T9 phát hành 1 → 0, T10 0 → 1 | — |
| S6 | 6b / 6e đầu năm: hôm nay 02/01/2026 gõ "31/12" | `parseQuickDate` trả ngày 31/12/2026 (không tự đổi năm) + gợi ý 31/12/2025; `readScheduleDate` giữ gợi ý cho 6b / 6e, bỏ cho 6h; bấm gợi ý ở 6e ra "ngày đã qua" tới khi tick "Nhập bù" | — |
| S7 | Hộp 10c mở khi dữ liệu đang mở: số KH / lịch hẹn / HĐ so dữ liệu | e2e đọc đúng số đang mở; đột biến +1 KH làm ca đỏ | — |
| S8 | Hộp Dọn sạch đang chạy: Escape ×3, Hủy, gõ lại chữ | Hộp ở lại, Hủy và ô chữ tắt, không chạy lần hai (e2e 37 passed) | — |
| S9 | Bộ chọn kỳ Tùy chọn: Tab từ ô Từ sang ô Đến, rồi rời cả nhóm | Tab không báo đỏ; rời cả nhóm mới áp dụng / báo (e2e 13 passed; đột biến làm đỏ) | — |
| S10 | Hai nhân sự cùng tên khác vai trò / team trong Thùng rác: tên nút "Khôi phục" | Hai tên nút giống nhau, dù ô "Bản ghi" khác dòng vai trò và cột "Thuộc" khác team | **DSR4-E1** |

## 5. Phát hiện mới

```
ID: DSR4-E1
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/trash-view.ts:198 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: DR6-119 · có từ trước, lượt 1–3 bỏ sót (phần sửa #748 / #833 chỉ lấy dòng đầu của ô "Bản ghi")
Kịch bản: S10 (probe E\probe-person-label.mjs)
Mô tả: Tên nút "Khôi phục" của nhân sự chỉ gồm tên, nên hai nhân sự cùng tên khác vai trò / team có hai nút cùng tên cho trình đọc màn hình, dù ô "Bản ghi" của họ khác nhau ở dòng vai trò và cột "Thuộc" khác team.
Tái hiện / bằng chứng: `node --import ./tools/ts-hooks.mjs E\probe-person-label.mjs` dựng hai dòng `kind: 'person'`, cùng `name: 'Nguyễn Văn An'`, vai trò IS / TL, team Sao Mai / Bình Minh: `recordTitle` cả hai "Nguyễn Văn An"; `recordDetail` "IS" / "TL"; `restoreLabel` cả hai "Khôi phục nhân sự Nguyễn Văn An" — `same: true`. `restoreLabel` (trash-view.ts:198-202) ghép `recordTitle` với `recordBadge`, mà `recordBadge` trả `null` cho nhân sự (trash-view.ts:110-117); dòng vai trò nằm ở `recordDetail` (trash-view.ts:143-145), không vào tên nút.
Ảnh hưởng: Người dùng trình đọc màn hình mở Thùng rác có hai nhân sự trùng tên (tên Việt trùng phổ biến; lệnh tạo không cấm) nghe hai nút giống nhau, không biết nút nào của ai; người dùng chuột / bàn phím vẫn thấy vai trò ở dòng dưới ô "Bản ghi".
Đề xuất: thêm vai trò (và team khi có) vào tên nút nhân sự, như dòng thứ hai của ô "Bản ghi" — ví dụ `restoreLabel` ghép `recordDetail(row)` cho `kind === 'person'`, hoặc mở rộng `recordBadge` trả `{ text: role }` cho nhân sự. Cỡ ≤ 20 dòng SP + 1 ca unit (hai nhân sự cùng tên khác vai trò → hai tên khác nhau) + đổi 2 ca e2e dò tên nút nhân sự. Không đổi dữ liệu, không đổi golden.
```

Ghi chú: đây là **biến thể gần** của DR6-119, không phải phần sửa chưa làm — hợp đồng của Issue #725 / #785 chỉ đòi tên nút dựng từ `recordTitle` cộng trạng thái HĐ, nên đề xuất là mở rộng hợp đồng cho nhân sự, không phải báo Issue làm thiếu. Hai KH cùng tên cùng nhóm vẫn trùng tên, nhưng Owner 25/10 đã chấp nhận (ghi chú #833), nên không báo.

## 6. Bloat và Hiệu năng

### Bloat

| Việc đã chạy | Trên | Kết quả | ID |
|---|---|---|---|
| `tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | toàn app (gồm gói E) | 0 lỗi | — |
| `./node_modules/.bin/depcruise apps packages` | 341 module, 1 435 dependency | "no dependency violations found" (không vòng import mới của `ConfirmWordDialog`) | — |
| `node tools/codemap.mjs --check` | repo | "Export maps are up to date" | — |
| `grep -rn` hai chuỗi `HEADING` / `BADGE` | `apps/desktop/src` | chỉ còn `classes.ts:20`, `:27` | — |
| `grep` ký hiệu viết cứng (`—`, `×`, `▾`, `▸`, `→`) trong file E | `routes/appointments`, `routes/overview`, `routes/reports`, `trash-view.ts`, `SettingsTrash.tsx`, `ConfirmWordDialog.tsx` | chỉ khớp comment / test; màn dùng `t('sep.*')` | — |
| `node tools/size-report.mjs` | gói E | 8 155 SP / 4 556 test / 52 file; **không còn dòng "Chưa xếp gói"** | — |
| `node node_modules/vitest/vitest.mjs run packages/ui/src/token-guard.test.ts` | token-guard | 16 passed | — |
| Đọc export của `trash-view.ts` và `grep -w` nơi dùng | apps / packages / e2e / tools | `PURGE_REMINDER` chỉ dùng trong file (KNOWN DR6-66); các export còn lại có nơi dùng ngoài file hoặc trong test | KNOWN |

- Bundle / exe: lấy số ở `common\baseline.md` (JS `assets/index.js` 884 698 B, CSS 29 752 B, exe 5 649 408 B). **Không** dùng `dist` hiện tại để đo: lần chạy e2e của tôi dựng lại `dist` qua `e2e/serve.mjs` với `VITE_DEMO_ANCHOR` (biến của cấu hình Playwright), nên `index.js` 884 710 B (+12 B) là bản build có neo, không so được.
- Không thấy bloat mới có chi phí đo được trong gói E; không đề xuất refactor mới.

### Hiệu năng

Máy `DESKTOP-KDURKJP` (Home PC), dữ liệu tải `load-2026-10-12-seed6.p2cbackup` (hash `ad82051b…`), Node v22.22.2, `@p2c/db` của worktree ghim; mỗi lần `importBackup` mới (dọn là xóa hẳn). Trung vị (min–max), ms.

| Đo | Thùng rác tải (113 dòng) | Lượt 3 / mốc | Thùng rác lớn (1 313 dòng) | Lượt 3 |
|---|---:|---|---:|---:|
| `listTrash` (lần đo 2, máy rảnh) | 26,1 (23,5–42,0) | 23,8 | 146,0 (143,7–161,0) | 158,2 |
| `purgePlan` (kế hoạch hộp 11i) | 0,1 (0,1–0,3) | — | 0,5 (0,5–1,1) | — |
| `previewPurge` | 1,2 (1,0–1,5) | 1,0 | 7,0 (6,7–7,9) | 7,4 |
| `purgeTrash` cả `VACUUM` | 90,8 (88,3–97,1) | 85,2 | 132,6 (125,6–146,2) | 129,8 |
| `db.export()` sau dọn | 2,5 (2,4–2,9) | 2,1 | 0,4 (0,4–0,7) | 0,5 |
| `listTrash` sau dọn | 1,0 (1,0–3,9) | 2,1 | 0,6 (0,6–1,1) | 2,1 |

- Lần đo đầu (cùng script, ngay sau khi chạy e2e): `listTrash` 36,1 / 200,7 ms — cao hơn hẳn lần 2; máy còn tiến trình build / Edge của lần chạy trước. Lần 2 (máy rảnh) là số ghi ở bảng. Không dòng nào vượt luật nhiễu (quá 20 % **và** quá 10 ms) so lượt 3; dòng lệch nhiều nhất là `listTrash` lớn, **thấp hơn** 12,2 ms (−8 %).
- Số trên exe lấy từ `common\baseline.md` (cùng máy, cùng dữ liệu): `trash.open` 32 ms (< 200 ms), `db.save` 149 ms (≤ 400 ms), `reload.overview` 405 / `reload.reports` 373 / `reload.appointments` 393 ms (< 500 ms), "Backup rồi dọn sạch" → khung 11j **123,3 ms** (≤ 500 ms), `reports.export-excel` 29 ms (≤ 500 ms), `backup.export` 436 ms (≤ 1 000 ms). Không dòng nào ⚠️.
- Kết luận hiệu năng: **không có phát hiện P mới**; gói E không xấu hơn mốc sau #656 hay lượt 3.

## 7. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | **1** |

Tỉ lệ PLAUSIBLE: 0/1 (phát hiện duy nhất CONFIRMED bằng probe). Không có phát hiện nào chỉ dựa vào đọc code.

## 8. Đã xét, không thấy

- **E — Edge case:** Thùng rác rỗng / 1 dòng / 113 / 1 313; KH không có bản ghi con; HĐ chưa phát hành; lịch không giờ; lịch bị chặn; nhân sự / team bị giữ; dọn khi mọi dòng bị giữ (nút tắt); khôi phục rồi dọn; dọn rồi khôi phục (không còn gì); 29/02, 31/12 qua năm, nửa đêm (e2e `period-picker` có ca sau nửa đêm), tháng 30 ngày (monthGrid), 1 440 (e2e D). Đã chạy S1–S10; không thấy.
- **C — Đúng hợp đồng:** đối chiếu 11a / 11b / 11e / 11h–11j (`trash.html`), 10c (`settings-data.html`), 6a / 6d / 6h (`appointment-forms.html`), 2a–2e (`reports.html`), 1a–1c (`overview.html`), 8d (`policy-forms.html`); các câu, thứ tự dòng, nhãn nút khớp. Chỗ lệch đã biết (6h còn dòng "Lần gặp thứ n", help Case size ở cả ba hộp, 8d không in đậm, 10c không in đậm ngày neo) đúng danh sách "Lệch mockup đã biết". Không thấy lệch mới.
- **D — Dữ liệu:** `purgePlan` = `previewPurge` (S1, S4); số hộp = số dòng mất (S2); khôi phục không bị dọn nhầm (S3); 8d dời tháng khớp báo cáo (S5); `updatePolicy` giữ `issuedDate` / `issuedFyp` khi sửa ngày nộp (S5); không có transaction mới ở E. Không thấy.
- **G — Guardrail AI:** gói E không có code AI; chỉ đọc `AppointmentAi` / nút AI của Chi tiết (hiển thị), không thấy đường dẫn mới. Đã xét, không thấy.
- **S — An toàn ranh giới:** dọn sạch từ chối khi lần lưu lỗi (D7), câu nêu "Thử lại"; backup trước khi dọn do exe lo (11j nêu tên file); không có đường dẫn / tên file mới trong E; không có mạng. Đã xét, không thấy.
- **P — Hiệu năng:** bảng ở mục 6; không phát hiện.
- **B — Bloat:** bảng ở mục 6; không phát hiện mới.
- **T — Test:** 11 đột biến, 11 bị giết (M1–M11); 325 unit + 95 e2e liên quan xanh; test cũ không phải sửa. Chỗ hở còn lại: R84f chưa chạy riêng; `purgePlan.kept` so bằng `arrayContaining` (không theo thứ tự) — hành vi không phụ thuộc thứ tự, chỉ hiển thị số.
- **A — Trợ năng / i18n:** `dayLabel` / `monthLabel` có số theo nhóm (M9); bảng ẩn của chart (M10); tên nút khôi phục (M1) — còn **DSR4-E1**; `aria-current="date"` cho ô hôm nay; `role="img"` cho ô không bấm được; chuỗi qua `vi.ts`; không thấy vấn đề khác.

## 9. Phụ lục

### Nguồn probe / test tạm / đột biến (trong `C:\workspace\deep-review-1-6-r4\deepseek\E\`)

- `probe-purge-plan.mjs` — `purgePlan` vs `previewPurge`, dữ liệu tải và Thùng rác lớn.
- `probe-purge-kept.mjs` — Thùng rác có lịch bị giữ; so counts / kept.
- `probe-purge-real.mjs` — dọn thật, so số hộp với số dòng mất.
- `probe-restore-purge.mjs` — khôi phục KH rồi dọn.
- `probe-kept-chain.mjs` — chuỗi giữ lại lịch → nhân sự → team; dọn và kiểm 3 dòng còn.
- `probe-8d-report.mjs` — 8d dời tháng vs `reportRows`.
- `probe-person-label.mjs` — hai nhân sự cùng tên (DSR4-E1).
- `probe-perf-purge.mjs`, `probe-perf-list.mjs` — số ở mục 6.
- `mutate.mjs` — thay một chuỗi duy nhất; mỗi lần chép file sang `*.bak`, chạy, chép lại, `git status --short` rỗng.

### Đột biến (11, cả 11 bị giết)

| Mã | File / thay đổi | Test đỏ |
|---|---|---|
| M1 | `trash-view.ts`: `restoreLabel` bỏ `recordBadge(row)?.text` | `trash-view.test.ts` 7/78 |
| M2 | `trash-view.ts`: câu E20 theo `params.date === formatDate(row.date)` thay cờ `sameDay` | `trash-view.test.ts` 1/78 |
| M3 | `appointment-form.ts`: bỏ `previousYearSuggestion` | `appointment-form.test.ts` + `DateSuggestion.test.tsx` 2/28 |
| M4 | `SettingsTrash.tsx`: `purgeReminder(shown.length)` | e2e D12 (1 đỏ, có retry) |
| M5 | `EditOutcomeDialog.tsx`: `editedDay(…, { ...a, status: 'CANCELLED' }, day)` | e2e E19 (1 đỏ, có retry) |
| M6 | `trash-view.ts`: `purgeFailure` bỏ nhánh `failedUnsaved` | `trash-view.test.ts` 1/78 |
| M7 | `Settings.tsx`: 10c `counts.customers + 1` | e2e 10c (1 đỏ, có retry) |
| M8 | `policy-form.ts`: bỏ dòng `count` của 8d | `policy-form.test.ts` 2/24 |
| M9 | `appointments-view.ts`: `dayLabel` bỏ `parts` | `appointments-view.test.ts` 2/42 |
| M10 | `stage-chart.ts`: bảng ẩn chỉ còn 1 nhóm | `stage-chart.test.ts` 5/17 |
| M11 | `PeriodPicker.tsx`: áp dụng ở mọi lần blur | e2e "focus leaves both date fields" (1 đỏ, có retry) |

Ghi chú chạy e2e: `CI=1`, Edge, cổng 4173, `--output` trỏ ra ngoài repo vì shim `safe-delete` của app từ chối xóa 135 file trong `test-results` (> 50) — lỗi môi trường, không phải repo. Mỗi lần Playwright dựng lại `dist` bằng `pnpm build:web` với `VITE_DEMO_ANCHOR` (cấu hình `playwright.config.ts`).

### Lệnh chính

- `node node_modules/vitest/vitest.mjs run apps/desktop/src/routes/{appointments,overview,reports} apps/desktop/src/routes/trash-view.test.ts apps/desktop/src/routes/customers/policy-form.test.ts` → 14 file, **325 passed** (21:31).
- `CI=1 node node_modules/@playwright/test/cli.js test e2e/{demo-data,trash,appointment-outcome}.spec.ts --project=edge` → **37 passed** (51,9 s).
- `CI=1 … test e2e/{customer-policies,appointments}.spec.ts` → **45 passed** (42,3 s).
- `CI=1 … test e2e/period-picker.spec.ts` → **13 passed** (26,2 s).
- `node --import ./tools/ts-hooks.mjs E\probe-*.mjs` — các probe ở trên.

### `git status --short` cuối phiên (2026-10-30 22:11 +07:00)

```
(rỗng)
```

`git rev-parse HEAD` → `2e51e25eb0125f56d3d938b97ef18d6873dae076`.
