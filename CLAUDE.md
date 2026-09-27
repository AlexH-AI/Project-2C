# Project-2C — quy tắc cho Claude Code

Đây là nguồn quy tắc duy nhất của repo. Kế hoạch: `docs/PROJECT-PLAN.md`. Quyết định: `docs/decisions/` (ADR). Trạng thái: `docs/PROJECT-STATE.md` + `docs/state/HANDOFF.md`.

Owner (AlexH-AI) là nam — trả lời bằng tiếng Việt, gọi là **"anh"**.

## Mô hình thực hiện (ADR-0001)

- Chỉ Claude Code, **Opus 5.5, effort medium**. **Không subagent / Agent tool** (bị chặn trong `.claude/settings.json`). Mọi việc làm trong phiên chính.
- Tự động trong mọi task; **dừng và hỏi Owner** ở các cổng:
  - **G1** kế hoạch/ADR · **G2** golden examples + mô hình dữ liệu · **G3** mockup UI
  - **G4** dependency lớn / công cụ / dịch vụ mới / bất cứ thứ gì tốn tiền
  - **G5** prompt + guardrail AI · **G6** lưu API key / bảo mật · **G7** merge cuối milestone + phát hành exe
  - **G8** task vẫn lỗi sau 2 vòng tự sửa, hoặc spec mâu thuẫn
- Không dùng OpenCode/Muse/Cursor/Codex để viết hay review code. OpenCode Go chỉ là AI runtime của sản phẩm.
- Cách ly với Project-2 (`docs/COMPARISON.md`): không mở, không copy code/test/mockup từ `C:\workspace\Project-2`.

## Nghi thức phiên (ADR-0003)

- **Bắt đầu phiên:** `/session-start` — pull, đọc `docs/state/HANDOFF.md`, xem PR/Issue đang mở. (Không đặt tên `/resume` vì trùng lệnh có sẵn của Claude Code.) Hook `SessionStart` cũng tự nạp `HANDOFF.md`.
- **Kết thúc phiên / trước khi rời máy:** `/handoff` — commit WIP, push, cập nhật `HANDOFF.md` (đang làm gì, bước kế tiếp chính xác, việc chờ Owner).
- **Giữa các task trên cùng máy:** không cần `/handoff` — PR đã merge / Issue đã đóng trên GitHub là trạng thái thật. Cập nhật `HANDOFF.md` khi rời máy / hết ngày, hoặc khi có điều GitHub chưa ghi mà phiên sau phải biết (quyết định Owner, ghi chú review, việc chờ Owner, đổi thứ tự làm). Có thể sửa `HANDOFF.md` ngay trong PR của task khi không có phiên song song. Handoff chỉ có tác dụng khi đã vào `main`.
- GitHub là nguồn sự thật. Không để gì quan trọng chỉ nằm trên một máy. DB dev sinh lại bằng seed; API key nhập riêng từng máy.

## Quy trình một task (ADR-0001)

1. Mỗi task = 1 GitHub Issue (spec + test chấp nhận + file được phép sửa + nhãn `risk:low|med|high`), ≤ ~400 dòng code sản phẩm và ≤ ~800 dòng tổng diff kể cả test (không tính file sinh tự động — ADR-0001 phụ lục).
2. Nhánh `task/T-xxx-slug` từ `main` (hoặc từ nhánh phase đang mở).
3. TDD: test đỏ → code → test xanh. Chạy `pnpm verify` trước khi commit. Test chấp nhận trong Issue là seam đã thống nhất với Owner — không cần hỏi lại seam (skill `tdd`); chỉ hỏi khi cần seam ngoài Issue.
4. PR → CI Windows xanh → **review ở phiên mới, context sạch** bằng skill `review-pr` (ADR-0017): Owner gõ "review PR #N" → skill đọc nhãn `risk:*`, chọn mức (low: Spec + checklist · med: + `code-review medium` · high: + `code-review high`). Không gọi `code-review` trực tiếp; không dùng `--comment`/`--fix`/`ultra`.
   - Review chạy trong worktree cố định `.claude\worktrees\review-main` (detached HEAD ở đúng SHA đang review, chỉ đọc, không commit). Code chỉ làm ở checkout chính hoặc worktree của task. Chi tiết: skill `review-pr` §0.
