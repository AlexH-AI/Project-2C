import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Choices } from '@p2c/ui';

// `@p2c/ui` has no react-dom of its own, so its markup is checked from the app.
const choices = (required?: boolean) =>
  renderToStaticMarkup(
    <Choices
      label="Trạng thái"
      options={[
        { value: 'met', label: 'Đã gặp' },
        { value: 'cancelled', label: 'Hủy' },
      ]}
      value={null}
      onChange={() => {}}
      required={required}
    />,
  );

describe('Choices', () => {
  it('tells assistive technology that a required group needs an answer', () => {
    const html = choices(true);
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('aria-required="true"');
  });

  it('does not mark an optional group', () => {
    expect(choices()).not.toContain('aria-required');
  });
});
