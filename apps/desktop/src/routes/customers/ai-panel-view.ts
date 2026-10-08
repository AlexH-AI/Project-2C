/**
 * The KYC Intelligence panel of the customer profile (spec Phase 5 §9.1, mockups ai.html §2 and
 * customer.html). Pure, so the panel only lays it out.
 */
import {
  AI_MODELS,
  analysisOutputSchema,
  discoveryOutputSchema,
  type AiErrorCode,
  type AnalysisInput,
  type DiscoveryOutput,
  type PERSONALITY_SYSTEMS,
} from '@p2c/ai';
import type { AiAnalysisReminder, AiAnalysisView } from '@p2c/db';
import {
  evidenceLevel,
  formatDayMonth,
  formatLocalDateTime,
  fromIsoDate,
  fromLocalDate,
  KYC_GATE_THRESHOLDS,
  type Evidence,
  type KycCategory,
  type KycField,
  type KycGateResult,
  type KycGateState,
} from '@p2c/domain';
import type { AnalysisOutcome } from '../../data/ai-analysis';

export type AiPanelBlocked =
  /** Mockup 2b: "Giải quyết mâu thuẫn ở <trường> trước khi phân tích". */
  | { readonly state: 'CONFLICT_RESOLUTION'; readonly fields: readonly KycField[] }
  /** Mockup 2c: "Cần chăm sóc, KYC thêm thông tin khách hàng. Còn thiếu: <hạng mục tối thiểu>". */
  | { readonly state: 'KYC_INSUFFICIENT'; readonly categories: readonly KycCategory[] };

export interface AiPanelView {
  /** Set when the gate lets no AI through: the button is off and nothing is called (P2). */
  readonly blocked: AiPanelBlocked | null;
  /** The head badge: the shown analysis's state, else the gate. */
  readonly badge: 'CURRENT' | 'STALE' | KycGateState;
  /** The latest ACCEPTED analysis, CURRENT or STALE; a REJECTED row is never shown as a result. */
  readonly shown: AiAnalysisView | null;
  /** Mockup 2h: why the shown analysis is STALE, while the gate allows analysing again. */
  readonly reminder: AiAnalysisReminder | null;
  /** `again`: "Phân tích lại" once there is an analysis to replace. */
  readonly button: {
    readonly again: boolean;
    readonly primary: boolean;
    readonly enabled: boolean;
  };
}

export function aiPanelView(input: {
  readonly gate: KycGateResult;
  /** `listAiAnalyses`: latest first. */
  readonly analyses: readonly AiAnalysisView[];
  /** The app's one AI runner is busy (P5): every AI button is off. */
  readonly busy: boolean;
}): AiPanelView {
  const { gate, analyses, busy } = input;
  const blocked = blockedBy(gate);
  const shown = analyses.find((analysis) => analysis.status === 'ACCEPTED') ?? null;
  return {
    blocked,
    badge: shown && !blocked ? (shown.state === 'CURRENT' ? 'CURRENT' : 'STALE') : gate.state,
    shown,
    reminder: blocked ? null : (shown?.reminder ?? null),
    button: {
      again: shown !== null && !blocked,
      primary: !blocked && shown?.state !== 'CURRENT',
      enabled: !blocked && !busy,
    },
  };
}

function blockedBy(gate: KycGateResult): AiPanelBlocked | null {
  if (gate.state === 'CONFLICT_RESOLUTION') {
    return { state: gate.state, fields: gate.coreConflictFields };
  }
  if (gate.state === 'KYC_INSUFFICIENT') {
    // What blocks the gate: the minimum hạng mục still missing, not every one (mockup 2c).
    const needed: readonly KycCategory[] = KYC_GATE_THRESHOLDS.minimumCategories;
    const categories = gate.missingCategories.filter((category) => needed.includes(category));
    return { state: gate.state, categories };
  }
  return null;
}

/** The §5.3 message shown: an AI error code, or the general one for a bug or a bad request. */
export type AiPanelError = Exclude<AiErrorCode, 'AI_BAD_REQUEST'> | 'GENERAL';

/** The panel's own click on Phân tích, until it ends. */
export type AiPanelRun =
  | { readonly phase: 'idle' }
  | { readonly phase: 'running' }
  /** Hủy given while the request still runs in Rust (§5.2). */
  | { readonly phase: 'cancelling' }
  /** Mockup 2f: the message and Thử lại; nothing was saved. */
  | { readonly phase: 'error'; readonly error: AiPanelError };

const IDLE: AiPanelRun = { phase: 'idle' };

/**
 * Where the panel goes once `analyseCustomer` ends. A save goes back to idle: the panel shows what
 * `listAiAnalyses` reads again, never what the outcome says was saved, as the data may have been
 * replaced meanwhile (review of PR 437). A blocked gate is read again too, so its sentence shows.
 */
export function runAfter(outcome: AnalysisOutcome): AiPanelRun {
  switch (outcome.kind) {
    case 'cancelled':
      return { phase: 'cancelling' };
    case 'error':
      return {
        phase: 'error',
        error: outcome.code === 'AI_BAD_REQUEST' ? 'GENERAL' : outcome.code,
      };
    case 'failed':
      return { phase: 'error', error: 'GENERAL' };
    default:
      return IDLE;
  }
}

/** "Đang hủy…" holds only while the request runs on; once the runner is free, the panel is back. */
export function shownRun(run: AiPanelRun, busy: boolean): AiPanelRun {
  return run.phase === 'cancelling' && !busy ? IDLE : run;
}