5. `risk:low` + CI xanh + review đạt → Claude tự merge bằng `gh pr merge --squash` (dùng `--merge` khi có PR khác xếp chồng lên nhánh này, để giữ lịch sử commit). Ngược lại chờ Owner. Sửa tối đa 2 vòng, sau đó G8.
   - GitHub Free không có branch protection / auto-merge cho repo private (issue #3). Thay vào đó: hook `.githooks/pre-push` chặn push thẳng lên `main` (bootstrap đặt `core.hooksPath`). **Không bao giờ** dùng `--no-verify` hay merge khi CI chưa xanh.
   - CI (ADR-0015): PR chỉ sửa docs (`docs/**`, `*.md`) không chạy CI và merge được không cần CI. Từ Phase 3, mọi PR code chạy đủ Verify + e2e + build exe (không cần nhãn `build-exe`).
6. Mỗi task một phiên mới (hoặc `/clear`).

## Skills được phép (ADR-0012)

- Superpowers: `brainstorming`, `writing-plans`, `executing-plans` (inline), `test-driven-development`, `systematic-debugging`, `verification-before-completion`.
- Không dùng: `subagent-driven-development`, `dispatching-parallel-agents`, `requesting-code-review`, `using-git-worktrees`. Khi skill gợi ý subagent → làm inline.
- Project skills (`.claude/skills/`): `grill-me`/`grilling`, `to-spec`, `to-tickets`, `tdd`, `setup-matt-pocock-skills`, `review-pr` (2C tự viết, ADR-0017).
- `code-review` có sẵn của Claude Code: chỉ gọi từ trong `review-pr` (mức med/high).

## Agent skills

### Issue tracker

GitHub Issues của `AlexH-AI/Project-2C`, theo mẫu Task, nhãn `type:task` + `risk:*`, milestone theo phase. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` ở gốc (tạo khi cần) + ADR ở `docs/decisions/`. See `docs/agents/domain.md`.

## Kiến trúc (ADR-0005, ADR-0006)

```
apps/desktop/      Tauri 2 shell + React UI
packages/domain/   TS thuần — không import package nào khác
packages/db/       Drizzle schema, migrations, repositories; adapter Tauri SQLite + sql.js
packages/ai/       provider adapters, prompts có version, zod schema, validators
packages/ui/       design tokens + components
tools/             bootstrap, session scripts, seed
```

- Ranh giới module kiểm tra bằng `dependency-cruiser` (`pnpm lint:deps`). `domain` không phụ thuộc gì.
- Tiền, ngày, chỉ số: chỉ dùng hàm chuẩn trong `packages/domain`. Không tự parse/format rải rác.
- Mọi chuỗi UI qua i18n (tiếng Việt, thuật ngữ ngành giữ tiếng Anh). Không chuỗi UI cứng.
- Không thêm dependency ngoài danh sách đã duyệt trong ADR-0005 mà không qua G4.

## Lệnh

| Lệnh | Việc |
|---|---|
| `pnpm install` | Cài dependency (pnpm qua corepack, phiên bản ghim trong `package.json`) |
| `pnpm verify` | lint + typecheck + unit + ranh giới module — **bắt buộc xanh trước commit** |
| `pnpm test` | Unit test (Vitest) |
| `pnpm e2e` | E2E Playwright trên bản build web, dùng Microsoft Edge có sẵn |
| `pnpm dev:web` | UI trên Vite, không cần Tauri |
| `pnpm dev` | App Tauri |
| `pnpm build:exe` | Build exe portable |
| `tools/bootstrap.ps1` | Cài/kiểm tra toolchain trên máy mới (idempotent) |

## Quy ước

- Commit: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`), tiếng Anh.
- Tài liệu dự án: tiếng Việt. Code, tên biến, comment: tiếng Anh.
- File theo LF (`.gitattributes`), trừ `.ps1/.cmd` dùng CRLF.
- Script PowerShell: `$ErrorActionPreference = 'Stop'` **không** bắt lỗi lệnh native (`git`, `pnpm`, `rustup`, `winget`…). Sau mỗi lệnh native có tác dụng phụ phải kiểm `$LASTEXITCODE` (hoặc bọc qua hàm helper throw khi ≠ 0) trước khi báo thành công.
- Cuối mỗi phase ghi `docs/metrics/phase-<N>.md` theo `docs/COMPARISON.md`.
