/**
 * The class names the screens and the sidebar share (DR6-67), declared once so that a card, a boxed
 * line or a link looks the same wherever it is. Only `packages/ui` tokens, as everywhere
 * (`pnpm lint:tokens`).
 */

/** The focus ring of what is not a `Button`: a link, a chip, a day of the calendar. */
export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-accent';

/**
 * The skin of every card (mockup components.html 04; `card` of theme.css): no border, the material
 * of a card with its lit top edge and its shadow, the corner of a card. What uses it adds its room.
 */
export const CARD_SKIN = 'card rounded-card';

/** The room inside a card: 18 px above and below, 20 px at the sides (components.html 04). */
export const ROOMY = 'px-5 py-4.5';

/**
 * A dense card of a screen, 16 px of room: the calendar, the list of the day, a block of the
 * customer profile.
 */
export const CARD = `${CARD_SKIN} p-4`;

/** A section of Cài đặt. */
export const SETTINGS_SECTION = `${CARD_SKIN} ${ROOMY}`;

/** A block of Tổng quan and Báo cáo: its heading over its figures, chart or table. */
export const PANEL = `${CARD_SKIN} flex flex-col gap-3 ${ROOMY}`;

/** What `lightCard` reads of a pointer event: where the pointer is, and what it is over. */
interface PointerOver {
  readonly clientX: number;
  readonly clientY: number;
  readonly target: unknown;
}

/**
 * The light of a card follows the pointer (ui2.css `.card::after`): tells the card under the
 * pointer where the pointer is over it, as shares of its box (`--mx`, `--my` of theme.css). The
 * `onPointerMove` of what holds the cards.
 */
export function lightCard({ clientX, clientY, target }: PointerOver) {
  const card = (target as Partial<Element>).closest?.<HTMLElement>('.card');
  if (!card) return;
  const box = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${((clientX - box.left) / box.width) * 100}%`);
  card.style.setProperty('--my', `${((clientY - box.top) / box.height) * 100}%`);
}

/** The heading of a card, a section or a block: "Dữ kiện KYC", "Thùng rác", "So sánh team". */
export const HEADING = 'm-0 text-sm font-medium text-heading';

/**
 * A label of words (mockup components.html 07 `.st`): a gate state, "Đã có key", "Chưa ghi kết
 * quả", "n HĐ"; where it is used adds its colour, which the fill mixes into the background.
 * `StageBadge` and `PolicyBadge` of `packages/ui`, which cannot import the app, write their own.
 */
export const BADGE =
  'label-fill inline-flex h-5 items-center rounded-chip px-2 text-xs font-bold whitespace-nowrap';

/**
 * A boxed line (mockup `.alert`); where it is used adds its border colour and anything else. A
 * word longer than its line, a name with no space, breaks inside it (DR6-183).
 */
export const ALERT = 'm-0 rounded-field border px-3 py-2 wrap-anywhere';

/**
 * A name in a cell of a table (Khách hàng, Lịch hẹn, the history of AI analyses): under a cap it
 * keeps its line and its column its width; a longer one breaks at the cap, even with no space, so
 * the table stays in the window (DR6-170). Báo cáo has its own (`ReportTable.tsx`).
 */
export const CELL_NAME = 'block max-w-60 wrap-anywhere';

/** An action written as a link in running text or a table ("Hẹn tiếp", "Xem tất cả"). */
export const LINK = `cursor-pointer rounded-control-sm text-accent hover:underline ${FOCUS}`;
