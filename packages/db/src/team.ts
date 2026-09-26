/**
 * Commands and reads for teams and people (spec §3.1–3.2, §4). Every command runs in one
 * transaction; a rejected command throws `DbError` and leaves the database untouched.
 */
import type { Person, PersonRole, Team } from '@p2c/domain';
import { and, asc, eq, isNotNull, isNull, ne } from 'drizzle-orm';
import { requireName, stampDeleted } from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import {
  appointmentCoordinators,
  appointments,
  customers,
  people,
  policies,
  teams,
} from './schema';

type TeamRow = typeof teams.$inferSelect;
type PersonRow = typeof people.$inferSelect;

const ROLES_WITH_TEAM: readonly PersonRole[] = ['RE', 'TL'];

// ---- reads ----------------------------------------------------------------

export function listTeams(db: Database): Team[] {
  return db.orm
    .select()
    .from(teams)
    .where(isNull(teams.deletedAt))
    .orderBy(asc(teams.name))
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
    .orderBy(asc(people.name))
    .all()
    .map(toPerson);
}

export function getPerson(db: Database, id: string): Person | undefined {
  const row = findPerson(db, id);
  return row && !row.deletedAt ? toPerson(row) : undefined;
}

// ---- team commands --------------------------------------------------------

export function createTeam(db: Database, input: { readonly name: string }): Team {
  return db.transaction(() => {
    const name = requireName(input.name);
    assertTeamNameFree(db, name, null);
    const at = db.now();
    const row: TeamRow = {
      id: ulid(at),
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
    assertTeamNameFree(db, row.name, id);
    updateTeamRow(db, id, { deletedAt: null });
  });
}

// ---- person commands ------------------------------------------------------

export interface PersonInput {
  readonly name: string;
  readonly role: PersonRole;
  readonly teamId: string | null;
}

export function createPerson(db: Database, input: PersonInput): Person {
  return db.transaction(() => {
    const valid = validatePerson(db, input);
    const at = db.now();
    const row: PersonRow = {
      id: ulid(at),
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
    const valid = validatePerson(db, {
      name: changes.name ?? current.name,
      role: changes.role ?? current.role,
      teamId: changes.teamId === undefined ? current.teamId : changes.teamId,
    });
    updatePersonRow(db, id, valid);
    return toPerson(livePerson(db, id));
  });
}

export function softDeletePerson(db: Database, id: string): void {
  db.transaction(() => {
    livePerson(db, id);
    if (isPersonInUse(db, id)) throw new DbError('PERSON_IN_USE');
    updatePersonRow(db, id, stampDeleted(db));
  });
}

export function restorePerson(db: Database, id: string): void {
  db.transaction(() => {
    const row = findPerson(db, id);
    if (!row) throw new DbError('PERSON_NOT_FOUND');
    validatePerson(db, toPerson(row));
    updatePersonRow(db, id, { deletedAt: null });
  });
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

function liveTeam(db: Database, id: string): TeamRow {
  const row = findTeam(db, id);
  if (!row || row.deletedAt) throw new DbError('TEAM_NOT_FOUND');
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
  if (clash) throw new DbError('TEAM_NAME_TAKEN');
}

/** Whether a live customer, appointment or policy still points to the person (spec §4). */
function isPersonInUse(db: Database, id: string): boolean {
  const live = (table: typeof customers | typeof appointments | typeof policies) =>
    db.orm
      .select({ id: table.id })
      .from(table)
      .where(and(eq(table.reId, id), isNull(table.deletedAt)))
      .get();
  const coordinating = db.orm
    .select({ id: appointments.id })
    .from(appointmentCoordinators)
    .innerJoin(appointments, eq(appointments.id, appointmentCoordinators.appointmentId))
    .where(and(eq(appointmentCoordinators.personId, id), isNull(appointments.deletedAt)))
    .get();
  return [live(customers), live(appointments), live(policies), coordinating].some(Boolean);
}

function validatePerson(db: Database, input: PersonInput): PersonInput {
  const name = requireName(input.name);
  if (input.teamId === null) {
    if (ROLES_WITH_TEAM.includes(input.role)) throw new DbError('TEAM_REQUIRED');
  } else {
    liveTeam(db, input.teamId);
  }
  return { name, role: input.role, teamId: input.teamId };
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
