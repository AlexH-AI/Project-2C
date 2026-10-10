---
paths:
  - ".github/**"
---

# CI (`.github/workflows/ci.yml`, ADR-0015 + phụ lục "Tiết kiệm phút Actions")

- Thay đổi chỉ gồm `docs/**` và `**/*.md`: không chạy CI, cả ở PR lẫn push lên `main`. PR docs-only merge được không cần CI. Ngoại lệ là code (danh sách chung `CODE_DOCS` trong `tools/pr-core.mjs`; bộ lọc `paths` của workflow, cả `pull_request` lẫn `push`, giữ đúng danh sách đó — test kiểm):
  - `CLAUDE.md` của các package có khối codemap (`CODEMAP_PACKAGES` trong `tools/codemap-core.mjs`; khối codemap do `pnpm verify` kiểm).
  - Hai tài liệu G5 mà unit test so nguyên văn với code (DR5-57): `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`. PR sửa G5 chạy CI như PR code.
- PR code (mở, push thêm, mở lại): Verify (`pnpm verify`) + e2e. Build exe chỉ khi PR có nhãn `build-exe`; `merge-pr` chặn PR đụng file cần build exe (`EXE_PATHS` trong `tools/pr-core.mjs`) mà thiếu nhãn.
- Job Verify đọc nhãn hiện tại của PR qua API ở cuối job (T-063). Gắn `build-exe` sau khi Verify đã qua bước đó thì CI không chạy lại (không nghe sự kiện `labeled`): push thêm hoặc `gh pr close` + `gh pr reopen`.
- Push lên `main` (sau merge): bỏ Verify, chỉ build exe → artifact `Project-2C-<sha>`.
- Chạy tay (`workflow_dispatch`): Verify + build exe.
- Push mới lên cùng nhánh hủy run cũ đang chạy (`concurrency`).
- Đổi base PR xếp chồng không chạy lại CI (workflow nghe `opened/synchronize/reopened`).
- Sửa workflow: giữ tiết kiệm phút (không thêm job chạy mọi PR khi không cần). Mỗi `uses:` ghim SHA 40 ký tự + comment bản (`# v7.0.1`); cập nhật mỗi phase (ADR-0015, phụ lục T-101).
