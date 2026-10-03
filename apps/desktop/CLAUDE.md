# apps/desktop — app Tauri 2 + React UI

Vỏ Tauri (`src-tauri/`, Rust: chỉ lệnh đọc / ghi file, ADR-0016) và UI React (`src/`). Chạy web không cần Tauri: `pnpm dev:web` (DB trong bộ nhớ, seed mỗi lần mở).

## Ranh giới

- Dùng `@p2c/domain`, `@p2c/db`, `@p2c/ui` qua `index.ts` của từng package; package không được import app.
- Sửa `src-tauri/**`, `vite.config.ts`, `tauri.conf.json`, `package.json` → PR gắn nhãn `build-exe` lúc tạo; sửa Rust thì chạy `pnpm verify:rust`.

## File hay tìm

- Màn hình: `src/routes/` (không có `src/screens/`); màn lớn có thư mục con; route → màn: bảng dưới, chọn màn ở `src/routes/Screen.tsx`, hash / thứ tự sidebar ở `src/shell/routes.ts`.
- Logic thuần của màn (có unit test): `*-view.ts`, `*-form.ts` cạnh component.
- Vỏ: `src/shell/` (`AppShell`, `Sidebar`, góc nhìn `scope.ts` + `ScopeContext`, `ErrorBoundary`, `CloseGuard`).
- Dữ liệu: `src/data/app-data.ts` (mở DB lúc khởi động), `AppDataContext.tsx`, `persist-queue.ts` (hàng đợi ghi), `tauri-storage.ts`.
- i18n: `src/i18n/vi.ts` (mọi chuỗi UI) + `src/i18n/index.ts` (`t()`, dịch `DbError`).
- E2E: `e2e/*.spec.ts` ở gốc repo (Playwright trên bản build web).

## Quy ước

- Không chuỗi UI cứng: thêm key vào `vi.ts`, gọi `t()`. Tiền / ngày / chỉ số format bằng `@p2c/domain`.
- Style chỉ qua token của `@p2c/ui` (`pnpm lint:tokens` quét `src/`).
- Màn mới theo mockup đã duyệt ở `docs/design/mockups/` (G3).

## Bản đồ route và export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code. Cột view: file `*-view.ts` mà màn import trực tiếp.

<!-- codemap:start -->
### Route

| route | screen | view |
|---|---|---|
| `overview` | `src/routes/Overview.tsx` | — |
| `appointments` | `src/routes/appointments/AppointmentsScreen.tsx` | `src/routes/appointments/appointments-view.ts` |
| `customers` | `src/routes/customers/CustomersScreen.tsx` | `src/routes/customers/customers-view.ts` |
| `reports` | (placeholder) | — |
| `team` | `src/routes/team/TeamScreen.tsx` | `src/routes/team/team-view.ts` |
| `settings` | `src/routes/Settings.tsx` | — |
| `customer` | `src/routes/customers/CustomerProfile.tsx` | `src/routes/customers/customers-view.ts` |

### Export

