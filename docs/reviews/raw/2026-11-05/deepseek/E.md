XONG — deepseek gói E lượt 5, 12:21 05/11/2026

# Deep review Phase 1–6, lượt 5 — DeepSeek, gói E (Lịch hẹn, chỉ số, quản lý)

## 1. Bên, gói, SHA, môi trường

- Bên: `deepseek` (ID phát hiện `DSR5`), gói **E**, lượt 5. Làm mới (E.md chưa có trước phiên; A–D đã `XONG`).
- Repo: `C:\workspace\Project-2C-review`, detached `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`git rev-parse HEAD` lúc 11:59 và lúc 12:17).
- `git status --short` đầu phiên: **rỗng**; cuối phiên: **rỗng** (mục 9).
- Giờ bắt đầu: 11:59 05/11/2026 (+07:00). Giờ xong: 12:21.
- App: WorkBuddy **v5.9.4**; Expert **CodeReviewExpert**; model **DeepSeek-V4.1-Flash** (bản 1017), reasoning **Max**, context **1M** (Owner ghi ở `common\baseline.md`); mức suy luận của phiên: Max.
- Node: `"C:\Program Files\nodejs\node.exe" --version` → **v24.20.0**; mọi lệnh `node` / vitest / Playwright đặt `C:\Program Files\nodejs` lên đầu PATH trong chính lệnh đó. Shell mặc định của app là Node v22.22.2 (không dùng).
- Công cụ: đọc file, Bash/PowerShell, Agent phụ (không dùng), Playwright 1.63 (Edge) trên bản build web ở `apps/desktop/dist`, vitest, `tsc`, `check-tokens.ts`.

## 2. Bảng R

### 2.1 Bảng R1 — theo mã (7 dòng của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-37 | #790 → #845, #901 → #920 | **ĐÃ SỬA** | `node --import tools/ts-hooks.mjs packages/ui/scripts/check-tokens.ts apps/desktop/src packages/ui/src/components` → "Design tokens: no styling that bypasses the tokens…", exit 0, **không dòng nào** về dấu nối; grep `·`, `—`, `–`, `×`, `←`, `…`, `join(', ')` trong JSX của gói E: chỉ còn trong comment; `FilterBar.tsx:79` dùng `t('sep.dot')`. | Vị trí đầu tiên của lượt 1 (`"{trường}: {giá trị}"`, `CustomerKyc.tsx:95`) thuộc gói D — gói E không có chỗ nào như vậy. Bộ chặn bắt cả 6 ký hiệu đặt lại (ca của `token-guard.test.ts`). |
| DR6-148 | #902 → #922 (+ #932 → #941, #951 → #958) | **ĐÃ SỬA** | e2e `long-names.spec.ts`: "a team of 160 letters keeps So sánh team…" và "an RE and a team of 160 letters leave the figures of Báo cáo readable…" xanh (58 ca của gói, 1,1 phút). Gỡ `max-w-60` của `ReportTable.tsx:29` → ca Báo cáo đỏ ("Theo team at 1100"). | Bốn chỗ của DR6-148: (a) `Dialog` (D), (b) Team (D), (c) `TeamCompare` — `NAME` + `items-baseline` + `shrink-0` cho mũi tên, (d) `ReportTable` — `block w-max max-w-60 whitespace-normal wrap-anywhere`. Tên thường không đổi hình (PR chụp 12 trạng thái, trùng byte). |
| DR6-150 | #903 → #924 (+ #933 → #946, #951 → #958) | **ĐÃ SỬA** | Unit: đổi `readCaseSize` về `text.trim()` → `outcome-form.test.ts` **2 ca đỏ**. E2e ca "a field of invisible characters alone reads as empty…" (6b ngày, 6b Giờ, 6c Case size, 6c ngày hẹn tiếp, 6e ngày mới) xanh. Đổi `pending` của 6b (`AppointmentDialog.tsx:102`) về `dateText.trim()` → chính ca e2e đó **đỏ** (`expect(locator).not.toHaveAttribute()`). | Ba `pending` (6b `AppointmentDialog:102`, 6c `OutcomeDialog:216`, 6e `RescheduleFields:75`) và `readCaseSize` đều đọc `normalizeText`. `parseTime` cùng luật (T-332/T-337). **Còn một chỗ chưa theo: hộp Hợp đồng** — DSR5-E1. |
| DR6-151 | #903 → #924 (+ #933 → #946) | **ĐÃ SỬA** | Unit `trash-view.test.ts`: 3 ca mới (mã KH khi trùng tên **và** nhóm; nhân sự có vai trò + team; trùng tên khác nhóm vẫn khác nhau). Gỡ nhánh `coded` của `restoreLabel` → 1 ca đỏ; gỡ `recordDetail` + team của nhân sự → 2 ca đỏ. E2e `trash.spec.ts:637` ("two customers of one name and one stage…") xanh. Kịch bản S6 (mục 4): hai KH trùng tên nhận `(K-XAAA)` / `(K-WWS5)`. | `codedCustomers` đọc **mọi** dòng, không theo bộ lọc (`SettingsTrash.tsx:303`). Khóa `${stage}|${name}` không nhập nhằng được vì `stage` là tập đóng. Giới hạn còn lại: hai **nhân sự** trùng cả tên, vai trò và team vẫn trùng tên nút — Q3(a) chỉ chốt nội dung tên nút (luôn có vai trò + team), không chốt duy nhất; ngoài phạm vi, không có ca. |
| DR6-152 | #903 → #924 | **ĐÃ SỬA** | `trash-view.ts:552` `const PURGE_REMINDER = 1_000;` (không `export`); `git grep PURGE_REMINDER` toàn repo: chỉ 3 dòng trong chính file (khai báo + 2 comment); `tsc -p apps/desktop --noUnusedLocals --noUnusedParameters` sạch. | `purgeReminder()` vẫn dùng hằng; test viết thẳng `1_000` như trước. |
| DR6-153 | #903 → #924 | **ĐÃ SỬA** | (a) đổi câu từ chối Nhập backup (`SettingsBackup.tsx:215-217`) về `settings.backup.failed` → `save-state.spec.ts:126` ("Nhập backup, refused after a failed save…") **đỏ** (`toHaveText`). (b) giấu huy hiệu nhóm trong ô "Bản ghi" (`SettingsTrash.tsx:56`) → `trash.spec.ts:197` **đỏ** (`toBeVisible`). | Hai ca đều mới trong đợt này; (b) đọc chính phần tử huy hiệu rồi so với tên nút nên giữ cả hai chiều. |
| DR6-154 | #903 → #924 (+ #933 → #946, #951 → #958) | **ĐÃ SỬA** | Gỡ `useEffect` focus của `ConfirmButton` (`ConfirmWordDialog.tsx:24-26`) → `dialog-keyboard.spec.ts:150` ("a second Escape does not close the dialog of a running reload") **đỏ** (`toBeFocused`); ca này nộp bằng **Enter từ ô chữ**, đúng đường làm focus rơi. `trash.spec.ts:662` kiểm focus + `toBeDisabled` + bấm lại không chạy lần hai (đếm `window.exe.events` = 1 backup); `dialog-keyboard.spec.ts:186` cho 10a. | Hai ca nộp bằng **bấm nút** (`trash:662`, `dialog-keyboard:186`) vẫn xanh khi gỡ effect — focus vốn đã ở nút nên chúng không phủ đường Enter; đường đó do ca 150 giữ. Đã thử cả ba ca với đột biến, chỉ ca 150 giết được. |

### 2.2 Bảng R2 — theo Issue (5 dòng của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-331 | #932 → #941 | **ĐÃ SỬA** | Unit `apps/desktop/src/ui-datatable.test.tsx` ("positions the header cell of a hidden heading…"): gỡ `${hidden ? 'relative' : ''}` ở `DataTable.tsx:178` → **đỏ**. E2e "a TL of 160 letters keeps Đổi tên team and Xóa team in the card of the team" (kiểm thêm `lineTops('Team Bình Minh').length === 1`) và "a customer name of 81 letters breaks inside the subtitle…" xanh. | `DataTable` giữ `relative` ở `th` của cột `headerHidden`; khung cuộn của Team đã bỏ `relative`. Mũi tên/số đếm `items-baseline` đo ≤ 3 px. |
| T-332 | #933 → #946 | **ĐÃ SỬA** | Unit: `parseTime` với `text.trim()` → 2 ca đỏ; `readsBackAsIs` bỏ điều kiện U+FEFF (`packages/db/src/common.ts:97`) → `common.test.ts` 1 ca **đỏ**. E2e `dialog-keyboard.spec.ts:225` ("the dialogs of a chosen backup give the focus back to "Chọn file…"") xanh; `trash.spec.ts:706` (câu D7 + "Thử lại") xanh. Một khóa `customer.withCode` (`vi.ts:78`) dùng ở `restoreLabel` (`trash-view.ts:227`) và `inUseHelp` (`team-view.ts:133`). | Bốn ô đọc qua `parseTime` (6b, giờ hẹn tiếp của 6c, giờ ở Sửa kết quả, 6e) đều chỉ đọc kết quả hàm này — đã kiểm bằng grep + kịch bản S5. |
| T-337 | #951 → #958 | **ĐÃ SỬA** | Unit `parseTime`: `\u200B14:00` → `14:00`, `14\u2060:00` → `14:00`, `\u200B24:00` → lỗi; gỡ `normalizeText` → đỏ. Unit `ui-button.test.tsx` ("looks off once `aria-disabled`, as once `disabled`"): gỡ cặp `aria-disabled:cursor-default aria-disabled:opacity-50` ở `Button.tsx:25` → **đỏ**. E2e tiêu đề team một dòng xanh. | `git grep "aria-disabled:"` trong `apps/`: 0 (hai nút gọi không còn `className`). CSS của bản build có luật `[aria-disabled=true]` (ca e2e kiểm `opacity` 0.5). |
| T-350 | #1001 → #1011 | **ĐÃ SỬA** | Unit `trash-view.test.ts`: 4 ca (Dự kiến trước hôm nay → "Chưa ghi kết quả", có/không giờ; hôm nay hoặc sau → "Dự kiến"; trạng thái khác không đổi; E11 với DB thật). Đổi `statusLabel(row, today).text` về `t('appointmentStatus.…')` → **4 ca đỏ**. E2e `trash.spec.ts` xanh. Kịch bản S1: dòng "10/09/2026 · Chưa ghi kết quả", hộp khôi phục "Chưa ghi kết quả". Mockup `trash.html:192` đã sửa theo hướng (a). | `recordTitle`/`restoreView`/`restoreLabel` nhận `today`; `RestoreDialog` dùng `useToday()`; cột `Bản ghi` của `DataTable` nhận `today` qua `trashColumns`. Không đổi trạng thái lưu, khung hệ quả, luật khôi phục. |
| T-353 | #1005 → #1009 | **ĐÃ SỬA** (tài liệu) | Dòng NT-LH-19 (`nghiem-thu-v1.md:134`) và NT-LH-28 (`:143`) có, khớp app: `parseQuickDate('29/02', 15/09/2026)` → `{ok:false, error:'invalid-date'}` **không** `nextYearSuggestion`; `('29/02', 29/03/2027)` → như trên; `('29/02', 30/04/2027)` → `nextYearSuggestion 29/02/2028`. "Lệch mockup đã biết" có mục "Hộp 6b, `29/02`…" (`:397`). | NT-LH-28: `RescheduleFields.tsx:139` hiện `reschedule.historyRead` khi có lý do, không xét ngày; `priorMeetings` lọc `isPastOrToday` (NT-LH-17). |

## 3. Phạm vi đã đọc

Diff `2e51e25..37a80b6` của gói: **13 file SP (+178 / −61)** và **3 file test (+200 / −56)** — đọc trọn từng diff, rồi đọc trọn file ở `37a80b6`:

- `routes/trash-view.ts` (709), `routes/SettingsTrash.tsx` (407), `routes/RestoreDialog.tsx` (69), `routes/ConfirmWordDialog.tsx` (105), `routes/SettingsBackup.tsx` (302), `routes/SettingsDataFile.tsx` (134), `routes/Settings.tsx` (189), `routes/Overview.tsx` (61), `routes/FilterBar.tsx` (84), `routes/applied-filter.ts` (51), `routes/period-labels.ts` (26);
- `routes/appointments/`: `appointment-form.ts` (169), `appointments-view.ts` (472), `outcome-form.ts` (235), `AppointmentDialog.tsx` (476), `OutcomeDialog.tsx` (343), `EditOutcomeDialog.tsx` (266), `RescheduleFields.tsx` (146), `RescheduleDialog.tsx` (60), `DeleteAppointmentDialog.tsx` (128), `MetFields.tsx` (163), `AppointmentAi.tsx` (99), `YearGrid.tsx` (141), `AppointmentsScreen.tsx` (đọc phần cột, chi tiết, `EDITABLE`, `Detail`);
- `routes/overview/`: `TeamCompare.tsx` (126), `overview-view.ts` (252), `team-compare-view.ts` (129), `stage-view.ts` (158), `stage-chart.ts` (197), `OverviewTiles.tsx` (76), `StageBlock.tsx` (171);
- `routes/reports/`: `ReportTable.tsx` (152), `ReportsScreen.tsx` (112), `ReportExport.tsx` (96), `reports-view.ts` (402), `report-workbook.ts` (230);
- `routes/customers/`: `PolicyDialogs.tsx` (340), `policy-form.ts` (275), `CustomerPolicies.tsx` (116);
- Test của gói: `trash-view.test.ts` (+175/−55), `appointment-form.test.ts`, `outcome-form.test.ts`; `ui-datatable.test.tsx`, `ui-button.test.tsx` (qua đột biến);
- Ngoài gói, chỉ đọc chỗ gói nối vào: `packages/db/src/{common,backup,database,appointments,customers}.ts` (chữ ký), `packages/ui/src/components/{DataTable,Button}.tsx`, `packages/domain/src/{period,text,appointment-counts}.ts`, `apps/desktop/src/data/{AppDataContext,tables}.ts`, `i18n/vi.ts`, `docs/design/mockups/trash.html`, `docs/testing/nghiem-thu-v1.md` (dòng NT-LH-19/28, "Lệch mockup đã biết");
- Tài liệu: `common\{plan,known,fixes,baseline}.md` (phần của E), tổng hợp lượt 4 §3.1, §6.4, §6.5, §7.1.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| S1 | Lịch Dự kiến **10/09/2026** (đã qua) → xóa → Thùng rác → đọc dòng "Bản ghi" → mở hộp khôi phục → Hủy → Dọn sạch | Dòng "10/09/2026 · Chưa ghi kết quả" (không "Dự kiến"); hộp khôi phục "Trạng thái: Chưa ghi kết quả"; hộp dọn sạch "1 bản ghi · Lịch hẹn"; sau dọn "Thùng rác trống". Không lỗi | — |
| S2 | Dán `U+200B U+0085 U+2060` vào ô **Ngày** của 6b rồi bấm Tạo | Không `aria-invalid`, không câu lỗi; bấm Tạo mới hiện "Nhập ngày." — đúng luật DR6-150 | — |
| S3 | Dán cùng chuỗi đó vào ô **Ngày nộp** của hộp Hợp đồng mới (8a) | Ô trông trống nhưng hiện ngay `aria-invalid="true"` + "Nhập ngày." **trước khi bấm Lưu**; ô **FYP nộp** cùng hiện tượng ("Chưa nhập số tiền."). Khác 6b | **DSR5-E1** |
| S4 | Dán cùng chuỗi đó vào ô **Giờ** của 6b, rồi Giờ của hộp **Sửa kết quả** (6f) | Cả hai: không lỗi, lưu được, lịch không có giờ (`EDIT TIME {"value":"…","invalid":null}`) | — |
| S5 | Ghi kết quả Đã gặp → **Sửa kết quả** → Giờ chỉ có ký tự vô hình → Lưu | Hộp đóng, không lỗi, giờ thành rỗng — bốn ô của `parseTime` cùng hành vi | — |
| S6 | Tạo 2 KH cùng tên "Lâm Thị Trùng" (cùng N4) → xóa cả hai → Thùng rác → khôi phục một | Hai nút: "Khôi phục KH Lâm Thị Trùng (K-XAAA) · N4" / "(K-WWS5) · N4"; sau khi khôi phục một, nút còn lại **bỏ mã** ("… Trùng · N4") — nhãn theo Thùng rác hiện tại | — |
| S7 | Dọn sạch: gõ DỌN SẠCH rồi **Enter từ ô chữ** (không bấm nút) | Ở bản web, 1 bản ghi: dọn xong trước khi kịp đọc trạng thái chạy; nhật ký focus chỉ có `out INPUT → in DIV(thông báo)` — không có bước focus nút "Đang dọn…" (không quan sát được ở web, xem R1 DR6-154) | — |

## 5. Phát hiện mới

```
ID: DSR5-E1
Mức: Low
Trục: E
Vị trí: apps/desktop/src/routes/customers/PolicyDialogs.tsx:79 (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-150 / T-332 (ô chỉ có ký tự vô hình) · có từ trước, lượt 1–4 bỏ sót (DR6-150 chỉ liệt kê ô Case size và ba `pending` của 6b/6c/6e)
Kịch bản: S3
Mô tả: Hộp Hợp đồng (8a/8b/8c/8d) hỏi "ô này có trống không" bằng `text.trim()` trong `shown()`
  (`PolicyDialogs.tsx:79`), nên một ô chỉ có ký tự vô hình (U+200B / U+0085 / U+2060 dán vào) bị coi là
  **có chữ**: ô trông trống nhưng hiện ngay lỗi bắt buộc ("Nhập ngày." / "Chưa nhập số tiền.") trước khi
  người dùng bấm Lưu. Bốn ô của hộp lịch hẹn cùng cảnh đã đọc bằng `normalizeText` từ #924 / #946.
Tái hiện / bằng chứng: probe Playwright trên bản build web (dist ở 37a80b6, neo 15/09/2026), mở hồ sơ KH
  có lịch Đã gặp → "+ Hợp đồng" → dán `\u200B\u0085\u2060` vào "Ngày nộp":
    POLICY DAY  {"value":"​⁠","invalid":"true","lines":["Nhập ngày."]}
    POLICY FYP  {"value":"​⁠","invalid":"true","lines":[]}
  Cùng thao tác ở 6b: APPOINTMENT DAY {"invalid":null,"lines":[]}.
  Nguồn: `deepseek\E\pw\probe.spec.cjs` (mục 9).
Ảnh hưởng: người dán ngày / số tiền từ Word, PDF hay email (chuỗi hay kèm U+200B) thấy hộp Hợp đồng báo
  lỗi trên một ô trông như chưa nhập; không chặn đường nào (bấm Lưu vẫn ra đúng lỗi đó), không sai dữ liệu.
Đề xuất: `shown` đọc `normalizeText(text) === ''` (thêm import `normalizeText` từ `@p2c/domain`), như
  `readCaseSize` / `pending` của 6b; hoặc dùng lại đúng biểu thức `pending` của 6b cho bốn ô. Cỡ ≤ 5 dòng.
```

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đo | Trên | Kết quả | ID |
|---|---|---|---|
| `tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | toàn app (gồm mọi file E) | exit 0, **0 cảnh báo** | — |
| Quét export không ai dùng: mọi `export function/const/class` của 32 file E, `git grep -l` ngoài file khai báo | `apps`, `packages`, `e2e`, `tools` | **0 export chết** (`deepseek\E\unused-e.mjs`) | — |
| `git grep PURGE_REMINDER` | repo | 3 dòng, đều trong `trash-view.ts` (DR6-152 đã đóng) | — |
| `git grep "aria-disabled:"` | `apps/` | 0 (dấu vết chép class của T-337 đã hết) | — |
| Đọc `trashColumns` / `TeamCompare` / `ReportTable` | E | `CELL` còn dùng qua `FIGURE` / `NAME`; không nhánh chết, không abstraction một chỗ | — |
| Đếm khóa i18n dùng trong E (`keys-e.mjs`): mọi `t('…')` literal phải có trong `vi.ts` | 32 file E | **0 khóa thiếu**; 33 họ khóa dựng bằng template (đều là `stage.`, `appointmentStatus.`, `trigger.`, `weekday*.`, `date.error.`, `overview.kpi.`) | — |

Không thấy code chết hay lặp ≥ 3 nơi mới trong gói. Ba `pending` của 6b/6c/6e vẫn là ba biểu thức giống nhau (`normalizeText(x) === '' && !attempted`) — đúng chỗ để gộp, nhưng là *Duplicated Code* đã biết từ trước và mỗi chỗ một tên biến khác (`dateText`, `nextDateText`, `form.dateText`); không đề xuất (chi phí đọc > lợi).

### 6.2 Hiệu năng

Máy **Home PC `DESKTOP-KDURKJP`**, Node **v24.20.0**, không chạy gì song song (12:10–12:15). Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` (nhập bằng `importBackup`, không persist); Thùng rác lớn = 113 dòng + 1 200 KH xóa thêm = **1 313 dòng** (đúng cỡ của `baseline.md`). Nguồn: `deepseek\E\perf-e.mjs`, trung vị (min–max) của 5 lần.

| Đo | Dữ liệu | Số | So mốc |
|---|---|---|---|
| `listTrash` | 113 dòng | 20,5 ms (19,1–25,9) | `baseline.md` (cùng máy, lượt 5): 24,6 ms → không xấu hơn |
| `codedCustomers` (mới, DR6-151) | 113 / 1 313 dòng | 0,0 / **0,6 ms** (0,6–0,7) | không có mốc riêng; 0,6 ms trên 1 313 dòng |
| `trashCounts` / `filterTrash(all)` / `purgePlan` | 1 313 dòng | 0,0 / 0,0 / 0,1 ms | như lượt 4 (hàm không đổi) |
| `recordTitle` cho mọi dòng (thêm `statusLabel`) | 1 313 dòng | 0,1 ms | thêm một lời gọi `appointmentGroup` mỗi dòng; không đo được chi phí |
| `restoreLabel` cho mọi dòng (thêm mã KH + vai trò/team) | 1 313 dòng | **1,0 ms** (1,0–1,5) | mới; 1,0 ms cho cả bảng |
| `appointmentRows(all)` (màn Lịch hẹn) | 10 255 lịch | 3,4 ms (2,8–3,7) | không đổi ở đợt này |
| Sắp bảng Lịch hẹn theo tên KH (`byName`, 10 255 dòng) | 10 255 lịch | 11,9 ms (11,8–12,2) | probe của tôi khác cách đo của DR6-136 (9,4 ms) — **không so trực tiếp**; DR6-136 thuộc A/F |
| `statusLabel` cho mọi dòng | 10 255 lịch | 0,7 ms | — |

Trên exe (số của `baseline.md`, cùng máy, SHA ghim): `trash.open` 33 ms (mốc 34), `trash.kind-appointments` 8 ms (mốc 6; dưới ngưỡng 200 ms, trong luật nhiễu), `reload.appointments` 391 ms, `reload.overview` 407 ms, `reload.reports` 371 ms (ngưỡng < 500 ms), `appointments.next-month/year` 111 / 108 ms (≤ 300 ms), Dọn sạch 128,0 ms (≤ 500 ms). **Không dòng nào xấu hơn mốc sau #656 hay G7.** Gói E không có phát hiện P.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | | 0 |
| High | | | | | | | | | | | 0 |
| Medium | | | | | | | | | | | 0 |
| Low | | **1** | | | | | | | | | 1 |
| Nit | | | | | | | | | | | 0 |
| **Tổng** | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** |

Tỉ lệ PLAUSIBLE: **0 / 1** (DSR5-E1 đã dựng bản web và đo trên DOM). Hai mục "R1/R2" không tính là phát hiện (mục 2).

## 8. Đã xét, không thấy

- **R:** 7 dòng R1 + 5 dòng R2 ở mục 2, mỗi dòng có đột biến hoặc ca chạy lại. Không dòng nào HỒI QUY; không dòng nào SỬA MỘT PHẦN.
- **E:** ngày (29/02 ở 2026 / 2027 / 2027-04-30; cuối năm; nửa đêm — `useToday` có watcher, `RestoreDialog` đọc lại ngày), chuỗi (tên 81/160 chữ, tên có `|` cho khóa `codedCustomers`, tên trùng), số (0 / âm / trần 100 tỷ ở FYP — `readFyp`), hai thao tác chồng (dọn sạch khi có dòng bị giữ; khôi phục khi bản ghi đã đổi), dán ký tự vô hình vào 6 ô (S2–S5). Không thấy lỗi mới ngoài DSR5-E1.
- **C:** đọc lại hợp đồng của `recordTitle`/`restoreView` (spec Phase 6 §4.2), mockup `trash.html` 11a/11b/11i sau T-350, `team-compare-view`/`reports-view` theo mockup 1a/2b; nhãn "Chưa ghi kết quả" khớp nghĩa thường ở 6a, danh sách, chi tiết, hộp xóa, hộp dời, Thùng rác, chỉ số. Không thấy lệch mới.
- **D:** không có lệnh ghi nào bị đổi trong gói; `restoreView`/`restoreLabel` chỉ đọc. `recordTitle` đổi theo `today` không ghi gì. Không thấy.
- **G:** gói E không chạm AI.
- **S:** không có đường dẫn file / mạng / key trong gói; `SettingsBackup` chỉ đọc file người dùng chọn (đã có ở lượt trước).
- **P:** mục 6.2 — không phát hiện; mọi số trong ngưỡng, số mới (codedCustomers 0,6 ms; restoreLabel 1,0 ms) không đáng kể.
- **B:** mục 6.1 — 0 export chết, 0 khóa i18n thiếu, `tsc` unused sạch.
- **T:** 12 đột biến, **12 bị giết** (mục 9). Ca của DR6-154 chỉ giết được bằng đường Enter (`dialog-keyboard:150`), hai ca bấm nút không giết — đã ghi ở dòng R1; không phải lỗ test vì đường lỗi có ca.
- **A:** `aria-label` của nút khôi phục (DR6-151) đọc đúng; `aria-disabled` của `Button` (T-337) có `cursor` + `opacity`; nút "Đang …" giữ focus và tên đổi tại chỗ (trình đọc màn hình đọc lại vì phần tử đang focus); `role="status"` cho thông báo sau khôi phục/dọn sạch. Không thấy lỗi mới.

## 9. Phụ lục

**Probe / script (trong `deepseek\E\`):**

| File | Việc |
|---|---|
| `mutate.mjs` | vá 1 file, chạy 1 file vitest, trả nguyên byte + so sha256 |
| `mutate-pw.mjs` | vá 1–2 file, chạy e2e theo `-g`, trả nguyên byte + so sha256 |
| `perf-e.mjs` | số của mục 6.2 (Node 24, `ts-hooks`, dữ liệu tải) |
| `unused-e.mjs`, `keys-e.mjs` | quét export chết / khóa i18n thiếu |
| `pw\` | harness Playwright riêng: `serve.mjs` (vite preview cổng **4319**, không build lại), `playwright.config.cjs`, `probe.spec.cjs` (S3/S2), `scenarios.spec.cjs` (S1, S4, S5, S6), `enter.spec.cjs` (S7) |

Bản build web dùng cho probe: `apps/desktop/dist` do `e2e/serve.mjs` dựng trong lượt e2e của gói này, **có** `VITE_DEMO_ANCHOR=15/09/2026` (do `playwright.config.ts` đặt). E2e của gói: `node node_modules/@playwright/test/cli.js test e2e/{trash,dialog-keyboard,long-names,save-state,appointment-outcome}.spec.ts --project=edge --no-deps --output …\deepseek\E\pw` → **58 passed (1,1 phút)**, không flaky.

**Đột biến (12/12 bị giết):**

| # | Vị trí | Đột biến | Test giết |
|---|---|---|---|
| M1 | `outcome-form.ts` `readCaseSize` | `normalizeText` → `trim` | `outcome-form.test.ts` 2 ca |
| M2 | `appointment-form.ts` `parseTime` | `normalizeText` → `trim` | `appointment-form.test.ts` 2 ca |
| M3 | `trash-view.ts` `recordTitle` | `statusLabel` → `t(appointmentStatus.…)` | `trash-view.test.ts` 4 ca |
| M4 | `trash-view.ts` `restoreLabel` | bỏ nhánh `coded` | `trash-view.test.ts` 1 ca |
| M5 | `DataTable.tsx:178` | bỏ `relative` của `th` ẩn | `ui-datatable.test.tsx` |
| M6 | `Button.tsx:25` | bỏ cặp `aria-disabled:` | `ui-button.test.tsx` |
| M7 | `trash-view.ts` `restoreLabel` | bỏ vai trò + team của nhân sự | `trash-view.test.ts` 2 ca |
| M8 | `ConfirmWordDialog.tsx:24` | bỏ `focus()` khi chạy | `dialog-keyboard.spec.ts:150` (Enter từ ô chữ) — hai ca bấm nút vẫn xanh |
| M10 | `AppointmentDialog.tsx:102` | `normalizeText` → `trim` | e2e DR6-150 |
| M11 | `ReportTable.tsx:29` | bỏ `max-w-60` | e2e "figures of Báo cáo readable" |
| M12 | `packages/db/src/common.ts:97` | bỏ điều kiện U+FEFF | `common.test.ts` 1 ca |
| M13 | `SettingsBackup.tsx:215` | câu `failedUnsaved` → `failed` | `save-state.spec.ts:126` |
| M14 | `SettingsTrash.tsx:56` | giấu huy hiệu nhóm | `trash.spec.ts:197` |

Mọi lần vá đều trả file về nguyên byte (`restored=true` + sha256 trùng). `git status --short` cuối phiên: **rỗng**; `git rev-parse HEAD`: `37a80b662861d308a110d1e2b0f65ad13b91fb51`.

**Giờ xong:** 12:21 05/11/2026 (+07:00).
