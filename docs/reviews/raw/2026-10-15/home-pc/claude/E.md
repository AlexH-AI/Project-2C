XONG — claude gói E, 14/10/2026 01:45

# Deep review Phase 1–6, lượt 1 — Claude — gói E (Lịch hẹn, chỉ số, quản lý)

## 1. Đầu phiên

- Bên: Claude (Opus 5.5), phiên sạch, chỉ đọc.
- Gói: E — `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`).
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (khớp SHA ghim `8855345`).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 14/10/2026 01:13 (Home PC `DESKTOP-KDURKJP`).
- Bước 0: gói E hợp lệ; `claude\E.md` chưa có → làm mới; `claude\A.md`…`D.md` có đủ, dòng đầu đều `XONG`.

## 2. Phạm vi đã đọc

Danh sách file gói E lấy đúng luật `classifyFile` của `tools/size-report-core.mjs` (`claude\E\list.mjs` → `list.log`): 51 file, **7 032 dòng SP / 3 545 dòng test** (khớp `plan.md` §3).

**Code sản phẩm (đọc hết từng dòng, ở SHA ghim):**

- `routes/`: `Overview.tsx` (61), `FilterBar.tsx` (82), `applied-filter.ts` (51), `period-labels.ts` (26), `Settings.tsx` (170), `SettingsBackup.tsx` (280), `SettingsDataFile.tsx` (135), `SettingsTrash.tsx` (226), `RestoreDialog.tsx` (65), `trash-view.ts` (439).
- `routes/overview/`: `overview-view.ts` (252), `OverviewTiles.tsx` (76), `stage-view.ts` (142), `stage-chart.ts` (130), `StageBlock.tsx` (127), `team-compare-view.ts` (129), `TeamCompare.tsx` (127).
- `routes/reports/`: `reports-view.ts` (327), `ReportsScreen.tsx` (113), `ReportTable.tsx` (154), `report-workbook.ts` (259), `ReportExport.tsx` (96).
- `routes/appointments/`: `appointments-view.ts` (471), `AppointmentsScreen.tsx` (652), `YearGrid.tsx` (142), `appointment-form.ts` (125), `AppointmentDialog.tsx` (447), `outcome-form.ts` (132), `OutcomeDialog.tsx` (292), `MetFields.tsx` (164), `EditOutcomeDialog.tsx` (237), `RescheduleFields.tsx` (142), `RescheduleDialog.tsx` (60), `DeleteAppointmentDialog.tsx` (100).
- Hợp đồng: `routes/customers/policy-form.ts` (138), `PolicyDialogs.tsx` (354), `CustomerPolicies.tsx` (109).

**Code gói khác mà gói E nối vào (chỉ chỗ nối):** `packages/domain/src/stats.ts` (hết), `appointment-counts.ts` (hết), `number.ts` (hết), `period.ts` (`formatLocalDateTime`, chữ ký `chartMarks` / `reportMarks`); `packages/db/src/trash.ts` (hết), `counts.ts` (hết), `team.ts:89-275` (xóa / khôi phục team, nhân sự, `ownsLiveRecords`), `appointments.ts:101-165`, `:289-361` (`listAppointments`, `recordMeetingOutcome`, `outcomeStage`, `applyOutcome`), `policies.ts` (`listPolicies`, kiểm cặp phát hành), `customers.ts:68-102`, `schema.ts` (CHECK của `appointments`, `policies`), `backup.ts:29-106` (`exportedAt`); `apps/desktop/src/data/app-data.ts:60-436` (`run`, `replace`, `exportBackup`, `readBackup`, `importBackup`), `tables.ts`, `AppDataContext.tsx`; `shell/scope.ts`, `ScopeContext.tsx`, `AppShell.tsx` (cách tính `picked`); `routes/customers/customers-view.ts:92-138` (`parseRecordDate`, `allowedStages`), `CustomerProfile.tsx` (chỗ dùng thẻ / hộp HĐ); `packages/ui/src/components/DataTable.tsx` (thẻ ô), `src-tauri/src/storage.rs:180-470` (luật tên file xuất); `i18n/vi.ts` (mọi khóa `overview.*`, `reports.*`, `period.*`, `appointments.*`, `appointmentForm.*`, `outcome*.*`, `reschedule.*`, `appointmentDelete.*`, `policies.*`, `policyForm.*`, `policyDelete.*`, `trash.*`, `settings.file|backup|demo.*`).

**Test (đọc tên mọi ca của 14 file test gói E, đọc kỹ chỗ cần):** `appointments-view.test.ts:590-636`, e2e `appointments.spec.ts:582-630`, `trash.spec.ts:52-190`, `overview.spec.ts` / `reports.spec.ts` / `period-picker.spec.ts` (các dòng "Đang xem"), tên ca của `backup.spec.ts`, `customer-policies.spec.ts`, `appointment-outcome.spec.ts`, `demo-data.spec.ts`.

**Tài liệu:** `CLAUDE.md` gốc + `apps/desktop/CLAUDE.md`, `packages/domain/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/i18n-ui.md`, `mockups.md`, `tests.md`; `common\plan.md` §1–§12, `known.md`, `baseline.md`; báo cáo Claude `A.md`…`D.md` (tiêu đề phát hiện, CL-A1, CL-A2 + log `s2-scenarios.log`, CL-D7…CL-D10, mục Bloat / Hiệu năng của D); `docs/design/phase-4-chi-so.md` (hết), `phase-6-hoan-thien.md` §4.2, §5; `docs/golden/chi-so.md` (bảng G01–G22); `docs/testing/nghiem-thu-v1.md` (NT-TQ, NT-BC, NT-LH, NT-CD, NT-TR, NT-DB, "Lệch mockup đã biết", "Đối chiếu mockup"); mockup (chữ hiện ra qua `mocktext.mjs`, log `mock-*.txt`): `overview.html` (1a–1e, §2), `reports.html` (2a–2f + bảng dựng bằng script), `appointment-forms.html` (6a–6i), `policy-forms.html` (8a–8d), `trash.html` (11a–11g), `settings-data.html` (10a–10d), `customer.html` (khối Hợp đồng).

