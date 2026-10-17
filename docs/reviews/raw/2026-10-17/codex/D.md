XONG — codex gói D lượt 2, 2026-10-17 11:27:06 +07:00

## 1. Thông tin phiên

- Bên: Codex; Gói D — Màn nhập liệu; phiên mới.
- SHA đầu phiên: 4217ed4cd3300af1d63aa61db9eb13902fe75f16.
- git status --short đầu phiên: 
  ?? .agents/
  ?? .codex/
  ?? AGENTS.md
- Bắt đầu: 2026-10-17 11:09:07 +07:00 (Asia/Bangkok).
- Công cụ: Codex desktop, PowerShell, Node, Vite, Vitest, Playwright/Edge/CDP. Model: GPT-6 (theo ngữ cảnh hệ thống); mức suy luận không được giao diện công cụ cung cấp, không tự suy đoán.
- Không subagent; không gh; repo chỉ đọc; báo cáo/probe lưu ngoài repo theo yêu cầu.

## 2. Bảng R

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 02 | #594 → #618 | ĐÃ SỬA | e2e changing the RE… xanh; mutant R02-e2e đỏ; fixture.mjs qua openAppData/run | N5: dời lịch, Hủy tương lai, đã xóa riêng, A→B→C: báo đúng 3 lịch |
| 26 | #602 → #636 | ĐÃ SỬA | e2e IS only reviews xanh; mutant R26 unit 1 failed | Ca TL vừa đánh giá vừa phối hợp trong unit; KH đã xóa + câu PERSON_IN_USE là KNOWN |
| 27 | #597 → #623 | ĐÃ SỬA | e2e KYC xanh; mutant R27 unit 3 failed | N3: ba trường tiền ×7 đầu vào + trường nghề nghiệp, hint/aria-describedby khớp |
| 28 | #597 → #623 | ĐÃ SỬA | e2e KYC xanh; mutant R28 unit 2 failed | N6: 3 giá trị cùng ngày F1/F2/F3, 7c đọc đủ mã, giải quyết về F2 |
| 29 | #597 → #623; #607 → #619 | ĐÃ SỬA | R29 unit 1 failed; R29-material e2e đỏ; docs ghi ô Kỳ tại docs/testing/nghiem-thu-v1.md:387 | Không tính RF / chuyển tay / material khớp; ô Kỳ chấp nhận không làm |
| 30 | #597 → #623 | ĐÃ SỬA | e2e bố cục xanh; R30-e2e đỏ; ảnh profile-1440/1100.png đã xem | 376px×3 tại 1440; 402px×2 tại 1100; không tràn ngang trên KH seed đã thử |
| 31 | #602 → #636 | ĐÃ SỬA | e2e ngoài góc nhìn xanh; R31-e2e đỏ | N1: ẩn ở Toàn bộ, hiện lại khi về RE cũ — câu vẫn đúng, không coi là lỗi mới |
| 32 | #602 → #636 | ĐÃ SỬA | e2e hai team >100 RE xanh; R32-e2e đỏ | Sort/Hiện thêm và reset qua team đã có trong lượt control |
| 33 | #602 → #636 | ĐÃ SỬA | R33 unit 1 failed, R33-day và R33-gender e2e đỏ; control xanh | Lỗi khóa ghi chỉ giữ bằng unit theo giới hạn UI modal đã nêu ở PR |
| 34 | #603 → #638 | ĐÃ SỬA | control asExe xanh; R34/BR3/BR4 unit bị giết; exe-ui.json trên exe release đúng hash | CDP Input gửi phím và chuột, hộp/bản nháp/URL nguyên; chưa dùng phần cứng chuột/bàn phím thật |
| 35 | #603 → #638 | ĐÃ SỬA | R35-route/foot/more e2e đều đỏ, control xanh | Biến thể Bỏ dữ kiện ngoài Issue ghi CX2-D1; không ghi là lỗi của ba nút đã sửa |
| 36 | #607 → #619 | ĐÃ SỬA (ghi lệch theo Owner) | docs/testing/nghiem-thu-v1.md:388–391 đủ bốn điểm, đối chiếu form và mockup | 5c không ghi ngày sinh cũ; 7c không cảnh báo trước; 7a thiếu hạng mục/cốt lõi; hai nhãn tạo KH |
| 62 | #606 → #644; #603 → #638 | ĐÃ SỬA | X5 4 failed; X6 2 failed; D6 1 failed; BR3/BR4 1 failed mỗi ca | stageSince dùng ở kanban, hồ sơ và 5d; coverage.include có UI/i18n, ngưỡng 92/100 theo PR |

