/**
 * Tells a store's listeners of a change, each in a `try` of its own: a listener's bug must not make
 * the store throw for what it has done, nor keep the others from hearing of the change (NIT #87,
 * DR6-140). `report` gets what a listener throws. `AppData`, the save queue and `AiJobs` all tell
 * theirs here, so they never differ in it (review of PR 911).
 */
export function notify(listeners: Iterable<() => void>, report: (error: unknown) => void): void {
  for (const listener of listeners) {
    try {
      listener();
    } catch (error) {
      report(error);
    }
  }
}
