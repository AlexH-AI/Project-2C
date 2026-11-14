---
name: review-pr
description: Review a Project-2C pull request by number, choosing the review tier from its risk label (risk:low / risk:med / risk:high). Use whenever the Owner asks to review a PR — "review PR #95", "review #95", "review lại PR 95", "PR 95 cần review" — instead of calling code-review directly.
---

# Review PR theo mức risk (ADR-0017)

Đầu vào: số PR. Kết quả: **một** comment `REVIEW: PASS` / `REVIEW: CHANGES` trên PR, rồi merge hoặc báo Owner theo CLAUDE.md. Mặc định làm inline trong phiên này; dùng subagent / Workflow khi Owner bật (`ultracode`, ADR-0001 phụ lục M8). Subagent chỉ đọc, kết quả của chúng là giả thuyết: phiên này tự xác nhận từng mục trên code rồi mới ghi vào comment.

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

PR chỉ sửa docs (`docs/**`, `*.md`) → chạy mức `low`, bỏ trục Correctness (không gọi `code-review`). Ngoại lệ: file trong `CODE_DOCS` (`tools/pr-core.mjs`: `CLAUDE.md` của package, `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`) tính là code — review như PR code, theo nhãn `risk:*` và bảng nâng mức trên.

## 3. Chạy theo mức

| Bước | low | med | high |
|---|---|---|---|
| A. Spec | ✓ | ✓ | ✓ |
| B. Standards — `docs/process/REVIEW-CHECKLIST.md` | ✓ | ✓ | ✓ |
| B'. Mùi code (không chặn) | — | 4 mùi | 12 mùi |
| C. Correctness: `code-review`, args ở §C | **high** | **max** | **max**, `--max-findings all` |
| CI xanh trên đúng SHA head | ✓ | ✓ | ✓ |

### A. Trục Spec (từ mattpocock `code-review`)

Đối chiếu diff với Issue (spec, test chấp nhận, file được phép sửa) và tài liệu Issue trỏ tới (ADR, `docs/design/**`, golden). Báo ba loại, mỗi mục **trích dòng spec**:

- (a) yêu cầu thiếu hoặc làm dở, gồm cả test chấp nhận không có test tương ứng;
- (b) làm ngoài phạm vi, hoặc sửa file không được phép;
- (c) có làm nhưng làm sai.

**Ghi chú OPEN liên quan** (Owner quyết 17/10/2026, T-261): trong worktree review (đã ở head, sổ là bản của PR) chạy `node tools/notes-for.mjs --pr <N>`. Mỗi mục "Trùng file" phải có một dòng trong mục "Ghi chú OPEN liên quan" của thân PR (khớp theo `L<dòng>` hoặc đầu mục):

- thiếu dòng, kể cả khi thân PR không có mục này → **chặn**, loại (a);
- ghi "đã sửa" mà diff không sửa → **chặn**, loại (c);
- lý do "để lại" yếu (mục nhỏ, đúng file, vừa phạm vi) → không chặn, ghi gợi ý;
- mục mang nhãn đích của việc khác ghi "để lại → <nhãn>" → lý do đủ, không gợi ý gộp (luật nhãn đích: đầu mục OPEN của sổ, `CLAUDE.md` "Quy trình một task" bước 2, ADR-0001 phụ lục M14);
- mục mang nhãn của chính Issue (`[T-… #<issue>]`) phải "đã sửa". Để lại mà không nêu nhãn đích mới cùng loại (vượt cỡ, cần cổng) → **chặn**, loại (a). `notes-for` chỉ in mục trùng file: tìm cả mục nhãn của Issue mà không trùng file bằng `rg -n "#<issue>\]" docs/state/review-notes.md`, áp cùng luật.

Head chưa có `tools/notes-for.mjs` (nhánh cắt trước khi T-261 merge) → vẫn đứng trong worktree review, chạy bản của checkout chính: `node C:/workspace/Project-2C/tools/notes-for.mjs --pr <N>` (dấu `/` chạy được cả trong Bash lẫn PowerShell). Lệnh đọc sổ và danh sách file của thư mục đang đứng, tức của head.

