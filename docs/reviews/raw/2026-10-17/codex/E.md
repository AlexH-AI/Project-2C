XONG — codex gói E lượt 2, 2026-10-17 14:43:54 +07:00

# Deep review Phase 1–6, lượt 2 — Codex Gói E

## 1. Thông tin phiên

- Bên: codex; gói E — Lịch hẹn, chỉ số, quản lý. Bắt đầu 2026-10-17 11:29:53 +07:00, Asia/Bangkok, máy DESKTOP-KDURKJP, Node v24.20.0.
- SHA đầu/cuối: 4217ed4cd3300af1d63aa61db9eb13902fe75f16, đúng SHA ghim, detached HEAD.
- Git status đầu phiên (có sẵn, không động tới):

~~~text
?? .agents/
?? .codex/
?? AGENTS.md
~~~

- Công cụ: Codex desktop; PowerShell, Node, Vitest, Playwright + Edge headless, Vite, TypeScript, rg, git, công cụ repo có sẵn. Model: GPT-6 theo ngữ cảnh hệ thống; tên model cụ thể và mức suy luận không được công cụ cung cấp nên không tự khẳng định. Không subagent.
- Bước 0 kiểm đúng từng tên đầy đủ: A–D đều XONG, E chưa có; chỉ đọc dòng đầu A–D. Chưa có phiên E trước. Không đọc báo cáo lượt 2 bên khác hoặc nội dung báo cáo A–D của mình.
- Repo chỉ đọc: không patch, không sửa code/test/spec, không commit/Issue/PR/merge/gh. Mọi script, bản chép và log ở C:/workspace/deep-review-1-6-r2/codex/E/. Bản chép node_modules là junction tới thư viện sẵn có, không cài dependency. Không mở Project-2 hay thư mục reviewer bị cấm.
- Không gọi AI thật, không đọc key, không mở chatgpt.com. Mỗi browser context đều route chặn mọi host ngoài 127.0.0.1 và thay window.open trước lần goto đầu. UI log: không có page error hoặc yêu cầu mạng ngoài trong các ca control.

**Kết quả gói:** 15 dòng R: **14 ĐÃ SỬA, 1 SỬA MỘT PHẦN**. **1 Low CONFIRMED + 1 Nit CONFIRMED**. Phần dữ liệu của hai lỗi Medium lượt 1 thuộc seam E đã hết; phần thiếu của DR6-01 chỉ là dòng hiển thị. Không kết luận phát hành v1.0 ở gói E.

## 2. Bảng R

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 01 | #592 → #614 | SỬA MỘT PHẦN | UI E18/E19 khôi phục được, không thêm transition; E20 chặn đúng; M01 làm 6/27 test trash đỏ. | Lỗi dữ liệu lượt 1 đã hết. Dòng bảng chưa có “Không đổi nhóm KH” theo mục tiêu #592 → CX2-E1; hộp xác nhận đúng. |
| 02 | #594 → #618 | ĐÃ SỬA | UI R02-follow chọn RE hiện tại; R02-R42 tạo lịch RE mới; M02a: 2/17 đỏ, M02b: 1/64 đỏ. | N1–N3: bàn giao hai lần qua sang ngày, chuỗi dời → ghi kết quả → hẹn tiếp và số theo từng RE đúng. |
| 04 | #593 → #616 | ĐÃ SỬA | UI R04-stage/R04-stageEdit lấy N3 của ngày 10/10, khóa nhóm khi KH chuyển N2 ngày 12/10; M04: 1/24 đỏ. | E19 sửa lại ở chính ngày giữ nhóm đúng. Biến thể tài liệu E7 cũ còn mâu thuẫn nguồn G3 → CX2-E2; không khôi phục lại luật cũ. |
| 38 | #600 → #634 | ĐÃ SỬA | UI 6h qua giao thừa giữ 31/12/2026 và từ chối ngày đã qua; 6f lưu Hủy giữ ngày; 8b phát hành đúng 31/12/2026. M38a: 3/20 đỏ, M38b: 3/21 đỏ. | Unit openDraft còn kiểm 8a/8d và người gõ đè ô ngày; không tự đổi năm. |
| 39 | #600 → #634 | ĐÃ SỬA | expectedCaseSize chỉ lấy cuộc gặp mới nhất; M39 khôi phục điều kiện bỏ null → 1/21 đỏ. | N5 chạy trên app.tables sau chuỗi có cuộc gặp mới không ước lượng; không lấy số cũ. Test cùng ngày/giờ và lịch không Đã gặp vẫn xanh. |
| 40 | #600 → #634 | ĐÃ SỬA | UI sửa FYP nộp 24→30 tr, phát hành 21 tr: “khác FYP nộp −9 tr”; M40 so bản đã lưu → 1/21 đỏ. | N4 hai năm, FYP sát 100 tỷ và 1–2 đồng: chênh đúng; dòng ảnh hưởng vẫn so bản đã lưu. |
| 41 | #600 → #634 | ĐÃ SỬA | UI dời tháng nộp/phát hành 09→08: đủ 4 dòng −24/+30/−21/+21 tr; M41 bỏ ảnh hưởng khi đổi tháng → 1/21 đỏ. | N4 dời qua hai năm, số tháng/năm/delta đúng. Số đếm HĐ không hiện trong preview là KNOWN #634, không báo lại. |
| 42 | #600 → #634 | ĐÃ SỬA | UI kèm lịch 01/11 chuyển kỳ/ngày và chọn lịch mới; nguyên test e2e PR sửa xanh ở control; gỡ onShow: test “no-show with a next…” đỏ (M42-e2e.log). | Lịch mới dùng RE hiện tại sau bàn giao; helper revealCreated có test xóa lọc che khuất / ngoài góc nhìn. |
| 43 | #601 → #630 | ĐÃ SỬA | UI cột Bản ghi không có nút sắp, Thao tác có tên ẩn, nút mô tả lý do; HĐ ngày mai tự bật qua nửa đêm. M43: 3/56 đỏ; M43-day làm nguyên e2e TR-5 đỏ. | Không cần ghi phụ để làm mới; control test toHaveAccessibleDescription đúng câu. Không chạy screen reader thực. |
| 44 | #601 → #630 | ĐÃ SỬA | N9 bỏ 3 chỉ mục trên DB tạm: 33,51→398,87 ms, dữ liệu deepEqual; M44 bỏ migration làm test database “adds the lookups…” đỏ (SCAN thay INDEX). | Bộ tải đúng hash lượt 2 + xóa thêm 150 KH, 263 dòng Thùng rác. Đạt <100 ms. So Node cùng máy lượt 1 và ngưỡng trong §6.2. |
| 45 | #601 → #630 | ĐÃ SỬA | UI Nạp lại→Nhập chỉ còn thông báo nhập; nguyên e2e control xanh; M45 bỏ điều kiện showsNotice làm nguyên test PR đỏ do có 2 status. | Thông báo / state lặp là KNOWN #630; không ghi lại bloat. |
| 46 | #597 → #623 | ĐÃ SỬA | UI Năm 2026 · 01/01 – 17/10/2026 · Toàn bộ; 2 nguyên e2e Tổng quan/Báo cáo control xanh; M46 bỏ dấu làm cả 2 đỏ. | Tháng MTD vẫn không thêm dấu trước khoảng ngày; unit viewingText giữ range/MTD, workbook meta giữ kỳ. |
| 47 | #607 → #619 | ĐÃ SỬA | NT-TQ-06 và “Lệch mockup đã biết”: tròn 60%/100%/0%, không tròn 66,7%; workbook numFmt 0.0%. Các test golden ở overview/team-compare/reports/workbook xanh. | Owner chọn giữ golden; đối chiếu docs và app, không áp dụng gỡ code cho mục docs được chấp nhận. |
| 48 | #607 → #619 | ĐÃ SỬA | Danh sách lệch đã có đủ: 6c thiếu lần n; nhãn nhóm lịch; công thức tỉ lệ; meta Theo RE/Theo mốc; Nội dung 5 loại không có KYC; chú giải lịch không có Trong kỳ. Đọc code/vi.ts/mockup/NT. | Các dòng mô tả khớp source UI ở SHA ghim. Đây là ghi lệch theo Owner, không mutation sản phẩm. E7 mới ở CX2-E2 là khác các lệch của DR6-48. |
| 63 | #606 → #644 | ĐÃ SỬA | Áp lại đột biến lượt 1: policy:restoreCustomer → 1/56 đỏ; DOT_ORDER Dự kiến trước → 1/42 đỏ. Control có 979 test xanh. | Các ca oneOfEach kiểm riêng team/person/customer/appointment/policy còn lại trong trash; AV8 ghim thứ tự planned cuối. |

