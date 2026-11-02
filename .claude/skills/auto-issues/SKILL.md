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

**Rào "không tự sửa"** (Owner mở rộng ngày 02/11/2026). Pipeline merge PR mà Owner không xem, nên nó không tự sửa chính nó, cổng merge hay cổng review của nó. Issue hay PR chạm một file dưới đây do Owner làm, review và merge theo cách thường (§1, §4):
- pipeline: `.claude/skills/auto-issues/**`, `tools/auto-wait*`;
- cổng merge, tức công cụ phiên điều phối chạy cùng các module chúng import: `tools/merge-pr*`, `tools/pr-status*`, `tools/pr-core*`, `tools/session-core*`, `tools/session-io*`;
- cổng review, tức những gì phiên review chạy hay đọc làm luật, ở đúng head của PR: `.claude/skills/review-pr/**`, `docs/process/REVIEW-CHECKLIST.md`, `tools/notes-for*`, `tools/notes-core*`, hook `.claude/hooks/review-pr-hint.mjs` và `tools/review-hint-core*`.

| Phiên | Thư mục | Việc |
|---|---|---|
| điều phối (Owner mở) | `C:\workspace\Project-2C` | giao việc, chờ, merge, hỏi Owner |
| `coding-ses1`, `coding-ses2` | `C:\workspace\Project-2C` (checkout chính) | làm Issue, sửa theo CI / review |
| `review-1` | `C:\workspace\Project-2C-review` | `review-pr`, rồi PR sổ của review đó |
| `review-2` | `C:\workspace\Project-2C-review-2` | như `review-1` |

Phiên điều phối chạy `tools/auto-wait.mjs`, `tools/pr-status.mjs` và `tools/merge-pr.mjs` từ worktree riêng `C:\workspace\Project-2C-auto`. Worktree này detached ở `origin/main` và chỉ đọc, như worktree review. Lý do:
- phiên code sửa file ngay trên checkout chính, kể cả `tools/`;
- lúc merge, checkout chính còn ở nhánh của PR. Chạy `merge-pr` từ đó thì cổng merge là bản chưa merge của chính PR.

`merge-pr` vẫn dọn đúng checkout chính, vì nó lấy checkout chính từ `git worktree list`. Ba công cụ chỉ dùng module có sẵn của Node, nên worktree này không cần `pnpm install`.

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
   - Một Issue chỉ tới lượt khi mọi Issue trong ô "Bị chặn bởi" của nó đã đóng. Issue bị chặn bởi một Issue khác trong hàng thì lùi xuống sau Issue kế. Issue bị chặn bởi một Issue còn mở nằm ngoài hàng thì bỏ khỏi hàng và báo Owner: pipeline không làm Issue ngoài hàng, nên Issue đó không bao giờ tới lượt.
   - Bỏ khỏi hàng và báo Owner mọi Issue có "File / thư mục được phép sửa" chạm một file trong rào "không tự sửa" (đầu skill), kể cả khi Issue cho sửa cả thư mục chứa file đó. Owner làm Issue đó theo cách thường.
   - Hỏi Owner một câu (§5): "Chạy hàng đợi #a → #b → …?". Phương án: Chạy / Dừng; Owner sửa hàng đợi qua "Other".
3. **Phiên con.**
   - `list_sessions {"linked": true}`. Có đủ 4 phiên `coding-ses1`, `coding-ses2`, `review-1`, `review-2` chưa lưu trữ thì dùng lại.
   - Thiếu phiên nào thì mở bằng `start_session` (nạp bằng ToolSearch nếu chưa có):
     - tham số chung: `initiation: "user_asked"`, `context: "fresh"`; `title` và `name` là tên phiên; `prompt` là brief chờ (§3.0); `background` là đoạn chung (§3.0). Không đặt `model`, `effort`, `permission_mode`, để phiên con theo phiên điều phối;
     - `coding-ses1`, `coding-ses2`: `use_worktree: false`;
     - `review-1`: `cwd: "C:\\workspace\\Project-2C-review"`; `review-2`: `cwd: "C:\\workspace\\Project-2C-review-2"`; cả hai `use_worktree: false`.
   - App từ chối mở thì in `AUTO: DỪNG — không mở được phiên con <tên>: <lý do>`.
   - Phiên con có dòng `AUTO-CHILD` cuối mang thẻ `[Sổ]` là kết quả của đợt trước: `/clear` phiên đó ngay, để §6 của đợt này không đọc nhầm (bị từ chối thì làm như §2).
