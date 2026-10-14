XONG — codex gói E, 2026-10-14 00:31:06 +07:00

# Deep review Phase 1–6, lượt 1 — Codex, Gói E

## 1. Thông tin phiên

- Bên: codex. Gói E — Lịch hẹn, chỉ số, quản lý.
- Bắt đầu: 2026-10-14 00:05:04 +07:00 (Asia/Bangkok).
- SHA đầu và cuối: 885534549808f42aec7f9af5743bbf86642ee4bd. Worktree C:\workspace\Project-2C-review-2, detached HEAD.
- git status --short đầu phiên:

~~~text
?? .agents/
?? .codex/
?? AGENTS.md
~~~

A–D tồn tại và dòng đầu không phải ĐANG LÀM. Chỉ kiểm dòng đầu, không đọc phát hiện A–D. Không đọc hoặc liệt kê báo cáo bên khác. Repo chỉ đọc: không sửa sản phẩm, spec, golden hoặc test gốc; không commit, Issue, PR, merge. Không subagent; không nghi thức phiên phát triển. Chỉ dùng dịch vụ local / dữ liệu giả, không gọi AI thật hay đọc key.

Kết quả: **3 phát hiện Low, đều CONFIRMED**. Không có Critical / High / Medium trong phạm vi đã kiểm. Không kết luận phát hành v1.0 ở gói E.

## 2. Phạm vi đã đọc

Đọc 51 file theo classifyFile của tools/size-report-core.mjs: 37 file sản phẩm / 7.032 dòng, 14 file test / 3.545 dòng. File AI trong appointments thuộc C; AppointmentAi được đọc ở chỗ nối, không tính vào E. Các dòng dưới là khoảng của file ở SHA ghim.