Bằng chứng mutation là assertion thật, không tính lỗi resolve/import là test giết. Các ca docs theo Owner (47/48) kiểm văn bản và hành vi khớp, không gỡ code để “sửa” một lệch đã chấp nhận.

## 3. Phạm vi đã đọc

Luật classifyFile của tools/size-report-core.mjs: **51 file, 37 SP / 7.374 dòng, 14 test / 3.843 dòng**. Đọc sản phẩm từng file, test/fixture/assertion liên quan và kỹ diff sửa; file AI của appointments thuộc C, chỉ đọc chỗ nối khi cần. Inventory vật lý và hash: inventory.json, source-hashes.json.

| File (từ gốc repo) | Dòng đã đọc | Loại |
|---|---|---|
| apps/desktop/src/routes/FilterBar.tsx | 1–84 | SP |
| apps/desktop/src/routes/Overview.tsx | 1–61 | SP |
| apps/desktop/src/routes/RestoreDialog.tsx | 1–65 | SP |
| apps/desktop/src/routes/Settings.tsx | 1–187 | SP |
| apps/desktop/src/routes/SettingsBackup.tsx | 1–294 | SP |
| apps/desktop/src/routes/SettingsDataFile.tsx | 1–135 | SP |
| apps/desktop/src/routes/SettingsTrash.tsx | 1–246 | SP |
| apps/desktop/src/routes/applied-filter.test.ts | 1–109 | test |
| apps/desktop/src/routes/applied-filter.ts | 1–51 | SP |
| apps/desktop/src/routes/appointments/AppointmentDialog.tsx | 1–450 | SP |
| apps/desktop/src/routes/appointments/AppointmentsScreen.tsx | 1–652 | SP |
| apps/desktop/src/routes/appointments/DateSuggestion.test.tsx | 1–24 | test |
| apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx | 1–100 | SP |
| apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx | 1–263 | SP |
| apps/desktop/src/routes/appointments/MetFields.test.ts | 1–36 | test |
| apps/desktop/src/routes/appointments/MetFields.tsx | 1–169 | SP |
| apps/desktop/src/routes/appointments/OutcomeDialog.tsx | 1–340 | SP |
| apps/desktop/src/routes/appointments/RescheduleDialog.tsx | 1–60 | SP |
| apps/desktop/src/routes/appointments/RescheduleFields.tsx | 1–142 | SP |
| apps/desktop/src/routes/appointments/YearGrid.tsx | 1–142 | SP |
| apps/desktop/src/routes/appointments/appointment-form.test.ts | 1–250 | test |
| apps/desktop/src/routes/appointments/appointment-form.ts | 1–142 | SP |
| apps/desktop/src/routes/appointments/appointments-view.test.ts | 1–646 | test |
| apps/desktop/src/routes/appointments/appointments-view.ts | 1–471 | SP |
| apps/desktop/src/routes/appointments/outcome-form.test.ts | 1–265 | test |
| apps/desktop/src/routes/appointments/outcome-form.ts | 1–202 | SP |
| apps/desktop/src/routes/customers/CustomerPolicies.tsx | 1–109 | SP |
| apps/desktop/src/routes/customers/PolicyDialogs.tsx | 1–340 | SP |
| apps/desktop/src/routes/customers/policy-form.test.ts | 1–262 | test |
| apps/desktop/src/routes/customers/policy-form.ts | 1–239 | SP |
| apps/desktop/src/routes/overview/OverviewTiles.tsx | 1–76 | SP |
| apps/desktop/src/routes/overview/StageBlock.tsx | 1–127 | SP |
| apps/desktop/src/routes/overview/TeamCompare.tsx | 1–127 | SP |
| apps/desktop/src/routes/overview/overview-view.test.ts | 1–312 | test |
| apps/desktop/src/routes/overview/overview-view.ts | 1–252 | SP |
| apps/desktop/src/routes/overview/stage-chart.test.ts | 1–150 | test |
| apps/desktop/src/routes/overview/stage-chart.ts | 1–130 | SP |
| apps/desktop/src/routes/overview/stage-view.test.ts | 1–235 | test |
| apps/desktop/src/routes/overview/stage-view.ts | 1–142 | SP |
| apps/desktop/src/routes/overview/team-compare-view.test.ts | 1–128 | test |
| apps/desktop/src/routes/overview/team-compare-view.ts | 1–129 | SP |
| apps/desktop/src/routes/period-labels.ts | 1–26 | SP |
| apps/desktop/src/routes/reports/ReportExport.tsx | 1–96 | SP |
| apps/desktop/src/routes/reports/ReportTable.tsx | 1–154 | SP |
| apps/desktop/src/routes/reports/ReportsScreen.tsx | 1–113 | SP |
| apps/desktop/src/routes/reports/report-workbook.test.ts | 1–336 | test |
| apps/desktop/src/routes/reports/report-workbook.ts | 1–259 | SP |
| apps/desktop/src/routes/reports/reports-view.test.ts | 1–366 | test |
| apps/desktop/src/routes/reports/reports-view.ts | 1–327 | SP |
| apps/desktop/src/routes/trash-view.test.ts | 1–724 | test |
| apps/desktop/src/routes/trash-view.ts | 1–472 | SP |

