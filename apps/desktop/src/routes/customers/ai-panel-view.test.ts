import type { AiAnalysisView } from '@p2c/db';
import { calendarDate as day, type KycGateResult, type KycGateState } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { aiPanelView, analysisContent, analysisSource, runAfter, shownRun } from './ai-panel-view';

const gateOf = (state: KycGateState, extra: Partial<KycGateResult> = {}): KycGateResult => ({
  state,
  presentCategories: [],
  missingCategories: [],
  coreConflictFields: [],
  warningFields: [],
  suggestedQuestions: [],
  aiAllowed: state === 'PROFILE_DISCOVERY' || state === 'PAIN_POINT_ANALYSIS',
  message: null,
  ...extra,
});

/** A stored analysis as `listAiAnalyses` gives it; Mock, analysis mode, accepted by default. */
function analysis(fields: Partial<AiAnalysisView> & Pick<AiAnalysisView, 'seq' | 'state'>) {
  const row: AiAnalysisView = {
    id: `a${fields.seq}`,
    customerId: 'c1',
    kycVersionId: 'v1',
    mode: 'analysis',
    gateState: 'PAIN_POINT_ANALYSIS',
    status: 'ACCEPTED',
    provider: 'MOCK',
    model: null,
    reasoning: null,
    promptVersion: 'analysis@1',
    attempts: 1,
    input: {},
    output: {},
    rawOutput: null,
    validator: [],
    promptTokens: null,
    completionTokens: null,
    date: { year: 2026, month: 9, day: 14 },
    createdAt: new Date(2026, 8, 14, 11, 2),
    reminder: null,
    ...fields,
  };
  return row;
}

const OPEN = gateOf('PAIN_POINT_ANALYSIS');
const NONE: readonly AiAnalysisView[] = [];

describe('aiPanelView (spec Phase 5 §9.1)', () => {
  it('blocks the analysis on a cốt lõi conflict, naming the trường (P2)', () => {
    const view = aiPanelView({
      gate: gateOf('CONFLICT_RESOLUTION', { coreConflictFields: ['childrenCount', 'occupation'] }),
      analyses: NONE,
      busy: false,
    });

    expect(view.blocked).toEqual({
      state: 'CONFLICT_RESOLUTION',
      fields: ['childrenCount', 'occupation'],
    });
    expect(view.badge).toBe('CONFLICT_RESOLUTION');
    expect(view.button).toEqual({ again: false, primary: false, enabled: false });
  });

  it('blocks the analysis while KYC is short, naming the missing hạng mục the gate needs', () => {
    const view = aiPanelView({
      gate: gateOf('KYC_INSUFFICIENT', {
        missingCategories: ['FAMILY', 'OCCUPATION_INCOME', 'ASSETS', 'GOALS'],
      }),
      analyses: NONE,
      busy: false,
    });

    expect(view.blocked).toEqual({
      state: 'KYC_INSUFFICIENT',
      categories: ['FAMILY', 'OCCUPATION_INCOME'],
    });
    expect(view.button.enabled).toBe(false);
  });

  it('offers Phân tích in the mode of the gate when there is no analysis yet', () => {
    const view = aiPanelView({ gate: OPEN, analyses: NONE, busy: false });

    expect(view.blocked).toBeNull();
    expect(view.badge).toBe('PAIN_POINT_ANALYSIS');
    expect(view.shown).toBeNull();
    expect(view.button).toEqual({ again: false, primary: true, enabled: true });
  });

  it('turns Phân tích off while any AI request runs (P5)', () => {
    expect(aiPanelView({ gate: OPEN, analyses: NONE, busy: true }).button.enabled).toBe(false);
  });

  it('shows the CURRENT analysis with Phân tích lại', () => {
    const current = analysis({ seq: 1, state: 'CURRENT' });
    const view = aiPanelView({ gate: OPEN, analyses: [current], busy: false });

    expect(view.shown).toBe(current);
    expect(view.badge).toBe('CURRENT');
    expect(view.reminder).toBeNull();
    expect(view.button).toEqual({ again: true, primary: false, enabled: true });
  });

  it('shows a STALE analysis with its reminder, and Phân tích lại as the main button', () => {
    const reminder = { material: true, since: { year: 2026, month: 9, day: 20 } };
    const stale = analysis({ seq: 1, state: 'STALE', reminder });
    const view = aiPanelView({ gate: OPEN, analyses: [stale], busy: false });

    expect(view.badge).toBe('STALE');
    expect(view.reminder).toBe(reminder);
    expect(view.button).toEqual({ again: true, primary: true, enabled: true });
  });

  it('shows the latest ACCEPTED analysis under a newer REJECTED one', () => {
    const accepted = analysis({ seq: 1, state: 'CURRENT' });
    const view = aiPanelView({
      gate: OPEN,
      analyses: [analysis({ seq: 2, state: 'REJECTED', status: 'REJECTED' }), accepted],
      busy: false,
    });

    expect(view.shown).toBe(accepted);
  });

  it('shows no analysis when every row was REJECTED', () => {
    const rejected = analysis({ seq: 1, state: 'REJECTED', status: 'REJECTED' });
    expect(aiPanelView({ gate: OPEN, analyses: [rejected], busy: false }).shown).toBeNull();
  });

  it('keeps an older analysis under a blocked gate, without reminder or Phân tích lại (mockup 2b)', () => {
    const reminder = { material: true, since: { year: 2026, month: 9, day: 20 } };
    const stale = analysis({ seq: 1, state: 'STALE', reminder });
    const view = aiPanelView({
      gate: gateOf('CONFLICT_RESOLUTION', { coreConflictFields: ['childrenCount'] }),
      analyses: [stale],
      busy: false,
    });

    expect(view.shown).toBe(stale);
    expect(view.badge).toBe('CONFLICT_RESOLUTION');
    expect(view.reminder).toBeNull();
    expect(view.button).toEqual({ again: false, primary: false, enabled: false });
  });
});