Tổng: 13/13 dòng có kết luận; 12 đường sửa code/test đã kiểm và một nhóm ghi lệch theo Owner (DR6-36). DR6-29 có cả code lẫn ô Kỳ chấp nhận không làm. Biến thể mới của DR6-35 ghi riêng ở §5 như prompt yêu cầu, không suy rằng ba nút đã nêu trong Issue #603 chưa sửa.

## 3. Phạm vi đã đọc

74 file trong gói D, 7.196 dòng sản phẩm + 2.023 dòng test. Phạm vi do classifyFile của tools/size-report-core.mjs xác định, không suy từ tên thư mục. Đọc logic thuần, React form/màn, shell, UI kit, chuỗi i18n, CSS/token/font và test tương ứng; chú ý nhất diff 8855345..4217ed4 của #618, #623, #636, #638, #640, #644 và #619. File AI và Hợp đồng không tính là D; có đọc tại điểm nối 3f, NoteEvent, AppointmentDialog, app-data/tables, today và các lệnh DB liên quan.

Tài liệu đối chiếu: CLAUDE.md gốc, apps/desktop/CLAUDE.md, packages/ui/CLAUDE.md; CONTEXT.md; spec Phase 3 (D2, D7, D9, D10, §4, quy tắc chữ), Phase 4 (góc nhìn, ngày/kỳ, nhóm Dự kiến), Phase 6 (§4.1 S-2, §4.2 TR-3/TR-9, §5); docs/testing/nghiem-thu-v1.md (NT-KH/HS/TM, lệch đã biết:372–391); docs/metrics/phase-6.md; e2e/perf/README.md. Mockup customer-forms 5a–5f, kyc-forms 7a–7e, customer (ba cột, timeline, lịch), team 9a–9c, phase-3-feedback B1/B2 và table-more; các phần nối lịch hẹn. Nguồn đúng là spec/golden/mockup đã duyệt, có áp quyết định Owner ghi lệch.

Đã xem hồ sơ lượt 1 của D trong docs/reviews/raw/2026-10-15/{claude,codex,muse}/D.md và home-pc/{claude,codex,muse}/D.md (phát hiện, ca đã xét, đột biến, phép đo), tổng hợp lượt 1 §3–5/§7/§9, common/known.md, fixes.md, baseline.md và plan.md. Không đọc báo cáo lượt 2 của bên khác; A/B/C lượt 2 của Codex chỉ kiểm dòng đầu theo Bước 0. Probe cũ chỉ đọc trong thư mục Codex của lượt 1; không chạy hook cũ.

Bảng dưới ghi từng file và toàn khoảng dòng kiểm (chi tiết máy đọc lại được ở scope.tsv):

