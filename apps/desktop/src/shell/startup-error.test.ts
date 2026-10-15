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

  it('says the file is damaged when its check fails, and how to go back to a backup (DR6-06)', () => {
    const cause = 'Tree 31 page 2463: btreeInitPage() returns error code 11';
    const message = startupMessage(new Error('DATA_DAMAGED', { cause }));
    expect(message).toEqual({
      title: 'File dữ liệu bị hỏng',
      help: startupMessage('database disk image is malformed').help,
      detail: cause,
    });
    expect(message.help).toContain('chép bản liền trước nó');
  });

  // Copying a backup over a file that is whole would lose the changes since that backup.
  it.each([
    [
      'FILE_IN_USE',
      {
        title: 'File dữ liệu đang bị chương trình khác giữ',
        help: 'File dữ liệu không hỏng, không cần khôi phục. Một chương trình khác (phần mềm sao lưu, đồng bộ, diệt virus hay công cụ mở file SQLite) đang mở file trong thư mục Project2C-data: hãy đóng chương trình đó rồi mở lại app.',
      },
    ],
    [
      'ACCESS_DENIED',
      {
        title: 'App không có quyền ghi vào thư mục dữ liệu',
        help: 'File dữ liệu không hỏng, không cần khôi phục. Hãy kiểm tra thư mục Project2C-data cạnh file exe và các file trong đó không chỉ đọc, tài khoản Windows đang dùng được quyền ghi vào đó (app chạy từ ổ chỉ đọc hay thư mục cần quyền quản trị như Program Files thì chép cả thư mục app sang chỗ khác), rồi mở lại app.',
      },
    ],
  ])('says the file is whole when it is out of reach (%s, DR6-07)', (error, expected) => {
    const message = startupMessage(error);
    expect(message).toEqual(expected);
    expect(message.help).not.toContain('chép bản mới nhất');
  });

  it('keeps the open-failed message and the detail for any other error', () => {
    expect(startupMessage('The system cannot find the path specified. (os error 3)')).toEqual({
      title: 'Không mở được file dữ liệu',
      help: expect.stringContaining('Project2C-data\\backups') as string,
      detail: 'The system cannot find the path specified. (os error 3)',
    });
    expect(startupMessage(new Error('ALREADY_OPEN elsewhere'))).toMatchObject({
      title: 'Không mở được file dữ liệu',
      detail: 'Error: ALREADY_OPEN elsewhere',
    });
  });
});
