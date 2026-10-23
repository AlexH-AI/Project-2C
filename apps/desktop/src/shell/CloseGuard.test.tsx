import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CloseDialog } from './CloseGuard';

const body = (error: unknown) =>
  renderToStaticMarkup(<CloseDialog error={error} onChoose={() => {}} />);

describe('CloseDialog', () => {
  it('names a program holding the file for any failure but the two it tells apart', () => {
    const html = body('Access is denied. (os error 5)');
    expect(html).toContain('Chưa lưu được thay đổi');
    expect(html).toContain(
      'Các thay đổi gần nhất chưa ghi được vào file (file có thể đang bị chương trình khác mở). Đóng chương trình đó rồi chọn Thử lại, hoặc đóng app và bỏ các thay đổi chưa lưu.',
    );
    expect(body(undefined)).toContain('file có thể đang bị chương trình khác mở');
  });

  it('tells to free some room when the disk is full, not to close a program (DR6-07)', () => {
    const html = body('DISK_FULL');
    expect(html).toContain(
      'Các thay đổi gần nhất chưa ghi được vào file vì ổ đĩa chứa thư mục app đã đầy. Hãy xóa bớt file trên ổ đó (ví dụ các file cũ trong Project2C-data\\exports) rồi chọn Thử lại, hoặc đóng app và bỏ các thay đổi chưa lưu.',
    );
    expect(html).not.toContain('chương trình khác');
  });

  it('tells to lift the read-only state or the refusal when the file can no longer be replaced, not to close a program (DR6-120)', () => {
    const html = body('READ_ONLY');
    expect(html).toContain(
      'Các thay đổi gần nhất chưa ghi được vào file vì file Project2C-data\\project2c.db đang ở chế độ chỉ đọc, hoặc tài khoản Windows đang dùng không có quyền ghi / xóa file đó. Hãy bỏ chế độ chỉ đọc (chuột phải file → Properties → bỏ chọn Read-only) hoặc nhờ người quản trị máy cấp lại quyền, rồi chọn Thử lại. Hoặc đóng app và bỏ các thay đổi chưa lưu.',
    );
    expect(html).not.toContain('chương trình khác');
  });

  it('tells to have the right to write in the data folder given back when it lets no new file in, not to close a program nor to look at the file (DR6-120)', () => {
    const html = body('FOLDER_READ_ONLY');
    expect(html).toContain(
      'Các thay đổi gần nhất chưa ghi được vào file vì thư mục Project2C-data không cho tài khoản Windows đang dùng tạo file mới trong đó. Hãy nhờ người quản trị máy cấp lại quyền ghi vào thư mục đó rồi chọn Thử lại. Hoặc đóng app và bỏ các thay đổi chưa lưu.',
    );
    expect(html).not.toContain('chương trình khác');
    expect(html).not.toContain('chỉ đọc');
  });

  it('keeps both ways out whatever the cause', () => {
    for (const error of [undefined, 'DISK_FULL', 'READ_ONLY', 'FOLDER_READ_ONLY']) {
      const html = body(error);
      expect(html, String(error)).toContain('Thử lại');
      expect(html, String(error)).toContain('Đóng và bỏ thay đổi chưa lưu');
    }
  });
});
