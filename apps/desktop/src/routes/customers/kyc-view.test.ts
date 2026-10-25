import type {
  AppointmentRecord,
  KycFactRecord,
  KycNoteRecord,
  KycProfileRecord,
  KycVersionRecord,
} from '@p2c/db';
import {
  kycHash,
  type CalendarDate,
  type KycFact,
  type KycProfile,
  type StageTransition,
} from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  currentFactRecords,
  factCodeTarget,
  factInEffect,
  factText,
  inTimelineFilter,
  kycAmountRead,
  kycOverview,
  kycTimeline,
  nextVersionNumber,
  previewKycNote,
  refusalText,
  resolveKycOptions,
  stageCause,
  TIMELINE_FILTERS,
  type TimelineEvent,
  type TimelineFilter,
  type TimelineKyc,
  type TimelineVersion,
} from './kyc-view';

const day = (month: number, dayOfMonth: number): CalendarDate => ({
  year: 2026,
  month,
  day: dayOfMonth,
});

const fact = (
  field: KycFact['field'],
  value: KycFact['value'],
  status: KycFact['status'] = 'active',
  category: KycFact['category'] = 'IDENTITY',
): KycFact => ({
  id: `${field}-${String(value)}`,
  category,
  field,
  value,
  noteId: 'n1',
  confirmedDate: day(9, 1),
  status,
});

describe('kycOverview', () => {
  it('lists every hạng mục with its facts in effect and the kind of conflict', () => {
    const { gate, rows } = kycOverview([
      fact('birthYear', 1984),
      fact('residence', 'Huế', 'superseded'),
      fact('maritalStatus', 'Độc thân', 'conflict', 'FAMILY'),
      fact('maritalStatus', 'Đã kết hôn', 'conflict', 'FAMILY'),
      fact('riskProfile', 'A', 'conflict', 'RISK_APPETITE'),
      fact('riskProfile', 'B', 'conflict', 'RISK_APPETITE'),
    ]);

    expect(gate.state).toBe('CONFLICT_RESOLUTION');
    expect(rows.map((row) => row.category)).toEqual([
      'IDENTITY',
      'FAMILY',
      'OCCUPATION_INCOME',
      'ASSETS',
      'GOALS',
      'RISK_APPETITE',
      'EXISTING_PROTECTION',
      'CONCERNS',
    ]);
    expect(rows[0]).toEqual({
      category: 'IDENTITY',
      present: true,
      facts: [fact('birthYear', 1984)],
      conflict: null,
    });
    // Family needs both trường chính; a trường in conflict still counts as answered (G2 1).
    expect(rows[1]).toMatchObject({ present: false, conflict: 'core' });
    expect(rows[1]!.facts).toHaveLength(2);
    expect(rows[5]).toMatchObject({ present: true, conflict: 'minor' });
    expect(rows[2]).toMatchObject({ present: false, facts: [], conflict: null });
  });

  it('calls a hạng mục with a cốt lõi and a minor trường in conflict a core conflict', () => {
    const { rows } = kycOverview([
      fact('dependents', 'Mẹ', 'conflict', 'FAMILY'),
      fact('dependents', 'Bố mẹ', 'conflict', 'FAMILY'),
      fact('maritalStatus', 'Độc thân', 'conflict', 'FAMILY'),
      fact('maritalStatus', 'Đã kết hôn', 'conflict', 'FAMILY'),
    ]);
    expect(rows[1]).toMatchObject({ category: 'FAMILY', conflict: 'core' });
  });
});

describe('factText', () => {
  it('shows yes/no answers in words and other values as they are', () => {
    const words = { yes: 'Có', no: 'Không' };
    expect(factText(true, words)).toBe('Có');
    expect(factText(false, words)).toBe('Không');
    expect(factText(1984, words)).toBe('1984');
    expect(factText('Bác sĩ', words)).toBe('Bác sĩ');
  });
});

