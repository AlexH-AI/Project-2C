import { formatCount, type Person, type Team } from '@p2c/domain';
import { t } from '../i18n';

const CHIP =
  'flex min-w-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const ON = 'border-accent bg-accent-soft font-semibold text-accent';
const OFF = 'border-border bg-surface-2 text-fg-2 hover:border-border-strong hover:text-fg';

/**
 * The RE strip of the Team scope (mockup phase-3-feedback B2): the whole team, or one of its RE.
 * A click on the RE already picked goes back to the whole team.
 */
export function RePicker({
  team,
  res,
  picked,
  counts,
  total,
  onPick,
}: {
  team: Team;
  /** The RE of the team, in the order shown. */
  res: readonly Person[];
  /** The RE picked, or null for the whole team. */
  picked: string | null;
  /** The number beside each RE, by RE id; an RE not listed shows 0. */
  counts: ReadonlyMap<string, number>;
  /** The number beside "Cả team". */
  total: number;
  onPick: (reId: string | null) => void;
}) {
  return (
    <section
      aria-label={t('rePicker.label', { team: team.name })}
      className="flex gap-3.5 rounded-lg border border-border bg-surface-1 px-3.5 py-3"
    >
      <div className="flex w-50 shrink-0 flex-col gap-1.5 border-r border-border pr-3.5">
        <h2 className="m-0 text-sm font-semibold">
          {t('rePicker.title', { team: team.name, count: res.length })}
        </h2>
        <Chip
          name={t('rePicker.all')}
          count={total}
          on={picked === null}
          onClick={() => onPick(null)}
        />
        <span className="mt-auto text-xs text-fg-3">{t('rePicker.hint')}</span>
      </div>
      <div className="grid min-w-0 flex-1 grid-cols-5 content-start gap-1.5">
        {res.map((re) => (
          <Chip
            key={re.id}
            name={re.name}
            count={counts.get(re.id) ?? 0}
            on={picked === re.id}
            onClick={() => onPick(picked === re.id ? null : re.id)}
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
