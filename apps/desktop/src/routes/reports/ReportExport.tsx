import { useState } from 'react';
import { useAppData } from '../../data/AppDataContext';
import { t } from '../../i18n';
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
 * it. A failure only says so; the data in the app is untouched. The notice is for the period and
 * scope applied when Xuất Excel was pressed, and goes once Lọc applies others.
 */
export function useReportExport(applied: FilterSelection) {
  const data = useAppData();
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<{ notice: ExportNotice; for: FilterSelection } | null>(null);

  const write = async (name: string, bytes: Uint8Array<ArrayBuffer>) => {
    const path = await data.exportFile(name, bytes);
    if (path === undefined) download(name, bytes);
    return path;
  };
  const run = async (report: ExportedReport) => {
    const exported = applied;
    setBusy(true);
    setLast(null);
    try {
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
      setLast({ notice, for: exported });
    } finally {
      setBusy(false);
    }
  };
  // By value: Lọc may apply the same period and scope again as new objects.
  const notice = last && sameSelection(last.for, applied) ? last.notice : null;
  return { busy, notice, run };
}

/** The line under the Lọc bar after an export (mockup reports.html 2f). */
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
