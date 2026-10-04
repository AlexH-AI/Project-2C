// Pure part of the UserPromptSubmit hook `.claude/hooks/review-pr-hint.mjs` (ADR-0017): which PR,
// if any, the Owner asked to review. Kept here so Vitest covers it (T-135).

// "PR #N", "PR N", "pull request #N" or a bare "#N".
const PR_REF = /(\bPR\b\s*#?\s*|\bpull request\s*#?\s*|#)(\d+)/gi;
const REVIEW = /\breview\b/gi;
// How far "review" may stand from the number, before or after it.
const NEAR = 40;
// A bare "#N" right after "issue" names an issue: closing-phase prompts carry both "review" and
// "issue #N" (seen at the Phase 4 closing review).
const AFTER_ISSUE = /\bissue\s*$/i;

/** The PR number the prompt asks to review, or null. */
export function reviewedPr(prompt) {
  const reviews = [...prompt.matchAll(REVIEW)].map((m) => ({
    start: m.index,
    end: m.index + m[0].length,
  }));
  if (!reviews.length) return null;
  for (const ref of prompt.matchAll(PR_REF)) {
    const start = ref.index;
    const end = start + ref[0].length;
    if (ref[1] === '#' && AFTER_ISSUE.test(prompt.slice(0, start))) continue;
    const near = reviews.some(
      (r) => (r.end <= start && start - r.end <= NEAR) || (end <= r.start && r.start - end <= NEAR),
    );
    if (near) return Number(ref[2]);
  }
  return null;
}
