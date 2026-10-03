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
- DB trong test: `setup()` ở `packages/db/src/test-support.ts` (DB trong bộ nhớ, đồng hồ ghim, sẵn một team + RE + TL) và `codeOf()` để bắt mã `DbError`; không tự dựng schema.
- `packages/domain` giữ coverage ≥ 95% (`pnpm test:coverage` nằm trong `pnpm verify`).
- E2E: Playwright chạy trên bản build web (`pnpm e2e`, Microsoft Edge có sẵn), dữ liệu từ seed giả lập. Chọn phần tử theo role / nhãn i18n, không theo class CSS.
- `tools/*.mjs`: logic thuần tách ra file `*-core.mjs` có test; phần I/O (`gh`, `git`) không unit test.
