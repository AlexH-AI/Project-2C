# ADR-0016: Lưu trữ — sql.js ở mọi nơi, ghi file qua lệnh Rust mỏng

- **Trạng thái:** Accepted (G1/G4, Owner duyệt 26/09/2026)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §4.4; ADR-0004, ADR-0005, ADR-0006, ADR-0010; spec `docs/design/phase-3-du-lieu.md`
- **Commit / PR:** PR #58 (issue #57)

## Bối cảnh

ADR-0006 định hướng hai adapter DB: **Tauri SQLite** (app thật) và **sql.js** (trình duyệt, dev/e2e), giữ hành vi giống nhau bằng test hợp đồng chung.

Khi lập kế hoạch Phase 3 (26/09/2026) phát hiện: plugin SQL chính thức của Tauri dùng connection pool, nên `BEGIN` / các câu lệnh / `COMMIT` có thể rơi vào các kết nối khác nhau — transaction không tin cậy, rollback có thể không có tác dụng (tauri-apps/plugins-workspace#886). Nhiều thao tác nghiệp vụ bắt buộc nguyên tử: ghi kết quả cuộc gặp (sửa cuộc hẹn + thêm transition gắn `appointmentId` + đổi nhóm KH), xác nhận dữ kiện KYC (thêm dữ kiện + chuyển dữ kiện cũ sang `superseded` + tạo phiên bản).

## Quyết định

1. **Một engine duy nhất: sql.js** (SQLite biên dịch WASM) chạy trong webview cho cả exe, chế độ web, Vitest và e2e. Truy cập qua **Drizzle** (driver `sql-js`, đồng bộ).
2. **Lưu file qua lệnh Rust mỏng** trong `apps/desktop/src-tauri`, chỉ dùng `std` (không thêm crate):
   - đọc file DB lúc khởi động;
   - ghi file DB sau mỗi transaction thành công: ghi `project2c.db.tmp` rồi đổi tên đè lên `project2c.db` (không bao giờ để file ghi dở);
   - sao lưu khi khởi động vào `backups\`, giữ 10 bản mới nhất;
   - ghi file xuất `.p2cbackup` vào `exports\`.
   Thư mục: `Project2C-data\` cạnh exe (ADR-0006, portable).
3. **Chế độ web** (`pnpm dev:web`, Playwright): DB trong bộ nhớ, seed mỗi lần mở trang, không lưu.
4. **Migration**: drizzle-kit sinh file SQL; app có bộ chạy migration riêng (nhúng SQL lúc build), ghi vào bảng `schema_migrations`. Cùng một bộ chạy cho exe, web và test.
5. `packages/db` không biết Tauri: nơi lưu file là một cổng (`persist(bytes)`) do `apps/desktop` cung cấp.
6. **Dependency mới (G4):** `drizzle-orm`, `drizzle-kit` (dev), `sql.js` (+ `@types/sql.js`, dev). Không dùng `@tauri-apps/plugin-sql`, không dùng plugin dialog/fs.

## Phương án đã cân nhắc

| | sql.js ở mọi nơi (chọn) | Plugin SQL Tauri + sql.js | Lệnh Rust riêng dùng `rusqlite` |
|---|---|---|---|
| Transaction | Tin cậy (đồng bộ, một kết nối) | Không tin cậy (pool) | Tin cậy |
| Số engine phải giữ giống nhau | 1 | 2 (sqlx + sql.js) | 2 (rusqlite + sql.js) |
| Lớp Rust | ~vài chục dòng, chỉ `std` | Plugin + crate `sqlx` | Dày hơn, crate mới |
| Test bằng Vitest | Toàn bộ | Chỉ nhánh sql.js | Chỉ nhánh sql.js |
| Nhược | Ghi lại cả file mỗi lần lưu (vài MB, vài ms) | — | — |

## Lý do

Transaction tin cậy là điều kiện bắt buộc cho quy tắc nhóm KH và KYC. Một engine làm test hợp đồng hai adapter (ADR-0006) trở nên hiển nhiên đúng; lớp Rust giữ mỏng đúng ADR-0005. Dữ liệu một người dùng, quy mô 3 team × 10 RE × 12 tháng chỉ vài MB, nên ghi cả file mỗi lần lưu không đáng kể.

## Hệ quả

- ADR-0006: dòng "adapter TauriSqlite (app thật) & sql.js" đổi thành "sql.js ở mọi nơi; exe lưu file qua lệnh Rust" (phụ lục trong ADR-0006).
- File `project2c.db` là SQLite chuẩn, mở được bằng công cụ ngoài để kiểm tra.
- Nếu app bị tắt ngang giữa hai lần ghi: mất tối đa thao tác đang ghi; file trên đĩa luôn là bản trọn vẹn gần nhất.
- Không mở app trên 2 cửa sổ cùng lúc (app một cửa sổ, ADR-0004).
