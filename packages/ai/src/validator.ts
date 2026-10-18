/**
 * Validator of the AI output (spec Phase 5 §6.4, prompts G5 §7–§8): V1 schema, V2 evidence and
 * hạng mục, V3–V6 blocked phrases for analysis / discovery; V7 drops wrong extraction facts one by
 * one (`filterExtraction`). Each issue's `detail` is Vietnamese: it goes back to the model in the
 * retry message (prompts §5) and is stored in `validator_json`.
 */
import {
  KYC_FIELDS,
  normalizeKycValue,
  type KycCategory,
  type KycField,
  type KycValue,
} from '@p2c/domain';
import type { z } from 'zod';
import { BLOCKLISTS } from './blocklists';
import { codePointsOver, cutCodePoints } from './code-points';
import {
  AI_OUTPUT_SCHEMAS,
  type AiMode,
  type AnalysisOutput,
  type DiscoveryOutput,
  type ExtractionOutput,
} from './schema';
import { matchText } from './text-match';

export const VALIDATION_CODES = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'] as const;

export type ValidationCode = (typeof VALIDATION_CODES)[number];

export interface ValidationIssue {
  readonly code: ValidationCode;
  /** Where in the output, e.g. `hypotheses[0].text`; `$` is the whole output. */
  readonly path: string;
  readonly detail: string;
}

/** What V2 checks the analysis / discovery output against: the input sent to the model. */
export interface OutputCheckInput {
  /** `F{seq}` codes of the facts in the input; a superseded fact is not there. */
  readonly factCodes: readonly string[];
  /** Hạng mục the gate lists as missing. */
  readonly missingCategories: readonly KycCategory[];
}

/** The answer has no JSON block (spec §6.1). */
const NO_JSON: ValidationIssue = { code: 'V1', path: '$', detail: 'không có khối JSON' };

/**
 * The answer was cut by `maxTokens` before its JSON block ended (DR5-05): said instead of `NO_JSON`,
 * so neither the RE nor the retry message reads it as an answer without JSON (spec §6.1).
 */
export const CUT_ANSWER: ValidationIssue = {
  code: 'V1',
  path: '$',
  detail: 'trả lời bị cắt (hết maxTokens) trước khi khối JSON kết thúc',
};

/**
 * Issues of an output parsed from the model's answer, `null` (or `undefined`) when the answer had no
 * JSON block. Extraction is checked for V1 only here: V7 drops single facts (`filterExtraction`),
 * never the whole answer, so it takes no `input`. Any other mode needs it, also a mode typed
 * `AiMode` (`[M]` keeps the condition from distributing over the union, review #420); without it,
 * the call throws rather than skip V2–V6.
 */
export function validateOutput<M extends AiMode>(
  mode: M,
  parsed: unknown,
  ...[input]: [M] extends ['extraction'] ? [] : [input: OutputCheckInput]
): ValidationIssue[] {
  if (parsed == null) return [NO_JSON];
  const result = AI_OUTPUT_SCHEMAS[mode].safeParse(parsed);
  if (!result.success) {
    return capped(result.error.issues.map((issue) => schemaIssue(issue, parsed)));
  }
  if (mode === 'extraction') return [];
  if (input === undefined) throw new TypeError(`validateOutput needs the input in ${mode} mode`);
  const items = itemsOf(result.data as AnalysisOutput | DiscoveryOutput);
  return capped([...evidenceIssues(items, input), ...items.flatMap(phraseIssues)]);
}

/** The most issues one check lists; the retry message has one line for each (prompts §5). */
const MAX_ISSUES = 30;

/**
 * The first issues, the rest counted in the last one: thousands of wrong elements (malformed codes,
 * one schema issue each) keep the retry message and `validator_json` small (MS-A1, review #521).
 */
function capped(issues: ValidationIssue[]): ValidationIssue[] {
  if (issues.length <= MAX_ISSUES) return issues;
  const kept = issues.slice(0, MAX_ISSUES - 1);
  // Named by the first issue left out.
  const { code } = issues[MAX_ISSUES - 1]!;
  return [...kept, { code, path: '$', detail: `và ${issues.length - kept.length} lỗi khác` }];
}

