/**
 * The class names the screens and the sidebar share (DR6-67), declared once so that a card, a boxed
 * line or a link looks the same wherever it is. Only `packages/ui` tokens, as everywhere
 * (`pnpm lint:tokens`).
 */

/** The focus ring of what is not a `Button`: a link, a chip, a day of the calendar. */
export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-accent';

/** A card of a screen: the calendar, the list of the day, a block of the customer profile. */
export const CARD = 'rounded-card border border-border bg-surface-1 p-4';

/** A section of Cài đặt: a card with less room above and below its content. */
export const SETTINGS_SECTION = 'rounded-card border border-border bg-surface-1 px-4 py-3';

/**
 * A block of Tổng quan and Báo cáo: its heading over its figures, chart or table. Its corner is
 * the one `rounded-md` stood for, until VA3a draws the cards.
 */
export const PANEL =
  'flex flex-col gap-3 rounded-control border border-border bg-surface-1 px-3.5 py-3';

/** The heading of a card, a section or a block: "Dữ kiện KYC", "Thùng rác", "So sánh team". */
export const HEADING = 'm-0 text-sm font-medium text-heading';

/**
 * A label of words (mockup components.html 07 `.st`): a gate state, "Đã có key", "Chưa ghi kết
 * quả", "n HĐ"; where it is used adds its colour, which the fill mixes into the background.
 * `StageBadge` and `PolicyBadge` of `packages/ui`, which cannot import the app, write their own.
 */
export const BADGE =
  'label-fill inline-flex h-5 items-center rounded-chip px-2 text-xs font-bold whitespace-nowrap';

/** A boxed line (mockup `.alert`); where it is used adds its border colour and anything else. */
export const ALERT = 'm-0 rounded-field border px-3 py-2';

/**
 * A name in a cell of a table (Khách hàng, Lịch hẹn, the history of AI analyses): under a cap it
 * keeps its line and its column its width; a longer one breaks at the cap, even with no space, so
 * the table stays in the window (DR6-170). Báo cáo has its own (`ReportTable.tsx`).
 */
export const CELL_NAME = 'block max-w-60 wrap-anywhere';

/** An action written as a link in running text or a table ("Hẹn tiếp", "Xem tất cả"). */
export const LINK = `cursor-pointer rounded-control-sm text-accent hover:underline ${FOCUS}`;
