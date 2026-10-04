import { useState } from 'react';
import type { CalendarDate, Period } from '@p2c/domain';
import { useAppData } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { OpenFolderButton } from '../SettingsDataFile';
import type { ViewingText } from '../overview/overview-view';
import {
  buildReportWorkbook,
  reportFileName,
  reportSheetCount,
  reportWorkbookMeta,
} from './report-workbook';
import type { ReportRows } from './reports-view';

const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type ExportNotice =
  | {
      readonly kind: 'exported';
      readonly sheets: number;
      readonly where: string;
      /** False in web mode: the browser's downloads are no folder the app can open. */
      readonly inFolder: boolean;
    }
  | { readonly kind: 'failed'; readonly inFolder: boolean };

/** What Xuất Excel exports: the tables on screen, for the period and scope viewed. */
export interface ExportedReport {
  readonly rows: ReportRows;
  readonly period: Period;
  readonly viewing: ViewingText;
  readonly today: CalendarDate;
}

/**
 * Xuất Excel (mockup reports.html 2f): the exe writes the file into `exports\`, web mode downloads
 * it. A failure only says so; the data in the app is untouched.
 */
export function useReportExport() {
  const data = useAppData();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<ExportNotice | null>(null);

  const run = async ({ rows, period, viewing, today }: ExportedReport) => {
    setBusy(true);
    setNotice(null);
    try {
      const name = reportFileName(period, viewing.scope, today);
      const bytes = await buildReportWorkbook(rows, reportWorkbookMeta(viewing, today));
      const path = await data.exportFile(name, bytes);
      if (path === undefined) download(name, bytes);
      setNotice({
        kind: 'exported',
        sheets: reportSheetCount(rows),
        where: path ?? name,
        inFolder: path !== undefined,
      });
    } catch {
      setNotice({ kind: 'failed', inFolder: data.hasFile });
    } finally {
      setBusy(false);
    }
  };
  return { busy, notice, run };
}

/** The line under the Lọc bar after an export (mockup reports.html 2f). */
export function ExportNoticeLine({ notice }: { notice: ExportNotice }) {
  if (notice.kind === 'failed') {
    return (
      <p role="alert" className="m-0 flex flex-col text-sm">
        <b className="text-danger">{t('reports.exportFailed')}</b>
        <span className="text-fg-2">
          {t(notice.inFolder ? 'reports.exportFailedHelp' : 'reports.exportFailedHelpWeb')}
        </span>
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