### Nguồn đối chiếu và phần diff

- common/prompt-codex.md, plan.md (§4 và L2.1–L2.11), known.md (OPEN/ACCEPTED, K1–K21, bảng 67 DR6), fixes.md, baseline.md. Bản đồ CLAUDE.md gốc + apps/desktop/CLAUDE.md, CONTEXT.md.
- Spec Phase 3: D3/D6/D7/D9/D10, lệnh lịch/HĐ, bàn giao, nhập backup; Phase 4: đếm 4 nhóm, snapshot, C01–C11/M01–M04, góc nhìn và Excel; Phase 6 S2-1…S2-6, TR-1…TR-10, E1–E20; ngưỡng docs/metrics/phase-6.md.
- Golden chi-so, lich-hen, kh-theo-nhom; mockup overview 1a–1e/2, reports 2a–2f, appointment-forms 6a–6i, policy-forms 8a–8d, phase-3-feedback B3–B6, settings-data 10a–10d, trash 11a–11g và khối HĐ hồ sơ; đối chiếu mục “Lệch mockup đã biết”, NT-TQ-06/22, NT-LH, NT-HS, NT-BC, NT-TR. Không chấm pixel-perfect hay chạy mockup qua mạng font.
- Tổng hợp lượt 1 §3–§9; các báo cáo E lượt 1 ở docs/reviews/raw/2026-10-15/{codex,claude,muse}/E.md và home-pc/{codex,claude,muse}/E.md: phát hiện, kịch bản và đột biến AV8/restoreRow. Chỉ dùng tài liệu lượt 1 trong repo; script loader/data/UI/bloat cũ đọc ở đúng thư mục probe lượt 1 của Codex trên máy này.
- Diff git 8855345..4217ed4 trong E; trọng tâm #614 23eed54, #616 b563604, #618 5d2443f, #623 bf87d71, #634 ffc1db7, #630 43e6696, #644 83e0515, #619 13f62d6; đọc fixes tương ứng. Kiểm E7 mới với spec và quyết định Owner nằm trong PR #616.
- Seam ngoài E: data/app-data.ts, AppDataContext.tsx, tables.ts/today.ts; shell scope/route; CustomerProfile/CustomerAppointments; DB appointments/customers/trash/counts/database/migration 0009, domain ngày/chỉ số; ui Dialog/Choices/DataTable, i18n/vi.ts. E2E nguyên bản appointment-outcome/backup/trash/overview/reports và helper support/anchor; không review lại toàn gói khác.

## 4. Kịch bản mới đã thử

