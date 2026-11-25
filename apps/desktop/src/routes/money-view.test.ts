import { describe, expect, it } from 'vitest';
import { parseMoney, type CurrencyCode, type Language } from '@p2c/domain';
import { en } from '../i18n/en';
import { setDataCurrency } from '../i18n/language';
import { vi } from '../i18n/vi';
import {
  amountRead,
  currencyName,
  formatAmount,
  formatAmountCompact,
  formatAmountDelta,
  formRefusal,
  moneyPlaceholder,
  moneyRefusal,
  moneySymbol,
  readMoney,
  refusalKey,
  sentenceOnly,
} from './money-view';

// Money in the currency of the data, the Excel way (ADR-0018 §4, golden so-va-tien-te.md §2–§4).
// The web build and the unit tests run Vietnamese with VND.
describe('money in the currency of the data', () => {
  it('writes the full form with VNĐ after the number', () => {
    expect(formatAmount(3_000_000)).toBe('3,000,000 VNĐ');
    expect(formatAmount(-1_500_000)).toBe('-1,500,000 VNĐ');
  });

  it('writes the compact form with the units of the language', () => {
    expect(formatAmountCompact(1_900_000_000)).toBe('1.9 tỷ');
    expect(formatAmountCompact(500_000)).toBe('500K');
    expect(formatAmountCompact(950)).toBe('950 VNĐ');
  });

  it('signs a difference, with no sign for none', () => {
    expect(formatAmountDelta(-14_500_000)).toBe('−14.5 tr');
    expect(formatAmountDelta(2_000_000_000)).toBe('+2 tỷ');
    expect(formatAmountDelta(0)).toBe('0 VNĐ');
  });

  it('names the currency by its symbol', () => {
    expect(moneySymbol()).toBe('VNĐ');
  });
});

// Mockups 6c / 6d (case size, NT-LH-25), 7b / 7c (a KYC money trường, NT-HS-05), 8a / 8b (FYP);
// ngon-ngu-tien-te.html: "500,000,000 VNĐ (500 tr)".
describe('amountRead', () => {
  it('reads the amount back in full, then in short', () => {
    expect(amountRead(800_000_000)).toBe('800,000,000 VNĐ (800 tr)');
    expect(amountRead(1_234_000_000)).toBe('1,234,000,000 VNĐ (1.23 tỷ)');
    expect(amountRead(1_000_000)).toBe('1,000,000 VNĐ (1 tr)');
    expect(amountRead(500_000)).toBe('500,000 VNĐ (500K)');
    expect(amountRead(999_999)).toBe('999,999 VNĐ (1 tr)');
  });

  // Under 1,000 the short form is the full one (review of PR 758), a FYP too (review of PR 838).
  it('gives the full form once under a thousand', () => {
    expect(amountRead(999)).toBe('999 VNĐ');
    expect(amountRead(0)).toBe('0 VNĐ');
  });
});

// ADR-0018 §5, golden §6: a field reads by the rule of the data's currency and the interface
// language; the unit tests run Vietnamese with VND.
describe('readMoney', () => {
  it('reads by the rule of the two marks', () => {
    expect(readMoney('1.5 tỷ')).toEqual({ ok: true, amount: 1_500_000_000 });
    expect(readMoney('500,000,000 VNĐ')).toEqual({ ok: true, amount: 500_000_000 });
    expect(readMoney('1tr5')).toEqual({ ok: true, amount: 1_500_000 });
  });

  it('refuses the marks of today, offering them in the new ones', () => {
    expect(readMoney('1,5 tỷ')).toEqual({ ok: false, error: 'format', suggestions: ['1.5 tỷ'] });
    expect(readMoney('1.500 tr')).toEqual({
      ok: false,
      error: 'ambiguous',
      suggestions: ['1.5 tr', '1,500 tr'],
    });
  });
});

