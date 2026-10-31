import type { PersistQueue } from '../data/persist-queue';

/**
 * The answer to "the last changes are not saved": try saving again, close without them, or
 * `stay` when the question was dismissed unanswered (Escape) — the window stays open.
 */
export type CloseChoice = 'retry' | 'discard' | 'stay';

/** The window being closed (exe only; web mode keeps the database in memory). */
export interface ClosePort {
  /** Shows the unsaved-changes question and resolves with the user's choice. */
  ask(): Promise<CloseChoice>;
  close(): Promise<void>;
}

/**
 * Runs when the user closes the exe window (T-057): saves what is still waiting or failed
 * first, the new data of a replace still running too (review of PR 125), and never closes over
 * unsaved changes without asking.
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
      const choice = await port.ask();
      if (choice === 'stay') return;
      if (choice === 'discard') break;
    }
  }
  await port.close();
}

/**
 * The question of `ClosePort.ask`: `show` puts it on screen with its answer, and takes it away
 * (`null`) once answered. A save that succeeds meanwhile (an AI answer saved) wrote every change
 * before it, so it answers "retry": the window closes once the rest is saved, as the user wanted,
 * and the question never names the cause of a failure gone (DR6-147).
 */
export function askWhileFailed(
  saves: Pick<PersistQueue, 'failed' | 'subscribe'>,
  show: (answer: ((choice: CloseChoice) => void) | null) => void,
): Promise<CloseChoice> {
  return new Promise((resolve) => {
    let stop = () => {};
    const answer = (choice: CloseChoice) => {
      stop();
      show(null);
      resolve(choice);
    };
    stop = saves.subscribe(() => {
      if (!saves.failed()) answer('retry');
    });
    if (saves.failed()) show(answer);
    else answer('retry');
  });
}
