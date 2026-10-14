XONG — muse gói E, 00:53 15/10/2026

# Báo cáo rà soát sâu lượt 1 — muse gói E: Lịch hẹn, chỉ số, quản lý

Ghi chú ngôn ngữ: báo cáo này có tên file, tên hàm, nhãn giao diện giữ nguyên theo mã nguồn. Các tên riêng kỹ thuật này được giữ lại để định vị đúng dòng mã, phần giải thích viết bằng tiếng Việt.

Phiên làm tiếp: phiên trước dừng ở khung báo cáo và file `muse\E\probe-cross.mjs` (chưa chạy). Phiên này đọc sâu toàn bộ phạm vi, chạy các probe, chốt báo cáo.

## 1. Thông tin phiên

- Bên: muse (mô hình Muse Spark, chế độ tự hành)
- Gói: E — Lịch hẹn, chỉ số, quản lý
- SHA đầu phiên: 885534549808f42aec7f9af5743bbf86642ee4bd (nhánh tách, khớp SHA ghim)
- Trạng thái kho đầu phiên (`git -C C:\workspace\Project-2C-review-2 status --short`):
  - `?? .agents/`
  - `?? .codex/`
  - `?? AGENTS.md`
  - (các tập tin chưa theo dõi này được ghi nhận ở đầu phiên để đối chiếu cuối phiên; phiên này không tạo, không sửa chúng)
- Giờ bắt đầu: 00:25 15/10/2026 (giờ máy chạy, phiên trước); phiên này làm tiếp và chốt báo cáo
- Máy chạy: Home PC `DESKTOP-KDURKJP`; lúc đo không chạy exe đo hiệu năng nào khác, không chạy `pnpm e2e`

## 2. Phạm vi đã đọc

### 2.1. Tài liệu đã đọc

- `CLAUDE.md` (gốc), `CONTEXT.md` (toàn bộ)
- `docs/design/phase-6-hoan-thien.md` §4.1 (S-2), §4.2 (Thùng rác, bảng E1–E17, TR-1–TR-10), §4.3, §5–§6
- `docs/design/phase-4-chi-so.md` (toàn bộ §1–§4, bảng C01–C11, M01–M04), `docs/golden/chi-so.md` (G01–G22), `docs/golden/lich-hen.md` (A01–A13), `docs/golden/kh-theo-nhom.md` (S01–S13)
- Mockup: `docs/design/mockups/README.md`; `trash.html` khối 11a–11g (dòng 100–330); `overview.html` 1a–1e (dòng 793–973, bảng khối↔chỉ số); `reports.html` (theo bản đồ khối); `appointment-forms.html` 6a–6i; `policy-forms.html` 8a–8d; `phase-3-feedback.html` B3–B6 (theo dẫn chiếu)
- `docs/metrics/phase-6.md` (số đo nền, ngưỡng), `common\baseline.md`, `common\perf\perf-ref.json`, `common\known.md`, `common\plan.md` §4–§6
- Mã nối vào ngoài gói: `packages/db/src/appointments.ts` (dòng 140–260, lệnh kết quả/dời/sửa/xóa), `packages/db/src/team.ts` (dòng 238–270, điều kiện xóa nhân sự), `packages/db/src/schema.ts` (khóa chính), `packages/domain/src/money.ts` (dòng 140–181), `packages/domain/src/number.ts` (dòng 1–22), `packages/ui/src/components/Chart.tsx` (dòng 1–30, `encodeHtml`), `apps/desktop/src/i18n/vi.ts` (khóa dùng trong gói E), `apps/desktop/src/data/app-data.ts` (chỉ đọc lướt phần hàng đợi S-2/E17 phục vụ `restoreRow`)

### 2.2. Mã nguồn đã đọc (37 file sản phẩm trong gói, 7 069 dòng đếm thô)

