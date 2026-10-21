import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SaveFailed } from './SaveWarning';

describe('SaveFailed', () => {
  it('names a program holding the file as the likely cause of a failed save', () => {
    const html = renderToStaticMarkup(<SaveFailed error="Access is denied. (os error 5)" />);
    expect(html).toContain('role="alert"');
    expect(html).toContain('file có thể đang mở trong chương trình khác');
  });

  it('tells to free some room when the disk is full, not to look for a program (DR6-07)', () => {
    const html = renderToStaticMarkup(<SaveFailed error="DISK_FULL" />);
    expect(html).toContain('role="alert"');
    expect(html).toContain(
      'Chưa lưu được dữ liệu vào file: ổ đĩa chứa thư mục app đã đầy. Hãy xóa bớt file trên ổ đó (ví dụ các file cũ trong Project2C-data\\exports). Dữ liệu vẫn còn trong app và sẽ được lưu lại ở lần thay đổi tiếp theo.',
    );
    expect(html).not.toContain('chương trình khác');
  });

  it('tells to lift the read-only state or the refusal when the file can no longer be replaced, not to look for a program (DR6-120)', () => {
    const html = renderToStaticMarkup(<SaveFailed error="READ_ONLY" />);
    expect(html).toContain('role="alert"');
    expect(html).toContain(
      'Chưa lưu được dữ liệu vào file: file Project2C-data\\project2c.db đang ở chế độ chỉ đọc, hoặc tài khoản Windows đang dùng không có quyền ghi / xóa file đó. Hãy bỏ chế độ chỉ đọc (chuột phải file → Properties → bỏ chọn Read-only) hoặc nhờ người quản trị máy cấp lại quyền. Dữ liệu vẫn còn trong app và sẽ được lưu lại ở lần thay đổi tiếp theo.',
    );
    expect(html).not.toContain('chương trình khác');
  });
});
