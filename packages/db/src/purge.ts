/**
 * Dọn sạch Thùng rác (spec Phase 6 TR-11, TR-12; ADR-0008 phụ lục): every record of the trash goes
 * for good, with what is only its own, in one transaction; then the file gives the room back. A
 * deleted record that what stays still points to is kept, with its own records, and says why.
 *
 * What may point to a deleted record, by the commands and the import rules (spec Phase 3 §6):
 * - a deleted customer: only its own records (rules 4–6, 14), which go with it: it never stays;
 * - a deleted appointment: the one rescheduled from it (rule 5, of the same customer), and its own
 *   coordinators and withdrawn transitions, which go with it;
 * - a deleted person: only deleted records (`PERSON_IN_USE`, rule 5), of which only an appointment
 *   kept above stays; a deleted team: only deleted people (`TEAM_HAS_MEMBERS`, rule 9);
 * - a deleted policy: nothing.
 * Should anything else point to one, the check of every reference refuses the purge, which then
 * changes nothing.
 */
import { fromIsoDate, type CalendarDate } from '@p2c/domain';
import type { SqlValue } from 'sql.js';
import { selectRows } from './common';
import type { Database } from './database';
import { PERSON_REFERENCES } from './person-references';

/** What keeps a deleted record from the purge (TR-12): the record still pointing to it. */
export type KeptBy =
  /** An appointment, live or kept, rescheduled from this one. */
  | { readonly kind: 'rescheduled'; readonly date: CalendarDate; readonly time: string | null }
  /** A kept appointment of this person: its RE or a coordinator. */
  | { readonly kind: 'appointment'; readonly date: CalendarDate; readonly time: string | null }
  /** A kept person of this team. */
  | { readonly kind: 'member'; readonly name: string };

export interface KeptRecord {
  readonly kind: 'appointment' | 'person' | 'team';
  readonly id: string;
  readonly by: KeptBy;
}

/** What the purge deletes for good, by kind (mockups 11i, 11j). */
export interface PurgeCounts {
  readonly customers: number;
  /** The records of those customers not deleted on their own ("kèm …"), as 11b counts them. */
  readonly customerRecords: {
    readonly appointments: number;
    readonly policies: number;
    readonly kycNotes: number;
    readonly aiAnalyses: number;
  };
  /** Deleted on their own, a purged customer's too. */
  readonly appointments: number;
  readonly policies: number;
  readonly people: number;
  readonly teams: number;
}

export interface PurgePlan {
  readonly counts: PurgeCounts;
  /** Appointments, then people, then teams. */
  readonly kept: readonly KeptRecord[];
}

/** The ids kept, as the named parameters of the statements below: one JSON array per kind. */
type KeptIds = Record<'$appointments' | '$people' | '$teams', string>;

const notKept = (param: keyof KeptIds) => `id NOT IN (SELECT value FROM json_each(${param}))`;

const OF_DELETED_CUSTOMER =
  'customer_id IN (SELECT id FROM customers WHERE deleted_at IS NOT NULL)';

/** The appointments the purge deletes: of a deleted customer, or deleted on their own. */
const GONE_APPOINTMENT = `(${OF_DELETED_CUSTOMER} OR (deleted_at IS NOT NULL AND ${notKept('$appointments')}))`;

/**
 * The appointments kept: deleted ones that a live appointment of a live customer, or a kept one, was
 * rescheduled from; each with that one. The `CROSS JOIN` has SQLite start from the deleted
 * appointments, through their own index, and look up what was booked from each: left to choose, it
 * reads every appointment booked from another (CL3-A29).
 */
const KEPT_APPOINTMENTS = `WITH RECURSIVE kept(id, by_id) AS (
    SELECT f.id, a.id FROM appointments f
    CROSS JOIN appointments a ON a.rescheduled_from_id = f.id
    JOIN customers c ON c.id = a.customer_id
    WHERE f.deleted_at IS NOT NULL AND a.deleted_at IS NULL AND c.deleted_at IS NULL
  UNION
    SELECT f.id, a.id FROM kept k
    JOIN appointments a ON a.id = k.id
    JOIN appointments f ON f.id = a.rescheduled_from_id
    WHERE f.deleted_at IS NOT NULL
  )
  SELECT k.id, b.date, b.time FROM kept k JOIN appointments b ON b.id = k.by_id ORDER BY k.id`;

