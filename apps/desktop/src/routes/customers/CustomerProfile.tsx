import { useCallback } from 'react';
import {
  getCustomer,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type Database,
} from '@p2c/db';
import { formatDate } from '@p2c/domain';
import { StageBadge } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
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
    since: listStageTransitions(db, id).at(-1)?.date,
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

  if (!profile) {
    return (
      <>
        {BACK}
        <p className="m-0 text-sm text-fg-3">{t('customer.notFound')}</p>
      </>
    );
  }

  const { customer, re, team, policies, since } = profile;
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
          {since && (
            <span className="text-xs text-fg-3 tabular-nums">
              {t('customer.since', { date: formatDate(since) })}
            </span>
          )}
        </div>
        <p className="m-0 text-sm text-fg-2 tabular-nums">{facts.join(' · ')}</p>
      </section>
    </>
  );
}
