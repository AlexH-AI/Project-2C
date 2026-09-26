# ADR-0001: Mô hình thực hiện — chỉ Claude Code, Opus 5.5, không subagent

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §0, §3, §4.1, §7.2 (C1, C3, C4, C8); Q14
- **Commit / PR:** `20e9c5e` (bootstrap) · PR: —

## Bối cảnh

Project-2C là nhánh đối chứng của Project-2: cùng yêu cầu sản phẩm, chỉ khác cách thực hiện. Biến được kiểm soát chính là "ai viết và review code".

## Quyết định

1. Mọi việc (spec, code, test, review, tài liệu) do **Claude Code — Opus 5.5, effort medium** làm, trong phiên chính (C1, C3).
2. **Không subagent / Agent tool**, không agent ngoài Claude. OpenCode, Muse Code, Cursor, Codex không dùng cho phát triển.
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
