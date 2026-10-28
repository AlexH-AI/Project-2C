# Tài liệu Project-2C — đọc gì, khi nào

Quy tắc làm việc nằm ở `CLAUDE.md` (gốc repo) và `.claude/rules/` (nạp theo đường dẫn). Trạng thái phiên (HANDOFF) là Issue ghim nhãn `handoff`, không nằm trong `docs/`. Bảng dưới liệt kê mọi tài liệu trong `docs/`; phiên làm task chỉ đọc những gì mục "Tài liệu cần đọc" của Issue chỉ ra.

## Kế hoạch và quyết định

| Tài liệu | Dùng để | Khi nào đọc | Ai sửa |
|---|---|---|---|
| `PROJECT-PLAN.md` | Kế hoạch tổng: quy trình một agent (§4.1), liên tục giữa 2 máy (§4.2), tech stack (§4.4), lộ trình phase (§5) | Viết Issue / mở phase mới | Claude, qua G1 |
| `PROJECT-STATE.md` | Phase hiện tại + "Current OWNER decisions" (quyết định bền theo ngày) | Khi cần biết Owner đã chốt gì | Claude ghi lại quyết định Owner |
| `decisions/README.md` + `decisions/00xx-*.md` | ADR: kiến trúc, stack, quy trình (kèm phụ lục) | Khi task đụng vùng ADR quản lý | Claude, qua G1 |
| `COMPARISON.md` | Giao thức so sánh 2C ↔ Project-2 — **hết hiệu lực 11/10/2026** (ADR-0002 Superseded); bảng chỉ số vẫn là mẫu đo cuối phase | Đóng phase (viết `metrics/`) | Lịch sử; không còn phải giống hệt Project-2 |

## Thiết kế theo phase

| Tài liệu | Dùng để | Khi nào đọc |
|---|---|---|
| `design/phase-3-du-lieu.md` | Spec G2 Phase 3: schema, lệnh nghiệp vụ, lưu file, backup, seed | Task đụng `packages/db` |
| `design/phase-4-chi-so.md` | Spec G2 Phase 4: đếm lịch hẹn, KH theo nhóm, miền năm, chỉ số Tổng quan / Báo cáo (§4.5 quyết định G3) | Task Phase 4 |
| `design/phase-5-ai.md` | Spec G1 / G2 Phase 5: luồng AI, Settings, lệnh Rust, schema output, validator, mức bằng chứng, `ai_analyses`, AI trích xuất | Task Phase 5 |
| `design/phase-6-hoan-thien.md` | Spec G1 Phase 6: việc còn lại, tính năng tới v1.0, kiểm thử phát hành, 4 lượt deep review Phase 1–6 × 6 gói (lượt 1 ba agent; lượt 2 và 3 Claude + Codex; lượt 4 Claude + Codex + DeepSeek; gồm phân tích bloat / hiệu năng), tiêu chí v1.0 | Task Phase 6 |
| `design/phase-5-prompts.md` | G5 Phase 5: chữ prompt (nay `analysis@4` / `discovery@4` / `extraction@1`; §10, §11, §12 là ba đợt G5 sau), message thử lại, danh sách chặn V3–V6 + ca kiểm | Task validator / prompt Phase 5 |
| `design/mockups/README.md` | Mockup → màn hình / route → G3 → mục spec; mục lục mockup lớn | Task UI |
| `golden/*.md` | Spec của golden fixtures (`chi-so`, `kh-theo-nhom`, `kyc`, `lich-hen`); fixture ở `packages/domain/src/golden/` | Task đụng chỉ số / ngày / nhóm KH; không sửa khi chưa qua G2 |

## Quy trình

| Tài liệu | Dùng để | Khi nào đọc |
|---|---|---|
| `process/REVIEW-CHECKLIST.md` | Trục Standards của review | Phiên review (skill `review-pr`) |
| `process/deep-review-phase-1-4.md` | Kế hoạch deep codebase review Phase 1–4 trước G7 (G1): gói, trục kiểm, định dạng phát hiện, prompt Codex | Mở / chạy / tổng hợp đợt deep review |
| `process/deep-review-phase-1-6.md` | Kế hoạch deep review Phase 1–6 (6D, 6 gói, 4 lượt: lượt 1 ba bên; lượt 2 và 3 Claude + Codex; lượt 4 Claude + Codex + DeepSeek): SHA ghim, gói, trục (gồm bloat / hiệu năng), KNOWN, số đo nền, cấu hình Muse, cấu hình chặn của DeepSeek, prompt nguyên văn từng bên | Chạy / tổng hợp bốn lượt deep review Phase 6 (T-222…T-225, T-266, T-267, T-309) |
| `agents/issue-tracker.md` | Cách viết Issue Task (nhãn, milestone, "Tài liệu cần đọc") | Khi tạo Issue (`to-tickets`) |
| `agents/domain.md` | Cách dùng `CONTEXT.md` (từ điển nghiệp vụ) + ADR | Khi gặp thuật ngữ nghiệp vụ |
| `setup/office-laptop.md` | Dựng máy mới / máy không có quyền admin | Lần đầu trên máy mới |
| `testing/nghiem-thu-v1.md` | Danh sách nghiệm thu v1.0 của Owner: từng màn / hộp theo mockup, exe trên máy thật, độ bền dữ liệu; mã dòng `NT-…` | Lượt thử 6C, G7; Issue lỗi nghiệm thu trỏ mã dòng |

## Trạng thái và lịch sử

| Tài liệu | Dùng để | Khi nào đọc |
|---|---|---|
| `state/review-notes.md` | Ghi chú review không chặn: OPEN / RESOLVED / ACCEPTED | Review, hoặc task sửa đúng vùng có ghi chú OPEN |
| `state/HANDOFF.md` | Chỉ còn con trỏ sang Issue ghim | Không cần đọc |
| `reviews/<ngày>-*.md` | Tổng hợp review đóng phase, phản hồi Owner sau kiểm exe | Task sửa phát hiện review / phản hồi Owner |
| `reviews/raw/<ngày>/` | Báo cáo gốc nguyên văn (Claude + Codex) | Chỉ khi cần đối chiếu bản tổng hợp |
| `metrics/phase-<N>.md` | Chỉ số cuối mỗi phase | Đóng phase (lấy mẫu từ phase trước) |
| `metrics/README.md` | Chỉ số điều hướng riêng của 2C (dò trước lần sửa đầu, HANDOFF) + lệnh đo `tools/retro.mjs` | Đóng phase |
