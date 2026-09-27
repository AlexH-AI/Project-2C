# ADR-0017: Review PR theo mức risk — skill `review-pr`

- **Trạng thái:** Accepted (G1, Owner duyệt 27/09/2026)
- **Ngày:** 2026-09-27
- **Nguồn:** ADR-0001 (quy trình task, review phiên sạch), ADR-0012 (skill được phép), `docs/process/REVIEW-CHECKLIST.md`
- **Commit / PR:** nhánh `docs/review-by-risk`

## Bối cảnh

- Trước ADR này, review dựa vào việc Claude tự đọc CLAUDE.md rồi đi theo `REVIEW-CHECKLIST.md`. Không có lệnh/skill nào bắt buộc, và không có bước săn lỗi correctness riêng. Ví dụ ở PR #87, lỗi mất dữ liệu do review ngoài (Codex) và review phiên sạch tìm ra.
- Skill `code-review` của mattpocock/skills (commit `c55ee46`) không được vendor ở ADR-0012. Lõi của nó là 2 subagent song song (Spec / Standards), trái ADR-0001. Mục đích chính của subagent là context sạch, nhưng 2C đã có context sạch vì review chạy ở phiên mới.
- Claude Code có skill `code-review` sẵn (săn lỗi correctness theo mức effort, có `--comment`/`--fix`/`ultra`). Nó trùng tên với skill của mattpocock.
- `.claude/skills/tdd/SKILL.md` (vendored) nhắc tới skill `code-review` mà repo không có.
- Owner ưu tiên chi phí thấp đến trung bình cho `risk:low`/`risk:med`; `risk:high` không cần tối ưu chi phí.

## Quyết định

1. **Skill dự án `review-pr`** (`.claude/skills/review-pr/SKILL.md`, 2C tự viết, không vendor) là quy trình review duy nhất. Skill đọc nhãn `risk:*` rồi chọn mức. Owner chỉ cần gõ "review PR #N", **không** phải gọi `code-review`.
2. **Kích hoạt tự động bằng 3 lớp:**
   - (a) hook `UserPromptSubmit` (`.claude/hooks/review-pr-hint.mjs`) nhận ra "review … PR/# số" và chèn context "dùng skill `review-pr`";
   - (b) mô tả của skill khớp các câu yêu cầu review;
   - (c) CLAUDE.md ghi quy tắc.
3. **Mức review:**

   | | low | med | high |
   |---|---|---|---|
   | Spec (lấy từ mattpocock: thiếu / ngoài phạm vi / sai, trích dòng spec) | ✓ | ✓ | ✓ |
   | Standards = `REVIEW-CHECKLIST.md` | ✓ | ✓ | ✓ |
   | Mùi code Fowler, **không chặn** | — | 4 mùi | 12 mùi |
   | Correctness | tự rà inline | `code-review medium` | `code-review high` |

   Mức lấy từ nhãn Issue (hoặc nhãn PR). Thiếu nhãn hoặc hai nhãn khác nhau → hỏi Owner. **Chỉ nâng, không hạ** khi diff chạm migration/schema, `src-tauri`, `packages/ai`, golden (→ high), hoặc script/CI/hook/settings hay vượt ngưỡng dòng (→ med).
4. **`code-review` chỉ để báo cáo:** không `--comment`, không `--fix`, không `ultra`.
   - `--comment` đăng phát hiện thô (có cả mục chưa chắc ở effort cao) thành nhiều comment, làm vỡ quy ước một comment `REVIEW:` duy nhất, nơi quyết định merge.
   - `--fix` để người review tự sửa rồi tự chấm, bỏ qua test đỏ trước khi sửa (TDD), chiếm vòng sửa (tối đa 2, sau đó G8) mà Owner chưa duyệt hướng, và ghi thẳng vào checkout có thể đang dùng chung.
   - `ultra` chạy trên cloud và tính tiền riêng (G4).
   - Kết quả của `code-review` là giả thuyết; phiên review phải xác nhận từng mục trước khi ghi.
