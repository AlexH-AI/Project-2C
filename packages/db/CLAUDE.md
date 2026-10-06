# packages/db — dữ liệu: schema, migration, lệnh đọc / ghi

Drizzle trên sql.js ở mọi nơi (ADR-0016): một DB SQLite trong bộ nhớ, `persist(bytes)` ghi cả file sau mỗi transaction thành công. Spec dữ liệu: `docs/design/phase-3-du-lieu.md`.

## Ranh giới

- Chỉ phụ thuộc `@p2c/domain` (rule `db-and-ai-only-on-domain`); không import `ui`, `ai`, `apps`.
- Public API qua `src/index.ts` (`@p2c/db`); app không import file con.

## File hay tìm

- Schema: `src/schema.ts` → `pnpm db:generate` sinh `migrations/*.sql`. **Không sửa tay migration đã sinh**; thêm một dòng vào `src/migrations.ts` cho file mới (test so với journal của drizzle-kit).
- Migration "dựng lại bảng" của drizzle-kit (copy → drop → rename, để thêm CHECK) chạy được trên DB có dữ liệu: `migrate()` tắt khóa ngoại trước BEGIN và chạy `foreign_key_check` sau mỗi migration, như nhập backup. Migration đổi schema nên có test mở DB cũ **có dữ liệu** (mẫu: "migrating a saved database" trong `src/database.test.ts`).
- Mở DB: `src/database.ts` (`openDatabase`) · lỗi: `src/errors.ts` (`DbError` + mã; UI dịch mã qua i18n).
- Lệnh theo thực thể: `src/team.ts`, `src/customers.ts`, `src/appointments.ts`, `src/policies.ts`, `src/kyc.ts`; helper chung `src/common.ts`; ULID `src/ids.ts`.
- Dữ liệu cho chỉ số: `src/metrics.ts` (`loadMetricsData`, chỉ số tính trong bộ nhớ bằng `domain`).
- Sao lưu `.p2cbackup`: `src/backup.ts` + kiểm khi nhập `src/backup-validation.ts`.
- Dữ liệu giả lập: `src/seed.ts` (logic) + `src/seed-data.ts` (danh sách, trọng số). Không có thư mục `tools/seed*`.
- Test: `setup()` / `codeOf()` ở `src/test-support.ts` (DB bộ nhớ, đồng hồ ghim, sẵn team + RE + TL); không tự dựng schema.

## Quy ước

- Mỗi lệnh chạy trong một transaction; từ chối thì ném `DbError` và DB không đổi.
- Xóa là xóa mềm (`deleted_at`), có `restore*`. Ngày lưu dạng `yyyy-mm-dd`, tiền là số nguyên đồng — chuyển đổi qua `common.ts` / `domain`.
- Dữ liệu là giả lập: luật chặt hơn thì từ chối / bỏ dữ liệu cũ không hợp lệ, không viết migration dữ liệu (quyết định 02/10).

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/appointments.ts` — type AppointmentTrigger, type AppointmentRecord, type NewAppointment, type MeetingOutcome, type NextAppointment, type AppointmentDetails, listAppointments, getAppointment, scheduleAppointment, recordMeetingOutcome, recordOutcomeWithNext, updateAppointmentDetails, editMeetingOutcome, rescheduleAppointment, softDeleteAppointment, restoreAppointment
- `src/backup-validation.ts` — validateBackupValues, validateBackupInvariants, dataTables
- `src/backup.ts` — BACKUP_FORMAT, MAX_BACKUP_BYTES, type ImportedBackup, exportBackup, importBackup
- `src/common.ts` — cleanText, requireName, optionalText, stampDeleted, toIsoDate, fromIsoDate, today, toPastIsoDate, nextSeq, isFee, requireAmount, requireRe, prepared, rowInsert, liveCustomer
- `src/customers.ts` — type Gender, type BirthDate, type CustomerRecord, type CustomerProfile, type NewCustomer, listCustomers, getCustomer, listStageTransitions, createCustomer, updateCustomerProfile, previewCustomerProfile, changeStageManually, softDeleteCustomer, restoreCustomer, liveCustomer, appendTransition, withdrawAppointmentTransition
- `src/database.ts` — type OpenDatabaseOptions, type Sources, type Database, openDatabase, assertSupported, migrate
- `src/errors.ts` — DB_ERROR_CODES, type DbErrorCode, DbError
- `src/ids.ts` — CROCKFORD_BASE32, type RandomFill, cryptoFill, ulid, encodeBase32
- `src/index.ts` — re-exports ./database, ./migrations, ./backup, ./errors, ./team, ./customers, ./appointments, ./policies, ./kyc, ./metrics, ./seed, ./schema
- `src/kyc.ts` — type KycSource, type KycNoteRecord, type KycProfileRecord, type KycVersionRecord, type KycFactCommand, type KycChange, getKycProfile, listKycVersions, addKycNote, type KycNoteFact, recordKycNote, confirmKycFact, markKycConflict, resolveKycConflict, markKycVersionMaterial, type ProfileFields, recordProfileFacts, type ProfileKycPreview, previewProfileFacts, profileFactValue, normalizeKycValue
- `src/metrics.ts` — loadMetricsData
- `src/migrations.ts` — type Migration, MIGRATIONS, latestVersion, LATEST_SCHEMA_VERSION
- `src/policies.ts` — type NewPolicy, type PolicyChanges, listPolicies, getPolicy, submitPolicy, issuePolicy, updatePolicy, softDeletePolicy, restorePolicy
- `src/schema.ts` — teams, people, settings, schemaMigrations, CUSTOMER_STAGES, GENDERS, APPOINTMENT_TRIGGERS, customers, appointments, appointmentCoordinators, stageTransitions, policies, KYC_NOTE_SOURCES, kycNotes, kycFacts, kycVersions
- `src/seed-data.ts` — type Weighted, STARTING_STAGES, BIRTH_DATE_KINDS, OUTCOMES, MOVES, TRIGGERS, TEAM_NAMES, FAMILY_NAMES, MIDDLE_NAMES, GIVEN_NAMES, APPOINTMENT_TIMES, TRIGGER_NOTES, NEXT_STEPS, MEETING_NOTES, CASE_SIZES_MILLION, KYC_TOPICS, KYC_VALUES
- `src/seed.ts` — type SeedOptions, seedDemoData
- `src/team.ts` — listTeams, getTeam, listPeople, getPerson, createTeam, renameTeam, softDeleteTeam, restoreTeam, type PersonInput, createPerson, updatePerson, softDeletePerson, restorePerson
- `src/test-support.ts` — setup, errorOf, codeOf, d
<!-- codemap:end -->
