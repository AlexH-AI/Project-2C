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
  formatNumber,
  formatDate,
  formatLocalDateTime,
  searchText,
  type CalendarDate,
  type CustomerStage,
} from '@p2c/domain';
import type { DataTableMoreLabels } from '@p2c/ui';
import { isUnsavedChangesError, type AppData, type PurgedTrash } from '../data/app-data';
import { errorMessage, joinParts, t } from '../i18n';
import { routeToHash } from '../shell/routes';
import { statusLabel } from './appointments/appointments-view';
import { policyStatusText } from './customers/policy-form';
import { formatAmount } from './money-view';

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
  const needle = searchText(query);
  return rows.filter(
    (row) =>
      (filter === 'all' || row.kind === filter) &&
      (needle === '' || searchText(searchedName(row)).includes(needle)),
  );
}

const stage = (value: CustomerStage) => t(`stage.${value}`);

/**
 * The first line of "Bản ghi" (spec Phase 6 §4.2); a customer's stage and a policy's status are
 * badges. An appointment's status as every other screen writes it (`statusLabel`): a planned one
 * before `today` has no outcome recorded yet (NT-TR-07).
 */
export function recordTitle(row: TrashRow, today: CalendarDate): string {
  switch (row.kind) {
    case 'appointment':
      return joinParts([appointmentWhen(row), statusLabel(row, today).text]);
    case 'policy':
      return t('trash.policy.title', {
        date: formatDate(row.submittedDate),
        fyp: formatAmount(row.submittedFyp),
      });
    default:
      return row.name;
  }
}

/**
 * The badge of the first line of "Bản ghi": a customer's stage, a policy's status as the policy's
 * badges word it; none for the other kinds, an appointment's status being in that line. The cell
 * draws it and `restoreLabel` reads its words, so a badge added here names the button too (review
 * of PR 846); the button says more only of a person and of two customers alike (DR6-151).
 */
