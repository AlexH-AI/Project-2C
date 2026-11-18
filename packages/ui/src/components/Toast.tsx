interface ToastButton {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  text: string;
  /** A few words after the text, lighter and smaller: when it is, or how to take it back. */
  detail?: string;
  /** `info` is the plain toast, a check before what was done; `error` the red one. */
  tone?: 'info' | 'error';
  /** The one button of the toast: the way back ("Hoàn tác"). */
  action?: ToastButton;
  /** The × of a toast that stays until it is closed (an error). */
  close?: ToastButton;
}

/** The marks of a toast (mockups' `#i-check`, `#i-alert`, `#i-x`), no text for a screen reader. */
const MARKS = {
  info: { path: 'M5 12.5l4.5 4.5L19 7.5', look: 'size-4.25 shrink-0 text-ok' },
  error: { path: 'M12 4l9 16H3zM12 10v4M12 17v.01', look: 'size-4.25 shrink-0 text-danger' },
  close: { path: 'M6 6l12 12M18 6L6 18', look: 'size-3.5' },
} as const;

function Mark({ of }: { of: keyof typeof MARKS }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={MARKS[of].look}
    >
      <path d={MARKS[of].path} />
    </svg>
  );
}

const BUTTON =
  'shrink-0 cursor-pointer rounded-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/**
 * A toast (mockup components.html 08, `.toast` of ui2.css section 10): one line saying what just
 * happened, with one button at most, on the focus layer and in the shape of a chip. Its button is
 * a chip too, concentric with it. Presentation only: where it stands, the live region that reads
 * it and when it leaves are the app's. Words longer than the window break rather than run out.
 */
export function Toast({ text, detail, tone = 'info', action, close }: ToastProps) {
  return (
    <div
      className={`pop inline-flex min-h-10.5 max-w-full items-center gap-3 rounded-chip py-1.5 pl-4 text-md text-fg ${
        action || close ? 'pr-2' : 'pr-4'
      }`}
    >
      <Mark of={tone} />
      <span className="min-w-0 wrap-anywhere">
        {text}
        {detail && <small className="text-sm text-fg-2 tabular-nums"> {detail}</small>}
      </span>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={`press btn-quiet inline-flex h-7 items-center px-2.75 text-sm whitespace-nowrap ${BUTTON}`}
        >
          {action.label}
        </button>
      )}
      {close && (
        <button
          type="button"
          aria-label={close.label}
          onClick={close.onClick}
          className={`grid size-7 place-items-center text-fg-3 hover:bg-fill-2 hover:text-fg ${BUTTON}`}
        >
          <Mark of="close" />
        </button>
      )}
    </div>
  );
}
