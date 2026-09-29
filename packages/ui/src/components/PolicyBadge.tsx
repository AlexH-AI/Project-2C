/** Policy status pill (mockup `.badge.pol-*`); the caller passes the translated label. */
export function PolicyBadge({ issued, label }: { issued: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-current px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
        issued ? 'text-issued' : 'text-submitted'
      }`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