5. **Không bật lại subagent.** `Agent` vẫn bị chặn (ADR-0001 giữ nguyên). Nếu `code-review` cần subagent mà không chạy được → rà Correctness inline, ghi rõ trong comment.
6. **Định dạng kết luận giữ nguyên** `REVIEW: PASS/CHANGES`, chia các mục Spec / Standards / Correctness. Mỗi mục gắn [chặn] hoặc [không chặn]. Chỉ mục chặn mới làm kết luận thành CHANGES. Quy tắc merge của ADR-0001 không đổi: `risk:low` + PASS + CI xanh → Claude merge; còn lại chờ Owner.

## Phương án đã cân nhắc

- **Vendor nguyên `code-review` của mattpocock:** bị trùng tên với skill có sẵn, phải sửa bản vendored (trái ADR-0012), và cần subagent. Loại.
- **Bật lại subagent cho 2 trục:** tốn khoảng 2–3 lần token mà chỉ thêm việc tách trục khỏi nhau, vì phiên review đã sạch. Loại theo ưu tiên chi phí.
- **Chỉ ghi quy tắc vào CLAUDE.md:** rẻ nhất nhưng không bắt buộc được gì; chính là tình trạng trước ADR này. Loại.
- **Chạy `code-review` cho mọi mức:** tốn thêm ở `risk:low` mà ít lợi. Loại.

## Hệ quả

- Review `risk:med`/`risk:high` tốn thêm một lượt `code-review` (medium/high). `risk:low` gần như không đổi.
- Chưa kiểm chứng việc `code-review` chạy ở mức `high` khi `Agent` bị chặn. Skill đã có đường lùi inline; lần review `risk:high` đầu tiên phải ghi kết quả thực tế vào PR comment.
- Hook cần Node (đã có trong toolchain). Hook in ra rỗng khi câu không khớp, nên không ảnh hưởng các yêu cầu khác.
- Tham chiếu `code-review` trong skill `tdd` (vendored) được hiểu là skill `review-pr` (ghi ở `.claude/skills/README.md`).

## Phụ lục — worktree review và review toàn bộ (Owner duyệt 27/09/2026, G1)

1. **Kiểm chứng mức high (PR #96):** `code-review high` chạy được khi `Agent` bị chặn. Skill tự chạy 8 góc rà lần lượt trong phiên chính, không gọi subagent. Kết quả ghi trong comment review của #96.
2. **Nơi review:** mọi review chạy trong worktree cố định `.claude\worktrees\review-main`, detached HEAD ở đúng SHA đang review (head PR, hoặc `origin/main` khi review theo vùng). Worktree này chỉ đọc: không nhánh, không commit. Code làm ở checkout chính hoặc worktree của task. Lý do: phiên review không đổi nhánh của checkout mà phiên code đang dùng, và test/`code-review` đọc đúng SHA được review. Mỗi máy tạo worktree một lần (`.claude/worktrees/` không nằm trong repo).
3. **Review toàn bộ phần đã làm (R1–R4):** các PR merge trước ADR này chưa có bước săn lỗi correctness. Review lại theo vùng code trên `origin/main`, không theo từng PR. Mỗi đợt một phiên sạch, chạy đủ Spec + Standards + `code-review high` cho cả vùng:

   | Đợt | Vùng | Đối chiếu |
   |---|---|---|
   | R1 | `packages/db/**` (schema, migration, repository, seed) | `docs/design/phase-3-du-lieu.md`, ADR-0016, golden qua DB |
   | R2 | `apps/desktop/src/data/**`, `apps/desktop/src-tauri/**` | spec §5, ADR-0016, #88–#91 |
   | R3 | `packages/domain/**` | ADR-0007, ADR-0008, `docs/golden/**` |
   | R4 | UI còn lại của `apps/desktop`, `packages/ui`, `tools/*.ps1`, CI, hook | checklist, ADR-0013, ADR-0015 |

   Kết quả mỗi đợt ghi vào một Issue review. Bug xác nhận được tách thành task `risk:*` riêng và sửa theo quy trình thường; phiên review không sửa code. R1 và R2 xong trước màn đầu tiên ghi DB (T-046); R3 và R4 chạy song song với các màn UI được.
