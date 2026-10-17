/**
 * Commands and reads for teams and people (spec §3.1–3.2, §4). Every command runs in one
 * transaction; a rejected command throws `DbError` and leaves the database untouched.
 */
import {
  byName,
  PERSON_ROLES,
  REVIEWER_ROLES,
  type Person,
  type PersonRole,
  type Team,
} from '@p2c/domain';
import { and, asc, eq, isNotNull, isNull, ne } from 'drizzle-orm';
import { requireChoice, requireName, selectRows, stampDeleted } from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import { people, teams } from './schema';

type TeamRow = typeof teams.$inferSelect;
type PersonRow = typeof people.$inferSelect;

const ROLES_WITH_TEAM: readonly PersonRole[] = ['RE', 'TL'];

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

export function getTeam(db: Database, id: string): Team | undefined {
  const row = findTeam(db, id);
  return row && !row.deletedAt ? toTeam(row) : undefined;
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

export function getPerson(db: Database, id: string): Person | undefined {
  const row = findPerson(db, id);
  return row && !row.deletedAt ? toPerson(row) : undefined;
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
  /** The customers in the trash some of those records belong to, by name in screen order. */
  readonly inTrash: readonly string[];
}

const USAGE = `SELECT
  (SELECT COUNT(*) FROM customers WHERE re_id = ?1 AND deleted_at IS NULL),
  (SELECT COUNT(*) FROM appointments WHERE re_id = ?1 AND deleted_at IS NULL),
  (SELECT COUNT(*) FROM policies WHERE re_id = ?1 AND deleted_at IS NULL),
  (SELECT COUNT(*) FROM appointment_coordinators ac JOIN appointments a ON a.id = ac.appointment_id
    WHERE ac.person_id = ?1 AND a.deleted_at IS NULL),
  (SELECT COUNT(*) FROM appointments WHERE outcome_reviewer_id = ?1 AND deleted_at IS NULL)`;

const IN_TRASH = `SELECT c.name FROM customers c WHERE c.deleted_at IS NOT NULL AND (
  EXISTS (SELECT 1 FROM appointments a WHERE a.customer_id = c.id AND a.deleted_at IS NULL
    AND (a.re_id = ?1 OR a.outcome_reviewer_id = ?1 OR EXISTS (SELECT 1
      FROM appointment_coordinators ac WHERE ac.appointment_id = a.id AND ac.person_id = ?1)))
  OR EXISTS (SELECT 1 FROM policies p WHERE p.customer_id = c.id AND p.deleted_at IS NULL
    AND p.re_id = ?1))`;

/** What `softDeletePerson` counts before it refuses; the delete dialog shows the same (T-250). */
export function personUsage(db: Database, id: string): PersonUsage {
  const [customers, appointments, policies, coordinating, reviewing] = selectRows(db, USAGE, [
    id,
  ])[0]!.map(Number);
  return {
    customers: customers!,
    appointments: appointments!,
    policies: policies!,
    coordinating: coordinating!,
    reviewing: reviewing!,
    inTrash: selectRows(db, IN_TRASH, [id])
      .map(([name]) => String(name))
      .sort(byName),
  };
}

/** Whether anything in `usage` keeps the person from deletion. */
export function isPersonInUse(usage: PersonUsage): boolean {
  return (
    usage.customers + usage.appointments + usage.policies + usage.coordinating + usage.reviewing > 0
  );
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
    updateTeamRow(db, id, { name });
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
    updateTeamRow(db, id, stampDeleted(db));
  });
}

export function restoreTeam(db: Database, id: string): void {
  db.transaction(() => {
    const row = findTeam(db, id);
    if (!row) throw new DbError('TEAM_NOT_FOUND');
    checkRestoreTeam(db, row);
    updateTeamRow(db, id, { deletedAt: null });
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
    if (current.role === 'RE' && role !== 'RE') {
      const usage = personUsage(db, id);
      if (usage.customers + usage.appointments + usage.policies > 0) {
        throw new DbError('PERSON_IN_USE');
      }
    }
    // A reviewer or coordinator of a live meeting stays one of the roles that may support it (D9,
    // ADR-0007).
    if (REVIEWER_ROLES.includes(current.role) && !REVIEWER_ROLES.includes(role)) {
      const usage = personUsage(db, id);
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
    updatePersonRow(db, id, valid);
    return toPerson(livePerson(db, id));
  });
}

export function softDeletePerson(db: Database, id: string): void {
  db.transaction(() => {
    livePerson(db, id);
    if (isPersonInUse(personUsage(db, id))) throw new DbError('PERSON_IN_USE');
    updatePersonRow(db, id, stampDeleted(db));
  });
}

export function restorePerson(db: Database, id: string): void {
  db.transaction(() => {
    const row = findPerson(db, id);
    if (!row) throw new DbError('PERSON_NOT_FOUND');
    checkRestorePerson(db, row);
    updatePersonRow(db, id, { deletedAt: null });
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

function findTeam(db: Database, id: string): TeamRow | undefined {
  return db.orm.select().from(teams).where(eq(teams.id, id)).get();
}

function findPerson(db: Database, id: string): PersonRow | undefined {
  return db.orm.select().from(people).where(eq(people.id, id)).get();
}

/** The team row, when it exists and is not deleted; the error names a deleted one. */
function liveTeam(db: Database, id: string): TeamRow {
  const row = findTeam(db, id);
  if (!row) throw new DbError('TEAM_NOT_FOUND');
  if (row.deletedAt) throw new DbError('TEAM_NOT_FOUND', { name: row.name });
  return row;
}

function livePerson(db: Database, id: string): PersonRow {
  const row = findPerson(db, id);
  if (!row || row.deletedAt) throw new DbError('PERSON_NOT_FOUND');
  return row;
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

function updateTeamRow(db: Database, id: string, changes: Partial<TeamRow>): void {
  db.orm
    .update(teams)
    .set({ updatedAt: db.now().toISOString(), ...changes })
    .where(eq(teams.id, id))
    .run();
}

function updatePersonRow(db: Database, id: string, changes: Partial<PersonRow>): void {
  db.orm
    .update(people)
    .set({ updatedAt: db.now().toISOString(), ...changes })
    .where(eq(people.id, id))
    .run();
}
