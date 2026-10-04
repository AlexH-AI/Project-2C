import { t } from '../../i18n';
import { REPORT_STAGES, reportCells, type ReportRow } from './reports-view';

const STAGE_COLOR = {
  N4: 'text-n4',
  N3: 'text-n3',
  N2: 'text-n2',
  N1: 'text-n1',
  ON_HOLD: 'text-on-hold',
  LOST: 'text-lost',
} as const;

/** The 17 figure columns in their three groups; a group's first column has a rule on its left. */
const COLUMNS: readonly { readonly label: string; readonly className: string }[] = [
  { label: t('reports.col.met'), className: '' },
  { label: t('reports.col.missed'), className: '' },
  { label: t('reports.col.unrecorded'), className: 'text-appt-unrecorded' },
  { label: t('reports.col.planned'), className: '' },
  { label: t('reports.col.total'), className: '' },
  { label: t('overview.kpi.rf'), className: '' },
  { label: t('overview.kpi.submitted'), className: '' },
  { label: t('overview.kpi.caseSize'), className: '' },
  { label: t('overview.kpi.issued'), className: '' },
  { label: t('overview.kpi.revenue'), className: '' },
  { label: t('overview.kpi.closeRate'), className: '' },
  ...REPORT_STAGES.map((stage) => ({ label: t(`stage.${stage}`), className: STAGE_COLOR[stage] })),
];
const GROUPS = [
  { label: t('reports.group.appointments'), span: 5 },
  { label: t('reports.group.results'), span: 6 },
  { label: t('reports.group.stages'), span: 6 },
];
const GROUP_STARTS = new Set([0, 5, 11]);

const CELL = 'border-b border-border px-2 py-1.5 whitespace-nowrap';
const RULE = 'border-l border-l-border-strong';
/** The name column stays put while the figures scroll sideways. */
const STICKY = 'sticky left-0 z-1 bg-surface-1';

export type ReportLead = 'scope' | 'team' | 're';

/**
 * A report table (mockup reports.html 2a, 2b): the name column(s), then Lịch hẹn · Kết quả · KH
 * cuối kỳ. Theo RE has Team before RE, a rule where the team changes, and the RE name stays put.
 */
export function ReportTable({
  label,
  lead,
  rows,
  total,
}: {
  label: string;
  lead: ReportLead;
  rows: readonly ReportRow[];
  total?: ReportRow;
}) {
  const leads =
    lead === 're'
      ? [t('reports.col.team'), t('reports.col.re')]
      : [t(lead === 'team' ? 'reports.col.team' : 'reports.col.scope')];
  const nameIndex = leads.length - 1;

  const figures = (row: ReportRow, extra: string) =>
    reportCells(row).map((cell, index) => (
      <td
        key={COLUMNS[index]?.label}
        className={`${CELL} ${extra} text-right ${GROUP_STARTS.has(index) ? RULE : ''}`}
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
            {GROUPS.map((group) => (
              <th
                key={group.label}
                colSpan={group.span}
                scope="colgroup"
                className={`${CELL} ${RULE} border-b-border-strong text-center text-xs font-semibold tracking-wider text-heading uppercase`}
              >
                {group.label}
              </th>
            ))}
          </tr>
          <tr>
            {COLUMNS.map((column, index) => (
              <th
                key={column.label}
                scope="col"
                className={`border-b border-border px-2 py-1.5 align-bottom text-right text-xs leading-tight font-semibold ${column.className || 'text-fg-3'} ${GROUP_STARTS.has(index) ? RULE : ''}`}
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
                {lead === 're' && <td className={`${CELL} ${start} text-fg-2`}>{row.team}</td>}
                <th scope="row" className={`${CELL} ${start} ${STICKY} text-left font-semibold`}>
                  {row.name}
                </th>
                {figures(row, start)}
              </tr>
            );
          })}
          {total && (
            <tr className="font-semibold">
              <th
                scope="row"
                colSpan={leads.length}
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
