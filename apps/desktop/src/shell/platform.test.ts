import { describe, expect, it } from 'vitest';
import { t } from '../i18n';
import { isMac, modKey, modParams, storeParams } from './platform';

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

  it('names the key store of the platform: the Keychain on macOS, the Credential Manager on Windows', () => {
    expect(t('settingsAi.keyNotSaved', storeParams(MAC))).toBe(
      'Key chưa được lưu. Thử lại; nếu vẫn lỗi, kiểm tra Keychain của macOS.',
    );
    expect(t('settingsAi.keyNotSaved', storeParams(WINDOWS))).toBe(
      'Key chưa được lưu. Thử lại; nếu vẫn lỗi, kiểm tra Windows Credential Manager.',
    );
  });
});
