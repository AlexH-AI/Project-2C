# Project-2C — quy tắc cho Claude Code

Đây là nguồn quy tắc chung của repo; quy ước riêng từng vùng nằm ở `.claude/rules/*.md` (Claude Code tự nạp khi đụng file khớp `paths:`: mockup, test, UI / i18n, CI). Bản đồ tài liệu: `docs/README.md`; mockup: `docs/design/mockups/README.md`. Kế hoạch: `docs/PROJECT-PLAN.md`. Quyết định: `docs/decisions/` (ADR). Trạng thái phiên: HANDOFF ở Issue ghim nhãn `handoff` (hook nạp sẵn; `node tools/handoff.mjs read`). Quyết định Owner theo ngày: `docs/PROJECT-STATE.md`. Ghi chú review không chặn: `docs/state/review-notes.md`.

Owner (AlexH-AI) là nam — trả lời bằng tiếng Việt, gọi là **"anh"**.

## Mô hình thực hiện (ADR-0001)

- Chỉ Claude Code (Claude làm 100%: spec, code, test, review, tài liệu); **model và effort do Owner chọn từng phiên** (ADR-0001 phụ lục M1) — không ghim trong repo. **Không subagent / Agent tool** (bị chặn trong `.claude/settings.json`). Mọi việc làm trong phiên chính.
- Tự động trong mọi task; **dừng và hỏi Owner** ở các cổng:
  - **G1** kế hoạch/ADR · **G2** golden examples + mô hình dữ liệu · **G3** mockup UI
  - **G4** dependency lớn / công cụ / dịch vụ mới / bất cứ thứ gì tốn tiền
  - **G5** prompt + guardrail AI · **G6** lưu API key / bảo mật · **G7** merge cuối milestone + phát hành exe
  - **G8** task vẫn lỗi sau 2 vòng tự sửa, hoặc spec mâu thuẫn
- **Codex chỉ review độc lập khi đóng phase** (Owner quyết 30/09/2026, ADR-0001 phụ lục M2): Owner chạy, Codex không viết code, không review PR task. Báo cáo của Codex là dữ liệu tham khảo, bổ sung chứ không thay review phiên sạch — Claude kiểm lại từng phát hiện trên code, phân loại rồi mới tạo Issue / sửa. Báo cáo gốc của mọi review đóng phase (Claude + Codex) lưu nguyên văn ở `docs/reviews/raw/<yyyy-mm-dd>/` qua PR docs, không để ngoài repo; bản tổng hợp ở `docs/reviews/`.
- Không dùng OpenCode/Muse/Cursor/Codex để viết code, không dùng OpenCode/Muse/Cursor để review. OpenCode Go chỉ là AI runtime của sản phẩm.
- Cách ly với Project-2 (`docs/COMPARISON.md`): không mở, không copy code/test/mockup từ `C:\workspace\Project-2`.

## Quy tắc Owner đã chốt

Memory của Claude chỉ nằm trên từng máy, nên quy tắc dùng chung cho cả hai máy ghi ở đây.

