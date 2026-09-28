import { useCallback, useState } from 'react';
import {
  getCustomer,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type Database,
} from '@p2c/db';
import { formatDate } from '@p2c/domain';
import { Button, StageBadge } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { ChangeStageDialog, CustomerFormDialog } from './CustomerDialogs';
import { ageOn, birthLabel } from './customers-view';

function readProfile(db: Database, id: string) {
  const customer = getCustomer(db, id);
  if (!customer) return undefined;
  const re = listPeople(db).find((person) => person.id === customer.reId);
  return {
    customer,
    re,
    team: listTeams(db).find((team) => team.id === re?.teamId),
    policies: listPolicies(db).filter((policy) => policy.customerId === id).length,
    transitions: listStageTransitions(db, id),
  };
}

const BACK = (
  <a
    href={routeToHash({ screen: 'customers' })}
    className="self-start rounded-sm text-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
  >
    {t('customer.back')}
  </a>
);

/** Customer profile (mockup customer.html): the basics; KYC, appointments and policies come later. */
export function CustomerProfile({ id }: { id: string }) {
  const today = useAppData().today();
  const profile = useQuery(useCallback((db: Database) => readProfile(db, id), [id]));
  const [editing, setEditing] = useState<'profile' | 'stage' | null>(null);

  if (!profile) {
    return (
      <>
        {BACK}
        <p className="m-0 text-sm text-fg-3">{t('customer.notFound')}</p>
      </>
    );
  }

  const { customer, re, team, policies, transitions } = profile;
  // Every customer has its first transition (spec §3.4).
  const since = transitions.at(-1)!.date;
  const birth = customer.birthDate;
  const facts = [
    customer.code,
    customer.gender && t(`gender.${customer.gender}`),
    birth && t('customer.birth', { date: birthLabel(birth), age: ageOn(birth, today) }),
    re && t('customers.re', { name: re.name }),
    team && t('customer.team', { name: team.name }),
    policies > 0 ? t('customer.hasPolicies', { count: policies }) : t('customer.noPolicies'),
  ].filter(Boolean);

  return (
    <>
      {BACK}
      <section aria-labelledby="customer-name" className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <h2 id="customer-name" className="m-0 text-lg font-semibold">
            {customer.name}
          </h2>
          <StageBadge stage={customer.stage} label={t(`stage.${customer.stage}`)} />
          <span className="text-xs text-fg-3 tabular-nums">
            {t('customer.since', { date: formatDate(since) })}
          </span>
          <div className="flex-1" />
          <Button onClick={() => setEditing('profile')}>{t('customer.edit')}</Button>
          <Button onClick={() => setEditing('stage')}>{t('customer.changeStage')}</Button>
        </div>
        <p className="m-0 text-sm text-fg-2 tabular-nums">{facts.join(' · ')}</p>
      </section>
      <section
        aria-labelledby="stage-history"
        className="rounded-lg border border-border bg-surface-1 p-4"
      >
        <h2 id="stage-history" className="m-0 mb-2 text-sm font-medium text-heading">
          {t('customer.history')}
        </h2>
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0 text-sm">
          {[...transitions].reverse().map((move) => (
            <li key={move.id} className="flex items-center gap-2">
              <span className="w-24 text-fg-3 tabular-nums">{formatDate(move.date)}</span>
              {move.from && <StageBadge stage={move.from} label={t(`stage.${move.from}`)} />}
              {move.from && '→'}
              <StageBadge stage={move.to} label={t(`stage.${move.to}`)} />
              <span className="text-xs text-fg-3">
                {t(
                  move.from === null
                    ? 'customer.created'
                    : move.appointmentId
                      ? 'customer.byMeeting'
                      : 'customer.manual',
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>
      {editing === 'profile' && (
        <CustomerFormDialog customer={customer} onClose={() => setEditing(null)} />
      )}
      {editing === 'stage' && (
        <ChangeStageDialog customer={customer} since={since} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
