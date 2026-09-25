# ADR-0012: Plugins/skills cho Claude Code — Superpowers + mattpocock/skills

- **Trạng thái:** Accepted (G4, Owner duyệt 2026-09-26)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §0, §4.3; `docs/COMPARISON.md` (hằng số "Plugin")
- **Commit / PR:** commit cài đặt G4 · PR: —

## Bối cảnh

Kế hoạch giữ cùng bộ plugin với Project-2 để so sánh công bằng, nhưng 2C chỉ được dùng phần chạy trong phiên chính (ADR-0001: không subagent).

Kiểm tra repo nguồn ngày 2026-09-26:

- **Superpowers** (`obra/superpowers`, v6.4.2) có hook `SessionStart` (nạp skill `using-superpowers` mỗi phiên). `subagent-driven-development`, `dispatching-parallel-agents`, `requesting-code-review` dispatch subagent; `writing-plans` gợi ý chế độ subagent-driven; `executing-plans` có nhánh **"không có subagent tool" → thực thi và tự review trong phiên**.
- **mattpocock/skills** (plugin `mattpocock-skills` v1.2.3, 25 skill) **không còn `to-prd` / `to-issues`** như kế hoạch ghi; thay bằng **`to-spec` / `to-tickets`**. `grill-me` chỉ gọi skill `grilling`. Các skill `grill-me`, `grilling`, `to-spec`, `to-tickets`, `tdd` không nhắc tới subagent.

## Quyết định

1. **Superpowers v6.4.2** — plugin `superpowers@superpowers-marketplace`, **cấp project**. `.claude/settings.json` khai báo `extraKnownMarketplaces` (`obra/superpowers-marketplace`) + `enabledPlugins` → máy kia nhận khi mở phiên (có thể phải xác nhận tin cậy marketplace lần đầu). Được dùng: brainstorming, writing-plans, executing-plans (chế độ inline), test-driven-development, systematic-debugging, verification-before-completion. Không dùng: subagent-driven-development, dispatching-parallel-agents, requesting-code-review.
2. **mattpocock/skills** — **chép chọn lọc, không sửa** vào `.claude/skills/`, ghim commit `c55ee46` (v1.2.3), MIT: `grill-me` + `grilling`, `to-spec`, `to-tickets`, `tdd`, và `setup-matt-pocock-skills` (cấu hình một lần mà `to-spec`/`to-tickets` cần). Nguồn gốc ghi ở `.claude/skills/README.md`. Luồng Phase 0: `grill-me` → `to-spec` (thay `to-prd`) → `to-tickets` (thay `to-issues`).
3. **Agent tool bị chặn cứng** bằng `permissions.deny: ["Agent"]` trong `.claude/settings.json` (đưa lên sớm từ Phase 1) → Superpowers rơi về nhánh inline; `grilling` tra cứu dữ kiện trong phiên thay vì dispatch sub-agent. `CLAUDE.md` (Phase 1) liệt kê skill được phép.

## Phương án đã cân nhắc

- **mattpocock: cài cả plugin** (`mattpocock-skills@mattpocock`) — tự cập nhật, nhưng nạp cả 25 skill (nhiều mô tả vào context, có thể tự kích hoạt skill ngoài danh sách). Loại.
- **mattpocock: chép chọn lọc** — đúng "chọn lọc", commit vào repo, ghim phiên bản, đọc được; đổi lại không tự cập nhật. **Chọn.**
- GSD Core, oh-my-claudecode, BMAD, ECC — loại (đa agent / như Project-2).

## Hệ quả

- Tên skill trong kế hoạch (`to-prd`, `to-issues`) đã lỗi thời; Project-2 cũng cần dùng `to-spec` / `to-tickets` để giữ hằng số "Plugin" (`docs/COMPARISON.md`).
- Trước lần dùng `to-spec` / `to-tickets` đầu tiên phải chạy `/setup-matt-pocock-skills` (issue tracker = GitHub Issues). Skill này mặc định ADR ở `docs/adr/`; 2C giữ `docs/decisions/` và khai báo khi setup.
- Hook `SessionStart` của Superpowers chạy mỗi phiên; phải cùng tồn tại với hook hiện `HANDOFF.md` (ADR-0003).
