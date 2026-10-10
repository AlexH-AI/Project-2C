# Bổ sung kế hoạch: DeepSeek v4.1 (OpenCode) + Muse Spark (Muse Code) review Phase 5

- **Soạn:** 10/10/2026, theo yêu cầu Owner (chat 10/10): thêm hai reviewer độc lập, cùng tiêu chí deep review với Claude và Codex (`plan.md` §1, §3, §4, §5), khác model, chạy qua OpenCode trong Terminal, để so sánh.
- **SHA ghim: `0df3606`**, như `plan.md`. Hai bên mới chạy sau khi Claude và Codex đã nộp đủ A–F, nên không ảnh hưởng tới hai báo cáo đó.
- **Quyết định Owner, ghi lại khi tổng hợp:** `CLAUDE.md` ghi "không dùng OpenCode/Muse/Cursor để review". Đợt này Owner cho phép làm ngoại lệ, chỉ để so sánh: hai bên mới chỉ đọc, không viết code, báo cáo là dữ liệu tham khảo (giống Codex, ADR-0001 phụ lục M2). Phiên tổng hợp ghi quyết định này vào `docs/PROJECT-STATE.md` (hoặc phụ lục ADR-0001) trong PR docs.

## 1. Vai trò

| Bên | Công cụ / model | Worktree | Thư mục kết quả | ID |
|---|---|---|---|---|
| DeepSeek | OpenCode v2.0.24, `opencode-go/deepseek-v4.1-flash` | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-5\deepseek\` | `DS-<gói><số>` |
| Muse | **Muse Code 1.3.0** (CLI riêng của Meta, provider `meta`, không qua OpenCode), `muse-spark-1.3-contributor`, effort `max` | `C:\workspace\Project-2C-review-2` | `C:\workspace\deep-review-5\muse\` | `MS-<gói><số>` |

- Bốn bên độc lập với nhau: DeepSeek không đọc `claude\`, `codex\`, `muse\`; Muse không đọc `claude\`, `codex\`, `deepseek\`. Mọi quy tắc khác giữ nguyên `plan.md` §2 (chỉ đọc, không gọi AI của sản phẩm, không tự tổng hợp).
- Mỗi gói một phiên mới, tuần tự A → F như Claude. Gói F đọc báo cáo A–E của chính mình.
- DeepSeek chạy trên gói OpenCode Go, dùng chung hạn mức với sản phẩm; gói hết hạn 11/10. Muốn model khác (vd. `opencode-go/deepseek-v4-pro`) thì sửa dòng `"model"` trong `opencode.json`.
- Muse Code báo "Your content … may be used for product improvement" (bản `-contributor`). Repo đã public, dữ liệu là giả lập, nên chấp nhận được.
- **Sự cố 10/10, phiên Muse thử đầu tiên:** Muse Code không đọc `opencode.json` và đang chạy chế độ YOLO (`~/.config/muse/settings.json`: `"default_profile": ":unrestricted"` → không hỏi duyệt, không sandbox). Lệnh thử liệt kê `codex\` **chạy được**: model thấy tên 6 thư mục, 6 file `.md`, kích thước và giờ sửa, **không đọc nội dung**. Phiên đó bỏ, không dùng cho review; phiên tổng hợp ghi chú điều này. Từ đó chặn `claude\` và `codex\` bằng ACL (§2 bước 3).

## 2. Chuẩn bị (Owner, một lần)

1. Đóng phiên Claude Code đang mở ở `Project-2C-review` (mỗi worktree review một phiên tại một thời điểm).
2. Kiểm hai worktree đúng SHA:

   ```powershell
   git -C C:\workspace\Project-2C-review rev-parse HEAD
   git -C C:\workspace\Project-2C-review-2 rev-parse HEAD
   ```

   Cả hai phải ra `0df3606fb783cc89b1b9c413c02810340e273a4f`. `Project-2C-review-2` có sẵn 3 mục untracked của Codex (`.agents/`, `.codex/`, `AGENTS.md`); giữ nguyên.
3. **Chặn cứng `claude\` và `codex\` bằng ACL** cho cả hai bên mới (mọi tiến trình chạy dưới tài khoản Windows của anh, kể cả Muse YOLO và OpenCode, đều bị từ chối đọc / liệt kê). Owner tự chạy trong PowerShell:

   ```powershell
   icacls C:\workspace\deep-review-5\claude /deny "${env:USERNAME}:(OI)(CI)(R)"
   ```

   ```powershell
   icacls C:\workspace\deep-review-5\codex /deny "${env:USERNAME}:(OI)(CI)(R)"
   ```

   Kiểm: `Get-ChildItem C:\workspace\deep-review-5\codex` phải báo `Access is denied`. Gỡ khi cả hai bên mới nộp xong F (chủ thư mục luôn đổi được ACL, nên gỡ không bị kẹt):

   ```powershell
   icacls C:\workspace\deep-review-5\claude /remove:d "${env:USERNAME}"
   ```

   ```powershell
   icacls C:\workspace\deep-review-5\codex /remove:d "${env:USERNAME}"
   ```

   Trong lúc chặn, mọi phiên Claude / Codex khác cũng không đọc được hai thư mục này.
4. **DeepSeek ↔ Muse** (cùng tài khoản, cùng lúc ghi, nên không chặn ACL được):
   - DeepSeek: `C:\workspace\Project-2C-review\opencode.json` (bản `common\opencode-deepseek.json`) chặn `muse\`, `claude\`, `codex\`, subagent, web, `git commit/push/stash/…`, `pnpm eval:ai`, `node tools/eval-ai.mjs`, lệnh `opencode`, `cmdkey`; **cấm** công cụ sửa file ở mọi chỗ ngoài `deepseek\` (gồm repo) và cấm `git checkout/restore/reset` (siết 10/10); hỏi Owner trước `gh`, `curl`. Đây là chặn theo mẫu chuỗi, model vẫn lách được.
   - Muse: Muse Code không đọc `opencode.json` (file trong `review-2` vô hại, để nguyên hoặc xóa đều được). Chỉ có prompt + kiểm sau phiên (§4). Muốn chặt hơn thì chạy Muse **trước** hoặc **sau** DeepSeek, và chặn ACL thư mục của bên đang không chạy.
5. Kiểm nhanh, ở phiên đầu của **mỗi** bên: gõ `liệt kê thư mục C:\workspace\deep-review-5\codex` → phải bị từ chối / báo Access denied. DeepSeek thử thêm `liệt kê thư mục C:\workspace\deep-review-5\muse` → phải bị từ chối. Xong thì bỏ phiên thử, mở phiên mới cho gói A.

## 3. Chạy

Mở hai tab Terminal (PowerShell):

```powershell
opencode C:\workspace\Project-2C-review
```

```powershell
cd C:\workspace\Project-2C-review-2; muse
```

DeepSeek: model lấy từ `opencode.json`; nếu TUI có biến thể suy luận (variant) thì chọn mức cao nhất; mỗi gói `/new`. Muse: model và effort `max` lấy từ `~/.config/muse/settings.json`; mỗi gói thoát và chạy lại `muse` (phiên mới). Dán prompt ở Phụ lục C (DeepSeek) hoặc D (Muse), thay `<GÓI>` bằng một chữ A…F. Xong gói thì model dừng và báo tên file.

Muse đang YOLO: không hỏi duyệt lệnh nào, kể cả sửa file trong repo hay `git commit`. Chỉ có prompt và kiểm `git status` sau gói (§4) giữ chỉ-đọc. Muốn được hỏi duyệt thì chạy `muse --permission-profile :ask-me` (hỏi từng lệnh, rất nhiều lần cho deep review).

## 4. Kiểm sau review (Claude làm ở phiên tổng hợp, Owner không cần làm theo từng gói)

Đổi 10/10 sau trao đổi với Owner: không kiểm theo từng gói. Phiên tổng hợp chạy các bước dưới cho mọi phiên A–F của hai bên (xuất phiên bằng CLI local, không gọi model). Ngoại lệ duy nhất Owner nên tự xem giữa chừng: `git -C <worktree> status --short` khi thấy model báo đã sửa file trong repo.

1. Xuất phiên làm bằng chứng (và để chép vào raw khi tổng hợp):

   ```powershell
   opencode session list
   ```

   ```powershell
   opencode session export <id> > C:\workspace\deep-review-5\deepseek\<GÓI>\session.json
   ```

   Muse:

   ```powershell
   muse export --last --out C:\workspace\deep-review-5\muse\<GÓI>\session.json
   ```

2. Kiểm độc lập: tìm trong file xuất xem model có chạm thư mục bên khác không.

   ```powershell
   Select-String -Path C:\workspace\deep-review-5\deepseek\<GÓI>\session.json -Pattern 'deep-review-5[\\/]+(claude|codex|muse)' | Select-Object -First 5
   ```

   ```powershell
   Select-String -Path C:\workspace\deep-review-5\muse\<GÓI>\session.json -Pattern 'deep-review-5[\\/]+(claude|codex|deepseek)' | Select-Object -First 5
   ```

   Có kết quả → báo cáo gói đó đánh dấu "nhiễm", phiên tổng hợp xét riêng.
3. `git -C <worktree> status --short` chỉ được còn `opencode.json` (và 3 mục Codex ở `review-2`). Có file khác → báo Claude, không tự xóa.
4. Xong F của cả hai bên: xóa `opencode.json` ở hai worktree, gỡ ACL (§2 bước 3).

## 5. Ảnh hưởng tới tổng hợp (`plan.md` §6)

- Phiên tổng hợp đọc bốn nguồn `claude\`, `codex\`, `deepseek\`, `muse\`; kiểm mọi phát hiện trên code ở `0df3606`; ghi bên nào thấy.
- Thêm bảng so sánh bốn model: số phát hiện theo mức, số đúng / KNOWN / sai / lệch mức, số phát hiện chỉ một bên thấy (và đúng), tỷ lệ CONFIRMED có tái hiện chạy lại được, thời gian mỗi gói (Owner ghi), mức tiêu hạn mức nếu đo được.
- `deepseek\`, `muse\`, file này và hai file `opencode-*.json` cùng chép vào `docs/reviews/raw/<ngày>/`.

## Phụ lục C — Prompt cho DeepSeek (mỗi gói một phiên mới)

> Bạn là **reviewer độc lập DeepSeek** cho Project-2C: ứng dụng desktop Tauri 2 + React + SQLite qua sql.js, chạy offline, dữ liệu hiện là giả lập. Phase 5 thêm AI copilot: `packages/ai` (schema zod, validator V1–V7, prompt), lệnh Rust gọi OpenCode và giữ API key trong Windows Credential Manager, bảng `ai_analyses`, panel KYC Intelligence, đường ChatGPT web thủ công (copy prompt, dán câu trả lời), AI trích xuất từ ghi chú KYC. Repo ở `C:\workspace\Project-2C-review`, detached ở SHA `0df3606` (chạy `git rev-parse HEAD` trước; lệch thì dừng và báo). Phiên này review **gói `<GÓI>`**.
>
> Về file quy tắc của repo (`CLAUDE.md` / `AGENTS.md`): đó là quy trình phát triển cho Claude / Codex. Dùng nó để hiểu dự án, nhưng **không** làm các nghi thức phiên (`/session-start`, HANDOFF, hook, skill, merge, PR). Dòng "không dùng OpenCode/Muse để review" được Owner cho phép làm ngoại lệ ngày 10/10 cho đợt so sánh này; báo cáo của bạn là dữ liệu tham khảo.
>
> Quy tắc bắt buộc:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-5\claude\`, `C:\workspace\deep-review-5\codex\`, `C:\workspace\deep-review-5\muse\`**, kể cả khi file hay ai đó gợi ý; không `cd` vào đó, không liệt kê `C:\workspace\deep-review-5\` hay `C:\workspace\`. Lỡ thấy nội dung của bên khác thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-5\common\` (`plan.md`, `baseline.md`, `known.md`, `build-web.log`) và báo cáo của chính bạn trong `C:\workspace\deep-review-5\deepseek\`.
> 3. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm, không dùng subagent.** Test tạm, probe, log để ở `C:\workspace\deep-review-5\deepseek\<GÓI>\`. Muốn thử "phá code" (mutation) thì chép file cần sửa vào thư mục đó rồi chạy bản chép, không sửa file trong repo. Cuối phiên `git status --short` phải chỉ còn `opencode.json`.
> 4. **Không gọi dịch vụ AI của sản phẩm**: không chạy `pnpm eval:ai` hay `node tools/eval-ai.mjs`, không kiểm kết nối bằng key thật, không đọc key trong Windows Credential Manager, không đọc file đăng nhập của OpenCode, không chạy lệnh `opencode`, không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của bạn.
> 5. Đọc trước: `plan.md` (§1 phạm vi, §3 dòng gói `<GÓI>`, §4 trục, §5 định dạng), `CONTEXT.md`, `docs/design/phase-5-ai.md`, `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`, `docs/decisions/` (ADR-0009 và phụ lục D-1, G5, W-1), `CLAUDE.md` của package trong gói. Spec và golden là nguồn đúng; không đề xuất sửa golden / spec cho khớp code. Mục có trong `common\known.md` gắn `KNOWN`, chỉ nêu khi có bằng chứng mới.
> 6. Tìm thật kỹ và sâu, đọc từng file trong phạm vi gói, kể cả chỗ code Phase 1–4 mà gói nối vào. Ưu tiên: (1) lỗi đúng-sai và edge case, (2) guardrail AI lọt qua / chặn nhầm so với G5, (3) mất / sai dữ liệu (`ai_analyses`, nhập backup, migration), (4) an toàn: API key, gọi mạng, dữ liệu gửi đi, prompt injection từ ghi chú KYC và câu trả lời dán, hiển thị output model, CSP / capabilities Tauri, mở URL ngoài, (5) hiệu năng **có số đo**, (6) code thừa / lặp, (7) test yếu, (8) trợ năng / i18n. Đi qua **mọi trục** §4; trục không có gì ghi "đã xét, không thấy" kèm cách đã xét. Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng; không nâng mức cho nổi.
> 7. **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA trên (đọc lại trước khi ghi). `CONFIRMED` chỉ khi bạn đã chạy lệnh hoặc test tạm và dán lệnh + trích kết quả thật; chưa chạy thì ghi `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.
> 8. Môi trường Windows. `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"`. Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của bạn).
> 9. Ghi báo cáo dần vào `C:\workspace\deep-review-5\deepseek\<GÓI>.md` trong lúc làm (tạo file sớm, thêm từng phát hiện), để không mất khi context bị nén. Nội dung cuối: phạm vi đã đọc (file, dòng), phát hiện theo §5 với ID `DS-<GÓI><số>`, bảng đếm mức × trục, "đã xét, không thấy", phụ lục nguồn test tạm, dòng `git status --short` đầu và cuối phiên. Viết bằng tiếng Việt.
> 10. **Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.** Xong gói thì dừng và báo Owner tên file. Gói F được đọc `deepseek\A…E.md`; cuối `F.md` thêm kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7 Phase 5 kèm lý do.

