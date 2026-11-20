import { Fragment } from 'react';
import { formatLocalTime } from '@p2c/domain';
import { NavIcon, type NavIconName } from '@p2c/ui';
import { useAppData, useSaveStatus } from '../data/AppDataContext';
import type { SaveStatus } from '../data/persist-queue';
import { t } from '../i18n';
import { FOCUS } from '../routes/classes';
import { Brand, Slogan } from './Brand';
import { macDragRegion } from './platform';
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

/**
 * The sidebar of mockup app-shell.html (`#sidebar`): the compact logo, the screens, and at its
 * foot the save state, then the slogan. The fill of the chosen item is an element of its own
 * (`data-slot="nav-pill"`), for it to glide to the next one (VA7a).
 */
export function Sidebar({ current }: { current: Section }) {
  return (
    <aside className="sidebar flex flex-none flex-col gap-3 self-start">
      {/* The top of the pane: in the macOS exe the window's three buttons sit there (VA5), and
          the window moves by it, the logo too: nothing in it opens or takes a click. */}
      <div data-tauri-drag-region={macDragRegion('deep')} className="flex flex-col gap-3">
        <div aria-hidden="true" data-slot="window-controls" className="window-controls" />
        <Brand />
      </div>
      <nav aria-label={t('nav.label')} className="flex flex-col gap-0.5">
        {SECTIONS.map((section) => {
          const active = section === current;
          return (
            <Fragment key={section}>
              {section === FIRST_MANAGE_SECTION && (
                <div className="px-2.5 pt-3.5 pb-1.25 text-xs font-semibold tracking-wide text-fg-2">
                  {t('nav.group.manage')}
                </div>
              )}
              <a
                href={routeToHash({ screen: section })}
                aria-current={active ? 'page' : undefined}
                className={`nav-item flex h-8.5 flex-none items-center gap-2.75 px-2.5 win:h-9 ${FOCUS}`}
              >
                {active && <span aria-hidden="true" data-slot="nav-pill" className="nav-pill" />}
                <NavIcon name={ICONS[section]} />
                {t(`screen.${section}`)}
              </a>
            </Fragment>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1.5 px-2.5 pb-0.5">
        <SaveState />
        <Slogan />
      </div>
    </aside>
  );
}

/** The save state of the exe; web mode saves nothing. */
function SaveState() {
  const { hasFile } = useAppData();
  const status = useSaveStatus();
  return <SaveStateLine status={hasFile ? status : undefined} />;
}

/**
 * Mockup settings-data 10d: the save state at the foot of the sidebar, on every screen, in view
 * while a long screen scrolls, as the sidebar is; `undefined` is web mode. Not a live region: a
 * failed save is told by the warning's alert, and reading out every save would talk after each
 * change.
 */
export function SaveStateLine({ status }: { status: SaveStatus | undefined }) {
  const { dot, tone, text } = saveState(status);
  return (
    <p className={`m-0 flex items-center gap-1.5 text-xs tabular-nums ${tone}`}>
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dot}`} />
      {text}
    </p>
  );
}

/** Web mode, which keeps the data in the browser only; Settings → Data says it alike (10d). */
export const WEB_MODE = { dot: 'bg-info', tone: 'text-fg-2', text: t('settings.file.web') };

/** A write running outshows a failed one: "Thử lại" or the next change may be saving it. */
function saveState(status: SaveStatus | undefined): { dot: string; tone: string; text: string } {
  if (!status) return WEB_MODE;
  if (status.saving) return { dot: 'bg-fg-3', tone: 'text-fg-2', text: t('saveState.saving') };
  if (status.failed) return { dot: 'bg-danger', tone: 'text-danger', text: t('saveState.failed') };
  // Nothing saved yet in this session: the file holds what the app shows, opened as it is.
  const text = status.lastSave
    ? t('saveState.savedAt', { time: formatLocalTime(status.lastSave.at) })
    : t('saveState.saved');
  // --text-2, as ui2.css .sb-foot: on the glass of macOS --text-3 is under 4.5:1 (PR 1414).
  return { dot: 'bg-ok', tone: 'text-fg-2', text };
}
