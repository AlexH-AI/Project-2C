import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { calendarDate } from '@p2c/domain';
import { readScheduleDate } from './appointment-form';
import { DateSuggestion } from './AppointmentDialog';

const suggestion = (text: string, today = calendarDate(2027, 12, 15)) =>
  renderToStaticMarkup(
    <DateSuggestion date={readScheduleDate(text, today, 'fromToday')} onUse={() => {}} help />,
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
});
