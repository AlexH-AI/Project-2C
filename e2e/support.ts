import { createRequire } from 'node:module';
import {
  expect,
  type ConsoleMessage,
  type Download,
  type Locator,
  type Page,
} from '@playwright/test';
import type ExcelJS from '../apps/desktop/node_modules/exceljs';

// ExcelJS is a dependency of the app only; read it from there rather than add it to the root.
const excel = createRequire(new URL('../apps/desktop/package.json', import.meta.url))(
  'exceljs',
) as typeof ExcelJS;

/** Opens a downloaded `.xlsx` the way Excel would: a damaged file fails here. */
export async function readWorkbook(download: Download): Promise<ExcelJS.Workbook> {
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(await download.path());
  return workbook;
}

/**
 * The lowest WCAG contrast of the text shown in `area`, each against what is painted behind it,
 * through the opacity of every block on the way (ADR-0013: at least 4,5:1; DR6-21). A material
 * painted as a gradient (a card) counts at its lightest stop. Disabled
 * controls are left out, as in WCAG. With `of: 'border'`, the lower contrast of the border of
 * `area` with the colours either side of it: its own background inside, what is behind it outside
 * (WCAG 1.4.11: at least 3:1; T-284). The border is the bottom edge: a field of Windows 11 carries
 * its weight there, its other edges a hairline (VA2); on macOS the four are one. A colour that is
 * changing (the 120 ms of a control under the pointer) is read once it has settled. Colors are read as the browser paints them, alpha included,
 * whatever their syntax (`oklab(…)`, `color(srgb …)` of Tailwind's `bg-x/10`).
 */
export function lowestContrast(area: Locator, of: 'text' | 'border' = 'text'): Promise<number> {
  return area.evaluate(async (root, of) => {
    // A control changes its light in --t-1 (VA2), a button that becomes the primary one too: the
    // colours are read once they have settled, not halfway between two states.
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation instanceof CSSTransition)
        .map((animation) => animation.finished.catch(() => {})),
    );
    type Paint = { rgb: number[]; a: number };
    const context = document
      .createElement('canvas')
      .getContext('2d', { willReadFrequently: true })!;
    const read = (color: string): Paint => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [r = 0, g = 0, b = 0, a = 0] = context.getImageData(0, 0, 1, 1).data;
      return { rgb: [r, g, b], a: a / 255 };
    };
    // `top` painted over `under`; either may let what is below show through.
    const over = (top: Paint, under: Paint): Paint => {
      const a = top.a + under.a * (1 - top.a);
      const rgb = top.rgb.map(
        (value, index) => (value * top.a + under.rgb[index]! * under.a * (1 - top.a)) / (a || 1),
      );
      return { rgb, a };
    };
    // What the blocks of `chain` paint from `from` on, then the colour `top` reads off the last one
    // (its text, its border): a block with an opacity paints its group first, then fades it as a
    // whole over what is below.
    type Top = (style: CSSStyleDeclaration) => string;
    /** A colour stop of a gradient, as the browser writes a computed `background-image`. */
    const STOP = /(?:rgba?|color|oklab|oklch|lab|lch|hsla?)\([^()]*\)/g;
    const paint = (chain: Element[], from: number, top?: Top): Paint => {
      let color: Paint = { rgb: [0, 0, 0], a: 0 };
      for (let index = from; index < chain.length; index++) {
        const style = getComputedStyle(chain[index]!);
        const opacity = Number(style.opacity);
        if (index > from && opacity < 1) {
          const group = paint(chain, index, top);
          return over({ ...group, a: group.a * opacity }, color);
        }
        color = over(read(style.backgroundColor), color);
        // A material is a gradient of see-through light (--mat-card): read where it is lightest,
        // the place its text stands out least (ADR-0013 appendix 11/11/2026 §7). Each stop lies on
        // what is under the material, not on the stop before it.
        const under = color;
        for (const stop of style.backgroundImage.match(STOP) ?? []) {
          const lit = over(read(stop), under);
          if (luminance(lit) > luminance(color)) color = lit;
        }
      }
      return top ? over(read(top(getComputedStyle(chain.at(-1)!))), color) : color;
    };
    const page: Paint = { rgb: [255, 255, 255], a: 1 };
    const luminance = (painted: Paint) => {
      const [r = 0, g = 0, b = 0] = over(painted, page).rgb.map((value) => {
        const c = value / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a: Paint, b: Paint) => {
      const [light = 0, dark = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (light + 0.05) / (dark + 0.05);
    };
    const chainTo = (element: Element) => {
      const chain: Element[] = [];
      for (let node: Element | null = element; node; node = node.parentElement) chain.unshift(node);
      return chain;
    };
    if (of === 'border') {
      const chain = chainTo(root);
      const border = paint(chain, 0, (style) => style.borderBottomColor);
      return Math.min(
        contrast(border, paint(chain, 0)),
        contrast(border, paint(chain.slice(0, -1), 0)),
      );
    }
    let lowest = Infinity;
    for (const element of [root, ...root.querySelectorAll('*')]) {
      const text = [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      );
      if (!text || !element.checkVisibility() || element.closest(':disabled')) continue;
      const chain = chainTo(element);
      lowest = Math.min(
        lowest,
        contrast(
          paint(chain, 0, (style) => style.color),
          paint(chain, 0),
        ),
      );
    }
    return lowest;
  }, of);
}

