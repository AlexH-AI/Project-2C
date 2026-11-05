XONG — codex gói D lượt 5, 2026-11-04 23:48:27 +07:00

# Deep review Phase 1–6, lượt 5 — Gói D. Màn nhập liệu

## 1. Phiên

- Bên codex, gói D, Màn nhập liệu.
- SHA đầu phiên 37a80b662861d308a110d1e2b0f65ad13b91fb51. git status --short đầu phiên rỗng.
- Bắt đầu 2026-11-04 23:31:21 +07:00, Asia/Bangkok.
- Công cụ Codex desktop và PowerShell. Phiên khai báo Codex dựa trên GPT-6, tên người giao ghi GPT Sol 6.1. Phiên bản ứng dụng, mã model chạy và mức suy luận không được cung cấp trong giao diện công cụ của phiên.

## 2. Bảng R

### R1 — theo mã

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-37 | #790 → #845, #901 → #920 | **ĐÃ SỬA** | Đối chiếu CL-D5 và CL-E5 ở `6.4 lượt 4 và bản gốc lượt 1. Thẻ Dữ kiện dùng `kyc.factLine`. Câu nối danh sách, giá trị đang có và ngoặc kép của hộp giải quyết đã qua i18n. Ca KYC xác nhận và giải quyết mâu thuẫn qua. Thay riêng `CustomerKyc.tsx` bằng bản cũ làm token lint exit 1 tại dòng 95 với `}: {`. | N7 thấy `Số con: 2`, rồi cổng mâu thuẫn có liên kết đúng. Ca KYC cũng kiểm ngoặc kép và mã nguồn của giá trị. Đối chiếu `sep.list`, dấu ×, ▾/▸ và dấu — của các đường nối E theo CL-E5. Lỗ của chính công cụ nằm ở DR6-145. |
| DR6-145 | #901 → #920, #934 → #965, #969 → #971, #973 → #975 | **SỬA MỘT PHẦN** | `guard-probe.log` chạy lại dạng nối bằng chuỗi, template và JSX cùng ba biên `//`, `/*`, `*/` trong chuỗi. Gỡ phần #920 làm 9/28 test đỏ. N7 kiểm phần (a) trên màn. | Mô tả DR6 gốc còn `← – … “ ” ‘ ’` và escape Unicode. Cả hai mẫu hợp lệ đều trả `[]` ở SHA ghim. #920 ghi các nhóm này ngoài phạm vi Issue. CXR5-D1. |
| DR6-146 | #902 → #922 (5c), #898 → #911 (focus) | **ĐÃ SỬA** | Hai ca `customer-forms:387` và `save-state:177` đều xanh. Gỡ riêng theo R109c và RB2c làm cả hai đỏ. 5c mất lỗi INVALID_TEXT do hộp đóng khi lưu. Nhánh Tab bị lấy focus khỏi nút + Nhân sự. | Tab ra khỏi dải giữ focus ở nút tiếp theo. Click khoảng trống làm focus rơi về trang, lúc lưu xong chuyển về h1. Ca 5a dán cùng dạng hỏng cũng qua. |
| DR6-147 | #898 → #911 | **ĐÃ SỬA** | `save-state:202`, `:225` xanh. Một lần ghi khác thành công đưa focus từ Thử lại về h1, hoặc gỡ câu hỏi rồi phát `save, destroy`. Lùi SaveWarning và CloseGuard về trước #911 làm cả hai đỏ, h1 không focus và sự kiện cuối là `save, save`. | N3 thử đóng khi 5a còn bản nháp. Escape trả focus về ô tên và giữ bản nháp. Các ca lỗi lại/đổi nguyên nhân và đóng lúc Nạp lại cũng xanh. |
| DR6-148 | #902 → #922, #932 → #941, #951 → #958 | **ĐÃ SỬA** | Sáu ca `long-names` xanh tại 1 100/1 440, gồm title/subtitle, Team với IS/TL dài, So sánh team, cuộn tới cột số Báo cáo. Bỏ `wrap-anywhere` của Dialog làm hai ca title/subtitle đỏ tại 1 100. | N1 và N6 tìm thêm hai vị trí ngoài bốn chỗ của DR6-148, CXR5-D3/D4. |
| DR6-149 | #901 → #920, #905 → #928, #935 → #948 | **ĐÃ SỬA** | E2E theme đối chiếu 5a/5d với `forms.css:261`, đo nền, viền, bo, đệm, chữ, độ tương phản, trọng lượng và gạch ngang. Lùi Choices làm đỏ bo góc, 10 thay 6 px. | Áp K44, đo viền ≥3:1 ở ô đang chọn. Đối chiếu ba lệch đã ghi về xuống dòng, opacity hộp AI 1c và kiểu hàng 7d tại `nghiem-thu-v1.md:407`. Các ca thao tác 5a/5d và ca bàn phím của bộ nút chuyển đã qua. |

