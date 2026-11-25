// Pure part of tools/auto-wait.mjs (T-335): reads what gh returned and says whether the wait is
// over, so the auto-issues pipeline (.claude/skills/auto-issues, ADR-0001 appendix M11) waits the
// same way every time. No I/O here: unit-tested in auto-wait-core.test.mjs.

import { prFiles, prList } from './pr-core.mjs';
import { REVIEWERS, checkCounts, checksSummary, latestReview } from './session-core.mjs';

/** Exit codes: done and good, done and bad, timed out, look at it, usage. */
export const EXIT = { done: 0, bad: 1, timeout: 2, look: 3, usage: 64 };

export const USAGE =
  'usage: node tools/auto-wait.mjs pr <issue> | ci <N> [--not <sha>] [--since <time>] |' +
  ' fix <N> --not <sha> | review <N> [--sha <sha>] | title <text> | sleep' +
  '   [--timeout <min> | --once] [--every <s>]';

// What each mode waits on: an Issue number, a PR number, a title text, nothing.
const TARGETS = { pr: 'issue', ci: 'PR', fix: 'PR', review: 'PR', title: 'text', sleep: null };
// Flags of one mode only: --not / --sha take a SHA, --since a time. --timeout / --every go with
// every mode. fix cannot do without its --not.
const MODE_FLAGS = { ci: ['--not', '--since'], fix: ['--not'], review: ['--sha'] };

// The first line of the comment that asks a clean session to review the same head again, once
// the coding session had nothing but the PR body to change, or the Owner overruled what blocked
// (ADR-0001 M15, auto-issues §3.4, §5): `XIN XEM LẠI: head \`<sha7>\` …`. It does not open with
// "REVIEW", so nothing that reads REVIEW comments takes it for one.
export const REVIEW_AGAIN = 'XIN XEM LẠI:';
const LIMITS = { '--timeout': ['timeoutMin', 1, 120], '--every': ['everySec', 30, 600] };
// Reads of GitHub stay at least this far apart (#942), the last one before the deadline too.
const MIN_EVERY_MS = LIMITS['--every'][1] * 1000;
const SHA = /^[0-9a-f]{7,40}$/;
// A UTC time as GitHub gives it, e.g. a PR's closedAt.
const TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
// Date.parse rolls a day or hour that does not exist over (30/02 → 02/03, 24:00 → 00:00 the next
// day), so the time must read back the same.
const isTime = (value) => {
  if (!TIME.test(value)) return false;
  const time = new Date(value);
  return !Number.isNaN(time.getTime()) && time.toISOString().slice(0, 19) === value.slice(0, 19);
};
// Failed reads in a row (gh down, no network) before the wait gives up.
const MAX_FAILURES = 5;
// GitHub can miss a push's `synchronize` event: the branch moves on, the PR's head and its CI stay
// behind (PR #1070). A branch at another SHA this long is that, not a push GitHub is still taking.
export const STALE_HEAD_MS = 3 * 60000;

