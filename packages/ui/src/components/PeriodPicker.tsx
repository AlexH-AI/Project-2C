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
  /** The name of the layer the period pill opens. */
  pick: string;
  /** Beside "Hôm nay" in that layer: a choice applies at once. */
  applies: string;
}

interface PeriodPickerProps {
  value: Period;
  onChange: (period: Period) => void;
  today: CalendarDate;
  labels: PeriodPickerLabels;
  /**
   * In the layer of the period pill (`PeriodPill`): the kinds, the custom dates and "Hôm nay"
   * one under the other, with no title nor ‹ › (the pill has them). Called after "Hôm nay".
   */
  onToday?: () => void;
}

/** Why typed custom dates were refused: not dates, start after end, or past the 3-month cap. */
type DraftError = 'invalid' | 'reversed' | 'too-long';

/** Text typed in the custom range fields, not yet applied, over the period it was typed on. */
interface Draft {
  start: string;
  end: string;
  error: DraftError | null;
  on: string;
}

/** A period by its dates: what was typed holds only while they stay. */
const datesOf = (period: Period) => `${formatDate(period.start)} ${formatDate(period.end)}`;

function tryCustomPeriod(start: string, end: string): Period | DraftError {
  const from = parseDate(start);
  const to = parseDate(end);
  if (!from || !to) return 'invalid';
  if (compareDates(from, to) > 0) return 'reversed';
  return customRangeAllowed(from, to) ? customPeriod(from, to) : 'too-long';
}

const focusRing = 'focus-visible:outline-2 focus-visible:outline-accent';
const STEP_ROOM = 'px-1.5 py-0.5';

/**
 * ‹ or ›: one period back or on, in the screen and on the pill of the toolbar alike. A step that
 * would leave 1900–2100 (or a custom range's 3-month cap) is off by `aria-disabled`, which keeps
 * the focus it has: `disabled` would drop it to the page (DR6-186). `room` is its padding.
 */
export function PeriodStep({
  value,
  by,
  label,
  onStep,
  room,
}: {
  value: Period;
  by: -1 | 1;
  label: string;
  onStep: (period: Period) => void;
  room: string;
}) {
  const off = !canShift(value, by);
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={off}
      onClick={() => {
        if (!off) onStep(shift(value, by));
      }}
      className={`cursor-pointer rounded-control-sm text-lg leading-none text-fg-2 hover:text-fg focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:text-fg-2 ${room} ${focusRing}`}
    >
      {by < 0 ? '‹' : '›'}
    </button>
  );
}

/**
 * Shared period selector (ADR-0013): Ngày · Tuần · Tháng · Năm · Tùy chọn, with ‹ › stepping
 * (`PeriodStep`); "Hôm nay" (always enabled) goes to the period containing today.
 * "Hôm nay" is the compact button: beside the name of the period, the height of that box.
 * Custom dates are typed as dd/mm/yyyy (not `<input type="date">`, whose format follows the OS
 * locale) and applied on Enter or once the focus leaves both fields, not on Tab from one to the other
 * (R4); a date that does not exist, a start after the end or a range over 3 months is refused with a
 * note the fields point to. What was typed goes once the period moves from outside (the pill).
 */
export function PeriodPicker({ value, onChange, today, labels, onToday }: PeriodPickerProps) {
  const titleId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<Draft | null>(null);

  const change = (period: Period) => {
    setDraft(null);
    onChange(period);
  };

  // Typed on another period, as one ‹ › of the pill moved to (L177), it is gone for good: also
  // once the pill steps back to the period it was typed on.
  const on = datesOf(value);
  if (draft && draft.on !== on) setDraft(null);
  const typed = draft?.on === on ? draft : null;
  const shown = typed ?? {
    start: formatDate(value.start),
    end: formatDate(value.end),
    error: null,
    on,
  };

  const apply = () => {
    if (!typed) return;
    const period = tryCustomPeriod(typed.start, typed.end);
    if (typeof period === 'string') setDraft({ ...typed, error: period });
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
      onKeyDown={(event: KeyboardEvent) => event.key === 'Enter' && apply()}
      className={`w-28 rounded-control-sm border bg-surface-2 px-2.5 py-1 text-sm text-fg tabular-nums ${focusRing} ${
        fieldInvalid(field) ? 'border-danger' : 'border-border-control'
      }`}
    />
  );

  const kinds = (
    <Segmented
      label={labels.kinds.group}
      options={PERIOD_KINDS.map((kind) => ({ value: kind, label: labels.kinds[kind] }))}
      value={value.kind}
      onChange={(kind) => change(switchKind(value, kind, today))}
    />
  );
  const todayButton = (
    <Button
      variant={onToday ? 'quiet' : 'default'}
      size="sm"
      onClick={() => {
        const target = todayPeriod(value, today);
        if (target !== value) change(target);
        onToday?.();
      }}
    >
      {labels.today}
    </Button>
  );
  const custom = value.kind === 'custom' && (
    <>
      {/* The two dates are one range: the focus moving from one to the other applies nothing. */}
      <span
        className={onToday ? 'flex gap-2' : 'contents'}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) apply();
        }}
      >
        {dateField('start', labels.from)}
        {dateField('end', labels.to)}
      </span>
      {shown.error && (
        <span id={errorId} className="text-xs text-danger">
          {errorNote[shown.error]}
        </span>
      )}
    </>
  );

  if (onToday) {
    return (
      <div className="flex flex-col items-start gap-2.5">
        {kinds}
        {custom}
        <div className="flex items-center gap-2 self-stretch border-t border-hairline pt-2 text-sm text-fg-2">
          <span className="flex-1">{labels.applies}</span>
          {todayButton}
        </div>
      </div>
    );
  }
  return (
    <div role="group" aria-labelledby={titleId} className="flex flex-wrap items-center gap-2">
      <span id={titleId} className="mr-1 text-xs font-semibold tracking-wider text-fg-3 uppercase">
        {labels.title}
      </span>
      {kinds}
      <PeriodStep value={value} by={-1} label={labels.previous} onStep={change} room={STEP_ROOM} />
      <output
        aria-live="polite"
        className="rounded-control-sm border border-border bg-surface-2 px-2.5 py-1 text-sm whitespace-nowrap text-fg tabular-nums"
      >
        {periodLabel(value, labels)}
      </output>
      <PeriodStep value={value} by={1} label={labels.next} onStep={change} room={STEP_ROOM} />
      {todayButton}
      {custom}
    </div>
  );
}
