# HANDOFF đã chuyển lên GitHub

Từ 03/10/2026 (ADR-0003 phụ lục, #283), HANDOFF nằm ở **Issue ghim có nhãn `handoff`**: [#284](https://github.com/AlexH-AI/Project-2C/issues/284).

- Đọc: `node tools/handoff.mjs read` (hook `SessionStart` tự nạp khi mở phiên).
- Sửa: `/handoff`, tức `node tools/handoff.mjs read --out <file>` → sửa → `node tools/handoff.mjs write <file>`. Lệnh ghi từ chối khi Issue đã đổi kể từ lần đọc gần nhất trên máy này.
- Không sửa file này. Lịch sử HANDOFF trước 03/10: `git log -p -- docs/state/HANDOFF.md`.
