# apps/desktop — app Tauri 2 + React UI

Vỏ Tauri (`src-tauri/`, Rust: lệnh đọc / ghi file, ADR-0016; lệnh AI `ai_complete`, `ai_key_*` giữ key và gọi OpenCode, ADR-0009 D-1) và UI React (`src/`). Chạy web không cần Tauri: `pnpm dev:web` (DB trong bộ nhớ, seed mỗi lần mở).

Thư mục dữ liệu của app (`platform::data_dir`, module `src-tauri/src/platform/`; ADR-0019 §2), chọn một lần mỗi lần chạy: bản debug (`pnpm dev`) `Project2C-data` cạnh file chạy, trên cả hai nền tảng; Windows bản cài `%LOCALAPPDATA%\com.heritas.lcrm\`, chế độ portable khi có thư mục `Project2C-data\` cạnh exe thì dùng nó; macOS `~/Library/Application Support/com.heritas.lcrm/`. Cùng tên file và thư mục con.

## Ranh giới

- Dùng `@p2c/domain`, `@p2c/db`, `@p2c/ui` qua `index.ts` của từng package; package không được import app.
- Sửa `src-tauri/**`, `vite.config.ts`, `tauri.conf.json`, `package.json` → PR gắn cả hai nhãn `build-exe` và `build-mac` lúc tạo (`merge-pr` chặn khi thiếu nhãn nào); sửa Rust thì chạy `pnpm verify:rust`.

## File hay tìm

- Màn hình: `src/routes/` (không có `src/screens/`); màn lớn có thư mục con; route → màn: bảng dưới, chọn màn ở `src/routes/Screen.tsx`, hash / thứ tự sidebar ở `src/shell/routes.ts`.
- Logic thuần của màn (có unit test): `*-view.ts`, `*-form.ts` cạnh component.
- Vỏ: `src/shell/` (`AppShell`, `Sidebar`, góc nhìn `scope.ts` + `ScopeContext`, `ErrorBoundary`, `CloseGuard`).
- Dữ liệu: `src/data/app-data.ts` (mở DB lúc khởi động), `AppDataContext.tsx`, `persist-queue.ts` (hàng đợi ghi), `tauri-storage.ts`. AI: `ai-analysis.ts` (`AppAi`: runner chung, cấu hình `ai` trong bảng `settings`, adapter theo provider / gói), `ai-tauri.ts` (lệnh Rust `ai_complete`, `ai_key_*`; bản web không có).
- i18n: `src/i18n/vi.ts` (mọi khóa, chữ tiếng Việt) + `src/i18n/index.ts` (`t()`, dịch `DbError`); `src/i18n/en.ts` (English của từng khóa, dịch dần; `en.test.ts` đếm khóa thiếu), `src/i18n/language.ts` (ngôn ngữ của lần chạy, `changeLanguage`; ADR-0018 §1).
- E2E: `e2e/*.spec.ts` ở gốc repo (Playwright trên bản build web).

## Quy ước

- Không chuỗi UI cứng: thêm key vào `vi.ts` kèm English ở `en.ts` theo bảng thuật ngữ của `CONTEXT.md` (`MISSING_EN` của `en.test.ts` chỉ giảm), gọi `t()`; luật đủ ở `.claude/rules/i18n-ui.md`. Tiền / ngày / chỉ số format bằng `@p2c/domain`.
- Style chỉ qua token của `@p2c/ui` (`pnpm lint:tokens` quét `src/`).
- Màn mới theo mockup đã duyệt ở `docs/design/mockups/` (G3).

## Bản đồ route và export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code. Cột view: file `*-view.ts` mà màn import trực tiếp.

<!-- codemap:start -->
### Route

| route | screen | view |
|---|---|---|
| `overview` | `src/routes/Overview.tsx` | `src/routes/overview/overview-view.ts`, `src/routes/overview/stage-view.ts`, `src/routes/overview/team-compare-view.ts`, `src/routes/reports/reports-view.ts` |
| `appointments` | `src/routes/appointments/AppointmentsScreen.tsx` | `src/routes/appointments/appointments-view.ts` |
| `customers` | `src/routes/customers/CustomersScreen.tsx` | `src/routes/customers/customers-view.ts` |
| `reports` | `src/routes/reports/ReportsScreen.tsx` | `src/routes/overview/overview-view.ts`, `src/routes/reports/reports-view.ts` |
| `team` | `src/routes/team/TeamScreen.tsx` | `src/routes/money-view.ts`, `src/routes/overview/overview-view.ts`, `src/routes/team/team-view.ts` |
| `settings` | `src/routes/Settings.tsx` | — |
| `customer` | `src/routes/customers/CustomerProfile.tsx` | `src/routes/customers/customers-view.ts`, `src/routes/customers/kyc-view.ts` |
| `rm` | `src/routes/team/RmPage.tsx` | `src/routes/overview/overview-view.ts`, `src/routes/team/rm-view.ts` |

### Export

- `src/` — App.tsx, main.tsx
- `src/data/` — AppDataContext.tsx, ai-analysis.ts, ai-jobs.ts, ai-tauri.ts, app-data.ts, demo-snapshot.ts, listeners.ts, persist-queue.ts, tables.ts, tauri-storage.ts, today.ts
- `src/i18n/` — en.ts, index.ts, language.ts, vi.ts
- `src/routes/` — ConfirmWordDialog.tsx, FilterBar.tsx, MoneyField.tsx, Overview.tsx, RestoreDialog.tsx, Screen.tsx, Settings.tsx, SettingsAi.tsx, SettingsBackup.tsx, SettingsDataFile.tsx, SettingsTrash.tsx, ai-error-view.ts, applied-filter.ts, classes.ts, money-view.ts, period-labels.ts, settings-ai-view.ts, stage-badge.tsx, trash-view.ts
- `src/routes/appointments/` — AppointmentAi.tsx, AppointmentDialog.tsx, AppointmentsScreen.tsx, DeleteAppointmentDialog.tsx, EditOutcomeDialog.tsx, MetFields.tsx, OutcomeDialog.tsx, RescheduleDialog.tsx, RescheduleFields.tsx, YearGrid.tsx, appointment-ai-view.ts, appointment-form.ts, appointments-view.ts, outcome-form.ts
- `src/routes/customers/` — CustomerAppointments.tsx, CustomerDialogs.tsx, CustomerKyc.tsx, CustomerPolicies.tsx, CustomerProfile.tsx, CustomerSearch.tsx, CustomersScreen.tsx, KycDialogs.tsx, KycExtraction.tsx, KycHistory.tsx, KycIntelligence.tsx, KycWebSession.tsx, PolicyDialogs.tsx, ai-panel-view.ts, customer-search.ts, customers-view.ts, extraction-view.ts, kyc-view.ts, policy-form.ts, use-ai-job.ts
- `src/routes/overview/` — OverviewTiles.tsx, StageBlock.tsx, TeamCompare.tsx, overview-view.ts, stage-chart.ts, stage-view.ts, team-compare-view.ts
- `src/routes/reports/` — ReportExport.tsx, ReportTable.tsx, ReportsScreen.tsx, report-workbook.ts, reports-view.ts
- `src/routes/team/` — Boundary.tsx, PersonDialogs.tsx, RmPage.tsx, RmSearch.tsx, TeamDialogs.tsx, TeamLook.tsx, TeamScreen.tsx, rm-search.ts, rm-view.ts, team-view.ts
- `src/shell/` — AppShell.tsx, Brand.tsx, CloseGuard.tsx, CommandPalette.tsx, ErrorBoundary.tsx, HeadsUp.tsx, NameMask.tsx, RmPicker.tsx, SaveWarning.tsx, ScopeContext.tsx, ScopePicker.tsx, ScreenBar.tsx, Sidebar.tsx, StartupError.tsx, Toasts.tsx, background-jobs.ts, block-reload.ts, close-guard.ts, command-palette.ts, heads-up.ts, name-mask.ts, palette-commands.ts, platform.ts, routes.ts, scope-menu.ts, scope.ts, screen-bar.ts, screen-error.ts, startup-error.ts, toast-queue.ts, trash-undo.ts, useRoute.ts
<!-- codemap:end -->
