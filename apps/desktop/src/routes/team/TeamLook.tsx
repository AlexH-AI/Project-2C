import type { ReactNode } from 'react';
import type { Team, TeamColor } from '@p2c/domain';
import { NavIcon } from '@p2c/ui';
import { t } from '../../i18n';
import { BADGE } from '../classes';

// Each colour a team's name may take (C3, ADR-0007 "Team & nhân sự"), as literal classes Tailwind
// reads: the text, and the tint of the square of the icon (mockup `.tmark`, 16 %).
const TEXT: Record<TeamColor, string> = {
  accent: 'text-accent',
  info: 'text-info',
  n2: 'text-n2',
  submitted: 'text-submitted',
  ok: 'text-ok',
  warn: 'text-warn',
};
const TINT: Record<TeamColor, string> = {
  accent: 'bg-accent/16',
  info: 'bg-info/16',
  n2: 'bg-n2/16',
  submitted: 'bg-submitted/16',
  ok: 'bg-ok/16',
  warn: 'bg-warn/16',
};

type Look = Pick<Team, 'color' | 'icon'>;

/** The colour of a team's name: that of the text in the default look (mockup `.tname`). */
export const teamNameClass = ({ color }: Look): string => (color ? TEXT[color] : 'text-fg');

/**
 * The icon of a team on its tinted square, before its name (mockup `.tmark`; `large` at the top of
 * the team): decoration, as the name beside it says which team.
 */
export function TeamMark({
  team,
  large = false,
  className = '',
}: {
  team: Look;
  large?: boolean;
  className?: string;
}) {
  const tone = team.color ? `${TEXT[team.color]} ${TINT[team.color]}` : 'bg-fg-2/16 text-fg-2';
  return (
    <span
      aria-hidden="true"
      className={`inline-grid flex-none place-items-center align-middle ${tone} ${className} ${
        large ? 'size-11 rounded-menu' : 'size-5 rounded-control-sm'
      }`}
    >
      <NavIcon name={team.icon ?? 'team'} className={large ? 'size-5.5' : 'size-3.25'} />
    </span>
  );
}

/**
 * The top of a team (mockup `#team` `.th`, ý 33): its icon, its name in its colour, then its TL on
 * the same line, as large and bold. A name too long for the line breaks on a line of its own, even
 * with no space (DR6-148). `id` makes the name the heading of the card; the preview of Tạo / Sửa
 * team (`small`) has none.
 */
export function TeamTop({
  team,
  lead,
  id,
  small = false,
  children,
}: {
  team: Pick<Team, 'name' | 'color' | 'icon'>;
  /** The TL's name, or the words saying there is none. */
  lead: ReactNode;
  id?: string;
  small?: boolean;
  /** After the TL: their Sửa, or "+ Thêm TL", and the buttons of the team. */
  children?: ReactNode;
}) {
  const size = `${small ? 'text-xl' : 'text-2xl'} leading-tight font-bold tracking-tight`;
  const Name = id ? 'h2' : 'span';
  return (
    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
      <TeamMark team={team} large />
      <Name
        id={id}
        tabIndex={id ? -1 : undefined}
        className={`m-0 min-w-0 wrap-anywhere ${size} ${teamNameClass(team)}`}
      >
        {team.name}
      </Name>
      <span aria-hidden="true" className="h-6.5 w-px bg-hairline" />
      <span className="inline-flex min-w-0 items-center gap-2">
        <span className={`${BADGE} text-accent`}>{t('team.leadOf')}</span>
        <b className={`min-w-0 wrap-anywhere ${size}`}>{lead}</b>
      </span>
      {children}
    </div>
  );
}
