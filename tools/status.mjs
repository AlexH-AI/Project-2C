/* global process */
// Session status generated from GitHub and git, so HANDOFF never has to copy it:
// open PRs (head, latest REVIEW verdict and its SHA, CI), open issues of the open
// milestone, worktrees. Called by tools/session-start.ps1 (ADR-0003 appendix, #283).

import { checksSummary, latestReview } from './session-core.mjs';
import { run as runIn } from './session-io.mjs';

const run = (cmd, args) => runIn(cmd, args, { timeout: 30000 });

const labels = (item) => {
  const names = item.labels.map((l) => l.name).filter((n) => n !== 'type:task');
  return names.length ? ` [${names.join(', ')}]` : '';
};

function section(title, fn) {
  process.stdout.write(`\n== ${title}\n`);
  try {
    fn();
  } catch (error) {
    process.stdout.write(`WARNING: ${error.message}\n`);
  }
}

section('open pull requests', () => {
  const fields = 'number,title,headRefOid,isDraft,labels,comments,statusCheckRollup';
  const prs = JSON.parse(run('gh', ['pr', 'list', '--state', 'open', '--json', fields]));
  if (prs.length === 0) process.stdout.write('(none)\n');
  for (const pr of prs) {
    const head = pr.headRefOid.slice(0, 7);
    const review = latestReview(pr.comments);
    let reviewText = 'no REVIEW yet';
    if (review) {
      const stale = review.sha && !pr.headRefOid.startsWith(review.sha);
      reviewText = `REVIEW ${review.verdict}${review.sha ? ` @${review.sha}` : ''}`;
      if (stale) reviewText += ' (not the head: review again before merge)';
    }
    const draft = pr.isDraft ? ' (draft)' : '';
    process.stdout.write(
      `#${pr.number}${draft} ${pr.title}${labels(pr)}\n` +
        `    head ${head} · ${reviewText} · ${checksSummary(pr.statusCheckRollup ?? [])}\n`,
    );
  }
});

const milestone = (() => {
  try {
    const json = run('gh', ['api', 'repos/{owner}/{repo}/milestones?state=open']);
    return JSON.parse(json).sort((a, b) => a.number - b.number)[0]?.title ?? null;
  } catch {
    return null;
  }
})();

section(`open issues${milestone ? `: ${milestone}` : ''}`, () => {
  if (!milestone) throw new Error('no open milestone (or GitHub unreachable)');
  const json = run('gh', [
    'issue',
    'list',
    '--milestone',
    milestone,
    '--state',
    'open',
    '--limit',
    '60',
    '--json',
    'number,title,labels',
  ]);
  const issues = JSON.parse(json).sort((a, b) => a.number - b.number);
  if (issues.length === 0) process.stdout.write('(none)\n');
  for (const issue of issues)
    process.stdout.write(`#${issue.number} ${issue.title}${labels(issue)}\n`);
});

section('worktrees', () => {
  process.stdout.write(run('git', ['worktree', 'list']));
});
