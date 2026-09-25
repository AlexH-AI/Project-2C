# ADR-0003: Liên tục công việc giữa 2 máy qua GitHub

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §0, §4.2; `docs/PROJECT-STATE.md`
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Owner làm trên Home PC (tối) và Office Laptop (ngày), đều Windows 11 x64, và phải tiếp tục liền mạch — đây là tiêu chí bắt buộc.

## Quyết định

**GitHub (`AlexH-AI/Project-2C`) là nguồn sự thật duy nhất.** Không có gì quan trọng chỉ tồn tại trên một máy.

| Thứ | Ở đâu |
|---|---|
| Code, spec, ADR, kế hoạch | Repo |
| Trạng thái dở dang, bước tiếp theo, việc chờ Owner | `docs/state/HANDOFF.md` (commit mỗi cuối phiên) |
| Task, tiến độ | GitHub Issues + Milestones |
| Việc đang làm | Nhánh `task/*` / `wip/*` đã push + Draft PR |
| Quy tắc, hooks, lệnh Claude, plugin | `CLAUDE.md`, `.claude/settings.json`, `.claude/commands/` (commit) |
| Bản exe | GitHub Actions artifact / Releases |
| DB dev | Không đồng bộ — sinh lại bằng `pnpm seed` (seed cố định) |
| API key | Không đồng bộ — nhập riêng mỗi máy (Windows Credential Manager) |

- Nghi thức phiên: `/resume` (`tools/session-start.ps1`) — fetch/pull, PR mở, Issue đang làm, in `HANDOFF.md`, kiểm tra toolchain; `/handoff` (`tools/session-end.ps1`) — commit WIP, push, cập nhật `HANDOFF.md`. Hook `SessionStart` hiện `HANDOFF.md`.
- Trước khi rời máy: không để phiên Claude chạy dở.
- Đồng nhất môi trường: `tools/bootstrap.ps1` (winget, idempotent), `.gitattributes` (`* text=auto eol=lf`), `core.longpaths`, `.nvmrc`, `packageManager` + corepack, `rust-toolchain.toml`, lockfile commit; branch protection `main` (PR + CI xanh).
- Thư mục làm việc chuẩn: `C:\workspace\Project-2C`.

## Phương án đã cân nhắc

- **Đồng bộ thư mục qua OneDrive** — loại: `node_modules`/`target` lớn, xung đột file, không có lịch sử.
- **Phiên cloud (claude.ai/code)** — giữ làm tùy chọn bổ sung, không thay thế.

## Lý do

Git đã có trên cả hai máy, có lịch sử và diff, và cũng là nơi CI chạy.

## Hệ quả

- Kỷ luật push cuối phiên là bắt buộc; `HANDOFF.md` phải luôn cập nhật.
- Plugin/skill phải cài ở **cấp project** (khai báo trong file commit) để máy kia nhận được.
