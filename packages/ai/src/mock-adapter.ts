/**
 * Mock provider (spec Phase 5 §10, D-1 item 6): for demos and e2e, only when chosen in Settings.
 * Nothing random: the answer is built from the input message alone, with fixed sentences, so the
 * same input always gives the same output. Analysis and discovery cite only the codes of the input's
 * facts list and its missing hạng mục; extraction recognises a few simple phrases, for the trường of
 * the input's `fields` list only.
 *
 * The input is the first `user` message, a JSON block: `{ mode, facts, missingCategories, … }` for
 * analysis / discovery, `{ note, fields }` for extraction (prompts §1.1, §4.1).
 *
 * The answer passes the mode's schema only for inputs the KYC gate lets through: analysis needs at
 * least one fact, discovery at least one fact and one missing hạng mục (`kyc-gate.ts`). Other inputs
 * get an answer the schema rejects, as a real model's could be.
 */
import { KYC_CATEGORIES, type KycCategory } from '@p2c/domain';
import type { AiAdapter, AiCompleteRequest, AiCompletion } from './adapter';
import { AiError } from './errors';
import { extractJson } from './extract-json';
import {
  FACT_CODE,
  type AnalysisOutput,
  type DiscoveryOutput,
  type ExtractionOutput,
} from './schema';

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
      ? extraction(input['note'], allowedFields(input['fields']))
      : (input['mode'] === 'discovery' ? discovery : analysis)(
          factCodes(input['facts']),
          missingCategories(input['missingCategories']),
        );
  return { content: JSON.stringify(output), promptTokens: 0, completionTokens: 0 };
}

/** The `code` of each element of an input list (facts, missing hạng mục); none when not a list. */
function codesOf(value: unknown): unknown[] {
  const items: unknown[] = Array.isArray(value) ? value : [];
  return items.map((item) => (item as { code?: unknown } | null)?.code);
}

/** Codes of the facts list, in order; a `F…` word inside a fact's value is not a code. */
function factCodes(value: unknown): string[] {
  const codes = codesOf(value).filter(
    (code): code is string => typeof code === 'string' && FACT_CODE.test(code),
  );
  return [...new Set(codes)];
}

function missingCategories(value: unknown): KycCategory[] {
  const codes = codesOf(value);
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
    personalityNotes: [
      {
        system: 'PSYCHOLOGY',
        text: 'KH có thể thiên về hướng nội, cần thời gian suy nghĩ trước khi quyết định',
        evidence: cite(codes, 2, 1),
      },
    ],
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
    personalityNotes: [],
  };
}

const EXTRACTION_PATTERNS: readonly {
  readonly field: string;
  readonly pattern: RegExp;
  readonly value: (match: RegExpExecArray) => string;
}[] = [
  {
    field: 'childrenCount',
    pattern: /(?<!\p{N})(\d{1,2})\s+(?:con|bé|cháu)(?!\p{L})/gu,
    value: (match) => match[1]!,
  },
  {
    field: 'maritalStatus',
    pattern: /(?<!(?:chưa|không)(?:\s+từng)?\s+)kết hôn/giu,
    value: () => 'Đã kết hôn',
  },
  { field: 'maritalStatus', pattern: /độc thân/giu, value: () => 'Độc thân' },
];

/** Trường of the input's `fields` list (prompts §4.1), so that V7 keeps what the Mock proposes. */
function allowedFields(value: unknown): string[] {
  const items: unknown[] = Array.isArray(value) ? value : [];
  return items
    .map((item) => (item as { field?: unknown } | null)?.field)
    .filter((field): field is string => typeof field === 'string');
}

function extraction(note: string, fields: readonly string[]): ExtractionOutput {
  const patterns = EXTRACTION_PATTERNS.filter(({ field }) => fields.includes(field));
  const found = patterns.flatMap(({ field, pattern, value }) =>
    [...note.matchAll(pattern)].map((match) => ({
      at: match.index,
      fact: { field, value: value(match), quote: match[0] },
    })),
  );
  return {
    facts: found
      .sort((a, b) => a.at - b.at)
      .map(({ fact }) => fact)
      .slice(0, 20),
  };
}
