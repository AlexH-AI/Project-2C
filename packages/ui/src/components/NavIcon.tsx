/**
 * The icons of mockup app-shell.html (`<symbol>` `#i-*`, ADR-0013 appendix 11/11/2026 §4): 24-unit
 * grid, 18 px, a stroke of 1.7 px in the colour of the text beside them. Those of the sidebar;
 * Forecast and the magnifier, for the item of Forecast (D4), the search of customers (C1) and the
 * command box (VA8); the eight a team may take beside its name (C3, mockup search-rm-team.html); the
 * three of Cài đặt, each on its tile (F1, `tile-*` of theme.css).
 */
const PATHS = {
  overview: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      <path d="M3 9.5h18M8 3v3M16 3v3" />
    </>
  ),
  customers: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.6c1.7.8 2.7 2.3 3 4.4" />
    </>
  ),
  forecast: (
    <>
      <path d="M3 16l5-5 3.5 3L17 8M14 8h3v3" />
      <path d="M3 20.5h18" strokeDasharray="1.5 3.2" />
    </>
  ),
  reports: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9.5 17v-3M12 17v-5M14.5 17v-2" />,
  team: (
    <>
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="18.5" cy="17.5" r="2.5" />
      <path d="M12 8.5V12M5.5 15v-3h13v3" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  ai: (
    <path d="M11 3l1.9 4.9L18 9.8l-5.1 1.9L11 16.6l-1.9-4.9L4 9.8l5.1-1.9zM18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
  ),
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.9z" />,
  sunrise: (
    <path d="M3 18h18M7.5 18a4.5 4.5 0 0 1 9 0M12 7v3M5.3 10.8l1.7 1.7M18.7 10.8L17 12.5M8 21.5h8" />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </>
  ),
  mountain: <path d="M3 19l6-10 3.5 5.5L15 11l6 8z" />,
  leaf: <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19l7-7" />,
  flame: (
    <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 .8-3.2 2-4.3.2 2 1 3 2 3.3-.3-3 .2-6 1-9z" />
  ),
  shield: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />,
  anchor: (
    <>
      <circle cx="12" cy="5.5" r="2" />
      <path d="M12 7.5V21M5 13c0 4 3 7 7 8 4-1 7-4 7-8M8.5 11h7" />
    </>
  ),
} as const;

export type NavIconName = keyof typeof PATHS;

/** `className` sizes it: 18 px when left out. */
export function NavIcon({
  name,
  className = 'size-4.5',
}: {
  name: NavIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${className} flex-none fill-none stroke-current`}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
