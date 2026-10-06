import { describe, expect, it, vi } from 'vitest';
import { tauriStorage } from './tauri-storage';

describe('tauriStorage', () => {
  it('loads the file bytes; the app backs them up afterwards with db_backup', async () => {
    const invoke = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);
    const storage = tauriStorage(invoke, () => -420);

    expect(await storage.load()).toEqual(new Uint8Array([1, 2, 3]));
    expect(invoke).toHaveBeenCalledWith('db_open');
  });

  it('treats an empty reply as no file yet', async () => {
    const invoke = vi.fn().mockResolvedValue(new ArrayBuffer(0));

    expect(await tauriStorage(invoke, () => 0).load()).toBeUndefined();
  });

  it('saves by sending the raw bytes', async () => {
    const invoke = vi.fn().mockResolvedValue(null);
    const bytes = new Uint8Array([4, 5]);

    await tauriStorage(invoke, () => 0).save(bytes);

    expect(invoke).toHaveBeenCalledWith('db_save', bytes);
  });

  it('backs the saved file up under a local-time name and returns that name', async () => {
    const invoke = vi.fn().mockResolvedValue('project2c-20260927-101500.db');

    expect(await tauriStorage(invoke, () => -420).backup()).toBe('project2c-20260927-101500.db');
    // getTimezoneOffset is minutes behind UTC; Vietnam (UTC+7) reports -420.
    expect(invoke).toHaveBeenCalledWith('db_backup', { utcOffsetMinutes: 420 });
  });

  it('writes an export as raw bytes, the file name in a header, and returns the path', async () => {
    const invoke = vi.fn().mockResolvedValue('C:\\P2C\\Project2C-data\\exports\\a.p2cbackup');
    const bytes = new Uint8Array([7]);

    const path = await tauriStorage(invoke, () => 0).writeExport('a.p2cbackup', bytes);

    expect(path).toBe('C:\\P2C\\Project2C-data\\exports\\a.p2cbackup');
    expect(invoke).toHaveBeenCalledWith('export_write', bytes, {
      headers: { 'x-p2c-file-name': 'a.p2cbackup' },
    });
  });

  it('asks for the newest backup name; null means none', async () => {
    const invoke = vi.fn().mockResolvedValueOnce('project2c-s00000003-20260930-080000.db');
    const storage = tauriStorage(invoke, () => 0);

    expect(await storage.latestBackup()).toBe('project2c-s00000003-20260930-080000.db');
    expect(invoke).toHaveBeenCalledWith('db_latest_backup');
    invoke.mockResolvedValueOnce(null);
    expect(await storage.latestBackup()).toBeUndefined();
  });

  it('opens a folder by its kind, never by a path', async () => {
    const invoke = vi.fn().mockResolvedValue(null);

    await tauriStorage(invoke, () => 0).openFolder('backups');

    expect(invoke).toHaveBeenCalledWith('open_folder', { kind: 'backups' });
  });
});
