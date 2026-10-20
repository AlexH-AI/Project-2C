XONG — codex gói D lượt 3, 2026-10-20 19:19:46 +07:00

## 1. Phiên review

- Bên: codex. Gói D — Màn nhập liệu, phiên mới. Bắt đầu 2026-10-20 18:56:58 +07:00; kết thúc 2026-10-20 19:19:46 +07:00, Asia/Bangkok.
- Worktree C:\workspace\Project-2C-review-2, detached đúng SHA 119e2e45cbce54d8a3943757bd826a7f1e9b694f.
- Git status đầu và cuối: ?? .agents/; ?? .codex/; ?? AGENTS.md. Các mục untracked đã có từ đầu; tracked diff rỗng.
- Công cụ: Codex desktop, PowerShell, Node v24.20.0, Vite runnerImport/dev, Vitest 5.0.1, Playwright/Edge headless. GPT-6 theo ngữ cảnh hệ thống; định danh model cụ thể và mức suy luận không được công cụ phiên cung cấp, không tự suy đoán hay thay cấu hình Owner.
- Bước 0 kiểm từng đường dẫn A.md/B.md/C.md: đều XONG; D.md chưa có. Chỉ đọc dòng đầu A–C, không đọc nội dung báo cáo lượt 3 khác.
- Không subagent, gh, Issue, PR, commit, sửa code sản phẩm hay nghi thức phiên. Không gọi OpenCode/ChatGPT thật, không đọc key. Không truy cập các thư mục bị cấm hoặc Project-2.
- Báo cáo ghi dần từ đầu, bản tích lũy giữ ở D/progress.md. Tất cả probe/log/bản chép ở C:\workspace\deep-review-1-6-r3\codex\D\.

## 2. Bảng R

Cách kiểm: control gốc → gỡ phần sửa trên bản chép → chạy test của PR → trả nguyên byte trong finally → chạy lại control. Mục tài liệu kiểm câu đã ghi và hành vi tương ứng. Kết luận theo đúng phạm vi mô tả DR6/Issue; biến thể mới ghi riêng ở mục 5.

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 72 | #659 → #686 | ĐÃ SỬA (phần D) | text.test.ts và unit cuối xanh; R72 bỏ DI/U+2800/White_Space → AssertionError trong text.test.ts. | N7: tên chỉ vô hình bị từ chối; D+NEL+Team+U+3164 trùng D Team. N8: KYC tiền dùng cùng hàm. Phần bất biến DB toàn diện thuộc A. |
| 75 | #656 → #674 | ĐÃ SỬA (phần D) | startup-error.test.ts xanh; R75 trả catalogue trước PR → test đóng cửa sổ đỏ; N9 thử UI IPC giả. | FILE_IN_USE / ACCESS_DENIED / ALREADY_OPEN hiện câu mới. Bảy nhóm lỗi kiểm bằng unit; cơ chế giữ khóa/đóng tiến trình thuộc B. |
| 80 | #654 → #669 | ĐÃ SỬA | inUseHelp unit và e2e 9b xanh; R80 dùng câu chung cho reviewer/coordinator → 1 test đỏ. | N5: 5 KH đã xóa, cả RE và IS đếm đủ, ba tên + 2 KH khác; sau khôi phục/xóa/dọn số đúng. Câu inUseTrash/inUseSupportTrash có vế dọn sạch. |
| 81 | #654 → #669 | ĐÃ SỬA | navigation.spec.ts control xanh; R81 bỏ scrollTo → expect scrollY đỏ. | Control giữ cả đường về thẻ vừa xem; sidebar/hồ sơ không kế thừa cuộn màn trước. |
| 82 | #654 → #669 | ĐÃ SỬA | e2e URL 108 ký tự ở 1440/1100 xanh; R82-note và R82-fact bỏ wrap-anywhere → Range vượt mép thẻ, cả hai đỏ. | N3: chuỗi dài sau lưu không tràn; hàng dữ kiện đang soạn chưa ngắt → CX3-D2. Biến thể tên hồ sơ → CX3-D3. Không chấm lỗi mới ở đường cũ đã sửa. |
| 83 | #655 → #693 | ĐÃ SỬA | Control các luồng 6c/6g/6h/8a/8b/khôi phục/7a/7d xanh; R83-focus 2 unit đỏ, R83-Dialog e2e 6c đỏ, R83-7a Bỏ dữ kiện đỏ. | N1 thêm/xóa TL còn BODY ở màn Team, ngoài danh sách Issue #655 → CX3-D1. Hủy 9b và 5f vẫn trả focus đúng. |
| 90 | #654 → #669 | ĐÃ SỬA | R90-BR3 (bỏ checkbox khỏi selector thật) unit đỏ; R90-team/person, R90-note/day đều e2e đỏ. R90-add làm mất lỗi Ngày/Ghi chú cũng đỏ. | Không tính lỗi import/build là bị giết. Đã đọc bộ so khớp selector mới; selector lạ không được cho qua. Control cuối 208 unit và 9 e2e xanh. |
| 96 | #663 → #700 | ĐÃ SỬA (tài liệu) | nghiem-thu-v1.md có NT-EX-05 (:333), NT-KH-16, NT-TM-15/16 (:263–264); đối chiếu câu với vi.ts và e2e control. | NT-TR-23 kiểm hộp 9b sau dọn; N5 chạy thêm chuỗi đó. EX-05 phần phím/chuột phần cứng vẫn là nghiệm thu G7, không giả đã tự thử phần cứng. |
| 100 | #655 → #693 | ĐÃ SỬA | Control cột Thao tác có tên và rộng ≤1px. R100-old-customer/team trả header rỗng → cả hai đỏ ở count=1. | R100-customer/team làm header hiện ra cũng bị giết ở boundingBox width. Đã kiểm headerHidden và sortable=false của cả hai nơi. |
| 101 | #654 → #669 | ĐÃ SỬA | kyc-view.test.ts xanh; R101 bỏ normalizeText → null khác 6.000.000.000 ₫ (6 tỷ), test đỏ. | N8: ba trường tiền × 6+U+3164+tỷ, 1+NEL+tỷ+U+034F+2, chữ tự do. Hint/describedby có khi hiểu được, không có khi chữ tự do; 3f dùng cùng FactValue/helper. |

