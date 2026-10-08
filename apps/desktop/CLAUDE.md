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
| `overview` | `src/routes/Overview.tsx` | `src/routes/overview/overview-view.ts`, `src/routes/overview/stage-view.ts`, `src/routes/overview/team-compare-view.ts` |
| `appointments` | `src/routes/appointments/AppointmentsScreen.tsx` | `src/routes/appointments/appointments-view.ts` |
| `customers` | `src/routes/customers/CustomersScreen.tsx` | `src/routes/customers/customers-view.ts` |
| `reports` | `src/routes/reports/ReportsScreen.tsx` | `src/routes/overview/overview-view.ts`, `src/routes/reports/reports-view.ts` |
| `team` | `src/routes/team/TeamScreen.tsx` | `src/routes/team/team-view.ts` |
| `settings` | `src/routes/Settings.tsx` | — |
| `customer` | `src/routes/customers/CustomerProfile.tsx` | `src/routes/customers/customers-view.ts` |

### Export

- `src/` — App.tsx, main.tsx
- `src/data/` — AppDataContext.tsx, ai-analysis.ts, app-data.ts, demo-snapshot.ts, persist-queue.ts, tables.ts, tauri-storage.ts, today.ts
- `src/i18n/` — index.ts, vi.ts
- `src/routes/` — FilterBar.tsx, Overview.tsx, Screen.tsx, Settings.tsx, SettingsBackup.tsx, SettingsDataFile.tsx, applied-filter.ts, period-labels.ts
- `src/routes/appointments/` — AppointmentDialog.tsx, AppointmentsScreen.tsx, DeleteAppointmentDialog.tsx, EditOutcomeDialog.tsx, MetFields.tsx, OutcomeDialog.tsx, RescheduleDialog.tsx, RescheduleFields.tsx, YearGrid.tsx, appointment-form.ts, appointments-view.ts, outcome-form.ts
- `src/routes/customers/` — CustomerAppointments.tsx, CustomerDialogs.tsx, CustomerKyc.tsx, CustomerPolicies.tsx, CustomerProfile.tsx, CustomersScreen.tsx, KycDialogs.tsx, KycIntelligence.tsx, PolicyDialogs.tsx, ai-panel-view.ts, customers-view.ts, kyc-view.ts, policy-form.ts
- `src/routes/overview/` — OverviewTiles.tsx, StageBlock.tsx, TeamCompare.tsx, overview-view.ts, stage-chart.ts, stage-view.ts, team-compare-view.ts
- `src/routes/reports/` — ReportExport.tsx, ReportTable.tsx, ReportsScreen.tsx, report-workbook.ts, reports-view.ts
- `src/routes/team/` — PersonDialogs.tsx, TeamDialogs.tsx, TeamScreen.tsx, team-view.ts
- `src/shell/` — AppShell.tsx, CloseGuard.tsx, ErrorBoundary.tsx, RePicker.tsx, SaveWarning.tsx, ScopeContext.tsx, ScopePicker.tsx, Sidebar.tsx, StartupError.tsx, block-reload.ts, close-guard.ts, routes.ts, scope.ts, screen-error.ts, startup-error.ts, useRoute.ts
<!-- codemap:end -->
