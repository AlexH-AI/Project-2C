// The prompt texts are the ones the Owner approved at G5, word for word (prompts §2–§5).
import guide from '../../../../docs/design/phase-5-prompts.md?raw';
import { describe, expect, it } from 'vitest';
import { analysisPrompt } from './analysis';
import { connectionCheck } from './connection';
import { discoveryPrompt } from './discovery';
import { extractionPrompt } from './extraction';
import { RETRY_TEMPLATE, retryMessage } from './retry';

/** The ````text blocks of the G5 file, in order: analysis, discovery, extraction, retry. */
const blocks = [...guide.replaceAll('\r\n', '\n').matchAll(/^````text\n([\s\S]*?)\n````$/gm)].map(
  (match) => match[1],
);

describe('prompts', () => {
  it('copies the G5 texts word for word', () => {
    expect(blocks).toEqual([
      analysisPrompt.system,
      discoveryPrompt.system,
      extractionPrompt.system,
      RETRY_TEMPLATE,
    ]);
  });

  it('versions each prompt and gives it the maxTokens of G5 §1', () => {
    expect([analysisPrompt, discoveryPrompt, extractionPrompt]).toMatchObject([
      { version: 'analysis@7', maxTokens: 24_000 },
      { version: 'discovery@7', maxTokens: 24_000 },
      { version: 'extraction@2', maxTokens: 12_000 },
    ]);
  });

  // G5 §16 (A6): the user of the app is "RM" in every prompt, and the rate is spelt "tỷ lệ chốt".
  // The old word is spelt `R[E]`, so a search for it as a word finds no line of this package.
  it.each([analysisPrompt, discoveryPrompt, extractionPrompt])(
    'calls the user of the app RM: $version',
    ({ system }) => {
      expect(system).toContain('RM (chuyên viên quan hệ khách hàng)');
      expect(system).not.toMatch(/(?<![\p{L}\p{N}])R[E](?![\p{L}\p{N}])/u);
    },
  );

  it.each([analysisPrompt, discoveryPrompt])('writes "tỷ lệ chốt": $version', ({ system }) => {
    expect(system).toContain('xác suất, tỷ lệ chốt, khả năng mua');
  });

  it('lists one validator issue a line in the retry message (G5 §5)', () => {
    const message = retryMessage([
      { code: 'V3', path: 'hypotheses[0].text', detail: 'có "xác suất"' },
      { code: 'V1', path: '$', detail: 'không có khối JSON' },
    ]);
    expect(message).toBe(
      'Kết quả vừa rồi chưa đạt kiểm tra tự động với các lỗi sau:\n' +
        '- V3 tại hypotheses[0].text: có "xác suất"\n' +
        '- V1 tại $: không có khối JSON\n' +
        'Hãy trả lại toàn bộ kết quả dưới dạng đúng một khối JSON theo định dạng đã yêu cầu, sửa hết các lỗi trên và vẫn tuân thủ mọi quy tắc bắt buộc. Không thêm lời giải thích.',
    );
  });

  it('checks the connection with the G5 §6 messages', () => {
    expect(connectionCheck).toEqual({
      messages: [
        { role: 'system', content: 'Trả lời đúng một từ: OK' },
        { role: 'user', content: 'ping' },
      ],
      maxTokens: 1_024,
    });
  });
});
