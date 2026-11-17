---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.test.mjs"
  - "e2e/**"
---

# Test

- TDD (skill `tdd`): test đỏ → code → test xanh. Test chấp nhận trong Issue là seam đã thống nhất, không hỏi lại.
- Test kiểm hành vi bên ngoài, không kiểm chi tiết cài đặt. Có test cho nhánh lỗi / biên (ngày không hợp lệ, 29/02, số âm, danh sách rỗng, biên năm…).
- **Golden fixtures** (`packages/domain/src/golden/`, spec ở `docs/golden/`) là test bắt buộc: không sửa để "cho xanh"; muốn đổi phải qua Owner (G2).
- DB trong test: `setup()` ở `packages/db/src/test-support.ts` (DB trong bộ nhớ, đồng hồ ghim, sẵn một team + RM + TL) và `codeOf()` để bắt mã `DbError`; không tự dựng schema.
- `packages/domain` giữ coverage ≥ 95% (`pnpm test:coverage` nằm trong `pnpm verify`).
- E2E: Playwright chạy trên bản build web (`pnpm e2e`, Microsoft Edge có sẵn), dữ liệu từ seed giả lập. Chọn phần tử theo role / nhãn i18n, không theo class CSS.
  - Project `webkit` (`devices['Desktop Safari']`) chỉ có khi `PW_WEBKIT=1`, chỉ chạy trong `macos.yml` trên Mac (ADR-0019 §9; `pnpm e2e` và `ci.yml` không chạy). WebKit của Playwright gần WKWebView của app macOS nhưng không phải nó: app thật kiểm tay ở các dòng NT-MAC.
  - Chỗ macOS khác Windows dùng hàm của `e2e/support.ts`: `tabKey` (Option+Tab, vì Tab của macOS chỉ dừng ở ô nhập khi chưa bật Keyboard navigation), `endKey` (⌘↓ thay Ctrl+End), `pressButton` (nhấn Enter, vì bấm chuột trên macOS không đưa focus vào nút), `gotoScreen` (không `goto` lại địa chỉ đang mở, vì WebKit tải lại trang và mất dữ liệu trong bộ nhớ của bản web). Hành vi khác mà vẫn kiểm được thì rẽ nhánh theo `browserName`, có chú thích (`e2e/appointments.spec.ts`: mũi tên mở danh sách của ô chọn).
  - Ca dùng API chỉ Chromium có (CDP) bỏ qua trên WebKit bằng `test.skip(browserName === 'webkit', '<lý do>')`. Bước mà WebKit của Playwright làm khác app bỏ bằng `step.skip` có lý do, kèm dòng NT-MAC kiểm tay (`e2e/dialog-keyboard.spec.ts`, NT-MAC-14).
- `tools/*.mjs`: logic thuần tách ra file `*-core.mjs` có test; phần I/O (`gh`, `git`) không bắt buộc unit test. Khi cần (phân trang REST, cách đọc kết quả `gh`…) thì giả `run` của `tools/session-io.mjs` bằng `vi.mock`, như `tools/pr-status.test.mjs`.