- `src/App.tsx` — App
- `src/data/AppDataContext.tsx` — AppDataContext, useAppData, useDatabase, useQuery
- `src/data/app-data.ts` — type StoragePort, type DataFolder, type LastSave, type RecordCounts, type ExportedBackup, type BackupPreview, type AppData, type OpenAppDataOptions, isUnsavedChangesError, openAppData, countRecords
- `src/data/persist-queue.ts` — type PersistQueue, createPersistQueue
- `src/data/tauri-storage.ts` — tauriStorage
- `src/i18n/index.ts` — type MessageParams, t, errorMessage, type MessageKey
- `src/i18n/vi.ts` — vi, type MessageKey
- `src/main.tsx` — (no exports)
- `src/routes/Overview.tsx` — Overview
- `src/routes/Screen.tsx` — Screen
- `src/routes/Settings.tsx` — Settings
- `src/routes/SettingsBackup.tsx` — BackupSection
- `src/routes/SettingsDataFile.tsx` — countsText, DataFileSection, OpenFolderButton
- `src/routes/TeamAppointmentsChart.tsx` — TeamAppointmentsChart
- `src/routes/appointments/AppointmentDialog.tsx` — dateReading, AppointmentDialog, liveIds, CoordinatorsField, dateFieldError, DateSuggestion
- `src/routes/appointments/AppointmentsScreen.tsx` — AppointmentsScreen
- `src/routes/appointments/DeleteAppointmentDialog.tsx` — DeleteAppointmentDialog
- `src/routes/appointments/EditOutcomeDialog.tsx` — EditOutcomeDialog
- `src/routes/appointments/MetFields.tsx` — badge, type MetDraft, EMPTY_MET, metDraftOf, MetFields
- `src/routes/appointments/OutcomeDialog.tsx` — OutcomeDialog
- `src/routes/appointments/RescheduleDialog.tsx` — RescheduleDialog
- `src/routes/appointments/RescheduleFields.tsx` — whenText, useRescheduleForm, type RescheduleForm, RescheduleFields
- `src/routes/appointments/YearGrid.tsx` — YearGrid
- `src/routes/appointments/appointment-form.ts` — MAX_HISTORY, type ScheduleMode, type ScheduleDate, readScheduleDate, dayText, withTime, parseTime, isPastOrToday, type PriorMeetings, priorMeetings, searchCustomers
- `src/routes/appointments/appointments-view.ts` — type AppointmentData, type CoordinatorFilter, type Outcome, STATUS_TONE, FOCUS, LOCKED, LINK, outcomeText, type DateTone, DATE_TONE_CELL, statusLabel, summaryText, dateTone, personLabel, type AppointmentRow, type DayCell, type MonthCell, type DayGroup, outcomeResolver, appointmentRows, appointmentsByRe, revealCreated, rescheduleLinks, monthGrid, yearGrid, pickDay, dayBoard
- `src/routes/appointments/outcome-form.ts` — OUTCOME_CHOICES, type OutcomeChoice, outcomeChoices, outcomeLock, stageAfterChoices, type OutcomeDraft, type OutcomeError, type OutcomeRead, readOutcome
- `src/routes/customers/CustomerAppointments.tsx` — NextButton, CustomerAppointments
- `src/routes/customers/CustomerDialogs.tsx` — ALERT, Actions, dayRead, useDateField, InvalidAlert, CustomerFormDialog, ChangeStageDialog
- `src/routes/customers/CustomerKyc.tsx` — BADGE, YES_NO, KycCard, Timeline
- `src/routes/customers/CustomerPolicies.tsx` — CustomerPolicies
- `src/routes/customers/CustomerProfile.tsx` — CustomerProfile
- `src/routes/customers/CustomersScreen.tsx` — CustomersScreen
- `src/routes/customers/KycDialogs.tsx` — KycNoteDialog, ResolveKycDialog
- `src/routes/customers/PolicyDialogs.tsx` — type PolicyMode, PolicyDialog
- `src/routes/customers/customers-view.ts` — type CustomerCard, type CustomerBoard, type CustomerData, customerBoard, type RecordDateResult, parseRecordDate, type BirthDateResult, parseBirthDate, allowedStages, birthLabel, ageOn
- `src/routes/customers/kyc-view.ts` — type KycCategoryRow, kycOverview, factText, type TimelineEvent, kycTimeline, type KycNotePreview, previewKycNote, type KycResolveOption, resolveKycOptions
- `src/routes/customers/policy-form.ts` — type FypResult, readFyp, type IssuedDateResult, type PolicyDraft, type PolicyValues, readPolicy, issuedChange, monthOf, effectText, expectedCaseSize
- `src/routes/period-labels.ts` — PERIOD_LABELS
- `src/routes/team/PersonDialogs.tsx` — PersonDialog, DeletePersonDialog
- `src/routes/team/TeamDialogs.tsx` — TeamNameDialog, DeleteTeamDialog
- `src/routes/team/TeamScreen.tsx` — TeamScreen
- `src/routes/team/team-view.ts` — type TeamEntry, type TeamView, groupByTeam, type StaffRecords, type StaffMetrics, staffMetrics, type PersonUsage, personUsage
- `src/shell/AppShell.tsx` — AppShell
- `src/shell/CloseGuard.tsx` — type AppWindow, CloseGuard
- `src/shell/ErrorBoundary.tsx` — ErrorBoundary
- `src/shell/RePicker.tsx` — RePicker
- `src/shell/SaveWarning.tsx` — SaveWarning
- `src/shell/ScopeContext.tsx` — type ScopeState, ScopeContext, useScopeState
- `src/shell/ScopePicker.tsx` — ScopePicker
- `src/shell/Sidebar.tsx` — Sidebar
- `src/shell/StartupError.tsx` — StartupError
- `src/shell/close-guard.ts` — type CloseChoice, type ClosePort, closeAfterSaving
- `src/shell/routes.ts` — SECTIONS, type Section, type Route, DEFAULT_ROUTE, parseHash, routeToHash, sectionOf, usesScope
- `src/shell/scope.ts` — type ScopeChoice, resolveScope, chooseKind, narrowScope, teamRes, reOptions
- `src/shell/screen-error.ts` — type ScreenErrorMessage, screenErrorMessage
- `src/shell/startup-error.ts` — type StartupMessage, startupMessage
- `src/shell/useRoute.ts` — useRoute
<!-- codemap:end -->
