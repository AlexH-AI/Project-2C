import { expect, test } from '@playwright/test';
import { brokenLinks, imageSizes } from './links';

// Runs after the shots (playwright.guide.config.ts); alone, on a guide text change:
//   pnpm exec playwright test -c playwright.guide.config.ts --project check --no-deps

const MAX_IMAGE = 150 * 1024;
const MAX_TOTAL = 4 * 1024 * 1024;

test('every relative link and image of docs/user-guide exists', () => {
  expect(brokenLinks(), 'links to nothing, as file: link').toEqual([]);
});

test('each image is at most 150 KB, all together at most 4 MB', () => {
  const sizes = imageSizes();
  expect(sizes.length).toBeGreaterThan(0);
  const tooBig = sizes.filter(({ bytes }) => bytes > MAX_IMAGE);
  expect(tooBig, 'images over 150 KB').toEqual([]);
  const total = sizes.reduce((sum, { bytes }) => sum + bytes, 0);
  expect(total, 'bytes of all images').toBeLessThanOrEqual(MAX_TOTAL);
});
