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

## Phụ lục — HANDOFF trên Issue ghim, nghi thức phiên hiện hành (Accepted G1, Owner duyệt 03/10/2026 · #283)

Lý do: retro 30 phiên Claude Code (#280) cho thấy `HANDOFF.md` trong git có ba vấn đề. 41/175 PR đã merge (23%) chỉ để sửa HANDOFF, mỗi PR cần một phiên review. Handoff chỉ có tác dụng khi đã merge vào `main`, nên rời máy khi PR handoff chưa merge thì máy kia đọc bản cũ. Hook `SessionStart` chỉ đưa được 10.000 ký tự vào context.

Thay bảng ở mục Quyết định:

| Thứ | Ở đâu |
|---|---|
| Trạng thái dở dang, bước tiếp theo, việc chờ Owner | **Issue ghim, nhãn `handoff`** (#284). Đọc / ghi bằng `tools/handoff.mjs`, không qua PR. `docs/state/HANDOFF.md` chỉ còn trỏ sang Issue; lịch sử trước 03/10 ở `git log` |
| PR mở, kết quả `REVIEW`, CI, Issue của milestone, worktree | Không chép tay: `tools/status.mjs` sinh từ GitHub mỗi lần `/session-start` |
| Ghi chú review không chặn | `docs/state/review-notes.md` (qua PR) |

- **Không đè nhau giữa 2 máy:** mỗi lần đọc lưu bản tạm (số Issue, `updatedAt`, nội dung) trong thư mục git chung. Lệnh ghi từ chối khi `updatedAt` trên GitHub khác bản tạm → đọc lại, gộp, ghi lại. Không sửa trên web khi có phiên đang chạy.
- **Mất mạng / không vào được GitHub:** hook và `handoff.mjs read` dùng bản tạm, kèm cảnh báo "có thể cũ" và thời điểm đọc.
- **Độ dài:** dưới 8.000 ký tự; lệnh ghi chặn ở 9.000; hook cắt output dưới 10.000.
- **Điều kiện:** cả hai máy có `gh` đã đăng nhập (`tools/bootstrap.ps1` kiểm). Phiên cloud (phương án C) tự chạy `node tools/handoff.mjs read`.

Nghi thức phiên hiện hành (thay đoạn "Nghi thức phiên" ở trên):
- `/session-start` (không phải `/resume`, vì trùng lệnh có sẵn của Claude Code): pull + `tools/status.mjs` + kiểm toolchain.
- Hook `SessionStart` nạp HANDOFF từ Issue.
- `/handoff`: đọc → sửa → ghi HANDOFF, rồi `tools/session-end.ps1` commit WIP + push nhánh còn dở.

`main` được bảo vệ bằng ruleset `protect-main` trên GitHub (từ 28/09/2026: bắt buộc PR, cấm force-push và xóa) cộng hook `pre-push`. Không bắt buộc status check: "CI xanh mới merge" do Claude tự tuân thủ (`CLAUDE.md`).
