import { createCustomer, createPerson, createTeam, openDatabase } from '@p2c/db';
import { calendarDate, periodOf } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { stageBlock } from '../routes/overview/stage-view';
import { teamCompare } from '../routes/overview/team-compare-view';
import { readTables } from './tables';

const TODAY = calendarDate(2026, 10, 7);
const BY_NAME = ['An', 'Đông', 'đức', 'Zeta'];

// DR-48: SQLite orders names byte by byte, which puts "Đ…" and "đ…" after "Z".
describe('readTables orders names as the screens show them', () => {
  async function database() {
    const db = await openDatabase({ now: () => new Date(Date.UTC(2026, 9, 7, 5)) });
    for (const name of ['Zeta', 'đức', 'Đông', 'An']) {
      const team = createTeam(db, { name });
      const re = createPerson(db, { name, role: 'RE', teamId: team.id });
      createCustomer(db, { name, reId: re.id, stage: 'N1', date: TODAY });
    }
    return db;
  }

  it('teams, people and customers by name', async () => {
    const tables = readTables(await database());

    expect(tables.teams.map((team) => team.name)).toEqual(BY_NAME);
    expect(tables.people.map((person) => person.name)).toEqual(BY_NAME);
    expect(tables.customers.map((customer) => customer.name)).toEqual(BY_NAME);
  });

  it('one order in the Góc nhìn picker, the charts of Tổng quan and So sánh team', async () => {
    const tables = readTables(await database());
    const period = periodOf('month', TODAY);
    const scope = { kind: 'team', teamId: tables.teams[0]!.id } as const;

    expect(tables.teams.map((team) => team.name)).toEqual(BY_NAME);
    expect(stageBlock(tables, period, scope, TODAY).charts.map((chart) => chart.team)).toEqual(
      BY_NAME,
    );
    expect(teamCompare(tables, period, TODAY).teams.map((team) => team.name)).toEqual(BY_NAME);
  });
});
