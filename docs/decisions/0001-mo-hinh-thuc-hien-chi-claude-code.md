# ADR-0001: Mô hình thực hiện — chỉ Claude Code, không subagent (bỏ "không subagent" từ 17/10/2026 — phụ lục M8)

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §0, §3, §4.1, §7.2 (C1, C3, C4, C8); Q14
- **Commit / PR:** `20e9c5e` (bootstrap) · PR: —

## Bối cảnh

Project-2C là nhánh đối chứng của Project-2: cùng yêu cầu sản phẩm, chỉ khác cách thực hiện. Biến được kiểm soát chính là "ai viết và review code".

## Quyết định

1. Mọi việc (spec, code, test, review, tài liệu) do **Claude Code** làm, trong phiên chính (C1, C3; từ 17/10/2026 thêm subagent / Workflow khi Owner bật — phụ lục M8). Model và effort do Owner chọn cho từng phiên (phụ lục M1; trước 29/09/2026: Opus 5.5, effort medium).
2. **Không subagent / Agent tool** (bỏ từ 17/10/2026 — phụ lục M8), không agent ngoài Claude viết code. OpenCode, Muse Code, Cursor, Codex không dùng cho phát triển. Ngoại lệ duy nhất: **Codex review độc lập khi đóng phase** (phụ lục M2, từ 30/09/2026).
3. Claude làm tự động trong mọi task, **chỉ dừng ở cổng Owner G1–G8** (C4):

   | Cổng | Khi nào |
   |---|---|
   | G1 | Chấp thuận kế hoạch / ADR |
   | G2 | Chốt định nghĩa chỉ số (golden examples) và mô hình dữ liệu |
   | G3 | Duyệt hướng UI (mockup dark mode) |
   | G4 | Thêm dependency lớn, công cụ, dịch vụ mới; bất cứ thứ gì tốn tiền |
   | G5 | Prompt / chính sách guardrail AI và bộ output mẫu |
   | G6 | Lưu trữ API key / bảo mật |
   | G7 | Merge kết thúc milestone + phát hành exe |
   | G8 | Task vẫn lỗi sau 2 vòng tự sửa, hoặc spec mâu thuẫn |

4. Task `risk:low` được **auto-merge** khi CI xanh + review đạt (Q14). Mỗi milestone có báo cáo tổng hợp các merge.
5. Quy trình một task: Issue (spec + test chấp nhận) → nhánh `task/T-xxx` → TDD → `pnpm verify` → PR → CI Windows → **review ở phiên mới, context sạch** (chỉ spec + diff, theo checklist) → merge / sửa (tối đa 2 vòng) / ESCALATE (G8).
6. Mỗi task một phiên mới (hoặc `/clear`); task ≤ ~400 dòng diff.
7. Hạn mức dùng và thời gian chờ do Owner tự cân đối (C8).

## Phương án đã cân nhắc

- **Đa agent (Opus điều phối + agent khác làm task)** — là thiết kế của Project-2; loại cho 2C vì đó chính là biến đối chứng.
- **Claude + subagent** — loại: làm mờ ranh giới "một agent", khó so sánh công bằng.

## Lý do

Nhất quán kiến trúc/phong cách, không chi phí điều phối, không lỗi bàn giao giữa agent; tạo đường cơ sở sạch để so sánh với Project-2.

## Hệ quả

