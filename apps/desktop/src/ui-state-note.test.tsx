import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StateNote } from '@p2c/ui';

// `@p2c/ui` has no react-dom of its own, so its markup is checked from the app.
const classesOf = (html: string, tag: string) =>
  new RegExp(`<${tag} [^>]*class="([^"]*)"`).exec(html)?.[1]?.split(' ') ?? [];

/** Every class of the markup but those of its mark, the circle around the icon. */
const classesOutsideMark = (html: string) =>
  [...html.replace(/<span aria-hidden="true".*?<\/svg><\/span>/, '').matchAll(/class="([^"]*)"/g)]
    .flatMap(([, list]) => list?.split(' ') ?? [])
    .filter((name) => name.includes('danger'));

describe('StateNote', () => {
  // VA3c (components.html 09, `.empty` of ui2.css section 11): a mark, a line saying what is not
  // here, a line saying what to do next, then the button.
  it('draws the whole screen centred: the mark over the title, the next step and the button', () => {
    const html = renderToStaticMarkup(
      <StateNote
        size="screen"
        icon="calendar"
        title="Chưa có lịch hẹn nào"
        next="Tạo lịch hẹn đầu tiên."
        action={<button type="button">Lịch hẹn</button>}
      />,
    );
    expect(classesOf(html, 'div')).toEqual(expect.arrayContaining(['justify-items-center']));
    expect(classesOf(html, 'span')).toEqual(expect.arrayContaining(['size-13', 'rounded-full']));
    expect(html).toMatch(/<svg aria-hidden="true"/);
    expect(html).toContain('<b class="text-lg font-semibold">Chưa có lịch hẹn nào</b>');
    expect(html).toMatch(/<p [^>]*>Tạo lịch hẹn đầu tiên\.<\/p>/);
    expect(html).toMatch(/<button type="button">Lịch hẹn<\/button>/);
    // Not an alert, and no role of its own: an empty place is no news.
    expect(html).not.toContain('role=');
  });

  it('draws the one of a card and of a table in a row: mark, words, then the button', () => {
    for (const size of ['card', 'table'] as const) {
      const html = renderToStaticMarkup(
        <StateNote size={size} icon="info" title="KH chưa có hợp đồng" next="Ghi HĐ nộp." />,
      );
      expect(classesOf(html, 'div')).toEqual(
        expect.arrayContaining(['flex', 'items-center', 'text-left']),
      );
      expect(classesOf(html, 'span')).toEqual(expect.arrayContaining(['size-9', 'rounded-full']));
      expect(html).toContain('<b class="text-md font-semibold">KH chưa có hợp đồng</b>');
    }
    // A table gives the room of its cells; a card adds its own.
    const row = (size: 'card' | 'table') =>
      classesOf(renderToStaticMarkup(<StateNote size={size} icon="info" title="x" />), 'div');
    expect(row('table')).toContain('py-1.5');
    expect(row('card')).toContain('pt-3.5');
  });

  it('leaves out the next step, the button and the detail it is not given', () => {
    const html = renderToStaticMarkup(
      <StateNote size="card" icon="info" title="Team chưa có RM." />,
    );
    expect(html).not.toContain('<p ');
    expect(html).not.toContain('<code');
    expect(html).not.toContain('<button');
  });

  // components.html 10: an error has the shape of an empty place, red on its mark only.
  it('is an alert when an error, red on its mark alone', () => {
    const failed = renderToStaticMarkup(
      <StateNote
        size="screen"
        tone="error"
        icon="alert"
        heading={2}
        title="Màn này gặp lỗi và không hiển thị được"
        next="Dữ liệu đã lưu không bị ảnh hưởng."
        detail={{ label: 'Chi tiết kỹ thuật:', text: 'TypeError: x is undefined' }}
      />,
    );
    expect(failed).toMatch(/^<div role="alert"/);
    expect(classesOf(failed, 'span')).toEqual(expect.arrayContaining(['text-danger']));
    expect(classesOutsideMark(failed)).toEqual([]);
    expect(failed).toContain(
      '<h2 class="m-0 text-lg font-semibold">Màn này gặp lỗi và không hiển thị được</h2>',
    );
    // The technical detail is in the font of code, and can be selected to copy.
    expect(failed).toMatch(
      /<p class="[^"]*select-text[^"]*">Chi tiết kỹ thuật: <code>TypeError: x is undefined<\/code><\/p>/,
    );

    const empty = renderToStaticMarkup(<StateNote size="screen" icon="alert" title="x" />);
    expect(empty).not.toContain('danger');
  });
});