## 3. Phát hiện

### CL-E1 — "Đang xem" của kỳ Năm đang chạy thiếu dấu "·" giữa kỳ và khoảng ngày (mockup 1c, 2e; NT-TQ-22 sẽ đỏ ở G7); e2e ghim đúng bản lệch

```
ID: CL-E1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/FilterBar.tsx:77 (`{viewing.range && ` ${viewing.range}`}`); e2e/overview.spec.ts:85 — so với docs/design/mockups/overview.html:999 (1c), docs/design/mockups/reports.html (2e "Đang xem: Năm 2026 · 01/01 – 15/10/2026 · RE Bùi Ngọc Trâm"), docs/testing/nghiem-thu-v1.md:100 (NT-TQ-22) (8855345)
Tình trạng: CONFIRMED (bản web)
```

- **Mô tả:** với kỳ Năm chứa hôm nay, dòng "Đang xem" ghép `Năm 2026` + ` 01/01 – 14/10/2026` không có dấu `·`, trong khi mockup đã duyệt 1c và 2e (cùng dòng "Đang xem") ghi `Năm 2026 · 01/01 – 15/10/2026 · …`, và danh mục nghiệm thu NT-TQ-22 ghi đúng chữ mockup ("Đang xem: Năm yyyy · 01/01 – dd/mm/yyyy · RE <tên>"). Kỳ Tháng (MTD) thì mockup không có dấu (badge MTD đứng giữa) nên đúng. e2e `overview.spec.ts:85` lại ghim chuỗi không dấu (`'Đang xem: Năm 2026 01/01 – 15/09/2026 · Toàn bộ'`), nên test giữ bản lệch.
- **Tái hiện:** bản web ở SHA ghim (cổng 4320, dữ liệu tải nhập qua Cài đặt → Dữ liệu), Tổng quan → Năm → Lọc → `p` "Đang xem" có `innerHTML` = `Đang xem: <b …>Năm 2026</b> 01/01 – 14/10/2026 · <b …>Toàn bộ</b>`. Báo cáo dùng cùng `FilterBar` nên giống hệt.
- **Ảnh hưởng:** chỉ chữ hiển thị; người kiểm G7 làm theo NT-TQ-22 (và đối chiếu 2e ở NT-BC-09) sẽ ghi lỗi.
- **Đề xuất:** thêm `t('sep.dot')` trước `viewing.range` khi kỳ là Năm (không thêm cho MTD), sửa chuỗi ở `overview.spec.ts:85`; ≈ 3 dòng SP + 1 dòng e2e. Hoặc Owner chọn ghi vào "Lệch mockup đã biết" và sửa NT-TQ-22.


### CL-E2 — Hộp sửa kết quả (6f) mở qua nửa đêm 31/12 → 01/01: lưu một lịch Hủy dời ngày của nó sang năm sau mà người dùng không đổi ô ngày

```
ID: CL-E2
Mức: Low
Trục: E, D
Vị trí: apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:55 (`useState(dayText(a.date, today))` — "dd/mm" khi cùng năm), :48 + :64 (`today = app.today()`, `readScheduleDate(dateText, today, 'any')` mỗi lần render), :86-87 (gửi `date.date` khi không khóa); apps/desktop/src/routes/appointments/appointment-form.ts:64-65 (`dayText`); cùng khuôn ở customers/PolicyDialogs.tsx:48-58 (`draftOf` → `dayText`) (8855345)
Tình trạng: CONFIRMED (bản web + đồng hồ giả)
```

- **Mô tả:** các hộp sửa điền sẵn ngày đã lưu bằng `dayText` (bỏ năm khi cùng năm với hôm nay) rồi đọc lại chữ đó bằng hôm nay **của lần render sau**. Hộp mở trước nửa đêm 31/12 và lưu sau đó thì "30/12" được đọc thành 30/12 **năm sau**. Với lịch Hủy (không bị chặn "kết quả sau hôm nay" như Đã gặp / Không đến), `editMeetingOutcome` nhận ngày mới và lịch nhảy đi một năm, dù người dùng chỉ gõ ghi chú. (Hộp tự đổi dòng gợi ý thành "… 30/12/2027 · 363 ngày nữa" nhưng không báo lỗi.)
- **Tái hiện** (bản web ở SHA ghim, cổng 4320, `claude\E\web\clock.html` = `index.html` + đồng hồ dời tới `?at=2026-12-31T23:59:00`, chạy thật từ đó; dữ liệu giả lập neo 31/12/2026): Lịch hẹn → lịch "30/12/2026 19:30 · Hoàng Hoài Hương · Hủy" → "Sửa kết quả" lúc 23:59:21 (ô ngày `30/12`, gợi ý "Thứ Tư 30/12/2026 · đã qua 1 ngày") → chờ tới 00:00:06 01/01/2027 → gõ "KH bao huy" vào Ghi chú (gợi ý ô ngày thành "Thứ Năm 30/12/2027 · 363 ngày nữa", không lỗi) → Lưu → hộp đóng, chi tiết lịch: `30/12/2027 19:30 · Hoàng Hoài Hương … Trạng thái Hủy`. (Chỉ trong DB bộ nhớ của trình duyệt.)
- **Biến thể (đã chạy, cùng cách):** hộp HĐ (8b / 8d) dùng cùng `dayText`: qua giao thừa thì ngày nộp đã lưu thành ngày tương lai → `future`. Ở hộp Phát hành (8b) ô ngày nộp bị ẩn: mở "Phát hành HĐ nộp 18/12/2026" (KH Phan Gia Chi) lúc 23:59:23, sau 00:00:10 sửa Ngày phát hành thành `1/1` (gợi ý "Thứ Sáu 01/01/2027", đúng) → bấm Phát hành → hộp hiện "Chưa lưu được — 1 ô cần sửa · Không có gì được ghi vào dữ liệu." mà **không ô nào báo lỗi** (dòng "HĐ nộp tháng 12/2026 vẫn tính…" cũng biến mất); phải Hủy rồi mở lại. Không sai dữ liệu.
- **Ảnh hưởng:** chỉ khi một hộp sửa đang mở đúng lúc sang năm mới; lịch Hủy bị dời một năm lặng lẽ (rời khỏi số "Dời – hủy – không đến" của năm cũ, hiện ở năm sau). Điều kiện hiếm → Low.
- **Đề xuất:** khi ô ngày chưa bị sửa (chữ còn bằng chữ điền sẵn) thì giữ ngày đã lưu thay vì đọc lại chữ; hoặc điền sẵn bằng `formatDate` (đủ năm) ở các hộp **sửa** (6f, 8b, 8d). ≈ 5–10 dòng SP + test ở `appointment-form.test.ts` / `policy-form.test.ts` (đọc lại chữ điền sẵn với `today` của năm sau).




