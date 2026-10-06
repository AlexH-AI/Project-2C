import { DbError } from '@p2c/db';
import { describe, expect, it } from 'vitest';
import { startupMessage } from './startup-error';

describe('startupMessage', () => {
  it('tells the user to use the window already open, without technical detail', () => {
    expect(startupMessage('ALREADY_OPEN')).toEqual({
      title: 'Project-2C đang mở ở một cửa sổ khác',
      help: 'Hãy dùng cửa sổ đó. App không đọc hay ghi gì ở cửa sổ này; đóng cửa sổ này đi.',
    });
  });

  it('asks for a newer app when the file comes from one, naming both schema versions', () => {
    expect(startupMessage(new DbError('SCHEMA_TOO_NEW', { version: 7, supported: 5 }))).toEqual({
      title: 'File dữ liệu do bản app mới hơn tạo',
      help: 'File dùng schema v7, app này chỉ đọc tới v5. Hãy dùng bản app mới hơn. App không thay đổi gì trong file.',
    });
  });

  it('says the file is fine when only the startup backup failed, and why it failed', () => {
    const cause = 'There is not enough space on the disk. (os error 112)';
    expect(startupMessage(new Error('STARTUP_BACKUP_FAILED', { cause }))).toEqual({
      title: 'Không sao lưu được file dữ liệu',
      help: 'File dữ liệu không bị đổi, không cần khôi phục. App chép một bản vào Project2C-data\\backups trước khi mở: hãy kiểm tra ổ đĩa còn chỗ trống và thư mục đó không chỉ đọc hay bị chương trình khác giữ, rồi mở lại app.',
      detail: 'There is not enough space on the disk. (os error 112)',
    });
  });

  it('says the disk is full when the startup backup found no room (DR-57)', () => {
    expect(startupMessage(new Error('STARTUP_BACKUP_FAILED', { cause: 'DISK_FULL' }))).toEqual({
      title: 'Ổ đĩa đã đầy, không sao lưu được file dữ liệu',
      help: 'File dữ liệu không bị đổi, không cần khôi phục. App chép một bản vào Project2C-data\\backups trước khi mở nhưng ổ đĩa chứa thư mục app không còn đủ chỗ trống. Hãy xóa bớt file trên ổ đó (ví dụ các file cũ trong Project2C-data\\exports) rồi mở lại app.',
    });
  });

  it('warns that the newest backup may be the failing file itself (DR-51)', () => {
    const { help } = startupMessage('database disk image is malformed');
    expect(help).toContain('Bản mới nhất có thể chính là file đang lỗi');
    expect(help).toContain('chép bản liền trước nó');
  });

  it('keeps the open-failed message and the detail for any other error', () => {
    expect(startupMessage('Access is denied. (os error 5)')).toEqual({
      title: 'Không mở được file dữ liệu',
      help: expect.stringContaining('Project2C-data\\backups') as string,
      detail: 'Access is denied. (os error 5)',
    });
    expect(startupMessage(new Error('ALREADY_OPEN elsewhere'))).toMatchObject({
      title: 'Không mở được file dữ liệu',
      detail: 'Error: ALREADY_OPEN elsewhere',
    });
  });
});
