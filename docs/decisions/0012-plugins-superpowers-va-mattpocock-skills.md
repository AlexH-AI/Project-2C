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
- Hook `SessionStart` của Superpowers chạy mỗi phiên; phải cùng tồn tại với hook nạp HANDOFF (`.claude/hooks/handoff-context.mjs`, từ 03/10/2026 đọc Issue ghim nhãn `handoff` — ADR-0003 phụ lục).

## Phụ lục — sửa cục bộ skill vendored, phân vai hai skill TDD (Accepted G1, Owner duyệt 03/10/2026 · #296)

Lý do: prompt audit 03/10 thấy thân ADR lệch thực tế. Quyết định 2 ghi "chép chọn lọc, không sửa", nhưng T-116 (#283) đã thêm mục "Tài liệu cần đọc" vào `to-tickets`. Hai skill TDD cùng bật mà không phân vai, và mâu thuẫn ở bước refactor.

- **Sửa cục bộ có ghi chép** (thay "không sửa" ở Quyết định 2): được sửa file skill vendored khi cần cho quy trình 2C. Mỗi chỗ sửa ghi một dòng trong bảng "Sửa cục bộ" của `.claude/skills/README.md` (file, nội dung, lý do, Issue). Cập nhật upstream = chép lại bản mới, rồi áp lại các dòng trong bảng. Review kiểm bảng này (`docs/process/REVIEW-CHECKLIST.md` §6). `tdd` giữ nguyên upstream; phân vai đặt ở `CLAUDE.md`.
- **Phân vai TDD:** `tdd` là chuẩn, seam = test chấp nhận của Issue (không hỏi lại). `superpowers:test-driven-development` bổ sung kỷ luật đỏ → xanh. **Refactor ngay trong vòng khi test còn xanh** (theo superpowers), thay cho dòng "Refactoring is not part of the loop" của `tdd`.
- **Skill upstream được nhắc nhưng không cài:** `codebase-design` (`DESIGN-IT-TWICE.md` cần sub-agent song song; seam ở 2C đã chốt trong Issue) → bỏ qua. `code-review` của mattpocock (chạy hai sub-agent) → đọc là `review-pr` (ADR-0017).
- **Đính chính Bối cảnh:** `grilling` có nhắc sub-agent ("dispatch a sub-agent" khi tra dữ kiện). Quyết định 3 đã xử lý: Agent tool bị chặn nên tra cứu trong phiên.