// ---- one analysis -------------------------------------------------------------

type PersonalitySystem = (typeof PERSONALITY_SYSTEMS)[number];

/** One element of the output: its text, the facts it cites with their level, or a missing hạng mục. */
export interface AiPanelItem {
  readonly text: string;
  /** Only in "Thông tin tham khảo" (P6). */
  readonly system: PersonalitySystem | null;
  /** `F{seq}` codes cited. */
  readonly codes: readonly string[];
  readonly missing: KycCategory | null;
  /** Null when no fact is cited: "Hạng mục còn thiếu" alone, no level (§6.3 item 4). */
  readonly evidence: Evidence | null;
}

export type AiPanelGroupKey =
  'hypotheses' | 'needs' | 'painPoints' | 'themes' | 'discoveryStrategy' | 'nextBestActions';

/** The sub-labelled groups of Needs · Pain points · Opportunity Themes. */
export type AiPanelSubgroup = 'needs' | 'painPoints' | 'themes';

/** A heading of the panel; Needs · Pain points · Opportunity Themes has three sub-labelled groups. */
export interface AiPanelSection {
  readonly key: 'hypotheses' | 'needsThemes' | 'discoveryStrategy' | 'nextBestActions';
  readonly groups: readonly { readonly key: AiPanelGroupKey; readonly items: AiPanelItem[] }[];
}

export interface AiPanelContent {
  /** "kyc v<n> · <prompt> · <model or Mock> · dd/mm hh:mm"; `model` null for Mock. */
  readonly chip: {
    readonly version: number;
    readonly prompt: string;
    readonly model: string | null;
    readonly at: string;
  };
  /** Minor conflicts sent with the input (§6.2): the trường as sent, and its facts' codes. */
  readonly conflicts: readonly { readonly field: string; readonly codes: readonly string[] }[];
  readonly sections: readonly AiPanelSection[];
  /** "Thông tin tham khảo — không phải kết luận": none, no block. */
  readonly reference: readonly AiPanelItem[];
}

type OutputItem = {
  readonly text: string;
  readonly evidence: readonly string[];
  readonly missingCategory?: KycCategory | undefined;
  readonly system?: PersonalitySystem;
};

/**
 * What an ACCEPTED analysis shows. Its output passed the schema of its mode when saved (and when a
 * backup was loaded), so it is read with that schema; its input gives each cited fact's day.
 */
export function analysisContent(
  analysis: AiAnalysisView,
  versions: readonly { readonly id: string }[],
): AiPanelContent {
  const input = analysis.input as AnalysisInput;
  const analysisDate = fromIsoDate(input.analysisDate);
  const confirmed = new Map(input.facts.map((f) => [f.code, fromIsoDate(f.confirmedAt)]));
  const toItem = (item: OutputItem): AiPanelItem => {
    const facts = item.evidence.flatMap((code) => {
      const confirmedDate = confirmed.get(code);
      return confirmedDate ? [{ code, confirmedDate }] : [];
    });
    return {
      text: item.text,
      system: item.system ?? null,
      codes: item.evidence,
      missing: item.missingCategory ?? null,
      evidence: isNonEmpty(facts) ? evidenceLevel({ analysisDate, facts }) : null,
    };
  };
  const group = (key: AiPanelGroupKey, items: readonly OutputItem[]) => ({
    key,
    items: items.map(toItem),
  });
  const single = (key: AiPanelSection['key'] & AiPanelGroupKey, items: readonly OutputItem[]) =>
    items.length > 0 ? [{ key, groups: [group(key, items)] }] : [];

  let output: DiscoveryOutput;
  let middle: AiPanelSection[] = [];
  if (analysis.mode === 'analysis') {
    const full = analysisOutputSchema.parse(analysis.output);
    output = full;
    middle = [
      {
        key: 'needsThemes',
        groups: [
          group('needs', full.needs),
          group('painPoints', full.painPoints),
          group('themes', full.themes),
        ],
      },
    ];
  } else {
    output = discoveryOutputSchema.parse(analysis.output);
  }
  return {
    chip: {
      version: versions.findIndex((version) => version.id === analysis.kycVersionId) + 1,
      prompt: analysis.promptVersion,
      model: analysis.model === null ? null : modelLabel(analysis.model),
      at: dayAndTime(analysis.createdAt),
    },
    conflicts: input.conflictWarnings.map((field) => ({
      field,
      codes: input.facts.filter((f) => f.field === field && f.conflict).map((f) => f.code),
    })),
    sections: [
      ...single('hypotheses', output.hypotheses),
      ...middle,
      ...single('discoveryStrategy', output.discoveryStrategy),
      ...single('nextBestActions', output.nextBestActions),
    ],
    reference: output.personalityNotes.map(toItem),
  };
}

/** The name Settings → AI shows for a model; an id no longer listed shows as stored. */
export function modelLabel(id: string): string {
  return AI_MODELS.find((model) => model.id === id)?.label ?? id;
}

const isNonEmpty = <T>(list: readonly T[]): list is readonly [T, ...T[]] => list.length > 0;

/** `dd/mm HH:MM` of a moment in the local time zone. */
function dayAndTime(at: Date): string {
  const [, time] = formatLocalDateTime(at).split(' ');
  return `${formatDayMonth(fromLocalDate(at))} ${time}`;
}
