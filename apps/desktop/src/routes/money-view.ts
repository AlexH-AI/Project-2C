import {
  CURRENCIES,
  formatMoney,
  formatMoneyCompact,
  formatMoneyDelta,
  type Money,
} from '@p2c/domain';
import { t } from '../i18n';
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
