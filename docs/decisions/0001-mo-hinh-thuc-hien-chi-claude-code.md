# ADR-0001: Mô hình thực hiện — chỉ Claude Code, không subagent

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §0, §3, §4.1, §7.2 (C1, C3, C4, C8); Q14
- **Commit / PR:** `20e9c5e` (bootstrap) · PR: —

## Bối cảnh

Project-2C là nhánh đối chứng của Project-2: cùng yêu cầu sản phẩm, chỉ khác cách thực hiện. Biến được kiểm soát chính là "ai viết và review code".

## Quyết định

1. Mọi việc (spec, code, test, review, tài liệu) do **Claude Code** làm, trong phiên chính (C1, C3). Model và effort do Owner chọn cho từng phiên (phụ lục M1; trước 29/09/2026: Opus 5.5, effort medium).
2. **Không subagent / Agent tool**, không agent ngoài Claude viết code. OpenCode, Muse Code, Cursor, Codex không dùng cho phát triển. Ngoại lệ duy nhất: **Codex review độc lập khi đóng phase** (phụ lục M2, từ 30/09/2026).
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

- **Context rot** → task nhỏ, một phiên mỗi task, đầu vào là Issue + `docs/state/HANDOFF.md`.
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
