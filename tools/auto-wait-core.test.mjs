import { describe, expect, it } from 'vitest';
import {
  EXIT,
  ciState,
  parseArgs,
  prForIssue,
  report,
  reviewState,
  titleState,
  waitFor,
} from './auto-wait-core.mjs';

const HEAD = 'abc1234def5678abc1234def5678abc1234def56';
const OLD = '0110000aaaa1111bbbb2222cccc3333dddd44444';

const check = (name, conclusion, status = 'COMPLETED') => ({ name, status, conclusion });
const review = (verdict, sha, who = 'OWNER') => ({
  authorAssociation: who,
  body: `REVIEW: ${verdict}\n\nPR #941, head \`${sha}\`, mức \`low\`.`,
});
const pr = (overrides = {}) => ({
  number: 941,
  state: 'OPEN',
  headRefOid: HEAD,
  statusCheckRollup: [check('Verify', 'SUCCESS'), check('e2e', 'SUCCESS')],
  comments: [],
  files: [{ path: 'tools/x.mjs' }],
  changedFiles: 1,
  ...overrides,
});

describe('parseArgs', () => {
  it('reads each mode with the defaults', () => {
    expect(parseArgs(['ci', '941'])).toEqual({
      mode: 'ci',
      target: 941,
      timeoutMin: 45,
      everySec: 60,
      not: null,
      sha: null,
    });
    expect(parseArgs(['pr', '932']).target).toBe(932);
    expect(parseArgs(['review', '941']).mode).toBe('review');
    expect(parseArgs(['title', 'record the notes of the PR 939 review']).target).toBe(
      'record the notes of the PR 939 review',
    );
    expect(parseArgs(['sleep']).target).toBeNull();
  });

  it('reads the flags, lower-casing SHAs', () => {
    expect(
      parseArgs(['ci', '941', '--not', 'ABC1234', '--timeout', '120', '--every', '30']),
    ).toEqual({
      mode: 'ci',
      target: 941,
      timeoutMin: 120,
      everySec: 30,
      not: 'abc1234',
      sha: null,
    });
    expect(parseArgs(['review', '941', '--sha', HEAD]).sha).toBe(HEAD);
    expect(parseArgs(['sleep', '--timeout', '30']).timeoutMin).toBe(30);
  });

  it('refuses a missing, unknown or extra argument', () => {
    for (const argv of [
      [],
      ['wait'],
      ['ci'],
      ['ci', 'x'],
      ['ci', '0'],
      ['ci', '1', '2'],
      ['sleep', '5'],
      ['title', ''],
      ['title', '   '],
      ['ci', '1', '--bogus'],
      ['ci', '1', '--timeout'],
    ]) {
      expect(parseArgs(argv).error, argv.join(' ')).toMatch(/\S/);
    }
  });

  it('keeps the limits and the flags of each mode', () => {
    for (const argv of [
      ['ci', '1', '--timeout', '0'],
      ['ci', '1', '--timeout', '121'],
      ['ci', '1', '--timeout', '1.5'],
      ['ci', '1', '--every', '29'],
      ['ci', '1', '--every', '601'],
      ['ci', '1', '--not', 'abc12'],
      ['ci', '1', '--not', 'xyz1234'],
      ['ci', '1', '--sha', 'abc1234'],
      ['review', '1', '--not', 'abc1234'],
      ['pr', '1', '--sha', 'abc1234'],
      ['sleep', '--once'],
      ['ci', '1', '--once', '--timeout', '5'],
      ['ci', '1', '--timeout', '5', '--once'],
    ]) {
      expect(parseArgs(argv).error, argv.join(' ')).toMatch(/\S/);
    }
  });

  it('reads once with --once: no time to wait', () => {
    expect(parseArgs(['review', '941', '--once'])).toMatchObject({ mode: 'review', timeoutMin: 0 });
    expect(parseArgs(['title', 'x', '--once', '--every', '30']).timeoutMin).toBe(0);
  });
});

