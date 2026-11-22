import {
  compareDates,
  formatDate,
  type CalendarDate,
  type Money,
  type Person,
  type Policy,
} from '@p2c/domain';
import type { Ref } from 'react';
import { Button, PolicyBadge, StateNote } from '@p2c/ui';
import { joinParts, t } from '../../i18n';
import { dayText } from '../appointments/appointment-form';
import { CARD, HEADING, LINK } from '../classes';
import { policyStatus, policyStatusText } from './policy-form';
import { formatAmount, formatAmountCompact } from '../money-view';

/**
 * Mockup customer.html "Hợp đồng": the customer's policies, newest submission first, each
 * submitted then issued, maybe cancelled; "Phát hành" until issued, "Hủy HĐ" while issued
 * (huy-hd.html #row), and "Sửa" (8b, 8d). A short list rather than a table, so it fits the narrow
 * column. The customer's stage never depends on them.
 */
export function CustomerPolicies({
  policies,
  people,
  caseSize,
  today,
  heading,
  onNew,
  onIssue,
  onCancel,
  onEdit,
}: {
  policies: readonly Policy[];
  people: readonly Person[];
  caseSize: Money | null;
  today: CalendarDate;
  /** The card's heading: the focus lands there when a policy dialog's button went (DR6-83). */
  heading: Ref<HTMLHeadingElement>;
  onNew: () => void;
  onIssue: (policy: Policy) => void;
  onCancel: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
}) {
  const dayFyp = (key: 'policies.submitted' | 'policies.issued', date: CalendarDate, fyp: Money) =>
    t(key, { date: dayText(date, today), fyp: formatAmountCompact(fyp) });
  // "1 HĐ · 1 đã hủy": the count leaves the cancelled ones out (golden mục 4.4 point 10).
  const cancelled = policies.filter((p) => p.cancelledDate !== null).length;
  const meta = [
    t('policies.count', { count: policies.length - cancelled }),
    cancelled > 0 && t('policies.cancelledCount', { count: cancelled }),
    caseSize !== null && t('policies.caseSize', { amount: formatAmountCompact(caseSize) }),
  ].filter(Boolean);

  return (
    <section aria-labelledby="customer-policies" className={CARD}>
      <div className="mb-2 flex items-baseline gap-2">
        <h2 ref={heading} id="customer-policies" tabIndex={-1} className={`${HEADING} shrink-0`}>
          {t('policies.title')}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">{joinParts(meta)}</span>
        <div className="flex-1" />
        {policies.length > 0 && <Button onClick={onNew}>{t('policies.new')}</Button>}
      </div>
      {policies.length === 0 ? (
        <StateNote
          size="card"
          icon="info"
          title={t('policies.empty')}
          next={t('policies.emptyNext')}
          action={
            <Button size="sm" onClick={onNew}>
              {t('policies.new')}
            </Button>
          }
        />
      ) : (
        <ul aria-label={t('policies.title')} className="m-0 flex list-none flex-col p-0">
          {[...policies]
            .sort((a, b) => compareDates(b.submittedDate, a.submittedDate))
            .map((p) => {
              const rm = people.find((person) => person.id === p.rmId);
              const status = policyStatus(p);
              const statusText = policyStatusText(p);
              // A cancelled row steps back, its issued FYP struck out (huy-hd.html #row, option A).
              const off = status === 'cancelled';
              // The buttons' names say the FYP too, to tell two policies of one day apart (DR6-119),
              // and "Sửa" the status, as one submitted and one issued may share both: only the
              // first has "Phát hành".
              const nameParams = {
                date: formatDate(p.submittedDate),
                fyp: formatAmount(p.submittedFyp),
              };
              return (
                <li
                  key={p.id}
                  className={`flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border py-2 text-sm tabular-nums last:border-b-0 ${off ? 'text-fg-2' : ''}`}
                >
                  <PolicyBadge status={status} label={statusText} />
                  <span>{dayFyp('policies.submitted', p.submittedDate, p.submittedFyp)}</span>
                  {p.issuedDate && p.issuedFyp !== null && (
                    <span>
                      {off ? (
                        <>
                          {t('policies.issuedOn', { date: dayText(p.issuedDate, today) })}{' '}
                          {t('sep.dot')}{' '}
                          <s className="decoration-fg-3">{formatAmountCompact(p.issuedFyp)}</s>
                        </>
                      ) : (
                        dayFyp('policies.issued', p.issuedDate, p.issuedFyp)
                      )}
                    </span>
                  )}
                  {rm && <span className="min-w-0 wrap-anywhere text-fg-3">{rm.name}</span>}
                  <span className="flex-1" />
                  {status === 'submitted' && (
                    <button
                      type="button"
                      aria-label={t('policies.issueLabel', nameParams)}
                      onClick={() => onIssue(p)}
                      className={LINK}
                    >
                      {t('policies.issue')}
                    </button>
                  )}
                  {status === 'issued' && (
                    <button
                      type="button"
                      aria-label={t('policies.cancelLabel', nameParams)}
                      onClick={() => onCancel(p)}
                      className={LINK}
                    >
                      {t('policies.cancel')}
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={t('policies.editLabel', { ...nameParams, status: statusText })}
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
