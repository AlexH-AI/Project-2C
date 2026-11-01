---
name: auto-issues
description: Run the Project-2C Issue queue unattended (ADR-0001 appendix M11). An orchestrating session kept going by /goal opens four child sessions (coding-ses1/2 in the main checkout, review-1/2 in the review worktrees), gives each Issue to a cleared coding session, waits for CI, has a cleared review session run review-pr, sends CHANGES back to the same coding session until PASS, merges at any risk, has the review notes PR written, then proposes Issues from the OPEN notes and stops for the Owner. Use when the Owner's /goal or message names auto-issues.
---

# Pipeline auto-issues (ADR-0001 phụ lục M11)

Một **phiên điều phối** chạy hàng đợi Issue, mỗi lần một Issue, qua **4 phiên con** thật trong sidebar. Phiên điều phối không viết code, không review, không sửa file. Nó giao việc, chờ, đọc trạng thái từ GitHub, merge và hỏi Owner.

Pipeline có hai quyền riêng (Owner quyết 01/11/2026):
- merge PR mọi mức risk do pipeline làm ra (`merge-pr --owner`);
- lặp review tới PASS, không trần.

Mọi quy tắc khác của `CLAUDE.md` giữ nguyên: quy trình một task, review phiên sạch bằng `review-pr`, merge qua `tools/merge-pr.mjs`, cổng G1–G7.

| Phiên | Thư mục | Việc |
|---|---|---|
| điều phối (Owner mở) | `C:\workspace\Project-2C` | giao việc, chờ, merge, hỏi Owner |
| `coding-ses1`, `coding-ses2` | `C:\workspace\Project-2C` (checkout chính) | làm Issue, sửa theo CI / review |
| `review-1` | `C:\workspace\Project-2C-review` | `review-pr`, rồi PR sổ của review đó |
| `review-2` | `C:\workspace\Project-2C-review-2` | như `review-1` |

Phiên điều phối chạy `tools/auto-wait.mjs` và `tools/pr-status.mjs` từ worktree riêng `C:\workspace\Project-2C-auto`. Worktree này detached ở `origin/main` và chỉ đọc, như worktree review. Lý do: phiên code sửa file ngay trên checkout chính, kể cả `tools/`. Hai công cụ đó chỉ dùng module có sẵn của Node, nên không cần `pnpm install`.

## Owner chạy thế nào

1. Lưu trữ 4 phiên cũ `coding-ses1`, `Coding-ses2`, `review-1`, `review-2`. Pipeline tự mở 4 phiên con mới cùng tên, vì app chỉ cho `/clear` phiên do chính phiên điều phối mở.
2. Mở một phiên mới ở `C:\workspace\Project-2C`, chế độ quyền **auto**; phiên con theo chế độ của phiên này. Checkout chính phải sạch và ở `main`. Trong lúc pipeline chạy, không phiên nào khác làm ở checkout chính hay ở hai worktree review.
3. Gõ đúng một dòng:

   ```text
   /goal Dùng skill auto-issues chạy hàng đợi Issue. Điều kiện xong: ở cuối một lượt, Claude tự in dòng "AUTO: XONG" ngay sau bảng tóm tắt các PR đã merge trong đợt, hoặc dòng "AUTO: DỪNG — " kèm lý do cụ thể. Chữ mẫu trong file skill không tính.
   ```

   Muốn chọn Issue thì thêm "Hàng đợi: #932 #933." vào câu.
4. Theo dõi bằng cách mở phiên con trong sidebar. Pipeline hỏi anh bằng thông báo đẩy và câu hỏi trong phiên điều phối. Đừng ghim phiên con, và đừng để nó mở trên màn hình lúc nó sắp nhận việc mới: app không cho `/clear` phiên đang mở.
5. Chạy tiếp sau khi dừng, hoặc khi `/goal` dừng sớm vì đọc nhầm dòng mốc: gõ lại `/goal …` **trong cùng phiên điều phối**.

## 1. Lượt đầu

Chỉ lượt Owner gõ `/goal` được mở phiên con. Lượt do lệnh nền, tin báo của phiên con hay nhắc của `/goal` khởi động thì app từ chối mở phiên.

