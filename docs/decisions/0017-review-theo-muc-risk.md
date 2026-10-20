# ADR-0017: Review PR theo mức risk — skill `review-pr`

- **Trạng thái:** Accepted (G1, Owner duyệt 27/09/2026); nâng mức `code-review` ở phụ lục (Accepted G1, Owner quyết 21/10/2026, Issue #730)
- **Ngày:** 2026-09-27
- **Nguồn:** ADR-0001 (quy trình task, review phiên sạch), ADR-0012 (skill được phép), `docs/process/REVIEW-CHECKLIST.md`
- **Commit / PR:** nhánh `docs/review-by-risk`

## Bối cảnh

- Trước ADR này, review dựa vào việc Claude tự đọc CLAUDE.md rồi đi theo `REVIEW-CHECKLIST.md`. Không có lệnh/skill nào bắt buộc, và không có bước săn lỗi correctness riêng. Ví dụ ở PR #87, lỗi mất dữ liệu do review ngoài (Codex) và review phiên sạch tìm ra.
- Skill `code-review` của mattpocock/skills (commit `c55ee46`) không được vendor ở ADR-0012. Lõi của nó là 2 subagent song song (Spec / Standards), trái ADR-0001. Mục đích chính của subagent là context sạch, nhưng 2C đã có context sạch vì review chạy ở phiên mới.
- Claude Code có skill `code-review` sẵn (săn lỗi correctness theo mức effort, có `--comment`/`--fix`/`ultra`). Nó trùng tên với skill của mattpocock.
- `.claude/skills/tdd/SKILL.md` (vendored) nhắc tới skill `code-review` mà repo không có.
- Owner ưu tiên chi phí thấp đến trung bình cho `risk:low`/`risk:med`; `risk:high` không cần tối ưu chi phí. *(Ngày 21/10/2026 Owner nâng mức `code-review` ở cả ba mức — phụ lục nâng mức `code-review`.)*

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
   | Correctness (đến 20/10/2026, lịch sử) | ~~tự rà inline~~ | ~~`code-review medium`~~ | ~~`code-review high`~~ |
   | Correctness từ 21/10/2026 (phụ lục nâng mức `code-review`) | `code-review high` | `code-review max` | `code-review max --max-findings all` |

   Mức lấy từ nhãn Issue (hoặc nhãn PR). Thiếu nhãn hoặc hai nhãn khác nhau → hỏi Owner. **Chỉ nâng, không hạ** khi diff chạm migration/schema, `src-tauri`, `packages/ai`, golden (→ high), hoặc script/CI/hook/settings hay vượt ngưỡng dòng (→ med).
4. **`code-review` chỉ để báo cáo:** không `--comment`, không `--fix`, không `ultra`.
   - `--comment` đăng phát hiện thô (có cả mục chưa chắc ở effort cao) thành nhiều comment, làm vỡ quy ước một comment `REVIEW:` duy nhất, nơi quyết định merge.
   - `--fix` để người review tự sửa rồi tự chấm, bỏ qua test đỏ trước khi sửa (TDD), chiếm vòng sửa (tối đa 2, sau đó G8) mà Owner chưa duyệt hướng, và ghi thẳng vào checkout có thể đang dùng chung.
   - `ultra` chạy trên cloud và tính tiền riêng (G4).
   - Kết quả của `code-review` là giả thuyết; phiên review phải xác nhận từng mục trước khi ghi.
5. ~~**Không bật lại subagent.**~~ (lịch sử, xem dòng sửa ngay dưới) `Agent` vẫn bị chặn (ADR-0001 giữ nguyên). Nếu `code-review` cần subagent mà không chạy được → rà Correctness inline, ghi rõ trong comment.
   - *Sửa 17/10/2026 (ADR-0001 phụ lục M8):* `Agent` không còn bị chặn. Như mọi việc khác, subagent chỉ chạy khi Owner bật (`ultracode`, hoặc bảo rõ): khi đó `code-review` được dùng subagent của nó và phiên review được dùng Workflow; chưa bật thì `code-review` chạy các góc rà lần lượt trong phiên chính như ở #96 (phụ lục mục 1). Mọi phát hiện vẫn là giả thuyết, phiên review xác nhận trước khi ghi; vẫn **một** comment `REVIEW:`, phiên review vẫn không commit.
6. **Định dạng kết luận giữ nguyên** `REVIEW: PASS/CHANGES`, chia các mục Spec / Standards / Correctness. Mỗi mục gắn [chặn] hoặc [không chặn]. Chỉ mục chặn mới làm kết luận thành CHANGES. Quy tắc merge của ADR-0001 không đổi: `risk:low` + PASS + CI xanh → Claude merge; còn lại chờ Owner.

## Phương án đã cân nhắc

- **Vendor nguyên `code-review` của mattpocock:** bị trùng tên với skill có sẵn, phải sửa bản vendored (trái ADR-0012), và cần subagent. Loại.
- **Bật lại subagent cho 2 trục:** tốn khoảng 2–3 lần token mà chỉ thêm việc tách trục khỏi nhau, vì phiên review đã sạch. Loại theo ưu tiên chi phí.
- **Chỉ ghi quy tắc vào CLAUDE.md:** rẻ nhất nhưng không bắt buộc được gì; chính là tình trạng trước ADR này. Loại.
- **Chạy `code-review` cho mọi mức:** tốn thêm ở `risk:low` mà ít lợi. ~~Loại.~~ Owner chọn từ 21/10/2026 (phụ lục nâng mức `code-review`).

## Hệ quả

- ~~Review `risk:med`/`risk:high` tốn thêm một lượt `code-review` (medium/high). `risk:low` gần như không đổi.~~ Từ 21/10/2026, review PR code ở mọi mức tốn thêm một lượt `code-review` (high / max / max kèm mọi phát hiện), kể cả `risk:low`; PR chỉ sửa docs vẫn không gọi (phụ lục nâng mức `code-review`).
- Chưa kiểm chứng việc `code-review` chạy ở mức `high` khi `Agent` bị chặn. Skill đã có đường lùi inline; lần review `risk:high` đầu tiên phải ghi kết quả thực tế vào PR comment.
- Hook cần Node (đã có trong toolchain). Hook in ra rỗng khi câu không khớp, nên không ảnh hưởng các yêu cầu khác.
- Tham chiếu `code-review` trong skill `tdd` (vendored) được hiểu là skill `review-pr` (ghi ở `.claude/skills/README.md`).

## Phụ lục — worktree review và review toàn bộ (Owner duyệt 27/09/2026, G1)

1. **Kiểm chứng mức high (PR #96):** `code-review high` chạy được khi `Agent` bị chặn. Skill tự chạy 8 góc rà lần lượt trong phiên chính, không gọi subagent. Kết quả ghi trong comment review của #96.
2. **Nơi review:** mọi review chạy trong worktree cố định `C:\workspace\Project-2C-review` (ngoài checkout chính), detached HEAD ở đúng SHA đang review (head PR, hoặc `origin/main` khi review theo vùng). Worktree này chỉ đọc: không nhánh, không commit. Code làm ở checkout chính hoặc worktree của task. Lý do: phiên review không đổi nhánh của checkout mà phiên code đang dùng, và test/`code-review` đọc đúng SHA được review. Đặt ngoài repo vì `eslint .`, Prettier và `git status` của checkout chính không quét bản sao repo, nên `pnpm verify` ở checkout chính vẫn xanh (worktree lồng trong `.claude/worktrees/` làm `eslint .` đỏ — review PR #98). Mỗi máy tạo worktree một lần, từ checkout chính: `git worktree add --detach ../Project-2C-review origin/main`. Vòng sửa: phiên review chỉ đọc và comment; phiên code sửa ở checkout chính hoặc worktree task rồi push; phiên review sạch mới `git fetch origin` + `git checkout --detach <headRefOid mới>`. Worktree review không giữ nhánh nên không xung đột khi phiên code checkout nhánh PR. Phiên ở `Project-2C-review` có memory Claude riêng theo đường dẫn — chấp nhận được, hợp với yêu cầu context sạch.
3. **Review toàn bộ phần đã làm (R1–R4):** các PR merge trước ADR này chưa có bước săn lỗi correctness. Review lại theo vùng code trên `origin/main`, không theo từng PR. Mỗi đợt một phiên sạch, chạy đủ Spec + Standards + `code-review high` cho cả vùng:

   | Đợt | Vùng | Đối chiếu |
   |---|---|---|
   | R1 | `packages/db/**` (schema, migration, repository, seed) | `docs/design/phase-3-du-lieu.md`, ADR-0016, golden qua DB |
   | R2 | `apps/desktop/src/data/**`, `apps/desktop/src-tauri/**` | spec §5, ADR-0016, #88–#91 |
   | R3 | `packages/domain/**` | ADR-0007, ADR-0008, `docs/golden/**` |
   | R4 | UI còn lại của `apps/desktop`, `packages/ui`, `tools/*.ps1`, CI, hook | checklist, ADR-0013, ADR-0015 |

   Kết quả mỗi đợt ghi vào một Issue review. Bug xác nhận được tách thành task `risk:*` riêng và sửa theo quy trình thường; phiên review không sửa code. R1 và R2 xong trước màn đầu tiên ghi DB (T-046); R3 và R4 chạy song song với các màn UI được.

4. **Worktree review thứ hai (Owner duyệt 29/09/2026):**
   - Sự cố: #174 và #175 được review gần như cùng lúc, cả hai trong `Project-2C-review`. Phiên #175 `git checkout` head của nó, đè lên worktree mà phiên #174 đang đọc. Phiên #174 suýt kết luận sai khi đọc file e2e của #175.
   - Quyết định: mỗi worktree review chỉ phục vụ một phiên review tại một thời điểm. Phiên review song song thứ hai dùng `C:\workspace\Project-2C-review-2`, quy tắc y như mục 2. Mỗi máy tạo worktree này một lần: `git worktree add --detach ../Project-2C-review-2 origin/main`.
   - Chốt chặn: trước khi đăng comment, phiên review so `git rev-parse HEAD` với `headRefOid`. Nếu khác, đọc lại bằng chứng qua `git show <headRefOid>:<path>`.

## Phụ lục — nâng mức `code-review` (Accepted G1, Owner quyết 21/10/2026 · Issue #730)

Owner quyết trong chat ngày 21/10/2026, sau bản tổng hợp deep review Phase 1–6 lượt 3 (#714) và trước đợt sửa #719–#729. Nguyên văn: "nâng mức của skill /review-pr lên max cho med, max-findings cho high risk, với low thì high". Phụ lục này sửa dòng Correctness của mục 3, và chọn phương án "Chạy `code-review` cho mọi mức" từng bị loại.

| | low | med | high |
|---|---|---|---|
| Correctness | `code-review high` | `code-review max` | `code-review max --max-findings all` |

1. **Mọi mức gọi `code-review`;** `risk:low` không còn tự rà inline. "max-findings cho high risk" hiểu là `max` kèm `--max-findings all` (báo mọi phát hiện), vì `risk:high` không thấp hơn `risk:med`.
2. **`--max-findings`:** theo mô tả của `code-review`, lựa chọn này được giữ cho tới khi truyền `--max-findings default`. Vì vậy `risk:low` / `risk:med` luôn truyền `--max-findings default`, để review low / med chạy sau một review high không kế thừa `all`. Mức effort cũng luôn truyền rõ, vì thiếu thì skill dùng lại mức gõ lần trước. Args cụ thể ở skill `review-pr` §C.
3. **Giữ nguyên:**
   - trục Spec, Standards; mùi code (low không có, med 4, high 12); bảng nâng mức theo file;
   - PR chỉ sửa docs (`docs/**`, `*.md`, trừ `CODE_DOCS`) vẫn bỏ trục Correctness;
   - mục 4 (không `--comment` / `--fix` / `ultra`; kết quả là giả thuyết), mục 5 (subagent khi Owner bật), mục 6 và quy tắc merge.
4. **Hệ quả:**
   - Review PR code tốn thêm ở mọi mức, nhiều nhất ở `risk:low` (trước đây không gọi skill).
   - Ở `max`, nhất là khi kèm `--max-findings all`, `code-review` báo cả những mục chưa chắc. Bước xác nhận từng mục trên code trước khi ghi (mục 4) vì vậy càng quan trọng.
   - Áp dụng cho các review chạy sau khi PR của Issue #730 merge, gồm PR của đợt sửa #719–#729.
