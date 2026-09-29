import {
  compareDates,
  formatDate,
  formatVndCompact,
  type CalendarDate,
  type Person,
  type Policy,
  type Vnd,
} from '@p2c/domain';
import { Button, PolicyBadge } from '@p2c/ui';
import { t } from '../../i18n';
import { dayText } from '../appointments/appointment-form';
import { LINK } from '../appointments/appointments-view';

/**
 * Mockup customer.html "Hợp đồng": the customer's policies, newest submission first, each
 * submitted then issued; "Phát hành" until issued, and "Sửa" (8b, 8d). A short list rather than a
 * table, so it fits the narrow column. The customer's stage never depends on them.
 */
export function CustomerPolicies({
  policies,
  people,
  caseSize,
  today,
  onNew,
  onIssue,
  onEdit,
}: {
  policies: readonly Policy[];
  people: readonly Person[];
  caseSize: Vnd | null;
  today: CalendarDate;
  onNew: () => void;
  onIssue: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
}) {
  const dayFyp = (key: 'policies.submitted' | 'policies.issued', date: CalendarDate, fyp: Vnd) =>
    t(key, { date: dayText(date, today), fyp: formatVndCompact(fyp) });
  const meta = [
    t('policies.count', { count: policies.length }),
    caseSize !== null && t('policies.caseSize', { amount: formatVndCompact(caseSize) }),
  ].filter(Boolean);

  return (
    <section
      aria-labelledby="customer-policies"
      className="rounded-lg border border-border bg-surface-1 p-4"
    >
      <div className="mb-2 flex items-baseline gap-2">
        <h2 id="customer-policies" className="m-0 shrink-0 text-sm font-medium text-heading">
          {t('policies.title')}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">{meta.join(' · ')}</span>
        <div className="flex-1" />
        {policies.length > 0 && <Button onClick={onNew}>{t('policies.new')}</Button>}
      </div>
      {policies.length === 0 ? (
        <div className="flex items-center gap-3">
          <p className="m-0 text-sm text-fg-3">{t('policies.empty')}</p>
          <Button onClick={onNew}>{t('policies.new')}</Button>
        </div>
      ) : (
        <ul aria-label={t('policies.title')} className="m-0 flex list-none flex-col p-0">
          {[...policies]
            .sort((a, b) => compareDates(b.submittedDate, a.submittedDate))
            .map((p) => {
              const re = people.find((person) => person.id === p.reId);
              const submitted = formatDate(p.submittedDate);
              return (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border py-2 text-sm tabular-nums last:border-b-0"
                >
                  <PolicyBadge
                    issued={p.issuedDate !== null}
                    label={t(p.issuedDate ? 'policyStatus.issued' : 'policyStatus.submitted')}
                  />
                  <span>{dayFyp('policies.submitted', p.submittedDate, p.submittedFyp)}</span>
                  {p.issuedDate && p.issuedFyp !== null && (
                    <span>{dayFyp('policies.issued', p.issuedDate, p.issuedFyp)}</span>
                  )}
                  {re && <span className="text-fg-3">{re.name}</span>}
                  <span className="flex-1" />
                  {!p.issuedDate && (
                    <button
                      type="button"
                      aria-label={t('policies.issueLabel', { date: submitted })}
                      onClick={() => onIssue(p)}
                      className={LINK}
                    >
                      {t('policies.issue')}
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={t('policies.editLabel', { date: submitted })}
                    onClick={() => onEdit(p)}
                    className={LINK}
                  >
                    {t('policies.edit')}
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
