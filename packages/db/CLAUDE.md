# packages/db — dữ liệu: schema, migration, lệnh đọc / ghi

Drizzle trên sql.js ở mọi nơi (ADR-0016): một DB SQLite trong bộ nhớ, `persist(bytes)` ghi cả file sau mỗi transaction thành công. Spec dữ liệu: `docs/design/phase-3-du-lieu.md`.

## Ranh giới

- Chỉ phụ thuộc `@p2c/domain` và đúng module schema của ai (`@p2c/ai/schema`, để kiểm output AI khi nhập backup — ADR-0006 phụ lục 07/10/2026; rule `db-only-on-domain-and-ai-schema`); không import `ui`, `apps`, module khác của `ai`.
- Public API qua `src/index.ts` (`@p2c/db`); app không import file con.

## File hay tìm

- Schema: `src/schema.ts` → `pnpm db:generate` sinh `migrations/*.sql`. **Không sửa tay migration đã sinh**; thêm một dòng vào `src/migrations.ts` cho file mới (test so với journal của drizzle-kit).
- Migration "dựng lại bảng" của drizzle-kit (copy → drop → rename, để thêm CHECK) chạy được trên DB có dữ liệu: `migrate()` tắt khóa ngoại trước BEGIN và chạy `foreign_key_check` sau mỗi migration, như nhập backup. Drop bảng cũ làm mất trigger của nó → thêm migration tự viết tạo lại trigger (mẫu: `0008_ai_analyses_append_only_rebuilt.sql` sau `0007`). Migration đổi schema nên có test mở DB cũ **có dữ liệu** (mẫu: "migrating a saved database" trong `src/database.test.ts`).
- Trigger của `0011_trash_purge.sql` (`kyc_notes_no_delete`, `kyc_facts_no_delete`, `ai_analyses_no_delete`) đọc bảng `customers` để cho Dọn sạch xóa dòng của KH đã xóa mềm. Vì vậy migration "dựng lại bảng" `customers` hỏng ở RENAME ("no such table: main.customers"): migration tự viết trong cùng transaction phải DROP ba trigger trước khi dựng lại bảng rồi tạo lại sau (mẫu: DROP + CREATE của `0011`).
- Mở DB: `src/database.ts` (`openDatabase`) · lỗi: `src/errors.ts` (`DbError` + mã; UI dịch mã qua i18n).
- `openDatabase` bật `foreign_keys` và `recursive_triggers` mỗi lần mở và sau `export` (sql.js mở lại kết nối). Thiếu `recursive_triggers`, `INSERT OR REPLACE` xóa dòng cũ mà không chạy trigger xóa, tức sửa được ghi chú KYC / dữ kiện / phân tích AI của KH đang dùng (DR6-113); mọi trigger chỉ `RAISE` nên bật nó không gây đệ quy.
- Cột trỏ tới nhân sự (`re_id` của KH / lịch / HĐ, người phối hợp, người đánh giá): **một danh sách** `PERSON_REFERENCES` (`src/person-references.ts`), mà `personUsage` (hộp 9b, lệnh xóa / đổi vai trò), Thùng rác, Dọn sạch và luật nhập 5 đều đọc. Thêm cột: một kind ở đó, field đếm nó (`USAGE_FIELDS`, `src/team.ts`; dòng ở 9b) và vai trò ở luật 5 (`POINTS_TO`, `src/backup-validation.ts`); kiểu và `src/person-references.test.ts` báo khi thiếu.
- Lệnh theo thực thể: `src/team.ts`, `src/customers.ts`, `src/appointments.ts`, `src/policies.ts`, `src/kyc.ts`; helper chung `src/common.ts`; ULID `src/ids.ts`.
- Dữ liệu cho chỉ số: app đọc các bảng một lần mỗi revision (`apps/desktop/src/data/tables.ts`), chỉ số tính trong bộ nhớ bằng `domain`.
- Sao lưu `.p2cbackup`: `src/backup.ts` + kiểm khi nhập `src/backup-validation.ts`.
- Dữ liệu giả lập: `src/seed.ts` (logic) + `src/seed-data.ts` (danh sách, trọng số). Không có thư mục `tools/seed*`.
- Test: `setup()` / `codeOf()` ở `src/test-support.ts` (DB bộ nhớ, đồng hồ ghim, sẵn team + RE + TL); không tự dựng schema.

## Quy ước

