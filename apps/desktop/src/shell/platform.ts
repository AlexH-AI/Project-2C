import { t } from '../i18n';

/** What the webview says of the system it runs on. */
type Nav = Pick<Navigator, 'platform' | 'userAgent'>;

/**
 * Whether the app runs on macOS (Mac-5a), as the webview says: WKWebView's platform `MacIntel`, or
 * `Macintosh` in its user agent. Read from `navigator`, not Tauri's OS plugin (a new dependency,
 * G4); the web build on a Mac is on macOS too, which is right for its keys. `nav` is for tests:
 * the default is the webview's own.
 */
export function isMac(nav: Nav | undefined = globalThis.navigator): boolean {
  return nav !== undefined && /Mac/.test(`${nav.platform} ${nav.userAgent}`);
}

/** The modifier of the shortcuts: ⌘ on macOS, Ctrl on Windows. */
export const modKey = (nav?: Nav): '⌘' | 'Ctrl' => (isMac(nav) ? '⌘' : 'Ctrl');

/**
 * The `{mod}` of a message that names a shortcut, written right before its key, as each platform
 * writes one: `⌘A` on macOS, `Ctrl+A` on Windows.
 */
export const modParams = (nav?: Nav) => ({ mod: isMac(nav) ? modKey(nav) : `${modKey(nav)}+` });

/**
 * The `{store}` of a message about the AI key: the system's key store that keeps it (ADR-0019 §4),
 * the Keychain on macOS, the Credential Manager on Windows.
 */
export const storeParams = (nav?: Nav) => ({
  store: t(isMac(nav) ? 'settingsAi.keyStore.mac' : 'settingsAi.keyStore.windows'),
});