/** The value of a token of `tokens.css` as the page has it now. */
export const token = (page: Page, name: string) =>
  page.evaluate((name) => getComputedStyle(document.documentElement).getPropertyValue(name), name);

/**
 * Sets the system's "Giảm độ trong suốt" for the page (`prefers-reduced-transparency`). Playwright
 * has no option for it and gives it no default, so a page reads the setting of the machine of the
 * run: a test of a see-through material first says `no-preference` (L194). Through CDP, so on
 * Chromium only: false where it could not be set.
 */
export async function setTransparency(page: Page, value: 'no-preference' | 'reduce') {
  if (onWebKit(page)) return false;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-transparency', value }],
  });
  return true;
}

/** Marks the page as one of `os`, as `main.tsx` does once: its tokens are those of that system. */
export const markOs = (page: Page, os: 'mac' | 'win') =>
  page.evaluate((os) => void (document.documentElement.dataset.os = os), os);

/**
 * The radius a corner of the nominal radii given is drawn with on the system the page is marked
 * with: Windows 11 draws a circular arc of that radius; macOS a continuous corner in a box of
 * r × 1.5, or a circular arc of radius r in a web view without `corner-shape` (tokens.css).
 */
export async function drawnCorner(page: Page, nominal: { win: number; mac: number }) {
  if ((await page.locator('html').getAttribute('data-os')) === 'win') return `${nominal.win}px`;
  const continuous = await page.evaluate(() => CSS.supports('corner-shape: superellipse(1.7)'));
  return `${nominal.mac * (continuous ? 1.5 : 1)}px`;
}

/** Where the right edge of `box` is in the window. */
export const right = (box: Locator) => box.evaluate((node) => node.getBoundingClientRect().right);

/** `box` scrolls sideways: something of it is past its edge, text included. */
export const scrolls = (box: Locator) =>
  box.evaluate((node) => node.scrollWidth > node.clientWidth);

/**
 * What pushes the page sideways: when it scrolls sideways, the elements whose box, or what shows
 * out of it (a word that does not break), ends past the window, with that right edge, the deepest
 * last (WebKit, Mac-7); nothing when it does not. A test expects `[]`, and a page that scrolls
 * names what pushes it. What a box that clips or scrolls sideways holds is left out: it is past the
 * window and pushes nothing, as the cells of a table kept for screen readers in a box of one pixel
 * (run 44210407647 named only those).
 */
export const pastTheWindow = (page: Page) =>
  page.evaluate(() => {
    const width = document.documentElement.scrollWidth;
    if (width <= window.innerWidth) return [];
    // Up the boxes that hold `node`: one out of the flow (absolute) is held by the first positioned
    // box above it, not by those between; a fixed one by the window.
    const clipped = (node: Element) => {
      let position = getComputedStyle(node).position;
      for (let box = node.parentElement; box && position !== 'fixed'; box = box.parentElement) {
        const style = getComputedStyle(box);
        if (position === 'absolute' && style.position === 'static') continue;
        if (style.overflowX !== 'visible') return true;
        position = style.position;
      }
      return false;
    };
    const past = [...document.body.querySelectorAll('*')].flatMap((node) => {
      const box = node.getBoundingClientRect();
      const shows = getComputedStyle(node).overflowX === 'visible';
      const edge = Math.round(shows ? Math.max(box.right, box.left + node.scrollWidth) : box.right);
      if (edge <= window.innerWidth || clipped(node)) return [];
      const text = (node.getAttribute('aria-label') ?? node.textContent ?? '').slice(0, 40);
      const kind = `${node.tagName.toLowerCase()}.${node.getAttribute('class') ?? ''}`;
      return [`${kind} "${text}" ends at ${edge}px`];
    });
    return past.length > 0 ? past.slice(-12) : [`the page, ${width}px wide`];
  });

