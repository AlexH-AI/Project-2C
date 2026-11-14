import { describe, expect, it } from 'vitest';
import {
  CAP_GOLDEN_ROWS,
  COMPACT_GOLDEN_ROWS,
  CURRENCY_GOLDEN_ROWS,
  DELTA_GOLDEN_ROWS,
  FULL_GOLDEN_ROWS,
  INPUT_GOLDEN_ROWS,
  REFUSED_GOLDEN_ROWS,
  type CompactGoldenRow,
  type GoldenLanguage,
} from './golden/so-va-tien-te.fixture';
import { LANGUAGES, type Language } from './language';
import {
  addMoney,
  CURRENCIES,
  CURRENCY_CODES,
  formatMoney,
  formatMoneyCompact,
  formatMoneyDelta,
  languageFor,
  MAX_FEE_VND,
  maxFee,
  parseMoney,
} from './money';
import { normalizeText } from './text';

describe('MAX_FEE_VND', () => {
  // Owner, 06/10/2026 (DR-23): a fee — FYP or case size — is at most 100 tỷ đồng.
  it('is 100 tỷ đồng', () => {
    expect(MAX_FEE_VND).toBe(100_000_000_000);
    expect(parseMoney('100 tỷ', 'VND', 'vi')).toEqual({ ok: true, amount: MAX_FEE_VND });
  });
});

// A form fills its money field with the amount as shown (`policy-form.ts`, `MetFields.tsx`), and
// `parseMoney` reads the field (G-03b): what the app writes must read back as the same amount.
describe('parseMoney reads back VND as the app shows it', () => {
  it.each([1_200_000_000, 500_000_000, 1_000_000_000, 1_500_000, 1_500_000_000_000, 750_000, 0])(
    'reads back %d from its compact form',
    (amount) => {
      const shown = formatMoneyCompact(amount, 'VND', 'vi');
      expect(parseMoney(shown, 'VND', 'vi')).toEqual({ ok: true, amount });
    },
  );

  it.each(LANGUAGES)('reads back the full form in %s', (language) => {
    for (const amount of [1_234_567, 500_000_000, 950]) {
      expect(parseMoney(formatMoney(amount, 'VND'), 'VND', language)).toEqual({ ok: true, amount });
    }
  });
});

// The reading of today (`splitNumber`), kept for the suggestions only (ADR-0018 §5): a number it
// reads is offered in the new marks; one it does not read is offered nothing.
describe('parseMoney offers the reading of today, never applies it', () => {
  const refused = (error: string, suggestions: readonly string[] = []) => ({
    ok: false,
    error,
    suggestions,
  });

  it.each([
    ['1,2 tỷ', ['1.2 tỷ']],
    ['1,20 tỷ', ['1.20 tỷ']],
    ['1,25 tỷ', ['1.25 tỷ']],
    ['1.234,5 tr', ['1,234.5 tr']],
    ['500.000.000 vnđ', ['500,000,000 vnđ']],
    ['1.234.567', ['1,234,567']],
    ['1 234 567', ['1,234,567']],
  ])('%s → format, %j', (text, suggestions) => {
    expect(parseMoney(text, 'VND', 'vi')).toEqual(refused('format', suggestions));
  });

  it.each([
    '1,2,3 tỷ',
    '1.2.3',
    '1.20.000',
    '1,234,5',
    '1.234.5',
    '1,234.567.8',
    '1.234,567',
    '0,500,000',
    '1234,567,000',
    ',5',
    '5,',
    '5.',
    '500 00',
    '0 500',
  ])('%j → format, nothing to offer', (text) => {
    expect(parseMoney(text, 'VND', 'vi')).toEqual(refused('format'));
  });

  // VND has no decimals: the reading of today of `1,5` (1.5 đồng) does not read either.
  it.each(['1,5', '1,50'])('%j → format, nothing to offer', (text) => {
    expect(parseMoney(text, 'VND', 'en')).toEqual(refused('format'));
  });
});

describe('languageFor', () => {
  it('keeps the language chosen for VND, and is English for money with cents (ADR-0018 §1, §2)', () => {
    expect(languageFor('VND', 'vi')).toBe('vi');
    expect(languageFor('VND', 'en')).toBe('en');
    for (const currency of CURRENCY_CODES.filter((code) => code !== 'VND')) {
      expect(languageFor(currency, 'vi')).toBe('en');
    }
  });
});

// Golden `docs/golden/so-va-tien-te.md` §1–§4 (ADR-0018 §3, §4), through the fixture.

const NOT_WHOLE = [0.5, -1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1];

