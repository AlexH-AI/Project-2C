/**
 * The marks of a field, drawn rather than written, so they are no text for a screen reader nor a
 * glyph a system font may lack: 24-unit grid, stroke style, the colour of the text around them
 * (mockups' `#i-x`, `#i-down`).
 */
function Mark({ path, className }: { path: string; className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

/** Before the words of an error line: the line says it is one by more than its colour. */
export const ErrorMark = () => (
  <Mark path="M6 6l12 12M18 6L6 18" className="mr-1.5 inline size-2.5" />
);

/** The arrow of a list, over the right end of its closed box; a click goes through it. */
export const ListArrow = () => (
  <Mark
    path="M6 9l6 6 6-6"
    className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-fg-3"
  />
);
