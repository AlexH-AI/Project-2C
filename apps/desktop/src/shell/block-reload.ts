import { isMac } from './platform';

/** The parts of a key press that decide whether the webview reloads the page, or steps back. */
type KeyPress = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'altKey' | 'metaKey' | 'target'>;

const isArrow = (key: string) => key === 'ArrowLeft' || key === 'ArrowRight';

/**
 * F5 with any modifier, Ctrl+R, Ctrl+Shift+R, a keyboard's own Refresh key, and ⌘R, ⌘⇧R on macOS
 * (Mac-5a).
 */
const isReloadKey = (press: KeyPress): boolean =>
  press.key === 'F5' ||
  press.key === 'BrowserRefresh' ||
  // Ctrl+Alt is AltGr on Windows keyboards: it types a character, it does not reload.
  (((press.ctrlKey && !press.altKey) || press.metaKey) && press.key.toLowerCase() === 'r');

/**
 * A step through the history: a keyboard's own Back and Forward keys; Alt+← / Alt+→ on Windows,
 * where WebView2 steps with them even in a text field; and on macOS ⌘[ / ⌘], and ⌘← / ⌘→ outside a
 * text field, where they move the caret to the start or end of the line instead (Mac-5a). macOS
 * leaves ⌥← / ⌥→ alone: WKWebView takes no step with them, and they move the caret a word at a time
 * (with ⇧, select it; review of PR 1348).
 */
const isHistoryKey = (press: KeyPress, mac: boolean): boolean =>
  press.key === 'BrowserBack' ||
  press.key === 'BrowserForward' ||
  (!mac && press.altKey && !press.ctrlKey && isArrow(press.key)) ||
  (press.metaKey && (press.key === '[' || press.key === ']')) ||
  (press.metaKey && isArrow(press.key) && !inTextField(press.target));

/** The mouse's own Back (4th) and Forward (5th) buttons. */
const HISTORY_BUTTONS: readonly number[] = [3, 4];

/** Text fields, whose menu (cut, copy, paste) has no Refresh, and where ⌘← / ⌘→ move the caret. */
const TEXT_FIELD =
  'textarea, [contenteditable]:not([contenteditable="false"]), ' +
  'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"], [type="file"], [type="range"], [type="color"])';

const inTextField = (target: EventTarget | null): boolean =>
  typeof (target as Partial<Element> | null)?.closest === 'function' &&
  (target as Element).closest(TEXT_FIELD) !== null;

/**
 * Exe only (DR-60), on Windows and macOS: reloading the webview would drop, without asking, the
 * changes still waiting to be saved or kept after a failed save; closing the window asks first
 * (`CloseGuard`). Blocks the reload keys, and the webview's own right-click menu with its Refresh
 * outside text fields.
 * Back and Forward too (DR6-34): a step through the history changes the screen, which drops the
 * dialog open and what it holds, or leaves a screen in the middle of a reload or an import; the
 * sidebar is the way between screens. Chromium does not step when the page blocks the key or the
 * button's `mouseup`. Listens in the capture phase, so no screen can let one through by stopping
 * the event. `mac`: the app runs on macOS; the default asks the webview.
 */
export function blockReload(page: EventTarget, mac = isMac()): void {
  page.addEventListener(
    'keydown',
    (event) => {
      const press = event as KeyboardEvent;
      if (isReloadKey(press) || isHistoryKey(press, mac)) event.preventDefault();
    },
    { capture: true },
  );
  page.addEventListener(
    'mouseup',
    (event) => {
      if (HISTORY_BUTTONS.includes((event as MouseEvent).button)) event.preventDefault();
    },
    { capture: true },
  );
  page.addEventListener(
    'contextmenu',
    (event) => {
      if (!inTextField(event.target)) event.preventDefault();
    },
    { capture: true },
  );
}
