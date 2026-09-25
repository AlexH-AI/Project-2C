# Checklist review (Project-2C)

Review chạy trong **phiên Claude mới, context sạch**. Đầu vào duy nhất: Issue (spec + test chấp nhận) và diff của PR. Không đọc lịch sử phiên làm task.

Ghi kết quả thành comment trên PR: `REVIEW: PASS` hoặc `REVIEW: CHANGES` + danh sách mục, mỗi mục trỏ `file:line`.

## 1. Đúng spec

- [ ] Mọi test chấp nhận trong Issue đều có test tương ứng và pass.
- [ ] Không làm ngoài phạm vi; chỉ sửa các file được phép trong Issue.
- [ ] Diff ≤ ~400 dòng (không tính lockfile, snapshot, fixture sinh tự động).

## 2. Kiểm thử

- [ ] Có test cho nhánh lỗi / biên (ngày không hợp lệ, số âm, danh sách rỗng, năm giao thừa…).
- [ ] Test kiểm hành vi bên ngoài, không kiểm chi tiết cài đặt.
- [ ] Code `packages/domain` giữ coverage ≥ 95%.
- [ ] Golden examples (nếu liên quan) vẫn pass, không bị sửa để "cho xanh".

## 3. Kiến trúc

- [ ] Không vi phạm ranh giới module (`pnpm lint:deps` xanh); `domain` không import package khác.
- [ ] Tiền / ngày / chỉ số dùng hàm chuẩn của `domain`.
- [ ] Không thêm dependency ngoài ADR-0005 (nếu có → G4).

## 4. UI

- [ ] Không chuỗi UI cứng; mọi chuỗi qua i18n.
- [ ] Chỉ dùng component/tokens của `packages/ui`; không màu/khoảng cách tùy tiện.
- [ ] Số liệu `tabular-nums`; tương phản đạt WCAG AA.

## 5. AI (khi chạm `packages/ai`)

- [ ] Output đi qua zod schema + validator; không đường tắt.
- [ ] Không có hành động nào do AI tự kích hoạt (gửi, đặt lịch…).
- [ ] Prompt thay đổi → tăng `prompt_version`; thay đổi guardrail → G5.

## 6. Vệ sinh

- [ ] Không bí mật, key, dữ liệu thật trong diff.
- [ ] Không code chết, `console.log` gỡ lỗi, TODO không có Issue.
- [ ] Commit message theo Conventional Commits.
- [ ] Script (`.ps1`, shell): mọi lệnh native có tác dụng phụ đều kiểm exit code; không in "thành công" khi một bước trước đó có thể đã lỗi.