| File tại SHA ghim | Dòng | Loại |
|---|---|---|
| apps/desktop/index.html | 1–13 | product |
| apps/desktop/src/App.tsx | 1–18 | product |
| apps/desktop/src/i18n/index.test.ts | 1–141 | test |
| apps/desktop/src/i18n/index.ts | 1–132 | product |
| apps/desktop/src/i18n/vi.ts | 1–1245 | product |
| apps/desktop/src/index.css | 1–2 | product |
| apps/desktop/src/main.tsx | 1–47 | product |
| apps/desktop/src/routes/Screen.tsx | 1–21 | product |
| apps/desktop/src/routes/customers/CustomerAppointments.tsx | 1–154 | product |
| apps/desktop/src/routes/customers/CustomerDialogs.tsx | 1–516 | product |
| apps/desktop/src/routes/customers/CustomerKyc.tsx | 1–309 | product |
| apps/desktop/src/routes/customers/CustomerProfile.tsx | 1–278 | product |
| apps/desktop/src/routes/customers/CustomersScreen.test.tsx | 1–11 | test |
| apps/desktop/src/routes/customers/CustomersScreen.tsx | 1–307 | product |
| apps/desktop/src/routes/customers/KycDialogs.tsx | 1–534 | product |
| apps/desktop/src/routes/customers/customers-view.test.ts | 1–294 | test |
| apps/desktop/src/routes/customers/customers-view.ts | 1–180 | product |
| apps/desktop/src/routes/customers/kyc-view.test.ts | 1–499 | test |
| apps/desktop/src/routes/customers/kyc-view.ts | 1–297 | product |
| apps/desktop/src/routes/team/PersonDialogs.tsx | 1–212 | product |
| apps/desktop/src/routes/team/TeamDialogs.tsx | 1–101 | product |
| apps/desktop/src/routes/team/TeamScreen.tsx | 1–317 | product |
| apps/desktop/src/routes/team/team-view.test.ts | 1–163 | test |
| apps/desktop/src/routes/team/team-view.ts | 1–132 | product |
| apps/desktop/src/shell/AppShell.tsx | 1–91 | product |
| apps/desktop/src/shell/CloseGuard.tsx | 1–82 | product |
| apps/desktop/src/shell/ErrorBoundary.tsx | 1–49 | product |
| apps/desktop/src/shell/RePicker.tsx | 1–88 | product |
| apps/desktop/src/shell/SaveWarning.test.tsx | 1–20 | test |
| apps/desktop/src/shell/SaveWarning.tsx | 1–21 | product |
| apps/desktop/src/shell/ScopeContext.tsx | 1–24 | product |
| apps/desktop/src/shell/ScopePicker.tsx | 1–61 | product |
| apps/desktop/src/shell/Sidebar.tsx | 1–58 | product |
| apps/desktop/src/shell/StartupError.tsx | 1–18 | product |
| apps/desktop/src/shell/block-reload.test.ts | 1–106 | test |
| apps/desktop/src/shell/block-reload.ts | 1–62 | product |
| apps/desktop/src/shell/close-guard.test.ts | 1–118 | test |
| apps/desktop/src/shell/close-guard.ts | 1–35 | product |
| apps/desktop/src/shell/routes.test.ts | 1–93 | test |
| apps/desktop/src/shell/routes.ts | 1–77 | product |
| apps/desktop/src/shell/scope.test.ts | 1–157 | test |
| apps/desktop/src/shell/scope.ts | 1–75 | product |
| apps/desktop/src/shell/screen-error.test.ts | 1–21 | test |
| apps/desktop/src/shell/screen-error.ts | 1–17 | product |
| apps/desktop/src/shell/startup-error.test.ts | 1–86 | test |
| apps/desktop/src/shell/startup-error.ts | 1–50 | product |
| apps/desktop/src/shell/useRoute.ts | 1–45 | product |
| apps/desktop/src/ui-choices.test.tsx | 1–30 | test |
| packages/ui/src/components/Button.tsx | 1–28 | product |
| packages/ui/src/components/Chart.tsx | 1–68 | product |
| packages/ui/src/components/Choices.tsx | 1–75 | product |
| packages/ui/src/components/DataTable.tsx | 1–230 | product |
| packages/ui/src/components/Dialog.tsx | 1–82 | product |
| packages/ui/src/components/NavIcon.tsx | 1–63 | product |
| packages/ui/src/components/PeriodPicker.label.test.ts | 1–26 | test |
| packages/ui/src/components/PeriodPicker.label.ts | 1–21 | product |
| packages/ui/src/components/PeriodPicker.tsx | 1–183 | product |
| packages/ui/src/components/PolicyBadge.tsx | 1–13 | product |
| packages/ui/src/components/Segmented.tsx | 1–64 | product |
| packages/ui/src/components/SelectField.tsx | 1–87 | product |
| packages/ui/src/components/StageBadge.tsx | 1–22 | product |
| packages/ui/src/components/TextField.tsx | 1–89 | product |
| packages/ui/src/components/chart-theme.test.ts | 1–47 | test |
| packages/ui/src/components/chart-theme.ts | 1–57 | product |
| packages/ui/src/components/compare-cells.test.ts | 1–50 | test |
| packages/ui/src/components/compare-cells.ts | 1–38 | product |
| packages/ui/src/components/show-more.test.ts | 1–53 | test |
| packages/ui/src/components/show-more.ts | 1–25 | product |
| packages/ui/src/fonts.css | 1–140 | product |
| packages/ui/src/index.ts | 1–17 | product |
| packages/ui/src/theme.css | 1–80 | product |
| packages/ui/src/token-guard.test.ts | 1–108 | test |
| packages/ui/src/token-guard.ts | 1–77 | product |
| packages/ui/src/tokens.css | 1–69 | product |

## 4. Kịch bản mới đã thử