| File | Dòng | Loại |
|---|---|---|
| apps/desktop/src/routes/FilterBar.tsx | 1–82 | SP |
| apps/desktop/src/routes/Overview.tsx | 1–61 | SP |
| apps/desktop/src/routes/RestoreDialog.tsx | 1–65 | SP |
| apps/desktop/src/routes/Settings.tsx | 1–170 | SP |
| apps/desktop/src/routes/SettingsBackup.tsx | 1–280 | SP |
| apps/desktop/src/routes/SettingsDataFile.tsx | 1–135 | SP |
| apps/desktop/src/routes/SettingsTrash.tsx | 1–226 | SP |
| apps/desktop/src/routes/applied-filter.test.ts | 1–109 | Test |
| apps/desktop/src/routes/applied-filter.ts | 1–51 | SP |
| apps/desktop/src/routes/appointments/AppointmentDialog.tsx | 1–447 | SP |
| apps/desktop/src/routes/appointments/AppointmentsScreen.tsx | 1–652 | SP |
| apps/desktop/src/routes/appointments/DateSuggestion.test.tsx | 1–24 | Test |
| apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx | 1–100 | SP |
| apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx | 1–237 | SP |
| apps/desktop/src/routes/appointments/MetFields.test.ts | 1–36 | Test |
| apps/desktop/src/routes/appointments/MetFields.tsx | 1–164 | SP |
| apps/desktop/src/routes/appointments/OutcomeDialog.tsx | 1–292 | SP |
| apps/desktop/src/routes/appointments/RescheduleDialog.tsx | 1–60 | SP |
| apps/desktop/src/routes/appointments/RescheduleFields.tsx | 1–142 | SP |
| apps/desktop/src/routes/appointments/YearGrid.tsx | 1–142 | SP |
| apps/desktop/src/routes/appointments/appointment-form.test.ts | 1–210 | Test |
| apps/desktop/src/routes/appointments/appointment-form.ts | 1–125 | SP |
| apps/desktop/src/routes/appointments/appointments-view.test.ts | 1–637 | Test |
| apps/desktop/src/routes/appointments/appointments-view.ts | 1–471 | SP |
| apps/desktop/src/routes/appointments/outcome-form.test.ts | 1–193 | Test |
| apps/desktop/src/routes/appointments/outcome-form.ts | 1–132 | SP |
| apps/desktop/src/routes/customers/CustomerPolicies.tsx | 1–109 | SP |
| apps/desktop/src/routes/customers/PolicyDialogs.tsx | 1–354 | SP |
| apps/desktop/src/routes/customers/policy-form.test.ts | 1–173 | Test |
| apps/desktop/src/routes/customers/policy-form.ts | 1–138 | SP |
| apps/desktop/src/routes/overview/OverviewTiles.tsx | 1–76 | SP |
| apps/desktop/src/routes/overview/StageBlock.tsx | 1–127 | SP |
| apps/desktop/src/routes/overview/TeamCompare.tsx | 1–127 | SP |
| apps/desktop/src/routes/overview/overview-view.test.ts | 1–312 | Test |
| apps/desktop/src/routes/overview/overview-view.ts | 1–252 | SP |
| apps/desktop/src/routes/overview/stage-chart.test.ts | 1–150 | Test |
| apps/desktop/src/routes/overview/stage-chart.ts | 1–130 | SP |
| apps/desktop/src/routes/overview/stage-view.test.ts | 1–235 | Test |
| apps/desktop/src/routes/overview/stage-view.ts | 1–142 | SP |
| apps/desktop/src/routes/overview/team-compare-view.test.ts | 1–128 | Test |
| apps/desktop/src/routes/overview/team-compare-view.ts | 1–129 | SP |
| apps/desktop/src/routes/period-labels.ts | 1–26 | SP |
| apps/desktop/src/routes/reports/ReportExport.tsx | 1–96 | SP |
| apps/desktop/src/routes/reports/ReportTable.tsx | 1–154 | SP |
| apps/desktop/src/routes/reports/ReportsScreen.tsx | 1–113 | SP |
| apps/desktop/src/routes/reports/report-workbook.test.ts | 1–336 | Test |
| apps/desktop/src/routes/reports/report-workbook.ts | 1–259 | SP |
| apps/desktop/src/routes/reports/reports-view.test.ts | 1–366 | Test |
| apps/desktop/src/routes/reports/reports-view.ts | 1–327 | SP |
| apps/desktop/src/routes/trash-view.test.ts | 1–636 | Test |
| apps/desktop/src/routes/trash-view.ts | 1–439 | SP |

Nguồn đối chiếu: CLAUDE.md gốc và apps/desktop/CLAUDE.md (bản đồ route/export), CONTEXT.md; common/prompt-codex.md, plan.md §§1/3/4/5/6/10, known.md, baseline.md, perf/perf-ref.json; Phase 3 schema/lệnh/HĐ/backup, Phase 4 toàn spec (C01–C11, M01–M04), Phase 6 S2-1…S2-6, TR-1…TR-10, E1…E17 và ngưỡng §5; docs/metrics/phase-6.md phần số đo nền/ngưỡng.

Mockup: overview.html 1a–1e/2, reports.html 2a–2f, appointments.html phần màn, appointment-forms.html 6a–6i, policy-forms.html 8a–8d, customer.html khối Hợp đồng, settings-data.html 10a–10d, trash.html 11a–11g, phase-3-feedback.html B3–B6; đọc nội dung/ghi chú và đoạn HTML liên quan. Golden: chi-so G01–G22, lich-hen A01–A13, kh-theo-nhom S01–S13. Dùng các quyết định Phase 4/6 mới thay phần mockup cũ đã được thay thế, không đổi mockup cho khớp code.

File nối được kiểm: data/AppDataContext.tsx (useQuery/useToday), today.ts (watchToday), app-data.ts (AppData/openAppData/backup/replace), tables.ts; shell/AppShell.tsx, ScopeContext.tsx/scope.ts; routes/Screen.tsx, CustomerProfile.tsx và seam parseRecordDate; packages/db database/backup/customers và lệnh HĐ/khôi phục qua probe; packages/ui Dialog/DataTable; e2e/customer-policies.spec.ts ca 8d, e2e/trash.spec.ts các ca khôi phục/khóa ghi; tools/size-report-core.mjs, load-data.mjs và e2e/perf/README.md để thiết lập phép đo. Không review lại toàn gói khác.

