/**
 * Thùng rác (spec Phase 6 §4.2): every soft-deleted team, person, customer, appointment and policy,
 * newest deletion first, with what restoring it does and, when it cannot be restored, why. The
 * reason comes from the very check the `restore…` command runs (TR-1…TR-5), so the screen and the
 * command never disagree on the same data. Not filtered by the view (TR-7).
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
import { isNotNull } from 'drizzle-orm';
import { checkRestoreAppointment, outcomeStage } from './appointments';
import { selectRows } from './common';
import { countCustomerRecords, type CustomerRecordCounts } from './counts';
import { checkRestoreCustomer } from './customers';
import type { Database } from './database';
import { DbError, type DbErrorCode } from './errors';
import { checkRestorePolicy } from './policies';
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
  /** A met appointment records its stage change again, on the meeting day (TR-3). */
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
}

export type TrashRow =
  | (TrashBase & { readonly kind: 'team'; readonly name: string })
  | (TrashBase & { readonly kind: 'person'; readonly name: string; readonly role: PersonRole })
  | (TrashBase & {
      readonly kind: 'customer';
      readonly name: string;
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
  const ref = refs(db);
  const rows: TrashRow[] = [];
  for (const row of db.orm.select().from(teams).where(isNotNull(teams.deletedAt)).all()) {
    rows.push(
      entry(row, () => checkRestoreTeam(db, row), {
        kind: 'team',
        name: row.name,
        owner: {},
        effect: NONE,
      }),
    );
  }
  for (const row of db.orm.select().from(people).where(isNotNull(people.deletedAt)).all()) {
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
  for (const row of db.orm.select().from(customers).where(isNotNull(customers.deletedAt)).all()) {
    const re = ref.person(row.reId);
    const teamId = ref.teamOf(row.reId);
    rows.push(
      entry(row, () => checkRestoreCustomer(db, row), {
        kind: 'customer',
        name: row.name,
        stage: row.stage,
        owner: teamId === null ? { re } : { re, team: ref.team(teamId) },
        effect: customerEffect(db, row.id),
      }),
    );
  }
  for (const row of db.orm
    .select()
    .from(appointments)
    .where(isNotNull(appointments.deletedAt))
    .all()) {
    const stage = ref.stageOf(row.customerId);
    const to = outcomeStage(row, stage);
    rows.push(
      entry(row, () => checkRestoreAppointment(db, row), {
        kind: 'appointment',
        date: fromIsoDate(row.date),
        time: row.time,
        status: row.status,
        stageAfter: row.stageAfter,
        owner: { customer: ref.customer(row.customerId), re: ref.person(row.reId) },
        effect:
          row.status !== 'MET'
            ? NONE
            : to === null
              ? { kind: 'stageKept', stage }
              : {
                  kind: 'stageChange',
                  from: stage,
                  to,
                  date: fromIsoDate(row.date),
                  rf: isRfTransition(stage, to),
                },
      }),
    );
  }
  for (const row of db.orm.select().from(policies).where(isNotNull(policies.deletedAt)).all()) {
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
  return rows.sort((a, b) =>
    a.deletedAt === b.deletedAt ? (a.id < b.id ? 1 : -1) : a.deletedAt < b.deletedAt ? 1 : -1,
  );
}

/** A trash row without what `entry` adds, kind by kind. */
type Fields = TrashRow extends infer R
  ? R extends TrashRow
    ? Omit<R, 'id' | 'deletedAt' | 'blocked'>
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

/** Names of the teams, people and customers deleted records point to, read once. */
function refs(db: Database) {
  const teamRows = new Map(
    db.orm
      .select()
      .from(teams)
      .all()
      .map((t) => [t.id, t]),
  );
  const peopleRows = new Map(
    db.orm
      .select()
      .from(people)
      .all()
      .map((p) => [p.id, p]),
  );
  const customerRows = new Map(
    selectRows(db, 'SELECT id, name, stage, deleted_at FROM customers').map((c) => [
      c[0] as string,
      { name: c[1] as string, stage: c[2] as CustomerStage, deletedAt: c[3] as string | null },
    ]),
  );
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

/** The records a deleted customer brings back, and those deleted on their own (TR-4). */
function customerEffect(db: Database, customerId: string): TrashEffect {
  return { kind: 'customer', ...countCustomerRecords(db, customerId) };
}
