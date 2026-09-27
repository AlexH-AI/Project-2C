import { formatPeriodValue, type Period } from '@p2c/domain';

export interface PeriodLabelTemplates {
  /** Month label with a `{value}` slot for `09/2026`, e.g. `Tháng {value}`. */
  monthLabel: string;
  /** Year label with a `{value}` slot for `2026`, e.g. `Năm {value}`. */
  yearLabel: string;
}

/** Text shown for a period: month and year through their templates, other kinds as bare dates. */
export function periodLabel(period: Period, templates: PeriodLabelTemplates): string {
  const value = formatPeriodValue(period);
  switch (period.kind) {
    case 'month':
      return templates.monthLabel.replace('{value}', value);
    case 'year':
      return templates.yearLabel.replace('{value}', value);
    default:
      return value;
  }
}
