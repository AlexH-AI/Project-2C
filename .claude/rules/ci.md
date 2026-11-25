---
paths:
  - ".github/**"
---

# CI (`.github/workflows/ci.yml`, ADR-0015 + phụ lục "Tiết kiệm phút Actions")

- Thay đổi chỉ gồm `docs/**` và `**/*.md`: không chạy CI, cả ở PR lẫn push lên `main`. PR docs-only merge được không cần CI. Ngoại lệ là code (danh sách chung `CODE_DOCS` trong `tools/pr-core.mjs`; bộ lọc `paths` của workflow, cả `pull_request` lẫn `push`, giữ đúng danh sách đó; mọi file dưới `docs/` mà một test đọc, `.md` hay không, phải có trong danh sách — test kiểm cả hai):
  - `CLAUDE.md` của các package có khối codemap (`CODEMAP_PACKAGES` trong `tools/codemap-core.mjs`; khối codemap do `pnpm verify` kiểm).
  - Hai tài liệu G5 mà unit test so nguyên văn với code (DR5-57): `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`. PR sửa G5 chạy CI như PR code.
  - `docs/design/mockups/ui2.css`: `packages/ui/scripts/tokens.test.ts` so khối B (token Owner duyệt ở G3) với `packages/ui/src/tokens.css`. PR sửa file này chạy CI như PR code.