describe('ciState', () => {
  it('is done and good when every check passed, skipped ones counting as none', () => {
    const state = ciState(
      pr({ statusCheckRollup: [check('Verify', 'SUCCESS'), check('exe', 'SKIPPED')] }),
    );
    expect(state).toMatchObject({ done: true, code: EXIT.done });
    expect(state.text).toBe('CI green @abc1234: 1 pass');
  });

  it('is done and bad once every check finished and one failed, naming it', () => {
    const state = ciState(
      pr({
        statusCheckRollup: [
          check('Verify', 'SUCCESS'),
          check('e2e', 'FAILURE'),
          { context: 'ci/legacy', state: 'ERROR' },
        ],
      }),
    );
    expect(state).toMatchObject({ done: true, code: EXIT.bad });
    expect(state.text).toBe('CI red @abc1234: e2e, ci/legacy');
  });

  it('waits while a check runs, even after another failed', () => {
    const state = ciState(
      pr({ statusCheckRollup: [check('Verify', 'FAILURE'), check('e2e', null, 'IN_PROGRESS')] }),
    );
    expect(state.done).toBe(false);
    expect(state.text).toBe('CI 0 pass, 1 fail, 1 pending @abc1234');
  });

  it('waits for the first check of a code PR', () => {
    expect(ciState(pr({ statusCheckRollup: [] }))).toEqual({
      done: false,
      text: 'no checks yet @abc1234',
    });
  });

  it('waits until every workflow run of the head ended (a job that needs another checks in late)', () => {
    const verified = pr({ statusCheckRollup: [check('Verify', 'SUCCESS')] });
    const going = [
      { name: 'CI', status: 'in_progress' },
      { name: 'Pages', status: 'completed' },
    ];
    expect(ciState(verified, { runs: () => going })).toEqual({
      done: false,
      text: 'CI 1 pass, 0 fail, 0 pending @abc1234, still running: CI',
    });
    const ended = going.map((run) => ({ ...run, status: 'completed' }));
    expect(ciState(verified, { runs: () => ended })).toMatchObject({ done: true, code: EXIT.done });
    const failed = pr({ statusCheckRollup: [check('Verify', 'FAILURE')] });
    expect(ciState(failed, { runs: () => going }).done).toBe(false);
  });

  it('reads the workflow runs only once every check ended', () => {
    const runs = () => {
      throw new Error('runs read too early');
    };
    const running = pr({ statusCheckRollup: [check('Verify', null, 'IN_PROGRESS')] });
    expect(ciState(running, { runs }).done).toBe(false);
    expect(ciState(pr({ statusCheckRollup: [] }), { runs }).done).toBe(false);
    expect(ciState(pr(), { not: 'abc1234', runs }).done).toBe(false);
    expect(ciState(pr({ state: 'MERGED' }), { runs }).code).toBe(EXIT.look);
  });

  it('is done at once for a docs-only PR, which CI skips', () => {
    const docs = pr({ statusCheckRollup: [], files: [{ path: 'docs/state/review-notes.md' }] });
    expect(ciState(docs)).toEqual({
      done: true,
      code: EXIT.done,
      text: 'docs-only @abc1234: CI not needed',
    });
  });

  it('does not take a PR for docs-only when not every file was read', () => {
    const partly = pr({
      statusCheckRollup: [],
      files: [{ path: 'docs/a.md' }],
      changedFiles: 2,
    });
    expect(ciState(partly).done).toBe(false);
  });

  it('waits for a new head first when told which one to move past', () => {
    expect(ciState(pr(), { not: 'abc1234' })).toEqual({
      done: false,
      text: 'head still abc1234: waiting for a push',
    });
    expect(ciState(pr(), { not: OLD.slice(0, 7) })).toMatchObject({ done: true, code: EXIT.done });
  });

  it('stops for a PR that is no longer open', () => {
    expect(ciState(pr({ state: 'MERGED' }))).toEqual({
      done: true,
      code: EXIT.look,
      text: 'PR #941 is MERGED',
    });
    expect(ciState(pr({ state: 'CLOSED' })).code).toBe(EXIT.look);
  });
});

describe('reviewState', () => {
  it('is done on the latest REVIEW of the head: PASS good, CHANGES bad', () => {
    expect(reviewState(pr({ comments: [review('PASS', 'abc1234')] }))).toEqual({
      done: true,
      code: EXIT.done,
      text: 'REVIEW PASS @abc1234, level low',
    });
    expect(reviewState(pr({ comments: [review('PASS kèm ghi chú', 'abc1234')] })).code).toBe(
      EXIT.done,
    );
    expect(
      reviewState(pr({ comments: [review('PASS', OLD), review('CHANGES', 'abc1234')] })),
    ).toMatchObject({ done: true, code: EXIT.bad });
  });

  it('waits while the latest REVIEW names another head or none', () => {
    expect(reviewState(pr({ comments: [review('PASS', OLD.slice(0, 7))] }))).toEqual({
      done: false,
      text: `latest REVIEW is for ${OLD.slice(0, 7)}, waiting for abc1234`,
    });
    expect(reviewState(pr())).toEqual({ done: false, text: 'no REVIEW yet' });
    const noSha = { authorAssociation: 'OWNER', body: 'REVIEW: PASS\n\nno head here' };
    expect(reviewState(pr({ comments: [noSha] })).done).toBe(false);
  });

  it('reads only REVIEW comments of the repo owner side', () => {
    expect(reviewState(pr({ comments: [review('PASS', 'abc1234', 'NONE')] })).done).toBe(false);
  });

  it('matches SHAs by prefix, both ways', () => {
    expect(reviewState(pr({ comments: [review('PASS', HEAD)] })).done).toBe(true);
    expect(reviewState(pr({ comments: [review('PASS', 'abc1235')] })).done).toBe(false);
    expect(
      reviewState(pr({ comments: [review('PASS', OLD)] }), { sha: OLD.slice(0, 7) }).code,
    ).toBe(EXIT.done);
  });

  it('stops on a verdict it cannot read or a PR no longer open', () => {
    expect(reviewState(pr({ comments: [review('MAYBE', 'abc1234')] })).code).toBe(EXIT.look);
    expect(reviewState(pr({ state: 'MERGED' })).code).toBe(EXIT.look);
  });
});

