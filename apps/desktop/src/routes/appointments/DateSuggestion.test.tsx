import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { calendarDate } from '@p2c/domain';
import { readScheduleDate, type ScheduleMode } from './appointment-form';
import { DateSuggestion } from './AppointmentDialog';

const suggestion = (
  text: string,
  today = calendarDate(2027, 12, 15),
  mode: ScheduleMode = 'fromToday',
) =>
  renderToStaticMarkup(
    <DateSuggestion date={readScheduleDate(text, today, mode)} onUse={() => {}} help />,
  );

describe('DateSuggestion', () => {
  it('offers 29/02 next year for a year-less 29/02 this year lacks (DR-39)', () => {
    const html = suggestion('29/02');
    expect(html).toContain('Năm 2027 không có ngày 29/02. Ý anh là 29/02/2028?');
    expect(html).toContain('Dùng 29/02/2028');
    // Nothing is in the past here: the note about past appointments does not apply.
    expect(html).not.toContain('nhập bù');
  });

  it('offers nothing for a day that does not exist next year either', () => {
    expect(suggestion('31/04')).toBe('');
  });

  // ADR-0007 appendix "Ngày nhanh đầu năm" (Owner 23/10/2026), mirroring the next year of mockup 6b.
  it('offers last year early in the year for a day not yet come, and says it keeps this year', () => {
    const html = suggestion('28/12', calendarDate(2027, 1, 2), 'any');
    expect(html).toContain('28/12/2027 còn 360 ngày nữa. Ý anh là 28/12/2026?');
    expect(html).toContain('Dùng 28/12/2026');
    expect(html).toContain('App không tự đổi năm. Giữ nguyên là lịch hẹn năm nay.');
    expect(html).not.toContain('nhập bù');
  });
});
