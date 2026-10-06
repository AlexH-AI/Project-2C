/** Storage port backed by the Rust file commands in `src-tauri` (ADR-0016). */
import type { InvokeArgs, InvokeOptions } from '@tauri-apps/api/core';
import type { StoragePort } from './app-data';

type Invoke = (command: string, args?: InvokeArgs, options?: InvokeOptions) => Promise<unknown>;

/** Carries the export file name; the body is the raw file (`EXPORT_NAME_HEADER` in `lib.rs`). */
const EXPORT_NAME_HEADER = 'x-p2c-file-name';
/** Carries the page a save comes from (`PAGE_HEADER` in `lib.rs`). */
const PAGE_HEADER = 'x-p2c-page';

/** `db_open`'s error when another exe already has the data folder open (`storage::ALREADY_OPEN`). */
export const ALREADY_OPEN = 'ALREADY_OPEN';
/** `db_backup`'s error when the disk is full (`storage::DISK_FULL`). */
export const DISK_FULL = 'DISK_FULL';

/** 128 random bits in hex; `getRandomValues`, unlike `randomUUID`, needs no secure context. */
const newPage = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');

/**
 * @param invoke Tauri's `invoke`.
 * @param timezoneOffset `Date#getTimezoneOffset`; Rust has no time zones, so backup file names get
 *   local time from here.
 * @param page Names this load of the webview. Rust writes only the saves of the page that opened the
 *   file last, so a save still on its way from before a reload never lands over what the new page
 *   read (`STALE_PAGE`).
 */
export function tauriStorage(
  invoke: Invoke,
  timezoneOffset: () => number = () => new Date().getTimezoneOffset(),
  page: string = newPage(),
): StoragePort {
  const local = () => ({ utcOffsetMinutes: -timezoneOffset() });
  return {
    async load() {
      const reply = (await invoke('db_open', { page })) as ArrayBuffer;
      // Rust answers empty only on a first start (no file and no backups); an empty file fails.
      return reply.byteLength === 0 ? undefined : new Uint8Array(reply);
    },
    async save(bytes) {
      await invoke('db_save', bytes, { headers: { [PAGE_HEADER]: page } });
    },
    async backup() {
      return (await invoke('db_backup', local())) as string;
    },
    async writeExport(name, bytes) {
      return (await invoke('export_write', bytes, {
        headers: { [EXPORT_NAME_HEADER]: name },
      })) as string;
    },
    async latestBackup() {
      return ((await invoke('db_latest_backup')) as string | null) ?? undefined;
    },
    async openFolder(kind) {
      await invoke('open_folder', { kind });
    },
  };
}
