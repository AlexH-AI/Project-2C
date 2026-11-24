import { useState, useSyncExternalStore } from 'react';
import { useAppData } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { useJobs } from '../../shell/background-jobs';
import { OpenFolderButton } from '../SettingsDataFile';
import { sameSelection, type FilterSelection } from '../applied-filter';
import {
  exportFailedHelp,
  exportReport,
  reportSheetCount,
  type ExportedReport,
  type ExportStep,
} from './report-workbook';

const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type ExportNotice =
  | {
      readonly kind: 'exported';
      readonly sheets: number;
      readonly where: string;
      /** False in web mode: the browser's downloads are no folder the app can open. */
      readonly inFolder: boolean;
    }
  | { readonly kind: 'failed'; readonly step: ExportStep; readonly inFolder: boolean };

/**
 * Xuất Excel (mockup reports.html 2f): the exe writes the file into `exports\`, web mode downloads
 * it, a job in the background on "Lưu ý" (VA9b-a), so Báo cáo stays in use, also left meanwhile.
 * A failure only says so, until the next export, whatever is picked meanwhile, as "Lưu ý" keeps
 * it until Thử lại (L146); the data in the app is untouched. The notice of a file is for its
 * period and the scope on screen when it was asked for, and goes once another is picked: the
 * numbers shown are no longer those of the file it names. Back on that period and scope, it shows
 * again.
 */
export function useReportExport(shown: FilterSelection) {
  const data = useAppData();
  const jobs = useJobs();
  const busy = useSyncExternalStore(jobs.subscribe, () => jobs.busy('export'));
  const [last, setLast] = useState<{ notice: ExportNotice; for: FilterSelection } | null>(null);

  const write = async (name: string, bytes: Uint8Array<ArrayBuffer>) => {
    const path = await data.exportFile(name, bytes);
    if (path === undefined) download(name, bytes);
    return path;
  };
  const run = async (report: ExportedReport) => {
    // The command bar exports this month as it puts it on screen, a period not shown yet.
    const exported = { ...shown, period: report.period };
    setLast(null);
    // Its time is not measured: the bar of "Lưu ý" has no percent.
    const job = jobs.start('export', 'export');
    const outcome = await exportReport(report, write);
    const notice: ExportNotice =
      outcome.kind === 'failed'
        ? { kind: 'failed', step: outcome.step, inFolder: data.hasFile }
        : {
            kind: 'exported',
            sheets: reportSheetCount(report.rows),
            where: outcome.path ?? outcome.name,
            inFolder: outcome.path !== undefined,
          };
    if (outcome.kind === 'failed') job.fail(() => void run(report));
    else job.done(outcome.name);
    setLast({ notice, for: exported });
  };
  // By value: the same period and scope picked again are new objects.
  const notice =
    last && (last.notice.kind === 'failed' || sameSelection(last.for, shown)) ? last.notice : null;
  return { busy, notice, run };
}

/** The line over the tables after an export (mockup reports.html 2f). */
export function ExportNoticeLine({ notice }: { notice: ExportNotice }) {
  if (notice.kind === 'failed') {
    return (
      <p role="alert" className="m-0 flex flex-col text-sm">
        <b className="text-danger">{t('reports.exportFailed')}</b>
        <span className="text-fg-2">{exportFailedHelp(notice.step, notice.inFolder)}</span>
      </p>
    );
  }
  return (
    <div className="flex items-center gap-3 text-sm">
      {/* A long exe path wraps anywhere, so the button stays beside it. */}
      <p role="status" className="m-0 min-w-0 flex-1 break-all text-ok tabular-nums">
        {t('reports.exported', { sheets: notice.sheets, where: notice.where })}
      </p>
      {notice.inFolder && <OpenFolderButton folder="exports" />}
    </div>
  );
}

/** Hands the file to the browser's downloads (web mode has no `exports\` folder). */
function download(name: string, bytes: Uint8Array<ArrayBuffer>) {
  const url = URL.createObjectURL(new Blob([bytes], { type: XLSX_TYPE }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  // Revoked later: the download may start only after `click` returns.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
