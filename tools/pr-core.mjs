// Pure decisions behind tools/pr-status.mjs and tools/merge-pr.mjs (#288): can a PR be
// merged, and how to clean up its branch afterwards. No I/O here, so every rule is
// unit-tested in pr-core.test.mjs. The rules are CLAUDE.md § "Quy trình một task", step 5.

import { checkCounts, latestReview } from './session-core.mjs';

const LEVELS = ['low', 'med', 'high'];

/** PR numbers as "#12, #14". */
export const prList = (numbers) => numbers.map((n) => `#${n}`).join(', ');
// Job name in .github/workflows/ci.yml, run only for PRs labelled build-exe.
const EXE_CHECK = 'Build portable exe';

// Package CLAUDE.md files hold the export map that `pnpm verify` checks (tools/codemap.mjs),
// so a change to them is code. ci.yml lists the same files in its `paths` filter.
export const CODEMAP_DOCS = [
  'apps/desktop/CLAUDE.md',
  'packages/db/CLAUDE.md',
  'packages/domain/CLAUDE.md',
  'packages/ui/CLAUDE.md',
];

/** True when CI skips the PR (ci.yml `paths`: docs/** and **\/*.md, but not CODEMAP_DOCS). */
export function isDocsOnly(paths) {
  return (
    paths.length > 0 &&
    paths.every((p) => (p.startsWith('docs/') || p.endsWith('.md')) && !CODEMAP_DOCS.includes(p))
  );
}

// Files whose change needs the exe job, so the build-exe label (CLAUDE.md step 5): Rust,
// toolchain, dependencies, build configuration.
const EXE_PATHS = [
  /^apps\/desktop\/src-tauri\//,
  /(^|\/)Cargo\.(toml|lock)$/,
  /^rust-toolchain\.toml$/,
  /(^|\/)package\.json$/,
  /^pnpm-lock\.yaml$/,
  /(^|\/)vite\.config\.[cm]?[jt]s$/,
  /(^|\/)tauri\.conf\.json$/,
];

/** True when a change to `path` must go through the exe job (label build-exe). */
export const needsExe = (path) => EXE_PATHS.some((re) => re.test(path));

