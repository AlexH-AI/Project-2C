import { useCallback, useState } from 'react';
import {
  getCustomer,
  getKycProfile,
  listKycVersions,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type Database,
} from '@p2c/db';
import { formatDate, type KycField } from '@p2c/domain';
import { Button, StageBadge } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { ChangeStageDialog, CustomerFormDialog } from './CustomerDialogs';
import { KycCard, Timeline } from './CustomerKyc';
import { KycNoteDialog, ResolveKycDialog } from './KycDialogs';
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
    kyc: getKycProfile(db, id),
    versions: listKycVersions(db, id),
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

/** Customer profile (mockup customer.html): the basics, KYC and timeline; appointments and policies come later. */
export function CustomerProfile({ id }: { id: string }) {
  const today = useAppData().today();
  const profile = useQuery(useCallback((db: Database) => readProfile(db, id), [id]));
  const [editing, setEditing] = useState<
    'profile' | 'stage' | 'note' | { resolve: KycField } | null
  >(null);

  if (!profile) {
    return (
      <>
        {BACK}
        <p className="m-0 text-sm text-fg-3">{t('customer.notFound')}</p>
      </>
    );
  }

  const { customer, re, team, policies, transitions, kyc, versions } = profile;
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
          <Button variant="primary" onClick={() => setEditing('note')}>
            {t('kycNote.open')}
          </Button>
        </div>
        <p className="m-0 text-sm text-fg-2 tabular-nums">{facts.join(' · ')}</p>
      </section>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <KycCard
          profile={kyc}
          versions={versions}
          onResolve={(field) => setEditing({ resolve: field })}
        />
        <Timeline transitions={transitions} notes={kyc.notes} versions={versions} />
      </div>
      {editing === 'profile' && (
        <CustomerFormDialog customer={customer} onClose={() => setEditing(null)} />
      )}
      {editing === 'stage' && (
        <ChangeStageDialog customer={customer} since={since} onClose={() => setEditing(null)} />
      )}
      {editing === 'note' && (
        <KycNoteDialog
          customer={customer}
          profile={kyc}
          versions={versions}
          onClose={() => setEditing(null)}
        />
      )}
      {typeof editing === 'object' && editing && (
        <ResolveKycDialog
          customer={customer}
          profile={kyc}
          versions={versions}
          field={editing.resolve}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
