XONG — codex gói E lượt 3, 2026-10-20 19:46:38 +07:00

# Deep review Phase 1–6, lượt 3 — Codex gói E

## 1. Thông tin phiên

- Bên: codex; gói E — Lịch hẹn, chỉ số, quản lý; phiên mới, Bước 0 đủ A–D XONG, E chưa có. Chỉ đọc dòng đầu A–D, không đọc nội dung báo cáo lượt 3 khác.
- SHA đầu phiên: `119e2e45cbce54d8a3943757bd826a7f1e9b694f` (đúng SHA ghim, detached HEAD).
- Trạng thái đầu: `?? .agents/`, `?? .codex/`, `?? AGENTS.md` (đã có sẵn).
- Bắt đầu: **20/10/2026 19:21:43 +07:00**, Asia/Bangkok. Máy Home PC **DESKTOP-KDURKJP**, Node v24.20.0.
- Công cụ: Codex desktop, PowerShell, Node, git/rg, TypeScript, Vitest, Playwright + Microsoft Edge headless, Vite có sẵn. Model: GPT-6 theo ngữ cảnh hệ thống; biến thể model và mức suy luận không có công cụ xác nhận, không tự gán.
- Chỉ đọc repo, không commit/gh/Issue/PR/merge, không sửa code sản phẩm, không subagent. Bản chép/probe/log ở `C:/workspace/deep-review-1-6-r3/codex/E/`; dùng junction dependency hiện có, không install. Mọi đột biến trên bản chép; nguồn gốc không bị patch.
- Mọi browser context chặn host ngoài 127.0.0.1 và thay window.open từ trước lần goto đầu. Không gọi AI thật, không đọc key, không mở chatgpt.com. Kết quả UI cuối: blocked=[], errors=[].

**Kết quả gói:** 10/10 dòng R **ĐÃ SỬA**; **1 Nit CONFIRMED**, trục A. 303 unit của đúng 14 file E xanh; 31 e2e của ba spec liên quan xanh; **21/21 đột biến bị assertion bắt**. 343 tổ hợp kỳ/góc nhìn giữ nguyên qua dọn và xuất/nhập backup.

## 2. Bảng R

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 68 | #652 → #666 | ĐÃ SỬA | UI R68: 6c ngày 10/10, KH tạo 15/10, Lưu giữ N3, không thêm chuyển nhóm. M68 bỏ nhóm đầu dự phòng → 1/34 unit đỏ. | N7: vẫn đếm 1 cuộc gặp, RF 0 và KH cuối kỳ trước ngày tạo = 0; không đưa fallback vào snapshot. |
| 70 | #653 → #667 | ĐÃ SỬA | Nguyên e2e DR6-70 xanh; gỡ khung Khi lưu (M70-ui) → 1 e2e đỏ. M70 bỏ undoneMove → 2/34 unit đỏ. | UI R70: N2→N1 (không RF), dời về trước chuyển tay N3→N2: khung nói về N2 và RF không đổi; lưu đúng. Ca rút RF gốc có ở nguyên e2e. |
| 83 | #655 → #693 | ĐÃ SỬA | Nguyên e2e bàn phím 6c/6h/6g/6f, HĐ, khôi phục đều xanh. Gỡ fallback M83-appointments/policy/trash → 2/1/1 e2e đỏ. | N3/N9: thông báo dọn nhận focus cả khi nút biến mất hoặc còn nhưng tắt; N4 lỗi backup trả về nút mở. Ghi chú sticky che focus đã KNOWN, không báo lại. |
| 84 | #662 → #707/#709/#710 | ĐÃ SỬA | N1–N6/N9: UI dọn tất cả, giữ phụ thuộc, khóa hộp, backup/lỗi; 343 tổ hợp chỉ số và Excel không đổi. Bỏ xác nhận (M84-confirm) → e2e đỏ; P-count/P-kept/P-confirm đều unit đỏ. | Owner chọn dọn tay (K27), không yêu cầu bỏ độ dốc listTrash. 113→0 và 1.313→0; listTrash 26,36/141,75 ms. Dọn 97,23/106,23 ms; số Node so baseline không xấu hơn theo luật nhiễu. |
| 91 | #653 → #667 | ĐÃ SỬA | N1/N2/R04g (tên đột biến cũ): mỗi cái 1/34 unit đỏ. R38c/R38d/R38e, R43e: mỗi cái làm nguyên e2e PR sửa đỏ. Control 31/31. | Đã kiểm cả helper và phần nối TSX. E2E qua 31/12→01/01; không dùng lỗi build/import làm bằng chứng giết đột biến. |
| 93 | #653 → #667 | ĐÃ SỬA | UI R93/E18: dòng nhóm sau N3 · không đổi nhóm KH, hộp Không đổi nhóm KH; khôi phục không thêm transition. M93 gỡ nhánh → 1/68 unit đỏ. | E18 sau chuyển tay ngày sau giữ KH N2; nguyên e2e E18 cũng xanh. |
| 94 | #653 → #667 | ĐÃ SỬA | UI R94/E20: lịch 18/10, chuyển tay cùng ngày ghi sau xóa, câu ghi sau lúc xóa cuộc hẹn này, nút tắt. M94 gỡ nhánh → 2/68 unit đỏ. | Nhánh ngày sau vẫn câu sau ngày cuộc hẹn này; unit kiểm cả hai, gồm case AppData thật. |
| 95 | #653 → #667 | ĐÃ SỬA | trash.html:268 đã dùng chuyển tay 02/10/2026 cùng ngày, ghi sau xóa; không còn ví dụ 10/10 cũ. Khớp E7 spec :151, nghiệm thu NT-TR-09 và restoreView E7 (unit xanh). | Sửa tài liệu: kiểm nội dung/hành vi; không tạo đột biến sản phẩm cho dòng tài liệu. E6 ngày sau vẫn chặn, E20 cùng ngày khác nhóm chặn như R94. |
| 99 | #653 → #667 | ĐÃ SỬA | restoreLabel có FYP; test hai HĐ cùng KH/cùng ngày, FYP 24tr và 100tr xanh. M99 gỡ FYP → 2/68 unit đỏ. | Phạm vi sửa là nút khôi phục. Biến thể mới ở nút Phát hành/Sửa HĐ còn sống ghi riêng CX3-E1; không đổi kết luận R99. |
| 103 | #653 → #667 | ĐÃ SỬA | rg xác nhận customers.ts:395, seed.ts:413, outcome-form.ts:80 cùng gọi meetingKeepingMove (định nghĩa :411). Nguyên test seed đối chiếu khóa màn/lệnh xanh; M103 bỏ lời gọi ở màn → 2/34 unit đỏ. | Hành vi D7 giữ nguyên: 3 loại (TRANSITION_NOT_LATEST, STAGE_KEPT_BY_MEETING, xóa được); biến thể N1/N2/R04g đều bị test bắt. |

