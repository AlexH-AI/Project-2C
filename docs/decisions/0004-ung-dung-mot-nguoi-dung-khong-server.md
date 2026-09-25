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