1. **Kiểm đầu.** Điều nào sai thì in `AUTO: DỪNG — <lý do>`.
   - `git -C C:/workspace/Project-2C status --porcelain` rỗng và nhánh là `main`; sau đó `git -C C:/workspace/Project-2C pull --ff-only`.
   - `C:/workspace/Project-2C-review` và `C:/workspace/Project-2C-review-2`: `status --porcelain` rỗng.
   - `C:/workspace/Project-2C-auto`: chưa có thì `git -C C:/workspace/Project-2C worktree add --detach ../Project-2C-auto origin/main`, có rồi thì `git -C C:/workspace/Project-2C-auto checkout --detach origin/main`.
   - `gh auth status` thành công.
2. **Hàng đợi.**
   - Lệnh `/goal` có danh sách thì dùng danh sách đó. Không có thì lấy các Issue mở có nhãn `type:task` và `ready-for-agent` của milestone đang mở, xếp theo số. Có nhiều milestone thì hỏi Owner.
   - Một Issue chỉ tới lượt khi mọi Issue trong ô "Bị chặn bởi" của nó đã đóng. Issue còn bị chặn lùi xuống sau Issue kế.
   - Bỏ khỏi hàng và báo Owner mọi Issue có "File / thư mục được phép sửa" chạm `.claude/skills/auto-issues/**` hoặc `tools/auto-wait*`. Pipeline không tự sửa chính nó; Owner làm Issue đó theo cách thường.
   - Hỏi Owner một câu (§5): "Chạy hàng đợi #a → #b → …?". Phương án: Chạy / Dừng; Owner sửa hàng đợi qua "Other".
3. **Phiên con.**
   - `list_sessions {"linked": true}`. Có đủ 4 phiên `coding-ses1`, `coding-ses2`, `review-1`, `review-2` chưa lưu trữ thì dùng lại.
   - Thiếu phiên nào thì mở bằng `start_session` (nạp bằng ToolSearch nếu chưa có):
     - tham số chung: `initiation: "user_asked"`, `context: "fresh"`; `title` và `name` là tên phiên; `prompt` là brief chờ (§3.0); `background` là đoạn chung (§3.0). Không đặt `model`, `effort`, `permission_mode`, để phiên con theo phiên điều phối;
     - `coding-ses1`, `coding-ses2`: `use_worktree: false`;
     - `review-1`: `cwd: "C:\\workspace\\Project-2C-review"`; `review-2`: `cwd: "C:\\workspace\\Project-2C-review-2"`; cả hai `use_worktree: false`.
   - App từ chối mở thì in `AUTO: DỪNG — không mở được phiên con <tên>: <lý do>`.
4. Làm nhịp đầu (§2) ngay trong lượt này.

## 2. Mỗi nhịp: đọc, làm một bước, chờ

Mỗi lượt của phiên điều phối là một **nhịp**, dù lượt đó do gì khởi động: lượt `/goal`, lệnh chờ xong, tin báo của phiên con (`<side-sessions-event>`), nhắc của `/goal`, hay câu trả lời của Owner.

Một nhịp gồm: đọc trạng thái → làm **đúng một bước** trong bảng → đặt lệnh chờ → kết thúc lượt. Không dựa vào trí nhớ: mỗi nhịp đọc lại từ GitHub và từ phiên con. Nhờ vậy nhịp thừa, lệnh chờ cũ xong muộn hay context bị nén đều không làm sai.

**Đọc trạng thái:**

1. **Issue đang làm** là Issue đầu hàng chưa xong. Một Issue xong khi:
   - Issue đã đóng;
   - PR của nó đã merge;
   - PR sổ của PR đó đã merge, hoặc PR có comment `Sổ ghi chú: không đổi … (auto-issues)`.
2. **PR của Issue:** `gh issue view <I> --json state,closedByPullRequestsReferences` cho số PR `N`, dù PR còn mở hay đã merge.
3. **Trạng thái PR** (khi có `N`), chạy trong `C:/workspace/Project-2C-auto`:
   - `node tools/pr-status.mjs <N>`: trạng thái, head `H`, REVIEW mới nhất kèm SHA, mức;
   - `node tools/auto-wait.mjs ci <N> --once`: CI đã xong chưa, kể cả job có check đến muộn (exe).
