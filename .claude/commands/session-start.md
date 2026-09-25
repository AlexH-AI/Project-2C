---
description: Bắt đầu phiên — đồng bộ GitHub, xem việc đang mở, đọc HANDOFF
---

1. Chạy `pwsh -NoProfile -File tools/session-start.ps1` và đọc toàn bộ output.
2. Đọc `docs/state/HANDOFF.md` và `docs/PROJECT-STATE.md`.
3. Nếu working tree có thay đổi chưa commit hoặc nhánh đang lệch remote, báo Owner trước khi làm gì khác.
4. Nếu toolchain thiếu, nêu rõ thiếu gì và lệnh `tools/bootstrap.ps1` cần chạy.
5. Tóm tắt cho Owner trong ≤ 8 dòng: nhánh hiện tại, đang làm gì, bước kế tiếp chính xác, việc đang chờ Owner. Sau đó tiếp tục bước kế tiếp nếu nó không phải cổng G1–G8.
