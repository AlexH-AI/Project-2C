import { invoke, isTauri } from '@tauri-apps/api/core';
import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { App } from './App';
import { openAppData } from './data/app-data';
import { tauriStorage } from './data/tauri-storage';
import { StartupError } from './shell/StartupError';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element');
const root = createRoot(rootElement);
const render = (node: ReactNode) => root.render(<StrictMode>{node}</StrictMode>);

// Opened once, outside React: StrictMode would otherwise open (and back up) the file twice.
// The exe keeps the database in Project2C-data\; web mode keeps it in memory (ADR-0016).
openAppData({
  storage: isTauri() ? tauriStorage(invoke) : undefined,
  locateFile: () => wasmUrl,
}).then(
  (data) => render(<App data={data} />),
  (error: unknown) => render(<StartupError error={error} />),
);