4. **Phiên con:**
   - `list_sessions {"linked": true}`: phiên đang chạy hay rảnh, `lastActivityAt`;
   - phiên rảnh vừa xong việc: `list_events` (limit 6) để đọc dòng `AUTO-CHILD:` cuối.
   - Phiên code của PR là phiên ghi trong dòng `Phiên code: …` của thân PR. Phiên review đã PASS là phiên ghi trong câu `Phiên review: …` của comment PASS.

**Bảng bước** (làm theo hàng đầu tiên khớp; `I` = Issue, `N` = PR, `H` = head):

| Trạng thái | Bước | Lệnh chờ (`auto-wait`) |
|---|---|---|
| Phiên con rảnh, dòng `AUTO-CHILD` cuối là `CẦN OWNER` hoặc `KHÔNG ĐỒNG Ý`, và sau dòng đó chưa có tin nhắn nào của phiên điều phối | Hỏi Owner (§5), gửi câu trả lời về phiên đó | theo việc của phiên đó |
| Chưa có PR, không phiên code nào đang làm `I` | `/clear` phiên code ít dùng gần nhất, gửi §3.1 | `pr <I> --timeout 60` |
| Chưa có PR, phiên code đang làm `I` | — | `pr <I> --timeout 60` |
| PR mở, phiên code của PR còn chạy (chưa review head nào khi nó còn có thể push) | — | giữ lệnh chờ đang chạy; không có thì `sleep --timeout 15` |
| PR mở, CI đang chạy | — | `ci <N> --timeout 60` |
| CI đỏ trên `H` | Gửi §3.3 cho phiên code của PR | `ci <N> --not <H> --timeout 60` |
| CI xanh trên `H`, chưa có REVIEW cho `H`, không phiên review nào đang review `N` | `/clear` phiên review ít dùng gần nhất, gửi §3.2 | `review <N> --timeout 60` |
| Phiên review đang review `N` | — | `review <N> --timeout 60` |
| `REVIEW: CHANGES` @`H` | Gửi §3.4 cho phiên code của PR | `ci <N> --not <H> --timeout 60` |
| `REVIEW: PASS` @`H`, CI xanh | Merge (§4), rồi làm tiếp nhịp ngay | — |
| PR đã merge, chưa có PR sổ | Gửi §3.5 cho phiên review đã PASS | `title "record the notes of the PR <N> review" --timeout 30` |
| PR sổ đang mở | Merge PR sổ (§4) | — |
| PR sổ đã merge, hoặc phiên review báo `SỔ KHÔNG ĐỔI` | Issue xong. Khi `SỔ KHÔNG ĐỔI`, comment lên PR: `Sổ ghi chú: không đổi sau review @<H> (auto-issues).` Sang Issue kế: `git -C C:/workspace/Project-2C fetch origin`, `git -C C:/workspace/Project-2C-auto checkout --detach origin/main` | — |
| Hết hàng đợi | §6 | |

**Chọn và `/clear` phiên con:**

- **Ít dùng gần nhất:** trong hai phiên cùng loại, chọn phiên rảnh có `lastActivityAt` cũ hơn và không giữ việc dở. Việc dở là phiên code của PR đang mở, hoặc phiên review đã PASS mà PR sổ chưa xong. Nhờ vậy transcript của việc vừa xong còn đọc lại được.
- **`/clear` trước mỗi việc mới** bằng `clear_session`. Phiên chưa nhận việc nào (transcript chỉ có brief chờ và dòng `SẴN SÀNG`) thì không cần.
  - Bị từ chối thì thử phiên sinh đôi, nếu phiên đó không giữ việc dở.
  - Vẫn bị từ chối thì hỏi Owner (§5): "anh đóng màn hình / bỏ ghim phiên <tên> rồi chọn Tiếp".
- **Việc tiếp của cùng PR** (CI đỏ, CHANGES, PR sổ) không `/clear`: gửi về đúng phiên đang giữ context.
  - Phiên đó không còn (PR do người khác mở, phiên đã bị `/clear`): dùng phiên ít dùng gần nhất sau `/clear`, và brief thêm câu "đọc Issue, PR và comment REVIEW trước khi làm".

**Chờ:**

