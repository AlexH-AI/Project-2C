import { readFile } from 'node:fs/promises';
import { expect, test } from './fixtures';

// Temporary, one push only (T-472, L179): what Playwright's WebKit draws for the outline of the
// logo, drawn the old way (four `drop-shadow` of half a pixel on the pieces without an outline,
// which the mockups still hold) and the new way (the outline in the image). It fails on purpose,
// on WebKit only: a red run is the only one that keeps its screenshots (macos.yml).

const OLD = 'docs/design/mockups/img';
const NEW = 'apps/desktop/src/assets/brand';
const SHADOWS = ['0.5px 0', '-0.5px 0', '0 0.5px', '0 -0.5px']
  .map((offset) => `drop-shadow(${offset} 0 rgba(232, 211, 162, 0.95))`)
  .join(' ');

const data = async (path: string) =>
  `data:image/png;base64,${(await readFile(path)).toString('base64')}`;

test('L179 evidence: the outline of the logo on this browser, old way and new', async ({
  browser,
  browserName,
}, testInfo) => {
  test.skip(browserName !== 'webkit' && !process.env.L179_LOCAL, 'evidence of WebKit');
  // The pieces without an outline are 42 and 108 px wide; the ones with it have 1 px of room
  // around them, which a margin takes back, and one image for each scale.
  const old = {
    tree: `${OLD}/heritas-tree.png`,
    word: `${OLD}/heritas-wordmark.png`,
    widths: [42, 108],
    margin: 0,
  };
  const ways = {
    'no-outline': () => ({ ...old, filter: 'none' }),
    'old-drop-shadow': () => ({ ...old, filter: SHADOWS }),
    'new-in-the-image': (scale: number) => {
      const at = scale === 1 ? '' : `@${scale}x`;
      return {
        tree: `${NEW}/heritas-tree-outlined${at}.png`,
        word: `${NEW}/heritas-wordmark-outlined${at}.png`,
        widths: [44, 110],
        margin: -1,
        filter: 'none',
      };
    },
  };
  const counts: Record<string, number> = {};
  for (const scale of [1, 2]) {
    const context = await browser.newContext({ deviceScaleFactor: scale });
    const page = await context.newPage();
    for (const [name, wayAt] of Object.entries(ways)) {
      const way = wayAt(scale);
      const style = `margin: ${way.margin}px; filter: ${way.filter}`;
      await page.setContent(
        `<body style="margin: 0; background: #0b1017">
          <div id="logo" style="display: flex; align-items: center; gap: 10px; width: 180px; padding: 8px">
            <img width="${way.widths[0]}" style="${style}" src="${await data(way.tree)}" />
            <img id="word" width="${way.widths[1]}" style="${style}" src="${await data(way.word)}" />
          </div>
        </body>`,
      );
      for (const image of await page.locator('img').all()) {
        await image.evaluate((node: HTMLImageElement) => node.decode());
      }
      const key = `${name}@${scale}x`;
      await testInfo.attach(key, {
        body: await page.locator('#logo').screenshot(),
        contentType: 'image/png',
      });
      // The measure of shell.spec.ts: light, warm pixels of the lower part of "Heritas".
      const shot = (await page.locator('#word').screenshot()).toString('base64');
      counts[key] = await page.evaluate(async (shot) => {
        const image = new Image();
        image.src = `data:image/png;base64,${shot}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        const top = Math.round(canvas.height * 0.45);
        const { data: pixels } = context.getImageData(0, top, canvas.width, canvas.height - top);
        let count = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i]! > 90 && pixels[i]! - pixels[i + 2]! > 20) count++;
        }
        return count;
      }, shot);
    }
    await context.close();
  }
  expect(counts, 'champagne pixels by way of drawing and scale (evidence, red on purpose)').toEqual(
    {},
  );
});
