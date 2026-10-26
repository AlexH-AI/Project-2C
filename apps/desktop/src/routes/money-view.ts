import { formatVnd, formatVndCompact } from '@p2c/domain';
import { t } from '../i18n';

/**
 * What an amount typed reads as, under its field: "800.000.000 ₫ (800 tr)", the full form alone
 * when the short one is the same, under a million. The case size of a meeting (mockups 6c, 6d), a
 * money trường of KYC (7b, 7c) and a FYP (8a, 8b) read alike (review of PR 838).
 */
export function amountRead(amount: number): string {
  const full = formatVnd(amount);
  const compact = formatVndCompact(amount);
  return compact === full ? full : t('money.read', { amount: full, compact });
}
