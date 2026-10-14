XONG — Codex gói E, 2026-10-14 17:49:34 (Asia/Saigon)

# Deep review Phase 1–6 — Codex Gói E

## 1. Thông tin phiên

- Bên: Codex; gói E — Lịch hẹn, chỉ số, quản lý.
- SHA đầu phiên: 885534549808f42aec7f9af5743bbf86642ee4bd.
- git status --short đầu phiên: rỗng (worktree sạch).
- Giờ bắt đầu: 2026-10-14 17:16:54 (Asia/Saigon).
- Phiên mới; A–D có đủ, dòng đầu XONG; chỉ kiểm dòng đầu theo bước 0, không đọc nội dung các gói trước.
- Chỉ đọc repo và common; probe/log ở codex\E; không sửa code sản phẩm.

## 2. Phạm vi đã đọc

Xác định bằng git ls-files + classifyFile của tools/size-report-core.mjs (luật C/F/B/A trước E). Đã đọc sâu **từng file E**, toàn bộ **51 file: 37 SP/7.032 dòng, 14 test/3.545 dòng**; các range dưới là dòng vật lý của nguồn 8855345. Không tính file AI bị xếp C.

| File | Loại | Dòng đã đọc |
|---|---|---|
| `apps/desktop/src/routes/FilterBar.tsx` | SP | 1–82 |
| `apps/desktop/src/routes/Overview.tsx` | SP | 1–61 |
| `apps/desktop/src/routes/RestoreDialog.tsx` | SP | 1–65 |
| `apps/desktop/src/routes/Settings.tsx` | SP | 1–170 |
| `apps/desktop/src/routes/SettingsBackup.tsx` | SP | 1–280 |
| `apps/desktop/src/routes/SettingsDataFile.tsx` | SP | 1–135 |
| `apps/desktop/src/routes/SettingsTrash.tsx` | SP | 1–226 |
| `apps/desktop/src/routes/applied-filter.test.ts` | test | 1–109 |
| `apps/desktop/src/routes/applied-filter.ts` | SP | 1–51 |
| `apps/desktop/src/routes/appointments/AppointmentDialog.tsx` | SP | 1–447 |
| `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx` | SP | 1–652 |
| `apps/desktop/src/routes/appointments/DateSuggestion.test.tsx` | test | 1–24 |
| `apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx` | SP | 1–100 |
| `apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx` | SP | 1–237 |
| `apps/desktop/src/routes/appointments/MetFields.test.ts` | test | 1–36 |
| `apps/desktop/src/routes/appointments/MetFields.tsx` | SP | 1–164 |
| `apps/desktop/src/routes/appointments/OutcomeDialog.tsx` | SP | 1–292 |
| `apps/desktop/src/routes/appointments/RescheduleDialog.tsx` | SP | 1–60 |
| `apps/desktop/src/routes/appointments/RescheduleFields.tsx` | SP | 1–142 |
| `apps/desktop/src/routes/appointments/YearGrid.tsx` | SP | 1–142 |
| `apps/desktop/src/routes/appointments/appointment-form.test.ts` | test | 1–210 |
| `apps/desktop/src/routes/appointments/appointment-form.ts` | SP | 1–125 |
| `apps/desktop/src/routes/appointments/appointments-view.test.ts` | test | 1–637 |
| `apps/desktop/src/routes/appointments/appointments-view.ts` | SP | 1–471 |
| `apps/desktop/src/routes/appointments/outcome-form.test.ts` | test | 1–193 |
| `apps/desktop/src/routes/appointments/outcome-form.ts` | SP | 1–132 |
| `apps/desktop/src/routes/customers/CustomerPolicies.tsx` | SP | 1–109 |
| `apps/desktop/src/routes/customers/PolicyDialogs.tsx` | SP | 1–354 |
| `apps/desktop/src/routes/customers/policy-form.test.ts` | test | 1–173 |
| `apps/desktop/src/routes/customers/policy-form.ts` | SP | 1–138 |
| `apps/desktop/src/routes/overview/OverviewTiles.tsx` | SP | 1–76 |
| `apps/desktop/src/routes/overview/StageBlock.tsx` | SP | 1–127 |
| `apps/desktop/src/routes/overview/TeamCompare.tsx` | SP | 1–127 |
| `apps/desktop/src/routes/overview/overview-view.test.ts` | test | 1–312 |
| `apps/desktop/src/routes/overview/overview-view.ts` | SP | 1–252 |
| `apps/desktop/src/routes/overview/stage-chart.test.ts` | test | 1–150 |
| `apps/desktop/src/routes/overview/stage-chart.ts` | SP | 1–130 |
| `apps/desktop/src/routes/overview/stage-view.test.ts` | test | 1–235 |
| `apps/desktop/src/routes/overview/stage-view.ts` | SP | 1–142 |
| `apps/desktop/src/routes/overview/team-compare-view.test.ts` | test | 1–128 |
| `apps/desktop/src/routes/overview/team-compare-view.ts` | SP | 1–129 |
| `apps/desktop/src/routes/period-labels.ts` | SP | 1–26 |
| `apps/desktop/src/routes/reports/ReportExport.tsx` | SP | 1–96 |
| `apps/desktop/src/routes/reports/ReportTable.tsx` | SP | 1–154 |
| `apps/desktop/src/routes/reports/ReportsScreen.tsx` | SP | 1–113 |
| `apps/desktop/src/routes/reports/report-workbook.test.ts` | test | 1–336 |
| `apps/desktop/src/routes/reports/report-workbook.ts` | SP | 1–259 |
| `apps/desktop/src/routes/reports/reports-view.test.ts` | test | 1–366 |
| `apps/desktop/src/routes/reports/reports-view.ts` | SP | 1–327 |
| `apps/desktop/src/routes/trash-view.test.ts` | test | 1–636 |
| `apps/desktop/src/routes/trash-view.ts` | SP | 1–439 |

Đọc nền: common/prompt-codex.md; common/plan.md §1–6/§10; common/known.md (OPEN/ACCEPTED, K1–K17); common/baseline.md; common/perf/perf-ref.json; CLAUDE.md, apps/desktop/CLAUDE.md (map route/export), CONTEXT.md; spec Phase 3/4, Phase 6 §4.1–4.2/§5; docs/metrics/phase-6.md (ngưỡng), e2e/perf/README.md. Không dùng nghi thức Claude/skill/HANDOFF.

Mockup đối chiếu: README mục lục; overview.html 1a–1e/2/ask; reports.html 2a–2f/ask; appointments.html và phase-3-feedback.html B3–B6; appointment-forms.html 6a–6i; policy-forms.html 8a–8d; settings-data.html 10a–10d; trash.html 11a–11g; phần Hợp đồng/customer.html. Đọc nội dung HTML/notes/label của các khối, không tuyên bố pixel-perfect toàn app hay chạy màn mockup qua mạng font.