Các dòng N1–N11 dưới đây là biến thể/chuỗi mới của lượt 2. Ca tái hiện trực tiếp lượt 1 nằm ở bảng R và ui-final.log, không dùng chúng để đủ số kịch bản mới.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Bàn giao RE1→RE2 ngày 17, qua sang 18 rồi RE2→RE1; lịch 16/17/18 chuyển nhóm Dự kiến/Chưa ghi đúng nhãn | PASS: lịch 16 giữ RE1, lịch 17 nay đã qua giữ RE2, lịch 18 hôm nay theo RE1 | — |
| N2 | Lịch cũ → dời qua ngày bàn giao → bàn giao lại → ghi RF → tạo lịch kế tiếp | PASS: mắt xích cũ vẫn RE cũ, lịch đã bàn giao và lịch tiếp theo dùng RE hiện tại; không sửa lịch sử chuỗi | — |
| N3 | RF và HĐ thuộc hai RE khác nhau → xóa cuộc gặp → bàn giao → khôi phục → xem chỉ số mỗi RE | PASS: RF về đúng RE ghi cuộc gặp, doanh số 1 đồng về RE ghi HĐ, nhóm KH theo RE hiện tại | — |
| N4 | HĐ nộp 100 tỷ, phát hành 1 đồng → sửa cả ngày/tiền qua hai năm | PASS: 4 ảnh hưởng tháng/năm, chênh −99.999.999.997 đồng, số năm 2025 đúng | — |
| N5 | Chuỗi dời/bàn giao/RF → cuộc gặp giữ nhóm mới nhất không ước lượng → xóa riêng cuộc đó | PASS qua app.tables: null không bị ước lượng cũ đứng thay | — |
| N6 | Theo mốc qua 31/12, tháng nhuận 2028, tuần cắt cuối miền 2100, ngày đầu 1900 và custom chưa hết | PASS 5 kỳ: tổng lịch/mốc và tổng kết quả khớp summary; kỳ chưa tới giữ null kết quả | — |
| N7 | Sau bàn giao kép, xóa/khôi phục và sửa HĐ, đối chiếu KPI RF ↔ reportRows ↔ số ô Excel cho từng RE | PASS 2 RE, ô RF/doanh số thật khớp; tỷ lệ/tiền là số Excel, không công thức do người dùng nhập | — |
| N8 | Chuỗi trên → exportBackup → app.readBackup → app.importBackup → dựng lại toàn bộ báo cáo | PASS deepEqual report trước/sau, snapshot 4.770 byte | — |
| N9 | Dữ liệu tải lượt 2 + xóa thêm 150 KH, so listTrash có/bỏ cả 3 chỉ mục | PASS deepEqual 263 dòng, 33,51 ms có chỉ mục / 398,87 ms bỏ; đúng hash tải | — |
| N10 | Cuộc gặp giữ N3 → xóa → KH lên N2 sau ngày gặp → xét cả dòng Thùng rác lẫn hộp | Dữ liệu/hộp đúng; dòng chỉ “10/10/2026 · Đã gặp”, thiếu kết quả/không đổi nhóm | CX2-E1 |
| N11 | Cuộc gặp 02/10 N3→N2 → xóa → chuyển tay tới N2 ngày 10/10; so ví dụ mockup E7 với spec mới và app | App chặn đúng TRANSITION_BEFORE_LATEST; ví dụ G3 cũ lại nói giữ N2/khôi phục được | CX2-E2 |

Nguồn: edge-probe.mjs + edge-final.log/edge-results.json (N1–N9), ui-probe.mjs với UI_ONLY=N10 + N10.log/CX2-E1.png (N10), contract-probe.mjs + N11.log/N11.json (N11). Mọi kết luận nghiệp vụ đi qua openAppData/run/tables; SQL thô chỉ dùng bỏ chỉ mục trong DB tạm của phép đo N9, không dùng để kết luận màn.

## 5. Phát hiện mới

### CX2-E1 — Dòng Thùng rác của cuộc gặp giữ nhóm chưa nói hệ quả theo Issue

ID: CX2-E1  
Mức: Low  
Trục: R (hợp đồng hiển thị C)  
Vị trí: apps/desktop/src/routes/trash-view.ts:132; packages/db/src/trash.ts:151 (4217ed4)  
Tình trạng: CONFIRMED  
Liên quan: DR6-01 · mới do đợt sửa PR #614  
Kịch bản: N10

**Mô tả:** Issue #592 mục tiêu 1 yêu cầu cả hộp TR-8 và dòng Thùng rác nói “Không đổi nhóm KH” cho cuộc gặp giữ nhóm. Sau #614, listTrash trả effect none đúng cho trường hợp đó; appointmentDetail bỏ qua mọi effect khác stageChange/stageKept, nên dòng chỉ còn ngày và “Đã gặp”, mất nhóm đã ghi lẫn câu hệ quả. Hộp xác nhận hiện đúng.

**Tái hiện / bằng chứng:** chạy `$env:UI_ONLY='N10'; node C:/workspace/deep-review-1-6-r2/codex/E/ui-probe.mjs` (server config E/vite.config.mjs cổng 4196). Dựng qua openAppData: lịch 10/10 giữ N3 → xóa → chuyển tay 12/10 lên N2 → TrashSection. N10.log trích:

~~~text
N10-row-text "Loại ↕\tBản ghi\tThuộc ↕\tXóa lúc ↓\tThao tác\nLịch hẹn\t10/10/2026 · Đã gặp\tKH Probe KH · RE RE Một\t17/10/2026 23:59\tKhôi phục…"
N10-kept-row "PASS"
~~~

CX2-E1.png xác nhận chữ thực tế; ảnh harness không có stylesheet app, chỉ dùng làm bằng chứng nội dung, không kết luận bố cục. ui-final.log E18/E19: modal có “Kết quả: Đã gặp · nhóm sau N3” và “Không đổi nhóm KH”; khôi phục không thêm transition, KH vẫn N2. M01 gỡ phần sửa dữ liệu làm 6 test đỏ, chứng minh lỗi dữ liệu cũ đã hết. #614 đổi effect của cuộc gặp giữ nhóm sang none nhưng không thêm nhánh trình bày cho dòng bảng; Issue yêu cầu nhánh đó, không có trong known.md hay danh sách lệch đã chấp nhận.