- Lịch hẹn (`routes/appointments/`): `appointments-view.ts` (471), `AppointmentsScreen.tsx` (652), `AppointmentDialog.tsx` (447), `appointment-form.ts` (125), `outcome-form.ts` (132), `OutcomeDialog.tsx` (292), `EditOutcomeDialog.tsx` (237), `RescheduleDialog.tsx` (60), `RescheduleFields.tsx` (142), `DeleteAppointmentDialog.tsx` (100), `MetFields.tsx` (164), `YearGrid.tsx` (142)
- Tổng quan (`routes/overview/` + `routes/Overview.tsx`): `overview-view.ts` (252), `stage-view.ts` (142), `stage-chart.ts` (130), `team-compare-view.ts` (129), `OverviewTiles.tsx` (76), `StageBlock.tsx` (127), `TeamCompare.tsx` (127), `Overview.tsx` (61)
- Báo cáo (`routes/reports/`): `reports-view.ts` (327), `report-workbook.ts` (259), `ReportsScreen.tsx` (113), `ReportTable.tsx` (154), `ReportExport.tsx` (96)
- Cài đặt/Thùng rác/lọc (`routes/` gốc): `trash-view.ts` (439), `Settings.tsx` (170), `SettingsBackup.tsx` (280), `SettingsDataFile.tsx` (135), `SettingsTrash.tsx` (226), `RestoreDialog.tsx` (65), `FilterBar.tsx` (82), `period-labels.ts` (26), `applied-filter.ts` (51)
- Hợp đồng (`routes/customers/`): `CustomerPolicies.tsx` (109), `PolicyDialogs.tsx` (354), `policy-form.ts` (138)
- File AI trong phạm vi (`AppointmentAi.tsx`, `SettingsAi.tsx`, `Kyc*`, `extraction-view`) thuộc gói C, không đọc (đúng luật xếp gói)
- Test đã đọc/chạy trong gói: 15 file, 262 ca, đều xanh (xem mục 8 và trục T)

## 3. Phát hiện

```
ID: MU-E1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/overview/stage-view.ts:129 (8855345)
Tình trạng: CONFIRMED
Mô tả: Chart từng team ở góc nhìn Team xếp theo thứ tự dữ liệu, không theo tên như mockup 1b và các bảng còn lại.
Tái hiện / bằng chứng: `node E/probe-edge.mjs` trên dữ liệu tải in `INFO chart-team: Sao Mai | Bình Minh | Hừng Đông | Sao Mai 2` trong khi bảng So sánh team (`teamCompare`) và bảng Theo team (`reportRows`) đều sắp theo tên (`byName`); mockup `overview.html` 1b vẽ ba chart theo thứ tự Bình Minh, Hừng Đông, Sao Mai. Nguồn probe ở phụ lục 8.1.
Ảnh hưởng: người dùng đối chiếu chart với bảng phải tìm team ở vị trí khác nhau; chỉ sai thứ tự hiển thị, số liệu đúng.
Đề xuất: sắp một bản sao `[...data.teams].sort((a, b) => byName(a.name, b.name))` trước khi vẽ chart, như `teamCompare`; cỡ nhỏ (dưới 10 dòng sản phẩm); test giữ hành vi: `stage-view.test.ts` (thêm ca thứ tự chart).
```

```
ID: MU-E2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/appointments/appointment-form.ts:115 (8855345)
Tình trạng: CONFIRMED
Mô tả: Chú thích của `searchCustomers` ghi kết quả "by name" nhưng code giữ nguyên thứ tự đầu vào (thứ tự tạo, vì `listCustomers` sắp theo `id` — `packages/db/src/customers.ts:73`); test hiện tại ghim đúng thứ tự đầu vào.
Tái hiện / bằng chứng: `node E/probe-edge.mjs` — với truy vấn `a` trên dữ liệu tải, thứ tự trả về khác thứ tự tên (`PASS tim-KH-khong-theo-ten`); `appointment-form.test.ts:196-204` đợi `Trịnh Minh Anh` trước `Đỗ Minh Khang` (thứ tự đầu vào, không phải thứ tự tên). Nguồn probe ở phụ lục 8.1.
Ảnh hưởng: người dùng gõ chuỗi chung mà có hơn 6 khách hàng khớp thì 6 dòng hiện ra theo thứ tự tạo, khách hàng cần tìm có thể bị ẩn; gõ thêm ký tự thì thấy (có đường vòng).
Đề xuất: hoặc sắp kết quả theo tên (`byName`, so sánh tiếng Việt) rồi mới cắt giới hạn, hoặc sửa chú thích cho đúng; cỡ nhỏ; test giữ hành vi: `appointment-form.test.ts` (sửa ca `searchCustomers` cho đúng thứ tự tên).
```

