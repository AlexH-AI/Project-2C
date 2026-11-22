const TONE = {
  submitted: 'text-submitted',
  issued: 'text-issued',
  cancelled: 'text-danger',
} as const;

/**
 * Policy status label, on its colour mixed into the background (mockup components.html 07
 * `.st.s-sub`, `.st.s-iss`; a cancelled one red as `.st.s-bad`, huy-hd.html #row: words alone, no
 * dot); the caller passes the translated label.
 */
export function PolicyBadge({ status, label }: { status: keyof typeof TONE; label: string }) {
  return (
    <span
      className={`label-fill inline-flex h-5 items-center rounded-chip px-2 text-xs font-bold whitespace-nowrap ${TONE[status]}`}
    >
      {label}
    </span>
  );
}
