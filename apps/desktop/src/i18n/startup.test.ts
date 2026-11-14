import type { CurrencyCode } from '@p2c/domain';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Loads the i18n anew on a machine that stored `stored` under `p2c.language`, with an English
 * catalogue of three keys, then opens data in `currency` before the screens' modules load, as
 * `main.tsx` does (ADR-0018 §1).
 */
async function loadWith(stored: string | null, currency?: CurrencyCode) {
  vi.resetModules();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => (key === 'p2c.language' ? stored : null),
      setItem: () => {},
    },
  });
  vi.doMock('./en', () => ({
    en: {
      'period.week': 'Week',
      'screen.reports': 'Reports',
      'tableMore.more.customers': {
        one: 'Show {count} more customer',
        other: 'Show {count} more customers',
      },
    },
  }));
  const { t } = await import('.');
  const language = await import('./language');
  if (currency !== undefined) language.setDataCurrency(currency);
  const { PERIOD_LABELS } = await import('../routes/period-labels');
  return { t, PERIOD_LABELS, ...language };
}

afterEach(() => {
  vi.doUnmock('./en');
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('the language of a run', () => {
  it('is English where the machine stored it; a key English lacks reads in Vietnamese', async () => {
    const { t } = await loadWith('en');
    expect(t('screen.reports')).toBe('Reports');
    expect(t('screen.overview')).toBe('Tổng quan');
    expect(t('tableMore.more.customers', { count: 1 })).toBe('Show 1 more customer');
    expect(t('tableMore.more.customers', { count: 2 })).toBe('Show 2 more customers');
  });

  // PERIOD_LABELS is built as its module loads, which is why changing the language reloads.
  it('is set before a module builds its labels', async () => {
    const { PERIOD_LABELS } = await loadWith('en');
    expect(PERIOD_LABELS.kinds.week).toBe('Week');
    expect(PERIOD_LABELS.kinds.day).toBe('Ngày');
  });

  it('is Vietnamese with nothing stored, for VND data and before any data opened', async () => {
    const { t, PERIOD_LABELS, appLanguage } = await loadWith(null);
    expect(appLanguage()).toBe('vi');
    expect(t('screen.reports')).toBe('Báo cáo');
    expect(PERIOD_LABELS.kinds.week).toBe('Tuần');
    expect((await loadWith(null, 'VND')).appLanguage()).toBe('vi');
  });

  // The currency is in the database, opened after the i18n loaded: the screens load after it.
  it('is English for data not in VND, though the machine stored Vietnamese', async () => {
    const { t, PERIOD_LABELS, appLanguage, dataCurrency } = await loadWith('vi', 'USD');
    expect(dataCurrency()).toBe('USD');
    expect(appLanguage()).toBe('en');
    expect(t('screen.reports')).toBe('Reports');
    expect(PERIOD_LABELS.kinds.week).toBe('Week');
  });
});
