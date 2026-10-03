# Tài liệu Project-2C — đọc gì, khi nào

Quy tắc làm việc nằm ở `CLAUDE.md` (gốc repo) và `.claude/rules/` (nạp theo đường dẫn). Trạng thái phiên (HANDOFF) là Issue ghim nhãn `handoff`, không nằm trong `docs/`. Bảng dưới liệt kê mọi tài liệu trong `docs/`; phiên làm task chỉ đọc những gì mục "Tài liệu cần đọc" của Issue chỉ ra.

## Kế hoạch và quyết định

| Tài liệu | Dùng để | Khi nào đọc | Ai sửa |
|---|---|---|---|
| `PROJECT-PLAN.md` | Kế hoạch tổng: quy trình một agent (§4.1), liên tục giữa 2 máy (§4.2), tech stack (§4.4), lộ trình phase (§5) | Viết Issue / mở phase mới | Claude, qua G1 |
| `PROJECT-STATE.md` | Phase hiện tại + "Current OWNER decisions" (quyết định bền theo ngày) | Khi cần biết Owner đã chốt gì | Claude ghi lại quyết định Owner |
| `decisions/README.md` + `decisions/00xx-*.md` | ADR: kiến trúc, stack, quy trình (kèm phụ lục) | Khi task đụng vùng ADR quản lý | Claude, qua G1 |
| `COMPARISON.md` | Giao thức so sánh 2C ↔ Project-2, chỉ số đo cuối phase | Đóng phase (viết `metrics/`) | Không sửa riêng: file giống hệt ở hai repo, chỉ đổi khi Owner quyết |

## Thiết kế theo phase

| Tài liệu | Dùng để | Khi nào đọc |
|---|---|---|
| `design/phase-3-du-lieu.md` | Spec G2 Phase 3: schema, lệnh nghiệp vụ, lưu file, backup, seed | Task đụng `packages/db` |
| `design/phase-4-chi-so.md` | Spec G2 Phase 4: đếm lịch hẹn, KH theo nhóm, miền năm, chỉ số Tổng quan / Báo cáo (§4.5 quyết định G3) | Task Phase 4 |
| `design/mockups/README.md` | Mockup → màn hình / route → G3 → mục spec; mục lục mockup lớn | Task UI |
| `golden/*.md` | Spec của golden fixtures (`chi-so`, `kh-theo-nhom`, `kyc`, `lich-hen`); fixture ở `packages/domain/src/golden/` | Task đụng chỉ số / ngày / nhóm KH; không sửa khi chưa qua G2 |

## Quy trình

| Tài liệu | Dùng để | Khi nào đọc |
|---|---|---|
| `process/REVIEW-CHECKLIST.md` | Trục Standards của review | Phiên review (skill `review-pr`) |
| `agents/issue-tracker.md` | Cách viết Issue Task (nhãn, milestone, "Tài liệu cần đọc") | Khi tạo Issue (`to-tickets`) |
| `agents/domain.md` | Cách dùng `CONTEXT.md` (từ điển nghiệp vụ) + ADR | Khi gặp thuật ngữ nghiệp vụ |
| `setup/office-laptop.md` | Dựng máy mới / máy không có quyền admin | Lần đầu trên máy mới |

## Trạng thái và lịch sử

| Tài liệu | Dùng để | Khi nào đọc |
|---|---|---|
| `state/review-notes.md` | Ghi chú review không chặn: OPEN / RESOLVED / ACCEPTED | Review, hoặc task sửa đúng vùng có ghi chú OPEN |
| `state/HANDOFF.md` | Chỉ còn con trỏ sang Issue ghim | Không cần đọc |
| `reviews/<ngày>-*.md` | Tổng hợp review đóng phase, phản hồi Owner sau kiểm exe | Task sửa phát hiện review / phản hồi Owner |
| `reviews/raw/<ngày>/` | Báo cáo gốc nguyên văn (Claude + Codex) | Chỉ khi cần đối chiếu bản tổng hợp |
| `metrics/phase-<N>.md` | Chỉ số cuối mỗi phase | Đóng phase (lấy mẫu từ phase trước) |
