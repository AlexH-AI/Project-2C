import { describe, expect, it } from 'vitest';
import { blockReload } from './block-reload';

interface Press {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  /** ⌘ on macOS (the Windows key on Windows). */
  metaKey?: boolean;
}

/**
 * Presses `press` on a page that blocks the reload keys, in `node` when given (else on the page
 * itself, no text field), on Windows unless `mac`; true when the page kept the key.
 */
function blocked(press: Press, node?: Node, mac = false): boolean {
  const page = new EventTarget();
  blockReload(page, mac);
  const event = Object.assign(new Event('keydown', { cancelable: true }), {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    ...press,
  });
  if (node) Object.defineProperty(event, 'target', { value: inPage(node) });
  page.dispatchEvent(event);
  return event.defaultPrevented;
}

/** An element of a page without a DOM: its tag, attributes and parent. */
interface Node {
  readonly tag: string;
  readonly attributes?: Readonly<Record<string, string>>;
  readonly parent?: Node;
}

/** `list` split at its commas, not those inside `:not(…)` (one level deep, as the page's). */
const split = (list: string) => list.match(/(?:[^,(]|\([^)]*\))+/g)!.map((part) => part.trim());

/**
 * Whether `node` matches `list`, for the selectors the page passes to `closest`: a tag, `[name]`,
 * `[name="value"]`, and `:not(…)` of those. Anything else fails the test, so no selector passes
 * unread (BR3, DR6-62).
 */
function matches(node: Node, list: string): boolean {
  return split(list).some((selector) => {
    const [, tag, parts] = /^([a-z]*)(.*)$/.exec(selector)!;
    if (tag && tag !== node.tag) return false;
    return [...parts!.matchAll(/:not\(([^)]*)\)|\[([\w-]+)(?:="([^"]*)")?\]|(.)/g)].every(
      ([, not, name, value, other]) => {
        if (other !== undefined) throw new Error(`Selector not understood: ${selector}`);
        if (not !== undefined) return !matches(node, not);
        const has = node.attributes?.[name!];
        return has !== undefined && (value === undefined || has === value);
      },
    );
  });
}

/**
 * Right-clicks `node` on a page that blocks reloading; true when the page kept its own menu (which
 * has "Refresh") from opening. The page reads the click's target with `closest`, as in a browser.
 */
function menuBlocked(node: Node): boolean {
  const page = new EventTarget();
  blockReload(page);
  const event = new Event('contextmenu', { cancelable: true });
  Object.defineProperty(event, 'target', { value: inPage(node) });
  page.dispatchEvent(event);
  return event.defaultPrevented;
}

/** `node` as the target of an event: the page reads it with `closest`, as in a browser. */
const inPage = (node: Node) => ({
  closest: (list: string) => {
    for (let at: Node | undefined = node; at; at = at.parent) if (matches(at, list)) return at;
    return null;
  },
});

