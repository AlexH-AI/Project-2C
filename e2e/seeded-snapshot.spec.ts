import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { DEMO_ANCHOR } from './anchor';
import { expect, test, type Page } from './fixtures';
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

test.describe('on the machine clock', () => {
  // `seedDuration` reads a `performance` entry, which the page clock does not keep.
  test.use({ machineClock: true });

  test('a page load opens the data seeded beforehand instead of seeding (DR-79)', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tổng quan');
    expect(await seedDuration(page)).toBeUndefined();
  });
});

// Both pages on the page clock (fixtures.ts), so both ask for the file of the anchor day, whatever
// the machine's time: the app fetches it by its day's name. One context holds both pages, as the
// web build keeps its data in the memory of each page.
test('the data seeded beforehand is exactly the data a page load seeds', async ({
  context,
  page,
}) => {
  const seeded = await context.newPage();
  await seedOnLoad(seeded);
  // That file refused is what makes the page seed; the page clock keeps no entry for seedDuration.
  const [day, month, year] = DEMO_ANCHOR.split('/');
  const refused = seeded.waitForResponse(
    (response) =>
      response.url().endsWith(`/demo-${year}-${month}-${day}.sqlite`) && response.status() === 404,
  );

  const fromFile = contents(await exportBackup(page));
  const fromSeed = contents(await exportBackup(seeded));
  await refused;
  expect(Object.keys(fromSeed.tables).length).toBeGreaterThan(5);
  expect(fromFile).toEqual(fromSeed);
});