- **Cách đặt lệnh chờ:** Bash với `run_in_background: true`: `cd C:/workspace/Project-2C-auto && node tools/auto-wait.mjs <kiểu> …`. Lệnh xong thì app đánh thức phiên này bằng một lượt mới, kèm dòng `AUTO-WAIT …`.
- **Mỗi nhịp phải để lại một lệnh chờ**, trừ khi bước kế làm ngay trong lượt. Không có việc nền thì `/goal` chạy lượt kế ngay lập tức; lặp vài lượt không gọi công cụ thì nó tự dừng.
- **Mỗi lúc chỉ một lệnh chờ.** Trước khi đặt lệnh mới, `TaskStop` lệnh cũ nếu nó còn chạy và mình biết id. Lệnh cũ xong muộn chỉ sinh một nhịp thừa.
- **Mã thoát `AUTO-WAIT`:**
  - 0 / 1: làm nhịp như thường;
  - 2 (hết giờ): xem phiên con. Còn chạy thì đặt lại lệnh chờ. Đã rảnh mà không có dòng `AUTO-CHILD` thì nhắc một lần ("Kết thúc lượt bằng đúng một dòng AUTO-CHILD theo brief"); lần thứ hai thì hỏi Owner;
  - 3: đọc lý do. Rõ cách xử lý thì làm (ví dụ PR đã merge thì đi tiếp theo bảng), không rõ thì hỏi Owner.
- **Phiên con chạy quá lâu:** qua hai lần hết giờ liền mà GitHub không đổi thì xem `list_events`. Thấy phiên đó đang chờ duyệt quyền hay đang treo thì hỏi Owner (Tiếp tục chờ / Dừng).
- **Nhắc của `/goal`** (sau 30 phút chờ): làm một nhịp như thường.

## 3. Brief cho phiên con

Brief gửi bằng `SendMessage`, với `to` là id `local_…` của phiên con lấy từ `list_sessions`. Mỗi brief phải tự đủ nghĩa, vì phiên con không thấy hội thoại của phiên điều phối. Thay mọi `<…>` bằng giá trị thật.

### 3.0 Đoạn chung và brief chờ

Đoạn chung đứng đầu mỗi brief việc mới, và cũng là `background` khi mở phiên:

