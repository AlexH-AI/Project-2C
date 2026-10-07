/**
 * The retry message (prompts G5 §5, Owner 07/10/2026), the same for the three modes: the 4th
 * message, after the wrong answer, with one validator issue a line. Word for word from
 * `docs/design/phase-5-prompts.md`; changing a word goes through G5.
 */
import type { ValidationIssue } from '../validator';

export const RETRY_TEMPLATE = `Kết quả vừa rồi chưa đạt kiểm tra tự động với các lỗi sau:
{issues}
Hãy trả lại toàn bộ kết quả dưới dạng đúng một khối JSON theo định dạng đã yêu cầu, sửa hết các lỗi trên và vẫn tuân thủ mọi quy tắc bắt buộc. Không thêm lời giải thích.`;

export function retryMessage(issues: readonly ValidationIssue[]): string {
  const lines = issues.map(({ code, path, detail }) => `- ${code} tại ${path}: ${detail}`);
  // A function, so a `$` in a detail is not read as a replacement pattern.
  return RETRY_TEMPLATE.replace('{issues}', () => lines.join('\n'));
}