4. Làm nhịp đầu (§2) ngay trong lượt này.

## 2. Mỗi nhịp: đọc, làm một bước, chờ

Mỗi lượt của phiên điều phối là một **nhịp**, dù lượt đó do gì khởi động: lượt `/goal`, lệnh chờ xong, tin báo của phiên con (`<side-sessions-event>`), nhắc của `/goal`, hay câu trả lời của Owner.

Một nhịp gồm: đọc trạng thái → làm **đúng một bước** trong bảng → đặt lệnh chờ → kết thúc lượt. Không dựa vào trí nhớ: mỗi nhịp đọc lại từ GitHub và từ phiên con.

Nhịp thừa là chuyện thường: lệnh chờ cũ xong muộn, nhắc của `/goal`, tin báo đến cùng lúc với lệnh chờ. Nhịp thừa không làm sai, vì bảng có ba cách giữ:
- phiên con đang chạy thì chỉ chờ;
- hàng giao việc chỉ khớp khi việc đó chưa được giao: thẻ ở dòng `AUTO-CHILD` cuối của phiên con cho biết việc nào nó đã nhận (§3.0);
- sau dòng kết thúc thì không làm nhịp nữa (§7).

**Đọc trạng thái:**

1. **Issue đang làm** là Issue đầu hàng chưa xong. Một Issue xong khi đủ cả ba:
   - Issue đã đóng;
   - PR của nó đã merge;
   - PR sổ của PR đó đã merge, hoặc PR có comment `Sổ ghi chú: không đổi … (auto-issues)`.
2. **PR của Issue:** `gh issue view <I> --json state,closedByPullRequestsReferences` cho số PR `N`, dù PR còn mở hay đã merge.
3. **Trạng thái PR** (khi có `N`), chạy trong `C:/workspace/Project-2C-auto`:
   - `node tools/pr-status.mjs <N>`: trạng thái, head `H`, REVIEW mới nhất kèm SHA, mức;
   - `node tools/auto-wait.mjs ci <N> --once`: CI đã xong chưa, kể cả job có check đến muộn (exe);
   - PR đã merge: `node tools/auto-wait.mjs title "record the notes of the PR <N> review" --once` cho PR sổ: chưa có (mã 2), hoặc số `L` và trạng thái (đang mở / đã merge).
4. **Phiên con:**
   - `list_sessions {"linked": true}`: phiên đang chạy hay rảnh, `lastActivityAt`;
   - phiên rảnh: `list_events` (limit 6) để đọc dòng `AUTO-CHILD:` cuối, gồm thẻ việc và kết quả.
   - Phiên code của PR là phiên ghi trong dòng `Phiên code: …` của thân PR. Phiên review đã PASS là phiên ghi trong câu `Phiên review: …` của comment PASS.

**Bảng bước** (làm theo hàng đầu tiên khớp; `I` = Issue, `N` = PR, `H` = head):