/** What every element of an analysis / discovery block has in common. */
interface OutputElement {
  readonly text: string;
  readonly evidence: readonly string[];
  readonly missingCategory?: KycCategory;
}

interface OutputItem extends OutputElement {
  readonly block: string;
  readonly path: string;
}

/** Every element of every block, in block order. */
function itemsOf(output: AnalysisOutput | DiscoveryOutput): OutputItem[] {
  const blocks: [string, readonly OutputElement[]][] = Object.entries(output);
  return blocks.flatMap(([block, elements]) =>
    elements.map((element, i) => ({ ...element, block, path: `${block}[${i}]` })),
  );
}

/** A wrong evidence list names this many of its wrong codes and counts the rest. */
const MAX_LISTED_CODES = 5;

/**
 * V2: cited facts are in the input, a named hạng mục is one the gate lists as missing. The wrong
 * codes of one element make one issue, so thousands of them keep the retry message and
 * `validator_json` small (CL-A8, MS-A1).
 */
function evidenceIssues(items: readonly OutputItem[], input: OutputCheckInput): ValidationIssue[] {
  const known = new Set(input.factCodes);
  const issues: ValidationIssue[] = [];
  for (const item of items) {
    const wrong = item.evidence.filter((code) => !known.has(code));
    if (wrong.length > 0) {
      // One wrong code keeps its own path, as before.
      const path =
        wrong.length === 1
          ? `${item.path}.evidence[${item.evidence.indexOf(wrong[0]!)}]`
          : `${item.path}.evidence`;
      const listed = wrong.slice(0, MAX_LISTED_CODES).map(quoted).join(', ');
      const rest = wrong.length - MAX_LISTED_CODES;
      const codes = rest > 0 ? `${listed} và ${rest} mã khác` : listed;
      issues.push({ code: 'V2', path, detail: `${codes} không có trong đầu vào` });
    }
    const category = item.missingCategory;
    if (category !== undefined && !input.missingCategories.includes(category)) {
      const path = `${item.path}.missingCategory`;
      issues.push({ code: 'V2', path, detail: `${category} không phải hạng mục đang thiếu` });
    }
  }
  return issues;
}

/** Trường the extraction may propose: all but those taken from the hồ sơ KH (D2), in catalog order. */
export const EXTRACTION_FIELDS: readonly KycField[] = (
  Object.keys(KYC_FIELDS) as KycField[]
).filter((field) => !KYC_FIELDS[field].fromProfile);

export interface ExtractionCheckInput {
  /** The KYC note sent to the model, as the RE wrote it. */
  readonly note: string;
  readonly fields: readonly KycField[];
}

export interface ExtractedFact {
  readonly field: KycField;
  readonly value: KycValue;
  readonly quote: string;
}

const collapseSpaces = (text: string) => text.normalize('NFC').replace(/\s+/gu, ' ');

/**
 * V7 on an extraction that passed V1: drops each fact whose trường is not allowed (never
 * `birthYear` / `gender`), whose value its trường cannot hold, or whose quote is not in the note
 * once white space is collapsed. Kept facts carry the value taken to the type of their trường
 * (`normalizeKycValue`). No V3–V6: a value is the KH's own words (spec §6.4).
 */
export function filterExtraction(
  output: ExtractionOutput,
  input: ExtractionCheckInput,
): { kept: ExtractedFact[]; dropped: ValidationIssue[] } {
  const note = collapseSpaces(input.note);
  const kept: ExtractedFact[] = [];
  const dropped: ValidationIssue[] = [];
  output.facts.forEach(({ field, value, quote }, i) => {
    const drop = (key: string, detail: string) =>
      dropped.push({ code: 'V7', path: `facts[${i}].${key}`, detail });
    if (!isAllowedField(field, input.fields)) {
      drop('field', `trường "${quoted(field)}" không được phép`);
      return;
    }
    const normalized = valueOf(field, value);
    if (normalized === null) {
      drop('value', `giá trị không hợp với trường "${field}"`);
    } else if (!note.includes(collapseSpaces(quote))) {
      drop('quote', 'trích dẫn không có trong ghi chú');
    } else {
      kept.push({ field, value: normalized, quote });
    }
  });
  return { kept, dropped };
}