Các DR6 được chỉ định kiểm không lặp thành phát hiện. CX3-E1 là biến thể ở thẻ HĐ còn sống, ngoài phạm vi nút khôi phục của Issue #653. N1/N2/R04g trong bảng là **tên đột biến lượt 2**, phân biệt với số kịch bản mới bên dưới.

## 3. Phạm vi đã đọc

Theo classifyFile: **51 file, 37 file sản phẩm / 7.756 dòng, 14 file test / 4.146 dòng**. Đọc toàn bộ source gói E, fixture/assertion của test; đọc kỹ các phần sửa và phần nối. Inventory/hash: manifest.json, inventory-bloat.json. Dòng dưới tính theo SHA ghim.

| File từ gốc repo | Dòng đã đọc |
|---|---|
| apps/desktop/src/routes/FilterBar.tsx | 1–84 |
| apps/desktop/src/routes/Overview.tsx | 1–61 |
| apps/desktop/src/routes/RestoreDialog.tsx | 1–65 |
| apps/desktop/src/routes/Settings.tsx | 1–187 |
| apps/desktop/src/routes/SettingsBackup.tsx | 1–294 |
| apps/desktop/src/routes/SettingsDataFile.tsx | 1–135 |
| apps/desktop/src/routes/SettingsTrash.tsx | 1–392 |
| apps/desktop/src/routes/applied-filter.test.ts | 1–109 |
| apps/desktop/src/routes/applied-filter.ts | 1–51 |
| apps/desktop/src/routes/appointments/AppointmentDialog.tsx | 1–450 |
| apps/desktop/src/routes/appointments/AppointmentsScreen.tsx | 1–683 |
| apps/desktop/src/routes/appointments/DateSuggestion.test.tsx | 1–24 |
| apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx | 1–127 |
| apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx | 1–264 |
| apps/desktop/src/routes/appointments/MetFields.test.ts | 1–36 |
| apps/desktop/src/routes/appointments/MetFields.tsx | 1–169 |
| apps/desktop/src/routes/appointments/OutcomeDialog.tsx | 1–341 |
| apps/desktop/src/routes/appointments/RescheduleDialog.tsx | 1–60 |
| apps/desktop/src/routes/appointments/RescheduleFields.tsx | 1–142 |
| apps/desktop/src/routes/appointments/YearGrid.tsx | 1–142 |
| apps/desktop/src/routes/appointments/appointment-form.test.ts | 1–250 |
| apps/desktop/src/routes/appointments/appointment-form.ts | 1–142 |
| apps/desktop/src/routes/appointments/appointments-view.test.ts | 1–646 |
| apps/desktop/src/routes/appointments/appointments-view.ts | 1–471 |
| apps/desktop/src/routes/appointments/outcome-form.test.ts | 1–392 |
| apps/desktop/src/routes/appointments/outcome-form.ts | 1–230 |
| apps/desktop/src/routes/customers/CustomerPolicies.tsx | 1–118 |
| apps/desktop/src/routes/customers/PolicyDialogs.tsx | 1–340 |
| apps/desktop/src/routes/customers/policy-form.test.ts | 1–262 |
| apps/desktop/src/routes/customers/policy-form.ts | 1–239 |
| apps/desktop/src/routes/overview/OverviewTiles.tsx | 1–76 |
| apps/desktop/src/routes/overview/StageBlock.tsx | 1–127 |
| apps/desktop/src/routes/overview/TeamCompare.tsx | 1–127 |
| apps/desktop/src/routes/overview/overview-view.test.ts | 1–312 |
| apps/desktop/src/routes/overview/overview-view.ts | 1–252 |
| apps/desktop/src/routes/overview/stage-chart.test.ts | 1–150 |
| apps/desktop/src/routes/overview/stage-chart.ts | 1–130 |
| apps/desktop/src/routes/overview/stage-view.test.ts | 1–235 |
| apps/desktop/src/routes/overview/stage-view.ts | 1–142 |
| apps/desktop/src/routes/overview/team-compare-view.test.ts | 1–128 |
| apps/desktop/src/routes/overview/team-compare-view.ts | 1–129 |
| apps/desktop/src/routes/period-labels.ts | 1–26 |
| apps/desktop/src/routes/reports/ReportExport.tsx | 1–96 |
| apps/desktop/src/routes/reports/ReportTable.tsx | 1–154 |
| apps/desktop/src/routes/reports/ReportsScreen.tsx | 1–113 |
| apps/desktop/src/routes/reports/report-workbook.test.ts | 1–336 |
| apps/desktop/src/routes/reports/report-workbook.ts | 1–259 |
| apps/desktop/src/routes/reports/reports-view.test.ts | 1–366 |
| apps/desktop/src/routes/reports/reports-view.ts | 1–327 |
| apps/desktop/src/routes/trash-view.test.ts | 1–900 |
| apps/desktop/src/routes/trash-view.ts | 1–611 |

