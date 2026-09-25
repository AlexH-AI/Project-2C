# ADR-0013: Hướng UI — dark mode, màu nhấn vàng champagne, bộ lọc thời gian thống nhất

- **Trạng thái:** Accepted (G3, Owner 28/09/2026 — duyệt với điều chỉnh, điểm vòng 1: 8/10)
- **Ngày:** 2026-09-28
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
6. **Màn hình chính:** Tổng quan hôm nay · Lịch hẹn · Khách hàng (kanban N4→N1 + cột Đã đóng gồm Tạm hoãn / Mất cơ hội) · Hồ sơ KH (dữ kiện KYC 8 chiều, dòng thời gian, KYC Intelligence ở cột phải).
7. **AI trên UI:** chỉ gợi ý, mọi giả thuyết trỏ về dữ kiện, "mức bằng chứng" deterministic, không nút hành động do AI kích hoạt (ADR-0009).

## Phương án đã cân nhắc

- Màu nhấn xanh dương / xanh ngọc — Owner chọn giữ vàng champagne (hợp phân khúc HNW/UHNW).
- Hiển thị định nghĩa N4–N1 dưới tiêu đề cột — Owner bỏ.
- Cột "Đã đóng" thành tab riêng — Owner giữ cạnh kanban.

## Hệ quả

- T-007 dựng `packages/ui` từ các token trên; component bộ chọn kỳ và bảng sắp xếp được là component dùng chung bắt buộc.
- Font Be Vietnam Pro phải đóng gói cục bộ (app chạy offline, CSP chặn nguồn ngoài).
- Chart (#8) phải theo tokens màu này; ADR chọn thư viện chart sẽ là ADR-0014.
