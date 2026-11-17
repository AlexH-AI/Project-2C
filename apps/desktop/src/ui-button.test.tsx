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
        'disabled:cursor-not-allowed',
        'disabled:opacity-45',
        'aria-disabled:cursor-not-allowed',
        'aria-disabled:opacity-45',
      ]),
    );
  });

  // VA2 (components.html 01): one height and the corner of a control, or the compact size; the
  // paint of its level, with its states, is one class of theme.css.
  it('is 34 px with the paint of its level, the secondary one unless told', () => {
    const secondary = classes(renderToStaticMarkup(<Button>Hủy</Button>));
    expect(secondary).toEqual(
      expect.arrayContaining(['press', 'h-8.5', 'rounded-control', 'px-3.5', 'btn-default']),
    );
    for (const variant of ['primary', 'danger', 'quiet'] as const) {
      const level = classes(renderToStaticMarkup(<Button variant={variant}>Lưu</Button>));
      expect(level, variant).toContain(`btn-${variant}`);
      expect(level, variant).not.toContain('btn-default');
      // Text alone sits closer to its edge.
      expect(level, variant).toContain(variant === 'quiet' ? 'px-2.5' : 'px-3.5');
    }
  });

  it('is 28 px at the smaller corner when compact, whatever its level', () => {
    for (const variant of ['default', 'quiet'] as const) {
      const compact = classes(
        renderToStaticMarkup(
          <Button size="sm" variant={variant}>
            Thử lại
          </Button>,
        ),
      );
      expect(compact, variant).toEqual(
        expect.arrayContaining(['h-7', 'rounded-control-sm', 'px-2.75', 'text-sm']),
      );
      expect(compact, variant).not.toContain('h-8.5');
      expect(compact, variant).not.toContain('rounded-control');
    }
  });
});