Nguồn UI dùng bản chép ở D/copy, Vite 127.0.0.1:4286, ghim 15/09/2026, Edge headless 1.440×900. Route chặn mọi hostname ngoài 127.0.0.1 và thay window.open trước tương tác từ lượt đầu. Fixture qua openAppData + data.run/app.tables hoặc nhập/lưu qua UI, không chèn SQL thô.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Góc nhìn RE A → tạo KH cho RE B → Toàn bộ → quay lại A | Dòng role=status có link khi ở A; ẩn ở Toàn bộ, hiện lại khi về A. Câu vẫn mô tả đúng KH ngoài góc nhìn; không có thêm thao tác tạo, không coi việc hiện lại là phát hiện | — |
| N2 | Sửa tên KH thành bản nháp → Xóa KH… → Hủy → Escape | Bản nháp giữ nguyên, Hủy focus ô Họ tên trong modal; Escape trả về Sửa hồ sơ | — |
| N3 | Ba trường tiền annualIncome/totalAssets/liabilities × 0, 500 nghìn, 1 tỷ 2, 6.000.000.000, Khoảng 12 tỷ, 1–2 tỷ, -1 triệu; đổi sang Nghề nghiệp | 28 tổ hợp: đọc lại đúng dạng đủ/gọn khi hiểu được, không có hint/aria-describedby khi không hiểu hoặc trường không phải tiền; không lỗi trang | — |
| N4 | Thêm Số con=0 vào ghi chú đang soạn → bấm Bỏ | Modal còn, focus BODY; không mất nội dung ghi chú | CX2-D1 |
| N5 | KH có MET cũ, Dự kiến hôm nay/tương lai, chuỗi Dời lịch, Hủy tương lai, lịch đã xóa riêng; bàn giao A→B→C | Node qua app: đúng 3 lịch sống Dự kiến sang B rồi C; MET/RESCHEDULED/CANCELLED giữ A. UI 5c mỗi lần báo đúng 3, sau lưu chọn RE C. Fixture được xuất qua app, import qua UI | — |
| N6 | Ba giá trị Thu nhập năm cùng ngày, hai lần đánh dấu mâu thuẫn → chọn giá trị giữa | 7c giữ đủ mã; 7d có F1/F2/F3 dù cùng ngày; giải quyết về 2 tỷ/F2, bỏ hai giá trị còn lại khỏi hiệu lực, v4 | — |
| N7 | Hồ sơ seed có KYC và lịch, đổi 1.440→1.100, xem toàn trang | 376px×3 rồi 402px×2, scrollWidth bằng viewport, không tràn ngang trên ca thử; ảnh đã xem. Lần đầu harness chưa chờ render, đã loại và chạy lại có expect region trước đo | — |
| N8 | Focus nút Bỏ dữ kiện Số con bằng bàn phím → Enter → Tab | Sau Enter: BODY, dialog:modal=true; Tab tiếp tới SELECT Trường; bản nháp còn | CX2-D1 |
| N9 | Ghi chú có NBSP/khoảng trắng đầu dòng/xuống dòng, A+U+200B+dấu sắc; dữ kiện có NBSP → lưu → xuất backup | Ghi chú là “Dòng một\nDòng hai Á”; giá trị “Bác sĩ gia đình”. Giữ xuống dòng và chuẩn hóa đúng K20; kiểm file xuất thật multiline.p2cbackup | — |
| N10 | Trên exe release đúng hash: mở 7a, gõ bản nháp; Alt+←/→, F5, BrowserBack/Forward, chuột Back/Forward qua CDP Input | Cả 7 kiểu giữ URL, modal=1, toàn bộ bản nháp. keyEvents ghi defaultPrevented=true cho năm phím có tác dụng. Đã hủy bản nháp và dừng exe riêng | — |

N1–N4: new-ui.json; N5/N6/N8: new-ui2.json + handover-fixture.json; N7/N9: new-ui3.json; N10: exe-ui.json. Không có pageerror trong các lượt UI mới chạy thành công. Không coi lỗi chờ render của harness N7 là lỗi sản phẩm.

## 5. Phát hiện mới

### CX2-D1 — Bỏ dữ kiện đang soạn làm focus rơi về body