/**
 * The link to the seeded customer `name` in the table of Khách hàng, "Hiện thêm" clicked until it
 * shows.
 */
export async function seededCustomer(page: Page, name: string): Promise<Locator> {
  await page.goto('/#/customers');
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const link = page.getByRole('link', { name, exact: true });
  const more = page.getByRole('button', { name: /^Hiện thêm/ });
  while (!(await link.isVisible())) await more.click();
  return link;
}

/** Opens the profile of the customer of a past met appointment; returns its name. */
export async function openProfile(page: Page): Promise<string> {
  await page.goto('/#/appointments');
  // Yesterday's day alone (the e2e day is the demo anchor), so the met ones are shown (T-150).
  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Ngày' })
    .click();
  await page.getByRole('button', { name: 'Kỳ trước' }).click();
  const list = page.getByRole('table', { name: 'Danh sách lịch hẹn' });
  const met = list.locator('tbody tr').filter({ hasText: 'Đã gặp' }).first();
  const name = (await met.getByRole('button').textContent()) ?? '';
  await met.getByRole('button').click();
  await page.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  // Exact: the detail's heading "date · name" is still up until the profile renders (T-262).
  await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();
  return name;
}

/** The pill of the scope on the toolbar; its name says the scope shown ("Góc nhìn: Toàn bộ"). */
export const scopePill = (page: Page) => page.getByRole('button', { name: /^Góc nhìn: / });

/** The menu the pill of the scope opens. */
export const scopeMenu = (page: Page) => page.getByRole('menu', { name: 'Góc nhìn' });

/** The row of the team `name` in the menu of the scope: it opens the rows of the team. */
export const teamRow = (page: Page, name: string) =>
  scopeMenu(page)
    .getByRole('menuitem')
    .filter({ has: page.getByText(`Team ${name}`, { exact: true }) });

/**
 * Sets the scope in the menu of the toolbar: everyone (`all`); every team together, on Tổng quan
 * (`teams`); the whole team `team`, or its RM `rm`.
 */
export async function pickScope(
  page: Page,
  scope: 'all' | 'teams' | { team: string; rm?: string },
) {
  const menu = scopeMenu(page);
  await scopePill(page).click();
  if (typeof scope === 'string') {
    const name = scope === 'all' ? 'Toàn bộ' : 'Mọi team';
    await menu.getByRole('menuitemradio', { name, exact: true }).click();
  } else {
    const row = teamRow(page, scope.team);
    if ((await row.getAttribute('aria-expanded')) !== 'true') await row.click();
    await menu.getByRole('menuitemradio', { name: scope.rm ?? 'Cả team', exact: true }).click();
  }
  await expect(menu).toBeHidden();
}

/**
 * Sets the scope to the first RM by name of the team `team`. One team is open at a time, so the
 * rows of the choice are "Toàn bộ", then "Cả team" ("Mọi team" on Tổng quan), then its RM.
 */
export async function pickFirstRm(page: Page, team = 'Bình Minh') {
  const menu = scopeMenu(page);
  await scopePill(page).click();
  const row = teamRow(page, team);
  if ((await row.getAttribute('aria-expanded')) !== 'true') await row.click();
  await menu.getByRole('menuitemradio').nth(2).click();
  await expect(menu).toBeHidden();
}

/** The line under the name of the screen, on the toolbar. */
export const screenSub = (page: Page) => page.getByRole('banner').getByRole('paragraph');

/** The page runs on Playwright's WebKit: the `webkit` project, on a Mac (Mac-7). */
const onWebKit = (page: Page) => page.context().browser()?.browserType().name() === 'webkit';

/**
 * The key that moves the focus on to the next control of any kind (`Shift+` before it: back). Tab
 * on Windows. On macOS Tab alone reaches only text fields and lists unless Keyboard navigation is
 * on, and Option+Tab reaches every control, buttons and links too (WebKit, as Safari; Mac-7).
 */
export const tabKey = (page: Page) => (onWebKit(page) ? 'Alt+Tab' : 'Tab');