## 3. Phát hiện

### CX-E1 — Thùng rác giữ lý do chặn cũ khi sang ngày mới

ID: CX-E1
Mức: Low
Trục: E
Vị trí: apps/desktop/src/routes/SettingsTrash.tsx:146; apps/desktop/src/data/AppDataContext.tsx:26 (8855345)
Tình trạng: CONFIRMED
Mô tả: Nút Khôi phục và câu chặn phụ thuộc hôm nay không cập nhật khi ngày app đổi. TrashSection gọi useQuery(listTrash); memo chỉ phụ thuộc revision, không phụ thuộc ngày.
Tái hiện / bằng chứng: Chạy node C:\workspace\deep-review-1-6\codex\E\ui-probe.mjs (harness/Vite cổng 4186, Edge headless). Ngày app 14/10/2026, HĐ đã xóa có ngày nộp 15/10: app.readBackup nhận backup đó hợp lệ (TR-5 cho bản ghi đã xóa trong file mang ngày tương lai). TRASH_BEFORE.disabled=true. Đổi đồng hồ app sang 15/10, phát focus: TRASH_FRESH_AFTER_DAY.trash[0] không còn blocked, nhưng TRASH_UI_AFTER_DAY.disabled=true và còn câu “Ngày nộp 15/10/2026 sau hôm nay.” Một lệnh ghi không liên quan làm revision đổi: TRASH_AFTER_WRITE.disabled=false. Nguồn ui.log/ui-results.json, ảnh trash-after-day.png.
Ảnh hưởng: Bản ghi TR-5 đang chờ tới ngày của nó, màn mở qua nửa đêm hoặc máy ngủ rồi thức. Có đường vòng rời rồi mở lại Thùng rác; không đổi dữ liệu.
Đề xuất: Theo dõi useToday và gắn ngày vào dependency của hàm đọc để listTrash thực sự chạy lại. Chỉ thêm useToday rồi re-render chưa đủ vì useQuery còn memo theo revision. ≈ 10–25 dòng SP (≤400), test UI đổi ngày/focus; giữ trash-view.test và các ca E13/TR-5.

### CX-E2 — So FYP trong form sửa dùng số nộp cũ

ID: CX-E2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/PolicyDialogs.tsx:157; apps/desktop/src/routes/customers/policy-form.ts:97 (8855345)
Tình trạng: CONFIRMED
Mô tả: Sửa FYP nộp trong cùng dialog làm dòng “khác FYP nộp” tiếp tục so với bản đã lưu, trái nghĩa nhãn và preview 8d.
Tái hiện / bằng chứng: UI probe mở HĐ đã lưu nộp 24 tr / phát hành 21 tr, đổi ô FYP nộp thành 30tr. POLICY_DRAFT ghi submitted=30tr, issued=21.000.000 ₫; dialog hiện “30.000.000 ₫ (30 tr)” và “21.000.000 ₫ (21 tr) · khác FYP nộp −3 tr”. Đúng phải −9 tr. PolicyDialogs truyền mode.policy vào issuedChange, hàm trừ saved.submittedFyp. Bấm Lưu: POLICY_SAVED.submittedFyp=30000000, issuedFyp=21000000, xác nhận chỉ sai preview. Nguồn ui.log/ui-results.json, ảnh policy-draft.png; mockup policy-forms.html:164.
Ảnh hưởng: Người sửa FYP nộp của HĐ đã phát hành thấy chênh lệch sai trước khi lưu; tiền thật và báo cáo sau lưu đúng.
Đề xuất: So FYP phát hành với FYP nộp đang nhập (read.submittedFyp), giữ riêng so doanh số với issuedFyp đã lưu. ≈ 10–30 dòng SP (≤400); thêm ca sửa cả hai ô vào policy-form/e2e/customer-policies, giữ test ảnh hưởng doanh số hiện có.

