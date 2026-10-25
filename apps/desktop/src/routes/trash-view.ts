import {
  DbError,
  restoreAppointment,
  restoreCustomer,
  restorePerson,
  restorePolicy,
  restoreTeam,
  type Database,
  type KeptBy,
  type PurgeCounts,
  type PurgePlan,
  type TrashBlock,
  type TrashRef,
  type TrashRow,
} from '@p2c/db';
import {
  formatCount,
  formatDate,
  formatLocalDateTime,
  formatVnd,
  stripDiacritics,
  type CalendarDate,
  type CustomerStage,
} from '@p2c/domain';
import type { DataTableMoreLabels } from '@p2c/ui';
import { isUnsavedChangesError, type AppData, type PurgedTrash } from '../data/app-data';
import { errorMessage, joinParts, t } from '../i18n';
import { routeToHash } from '../shell/routes';
import { policyStatusText } from './customers/policy-form';

/** The kinds of the filter of Thùng rác, in the order of mockup 11a. */
export const TRASH_FILTERS = [
  'all',
  'customer',
  'appointment',
  'policy',
  'person',
  'team',
] as const;

export type TrashFilter = (typeof TRASH_FILTERS)[number];

export function trashCounts(rows: readonly TrashRow[]): Record<TrashFilter, number> {
  const counts = Object.fromEntries(TRASH_FILTERS.map((kind) => [kind, 0])) as Record<
    TrashFilter,
    number
  >;
  for (const row of rows) counts[row.kind] += 1;
  counts.all = rows.length;
  return counts;
}

/** The foot of a trash of over a hundred records (DR-03). */
export const TRASH_MORE: DataTableMoreLabels = {
  shown: (count, total) => t('trash.more.shown', { count, total }),
  more: (count) => t('trash.more.more', { count }),
  all: (total) => t('trash.more.all', { total }),
};

/** The name the search box looks in: its own, or its customer's for an appointment or a policy. */
function searchedName(row: TrashRow): string {
  return row.kind === 'appointment' || row.kind === 'policy'
    ? (row.owner.customer?.name ?? '')
    : row.name;
}

/** The rows of the kind whose name contains the text (accents and case ignored), in trash order. */
export function filterTrash(
  rows: readonly TrashRow[],
  filter: TrashFilter,
  query: string,
): readonly TrashRow[] {
  const needle = stripDiacritics(query.trim().toLowerCase());
  return rows.filter(
    (row) =>
      (filter === 'all' || row.kind === filter) &&
      (needle === '' || stripDiacritics(searchedName(row).toLowerCase()).includes(needle)),
  );
}

const stage = (value: CustomerStage) => t(`stage.${value}`);

/** The first line of "Bản ghi" (spec Phase 6 §4.2); a customer's stage and a policy's status are badges. */
export function recordTitle(row: TrashRow): string {
  switch (row.kind) {
    case 'appointment':
      return joinParts([appointmentWhen(row), t(`appointmentStatus.${row.status}`)]);
    case 'policy':
      return t('trash.policy.title', {
        date: formatDate(row.submittedDate),
        fyp: formatVnd(row.submittedFyp),
      });
    default:
      return row.name;
  }
}

type AppointmentRow = Extract<TrashRow, { kind: 'appointment' }>;

/** "02/10/2026 09:30", or the day alone. */
function appointmentWhen(at: { readonly date: CalendarDate; readonly time: string | null }) {
  const date = formatDate(at.date);
  return at.time === null ? date : t('trash.appointment.when', { date, time: at.time });
}

/** The line under it: what comes back with a customer, the stage change of a met appointment. */
export function recordDetail(row: TrashRow): string | null {
  switch (row.kind) {
    case 'customer': {
      const { effect } = row;
      return effect.kind === 'customer'
        ? t('trash.customer.with', {
            appointments: effect.appointments,
            policies: effect.policies,
            kycNotes: effect.kycNotes,
          })
        : null;
    }
    case 'appointment':
      return appointmentDetail(row);
    case 'person':
      return row.role;
    case 'team':
      return t('trash.team.members');
    case 'policy':
      return null;
  }
}