/** The keys that put the caret at the end of a text field: Ctrl+End on Windows, ⌘↓ on macOS. */
export const endKey = (page: Page) => (onWebKit(page) ? 'Meta+ArrowDown' : 'Control+End');

/**
 * Presses `button` as a person who goes on from it with the keyboard. A click on Windows, which
 * gives the button the focus. On macOS a click gives a button no focus (WebKit, as Safari), so
 * there it is the keyboard's way: the focus on it, then Enter (Mac-7).
 */
export async function pressButton(button: Locator) {
  if (onWebKit(button.page())) await button.press('Enter');
  else await button.click();
}

/**
 * Opens the screen at `path` (`/#/…`) as `page.goto` does on Chromium: a page already at that
 * address stays as it is. WebKit loads such a page again, which drops the web build's data, kept in
 * memory only (Mac-7).
 */
export async function gotoScreen(page: Page, path: string) {
  const here = page.url();
  if (!URL.canParse(path, here) || new URL(path, here).href !== here) await page.goto(path);
}

/**
 * A file of the e2e server that the server refused to connect for, as Edge logs it. On the Windows
 * runner the server now and then refuses one connection of the burst a page load makes, on the
 * address it answers the others on (L154: CI runs 43639871899, 43599601497). Only that line of the
 * server's own files is left out: a file of another server refused, or any other error, still is.
 */
const refusedByServer = (message: ConsoleMessage, page: Page) =>
  message.text() === 'Failed to load resource: net::ERR_CONNECTION_REFUSED' &&
  URL.canParse(message.location().url) &&
  new URL(message.location().url).origin === new URL(page.url()).origin;

/**
 * Collects console errors and uncaught page errors; the returned array fills as they happen. A file
 * of the e2e server refused once is not one (`refusedByServer`).
 */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !refusedByServer(message, page)) errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

/**
 * Runs the web build as the exe: a stand-in for Tauri's IPC (`isTauri()`, `invoke`, events) whose
 * file and AI commands the test steers through `window.exe`. A new database seeds as on a first
 * start. The AI commands keep the key in memory, as Rust keeps it out of the webview.
 */
export async function asExe(page: Page) {
  await page.addInitScript(() => {
    const callbacks = new Map<number, (event: unknown) => unknown>();
    let nextId = 1;
    let closeHandler: number | undefined;
    let backupGate: Promise<void> | undefined;
    let releaseBackup = () => {};
    let saveGate: Promise<void> | undefined;
    let releaseSaves = () => {};
    let aiGate: Promise<void> | undefined;
    let releaseAi = () => {};
    let key: string | null = null;
    const exe = {
      failSaves: false as boolean | string,
      destroyed: false,
      events: [] as string[],
      title: null as string | null,
      aiCalls: [] as Record<string, unknown>[],
      keysSet: [] as string[],
      aiError: null as Record<string, unknown> | null,
      aiContent: 'OK',
      aiAnswers: [] as string[],
      exports: [] as string[],
      chatGptOpened: 0,
      folders: [] as string[],
      failFolders: false,
      holdBackup() {
        backupGate = new Promise((resolve) => (releaseBackup = resolve));
      },
      releaseBackup: () => releaseBackup(),
      holdSaves() {
        saveGate = new Promise((resolve) => (releaseSaves = resolve));
      },
      releaseSaves: () => releaseSaves(),
      holdAi() {
        aiGate = new Promise((resolve) => (releaseAi = resolve));
      },
      releaseAi: () => releaseAi(),
      requestClose() {
        if (closeHandler === undefined) throw new Error('no close listener');
        void callbacks.get(closeHandler)?.({ event: 'tauri://close-requested', id: 1 });
      },
    };
    const commands: Record<string, (args: Record<string, unknown>) => unknown> = {
      db_open: () => new ArrayBuffer(0),
      db_save: async () => {
        await saveGate;
        // Rust rejects with the message of the error: a code it tells apart, or Windows' own.
        if (exe.failSaves === true) throw 'Access is denied. (os error 5)';
        if (exe.failSaves) throw exe.failSaves;
        exe.events.push('save');
        return null;
      },
      db_backup: async () => {
        await backupGate;
        exe.events.push('backup');
        return 'project2c-20260915-0930.db';
      },
      db_latest_backup: () => null,
      // The folder of a portable exe, as export_write's path below.
      data_folder: () => 'C:\\Project2C-data',
      export_write: (args) => {
        exe.exports.push(new TextDecoder().decode(args as unknown as Uint8Array));
        return 'C:\\Project2C-data\\exports\\export.p2cbackup';
      },
      ai_key_status: () => key !== null,
      ai_key_set: (args) => {
        key = args.key as string;
        exe.keysSet.push(key);
        return null;
      },
      open_chatgpt: () => {
        exe.chatGptOpened++;
        return null;
      },
      // The one command of lib.rs the app calls that the stand-in lacked (WBR6-F1).
      open_folder: (args) => {
        if (exe.failFolders) throw 'The system cannot find the file specified. (os error 2)';
        exe.folders.push(args.kind as string);
        return null;
      },
      ai_key_delete: () => {
        key = null;
        return null;
      },
      ai_complete: async (args) => {
        exe.aiCalls.push(args);
        await aiGate;
        if (exe.aiError) throw exe.aiError;
        const content = exe.aiAnswers.shift() ?? exe.aiContent;
        return { content, promptTokens: 9, completionTokens: 1 };
      },
      'plugin:event|listen': (args) => {
        if (args.event === 'tauri://close-requested') closeHandler = args.handler as number;
        return nextId++;
      },
      'plugin:event|unlisten': () => null,
      'plugin:window|destroy': () => {
        exe.destroyed = true;
        exe.events.push('destroy');
        return null;
      },
      'plugin:window|set_title': (args) => {
        exe.title = args.value as string;
        return null;
      },
    };
    Object.assign(window, {
      exe,
      isTauri: true,
      __TAURI_EVENT_PLUGIN_INTERNALS__: { unregisterListener() {} },
      __TAURI_INTERNALS__: {
        metadata: { currentWindow: { label: 'main' }, currentWebview: { label: 'main' } },
        transformCallback(callback: (event: unknown) => unknown) {
          const id = nextId++;
          callbacks.set(id, callback);
          return id;
        },
        async invoke(command: string, args: Record<string, unknown>) {
          const run = commands[command];
          if (!run) throw new Error(`unexpected command ${command}`);
          return run(args);
        },
      },
    });
  });
}