**Ảnh hưởng:** người quản lý nhìn dòng lịch giữ nhóm không thấy kết quả/hệ quả, phải mở hộp mới biết. Chỉ thiếu thông tin hiển thị; không hồi quy dữ liệu, không gán mức Medium của DR6-01 cũ cho lỗi này.

**Đề xuất:** ở dòng MET + effect none, hiện nhóm đã ghi row.stageAfter và câu “Không đổi nhóm KH”, không đổi restoreStageMove/luật khôi phục. Khoảng 10–25 dòng SP (≤400), thêm ca recordDetail/UI E18/E19; giữ các ca restore hiện có.

### CX2-E2 — Ví dụ E7 trong nguồn G3 cũ trái spec đã thu hẹp

ID: CX2-E2  
Mức: Nit  
Trục: C  
Vị trí: docs/design/mockups/trash.html:249; docs/design/phase-6-hoan-thien.md:126 (4217ed4)  
Tình trạng: CONFIRMED  
Liên quan: DR6-04 · mới do đợt sửa PR #616 thu hẹp E7 theo Owner 15/10  
Kịch bản: N11

**Mô tả:** mockup 11c mô tả cuộc gặp 02/10, rồi “E7 — KH đã ở N2 do chuyển tay ngày 10/10/2026” và hộp “Nhóm KH giữ N2”. Spec E7 mới nêu rõ chuyển tay 10/10 trong chính tình huống đó phải chặn như E6; NT-TR-09 đã đổi sang ngày chuyển tay bằng ngày gặp, còn mục “Lệch mockup đã biết” chưa nêu ví dụ E7 cũ.

**Tái hiện / bằng chứng:** `node C:/workspace/deep-review-1-6-r2/codex/E/contract-probe.mjs` kiểm trực tiếp hai chuỗi ở tài liệu, rồi tạo chuỗi bằng openAppData/run. N11.json/N11.log:

~~~text
appointmentDate = 02/10/2026
manualDate = 10/10/2026
blocked.code = TRANSITION_BEFORE_LATEST
message = Nhóm KH đã đổi ngày 10/10/2026, sau ngày cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10).
~~~

restoreRow trả cùng câu của listTrash; code đúng quyết định Owner. Đây là mâu thuẫn nguồn tham chiếu nảy sinh sau thay đổi luật, không đề xuất mở lại hành vi E7 cũ và không báo lại lỗi dữ liệu lượt 1.

**Ảnh hưởng:** người nghiệm thu đối chiếu nguồn G3 với spec/app nhận hai kết quả trái nhau cho cùng chuỗi thao tác. Chỉ tài liệu tham chiếu nên Nit.

**Đề xuất:** ghi rõ ví dụ G3 ngày 11/10 đã được quyết định Owner 15/10 thu hẹp, tại “Lệch mockup đã biết” và tham chiếu E7 mới. Không đổi luật app, không tự viết lại nguồn G3 đã duyệt để chiều code. 0 dòng SP, khoảng 2–5 dòng tài liệu.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Dữ liệu | Kết quả / số | ID |
|---|---|---|---|
| TypeScript --noUnusedLocals --noUnusedParameters --noEmit | apps/desktop/tsconfig.json và dependency TS | Exit 0, 0 diagnostic; unused.log | — |
| bloat-probe.mjs + rg từng export | 37 file SP của E và nơi tham chiếu apps/packages/e2e/tools | 194 khai báo export, 25 không tham chiếu ngoài file = 24 type/interface + markName dùng nội bộ | — |
| codemap:check | Route/export ở SHA ghim | Export maps are up to date; không chạy chế độ ghi | — |
| lint:deps | 315 module / 1.277 dependency | 0 vi phạm, deps.log | — |
| Rà lặp / API / dependency | 17 cột report khai view/table/workbook, CARD/ALERT/LINK, plain, state notice, package.json | DR6-66/67 và ghi chú #630 đã KNOWN/hoãn; không có chi phí mới để báo lại | — |
| Bundle chuẩn common/baseline.md | Build ở SHA ghim, không tự build lại | JS/CSS 2.382.036 byte raw / 702.109 gzip; so lượt 1 +17.753 / +5.038 byte; ExcelJS và chart chunk không tăng | — |
| Kích thước E | tools classifyFile + git tracked | SP 7.374 (+342), test 3.843 (+298), 51 file; không thêm file SP của E | — |

markName là KNOWN DR6-66, không ghi thành phát hiện mới. ExcelJS vẫn import động khi xuất; chart chunk riêng. Không cài knip/jscpd hay dependency mới, không đề xuất refactor không có chi phí đo được. Không build:web với biến môi trường riêng; server test snapshot có define VITE_DEMO_ANCHOR=15/09/2026 để chạy đúng fixture e2e, không dùng artifact đó làm số bundle.

### 6.2 Hiệu năng

Máy DESKTOP-KDURKJP, cùng máy với cột Home PC lượt 1. Bộ tải **lượt 2**, 16.034.517 byte, tables sha256 **1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591**. Import qua importBackup; mẫu Node cơ sở: 1.481 KH sống, 10.255 lịch, 1.674 HĐ, 51 người, 4 team, 4.884 transition. Ngày probe 17/10/2026; Node lượt 1 ngày 14/10 và file trước sửa nên số sống có thay đổi nhỏ (ràng buộc mới/seed), không phải phép so đầu-cuối tuyệt đối. Mỗi hàm 1 warm-up +9 mẫu, đọc sẵn Tables trước vòng; N9 2 warm-up +9 mẫu.