- **Nhãn UI hiểu theo nghĩa thường** (PR #163, 29/09): danh sách / bộ lọc / số đếm phải khớp đúng nghĩa của nhãn tiếng Việt (trước / sau / đã qua / sắp tới / hôm nay…) và dòng mẫu trong mockup. Ví dụ "Các lần hẹn trước" = hôm nay trở về trước, không gồm lịch tương lai. Kết quả trái nhãn là lỗi, không phải phương án để hỏi Owner. Chỉ hỏi khi nhãn và mockup thật sự mâu thuẫn.
- **Dữ liệu hiện là giả lập** (R2-02, 02/10): khi siết một luật mà dữ liệu cũ có thể vi phạm, áp luật ở mọi nơi (lệnh + kiểm khi nhập backup) và để Owner nạp lại dữ liệu giả lập. Không viết migration, cảnh báo hay UI để hiện / sửa dữ liệu cũ sai. Xem lại quy tắc này khi có đồng bộ Phase 6 hoặc dữ liệu khách hàng thật.

## Nghi thức phiên (ADR-0003)

- **HANDOFF** (ADR-0003 phụ lục, #283) là **Issue ghim nhãn `handoff`** trên GitHub, không phải file trong git. Ghi xong là máy kia thấy ngay, không cần PR / review. Chỉ đọc / ghi qua `tools/handoff.mjs`: `read --out <file>` ghi kèm mốc phiên bản (`<file>.base.json`), lệnh ghi từ chối khi Issue đã đổi so với mốc đó (không đè bản của máy kia, kể cả khi phiên khác vừa đọc lại). Mỗi lần đọc lưu bản tạm trong thư mục git chung, chỉ dùng khi mất mạng. **Dưới 8.000 ký tự** (hook giới hạn 10.000; lệnh ghi chặn ở 9.000).
- **Mở phiên:** hook `SessionStart` (`.claude/hooks/handoff-context.mjs`) nạp HANDOFF từ Issue. Không đọc lại khi hook đã nạp (trừ khi hook báo lỗi / cắt / dùng bản tạm).
- **Bắt đầu phiên:** `/session-start` — pull, rồi `tools/status.mjs` tự in PR mở (head, `REVIEW` mới nhất + SHA, CI), Issue mở của milestone, worktree; kiểm toolchain. (Không đặt tên `/resume` vì trùng lệnh có sẵn của Claude Code.)
- **Kết thúc phiên / trước khi rời máy:** `/handoff` — cập nhật HANDOFF (đang làm gì, bước kế tiếp chính xác, việc chờ Owner), commit WIP + push nhánh code còn dở.
- **Giữa các task trên cùng máy:** không cần `/handoff` — PR đã merge / Issue đã đóng trên GitHub là trạng thái thật. Cập nhật HANDOFF khi rời máy / hết ngày, hoặc khi có điều GitHub chưa ghi mà phiên sau phải biết (quyết định Owner, việc chờ Owner, đổi thứ tự làm). Ghi chú review không chặn ghi vào `docs/state/review-notes.md` (qua PR), không vào HANDOFF.
- GitHub là nguồn sự thật. Không để gì quan trọng chỉ nằm trên một máy. DB dev sinh lại bằng seed; API key nhập riêng từng máy.

## Quy trình một task (ADR-0001)

1. Mỗi task = 1 GitHub Issue (spec + test chấp nhận + file được phép sửa + nhãn `risk:low|med|high`), ≤ ~400 dòng code sản phẩm và ≤ ~800 dòng tổng diff kể cả test (không tính file sinh tự động — ADR-0001 phụ lục).
2. Nhánh `task/T-xxx-slug` từ `main` (hoặc từ nhánh phase đang mở).
3. TDD: test đỏ → code → test xanh. Chạy `pnpm verify` trước khi commit. Test chấp nhận trong Issue là seam đã thống nhất với Owner — không cần hỏi lại seam (skill `tdd`); chỉ hỏi khi cần seam ngoài Issue.
   - Phân vai hai skill TDD (ADR-0012 phụ lục 03/10): `tdd` là chuẩn (seam = test chấp nhận của Issue); `superpowers:test-driven-development` bổ sung kỷ luật đỏ → xanh. Refactor ngay trong vòng khi test còn xanh (Owner quyết 03/10, khác dòng "Refactoring is not part of the loop" của `tdd`). `tdd` nhắc `codebase-design` → bỏ qua (không cài); nhắc `code-review` → đọc là `review-pr`.
4. PR → CI Windows xanh → **review ở phiên mới, context sạch** bằng skill `review-pr` (ADR-0017): Owner gõ "review PR #N" → skill đọc nhãn `risk:*`, chọn mức (low: Spec + checklist · med: + `code-review medium` · high: + `code-review high`). Không gọi `code-review` trực tiếp; không dùng `--comment`/`--fix`/`ultra`.
   - Review chạy trong worktree cố định `C:\workspace\Project-2C-review`, ngoài checkout chính (detached HEAD ở đúng SHA đang review, chỉ đọc, không commit). Code chỉ làm ở checkout chính hoặc worktree của task. Review hai PR song song → phiên thứ hai dùng `C:\workspace\Project-2C-review-2` (mỗi worktree review chỉ một phiên tại một thời điểm). Chi tiết: skill `review-pr` §0.
5. `risk:low` + CI xanh + review đạt → Claude tự merge (squash; `--merge` khi có PR khác xếp chồng lên nhánh này, để giữ lịch sử commit). Ngược lại chờ Owner. Sửa tối đa 2 vòng, sau đó G8.
   - **Merge luôn bằng `node tools/merge-pr.mjs <N>`** (`--merge` khi xếp chồng, `--owner` khi Owner bảo merge PR `risk:med`/`high`, `--dry-run` để xem trước): lệnh kiểm mọi điều kiện dưới, merge, rồi dọn nhánh. Xem nhanh trạng thái một PR: `node tools/pr-status.mjs <N>`.
   - Trước mọi lần merge: `headRefOid` của PR phải trùng SHA ghi trong `REVIEW: PASS` mới nhất; head đổi sau PASS → review lại ở phiên sạch. Phiên review không commit (skill `review-pr` §5, P-1).
   - `main` được bảo vệ hai lớp: ruleset `protect-main` trên GitHub (bắt buộc qua PR, cấm force-push và xóa nhánh; không bắt buộc status check vì PR docs-only không chạy CI; bật 28/09/2026 khi repo đã public) và hook `.githooks/pre-push` chặn push thẳng lên `main` (bootstrap đặt `core.hooksPath`). Không bật auto-merge. Việc "CI xanh mới merge" không do server ép, nên Claude phải tự tuân thủ. **Không bao giờ** dùng `--no-verify` hay merge PR code khi CI chưa xanh.
   - **Dọn nhánh ngay sau mỗi lần merge** (Owner quyết định 28/09/2026), cả khi Claude merge lẫn khi Owner bảo merge, không cần hỏi lại: `merge-pr.mjs` tự làm (các bước chi tiết ở đầu file). Lệnh báo thay vì làm khi gặp thay đổi chưa commit, PR khác xếp chồng, hay nhánh / worktree không ở đúng SHA vừa merge (có thể có commit chưa push) → báo Owner. Nhánh của PR cùng task đã đóng không merge (hướng làm bị thay thế) → tự xóa cả remote lẫn local.
   - CI (`.github/workflows/ci.yml`, ADR-0015; chi tiết ở `.claude/rules/ci.md`): PR chỉ đụng `docs/**` / `**/*.md` không chạy CI và merge được không cần CI, trừ `CLAUDE.md` của các package (có khối codemap, `pnpm verify` kiểm) tính là code; PR code chạy Verify + e2e. `merge-pr` chặn PR code khi `main` nhận code mới sau lúc CI của PR bắt đầu: `gh pr update-branch <N>` → CI → review lại head mới.
     - Nhãn `build-exe` **bắt buộc** khi PR đụng `apps/desktop/src-tauri/**`, Cargo, `rust-toolchain.toml`, `package.json`, `pnpm-lock.yaml` hoặc cấu hình build (`vite.config.*`, `tauri.conf.json`). `merge-pr` suy từ danh sách file và chặn khi thiếu nhãn. Gắn lúc tạo (`gh pr create --label build-exe`); gắn sau thì CI không chạy lại: push thêm hoặc `gh pr close` + `gh pr reopen`.
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

Single-context: `CONTEXT.md` ở gốc (từ điển thuật ngữ nghiệp vụ) + ADR ở `docs/decisions/`. See `docs/agents/domain.md`.

## Kiến trúc (ADR-0005, ADR-0006)

```
apps/desktop/      Tauri 2 shell + React UI
packages/domain/   TS thuần — không import package nào khác
packages/db/       Drizzle schema, migrations, repositories; adapter Tauri SQLite + sql.js; seed
packages/ui/       design tokens + components
packages/ai/       zod schema output, adapter (Mock, OpenCode Go), prompt có version, validator — chỉ phụ thuộc domain + zod
tools/             bootstrap, session-start/end, status.mjs, handoff.mjs (+ unit test)
e2e/               Playwright (chạy trên bản build web)
```

- Mốc hay tìm: mỗi package có `CLAUDE.md` riêng (tự nạp khi đọc file trong thư mục đó): vai trò, ranh giới, file hay tìm và **bản đồ export / route sinh tự động** (`pnpm codemap`; `pnpm verify` báo đỏ khi lệch code). Spec theo phase `docs/design/`, mockup `docs/design/mockups/`.

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
| `pnpm verify:rust` | `cargo fmt --check` + clippy (`-D warnings`) + `cargo test` của `src-tauri` — chạy khi sửa Rust (cần Rust; CI chạy trong job build exe) |
| `pnpm build:exe` | Build exe portable |
| `tools/bootstrap.ps1` | Cài/kiểm tra toolchain trên máy mới (idempotent) |

## Quy ước

- Commit: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`), tiếng Anh.
- Tài liệu dự án: tiếng Việt. Code, tên biến, comment: tiếng Anh.
- File theo LF (`.gitattributes`), trừ `.ps1/.cmd` dùng CRLF.
- Script PowerShell: `$ErrorActionPreference = 'Stop'` **không** bắt lỗi lệnh native (`git`, `pnpm`, `rustup`, `winget`…). Sau mỗi lệnh native có tác dụng phụ phải kiểm `$LASTEXITCODE` (hoặc bọc qua hàm helper throw khi ≠ 0) trước khi báo thành công.
- Cuối mỗi phase ghi `docs/metrics/phase-<N>.md` theo `docs/COMPARISON.md`.

## Môi trường Windows và 2 máy

Owner làm ở Home PC (`DESKTOP-KDURKJP`) và Office Laptop (`D13_THINKPAD`). Dựng máy mới: `docs/setup/office-laptop.md`.

- **Phiên song song** có thể chạy trên cùng checkout: commit theo pathspec, không `git add -A`.
- **pnpm:** ở máy không có quyền admin, shim nằm ở `%APPDATA%\npm` và lỗi trong Git Bash → chạy pnpm từ PowerShell. Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- **Script tạm:** dùng `node` (`node -e` / file `.mjs` trong scratchpad). `python3` là stub WindowsApps (có thể treo phiên), không dùng.
- **Sửa file:** dùng công cụ Edit/Write. Chuỗi có `\` (đường dẫn Windows, regex) đi qua heredoc Bash dễ bị hỏng; heredoc dài dễ lỗi `unexpected EOF`.
- **gh:** `gh pr view <n> --comments` và `--json` không dùng chung được → `gh pr view <n> --json comments --jq …`. Nội dung dài (body PR / Issue / comment) ghi ra file rồi `--body-file`.
- **PR xếp chồng:** đổi base (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`) → `gh pr close <n>` + `gh pr reopen <n>` rồi mới merge.
- **Không đồng bộ giữa 2 máy:** memory của Claude, lịch sử hội thoại, DB dev (sinh lại bằng seed), API key. Điều gì phiên ở máy kia phải biết → ghi vào repo (`CLAUDE.md`, ADR, `docs/`) rồi push, hoặc vào HANDOFF (Issue ghim). Cả hai máy cần `gh` đã `gh auth login` (bootstrap kiểm).