- **Context rot** → task nhỏ, một phiên mỗi task, đầu vào là Issue + HANDOFF (từ 03/10/2026 là Issue ghim nhãn `handoff`, không còn là `docs/state/HANDOFF.md` — ADR-0003 phụ lục, #283).
- **Điểm mù tự review** → review ở phiên riêng + checklist `docs/process/REVIEW-CHECKLIST.md` (Phase 1); CI, test chấp nhận và `dependency-cruiser` là trọng tài khách quan.
- `CLAUDE.md` là nguồn quy tắc duy nhất (không cần `AGENTS.md`) và ghi rõ cấm subagent. Chặn cứng Agent tool bằng `permissions.deny` trong `.claude/settings.json` (xem ADR-0012).
- Không cần `dispatch.ps1` hay worktree song song: làm tuần tự từng task.

## Phụ lục — ngưỡng cỡ task (P1 — Accepted G1, Owner duyệt 26/09/2026 · PR #58)

Mục 6 "task ≤ ~400 dòng diff" đổi thành: **≤ ~400 dòng code sản phẩm** (không tính test) và **≤ ~800 dòng tổng diff** kể cả test. Không tính file sinh tự động: lockfile, migration SQL, snapshot drizzle-kit, bảng dữ liệu tĩnh của seed; PR phải liệt kê các file không tính. Lý do: phần cần review kỹ giữ mức cũ, chỉ nới cho test (Phase 3 có nhiều test tầng DB). Nguồn: `docs/design/phase-3-du-lieu.md` §1 (P1).

## Phụ lục — model và effort do Owner chọn (M1 — Accepted G1, Owner quyết 29/09/2026)

Mục 1 bỏ ràng buộc "Opus 5.5, effort medium": **model và effort do Owner tự chọn cho từng phiên** trong app Claude Code; repo không ghim model hay effort. Các ràng buộc khác giữ nguyên: chỉ Claude Code, không subagent / Agent tool, cổng G1–G8, review ở phiên riêng. Lý do: Owner muốn dùng model mới ngay khi ra mà không phải sửa ADR mỗi lần, và tự cân đối chất lượng / hạn mức (C8).

## Phụ lục — Codex review độc lập khi đóng phase (M2 — Accepted G1, Owner quyết 30/09/2026 · Issue #198)

Mục 2 thêm một ngoại lệ: **Codex được tham gia review độc lập khi đóng phase** để tăng chất lượng 2C. Codex **không viết code** và không review PR task — Claude Code vẫn làm 100% spec, code, test, review task, tài liệu. OpenCode (CLI), Muse Code, Cursor vẫn không dùng; không subagent / Agent tool, cổng G1–G8 và quy trình một task (mục 5) giữ nguyên.

Lý do: trước khi đóng Phase 3, Owner muốn một big review độc lập từ ngoài Claude (Codex Astra) cho Phase 1→3 — bù điểm mù tự review (xem Hệ quả). Review ngoài bằng Codex từng tìm ra lỗi mất dữ liệu ở PR #87 (ADR-0017 Bối cảnh).

Hệ quả:

- Owner chạy Codex (ngoài repo) trên `main` trước khi đóng phase (cổng G7), gửi báo cáo cho Claude.
- Review của Codex **bổ sung**, không thay review phiên sạch của `review-pr`. Báo cáo của Codex là dữ liệu tham khảo: Claude kiểm lại từng phát hiện trên code, phân loại (đúng / đã biết / sai) rồi mới tạo Issue; việc sửa do Claude làm theo quy trình task bình thường.

## Phụ lục — đổi lý do: từ "nhánh đối chứng" sang "đã chứng minh hiệu quả" (M3 — Accepted G1, Owner quyết 11/10/2026)

Owner bỏ mục đích so sánh với Project-2 (Project-2 dừng; ADR-0002 Superseded, `docs/COMPARISON.md` hết hiệu lực). **Cách làm giữ nguyên:** chỉ Claude Code viết code, không subagent / Agent tool, cổng G1–G8, quy trình một task, review phiên sạch. Chỉ đổi lý do: không còn là "biến đối chứng" (Bối cảnh, Phương án, Lý do ở trên chỉ còn giá trị lịch sử), mà vì mô hình chỉ Claude Code đã cho kết quả tốt và ổn định qua Phase 1–5, nên giữ tới v1.0. Thử mô hình đa agent ở project mới, không ở 2C.

## Phụ lục — DeepSeek và Muse review chỉ đọc khi đóng Phase 6 (M4 — Accepted G1, Owner quyết 11/10/2026)

Mở rộng M2 cho review đóng Phase 6 (2 lượt deep review Phase 1–6, `docs/design/phase-6-hoan-thien.md` §6): ngoài Codex, **DeepSeek (OpenCode) và Muse Spark (Muse Code)** tham gia review độc lập. Cùng điều kiện như Codex: Owner chạy, chỉ đọc, không viết code vào repo, không review PR task; báo cáo là dữ liệu tham khảo, Claude kiểm lại từng phát hiện trên code; kết luận phát hành chỉ lấy từ phiên tổng hợp của Claude (đánh giá 10/10: hai model này chính xác nhưng phủ hẹp, đã bỏ sót 2 lỗi Medium — `docs/reviews/2026-10-10-danh-gia-deepseek-muse.md`). OpenCode / Muse vẫn không dùng để phát triển.

## Phụ lục — đổi bên review đóng Phase 6: bỏ DeepSeek, Muse dùng Muse Wonder (M5 — Accepted G1, Owner quyết 13/10/2026 · Issue #562)

Sửa M4. **Bỏ DeepSeek v4.1 Flash (OpenCode)** khỏi review đóng Phase 6: chỉ số benchmark trí tuệ không đủ cao cho deep review toàn codebase. **Muse dùng model Muse Wonder** (`muse-wonder-1.0`, mới ra, benchmark cao hơn Muse Spark 1.3). Review đóng Phase 6 còn ba bên — Claude, Codex, Muse Wonder — mỗi lượt 6 gói × 3 = 18 báo cáo (`docs/process/deep-review-phase-1-6.md`). Mọi điều kiện khác của M2 / M4 giữ nguyên: Owner chạy, chỉ đọc, không viết code, báo cáo là dữ liệu tham khảo, kết luận phát hành chỉ lấy từ phiên tổng hợp của Claude. OpenCode vẫn là AI runtime của sản phẩm (model mặc định của app không đổi).

Muse chạy không hỏi duyệt (`--yolo`, Owner chọn 13/10): vẫn chỉ đọc theo prompt; ACL chặn thư mục báo cáo của bên khác, `git status` mỗi gói và quét log phiên thay cho sandbox (`docs/process/deep-review-phase-1-6.md` §7.1).

## Phụ lục — Muse dùng lại Muse Spark 1.3 (M6 — Accepted G1, Owner quyết 14/10/2026)

Sửa M5 phần model. Home PC (máy có Muse Code 1.4.6 và Muse Wonder) không truy cập được, nên deep review Phase 1–6 chạy trên Office Laptop với **Muse Spark 1.3** có sẵn (`muse-spark-1.3-contributor`, Muse Code 1.3.0, mức `max`, như Phase 5). Review vẫn ba bên — Claude, Codex, Muse — 18 báo cáo mỗi lượt; mọi điều kiện khác của M2 / M4 / M5 giữ nguyên (bỏ DeepSeek, `--yolo`, chỉ đọc, kết luận phát hành chỉ từ phiên tổng hợp của Claude).

## Phụ lục — lượt 2 review đóng Phase 6 bỏ Muse, máy chạy tùy (M7 — Accepted G1, Owner quyết 17/10/2026 · PR #647)

Sửa M4–M6 cho **lượt 2** của deep review Phase 1–6 (T-224 #564). **Bỏ Muse**: lượt 2 chỉ còn hai bên — Claude, Codex — 6 gói × 2 = 12 báo cáo, chạy một đợt (hai bên song song; không ACL, không đợt Muse riêng). **Máy chạy tùy** (Office Laptop hay Home PC), miễn đủ số lượt; số đo hiệu năng chỉ so với mốc đo trên **cùng máy** (laptop: số đo nền T-219 và số lượt 1 của laptop; Home PC: số lượt 1 của Home PC và ngưỡng `docs/metrics/phase-6.md`) — chi tiết ở `docs/process/deep-review-phase-1-6.md` §L2.1, §L2.6, §L2.11. Mọi điều kiện khác của M2 giữ nguyên với Codex: Owner chạy, chỉ đọc, không viết code, báo cáo là dữ liệu tham khảo, kết luận phát hành chỉ lấy từ phiên tổng hợp của Claude.

M4–M6 giữ làm lịch sử: lượt 1 (14–15/10/2026) đã chạy ba bên Claude, Codex, Muse Spark 1.3 trên hai máy. Muse Code / OpenCode vẫn không dùng để phát triển; OpenCode vẫn là AI runtime của sản phẩm.

## Phụ lục — cho phép subagent / Workflow (M8 — Accepted G1, Owner quyết 17/10/2026 · Issue #671)

Sửa mục 1, mục 2 và phần "không subagent / Agent tool" của M1–M3. **Claude được dùng subagent (Agent tool) và Workflow nhiều agent** (chế độ `ultracode` của Claude Code). Bỏ `permissions.deny: ["Agent"]` trong `.claude/settings.json`. Lý do: Owner muốn dùng ultracode cho việc cần phủ rộng hoặc kiểm chéo (review, rà soát, sửa hàng loạt); subagent cũng là Claude nên mô hình "chỉ Claude Code viết code" không đổi.

- **Mặc định vẫn làm trong phiên chính.** Workflow / subagent chạy khi Owner bật (từ khóa `ultracode`, hoặc bảo rõ) — Owner tự cân đối hạn mức (C8).
- **Giữ nguyên:** agent ngoài Claude (Codex, Muse Code, OpenCode, Cursor) không viết code; Codex review khi đóng phase theo M2 / M7; cổng G1–G8; quy trình một task (mục 5, P1); review phiên sạch bằng `review-pr` (ADR-0017); merge qua `tools/merge-pr.mjs`.
- Subagent ghi file song song: mỗi agent một worktree (`isolation: "worktree"`, nằm ở `.claude/worktrees/`); thư mục này được `eslint` và `.gitignore` bỏ qua nên `pnpm verify` của checkout chính không quét bản sao (khác worktree review của ADR-0017 phụ lục mục 2, vẫn đặt ngoài repo). Commit theo pathspec như phiên song song.
- Chỉ phần "không subagent / Agent tool" của mục 1, mục 2 và M1–M3, "Phương án đã cân nhắc" (Claude + subagent) và Hệ quả "chặn cứng Agent tool" còn giá trị lịch sử; phần còn lại của các mục đó giữ nguyên. ADR-0012 quyết định 1, 3 và ADR-0017 mục 5 sửa theo phụ lục này.

## Phụ lục — lượt 3 review đóng Phase 6, phần Claude chạy bằng Workflow (M9 — Accepted G1, Owner quyết 19/10/2026 · Issue #713)

Thêm **lượt 3** của deep review Phase 1–6 trước G7 (spec Phase 6 §6 cũ chỉ có hai lượt; tổng hợp lượt 2 §8.1 và `PROJECT-STATE` 17/10 ghi "không có lượt 3"). Owner chốt 19/10/2026: hai bên **Claude và Codex** như M7 (6 gói × 2 = 12 báo cáo, một đợt); **phạm vi đủ 6 gói** như lượt 2 (kiểm phần đã sửa sau lượt 2 + lỗi / edge case mới trên toàn bộ phạm vi gói); sau tổng hợp **sửa hết**, rồi G7.

**Phần Claude chạy bằng Workflow** (M8): Owner mở một phiên ở worktree review và chạy script của kế hoạch; mỗi gói là **một subagent context sạch**, chạy tuần tự A → F với cùng prompt như một phiên sạch của lượt 1–2, nên Owner không phải mở 6 phiên. Subagent cũng là Claude và bắt đầu với context trống, nên điều kiện "context sạch mỗi gói" vẫn giữ (spec §6.1, hàng Claude: lượt 1–2 mỗi gói một phiên sạch, lượt 3 mỗi gói một subagent). Kiểm độc lập bằng log quét thêm transcript của từng subagent (`docs/process/deep-review-phase-1-6.md` §L3). Codex vẫn theo M2 / M7: Owner chạy, chỉ đọc, không viết code. Kết luận phát hành chỉ lấy từ phiên tổng hợp của Claude (#714).

*Sửa 20/10/2026 (Owner, trước khi chạy):* phần Claude chạy **như lượt 2**, mỗi gói một phiên sạch Owner mở với tin nhắn một dòng, thay cho một phiên điều phối chạy Workflow A → F. Lý do: Owner không muốn subagent chạy liền A → F trong một lần, context dài và có thể bị nén.

- Mức suy luận và ultracode do Owner chọn từng phiên (M1, M8). Phiên bật ultracode được dùng subagent / Workflow cho việc của chính gói đó; chỉ phiên chính ghi báo cáo. Lượt 3: chỉ gói A bật.
- Kiểm độc lập bằng log quét transcript của các phiên gói và của subagent (tổng hợp lượt 3 `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §10).
- Hàng Claude của spec §6.1 sửa theo.

## Phụ lục — lượt 4 review đóng Phase 6, trước G7 (M10 — Accepted G1, Owner quyết 26–28/10/2026 · Issue #854, #868, #880)

Thêm **lượt 4** của deep review Phase 1–6 trước G7; M9 coi lượt 3 là lượt cuối. Owner 26/10/2026: một vòng deep review toàn bộ code trước G7, sau khi các mục sổ ghi chú review làm được trước vòng này đã xong (T-305…T-308). Lý do: từ SHA ghim lượt 3 có ba đợt mà chưa lượt nào đọc trọn: đợt sửa lượt 3, đợt sửa sổ ghi chú review trước v1.0 (22 Issue, Owner 23/10) và T-305…T-308 (gồm đổi tên hiển thị sang Heritas L-CRM).

Owner 27/10/2026, bên review: "Vẫn là Claude Opus 5.5 và GPT Sol 6.1 làm deep review toàn bộ code base". Cùng ngày, khi xem bản nháp kế hoạch, Owner bổ sung bên thứ ba: "anh bổ sung kế hoạch review sẽ có thêm deepseek v4.1 flash".

- **Claude Opus 5.5:** như lượt 3 sau 20/10 (M9). Mỗi gói một phiên sạch Owner mở; mức suy luận và ultracode Owner chọn từng phiên (M1, M8). Phiên bật ultracode được dùng subagent / Workflow cho việc của gói; chỉ phiên chính ghi báo cáo.
- **Codex, model GPT Sol 6.1:** theo M2 / M7. Owner chạy, chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo, Claude kiểm lại từng phát hiện trên code.
- **DeepSeek v4.1 Flash, trong app desktop WorkBuddy trên gói WorkBuddy Pro:** sửa M5 cho lượt 4 (M5 bỏ DeepSeek khỏi review đóng Phase 6 từ 13/10). Cùng điều kiện như Codex theo M2: Owner chạy, chỉ đọc, không viết code, báo cáo là dữ liệu tham khảo.
  - Bản 27/10 chạy qua OpenCode, trên hạn mức gói OpenCode Go. Owner đổi ngày 28/10, khi duyệt G1: "anh duyệt G1, nhưng lần review lượt 4 này với Deepseek sẽ không dùng opencode, mà dùng trực tiếp Deepseek API với deepseek harness". DSH là harness mã nguồn mở của DeepSeek, gọi DeepSeek API trực tiếp, trả theo mức dùng; G4 / G6 duyệt cùng ngày (#868).
  - Cùng ngày Owner đổi lần 2: "Chọn workbuddy pro" (#880), dùng model DeepSeek V4.1 Flash gắn sẵn của gói WorkBuddy Pro bản quốc tế (Tencent). Lý do, Owner nói cùng phiên: "Về tiêu chí gần với inference chính hãng có lẽ Tencent đáng tin hơn những bên khác và đó là lý do anh muốn sub"; gói còn tặng credit hằng ngày. Tài liệu Tencent không ghi model gắn sẵn chạy trên hạ tầng của DeepSeek hay của Tencent; Owner chấp nhận.
  - Bản đầu của lần đổi này chạy bằng CodeBuddy Code CLI. Sau khi tự kiểm, Owner làm rõ cùng ngày: "anh làm rõ lại quyết định, sẽ là workbuddy IDE vì codebuddy CLI không chọn được đúng model và context windows", tức app desktop WorkBuddy.
  - G4 / G6 duyệt ngày 28/10 (#880), thay lần duyệt cho DSH:
    - App desktop WorkBuddy bản quốc tế, ghi số bản; model bản 1017, context 1M, mức suy luận cao nhất chọn tay cho từng task.
    - Gói WorkBuddy Pro một tháng, trần 25 USD; đo credit ở phiên thử và sau gói A.
    - Owner tự đăng nhập / đăng xuất app; không phiên Claude nào đăng nhập, đọc, in hay lưu token.
    - Cùng user Windows: ACL đợt 2 và `gh` đăng xuất như bản DSH, thêm hash báo cáo của Claude / Codex trước / sau đợt 2. Chế độ quyền Default trước, Full Access nếu phiên thử thấy app hỏi ở hầu hết lệnh thường.
    - Cài đặt app, phiên thử và log phiên ở kế hoạch (Phụ lục P).
  - WorkBuddy không phải OpenCode, nên lượt 4 không là ngoại lệ của dòng "không dùng OpenCode… để review" trong `CLAUDE.md`. Agent ngoài Claude vẫn không viết code.
- 6 gói × 3 bên = 18 báo cáo. Phạm vi đủ 6 gói: kiểm phần đã sửa sau lượt 3, và lỗi / edge case mới trên toàn bộ phạm vi gói. Kết luận phát hành chỉ lấy từ phiên tổng hợp của Claude.

Owner 27/10/2026, điều kiện chạy: "anh chỉ làm review lượt 4 khi tất cả các review-notes open đã được sửa hết". Lượt 4 chạy trên `main` khi mục OPEN của `docs/state/review-notes.md` rỗng, kể cả các mục [G7] mà trước đó cùng ngày Owner định làm sau mọi task.

Phần Owner chọn cùng G1 (SHA ghim, phạm vi, KNOWN, việc sửa sau tổng hợp, số đo, đợt sửa mục OPEN, cách chạy DeepSeek): `docs/process/deep-review-phase-1-6.md` §L4.11. Spec Phase 6 §6 sửa theo. Owner duyệt G1 ngày 28/10/2026 (comment trên PR #863), kèm thay đổi cách chạy DeepSeek ở trên: DSH, rồi app desktop WorkBuddy cùng ngày.

## Phụ lục — pipeline `auto-issues`: `/goal` chạy hàng đợi Issue qua phiên con (M11 — Accepted G1, Owner quyết 01/11/2026 · Issue #942)

Owner 01/11/2026 (phiên Coding-ses2): "tạo artifact hoặc skill khi anh set với lệnh "/goal - <artifact/skill> đó sẽ tự động thực hiện". Ba việc Owner nêu:

- Phiên code context sạch làm lần lượt từng Issue, "nhưng phải đợi review pass, merge, viết sổ ghi chú review-notes xong".
- Phiên review context sạch chạy `/review-pr` khi CI xanh. CHANGES thì đưa nội dung lại cho phiên code sửa, lặp tới PASS thì merge: "anh cho quyền merge kể cả mức med/high vì đây là bộ artifact/skill tự động".
- Hết Issue thì tra sổ, tạo Issue từ các mục OPEN: "Dừng lại hỏi ý kiến anh khi cần anh quyết định".

Owner chốt cùng ngày, trả lời từng câu hỏi khi duyệt thiết kế:

1. **Phiên con là phiên thật trong sidebar, không phải subagent.** `coding-ses1` và `coding-ses2` ở checkout chính; `review-1` ở `Project-2C-review`, `review-2` ở `Project-2C-review-2` (ADR-0017 phụ lục). Mỗi việc mới bắt đầu bằng `/clear`.
2. **Lặp review tới PASS, không trần.** Trong pipeline, câu "Sửa tối đa 2 vòng, sau đó G8" của quy trình một task không áp dụng. Phần "spec mâu thuẫn" của G8 vẫn dừng pipeline.
3. **G1–G7 vẫn dừng pipeline**, cũng như khi spec mâu thuẫn hoặc khi phiên code không đồng ý một mục chặn. Pipeline chỉ có thêm hai quyền: merge PR `risk:med` / `risk:high` do pipeline làm ra (`merge-pr --owner`), và lặp review không trần.
4. **Gom sổ thành Issue xong thì dừng.** Cách gom vẫn do Owner duyệt, như lần 01/11 (#936). Đợt mới bắt đầu khi Owner gõ `/goal` lại.
5. Owner tự chọn lúc chạy thử: "cứ xây dựng đi, khi nào chạy thử anh sẽ quyết định".

Cách chạy (chi tiết ở `.claude/skills/auto-issues/SKILL.md`):

- **`/goal`** của Claude Code giữ phiên điều phối chạy. Sau mỗi lượt, một model nhỏ đọc transcript; điều kiện chưa đạt thì lượt sau tự chạy, còn việc nền đang chạy thì hoãn đánh giá. Điều kiện của pipeline đọc dòng mốc mà phiên điều phối in khi kết thúc.
- **Giới hạn của app desktop:**
  - một phiên chỉ `/clear` được phiên con do chính nó mở, khi phiên con rảnh, không ghim, không đang mở trên màn hình;
  - lượt do sự kiện tự động khởi động không mở được phiên mới.

  Vì vậy phiên điều phối mở đủ 4 phiên con ngay ở lượt `/goal` đầu, và muốn chạy tiếp thì phải dùng lại đúng phiên điều phối đó.
- **Ngoại lệ chờ:** app không báo khi CI xanh hay khi có comment REVIEW, và `/goal` chạy lượt kế ngay khi phiên điều phối rảnh mà không có việc nền.
  - Phiên điều phối chờ bằng `tools/auto-wait.mjs` chạy nền: đọc GitHub cách ít nhất 30 giây một lần, hết giờ sau tối đa 120 phút. Lệnh chạy từ worktree chỉ đọc `Project-2C-auto` ở `origin/main`, vì phiên code sửa file ngay trên checkout chính.
  - Đây là ngoại lệ có chủ ý với lời dặn "không poll CI" của app desktop, chỉ áp cho pipeline này.
- **Hỏi Owner qua phiên điều phối:** phiên con không hỏi Owner trực tiếp mà báo `CẦN OWNER`. Phiên điều phối hỏi Owner (thông báo đẩy + câu hỏi) rồi ghi quyết định thành comment trên PR / Issue.
- **Chỉ phiên điều phối merge**, qua `tools/merge-pr.mjs`. Pipeline không tự merge PR sửa chính nó (skill `auto-issues`, `tools/auto-wait*`).
- **Giữ nguyên:**
  - quy trình một task (mục 5, P1);
  - review phiên sạch bằng `review-pr` (ADR-0017);
  - PR sổ không cần review (T-215);
  - merge qua `merge-pr`;
  - golden không sửa "cho xanh";
  - agent ngoài Claude không viết code.

`CLAUDE.md` (Mô hình thực hiện, bước 5, Project skills) và `review-pr` §5 sửa theo phụ lục này.
