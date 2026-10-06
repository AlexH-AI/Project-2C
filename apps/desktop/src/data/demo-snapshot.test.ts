import { createTeam, listTeams, openDatabase, type Database } from '@p2c/db';
import { calendarDate, formatDate, type CalendarDate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { buildDemoSnapshot, demoSnapshotName, fetchDemoSnapshot } from './demo-snapshot';

const DAY = calendarDate(2026, 9, 5);

const fakeSeed = (db: Database, anchorDate: CalendarDate) =>
  createTeam(db, { name: `Seed ${formatDate(anchorDate)}` });

const respond =
  (body: BodyInit, status = 200) =>
  () =>
    Promise.resolve(new Response(body, { status }));

describe('demo snapshot', () => {
  it('names the file after its anchor day', () => {
    expect(demoSnapshotName(DAY)).toBe('demo-2026-09-05.sqlite');
  });

  it('builds a database file with the seed of the day', async () => {
    const bytes = await buildDemoSnapshot(DAY, fakeSeed);
    const db = await openDatabase({ bytes });
    expect(listTeams(db).map((team) => team.name)).toEqual(['Seed 05/09/2026']);
  });

  it("fetches the day's file by name", async () => {
    const bytes = await buildDemoSnapshot(DAY, fakeSeed);
    const asked: string[] = [];
    const fetched = await fetchDemoSnapshot(DAY, (url) => {
      asked.push(String(url));
      return Promise.resolve(new Response(new Uint8Array(bytes)));
    });
    expect(asked).toEqual(['demo-2026-09-05.sqlite']);
    expect(fetched).toEqual(bytes);
  });

  it('gives nothing when the file is missing, is not a database or cannot be fetched', async () => {
    expect(await fetchDemoSnapshot(DAY, respond('Not found', 404))).toBeUndefined();
    // A server with a page fallback answers a missing file with the page itself.
    expect(await fetchDemoSnapshot(DAY, respond('<!doctype html><html></html>'))).toBeUndefined();
    expect(
      await fetchDemoSnapshot(DAY, () => Promise.reject(new TypeError('offline'))),
    ).toBeUndefined();
  });
});
