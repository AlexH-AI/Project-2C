import { DbError } from '@p2c/db';
import { afterEach, describe, expect, it } from 'vitest';
import { setDataCurrency } from '../i18n/language';
import { startupFolder, startupMessage } from './startup-error';

/** A data folder Rust gave: the portable one of an exe on a USB stick. */
const FOLDER = 'E:\\Heritas L-CRM\\Project2C-data';

describe('startupMessage', () => {
  it('tells the user to use the window already open, without technical detail', () => {
    expect(startupMessage('ALREADY_OPEN', FOLDER)).toEqual({
      title: 'Project-2C đang mở ở một cửa sổ khác',
      help: 'Hãy dùng cửa sổ đó. App không đọc hay ghi gì ở cửa sổ này; đóng cửa sổ này đi. Nếu cửa sổ đó đang báo lỗi mở dữ liệu, hãy đóng cả hai cửa sổ rồi mở lại app.',
    });
  });

  it('asks for a newer app when the file comes from one, naming both schema versions', () => {
    expect(startupMessage(new DbError('SCHEMA_TOO_NEW', { version: 7, supported: 5 }))).toEqual({
      title: 'File dữ liệu do bản app mới hơn tạo',
      help: 'File dùng schema v7, app này chỉ đọc tới v5. App không thay đổi gì trong file. Hãy đóng cửa sổ này rồi dùng bản app mới hơn.',
    });
  });

  it('says the file is fine when only the startup backup failed, and why it failed', () => {
    const cause = 'There is not enough space on the disk. (os error 112)';
    expect(startupMessage(new Error('STARTUP_BACKUP_FAILED', { cause }), FOLDER)).toEqual({
      title: 'Không sao lưu được file dữ liệu',
      help: 'File dữ liệu không bị đổi, không cần khôi phục. App chép một bản vào thư mục backups của thư mục dữ liệu (E:\\Heritas L-CRM\\Project2C-data) trước khi mở: hãy kiểm tra ổ đĩa còn chỗ trống, thư mục đó không chỉ đọc hay bị chương trình khác giữ và tài khoản người dùng của máy đang dùng được quyền đọc, ghi thư mục đó, rồi đóng cửa sổ này và mở lại app.',
      detail: 'There is not enough space on the disk. (os error 112)',
    });
  });

  it('says the disk is full when the startup backup found no room (DR-57)', () => {
    expect(
      startupMessage(new Error('STARTUP_BACKUP_FAILED', { cause: 'DISK_FULL' }), FOLDER),
    ).toEqual({
      title: 'Ổ đĩa đã đầy, không sao lưu được file dữ liệu',
      help: 'File dữ liệu không bị đổi, không cần khôi phục. App chép một bản vào thư mục backups của thư mục dữ liệu trước khi mở nhưng ổ đĩa chứa thư mục dữ liệu (E:\\Heritas L-CRM\\Project2C-data) không còn đủ chỗ trống. Hãy xóa bớt file trên ổ đó (ví dụ các file cũ trong thư mục exports của thư mục dữ liệu), rồi đóng cửa sổ này và mở lại app.',
    });
  });

  it('warns that the newest backup may be the failing file itself (DR-51)', () => {
    const { help } = startupMessage('database disk image is malformed', FOLDER);
    expect(help).toContain('Bản mới nhất có thể chính là file đang lỗi');
    expect(help).toContain('chép bản liền trước nó');
  });

  it('says the file is damaged when its check fails, and how to go back to a backup (DR6-06)', () => {
    const cause = 'Tree 31 page 2463: btreeInitPage() returns error code 11';
    const message = startupMessage(new Error('DATA_DAMAGED', { cause }), FOLDER);
    expect(message).toEqual({
      title: 'File dữ liệu bị hỏng',
      help: startupMessage('database disk image is malformed', FOLDER).help,
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
        help: 'File dữ liệu không hỏng, không cần khôi phục. Một chương trình khác (phần mềm sao lưu, đồng bộ, diệt virus hay công cụ mở file SQLite) đang mở file trong thư mục dữ liệu của app (E:\\Heritas L-CRM\\Project2C-data): hãy đóng chương trình đó, rồi đóng cửa sổ này và mở lại app.',
      },
    ],
    [
      'ACCESS_DENIED',
      {
        title: 'App không có quyền ghi vào thư mục dữ liệu',
        help: 'File dữ liệu không hỏng, không cần khôi phục. Hãy kiểm tra thư mục dữ liệu (E:\\Heritas L-CRM\\Project2C-data) và các file trong đó không chỉ đọc hay bị khóa (macOS: mục Locked ở Get Info của Finder), tài khoản người dùng của máy đang dùng được quyền ghi và xóa file trong đó (exe portable chạy từ ổ chỉ đọc hay thư mục cần quyền quản trị như Program Files thì chép cả thư mục của exe sang chỗ khác), rồi đóng cửa sổ này và mở lại app.',
      },
    ],
    [
      'DATA_DIR_UNREACHABLE',
      {
        title: 'Không truy cập được thư mục dữ liệu Project2C-data',
        help: 'File dữ liệu không hỏng, không cần khôi phục. Thư mục Project2C-data cạnh exe là một link (junction) tới một thư mục không còn ở đó: ổ chứa thư mục đó (USB, ổ mạng) đã rút ra hay ngắt kết nối, hoặc thư mục đó đã bị xóa hay đổi tên. Hãy cắm hay nối lại ổ đó, hoặc sửa link cho trỏ tới đúng thư mục dữ liệu, rồi đóng cửa sổ này và mở lại app.',
      },
    ],
  ])(
    'says the file is whole when it is out of reach (%s, DR6-07, review of PR 1348)',
    (error, expected) => {
      const message = startupMessage(error, FOLDER);
      expect(message).toEqual(expected);
      expect(message.help).not.toContain('chép bản mới nhất');
    },
  );

  it('says in English that a Project2C-data leading nowhere needs no restoring (review of PR 1348)', () => {
    setDataCurrency('VND', 'en');
    expect(startupMessage('DATA_DIR_UNREACHABLE')).toEqual({
      title: 'Cannot reach the data folder Project2C-data',
      help: 'The data file is not damaged; there is nothing to restore. The Project2C-data folder next to the exe is a link (junction) to a folder that is no longer there: the drive that holds it (a USB stick, a network drive) was removed or disconnected, or that folder was deleted or renamed. Plug in or reconnect that drive, or fix the link so it points to the data folder, then close this window and open the app again.',
    });
  });

  it('names the data folder of each platform and mode only when Rust could not choose it (review of PR 1348)', () => {
    const modes =
      'Windows: %LOCALAPPDATA%\\com.heritas.lcrm, hoặc Project2C-data cạnh exe khi chạy portable; macOS: ~/Library/Application Support/com.heritas.lcrm';
    // The one page that tells to copy a backup by hand says where the backups are.
    expect(startupMessage('LOCALAPPDATA is missing or not an absolute path').help).toContain(
      `Các bản sao lưu tự động nằm trong thư mục backups của thư mục dữ liệu (${modes}): chép bản mới nhất thành project2c.db của thư mục dữ liệu để khôi phục`,
    );
    expect(startupMessage('database disk image is malformed', FOLDER).help).toContain(
      'Các bản sao lưu tự động nằm trong thư mục backups của thư mục dữ liệu (E:\\Heritas L-CRM\\Project2C-data): chép bản mới nhất',
    );
    expect(startupMessage('ACCESS_DENIED').help).toContain(`thư mục dữ liệu (${modes})`);
    expect(startupMessage('ACCESS_DENIED', FOLDER).help).not.toContain('LOCALAPPDATA');
  });

  const errors = [
    ['already open', 'ALREADY_OPEN'],
    ['file in use', 'FILE_IN_USE'],
    ['access denied', 'ACCESS_DENIED'],
    ['link to nowhere', 'DATA_DIR_UNREACHABLE'],
    ['backup failed', new Error('STARTUP_BACKUP_FAILED', { cause: 'os error 5' })],
    ['disk full', new Error('STARTUP_BACKUP_FAILED', { cause: 'DISK_FULL' })],
    ['damaged', new Error('DATA_DAMAGED', { cause: 'row 1 missing from index teams_active_name' })],
    ['too new', new DbError('SCHEMA_TOO_NEW', { version: 7, supported: 5 })],
    ['open failed', 'database disk image is malformed'],
  ] as const;

  // The page keeps the data folder locked until its window closes: an app opened again beside it
  // only says "use that window" (DR6-75).
  it.each(errors.filter(([name]) => name !== 'already open'))(
    'tells to close this window before the app is opened again (%s)',
    (_, error) => {
      expect(startupMessage(error, FOLDER).help).toContain('đóng cửa sổ này');
    },
  );

  // A slot left unfilled shows as is on the page (`fillSlots`).
  it.each(errors)('fills every slot of its message, folder known or not (%s)', (_, error) => {
    for (const folder of [FOLDER, undefined]) {
      expect(JSON.stringify(startupMessage(error, folder))).not.toMatch(/\{\w+\}/);
    }
  });

  it('tells to close both windows when the one already open shows a startup error (DR6-75)', () => {
    expect(startupMessage('ALREADY_OPEN').help).toContain(
      'Nếu cửa sổ đó đang báo lỗi mở dữ liệu, hãy đóng cả hai cửa sổ rồi mở lại app.',
    );
  });

  it('keeps the open-failed message and the detail for any other error', () => {
    expect(startupMessage('The system cannot find the path specified. (os error 3)')).toEqual({
      title: 'Không mở được file dữ liệu',
      help: expect.stringContaining('thư mục backups của thư mục dữ liệu') as string,
      detail: 'The system cannot find the path specified. (os error 3)',
    });
    expect(startupMessage(new Error('ALREADY_OPEN elsewhere'))).toMatchObject({
      title: 'Không mở được file dữ liệu',
      detail: 'Error: ALREADY_OPEN elsewhere',
    });
  });
});

describe('startupFolder', () => {
  it('is the data folder Rust chose, asked once the page shows', async () => {
    await expect(startupFolder({ dataFolder: () => Promise.resolve(FOLDER) })).resolves.toBe(
      FOLDER,
    );
  });

  it('is unknown when Rust could not choose it, or in web mode, never another error', async () => {
    await expect(
      startupFolder({ dataFolder: () => Promise.reject(new Error('DATA_DIR_UNREACHABLE')) }),
    ).resolves.toBeUndefined();
    await expect(startupFolder(undefined)).resolves.toBeUndefined();
  });
});

afterEach(() => setDataCurrency('VND', 'vi'));
