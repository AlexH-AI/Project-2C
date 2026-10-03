# Project skills

Vendored from [`mattpocock/skills`](https://github.com/mattpocock/skills) at commit `c55ee46073ed923f86ce59a5eb3b6d895095d1b7` (plugin v1.2.3), MIT — see `LICENSE-mattpocock-skills`. `agents/openai.yaml` files omitted. Approved at G4 on 2026-09-26 — see `docs/decisions/0012-plugins-superpowers-va-mattpocock-skills.md`. Local edits are allowed only when recorded in the "Local edits" table below (ADR-0012 addendum, 2026-10-03).

| Skill | Upstream path | Notes |
|---|---|---|
| `grill-me` | `skills/productivity/grill-me` | Delegates to `grilling` |
| `grilling` | `skills/productivity/grilling` | Upstream says "dispatch a sub-agent" for fact lookups — in 2C the Agent tool is denied, so look facts up inline |
| `to-spec` | `skills/engineering/to-spec` | Replaces `to-prd` named in the plan |
| `to-tickets` | `skills/engineering/to-tickets` | Replaces `to-issues` named in the plan |
| `tdd` | `skills/engineering/tdd` | Unmodified; how it combines with `superpowers:test-driven-development` is set in `CLAUDE.md` (task workflow, step 3) |
| `setup-matt-pocock-skills` | `skills/engineering/setup-matt-pocock-skills` | One-time config required by `to-spec` / `to-tickets` |

Not vendored: `review-pr` is 2C's own skill (ADR-0017).

## Upstream skills referenced but not installed

| Skill | Referenced by | Why not installed | Read it as |
|---|---|---|---|
| `codebase-design` | `tdd` | Its `DESIGN-IT-TWICE.md` needs parallel sub-agents (Agent tool denied); in 2C the seams are already fixed by the issue's acceptance tests | Skip |
| `code-review` (Matt's) | `tdd` | Runs two sub-agents; replaced by `review-pr` (ADR-0017) | `review-pr` |

## Sửa cục bộ (local edits)

Every edit to a vendored file is listed here. A PR that changes a file under `.claude/skills/` (other than `review-pr`) must update this table (`docs/process/REVIEW-CHECKLIST.md`).

| File | Nội dung sửa | Lý do | Issue |
|---|---|---|---|
| `to-tickets/SKILL.md` | Thêm mục "Tài liệu cần đọc" vào issue template | Phiên làm task chỉ đọc danh sách này (`/session-start <issue>`) | #283 (T-116) |
| `to-tickets/SKILL.md` | Issue template trỏ sang `.github/ISSUE_TEMPLATE/task.yml` thay vì chép danh sách mục; câu "avoid specific file paths" nêu hai ngoại lệ ("Tài liệu cần đọc", "File / thư mục được phép sửa") | Mẫu Issue chỉ định nghĩa một nơi; gỡ mâu thuẫn quy tắc đường dẫn (audit F3) | #296 (T-122) |
| `to-spec/SKILL.md` | Bỏ "A LONG" / "extremely extensive" ở mục User Stories, giữ yêu cầu đủ mọi actor, mọi hành vi đổi | Giọng nhấn viết cho model cũ làm danh sách phình (audit F4) | #296 (T-122) |

## To update

Re-copy from a newer upstream commit, update the SHA above, re-apply every edit in the "Sửa cục bộ" table (drop rows upstream has made obsolete), and note the update in ADR-0012.