| Trạng thái | Bước | Lệnh chờ (`auto-wait`) |
|---|---|---|
| Đợt này đã in dòng kết thúc | Không làm nhịp: in lại đúng dòng đó (§7) | — |
| Phiên con rảnh; dòng `AUTO-CHILD` cuối là `CẦN OWNER` hoặc `KHÔNG ĐỒNG Ý`; sau dòng đó chưa có tin nhắn nào của phiên điều phối | Hỏi Owner (§5), gửi câu trả lời về phiên đó | giữ lệnh đang chạy |
| Một phiên con đang chạy | Không giao gì | giữ lệnh đang chạy. Không có thì đặt lệnh của việc đó ("Chờ", bên dưới). Lệnh đó (trừ `sleep`) chạy với `--once` mà ra khác 2 thì nó sẽ xong ngay, thường vì kết quả đã lên GitHub mà phiên con chưa xong lượt: đặt `sleep --timeout 5` thay cho nó |
| Phiên con rảnh; dòng cuối không phải `AUTO-CHILD`; việc gần nhất của nó chưa có kết quả trên GitHub | Nhắc một lần: "Kết thúc lượt bằng đúng một dòng AUTO-CHILD theo brief". Đã nhắc mà vẫn vậy thì hỏi Owner | lệnh của việc đó |
| Phiên con rảnh; dòng `AUTO-CHILD` cuối báo một kết quả (PR, head mới, REVIEW, PR sổ) mà GitHub chưa thấy | Không giao lại. Lần đầu chỉ chờ. Lần sau vẫn chưa thấy thì tìm nguyên nhân (PR thiếu `Closes #<I>`, push chưa lên, tiêu đề PR sổ sai) và nhắc phiên con sửa; vẫn không được thì hỏi Owner | `sleep --timeout 1` |
| Chưa có PR; không phiên code nào giữ `I` | `/clear` phiên code ít dùng gần nhất, gửi §3.1 | `pr <I> --timeout 60` |
| PR mở, CI đang chạy trên `H` | — | `ci <N> --timeout 60` |
| PR mở, CI đỏ trên `H` | Gửi §3.3 cho phiên code của PR | `ci <N> --not <H> --timeout 60` |
| PR mở, CI xanh trên `H`, chưa có REVIEW cho `H` | `/clear` phiên review ít dùng gần nhất, gửi §3.2 | `review <N> --timeout 60` |
| PR mở, `REVIEW: CHANGES` @`H` | Gửi §3.4 cho phiên code của PR | `ci <N> --not <H> --timeout 60` |
| PR mở, `REVIEW: PASS` @`H`, CI xanh | Merge (§4), rồi làm tiếp nhịp ngay | — |
| PR đã merge; chưa có PR sổ; chưa phiên review nào có dòng `AUTO-CHILD` cuối là kết quả của §3.5 cho `N` | Gửi §3.5 cho phiên review đã PASS | `title "record the notes of the PR <N> review" --timeout 30` |
| PR sổ đang mở | Merge PR sổ (§4) | — |
| PR sổ đã merge, hoặc phiên review báo `[PR #<N>] SỔ KHÔNG ĐỔI` | Issue xong. Khi `SỔ KHÔNG ĐỔI`, comment lên PR: `Sổ ghi chú: không đổi sau review @<H> (auto-issues).` Sang Issue kế: `git -C C:/workspace/Project-2C fetch origin`, `git -C C:/workspace/Project-2C-auto checkout --detach origin/main` | — |
| Hết hàng đợi | Làm theo bảng ở §6 | |

Ba hàng giao việc theo PR (CI đỏ, review, CHANGES) không cần điều kiện "chưa giao" riêng. Việc đã giao thì phiên nhận việc hoặc đang chạy, hoặc dòng cuối của nó đã khớp một trong các hàng phía trên.

**Chọn và `/clear` phiên con:**

- **Phiên code giữ `I`** là phiên code đang chạy việc của Issue này, hoặc có dòng `AUTO-CHILD` cuối mang thẻ `[Issue #<I>]` hay `[PR #<N>]` (`N` là PR của `I`). Phiên giữ Issue của nó cho tới khi Issue xong, kể cả lúc đang rảnh; "giữ" không có nghĩa là "đang chạy".
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
- **Lệnh chờ theo việc đang chạy:**
  - phiên con đang trả lời brief chờ (ngay sau khi mở ở §1): `sleep --timeout 1`;
  - phiên code làm Issue `I`, chưa có PR: `pr <I> --timeout 60`;
  - phiên code sửa PR `N` (CI đỏ, CHANGES, câu trả lời của Owner): `ci <N> --not <H> --timeout 60`;
  - phiên review review PR `N`: `review <N> --timeout 60`;
  - phiên review viết PR sổ cho `N`: `title "record the notes of the PR <N> review" --timeout 30`;
  - việc của §6: `sleep --timeout 30`.
- **Mã thoát `AUTO-WAIT`:**
  - 0 / 1: làm nhịp như thường;
  - 2 (hết giờ): làm nhịp như thường, rồi xét luật hai lần hết giờ ở dưới;
  - 3: đọc lý do. Rõ cách xử lý thì làm (ví dụ PR đã merge thì đi tiếp theo bảng), không rõ thì hỏi Owner. Với `--once`, mã 3 còn có nghĩa là lần đọc lỗi: đọc lại một lần trước khi kết luận.