/** Options from the arguments after the script path, or `{ error }` for the usage line. */
export function parseArgs(argv) {
  const [mode, ...rest] = argv;
  if (!Object.hasOwn(TARGETS, mode ?? '')) return { error: `unknown mode "${mode ?? ''}"` };
  // `since` is there only when given.
  const options = { mode, target: null, timeoutMin: 45, everySec: 60, not: null, sha: null };
  const positional = [];
  const flags = new Set();
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    flags.add(arg);
    // One read, no waiting: how the orchestrating session reads a state within a turn.
    if (arg === '--once' && mode !== 'sleep') continue;
    if (!Object.hasOwn(LIMITS, arg) && !(MODE_FLAGS[mode] ?? []).includes(arg)) {
      return { error: `${mode} does not take ${arg}` };
    }
    const value = rest[++i];
    if (value === undefined) return { error: `${arg} needs a value` };
    if (Object.hasOwn(LIMITS, arg)) {
      const [key, min, max] = LIMITS[arg];
      const number = Number(value);
      if (!Number.isInteger(number) || number < min || number > max) {
        return { error: `${arg} takes a whole number from ${min} to ${max}` };
      }
      options[key] = number;
    } else if (arg === '--since') {
      if (!isTime(value)) {
        return { error: `${arg} takes a UTC time like 2026-11-02T10:56:33Z` };
      }
      options.since = value;
    } else {
      const sha = value.toLowerCase();
      if (!SHA.test(sha)) return { error: `${arg} takes a commit SHA (7 to 40 hex digits)` };
      options[arg.slice(2)] = sha;
    }
  }
  if (flags.has('--once')) {
    if (flags.has('--timeout')) return { error: '--once and --timeout do not go together' };
    options.timeoutMin = 0;
  }
  if (mode === 'fix' && options.not === null) return { error: 'fix needs --not <sha>' };
  const kind = TARGETS[mode];
  if (kind === null) {
    return positional.length ? { error: `sleep takes no "${positional[0]}"` } : options;
  }
  if (positional.length !== 1) return { error: `${mode} takes one ${kind}` };
  const [value] = positional;
  if (kind === 'text') {
    if (value.trim() === '') return { error: 'title takes a text that is not blank' };
    options.target = value;
  } else {
    if (!/^[1-9]\d*$/.test(value)) return { error: `${mode} takes the ${kind} number` };
    options.target = Number(value);
  }
  return options;
}

const short = (sha) => sha.slice(0, 7);
// A REVIEW comment names 7 or more digits of a SHA, gh gives all 40: one is a prefix of the other.
const sameSha = (a, b) => a.startsWith(b) || b.startsWith(a);
const notOpen = (pr) =>
  pr.state === 'OPEN'
    ? null
    : { done: true, code: EXIT.look, text: `PR #${pr.number} is ${pr.state}` };

// The run a check belongs to, from its details URL (…/actions/runs/<id>/job/<job>).
const runOf = (check) => /\/actions\/runs\/(\d+)\//.exec(check.detailsUrl ?? '')?.[1] ?? null;
// How a run of the PR ends with a verdict on the code; any other end (cancelled, startup_failure…)
// says nothing of it.
const VERDICTS = ['success', 'failure'];

/**
 * What `branch()` gives, or null when GitHub has no such branch (404: a PR from a fork, say): that
 * tells nothing of a push, so the wait goes on as before PR #1104. Any other failed read (no
 * network, gh down) is thrown, for waitFor to count.
 */
function readBranch(branch) {
  try {
    return branch();
  } catch (error) {
    if (/\(HTTP 404\)/.test(error.message)) return null;
    throw error;
  }
}

/** The names of the red checks, as "Verify, e2e". */
const failedNames = (checks) =>
  checks
    .filter((c) => checkCounts([c]).fail === 1)
    .map((c) => c.name ?? c.context)
    .join(', ');

/**
 * While the PR's head is still the one a fix is waited past: `branch()` gives the SHA of the PR's
 * branch on GitHub and how long this wait has seen it there, and a branch at another SHA for
 * STALE_HEAD_MS is a push GitHub missed: something to look at, since the PR's head and CI will not
 * move until the PR is reopened (PR #1070). A branch GitHub does not have (404) is waited on as a
 * push (readBranch). `what` names what the wait is for.
 */
function awaitPush(pr, branch, what) {
  const head = short(pr.headRefOid);
  const moved = readBranch(branch);
  if (!moved || sameSha(moved.sha, pr.headRefOid)) {
    return { done: false, text: `head still ${head}: waiting for ${what}` };
  }
  const at = short(moved.sha);
  return moved.forMs >= STALE_HEAD_MS
    ? {
        done: true,
        code: EXIT.look,
        text: `PR head stale: branch at ${at}, head still ${head} (GitHub missed the push)`,
      }
    : { done: false, text: `head still ${head}, branch at ${at}: waiting for the PR to follow` };
}

// A first line "XIN XEM LẠI: … head `<sha>` …"; the body is read in NFC, so the accents match
// however the comment was typed.
const AGAIN_LINE = new RegExp(`^${REVIEW_AGAIN}.*\\bhead \`([0-9a-f]{7,40})\``, 'u');

