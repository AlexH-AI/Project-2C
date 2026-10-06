/** Live records per kind, counted in SQL instead of reading every row (T-151, DR-71). */
import type { Database } from './database';

/** Live records per kind, as the lists hold them (soft-deleted ones left out). */
export interface RecordCounts {
  readonly teams: number;
  readonly people: number;
  readonly customers: number;
  readonly appointments: number;
  readonly policies: number;
}

// The same conditions as listTeams, listPeople, listCustomers, listAppointments and listPolicies:
// appointments and policies count only while their customer is live.
const COUNTS = `SELECT
  (SELECT COUNT(*) FROM teams WHERE deleted_at IS NULL),
  (SELECT COUNT(*) FROM people WHERE deleted_at IS NULL),
  (SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL),
  (SELECT COUNT(*) FROM appointments a JOIN customers c ON c.id = a.customer_id
    WHERE a.deleted_at IS NULL AND c.deleted_at IS NULL),
  (SELECT COUNT(*) FROM policies p JOIN customers c ON c.id = p.customer_id
    WHERE p.deleted_at IS NULL AND c.deleted_at IS NULL)`;

export function countRecords(db: Database): RecordCounts {
  const [teams, people, customers, appointments, policies] = db.sqlite
    .exec(COUNTS)[0]!
    .values[0]!.map(Number);
  return {
    teams: teams!,
    people: people!,
    customers: customers!,
    appointments: appointments!,
    policies: policies!,
  };
}
