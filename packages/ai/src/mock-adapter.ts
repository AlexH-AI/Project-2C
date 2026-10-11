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
 * The answers themselves are `mockAnalysisOutput` / `mockDiscoveryOutput` of `schema.ts`, which the
 * seed of `db` writes too. They pass the mode's schema for every input the KYC gate lets through
 * (`kyc-gate.ts`): analysis needs at least one fact; discovery needs two strategy items, one per
 * missing hạng mục and one more when a fact is known, so the gate's facts and missing hạng mục are
 * enough. Other inputs get an answer the schema rejects, as a real model's could be.
 */
import { KYC_CATEGORIES, type KycCategory } from '@p2c/domain';
import type { AiAdapter, AiCompleteRequest, AiCompletion } from './adapter';
import { AiError } from './errors';
import { extractJson } from './extract-json';
import {
  FACT_CODE,
  mockAnalysisOutput,
  mockDiscoveryOutput,
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
      : (input['mode'] === 'discovery' ? mockDiscoveryOutput : mockAnalysisOutput)(
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

const EXTRACTION_PATTERNS: readonly {
  readonly field: string;
  readonly pattern: RegExp;
  readonly value: (match: RegExpExecArray) => string;
}[] = [
  // Narrow on purpose (CX-A4): what may mean something else gives no proposal.
  {
    field: 'childrenCount',
    // Not "cháu nội / ngoại": grandchildren.
    pattern: /(?<!\p{N})(\d{1,2})\s+(?:con|bé|cháu)(?!\p{L})(?!\s+(?:nội|ngoại)(?!\p{L}))/gu,
    value: (match) => match[1]!,
  },
  {
    field: 'maritalStatus',
    // Only "đã kết hôn": not "chưa / không muốn / … năm kết hôn" nor "đã từng kết hôn".
    pattern: /(?<=(?<!\p{L})đã\s+)kết hôn(?!\p{L})/giu,
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