/**
 * True when a XIN XEM LẠI for `sha` by someone with write access came after the latest REVIEW
 * (any head) by such a person: the review of that head is to be done again in a clean session.
 * gh lists comments oldest first.
 */
function askedAgain(comments, sha) {
  let review = -1;
  let asked = -1;
  comments.forEach((c, i) => {
    if (!REVIEWERS.has(c.authorAssociation)) return;
    const first = c.body.normalize('NFC').split('\n')[0];
    if (first.startsWith('REVIEW:')) review = i;
    const named = AGAIN_LINE.exec(first)?.[1];
    if (named && sameSha(named, sha)) asked = i;
  });
  return asked > review;
}

// The workflow whose runs are CI's. macos.yml makes a pull_request run too, for every push and
// label of every PR (its job skipped without build-mac): never CI's verdict (T-428).
const CI_WORKFLOW = '.github/workflows/ci.yml';

/** The newest `pull_request` run of CI on the PR's branch (made at or after `since`), or null. */
function newestRunOfPr(pr, all, since) {
  return all
    .filter(
      (run) =>
        run.path === CI_WORKFLOW &&
        run.event === 'pull_request' &&
        run.head_branch === pr.headRefName &&
        (since === null || Date.parse(run.created_at) >= Date.parse(since)),
    )
    .reduce((a, b) => (a && Date.parse(a.created_at) >= Date.parse(b.created_at) ? a : b), null);
}

/**
 * CI on the PR's head: done once no check runs and every workflow run of the head ended, since a
 * job that `needs` another, like the exe build, gets its check only when that one ends; red as
 * soon as one check of the head is red, without `since` (ADR-0001 M15). `runs()`
 * gives those runs (Actions API); it is called only once every check ended, so a wait does not
 * read them each poll. With `not`, first a head other than that SHA (a push after a fix), the
 * stale branch read as awaitPush says. With
 * `since`, the verdict is that of the newest `pull_request` run of the PR's branch made at or after
 * that time, read from its own checks: after `gh pr close` + `gh pr reopen` the head keeps its old
 * checks, all ended, until GitHub makes the new run, and a run of another event (workflow_dispatch)
 * or one cancelled says nothing of the reopened PR (DR6-176). A run that failed is red even with no
 * red check of it on the head yet: waiting for one could last until the timeout (T-373). Without
 * `since`, the checks read stay all of the head's, and that run is the newest `pull_request` run of
 * the PR's branch, not any run of the head: a `push` run that failed there says nothing of the PR
 * (T-378). Either way only a run of CI counts, never one of macos.yml (T-428). A docs-only PR has
 * no CI at all (ci.yml `paths`), so it is done at once; `files()` gives
 * the PR's files to tell, and is called only while CI has no check.
 */
