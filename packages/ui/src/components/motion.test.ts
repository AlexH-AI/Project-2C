import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  COUNT_MS,
  GONE_MS,
  RISE_STEPS,
  calmMotion,
  counter,
  glide,
  layerState,
  openFrom,
  riseStep,
  type CountClock,
} from './motion';

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

/** What glides, as the test sees it: its style, its marks, what it listens to. */
function glider() {
  const set: Record<string, string> = {};
  const marks = new Set<string>();
  const heard = new Map<string, (event: Event) => void>();
  return {
    set,
    marks,
    heard,
    style: {
      setProperty: (name: string, value: string) => void (set[name] = value),
      removeProperty: (name: string) => {
        delete set[name];
        return '';
      },
    },
    setAttribute: (name: string) => void marks.add(name),
    removeAttribute: (name: string) => void marks.delete(name),
    addEventListener: (type: string, listener: (event: Event) => void) =>
      void heard.set(type, listener),
    removeEventListener: (type: string) => void heard.delete(type),
  };
}

describe('glide', () => {
  const mark = glider;

  it('starts what is chosen from where the one before was, and glides it to its place', () => {
    const pill = mark();
    glide(pill, { y: -76 });
    expect(pill.set).toEqual({ '--glide-x': '0', '--glide-y': '-76' });
    expect(pill.marks).toEqual(new Set(['data-glide']));
    const thumb = mark();
    glide(thumb, { x: 58.5 });
    expect(thumb.set).toEqual({ '--glide-x': '58.5', '--glide-y': '0' });
  });

  it('does not move what is chosen at the same place', () => {
    const pill = mark();
    glide(pill, {});
    glide(pill, { x: 0, y: 0 });
    expect(pill.set).toEqual({});
    expect(pill.marks).toEqual(new Set());
  });
});

describe('glide, once over', () => {
  const end = (type: string, target: unknown) => ({ type, target }) as unknown as Event;

  it('takes its marks away when its own move ends or is cut short, not when a move inside it does (L247)', () => {
    for (const type of ['animationend', 'animationcancel']) {
      const thumb = glider();
      glide(thumb, { x: 40 });
      thumb.heard.get(type)?.(end(type, {}));
      expect(thumb.marks).toEqual(new Set(['data-glide']));
      thumb.heard.get(type)?.(end(type, thumb));
      expect(thumb.marks).toEqual(new Set());
      expect(thumb.set).toEqual({});
      expect(thumb.heard.size).toBe(0);
    }
  });
});

describe('GONE_MS', () => {
  it('outlasts every move out (L241): a layer whose move cannot end still goes', () => {
    expect(GONE_MS).toBeGreaterThanOrEqual(400);
  });
});

describe('counter ("Đếm")', () => {
  /** A clock of the test: frames drawn by `tick(ms)`, the timer run by `late()`. */
  function testClock() {
    let time = 1_000;
    let frames = new Map<number, (time: number) => void>();
    let timers = new Map<number, () => void>();
    let id = 0;
    const clock: CountClock = {
      now: () => time,
      frame: (draw) => (frames.set(++id, draw), id),
      cancelFrame: (one) => void frames.delete(one),
      later: (run) => (timers.set(++id, run), id),
      cancelLater: (one) => void timers.delete(one),
    };
    return {
      clock,
      tick(ms: number) {
        time += ms;
        const now = frames;
        frames = new Map();
        for (const draw of now.values()) draw(time);
      },
      late() {
        const now = timers;
        timers = new Map();
        for (const run of now.values()) run();
      },
      running: () => frames.size + timers.size,
    };
  }
  const TR = 1_000_000;

  it('shows the first value at once: a screen just opened does not count from 0', () => {
    const { clock, running } = testClock();
    const shown: Array<number | null> = [];
    counter((value) => shown.push(value), 'sig3', clock).to(310 * TR, false);
    expect(shown).toEqual([310 * TR]);
    expect(running()).toBe(0);
  });

  it('runs to a new value in --t-3, ease-out, each frame towards the old value, the last exact', () => {
    const { clock, tick, running } = testClock();
    const shown: Array<number | null> = [];
    const count = counter((value) => shown.push(value), 'sig3', clock);
    count.to(290 * TR, false);
    count.to(310_600_000, false);
    tick(0);
    for (let at = 0; at < COUNT_MS; at += 50) tick(50);
    expect(COUNT_MS).toBe(400);
    expect(shown.at(-1)).toBe(310_600_000);
    const between = shown.slice(1, -1);
    expect(between.length).toBeGreaterThan(4);
    expect(between.every((value) => value !== null && value <= 310 * TR)).toBe(true);
    // Ease-out: half the way is behind after an eighth of the time (1 - 0.875³ = 0.33).
    expect(between[1]).toBe(296 * TR);
    expect(running()).toBe(0);
  });

  it('goes on from the number on screen when the value changes while it runs', () => {
    const { clock, tick } = testClock();
    const shown: Array<number | null> = [];
    const count = counter((value) => shown.push(value), 'whole', clock);
    count.to(0, false);
    count.to(100, false);
    tick(100);
    const halfway = shown.at(-1)!;
    expect(halfway).toBeGreaterThan(0);
    count.to(10, false);
    tick(0);
    expect(shown.at(-1)).toBe(halfway);
    tick(50);
    expect(shown.at(-1)).toBeLessThan(halfway);
    expect(shown.at(-1)).toBeGreaterThanOrEqual(10);
  });

  it('changes at once between "—" and a number, and under "Giảm chuyển động"', () => {
    const { clock, running } = testClock();
    const shown: Array<number | null> = [];
    const count = counter((value) => shown.push(value), 'tenth', clock);
    count.to(null, false);
    count.to(66.7, false);
    count.to(null, false);
    count.to(50, false);
    count.to(66.7, true);
    count.to(66.7, false);
    expect(shown).toEqual([null, 66.7, null, 50, 66.7, 66.7]);
    expect(running()).toBe(0);
  });

  it('lands on its value even where no frame is drawn (a page in the background), and can be stopped', () => {
    const { clock, late, running } = testClock();
    const shown: Array<number | null> = [];
    const count = counter((value) => shown.push(value), 'whole', clock);
    count.to(3, false);
    count.to(12, false);
    late();
    expect(shown).toEqual([3, 12]);
    expect(running()).toBe(0);
    count.to(40, false);
    count.stop();
    expect(running()).toBe(0);
    expect(shown).toEqual([3, 12]);
  });
});

