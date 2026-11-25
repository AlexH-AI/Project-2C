/**
 * The marks of the components, drawn rather than written, so they are no text for a screen reader
 * nor a glyph a system font may lack: one path each on the 24-unit grid, a circle drawn as arcs
 * (the mockups' `#i-x`, `#i-alert`, `#i-info`, `#i-down`, `#i-chev`, `#i-check`). Every component
 * draws them from here (review of PR 1402).
 */
export const MARKS = {
  close: 'M6 6l12 12M18 6L6 18',
  alert: 'M12 4l9 16H3zM12 10v4M12 17v.01',
  info: 'M3.5 12a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0-17 0M12 11v5.5M12 7.5v.01',
  down: 'M6 9l6 6 6-6',
  next: 'M9 6l6 6-6 6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
} as const;

/** A mark in the stroke style, in the colour of the text around it. */
export function Mark({
  of,
  className,
  stroke = 2.5,
}: {
  of: keyof typeof MARKS;
  className: string;
  /** The weight of the line: 2.5 in a field, a menu and the head of a dialog, 2 in a toast. */
  stroke?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={MARKS[of]} />
    </svg>
  );
}

/** Before the words of an error line: the line says it is one by more than its colour. */
export const ErrorMark = () => <Mark of="close" className="mr-1.5 inline size-2.5" />;

/** The arrow of a list, over the right end of its closed box; a click goes through it. */
export const ListArrow = () => (
  <Mark
    of="down"
    className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-fg-3"
  />
);
