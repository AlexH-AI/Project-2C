import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { seedDuration, seedOnLoad } from './seeded-snapshot';

interface Backup {
  readonly format: string;
  readonly schemaVersion: number;
  readonly exportedAt: string;
  readonly tables: Record<string, unknown[]>;
}

async function exportBackup(page: Page): Promise<Backup> {
  await page.goto('/#/settings');
  const download = page.waitForEvent('download');
  await page
    .getByRole('region', { name: 'Xuất / nhập backup' })
    .getByRole('button', { name: 'Xuất backup' })
    .click();
  return JSON.parse(await readFile(await (await download).path(), 'utf8')) as Backup;
}

/**
 * Everything but the export time, each table as its row count and a hash of its rows: a diff of
 * two 10 MB backups would take minutes, this one names the tables that differ.
 */
const contents = ({ format, schemaVersion, tables }: Backup) => ({
  format,
  schemaVersion,
  tables: Object.fromEntries(
    Object.entries(tables).map(([name, rows]) => [
      name,
      `${rows.length} rows, ${createHash('sha256').update(JSON.stringify(rows)).digest('hex')}`,
    ]),
  ),
});

test('a page load opens the data seeded beforehand instead of seeding (DR-79)', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');
  expect(await seedDuration(page)).toBeUndefined();
});

test('the data seeded beforehand is exactly the data a page load seeds', async ({ browser }) => {
  const ready = await browser.newPage();
  const seeded = await browser.newPage();
  await seedOnLoad(seeded);

  const fromFile = contents(await exportBackup(ready));
  const fromSeed = contents(await exportBackup(seeded));
  expect(await seedDuration(seeded)).toBeGreaterThan(0);
  expect(Object.keys(fromSeed.tables).length).toBeGreaterThan(5);
  expect(fromFile).toEqual(fromSeed);
});
