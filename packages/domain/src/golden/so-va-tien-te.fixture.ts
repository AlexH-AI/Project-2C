/**
 * Golden numbers and currencies (`docs/golden/so-va-tien-te.md` §1–§6; ADR-0018 §3–§5), approved
 * by the Owner at G2 on 12/11/2026 (T-418, PR #1222); I41 and X35 at G2 on 14/11/2026 (T-439).
 * One element per golden row, under the row's code, written by hand from the golden file. Never
 * edit it to make a test green: a change goes through the Owner again (G2). Dates (§7) are G-07.
 */
import type { Language } from '../language';
import type { CurrencyCode, Money, MoneyParseError } from '../money';

/** A row of §1, the currency table: one per currency, in the golden's order. */
export interface CurrencyGoldenRow {
  readonly currency: CurrencyCode;
  /** Digits after the decimal mark: 0 for VND, 2 for money with cents. */
  readonly decimals: 0 | 2;
  /** The stored amount of the table's examples: `3000000` VND, `125050` cents. */
  readonly example: Money;
  /** The full form of `example`. */
  readonly full: string;
  /** The compact form of `example`; null for VND, whose cell gives no number. */
  readonly compact: string | null;
  /** The fee cap, 100 Billions major units, as stored. */
  readonly maxFee: Money;
  /** Fees at the cap that still add up exactly: `MAX_SAFE_INTEGER` ÷ the cap, rounded down. */
  readonly exactFees: number;
}

export const CURRENCY_GOLDEN_ROWS: readonly CurrencyGoldenRow[] = [
  {
    currency: 'VND',
    decimals: 0,
    example: 3000000,
    full: '3,000,000 VNĐ',
    compact: null,
    maxFee: 100000000000,
    exactFees: 90071,
  },
  {
    currency: 'USD',
    decimals: 2,
    example: 125050,
    full: '$1,250.50',
    compact: '$1.25K',
    maxFee: 10000000000000,
    exactFees: 900,
  },
  {
    currency: 'EUR',
    decimals: 2,
    example: 125050,
    full: '€1,250.50',
    compact: '€1.25K',
    maxFee: 10000000000000,
    exactFees: 900,
  },
  {
    currency: 'GBP',
    decimals: 2,
    example: 125050,
    full: '£1,250.50',
    compact: '£1.25K',
    maxFee: 10000000000000,
    exactFees: 900,
  },
  {
    currency: 'AUD',
    decimals: 2,
    example: 125050,
    full: '$1,250.50 AUD',
    compact: '$1.25K',
    maxFee: 10000000000000,
    exactFees: 900,
  },
  {
    currency: 'CAD',
    decimals: 2,
    example: 125050,
    full: '$1,250.50 CAD',
    compact: '$1.25K',
    maxFee: 10000000000000,
    exactFees: 900,
  },
  {
    currency: 'SGD',
    decimals: 2,
    example: 125050,
    full: '$1,250.50 SGD',
    compact: '$1.25K',
    maxFee: 10000000000000,
    exactFees: 900,
  },
];

/** A row of §2, the full form: the same in both languages. */
export interface FullGoldenRow {
  readonly id: string;
  readonly amount: Money;
  readonly currency: CurrencyCode;
  readonly text: string;
}