describe('prForIssue', () => {
  const open = (number, issues) => ({
    number,
    headRefOid: HEAD,
    closingIssuesReferences: issues.map((n) => ({ number: n })),
  });

  it('finds the one open PR that closes the Issue', () => {
    expect(prForIssue([open(940, [931]), open(941, [932])], 932)).toEqual({
      done: true,
      code: EXIT.done,
      text: 'PR #941 @abc1234 closes #932',
    });
  });

  it('waits while none does', () => {
    expect(prForIssue([open(940, [931]), { number: 7, headRefOid: HEAD }], 932)).toEqual({
      done: false,
      text: 'no open PR closes #932 yet',
    });
  });

  it('stops when several do', () => {
    expect(prForIssue([open(941, [932]), open(945, [932, 933])], 932)).toEqual({
      done: true,
      code: EXIT.look,
      text: 'several open PRs close #932: #941, #945',
    });
  });
});

describe('titleState', () => {
  const found = (number, state, title) => ({ number, state, title });
  const TEXT = 'record the notes of the PR 939 review';

  it('finds an open or merged PR whose title holds the text', () => {
    expect(
      titleState(
        [found(940, 'MERGED', 'docs: record the notes of the PR 939 review (T-330)')],
        TEXT,
      ),
    ).toEqual({
      done: true,
      code: EXIT.done,
      text: 'PR #940 (MERGED): docs: record the notes of the PR 939 review (T-330)',
    });
    expect(
      titleState([found(950, 'OPEN', 'Docs: Record the notes of the PR 939 review')], TEXT).done,
    ).toBe(true);
  });

  it('does not take a longer number for the PR asked for', () => {
    const other = [found(990, 'OPEN', 'docs: record the notes of the PR 9390 review')];
    expect(titleState(other, 'record the notes of the PR 939').done).toBe(false);
    expect(titleState(other, TEXT).done).toBe(false);
  });

  it('skips PRs closed without merging and picks the newest of the rest', () => {
    const list = [
      found(951, 'CLOSED', `docs: ${TEXT}`),
      found(944, 'MERGED', `docs: ${TEXT}`),
      found(948, 'OPEN', `docs: ${TEXT} (again)`),
    ];
    expect(titleState(list, TEXT).text).toBe(`PR #948 (OPEN): docs: ${TEXT} (again)`);
    expect(titleState([found(951, 'CLOSED', `docs: ${TEXT}`)], TEXT)).toEqual({
      done: false,
      text: `no open or merged PR titled "${TEXT}" yet`,
    });
  });
});

