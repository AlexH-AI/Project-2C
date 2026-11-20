import { expect, test, type Locator, type Page } from './fixtures';
import {
  markOs,
  periodPill,
  pickScope,
  pressButton,
  scopeMenu,
  scopePill,
  tabKey,
} from './support';

// The moves of the app (VA7a; chuyen-dong.html, ADR-0013 appendix 14/11/2026). Every other spec
// runs under "Giảm chuyển động" (playwright.config.ts); these turn the motion on, but the last
// group. What is read is the move itself (`getAnimations()`: its name, when it starts and ends, its
// first frame), never a transform caught halfway.
test.use({ reducedMotion: 'no-preference' });

/** The transform and the opacity of a frame of a move. */
interface Frame {
  readonly transform?: string;
  readonly opacity?: string;
}

/** One move of an element, as the page runs it: its first frame, or the last of a move out. */
interface Move {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly from?: Frame;
  readonly to?: Frame;
  /** What it runs on: its role, or its tag (`nextMove`). */
  readonly on?: string;
}

/**
 * The moves now running on the elements `select` finds, read in the page as soon as `ready` holds
 * (`ready` and `select` are run in the page: plain functions of nothing else).
 */
async function movesWhen(page: Page, ready: string, select: string): Promise<Move[][]> {
  const found = await page.waitForFunction(
    ({ ready, select }) => {
      if (!document.querySelector(ready)) return null;
      const nodes = [...document.querySelectorAll(select)];
      const moves = nodes.map((node) =>
        node.getAnimations().map((move) => {
          const effect = move.effect as KeyframeEffect;
          const timing = effect.getComputedTiming();
          const first: ComputedKeyframe | undefined = effect.getKeyframes()[0];
          return {
            name: (move as CSSAnimation).animationName,
            start: Number(timing.delay),
            end: Math.round(Number(timing.endTime)),
            from: {
              ...(typeof first?.transform === 'string' && { transform: first.transform }),
              ...(typeof first?.opacity === 'string' && { opacity: first.opacity }),
            },
          };
        }),
      );
      return moves.some((one) => one.length > 0) ? moves : null;
    },
    { ready, select },
  );
  return (await found.jsonValue()) as Move[][];
}

/**
 * Waits in the page for the next move named `name` to start, wherever it is (a menu or a dialog
 * on its way out lasts 120 ms only): call the result once what starts it is done.
 */
async function nextMove(page: Page, name: string): Promise<() => Promise<Move>> {
  await page.evaluate((name) => {
    const seen = new Promise((resolve) => {
      const started = (event: AnimationEvent) => {
        if (event.animationName !== name) return;
        document.removeEventListener('animationstart', started, true);
        const move = (event.target as Element)
          .getAnimations()
          .find((one) => (one as CSSAnimation).animationName === name)!;
        const effect = move.effect as KeyframeEffect;
        const timing = effect.getComputedTiming();
        const last: ComputedKeyframe | undefined = effect.getKeyframes().at(-1);
        resolve({
          name,
          start: Number(timing.delay),
          end: Math.round(Number(timing.endTime)),
          to: {
            ...(typeof last?.transform === 'string' && { transform: last.transform }),
            ...(typeof last?.opacity === 'string' && { opacity: last.opacity }),
          },
          on: (event.target as Element).getAttribute('role') ?? (event.target as Element).localName,
        });
      };
      document.addEventListener('animationstart', started, true);
    });
    (window as unknown as { nextMove: Promise<unknown> }).nextMove = seen;
  }, name);
  return () => page.evaluate(() => (window as unknown as { nextMove: Promise<Move> }).nextMove);
}

/** The moves of "Hiện" running in the screen now, on its parts: none once it has opened. */
const risesNow = (page: Page) =>
  page.evaluate(
    () =>
      document
        .querySelector('main')!
        .getAnimations({ subtree: true })
        .filter((move) => (move as CSSAnimation).animationName === 'rise').length,
  );

/** The live region of the toast of the window. */
const TOASTS = 'div[aria-live="polite"][aria-atomic="true"]';

const nav = (page: Page, name: string) =>
  page.getByRole('navigation').getByRole('link', { name, exact: true });

const RISE = { name: 'rise', from: { transform: 'translateY(8px)', opacity: '0' } };