describe('kycAmountRead (NT-HS-05, mockup 7b / 7c)', () => {
  it('reads an amount typed for a money trường as every money input does', () => {
    expect(kycAmountRead('annualIncome', '6 tỷ')).toBe('6.000.000.000 ₫ (6 tỷ)');
    expect(kycAmountRead('totalAssets', '1 tỷ 2')).toBe('1.200.000.000 ₫ (1,2 tỷ)');
    expect(kycAmountRead('liabilities', '800tr')).toBe('800.000.000 ₫ (800 tr)');
  });

  it('gives the full form once when the compact one is the same', () => {
    expect(kycAmountRead('liabilities', '0')).toBe('0 ₫');
    expect(kycAmountRead('annualIncome', '500k')).toBe('500.000 ₫');
  });

  it('reads the text as the command stores it, invisible characters dropped (K20, DR6-101)', () => {
    // Saved as "6tỷ", which reads as 6 tỷ.
    expect(kycAmountRead('annualIncome', '6\u200btỷ')).toBe('6.000.000.000 ₫ (6 tỷ)');
    expect(kycAmountRead('totalAssets', '\ufeff1 tỷ\u2060 2')).toBe('1.200.000.000 ₫ (1,2 tỷ)');
  });

  it('reads nothing the parser cannot, nor any other trường', () => {
    expect(kycAmountRead('totalAssets', 'Khoảng 12 tỷ')).toBeNull();
    expect(kycAmountRead('annualIncome', '1–2 tỷ')).toBeNull();
    expect(kycAmountRead('annualIncome', '')).toBeNull();
    expect(kycAmountRead('liabilities', '-5 tỷ')).toBeNull();
    expect(kycAmountRead('goalHorizon', '2029')).toBeNull();
    expect(kycAmountRead('assetAllocation', '6 tỷ')).toBeNull();
  });
});

describe('currentFactRecords (mockup 7c "Đang có")', () => {
  const record = (seq: number, field: KycFact['field'], status: KycFact['status']) => ({
    ...fact(field, `V${seq}`, status),
    seq,
  });

  it('keeps the facts in effect on the trường with their seq, in recording order', () => {
    const profile: KycProfileRecord = {
      notes: [],
      facts: [
        record(1, 'childrenCount', 'superseded'),
        record(2, 'childrenCount', 'conflict'),
        record(3, 'residence', 'active'),
        record(4, 'childrenCount', 'conflict'),
      ],
    };

    expect(currentFactRecords(profile, 'childrenCount').map((f) => f.seq)).toEqual([2, 4]);
    expect(currentFactRecords(profile, 'residence').map((f) => f.seq)).toEqual([3]);
    expect(currentFactRecords(profile, 'occupation')).toEqual([]);
  });
});

describe('stageCause (mockup customer.html, Dòng thời gian)', () => {
  const change = (
    from: StageTransition['from'],
    to: StageTransition['to'],
    appointmentId: string | null,
  ): StageTransition => ({ id: 't', customerId: 'c1', from, to, date: day(9, 1), appointmentId });

  it('tells a new customer and a change by hand, never an RF', () => {
    expect(stageCause(change(null, 'N4', null))).toBe('created');
    expect(stageCause(change('N3', 'N2', null))).toBe('manual');
  });

  it('counts one RF for a meeting that moves N4 / N3 up to N2 / N1, no other', () => {
    expect(stageCause(change('N3', 'N2', 'a1'))).toBe('rf');
    expect(stageCause(change('N4', 'N1', 'a1'))).toBe('rf');
    expect(stageCause(change('N2', 'N1', 'a1'))).toBe('noRf');
    expect(stageCause(change('N4', 'N3', 'a1'))).toBe('noRf');
    expect(stageCause(change('N2', 'N3', 'a1'))).toBe('noRf');
  });
});

