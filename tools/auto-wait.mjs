/* global process, setTimeout */
// Wait for the next thing the auto-issues pipeline needs (T-335; .claude/skills/auto-issues,
// ADR-0001 appendix M11). Its orchestrating session runs this in the background, so /goal does not
// judge the goal while a child session works, and reads one line when the wait is over:
//
//   node tools/auto-wait.mjs pr <issue>                an open PR closes the Issue
//   node tools/auto-wait.mjs ci <N> [--not <sha>]      CI finished on the PR's head; with --not,
//                         [--since <time>]             first a head other than that SHA (a push),
//                                                      the PR's branch on GitHub at another SHA for
//                                                      3 min while the head stays: exit 3 (a push
//                                                      GitHub missed); with --since, the checks of
//                                                      the PR's newest pull_request run made at or
//                                                      after that UTC time (a reopened PR),
//                                                      cancelled: exit 3
//   node tools/auto-wait.mjs review <N> [--sha <sha>]  the latest REVIEW names the head (or <sha>)
//   node tools/auto-wait.mjs title <text>              an open or merged PR whose title holds it
//   node tools/auto-wait.mjs sleep                     only the time
//
//   --timeout <min>  1 to 120, default 45        --every <s>  30 to 600, default 60
//   --once           one read, no waiting (exit 2 then means "not yet"): a state within a turn
//
// Exit 0 done and good (green / PASS / found), 1 done and bad (red / CHANGES), 2 timed out,
// 3 look at it (PR no longer open, several PRs close the Issue, five failed reads in a row, the
// run of a reopened PR cancelled, the PR's head stale behind its branch),
// 64 usage. The last stdout line is "AUTO-WAIT <mode> <target>: <result>". It polls GitHub, which
// the app asks sessions not to do for CI: the app sends no event when CI turns green or a REVIEW
// comment lands (ADR-0001 M11). Pure part: auto-wait-core.mjs.

import {
  EXIT,
  USAGE,
  ciState,
  heldFor,
  parseArgs,
  prForIssue,
  report,
  reviewState,
  titleState,
  waitFor,
} from './auto-wait-core.mjs';
import { loadPrFiles } from './pr-status.mjs';
import { run } from './session-io.mjs';

const gh = (args) => JSON.parse(run('gh', args, { timeout: 30000 }));

// What ciState / reviewState read. Not pr-status's loadPr: it also reads stacked PRs, the base CI
// tested and main's commits since, 5 + k gh calls a read where one does (review #944).
const PR_FIELDS = 'number,state,headRefOid,headRefName,statusCheckRollup,comments,changedFiles';

/** The PR as ciState / reviewState read it; ciState reads the files itself, when it needs them. */
const readPr = (number) => gh(['pr', 'view', String(number), '--json', PR_FIELDS]);

/**
 * The workflow runs of a commit: CI is over only when they all ended, and with --since the verdict
 * is that of the PR's own run (see ciState).
 */
const runsOf = (sha) =>
  gh([
    'api',
    `repos/{owner}/{repo}/actions/runs?head_sha=${sha}&per_page=100`,
    '--jq',
    '[.workflow_runs[] | {id, name, path, event, head_branch, status, conclusion, created_at}]',
  ]);

/**
 * The SHA of a branch on GitHub: ahead of the PR's head when GitHub missed a push (ciState). A
 * branch GitHub does not have fails with gh's "(HTTP 404)", which ciState takes for no news.
 */
const branchSha = (name) =>
  gh([
    'api',
    `repos/{owner}/{repo}/git/ref/heads/${name.split('/').map(encodeURIComponent).join('/')}`,
  ]).object.sha;

// Since when this wait has seen the PR's branch at the SHA it reads now.
const branchHeld = heldFor(Date.now);

// One read of GitHub per mode.
const READS = {
  pr: ({ target }) =>
    prForIssue(
      gh([
        'pr',
        'list',
        '--state',
        'open',
        '--limit',
        '100',
        '--json',
        'number,headRefOid,closingIssuesReferences',
      ]),
      target,
    ),
  ci: ({ target, not, since }) => {
    const pr = readPr(target);
    return ciState(pr, {
      not,
      since,
      runs: () => runsOf(pr.headRefOid),
      // Every file, as pr-status reads them, so docs-only is decided the same way there.
      files: () => loadPrFiles(target),
      branch: () => {
        const sha = branchSha(pr.headRefName);
        return { sha, forMs: branchHeld(sha) };
      },
    });
  },
  review: ({ target, sha }) => reviewState(readPr(target), { sha }),
  title: ({ target }) =>
    titleState(
      gh([
        'pr',
        'list',
        '--state',
        'all',
        '--limit',
        '30',
        '--search',
        `${target} in:title`,
        '--json',
        'number,state,title',
      ]),
      target,
    ),
};

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const options = parseArgs(process.argv.slice(2));
if (options.error) {
  process.stderr.write(`${options.error}\n${USAGE}\n`);
  process.exit(EXIT.usage);
}

const timeoutMs = options.timeoutMin * 60000;
const verdict =
  options.mode === 'sleep'
    ? await pause(timeoutMs).then(() => ({
        text: `${options.timeoutMin} min passed`,
        code: EXIT.done,
      }))
    : await waitFor(() => READS[options.mode](options), {
        timeoutMs,
        everyMs: options.everySec * 1000,
        now: Date.now,
        sleep: pause,
      });
process.stdout.write(`${report(options, verdict)}\n`);
process.exit(verdict.code);
