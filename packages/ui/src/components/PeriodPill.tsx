import { canShift, shift, type CalendarDate, type Period } from '@p2c/domain';
import { LAYER, useLayer } from './Menu';
import { PeriodPicker, type PeriodPickerLabels } from './PeriodPicker';
import { periodLabel } from './PeriodPicker.label';

const RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const STEP = `cursor-pointer rounded-control-sm px-1 text-lg leading-none text-fg-2 hover:text-fg aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:text-fg-2 ${RING}`;

/**
 * The period of a toolbar (mockup ui2.css `.cap`, app-shell.html `#toolbar`): ‹ › step one period
 * back or on, and the name of the period opens the kinds, the custom dates and "Hôm nay" in a
 * layer under it. A choice applies at once; "Hôm nay" closes the layer, as Esc or a press outside
 * does. A step that would leave 1900–2100 is off, and keeps the focus it has.
 */
export function PeriodPill({
  value,
  onChange,
  today,
  labels,
}: {
  value: Period;
  onChange: (period: Period) => void;
  today: CalendarDate;
  labels: PeriodPickerLabels;
}) {
  const { open, setOpen, close, root, trigger } = useLayer();
  const step = (by: -1 | 1, label: string, mark: string) => {
    const off = !canShift(value, by);
    return (
      <button
        type="button"
        aria-label={label}
        // Off by `aria-disabled`, which keeps the focus: `disabled` would drop the focus of a step
        // that just reached the end to the page (DR6-186).
        aria-disabled={off}
        onClick={() => {
          if (!off) onChange(shift(value, by));
        }}
        className={STEP}
      >
        {mark}
      </button>
    );
  };
  return (
    <span ref={root} className="relative inline-flex">
      <span
        role="group"
        aria-label={labels.title}
        className="btn-default inline-flex h-8.5 items-center gap-0.5 rounded-control px-2 text-md"
      >
        {step(-1, labels.previous, '‹')}
        <button
          ref={trigger}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={`cursor-pointer rounded-control-sm px-1.5 whitespace-nowrap tabular-nums ${RING}`}
        >
          {periodLabel(value, labels)}
        </button>
        {step(1, labels.next, '›')}
      </span>
      {open && (
        <div role="dialog" aria-label={labels.pick} className={`${LAYER} rounded-pop p-3`}>
          <PeriodPicker
            value={value}
            onChange={onChange}
            today={today}
            labels={labels}
            onToday={close}
          />
        </div>
      )}
    </span>
  );
}
