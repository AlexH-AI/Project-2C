import { Fragment, useSyncExternalStore } from 'react';
import { formatLocalTime } from '@p2c/domain';
import { NavIcon, type NavIconName } from '@p2c/ui';
import { useAppData } from '../data/AppDataContext';
import type { SaveStatus } from '../data/persist-queue';
import { t } from '../i18n';
import { FOCUS } from '../routes/classes';
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
                className={`flex items-center gap-2.5 rounded-sm px-2.5 py-2 ${FOCUS} ${
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
      <SaveState />
    </aside>
  );
}

/** The save state of the exe; web mode saves nothing. */
function SaveState() {
  const { saves, hasFile } = useAppData();
  const status = useSyncExternalStore(saves.subscribe, saves.status);
  return <SaveStateLine status={hasFile ? status : undefined} />;
}

/**
 * Mockup settings-data 10d: the save state at the foot of the sidebar, on every screen, kept in
 * view while a long screen scrolls; `undefined` is web mode. Not a live region: a failed save is
 * told by the warning's alert, and reading out every save would talk after each change.
 */
export function SaveStateLine({ status }: { status: SaveStatus | undefined }) {
  const { dot, tone, text } = saveState(status);
  return (
    <p
      className={`sticky bottom-0 m-0 mt-auto flex items-center gap-1.5 bg-surface-1 px-2.5 py-2 text-xs tabular-nums ${tone}`}
    >
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dot}`} />
      {text}
    </p>
  );
}

/** A write running outshows a failed one: "Thử lại" or the next change may be saving it. */
function saveState(status: SaveStatus | undefined): { dot: string; tone: string; text: string } {
  if (!status) return { dot: 'bg-info', tone: 'text-fg-2', text: t('settings.file.web') };
  if (status.saving) return { dot: 'bg-fg-3', tone: 'text-fg-2', text: t('saveState.saving') };
  if (status.failed) return { dot: 'bg-danger', tone: 'text-danger', text: t('saveState.failed') };
  // Nothing saved yet in this session: the file holds what the app shows, opened as it is.
  const text = status.lastSave
    ? t('saveState.savedAt', { time: formatLocalTime(status.lastSave.at) })
    : t('saveState.saved');
  return { dot: 'bg-ok', tone: 'text-fg-3', text };
}