### CL-E3 — Thùng rác: mọi nút "Khôi phục…" cùng một tên, bảng không có tiêu đề dòng; trình đọc màn hình không biết nút nào khôi phục bản ghi nào, nút tắt không nói vì sao

```
ID: CL-E3
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/SettingsTrash.tsx:102-114 (cột `actions`, `header: ''`, nút chỉ có chữ `t('trash.restore')`), :46-48 (lý do chặn là `span` trong ô Bản ghi, không nối với nút); packages/ui/src/components/DataTable.tsx:176 (ô thân bảng đều là `td`, không có `th scope="row"`) (8855345)
Tình trạng: CONFIRMED (bản web)
```

- **Mô tả:** cột cuối của bảng "Bản ghi đã xóa" có tiêu đề rỗng; mỗi dòng có nút tên "Khôi phục…" giống hệt, không `aria-label` / `aria-describedby` nêu bản ghi, và bảng không có ô tiêu đề dòng. Người dùng trình đọc màn hình duyệt theo danh sách nút (hoặc Tab qua bảng) nghe 117 lần "Khôi phục…" mà không biết của KH / lịch / HĐ nào; với dòng bị chặn, nút "Khôi phục…" tắt và câu lý do ("Khôi phục KH … trước.") nằm ở ô khác, không đọc kèm nút. Cùng app đã làm đúng cách này ở thẻ Hợp đồng (`CustomerPolicies.tsx:87`, `:96`: `aria-label` "Phát hành HĐ nộp {date}" / "Sửa HĐ nộp {date}").
- **Tái hiện:** bản web (cổng 4320), nhập dữ liệu tải, Cài đặt → Thùng rác: `117 bản ghi`; 5 nút đầu `{"text":"Khôi phục…","aria":null}` ×5; `tbody th` = 0.
- **Ảnh hưởng:** người dùng trình đọc màn hình ở màn Thùng rác (thao tác thường), không sai dữ liệu → Low.
- **Đề xuất:** `aria-label` cho nút theo `recordTitle(row)` (vd. khóa mới `trash.restoreLabel` "Khôi phục {kind} {title}"), `aria-describedby` trỏ tới dòng lý do khi bị chặn; tiêu đề cột ẩn (`sr-only`) cho cột nút. ≈ 10 dòng SP + 1 khóa i18n; e2e `trash.spec.ts` đang chọn nút theo tên "Khôi phục…" trong dòng nên cần đổi `name` (hoặc dùng regex).

### CL-E4 — Ghi kết quả (6c) một lịch "Chưa ghi kết quả" cũ hơn lần đổi nhóm mới nhất của KH: hộp đưa nhóm **hiện tại** làm "giữ nguyên"; mọi lựa chọn khác chắc chắn bị từ chối sau khi bấm Lưu, lựa chọn duy nhất lưu được ghi sai nhóm của ngày đó (đường vào mới của gốc CL-A2)

```
ID: CL-E4
Mức: Low
Trục: C, E
Vị trí: apps/desktop/src/routes/appointments/OutcomeDialog.tsx:163 (`from={customer.stage}`); MetFields.tsx:82-90 (`stageAfterChoices(from)`, nhãn "giữ nguyên"), :154 (`outcome.keepRead` "Giữ nhóm hiện tại, không tạo chuyển nhóm."); outcome-form.ts:67-74; gốc ở packages/db/src/appointments.ts:289-293 (`outcomeStage` so với nhóm hiện tại), :358-361 — cùng gốc với CL-A2 (8855345)
Tình trạng: CONFIRMED (probe Node trên `@p2c/db` + hàm view của hộp)
```

