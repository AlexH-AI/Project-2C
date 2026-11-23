import { useId, useState, type KeyboardEvent, type RefObject } from 'react';
import { NavIcon } from '@p2c/ui';
import { t } from '../../i18n';
import { CustomerName, useNameMask } from '../../shell/NameMask';
import { routeToHash } from '../../shell/routes';
import { navigate } from '../../shell/useRoute';
import { stageBadge } from '../stage-badge';
import { foundIn, type CustomerFound, type CustomerHit } from './customer-search';

const OPTION =
  'relative flex min-h-9 shrink-0 cursor-pointer items-center gap-2.5 rounded-control-sm px-2.5 text-md whitespace-nowrap hover:bg-fill-1';
/** The option picked: lighter, and on Windows 11 a gold bar at its left (mockup `.pal-o.sel`). */
const PICKED =
  'bg-fill-2 win:before:absolute win:before:inset-y-2.5 win:before:left-0 win:before:w-0.75 win:before:rounded-full win:before:bg-accent';

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

/**
 * The search of Khách hàng (C1, mockup search-rm-team.html `#customers`): a combobox whose list
 * names the best matches "KH – RM – Team", those out of `view` in a group of their own (`#ask` 6).
 * ↑ ↓ pick, Enter opens the profile, Esc clears what is typed; the focus stays in the field. A
 * masked name is found by the real one and shown masked, never lit.
 */
export function CustomerSearch({
  query,
  onQuery,
  found,
  view,
  field,
}: {
  query: string;
  onQuery: (query: string) => void;
  found: CustomerFound | null;
  view: string;
  /** The field, which "Bỏ tìm" gives the focus back to. */
  field: RefObject<HTMLInputElement | null>;
}) {
  const id = useId();
  const { masked } = useNameMask();
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const hits = found ? [...found.inside, ...found.outside] : [];
  const open = focused && hits.length > 0;
  const at = Math.min(active, hits.length - 1);
  const pick = (hit: CustomerHit) =>
    navigate(routeToHash({ screen: 'customer', id: hit.customer.id }));

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (event.key === 'Escape' && query !== '') onQuery('');
    else if (open && step) setActive((at + step + hits.length) % hits.length);
    else if (open && event.key === 'Enter') pick(hits[at]!);
    else return;
    event.preventDefault();
  };

  const options = (group: readonly CustomerHit[]) =>
    group.map((hit) => {
      const { customer, rm, team } = hit;
      return (
        <div
          key={customer.id}
          id={`${id}-${customer.id}`}
          role="option"
          aria-selected={hit === hits[at]}
          onClick={() => pick(hit)}
          className={`${OPTION} ${hit === hits[at] ? PICKED : ''}`}
        >
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
        </div>
      );
    });
  const group = (label: 'inView' | 'outOfView', hits: readonly CustomerHit[]) =>
    hits.length > 0 && (
      <div role="group" aria-labelledby={`${id}-${label}`} className="flex flex-col">
        <span id={`${id}-${label}`} className="px-2.5 pt-2 pb-1 text-xs font-semibold text-fg-3">
          {t(`customers.search.${label}`, { scope: view })}
        </span>
        {options(hits)}
      </div>
    );

  return (
    <div className="relative w-95 max-w-full">
      <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-fg-2">
        <NavIcon name="search" />
      </span>
      <input
        ref={field}
        type="text"
        role="combobox"
        aria-label={t('customers.search.label')}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-${hits[at]!.customer.id}` : undefined}
        placeholder={t('customers.search.placeholder')}
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => {
          setActive(0);
          onQuery(event.target.value);
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
          aria-label={t('customers.search.list')}
          // A press on the list keeps the focus in the field: its blur would close the list first.
          onMouseDown={(event) => event.preventDefault()}
          className="pop absolute top-full left-0 z-20 mt-1.5 flex w-120 max-w-screen flex-col rounded-menu p-1.5"
        >
          {found!.outside.length > 0 ? (
            <>
              {group('inView', found!.inside)}
              {group('outOfView', found!.outside)}
            </>
          ) : (
            options(hits)
          )}
        </div>
      )}
    </div>
  );
}
