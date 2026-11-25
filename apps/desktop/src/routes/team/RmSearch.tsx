import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import type { Person, Team } from '@p2c/domain';
import { NavIcon, StateNote } from '@p2c/ui';
import { t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { navigate } from '../../shell/useRoute';
import { foundIn } from '../customers/customer-search';
import { rmMatches, type RmHit } from './rm-search';
import { TeamMark } from './TeamLook';

// The option and its pick as the search of Khách hàng draws them (C1, mockup `.pal-o`).
const OPTION =
  'relative flex min-h-9 shrink-0 cursor-pointer items-center gap-2.5 rounded-control-sm px-2.5 text-md whitespace-nowrap';
// Only on a row not picked: the picked one keeps --fill-2 under the pointer (mockup `.pal-o.sel`, review of PR 1487).
const HOVER = 'hover:bg-fill-1';
const PICKED =
  'bg-fill-2 win:before:absolute win:before:inset-y-2.5 win:before:left-0 win:before:w-0.75 win:before:rounded-full win:before:bg-accent';
const POP =
  'pop absolute top-full left-0 z-20 mt-1.5 flex w-120 max-w-screen flex-col rounded-menu';

/** The name with the part typed lit (mockup `.pal-o mark`). */
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

/**
 * "Tìm RM" of Team & nhân sự (C2b, mockup search-rm-team.html `#team`): a combobox whose list names
 * the best matches "RM Họ tên – Team" (`rmMatches`). ↑ ↓ pick, Enter or a click opens the page of
 * the RM, Esc clears what is typed; the focus stays in the field.
 */
export function RmSearch({ people, teams }: { people: readonly Person[]; teams: readonly Team[] }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const found = useMemo(() => rmMatches(people, teams, query), [people, teams, query]);
  const hits = found ?? [];
  const open = focused && hits.length > 0;
  const at = Math.min(active, hits.length - 1);
  const pick = (hit: RmHit) => navigate(routeToHash({ screen: 'rm', id: hit.rm.id }));

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (event.key === 'Escape' && query !== '') setQuery('');
    else if (open && step) setActive((at + step + hits.length) % hits.length);
    else if (open && event.key === 'Enter') pick(hits[at]!);
    else return;
    event.preventDefault();
  };

  return (
    <div className="relative w-95 max-w-full">
      <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-fg-2">
        <NavIcon name="search" />
      </span>
      <input
        type="text"
        role="combobox"
        aria-label={t('team.searchRm.label')}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-${hits[at]!.rm.id}` : undefined}
        placeholder={t('team.searchRm.placeholder')}
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => {
          setActive(0);
          setQuery(event.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        className="field h-8.5 w-full rounded-field pr-2.75 pl-8.5 text-md"
      />
      {open && (
        <div
          id={`${id}-list`}
          role="listbox"
          aria-label={t('team.searchRm.list')}
          // A press on the list keeps the focus in the field: its blur would close the list first.
          onMouseDown={(event) => event.preventDefault()}
          className={`${POP} p-1.5`}
        >
          {hits.map((hit) => (
            <div
              key={hit.rm.id}
              id={`${id}-${hit.rm.id}`}
              role="option"
              aria-selected={hit === hits[at]}
              onClick={() => pick(hit)}
              className={`${OPTION} ${hit === hits[at] ? PICKED : HOVER}`}
            >
              <span className="min-w-0 flex-1 truncate">
                {t('rmPage.role')}{' '}
                <b className="font-semibold">
                  <Lit text={hit.rm.name} query={query} />
                </b>{' '}
                <span className="text-sm text-fg-2">
                  {/* The team with its icon (C3, mockup `.pal-o .tmark`). */}
                  {hit.team && <TeamMark team={hit.team} />}{' '}
                  {t('team.searchRm.sub', { team: hit.team?.name ?? '' })}
                </span>
              </span>
              <span className="text-xs text-fg-2">{t('team.searchRm.kind')}</span>
            </div>
          ))}
        </div>
      )}
      {focused && found?.length === 0 && (
        <div role="status" className={POP}>
          <StateNote
            size="card"
            icon="search"
            title={t('team.searchRm.none', { text: query.trim() })}
            next={t('team.searchRm.noneNext')}
          />
        </div>
      )}
    </div>
  );
}
