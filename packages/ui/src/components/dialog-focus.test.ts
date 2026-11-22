import { describe, expect, it, vi } from 'vitest';
import { focusBack, openingFocus } from './dialog-focus';

/** A control's stand-in, in the head of the dialog (its ×) or after it. */
const control = (inHead: boolean) => ({
  closest: (selector: string) => (inHead && selector === '[data-dialog-head]' ? {} : null),
});
/** A dialog's stand-in: what it marks to focus, and the controls Tab reaches, in order. */
const dialogOf = (marked: unknown, reachable: unknown[]) =>
  ({
    querySelector: (selector: string) => (selector === '[data-autofocus]' ? marked : null),
    querySelectorAll: () => reachable,
  }) as unknown as ParentNode;

// L157: the × heads the dialog, first in the Tab order, yet a dialog opens on a field or a button.
describe('openingFocus', () => {
  it('opens on what the dialog marks', () => {
    const marked = control(false);
    expect(openingFocus(dialogOf(marked, [control(true), control(false)]))).toBe(marked);
  });

  it('opens on the first control after the head, not on its ×', () => {
    const first = control(false);
    expect(openingFocus(dialogOf(null, [control(true), first, control(false)]))).toBe(first);
  });

  it('finds nothing when the × is all there is', () => {
    expect(openingFocus(dialogOf(null, [control(true)]))).toBeNull();
  });
});

/** An element's stand-in: on the page or not, and what focusing it was asked. */
const element = (isConnected: boolean) => ({ isConnected, focus: vi.fn() });
const asElement = (node: ReturnType<typeof element>) => node as unknown as Element;

describe('focusBack', () => {
  it('gives the focus back to the opener still on the page, without scrolling', () => {
    const opener = element(true);
    const fallback = vi.fn(() => element(true));
    focusBack(asElement(opener), fallback);
    expect(opener.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(fallback).not.toHaveBeenCalled();
  });

  // DR6-83: the save took the opener away; the screen's fallback, not the page, gets the focus.
  it('gives it to the fallback once the opener has left the page, brought into view', () => {
    const opener = element(false);
    const target = element(true);
    focusBack(asElement(opener), () => target as unknown as HTMLElement);
    expect(opener.focus).not.toHaveBeenCalled();
    expect(target.focus).toHaveBeenCalledWith();
  });

  it('counts an opener that takes no focus as gone', () => {
    const target = element(true);
    focusBack(null, () => target as unknown as HTMLElement);
    focusBack({ isConnected: true } as Element, () => target as unknown as HTMLElement);
    expect(target.focus).toHaveBeenCalledTimes(2);
  });

  it('leaves the focus alone without a fallback, or one with nothing on the page', () => {
    const opener = element(false);
    expect(() => focusBack(asElement(opener), undefined)).not.toThrow();
    expect(() => focusBack(asElement(opener), () => null)).not.toThrow();
    expect(opener.focus).not.toHaveBeenCalled();
  });
});
