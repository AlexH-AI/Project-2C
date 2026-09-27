import type { PersistQueue } from '../data/persist-queue';

/** The answer to "the last changes are not saved": try saving again, or close without them. */
export type CloseChoice = 'retry' | 'discard';

/** The window being closed (exe only; web mode keeps the database in memory). */
export interface ClosePort {
  /** Shows the unsaved-changes question and resolves with the user's choice. */
  ask(): Promise<CloseChoice>;
  close(): Promise<void>;
}

/**
 * Runs when the user closes the exe window (T-057): saves what is still waiting or failed
 * first, and never closes over unsaved changes without asking.
 */
export async function closeAfterSaving(
  saves: Pick<PersistQueue, 'flush'>,
  port: ClosePort,
): Promise<void> {
  for (;;) {
    try {
      await saves.flush();
      break;
    } catch {
      if ((await port.ask()) === 'discard') break;
    }
  }
  await port.close();
}
