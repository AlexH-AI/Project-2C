import { useId, useState, type KeyboardEvent } from 'react';
import {
  PERIOD_KINDS,
  canShift,
  compareDates,
  customPeriod,
  customRangeAllowed,
  formatDate,
  parseDate,
  shift,
  switchKind,
  todayPeriod,
  type CalendarDate,
  type Period,
  type PeriodKind,
} from '@p2c/domain';
import { periodLabel, type PeriodLabelTemplates } from './PeriodPicker.label';
import { Button } from './Button';
import { Segmented } from './Segmented';

export interface PeriodPickerLabels extends PeriodLabelTemplates {
  title: string;
  kinds: Record<PeriodKind, string> & { group: string };
  previous: string;
  next: string;
  /** The button going back to the period containing today. */
  today: string;
  from: string;
  to: string;
  /** Placeholder of the custom date fields, e.g. dd/mm/yyyy. */
  dateFormat: string;
  /** Note by the custom date fields when one is not a real dd/mm/yyyy date. */
  customInvalid: string;
  /** Note by the custom date fields when the start comes after the end. */
  customReversed: string;
  /** Note by the custom date fields when the range runs past the 3-month cap. */
  customTooLong: string;
}

interface PeriodPickerProps {
  value: Period;
  onChange: (period: Period) => void;
  today: CalendarDate;
  labels: PeriodPickerLabels;
}

/** Why typed custom dates were refused: not dates, start after end, or past the 3-month cap. */
type DraftError = 'invalid' | 'reversed' | 'too-long';

/** Text typed in the custom range fields, not yet applied. */
interface Draft {
  start: string;
  end: string;
  error: DraftError | null;
}

function tryCustomPeriod(start: string, end: string): Period | DraftError {
  const from = parseDate(start);
  const to = parseDate(end);
  if (!from || !to) return 'invalid';
  if (compareDates(from, to) > 0) return 'reversed';
  return customRangeAllowed(from, to) ? customPeriod(from, to) : 'too-long';
}

const focusRing = 'focus-visible:outline-2 focus-visible:outline-accent';
const stepClass = `cursor-pointer rounded-sm px-1.5 py-0.5 text-lg leading-none text-fg-3 hover:text-fg disabled:cursor-default disabled:opacity-50 disabled:hover:text-fg-3 ${focusRing}`;

/**
 * Shared period selector (ADR-0013): Ngày · Tuần · Tháng · Năm · Tùy chọn, with ‹ › stepping;
 * a step that would leave 1900–2100 (or a custom range's 3-month cap) is disabled; "Hôm nay"
 * (always enabled) goes to the period containing today.
 * Custom dates are typed as dd/mm/yyyy (not `<input type="date">`, whose format follows the OS
 * locale) and applied on Enter or leaving the field; a date that does not exist, a start after the end
 * or a range over 3 months is refused with a note the fields point to.
 */
export function PeriodPicker({ value, onChange, today, labels }: PeriodPickerProps) {
  const titleId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<Draft | null>(null);

  const change = (period: Period) => {
    setDraft(null);
    onChange(period);
  };

  const shown = draft ?? {
    start: formatDate(value.start),
    end: formatDate(value.end),
    error: null,
  };

  const apply = () => {
    if (!draft) return;
    const period = tryCustomPeriod(draft.start, draft.end);
    if (typeof period === 'string') setDraft({ ...draft, error: period });
    else change(period);
  };

  // A date that does not exist marks its own field; a reversed or too long range marks both.
  const fieldInvalid = (field: 'start' | 'end') =>
    shown.error === 'invalid' ? parseDate(shown[field]) === null : shown.error !== null;
  const errorNote = {
    invalid: labels.customInvalid,
    reversed: labels.customReversed,
    'too-long': labels.customTooLong,
  } as const satisfies Record<DraftError, string>;

  const dateField = (field: 'start' | 'end', label: string) => (
    <input
      type="text"
      inputMode="numeric"
      aria-label={label}
      aria-invalid={fieldInvalid(field)}
      aria-describedby={shown.error ? errorId : undefined}
      placeholder={labels.dateFormat}
      value={shown[field]}
      onChange={(event) => setDraft({ ...shown, [field]: event.target.value, error: null })}
      onBlur={apply}
      onKeyDown={(event: KeyboardEvent) => event.key === 'Enter' && apply()}
      className={`w-28 rounded-sm border bg-surface-2 px-2.5 py-1 text-sm text-fg tabular-nums ${focusRing} ${
        fieldInvalid(field) ? 'border-danger' : 'border-border'
      }`}
    />
  );

  return (
    <div role="group" aria-labelledby={titleId} className="flex flex-wrap items-center gap-2">
      <span id={titleId} className="mr-1 text-xs font-semibold tracking-wider text-fg-3 uppercase">
        {labels.title}
      </span>
      <Segmented
        label={labels.kinds.group}
        options={PERIOD_KINDS.map((kind) => ({ value: kind, label: labels.kinds[kind] }))}
        value={value.kind}
        onChange={(kind) => change(switchKind(value, kind, today))}
      />
      <button
        type="button"
        aria-label={labels.previous}
        disabled={!canShift(value, -1)}
        onClick={() => change(shift(value, -1))}
        className={stepClass}
      >
        ‹
      </button>
      <output
        aria-live="polite"
        className="rounded-sm border border-border bg-surface-2 px-2.5 py-1 text-sm whitespace-nowrap text-fg tabular-nums"
      >
        {periodLabel(value, labels)}
      </output>
      <button
        type="button"
        aria-label={labels.next}
        disabled={!canShift(value, 1)}
        onClick={() => change(shift(value, 1))}
        className={stepClass}
      >
        ›
      </button>
      <Button
        onClick={() => {
          const target = todayPeriod(value, today);
          if (target !== value) change(target);
        }}
        className="px-2.5 py-1"
      >
        {labels.today}
      </Button>
      {value.kind === 'custom' && (
        <>
          {dateField('start', labels.from)}
          {dateField('end', labels.to)}
          {shown.error && (
            <span id={errorId} className="text-xs text-danger">
              {errorNote[shown.error]}
            </span>
          )}
        </>
      )}
    </div>
  );
}
