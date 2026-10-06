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

describe('blockReload', () => {
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
  });
});