describe('openFrom ("Mở")', () => {
  const named = () => {
    const style: Record<string, string> = {};
    return {
      style: {
        setProperty: (name: string, value: string) => void (style[name] = value),
        removeProperty: (name: string) => {
          delete style[name];
          return '';
        },
      },
      name: () => style['view-transition-name'],
    };
  };
  /** A page with View Transitions: the update runs when the test says, as the browser would later. */
  function testPage(api = true) {
    const root: Record<string, string> = {};
    const moves: Array<{
      update: () => void;
      skipped: boolean;
      end: () => void;
      fail: () => void;
    }> = [];
    const heard = new Map<string, () => void>();
    const page = {
      documentElement: {
        setAttribute: (name: string, value: string) => void (root[name] = value),
        removeAttribute: (name: string) => void delete root[name],
      },
      addEventListener: (type: string, listener: () => void) => void heard.set(type, listener),
      removeEventListener: (type: string) => void heard.delete(type),
      ...(api && {
        startViewTransition(update: () => void) {
          let end = () => {};
          let fail = () => {};
          const finished = new Promise<undefined>((resolve, reject) => {
            end = () => resolve(undefined);
            fail = () => reject(new Error('the update failed'));
          });
          const move = {
            update,
            skipped: false,
            end,
            fail,
            ready: Promise.reject(new Error('skipped')),
            finished,
            skipTransition: () => void (move.skipped = true),
          };
          moves.push(move);
          return move;
        },
      }),
    };
    return { page, root, moves, heard };
  }
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
  const moving = () => vi.stubGlobal('matchMedia', () => ({ matches: false }));

  it('grows the thing clicked into the page: the update names the page "open", in a move marked "in"', async () => {
    moving();
    const { page, root, moves, heard } = testPage();
    const card = named();
    const main = named();
    const seen: string[] = [];
    openFrom(card, (still) => seen.push(`${still} ${card.name()}`), { to: () => main, page });
    expect(card.name()).toBe('open');
    expect(root).toEqual({ 'data-open': 'in' });
    expect(seen).toEqual([]);
    moves[0]!.update();
    expect(seen).toEqual(['true undefined']);
    expect(main.name()).toBe('open');
    moves[0]!.end();
    await settle();
    expect(main.name()).toBeUndefined();
    expect(root).toEqual({});
    expect(heard.size).toBe(0);
  });

  it('shrinks the page back to the thing; with the thing gone the page only fades', async () => {
    moving();
    const { page, root, moves } = testPage();
    const main = named();
    openFrom(main, () => {}, { back: true, to: () => null, page });
    expect(root).toEqual({ 'data-open': 'back' });
    moves[0]!.update();
    expect(main.name()).toBeUndefined();
    moves[0]!.end();
    await settle();
    expect(root).toEqual({});
  });

  it('ends the move under way at its end when a new one starts, or at a press', async () => {
    moving();
    const { page, root, moves, heard } = testPage();
    openFrom(named(), () => {}, { page });
    heard.get('pointerdown')?.();
    expect(moves[0]!.skipped).toBe(true);
    openFrom(named(), () => {}, { page });
    expect(moves).toHaveLength(2);
    moves[0]!.end();
    await settle();
    expect(root).toEqual({ 'data-open': 'in' });
    openFrom(named(), () => {}, { page });
    expect(moves[1]!.skipped).toBe(true);
  });

  it('changes the screen at once without the API, under "Giảm chuyển động", or with nothing clicked', () => {
    const seen: boolean[] = [];
    moving();
    openFrom(named(), (still) => seen.push(still), { page: testPage(false).page });
    openFrom(null, (still) => seen.push(still), { page: testPage().page });
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const calm = testPage();
    openFrom(named(), (still) => seen.push(still), { page: calm.page });
    expect(seen).toEqual([false, false, false]);
    expect(calm.moves).toHaveLength(0);
  });

  it('takes its names and marks away even when the update fails', async () => {
    moving();
    const { page, root, moves, heard } = testPage();
    const main = named();
    openFrom(named(), () => {}, { to: () => main, page });
    moves[0]!.update();
    moves[0]!.fail();
    await settle();
    expect(main.name()).toBeUndefined();
    expect(root).toEqual({});
    expect(heard.size).toBe(0);
  });

  it('works on the document of the page by default', () => {
    moving();
    const { page, moves } = testPage();
    vi.stubGlobal('document', page);
    openFrom(named(), () => {});
    expect(moves).toHaveLength(1);
  });
});
