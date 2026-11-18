import type { ReactNode } from 'react';

/**
 * The icons of a mark, from the approved mockups (`#i-*` of components.html), each as one path on
 * the 24-unit grid: a circle, an ellipse and a rounded box are drawn as arcs.
 */
const ICONS = {
  calendar:
    'M6 4.5h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-10a3 3 0 0 1 3-3zM3 9.5h18M8 3v3M16 3v3',
  search: 'M4.5 11a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0M20 20l-4.2-4.2',
  info: 'M3.5 12a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0-17 0M12 11v5.5M12 7.5v.01',
  people:
    'M5.8 8a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.6c1.7.8 2.7 2.3 3 4.4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  alert: 'M12 4l9 16H3zM12 10v4M12 17v.01',
  data: 'M5 6a7 3 0 1 0 14 0a7 3 0 1 0-14 0M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6',
} as const;

export type StateNoteIcon = keyof typeof ICONS;

interface StateNoteProps {
  /**
   * `screen` stands for a whole screen, centred; `card` and `table` are a row inside a card or
   * under the headers of a table, whose cell gives the room.
   */
  size: 'screen' | 'card' | 'table';
  /** `empty` is quiet; `error` is an alert, with the danger colour on its mark only. */
  tone?: 'empty' | 'error';
  icon: StateNoteIcon;
  /** What is not here, or what failed. */
  title: ReactNode;
  /** The title as a heading of this level, where the note stands for a page or a screen. */
  heading?: 1 | 2;
  /** What to do next. */
  next?: ReactNode;
  /** The button, or the buttons, the app gives. */
  action?: ReactNode;
  /** The technical detail of an error, in the font of code, to select and copy. */
  detail?: { label: string; text: string };
}

const BOX = {
  screen: 'grid justify-items-center gap-1.5 px-6 py-8.5 text-center',
  card: 'flex items-center gap-3 px-1 pt-3.5 pb-1 text-left',
  table: 'flex items-center gap-3 py-1.5 text-left',
} as const;

const TONE = {
  empty: 'bg-fill-2 text-fg-2 inset-ring inset-ring-hairline',
  error: 'bg-danger/14 text-danger inset-ring inset-ring-danger/35',
} as const;

/**
 * An empty place or an error (mockup components.html 09, 10; `.empty` of ui2.css section 11), one
 * shape for both: a mark, a line saying what is not here or what failed, a line saying what to do
 * next, then the button. Presentation only: the words and the button are the app's.
 */
export function StateNote({
  size,
  tone = 'empty',
  icon,
  title,
  heading,
  next,
  action,
  detail,
}: StateNoteProps) {
  const big = size === 'screen';
  const Title = heading === 1 ? 'h1' : heading === 2 ? 'h2' : 'b';
  const words = (
    <>
      <Title className={`${heading ? 'm-0 ' : ''}${big ? 'text-lg' : 'text-md'} font-semibold`}>
        {title}
      </Title>
      {next && (
        <p className={`m-0 wrap-anywhere text-fg-2 ${big ? 'max-w-105 text-md' : 'text-sm'}`}>
          {next}
        </p>
      )}
      {detail && (
        <p className="m-0 mt-2.5 max-w-full rounded-field bg-fill-1 px-3 py-2 text-left text-sm wrap-anywhere text-fg-2 select-text">
          {detail.label} <code>{detail.text}</code>
        </p>
      )}
    </>
  );
  const buttons = action && (
    <div className={`flex shrink-0 flex-wrap gap-2 ${big ? 'mt-3 justify-center' : ''}`}>
      {action}
    </div>
  );
  return (
    <div role={tone === 'error' ? 'alert' : undefined} className={BOX[size]}>
      <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center rounded-full ${big ? 'mb-1.5 size-13' : 'size-9'} ${TONE[tone]}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={big ? 'size-5.5' : 'size-4'}
        >
          <path d={ICONS[icon]} />
        </svg>
      </span>
      {big ? words : <div className="flex min-w-0 flex-1 flex-col gap-0.5">{words}</div>}
      {buttons}
    </div>
  );
}
