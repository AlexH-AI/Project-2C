import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

// The sample chart of Tổng quan is gone (T-109); the N4–N1 charts of T-110 bring the chunk back,
// and that task makes it required again.
test('the chart bundle stays within 250 KB gzip', () => {
  const assets = join(import.meta.dirname, '../apps/desktop/dist/assets');
  const chunks = readdirSync(assets).filter((file) => /^chart-.*\.js$/.test(file));

  expect(chunks.length).toBeLessThanOrEqual(1);
  for (const chunk of chunks) {
    const size = gzipSync(readFileSync(join(assets, chunk))).length;
    expect(size).toBeLessThanOrEqual(250 * 1024);
  }
});
