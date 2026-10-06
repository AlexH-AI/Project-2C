// Pure part of the UserPromptSubmit hook `.claude/hooks/review-pr-hint.mjs` (ADR-0017): which PR,
// if any, the Owner asked to review. Kept here so Vitest covers it (T-135).

// "PR #N", "PR N" or "pull request #N". A bare "#N" is not a PR: task, issue and merge prompts
// name issues that way next to "review" (DR-83).
const PR_REF = /(\bPR\b\s*#?\s*|\bpull request\s*#?\s*)(\d+)/gi;
const REVIEW = /\breview\b/gi;
// How far "review" may stand from the number, before or after it.
const NEAR = 40;

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
    const near = reviews.some(
      (r) => (r.end <= start && start - r.end <= NEAR) || (end <= r.start && r.start - end <= NEAR),
    );
    if (near) return Number(ref[2]);
  }
  return null;
}
