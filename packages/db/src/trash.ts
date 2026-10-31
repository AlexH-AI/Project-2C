/**
 * Thùng rác (spec Phase 6 §4.2): every soft-deleted team, person, customer, appointment and policy,
 * newest deletion first, with what restoring it does and, when it cannot be restored, why. The
 * reason comes from the very check the `restore…` command runs (TR-1…TR-5), so the screen and the
 * command never disagree on the same data; why the purge keeps a record comes from the purge's own
 * `keptRecords` (TR-12). Not filtered by the view (TR-7).
 */
import {
  fromIsoDate,
  isRfTransition,
  type Appointment,
  type CalendarDate,
  type CustomerStage,
  type PersonRole,
  type Vnd,
} from '@p2c/domain';
import { isNotNull, sql } from 'drizzle-orm';
import { checkRestoreAppointment, restoreStageMove } from './appointments';
import { countCustomerRecords, type CustomerRecordCounts } from './counts';
import { checkRestoreCustomer } from './customers';
import type { Database } from './database';
import { DbError, type DbErrorCode } from './errors';
import { checkRestorePolicy } from './policies';
import { keptRecords, type KeptBy } from './purge';
import { appointments, customers, people, policies, teams } from './schema';
import { checkRestorePerson, checkRestoreTeam } from './team';

/** A record a deleted one belongs to, flagged when it is deleted too ("(đã xóa)"). */
export interface TrashRef {
  readonly id: string;
  readonly name: string;
  readonly deleted: boolean;
}

/** The "Thuộc" column: customer and RE of an appointment or policy, RE and team of a customer. */
export interface TrashOwner {
  readonly customer?: TrashRef;
  readonly re?: TrashRef;
  readonly team?: TrashRef;
}

/** What restoring does (TR-8). */
export type TrashEffect =
  | { readonly kind: 'none' }
  /** A customer comes back with the records not deleted on their own (TR-4). */
  | ({ readonly kind: 'customer' } & CustomerRecordCounts)
  /** A met appointment records the stage change its deletion withdrew again, on its day (TR-3). */
  | {
      readonly kind: 'stageChange';
      readonly from: CustomerStage;
      readonly to: CustomerStage;
      readonly date: CalendarDate;
      readonly rf: boolean;
    }
  /** A met appointment whose customer is already in its stage after: no change, no RF (E7). */
  | { readonly kind: 'stageKept'; readonly stage: CustomerStage };

/** Why the record cannot be restored: the error its `restore…` command throws now. */
export interface TrashBlock {
  readonly code: DbErrorCode;
  readonly params?: Readonly<Record<string, string | number>>;
}

interface TrashBase {
  readonly id: string;
  /** ISO instant of the deletion. */
  readonly deletedAt: string;
  readonly owner: TrashOwner;
  readonly effect: TrashEffect;
  readonly blocked?: TrashBlock;
  /** Why "Dọn sạch Thùng rác" keeps it (TR-12), shown before the purge too. */
  readonly keptBy?: KeptBy;
}

export type TrashRow =
  | (TrashBase & { readonly kind: 'team'; readonly name: string })
  | (TrashBase & { readonly kind: 'person'; readonly name: string; readonly role: PersonRole })
  | (TrashBase & {
      readonly kind: 'customer';
      readonly name: string;
      /** The customer's code, which tells apart two of one name (DR6-151). */
      readonly code: string;
      readonly stage: CustomerStage;
    })
  | (TrashBase & {
      readonly kind: 'appointment';
      readonly date: CalendarDate;
      readonly time: string | null;
      readonly status: Appointment['status'];
      readonly stageAfter: CustomerStage | null;
    })
  | (TrashBase & {
      readonly kind: 'policy';
      readonly submittedDate: CalendarDate;
      readonly submittedFyp: Vnd;
      readonly issuedDate: CalendarDate | null;
      readonly issuedFyp: Vnd | null;
    });

const NONE: TrashEffect = { kind: 'none' };