Đủ 10/10 dòng: ĐÃ SỬA 10, SỬA MỘT PHẦN 0, CHƯA SỬA 0, HỒI QUY 0. Ba biến thể ngoài đường cũ bên dưới không làm sai lại các kết luận đường cũ.

## 3. Phạm vi đã đọc

76 file được classifyFile của tools/size-report-core.mjs xếp D: 7.329 dòng sản phẩm, 2.165 dòng test. Đọc component, helper, shell/router, i18n, token/theme/font và test trong bảng. File AI/Hợp đồng thuộc C/E chỉ đọc ở điểm nối. Metadata đọc thêm: CLAUDE.md gốc, apps/desktop/CLAUDE.md, packages/ui/CLAUDE.md, package.json/tsconfig.json UI và cấu hình Vitest/Playwright/Vite.

Đối chiếu: CONTEXT.md; Phase 3 §4/§6, Phase 4 định nghĩa kỳ/góc nhìn/nhóm, Phase 6 §4.1 S-2/§4.2 TR-1…13/D1…13/§5; mockup customer, customer-forms 5a–5f, kyc-forms 7a–7e, team 9a–9c, phase-3-feedback B1/B2, trash 11f–11j và bản đồ mockup; nghiệm thu v1 phần KH/HS/TM/EX và Lệch mockup đã biết. Quyết định K20/K25, không tự coi emoji mất VS/ZWJ theo luật Owner là lỗi.

Đọc các phát hiện/kịch bản D của báo cáo gốc lượt 1, 2 trong docs/reviews/raw/2026-10-15/ và 2026-10-17/, cùng bảng tổng hợp lượt 1 §5.4/§8–9 và lượt 2 §3/§6.4/§6.6/§6.7/§7/§9. Không dùng báo cáo lượt 3 bên khác. Đọc common/prompt-codex.md, known.md, fixes.md các Issue/PR liên quan, baseline.md và plan.md §L3.2/§L3.5/§L3.6.

Phần sửa chú ý nhất: diff 4217ed4..119e2e4 và commit #669 (1f71029), #693 (f9fb70f), #674 (c5a40e1, phần chữ), #686 (9ac20cf, phần chuẩn hóa UI), #700 (16a28f0), #710 (6526793, câu 9b/5f). Điểm nối đọc thêm: AppData/app-data, tables, personUsage/isPersonInUse, lệnh KYC/khách hàng/cuộc gặp, KycExtraction, PolicyDialog và màn Lịch hẹn/Thùng rác qua test.