Nối sang gói khác đã đọc: src/data/{AppDataContext.tsx,tables.ts,today.ts} toàn file; app-data.ts các đoạn mở 295–328 và replace/run/export/import 329–446; src/main.tsx toàn file (clock ghim/web Mock); src/shell/routes.ts 1–130 (hash/scope); CustomerProfile.tsx 1–165 (query, case size, useToday); i18n/vi.ts các khóa appointment/settings/trash/policy; packages/db/{index.ts,database.ts:1–135,backup.ts:1–155,policies.ts:1–180,appointments.ts:1–450,customers.ts:155–192,test-support.ts}; tools/size-report-core.mjs toàn file, load-data.mjs:1–96; vitest.config.ts/app tsconfig/package.json; e2e/support.ts:1–175, các chỗ khôi phục của e2e/trash.spec.ts và liên quan form của appointment-outcome/customer-forms. Hàm domain/db thật được gọi trong probe, không nhân bản công thức trong sản phẩm.

## 3. Phát hiện

### CX-E1 — Chênh lệch FYP dùng số nộp cũ

ID: CX-E1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/policy-form.ts:97; apps/desktop/src/routes/customers/PolicyDialogs.tsx:159 (8855345)
Tình trạng: CONFIRMED
Mô tả: Hộp Sửa HĐ tính “khác FYP nộp” theo FYP nộp đã lưu, không theo FYP nộp đang sửa trong cùng hộp.
Tái hiện / bằng chứng: node E/probe.mjs exit0: savedSubmitted=400000000, draftSubmitted=500000000, draftIssued=385500000, shownDifference=-14500000, expectedDifference=-114500000. node E/ui-probe.mjs exit0: đổi ô FYP nộp thành 500tr và phát hành thành 385,5tr; UI thật hiện “385.500.000 ₫ (385,5 tr) · khác FYP nộp −14,5 tr”, đúng phải −114,5 tr. E/ui-results.json, E/CX-E1.png; mockup policy-forms.html:164 quy định dòng này so với FYP nộp. Dòng “Ảnh hưởng chỉ số” so doanh số đã lưu vẫn đúng, không gộp hai delta đó.
Ảnh hưởng: Người sửa đồng thời hai FYP thấy hướng dẫn chênh lệch sai; số lưu theo draft vẫn đúng. Chấm Low vì chỉ sai hiển thị.
Đề xuất: Chênh lệch so nộp lấy read.submittedFyp của draft, tách khỏi delta doanh số vốn so bản đã lưu; ≤40 dòng SP trong policy-form.ts/PolicyDialogs.tsx; thêm test thay đồng thời hai FYP.

### CX-E2 — Ngày trong hộp sửa lịch Hủy nhảy năm sau giao thừa

ID: CX-E2
Mức: Low
Trục: E
Vị trí: apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:55; apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:64; apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:87 (8855345)
Tình trạng: CONFIRMED
Mô tả: Ngày có sẵn trong hộp Sửa kết quả bị bỏ năm (dayText), rồi đọc lại với năm hiện tại khi hộp re-render sau giao thừa. Với lịch Hủy, lưu chỉ sửa ghi chú có thể đổi ngày từ 30/12/2026 thành 30/12/2027.
Tái hiện / bằng chứng: node E/probe.mjs exit0: {text:"30/12",before:"2026-12-30",after:"2027-12-30",sameUserText:true}. node E/ui-probe.mjs exit0: Edge web local, timezone Asia/Ho_Chi_Minh; clock 31/12/2026 23:59, nhập fixture có lịch Hủy ngày 30/12/2026, mở Sửa kết quả. Đổi clock sang 01/01/2027 00:01, phát sự kiện focus như khi máy thức lại, chỉ điền ghi chú. Ô ngày trước/sau đều 30/12; hint đổi thành “Thứ Năm 30/12/2027 · 363 ngày nữa”. Bấm Lưu, xuất backup: cùng ID cuộc hẹn có date="2027-12-30", note="Chỉ sửa ghi chú". Nguồn E/ui-probe.mjs, kết quả E/ui-results.json, ảnh E/CX-E2.png, E/year-boundary-after-ui.p2cbackup.
Ảnh hưởng: Cần giữ hộp qua thời điểm đổi năm; lịch Hủy nhảy kỳ báo cáo/backup. MET/NO_SHOW thay vì ghi sai sẽ bị kiểm ngày tương lai. Low vì điều kiện hiếm; không nâng lên High dù hậu quả ngày được lưu sai.
Đề xuất: Điền ngày đã lưu bằng formatDate đầy đủ năm hoặc giữ năm đọc của nội dung đã điền; today vẫn dùng để kiểm tương lai. ≤60 dòng SP cho các hộp giữ date state; thêm test đổi năm khi hộp mở. Không tự nhảy năm cho một ngày người dùng không sửa.

### CX-E3 — Ước lượng cũ được gán cho cuộc gặp gần nhất

ID: CX-E3
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/policy-form.ts:131; apps/desktop/src/routes/customers/PolicyDialogs.tsx:237 (8855345)
Tình trạng: CONFIRMED
Mô tả: Nhãn “Case size dự kiến ở cuộc gặp gần nhất” có thể hiện số của cuộc gặp cũ hơn. Hàm bỏ qua cuộc gặp Đã gặp mới nhất khi expectedCaseSize=null, dù null là chưa ước lượng.
Tái hiện / bằng chứng: node E/case-size-probe.mjs exit0: ghi MET ngày 05/10 = 800tr, MET ngày 08/10 để trống case size. lastMet.expectedCaseSize=null nhưng expectedCaseSize trả 800000000; UI hộp HĐ mới hiện “Case size dự kiến ở cuộc gặp gần nhất: 800 tr (chỉ để tham khảo, không tự điền).” E/case-size-probe.log, E/case-size-ui.txt, E/CX-E3.png. Nguồn đúng: mockup policy-forms.html:52; appointment-forms.html 6c định nghĩa “để trống = chưa ước lượng”. Unit policy-form.test.ts:157 đang ghim hành vi bỏ qua cuộc gặp mới nhất thiếu số.
Ảnh hưởng: Người tạo HĐ nhận ước lượng cũ được gán cho cuộc gặp gần nhất; không tự điền FYP, không đổi tiền đã lưu. Low vì chỉ sai thông tin tham khảo.
Đề xuất: Chọn cuộc gặp MET mới nhất theo ngày/giờ trước, rồi đọc expectedCaseSize của nó (null thì không hiện số tham khảo); ≤25 dòng SP và test theo nhãn đã duyệt, giữ test thứ tự ngày/giờ DR-24. Không sửa mockup/golden cho khớp code.

### CX-E4 — Unit test không bắt nối sai lệnh khôi phục HĐ

ID: CX-E4
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/trash-view.test.ts:559; apps/desktop/src/routes/trash-view.ts:424 (8855345)
Tình trạng: CONFIRMED
Mô tả: Unit test restoreRow không bắt được việc nối sai lệnh khôi phục HĐ. Các case thực hiện ghi chỉ dùng bản ghi KH; test các loại khác chỉ kiểm trình bày.
Tái hiện / bằng chứng: node E/mutation-run.mjs: bản chép đối chứng nguồn/test không đổi chạy 47/47 PASS (control=0); chỉ đổi policy: restorePolicy thành policy: restoreCustomer, cùng bộ test vẫn 47/47 PASS (mutant=0). Thêm probe counterexample.test.ts khôi phục HĐ đã xóa bằng restoreRow và kiểm null/listPolicies: trên mutant 1/1 FAIL, assertion nhận “KH không còn trong dữ liệu (có thể đã bị xóa).” thay cho null. Cùng probe trỏ nguồn repo nguyên bản (counterexample-original.test.ts) 1/1 PASS. Log ở E/mutations/trash-policy-wrong-command/. e2e/trash.spec.ts đã đọc các luồng khôi phục: KH và lịch hẹn; không có luồng khôi phục HĐ. Không khẳng định mutation sống qua toàn bộ e2e vì không chạy bản build đột biến.
Ảnh hưởng: Hồi quy wiring HĐ có thể được đánh giá xanh ở unit gói E. Đây là lỗ test, không phải lệnh khôi phục HĐ hiện tại bị sai.
Đề xuất: Dựng bản ghi thật xóa cho từng loại rồi gọi restoreRow, kiểm danh sách sống/thùng rác sau lệnh; 0 dòng SP, khoảng 80–140 dòng test; giữ spec/golden. Các loại nhân sự/team cũng chưa có unit ghi riêng, nhưng probe đột biến chỉ kết luận chắc cho HĐ.

