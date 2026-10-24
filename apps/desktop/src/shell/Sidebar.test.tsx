import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { SaveStatus } from '../data/persist-queue';
import { SaveStateLine } from './Sidebar';

const SAVED: SaveStatus = { saving: false, failed: false, error: undefined, lastSave: undefined };

/** What the line says, its markup left out. */
const said = (status: SaveStatus | undefined) =>
  renderToStaticMarkup(<SaveStateLine status={status} />).replace(/<[^>]*>/g, '');

describe('SaveStateLine (mockup settings-data 10d)', () => {
  it('says when the last save ended, as HH:MM local time', () => {
    const lastSave = { at: new Date(2026, 9, 25, 7, 42, 59), size: 4096 };
    expect(said({ ...SAVED, lastSave })).toBe('Đã lưu 07:42');
  });

  it('says it is saved, with no time, before the first save of the session', () => {
    expect(said(SAVED)).toBe('Đã lưu');
  });

  it('says it is saving while a write runs, also after a failed one', () => {
    expect(said({ ...SAVED, saving: true })).toBe('Đang lưu…');
    expect(said({ ...SAVED, saving: true, failed: true, error: 'DISK_FULL' })).toBe('Đang lưu…');
  });

  it('says the data is not in the file while the last save failed, whatever the cause', () => {
    for (const error of ['DISK_FULL', 'Access is denied. (os error 5)']) {
      expect(said({ ...SAVED, failed: true, error }), error).toBe('Chưa lưu được vào file');
    }
  });

  it('says web mode keeps the data in the browser only', () => {
    expect(said(undefined)).toBe('Bản web — dữ liệu chỉ trong trình duyệt, mất khi tải lại trang');
  });
});