### R2 — theo Issue

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-331 | #932 → #941 | **ĐÃ SỬA** | `ui-datatable.test.tsx:38` giữ `th.relative` của ô tiêu đề ẩn, bỏ class làm đỏ. Khung Team dùng `overflow-x-auto`. Các ca tên team/TL, vị trí mũi tên và số đếm, phụ đề dài xanh. | Tên TL thường vẫn một dòng cạnh tên team dài. TL 160 chữ giữ nút trong thẻ và tiêu đề team ngắn một dòng ở cả hai bề rộng. |
| T-332 | #933 → #946 | **ĐÃ SỬA** | Focus 10a Hủy/Escape và 10b Đóng về Chọn file. Ca giữ đọc file kiểm không mở thêm file chooser. `customer.withCode` dùng ở 9b và Thùng rác, bỏ mã làm đỏ hai test về trùng tên. Codemap khớp. | N5 kiểm Tab/Shift+Tab, Enter/Space và cây trợ năng. Unit ô Giờ, DB, ba store và probe listener tự gỡ + listener ném đều xanh. E2E ô Giờ vô hình lưu được. Chú thích TR-11/11i ở ca Dọn sạch. |
| T-333 | #934 → #965 | **ĐÃ SỬA** | Lùi `token-guard.ts` về trước #965, đỏ cả ca `Promise<void>`/generic và CRLF. Ở bản ghim, generic lồng `Map` cho `[]` và chuỗi tiếp qua CRLF đếm đúng dòng 3. | Generic có đối số kiểu hàm generic là biến thể còn hở, CXR5-D2. `notes-core.test.mjs` chạy xanh, phần glob thuộc F. |
| T-337 | #951 → #958 | **ĐÃ SỬA** | `ui-button.test.tsx:14` đỏ khi gỡ cặp class `aria-disabled:`. Hai chỗ gọi dùng class chung. E2E tiêu đề team một dòng ở cả hai cỡ. Unit `parseTime` qua các ca U+200B/U+2060 dính với giờ và giờ sai. | N5 cho thấy nút đang đọc có opacity 0,5, cây trợ năng báo disabled, Tab rồi Shift+Tab về nút, Enter và Space không mở thêm bộ chọn. Đọc cây trợ năng Chromium. |
| T-341 | #969 → #971 | **ĐÃ SỬA** | Comment ghi thẻ đóng/tự đóng dính chữ và hậu quả. Ca ghim chỉ báo dòng đối chứng có thẻ đóng sau biểu thức. Gỡ phép đếm generic làm chính ca ghim đỏ, có thêm hai dòng đóng/tự đóng. | Đây là hợp đồng tài liệu/test về giới hạn được Owner chốt. Ca đối chứng giữ hành vi với thẻ không dính chữ. |
| T-342 | #973 → #975 | **ĐÃ SỬA** | Ca T-341 ghim thêm thẻ mở dính chữ, đúng một báo cáo ở dòng 4. Gỡ phép đếm generic làm ca đó đỏ với báo cáo thừa ở dòng 1. Token lint xanh. | Bảng `phase-6.md:366` có #944 và lý do chấp nhận cỡ, câu tổng ở dòng 380 tới #974. Kiểm phần guard của D, phần đếm PR thuộc F. |
| T-344 | #980 → #981 | **ĐÃ SỬA** | `docs/user-guide/README.md:75` chỉ đúng `customer-forms.html` 5d–5e, git diff của #981 chỉ một hàng. Mockup vẽ hộp cho KH mở và KH đã đóng. | Hai ca đổi nhóm tay và mở lại KH đã đóng về N3 của `customer-forms` chạy xanh. Issue tài liệu. |
| T-352 | #1004 → #1007 | **ĐÃ SỬA** | Kiểm mục Dữ liệu, sáu dòng Owner của L2, tổng kết L2, chú giải ⚠️, NT-AI-03, hình dạng cột và Prettier. N7 khớp hai hàng bảng cổng, chỉ mâu thuẫn có liên kết tới Dữ kiện. | NT-TR-12 bổ sung về sau ở T-354. Lịch sử kết quả L2 giữ nguyên. Issue tài liệu. |
| T-356 | #1019 → #1023 | **ĐÃ SỬA** | Hai chương hướng dẫn, NT-TQ-01 và mốc L3 `331e7a0` khớp. E2E `navigation:63` mở lại màn trước trong cùng profile. N2 còn nhớ đúng tiểu mục Thùng rác. | Hash lưu chứa UTF-8 hỏng → Tổng quan. Hash hợp lệ chỉ rõ tiểu mục thắng tuyến đã lưu. Phần dùng chung profile WebView2 đối chiếu với cấu hình và ghi chú nghiệm thu, phép thử mới chạy Edge. Issue tài liệu. |

