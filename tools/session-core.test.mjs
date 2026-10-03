import { describe, expect, it } from 'vitest';
import {
  HOOK_LIMIT,
  checkBody,
  checkWrite,
  checksSummary,
  fitOutput,
  latestReview,
  pickHandoffIssue,
} from './session-core.mjs';

const issue = (number, updatedAt = '2026-10-03T01:00:00Z') => ({
  number,
  title: 'HANDOFF',
  body: 'body',
  updatedAt,
});

describe('pickHandoffIssue', () => {
  it('returns the only open handoff issue', () => {
    expect(pickHandoffIssue([issue(7)]).number).toBe(7);
  });

  it('fails when there is none', () => {
    expect(() => pickHandoffIssue([])).toThrow(/no open issue labelled "handoff"/);
  });

  it('fails when there are several, naming them', () => {
    expect(() => pickHandoffIssue([issue(7), issue(9)])).toThrow(/#7, #9/);
  });
});

describe('checkBody', () => {
  it('accepts a short body', () => {
    expect(checkBody('a'.repeat(8000))).toEqual({ error: null, warning: null });
  });

  it('warns above 8,000 characters', () => {
    const result = checkBody('a'.repeat(8001));
    expect(result.error).toBeNull();
    expect(result.warning).toMatch(/8001/);
  });

  it('refuses above 9,000 characters', () => {
    expect(checkBody('a'.repeat(9001)).error).toMatch(/9001/);
  });

  it('refuses an empty body', () => {
    expect(checkBody(' \n ').error).toMatch(/empty/);
  });
});

describe('checkWrite', () => {
  const cache = { number: 7, updatedAt: '2026-10-03T01:00:00Z' };

  it('allows a write when the issue is unchanged since the last read', () => {
    expect(checkWrite(cache, issue(7))).toBeNull();
  });

  it('refuses without a previous read', () => {
    expect(checkWrite(null, issue(7))).toMatch(/read it first/);
  });

  it('refuses when the issue changed since the last read', () => {
    expect(checkWrite(cache, issue(7, '2026-10-03T02:00:00Z'))).toMatch(/changed since/);
  });

  it('refuses when the cache belongs to another issue', () => {
    expect(checkWrite(cache, issue(9))).toMatch(/#7.*#9/);
  });
});

describe('fitOutput', () => {
  it('keeps short output unchanged', () => {
    expect(fitOutput('head\n', 'body')).toBe('head\nbody');
  });

  it('cuts long output below the hook limit with a marker', () => {
    const out = fitOutput('head\n', 'x'.repeat(20000));
    expect(out.length).toBeLessThan(HOOK_LIMIT);
    expect(HOOK_LIMIT).toBeLessThan(10000);
    expect(out).toMatch(/\[cut here/);
  });
});

describe('latestReview', () => {
  const comment = (body) => ({ body });

  it('returns the last REVIEW comment with its verdict and head SHA', () => {
    const review = latestReview([
      comment('REVIEW: CHANGES\nPR #5, head `aaaaaaa`, mức `low`.'),
      comment('looks fine'),
      comment('REVIEW: PASS (kèm ghi chú)\nPR #5, head `b37132d`, mức `low`.'),
    ]);
    expect(review).toEqual({ verdict: 'PASS (kèm ghi chú)', sha: 'b37132d' });
  });

  it('returns null when nobody reviewed yet', () => {
    expect(latestReview([comment('hi')])).toBeNull();
  });

  it('keeps a review without a SHA', () => {
    expect(latestReview([comment('REVIEW: PASS')])).toEqual({ verdict: 'PASS', sha: null });
  });
});

describe('checksSummary', () => {
  it('counts passing, failing and pending checks', () => {
    expect(
      checksSummary([
        { status: 'COMPLETED', conclusion: 'SUCCESS' },
        { status: 'COMPLETED', conclusion: 'SKIPPED' },
        { status: 'COMPLETED', conclusion: 'FAILURE' },
        { status: 'IN_PROGRESS', conclusion: '' },
        { state: 'SUCCESS' },
      ]),
    ).toBe('CI 2 pass, 1 fail, 1 pending');
  });

  it('says when there are no checks', () => {
    expect(checksSummary([])).toBe('CI none');
  });
});