export const FULL_GOLDEN_ROWS: readonly FullGoldenRow[] = [
  { id: 'F01', amount: 0, currency: 'VND', text: '0 VNĐ' },
  { id: 'F02', amount: 999, currency: 'VND', text: '999 VNĐ' },
  { id: 'F03', amount: 1000, currency: 'VND', text: '1,000 VNĐ' },
  { id: 'F04', amount: 3000000, currency: 'VND', text: '3,000,000 VNĐ' },
  { id: 'F05', amount: 500000000, currency: 'VND', text: '500,000,000 VNĐ' },
  { id: 'F06', amount: 1900000000, currency: 'VND', text: '1,900,000,000 VNĐ' },
  { id: 'F07', amount: 100000000000, currency: 'VND', text: '100,000,000,000 VNĐ' },
  { id: 'F08', amount: -3000000, currency: 'VND', text: '-3,000,000 VNĐ' },
  { id: 'F09', amount: 0, currency: 'USD', text: '$0.00' },
  { id: 'F10', amount: 5, currency: 'USD', text: '$0.05' },
  { id: 'F11', amount: 125050, currency: 'USD', text: '$1,250.50' },
  { id: 'F12', amount: 125000, currency: 'USD', text: '$1,250.00' },
  { id: 'F13', amount: -125050, currency: 'USD', text: '-$1,250.50' },
  { id: 'F14', amount: 10000000000000, currency: 'USD', text: '$100,000,000,000.00' },
  { id: 'F15', amount: 25000000, currency: 'EUR', text: '€250,000.00' },
  { id: 'F16', amount: 9999, currency: 'GBP', text: '£99.99' },
  { id: 'F17', amount: 125050, currency: 'AUD', text: '$1,250.50 AUD' },
  { id: 'F18', amount: 125050, currency: 'CAD', text: '$1,250.50 CAD' },
  { id: 'F19', amount: 125050, currency: 'SGD', text: '$1,250.50 SGD' },
  { id: 'F20', amount: -125050, currency: 'AUD', text: '-$1,250.50 AUD' },
  { id: 'F21', amount: 0, currency: 'AUD', text: '$0.00 AUD' },
];

/**
 * A row of §3 (compact form) or §4 (difference). `vi` is null where the golden writes "—": money
 * with cents goes with English only, and the language does not change its text.
 */
export interface CompactGoldenRow {
  readonly id: string;
  readonly amount: Money;
  readonly currency: CurrencyCode;
  readonly vi: string | null;
  readonly en: string;
}

export const COMPACT_GOLDEN_ROWS: readonly CompactGoldenRow[] = [
  { id: 'C01', amount: 0, currency: 'VND', vi: '0 VNĐ', en: '0 VNĐ' },
  { id: 'C02', amount: 950, currency: 'VND', vi: '950 VNĐ', en: '950 VNĐ' },
  { id: 'C03', amount: 999, currency: 'VND', vi: '999 VNĐ', en: '999 VNĐ' },
  { id: 'C04', amount: 1000, currency: 'VND', vi: '1K', en: '1K' },
  { id: 'C05', amount: 750000, currency: 'VND', vi: '750K', en: '750K' },
  { id: 'C06', amount: 999994, currency: 'VND', vi: '999.99K', en: '999.99K' },
  { id: 'C07', amount: 999995, currency: 'VND', vi: '1 tr', en: '1 Mil' },
  { id: 'C08', amount: 1000000, currency: 'VND', vi: '1 tr', en: '1 Mil' },
  { id: 'C09', amount: 1950000, currency: 'VND', vi: '1.95 tr', en: '1.95 Mil' },
  { id: 'C10', amount: 1955000, currency: 'VND', vi: '1.96 tr', en: '1.96 Mil' },
  { id: 'C11', amount: 500000000, currency: 'VND', vi: '500 tr', en: '500 Mil' },
  { id: 'C12', amount: 999994999, currency: 'VND', vi: '999.99 tr', en: '999.99 Mil' },
  { id: 'C13', amount: 999995000, currency: 'VND', vi: '1 tỷ', en: '1 Bil' },
  { id: 'C14', amount: 1900000000, currency: 'VND', vi: '1.9 tỷ', en: '1.9 Bil' },
  { id: 'C15', amount: 1234567890, currency: 'VND', vi: '1.23 tỷ', en: '1.23 Bil' },
  { id: 'C16', amount: 100000000000, currency: 'VND', vi: '100 tỷ', en: '100 Bil' },
  { id: 'C17', amount: 999995000000, currency: 'VND', vi: '1,000 tỷ', en: '1T' },
  { id: 'C18', amount: 1500000000000, currency: 'VND', vi: '1,500 tỷ', en: '1.5T' },
  { id: 'C19', amount: -1200000000, currency: 'VND', vi: '-1.2 tỷ', en: '-1.2 Bil' },
  { id: 'C20', amount: 0, currency: 'USD', vi: null, en: '$0.00' },
  { id: 'C21', amount: 95050, currency: 'USD', vi: null, en: '$950.50' },
  { id: 'C22', amount: 99999, currency: 'USD', vi: null, en: '$999.99' },
  { id: 'C23', amount: 100000, currency: 'USD', vi: null, en: '$1K' },
  { id: 'C24', amount: 125050, currency: 'USD', vi: null, en: '$1.25K' },
  { id: 'C25', amount: 25000000, currency: 'USD', vi: null, en: '$250K' },
  { id: 'C26', amount: 99999500, currency: 'USD', vi: null, en: '$1 Mil' },
  { id: 'C27', amount: 120000000, currency: 'USD', vi: null, en: '$1.2 Mil' },
  { id: 'C28', amount: 190000000000, currency: 'USD', vi: null, en: '$1.9 Bil' },
  { id: 'C29', amount: 10000000000000, currency: 'USD', vi: null, en: '$100 Bil' },
  { id: 'C30', amount: 250000000000000, currency: 'USD', vi: null, en: '$2.5T' },
  { id: 'C31', amount: -125050, currency: 'USD', vi: null, en: '-$1.25K' },
  { id: 'C32', amount: 25000000, currency: 'EUR', vi: null, en: '€250K' },
  { id: 'C33', amount: 120000000, currency: 'GBP', vi: null, en: '£1.2 Mil' },
  { id: 'C34', amount: 25000000, currency: 'AUD', vi: null, en: '$250K' },
  { id: 'C35', amount: 120000000, currency: 'CAD', vi: null, en: '$1.2 Mil' },
  { id: 'C36', amount: 10000, currency: 'AUD', vi: null, en: '$100.00 AUD' },
];