describe('kycTimeline', () => {
  const move = (id: string, date: CalendarDate): StageTransition => ({
    id,
    customerId: 'c1',
    from: null,
    to: 'N4',
    date,
    appointmentId: null,
  });
  const note = (id: string, date: CalendarDate): KycNoteRecord => ({
    id,
    text: id,
    createdDate: date,
    source: 'RE',
  });
  const version = (
    id: string,
    date: CalendarDate,
    seq = Number(id.slice(1)),
  ): KycVersionRecord => ({
    id,
    hash: id,
    summary: `Cập nhật KYC ${id}`,
    date,
    material: false,
    seq,
  });
  /** Fact `F{seq}` of note `noteId`. */
  const recorded = (seq: number, noteId: string): KycFactRecord => ({
    ...fact('residence', `R${seq}`),
    id: `f${seq}`,
    seq,
    noteId,
  });
  const kyc = (parts: Partial<TimelineKyc> = {}): TimelineKyc => ({
    notes: [],
    facts: [],
    versions: [],
    versionFacts: new Map(),
    recordingOrder: [],
    ...parts,
  });
  /** Each event as `kind:id`, a version with its codes, a note with the versions it is given. */
  const shape = (events: readonly TimelineEvent[]) =>
    events.map((event) => {
      const line = ({ version: { id }, codes }: TimelineVersion) => `${id}[${codes.join(' ')}]`;
      if (event.kind === 'note')
        return [`note:${event.id}`, ...event.versions.map(line)].join(' + ');
      if (event.kind === 'version') return `version:${line(event.version)}`;
      return `${event.kind}:${event.id}`;
    });

  it('gives a note the versions its facts recorded on its day, with their codes (customer.html)', () => {
    const events = kycTimeline(
      [],
      kyc({
        notes: [note('n1', day(9, 1)), note('n2', day(9, 5))],
        facts: [recorded(1, 'n1'), recorded(2, 'n1'), recorded(3, 'n2'), recorded(4, 'n2')],
        // f4 is in no version: it confirmed a value again, which changed nothing.
        versions: [version('v1', day(9, 1)), version('v2', day(9, 5)), version('v3', day(9, 5))],
        versionFacts: new Map([
          ['v1', ['f1', 'f2']],
          ['v2', ['f3']],
          ['v3', []],
        ]),
        recordingOrder: ['n1', 'v1', 'n2', 'v2', 'v3'],
      }),
    );

    // v3, a conflict settled, stands alone; it came last on its day.
    expect(shape(events)).toEqual(['version:v3[]', 'note:n2 + v2[F3]', 'note:n1 + v1[F1 F2]']);
  });

  it('gives a note each version of its day, in their order: facts one at a time (seed), or 3f', () => {
    const events = kycTimeline(
      [],
      kyc({
        notes: [note('n1', day(9, 1))],
        facts: [recorded(1, 'n1'), recorded(2, 'n1')],
        versions: [version('v1', day(9, 1)), version('v2', day(9, 1))],
        versionFacts: new Map([
          ['v1', ['f1']],
          ['v2', ['f2']],
        ]),
      }),
    );

    expect(shape(events)).toEqual(['note:n1 + v1[F1] + v2[F2]']);
  });

  it('keeps apart a version from a note of another day, or from the facts of two notes', () => {
    const events = kycTimeline(
      [],
      kyc({
        notes: [note('n1', day(9, 1)), note('n2', day(9, 1))],
        facts: [recorded(1, 'n1'), recorded(2, 'n1'), recorded(3, 'n2')],
        // f2: an AI proposal of n1 confirmed on 05/09 (3f). v3: facts of two notes (a backup).
        versions: [version('v1', day(9, 1)), version('v2', day(9, 5)), version('v3', day(9, 5))],
        versionFacts: new Map([
          ['v1', ['f1']],
          ['v2', ['f2']],
          ['v3', ['f1', 'f3']],
        ]),
        recordingOrder: ['n1', 'v1', 'n2', 'v2', 'v3'],
      }),
    );

    expect(shape(events)).toEqual([
      'version:v3[F1 F3]',
      'version:v2[F2]',
      'note:n2',
      'note:n1 + v1[F1]',
    ]);
  });

  it('puts the newest first; on one day KYC in recording order, then a stage change', () => {
    const events = kycTimeline(
      [move('t1', day(9, 1)), move('t2', day(9, 5))],
      kyc({
        // n4, a note alone, came before n2's update; v3 settled a conflict after it.
        notes: [note('n1', day(9, 1)), note('n4', day(9, 5)), note('n2', day(9, 5))],
        facts: [recorded(1, 'n1'), recorded(2, 'n2')],
        versions: [version('v1', day(9, 1)), version('v2', day(9, 5)), version('v3', day(9, 5))],
        versionFacts: new Map([
          ['v1', ['f1']],
          ['v2', ['f2']],
          ['v3', []],
        ]),
        recordingOrder: ['n1', 'v1', 'n4', 'n2', 'v2', 'v3'],
      }),
    );
    // n3, a note alone, came after n2's update.
    const later = kycTimeline(
      [],
      kyc({
        notes: [note('n2', day(9, 5)), note('n3', day(9, 5))],
        facts: [recorded(2, 'n2')],
        versions: [version('v2', day(9, 5))],
        versionFacts: new Map([['v2', ['f2']]]),
        recordingOrder: ['n2', 'v2', 'n3'],
      }),
    );

    expect(shape(events)).toEqual([
      'version:v3[]',
      'note:n2 + v2[F2]',
      'note:n4',
      'stage:t2',
      'note:n1 + v1[F1]',
      'stage:t1',
    ]);
    expect(shape(later)).toEqual(['note:n3', 'note:n2 + v2[F2]']);
  });

  it('puts a note alone and a version alone of one day where each was saved (review of PR 835)', () => {
    // On 05/09 v2 settled a conflict, or confirmed an AI proposal of n1 (3f); then n9 was saved.
    const settled = kyc({
      notes: [note('n1', day(9, 1)), note('n9', day(9, 5))],
      facts: [recorded(1, 'n1'), recorded(2, 'n1')],
      versions: [version('v1', day(9, 1)), version('v2', day(9, 5))],
      versionFacts: new Map([
        ['v1', ['f1']],
        ['v2', []],
      ]),
      recordingOrder: ['n1', 'v1', 'v2', 'n9'],
    });
    const confirmed = {
      ...settled,
      versionFacts: new Map([
        ['v1', ['f1']],
        ['v2', ['f2']],
      ]),
    };
    // A KYC update comes where its last version was saved: n1's AI proposal confirmed on its own
    // day, after n9.
    const update = kyc({
      notes: [note('n1', day(9, 1)), note('n9', day(9, 1))],
      facts: [recorded(1, 'n1'), recorded(2, 'n1')],
      versions: [version('v1', day(9, 1)), version('v2', day(9, 1))],
      versionFacts: new Map([
        ['v1', ['f1']],
        ['v2', ['f2']],
      ]),
      recordingOrder: ['n1', 'v1', 'n9', 'v2'],
    });

    expect(shape(kycTimeline([], settled))).toEqual([
      'note:n9',
      'version:v2[]',
      'note:n1 + v1[F1]',
    ]);
    expect(shape(kycTimeline([], confirmed))).toEqual([
      'note:n9',
      'version:v2[F2]',
      'note:n1 + v1[F1]',
    ]);
    expect(
      shape(kycTimeline([], { ...settled, recordingOrder: ['n1', 'v1', 'n9', 'v2'] })),
    ).toEqual(['version:v2[]', 'note:n9', 'note:n1 + v1[F1]']);
    expect(shape(kycTimeline([], update))).toEqual(['note:n1 + v1[F1] + v2[F2]', 'note:n9']);
  });

  it('names a version by its stored seq, which a backup may leave with gaps (DR5-48)', () => {
    const events = kycTimeline(
      [],
      kyc({ versions: [version('v1', day(9, 1), 10), version('v2', day(9, 5), 20)] }),
    );

    expect(events.map((event) => event.kind === 'version' && event.version.version.seq)).toEqual([
      20, 10,
    ]);
  });

  const meeting = (id: string, date: CalendarDate, status: AppointmentRecord['status']) =>
    ({ id, date, status }) as AppointmentRecord;
  const numbers = (appointments: AppointmentRecord[]) =>
    kycTimeline([], kyc(), appointments).map((event) => event.kind === 'meeting' && event.number);

  it('keeps KYC under "KYC", the appointments under "Lịch hẹn", a stage change under "Tất cả"', () => {
    const events = kycTimeline(
      [move('t1', day(9, 1))],
      kyc({
        notes: [note('n1', day(9, 1)), note('n2', day(9, 2))],
        facts: [recorded(1, 'n1')],
        versions: [version('v1', day(9, 1)), version('v2', day(9, 3))],
        versionFacts: new Map([
          ['v1', ['f1']],
          ['v2', []],
        ]),
      }),
      [meeting('a1', day(9, 4), 'SCHEDULED')],
    );
    const shown = (filter: TimelineFilter) =>
      shape(events.filter((event) => inTimelineFilter(event, filter)));

    expect(TIMELINE_FILTERS).toEqual(['ALL', 'KYC', 'APPOINTMENTS']);
    expect(shown('ALL')).toEqual([
      'meeting:a1',
      'version:v2[]',
      'note:n2',
      'note:n1 + v1[F1]',
      'stage:t1',
    ]);
    expect(shown('KYC')).toEqual(['version:v2[]', 'note:n2', 'note:n1 + v1[F1]']);
    expect(shown('APPOINTMENTS')).toEqual(['meeting:a1']);
  });

  it('adds the appointments, numbering the meetings held, each under its stage change', () => {
    const events = kycTimeline([{ ...move('t1', day(9, 14)), appointmentId: 'a4' }], kyc(), [
      meeting('a1', day(6, 1), 'MET'),
      meeting('a2', day(6, 20), 'NO_SHOW'),
      meeting('a3', day(7, 12), 'MET'),
      meeting('a4', day(9, 14), 'MET'),
      meeting('a5', day(9, 28), 'SCHEDULED'),
    ]);

    expect(events.map((event) => `${event.kind}:${event.id}`)).toEqual([
      'meeting:a5',
      'stage:t1',
      'meeting:a4',
      'meeting:a3',
      'meeting:a2',
      'meeting:a1',
    ]);
    expect(events.map((event) => event.kind === 'meeting' && event.number)).toEqual([
      null,
      false,
      3,
      2,
      null,
      1,
    ]);
  });

  // DR-67 (Owner, option A): only a meeting held is "Lịch hẹn lần n", so no two share a number.
  it('numbers no planned meeting, nor one past its day without an outcome', () => {
    expect(
      numbers([
        meeting('a1', day(9, 1), 'MET'),
        meeting('a2', day(10, 10), 'SCHEDULED'),
        meeting('a3', day(10, 20), 'SCHEDULED'),
      ]),
    ).toEqual([null, null, 1]);
    expect(
      numbers([
        meeting('a1', day(8, 1), 'MET'),
        meeting('a2', day(9, 1), 'SCHEDULED'),
        meeting('a3', day(9, 10), 'MET'),
      ]),
    ).toEqual([2, null, 1]);
  });
});

