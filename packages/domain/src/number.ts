/**
 * Numbers written the Excel way, in every language (ADR-0018 §4; golden
 * `docs/golden/so-va-tien-te.md` §5): `,` groups thousands and `.` marks decimals. Money builds on
 * this (`money.ts`).
 */

/** Digits of a non-negative whole number with `,` between thousands: `1234567` → `1,234,567`. */
export const groupDigits = (value: number) => String(value).replace(/\B(?=(\d{3})+$)/g, ',');

/** A count: `1,204`. */
export function formatNumber(count: number): string {
  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError(`Not a count: ${count}`);
  return groupDigits(count);
}

/**
 * The number of a percentage, without the `%` sign, which the interface adds: one decimal and no
 * `.0`, thousands grouped: `66.7`, `100`, `-2.4`, `1,234.6`. Rounds half away from zero; a value
 * that rounds to zero is `0`, never `-0`.
 */
export function formatPercentage(value: number): string {
  if (!Number.isFinite(value)) throw new RangeError(`Not a percentage: ${value}`);
  const tenths = Math.round(Math.abs(value) * 10);
  const sign = value < 0 && tenths > 0 ? '-' : '';
  const decimal = tenths % 10;
  return `${sign}${groupDigits(Math.floor(tenths / 10))}${decimal ? `.${decimal}` : ''}`;
}

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/** A file size, 1 KB = 1024 B, one decimal and no `.0`: `1,023 B`, `1.5 KB`, `3.1 MB`. */
export function formatBytes(bytes: number): string {
  if (!Number.isSafeInteger(bytes) || bytes < 0) throw new RangeError(`Not a file size: ${bytes}`);
  if (bytes < 1024) return `${groupDigits(bytes)} ${SIZE_UNITS[0]}`;
  let unit = 1;
  let value = bytes / 1024;
  // Compared after rounding, so 1,023.95 KB reads 1 MB rather than 1,024 KB.
  while (unit < SIZE_UNITS.length - 1 && Math.round(value * 10) >= 10240) {
    value /= 1024;
    unit++;
  }
  const tenths = Math.round(value * 10);
  const decimal = tenths % 10;
  return `${groupDigits(Math.floor(tenths / 10))}${decimal === 0 ? '' : `.${decimal}`} ${SIZE_UNITS[unit]}`;
}