| Hàm Node, dữ liệu tải | Trung vị lượt 2 ms | Min–max ms | Lượt 1 cùng máy ms | Δ ms | ID |
|---|---:|---:|---:|---:|---|
| appointmentRows.all | 4,00 | 2,84–7,65 | 2,62 | +1,38 | — |
| monthGrid | 0,70 | 0,62–1,24 | 0,61 | +0,09 | — |
| yearGrid | 0,29 | 0,28–1,04 | 0,26 | +0,03 | — |
| dayBoard | 0,58 | 0,55–0,94 | 0,55 | +0,03 | — |
| reportRows.month | 9,66 | 7,46–11,09 | 6,67 | +2,99 | — |
| kpiTiles.month | 2,15 | 1,70–3,37 | 1,80 | +0,35 | — |
| stageBlock.month | 3,62 | 3,36–4,15 | 3,10 | +0,52 | — |
| teamCompare.month | 1,58 | 1,48–2,83 | 1,53 | +0,05 | — |
| reportRows.year | 8,77 | 7,45–12,53 | 7,29 | +1,48 | — |
| kpiTiles.year | 2,47 | 2,32–3,27 | 2,22 | +0,25 | — |
| stageBlock.year | 3,35 | 3,13–6,36 | 3,11 | +0,24 | — |
| teamCompare.year | 2,63 | 2,40–3,03 | 2,32 | +0,31 | — |
| listTrash | 22,59 | 20,78–29,75 | 44,36 | −21,77 | — |
| filterTrash | 0,10 | 0,07–0,12 | 0,10 | −0,00 | — |

| Phép đo bổ sung | Dữ liệu | Kết quả | So sánh / ngưỡng | ID |
|---|---|---|---|---|
| listTrash sau xóa thêm 150 KH | 165 KH đã xóa, 113→263 dòng | Có 3 index median 33,51 ms (32,74–35,48); bỏ 3 index 398,87 ms (393,22–422,75) | nhanh 11,90 lần; deepEqual dữ liệu; <100 ms của #601 | — |
| importBackup Node | File tải lượt 2, một lượt thiết lập | 922,52 ms | Số hàm Node; không so với ngưỡng import UI 500 ms | — |
| XLSX + invariant | Bộ tải all/team/RE, Ngày/Tuần/Tháng/Năm | 414 kiểm xanh, workbook 14.940 byte round-trip | Ô số thật khớp, không suy latency xuất | — |
| Exe chuẩn common, không đo lại ở E | Bộ tải, baseline/perf-ref cùng Home PC | Tổng quan lọc 15 ms; Báo cáo 9–10 ms; Theo RE 18 ms; Thùng rác 73 ms/lọc 6 ms; Excel 27 ms | Màn <200 ms, Excel ≤500 ms đều đạt; không nhận là số tự đo của E | — |
| Các cờ common đã có | app.open-data 301 ms; reload.overview 355, appointments 349, reports 328, settings 247 ms | Chậm hơn lượt 1 trên cùng máy theo common, nhưng vẫn trong ngưỡng 600/500 ms | Gói B/F xét nguyên nhân; không nhân đôi thành phát hiện E khi chưa đo lại end-to-end | — |

Thời điểm Node đo không chạy browser/test khác của phiên này đồng thời; Vite của phiên chưa chạy ở mẫu cơ sở, đang idle ở N9. Không có thông tin tin cậy về tải của các phiên khác; không khẳng định máy rảnh. Luật nhiễu: chỉ xấu khi **vừa >20% vừa >10 ms**; mọi tăng của helper E <10 ms. listTrash cơ sở 22,59 ms so 44,36 ms của Codex E Home PC lượt 1 (giảm 49,1%); ablation N9 chứng minh phần index nhanh hơn mà dữ liệu không đổi. Không so số laptop 32,5 ms của PR như cùng máy. Không có phát hiện P mới từ bằng chứng này. Không chạy exe/9222 khi chưa biết lịch đo bên khác; dùng baseline đã cung cấp.

## 7. Đếm mức × trục

Mỗi phát hiện tính một trục chính; CX2-E1 có nội dung C nhưng đếm R vì là phần sửa còn thiếu.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical |0|0|0|0|0|0|0|0|0|0|0|
| High |0|0|0|0|0|0|0|0|0|0|0|
| Medium |0|0|0|0|0|0|0|0|0|0|0|
| Low |1|0|0|0|0|0|0|0|0|0|1|
| Nit |0|0|1|0|0|0|0|0|0|0|1|

CONFIRMED 2/2; PLAUSIBLE 0/2 (0%); KNOWN không đếm lại vì không có bằng chứng mới đủ để tách. Bảng R 15/15 đã có bằng chứng; 1 sửa một phần không phải lỗi dữ liệu cũ còn tồn tại.

## 8. Đã xét, không thấy (ngoài hai phát hiện)

