/**
 * VND money (PROJECT-PLAN §4.4). An amount is a whole number of đồng — never a float — so sums
 * and comparisons are exact up to `Number.MAX_SAFE_INTEGER` (≈ 9 triệu tỷ). Vietnamese
 * conventions for output: `.` groups thousands, `,` marks decimals. Input accepts either mark
 * for either role, told apart by the digits that follow (`parseVnd`).
 */
import type { Language } from './language';
import { groupDigits, groupThousands } from './number';
import { normalizeText } from './text';

export type Vnd = number;

/**
 * The largest fee — FYP nộp, FYP phát hành, case size dự kiến — the commands and a backup accept:
 * 100 tỷ đồng (Owner, 06/10/2026, DR-23). Totals of up to ~90 000 such fees stay exact. A sum
 * insured, should one be recorded, is not a fee and has no such cap.
 */
export const MAX_FEE_VND: Vnd = 100_000_000_000;

/** `total + amount`, or a `RangeError` when the sum is past a safe integer and so not exact. */
export function addVnd(total: Vnd, amount: Vnd): Vnd {
  const sum = total + amount;
  if (!Number.isSafeInteger(sum)) throw new RangeError(`Total past a safe integer: ${sum}`);
  return sum;
}

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

/*
 * Matched on `normalizeText`, where every run of white space is one space, so each optional space
 * is a single character and the pattern never backtracks over a long run of them (DR-38).
 */
const AMOUNT_PATTERN =
  /^([\d.,]+(?: \d+)*)(?: ?(tỷ|tỉ|ty|ti|triệu|trieu|tr|nghìn|nghin|ngàn|ngan|k)(?: ?(\d+))?)? ?(?:₫|đồng|dong|đ|vnđ|vnd)?$/;

/** Thousands grouped by spaces: `500 000 000`, `1 500`. */
const SPACE_GROUPED = /^[1-9]\d{0,2}(?: \d{3})+$/;

/**
 * Reads an amount the way an RM types it: `500tr`, `1,2 tỷ`, `750k`, `500.000.000`, `500,000`,
 * `500 000 000`, `500000000 ₫`, `500.000 VNĐ`. `.` and `,` follow the same rule (see
 * `splitNumber`), so `500,000` is 500 000 đồng and `1,500 tỷ` is 1 500 tỷ; `1,5 tỷ` is 1,5 tỷ.
 * Digits after the unit are said as the next group of three below it (see `spokenTail`): `1tr5` is
 * 1 triệu 500 nghìn, `1tr50` is 1 triệu 50 nghìn, `1 tỷ 2` is 1 tỷ 200 triệu. One unit per amount.
 * Anything below 1 đồng is an error, never rounded away. The text is read as `normalizeText` keeps
 * it, so an amount pasted with an invisible character reads as on screen (DR6-110).
 */
export function parseVnd(text: string): VndParseResult {
  let body = normalizeText(text).toLowerCase();
  if (body === '') return { ok: false, error: 'empty' };
  // The sign is read once (DR-32): `--500` is malformed, not a negative of a negative.
  const negative = body.startsWith('-') || body.startsWith('−');
  if (negative) body = body.slice(1).trimStart();
  const magnitude = parseMagnitude(body);
  return negative && magnitude.ok ? { ok: false, error: 'negative' } : magnitude;
}

function parseMagnitude(text: string): VndParseResult {
  const match = AMOUNT_PATTERN.exec(text);
  if (!match) return { ok: false, error: 'format' };
  const written = match[1] as string;
  const number = written.includes(' ')
    ? SPACE_GROUPED.test(written)
      ? { integer: written.replaceAll(' ', ''), fraction: '' }
      : null
    : splitNumber(written);
  if (!number) return { ok: false, error: 'format' };

  const exponent = match[2] === undefined ? 0 : (UNIT_EXPONENTS[match[2]] as number);
  const tail = match[3];
  if (tail !== undefined) {
    const group = spokenTail(tail);
    if (group === null || number.fraction !== '') return { ok: false, error: 'format' };
    return wholeAmount(number.integer + group + '0'.repeat(exponent - 3));
  }

  const scale = exponent - number.fraction.length;
  let digits = number.integer + number.fraction;
  if (scale < 0) {
    if (!/^0*$/.test(digits.slice(scale))) return { ok: false, error: 'fraction' };
    digits = digits.slice(0, scale);
  }
  return wholeAmount(digits + '0'.repeat(Math.max(scale, 0)));
}