- **Mô tả:** khi RE ghi bù kết quả của một lịch đã qua còn "Chưa ghi kết quả" mà sau ngày đó KH đã đổi nhóm (chuyển tay, hoặc một cuộc gặp sau đã ghi đổi nhóm), hộp 6c tính mọi thứ từ **nhóm hiện tại**: nhóm hiện tại được đánh "giữ nguyên", dòng dưới ghi "Giữ nhóm hiện tại, không tạo chuyển nhóm." Mọi nhóm khác (kể cả nhóm KH thật sự có ở ngày cuộc gặp) bị lệnh từ chối `TRANSITION_BEFORE_LATEST` — chỉ biết sau khi bấm Lưu. Lựa chọn duy nhất lưu được là nhóm hiện tại, nên cuộc gặp được ghi "nhóm sau N2 / Giữ N2" ở ngày KH còn N3 (dòng thời gian: "05/09 Đã gặp · Giữ N2" rồi "15/09 N3 → N2"). Ở 6f (sửa), app đã có khóa D7 báo trước; ở 6c thì không.
- **Tái hiện** (`node p6-backfill.mjs`, log `p6-backfill.log`; DB bộ nhớ, hôm nay 12/10/2026): KH Lan tạo N3 01/09; lịch 05/09 để Dự kiến (thành Chưa ghi kết quả); chuyển tay N3 → N2 15/09. `stageOn` ngày 05/09 = **N3**. Hộp 6c đưa `["N4","N3","N2 (giữ nguyên)","N1","ON_HOLD","LOST"]`. Ghi nhóm sau N3 → `TRANSITION_BEFORE_LATEST {"date":"15/09/2026"}`; N1 → cùng lỗi; N2 → OK, `stage_after=N2`, không thêm chuyển nhóm (2 → 2), cột Kết quả "Giữ N2". (Probe gói A `s2-scenarios.log` S1 cũng có dòng "ghi mới cuộc gặp 12/09 nhóm sau N2 (= nhóm hiện tại): OK" nhưng CL-A2 chỉ nêu đường 6f.)
- **Ảnh hưởng:** RE ghi kết quả muộn (đúng việc nhóm "Chưa ghi kết quả" nhắc làm), hoặc nhập bù một cuộc gặp cũ (6b "Giữ nguyên = ghi lịch hẹn quá khứ (nhập bù)", rồi 6c ghi kết quả), sau khi KH đã đổi nhóm: hộp gợi ý sai, phần lớn lựa chọn hỏng sau khi bấm Lưu, lựa chọn lưu được làm lịch sử nhóm tự mâu thuẫn. Chỉ số không đổi (không có chuyển nhóm, không RF). Dữ liệu tải không có ca này (seed ghi kết quả mọi lịch đã qua), nên không đếm được tần suất.
- **Đề xuất (cần Owner chọn, cùng quyết định với CL-A2):** hộp 6c lấy `from` = nhóm của KH tại ngày cuộc gặp (`stageOn`) và, khi KH đã có chuyển nhóm sau ngày đó, khóa "Nhóm sau cuộc gặp" kèm dòng giải thích như 6f; lệnh `recordMeetingOutcome` coi "nhóm sau = nhóm tại ngày cuộc gặp" là giữ nhóm. ≈ 20–30 dòng SP + test ở `outcome-form.test.ts` / `appointments.test.ts`.

### CL-E5 — Lệch nhỏ giữa màn gói E và mockup / golden đã duyệt, chưa có trong "Lệch mockup đã biết"; golden và mockup ghi khác nhau cách viết tỉ lệ chốt

```
ID: CL-E5
Mức: Nit
Trục: C
Vị trí: (1) docs/golden/chi-so.md:93-114 ("0%", "100%", "150%") ↔ docs/design/mockups/overview.html:897-906 ("100,0%", "60,0%", "0,0%"), reports.html 2f ("60,0%") ↔ docs/testing/nghiem-thu-v1.md:84 (NT-TQ-06 "một chữ số thập phân") ↔ packages/domain/src/number.ts:16-22 (`formatPercent` bỏ ",0"); (2) overview.html:831, :1009 ô Lịch hẹn "Dời – hủy – không đến" ↔ apps/desktop/src/routes/overview/OverviewTiles.tsx:49 (`APPOINTMENT_GROUPS` → "Dời lịch / hủy / không đến"); (3) overview.html:865 "· 7 HĐ phát hành ÷ 16 RF" nhưng :1020, :1093 "6 ÷ 14 RF", "2 ÷ 3 RF" (mockup tự lệch; app theo dạng đầy đủ); (4) reports.html:364, :384 meta "30 RE · Tháng 10/2026 (MTD) · Toàn bộ", "5 mốc · Tháng 10/2026 (MTD) · Toàn bộ" ↔ vi.ts:905, :907 ("{re} RE · thứ tự theo team rồi tên", "{count} mốc"); (5) appointment-forms.html:146 (6c) "· lần 3 · hiện N2" ↔ vi.ts:765 `outcome.sub` không có "lần n"; (6) settings-data.html:120-121 "· 3.470 ghi chú KYC", "· mới nhất 26/09/2026 07:40" ↔ vi.ts:1001 (`settings.backup.counts` không có ghi chú KYC), :974 ("· mới nhất {file}") (8855345)
Tình trạng: CONFIRMED (so chữ mockup bằng `mocktext.mjs` với `vi.ts` / code; màn đo trên bản web cổng 4320: So sánh team có "175%" cạnh "212,5%")
```

- **Mô tả:** sáu chỗ chữ trên màn gói E khác mockup đã duyệt. (2)–(6) danh mục nghiệm thu đã ghi theo chữ của app (NT-TQ-04, NT-BC-05/06, NT-LH-21, NT-CD-02) nên G7 không đỏ; chỉ thiếu dòng trong "Lệch mockup đã biết". (1) là mâu thuẫn giữa hai tài liệu đã duyệt: golden G2 viết "100%", "150%", mockup G3 viết "100,0%", "60,0%", "0,0%", còn NT-TQ-06 đòi "một chữ số thập phân" — app theo golden (bản web: "175%", "400%", "300%" cạnh "212,5%"), nên người kiểm G7 đọc NT-TQ-06 theo chữ có thể ghi lỗi. File Excel lại luôn một chữ số (`numFmt` `0.0%`, `report-workbook.ts:32`), khác màn ở cùng ô.
- **Ảnh hưởng:** không sai số, chỉ chữ / định dạng.
- **Đề xuất:** Owner chọn cách viết tỉ lệ (giữ golden và sửa câu NT-TQ-06, hoặc ngược lại); ghi (2)–(6) vào "Lệch mockup đã biết" (docs-only). Không sửa mockup / golden cho khớp code khi chưa hỏi.

### CL-E6 — Thứ tự chấm "Dự kiến" trong ô ngày (đứng cuối, sau Đã gặp / Dời – hủy) không test nào giữ (đột biến AV8 sống)

