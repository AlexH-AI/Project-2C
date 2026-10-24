/** Live records counted in SQL instead of reading every row (T-151, DR-71). */
import { isRfTransition, type CustomerStage } from '@p2c/domain';
import { selectRows } from './common';
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

/**
 * The records of a customer not deleted on their own, which deleting it hides (mockup 5f) and
 * restoring it brings back (spec Phase 6 TR-4), and those deleted on their own. `rf`: its met
 * appointments whose own transition moved it up, as `isRfAppointment` counts them.
 */
export interface CustomerRecordCounts {
  readonly appointments: number;
  readonly met: number;
  readonly rf: number;
  readonly policies: number;
  readonly kycNotes: number;
  readonly aiAnalyses: number;
  /** Deleted on their own: they stay in the trash. */
  readonly appointmentsInTrash: number;
  readonly policiesInTrash: number;
}

export function countCustomerRecords(db: Database, customerId: string): CustomerRecordCounts {
  const [appointments, met, appointmentsInTrash, policyCount, policiesInTrash, kycNotes, ai] =
    selectRows(
      db,
      `SELECT
        (SELECT COUNT(*) FROM appointments WHERE customer_id = ?1 AND deleted_at IS NULL),
        (SELECT COUNT(*) FROM appointments
          WHERE customer_id = ?1 AND deleted_at IS NULL AND status = 'MET'),
        (SELECT COUNT(*) FROM appointments WHERE customer_id = ?1 AND deleted_at IS NOT NULL),
        (SELECT COUNT(*) FROM policies WHERE customer_id = ?1 AND deleted_at IS NULL),
        (SELECT COUNT(*) FROM policies WHERE customer_id = ?1 AND deleted_at IS NOT NULL),
        (SELECT COUNT(*) FROM kyc_notes WHERE customer_id = ?1),
        (SELECT COUNT(*) FROM ai_analyses WHERE customer_id = ?1)`,
      [customerId],
    )[0]!.map(Number);
  const moves = selectRows(
    db,
    `SELECT t.appointment_id, t.from_stage, t.to_stage FROM stage_transitions t
     JOIN appointments a ON a.id = t.appointment_id
     WHERE t.customer_id = ? AND t.deleted_at IS NULL AND a.deleted_at IS NULL AND a.status = 'MET'`,
    [customerId],
  );
  // Appointments, not transitions: one has at most one live transition only as the commands write.
  const rfAppointments = moves
    .filter(([, from, to]) => isRfTransition(from as CustomerStage | null, to as CustomerStage))
    .map(([appointmentId]) => appointmentId);
  return {
    appointments: appointments!,
    met: met!,
    rf: new Set(rfAppointments).size,
    policies: policyCount!,
    kycNotes: kycNotes!,
    aiAnalyses: ai!,
    appointmentsInTrash: appointmentsInTrash!,
    policiesInTrash: policiesInTrash!,
  };
}