- PR code (mở, push thêm, mở lại): Verify (`pnpm verify`) + e2e. Build exe chỉ khi PR có nhãn `build-exe`; `merge-pr` chặn PR đụng file cần build exe (`EXE_PATHS` trong `tools/pr-core.mjs`) mà thiếu nhãn. Cùng các file đó còn cần nhãn `build-mac` (mục "Bản macOS").
- Bước "Note the tested base" của job Verify ghi notice `Tested base` (`TESTED_BASE` trong `tools/pr-core.mjs`): SHA cha thứ nhất của commit gộp mà run test, tức bản `main` đã test cùng PR; Re-run giữ nguyên commit gộp của lần chạy đầu (DR6-57). `merge-pr` chặn khi `main` có commit code sau SHA đó (`gh pr update-branch <N>` → CI và review lại head mới, song song, ADR-0001 phụ lục M15), và khi run xanh mà không có notice (`gh pr close <N>` + `gh pr reopen <N>`). Danh sách file của PR và danh sách commit của `main` sau SHA đó đọc bằng REST có phân trang; đọc thiếu thì chặn (commit: đọc ít hơn `total_commits`, hoặc GitHub không trả số này).
- Job Verify đọc nhãn hiện tại của PR qua API ở cuối job (T-063). Gắn `build-exe` sau khi Verify đã qua bước đó thì CI không chạy lại (không nghe sự kiện `labeled`): push thêm hoặc `gh pr close` + `gh pr reopen`.
- Push lên `main` (sau merge): bỏ Verify, chỉ build exe → artifact `Project-2C-<sha>` gồm `project2c.exe` (exe chạy thẳng; chế độ portable khi có `Project2C-data\` cạnh exe) và file cài NSIS theo người dùng `*-setup.exe`, cùng một lần `pnpm build:installer` (ADR-0019 §5).
- Chạy tay (`workflow_dispatch`): Verify + build exe.
- Push mới lên cùng nhánh hủy run cũ đang chạy (`concurrency`).
- `timeout-minutes`: Verify 75 (run xanh dài nhất tới 14/11/2026: 39 phút), build exe 45 (cache Rust nguội dựng lại mọi crate). Một test quay vòng mãi làm job đỏ ở mốc đó, không giữ tới 6 giờ của GitHub (CLR6-I3, T-428).
- Đổi base PR xếp chồng không chạy lại CI (workflow nghe `opened/synchronize/reopened`).
- Sửa workflow: giữ tiết kiệm phút (không thêm job chạy mọi PR khi không cần). Mỗi `uses:` ghim SHA 40 ký tự + comment bản (`# v7.0.1`); cập nhật mỗi phase (ADR-0015, phụ lục T-101).

## Bản macOS (`.github/workflows/macos.yml`, T-413)

- Chạy ở PR có nhãn `build-mac` (sự kiện `synchronize`, `labeled`: gắn chính nhãn `build-mac`, kể cả lúc tạo PR, là chạy một lần) và chạy tay (`gh workflow run macos.yml --ref main`, artifact cho Owner thử). PR không có nhãn: run bị bỏ qua, không tốn phút. Không chạy khi push.
- Job `Build macOS app (Apple chip)` (`MAC_CHECK`):
  - `cargo fmt --check`, clippy `-D warnings`, unit test Rust trên macOS (code `cfg(not(windows))` chỉ được kiểm ở đây);
  - `build:mac` của `apps/desktop`: `Heritas L-CRM.app` cho chip Apple, ký ad-hoc, trong `.dmg`; kiểm quyền của webview như bản exe (`tools/check-capabilities.mjs`);
  - kiểm app: `codesign --verify --deep --strict`, `Signature=adhoc`, chỉ arm64, `LSMinimumSystemVersion` 26.0, `CFBundleLocalizations` vi, en, định danh và phiên bản trùng `tauri.conf.json`;
  - kiểm `.dmg`: đúng một file, `hdiutil verify`, mount: app trong ổ ký hợp lệ, lối tắt `Applications` trỏ `/Applications`;
  - artifact `Heritas-L-CRM-macos-<SHA head>` là file `.dmg`. Bản macOS của runner ghi ở tóm tắt run.
- Job `E2E (WebKit, macOS)` (Mac-7, ADR-0019 §9): cùng điều kiện chạy, song song với job build, không cần Rust.
  - Cài WebKit của Playwright (`pnpm exec playwright install webkit`, bản theo Playwright ghim ở `pnpm-lock.yaml`), rồi `PW_WEBKIT=1 pnpm exec playwright test --project webkit` (`e2e/serve.mjs` build web trước). Tóm tắt e2e (qua, flaky, đỏ, bỏ qua) ở trang run; artifact `e2e-report-webkit-<SHA head>` khi đỏ hay có ca flaky.
  - Số worker không ghim (trên CI Playwright để mặc định, nửa số lõi của runner): 2 worker ≈ 7 phút, 1 worker 21–28 phút (9 run 16–17/11/2026). Job build 2–6 phút, nên PR `build-mac` chủ yếu chờ job này.
  - `merge-pr` không đòi check này theo tên như `MAC_CHECK`: nó tính như mọi check của head (đỏ, bị hủy hay đang chạy thì chặn).
- **Nhãn `build-mac` bắt buộc** (Mac-6; ADR-0019 §8, Q6) khi PR đụng file cần build exe (`EXE_PATHS`) hoặc `.github/workflows/macos.yml` (`needsMac` trong `tools/pr-core.mjs`): v1.0 phát hành cả hai nền tảng, và code `cfg(not(windows))` chỉ được kiểm ở đây. Gắn lúc tạo, cùng `build-exe`. `merge-pr` / `pr-status` chặn khi:
  - thiếu nhãn: `gh pr edit <N> --add-label build-mac`. Gắn nhãn là build ngay, không cần đóng / mở lại PR; head không đổi nên `REVIEW: PASS` vẫn còn giá trị;
  - có nhãn mà head chưa có check `Build macOS app (Apple chip)` (`MAC_CHECK`) nào;
  - có nhãn mà mọi check đó trên head đều bị bỏ qua: push thêm, hoặc gỡ rồi gắn lại nhãn (`gh pr edit <N> --remove-label build-mac`, rồi `--add-label build-mac`). Đóng / mở lại PR không build bản Mac.

  Một check `MAC_CHECK` xanh trên head là đủ: các check cùng tên bị bỏ qua (run của push hay nhãn khác) không chặn. Check đỏ, bị hủy hay đang chạy thì chặn như mọi check của head.
- Repo chuyển sang private (ADR-0019 §8: phút macOS tính ×10): bỏ bắt buộc `build-mac`, chỉ chạy tay `macos.yml` trước khi merge PR chỉ của Mac và trước G7. Repo đang public, phút miễn phí: chỉ ghi điều kiện, chưa làm.
- Không nghe `opened`: PR tạo kèm `build-mac` có cả sự kiện `labeled` của nhãn, nghe cả hai thì build hai lần (PR #1219). Không nghe `reopened`: `gh pr close` + `gh pr reopen` để chạy lại CI, không dựng lại bản Mac. Mỗi push và mỗi nhãn của mọi PR vẫn tạo một run của workflow này (bị bỏ qua khi thiếu nhãn): `auto-wait` chỉ lấy run của `ci.yml` làm kết quả CI (T-428), còn phép "còn run đang chạy" vẫn chờ mọi run; một check đỏ của head (kể cả check Mac) thì `auto-wait ci` báo đỏ ngay, không chờ run còn lại (ADR-0001 phụ lục M15), trừ khi chờ run mới của PR mở lại (`--since`: check đỏ của run trước còn trên head). Không `concurrency` hủy run cũ: `merge-pr` tính check bị hủy là đỏ. Chạy lại trên cùng head: Re-run ở trang run, hoặc push thêm.

## Phát hành hai nền tảng từ một SHA (ADR-0019 §8)

- GitHub Release (v1.0, ở G7) gồm bản Windows, bản macOS và hướng dẫn sử dụng, build từ cùng một SHA của `main`.
- Bản Windows: file cài NSIS (`*-setup.exe`) trong artifact của job build exe, run CI của push lên `main` ở SHA đó (`Project-2C-<sha>`). Bản phát hành chỉ có file cài; `project2c.exe` cùng artifact dùng cho nghiệm thu và thử (ADR-0019 §5). Push chỉ sửa docs không chạy CI, nên SHA đó chưa có bản Windows: `gh workflow run ci.yml --ref main`.
- Bản macOS: `gh workflow run macos.yml --ref main` khi `main` vẫn ở SHA đó → file `.dmg` trong artifact `Heritas-L-CRM-macos-<SHA>`.
- Kiểm SHA của run macOS trùng SHA của bản Windows (`gh run list --workflow macos.yml --event workflow_dispatch --limit 1 --json headSha,conclusion`, và SHA trong tên hai artifact). Lệch (`main` có commit giữa hai lần build) thì không phát hành cặp đó: build lại cả hai trên `main` mới.
