---
name: review-pr
description: Review a Project-2C pull request by number, choosing the review tier from its risk label (risk:low / risk:med / risk:high). Use whenever the Owner asks to review a PR — "review PR #95", "review #95", "review lại PR 95", "PR 95 cần review" — instead of calling code-review directly.
---

# Review PR theo mức risk (ADR-0017)

Đầu vào: số PR. Kết quả: **một** comment `REVIEW: PASS` / `REVIEW: CHANGES` trên PR, rồi merge hoặc báo Owner theo CLAUDE.md. Mọi việc làm inline trong phiên này. **Không subagent.**

## 0. Điều kiện phiên

- Review phải chạy ở phiên **context sạch**. Nếu chính phiên này đã viết code cho PR → báo Owner, đề nghị `/clear` hoặc mở phiên mới. Nếu Owner vẫn cho làm, ghi "không phải phiên sạch" trong comment.
- Không đọc comment review cũ trước khi tự kết luận xong. Với vòng review lại, chỉ đọc comment trước **sau khi** đã có kết luận, để đối chiếu các mục đã báo.

### Nơi review: worktree `Project-2C-review` (ADR-0017 phụ lục)

- Mọi review chạy trong worktree cố định `C:\workspace\Project-2C-review`, đặt **ngoài** checkout chính để `eslint .`, Prettier và `git status` của checkout chính không quét bản sao repo. Nếu phiên đang ở chỗ khác → chuyển thư mục phiên về đó trước. Phiên ở đây có memory Claude riêng (theo đường dẫn); vậy là đúng ý context sạch.
- Worktree này **chỉ để review**: luôn detached HEAD, không tạo nhánh, không commit, không sửa file. Code chỉ làm ở checkout chính `C:\workspace\Project-2C` hoặc worktree của task. Phiên review không bao giờ đổi nhánh của checkout chính (phiên khác có thể đang dùng).
- Đưa worktree về đúng code cần review (sau bước 1 khi đã có `headRefOid`). Mọi lệnh dưới chạy **bên trong** `C:\workspace\Project-2C-review`; `pnpm install` chạy nhầm ở checkout chính sẽ cài cho checkout chính:

  ```bash
  git fetch origin
  git checkout --detach <headRefOid>      # review PR
  git checkout --detach origin/main       # review theo vùng (R1–R4) hoặc review sau merge
  pnpm install --frozen-lockfile          # chỉ khi lockfile đổi
  ```