### CX-E5 — Export chỉ dùng trong chính module

ID: CX-E5
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/routes/reports/reports-view.ts:183 (8855345)
Tình trạng: CONFIRMED
Mô tả: markName được export nhưng chỉ được gọi trong reportRows của chính module, không có người dùng ngoài module.
Tái hiện / bằng chứng: rg -n '\bmarkName\b' apps packages e2e tools chỉ có reports-view.ts:183 khai báo export và :273 gọi nội bộ. Quét AST 183 tên export (126 runtime) rồi rg từng tên lưu E/export-uses.json; đây là runtime export duy nhất trong gói chỉ có tên trong chính file. Không đo được chi phí runtime/bundle của riêng export này, nên Nit.
Ảnh hưởng: API module rộng hơn cần thiết, chưa thấy ảnh hưởng hành vi/hiệu năng.
Đề xuất: Bỏ từ khóa export (1 dòng SP, 1 file); reports-view.test.ts và report-workbook.test.ts giữ hành vi, không đổi golden.

## 4. Bloat

| Đã chạy / đọc | Dữ liệu / phạm vi | Kết quả thật | ID |
|---|---|---|---|
| tsc --noUnusedLocals --noUnusedParameters, --noEmit | tsconfig app desktop, gói E nằm trong đó | exit0; không báo unused local/parameter; 5,404 s | — |
| AST export + rg mỗi tên | 37 file SP E; tìm apps/packages/e2e/tools | 183 tên export, 126 runtime; markName chỉ có 2 hit trong chính file | CX-E5 |
| pnpm.cmd codemap --check | Bản đồ route/export CLAUDE.md hiện có; không sinh lại file | exit0; 0,844 s | — |
| pnpm.cmd lint:deps | apps + packages | exit0; 309 module/1.244 dependency, 0 violation; 1,654 s | — |
| Đọc code lặp ≥3 nơi | plain: appointment-form.ts, trash-view.ts, report-workbook.ts; badge trong các form | Đã nằm trong known.md; chưa có bằng chứng chi phí/hậu quả mới, không báo lại | KNOWN, không ID mới |
| pnpm.cmd build:web | Source 8855345, output ignore apps/desktop/dist | exit0; 6,575 s gồm tsc; Vite build 653ms; cảnh báo chunk >600kB | — |
| node tools/size-report.mjs --json | Build vừa tạo, cùng phương pháp common/baseline | JS/CSS 2.364.283 byte thô, 697.071 byte gzip; Δ0 với baseline | — |

| Chunk web | Thô (byte) | Gzip (byte) | Δ với common/baseline |
|---|---:|---:|---:|
| assets/chart.js | 513302 | 172450 | 0 |
| assets/exceljs.min.js | 929569 | 255572 | 0 |
| assets/index.css | 28364 | 6412 | 0 |
| assets/index.js | 891942 | 262010 | 0 |
| assets/rolldown-runtime.js | 1106 | 627 | 0 |
| Tổng JS/CSS | 2364283 | 697071 | 0 |
| Tệp khác (15 file: wasm/font/…) | 849196 | — | 0 |

ExcelJS nạp động khi xuất lần đầu (report-workbook.ts), chart nạp động qua Chart của UI; không có dependency mới cần thêm. Ngưỡng chunk cảnh báo đã có trong baseline, chưa chứng minh bloat mới. Exe tham chiếu common/baseline: 5.414.400 byte; phiên E không build/chạy/đo exe. Dùng số gzip của size-report (zlib) nhất quán với baseline; không trộn số gzip Vite in riêng.

## 4b. Hiệu năng

Máy **D13_THINKPAD**, Node **v24.20.0**, Windows, 14/10/2026 khoảng 17:29 (Asia/Saigon). Dữ liệu đúng common/load/load-2026-10-12-seed6.p2cbackup, nhập qua importBackup; hash tables **1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd**, **16.034.641 byte**, 1.496 KH/10.414 lịch/54 nhân sự/103 phân tích AI, có Thùng rác. Các getter Tables được warm một lần trước đo; mỗi hàm 1 warmup + 15 lần, chạy tuần tự. Build/unit đã xong; phiên này không chạy tác vụ nặng song song lúc đo, preview và Edge chỉ mở sau đo. Không biết tác vụ nền của reviewer khác; không khẳng định máy hoàn toàn rảnh.

| Đã đo | Dữ liệu / số lần | Trung vị ms | Min–max ms | ID P |
|---|---|---:|---:|---|
| reportRows-year | load seed6; 15 lần | 8.861 | 8.294–12.893 | — |
| reportRows-month | load seed6; 15 lần | 6.723 | 5.806–8.064 | — |
| stageBlock-year-team | load seed6; 15 lần | 3.430 | 3.223–4.418 | — |
| stageBlock-month-team | load seed6; 15 lần | 3.278 | 2.954–3.506 | — |
| teamCompare-year | load seed6; 15 lần | 2.791 | 2.624–3.609 | — |
| kpiTiles-year | load seed6; 15 lần | 2.573 | 2.406–3.129 | — |
| appointmentRows-all | load seed6; 15 lần | 2.544 | 2.259–3.259 | — |
| monthGrid | load seed6; 15 lần | 0.656 | 0.622–0.922 | — |
| yearGrid | load seed6; 15 lần | 0.314 | 0.242–0.403 | — |
| dayBoard | load seed6; 15 lần | 0.667 | 0.574–1.270 | — |
| listTrash | load seed6; 15 lần | 46.596 | 44.632–49.368 | — |
| filterTrash | load seed6; 15 lần | 0.102 | 0.071–0.184 | — |
| importBackup | load seed6; 1 lần (không phải median) | 928.376 | — | — |

Các số tự đo trên đây là **hàm thuần/DB trong Node**, không phải thao tác tới khung hình. Không lấy ngưỡng UI <200ms để đánh đồng với hàm thuần, không so trực tiếp với ms exe khác cách đo. Chưa thấy điểm nghẽn mới trong gói; listTrash đọc cả bảng đã KNOWN, đo 46,596ms không phải bằng chứng mới vượt ngưỡng.

Đã đọc docs/metrics/phase-6.md và common/perf/perf-ref.json của đúng máy/exe/SHA (09:28–09:30 14/10): overview.filter-year 16,8ms; reports.filter-year 9,5ms; reports.table-re 16,4ms; appointments.period-year 18,2ms; trash.open 91,2ms; tất cả dưới <200ms. reports.export-excel 36,4ms (≤500ms); backup.read 886,1ms (<2000ms); backup.import 51,1ms (<500ms). Đây là **tham chiếu common**, không phải số phiên E tự đo. Plan §6 nói không bắt buộc chạy lại probe exe; E không chạy lại, tránh tranh cửa sổ đo. Không có phát hiện trục P.