### CX-E3 — Ngày điền sẵn của Hẹn tiếp tự nhảy năm qua giao thừa

ID: CX-E3
Mức: Low
Trục: E
Vị trí: apps/desktop/src/routes/appointments/AppointmentDialog.tsx:81; apps/desktop/src/routes/appointments/AppointmentDialog.tsx:96 (8855345)
Tình trạng: CONFIRMED
Mô tả: Hẹn tiếp điền ngày từ lịch cũ bằng dd/mm và đọc lại theo năm của hôm nay mỗi render. Khi dialog để mở qua giao thừa, cùng chuỗi đó đổi thành năm mới dù người dùng chưa chọn lại.
Tái hiện / bằng chứng: UI probe ngày app 31/12/2026, mở Hẹn tiếp từ cuộc gặp cùng ngày. YEAR_DIALOG_BEFORE: ô 31/12, preview “31/12/2026 · hôm nay”. Đổi ngày app sang 01/01/2027 và phát focus: YEAR_DIALOG_AFTER: “31/12/2027 · 364 ngày nữa”. Không sửa ô ngày, bấm Tạo lịch hẹn: YEAR_ROWS có lịch SCHEDULED mới với date={year:2027,month:12,day:31}. Mockup 6b nói “App không tự đổi năm; RE chọn”, 6h yêu cầu từ hôm nay trở đi và người dùng tự dùng gợi ý. Nguồn ui.log/ui-results.json, ảnh year-after-day.png.
Ảnh hưởng: Dialog mở qua đổi năm (kể cả máy ngủ), có thể lưu ngày cách gần một năm thay vì giữ ngày điền sẵn đã qua để yêu cầu chọn lại. Điều kiện hiếm và có preview ngày mới nên giữ Low, không nâng mức.
Đề xuất: Ngày app điền sẵn giữ đủ năm, hoặc giữ năm diễn giải của draft và yêu cầu chọn lại khi năm đổi. ≈ 10–30 dòng SP (≤400); test Hẹn tiếp 31/12→01/01, giữ các ca readScheduleDate/dayText hiện có. Rà tương tự các draft ngày do app điền sẵn trong EditOutcomeDialog/PolicyDialog khi sửa.

## 4. Bloat

| Đã chạy / đọc | Dữ liệu | Số / kết quả | ID |
|---|---|---|---|
| tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters | App và dependency TS | Exit 0; 0 diagnostic; unused.log | — |
| rg từng export, bloat-probe.mjs | 37 file SP E; nơi tham chiếu trong apps/packages/e2e/tools | 183 khai báo export; 22 không có tham chiếu ngoài file = 21 type/interface + markName vẫn dùng nội bộ. Không thấy code SP chết; export-audit.json lưu danh sách ứng viên để rà, không coi type export dư là code chết | — |
| pnpm codemap:check; đọc bản đồ apps/desktop/CLAUDE.md | Route/export SHA ghim | Export maps are up to date; không chạy codemap chế độ ghi | — |
| pnpm lint:deps | 309 module / 1.244 dependency | 0 violation | — |
| So đoạn lặp / header schema | appointment-form/plain, trash-view/plain, report-workbook/slug; 17 cột report ở view/table/workbook | plain/slug và ghép mốc là KNOWN; không có bằng chứng chi phí mới để báo lại. Các cột song song có test workbook giữ số/thứ tự; chưa đề xuất refactor bloat không có chi phí | — |
| pnpm build:web; size-report.mjs --json | Build 8855345 | PASS; 5 chunk JS/CSS, tổng raw 2.364.283 / gzip 697.071 byte, bằng baseline; size.json | — |
| Dependency / nạp thư viện | package.json + report-workbook:158 | ExcelJS chỉ import động khi xuất; chart có chunk riêng; không thêm công cụ/dependency | — |

