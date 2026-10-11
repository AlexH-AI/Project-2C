import type { AiAnalysisView, KycFactRecord } from '@p2c/db';
import { calendarDate, type CalendarDate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { analysisContent } from '../customers/ai-panel-view';
import { appointmentAiView } from './appointment-ai-view';

const input = {
  analysisDate: '2026-09-14',
  mode: 'analysis',
  facts: [
    {
      code: 'F7',
      category: 'Gia đình',
      field: 'Số con',
      value: '2',
      confirmedAt: '2026-09-01',
      conflict: false,
    },
    {
      code: 'F12',
      category: 'Mục tiêu & mốc thời gian',
      field: 'Mục tiêu chính',
      value: 'B',
      confirmedAt: '2026-09-14',
      conflict: false,
    },
  ],
  missingCategories: [{ code: 'EXISTING_PROTECTION', label: 'Bảo vệ hiện có' }],
  conflictWarnings: [],
};
const item = (text: string, evidence: string[]) => ({ text, evidence });
const output = {
  hypotheses: [item('H1', ['F12'])],
  needs: [item('N1', ['F7'])],
  painPoints: [item('P1', ['F7'])],
  themes: [item('T1', ['F7'])],
  discoveryStrategy: [item('D1', ['F7'])],
  nextBestActions: [
    item('A1', ['F12', 'F7']),
    { text: 'A2', evidence: [], missingCategory: 'EXISTING_PROTECTION' },
  ],
  personalityNotes: [],
};

/** A stored analysis as `listAiAnalyses` gives it; Mock, analysis mode, accepted by default. */
function analysis(fields: Partial<AiAnalysisView> & Pick<AiAnalysisView, 'seq' | 'state'>) {
  const row: AiAnalysisView = {
    id: `a${fields.seq}`,
    customerId: 'c1',
    kycVersionId: 'v3',
    mode: 'analysis',
    gateState: 'PAIN_POINT_ANALYSIS',
    status: 'ACCEPTED',
    provider: 'MOCK',
    model: null,
    reasoning: null,
    promptVersion: 'analysis@1',
    attempts: 1,
    input,
    output,
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

const versions = [
  { id: 'v1', seq: 1 },
  { id: 'v2', seq: 2 },
  { id: 'v3', seq: 3 },
];

describe('appointmentAiView (spec Phase 5 §9.2)', () => {
  it('gives the Next Best Actions and Discovery Strategy of the CURRENT analysis, with its day', () => {
    const view = appointmentAiView([analysis({ seq: 1, state: 'CURRENT' })], versions, []);

    expect(view).toMatchObject({
      state: 'CURRENT',
      gateState: 'PAIN_POINT_ANALYSIS',
      source: { badge: 'MOCK' },
      version: 3,
      date: { year: 2026, month: 9, day: 14 },
    });
    expect(view?.nextBestActions.map((i) => [i.text, i.codes, i.missing])).toEqual([
      ['A1', ['F12', 'F7'], null],
      ['A2', [], 'EXISTING_PROTECTION'],
    ]);
    expect(view?.nextBestActions[0]?.evidence).toMatchObject({ level: 'MEDIUM', factCount: 2 });
    expect(view?.nextBestActions[1]?.evidence).toBeNull();
    expect(view?.discoveryStrategy.map((i) => i.text)).toEqual(['D1']);
  });

  it('weighs the evidence by the facts in effect, as the profile does (DR5-15, R2-01)', () => {
    const record = (
      seq: number,
      field: KycFactRecord['field'],
      value: string,
      status: KycFactRecord['status'],
      confirmedDate: CalendarDate,
    ): KycFactRecord => ({
      id: `f${seq}`,
      seq,
      category: 'FAMILY',
      field,
      value,
      noteId: 'n1',
      confirmedDate,
      status,
    });
    // F7 confirmed again on 01/10/2026 with the same value, as F20: the analysis stays CURRENT.
    const facts = [
      record(7, 'childrenCount', '2', 'superseded', calendarDate(2026, 9, 1)),
      record(12, 'primaryGoal', 'B', 'active', calendarDate(2026, 9, 14)),
      record(20, 'childrenCount', '2', 'active', calendarDate(2026, 10, 1)),
    ];
    const current = analysis({ seq: 1, state: 'CURRENT' });

    const view = appointmentAiView([current], versions, facts);

    expect(view?.nextBestActions[0]?.evidence).toEqual({
      level: 'MEDIUM',
      factCount: 2,
      latestConfirmedDate: calendarDate(2026, 10, 1),
    });
    // The very items of the profile's panel, for the same analysis.
    const panel = analysisContent(current, versions, facts).sections;
    const items = (key: string) => panel.find((s) => s.key === key)?.groups[0]?.items;
    expect(view?.nextBestActions).toEqual(items('nextBestActions'));
    expect(view?.discoveryStrategy).toEqual(items('discoveryStrategy'));
  });

  it('says STALE when the latest accepted analysis is', () => {
    const view = appointmentAiView(
      [analysis({ seq: 1, state: 'STALE', kycVersionId: 'v1', provider: 'OPENCODE_GO' })],
      versions,
      [],
    );

    expect(view).toMatchObject({ state: 'STALE', version: 1 });
    // OpenCode names its model in the chip of the profile only: no badge here.
    expect(view?.source).not.toHaveProperty('badge');
  });

  it('badges a ChatGPT web analysis as the Mock is, so it is not taken for OpenCode (W-1 item 4)', () => {
    const view = appointmentAiView(
      [analysis({ seq: 1, state: 'CURRENT', provider: 'CHATGPT_WEB' })],
      versions,
      [],
    );

    expect(view?.source).toEqual({ badge: 'CHATGPT_WEB' });
  });

  it('skips a newer REJECTED row for the latest accepted one', () => {
    const view = appointmentAiView(
      [
        analysis({ seq: 2, state: 'REJECTED', status: 'REJECTED', output: null }),
        analysis({ seq: 1, state: 'CURRENT', date: { year: 2026, month: 9, day: 10 } }),
      ],
      versions,
      [],
    );

    expect(view?.date).toEqual({ year: 2026, month: 9, day: 10 });
  });

  it('gives nothing when every row was REJECTED, or there is none', () => {
    expect(
      appointmentAiView(
        [analysis({ seq: 1, state: 'REJECTED', status: 'REJECTED' })],
        versions,
        [],
      ),
    ).toBeNull();
    expect(appointmentAiView([], versions, [])).toBeNull();
  });
});