```
ID: MU-E3
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/policy-form.ts:91 (8855345)
Tình trạng: CONFIRMED
Mô tả: Sửa hợp đồng mà dời tháng phát hành (hoặc tháng nộp) sang tháng khác thì hộp thoại không hiện dòng "Ảnh hưởng chỉ số", dù doanh số/case size của hai tháng đều đổi.
Tái hiện / bằng chứng: `node E/probe-policy.mjs` — `issuedChange` với cùng tháng trả `metric` khác rỗng (`PASS doi-fyp-cung-thang-co-metric`), với ngày phát hành sang tháng sau trả `metric=null` (`PASS doi-thang-mat-metric`); `PolicyDialogs.tsx:280-285` chỉ vẽ dòng hiệu lực khi `change?.metric` tồn tại. Mockup `policy-forms.html` 8d chỉ mẫu trường hợp cùng tháng. Nguồn probe ở phụ lục 8.1.
Ảnh hưởng: người dùng sửa ngày phát hành qua tháng khác làm số báo cáo hai tháng đổi mà không được báo trước; số vẫn đúng theo ngày mới (không sai dữ liệu), sửa lại được.
Đề xuất: khi tháng phát hành đổi, hiện dòng nêu tháng cũ mất bao nhiêu và tháng mới thêm bao nhiêu (dùng sẵn `monthOf`, `formatVndCompact`); cỡ nhỏ (dưới 30 dòng sản phẩm); test giữ hành vi: `policy-form.test.ts` (thêm ca dời tháng).
```

```
ID: MU-E4
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/appointments/OutcomeDialog.tsx:92 (8855345)
Tình trạng: PLAUSIBLE
Mô tả: Ghi kết quả kèm đặt "Hẹn lần tiếp theo" thì lịch mới không được hiện ra như ba đường tạo lịch còn lại (tạo mới, dời lịch, hẹn tiếp từ lịch cũ đều gọi `show` để nhảy tới ngày của lịch mới).
Tái hiện / bằng chứng: đã đọc `OutcomeDialog.tsx:72-98` (nhánh `RESCHEDULED` gọi `onMoved` tức `show`, nhánh ghi kết quả bỏ kết quả trả về của `recordOutcomeWithNext` và chỉ `onClose`), `AppointmentsScreen.tsx:200-207` (`show` nhảy kỳ/ngày, xóa lọc che khuất, báo khi ngoài góc nhìn) và `AppointmentsScreen.tsx:310-317` (chỉ nhánh dời lịch nhận `onMoved={show}`). Chưa chạy giao diện nên chưa ghi CONFIRMED.
Ảnh hưởng: lịch tiếp theo đặt vào ngày ngoài kỳ đang xem (hoặc cho nhân sự ngoài góc nhìn) thì người dùng không thấy, không có dòng báo, phải tự tìm.
Đề xuất: sau khi ghi kèm lịch tiếp theo, gọi `onMoved` với lịch mới như nhánh dời lịch; cỡ rất nhỏ; test giữ hành vi: e2e `appointments.spec.ts` hoặc test màn (kiểm lịch mới được chọn sau khi ghi kèm).
```

## 4. Bloat