## 5. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| Tổng | 1 | 2 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 5 |

5 CONFIRMED, 0 PLAUSIBLE (0%), 0 KNOWN được ghi thành phát hiện mới. Mục KNOWN chỉ dùng để loại trùng, không cộng vào bảng. Mỗi ID đếm theo trục chính, không đếm lại vì có hệ quả sang trục khác.

## 6. Đã xét, không thấy (ngoài các ID ở mục 3)

| Trục | Đã đọc / chạy và giới hạn kết luận |
|---|---|
| E | Đọc mọi form ngày/giờ/tiền, kỳ tháng/tuần/năm/Tùy chọn, biên 1900/2100, nửa đêm; 256 unit có ca giao năm của lịch, năm nhuận/gợi ý 29/02, chuỗi dời, picker/lịch tháng. CX-E2 là ca hộp mở giao thừa mới. Không tự nhảy ngày đang chọn qua nửa đêm là ACCEPTED K/known, không báo lại. |
| C | Đối chiếu Phase 3/4/6 + mockup 1a–1e, 2a–2f, 6a–6i, 8a–8d, 10a–10d, 11a–11g; Lọc chờ áp dụng, nhóm 4 loại, Σ team/RE, so kỳ trước/MTD, snapshot KH, tên/mốc/sheet. 9 trạng thái ×6 kỳ ×4 góc nhìn =216 ca probe; mỗi trạng thái kiểm 17 ô Excel và backup roundtrip. Chỉ thấy CX-E1/E3 ngoài các lệch đã KNOWN. |
| D | Probe thật nộp/phát hành→xóa HĐ→xóa/khôi phục KH→khôi phục HĐ→xóa 2 cuộc gặp→chuyển tay→khôi phục giữ nhóm/chặn D10. KH khôi phục không kéo HĐ xóa riêng; RF về 0 khi giữ nhóm; restore bị chặn không đổi số; summary/totals/marks/KPI/Excel/backup khớp. Không thấy mất dữ liệu trong các ca đã chạy; CX-E2 riêng đã nêu. |
| G | Đã xét đường vào AppointmentAi, panel ở hồ sơ KH và hộp ghi chú KYC từ cuộc gặp; gói E không tự gọi AI để tính/sửa chỉ số, không lấy AI output để tự lưu HĐ/kết quả. UI probe là web Mock; không gọi OpenCode/eval/key thật/chatgpt.com. Validator/runner thuộc C, không tuyên bố đã review lại toàn G5. |
| S | SettingsBackup chặn size trước đọc, import preview tạm, xác nhận thay toàn bộ; form ghi qua AppData.run/S2-2; restoreRow bắt DbError; React hiển thị tên/file/text; workbook giữ tên dạng string (test =SUM/=HYPERLINK), tooltip escape (stage-chart.test.ts). Đọc S2-5 và app-data.ts:329–446: export bytes/snapshot không đọc DB qua await. Không thấy lỗ mới ở ranh giới E; S2/AI/Rust toàn phần thuộc B/C/F. |
| P | Đo 12 hàm theo bảng load thật; đọc tham chiếu exe/ngưỡng đúng máy, không đo exe riêng. Không có bằng chứng vượt ngưỡng mới, không nâng nghi ngờ thuật toán thành finding P. |
| B | noUnused/deps/codemap/build/size xanh; rg từng export; lặp plain/badge đã KNOWN. Chỉ CX-E5, Nit không đo được chi phí. |
| T | Đọc đủ 14 file test, chạy 256/256 PASS; 3 control-copy suites xanh; 2 mutant sai Excel/tỉ lệ bị assertion giết; mutant HĐ nối sai sống 47 unit, probe bổ sung giết, nguồn gốc pass: CX-E4. Không kết luận mọi test toàn repo vững từ coverage, không gọi lỗi nạp suite là KILLED. |
| A | Đọc nhãn i18n, role/status/alert, label input, Choices/Segmented, ngày/tháng có accessible name và aria-current, bảng col/row/colgroup, nút thu RE aria-expanded; 3 UI probe không pageerror. Chart thiếu số liệu cho screen reader, ô ngoài khoảng aria-hidden, OwnerCell key trùng chữ đã KNOWN; chưa có bằng chứng mới. Không chạy screen reader thật/tương phản toàn màn nên không tuyên bố chứng nhận trợ năng. |

KNOWN đã loại: K1–K17; đặc biệt K2 nhập bù, K4 Hiện thêm 100, K6 không xóa lịch Dời, K13 S-2, K14 khôi phục riêng/no scope; sai “nhóm sau N2” thay “N3→N2” của dòng chặn 11a; sort/Hiện thêm test hở; SCHEMA_TOO_NEW thiếu unit; helper plain/badge; chart screen reader; listTrash đọc toàn bảng. Không có hậu quả mới nên không mở lại thành ID.

## 7. Phụ lục — chứng cứ, nguồn probe, trạng thái cuối