describe('the currency table (golden §1)', () => {
  it('lists the seven currencies of the golden, in its order', () => {
    expect(CURRENCY_CODES).toEqual(CURRENCY_GOLDEN_ROWS.map((row) => row.currency));
  });

  it.each(CURRENCY_GOLDEN_ROWS)(
    '$currency: decimals, cap and the examples of the table',
    ({ currency, decimals, example, full, compact, maxFee: cap }) => {
      expect(CURRENCIES[currency].decimals).toBe(decimals);
      expect(maxFee(currency)).toBe(cap);
      expect(formatMoney(example, currency)).toBe(full);
      if (compact !== null) expect(formatMoneyCompact(example, currency, 'en')).toBe(compact);
    },
  );
});

describe('addMoney', () => {
  it('adds whole amounts exactly', () => {
    expect(addMoney(125_050, 5)).toBe(125_055);
    expect(addMoney(-125_050, 125_050)).toBe(0);
  });

  it.each(CURRENCY_GOLDEN_ROWS)(
    '$currency: adds $exactFees fees at the cap exactly, then throws rather than add wrong',
    ({ currency, exactFees }) => {
      const cap = maxFee(currency);
      let total = 0;
      for (let count = 0; count < exactFees; count++) total = addMoney(total, cap);
      expect(total).toBe(cap * exactFees);
      expect(() => addMoney(total, cap)).toThrow(RangeError);
    },
  );
});

describe('formatMoney (golden §2)', () => {
  it.each(FULL_GOLDEN_ROWS)('$id: $amount $currency → $text', ({ amount, currency, text }) => {
    expect(formatMoney(amount, currency)).toBe(text);
  });

  it('writes the cents of the largest safe amount exactly', () => {
    expect(formatMoney(Number.MAX_SAFE_INTEGER, 'USD')).toBe('$90,071,992,547,409.91');
    expect(formatMoney(-Number.MAX_SAFE_INTEGER, 'SGD')).toBe('-$90,071,992,547,409.91 SGD');
  });

  it('refuses what is not a whole number of the smallest unit', () => {
    for (const amount of NOT_WHOLE) expect(() => formatMoney(amount, 'USD')).toThrow(RangeError);
  });
});

/**
 * The text a row expects in a language. Money with cents goes with English only: its Vietnamese
 * column is "—" and the language does not change its text, so the English one is expected.
 */
const expectedIn = (row: CompactGoldenRow, language: Language) =>
  language === 'vi' ? (row.vi ?? row.en) : row.en;

describe.each(LANGUAGES)('formatMoneyCompact in %s (golden §3)', (language) => {
  it.each(COMPACT_GOLDEN_ROWS)('$id: $amount $currency', (row) => {
    expect(formatMoneyCompact(row.amount, row.currency, language)).toBe(expectedIn(row, language));
  });
});

describe.each(LANGUAGES)('formatMoneyDelta in %s (golden §4)', (language) => {
  it.each(DELTA_GOLDEN_ROWS)('$id: $amount $currency', (row) => {
    expect(formatMoneyDelta(row.amount, row.currency, language)).toBe(expectedIn(row, language));
  });
});

/** One case per language a §6 row is read in: `both` is each of the two. */
const inLanguages = <Row extends { readonly language: GoldenLanguage }>(rows: readonly Row[]) =>
  rows.flatMap((row) =>
    (row.language === 'both' ? LANGUAGES : [row.language]).map((language) => ({
      ...row,
      language,
    })),
  );

describe('parseMoney (golden §6)', () => {
  it.each(inLanguages(INPUT_GOLDEN_ROWS))(
    '$id: $text, $currency in $language → $amount',
    ({ text, currency, language, amount, read }) => {
      expect(parseMoney(text, currency, language)).toEqual({ ok: true, amount });
      expect(formatMoney(amount, currency)).toBe(read);
    },
  );

  it.each(inLanguages(REFUSED_GOLDEN_ROWS))(
    '$id: $text, $currency in $language → $error',
    ({ text, currency, language, error, suggestions }) => {
      expect(parseMoney(text, currency, language)).toEqual({ ok: false, error, suggestions });
    },
  );

  // A click fills the field with a suggestion (Q11): what it fills reads, never another error.
  it.each(inLanguages(REFUSED_GOLDEN_ROWS).filter((row) => row.suggestions.length > 0))(
    '$id: each suggestion for $text reads back',
    ({ currency, language, suggestions }) => {
      for (const suggestion of suggestions) {
        expect(parseMoney(suggestion, currency, language)).toMatchObject({ ok: true });
      }
    },
  );

  // X27's second way of writing is M04: it reads, past the cap, and the command refuses it.
  it('reads the second suggestion of X27 as M04, past the cap', () => {
    expect(parseMoney('1,500 tỷ', 'VND', 'vi')).toEqual({ ok: true, amount: 1_500_000_000_000 });
    expect(1_500_000_000_000).toBeGreaterThan(maxFee('VND'));
  });

  it.each(inLanguages(CAP_GOLDEN_ROWS))(
    '$id: $text, $currency in $language → $amount, a fee: $isFee',
    ({ text, currency, language, amount, isFee }) => {
      expect(parseMoney(text, currency, language)).toEqual({ ok: true, amount });
      expect(amount <= maxFee(currency)).toBe(isFee);
    },
  );
});

