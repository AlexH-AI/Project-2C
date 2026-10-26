# packages/ui — design token + component dùng chung

Component React thuần trình bày (ADR-0013): nhận dữ liệu và nhãn qua props, không tự đọc dữ liệu, không chuỗi tiếng Việt cứng (nhãn do app truyền vào từ i18n).

## Ranh giới

- Được dùng `@p2c/domain` (ngày, so sánh); **không** import `db` / `ai` / `apps` (rule `ui-not-to-data`).
- Public API qua `src/index.ts` (`@p2c/ui`).

## File hay tìm

- Token: `src/tokens.css` (biến CSS; viền ô nhập, mũi tên sắp xếp chưa chọn: `--border-control`, ≥ 3:1), `src/theme.css` (map sang Tailwind, bỏ bảng màu mặc định), font `src/fonts.css`.
- Chặn style lách token: `src/token-guard.ts` + `scripts/check-tokens.ts` (`pnpm lint:tokens`, chạy trong `pnpm verify`): không màu / độ dài thô, không `style` inline (trừ `flex` đọc từ dữ liệu), không giá trị tuỳ ý của Tailwind.
- Bảng: `src/components/DataTable.tsx` (TanStack Table) + phần thuần `table-view.ts` (tiêu đề, dòng hiện, chân bảng) + so sánh ô `compare-cells.ts`.
- Biểu đồ: `src/components/Chart.tsx` (ECharts) + màu series từ token `chart-theme.ts`.
- Chọn kỳ: `src/components/PeriodPicker.tsx` + nhãn `PeriodPicker.label.ts`.
- Form / hộp thoại: `Dialog`, `TextField` (dòng dưới ô: `field-notes.ts`), `SelectField`, `Choices`, `Segmented`, `Button`; huy hiệu `StageBadge`, `PolicyBadge`.

## Quy ước

- Màu, khoảng cách, cỡ chữ chỉ qua token / class Tailwind của theme.
- Logic tách được (so sánh, nhãn, màu) để ở file `.ts` có unit test, component giữ mỏng.

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/components/Button.tsx` — type ButtonVariant, Button
- `src/components/Chart.tsx` — type ChartOption, encodeHtml, Chart
- `src/components/Choices.tsx` — type Choice, Choices
- `src/components/DataTable.tsx` — type DataTableColumn, type DataTableSort, type DataTableMoreLabels, DataTable
- `src/components/Dialog.tsx` — DialogFocusFallback, Dialog
- `src/components/NavIcon.tsx` — type NavIconName, NavIcon
- `src/components/PeriodPicker.label.ts` — type PeriodLabelTemplates, periodLabel
- `src/components/PeriodPicker.tsx` — type PeriodPickerLabels, PeriodPicker
- `src/components/PolicyBadge.tsx` — PolicyBadge
- `src/components/Segmented.tsx` — type SegmentedOption, Segmented
- `src/components/SelectField.tsx` — type SelectOption, SelectField
- `src/components/StageBadge.tsx` — StageBadge
- `src/components/TextField.tsx` — TextField
- `src/components/chart-theme.ts` — type TokenReader, SERIES_TOKENS, chartTheme
- `src/components/compare-cells.ts` — type CellValues, type CellKind, compareCells, compareCellsThen
- `src/components/dialog-focus.ts` — focusBack
- `src/components/field-notes.ts` — type FieldNote, fieldNotes
- `src/components/show-more.ts` — SHOW_MORE_STEP, type ShowMoreFoot, showMore
- `src/components/table-view.ts` — type ColumnSorting, sorts, tableView
- `src/index.ts` — re-exports ./components/NavIcon, ./components/Segmented, ./components/PeriodPicker, ./components/DataTable, ./components/Chart, ./components/Button, ./components/Dialog, ./components/TextField, ./components/SelectField, ./components/StageBadge, ./components/PolicyBadge, ./components/Choices
- `src/token-guard.ts` — type TokenViolation, findTokenViolations, findHardcodedSeparators
<!-- codemap:end -->
