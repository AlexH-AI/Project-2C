/** The parts of a key press that decide whether WebView2 reloads the page on it. */
type KeyPress = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'altKey'>;

/** F5 with any modifier, Ctrl+R, Ctrl+Shift+R, and a keyboard's own Refresh key. */
const isReloadKey = (press: KeyPress): boolean =>
  press.key === 'F5' ||
  press.key === 'BrowserRefresh' ||
  // Ctrl+Alt is AltGr on Windows keyboards: it types a character, it does not reload.
  (press.ctrlKey && !press.altKey && press.key.toLowerCase() === 'r');

/** Text fields, whose menu (cut, copy, paste) has no Refresh. */
const TEXT_FIELD =
  'textarea, [contenteditable]:not([contenteditable="false"]), ' +
  'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"], [type="file"], [type="range"], [type="color"])';

const inTextField = (target: EventTarget | null): boolean =>
  typeof (target as Partial<Element> | null)?.closest === 'function' &&
  (target as Element).closest(TEXT_FIELD) !== null;

/**
 * Exe only (DR-60): reloading the webview would drop, without asking, the changes still waiting
 * to be saved or kept after a failed save; closing the window asks first (`CloseGuard`). Blocks
 * the reload keys, and the webview's own right-click menu with its Refresh outside text fields.
 * Listens in the capture phase, so no screen can let a reload through by stopping the event.
 */
export function blockReload(page: EventTarget): void {
  page.addEventListener(
    'keydown',
    (event) => {
      if (isReloadKey(event as KeyboardEvent)) event.preventDefault();
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
