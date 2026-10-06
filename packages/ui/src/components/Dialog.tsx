import { useEffect, useId, useRef, type ReactNode } from 'react';

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
 * back to whatever had it before once the dialog is gone.
 */
export function Dialog({ title, subtitle, onClose, onSubmit, actions, children }: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const opener = document.activeElement;
    open(node);
    return () => {
      // Unmounting skips the browser's own focus return, which only close() does. No scrolling:
      // a dialog may have just moved the page on purpose ("Xem tất cả").
      if (opener instanceof HTMLElement && opener.isConnected)
        opener.focus({ preventScroll: true });
    };
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
        <div>
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
