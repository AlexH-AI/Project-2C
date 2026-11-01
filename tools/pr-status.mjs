/* global process */
// One PR's merge-relevant state, instead of hand-written `gh … --jq` (#288):
//
//   node tools/pr-status.mjs <N>
//
// head SHA, base (stacked or not), labels, latest REVIEW and the SHA it names, CI and the base
// it tested, PRs stacked on this branch, docs-only or not, and what tools/merge-pr.mjs would say.

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  mergeBlockers,
  prFiles,
  prList,
  riskLevel,
  testedBaseOf,
  verifyRunId,
} from './pr-core.mjs';
import { checksSummary, latestReview } from './session-core.mjs';
import { run as runIn } from './session-io.mjs';

const ghText = (args) => runIn('gh', args, { timeout: 30000 });
const gh = (args) => JSON.parse(ghText(args));
/** Every page of a REST list, one value per line as `jq` prints it. */
const ghLines = (path, jq) =>
  ghText(['api', '--paginate', path, '--jq', jq]).split(/\r?\n/).filter(Boolean);
// A renamed file under its old path too, as notes-for reads it: code renamed to docs/ is code.
const NAMES = '.filename, (.previous_filename // empty)';

// `files` comes from REST instead: `gh pr view --json files` gives the first 100 only (DR6-57).
const FIELDS = [
  'number',
  'title',
  'state',
  'isDraft',
  'baseRefName',
  'headRefName',
  'headRefOid',
  'labels',
  'comments',
  'statusCheckRollup',
  'changedFiles',
  'url',
].join(',');

/** The SHA of the base the head's Verify run tested (its TESTED_BASE notice), null when none. */
function loadTestedBase(pr) {
  const id = verifyRunId(pr.statusCheckRollup ?? []);
  if (pr.state !== 'OPEN' || id === null) return null;
  const annotations = `repos/{owner}/{repo}/check-runs/${id}/annotations`;
  return testedBaseOf(gh(['api', '--paginate', '--slurp', annotations]).flat());
}

/**
 * The base's commits since the one CI tested, with their files, and how many GitHub counts
 * (DR-80, DR6-57). Paged: without it GitHub lists the newest 250 commits only (DR6-85).
 */
function loadMainSince(pr, tested) {
  if (pr.state !== 'OPEN' || tested === null) return { mainSince: [], mainTotal: 0 };
  const compare = `repos/{owner}/{repo}/compare/${tested}...${pr.baseRefName}?per_page=100`;
  const pages = ghLines(compare, '{total: .total_commits, shas: [.commits[].sha]}').map((page) =>
    JSON.parse(page),
  );
  return {
    mainSince: pages
      .flatMap((page) => page.shas)
      .map((sha) => ({
        sha,
        files: ghLines(`repos/{owner}/{repo}/commits/${sha}`, `.files[] | ${NAMES}`),
      })),
    mainTotal: pages[0]?.total ?? null,
  };
}

/**
 * Every file of the PR: one entry per file, as `changedFiles` counts them, a renamed one with its
 * old path. Also read by tools/auto-wait.mjs, so docs-only is decided the same way there.
 */
export const loadPrFiles = (number) =>
  ghLines(
    `repos/{owner}/{repo}/pulls/${number}/files?per_page=100`,
    '.[] | {path: .filename, previousPath: .previous_filename}',
  ).map((line) => JSON.parse(line));

/**
 * The PR with all its files, plus what the merge rules need from elsewhere: stacked PRs, merged
 * base, the base CI tested, the base's commits since and how many GitHub counts.
 */