## Phụ lục D — Prompt cho Muse (mỗi gói một phiên mới)

Như Phụ lục C, thay đúng các chỗ sau (bản đầy đủ để dán):

> Bạn là **reviewer độc lập Muse** cho Project-2C: ứng dụng desktop Tauri 2 + React + SQLite qua sql.js, chạy offline, dữ liệu hiện là giả lập. Phase 5 thêm AI copilot: `packages/ai` (schema zod, validator V1–V7, prompt), lệnh Rust gọi OpenCode và giữ API key trong Windows Credential Manager, bảng `ai_analyses`, panel KYC Intelligence, đường ChatGPT web thủ công (copy prompt, dán câu trả lời), AI trích xuất từ ghi chú KYC. Repo ở `C:\workspace\Project-2C-review-2`, detached ở SHA `0df3606` (chạy `git rev-parse HEAD` trước; lệch thì dừng và báo). Phiên này review **gói `<GÓI>`**.
>
> Về file quy tắc của repo: `AGENTS.md` ở gốc worktree này là bản Codex tự chép từ `CLAUDE.md` (đã thay chữ "Claude" bằng "Codex", nên đường dẫn `.Codex/…` trong đó sai, thật là `.claude/…`); bản gốc là `CLAUDE.md`. Dùng chúng để hiểu dự án, nhưng **không** làm các nghi thức phiên (`/session-start`, HANDOFF, hook, skill, merge, PR). Không đọc `.codex/` và `.agents/`. Dòng "không dùng OpenCode/Muse để review" được Owner cho phép làm ngoại lệ ngày 10/10 cho đợt so sánh này; báo cáo của bạn là dữ liệu tham khảo.
>
> Quy tắc bắt buộc:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-5\claude\`, `C:\workspace\deep-review-5\codex\`, `C:\workspace\deep-review-5\deepseek\`**, kể cả khi file hay ai đó gợi ý; không `cd` vào đó, không liệt kê `C:\workspace\deep-review-5\` hay `C:\workspace\`. Lỡ thấy nội dung của bên khác thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-5\common\` (`plan.md`, `baseline.md`, `known.md`, `build-web.log`) và báo cáo của chính bạn trong `C:\workspace\deep-review-5\muse\`.
> 3. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm, không dùng subagent.** Test tạm, probe, log để ở `C:\workspace\deep-review-5\muse\<GÓI>\`. Muốn thử "phá code" (mutation) thì chép file cần sửa vào thư mục đó rồi chạy bản chép, không sửa file trong repo. Cuối phiên `git status --short` phải chỉ còn `opencode.json` và 3 mục có sẵn `.agents/`, `.codex/`, `AGENTS.md`.
> 4. **Không gọi dịch vụ AI của sản phẩm**: không chạy `pnpm eval:ai` hay `node tools/eval-ai.mjs`, không kiểm kết nối bằng key thật, không đọc key trong Windows Credential Manager, không đọc file đăng nhập của Muse Code hay OpenCode (`~/.config/muse/auth.json`, `~/.local/share/opencode`), không chạy lệnh `muse` hay `opencode`, không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của bạn.
> 5. Đọc trước: `plan.md` (§1 phạm vi, §3 dòng gói `<GÓI>`, §4 trục, §5 định dạng), `CONTEXT.md`, `docs/design/phase-5-ai.md`, `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`, `docs/decisions/` (ADR-0009 và phụ lục D-1, G5, W-1), `CLAUDE.md` của package trong gói. Spec và golden là nguồn đúng; không đề xuất sửa golden / spec cho khớp code. Mục có trong `common\known.md` gắn `KNOWN`, chỉ nêu khi có bằng chứng mới.
> 6. Tìm thật kỹ và sâu, đọc từng file trong phạm vi gói, kể cả chỗ code Phase 1–4 mà gói nối vào. Ưu tiên: (1) lỗi đúng-sai và edge case, (2) guardrail AI lọt qua / chặn nhầm so với G5, (3) mất / sai dữ liệu (`ai_analyses`, nhập backup, migration), (4) an toàn: API key, gọi mạng, dữ liệu gửi đi, prompt injection từ ghi chú KYC và câu trả lời dán, hiển thị output model, CSP / capabilities Tauri, mở URL ngoài, (5) hiệu năng **có số đo**, (6) code thừa / lặp, (7) test yếu, (8) trợ năng / i18n. Đi qua **mọi trục** §4; trục không có gì ghi "đã xét, không thấy" kèm cách đã xét. Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng; không nâng mức cho nổi.
> 7. **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA trên (đọc lại trước khi ghi). `CONFIRMED` chỉ khi bạn đã chạy lệnh hoặc test tạm và dán lệnh + trích kết quả thật; chưa chạy thì ghi `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.
> 8. Môi trường Windows. `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"`. Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của bạn).
> 9. Ghi báo cáo dần vào `C:\workspace\deep-review-5\muse\<GÓI>.md` trong lúc làm (tạo file sớm, thêm từng phát hiện), để không mất khi context bị nén. Nội dung cuối: phạm vi đã đọc (file, dòng), phát hiện theo §5 với ID `MS-<GÓI><số>`, bảng đếm mức × trục, "đã xét, không thấy", phụ lục nguồn test tạm, dòng `git status --short` đầu và cuối phiên. Viết bằng tiếng Việt.
> 10. **Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.** Xong gói thì dừng và báo Owner tên file. Gói F được đọc `muse\A…E.md`; cuối `F.md` thêm kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7 Phase 5 kèm lý do.
