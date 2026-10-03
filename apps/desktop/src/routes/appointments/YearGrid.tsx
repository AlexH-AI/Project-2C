import { formatCount } from '@p2c/domain';
import { t } from '../../i18n';
import { FOCUS, type MonthCell } from './appointments-view';

const CARD = 'rounded-lg border border-border bg-surface-1 p-4';

const GROUPS = [
  { key: 'met', label: 'appointments.legendMet', fill: 'bg-ok' },
  { key: 'missed', label: 'appointments.legendMissed', fill: 'bg-appt-missed' },
  { key: 'unrecorded', label: 'appointments.legendUnrecorded', fill: 'bg-appt-unrecorded' },
  { key: 'planned', label: 'appointments.legendPlanned', fill: 'bg-info' },
] as const;

const CELL = {
  past: 'border-border bg-surface-2 hover:border-border-strong',
  current: 'border-accent bg-accent-soft inset-ring inset-ring-accent',
  future: 'border-dashed border-border bg-surface-1 hover:border-border-strong',
} as const satisfies Record<MonthCell['state'], string>;

const NAME = {
  past: 'font-semibold',
  current: 'font-semibold text-accent',
  future: 'font-medium text-fg-3',
} as const satisfies Record<MonthCell['state'], string>;

const total = (cell: MonthCell) => cell.met + cell.missed + cell.unrecorded + cell.planned;

/** The year period of Appointments (mockup phase-3-feedback B6): four quarters of three months. */
export function YearGrid({
  cells,
  year,
  onPickMonth,
}: {
  cells: readonly MonthCell[];
  year: number;
  onPickMonth: (month: number) => void;
}) {
  const quarters = [0, 1, 2, 3].map((q) => cells.slice(q * 3, q * 3 + 3));
  return (
    <section aria-labelledby="appointments-year" className={CARD}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 id="appointments-year" className="m-0 text-sm font-medium text-heading">
          {t('appointments.year', { year })}
        </h2>
        <span className="text-xs text-fg-3">{t('appointments.yearHint')}</span>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {quarters.map((months, q) => (
          <div
            key={q}
            role="group"
            aria-label={t('appointments.quarter', { quarter: q + 1 })}
            className="flex min-w-0 flex-col gap-2"
          >
            <p className="m-0 flex flex-wrap justify-between gap-x-2 px-1 text-xs whitespace-nowrap tracking-wider text-fg-3 uppercase tabular-nums">
              <span aria-hidden="true">{t('appointments.quarter', { quarter: q + 1 })}</span>
              <span>
                {t('appointments.quarterTotal', {
                  count: formatCount(months.reduce((sum, cell) => sum + total(cell), 0)),
                })}
              </span>
            </p>
            {months.map((cell) => (
              <MonthButton key={cell.month} cell={cell} year={year} onPick={onPickMonth} />
            ))}
          </div>
        ))}
      </div>
      <p className="m-0 mt-2.5 flex flex-wrap gap-3.5 text-xs text-fg-2">
        {GROUPS.map((group) => (
          <span key={group.key} className="flex items-center gap-1.5">
            <i aria-hidden="true" className={`inline-block size-2 rounded-full ${group.fill}`} />
            {t(group.label)}
          </span>
        ))}
        <span>{t('appointments.legendBar')}</span>
      </p>
    </section>
  );
}

function MonthButton({
  cell,
  year,
  onPick,
}: {
  cell: MonthCell;
  year: number;
  onPick: (month: number) => void;
}) {
  const count = total(cell);
  const future = cell.state === 'future';
  return (
    <button
      type="button"
      aria-current={cell.state === 'current' ? 'date' : undefined}
      aria-label={t('appointments.monthCount', {
        month: cell.month,
        year,
        count: formatCount(count),
      })}
      onClick={() => onPick(cell.month)}
      className={`flex cursor-pointer flex-col gap-2 rounded-md border px-2.75 pt-2.25 pb-2.5 text-left tabular-nums focus-visible:outline-offset-2 ${FOCUS} ${CELL[cell.state]}`}
    >
      <span className="flex flex-wrap items-baseline justify-between gap-x-2 whitespace-nowrap">
        <span className={`text-md ${NAME[cell.state]}`}>
          {t('appointments.monthCell', { month: cell.month })}
        </span>
        <span className="text-xs text-fg-3">
          <b className="mr-0.75 text-lg text-fg">{formatCount(count)}</b>
          {t('appointments.unit')}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`flex h-5 gap-px overflow-hidden rounded-sm ${
          future ? 'border border-dashed border-border-strong' : 'bg-surface-3'
        }`}
      >
        {count === 0 ? (
          <span className="grid flex-1 place-items-center text-xs font-medium text-fg-3">
            {t('appointments.monthEmpty')}
          </span>
        ) : (
          GROUPS.map(
            (group) =>
              cell[group.key] > 0 && (
                <span
                  key={group.key}
                  title={t('appointments.segment', {
                    group: t(group.label),
                    count: formatCount(cell[group.key]),
                  })}
                  style={{ flex: cell[group.key] }}
                  className={`@container grid min-w-0.75 place-items-center text-xs font-bold ${
                    future && group.key === 'planned'
                      ? 'bg-info/25 text-fg'
                      : `${group.fill} text-on-accent`
                  }`}
                >
                  {/* A part narrower than `--container-bar-label` keeps its count for the tooltip only. */}
                  <span className="@max-bar-label:invisible">{formatCount(cell[group.key])}</span>
                </span>
              ),
          )
        )}
      </span>
    </button>
  );
}