interface Exe {
  /**
   * While set, `db_save` fails with what Rust sends: a code of `storage.rs` (`'DISK_FULL'`,
   * `'READ_ONLY'`, `'FOLDER_READ_ONLY'`), or Windows' own message for `true`, as when another
   * program holds the file.
   */
  failSaves: boolean | string;
  destroyed: boolean;
  /** In order: each `save` and `backup` that succeeded, and the `destroy` of the window. */
  events: string[];
  /** The title bar, as the last `setTitle` named the window; `null` until then. */
  title: string | null;
  /** The arguments of each `ai_complete`. */
  aiCalls: Record<string, unknown>[];
  /** Every key `ai_key_set` got. */
  keysSet: string[];
  /** What `ai_complete` rejects with, as Rust would; `null` answers `aiContent`. */
  aiError: Record<string, unknown> | null;
  /** What `ai_complete` answers: "OK" (no JSON) unless the test sets it. */
  aiContent: string;
  /** The answers of the next `ai_complete` calls, one per call, in order; then `aiContent`. */
  aiAnswers: string[];
  /** The text of each file `export_write` got, as a backup exported. */
  exports: string[];
  /** How many times `open_chatgpt` opened chatgpt.com in the browser. */
  chatGptOpened: number;
  /** The `kind` of each folder `open_folder` showed in Explorer: `backups`, `exports`. */
  folders: string[];
  /** While set, `open_folder` fails with what Rust sends when Explorer does not start. */
  failFolders: boolean;
  holdBackup(): void;
  releaseBackup(): void;
  /** Holds every `db_save` until `releaseSaves`, as a slow disk would; `failSaves` is read then. */
  holdSaves(): void;
  releaseSaves(): void;
  /** Holds every `ai_complete` until `releaseAi`, as a request still running in Rust. */
  holdAi(): void;
  releaseAi(): void;
  requestClose(): void;
}
declare global {
  interface Window {
    exe: Exe;
  }
}

/**
 * A new customer born in 1984, opened on its profile; `rm` is the label of its RM in the picker,
 * the first RM when left out.
 */