- Mỗi lệnh chạy trong một transaction; từ chối thì ném `DbError` và DB không đổi.
- Xóa là xóa mềm (`deleted_at`), có `restore*`; chỉ Dọn sạch Thùng rác (`src/purge.ts`, spec Phase 6 TR-11) xóa hẳn. Ngày lưu dạng `yyyy-mm-dd`, tiền là số nguyên đồng — chuyển đổi qua `common.ts` / `domain`.
- Dữ liệu là giả lập: luật chặt hơn thì từ chối / bỏ dữ liệu cũ không hợp lệ, không viết migration dữ liệu (quyết định 02/10).

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/ai-analyses.ts` — type NewAiAnalysis, type AiAnalysisRecord, type AiAnalysisState, type AiAnalysisReminder, type AiAnalysisView, recordAiAnalysis, type AnalysisFields, analysisLabelsFit, analysisContentFits, listAiAnalyses
- `src/appointments.ts` — type AppointmentTrigger, type AppointmentRecord, type NewAppointment, type MeetingOutcome, type NextAppointment, type AppointmentDetails, listAppointments, scheduleAppointment, recordMeetingOutcome, recordOutcomeWithNext, editMeetingOutcome, rescheduleAppointment, softDeleteAppointment, restoreAppointment, checkRestoreAppointment, restoreStageMove
- `src/backup-validation.ts` — validateBackupValues, validateBackupInvariants, dataTables
- `src/backup.ts` — BACKUP_FORMAT, MAX_BACKUP_BYTES, type ImportedBackup, exportBackup, importBackup
- `src/common.ts` — cleanText, cleanNote, storable, requireChoice, requireName, optionalText, isLabel, stampDeleted, storedDate, today, storedPastDate, nextSeq, isFee, requireAmount, requireRe, selectRows, prepared, rowInsert, findRow, requireRow, liveRow, updateRow, liveCustomer, lastSeq
- `src/counts.ts` — type RecordCounts, countRecords, type CustomerRecordCounts, countCustomerRecords
- `src/customers.ts` — type Gender, type BirthDate, type CustomerRecord, type CustomerProfile, type NewCustomer, listCustomers, getCustomer, listStageTransitions, createCustomer, updateCustomerProfile, previewHandover, previewCustomerProfile, changeStageManually, softDeleteCustomer, restoreCustomer, checkRestoreCustomer, appendTransition, checkTransition, requireStage, stagesOfDay, withdrawAppointmentTransition, meetingKeepingMove, transitionWithdrawnAt, reinstateTransition
- `src/database.ts` — type OpenDatabaseOptions, type Sources, type Database, openDatabase, assertSupported, migrate
- `src/errors.ts` — DB_ERROR_CODES, type DbErrorCode, DbError
- `src/ids.ts` — type RandomFill, cryptoFill, ulid, encodeBase32
- `src/index.ts` — re-exports ./database, ./migrations, ./backup, ./counts, ./errors, ./team, ./customers, ./appointments, ./policies, ./kyc, ./seed, ./schema, ./ai-analyses, ./trash, ./purge, ./settings
- `src/kyc.ts` — type KycSource, type KycNoteRecord, type KycFactRecord, type KycProfileRecord, type KycVersionRecord, type KycFactCommand, type KycChange, getKycProfile, listKycVersions, addKycNote, type KycNoteFact, recordKycNote, confirmKycFact, markKycConflict, resolveKycConflict, type ProfileFields, recordProfileFacts, type ProfileKycPreview, previewProfileFacts, profileFactValue, normalizeKycValue
- `src/migrations.ts` — type Migration, MIGRATIONS, latestVersion, LATEST_SCHEMA_VERSION
- `src/person-references.ts` — PERSON_REFERENCE_KINDS, type PersonReferenceKind, quotedKinds, PERSON_REFERENCES
- `src/policies.ts` — type NewPolicy, type PolicyChanges, listPolicies, submitPolicy, issuePolicy, updatePolicy, softDeletePolicy, restorePolicy, checkRestorePolicy
- `src/purge.ts` — type KeptBy, type KeptRecord, type PurgeCounts, type PurgePlan, previewPurge, purgeTrash, keptRecords
- `src/schema.ts` — teams, people, settings, schemaMigrations, CUSTOMER_STAGES, GENDERS, APPOINTMENT_TRIGGERS, customers, appointments, appointmentCoordinators, stageTransitions, policies, KYC_NOTE_SOURCES, kycNotes, kycFacts, kycVersions, AI_ANALYSIS_MODES, AI_ANALYSIS_GATES, AI_ANALYSIS_STATUSES, AI_ANALYSIS_PROVIDERS, AI_ANALYSIS_REASONING, aiAnalyses
- `src/seed-data.ts` — type Weighted, STARTING_STAGES, BIRTH_DATE_KINDS, OUTCOMES, MOVES, TRIGGERS, TEAM_NAMES, FAMILY_NAMES, MIDDLE_NAMES, GIVEN_NAMES, APPOINTMENT_TIMES, TRIGGER_NOTES, NEXT_STEPS, MEETING_NOTES, CASE_SIZES_MILLION, KYC_TOPICS, KYC_VALUES
- `src/seed.ts` — type SeedOptions, type SeedScale, seedDemoData
- `src/settings.ts` — getSetting, putSetting
- `src/team.ts` — listTeams, listPeople, type PersonUsage, personUsage, ownsRecords, isPersonInUse, createTeam, renameTeam, softDeleteTeam, restoreTeam, checkRestoreTeam, type PersonInput, createPerson, updatePerson, softDeletePerson, restorePerson, checkRestorePerson
- `src/test-support.ts` — setup, errorOf, codeOf, d, byId, stageAtEndOfDay
- `src/trash.ts` — type TrashRef, type TrashOwner, type TrashEffect, type TrashBlock, type TrashRow, listTrash
<!-- codemap:end -->
