/** Whole numbers written the Vietnamese way: `.` groups thousands. Money builds on this (`money.ts`). */

/** Digits of a non-negative whole number with `.` between thousands: `1234567` → `1.234.567`. */
export const groupThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+$)/g, '.');

/** A count with thousands grouped the Vietnamese way: `1.204`. */
export function formatCount(count: number): string {
  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError(`Not a count: ${count}`);
  return groupThousands(count);
}

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/**
 * A file size the Vietnamese way, 1 KB = 1024 B, one decimal after a comma and no `,0`:
 * `512 B`, `850 KB`, `3,1 MB`.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isSafeInteger(bytes) || bytes < 0) throw new RangeError(`Not a file size: ${bytes}`);
  if (bytes < 1024) return `${groupThousands(bytes)} ${SIZE_UNITS[0]}`;
  let unit = 1;
  let value = bytes / 1024;
  // Compared after rounding, so 1023,96 KB reads 1 MB rather than 1024 KB.
  while (unit < SIZE_UNITS.length - 1 && Math.round(value * 10) >= 10240) {
    value /= 1024;
    unit++;
  }
  const tenths = Math.round(value * 10);
  const decimal = tenths % 10;
  return `${groupThousands(Math.floor(tenths / 10))}${decimal === 0 ? '' : `,${decimal}`} ${SIZE_UNITS[unit]}`;
}