export function listTrash(db: Database): TrashRow[] {
  const deleted = deletedRows(db);
  const ref = refs(db, deleted);
  const rows: TrashRow[] = [];
  for (const row of deleted.teams) {
    rows.push(
      entry(row, () => checkRestoreTeam(db, row), {
        kind: 'team',
        name: row.name,
        owner: {},
        effect: NONE,
      }),
    );
  }
  for (const row of deleted.people) {
    rows.push(
      entry(row, () => checkRestorePerson(db, row), {
        kind: 'person',
        name: row.name,
        role: row.role,
        owner: row.teamId === null ? {} : { team: ref.team(row.teamId) },
        effect: NONE,
      }),
    );
  }
  for (const row of deleted.customers) {
    const re = ref.person(row.reId);
    const teamId = ref.teamOf(row.reId);
    rows.push(
      entry(row, () => checkRestoreCustomer(db, row), {
        kind: 'customer',
        name: row.name,
        code: row.code,
        stage: row.stage,
        owner: teamId === null ? { re } : { re, team: ref.team(teamId) },
        effect: customerEffect(db, row.id),
      }),
    );
  }
  for (const row of deleted.appointments) {
    const stage = ref.stageOf(row.customerId);
    const move = restoreStageMove(db, row, stage);
    rows.push(
      entry(row, () => checkRestoreAppointment(db, row), {
        kind: 'appointment',
        date: fromIsoDate(row.date),
        time: row.time,
        status: row.status,
        stageAfter: row.stageAfter,
        owner: { customer: ref.customer(row.customerId), re: ref.person(row.reId) },
        effect:
          move === null
            ? NONE
            : move.to === null
              ? { kind: 'stageKept', stage }
              : {
                  kind: 'stageChange',
                  from: stage,
                  to: move.to,
                  date: fromIsoDate(row.date),
                  rf: isRfTransition(stage, move.to),
                },
      }),
    );
  }
  for (const row of deleted.policies) {
    rows.push(
      entry(row, () => checkRestorePolicy(db, row), {
        kind: 'policy',
        submittedDate: fromIsoDate(row.submittedDate),
        submittedFyp: row.submittedFyp,
        issuedDate: row.issuedDate === null ? null : fromIsoDate(row.issuedDate),
        issuedFyp: row.issuedFyp,
        owner: { customer: ref.customer(row.customerId), re: ref.person(row.reId) },
        effect: NONE,
      }),
    );
  }
  const kept = new Map(keptRecords(db).map((record) => [`${record.kind}:${record.id}`, record.by]));
  // Newest deletion first: stamps sort as text in the order of time, as the app writes them all
  // alike and the import takes no other form (spec §6, DR6-105).
  return rows
    .map((row) => {
      const keptBy = kept.get(`${row.kind}:${row.id}`);
      return keptBy ? { ...row, keptBy } : row;
    })
    .sort((a, b) =>
      a.deletedAt === b.deletedAt ? (a.id < b.id ? 1 : -1) : a.deletedAt < b.deletedAt ? 1 : -1,
    );
}

/** A trash row without what `entry` and `listTrash` add, kind by kind. */
type Fields = TrashRow extends infer R
  ? R extends TrashRow
    ? Omit<R, 'id' | 'deletedAt' | 'blocked' | 'keptBy'>
    : never
  : never;

/** The row of a deleted record, `blocked` by what `check` throws. */
function entry(
  row: { readonly id: string; readonly deletedAt: string | null },
  check: () => void,
  fields: Fields,
): TrashRow {
  const blocked = blockOf(check);
  return {
    id: row.id,
    deletedAt: row.deletedAt!,
    ...fields,
    ...(blocked && { blocked }),
  } as TrashRow;
}

function blockOf(check: () => void): TrashBlock | undefined {
  try {
    check();
    return undefined;
  } catch (error) {
    if (!(error instanceof DbError)) throw error;
    return error.params ? { code: error.code, params: error.params } : { code: error.code };
  }
}

/** The deleted rows of each table Thùng rác lists. */
function deletedRows(db: Database) {
  return {
    teams: db.orm.select().from(teams).where(isNotNull(teams.deletedAt)).all(),
    people: db.orm.select().from(people).where(isNotNull(people.deletedAt)).all(),
    customers: db.orm.select().from(customers).where(isNotNull(customers.deletedAt)).all(),
    appointments: db.orm.select().from(appointments).where(isNotNull(appointments.deletedAt)).all(),
    policies: db.orm.select().from(policies).where(isNotNull(policies.deletedAt)).all(),
  };
}

/**
 * The teams, people and customers the deleted records point to, and only those, each read once
 * (#539): the REs read first give the teams of the deleted customers.
 */
function refs(db: Database, deleted: ReturnType<typeof deletedRows>) {
  const records = [...deleted.appointments, ...deleted.policies];
  const customerRows = rowsById(
    db,
    customers,
    records.map((row) => row.customerId),
  );
  const peopleRows = rowsById(
    db,
    people,
    [...deleted.customers, ...records].map((row) => row.reId),
  );
  const teamRows = rowsById(db, teams, [
    ...deleted.people.map((person) => person.teamId),
    ...deleted.customers.map((customer) => peopleRows.get(customer.reId)!.teamId),
  ]);
  const toRef = (id: string, row: { name: string; deletedAt: string | null }): TrashRef => ({
    id,
    name: row.name,
    deleted: row.deletedAt !== null,
  });
  // Foreign keys hold every id below, so each row exists.
  return {
    team: (id: string) => toRef(id, teamRows.get(id)!),
    person: (id: string) => toRef(id, peopleRows.get(id)!),
    teamOf: (personId: string) => peopleRows.get(personId)!.teamId,
    customer: (id: string) => toRef(id, customerRows.get(id)!),
    stageOf: (customerId: string) => customerRows.get(customerId)!.stage,
  };
}

/** The rows of `table` whose id is among `ids`, by id, in one read; none when no id is given. */
function rowsById<T extends typeof teams | typeof people | typeof customers>(
  db: Database,
  table: T,
  ids: readonly (string | null)[],
): Map<string, T['$inferSelect']> {
  const wanted = [...new Set(ids.filter((id): id is string => id !== null))];
  if (wanted.length === 0) return new Map();
  const rows = db.orm
    .select()
    .from(table)
    .where(sql`${table.id} IN (SELECT value FROM json_each(${JSON.stringify(wanted)}))`)
    .all() as T['$inferSelect'][];
  return new Map(rows.map((row) => [row.id, row]));
}

/** The records a deleted customer brings back, and those deleted on their own (TR-4). */
function customerEffect(db: Database, customerId: string): TrashEffect {
  return { kind: 'customer', ...countCustomerRecords(db, customerId) };
}