| Chunk build | Raw byte | Gzip byte (node gzipSync) | So common/baseline.md |
|---|---:|---:|---|
| assets/chart.js | 513302 | 172450 | Δ 0 |
| assets/exceljs.min.js | 929569 | 255572 | Δ 0 |
| assets/index.css | 28364 | 6412 | Δ 0 |
| assets/index.js | 891942 | 262010 | Δ 0 |
| assets/rolldown-runtime.js | 1106 | 627 | Δ 0 |

Không có phát hiện B mới. Không đề xuất refactor không có bằng chứng lợi ích/chi phí. Các ứng viên 22 export có thể thu hẹp phạm vi khi chạm file, không tính thành lỗi độc lập.

## 4b. Hiệu năng

Máy DESKTOP-KDURKJP, Node v24.20.0, Asia/Bangkok. Dữ liệu đúng common/load/load-2026-10-12-seed6.p2cbackup: 16034641 byte; hash tables 1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd. Tổng 1.496 KH, 10.414 lịch, 54 người, 5 team, 1.697 HĐ; query sống trả 1.481 KH, 10.252 lịch, 51 người, 4 team, 1.674 HĐ. Ngày app của probe 14/10/2026; đọc toàn bộ Tables trước vòng đo, mỗi hàm 1 warm-up + 9 lần.

Lúc mẫu cuối (00:24:49) chạy: Vite harness riêng của phiên này đang chờ; UI probe không chạy cùng vòng đo cuối. Không có thông tin đáng tin về tải phiên khác. Một vòng ở 00:23 có nhiễu lớn: listTrash median 285,33 ms, reportRows.month 104,92 ms; lưu nguyên data-busy.log. Vòng đầu listTrash 44,22 ms và vòng cuối 44,36 ms. Không dùng vòng nhiễu để nâng mức hoặc so trực tiếp với latency trên exe.

| Đã đo | Dữ liệu / số lần | Median ms | Min–max ms | ID |
|---|---|---:|---:|---|
| appointmentRows.all | 9 + warm-up | 2.62 | 2.34–4.09 | — |
| monthGrid | 9 + warm-up | 0.61 | 0.57–0.96 | — |
| yearGrid | 9 + warm-up | 0.26 | 0.25–0.32 | — |
| dayBoard | 9 + warm-up | 0.55 | 0.51–0.74 | — |
| reportRows.month | 9 + warm-up | 6.67 | 5.89–7.57 | — |
| kpiTiles.month | 9 + warm-up | 1.80 | 1.63–3.14 | — |
| stageBlock.month | 9 + warm-up | 3.10 | 3.01–3.65 | — |
| teamCompare.month | 9 + warm-up | 1.53 | 1.46–2.94 | — |
| reportRows.year | 9 + warm-up | 7.29 | 6.89–8.51 | — |
| kpiTiles.year | 9 + warm-up | 2.22 | 2.16–2.31 | — |
| stageBlock.year | 9 + warm-up | 3.11 | 2.91–4.38 | — |
| teamCompare.year | 9 + warm-up | 2.32 | 2.26–2.45 | — |
| listTrash | 9 + warm-up | 44.36 | 42.22–49.20 | — |
| filterTrash | 9 + warm-up | 0.10 | 0.07–0.10 | — |

