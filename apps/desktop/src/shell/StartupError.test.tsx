import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StartupError, startupErrorPage } from './StartupError';

const FOLDER = 'E:\\Heritas L-CRM\\Project2C-data';

describe('StartupError', () => {
  it('names the data folder Rust gave in its help (L185)', () => {
    const page = renderToStaticMarkup(<StartupError error="FILE_IN_USE" folder={FOLDER} />);
    expect(page).toContain('trong thư mục dữ liệu của app (E:\\Heritas L-CRM\\Project2C-data)');
  });
});

describe('startupErrorPage', () => {
  // The page `main.tsx` shows when the app cannot start: it asks the storage for the real data
  // folder (L205).
  it('names the data folder the storage gives', async () => {
    const storage = { dataFolder: () => Promise.resolve(FOLDER) };
    const page = renderToStaticMarkup(await startupErrorPage('ACCESS_DENIED', storage));
    expect(page).toContain('thư mục dữ liệu (E:\\Heritas L-CRM\\Project2C-data)');
  });

  it('names the folder of each platform and mode when the storage cannot give one', async () => {
    const storage = { dataFolder: () => Promise.reject(new Error('DATA_DIR_UNREACHABLE')) };
    const page = renderToStaticMarkup(await startupErrorPage('ACCESS_DENIED', storage));
    expect(page).toContain('thư mục dữ liệu (Windows: %LOCALAPPDATA%\\com.heritas.lcrm');
  });
});