```
ID: CL-E6
Mức: Nit
Trục: T
Vị trí: apps/desktop/src/routes/appointments/appointments-view.ts:313-318 (`DOT_ORDER`); appointments-view.test.ts:597-601; e2e/appointments.spec.ts:606-612 (8855345)
Tình trạng: CONFIRMED (đột biến)
```

- **Mô tả:** đưa `'planned'` lên đầu `DOT_ORDER` mà cả 2 755 test vitest vẫn xanh: unit test chỉ dựng ô có Đã gặp + Chưa ghi kết quả, e2e chỉ kiểm chấm đầu của một ngày đã qua. Một ngày không thể vừa có "Chưa ghi kết quả" vừa có "Dự kiến" (cùng ngày, so với hôm nay), nên quy tắc chính của mockup (chấm cam đứng đầu) vẫn được giữ; chỉ phần "Dự kiến đứng sau Đã gặp / Dời – hủy" (ngày hôm nay hoặc tương lai > 8 chấm sẽ che chấm Đã gặp / Hủy) là hở.
- **Tái hiện:** `node mutate.mjs AV8` → `AV8 dots planned first → SURVIVED (package E tests and the whole vitest suite: 2755 passed)`.
- **Đề xuất:** thêm một ca `dayLabel` cho ô hôm nay có Dự kiến + Hủy + Đã gặp, kiểm thứ tự phần "— Dời lịch / hủy / không đến 1, Đã gặp 1, Dự kiến 9" (≈ 3 dòng test).



### CL-E7 — Cài đặt → Dữ liệu giữ cả hai thông báo "Đã nạp lại …" và "Đã nhập backup …": sau một lần nhập, câu "Đã nạp lại dữ liệu giả lập, neo ở ngày …" vẫn hiện dù dữ liệu đang là của file

```
ID: CL-E7
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/Settings.tsx:71, :91-96 (`outcome` riêng của DemoSection); apps/desktop/src/routes/SettingsBackup.tsx:40, :143-148 (`notice` riêng của BackupSection) (8855345)
Tình trạng: CONFIRMED (bản web)
```

