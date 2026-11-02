// Pure part of the UserPromptSubmit hook `.claude/hooks/review-pr-hint.mjs` (ADR-0017): which PR,
// if any, the Owner asked to review. Kept here so Vitest covers it (T-135).

// "PR #N", "PR N" or "pull request #N". A bare "#N" is not a PR: task, issue and merge prompts
// name issues that way next to "review" (DR-83).
const PR_REF = /(\bPR\b\s*#?\s*|\bpull request\s*#?\s*)(\d+)/gi;
const REVIEW = /\breview\b/gi;
// How far "review" may stand from the number, before or after it.
const NEAR = 40;
// A message of the auto-issues pipeline (.claude/skills/auto-issues §3, ADR-0001 M11) asks for a
// review only with a line that is just "review PR #<N>" (§3.2). Its other briefs and the Owner
// answers it forwards name REVIEW comments and review notes next to PRs (review #944).
const AUTO_ISSUES = '[auto-issues]';
const AUTO_REVIEW = /^review PR #(\d+)$/i;
// Blocks the app writes into a prompt, each up to its own closing tag: child session reports and
// the "Linked sessions now" note (system-reminder), background command ends (task-notification),
// side session events. They name REVIEW comments and session names like review-1 next to PRs
// (#952). A <cross-session-message> stays: the §3.2 brief reaches a review session that way.
const APP_BLOCK = /<(system-reminder|task-notification|side-sessions-event)\b[^>]*>[\s\S]*?<\/\1>/g;

/** The PR number the prompt asks to review, or null. */
export function reviewedPr(prompt) {
  // A line break in its place, so "review PR #N" stays a line of its own.
  const text = prompt.replace(APP_BLOCK, '\n');
  if (text.includes(AUTO_ISSUES)) {
    for (const line of text.split('\n')) {
      const asked = AUTO_REVIEW.exec(line.trim());
      if (asked) return Number(asked[1]);
    }
    return null;
  }
  const reviews = [...text.matchAll(REVIEW)].map((m) => ({
    start: m.index,
    end: m.index + m[0].length,
  }));
  if (!reviews.length) return null;
  for (const ref of text.matchAll(PR_REF)) {
    const start = ref.index;
    const end = start + ref[0].length;
    const near = reviews.some(
      (r) => (r.end <= start && start - r.end <= NEAR) || (end <= r.start && r.start - end <= NEAR),
    );
    if (near) return Number(ref[2]);
  }
  return null;
}
