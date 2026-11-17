import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CloseDialog, closeRequests } from './CloseGuard';

describe('closeRequests', () => {
  const request = () => ({ preventDefault: vi.fn() });
  /** A closing that stays under way until `settle` ends it. */
  const closing = () => {
    let settle!: { done: () => void; fail: (error: Error) => void };
    const close = vi.fn(
      () =>
        new Promise<void>((done, fail) => {
          settle = { done, fail };
        }),
    );
    return { close, settle: () => settle };
  };

  it('never lets a request close the window itself, the first one included', async () => {
    const first = request();
    await closeRequests(() => Promise.resolve())(first);
    expect(first.preventDefault).toHaveBeenCalledOnce();
  });

  it('starts no second closing for a click while the first is under way, and holds that click too (DR6-206)', async () => {
    const { close, settle } = closing();
    const onRequest = closeRequests(close);
    const first = onRequest(request());
    const again = request();
    const second = onRequest(again);
    expect(close).toHaveBeenCalledOnce();
    expect(again.preventDefault).toHaveBeenCalledOnce();
    settle().done();
    await Promise.all([first, second]);
  });

  it('closes again for the next click once the question was left unanswered', async () => {
    const { close, settle } = closing();
    const onRequest = closeRequests(close);
    const first = onRequest(request());
    settle().done();
    await first;
    void onRequest(request());
    expect(close).toHaveBeenCalledTimes(2);
  });

  it('tries again for the next click when closing failed (review of PR 125)', async () => {
    const { close, settle } = closing();
    const onRequest = closeRequests(close);
    const first = onRequest(request());
    settle().fail(new Error('the window is gone'));
    await expect(first).rejects.toThrow('the window is gone');
    void onRequest(request());
    expect(close).toHaveBeenCalledTimes(2);
  });
});

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
      'Các thay đổi gần nhất chưa ghi được vào file vì ổ đĩa chứa thư mục dữ liệu đã đầy. Hãy xóa bớt file trên ổ đó (ví dụ các file cũ trong thư mục exports của thư mục dữ liệu, đường dẫn ở Cài đặt → Dữ liệu) rồi chọn Thử lại, hoặc đóng app và bỏ các thay đổi chưa lưu.',
    );
    expect(html).not.toContain('chương trình khác');
  });

  it('tells to lift the read-only state or the refusal when the file can no longer be replaced, not to close a program (DR6-120)', () => {
    const html = body('READ_ONLY');
    expect(html).toContain(
      'Các thay đổi gần nhất chưa ghi được vào file vì file dữ liệu (Cài đặt → Dữ liệu → Vị trí) đang ở chế độ chỉ đọc hay bị khóa, hoặc tài khoản người dùng của máy đang dùng không có quyền ghi / xóa file đó. Hãy bỏ chế độ chỉ đọc (Windows: chuột phải file → Properties → bỏ chọn Read-only; macOS: chọn file trong Finder → Get Info → bỏ chọn Locked, cho quyền Read &amp; Write) hoặc nhờ người quản trị máy cấp lại quyền, rồi chọn Thử lại. Hoặc đóng app và bỏ các thay đổi chưa lưu.',
    );
    expect(html).not.toContain('chương trình khác');
  });

  it('tells to have the right to write in the data folder given back when it lets no new file in, not to close a program nor to look at the file (DR6-120)', () => {
    const html = body('FOLDER_READ_ONLY');
    expect(html).toContain(
      'Các thay đổi gần nhất chưa ghi được vào file vì thư mục dữ liệu (đường dẫn ở Cài đặt → Dữ liệu) không cho tài khoản người dùng của máy đang dùng tạo file mới trong đó. Hãy nhờ người quản trị máy cấp lại quyền ghi vào thư mục đó rồi chọn Thử lại. Hoặc đóng app và bỏ các thay đổi chưa lưu.',
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