/**
 * Deleted people any reference of the kept appointments `$appointments` points to, each with one of
 * those appointments, the earliest. A kept appointment is one that was rescheduled, which has no
 * reviewer (the CHECK `appointments_outcome_reviewer` gives one to a met appointment only): the RE
 * and the coordinators are what points to a person.
 */
const KEPT_PEOPLE = `SELECT p.id, a.date, a.time FROM people p
  JOIN (${PERSON_REFERENCES}) r ON r.person_id = p.id
  JOIN appointments a ON a.id = r.appointment_id
  WHERE p.deleted_at IS NOT NULL
    AND r.appointment_id IN (SELECT value FROM json_each($appointments))
  ORDER BY p.id, a.date, a.time, a.id`;

/** Deleted teams of the kept people `$people`, each with one of those, the first recorded. */
const KEPT_TEAMS = `SELECT t.id, p.name FROM teams t JOIN people p ON p.team_id = t.id
  WHERE t.deleted_at IS NOT NULL AND p.id IN (SELECT value FROM json_each($people))
  ORDER BY t.id, p.id`;

const COUNTS = `SELECT
  (SELECT COUNT(*) FROM customers WHERE deleted_at IS NOT NULL),
  (SELECT COUNT(*) FROM appointments WHERE deleted_at IS NULL AND ${OF_DELETED_CUSTOMER}),
  (SELECT COUNT(*) FROM policies WHERE deleted_at IS NULL AND ${OF_DELETED_CUSTOMER}),
  (SELECT COUNT(*) FROM kyc_notes WHERE ${OF_DELETED_CUSTOMER}),
  (SELECT COUNT(*) FROM ai_analyses WHERE ${OF_DELETED_CUSTOMER}),
  (SELECT COUNT(*) FROM appointments WHERE deleted_at IS NOT NULL AND ${notKept('$appointments')}),
  (SELECT COUNT(*) FROM policies WHERE deleted_at IS NOT NULL),
  (SELECT COUNT(*) FROM people WHERE deleted_at IS NOT NULL AND ${notKept('$people')}),
  (SELECT COUNT(*) FROM teams WHERE deleted_at IS NOT NULL AND ${notKept('$teams')})`;

/**
 * Children before the rows they point to. A transition goes only once withdrawn: a live one never
 * points to a deleted appointment (D7, rule 4), and if one did, the check of `purgeTrash` refuses.
 */
const PURGE = [
  `DELETE FROM ai_analyses WHERE ${OF_DELETED_CUSTOMER}`,
  `DELETE FROM kyc_facts WHERE ${OF_DELETED_CUSTOMER}`,
  `DELETE FROM kyc_notes WHERE ${OF_DELETED_CUSTOMER}`,
  `DELETE FROM kyc_versions WHERE ${OF_DELETED_CUSTOMER}`,
  `DELETE FROM stage_transitions WHERE ${OF_DELETED_CUSTOMER}
    OR (deleted_at IS NOT NULL AND appointment_id IN (SELECT id FROM appointments WHERE ${GONE_APPOINTMENT}))`,
  `DELETE FROM appointment_coordinators
    WHERE appointment_id IN (SELECT id FROM appointments WHERE ${GONE_APPOINTMENT})`,
  `DELETE FROM appointments WHERE ${GONE_APPOINTMENT}`,
  `DELETE FROM policies WHERE deleted_at IS NOT NULL OR ${OF_DELETED_CUSTOMER}`,
  'DELETE FROM customers WHERE deleted_at IS NOT NULL',
  `DELETE FROM people WHERE deleted_at IS NOT NULL AND ${notKept('$people')}`,
  `DELETE FROM teams WHERE deleted_at IS NOT NULL AND ${notKept('$teams')}`,
];

/** Mockup 11i: what `purgeTrash` would delete and keep now. */
export function previewPurge(db: Database): PurgePlan {
  const kept = keptRecords(db);
  return { counts: countsOf(db, keptIds(kept)), kept };
}