Tất cả đường dẫn E/* trong báo cáo tính từ **C:/workspace/deep-review-1-6/codex/**; nguồn sản phẩm tính từ **C:/workspace/Project-2C-review-2** ở SHA ghim. Nguồn probe đầy đủ ở cuối mục này và các file E; bản chép mutation cũng nằm E/mutations, chưa từng patch repo.

| Đột biến (bản chép) | Đối chứng chưa sửa | Test cũ khi đột biến | Kết luận |
|---|---|---|---|
| Excel: revenue→issuedCount | 19/19 PASS | 2 FAIL, 17 PASS; nhận 3 thay 165000000 | KILLED |
| Tổng báo cáo: closeRate(issued,rf)→closeRate(rf,issued) | 27/27 PASS | 2 FAIL, 25 PASS; numerator/denominator đảo | KILLED |
| restoreRow HĐ: restorePolicy→restoreCustomer | 47/47 PASS | 47/47 PASS | SURVIVED unit cũ, CX-E4 |
| Probe bổ sung đúng HĐ | Nguồn repo 1/1 PASS | Mutant 1/1 FAIL: CUSTOMER_NOT_FOUND thay null | Probe bổ sung giết mutant |

- E/unit-tests.log: 14 file, 256 test PASS; start 17:23:22, duration 6,84s. Không chạy lại toàn verify/rust/e2e vì common/baseline đã ghi đúng SHA; không dùng PW_REUSE hay cổng 4173.
- E/checks.jsonl, no-unused.log, deps.log, codemap.log, build-web.log, size.log: lệnh/exit/duration và bundle. E/scope.json: đúng 51 file E; E/export-uses.json/audit-tests.log: AST+rg.
- E/probe-results.json/probe.log: 216 ca, Excel 17 ô/9 trạng thái, backup roundtrip và số đo load. E/ui-results.json/ui-probe.log: CX-E1/E2; E/case-size-probe.log/case-size-ui.txt: CX-E3. Ảnh CX-E1.png/CX-E2.png/CX-E3.png đã mở kiểm trực quan.
- E/mutation-status.json/mutation-run.log và từng thư mục mutations/{control,result,counterexample,counterexample-original}.log: assertions thật. Các lần bootstrap mutation trong audit-tests.mjs gặp alias @p2c/ai/schema và slash Windows không nạp suite; **không tính** là KILLED. mutation-run.mjs sửa môi trường trên bản chép và chạy control trước mutant.
- Bootstrap pnpm.ps1 bị ExecutionPolicy chặn: giữ E/unit-tests-bootstrap.log; chạy shim pnpm.cmd có sẵn, không đổi policy/cài công cụ. Vite preview mặc định bị sandbox chặn cache .vite-temp; đổi --configLoader native rồi chạy cổng local4196. Edge headless chỉ fixture giả; server preview đã dừng bằng Ctrl-C, browser đã đóng.
- E/progress-checkpoint.md giữ nguyên báo cáo ĐANG LÀM trước khi sắp xếp lại; nguồn/log còn trong E. Ghi chú tiến độ ban đầu nói nhầm 34 file SP/17 test; manifest classifyFile và thực chạy xác nhận **37 SP/14 test**, số cuối báo cáo là số đúng.

Git cuối phiên: HEAD **885534549808f42aec7f9af5743bbf86642ee4bd**; **git status --short rỗng**, khớp đầu phiên. Chỉ build/cache ignore có thể thay; không sửa code, không commit/Issue/PR/merge, không cài dependency, không đọc báo cáo bên khác hoặc nội dung A–D, không gọi AI sản phẩm. Giờ xong **2026-10-14 17:49:34 (Asia/Saigon)**. Không kết luận v1.0 trong gói E; phần đó dành gói F.

### Nguồn loader.mjs

```js
import fs from 'node:fs';
import path from 'node:path';
import { registerHooks, createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
const root='C:/workspace/Project-2C-review-2';
const rootRequire=createRequire(root+'/package.json');
const appRequire=createRequire(root+'/apps/desktop/package.json');
const ts=rootRequire('typescript');
registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); } catch (error) {
      if(specifier.startsWith('.')) {
        for(const suffix of ['.ts','.tsx','/index.ts']) {
          try { return nextResolve(specifier+suffix,context); } catch {}
        }
      }
      if(/^@p2c\/(domain|db|ui|ai)$/.test(specifier))
        return {url:pathToFileURL(root+'/packages/'+specifier.slice(5)+'/src/index.ts').href,shortCircuit:true};
      if(!specifier.startsWith('.')&&!specifier.startsWith('node:')) {
        try { return {url:pathToFileURL(appRequire.resolve(specifier)).href,shortCircuit:true}; } catch {}
      }
      throw error;
    }
  },
  load(url,context,nextLoad) {
    if(url.endsWith('?raw')) return {format:'module',source:'export default '+JSON.stringify(fs.readFileSync(new URL(url.slice(0,-4)),'utf8'))+';',shortCircuit:true};
    if(url.endsWith('.tsx')) return {format:'module',source:ts.transpileModule(fs.readFileSync(new URL(url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2023,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText,shortCircuit:true};
    return nextLoad(url,context);
  }
});
export const repo=root;
export const out=fileURLToPath(new URL('.',import.meta.url));
export const appRequireFromRepo=appRequire;
```

### Nguồn probe.mjs

```js
import {repo,out,appRequireFromRepo} from './loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const mod=p=>import('file:///'+repo+'/'+p);
const dbm=await mod('packages/db/src/index.ts');
const dom=await mod('packages/domain/src/index.ts');
const {readTables}=await mod('apps/desktop/src/data/tables.ts');
const rep=await mod('apps/desktop/src/routes/reports/reports-view.ts');
const wb=await mod('apps/desktop/src/routes/reports/report-workbook.ts');
const ov=await mod('apps/desktop/src/routes/overview/overview-view.ts');
const st=await mod('apps/desktop/src/routes/overview/stage-view.ts');
const tc=await mod('apps/desktop/src/routes/overview/team-compare-view.ts');
const av=await mod('apps/desktop/src/routes/appointments/appointments-view.ts');
const af=await mod('apps/desktop/src/routes/appointments/appointment-form.ts');
const pf=await mod('apps/desktop/src/routes/customers/policy-form.ts');
const tv=await mod('apps/desktop/src/routes/trash-view.ts');
const {default:Excel}=await mod('apps/desktop/node_modules/exceljs/excel.js');
const results={sha:'8855345',machine:process.env.COMPUTERNAME,node:process.version,at:new Date().toISOString(),concurrency:'Không chạy build/test/đo khác do phiên này khởi tạo; không kiểm tra tác vụ reviewer khác.',checks:[],timings:{}};
const log=(name,value)=>{results.checks.push({name,value});fs.writeFileSync(out+'probe-results.json',JSON.stringify(results,null,2));console.log(name+': '+JSON.stringify(value));};
const d=(day,month=10,year=2026)=>dom.calendarDate(year,month,day);
const today=d(14),all={kind:'all'};
let clock=Date.parse('2026-10-14T05:00:00Z');
const db=await dbm.openDatabase({now:()=>new Date(clock++)});
const team=dbm.createTeam(db,{name:'Gói E'});
const re=dbm.createPerson(db,{name:'RE E',role:'RE',teamId:team.id});
const re2=dbm.createPerson(db,{name:'RE E2',role:'RE',teamId:team.id});
const customer=dbm.createCustomer(db,{name:'KH E',reId:re.id,stage:'N3',date:d(1)});
const policy=dbm.submitPolicy(db,{customerId:customer.id,reId:re.id,submittedDate:d(4),submittedFyp:400000000});
const issued=dbm.issuePolicy(db,policy.id,{issuedDate:d(10),issuedFyp:400000000});
const a=dbm.scheduleAppointment(db,{customerId:customer.id,reId:re.id,date:d(5),triggerType:'OTHER'});
dbm.recordMeetingOutcome(db,a.id,{status:'MET',stageAfter:'N2',nextStep:'Hẹn tiếp'});
const b=dbm.scheduleAppointment(db,{customerId:customer.id,reId:re2.id,date:d(8),triggerType:'OTHER'});
dbm.recordMeetingOutcome(db,b.id,{status:'MET',stageAfter:'N1',nextStep:'Hẹn tiếp'});
const planned=dbm.scheduleAppointment(db,{customerId:customer.id,reId:re.id,date:d(20),triggerType:'OTHER'});
const periods=[dom.periodOf('day',today),dom.periodOf('week',today),dom.periodOf('month',today),dom.periodOf('year',today),dom.customPeriod(d(1),d(31)),dom.periodOf('month',d(1,11))];
const scopes=[all,{kind:'team',teamId:team.id},{kind:'re',reId:re.id},{kind:'re',reId:re2.id}];
const numberKeys=['rfCount','submittedCount','caseSize','issuedCount','revenue'];
const phase=async name=>{
 const data=readTables(db);
 let cases=0;
 for(const period of periods)for(const scope of scopes){
  const rows=rep.reportRows(data,period,scope,today),summary=rows.summary;
  for(const tab of [rows.byTeam,rows.byRe])if(tab){assert.deepEqual(tab.total.appointments,summary.appointments);assert.deepEqual(tab.total.metrics,summary.metrics);assert.deepEqual(tab.total.stages,summary.stages);}
  assert.deepEqual(dom.appointmentCounts(data.appointments,period,scope,data.people,today),summary.appointments);
  const kpis=ov.kpiTiles(data,period,scope,today),cells=rep.reportCells(summary);
  assert.deepEqual(kpis.map(x=>x.value+(x.unit?(x.unitSpaced?' ':'')+x.unit:'')),cells.slice(5,11));
  const sb=st.stageBlock(data,period,scope,today);
  if(summary.stages)for(const key of st.CHART_STAGES){const expected=scope.kind==='team'?rep.reportRows(data,period,all,today).summary.stages[key]:summary.stages[key];assert.equal(sb.tiles[key],expected);}
  const marks=rows.byMark;
  for(const key of ['met','missed','unrecorded','planned','total']) assert.equal(marks.reduce((sum,m)=>sum+m.appointments[key],0),summary.appointments[key]);
  if(summary.metrics)for(const key of numberKeys)assert.equal(marks.reduce((sum,m)=>sum+(m.metrics?.[key]??0),0),summary.metrics[key]);
  cases++;
 }
 const period=dom.periodOf('month',today),rows=rep.reportRows(data,period,all,today);
 const bytes=await wb.buildReportWorkbook(rows,wb.reportWorkbookMeta(ov.viewingText({period,scope:all},today,data.people,data.teams),today));
 const excel=new Excel.Workbook();await excel.xlsx.load(bytes.buffer);
 const r=rows.summary;const nums=[...Object.values(r.appointments),...(r.metrics?[...numberKeys.map(k=>r.metrics[k]),r.metrics.closeRate?r.metrics.closeRate.numerator/r.metrics.closeRate.denominator:null]:Array(6).fill(null)),...rep.REPORT_STAGES.map(k=>r.stages?.[k]??null)];
 const sheet=excel.getWorksheet('Tổng hợp');nums.forEach((v,i)=>assert.equal(sheet.getCell(4,i+2).value,v));
 const backup=dbm.exportBackup(db);const imported=await dbm.importBackup(backup,{now:()=>new Date(clock++)});
 assert.deepEqual(rep.reportRows(readTables(imported.db),period,all,today).summary,rows.summary);
 imported.db.sqlite.close();
 log(name,{cases,appointments:r.appointments,metrics:r.metrics,stages:r.stages,trash:dbm.listTrash(db).map(x=>({kind:x.kind,blocked:x.blocked?.code,effect:x.effect})),excelCells:nums.length,backupRoundTrip:'PASS'});
};
await phase('initial');
dbm.softDeletePolicy(db,policy.id);await phase('policy-deleted');
dbm.softDeleteCustomer(db,customer.id);await phase('customer-deleted');
dbm.restoreCustomer(db,customer.id);await phase('customer-restored');
dbm.restorePolicy(db,policy.id);await phase('policy-restored');
dbm.softDeleteAppointment(db,b.id);await phase('latest-meeting-deleted');
dbm.softDeleteAppointment(db,a.id);await phase('rf-meeting-deleted');
dbm.changeStageManually(db,customer.id,{to:'N2',date:d(12)});
let trash=dbm.listTrash(db);const ar=trash.find(x=>x.id===a.id);assert.equal(ar.effect.kind,'stageKept');
assert.equal(tv.restoreRow({run:fn=>fn(db)},ar),null);await phase('rf-restored-stage-kept');
const br=dbm.listTrash(db).find(x=>x.id===b.id);assert.equal(br.blocked.code,'TRANSITION_BEFORE_LATEST');
assert.notEqual(tv.restoreRow({run:fn=>fn(db)},br),null);await phase('blocked-restore-keeps-data');
const draft={submittedDate:'04/10/2026',submittedFyp:'500tr',issued:{date:'10/10/2026',fyp:'385,5tr'}};
const read=pf.readPolicy(draft,today);assert.ok(read.policy);
const hint=pf.issuedChange(issued,{issuedDate:read.policy.issuedDate,issuedFyp:read.policy.issuedFyp});
log('policy-hint',{savedSubmitted:issued.submittedFyp,draftSubmitted:read.policy.submittedFyp,draftIssued:read.policy.issuedFyp,shownDifference:hint.fromSubmitted,expectedDifference:read.policy.issuedFyp-read.policy.submittedFyp});
fs.writeFileSync(out+'ui-fixture.p2cbackup',dbm.exportBackup(db));
// Cancellation edit opened in 2026: exact dayText -> readScheduleDate path after New Year.
clock=Date.parse('2026-12-31T16:59:00Z');
const c=dbm.scheduleAppointment(db,{customerId:customer.id,reId:re.id,date:d(30,12),triggerType:'OTHER'});
dbm.recordMeetingOutcome(db,c.id,{status:'CANCELLED',note:'Trước năm mới'});
fs.writeFileSync(out+'year-boundary-fixture.p2cbackup',dbm.exportBackup(db));
const dateText=af.dayText(c.date,d(31,12));clock=Date.parse('2027-01-01T00:01:00Z');
const reread=af.readScheduleDate(dateText,d(1,1,2027),'any');assert.ok(reread.ok);
const changed=dbm.editMeetingOutcome(db,c.id,{status:'CANCELLED',note:'Chỉ sửa ghi chú'},{date:reread.date});
log('year-boundary',{text:dateText,before:dom.formatIsoDate(c.date),after:dom.formatIsoDate(changed.date),sameUserText:true});
// Load dataset, warm getters, pure operations measured sequentially on this host.
const loadFile='C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup';
const text=fs.readFileSync(loadFile,'utf8'),json=JSON.parse(text);
log('load-input',{bytes:Buffer.byteLength(text),hash:crypto.createHash('sha256').update(JSON.stringify(json.tables)).digest('hex'),rows:Object.fromEntries(Object.entries(json.tables).map(([k,v])=>[k,v.length]))});
const start=performance.now();const imported=await dbm.importBackup(text,{now:()=>new Date('2026-10-14T05:00:00Z')});results.timings.importBackupMs=performance.now()-start;
const data=readTables(imported.db);for(const key of ['teams','people','customers','appointments','policies','transitions'])void data[key];
const year=dom.periodOf('year',today),month=dom.periodOf('month',today);
const measure=(name,fn)=>{fn();const runs=[];for(let i=0;i<15;i++){const t=performance.now();fn();runs.push(performance.now()-t);}runs.sort((a,b)=>a-b);results.timings[name]={runs:15,median:runs[7],min:runs[0],max:runs.at(-1)};fs.writeFileSync(out+'probe-results.json',JSON.stringify(results,null,2));console.log('perf '+name+': '+JSON.stringify(results.timings[name]));};
measure('reportRows-year',()=>rep.reportRows(data,year,all,today));
measure('reportRows-month',()=>rep.reportRows(data,month,all,today));
measure('stageBlock-year-team',()=>st.stageBlock(data,year,{kind:'team',teamId:data.teams[0].id},today));
measure('stageBlock-month-team',()=>st.stageBlock(data,month,{kind:'team',teamId:data.teams[0].id},today));
measure('teamCompare-year',()=>tc.teamCompare(data,year,today));
measure('kpiTiles-year',()=>ov.kpiTiles(data,year,all,today));
measure('appointmentRows-all',()=>av.appointmentRows(data,all,'any'));
const rows=av.appointmentRows(data,all,'any');
measure('monthGrid',()=>av.monthGrid(today,rows,month,today));measure('yearGrid',()=>av.yearGrid(2026,rows,today));measure('dayBoard',()=>av.dayBoard(rows,today));
measure('listTrash',()=>dbm.listTrash(imported.db));
const trashRows=dbm.listTrash(imported.db);measure('filterTrash',()=>tv.filterTrash(trashRows,'all','minh'));
log('finished',{checks:'PASS',performance:'Node hàm thuần, không phải thời gian UI/exe; không suy ra hồi quy từ tham chiếu UI.'});
imported.db.sqlite.close();db.sqlite.close();
```

### Nguồn ui-probe.mjs

```js
import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='C:/workspace/Project-2C-review-2',out='C:/workspace/deep-review-1-6/codex/E/';
const {chromium}=createRequire(root+'/package.json')('@playwright/test');
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'Asia/Ho_Chi_Minh',acceptDownloads:true});
const page=await context.newPage();page.setDefaultTimeout(20000);
const result={at:new Date().toISOString(),port:4196,checks:[],errors:[]};
page.on('pageerror',e=>result.errors.push(e.message));
const save=()=>fs.writeFileSync(out+'ui-results.json',JSON.stringify(result,null,2));
const go=async hash=>{await page.evaluate(hash=>{location.hash=hash;},hash);};
const importFixture=async(file,time)=>{
 await page.clock.setFixedTime(new Date(time));
 await page.goto('http://127.0.0.1:4196/#/settings');
 await page.getByRole('heading',{name:'File dữ liệu',exact:true}).waitFor();
 await page.locator('input[type=file]').setInputFiles(out+file);
 const dialog=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?',exact:true});
 await dialog.waitFor();await dialog.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();
 await dialog.waitFor({state:'hidden'});
};
try {
 await importFixture('ui-fixture.p2cbackup','2026-10-14T05:00:00Z');
 const backup=JSON.parse(fs.readFileSync(out+'ui-fixture.p2cbackup','utf8'));
 const customer=backup.tables.customers.find(x=>x.name==='KH E');
 await go('#/customers/'+customer.id);
 await page.getByRole('heading',{name:'KH E',exact:true}).waitFor();
 await page.getByRole('button',{name:'Sửa HĐ nộp 04/10/2026',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Sửa HĐ · KH E',exact:true});
 await dialog.getByRole('textbox',{name:'FYP nộp',exact:true}).fill('500tr');
 await dialog.getByRole('textbox',{name:'FYP phát hành sửa tay',exact:true}).fill('385,5tr');
 const text=await dialog.innerText();
 assert.ok(text.includes('khác FYP nộp −14,5 tr'),text);
 result.checks.push({name:'CX-E1 UI',text});save();
 await page.screenshot({path:out+'CX-E1.png'});
 await dialog.getByRole('button',{name:'Hủy',exact:true}).click();
 await importFixture('year-boundary-fixture.p2cbackup','2026-12-31T16:59:00Z');
 const year=JSON.parse(fs.readFileSync(out+'year-boundary-fixture.p2cbackup','utf8'));
 const cancelled=year.tables.appointments.find(x=>x.status==='CANCELLED'&&x.date==='2026-12-30');
 await go('#/appointments');
 const table=page.getByRole('table',{name:'Danh sách lịch hẹn',exact:true});
 await table.getByRole('button',{name:'KH E',exact:true}).click();
 await page.getByRole('button',{name:'Sửa kết quả',exact:true}).click();
 const edit=page.getByRole('dialog',{name:'Sửa kết quả cuộc gặp',exact:true});
 const date=edit.getByRole('textbox',{name:'Ngày cuộc hẹn',exact:true});
 const before=await date.inputValue();
 await page.clock.setFixedTime(new Date('2026-12-31T17:01:00Z'));
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
 await edit.getByRole('textbox',{name:'Ghi chú',exact:false}).fill('Chỉ sửa ghi chú');
 const after=await date.inputValue();const text2=await edit.innerText();
 result.checks.push({name:'CX-E2 UI before save',before,after,text:text2});save();
 await page.screenshot({path:out+'CX-E2.png'});
 await edit.getByRole('button',{name:'Lưu',exact:true}).click();await edit.waitFor({state:'hidden'});
 await go('#/settings');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất backup',exact:true}).click();
 const download=await downloadPromise;await download.saveAs(out+'year-boundary-after-ui.p2cbackup');
 const exported=JSON.parse(fs.readFileSync(out+'year-boundary-after-ui.p2cbackup','utf8'));
 const stored=exported.tables.appointments.find(x=>x.id===cancelled.id);
 assert.equal(stored.date,'2027-12-30');
 result.checks.push({name:'CX-E2 UI saved',before:cancelled.date,after:stored.date,note:stored.note});save();
 console.log(JSON.stringify(result));
} catch(e){result.failure={message:e.message,stack:e.stack};save();await page.screenshot({path:out+'ui-failure.png'});console.log(JSON.stringify(result));process.exitCode=1;}
finally {await browser.close();}
```

### Nguồn case-size-probe.mjs

```js
import {repo,out,appRequireFromRepo} from './loader.mjs';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const imp=p=>import('file:///'+repo+'/'+p);
const dbm=await imp('packages/db/src/index.ts');
const {calendarDate:d}=await imp('packages/domain/src/index.ts');
const {expectedCaseSize}=await imp('apps/desktop/src/routes/customers/policy-form.ts');
const db=await dbm.openDatabase({now:()=>new Date('2026-10-14T05:00:00Z')});
const team=dbm.createTeam(db,{name:'Team E'});const re=dbm.createPerson(db,{name:'RE E',role:'RE',teamId:team.id});
const customer=dbm.createCustomer(db,{name:'KH Ước lượng',reId:re.id,date:d(2026,10,1),stage:'N3'});
for(const [day,size] of [[5,800000000],[8,null]]){const a=dbm.scheduleAppointment(db,{customerId:customer.id,reId:re.id,date:d(2026,10,day),triggerType:'OTHER'});dbm.recordMeetingOutcome(db,a.id,{status:'MET',stageAfter:'N3',nextStep:'Chăm sóc',expectedCaseSize:size});}
fs.writeFileSync(out+'case-size-fixture.p2cbackup',dbm.exportBackup(db));
const appointments=dbm.listAppointments(db,customer.id);console.log(JSON.stringify({lastMet:appointments.at(-1),returned:expectedCaseSize(appointments)}));
const {chromium}=createRequire(repo+'/package.json')('@playwright/test');
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},timezoneId:'Asia/Ho_Chi_Minh'});
try{await page.clock.setFixedTime(new Date('2026-10-14T05:00:00Z'));await page.goto('http://127.0.0.1:4196/#/settings');await page.getByRole('heading',{name:'File dữ liệu',exact:true}).waitFor();await page.locator('input[type=file]').setInputFiles(out+'case-size-fixture.p2cbackup');const confirm=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?',exact:true});await confirm.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();await confirm.waitFor({state:'hidden'});await page.evaluate(id=>{location.hash='#/customers/'+id},customer.id);await page.getByRole('button',{name:'+ Hợp đồng',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Hợp đồng mới · đã nộp',exact:true});await dialog.waitFor();const text=await dialog.innerText();console.log(text);fs.writeFileSync(out+'case-size-ui.txt',text);await page.screenshot({path:out+'CX-E3.png'});}finally{await browser.close();db.sqlite.close();}
```

### Nguồn run-tests.mjs

```js
import fs from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {repo,out} from './loader.mjs';
const {classifyFile,countLines}=await import('file:///'+repo+'/tools/size-report-core.mjs');
const files=execFileSync('git',['ls-files'],{cwd:repo,encoding:'utf8'}).trim().split('\n').filter(p=>classifyFile(p)?.pkg==='E');
fs.writeFileSync(out+'scope.json',JSON.stringify(files.map(p=>({path:p,lines:countLines(fs.readFileSync(repo+'/'+p,'utf8')),kind:classifyFile(p).kind})),null,2));
const tests=files.filter(p=>classifyFile(p).kind==='test');
const log=fs.openSync(out+'unit-tests.log','w');
const r=spawnSync('powershell',['-NoProfile','-Command','pnpm.cmd exec vitest run '+tests.join(' ')],{cwd:repo,stdio:['ignore',log,log]});
fs.closeSync(log);
console.log(JSON.stringify({testFiles:tests.length,status:r.status,error:r.error?.message}));
```

### Nguồn checks.mjs

```js
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {repo,out} from './loader.mjs';
const commands=[['no-unused','pnpm.cmd exec tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters'],['deps','pnpm.cmd lint:deps'],['codemap','pnpm.cmd codemap --check'],['build-web','pnpm.cmd build:web'],['size','node tools/size-report.mjs --json']];
for(const [name,command] of commands){const f=fs.openSync(out+name+'.log','w'); const before=performance.now(); const r=spawnSync('powershell',['-NoProfile','-Command',command],{cwd:repo,stdio:['ignore',f,f]}); fs.closeSync(f);const line=JSON.stringify({command,status:r.status,ms:performance.now()-before,error:r.error?.message}); fs.appendFileSync(out+'checks.jsonl',line+'\n'); console.log(line);}
```

### Nguồn mutation-run.mjs

```js
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {repo,out as windowsOut,appRequireFromRepo} from './loader.mjs';
const out=windowsOut.replaceAll('\\','/');
const cases=[
 {name:'workbook-revenue-issuedCount',source:'apps/desktop/src/routes/reports/report-workbook.ts',test:'apps/desktop/src/routes/reports/report-workbook.test.ts',from:"value: result('revenue')",to:"value: result('issuedCount')"},
 {name:'report-total-reversed-rate',source:'apps/desktop/src/routes/reports/reports-view.ts',test:'apps/desktop/src/routes/reports/reports-view.test.ts',from:'closeRate(summed.issuedCount, summed.rfCount)',to:'closeRate(summed.rfCount, summed.issuedCount)'},
 {name:'trash-policy-wrong-command',source:'apps/desktop/src/routes/trash-view.ts',test:'apps/desktop/src/routes/trash-view.test.ts',from:'policy: restorePolicy,',to:'policy: restoreCustomer,'}
];
const rewrite=(s,sourceDir,override)=>s.replace(/(from\s*|import\(\s*)(['"])(\.[^'"\n]+)\2/g,(m,lead,quote,rel)=>{const target=path.resolve(sourceDir,rel).replaceAll('\\','/');return lead+quote+(override?.[target]??target)+quote;});
const alias={'@p2c/domain':repo+'/packages/domain/src/index.ts','@p2c/db':repo+'/packages/db/src/index.ts','@p2c/ui':repo+'/packages/ui/src/index.ts','@p2c/ai/schema':repo+'/packages/ai/src/schema.ts','@p2c/ai':repo+'/packages/ai/src/index.ts','exceljs':appRequireFromRepo.resolve('exceljs')};
const statuses=[];
for(const c of cases){
 const dir=out+'mutations/'+c.name+'/',source=repo+'/'+c.source,test=repo+'/'+c.test,copy=dir+path.basename(c.source);
 const original=fs.readFileSync(source,'utf8');
 fs.writeFileSync(dir+path.basename(c.test),rewrite(fs.readFileSync(test,'utf8'),path.dirname(test),{[source.replace(/\.ts$/,'')]:copy}));
 fs.writeFileSync(dir+'vitest.config.mjs','export default '+JSON.stringify({root:dir,resolve:{alias},test:{include:['*.test.ts'],testTimeout:60000,hookTimeout:60000}},null,2));
 const run=(kind,text)=>{fs.writeFileSync(copy,rewrite(text,path.dirname(source)));const f=fs.openSync(dir+kind+'.log','w');const r=spawnSync('powershell',['-NoProfile','-Command','pnpm.cmd exec vitest run --config '+dir+'vitest.config.mjs'],{cwd:repo,stdio:['ignore',f,f]});fs.closeSync(f);return r.status;};
 const control=run('control',original),mutant=run('result',original.replace(c.from,c.to));
 statuses.push({name:c.name,control,mutant});fs.writeFileSync(out+'mutation-status.json',JSON.stringify(statuses,null,2));console.log(JSON.stringify(statuses.at(-1)));
}
```

### Nguồn mutations/trash-policy-wrong-command/counterexample.test.ts

```ts
import {describe,it,expect} from 'vitest';
import {openDatabase,createTeam,createPerson,createCustomer,submitPolicy,softDeletePolicy,listTrash,listPolicies} from '@p2c/db';
import {calendarDate} from '@p2c/domain';
import {restoreRow} from './trash-view';
it('probe: restoring a deleted policy dispatches restorePolicy and brings the policy back',async()=>{
 const db=await openDatabase({now:()=>new Date('2026-10-14T05:00:00Z')});
 try{
  const date=calendarDate(2026,10,14),team=createTeam(db,{name:'E'}),re=createPerson(db,{name:'E',role:'RE',teamId:team.id});
  const c=createCustomer(db,{name:'E',stage:'N3',date,reId:re.id});
  const p=submitPolicy(db,{customerId:c.id,reId:re.id,submittedDate:date,submittedFyp:1000000});softDeletePolicy(db,p.id);
  const row=listTrash(db).find(r=>r.id===p.id)!;
  const result=restoreRow({run:fn=>fn(db)},row);
  expect(result).toBeNull();expect(listPolicies(db).map(p=>p.id)).toContain(p.id);
 }finally{db.sqlite.close();}
});
```

### Nguồn mutations/trash-policy-wrong-command/counterexample-original.test.ts

```ts
import {describe,it,expect} from 'vitest';
import {openDatabase,createTeam,createPerson,createCustomer,submitPolicy,softDeletePolicy,listTrash,listPolicies} from '@p2c/db';
import {calendarDate} from '@p2c/domain';
import {restoreRow} from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/trash-view';
it('probe: restoring a deleted policy dispatches restorePolicy and brings the policy back',async()=>{
 const db=await openDatabase({now:()=>new Date('2026-10-14T05:00:00Z')});
 try{
  const date=calendarDate(2026,10,14),team=createTeam(db,{name:'E'}),re=createPerson(db,{name:'E',role:'RE',teamId:team.id});
  const c=createCustomer(db,{name:'E',stage:'N3',date,reId:re.id});
  const p=submitPolicy(db,{customerId:c.id,reId:re.id,submittedDate:date,submittedFyp:1000000});softDeletePolicy(db,p.id);
  const row=listTrash(db).find(r=>r.id===p.id)!;
  const result=restoreRow({run:fn=>fn(db)},row);
  expect(result).toBeNull();expect(listPolicies(db).map(p=>p.id)).toContain(p.id);
 }finally{db.sqlite.close();}
});
```

