/**
 * The icons of mockup app-shell.html (`<symbol>` `#i-*`, ADR-0013 appendix 11/11/2026 §4): 24-unit
 * grid, 18 px, a stroke of 1.7 px in the colour of the text beside them. Those of the sidebar;
 * Forecast and the magnifier, for the item of Forecast (D4), the search of customers (C1) and the
 * command box (VA8); the three of Cài đặt, each on its tile (F1, `tile-*` of theme.css).
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
} as const;

export type NavIconName = keyof typeof PATHS;

export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4.5 flex-none fill-none stroke-current"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