describe('moneyPlaceholder (mockup #money)', () => {
  it('shows how to type an amount in the currency', () => {
    expect(moneyPlaceholder()).toBe('vd. 500 tr · 1.5 tỷ');
    expect(moneyPlaceholder('USD')).toBe(vi['money.placeholder.cents']);
  });

  it('has the English of the mockup', () => {
    expect(en['money.placeholder']).toBe('e.g. 500 Mil · 1.5 Bil');
    expect(en['money.placeholder.cents']).toBe('e.g. 1,250.50 · 250K');
  });
});

/** The refusal of `text`, read in `currency` and `language`. */
function refusalOf(text: string, currency: CurrencyCode = 'VND', language: Language = 'vi') {
  const read = parseMoney(text, currency, language);
  if (read.ok) throw new Error(`${text} reads`);
  return read;
}

const keyOf = (text: string, currency: CurrencyCode = 'VND', language: Language = 'vi') =>
  refusalKey(refusalOf(text, currency, language), text, currency);

// Mockup #money, table "Câu lỗi của ô tiền": a sentence by the code; one about the marks or the
// unit when a way of writing is offered for a text not read (golden §6.2).
describe('refusalKey', () => {
  it.each([
    ['', 'money.error.empty'],
    ['-500tr', 'money.error.negative'],
    ['1.5m', 'money.error.format'],
    ['1,5', 'money.error.format'],
    ['1.0000000001 tỷ', 'money.error.fraction'],
    ['1.500', 'money.error.fraction'],
    ['99,999,999,999,999,999', 'money.error.too-large'],
    ['1.500 tr', 'money.error.ambiguous'],
    ['1,5 tỷ', 'money.mark'],
    ['500 000 000', 'money.mark'],
    ['500.000.000 VNĐ', 'money.mark'],
    ['500 Mil', 'money.unit'],
    // Both the unit and the marks change: the unit is what the interface language says.
    ['1,5 Mil', 'money.unit'],
    // Typed as decomposed letters (a paste from a Mac): the unit is the same, as the field reads it.
    ['1,5 tỷ'.normalize('NFD'), 'money.mark'],
  ])('%j, VND in Vietnamese → %s', (text, key) => {
    expect(keyOf(text)).toBe(key);
  });

  it.each([
    ['1.5 tr', 'USD', 'money.unit'],
    ['500tr', 'VND', 'money.unit'],
    ['abc', 'USD', 'money.error.format.cents'],
    ['1,250.505', 'USD', 'money.error.fraction.cents'],
    // A fraction keeps its sentence, a way of writing offered or not (X19).
    ['1.505', 'USD', 'money.error.fraction.cents'],
    ['12,34', 'USD', 'money.mark'],
  ] as const)('%j, %s in English → %s', (text, currency, key) => {
    expect(keyOf(text, currency, 'en')).toBe(key);
  });

  // Owner 14/11/2026 (review of PR 1251, "Whole cents (Recommended)").
  it('says money with cents must be whole cents, in English', () => {
    expect(en[keyOf('1.505', 'USD', 'en')]).toBe('Amounts must be whole cents.');
  });

  it('gives each sentence its English', () => {
    const keys = [
      'money.error.empty',
      'money.error.negative',
      'money.error.format',
      'money.error.format.cents',
      'money.error.fraction',
      'money.error.fraction.cents',
      'money.error.too-large',
      'money.error.ambiguous',
      'money.mark',
      'money.unit',
      'money.didYouMean',
      'money.pickOne',
      'money.fill',
    ] as const;
    expect(keys.filter((key) => !en[key])).toEqual([]);
  });
});

