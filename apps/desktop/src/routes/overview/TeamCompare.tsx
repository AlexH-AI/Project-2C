import { Fragment, useState } from 'react';
import { t } from '../../i18n';
import type { CompareRow, TeamCompareView } from './team-compare-view';

const HEADERS = [
  t('overview.compare.met'),
  t('overview.kpi.rf'),
  t('overview.kpi.submitted'),
  t('overview.kpi.caseSize'),
  t('overview.kpi.issued'),
  t('overview.kpi.revenue'),
  t('overview.kpi.closeRate'),
];

const CELL = 'border-b border-border px-2.5 py-2 whitespace-nowrap';

function Figures({ row }: { row: CompareRow }) {
  return row.cells.map((cell, index) => (
    <td key={HEADERS[index]} className={`${CELL} text-right`}>
      {cell}
    </td>
  ));
}

/**
 * So sánh team (mockup overview.html 1a): teams by name, a click opens the team's RE right under
 * it and a second click closes them. No sorting by column, to keep each team and its RE together.
 */
export function TeamCompare({ view, mtd }: { view: TeamCompareView; mtd: boolean }) {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const toggle = (teamId: string) =>
    setOpen((before) => {
      const after = new Set(before);
      if (!after.delete(teamId)) after.add(teamId);
      return after;
    });
  const title = t('overview.compare.title');

  return (
    <section
      aria-label={title}
      className="flex flex-col gap-3 rounded-md border border-border bg-surface-1 px-3.5 py-3"
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="m-0 text-sm font-medium text-heading">{title}</h2>
        {view.range && (
          <span className="text-xs text-fg-3 tabular-nums">
            {view.range}
            {mtd && ` ${t('overview.compare.mtd')}`}
          </span>
        )}
        <span className="ml-auto text-xs text-fg-3">{t('overview.compare.hint')}</span>
      </div>
      <table aria-label={title} className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {[t('overview.compare.team'), ...HEADERS].map((header, index) => (
              <th
                key={header}
                scope="col"
                className={`border-b border-border px-2.5 py-1.5 text-xs font-semibold tracking-wider whitespace-nowrap text-fg-3 uppercase ${index ? 'text-right' : 'text-left'}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {view.teams.map((team) => {
            const expanded = open.has(team.key);
            return (
              <Fragment key={team.key}>
                <tr
                  onClick={() => toggle(team.key)}
                  className={`cursor-pointer ${expanded ? 'bg-surface-2' : 'hover:bg-surface-2'}`}
                >
                  <th scope="row" className={`${CELL} text-left font-semibold`}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggle(team.key);
                      }}
                      className="inline-flex cursor-pointer items-center rounded-sm font-semibold focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <span
                        aria-hidden="true"
                        className={`inline-block w-3.5 ${expanded ? 'text-accent' : 'text-fg-3'}`}
                      >
                        {expanded ? '▾' : '▸'}
                      </span>
                      {team.name}
                    </button>
                  </th>
                  <Figures row={team} />
                </tr>
                {expanded &&
                  team.res.map((re) => (
                    <tr key={re.key} className="bg-surface-0 text-fg-2">
                      <th scope="row" className={`${CELL} pl-8.5 text-left font-normal`}>
                        {re.name}
                      </th>
                      <Figures row={re} />
                    </tr>
                  ))}
              </Fragment>
            );
          })}
          <tr className="font-semibold">
            <th scope="row" className={`${CELL} border-t border-t-border-strong text-left`}>
              {view.total.name}
            </th>
            {view.total.cells.map((cell, index) => (
              <td
                key={HEADERS[index]}
                className={`${CELL} border-t border-t-border-strong text-right`}
              >
                {cell}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}
