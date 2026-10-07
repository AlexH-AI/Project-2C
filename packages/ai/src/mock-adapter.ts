/**
 * Mock provider (spec Phase 5 §10, D-1 item 6): for demos and e2e, only when chosen in Settings.
 * Nothing random: the answer is built from the input message alone, with fixed sentences, so the
 * same input always gives the same output. Analysis and discovery cite only fact codes and missing
 * hạng mục found in the input; extraction recognises a few simple phrases.
 *
 * The input is the first `user` message, a JSON block: `{ mode, facts, missingCategories, … }` for
 * analysis / discovery, `{ note, fields }` for extraction (G5 prompt draft §1.1, §4.1).
 */
import { KYC_CATEGORIES, type KycCategory } from '@p2c/domain';
import type { AiAdapter, AiCompleteRequest, AiCompletion } from './adapter';
import { AiError } from './errors';
import { extractJson } from './extract-json';
import type { AnalysisOutput, DiscoveryOutput, ExtractionOutput } from './schema';

const FACT_CODES = /(?<![\p{L}\p{N}])F[1-9]\d*(?![\p{L}\p{N}])/gu;

export function createMockAdapter(): AiAdapter {
  return {
    complete: async (request) => answer(request),
  };
}

function answer(request: AiCompleteRequest): AiCompletion {
  const content = request.messages.find((message) => message.role === 'user')?.content ?? '';
  const json = extractJson(content);
  if (!json.found) throw new AiError('AI_BAD_REQUEST');
  // extractJson only finds `{…}` blocks, so the value is an object.
  const input = json.value as Record<string, unknown>;
  const output =
    typeof input['note'] === 'string'
      ? extraction(input['note'])
      : (input['mode'] === 'discovery' ? discovery : analysis)(
          [...new Set(content.match(FACT_CODES))],
          missingCategories(input['missingCategories']),
        );
  return { content: JSON.stringify(output), promptTokens: 0, completionTokens: 0 };
}

function missingCategories(value: unknown): KycCategory[] {
  const items: unknown[] = Array.isArray(value) ? value : [];
  const codes = items.map((item) => (item as { code?: unknown } | null)?.code);
  return KYC_CATEGORIES.filter((category) => codes.includes(category));
}

/** `count` distinct codes from position `start`, wrapping round. */
function cite(codes: readonly string[], start: number, count: number): string[] {
  const picked = Array.from({ length: count }, (_, i) => codes[(start + i) % codes.length]);
  return [...new Set(picked.filter((code) => code !== undefined))];
}

function askAbout(missing: readonly KycCategory[]) {
  return missing.map((category) => ({
    text: 'Tìm hiểu thêm hạng mục còn thiếu trong buổi gặp tới',
    evidence: [],
    missingCategory: category,
  }));
}

function analysis(codes: readonly string[], missing: readonly KycCategory[]): AnalysisOutput {
  return {
    hypotheses: [
      { text: 'Khách hàng đặt sự ổn định của gia đình lên trước', evidence: cite(codes, 0, 2) },
      { text: 'Khách hàng cân nhắc kỹ trước các quyết định dài hạn', evidence: cite(codes, 2, 1) },
    ],
    needs: [
      { text: 'Một kế hoạch tài chính cho các mục tiêu đã nêu', evidence: cite(codes, 1, 2) },
    ],
    painPoints: [
      { text: 'Băn khoăn giữa nhu cầu hiện tại và mục tiêu xa', evidence: cite(codes, 3, 1) },
    ],
    themes: [{ text: 'Gia đình và sự an tâm lâu dài', evidence: cite(codes, 4, 3) }],
    discoveryStrategy: [
      { text: 'Làm rõ thứ tự ưu tiên giữa các mục tiêu', evidence: cite(codes, 0, 1) },
      ...askAbout(missing),
    ].slice(0, 6),
    nextBestActions: [{ text: 'Hẹn buổi trao đổi về mục tiêu chính', evidence: cite(codes, 1, 1) }],
  };
}

function discovery(codes: readonly string[], missing: readonly KycCategory[]): DiscoveryOutput {
  const known = codes.length > 0;
  return {
    hypotheses: known
      ? [{ text: 'Khách hàng sẵn lòng chia sẻ về gia đình', evidence: cite(codes, 0, 2) }]
      : [],
    discoveryStrategy: [
      ...askAbout(missing),
      ...(known
        ? [{ text: 'Hỏi sâu thêm về điều khách hàng đã chia sẻ', evidence: cite(codes, 1, 1) }]
        : []),
    ].slice(0, 6),
    nextBestActions: [
      known
        ? { text: 'Hẹn buổi gặp tiếp để tìm hiểu thêm', evidence: cite(codes, 0, 1) }
        : askAbout(missing.slice(0, 1))[0]!,
    ],
  };
}

const EXTRACTION_PATTERNS: readonly {
  readonly pattern: RegExp;
  readonly fact: (match: RegExpExecArray) => { field: string; value: string };
}[] = [
  {
    pattern: /(?<!\p{N})(\d{1,2})\s+(?:con|bé|cháu)(?!\p{L})/gu,
    fact: (match) => ({ field: 'childrenCount', value: match[1]! }),
  },
  { pattern: /kết hôn/giu, fact: () => ({ field: 'maritalStatus', value: 'Đã kết hôn' }) },
  { pattern: /độc thân/giu, fact: () => ({ field: 'maritalStatus', value: 'Độc thân' }) },
];

function extraction(note: string): ExtractionOutput {
  const found = EXTRACTION_PATTERNS.flatMap(({ pattern, fact }) =>
    [...note.matchAll(pattern)].map((match) => ({
      at: match.index,
      fact: { ...fact(match), quote: match[0] },
    })),
  );
  return {
    facts: found
      .sort((a, b) => a.at - b.at)
      .map(({ fact }) => fact)
      .slice(0, 20),
  };
}
