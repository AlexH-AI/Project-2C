import { expect, test } from '@playwright/test';

// ADR-0013 tokens: --bg-0 #0B1017, --text #E8EDF4.
const BG_0 = 'rgb(11, 16, 23)';
const TEXT = 'rgb(232, 237, 244)';

test('body uses the ADR-0013 surface, text colour and font', async ({ page }) => {
  await page.goto('/');

  const body = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return {
      background: style.backgroundColor,
      color: style.color,
      fontFamily: style.fontFamily,
    };
  });

  expect(body.background).toBe(BG_0);
  expect(body.color).toBe(TEXT);
  expect(body.fontFamily).toMatch(/^"?Be Vietnam Pro"?,/);
});

test('Be Vietnam Pro is loaded from the app itself, including Vietnamese glyphs', async ({
  page,
}) => {
  await page.goto('/');

  const loadedWeights = await page.evaluate(async () => {
    // document.fonts.check() is true when no face matches at all, so inspect the faces instead.
    const weights = ['400', '500', '600', '700'];
    await Promise.all(
      weights.map((w) => document.fonts.load(`${w} 16px "Be Vietnam Pro"`, 'Việt Đ')),
    );
    // Only the vietnamese subset covers U+1EA0–1EF9 ("ệ"); the latin face alone must not pass.
    const faces = [...document.fonts].filter(
      (face) =>
        face.family.replaceAll('"', '') === 'Be Vietnam Pro' &&
        face.status === 'loaded' &&
        /U\+1EA0-1EF9/i.test(face.unicodeRange),
    );
    return weights.filter((w) => faces.some((face) => face.weight === w));
  });

  expect(loadedWeights).toEqual(['400', '500', '600', '700']);
});

test('the app makes no requests to hosts other than localhost', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const { hostname, protocol } = new URL(request.url());
    if (protocol.startsWith('http') && hostname !== 'localhost') external.push(request.url());
  });

  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');

  expect(external).toEqual([]);
});

test('figures use tabular numerals', async ({ page }) => {
  await page.goto('/');

  const value = page.getByRole('region', { name: 'Chuyển RF' }).getByRole('paragraph').first();
  await expect(value).toHaveCSS('font-variant-numeric', 'tabular-nums');
});

test('token-backed corner radius is applied', async ({ page }) => {
  await page.goto('/');

  const tile = page.getByRole('region', { name: 'Chuyển RF' });
  await expect(tile).toHaveCSS('border-radius', '10px');
});
