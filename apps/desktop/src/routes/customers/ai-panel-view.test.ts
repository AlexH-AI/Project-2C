import type { WebSession } from '@p2c/ai';
import type { AiAnalysisView } from '@p2c/db';
import { calendarDate as day, type KycGateResult, type KycGateState } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  aiPanelView,
  analysisContent,
  analysisSource,
  historyRows,
  issueLine,
  rejectedReport,
  runAfter,
  shownRun,
  webAfter,
  webChip,
  webOpened,
} from './ai-panel-view';

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

  it('turns both buttons off, none the main one, while this customer has a web session (4e)', () => {
    const view = aiPanelView({ gate: OPEN, analyses: NONE, busy: false, webOpen: true });
    expect(view.button).toEqual({ again: false, primary: false, enabled: false });
  });

  it('says the latest analysis was REJECTED, with the first issue of its last attempt (2i)', () => {
    const issue = { code: 'V3', path: 'hypotheses[0].text', detail: 'có "xác suất"' };
    const rejected = analysis({
      seq: 2,
      state: 'REJECTED',
      status: 'REJECTED',
      date: day(2026, 9, 26),
      validator: [
        { attempt: 1, errors: [{ code: 'V4', path: 'needs[1].text', detail: 'x' }] },
        { attempt: 2, errors: [issue, { code: 'V1', path: '$', detail: 'y' }] },
      ],
    });
    const accepted = analysis({ seq: 1, state: 'CURRENT' });

    expect(
      aiPanelView({ gate: OPEN, analyses: [rejected, accepted], busy: false }).rejected,
    ).toEqual({
      date: day(2026, 9, 26),
      issue: { code: 'V3', place: { key: 'hypotheses', number: 1 }, detail: 'có "xác suất"' },
    });
    // Only while it is newer than the latest ACCEPTED one.
    const older = { ...rejected, seq: 0 };
    expect(aiPanelView({ gate: OPEN, analyses: [accepted, older], busy: false }).rejected).toBe(
      null,
    );
  });

  it('says a REJECTED analysis with no readable JSON had none (4g)', () => {
    const rejected = analysis({
      seq: 1,
      state: 'REJECTED',
      status: 'REJECTED',
      output: null,
      validator: [
        { attempt: 1, errors: [{ code: 'V1', path: '$', detail: 'không có khối JSON' }] },
      ],
    });
    expect(aiPanelView({ gate: OPEN, analyses: [rejected], busy: false }).rejected?.issue).toEqual({
      code: 'V1',
      place: null,
      detail: null,
    });
  });

  it('reads a validator report it does not know as no reason', () => {
    const rejected = analysis({
      seq: 1,
      state: 'REJECTED',
      status: 'REJECTED',
      validator: [{ attempt: 1, errors: ['V1'] }],
    });
    expect(aiPanelView({ gate: OPEN, analyses: [rejected], busy: false }).rejected).toEqual({
      date: rejected.date,
      issue: null,
    });
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

  it('shows an older ACCEPTED analysis picked in the history in place of the latest (2j)', () => {
    const current = analysis({ seq: 3, state: 'CURRENT' });
    const rejected = analysis({ seq: 2, state: 'REJECTED', status: 'REJECTED' });
    const stale = analysis({ seq: 1, state: 'STALE' });
    const analyses = [current, rejected, stale];
    const view = (viewing: string | null) =>
      aiPanelView({ gate: OPEN, analyses, busy: false, viewing });

    expect(view(stale.id)).toMatchObject({ shown: current, viewing: stale, badge: 'CURRENT' });
    // The latest itself, a REJECTED row (its report opens instead) or a row gone: nothing apart.
    expect(view(current.id).viewing).toBeNull();
    expect(view(rejected.id).viewing).toBeNull();
    expect(view('gone').viewing).toBeNull();
    expect(view(null).viewing).toBeNull();
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

describe('issueLine (mockups 2k, 4g)', () => {
  it('names the block and the number of the element an issue is about', () => {
    expect(issueLine({ code: 'V2', path: 'needs[1].evidence[0]', detail: 'F21 …' }, false)).toEqual(
      { code: 'V2', place: { key: 'needs', number: 2 }, detail: 'F21 …' },
    );
    expect(issueLine({ code: 'V1', path: 'personalityNotes', detail: 'sai kiểu' }, false)).toEqual({
      code: 'V1',
      place: { key: 'personalityNotes', number: null },
      detail: 'sai kiểu',
    });
  });

  it('keeps an issue of the whole output, or of a key no block has, without a place', () => {
    expect(issueLine({ code: 'V1', path: '$', detail: 'sai kiểu' }, false)).toEqual({
      code: 'V1',
      place: null,
      detail: 'sai kiểu',
    });
    expect(issueLine({ code: 'V1', path: 'extra', detail: 'thừa' }, false)).toEqual({
      code: 'V1',
      place: null,
      detail: 'extra: thừa',
    });
  });

  it('gives no detail for an answer with no JSON: the panel has its own sentence', () => {
    expect(issueLine({ code: 'V1', path: '$', detail: 'không có khối JSON' }, true)).toEqual({
      code: 'V1',
      place: null,
      detail: null,
    });
  });
});

describe('the ChatGPT web session of the panel (spec Phase 5 §3.1, mockups 4e–4h)', () => {
  const session = {
    customerId: 'c1',
    kycVersionId: 'v2',
    input: { mode: 'discovery' },
    attempts: [],
  } as unknown as WebSession;
  const opened = webOpened({
    session,
    message: 'Tin nhắn',
    takenAt: new Date(2026, 8, 26, 10, 40),
    copied: true,
    opened: true,
  });

  it('opens with the input taken, its chip and nothing to copy by hand', () => {
    expect(opened).toMatchObject({ manual: null, openFailed: false, retry: null, tooLong: false });
    expect(webChip(opened, [{ id: 'v1' }, { id: 'v2' }])).toEqual({
      version: 2,
      prompt: 'discovery@1+web@1',
      at: '26/09 10:40',
    });
  });

  it('shows the message to copy by hand when the copy failed, and the browser that did not open', () => {
    const failed = webOpened({
      session,
      message: 'Tin nhắn',
      takenAt: new Date(),
      copied: false,
      opened: false,
    });
    expect(failed).toMatchObject({ manual: 'Tin nhắn', openFailed: true });
  });

  it('says a paste over 20 000 characters at the box, and keeps the attempt', () => {
    const after = webAfter(opened, { kind: 'unusable', reason: 'TOO_LONG' });
    expect(after).toMatchObject({ session, tooLong: true, retry: null });
  });

  it('lists the issues of a first wrong paste and keeps the session they come with', () => {
    const next = {
      ...session,
      attempts: [{ content: 'x', parsed: null, issues: [] }],
    } as unknown as WebSession;
    const after = webAfter(
      { ...opened, tooLong: true },
      {
        kind: 'retry',
        session: next,
        issues: [{ code: 'V1', path: '$', detail: 'không có khối JSON' }],
        retryMessage: 'Sửa',
      },
    );
    expect(after).toMatchObject({
      session: next,
      tooLong: false,
      retry: { issues: [{ code: 'V1', place: null, detail: null }], message: 'Sửa' },
    });
  });

  it('keeps the session on a bug, and ends it once saved or discarded', () => {
    expect(webAfter(opened, { kind: 'failed' })).toMatchObject({ failed: true });
    expect(webAfter(opened, { kind: 'saved', status: 'REJECTED' })).toBeNull();
    expect(webAfter(opened, { kind: 'discarded' })).toBeNull();
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
  const sent = (code: string, category: string, field: string, value: string) => ({
    code,
    category,
    field,
    value,
  });
  const input = {
    analysisDate: '2026-10-07',
    mode: 'analysis',
    facts: [
      {
        ...sent('F1', 'Danh tính / tuổi', 'Tuổi', '42'),
        confirmedAt: '2026-06-01',
        conflict: false,
      },
      { ...sent('F5', 'Gia đình', 'Số con', '2'), confirmedAt: '2025-06-01', conflict: false },
      {
        ...sent('F9', 'Mối quan tâm', 'Mối quan tâm chính', 'A'),
        confirmedAt: '2026-09-01',
        conflict: true,
      },
      {
        ...sent('F12', 'Mục tiêu & mốc thời gian', 'Mục tiêu chính', 'B'),
        confirmedAt: '2026-09-14',
        conflict: false,
      },
      {
        ...sent('F13', 'Mối quan tâm', 'Mối quan tâm chính', 'C'),
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

  it('refuses a KYC version the customer does not have rather than show "kyc v0"', () => {
    expect(() => analysisContent(row, [{ id: 'v1' }])).toThrow(RangeError);
  });

  it('refuses an input that is not as the app sends it rather than trust a cast', () => {
    const { conflictWarnings, ...noWarnings } = input;
    expect(conflictWarnings).toHaveLength(1);
    const broken = analysis({
      seq: 2,
      state: 'CURRENT',
      kycVersionId: 'v3',
      input: noWarnings,
      output,
    });
    expect(() => analysisContent(broken, versions)).toThrow(/conflictWarnings/);
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

describe('the analysis history (spec Phase 5 §7.2, §9.1, mockup ai.html 2j)', () => {
  const versions = [{ id: 'v1' }, { id: 'v2' }, { id: 'v3' }];

  it('lists every row latest first by seq, never by date, with the state worked out on reading', () => {
    // Recorded later, but on an earlier day: the order and the states follow seq.
    const latest = analysis({
      seq: 3,
      state: 'CURRENT',
      kycVersionId: 'v3',
      provider: 'OPENCODE_GO',
      model: 'deepseek-v4.1-flash',
      reasoning: 'DEFAULT',
      createdAt: new Date(2026, 6, 12, 16, 5),
    });
    const rejected = analysis({
      seq: 2,
      state: 'REJECTED',
      status: 'REJECTED',
      kycVersionId: 'v3',
      provider: 'CHATGPT_WEB',
      promptVersion: 'analysis@1+web@1',
      createdAt: new Date(2026, 8, 26, 10, 15),
    });
    const first = analysis({
      seq: 1,
      state: 'STALE',
      kycVersionId: 'v2',
      mode: 'discovery',
      gateState: 'PROFILE_DISCOVERY',
      promptVersion: 'discovery@1',
      createdAt: new Date(2026, 8, 14, 11, 2),
    });

    expect(historyRows([first, latest, rejected], versions)).toEqual([
      {
        id: latest.id,
        at: '12/07 16:05',
        version: 3,
        prompt: 'analysis@1',
        source: { model: 'DeepSeek V4.1 Flash' },
        state: 'CURRENT',
      },
      {
        id: rejected.id,
        at: '26/09 10:15',
        version: 3,
        prompt: 'analysis@1+web@1',
        source: { badge: 'CHATGPT_WEB' },
        state: 'REJECTED',
      },
      {
        id: first.id,
        at: '14/09 11:02',
        version: 2,
        prompt: 'discovery@1',
        source: { badge: 'MOCK' },
        state: 'STALE',
      },
    ]);
  });

  it('has no rows before the first analysis (P2: a blocked gate records none)', () => {
    expect(historyRows(NONE, versions)).toEqual([]);
  });
});

describe('rejectedReport (mockup ai.html 2k)', () => {
  const versions = [{ id: 'v1' }, { id: 'v2' }, { id: 'v3' }];
  const accepted = analysis({ seq: 1, state: 'CURRENT', date: day(2026, 9, 14) });
  const rejected = analysis({
    seq: 2,
    state: 'REJECTED',
    status: 'REJECTED',
    kycVersionId: 'v3',
    provider: 'OPENCODE_GO',
    model: 'deepseek-v4.1-flash',
    reasoning: 'DEFAULT',
    attempts: 2,
    promptTokens: 7000,
    completionTokens: 2840,
    output: { hypotheses: [] },
    rawOutput: '{"hypotheses": []}',
    createdAt: new Date(2026, 8, 26, 10, 15),
    validator: [
      {
        attempt: 1,
        errors: [
          { code: 'V3', path: 'hypotheses[0].text', detail: 'có "xác suất"' },
          { code: 'V4', path: 'nextBestActions[1].text', detail: 'có "gói bảo hiểm"' },
        ],
      },
      { attempt: 2, errors: [{ code: 'V3', path: 'hypotheses[0].text', detail: 'có "xác suất"' }] },
    ],
  });

  it('lists the issues of each attempt, never the raw output, with its chip and tokens', () => {
    const report = rejectedReport(rejected, [rejected, accepted], versions);

    expect(report).toEqual({
      at: '26/09 10:15',
      version: 3,
      prompt: 'analysis@1',
      source: { model: 'DeepSeek V4.1 Flash' },
      attempts: 2,
      tokens: 9840,
      reports: [
        {
          attempt: 1,
          issues: [
            { code: 'V3', place: { key: 'hypotheses', number: 1 }, detail: 'có "xác suất"' },
            {
              code: 'V4',
              place: { key: 'nextBestActions', number: 2 },
              detail: 'có "gói bảo hiểm"',
            },
          ],
        },
        {
          attempt: 2,
          issues: [
            { code: 'V3', place: { key: 'hypotheses', number: 1 }, detail: 'có "xác suất"' },
          ],
        },
      ],
      latest: day(2026, 9, 14),
    });
    expect(JSON.stringify(report)).not.toContain('{"hypotheses"');
  });

  it('keeps tokens for OpenCode only, and says when no analysis was ever accepted', () => {
    const web = { ...rejected, provider: 'CHATGPT_WEB' as const, model: null, reasoning: null };
    const report = rejectedReport(
      { ...web, promptTokens: null, completionTokens: null },
      [web],
      versions,
    );
    expect(report).toMatchObject({ source: { badge: 'CHATGPT_WEB' }, tokens: null, latest: null });
  });

  it('says an attempt with no JSON had none, the last one as the row stores it', () => {
    const noJson = { code: 'V1', path: '$', detail: 'không có khối JSON' };
    const row = {
      ...rejected,
      output: null,
      validator: [
        { attempt: 1, errors: [noJson] },
        { attempt: 2, errors: [noJson] },
      ],
    };
    expect(rejectedReport(row, [row], versions).reports.map((r) => r.issues)).toEqual([
      [{ code: 'V1', place: null, detail: null }],
      [{ code: 'V1', place: null, detail: null }],
    ]);
  });

  it('reads a validator report it does not know as no attempts listed', () => {
    const row = { ...rejected, validator: { odd: true } };
    expect(rejectedReport(row, [row], versions).reports).toEqual([]);
  });
});
