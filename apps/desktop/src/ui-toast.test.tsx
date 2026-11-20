import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Toast } from '@p2c/ui';

// `@p2c/ui` has no react-dom of its own, so its markup is checked from the app.
const classesOf = (html: string, tag: string) =>
  new RegExp(`<${tag} [^>]*class="([^"]*)"`).exec(html)?.[1]?.split(' ') ?? [];

describe('Toast', () => {
  // VA3b (components.html 08, `.toast` of ui2.css): 42 px on the focus layer, a capsule on macOS,
  // 8 px on Windows 11 (`toast-shape`, L205), rising as it shows (VA7a); what was done is marked
  // in green, an error in red, by a drawing no screen reader reads.
  it('is a capsule on the focus layer, one line high, its words breaking when too long', () => {
    const done = renderToStaticMarkup(<Toast text="Đã tạo lịch hẹn" />);
    const failed = renderToStaticMarkup(<Toast text="Khôi phục KH trước." tone="error" />);
    expect(classesOf(done, 'div')).toEqual(
      expect.arrayContaining(['pop', 'toast-shape', 'motion-toast', 'min-h-10.5', 'tabular-nums']),
    );
    expect(classesOf(done, 'span')).toContain('wrap-anywhere');
    expect(done).not.toContain('<button');
    expect(done).toContain('<svg aria-hidden="true"');
    expect(classesOf(done, 'svg')).toContain('text-ok');
    expect(classesOf(failed, 'svg')).toContain('text-danger');
  });

  it('draws its one button as a chip too, concentric with it, and names its ×', () => {
    const html = renderToStaticMarkup(
      <Toast
        text="Đã chuyển lịch hẹn vào Thùng rác"
        action={{ label: 'Hoàn tác', onClick: () => {} }}
        close={{ label: 'Đóng thông báo', onClick: () => {} }}
      />,
    );
    expect(classesOf(html, 'button')).toEqual(
      expect.arrayContaining(['btn-quiet', 'h-7', 'rounded-chip']),
    );
    expect(html).toMatch(/<button type="button" class="[^"]*">Hoàn tác<\/button>/);
    expect(html).toContain('aria-label="Đóng thông báo"');
  });
});
