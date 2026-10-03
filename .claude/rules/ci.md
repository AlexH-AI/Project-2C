---
paths:
  - ".github/**"
---

# CI (`.github/workflows/ci.yml`, ADR-0015 + phụ lục "Tiết kiệm phút Actions")

- Thay đổi chỉ gồm `docs/**` và `**/*.md`: không chạy CI, cả ở PR lẫn push lên `main`. PR docs-only merge được không cần CI.
- PR code (mở, push thêm, mở lại): Verify (`pnpm verify`) + e2e. Build exe chỉ khi PR có nhãn `build-exe`.
- Job Verify đọc nhãn hiện tại của PR qua API ở cuối job (T-063). Gắn `build-exe` sau khi Verify đã qua bước đó thì CI không chạy lại (không nghe sự kiện `labeled`): push thêm hoặc `gh pr close` + `gh pr reopen`.
- Push lên `main` (sau merge): bỏ Verify, chỉ build exe → artifact `Project-2C-<sha>`.
- Chạy tay (`workflow_dispatch`): Verify + build exe.
- Push mới lên cùng nhánh hủy run cũ đang chạy (`concurrency`).
- Đổi base PR xếp chồng không chạy lại CI (workflow nghe `opened/synchronize/reopened`).
- Sửa workflow: giữ tiết kiệm phút (không thêm job chạy mọi PR khi không cần). Ghim SHA Actions đang chờ ở #257 T-101.
