import { t } from '../i18n';

/** The client hints of a Chromium webview (WebView2): Windows says its version only there. */
interface ClientHints {
  getHighEntropyValues(hints: string[]): Promise<{ platformVersion?: string }>;
}

/** What the webview says of the system it runs on. */
type Nav = Pick<Navigator, 'platform' | 'userAgent'> & { userAgentData?: ClientHints };

/**
 * Whether the app runs on macOS (Mac-5a), as the webview says: WKWebView's platform `MacIntel`, or
 * `Macintosh` in its user agent. Read from `navigator`, not Tauri's OS plugin (a new dependency,
 * G4); the web build on a Mac is on macOS too, which is right for its keys. `nav` is for tests:
 * the default is the webview's own.
 */
export function isMac(nav: Nav | undefined = globalThis.navigator): boolean {
  return nav !== undefined && /Mac/.test(`${nav.platform} ${nav.userAgent}`);
}

/**
 * The `data-os` of the page (VA1): the tokens of `packages/ui` are those of macOS, and a page
 * marked `win` takes the ones of Windows 11 (corners, window material, font).
 */
export const platformMark = (nav?: Nav): 'mac' | 'win' => (isMac(nav) ? 'mac' : 'win');

/**
 * What lies under the page of the exe's window, a transparent one (VA5, ADR-0013 appendix
 * 11/11/2026 §2): `glass`, the system's own material, which the page lets through: the glass of
 * macOS, the Mica of Windows 11. `solid` on Windows 10, which has no Mica: nothing is under the
 * page, so it paints the whole window. Windows 11 is 13 and up in the platform version of the
 * client hints; an unknown version is solid.
 */
export async function windowBackdrop(
  nav: Nav | undefined = globalThis.navigator,
): Promise<'glass' | 'solid'> {
  if (isMac(nav)) return 'glass';
  const values = await nav?.userAgentData
    ?.getHighEntropyValues(['platformVersion'])
    .catch(() => undefined);
  return Number.parseInt(values?.platformVersion ?? '', 10) >= 13 ? 'glass' : 'solid';
}

/**
 * `data-tauri-drag-region` of the places a macOS window moves by (VA5): its title bar is over the
 * page, so the free space of the toolbar and the top of the sidebar take its place; `deep`, from
 * anything inside that is not a control (Tauri's script). Windows keeps its own title bar (kiểu B).
 */
export const macDragRegion = (nav?: Nav) => (isMac(nav) ? 'deep' : undefined);

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
