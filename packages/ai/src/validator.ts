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
  if (parsed == null) return [{ code: 'V1', path: '$', detail: 'không có khối JSON' }];
  const result = AI_OUTPUT_SCHEMAS[mode].safeParse(parsed);
  if (!result.success) return result.error.issues.map(schemaIssue);
  if (mode === 'extraction') return [];
  if (input === undefined) throw new TypeError(`validateOutput needs the input in ${mode} mode`);
  const items = itemsOf(result.data as AnalysisOutput | DiscoveryOutput);
  return [...evidenceIssues(items, input), ...items.flatMap(phraseIssues)];
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

/** V2: cited facts are in the input, a named hạng mục is one the gate lists as missing. */
function evidenceIssues(items: readonly OutputItem[], input: OutputCheckInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const item of items) {
    item.evidence.forEach((code, i) => {
      if (!input.factCodes.includes(code)) {
        const path = `${item.path}.evidence[${i}]`;
        issues.push({ code: 'V2', path, detail: `${code} không có trong đầu vào` });
      }
    });
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
  const chars = Array.from(phrase);
  return chars.length > MAX_QUOTED ? `${chars.slice(0, MAX_QUOTED - 1).join('')}…` : phrase;
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

function schemaIssue(issue: z.core.$ZodIssue): ValidationIssue {
  return { code: 'V1', path: pathOf(issue.path), detail: schemaDetail(issue) };
}

function schemaDetail(issue: z.core.$ZodIssue): string {
  switch (issue.code) {
    case 'invalid_type':
      return `sai kiểu, cần ${issue.expected}`;
    case 'too_small':
      return issue.origin === 'array' ? `cần ít nhất ${issue.minimum} phần tử` : 'chuỗi rỗng';
    case 'too_big':
      return issue.origin === 'array'
        ? `quá ${issue.maximum} phần tử`
        : `quá ${issue.maximum} ký tự`;
    case 'invalid_value':
      return 'giá trị không hợp lệ';
    case 'custom':
      return issue.message;
    default:
      return 'sai định dạng';
  }
}
