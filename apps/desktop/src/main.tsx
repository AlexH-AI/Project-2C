import { invoke, isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { parseDate } from '@p2c/domain';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { App } from './App';
import { tauriOpenCode } from './data/ai-tauri';
import { openAppData } from './data/app-data';
import { fetchDemoSnapshot } from './data/demo-snapshot';
import { tauriStorage } from './data/tauri-storage';
import { t } from './i18n';
import { blockReload } from './shell/block-reload';
import { StartupError } from './shell/StartupError';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element');
const root = createRoot(rootElement);
const render = (node: ReactNode) => root.render(<StrictMode>{node}</StrictMode>);

// A new database gets simulated data anchored today; e2e builds pin the day (spec §7).
const pinnedDay = parseDate(String(import.meta.env.VITE_DEMO_ANCHOR ?? ''));

render(<p className="px-6 py-8 text-sm text-fg-2">{t('startup.loading')}</p>);

if (isTauri()) blockReload(window);

// Opened once, outside React: StrictMode would otherwise open (and back up) the file twice.
// The exe backs the file up once it opened, then saves (DR-51).
// The exe keeps the database in Project2C-data\; web mode keeps it in memory (ADR-0016).
openAppData({
  storage: isTauri() ? tauriStorage(invoke) : undefined,
  locateFile: () => wasmUrl,
  today: pinnedDay ? () => pinnedDay : undefined,
  // e2e serves the pinned day's data already seeded (DR-79); without the file the app seeds.
  snapshot: pinnedDay && !isTauri() ? (day) => fetchDemoSnapshot(day) : undefined,
  // OpenCode needs Rust; web mode runs the Mock only (spec Phase 5 §4.1).
  ai: isTauri() ? { opencode: tauriOpenCode(invoke) } : undefined,
}).then(
  (data) => render(<App data={data} appWindow={isTauri() ? getCurrentWindow() : undefined} />),
  (error: unknown) => render(<StartupError error={error} />),
);
