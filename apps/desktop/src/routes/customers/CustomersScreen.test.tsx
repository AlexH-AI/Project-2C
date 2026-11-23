import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StageHead } from './CustomersScreen';

// DR-68: an open column groups its thousands like the closed blocks and every `{count}` slot.
describe('StageHead', () => {
  it('shows the count of a column with its thousands grouped', () => {
    const html = renderToStaticMarkup(<StageHead stage="N4" count={1234} className="" />);
    expect(html).toContain('>1,234</span>');
  });

  // C1 (mockup search-rm-team.html #customers): while searching, the head says how many match,
  // before the count of the column, which stays its last number.
  it('says how many cards match while searching, the count of the column last', () => {
    const html = renderToStaticMarkup(<StageHead stage="N4" count={1234} found={3} className="" />);
    expect(html).toMatch(/>3 khớp<\/span><span[^>]*>1,234<\/span><\/div>$/);
    expect(renderToStaticMarkup(<StageHead stage="N4" count={9} className="" />)).not.toContain(
      'khớp',
    );
  });
});