function appointmentDetail(row: AppointmentRow): string | null {
  const after =
    row.status === 'MET' && row.stageAfter !== null
      ? t('trash.appointment.stageAfter', { stage: stage(row.stageAfter) })
      : null;
  // A blocked restore moves nothing: the change counted from today's stage would mislead.
  if (row.blocked) return after;
  const { effect } = row;
  if (effect.kind === 'stageKept') {
    return t('trash.appointment.kept', { stage: stage(effect.stage) });
  }
  // A meeting that kept the stage when deleted comes back without a change (TR-3, E18, E19).
  if (effect.kind !== 'stageChange') {
    return after && joinParts([after, t('trash.appointment.noChange')]);
  }
  return joinParts([
    joinParts([stage(effect.from), stage(effect.to)], 'arrow'),
    effect.rf && t('trash.appointment.rf'),
  ]);
}

export interface OwnerPart {
  readonly text: string;
  /** Deleted too: "(đã xóa)" follows it. */
  readonly deleted: boolean;
}

const part = (ref: TrashRef, text: string): OwnerPart => ({ text, deleted: ref.deleted });

/** "Thuộc": customer and RE of an appointment or a policy, RE and team of a customer, a team. */
export function ownerParts(row: TrashRow): OwnerPart[] {
  const { customer, re, team } = row.owner;
  const parts: OwnerPart[] = [];
  if (customer) parts.push(part(customer, t('trash.owner.customer', { name: customer.name })));
  if (re) parts.push(part(re, t('trash.owner.re', { name: re.name })));
  // After an RE it is the RE's team (mockup 11a "RE Đỗ Khánh Linh · Sao Mai").
  if (team) parts.push(part(team, re ? team.name : t('trash.owner.team', { name: team.name })));
  return parts;
}

/**
 * The name of a row's restore button, every "Khôi phục…" alike on screen (DR6-43): the record as
 * the first line of "Bản ghi" names it, a policy with the status of its badge, so whatever tells two
 * rows apart there tells their buttons apart (DR6-99, DR6-119); then an appointment's or a policy's
 * customer.
 */
export function restoreLabel(row: TrashRow): string {
  const record =
    row.kind === 'policy' ? joinParts([recordTitle(row), policyStatusText(row)]) : recordTitle(row);
  const label = t(`trash.restoreLabel.${row.kind}`, { record });
  return row.kind === 'appointment' || row.kind === 'policy' ? ofCustomer(row, label) : label;
}

/**
 * "… của KH Name" after a label; a row with no customer, which the foreign key rules out, keeps the
 * label alone rather than end in "của KH".
 */
function ofCustomer(row: TrashRow, label: string): string {
  const customer = row.owner.customer;
  return customer ? t('trash.restoreLabel.ofCustomer', { label, name: customer.name }) : label;
}

export function deletedAtText(row: TrashRow): string {
  return formatLocalDateTime(new Date(row.deletedAt));
}

/**
 * Why the record cannot be restored, one line naming the record in the way (mockup 11d), from the
 * error its `restore…` command throws; the restore dialog (T-211) shows the same line when the
 * command refuses. A reason without a sentence of its own reads as the command's message.
 */
export function blockedReason(row: TrashRow, block: TrashBlock): string {
  return reasonSentence(row, block) ?? errorMessage(new DbError(block.code, block.params));
}

