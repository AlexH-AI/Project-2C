import { useId, useState, type KeyboardEvent } from 'react';
import {
  PERIOD_KINDS,
  customPeriod,
  formatDate,
  parseDate,
  shift,
  switchKind,
  type CalendarDate,
  type Period,
  type PeriodKind,
} from '@p2c/domain';
import { periodLabel, type PeriodLabelTemplates } from './PeriodPicker.label';
import { Segmented } from './Segmented';

export interface PeriodPickerLabels extends PeriodLabelTemplates {
  title: string;
  kinds: Record<PeriodKind, string> & { group: string };
  previous: string;
  next: string;
  from: string;
  to: string;
  /** Placeholder of the custom date fields, e.g. dd/mm/yyyy. */
  dateFormat: string;
}

interface PeriodPickerProps {
  value: Period;
  onChange: (period: Period) => void;
  today: CalendarDate;
  labels: PeriodPickerLabels;
}

/** Text typed in the custom range fields, not yet applied. */
interface Draft {
  start: string;
  end: string;
  invalid: boolean;
}

function tryCustomPeriod(start: string, end: string): Period | null {
  const from = parseDate(start);
  const to = parseDate(end);
  if (!from || !to) return null;
  try {
    return customPeriod(from, to);
  } catch {
    return null;
  }
}

const focusRing = 'focus-visible:outline-2 focus-visible:outline-accent';
const stepClass = `cursor-pointer rounded-sm px-1.5 py-0.5 text-lg leading-none text-fg-3 hover:text-fg ${focusRing}`;

/**
 * Shared period selector (ADR-0013): Ngày · Tuần · Tháng · Năm · Tùy chọn, with ‹ › stepping.
 * Custom dates are typed as dd/mm/yyyy (not `<input type="date">`, whose format follows the OS
 * locale) and applied on Enter or leaving the field.
 */
export function PeriodPicker({ value, onChange, today, labels }: PeriodPickerProps) {
  const titleId = useId();
  const [draft, setDraft] = useState<Draft | null>(null);

  const change = (period: Period) => {
    setDraft(null);
    onChange(period);
  };

  const shown = draft ?? {
    start: formatDate(value.start),
    end: formatDate(value.end),
    invalid: false,
  };

  const apply = () => {
    if (!draft) return;
    const period = tryCustomPeriod(draft.start, draft.end);
    if (period) change(period);
    else setDraft({ ...draft, invalid: true });
  };

  const dateField = (field: 'start' | 'end', label: string) => (
    <input
      type="text"
      inputMode="numeric"
      aria-label={label}
      aria-invalid={shown.invalid}
      placeholder={labels.dateFormat}
      value={shown[field]}
      onChange={(event) => setDraft({ ...shown, [field]: event.target.value, invalid: false })}
      onBlur={apply}
      onKeyDown={(event: KeyboardEvent) => event.key === 'Enter' && apply()}
      className={`w-28 rounded-sm border bg-surface-2 px-2.5 py-1 text-sm text-fg tabular-nums ${focusRing} ${
        shown.invalid ? 'border-danger' : 'border-border'
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
        onClick={() => change(shift(value, 1))}
        className={stepClass}
      >
        ›
      </button>
      {value.kind === 'custom' && (
        <>
          {dateField('start', labels.from)}
          {dateField('end', labels.to)}
        </>
      )}
    </div>
  );
}
