/* global process */
// Merge a PR and clean up its branch in one command (#288, CLAUDE.md § "Quy trình một task" step 5):
//
//   node tools/merge-pr.mjs <N> [--merge] [--owner] [--dry-run]
//
//   --merge    merge commit instead of squash: needed when another PR is stacked on this branch
//   --owner    the Owner said to merge (any risk); without it only risk:low PRs are merged
//   --dry-run  print the checks and the clean-up plan, change nothing
//
// It refuses to merge (exit 1) when the PR is not open or is a draft, the latest REVIEW is
// not PASS for the current head SHA (P-1), a code PR's CI is not all green, the risk is not
// low without --owner, the base is not main, or a PR is stacked on it without --merge.
// The merge itself pins the head (`gh pr merge --match-head-commit`).
//
// Clean-up, right after the merge (Owner decision 28/09/2026):
//   1. git fetch origin --prune
//   2. delete the remote branch if GitHub did not
//   3. main checkout on the merged branch and clean -> git switch main + git merge --ff-only
//      origin/main (a clean review worktree holding main is detached first); dirty -> report
//   4. git branch -D the local branch (squash merges are not seen as merged by -d)
//   5. review worktree (Project-2C-review*) on the branch -> git checkout --detach origin/main;
//      task worktree of the branch -> git worktree remove; dirty -> report, leave it
//   6. a branch with another PR stacked on it is kept, local and remote
// A PR of the same task closed without merging: delete its branch by hand (remote and local).
// Every git / gh call checks its exit code; on a failure the steps done and the steps left
// are printed so the rest can be finished by hand.

import { spawnSync } from 'node:child_process';
import { cleanupPlan, mergeBlockers, parseWorktrees } from './pr-core.mjs';
import { formatStatus, loadPr } from './pr-status.mjs';
import { run } from './session-io.mjs';

const out = (text = '') => process.stdout.write(`${text}\n`);
const show = (step) =>
  step.cwd ? `git -C ${step.cwd} ${step.args.join(' ')}` : `${step.cmd} ${step.args.join(' ')}`;

function parseArgs(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  const numbers = argv.filter((a) => !a.startsWith('--'));
  const unknown = [...flags].filter((f) => !['--merge', '--owner', '--dry-run'].includes(f));
  if (numbers.length !== 1 || !/^\d+$/.test(numbers[0]) || unknown.length) {
    process.stderr.write('Usage: node tools/merge-pr.mjs <N> [--merge] [--owner] [--dry-run]\n');
    process.exit(2);
  }
  return {
    number: numbers[0],
    mode: flags.has('--merge') ? 'merge' : 'squash',
    owner: flags.has('--owner'),
    dryRun: flags.has('--dry-run'),
  };
}

const refExists = (ref) =>
  spawnSync('git', ['rev-parse', '--verify', '--quiet', ref], { encoding: 'utf8' }).status === 0;

function isDirty(path) {
  try {
    return run('git', ['status', '--porcelain'], { cwd: path }).trim() !== '';
  } catch {
    return true; // cannot tell (missing or broken worktree): never touch it
  }
}

function planCleanup(branch, stacked) {
  const worktrees = parseWorktrees(run('git', ['worktree', 'list', '--porcelain']));
  return cleanupPlan({
    branch,
    worktrees,
    dirty: new Set(worktrees.filter((w) => isDirty(w.path)).map((w) => w.path)),
    stacked,
    remoteExists: refExists(`refs/remotes/origin/${branch}`),
    localExists: refExists(`refs/heads/${branch}`),
  });
}

/** Run steps in order; on a failure print what was done and what is left, then exit 1. */
function runSteps(steps, done, later = []) {
  steps.forEach((step, i) => {
    out(`> ${show(step)}`);
    try {
      run(step.cmd, step.args, { cwd: step.cwd, timeout: 120000 });
      done.push(show(step));
    } catch (error) {
      out(`\nFAILED: ${error.message}`);
      out(`Done:\n${done.map((d) => `  ${d}`).join('\n') || '  (nothing)'}`);
      const left = steps.slice(i).map(show).concat(later);
      out(`Left to do by hand:\n${left.map((l) => `  ${l}`).join('\n')}`);
      process.exit(1);
    }
  });
}

function printPlan(plan) {
  for (const step of plan.steps) out(`  ${show(step)}`);
  if (plan.steps.length === 0) out('  (nothing to clean up)');
  for (const problem of plan.problems) out(`  ! ${problem}`);
}

const opts = parseArgs(process.argv.slice(2));
let loaded;
try {
  loaded = loadPr(opts.number);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
const { pr, stacked, baseMerged } = loaded;
out(formatStatus(loaded, { withVerdict: false }));

const blockers = mergeBlockers(pr, { ...opts, stacked, baseMerged });
out(`\nChecks (${opts.mode}${opts.owner ? ', Owner said merge' : ''}):`);
out(blockers.length ? blockers.map((b) => `  x ${b}`).join('\n') : '  ok');

const mergeStep = {
  cmd: 'gh',
  args: ['pr', 'merge', pr.number, `--${opts.mode}`, '--match-head-commit', pr.headRefOid].map(
    String,
  ),
};
const fetchStep = { cmd: 'git', args: ['fetch', 'origin', '--prune'] };

if (opts.dryRun) {
  out('\nDry run, nothing changed. Would run:');
  out(`  ${show(mergeStep)}\n  ${show(fetchStep)}`);
  out('Then clean up (as the repo is now; recomputed after the fetch):');
  printPlan(planCleanup(pr.headRefName, stacked));
  process.exit(blockers.length ? 1 : 0);
}

if (blockers.length) {
  out('\nNot merged.');
  process.exit(1);
}

out('');
const done = [];
runSteps([mergeStep, fetchStep], done, ['clean-up (see the steps in tools/merge-pr.mjs)']);
const plan = planCleanup(pr.headRefName, stacked);
runSteps(plan.steps, done);
if (plan.problems.length) {
  out(`\nMerged PR #${pr.number} (${opts.mode}); clean-up NOT finished, left for the Owner:`);
  for (const problem of plan.problems) out(`  ! ${problem}`);
  process.exit(1);
}
out(`\nMerged PR #${pr.number} (${opts.mode}) and cleaned up.`);
