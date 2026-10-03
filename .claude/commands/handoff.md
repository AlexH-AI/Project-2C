---
description: Kết thúc phiên — cập nhật HANDOFF, commit WIP, push
argument-hint: "[mô tả ngắn việc đang làm]"
---

1. Cập nhật `docs/state/HANDOFF.md` theo đúng khung đang có. **Giữ dưới 8.000 ký tự**: hook `SessionStart` chỉ đưa được 10.000 ký tự vào context, phần thừa sẽ bị cắt.
   - **Cập nhật:** ngày hôm nay; **Máy:** `$env:COMPUTERNAME`; **Nhánh:** nhánh hiện tại; **Phase**.
   - **Trạng thái:** task/Issue đang làm (xong gì, dở gì) và việc merge trong phiên này. Việc đã đóng trên GitHub thì xóa (GitHub là nguồn sự thật). Không chép lại danh sách PR/Issue mở: `session-start.ps1` đã in.
   - **Bước kế tiếp chính xác:** đủ cụ thể để một phiên mới trên máy khác làm tiếp mà không cần hỏi (file, hàm, test đang đỏ, lệnh).
   - **Chờ Owner:** cổng G1–G8 hoặc quyết định đang chờ.
2. Không để vào HANDOFF những thứ có chỗ riêng:
   - ghi chú review không chặn → `docs/state/review-notes.md` (OPEN / RESOLVED / ACCEPTED);
   - quy tắc / quyết định bền của Owner → `CLAUDE.md` (quy tắc làm việc), ADR (thiết kế) hoặc "Current OWNER decisions" trong `docs/PROJECT-STATE.md`;
   - ghi chú môi trường dùng lâu dài → `CLAUDE.md` § "Môi trường Windows và 2 máy";
   - danh sách phản hồi dài của Owner → `docs/reviews/<ngày>-….md` rồi trỏ tới.
3. Nếu phase đổi, cập nhật "Current phase" trong `docs/PROJECT-STATE.md`.
4. Chạy `pwsh -NoProfile -File tools/session-end.ps1 -Message "$ARGUMENTS"`.
5. Xác nhận push thành công và báo tên nhánh. Nếu push lỗi, nói rõ — Owner không được rời máy khi chưa push.
