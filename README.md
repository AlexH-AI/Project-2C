# Project-2C

Bản đối chứng của Project-2, **làm hoàn toàn bằng Claude Code** (không subagent; model và effort do Owner chọn từng phiên).

Project-2C có cùng yêu cầu sản phẩm với [`AlexH-AI/Project-2`](https://github.com/AlexH-AI/Project-2) và chỉ khác ở cách thực hiện. Khi cả hai xong, hai sản phẩm cuối sẽ được so sánh với nhau.

## Status

- Canonical remote: `AlexH-AI/Project-2C` (private)
- Canonical accepted branch: `main`
- Local workspace: `C:\workspace\Project-2C` (trên cả Home PC và Office Laptop)
- Đồng bộ Home PC ↔ Office Laptop: GitHub
- Thứ tự: **làm 2C trước**, sau đó mới làm Project-2

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
- `docs/COMPARISON.md` — giao thức so sánh và quy tắc cách ly với Project-2
- `docs/PROJECT-STATE.md` — phase hiện tại và quyết định Owner theo ngày
- `docs/decisions/` — ADR
- `docs/state/HANDOFF.md` — bàn giao giữa các phiên / giữa 2 máy (giữ dưới 8.000 ký tự)
- `docs/state/review-notes.md` — sổ ghi chú review không chặn (OPEN / RESOLVED / ACCEPTED)
- `docs/reviews/` — báo cáo review đóng phase (bản gốc ở `docs/reviews/raw/`)
- `docs/setup/office-laptop.md` — dựng môi trường trên máy mới
- `CLAUDE.md` — quy tắc cho Claude Code
