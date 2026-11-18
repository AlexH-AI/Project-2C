import { describe, expect, it } from 'vitest';
import { menuMove } from './menu-keys';

describe('menuMove (the keys of a menu)', () => {
  it('↓ and ↑ go to the next and the previous row', () => {
    expect(menuMove('ArrowDown', 0, 4)).toBe(1);
    expect(menuMove('ArrowUp', 2, 4)).toBe(1);
  });

  it('goes around the ends', () => {
    expect(menuMove('ArrowDown', 3, 4)).toBe(0);
    expect(menuMove('ArrowUp', 0, 4)).toBe(3);
  });

  it('Home and End go to the first and the last row', () => {
    expect(menuMove('Home', 2, 4)).toBe(0);
    expect(menuMove('End', 1, 4)).toBe(3);
  });

  it('starts from an end when the focus is on no row', () => {
    expect(menuMove('ArrowDown', -1, 4)).toBe(0);
    expect(menuMove('ArrowUp', -1, 4)).toBe(3);
  });

  it('moves nothing for another key, nor in a menu with no row', () => {
    expect(menuMove('Enter', 1, 4)).toBeNull();
    expect(menuMove('a', 1, 4)).toBeNull();
    expect(menuMove('ArrowDown', 0, 0)).toBeNull();
  });
});