export function recordBadge(
  row: TrashRow,
):
  | { readonly text: string; readonly stage: CustomerStage }
  | { readonly text: string; readonly issued: boolean }
  | null {
  switch (row.kind) {
    case 'customer':
      return { text: stage(row.stage), stage: row.stage };
    case 'policy':
      return { text: policyStatusText(row), issued: row.issuedDate !== null };
    default:
      return null;
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
  /** Deleted too: "(đã xóa)" follows it (`goneText`). */
  readonly deleted: boolean;
  /** When a deleted team a namesake is in the trash with was deleted (`trashNames`). */
  readonly deletedAt?: string;
}

const part = (ref: TrashRef, text: string): OwnerPart => ({ text, deleted: ref.deleted });

/**
 * "Thuộc": customer and RM of an appointment or a policy, RM and team of a customer, a team. A team
 * `names` tells apart by its deletion with when that was, its text still the name the column sorts
 * and filters by.
 */
export function ownerParts(row: TrashRow, names?: TrashNames): OwnerPart[] {
  const { customer, rm, team } = row.owner;
  const parts: OwnerPart[] = [];
  if (customer) parts.push(part(customer, t('trash.owner.customer', { name: customer.name })));
  if (rm) parts.push(part(rm, t('trash.owner.rm', { name: rm.name })));
  if (team) {
    // After an RM it is the RM's team (mockup 11a "RM Đỗ Khánh Linh · Sao Mai").
    const named = part(team, rm ? team.name : t('trash.owner.team', { name: team.name }));
    const deletedAt = teamDeletedAt(team, names);
    parts.push(deletedAt === undefined ? named : { ...named, deletedAt });
  }
  return parts;
}

/**
 * What follows a deleted part: "(đã xóa)", or "(đã xóa lúc …)" for a team a namesake is in the trash
 * with (review of PR 1088).
 */
export const goneText = (part: OwnerPart): string =>
  part.deletedAt === undefined ? t('trash.gone') : t('trash.goneAt', { when: part.deletedAt });

type CustomerRow = Extract<TrashRow, { kind: 'customer' }>;
type PersonRow = Extract<TrashRow, { kind: 'person' }>;
type TeamRow = Extract<TrashRow, { kind: 'team' }>;
type RecordRow = Extract<TrashRow, { kind: 'appointment' | 'policy' }>;

/** A row among the rows of every kind: ids are only unique within a table. */
const rowKey = (row: Pick<TrashRow, 'kind' | 'id'>) => `${row.kind}:${row.id}`;

/** The rows of `rows` that another one has the `key` of. */
function alike<R>(rows: readonly R[], key: (row: R) => string): R[] {
  const count = new Map<string, number>();
  for (const row of rows) count.set(key(row), (count.get(key(row)) ?? 0) + 1);
  return rows.filter((row) => count.get(key(row))! > 1);
}

/**
 * What tells a row apart from one alike in all the rest (`trashNames`): `code`, the customer's code;
 * `when`, when the row was deleted, as the column "Xóa lúc" shows it, to the second for rows that
 * column shows alike too.
 */
export interface Told {
  readonly code?: true;
  readonly when?: string;
}

/**
 * The rows of `rows` alike by `key`, by `rowKey`, each told apart by when it was deleted: to the
 * minute, or to the second among those deleted in the same minute (review of PR 1072).
 */
function byDeletion<R extends TrashRow>(rows: readonly R[], key: (row: R) => string) {
  const same = alike(rows, key);
  const sameMinute = new Set(alike(same, (row) => JSON.stringify([key(row), deletedAtText(row)])));
  return same.map(
    (row) => [rowKey(row), { when: deletedAtText(row, { seconds: sameMinute.has(row) }) }] as const,
  );
}

/**
 * The one place the trash names its rows from (CLR6-G1): what tells a row apart from a namesake,
 * all the rest being alike (`Told`), by `rowKey`, of every row whatever the filter. The restore
 * button of the row says it (`restoreLabel`); a team's deletion, also the line of a row the team
 * keeps blocked (`blockedReason`, review of PR 1088) and "Thuộc" (`ownerParts`).
 */
export type TrashNames = ReadonlyMap<string, Told>;

/**
 * `TrashNames` of the trash. Q3 (a), Owner 31/10/2026 (DR6-151): the code of a customer another one
 * has the name and the stage of. Q1 (a), Owner 05/11/2026 (DR6-160): the customer's code of an
 * appointment or a policy whose customer has the name of another customer of the trash, deleted or
 * the customer of another record; when a person another one has the name, the role and the team of
 * was deleted, and when a team another one has the name of was (`teams_active_name` only keeps the
 * names of the teams in use apart; review of PR 1072).
 */
export function trashNames(rows: readonly TrashRow[]): TrashNames {
  const customers = rows.filter((row): row is CustomerRow => row.kind === 'customer');
  const people = rows.filter((row): row is PersonRow => row.kind === 'person');
  const teams = rows.filter((row): row is TeamRow => row.kind === 'team');
  const records = rows.filter(
    (row): row is RecordRow => row.kind === 'appointment' || row.kind === 'policy',
  );
  // Each customer of the trash once, by id: a deleted one, the customer of a record.
  const named = new Map(customers.map((row) => [row.id, row.name]));
  for (const { owner } of records)
    if (owner.customer) named.set(owner.customer.id, owner.customer.name);
  const namesakes = new Set(alike([...named], ([, name]) => name).map(([id]) => id));
  const coded = [
    ...alike(customers, (row) => `${row.stage}|${row.name}`),
    ...records.filter((row) => row.owner.customer && namesakes.has(row.owner.customer.id)),
  ];
  return new Map<string, Told>([
    ...coded.map((row) => [rowKey(row), { code: true }] as const),
    ...byDeletion(people, (row) =>
      JSON.stringify([row.name, row.role, row.owner.team?.name ?? null]),
    ),
    ...byDeletion(teams, (row) => row.name),
  ]);
}

/** When a deleted team `names` tells apart by its deletion was deleted, as its button says it. */
const teamDeletedAt = (team: TrashRef, names: TrashNames | undefined) =>
  names?.get(rowKey({ kind: 'team', id: team.id }))?.when;

/**
 * The name of a row's restore button, every "Khôi phục…" alike on screen (DR6-43): the record as
 * the first line of "Bản ghi" names it, with the words of its badge there (`recordBadge`), so
 * whatever tells two rows apart there tells their buttons apart (DR6-99, DR6-119); then an
 * appointment's or a policy's customer. Q3 (a), Owner 31/10/2026 (DR6-151): a person with their
 * role and team, the second line and "Thuộc"; a customer `names` tells by `code` with their code,
 * as mockup 9b names two of one name, since two such rows differ only past the first line. Q1 (a),
 * Owner 05/11/2026 (DR6-160): the customer of a record told by `code` with their code too, a person
 * or a team told by `when` they were deleted with that, as the column "Xóa lúc" tells them apart, to
 * the second where that column shows the same minute (review of PR 1072).
 */
export function restoreLabel(row: TrashRow, names: TrashNames, today: CalendarDate): string {
  const told = names.get(rowKey(row));
  const coded = told?.code === true;
  const title =
    row.kind === 'customer' && coded
      ? t('customer.withCode', { name: row.name, code: row.code })
      : recordTitle(row, today);
  const person = row.kind === 'person' ? [recordDetail(row), row.owner.team?.name] : [];
  const when = told?.when;
  const deleted = when !== undefined && t('trash.restoreLabel.deletedAt', { when });
  const record = joinParts([title, recordBadge(row)?.text, ...person, deleted]);
  const label = t(`trash.restoreLabel.${row.kind}`, { record });
  return row.kind === 'appointment' || row.kind === 'policy'
    ? ofCustomer(row, label, coded)
    : label;
}

/**
 * "… của KH Name" after a label, with the customer's code when `coded` (DR6-160); a row with no
 * customer, which the foreign key rules out, keeps the label alone rather than end in "của KH".
 */
function ofCustomer(row: RecordRow, label: string, coded: boolean): string {
  const customer = row.owner.customer;
  if (!customer) return label;
  const name = coded
    ? t('customer.withCode', { name: customer.name, code: customer.code })
    : customer.name;
  return t('trash.restoreLabel.ofCustomer', { label, name });
}

/** "Xóa lúc": when the row was deleted, in local time, to the minute; to the second with `seconds`. */
export function deletedAtText(row: TrashRow, options: { seconds?: boolean } = {}): string {
  return formatLocalDateTime(new Date(row.deletedAt), options);
}

/**
 * Why the record cannot be restored, one line naming the record in the way (mockup 11d), from the
 * error its `restore…` command throws; the restore dialog (T-211) shows the same line when the
 * command refuses. A reason without a sentence of its own reads as the command's message. A deleted
 * team in the way that `names` tells apart by its deletion with when that was, as its restore button
 * says it (review of PR 1088).
 */
export function blockedReason(row: TrashRow, block: TrashBlock, names?: TrashNames): string {
  return reasonSentence(row, block, names) ?? errorMessage(new DbError(block.code, block.params));
}

function reasonSentence(
  row: TrashRow,
  { code, params = {} }: TrashBlock,
  names: TrashNames | undefined,
): string | null {
  const { as, field, from, to } = params;
  // The team of the row is the one its restore is refused for (`restorePerson`).
  const when = code === 'TEAM_NOT_FOUND' && row.owner.team && teamDeletedAt(row.owner.team, names);
  if (when && 'name' in params) return t('trash.blocked.teamDeletedAt', { ...params, when });
  if (code === 'PERSON_NOT_FOUND') {
    return as === 'rm' || as === 'coordinator' || as === 'reviewer'
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
    code === 'RM_REQUIRED' ||
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
export function restoreView(row: TrashRow, today: CalendarDate): RestoreView {
  switch (row.kind) {
    case 'customer':
      return {
        title: t('trash.restore.title', { name: row.name }),
        subtitle: deletedSubtitle(row),
        facts: [
          { term: t('trash.restore.stage'), stage: row.stage },
          {
            term: t('trash.restore.rm'),
            text: joinParts([row.owner.rm?.name, row.owner.team?.name]),
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
        ...appointmentRestore(row, today),
      };
    case 'policy':
      return {
        title: t('trash.restore.titlePolicy', { date: formatDate(row.submittedDate) }),
        subtitle: ownerLine(row),
        facts: [
          { term: t('trash.restore.fyp'), text: formatAmount(row.submittedFyp) },
          {
            // The status in the words of its badge (`policyStatusText`), an issue with its day and FYP.
            term: t('trash.restore.status'),
            text:
              row.issuedDate === null
                ? policyStatusText(row)
                : t('trash.restore.issued', {
                    status: policyStatusText(row),
                    date: formatDate(row.issuedDate),
                    fyp: formatAmount(row.issuedFyp ?? 0),
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
 * when deleted (E18, E19) and the others (E11) do not. Their status reads as in "Bản ghi".
 */
function appointmentRestore(
  row: AppointmentRow,
  today: CalendarDate,
): Pick<RestoreView, 'facts' | 'effect'> {
  const { effect } = row;
  if (effect.kind !== 'stageChange' && effect.kind !== 'stageKept') {
    return {
      facts: [
        row.status === 'MET'
          ? metResult(row)
          : { term: t('trash.restore.status'), text: statusLabel(row, today).text },
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
        ? t('trash.restore.changeRf', { name: row.owner.rm?.name ?? '', date })
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
const PURGE_REMINDER = 1_000;

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
 * The plan of the purge (mockup 11i), read from the rows of the list rather than by `previewPurge`:
 * they hold why each record is kept (TR-12) and what a customer goes with, so the dialog runs
 * `keptRecords` no second time for the rows it ran for (review of PR 710). The counts are the
 * command's; `kept` is in the order of the list, latest deleted first, not by id (review of PR 833).
 */
export function purgePlan(rows: readonly TrashRow[]): PurgePlan {
  const going = rows.filter((row) => !row.keptBy);
  const count = trashCounts(going);
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
      customers: count.customer,
      customerRecords,
      appointments: count.appointment,
      policies: count.policy,
      people: count.person,
      teams: count.team,
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
          ? formatNumber(0)
          : t('trash.purge.customers', {
              count: customers,
              parts: joinParts(customerRecordParts(counts.customerRecords).map((p) => p.text)),
            }),
      ),
      fact('appointment', formatNumber(appointments)),
      fact('policy', formatNumber(policies)),
      fact('person', formatNumber(people)),
      fact('team', formatNumber(teams)),
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
