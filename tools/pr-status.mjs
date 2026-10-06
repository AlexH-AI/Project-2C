/* global process */
// One PR's merge-relevant state, instead of hand-written `gh … --jq` (#288):
//
//   node tools/pr-status.mjs <N>
//
// head SHA, base (stacked or not), labels, latest REVIEW and the SHA it names, CI,
// PRs stacked on this branch, docs-only or not, and what tools/merge-pr.mjs would say.

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ciStartedAt, isDocsOnly, mergeBlockers, prList, riskLevel } from './pr-core.mjs';
import { checksSummary, latestReview } from './session-core.mjs';
import { run as runIn } from './session-io.mjs';

const gh = (args) => JSON.parse(runIn('gh', args, { timeout: 30000 }));

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
  'files',
  'url',
].join(',');

/**
 * The base's commits not in the PR head that landed after its CI started, with their files
 * (DR-80). Older ones were in what CI tested, so their files are not fetched.
 */
function loadMainSince(pr) {
  const started = ciStartedAt(pr.statusCheckRollup ?? []);
  if (pr.state !== 'OPEN' || !started) return [];
  const compare = `repos/{owner}/{repo}/compare/${pr.headRefOid}...${pr.baseRefName}`;
  return gh(['api', compare, '--jq', '[.commits[] | {sha, date: .commit.committer.date}]'])
    .filter((c) => Date.parse(c.date) > Date.parse(started))
    .map((c) => ({
      ...c,
      files: gh(['api', `repos/{owner}/{repo}/commits/${c.sha}`, '--jq', '[.files[].filename]']),
    }));
}

/** The PR plus what the merge rules need from elsewhere: stacked PRs, merged base, newer base. */
export function loadPr(number) {
  const pr = gh(['pr', 'view', String(number), '--json', FIELDS]);
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
  return { pr, stacked, baseMerged, mainSince: loadMainSince(pr) };
}

/** Status lines; `withVerdict` adds what merge-pr would say under risk:low rules. */
export function formatStatus({ pr, stacked, baseMerged, mainSince }, { withVerdict = true } = {}) {
  const head = pr.headRefOid.slice(0, 7);
  const review = latestReview(pr.comments);
  let reviewText = 'none yet';
  if (review) {
    reviewText = `${review.verdict}${review.sha ? ` @${review.sha}` : ' (no SHA)'}`;
    if (review.level) reviewText += `, level ${review.level}`;
    if (review.sha) {
      reviewText += pr.headRefOid.startsWith(review.sha)
        ? ' (= head)'
        : ' (NOT the head: review again before merge)';
    }
  }
  const docsOnly = isDocsOnly(pr.files.map((f) => f.path));
  const base =
    pr.baseRefName === 'main'
      ? 'main'
      : `${pr.baseRefName} (stacked; base ${baseMerged ? 'merged: retarget to main' : 'not merged yet'})`;
  const labels = pr.labels.map((l) => l.name).join(', ') || '(none)';
  const blockers = mergeBlockers(pr, {
    owner: false,
    mode: 'squash',
    stacked,
    baseMerged,
    mainSince,
  });
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
    `  files    ${pr.files.length} changed · docs-only ${docsOnly ? 'yes' : 'no'}`,
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
