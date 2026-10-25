/**
 * Commands and reads for teams and people (spec §3.1–3.2, §4). Every command runs in one
 * transaction; a rejected command throws `DbError` and leaves the database untouched.
 */
import {
  byName,
  PERSON_ROLES,
  REVIEWER_ROLES,
  ROLES_WITH_TEAM,
  type Person,
  type PersonRole,
  type Team,
} from '@p2c/domain';
import { and, asc, eq, isNotNull, isNull, ne } from 'drizzle-orm';
import {
  liveRow,
  requireChoice,
  requireName,
  requireRow,
  selectRows,
  stampDeleted,
  updateRow,
} from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import {
  PERSON_REFERENCE_KINDS,
  PERSON_REFERENCES,
  POINTS_TO,
  type PersonReferenceKind,
} from './person-references';
import { people, teams } from './schema';

type TeamRow = typeof teams.$inferSelect;
type PersonRow = typeof people.$inferSelect;

// ---- reads ----------------------------------------------------------------

// The lists are by id: SQLite orders names byte by byte ("Đ…" after "Z"), so the screens order
// them with `byName` of domain (DR-48).

export function listTeams(db: Database): Team[] {
  return db.orm
    .select()
    .from(teams)
    .where(isNull(teams.deletedAt))
    .orderBy(asc(teams.id))
    .all()
    .map(toTeam);
}

export function listPeople(db: Database): Person[] {
  return db.orm
    .select()
    .from(people)
    .where(isNull(people.deletedAt))
    .orderBy(asc(people.id))
    .all()
    .map(toPerson);
}

/**
 * The live records that point to a person and keep them from deletion (spec §4, D9; mockup 9b).
 * Appointments and policies of a deleted customer count too: deleting it only hides them (TR-4),
 * and restoring it needs them as they were.
 */
export interface PersonUsage {
  /** Live customers in their charge. */
  readonly customers: number;
  /** Appointments and policies written for them as RE. */
  readonly appointments: number;
  readonly policies: number;
  readonly coordinating: number;
  /** Meetings they review the outcome of (D9). */
  readonly reviewing: number;
  /**
   * The customers in the trash some of those records belong to, by name in screen order; the code
   * tells two of one name apart (review of PR 669).
   */
  readonly inTrash: readonly { readonly name: string; readonly code: string }[];
}

/** `PersonUsage` without the customers in the trash, which the commands have no use for. */
type PersonCounts = Omit<PersonUsage, 'inTrash'>;

/** The field of `PersonUsage` that counts each kind of reference. */
const USAGE_FIELDS: Record<PersonReferenceKind, keyof PersonCounts> = {
  customer: 'customers',
  appointment: 'appointments',
  policy: 'policies',
  coordinator: 'coordinating',
  reviewer: 'reviewing',
};

// The references to the person that are live, by `kind` (the column they are).
const USAGE = `SELECT kind, COUNT(*) FROM (${PERSON_REFERENCES})
  WHERE person_id = ? AND live GROUP BY kind`;

// A customer in the trash is never `live` itself: only its records pointing to the person count.
const IN_TRASH = `SELECT c.name, c.code FROM customers c WHERE c.deleted_at IS NOT NULL AND c.id IN (
  SELECT customer_id FROM (${PERSON_REFERENCES}) WHERE person_id = ? AND live)`;

function usageCounts(db: Database, id: string): PersonCounts {
  const counts = { customers: 0, appointments: 0, policies: 0, coordinating: 0, reviewing: 0 };
  for (const [kind, count] of selectRows(db, USAGE, [id])) {
    // A kind no field counts would let a person still in use go, and 9b say nothing (DR6-114).
    const field = (USAGE_FIELDS as Partial<Record<string, keyof PersonCounts>>)[String(kind)];
    if (field === undefined) {
      throw new Error(`PersonUsage counts no reference of kind ${String(kind)}`);
    }
    counts[field] = Number(count);
  }
  return counts;
}