/** §4: a difference is signed with "−" (U+2212) or "+"; 0 has no sign. */
export const DELTA_GOLDEN_ROWS: readonly CompactGoldenRow[] = [
  { id: 'D01', amount: 0, currency: 'VND', vi: '0 VNĐ', en: '0 VNĐ' },
  { id: 'D02', amount: 200000000, currency: 'VND', vi: '+200 tr', en: '+200 Mil' },
  { id: 'D03', amount: -1200000000, currency: 'VND', vi: '−1.2 tỷ', en: '−1.2 Bil' },
  { id: 'D04', amount: 0, currency: 'USD', vi: null, en: '$0.00' },
  { id: 'D05', amount: 25000000, currency: 'USD', vi: null, en: '+$250K' },
  { id: 'D06', amount: -125050, currency: 'USD', vi: null, en: '−$1.25K' },
  { id: 'D07', amount: -125050, currency: 'AUD', vi: null, en: '−$1.25K' },
];

/**
 * A row of §5: the same in both languages. A percentage is written as the golden writes it, with
 * its "%": the function gives the number and the interface adds the sign.
 */
export interface NumberGoldenRow {
  readonly id: string;
  readonly kind: 'count' | 'percentage' | 'bytes';
  readonly input: number;
  readonly text: string;
}

