/**
 * VND money (PROJECT-PLAN §4.4). An amount is a whole number of đồng — never a float — so sums
 * and comparisons are exact up to `Number.MAX_SAFE_INTEGER` (≈ 9 triệu tỷ). Vietnamese
 * conventions for output: `.` groups thousands, `,` marks decimals. Input accepts either mark
 * for either role, told apart by the digits that follow (`parseVnd`).
 */
export type Vnd = number;

export type VndParseError = 'empty' | 'negative' | 'format' | 'fraction' | 'too-large';

export type VndParseResult =
  | { readonly ok: true; readonly amount: Vnd }
  | { readonly ok: false; readonly error: VndParseError };

const UNIT_EXPONENTS: Readonly<Record<string, number>> = {
  tỷ: 9,
  tỉ: 9,
  ty: 9,
  ti: 9,
  triệu: 6,
  trieu: 6,
  tr: 6,
  nghìn: 3,
  nghin: 3,
  ngàn: 3,
  ngan: 3,
  k: 3,
};

const AMOUNT_PATTERN =
  /^([\d.,]+)\s*(tỷ|tỉ|ty|ti|triệu|trieu|tr|nghìn|nghin|ngàn|ngan|k)?\s*(?:₫|đồng|dong|đ|vnd)?$/;

/**
 * Reads an amount the way an RE types it: `500tr`, `1,2 tỷ`, `750k`, `500.000.000`, `500,000`,
 * `500000000 ₫`. `.` and `,` follow the same rule (see `splitNumber`), so `500,000` is 500 000
 * đồng and `1,500 tỷ` is 1 500 tỷ; `1,5 tỷ` is 1,5 tỷ. Anything below 1 đồng is an error, never
 * rounded away.
 */
export function parseVnd(text: string): VndParseResult {
  const trimmed = text.normalize('NFC').trim().toLowerCase();
  if (trimmed === '') return { ok: false, error: 'empty' };
  if (trimmed.startsWith('-') || trimmed.startsWith('−')) {
    const magnitude = parseVnd(trimmed.slice(1));
    return magnitude.ok ? { ok: false, error: 'negative' } : magnitude;
  }

  const match = AMOUNT_PATTERN.exec(trimmed);
  if (!match) return { ok: false, error: 'format' };
  const number = splitNumber(match[1] as string);
  if (!number) return { ok: false, error: 'format' };

  const exponent = match[2] === undefined ? 0 : (UNIT_EXPONENTS[match[2]] as number);
  const scale = exponent - number.fraction.length;
  let digits = number.integer + number.fraction;
  if (scale < 0) {
    if (!/^0*$/.test(digits.slice(scale))) return { ok: false, error: 'fraction' };
    digits = digits.slice(0, scale);
  }
  const amount = Number(digits + '0'.repeat(Math.max(scale, 0)));
  if (!Number.isSafeInteger(amount)) return { ok: false, error: 'too-large' };
  return { ok: true, amount };
}

/**
 * Integer and fraction digits of the number before the unit; null when malformed. `.` and `,` are
 * alike: a mark followed by exactly 3 digits groups thousands (`1.234.567`, `1,234,567`), with a
 * first group of 1–3 digits that is not `0`. A mark followed by 1–2 or 4+ digits, or a lone mark
 * after `0` (`0,500`), is the decimal mark; it comes last, once, and differs from the grouping
 * mark (`1.234,5`, `1,234.5`).
 */
function splitNumber(text: string): { integer: string; fraction: string } | null {
  const groups = text.split(/[.,]/);
  if (groups.includes('')) return null;
  const marks = text.replace(/\d/g, '');
  const head = groups[0] as string;
  const tail = groups.at(-1) as string;
  if (marks === '') return { integer: head, fraction: '' };

  const hasDecimal = tail.length !== 3 || (marks.length === 1 && head === '0');
  const fraction = hasDecimal ? tail : '';
  const integerGroups = hasDecimal ? groups.slice(0, -1) : groups;
  const separators = hasDecimal ? marks.slice(0, -1) : marks;
  if (separators === '') return { integer: head, fraction };

  const separator = separators[0] as string;
  if ([...separators].some((mark) => mark !== separator)) return null;
  if (hasDecimal && marks.at(-1) === separator) return null;
  if (!/^[1-9]\d{0,2}$/.test(head)) return null;
  if (integerGroups.slice(1).some((group) => group.length !== 3)) return null;
  return { integer: integerGroups.join(''), fraction };
}

function assertVnd(amount: Vnd): void {
  if (!Number.isSafeInteger(amount)) throw new RangeError(`Not a whole đồng amount: ${amount}`);
}

const groupThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+$)/g, '.');

/** Full form: `500.000.000 ₫`. */
export function formatVnd(amount: Vnd): string {
  assertVnd(amount);
  const sign = amount < 0 ? '-' : '';
  return `${sign}${groupThousands(Math.abs(amount))} ₫`;
}

const MILLION = 1_000_000;
const BILLION = 1_000_000_000;

/**
 * Compact form for KPIs and charts: `500 tr`, `1,2 tỷ`, `1.500 tỷ`, with up to 2 decimals.
 * Under 1 triệu the full form is shown. Rounding that reaches 1 000 tr shows `1 tỷ` instead.
 */
export function formatVndCompact(amount: Vnd): string {
  assertVnd(amount);
  const magnitude = Math.abs(amount);
  if (magnitude < MILLION) return formatVnd(amount);

  const sign = amount < 0 ? '-' : '';
  const millionHundredths = Math.round(magnitude / (MILLION / 100));
  const [unit, hundredths] =
    magnitude >= BILLION || millionHundredths >= 1000 * 100
      ? ['tỷ', Math.round(magnitude / (BILLION / 100))]
      : ['tr', millionHundredths];
  const whole = groupThousands(Math.floor(hundredths / 100));
  const decimals = String(hundredths % 100)
    .padStart(2, '0')
    .replace(/0+$/, '');
  return `${sign}${whole}${decimals ? `,${decimals}` : ''} ${unit}`;
}
