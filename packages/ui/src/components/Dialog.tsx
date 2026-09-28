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

/** Modal dialog (mockup `.dialog`): opens on mount; the caller unmounts it to close. */
export function Dialog({ title, subtitle, onClose, onSubmit, actions, children }: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="m-auto w-full max-w-md rounded-lg border border-border bg-surface-1 p-0 text-fg backdrop:bg-surface-0/70"
      onCancel={(event) => {
        // The browser would close the dialog behind React's back; the caller decides instead.
        event.preventDefault();
        onClose?.();
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