export const NUMBER_GOLDEN_ROWS: readonly NumberGoldenRow[] = [
  { id: 'N01', kind: 'count', input: 0, text: '0' },
  { id: 'N02', kind: 'count', input: 1204, text: '1,204' },
  { id: 'N03', kind: 'count', input: 1000000, text: '1,000,000' },
  { id: 'N04', kind: 'percentage', input: 66.6666, text: '66.7%' },
  { id: 'N05', kind: 'percentage', input: 100, text: '100%' },
  { id: 'N06', kind: 'percentage', input: 150, text: '150%' },
  { id: 'N07', kind: 'percentage', input: -2.44, text: '-2.4%' },
  { id: 'N08', kind: 'percentage', input: -0.04, text: '0%' },
  { id: 'N09', kind: 'percentage', input: 0.05, text: '0.1%' },
  { id: 'N10', kind: 'percentage', input: 1234.56, text: '1,234.6%' },
  { id: 'N11', kind: 'bytes', input: 0, text: '0 B' },
  { id: 'N12', kind: 'bytes', input: 1023, text: '1,023 B' },
  { id: 'N13', kind: 'bytes', input: 1024, text: '1 KB' },
  { id: 'N14', kind: 'bytes', input: 1536, text: '1.5 KB' },
  { id: 'N15', kind: 'bytes', input: 1048524, text: '1,023.9 KB' },
  { id: 'N16', kind: 'bytes', input: 1048525, text: '1 MB' },
  { id: 'N17', kind: 'bytes', input: 3250585, text: '3.1 MB' },
];

/**
 * The language of a §6 row: `both` where the golden writes "cả hai", read the same in the two
 * languages. Money with cents goes with English only.
 */
export type GoldenLanguage = Language | 'both';

/** A row of §6.1: what is typed, and the amount stored. */
export interface InputGoldenRow {
  readonly id: string;
  readonly text: string;
  readonly currency: CurrencyCode;
  readonly language: GoldenLanguage;
  readonly amount: Money;
  /** "Đọc thành": the full form of `amount`. */
  readonly read: string;
}

const input = (
  id: string,
  text: string,
  currency: CurrencyCode,
  language: GoldenLanguage,
  amount: Money,
  read: string,
): InputGoldenRow => ({ id, text, currency, language, amount, read });

export const INPUT_GOLDEN_ROWS: readonly InputGoldenRow[] = [
  input('I01', '3000000', 'VND', 'both', 3000000, '3,000,000 VNĐ'),
  input('I02', '3,000,000', 'VND', 'both', 3000000, '3,000,000 VNĐ'),
  input('I03', '3,000,000 VNĐ', 'VND', 'both', 3000000, '3,000,000 VNĐ'),
  input('I04', '3,000,000 ₫', 'VND', 'both', 3000000, '3,000,000 VNĐ'),
  input('I05', '3,000,000đ', 'VND', 'both', 3000000, '3,000,000 VNĐ'),
  input('I06', '500tr', 'VND', 'vi', 500000000, '500,000,000 VNĐ'),
  input('I07', '500 triệu', 'VND', 'vi', 500000000, '500,000,000 VNĐ'),
  input('I08', '1.5 tỷ', 'VND', 'vi', 1500000000, '1,500,000,000 VNĐ'),
  input('I09', '0.5 tỷ', 'VND', 'vi', 500000000, '500,000,000 VNĐ'),
  input('I10', '1.25 tr', 'VND', 'vi', 1250000, '1,250,000 VNĐ'),
  input('I11', '750k', 'VND', 'both', 750000, '750,000 VNĐ'),
  input('I12', '750 nghìn', 'VND', 'vi', 750000, '750,000 VNĐ'),
  input('I13', '1.9 Bil', 'VND', 'en', 1900000000, '1,900,000,000 VNĐ'),
  input('I14', '500 Mil', 'VND', 'en', 500000000, '500,000,000 VNĐ'),
  input('I15', '1,500', 'VND', 'both', 1500, '1,500 VNĐ'),
  input('I16', '2.05 tỷ', 'VND', 'vi', 2050000000, '2,050,000,000 VNĐ'),
  input('I17', '1tr5', 'VND', 'vi', 1500000, '1,500,000 VNĐ'),
  input('I18', '1 tỷ 2', 'VND', 'vi', 1200000000, '1,200,000,000 VNĐ'),
  input('I19', '1250.5', 'USD', 'en', 125050, '$1,250.50'),
  input('I20', '1,250.50', 'USD', 'en', 125050, '$1,250.50'),
  input('I21', '$1,250.50', 'USD', 'en', 125050, '$1,250.50'),
  input('I22', '$ 1,250.50', 'USD', 'en', 125050, '$1,250.50'),
  input('I23', '1,250.50 USD', 'USD', 'en', 125050, '$1,250.50'),
  input('I24', 'USD 1,250.50', 'USD', 'en', 125050, '$1,250.50'),
  input('I25', '0.05', 'USD', 'en', 5, '$0.05'),
  input('I26', '250K', 'USD', 'en', 25000000, '$250,000.00'),
  input('I27', '$1.2 Mil', 'USD', 'en', 120000000, '$1,200,000.00'),
  input('I28', '1.2345 Mil', 'USD', 'en', 123450000, '$1,234,500.00'),
  input('I29', '1.5 Bil', 'USD', 'en', 150000000000, '$1,500,000,000.00'),
  input('I30', '€250K', 'EUR', 'en', 25000000, '€250,000.00'),
  input('I31', '250,000.00 EUR', 'EUR', 'en', 25000000, '€250,000.00'),
  input('I32', '£1,250.5', 'GBP', 'en', 125050, '£1,250.50'),
  input('I33', '$100', 'AUD', 'en', 10000, '$100.00 AUD'),
  input('I34', '$100 AUD', 'AUD', 'en', 10000, '$100.00 AUD'),
  input('I35', '1,000 CAD', 'CAD', 'en', 100000, '$1,000.00 CAD'),
  input('I36', '$99.90', 'SGD', 'en', 9990, '$99.90 SGD'),
  input('I37', '1.500 Mil', 'USD', 'en', 150000000, '$1,500,000.00'),
  input('I38', '1.500', 'USD', 'en', 150, '$1.50'),
  input('I39', '0.500 tr', 'VND', 'vi', 500000, '500,000 VNĐ'),
  input('I40', '1.500', 'EUR', 'en', 150, '€1.50'),
  input('I41', '1,234.567 tr', 'VND', 'vi', 1234567000, '1,234,567,000 VNĐ'),
];

