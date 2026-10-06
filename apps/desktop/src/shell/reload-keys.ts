/** The parts of a key press that decide whether WebView2 reloads the page on it. */
type KeyPress = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'altKey'>;

/** F5 with any modifier, Ctrl+R, Ctrl+Shift+R, and a keyboard's own Refresh key. */
const isReloadKey = (press: KeyPress): boolean =>
  press.key === 'F5' ||
  press.key === 'BrowserRefresh' ||
  // Ctrl+Alt is AltGr on Windows keyboards: it types a character, it does not reload.
  (press.ctrlKey && !press.altKey && press.key.toLowerCase() === 'r');

/**
 * Exe only (DR-60): reloading the webview would drop, without asking, the changes still waiting
 * to be saved or kept after a failed save; closing the window asks first (`CloseGuard`). Listens
 * in the capture phase, so no screen can let a reload key through by stopping it.
 */
export function blockReloadKeys(page: EventTarget): void {
  page.addEventListener(
    'keydown',
    (event) => {
      if (isReloadKey(event as KeyboardEvent)) event.preventDefault();
    },
    { capture: true },
  );
}
