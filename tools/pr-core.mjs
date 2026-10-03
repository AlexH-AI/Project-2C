// Pure decisions behind tools/pr-status.mjs and tools/merge-pr.mjs (#288): can a PR be
// merged, and how to clean up its branch afterwards. No I/O here, so every rule is
// unit-tested in pr-core.test.mjs. The rules are CLAUDE.md § "Quy trình một task", step 5.

import { checkCounts, latestReview } from './session-core.mjs';

const LEVELS = ['low', 'med', 'high'];

/** True when CI skips the PR (ci.yml paths-ignore: docs/** and **\/*.md). */
export function isDocsOnly(paths) {
  return paths.length > 0 && paths.every((p) => p.startsWith('docs/') || p.endsWith('.md'));
}

/** The higher of the PR's risk:* label and the level the REVIEW ran at (a review only raises it). */
export function riskLevel(labels, review) {
  const found = labels
    .map((l) => l.name.match(/^risk:(low|med|high)$/)?.[1])
    .concat(review?.level)
    .filter(Boolean)
    .map((level) => LEVELS.indexOf(level));
  return found.length ? LEVELS[Math.max(...found)] : null;
}

/**
 * Every reason merge-pr must not merge the PR; empty means it may.
 * `pr` is `gh pr view --json` output; `ctx` is { owner, mode: 'squash'|'merge',
 * stacked: numbers of open PRs based on this branch, baseMerged: when base is not main }.
 */
export function mergeBlockers(pr, { owner, mode, stacked, baseMerged }) {
  const blockers = [];
  if (pr.state !== 'OPEN') blockers.push(`PR is ${pr.state}, not open.`);
  if (pr.isDraft) blockers.push('PR is a draft.');

  const review = latestReview(pr.comments);
  const head = pr.headRefOid.slice(0, 7);
  if (!review) blockers.push('No REVIEW comment yet: review it in a clean session (review-pr).');
  else if (!/^PASS\b/.test(review.verdict))
    blockers.push(`Latest REVIEW is ${review.verdict}, not PASS.`);
  else if (!review.sha) blockers.push('Latest REVIEW: PASS names no head SHA.');
  else if (!pr.headRefOid.startsWith(review.sha))
    blockers.push(
      `REVIEW: PASS is for ${review.sha} but head is ${head}: review again in a clean session (P-1).`,
    );

  if (!isDocsOnly(pr.files.map((f) => f.path))) {
    const { pass, fail, pending } = checkCounts(pr.statusCheckRollup ?? []);
    if (pass + fail + pending === 0) blockers.push(`Code PR with no CI check on head ${head}.`);
    else if (fail || pending)
      blockers.push(`CI not green on head ${head}: ${fail} failed, ${pending} pending.`);
  }

  const risk = riskLevel(pr.labels, review);
  if (risk !== 'low' && !owner)
    blockers.push(
      `Risk is ${risk ?? 'unknown'}: only the Owner merges it (pass --owner when the Owner said to merge).`,
    );

  if (pr.baseRefName !== 'main') {
    blockers.push(
      baseMerged
        ? `Base ${pr.baseRefName} is already merged: gh pr edit ${pr.number} --base main, then gh pr close + gh pr reopen so CI runs again.`
        : `Base ${pr.baseRefName} is not merged yet: merge it first.`,
    );
  }

  if (stacked.length && mode !== 'merge') {
    const list = stacked.map((n) => `#${n}`).join(', ');
    blockers.push(`PR ${list} is stacked on this branch: use --merge to keep its history.`);
  }
  return blockers;
}

/** `git worktree list --porcelain` → [{ path, head, branch }], branch null when detached. */
export function parseWorktrees(text) {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n\n')
    .filter((block) => block.trim())
    .map((block) => {
      const field = (key) =>
        block
          .split('\n')
          .find((line) => line.startsWith(`${key} `))
          ?.slice(key.length + 1) ?? null;
      const branch = field('branch');
      return {
        path: field('worktree'),
        head: field('HEAD'),
        branch: branch ? branch.replace(/^refs\/heads\//, '') : null,
      };
    });
}

/** The fixed review worktrees (Project-2C-review, Project-2C-review-N), never a task worktree. */
export function isReviewWorktree(path) {
  return /[\\/]Project-2C-review(-\d+)?$/.test(path);
}

/**
 * Clean-up after the merge of `branch`, once `git fetch origin --prune` ran:
 * delete the remote branch, move the main checkout to an up-to-date main, detach review
 * worktrees, remove the task worktree, delete the local branch. Anything that would lose
 * work or break another PR is a problem to report instead of a step.
 * `worktrees` comes from parseWorktrees (main checkout first); `dirty` is a Set of paths.
 */
export function cleanupPlan({ branch, worktrees, dirty, stacked, remoteExists, localExists }) {
  const steps = [];
  const problems = [];
  const [main, ...others] = worktrees;
  const git = (cwd, ...args) => steps.push({ cwd, cmd: 'git', args });
  const isDirty = (w) => {
    if (!dirty.has(w.path)) return false;
    problems.push(`${w.path} has uncommitted changes: left on ${w.branch}, nothing done there.`);
    return true;
  };
  let branchInUse = false;

  if (stacked.length) {
    const list = stacked.map((n) => `#${n}`).join(', ');
    problems.push(`PR ${list} is stacked on it: branch ${branch} kept, local and remote.`);
  } else if (remoteExists) {
    git(main.path, 'push', 'origin', '--delete', branch);
  }

  if (main.branch === branch) {
    // git switch main fails while another worktree has main checked out.
    const holders = others.filter((w) => w.branch === 'main');
    const stuck = holders.filter((w) => !isReviewWorktree(w.path) || isDirty(w));
    for (const w of stuck.filter((w) => !dirty.has(w.path)))
      problems.push(`${w.path} has main checked out: main checkout left on ${branch}.`);
    if (isDirty(main) || stuck.length) {
      branchInUse = true;
    } else {
      for (const w of holders) git(w.path, 'checkout', '--detach', 'origin/main');
      git(main.path, 'switch', 'main');
      git(main.path, 'merge', '--ff-only', 'origin/main');
    }
  } else if (main.branch === 'main' && !dirty.has(main.path)) {
    git(main.path, 'merge', '--ff-only', 'origin/main');
  }

  for (const w of others.filter((w) => w.branch === branch)) {
    if (isDirty(w)) branchInUse = true;
    else if (isReviewWorktree(w.path)) git(w.path, 'checkout', '--detach', 'origin/main');
    else git(main.path, 'worktree', 'remove', w.path);
  }

  if (localExists && !branchInUse && !stacked.length) git(main.path, 'branch', '-D', branch);
  return { steps, problems };
}