function reasonSentence(row: TrashRow, { code, params = {} }: TrashBlock): string | null {
  const { as, field, from, to } = params;
  if (code === 'PERSON_NOT_FOUND') {
    return as === 're' || as === 'coordinator' || as === 'reviewer'
      ? t(`trash.blocked.${as}`, params)
      : null;
  }
  if (code === 'DATE_IN_FUTURE') {
    return field === 'submitted' || field === 'issued' ? t(`trash.blocked.${field}`, params) : null;
  }
  if (code === 'INVALID_TRANSITION') {
    return typeof from === 'string' && typeof to === 'string'
      ? t('trash.blocked.INVALID_TRANSITION', {
          from: stage(from as CustomerStage),
          to: stage(to as CustomerStage),
        })
      : null;
  }
  if (code === 'TEAM_HAS_LEAD') {
    const team = row.owner.team;
    return team && 'name' in params
      ? t('trash.blocked.TEAM_HAS_LEAD', { ...params, team: team.name })
      : null;
  }
  // On the meeting's own day the change counts as later for being recorded after the deletion (E20),
  // which the command flags: the sentence never hangs on how the day is written.
  if (code === 'TRANSITION_BEFORE_LATEST' && params.sameDay === 1) {
    return t('trash.blocked.recordedAfter', params);
  }
  if (code === 'TRANSITION_BEFORE_LATEST' || code === 'OUTCOME_IN_FUTURE') {
    return 'date' in params ? t(`trash.blocked.${code}`, params) : null;
  }
  if (
    code === 'RE_REQUIRED' ||
    code === 'CUSTOMER_NOT_FOUND' ||
    code === 'INVALID_REVIEWER' ||
    code === 'INVALID_COORDINATOR' ||
    code === 'TEAM_NOT_FOUND' ||
    code === 'TEAM_NAME_TAKEN'
  ) {
    return 'name' in params ? t(`trash.blocked.${code}`, params) : null;
  }
  return null;
}

/** A line of the restore dialog: a term with its text, a stage badge, or both. */
export interface RestoreFact {
  readonly term: string;
  readonly text?: string;
  readonly stage?: CustomerStage;
}

/** The restore dialog of a record (TR-8): what it is, and what restoring it does. */
export interface RestoreView {
  readonly title: string;
  readonly subtitle: string;
  readonly facts: readonly RestoreFact[];
  /** The consequence, in the box under the facts; `title` in bold above it. */
  readonly effect: { readonly title?: string; readonly body: string };
}

const deletedSubtitle = (row: TrashRow) =>
  t('trash.restore.deleted', { label: t(`trash.kind.${row.kind}`), when: deletedAtText(row) });

const ownerLine = (row: TrashRow) => joinParts(ownerParts(row).map((owner) => owner.text));

/** Mockup 11b (a customer), 11c (a met appointment); the other kinds say what comes back. */
export function restoreView(row: TrashRow): RestoreView {
  switch (row.kind) {
    case 'customer':
      return {
        title: t('trash.restore.title', { name: row.name }),
        subtitle: deletedSubtitle(row),
        facts: [
          { term: t('trash.restore.stage'), stage: row.stage },
          {
            term: t('trash.restore.re'),
            text: joinParts([row.owner.re?.name, row.owner.team?.name]),
          },
          ...(row.effect.kind === 'customer'
            ? [{ term: t('trash.restore.with'), text: customerRecords(row.effect) }]
            : []),
        ],
        effect: { body: customerBack(row.effect) },
      };
    case 'appointment':
      return {
        title: t('trash.restore.titleAppointment', { when: appointmentWhen(row) }),
        subtitle: ownerLine(row),
        ...appointmentRestore(row),
      };
    case 'policy':
      return {
        title: t('trash.restore.titlePolicy', { date: formatDate(row.submittedDate) }),
        subtitle: ownerLine(row),
        facts: [
          { term: t('trash.restore.fyp'), text: formatVnd(row.submittedFyp) },
          {
            term: t('trash.restore.status'),
            text:
              row.issuedDate === null
                ? t('policyStatus.submitted')
                : t('trash.restore.issued', {
                    date: formatDate(row.issuedDate),
                    fyp: formatVnd(row.issuedFyp ?? 0),
                  }),
          },
        ],
        effect: { body: t('trash.restore.policyBody') },
      };
    case 'person':
      return {
        title: t('trash.restore.title', { name: row.name }),
        subtitle: deletedSubtitle(row),
        facts: [
          { term: t('trash.restore.role'), text: row.role },
          ...(row.owner.team ? [{ term: t('trash.restore.team'), text: row.owner.team.name }] : []),
        ],
        effect: { body: t('trash.restore.personBody') },
      };
    case 'team':
      return {
        title: t('trash.restore.title', { name: row.name }),
        subtitle: deletedSubtitle(row),
        facts: [],
        effect: { body: t('trash.restore.teamBody') },
      };
  }
}

type CustomerEffect = Extract<TrashRow['effect'], { kind: 'customer' }>;

