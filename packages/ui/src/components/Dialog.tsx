import { createContext, useContext, useEffect, useId, useRef, type ReactNode } from 'react';
import { focusBack } from './dialog-focus';

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

/**
 * Modal dialog (mockup `.dialog`): opens on mount; the caller unmounts it to close. Focus goes to
 * the field or button marked `[data-autofocus]` (`Button` / `TextField` with `autoFocus`), and
 * back to whatever had it before once the dialog is gone, or to `DialogFocusFallback` when that
 * went too.
 */
export function Dialog({ title, subtitle, onClose, onSubmit, actions, children }: DialogProps) {
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

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="m-auto w-full max-w-md rounded-lg border border-border bg-surface-1 p-0 text-fg backdrop:bg-surface-0/70"
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
        className="flex flex-col gap-3 p-4 text-sm"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        {/* A name in the title or the subtitle breaks, even with no space (DR6-148). */}
        <div className="wrap-anywhere">
          <h2 id={titleId} className="m-0 text-base font-semibold">
            {title}
          </h2>
          {subtitle && <p className="m-0 text-fg-2">{subtitle}</p>}
        </div>
        {children}
        <div className="flex justify-end gap-2">{actions}</div>
      </form>
    </dialog>
  );
}
