import { describe, expect, it } from 'vitest';
import { createCustomer, softDeleteCustomer } from './customers';
import type { Database } from './database';
import * as db from './index';
import { addKycNote, getKycProfile, listKycVersions } from './kyc';
import { codeOf, d, setup } from './test-support';

async function withCustomer(profile: { birthDate?: { year: number }; gender?: 'MALE' } = {}) {
  const ctx = await setup();
  const customer = createCustomer(ctx.db, {
    name: 'Lan',
    reId: ctx.re.id,
    stage: 'N4',
    date: d(1, 9, 2026),
    ...profile,
  });
  ctx.persist.mockClear();
  const note = addKycNote(ctx.db, customer.id, { text: 'Gặp lần đầu', date: d(2, 9, 2026) });
  return { ...ctx, customer, note };
}

/** Facts and versions are written by the commands of T-043b; here they are inserted directly. */
function insertFact(
  database: Database,
  customerId: string,
  noteId: string,
  seq: number,
  value: string,
) {
  database.sqlite.run(
    "INSERT INTO kyc_facts (id, customer_id, seq, field, value_json, note_id, confirmed_date, status, created_at, updated_at) VALUES (?, ?, ?, 'childrenCount', ?, ?, ?, 'active', 'x', 'x')",
    [`f${seq}`, customerId, seq, value, noteId, `2026-09-${10 - seq}`],
  );
}

describe('KYC notes', () => {
  it('appends notes from the RE in recording order', async () => {
    const { db: database, customer, note, persist } = await withCustomer();

    const second = addKycNote(database, customer.id, {
      text: ' Con thứ hai ',
      date: d(1, 9, 2026),
    });

    expect(note).toEqual({
      id: expect.stringMatching(/^[0-9A-Z]{26}$/),
      text: 'Gặp lần đầu',
      createdDate: d(2, 9, 2026),
      source: 'RE',
    });
    expect(second.text).toBe('Con thứ hai');
    expect(getKycProfile(database, customer.id).notes).toEqual([note, second]);
    expect(persist).toHaveBeenCalledTimes(2);
  });

  it('refuses an empty note and an unknown or deleted customer', async () => {
    const { db: database, customer } = await withCustomer();

    expect(codeOf(() => addKycNote(database, customer.id, { text: '  ', date: d(1, 9) }))).toBe(
      'KYC_NOTE_EMPTY',
    );
    expect(codeOf(() => addKycNote(database, 'nobody', { text: 'x', date: d(1, 9) }))).toBe(
      'CUSTOMER_NOT_FOUND',
    );
    softDeleteCustomer(database, customer.id);
    expect(codeOf(() => getKycProfile(database, customer.id))).toBe('CUSTOMER_NOT_FOUND');
  });

  it('can never be edited or deleted, not even with raw SQL', async () => {
    const { db: database, customer, note } = await withCustomer();
    insertFact(database, customer.id, note.id, 1, '2');

    expect(
      Object.keys(db)
        .filter((name) => /Kyc/.test(name))
        .sort(),
    ).toEqual(['addKycNote', 'getKycProfile', 'listKycVersions']);
    const run = (sql: string) => () => database.sqlite.run(sql);
    expect(run("UPDATE kyc_notes SET text = 'sửa'")).toThrow(/append-only/);
    expect(run('DELETE FROM kyc_notes')).toThrow(/append-only/);
    // A fact is never deleted and only its status changes.
    expect(run('UPDATE kyc_facts SET value_json = \'"Luật sư"\'')).toThrow(/append-only/);
    expect(run('DELETE FROM kyc_facts')).toThrow(/append-only/);
    expect(run("UPDATE kyc_facts SET status = 'superseded', updated_at = 'x'")).not.toThrow();
  });
});

describe('KYC reads', () => {
  it('reads facts and versions in recording order, not by date', async () => {
    const { db: database, customer, note } = await withCustomer();
    insertFact(database, customer.id, note.id, 1, '2');
    insertFact(database, customer.id, note.id, 2, '3');
    database.sqlite.run(
      "INSERT INTO kyc_versions (id, customer_id, seq, hash, date, material, created_at) VALUES ('v1', ?, 1, 'h1', '2026-09-03', 1, 'x'), ('v0', ?, 2, 'h2', '2026-09-01', 0, 'x')",
      [customer.id, customer.id],
    );

    expect(getKycProfile(database, customer.id).facts).toEqual([
      {
        id: 'f1',
        category: 'FAMILY',
        field: 'childrenCount',
        value: 2,
        noteId: note.id,
        confirmedDate: d(9, 9, 2026),
        status: 'active',
      },
      expect.objectContaining({ id: 'f2', value: 3, confirmedDate: d(8, 9, 2026) }),
    ]);
    expect(listKycVersions(database, customer.id)).toEqual([
      {
        id: 'v1',
        hash: 'h1',
        summary: 'Cập nhật KYC 03/09/2026',
        date: d(3, 9, 2026),
        material: true,
      },
      {
        id: 'v0',
        hash: 'h2',
        summary: 'Cập nhật KYC 01/09/2026',
        date: d(1, 9, 2026),
        material: false,
      },
    ]);
    softDeleteCustomer(database, customer.id);
    expect(codeOf(() => listKycVersions(database, customer.id))).toBe('CUSTOMER_NOT_FOUND');
  });
});