/** What `softDeletePerson` counts before it refuses; the delete dialog shows the same (T-250). */
export function personUsage(db: Database, id: string): PersonUsage {
  return {
    ...usageCounts(db, id),
    inTrash: selectRows(db, IN_TRASH, [id])
      .map(([name, code]) => ({ name: String(name), code: String(code) }))
      .sort((a, b) => byName(a.name, b.name) || (a.code < b.code ? -1 : 1)),
  };
}

/**
 * Whether the person is the RE of anything live, which keeps them an RE: the records keep pointing
 * to their RE (spec §3.3). The kinds are those `POINTS_TO` gives the RE, as import rule 5 reads it.
 */
export function ownsRecords(usage: PersonCounts): boolean {
  return PERSON_REFERENCE_KINDS.some(
    (kind) => POINTS_TO[kind] === 're' && usage[USAGE_FIELDS[kind]] > 0,
  );
}

/** Whether anything in `usage` keeps the person from deletion: a live reference of any kind. */
export function isPersonInUse(usage: PersonCounts): boolean {
  return PERSON_REFERENCE_KINDS.some((kind) => usage[USAGE_FIELDS[kind]] > 0);
}

// ---- team commands --------------------------------------------------------

export function createTeam(db: Database, input: { readonly name: string }): Team {
  return db.transaction(() => {
    const name = requireName(input.name);
    assertTeamNameFree(db, name, null);
    const at = db.now();
    const row: TeamRow = {
      id: ulid(at, db.random),
      name,
      createdAt: at.toISOString(),
      updatedAt: at.toISOString(),
      deletedAt: null,
    };
    db.orm.insert(teams).values(row).run();
    return toTeam(row);
  });
}

export function renameTeam(db: Database, id: string, newName: string): Team {
  return db.transaction(() => {
    liveTeam(db, id);
    const name = requireName(newName);
    assertTeamNameFree(db, name, id);
    updateRow(db, teams, id, { name });
    return toTeam(liveTeam(db, id));
  });
}

export function softDeleteTeam(db: Database, id: string): void {
  db.transaction(() => {
    liveTeam(db, id);
    const member = db.orm
      .select({ id: people.id })
      .from(people)
      .where(and(eq(people.teamId, id), isNull(people.deletedAt)))
      .get();
    if (member) throw new DbError('TEAM_HAS_MEMBERS');
    updateRow(db, teams, id, stampDeleted(db));
  });
}

export function restoreTeam(db: Database, id: string): void {
  db.transaction(() => {
    const row = requireRow(db, teams, id, 'TEAM_NOT_FOUND');
    checkRestoreTeam(db, row);
    updateRow(db, teams, id, { deletedAt: null });
  });
}

/** Why the team cannot be restored, thrown as `restoreTeam` throws it (spec Phase 6 TR-2). */
export function checkRestoreTeam(db: Database, row: TeamRow): void {
  assertTeamNameFree(db, row.name, row.id);
}

// ---- person commands ------------------------------------------------------

export interface PersonInput {
  readonly name: string;
  readonly role: PersonRole;
  readonly teamId: string | null;
}

export function createPerson(db: Database, input: PersonInput): Person {
  return db.transaction(() => {
    const valid = validatePerson(db, input, null);
    const at = db.now();
    const row: PersonRow = {
      id: ulid(at, db.random),
      ...valid,
      createdAt: at.toISOString(),
      updatedAt: at.toISOString(),
      deletedAt: null,
    };
    db.orm.insert(people).values(row).run();
    return toPerson(row);
  });
}