/** "7 lịch hẹn (3 đã gặp · 1 lần tính RF) · 0 HĐ · 5 ghi chú KYC · 2 phân tích AI" (11b). */
function customerRecords(effect: CustomerEffect): string {
  return joinParts([
    t('trash.restore.appointments', {
      appointments: effect.appointments,
      met: effect.met,
      n: effect.rf,
    }),
    t('trash.records.policies', { count: effect.policies }),
    t('trash.records.kycNotes', { count: effect.kycNotes }),
    t('trash.records.aiAnalyses', { count: effect.aiAnalyses }),
  ]);
}

/** The records come back on their own days; those deleted on their own stay in the trash (TR-4). */
function customerBack(effect: TrashRow['effect']): string {
  const back = t('trash.restore.customerBack');
  if (effect.kind !== 'customer') return back;
  const left = joinParts([
    effect.appointmentsInTrash > 0 &&
      t('trash.records.appointments', { count: effect.appointmentsInTrash }),
    effect.policiesInTrash > 0 && t('trash.records.policies', { count: effect.policiesInTrash }),
  ]);
  return left === '' ? back : `${back} ${t('trash.restore.customerLeft', { parts: left })}`;
}

/**
 * A met appointment moves the stage again on its day (E5) or keeps it (E7); one that kept the stage
 * when deleted (E18, E19) and the others (E11) do not.
 */
function appointmentRestore(row: AppointmentRow): Pick<RestoreView, 'facts' | 'effect'> {
  const { effect } = row;
  if (effect.kind !== 'stageChange' && effect.kind !== 'stageKept') {
    return {
      facts: [
        row.status === 'MET'
          ? metResult(row)
          : { term: t('trash.restore.status'), text: t(`appointmentStatus.${row.status}`) },
      ],
      effect: { title: t('trash.restore.noChange'), body: t('trash.restore.noChangeBody') },
    };
  }
  const facts: RestoreFact[] = [
    metResult(row),
    {
      term: t('trash.restore.stageNow'),
      stage: effect.kind === 'stageChange' ? effect.from : effect.stage,
    },
  ];
  if (effect.kind === 'stageKept') {
    return {
      facts,
      effect: {
        title: t('trash.appointment.kept', { stage: stage(effect.stage) }),
        body: t('trash.restore.keptBody'),
      },
    };
  }
  const date = formatDate(effect.date);
  return {
    facts,
    effect: {
      title: t('trash.restore.change', { from: stage(effect.from), to: stage(effect.to), date }),
      body: effect.rf
        ? t('trash.restore.changeRf', { name: row.owner.re?.name ?? '', date })
        : t('trash.restore.changeNoRf'),
    },
  };
}

/** "Kết quả: Đã gặp · nhóm sau N2" of a met appointment. */
function metResult(row: AppointmentRow): RestoreFact {
  const met = t('appointmentStatus.MET');
  return row.stageAfter === null
    ? { term: t('trash.restore.result'), text: met }
    : {
        term: t('trash.restore.result'),
        text: joinParts([met, t('trash.restore.after')]),
        stage: row.stageAfter,
      };
}

/** The notice once a record is restored (mockup 11e), and where its "Mở" button leads. */
export interface RestoredNotice {
  readonly title: string;
  readonly detail: string | null;
  readonly open: string;
  readonly href: string;
}

export function restoredNotice(row: TrashRow): RestoredNotice {
  const profile = (id: string) => ({
    open: t('trash.restored.openProfile'),
    href: routeToHash({ screen: 'customer', id }),
  });
  const team = { open: t('trash.restored.openTeam'), href: routeToHash({ screen: 'team' }) };
  switch (row.kind) {
    case 'customer':
      return {
        title: t('trash.restored.customer', { name: row.name }),
        detail: row.effect.kind === 'customer' ? restoredWith(row.effect) : null,
        ...profile(row.id),
      };
    case 'appointment':
    case 'policy': {
      // Both always belong to a customer, alive once they could be restored.
      const customer = row.owner.customer!;
      return {
        title:
          row.kind === 'appointment'
            ? t('trash.restored.appointment', { when: appointmentWhen(row) })
            : t('trash.restored.policy', { date: formatDate(row.submittedDate) }),
        detail: t('trash.owner.customer', { name: customer.name }),
        ...profile(customer.id),
      };
    }
    case 'person':
      return { title: t('trash.restored.person', { name: row.name }), detail: null, ...team };
    case 'team':
      return { title: t('trash.restored.team', { name: row.name }), detail: null, ...team };
  }
}

