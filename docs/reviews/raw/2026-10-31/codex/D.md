XONG — codex gói D lượt 4, 2026-10-29 13:54:05 +07:00

## 1. Thông tin phiên

- Bên: Codex; gói D — Màn nhập liệu; lượt 4, làm mới.
- SHA đầu phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076`, đúng SHA ghim; `git status --short` đầu phiên rỗng.
- Bắt đầu **2026-10-29 09:01:07 +07:00**; tiếp tục lúc **13:44 +07:00** theo yêu cầu Owner sau khi bộ duyệt ghi file báo hết hạn mức. Xong **2026-10-29 13:54:05 +07:00**, Asia/Bangkok. Phần trình duyệt hoàn tất trước gián đoạn; unit được rà soát bổ sung sau khi tiếp tục.
- Công cụ: Codex desktop; `codex-cli 0.162.1` qua `codex --version`; Node v24.20.0, Edge/Playwright có sẵn. Prompt Owner chọn GPT Sol 6.1; môi trường công cụ chỉ cho biết Codex dựa trên GPT-6, không cung cấp API xác nhận tên model triển khai cụ thể hay mức suy luận. Không tự suy đoán.
- Lệnh đầu chỉ đọc `C:\workspace\deep-review-1-6-r4\common\prompt-codex.md`. Bước 0: D chưa có, A/B/C có dòng đầu XONG. Chỉ đọc dòng đầu A–C, không đọc nội dung báo cáo lượt 4 khác.
- Repo chỉ đọc; không sửa sản phẩm, commit, Issue, PR, gh hay dịch vụ AI. Probe/bản chép/log ở `C:\workspace\deep-review-1-6-r4\codex\D\`. Nhật ký ghi dần trước biên tập giữ tại `D/progress.md`.
- Kết quả D: **12/12 R1 và 16/16 R2 ĐÃ SỬA trong phạm vi D**; hai phát hiện mới **Low/E**, đều CONFIRMED. Không kết luận sẵn sàng phát hành thay gói F.

## 2. Bảng R1 và R2

“ĐÃ SỬA” áp vào mô tả cũ và phần giao diện D. Ranh giới gói khác ghi ngay trong bảng; biến thể mới còn hở ghi riêng ở mục 5.

Control cuối sau khi khôi phục mọi đột biến: **29 file/575 test unit qua; 115 test e2e qua**, exit 0. Có **27 phép gỡ phần sửa**, đều làm cổng tương ứng đỏ: **23 đột biến hành vi và 4 phép kiểm cấu trúc tương đương hành vi**. Không gọi bốn phép kiểm cấu trúc là test hành vi. Lệnh/log ở mục 9.

### R1 — 12 dòng

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-109 | #721 → #738 | ĐÃ SỬA | CustomerDialogs gửi tên gốc, KycDialogs gửi ghi chú gốc tới lớp lệnh; ca “broken in a paste” của customer-forms/customer-kyc qua. R109-name/R109-note chuẩn hóa trước lệnh làm e2e đỏ. | N5 thử BOM+VT/FF và tiền chứa ký tự vô hình. Không nuốt đầu vào lỗi trước kiểm của lệnh. |
| DR6-110 | #721 → #738 | ĐÃ SỬA (D) | birthYear trong customers-view dùng normalizeText; control25 test qua, R110-birth làm2 test đỏ. Domain money/period và nhập ngày/tiền UI qua. | N5: `1tr\u200b5` gợi ý1.500.000₫, lưu1tr5. Parser cùng kiểm A, màn lịch E. |
| DR6-115 | #723 → #744 (+ #788 → #841) | ĐÃ SỬA | Câu9b chỉ nói chuyển lịch Dự kiến sau khôi phục; team-view control13 qua. R115-trash khôi phục câu quá rộng làm3 test đỏ. | N3: bốn KH xóa có lịch vẫn giữ RE; câu đúng, ba tên có mã và1KH khác. |
| DR6-116 | #723 → #744 (+ #788 → #841) | ĐÃ SỬA | DialogFocusFallback tìm tiêu đề thẻ còn tồn tại; e2e DR6-116 qua. R116-fallback bỏ đích dự phòng làm3 ca đỏ. | N3: đổi RE sang IS làm hàng mất, focus H2#team-members-title. Đổi team giữ sort, trở về100 hàng. |
| DR6-117 | #724 → #746 | ĐÃ SỬA (các vùng đã mô tả) | Tên KH81 chữ, nội dung thẻ Lịch hẹn, dữ kiện7a/7c/7d tại1100/1440 qua. R117-name làm Sửa hồ sơ vượt1100; R117-dialogs làm7a tràn161,015625px. | N1: tiêu đề chung Dialog còn tràn, **CXR4-D1**. N2: màn Team ngoài mô tả cũ, **CXR4-D2**. Không gọi biến thể ngoài mô tả là chưa sửa đường cũ. |
| DR6-120 | #726 → #750, #752 → #764 (+ #782 → #807, #783 → #817) | ĐÃ SỬA (D) | SaveWarning/CloseGuard phân biệt file/thư mục chỉ đọc, đầy ổ, lỗi khác; R120-cause làm2 unit đỏ. Save-state và startup error control qua. | N7 đổi DISK_FULL→READ_ONLY→FOLDER_READ_ONLY rồi lưu được, giữ focus đã chuyển. Quyền file thật/Rust thuộc B. |
| DR6-127 | #724 → #746 | ĐÃ SỬA | CustomerKyc giữ wrap-anywhere dòng cuộc gặp; ca108 chữ qua. R127-meeting bỏ class làm timeline tràn185,4375px tại1440. | N6 đổi filter Lịch hẹn/KYC vẫn giữ đề xuất Mock; không lỗi mới ở dòng cuộc gặp. |
| DR6-132 (a) | #729 → #755 (+ #756 → #758) | ĐÃ SỬA | Năm nơi ghi ngoại lệ Dọn sạch: CONTEXT, spec3/5, hướng dẫn05, mockup7a; structural-checks xác nhận. Khớp TR-11/D11, copy app, N9 dọn KH kèm lịch. | Chỉ tài liệu, không cần mutant hành vi. Phần(b) trigger/db-CLAUDE thuộc A. |
| DR6-37 | #655 → #693 (một phần), #790 → #845 | ĐÃ SỬA (D) | Ký hiệu/dấu nối qua khóa i18n; i18n/token-guard control qua. R37-mark đổi dấu hiện diện về literal✓ làm CLI check-tokens đỏ. | Kiểm cấu trúc cho rollback tương đương hành vi, không tuyên bố runtime test phân biệt cùng một dấu. N4 HTML hiện như chữ. |
| DR6-66 | #655 → #693 (một phần), #775 → #801, #777 → #812, #790 → #845 | ĐÃ SỬA (D) | Export đối chiếu callers/codemap; codemap --check qua. R66-export tái export TokenReader làm gate đỏ. | Đã xem PLAIN_SLOTS/chart-theme/index UI; export domain/db/ai và toàn repo thuộc A/C/F. |
| DR6-67 | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | ĐÃ SỬA (D) | classes.ts/money-view.ts/stage-badge.tsx gom chỗ dùng. R67-amount làm1/2 unit đỏ; R67-CARD tái tạo hằng local làm kiểm chấp nhận cấu trúc đỏ. UI/noUnused qua. | Tiền compact/full/bằng nhau, class/badge giữ hành vi. T-305/T-310 nối HEADING/BADGE; không kết luận thay gói khác. |
| CL3-B2 | #783 → #817 | ĐÃ SỬA (D) | Thử lại gọi saves.flush; save-state qua, T294-retry thay promise rỗng làm đỏ. Sidebar lấy cùng trạng thái lưu. | N7 lỗi nhiều nguyên nhân rồi lưu được; N8/N9 đóng giữa thay dữ liệu chờ save mới. Bytes/queue thuộc B. |

### R2 — 16 dòng

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-280 | #735 → #760 | ĐÃ SỬA |9ca topbar-focus qua tại1100/1440: Shift+Tab, heading/lịch/AI link, trong dialog. T280-margin bỏ scroll-margin làm Shift+Tab đỏ.| N3 fallback heading; N7 focus đã rời Thử lại. |
| T-284 | #773 → #795 | ĐÃ SỬA (D) | G3/thẻ#t284 khớp; token control #687890 ở app/mockup; panel/help theo token duyệt. structural-checks/theme qua.| Issue mockup/tài liệu; HĐ8d thuộc E. T-300 kiểm token bằng mutant riêng. |
| T-287 | #776 → #805 | ĐÃ SỬA (D) |9b dùng danh sách tham chiếu db; tên trùng thêm mã, tối đa3ví dụ. T287-codes bỏ mã tên trùng làm1unit đỏ.| N3 nhập4KH trùng có lịch trong rác:3mã khác nhau+1KH khác,4lịch. Chỉ mục/seed/query/đo thuộc A/F. |
| T-291 | #780 → #824, #828 | ĐÃ SỬA (D) | Đọc bảy luật/phần D: Unicode/ngày/tiền/sort; domain bổ sung/form qua. T291-VTFF bỏ VT/FF khỏi LINE_BREAK làm text.test đỏ.| N5 UI: BOM bỏ, VT/FF→LF, tiền vô hình đúng. Luật nhập/precision/output thuộc A/C. |
| T-293 | #782 → #807 | ĐÃ SỬA (D) | AppShell đặt `<Màn> · Heritas L-CRM`; navigation qua. T293-title bỏ setTitle làm đỏ; startup/save cause qua.| Đổi màn/lỗi mở đã kiểm; ACL/backup thật thuộc B. |
| T-294 | #783 → #817, #819 | ĐÃ SỬA (D) | Sidebar Đang lưu/Đã lưu, alert/Thử lại, đóng có guard qua save-state. T294-retry bỏ flush làm đỏ.| N7 giữ focus; N8 backup→save→destroy; N9 backup→save→save→destroy. Native giả kiểm D, file thật thuộc B. |
| T-297 | #786 → #835 | ĐÃ SỬA (D) | Filter timeline, mãF/version, chữ từ chối3f đối chiếu mockup/kyc-view/e2e. T297-filter cho mọi event vào KYC làm đỏ.| N6 Mock, ẩn/hiện giữ2đề xuất. Jobs/provider thuộc C. |
| T-298 | #787 → #838 | ĐÃ SỬA (D) |5d lên/xuống/khóa lý do; thẻ Lịch hẹn một dòng1440, trạng thái/RF; table compact/fixed/width qua customer-forms/appointments/data-table. T298-direction đảo chiều làm đỏ.| Nội dung thẻ dài trong khung. Màn6a/6h/6d/ngày ngoài tháng thuộc E. |
| T-299 | #788 → #841 | ĐÃ SỬA (D) | Hỏi thay đổi nhân sự chưa lưu trước Xóa; T299-ask bỏ hỏi làm đỏ. T299-sort remount Members làm giữ sort đỏ. PeriodPicker/Chart/UI qua.| N3 105RE→Hiện thêm→đổi vai trò→sort giảm→đổi team→reset100, giữ sort. Màn dùng chart/kỳ thuộc E. |
| T-300 | #789 → #843 | ĐÃ SỬA (D) | Viền field/mũi tên unsorted 3:1; table-view/token-guard/favicon/topbar qua. T300-border trả màu cũ làm tương phản đỏ.| Ô khóa border-strong+dashed theo T-303; tooling/helpers thuộc F. |
| T-301 | #790 → #845, #846 | ĐÃ SỬA (D) | Class/tiền/ký hiệu/dead export qua R37/R66/R67; noUnused/codemap qua. Ba gate cấu trúc đỏ khi rollback; R67-amount unit đỏ.| Control115e2e qua; không đổi hành vi/chữ/class ngoài quyết định duyệt. Không đòi behavioral test phân biệt hằng cùng giá trị. |
| T-303 | #797 → #811 | ĐÃ SỬA | Mockup ô khóa border-strong+dashed khớp LOCKED tại appointments-view.ts:63; #contrast ngoài phạm vi Choices. Hai kiểm tài liệu qua.| Chỉ mockup/chữ, không gỡ hành vi app để mutant. |
| T-305 | #849 → #855 | ĐÃ SỬA (D) | HEADING/BADGE chung, badge tiền/số HĐ giữ cỡ. T305-HEADING đưa hằng local về làm kiểm chấp nhận đỏ. Theme/UI/tsc qua.| nHĐ py-0.5 có chủ ý; recordBadge E, đồng hồ chụp F. |
| T-308 | #852 → #861 | ĐÃ SỬA (D) | Brand có tên truy cập, slogan Playfair cục bộ/token; theme1100×700 thấy Cài đặt/trạng thái lưu, title/favicon đúng. T308-font trả sans làm đỏ.| Stat font21.884B/logo149.070B khớp baseline. Icon/exe/config thuộc B. |
| T-310 | #865 → #871 | ĐÃ SỬA (D) | HEADING sót/stageBadge/lang=en/app.title khớp. T310-name đổi title HTML làm tauri-contract đỏ; T310-lang đổi vi làm theme đỏ.|6mockup lang=en; logo copy đúng byte ACCEPTED. PACKAGES nhận file D mới (87file); tooling F. |
| T-311 | #866 → #870 | ĐÃ SỬA (D) |6mockup appointments/customers/customer/team/settings-data/trash có `.brand→CH-09`; NT-CH-09 khớp brand/title/1100×700; structural-checks đủ6dòng.| Chỉ tài liệu. Luật đếm phase-6.md, K21/K31 và tổng hợp thuộc F. |

## 3. Phạm vi đã đọc

`classifyFile` của `tools/size-report-core.mjs` tại SHA ghim: **87 file, 7.999 dòng SP/2.820 dòng test**, khớp baseline. Diff `119e2e4..2e51e25` D: **37 file SP +1.121/−451; 13 file test +697/−42**. Đọc kỹ diff sản phẩm: normalization, focus/scroll, save-state, bảng, timeline, classes/i18n, brand/API UI. Bản diff `D/diff.patch`; dấu vết đọc đánh số `D/read-1.txt`…`D/read-19.txt`.

Danh mục nguồn đã đọc 1–N (N là dòng thực tế, không phải SP trừ dòng trắng). vi.ts tìm thêm từng khóa/callsite; test đọc ca chấp nhận/phần đổi rồi chạy toàn suite D. Không dùng coverage thay kiểm đường đi.

| File | Loại | Dòng đã đọc |
|---|---|---|
| `apps/desktop/index.html` | SP | 1–13 |
| `apps/desktop/src/App.tsx` | SP | 1–18 |
| `apps/desktop/src/i18n/index.test.ts` | Test | 1–209 |
| `apps/desktop/src/i18n/index.ts` | SP | 1–70 |
| `apps/desktop/src/i18n/vi.ts` | SP | 1–1376 |
| `apps/desktop/src/index.css` | SP | 1–20 |
| `apps/desktop/src/main.tsx` | SP | 1–47 |
| `apps/desktop/src/routes/Screen.tsx` | SP | 1–21 |
| `apps/desktop/src/routes/classes.ts` | SP | 1–33 |
| `apps/desktop/src/routes/customers/CustomerAppointments.tsx` | SP | 1–193 |
| `apps/desktop/src/routes/customers/CustomerDialogs.tsx` | SP | 1–523 |
| `apps/desktop/src/routes/customers/CustomerKyc.tsx` | SP | 1–348 |
| `apps/desktop/src/routes/customers/CustomerProfile.tsx` | SP | 1–305 |
| `apps/desktop/src/routes/customers/CustomersScreen.test.tsx` | Test | 1–11 |
| `apps/desktop/src/routes/customers/CustomersScreen.tsx` | SP | 1–302 |
| `apps/desktop/src/routes/customers/KycDialogs.tsx` | SP | 1–554 |
| `apps/desktop/src/routes/customers/customers-view.test.ts` | Test | 1–348 |
| `apps/desktop/src/routes/customers/customers-view.ts` | SP | 1–204 |
| `apps/desktop/src/routes/customers/kyc-view.test.ts` | Test | 1–701 |
| `apps/desktop/src/routes/customers/kyc-view.ts` | SP | 1–392 |
| `apps/desktop/src/routes/money-view.test.ts` | Test | 1–18 |
| `apps/desktop/src/routes/money-view.ts` | SP | 1–13 |
| `apps/desktop/src/routes/stage-badge.tsx` | SP | 1–11 |
| `apps/desktop/src/routes/team/PersonDialogs.tsx` | SP | 1–245 |
| `apps/desktop/src/routes/team/TeamDialogs.tsx` | SP | 1–101 |
| `apps/desktop/src/routes/team/TeamScreen.tsx` | SP | 1–337 |
| `apps/desktop/src/routes/team/team-view.test.ts` | Test | 1–225 |
| `apps/desktop/src/routes/team/team-view.ts` | SP | 1–152 |
| `apps/desktop/src/shell/AppShell.tsx` | SP | 1–99 |
| `apps/desktop/src/shell/Brand.tsx` | SP | 1–32 |
| `apps/desktop/src/shell/CloseGuard.test.tsx` | Test | 1–50 |
| `apps/desktop/src/shell/CloseGuard.tsx` | SP | 1–98 |
| `apps/desktop/src/shell/ErrorBoundary.tsx` | SP | 1–49 |
| `apps/desktop/src/shell/RePicker.tsx` | SP | 1–88 |
| `apps/desktop/src/shell/SaveWarning.test.tsx` | Test | 1–50 |
| `apps/desktop/src/shell/SaveWarning.tsx` | SP | 1–64 |
| `apps/desktop/src/shell/ScopeContext.tsx` | SP | 1–24 |
| `apps/desktop/src/shell/ScopePicker.tsx` | SP | 1–61 |
| `apps/desktop/src/shell/Sidebar.test.tsx` | Test | 1–36 |
| `apps/desktop/src/shell/Sidebar.tsx` | SP | 1–95 |
| `apps/desktop/src/shell/StartupError.tsx` | SP | 1–18 |
| `apps/desktop/src/shell/block-reload.test.ts` | Test | 1–165 |
| `apps/desktop/src/shell/block-reload.ts` | SP | 1–62 |
| `apps/desktop/src/shell/close-guard.test.ts` | Test | 1–118 |
| `apps/desktop/src/shell/close-guard.ts` | SP | 1–36 |
| `apps/desktop/src/shell/routes.test.ts` | Test | 1–93 |
| `apps/desktop/src/shell/routes.ts` | SP | 1–77 |
| `apps/desktop/src/shell/scope.test.ts` | Test | 1–157 |
| `apps/desktop/src/shell/scope.ts` | SP | 1–75 |
| `apps/desktop/src/shell/screen-error.test.ts` | Test | 1–21 |
| `apps/desktop/src/shell/screen-error.ts` | SP | 1–17 |
| `apps/desktop/src/shell/startup-error.test.ts` | Test | 1–106 |
| `apps/desktop/src/shell/startup-error.ts` | SP | 1–50 |
| `apps/desktop/src/shell/useRoute.ts` | SP | 1–45 |
| `apps/desktop/src/ui-choices.test.tsx` | Test | 1–30 |
| `packages/ui/src/components/Button.tsx` | SP | 1–28 |
| `packages/ui/src/components/Chart.tsx` | SP | 1–82 |
| `packages/ui/src/components/Choices.tsx` | SP | 1–75 |
| `packages/ui/src/components/DataTable.tsx` | SP | 1–240 |
| `packages/ui/src/components/Dialog.tsx` | SP | 1–94 |
| `packages/ui/src/components/NavIcon.tsx` | SP | 1–63 |
| `packages/ui/src/components/PeriodPicker.label.test.ts` | Test | 1–26 |
| `packages/ui/src/components/PeriodPicker.label.ts` | SP | 1–21 |
| `packages/ui/src/components/PeriodPicker.tsx` | SP | 1–191 |
| `packages/ui/src/components/PolicyBadge.tsx` | SP | 1–13 |
| `packages/ui/src/components/Segmented.tsx` | SP | 1–64 |
| `packages/ui/src/components/SelectField.tsx` | SP | 1–87 |
| `packages/ui/src/components/StageBadge.tsx` | SP | 1–22 |
| `packages/ui/src/components/TextField.tsx` | SP | 1–99 |
| `packages/ui/src/components/chart-theme.test.ts` | Test | 1–47 |
| `packages/ui/src/components/chart-theme.ts` | SP | 1–57 |
| `packages/ui/src/components/compare-cells.test.ts` | Test | 1–55 |
| `packages/ui/src/components/compare-cells.ts` | SP | 1–38 |
| `packages/ui/src/components/dialog-focus.test.ts` | Test | 1–39 |
| `packages/ui/src/components/dialog-focus.ts` | SP | 1–23 |
| `packages/ui/src/components/field-notes.test.ts` | Test | 1–39 |
| `packages/ui/src/components/field-notes.ts` | SP | 1–25 |
| `packages/ui/src/components/show-more.test.ts` | Test | 1–53 |
| `packages/ui/src/components/show-more.ts` | SP | 1–25 |
| `packages/ui/src/components/table-view.test.ts` | Test | 1–71 |
| `packages/ui/src/components/table-view.ts` | SP | 1–55 |
| `packages/ui/src/fonts.css` | SP | 1–153 |
| `packages/ui/src/index.ts` | SP | 1–17 |
| `packages/ui/src/theme.css` | SP | 1–98 |
| `packages/ui/src/token-guard.test.ts` | Test | 1–152 |
| `packages/ui/src/token-guard.ts` | SP | 1–85 |
| `packages/ui/src/tokens.css` | SP | 1–76 |

| Nguồn bổ sung | Phần đã xem / mục đích |
|---|---|
| CLAUDE.md gốc/package, CONTEXT.md | Ranh giới UI/data, giả lập, KYC chỉ thêm/ngoại lệ dọn; không nghi thức phát triển. |
| docs/design/phase-3-du-lieu.md | §3 people/customer/KYC; §4 dòng169–193 lệnh; §6 dòng203–236 bảy luật nhập. |
| docs/design/phase-4-chi-so.md | §3–4.5 dòng62–204: miền năm/trần3tháng/so kỳ/Chart/PeriodPicker; không thay E. |
| docs/design/phase-6-hoan-thien.md | §4.1–4.2 dòng52–208: S2-6/TR-1…13/D1…13; §5 dòng263–282 cổng/ngưỡng. |
| ADR-0013 | UI/i18n, phụ lục brand27/10, token/logo/tên app/font. |
| docs/design/mockups/ | README; index#t284/#contrast; customers/customer; forms5a/5c/5d/5e; KYC7a/7c/7d; team9a–9c; settings-data10d; trash11h–11j; chú thích/class/assets liên quan. |
| docs/testing/nghiem-thu-v1.md | NT-CH/HS/TM/DB; Lệch mockup389–423; đối chiếu424–446. |
| common/plan.md, known.md, fixes.md, baseline.md | Trục/mức/L4.2/3/5/6/8; đủ12R1/16R2D. Trích16Issue/PR/RESOLVED ở D/fix-<số>.txt. |
| docs/reviews/raw/2026-10-15/, 17/, 21/ và ba tổng hợp | Báo cáo D/kịch bản/phát hiện nối D; tránh lặp ca cũ. Không đọc lượt4 bên khác. |
| apps/desktop/src/data/, domain text/money/period/name-order, db/purge/person-references | Chỗ nối openAppData/lưu/đóng/input/9b; chỉ kết luận UI D. |
| e2e/ và tools | Fixture/support/spec mục9, classifier/codemap/token guard phục vụ D. |

## 4. Kịch bản mới đã thử

Chín ca ở `D/review-new.spec.ts`; số thô `D/new-ui.jsonl`, control cuối `D/e2e-final.log`. Fixture qua openAppData/app.run/export rồi nhập UI, không SQL thô để kết luận màn. Browser chặn hostname ngoài127.0.0.1 và thay window.open trước chạy đầu; AI Mock/native giả.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Tạo KH UI tên `D+"x".repeat(80)`, mở Sửa hồ sơ/Chuyển nhóm/+Ghi chú KYC tại1100×900/1440×900, đo/chụp6lượt.| Title vượt169,3px, client446/scroll616; header hồ sơ đã đúng117.| CXR4-D1 |
| N2 | Tạo team UI tên `T+"x".repeat(80)`, xem1100/1440, thêm IS cùng tên.|1100 document1440, Đổi tên x1242,6…1347,3; list254/662. IS card254/630, Sửa ngoài card.| CXR4-D2 |
| N3 | Nhập105RE+team khác, Hiện thêm, RE104→IS, sort giảm, đổi team/trở lại;9b RE000 có4KH xóa trùng tên có lịch.| Focus cuối SPAN; đổi vai trò tới H2#team-members-title; giữ descending/reset100;9b3mã+1KH khác/4lịch.| — |
| N4 | Nhập tên img/onerror, note script, fact svg/onload, mở từ Bảng.| Hiện như chữ;0script/img/onloadSVG trong main, không window.INJECTED.| — |
| N5 | Note BOM+VT+FF; thu nhập `1tr\u200b5`; thêm fact/lưu.|3dòng LF; hint1.500.000₫, fact1tr5.| — |
| N6 | Mock trích “KH đã kết hôn, có2con.”, filter Lịch hẹn→KYC.|2đề xuất Xác nhận trở lại nguyên vẹn.| — |
| N7 | Native giả lỗi lưu, retry DISK_FULL/READ_ONLY/FOLDER_READ_ONLY; giữ save thành công, focus nav Khách hàng rồi nhả.| Alert hết sau save; focus vẫn navA.| — |
| N8 | Nhập backup, giữ backup, yêu cầu đóng rồi nhả.| Chưa destroy, sidebar Đang lưu; save→backup→save→destroy, notice đúng.| — |
| N9 | Fixture4KH xóa kèm4lịch; Dọn sạch, giữ backup, đóng rồi nhả.| Đuôi backup→save→save→destroy, notice4KH+4lịch. Hai save trước/sau VACUUM đúng.| — |

N1/N2 đo hiện trạng nên Playwright “pass” khi thu được số, **không có nghĩa giao diện không lỗi**. N3–N9 assertion kết quả đúng. N8/N9 kiểm cổng D, không thay file thật B.

## 5. Phát hiện mới

### CXR4-D1 — Tên khách hàng liền dài bị cắt trong tiêu đề hộp thoại

- **ID:** CXR4-D1
- **Mức:** Low
- **Trục:** E
- **Vị trí:** `packages/ui/src/components/Dialog.tsx:84` (`2e51e25`), h2 không ngắt chuỗi. Callsite: `apps/desktop/src/routes/customers/KycDialogs.tsx:278`, `apps/desktop/src/routes/customers/CustomerDialogs.tsx:465`.
- **Tình trạng:** CONFIRMED
- **Liên quan:** DR6-117, biến thể tiêu đề chung ngoài vùng mô tả/sửa PR#746; **có từ trước, lượt1–3 bỏ sót**. Dialog.tsx không đổi trong diff119e2e4..2e51e25.
- **Kịch bản:** N1.
- **Mô tả:** App nhận tên KH81 chữ liền qua UI. Mở Sửa hồ sơ/Chuyển nhóm/Ghi chú KYC làm tên title tràn ngang và cắt phần cuối, dù header hồ sơ đã ngắt đúng.
- **Tái hiện / bằng chứng:** Trong `D/source/`, chạy `node node_modules/@playwright/test/cli.js test --config playwright.review.config.ts review-new --grep "N1 "` với server127.0.0.1:4294. Kết quả cuối ở `D/e2e-final.log`/`D/new-ui.jsonl`: cả6dialog clientWidth446/scrollWidth616;1100 mép774/chữ943,296875;1440 mép944/chữ1113,296875. Ảnh đã xem `D/N1-1100-edit.png`, còn đủ6ảnhN1.
- **Ảnh hưởng:** Điều kiện tên liền dài hợp lệ, khó đọc đủ định danh KH; Lưu/Đóng vẫn dùng được, không thấy sai dữ liệu.
- **Đề xuất:** Title/subtitle Dialog co/ngắt chuỗi; e2e1100/1440, không giới hạn tên mới. Dưới20dòng SP, dưới400.

### CXR4-D2 — Tên team/người hỗ trợ dài tràn thẻ, đẩy nút ngoài cửa sổ

- **ID:** CXR4-D2
- **Mức:** Low
- **Trục:** E
- **Vị trí:** `apps/desktop/src/routes/team/TeamScreen.tsx:51` (PersonName whitespace-nowrap), `:170` (tên team flex), `:294` (heading không co/ngắt), tại `2e51e25`.
- **Tình trạng:** CONFIRMED
- **Liên quan:** **có từ trước, lượt1–3 bỏ sót**; màn Team ngoài mô tả tên KH/thẻ/hộp KYC của DR6-117. Bố cục gây tràn có tại119e2e4, refactor HEADING giữ cùng class.
- **Kịch bản:** N2.
- **Mô tả:** Team81 chữ liền qua UI làm chữ đè thẻ khác, heading giữ min-content đẩy Đổi tên/Xóa team ngoài cửa sổ1100. IS cùng tên làm tên/nút Sửa tràn Người hỗ trợ.
- **Tái hiện / bằng chứng:** Trong bản chép chạy `node node_modules/@playwright/test/cli.js test --config playwright.review.config.ts review-new --grep "N2 "`. `D/new-ui.jsonl`:1100 main client868/scroll1208, document.scrollWidth1440; Đổi tên x1242,640625…1347,28125. Team list254/662, chữ919,46875 trong khi mép512, vẫn tràn1440. Support254/630, Sửa x866,75…887,3125 ngoài mép512. Ảnh `D/N2-team-1100.png` đã xem, còn1440/support.
- **Ảnh hưởng:** Tên liền dài hợp lệ làm chữ đè nhau, ở cửa sổ nhỏ nhất cần cuộn ngang tới thao tác team. Sai bố cục, không sai dữ liệu.
- **Đề xuất:** Tên team/người co/ngắt, giữ nút trong thẻ; e2e1100/1440 cho team/IS/BD chung. Dưới30dòng SP, dưới400.

Không có Medium/High/Critical, PLAUSIBLE hay KNOWN có hậu quả mới cần nâng.




## 6. Bloat và Hiệu năng

### Bloat

Số bundle/exe lấy baseline chung dựng không biến môi trường riêng. Build kiểm hành vi D có alias nguồn và `VITE_DEMO_ANCHOR=15/09/2026`, không dùng cỡ nó để so bundle. Asset nguồn đo lại bằng stat trong `D/structural-checks.json`.

| Đã chạy / đo / nguồn | Dữ liệu / mốc | Số | ID |
|---|---|---|---|
| Inventory classifier | D, so119e2e4 | SP7.999 (+670), test2.820 (+655),87file (+11). DiffSP+1.121/−451, test+697/−42.| — |
| tsc noUnusedLocals/noUnusedParameters | Worktree gốc app/ui | Cả hai exit0, không chẩn đoán. Không thấy khai báo thừa trong phạm vi compiler kiểm.| — |
| codemap --check / callers | Export D tại SHA ghim | Exit0 “Export maps are up to date.” R66-export đỏ khi tái export.| — |
| JS chính | Baseline, so lượt3 |884.698B vs927.932B, −43.234B; so b139d8a −7.244B.| — |
| CSS chính | Baseline, so lượt3 |29.752B vs28.484B, +1.268B; so b139d8a +1.388B.| — |
| Tổng JS/CSS | Baseline chung |2.358.427B, −41.966B so lượt3; gzip697.134B, −9.620B.| — |
| Font slogan/logo | Stat nguồn khớp build chung |21.884B; logo92.185+44.834+12.051=149.070B, brand Owner duyệt.| — |
| Exe/icon/favicon | Baseline chung, phần lớn B/F | Exe5.649.408B (+240.640 so lượt3); icon87.968B (+71.343); favicon2.465B vs494B. Không gán cả tăng exe cho D.| — |
| Logo mockup trùng byte | known.md ACCEPTED/T-310 | Giữ bản sao tự chứa làm mốc thiết kế độc lập; không báo bloat lại.| — |
| Dependency gate chuẩn bị | baseline verify, không chạy lại |341module/1.435dependency,0violation. Không cài công cụ mới.| — |

Không có phát hiện B mới. Mốc bundle b139d8a ghi đúng tên nguồn, không tự gọi là số sau#656.

### Hiệu năng

Máy **DESKTOP-KDURKJP**. File chuẩn `common/load/load-2026-10-12-seed6.p2cbackup`, hash `tables` **ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25**, khớp baseline. Cả đã xóa:1.496KH/10.414lịch/54người/5team/1.697HĐ; tables sống cho UI probe:1.481KH/10.255lịch/51người/4team/1.674HĐ.

Bảng exe là **số chuẩn bị common/baseline.md**, không phải đo exe mới của phiên D. So sau#656 và lượt3 cùng máy; luật nhiễu: tăng **hơn20% và hơn10ms**.

| Thao tác trên tải chuẩn | Sau #656 (ms) | Lượt3 (ms) | SHA ghim median (ms) | Ngưỡng / nhận xét | ID |
|---|---:|---:|---:|---|---|
| reload.customers |336|307|317|<500; +10ms/+3% so lượt3, không vượt luật nhiễu|—|
| reload.team |355|348|359|<500; +11ms/+3%, không vượt cả hai điều kiện|—|
| customers.view-table |20|19|19|<200|—|
| customers.sort-name |23|22|24|<200|—|
| customer.open-ai |19|19|20|<200|—|
| customer.ai-history |2|2|2|<200|—|
| backup.read |835|827|977|≤2.000; tăng17%/18%, không vượt luật nhiễu|—|
| backup.import |43|47|47|≤500|—|
| db.save |151|146|149|≤400|—|
| Gọi exe→màn đầu có số liệu/LCP |3.663|3.614|3.521|Không chậm hơn hai mốc theo luật đã chốt|—|

Đo bổ sung Node qua lớp dữ liệu app lúc **09:18:53 +07:00**, Nodev24.20.0, `D/perf-node.mjs`;5lượt làm nóng/30lần đo. KH nhiều phiên bản nhất20version/19fact/7note/13lịch. Codex và Playwright chức năng có thể cùng chạy lúc đo. Số Node chỉ tìm đường tính chậm D, **không so trực tiếp với UI/exe**, không kết luận hồi quy từ hai môi trường.

| Probe Node / dữ liệu | Median / min / max (ms) | Mốc cùng phép đo | ID |
|---|---|---|---|
| customerBoard/all |2,548 /2,474 /4,164|Không có, bổ sung đường tính D|—|
| staffMetrics/all |8,118 /6,489 /9,906|Không có, bổ sung đường tính D|—|
| kycTimeline/KH20version |0,0268 /0,0235 /0,0549|Không có, bổ sung đường tính D|—|
| kycOverview/KH20version |0,008 /0,005 /0,024|Không có, bổ sung đường tính D|—|
| readBackup+importBackup qua openAppData |935,106 (1lần, gộp đọc+thay)|Không so riêng ngân sách import500ms: khác đoạn đo|—|

Không có phát hiện P mới. Không mở thêm exe/cổng9222 hay đo cạnh tranh với bên khác; preview chức năng riêng127.0.0.1:4294 đã dừng.

## 7. Đếm mức × trục

Chỉ đếm phát hiện mới, không đếm lại các dòng R.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical |0|0|0|0|0|0|0|0|0|0|0|
| High |0|0|0|0|0|0|0|0|0|0|0|
| Medium |0|0|0|0|0|0|0|0|0|0|0|
| Low |0|2|0|0|0|0|0|0|0|0|2|
| Nit |0|0|0|0|0|0|0|0|0|0|0|
| Tổng |0|2|0|0|0|0|0|0|0|0|2|

CONFIRMED2/2 (100%), PLAUSIBLE0/2 (0%), không có tỉ lệ PLAUSIBLE cao. Mỗi lỗi có probe/số đo browser, không suy diễn mất dữ liệu từ lỗi hiển thị.

## 8. Đã xét, không thấy

| Trục | Phần đã đọc / chạy và kết luận |
|---|---|
| R |12R1/16R2, control trước/sau,27kiểm hoàn tác; không CHƯA SỬA/SỬA MỘT PHẦN/HỒI QUY trong D. Hai biến thểE ngoài mô tả cũ. |
| E | N1–N9, đổi vai trò/sort/paging, Unicode/filter/retry/đóng. Có hai lỗi N1/N2, không lỗi khác ở đường đã thử. |
| C | Spec3/4/6, ADR0013, mockup/ngoại lệ; form5d/KYC/timeline/nhân sự/brand/locked-field control qua. Không lệch mới ngoài hiển thị ghiE; không đề xuất đổi mockup khớp code. |
| D | UI gửi đầu vào gốc để lệnh kiểm, fixture openAppData, nhập/hiển thị/đổi vai trò/lưu qua các chuỗi trên. Không sai dữ liệu qua D; không suy rộng transaction/bytes thật A/B. |
| G | D hiển thị KYC/đề xuất; N6 Mock, filter không tự xác nhận/tạo fact. Không gọi AI thật; guardrail/schema/model thuộc C. |
| S | N4 HTML đều text, không chạy mã. Browser chặn mạng/window.open ngay đầu; không Credential Manager/key. Không thấy UI cho chạy nội dung nhập. |
| P | Đọc số exe cùng máy, đo hàm D tải chuẩn. Không chỉ số D vượt ngưỡng/hồi quy theo luật nhiễu; không gán kết luận exe cho Node. |
| B | NoUnused/codemap/diff class/API/i18n/stat assets; không bloat mới ngoài nội dung duyệt, không báo lại logo ACCEPTED. |
| T |575unit/115e2e cuối;23mutant hành vi+4rollback cấu trúc đỏ đúng cổng. N1/N2 thiếu bao phủ đã thể hiện ở hai lỗiE, không tách findingT trùng nguyên nhân. |
| A | Topbar/fallback/Hiện thêm/aria-sort/nhãn dialog/alert/status/lang/font/contrast/i18n đã kiểm. N7 giữ focus đã rời nút. Không lỗiA riêng ngoài tràn khungE. |

## 9. Phụ lục kiểm thử, đột biến và trạng thái cuối

### Nguồn và cách chạy

Gốc `C:\workspace\deep-review-1-6-r4\codex\D\`. Bản chép `source/` bằng git archive HEAD, không .git; junction dependency tới thư mục có sẵn. Mỗi đột biến sửa bản chép/khôi phục finally, không pnpm trong bản chép, không đổi dependency.

- `inventory.mjs/json`, `diff.patch`, `read-*.txt`, `fix-*.txt`: danh mục/diff/dấu vết đọc.
- `harness.mjs configure`: alias @p2c tới bản chép, Vitest/Playwright; route hostname127.0.0.1/initScript window.open=null trước chạy đầu.
- `harness.mjs build/serve`: Vite/preview127.0.0.1:4294 strictPort, không4173/PW_REUSE; `build-control.log`, `build-restored.log`. Có VITE_DEMO_ANCHOR như mục6.
- `fixture.mjs/p2cbackup`: openAppData/app.run/export; không SQL thô cho kết luận màn.
- `review-new.spec.ts`, `new-ui*.log`, `new-ui.jsonl`, ảnh N1/N2:9ca mới/số thô.
- `mutate.mjs unit/ui`, `mutate-structural.mjs`; ba manifest `mutations-unit.json`, `mutations-ui.json`, `mutations-structural.json`: phần gỡ/lệnh/log/khôi phục.
- `structural-checks.mjs/json`:16kiểm token/mockup/lang/mappings/ngoại lệ purge/phục hồi, stat assets, ghi kết quả tsc/codemap đã chạy. Không thay behavioral test.
- `perf-node.mjs/json/log`: nguồn/số đo chuẩn mục6.

Control cuối cwd `D/source/`; tập đối số đầy đủ unit được dựng lại từ inventory ở file `D/control-commands.txt`:

```text
node node_modules/vitest/vitest.mjs run --config vitest.review.config.ts --reporter=verbose apps/desktop/src/i18n/index.test.ts apps/desktop/src/routes/customers/CustomersScreen.test.tsx apps/desktop/src/routes/customers/customers-view.test.ts apps/desktop/src/routes/customers/kyc-view.test.ts apps/desktop/src/routes/money-view.test.ts apps/desktop/src/routes/team/team-view.test.ts apps/desktop/src/shell/CloseGuard.test.tsx apps/desktop/src/shell/SaveWarning.test.tsx apps/desktop/src/shell/Sidebar.test.tsx apps/desktop/src/shell/block-reload.test.ts apps/desktop/src/shell/close-guard.test.ts apps/desktop/src/shell/routes.test.ts apps/desktop/src/shell/scope.test.ts apps/desktop/src/shell/screen-error.test.ts apps/desktop/src/shell/startup-error.test.ts apps/desktop/src/ui-choices.test.tsx packages/ui/src/components/PeriodPicker.label.test.ts packages/ui/src/components/chart-theme.test.ts packages/ui/src/components/compare-cells.test.ts packages/ui/src/components/dialog-focus.test.ts packages/ui/src/components/field-notes.test.ts packages/ui/src/components/show-more.test.ts packages/ui/src/components/table-view.test.ts packages/ui/src/token-guard.test.ts packages/domain/src/text.test.ts packages/domain/src/period.test.ts packages/domain/src/money.test.ts packages/domain/src/name-order.test.ts apps/desktop/src/data/tauri-contract.test.ts
node node_modules/@playwright/test/cli.js test --config playwright.review.config.ts customer-forms customer-kyc customer-appointments team data-table topbar-focus save-state theme navigation review-new
```

Kết quả thật: `unit-final.log` **575 passed / 29 file**; `e2e-final.log` **115 passed / 2,5 phút**, exit0. Hai lệnh tsc noUnused app/ui và `node tools/codemap.mjs --check` trên worktree gốc đều exit0, đã ghi tại structural-checks.json.

### Kết quả hoàn tác từng phần sửa

Mỗi dòng có `D/mutants/<ID>/changed.txt`, `test.log`; mutant UI còn `build.log`. Exit1 là đỏ do kiểm tương ứng, không lấy build lỗi làm mutant bị giết.

| ID | Nguồn bị gỡ trên bản chép | Phép kiểm / kết quả thật | Loại | Kết luận |
|---|---|---|---|---|
| R110-birth | `apps/desktop/src/routes/customers/customers-view.ts` | Bỏ normalizeText năm sinh; 2 unit đỏ; exit1 | Hành vi | KILLED |
| R115-trash | `apps/desktop/src/i18n/vi.ts` | Trả câu9b quá rộng; 3 unit đỏ; exit1 | Hành vi | KILLED |
| R120-cause | `apps/desktop/src/shell/SaveWarning.tsx` | Gộp readOnly về lỗi chung; 2 unit đỏ; exit1 | Hành vi | KILLED |
| T287-codes | `apps/desktop/src/routes/team/team-view.ts` | Bỏ mã tên KH trùng; 1 unit đỏ; exit1 | Hành vi | KILLED |
| T297-filter | `apps/desktop/src/routes/customers/kyc-view.ts` | Cho tất cả event vào KYC; 1 unit đỏ; exit1 | Hành vi | KILLED |
| T298-direction | `apps/desktop/src/routes/customers/customers-view.ts` | Đảo up/down; 1 unit đỏ; exit1 | Hành vi | KILLED |
| R67-amount | `apps/desktop/src/routes/money-view.ts` | Bỏ nhánh compact/full; 1 unit đỏ; exit1 | Hành vi | KILLED |
| T310-name | `apps/desktop/index.html` | Title HTML về Project-2C; 1 tauri-contract đỏ; exit1 | Hành vi | KILLED |
| R109-name | `apps/desktop/src/routes/customers/CustomerDialogs.tsx` | Chuẩn hóa tên trước lệnh; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| R109-note | `apps/desktop/src/routes/customers/KycDialogs.tsx` | Chuẩn hóa note trước lệnh; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| R116-fallback | `apps/desktop/src/routes/team/TeamScreen.tsx` | Bỏ đích focus; 3 e2e đỏ; exit1 | Hành vi | KILLED |
| R117-name | `apps/desktop/src/routes/customers/CustomerProfile.tsx` | Bỏ min-w-0/wrap; nút tới1261,78125px tại1100; exit1 | Hành vi | KILLED |
| R117-dialogs | `apps/desktop/src/routes/customers/KycDialogs.tsx` | Bỏ wrap draft;7a tràn161,015625px; exit1 | Hành vi | KILLED |
| R127-meeting | `apps/desktop/src/routes/customers/CustomerKyc.tsx` | Bỏ wrap timeline; tràn185,4375px tại1440; exit1 | Hành vi | KILLED |
| T280-margin | `apps/desktop/src/index.css` | Scroll margin về0; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| T293-title | `apps/desktop/src/shell/AppShell.tsx` | Bỏ setTitle; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| T294-retry | `apps/desktop/src/shell/SaveWarning.tsx` | Retry không flush; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| T299-ask | `apps/desktop/src/routes/team/PersonDialogs.tsx` | Xóa bỏ hỏi thay đổi; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| T299-sort | `apps/desktop/src/routes/team/TeamScreen.tsx` | Remount Members theo team; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| T300-border | `packages/ui/src/tokens.css` | Màu viền cũ; 1 e2e tương phản đỏ; exit1 | Hành vi | KILLED |
| T308-font | `packages/ui/src/theme.css` | Slogan dùng sans; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| T310-lang | `apps/desktop/src/shell/Brand.tsx` | Slogan lang=vi; 1 e2e đỏ; exit1 | Hành vi | KILLED |
| R66-export | `packages/ui/src/components/chart-theme.ts` | Tái export TokenReader; codemap check đỏ; exit1 | Cấu trúc, tương đương hành vi | KILLED |
| R37-mark | `apps/desktop/src/routes/customers/CustomerKyc.tsx` | Literal✓ thay khóa i18n; token-guard CLI đỏ; exit1 | Cấu trúc, tương đương hành vi | KILLED |
| R67-CARD | `apps/desktop/src/routes/customers/CustomerAppointments.tsx` | Tái class CARD local; kiểm cấu trúc đỏ; exit1 | Cấu trúc, tương đương hành vi | KILLED |
| T305-HEADING | `apps/desktop/src/routes/team/TeamScreen.tsx` | Tái HEADING local; kiểm cấu trúc đỏ; exit1 | Cấu trúc, tương đương hành vi | KILLED |
| T291-VTFF | `packages/domain/src/text.ts` | Bỏ VT/FF khỏi LINE_BREAK; domain text assertion đỏ; exit1 | Hành vi | KILLED |

R117-name/R117-dialogs/R127-meeting có nhãn máy ban đầu CHECK_LOG do regex không khớp assertion tùy biến. Đã đọc log: “Sửa hồ sơ at1100”, “7a”, “timeline at1440”; Received1261,78125/161,015625/185,4375 và Expected chứng minh **KILLED**, không lỗi harness. Giữ JSON/log thô, bảng ghi kết luận kiểm tay.

Bốn rollback **R66-export/R37-mark/R67-CARD/T305-HEADING** tương đương hành vi: codemap/token/kiểm cấu trúc đỏ đúng cleanup; không tuyên bố runtime test phân biệt hằng cùng giá trị. **Không mutant hành vi sống** trong23ca chọn; không suy rộng toàn không gian đột biến.

### Điều chỉnh harness và giới hạn

- Khi chốt phụ lục, đối chiếu inventory cho thấy lượt unit trước thiếu1file. Đã chạy đủ24file test D +4domain +tauri-contract:29file/575test qua; có lệnh thực trong unit-final-command.json. Alias Vitest ban đầu là chuỗi regex escape nên phần import package còn nối dependency có sẵn; alias được chỉnh tới nguồn bản chép, khai báo riêng ai/schema. Lần chỉnh đầu thiếu subpath gây failed suite (unit-final-alias-error.log), sửa harness rồi control qua. Đã chạy lại8mutant unit và5kiểm cấu trúc với alias mới, đều đỏ đúng cổng; control sau khôi phục qua. Alias Vite build UI đã dùng regex chính xác từ đầu, không đổi kết quả115e2e.

- Build đầu parseDate nhận ISO thành null; đổi ngày riêng harness sang dd/mm/yyyy rồi build qua, không appbug.
- Control e2e đầu104qua/2đỏ vì hai assertion nguyên bản kỳ vọng localhost, còn probe phải127.0.0.1. Chỉ đổi hai assertion hostname trong bản chép, chạy lại2ca qua, cuối115qua; không đổi assertion hành vi.
- N3 fixture đầu thiếu lịch của KH xóa nên RE không bị giữ (đúng app); thêm lịch qua app rồi export lại. Sửa selector nút/paging sau sort trong probe. N3 cuối qua.
- N9 probe đầu kỳ vọng1save; `packages/db/src/purge.ts:178` lưu transaction rồi sau VACUUM có chủ ý. Sửa kỳ vọng probe thành2save, cuối qua; không tạo finding từ kỳ vọng sai.
- Không chạy lại toàn3975unit/308e2e/Rust/buildexe; cổng chung SHA ghim ở baseline. D chạy phần riêng trên, không dùng số chuẩn bị như số tự chạy.
- Không đọc lượt4 bên khác, không tìm ngoài vùng cho phép, không AI thật/cài công cụ.
- Lần đầu ghi bản biên tập chưa thực hiện vì auto-review báo hạn mức, không phải từ chối an toàn. Theo yêu cầu “Tiếp tục”, thử lại cùng cơ chế require_escalated đã thành công. Không đổi đường ghi để vượt cổng duyệt.

### Trạng thái cuối

- Tất cả file SP D trong bản chép so worktree khớp byte: `mismatched: []`.
- Preview4294 đã dừng; kiểm cổng cuối **không có listener (0)**.
- SHA cuối **2e51e25eb0125f56d3d938b97ef18d6873dae076**.
- `git status --short` cuối **rỗng**, khớp đầu phiên; không thay đổi tracked/untracked của phiên trong repo.
- Hoàn tất **2026-10-29 13:54:05 +07:00** (Asia/Bangkok).

