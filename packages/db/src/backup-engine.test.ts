import { expect, it, vi } from 'vitest';
import { BACKUP_FORMAT, importBackup } from './backup';
import { DbError } from './errors';

// sql.js keeps its module once loaded, so a failing load needs a file of its own.
vi.mock('sql.js', () => ({
  default: () => Promise.reject(new Error('sql-wasm.wasm not found')),
}));

it('reports a failure of the engine as it is, not as a damaged file', async () => {
  const text = JSON.stringify({
    format: BACKUP_FORMAT,
    schemaVersion: 1,
    exportedAt: '2026-09-30T07:45:00.000Z',
    tables: {},
  });

  const error = await importBackup(text).catch((e: unknown) => e);

  expect(error).not.toBeInstanceOf(DbError);
  expect(error).toMatchObject({ message: 'sql-wasm.wasm not found' });
});