export function loadPr(number) {
  const pr = gh(['pr', 'view', String(number), '--json', FIELDS]);
  // Two reads (#642): a push between them that changes the number of files shows as "Read n of the
  // m files" and blocks (run again); any other push is caught by the merge, pinned to this head.
  pr.files = loadPrFiles(number);
  const stacked = gh([
    'pr',
    'list',
    '--state',
    'open',
    '--base',
    pr.headRefName,
    '--json',
    'number',
  ])
    .map((p) => p.number)
    .sort((a, b) => a - b);
  const baseMerged =
    pr.baseRefName === 'main'
      ? null
      : gh(['pr', 'list', '--state', 'merged', '--head', pr.baseRefName, '--json', 'number'])
          .length > 0;
  const testedBase = loadTestedBase(pr);
  return { pr, stacked, baseMerged, testedBase, ...loadMainSince(pr, testedBase) };
}

/** mergeBlockers of loadPr's result, so pr-status and merge-pr pass it everything it read. */
export const loadedBlockers = (loaded, { owner, mode }) =>
  mergeBlockers(loaded.pr, { ...loaded, owner, mode });

/**
 * Status lines of loadPr's result; `withVerdict` adds what merge-pr would say under risk:low
 * rules.
 */
export function formatStatus(loaded, { withVerdict = true } = {}) {
  const { pr, stacked, baseMerged, testedBase, mainSince, mainTotal } = loaded;
  const head = pr.headRefOid.slice(0, 7);
  const review = latestReview(pr.comments);
  const { docsOnly, notesOnly } = prFiles(pr);
  let reviewText = 'none yet';
  if (review) {
    reviewText = `${review.verdict}${review.sha ? ` @${review.sha}` : ' (no SHA)'}`;
    if (review.level) reviewText += `, level ${review.level}`;
    if (review.sha && !notesOnly) {
      reviewText += pr.headRefOid.startsWith(review.sha)
        ? ' (= head)'
        : ' (NOT the head: review again before merge)';
    }
  }
  if (notesOnly) reviewText += ' (review notes only: not needed)';
  const base =
    pr.baseRefName === 'main'
      ? 'main'
      : `${pr.baseRefName} (stacked; base ${baseMerged ? 'merged: retarget to main' : 'not merged yet'})`;
  const labels = pr.labels.map((l) => l.name).join(', ') || '(none)';
  // As mergeBlockers reads it: a page listing a commit main got after the first page is no gap.
  const short = !Number.isInteger(mainTotal) || mainSince.length < mainTotal;
  const read = short ? `, only ${mainSince.length} read` : '';
  const tested = testedBase
    ? `${pr.baseRefName} ${testedBase.slice(0, 7)}, ${mainTotal ?? '?'} commit(s) on it since${read}`
    : 'not noted';
  const blockers = loadedBlockers(loaded, { owner: false, mode: 'squash' });
  const verdict = blockers.length
    ? `blocked (risk:low rules, --squash):\n${blockers.map((b) => `    - ${b}`).join('\n')}`
    : 'ready: node tools/merge-pr.mjs ' + pr.number;
  return [
    `PR #${pr.number} ${pr.title}${pr.isDraft ? ' (draft)' : ''} · ${pr.state}`,
    `  url      ${pr.url}`,
    `  branch   ${pr.headRefName} -> ${base}`,
    `  head     ${head}`,
    `  labels   ${labels} · risk ${riskLevel(pr.labels, review) ?? 'unknown'}`,
    `  review   ${reviewText}`,
    `  ci       ${checksSummary(pr.statusCheckRollup ?? [])}${docsOnly ? ' (docs-only: CI not needed)' : ''}`,
    `  tested   ${tested}`,
    `  files    ${pr.changedFiles} changed, ${pr.files.length} read · docs-only ${docsOnly ? 'yes' : 'no'}`,
    `  stacked  ${stacked.length ? prList(stacked) + ' based on this branch' : 'none on this branch'}`,
    ...(withVerdict ? [`  merge    ${verdict}`] : []),
  ].join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const number = process.argv[2];
  if (!/^\d+$/.test(number ?? '')) {
    process.stderr.write('Usage: node tools/pr-status.mjs <PR number>\n');
    process.exit(2);
  }
  try {
    process.stdout.write(`${formatStatus(loadPr(number))}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}