```text
Bạn là phiên con `<tên>` của pipeline auto-issues (ADR-0001 phụ lục M11, `.claude/skills/auto-issues/SKILL.md` §3). Không có Owner ngồi ở phiên này: phiên điều phối giao việc qua tin nhắn và đọc dòng cuối của bạn.
- Không gọi AskUserQuestion, không chờ ai trả lời. Cần Owner quyết (cổng G1–G7 của CLAUDE.md, spec mâu thuẫn, test chấp nhận không làm được) → dừng việc đó, không đoán; kết thúc lượt bằng `AUTO-CHILD: CẦN OWNER — <câu hỏi>; phương án: <a> / <b>; đề xuất: <x>`.
- Không merge, không /handoff, không bật Auto-fix hay auto-merge, không đổi nhánh của worktree review, không sửa `.claude/skills/auto-issues/**` hay `tools/auto-wait*`.
- Dòng cuối cùng của mỗi lượt là đúng một dòng `AUTO-CHILD: …` theo việc được giao.
```

Brief chờ, là `prompt` khi mở phiên: đoạn chung, rồi `Chưa có việc: trả lời đúng một dòng AUTO-CHILD: SẴN SÀNG rồi dừng.`

### 3.1 Làm một Issue (phiên code, sau `/clear`)

```text
[auto-issues] Issue #<I> — làm task, mở PR.
<đoạn chung>
Làm Issue #<I> theo CLAUDE.md "Quy trình một task", ở checkout chính `C:\workspace\Project-2C`:
1. `git switch main`, `git pull --ff-only`, tạo nhánh `task/T-<số>-<slug>`; gắn nhãn `status:in-progress` cho Issue.
2. `node tools/notes-for.mjs <I>`; đọc "Tài liệu cần đọc"; TDD; `pnpm verify` xanh (chạy pnpm từ PowerShell); commit theo pathspec; push.
3. Mở PR theo mẫu: `Closes #<I>`; mục "Ghi chú OPEN liên quan" theo `node tools/notes-for.mjs --diff`; nhãn risk của Issue; nhãn `build-exe` khi CLAUDE.md đòi (gắn lúc tạo). Thân PR có dòng `Phiên code: <tên> (auto-issues)`.
4. Không chờ CI, không review.
Dòng cuối: `AUTO-CHILD: PR #<N> @<sha7>` hoặc `AUTO-CHILD: CẦN OWNER — …`.
```

### 3.2 Review (phiên review, sau `/clear`)

Dòng đầu là `review PR #<N>`, để hook gợi ý `review-pr`.

```text
review PR #<N>
[auto-issues] <đoạn chung>
Bạn ở worktree `<đường dẫn>`, context sạch. Chạy skill `review-pr` cho PR #<N> tới hết §4 (đăng một comment REVIEW). Khác với skill (xem review-pr §5, đoạn auto-issues):
- Không merge, kể cả risk:low: phiên điều phối merge.
- Đoạn mở đầu của comment thêm câu `Phiên review: <tên> (auto-issues).`
- Chỗ skill bảo dừng, hỏi Owner (nhãn risk thiếu hoặc lệch, PR đã đóng, diff rỗng): không đăng REVIEW, kết thúc bằng `AUTO-CHILD: CẦN OWNER — …`.
Dòng cuối: `AUTO-CHILD: REVIEW PASS @<sha7>`, `AUTO-CHILD: REVIEW CHANGES @<sha7>` hoặc `AUTO-CHILD: CẦN OWNER — …`.
```

### 3.3 CI đỏ (phiên code của PR, không `/clear`)

```text
[auto-issues] PR #<N> @<sha7>: CI đỏ ở <tên check>. Đọc log (`gh run view <id> --log-failed`), tìm nguyên nhân (superpowers:systematic-debugging), sửa, `pnpm verify`, push. Nếu log cho thấy rõ là lỗi chập chờn: commit rỗng `chore: re-run CI (<lý do>)` rồi push. Không dùng `gh run rerun`: head không đổi thì phiên điều phối không chờ được.
Dòng cuối: `AUTO-CHILD: ĐÃ PUSH @<sha7>` hoặc `AUTO-CHILD: CẦN OWNER — …`.
```

### 3.4 REVIEW CHANGES (phiên code của PR, không `/clear`)

```text
[auto-issues] PR #<N>: `REVIEW: CHANGES` @<sha7> (<link comment>). Đọc comment đó. Với mỗi mục [chặn]: kiểm trên code trước (superpowers:receiving-code-review), rồi sửa. Mục [không chặn] không bắt buộc. Mục chặn mà bạn có bằng chứng là sai: không sửa, ghi lý do kèm bằng chứng trong một comment trên PR. `pnpm verify` xanh; push; cập nhật thân PR nếu mục "Ghi chú OPEN liên quan" hay phần kiểm tra đổi.
Dòng cuối: `AUTO-CHILD: ĐÃ PUSH @<sha7>`, `AUTO-CHILD: KHÔNG ĐỒNG Ý — <mục>: <lý do>` (khi có mục chặn không sửa; phần sửa được vẫn push), hoặc `AUTO-CHILD: CẦN OWNER — …`.
```

### 3.5 PR sổ (phiên review đã PASS, không `/clear`)

```text
[auto-issues] PR #<N> đã merge (`<sha7>` trên `main`). Viết PR sổ cho review của PR này, như PR #940:
- Worktree riêng: `git -C C:/workspace/Project-2C fetch origin`, rồi `git -C C:/workspace/Project-2C worktree add ../Project-2C-notes-<N> -b docs/T-<số>-review-notes-<N> origin/main`. Làm trong đó, không làm ở worktree review hay checkout chính.
- Chỉ sửa `docs/state/review-notes.md`, theo đoạn đầu của sổ:
  - ghi chú không chặn mới vào OPEN. Đối chiếu sổ trước khi ghi một mục là MỚI; mỗi mục nêu ít nhất một đường dẫn file trong backtick. Gắn nhãn như các nhóm hiện có: Issue còn mở phụ trách file đó → `[T-… #…]`, không có thì nhãn chờ đang dùng (như `[G7]`);
  - mục thân PR #<N> ghi "đã sửa" chuyển sang RESOLVED.
- PR: tiêu đề `docs: record the notes of the PR <N> review (T-<số>)`; thân `Refs #<I>` và các phần như #940; nhãn `type:task`, `risk:low`. Không merge.
- Không có gì để ghi thì không mở PR.
Dòng cuối: `AUTO-CHILD: PR SỔ #<L>`, `AUTO-CHILD: SỔ KHÔNG ĐỔI` hoặc `AUTO-CHILD: CẦN OWNER — …`.
```

### 3.6 Đề xuất gom sổ (phiên code, sau `/clear`)

```text
[auto-issues] Hàng đợi đã xong. <đoạn chung>
`git -C C:/workspace/Project-2C pull --ff-only`, rồi đọc mục OPEN của `docs/state/review-notes.md` và đề xuất gom thành Issue, như đợt 01/11 (Issue #930…#935, PR #936):
- nhóm theo vùng file và cỡ (mỗi Issue ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff); thứ tự, "Bị chặn bởi", nhãn risk;
- chỉ ra mục nên đề nghị Owner chọn không sửa (ACCEPTED), và mục chạm cổng G1–G7.
Chưa tạo Issue, chưa sửa file. Trả lời bằng một bảng, mỗi Issue một hàng: tiêu đề, các mục sổ theo số dòng, file, cỡ ước lượng, risk.
Dòng cuối: `AUTO-CHILD: ĐỀ XUẤT <n> ISSUE`, `AUTO-CHILD: SỔ TRỐNG` hoặc `AUTO-CHILD: CẦN OWNER — …`.
```

### 3.7 Tạo Issue đã duyệt (cùng phiên với 3.6, không `/clear`)

```text
[auto-issues] Owner duyệt đề xuất<; sửa: …>. Tạo các Issue theo `docs/agents/issue-tracker.md` (mẫu Task, skill `to-tickets`; milestone đang mở; nhãn `type:task`, `risk:*`, `ready-for-agent`; số T- kế tiếp). Rồi mở PR gắn nhãn sổ như PR #936: worktree riêng `Project-2C-notes-tags` từ `origin/main`; chỉ sửa `docs/state/review-notes.md`; tiêu đề `docs: tag the review notes with T-<a> to T-<b>`; nhãn `type:task`, `risk:low`. Không merge.
Dòng cuối: `AUTO-CHILD: PR NHÃN #<L>; Issue #<a>…#<b>` hoặc `AUTO-CHILD: CẦN OWNER — …`.
```

## 4. Merge

Chỉ phiên điều phối merge, luôn bằng `node tools/merge-pr.mjs`, chạy từ checkout chính `C:/workspace/Project-2C`. Trước khi merge, phiên code của PR phải đang rảnh, tức không còn push.

- **PR task:** `node tools/merge-pr.mjs <N>`, thêm `--owner` khi mức là med / high (theo nhãn `risk:*`, hoặc mức đã nâng trong REVIEW). `--owner` dùng quyền pipeline của M11, và để lại comment "Merged on Owner request".
- **PR chỉ sửa `docs/state/review-notes.md`** (PR sổ, PR gắn nhãn sổ): merge ngay bằng `node tools/merge-pr.mjs <L>`, không cần REVIEW (T-215). PR đó sửa thêm file khác thì không merge, hỏi Owner.
- **`merge-pr` từ chối:**
  - `main` có commit code sau bản CI đã test: chạy `gh pr update-branch <N>`. Head đổi, nên bảng ở §2 tự ra bước chờ CI rồi review lại ở phiên sạch.
  - Thiếu nhãn `build-exe`: `gh pr edit <N> --add-label build-exe`, rồi `gh pr close <N>` + `gh pr reopen <N>`; chờ `ci <N>`. Head không đổi nên PASS vẫn còn giá trị.
  - CI không ghi notice `Tested base`: `gh pr close <N>` + `gh pr reopen <N>`, chờ `ci <N>`.
  - Lý do khác: hỏi Owner.
- `merge-pr` tự dọn: về `main`, xóa nhánh, gỡ worktree `Project-2C-notes-<N>`. Dọn báo lỗi thì hỏi Owner.
- **Không bao giờ:** `--no-verify`; merge khi CI chưa xanh; bật auto-merge; merge PR chạm `.claude/skills/auto-issues/**` hay `tools/auto-wait*`.

## 5. Hỏi Owner

**Khi nào hỏi:**
- phiên con báo `CẦN OWNER` hoặc `KHÔNG ĐỒNG Ý`;
- `merge-pr` từ chối vì lý do ngoài §4; lệnh chờ ra mã 3 mà không rõ cách xử lý;
- `/clear` bị từ chối ở cả hai phiên;
- phiên con dừng hai lần không có dòng `AUTO-CHILD`, hoặc chạy quá lâu mà GitHub không đổi;
- xác nhận hàng đợi ở lượt đầu; duyệt đề xuất gom sổ (§6).

**Cách hỏi:**

1. `PushNotification` một dòng nói việc cần quyết, ví dụ "auto-issues: PR #945 cần anh quyết, spec mâu thuẫn ở §2". Anh đang xem thì app tự bỏ qua.
2. `AskUserQuestion`:
   - câu hỏi tự đủ nghĩa: Issue / PR, câu hỏi của phiên con trích nguyên văn, link comment;
   - 2–4 phương án, phương án đề xuất đứng đầu;
   - luôn có phương án "Dừng pipeline".
3. Khi Owner trả lời:
   - đăng comment `Quyết định Owner (<dd/mm/yyyy>): …` lên PR (chưa có PR thì lên Issue), trích nguyên văn câu trả lời, như các comment trên PR #939;
   - gửi câu trả lời về phiên con bằng `SendMessage`;
   - làm tiếp nhịp.
4. Owner chọn dừng thì in `AUTO: DỪNG — Owner dừng ở <bước>`.

## 6. Hết hàng đợi: sổ → Issue

1. `/clear` phiên code ít dùng gần nhất và gửi §3.6. Chờ bằng `sleep --timeout 30`: việc này không để dấu trên GitHub, nên tin báo của phiên con thường đánh thức sớm hơn.
2. Phiên con báo `SỔ TRỐNG` thì sang §7.
3. Phiên con báo `ĐỀ XUẤT …` thì hỏi Owner (§5):
   - nội dung: tóm tắt số Issue, tên ngắn, cỡ, và nói đề xuất đầy đủ nằm ở phiên `<tên>`;
   - phương án: Duyệt / Dừng; Owner sửa qua "Other".
4. Owner duyệt thì gửi §3.7 cho cùng phiên, không `/clear`. Chờ `title "docs: tag the review notes" --timeout 60`. Merge PR gắn nhãn (§4), rồi sang §7.

## 7. Kết thúc và chạy tiếp

- **Xong §6:** in bảng tóm tắt đợt chạy:
  - mỗi Issue: PR, số vòng review, mức, PR sổ;
  - các Issue mới tạo;
  - quyết định Owner trong đợt.

  Rồi in dòng `AUTO: XONG` ở cuối lượt.
- **In `AUTO: DỪNG — <lý do>`** khi: kiểm đầu sai, Owner chọn dừng, không mở được phiên con, hoặc gặp lỗi không tự xử được.
- **Chỉ in hai dòng mốc này khi thật sự kết thúc.** Khi cần nhắc tới chúng, viết khác đi (ví dụ "dòng kết thúc"), để `/goal` không dừng nhầm.
- **Chạy tiếp** sau khi context bị nén, phiên được mở lại, hay Owner gõ lại `/goal`: đọc lại file skill này, rồi làm một nhịp như thường.
  - Thiếu phiên con: lượt do Owner gõ thì mở lại theo §1 bước 3; lượt tự động thì in `AUTO: DỪNG — thiếu phiên con <tên>, gõ lại /goal`.
  - Không dùng phiên con của một phiên điều phối khác, vì không `/clear` được.

## 8. Phiên điều phối không làm

- Không sửa file, không commit, không review. Không chạy `pnpm` ở checkout chính khi phiên code đang làm việc ở đó.
- Không đổi nhánh của checkout chính; `merge-pr` làm phần đó sau khi merge.
- Không mở phiên con nào ngoài 4 phiên trên. Không lưu trữ hay xóa phiên con.
- Không ghi HANDOFF; Owner chạy `/handoff` khi rời máy. Quyết định Owner nằm ở comment trên PR / Issue.