**PR sửa phát hiện** (T-386; kế hoạch deep review `docs/process/deep-review-phase-1-6.md` §L6.10) là PR đóng Issue có mục "Ngân sách": Issue sửa vấn đề deep review `DR6-*` hay ghi chú của sổ. Mục đó trống (form ghi `_No response_`, hay chỉ ghi "Không", "—", "Không áp dụng") hay Issue không có mục đó → bỏ qua đoạn này. Thân PR sửa phát hiện có ba mục, đúng tên:

| Mục của thân PR | Ghi gì | Review kiểm |
|---|---|---|
| "Test đỏ khi gỡ phần sửa" | Lệnh và kết quả: test của PR đỏ khi gỡ phần sửa, xanh khi có. PR chỉ sửa tài liệu ghi "không áp dụng" | Test nêu có trong diff và chạm đúng dòng sửa. Mức high, hay khi nghi: chạy lại ở thư mục tạm hoặc worktree riêng như §C, không sửa worktree review |
| "Quét cùng mẫu" | Lệnh `rg` / probe đã chạy, mọi chỗ cùng mẫu (`path:dòng`), quyết định từng chỗ: đã sửa / không cùng lỗi / để lại + lý do | Chạy lại lệnh ở head. Chỗ lệnh ra mà danh sách không có, chỗ ở mục "Quét cùng mẫu" của Issue mà danh sách không có, chỗ "đã sửa" mà diff không sửa → không khớp |
| "Cỡ so ngân sách" | Dòng sản phẩm / dòng test thực tế so với ngân sách của Issue | Tự tính ở head như dưới, so với số của thân PR |

- Thiếu một mục, hay mục ghi mà không khớp diff → **chặn**, loại (a) hay (c).
- **Cỡ** = dòng thêm + xóa của `git diff --numstat -M origin/<baseRefName>...<headRefOid>`, mỗi file xếp bằng `classifyFile` của `tools/size-report-core.mjs` (như §L6.3 của kế hoạch): `product` là dòng sản phẩm, `test` là dòng test. File sinh tự động và file `classifyFile` không đếm (`docs/**`, `*.md`, `.json`…) không tính. Ngân sách là một khoảng thì lấy cận trên. Ba chỗ lệnh không tự làm, tính tay theo cùng cách:
  - file Rust: `numstat` chỉ cho một tổng mỗi file, `classifyFile` xếp mọi `.rs` là `product`. Tách theo hunk của `git diff -M origin/<baseRefName>...<headRefOid> -- <file>.rs`: dòng đổi nằm trong khối `#[cfg(test)]` là dòng test, còn lại là dòng sản phẩm;
  - file đổi tên: `numstat` in dạng `dir/{a.ts => b.ts}`, chuỗi đó `classifyFile` không xếp được (trả `null`). Lấy đường dẫn mới (`dir/b.ts`) rồi xếp;
  - ngân sách thiếu số của một loại, hay số đó bằng 0: không so 1,5 lần cho loại đó, chỉ ghi số thực tế.
- Dòng sản phẩm vượt 1,5 lần ngân sách sản phẩm, hay dòng test vượt 1,5 lần ngân sách test (loại có ngân sách, như trên) → **chặn**, nên `REVIEW: CHANGES`; trừ khi thân PR trích câu Owner đồng ý, nguyên văn, có ngày. Comment ghi số thực tế, ngân sách và tỉ lệ của cả hai.

### B. Trục Standards

Đi hết `docs/process/REVIEW-CHECKLIST.md`. Quy chuẩn repo luôn thắng. Không review lại những gì tooling đã kiểm (`pnpm verify`: lint, typecheck, `lint:deps`, coverage) khi CI xanh.

### B'. Mùi code (Fowler, *Refactoring* ch.3), luôn là **không chặn**

