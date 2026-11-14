import { formatCount, type Person, type Team } from '@p2c/domain';
import { t } from '../i18n';

const CHIP =
  'flex min-w-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const ON = 'border-accent bg-accent-soft font-semibold text-accent';
const OFF = 'border-border bg-surface-2 text-fg-2 hover:border-border-strong hover:text-fg';

/**
 * The RM strip of the Team scope (mockup phase-3-feedback B2): the whole team, or one of its RM.
 * A click on the RM already picked goes back to the whole team.
 */
export function RmPicker({
  team,
  rms,
  picked,
  counts,
  total,
  onPick,
}: {
  team: Team;
  /** The RM of the team, in the order shown. */
  rms: readonly Person[];
  /** The RM picked, or null for the whole team. */
  picked: string | null;
  /** The number beside each RM, by RM id; an RM not listed shows 0. */
  counts: ReadonlyMap<string, number>;
  /** The number beside "Cả team". */
  total: number;
  onPick: (rmId: string | null) => void;
}) {
  return (
    <section
      aria-label={t('rmPicker.label', { team: team.name })}
      className="flex gap-3.5 rounded-lg border border-border bg-surface-1 px-3.5 py-3"
    >
      <div className="flex w-50 shrink-0 flex-col gap-1.5 border-r border-border pr-3.5">
        {/* A long team name breaks in the column, not over the RM (DR6-170). */}
        <h2 className="m-0 text-sm font-semibold wrap-anywhere">
          {t('rmPicker.title', { team: team.name, count: rms.length })}
        </h2>
        <Chip
          name={t('rmPicker.all')}
          count={total}
          on={picked === null}
          onClick={() => onPick(null)}
        />
        <span className="mt-auto text-xs text-fg-3">{t('rmPicker.hint')}</span>
      </div>
      <div className="grid min-w-0 flex-1 grid-cols-5 content-start gap-1.5">
        {rms.map((rm) => (
          <Chip
            key={rm.id}
            name={rm.name}
            count={counts.get(rm.id) ?? 0}
            on={picked === rm.id}
            onClick={() => onPick(picked === rm.id ? null : rm.id)}
          />
        ))}
      </div>
    </section>
  );
}

function Chip({
  name,
  count,
  on,
  onClick,
}: {
  name: string;
  count: number;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`${CHIP} ${on ? ON : OFF}`}
    >
      <span className="truncate">{name}</span>
      <span className={`ml-auto tabular-nums ${on ? 'text-accent' : 'text-fg-3'}`}>
        {formatCount(count)}
      </span>
    </button>
  );
}