describe('previewKycNote', () => {
  const profile: KycProfile = {
    notes: [{ id: 'n1', text: 'năm sinh', createdDate: day(9, 1) }],
    facts: [fact('birthYear', 1984), fact('residence', 'Huế')],
  };
  const versions = [
    { id: 'v1', seq: 1, hash: kycHash(profile), summary: '', date: day(9, 1), material: true },
  ];
  const preview = (facts: Parameters<typeof previewKycNote>[2], manual = false) =>
    previewKycNote(profile, versions, facts, day(9, 15), manual);

  it('records no version for a note alone or for facts that change nothing', () => {
    expect(preview([])).toEqual({ kind: 'none' });
    expect(preview([{ field: 'residence', value: 'Huế' }])).toEqual({ kind: 'none' });
  });

  it('numbers the next version; a cốt lõi trường makes it material on its own', () => {
    expect(preview([{ field: 'childrenCount', value: '2' }])).toEqual({
      kind: 'version',
      number: 2,
      material: true,
      auto: true,
    });
    expect(preview([{ field: 'residence', value: 'Hà Nội' }])).toEqual({
      kind: 'version',
      number: 2,
      material: false,
      auto: false,
    });
    expect(preview([{ field: 'residence', value: 'Hà Nội' }], true)).toMatchObject({
      material: true,
      auto: false,
    });
  });

  it('numbers the next version one after the last stored seq, gaps included (DR5-48)', () => {
    const numbered = [{ ...versions[0]!, seq: 20 }];
    expect(
      previewKycNote(
        profile,
        numbered,
        [{ field: 'residence', value: 'Hà Nội' }],
        day(9, 15),
        false,
      ),
    ).toMatchObject({ kind: 'version', number: 21 });
    expect(nextVersionNumber(numbered)).toBe(21);
    expect(nextVersionNumber([])).toBe(1);
  });

  it('says why a fact it refuses cannot be saved: its value first, else the conflict (3f)', () => {
    expect(refusalText('childrenCount', 'ba')).toBe(
      'Giá trị không hợp lệ cho trường này (vd. số con là số nguyên).',
    );
    expect(refusalText('residence', 'Hu\u{0}ế')).toMatch(/^Chữ có ký tự không lưu được/);
    expect(refusalText('residence', 'Huế')).toBe(
      'Không đánh dấu mâu thuẫn được: "Nơi sinh sống" chưa có giá trị, hoặc giá trị mới trùng giá trị đang có. Hãy dùng "Cập nhật".',
    );
  });

  it('refuses a conflict with no value to disagree with, or with the same value', () => {
    expect(preview([{ field: 'occupation', value: 'Bác sĩ', conflict: true }])).toEqual({
      kind: 'refused',
      field: 'occupation',
    });
    expect(preview([{ field: 'residence', value: ' Huế ', conflict: true }])).toEqual({
      kind: 'refused',
      field: 'residence',
    });
    expect(preview([{ field: 'residence', value: 'Hà Nội', conflict: true }])).toMatchObject({
      kind: 'version',
    });
  });
});