Đây là thời gian **hàm Node**, chưa gồm render/khung hình/IPC; không nhận là thao tác màn <200 ms. Import dữ liệu tải mẫu cuối 818,87 ms (Node, không phải thời gian nhập UI); số đo cả vòng nằm ở data.log; hiệu năng sơ bộ lưu performance-initial.json, mẫu cuối performance.json. listTrash đọc các bảng đầy đủ là KNOWN (#539); số đo cho thấy đắt hơn helper chỉ số, chưa có bằng chứng mới về thao tác màn vượt ngưỡng trong gói E.

Đối chiếu ngưỡng: docs/metrics/phase-6.md quy định màn <200 ms, Excel ≤500 ms, backup đọc ≤2.000 ms/import ≤500 ms/export ≤1.000 ms. common/perf/perf-ref.json là phép đo exe cùng Home PC: Tổng quan lọc Tháng/Năm 14/15 ms, Báo cáo lọc Tháng/Năm 9,5/9 ms, Theo RE 17,1 ms; mở Thùng rác 79,5 ms, lọc lịch 6,4 ms; Excel 24,4 ms. Chỉ dùng làm tham chiếu đã có, không nhận là số đo lại của phiên E. Không đo exe khi chưa biết phiên khác có đang đo; không chạy pnpm e2e cổng 4173/PW_REUSE.

Không có phát hiện P mới từ số đo này. Việc đo đầu-cuối trên exe khi máy rảnh / toàn codebase thuộc gói F.

## 5. Đếm mức × trục

Mỗi phát hiện tính theo trục chính.

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 2 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

CONFIRMED 3/3; PLAUSIBLE 0/3 (0%). Không thêm KNOWN vào bảng vì không có bằng chứng mới đủ để ghi thành phát hiện.

## 6. Đã xét, không thấy (ngoài ba phát hiện trên)

| Trục | Đã kiểm và kết quả |
|---|---|
| E | Các helpers/test ngày 1900–2100, tuần cắt biên, nhuận, giờ rỗng/23:59/sai; các nhóm lịch, lịch cũ/cùng ngày, stage lock D7, giữ/dời/hẹn tiếp. UI focus qua ngày/năm có CX-E1/E3; ngoài hai ca đó đã xét, không thấy lỗi mới |
| C | Golden C01–C11/M01–M04/G/A/S, mockup, semantics nhãn; 414 deep-equality/assertion trong data-probe (4 loại kỳ, all/team/RE, tổng bảng, mốc, stage snapshot, Excel, chuỗi nghiệp vụ). Có CX-E2; ngoài ca đó không thấy số sai mới |
| D | Probe nhập dữ liệu tải → tạo KH N3 → cuộc gặp RF lên N2 + HĐ 24/21 tr → xóa HĐ riêng → xóa KH → khôi phục KH (HĐ còn xóa, RF về) → khôi phục HĐ → XLSX → xuất/nhập backup: summary như ban đầu. Khôi phục riêng có kiểm lại lệnh; E17 test từ chối khi DATA_REPLACING. Đã xét, không thấy mất/hỏng dữ liệu mới |
| G | Chỗ nối E vào KYC/AppointmentAi và các lệnh nghiệp vụ; chỉ đọc/get profile, không cho AI ghi thẳng HĐ/chỉ số. Probe dùng Mock mặc định, không phát yêu cầu AI. Đã xét trong seam E, không thấy guardrail mới bị bỏ qua; validator G5 đầy đủ thuộc C |
| S | SettingsBackup kiểm file lớn trước file.text; dữ liệu thử TR-5 được app.readBackup chấp nhận; ExcelJS test round-trip tên =SUM/HYPERLINK giữ kiểu String; stage-chart escape title/team; React render text. Đã xét, không thấy XSS/formula injection/lộ key mới |
| P | Đo trên bộ tải và đối chiếu common/perf + ngưỡng; có log nhiễu và nêu giới hạn Node. Không suy latency màn từ helper. Đã xét, chưa có phát hiện P đủ bằng chứng |
| B | noUnused/deps/codemap sạch; rg 183 export; build/chunk đúng baseline. Duplicated plain/mốc đã KNOWN, không báo lại. Đã xét, không thấy bloat mới có chi phí đo được |
| T | 15 file liên quan / 262 test PASS (gồm 14 file E và appointment-ai-view.test.ts ngoài E); 2 bản chép bị đột biến tạo 11 test đỏ, bản gốc chép chạy cùng config 32/32 xanh. Các test thuần chưa bắt ba lỗi UI đã tái hiện; đề xuất bổ sung ngay theo CX-E1/E2/E3, không tách thành phát hiện T trùng |
| A | Labels từ i18n, status/alert/viewing live region, native dialog showModal/aria-labelledby/focus, nút team aria-expanded, ngày/tháng aria-label chứa số 4 nhóm, bảng th/row/colgroup, filter/status từ bàn phím. Đã đọc và UI probe thao tác bằng accessible name; không chạy screen reader/đo contrast riêng. Không thấy lỗi A mới; chart thiếu dữ liệu cho screen reader / ngày ngoài kỳ aria-hidden đã KNOWN |

## 7. Phụ lục nguồn probe / test / đột biến

Tất cả nằm trong C:\workspace\deep-review-1-6\codex\E\. Không patch trong repo.

| Nguồn | Chạy / kết quả |
|---|---|
| ui-probe.mjs, harness.tsx, vite.config.mjs, index.html | pnpm --filter @p2c/desktop exec vite --config C:\workspace\deep-review-1-6\codex\E\vite.config.mjs; rồi node …\E\ui-probe.mjs. Cổng 4186. Các component gốc, DB sql.js thực, đồng hồ giả có focus event; ui.log/ui-results.json xác nhận cả 3 lỗi. Harness không nạp stylesheet app, ảnh chỉ là bằng chứng chữ/trạng thái, không dùng để chấm layout |
| trash-after-day.png / policy-draft.png / year-after-day.png | Ảnh chữ/trạng thái của ba probe UI |
| loader.mjs / data-probe.mjs | node …\E\data-probe.mjs. PASS 414 kiểm; XLSX 14978 byte. Đọc 17 ô số từ ExcelJS round-trip và giữ summary qua chuỗi xóa/khôi phục/backup |
| performance.json / performance-initial.json / data.log / data-busy.log | Mẫu đầu/cuối + vòng nhiễu; vòng nhiễu còn dừng ở so JSON key order của probe, số giống nhau. Probe sau sửa dùng isDeepStrictEqual, PASS; không coi lỗi harness là lỗi sản phẩm |
| inventory.json / export-audit.json / bloat-probe.mjs / bloat.log | 51 file / 10.577 dòng E; audit export bằng rg |
| unit.log / unused.log | Unit 262/262 PASS 7,34 s; noUnused exit 0 |
| build.log / size.json | pnpm build:web PASS; các chunk bằng baseline. Chỉ sinh dist/cache bị ignore; không build exe mới |
| mutant-filter / mutant-workbook + vitest.config.mjs | pnpm exec vitest run --config …\E\vitest.config.mjs. M1 sameSelection luôn true: **bị giết** (9/13 test fail); M2 Case size lấy revenue: **bị giết** (2/19 test fail). mutations.log: tổng 11 fail / 21 pass; exit 1 do assertion thật, không lỗi import |
| control-filter / control-workbook | E_CONTROL=1, cùng lệnh/config: **32/32 PASS**, control.log. Hai bản chép nguyên gốc ngoài sửa đường dẫn import; chứng minh harness hợp lệ. Không có đột biến sống trong 2 mẫu đã thử |
| progress-log.md | Giữ bản ghi tiến độ trước khi sắp lại báo cáo cuối; gồm số đo/phát hiện được ghi dần. Một nhãn tiến độ 00:14 được gõ sớm nhầm; giờ thật test là 00:07:53, chỉ các giờ từ log/clock trong báo cáo cuối là mốc dùng |

Không rerun toàn bộ verify/e2e/Rust: dùng cổng đã có common/baseline.md ở đúng SHA. Không dịch vụ/công cụ mới. Git diff --stat cuối phiên rỗng. git status --short cuối phiên (giống đầu):

~~~text
?? .agents/
?? .codex/
?? AGENTS.md
~~~

Server probe cổng 4186 đã dừng (Ctrl+C phiên tiến trình do Codex tạo). Không còn lệnh đang chờ của gói E.

Giờ xong: 2026-10-14 00:31:06 +07:00 (Asia/Bangkok).