- **med**, 4 mùi: *Mysterious Name* (tên không nói nó làm gì) · *Duplicated Code* (cùng một logic lặp ở nhiều hunk) · *Speculative Generality* (tham số/abstraction spec không cần) · *Primitive Obsession* (dùng số/chuỗi thô thay khái niệm domain, như tiền, ngày, chỉ số ngoài hàm chuẩn `packages/domain`).
- **high**, thêm 8 mùi: *Feature Envy* · *Data Clumps* · *Repeated Switches* · *Shotgun Surgery* · *Divergent Change* · *Message Chains* · *Middle Man* · *Refused Bequest*.

Mỗi mùi ghi là "có thể là <mùi>", kèm hunk và cách sửa gợi ý. Quy chuẩn repo cho phép thì bỏ qua.

### C. Trục Correctness

Mọi mức gọi Skill `code-review` (Owner quyết 21/10/2026, ADR-0017 phụ lục nâng mức `code-review`), với args:

| Mức review | args |
|---|---|
| low | `high <N> --max-findings default` |
| med | `max <N> --max-findings default` |
| high | `max <N> --max-findings all` |

- Luôn truyền cả mức effort lẫn `--max-findings`. Theo mô tả của `code-review`, lựa chọn `--max-findings` được giữ cho tới khi truyền `--max-findings default`, còn khi thiếu mức effort thì skill dùng lại mức gõ lần trước. Review mức low / med truyền `default` để không kế thừa `all` của một review mức high chạy trước đó.
- **Không** dùng `--comment`, `--fix`, `ultra`. Kết quả chỉ để đọc; việc đăng comment và sửa code do quy trình 2C làm (ADR-0017 mục 4).
- Coi kết quả là **giả thuyết**: đọc code để xác nhận từng mục trước khi đưa vào comment, bỏ mục không tái hiện được bằng lập luận hoặc test. Ở mức `max`, nhất là khi kèm `--max-findings all`, `code-review` báo cả những mục chưa chắc.
- Owner chưa bật subagent (ADR-0001 phụ lục M8) → vẫn chạy `code-review`, nó rà inline trong phiên này. Chỉ khi skill lỗi, hoặc đòi subagent mà không có đường inline → rà Correctness inline theo cùng mức, ghi "code-review không chạy được: <lý do>" vào comment.
- **high:** khi một phát hiện cần bằng chứng, tái hiện bằng test ở thư mục tạm hoặc worktree riêng. Không đổi nhánh của checkout chung (có thể có phiên khác đang dùng).

## 4. Kết luận và comment

- **Chặn** = sai spec (A), vi phạm checklist (B), bug được xác nhận (C). **Không chặn** = mùi code, NIT, gợi ý.
- Mục không chặn sẽ được PR sổ ghi vào `docs/state/review-notes.md`: đối chiếu sổ (OPEN / ACCEPTED) trước khi ghi một mục là MỚI, và mỗi mục nêu ít nhất một đường dẫn file trong backtick để `notes-for` khớp nó với task sau.
- **Đề xuất nhãn đích** cho mỗi mục không chặn (Owner quyết 12/11/2026, ADR-0001 phụ lục M14; luật ở đầu mục OPEN của sổ). Ghi mức theo thước §4.3 của kế hoạch deep review `docs/process/deep-review-phase-1-6.md` (Critical / High / Medium / Low / Nit) và trục chính theo §4.1 (E, C, D, G, S, P, B, T, A), để xếp thứ tự: Medium trở lên, và Low ở trục D (dữ liệu), S (an toàn ở ranh giới), G (guardrail AI) làm trước; Low có hậu quả lên dữ liệu đã lưu, backup, key hay output AI thì xếp D / S / G, dù trục khác cũng hợp. Rồi đề xuất nhãn, lấy bậc đầu tiên có:
  1. Issue đang mở phụ trách file đó → `[T-… #…]`;
  2. việc dự kiến cùng loại trong spec (danh sách tên đích, `docs/design/phase-6-phan-hoi-dung-thu.md` §12) → `[<tên việc>]`;
  3. Issue dọn sổ cùng loại → `[DS-…]`; không DS nào cùng loại thì đề xuất một DS mới, nêu loại.

  Mọi mục làm trước v1.0; chỉ Owner chuyển một mục sang ACCEPTED (không sửa). Đề xuất không đổi kết luận PASS / CHANGES của PR. PR sổ gắn nhãn theo nó (`auto-issues` §3.5).
