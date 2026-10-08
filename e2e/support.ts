import { createRequire } from 'node:module';
import type { Download, Page } from '@playwright/test';
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
      failSaves: false,
      destroyed: false,
      aiCalls: [] as Record<string, unknown>[],
      keysSet: [] as string[],
      aiError: null as Record<string, unknown> | null,
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
        if (exe.failSaves) throw new Error('file locked');
        return null;
      },
      db_backup: async () => {
        await backupGate;
        return 'project2c-20260915-0930.db';
      },
      db_latest_backup: () => null,
      ai_key_status: () => key !== null,
      ai_key_set: (args) => {
        key = args.key as string;
        exe.keysSet.push(key);
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
        return { content: 'OK', promptTokens: 9, completionTokens: 1 };
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
  failSaves: boolean;
  destroyed: boolean;
  /** The arguments of each `ai_complete`. */
  aiCalls: Record<string, unknown>[];
  /** Every key `ai_key_set` got. */
  keysSet: string[];
  /** What `ai_complete` rejects with, as Rust would; `null` answers "OK". */
  aiError: Record<string, unknown> | null;
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
