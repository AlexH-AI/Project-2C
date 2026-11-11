---
paths:
  - ".github/**"
---

# CI (`.github/workflows/ci.yml`, ADR-0015 + phụ lục "Tiết kiệm phút Actions")

- Thay đổi chỉ gồm `docs/**` và `**/*.md`: không chạy CI, cả ở PR lẫn push lên `main`. PR docs-only merge được không cần CI. Ngoại lệ là code (danh sách chung `CODE_DOCS` trong `tools/pr-core.mjs`; bộ lọc `paths` của workflow, cả `pull_request` lẫn `push`, giữ đúng danh sách đó — test kiểm):
  - `CLAUDE.md` của các package có khối codemap (`CODEMAP_PACKAGES` trong `tools/codemap-core.mjs`; khối codemap do `pnpm verify` kiểm).
  - Hai tài liệu G5 mà unit test so nguyên văn với code (DR5-57): `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`. PR sửa G5 chạy CI như PR code.
- PR code (mở, push thêm, mở lại): Verify (`pnpm verify`) + e2e. Build exe chỉ khi PR có nhãn `build-exe`; `merge-pr` chặn PR đụng file cần build exe (`EXE_PATHS` trong `tools/pr-core.mjs`) mà thiếu nhãn.
- Bước "Note the tested base" của job Verify ghi notice `Tested base` (`TESTED_BASE` trong `tools/pr-core.mjs`): SHA cha thứ nhất của commit gộp mà run test, tức bản `main` đã test cùng PR; Re-run giữ nguyên commit gộp của lần chạy đầu (DR6-57). `merge-pr` chặn khi `main` có commit code sau SHA đó (`gh pr update-branch <N>` → CI → review lại), và khi run xanh mà không có notice (`gh pr close <N>` + `gh pr reopen <N>`). Danh sách file của PR và danh sách commit của `main` sau SHA đó đọc bằng REST có phân trang; đọc thiếu thì chặn (commit: đọc ít hơn `total_commits`, hoặc GitHub không trả số này).
- Job Verify đọc nhãn hiện tại của PR qua API ở cuối job (T-063). Gắn `build-exe` sau khi Verify đã qua bước đó thì CI không chạy lại (không nghe sự kiện `labeled`): push thêm hoặc `gh pr close` + `gh pr reopen`.
- Push lên `main` (sau merge): bỏ Verify, chỉ build exe → artifact `Project-2C-<sha>`.
- Chạy tay (`workflow_dispatch`): Verify + build exe.
- Push mới lên cùng nhánh hủy run cũ đang chạy (`concurrency`).
- Đổi base PR xếp chồng không chạy lại CI (workflow nghe `opened/synchronize/reopened`).
- Sửa workflow: giữ tiết kiệm phút (không thêm job chạy mọi PR khi không cần). Mỗi `uses:` ghim SHA 40 ký tự + comment bản (`# v7.0.1`); cập nhật mỗi phase (ADR-0015, phụ lục T-101).

## Bản macOS (`.github/workflows/macos.yml`, T-413)

- Chạy ở PR có nhãn `build-mac` (sự kiện `opened`, `synchronize`, `labeled`: gắn chính nhãn `build-mac` là chạy) và chạy tay (`gh workflow run macos.yml --ref main`, artifact cho Owner thử). PR không có nhãn: run bị bỏ qua, không tốn phút. Không chạy khi push.
- Bước: `cargo fmt --check`, clippy `-D warnings`, unit test Rust trên macOS (code `cfg(not(windows))` chỉ được kiểm ở đây), build `Heritas L-CRM.app` cho chip Apple ký ad-hoc, `codesign --verify --deep --strict`, nén bằng `ditto` → artifact `Heritas-L-CRM-macos-<SHA head>`. Bản macOS của runner ghi ở tóm tắt run.
- PR đụng code hay cấu hình chỉ của macOS (`cfg(not(windows))`, `tauri.macos.conf.json`, `macos.yml`) gắn `build-mac` lúc tạo, cùng `build-exe`. `merge-pr` không đòi nhãn này hay run này (K49 không đổi công cụ pipeline), nhưng check của run trên head tính như mọi check (đỏ hay đang chạy thì chặn): review kiểm run `macos.yml` xanh ở đúng `headRefOid`.
- Không nghe `reopened`: sau `gh pr close` + `gh pr reopen`, `auto-wait --since` đọc run `pull_request` mới nhất của PR là run CI, mà run (bị bỏ qua) của workflow này có thể mới hơn. Không `concurrency` hủy run cũ: `merge-pr` tính check bị hủy là đỏ. Chạy lại trên cùng head: Re-run ở trang run, hoặc push thêm.
