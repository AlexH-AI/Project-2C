import { createTeam } from '@p2c/db';
import { calendarDate } from '@p2c/domain';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { openAppData } from '../data/app-data';
import { AppDataContext } from '../data/AppDataContext';
import { tauriStorage } from '../data/tauri-storage';
import { DataFileSection } from './SettingsDataFile';

/**
 * The card "File dữ liệu" of an app opened through the Rust commands, answered by a stand-in that
 * gives `folder` as the data folder (a first start: no file yet); web mode without `folder`.
 */
async function card(folder?: string): Promise<string> {
  const commands: Record<string, unknown> = {
    db_open: new ArrayBuffer(0),
    data_folder: folder,
    db_save: null,
  };
  const invoke = vi.fn((command: string) => Promise.resolve(commands[command]));
  const app = await openAppData({
    storage: folder === undefined ? undefined : tauriStorage(invoke, () => 0, 'page-1'),
    today: () => calendarDate(2026, 11, 16),
    seed: (db) => createTeam(db, { name: 'Sao Mai' }),
  });
  if (folder !== undefined) expect(invoke).toHaveBeenCalledWith('data_folder');
  return renderToStaticMarkup(
    <AppDataContext.Provider value={app}>
      <DataFileSection />
    </AppDataContext.Provider>,
  ).replace(/<[^>]*>/g, ' ');
}

describe('DataFileSection (mockup settings-data)', () => {
  it('shows where the file and the backups really are, in the folder Rust gives (Mac-5a)', async () => {
    const installed = await card('C:\\Users\\An\\AppData\\Local\\com.heritas.lcrm');
    expect(installed).toContain('Vị trí');
    expect(installed).toContain('C:\\Users\\An\\AppData\\Local\\com.heritas.lcrm\\project2c.db');
    expect(installed).toContain('C:\\Users\\An\\AppData\\Local\\com.heritas.lcrm\\backups\\');
    expect(installed).not.toContain('Project2C-data');
    expect(installed).not.toContain('cạnh file exe');

    const portable = await card('D:\\Heritas L-CRM\\Project2C-data');
    expect(portable).toContain('D:\\Heritas L-CRM\\Project2C-data\\project2c.db');
    expect(portable).toContain('D:\\Heritas L-CRM\\Project2C-data\\backups\\');

    const mac = await card('/Users/an/Library/Application Support/com.heritas.lcrm');
    expect(mac).toContain('/Users/an/Library/Application Support/com.heritas.lcrm/project2c.db');
    expect(mac).toContain('/Users/an/Library/Application Support/com.heritas.lcrm/backups/');
  });

  it('has no Vị trí nor backups in web mode, which keeps the data in the browser', async () => {
    const web = await card();
    expect(web).not.toContain('Vị trí');
    expect(web).not.toContain('Backup tự động');
    expect(web).toContain('Bản web — dữ liệu chỉ trong trình duyệt, mất khi tải lại trang');
  });
});
