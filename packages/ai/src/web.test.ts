// ChatGPT web (spec Phase 5 §3.1, P7): the one message to paste, and the answers pasted back.
import guide from '../../../docs/design/phase-5-prompts.md?raw';
import { evaluateKycGate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { buildAnalysisInput, type AnalysisProfile } from './input';
import { analysisPrompt } from './prompts/analysis';
import { discoveryPrompt } from './prompts/discovery';
import { retryMessage } from './prompts/retry';
import { fact, PROFILE, TODAY } from './test-support';
import {
  buildWebMessage,
  checkWebAnswer,
  startWebAnalysis,
  WEB_WRAPPER,
  type WebSession,
} from './web';

/** The ````plaintext block of the G5 file: the `web@1` wrapper (prompts §6a). */
const wrapper = /^````plaintext\n([\s\S]*?)\n````$/m.exec(guide.replaceAll('\r\n', '\n'))?.[1];

const DISCOVERY: AnalysisProfile = {
  facts: [
    fact(1, 'birthYear', 1990),
    fact(2, 'maritalStatus', 'Độc thân'),
    fact(3, 'childrenCount', 0),
    fact(4, 'occupation', 'Bác sĩ'),
  ],
};

const start = (profile: AnalysisProfile = PROFILE) => {
  const started = startWebAnalysis({
    customerId: 'customer-1',
    kycVersionId: 'version-7',
    profile,
    today: TODAY,
  });
  if (started.kind !== 'session') throw new Error(`blocked: ${started.state}`);
  return started;
};

/** Pastes each text in turn, going on with the session a retry gives. */
function paste(session: WebSession, ...texts: string[]) {
  let result = checkWebAnswer(session, texts[0]!);
  for (const text of texts.slice(1)) {
    if (result.kind !== 'retry') throw new Error(`no retry: ${result.kind}`);
    result = checkWebAnswer(result.session, text);
  }
  return result;
}

const item = (text: string, ...evidence: string[]) => ({ text, evidence });

/** Passes V1–V6 for the input of `PROFILE` (facts F3 … F13, ASSETS and RISK_APPETITE missing). */
const GOOD = {
  hypotheses: [item('KH có thể ưu tiên học phí của con', 'F12')],
  needs: [item('Quỹ học vấn cho con lớn', 'F12', 'F4')],
  painPoints: [item('Chưa có giải pháp bảo vệ', 'F7')],
  themes: [item('Gia đình là trung tâm', 'F9')],
  discoveryStrategy: [
    item('Làm rõ mối quan tâm chính', 'F10', 'F13'),
    { text: 'Tìm hiểu quy mô tài sản', evidence: [], missingCategory: 'ASSETS' },
  ],
  nextBestActions: [item('Chuẩn bị nội dung về học phí', 'F12')],
};

/** As ChatGPT gives it: a ```json fence after a sentence. */
const GOOD_ANSWER = `Đây là kết quả:\n\`\`\`json\n${JSON.stringify(GOOD, null, 2)}\n\`\`\``;

/** Valid JSON that fails V2 (a fact not in the input). */
const BAD = JSON.stringify(GOOD).replace('"F7"', '"F99"');

describe('the web@1 message', () => {
  it('wraps the approved G5 §6a text around the mode prompt and the input', () => {
    expect(WEB_WRAPPER).toEqual({ version: 'web@1', template: wrapper });

    for (const [profile, prompt] of [
      [PROFILE, analysisPrompt],
      [DISCOVERY, discoveryPrompt],
    ] as const) {
      const input = buildAnalysisInput(profile, evaluateKycGate(profile.facts), TODAY)!;
      const message = wrapper!
        .replace('{prompt}', () => prompt.system)
        .replace('{input}', () => JSON.stringify(input));

      expect(buildWebMessage(input)).toBe(message);
      expect(start(profile)).toEqual({
        kind: 'session',
        message,
        session: { customerId: 'customer-1', kycVersionId: 'version-7', input, attempts: [] },
      });
    }
  });

  it('puts the input after the prompt, as the user message to OpenCode is', () => {
    const { message, session } = start();

    expect(message).toMatch(/^Tin nhắn này có hai phần\./);
    expect(message.endsWith(`=== ĐẦU VÀO ===\n${JSON.stringify(session.input)}`)).toBe(true);
    expect(message.indexOf(analysisPrompt.system)).toBeLessThan(message.indexOf('=== ĐẦU VÀO ==='));
  });

  it.each([
    ['KYC_INSUFFICIENT', [fact(1, 'birthYear', 1990)]],
    [
      'CONFLICT_RESOLUTION',
      [
        fact(1, 'birthYear', 1990),
        fact(2, 'maritalStatus', 'Độc thân', 'conflict'),
        fact(3, 'maritalStatus', 'Đã kết hôn', 'conflict'),
        fact(4, 'childrenCount', 0),
        fact(5, 'occupation', 'Bác sĩ'),
      ],
    ],
  ])('opens no session when the gate is %s', (state, facts) => {
    const started = startWebAnalysis({
      customerId: 'customer-1',
      kycVersionId: 'version-7',
      profile: { facts },
      today: TODAY,
    });
    expect(started).toEqual({ kind: 'blocked', state });
  });
});

describe('checkWebAnswer', () => {
  it('records an accepted analysis from a first good paste, with no model, reasoning or token', () => {
    const { session } = start();

    expect(paste(session, GOOD_ANSWER)).toEqual({
      kind: 'record',
      row: {
        customerId: 'customer-1',
        kycVersionId: 'version-7',
        mode: 'analysis',
        gateState: 'PAIN_POINT_ANALYSIS',
        status: 'ACCEPTED',
        provider: 'CHATGPT_WEB',
        model: null,
        reasoning: null,
        promptVersion: 'analysis@1+web@1',
        attempts: 1,
        input: session.input,
        output: { ...GOOD, personalityNotes: [] },
        rawOutput: null,
        validator: [{ attempt: 1, errors: [] }],
        promptTokens: null,
        completionTokens: null,
      },
    });
  });

  it('gives the issues and the retry message after a first wrong paste, then records the second', () => {
    const { session } = start();

    const first = checkWebAnswer(session, BAD);
    expect(first).toEqual({
      kind: 'retry',
      issues: [
        {
          code: 'V2',
          path: 'painPoints[0].evidence[0]',
          detail: 'F99 không có trong đầu vào',
        },
      ],
      retryMessage: expect.any(String),
      session: { ...session, attempts: [expect.objectContaining({ content: BAD })] },
    });
    if (first.kind !== 'retry') return;
    // "Copy yêu cầu sửa" copies the G5 §5 message, the same as the retry sent to OpenCode.
    expect(first.retryMessage).toBe(retryMessage(first.issues));
    expect(first.retryMessage).toContain(
      '- V2 tại painPoints[0].evidence[0]: F99 không có trong đầu vào',
    );

    expect(checkWebAnswer(first.session, GOOD_ANSWER)).toMatchObject({
      kind: 'record',
      row: {
        status: 'ACCEPTED',
        attempts: 2,
        rawOutput: null,
        validator: [
          { attempt: 1, errors: [{ code: 'V2', path: 'painPoints[0].evidence[0]' }] },
          { attempt: 2, errors: [] },
        ],
      },
    });
  });

  it('records a rejected analysis after two wrong pastes, keeping the last one', () => {
    const last = `Bản sửa:\n${BAD}`;

    expect(paste(start().session, BAD, last)).toMatchObject({
      kind: 'record',
      row: {
        status: 'REJECTED',
        attempts: 2,
        output: JSON.parse(BAD),
        rawOutput: last,
        validator: [
          { attempt: 1, errors: [{ code: 'V2' }] },
          { attempt: 2, errors: [{ code: 'V2' }] },
        ],
        provider: 'CHATGPT_WEB',
        promptVersion: 'analysis@1+web@1',
      },
    });
  });

  it('counts a paste with no JSON as an attempt that fails V1', () => {
    const { session } = start();

    const first = checkWebAnswer(session, 'Xin lỗi, tôi không thể giúp việc này.');
    expect(first).toMatchObject({
      kind: 'retry',
      issues: [{ code: 'V1', path: '$', detail: 'không có khối JSON' }],
    });
    expect(paste(session, 'Xin lỗi.', 'Vẫn không có JSON')).toMatchObject({
      kind: 'record',
      row: { status: 'REJECTED', attempts: 2, output: null, rawOutput: 'Vẫn không có JSON' },
    });
  });

  it.each([
    ['empty', ''],
    ['blank', ' \n\t '],
    ['longer than 20 000 characters', `${JSON.stringify(GOOD)}${' '.repeat(20_000)}`],
  ])('does not count a paste that is %s', (_, text) => {
    const { session } = start();
    const reason = text.trim() === '' ? 'EMPTY' : 'TOO_LONG';

    expect(checkWebAnswer(session, text)).toEqual({ kind: 'unusable', reason });
    // Neither at the first attempt nor at the second.
    const retry = checkWebAnswer(session, BAD);
    if (retry.kind !== 'retry') throw new Error('no retry');
    expect(checkWebAnswer(retry.session, text)).toEqual({ kind: 'unusable', reason });
    expect(checkWebAnswer(retry.session, GOOD_ANSWER)).toMatchObject({
      row: { status: 'ACCEPTED', attempts: 2 },
    });
  });

  it('counts 20 000 characters by code point, as `raw_output` is cut', () => {
    const { session } = start();
    const emoji = '😀'.repeat(20_000);

    expect(paste(session, BAD, emoji)).toMatchObject({ row: { rawOutput: emoji } });
    expect(checkWebAnswer(session, `${emoji}x`)).toEqual({ kind: 'unusable', reason: 'TOO_LONG' });
  });

  it('records a discovery with its own prompt version', () => {
    const answer = JSON.stringify({
      discoveryStrategy: [
        { text: 'Tìm hiểu tài sản', missingCategory: 'ASSETS' },
        item('Hỏi thêm về công việc', 'F4'),
      ],
      nextBestActions: [item('Chuẩn bị câu hỏi', 'F4')],
    });

    expect(paste(start(DISCOVERY).session, answer)).toMatchObject({
      kind: 'record',
      row: {
        mode: 'discovery',
        gateState: 'PROFILE_DISCOVERY',
        status: 'ACCEPTED',
        promptVersion: 'discovery@1+web@1',
        output: { hypotheses: [], personalityNotes: [] },
      },
    });
  });

  it('leaves the session it is given as it was', () => {
    const { session } = start();
    checkWebAnswer(session, BAD);

    expect(session.attempts).toEqual([]);
    expect(paste(session, GOOD_ANSWER)).toMatchObject({ row: { attempts: 1 } });
  });

  it('refuses a session that has had all its attempts', () => {
    const retry = checkWebAnswer(start().session, BAD);
    if (retry.kind !== 'retry') throw new Error('no retry');
    const [failed] = retry.session.attempts;
    const over = { ...retry.session, attempts: [failed!, failed!] };

    expect(() => checkWebAnswer(over, GOOD_ANSWER)).toThrow(/over/);
  });
});
