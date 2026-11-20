import { afterEach, describe, expect, it, vi } from 'vitest';
import { RISE_STEPS, calmMotion, glide, layerState, riseStep } from './motion';

afterEach(() => void vi.unstubAllGlobals());

describe('riseStep', () => {
  it('gives parts 1 … 8 a step each, in the order of the screen', () => {
    expect(RISE_STEPS).toBe(8);
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(riseStep)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('lets the ninth part and every later one rise with the eighth', () => {
    expect([8, 9, 10, 884].map(riseStep)).toEqual([7, 7, 7, 7]);
  });
});

describe('layerState', () => {
  it('opens a closed layer, and one still closing', () => {
    expect(layerState('closed', 'open', false)).toBe('open');
    expect(layerState('closing', 'open', false)).toBe('open');
    expect(layerState('open', 'open', false)).toBe('open');
  });

  it('closes an open layer by its move out, then takes it away once the move is over', () => {
    const closing = layerState('open', 'close', false);
    expect(closing).toBe('closing');
    expect(layerState(closing, 'gone', false)).toBe('closed');
  });

  it('takes an open layer away at once under "Giảm chuyển động"', () => {
    expect(layerState('open', 'close', true)).toBe('closed');
  });

  it('leaves a layer that is not open as it is when told to close, and one not closing when its move ends', () => {
    expect(layerState('closing', 'close', false)).toBe('closing');
    expect(layerState('closed', 'close', false)).toBe('closed');
    expect(layerState('open', 'gone', false)).toBe('open');
    expect(layerState('closed', 'gone', true)).toBe('closed');
  });
});

describe('calmMotion', () => {
  it('follows the "Giảm chuyển động" of the system', () => {
    const asked: string[] = [];
    const answer = (matches: boolean) => (query: string) => {
      asked.push(query);
      return { matches };
    };
    vi.stubGlobal('matchMedia', answer(true));
    expect(calmMotion()).toBe(true);
    vi.stubGlobal('matchMedia', answer(false));
    expect(calmMotion()).toBe(false);
    expect(asked).toEqual(['(prefers-reduced-motion: reduce)', '(prefers-reduced-motion: reduce)']);
  });

  it('moves nothing where the system cannot be asked', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(calmMotion()).toBe(true);
  });
});

describe('glide', () => {
  const mark = () => {
    const set: Record<string, string> = {};
    const marks: string[] = [];
    return {
      set,
      marks,
      style: { setProperty: (name: string, value: string) => void (set[name] = value) },
      setAttribute: (name: string) => void marks.push(name),
    };
  };

  it('starts what is chosen from where the one before was, and glides it to its place', () => {
    const pill = mark();
    glide(pill, { y: -76 });
    expect(pill.set).toEqual({ '--glide-x': '0', '--glide-y': '-76' });
    expect(pill.marks).toEqual(['data-glide']);
    const thumb = mark();
    glide(thumb, { x: 58.5 });
    expect(thumb.set).toEqual({ '--glide-x': '58.5', '--glide-y': '0' });
  });

  it('does not move what is chosen at the same place', () => {
    const pill = mark();
    glide(pill, {});
    glide(pill, { x: 0, y: 0 });
    expect(pill.set).toEqual({});
    expect(pill.marks).toEqual([]);
  });
});
