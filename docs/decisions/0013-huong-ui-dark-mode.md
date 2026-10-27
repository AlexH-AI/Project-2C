# ADR-0013: Hướng UI — dark mode, màu nhấn vàng champagne, bộ lọc thời gian thống nhất

- **Trạng thái:** Accepted (G3, Owner 26/09/2026 — duyệt với điều chỉnh, điểm vòng 1: 8/10)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §4.6; C6; mockup `docs/design/mockups/` (issue #6)
- **Commit / PR:** PR #13

## Bối cảnh

Kế hoạch yêu cầu Owner duyệt mockup dark mode các màn hình chính trước khi dựng `packages/ui` (G3). Thiết kế của 2C làm độc lập với Project-2.

## Quyết định

1. **Tokens** (định nghĩa tại `docs/design/mockups/mockups.css`, chuyển sang `packages/ui` ở T-007):
   - Nền phân lớp xám-xanh `--bg-0…3` (#0B1017 → #212C3A), không đen tuyệt đối.
   - **Một màu nhấn: vàng champagne `--accent` #D9B26A** — nút chính, mục đang chọn, focus.
   - **`--heading` = `--accent`** cho đề mục bên trong thẻ (Next Best Actions, Discovery Strategy, nhóm thông tin) — không dùng trắng mặc định.
   - Màu ngữ nghĩa riêng: N4 #94A3B8 · N3 #6FA8FF · N2 #B49AFB · N1 #3FD69A · Tạm hoãn #E3A94F · Mất cơ hội #F07E7E · HĐ nộp #6FC8E8 · HĐ phát hành #3FD69A.
   - Mọi cặp chữ/nền đạt WCAG AA (thấp nhất 4,89:1). Badge luôn có chữ, không chỉ dựa vào màu.
2. **Chữ & số:** Be Vietnam Pro (nhúng cục bộ trong app), `tabular-nums`, tiền "1,2 tỷ" / "500 tr", ngày `dd/mm/yyyy`.
3. **Nhóm N4–N1:** chỉ hiển thị nhãn; **không** hiển thị định nghĩa trên UI (Owner: định nghĩa ngầm hiểu).
4. **Thời gian:** mọi màn có dữ liệu theo thời gian dùng chung **bộ chọn kỳ Ngày · Tuần · Tháng · Năm · Tùy chọn** + ‹ ›; mọi cột ngày/giờ trong bảng **sắp xếp được** (tiêu đề cột bấm được). Lịch hẹn có chế độ Ngày / Tuần / **Tháng**.
5. **Bố cục:** mật độ vừa; nhóm khối thông tin để không để trống vô ích (thẻ cao đều, khối phụ lấp cột ngắn).
6. **Điều hướng:** sidebar trái có icon cho mọi mục (Tổng quan hôm nay, Lịch hẹn, Khách hàng, Báo cáo, Team & nhân sự, Cài đặt) — icon nét 18px, cùng màu chữ, mục đang chọn màu nhấn.
7. **Màn hình chính:** Tổng quan hôm nay · Lịch hẹn · Khách hàng (kanban N4→N1 + cột Đã đóng gồm Tạm hoãn / Mất cơ hội) · Hồ sơ KH (dữ kiện KYC 8 chiều, dòng thời gian, KYC Intelligence ở cột phải).
8. **AI trên UI:** chỉ gợi ý, mọi giả thuyết trỏ về dữ kiện, "mức bằng chứng" deterministic, không nút hành động do AI kích hoạt (ADR-0009).

## Phương án đã cân nhắc

- Màu nhấn xanh dương / xanh ngọc — Owner chọn giữ vàng champagne (hợp phân khúc HNW/UHNW).
- Hiển thị định nghĩa N4–N1 dưới tiêu đề cột — Owner bỏ.
- Cột "Đã đóng" thành tab riêng — Owner giữ cạnh kanban.

## Hệ quả

- T-007 dựng `packages/ui` từ các token trên; component bộ chọn kỳ và bảng sắp xếp được là component dùng chung bắt buộc.
- Font Be Vietnam Pro phải đóng gói cục bộ (app chạy offline, CSP chặn nguồn ngoài).
- Chart (#8) phải theo tokens màu này; ADR chọn thư viện chart sẽ là ADR-0014.

## Phụ lục 27/10/2026 — tên Heritas L-CRM: logo dạng ảnh, font thương hiệu (T-308 #852)

Owner 26–27/10/2026: tên v1.0 là **Heritas L-CRM**, slogan "Where legacy meets trust". Chỉ đổi phần nhìn thấy (logo, icon, tên ở góc sidebar, tiêu đề cửa sổ); tên mã Project-2C, tên file (`project2c.exe`, `Project2C-data\`, backup) và câu báo lỗi giữ nguyên. Sau bản thử chạy trên app, Owner chọn cách (c) (G3) và duyệt font Playfair Display (G4).

- **Logo là ảnh:** ba mảnh cắt từ ảnh gốc của Owner (`apps/desktop/brand/`): cây và vòng cung (rộng 88 px), chữ "Heritas" có chiếc lá thay dấu chấm chữ "i" (150 px), "— L-CRM —" cùng tỉ lệ (≈ 132 px). Các mảnh là PNG nền trong suốt, cắt ở 3× cỡ hiện (`apps/desktop/src/assets/brand/`), xếp dọc giữa góc sidebar. Logo giữ màu gốc (navy, vàng) trên nền tối. Đó là màu trong ảnh, không thành token UI: màu nhấn của UI vẫn chỉ là `--accent` (§1).
- **Viền:** cây và "Heritas" có viền champagne nhạt rất mỏng (`--brand-outline`): bốn `drop-shadow` 0,5 px, thành một nét 1 px ở 1×. Viền này cho navy nổi trên nền tối mà không cần ô trắng. "L-CRM" đã vàng nên không viền.
- **Slogan:** chữ thật, không viền (viền trên chữ nghiêng 13 px sẽ nhòe). Font Playfair Display nghiêng 400, 13 px, màu `--brand-slogan` #E8D3A2 (12:1 trên `--bg-1`). Đây là font thương hiệu `--font-brand`, chỉ dùng cho slogan; chữ UI vẫn là Be Vietnam Pro (§2). Font đóng gói cục bộ như Be Vietnam Pro: một file woff2 bộ Latin của `@fontsource/playfair-display` 5.3.0, OFL 1.1. CSP của exe không đổi.
- **Icon exe / taskbar / tab:** cây trên ô trắng bo góc. Nguồn là PNG 1024 px `apps/desktop/app-icon.png` (thay `app-icon.svg` chữ "2C"), cây phóng 1,3× từ ảnh gốc. `tauri icon` sinh các icon của exe; favicon của bản web là icon 32 px trong bộ đó.