| File tại SHA ghim | Dòng | Loại |
|---|---|---|
| apps/desktop/index.html | 1–13 | product |
| apps/desktop/src/App.tsx | 1–18 | product |
| apps/desktop/src/i18n/index.test.ts | 1–141 | test |
| apps/desktop/src/i18n/index.ts | 1–132 | product |
| apps/desktop/src/i18n/vi.ts | 1–1308 | product |
| apps/desktop/src/index.css | 1–2 | product |
| apps/desktop/src/main.tsx | 1–47 | product |
| apps/desktop/src/routes/Screen.tsx | 1–21 | product |
| apps/desktop/src/routes/customers/CustomerAppointments.tsx | 1–153 | product |
| apps/desktop/src/routes/customers/CustomerDialogs.tsx | 1–517 | product |
| apps/desktop/src/routes/customers/CustomerKyc.tsx | 1–309 | product |
| apps/desktop/src/routes/customers/CustomerProfile.tsx | 1–288 | product |
| apps/desktop/src/routes/customers/CustomersScreen.test.tsx | 1–11 | test |
| apps/desktop/src/routes/customers/CustomersScreen.tsx | 1–307 | product |
| apps/desktop/src/routes/customers/KycDialogs.tsx | 1–542 | product |
| apps/desktop/src/routes/customers/customers-view.test.ts | 1–294 | test |
| apps/desktop/src/routes/customers/customers-view.ts | 1–180 | product |
| apps/desktop/src/routes/customers/kyc-view.test.ts | 1–505 | test |
| apps/desktop/src/routes/customers/kyc-view.ts | 1–299 | product |
| apps/desktop/src/routes/team/PersonDialogs.tsx | 1–218 | product |
| apps/desktop/src/routes/team/TeamDialogs.tsx | 1–101 | product |
| apps/desktop/src/routes/team/TeamScreen.tsx | 1–311 | product |
| apps/desktop/src/routes/team/team-view.test.ts | 1–181 | test |
| apps/desktop/src/routes/team/team-view.ts | 1–143 | product |
| apps/desktop/src/shell/AppShell.tsx | 1–95 | product |
| apps/desktop/src/shell/CloseGuard.tsx | 1–82 | product |
| apps/desktop/src/shell/ErrorBoundary.tsx | 1–49 | product |
| apps/desktop/src/shell/RePicker.tsx | 1–88 | product |
| apps/desktop/src/shell/SaveWarning.test.tsx | 1–20 | test |
| apps/desktop/src/shell/SaveWarning.tsx | 1–21 | product |
| apps/desktop/src/shell/ScopeContext.tsx | 1–24 | product |
| apps/desktop/src/shell/ScopePicker.tsx | 1–61 | product |
| apps/desktop/src/shell/Sidebar.tsx | 1–58 | product |
| apps/desktop/src/shell/StartupError.tsx | 1–18 | product |
| apps/desktop/src/shell/block-reload.test.ts | 1–165 | test |
| apps/desktop/src/shell/block-reload.ts | 1–62 | product |
| apps/desktop/src/shell/close-guard.test.ts | 1–118 | test |
| apps/desktop/src/shell/close-guard.ts | 1–35 | product |
| apps/desktop/src/shell/routes.test.ts | 1–93 | test |
| apps/desktop/src/shell/routes.ts | 1–77 | product |
| apps/desktop/src/shell/scope.test.ts | 1–157 | test |
| apps/desktop/src/shell/scope.ts | 1–75 | product |
| apps/desktop/src/shell/screen-error.test.ts | 1–21 | test |
| apps/desktop/src/shell/screen-error.ts | 1–17 | product |
| apps/desktop/src/shell/startup-error.test.ts | 1–106 | test |
| apps/desktop/src/shell/startup-error.ts | 1–50 | product |
| apps/desktop/src/shell/useRoute.ts | 1–45 | product |
| apps/desktop/src/ui-choices.test.tsx | 1–30 | test |
| packages/ui/src/components/Button.tsx | 1–28 | product |
| packages/ui/src/components/Chart.tsx | 1–68 | product |
| packages/ui/src/components/Choices.tsx | 1–75 | product |
| packages/ui/src/components/DataTable.tsx | 1–230 | product |
| packages/ui/src/components/Dialog.tsx | 1–94 | product |
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
| packages/ui/src/components/dialog-focus.test.ts | 1–39 | test |
| packages/ui/src/components/dialog-focus.ts | 1–23 | product |
| packages/ui/src/components/show-more.test.ts | 1–53 | test |
| packages/ui/src/components/show-more.ts | 1–25 | product |
| packages/ui/src/fonts.css | 1–140 | product |
| packages/ui/src/index.ts | 1–17 | product |
| packages/ui/src/theme.css | 1–80 | product |
| packages/ui/src/token-guard.test.ts | 1–108 | test |
| packages/ui/src/token-guard.ts | 1–77 | product |
| packages/ui/src/tokens.css | 1–69 | product |

## 4. Kịch bản mới đã thử