describe('parseMoney past the golden', () => {
  const refused = (error: string, suggestions: readonly string[] = []) => ({
    ok: false,
    error,
    suggestions,
  });

  describe('`ambiguous`: only where the reading of today differs (G2 14/11)', () => {
    it.each([
      ['1234.567 tr', 1_234_567_000],
      ['1,500.500 tr', 1_500_500_000],
      ['01.500 tr', 1_500_000],
      ['1.5000 tr', 1_500_000],
      ['1.50 tr', 1_500_000],
    ])('%s → %d đồng', (text, amount) => {
      expect(parseMoney(text, 'VND', 'vi')).toEqual({ ok: true, amount });
    });

    it.each([
      ['1.505 tr', ['1,505,000', '1,505 tr']],
      ['1.234 tỷ', ['1,234,000,000', '1,234 tỷ']],
      ['999.999 tỷ', ['999,999,000,000', '999,999 tỷ']],
      ['1.234k', ['1,234', '1,234k']],
      ['1.230 tr', ['1.23 tr', '1,230 tr']],
      ['1.000 tr', ['1 tr', '1,000 tr']],
      ['1.500tr', ['1.5tr', '1,500tr']],
      ['1.500 TR', ['1.5 TR', '1,500 TR']],
      ['1.500 tr VNĐ', ['1.5 tr VNĐ', '1,500 tr VNĐ']],
      ['1.234 tr đ', ['1,234,000 đ', '1,234 tr đ']],
    ])('%s → ambiguous, %j', (text, suggestions) => {
      expect(parseMoney(text, 'VND', 'vi')).toEqual(refused('ambiguous', suggestions));
      for (const suggestion of suggestions) {
        expect(parseMoney(suggestion, 'VND', 'vi')).toMatchObject({ ok: true });
      }
    });
  });

  describe('suggests a unit of the interface language', () => {
    it.each([
      ['750 nghìn', 'VND', 'en', ['750K']],
      ['1.5 bil', 'VND', 'vi', ['1.5 tỷ']],
      ['1,5 Mil', 'VND', 'vi', ['1.5 tr']],
      ['250 ngàn', 'USD', 'en', ['250K']],
    ] as const)('%s, %s in %s → %j', (text, currency, language, suggestions) => {
      expect(parseMoney(text, currency, language)).toEqual(refused('format', suggestions));
    });

    // The unit alone changed would be read two ways: neither is picked for the user.
    it('offers nothing when the changed unit would be ambiguous', () => {
      expect(parseMoney('1.500 Mil', 'VND', 'vi')).toEqual(refused('format'));
    });
  });

  describe('reads amounts as an RM says them, in Vietnamese only (Q7)', () => {
    it.each([
      ['1tr50', 1_050_000],
      ['1tr250', 1_250_000],
      ['1 tỷ 25', 1_025_000_000],
      ['2k5', 2_500],
      ['1,500 tỷ 2', 1_500_200_000_000],
      ['1tr5 VNĐ', 1_500_000],
    ])('%s → %d đồng', (text, amount) => {
      expect(parseMoney(text, 'VND', 'vi')).toEqual({ ok: true, amount });
    });

    it.each([
      ['1tr2345', 'vi', []],
      ['1.5tr5', 'vi', []],
      ['1,5tr5', 'vi', []],
      ['1.500 tỷ 2', 'vi', ['1,500 tỷ 2']],
      ['1 Mil 5', 'vi', []],
      ['2k5', 'en', []],
    ] as const)('%s in %s → format, %j', (text, language, suggestions) => {
      expect(parseMoney(text, 'VND', language)).toEqual(refused('format', suggestions));
    });
  });

  describe('the sign, read once', () => {
    it.each([
      ['−$1,250.50', 'USD'],
      ['- 1tr5', 'VND'],
      ['-1.500 tr', 'VND'],
      ['-1,500', 'VND'],
    ] as const)('%s, %s → negative', (text, currency) => {
      expect(parseMoney(text, currency, 'vi')).toEqual(refused('negative'));
    });

    it.each(['-abc', '--500', '-1,5 tỷ', '-'])('%j → format, nothing to suggest', (text) => {
      expect(parseMoney(text, 'VND', 'vi')).toEqual(refused('format'));
    });
  });

  describe('the currency marks (ADR-0018 §5)', () => {
    it.each([
      ['500 ĐỒNG', 'VND', 500],
      ['500vnd', 'VND', 500],
      ['500 Mil VND', 'VND', 500_000_000],
      ['1,250.50usd', 'USD', 125_050],
      ['$1,250.50 USD', 'USD', 125_050],
      ['eur 250K', 'EUR', 25_000_000],
      ['GBP1,250.5', 'GBP', 125_050],
      ['SGD 99.90', 'SGD', 9_990],
    ] as const)('%s, %s → %d', (text, currency, amount) => {
      expect(parseMoney(text, currency, 'en')).toEqual({ ok: true, amount });
    });

    it.each([
      ['VNĐ', 'VND'],
      ['₫500', 'VND'],
      ['500 VNĐ', 'USD'],
      ['100 USD', 'EUR'],
      ['$100', 'GBP'],
      ['500 $', 'USD'],
    ] as const)('%s, %s → format', (text, currency) => {
      expect(parseMoney(text, currency, 'en')).toEqual(refused('format'));
    });
  });

  it.each([
    ['1500.0', 'fraction', []],
    ['500.000', 'fraction', ['500,000']],
    ['0.500', 'fraction', []],
    ['1.500.000 tr', 'format', ['1,500,000 tr']],
    ['1 500 tỷ', 'format', ['1,500 tỷ']],
    ['0,500 tỷ', 'format', ['0.500 tỷ']],
    ['1234,5 tr', 'format', ['1234.5 tr']],
    ['12 34', 'format', []],
    ['1 500.5', 'format', []],
    ['500 constructor', 'format', []],
    ['500 toString', 'format', []],
    ['.5', 'format', []],
    ['99999999999 tỷ', 'too-large', []],
  ] as const)('%j, VND → %s, %j', (text, error, suggestions) => {
    expect(parseMoney(text, 'VND', 'vi')).toEqual(refused(error, suggestions));
  });

  it('takes the largest safe integer and refuses the next one', () => {
    expect(parseMoney('9007199254740991', 'VND', 'en')).toEqual({
      ok: true,
      amount: Number.MAX_SAFE_INTEGER,
    });
    expect(parseMoney('90,071,992,547,409.91', 'USD', 'en')).toEqual({
      ok: true,
      amount: Number.MAX_SAFE_INTEGER,
    });
    expect(parseMoney('9007199254740992', 'VND', 'en')).toEqual(refused('too-large'));
  });

  // DR6-110: the text as normalizeText keeps it.
  it.each([
    ['500tr\u{200B}', 'vi'],
    ['1.500\u{A0}tr', 'vi'],
    ['\u{FEFF}$1,250.50', 'en'],
    ['1tr\u{2060}5', 'vi'],
    ['\u{200B} \u{2060}', 'en'],
  ] as const)('%j reads as its normalized text', (text, language) => {
    const currency = text.includes('$') ? 'USD' : 'VND';
    expect(parseMoney(text, currency, language)).toEqual(
      parseMoney(normalizeText(text), currency, language),
    );
  });

  // DR-38: no pattern backtracks long over a long run of digits, spaces or marks. Timed warm, best
  // of a few runs, so a slow CI runner's first call or a pause does not fail it.
  it('reads long runs quickly', () => {
    const texts = [
      '1' + ' '.repeat(20_000) + 'x',
      '1 '.repeat(10_000) + '!',
      '1 '.repeat(10_000) + 'tr',
      '1' + '.000'.repeat(5_000) + ' tr',
      '1' + ',000'.repeat(5_000) + '!',
      '9'.repeat(20_000) + ' tr x',
      '$'.repeat(20_000),
      '-'.repeat(20_000) + '1',
    ];
    for (const text of texts) expect(parseMoney(text, 'VND', 'vi')).toMatchObject({ ok: false });
    const runs = Array.from({ length: 5 }, () => {
      const started = Date.now();
      for (const text of texts) parseMoney(text, 'VND', 'vi');
      return Date.now() - started;
    });
    expect(Math.min(...runs)).toBeLessThan(20);
  });
});

describe('formatMoneyCompact past the golden', () => {
  it('rounds the largest safe amount exactly, past the top unit', () => {
    expect(formatMoneyCompact(Number.MAX_SAFE_INTEGER, 'VND', 'vi')).toBe('9,007,199.25 tỷ');
    expect(formatMoneyCompact(Number.MAX_SAFE_INTEGER, 'VND', 'en')).toBe('9,007.2T');
    expect(formatMoneyCompact(Number.MAX_SAFE_INTEGER, 'USD', 'en')).toBe('$90.07T');
  });

  it('refuses what is not a whole number of the smallest unit', () => {
    for (const amount of NOT_WHOLE) {
      expect(() => formatMoneyCompact(amount, 'VND', 'vi')).toThrow(RangeError);
      expect(() => formatMoneyDelta(amount, 'USD', 'en')).toThrow(RangeError);
    }
  });
});