describe('waitFor', () => {
  const clock = () => {
    let now = 0;
    const slept = [];
    return {
      now: () => now,
      sleep: async (ms) => {
        slept.push(ms);
        now += ms;
      },
      pass: (ms) => {
        now += ms;
      },
      slept,
    };
  };
  // A read that takes `ms`, as a gh call does, noting when each read started.
  const slowReads = (c, ms, verdict) => {
    const at = [];
    const read = () => {
      at.push(c.now());
      c.pass(ms);
      return verdict;
    };
    return { read, at };
  };
  const reads = (...results) => {
    let i = 0;
    return () => {
      const result = results[Math.min(i++, results.length - 1)];
      if (result instanceof Error) throw result;
      return result;
    };
  };
  const waiting = { done: false, text: 'CI 1 pass, 0 fail, 1 pending @abc1234' };
  const green = { done: true, code: EXIT.done, text: 'CI green @abc1234: 2 pass' };

  it('returns the first verdict that is done, polling every interval', async () => {
    const c = clock();
    const verdict = await waitFor(reads(waiting, waiting, green), {
      timeoutMs: 600000,
      everyMs: 60000,
      ...c,
    });
    expect(verdict).toBe(green);
    expect(c.slept).toEqual([60000, 60000]);
  });

  it('times out with the last thing it read', async () => {
    const c = clock();
    const verdict = await waitFor(reads(waiting), { timeoutMs: 60000, everyMs: 30000, ...c });
    expect(verdict).toEqual({
      done: true,
      code: EXIT.timeout,
      text: `timed out after 1 min; last: ${waiting.text}`,
    });
    expect(c.slept).toEqual([30000, 30000]);
  });

  it('waits the whole timeout when it equals the interval, reading again at the deadline', async () => {
    const c = clock();
    const { read, at } = slowReads(c, 1000, waiting);
    const verdict = await waitFor(read, { timeoutMs: 60000, everyMs: 60000, ...c });
    expect(verdict).toEqual({
      done: true,
      code: EXIT.timeout,
      text: `timed out after 1 min; last: ${waiting.text}`,
    });
    expect(at).toEqual([0, 60000]);
    expect(c.slept).toEqual([59000]);
  });

  it('makes the last read at the deadline when reads take time', async () => {
    const c = clock();
    const { read, at } = slowReads(c, 1000, waiting);
    await waitFor(read, { timeoutMs: 180000, everyMs: 60000, ...c });
    expect(at).toEqual([0, 61000, 122000, 180000]);
    expect(c.slept).toEqual([60000, 60000, 57000]);
  });

  it('keeps 30 s between reads, so the last read may fall after the deadline', async () => {
    const c = clock();
    const { read, at } = slowReads(c, 1000, waiting);
    await waitFor(read, { timeoutMs: 90000, everyMs: 60000, ...c });
    expect(at).toEqual([0, 61000, 92000]);
    expect(c.slept).toEqual([60000, 30000]);
  });

  it('retries a failed read and stops after five in a row', async () => {
    const boom = new Error('gh pr view failed: HTTP 502');
    const c = clock();
    expect(
      await waitFor(reads(boom, boom, green), { timeoutMs: 600000, everyMs: 30000, ...c }),
    ).toBe(green);
    const verdict = await waitFor(reads(boom), { timeoutMs: 600000, everyMs: 30000, ...clock() });
    expect(verdict).toEqual({
      done: true,
      code: EXIT.look,
      text: '5 reads failed in a row; last: gh pr view failed: HTTP 502',
    });
  });

  it('names a failed read as the last thing seen when time runs out', async () => {
    const verdict = await waitFor(reads(waiting, new Error('timeout')), {
      timeoutMs: 30000,
      everyMs: 30000,
      ...clock(),
    });
    expect(verdict.text).toBe('timed out after 0.5 min; last: read failed: timeout');
  });

  it('reads once when there is no time, saying "not yet" instead of timed out', async () => {
    const c = clock();
    expect(await waitFor(reads(waiting), { timeoutMs: 0, everyMs: 60000, ...c })).toEqual({
      done: true,
      code: EXIT.timeout,
      text: `not yet: ${waiting.text}`,
    });
    expect(c.slept).toEqual([]);
    expect(await waitFor(reads(green), { timeoutMs: 0, everyMs: 60000, ...clock() })).toBe(green);
  });

  it('says a single read that failed is something to look at, not "not yet"', async () => {
    const boom = new Error('gh pr view failed: HTTP 502');
    expect(await waitFor(reads(boom), { timeoutMs: 0, everyMs: 60000, ...clock() })).toEqual({
      done: true,
      code: EXIT.look,
      text: 'read failed: gh pr view failed: HTTP 502',
    });
  });
});

describe('report', () => {
  it('prints one line naming the mode and target', () => {
    const verdict = { code: EXIT.done, text: 'CI green @abc1234: 2 pass' };
    expect(report(parseArgs(['ci', '941']), verdict)).toBe(
      'AUTO-WAIT ci #941: CI green @abc1234: 2 pass',
    );
    expect(report(parseArgs(['pr', '932']), { text: 'x' })).toBe('AUTO-WAIT pr #932: x');
    expect(report(parseArgs(['title', 'notes of the PR 9']), { text: 'x' })).toBe(
      'AUTO-WAIT title "notes of the PR 9": x',
    );
    expect(report(parseArgs(['sleep']), { text: '45 min passed' })).toBe(
      'AUTO-WAIT sleep: 45 min passed',
    );
  });

  it('keeps a gh error that runs over two lines on the one line', () => {
    // What gh prints when it cannot reach GitHub, as session-io's run() passes it on.
    const text =
      'read failed: gh pr view failed: error connecting to api.github.com\n' +
      'check your internet connection or https://githubstatus.com\n';
    expect(report(parseArgs(['ci', '941']), { code: EXIT.look, text })).toBe(
      'AUTO-WAIT ci #941: read failed: gh pr view failed: error connecting to api.github.com' +
        ' check your internet connection or https://githubstatus.com',
    );
  });
});