Mọi UI chạy trên snapshot với alias source về snapshot, Vite 127.0.0.1:4296, Edge 1440×900 hoặc 1100×900. Ghìm ngày 15/09/2026 chỉ cho test hành vi, khai rõ VITE_DEMO_ANCHOR=15/09/2026; không lấy bundle dev làm số nền. Mọi context chặn mọi hostname ngoài 127.0.0.1 và thay window.open trước điều hướng đầu. Dữ liệu đi qua UI hoặc fixture dựng bằng openAppData/run/exportBackup rồi nhập qua Cài đặt, không chèn SQL thô để kết luận màn.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Team mới chưa TL → Enter ở + Thêm TL → thêm TL → Sửa → 9b Đóng → Sửa → xóa TL → xóa team | Thêm TL và xóa TL: BODY cả hai lần chạy. Đóng 9b trả đúng Sửa. Xóa team còn team khác trả nút Xóa team tái dùng; không ghi ca này là lỗi | CX3-D1 |
| N2 (kiểm lại) | Sửa tên thành bản nháp → 5f → Hủy → Escape | Bản nháp còn, Escape trả Sửa hồ sơ; 5f không còn câu KYC không bao giờ xóa | — |
| N3 | Thêm giá trị chữ liền vào dữ kiện đang soạn 7a, rồi lưu và xem ở 1100/1440; thử đúng URL 108 ký tự của PR #669 | 7a tràn và Bỏ ra ngoài phần nhìn thấy. Sau lưu, hồ sơ cùng chuỗi không tràn; phân biệt với đường DR6-82 đã sửa | CX3-D2 |
| N4 | Tên KH có 50 emoji, đổi 1100 ↔ 1440 | Trang không tràn ngang, nút vẫn trong viewport; không suy mọi Unicode đều lỗi | — |
| N5 | 5 KH đã xóa có lịch MET/KYC, cùng IS phối hợp+đánh giá; thêm 1 KH sống của RE khác → 9b → khôi phục 1 KH → xóa lại → dọn sạch → 9b; xuất/đọc lại backup sau dọn | RE 5 lịch→0, Xóa tắt→bật. IS 6 phối hợp/6 đánh giá→1/1, Xóa vẫn tắt, hết câu KH đã xóa. Ba tên + 2 KH khác đúng. Số sống trước/sau 1 team/3 người/1 KH/1 lịch/0 HĐ; backup đọc lại cùng số | — |
| N6 | KH vừa khôi phục ở N5 → mở 5f | Đúng 1 lịch (1 đã gặp · 1 RF), 0 HĐ, 1 ghi chú KYC; so countCustomerRecords do fixture AppData ghi. Không câu giữ KYC vĩnh viễn | — |
| N7 | Tên team chỉ U+3164/NEL/VS16/U+2800; tên D+NEL+Team+U+3164 trùng D Team | Trường báo Chưa nhập tên / Đã có team D Team; không tạo team. Ghi chú fixture giữ ba dòng từ NEL/U+2028; 6+U+3164+tỷ lưu chuẩn hóa | — |
| N8 | Thu nhập năm/Tổng tài sản/Nợ phải trả × 6+U+3164+tỷ, 1+NEL+tỷ+U+034F+2, Khoảng 12 tỷ | Chín tổ hợp: đọc 6 tỷ/1,2 tỷ, có describedby; chữ tự do không hint/describedby; không ép chữ thành số | — |
| N9 | Khởi động với IPC giả FILE_IN_USE, ACCESS_DENIED, ALREADY_OPEN | Hiện đúng trang lỗi và câu đóng cửa sổ; ALREADY_OPEN nói đóng cả hai nếu cửa sổ kia lỗi. Không thao tác file/key thật | — |
| N10 | Sửa tên KH thành D + 80 chữ x liền, đổi 1100 ↔ 1440 | document.scrollWidth=1587; nút + Ghi chú KYC ở x=1475,8…1586,6, nằm ngoài cửa sổ ở cả hai cỡ | CX3-D3 |

Nguồn: new-ui.mjs/json (N1–4), fixture.mjs + trash-fixture.json + hai backup (N5–7 phần dữ liệu), new-ui2.mjs/json (N5–8 phần màn), new-ui3.mjs/json và new-ui3-fixed.log (N3 URL108, N9–10). Tên ca N3-link108 có chars=108 trong JSON cuối. Bản chạy đầu của new-ui3.log lỗi selector main/role=alert đã được loại; không tính là lỗi app.

## 5. Phát hiện mới

### CX3-D1 — Thêm hoặc xóa TL làm mất focus tại màn Team

