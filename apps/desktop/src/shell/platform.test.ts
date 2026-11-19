import { describe, expect, it } from 'vitest';
import { t } from '../i18n';
import {
  isMac,
  macDragRegion,
  modKey,
  modParams,
  platformMark,
  storeParams,
  windowBackdrop,
} from './platform';

/** What the webview of each platform says: WKWebView on macOS, WebView2 (Edge) on Windows. */
const MAC = {
  platform: 'MacIntel',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)',
};
const WINDOWS = {
  platform: 'Win32',
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0',
};

describe('the platform of the webview (Mac-5a)', () => {
  it('reads macOS from the platform or the user agent of the webview', () => {
    expect(isMac(MAC)).toBe(true);
    expect(isMac({ platform: '', userAgent: MAC.userAgent })).toBe(true);
    expect(isMac({ platform: 'MacIntel', userAgent: '' })).toBe(true);
    expect(isMac(WINDOWS)).toBe(false);
    expect(isMac({ platform: 'Linux x86_64', userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' })).toBe(
      false,
    );
  });

  // VA1: `data-os` of the page, which picks the tokens of the system (tokens.css).
  it('marks the page mac on macOS, win anywhere else', () => {
    expect(platformMark(MAC)).toBe('mac');
    expect(platformMark(WINDOWS)).toBe('win');
    expect(platformMark({ platform: 'Linux x86_64', userAgent: 'X11; Linux x86_64' })).toBe('win');
    expect(platformMark(undefined)).toBe(isMac() ? 'mac' : 'win');
  });

  it('names ⌘ as the modifier of the shortcuts on macOS, Ctrl on Windows', () => {
    expect(modKey(MAC)).toBe('⌘');
    expect(modKey(WINDOWS)).toBe('Ctrl');
  });

  it('writes a shortcut as each platform does: ⌘A on macOS, Ctrl+A on Windows', () => {
    expect(t('aiPanel.web.copyFailed', modParams(MAC))).toBe(
      'Không copy được — chọn hết đoạn dưới (⌘A trong ô) rồi ⌘C. ChatGPT đã được mở.',
    );
    expect(t('aiPanel.web.copyFailed', modParams(WINDOWS))).toBe(
      'Không copy được — chọn hết đoạn dưới (Ctrl+A trong ô) rồi Ctrl+C. ChatGPT đã được mở.',
    );
    expect(t('aiPanel.web.pastePlaceholder', modParams(MAC))).toBe(
      'Dán câu trả lời của ChatGPT (⌘V)',
    );
    expect(t('aiPanel.web.pastePlaceholder', modParams(WINDOWS))).toBe(
      'Dán câu trả lời của ChatGPT (Ctrl+V)',
    );
  });

  // VA5: `data-backdrop` of the exe's page. WebView2 names the version of Windows only in its
  // client hints: 1 to 10 are Windows 10, 13 and up Windows 11, 0.x Windows 8.1 and before.
  it('lays the page on the system material on macOS and on Windows 11, solid elsewhere', async () => {
    const hints = (platformVersion: string | Error) => ({
      ...WINDOWS,
      userAgentData: {
        getHighEntropyValues: () =>
          platformVersion instanceof Error
            ? Promise.reject(platformVersion)
            : Promise.resolve({ platformVersion }),
      },
    });
    await expect(windowBackdrop(MAC)).resolves.toBe('glass');
    await expect(windowBackdrop(hints('13.0.0'))).resolves.toBe('glass');
    await expect(windowBackdrop(hints('19.0.0'))).resolves.toBe('glass');
    await expect(windowBackdrop(hints('10.0.0'))).resolves.toBe('solid');
    await expect(windowBackdrop(hints('0.3.0'))).resolves.toBe('solid');
    // Unknown is solid: a window with nothing under it would show the desktop through the page.
    await expect(windowBackdrop(hints(''))).resolves.toBe('solid');
    await expect(windowBackdrop(hints(new Error('not allowed')))).resolves.toBe('solid');
    await expect(windowBackdrop(WINDOWS)).resolves.toBe('solid');
  });

  // VA5: the title bar of macOS is over the page; Windows keeps its own, the page moves no window.
  it('lets the window move by the toolbar and the top of the sidebar on macOS only', () => {
    // `''`: a press on that element itself; `deep`: anywhere inside it but on a control.
    expect(macDragRegion('self', MAC)).toBe('');
    expect(macDragRegion('deep', MAC)).toBe('deep');
    expect(macDragRegion('self', WINDOWS)).toBeUndefined();
    expect(macDragRegion('deep', WINDOWS)).toBeUndefined();
  });

  it('names the key store of the platform: the Keychain on macOS, the Credential Manager on Windows', () => {
    expect(t('settingsAi.keyNotSaved', storeParams(MAC))).toBe(
      'Key chưa được lưu. Thử lại; nếu vẫn lỗi, kiểm tra Keychain của macOS.',
    );
    expect(t('settingsAi.keyNotSaved', storeParams(WINDOWS))).toBe(
      'Key chưa được lưu. Thử lại; nếu vẫn lỗi, kiểm tra Windows Credential Manager.',
    );
  });
});
