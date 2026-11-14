# packages/db — dữ liệu: schema, migration, lệnh đọc / ghi

Drizzle trên sql.js ở mọi nơi (ADR-0016): một DB SQLite trong bộ nhớ, `persist(bytes)` ghi cả file sau mỗi transaction thành công. Spec dữ liệu: `docs/design/phase-3-du-lieu.md`.

## Ranh giới

- Chỉ phụ thuộc `@p2c/domain` và đúng module schema của ai (`@p2c/ai/schema`, để kiểm output AI khi nhập backup — ADR-0006 phụ lục; rule `db-only-on-domain-and-ai-schema`); không import `ui`, `apps`, module khác của `ai`.
- Public API qua `src/index.ts` (`@p2c/db`); app không import file con.

## File hay tìm

- Schema: `src/schema.ts` → `pnpm db:generate` sinh `migrations/*.sql`. **Không sửa tay migration đã sinh**; thêm một dòng vào `src/migrations.ts` cho file mới (test so với journal của drizzle-kit). Ngoại lệ đã duyệt (lý do ở đầu file, không làm mẫu): `0013` (`CASE` khi chép), `0015` (bản sinh hỏng → `RENAME COLUMN`; snapshot giữ nó).
- Migration "dựng lại bảng" của drizzle-kit (copy → drop → rename, để thêm CHECK) chạy được trên DB có dữ liệu: `migrate()` tắt khóa ngoại trước BEGIN và chạy `foreign_key_check` sau mỗi migration, như nhập backup. Drop bảng cũ làm mất trigger của nó → thêm migration tự viết tạo lại trigger (mẫu: `0008` sau `0007`). Migration đổi schema nên có test mở DB cũ **có dữ liệu** (mẫu: "migrating a saved database" trong `src/database.test.ts`).
- Trigger của `0011_trash_purge.sql` (`*_no_delete` của `kyc_notes`, `kyc_facts`, `ai_analyses`) đọc bảng `customers` để Dọn sạch xóa dòng của KH đã xóa mềm. Vì vậy migration "dựng lại bảng" `customers` hỏng ở RENAME ("no such table: main.customers"): migration tự viết trong cùng transaction phải DROP ba trigger trước rồi tạo lại sau (mẫu: `0011`).
- Mở DB: `src/database.ts` · lỗi: `src/errors.ts` (`DbError` + mã; UI dịch mã qua i18n).
- `openDatabase` bật `foreign_keys` và `recursive_triggers` mỗi lần mở và sau `export` (sql.js mở lại kết nối): thiếu `recursive_triggers`, `INSERT OR REPLACE` xóa dòng cũ mà không chạy trigger xóa: sửa được dòng chỉ thêm của KH đang dùng (DR6-113); trigger chỉ `RAISE`, không đệ quy.
- Cột trỏ tới nhân sự (`rm_id` của KH / lịch / HĐ, người phối hợp, người đánh giá): **một danh sách** `PERSON_REFERENCES` (`src/person-references.ts`), mà `personUsage` (hộp 9b, lệnh xóa / đổi vai trò), Thùng rác, Dọn sạch và luật nhập 5 đều đọc. Thêm cột: một kind ở đó và người nó trỏ tới (`POINTS_TO`: `ownsRecords`, luật 5 đọc), field đếm nó (`USAGE_FIELDS`, `src/team.ts`); kiểu và `src/person-references.test.ts` báo khi thiếu.
- Lệnh theo thực thể: `team.ts`, `customers.ts`, `appointments.ts`, `policies.ts`, `kyc.ts`; helper chung `common.ts`; ULID `ids.ts`.
- Dữ liệu cho chỉ số: app đọc các bảng một lần mỗi revision (`apps/desktop/src/data/tables.ts`), chỉ số tính trong bộ nhớ bằng `domain`.
- Sao lưu `.p2cbackup`: `src/backup.ts` + kiểm khi nhập `src/backup-validation.ts`.
- Dữ liệu giả lập: `src/seed.ts` + `src/seed-data.ts` (danh sách, trọng số). Không có thư mục `tools/seed*`.
- Test: `setup()` / `codeOf()` ở `src/test-support.ts` (DB bộ nhớ, đồng hồ ghim, sẵn team + RM + TL); không tự dựng schema.

## Quy ước

- Mỗi lệnh là một transaction; từ chối thì ném `DbError` và DB không đổi.
- Xóa là xóa mềm (`deleted_at`), có `restore*`; chỉ Dọn sạch Thùng rác (`src/purge.ts`, spec Phase 6 TR-11) xóa hẳn. Ngày lưu dạng `yyyy-mm-dd`, tiền là số nguyên theo đơn vị nhỏ nhất của tiền tệ của DB (khóa `currency` của `settings`, `getCurrency`; ADR-0018 §2, §3) — chuyển đổi qua `common.ts` / `domain`.
- Dữ liệu là giả lập: luật chặt hơn thì từ chối / bỏ dữ liệu cũ không hợp lệ, không viết migration dữ liệu (quyết định 02/10; ngoại lệ `0013`, và `0016` ghi `currency = "VND"` cho DB / backup cũ: ngoại lệ có chủ ý, ADR-0018 §7, Owner duyệt Q12).

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/` — ai-analyses.ts, appointments.ts, backup-validation.ts, backup.ts, common.ts, counts.ts, customers.ts, database.ts, errors.ts, ids.ts, index.ts, kyc.ts, migrations.ts, person-references.ts, policies.ts, purge.ts, schema.ts, seed-data.ts, seed.ts, settings.ts, team.ts, test-support.ts, trash.ts
<!-- codemap:end -->
