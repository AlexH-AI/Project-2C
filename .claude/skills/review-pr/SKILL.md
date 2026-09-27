---
name: review-pr
description: Review a Project-2C pull request by number, choosing the review tier from its risk label (risk:low / risk:med / risk:high). Use whenever the Owner asks to review a PR — "review PR #95", "review #95", "review lại PR 95", "PR 95 cần review" — instead of calling code-review directly.
---

# Review PR theo mức risk (ADR-0017)

Đầu vào: số PR. Kết quả: **một** comment `REVIEW: PASS` / `REVIEW: CHANGES` trên PR, rồi merge hoặc báo Owner theo CLAUDE.md. Mọi việc làm inline trong phiên này. **Không subagent.**

## 0. Điều kiện phiên

- Review phải chạy ở phiên **context sạch**. Nếu chính phiên này đã viết code cho PR → báo Owner, đề nghị `/clear` hoặc mở phiên mới. Nếu Owner vẫn cho làm, ghi "không phải phiên sạch" trong comment.
- Không đọc comment review cũ trước khi tự kết luận xong. Với vòng review lại, chỉ đọc comment trước **sau khi** đã có kết luận, để đối chiếu các mục đã báo.

### Nơi review: worktree `review-main` (ADR-0017 phụ lục)

- Mọi review chạy trong worktree cố định `C:\workspace\Project-2C\.claude\worktrees\review-main`. Nếu phiên đang ở chỗ khác → chuyển thư mục phiên về đó trước.
- Worktree này **chỉ để review**: luôn detached HEAD, không tạo nhánh, không commit, không sửa file. Code chỉ làm ở checkout chính `C:\workspace\Project-2C` hoặc worktree của task. Phiên review không bao giờ đổi nhánh của checkout chính (phiên khác có thể đang dùng).
- Đưa worktree về đúng code cần review (sau bước 1 khi đã có `headRefOid`):

  ```bash
  git fetch origin
  git checkout --detach <headRefOid>      # review PR
  git checkout --detach origin/main       # review theo vùng (R1–R4) hoặc review sau merge
  pnpm install --frozen-lockfile          # chỉ khi lockfile đổi
  ```

- Chưa có worktree (máy mới) → tạo một lần từ checkout chính: `git worktree add --detach .claude/worktrees/review-main origin/main`, rồi `pnpm install --frozen-lockfile` trong đó.

## 1. Thu thập và chốt điểm so sánh

```bash
gh pr view <N> --json number,title,state,isDraft,baseRefName,headRefName,headRefOid,labels,closingIssuesReferences,files,additions,deletions,statusCheckRollup,body
gh issue view <issue> --json title,body,labels
git fetch origin <baseRefName> <headRefName>
git diff --stat origin/<baseRefName>...<headRefOid>
```

- PR đã đóng/merge, draft, ref không tồn tại, hoặc diff rỗng → dừng, báo Owner.
- Base là nhánh khác `main` (PR xếp chồng) → so với base đó, không so với `main`.
- Ghi SHA head vào comment. Review là của đúng SHA đó.

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

- `risk:low` (sau khi nâng mức vẫn là low) + `REVIEW: PASS` + CI xanh trên head → merge theo CLAUDE.md (`--squash`, hoặc `--merge` khi có PR xếp chồng).
- Còn lại → báo Owner: kết luận, số mục mỗi trục, mục chặn nặng nhất. Không tự sửa code trong phiên review.
