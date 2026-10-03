---
description: Bắt đầu phiên — đồng bộ GitHub, xem việc đang mở, đọc HANDOFF
argument-hint: "[bắt đầu issue #N | việc cần làm]"
---

1. Chạy `pwsh -NoProfile -File tools/session-start.ps1` và đọc toàn bộ output: git, PR mở (head, `REVIEW` mới nhất + SHA, CI), Issue mở của milestone, worktree, toolchain.
2. HANDOFF (Issue ghim nhãn `handoff`) đã được hook `SessionStart` nạp sẵn ở đầu hội thoại, khối `== HANDOFF (…)`. **Không đọc lại.** Chỉ chạy `node tools/handoff.mjs read` khi:
   - không thấy khối đó, hoặc
   - hook báo lỗi / đã cắt bớt, hoặc
   - hook đang dùng bản tạm (GitHub không truy cập được).
   Không cần đọc `docs/PROJECT-STATE.md` (thông tin ổn định, không phải trạng thái phiên).
3. Nếu working tree có thay đổi chưa commit hoặc nhánh đang lệch remote, báo Owner trước khi làm gì khác.
4. Nếu toolchain thiếu, nêu rõ thiếu gì và lệnh `tools/bootstrap.ps1` cần chạy.
5. Nếu có số Issue: `gh issue view <N>`, rồi đọc **đúng các mục trong "Tài liệu cần đọc"** của Issue cộng phần liên quan trong `CLAUDE.md`. Issue cũ chưa có mục này → dùng "Bối cảnh". Không đọc lan sang tài liệu khác khi chưa cần.
6. Tóm tắt ngắn cho Owner, đọc lướt được: nhánh hiện tại, đang làm gì, bước kế tiếp chính xác, việc đang chờ Owner. Sau đó tiếp tục bước kế tiếp nếu nó không phải cổng G1–G8.
