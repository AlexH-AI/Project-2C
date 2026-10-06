/** Rows a big table shows at first, and adds on each "Hiện thêm" (T-150, DR-03). */
export const SHOW_MORE_STEP = 100;

/** The table's foot: none up to a hundred rows, else a count with a button, or "all shown". */
export type ShowMoreFoot =
  | { kind: 'none' }
  | { kind: 'more'; shown: number; total: number; next: number }
  | { kind: 'all'; total: number };

/**
 * The first `limit` of the rows, already filtered and sorted in full, and the foot under them.
 * Counts are of all the rows, not of the ones shown.
 */
export function showMore<Row>(
  rows: readonly Row[],
  limit: number,
): { visible: readonly Row[]; foot: ShowMoreFoot } {
  const total = rows.length;
  if (total <= SHOW_MORE_STEP) return { visible: rows, foot: { kind: 'none' } };
  if (limit >= total) return { visible: rows, foot: { kind: 'all', total } };
  return {
    visible: rows.slice(0, limit),
    foot: { kind: 'more', shown: limit, total, next: Math.min(SHOW_MORE_STEP, total - limit) },
  };
}