const input = (type?: string): Node => ({ tag: 'input', attributes: type ? { type } : {} });

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
    expect(menuBlocked({ tag: 'div' })).toBe(true);
    expect(menuBlocked({ tag: 'span', parent: { tag: 'button' } })).toBe(true);
    // A checkbox ("Đánh dấu là thay đổi quan trọng", 7a), a radio (`Choices`) or a button is no
    // text field.
    for (const type of [
      'checkbox',
      'radio',
      'button',
      'submit',
      'reset',
      'file',
      'range',
      'color',
    ]) {
      expect(menuBlocked(input(type)), type).toBe(true);
    }
    expect(menuBlocked({ tag: 'div', attributes: { contenteditable: 'false' } })).toBe(true);
  });

  it('keeps the menu of a text field for cut, copy and paste: it has no Refresh', () => {
    expect(menuBlocked({ tag: 'textarea' })).toBe(false);
    for (const type of [undefined, 'text', 'search', 'email', 'number', 'tel', 'url']) {
      expect(menuBlocked(input(type)), type).toBe(false);
    }
    const editable: Node = { tag: 'div', attributes: { contenteditable: '' } };
    expect(menuBlocked(editable)).toBe(false);
    expect(menuBlocked({ tag: 'b', parent: editable })).toBe(false);
  });

  it('keeps F5, Ctrl+R and Ctrl+Shift+R from reloading the exe (DR-60)', () => {
    expect(blocked({ key: 'F5' })).toBe(true);
    expect(blocked({ key: 'F5', ctrlKey: true })).toBe(true);
    expect(blocked({ key: 'F5', shiftKey: true })).toBe(true);
    expect(blocked({ key: 'r', ctrlKey: true })).toBe(true);
    expect(blocked({ key: 'R', ctrlKey: true, shiftKey: true })).toBe(true);
    expect(blocked({ key: 'BrowserRefresh' })).toBe(true);
  });

  it('keeps ⌘R, ⌘⇧R and ⌘[ / ⌘] from reloading the app or leaving the screen on macOS (Mac-5a)', () => {
    expect(blocked({ key: 'r', metaKey: true })).toBe(true);
    expect(blocked({ key: 'R', metaKey: true, shiftKey: true })).toBe(true);
    expect(blocked({ key: '[', metaKey: true })).toBe(true);
    expect(blocked({ key: ']', metaKey: true })).toBe(true);
    // In a text field too: there they neither type nor move the caret.
    expect(blocked({ key: 'r', metaKey: true }, input('text'))).toBe(true);
    expect(blocked({ key: '[', metaKey: true }, { tag: 'textarea' })).toBe(true);
  });

  it('keeps ⌘← / ⌘→ from leaving the screen, but leaves them to a text field, where they move the caret to the start or end of the line (Mac-5a)', () => {
    expect(blocked({ key: 'ArrowLeft', metaKey: true })).toBe(true);
    expect(blocked({ key: 'ArrowRight', metaKey: true }, { tag: 'div' })).toBe(true);
    expect(blocked({ key: 'ArrowLeft', metaKey: true }, input('checkbox'))).toBe(true);
    const editable: Node = { tag: 'div', attributes: { contenteditable: '' } };
    for (const field of [
      input(),
      input('text'),
      { tag: 'textarea' },
      { tag: 'b', parent: editable },
    ]) {
      expect(blocked({ key: 'ArrowLeft', metaKey: true }, field), field.tag).toBe(false);
      expect(blocked({ key: 'ArrowRight', metaKey: true }, field), field.tag).toBe(false);
      expect(blocked({ key: 'ArrowRight', metaKey: true, shiftKey: true }, field)).toBe(false);
    }
  });

  it('still blocks the keys of Windows in a text field, where they do not move the caret', () => {
    expect(blocked({ key: 'r', ctrlKey: true }, input('text'))).toBe(true);
    expect(blocked({ key: 'F5' }, { tag: 'textarea' })).toBe(true);
    // WebView2 steps back with Alt+← even in a text field.
    expect(blocked({ key: 'ArrowLeft', altKey: true }, input('text'))).toBe(true);
    expect(blocked({ key: 'ArrowRight', altKey: true, shiftKey: true }, { tag: 'textarea' })).toBe(
      true,
    );
  });

  it('leaves ⌥← / ⌥→ to macOS, where they move the caret a word at a time and step through no history (review of PR 1348)', () => {
    const editable: Node = { tag: 'div', attributes: { contenteditable: '' } };
    for (const field of [input('text'), { tag: 'textarea' }, { tag: 'b', parent: editable }]) {
      expect(blocked({ key: 'ArrowLeft', altKey: true }, field, true), field.tag).toBe(false);
      expect(blocked({ key: 'ArrowRight', altKey: true }, field, true), field.tag).toBe(false);
      // With ⇧, they select a word at a time.
      expect(blocked({ key: 'ArrowLeft', altKey: true, shiftKey: true }, field, true)).toBe(false);
      expect(blocked({ key: 'ArrowRight', altKey: true, shiftKey: true }, field, true)).toBe(false);
    }
    // Outside a text field too: WKWebView takes no step back with them.
    expect(blocked({ key: 'ArrowLeft', altKey: true }, { tag: 'div' }, true)).toBe(false);
    // The keys that do step on macOS are still blocked there.
    expect(blocked({ key: '[', metaKey: true }, { tag: 'div' }, true)).toBe(true);
    expect(blocked({ key: 'ArrowLeft', metaKey: true }, { tag: 'div' }, true)).toBe(true);
    expect(blocked({ key: 'BrowserBack' }, input('text'), true)).toBe(true);
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
    // ⌘ with any other key: copy, paste, select all.
    expect(blocked({ key: 'c', metaKey: true })).toBe(false);
    expect(blocked({ key: 'a', metaKey: true }, input('text'))).toBe(false);
  });
});
