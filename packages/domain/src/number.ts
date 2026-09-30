/** Whole numbers written the Vietnamese way: `.` groups thousands. Money builds on this (`money.ts`). */

/** Digits of a non-negative whole number with `.` between thousands: `1234567` → `1.234.567`. */
export const groupThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+$)/g, '.');

/** A count with thousands grouped the Vietnamese way: `1.204`. */
export function formatCount(count: number): string {
  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError(`Not a count: ${count}`);
  return groupThousands(count);
}