function isAllowedField(field: string, allowed: readonly KycField[]): field is KycField {
  return (
    (allowed as readonly string[]).includes(field) && !KYC_FIELDS[field as KycField].fromProfile
  );
}

function valueOf(field: KycField, value: KycValue): KycValue | null {
  try {
    return normalizeKycValue(field, value);
  } catch {
    return null;
  }
}

/** Text from the output is cut to 40 characters in a detail (prompts §5). */
const MAX_QUOTED = 40;

function quoted(phrase: string): string {
  return codePointsOver(phrase, MAX_QUOTED) ? `${cutCodePoints(phrase, MAX_QUOTED - 1)}…` : phrase;
}

/**
 * V3–V6 on the element's text: one issue per blocklist entry found (G5 §7.6 "mỗi lần khớp" read as
 * per entry; the same phrase twice in one text is one issue, which changes neither pass / block
 * nor the retry message). Personality labels are
 * allowed in `personalityNotes` (V5 only, Owner Q5); the codes of `evidence`, `missingCategory` and
 * `system` are not text.
 */
function phraseIssues(item: OutputItem): ValidationIssue[] {
  const text = matchText(item.text);
  const rules = (['V3', 'V4', 'V5', 'V6'] as const).filter(
    (code) => !(code === 'V5' && item.block === 'personalityNotes'),
  );
  return rules.flatMap((code) =>
    BLOCKLISTS[code].flatMap((matcher) => {
      const found = matcher(text);
      const path = `${item.path}.text`;
      return found === null ? [] : [{ code, path, detail: `có "${quoted(found)}"` }];
    }),
  );
}

/** `['needs', 0, 'text']` → `needs[0].text`. */
function pathOf(segments: readonly PropertyKey[]): string {
  const path = segments
    .map((segment) => (typeof segment === 'number' ? `[${segment}]` : `.${String(segment)}`))
    .join('')
    .replace(/^\./, '');
  return path === '' ? '$' : path;
}

function schemaIssue(issue: z.core.$ZodIssue, parsed: unknown): ValidationIssue {
  const missing = !isAt(parsed, issue.path);
  return { code: 'V1', path: pathOf(issue.path), detail: schemaDetail(issue, missing) };
}

/** Whether the parsed output has a value at `path`; `undefined` (never in JSON) is none. */
function isAt(root: unknown, path: readonly PropertyKey[]): boolean {
  let value = root;
  for (const key of path) {
    if (typeof value !== 'object' || value === null || !Object.hasOwn(value, key)) return false;
    value = (value as Record<PropertyKey, unknown>)[key];
  }
  return value !== undefined;
}

/**
 * The right form, so the retry can fix it (G5 §5, §11.6, DR6-24). Bounds are on blocks only: a
 * text's length is a refinement with its own message (`schema.ts`).
 */
function schemaDetail(issue: z.core.$ZodIssue, missing: boolean): string {
  const lead = missing ? 'thiếu' : 'sai kiểu';
  switch (issue.code) {
    case 'invalid_type':
      return `${lead}, cần ${issue.expected}`;
    case 'invalid_union': {
      // The one union of the outputs: an extraction value. A string that breaks a rule of strings
      // (too long, empty) is told that rule, not that it is of the wrong type.
      const asText = issue.errors[0]?.[0];
      return asText?.code === 'custom'
        ? asText.message
        : `${lead}, cần string, number hoặc boolean`;
    }
    case 'too_small':
      return `cần ít nhất ${issue.minimum} phần tử`;
    case 'too_big':
      return `quá ${issue.maximum} phần tử`;
    case 'invalid_value':
      return `${missing ? 'thiếu' : 'giá trị không hợp lệ'}, cần một trong: ${issue.values.map(String).join(', ')}`;
    case 'custom':
      return issue.message;
    default:
      // `invalid_format`: the one pattern of the outputs is the fact code (`FACT_CODE`).
      return 'sai định dạng, cần mã dữ kiện dạng F12';
  }
}