R1 có 5 ĐÃ SỬA, 1 SỬA MỘT PHẦN. R2 có 9 ĐÃ SỬA trong phần giao gói D.

## 3. Phạm vi đã đọc

- Phạm vi theo `classifyFile`. `D/inventory-and-docs.log` có bảng từng tệp, số dòng và loại. Tổng 89 tệp được tính, 63 tệp sản phẩm 8 134 dòng và 26 tệp test 3 094 dòng. Tài nguyên UI gồm font, token, icon tab và logo sidebar. Phần nối đọc gồm AppData, hàng đợi lưu, listener, hộp nhập backup và xác nhận, Lịch hẹn, So sánh team, Báo cáo, cổng KYC và mockup liên quan.
- Diff `2e51e25..37a80b6` của D là +208/−73 dòng sản phẩm trong 12 tệp và +276/−2 dòng test trong 4 tệp. Các khối thay đổi được rà theo commit #911, #920, #922, #941, #946, #958, #965, #971 và #975. Tập trung vào máy trạng thái bộ chặn, vòng đời focus khi lưu/đóng, `DataTable` và tiêu đề ẩn, `Choices` và nút đang chạy. Danh sách đủ 16 tệp ở cuối bảng inventory.
- Đối chiếu CLAUDE.md, CONTEXT.md, CLAUDE.md của desktop/UI, spec Phase 3 `1/4/6, Phase 4 `3/4, Phase 6 `4/5, ADR-0013, mockup `index.html`, `forms.css`, `customer-forms.html`, `customer.html`, `customers.html`, `kyc-forms.html`, `phase-3-feedback.html`, `settings-data.html`, `trash.html` và `ai.html`. Dùng bảng nghiệm thu, mục Lệch mockup đã biết, ba chương hướng dẫn và bảng đối chiếu hộp thoại. Đối chiếu bản tổng hợp bốn lượt trước, báo cáo D ở thư mục raw 15/10, 17/10, 21/10, 31/10 và các ca nối E liên quan. Phần lượt 5 dùng `common/plan.md`, `known.md`, `fixes.md` và `baseline.md`.
- Đọc diff và vùng hành vi trên, kiểm tự động toàn bộ inventory. Độ sâu kiểm ngoài phần đổi ưu tiên đường dữ liệu, focus, layout, test và các ranh giới trong bảng kịch bản. Mỗi tệp không có một probe riêng.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Tạo KH tên liền 160 chữ W từ 5a, mở hồ sơ, về Kanban rồi Bảng ở 1 100 và 1 440. | Kanban vừa cửa sổ, Bảng làm document rộng 2 811 px ở cả hai cỡ. Mép phải ô cuối của hàng ở x ≈ 2 811. | CXR5-D3 |
| N2 | Mở app với tuyến đã lưu có percent-escape UTF-8 lỗi, sau đó mở thẳng tiểu mục Thùng rác và mở lại không hash. | Lần đầu về Tổng quan. Sau đó lưu `#/settings/trash` và mở đúng tiểu mục. | — |
| N3 | Lưu team lỗi READ_ONLY, chuyển Khách hàng, soạn 5a, yêu cầu đóng cửa sổ rồi Escape. | Hộp đóng app gỡ. Hộp 5a và chữ nháp còn, ô tên có focus, không có `destroy`. | — |
| N4 | Nhập file tải thật ngày neo 04/11, Bảng → sắp Họ tên → Hiện thêm → mở dòng 160 bằng Enter → Khách hàng. | Đã nhập 1 481 KH còn sống, xem được 200 hàng. Quay lại về Kanban và focus h1, dòng trước không còn hiện. Số đo ở `6. | — |
| N5 | Giữ `File.text()`, Tab rồi Shift+Tab, Enter và Space trên nút đang đọc, nhả file sai và đóng hộp 10b. | `button "Đang đọc file…" [disabled]` trong cây trợ năng, opacity 0,5. 0 chooser phát sinh. Focus trả về Chọn file. | — |
| N6 | Đổi tên RE thành 160 chữ W, dùng RE trong 5a rồi chọn cùng RE trong Góc nhìn tại 1 100×700. | 5a vừa hộp 446/446 px. Select đầu trang rộng 2 409 px, document rộng 3 009 px. | CXR5-D4 |
| N7 | KH mới có cổng thiếu, thêm Số con 2 rồi xác nhận giá trị 3 là mâu thuẫn. Bấm liên kết cổng bằng Enter. | Dữ kiện ghi `Số con: 2`. Chỉ cổng mâu thuẫn có liên kết, Enter đưa focus tới Dữ kiện KYC. | — |
| N8 | So guard trên `CustomerKyc.tsx` hai SHA, chuỗi/comment/template lồng, CRLF, dấu cong/escape, generic kiểu hàm và JSX có nút cách riêng. | KYC cũ báo dòng 95, hiện tại sạch. CRLF đúng dòng, generic lồng `Map` qua. Generic kiểu hàm báo nhầm và dấu nối JSX có nút cách lọt. | CXR5-D1/D2/D5 |
| N9 | Nhập cùng file tải ở ngày 04/11 qua AppData, đăng ký listener tự gỡ, listener ném và listener cuối. Tạo hai team qua `run`. | Hai lệnh trả về hai team, đọc lại có đủ hai. Log thứ tự `self, throw, reported, last, throw, reported, last`. | — |

## 5. Phát hiện

### CXR5-D1 — Bộ chặn còn sót dấu và escape nêu ở DR6-145

- ID: CXR5-D1
- Mức: Low
- Trục: R
- Vị trí: `packages/ui/src/token-guard.ts:61`, `packages/ui/src/token-guard.ts:98` (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: DR6-145 · còn từ lượt 4. PR #920 nêu ngoài phạm vi Issue.
- Kịch bản: N8
- Mô tả: Các dấu `← – … “ ” ‘ ’` và dấu đã cấm nhưng được viết bằng Unicode escape vẫn lọt. Đây là các dạng có trong mô tả DR6-145 (b) gốc.
- Tái hiện / bằng chứng: `node guard-probe.mjs` trong bản chép. Log ghi `{"name":"DR6-145 marks","syntaxErrors":0,"hits":[]}` và `{"name":"DR6-145 escapes","syntaxErrors":0,"hits":[]}`. Đối chứng `actual CustomerKyc at 2e51e25` báo `}: {` ở dòng 95. Quét literal trên 115 tệp TS/TSX sản phẩm ngoài i18n không thấy bộ dấu cong/mũi tên trái này đang dùng trên SHA ghim.
- Ảnh hưởng: Người sửa UI có thể đưa dấu viết cứng ngoài i18n mà cổng kiểm không báo. Hiện xác nhận lỗ của công cụ, chưa có dòng màn hiện tại dùng nhóm ký hiệu đó.
- Đề xuất: Ghim danh sách dấu theo mô tả DR6 và nhận diện giá trị escape của literal giao diện. Dưới 400 dòng SP.

### CXR5-D2 — Kiểu hàm generic lồng có thể làm bộ chặn báo nhầm

- ID: CXR5-D2
- Mức: Low
- Trục: T
- Vị trí: `packages/ui/src/token-guard.ts:135`, `packages/ui/src/token-guard.ts:155` (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: T-333 · biến thể còn sau #965 của lỗi phân biệt generic/JSX từ #920.
- Kịch bản: N8
- Mô tả: `Promise<<T>() => T>` chỉ tăng bộ đếm ở dấu mở đầu. Dấu `>` đầu đóng bộ đếm, nên dấu `>` ngoài cùng làm thân hàm tiếp theo bị đọc là JSX.
- Tái hiện / bằng chứng: `node guard-probe.mjs` trên `run(function (): Promise<<T>() => T> { throw Error(); }, { tries: 3 });`. Parser TypeScript cho 0 lỗi cú pháp, guard báo `}, {` tại dòng 1. Mẫu `Promise<Map<string, () => void>>` tương ứng cho `[]`. Token lint trên mã ghim xanh.
- Ảnh hưởng: Một đoạn TypeScript dùng kiểu hàm generic làm đối số kiểu có thể bị cổng i18n từ chối dù dấu phân cách thuộc đối số của hàm.
- Đề xuất: Ghim ca hợp lệ và phân biệt các ngữ cảnh generic bằng token hoặc nút cú pháp. Dưới 400 dòng SP.

### CXR5-D3 — Tên liền dài làm tràn Bảng Khách hàng

- ID: CXR5-D3
- Mức: Low
- Trục: E
- Vị trí: `apps/desktop/src/routes/customers/CustomersScreen.tsx:60`, `apps/desktop/src/routes/customers/CustomersScreen.tsx:193` (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: DR6-148 · vị trí khác, có từ trước, lượt 1–4 bỏ sót.
- Kịch bản: N1
- Mô tả: Cột Họ tên theo kích thước nội tại của liên kết, không ngắt tên liền dài. Bảng làm cuộn ngang cả trang, đẩy Nhóm, RE và các cột phía sau ra ngoài khung nhìn.
- Tái hiện / bằng chứng: `node node_modules/@playwright/test/cli.js test -c playwright.review.config.ts e2e/review-D.spec.ts -g N1`. `e2e-extra.log` ghi Kanban 1 100/1 100 và 1 440/1 440, sang Bảng document rộng 2 811 px ở cả hai cỡ. Main có client/scroll 868/2 579 ở cỡ 1 100 và 1 208/2 579 ở cỡ 1 440.
- Ảnh hưởng: Một KH có tên liền dài hợp lệ làm người dùng phải cuộn ngang trang để đọc các cột cùng hàng.
- Đề xuất: Giới hạn và ngắt chữ cột Họ tên/RE, giữ cuộn ngang trong vùng bảng nếu còn cần. Dưới 400 dòng SP.

### CXR5-D4 — Tên RE liền dài làm tràn thanh Góc nhìn

- ID: CXR5-D4
- Mức: Low
- Trục: E
- Vị trí: `apps/desktop/src/shell/ScopePicker.tsx:29`, `apps/desktop/src/shell/ScopePicker.tsx:50`, `packages/ui/src/components/SelectField.tsx:55` (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: DR6-148 · vị trí khác, có từ trước, lượt 1–4 bỏ sót.
- Kịch bản: N6
- Mô tả: Select ở cụm flex Góc nhìn lấy chiều rộng nội tại từ nhãn RE kèm team. Với tên dài, cụm không co theo phần còn lại của header.
- Tái hiện / bằng chứng: `node node_modules/@playwright/test/cli.js test -c playwright.review.config.ts e2e/review-D-extra.spec.ts -g N6`. Sau đổi tên RE, 5a có client/scroll 446/446 và select 414 px. Góc nhìn → RE ở 1 100 px cho select rộng 2 409, mép phải 3 009, document rộng 3 009 px (`e2e-new-confirm.log`).
- Ảnh hưởng: Chỉ một tên RE rất dài trong danh sách cũng làm hộp chọn ở thanh đầu màn vươn ra ngoài cửa sổ. Tác động đã xác nhận ở Khách hàng.
- Đề xuất: Đặt giới hạn theo khung cho cụm Góc nhìn và select, giữ nhãn đầy đủ trong danh sách chọn. Dưới 400 dòng SP.

### CXR5-D5 — JSX tách dấu cách thành biểu thức làm lọt dấu nối viết cứng

- ID: CXR5-D5
- Mức: Low
- Trục: T
- Vị trí: `packages/ui/src/token-guard.ts:147` (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: DR6-145 · biến thể của luật mới trong #920.
- Kịch bản: N8
- Mô tả: Bộ chặn chỉ ghép dấu câu, dấu cách ASCII và dấu mở ngoặc tiếp theo khi chúng liền nhau trong nguồn. JSX viết `{a}:{' '}{b}` tạo cùng dòng chữ mà guard không báo.
- Tái hiện / bằng chứng: `node guard-probe.mjs` cho `{"name":"JSX same visible colon with explicit space","syntaxErrors":0,"hits":[]}`. Mẫu `<p>{a}: {b}</p>` bị báo đúng. Cú pháp `{' '}` có trong mã thật, ví dụ `CustomerAppointments.tsx` bên cạnh `t('sep.dot')`, nơi dấu nối đã đúng.
- Ảnh hưởng: Cổng kiểm bỏ sót dấu nối đặt ngoài i18n khi tác giả dùng biểu thức dấu cách quen thuộc trong JSX. Xác nhận ở công cụ.
- Đề xuất: Ghim ca tương đương và đọc các nút văn bản hoặc biểu thức khoảng trắng nằm giữa hai biểu thức JSX. Dưới 400 dòng SP.

## 6. Bloat và Hiệu năng

### Bloat

| Đã chạy / đo | Dữ liệu | Số | ID |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` cho UI và desktop | Bản chép SHA ghim | 2 exit 0 | — |
| `codemap.mjs --check` và dependency-cruiser | app và packages | Bản đồ khớp, 354 module / 1 582 cạnh, 0 vi phạm | — |
| `classifyFile` và `git diff --numstat` | Tracked D, `2e51e25..37a80b6` | 8 134 SP (+135), 3 094 test (+274), 89 tệp (+2). Diff tập trung vào guard, lưu/đóng, tên dài và test. | — |
| Bundle theo `common/baseline.md`, toàn app | Build chuẩn bị SHA ghim, so lượt 4 | JS/CSS 2 366 456 B thô / 699 761 B gzip, +8 029 / +2 627 B so lượt 4. `index.js` +7 486 B thô. Font, ảnh, wasm và HTML tổng 1 022 121 B như lượt 4. | — |
| Exe theo `common/baseline.md` | Bản release chuẩn bị | 5 649 408 B, bằng G7 và lượt 4. Bundle web G7 không có số cùng cách ở baseline. | — |

Đọc phần tăng của guard và các component trong diff, chưa thấy mã chết chạy được hoặc phần phình tách riêng có chi phí đo được.

### Hiệu năng

Home PC `DESKTOP-KDURKJP`, Node v24.20.0, Edge cho phép đo web. File `load-2026-10-12-seed6.p2cbackup` đúng SHA-256 `B3C9903321ABCCDF3301818D35DAD7D7C6EAC48D73814286694B554C94C77293`. 1 496 KH, 10 414 lịch, 54 nhân sự cả xóa mềm; lớp dữ liệu trả 1 481 KH, 10 255 lịch, 51 nhân sự còn sống. Các phép đo mới chạy tuần tự, không chạy cùng suite browser khác của phiên. Tiến trình ngoài phiên không được đo tải.

| Phép đo | Lượt 5 | Home PC sau #656 | G7 | Lượt 4 | Ngưỡng / ID |
|---|---:|---:|---:|---:|---|
| Exe `reload.customers`, 5 lần | 316 ms | 336 ms | 308 ms | 317 ms | <500 ms · — |
| Exe `reload.team`, 5 lần | 362 ms | 355 ms | 350 ms | 359 ms | <500 ms · — |
| Exe `customers.view-table`, 5 lần | 19 ms | 20 ms | 20 ms | 19 ms | <200 ms · — |
| Exe `customers.sort-name`, 5 lần | 24 ms | 23 ms | 23 ms | 24 ms | <200 ms · — |
| Exe `customer.open-ai`, 5 lần | 20 ms | 19 ms | 20 ms | 20 ms | <200 ms · — |
| Web N4 chuyển Bảng sau nhập, 5 lần sau một lần làm nóng | 23 ms (17–24) | — | — | — | Tham khảo web · — |
| Web N4 sắp Họ tên, 5 lần sau một lần làm nóng | 23 ms (23–24) | — | — | — | Tham khảo web · — |
| Node `customerBoard` Toàn bộ, 20 lần sau làm nóng | 1,464 ms (1,421–1,562) | — | — | 2,548 ms trong probe Codex lượt 4 | Tham khảo Node · — |
| Node `staffMetrics`, 20 lần sau làm nóng | 6,928 ms (6,546–7,596) | — | — | 8,118 ms trong probe Codex lượt 4 | Tham khảo Node · — |

Năm dòng exe lấy nguyên từ chuẩn bị, không có dòng nào tăng cả quá 20% và quá 10 ms. Web dùng giờ thật và hai `requestAnimationFrame`, build đặt ngày neo 04/11/2026 cho lượt nhập. Node dùng `openAppData`, `readBackup`, `importBackup` và `tables`. Phép đo web và Node không dùng để suy ra delta của exe. Không có phát hiện P.

## 7. Mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 5 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 5 |

5 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN ghi thành phát hiện.

## 8. Đã xét, không thấy thêm

| Trục | Phần đã chạy / đọc |
|---|---|
| R | Hai bảng R. DR6-145 còn phần mô tả gốc. |
| E | Tên dài trong hộp/Team/Báo cáo và hai vị trí mới N1/N6. Thêm tuyến lỗi N2, hộp lồng N3 và hàng sau 100 N4. |
| C | Chuyển nhóm 5d–5e, cổng KYC, 5a/5d và K44, 10a/10b/10d, tên thương hiệu và tuyến mở lại. Đã xét, không thấy lệch mới ở các chỗ này. |
| D | Ca bàn giao RE, ngày sinh/giới tính SYSTEM, KYC mâu thuẫn, xóa mềm, file tải và lệnh sau listener ném. Đã xét, không thấy ghi sai mới. |
| G | N7 chạy cổng thiếu/mâu thuẫn. Ca `save-state:225` dùng câu trả lời OpenCode giả qua seam, không kết nối provider. Đã xét, không thấy cổng hiển thị sai. Guardrail nội dung thuộc C. |
| S | Mạng browser bị chặn ngoài 127.0.0.1 từ fixture đầu, `window.open` giả lập và service worker tắt. Đọc đường render dữ kiện và tên, bộ lọc lỗi file, chặn reload/back trên seam exe. Đã xét, không thấy ranh giới mới bị vượt trong các ca chạy. |
| P | Bảng đo `6, không thấy quá ngưỡng trong nhóm thao tác đo. |
| B | `tsc`, codemap, đồ thị phụ thuộc và kích thước diff/bundle ở `6, không thấy bloat có chi phí riêng. |
| T | Đột biến cổng và e2e ở `9. Hai biến thể mới của bộ chặn ở CXR5-D2/D5. |
| A | N3/N5/N7 và 9 ca topbar focus. Đã xét Tab/Shift+Tab, Enter/Space, Escape, focus quay lại, cây trợ năng nút chờ, contrast và catalog i18n. Không thấy lỗi khác trong các ca này. |

## 9. Phụ lục

- Nguồn ở `D/copy/`. `playwright.review.config.ts` và `serve-review.mjs` dựng bản web, fixture gắn chặn HTTP/WebSocket ngoài 127.0.0.1, `window.open` giả, service worker tắt. Cổng 4317 riêng. `VITE_DEMO_ANCHOR` 15/09/2026 dùng để chạy các e2e có sẵn, đổi riêng lần đo N4 thành 04/11/2026. Số bundle ở `6 lấy từ build chuẩn bị không neo.
- `guard-probe.mjs` / `guard-probe.log`, `e2e/review-D.spec.ts` / `e2e-extra.log`, `e2e/review-D-extra.spec.ts` / `e2e-new-confirm.log` và `e2e-load-final.log`. `load-and-listener.mjs` / `load-and-listener.log` chạy qua lớp dữ liệu app. Dùng file tải nguyên byte. `inventory-and-docs.mjs` / `inventory-and-docs.log` ghi từng tệp và đối chiếu tài liệu.
- Unit `static-and-unit.log` 541/541 trong 34 tệp. `cross-unit.log` 132/132 trong 4 tệp nối, gồm giờ, AiJobs, DB common và backup. `deps.log` và `doc-format.log` là kết quả cổng sau khi dùng đúng tên CLI dependency-cruiser.
- Browser `e2e-base.log` có 53 xanh và hai kiểm theme đòi hostname localhost trong khi harness bắt buộc 127.0.0.1. Sửa đúng hai kỳ vọng hostname ở bản chép, `e2e-extra.log` chạy lại theme qua hết. Cùng log đó các ca KYC, dải lưu và N1/N2/N3/N5 xanh. `e2e-remaining.log` có 66 xanh. `e2e-new-confirm.log` xanh N6/N7. `e2e-load-final.log` xanh N4.
- Hai điểm điều chỉnh harness của N4: lần đầu neo 15/09 bị luật ngày backup từ chối đúng. Lần kế mở hộp xác nhận ở ngày 04/11 nhưng số kỳ vọng là tổng gồm xóa mềm. Lần cuối dùng số sống hiện trong hộp. N6 dùng nhãn chọn gồm cả team. Giữ log các lần trước để phân biệt lỗi probe với lỗi màn.
- Đột biến chỉ trong bản chép. `mutations.mjs` giữ nguyên byte gốc rồi trả trong `finally`. `mut-unit.log` và `mut-e2e.log` chứa lệnh, assertion và exit code.

| Đột biến | Kết quả |
|---|---|
| DR6-37, lùi CustomerKyc trước #920 | Token lint đỏ tại `CustomerKyc.tsx:95` |
| DR6-145, lùi bộ chặn trước #920 | 9 unit đỏ |
| DR6-146, R109c/RB2c | 2 e2e đỏ đúng nhánh |
| DR6-147, lùi SaveWarning/CloseGuard trước #911 | 2 e2e đỏ đúng nhánh |
| DR6-148, bỏ wrap của Dialog | 2 e2e đỏ ở title/subtitle |
| DR6-149, lùi Choices trước #920 | 1 e2e đỏ ở bán kính góc |
| T-331, bỏ định vị ô header ẩn | 1 unit đỏ |
| T-332, bỏ mã trong khóa i18n chung | 2 unit đỏ |
| T-333, lùi guard trước #965 | 2 unit đỏ |
| T-337, bỏ class aria-disabled | 1 unit đỏ |
| T-341/T-342, vô hiệu tăng bộ đếm kiểu | 1 unit đỏ, thêm cả ba báo cáo ở thẻ mở/đóng/tự đóng |

- Mọi đột biến đã chạy đều bị ít nhất một cổng nhắm đích giết. Các test ghim của T-341/T-342 kiểm giới hạn mà Issue yêu cầu ghi. Các Issue thuần tài liệu được kiểm bằng nội dung, diff và hành vi tương ứng.
- Chưa chạy lại toàn bộ verify/e2e, chưa đo lại exe và chưa dùng trình đọc màn hình rời. Cổng chuẩn bị, số exe và số bundle lấy theo `common/baseline.md`. Probe đóng app chạy với seam IPC của e2e. 


- SHA cuối `37a80b662861d308a110d1e2b0f65ad13b91fb51`. `git status --short` cuối phiên rỗng, như đầu phiên.
- Xong 2026-11-04 23:48:27 +07:00, Asia/Bangkok.
