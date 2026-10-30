XONG — codex gói E lượt 4, 2026-10-29 15:49:20 +07:00

# Deep review Phase 1–6, lượt 4 — Codex gói E

## 1. Thông tin phiên

- Bên: Codex; gói E — Lịch hẹn, chỉ số, quản lý; phiên mới.
- SHA đầu phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076` (đúng SHA ghim).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-29 15:09:25 +07:00 (Asia/Bangkok).
- Công cụ: Codex desktop; `codex --version` trả `codex-cli 0.162.1` (kèm cảnh báo không dọn được thư mục arg0 do quyền truy cập).
- Model: hệ thống nhận diện GPT-6; prompt giao việc ghi GPT Sol 6.1. Công cụ hiện có không trả định danh model chính xác hoặc mức suy luận, nên không tự xác nhận hai trường này.
- Kiểm Bước 0: A–D tồn tại và dòng đầu `XONG`; E chưa tồn tại. Không đọc nội dung báo cáo A–D ngoài dòng đầu phục vụ kiểm gói.
- Quy tắc: repo chỉ đọc; probe/đột biến/log lưu riêng tại `C:\workspace\deep-review-1-6-r4\codex\E\`; không gọi AI thật hoặc đọc báo cáo lượt 4 bên khác.

**Kết quả gói E:** R1 9/9 và R2 10/10 ĐÃ SỬA trong phần E; 2 Low CONFIRMED mới (CXR4-E1/E2), đều là lỗi hiển thị tên dài có từ trước. 647 unit và 126 e2e gốc qua; 4 test probe UI bổ sung qua; 343 tổ hợp helper và 9 sheet cũ/mới không lệch.

## 2. Bảng R1 và R2

Kết luận các dòng chung nhiều gói chỉ áp phần E; F gộp toàn bộ. Với refactor tương đương, test hành vi giữ xanh; kiểm cấu trúc theo tiêu chí rg của Issue được ghi riêng, không gọi là regression test do PR thêm.

### R1

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-110 | #721 → #738 | ĐÃ SỬA | U110-money bỏ normalizeText: 11/155 test parser đỏ; U110-date: 6/160 đỏ. Đối chứng cuối 647/647 unit xanh, gồm 14 file E + hai parser. | readCaseSize/readFyp/readScheduleDate nối đúng parser chung; khoảng trắng Unicode, ký tự vô hình, NFD có test gốc. |
| DR6-119 | #725 → #748; #785 → #833 | ĐÃ SỬA | E2E hai HĐ cùng ngày khác FYP; hai HĐ cùng FYP khác trạng thái; tên khôi phục theo ô đều xanh. P119-FYP bỏ FYP của nút phát hành → e2e đỏ; U305-badge bỏ badge khỏi tên khôi phục → unit đỏ. | FYP dùng dạng đồng đầy đủ; trạng thái HĐ được nói cả ở tên Sửa; khớp recordBadge/recordTitle. |
| DR6-128 | #725 → #748 | ĐÃ SỬA | P128-reminder/canPurge/trim/NFC/Escape/cancel/6f: 7/7 đột biến làm nguyên test gốc đỏ; control thuộc e2e-base-2.log xanh. | Bộ lọc không khớp vẫn dọn mọi dòng; NFD đúng bật; Escape/Hủy khi backup giữ không đóng; E19 khóa đúng nhóm đã giữ. |
| DR6-131 | #729 → #755; #756 → #758 | ĐÃ SỬA | Mockup appointment-forms.html:244 và NT-LH-25 :137 ghi 1,234 tr = 1.234.000.000 ₫, 0,500 tr = 500.000 ₫; kiểm tĩnh R131-doc xanh; money.test xanh. | Sửa tài liệu, không có đột biến code phải giết. Không đổi quyết định Owner #106. |
| DR6-134 | #720 → #740; #775 → #804 | ĐÃ SỬA | meetingDay gọi stagesOfDay; U134-day bỏ fallback ngày trước tạo KH → 1/34 unit đỏ. N7: 343 tổ hợp helper cũ/mới trùng. | Snapshot trước ngày tạo KH không đếm KH; fallback chỉ phục vụ nhóm của cuộc gặp. |
| DR6-37 | #655 → #693; #790 → #845 | ĐÃ SỬA | Ký hiệu nút bỏ người phối hợp và So sánh team qua i18n. S37 trả ký hiệu về JSX → kiểm tĩnh tiêu chí Issue đỏ. | P-raw-37-equivalent vẫn e2e xanh: ký hiệu giữ nguyên nên đây là đột biến tương đương, không phải lỗ test hành vi. |
| DR6-66 | #655 → #693; #790 → #845 | ĐÃ SỬA | markName không export; S66 phục hồi export → kiểm tĩnh tiêu chí Issue đỏ. tsc-unused exit 0; bỏ PLAIN_SLOTS khỏi API theo T-301. | Thu hẹp API không đổi kết quả runtime; không ép unit phải phân biệt hai export tương đương. |
| DR6-67 | #774/#775/#777/#782/#790 → #799/#801/#812/#807/#845 | ĐÃ SỬA | Phần E: CARD/ALERT/LINK/HEADING/PANEL dùng chung, 17 REPORT_COLUMNS dùng ở màn/Excel/reportCells. U301-column tách lệch header workbook → unit đỏ; N9: 9 sheet cũ/mới cùng ô và định dạng. | N7 so 343 tổ hợp trước/sau refactor; không lệch dữ liệu. N1/N2 là lỗi bố trí có từ trước, ghi riêng. |
| CL3-B2 | #783 → #817 | ĐÃ SỬA | E2E trash D7 → Thử lại → dọn xanh; P-B2-retry bỏ flush của Thử lại → nguyên test đỏ (alert expected 0, received 1). | N5 qua Nạp lại: lỗi lưu được hướng dẫn và thử lại; app không thay dữ liệu khi D7 từ chối. |

### R2

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-284 | #773 → #795 | ĐÃ SỬA | Mockup 8d có dòng −1/+1 HĐ theo tháng/năm; app policyChange/effectText và e2e 8d xanh; U296-count bỏ dòng số HĐ → 2/24 unit đỏ. | Phần E của G3 là 8d. Viền điều khiển và panel AI thuộc D/C; lệch in đậm của 8d đã KNOWN, không báo lại. |
| T-291 | #780 → #824/#828 | ĐÃ SỬA | Phần E luật 4/5: U291-reason và U291-previous đều đỏ khi gỡ sửa; e2e đầu năm 6b/6e/6h xanh. | 6e không tự tick Nhập bù; 6h không gợi ý năm trước. Luật nhập/output/hash được A/C kiểm. |
| T-295 | #784 → #825 | ĐÃ SỬA | Số liệu 10c + SCHEMA_TOO_NEW + đổi notice cũ đều có e2e xanh trong demo-data/backup; P295-10c đặt số KH=0 → e2e đỏ. N5 kiểm notice và lỗi lưu. | Phần E: hộp và DataSections. integrity_check/openFrom/AI generation thuộc B/C. |
| T-296 | #785 → #833 | ĐÃ SỬA | ConfirmWordDialog chung, P128 NFC/khóa hộp đều đỏ; U296-plan/E20/count đỏ. Unit đếm keptRecords khi mở/dọn xanh; N8 kế hoạch từ listTrash bằng preview và kết quả dọn 113 dòng. | U305-badge bảo vệ tên theo ô; HĐ cùng ngày/cùng FYP khác trạng thái phân biệt được; số ghi chú KYC có slot riêng. |
| T-298 | #787 → #838 | ĐÃ SỬA | E2E 6a history/6h không history xanh; P298-days bỏ tên ngày ngoài tháng/khoảng → e2e đỏ. Test writtenDay/DateSuggestion xanh. | Phần E: lịch và hộp; 5d/thẻ lịch KH thuộc D. Focus khung Chi tiết đã có ca bàn phím xanh. |
| T-299 | #788 → #841 | ĐÃ SỬA | Bảng trợ năng chart + tóm tắt xanh; P299-table bỏ bảng → locator không còn, test gốc đỏ. P299-blur-effective gỡ guard nội bộ → aria-invalid false/true, đỏ; control xanh. | N3, N4: chỉnh cặp ngày rồi đổi loại, ẩn cả bốn nhóm. Lần P299-blur đầu không có hiệu lực do junction, loại khỏi thống kê. |
| T-301 | #790 → #845/#846 | ĐÃ SỬA | markName private, class/i18n/cột một nơi; S66/S37 đỏ theo kiểm tĩnh, U301-column đỏ; N7/N9 không đổi kết quả so 119e2e4. | Test giữ hành vi, kiểm tĩnh giữ cấu trúc. Lỗi tên dài N1/N2 đã tồn tại trước refactor. |
| T-305 | #849 → #855 | ĐÃ SỬA | recordBadge dùng ở ô và tên khôi phục; U305-badge bỏ phần tên → test đỏ. HEADING/BADGE/WEB_MODE.tone đọc một nguồn. | Đã đọc diff class giữ chuỗi; chụp ảnh hướng dẫn/đồng hồ thuộc F. |
| T-306 | #850 → #857 | ĐÃ SỬA | Kiểm tĩnh T306-plan-doc xanh: S2-6 lỗi thì dữ liệu cũ đủ; 11i dùng purgePlan; TR-3 giải thích D10; ảnh 150 KiB; hướng dẫn dùng 01–06/09 và 14–20/09. | Tài liệu và lệch 8d/10c khớp app; không đột biến sản phẩm cho dòng tài liệu. ACL/ràng buộc file thuộc B. |
| T-310 | #865 → #871 | ĐÃ SỬA | Bốn tiêu đề E dùng HEADING; S310 trả một tiêu đề Lịch hẹn về chuỗi cũ → kiểm tĩnh đỏ. Ô Thùng rác dùng stageBadge(label) và recordBadge đúng. | Gói E chỉ kiểm tiêu đề và ô Thùng rác; tên app/quyền/ảnh/logo/bộ đếm thuộc B/D/F. |

## 3. Phạm vi đã đọc

Gói E theo classifyFile: **52 file; 38 file sản phẩm / 8.155 dòng; 14 file test / 4.556 dòng**. Rà code sản phẩm, fixture/assertion và phần nối của unit; chạy đủ 14 file test. Chú trọng diff **119e2e4..2e51e25**: **29 file SP, +978/−579; 9 file test, +456/−46**. Nguồn đầy đủ: scope.json, diff-E.patch, final-check.json (hash SHA-256 từng file).

| File từ gốc repo | Loại | Dòng rà |
|---|---|---|
| apps/desktop/src/routes/ConfirmWordDialog.tsx | SP | 1–67 |
| apps/desktop/src/routes/FilterBar.tsx | SP | 1–84 |
| apps/desktop/src/routes/Overview.tsx | SP | 1–61 |
| apps/desktop/src/routes/RestoreDialog.tsx | SP | 1–67 |
| apps/desktop/src/routes/Settings.tsx | SP | 1–189 |
| apps/desktop/src/routes/SettingsBackup.tsx | SP | 1–291 |
| apps/desktop/src/routes/SettingsDataFile.tsx | SP | 1–134 |
| apps/desktop/src/routes/SettingsTrash.tsx | SP | 1–400 |
| apps/desktop/src/routes/applied-filter.test.ts | Test | 1–109 |
| apps/desktop/src/routes/applied-filter.ts | SP | 1–51 |
| apps/desktop/src/routes/appointments/AppointmentDialog.tsx | SP | 1–469 |
| apps/desktop/src/routes/appointments/AppointmentsScreen.tsx | SP | 1–704 |
| apps/desktop/src/routes/appointments/DateSuggestion.test.tsx | Test | 1–37 |
| apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx | SP | 1–128 |
| apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx | SP | 1–266 |
| apps/desktop/src/routes/appointments/MetFields.test.ts | Test | 1–36 |
| apps/desktop/src/routes/appointments/MetFields.tsx | SP | 1–163 |
| apps/desktop/src/routes/appointments/OutcomeDialog.tsx | SP | 1–343 |
| apps/desktop/src/routes/appointments/RescheduleDialog.tsx | SP | 1–60 |
| apps/desktop/src/routes/appointments/RescheduleFields.tsx | SP | 1–146 |
| apps/desktop/src/routes/appointments/YearGrid.tsx | SP | 1–141 |
| apps/desktop/src/routes/appointments/appointment-form.test.ts | Test | 1–305 |
| apps/desktop/src/routes/appointments/appointment-form.ts | SP | 1–165 |
| apps/desktop/src/routes/appointments/appointments-view.test.ts | Test | 1–646 |
| apps/desktop/src/routes/appointments/appointments-view.ts | SP | 1–471 |
| apps/desktop/src/routes/appointments/outcome-form.test.ts | Test | 1–396 |
| apps/desktop/src/routes/appointments/outcome-form.ts | SP | 1–232 |
| apps/desktop/src/routes/customers/CustomerPolicies.tsx | SP | 1–116 |
| apps/desktop/src/routes/customers/PolicyDialogs.tsx | SP | 1–340 |
| apps/desktop/src/routes/customers/policy-form.test.ts | Test | 1–311 |
| apps/desktop/src/routes/customers/policy-form.ts | SP | 1–275 |
| apps/desktop/src/routes/overview/OverviewTiles.tsx | SP | 1–76 |
| apps/desktop/src/routes/overview/StageBlock.tsx | SP | 1–171 |
| apps/desktop/src/routes/overview/TeamCompare.tsx | SP | 1–125 |
| apps/desktop/src/routes/overview/overview-view.test.ts | Test | 1–312 |
| apps/desktop/src/routes/overview/overview-view.ts | SP | 1–252 |
| apps/desktop/src/routes/overview/stage-chart.test.ts | Test | 1–215 |
| apps/desktop/src/routes/overview/stage-chart.ts | SP | 1–197 |
| apps/desktop/src/routes/overview/stage-view.test.ts | Test | 1–252 |
| apps/desktop/src/routes/overview/stage-view.ts | SP | 1–158 |
| apps/desktop/src/routes/overview/team-compare-view.test.ts | Test | 1–128 |
| apps/desktop/src/routes/overview/team-compare-view.ts | SP | 1–129 |
| apps/desktop/src/routes/period-labels.ts | SP | 1–26 |
| apps/desktop/src/routes/reports/ReportExport.tsx | SP | 1–96 |
| apps/desktop/src/routes/reports/ReportTable.tsx | SP | 1–143 |
| apps/desktop/src/routes/reports/ReportsScreen.tsx | SP | 1–112 |
| apps/desktop/src/routes/reports/report-workbook.test.ts | Test | 1–370 |
| apps/desktop/src/routes/reports/report-workbook.ts | SP | 1–230 |
| apps/desktop/src/routes/reports/reports-view.test.ts | Test | 1–361 |
| apps/desktop/src/routes/reports/reports-view.ts | SP | 1–402 |
| apps/desktop/src/routes/trash-view.test.ts | Test | 1–1078 |
| apps/desktop/src/routes/trash-view.ts | SP | 1–675 |

Nguồn đối chiếu: CLAUDE.md gốc và apps/desktop/CLAUDE.md, CONTEXT.md; common/prompt-codex.md, plan.md (§4, L4.3, L4.6, L4.8), known.md (K1–K40, ACCEPTED, lệch mockup, R1/R2), fixes.md (các Issue/PR giao E), baseline.md. Ba tổng hợp 15/10, 17/10, 21/10 và các phần E, kịch bản/đột biến liên quan trong raw của ba lượt ở repo được dùng để tránh báo lại lỗi cũ. Chỉ đọc probe lượt 3 của chính Codex E ở đường dẫn được phép; không đọc báo cáo lượt 4 gói khác ngoài dòng đầu A–D để kiểm Bước 0.

Hợp đồng: spec Phase 3 §3.5/3.7, §4/§6; Phase 4 §1–4; Phase 6 §4.1/4.2 (S2-6, TR1–13, E18–20, D1–13), §5; golden chi-so.md, lich-hen.md, kh-theo-nhom.md; ADR-0007 và phụ lục ngày nhanh đầu năm, ADR-0013 và phụ lục nhận diện 27/10. Đối chiếu mockup index #t284/#contrast, appointment-forms (6a–6i), policy-forms (8a–8d), overview/reports, settings-data (10a–10d), trash (11a–11j), cùng nghiệm thu NT-LH-25 và mục Lệch mockup đã biết. DR6-131 và T-306 được kiểm theo dòng tài liệu và hành vi tương ứng.

Phần nối đọc thêm: AppDataContext/app-data/tables/demo-snapshot/persist-queue, SaveWarning, classes/stage-badge, CustomerDialogs/customers-view, scope/routes, i18n, PeriodPicker/Chart/Dialog và các lệnh/lớp dữ liệu mà E gọi. E2E đọc các ca đích của trash, appointment-outcome, appointments, customer-policies, demo-data, backup, chart, overview, reports, period-picker và fixture/support. Không dùng SQL thô để kết luận màn; hai phát hiện đều dựng bằng UI thật trên build web.

## 4. Kịch bản mới đã thử

Các ca tái hiện R ghi riêng trong bảng R. Tất cả browser context chặn mạng ngoài 127.0.0.1 và thay window.open trước trang đầu. Dữ liệu thử màn qua UI hoặc AppData; không gọi dịch vụ AI thật.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Tạo team W×160 qua UI → Tổng quan, cửa sổ 1100×700 | Trang rộng 3005 px, bảng rộng 2734,06 px; có ảnh đã mở kiểm | CXR4-E1 |
| N2 | Đổi tên RE M×160 qua UI → Báo cáo Theo RE → cuộn hết sang phải | Vùng bảng 790 px; cột ghim 1770,5 px che hết các cột số; có ảnh | CXR4-E2 |
| N3 | Chỉnh cặp ngày Tùy chọn vắt tháng → Lọc; sửa ngày không tồn tại → Tab nội bộ → rời cặp → đổi loại kỳ | PASS: Tab nội bộ chưa báo lỗi; rời cặp mới báo; đổi loại bỏ draft lỗi và dùng đúng ngày đã áp | — |
| N4 | Sau N3, ẩn cả bốn nhóm N4–N1 | PASS: bảng trợ năng chỉ còn Ngày/Tổng, Tổng=0; cùng tập nhóm với chart | — |
| N5 | Exe giả: tạo team khi save lỗi → Nạp lại bị D7 từ chối → hết lỗi → Thử lại → mở Nạp lại | PASS: câu D7 có hướng dẫn; thông báo của Dữ liệu một nguồn, banner lưu độc lập; dữ liệu không thay khi từ chối | — |
| N6 | Chữ NẠP LẠI NFD → Escape → mở lại hộp | PASS: ô rỗng và xác nhận tắt, không giữ chữ xác nhận của lần mở trước | — |
| N7 | Helper E ở 119e2e4 so với E mới trên cùng dữ liệu tải mới: 7 kỳ × 49 góc nhìn | PASS: 343 tổ hợp reportRows, stageBlock, appointmentRows, monthGrid deepEqual | — |
| N8 | purgePlan từ listTrash trên dữ liệu tải mới → so previewPurge → dọn qua AppData | PASS: 113 dòng; số KH/con/lịch/HĐ/người/team khớp; mọi bảng sống nguyên, kept=0 | — |
| N9 | Workbook trước/sau gộp 17 cột, ba góc nhìn Toàn bộ/Team/RE, kỳ Năm | PASS: 3 workbook / 9 sheet, cùng từng ô và định dạng | — |
| N10 | Sau đối chiếu refactor và dọn: xuất backup → kiểm → nhập → dựng lại báo cáo Năm | PASS: 15.840.759 byte; Thùng rác 0, báo cáo deepEqual | — |
| N11 | Dán ngày/tiền có ZWSP, FEFF, U+3164, U+0085, VS16 vào hộp HĐ thật, lưu hai HĐ | PASS: 10/09/2026; 1,234 tr → 1.234.000.000 ₫, 0,500 tr → 500.000 ₫; tên nút nói đúng số đồng | — |

Nguồn: new-ui-source.ts/new-ui.log/new-ui.json (N1–N6); data-probe.mjs/data-probe-2.log/data-results.json/reference/ (N7–N10); parser-ui-source.ts/parser-ui.log/parser-ui.json (N11). **Giới hạn N7/N9:** chỉ nạp source helper E cũ; dependencies domain/db và dữ liệu đầu vào dùng bản ghim hiện tại để cô lập refactor E. Đây không phải phép so cả hai exe hay cả hai bản dữ liệu tải; phần đó thuộc F.

## 5. Phát hiện mới

**2 Low, đều CONFIRMED; 0 Medium/High/Critical; 0 PLAUSIBLE.** Hai lỗi có từ trước, không quy thành hồi quy của đợt sửa sau lượt 3. Không ghi lặp các dòng R thành phát hiện.

### CXR4-E1 — Tên team dài kéo bảng So sánh team ra ngoài cửa sổ

ID: CXR4-E1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/overview/TeamCompare.tsx:16, :52, :75 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–3 bỏ sót (cấu trúc bảng có từ PR #313); biến thể tên dài ngoài DR6-117.
Kịch bản: N1
Mô tả: ô tên dùng whitespace-nowrap và bảng không có vùng cuộn riêng hay giới hạn chiều rộng tên. Tên team dài hợp lệ đẩy toàn bộ cột số ra khỏi cửa sổ Tổng quan.
Tái hiện / bằng chứng: `node node_modules/@playwright/test/cli.js test e2e/r4-e.spec.ts --project=edge --no-deps --workers=1` tại E/copy. Tạo team qua UI bằng `W` ×160, mở Tổng quan, cửa sổ 1100×700: pageWidth=3005, tableWidth=2734.0625, right=3005.0625 (px). Nguồn new-ui-source.ts, log new-ui.log, new-ui.json và long-team-overview.png (đã mở ảnh kiểm).
Ảnh hưởng: chỉ hiển thị; người dùng phải cuộn cả trang ngang khoảng 1905 px mới đọc các chỉ số; dữ liệu và file xuất không đổi.
Đề xuất: cho tên xuống dòng/ngắt chuỗi và giới hạn cột tên; vùng cuộn bảng nếu cần. Ước lượng <40 dòng SP, ≤400.

### CXR4-E2 — Cột RE ghim quá rộng che mọi số của bảng Báo cáo

ID: CXR4-E2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/reports/ReportTable.tsx:24, :27, :117 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–3 bỏ sót (cột ghim có từ PR #314; T-301 giữ nguyên cách bố trí).
Kịch bản: N2
Mô tả: cột tên RE ghim bên trái, nền đặc và whitespace-nowrap nhưng không giới hạn chiều rộng. Tên RE dài hơn vùng bảng làm cột ghim che toàn bộ các cột số, kể cả cuộn hết sang phải.
Tái hiện / bằng chứng: cùng lệnh probe UI trên; sửa tên một RE của Bình Minh qua UI thành `M` ×160 rồi mở Báo cáo → Theo RE, cuộn hết sang phải. Vùng bảng rộng 790 px (x=271…1061); cột tên rộng 1770.5 px (x=−709.921875…1060.578125); visibleFigures=0, scrollLeft=1823/scrollWidth=2613. Nguồn new-ui-source.ts, new-ui.log và long-re-report.png (đã mở ảnh kiểm). Trường name trong dòng JSON N2 chứa geometry do trùng tên thuộc tính của hàm ghi log; nhãn ca đúng có trong new-ui.log, không ảnh hưởng số đo.
Ảnh hưởng: chỉ hiển thị; không đọc được các số của Theo RE trên màn; có đường vòng xuất Excel hoặc rút tên RE.
Đề xuất: giới hạn chiều rộng ô tên ghim, cho tên xuống dòng/ngắt chuỗi hoặc cắt có cách đọc tên đầy đủ. Ước lượng <30 dòng SP, ≤400.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Dữ liệu / phạm vi | Số / kết quả | ID |
|---|---|---|---|
| classifyFile + git diff --numstat | 52 file E tại SHA ghim | SP 8.155 (+399 so lượt 3), test 4.556 (+410); +1 file ConfirmWordDialog | — |
| tsc -p apps/desktop --noUnusedLocals --noUnusedParameters --noEmit | Source gốc; log tsc-unused.log | Exit 0, không có diagnostic | — |
| dependency-cruiser apps packages | Source gốc, CLI đã ghim | Exit 0; 341 module / 1.435 dependency, 0 vi phạm (lint-deps-2.log) | — |
| Kiểm tiêu chí rg của T-301/T-305/T-310 | export markName, class chung, i18n, bảng cột, recordBadge | 7/7 control tĩnh đạt; S66/S37/S310 gỡ cấu trúc → đỏ đúng mục (static-results.json) | — |
| Đọc ba consumer của REPORT_COLUMNS; so workbook thật | Màn, reportCells và Excel | Một định nghĩa 17 cột; 9 sheet trước/sau cùng ô/định dạng; U301-column làm unit đỏ | — |
| Refactor i18n không đổi chữ | So sánh team | P-raw-37-equivalent về ký hiệu cũ vẫn xanh đúng dự kiến; kiểm tĩnh báo gỡ i18n | — |
| Bundle của bước chuẩn bị, không tự gán cho riêng E | Build không biến riêng, common/baseline.md | JS/CSS 2.358.427 B thô / 697.134 B gzip; lượt 3 2.400.393 B thô (−41.966 B). Font/ảnh mới đã tách trong baseline | — |

Không thấy bloat có chi phí đo được mới trong E. Không cài công cụ; không mở rộng kết luận quét export của E thành toàn repo. Các kiểm cấu trúc tĩnh là bản chép tiêu chí chấp nhận của Issue, không mạo nhận là unit do PR thêm.

### 6.2 Hiệu năng

Máy **DESKTOP-KDURKJP (Home PC)**, Node **v24.20.0**. Dữ liệu đúng file common/load/load-2026-10-12-seed6.p2cbackup; hash tables **ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25**, kiểm bằng assertion trước probe. Số sống: 4 team, 51 nhân sự, 1.481 KH, 10.255 lịch hẹn, 1.674 HĐ; Thùng rác 113 dòng.

Đo Node lúc 15:32:11 +07:00, sau khi mọi build/e2e/probe của phiên đã kết thúc. Codex desktop vẫn mở; không kiểm nội dung/trạng thái các phiên reviewer khác. Không tự đo exe để tránh làm nhiễu phép đo của bên khác. Nguồn Node: perf-probe.mjs/perf.log/perf-results.json; nền cùng đường gọi của chính Codex E lượt 3: deep-review-1-6-r3/codex/E/data-results.json. Hàm thuần 3 lần làm nóng + 9 lần đo, dọn 5 DB mới; không persist trong Node.

| Đã đo / dữ liệu | Lượt 4: trung vị (min–max), ms | Lượt 3 cùng đường gọi, ms | Ngưỡng / đánh giá | ID |
|---|---|---:|---|---|
| teamCompare năm | 2.69 (2.52–4.10) | 2.66 | ≤15; đạt | — |
| teamCompare tháng | 1.43 (1.39–1.48) | 1.45 | ≤15; đạt | — |
| reportRows năm | 7.64 (7.41–9.56) | 8.15 | ≤15; đạt | — |
| reportRows tháng | 5.57 (5.31–7.17) | 6.22 | ≤15; đạt | — |
| monthGrid | 0.57 (0.55–0.76) | 0.71 | ≤2; đạt | — |
| listTrash, 113 dòng | 19.71 (18.67–20.66) | 26.36 | Không ngưỡng riêng | — |
| purgePlan, 113 dòng | 0.02 (0.01–0.03) | — | Không ngưỡng riêng | — |
| AppData.purgeTrash, 113 dòng | 89.58 (84.98–96.29) | 97.23 | Node: không thay ngưỡng exe 500 ms | — |

purgePlan mới không có mốc cùng hàm ở lượt 3 và không có ngưỡng riêng. Số listTrash/Node purge không được thay cho đo thao tác màn. Luật nhiễu: tăng quá 20% **và** quá 10 ms; không cặp Node cùng đường gọi nào xấu hơn.

**Số exe dùng lại từ common/baseline.md**, đo ở bước chuẩn bị lúc máy rảnh trên đúng exe ghim; không phải số đo lại của phiên E:

| Thao tác / dữ liệu tải | Lượt 4, ms | Home PC sau #656, ms | Lượt 3, ms | Ngưỡng / kết quả | ID |
|---|---:|---:|---:|---|---|
| reload.overview | 405 | 398 | 392 | <500; trong nhiễu | — |
| reload.appointments | 393 | 391 | 383 | <500; trong nhiễu | — |
| reload.reports | 373 | 376 | 366 | <500; trong nhiễu | — |
| overview.filter-year / month | 17 / 17 | 16 / 14 | 15 / 14 | <200; trong nhiễu | — |
| reports.filter-year / month | 10 / 10 | 10 / 10 | 9 / 10 | <200; trong nhiễu | — |
| reports.export-excel | 29 | 20 | 23 | ≤500; tăng 9 ms so #656, dưới luật nhiễu 10 ms | — |
| trash.open | 32 | 34 | 38 | <200; không xấu hơn | — |
| Bấm Backup rồi dọn sạch → khung hình 11j | 123,3 | chưa có tính năng | 151,8 | ≤500; đạt | — |

Không có phát hiện P mới. Các phép đo không cho thấy vượt ngưỡng hay xấu hơn mốc được yêu cầu; đây không thay nghiệm thu exe cuối G7.

## 7. Bảng đếm mức × trục

Bảng chỉ đếm phát hiện mới, không đếm 19 dòng R hay các mục KNOWN.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |

CONFIRMED 2/2, PLAUSIBLE 0/2, KNOWN mới 0. R1: 9/9 ĐÃ SỬA phần E; R2: 10/10 ĐÃ SỬA phần E. Không đưa kết luận sẵn sàng v1.0 của cả dự án ở gói E.

## 8. Đã xét, không thấy

| Trục | Đã chạy / đọc và kết luận trong phạm vi |
|---|---|
| R | Các tái hiện, unit/e2e và đột biến trong hai bảng R. Không thấy sửa thiếu/hồi quy trong phần E; các refactor tương đương kiểm cấu trúc riêng. |
| E | N3–N6, N11; bộ e2e ngày đầu năm, giao thừa, biên 1900/2100, ô ngoài tháng/khoảng; không thấy lỗi mới ngoài hai tên dài của N1/N2. |
| C | Spec/golden/mockup/nhãn và R131/T284/T306; phát hiện CXR4-E1/E2. Những lệch 6h/6d/8d/10c đã được Owner nhận không ghi lại. |
| D | N7–N10 qua AppData, kế hoạch/preview/kết quả dọn, mọi bảng sống, workbook/roundtrip. Không thấy sai dữ liệu/đếm do các refactor E. |
| G | Đọc đường E gọi AppointmentAi/KYC và generation/khóa ghi tại seam; không gọi AI thật, không đánh giá lại guardrail của gói C. Không thấy đường E mới bỏ qua khóa ghi. |
| S | restoreRow gọi đúng lệnh theo kind/id; ConfirmWordDialog khóa chạy/đóng, import/export qua AppData; test tooltip escape tên và workbook giữ tên dạng text. Không thấy lỗi ranh giới mới. |
| P | Bảng số riêng: đúng dữ liệu tải; Node và baseline exe không xấu hơn theo luật nhiễu, không vượt ngưỡng. |
| B | tsc, dependency-cruiser, tiêu chí tĩnh và diff class/cột/export; không có bloat mới đo được chi phí. |
| T | 647 unit control xanh; 126 e2e gốc xanh; 4 test probe bổ sung xanh. 23 đột biến có tác động bị test bắt; 1 đột biến tương đương sống đúng; không lấy lỗi cấu hình probe làm phát hiện. |
| A | Tên HĐ/khôi phục, bảng số chart, accessible description, ngày không bấm được, focus sau khôi phục/dọn/sửa, cặp ngày và NFC; có e2e thật. Chưa chạy screen reader thực; không thấy lỗi A mới từ accessible-name/description của browser. |

## 9. Phụ lục: probe, đột biến, trạng thái cuối

Mọi đường dẫn tương đối dưới đây thuộc **C:/workspace/deep-review-1-6-r4/codex/E/**.

| Nguồn | Vai trò / kết quả |
|---|---|
| prep.mjs, setup-runs.mjs, adjust.mjs, copy/ | Chép source ghim và junction dependency sẵn có. Trong bản chép chỉ gọi node tới CLI; không chạy pnpm, không install. |
| scope.json, diff-E.patch, final-check.json | Danh mục, diff, hash 52 file E và SHA/status; 52/52 file bản chép khớp gốc sau khôi phục. |
| unit-base.log, unit-final.log | 332/332 E trước thử; 647/647 sau thử trên repo gốc (332 E + 155 money + 160 period). |
| e2e-base-2.log, e2e-extra-control.log | 78/78 + 48/48 e2e gốc, 10 spec liên quan cộng seed dependency. |
| new-ui-source.ts, new-ui.log, new-ui.json, long-*.png | N1–N6, hai ảnh đã mở kiểm. Trường name ở dòng JSON N2 là geometry do trùng tên trường khi ghi log; nhãn N2 đúng nằm trong new-ui.log. |
| parser-ui-source.ts, parser-ui.log, parser-ui.json | N11, tái hiện UI của R110/R131. |
| data-probe.mjs, data-probe-2.log, data-results.json, reference/ | N7–N10; source E cũ lấy bằng git show, ghép với domain/db hiện tại để cô lập refactor. |
| mutations.mjs, mutations.log, mutation-progress.md, mutations/results.json | 10 đột biến unit, 13 đột biến UI ban đầu; chi tiết bên dưới. Mỗi file được trả về source gốc ở finally. |
| mut-ui-package.mjs, mut-ui-package-2.log, mutations/P299-blur-*.log | Đối chứng/đột biến PeriodPicker có hiệu lực sau alias chính xác @p2c/ui. |
| static-checks.mjs, static-results.json, static-checks-2.log | 7 tiêu chí tĩnh; 3 lần gỡ cấu trúc; đột biến Thử lại P-B2-retry. |
| perf-probe.mjs, perf.log, perf-results.json, perf-metadata.mjs | Số đo Node; metadata nguồn nền đã chỉnh đúng cùng đường gọi, số đo mới giữ nguyên. JSON cuối là bảng so được dùng. |
| tsc-unused.log, lint-deps-2.log | Kiểm bloat/ranh giới, exit 0. |
| progress-session.md | Nhật ký báo cáo dần trước khi sắp lại thành khuôn cuối. |

### Đột biến có hiệu lực

| Đột biến | Phần gỡ / làm lệch | Kết quả thật |
|---|---|---|
| U110-money | Bỏ normalizeText của tiền | KILLED: 11/155 unit đỏ; mutations/U110-money.log |
| U110-date | Bỏ normalizeText của ngày nhanh | KILLED: 6/160 unit đỏ; mutations/U110-date.log |
| U134-day | Bỏ fallback nhóm tạo KH | KILLED: 1/34 unit đỏ; mutations/U134-day.log |
| U291-previous | Bỏ gợi ý năm trước | KILLED: 2/28 unit đỏ; mutations/U291-previous.log |
| U291-reason | Chỉ trim lý do dời | KILLED: 1/25 unit đỏ; mutations/U291-reason.log |
| U296-count | Bỏ dòng số HĐ chuyển tháng | KILLED: 2/24 unit đỏ; mutations/U296-count.log |
| U296-plan | Bỏ số ghi chú KYC khỏi kế hoạch | KILLED: 2/78 unit đỏ; mutations/U296-plan.log |
| U296-E20 | So ngày định dạng thay cờ sameDay | KILLED: 1/78 unit đỏ; mutations/U296-E20.log |
| U305-badge | Bỏ badge khỏi tên khôi phục | KILLED: 7/78 unit đỏ; mutations/U305-badge.log |
| U301-column | Header Excel thiếu cột cuối | KILLED: 2/20 unit đỏ; mutations/U301-column.log |
| P119-FYP | Tên Phát hành thiếu FYP | KILLED: 1 e2e đỏ ở assertion; mutations/P119-FYP.log |
| P128-reminder | Nhắc theo số dòng đã lọc | KILLED: 1 e2e đỏ ở assertion; mutations/P128-reminder.log |
| P128-canPurge | Nút dọn theo dòng đã lọc | KILLED: 1 e2e đỏ ở assertion; mutations/P128-canPurge.log |
| P128-trim | Nới chữ xác nhận bằng trim/uppercase | KILLED: 1 e2e đỏ ở assertion; mutations/P128-trim.log |
| P128-NFC | So chữ chưa NFC | KILLED: 1 e2e đỏ ở assertion; mutations/P128-NFC.log |
| P128-Escape | Cho đóng khi đang chạy | KILLED: 1 e2e đỏ ở assertion; mutations/P128-Escape.log |
| P128-cancel | Cho Hủy khi đang chạy | KILLED: 1 e2e đỏ ở assertion; mutations/P128-cancel.log |
| P128-6f | Không mang nhóm đã giữ vào editedDay | KILLED: 1 e2e đỏ ở assertion; mutations/P128-6f.log |
| P295-10c | Số KH của 10c bằng 0 | KILLED: 1 e2e đỏ ở assertion; mutations/P295-10c.log |
| P298-days | Bỏ accessible name ngày ngoài khoảng/tháng | KILLED: 1 e2e đỏ ở assertion; mutations/P298-days.log |
| P299-table | Bỏ bảng số của chart | KILLED: 1 e2e đỏ (bảng không còn, locator chờ timeout); mutations/P299-table.log |
| P299-blur-effective | Bỏ guard contains(relatedTarget), apply cả khi Tab giữa hai ô | KILLED: aria-invalid expected false, received true; control 1/1 xanh |
| P-B2-retry | Thử lại không gọi saves.flush | KILLED: alert expected 0, received 1 |
| S66 / S37 / S310 | Trả export markName, ký hiệu JSX, một tiêu đề inline | Kiểm chấp nhận tĩnh đỏ đúng mục; không mạo nhận unit của PR |
| P-raw-37-equivalent | Trả ký hiệu ▾/▸ giống hệt vào JSX | SURVIVED tương đương; e2e 1/1 xanh đúng mục tiêu không đổi hành vi |

Tổng: **23 đột biến có tác động, 23 bị bắt** (10 unit + 13 UI); **3 kiểm gỡ cấu trúc tĩnh đỏ**; **1 đột biến tương đương sống**. Không suy rằng test phải bắt thay đổi chỉ export/hằng/i18n mà kết quả runtime giống hệt.

### Lỗi probe đã xử lý và giới hạn

- E2E lần 1 hết thời gian chờ server vì preview mặc định khác URL 127.0.0.1. Runner bản chép thêm host rõ ràng; lần 2 78/78 qua. Không dùng PW_REUSE, không dùng cổng 4173; cổng riêng 4196, không chạy hai server thử đồng thời.
- P299-blur ban đầu chạm source UI bản chép nhưng junction còn resolve source gốc: đột biến không có hiệu lực, loại khỏi số đếm. Lần alias tên gói bắt nhầm theme.css làm cả control/đột biến không build; cũng loại. Alias khớp chính xác tên module sau đó cho control xanh, đột biến đỏ đúng assertion.
- Data probe đầu nối workbook cũ với reports-view mới thiếu export REPORT_STAGES; sửa probe để dùng reports-view cũ tương ứng. Không dùng lỗi import đó làm bằng chứng giết đột biến.
- Kiểm tĩnh đầu quá thô ở hai tiêu đề cùng class: sửa checker theo tiêu chí rg của Issue để kiểm đủ cả hai. Không có source sản phẩm nào bị sửa vì việc này.
- P299-table làm bảng không tồn tại; test dừng ở boundingBox chờ phần tử (timeout). Đây là bảng bị gỡ đúng dự kiến, không phải lỗi build/import; các đột biến còn lại đỏ ở assertion.
- Build thử e2e có **VITE_DEMO_ANCHOR=15/09/2026**, ghi rõ để không nhầm cỡ bundle/chạy thời gian thật; không dùng cỡ build này thay bundle chuẩn của common/baseline.md.
- Không chạy AI thật/đọc key/mở chatgpt.com; không chạy gh, tạo Issue/PR, sửa repo, commit hay đề xuất merge. Không đọc các thư mục bị cấm hoặc báo cáo lượt 4 bên khác.

### Trạng thái cuối

- SHA cuối: **2e51e25eb0125f56d3d938b97ef18d6873dae076**, không đổi.
- git status --short cuối: **rỗng**, như đầu phiên; chỉ bản chép/kết quả riêng được ghi.
- Hash: **52/52 file E của bản chép khớp source gốc** sau mọi đột biến; final-check.json.
- Giờ xong: **2026-10-29 15:49:20 +07:00 (Asia/Bangkok)**.