describe('resolveKycOptions', () => {
  const noteRecord = (
    id: string,
    source: KycNoteRecord['source'],
    date: CalendarDate,
  ): KycNoteRecord => ({ id, text: id, createdDate: date, source });
  const conflicting = (
    id: string,
    field: KycFact['field'],
    value: KycFact['value'],
    noteId: string,
    date: CalendarDate,
    category: KycFact['category'],
  ): KycFactRecord => ({
    id,
    seq: Number(id.slice(1)),
    category,
    field,
    value,
    noteId,
    confirmedDate: date,
    status: 'conflict',
  });

  it('offers every value of a trường in conflict between two ghi chú', () => {
    const profile: KycProfileRecord = {
      notes: [noteRecord('n1', 'RE', day(9, 1)), noteRecord('n2', 'RE', day(9, 10))],
      facts: [
        conflicting('f1', 'childrenCount', 2, 'n1', day(9, 1), 'FAMILY'),
        conflicting('f2', 'childrenCount', 3, 'n2', day(9, 10), 'FAMILY'),
      ],
    };

    expect(resolveKycOptions(profile, 'childrenCount')).toEqual([
      {
        factId: 'f1',
        code: 'F1',
        value: 2,
        source: 'NOTE',
        confirmedDate: day(9, 1),
        disabled: false,
      },
      {
        factId: 'f2',
        code: 'F2',
        value: 3,
        source: 'NOTE',
        confirmedDate: day(9, 10),
        disabled: false,
      },
    ]);
  });

  it('keeps birth year to the hồ sơ KH value: the one from a ghi chú is locked (D2)', () => {
    const profile: KycProfileRecord = {
      notes: [noteRecord('s1', 'SYSTEM', day(9, 1)), noteRecord('n1', 'RE', day(9, 5))],
      facts: [
        conflicting('f1', 'birthYear', 1984, 's1', day(9, 1), 'IDENTITY'),
        conflicting('f2', 'birthYear', 1985, 'n1', day(9, 5), 'IDENTITY'),
      ],
    };

    expect(resolveKycOptions(profile, 'birthYear')).toEqual([
      {
        factId: 'f1',
        code: 'F1',
        value: 1984,
        source: 'SYSTEM',
        confirmedDate: day(9, 1),
        disabled: false,
      },
      {
        factId: 'f2',
        code: 'F2',
        value: 1985,
        source: 'NOTE',
        confirmedDate: day(9, 5),
        disabled: true,
      },
    ]);
  });

  it('offers nothing for a trường not in conflict', () => {
    const profile: KycProfileRecord = {
      notes: [noteRecord('n1', 'RE', day(9, 1))],
      facts: [
        { ...fact('residence', 'Huế'), noteId: 'n1', seq: 1 },
        { ...fact('residence', 'Hà Nội', 'superseded'), noteId: 'n1', seq: 2 },
      ],
    };

    expect(resolveKycOptions(profile, 'residence')).toEqual([]);
  });
});