| Trục | Đã chạy / đọc, giới hạn và kết quả |
|---|---|
| R | Tái hiện các đường lỗi cũ qua UI/AppData,17 đột biến độc lập, nguyên test e2e PR sửa. 14 đã sửa,1 phần thiếu hiển thị (CX2-E1); không có CHƯA SỬA/HỒI QUY dữ liệu trong mẫu E |
| E | Biên giao thừa 6f/6h/8b và unit 8a/8d, bàn giao 2 ngày, chuỗi dời/hẹn tiếp, custom/nhuận/miền 1900–2100, FYP 1–100 tỷ. N1–N8 và các ca R xanh; ngoài thiếu dòng bảng, không thấy lỗi edge mới |
| C | Spec/golden/mockup/nhãn thường,414 đối chiếu và Excel, metadata/MTD, nhóm ngày gặp. CX2-E2 là mâu thuẫn nguồn E7; NT-TQ-06 và các lệch #619 đã đúng quyết định |
| D | N1–N8 qua run/tables/readBackup/importBackup; lịch/HĐ giữ RE ghi trên bản ghi, KH theo RE hiện tại; khôi phục không tự thêm RF; report trước/sau backup deepEqual. Không thấy mất/sai dữ liệu mới |
| G | Seam E→AppointmentAi/KYC chỉ đọc profile, không cho AI ghi thẳng HĐ/chỉ số; dùng Mock, không gọi dịch vụ. Toàn validator G5 thuộc C, không tự nhận đã kiểm toàn bộ ở E |
| S | SettingsBackup giới hạn file trước text; preview/read/import theo AppData; React text, tooltip encodeHtml, ExcelJS test string =SUM/=HYPERLINK/+84/@ không thành công thức; reportFileName lọc tên. Không có đường key/mạng mới trong E; không đọc Credential Manager |
| P | Bảng 6.2 và ablation 263 dòng; mọi phát biểu số có log thật. Không quy thời gian Node thành render/IPC; cờ reload/open của common được nêu giới hạn và dành B/F phân tích |
| B | noUnused/deps/codemap sạch,194 export/25 ứng viên, bundle chuẩn; DR6-66/67/notice state KNOWN. Không thấy bloat mới có chi phí chứng minh |
| T | Control 44 file/979 test xanh;17 đột biến đều bị assertion giết, riêng 4 UI xác nhận lại bằng nguyên e2e PR sửa (5 test đỏ cộng lại). Bổ sung test còn thiếu của CX2-E1 được gắn cùng phát hiện, không tách lỗi T trùng |
| A | Nút restore tên theo bản ghi + describedby, header Thao tác ẩn, sorting Bản ghi tắt, live status, Dialog/Choices, date/month aria label và i18n. UI tìm theo accessible name; chưa chạy screen reader hoặc đo contrast riêng; chart không có bảng sr-only và ô ngoài kỳ aria-hidden là KNOWN |

## 9. Phụ lục nguồn probe / test / đột biến

