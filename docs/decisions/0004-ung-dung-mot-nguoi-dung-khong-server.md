# ADR-0004: Ứng dụng một người dùng, dữ liệu local, không server

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §2.2 (W1), §7 (Q1, Q2, Q16)
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Yêu cầu vừa nói "app Windows portable" vừa nói "nhiều RE thuộc nhiều team". App portable + SQLite local chỉ phục vụ một người trên một máy.

## Quyết định

1. Chỉ **Owner** dùng, trên Home PC hoặc Office Laptop (Q1) → SQLite local, không server.
2. **Không đăng nhập/phân quyền** (Q2). "Vai trò" Owner/TL/RE chỉ là **góc nhìn** (toàn bộ / team / RE); Owner nhập liệu thay cho mọi RE.
3. Tầng dữ liệu đặt sau **interface repository** để giữ đường mở rộng sang DB chung.
4. Dữ liệu 100% giả lập; demo 3 team × 10 RE.
5. Thuật ngữ (Q16): "RM" = RE; "Project-1" trong đoạn ranh giới AI = Project-2.

## Phương án đã cân nhắc

- **Server + DB chung cho 30 RE** — loại: vượt phạm vi, cần hạ tầng và bảo mật đa người dùng.

## Lý do

Khớp người dùng thật (một Owner), giữ app portable và đơn giản.

## Hệ quả

- Đồng bộ dữ liệu app giữa 2 máy cần cơ chế riêng → ADR-0010.
- Bộ chuyển góc nhìn là tính năng UI, không phải bảo mật.

## Phụ lục — RE đổi tên thành RM (Owner duyệt 10/11/2026)

Nguồn: phản hồi dùng thử exe `5215b2e` của Owner ngày 10/11/2026 (ý 1) và các câu trả lời cùng ngày, spec `docs/design/phase-6-phan-hoi-dung-thu.md` §1, §3.

- Người tư vấn tên **RM** (Relationship Manager) ở mọi nơi: giao diện, file Excel, prompt AI, hướng dẫn sử dụng, mockup, từ điển, cả code lẫn dữ liệu lưu. Owner chọn "Đổi cả tên trong code", rồi "Duyệt phần A" (spec §3.1).
- Mục 5 của Quyết định ("RM" = RE, Q16) nay theo chiều ngược lại: tên dùng là RM. "RE" ở thân ADR này (Bối cảnh, mục 2, mục 4, Phương án đã cân nhắc) và trong tài liệu lịch sử (thân ADR, spec các phase, báo cáo review, file metrics) nghĩa là RM; thân ADR không sửa (spec §3.4, `CONTEXT.md`).
- Nghĩa không đổi: góc nhìn Toàn bộ / Team / RM là cách xem, không phải tài khoản; dữ liệu giả lập 3 team × 10 RM.
