import type { PeriodPickerLabels } from '@p2c/ui';
import { t } from '../i18n';

/** Labels of the shared period picker (Tổng quan, Lịch hẹn, Báo cáo). */
export const PERIOD_LABELS: PeriodPickerLabels = {
  title: t('period.title'),
  kinds: {
    group: t('period.kinds'),
    day: t('period.day'),
    week: t('period.week'),
    month: t('period.month'),
    year: t('period.year'),
    custom: t('period.custom'),
  },
  previous: t('period.previous'),
  next: t('period.next'),
  today: t('period.today'),
  from: t('period.from'),
  to: t('period.to'),
  dateFormat: t('period.dateFormat'),
  customTooLong: t('period.customTooLong'),
  monthLabel: t('period.monthLabel'),
  yearLabel: t('period.yearLabel'),
};