export function ciState(
  pr,
  { not = null, since = null, runs = () => [], files = () => [], branch = () => null } = {},
) {
  const stop = notOpen(pr);
  if (stop) return stop;
  const head = short(pr.headRefOid);
  if (not && sameSha(pr.headRefOid, not)) return awaitPush(pr, branch, 'a push');
  const rollup = pr.statusCheckRollup ?? [];
  const { pass, fail, pending } = checkCounts(rollup);
  if (pass + fail + pending === 0) {
    return prFiles({ ...pr, files: files() }).docsOnly
      ? { done: true, code: EXIT.done, text: `docs-only @${head}: CI not needed` }
      : { done: false, text: `no checks yet @${head}` };
  }
  // Without since every check of the head is the PR's: one red check and the head can no longer
  // merge (merge-pr), so the checks and jobs still to come are not waited for. The review runs
  // beside CI, and the fix of both goes in one push (ADR-0001 M15).
  if (fail > 0 && !since) {
    const still = pending > 0 ? `; ${pending} still running` : '';
    return { done: true, code: EXIT.bad, text: `CI red @${head}: ${failedNames(rollup)}${still}` };
  }
  if (pending > 0) return { done: false, text: `${checksSummary(rollup)} @${head}` };
  const all = runs();
  // Without since it only sets the floor below: the checks read and the other ends stay as before.
  const newest = newestRunOfPr(pr, all, since);
  const own = since ? newest : null;
  if (since && !own) {
    return {
      done: false,
      text: `${checksSummary(rollup)} @${head}, no pull_request run of PR #${pr.number} since ${since} yet`,
    };
  }
  const running = all.filter((run) => run.status !== 'completed').map((run) => run.name);
  if (running.length) {
    return {
      done: false,
      text: `${checksSummary(rollup)} @${head}, still running: ${running.join(', ')}`,
    };
  }
  let checks = rollup;
  if (own) {
    if (!VERDICTS.includes(own.conclusion)) {
      return {
        done: true,
        code: EXIT.look,
        text: `CI run ${own.id} of PR #${pr.number} ended ${own.conclusion} @${head}`,
      };
    }
    checks = rollup.filter((c) => runOf(c) === String(own.id));
  }
  if (checkCounts(checks).fail > 0) {
    return { done: true, code: EXIT.bad, text: `CI red @${head}: ${failedNames(checks)}` };
  }
  // The rollup is read before the runs, so it may not show a red check of a run that failed yet.
  if (newest?.conclusion === 'failure') {
    return {
      done: true,
      code: EXIT.bad,
      text: `CI red @${head}: run ${newest.id} failed, no red check of it yet`,
    };
  }
  if (own && checks.length === 0) {
    return {
      done: false,
      text: `${checksSummary(rollup)} @${head}, no check of run ${own.id} yet`,
    };
  }
  return {
    done: true,
    code: EXIT.done,
    text: `CI green @${head}: ${checkCounts(checks).pass} pass`,
  };
}

/**
 * What a coding session sent back after a fix (CI red, REVIEW: CHANGES, main ahead, an Owner
 * answer): a head other than `not` (a push), or, on that head, a XIN XEM LẠI after its latest
 * REVIEW (nothing but the PR body had to change). Either way the head is to be reviewed in a clean
 * session, beside CI (ADR-0001 M15). While neither came, a head stale behind its branch is
 * something to look at, as with `ci --not` (awaitPush).
 */
export function fixState(pr, { not, branch = () => null }) {
  const stop = notOpen(pr);
  if (stop) return stop;
  const head = short(pr.headRefOid);
  if (!sameSha(pr.headRefOid, not)) {
    return { done: true, code: EXIT.done, text: `head moved past ${short(not)} to ${head}` };
  }
  if (askedAgain(pr.comments ?? [], pr.headRefOid)) {
    return { done: true, code: EXIT.done, text: `XIN XEM LẠI @${head}: review the same head` };
  }
  return awaitPush(pr, branch, 'a push or XIN XEM LẠI');
}

/**
 * The latest REVIEW comment, once it names `sha` (default: the head) and no XIN XEM LẠI for that
 * head came after it (askedAgain).
 */
export function reviewState(pr, { sha = null } = {}) {
  const stop = notOpen(pr);
  if (stop) return stop;
  const target = sha ?? pr.headRefOid;
  const review = latestReview(pr.comments ?? []);
  if (!review) return { done: false, text: 'no REVIEW yet' };
  if (!review.sha || !sameSha(review.sha, target)) {
    return {
      done: false,
      text: `latest REVIEW is for ${review.sha ?? 'no head'}, waiting for ${short(target)}`,
    };
  }
  if (askedAgain(pr.comments, target)) {
    return {
      done: false,
      text: `XIN XEM LẠI @${short(target)} after the latest REVIEW: waiting for a new one`,
    };
  }
  const level = review.level ? `, level ${review.level}` : '';
  const text = `REVIEW ${review.verdict} @${review.sha}${level}`;
  if (/^PASS\b/.test(review.verdict)) return { done: true, code: EXIT.done, text };
  if (/^CHANGES\b/.test(review.verdict)) return { done: true, code: EXIT.bad, text };
  return { done: true, code: EXIT.look, text };
}

