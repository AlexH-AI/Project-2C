import { describe, expect, it } from 'vitest';
import { lightCard } from './classes';

/** A card 200 × 100 at (40, 20) of the window, and what was set on its style. */
function card() {
  const set = new Map<string, string>();
  return {
    set,
    element: {
      getBoundingClientRect: () => ({ left: 40, top: 20, width: 200, height: 100 }),
      style: { setProperty: (name: string, value: string) => void set.set(name, value) },
    },
  };
}

/** A pointer at (x, y) of the window over `target`, whose nearest `.card` is `found`. */
const pointer = (x: number, y: number, found: unknown) => ({
  clientX: x,
  clientY: y,
  target: { closest: (selector: string) => (selector === '.card' ? found : null) },
});

describe('lightCard', () => {
  it('tells the card under the pointer where the pointer is over it, as shares of its box', () => {
    const { element, set } = card();
    lightCard(pointer(90, 95, element));
    expect([...set]).toEqual([
      ['--mx', '25%'],
      ['--my', '75%'],
    ]);
  });

  it('does nothing over what is no card, or over what is no element', () => {
    expect(() => lightCard(pointer(90, 95, null))).not.toThrow();
    expect(() => lightCard({ clientX: 1, clientY: 1, target: {} })).not.toThrow();
  });
});
