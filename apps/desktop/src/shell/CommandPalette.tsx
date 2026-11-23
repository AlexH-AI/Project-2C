import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { NavIcon, StateNote, useLeaveBehind, type NavIconName } from '@p2c/ui';
import { useTables, useToday } from '../data/AppDataContext';
import { t } from '../i18n';
import { customerIndex, foundIn } from '../routes/customers/customer-search';
import { TeamMark } from '../routes/team/TeamLook';
import { stageBadge } from '../routes/stage-badge';
import { commandTitle, paletteResults, type Command } from './command-palette';
import { CustomerName, useMaskToggle, useNameMask } from './NameMask';
import { askCommand } from './palette-commands';
import { routeToHash, type Route } from './routes';
import { SECTION_ICONS } from './Sidebar';
import { navigate } from './useRoute';

/** Where each command runs; the mask of names runs where the command bar is. */
const COMMAND_AT: Record<Exclude<Command, 'mask'>, Route> = {
  appointment: { screen: 'appointments' },
  customer: { screen: 'customers' },
  team: { screen: 'team' },
  export: { screen: 'reports' },
  backup: { screen: 'settings' },
};
const COMMAND_ICON: Record<Command, NavIconName> = {
  appointment: 'plus',
  customer: 'plus',
  team: 'plus',
  export: 'export',
  backup: 'data',
  mask: 'eye',
};

// The option and its pick as the search of Khách hàng draws them (C1, mockup `.pal-o`): 40 px here.
const OPTION =
  'relative flex min-h-10 shrink-0 cursor-pointer items-center gap-2.5 rounded-control-sm px-2.5 text-md whitespace-nowrap';
const PICKED =
  'bg-fill-2 win:before:absolute win:before:inset-y-2.5 win:before:left-0 win:before:w-0.75 win:before:rounded-full win:before:bg-accent';
const KBD =
  'mr-1 rounded-chip bg-fill-2 px-1.5 py-0.5 text-xs text-fg-2 inset-ring inset-ring-hairline';

/** The part typed, lit (mockup `.pal-o mark`). */
function Lit({ text, query }: { text: string; query: string }) {
  const at = foundIn(text, query);
  if (!at) return text;
  return (
    <>
      {text.slice(0, at[0])}
      <mark className="bg-transparent font-bold text-accent">{text.slice(...at)}</mark>
      {text.slice(at[1])}
    </>
  );
}

interface Option {
  readonly key: string;
  readonly kind: string;
  readonly pick: () => void;
  readonly face: ReactNode;
}