- Có ít nhất một mục chặn → `REVIEW: CHANGES`. Ngược lại → `REVIEW: PASS` (có thể "kèm ghi chú").
- Không gộp và không xếp hạng lẫn nhau giữa các trục.

Mẫu comment (`gh pr comment <N> --body-file <file tạm>`):

```
REVIEW: PASS | CHANGES

PR #<N>, head `<sha7>`, mức `<risk>` (nâng từ `<nhãn>` vì …, nếu có). Đầu vào: Issue #<i>, diff `<base>...<sha7>`, <tài liệu đã đọc>. Correctness: <code-review <args đã truyền> | bỏ: PR chỉ sửa docs | code-review không chạy được: …, rà inline>.

## Spec
- [chặn] `file:line`: … (spec: "…")

## Standards
- [chặn] `file:line`: … (checklist §…)
- [không chặn · Nit / C · đích: [DS-1b]] `file:line`: … (checklist §…)

## Correctness
- [chặn] `file:line`: … (tái hiện: …)
- [không chặn · Low / D · đích: [T-… #…]] `file:line`: …

## Tóm tắt
Spec: n mục (nặng nhất: …) · Standards: n · Correctness: n
```

Trục nào không có mục thì ghi "Không có phát hiện". Mục không chặn ở trục nào cũng ghi mức / trục và đề xuất nhãn đích như hai dòng mẫu trên.

## 5. Sau comment

- `risk:low` (sau khi nâng mức vẫn là low) + `REVIEW: PASS` + CI xanh trên head → `node tools/merge-pr.mjs <N>` (`--merge` khi có PR xếp chồng): lệnh kiểm lại các điều kiện, merge và dọn nhánh theo CLAUDE.md. Lệnh đọc mức từ phần ``mức `<risk>` `` của comment (mẫu §4), nên mức đã nâng phải ghi đúng dạng đó.
- Còn lại → báo Owner: kết luận, số mục mỗi trục, mục chặn nặng nhất.
- **Phiên con của pipeline `auto-issues`** (tin nhắn có dòng `[auto-issues]`, ADR-0001 phụ lục M11): làm tới hết §4 rồi dừng.
  - Không merge, kể cả `risk:low`: phiên điều phối merge.
  - Không hỏi Owner trong phiên. Chỗ skill bảo dừng hỏi Owner thì kết thúc bằng dòng `AUTO-CHILD: [PR #<N>] CẦN OWNER — …`.
  - Trước khi kết luận, đọc các comment `Quyết định Owner (…)` trên PR và Issue. Mục Owner đã quyết là không chặn thì không tính là chặn. Đó là quyết định của Owner, không phải comment review cũ, nên §0 không cấm việc này. Nếu không đọc, mục Owner đã bác sẽ lại bị báo chặn, và pipeline quay về hỏi Owner trên cùng head.
  - Đoạn mở đầu của comment ghi `Phiên review: <tên phiên> (auto-issues).`; dòng cuối của lượt là dòng `AUTO-CHILD: …` theo brief.
- **Phiên review không commit, không push, không sửa code** — kể cả sửa "nhỏ" cho mục vừa báo (P-1). Sửa là việc của phiên code; comment không bao giờ ghi "đã sửa trong PR" thay cho một vòng review mới.
- **Trước khi merge** (Claude tự merge hoặc Owner bảo merge): `headRefOid` phải trùng SHA trong comment `REVIEW: PASS` mới nhất (`node tools/pr-status.mjs <N>` in cả hai; `merge-pr.mjs` từ chối khi lệch). Head đã đổi sau PASS (thêm commit, rebase, cập nhật base) → **review lại** diff từ SHA đã PASS tới head mới, ở phiên sạch, rồi mới merge.
