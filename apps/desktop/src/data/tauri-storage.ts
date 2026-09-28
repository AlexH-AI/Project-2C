/** Storage port backed by the Rust file commands in `src-tauri` (ADR-0016). */
import type { InvokeArgs } from '@tauri-apps/api/core';
import type { StoragePort } from './app-data';

type Invoke = (command: string, args?: InvokeArgs) => Promise<unknown>;

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
  };
}
