---
description: Kết thúc phiên — cập nhật HANDOFF, commit WIP, push
argument-hint: "[mô tả ngắn việc đang làm]"
---

1. Cập nhật `docs/state/HANDOFF.md` theo đúng khung đang có:
   - **Cập nhật:** ngày hôm nay; **Máy:** `$env:COMPUTERNAME`; **Nhánh:** nhánh hiện tại; **Phase**.
   - **Đang làm:** task/Issue, trạng thái (xong gì, dở gì). Bảng trạng thái chỉ giữ việc còn mở/hoãn và việc merge trong phiên này; việc đã đóng trên GitHub thì xóa (GitHub là nguồn sự thật). Giữ các ghi chú review chưa xử lý.
   - **Bước kế tiếp chính xác:** đủ cụ thể để một phiên mới trên máy khác làm tiếp mà không cần hỏi (file, hàm, test đang đỏ, lệnh).
   - **Chờ Owner:** cổng G1–G8 hoặc quyết định đang chờ.
   - **Lệnh chạy tiếp.**
2. Nếu trạng thái phase đổi, cập nhật mục "Next decision" trong `docs/PROJECT-STATE.md`.
3. Chạy `pwsh -NoProfile -File tools/session-end.ps1 -Message "$ARGUMENTS"`.
4. Xác nhận push thành công và báo tên nhánh. Nếu push lỗi, nói rõ — Owner không được rời máy khi chưa push.
