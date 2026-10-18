import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TESTED_BASE, VERIFY_CHECK } from './pr-core.mjs';
import { formatStatus, loadPr } from './pr-status.mjs';
import { run } from './session-io.mjs';

vi.mock('./session-io.mjs', () => ({ run: vi.fn() }));

const HEAD = 'abc1234def5678abc1234def5678abc1234def56';
const TESTED = 'feed0000feed0000feed0000feed0000feed0000';
const review = (sha) => ({
  authorAssociation: 'OWNER',
  body: `REVIEW: PASS\n\nPR #9, head \`${sha}\`, mức \`risk:low\`.`,
});
const PR = {
  number: 9,
  title: 'T-1 x',
  state: 'OPEN',
  isDraft: false,
  baseRefName: 'main',
  headRefName: 'task/T-1-x',
  headRefOid: HEAD,
  labels: [{ name: 'risk:low' }],
  comments: [review(HEAD.slice(0, 7))],
  statusCheckRollup: [
    {
      name: VERIFY_CHECK,
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
      detailsUrl: 'https://github.com/o/r/actions/runs/1/job/77',
    },
  ],
  changedFiles: 1,
  url: 'https://github.com/o/r/pull/9',
};

// `gh --jq` of the expressions pr-status uses, on one page of a REST answer.
const JQ = {
  '.[].filename': (files) => files.map((f) => f.filename),
  '.files[].filename': (commit) => commit.files.map((f) => f.filename),
  '{total: .total_commits, shas: [.commits[].sha]}': (comparison) => [
    { total: comparison.total_commits, shas: comparison.commits.map((c) => c.sha) },
  ],
};

/**
 * `gh` on a GitHub holding PR 9 (`pr` over PR) and the commits main got since TESTED, oldest
 * first. A comparison pages as its REST docs say: with `per_page`, every commit in order; without,
 * the newest 250 only. `listed` caps what GitHub lists below what it counts.
 */
function fakeGh({ pr = {}, since = [], listed = since.length }) {
  const pages = (path, all) => {
    const size = Number(path.match(/[?&]per_page=(\d+)/)?.[1] ?? 30);
    return Array.from({ length: Math.ceil(all.length / size) }, (_, i) =>
      all.slice(i * size, (i + 1) * size),
    );
  };
  const answer = (path) => {
    if (/\/pulls\/9\/files\b/.test(path)) return pages(path, [{ filename: 'tools/a.mjs' }]);
    const commit = path.match(/\/commits\/(\w+)$/)?.[1];
    if (commit)
      return [{ files: since.find((c) => c.sha === commit).files.map((f) => ({ filename: f })) }];
    if (path.includes(`/compare/${TESTED}...main`)) {
      const shown = since.slice(since.length - listed).map(({ sha }) => ({ sha }));
      const comparison = (commits) => ({ total_commits: since.length, commits });
      if (!/[?&](per_page|page)=/.test(path)) return [comparison(shown.slice(-250))];
      return pages(path, shown).map(comparison);
    }
    throw new Error(`fake gh: no answer for ${path}`);
  };
  return (cmd, args) => {
    expect(cmd).toBe('gh');
    if (args[0] === 'pr' && args[1] === 'view') return JSON.stringify({ ...PR, ...pr });
    if (args[0] === 'pr' && args[1] === 'list') return '[]';
    const path = args.find((a) => a.startsWith('repos/'));
    if (path.endsWith('/check-runs/77/annotations')) {
      return JSON.stringify([
        [{ annotation_level: 'notice', title: TESTED_BASE, message: TESTED }],
      ]);
    }
    const all = args.includes('--paginate') ? answer(path) : answer(path).slice(0, 1);
    const jq = JQ[args[args.indexOf('--jq') + 1]];
    if (!jq) throw new Error(`fake gh: no jq ${args.join(' ')}`);
    return all
      .flatMap(jq)
      .map((v) => (typeof v === 'string' ? v : JSON.stringify(v)))
      .join('\n');
  };
}

beforeEach(() => {
  vi.mocked(run).mockReset();
});

describe('loadPr: the commits main got since the main CI tested (DR6-85)', () => {
  // 251 commits: the oldest changes code, the 250 after it only the review notes ledger.
  const since = Array.from({ length: 251 }, (_, i) => ({
    sha: `${String(i).padStart(7, '0')}cccc`,
    files: [i === 0 ? 'apps/x.ts' : 'docs/state/review-notes.md'],
  }));

  it('reads every page, so code in the oldest commit still stops the merge', () => {
    vi.mocked(run).mockImplementation(fakeGh({ since }));
    const loaded = loadPr('9');
    expect(loaded.mainSince.map((c) => c.sha)).toEqual(since.map((c) => c.sha));
    expect(loaded.mainTotal).toBe(251);
    const text = formatStatus(loaded);
    expect(text).toContain('  tested   main feed000, 251 commit(s) on it since\n');
    expect(text).toContain(
      '    - main got code since feed000, the main CI tested on head abc1234 (0000000): ',
    );
  });

  it('stops with the count read when GitHub lists fewer commits than it counts', () => {
    vi.mocked(run).mockImplementation(fakeGh({ since, listed: 250 }));
    const text = formatStatus(loadPr('9'));
    expect(text).toContain('  tested   main feed000, 251 commit(s) on it since, only 250 read\n');
    expect(text).toContain(
      '    - Read 250 of the 251 commits main got since feed000, the main CI tested on head abc1234: ',
    );
    expect(text).not.toContain('main got code');
  });
});

describe('formatStatus', () => {
  it('reads no tested main for a PR that is no longer open, and does not ask for one (#642)', () => {
    vi.mocked(run).mockImplementation(fakeGh({ pr: { state: 'MERGED' } }));
    const loaded = loadPr('9');
    expect(loaded.testedBase).toBeNull();
    const text = formatStatus(loaded);
    expect(text).toContain('  tested   not noted\n');
    expect(text).toContain(
      '  merge    blocked (risk:low rules, --squash):\n    - PR is MERGED, not open.',
    );
    expect(text).not.toContain('noted no tested');
  });

  it('does not ask a review notes PR to review its head again (T-215)', () => {
    const pr = {
      ...PR,
      files: [{ path: 'docs/state/review-notes.md' }],
      comments: [review('1111111')],
      statusCheckRollup: [],
    };
    const loaded = {
      pr,
      stacked: [],
      baseMerged: null,
      testedBase: null,
      mainSince: [],
      mainTotal: 0,
    };
    const text = formatStatus(loaded);
    expect(text).toContain('  review   PASS @1111111, level low (review notes only: not needed)\n');
    expect(text).toContain('  merge    ready: node tools/merge-pr.mjs 9');
  });
});
