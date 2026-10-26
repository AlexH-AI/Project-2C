/**
 * The class names the screens share (DR6-67), declared once so that a card, a boxed line or a link
 * looks the same wherever it is. Only `packages/ui` tokens, as everywhere (`pnpm lint:tokens`).
 */

/** The focus ring of what is not a `Button`: a link, a chip, a day of the calendar. */
export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-accent';

/** A card of a screen: the calendar, the list of the day, a block of the customer profile. */
export const CARD = 'rounded-lg border border-border bg-surface-1 p-4';

/** A section of Cài đặt: a card with less room above and below its content. */
export const SECTION = 'rounded-lg border border-border bg-surface-1 px-4 py-3';

/** A block of Tổng quan and Báo cáo: its heading over its figures, chart or table. */
export const PANEL = 'flex flex-col gap-3 rounded-md border border-border bg-surface-1 px-3.5 py-3';

/** A boxed line (mockup `.alert`); where it is used adds its border colour and anything else. */
export const ALERT = 'm-0 rounded-md border px-3 py-2';

/** An action written as a link in running text or a table ("Hẹn tiếp", "Xem tất cả"). */
export const LINK = `cursor-pointer rounded-sm text-accent hover:underline ${FOCUS}`;