/** "cùng 7 lịch hẹn, 5 ghi chú KYC": the records that came back, a kind with none left out. */
function restoredWith(effect: CustomerEffect): string | null {
  const parts = [
    effect.appointments > 0 && t('trash.records.appointments', { count: effect.appointments }),
    effect.policies > 0 && t('trash.records.policies', { count: effect.policies }),
    effect.kycNotes > 0 && t('trash.records.kycNotes', { count: effect.kycNotes }),
  ].filter((part) => part !== false);
  return parts.length === 0 ? null : t('trash.restored.with', { parts: parts.join(t('sep.list')) });
}

const RESTORE: Record<TrashRow['kind'], (db: Database, id: string) => void> = {
  team: restoreTeam,
  person: restorePerson,
  customer: restoreCustomer,
  appointment: restoreAppointment,
  policy: restorePolicy,
};

/**
 * Restores the record with the command of its kind, which checks again (the data may have changed
 * since the dialog opened) and is refused while the data is replaced (S2-2, E17). Null once done,
 * else the line the dialog shows: the sentence of the reason the row would now be blocked by.
 */
export function restoreRow(app: Pick<AppData, 'run'>, row: TrashRow): string | null {
  try {
    app.run((db) => RESTORE[row.kind](db, row.id));
    return null;
  } catch (error) {
    return error instanceof DbError ? blockedReason(row, error) : errorMessage(error);
  }
}

// ---- Dọn sạch Thùng rác (spec Phase 6 TR-11…TR-13; mockups 11h–11j) ----

/** From this many records the trash reminds to purge it: it opens slower as it grows (DR6-84). */
export const PURGE_REMINDER = 1_000;

/** Mockup 11h: the reminder under the intro (TR-13), or null below `PURGE_REMINDER` records. */
export function purgeReminder(count: number): string | null {
  return count >= PURGE_REMINDER ? t('trash.reminder', { count }) : null;
}

/** "Dọn sạch Thùng rác…" is on while some record would go, off once each one is kept (TR-11). */
export const canPurge = (rows: readonly TrashRow[]): boolean => rows.some((row) => !row.keptBy);

/** Why the purge keeps a record (TR-12): one line under it, as a blocked one says why it waits. */
export function keptReason(by: KeptBy): string {
  switch (by.kind) {
    case 'rescheduled':
      return t('trash.kept.rescheduled', { when: appointmentWhen(by) });
    case 'appointment':
      return t('trash.kept.appointment', { when: appointmentWhen(by) });
    case 'member':
      return t('trash.kept.member', { name: by.name });
  }
}

/** "12 lịch hẹn · 1 HĐ · 9 ghi chú KYC · 2 phân tích AI" of the purged customers. */
const customerRecordParts = (records: PurgeCounts['customerRecords']) => [
  {
    count: records.appointments,
    text: t('trash.records.appointments', { count: records.appointments }),
  },
  { count: records.policies, text: t('trash.records.policies', { count: records.policies }) },
  { count: records.kycNotes, text: t('trash.records.kycNotes', { count: records.kycNotes }) },
  { count: records.aiAnalyses, text: t('trash.records.aiAnalyses', { count: records.aiAnalyses }) },
];

/** The kinds a purge may keep, in the order of `PurgePlan.kept`. */
const KEPT_KINDS = ['appointment', 'person', 'team'] as const;

/**
 * The plan of the purge (mockup 11i) as `previewPurge` reads it, from the rows of the list instead:
 * they hold why each record is kept (TR-12) and what a customer goes with, so the dialog runs
 * `keptRecords` no second time for the rows it ran for (review of PR 710).
 */
