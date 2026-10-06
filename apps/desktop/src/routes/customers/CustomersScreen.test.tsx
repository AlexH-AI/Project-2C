import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StageHead } from './CustomersScreen';

// DR-68: an open column groups its thousands like the closed blocks and every `{count}` slot.
describe('StageHead', () => {
  it('shows the count of a column with its thousands grouped', () => {
    const html = renderToStaticMarkup(<StageHead stage="N4" count={1234} className="" />);
    expect(html).toContain('>1.234</span>');
  });
});
