import { t } from '../../i18n';
import {
  REPORT_COLUMNS,
  REPORT_GROUPS,
  reportCells,
  type ReportColumn,
  type ReportMarkRow,
  type ReportRow,
} from './reports-view';

/** The headings in colour: Chưa ghi kết quả as its status, each stage of KH cuối kỳ as its own. */
const HEADING_COLOR: Partial<Record<ReportColumn['key'], string>> = {
  unrecorded: 'text-appt-unrecorded',
  N4: 'text-n4',
  N3: 'text-n3',
  N2: 'text-n2',
  N1: 'text-n1',
  ON_HOLD: 'text-on-hold',
  LOST: 'text-lost',
};
/** A group's first column has a rule on its left. */
const GROUP_STARTS = new Set(REPORT_GROUPS.map((group) => group.first));

const CELL = 'border-b border-border px-2 py-1.5 whitespace-nowrap';
const RULE = 'border-l border-l-border-strong';
/** The name column stays put while the figures scroll sideways. */
const STICKY = 'sticky left-0 z-1 bg-surface-1';
/**
 * A name of the lead columns: under a cap it keeps its one line and the column its width; a longer
 * one breaks at the cap, even with no space, so the figures stay readable (DR6-148).
 */
const NAME = 'block w-max max-w-60 whitespace-normal wrap-anywhere';
/** The light green bar on the left of the mark holding today (mockup reports.html 2c). */
const TODAY_BAR = 'before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-date-today';

const LEAD_HEADER = {
  scope: 'reports.col.scope',
  team: 'reports.col.team',
  mark: 'reports.col.mark',
} as const;

export type ReportLead = 'scope' | 'team' | 're' | 'mark';

/**
 * A report table (mockup reports.html 2a–2e): the name column(s), then Lịch hẹn · Kết quả · KH
 * cuối kỳ. Theo RE has Team before RE, a rule where the team changes, and the RE name stays put.
 * Theo mốc marks the mark holding today. A "—" is dimmed.
 */
export function ReportTable({
  label,
  lead,
  rows,
  total,
}: {
  label: string;
  lead: ReportLead;
  rows: readonly (ReportRow | ReportMarkRow)[];
  total?: ReportRow | undefined;
}) {
  const leads =
    lead === 're' ? [t('reports.col.team'), t('reports.col.re')] : [t(LEAD_HEADER[lead])];
  const none = t('overview.none');
  const nameIndex = leads.length - 1;

  const figures = (row: ReportRow, extra: string) =>
    reportCells(row).map((cell, index) => (
      <td
        key={REPORT_COLUMNS[index]?.key}
        className={`${CELL} ${extra} text-right ${GROUP_STARTS.has(index) ? RULE : ''} ${cell === none ? 'text-fg-3' : ''}`}
      >
        {cell}
      </td>
    ));

  return (
    <div className="overflow-x-auto">
      <table aria-label={label} className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {leads.map((header, index) => (
              <th
                key={header}
                rowSpan={2}
                scope="col"
                className={`${CELL} align-bottom text-left text-xs font-semibold text-fg-3 ${index === nameIndex ? STICKY : ''}`}
              >
                {header}
              </th>
            ))}
            {REPORT_GROUPS.map((group) => (
              <th
                key={group.group}
                colSpan={group.span}
                scope="colgroup"
                className={`${CELL} ${RULE} border-b-border-strong text-center text-xs font-semibold tracking-wider text-heading uppercase`}
              >
                {group.label}
              </th>
            ))}
          </tr>
          <tr>
            {REPORT_COLUMNS.map((column, index) => (
              <th
                key={column.key}
                scope="col"
                className={`border-b border-border px-2 py-1.5 align-bottom text-right text-xs leading-tight font-semibold ${HEADING_COLOR[column.key] ?? 'text-fg-3'} ${GROUP_STARTS.has(index) ? RULE : ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((row, index) => {
            const teamStart = lead === 're' && index > 0 && rows[index - 1]?.team !== row.team;
            const start = teamStart ? 'border-t border-t-border-strong' : '';
            return (
              <tr key={row.key}>
                {lead === 're' && (
                  <td className={`${CELL} ${start} text-fg-2`}>
                    <span className={NAME}>{row.team}</span>
                  </td>
                )}
                <th
                  scope="row"
                  className={`${CELL} ${start} ${STICKY} text-left font-semibold ${'today' in row && row.today ? TODAY_BAR : ''}`}
                >
                  <span className={NAME}>{row.name}</span>
                </th>
                {figures(row, start)}
              </tr>
            );
          })}
          {total && (
            <tr className="font-semibold">
              {/* Tổng sits in the RE column, sticky like the RE names; a wider sticky cell would
                  cover the first figures once the table scrolls. */}
              {lead === 're' && <td className={`${CELL} border-t border-t-border-strong`} />}
              <th
                scope="row"
                className={`${CELL} ${STICKY} border-t border-t-border-strong text-left`}
              >
                {total.name}
              </th>
              {figures(total, 'border-t border-t-border-strong')}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
