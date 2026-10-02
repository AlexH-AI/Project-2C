---
description: Bắt đầu phiên — đồng bộ GitHub, xem việc đang mở, đọc HANDOFF
argument-hint: "[bắt đầu issue #N | việc cần làm]"
---

1. Chạy `pwsh -NoProfile -File tools/session-start.ps1` và đọc toàn bộ output (PR mở, Issue mở của milestone hiện tại, toolchain).
2. HANDOFF đã được hook `SessionStart` nạp sẵn (bản `origin/main`) ở đầu hội thoại. **Không đọc lại.** Chỉ mở `docs/state/HANDOFF.md` bằng Read khi:
   - không thấy khối `== docs/state/HANDOFF.md` trong context, hoặc
   - hook / script báo bản local khác `origin/main`, hoặc
   - hook báo đã cắt bớt.
   Không cần đọc `docs/PROJECT-STATE.md` (thông tin ổn định, không phải trạng thái phiên).
3. Nếu working tree có thay đổi chưa commit hoặc nhánh đang lệch remote, báo Owner trước khi làm gì khác.
4. Nếu toolchain thiếu, nêu rõ thiếu gì và lệnh `tools/bootstrap.ps1` cần chạy.
5. Nếu có số Issue: `gh issue view <N>`, rồi chỉ đọc tài liệu Issue nêu (Bối cảnh, file được phép sửa) cộng phần liên quan trong `CLAUDE.md`. Không đọc lan sang tài liệu khác khi chưa cần.
6. Tóm tắt ngắn cho Owner, đọc lướt được: nhánh hiện tại, đang làm gì, bước kế tiếp chính xác, việc đang chờ Owner. Sau đó tiếp tục bước kế tiếp nếu nó không phải cổng G1–G8.
