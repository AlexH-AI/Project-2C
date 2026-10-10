/* global URL */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CODEMAP_PACKAGES } from './codemap-core.mjs';
import {
  CODEMAP_DOCS,
  CODE_DOCS,
  alreadyDone,
  ciStartedAt,
  cleanupPlan,
  isDocsOnly,
  needsExe,
  isReviewWorktree,
  mergeBlockers,
  mergeSteps,
  parseWorktrees,
  riskLevel,
} from './pr-core.mjs';

// The entries of every `paths:` list in a workflow file, one array per list.
function pathsBlocks(yml) {
  const blocks = [];
  let current = null;
  for (const line of yml.split('\n')) {
    if (/^\s*paths:\s*$/.test(line)) blocks.push((current = []));
    else if (current && /^\s*- '/.test(line)) current.push(line.match(/- '(.*)'/)[1]);
    else current = null;
  }
  return blocks;
}

const HEAD = 'abc1234def5678abc1234def5678abc1234def56';
const review = (verdict, sha = HEAD.slice(0, 7), level = 'risk:low') => ({
  authorAssociation: 'OWNER',
  body: `REVIEW: ${verdict}\n\nPR #9, head \`${sha}\`, mức \`${level}\`. Đầu vào: …`,
});
const green = [{ name: 'Verify', status: 'COMPLETED', conclusion: 'SUCCESS' }];
const exe = (over = {}) => ({
  name: 'Build portable exe',
  status: 'COMPLETED',
  conclusion: 'SUCCESS',
  ...over,
});

const pr = (over = {}) => ({
  number: 9,
  state: 'OPEN',
  isDraft: false,
  baseRefName: 'main',
  headRefName: 'task/T-1-x',
  headRefOid: HEAD,
  labels: [{ name: 'type:task' }, { name: 'risk:low' }],
  comments: [review('PASS')],
  statusCheckRollup: green,
  files: [{ path: 'tools/a.mjs' }],
  ...over,
});
const ctx = (over = {}) => ({
  owner: false,
  mode: 'squash',
  stacked: [],
  baseMerged: null,
  ...over,
});

describe('isDocsOnly', () => {
  it('is true when every file is under docs/ or a Markdown file', () => {
    expect(isDocsOnly(['docs/a/b.png', 'CLAUDE.md', 'packages/db/README.md'])).toBe(true);
  });

  it('treats a package CLAUDE.md as code: pnpm verify checks its codemap block (DR-74)', () => {
    expect(CODEMAP_DOCS).toContain('packages/ai/CLAUDE.md');
    for (const path of CODEMAP_DOCS) expect(isDocsOnly(['docs/a.md', path])).toBe(false);
  });

  it('lists the CLAUDE.md of every package that tools/codemap.mjs writes', () => {
    expect(CODEMAP_DOCS).toEqual(CODEMAP_PACKAGES.map((pkg) => `${pkg}/CLAUDE.md`));
  });

  it('treats the G5 docs as code: unit tests compare code with them word for word (DR5-57)', () => {
    expect(isDocsOnly(['docs/design/phase-5-prompts.md'])).toBe(false);
    expect(isDocsOnly(['docs/golden/ai-eval.md'])).toBe(false);
    expect(isDocsOnly(['docs/reviews/x.md'])).toBe(true);
    expect(CODE_DOCS).toEqual(expect.arrayContaining(CODEMAP_DOCS));
  });

  it('matches the paths filter of ci.yml, for PRs and for pushes to main', () => {
    const ci = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
    expect(ci).not.toMatch(/paths-ignore/);
    const blocks = pathsBlocks(ci);
    expect(blocks).toHaveLength(2);
    for (const block of blocks) {
      expect(block.slice(0, 3)).toEqual(['**', '!docs/**', '!**/*.md']);
      expect(block.slice(3).sort()).toEqual([...CODE_DOCS].sort());
    }
  });

  it('pathsBlocks sees a doc missing from one block', () => {
    const block = (docs) => ['    paths:', "      - '**'", ...docs.map((d) => `      - '${d}'`)];
    const ci = [...block(['a.md', 'b.md']), '  push:', ...block(['a.md']), '  x:'].join('\n');
    expect(pathsBlocks(ci)).toEqual([
      ['**', 'a.md', 'b.md'],
      ['**', 'a.md'],
    ]);
  });

  it('is false as soon as one file is code', () => {
    expect(isDocsOnly(['docs/a.md', 'tools/a.mjs'])).toBe(false);
  });

  it('is false for an empty file list', () => {
    expect(isDocsOnly([])).toBe(false);
  });

  it('does not treat a docs-like name outside docs/ as docs', () => {
    expect(isDocsOnly(['apps/docs/x.ts', 'README.mdx'])).toBe(false);
  });
});

describe('riskLevel', () => {
  it('takes the PR label when the review keeps it', () => {
    expect(riskLevel([{ name: 'risk:low' }], { level: 'low' })).toBe('low');
  });

  it('takes the higher level when the review raised it', () => {
    expect(riskLevel([{ name: 'risk:low' }], { level: 'med' })).toBe('med');
  });

  it('never lowers the PR label', () => {
    expect(riskLevel([{ name: 'risk:high' }], { level: 'low' })).toBe('high');
  });

  it('is null when neither names a level', () => {
    expect(riskLevel([{ name: 'type:task' }], null)).toBeNull();
  });
});

describe('mergeBlockers', () => {
  it('passes a reviewed, green, low-risk PR', () => {
    expect(mergeBlockers(pr(), ctx())).toEqual([]);
  });

  it('stops when the PR is not open', () => {
    expect(mergeBlockers(pr({ state: 'MERGED' }), ctx())).toEqual([
      expect.stringMatching(/MERGED, not open/),
    ]);
  });

  it('stops on a draft', () => {
    expect(mergeBlockers(pr({ isDraft: true }), ctx())).toEqual([expect.stringMatching(/draft/)]);
  });

  it('stops without a REVIEW comment', () => {
    expect(mergeBlockers(pr({ comments: [{ body: 'LGTM' }] }), ctx())).toEqual([
      expect.stringMatching(/No REVIEW comment/),
    ]);
  });

  it('stops when the latest REVIEW is CHANGES, even after an older PASS', () => {
    const comments = [review('PASS'), review('CHANGES')];
    expect(mergeBlockers(pr({ comments }), ctx())).toEqual([
      expect.stringMatching(/Latest REVIEW is CHANGES/),
    ]);
  });

  it('stops when the PASS names another SHA than the head (P-1)', () => {
    const comments = [review('PASS', '1111111')];
    expect(mergeBlockers(pr({ comments }), ctx())).toEqual([
      expect.stringMatching(/PASS is for 1111111 but head is abc1234/),
    ]);
  });

  it('ignores a REVIEW: PASS written by someone without write access', () => {
    const outsider = { ...review('PASS'), authorAssociation: 'NONE' };
    const comments = [review('CHANGES', '1111111'), outsider];
    expect(mergeBlockers(pr({ comments }), ctx())).toEqual([
      expect.stringMatching(/Latest REVIEW is CHANGES/),
    ]);
  });

  it('stops when the PASS names no SHA', () => {
    const comments = [{ authorAssociation: 'OWNER', body: 'REVIEW: PASS\n\nno sha here' }];
    expect(mergeBlockers(pr({ comments }), ctx())).toEqual([
      expect.stringMatching(/names no head SHA/),
    ]);
  });

  it('stops a code PR with a failing, pending or missing check', () => {
    const failed = [...green, { status: 'COMPLETED', conclusion: 'FAILURE' }];
    const pending = [...green, { status: 'IN_PROGRESS', conclusion: '' }];
    expect(mergeBlockers(pr({ statusCheckRollup: failed }), ctx())).toEqual([
      expect.stringMatching(/1 failed/),
    ]);
    expect(mergeBlockers(pr({ statusCheckRollup: pending }), ctx())).toEqual([
      expect.stringMatching(/1 pending/),
    ]);
    expect(mergeBlockers(pr({ statusCheckRollup: [] }), ctx())).toEqual([
      expect.stringMatching(/no CI check/),
    ]);
  });

  it('ignores skipped checks on a green code PR', () => {
    const rollup = [...green, { status: 'COMPLETED', conclusion: 'SKIPPED' }];
    expect(mergeBlockers(pr({ statusCheckRollup: rollup }), ctx())).toEqual([]);
  });

  it('stops a code PR whose check ended in an unlisted failure', () => {
    const rollup = [...green, exe({ conclusion: 'STARTUP_FAILURE' })];
    expect(mergeBlockers(pr({ statusCheckRollup: rollup }), ctx())).toEqual([
      expect.stringMatching(/1 failed/),
    ]);
  });

  it('with build-exe, waits for the exe check and refuses it skipped', () => {
    const labels = [{ name: 'risk:low' }, { name: 'build-exe' }];
    expect(mergeBlockers(pr({ labels }), ctx())).toEqual([
      expect.stringMatching(/build-exe.*no Build portable exe check/),
    ]);
    const skipped = [...green, exe({ conclusion: 'SKIPPED' })];
    expect(mergeBlockers(pr({ labels, statusCheckRollup: skipped }), ctx())).toEqual([
      expect.stringMatching(/Build portable exe was skipped.*close.*reopen/),
    ]);
    const built = [...green, exe()];
    expect(mergeBlockers(pr({ labels, statusCheckRollup: built }), ctx())).toEqual([]);
  });

  it('lets a docs-only PR through without CI', () => {
    const files = [{ path: 'docs/x.md' }, { path: 'CLAUDE.md' }];
    expect(mergeBlockers(pr({ files, statusCheckRollup: [] }), ctx())).toEqual([]);
  });

  it('stops a PR whose files need the exe build but that has no build-exe label (DR-09)', () => {
    const files = [{ path: 'tools/a.mjs' }, { path: 'pnpm-lock.yaml' }, { path: 'package.json' }];
    expect(mergeBlockers(pr({ files }), ctx())).toEqual([
      'pnpm-lock.yaml, package.json need the build-exe label: gh pr edit 9 --add-label build-exe, then gh pr close 9 + gh pr reopen 9 so CI builds it.',
    ]);
    const labels = [{ name: 'risk:low' }, { name: 'build-exe' }];
    const built = [...green, exe()];
    expect(mergeBlockers(pr({ files, labels, statusCheckRollup: built }), ctx())).toEqual([]);
  });

  it('stops a code PR when main got code after its CI started (DR-80)', () => {
    const rollup = [
      { ...green[0], startedAt: '2026-10-06T10:00:00Z' },
      exe({ conclusion: 'SKIPPED', startedAt: '2026-10-06T10:09:00Z' }),
    ];
    const commit = (sha, date, ...files) => ({ sha, date, files });
    const mainSince = [
      commit('1111111aaaa', '2026-10-06T09:00:00Z', 'tools/old.mjs'),
      commit('2222222bbbb', '2026-10-06T11:00:00Z', 'docs/x.md'),
    ];
    const at = () => mergeBlockers(pr({ statusCheckRollup: rollup }), ctx({ mainSince }));
    expect(at()).toEqual([]);

    mainSince.push(commit('3333333cccc', '2026-10-06T10:05:00Z', 'docs/y.md', 'apps/x.ts'));
    expect(at()).toEqual([
      'main got code after CI started on head abc1234 (3333333): gh pr update-branch 9, wait for CI, then review the new head again (P-1).',
    ]);
    const docs = [{ path: 'docs/z.md' }];
    expect(mergeBlockers(pr({ files: docs, statusCheckRollup: [] }), ctx({ mainSince }))).toEqual(
      [],
    );
  });

  it('stops a med PR unless the Owner said to merge', () => {
    const labels = [{ name: 'risk:med' }];
    const comments = [review('PASS', HEAD.slice(0, 7), 'med')];
    expect(mergeBlockers(pr({ labels, comments }), ctx())).toEqual([
      expect.stringMatching(/Risk is med.*--owner/),
    ]);
    expect(mergeBlockers(pr({ labels, comments }), ctx({ owner: true }))).toEqual([]);
  });

  it('stops a low PR that the review raised to med', () => {
    const comments = [review('PASS', HEAD.slice(0, 7), 'med')];
    expect(mergeBlockers(pr({ comments }), ctx())).toEqual([expect.stringMatching(/Risk is med/)]);
  });

  it('stops when no risk level is known', () => {
    const comments = [
      { authorAssociation: 'OWNER', body: `REVIEW: PASS\n\nhead \`${HEAD.slice(0, 7)}\`` },
    ];
    expect(mergeBlockers(pr({ labels: [], comments }), ctx())).toEqual([
      expect.stringMatching(/Risk is unknown/),
    ]);
  });

  it('stops when the base is another branch that is not merged yet', () => {
    const blockers = mergeBlockers(pr({ baseRefName: 'task/T-0-a' }), ctx({ baseMerged: false }));
    expect(blockers).toEqual([expect.stringMatching(/Base task\/T-0-a is not merged yet/)]);
  });

  it('stops when the base branch is merged but the PR still targets it', () => {
    const blockers = mergeBlockers(pr({ baseRefName: 'task/T-0-a' }), ctx({ baseMerged: true }));
    expect(blockers).toEqual([expect.stringMatching(/--base main.*close.*reopen/)]);
  });

  it('asks for --merge when another PR is stacked on this branch', () => {
    expect(mergeBlockers(pr(), ctx({ stacked: [12] }))).toEqual([
      expect.stringMatching(/#12 is stacked.*--merge/),
    ]);
    expect(mergeBlockers(pr(), ctx({ stacked: [12], mode: 'merge' }))).toEqual([]);
  });

  it('lists every reason at once', () => {
    const blockers = mergeBlockers(pr({ isDraft: true, statusCheckRollup: [] }), ctx());
    expect(blockers).toHaveLength(2);
  });
});

describe('needsExe', () => {
  it('is true for Rust, toolchain, dependencies and build configuration', () => {
    for (const path of [
      'apps/desktop/src-tauri/src/storage.rs',
      'apps/desktop/src-tauri/tauri.conf.json',
      'apps/desktop/src-tauri/Cargo.toml',
      'apps/desktop/src-tauri/Cargo.lock',
      'rust-toolchain.toml',
      'package.json',
      'packages/db/package.json',
      'pnpm-lock.yaml',
      'apps/desktop/vite.config.ts',
      'vite.config.mjs',
    ])
      expect(needsExe(path), path).toBe(true);
  });

  it('is false for app code, tests, docs and look-alike names', () => {
    for (const path of [
      'apps/desktop/src/App.tsx',
      'packages/db/src/schema.ts',
      'docs/x.md',
      'package.json.bak',
      'apps/desktop/vitest.config.ts',
      '.github/workflows/ci.yml',
    ])
      expect(needsExe(path), path).toBe(false);
  });
});

describe('ciStartedAt', () => {
  it('is the earliest start among the checks, null when none started', () => {
    expect(
      ciStartedAt([
        { startedAt: '2026-10-06T10:05:00Z' },
        { startedAt: '2026-10-06T10:00:00Z' },
        { name: 'status context' },
      ]),
    ).toBe('2026-10-06T10:00:00Z');
    expect(ciStartedAt([{ name: 'x' }])).toBeNull();
    expect(ciStartedAt([])).toBeNull();
  });
});

const PORCELAIN = [
  'worktree C:/workspace/Project-2C',
  'HEAD 1111111111111111111111111111111111111111',
  'branch refs/heads/task/T-1-x',
  '',
  'worktree C:/workspace/Project-2C-review',
  'HEAD 2222222222222222222222222222222222222222',
  'detached',
  '',
  'worktree C:/workspace/Project-2C-review-2',
  'HEAD 3333333333333333333333333333333333333333',
  'branch refs/heads/main',
  '',
  'worktree C:/workspace/2C-T-1',
  'HEAD 4444444444444444444444444444444444444444',
  'branch refs/heads/task/T-2-y',
  '',
].join('\n');

describe('mergeSteps', () => {
  const merge = ['gh', 'pr', 'merge', '9', '--squash', '--match-head-commit', HEAD];
  const fetch = ['git', 'fetch', 'origin', '--prune'];
  const argv = (steps) => steps.map((s) => [s.cmd, ...s.args]);

  it('merges pinned to the head, then fetches', () => {
    expect(argv(mergeSteps(pr(), ctx()))).toEqual([merge, fetch]);
    expect(argv(mergeSteps(pr(), ctx({ mode: 'merge' })))[0]).toContain('--merge');
  });

  it('leaves a note on the PR when the Owner said merge (P-1: mergedBy is always the shared account)', () => {
    expect(argv(mergeSteps(pr(), ctx({ owner: true })))).toEqual([
      merge,
      [
        'gh',
        'pr',
        'comment',
        '9',
        '--body',
        'Merged on Owner request (merge-pr --owner), head `abc1234`.',
      ],
      fetch,
    ]);
  });
});

describe('parseWorktrees', () => {
  it('reads path, head and branch (null when detached), main checkout first', () => {
    expect(parseWorktrees(PORCELAIN)).toEqual([
      { path: 'C:/workspace/Project-2C', head: '1'.repeat(40), branch: 'task/T-1-x' },
      { path: 'C:/workspace/Project-2C-review', head: '2'.repeat(40), branch: null },
      { path: 'C:/workspace/Project-2C-review-2', head: '3'.repeat(40), branch: 'main' },
      { path: 'C:/workspace/2C-T-1', head: '4'.repeat(40), branch: 'task/T-2-y' },
    ]);
  });

  it('accepts CRLF output', () => {
    expect(parseWorktrees(PORCELAIN.replace(/\n/g, '\r\n'))).toHaveLength(4);
  });
});

describe('isReviewWorktree', () => {
  it('matches Project-2C-review and Project-2C-review-N only', () => {
    expect(isReviewWorktree('C:/workspace/Project-2C-review')).toBe(true);
    expect(isReviewWorktree('C:\\workspace\\Project-2C-review-2')).toBe(true);
    expect(isReviewWorktree('C:/workspace/Project-2C')).toBe(false);
    expect(isReviewWorktree('C:/workspace/review-notes')).toBe(false);
    expect(isReviewWorktree('C:/workspace/Project-2C-review-old')).toBe(false);
    expect(isReviewWorktree('C:/workspace/Project-2C-review/task-1')).toBe(false);
  });
});

const describeSteps = (plan) => plan.steps.map((s) => `${s.cwd}: ${s.cmd} ${s.args.join(' ')}`);
const MAIN = 'C:/workspace/Project-2C';
const REVIEW2 = 'C:/workspace/Project-2C-review-2';
const wt = (path, branch) => ({ path, head: HEAD, branch });

const state = (over = {}) => ({
  branch: 'task/T-1-x',
  worktrees: [wt(MAIN, 'task/T-1-x'), wt('C:/workspace/Project-2C-review', null)],
  dirty: new Set(),
  stacked: [],
  merged: HEAD,
  remoteHead: HEAD,
  localHead: HEAD,
  ...over,
});

describe('cleanupPlan', () => {
  it('deletes the remote branch, moves the main checkout to main, deletes the local branch', () => {
    const plan = cleanupPlan(state());
    expect(describeSteps(plan)).toEqual([
      `${MAIN}: git push origin --delete task/T-1-x`,
      `${MAIN}: git switch main`,
      `${MAIN}: git merge --ff-only origin/main`,
      `${MAIN}: git branch -D task/T-1-x`,
    ]);
    expect(plan.problems).toEqual([]);
  });

  it('skips what is already gone', () => {
    const plan = cleanupPlan(
      state({ worktrees: [wt(MAIN, 'main')], remoteHead: null, localHead: null }),
    );
    expect(describeSteps(plan)).toEqual([`${MAIN}: git merge --ff-only origin/main`]);
  });

  it('leaves a main checkout on another branch alone', () => {
    const plan = cleanupPlan(state({ worktrees: [wt(MAIN, 'task/T-9-z')], remoteHead: null }));
    expect(describeSteps(plan)).toEqual([`${MAIN}: git branch -D task/T-1-x`]);
  });

  it('stops at a dirty main checkout and keeps the local branch', () => {
    const plan = cleanupPlan(state({ dirty: new Set([MAIN]), remoteHead: null }));
    expect(plan.steps).toEqual([]);
    expect(plan.problems).toEqual([expect.stringMatching(/Project-2C has uncommitted changes/)]);
  });

  it('detaches a clean review worktree holding main before switching the main checkout', () => {
    const worktrees = [wt(MAIN, 'task/T-1-x'), wt(REVIEW2, 'main')];
    expect(describeSteps(cleanupPlan(state({ worktrees, remoteHead: null })))).toEqual([
      `${REVIEW2}: git checkout --detach origin/main`,
      `${MAIN}: git switch main`,
      `${MAIN}: git merge --ff-only origin/main`,
      `${MAIN}: git branch -D task/T-1-x`,
    ]);
  });

  it('does not switch when another worktree that cannot be moved holds main', () => {
    const worktrees = [wt(MAIN, 'task/T-1-x'), wt('C:/workspace/other', 'main')];
    const plan = cleanupPlan(state({ worktrees, remoteHead: null }));
    expect(plan.steps).toEqual([]);
    expect(plan.problems).toEqual([expect.stringMatching(/other has main checked out/)]);
  });

  it('reports every worktree holding main that cannot be moved, dirty or not', () => {
    const other = 'C:/workspace/Project-2C-wt-T2';
    for (const holder of [other, REVIEW2]) {
      const worktrees = [wt(MAIN, 'task/T-1-x'), wt(holder, 'main')];
      const plan = cleanupPlan(state({ worktrees, remoteHead: null, dirty: new Set([holder]) }));
      expect(plan.steps).toEqual([]);
      expect(plan.problems).toEqual([
        `${holder} has main checked out (uncommitted changes): main checkout left on task/T-1-x.`,
      ]);
    }
  });

  it('detaches a review worktree left on the merged branch', () => {
    const worktrees = [wt(MAIN, 'main'), wt(REVIEW2, 'task/T-1-x')];
    expect(describeSteps(cleanupPlan(state({ worktrees, remoteHead: null })))).toEqual([
      `${MAIN}: git merge --ff-only origin/main`,
      `${REVIEW2}: git checkout --detach origin/main`,
      `${MAIN}: git branch -D task/T-1-x`,
    ]);
  });

  it('removes a clean task worktree of the branch, reports a dirty one', () => {
    const task = 'C:/workspace/2C-T-1';
    const worktrees = [wt(MAIN, 'main'), wt(task, 'task/T-1-x')];
    expect(describeSteps(cleanupPlan(state({ worktrees, remoteHead: null })))).toEqual([
      `${MAIN}: git merge --ff-only origin/main`,
      `${MAIN}: git worktree remove ${task}`,
      `${MAIN}: git branch -D task/T-1-x`,
    ]);
    const dirty = cleanupPlan(state({ worktrees, remoteHead: null, dirty: new Set([task]) }));
    expect(describeSteps(dirty)).toEqual([`${MAIN}: git merge --ff-only origin/main`]);
    expect(dirty.problems).toEqual([expect.stringMatching(/2C-T-1 has uncommitted changes/)]);
  });

  it('keeps the branch, local and remote, while another PR is stacked on it', () => {
    const plan = cleanupPlan(state({ stacked: [12] }));
    expect(describeSteps(plan)).toEqual([
      `${MAIN}: git switch main`,
      `${MAIN}: git merge --ff-only origin/main`,
    ]);
    expect(plan.problems).toEqual([expect.stringMatching(/#12 .*task\/T-1-x kept/)]);
  });

  it('keeps a clean task worktree and the local branch holding commits that were not merged (DR-22)', () => {
    const task = 'C:/workspace/2C-T-1';
    const NEWER = '9999999999999999999999999999999999999999';
    const worktrees = [wt(MAIN, 'main'), { path: task, head: NEWER, branch: 'task/T-1-x' }];
    const plan = cleanupPlan(state({ worktrees, localHead: NEWER }));
    expect(describeSteps(plan)).toEqual([
      `${MAIN}: git push origin --delete task/T-1-x`,
      `${MAIN}: git merge --ff-only origin/main`,
    ]);
    expect(plan.problems).toEqual([
      `${task} is at 9999999, not the merged head abc1234: left on task/T-1-x, nothing done there.`,
    ]);
  });

  it('moves the main checkout off a branch with unmerged commits but keeps the branch', () => {
    const NEWER = '9999999999999999999999999999999999999999';
    const worktrees = [{ path: MAIN, head: NEWER, branch: 'task/T-1-x' }];
    const plan = cleanupPlan(state({ worktrees, remoteHead: null, localHead: NEWER }));
    expect(describeSteps(plan)).toEqual([
      `${MAIN}: git switch main`,
      `${MAIN}: git merge --ff-only origin/main`,
    ]);
    expect(plan.problems).toEqual([
      'Local branch task/T-1-x is at 9999999, not the merged head abc1234: kept, check its commits.',
    ]);
  });

  it('keeps a remote branch that moved after the merge', () => {
    const NEWER = '9999999999999999999999999999999999999999';
    const plan = cleanupPlan(state({ worktrees: [wt(MAIN, 'main')], remoteHead: NEWER }));
    expect(describeSteps(plan)).toEqual([
      `${MAIN}: git merge --ff-only origin/main`,
      `${MAIN}: git branch -D task/T-1-x`,
    ]);
    expect(plan.problems).toEqual([
      'origin/task/T-1-x is at 9999999, not the merged head abc1234: kept, check its commits.',
    ]);
  });
});

describe('alreadyDone', () => {
  const MSG =
    "git push origin failed: error: unable to delete 'task/T-1-x': remote ref does not exist";
  const step = (...args) => ({ cwd: MAIN, cmd: 'git', args });

  it('treats deleting a remote branch GitHub already deleted as done', () => {
    expect(alreadyDone(step('push', 'origin', '--delete', 'task/T-1-x'), MSG)).toBe(
      'remote branch task/T-1-x was already deleted (GitHub deletes it on merge).',
    );
  });

  it('keeps any other failure of the remote delete a failure', () => {
    const denied = 'git push origin failed: remote: Permission to AlexH-AI/Project-2C.git denied';
    expect(alreadyDone(step('push', 'origin', '--delete', 'task/T-1-x'), denied)).toBeNull();
  });

  it('only applies to the remote delete step', () => {
    expect(alreadyDone(step('branch', '-D', 'task/T-1-x'), MSG)).toBeNull();
  });
});
