import { describe, expect, it, vi } from 'vitest';
import { focusBack } from './dialog-focus';

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