/**
 * A row of §6.2: what is typed, the error, and the ways of writing it offered under the field, in
 * the golden's order ("—" is none).
 *
 * How a suggestion is written (a review note of PR #1222, read from X04, X28, X31; not in the
 * ADR): it keeps what was typed — the currency mark, the case, the unit joined or spaced. A unit
 * changed to the interface language is written in the compact form's way (Q5): K joined to the
 * number; Mil, Bil, tr, tỷ after a space. `1.500tr` → `1.5tr` · `1,500tr`; `500tr` in English →
 * `500 Mil`.
 */
export interface RefusedGoldenRow {
  readonly id: string;
  readonly text: string;
  readonly currency: CurrencyCode;
  readonly language: GoldenLanguage;
  readonly error: MoneyParseError;
  readonly suggestions: readonly string[];
}

const refused = (
  id: string,
  text: string,
  currency: CurrencyCode,
  language: GoldenLanguage,
  error: MoneyParseError,
  suggestions: readonly string[] = [],
): RefusedGoldenRow => ({ id, text, currency, language, error, suggestions });

export const REFUSED_GOLDEN_ROWS: readonly RefusedGoldenRow[] = [
  refused('X01', '1,5 tỷ', 'VND', 'vi', 'format', ['1.5 tỷ']),
  refused('X02', '0,5 tỷ', 'VND', 'vi', 'format', ['0.5 tỷ']),
  refused('X03', '500.000.000', 'VND', 'both', 'format', ['500,000,000']),
  refused('X04', '500.000.000 VNĐ', 'VND', 'both', 'format', ['500,000,000 VNĐ']),
  refused('X05', '1.500', 'VND', 'both', 'fraction', ['1,500']),
  refused('X06', '1.234,5 tr', 'VND', 'vi', 'format', ['1,234.5 tr']),
  refused('X07', '500 000 000', 'VND', 'both', 'format', ['500,000,000']),
  refused('X08', '1,5', 'VND', 'both', 'format'),
  refused('X09', '1,50', 'VND', 'both', 'format'),
  refused('X10', '12,34,567', 'VND', 'both', 'format'),
  refused('X11', ',500', 'VND', 'both', 'format'),
  refused('X12', '1.0000000001 tỷ', 'VND', 'vi', 'fraction'),
  refused('X13', '1.5 T', 'VND', 'both', 'format'),
  refused('X14', '1.5m', 'VND', 'both', 'format'),
  refused('X15', '$500', 'VND', 'both', 'format'),
  refused('X16', '-500tr', 'VND', 'vi', 'negative'),
  refused('X17', '', 'VND', 'both', 'empty'),
  refused('X18', '99,999,999,999,999,999', 'VND', 'both', 'too-large'),
  refused('X19', '1.505', 'USD', 'en', 'fraction', ['1,505']),
  refused('X20', '1,250.505', 'USD', 'en', 'fraction'),
  refused('X21', '12,34', 'USD', 'en', 'format', ['12.34']),
  refused('X22', '1.234,56', 'USD', 'en', 'format', ['1,234.56']),
  refused('X23', '1.234,56 €', 'EUR', 'en', 'format'),
  refused('X24', '€100', 'USD', 'en', 'format'),
  refused('X25', '1.234567891 Mil', 'USD', 'en', 'fraction'),
  refused('X26', '1.500 tr', 'VND', 'vi', 'ambiguous', ['1.5 tr', '1,500 tr']),
  refused('X27', '1.500 tỷ', 'VND', 'vi', 'ambiguous', ['1.5 tỷ', '1,500 tỷ']),
  refused('X28', '1.500k', 'VND', 'both', 'ambiguous', ['1.5k', '1,500k']),
  refused('X29', '1.500 Mil', 'VND', 'en', 'ambiguous', ['1.5 Mil', '1,500 Mil']),
  refused('X30', '500 Mil', 'VND', 'vi', 'format', ['500 tr']),
  refused('X31', '500tr', 'VND', 'en', 'format', ['500 Mil']),
  refused('X32', '1tr5', 'VND', 'en', 'format'),
  refused('X33', '1.5 tr', 'USD', 'en', 'format', ['1.5 Mil']),
  refused('X34', 'A$100', 'AUD', 'en', 'format'),
  refused('X35', '1.234 tr', 'VND', 'vi', 'ambiguous', ['1,234,000', '1,234 tr']),
];

