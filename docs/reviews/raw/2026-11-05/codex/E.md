XONG — codex gói E lượt 5, 2026-11-05 00:27:06 +07:00

## 1. Phiên review

- Codex, gói E — Lịch hẹn, chỉ số, quản lý. Phiên mới, bắt đầu 2026-11-05 00:10:13 +07:00 (Asia/Bangkok).
- SHA đầu phiên `37a80b662861d308a110d1e2b0f65ad13b91fb51`. `git status --short` đầu phiên rỗng.
- Codex Desktop qua API, CLI trên máy `codex-cli 0.162.1`, PowerShell, Node `v24.20.0`, Vitest 5.0.1, Playwright trên Microsoft Edge. Model GPT Sol 6.1 theo lựa chọn Owner trong prompt. Metadata phiên không cung cấp mức suy luận.
- Worktree `C:\workspace\Project-2C-review-2`, Home PC `DESKTOP-KDURKJP`. Probe và bản chép dưới `codex\E\`.

## 2. Bảng R

### R1 — theo mã

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-37 | #790 → #845; #901 → #920 | **ĐÃ SỬA** | Đối chiếu L·CL-E5 và L·CL-D5 lượt 1, cùng phần còn thiếu §3.1 lượt 4. `static.mjs sep` báo 0 trên 38 file SP E và `CustomerKyc.tsx`. Trả lại cặp mũi tên bảng So sánh team, × trong 6b, dấu nối và gạch ngang trong 6a thì bộ chặn bắt cả ba. Trả lại mẫu `{trường}: {giá trị}` trong JSX của `CustomerKyc.tsx:95` thì R37-KYC bắt `}: {` đúng dòng. | Kiểm cả fallback cột Thuộc trong Thùng rác và dấu gạch ngang của chi tiết lịch. Khuôn KYC dùng `kyc.factLine` trong `vi.ts:98`. Dấu cùng chữ trên màn được e2e giữ theo hành vi, bộ chặn giữ việc đặt chữ ở i18n. |
| DR6-148 | #902 → #922; #932 → #941; #951 → #958 | **ĐÃ SỬA** | 6 ca `long-names.spec.ts` xanh ở 1.100 và 1.440 px, gồm tiêu đề/phụ đề, Team, bảng So sánh team và Báo cáo Theo team/RE ở cuối vùng cuộn. Trả riêng `TeamCompare.tsx` và `ReportTable.tsx` về `2e51e25` làm đúng hai ca bảng đỏ ở 1.100 px. | Dòng Đang xem và tiêu đề biểu đồ ở góc nhìn Team là hai đường hiển thị khác, E05 / E09, CXR5-E1 / E2. |
| DR6-150 | #903 → #924; #933 → #946; #951 → #958 | **ĐÃ SỬA** | E2E hiện có tái hiện U+200B/U+0085/U+2060 ở Case size, ngày 6b/6c/6e và giờ trống 6b. Trả `trim()` vào Case size làm 2 unit test đỏ với `error: 'empty'`. Trả `trim()` vào `pending` của 6b làm e2e đỏ vì đã có `aria-invalid` trước Lưu. E07/E10 lưu 6f và nhập bù lịch rồi ghi 6d với Case size trống. | E07: dán giờ có BOM / U+200B / U+2060 vẫn lưu đúng phút. E08: thời điểm báo lỗi của ô bắt buộc HĐ khác các ô ngày đã sửa, CXR5-E3. |
| DR6-151 | #903 → #924; #933 → #946 | **ĐÃ SỬA** | E2E hai KH cùng tên và cùng N4 có mã riêng. R151 truyền tập mã rỗng vào `SettingsTrash`, test đợi 2 nút có mã nhưng nhận 0. Test nhân sự cùng tên khác vai trò/team xanh. R151-person bỏ vai trò/team, test đỏ, mất `· TL · Sao Mai`. | E11 lọc theo tên, khôi phục một KH, nút của dòng duy nhất còn lại bỏ mã. Test `trash-view.test.ts` có KH khác nhóm và người không có team. Khớp K41 Q3. |
| DR6-152 | #903 → #924 | **ĐÃ SỬA** | `static.mjs exports` báo `exposed:false, consumers:[]`. Thêm lại `export` làm kiểm tĩnh tiêu chí Issue đỏ. Ca nhắc 1.000 của `trash-view.test.ts` và e2e xanh. | Thêm export không làm đổi hành vi lúc chạy, nên đột biến này dùng kiểm tĩnh. Ngưỡng 999 → 1.000 vẫn được unit test giữ. |
| DR6-153 | #903 → #924 | **ĐÃ SỬA** | Tái hiện RB2e bằng cách bỏ vế Thử lại, `save-state.spec.ts:126` đỏ vì thiếu đúng vế đó. Tái hiện T305b bằng cách bỏ huy hiệu nhóm, `trash.spec.ts:197` đỏ ở ô Bản ghi. Hai ca xanh trên SHA ghim. | Nhập lại sau Thử lại thành công, và ca huy hiệu HĐ phân biệt Đã nộp / Đã phát hành xanh. |
| DR6-154 | #903 → #924; #933 → #946; #951 → #958 | **ĐÃ SỬA** | `dialog-keyboard.spec.ts` và `trash.spec.ts` giữ focus ở nút Đang nhập / Đang nạp lại / Đang dọn và giữ hộp khi bấm Escape. R154 thêm `disabled` thật lúc chạy, ca 10a đỏ ở `toBeFocused`. | E06 thử Enter và Space lặp khi đang chạy, hai Tab và hai Escape, chỉ 1 backup, sau đó focus về nút mở. Nút mờ 0,5 và có tên đọc được qua vai trò/nút trên Edge. |

### R2 — theo Issue

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-331 | #932 → #941 | **ĐÃ SỬA** | Test markup của DataTable giữ `relative` ở `th` tiêu đề ẩn. E2E giữ tiêu đề/phụ đề, TL 160 chữ, hai nút trong thẻ, tên TL thường một dòng, số đếm và mũi tên ở dòng đầu. T331 trả mũi tên về `items-center`, lệch 64,625 px thay vì tối đa 3 px. | Báo cáo với tên RE và team cùng dài vẫn đọc được các cột số khi cuộn hết. E05/E09 thử riêng hai vị trí ngoài bảng. |
| T-332 | #933 → #946 | **ĐÃ SỬA** | T332-time bỏ chuẩn hóa chuỗi trắng, `parseTime` trả `{ ok: false }` thay `{ ok: true, time: null }`. T332 đổi nút Chọn file… về `disabled` lúc đọc, ca focus 10a/10b đỏ. Bản chuẩn: Hủy, Escape, Đóng 10b và nhập xong đều trả focus đúng. Test giữ số lần mở file chooser. | Một khóa `customer.withCode` dùng ở `restoreLabel` và `inUseHelp`. Chú thích nằm trên ca Dọn sạch. Test `listeners.test.ts` giữ việc listener sau vẫn chạy khi listener trước ném. Kiểm sâu lớp dữ liệu/listener thuộc A/B/C. |
| T-337 | #951 → #958 | **ĐÃ SỬA** | T337 trả regex đọc giờ về `trim()` nhưng giữ chuẩn hóa kiểm rỗng, test dán giờ đỏ ở `14:00`. Test markup Button và e2e độ mờ 0,5 của nút đang chạy xanh. Ca TL 160 chữ giữ tiêu đề Team Bình Minh một dòng ở hai cỡ cửa sổ. | E02/E03 dán vào 6e, E07 dán vào 6b/6f. Giờ ngoài miền vẫn bị từ chối. E06 Enter/Space không khởi động thêm lượt. |
| T-350 | #1001 → #1011 | **ĐÃ SỬA** | Đổi hai chỗ `statusLabel(row, today)` về nhãn enum cũ làm 5/86 test `trash-view` đỏ, gồm tiêu đề, tên nút, hộp và chuỗi khôi phục. E04 qua nửa đêm, kiểm ô Bản ghi, tên trợ năng, hộp Không đổi nhóm KH, đếm trên lịch và chi tiết 6a sau khôi phục. Mockup `trash.html:192` khớp. | Unit kiểm cả hôm nay, ngày sau, có giờ / không giờ và trạng thái khác. Qua nửa đêm trước khi bấm Khôi phục, hộp đã mở cập nhật chữ cùng bảng. |
| T-353 | #1005 → #1009 | **ĐÃ SỬA** | Issue tài liệu. `nghiem-thu-v1.md:134`, `:143` và `:397` có đủ dòng sửa, ghi chú L2 và lệch mockup 6b. E01 kiểm 2026 và biên 60/61 ngày năm 2027. E02/E03 kiểm câu đọc lại 6e, lịch cũ hôm nay vào lịch sử ngay, lịch tương lai vào lịch sử từ ngày đó. | Giữ kết quả và ghi chú L2. Gợi ý ngày nhuận được chạy bằng đồng hồ Playwright, bổ sung ca mà L3 ghi chưa thử được trên ngày máy năm 2026. |

## 3. Phạm vi đã đọc

- 52 file theo luật `tools/size-report-core.mjs`: 38 file SP / 8.272 dòng và 14 file test / 4.700 dòng. Danh sách từng file và dòng vật lý ở [E/scope.json](E/scope.json).
- Mã màn từ dòng 1 đến hết theo nhóm: `routes/appointments` (6a–6h, lịch tháng/năm, view, parser ngày/giờ, kết quả, giữ nhóm, xóa), `routes/overview` (KPI, chart N4–N1, So sánh team), `routes/reports` (bảng, bộ đếm, Excel), `FilterBar`, `applied-filter`, `period-labels`, `Overview`; `Settings`, `SettingsBackup`, `SettingsDataFile`, `SettingsTrash`, `ConfirmWordDialog`, `RestoreDialog`, `trash-view`; `customers/CustomerPolicies`, `PolicyDialogs`, `policy-form`. Đọc các spec/test liên quan đến đường kiểm.
- Diff E `2e51e25..37a80b6`: 13 file SP +178 / −61; 3 file test +200 / −56. [E/diff-E.patch](E/diff-E.patch) lưu diff đầy đủ theo danh sách gói. Đọc thêm diff nối vào ở `CustomerKyc.tsx`, `TeamScreen.tsx`, `team-view.ts`, `Button.tsx`, `DataTable.tsx`, `vi.ts`, `listeners.ts`, `appointment-counts.ts`, các spec e2e giữ sửa, mockup 11a và hai dòng nghiệm thu.
- Nguồn hợp đồng: `CLAUDE.md`, `apps/desktop/CLAUDE.md`, `CONTEXT.md`, ADR-0013, spec Phase 3 §3.5/3.7/4/6, Phase 4 §1–4, Phase 6 §4.1/4.2/5.2, ADR-0007 phần ngày nhanh, các mockup từ index (`forms.css .choice`, `appointment-forms.html`, `appointments.html`, `overview.html`, `reports.html`, `policy-forms.html`, `settings-data.html`, `trash.html`), nghiệm thu v1 (các lượt, NT-LH, NT-TR, NT-BC và lệch đã biết).
- Đối chiếu `common/{plan,known,fixes,baseline}.md`, bốn tổng hợp lượt 1–4, các báo cáo gốc E trong bốn thư mục `docs/reviews/raw` đã ghim và vị trí gốc D của DR6-37. Probe Codex lượt 4 dùng lại cách dựng bản chép và loader cho Node.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| E01 | 6b thử `29/02` ở 2026, rồi cùng hộp vào 29/04 và 30/04/2027. Đối chứng 5/1, 28-9, 25:00 | 2026 và đúng 60 ngày không gợi ý; ngày 61 có Dùng 29/02/2028 và không có câu “App không tự đổi năm”. Bấm Dùng điền đúng ngày, không tự tạo lịch. | — |
| E02 | Đặt lịch hôm nay lúc 9:05, dời bằng giờ dán `U+200B 14 U+2060 :02`, rồi mở Lịch hẹn mới của KH | Giờ mặc định 09:05. Giờ mới 14:02. Câu đọc lại trong hộp và dòng Dời lịch trong Các lần hẹn trước đều có lý do. | — |
| E03 | Đặt lịch ngày mai, dời như E02, giữ hộp đặt lịch mở sang ngày cũ | Câu đọc lại có ngay trong 6e. Lịch sử chưa có dòng cũ ngay sau lưu, đến ngày cũ có. | — |
| E04 | Tạo và xóa lịch hôm nay, mở hộp Khôi phục, chuyển đồng hồ sang ngày sau và gửi sự kiện focus, đóng/mở lại rồi khôi phục | Dự kiến đổi thành Chưa ghi kết quả trong hộp, ô và tên nút. Lịch 6a, danh sách trong ngày và nhãn đếm cùng nhóm sau khôi phục. | — |
| E05 | Team 160 chữ liền, vào Báo cáo, chọn team, đo trước/sau Lọc ở 1.100 px | Dòng Đang xem đi tới x=2.366 px sau Lọc; chiều cuộn ngang main tăng từ 868 lên 2.134 px. Tên trong bảng Tổng hợp vẫn có. | CXR5-E1 |
| E06 | Giữ backup khi Nạp lại, nhấn Enter/Space nhiều lần trên nút đang chạy, hai Tab và hai Escape rồi thả backup | Nút giữ focus trong hộp, opacity 0,5, Hủy tắt, chỉ một backup, focus trả nút mở. | — |
| E07 | Dán giờ kèm BOM/ký tự vô hình ở 6b, ghi Đã gặp có Case size, sửa 6f thành Case size chỉ có ký tự vô hình và giờ 14:05 | 6b lưu 09:05. 6f lưu 14:05; mở lại Case size rỗng. | — |
| E08 | HĐ mới 8a, dán ký tự vô hình vào ngày và FYP trước khi bấm Lưu, so với trường ban đầu | Hai ô mang `aria-invalid=true` trước khi Lưu, trong khi đối chứng chưa báo. Khi Lưu báo 2 ô cần sửa. | CXR5-E3 |
| E09 | Team 160 chữ liền, vào Tổng quan, chọn góc nhìn Team rồi Lọc | Tiêu đề chart có khung 254 px, nội dung dài 2.136 px, tràn qua các cột kế tiếp. | CXR5-E2 |
| E10 | Dời lịch về ngày đã qua bằng Nhập bù, ghi Đã gặp với Case size chỉ có ký tự vô hình | Lưu được, chi tiết ghi Đã gặp. | — |
| E11 | Hai KH trùng tên, cùng N4, xóa cả hai, tìm theo tên trong Thùng rác, khôi phục một | Hai nút có hai mã khác nhau khi cùng trong danh sách. Nút còn lại bỏ mã ngay sau khôi phục. | — |

## 5. Phát hiện mới

### CXR5-E1 — Tên team dài tràn dòng Đang xem của Báo cáo

- **Mức:** Low
- **Trục:** E
- **Vị trí:** `apps/desktop/src/routes/FilterBar.tsx:70` (37a80b6), tên chèn ở dòng 80.
- **Tình trạng:** CONFIRMED
- **Liên quan:** DR6-148 · có từ trước, lượt 1–4 bỏ sót vị trí này. Diff từ lượt 4 rỗng ở `FilterBar.tsx`.
- **Kịch bản:** E05.
- **Mô tả:** Dòng Đang xem là phần tử con của hàng flex, và từ dài nhất trong tên team có thể buộc dòng rộng hơn cả màn. Bảng Báo cáo đã có giới hạn rộng riêng cho cột tên.
- **Tái hiện / bằng chứng:** Trên bản chép chạy `node node_modules/@playwright/test/cli.js test e2e/review-e.spec.ts --project=edge --no-deps -g E05`. `probe-final.log`: ở 1.100 px, mép tên trong dòng Đang xem trước Lọc x=661, sau Lọc x=2.366. `main.clientWidth=868`, `scrollWidth=2.134` sau Lọc, trước đó 868. Thanh chọn góc nhìn ngoài main đã làm `document.scrollWidth=2.899` trước Lọc, nên dùng số của chính main và mép tên để tách lỗi của dòng Đang xem.
- **Ảnh hưởng:** Người xem báo cáo của team có tên liền dài phải cuộn ngang mới đọc hết phần góc nhìn đang áp dụng. Lỗi ở trình bày.
- **Đề xuất:** Cho dòng Đang xem co theo khung và ngắt từ dài. Ghim ca đổi góc nhìn rồi Lọc ở bề rộng 1.100 px. Khoảng 2–4 dòng SP, thêm test.

### CXR5-E2 — Tiêu đề biểu đồ team tràn qua cột kế tiếp ở Tổng quan

- **Mức:** Low
- **Trục:** E
- **Vị trí:** `apps/desktop/src/routes/overview/StageBlock.tsx:73` (37a80b6).
- **Tình trạng:** CONFIRMED
- **Liên quan:** DR6-148 · có từ trước, lượt 1–4 bỏ sót ở góc nhìn Team. Diff từ lượt 4 rỗng ở `StageBlock.tsx`.
- **Kịch bản:** E09.
- **Mô tả:** Tiêu đề chart ghép tên team và cụm số cuối kỳ trong flex. Tên liền dài vượt cột dù cột có `min-w-0`.
- **Tái hiện / bằng chứng:** Cùng lệnh Playwright với `-g E09`. `probe-final.log`: team 160 chữ W, cửa sổ 1.100 px, `h3.clientWidth=254`, `h3.scrollWidth=2136`, `main.clientWidth=868`, `main.scrollWidth=2711`. Bản chụp ở `E/probe-final-run/` của E09.
- **Ảnh hưởng:** Người xem góc nhìn Team có thể đọc nhầm tiêu đề và cụm số cuối kỳ sang biểu đồ bên cạnh.
- **Đề xuất:** Bọc riêng tên team trong phần tử cho co/ngắt, cho cụm số xuống hàng khi chật, giữ tên biểu đồ đọc được. Khoảng 5–10 dòng SP, thêm test.

### CXR5-E3 — Ngày và FYP của HĐ báo thiếu trước khi Lưu nếu ô chỉ có ký tự vô hình

- **Mức:** Low
- **Trục:** E
- **Vị trí:** `apps/desktop/src/routes/customers/PolicyDialogs.tsx:79` (37a80b6).
- **Tình trạng:** CONFIRMED
- **Liên quan:** DR6-150 · biến thể ở HĐ, có từ trước. Diff từ lượt 4 rỗng ở `PolicyDialogs.tsx`.
- **Kịch bản:** E08.
- **Mô tả:** Điều kiện hiện lỗi dùng `text.trim()`, còn phần đọc ngày và FYP đọc theo `normalizeText`. Với chuỗi nhìn rỗng nhưng có ký tự vô hình, lỗi hiện ngay dù hộp chưa được gửi. Cùng điều kiện dùng cho ô nộp và phát hành.
- **Tái hiện / bằng chứng:** Cùng lệnh Playwright với `-g E08`. HĐ mới 8a, dán U+FEFF/U+200B/U+2060/U+0085 vào Ngày nộp và FYP nộp. `probe-final.log`: trước khi bấm Lưu, `aria-invalid=["true","true"]`, mô tả `[["Nhập ngày."],["Chưa nhập số tiền."]]`. Đối chứng trước khi dán, hai ô không có `aria-invalid`. Sau khi bấm Lưu, hộp vẫn mở, báo 2 ô cần sửa như mong đợi với hai ô bắt buộc.
- **Ảnh hưởng:** RE xóa phần nhìn thấy của dữ liệu đã dán hoặc dán nhầm ký tự vô hình nhận lỗi sớm ở ô có vẻ trống.
- **Đề xuất:** Dùng cùng chuẩn hóa khi quyết định chờ Lưu. Giữ lỗi bắt buộc sau lần thử lưu. Khoảng 2 dòng SP và ca e2e 8a/8b.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã kiểm | Dữ liệu | Kết quả | ID |
|---|---|---|---|
| `scope.json`, diff thống kê | 52 file gói E ở SHA ghim, so lượt 4 | SP 8.272 (+117); test 4.700 (+144). Phần tăng SP tập trung ở xác nhận đang chạy, nhãn Khôi phục, và class cho tên dài. | — |
| `tsc --noEmit --noUnusedLocals --noUnusedParameters`, codemap, dependency-cruiser | App desktop, bản đồ repo, apps/packages | TSC exit 0; bản đồ export đúng; 354 module / 1.582 cạnh, 0 vi phạm. | — |
| `PURGE_REMINDER` và nơi gọi phần mới | E, i18n và team-view | Hằng cục bộ, 0 nơi import. `ConfirmButton`, `codedCustomers`, `statusLabel` đều có nơi gọi SP. | R1 DR6-152 |
| Kích thước bundle/exe chuẩn, `common/baseline.md` | Toàn app; bundle không dùng neo e2e | JS/CSS 2.366.456 B (+8.029 so lượt 4), gzip 699.761 B (+2.627); index.js 892.184 B (+7.486). Chart 172.450 B gzip và ExcelJS 255.572 B gzip, cùng lượt 4. Exe 5.649.408 B, bằng G7 và lượt 4. Các số là toàn app. | — |

### 6.2 Hiệu năng

Exe release SHA ghim lấy từ `common/baseline.md`, Home PC. Mốc #656 là `dae9df3`, G7 là `233c77e`, lượt 4 là `2e51e25`. Dữ liệu tải `load-2026-10-12-seed6.p2cbackup`, 16.034.517 B, SHA256 `B3C9903321ABCCDF3301818D35DAD7D7C6EAC48D73814286694B554C94C77293`. Sau nhập có 10.255 lịch hẹn đang dùng, 1.481 KH đang dùng, 113 dòng Thùng rác. Mỗi dòng dưới là trung vị ms của baseline, 5 lượt trừ Dọn sạch một lần.

| Thao tác exe | Sau #656 | G7 | Lượt 4 | SHA ghim | Ngưỡng | ID |
|---|---:|---:|---:|---:|---:|---|
| Đổi kỳ Năm / Tháng Tổng quan | 16 / 14 | 17 / 14 | 17 / 17 | 16 / 14 | <200 | — |
| Đổi kỳ Năm / Tháng Báo cáo | 10 / 10 | 10 / 10 | 10 / 10 | 10 / 10 | <200 | — |
| Tải lại Tổng quan / Lịch hẹn / Báo cáo | 398 / 391 / 376 | 395 / 385 / 367 | 405 / 393 / 373 | 407 / 391 / 371 | <500 | — |
| Xuất Excel | 20 | 25 | 29 | 21 | ≤500 | — |
| Đọc / nhập / xuất backup | 835 / 43 / 438 | 975 / 44 / 435 | 977 / 47 / 436 | 983 / 50 / 438 | ≤2.000 / 500 / 1.000 | — |
| Mở Thùng rác | 34 | 33 | 32 | 33 | <200 | — |
| Hẹn tiếp ở kỳ Tháng / Năm | 101 / 107 | 112 / 109 | 108 / 113 | 111 / 108 | ≤300, Năm − Tháng ≤50 | — |
| Dọn sạch đến thông báo 11j | — | 130,5 | 123,3 | 128,0 | ≤500 | — |

Phép đo Tháng/Năm của lượt 4 dùng lịch khác (plan §L5.6). Từng phép đều trong ngưỡng. Đọc backup tăng khoảng 18% so #656, dưới ngưỡng nhiễu 20% dù chênh tuyệt đối 148 ms. Các phép có mốc đều không xấu hơn theo điều kiện đồng thời >20% và >10 ms. Số exe là phép đo bước chuẩn bị. Gói E chạy lại riêng phần Node.

| Đã đo lại trong Node | Dữ liệu | n | SHA ghim, trung vị (min–max), ms | Lượt 4 cùng đường gọi, ms | ID |
|---|---|---:|---:|---:|---|
| `teamCompare`, năm / tháng | Dữ liệu tải, Toàn bộ | 9 / 9 | 2,744 (2,642–4,158) / 1,455 (1,395–1,553) | 2,691 / 1,425 | — |
| `reportRows`, năm / tháng | Như trên | 9 / 9 | 8,029 (7,343–9,626) / 5,741 (5,570–7,088) | 7,638 / 5,570 | — |
| `monthGrid` | Tháng 10/2026, mọi lịch | 9 | 0,571 (0,542–0,735) | 0,566 | — |
| `listTrash` | 113 dòng, gồm 76 lịch xóa riêng | 9 | 19,565 (18,363–20,844) | 19,706 | — |
| `purgePlan` | 113 dòng | 9 | 0,015 (0,014–0,027) | 0,015 | — |
| `codedCustomers` + nhãn ô và tên trợ năng | 113 dòng | 9 | 0,266 (0,234–0,316) | — | — |
| `AppData.purgeTrash` | Nhập lại dữ liệu tải trước mỗi lần, 113 → 0 | 5 | 92,485 (89,416–95,731) | 89,584 | — |

Phép đo Node `E/perf-probe.mjs` mở dữ liệu qua `openAppData` và nhập backup qua app. Home PC, Node v24.20.0, 00:21 +07:00, sau Playwright, Codex Desktop mở. Phiên này không chạy việc đo/test khác cùng lúc. Số min/max thô ở `E/perf-results.json`. Không thấy hồi quy có số đo đạt điều kiện báo phát hiện P.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

3 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới. R1 7/7 ĐÃ SỬA, R2 5/5 ĐÃ SỬA trong phạm vi gói E.

## 8. Đã xét, không thấy ngoài mục 5

| Trục | Bằng chứng |
|---|---|
| R | Hai bảng trên, thử lại đường lỗi cũ và phần chưa làm theo mô tả ban đầu; 19 đột biến được bắt. |
| E | Biên ngày nhuận, đổi ngày khi hộp còn mở, giờ có ký tự vô hình, Case size khi ghi/sửa, tên KH trùng trước/sau khi khôi phục, thao tác bàn phím lặp khi hộp bận. Kết quả E01–E11. |
| C | NT-LH-19/28, nhãn 6a ↔ Thùng rác qua đổi ngày, K41 Q3, TR-11/12/13 (1.000 dòng, dọn và giữ lại). Đối chiếu mockup, test và nhãn trên màn. |
| D | Các ca UI ghi gặp, sửa và giữ nhóm, xóa mềm, khôi phục, nhập backup, từ chối khi lưu lỗi rồi Thử lại; phép đo AppData dọn 113 → 0. Không thấy dữ liệu sai ngoài các sai lệch hiển thị đã nêu. |
| G | Ranh giới nối AI đọc ở `AppointmentDialog`, `AppointmentsScreen`, `OutcomeDialog` và `Settings`; gói E không sửa prompt. Chỉ dùng dữ liệu giả lập, không có lời gọi AI thật. |
| S | Test mã hóa tên team trong tooltip và tên file Excel, ca D7 lưu lỗi chặn Nhập backup / Dọn sạch, giữ hộp lúc đang chạy, số lần backup đúng. |
| P | Hai bảng §6.2, gồm số exe bước chuẩn bị và đo lại Node trên đúng hash tải. |
| B | Kiểm unused, export, codemap, đồ thị phụ thuộc và cỡ build §6.1. |
| T | Các ca mới của #924 và các PR G7 phản ứng với đột biến gỡ phần sửa. Kiểm riêng lớp nối tên nút, huy hiệu và focus. |
| A | DR6-37 gốc, tên nút khôi phục K41, tên nút đang chạy, `aria-disabled`, Escape/Tab và phục hồi focus của 10a–10c/11i, th tiêu đề ẩn của DataTable. Kiểm DOM/cây trợ năng bằng Playwright. |

## 9. Phụ lục

- `E/setup.mjs`: chép 826 file tracked và nối junction thư viện đã có. Cấu hình Playwright bản chép dùng địa chỉ và cổng riêng `127.0.0.1:4196`, chỉ cho request nội bộ và blob/data, thay `window.open` từ init script trước khi tải trang. Edge, dữ liệu giả lập, đồng hồ neo 15/09/2026 theo fixture, hai worker ở đối chứng/probe. `vite build` gọi trực tiếp từ Node. Vòng đầu timeout do địa chỉ listen, chỉnh host rõ rồi chạy lại. `e2e-retry.log`: **140/140** ca gốc xanh. `unit.log`: **380/380** test (18 file) xanh; kiểm bổ sung nút, DataTable, listener **4/4** xanh (có test trùng lần chạy chính).
- `E/probe.spec.ts` được chép thành `copy/e2e/review-e.spec.ts`. `probe-final.log`: **8 ca xanh, 3 assertion đỏ đúng ở E05/E08/E09**. `probe-final-run/` giữ ảnh và trace. Hai lần đầu của E04 tìm bản ghi trong danh sách cả tháng đang giới hạn số dòng. Lần cuối chọn ngày và mở bản ghi bằng bảng Trong ngày, đúng đường xem lịch cũ. Các ca UI đi qua lớp dữ liệu của app. Ca Nhập backup/Nạp lại/Dọn sạch dùng seam exe của repo, không chạy exe thật trong phiên kiểm UI.
- `E/mutations.mjs` và `E/mutations-extra.mjs`: chỉ gỡ phần sửa trên bản chép, kiểm SHA256 sau hoàn tác của cả 12 file đã sửa trên bản chép khớp worktree. Hoàn tác bằng `finally`. `E/mutations/results.jsonl` và log theo ID lưu **19/19 bị bắt**. R37, R37-KYC, R37-6a, R37-6b, R152 bị kiểm tĩnh bắt; 14 đột biến còn lại bị assertion unit hoặc Playwright bắt. Lệnh và bằng chứng từng dòng ở §2.
- `E/static.mjs`, `E/unused.log`, `E/perf-probe.mjs`, `E/perf.log`, `E/perf-results.json`, `E/progress.md` lưu kiểm tĩnh, phép đo và nhật ký ghi dần. Mốc exe dùng kết quả bước chuẩn bị của SHA ghim, cùng máy và dữ liệu.
- SHA cuối phiên `37a80b662861d308a110d1e2b0f65ad13b91fb51`. `git status --short` cuối phiên rỗng, như đầu phiên.
- Xong: 2026-11-05 00:27:06 +07:00 (Asia/Bangkok).
