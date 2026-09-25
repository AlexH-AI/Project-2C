# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/resume`).

- **Cập nhật:** 2026-09-26
- **Máy:** (chưa ghi)
- **Nhánh:** `phase-1/foundation`
- **Phase:** 1 — Nền móng

## Đang làm

Phase 1 — quy tắc repo, giao thức phiên, skeleton monorepo.

## Bước kế tiếp chính xác

1. Owner chạy `tools/bootstrap.ps1` (cài pnpm, Rust, VS Build Tools, gh).
2. `gh auth login`, rồi tạo Issue/Milestone cho Phase 1.

## Chờ Owner

- Chạy bootstrap (cài phần mềm hệ thống).

## Lệnh chạy tiếp

```powershell
git pull
pwsh -File tools/bootstrap.ps1
```