/** Dialog 6c of an appointment booked today: its check box "Hẹn lần tiếp theo". */
async function nextBookingBox(page: Page) {
  await page.goto('/#/appointments');
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const booking = page.getByRole('dialog', { name: 'Lịch hẹn mới' });
  await booking.getByRole('textbox', { name: /^Khách hàng/ }).fill('K-');
  await booking
    .getByRole('list', { name: 'KH khớp' })
    .getByRole('button')
    .filter({ hasText: /N3$/ })
    .first()
    .click();
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('15/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toHaveCount(0);
  await page
    .getByRole('complementary', { name: 'Chi tiết lịch hẹn' })
    .getByRole('button', { name: 'Ghi kết quả' })
    .click();
  return page
    .getByRole('dialog', { name: 'Kết quả cuộc gặp' })
    .getByRole('checkbox', { name: 'Hẹn lần tiếp theo' });
}

/**
 * Ticks `box` by a click, then reads the move of its tick (the `::after` the app draws): its
 * duration, and whether its curve is --spring-bouncy, as the page reads both.
 */
const tick = (box: Locator) =>
  box.evaluate((node: HTMLInputElement) => {
    node.click();
    const probe = document.createElement('div');
    probe.style.transitionTimingFunction = 'var(--spring-bouncy)';
    document.body.append(probe);
    const bouncy = getComputedStyle(probe).transitionTimingFunction;
    probe.remove();
    const moves = node
      .getAnimations({ subtree: true })
      .filter((move) => move instanceof CSSTransition && move.transitionProperty === 'transform')
      .map((move) => ({
        on: (move.effect as KeyframeEffect).pseudoElement,
        duration: Number(move.effect!.getComputedTiming().duration),
        bouncy: getComputedStyle(node, '::after').transitionTimingFunction === bouncy,
      }));
    return { checked: node.checked, moves };
  });

test('a new screen is there at once, its parts rise in turn and land within 0.6 s; a change of scope or period plays nothing', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await expect(page.getByRole('heading', { level: 1, name: 'Khách hàng' })).toBeVisible();
  await nav(page, 'Tổng quan').click();
  // Tổng quan has nine parts: the tile of the appointments, six KPI, two blocks.
  const parts = await movesWhen(page, 'main [data-rise]', 'main [data-rise]');
  expect(parts).toEqual(
    [0, 1, 2, 3, 4, 5, 6, 7, 7].map((step) => [
      { ...RISE, start: step * 28, end: step * 28 + 400 },
    ]),
  );
  expect(Math.max(...parts.flat().map((move) => move.end))).toBeLessThanOrEqual(600);
  // The name of the screen with the first part, the line under it 40 ms later.
  const [name, sub] = await movesWhen(page, 'h1[data-rise]', 'h1, [data-slot="screen-sub"]');
  expect(name).toEqual([{ ...RISE, start: 0, end: 400 }]);
  expect(sub).toEqual([{ ...RISE, start: 40, end: 440 }]);
  await expect(page.locator('main [data-rise]')).toHaveCount(0);

  await pickScope(page, 'teams');
  expect(await risesNow(page)).toBe(0);
  await periodPill(page).getByRole('button', { name: 'Kỳ trước' }).click();
  await expect(page.locator('main [data-rise]')).toHaveCount(0);
  expect(await risesNow(page)).toBe(0);
});