/** When the PR's CI started: the earliest `startedAt` among its checks, null when none has one. */
export function ciStartedAt(rollup) {
  const starts = rollup.map((c) => c.startedAt).filter(Boolean);
  return starts.length ? starts.reduce((a, b) => (Date.parse(b) < Date.parse(a) ? b : a)) : null;
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
 * The merge itself, as { cmd, args } steps: merge pinned to the head, then (--owner) a note
 * on the PR, since `mergedBy` is always the account Claude shares with the Owner (P-1),
 * then fetch. `ctx` is { owner, mode: 'squash'|'merge' }.
 */
export function mergeSteps(pr, { owner, mode }) {
  const number = String(pr.number);
  const note = `Merged on Owner request (merge-pr --owner), head \`${pr.headRefOid.slice(0, 7)}\`.`;
  return [
    {
      cmd: 'gh',
      args: ['pr', 'merge', number, `--${mode}`, '--match-head-commit', pr.headRefOid],
    },
    ...(owner ? [{ cmd: 'gh', args: ['pr', 'comment', number, '--body', note] }] : []),
    { cmd: 'git', args: ['fetch', 'origin', '--prune'] },
  ];
}

/**
 * Every reason merge-pr must not merge the PR; empty means it may.
 * `pr` is `gh pr view --json` output; `ctx` is { owner, mode: 'squash'|'merge',
 * stacked: numbers of open PRs based on this branch, baseMerged: when base is not main,
 * mainSince: the base's commits not in the head, as [{ sha, date, files }] }.
 */
export function mergeBlockers(pr, { owner, mode, stacked, baseMerged, mainSince = [] }) {
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

  const paths = pr.files.map((f) => f.path);
  if (!isDocsOnly(paths)) {
    const rollup = pr.statusCheckRollup ?? [];
    const { pass, fail, pending } = checkCounts(rollup);
    if (pass + fail + pending === 0) blockers.push(`Code PR with no CI check on head ${head}.`);
    else if (fail || pending)
      blockers.push(`CI not green on head ${head}: ${fail} failed, ${pending} pending.`);

    // CI tested the head merged with the base as it was then; code merged since was never
    // tested with this PR, and a push to main only builds the exe (DR-80).
    const started = ciStartedAt(rollup);
    const untested = mainSince.filter(
      (c) => started && Date.parse(c.date) > Date.parse(started) && !isDocsOnly(c.files),
    );
    if (untested.length) {
      const shas = untested.map((c) => c.sha.slice(0, 7)).join(', ');
      blockers.push(
        `main got code after CI started on head ${head} (${shas}): gh pr update-branch ${pr.number}, wait for CI, then review the new head again (P-1).`,
      );
    }

    const labelled = pr.labels.some((l) => l.name === 'build-exe');
    const exePaths = paths.filter(needsExe);
    if (exePaths.length && !labelled) {
      const n = pr.number;
      blockers.push(
        `${exePaths.join(', ')} need the build-exe label: gh pr edit ${n} --add-label build-exe, then gh pr close ${n} + gh pr reopen ${n} so CI builds it.`,
      );
    }

    // The exe job needs verify, so its check only appears once verify is done; and it is
    // skipped when the label was added after the run (CLAUDE.md, build-exe).
    if (labelled) {
      const exe = rollup.find((c) => c.name === EXE_CHECK);
      if (!exe) blockers.push(`Label build-exe but no ${EXE_CHECK} check on head ${head} yet.`);
      else if (exe.conclusion === 'SKIPPED')
        blockers.push(
          `${EXE_CHECK} was skipped: push again, or gh pr close + gh pr reopen, so CI builds it.`,
        );
    }
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
    blockers.push(
      `PR ${prList(stacked)} is stacked on this branch: use --merge to keep its history.`,
    );
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
 * work or break another PR is a problem to report instead of a step: a branch or worktree
 * whose head is not `merged` (the PR head that was merged) may hold commits never pushed (DR-22).
 * `worktrees` comes from parseWorktrees (main checkout first); `dirty` is a Set of paths;
 * `remoteHead` / `localHead` are the SHAs of origin/<branch> and <branch>, null when absent.
 */
export function cleanupPlan({ branch, merged, worktrees, dirty, stacked, remoteHead, localHead }) {
  const steps = [];
  const problems = [];
  const [main, ...others] = worktrees;
  const git = (cwd, ...args) => steps.push({ cwd, cmd: 'git', args });
  const isDirty = (w) => {
    if (!dirty.has(w.path)) return false;
    problems.push(`${w.path} has uncommitted changes: left on ${w.branch}, nothing done there.`);
    return true;
  };
  const notMerged = (what, sha) =>
    `${what} is at ${sha.slice(0, 7)}, not the merged head ${merged.slice(0, 7)}`;
  let branchInUse = false;

  if (stacked.length) {
    problems.push(
      `PR ${prList(stacked)} is stacked on it: branch ${branch} kept, local and remote.`,
    );
  } else if (remoteHead && remoteHead !== merged) {
    problems.push(`${notMerged(`origin/${branch}`, remoteHead)}: kept, check its commits.`);
  } else if (remoteHead) {
    git(main.path, 'push', 'origin', '--delete', branch);
  }

  if (main.branch === branch) {
    // git switch main fails while another worktree has main checked out; only a clean
    // review worktree may be moved off it.
    const holders = others.filter((w) => w.branch === 'main');
    const stuck = holders.filter((w) => !isReviewWorktree(w.path) || dirty.has(w.path));
    for (const w of stuck) {
      const changes = dirty.has(w.path) ? ' (uncommitted changes)' : '';
      problems.push(`${w.path} has main checked out${changes}: main checkout left on ${branch}.`);
    }
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
    else if (w.head !== merged) {
      problems.push(`${notMerged(w.path, w.head)}: left on ${branch}, nothing done there.`);
      branchInUse = true;
    } else git(main.path, 'worktree', 'remove', w.path);
  }

  if (!localHead || branchInUse || stacked.length) return { steps, problems };
  if (localHead === merged) git(main.path, 'branch', '-D', branch);
  else problems.push(`${notMerged(`Local branch ${branch}`, localHead)}: kept, check its commits.`);
  return { steps, problems };
}

/**
 * A note when `step` failed with `message` only because its work is already done, else null.
 * GitHub deletes the head branch on merge, asynchronously: the ref can survive
 * `git fetch origin --prune` and be gone by the time the clean-up deletes it.
 */
export function alreadyDone(step, message) {
  const [verb, remote, flag, branch] = step.args;
  if (verb === 'push' && remote === 'origin' && flag === '--delete') {
    if (/remote ref does not exist/.test(message))
      return `remote branch ${branch} was already deleted (GitHub deletes it on merge).`;
  }
  return null;
}