/**
 * Deletes the trash for good (TR-11) but what `previewPurge` keeps, and says what it deleted and
 * kept; a refused delete throws and changes nothing. Then VACUUM gives the file the room of the
 * purged rows back, and none of them stays in it (question 3 of #662). It runs outside the
 * transaction, as SQLite asks; the purge is done by then, so if it fails, the file only keeps its
 * size until the next purge.
 *
 * With foreign keys on, each deleted row looks for rows pointing to it, even through a column
 * without an index (`kyc_facts.note_id`; `rescheduled_from_id` until 0012): 3.5 s for the 1 313
 * trash rows of the load data, 0.1 s without. So, as `migrate()` does, they are off while it
 * deletes, and every reference is checked once before COMMIT instead.
 */
export function purgeTrash(db: Database): PurgePlan {
  db.sqlite.run('PRAGMA foreign_keys = OFF');
  let purged: PurgePlan;
  try {
    purged = db.transaction(() => {
      const plan = previewPurge(db);
      const ids = keptIds(plan.kept);
      for (const statement of PURGE) db.sqlite.run(statement, ids);
      if (selectRows(db, 'PRAGMA foreign_key_check').length > 0) {
        throw new Error('Purging the trash would leave references pointing nowhere');
      }
      return plan;
    });
  } finally {
    db.sqlite.run('PRAGMA foreign_keys = ON');
  }
  try {
    db.sqlite.run('VACUUM');
  } catch {
    return purged;
  }
  // The transaction saved the file before VACUUM; one more, empty, saves it as it is now (an empty
  // transaction persists, see `Database.transaction`).
  db.transaction(() => undefined);
  return purged;
}

/**
 * The deleted records the purge keeps (TR-12), with what points to each: the rows a foreign key
 * would not let go once the rest is gone. `listTrash` gives each row its reason from here.
 */
export function keptRecords(db: Database): KeptRecord[] {
  // Everything kept follows from a deleted appointment that something was booked from, so with no
  // deleted appointment there is nothing to look for; `listTrash` asks even when the trash is empty.
  if (
    selectRows(db, 'SELECT 1 FROM appointments WHERE deleted_at IS NOT NULL LIMIT 1').length === 0
  ) {
    return [];
  }
  const appointments = selectRows(db, KEPT_APPOINTMENTS).map(([id, date, time]): KeptRecord => ({
    kind: 'appointment',
    id: String(id),
    by: { kind: 'rescheduled', date: fromIsoDate(String(date)), time: time as string | null },
  }));
  const people = firstOfEach(
    selectRows(db, KEPT_PEOPLE, { $appointments: idsOf(appointments) }),
  ).map(([id, date, time]): KeptRecord => ({
    kind: 'person',
    id: String(id),
    by: { kind: 'appointment', date: fromIsoDate(String(date)), time: time as string | null },
  }));
  const teams = firstOfEach(selectRows(db, KEPT_TEAMS, { $people: idsOf(people) })).map(
    ([id, name]): KeptRecord => ({
      kind: 'team',
      id: String(id),
      by: { kind: 'member', name: String(name) },
    }),
  );
  return [...appointments, ...people, ...teams];
}

/** The first row of each id (rows ordered by id). */
const firstOfEach = (rows: SqlValue[][]): SqlValue[][] =>
  rows.filter((row, i) => row[0] !== rows[i - 1]?.[0]);

const idsOf = (records: readonly KeptRecord[]) => JSON.stringify(records.map((r) => r.id));

function keptIds(kept: readonly KeptRecord[]): KeptIds {
  const of = (kind: KeptRecord['kind']) => idsOf(kept.filter((record) => record.kind === kind));
  return { $appointments: of('appointment'), $people: of('person'), $teams: of('team') };
}

function countsOf(db: Database, kept: KeptIds): PurgeCounts {
  const [customers, appointments, policies, kycNotes, aiAnalyses, own, ownPolicies, people, teams] =
    selectRows(db, COUNTS, kept)[0]!.map(Number);
  return {
    customers: customers!,
    customerRecords: {
      appointments: appointments!,
      policies: policies!,
      kycNotes: kycNotes!,
      aiAnalyses: aiAnalyses!,
    },
    appointments: own!,
    policies: ownPolicies!,
    people: people!,
    teams: teams!,
  };
}