- **Mô tả:** hai khối của Cài đặt → Dữ liệu giữ thông báo thành công riêng, không khối nào xóa thông báo của khối kia khi dữ liệu bị thay lần nữa. Nạp lại rồi Nhập backup (hoặc ngược lại) trong cùng lần mở Cài đặt thì cả hai câu cùng hiện; câu cũ nói về dữ liệu đã bị thay. Ở exe câu nạp lại còn kèm "Backup: Project2C-data\backups\…" của lần trước.
- **Tái hiện:** bản web (cổng 4320), Cài đặt → Dữ liệu: Nạp lại… → gõ `NẠP LẠI` → Nạp lại → `role=status` = `["Đã nạp lại dữ liệu giả lập, neo ở ngày 14/10/2026."]`; rồi Chọn file… (dữ liệu tải) → Thay dữ liệu → `role=status` = `["Đã nhập backup xuất lúc 13/10/2026 20:51.","Đã nạp lại dữ liệu giả lập, neo ở ngày 14/10/2026."]`, thẻ File dữ liệu "4 team · 51 nhân sự · 1.481 KH · 10.252 lịch hẹn · 1.674 HĐ" (dữ liệu của file).
- **Ảnh hưởng:** chỉ sai hiển thị tới khi rời Cài đặt; người dùng có thể hiểu nhầm dữ liệu đang dùng là bộ giả lập mới.
- **Đề xuất:** một thông báo chung cho mục Dữ liệu (nâng state lên `Settings`), hoặc mỗi khối bỏ thông báo của mình khi `generation()` đổi mà không do chính nó; ≈ 10 dòng SP + một ca e2e (`demo-data.spec.ts` / `backup.spec.ts`).
## 4. Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `pnpm exec tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` (log `tsc-unused-app.log`) | app (gồm mọi file gói E) | exit 0, 0 dòng | — |
| `node exports.mjs` (log `exports.log`): mọi `export` của 37 file SP `.ts/.tsx` gói E, tìm nơi dùng ngoài file bằng `git grep -w` ở `HEAD` | gói E | Không export runtime nào chết. Chỉ test dùng (nhưng vẫn dùng trong chính file, nên không thừa): `buildReportWorkbook`, `reportFileName`, `reportWorkbookMeta`, `readFyp`, `OUTCOME_CHOICES`, `markName`. 21 kiểu chỉ dùng trong file (không tốn gì lúc chạy) | — |
| Khóa i18n | `vi.ts` | Đã kiểm ở gói D (`claude\D\keys.log`: 0 khóa không dùng, 0 khóa chỉ test dùng) — không chạy lại; quét chuỗi cứng trong 24 file `.tsx` gói E: không có chuỗi UI cứng (mọi chữ qua `t()`) | — |
| Code lặp ≥ 3 nơi (`git grep`) | gói E | `plain` (bỏ dấu) ×3: `trash-view.ts:48`, `appointment-form.ts:111`, biến thể `report-workbook.ts:224` — KNOWN (#543). Hằng class thẻ / khung báo (`CARD` `appointments-view.ts:63`, `ReportsScreen.tsx:20`, `ALERT` `SettingsBackup.tsx:33`…) — đã nêu ở CL-D7, không báo lại. Lặp 2 nơi (dưới ngưỡng, chỉ ghi): `download()` (`SettingsBackup.tsx:169` ≡ `ReportExport.tsx:88` trừ MIME); `whenText` (`RescheduleFields.tsx:11`) ≡ `dateTime` (`AppointmentsScreen.tsx:557`); cộng Σ + tỉ lệ chốt của dòng Tổng (`team-compare-view.ts:75-93` ↔ `reports-view.ts:108-131`) | — |
| Nhánh không tới được | `trash-view.ts:335-336` | `row.stageAfter === null` cho lịch Đã gặp không xảy ra được (CHECK `appointments_met_outcome`, `packages/db/src/schema.ts:146-149`); 2 dòng, không đo được chi phí — không thành phát hiện | — |
| Đột biến tương đương (không phải test hở) | `overview-view.ts:92`, `appointments-view.ts:193` | O2 (`window.end.year` thừa: cửa sổ trước luôn kết thúc trước kỳ nên cùng năm với ngày đầu khi ngày đầu cùng năm), AV1 (`a.status === 'MET'` thừa nhờ CHECK `appointments_stage_after`) — có thể bỏ vế thừa, ≤ 2 dòng, không đổi hành vi | — |
| Dependency / bundle | `common\baseline.md`, `claude\E\web\index.html`, `report-workbook.ts:158` | `exceljs` (929 569 B, gzip 255 572) chỉ tải ở lần Xuất Excel đầu (`import('exceljs')`) — đúng; `chart.js` (ECharts, 513 302 B) `modulepreload` ngay khi mở vì màn đầu Tổng quan có biểu đồ (gói E cần ngay) — không có gì để tách thêm trong phạm vi gói | — |
| `pnpm lint:deps`, `pnpm codemap` | `common\baseline.md` | 0 vi phạm; bản đồ export khớp code (`pnpm verify` xanh ở SHA ghim) — không chạy lại | — |
| Đề xuất refactor | — | Không có đề xuất mới ngoài CL-D7 / KNOWN `plain`. Nếu gộp `download()` vào một helper của `data/` (≈ −8 dòng, 2 file; test giữ: e2e `backup.spec.ts` "export notice…", `reports.spec.ts` xuất Excel) | — |

## 4b. Hiệu năng

**Máy / lúc đo:** Home PC `DESKTOP-KDURKJP` (i9-12900K, 24 luồng), Node v24.20.0, 14/10/2026 ≈ 01:20–01:45. Song song: 3 tiến trình `codex` (bên Codex ở `Project-2C-review-2`), 1 `opencode`; tải CPU ≈ 5 % lúc ghi. Đột biến (`mutate.mjs`) chạy riêng, không trùng lúc đo. Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` (Node: `importBackup` 816 ms → 1 481 KH sống, 10 252 lịch hẹn, 1 674 HĐ, 4 883 chuyển nhóm, 51 nhân sự, 4 team; Thùng rác 117 dòng). Hôm nay của probe Node = 12/10/2026.

**Node, hàm thuần mà màn gói E chạy (không React)** — `node p1-perf.mjs` (log `p1-perf.log`), `p5-dialog-render.mjs` (log `p5-dialog-render.log`); trung vị (min–max), n lần:

| Thao tác | n | Trung vị | Min–max | So với | ID |
|---|---:|---:|---|---|---|
| Tổng quan, một lần Lọc (ô Lịch hẹn + 6 KPI + KH theo nhóm + chart option + So sánh team), Ngày / Tuần / Tháng / Năm / Tùy chọn 3 tháng, Toàn bộ | 7 | 6,1 / 5,0 / 7,7 / 8,5 / 5,6 ms | 4,8–11,1 | exe `overview.filter-year` 15 ms, `filter-month` 14 ms; ngưỡng 200 | — |
| … góc nhìn Team (4 chart) / RE | 7 | 5,1–8,4 / 1,0–1,4 ms | | | — |
| Báo cáo, `reportRows` + `reportCells` mọi dòng, Ngày … Tùy chọn, Toàn bộ / Team / RE | 7 | 5,1–7,2 / 3,8–5,0 / 3,1–4,0 ms | 2,9–8,9 | exe `reports.filter-year` 9 ms, `table-re` 17 ms | — |
| Báo cáo, `buildReportWorkbook` Năm · Toàn bộ (4 sheet) | 5 | 7,9 ms | 7,0–216 (lần đầu nạp `exceljs`) | exe `reports.export-excel` 24 ms | — |
| Lịch hẹn, `appointmentRows` Toàn bộ / Team / RE | 7 | 2,6 / 1,2 / 0,6 ms | | | — |
| Lịch hẹn, lọc kỳ + dòng đếm / `monthGrid` / `yearGrid` / `dayBoard` / `appointmentsByRe` (Toàn bộ) | 7 | 0,6 / 0,8 / 0,3 / 0,6 / 0,7 ms | ≤ 1,3 | exe `appointments.period-*` 8–17 ms, `next-month` 102 ms (phần lớn là React + vẽ) | — |
| Thùng rác, `listTrash` (117 dòng) / đếm + lọc + tìm / `restoreView` mọi dòng | 7 | 43,0 / 0,1 / 0,4 ms | 40,8–53,3 | exe `trash.open` 80 ms; tăng theo số KH đã xóa: CL-A1 (không báo lại) | CL-A1 |
| Cài đặt → Dữ liệu, `countRecords` | 7 | 4,9 ms | 4,7–5,3 | | — |
| Mỗi lần render hộp: `priorMeetings` (KH 38 lịch) / `searchCustomers` / `outcomeLock` / `readPolicy` | 30 | 0,40 / 0,97 / 0,04 / 0,00 ms | ≤ 2,1 | 16 ms / phím | — |

**Bản web ở SHA ghim (có React, không vẽ khung hình)** — `claude\E\web\` (bản `apps/desktop/dist`) do `serve.mjs` phục vụ ở cổng 4320, mở trong khung trình duyệt của Claude Code, dữ liệu tải nhập qua Cài đặt → Dữ liệu (thời gian đọc / thay không đo ở gói này). Đo từ thao tác tới lúc DOM có kết quả (dò bằng `MessageChannel`, như `claude\D\p4-web-perf.js`); không gồm vẽ nên chỉ so với ngưỡng 200 ms, không so trực tiếp với `perf-ref.json`. Hôm nay của bản web = 14/10/2026 (đồng hồ thật).

| Thao tác (bản web, dữ liệu tải) | n | Trung vị | Min–max | ID |
|---|---:|---:|---|---|
| Thùng rác: Khôi phục một lịch hẹn → hộp đóng, bảng và số "n bản ghi" cập nhật (một lần ghi + `listTrash` lại) | 5 | 71,8 ms | 70,1–75,4 | — |
| Thùng rác: lọc loại Lịch hẹn / về Tất cả | 6 | 4,4 / 6,6 ms | 4,0–8,6 | — |
| Lịch hẹn: mở hộp Ghi kết quả / Lưu kết quả (Hủy) → hộp đóng, chi tiết ghi Hủy (đọc lại bảng lịch hẹn 10 252 dòng) | 4 | 7,4 / 88,9 ms | 6,6–24,9 / 83,9–95,5 | — |
| Lịch hẹn: đổi ô Phối hợp sang một người / về Bất kỳ | 6 | 2,0 / 7,3 ms | 1,4–8,6 | — |
| Báo cáo: đổi bảng Theo team → Theo RE (45 dòng × 18 ô) / → Theo mốc / → Theo team | 6 | 1,1 / 0,5 / 0,4 ms | 0,2–1,9 | — |

Không có thao tác nào của gói E vượt 200 ms trên dữ liệu tải (exe tham chiếu cùng máy: mọi thao tác màn gói E trong `perf-ref.json` ≤ 102 ms). Không có phát hiện trục P mới (CL-A1 của gói A là phần tăng theo số KH đã xóa của Thùng rác).




## 5. Bảng đếm mức × trục

Đếm theo trục chính (trục đầu tiên ghi ở phát hiện); trục phụ trong ngoặc.

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | | | | | | 0 |
| Low | 1 (CL-E2, + D) | 3 (CL-E1, CL-E4 + E, CL-E7) | | | | | | | 1 (CL-E3) | 5 |
| Nit | | 1 (CL-E5) | | | | | | 1 (CL-E6) | | 2 |
| **Tổng** | 1 | 4 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | **7** |

Cả 7 phát hiện đều CONFIRMED (có lệnh / probe / thao tác bản web và kết quả thật); 0 PLAUSIBLE, 0 KNOWN mới. Mục đã báo ở gói trước mà gói E chạm tới chỉ dẫn ID: CL-A1 (`listTrash` theo số KH đã xóa), CL-A2 (gốc của CL-E4), CL-D7 (hằng class thẻ / khung báo, gồm file gói E).

## 6. Đã xét, không thấy

- **E — Edge case:** biên năm / tuần vắt năm / ngày 1 / ngày cuối tháng của "Đang xem", KPI và Theo mốc: đọc `overview-view.ts`, `reports-view.ts` và 84 đột biến (81 bị giết, gồm mọi luật C01–C11, M01–M04, MTD ngày cuối); vòng `formatVnd` → `parseVnd` 2 018 số tiền và `dayText` → `parseQuickDate` 3 204 ngày, 0 lệch (`p2-roundtrip.log`); `formatVndCompact` luôn có dấu cách cho `splitUnit` (5 021 giá trị, `p3-compact.log`); `exportedAt` của file: zod chặn ngày không có thật (30/02, 31/04, giờ 24) (`p4-exported-at.log`; chỉ năm 0000 / 9999 viết lạ, file sửa tay — không thành phát hiện); tên file Excel với góc nhìn chỉ có chữ không Latin → phần góc nhìn rỗng, tên vẫn hợp lệ với luật `is_export_name` (`storage.rs:464-470`). Nửa đêm: ngoài CL-E2, các màn Tổng quan / Báo cáo / Lịch hẹn tính lại theo `useToday` (deps có `today`); ngày đang chọn không tự nhảy là ACCEPTED (#334). Hai thao tác chồng nhau: nút Xuất Excel / Xuất backup tắt khi `busy`, mọi hộp ghi đều modal — không thấy đường chồng nhau mới.
- **C — Hợp đồng / nhãn:** số khớp giữa màn trên bản web với dữ liệu tải: Tổng quan Tháng (215 / 777, RF 13, HĐ nộp 58 …) = Tổng hợp Báo cáo = dòng đếm Lịch hẹn ("777 lịch · 215 đã gặp · 57 chưa ghi kết quả"); Tạm hoãn + Mất cơ hội = "590 đã đóng" ở Khách hàng (NT-BC-03); Năm: dòng đếm Lịch hẹn "8.109 lịch · 5.820 đã gặp · 53 chưa ghi kết quả" = ô Lịch hẹn Tổng quan, Σ 4 quý = 8.109 (NT-LH-36); Σ team = Tổng ở So sánh team. Nhãn theo nghĩa thường ("cả kỳ", "tới hôm nay", "KH cuối kỳ", "Chưa ghi kết quả" = trước hôm nay, "Xóa lúc"): đúng spec Phase 4 §1, §2, §4 và Phase 6 §4.2 (TR-1…TR-10, E1–E17 có test).
- **D — Dữ liệu:** khôi phục đi qua đúng lệnh `restore…` của từng loại (`trash-view.ts:419-438`), lỗi hiện trong hộp; Excel giữ số thật (tiền theo đồng, tỉ lệ là phân số) — test `report-workbook.test.ts`; nhập / nạp lại dùng `app-data` (gói B). Ngoài CL-E2 không thấy đường ghi sai dữ liệu.
- **G — Guardrail AI:** gói E không có file AI (khối KYC Intelligence chỉ đọc ở chi tiết lịch là `AppointmentAi.tsx`, gói C) — không áp dụng.
- **S — Ranh giới:** tên file Excel chỉ ASCII, cắt 60 ký tự (test W4, W5, W10 bị giết); tên team / RE vào ô Excel là chữ, không thành công thức (test giữ); tooltip chart escape tên team (F-18, test `stage-chart.test.ts` "shows a team name as text, never as HTML"); link "Mở hồ sơ" dựng bằng `routeToHash` (mã hóa id); file > 100 MB bị từ chối trước khi đọc; tải về bản web dùng object URL MIME cố định. Không thấy.
- **P — Hiệu năng:** mục 4b — mọi thao tác gói E trên dữ liệu tải < 200 ms (Node ≤ 8,5 ms cho tính toán, web ≤ 96 ms cho lưu + vẽ lại, exe tham chiếu ≤ 102 ms).
- **B — Bloat:** mục 4 — không export runtime chết, không chuỗi cứng, chỉ lặp 2 nơi (dưới ngưỡng) và KNOWN / CL-D7.
- **T — Test:** 84 đột biến trên 12 file `.ts` gói E: 81 bị unit test giết; 3 sống: O2, AV1 tương đương (mục 4), AV8 → CL-E6. File `.tsx` không có test component (công cụ test component là G4, KNOWN `DataTable`); e2e có cho từng màn (`overview`, `reports`, `appointments`, `appointment-outcome`, `customer-policies`, `trash`, `backup`, `demo-data`) — không chạy lại (cổng 4173 dùng chung với Codex; kết quả cổng ở `baseline.md`: 210 passed). Một e2e ghim đúng bản lệch mockup: CL-E1.
- **A — Trợ năng / i18n:** tương phản 26 cặp chữ / nền gói E dùng (`contrast.log`): thấp nhất 4,82:1 (số ngày `text-fg-3` trên dải kỳ), mọi cặp ≥ 4,5:1; `role="status"` / `aria-live` cho dòng nhắc Lọc và "Đang xem"; ô ngày / ô tháng có tên đọc được (DR-16); không chuỗi UI cứng. Thấy CL-E3. Đã biết (không báo lại): chart không có bảng cho trình đọc màn hình, ô ngày ngoài tháng `aria-hidden` (KNOWN #156, Phase 4 P8).

## 7. Phụ lục

**Nguồn probe** (đều trong `C:\workspace\deep-review-1-6\claude\E\`, chạy bằng `node <file>` với `hooks.mjs` — bản chép hook của gói D, thêm `@p2c/ui` → `ui-stub.mjs` vì `index.ts` của `ui` kéo file `.tsx`):

- `list.mjs` → `list.log` (danh sách file gói E theo `classifyFile`).
- `p1-perf.mjs` → `p1-perf.log` (mục 4b, Node).
- `p2-roundtrip.mjs` → `p2-roundtrip.log` (vòng định dạng → đọc lại tiền / ngày; ca giao thừa của CL-E2).
- `p3-compact.mjs` → `p3-compact.log`; `p4-exported-at.mjs` → `p4-exported-at.log`; `p5-dialog-render.mjs` → `p5-dialog-render.log`.
- `p6-backfill.mjs` → `p6-backfill.log` (CL-E4).
- `exports.mjs` → `exports.log`; `contrast.mjs` → `contrast.log`; `mocktext.mjs` → `mock-*.txt`.
- `serve.mjs` (cổng 4320) + `web\` (bản chép `apps/desktop/dist`; `web\clock.html` = `index.html` thêm đồng hồ dời cho CL-E2; `web\load.p2cbackup` bản chép dữ liệu tải — xóa cuối phiên); các bước chạy trong trang: `p7-web-steps.js`.
- `tsc-unused-app.log` (rỗng, exit 0).

**Đột biến** (`mutate.mjs`, 14/10/2026 ≈ 01:25–01:35: patch một file `.ts` gói E trong worktree, chạy test gói E — `routes/overview`, `routes/reports`, `routes/appointments`, `customers/policy-form`, `applied-filter`, `trash-view` — với `--bail=1`, sống thì chạy cả bộ vitest; trả file về từng byte, so `git show HEAD:` trước / sau; e2e không chạy). Kết quả `mutate.log`, `mutate-results.json`:

- 84 đột biến: `overview-view` O1–O8, `stage-view` S1–S5, `stage-chart` C1–C4, `team-compare-view` T1–T4, `reports-view` R1–R10, `report-workbook` W1–W11, `applied-filter` A1–A4, `appointments-view` AV1–AV11, `appointment-form` F1–F6, `outcome-form` OF1–OF6, `policy-form` PF1–PF6, `trash-view` TV1–TV9.
- **Bị giết (81):** mọi đột biến trừ ba dưới; tên test giết từng đột biến ở `mutate.log`.
- **Sống (3):** O2 (tương đương), AV1 (tương đương nhờ CHECK của DB), AV8 → CL-E6.
- `git status --short` sau khi chạy: rỗng.

**Thao tác trên bản web** (dữ liệu chỉ trong bộ nhớ trình duyệt, không ghi gì ra đĩa): nhập dữ liệu tải (2 lần); Tổng quan / Báo cáo Năm (CL-E1); sửa kết quả một lịch Hủy và mở hộp Phát hành HĐ qua giao thừa giả (CL-E2, hộp HĐ đóng bằng Hủy); Thùng rác (CL-E3), khôi phục 5 lịch hẹn (đo); ghi kết quả Hủy cho 4 lịch Chưa ghi kết quả (đo); Nạp lại + Nhập backup (CL-E7).

**Tác dụng phụ ngoài repo:** không mở exe, không gọi dịch vụ AI, không đọc key, không chạy `pnpm e2e`; server tĩnh cổng 4320 tắt cuối phiên.


**`git status --short` cuối phiên** (14/10/2026 01:45): rỗng; `git rev-parse HEAD` → `885534549808f42aec7f9af5743bbf86642ee4bd`. Cổng 4320 không còn tiến trình nghe; `web\load.p2cbackup` đã xóa.

**Giờ xong:** 14/10/2026 01:45.

