import { AI_MODELS, DEFAULT_AI_SETTINGS, type AiSettings, type WebSession } from '@p2c/ai';
import type { AiAnalysisView, KycFactRecord } from '@p2c/db';
import {
  calendarDate as day,
  type CalendarDate,
  type KycGateResult,
  type KycGateState,
} from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  aiPanelHelp,
  aiPanelView,
  panelDone,
  analysisContent,
  analysisSource,
  historyRows,
  issueLine,
  rejectedReport,
  panelRun,
  runAfter,
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

  it('says why the buttons are off while a request runs elsewhere, never for its own run (DR5-40)', () => {
    const view = (input: { running?: boolean; webOpen?: boolean; gate?: KycGateResult }) =>
      aiPanelView({ gate: OPEN, analyses: NONE, busy: true, ...input });

    // Another customer's run, AI trích xuất or Kiểm tra kết nối.
    expect(view({}).busyElsewhere).toBe(true);
    // Its own run says "Đang phân tích…" itself; a web session or a blocked gate has its own reason.
    expect(view({ running: true }).busyElsewhere).toBe(false);
    expect(view({ webOpen: true }).busyElsewhere).toBe(false);
    expect(view({ gate: gateOf('KYC_INSUFFICIENT') }).busyElsewhere).toBe(false);
    expect(aiPanelView({ gate: OPEN, analyses: NONE, busy: false }).busyElsewhere).toBe(false);
  });

  it('shows the mode of the input taken while a web session is open, not the saved one (§9.1, 4e)', () => {
    const current = analysis({ seq: 1, state: 'CURRENT', mode: 'discovery' });
    const view = (webMode: 'analysis' | 'discovery' | null) =>
      aiPanelView({ gate: OPEN, analyses: [current], busy: false, webOpen: true, webMode });

    expect(view('discovery').badge).toBe('PROFILE_DISCOVERY');
    expect(view('analysis').badge).toBe('PAIN_POINT_ANALYSIS');
    expect(view(null).badge).toBe('CURRENT');
  });
});

describe('aiPanelHelp (mockups 2a, 4d)', () => {
  const facts = [{ status: 'active' }, { status: 'superseded' }, { status: 'conflict' }] as const;

  it('counts the facts sent and names OpenCode with its plan and model', () => {
    const model = AI_MODELS[0]!;
    const settings = { ...DEFAULT_AI_SETTINGS, provider: 'OPENCODE_GO', opencodePlan: 'CREDIT' };
    expect(aiPanelHelp(facts, { ...settings, model: model.id } as AiSettings)).toEqual({
      count: 2,
      provider: 'OPENCODE_GO',
      plan: 'CREDIT',
      model: model.label,
    });
  });

  it('names the Mock alone, which has no plan or model to show', () => {
    expect(aiPanelHelp(facts, DEFAULT_AI_SETTINGS)).toEqual({ count: 2, provider: 'MOCK' });
  });
});

