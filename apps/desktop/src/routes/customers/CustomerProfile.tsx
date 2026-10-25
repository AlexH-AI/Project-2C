import type { ExtractedFact } from '@p2c/ai';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCustomer,
  getKycProfile,
  listAiAnalyses,
  listAppointments,
  listKycRecordingOrder,
  listKycVersionFacts,
  listKycVersions,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type AppointmentRecord,
  type Database,
  type KycNoteRecord,
} from '@p2c/db';
import { formatDate, type KycField, type Policy } from '@p2c/domain';
import { Button, DialogFocusFallback, StageBadge } from '@p2c/ui';
import { useQuery, useToday } from '../../data/AppDataContext';
import { sortedByName } from '../../data/tables';
import { joinParts, t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { AppointmentDialog } from '../appointments/AppointmentDialog';
import { CustomerAppointments } from './CustomerAppointments';
import { CustomerPolicies } from './CustomerPolicies';
import { ChangeStageDialog, CustomerFormDialog } from './CustomerDialogs';
import { KycCard, Timeline } from './CustomerKyc';
import { KycIntelligence } from './KycIntelligence';
import { ConfirmFactDialog, KycNoteDialog, ResolveKycDialog } from './KycDialogs';
import { NoteEvent } from './KycExtraction';
import { PolicyDialog, type PolicyMode } from './PolicyDialogs';
import { ageOn, birthLabel, stageSince } from './customers-view';
import { factAnchor } from './kyc-view';
import { expectedCaseSize } from './policy-form';

function readProfile(db: Database, id: string) {
  const customer = getCustomer(db, id);
  if (!customer) return undefined;
  const people = sortedByName(listPeople(db));
  const teams = sortedByName(listTeams(db));
  const re = people.find((person) => person.id === customer.reId);
  const transitions = listStageTransitions(db, id);
  return {
    customer,
    re,
    team: teams.find((team) => team.id === re?.teamId),
    policies: listPolicies(db).filter((policy) => policy.customerId === id),
    transitions,
    kyc: getKycProfile(db, id),
    versions: listKycVersions(db, id),
    // The facts each version recorded: "+ F9, F12, F13 · kyc v3" on the timeline (T-297); the
    // order the notes and versions were saved in orders them within a day (review of PR 835).
    versionFacts: listKycVersionFacts(db, id),
    recordingOrder: listKycRecordingOrder(db, id),
    analyses: listAiAnalyses(db, id),
    // What the appointment dialog reads, for this one customer.
    appointmentData: {
      appointments: listAppointments(db, id),
      customers: [customer],
      people,
      teams,
      transitions,
    },
  };
}

const MARK_MS = 2000;

const BACK = (
  <a
    href={routeToHash({ screen: 'customers' })}
    className="self-start rounded-sm text-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
  >
    {t('customer.back')}
  </a>
);

/** Customer profile (mockup customer.html): the basics, KYC and policies, timeline and appointments. */
export function CustomerProfile({ id }: { id: string }) {
  const today = useToday();
  const profile = useQuery(useCallback((db: Database) => readProfile(db, id), [id]));
  const [editing, setEditing] = useState<
    'profile' | 'stage' | 'note' | { resolve: KycField } | null
  >(null);
  // Xác nhận of an AI proposal (mockup ai.html 3f).
  const [confirming, setConfirming] = useState<{
    readonly note: KycNoteRecord;
    readonly proposal: ExtractedFact;
    readonly onSaved: () => void;
  } | null>(null);
  const [appointing, setAppointing] = useState<{ from?: AppointmentRecord } | null>(null);
  const [policyMode, setPolicyMode] = useState<PolicyMode | null>(null);
  const policiesHeading = useRef<HTMLHeadingElement>(null);
  const factsHeading = useRef<HTMLHeadingElement>(null);
  // The ChatGPT web session of the panel: AI trích xuất is off while it waits (§3.1 item 4).
  const [webOpen, setWebOpen] = useState(false);
  const onIssue = (policy: Policy) => setPolicyMode({ kind: 'issue', policy });
  const onEditPolicy = (policy: Policy) => setPolicyMode({ kind: 'edit', policy });
  const next = (from: AppointmentRecord) => setAppointing({ from });
  // The fact a click on evidence led to, outlined about 2 seconds (mockup ai.html 3a); a new object
  // per click, so a second click on the same code starts the time again.
  const [marked, setMarked] = useState<{ readonly code: string } | null>(null);
  useEffect(() => {
    if (!marked) return;
    const timer = setTimeout(() => setMarked(null), MARK_MS);
    return () => clearTimeout(timer);
  }, [marked]);
  // The focus goes with it, so the keyboard and a screen reader are at the fact too (DR5-38).
  const showFact = (code: string) => {
    const fact = document.getElementById(factAnchor(code));
    fact?.scrollIntoView({ block: 'center' });
    fact?.focus({ preventScroll: true });
    setMarked({ code });
  };

  if (!profile) {
    return (
      <>
        {BACK}
        <p className="m-0 text-sm text-fg-3">{t('customer.notFound')}</p>
      </>
    );
  }

  const {
    customer,
    re,
    team,
    policies,
    transitions,
    kyc,
    versions,
    versionFacts,
    recordingOrder,
    analyses,
    appointmentData,
  } = profile;
  // Every customer has its first transition (spec §3.4).
  const since = stageSince(transitions).get(customer.id)!;
  const birth = customer.birthDate;
  const caseSize = expectedCaseSize(appointmentData.appointments);
  const facts = [
    customer.code,
    customer.gender && t(`gender.${customer.gender}`),
    birth && t('customer.birth', { date: birthLabel(birth), age: ageOn(birth, today) }),
    re && t('customers.re', { name: re.name }),
    team && t('customer.team', { name: team.name }),
    policies.length > 0
      ? t('customer.hasPolicies', { count: policies.length })
      : t('customer.noPolicies'),
  ].filter(Boolean);

  return (
    <>
      {BACK}
      <section aria-labelledby="customer-name" className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <h2 id="customer-name" className="m-0 min-w-0 text-lg font-semibold wrap-anywhere">
            {customer.name}
          </h2>
          <StageBadge stage={customer.stage} label={t(`stage.${customer.stage}`)} />
          <span className="text-xs text-fg-3 tabular-nums">
            {t('customer.since', { date: formatDate(since) })}
          </span>
          <div className="flex-1" />
          <Button onClick={() => setEditing('profile')}>{t('customer.edit')}</Button>
          <Button onClick={() => setEditing('stage')}>{t('customer.changeStage')}</Button>
          <Button onClick={() => setAppointing({})}>{t('appointments.new')}</Button>
          <Button variant="primary" onClick={() => setEditing('note')}>
            {t('kycNote.open')}
          </Button>
        </div>
        <p className="m-0 text-sm text-fg-2 tabular-nums">{joinParts(facts)}</p>
      </section>
      {/* Three columns from the default 1 440 × 900 window, as the mockup (DR6-30); a column does
          not grow past its share for a long link, the text breaks instead (DR6-82). */}
      <div className="grid items-start gap-4 lg:grid-cols-2 wide:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4">
          <KycCard
            profile={kyc}
            versions={versions}
            marked={marked?.code ?? null}
            heading={factsHeading}
            onResolve={(field) => setEditing({ resolve: field })}
          />
          <CustomerPolicies
            policies={policies}
            people={appointmentData.people}
            caseSize={caseSize}
            today={today}
            heading={policiesHeading}
            onNew={() => setPolicyMode({ kind: 'new' })}
            onIssue={onIssue}
            onEdit={onEditPolicy}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <Timeline
            transitions={transitions}
            kyc={{ notes: kyc.notes, facts: kyc.facts, versions, versionFacts, recordingOrder }}
            appointments={appointmentData.appointments}
            people={appointmentData.people}
            today={today}
            onNext={next}
            renderNote={(note, noteVersions) => (
              <NoteEvent
                note={note}
                versions={noteVersions}
                facts={kyc.facts}
                webOpen={webOpen}
                onConfirm={(note, proposal, onSaved) => setConfirming({ note, proposal, onSaved })}
              />
            )}
          />
          <CustomerAppointments
            appointments={appointmentData.appointments}
            transitions={transitions}
            today={today}
            onNext={next}
          />
        </div>
        <div className="min-w-0 lg:col-span-2 wide:col-span-1">
          <KycIntelligence
            key={customer.id}
            customerId={customer.id}
            facts={kyc.facts}
            versions={versions}
            analyses={analyses}
            onShowFact={showFact}
            onWebOpen={setWebOpen}
          />
        </div>
      </div>
      {appointing && (
        <AppointmentDialog
          data={appointmentData}
          customer={customer}
          from={appointing.from}
          onClose={() => setAppointing(null)}
          onCreated={() => undefined}
          onSeeAll={() => {
            setAppointing(null);
            document.getElementById('customer-appointments')?.scrollIntoView({ block: 'start' });
          }}
        />
      )}
      {/* The empty card's "+ Hợp đồng", a row's "Phát hành", a deleted row: gone with the save, so
          the focus goes to the top of the card (DR6-83). */}
      <DialogFocusFallback value={() => policiesHeading.current}>
        {policyMode && (
          <PolicyDialog
            customer={customer}
            mode={policyMode}
            people={appointmentData.people}
            teams={appointmentData.teams}
            caseSize={caseSize}
            onClose={() => setPolicyMode(null)}
          />
        )}
      </DialogFocusFallback>
      {editing === 'profile' && (
        <CustomerFormDialog
          customer={customer}
          onClose={() => setEditing(null)}
          onDeleted={() => {
            // The profile now says the customer is not found: go on to the list (TR-9).
            window.location.hash = routeToHash({ screen: 'customers' });
          }}
        />
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
      {confirming && (
        <ConfirmFactDialog
          customer={customer}
          profile={kyc}
          versions={versions}
          {...confirming}
          onClose={() => setConfirming(null)}
        />
      )}
      {/* Resolved, the trường's "Giải quyết" goes: the focus goes to the top of the KYC card. */}
      <DialogFocusFallback value={() => factsHeading.current}>
        {typeof editing === 'object' && editing && (
          <ResolveKycDialog
            customer={customer}
            profile={kyc}
            versions={versions}
            field={editing.resolve}
            onClose={() => setEditing(null)}
          />
        )}
      </DialogFocusFallback>
    </>
  );
}
