/** What can take the focus back: an element, or a test's stand-in. */
interface Focusable {
  readonly isConnected: boolean;
  focus(options?: FocusOptions): void;
}

const takesFocus = (node: unknown): node is Focusable =>
  typeof (node as Partial<Focusable> | null)?.focus === 'function';

/**
 * Gives the focus back as a dialog goes: to what had it when the dialog opened, without scrolling,
 * since a dialog may have just moved the page on purpose ("Xem tất cả"). Once that has left the
 * page, e.g. a button the save took away, to the fallback its screen chose, brought into view;
 * never to the page itself (DR6-83).
 */
export function focusBack(
  opener: Element | null,
  fallback: (() => Focusable | null) | undefined,
): void {
  if (takesFocus(opener) && opener.isConnected) opener.focus({ preventScroll: true });
  else fallback?.()?.focus();
}
