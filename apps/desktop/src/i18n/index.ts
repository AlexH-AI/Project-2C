import { vi, type MessageKey } from './vi';

/** Look up a UI string. Keys are typed, so a missing key fails typecheck. */
export function t(key: MessageKey): string {
  return vi[key];
}

export type { MessageKey };
