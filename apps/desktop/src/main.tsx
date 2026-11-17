import { invoke, isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { parseDate } from '@p2c/domain';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { tauriOpenCode } from './data/ai-tauri';
import { openAppData } from './data/app-data';
import { fetchDemoSnapshot } from './data/demo-snapshot';
import { tauriStorage } from './data/tauri-storage';
import { t } from './i18n';
import { appLanguage, setDataCurrency } from './i18n/language';
import { blockReload } from './shell/block-reload';
import { startupErrorPage } from './shell/StartupError';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element');
const root = createRoot(rootElement);
const render = (node: ReactNode) => root.render(<StrictMode>{node}</StrictMode>);

// A new database gets simulated data anchored today; e2e builds pin the day (spec §7).
const pinnedDay = parseDate(String(import.meta.env.VITE_DEMO_ANCHOR ?? ''));

// The machine's language until the data opens (ADR-0018 §1); `index.html` says `vi`.
document.documentElement.lang = appLanguage();

render(<p className="px-6 py-8 text-sm text-fg-2">{t('startup.loading')}</p>);

if (isTauri()) blockReload(window);

// The exe keeps the database in the data folder of its platform and mode (ADR-0019 §2); web mode
// keeps it in memory (ADR-0016).
const storage = isTauri() ? tauriStorage(invoke) : undefined;

// Opened once, outside React: StrictMode would otherwise open (and back up) the file twice.
// The exe backs the file up once it opened, then saves (DR-51).
async function start(): Promise<ReactNode> {
  const data = await openAppData({
    storage,
    locateFile: () => wasmUrl,
    today: pinnedDay ? () => pinnedDay : undefined,
    // e2e serves the pinned day's data already seeded (DR-79); without the file the app seeds.
    snapshot: pinnedDay && !isTauri() ? (day) => fetchDemoSnapshot(day) : undefined,
    // OpenCode needs Rust; web mode runs the Mock only (spec Phase 5 §4.1).
    ai: isTauri() ? { opencode: tauriOpenCode(invoke) } : undefined,
  });
  // Read by the perf probe (e2e/perf): opening the app, from the page's start to its data.
  performance.mark('p2c:data-open');
  // The language goes with the currency of the data (ADR-0018 §1). The screens load only now:
  // their modules build labels as they load (`PERIOD_LABELS`), in the language set here.
  setDataCurrency(data.currency);
  document.documentElement.lang = appLanguage();
  const { App } = await import('./App');
  return <App data={data} appWindow={isTauri() ? getCurrentWindow() : undefined} />;
}

// The page names the data folder Rust chose, when it could choose one (L185).
start().then(render, async (error: unknown) => render(await startupErrorPage(error, storage)));
