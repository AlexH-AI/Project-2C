# Project-2C

App desktop quản lý khách hàng, KYC, lịch hẹn, hợp đồng và chỉ số cho đội RE (kèm AI copilot), **làm hoàn toàn bằng Claude Code** (không subagent; model và effort do Owner chọn từng phiên).

Ban đầu Project-2C là bản đối chứng của [`AlexH-AI/Project-2`](https://github.com/AlexH-AI/Project-2) (cùng yêu cầu, khác cách làm). Từ 11/10/2026 Owner bỏ mục đích so sánh và dừng Project-2: cách làm chỉ Claude Code đã cho kết quả tốt qua Phase 1–5 (ADR-0002 Superseded).

## Status

- Canonical remote: `AlexH-AI/Project-2C` (private)
- Canonical accepted branch: `main`
- Local workspace: `C:\workspace\Project-2C` (trên cả Home PC và Office Laptop)
- Đồng bộ Home PC ↔ Office Laptop: GitHub
- Project-2 đã dừng (11/10/2026); 2C làm tới v1.0

## Bắt đầu trên một máy mới

```bash
git clone https://github.com/AlexH-AI/Project-2C.git C:\workspace\Project-2C
```

```powershell
pwsh -File tools/bootstrap.ps1
```

Bootstrap cài/kiểm tra Git, Node 24, pnpm (corepack), Rust (theo `rust-toolchain.toml`), MSVC Build Tools, gh, WebView2 rồi chạy `pnpm install`. Chạy lại bao nhiêu lần cũng được; `-CheckOnly` chỉ kiểm tra.

## Lệnh thường dùng

| Lệnh | Việc |
|---|---|
| `pnpm dev:web` | Chạy UI trong trình duyệt (http://localhost:1420) |
| `pnpm dev` | Chạy app Tauri |
| `pnpm verify` | Format, lint, ranh giới module, typecheck, unit test + coverage |
| `pnpm e2e` | E2E Playwright trên bản build web (Microsoft Edge) |
| `pnpm build:exe` | Build `apps/desktop/src-tauri/target/release/project2c.exe` |

## Tài liệu

- `docs/PROJECT-PLAN.md` — kế hoạch triển khai của 2C
- `docs/COMPARISON.md` — giao thức so sánh với Project-2 (hết hiệu lực 11/10/2026, giữ làm lịch sử; bảng chỉ số vẫn là mẫu cho `docs/metrics/`)
- `docs/PROJECT-STATE.md` — phase hiện tại và quyết định Owner theo ngày
- `docs/decisions/` — ADR
- HANDOFF — bàn giao giữa các phiên / giữa 2 máy: Issue ghim nhãn `handoff` trên GitHub (`node tools/handoff.mjs read`)
- `docs/state/review-notes.md` — sổ ghi chú review không chặn (OPEN / RESOLVED / ACCEPTED)
- `docs/reviews/` — báo cáo review đóng phase (bản gốc ở `docs/reviews/raw/`)
- `docs/setup/office-laptop.md` — dựng môi trường trên máy mới
- `CLAUDE.md` — quy tắc cho Claude Code