- ID: CX3-D1
- Mức: Low
- Trục: A
- Vị trí: apps/desktop/src/routes/team/TeamScreen.tsx:188, :195, :206 (119e2e4)
- Tình trạng: CONFIRMED
- Liên quan: DR6-83 (biến thể ngoài danh sách Issue #655) · có từ trước, lượt 1–2 bỏ sót
- Kịch bản: N1
- Mô tả: màn không đặt DialogFocusFallback quanh các hộp nhân sự. Lưu TL từ + Thêm TL, hoặc xóa TL chưa có dữ liệu, gỡ nút mở nhưng không chuyển focus tới đích còn tồn tại.
- Tái hiện / bằng chứng: node D/new-ui.mjs; new-ui.json: N1-add-TL-opener-disappears và N1-delete-TL đều active.tag=BODY, id rỗng. Mở và lưu/xóa bằng Enter trên nút; chạy lại vẫn đúng. Đóng 9b trả về Sửa, nên không kết luận tất cả thao tác đóng đều sai.
- Ảnh hưởng: người dùng bàn phím/trình đọc màn hình mất vị trí sau thao tác nhân sự thông thường; dữ liệu không sai.
- Đề xuất: đặt fallback ở tiêu đề khung thành viên hoặc nút + Nhân sự, thêm kiểm focus cho +TL/xóa nhân sự. Khoảng 10–25 dòng SP, dưới 400.

### CX3-D2 — Hàng dữ kiện đang soạn vẫn tràn hộp 7a với link dài

- ID: CX3-D2
- Mức: Low
- Trục: E
- Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:324–327 (119e2e4)
- Tình trạng: CONFIRMED
- Liên quan: DR6-82 (biến thể hàng dữ kiện trước lưu, ngoài phần thân hồ sơ đã sửa) · có từ trước, lượt 1–2 bỏ sót
- Kịch bản: N3
- Mô tả: hai ô flex-1 không có min-w-0/ngắt chuỗi liền, làm huy hiệu và Bỏ bị đẩy ra ngoài hộp khi thêm một giá trị chữ hợp lệ. Test PR lưu ngay sau Thêm dữ kiện nên chỉ đo đường hồ sơ đã sửa.
- Tái hiện / bằng chứng: node D/new-ui3.mjs (new-ui3-fixed.log, new-ui3.json), dùng đúng URL Facebook 108 ký tự của e2e/customer-kyc.spec.ts:51. Chọn Nơi sinh sống, dán URL, Thêm dữ kiện. Ở cả 1100/1440: dialog clientWidth=446, scrollWidth=705; mép hộp 774/944, mép phải nút Bỏ 1031,8/1201,8 (vượt 257,8 px). draft-link108.png đã lưu; draft-long.png với chuỗi 128 ký tự đã xem, nút Bỏ bị cắt. Sau lưu cùng chuỗi dài, trang hồ sơ không tràn (new-ui.json).
- Ảnh hưởng: khó xem/xóa dữ kiện đang soạn bằng chuột trước lưu; chỉ hiển thị, có thể Tab hoặc cuộn hộp, không mất dữ liệu.
- Đề xuất: cho cột giá trị co và wrap-anywhere, giữ badge/Bỏ không bị đẩy khỏi hộp; e2e đo cả trạng thái trước lưu. Khoảng 3–10 dòng SP, dưới 400.

### CX3-D3 — Tên KH liền dài đẩy các nút của hồ sơ ra ngoài cửa sổ

- ID: CX3-D3
- Mức: Low
- Trục: E
- Vị trí: apps/desktop/src/routes/customers/CustomerProfile.tsx:141–154 (119e2e4)
- Tình trạng: CONFIRMED
- Liên quan: DR6-82 (biến thể ở đầu hồ sơ) · có từ trước, lượt 1–2 bỏ sót
- Kịch bản: N10
- Mô tả: hàng tên, badge, ngày và bốn nút là một flex không wrap; tên không có cách co/ngắt một từ dài. Form cho lưu tên đó nên một chuỗi liền dài khiến chính hàng thao tác vượt bề rộng cửa sổ.
- Tái hiện / bằng chứng: node D/new-ui3.mjs, new-ui3.json. Sửa hồ sơ KH sống thành D + 80 chữ x qua UI, Lưu. 1100 và 1440 đều document.scrollWidth=1587; nút + Ghi chú KYC nằm x=1475,8…1586,6. header-latin.png lưu bằng probe. Đối chứng 50 emoji ở N4 không tràn.
- Ảnh hưởng: tên dài/dán nhầm một chuỗi liền khiến các nút cần cuộn ngang mới thấy; không sai dữ liệu. Điều kiện hiếm, không nâng mức do thao tác có đường vòng.
- Đề xuất: cho vùng tên co/ngắt chữ và hàng thao tác xuống dòng khi cần, giữ đủ tên và nút; thêm ca viewport 1100/1440. Khoảng 5–20 dòng SP, dưới 400, không đổi luật tên/golden.

Không có Critical/High/Medium/Nit mới. Không ghi lại KNOWN thành ID: scroll-padding dưới header sticky, nút tái dùng khi đổi lịch, bộ lọc timeline, mã F timeline, viền tương phản, Chart thiếu bảng cho trình đọc màn hình, ký hiệu i18n và export/code lặp hoãn vẫn theo known.md.

## 6. Bloat

| Đã chạy/đọc | Phạm vi/dữ liệu | Số/kết quả | ID |
|---|---|---|---|
| tsc --noEmit --noUnusedLocals --noUnusedParameters | app và UI, cấu hình hiện có | Cả hai exit 0, không diagnostic (tsc-app.log/tsc-ui.log) | — |
| codemap.mjs --check | repo tại SHA ghim | exit 0, không sửa codemap | — |
| pnpm lint:deps | apps/packages | 0 vi phạm, 320 module/1312 dependency | — |
| bloat.mjs: AST export, ứng viên dùng ít, rà lại nơi dùng | 76 file D, đối chiếu nguồn sản phẩm | 154 export gồm type; COUNT_SLOTS/fillSlots/SaveFailed dùng nội bộ; PLAIN_SLOTS là KNOWN DR6-66 | — |
| Quét khóa i18n tĩnh + tiền tố động, đọc catalogue và test slot | vi.ts ↔ nguồn app/packages | 1159 khóa, 0 ứng viên khóa không dùng. Đây là quét ứng viên; birth.error.empty không tới được đã KNOWN | — |
| Dependency UI, code lặp, diff mới | React/TanStack/ECharts/domain; form/helper mới | Mỗi dependency có dùng. ALERT/CARD/badge lặp đã KNOWN DR6-67; không đề xuất dọn mới khi chưa có lợi ích đo được | — |
| Bundle tham chiếu, không tự dựng lại | common/baseline.md, bản release đúng SHA | index.js 927932 B / gzip 271662 B; index.css 28484/6443 B; tổng JS/CSS 2400393/706754 B. So lượt 2: +18357/+4645 B cho toàn app, không quy hết cho D | — |

Không phát hiện B mới. Không thêm công cụ/dependency, không chạy pnpm install trong bản chép, không coi export dùng nội bộ/test là code chết.

## 6b. Hiệu năng

Tự đo bằng node D/perf.mjs lúc 2026-10-20 19:11:06 +07:00, máy DESKTOP-KDURKJP, Node v24.20.0. Đọc bộ tải lượt 3 qua AppData.readBackup/importBackup; tables hash 1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f đúng §L3.6. Số sống 1481 KH/10255 lịch/51 nhân sự/4 team; KH nhiều lịch nhất 01K7C4NNGTXFVA2EJV1SGE9060.

Cùng phương pháp Vite runnerImport của chính Codex D lượt 2, 10 warmup + 100 lần/hàm, tables đã đọc. Lúc đo các unit/e2e/mutation của phiên đã xong; chỉ Vite 4296 rảnh. Không kiểm soát mọi tiến trình/hoạt động ngoài phiên. Luật nhiễu: tăng quá 20% VÀ quá 10 ms.

| Phép đo | Lần | Trung vị ms | Min–max ms | Lượt 2 ms | Δ ms | Xấu hơn? |
|---|---:|---:|---|---:|---:|---|
| customerBoard.all | 100 | 1,607 | 1,453–4,553 | 1,550 | 0,057 | không |
| customerBoard.team | 100 | 0,450 | 0,436–0,898 | 0,439 | 0,011 | không |
| staffMetrics.44-RE | 100 | 8,575 | 8,197–13,008 | 7,075 | 1,500 | không |
| groupByTeam | 100 | 0,005 | 0,004–0,072 | 0,004 | 0,002 | không |
| reOptions | 100 | 0,026 | 0,025–0,097 | 0,026 | 0,000 | không |
| kycOverview.max-appointments-profile | 100 | 0,006 | 0,003–0,044 | 0,004 | 0,002 | không |
| kycTimeline.max-appointments-profile | 100 | 0,024 | 0,021–0,068 | 0,023 | 0,001 | không |

Các số trên là hàm thuần, không phải click→paint. staffMetrics +21,2% nhưng chỉ +1,5 ms, chưa vượt luật nhiễu. Không có phát hiện P.

Số UI/exe dưới đây dùng lại cổng chuẩn common/baseline.md, không giả là số tự đo ở D. Không đo exe khi hidden, không lấy Vite dev làm kết luận hiệu năng release.

| Thao tác | 119e2e4 (baseline) | Sau #656 | Lượt 2 cùng máy | Ngưỡng |
|---|---:|---:|---:|---|
| customers.view-table | 19 ms | 20 ms | 19 ms | <200 ms |
| customers.sort-name | 22 ms | 23 ms | 22 ms | <200 ms |
| customer.open-ai | 19 ms | 19 ms | 18 ms | <200 ms |
| reload.customers | 307 ms | 336 ms | 272 ms | <500 ms |
| reload.team | 348 ms | 355 ms | 311 ms | <500 ms |
| app.open-data (điểm nối, B/F) | 373 ms | 387 ms | 301 ms | ≤600 ms |

Không dòng nào xấu hơn mốc sau #656. So lượt 2, app.open-data tăng 72 ms/24% do chi phí integrity_check đã được K24 chấp nhận; reload.customers/team tăng 35/37 ms nhưng dưới 20%. Không tạo phát hiện mới từ cờ đã được giải thích ở baseline. Dọn sạch: baseline 151,8 ms tới 11j và 38,9→9,6 ms mở Thùng rác trước/sau; chỉ tham chiếu cho điểm nối N5, không đo lại ở D và không tự đặt ngưỡng cho thao tác này.

## 7. Bảng đếm mức × trục

Chỉ đếm phát hiện mới, không đếm bảng R/KNOWN.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 3 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

CONFIRMED 3/3, PLAUSIBLE 0. Không có tỉ lệ PLAUSIBLE cao. Cả ba có từ trước và chưa được hai lượt cũ ghi; không gán nhầm là hồi quy do đợt sửa lượt 2.

## 8. Đã xét, không thấy theo từng trục

| Trục | Đã đọc/chạy, kết quả và giới hạn |
|---|---|
| R | Đủ 10 dòng. 20 mutant bị giết bằng assertion, không sống. Đối chứng đầu 169 unit/145 e2e, cuối 208 unit/9 e2e. Tài liệu R96 đối chiếu chữ và luồng, không cần mutation code |
| E | N1–N10, biên parseBirthDate/parseRecordDate, các cỡ dữ liệu rỗng/100/Hiện thêm và lựa chọn team/scope trong test. Có CX3-D2/D3, không thấy lỗi biên mới khác |
| C | 5a–5f, 7a–7e, 9a–9c, B1/B2, 11f và câu mới 9b/5f, headerHidden, ý nghĩa nhãn lịch. N5/N6 số đếm khớp lệnh. Giữ các lệch mockup đã được Owner chấp nhận; không đổi spec/golden cho khớp code |
| D | 11 đường ghi form qua data.run; fixture AppData và N5 khôi phục/xóa/dọn/backup giữ đúng số sống, KYC chuẩn hóa. Không phát hiện dữ liệu sai/mất mới; không mở rộng kết luận ra mọi bất biến A/B |
| G | Đọc điểm nối ConfirmFactDialog/FactValue/NoteEvent: đề xuất cần xác nhận, không tự ghi KYC, preview/lưu cùng helper. Không gọi AI thật; guardrail tổng thể thuộc C |
| S | Router decode hash, localStorage try/catch, i18n fillSlots sở hữu riêng, JSX text, encodeHtml Chart, AppData write lock. Browser chặn mạng/đổi window.open từ đầu, IPC lỗi giả không chạm key. Không thấy ranh giới mới bị vượt |
| P | Bảng 6b: 7 phép đo tải, không vượt luật nhiễu; baseline release trong ngưỡng và không xấu hơn mốc sau #656. Không suy click→paint từ Node |
| B | Bảng 6: noUnused/codemap/deps/AST/i18n/diff, các ứng viên dùng nội bộ hoặc KNOWN; không bloat mới có chi phí rõ |
| T | Đọc 19 test D, test sửa tại điểm nối; 20 mutant đều có lỗi assertion thật, control cuối xanh. Không thêm DOM lib/công cụ. Test hiện chưa giữ hai vùng tràn và các đường TL mới: bằng chứng chức năng đã ghi D1–D3, không tạo ID test trùng |
| A | Tab/Enter/Escape, bẫy modal, trả focus, describedby/required/error, columnheader ẩn, scroll tới thẻ. Có CX3-D1; sticky header che đích, Chart thiếu bảng và contrast viền là KNOWN, không có bằng chứng mới |

## 9. Phụ lục: lệnh, đột biến, trạng thái cuối

Các đường D/ dưới đây là C:/workspace/deep-review-1-6-r3/codex/D/; node CLI và dependency dùng từ repo gốc. Snapshot không chạy pnpm install; junction chỉ trỏ từ snapshot tới node_modules đã có. Vite/Vitest alias @p2c về source snapshot; không đụng junction của repo. Không dùng cổng 4173 hoặc PW_REUSE.

| Lệnh/nguồn | Kết quả/log |
|---|---|
| inventory.mjs; setup.mjs | 743 file tracked chép; 76 file D. inventory.json, scope.tsv; alias và fixture safety của 12 spec |
| node D/serve.mjs | Vite 127.0.0.1:4296, ghim 15/09/2026; serve.log; server riêng đã dừng |
| node <repo>/node_modules/vitest/vitest.mjs run --config D/vitest.config.mjs <19 test D> | unit-control.log: 19 file/169 test PASS |
| node <repo>/node_modules/@playwright/test/cli.js test --config D/playwright.config.mjs | e2e-control.log: 145 PASS, 12 spec, 1 worker, 3,2 phút. Bản dev chép, không giả là chạy lại toàn cổng release |
| node D/mutations.mjs unit; e2e; e2e R83-Dialog/R100-old | mutations-unit/e2e/e2e-extra.json; mutations/<ID>/run.log và mutant.txt; bảng dưới |
| node D/fixture.mjs | fixture.log, trash-fixture.json, trash-fixture.p2cbackup, trash-after.p2cbackup; toàn bộ qua openAppData/run/purgeTrash/exportBackup/readBackup |
| node D/new-ui.mjs; new-ui2.mjs; new-ui3.mjs | JSON/log/ảnh của N1–N10; mọi browser có safety ngay từ lần chạy đầu |
| node D/perf.mjs; bloat.mjs | node-perf.json/log, bloat.json/log, source-sha256.tsv; hash tải đúng |
| tsc -p apps/desktop/tsconfig.json và packages/ui/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters | tsc-app.log, tsc-ui.log, exit0 |
| node tools/codemap.mjs --check; pnpm lint:deps | codemap.log, deps.log, exit0 |
| Chạy lại 19 test D + text.test.ts + team.test.ts, sau restore | unit-final.log: 21 file/208 test PASS |
| Chạy lại các e2e bị mutant giết sau restore | e2e-final.log: 9 PASS (17,5 s); không lặp lại toàn bộ cổng khi không cần |
| node D/finalize.mjs | source-final.json: 76 file D và KycExtraction snapshot nguyên byte; repo diff rỗng; SHA/status đầu-cuối giống nhau |

### 9.1 Đột biến

Mỗi ca sửa đúng một file snapshot rồi trả nguyên byte trong finally. Tất cả 20/20 KILLED, 0 SURVIVED. Log chứa assertion cụ thể; không dùng lỗi compile/import/timeout harness để ghi KILLED.

| ID | Thay đổi trên snapshot | Test giết / bằng chứng |
|---|---|---|
| R72 | Bỏ DI/U+2800/White_Space mới | KILLED; ; mutations/R72/run.log |
| R75 | Trả vi.ts về trước PR #674 | KILLED; ; mutations/R75/run.log |
| R80 | Dùng câu hỗ trợ chung cho reviewer/coordinator | KILLED; ❯ apps/desktop/src/routes/team/team-view.test.ts (11 tests / 1 failed) 9ms; Test Files  1 failed (1); Tests  1 failed / 10 passed (11); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯; mutations/R80/run.log |
| R83-focus | Không gọi fallback ở helper | KILLED; ❯ packages/ui/src/components/dialog-focus.test.ts (4 tests / 2 failed) 6ms; Test Files  1 failed (1); Tests  2 failed / 2 passed (4); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯; mutations/R83-focus/run.log |
| R90-BR3 | Bỏ checkbox khỏi selector miễn trừ | KILLED; ❯ apps/desktop/src/shell/block-reload.test.ts (7 tests / 1 failed) 8ms; Test Files  1 failed (1); Tests  1 failed / 6 passed (7); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯; mutations/R90-BR3/run.log |
| R101 | Bỏ normalizeText trước parseVnd | KILLED; ❯ apps/desktop/src/routes/customers/kyc-view.test.ts (26 tests / 1 failed) 12ms; Test Files  1 failed (1); Tests  1 failed / 25 passed (26); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯; mutations/R101/run.log |
| R81 | Bỏ scrollTo | KILLED; 1 failed; mutations/R81/run.log |
| R82-note | Bỏ wrap-anywhere ghi chú | KILLED; 1 failed; mutations/R82-note/run.log |
| R82-fact | Bỏ wrap-anywhere dữ kiện | KILLED; 1 failed; mutations/R82-fact/run.log |
| R83-7a | Bỏ focus Trường trước Bỏ dữ kiện | KILLED; 1 failed; mutations/R83-7a/run.log |
| R90-team | Lỗi DATA_REPLACING cũng khóa Xóa team | KILLED; 1 failed; mutations/R90-team/run.log |
| R90-person | Lỗi DATA_REPLACING cũng khóa Xóa nhân sự | KILLED; 1 failed; mutations/R90-person/run.log |
| R90-note | Gõ ghi chú không xóa errors.form | KILLED; 1 failed; mutations/R90-note/run.log |
| R90-day | Gõ ngày không xóa errors.form | KILLED; 1 failed; mutations/R90-day/run.log |
| R90-add | Lỗi Thêm dữ kiện xóa lỗi Ngày/Ghi chú | KILLED; 1 failed; mutations/R90-add/run.log |
| R100-customer | Hiện tiêu đề Thao tác ra màn | KILLED; 1 failed; mutations/R100-customer/run.log |
| R100-team | Hiện tiêu đề Thao tác ra màn | KILLED; 1 failed; mutations/R100-team/run.log |
| R83-Dialog | Dialog không truyền fallback tới cleanup | KILLED; 1 failed; mutations/R83-Dialog/run.log |
| R100-old-customer | Trả tiêu đề cột về rỗng | KILLED; 1 failed; mutations/R100-old-customer/run.log |
| R100-old-team | Trả tiêu đề cột về rỗng | KILLED; 1 failed; mutations/R100-old-team/run.log |

### 9.2 Giới hạn và harness

- Không chạy lại toàn pnpm verify/coverage/e2e/Rust/build: các cổng đúng SHA có trong baseline; chạy kiểm tra phù hợp D và test đột biến ở trên. Không đo lại exe hoặc thiết bị phím/chuột vật lý; số exe ghi rõ là tham chiếu.
- Ba lỗi harness đã sửa và giữ log: inventory.mjs ban đầu dùng đường C: trong ESM (đổi file:///); CLI dependency-cruiser trực tiếp sai đường dẫn (chạy pnpm lint:deps chuẩn, exit0); new-ui/new-ui3 ban đầu dùng nhãn Lưu thay đổi / role main sai (đổi Lưu và locator main, chạy lại). Một lệnh ghi tiến độ PowerShell lỗi nội suy stamp: đã sửa bằng tên biến có ngoặc. Không xem các lỗi này là phát hiện app hoặc test giết mutant.
- Dev server chỉ phục vụ thử hành vi; VITE_DEMO_ANCHOR khai rõ. Không tạo bundle mới để so sai với baseline release. Network route và window.open giả có ở mọi context/spec kể cả lượt harness đầu lỗi.
- Không có bước bị automatic approval review chặn; mọi ghi ngoài repo đều ở đường dẫn Owner chỉ định. Không cài công cụ hay sửa mockup/spec.
- Đã xem draft-long.png; ảnh draft-link108.png và header-latin.png được probe lưu. JSON/bounding boxes là bằng chứng chính của phép đo layout.

### 9.3 Kết thúc

- SHA: 119e2e45cbce54d8a3943757bd826a7f1e9b694f.
- git diff --exit-code: exit0; 76 file D và KycExtraction snapshot bằng nguyên byte source. source-final.json giữ SHA-256 từng file; không patch repo.
- git status --short cuối, giống đầu:

    ?? .agents/
    ?? .codex/
    ?? AGENTS.md

- Server probe riêng 4296, PID 24332 đã được xác minh command line thuộc D/serve.mjs rồi dừng; không có listener còn lại trên cổng đó. Mọi browser probe đã đóng trong finally.
- Giờ xong: 2026-10-20 19:19:46 +07:00.
- Báo cáo chỉ kết luận gói D; không tổng hợp với bên khác, không kết luận phát hành, không tạo Issue/PR hay đề xuất merge. Gói tiếp theo E mở phiên mới.