Tất cả đường dẫn bên dưới tính từ **C:/workspace/deep-review-1-6-r2/codex/E/**; source gốc từ repo ở SHA ghim. Không có patch trong repo. Script đọc module thật; nguồn tạm được giữ đầy đủ, không chỉ log kết quả.

| Nguồn | Cách chạy / kết quả |
|---|---|
| init.mjs / snapshot/ | Node tạo bản chép tracked app/packages; snapshot vitest config alias tới bản chép, junction tới dependency có sẵn. Không copy .git, không cài gì |
| loader.mjs / data-probe.mjs / data.log / performance.json | node C:/workspace/deep-review-1-6-r2/codex/E/data-probe.mjs, PASS 414. Loader hỗ trợ TS/TSX, @p2c và ?raw; không gọi AI thật |
| edge-probe.mjs / edge-final.log / edge-results.json | node C:/workspace/deep-review-1-6-r2/codex/E/edge-probe.mjs,9 kịch bản N1–N9 PASS; N9 drop index chỉ trong DB tạm. edge.log giữ lỗi truy vấn nhầm autoindex của probe; đã sửa truy vấn đúng 3 index rồi chạy lại, không phải lỗi sản phẩm |
| harness.tsx / vite.config.mjs / index.html | pnpm --filter @p2c/desktop exec vite --config C:/workspace/deep-review-1-6-r2/codex/E/vite.config.mjs; cổng 4196; openAppData thật + clock giả; không nạp CSS app, chỉ kiểm nội dung/trạng thái |
| ui-probe.mjs / ui-final.log / ui-snapshot-control.log | node C:/workspace/deep-review-1-6-r2/codex/E/ui-probe.mjs; UI_ONLY lọc tên ca. Ban đầu trên source gốc, sau đó trên snapshot byte-identical. ui.log giữ 2 lỗi nhãn selector của harness (“Không gặp được”/“Nạp lại dữ liệu”), sửa sang nhãn thật “Không đến”/“Nạp lại” thì ca xanh. Không tính lỗi harness là sản phẩm |
| N10.log / CX2-E1.png | UI_ONLY=N10, dòng giữ nhóm thiếu thông tin. Ảnh đã xem lại, không chấm layout từ ảnh không CSS |
| contract-probe.mjs / N11.log / N11.json | Node qua openAppData + restoreRow; xác nhận xung đột nguồn E7 và app theo spec mới |
| control.log / control-threads.log / control-single.log | Vitest snapshot: 44 file / 979 test PASS 73,42s (fork) và 71,82s (threads). Lượt đơn 20/20 PASS. Ghi chú tiến độ lúc đầu tưởng còn chờ được đính chính; không phải test timeout |
| mutations.mjs / mutations.json / mutations.log / M*.log |12 mutation TS, mỗi lượt 1 file ngoài repo, finally trả nguyên source. Chi tiết from/to/test trong JSON/script |
| ui-mutations.mjs / ui-mutations.json |4 mutation UI + 1 migration. M42 bộ phân loại regex đầu tiên bỏ sót chữ “falsy”, đọc log thấy assert ngày mới đỏ; đã ghi classificationNote, nguyên e2e sau cũng đỏ |
| e2e-server.mjs / e2e.config.mjs / snapshot/e2e/safe.ts | App đầy đủ dev 4197, seed snapshot 15/09/2026, define VITE_DEMO_ANCHOR tương ứng. Copy nguyên 5 spec, chỉ thêm import safe trước mọi beforeEach: chặn mạng ngoài 127.0.0.1 và window.open từ lần chạy đầu. Không dùng 4173/PW_REUSE, không build bundle chuẩn |
| e2e-control.log / e2e-mutations.mjs / e2e-mutations.json / M*-e2e.log |5/5 test control xanh 14,6s. Gỡ 4 phần sửa: 1+1+1+2 test đỏ. Giữ logic test/assertion của PR, không đổi expected cho mutation |
| inventory.json / inventory-bloat.json / export-audit.json / bloat.log |51 file;194 export được rg nơi dùng;24 type/interface + markName không external consumer |
| unused.log / codemap.log / deps.log | TypeScript exit 0, bản đồ khớp,0 vi phạm315 module/1277 dependency |
| source-hashes.json / restoration-final.json / report-check.json / final-git-status.txt | SHA256 khớp 51/51 file Gói E; kiểm mở rộng 54/54 file gồm mọi file từng bị đột biến trên snapshot cũng khớp repo sau finally. Diff repo rỗng, HEAD/status giữ nguyên |
| progress-log.md | Bản ghi dần trước khi sắp lại báo cáo; có đính chính kết quả control và nhãn selector. Không dùng các ghi chú đang chờ làm kết luận cuối |

### Đột biến và test giết

| Đột biến trên snapshot | Gỡ / đổi gì | Kết quả thật |
|---|---|---|
| M01 (DR6-01) | Khôi phục theo nhóm hiện tại, bỏ phân biệt lần xóa rút transition | Bị giết; 6 failed / 21 passed (27); M01.log |
| M02a (DR6-02) | Bỏ chuyển lịch Dự kiến khi bàn giao | Bị giết; 2 failed / 15 passed (17); M02a.log |
| M02b (DR6-02) | Hẹn tiếp dùng RE lịch cũ | Bị giết; 1 failed / 63 passed (64); M02b.log |
| M04 (DR6-04) | Nhóm ngày gặp lấy tận cuối miền | Bị giết; 1 failed / 23 passed (24); M04.log |
| M38a (DR6-38) | Ngày lịch bỏ mốc điền sẵn | Bị giết; 3 failed / 17 passed (20); M38a.log |
| M38b (DR6-38) | Ngày HĐ bỏ mốc mở hộp | Bị giết; 3 failed / 18 passed (21); M38b.log |
| M39 (DR6-39) | Bỏ qua cuộc gặp mới nhất không có ước lượng | Bị giết; 1 failed / 20 passed (21); M39.log |
| M40 (DR6-40) | Chênh FYP so số nộp cũ | Bị giết; 1 failed / 20 passed (21); M40.log |
| M41 (DR6-41) | Không có ảnh hưởng khi khác tháng | Bị giết; 1 failed / 20 passed (21); M41.log |
| M43 (DR6-43) | Nút khôi phục cùng tên | Bị giết; 3 failed / 53 passed (56); M43.log |
| M63-policy (DR6-63) | Khôi phục HĐ gọi restoreCustomer | Bị giết; 1 failed / 55 passed (56); M63-policy.log |
| M63-AV8 (DR6-63) | Dự kiến đứng đầu DOT_ORDER | Bị giết; 1 failed / 41 passed (42); M63-AV8.log |
| M44 | Bỏ 3 CREATE INDEX của migration 0009 | Bị giết: 1/31 test database đỏ, 30 xanh; M44.log |
| M42 (UI) | Bỏ onShow lịch hẹn tiếp | Nguyên test e2e PR sửa bị giết: 1 failed; M42-e2e.log |
| M43-day (UI) | useQuery(listTrash), không theo ngày | Nguyên test e2e PR sửa bị giết: 1 failed; M43-day-e2e.log |
| M45 (UI) | Giữ thông báo Demo luôn hiện | Nguyên test e2e PR sửa bị giết: 1 failed; M45-e2e.log |
| M46 (UI) | Bỏ dấu · trước khoảng ngày của Năm | Nguyên test e2e PR sửa bị giết: 2 failed; M46-e2e.log |

Tổng **17 đột biến độc lập: 17 bị giết, 0 sống**; không tính lần xác nhận lại cùng mutation bằng nguyên e2e như mutation mới. UI probe có 5 lần gỡ (M42/M43-day/M45/M46 và migration M44), 4 UI được xác nhận lại bằng nguyên test PR. “Bị giết” không bao gồm lỗi bootstrap/import. Với mục 47/48 Owner chọn docs, không có mutation code.

### Trạng thái cuối và giới hạn

- Hai server 4196/4197 đều đã đóng, kiểm TCP open=false; không còn browser của probe. Harness 4196 có watcher EBUSY trên file tải tạm .crdownload khi bắt đầu chạy e2e app sau đó; xảy ra sau toàn bộ kết quả harness UI, không ảnh hưởng test app 4197. Không coi watcher tạm là lỗi sản phẩm.
- Toàn verify/e2e/Rust/bundle/exe dùng cổng sẵn có ở common/baseline.md đúng SHA; phiên E chạy kiểm thích hợp nêu trên. Không tuyên bố full suite mới hoặc exe mới.
- git diff --stat cuối rỗng; git status --short cuối giống đầu:

~~~text
?? .agents/
?? .codex/
?? AGENTS.md
~~~

SHA cuối: 4217ed4cd3300af1d63aa61db9eb13902fe75f16. Giờ hoàn tất: 2026-10-17 14:43:54 +07:00. Chỉ gói E; gói F mở phiên mới.
