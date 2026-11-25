# packages/ui — design token + component dùng chung

Component React thuần trình bày (ADR-0013): nhận dữ liệu và nhãn qua props, không tự đọc dữ liệu, không chuỗi tiếng Việt cứng (nhãn do app truyền vào từ i18n).

## Ranh giới

- Được dùng `@p2c/domain` (ngày, so sánh); **không** import `db` / `ai` / `apps` (rule `ui-not-to-data`).
- Public API qua `src/index.ts` (`@p2c/ui`).

## File hay tìm

- Token: `src/tokens.css` (biến CSS; viền ô nhập, mũi tên sắp xếp chưa chọn: `--border-control`, ≥ 3:1), `src/theme.css` (map sang Tailwind, bỏ bảng màu mặc định), font `src/fonts.css` (chỉ Playfair Display của slogan; chữ giao diện là font hệ điều hành, `--font-ui`).
- Vỏ hai nền tảng (VA1, ADR-0013 phụ lục 11/11/2026): token khối B của `ui2.css` (chất liệu `--mat-*` / `--fill-*`, bóng `--shadow-*`, chuyển động `--t-*` / `--spring-*`, bo góc `--r-*`). Giá trị macOS ở `:root`, Windows 11 đè ở `[data-os='win']` (app đặt `data-os` ở gốc trang). Bo góc dùng tiện ích theo tên thứ được bo: `rounded-card / pop / menu / field / control / control-sm / chip` (`theme.css`; ba tên cũ `rounded-sm / md / lg` đã gỡ ở VA3a); `scripts/tokens.test.ts` so token với khối B của mockup.
- Chặn style lách token: `scripts/token-guard.ts` + `scripts/check-tokens.ts` (`pnpm lint:tokens`, chạy trong `pnpm verify`): không màu / độ dài thô, không `style` inline (trừ `flex` đọc từ dữ liệu), không giá trị tuỳ ý của Tailwind; không ký hiệu / dấu nối viết cứng (tập ký hiệu đọc từ `apps/desktop/src/i18n/vi.ts` lúc chạy, dạng không bắt ghi ở "Limits" của `token-guard.ts`).
- Bảng: `src/components/DataTable.tsx` (TanStack Table) + phần thuần `table-view.ts` (tiêu đề, dòng hiện, chân bảng) + so sánh ô `compare-cells.ts`.
- Biểu đồ: `src/components/Chart.tsx` (ECharts) + màu series từ token `chart-theme.ts`.
- Chọn kỳ: `src/components/PeriodPicker.tsx` + nhãn `PeriodPicker.label.ts`; viên kỳ của thanh công cụ `PeriodPill.tsx` (‹ ›, tên kỳ mở `PeriodPicker` trong lớp nổi).
- Menu và lớp nổi của thanh công cụ (VA4b, `app-shell.html` `#toolbar`): `src/components/Menu.tsx` (`MenuButton`: viên mở menu; `MenuRows`: các dòng, `menuitemradio` / dòng mở dòng con; `useLayer`: đóng bằng Esc, bấm ra ngoài; `useLayerState`: mở / đang đóng / đóng) + phím `menu-keys.ts`.
- Chuyển động (VA7a, VA7b, `chuyen-dong.html`, ADR-0013 phụ lục 14/11/2026): CSS ở mục "Motion" cuối `theme.css` (Hiện `[data-rise]`, Trượt `[data-glide]`, lớp nổi `motion-layer`, hộp thoại `motion-dialog`, ô lệnh `motion-palette` (VA8), thông báo `motion-toast`, nhấn thẻ `press-card`, mũi tên dòng menu `motion-turn`, Mở `::view-transition-*(open)` theo `data-open` của `<html>`; một khối `prefers-reduced-motion` tắt hết); phần thuần `src/components/motion.ts` (`riseStep`, `layerState`, `calmMotion`, `glide`, `GONE_MS`, Đếm `counter`, Mở `openFrom`); hook `src/components/motion-hooks.tsx` (`useGlide`, `useCount`, `Count`). Khung hình của Đếm: `countFrame` của `@p2c/domain`. Hiện chạy ở vỏ app (`useRise` của `AppShell`): phần của màn là thẻ (`.card`) hay khối gắn `data-part`. Mở chạy ở vỏ app (`useOpen` của `AppShell`): link gắn `data-open` (`"row"`: nở từ dòng của bảng).
- Form / hộp thoại: `Dialog`, `TextField` (dòng dưới ô: `field-notes.ts`), `SelectField`, `Choices`, `Segmented`, `Button` (nút chỉ có icon của thanh công cụ: `IconButton`, kính lúp và con mắt, VA8); huy hiệu `StageBadge`, `PolicyBadge`; dấu vẽ của ô (✕ của dòng lỗi, mũi tên ô chọn): `FieldMarks.tsx`.
- Vỏ của nút, ô nhập, ô chọn, nút trượt, viên chọn, nhãn (VA2, `components.html` mục 01, 02, 03, 07): lớp của component cho kích thước (cao, đệm, bo góc, cỡ chữ); màu, bóng và trạng thái (rê chuột, nhấn, đang gõ, lỗi, khóa, khác nhau theo `data-os`) ở các `@utility` của `theme.css`: `press`, `btn-default / primary / danger / quiet`, `field`, `thumb`, `choice`, `label-fill`. Thẻ, dòng đang chọn của bảng, lớp tiêu điểm (VA3a, mục 04, 05, 06): `card`, `row-selected`, `pop`; nền đặc của ô đứng yên trên thẻ (cột tên của Báo cáo): `card-cover`. Thanh bên, thanh công cụ (VA4a, `app-shell.html` `#sidebar`, `#toolbar`): `sidebar`, `nav-item`, `nav-pill`, `toolbar`, `screen-title`, `chosen-tint`, biến thể `win:`; `--sidebar-w` theo hệ điều hành, `--toolbar-h`, `--toolbar-edge` (`tokens.css`). Icon nét của vỏ (`<symbol>` của `app-shell.html`): `src/components/NavIcon.tsx` (thanh bên; Forecast, kính lúp; ba mục Cài đặt; tám icon team (C3); con mắt của che tên, dấu cộng và xuất của ô lệnh (VA8)), `NavIcon.test.ts` so từng hình với mockup. Ô màu của mục Cài đặt (F1, `.sq`, Kiểu A): `tile-*` theo màu của theme (`tile-info`, `tile-n2`, `tile-n4`), icon `--bg-0` trên ô. Cửa sổ của exe (VA5): nền trang theo dấu `data-backdrop` (`glass` / `solid`, `main.tsx` đặt), tấm nội dung Windows `content-pane` (nền, dưới cùng) và `content-edge` (viền, trên thanh công cụ), hàng ba nút macOS `window-controls`.

