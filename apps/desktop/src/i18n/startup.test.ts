import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Loads the i18n anew on a machine that stored `stored` under `p2c.language`, with an English
 * catalogue of three keys: the language is set as the i18n loads (ADR-0018 §1).
 */
async function loadWith(stored: string | null) {
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
  const { PERIOD_LABELS } = await import('../routes/period-labels');
  return { t, PERIOD_LABELS };
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

  // Until the currency key (G-04) every database is VND: the app opens in Vietnamese.
  it('is Vietnamese with nothing stored', async () => {
    const { t, PERIOD_LABELS } = await loadWith(null);
    expect(t('screen.reports')).toBe('Báo cáo');
    expect(PERIOD_LABELS.kinds.week).toBe('Tuần');
  });
});