/**
 * The three digits of the group below the unit, as the digits after it are said: one digit is
 * hundreds (`1tr5` → 500 nghìn), two are tens (`1tr50` → 050), three are the whole group. Null
 * past three digits.
 */
function spokenTail(tail: string): string | null {
  if (tail.length > 3) return null;
  return tail.length === 1 ? `${tail}00` : tail.padStart(3, '0');
}

function wholeAmount(digits: string): VndParseResult {
  const amount = Number(digits);
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

/** A difference in the compact form, always signed with `−` (U+2212) or `+`; no sign for 0. */
export function formatVndDelta(amount: Vnd): string {
  const magnitude = formatVndCompact(Math.abs(amount));
  if (amount === 0) return magnitude;
  return `${amount < 0 ? '−' : '+'}${magnitude}`;
}

/*
 * Money in the currency of the data (ADR-0018 §2–§4; golden `docs/golden/so-va-tien-te.md`
 * §1–§4), written the Excel way in every language: `,` groups thousands, `.` marks decimals. The
 * VND functions above stay until the app moves over (G-03a, G-03b, G-04). No `Intl`: the table
 * below writes the same on every webview (ADR-0018 §4, option 5).
 */

/** The seven currencies a data set may use, chosen once at set-up (ADR-0018 §2). */
export const CURRENCY_CODES = ['VND', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD'] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/**
 * An amount as a whole number of the currency's smallest unit — đồng for VND, cents for the
 * others — never a float, so sums are exact up to `Number.MAX_SAFE_INTEGER`. An amount carries no
 * currency of its own: the currency is the data set's, passed to each function.
 */
export type Money = number;

export interface Currency {
  /** Digits after the decimal mark: 0 for VND, 2 for money with cents. */
  readonly decimals: 0 | 2;
  /** `VNĐ`, `$`, `€`, `£`. */
  readonly symbol: string;
  /**
   * VND writes its symbol after the number, a space between (`3,000,000 VNĐ`); the others before
   * it, joined (`$1,250.50`).
   */
  readonly symbolPosition: 'before' | 'after';
  /** The dollars other than USD add their code to the full form, `$1,250.50 AUD` (Q1). */
  readonly codeAfter: boolean;
  /** The largest fee: 100 Billions major units, as stored (DR-23 for VND). */
  readonly maxFee: Money;
}

const CENTS_CAP: Money = 10_000_000_000_000;

export const CURRENCIES: Readonly<Record<CurrencyCode, Currency>> = {
  VND: {
    decimals: 0,
    symbol: 'VNĐ',
    symbolPosition: 'after',
    codeAfter: false,
    maxFee: 100_000_000_000,
  },
  USD: { decimals: 2, symbol: '$', symbolPosition: 'before', codeAfter: false, maxFee: CENTS_CAP },
  EUR: { decimals: 2, symbol: '€', symbolPosition: 'before', codeAfter: false, maxFee: CENTS_CAP },
  GBP: { decimals: 2, symbol: '£', symbolPosition: 'before', codeAfter: false, maxFee: CENTS_CAP },
  AUD: { decimals: 2, symbol: '$', symbolPosition: 'before', codeAfter: true, maxFee: CENTS_CAP },
  CAD: { decimals: 2, symbol: '$', symbolPosition: 'before', codeAfter: true, maxFee: CENTS_CAP },
  SGD: { decimals: 2, symbol: '$', symbolPosition: 'before', codeAfter: true, maxFee: CENTS_CAP },
};

/**
 * The largest fee — FYP nộp, FYP phát hành, case size dự kiến — in `currency`: 100 Billions of its
 * major unit (ADR-0018 §3). Totals stay exact up to 90,071 such fees in VND and 900 in cents.
 */
export function maxFee(currency: CurrencyCode): Money {
  return CURRENCIES[currency].maxFee;
}

/** `total + amount`, or a `RangeError` when the sum is past a safe integer and so not exact. */
export function addMoney(total: Money, amount: Money): Money {
  const sum = total + amount;
  if (!Number.isSafeInteger(sum)) throw new RangeError(`Total past a safe integer: ${sum}`);
  return sum;
}

function assertMoney(amount: Money): void {
  if (!Number.isSafeInteger(amount)) throw new RangeError(`Not a whole amount: ${amount}`);
}

/**
 * Full form, the same in both languages (ADR-0018 §4): `3,000,000 VNĐ`, `$1,250.50`,
 * `$1,250.50 AUD`; money with cents always has two decimals (Q2). A negative amount has `-` in
 * front, before the symbol: `-$1,250.50` (Q4).
 */
export function formatMoney(amount: Money, currency: CurrencyCode): string {
  assertMoney(amount);
  const { decimals, symbol, symbolPosition, codeAfter } = CURRENCIES[currency];
  const major = 10 ** decimals;
  const magnitude = Math.abs(amount);
  // Whole numbers only, so the cents of an amount near the safe limit stay exact.
  const minor = magnitude % major;
  const whole = groupDigits((magnitude - minor) / major);
  const number = decimals === 0 ? whole : `${whole}.${String(minor).padStart(decimals, '0')}`;
  const before = symbolPosition === 'before' ? symbol : '';
  const after = `${symbolPosition === 'after' ? ` ${symbol}` : ''}${codeAfter ? ` ${currency}` : ''}`;
  return `${amount < 0 ? '-' : ''}${before}${number}${after}`;
}

/** A unit of the compact form: a power of ten of the major unit, and its word (ADR-0018 §9). */
interface CompactUnit {
  readonly exponent: number;
  readonly word: string;
}

/**
 * The compact form's units, smallest first (ADR-0018 §4). Vietnamese stops at tỷ (Q3): a larger
 * amount is still counted in tỷ, `1,500 tỷ`. English goes on to T.
 */
const COMPACT_UNITS: Readonly<Record<Language, readonly [CompactUnit, ...CompactUnit[]]>> = {
  vi: [
    { exponent: 3, word: 'K' },
    { exponent: 6, word: 'tr' },
    { exponent: 9, word: 'tỷ' },
  ],
  en: [
    { exponent: 3, word: 'K' },
    { exponent: 6, word: 'Mil' },
    { exponent: 9, word: 'Bil' },
    { exponent: 12, word: 'T' },
  ],
};

/**
 * `magnitude ÷ size` in hundredths, rounded half away from zero. Whole numbers only: `size` is a
 * power of ten of at least 1,000, so the step is a whole number and the result is exact.
 */
function hundredthsOf(magnitude: Money, size: number): number {
  const step = size / 100;
  const rest = magnitude % step;
  return (magnitude - rest) / step + (rest * 2 >= step ? 1 : 0);
}

/**
 * Compact form for KPIs, charts and narrow columns (ADR-0018 §4): `750K`, `1.9 tỷ` / `1.9 Bil`,
 * `$1.25K`, `$1.2 Mil`, up to two decimals. Under 1,000 major units the full form is shown. VND
 * drops `VNĐ`; money with cents keeps its symbol but not its code, `$250K` (Q1). A one-letter unit
 * is joined to the number, a longer one stands after a space (Q5). Money with cents goes with
 * English only: `language` does not change its text.
 */
export function formatMoneyCompact(
  amount: Money,
  currency: CurrencyCode,
  language: Language,
): string {
  assertMoney(amount);
  const { decimals, symbol, symbolPosition } = CURRENCIES[currency];
  const major = 10 ** decimals;
  const magnitude = Math.abs(amount);
  if (magnitude < 1000 * major) return formatMoney(amount, currency);

  const [smallest, ...larger] = COMPACT_UNITS[currency === 'VND' ? language : 'en'];
  const shownIn = ({ exponent, word }: CompactUnit) => ({
    hundredths: hundredthsOf(magnitude, 10 ** exponent * major),
    word,
  });
  let shown = shownIn(smallest);
  // Rounding that reaches 1,000 of a unit shows the next one: 999,995 đồng is `1 tr`, not `1,000K`.
  for (const unit of larger) {
    if (shown.hundredths < 100_000) break;
    shown = shownIn(unit);
  }
  const fraction = shown.hundredths % 100;
  const whole = groupDigits((shown.hundredths - fraction) / 100);
  const decimal = String(fraction).padStart(2, '0').replace(/0+$/, '');
  const before = symbolPosition === 'before' ? symbol : '';
  const space = shown.word.length === 1 ? '' : ' ';
  return `${amount < 0 ? '-' : ''}${before}${whole}${decimal ? `.${decimal}` : ''}${space}${shown.word}`;
}

/** A difference in the compact form, signed with `−` (U+2212) or `+`; no sign for 0 (ADR-0018 §4). */
export function formatMoneyDelta(
  amount: Money,
  currency: CurrencyCode,
  language: Language,
): string {
  const magnitude = formatMoneyCompact(Math.abs(amount), currency, language);
  if (amount === 0) return magnitude;
  return `${amount < 0 ? '−' : '+'}${magnitude}`;
}