/** The open PR that closes `issue`, from `gh pr list --json closingIssuesReferences`. */
export function prForIssue(prs, issue) {
  const found = prs.filter((p) =>
    (p.closingIssuesReferences ?? []).some((ref) => ref.number === issue),
  );
  if (found.length === 0) return { done: false, text: `no open PR closes #${issue} yet` };
  if (found.length > 1) {
    const numbers = found.map((p) => p.number).sort((a, b) => a - b);
    return {
      done: true,
      code: EXIT.look,
      text: `several open PRs close #${issue}: ${prList(numbers)}`,
    };
  }
  const [p] = found;
  return {
    done: true,
    code: EXIT.done,
    text: `PR #${p.number} @${short(p.headRefOid)} closes #${issue}`,
  };
}

const WORD = /[\p{L}\p{N}]/u;
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** `text` anywhere in a title, any case, but not glued to a longer word: "PR 939" is not "PR 9390". */
function titleRegExp(text) {
  const before = WORD.test(text[0]) ? '(?<![\\p{L}\\p{N}])' : '';
  const after = WORD.test(text.at(-1)) ? '(?![\\p{L}\\p{N}])' : '';
  return new RegExp(`${before}${escape(text)}${after}`, 'iu');
}

/** The newest open or merged PR whose title holds `text`; one closed unmerged does not count. */
export function titleState(prs, text) {
  const pattern = titleRegExp(text.trim());
  const found = prs
    .filter((p) => p.state !== 'CLOSED' && pattern.test(p.title))
    .sort((a, b) => b.number - a.number);
  if (found.length === 0) return { done: false, text: `no open or merged PR titled "${text}" yet` };
  const [p] = found;
  return { done: true, code: EXIT.done, text: `PR #${p.number} (${p.state}): ${p.title}` };
}

/**
 * How long a value has stayed the same over the reads of one wait: the ms since the first read that
 * gave it, 0 again once it changes. A branch pushed before the wait began counts from the wait's
 * first read, so it is never taken for older than it may be.
 */
export function heldFor(now) {
  let held = null;
  return (value) => {
    if (held?.value !== value) held = { value, at: now() };
    return now() - held.at;
  };
}

/**
 * Reads `check` every `everyMs` until its verdict is done or `timeoutMs` runs out. The last sleep
 * ends at the deadline and one more read follows, so a read that takes time does not cut the wait
 * short; that sleep is never under MIN_EVERY_MS, so the last read may come up to 30 s after the
 * deadline. A read that throws (gh failed) is tried again; MAX_FAILURES in a row end the wait. With
 * no time at all (--once) a failed read is something to look at, not "not yet": the caller would
 * take it for a state. `now` and `sleep` are passed in, so tests run the loop without real time.
 */
export async function waitFor(check, { timeoutMs, everyMs, now, sleep }) {
  const end = now() + timeoutMs;
  let failures = 0;
  let last; // what the latest read said; every pass of the loop sets it before the time check
  for (;;) {
    try {
      const verdict = await check();
      if (verdict.done) return verdict;
      failures = 0;
      last = verdict.text;
    } catch (error) {
      failures += 1;
      last = `read failed: ${error.message}`;
      if (timeoutMs === 0) return { done: true, code: EXIT.look, text: last };
      if (failures === MAX_FAILURES) {
        return {
          done: true,
          code: EXIT.look,
          text: `${failures} reads failed in a row; last: ${error.message}`,
        };
      }
    }
    const left = end - now();
    if (left <= 0) {
      const why = timeoutMs === 0 ? 'not yet' : `timed out after ${timeoutMs / 60000} min; last`;
      return { done: true, code: EXIT.timeout, text: `${why}: ${last}` };
    }
    await sleep(Math.min(everyMs, Math.max(left, MIN_EVERY_MS)));
  }
}

/**
 * The one line the orchestrating session reads: "AUTO-WAIT <mode> <target>: <result>". Line breaks
 * become spaces, since a gh error can run over several lines (no network) and the session reads
 * the last line of stdout.
 */
export function report(options, verdict) {
  const { mode, target } = options;
  let named = '';
  if (typeof target === 'number') named = ` #${target}`;
  else if (target !== null) named = ` "${target}"`;
  return `AUTO-WAIT ${mode}${named}: ${verdict.text}`.replace(/\s+/g, ' ').trim();
}