describe('fact codes F{seq} (spec Phase 5 §6.1, mockup ai.html 3a)', () => {
  const record = (seq: number, status: KycFact['status']): KycFactRecord => ({
    ...fact('residence', `R${seq}`, status),
    seq,
  });
  const facts = [record(1, 'superseded'), record(2, 'active'), record(3, 'conflict')];

  it('keeps the seq of each fact on the list, which names it', () => {
    const { rows } = kycOverview(facts);
    expect(rows[0]!.facts.map((f) => f.seq)).toEqual([2, 3]);
  });

  it('leads a code cited as evidence to its fact while the fact is in effect', () => {
    expect(factCodeTarget(facts, 'F2')).toEqual({ kind: 'shown', code: 'F2' });
    expect(factCodeTarget(facts, 'F3')).toEqual({ kind: 'shown', code: 'F3' });
  });

  it('says a fact since replaced, or not there at all, is no longer in effect', () => {
    expect(factCodeTarget(facts, 'F1')).toEqual({ kind: 'gone', code: 'F1' });
    expect(factCodeTarget(facts, 'F9')).toEqual({ kind: 'gone', code: 'F9' });
  });

  // Confirmed again with the same value: the fact is replaced, the KYC version stays (DR5-15).
  const occupation = (seq: number, value: string, status: KycFact['status']): KycFactRecord => ({
    ...fact('occupation', value, status, 'OCCUPATION_INCOME'),
    seq,
    id: `o${seq}`,
  });

  it('leads a code replaced by the same trường and value to the fact in effect now (DR5-15)', () => {
    const again = [
      occupation(2, 'Kỹ sư', 'superseded'),
      occupation(6, 'Kỹ sư', 'active'),
      record(7, 'active'),
    ];
    expect(factCodeTarget(again, 'F2')).toEqual({ kind: 'shown', code: 'F6' });
    expect(factInEffect(again, 'F2')?.seq).toBe(6);
    expect(factInEffect(again, 'F6')?.seq).toBe(6);
  });

  it('keeps a code whose value really changed no longer in effect', () => {
    const changed = [occupation(2, 'Kỹ sư', 'superseded'), occupation(6, 'Bác sĩ', 'active')];
    expect(factCodeTarget(changed, 'F2')).toEqual({ kind: 'gone', code: 'F2' });
    expect(factInEffect(changed, 'F2')).toBeNull();
    // The same value under another trường is another fact.
    expect(
      factInEffect(
        [record(1, 'superseded'), { ...record(4, 'active'), value: 'R1', field: 'dependents' }],
        'F1',
      ),
    ).toBeNull();
  });
});