export async function createKycCustomer(page: Page, name: string, rm?: string) {
  await gotoScreen(page, '/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(name);
  await dialog
    .getByRole('combobox', { name: 'RM phụ trách' })
    .selectOption(rm === undefined ? { index: 1 } : { label: rm });
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole('link', { name: new RegExp(name) }).click();
}

/** One KYC note confirming `facts` (trường label, value); `conflict` marks them as conflicts. */
export async function addKycNote(
  page: Page,
  name: string,
  facts: readonly (readonly [string, string])[],
  conflict = false,
) {
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${name}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Gặp KH');
  for (const [field, value] of facts) {
    await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: field });
    await dialog.getByRole('textbox', { name: 'Giá trị' }).fill(value);
    if (conflict) await dialog.getByRole('radio', { name: /Đánh dấu mâu thuẫn/ }).check();
    await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  }
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();
}

export const panelOf = (page: Page) => page.getByRole('region', { name: 'KYC Intelligence' });

/**
 * Settings → AI on OpenCode, through the exe's stand-in, which answers "OK" (no JSON) unless told
 * otherwise; then back to the page before, without a reload that would drop the data.
 */
export async function useOpenCode(page: Page) {
  await page.getByRole('link', { name: 'Cài đặt' }).click();
  await page
    .getByRole('navigation', { name: 'Mục cài đặt' })
    .getByRole('button', { name: 'AI' })
    .click();
  await page
    .getByRole('radiogroup', { name: 'Provider' })
    .getByRole('radio', { name: 'OpenCode' })
    .check();
  await page.goBack();
}

/**
 * A discovery output that passes for a customer of the facts F1–F5 (birth year, gender and the
 * three facts of `discoveryFacts`); `text` replaces the text of its hypothesis.
 */
export function discoveryOutput(text = 'Khách hàng sẵn lòng chia sẻ về gia đình') {
  return JSON.stringify({
    hypotheses: [{ text, evidence: ['F1', 'F2'] }],
    discoveryStrategy: [
      { text: 'Hỏi thêm về điều khách hàng quan tâm', evidence: ['F3'] },
      { text: 'Hỏi sâu thêm về công việc', evidence: ['F5'] },
    ],
    nextBestActions: [{ text: 'Hẹn buổi gặp tiếp để tìm hiểu thêm', evidence: ['F1'] }],
    personalityNotes: [],
  });
}

/** The facts of a KYC note that let a customer of `createKycCustomer` through in discovery. */
export const discoveryFacts = [
  ['Tình trạng hôn nhân', 'Đã kết hôn'],
  ['Số con', '2'],
  ['Nghề nghiệp', 'Bác sĩ'],
] as const;

/**
 * ChatGPT web with no network: `window.open` and the clipboard are recorded in `window.web`.
 * `holdCopy` keeps each copy asked for meanwhile waiting until `settleCopies`.
 */
export async function stubChatGptWeb(page: Page) {
  await page.addInitScript(() => {
    const held: ((copied: boolean) => void)[] = [];
    const web = {
      copied: [] as string[],
      opened: [] as unknown[][],
      failCopy: false,
      breakCopy: false,
      holdCopy: false,
      waiting: () => held.length,
      settleCopies: (copied: boolean) => held.splice(0).forEach((settle) => settle(copied)),
    };
    Object.assign(window, { web });
    window.open = (...args: unknown[]) => {
      web.opened.push(args);
      return null;
    };
    navigator.clipboard.writeText = (text: string) => {
      // A bug of the app, not a refusal: the click fails as a whole.
      if (web.breakCopy) throw new TypeError('broken');
      if (web.failCopy) return Promise.reject(new DOMException('denied', 'NotAllowedError'));
      if (!web.holdCopy) {
        web.copied.push(text);
        return Promise.resolve();
      }
      return new Promise<void>((resolve, reject) =>
        held.push((copied) => {
          if (!copied) return reject(new DOMException('denied', 'NotAllowedError'));
          web.copied.push(text);
          resolve();
        }),
      );
    };
  });
}

interface Web {
  /** Each text copied, in order. */
  copied: string[];
  /** The arguments of each `window.open`. */
  opened: unknown[][];
  /** Every copy is refused, as without the clipboard permission. */
  failCopy: boolean;
  /** Every copy throws, as a bug of the app would. */
  breakCopy: boolean;
  /** Copies asked for while true wait for `settleCopies`. */
  holdCopy: boolean;
  /** How many copies wait. */
  waiting(): number;
  /** Ends every copy waiting: copied, or refused. */
  settleCopies(copied: boolean): void;
}
declare global {
  interface Window {
    web: Web;
  }
}
