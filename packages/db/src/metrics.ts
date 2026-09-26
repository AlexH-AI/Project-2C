/** Everything the stats engine needs, read from live records (spec §4: metrics are computed in memory). */
import type { MetricsData } from '@p2c/domain';
import { listAppointments } from './appointments';
import { listStageTransitions } from './customers';
import type { Database } from './database';
import { listPolicies } from './policies';
import { listPeople } from './team';

export function loadMetricsData(db: Database): MetricsData {
  return {
    people: listPeople(db),
    policies: listPolicies(db),
    appointments: listAppointments(db),
    transitions: listStageTransitions(db),
  };
}
