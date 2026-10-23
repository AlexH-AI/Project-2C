import { createRequire } from 'node:module';
import { expect, type Download, type Locator, type Page } from '@playwright/test';
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
 * through the opacity of every block on the way (ADR-0013: at least 4,5:1; DR6-21). Disabled
 * controls are left out, as in WCAG. Colors are read as the browser paints them, alpha included,
 * whatever their syntax (`oklab(…)`, `color(srgb …)` of Tailwind's `bg-x/10`).
 */
export function lowestContrast(area: Locator): Promise<number> {
  return area.evaluate((root) => {
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
    // What the blocks of `chain` paint from `from` on, the text last: a block with an opacity paints
    // its group first, then fades it as a whole over what is below.
    const paint = (chain: Element[], from: number, text: boolean): Paint => {
      let color: Paint = { rgb: [0, 0, 0], a: 0 };
      for (let index = from; index < chain.length; index++) {
        const style = getComputedStyle(chain[index]!);
        const opacity = Number(style.opacity);
        if (index > from && opacity < 1) {
          const group = paint(chain, index, text);
          return over({ ...group, a: group.a * opacity }, color);
        }
        color = over(read(style.backgroundColor), color);
      }
      return text ? over(read(getComputedStyle(chain.at(-1)!).color), color) : color;
    };
    const page: Paint = { rgb: [255, 255, 255], a: 1 };
    const luminance = (rgb: number[]) => {
      const [r = 0, g = 0, b = 0] = rgb.map((value) => {
        const c = value / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    let lowest = Infinity;
    for (const element of [root, ...root.querySelectorAll('*')]) {
      const text = [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      );
      if (!text || !element.checkVisibility() || element.closest(':disabled')) continue;
      const chain: Element[] = [];
      for (let node: Element | null = element; node; node = node.parentElement) chain.unshift(node);
      const [light, dark] = [paint(chain, 0, true), paint(chain, 0, false)]
        .map((painted) => luminance(over(painted, page).rgb))
        .sort((a, b) => b - a);
      lowest = Math.min(lowest, (light! + 0.05) / (dark! + 0.05));
    }
    return lowest;
  });
}

/** Collects console errors and uncaught page errors; the returned array fills as they happen. */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
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
    let aiGate: Promise<void> | undefined;
    let releaseAi = () => {};
    let key: string | null = null;
    const exe = {
      failSaves: false as boolean | string,
      destroyed: false,
      aiCalls: [] as Record<string, unknown>[],
      keysSet: [] as string[],
      aiError: null as Record<string, unknown> | null,
      aiContent: 'OK',
      aiAnswers: [] as string[],
      exports: [] as string[],
      chatGptOpened: 0,
      holdBackup() {
        backupGate = new Promise((resolve) => (releaseBackup = resolve));
      },
      releaseBackup: () => releaseBackup(),
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
      db_save: () => {
        // Rust rejects with the message of the error: a code it tells apart, or Windows' own.
        if (exe.failSaves === true) throw 'Access is denied. (os error 5)';
        if (exe.failSaves) throw exe.failSaves;
        return null;
      },
      db_backup: async () => {
        await backupGate;
        return 'project2c-20260915-0930.db';
      },
      db_latest_backup: () => null,
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
  holdBackup(): void;
  releaseBackup(): void;
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
 * A new customer born in 1984, opened on its profile; `re` is the label of its RE in the picker,
 * the first RE when left out.
 */
export async function createKycCustomer(page: Page, name: string, re?: string) {
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(name);
  await dialog
    .getByRole('combobox', { name: 'RE phụ trách' })
    .selectOption(re === undefined ? { index: 1 } : { label: re });
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
