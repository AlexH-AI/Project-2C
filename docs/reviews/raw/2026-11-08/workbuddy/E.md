XONG — workbuddy gói E lượt 6, 13:14 08/11/2026

# Báo cáo deep review Phase 1–6, lượt 6 — gói E (Lịch hẹn, chỉ số, quản lý), bên workbuddy

## 1. Bên, gói, môi trường

- **Bên / gói:** workbuddy, gói **E — Lịch hẹn, chỉ số, quản lý** (`routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar,ConfirmWordDialog}.tsx` trừ `SettingsAi.tsx`, `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng `routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`). Reviewer độc lập, chỉ đọc (ADR-0001 phụ lục M13); không làm bảng R1 / R2 (mọi dòng R là KNOWN theo `common\known.md` phần 4, 5).
- **SHA đầu phiên:** `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD`), đúng SHA ghim `5b1328a`.
- **`git status --short` đầu phiên:** rỗng.
- **Giờ bắt đầu:** 13:04 08/11/2026; **giờ xong:** 13:14 08/11/2026 (máy `DESKTOP-KDURKJP`, Home PC, GMT+7).
- **Công cụ:** app desktop WorkBuddy (bản quốc tế; `common\baseline.md` không ghi số bản mới — Owner đã đăng xuất app lúc ≈ 11:02 07/11; không đọc thư mục dữ liệu app). Shell Git Bash / PowerShell của app, công cụ đọc / ghi file, công cụ Agent phụ (không dùng: mọi việc của gói làm trực tiếp).
- **Expert:** `CodeReviewExpert`.
- **Model:** **Hy4** — Owner chọn cho gói A–F lúc ≈ 23:35 07/11 (`common\baseline.md`). Ngữ cảnh phiên ghi `claude-opus-6`, định danh hệ thống WorkBuddy AI / Tencent Hunyuan Hy; không đọc được giao diện app nên không khẳng định thêm.
- **Context:** không thấy trong ngữ cảnh phiên.
- **Mức suy luận:** không thấy trong ngữ cảnh phiên.
- **Bản Node đã dùng:** `v24.20.0` — lệnh đầu phiên có `export PATH="/c/Program Files/nodejs:$PATH"` rồi `node --version` → `v24.20.0` (≥ 24). Mọi lệnh có `node` / vitest đều đặt PATH ngay trong lệnh. Không chạy Playwright, không chạy `pnpm`.
- **Chế độ quyền của app:** không đổi; không cài skill, không connector, không mạng ngoài, không `gh`, không đọc thư mục cấm.

## 2. Bảng R1 / R2

Không áp dụng: theo `common\prompt-workbuddy.md` (Việc của gói mục 1) và `common\known.md` phần 4, 5, **Codex, agent WorkBuddy và Claude G–I không làm bảng R**; mọi dòng R1 (DR6-158…177) và R2 (T-371…T-384) là KNOWN. Gói E của workbuddy chỉ tìm lỗi mới và edge case mới.

## 3. Phạm vi đã đọc

### Diff `37a80b6..5b1328a` của gói E

`git -C C:\workspace\Project-2C-review diff -M 37a80b6 5b1328a -- <12 file sản phẩm + 2 file test của gói>` → **752 dòng**, lưu nguyên ở `workbuddy\E\diff-E.diff`, đã đọc hết. Số dòng khớp `baseline.md`: sản phẩm **12 file, +274 / −80**; test **2 file, +334 / −10**.

Thay đổi sản phẩm, đọc kỹ nhất:
- `routes/trash-view.ts` +167 / −35 — `toldApart` (thay `codedCustomers`), `byDeletion`, `teamsDeletedAt`, `goneText`, `deletionWords`, `ownerParts(row, teams)`, `blockedReason(row, block, teams)`, `restoreLabel(row, told, today)`, `ofCustomer(…, coded)`, `deletedAtText(row, {seconds})`; hai ô tìm đổi sang `searchText` (DR6-172).
- `routes/SettingsTrash.tsx` +59 / −23 — `told` / `teams` tính trên mọi dòng, `RecordCell` / `OwnerCell` nhận `teams`, `NAMED` + `wrap-anywhere` (DR6-170), `RestoreDialog` nhận `teams`.
- `routes/RestoreDialog.tsx` +6 / −3 — truyền `teams` xuống `restoreRow`.
- `routes/appointments/appointment-form.ts` +7 / −4 — `searchCustomers` đổi sang `searchText`; `routes/appointments/AppointmentDialog.tsx` +1 / −1 — ô tìm hỏi trống bằng `normalizeText` (DR6-172).
- `routes/customers/PolicyDialogs.tsx` +4 / −2 — `shown()` hỏi trống bằng `normalizeText` (DR6-173).
- `routes/appointments/AppointmentsScreen.tsx` +18 / −8, `routes/FilterBar.tsx` +2 / −1, `routes/overview/StageBlock.tsx` +4 / −1, `routes/reports/ReportTable.tsx` +3 / −0, `routes/reports/ReportsScreen.tsx` +2 / −1, `routes/customers/CustomerPolicies.tsx` +1 / −1 — chỉ thêm `wrap-anywhere` / `max-w-60` / `CELL_NAME` (DR6-170), trừ `ReportTable.tsx` (chỉ comment).

Commit của gói (`git log --oneline 37a80b6..5b1328a -- apps/desktop/src/routes`): `509b785` (T-365), `dd5ae56` (T-367), `e9f2eb1` (T-368), `e0806b8` (T-375, phần gói C), `20c51e3` (T-377), `64720db` (T-376, phần gói D), `5d07d5e` (T-380), `4d38a72` (T-382).

### `common\files-E.txt`

52 file: **38 sản phẩm, 14 test**. **Đọc hết 38 / 38 file sản phẩm** (không đọc lướt): `ConfirmWordDialog`, `FilterBar`, `Overview`, `RestoreDialog`, `Settings`, `SettingsBackup`, `SettingsDataFile`, `SettingsTrash`, `applied-filter`, `appointments/{AppointmentDialog,AppointmentsScreen,DeleteAppointmentDialog,EditOutcomeDialog,MetFields,OutcomeDialog,RescheduleDialog,RescheduleFields,YearGrid,appointment-form,appointments-view,outcome-form}`, `customers/{CustomerPolicies,PolicyDialogs,policy-form}`, `overview/{OverviewTiles,StageBlock,TeamCompare,overview-view,stage-chart,stage-view,team-compare-view}`, `period-labels`, `reports/{ReportExport,ReportTable,ReportsScreen,report-workbook,reports-view}`, `trash-view`.

Test: đọc `trash-view.test.ts` (phần `restoreLabel` / `teamsDeletedAt` / `blockedReason` mới, dòng 366–695) và diff `appointment-form.test.ts` (+21). **Không đọc từng dòng 12 file test còn lại** (`DateSuggestion.test.tsx`, `MetFields.test.ts`, `appointments-view.test.ts`, `outcome-form.test.ts`, `policy-form.test.ts`, `overview-view.test.ts`, `stage-chart.test.ts`, `stage-view.test.ts`, `team-compare-view.test.ts`, `report-workbook.test.ts`, `reports-view.test.ts`, `applied-filter.test.ts`). Lý do: không nằm trong diff, không chứa nhánh điều khiển sản phẩm; đã **chạy hết** (15 file / **370 test xanh**, 5,93 s) và đột biến ở mục 4 cho thấy chúng giữ hành vi mới.

### Chỗ code gói khác mà gói E nối vào (đã đọc)

`packages/db/src/trash.ts` (đọc hết — `TrashRow`, `refs`, `entry`, `blockOf`), `team.ts` (`restorePerson`, `checkRestorePerson`, `validatePerson`, `liveTeam`, `assertTeamNameFree`), `customers.ts` (`checkRestoreCustomer`), `appointments.ts` (`rescheduleAppointment`, `softDeleteAppointment`, `restoreAppointment`, `optionalText` của nextStep), `purge.ts` (gián tiếp qua `keptRecords`), `packages/domain/src/{text.ts, period.ts (formatLocalDateTime, snapshotDate, chartMarks, reportMarks), money.ts (formatVnd, formatVndCompact), number.ts (formatPercent), stage-snapshot.ts, appointment-counts.ts, model.ts (ROLES_WITH_TEAM)}`, `apps/desktop/src/i18n/vi.ts` (mọi khoá `trash.*`, `policies.*`, `overview.formula`), `apps/desktop/src/i18n/index.ts` (`t`, `joinParts`), `apps/desktop/src/routes/classes.ts` (`CELL_NAME`), `apps/desktop/src/data/AppDataContext.tsx` (`useQuery`, `useTables`), `apps/desktop/src/routes/customers/CustomerAppointments.tsx` (`NextButton`).

Tài liệu: `common\known.md` (đọc hết), `common\baseline.md` (đọc hết), `common\plan.md` §4 + §L6.0–§L6.11 (phần liên quan), `common\fixes.md` (T-377, T-380, T-382), `docs/design/phase-6-hoan-thien.md` §4.2 (TR-1…TR-13, D1–D13, E1–E20), `docs/design/mockups/trash.html` (11a, dòng 157–240), `docs/golden/chi-so.md`, `docs/metrics/phase-6.md` (ngưỡng).

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | `probe-1-labels.mjs`: dựng DB thật (`openDatabase`), tạo 2 lịch hẹn của **cùng một KH, cùng ngày 12/10/2026 09:30**, xóa mềm cả hai, đọc `listTrash` → `toldApart` → `restoreLabel` | Hai nút ra **cùng một chuỗi**: "Khôi phục lịch hẹn 12/10/2026 09:30 · Chưa ghi kết quả của KH Trịnh Minh Anh" (×2); `toldApart` không có mục nào cho hai dòng này | WBR6-E1 |
| 2 | Như #1 với **2 HĐ của cùng KH, cùng ngày nộp 05/10/2026, cùng FYP 500.000.000 ₫** | Hai nút ra cùng một chuỗi "Khôi phục HĐ Nộp 05/10/2026 · 500.000.000 ₫ · Đã nộp của KH Trịnh Minh Anh" (×2) | WBR6-E1 |
| 3 | Nhóm đối chứng: 2 team trùng tên (xóa rồi tạo lại), 2 nhân sự trùng tên + vai trò + team, xóa trong cùng một phút | Chạy đúng như T-380 / T-382: `told = 'second'`, nhãn "… · xóa lúc 20/10/2026 10:00:53", cột "Thuộc" ra "Team Bình Minh (đã xóa lúc 20/10/2026 10:00:53)", dòng chặn ra "Khôi phục team Bình Minh (xóa lúc 20/10/2026 10:00:53) trước." — khớp nhau | — |
| 4 | `probe-2-counts.mjs`: nhập `common\load\load-2026-10-12-seed6.p2cbackup` (1 481 KH, 10 255 lịch hẹn, 1 674 HĐ), tính ô "Lịch hẹn" và câu tỉ lệ chốt của Tổng quan cho kỳ Năm / Tháng / Tuần | Ô ra `"5.819 / 8.111"`, câu ra `"1.394 HĐ phát hành ÷ 497 RF"` — `t()` tự định dạng số, nên **không** có chỗ thiếu dấu nhóm nghìn (giả thuyết bị bác) | — |
| 5 | `node node_modules/vitest/vitest.mjs run` 15 file test của gói | **15 file / 370 test xanh**, 5,93 s, Node v24.20.0; không test đỏ, không hồi quy so `baseline.md` | — |
| 6 | Đột biến M1 (trên bản repo, gỡ ngay): `deletionWords` bỏ `{ seconds: by === 'second' }` → luôn ra phút | **KILLED**: 5 test đỏ (`trash-view.test.ts:751` và 4 ca khác). Gỡ bằng `git checkout --`, sha256 trở lại `0597b5ad…a81d`, `git status --short` rỗng | — |
| 7 | Đọc đối chiếu: `restoreLabel` / `toldApart` với 6 dạng cặp bản ghi gần nhau (khác trạng thái, khác FYP, khác giờ, KH trùng tên có/không có dòng trong Thùng rác, KH trùng tên chỉ là chủ của bản ghi) | Mọi dạng **đều được phân biệt** trừ dạng "giống nhau mọi trường" (#1, #2) — khớp 7 ca trong `trash-view.test.ts:527-694` | WBR6-E1 |
| 8 | Đọc đối chiếu DR6-170: đọc 38 file sản phẩm của gói, đối chiếu từng chỗ hiện tên người dùng (bảng, dòng "Đang xem", tiêu đề chart, ô "Thuộc", dòng lý do) với lớp ngắt của diff | Mọi chỗ đặt tên người dùng trong bảng / dòng "Đang xem" / tiêu đề chart / ô "Thuộc" đều có lớp ngắt; không thấy chỗ còn thiếu trong gói | — |

## 5. Phát hiện mới

### WBR6-E1

```
ID: WBR6-E1
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/trash-view.ts:258-283 (toldApart), :239-246 (byDeletion), :327-346 (restoreLabel) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-160 / T-377, T-380 (PR #1088, #1097) · DR6-119, DR6-99 · có từ trước ở dạng "nhãn nút chỉ nêu trường của bản ghi"; đợt sửa sau lượt 5 thêm cơ chế `byDeletion` cho nhân sự / team nhưng không áp cho lịch hẹn và HĐ
Mô tả: Nút Khôi phục của Thùng rác chỉ nêu những gì dòng "Bản ghi" và "Thuộc" nói (tên KH, ngày, giờ, trạng thái, FYP). Hai lịch hẹn — hay hai HĐ — của cùng một KH mà mọi trường đó giống nhau thì hai nút có aria-label y hệt nhau; `toldApart` chỉ thêm mã KH khi KH có người trùng tên (`:270-273`) và chỉ dùng mốc xóa cho nhân sự / team (`:276-281`), nên không có gì phân biệt hai bản ghi này. Cột "Xóa lúc" thì vẫn khác, tức thông tin có mà nút không nói.
Tái hiện / bằng chứng: `export PATH="/c/Program Files/nodejs:$PATH"; node C:\workspace\deep-review-1-6-r6\workbuddy\E\probe-1-labels.mjs` (log `workbuddy\E\probe-1-labels.log`) — dựng DB thật rồi `scheduleAppointment` hai lần cùng `customerId`, `date 12/10/2026`, `time '09:30'`; `submitPolicy` hai lần cùng `submittedDate 05/10/2026`, `submittedFyp 500_000_000`; `softDeleteAppointment` / `softDeletePolicy` cả bốn; `listTrash` → `toldApart` → `restoreLabel(row, told, TODAY)`:
  {"kind":"policy","told":null,"label":"Khôi phục HĐ Nộp 05/10/2026 · 500.000.000 ₫ · Đã nộp của KH Trịnh Minh Anh"}   (×2, hai id khác nhau)
  {"kind":"appointment","told":null,"label":"Khôi phục lịch hẹn 12/10/2026 09:30 · Chưa ghi kết quả của KH Trịnh Minh Anh"}   (×2, hai id khác nhau)
  duplicate labels: 2 nhóm, mỗi nhóm 2 id.
Cùng mẫu: quét `aria-label={t(` trên `apps/desktop/src/routes` (công cụ Grep của app) → cùng dạng "nhãn chỉ nêu trường của bản ghi" ở ba chỗ khác: `routes/customers/CustomerPolicies.tsx:94` (`policies.issueLabel` = "Phát hành HĐ nộp {date} · {fyp}") và `:103` (`policies.editLabel` = "Sửa HĐ nộp {date} · {fyp} · {status}") — hai HĐ cùng ngày, cùng FYP, cùng trạng thái cho hai nút y hệt (chuỗi ở `i18n/vi.ts:1335-1336`); `routes/customers/CustomerAppointments.tsx:53` (`customer.nextLabel` theo ngày + giờ) — hai lịch hẹn cùng ngày giờ cho hai nút "Hẹn tiếp" y hệt (file của gói D). Trong gói E, `trash-view.test.ts:662-685` chỉ ghim các ca **khác** một trường (FYP khác, trạng thái khác), nên lỗ này không có test.
Ảnh hưởng: người dùng screen reader ở Cài đặt → Thùng rác (và ở thẻ Hợp đồng của hồ sơ KH) nghe hai nút cùng tên, không biết nút nào của bản ghi nào; phải thoát ra đọc cột "Xóa lúc" của từng dòng. Chỉ gặp khi có hai bản ghi trùng khít — lỗi nhập liệu thường (bấm Lưu hai lần, nhập lại cùng một HĐ), và dữ liệu là giả lập nên không phải ca hiếm về dữ liệu.
Chặn phát hành: không — Low ở trục A, K48.
Đề xuất: cho `toldApart` dùng luôn `byDeletion` cho lịch hẹn và HĐ: sau khi đã gán 'code', nhóm các bản ghi còn lại theo chính chuỗi nhãn (`recordTitle` + badge + tên KH, tức thứ `restoreLabel` nói) và thêm mốc xóa như nhân sự / team; `deletionWords` đã sẵn để nhãn và dòng chặn nói cùng chữ. Cỡ ~20-25 dòng sản phẩm + ~40 dòng test (thêm hai ca "hai lịch hẹn / hai HĐ giống khít" vào `trash-view.test.ts`). Hai chỗ cùng mẫu ở `CustomerPolicies` / `CustomerAppointments` sửa được bằng cùng cách (thêm ngày xóa vào nhãn, hoặc mã HĐ), nhưng nằm ngoài gói E — ghi để phiên tổng hợp xếp.
```

## 6. Bloat / Hiệu năng

Không áp dụng (chỉ gói F và chủ đề G). Trong gói E không thấy phát hiện P hay B: `toldApart` / `teamsDeletedAt` là hai lượt O(n) trên 113 dòng Thùng rác của dữ liệu tải; `searchCustomers` (đổi sang `searchText`) đã có số đo ở báo cáo gói A (3,68 ms cho 1 496 KH, dưới luật nhiễu 10 ms).

## 7. Đếm

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | **1** |

- **Chặn phát hành (đề xuất): 0**; không chặn: 1 (WBR6-E1, Low / A). Theo K48, gói E **không** có gì chặn v1.0 ở SHA `5b1328a`.
- **PLAUSIBLE: 0 / 1** (0 %). Phát hiện duy nhất đã chạy probe thật và dán kết quả.

## 8. Đã xét, không thấy

- **E (edge case):** `toldApart` / `byDeletion` với 6 dạng cặp gần nhau (khác trạng thái, khác FYP, khác giờ, KH trùng tên có dòng trong Thùng rác, KH trùng tên chỉ là chủ bản ghi, nhân sự / team trùng trong cùng phút) — đều được phân biệt; `teamsDeletedAt` + `blockedReason` + `ownerParts` nói cùng một mốc xóa (probe #3); `parseTime` với chuỗi chỉ có ký tự vô hình, giờ 24:00 / 23:60; `readScheduleDate` với `Prefill` qua Năm mới; `readPolicy` với ngày phát hành trước ngày nộp; `expectedCaseSize` khi hòa ngày + giờ; `sameSelection` khi kỳ là "Ngày" và "Tùy chọn" cùng một ngày (khác nhau thật ở `comparisonWindows`, nên "chờ Lọc" là đúng).
- **C (đúng hợp đồng / nhãn):** `recordTitle` / `recordBadge` khớp mockup 11a và `policyStatusText`; "Đang xem", MTD, câu tỉ lệ chốt khớp `golden\chi-so.md` (đo ở probe #4); `reports` đặt tên mốc theo `chartMarks` / `reportMarks` (custom = ngày hoặc tháng, không tuần → nhãn không trùng); `reportFileName` chỉ ASCII (`reports.excel.fileRange` = `{from}-den-{to}`).
- **D (dữ liệu):** `deletedAtText` với `deletedAt` ISO thật; `purgePlan` / `canPurge` / `purgedNotice` đọc từ dòng của danh sách chứ không gọi lại `keptRecords`; `filterTrash` + `searchText` trên tên KH của bản ghi.
- **G (guardrail AI):** không có đường AI trong gói E; `AppointmentAi` chỉ là nút mở panel (gói C).
- **S (an toàn ranh giới):** `restoreRow` vẫn là lệnh ghi qua `app.run` (S2-2 / E17), `RestoreDialog` không tự đóng khi lệnh từ chối; `ConfirmWordDialog` không đóng / không chạy lại khi `running`.
- **P (hiệu năng):** xem mục 6.
- **B (bloat):** không thấy khối thêm mới nào trong diff E có thể gỡ (phần lớn là thuộc tính class); `byDeletion` / `teamsDeletedAt` dùng chung cho hai loại.
- **T (chất lượng test):** 15 file / 370 test xanh; đột biến M1 bị giết; lỗ còn lại là ca "hai bản ghi giống khít" (đã thành WBR6-E1, không tách thành phát hiện T riêng).
- **A (trợ năng / i18n):** `aria-label` của nút khôi phục, `aria-describedby` của dòng bị chặn, `aria-live` của dòng "Đang xem", `role="status"` của thông báo, `NumbersTable` của chart, thứ tự focus sau khi hộp đóng (`DialogFocusFallback`) — chỉ còn lỗ ở WBR6-E1.

## 9. Phụ lục

- **Nguồn probe / đột biến:** `workbuddy\E\probe-1-labels.mjs` (+ `.log`), `workbuddy\E\probe-2-counts.mjs` (+ `.log`), diff `workbuddy\E\diff-E.diff`.
- **Đột biến:** chỉ chạy M1 (`trash-view.ts` `deletionWords` bỏ `seconds`) — **KILLED** (5 test đỏ); đã gỡ, sha256 `0597b5ad97b87a51c442956f8a7869fe4af0ce914c0fb7a0c76b1a7b4bb5a81d` trùng lúc trước khi sửa, `git status --short` rỗng. Không có đột biến nào sống.
- **`git status --short` cuối phiên:** rỗng (kiểm sau khi gỡ đột biến, sau khi chạy vitest và sau khi ghi báo cáo).
- **Giờ xong:** 13:14 08/11/2026.