ID: CX2-D1
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:334 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-35 (biến thể mới ngoài ba nút của Issue #603); có từ trước, lượt 1 bỏ sót — git show 8855345 giữ nguyên callback này.
Kịch bản: N4, N8.
Mô tả: Trong 7a, nút Bỏ của một dữ kiện đang soạn tự bị gỡ khỏi DOM mà không chuyển focus. Bấm bằng chuột hay focus nút rồi Enter đều làm document.activeElement thành BODY, dù dialog:modal vẫn mở.
Tái hiện / bằng chứng: node D/new-ui.mjs (N4) và node D/new-ui2.mjs (N8), new-ui.json / new-ui2.json: removed={tag:BODY,modal:true}; Tab kế tiếp mới tới SELECT Trường. Ghi chú Bản nháp giữ lại vẫn còn. Đây là thao tác UI thật, dữ liệu tạo qua form app, không SQL thô.
Ảnh hưởng: Người dùng bàn phím / trình đọc màn hình mất đích focus và ngữ cảnh ngay sau Bỏ; không mất bản nháp hay dữ liệu, Tab vẫn quay vào hộp.
Đề xuất: sau khi bỏ, focus trường chọn dữ kiện hoặc nút Bỏ kế bên còn sống, giống cách xử lý các nút tự gỡ của #638; thêm e2e bàn phím. Ước lượng <30 dòng SP, không dependency mới.

Không có phát hiện mới về sai dữ liệu/chỉ số/backup trong phạm vi D. Không ghi lại 13 mục R thành ID mới. Câu PERSON_IN_USE đối với người hỗ trợ chỉ còn liên hệ tới KH đã xóa là KNOWN trong common/known.md:148; không báo lại. DR6-29 ô Kỳ và bốn lệch của DR6-36 đã có ghi đủ và khớp app.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Dữ liệu | Kết quả / số | ID mới |
|---|---|---|---|
| tsc --noEmit --noUnusedLocals --noUnusedParameters -p apps/desktop/tsconfig.json; tương tự packages/ui | SHA ghim | Cả hai exit 0; tsc-app.log / tsc-ui.log | — |
| pnpm codemap:check | Export/route map | Export maps are up to date | — |
| pnpm lint:deps | App + packages | 0 vi phạm, 315 module / 1.277 dependency | — |
| pnpm lint:tokens | App + UI components | Không có style lách token | — |
| bloat.mjs: AST khai báo export + tìm tên toàn code SP | 153 khai báo export của D | 4 ứng viên ít tham chiếu: COUNT_SLOTS/fillSlots/SaveFailed đều dùng trong chính file; PLAIN_SLOTS chỉ phục vụ test là KNOWN. Không có runtime export chết mới được xác nhận | — |
| Quét i18n literal + tiền tố động bảo thủ | 1.118 khóa vi.ts | 0 ứng viên không dùng; không chứng minh từng khóa đều tới được, birth.error.empty đã KNOWN | — |
| classifyFile/countLines | Toàn D | 74 file, 7.196 SP, 2.023 test; so lượt 1: +1 file, +376 SP, +275 test; khớp baseline | — |
| Bundle chuẩn từ common/baseline.md, không tự build để lấy số | Toàn app, không quy riêng cho D | JS/CSS thô 2.382.036 B, gzip 702.109 B; lượt 1 2.364.283 / 697.071 B; Δ +17.753 / +5.038 B. Chart và Excel không đổi; index.js +17.727/+5.034 B, CSS +26/+4 B | — |

Không có phát hiện B mới có chi phí đo được. Các mùi lặp CARD/ALERT/badge, class dark, PLAIN_SLOTS, memo cột với onNext đã nằm trong KNOWN/lượt 1, không có bằng chứng mới nên không tạo lại ID. Không cài công cụ/dependency.

### 6.2 Hiệu năng

Máy DESKTOP-KDURKJP; Node, Vite runnerImport, SQL.js, dữ liệu tải chuẩn lượt 2. Đọc backup qua AppData.readBackup và importBackup, lấy app.tables để đo. Hash tables 1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591, đúng plan §L2.6. Bảng live qua app: 1481 KH, 10255 lịch, 51 nhân sự, 4 team; không nhầm với tổng kể cả đã xóa 1.496 KH/10.414 lịch của backup. Đối tượng KYC có nhiều lịch nhất: 01K7C4NNGTXFVA2EJV1SGE9060.

Mỗi hàm 10 warmup + 100 lần. Khi đo: unit/e2e/đột biến của phiên đã kết thúc, chỉ server Vite local rảnh; chưa khởi động exe riêng. Không biết hoạt động ngoài phiên, nên không suy máy hoàn toàn rảnh. So với node-perf.json của chính Codex D lượt 1 Home PC, không so Office Laptop. Có khác cơ chế nạp (Vite runnerImport thay loader Node cũ); không dùng chênh nhỏ làm kết luận hồi quy.

| Phép đo | Lần | Trung vị ms | Min–max ms | Lượt 1 cùng máy ms | Δ ms | Xấu hơn theo luật nhiễu? |
|---|---:|---:|---:|---:|---:|---|
| customerBoard.all | 100 | 1,550 | 1,448–3,113 | 1,307 | +0,243 | không |
| customerBoard.team | 100 | 0,439 | 0,421–1,517 | 0,374 | +0,066 | không |
| staffMetrics.44-RE | 100 | 7,075 | 6,912–7,591 | 5,900 | +1,175 | không |
| groupByTeam | 100 | 0,004 | 0,003–0,027 | 0,003 | +0,000 | không |
| reOptions | 100 | 0,026 | 0,025–0,059 | 0,022 | +0,004 | không |
| kycOverview.max-appointments-profile | 100 | 0,004 | 0,003–0,047 | 0,003 | +0,001 | không |
| kycTimeline.max-appointments-profile | 100 | 0,023 | 0,021–0,043 | 0,013 | +0,010 | không |

Không dòng nào tăng đồng thời >20% và >10 ms. Không phát hiện P. Đây là số hàm thuần, không phải từ click tới paint; không dùng nó để tự khẳng định toàn UI đạt 200 ms.

Số UI/exe chuẩn có sẵn (không đo lại hiệu năng exe trong D; lần mở exe chỉ thử hành vi, cửa sổ Hidden không hợp lệ để đo paint):

| Thao tác | Baseline lượt 2 Home PC | Lượt 1 Home PC | Ngưỡng | Nhận xét |
|---|---:|---:|---:|---|
| customers.view-table | 19 ms | 18 ms | <200 ms | Trong ngưỡng, trong nhiễu |
| customers.sort-name | 22 ms | 22 ms | <200 ms | Trong ngưỡng, trong nhiễu |
| customer.open-ai | 18 ms | 20 ms | <200 ms | Trong ngưỡng, trong nhiễu |
| reload.customers | 272 ms | 206 ms | <500 ms | Baseline đã đánh dấu +66 ms/+32%, tăng cùng sáu reload.*; D không đo nguyên nhân mới |
| reload.team | 311 ms | 248 ms | <500 ms | Baseline đã đánh dấu +64 ms/+26%; cần xét chung mở DB ở B/F |

Không giấu hai dòng reload tăng so lượt 1. Không tạo phát hiện P mới chỉ từ số tham chiếu đã ghi ở baseline; các cờ chung app.open-data/reload.* thuộc việc điều tra xuyên gói B/F. Nguồn tự chạy: perf.mjs, node-perf.json, node-perf.log. Mốc chuẩn: common/baseline.md và common/perf/perf-ref-r1.json.

## 7. Bảng đếm mức × trục

Chỉ đếm ID mới, không đếm bảng R hay KNOWN.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

CONFIRMED 1/1 (100%); PLAUSIBLE 0; KNOWN không ghi lại thành phát hiện. Không đưa ra kết luận SẴN SÀNG/CHƯA SẴN SÀNG toàn v1.0 ở D; phần đó dành gói F.

## 8. Đã xét, không thấy theo từng trục

| Trục | Đã đọc / chạy và kết quả |
|---|---|
| R | Đủ 13 dòng §2; 153 unit/68 e2e control xanh; 21 mutant bị test giết. Các thay đổi G7/Owner đã ghi lệch, không coi accepted là chưa sửa |
| E | N1–N3, N5–N9; biên năm sinh của unit, ngày ghi nhận 7a sau Lưu, gender chọn lại, thiếu trường/pending fact, đổi team/scope, nested delete cancel. Không thấy lỗi edge mới ngoài focus CX2-D1 |
| C | Đối chiếu 5a–5f/7a–7e/9a–9c, B1/B2, table-more, NT-KH/HS/TM, nhãn timeline RF/material, số chuyển lịch 5c, ba/hai cột. Không có lệch hợp đồng mới được xác nhận |
| D | Mọi form D ghi qua data.run + lệnh DB; N5 đi qua openAppData/run/tables, import fixture ở UI; N6 giải quyết đúng F2; N9 xuất backup thật giữ newline và chuẩn hóa. Không thấy dữ liệu sai mới |
| G | Phần nối 3f của KycDialogs đọc/xác nhận qua lệnh như RE nhập tay; không tự lưu đề xuất; birthYear/gender không chọn ở 7a. File AI ở C, không gọi AI thật hoặc thay guardrail |
| S | parseHash/decode/localStorage/fillSlots và test; JSX text thông thường, Chart dùng encodeHtml cho formatter ở điểm nối; browser route loopback + window.open giả; exe đúng hash, DNS về loopback, không gọi OpenCode/ChatGPT hoặc đọc key. Không thấy ranh giới mới bị vượt |
| P | §6.2; 7 phép đo hàm thuần trên bộ tải, không tăng vượt nhiễu; UI chuẩn <200 ms. Giữ rõ các cờ reload.* có sẵn, không quy nguyên nhân khi chưa đo |
| B | §6.1; tsc/codemap/deps/tokens và AST/i18n; không có bloat mới đủ bằng chứng/chi phí để tạo ID |
| T | 18 file/153 unit xanh; 68 e2e trên bản chép dev xanh; 11 unit + 10 e2e mutant đỏ đúng AssertionError/expect, không tính lỗi compile/load. Coverage dùng số baseline; không cài DOM lib. Giới hạn X5 callsite TSX ngừng dùng hàm chung vẫn dựa đọc code như PR #644 đã khai, không biến thành mục mới |
| A | h1/document.title/return-to-card, Hiện thêm cuối/+n KH focus, form aria-describedby, gender/error, Choices/Segmented bàn phím, Back/Forward trên exe. Có CX2-D1. Chart thiếu bảng số/viền tương phản thấp là KNOWN, không có bằng chứng mới |

## 9. Phụ lục probe, test, đột biến và trạng thái cuối

### 9.1 Nguồn và lệnh tái lập

Mọi đường dẫn D/ dưới đây đều là C:/workspace/deep-review-1-6-r2/codex/D/; thư mục gốc repo là C:/workspace/Project-2C-review-2. Tất cả nguồn tự viết còn nguyên trên đĩa, không cần suy từ log tóm tắt.

| Nguồn / lệnh | Kết quả / bằng chứng |
|---|---|
| node D/setup.mjs | Tạo bản chép file tracked dùng cho test, junction tới node_modules có sẵn; scope.tsv 74 file. Không cài dependency; copy/vite.config.ts có alias source chép |
| node D/serve.mjs | Vite local 4286, seed snapshot giả lập bằng Vite runnerImport. VITE_DEMO_ANCHOR=15/09/2026 được khai rõ; không dùng bundle này để so baseline |
| pnpm exec vitest run <18 đường dẫn test trong scope.tsv> | unit.log: 18 files /153 tests, 2,20 s |
| node <repo>/node_modules/@playwright/test/cli.js test --config D/playwright.config.mjs | e2e-control-fixed.log: 68 passed (1.3m). Bản chép dev, 1 worker, Edge; không giả là chạy lại toàn bộ cổng production 227 test của baseline |
| node D/mutation-unit.mjs | mutation-results.json; D/mutations/<ID>/module.ts, module.test.ts, config.mjs, run.log |
| node D/mutation-e2e.mjs | mutation-e2e-results.json; D/mutations/<ID>-e2e.log; sửa duy nhất copy/file rồi finally trả lại byte cũ |
| node D/fixture.mjs | handover.p2cbackup + handover-fixture.json; openAppData(seed rỗng) → data.run lệnh app → app.exportBackup |
| node D/new-ui.mjs; new-ui2.mjs; new-ui3.mjs | new-ui*.json/log; multiline.p2cbackup, ảnh profile-1440.png/profile-1100.png |
| node D/exe-ui.mjs | exe-ui.json, exe-back-forward.png; kết nối 127.0.0.1:9334, CDP Input, snapshot bản nháp |
| node D/perf.mjs | node-perf.json/log, dữ liệu tải chuẩn lượt 2 qua lớp app |
| node D/bloat.mjs | bloat.json, source-sha256.tsv; hash bộ tải đúng |
| pnpm codemap:check; pnpm lint:deps; pnpm lint:tokens; tsc --noUnused… | codemap-check.log, lint-deps.log, lint-tokens.log, tsc-app.log, tsc-ui.log; tất cả exit 0 |
| node D/finalize.mjs | Giữ bản ghi dần ở progress.md, gom bản cuối, kiểm SHA/status và hash 74 file |

### 9.2 Đột biến

Control gốc xanh trước đột biến. Tất cả mutant code nằm trong D/; không patch repo. 21/21 bị giết; không mutant sống trong tập này. Unit R27/R28/R29 lần đầu lỗi harness resolve i18n/index.ts; đã sửa harness và chạy lại, chỉ lấy lượt có assertion thật. Chi tiết lỗi đúng dòng ở run.log tương ứng.

| Đột biến | Bộ test | Kết quả | Tóm tắt test |
|---|---|---|---|
| R26 | unit | KILLED | Tests  1 failed | 7 passed (8) |
| R27 | unit | KILLED | Tests  3 failed | 22 passed (25) |
| R28 | unit | KILLED | Tests  2 failed | 23 passed (25) |
| R29 | unit | KILLED | Tests  1 failed | 24 passed (25) |
| R33 | unit | KILLED | Tests  1 failed | 7 passed (8) |
| R34 | unit | KILLED | Tests  1 failed | 6 passed (7) |
| BR3 | unit | KILLED | Tests  1 failed | 6 passed (7) |
| BR4 | unit | KILLED | Tests  1 failed | 6 passed (7) |
| X5 | unit | KILLED | Tests  4 failed | 16 passed (20) |
| X6 | unit | KILLED | Tests  2 failed | 18 passed (20) |
| D6 | unit | KILLED | Tests  1 failed | 19 passed (20) |
| R02 | e2e | KILLED | 1 failed |
| R29-material | e2e | KILLED | 1 failed |
| R30 | e2e | KILLED | 1 failed |
| R31 | e2e | KILLED | 1 failed |
| R32 | e2e | KILLED | 1 failed |
| R33-day | e2e | KILLED | 1 failed |
| R33-gender | e2e | KILLED | 1 failed |
| R35-route | e2e | KILLED | 1 failed |
| R35-foot | e2e | KILLED | 1 failed |
| R35-more | e2e | KILLED | 1 failed |

Nội dung: R02 bỏ preview số lịch; R26 bỏ reviewing; R27 bỏ nhánh tiền; R28 bỏ mã F; R29 trả noRf mọi cuộc gặp; R29-material bỏ badge; R30 trả breakpoint 2xl; R31 ẩn status KH ngoài scope; R32 bỏ resetKey; R33 bỏ retry khóa ghi, trả lỗi Ngày ngay khi gõ hoặc bỏ xóa lỗi khi đổi giới tính; R34 bỏ chặn history key; BR3 bỏ miễn trừ text field; BR4 capture=false; X5 lấy chuyển nhóm đầu; X6 đếm cả cột; D6 từ chối năm sinh bằng năm nay; R35 bỏ lần lượt focus heading/foot/bảng. Không dùng lỗi build hay lỗi import để chấm KILLED.

### 9.3 Giới hạn và sự cố harness đã xử lý

- Không gọi gh, không tạo Issue/PR/commit, không sửa code/spec/mockup trong repo; không đọc thư mục kết quả lượt 2 bị cấm hoặc Project-2.
- Bộ duyệt tự động từ chối thực thi hook lượt 1 vì chưa xác minh tác dụng phụ. Không chạy hook đó; dùng Vite runnerImport có sẵn. Từ chối mở exe lần đầu vì binary chưa xác minh; sau khi đọc SHA-256 khớp baseline và source startup/thư mục dữ liệu riêng, lệnh được duyệt. Không còn bước nào bị chặn.
- Exe: common/exe/project2c.exe và bản chép đều SHA-256 E2C421FD63B77766C11CD6D4B6DA9F8CD52A4D8A48F468690ECB23ADCD964504. WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS gồm remote-debugging-port=9334, host-resolver-rules MAP * 127.0.0.1, disable-background-networking. Cài route chặn ngoài loopback và window.open giả trước tương tác. Đã dừng tiến trình riêng PID 30924 và server 4286 sau thử. D/exe/Project2C-data chỉ là dữ liệu giả lập do bản chép sinh.
- Exe kiểm bằng CDP Input, không có người bấm chuột 5 nút/phím BrowserBack phần cứng thật. Giữ giới hạn thử tay G7 của KNOWN; không suy từ sự kiện giả rằng mọi driver thiết bị đã được kiểm.
- Lượt e2e đầu dùng ISO trong VITE_DEMO_ANCHOR làm parseDate không ghim được ngày, đã dừng, loại kết quả, giữ e2e-control.log để minh bạch. Lượt hợp lệ là e2e-control-fixed.log. N7 lần đầu chưa chờ profile render, chỉ lấy lần retry trong new-ui3.json. Không có sửa sản phẩm để làm probe xanh.
- Không chạy lại toàn bộ pnpm verify/coverage/e2e/Rust/build: cổng SHA ghim đã có ở baseline; D chạy những kiểm tra phù hợp phía trên. Không đo hiệu năng paint khi exe Hidden; dùng baseline cho bảng UI. Không cài công cụ mới.

### 9.4 Kết thúc

- SHA cuối: 4217ed4cd3300af1d63aa61db9eb13902fe75f16.
- git diff --exit-code: exit 0; hash 74 file D khớp source-sha256.tsv.
- git status --short cuối (giống hệt đầu phiên):

    ?? .agents/
    ?? .codex/
    ?? AGENTS.md

- Giờ xong: 2026-10-17 11:27:06 +07:00 (Asia/Bangkok).
- Báo cáo chỉ kết luận trong phạm vi D; gói kế tiếp E cần mở phiên mới.