describe('moneyRefusal', () => {
  it('offers the two ways of writing an ambiguous amount, each with what it reads', () => {
    expect(moneyRefusal(refusalOf('1.500 tr'), '1.500 tr')).toEqual({
      message: '"1.500 tr" đọc được theo hai cách.',
      lead: 'Chọn một cách viết:',
      suggestions: [
        { text: '1.5 tr', read: '1,500,000 VNĐ', label: 'Điền 1.5 tr = 1,500,000 VNĐ' },
        { text: '1,500 tr', read: '1,500,000,000 VNĐ', label: 'Điền 1,500 tr = 1,500,000,000 VNĐ' },
      ],
    });
  });

  it('offers the one way of writing in the new marks', () => {
    expect(moneyRefusal(refusalOf('500.000.000'), '500.000.000')).toEqual({
      message: 'Dấu "," ngăn hàng nghìn, dấu "." cho phần lẻ.',
      lead: 'Có phải là:',
      suggestions: [
        {
          text: '500,000,000',
          read: '500,000,000 VNĐ',
          label: 'Điền 500,000,000 = 500,000,000 VNĐ',
        },
      ],
    });
  });

  it('says how to type an amount when there is nothing to offer', () => {
    const refusal = moneyRefusal(refusalOf('1,5'), '1,5');
    expect(refusal.message).toBe('Chưa đọc được số tiền. Gõ như 1,500,000 hoặc 1.5 tr.');
    expect(refusal.suggestions).toEqual([]);
  });

  it('quotes the text as read, without the spaces around it', () => {
    expect(moneyRefusal(refusalOf(' 1.500k\u{200B}'), ' 1.500k\u{200B}').message).toBe(
      '"1.500k" đọc được theo hai cách.',
    );
  });

  // A click fills the field with what it offers (Q11): never with a text that is refused in turn.
  it('offers no way of writing that does not read', () => {
    const refusal = moneyRefusal({ error: 'format', suggestions: ['1,5'] }, '1;5');
    expect(refusal.suggestions).toEqual([]);
  });

  it('reads a way of writing in the currency and language it is offered in', () => {
    const refusal = moneyRefusal(refusalOf('12,34', 'USD', 'en'), '12,34', 'USD', 'en');
    expect(refusal.suggestions.map(({ text, read }) => [text, read])).toEqual([
      ['12.34', '$12.34'],
    ]);
  });
});

// G-04: the currency of the data that opened, and the language that goes with it (ADR-0018 §1).
describe('money in the currency of a database not in VND', () => {
  it('writes, reads and offers in that currency, in English', () => {
    try {
      setDataCurrency('USD', 'vi');
      expect(formatAmount(125_050)).toBe('$1,250.50');
      expect(formatAmountCompact(125_000_000)).toBe('$1.25 Mil');
      expect(readMoney('1,250.50')).toEqual({ ok: true, amount: 125_050 });
      expect(moneySymbol()).toBe('$');
      expect(moneyPlaceholder()).toBe('e.g. 1,250.50 · 250K');
    } finally {
      setDataCurrency('VND', 'vi');
    }
  });
});

describe('currencyName', () => {
  it('names VND as the app writes it, and the others by their code (mockup #wizard)', () => {
    expect(currencyName('VND')).toBe('VNĐ');
    expect(currencyName('USD')).toBe('USD');
    expect(currencyName('AUD')).toBe('AUD');
  });
});

// A review note of PR 1293: one rule for the refusals of an FYP and a case size.
describe('formRefusal', () => {
  const own = { code: 'zero', message: 'FYP phải lớn hơn 0.' } as const;

  it("shows the form's own refusal as its sentence alone", () => {
    expect(formRefusal({ error: 'zero', suggestions: [] }, '0', own)).toEqual(
      sentenceOnly('FYP phải lớn hơn 0.'),
    );
  });

  it('shows any other as the money field refuses it', () => {
    const refused = refusalOf('1.500 tr');
    expect(formRefusal(refused, '1.500 tr', own)).toEqual(moneyRefusal(refused, '1.500 tr'));
  });
});

describe('sentenceOnly', () => {
  it('is a sentence of the form, nothing to offer', () => {
    expect(sentenceOnly('FYP phải lớn hơn 0.')).toEqual({
      message: 'FYP phải lớn hơn 0.',
      lead: '',
      suggestions: [],
    });
  });
});
