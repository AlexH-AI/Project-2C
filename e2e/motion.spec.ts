import { expect, test, type Locator, type Page } from './fixtures';
import {
  gotoScreen,
  markOs,
  periodPill,
  pickFirstRm,
  pickScope,
  pressButton,
  scopeMenu,
  scopePill,
  tabKey,
  teamRow,
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
  /** What it runs on shows, where it has any: the choice of each list, how far it is scrolled. */
  readonly lists?: readonly string[];
  readonly scrolled?: number;
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
        const parts = [...(event.target as Element).querySelectorAll('*')];
        const lists = parts
          .filter((part) => part instanceof HTMLSelectElement)
          .map((list) => list.selectedOptions[0]?.textContent ?? '');
        const scrolled = Math.max(0, ...parts.map((part) => part.scrollTop));
        resolve({
          name,
          start: Number(timing.delay),
          end: Math.round(Number(timing.endTime)),
          to: {
            ...(typeof last?.transform === 'string' && { transform: last.transform }),
            ...(typeof last?.opacity === 'string' && { opacity: last.opacity }),
          },
          on: (event.target as Element).getAttribute('role') ?? (event.target as Element).localName,
          ...(lists.length > 0 && { lists }),
          ...(scrolled > 0 && { scrolled }),
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
  // A list chosen and the body scrolled, in a window too low for the whole dialog.
  const rm = dialog.getByRole('combobox', { name: 'RM phụ trách' });
  const chosen = (await rm.locator('option').allTextContents())[2]!;
  await rm.selectOption({ label: chosen });
  await page.setViewportSize({ width: 1280, height: 480 });
  const scrolled = await dialog.evaluate((node) => {
    const body = [...node.querySelectorAll('*')].find(
      (part) =>
        part.scrollHeight > part.clientHeight && getComputedStyle(part).overflowY === 'auto',
    )!;
    body.scrollTop = body.scrollHeight;
    return body.scrollTop;
  });
  expect(scrolled).toBeGreaterThan(0);
  const left = await nextMove(page, 'leave');
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(add).toBeFocused();
  // What stays for the move out is a copy that takes nothing and no screen reader reads, and shows
  // what the dialog showed as it closed: the list on its choice, the body where it was scrolled.
  expect(await left()).toEqual({
    name: 'leave',
    start: 0,
    end: 120,
    to: { opacity: '0', transform: 'translateY(-36px) scale(0.98)' },
    on: 'dialog',
    lists: expect.arrayContaining([chosen]),
    scrolled,
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

test('a tick lands by the bouncy spring in --t-3; under forced colours the system draws the box', async ({
  page,
  browserName,
}) => {
  const box = await nextBookingBox(page);
  expect(await tick(box)).toEqual({
    checked: true,
    moves: [{ on: '::after', duration: 400, bouncy: true }],
  });
  await test.step('a contrast theme of Windows drops the shadow that edges the box: the system draws it', async (step) => {
    // Forced colours are a theme of Windows, emulated by Playwright on Chromium only.
    step.skip(browserName === 'webkit', 'forced-colors is emulated on Chromium only');
    await page.emulateMedia({ forcedColors: 'active' });
    await expect(box).toHaveCSS('appearance', 'auto');
  });
});

test('the arrow of a team row turns 90° in --t-3 by the snappy spring as it opens (L238)', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await scopePill(page).click();
  const row = teamRow(page, 'Bình Minh');
  const arrow = row.locator('svg');
  await expect(arrow).toHaveCSS('transition-property', 'rotate');
  await expect(arrow).toHaveCSS('transition-duration', '0.4s');
  const opened = (await row.getAttribute('aria-expanded')) === 'true';
  // What turns, heard as it starts (a turn lasts 400 ms only).
  await arrow.evaluate((node) => {
    const turned = new Promise((resolve) =>
      node.addEventListener(
        'transitionrun',
        (event) => resolve((event as TransitionEvent).propertyName),
        {
          once: true,
        },
      ),
    );
    Object.assign(window, { turned });
  });
  await row.click();
  await expect(row).toHaveAttribute('aria-expanded', String(!opened));
  expect(await page.evaluate(() => (window as unknown as { turned: Promise<string> }).turned)).toBe(
    'rotate',
  );
});

test('a press on a control turned off, out of a menu opened by the keyboard, puts the focus back on its pill (L246)', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit',
    "WebKit sends no mouse event to a control turned off, and whether a pointer event reaches a listener there is not checked: Playwright's WebKit runs on the CI Mac only",
  );
  await page.goto('/#/overview');
  // No screen with this menu has a control that stays off: the case adds one, as the review's
  // probe did (PR #1420).
  await page.locator('main').evaluate((main) => {
    const off = document.createElement('button');
    off.disabled = true;
    off.textContent = 'Nút đã khóa';
    main.prepend(off);
  });
  await scopePill(page).focus();
  await page.keyboard.press('Enter');
  await expect(scopeMenu(page).getByRole('menuitemradio').first()).toBeFocused();
  await page.getByRole('button', { name: 'Nút đã khóa' }).click({ force: true });
  await expect(scopeMenu(page)).toHaveCount(0);
  await expect(scopePill(page)).toBeFocused();
});

/**
 * Records, from now on, what each large number of a screen shows (a KPI, the met of "Lịch hẹn")
 * each time it changes, by the name of its tile. A running number is read as the eye sees it, not
 * the new value it tells a screen reader.
 */
async function recordNumbers(page: Page) {
  await page.evaluate(() => {
    const seen: Record<string, string[]> = {};
    const read = () => {
      for (const tile of document.querySelectorAll('main section[aria-label]')) {
        const number = tile.querySelector(':scope > p');
        if (!number) continue;
        const copy = number.cloneNode(true) as Element;
        copy.querySelector('[aria-hidden="true"]')?.nextElementSibling?.remove();
        const text = (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
        const list = (seen[tile.getAttribute('aria-label')!] ??= []);
        if (list.at(-1) !== text) list.push(text);
      }
    };
    read();
    new MutationObserver(read).observe(document.querySelector('main')!, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    (window as unknown as { numbersSeen: typeof seen }).numbersSeen = seen;
  });
  return () =>
    page.evaluate(
      () => (window as unknown as { numbersSeen: Record<string, string[]> }).numbersSeen,
    );
}

const UNITS: Readonly<Record<string, number>> = { K: 1e3, tr: 1e6, tỷ: 1e9 };

/** What a number of a tile reads as: `1.03 tỷ`, `761 tr`, `66.7%`, `1,204`, `12 / 30` (12). */
const amountOf = (text: string) => {
  const [, digits = '', unit = ''] = /^([\d.,]+)\s*(\S*)/.exec(text) ?? [];
  return Number(digits.replace(/,/g, '')) * (UNITS[unit] ?? 1);
};

/** The six KPI of Tổng quan and its tile of appointments. */
const NUMBERS = [
  'Chuyển RF',
  'HĐ nộp',
  'Case size',
  'HĐ phát hành',
  'Doanh số',
  'Tỉ lệ chốt',
  'Lịch hẹn · cả tháng',
];

/**
 * What the large numbers of Tổng quan show once `change` is made and --t-3 is over, by tile, and
 * how many ran (more than one frame). Each one stops on its new value, read in the tile, and no
 * frame is outside the old and the new value.
 */
async function runOf(page: Page, change: () => Promise<void>) {
  const seen = await recordNumbers(page);
  await change();
  await page.waitForTimeout(600);
  const ran = await seen();
  let running = 0;
  for (const name of NUMBERS) {
    const [from, ...frames] = ran[name]!;
    const to = frames.at(-1);
    if (to === undefined) continue;
    // It stops on the value of the new period, read once the run is over.
    await expect(page.getByRole('region', { name }).locator('p').first()).toHaveText(
      new RegExp(`^${to.replace(/[.]/g, '\\.')}`),
    );
    const [low, high] = [amountOf(from!), amountOf(to)].sort((a, b) => a - b);
    for (const frame of frames) {
      expect(amountOf(frame), `${name}: ${ran[name]!.join(' → ')}`).toBeGreaterThanOrEqual(low!);
      expect(amountOf(frame), `${name}: ${ran[name]!.join(' → ')}`).toBeLessThanOrEqual(high!);
    }
    if (frames.length > 1) running += 1;
  }
  return { ran, running };
}

test('a screen opens with its numbers there; a large number runs to its new value in --t-3, never past it (Đếm)', async ({
  page,
}) => {
  await page.goto('/#/customers');
  await expect(page.getByRole('heading', { level: 1, name: 'Khách hàng' })).toBeVisible();
  const seen = await recordNumbers(page);
  await nav(page, 'Tổng quan').click();
  await expect(page.getByRole('region', { name: 'Doanh số' })).toBeVisible();
  await page.waitForTimeout(600);
  // Never counted from 0: each number is there at once, as it stays.
  const opened = await seen();
  for (const name of NUMBERS) expect(opened[name], name).toHaveLength(1);

  // A change of period: the amounts run frame by frame, each frame a compact form of its own.
  const { ran, running } = await runOf(page, () =>
    periodPill(page).getByRole('button', { name: 'Kỳ trước' }).click(),
  );
  expect(ran['Doanh số']!.length, ran['Doanh số']!.join(' → ')).toBeGreaterThan(2);
  expect(
    ran['Doanh số']!.every((frame) => /^\d[\d,]*(\.\d\d?)?( tr| tỷ|K| VNĐ)$/.test(frame)),
  ).toBe(true);
  expect(running).toBeGreaterThan(1);
  // A change of scope (one RM): the screen is not drawn anew, its numbers run too.
  expect((await runOf(page, () => pickFirstRm(page))).running).toBeGreaterThan(0);
});

/**
 * Watches the View Transitions of the page: once a move has drawn its new screen, what it found
 * (`data-open` of <html>, the address, the name of the screen); and, as it starts, the length of
 * the move of the box (Chromium reads it).
 */
async function watchMoves(page: Page) {
  await page.evaluate(() => {
    const log: string[] = [];
    const lengths: number[] = [];
    Object.assign(window, { moves: log, moveLengths: lengths });
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = ((update: () => void) => {
      const move = start(update);
      void move.updateCallbackDone.then(() =>
        log.push(
          `${document.documentElement.dataset.open} ${location.hash} ${document.querySelector('h1')?.textContent}`,
        ),
      );
      void move.ready.then(() =>
        lengths.push(
          ...document
            .getAnimations()
            .filter((one) => (one.effect as KeyframeEffect).pseudoElement?.endsWith('-group(open)'))
            .map((one) => Number(one.effect!.getComputedTiming().duration)),
        ),
      );
      return move;
    }) as typeof document.startViewTransition;
  });
  return () =>
    page.evaluate(() => {
      const { moves, moveLengths } = window as unknown as {
        moves: string[];
        moveLengths: number[];
      };
      return { moves, lengths: moveLengths };
    });
}

/**
 * Khách hàng scrolled down, as chuyen-dong.html `#mo` asks: the board in a window too low for it
 * (1100 × 460), or the table (Bảng) at 1100 × 700. Gives a customer in view (its link), and how far
 * the screen is scrolled.
 */
async function scrolledCard(page: Page, view: 'Kanban' | 'Bảng' = 'Kanban') {
  await page.setViewportSize({ width: 1100, height: view === 'Kanban' ? 460 : 700 });
  await gotoScreen(page, '/#/customers');
  await expect(page.getByRole('heading', { level: 1, name: 'Khách hàng' })).toBeVisible();
  await page
    .getByRole('radiogroup', { name: 'Cách xem' })
    .getByRole('radio', { name: view })
    .click();
  const { href, scroll } = await page.evaluate(
    (down) => {
      window.scrollTo(0, down);
      const card = [...document.querySelectorAll<HTMLElement>('main a[data-open]')].find((link) => {
        const box = link.getBoundingClientRect();
        return box.top > 100 && box.bottom < innerHeight - 20;
      });
      return { href: card?.getAttribute('href') ?? '', scroll: window.scrollY };
    },
    view === 'Kanban' ? 120 : 900,
  );
  expect(scroll).toBeGreaterThan(0);
  expect(href).toMatch(/^#\/customers\//);
  return { card: page.locator(`main a[href="${href}"]`), href, scroll };
}

const scrollOf = (page: Page) => page.evaluate(() => window.scrollY);

test('a card of Khách hàng grows into the profile, which shrinks back to it: the board as far scrolled, the focus on the card (Mở)', async ({
  page,
  browserName,
}) => {
  const { card, href, scroll } = await scrolledCard(page);
  const moved = await watchMoves(page);
  await card.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Hồ sơ khách hàng' })).toBeVisible();
  // The page grown is one block: nothing in it rises.
  expect(await page.locator('main [data-rise]').count()).toBe(0);
  await expect.poll(async () => (await moved()).moves).toEqual([`in ${href} Hồ sơ khách hàng`]);

  await page.getByRole('link', { name: '← Khách hàng' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Khách hàng' })).toBeVisible();
  await expect(card).toBeFocused();
  expect(await scrollOf(page)).toBe(scroll);
  expect(await page.locator('main [data-rise]').count()).toBe(0);
  await expect
    .poll(async () => (await moved()).moves)
    .toEqual([`in ${href} Hồ sơ khách hàng`, 'back #/customers Khách hàng']);

  // From the table (Bảng), the row grows; the way back returns to the table, as far scrolled.
  const row = await scrolledCard(page, 'Bảng');
  await row.card.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Hồ sơ khách hàng' })).toBeVisible();
  await page.getByRole('link', { name: '← Khách hàng' }).click();
  await expect(page.getByRole('radio', { name: 'Bảng' })).toBeChecked();
  await expect(row.card).toBeFocused();
  expect(await scrollOf(page)).toBe(row.scroll);
  await expect.poll(async () => (await moved()).moves).toHaveLength(4);
  expect((await moved()).moves.slice(2)).toEqual([
    `in ${row.href} Hồ sơ khách hàng`,
    'back #/customers Khách hàng',
  ]);
  await test.step('the box grows in --t-3 and shrinks back in --t-2', async (step) => {
    step.skip(browserName === 'webkit', 'the moves of a View Transition are read on Chromium');
    expect((await moved()).lengths).toEqual([400, 220, 400, 220]);
  });
});

test('without View Transitions a card opens the plain way: the profile rises, the way back keeps the scroll', async ({
  page,
}) => {
  await page.addInitScript(() => {
    delete (Document.prototype as { startViewTransition?: unknown }).startViewTransition;
  });
  const { card, scroll } = await scrolledCard(page);
  await card.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Hồ sơ khách hàng' })).toBeVisible();
  await expect(page.locator('main [data-rise]').first()).toBeAttached();
  await page.getByRole('link', { name: '← Khách hàng' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Khách hàng' })).toBeVisible();
  await expect(card).toBeFocused();
  expect(await scrollOf(page)).toBe(scroll);
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
    // The parts are the ones the shell gives a step of "Hiện" (`--rise-step`), all nine of them:
    // none is shifted (L239).
    const parts = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('main *')]
        .filter((part) => part.style.getPropertyValue('--rise-step') !== '')
        .map((part) => getComputedStyle(part).transform),
    );
    expect(parts).toEqual(Array(9).fill('none'));

    await scopePill(page).click();
    await expect(scopeMenu(page)).toBeVisible();
    expect(await moving('[role="menu"]')).toEqual([]);
    // The arrow of a team row turns at once (L238).
    await expect(teamRow(page, 'Bình Minh').locator('svg')).toHaveCSS('transition-duration', '0s');
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

  test('a card opens its profile at once and the way back keeps the scroll; a number changes straight to its value', async ({
    page,
  }) => {
    const { card, scroll } = await scrolledCard(page);
    const started = await page.evaluate(() => {
      const calls: string[] = [];
      Object.assign(window, { started: calls });
      const start = document.startViewTransition.bind(document);
      document.startViewTransition = ((update: () => void) => {
        calls.push(location.hash);
        return start(update);
      }) as typeof document.startViewTransition;
      return calls;
    });
    expect(started).toEqual([]);
    await card.click();
    await expect(page.getByRole('heading', { level: 1, name: 'Hồ sơ khách hàng' })).toBeVisible();
    await page.getByRole('link', { name: '← Khách hàng' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Khách hàng' })).toBeVisible();
    await expect(card).toBeFocused();
    expect(await scrollOf(page)).toBe(scroll);
    expect(await page.evaluate(() => (window as unknown as { started: string[] }).started)).toEqual(
      [],
    );

    await nav(page, 'Tổng quan').click();
    await expect(page.getByRole('region', { name: 'Doanh số' })).toBeVisible();
    const seen = await recordNumbers(page);
    await periodPill(page).getByRole('button', { name: 'Kỳ trước' }).click();
    await page.waitForTimeout(600);
    const ran = await seen();
    expect(ran['Doanh số']).toHaveLength(2);
    for (const name of NUMBERS) expect(ran[name]!.length, name).toBeLessThanOrEqual(2);
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