describe('the run of the panel (spec Phase 5 §5.2, §5.3)', () => {
  it('goes back to how it was once saved, blocked or discarded: the panel reads the rows again', () => {
    for (const outcome of [
      { kind: 'saved', status: 'ACCEPTED' },
      { kind: 'saved', status: 'REJECTED' },
      { kind: 'blocked', state: 'CONFLICT_RESOLUTION' },
      { kind: 'discarded' },
    ] as const) {
      expect(runAfter(outcome)).toEqual({ phase: 'idle' });
    }
  });

  it('shows the §5.3 message of an AI error, AI_BUSY too', () => {
    expect(runAfter({ kind: 'error', code: 'AI_RATE_LIMITED' })).toEqual({
      phase: 'error',
      error: 'AI_RATE_LIMITED',
    });
    expect(runAfter({ kind: 'error', code: 'AI_BUSY' })).toEqual({
      phase: 'error',
      error: 'AI_BUSY',
    });
  });

  it('shows the general message for a bug or a bad request (G3 ai.html#ask 10)', () => {
    expect(runAfter({ kind: 'failed' })).toEqual({ phase: 'error', error: 'GENERAL' });
    expect(runAfter({ kind: 'error', code: 'AI_BAD_REQUEST' })).toEqual({
      phase: 'error',
      error: 'GENERAL',
    });
  });

  it('shows "Đang hủy…" after Hủy only while the request still runs', () => {
    const cancelling = runAfter({ kind: 'cancelled' });

    expect(cancelling).toEqual({ phase: 'cancelling' });
    expect(shownRun(cancelling, true)).toEqual({ phase: 'cancelling' });
    expect(shownRun(cancelling, false)).toEqual({ phase: 'idle' });
    expect(shownRun({ phase: 'running' }, true)).toEqual({ phase: 'running' });
  });
});