## Quy ước

- Màu, khoảng cách, cỡ chữ chỉ qua token / class Tailwind của theme.
- Logic tách được (so sánh, nhãn, màu) để ở file `.ts` có unit test, component giữ mỏng.

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/components/Button.tsx` — type ButtonVariant, Button, IconButton
- `src/components/Chart.tsx` — type ChartOption, encodeHtml, Chart
- `src/components/Choices.tsx` — type Choice, Choices
- `src/components/DataTable.tsx` — type DataTableColumn, type DataTableSort, type DataTableView, type DataTableMoreLabels, DataTable
- `src/components/Dialog.tsx` — DialogFocusFallback, useLeaveBehind, Dialog
- `src/components/FieldMarks.tsx` — MARKS, Mark, ErrorMark, ListArrow
- `src/components/Menu.tsx` — useLayerState, useLayer, LAYER, type MenuRow, MenuRows, MenuButton
- `src/components/NavIcon.tsx` — type NavIconName, NavIcon
- `src/components/PeriodPicker.label.ts` — type PeriodLabelTemplates, periodLabel
- `src/components/PeriodPicker.tsx` — type PeriodPickerLabels, PeriodStep, PeriodPicker
- `src/components/PeriodPill.tsx` — PeriodPill
- `src/components/PolicyBadge.tsx` — PolicyBadge
- `src/components/Segmented.tsx` — type SegmentedOption, Segmented
- `src/components/SelectField.tsx` — type SelectOption, SelectField
- `src/components/StageBadge.tsx` — StageBadge
- `src/components/StateNote.tsx` — type StateNoteIcon, StateNote
- `src/components/TextField.tsx` — TextField
- `src/components/Toast.tsx` — Toast
- `src/components/chart-theme.ts` — SERIES_TOKENS, chartTheme
- `src/components/compare-cells.ts` — type CellValues, type CellKind, compareCells, compareCellsThen
- `src/components/dialog-focus.ts` — openingFocus, focusBack
- `src/components/field-notes.ts` — type FieldNote, fieldNotes, describedBy
- `src/components/menu-keys.ts` — menuMove
- `src/components/motion-hooks.tsx` — useGlide, useCount, Count
- `src/components/motion.ts` — RISE_STEPS, riseStep, calmMotion, type LayerState, layerState, GONE_MS, glide, COUNT_MS, type CountClock, type Counter, counter, openFrom
- `src/components/show-more.ts` — SHOW_MORE_STEP, type ShowMoreFoot, showMore
- `src/components/table-view.ts` — type ColumnSorting, sorts, rowState, tableView
- `src/index.ts` — re-exports ./components/NavIcon, ./components/Segmented, ./components/PeriodPicker, ./components/PeriodPicker.label, ./components/PeriodPill, ./components/Menu, ./components/FieldMarks, ./components/motion, ./components/motion-hooks, ./components/DataTable, ./components/Chart, ./components/Button, ./components/Dialog, ./components/Toast, ./components/StateNote, ./components/TextField, ./components/SelectField, ./components/StageBadge, ./components/PolicyBadge, ./components/Choices
<!-- codemap:end -->