describe('panelDone (DR5-33)', () => {
  it('says a run or a web session saved its row, ACCEPTED or REJECTED', () => {
    expect(panelDone({ kind: 'saved', status: 'ACCEPTED' }, null)).toBe('ACCEPTED');
    expect(panelDone(null, { kind: 'saved', status: 'REJECTED' })).toBe('REJECTED');
    expect(
      panelDone({ kind: 'saved', status: 'ACCEPTED' }, { kind: 'saved', status: 'REJECTED' }),
    ).toBe('REJECTED');
  });

  it('says nothing for what saved no row', () => {
    expect(panelDone(null, null)).toBeNull();
    expect(panelDone({ kind: 'error', code: 'AI_NETWORK' }, null)).toBeNull();
    expect(panelDone({ kind: 'discarded' }, { kind: 'failed' })).toBeNull();
    expect(panelDone(null, { kind: 'unusable', reason: 'EMPTY' })).toBeNull();
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

  it('says no REJECTED line under a blocked gate, as no reminder (review of PR 459)', () => {
    const rejected = analysis({ seq: 2, state: 'REJECTED', status: 'REJECTED' });
    const view = aiPanelView({
      gate: gateOf('CONFLICT_RESOLUTION', { coreConflictFields: ['childrenCount'] }),
      analyses: [rejected],
      busy: false,
    });
    expect(view.rejected).toBeNull();
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
    expect(opened).toMatchObject({ manual: null, openFailed: false, retry: null, refused: null });
    expect(
      webChip(opened, [
        { id: 'v1', seq: 1 },
        { id: 'v2', seq: 2 },
      ]),
    ).toEqual({
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

  it.each(['TOO_LONG', 'OWN_MESSAGE'] as const)(
    'says a paste refused as %s at the box, and keeps the attempt',
    (reason) => {
      const after = webAfter(opened, { kind: 'unusable', reason });
      expect(after).toMatchObject({ session, refused: reason, retry: null });
    },
  );

  it('says nothing at the box for a blank paste', () => {
    const after = webAfter(
      { ...opened, refused: 'OWN_MESSAGE' },
      { kind: 'unusable', reason: 'EMPTY' },
    );
    expect(after).toMatchObject({ session, refused: null });
  });

  it('lists the issues of a first wrong paste and keeps the session they come with', () => {
    const next = {
      ...session,
      attempts: [{ content: 'x', parsed: null, issues: [] }],
    } as unknown as WebSession;
    const after = webAfter(
      { ...opened, refused: 'TOO_LONG' },
      {
        kind: 'retry',
        session: next,
        issues: [{ code: 'V1', path: '$', detail: 'không có khối JSON' }],
        retryMessage: 'Sửa',
      },
    );
    expect(after).toMatchObject({
      session: next,
      refused: null,
      retry: { issues: [{ code: 'V1', place: null, detail: null }], message: 'Sửa' },
    });
  });

  it('drops the first message shown to copy by hand once the retry asks for another (review of PR 459)', () => {
    const blocked = { ...opened, manual: 'Tin nhắn' };
    const next = {
      ...session,
      attempts: [{ content: '{}', parsed: {}, issues: [] }],
    } as unknown as WebSession;
    const after = webAfter(blocked, {
      kind: 'retry',
      session: next,
      issues: [],
      retryMessage: 'Sửa',
    });
    expect(after).toMatchObject({ manual: null, retry: { message: 'Sửa' } });
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
      error: { code: 'AI_RATE_LIMITED' },
    });
    expect(runAfter({ kind: 'error', code: 'AI_BUSY' })).toEqual({
      phase: 'error',
      error: { code: 'AI_BUSY' },
    });
  });

  it('keeps the HTTP status and the server message Rust gave (DR5-30)', () => {
    const failed = { code: 'AI_HTTP', httpStatus: 502, serverMessage: 'Bad gateway' } as const;
    expect(runAfter({ kind: 'error', ...failed })).toEqual({ phase: 'error', error: failed });
  });

  it('shows the general message for a bug or a bad request (G3 ai.html#ask 10)', () => {
    expect(runAfter({ kind: 'failed' })).toEqual({ phase: 'error', error: { code: 'GENERAL' } });
    expect(runAfter({ kind: 'error', code: 'AI_BAD_REQUEST', httpStatus: 400 })).toEqual({
      phase: 'error',
      error: { code: 'GENERAL' },
    });
  });

  it('shows the job the app keeps while it runs, "Đang hủy…" after Hủy, then how it ended', () => {
    const saved = { kind: 'saved', status: 'ACCEPTED' } as const;
    const failed = { kind: 'failed' } as const;

    expect(panelRun('running', null)).toEqual({ phase: 'running' });
    expect(panelRun('cancelling', failed)).toEqual({ phase: 'cancelling' });
    expect(panelRun('idle', failed)).toEqual({ phase: 'error', error: { code: 'GENERAL' } });
    expect(panelRun('idle', saved)).toEqual({ phase: 'idle' });
    expect(panelRun('idle', null)).toEqual({ phase: 'idle' });
  });

  it('is back as it was once the request after Hủy has ended', () => {
    expect(runAfter({ kind: 'cancelled' })).toEqual({ phase: 'idle' });
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
  const versions = [
    { id: 'v1', seq: 1 },
    { id: 'v2', seq: 2 },
    { id: 'v3', seq: 3 },
  ];
  const row = analysis({ seq: 1, state: 'CURRENT', kycVersionId: 'v3', input, output });

  it('names the version by its stored seq, not its place, when a backup left gaps (DR5-48)', () => {
    const gaps = [
      { id: 'v1', seq: 10 },
      { id: 'v3', seq: 20 },
    ];
    expect(analysisContent(row, gaps).chip.version).toBe(20);
    expect(historyRows([row], gaps).map((history) => history.version)).toEqual([20]);
  });

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
    expect(() => analysisContent(row, [{ id: 'v1', seq: 1 }])).toThrow(RangeError);
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

  describe('a fact confirmed again with the same value, which keeps the version (DR5-15)', () => {
    const old = (code: string) => ({
      ...input.facts.find((f) => f.code === code)!,
      confirmedAt: '2025-06-01',
    });
    const dated = {
      ...input,
      facts: [
        ...input.facts.filter((f) => !['F12', 'F13'].includes(f.code)),
        old('F12'),
        old('F13'),
      ],
    };
    const record = (
      seq: number,
      field: KycFactRecord['field'],
      value: string,
      status: KycFactRecord['status'],
      confirmedDate: CalendarDate,
    ): KycFactRecord => ({
      id: `f${seq}`,
      seq,
      category: 'GOALS',
      field,
      value,
      noteId: 'n1',
      confirmedDate,
      status,
    });
    // F12 confirmed again on 01/10/2026 as F20; F13 still in effect as it was.
    const facts = [
      record(12, 'primaryGoal', 'B', 'superseded', day(2025, 6, 1)),
      record(13, 'mainConcern', 'C', 'conflict', day(2025, 6, 1)),
      record(20, 'primaryGoal', 'B', 'active', day(2026, 10, 1)),
    ];
    const hypothesis = (state: 'CURRENT' | 'STALE', withFacts?: readonly KycFactRecord[]) =>
      analysisContent(
        analysis({ seq: 1, state, kycVersionId: 'v3', input: dated, output }),
        versions,
        withFacts,
      ).sections[0]!.groups[0]!.items[0]!;

    it('weighs the evidence of a CURRENT analysis by the facts in effect now', () => {
      expect(hypothesis('CURRENT').evidence).toEqual({
        level: 'LOW',
        factCount: 2,
        latestConfirmedDate: day(2025, 6, 1),
      });
      expect(hypothesis('CURRENT', facts)).toMatchObject({
        codes: ['F12', 'F13'],
        evidence: { level: 'MEDIUM', factCount: 2, latestConfirmedDate: day(2026, 10, 1) },
      });
    });

    it('keeps the evidence of a STALE analysis as it was when analysed', () => {
      expect(hypothesis('STALE', facts).evidence).toEqual({
        level: 'LOW',
        factCount: 2,
        latestConfirmedDate: day(2025, 6, 1),
      });
    });

    it('keeps the input of a code whose value really changed', () => {
      const changed = [...facts.slice(0, 2), { ...facts[2]!, value: 'D' }];
      expect(hypothesis('CURRENT', changed).evidence).toMatchObject({
        level: 'LOW',
        latestConfirmedDate: day(2025, 6, 1),
      });
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
  const versions = [
    { id: 'v1', seq: 1 },
    { id: 'v2', seq: 2 },
    { id: 'v3', seq: 3 },
  ];

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
  const versions = [
    { id: 'v1', seq: 1 },
    { id: 'v2', seq: 2 },
    { id: 'v3', seq: 3 },
  ];
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

  it('leaves out an issue of a backup’s report that is not as the validator writes it (DR5-35)', () => {
    const good = { code: 'V3', path: 'needs[0].text', detail: 'cụm cấm' };
    const row = {
      ...rejected,
      validator: [
        // An object that cannot become text, as Codex's report has it (CX-D1).
        { attempt: 1, errors: [{ ...good, path: { toString: null } }, good] },
        {
          attempt: 2,
          errors: [{ ...good, code: 'V9' }, { ...good, detail: 3 }, { code: 'V1' }, null, good],
        },
      ],
    };
    const line = { code: 'V3', place: { key: 'needs', number: 1 }, detail: 'cụm cấm' };
    expect(rejectedReport(row, [row], versions).reports).toEqual([
      { attempt: 1, issues: [line] },
      { attempt: 2, issues: [line] },
    ]);
  });

  it('reads a validator report it does not know as no attempts listed', () => {
    const row = { ...rejected, validator: { odd: true } };
    expect(rejectedReport(row, [row], versions).reports).toEqual([]);
  });
});
