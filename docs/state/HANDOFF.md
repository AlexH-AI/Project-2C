# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-26
- **Máy:** Home PC
- **Nhánh:** `phase-1/foundation` (PR mở vào `main`)
- **Phase:** 1 — Nền móng (milestone #1)

## Đang làm

- T-001 (#1) và T-002 (#2) xong trên nhánh: quy tắc repo, giao thức phiên, bootstrap, skeleton monorepo, CI build exe.
- Local: `pnpm verify` xanh; `pnpm dev:web` chạy; `pnpm build:exe` ra `project2c.exe` 2,9 MB, mở được cửa sổ.
- Chờ CI trên PR xác nhận build trên windows-latest.

## Bước kế tiếp chính xác

1. CI xanh → review ở phiên sạch theo `docs/process/REVIEW-CHECKLIST.md` → merge PR (Owner merge vì chưa có branch protection).
2. T-004 (#4): chạy `/setup-matt-pocock-skills` (tracker GitHub, ADR ở `docs/decisions/`).
3. T-005 (#5): Playwright e2e smoke ở chế độ web + bước CI.
4. T-006 (#6): mockup HTML 4 màn hình → G3.

## Chờ Owner

- T-003 (#3): đồng ý bật branch protection cho `main`.
- T-009 (#9): chạy thử exe trên Office Laptop (`git clone` + `pwsh -File tools/bootstrap.ps1`).

## Lệnh chạy tiếp

```powershell
git pull
pwsh -File tools/bootstrap.ps1 -CheckOnly
pnpm verify
```

## Ghi chú môi trường

- pnpm shim nằm ở `%APPDATA%\npm` (corepack không ghi được vào Program Files khi không có admin). Trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
