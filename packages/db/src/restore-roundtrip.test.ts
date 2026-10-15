/**
 * Spec Phase 6 TR-3 (T-231, DR6-01): deleting a record then restoring it gives the data back as it
 * was, every row of the backup alike but for the stamps of the deletion and the update — for each
 * appointment, policy and customer of the demo seed. Only the deletion D7 refuses is left out.
 */
import { calendarDate, compareDates } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import { listAppointments, restoreAppointment, softDeleteAppointment } from './appointments';
import { exportBackup } from './backup';
import {
  listCustomers,
  listStageTransitions,
  restoreCustomer,
  softDeleteCustomer,
} from './customers';
import { openDatabase, type Database } from './database';
import { listPolicies, restorePolicy, softDeletePolicy } from './policies';
import { seedDemoData } from './seed';
import { errorOf } from './test-support';

const ANCHOR = calendarDate(2026, 9, 15);
// The demo's code path at a scale a test can delete and restore record by record.
const SCALE = { teams: 1, resPerTeam: 2, customersPerRe: 10, meetingDays: [2, 2] } as const;
const SLOW = 180_000;

async function seeded(): Promise<Database> {
  // Today is the anchor day, as the seed leaves it; the clock ticks so each stamp is its own.
  let clock = Date.UTC(ANCHOR.year, ANCHOR.month - 1, ANCHOR.day, 11, 0, 0);
  const db = await openDatabase({ persist: vi.fn(), now: () => new Date(clock++) });
  seedDemoData(db, { anchorDate: ANCHOR, seed: 1, scale: SCALE });
  return db;
}

/** Every row of the backup without the stamps a deletion and a restore move. */
function snapshot(db: Database): string {
  const { tables } = JSON.parse(exportBackup(db)) as {
    tables: Record<string, Record<string, unknown>[]>;
  };
  const stamps = new Set(['updated_at', 'deleted_at']);
  return JSON.stringify(
    Object.entries(tables).map(([name, list]) => [
      name,
      list.map((row) => Object.entries(row).filter(([column]) => !stamps.has(column))),
    ]),
  );
}

/** Deletes then restores each record; the ids whose data did not come back as it was. */
function roundTrips(
  db: Database,
  ids: readonly string[],
  remove: (db: Database, id: string) => void,
  restore: (db: Database, id: string) => void,
) {
  const changed: string[] = [];
  const refused: string[] = [];
  for (const id of ids) {
    const before = snapshot(db);
    const error = errorOf(() => remove(db, id));
    if (error) {
      refused.push(error.code);
      continue;
    }
    restore(db, id);
    if (snapshot(db) !== before) changed.push(id);
  }
  return { changed, refused };
}

describe('delete then restore', () => {
  it(
    'gives every appointment, policy and customer of the demo back as it was',
    async () => {
      const db = await seeded();
      const transitions = listStageTransitions(db);
      const moved = new Set(transitions.map((t) => t.appointmentId));
      const met = listAppointments(db).filter((a) => a.status === 'MET');
      const latest = new Map(transitions.map((t) => [t.customerId, t.date]));
      // DR6-01: met without moving the stage, which moved after the meeting day.
      const keptThenChanged = met.filter(
        (a) => !moved.has(a.id) && compareDates(latest.get(a.customerId)!, a.date) > 0,
      );
      expect(met.filter((a) => moved.has(a.id)).length).toBeGreaterThan(0);
      expect(keptThenChanged.length).toBeGreaterThan(0);

      const appointments = roundTrips(
        db,
        listAppointments(db).map((a) => a.id),
        softDeleteAppointment,
        restoreAppointment,
      );
      expect(appointments.changed).toEqual([]);
      // D7: a meeting whose transition is no longer the latest stays, as does one whose stage a
      // later meeting kept (T-232).
      expect(new Set(appointments.refused)).toEqual(
        new Set(['TRANSITION_NOT_LATEST', 'STAGE_KEPT_BY_MEETING']),
      );

      const policies = roundTrips(
        db,
        listPolicies(db).map((p) => p.id),
        softDeletePolicy,
        restorePolicy,
      );
      expect(policies).toEqual({ changed: [], refused: [] });

      const customers = roundTrips(
        db,
        listCustomers(db).map((c) => c.id),
        softDeleteCustomer,
        restoreCustomer,
      );
      expect(customers).toEqual({ changed: [], refused: [] });
    },
    SLOW,
  );
});