test('the pill of the sidebar and the thumb of a segmented control glide to their place; the pointer over a card or a button moves nothing', async ({
  page,
}) => {
  await page.goto('/#/overview');
  await nav(page, 'Khách hàng').click();
  // From the item above, by the snappy spring: it starts where the pill of Tổng quan was.
  const [pill] = (
    await movesWhen(
      page,
      '[aria-current="page"][href="#/customers"]',
      '[aria-current="page"] [data-slot="nav-pill"]',
    )
  ).flat();
  expect(pill).toMatchObject({ name: 'glide', start: 0, end: 400 });
  expect(pill?.from?.transform).toMatch(/^translate\(0px, -\d+(\.\d+)?px\)$/);
  /** The moves of `box` that move it: a change of colour under the pointer is not one. */
  const glides = (box: Locator) =>
    box.evaluate(
      (node) =>
        node
          .getAnimations()
          .filter(
            (move) =>
              move instanceof CSSAnimation ||
              (move as CSSTransition).transitionProperty === 'transform',
          ).length,
    );
  await expect
    .poll(() => glides(nav(page, 'Khách hàng').locator('[data-slot="nav-pill"]')))
    .toBe(0);
  await expect(nav(page, 'Khách hàng').locator('[data-slot="nav-pill"]')).toHaveCSS(
    'transform',
    'none',
  );

  const view = page.getByRole('radiogroup', { name: 'Cách xem' });
  const card = page.locator('main a[href^="#/customers/"]').first();
  await card.hover();
  await expect(card).toHaveCSS('transform', 'none');
  expect(await glides(card)).toBe(0);
  await view.getByRole('radio', { name: 'Bảng' }).click();
  const [thumb] = (
    await movesWhen(
      page,
      '[role="radio"][aria-checked="true"] [data-slot="thumb"]',
      '[role="radio"][aria-checked="true"] [data-slot="thumb"]',
    )
  ).flat();
  expect(thumb).toMatchObject({ name: 'glide', start: 0, end: 400 });
  expect(thumb?.from?.transform).toMatch(/^translate\(-?\d+(\.\d+)?px(, 0px)?\)$/);
  const add = page.getByRole('button', { name: '+ Khách hàng' });
  await add.hover();
  await expect(add).toHaveCSS('transform', 'none');
});

test('a dialog comes as its system brings one and goes in --t-1; focus, Esc and Hủy work as before', async ({
  page,
}) => {
  await page.goto('/#/customers');
  const add = page.getByRole('button', { name: '+ Khách hàng' });
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  const opened = () => movesWhen(page, 'dialog[open]', 'dialog[open]');
  const COPY = 'dialog[popover][data-state="closing"]';

  // macOS: a sheet that drops from under the toolbar.
  await markOs(page, 'mac');
  // By the keyboard on macOS: a click there gives the button no focus to come back to.
  await pressButton(add);
  expect((await opened())[0]).toEqual([
    { name: 'appear', start: 0, end: 220, from: { opacity: '0' } },
    { name: 'arrive', start: 0, end: 400, from: { transform: 'translateY(-36px) scale(0.98)' } },
  ]);
  const left = await nextMove(page, 'leave');
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(add).toBeFocused();
  // What stays for the move out is a copy that takes nothing and no screen reader reads.
  expect(await left()).toEqual({
    name: 'leave',
    start: 0,
    end: 120,
    to: { opacity: '0', transform: 'translateY(-36px) scale(0.98)' },
    on: 'dialog',
  });
  await expect(page.locator(COPY)).toHaveCount(0);

  // Windows 11: it grows in the middle of the window.
  await markOs(page, 'win');
  // By the keyboard on macOS: a click there gives the button no focus to come back to.
  await pressButton(add);
  expect((await opened())[0]?.[1]).toEqual({
    name: 'arrive',
    start: 0,
    end: 400,
    from: { transform: 'translateY(0px) scale(0.94)' },
  });
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(add).toBeFocused();
  await expect(page.locator(COPY)).toHaveCount(0);
});

