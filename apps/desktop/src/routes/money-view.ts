import {
  CURRENCIES,
  formatMoney,
  formatMoneyCompact,
  formatMoneyDelta,
  normalizeText,
  parseMoney,
  type CurrencyCode,
  type Language,
  type Money,
  type MoneyParseError,
  type MoneyParseResult,
} from '@p2c/domain';
import { t, type MessageKey } from '../i18n';
import { DATA_CURRENCY, LANGUAGE } from '../i18n/language';

/*
 * Money as the app shows it: in the currency of the data and the language of this run, both from
 * `i18n/language.ts` (ADR-0018 §4). Screens call these, never the domain formats with a currency.
 */

/** Full form: `3,000,000 VNĐ`. */
export const formatAmount = (amount: Money) => formatMoney(amount, DATA_CURRENCY);

/** Compact form for KPIs, charts and narrow columns: `1.9 tỷ`, `500K`, under 1,000 in full. */
export const formatAmountCompact = (amount: Money) =>
  formatMoneyCompact(amount, DATA_CURRENCY, LANGUAGE);

/** A difference in the compact form, signed with `−` or `+`: `−14.5 tr`. */
export const formatAmountDelta = (amount: Money) =>
  formatMoneyDelta(amount, DATA_CURRENCY, LANGUAGE);

/** The currency's symbol, for a heading in money: `VNĐ`. */
export const moneySymbol = () => CURRENCIES[DATA_CURRENCY].symbol;

/**
 * What an amount typed reads as, under its field: "800,000,000 VNĐ (800 tr)", the full form alone
 * when the short one is the same, under 1,000. The case size of a meeting (mockups 6c, 6d), a
 * money trường of KYC (7b, 7c) and a FYP (8a, 8b) read alike (review of PR 838).
 */
export function amountRead(amount: Money): string {
  const full = formatAmount(amount);
  const compact = formatAmountCompact(amount);
  return compact === full ? full : t('money.read', { amount: full, compact });
}

/*
 * A money field (ADR-0018 §5; mockup ngon-ngu-tien-te.html #money): read by the rule of the two
 * marks in the currency of the data, with the units of the interface language. A refusal shows a
 * sentence by its code and the ways of writing that read, which the user picks; the app never
 * applies one (Q11).
 */

/** What a money field reads as typed: an amount, or why not and the ways of writing to offer. */
export const readMoney = (text: string): MoneyParseResult =>
  parseMoney(text, DATA_CURRENCY, LANGUAGE);

/** The example in an empty money field: `vd. 500 tr · 1.5 tỷ`, `e.g. 1,250.50 · 250K`. */
export const moneyPlaceholder = (currency: CurrencyCode = DATA_CURRENCY) =>
  t(currency === 'VND' ? 'money.placeholder' : 'money.placeholder.cents');

/** A refusal of the reading: its code and the ways of writing that read. */
export interface MoneyRefusalRead {
  readonly error: MoneyParseError;
  readonly suggestions: readonly string[];
}

/** The letters of a text, its unit and currency mark, so two ways of writing compare by unit. */
const lettersOf = (text: string) => text.replace(/\P{L}/gu, '').toLowerCase();

/**
 * The sentence under a refused field (mockup #money, table "Câu lỗi của ô tiền"): by the code,
 * money with cents having its own; a text not read but offered another way of writing says what
 * the rule is: of the unit when the offer changes it (`500 Mil` → `500 tr`), else of the marks.
 */
export function refusalKey(
  { error, suggestions }: MoneyRefusalRead,
  typed: string,
  currency: CurrencyCode = DATA_CURRENCY,
): MessageKey {
  const cents = currency === 'VND' ? '' : '.cents';
  const [offered] = suggestions;
  if (error === 'format' && offered !== undefined) {
    return lettersOf(offered) === lettersOf(typed) ? 'money.mark' : 'money.unit';
  }
  if (error === 'format' || error === 'fraction') return `money.error.${error}${cents}`;
  return `money.error.${error}`;
}

/** A way of writing offered under a field: what a click fills it with, and what that reads as. */
export interface MoneySuggestion {
  readonly text: string;
  readonly read: string;
  /** What a screen reader says of its button. */
  readonly label: string;
}

/** What stands under a refused money field: its sentence, then the ways of writing after `lead`. */
export interface FieldRefusal {
  readonly message: string;
  readonly lead: string;
  readonly suggestions: readonly MoneySuggestion[];
}

/** A refusal of the form's own, such as an FYP of 0: its sentence alone, nothing to offer. */
export const sentenceOnly = (message: string): FieldRefusal => ({
  message,
  lead: '',
  suggestions: [],
});

/**
 * What stands under the field for a refusal of `typed`: the sentence, and each way of writing with
 * the amount it reads as in full, "1.5 tr = 1,500,000 VNĐ" (mockup #money): two to pick one from
 * for an ambiguous amount, else the one meant perhaps.
 */
export function moneyRefusal(
  refusal: MoneyRefusalRead,
  typed: string,
  currency: CurrencyCode = DATA_CURRENCY,
  language: Language = LANGUAGE,
): FieldRefusal {
  const suggestions = refusal.suggestions.flatMap((text) => {
    const read = parseMoney(text, currency, language);
    if (!read.ok) return [];
    const amount = formatMoney(read.amount, currency);
    return [{ text, read: amount, label: t('money.fill', { text, amount }) }];
  });
  return {
    message: t(refusalKey(refusal, typed, currency), { text: normalizeText(typed) }),
    lead: t(refusal.error === 'ambiguous' ? 'money.pickOne' : 'money.didYouMean'),
    suggestions,
  };
}