/**
 * The command bar (VA8, mockup search-rm-team.html `#palette`): a field over four groups, the
 * customers, the RMs, the screens and the commands (`paletteResults`). ↑ ↓ pick, Enter opens: a
 * customer's profile, an RM's page, a screen; a command runs at once or opens its dialog on its
 * screen (`askCommand`). Esc, a press on what is dimmed or the key again closes it, and the focus
 * goes back where it was. A masked name is found by the real one, shown masked and never lit.
 */
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const { customers, people, teams } = useTables();
  const today = useToday();
  const { masked } = useNameMask();
  const toggleMask = useMaskToggle();
  const index = useMemo(
    () => customerIndex({ customers, people, teams }),
    [customers, people, teams],
  );
  const found = paletteResults(query, { index, people, teams, today });
  useLeaveBehind(dialog);

  // Kept from the first run, as `Dialog` keeps it: StrictMode runs the effect again once the focus
  // is in the field.
  const opener = useRef<Element | null>(null);
  useEffect(() => {
    opener.current ??= document.activeElement;
    dialog.current?.showModal();
    return () => {
      const back = opener.current;
      if (back instanceof HTMLElement) back.focus({ preventScroll: true });
    };
  }, []);

  const go = (route: Route) => () => navigate(routeToHash(route));
  const run = (command: Command) => () => {
    if (command === 'mask') return toggleMask();
    navigate(routeToHash(COMMAND_AT[command]));
    askCommand(command);
  };
  const kind = (key: 'customer' | 'screen' | 'command') => t(`palette.kind.${key}`);
  const groups: [string, Option[]][] = [
    [
      t('palette.group.customers'),
      found.customers.map(({ customer, rm, team }) => ({
        key: `c-${customer.id}`,
        kind: kind('customer'),
        pick: go({ screen: 'customer', id: customer.id }),
        face: (
          <>
            {stageBadge(customer.stage)}
            <span className="min-w-0 flex-1 truncate">
              <b className="font-semibold">
                {masked ? (
                  <CustomerName name={customer.name} />
                ) : (
                  <Lit text={customer.name} query={query} />
                )}
              </b>{' '}
              <span className="text-sm text-fg-2">
                {t('customers.search.sub', { rm: rm?.name ?? '', team: team?.name ?? '' })}
              </span>
            </span>
            <span className="text-xs text-fg-2 tabular-nums">
              <Lit text={customer.code} query={query} />
            </span>
          </>
        ),
      })),
    ],
    [
      t('palette.group.rms'),
      found.rms.map(({ rm, team }) => ({
        key: `r-${rm.id}`,
        kind: t('team.searchRm.kind'),
        pick: go({ screen: 'rm', id: rm.id }),
        face: (
          <span className="min-w-0 flex-1 truncate">
            {t('rmPage.role')}{' '}
            <b className="font-semibold">
              <Lit text={rm.name} query={query} />
            </b>{' '}
            <span className="text-sm text-fg-2">
              {team && <TeamMark team={team} />}{' '}
              {t('team.searchRm.sub', { team: team?.name ?? '' })}
            </span>
          </span>
        ),
      })),
    ],
    [
      t('palette.group.screens'),
      found.screens.map((section) => ({
        key: `s-${section}`,
        kind: kind('screen'),
        pick: go({ screen: section }),
        face: (
          <>
            <NavIcon name={SECTION_ICONS[section]} className="size-4 text-fg-2" />
            <span className="min-w-0 flex-1 truncate">
              <Lit text={t(`screen.${section}`)} query={query} />
            </span>
          </>
        ),
      })),
    ],
    [
      t('palette.group.commands'),
      found.commands.map((command) => ({
        key: `k-${command}`,
        kind: kind('command'),
        pick: run(command),
        face: (
          <>
            <NavIcon name={COMMAND_ICON[command]} className="size-4 text-fg-2" />
            <span className="min-w-0 flex-1 truncate">
              <Lit text={commandTitle(command, today)} query={query} />
            </span>
          </>
        ),
      })),
    ],
  ];
  const options = groups.flatMap(([, list]) => list);
  const at = Math.min(active, options.length - 1);
  const pick = (option: Option) => {
    onClose();
    option.pick();
  };

  return (
    <dialog
      ref={dialog}
      data-palette=""
      aria-label={t('palette.label')}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // A press on what is dimmed lands on the dialog itself, outside its box.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="pop motion-dialog m-auto mt-21 w-155 max-w-full flex-col overflow-hidden rounded-pop p-0 text-fg open:flex"
    >
      <div className="flex h-14 flex-none items-center gap-3 border-b border-hairline pr-4 pl-4.5 text-fg-2">
        <NavIcon name="search" className="size-5" />
        <input
          type="text"
          role="combobox"
          aria-label={t('palette.label')}
          aria-autocomplete="list"
          aria-expanded={options.length > 0}
          aria-controls={`${id}-list`}
          aria-activedescendant={options[at] ? `${id}-${options[at].key}` : undefined}
          placeholder={t('palette.placeholder')}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => {
            setActive(0);
            setQuery(event.target.value);
          }}
          onKeyDown={(event) => {
            const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
            if (step && options.length > 0)
              setActive((at + step + options.length) % options.length);
            else if (event.key === 'Enter' && options[at]) pick(options[at]);
            else return;
            event.preventDefault();
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-title text-fg outline-none placeholder:text-fg-3"
        />
        <kbd className={KBD}>{t('palette.key.close')}</kbd>
      </div>
      <div
        id={`${id}-list`}
        role="listbox"
        aria-label={t('palette.label')}
        className="max-h-117.5 min-h-0 overflow-y-auto px-1.5 pt-1 pb-1.5"
      >
        {groups.map(
          ([name, list], group) =>
            list.length > 0 && (
              <div
                key={name}
                role="group"
                aria-labelledby={`${id}-g${group}`}
                className="flex flex-col"
              >
                <span
                  id={`${id}-g${group}`}
                  className="px-2.5 pt-2.25 pb-1 text-xs font-semibold text-fg-3"
                >
                  {name}
                </span>
                {list.map((option) => (
                  <div
                    key={option.key}
                    id={`${id}-${option.key}`}
                    role="option"
                    aria-selected={option === options[at]}
                    onClick={() => pick(option)}
                    className={`${OPTION} ${option === options[at] ? PICKED : 'hover:bg-fill-1'}`}
                  >
                    {option.face}
                    <span className="min-w-11 text-right text-xs text-fg-2">
                      {option.kind}
                      {option === options[at] && ` ${t('palette.kind.picked')}`}
                    </span>
                  </div>
                ))}
              </div>
            ),
        )}
        {options.length === 0 && (
          <div role="status">
            <StateNote
              size="card"
              icon="search"
              title={t('palette.none', { text: query.trim() })}
              next={t('palette.noneNext')}
            />
          </div>
        )}
      </div>
      <div className="flex flex-none flex-wrap gap-x-4 gap-y-1.5 border-t border-hairline px-4.5 py-2.25 text-xs text-fg-2">
        <span>
          <kbd className={KBD}>
            <Arrow up />
          </kbd>
          <kbd className={KBD}>
            <Arrow />
          </kbd>
          {t('palette.hint.pick')}
        </span>
        {(['open', 'close'] as const).map((key) => (
          <span key={key}>
            <kbd className={KBD}>{t(`palette.key.${key}`)}</kbd>
            {t(`palette.hint.${key}`)}
          </span>
        ))}
        <span className="ml-auto">
          <kbd className={KBD}>{t('palette.key.anywhere')}</kbd>
          {t('palette.hint.anywhere')}
        </span>
      </div>
    </dialog>
  );
}

/**
 * ↑ or ↓ of a key, drawn: written in vi.ts, the two arrows would be marks the token guard then
 * forbids in the sort arrows of `table-view.ts` of packages/ui.
 */
function Arrow({ up }: { up?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`inline size-3 fill-none stroke-current align-middle ${up ? '' : 'rotate-180'}`}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}