- Chưa có worktree (máy mới) → tạo một lần, chạy từ checkout chính: `git worktree add --detach ../Project-2C-review origin/main`, rồi `cd ../Project-2C-review` và `pnpm install --frozen-lockfile` bên trong đó.
- **Review song song:** mỗi worktree review chỉ phục vụ **một phiên review tại một thời điểm**. Hai phiên review chung một worktree sẽ `git checkout` đè lên nhau, và phiên này đọc nhầm code của PR kia mà không biết (xảy ra khi review #174 và #175 cùng lúc). Phiên review thứ hai chạy trong worktree `C:\workspace\Project-2C-review-2`. Worktree này có vai trò và quy tắc y như `Project-2C-review`, và cũng tạo một lần cho mỗi máy: `git worktree add --detach ../Project-2C-review-2 origin/main`, rồi `pnpm install --frozen-lockfile` bên trong đó. Chọn worktree review nào là việc của Owner, qua việc mở phiên ở thư mục đó.
- Chốt chặn: trước khi đăng comment, chạy `git rev-parse HEAD` và so với `headRefOid`. Nếu khác, tức là có phiên khác đã đổi worktree. Khi đó đọc lại mọi file đã dùng làm bằng chứng bằng `git show <headRefOid>:<path>` rồi mới kết luận, và ghi việc này vào comment.
- Vòng sửa sau review:
  1. Phiên review chỉ đọc và đăng comment.
  2. Phiên code sửa ở checkout chính hoặc worktree của task, rồi push.
  3. Phiên review sạch mới: `git fetch origin` + `git checkout --detach <headRefOid mới>`.

  Worktree review không bao giờ giữ nhánh, nên không xung đột khi phiên code checkout nhánh PR.

## 1. Thu thập và chốt điểm so sánh

```bash
gh pr view <N> --json number,title,state,isDraft,baseRefName,headRefName,headRefOid,labels,closingIssuesReferences,files,additions,deletions,statusCheckRollup,body
gh issue view <issue> --json title,body,labels
git fetch origin <baseRefName> <headRefName>
git diff --stat origin/<baseRefName>...<headRefOid>
```

- PR đã đóng/merge, draft, ref không tồn tại, hoặc diff rỗng → dừng, báo Owner.
- Base là nhánh khác `main` (PR xếp chồng) → so với base đó, không so với `main`.
- Ghi SHA head vào comment. Review là của đúng SHA đó (P-1, review đóng Phase 3 F-16): `REVIEW: PASS` chỉ có giá trị cho SHA ghi trong comment.

## 2. Xác định mức (bắt buộc trước khi review)

1. Nhãn `risk:*` của Issue mà PR đóng (`closingIssuesReferences`). Nếu PR không đóng Issue nào thì lấy nhãn của PR.
2. Không có nhãn, hoặc nhãn Issue và PR khác nhau → **dừng, hỏi Owner**.
3. **Chỉ nâng mức, không bao giờ hạ.** Diff chạm một trong các mục dưới thì nâng lên ít nhất mức ghi bên cạnh, và ghi lý do vào comment:

| Diff chạm | Mức tối thiểu |
|---|---|
| `packages/db/migrations/**`, `packages/db/src/schema*` | high |
| `apps/desktop/src-tauri/**` (Rust, lưu file) | high |
| `packages/ai/**` (prompt, guardrail, validator) | high |
| golden: `packages/domain/src/golden/**`, `docs/golden/**`, `packages/db/src/golden-*` | high |
| `*.ps1`, `.githooks/**`, `.github/workflows/**`, `.claude/settings.json`, `.claude/hooks/**` | med |
| Vượt ngưỡng ~400 dòng code sản phẩm / ~800 dòng tổng diff (không tính file sinh tự động PR đã liệt kê) | med |

PR chỉ sửa docs (`docs/**`, `*.md`) → chạy mức `low`, bỏ trục Correctness.

## 3. Chạy theo mức

| Bước | low | med | high |
|---|---|---|---|
| A. Spec | ✓ | ✓ | ✓ |
| B. Standards — `docs/process/REVIEW-CHECKLIST.md` | ✓ | ✓ | ✓ |
| B'. Mùi code (không chặn) | — | 4 mùi | 12 mùi |
| C. Correctness | tự rà nhanh | `code-review` **medium** | `code-review` **high** |
| CI xanh trên đúng SHA head | ✓ | ✓ | ✓ |

### A. Trục Spec (từ mattpocock `code-review`)

Đối chiếu diff với Issue (spec, test chấp nhận, file được phép sửa) và tài liệu Issue trỏ tới (ADR, `docs/design/**`, golden). Báo ba loại, mỗi mục **trích dòng spec**:

- (a) yêu cầu thiếu hoặc làm dở, gồm cả test chấp nhận không có test tương ứng;
- (b) làm ngoài phạm vi, hoặc sửa file không được phép;
- (c) có làm nhưng làm sai.

### B. Trục Standards

Đi hết `docs/process/REVIEW-CHECKLIST.md`. Quy chuẩn repo luôn thắng. Không review lại những gì tooling đã kiểm (`pnpm verify`: lint, typecheck, `lint:deps`, coverage) khi CI xanh.

### B'. Mùi code (Fowler, *Refactoring* ch.3), luôn là **không chặn**

- **med**, 4 mùi: *Mysterious Name* (tên không nói nó làm gì) · *Duplicated Code* (cùng một logic lặp ở nhiều hunk) · *Speculative Generality* (tham số/abstraction spec không cần) · *Primitive Obsession* (dùng số/chuỗi thô thay khái niệm domain, như tiền, ngày, chỉ số ngoài hàm chuẩn `packages/domain`).
- **high**, thêm 8 mùi: *Feature Envy* · *Data Clumps* · *Repeated Switches* · *Shotgun Surgery* · *Divergent Change* · *Message Chains* · *Middle Man* · *Refused Bequest*.

Mỗi mùi ghi là "có thể là <mùi>", kèm hunk và cách sửa gợi ý. Quy chuẩn repo cho phép thì bỏ qua.

### C. Trục Correctness

- **low:** tự rà ca biên, nhánh lỗi, null/rỗng, off-by-one, async/thứ tự ghi trong diff. Không gọi skill.
- **med / high:** gọi Skill `code-review` với args `medium <N>` hoặc `high <N>`.
  - **Không** dùng `--comment`, `--fix`, `ultra`. Kết quả chỉ để đọc; việc đăng comment và sửa code do quy trình 2C làm (ADR-0017 §3).
  - Coi kết quả là **giả thuyết**: đọc code để xác nhận từng mục trước khi đưa vào comment, bỏ mục không tái hiện được bằng lập luận hoặc test.
  - Nếu skill lỗi hoặc cần tool bị chặn (`Agent`) → rà Correctness inline theo cùng mức, ghi "code-review không chạy được: <lý do>" vào comment.
- **high:** khi một phát hiện cần bằng chứng, tái hiện bằng test ở thư mục tạm hoặc worktree riêng. Không đổi nhánh của checkout chung (có thể có phiên khác đang dùng).

## 4. Kết luận và comment

- **Chặn** = sai spec (A), vi phạm checklist (B), bug được xác nhận (C). **Không chặn** = mùi code, NIT, gợi ý.
- Có ít nhất một mục chặn → `REVIEW: CHANGES`. Ngược lại → `REVIEW: PASS` (có thể "kèm ghi chú").
- Không gộp và không xếp hạng lẫn nhau giữa các trục.

Mẫu comment (`gh pr comment <N> --body-file <file tạm>`):

```
REVIEW: PASS | CHANGES

PR #<N>, head `<sha7>`, mức `<risk>` (nâng từ `<nhãn>` vì …, nếu có). Đầu vào: Issue #<i>, diff `<base>...<sha7>`, <tài liệu đã đọc>. Correctness: <inline | code-review medium/high | không chạy được: …>.

## Spec
- [chặn] `file:line`: … (spec: "…")

## Standards
- [chặn|không chặn] `file:line`: … (checklist §…)

## Correctness
- [chặn] `file:line`: … (tái hiện: …)

## Tóm tắt
Spec: n mục (nặng nhất: …) · Standards: n · Correctness: n
```

Trục nào không có mục thì ghi "Không có phát hiện".

## 5. Sau comment

- `risk:low` (sau khi nâng mức vẫn là low) + `REVIEW: PASS` + CI xanh trên head → `node tools/merge-pr.mjs <N>` (`--merge` khi có PR xếp chồng): lệnh kiểm lại các điều kiện, merge và dọn nhánh theo CLAUDE.md. Lệnh đọc mức từ phần ``mức `<risk>` `` của comment (mẫu §4), nên mức đã nâng phải ghi đúng dạng đó.
- Còn lại → báo Owner: kết luận, số mục mỗi trục, mục chặn nặng nhất.
- **Phiên review không commit, không push, không sửa code** — kể cả sửa "nhỏ" cho mục vừa báo (P-1). Sửa là việc của phiên code; comment không bao giờ ghi "đã sửa trong PR" thay cho một vòng review mới.
- **Trước khi merge** (Claude tự merge hoặc Owner bảo merge): `headRefOid` phải trùng SHA trong comment `REVIEW: PASS` mới nhất (`node tools/pr-status.mjs <N>` in cả hai; `merge-pr.mjs` từ chối khi lệch). Head đã đổi sau PASS (thêm commit, rebase, cập nhật base) → **review lại** diff từ SHA đã PASS tới head mới, ở phiên sạch, rồi mới merge.