export function purgePlan(rows: readonly TrashRow[]): PurgePlan {
  const going = rows.filter((row) => !row.keptBy);
  const count = (kind: TrashRow['kind']) => going.filter((row) => row.kind === kind).length;
  const customerRecords = { appointments: 0, policies: 0, kycNotes: 0, aiAnalyses: 0 };
  for (const { effect } of going) {
    if (effect.kind !== 'customer') continue;
    customerRecords.appointments += effect.appointments;
    customerRecords.policies += effect.policies;
    customerRecords.kycNotes += effect.kycNotes;
    customerRecords.aiAnalyses += effect.aiAnalyses;
  }
  const kept = KEPT_KINDS.flatMap((kind) =>
    rows.flatMap(({ kind: of, id, keptBy: by }) => (of === kind && by ? [{ kind, id, by }] : [])),
  );
  return {
    counts: {
      customers: count('customer'),
      customerRecords,
      appointments: count('appointment'),
      policies: count('policy'),
      people: count('person'),
      teams: count('team'),
    },
    kept,
  };
}

/** The purge dialog (mockup 11i): what goes for good, and what stays. */
export interface PurgeView {
  readonly subtitle: string;
  /** Kind by kind, a customer with its records not deleted on their own ("kèm …"). */
  readonly facts: readonly { readonly term: string; readonly text: string }[];
  /** "Giữ lại n bản ghi còn được dùng" (TR-12), null when nothing is kept. */
  readonly kept: string | null;
}

export function purgeView({ counts, kept }: PurgePlan): PurgeView {
  const { customers, appointments, policies, people, teams } = counts;
  const fact = (kind: TrashRow['kind'], text: string) => ({
    term: t(`trash.kind.${kind}`),
    text,
  });
  return {
    subtitle: t('trash.purge.subtitle', {
      count: customers + appointments + policies + people + teams + kept.length,
    }),
    facts: [
      fact(
        'customer',
        customers === 0
          ? formatCount(0)
          : t('trash.purge.customers', {
              count: customers,
              parts: joinParts(customerRecordParts(counts.customerRecords).map((p) => p.text)),
            }),
      ),
      fact('appointment', formatCount(appointments)),
      fact('policy', formatCount(policies)),
      fact('person', formatCount(people)),
      fact('team', formatCount(teams)),
    ],
    kept: kept.length === 0 ? null : t('trash.purge.kept', { count: kept.length }),
  };
}

/**
 * The line at the head of the card once the trash is purged (mockup 11j), sentence by sentence:
 * the screen places them side by side, as Nạp lại and Nhập backup place "Backup: …".
 */
export interface PurgedNotice {
  readonly title: string;
  /** "Xóa hẳn …": what went for good, a kind with none left out. */
  readonly deleted: string | null;
  /** "Giữ lại n bản ghi còn được dùng.", null when nothing was kept. */
  readonly kept: string | null;
  /** "Backup: …" of the exe, null in web mode. */
  readonly backup: string | null;
}

export function purgedNotice({ counts, kept, backup }: PurgedTrash): PurgedNotice {
  const records = customerRecordParts(counts.customerRecords).filter((part) => part.count > 0);
  const customers = (count: number) =>
    records.length === 0
      ? t('trash.records.customers', { count })
      : t('trash.purged.customersWith', {
          count,
          parts: joinParts(records.map((part) => part.text)),
        });
  const deleted = joinParts([
    counts.customers > 0 && customers(counts.customers),
    counts.appointments > 0 && t('trash.records.appointments', { count: counts.appointments }),
    counts.policies > 0 && t('trash.records.policies', { count: counts.policies }),
    counts.people > 0 && t('trash.records.people', { count: counts.people }),
    counts.teams > 0 && t('trash.records.teams', { count: counts.teams }),
  ]);
  return {
    title: t('trash.purged.title'),
    deleted: deleted === '' ? null : t('trash.purged.deleted', { parts: deleted }),
    kept: kept.length === 0 ? null : t('trash.purged.kept', { count: kept.length }),
    backup: backup ? t('settings.demo.doneBackup', { file: backup }) : null,
  };
}

/** A purge refused (mockup 11j; D7, D8, D9), at the place of the notice. */
export interface PurgeRefusal {
  readonly title: string;
  readonly detail: string;
}

/** Why the purge was refused, and that the data did not change. */
export function purgeFailure(error: unknown): PurgeRefusal {
  return {
    title: t(isUnsavedChangesError(error) ? 'trash.purge.failedUnsaved' : 'trash.purge.failed'),
    detail: t('trash.purge.unchanged'),
  };
}