| Đã chạy / đọc gì | Trên dữ liệu nào | Số | ID phát hiện |
|---|---|---|---|
| `pnpm exec tsc --noUnusedLocals --noUnusedParameters --noEmit -p apps/desktop/tsconfig.json` | toàn bộ mã nguồn app ở SHA ghim | sạch, không lỗi | — |
| `pnpm lint:deps` | toàn bộ repo ở SHA ghim | không vi phạm (309 module, 1 244 quan hệ) | — |
| Rà từng export trong 37 file gói E bằng tìm kiếm (mẫu: `monthOf`, `TRASH_MORE`, `CHART_STAGES`, `DOT_ORDER`, `withoutError`, các export của `appointments-view`, `trash-view`, `reports-view`, `report-workbook`, `applied-filter`) | mã nguồn ở SHA ghim | mọi mẫu đều có nơi dùng (màn hình, test, hoặc route); không thấy export chết | — |
| Đọc `plain` ở `trash-view.ts:48`, `appointment-form.ts:111` và biến thể `slug` ở `report-workbook.ts:224` | mã nguồn ở SHA ghim | trùng lặp còn đó nhưng đã ghi trong KNOWN (#543, mục *Duplicated Code*), không có bằng chứng mới nên không nêu thành phát hiện | KNOWN |
| Đọc `download` ở `SettingsBackup.tsx:169` và `ReportExport.tsx:88`, `ALERT` cục bộ ở `SettingsBackup.tsx:33` và `SettingsAi.tsx:38` so với `ALERT` dùng chung của `CustomerDialogs.tsx:47` | mã nguồn ở SHA ghim | mỗi cặp mới lặp ở 2 nơi (dưới ngưỡng 3 nơi), hình thức hơi khác nhau (kiểu nội dung blob, lớp `flex`) nên chưa đáng tách | — |
| Đối chiếu chunk build web ở `common\baseline.md` (`exceljs.min.js`, `chart.js` tách riêng, nạp lười ở `buildReportWorkbook` và `Chart`) | SHA ghim | gói E không thêm chunk mới | — |

## 5. Hiệu năng

Máy đo: Home PC `DESKTOP-KDURKJP` (cùng máy với `common\perf\perf-ref.json`); lúc đo không chạy exe đo nào khác và không chạy `pnpm e2e`. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` nạp trong Node qua `importBackup` (1 481 khách hàng sống, 10 252 lịch hẹn sống, 4 team, 51 nhân sự; chênh với 1 496/10 414 của bản ghi nền là các bản ghi trong Thùng rác, danh sách sống không tính chúng — đúng luật).

| Đã chạy / đo gì | Trên dữ liệu nào | Số | ID phát hiện |
|---|---|---|---|
| `node E/probe-cross.mjs`: `reportRows` tháng/năm/tùy chọn × Toàn bộ/Team/RE | dữ liệu tải, hôm nay 15/10/2026 | trung vị 2,8–7,5 ms (3 lần) | — |
| `teamCompare` tháng | dữ liệu tải | trung vị 1,5 ms (5 lần) | — |
| `buildReportWorkbook` (làm workbook thật) | dữ liệu tải, tháng 10/2026 | trung vị 10,1 ms (3 lần) | — |
| `appointmentRows` (Toàn bộ) | dữ liệu tải | trung vị 2,8 ms (5 lần) | — |
| `monthGrid`, `yearGrid` | dữ liệu tải | trung vị 3,4 ms / 2,9 ms (5 lần) | — |
| `kpiTiles`, `stageBlock`, `reportRows` tháng/năm | dữ liệu tải | trung vị 1,6 / 2,5 / 5,0 / 6,7 ms (5 lần) | — |
| `listTrash` | dữ liệu tải (có Thùng rác) | trung vị 43,8 ms (thấp nhất 40,5, cao nhất 49,4; 5 lần) | — (mục KNOWN #539/#529 đã nêu việc đọc cả ba bảng; số này dưới xa ngưỡng 200 ms nên không có bằng chứng mới để nêu) |
| `node E/probe-edge.mjs`: `reportRows`/`stageBlock` kỳ Tùy chọn vắt qua hôm nay (10/10–20/10) và kỳ Năm (12 mốc, 2 mốc tương lai) | dữ liệu tải | đúng hết, không đo thời gian riêng (cùng hàm với dòng trên) | — |
| So với số tham chiếu cùng máy: `trash.open` 79,5 ms, `reports.export-excel` 24,4 ms, các thao tác kỳ 6–22 ms | `common\perf\perf-ref.json` (exe) so với hàm thuần trong Node | hàm thuần đều rẻ hơn một bậc so với thao tác màn tương ứng; mọi thao tác màn trong ngưỡng dưới 200 ms | — |

Kết luận hiệu năng gói E: không có phát hiện P; mọi hàm màn hình đo được đều dưới 200 ms với biên rộng (chậm nhất là `listTrash` 43,8 ms).

## 6. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Low | 0 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 |
| Tổng | 0 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 |

Tỉ lệ PLAUSIBLE: 1/4 (MU-E4 chưa chạy giao diện; ba phát hiện còn lại đều CONFIRMED bằng probe). Không có Critical/High/Medium.

## 7. Đã xét, không thấy

- Trục E (trường hợp biên): miền ngày 1900–2100 (ngày ngoài miền để trống, `monthGrid` trả ô trống — đã đọc `appointments-view.ts:377-415`); 29/02 thiếu ngày gợi sang năm sau (`DateSuggestion`, `appointment-form.ts:44-50`); ngày quá khứ nhập bù ở tạo mới và dời lịch (`ScheduleMode`, `backfill`); kỳ Tùy chọn tối đa 3 tháng nằm ở bộ chọn kỳ dùng chung; trạng thái rỗng của Thùng rác, lịch ngày, chart kỳ chưa bắt đầu (`StageBlock`, `TrashSection`, `OverviewTiles`); qua nửa đêm: mọi nhóm lịch hẹn/kỳ/mốc đều tính theo ngày ứng dụng truyền vào, không chốt giờ hệ thống trong hàm hình (`appointmentGroup`, `countedWindow`, `snapshotDate` — đã đọc và chạy qua probe với hôm nay cố định). Không thấy lỗi.
- Trục C (đúng hợp đồng): số ô Lịch hẹn = danh sách lịch hẹn = Tổng hợp báo cáo ở cả ba góc nhìn và ba loại kỳ (`probe-cross.mjs`: 27/27 dòng khớp); KPI = báo cáo; nhóm = báo cáo; So sánh team = Theo team (sau khi sửa lỗi probe dùng sai khóa, `probe-edge.mjs` khớp cả 4 team và dòng Tổng); Theo mốc cộng lại = Tổng hợp (kể cả kỳ vắt qua hôm nay và kỳ Năm có mốc tương lai); Excel = màn hình (17 cột, tỉ lệ chốt là phân số, "—" thành ô trống; số sheet 4/3/2 theo góc nhìn; tên file chỉ gồm chữ số ASCII, dài dưới 120 ký tự); hộp khôi phục KH/cuộc hẹn khớp mockup 11b/11c từng dòng; hộp sửa HĐ cùng tháng khớp mockup 8d; thứ tự So sánh team theo tên khớp mockup 1a. Phần còn lệch đã ghi thành MU-E1–MU-E4.
- Trục D (dữ liệu): khôi phục là lệnh ghi chịu khóa S2-2 (lỗi hiện trong hộp, thoại ở lại — `restoreRow`, test E17 xanh); hộp nhập backup hiện số trong file và số hiện tại (10a), hộp nạp lại không hiện số là mục KNOWN #96 (đã đối chiếu, đúng là còn thiếu, không có bằng chứng mới); xuất backup/Excel đọc một lần rồi ghi (S2-5, phía gói B); nhân sự còn lịch hẹn/khách hàng/hợp đồng sống thì không xóa được (`isPersonInUse`), nên các đường `re`/`team` trống trong `appointmentRows`/`dayBoard` không tới được — đã đọc điều kiện chặn, không thấy đường vào.
- Trục G (guardrail AI): ngoài phạm vi gói E (file AI thuộc gói C); các màn gói E không nhận chữ tự do nào đưa vào mô hình (ô tìm Thùng rác và ô tìm khách hàng chỉ lọc trong máy). Không thấy gì.
- Trục S (an toàn ranh giới): file backup quá lớn bị từ chối trước khi đọc (`SettingsBackup.tsx:66-70`); tên file Excel luôn ASCII và cắt ở 60 ký tự cho phần góc nhìn (`probe-edge.mjs` kiểm đúng); tooltip chart thoát thẻ (`encodeHtml`, `stage-chart.ts:65-85`); tải blob xong thu hồi địa chỉ sau 60 giây; `liveIds` bỏ người phối hợp đã xóa thay vì từ chối (đúng chú thích). Không thấy lỗi.
- Trục P: xem bảng mục 5; không có hàm nào vượt ngưỡng.
- Trục B: xem bảng mục 4; không có phát hiện mới.
- Trục T (chất lượng test): 15 file test trong gói, 262 ca, đều xanh (`vitest run` các thư mục appointments/overview/reports và `trash-view`/`applied-filter`/`policy-form`); Thùng rác phủ E1–E17, TR-8, E17 (`trash-view.test.ts`); đột biến trên bản chép (`E/probe-mutant.mjs`: `searchCustomers` trả rỗng) bị test hiện có giết (`appointment-form.test.ts:208` đợi 2 dòng). Chỗ hở đã biết: thứ tự sắp xếp Thùng rác với từ 2 dòng chưa có test (KNOWN #543), e2e hộp 5f chưa đọc số chính xác (KNOWN #541), giá trị `MAX_HISTORY` và liên kết "Xem tất cả" quá 5 lịch chưa có test (KNOWN #165) — đã đối chiếu, không có bằng chứng mới.
- Trục A (trợ năng/i18n): 416 khóa tĩnh dùng trong gói E đều có trong `vi.ts`, 51 khóa động kiểm trực tiếp đều ra câu (`probe-i18n.mjs`, `probe-i18n-keys.mjs`); ô tìm Thùng rác có nhãn cho trình đọc màn hình; nút ô nhóm có `aria-pressed`, nút mở team có `aria-expanded`, ngày/lưới tháng có tên đọc gồm đủ nhóm (DR-16); chart cột chưa đọc được từng cột cho trình đọc màn hình và ô ngoài tháng/kỳ để `aria-hidden` là các mục KNOWN (P8/T2, #156) — đã đối chiếu code (`StageBlock.tsx`, `AppointmentsScreen.tsx:459-463`), tình trạng đúng như ghi chú, không có bằng chứng mới.

## 8. Phụ lục

### 8.1. Nguồn probe / test tạm / đột biến (tập tin đặt trong `muse\E\`)

- `probe-cross.mjs` (có từ phiên trước, phiên này chạy và sửa cách đọc kết quả): so khớp ô Lịch hẹn/danh sách/Tổng hợp/KPI/nhóm/So sánh team/Theo mốc/Excel/Thùng rác trên dữ liệu tải. Lần chạy đầu: 4 mục `team ... :: khong thay` do probe dùng sai khóa (`r.key.id` trong khi khóa là chuỗi); đã sửa trong `probe-edge.mjs` (so `r.key === team.key`) và khớp cả 4 team. Kết quả cuối của `probe-cross.mjs` vẫn còn 4 dòng ROT vì file gốc giữ nguyên để giữ vết phiên trước.
- `probe-edge.mjs` (mới): sửa phép so So sánh team, kỳ Tùy chọn vắt qua hôm nay, kỳ Năm 12 mốc, thứ tự chart team, nhãn trục kỳ tương lai, thứ tự tìm khách hàng, lọc rác không dấu, tên file Excel, số sheet theo góc nhìn. Kết quả: `XONG probe: tat ca deu dat` (22 dòng PASS, kèm 2 dòng INFO làm bằng chứng MU-E1).
- `probe-i18n.mjs` (mới): quét 416 khóa `t('...')` tĩnh trong 37 file gói E, đối chiếu `vi.ts` — thiếu 0.
- `probe-i18n-keys.mjs` (mới): gọi `t` thật cho 51 khóa động (nhóm, trạng thái, thứ, KPI, kỳ, loại rác, lý do chặn) — đều ra câu (2 mục ROT giữa chừng do probe gọi sai khóa `trash.blocked.PERSON_NOT_FOUND`/`DATE_IN_FUTURE`; khóa thật là `trash.blocked.re/...`, đã sửa và xanh hết).
- `probe-policy.mjs` (mới): `issuedChange` cùng tháng có `metric`, dời tháng mất `metric` (bằng chứng MU-E3); số cột `reportCells` = 17 = 5 + 6 + 6 cột Excel.
- `probe-mutant.mjs` + `mut/appointment-form.ts` (mới): bản chép `appointment-form.ts` với đột biến `.slice(0, limit)` thành `.slice(0, 0)`; `searchCustomers` trả 0 dòng trong khi test hiện có đợi 2 → đột biến bị giết. Bản chép nằm ngoài repo, repo không bị đụng.
- `probe-lines.mjs`, `probe-exports.mjs`, `probe-exports2.mjs`, `ui-stub.ts` (mới): công cụ đếm dòng và rà export (bản `probe-exports2` hỏng vì máy không có `rg`, đã thay bằng công cụ tìm kiếm có sẵn; `ui-stub.ts` chỉ thay `encodeHtml` cho Node vì Node không nạp được `.tsx`).
- Test của repo đã chạy (chỉ đọc, chỉ ghi cache đã bỏ qua): `vitest run` 15 file trong gói E — 262/262 xanh, 5,24 giây.

### 8.2. Trạng thái kho cuối phiên

`git -C C:\workspace\Project-2C-review-2 status --short` cuối phiên:

- `?? .agents/`
- `?? .codex/`
- `?? AGENTS.md`

Giống hệt đầu phiên (các tập tin Codex tự sinh, phiên này không đụng). Không có thay đổi nào trong repo.

### 8.3. Giờ xong

00:53 15/10/2026 (giờ máy chạy).