- **Hai lần hết giờ liền cho cùng một việc mà GitHub không đổi:** hỏi Owner (Tiếp tục chờ / Dừng), dù phiên con còn chạy hay đã rảnh. Hai lệnh `sleep --timeout 5` liền của hàng "Một phiên con đang chạy" (lệnh của việc sẽ xong ngay, phiên con vẫn chạy) cũng tính là hai lần hết giờ. Trước khi hỏi, kiểm và nêu trong câu hỏi:
  - PR có `Closes #<I>` không;
  - `mergeable` của PR: có xung đột thì workflow `pull_request` không chạy;
  - check nào treo;
  - phiên con có đang chờ duyệt quyền hay đang treo không (`list_events`).
- **Nhắc của `/goal`** (sau 30 phút chờ): làm một nhịp như thường.

## 3. Brief cho phiên con

Brief gửi bằng `SendMessage`, với `to` là id `local_…` của phiên con lấy từ `list_sessions`. Mỗi brief phải tự đủ nghĩa, vì phiên con không thấy hội thoại của phiên điều phối. Thay mọi `<…>` bằng giá trị thật.

### 3.0 Đoạn chung và brief chờ

Đoạn chung đứng đầu mỗi brief việc mới, và cũng là `background` khi mở phiên:

```text
Bạn là phiên con `<tên>` của pipeline auto-issues (ADR-0001 phụ lục M11, `.claude/skills/auto-issues/SKILL.md` §3). Không có Owner ngồi ở phiên này: phiên điều phối giao việc qua tin nhắn và đọc dòng cuối của bạn.
- Không gọi AskUserQuestion, không chờ ai trả lời. Cần Owner quyết (cổng G1–G7 của CLAUDE.md, spec mâu thuẫn, test chấp nhận không làm được) → dừng việc đó, không đoán; kết thúc lượt bằng `AUTO-CHILD: <thẻ> CẦN OWNER — <câu hỏi>; phương án: <a> / <b>; đề xuất: <x>`.
- Không merge, không /handoff, không bật Auto-fix hay auto-merge, không đổi nhánh của worktree review.
- Không sửa file trong rào "không tự sửa" của pipeline: `.claude/skills/auto-issues/**`, `.claude/skills/review-pr/**`, `.claude/hooks/review-pr-hint.mjs`, `docs/process/REVIEW-CHECKLIST.md`, `tools/{auto-wait,merge-pr,pr-status,pr-core,session-core,session-io,notes-for,notes-core,review-hint-core}*`. Việc cần sửa một file trong đó thì dừng và báo `CẦN OWNER` như trên.
- Dòng cuối cùng của mỗi lượt là đúng một dòng `AUTO-CHILD: <thẻ> <kết quả>` theo việc được giao. `<thẻ>` chép đúng thẻ ở dòng `[auto-issues]` của tin nhắn giao việc: `[Issue #<số>]`, `[PR #<số>]` hoặc `[Sổ]`.
```

Brief chờ, là `prompt` khi mở phiên: đoạn chung, rồi `Chưa có việc: trả lời đúng một dòng AUTO-CHILD: SẴN SÀNG rồi dừng.` Dòng này không có thẻ.

Mỗi brief việc mở đầu bằng thẻ của việc đó. Phiên điều phối đọc thẻ ở dòng `AUTO-CHILD` cuối của phiên con để biết nó đã nhận việc nào (§2). Tin nhắn chuyển câu trả lời của Owner cũng mang thẻ của việc đang dở.

### 3.1 Làm một Issue (phiên code, sau `/clear`)

```text
[auto-issues] [Issue #<I>] Làm task, mở PR.
<đoạn chung>
Làm Issue #<I> theo CLAUDE.md "Quy trình một task", ở checkout chính `C:\workspace\Project-2C`:
1. `git switch main`, `git pull --ff-only`, tạo nhánh `task/T-<số>-<slug>`; gắn nhãn `status:in-progress` cho Issue.
2. `node tools/notes-for.mjs <I>`; đọc "Tài liệu cần đọc"; TDD; `pnpm verify` xanh (chạy pnpm từ PowerShell); commit theo pathspec; push.
3. Mở PR theo mẫu: `Closes #<I>`; mục "Ghi chú OPEN liên quan" theo `node tools/notes-for.mjs --diff`; nhãn risk của Issue; nhãn `build-exe` khi CLAUDE.md đòi (gắn lúc tạo). Thân PR có dòng `Phiên code: <tên> (auto-issues)`.
4. Không chờ CI, không review.
Dòng cuối: `AUTO-CHILD: [Issue #<I>] PR #<N> @<sha7>` hoặc `AUTO-CHILD: [Issue #<I>] CẦN OWNER — …`.
```

### 3.2 Review (phiên review, sau `/clear`)

Dòng đầu là `review PR #<N>`, để hook gợi ý `review-pr`. Với tin có `[auto-issues]`, hook chỉ gợi ý khi tin có một dòng đúng như vậy (`tools/review-hint-core.mjs`), nên các brief khác và tin chuyển quyết định Owner không bị gợi ý review nhầm.

```text
review PR #<N>
[auto-issues] [PR #<N>] Review head <sha7>.
<đoạn chung>
Bạn ở worktree `<đường dẫn>`, context sạch. Chạy skill `review-pr` cho PR #<N> tới hết §4 (đăng một comment REVIEW). Khác với skill (xem review-pr §5, đoạn auto-issues):
- Không merge, kể cả risk:low: phiên điều phối merge.
- Đoạn mở đầu của comment thêm câu `Phiên review: <tên> (auto-issues).`
- Chỗ skill bảo dừng, hỏi Owner (nhãn risk thiếu hoặc lệch, PR đã đóng, diff rỗng): không đăng REVIEW, kết thúc bằng `AUTO-CHILD: [PR #<N>] CẦN OWNER — …`.
- Trước khi kết luận, đọc các comment `Quyết định Owner (…)` trên PR và Issue. Mục Owner đã quyết là không chặn thì không tính là chặn. Đó là quyết định của Owner, không phải comment review cũ, nên quy tắc ở §0 của skill (không đọc comment review cũ trước khi có kết luận) không cấm việc này.
Dòng cuối: `AUTO-CHILD: [PR #<N>] REVIEW PASS @<sha7>`, `AUTO-CHILD: [PR #<N>] REVIEW CHANGES @<sha7>` hoặc `AUTO-CHILD: [PR #<N>] CẦN OWNER — …`.
```

### 3.3 CI đỏ (phiên code của PR, không `/clear`)

```text
[auto-issues] [PR #<N>] CI đỏ @<sha7> ở <tên check>. Đọc log (`gh pr checks <N>` cho link của run đỏ, rồi `gh run view <id> --log-failed`), tìm nguyên nhân (superpowers:systematic-debugging), sửa, `pnpm verify`, push. Nếu log cho thấy rõ là lỗi chập chờn: commit rỗng `chore: re-run CI (<lý do>)` rồi push. Không dùng `gh run rerun`: head không đổi thì phiên điều phối không chờ được.
Dòng cuối: `AUTO-CHILD: [PR #<N>] ĐÃ PUSH @<sha7>` hoặc `AUTO-CHILD: [PR #<N>] CẦN OWNER — …`.
```

### 3.4 REVIEW CHANGES (phiên code của PR, không `/clear`)

```text
[auto-issues] [PR #<N>] `REVIEW: CHANGES` @<sha7> (<link comment>). Đọc comment đó. Với mỗi mục [chặn]: kiểm trên code xem mục đó có đúng không, rồi mới sửa. Mục [không chặn] không bắt buộc. Mục chặn mà bạn có bằng chứng là sai: không sửa, ghi lý do kèm bằng chứng trong một comment trên PR. `pnpm verify` xanh; push; cập nhật thân PR nếu mục "Ghi chú OPEN liên quan" hay phần kiểm tra đổi.
Dòng cuối: `AUTO-CHILD: [PR #<N>] ĐÃ PUSH @<sha7>`, `AUTO-CHILD: [PR #<N>] KHÔNG ĐỒNG Ý — <mục>: <lý do>` (khi có mục chặn không sửa; phần sửa được vẫn push), hoặc `AUTO-CHILD: [PR #<N>] CẦN OWNER — …`.
```

### 3.5 PR sổ (phiên review đã PASS, không `/clear`)

```text
[auto-issues] [PR #<N>] Đã merge (`<sha7>` trên `main`). Viết PR sổ cho review của PR này, như PR #940:
- Đọc mọi comment REVIEW của PR #<N>, mọi vòng, kể cả vòng do phiên review kia viết hay do bạn viết trước một lần `/clear`. Lấy ghi chú không chặn của tất cả, như sổ đã ghi cho nhóm review #917.
- Worktree riêng: `git -C C:/workspace/Project-2C fetch origin`, rồi `git -C C:/workspace/Project-2C worktree add ../Project-2C-notes-<N> -b docs/T-<số>-review-notes-<N> origin/main`. Làm trong đó, không làm ở worktree review hay checkout chính.
- Chỉ sửa `docs/state/review-notes.md`, theo đoạn đầu của sổ:
  - ghi chú không chặn mới vào OPEN. Đối chiếu sổ trước khi ghi một mục là MỚI; mỗi mục nêu ít nhất một đường dẫn file trong backtick. Gắn nhãn như các nhóm hiện có: Issue còn mở phụ trách file đó → `[T-… #…]`, không có thì nhãn chờ đang dùng (như `[G7]`);
  - mục thân PR #<N> ghi "đã sửa" chuyển sang RESOLVED.
- PR: tiêu đề `docs: record the notes of the PR <N> review (T-<số>)`; thân `Refs #<I>` và các phần như #940; nhãn `type:task`, `risk:low`. Không merge.
- Không có gì để ghi thì không mở PR.
Dòng cuối: `AUTO-CHILD: [PR #<N>] PR SỔ #<L>`, `AUTO-CHILD: [PR #<N>] SỔ KHÔNG ĐỔI` hoặc `AUTO-CHILD: [PR #<N>] CẦN OWNER — …`.
```

### 3.6 Đề xuất gom sổ (phiên code, sau `/clear`)

```text
[auto-issues] [Sổ] Hàng đợi đã xong; đề xuất gom sổ.
<đoạn chung>
`git -C C:/workspace/Project-2C pull --ff-only`, rồi đọc mục OPEN của `docs/state/review-notes.md` và đề xuất gom thành Issue, như đợt 01/11 (Issue #930…#935, PR #936):
- nhóm theo vùng file và cỡ (mỗi Issue ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff); thứ tự, "Bị chặn bởi", nhãn risk;
- chỉ ra mục nên đề nghị Owner chọn không sửa (ACCEPTED), và mục chạm cổng G1–G7.
Chưa tạo Issue, chưa sửa file. Trả lời bằng một bảng, mỗi Issue một hàng: tiêu đề, các mục sổ theo số dòng, file, cỡ ước lượng, risk.
Dòng cuối: `AUTO-CHILD: [Sổ] ĐỀ XUẤT <n> ISSUE`, `AUTO-CHILD: [Sổ] SỔ TRỐNG` hoặc `AUTO-CHILD: [Sổ] CẦN OWNER — …`.
```

### 3.7 Tạo Issue đã duyệt (cùng phiên với 3.6, không `/clear`)

```text
[auto-issues] [Sổ] Owner duyệt đề xuất<; sửa: …>. Tạo các Issue theo `docs/agents/issue-tracker.md` (mẫu Task, skill `to-tickets`; milestone đang mở; nhãn `type:task`, `risk:*`, `ready-for-agent`; số T- kế tiếp). Rồi mở PR gắn nhãn sổ như PR #936: worktree riêng `Project-2C-notes-tags` từ `origin/main`; chỉ sửa `docs/state/review-notes.md`; tiêu đề theo kiểu PR #936 (`docs: tag the … review notes with T-<a> to T-<b>`); nhãn `type:task`, `risk:low`. Không merge.
Dòng cuối: `AUTO-CHILD: [Sổ] PR NHÃN #<L>; Issue #<a>…#<b>` hoặc `AUTO-CHILD: [Sổ] CẦN OWNER — …`.
```

## 4. Merge

Chỉ phiên điều phối merge, luôn bằng `node tools/merge-pr.mjs`. Lệnh chạy từ `C:/workspace/Project-2C-auto`, sau khi đưa worktree đó về `origin/main` mới nhất: `git -C C:/workspace/Project-2C fetch origin`, rồi `git -C C:/workspace/Project-2C-auto checkout --detach origin/main`. Như vậy cổng merge là bản đã duyệt trên `main`. Trước khi merge, phiên code của PR phải đang rảnh, tức không còn push.

- **PR chạm file trong rào "không tự sửa"** (đầu skill; xem bằng `gh pr diff <N> --name-only`): không merge, hỏi Owner (§5). Owner review và merge theo cách thường.
- **PR task:** `node tools/merge-pr.mjs <N>`, thêm `--owner` khi mức là med / high (theo nhãn `risk:*`, hoặc mức đã nâng trong REVIEW). `--owner` dùng quyền pipeline của M11, và để lại comment "Merged on Owner request".
- **PR chỉ sửa `docs/state/review-notes.md`** (PR sổ, PR gắn nhãn sổ): merge ngay bằng `node tools/merge-pr.mjs <L>`, không cần REVIEW (T-215). PR đó sửa thêm file khác thì không merge, hỏi Owner.
- **`merge-pr` từ chối:**
  - `main` có commit code sau bản CI đã test: chạy `gh pr update-branch <N>`. Head đổi, nên bảng ở §2 tự ra bước chờ CI rồi review lại ở phiên sạch.
  - Thiếu nhãn `build-exe`: `gh pr edit <N> --add-label build-exe`, rồi `gh pr close <N>` + `gh pr reopen <N>`, rồi chờ CI như dòng cuối của danh sách này. Head không đổi nên PASS vẫn còn giá trị.
  - CI không ghi notice `Tested base`: `gh pr close <N>` + `gh pr reopen <N>`, rồi chờ CI như dưới.
  - Chờ CI sau `reopen` bằng một lệnh nền: `node tools/auto-wait.mjs sleep --timeout 1 && node tools/auto-wait.mjs ci <N> --timeout 60`. GitHub cần một lúc để tạo workflow run mới; `ci` đọc ngay thì thấy run cũ đã xong và báo xong sai.
  - Lý do khác: hỏi Owner.
- `merge-pr` tự dọn: về `main`, xóa nhánh, gỡ worktree `Project-2C-notes-<N>`. Dọn báo lỗi thì hỏi Owner.
- **Không bao giờ:** `--no-verify`; merge khi CI chưa xanh; bật auto-merge; merge PR chạm file trong rào "không tự sửa".

## 5. Hỏi Owner

**Khi nào hỏi:**
- phiên con báo `CẦN OWNER` hoặc `KHÔNG ĐỒNG Ý`;
- PR tới bước merge mà chạm file trong rào "không tự sửa" (§4);
- `merge-pr` từ chối vì lý do ngoài §4; lệnh chờ ra mã 3 mà không rõ cách xử lý;
- `/clear` bị từ chối ở cả hai phiên;
- phiên con dừng hai lần không có dòng `AUTO-CHILD`; kết quả phiên con báo mà GitHub vẫn không thấy sau khi đã nhắc;
- hai lần hết giờ liền cho cùng một việc mà GitHub không đổi (§2, "Chờ");
- xác nhận hàng đợi ở lượt đầu; duyệt đề xuất gom sổ (§6).

**Cách hỏi:**

1. `PushNotification` một dòng nói việc cần quyết, ví dụ "auto-issues: PR #945 cần anh quyết, spec mâu thuẫn ở §2". Anh đang xem thì app tự bỏ qua.
2. `AskUserQuestion`:
   - câu hỏi tự đủ nghĩa: Issue / PR, câu hỏi của phiên con trích nguyên văn, link comment;
   - 2–4 phương án, phương án đề xuất đứng đầu;
   - luôn có phương án "Dừng pipeline".
3. Khi Owner trả lời:
   - đăng comment `Quyết định Owner (<dd/mm/yyyy>): …` lên PR (chưa có PR thì lên Issue), trích nguyên văn câu trả lời, như các comment trên PR #939;
   - gửi câu trả lời về phiên con bằng `SendMessage`, mở đầu bằng `[auto-issues] <thẻ của việc đang dở> Quyết định Owner: …`;
   - nếu Owner bác một mục chặn của `REVIEW: CHANGES`, và từ lần review đó tới giờ head chưa đổi: tin gửi phiên code thêm yêu cầu commit rỗng `chore: re-review after Owner decision (<link comment quyết định>)`, push, rồi trả lời `AUTO-CHILD: [PR #<N>] ĐÃ PUSH @<sha7>`. Có head mới thì bảng ở §2 tự ra bước chờ CI rồi review lại ở phiên sạch. Không có head mới thì nhịp sau lại gửi §3.4, và lệnh `review` không chờ được một REVIEW mới trên cùng head;
   - làm tiếp nhịp.
4. Owner chọn dừng: `TaskStop` lệnh chờ đang chạy, rồi in `AUTO: DỪNG — Owner dừng ở <bước>` (§7).

## 6. Hết hàng đợi: sổ → Issue

Bảng này nối tiếp hàng "Hết hàng đợi" của §2. Các hàng đầu của §2 vẫn áp dụng trước: đã in dòng kết thúc, `CẦN OWNER`, phiên con đang chạy, nhắc khi thiếu dòng `AUTO-CHILD`.

| Trạng thái | Bước | Lệnh chờ |
|---|---|---|
| Không phiên code nào có dòng `AUTO-CHILD` cuối mang thẻ `[Sổ]` | `/clear` phiên code ít dùng gần nhất, gửi §3.6 | `sleep --timeout 30` |
| `[Sổ] SỔ TRỐNG` | §7, dòng kết thúc XONG | — |
| `[Sổ] ĐỀ XUẤT <n> ISSUE`, sau dòng đó chưa có tin nhắn nào của phiên điều phối | Hỏi Owner (§5) như dưới; duyệt thì gửi §3.7 cho cùng phiên, không `/clear` | `sleep --timeout 30` |
| `[Sổ] PR NHÃN #<L>`, PR `<L>` đang mở | Kiểm rồi merge (§4), như dưới | — |
| `[Sổ] PR NHÃN #<L>`, PR `<L>` đã merge | §7, dòng kết thúc XONG | — |

- **Câu hỏi duyệt đề xuất:**
  - nội dung: tóm tắt số Issue, tên ngắn, cỡ; nói rõ đề xuất đầy đủ nằm ở phiên `<tên>`;
  - phương án: Duyệt / Dừng; Owner sửa qua "Other".
- **Lấy số PR gắn nhãn:** `<L>` lấy từ dòng `AUTO-CHILD`, không chờ theo tiêu đề. PR gắn nhãn của các đợt trước có cùng kiểu tiêu đề và đã merge, nên `title` sẽ ra ngay bằng PR cũ.
- **Kiểm trước khi merge:** `node tools/pr-status.mjs <L>` phải cho thấy PR đang mở và chỉ sửa `docs/state/review-notes.md`.
- Việc của §6 không để dấu trên GitHub trước khi có PR gắn nhãn. Vì vậy lệnh chờ là `sleep`, và tin báo của phiên con thường đánh thức sớm hơn.

## 7. Kết thúc và chạy tiếp

- **Xong §6:** in bảng tóm tắt đợt chạy:
  - mỗi Issue: PR, số vòng review, mức, PR sổ;
  - các Issue mới tạo;
  - quyết định Owner trong đợt.

  Rồi in dòng `AUTO: XONG` ở cuối lượt.
- **In `AUTO: DỪNG — <lý do>`** khi: kiểm đầu sai, Owner chọn dừng, không mở được phiên con, hoặc gặp lỗi không tự xử được.
- **Trước khi in một trong hai dòng kết thúc**, ở bất kỳ chỗ nào: `TaskStop` lệnh chờ đang chạy. Lượt kết thúc mà còn việc nền thì `/goal` không đánh giá lượt đó, và khi việc nền xong, app mở một lượt mới.
- **Sau dòng kết thúc:** lượt nào tới sau đó trong cùng đợt (lệnh nền xong muộn, nhắc của `/goal`, tin của phiên con) không làm nhịp, chỉ in lại đúng dòng kết thúc đó. `/goal` mới do Owner gõ, kể cả ngay sau dòng kết thúc, là một đợt mới: làm lại từ §1.
- **Chỉ in hai dòng mốc này khi thật sự kết thúc.** Khi cần nhắc tới chúng, viết khác đi (ví dụ "dòng kết thúc"), để `/goal` không dừng nhầm.
- **Chạy tiếp** sau khi context bị nén, phiên được mở lại, hay Owner gõ lại `/goal`: đọc lại file skill này, rồi làm một nhịp như thường.
  - Thiếu phiên con: lượt do Owner gõ thì mở lại theo §1 bước 3; lượt tự động thì in `AUTO: DỪNG — thiếu phiên con <tên>, gõ lại /goal`.
  - Không dùng phiên con của một phiên điều phối khác, vì không `/clear` được.

## 8. Phiên điều phối không làm

- Không sửa file, không commit, không review. Không chạy `pnpm` ở checkout chính khi phiên code đang làm việc ở đó.
- Không đổi nhánh của checkout chính; `merge-pr` làm phần đó sau khi merge.
- Không mở phiên con nào ngoài 4 phiên trên. Không lưu trữ hay xóa phiên con.
- Không ghi HANDOFF; Owner chạy `/handoff` khi rời máy. Quyết định Owner nằm ở comment trên PR / Issue.
