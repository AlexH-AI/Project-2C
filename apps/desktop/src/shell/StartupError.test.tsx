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

// VA3c (components.html 10): the error of the whole app has the shape of every error, red on its
// mark only; its words and its technical detail are as before.
describe('the shape of the startup page', () => {
  it('is an alert under the one heading of the page, red on its mark alone', () => {
    const page = renderToStaticMarkup(<StartupError error={new Error('boom')} folder={FOLDER} />);
    expect(page).toMatch(/^<main [^>]*><div role="alert"/);
    expect(page).toMatch(/<h1 class="[^"]*">Không mở được file dữ liệu<\/h1>/);
    expect(page).toContain('Chi tiết kỹ thuật: <code>Error: boom</code>');
    const marked = page.replace(/<span aria-hidden="true".*?<\/svg><\/span>/, '');
    expect(page).toContain('text-danger');
    expect(marked).not.toContain('danger');
  });

  it('has no technical detail when the message alone says what to do', () => {
    const page = renderToStaticMarkup(<StartupError error="FILE_IN_USE" folder={FOLDER} />);
    expect(page).not.toContain('<code>');
    expect(page).not.toContain('Chi tiết kỹ thuật');
  });
});
