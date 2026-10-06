/**
 * The tables the screens show, read once per revision and shared by every screen (T-151, DR-20):
 * moving between screens, or re-rendering one, reads nothing until a command changes the data.
 */
import {
  listAppointments,
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type AppointmentRecord,
  type CustomerRecord,
  type Database,
} from '@p2c/db';
import type { Person, Policy, StageTransition, Team } from '@p2c/domain';

/** Every live record of each kind, as the `list*` reads of `@p2c/db` give them. Never mutate. */
export interface Tables {
  readonly teams: readonly Team[];
  readonly people: readonly Person[];
  readonly customers: readonly CustomerRecord[];
  readonly appointments: readonly AppointmentRecord[];
  readonly policies: readonly Policy[];
  readonly transitions: readonly StageTransition[];
}

/** The tables of `db`, each read the first time a screen asks for it, then kept. */
export function readTables(db: Database): Tables {
  const once = <T>(read: (db: Database) => T) => {
    let value: { readonly rows: T } | undefined;
    return () => (value ??= { rows: read(db) }).rows;
  };
  const teams = once(listTeams);
  const people = once(listPeople);
  const customers = once(listCustomers);
  const appointments = once(listAppointments);
  const policies = once(listPolicies);
  const transitions = once(listStageTransitions);
  return {
    get teams() {
      return teams();
    },
    get people() {
      return people();
    },
    get customers() {
      return customers();
    },
    get appointments() {
      return appointments();
    },
    get policies() {
      return policies();
    },
    get transitions() {
      return transitions();
    },
  };
}