**Diff 4217ed4..119e2e4:** 10 file E, +848/−163 dòng (diff-stat.json); nội dung tập trung ở outcome-form.ts/test, EditOutcomeDialog.tsx, DeleteAppointmentDialog.tsx, OutcomeDialog.tsx, AppointmentsScreen.tsx, CustomerPolicies.tsx, SettingsTrash.tsx, trash-view.ts/test. Commit chính: d6c2350 (#666), d0a97ec (#667), f9fb70f (#693), 29aca69 (#709, chỗ nối db), 6526793 (#710). Không lấy PR status qua mạng.

**Nguồn đối chiếu:** common/prompt-codex.md; plan.md §4, L3.1–L3.8 và bảng commit/mốc đo; common/known.md (K1–K29, bảng R và OPEN/ACCEPTED liên quan E); common/fixes.md (#652/#653/#655/#662 và PR); common/baseline.md. CLAUDE.md gốc + apps/desktop/CLAUDE.md, CONTEXT.md; spec Phase 3 (D3/D6/D7/D9/D10, lệnh lịch/HĐ và nhập backup), Phase 4 (đếm kỳ/góc nhìn, C01–C11/M01–M04, Excel), Phase 6 §4.1/4.2 (S2, TR1–13, E1–20/D1–13), docs/metrics/phase-6.md. Golden chi-so.md, lich-hen.md, kh-theo-nhom.md. Mockup appointment-forms 6a–6i, policy-forms 8a–8d, trash 11a–11j (kỹ 11h–11j và E7), cùng overview/reports/settings-data/customer; danh sách nghiệm thu và Lệch mockup đã biết. Không đổi spec/mockup để khớp code.

**Lượt trước:** hai bản tổng hợp 15/10 và 17/10; báo cáo E lượt 1 trong raw/2026-10-15 của codex/claude/muse và home-pc (phát hiện, ca đã thử, đột biến), báo cáo E lượt 2 của hai bên trong raw/2026-10-17. Chỉ dùng báo cáo gốc trong repo. Probe cũ tham khảo ở đúng deep-review-1-6-r2/codex/E (loader/harness/cách chạy e2e/bloat), không dùng bản chép cũ làm code được review. Không đọc thư mục reviewer bị cấm hoặc báo cáo lượt 3 bên khác.

**Seam ngoài E:** AppDataContext/app-data/tables/persist-queue, scope context; CustomerProfile (provider fallback HĐ); Dialog/dialog-focus; i18n/vi.ts; packages/db purge/trash/customers/seed/backup-validation và export API; schema/migration mới ở chỗ cần kiểm đường nối. E2E nguyên bản appointment-outcome/customer-policies/trash và support. Phần AI chỉ đọc đường nối qua AppData, không review lại guardrail gói C.

## 4. Kịch bản mới đã thử

Kịch bản mới tách với tái hiện DR6 trong bảng R. Dữ liệu màn đi qua **openAppData, app.run, app.readBackup/importBackup, app.tables** và component thật; không chèn SQL để kết luận màn. File nhập chỉnh được dùng riêng cho ca TR-12 vốn không tạo được qua UI.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Thùng rác có KH (kèm cuộc gặp), lịch riêng, HĐ xóa riêng rồi xóa KH, nhân sự/team; đang lọc HĐ và tìm không khớp; mở/dọn | PASS: hộp đếm đủ 5 loại; dọn cả 5 dù bảng không có kết quả; live tables deepEqual. Xác nhận rỗng, chữ thường, khoảng trắng đầu/cuối, hai khoảng trắng, NBSP bị tắt; NFD đúng bật | — |
| N2 | Chuỗi dời hai lần A→B→C; A/B đã xóa từ file nhập, RE cũ và team cũ đã xóa, C còn sống dùng RE mới | PASS: giữ đủ 2 lịch + RE + team (4 bản ghi), cả bốn có lý do trỏ đúng mắt xích/người; nút tắt, kể cả khi chỉ lọc Nhân sự | — |
| N3 | Port file giả: giữ promise backup khi dọn; Escape, bấm nền, Hủy, thử lệnh ghi; rồi cho backup xong | PASS: Đang dọn…, hộp ở lại, Hủy tắt, run → DATA_REPLACING; xong có đúng tên backup, Thùng rác rỗng, live tables nguyên và focus ở thông báo | — |
| N4 | Port file giả: backup ném disk full khi bấm dọn | PASS: câu Chưa dọn được Thùng rác / Dữ liệu không bị đổi.; tables và trash deepEqual; replacing=false; focus về nút mở | — |
| N5 | Dữ liệu tải lượt 3: 7 kỳ × 49 góc nhìn; dọn 113 dòng; so Tổng quan, Báo cáo, KH theo nhóm, đếm lịch, workbook thật | PASS: 343 tổ hợp deepEqual trước/sau; Excel 4/3/2 sheet bằng từng giá trị ô; live tables nguyên, Thùng rác 113→0 | — |
| N6 | Sau N5: xuất backup → kiểm file bằng app.readBackup → import → dựng lại toàn bộ 343 tổ hợp | PASS: backup 15.840.759 byte, nhập được, số như trước và Thùng rác vẫn rỗng | — |
| N7 | Nhập bù MET giữ N3 trước ngày tạo KH, rồi xem ngày gặp ở Báo cáo | PASS: Đã gặp=1, RF=0, sáu cột KH cuối kỳ đều 0; fallback nhóm của ngày gặp không làm đếm KH chưa được tạo | — |
| N8 | Hai HĐ cùng KH, cùng ngày nộp 15/10, FYP 24tr và 48tr; duyệt danh sách nút Phát hành/Sửa | Hai tên Phát hành trùng, hai tên Sửa trùng; dòng nhìn thấy có FYP phân biệt | CX3-E1 |
| N9 | N2 thêm HĐ rác; đổi lần lượt góc nhìn Team/RE/Toàn bộ, lọc chỉ Team; chèn nguyên cụm DỌN SẠCH rồi dọn | PASS: luôn có 5 dòng/4 giữ; dọn HĐ dù đang lọc Team; còn 4 dòng, nút tắt, thông báo nhận focus, live tables nguyên. keyboard.insertText kiểm đầu vào chèn nguyên cụm, không động clipboard hệ thống | — |
| N10 | Dữ liệu tải + xóa 1.200 KH sống đầu tiên theo id; dọn rồi đối chiếu mọi bảng sống, lặp 5 DB mới | PASS: 1.313→0 dòng, kept=0, counts kết quả khớp preview, live tables deepEqual ở cả 5 lần; số đo mục 6.2 | — |

Nguồn N1–N4/N8: ui-probe.mjs + ui.log/ui-results.json; N2/N9: ui-extra.mjs + ui-extra.log/ui-extra-results.json; N5–N7: data-probe.mjs + data.log/data-results.json; N10: perf-large.mjs + perf-large.log/perf-large.json. R68/R70/R93/R94 riêng cũng chạy UI thật trong hai probe. Màn có stylesheet thật; ảnh N8 đã mở kiểm trực quan.

## 5. Phát hiện mới

### CX3-E1 — Nút Phát hành/Sửa của hai HĐ cùng ngày vẫn trùng tên trợ năng

ID: CX3-E1  
Mức: **Nit**  
Trục: **A**  
Vị trí: **apps/desktop/src/routes/customers/CustomerPolicies.tsx:96, :105**; apps/desktop/src/i18n/vi.ts:1261–1262 (119e2e4)  
Tình trạng: **CONFIRMED**  
Liên quan: biến thể gần **DR6-99**, ở thẻ HĐ còn sống; **có từ trước, lượt 1–2 bỏ sót**. PR #667 đã sửa đúng nút khôi phục, không sửa hai khóa này.  
Kịch bản: **N8**

**Mô tả:** Hai HĐ chưa phát hành cùng KH, cùng ngày nộp, khác FYP có hai nút cùng tên “Phát hành HĐ nộp 15/10/2026” và hai nút “Sửa HĐ nộp 15/10/2026”. Hai dòng hiện 24 tr và 48 tr nhưng aria-label chỉ nhận ngày, nên danh sách nút của trình đọc màn hình không phân biệt được HĐ đích.

**Tái hiện / bằng chứng:** `node C:/workspace/deep-review-1-6-r3/codex/E/ui-probe.mjs` (server serve.mjs, 127.0.0.1:4197). Probe mở AppData rỗng, tạo team/RE/KH, gọi submitPolicy hai lần cho 15/10/2026 với 24.000.000 và 48.000.000, dựng CustomerPolicies. Kết quả thật trong ui.log:

~~~text
N8-body "Hợp đồng … Nộp 15/10 · 24 tr … Phát hành Sửa … Nộp 15/10 · 48 tr … Phát hành Sửa"
N8-live-policy-accessible-names {"pass":true,"observedDuplicate":{"issue":2,"edit":2}}
~~~

Locator getByRole(button, exact name) đếm 2 cho mỗi tên trên. Ảnh policy-duplicate-names.png xác nhận hai dòng khác FYP. Đây là kiểm accessible name qua browser, chưa chạy screen reader thực. Tìm trong KNOWN và raw hai lượt trước chỉ thấy vấn đề tương ứng ở nút khôi phục; không có mục này của CustomerPolicies.

**Ảnh hưởng:** người dùng duyệt danh sách nút / điều khiển theo tên khó chọn HĐ khi nộp hai hợp đồng trong cùng ngày. Người nhìn màn phân biệt được qua dòng FYP. Không đổi tiền, ngày hoặc chỉ số, nên giữ mức Nit như DR6-99.

**Đề xuất:** thêm FYP nộp vào policies.issueLabel và policies.editLabel, truyền formatVnd(p.submittedFyp), như restoreLabel hiện làm. Khoảng **4–10 dòng SP**, ≤400; thêm ca e2e hai HĐ cùng ngày khác FYP để kiểm hai tên khác nhau. Không cần đổi golden hay mô hình dữ liệu.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Dữ liệu / phạm vi | Kết quả / số | ID |
|---|---|---|---|
| tsc -p apps/desktop --noUnusedLocals --noUnusedParameters --noEmit | Source SHA ghim, cấu hình không đổi | exit 0, log rỗng | — |
| pnpm lint:deps; pnpm codemap:check | Repo ghim | 320 module / 1.312 dependency, 0 vi phạm; export map đúng | — |
| bloat-probe.mjs + rg chỗ dùng từng export | 37 file SP E | 206 khai báo export; 27 không có hit ở file khác, đa số là kiểu hoặc hằng/helper dùng trong chính module; đây không phải 27 đoạn code chết | — |
| Đọc các candidate và nguồn dùng nội bộ | markName, các type, PURGE_REMINDER/PurgeView | markName đã KNOWN DR6-66; PURGE_REMINDER vẫn dùng nội bộ để quyết ngưỡng, PurgeView là type; chưa có chi phí runtime đo được để thành phát hiện mới | KNOWN |
| Luật D7 một nơi | customers/seed/outcome-form | Một meetingKeepingMove dùng chung; control/mutation giữ hành vi | R103 |
| Code lặp | plain/slug/badge, cột báo cáo ×3; PurgeDialog/ReloadDialog | Các nhóm đã KNOWN (DR6-67, ghi chú #710), không có bằng chứng mới | KNOWN |
| Bundle/exe theo common/baseline.md (không tự build) | Build chuẩn SHA ghim, không env riêng | Tổng JS/CSS 2.400.393 B, gzip 706.754 B; so lượt 2 +18.357/+4.645 B. chart 513.302 B và exceljs 929.569 B không đổi; exe 5.408.768 B không đổi. E: +382 SP/+303 test so R2; 51 file như cũ | — |

Không đề xuất refactor bloat mới. Các đề xuất đã hoãn/chấp nhận giữ KNOWN; không cài công cụ mới.

### 6.2 Hiệu năng

Máy **DESKTOP-KDURKJP**, Node v24.20.0. Đúng file tải lượt 3 qua app.readBackup/importBackup; tables SHA256 **1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f**. Dữ liệu 1.496 KH/10.414 lịch thô, 1.481 KH/10.255 lịch sống, 113 dòng Thùng rác. Đo Node sau khi UI/mutation trước đó đã xong; Vite rảnh, không có browser/perf exe của probe này đang chạy. Các công cụ còn lại chạy sau phép đo. Đo lớn cũng chạy khi e2e/mutation đã kết thúc; không tuyên bố biết hết tiến trình ngoài phiên.

Mỗi hàm 1 warm-up + 7 lần; dọn 5 DB mới. Trung vị (min–max), ms. Mốc Node lượt 2 lấy tổng hợp §7.2 cột Codex; preview/dọn lấy common/baseline.md của SHA ghim. Cột này giữ tách với mốc exe sau #656.

| Đo | Lượt 3 gói E | Mốc cùng máy | So / ngưỡng | ID |
|---|---:|---:|---|---|
| teamCompare.year | 2.664 (2.466–3.066) | 2.61 | Không xấu hơn theo >20% VÀ >10 ms | — |
| teamCompare.month | 1.453 (1.358–1.554) | 1.78 | Không xấu hơn theo >20% VÀ >10 ms | — |
| reportRows.year | 8.153 (7.759–9.023) | 7.28 | Không xấu hơn theo >20% VÀ >10 ms | — |
| reportRows.month | 6.220 (5.968–8.973) | 6.22 | Không xấu hơn theo >20% VÀ >10 ms | — |
| monthGrid | 0.714 (0.575–0.814) | 0.61 | Không xấu hơn theo >20% VÀ >10 ms | — |
| listTrash.113 | 26.356 (25.334–28.153) | 20.65 | Không xấu hơn theo >20% VÀ >10 ms | — |
| previewPurge.113 | 5.525 (5.412–5.998) | 5.6 | Không xấu hơn theo >20% VÀ >10 ms | — |
| AppData.purgeTrash.113 | 97.228 (96.314–100.779) | 93.8 | Dọn chưa có ngưỡng riêng; +3,4 ms so 93,8, không xấu hơn | — |
| listTrash 1.313 dòng | 141,748 (130,593–156,954) | 140,7 (baseline lượt 3) | Không xấu hơn; không dùng số Node để kết luận ngưỡng vẽ màn | — |
| previewPurge 1.313 dòng | 10,096 (9,977–10,449) | 9,9 | Không xấu hơn | — |
| AppData.purgeTrash 1.313 dòng | 106,234 (101,999–109,228) | db.purgeTrash 109,8 | Không xấu hơn; wrapper AppData có thêm overhead, không có file port | — |

teamCompare/reportRows <15 ms và monthGrid <2 ms (ngưỡng hàm thuần tham chiếu). listTrash 113 dòng tăng 5,71 ms so R2 nên không qua đồng thời hai điều kiện nhiễu; baseline lượt 3 cũng ghi 32,6 ms. preview 5,525 so baseline 5,6 ms. N10 chứng minh dữ liệu sống giữ nguyên sau dọn lớn.

**Exe / màn:** dùng lại số chuẩn đã có ở common/baseline.md, không tự đo exe/không build thêm: trash.open **38 ms** so **34 ms** sau #656 và ngưỡng <200 ms; overview.filter năm/tháng **15/14 ms** so **16/14**; reports.filter năm/tháng **9/10 ms** so **10/10**; Excel **23 ms** so **20** và ngưỡng ≤500. Không thao tác nào vượt luật nhiễu. So lượt 2: các thao tác màn ổn định theo bảng riêng của baseline; listTrash Node 20,65→26,36 ms đã nêu rõ. Không so số Node với số CDP như thể cùng phép đo. Không có phát hiện P mới; độ dốc Thùng rác đã giải theo quyết định dọn tay K27, không báo lại thành lỗi mới.

## 7. Bảng đếm mức × trục

Mỗi phát hiện tính ở trục chính; bảng R không tính thêm. Tất cả 1/1 phát hiện **CONFIRMED**, 0 PLAUSIBLE, không có KNOWN mới.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |

## 8. Đã xét, không thấy

| Trục | Đã chạy / đọc, phạm vi kết luận |
|---|---|
| R | 10 dòng R, unit/e2e control, 21 đột biến và ca UI cũ lẫn biến thể. Không phần sửa còn thiếu/hồi quy trong phạm vi kiểm; lỗi nút HĐ còn sống tách riêng A. |
| E | N1/N2/N9 đa loại/giữ phụ thuộc/đổi scope, Unicode NFD và khoảng trắng xác nhận; giao thừa 6f/6h/8b có e2e gốc + đột biến. Unit ngày/tháng/biên 1900–2100, parse giờ/tiền, HĐ. Không lỗi mới ngoài A. |
| C | Đọc 37 file SP, mockup/spec/golden, đối chiếu E7 mới và TR11–13/D1–D13. 343 tổ hợp trước/sau; bộ lọc không giới hạn phạm vi dọn; R70 nói trước hậu quả đúng cả ca không RF. Lệch mockup được Owner chấp nhận giữ KNOWN. |
| D | N3/N4 file port giả, N5/N6/N10 AppData và backup roundtrip, bảng sống deepEqual; cả workbook đọc lại bằng ExcelJS. Không thấy mất/sai dữ liệu. Không dùng phép thử này thay review Rust/đóng exe của B/F. |
| G | Chỉ đọc đường nối AppData, không màn E nào gọi AI để quyết dọn/khôi phục; không gọi dịch vụ thật. V1–V7 thuộc C, không suy ra chất lượng guardrail từ gói E. |
| S | Browser route chặn mạng ngoài, window.open thay trước goto; không key. Luồng UI qua lệnh/AppData. Test workbook giữ tên =SUM/=HYPERLINK là String, tooltip escape HTML; xác nhận không bị khoảng trắng/chữ thường vượt qua. Không đường mới gọi code/mạng từ dữ liệu đã thử. |
| P | Đo đúng tải và cùng máy, 113/1.313 dòng, bảng riêng §6.2; so mốc exe từ baseline và R2 đúng phép đo. Không số xấu hơn đồng thời >20% và >10 ms, không phát hiện P mới. |
| B | noUnused/deps/codemap và rà export/source; không code chết mới có chi phí đo được. Các kiểu export/lặp nhỏ theo KNOWN đã ghi §6.1. |
| T | Đọc 14 file test E, 303/303 PASS. Ban đầu chạy thêm một file appointment-ai-view thuộc C: 309/309; con số E chốt đúng theo classifyFile. Copy control 102/102; e2e gốc 31/31; 12 unit +9 TSX mutant đều đỏ bằng assertion. Chưa kết luận toàn bộ CI được thử đột biến. |
| A | Kiểm focus bàn phím qua nguyên e2e/đột biến, status sau dọn, aria-label/description, headerHidden; i18n qua vi.ts và định dạng domain. CX3-E1 đã ghi. Chart thiếu bảng screen reader/sticky che focus là KNOWN; chưa chạy screen reader thật. |

## 9. Phụ lục

### 9.1 Nguồn và lệnh tái chạy

Mọi đường dẫn sau tương đối với **C:/workspace/deep-review-1-6-r3/codex/E/**, đều là file probe của phiên này:

| Nguồn | Lệnh / bằng chứng |
|---|---|
| prepare.mjs | Tạo copy/ từ 743 file tracked, junction node_modules; không pnpm install. manifest.json ghim hash 51 file E. |
| loader.mjs | Nạp TS/TSX và alias @p2c tới worktree SHA ghim cho Node; không chạy app bên kia. |
| serve.mjs + vite.config.mjs + harness.tsx + index.html | node serve.mjs; cổng 4197, mã source thật + CSS thật, AppData thật; không dùng SQL tạo màn. |
| ui-probe.mjs, ui-extra.mjs | node ui-probe.mjs / node ui-extra.mjs; ui.log/ui-results.json và ui-extra.log/ui-extra-results.json. Hai lượt cuối đều blocked/errors rỗng. |
| data-probe.mjs, perf-large.mjs | node data-probe.mjs / node perf-large.mjs; data-results.json, perf-large.json và log có số thật. |
| mutations.mjs, copy-vitest.config.mjs | node mutations.mjs; cấu hình alias tới copy/; mutations.json và log từng id, control-copy xanh. |
| e2e-server.mjs, e2e.config.mjs | node e2e-server.mjs; 4198, snapshot demo riêng ngày 15/09/2026 như e2e gốc (VITE_DEMO_ANCHOR). Chạy node node_modules/@playwright/test/cli.js test -c <E/e2e.config.mjs>. Đây là dev harness để kiểm test, không phải số bundle/hiệu năng production. |
| e2e-mutations.mjs | node e2e-mutations.mjs; chỉ sửa copy/, finally hoàn nguyên. copy/e2e/probe-safe.ts chặn ngoài 127.0.0.1, thay window.open trước mọi lần goto. |
| bloat-probe.mjs | node bloat-probe.mjs; bloat.log, export-audit.json, inventory-bloat.json. |
| unit-exact.mjs | Chạy đúng 14 file E theo classifyFile, unit-E.json/log: 303 PASS. unit-baseline.log: 309 PASS gồm 6 ca nối AI. |
| audit.mjs | audit.json: mismatches=[], unrestored=[]; diff-stat.json + manifest.json. |

**Giới hạn kỹ thuật đã loại khỏi kết luận:** Lần đầu config vitest thiếu alias @p2c/ai/schema → không có test chạy; đã bổ sung alias và chạy control xanh trước mọi kết quả mutation được chấp nhận. Harness CSS ban đầu thiếu alias subpath, matcher có xuống dòng/nhãn không đúng và API isFocused không có; đã sửa riêng probe rồi chạy lại toàn bộ. Fixture giữ chuỗi ban đầu để lịch sống tham chiếu RE đã xóa nên app.readBackup từ chối BACKUP_INVALID đúng luật; đã sửa file giả để lịch sống dùng RE sống. Vite harness 4197 từng dừng do watch file .crdownload của Playwright; thêm ignored cho artifact/log rồi chạy lại ba ca extra xanh. Không coi lỗi harness, resolve, timeout hoặc import là phát hiện sản phẩm hoặc test giết mutation. Không sửa code repo để vượt các lỗi đó.

### 9.2 Đột biến

| ID | Bỏ / làm sai trên copy | Test thật bị đỏ | Kết luận |
|---|---|---|---|
| M68 | Bỏ fallback nhóm tạo KH | 1 failed \| 33 passed (34) | KILLED (assertion) |
| N1 | Bỏ kept !== ended | 1 failed \| 33 passed (34) | KILLED (assertion) |
| N2 | Bỏ ca cuộc gặp sau khỏi heldStage | 1 failed \| 33 passed (34) | KILLED (assertion) |
| R04g | editedDay không dùng nhóm đã giữ | 1 failed \| 33 passed (34) | KILLED (assertion) |
| M70 | undoneMove luôn rỗng | 2 failed \| 32 passed (34) | KILLED (assertion) |
| M93 | Bỏ dòng giữ nhóm ở Thùng rác | 1 failed \| 67 passed (68) | KILLED (assertion) |
| M94 | Bỏ câu E20 cùng ngày | 2 failed \| 66 passed (68) | KILLED (assertion) |
| M99 | Bỏ FYP ở tên nút khôi phục | 2 failed \| 66 passed (68) | KILLED (assertion) |
| M103 | outcomeLock bỏ hàm D7 chung | 2 failed \| 32 passed (34) | KILLED (assertion) |
| P-confirm | Ngưỡng nhắc đổi >= thành > | 1 failed \| 67 passed (68) | KILLED (assertion) |
| P-count | Slot lịch hẹn lấy số HĐ | 2 failed \| 66 passed (68) | KILLED (assertion) |
| P-kept | canPurge bật cả khi mọi dòng được giữ | 1 failed \| 67 passed (68) | KILLED (assertion) |
| R38c | Gỡ Prefill/opened khỏi hộp TSX | an outcome edited across New Year; 1 failed \| KILLED (assertion) |
| R38d | Gỡ Prefill/opened khỏi hộp TSX | the next appointment filled in on 31/12; 1 failed \| KILLED (assertion) |
| R38e | Gỡ Prefill/opened khỏi hộp TSX | a policy issued across New Year; 1 failed \| KILLED (assertion) |
| R43e | Bỏ headerHidden | a deleted appointment shows in Thùng rác; 1 failed \| KILLED (assertion) |
| M70-ui | Bỏ khung Khi lưu | a meeting moved to a day before another change; 1 failed \| KILLED (assertion) |
| M83-appointments | Bỏ focus fallback ở appointments | by the keyboard, saving 6c\|by the keyboard, deleting from 6f; 2 failed \| KILLED (assertion) |
| M83-policy | Bỏ focus fallback ở policy | by the keyboard, Lưu HĐ; 1 failed \| KILLED (assertion) |
| M83-trash | Bỏ focus fallback ở trash | by the keyboard, Khôi phục; 1 failed \| KILLED (assertion) |
| M84-confirm | Cho xác nhận mà không có chữ đúng | purges the trash for good once; 1 failed \| KILLED (assertion) |

Không có đột biến sống trong tập 21 cái này. Mỗi id có <id>.log và JSON lưu source/from/to; không gán kết quả toàn repo từ mẫu này. Bản chép vẫn giữ các chỉnh sửa harness/cấu hình an toàn, nhưng 51 file E đều trở lại byte nguồn gốc (audit.json).

### 9.3 Trạng thái cuối

- SHA cuối: `119e2e45cbce54d8a3943757bd826a7f1e9b694f`, đúng SHA đầu.
- Git status cuối, trùng đầu:

~~~text
?? .agents/
?? .codex/
?? AGENTS.md
~~~

- Hash 51 file E của worktree trùng manifest đầu; 51 file E trong copy cũng trùng byte nguồn sau đột biến. audit.json/audit-final.log: mismatches=[], unrestored=[].
- Đã dừng đúng hai server probe của phiên (4197/4198), sau khi kiểm command line; không dừng tiến trình khác.
- Giờ xong: **2026-10-20 19:46:38 +07:00**. Nguồn probe, bản chép, log và ảnh giữ tại E/ cho phiên tổng hợp kiểm lại.