/**
 * A row of §6.3: read, then a fee or not. The amount is read even past the cap; the commands check
 * the cap (`maxFee`).
 */
export interface CapGoldenRow {
  readonly id: string;
  readonly text: string;
  readonly currency: CurrencyCode;
  readonly language: GoldenLanguage;
  readonly amount: Money;
  /** "Là phí?": whether the amount is a fee, at most the cap. */
  readonly isFee: boolean;
}

const cap = (
  id: string,
  text: string,
  currency: CurrencyCode,
  language: GoldenLanguage,
  amount: Money,
  isFee: boolean,
): CapGoldenRow => ({ id, text, currency, language, amount, isFee });

export const CAP_GOLDEN_ROWS: readonly CapGoldenRow[] = [
  cap('M01', '100 tỷ', 'VND', 'vi', 100000000000, true),
  cap('M02', '100,000,000,001', 'VND', 'both', 100000000001, false),
  cap('M03', '100.000000001 tỷ', 'VND', 'vi', 100000000001, false),
  cap('M04', '1,500 tỷ', 'VND', 'vi', 1500000000000, false),
  cap('M05', '100 Bil', 'USD', 'en', 10000000000000, true),
  cap('M06', '100,000,000,000.01', 'USD', 'en', 10000000000001, false),
  cap('M07', '100.01 Bil', 'USD', 'en', 10001000000000, false),
];
