/**
 * Mock provider (spec Phase 5 §10, D-1 item 6): for demos and e2e, only when chosen in Settings.
 * Nothing random: the answer is built from the input message alone, with fixed sentences, so the
 * same input always gives the same output. Analysis and discovery cite only the codes of the input's
 * facts list and its missing hạng mục; extraction recognises a few simple phrases said of the KH,
 * for the trường of the input's `fields` list only.
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

/**
 * After "<n> con / bé / cháu", what makes them not children: grandchildren ("cháu nội / ngoại"),
 * figures ("con số", DR6-19), animals and things ("2 con chó", "10 con bò", DR6-78).
 */
const NOT_CHILDREN = 'nội|ngoại|số|chó|mèo|bò|trâu|lợn|heo|gà|vịt|cá|chim|ngựa|dê|thỏ|xe|tàu|dao';

const EXTRACTION_PATTERNS: readonly {
  readonly field: string;
  readonly pattern: RegExp;
  readonly value: (match: RegExpExecArray) => string;
}[] = [
  // Narrow on purpose (CX-A4): what may mean something else gives no proposal.
  {
    field: 'childrenCount',
    pattern: new RegExp(
      String.raw`(?<!\p{N})(\d{1,2})\s+(?:con|bé|cháu)(?!\p{L})(?!\s+(?:${NOT_CHILDREN})(?!\p{L}))`,
      'gu',
    ),
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

/**
 * Someone other than the KH: named before a phrase in its sentence, the phrase is about them
 * (DR6-19, DR6-78). A word that may also name the KH ("cô", "ông"…) gives no proposal rather than
 * a wrong one. Not "vợ chồng": the couple, the KH one of them.
 */
const SOMEONE_ELSE = new RegExp(
  String.raw`(?<!\p{L})(?:${[
    'con|cháu|em|anh trai|anh họ|anh rể|anh ruột|chị gái|chị họ|chị dâu|chị ruột',
    'ông|bà|cô|chú|bác|dì|cậu|bố|mẹ|cha|ba|má|vợ(?! chồng)|(?<!vợ )chồng',
    'bạn|sếp|hàng xóm|người quen|đồng nghiệp|người thân|họ hàng',
  ].join('|')})(?!\p{L})`,
  'iu',
);

/** Said as a supposition, before a phrase in its sentence: "nếu đã kết hôn, có 2 con" (DR6-78). */
const SUPPOSED = /(?<!\p{L})(?:nếu|giả sử|giả như|giá mà|giá như|lỡ như)(?!\p{L})/iu;

/** Said not to be: before a phrase in its clause. */
const NEGATION = /(?<!\p{L})(?:không|chưa|chẳng)(?!\p{L})/iu;

/**
 * Asked of the phrases of `note` in order: whether `word` comes before the phrase at `at` in its
 * part, the parts ending after each mark of `ends`. Each part is searched once, so all the phrases
 * take one pass over the note, however long its parts (DR6-79).
 */
function wordBefore(note: string, ends: RegExp, word: RegExp): (at: number) => boolean {
  const starts = [0, ...[...note.matchAll(ends)].map((mark) => mark.index + 1)];
  let part = -1;
  /** Where `word` first ends in `part`. */
  let found = Infinity;
  return (at) => {
    let next = Math.max(part, 0);
    while (next + 1 < starts.length && starts[next + 1]! <= at) next++;
    if (next !== part) {
      part = next;
      const start = starts[part]!;
      const first = word.exec(note.slice(start, starts[part + 1]));
      found = first ? start + first.index + first[0].length : Infinity;
    }
    return found <= at;
  };
}

/**
 * Whether a phrase says something of the KH (DR6-19), asked of the phrases in order: no one else
 * named and no supposition before it in its sentence ("Em trai KH còn độc thân", "KH có một con
 * trai đang sống độc thân"), no negation before it in its clause ("KH không có 2 con"). Narrow, as
 * the patterns are.
 */
function aboutTheKh(note: string): (at: number) => boolean {
  const before = [
    wordBefore(note, /[.!?;\n]/g, SOMEONE_ELSE),
    wordBefore(note, /[.!?;\n]/g, SUPPOSED),
    wordBefore(note, /[.!?;,\n]/g, NEGATION),
  ];
  return (at) => !before.some((found) => found(at));
}

function extraction(note: string, fields: readonly string[]): ExtractionOutput {
  const ofTheKh = aboutTheKh(note);
  const facts = EXTRACTION_PATTERNS.filter(({ field }) => fields.includes(field))
    .flatMap(({ field, pattern, value }) =>
      [...note.matchAll(pattern)].map((match) => ({
        at: match.index,
        fact: { field, value: value(match), quote: match[0] },
      })),
    )
    .sort((a, b) => a.at - b.at)
    .filter(({ at }) => ofTheKh(at))
    .map(({ fact }) => fact);
  return { facts: facts.slice(0, 20) };
}
