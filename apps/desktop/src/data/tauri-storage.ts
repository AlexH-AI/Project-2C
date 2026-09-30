/** Storage port backed by the Rust file commands in `src-tauri` (ADR-0016). */
import type { InvokeArgs, InvokeOptions } from '@tauri-apps/api/core';
import type { StoragePort } from './app-data';

type Invoke = (command: string, args?: InvokeArgs, options?: InvokeOptions) => Promise<unknown>;

/** Carries the export file name; the body is the raw file (`EXPORT_NAME_HEADER` in `lib.rs`). */
const EXPORT_NAME_HEADER = 'x-p2c-file-name';

/**
 * @param invoke Tauri's `invoke`.
 * @param timezoneOffset `Date#getTimezoneOffset`; Rust has no time zones, so backup file names get
 *   local time from here.
 */
export function tauriStorage(
  invoke: Invoke,
  timezoneOffset: () => number = () => new Date().getTimezoneOffset(),
): StoragePort {
  const local = () => ({ utcOffsetMinutes: -timezoneOffset() });
  return {
    async load() {
      const reply = (await invoke('db_open', local())) as ArrayBuffer;
      // Rust answers empty only on a first start (no file and no backups); an empty file fails.
      return reply.byteLength === 0 ? undefined : new Uint8Array(reply);
    },
    async save(bytes) {
      await invoke('db_save', bytes);
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
