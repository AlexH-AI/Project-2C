// Pure part of tools/auto-wait.mjs (T-335): reads what gh returned and says whether the wait is
// over, so the auto-issues pipeline (.claude/skills/auto-issues, ADR-0001 appendix M11) waits the
// same way every time. No I/O here: unit-tested in auto-wait-core.test.mjs.

import { prFiles, prList } from './pr-core.mjs';
import { checkCounts, checksSummary, latestReview } from './session-core.mjs';

/** Exit codes: done and good, done and bad, timed out, look at it, usage. */
export const EXIT = { done: 0, bad: 1, timeout: 2, look: 3, usage: 64 };

export const USAGE =
  'usage: node tools/auto-wait.mjs pr <issue> | ci <N> [--not <sha>] | review <N> [--sha <sha>] |' +
  ' title <text> | sleep   [--timeout <min> | --once] [--every <s>]';

// What each mode waits on: an Issue number, a PR number, a title text, nothing.
const TARGETS = { pr: 'issue', ci: 'PR', review: 'PR', title: 'text', sleep: null };
// SHA flags, each for one mode only; --timeout / --every go with every mode.
const SHA_FLAGS = { ci: '--not', review: '--sha' };
const LIMITS = { '--timeout': ['timeoutMin', 1, 120], '--every': ['everySec', 30, 600] };
const SHA = /^[0-9a-f]{7,40}$/;
// Failed reads in a row (gh down, no network) before the wait gives up.
const MAX_FAILURES = 5;

/** Options from the arguments after the script path, or `{ error }` for the usage line. */
export function parseArgs(argv) {
  const [mode, ...rest] = argv;
  if (!Object.hasOwn(TARGETS, mode ?? '')) return { error: `unknown mode "${mode ?? ''}"` };
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
    if (!Object.hasOwn(LIMITS, arg) && SHA_FLAGS[mode] !== arg) {
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

/**
 * CI on the PR's head: done once no check runs and every workflow run of the head ended, since a
 * job that `needs` another, like the exe build, gets its check only when that one ends. `runs()`
 * gives those runs (Actions API); it is called only once every check ended, so a wait does not
 * read them each poll. With `not`, first a head other than that SHA (a push after a fix). A
 * docs-only PR has no CI at all (ci.yml `paths`), so it is done at once.
 */
export function ciState(pr, { not = null, runs = () => [] } = {}) {
  const stop = notOpen(pr);
  if (stop) return stop;
  const head = short(pr.headRefOid);
  if (not && sameSha(pr.headRefOid, not)) {
    return { done: false, text: `head still ${head}: waiting for a push` };
  }
  const rollup = pr.statusCheckRollup ?? [];
  const { pass, fail, pending } = checkCounts(rollup);
  if (pass + fail + pending === 0) {
    return prFiles(pr).docsOnly
      ? { done: true, code: EXIT.done, text: `docs-only @${head}: CI not needed` }
      : { done: false, text: `no checks yet @${head}` };
  }
  if (pending > 0) return { done: false, text: `${checksSummary(rollup)} @${head}` };
  const running = runs()
    .filter((run) => run.status !== 'completed')
    .map((run) => run.name);
  if (running.length) {
    return {
      done: false,
      text: `${checksSummary(rollup)} @${head}, still running: ${running.join(', ')}`,
    };
  }
  if (fail > 0) {
    const failed = rollup
      .filter((c) => checkCounts([c]).fail === 1)
      .map((c) => c.name ?? c.context);
    return { done: true, code: EXIT.bad, text: `CI red @${head}: ${failed.join(', ')}` };
  }
  return { done: true, code: EXIT.done, text: `CI green @${head}: ${pass} pass` };
}

/** The latest REVIEW comment, once it names `sha` (default: the head). */
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
 * Reads `check` every `everyMs` until its verdict is done or `timeoutMs` runs out. The last sleep
 * ends at the deadline and one more read follows, so a read that takes time does not cut the wait
 * short. A read that throws (gh failed) is tried again; MAX_FAILURES in a row end the wait. With no
 * time at all (--once) a failed read is something to look at, not "not yet": the caller would take
 * it for a state. `now` and `sleep` are passed in, so tests run the loop without real time.
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
    await sleep(Math.min(everyMs, left));
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
