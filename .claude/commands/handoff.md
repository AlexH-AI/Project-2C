---
description: Kết thúc phiên — cập nhật HANDOFF (Issue ghim), commit WIP, push
argument-hint: "[mô tả ngắn việc đang làm]"
---

1. Lấy bản HANDOFF mới nhất ra file tạm trong scratchpad: `node tools/handoff.mjs read --out <scratchpad>/handoff.md`. Luôn đọc lại ngay trước khi sửa, kể cả khi hook đã nạp ở đầu phiên, vì máy kia có thể vừa ghi.
2. Sửa file đó bằng Edit theo đúng khung đang có. **Giữ dưới 8.000 ký tự** (hook chỉ đưa được 10.000 ký tự vào context; lệnh ghi từ chối khi quá 9.000).
   - **Cập nhật:** ngày hôm nay · máy `$env:COMPUTERNAME`; **Phase**.
   - **Đang làm:** task/Issue (xong gì, dở gì), nhánh / worktree nếu còn việc dở. Việc đã đóng trên GitHub thì xóa. Không chép PR / REVIEW / CI / Issue mở / worktree: `tools/status.mjs` tự in.
   - **Bước kế tiếp chính xác:** đủ cụ thể để một phiên mới trên máy khác làm tiếp mà không cần hỏi (file, hàm, test đang đỏ, lệnh).
   - **Chờ Owner:** cổng G1–G8 hoặc quyết định đang chờ.
3. Không để vào HANDOFF những thứ có chỗ riêng:
   - ghi chú review không chặn → `docs/state/review-notes.md` (OPEN / RESOLVED / ACCEPTED), đi qua PR;
   - quy tắc / quyết định bền của Owner → `CLAUDE.md` (quy tắc làm việc), ADR (thiết kế) hoặc "Current OWNER decisions" trong `docs/PROJECT-STATE.md`;
   - ghi chú môi trường dùng lâu dài → `CLAUDE.md` § "Môi trường Windows và 2 máy";
   - danh sách phản hồi dài của Owner → `docs/reviews/<ngày>-….md` rồi trỏ tới.
4. Ghi: `node tools/handoff.mjs write <scratchpad>/handoff.md`. Bị từ chối vì Issue đã đổi → làm lại bước 1, gộp thay đổi của mình vào bản mới, rồi ghi lại. **Không** sửa trực tiếp trên web để vượt qua bước kiểm này.
5. Nếu phase đổi, cập nhật "Current phase" trong `docs/PROJECT-STATE.md` (qua PR).
6. Có code chưa commit → chạy `pwsh -NoProfile -File tools/session-end.ps1 -Message "$ARGUMENTS" -Paths <file1>,<file2>` (commit WIP + push nhánh). `-Paths` gồm **đúng** các file phiên này đã sửa, cách nhau bằng dấu phẩy. Phiên khác có thể đang dùng chung checkout, nên script không `git add -A`: thiếu `-Paths` thì nó liệt kê thay đổi rồi dừng. Xác nhận push thành công và báo tên nhánh. Nếu push lỗi, nói rõ — Owner không được rời máy khi chưa push.
