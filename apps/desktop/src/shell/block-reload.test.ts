import { describe, expect, it } from 'vitest';
import { blockReload } from './block-reload';

interface Press {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

/** Presses `press` on a page that blocks the reload keys; true when the page kept the key. */
function blocked(press: Press): boolean {
  const page = new EventTarget();
  blockReload(page);
  const event = Object.assign(new Event('keydown', { cancelable: true }), {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    ...press,
  });
  page.dispatchEvent(event);
  return event.defaultPrevented;
}

/**
 * Right-clicks a page that blocks reloading; true when the page kept its own menu (which has
 * "Refresh") from opening. `editable` says whether the click is inside a text field.
 */
function menuBlocked(editable: boolean): boolean {
  const page = Object.assign(new EventTarget(), {
    closest: (selector: string) => (editable && selector.includes('textarea') ? {} : null),
  });
  blockReload(page);
  const event = new Event('contextmenu', { cancelable: true });
  page.dispatchEvent(event);
  return event.defaultPrevented;
}

/** Presses the mouse's `button` (3 Back, 4 Forward) on a page that blocks reloading. */
function buttonBlocked(button: number): boolean {
  const page = new EventTarget();
  blockReload(page);
  const event = Object.assign(new Event('mouseup', { cancelable: true }), { button });
  page.dispatchEvent(event);
  return event.defaultPrevented;
}

describe('blockReload', () => {
  it('listens in the capture phase, so no screen can stop an event before it', () => {
    const listened: [string, unknown][] = [];
    blockReload({
      addEventListener: (type: string, _listener: unknown, options: unknown) =>
        listened.push([type, options]),
    } as unknown as EventTarget);
    expect(listened.map(([type]) => type).sort()).toEqual(['contextmenu', 'keydown', 'mouseup']);
    for (const [, options] of listened) expect(options).toEqual({ capture: true });
  });

  it('keeps Back and Forward from leaving the screen, by the keyboard (DR6-34)', () => {
    expect(blocked({ key: 'BrowserBack' })).toBe(true);
    expect(blocked({ key: 'BrowserForward' })).toBe(true);
    expect(blocked({ key: 'ArrowLeft', altKey: true })).toBe(true);
    expect(blocked({ key: 'ArrowRight', altKey: true })).toBe(true);
    expect(blocked({ key: 'ArrowLeft', altKey: true, shiftKey: true })).toBe(true);
  });

  it("keeps the mouse's own Back and Forward buttons from leaving the screen (DR6-34)", () => {
    expect(buttonBlocked(3)).toBe(true);
    expect(buttonBlocked(4)).toBe(true);
    expect(buttonBlocked(0)).toBe(false);
    expect(buttonBlocked(1)).toBe(false);
    expect(buttonBlocked(2)).toBe(false);
  });

  it("keeps the webview's own menu, and its Refresh, away from the page", () => {
    expect(menuBlocked(false)).toBe(true);
  });

  it('keeps the menu of a text field for cut, copy and paste: it has no Refresh', () => {
    expect(menuBlocked(true)).toBe(false);
  });

  it('keeps F5, Ctrl+R and Ctrl+Shift+R from reloading the exe (DR-60)', () => {
    expect(blocked({ key: 'F5' })).toBe(true);
    expect(blocked({ key: 'F5', ctrlKey: true })).toBe(true);
    expect(blocked({ key: 'F5', shiftKey: true })).toBe(true);
    expect(blocked({ key: 'r', ctrlKey: true })).toBe(true);
    expect(blocked({ key: 'R', ctrlKey: true, shiftKey: true })).toBe(true);
    expect(blocked({ key: 'BrowserRefresh' })).toBe(true);
  });

  it('leaves every other key alone, typing an r included', () => {
    expect(blocked({ key: 'r' })).toBe(false);
    expect(blocked({ key: 'R', shiftKey: true })).toBe(false);
    // AltGr arrives as Ctrl+Alt on Windows keyboards.
    expect(blocked({ key: 'r', ctrlKey: true, altKey: true })).toBe(false);
    expect(blocked({ key: 'F4' })).toBe(false);
    expect(blocked({ key: 'c', ctrlKey: true })).toBe(false);
    expect(blocked({ key: 'Escape' })).toBe(false);
    // The arrows move the caret, a word at a time with Ctrl; Ctrl+Alt is AltGr.
    expect(blocked({ key: 'ArrowLeft' })).toBe(false);
    expect(blocked({ key: 'ArrowRight', shiftKey: true })).toBe(false);
    expect(blocked({ key: 'ArrowLeft', ctrlKey: true })).toBe(false);
    expect(blocked({ key: 'ArrowLeft', ctrlKey: true, altKey: true })).toBe(false);
  });
});
