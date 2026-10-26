import { useState } from 'react';
import { formatDate } from '@p2c/domain';
import { Button } from '@p2c/ui';
import { useAppData, useToday } from '../data/AppDataContext';
import { isUnsavedChangesError } from '../data/app-data';
import { t } from '../i18n';
import { SECTION } from './classes';
import type { SettingsSection } from '../shell/routes';
import { ConfirmWordDialog } from './ConfirmWordDialog';
import { AiSection } from './SettingsAi';
import { BackupSection, type BackupNotice, type DataNoticeProps } from './SettingsBackup';
import { DataFileSection } from './SettingsDataFile';
import { TrashSection } from './SettingsTrash';

type Outcome =
  | { readonly ok: true; readonly anchor: string; readonly backup: string | undefined }
  | { readonly ok: false; readonly unsaved: boolean };

const SECTIONS = ['data', 'ai', 'trash'] as const;

type Section = (typeof SECTIONS)[number];

const NAV_ITEM =
  'rounded-sm px-2.5 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-accent';

/**
 * Settings, with its sections side by side (mockup settings-data, ai.html 1a). Dữ liệu: the data
 * file (T-070), backup files (T-052), then the simulated data (T-045). AI: Settings → AI (T-167),
 * also `#/settings/ai`, where "Cài đặt → AI" of an AI error goes (mockup ai.html 2f). Thùng rác: the
 * deleted records (spec Phase 6 §4.2), also `#/settings/trash`.
 */
export function Settings({ section: linked }: { section?: SettingsSection }) {
  const [section, setSection] = useState<Section>(linked ?? 'data');
  return (
    <div className="flex max-w-4xl items-start gap-4">
      <nav
        aria-label={t('settings.nav.label')}
        className="flex w-36 shrink-0 flex-col rounded-lg border border-border bg-surface-1 p-1.5"
      >
        {SECTIONS.map((item) => (
          <button
            key={item}
            type="button"
            aria-current={item === section ? 'page' : undefined}
            onClick={() => setSection(item)}
            className={`${NAV_ITEM} ${
              item === section ? 'bg-accent-soft font-semibold text-accent' : 'text-fg-2'
            }`}
          >
            {t(`settings.nav.${item}`)}
          </button>
        ))}
      </nav>
      <div className="flex min-w-0 max-w-3xl flex-1 flex-col gap-4">
        {section === 'data' ? (
          <DataSections />
        ) : section === 'ai' ? (
          <AiSection />
        ) : (
          <TrashSection />
        )}
      </div>
    </div>
  );
}

/** The notice of each section of Dữ liệu that has one. */
interface DataNotices {
  readonly backup: BackupNotice;
  readonly demo: Outcome;
}

/** The one notice of Dữ liệu, and the section it belongs to. */
type Shown = {
  readonly [From in keyof DataNotices]: { readonly from: From; readonly notice: DataNotices[From] };
}[keyof DataNotices];

/**
 * Dữ liệu has one notice, that of the last backup or reload: a notice about data replaced since
 * never stays beside it (DR6-45).
 */
function DataSections() {
  const [shown, setShown] = useState<Shown | null>(null);
  // Typed by the section it is for (review of PR 825). Only section `from` sets a notice under
  // `from`, so its notice is of that section's type, which the compiler cannot follow through
  // `shown`: the casts say so here and nowhere else.
  const noticeOf = <From extends keyof DataNotices>(
    from: From,
  ): DataNoticeProps<DataNotices[From]> => ({
    notice: shown?.from === from ? (shown.notice as DataNotices[From]) : null,
    onNotice: (notice) =>
      setShown((now) =>
        notice !== null ? ({ from, notice } as Shown) : now?.from === from ? null : now,
      ),
  });
  return (
    <>
      <DataFileSection />
      <BackupSection {...noticeOf('backup')} />
      <DemoSection {...noticeOf('demo')} />
    </>
  );
}

function DemoSection({ notice: outcome, onNotice }: DataNoticeProps<Outcome>) {
  const [confirming, setConfirming] = useState(false);
  const { hasFile } = useAppData();

  return (
    <section aria-labelledby="demo-data-title" className={SECTION}>
      <h2 id="demo-data-title" className="m-0 mb-1 text-sm font-medium text-heading">
        {t('settings.demo.title')}
      </h2>
      <div className="flex items-center gap-3 py-2 text-sm">
        <div className="flex-1">
          <b className="block text-base">{t('settings.demo.reload')}</b>
          <span className="text-fg-2">
            {t('settings.demo.reloadHelp')} {hasFile && t('settings.demo.reloadHelpBackup')}
          </span>
        </div>
        <Button onClick={() => setConfirming(true)}>{t('settings.demo.reloadOpen')}</Button>
      </div>
      {outcome?.ok && (
        <p role="status" className="m-0 py-1 text-sm text-ok">
          {t('settings.demo.done', { date: outcome.anchor })}{' '}
          {outcome.backup && t('settings.demo.doneBackup', { file: outcome.backup })}
        </p>
      )}
      {outcome?.ok === false && (
        <p role="alert" className="m-0 py-1 text-sm text-danger">
          {t(outcome.unsaved ? 'settings.demo.failedUnsaved' : 'settings.demo.failed')}
        </p>
      )}
      {confirming && (
        <ReloadDialog
          onClose={(result) => {
            setConfirming(false);
            if (result) onNotice(result);
          }}
        />
      )}
    </section>
  );
}

/**
 * Mockup 10c: what is replaced, type the confirmation word, then back up (exe) and reload. The data
 * is counted once, when the dialog opens: the new data swapped in before it closes is not what
 * the sentence names.
 */
function ReloadDialog({ onClose }: { onClose: (outcome?: Outcome) => void }) {
  const data = useAppData();
  const [counts] = useState(() => data.counts());
  // Follows the day while the dialog stays open past midnight (DR-30).
  const anchor = formatDate(useToday());

  const reload = async () => {
    try {
      // The day the data was really anchored on: the backup may have run past midnight.
      const reloaded = await data.reloadDemoData();
      onClose({ ok: true, anchor: formatDate(reloaded.anchor), backup: reloaded.backup });
    } catch (error) {
      const unsaved = isUnsavedChangesError(error);
      onClose({ ok: false, unsaved });
    }
  };

  return (
    <ConfirmWordDialog
      title={t('settings.demo.confirmTitle')}
      word={t('settings.demo.confirmWord')}
      confirmLabel={t(data.hasFile ? 'settings.demo.confirmWithBackup' : 'settings.demo.confirm')}
      runningLabel={t('settings.demo.running')}
      run={reload}
      onClose={() => onClose()}
    >
      <p className="m-0">
        {t('settings.demo.confirmBody', {
          customers: counts.customers,
          appointments: counts.appointments,
          policies: counts.policies,
          date: anchor,
        })}
      </p>
      <p className="m-0 text-fg-2">
        {t(data.hasFile ? 'settings.demo.confirmBackup' : 'settings.demo.confirmWeb')}
      </p>
    </ConfirmWordDialog>
  );
}
