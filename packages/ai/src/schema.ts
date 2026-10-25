/**
 * Zod schemas of the AI input and output (spec Phase 5 §6.1, §6.2, Owner G2 07/10/2026). `packages/db`
 * imports this module alone (`@p2c/ai/schema`) to check `input_json` and `output_json` (§7.3 rule 3), so
 * it depends only on `zod` and `@p2c/domain`, never on another module of `packages/ai`
 * (ADR-0006, phụ lục 07/10/2026). There is one schema per mode, always the latest: a schema change
 * means reloading the simulated data (R2-02), not keeping old schemas.
 *
 * The seed of `db` writes Mock analyses as the app does, so what makes one is here too, one copy for
 * both (I-10): the Vietnamese labels sent, `buildAnalysisInput` and the Mock's answers.
 */
import {
  formatIsoDate,
  isIsoDate,
  KYC_CATEGORIES,
  KYC_FIELDS,
  normalizeText,
  type CalendarDate,
  type KycCategory,
  type KycFact,
  type KycField,
  type KycGateResult,
} from '@p2c/domain';
// `zod/mini` for its size (DR6-25): the checks of `zod`, but no English messages, only "Invalid
// input". No V1 detail shows one: the validator words it from the issue, or takes our message.
import * as z from 'zod/mini';

/** The three AI modes: `analysis` (`PAIN_POINT_ANALYSIS`), `discovery` (`PROFILE_DISCOVERY`), `extraction`. */
export const AI_MODES = ['analysis', 'discovery', 'extraction'] as const;

export type AiMode = (typeof AI_MODES)[number];

/** Settings → AI providers (spec §4.1); here so that `ai_analyses` stores the same values. */
export const AI_PROVIDERS = ['MOCK', 'OPENCODE_GO'] as const;

export type AiProvider = (typeof AI_PROVIDERS)[number];

/**
 * Who gave a stored analysis (`ai_analyses.provider`, §7.1): a Settings provider, or ChatGPT web
 * (P7), which is never a Settings value (§4.1).
 */
export const AI_ANALYSIS_PROVIDERS = [...AI_PROVIDERS, 'CHATGPT_WEB'] as const;

export type AiAnalysisProvider = (typeof AI_ANALYSIS_PROVIDERS)[number];

/**
 * The providers that name no model and count no token (§7.1): Mock, and ChatGPT web (P7). `ai`
 * writes a row by this list and `db` checks one by it.
 */
export const AI_ANALYSIS_NO_MODEL: readonly AiAnalysisProvider[] = ['MOCK', 'CHATGPT_WEB'];

/**
 * The most characters (by code point) of a rejected answer kept as `raw_output` (§7.1); a longer
 * ChatGPT web paste is refused (§3.1).
 */
export const MAX_AI_RAW_OUTPUT = 20_000;

/** `DEFAULT` sends no `reasoning_effort`; the others are sent as low / medium / high. */
export const AI_REASONING_LEVELS = ['DEFAULT', 'LOW', 'MEDIUM', 'HIGH'] as const;

export type AiReasoningLevel = (typeof AI_REASONING_LEVELS)[number];

/** A well-formed fact code: `F` and a seq with no leading zero. */
export const FACT_CODE = /^F[1-9]\d*$/;

/** Code of a confirmed fact in the AI input and on the KYC facts list: `F{seq}`. */
export function factCode(seq: number): string {
  if (!Number.isSafeInteger(seq) || seq < 1) throw new RangeError(`Not a fact seq: ${seq}`);
  return `F${seq}`;
}

/** A day as the app stores it: `yyyy-mm-dd`, a real day of the calendar. */
const isoDate = z.string().check(z.refine(isIsoDate, 'không phải ngày yyyy-mm-dd'));

/** A fact code, its message the V1 detail of a malformed one (G5 §11.6). */
const factCodeString = z
  .string()
  .check(z.regex(FACT_CODE, 'sai định dạng, cần mã dữ kiện dạng F12'));

