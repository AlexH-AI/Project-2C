/**
 * Policy status label, on its colour mixed into the background (mockup components.html 07
 * `.st.s-sub`, `.st.s-iss`: words alone, no dot); the caller passes the translated label.
 */
export function PolicyBadge({ issued, label }: { issued: boolean; label: string }) {
  return (
    <span
      className={`label-fill inline-flex h-5 items-center rounded-chip px-2 text-xs font-bold whitespace-nowrap ${
        issued ? 'text-issued' : 'text-submitted'
      }`}
    >
      {label}
    </span>
  );
}
