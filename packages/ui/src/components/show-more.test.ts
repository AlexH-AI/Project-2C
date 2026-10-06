import { describe, expect, it } from 'vitest';
import { SHOW_MORE_STEP, showMore } from './show-more';

const rows = (count: number) => Array.from({ length: count }, (_, index) => index);

describe('showMore', () => {
  it('shows a hundred rows at a time', () => {
    expect(SHOW_MORE_STEP).toBe(100);
  });

  it('has no foot for a hundred rows or fewer', () => {
    for (const count of [0, 1, 99, 100]) {
      const result = showMore(rows(count), SHOW_MORE_STEP);
      expect(result.visible).toEqual(rows(count));
      expect(result.foot).toEqual({ kind: 'none' });
    }
  });

  it('cuts the given rows, in their order, to the first hundred', () => {
    const sorted = rows(7071).reverse();
    const { visible, foot } = showMore(sorted, SHOW_MORE_STEP);
    expect(visible).toEqual(sorted.slice(0, 100));
    expect(foot).toEqual({ kind: 'more', shown: 100, total: 7071, next: 100 });
  });

  it('offers only the rows left on the last click', () => {
    expect(showMore(rows(7071), 7000).foot).toEqual({
      kind: 'more',
      shown: 7000,
      total: 7071,
      next: 71,
    });
    expect(showMore(rows(101), 100).foot).toEqual({
      kind: 'more',
      shown: 100,
      total: 101,
      next: 1,
    });
  });

  it('says every row is shown once the limit reaches the total', () => {
    for (const limit of [7071, 7100]) {
      const { visible, foot } = showMore(rows(7071), limit);
      expect(visible).toHaveLength(7071);
      expect(foot).toEqual({ kind: 'all', total: 7071 });
    }
  });

  it('keeps the limit when rows go away: fewer rows, then none left to show', () => {
    expect(showMore(rows(250), 300).foot).toEqual({ kind: 'all', total: 250 });
    expect(showMore(rows(80), 300).foot).toEqual({ kind: 'none' });
  });
});