export function updatePerson(db: Database, id: string, changes: Partial<PersonInput>): Person {
  return db.transaction(() => {
    const current = toPerson(livePerson(db, id));
    // `undefined` keeps the current value; `teamId: null` clears the team.
    const role = changes.role ?? current.role;
    // Records keep pointing to their RE, who therefore has to stay an RE (spec §3.3).
    if (current.role === 'RE' && role !== 'RE' && ownsRecords(usageCounts(db, id))) {
      throw new DbError('PERSON_IN_USE');
    }
    // A reviewer or coordinator of a live meeting stays one of the roles that may support it (D9,
    // ADR-0007).
    if (REVIEWER_ROLES.includes(current.role) && !REVIEWER_ROLES.includes(role)) {
      const usage = usageCounts(db, id);
      if (usage.reviewing > 0) throw new DbError('REVIEWER_IN_USE');
      if (usage.coordinating > 0) throw new DbError('COORDINATOR_IN_USE');
    }
    const valid = validatePerson(
      db,
      {
        name: changes.name ?? current.name,
        role,
        teamId: changes.teamId === undefined ? current.teamId : changes.teamId,
      },
      id,
    );
    updateRow(db, people, id, valid);
    return toPerson(livePerson(db, id));
  });
}

export function softDeletePerson(db: Database, id: string): void {
  db.transaction(() => {
    livePerson(db, id);
    if (isPersonInUse(usageCounts(db, id))) throw new DbError('PERSON_IN_USE');
    updateRow(db, people, id, stampDeleted(db));
  });
}

export function restorePerson(db: Database, id: string): void {
  db.transaction(() => {
    const row = requireRow(db, people, id, 'PERSON_NOT_FOUND');
    checkRestorePerson(db, row);
    updateRow(db, people, id, { deletedAt: null });
  });
}

/** Why the person cannot be restored, thrown as `restorePerson` throws it (spec Phase 6 TR-2). */
export function checkRestorePerson(db: Database, row: PersonRow): void {
  validatePerson(db, toPerson(row), row.id);
}

// ---- helpers --------------------------------------------------------------

function toTeam(row: TeamRow): Team {
  return { id: row.id, name: row.name };
}

function toPerson(row: PersonRow): Person {
  return { id: row.id, name: row.name, role: row.role, teamId: row.teamId };
}

/** The team row, when it exists and is not deleted; the error names a deleted one. */
function liveTeam(db: Database, id: string): TeamRow {
  return liveRow(db, teams, id, 'TEAM_NOT_FOUND', ({ name }) => ({ name }));
}

function livePerson(db: Database, id: string): PersonRow {
  return liveRow(db, people, id, 'PERSON_NOT_FOUND');
}

function assertTeamNameFree(db: Database, name: string, exceptId: string | null): void {
  const clash = db.orm
    .select({ id: teams.id })
    .from(teams)
    .where(
      and(
        eq(teams.name, name),
        isNull(teams.deletedAt),
        exceptId === null ? isNotNull(teams.id) : ne(teams.id, exceptId),
      ),
    )
    .get();
  if (clash) throw new DbError('TEAM_NAME_TAKEN', { name });
}

/** Checks a person's fields; `selfId` is the person being changed or restored, else null. */
function validatePerson(db: Database, input: PersonInput, selfId: string | null): PersonInput {
  const name = requireName(input.name);
  const role = requireChoice(PERSON_ROLES, input.role);
  if (input.teamId === null) {
    if (ROLES_WITH_TEAM.includes(role)) throw new DbError('TEAM_REQUIRED');
  } else if (!ROLES_WITH_TEAM.includes(role)) {
    throw new DbError('TEAM_NOT_ALLOWED');
  } else {
    liveTeam(db, input.teamId);
    if (role === 'TL') assertNoOtherLead(db, input.teamId, selfId);
  }
  return { name, role, teamId: input.teamId };
}

/** A team has at most one live TL (Owner, G3 01/10/2026). */
function assertNoOtherLead(db: Database, teamId: string, selfId: string | null): void {
  const lead = db.orm
    .select({ name: people.name })
    .from(people)
    .where(
      and(
        eq(people.teamId, teamId),
        eq(people.role, 'TL'),
        isNull(people.deletedAt),
        selfId === null ? isNotNull(people.id) : ne(people.id, selfId),
      ),
    )
    .get();
  if (lead) throw new DbError('TEAM_HAS_LEAD', { name: lead.name });
}