test('a menu comes 6 px from its pill and goes in --t-1, the focus back on its pill; opened again as it goes, it stays', async ({
  page,
}) => {
  await page.goto('/#/overview');
  await scopePill(page).click();
  const [menu] = await movesWhen(page, '[role="menu"]', '[role="menu"]');
  expect(menu).toEqual([
    { name: 'appear', start: 0, end: 220, from: { opacity: '0' } },
    { name: 'arrive', start: 0, end: 400, from: { transform: 'translateY(-6px) scale(0.98)' } },
  ]);
  const left = await nextMove(page, 'leave');
  await page.keyboard.press('Escape');
  await expect(scopePill(page)).toBeFocused();
  expect(await left()).toEqual({
    name: 'leave',
    start: 0,
    end: 120,
    to: { opacity: '0', transform: 'translateY(-6px) scale(0.98)' },
    on: 'menu',
  });
  await expect(page.locator('[role="menu"]')).toHaveCount(0);

  // A click on the pill while the menu goes opens it again.
  await scopePill(page).click();
  await expect(scopeMenu(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await scopePill(page).click();
  await expect(page.locator('[role="menu"]')).toHaveAttribute('data-state', 'open');
});

test('a toast rises from the bottom edge by the bouncy spring, and leaves in --t-2', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await page.getByRole('button', { name: 'Che tên khách hàng' }).click();
  const [toast] = await movesWhen(page, `${TOASTS} > *`, `${TOASTS} > *`);
  expect(toast).toEqual([
    { name: 'appear', start: 0, end: 220, from: { opacity: '0' } },
    { name: 'arrive', start: 0, end: 600, from: { transform: 'translateY(24px) scale(0.96)' } },
  ]);
  // The rise by the bouncy spring: the curve of the token, as the page reads it.
  const curves = await page.evaluate((toasts) => {
    const probe = document.createElement('div');
    probe.style.animationTimingFunction = 'var(--spring-bouncy)';
    document.body.append(probe);
    const bouncy = getComputedStyle(probe).animationTimingFunction;
    probe.remove();
    const shown = document.querySelector(toasts)!;
    return { bouncy, shown: getComputedStyle(shown).animationTimingFunction };
  }, `${TOASTS} > *`);
  expect(curves.bouncy).toMatch(/^linear\(/);
  expect(curves.shown.endsWith(`, ${curves.bouncy}`)).toBe(true);

  // It leaves after 4.2 s, out of the live region.
  const left = await nextMove(page, 'leave');
  expect(await left()).toEqual({
    name: 'leave',
    start: 0,
    end: 220,
    to: { opacity: '0', transform: 'translateY(24px) scale(0.96)' },
    on: 'div',
  });
  await expect(page.locator(TOASTS)).toBeEmpty();
  await expect(page.locator('[data-state="closing"]')).toHaveCount(0);
});

test('a tick lands by the bouncy spring in --t-3', async ({ page }) => {
  const box = await nextBookingBox(page);
  expect(await tick(box)).toEqual({
    checked: true,
    moves: [{ on: '::after', duration: 400, bouncy: true }],
  });
});

test.describe('under "Giảm chuyển động"', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing moves: a screen is there whole, the pill jumps, layers show and go at once; colours still change and the focus ring stays', async ({
    page,
  }) => {
    const moving = (select: string) =>
      page.evaluate(
        (select) =>
          [...document.querySelectorAll(select)].flatMap((node) =>
            node
              .getAnimations({ subtree: true })
              .filter((move) => move instanceof CSSAnimation)
              .map((move) => move.animationName),
          ),
        select,
      );
    await page.goto('/#/customers');
    await nav(page, 'Tổng quan').click();
    await expect(page.getByRole('heading', { level: 1, name: 'Tổng quan' })).toBeFocused();
    expect(await moving('main, header, nav')).toEqual([]);
    const shifted = await page.evaluate(() =>
      [...document.querySelectorAll('main .card, main [data-part]')].filter(
        (part) => getComputedStyle(part).transform !== 'none',
      ),
    );
    expect(shifted).toEqual([]);

    await scopePill(page).click();
    await expect(scopeMenu(page)).toBeVisible();
    expect(await moving('[role="menu"]')).toEqual([]);
    await page.keyboard.press('Escape');
    // Gone at once: no menu on its way out.
    expect(await page.locator('[role="menu"]').count()).toBe(0);

    await page.getByRole('button', { name: 'Che tên khách hàng' }).click();
    await expect(page.locator(TOASTS)).toContainText('Đang che tên khách hàng');
    expect(await moving(TOASTS)).toEqual([]);

    await nav(page, 'Khách hàng').click();
    await page.getByRole('button', { name: '+ Khách hàng' }).click();
    const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
    await expect(dialog).toBeVisible();
    expect(await moving('dialog')).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    // No copy on its way out.
    expect(await page.locator('dialog').count()).toBe(0);

    // The pointer still lights an item; the keyboard still rings what it reaches.
    const other = nav(page, 'Lịch hẹn');
    const unlit = await other.evaluate((node) => getComputedStyle(node).backgroundColor);
    await other.hover();
    await expect(other).not.toHaveCSS('background-color', unlit);
    await nav(page, 'Khách hàng').focus();
    await page.keyboard.press(tabKey(page));
    await expect(nav(page, 'Báo cáo')).toBeFocused();
    await expect(nav(page, 'Báo cáo')).toHaveCSS('outline-style', 'solid');
  });

  test('a tick is there at once', async ({ page }) => {
    const box = await nextBookingBox(page);
    expect(await tick(box)).toEqual({ checked: true, moves: [] });
    // Its whole size at once, no transition to wait for.
    expect(await box.evaluate((node) => getComputedStyle(node, '::after').transform)).not.toBe(
      'matrix(0, 0, 0, 0, 0, 0)',
    );
  });
});