/**
 * What the app sends for an analysis or discovery (spec §6.1), stored as `input_json` (§7.1): the
 * facts in effect, each with its code `F{seq}`, and the gate. `db` checks it when an analysis is
 * recorded or a backup loaded (§7.3 rule 3), so the panel reads it without trusting a cast. Strict:
 * a key the app never sends (a name, a phone…) is refused, so `input_json` holds only what §6.1 lists.
 */
export const analysisInputSchema = z.strictObject({
  analysisDate: isoDate,
  mode: z.enum(AI_MODES.filter((mode) => mode !== 'extraction')),
  facts: z
    .array(
      z.strictObject({
        code: factCodeString,
        category: z.string(),
        field: z.string(),
        value: z.string(),
        confirmedAt: isoDate,
        conflict: z.boolean(),
      }),
    )
    .check(
      z.refine(
        (facts) => new Set(facts.map((fact) => fact.code)).size === facts.length,
        'trùng mã dữ kiện',
      ),
    ),
  missingCategories: z.array(z.strictObject({ code: z.enum(KYC_CATEGORIES), label: z.string() })),
  conflictWarnings: z.array(z.string()),
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;

// Refinement, pattern and union messages are Vietnamese: the validator puts them in a V1 detail,
// which goes back to the model in the retry message (prompts §5).

/**
 * What a string shows, read as K20 reads a name (`normalizeText`): no invisible character (format,
 * default-ignorable such as U+3164, U+2800, a control character that is not white space nor NUL:
 * K25, DR6-111), each run of white space one space, NFC, trimmed (G5 §11.5). A string of invisible
 * characters only is empty.
 */
const visible = normalizeText;

/**
 * The longest string as written, invisible characters and loose marks included (G5 §11.5, DR6-77):
 * 300 characters written NFD are 900 at most. Counted as JavaScript does, so a huge string costs
 * nothing to refuse (DR5-09).
 */
const MAX_WRITTEN = 1_000;

/**
 * Every string the AI writes, trimmed: at most 1 000 characters as written, so invisible ones cannot
 * fill the history (DR6-77); what it shows is 1–300 characters (spec §6.2, G5 §10.4, §11.5).
 * The string is stored as written.
 */
const text = z.string().check(
  z.trim(),
  z.refine((s) => s.length <= MAX_WRITTEN, {
    message: 'quá 1 000 ký tự kể cả ký tự vô hình',
    abort: true,
  }),
  z.refine((s) => visible(s) !== '', { message: 'chuỗi rỗng', abort: true }),
  z.refine((s) => Array.from(visible(s)).length <= 300, 'quá 300 ký tự'),
);

/**
 * A text of analysis / discovery also has a letter it shows: the "…" of the prompt's format example
 * is not an answer (DR5-49 b, Owner G5 11/10/2026), nor is U+3164, a letter no one sees. Not for
 * extraction, whose value may be "2".
 */
const prose = text.check(z.refine((s) => /\p{L}/u.test(visible(s)), 'không có chữ'));
const evidence = z
  .array(factCodeString)
  .check(z.refine((codes) => new Set(codes).size === codes.length, 'trích trùng một dữ kiện'));

/** Hypotheses, needs, pain points and themes: always cite at least one fact. */
const evidencedItem = z.object({ text: prose, evidence: evidence.check(z.minLength(1)) });

/** Discovery strategy and next best actions: cite facts, or name a missing hạng mục, or both. */
const actionItem = z
  .object({
    text: prose,
    evidence: z._default(evidence, []),
    missingCategory: z.optional(z.enum(KYC_CATEGORIES)),
  })
  .check(
    z.refine(
      (item) => item.evidence.length > 0 || item.missingCategory !== undefined,
      'cần evidence hoặc missingCategory',
    ),
  );

/** Personality systems of `personalityNotes`: psychology (MBTI, DISC…) or tử vi / huyền học. */
export const PERSONALITY_SYSTEMS = ['PSYCHOLOGY', 'ESOTERIC'] as const;

/**
 * "Thông tin tham khảo" (P6, Owner G5 07/10/2026): the only block where personality labels may
 * appear (V5 checks the others). `[]` when no fact supports a note, also when the model leaves the
 * block out: an empty block is a right answer, not worth a retry (review #416).
 */
const personalityNotes = z._default(
  z
    .array(
      z.object({
        system: z.enum(PERSONALITY_SYSTEMS),
        text: prose,
        evidence: evidence.check(z.minLength(1)),
      }),
    )
    .check(z.maxLength(4)),
  [],
);

export const analysisOutputSchema = z.object({
  hypotheses: z.array(evidencedItem).check(z.minLength(1), z.maxLength(5)),
  needs: z.array(evidencedItem).check(z.minLength(1), z.maxLength(5)),
  painPoints: z.array(evidencedItem).check(z.minLength(1), z.maxLength(5)),
  themes: z.array(evidencedItem).check(z.minLength(1), z.maxLength(5)),
  discoveryStrategy: z.array(actionItem).check(z.minLength(1), z.maxLength(6)),
  nextBestActions: z.array(actionItem).check(z.minLength(1), z.maxLength(5)),
  personalityNotes,
});

export const discoveryOutputSchema = z.object({
  // May be empty, so the model may leave it out, as `personalityNotes`.
  hypotheses: z._default(z.array(evidencedItem).check(z.maxLength(3)), []),
  discoveryStrategy: z.array(actionItem).check(z.minLength(2), z.maxLength(6)),
  nextBestActions: z.array(actionItem).check(z.minLength(1), z.maxLength(5)),
  personalityNotes,
});

/**
 * Whether `field` is allowed, `value` fits it and `quote` is in the note is V7 (spec §6.4), which
 * drops only the wrong fact; the schema checks the shape, so one wrong fact does not reject them all.
 */
export const extractionOutputSchema = z.object({
  facts: z
    .array(
      z.object({
        field: text,
        // The validator puts "thiếu" or "sai kiểu" before the message (G5 §11.6).
        value: z.union([text, z.number(), z.boolean()], 'cần string, number hoặc boolean'),
        quote: text,
      }),
    )
    .check(z.maxLength(20)),
});

export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
export type DiscoveryOutput = z.infer<typeof discoveryOutputSchema>;
export type ExtractionOutput = z.infer<typeof extractionOutputSchema>;

export const AI_OUTPUT_SCHEMAS = {
  analysis: analysisOutputSchema,
  discovery: discoveryOutputSchema,
  extraction: extractionOutputSchema,
} as const satisfies Record<AiMode, z.ZodMiniType>;

// ---- the analysis input (spec §6.1, prompts G5 §1.1) ------------------------

/**
 * The Vietnamese labels sent to the model: the app's i18n `kycCategory.*`, which `ai` cannot read
 * (a test of the app keeps both the same).
 */
export const KYC_CATEGORY_LABELS: Readonly<Record<KycCategory, string>> = {
  IDENTITY: 'Danh tính / tuổi',
  FAMILY: 'Gia đình',
  OCCUPATION_INCOME: 'Nghề nghiệp / nguồn thu',
  ASSETS: 'Tài sản / AUM',
  GOALS: 'Mục tiêu & mốc thời gian',
  RISK_APPETITE: 'Khẩu vị rủi ro',
  EXISTING_PROTECTION: 'Bảo vệ hiện có',
  CONCERNS: 'Mối quan tâm',
};

/** The app's i18n `kycField.*`, as `KYC_CATEGORY_LABELS`. */
export const KYC_FIELD_LABELS: Readonly<Record<KycField, string>> = {
  birthYear: 'Năm sinh',
  gender: 'Giới tính',
  residence: 'Nơi sinh sống',
  maritalStatus: 'Tình trạng hôn nhân',
  childrenCount: 'Số con',
  dependents: 'Người phụ thuộc',
  occupation: 'Nghề nghiệp',
  annualIncome: 'Thu nhập năm',
  incomeSources: 'Nguồn thu',
  totalAssets: 'Tổng tài sản',
  assetAllocation: 'Phân bổ tài sản',
  liabilities: 'Nợ phải trả',
  primaryGoal: 'Mục tiêu chính',
  goalHorizon: 'Mốc thời gian mục tiêu',
  otherGoals: 'Mục tiêu khác',
  riskProfile: 'Khẩu vị rủi ro',
  investmentExperience: 'Kinh nghiệm đầu tư',
  hasProtection: 'Đã có bảo vệ',
  protectionDetails: 'Chi tiết bảo vệ',
  mainConcern: 'Mối quan tâm chính',
  otherConcerns: 'Mối quan tâm khác',
};

/** A confirmed fact with its `seq` in `kyc_facts` (by KH), which gives its code. */
export interface AnalysisFact extends KycFact {
  readonly seq: number;
}

export interface AnalysisProfile {
  readonly facts: readonly AnalysisFact[];
}

const FIELD_ORDER = Object.keys(KYC_FIELDS) as KycField[];

/** The birth year goes as an age (G5 §1.1). */
const sentLabel = (field: KycField) => (field === 'birthYear' ? 'Tuổi' : KYC_FIELD_LABELS[field]);

function sentValue(fact: KycFact, today: CalendarDate): string {
  if (fact.field === 'birthYear') return String(today.year - Number(fact.value));
  if (typeof fact.value === 'boolean') return fact.value ? 'Có' : 'Không';
  return String(fact.value);
}

/**
 * The input of an analysis, taken when the RE clicks (spec §6.1): only the facts in effect (`active`,
 * `conflict`) with their code `F{seq}`, in catalog order then by seq, the birth year as an age, and
 * the gate; never the name, codes, RE, notes, appointments or contracts of the KH. `null` when the
 * gate lets no AI through (`CONFLICT_RESOLUTION`, `KYC_INSUFFICIENT` — P2, the panel offers no
 * analysis then).
 */
export function buildAnalysisInput(
  profile: AnalysisProfile,
  gate: KycGateResult,
  today: CalendarDate,
): AnalysisInput | null {
  if (gate.state !== 'PAIN_POINT_ANALYSIS' && gate.state !== 'PROFILE_DISCOVERY') return null;
  const facts = profile.facts
    .filter((fact) => fact.status !== 'superseded')
    .sort((a, b) => FIELD_ORDER.indexOf(a.field) - FIELD_ORDER.indexOf(b.field) || a.seq - b.seq);
  return {
    analysisDate: formatIsoDate(today),
    mode: gate.state === 'PAIN_POINT_ANALYSIS' ? 'analysis' : 'discovery',
    facts: facts.map((fact) => ({
      code: factCode(fact.seq),
      category: KYC_CATEGORY_LABELS[fact.category],
      field: sentLabel(fact.field),
      value: sentValue(fact, today),
      confirmedAt: formatIsoDate(fact.confirmedDate),
      conflict: fact.status === 'conflict',
    })),
    missingCategories: gate.missingCategories.map((code) => ({
      code,
      label: KYC_CATEGORY_LABELS[code],
    })),
    conflictWarnings: gate.warningFields.map(sentLabel),
  };
}

// ---- the Mock's answers (spec §10) -------------------------------------------

/**
 * The version of each prompt (`prompts/<mode>.ts`), here too for the seed of `db`, which may import
 * only this module: its Mock analyses carry the version the app writes (DR6-18). A test keeps both
 * the same.
 */
export const PROMPT_VERSIONS = {
  analysis: 'analysis@4',
  discovery: 'discovery@4',
  extraction: 'extraction@1',
} as const satisfies Record<AiMode, string>;

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

/**
 * The Mock's analysis of the facts `codes` with the `missing` hạng mục: fixed sentences citing only
 * those, so the same input always gives the same answer.
 */
export function mockAnalysisOutput(
  codes: readonly string[],
  missing: readonly KycCategory[],
): AnalysisOutput {
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

/** The Mock's discovery, as `mockAnalysisOutput`; with nothing to cite, no action at all (MS-A7). */
export function mockDiscoveryOutput(
  codes: readonly string[],
  missing: readonly KycCategory[],
): DiscoveryOutput {
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
    nextBestActions: known
      ? [{ text: 'Hẹn buổi gặp tiếp để tìm hiểu thêm', evidence: cite(codes, 0, 1) }]
      : askAbout(missing.slice(0, 1)),
    personalityNotes: [],
  };
}
