import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import { focusBack } from './dialog-focus';
import { calmMotion } from './motion';

/**
 * Where a dialog inside gives the focus back when what opened it is gone too (DR6-83), e.g. a
 * button the save took away with its row: set by the screen around its dialogs, such as the heading
 * of the panel they change. Asked once the dialog is gone, so it can name what came with the change
 * (a `role="status"` line); read refs in it.
 */
export const DialogFocusFallback = createContext<(() => HTMLElement | null) | undefined>(undefined);

interface DialogProps {
  title: string;
  subtitle?: string;
  /** Escape calls it; omitted (e.g. while working), the dialog closes only through its buttons. */
  onClose?: () => void;
  /**
   * The name of the × of the head, which closes as Escape does. Without it, or without `onClose`,
   * the head has no ×.
   */
  closeLabel?: string;
  /** A question to confirm is 400 px wide, a form 480 px (mockup components.html 06). */
  size?: 'confirm' | 'form';
  /** Enter in a field, or a `type="submit"` button. */
  onSubmit?: () => void;
  /** Footer buttons, end-aligned. */
  actions: ReactNode;
  children?: ReactNode;
}

function open(node: HTMLDialogElement) {
  node.showModal();
  // React's own autoFocus runs before showModal(), while the dialog cannot take focus (DR-59).
  node.querySelector<HTMLElement>('[data-autofocus]')?.focus();
}

const WIDTH = { confirm: 'w-100', form: 'w-120' } as const;

/** Longer than the move out of a dialog and of what dims behind it (--t-2). */
const GONE_MS = 400;

/**
 * A dialog closed goes in --t-1, what dims behind it in --t-2 (`motion-dialog` of theme.css), but
 * its caller has taken it away: a copy of it stays for that time, over the page, taking nothing,
 * neither a click nor the focus, and read by no screen reader, with no ids, then goes. None under
 * "Giảm chuyển động", nor where the page cannot show one.
 */
function leaveBehind(dialog: HTMLDialogElement) {
  if (calmMotion() || typeof dialog.showPopover !== 'function') return;
  const copy = dialog.cloneNode(true) as HTMLDialogElement;
  for (const named of [copy, ...copy.querySelectorAll('[id]')]) named.removeAttribute('id');
  for (const name of ['open', 'aria-labelledby']) copy.removeAttribute(name);
  copy.setAttribute('aria-hidden', 'true');
  copy.setAttribute('popover', 'manual');
  copy.setAttribute('data-state', 'closing');
  copy.inert = true;
  document.body.append(copy);
  copy.showPopover();
  const gone = () => copy.remove();
  void Promise.all(copy.getAnimations({ subtree: true }).map((move) => move.finished)).then(
    gone,
    gone,
  );
  setTimeout(gone, GONE_MS);
}

/**
 * Modal dialog, the focus layer (mockup components.html 06, `.dlg` of ui2.css): opens on mount;
 * the caller unmounts it to close. Three parts: the head (title, a line of context, the ×), the
 * body, which scrolls when long and breaks a word longer than its line (DR6-183), and the foot
 * with the actions; head and foot stay where they are. A click on what is dimmed behind does not
 * close it. Focus goes to the field or button marked `[data-autofocus]` (`Button` / `TextField`
 * with `autoFocus`), and back to whatever had it before once the dialog is gone, or to
 * `DialogFocusFallback` when that went too. The × comes last in the dialog, so a dialog that marks
 * nothing still opens on its first field or button. It comes as its system brings one, and goes in
 * --t-1 (`motion-dialog`, `leaveBehind`).
 */
export function Dialog({
  title,
  subtitle,
  onClose,
  closeLabel,
  size = 'form',
  onSubmit,
  actions,
  children,
}: DialogProps) {
  const closes = onClose && closeLabel;
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // Kept from the first run: StrictMode runs the effect again once focus is inside the dialog.
  const opener = useRef<Element | null>(null);
  // The latest, for the effect below, which runs once.
  const fallbackFocus = useContext(DialogFocusFallback);
  const fallback = useRef(fallbackFocus);
  useEffect(() => {
    fallback.current = fallbackFocus;
  });

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    opener.current ??= document.activeElement;
    open(node);
    // Unmounting skips the browser's own focus return, which only close() does.
    return () => focusBack(opener.current, fallback.current);
  }, []);

  useLayoutEffect(() => {
    const node = dialog.current;
    // In the commit that takes the dialog away, before the page is painted without it; only a
    // dialog that did leave the page (not the second run of StrictMode) leaves a copy, of what it
    // held as it went.
    return () =>
      queueMicrotask(() => {
        if (node && !node.isConnected) leaveBehind(node);
      });
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className={`pop motion-dialog m-auto ${WIDTH[size]} flex-col rounded-pop p-0 text-fg open:flex`}
      onCancel={(event) => {
        // The browser would close the dialog behind React's back; the caller decides instead.
        // A cancel it will not let us refuse ends in `close` instead.
        if (!event.cancelable) return;
        event.preventDefault();
        onClose?.();
      }}
      onClose={(event) => {
        // Chromium lets a page refuse Escape only while the user has activation left, so a second
        // Escape closes the dialog anyway (DR-58): the caller closes it now, or it opens again.
        if (onClose) onClose();
        else open(event.currentTarget);
      }}
    >
      <form
        className="flex min-h-0 flex-col text-sm"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        {/* A name in the title or the subtitle breaks, even with no space (DR6-148). */}
        <div className={`px-5.5 pt-5 pb-3 wrap-anywhere ${closes ? 'pr-14' : ''}`}>
          <h2 id={titleId} className="m-0 text-lg font-semibold">
            {title}
          </h2>
          {subtitle && <p className="m-0 mt-0.5 text-fg-3 tabular-nums">{subtitle}</p>}
        </div>
        {/* Positioned: what it holds out of the flow (a line for screen readers only) scrolls with it. */}
        <div className="relative flex min-h-0 flex-col gap-3 overflow-x-hidden overflow-y-auto px-5.5 pt-1 pb-4 wrap-anywhere">
          {children}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-hairline px-5.5 pt-3.5 pb-4.5">
          {actions}
        </div>
        {closes && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="absolute top-4.5 right-4.5 grid size-7 cursor-pointer place-items-center rounded-chip text-fg-3 hover:bg-fill-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="size-3.5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </form>
    </dialog>
  );
}
