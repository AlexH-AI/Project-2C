import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from '@p2c/ui';

// `@p2c/ui` has no react-dom of its own, so its markup is checked from the app.
const classes = (html: string) => /class="([^"]*)"/.exec(html)?.[1]?.split(' ') ?? [];

describe('Button', () => {
  // Review of PR 946: one place for the look of a button that is off, by `disabled` or by
  // `aria-disabled` (which keeps the focus, DR6-154).
  it('looks off once `aria-disabled`, as once `disabled`', () => {
    const html = renderToStaticMarkup(<Button aria-disabled>Chọn file…</Button>);
    expect(html).toContain('aria-disabled="true"');
    expect(classes(html)).toEqual(
      expect.arrayContaining([
        'disabled:cursor-default',
        'disabled:opacity-50',
        'aria-disabled:cursor-default',
        'aria-disabled:opacity-50',
      ]),
    );
  });
});
