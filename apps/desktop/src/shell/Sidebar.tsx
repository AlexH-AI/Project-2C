import { Fragment } from 'react';
import { NavIcon, type NavIconName } from '@p2c/ui';
import { t } from '../i18n';
import { SECTIONS, routeToHash, type Section } from './routes';

const ICONS: Record<Section, NavIconName> = {
  overview: 'overview',
  appointments: 'calendar',
  customers: 'customers',
  reports: 'reports',
  team: 'team',
  settings: 'settings',
};

/** Sections from here on sit under the "Quản lý" group label. */
const FIRST_MANAGE_SECTION: Section = 'team';

export function Sidebar({ current }: { current: Section }) {
  return (
    <aside className="flex w-(--sidebar-w) flex-none flex-col gap-4.5 border-r border-border bg-surface-1 px-3.5 py-4.5">
      <div className="flex items-center gap-2.5 px-1.5 text-lg font-bold">
        <span
          aria-hidden="true"
          className="grid size-7.5 place-items-center rounded-md border-2 border-accent text-xs text-accent"
        >
          2C
        </span>
        {t('app.title')}
      </div>
      <nav aria-label={t('nav.label')} className="flex flex-col gap-0.5">
        {SECTIONS.map((section) => {
          const active = section === current;
          return (
            <Fragment key={section}>
              {section === FIRST_MANAGE_SECTION && (
                <div className="px-2.5 pt-2 pb-1 text-xs tracking-wider text-fg-3 uppercase">
                  {t('nav.group.manage')}
                </div>
              )}
              <a
                href={routeToHash({ screen: section })}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-sm px-2.5 py-2 focus-visible:outline-2 focus-visible:outline-accent ${
                  active
                    ? 'bg-accent-soft font-semibold text-accent'
                    : 'text-fg-2 hover:bg-surface-3 hover:text-fg'
                }`}
              >
                <NavIcon name={ICONS[section]} />
                {t(`screen.${section}`)}
              </a>
            </Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