describe('analysisContent (spec Phase 5 §6.3, §9.1)', () => {
  const input = {
    analysisDate: '2026-10-07',
    mode: 'analysis',
    facts: [
      { code: 'F1', field: 'Tuổi', value: '42', confirmedAt: '2026-06-01', conflict: false },
      { code: 'F5', field: 'Số con', value: '2', confirmedAt: '2025-06-01', conflict: false },
      {
        code: 'F9',
        field: 'Mối quan tâm chính',
        value: 'A',
        confirmedAt: '2026-09-01',
        conflict: true,
      },
      {
        code: 'F12',
        field: 'Mục tiêu chính',
        value: 'B',
        confirmedAt: '2026-09-14',
        conflict: false,
      },
      {
        code: 'F13',
        field: 'Mối quan tâm chính',
        value: 'C',
        confirmedAt: '2026-09-14',
        conflict: true,
      },
    ],
    missingCategories: [{ code: 'EXISTING_PROTECTION', label: 'Bảo vệ hiện có' }],
    conflictWarnings: ['Mối quan tâm chính'],
  };
  const item = (text: string, evidence: string[]) => ({ text, evidence });
  const output = {
    hypotheses: [item('H1', ['F12', 'F13'])],
    needs: [item('N1', ['F5', 'F12'])],
    painPoints: [item('P1', ['F5'])],
    themes: [item('T1', ['F5', 'F9', 'F12'])],
    discoveryStrategy: [
      item('D1', ['F9']),
      { text: 'D2', evidence: [], missingCategory: 'EXISTING_PROTECTION' },
    ],
    nextBestActions: [{ text: 'A1', evidence: ['F12'], missingCategory: 'EXISTING_PROTECTION' }],
    personalityNotes: [
      { system: 'PSYCHOLOGY', text: 'R1', evidence: ['F9', 'F13'] },
      { system: 'ESOTERIC', text: 'R2', evidence: ['F1'] },
    ],
  };
  const versions = [{ id: 'v1' }, { id: 'v2' }, { id: 'v3' }];
  const row = analysis({ seq: 1, state: 'CURRENT', kycVersionId: 'v3', input, output });

  it('names the version, prompt, provider and time of the analysis in its chip', () => {
    expect(analysisContent(row, versions).chip).toEqual({
      version: 3,
      prompt: 'analysis@1',
      source: { badge: 'MOCK' },
      at: '14/09 11:02',
    });
    const real = analysis({
      seq: 2,
      state: 'CURRENT',
      kycVersionId: 'v1',
      input,
      output,
      provider: 'OPENCODE_GO',
      model: 'deepseek-v4.1-flash',
      reasoning: 'DEFAULT',
    });
    expect(analysisContent(real, versions).chip).toMatchObject({
      version: 1,
      source: { model: 'DeepSeek V4.1 Flash' },
    });
  });

  it('names a ChatGPT web analysis by its provider, as it keeps no model (P7, mockup 4i)', () => {
    const web = analysis({
      seq: 2,
      state: 'CURRENT',
      kycVersionId: 'v3',
      input,
      output,
      provider: 'CHATGPT_WEB',
      promptVersion: 'analysis@1+web@1',
    });
    expect(analysisContent(web, versions).chip).toMatchObject({
      prompt: 'analysis@1+web@1',
      source: { badge: 'CHATGPT_WEB' },
    });
    expect(analysisSource(web)).toEqual({ badge: 'CHATGPT_WEB' });
    expect(analysisSource(row)).toEqual({ badge: 'MOCK' });
    expect(analysisSource({ provider: 'OPENCODE_GO', model: 'kimi-k3' })).toEqual({
      model: 'Kimi K3',
    });
  });

  it('gives the four blocks of the analysis mode, each item with its evidence level', () => {
    const { sections } = analysisContent(row, versions);

    expect(sections.map((s) => [s.key, s.groups.map((g) => g.key)])).toEqual([
      ['hypotheses', ['hypotheses']],
      ['needsThemes', ['needs', 'painPoints', 'themes']],
      ['discoveryStrategy', ['discoveryStrategy']],
      ['nextBestActions', ['nextBestActions']],
    ]);
    const [hypothesis] = sections[0]!.groups[0]!.items;
    expect(hypothesis).toEqual({
      text: 'H1',
      system: null,
      codes: ['F12', 'F13'],
      missing: null,
      evidence: { level: 'MEDIUM', factCount: 2, latestConfirmedDate: day(2026, 9, 14) },
    });
    // F5 alone, confirmed over a year before the analysis: low stays low.
    expect(sections[1]!.groups[1]!.items[0]!.evidence).toMatchObject({ level: 'LOW' });
    expect(sections[1]!.groups[2]!.items[0]!.evidence).toMatchObject({
      level: 'HIGH',
      factCount: 3,
    });
  });

  it('gives a missing hạng mục with no level when nothing is cited', () => {
    const { sections } = analysisContent(row, versions);

    expect(sections[2]!.groups[0]!.items[1]).toEqual({
      text: 'D2',
      system: null,
      codes: [],
      missing: 'EXISTING_PROTECTION',
      evidence: null,
    });
    expect(sections[3]!.groups[0]!.items[0]).toMatchObject({
      codes: ['F12'],
      missing: 'EXISTING_PROTECTION',
      evidence: { level: 'LOW' },
    });
  });

  it('gives the personality notes apart, with their system (P6)', () => {
    expect(analysisContent(row, versions).reference).toEqual([
      {
        text: 'R1',
        system: 'PSYCHOLOGY',
        codes: ['F9', 'F13'],
        missing: null,
        evidence: { level: 'MEDIUM', factCount: 2, latestConfirmedDate: day(2026, 9, 14) },
      },
      {
        text: 'R2',
        system: 'ESOTERIC',
        codes: ['F1'],
        missing: null,
        evidence: { level: 'LOW', factCount: 1, latestConfirmedDate: day(2026, 6, 1) },
      },
    ]);
  });

  it('gives the minor conflicts of the input with the codes of their facts', () => {
    expect(analysisContent(row, versions).conflicts).toEqual([
      { field: 'Mối quan tâm chính', codes: ['F9', 'F13'] },
    ]);
  });

  it('gives the three blocks of the discovery mode, leaving out empty hypotheses', () => {
    const discovery = {
      hypotheses: [item('H1', ['F1'])],
      discoveryStrategy: output.discoveryStrategy,
      nextBestActions: output.nextBestActions,
      personalityNotes: [],
    };
    const content = (out: unknown) =>
      analysisContent(
        analysis({
          seq: 1,
          state: 'CURRENT',
          mode: 'discovery',
          gateState: 'PROFILE_DISCOVERY',
          promptVersion: 'discovery@1',
          input: { ...input, mode: 'discovery' },
          output: out,
        }),
        versions,
      );

    expect(content(discovery).sections.map((s) => s.key)).toEqual([
      'hypotheses',
      'discoveryStrategy',
      'nextBestActions',
    ]);
    expect(content(discovery).reference).toEqual([]);
    expect(content({ ...discovery, hypotheses: [] }).sections.map((s) => s.key)).toEqual([
      'discoveryStrategy',
      'nextBestActions',
    ]);
  });
});
