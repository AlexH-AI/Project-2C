/* global process */
// UserPromptSubmit hook: when the Owner asks to review a PR by number,
// point Claude at the project `review-pr` skill (ADR-0017). Prints nothing otherwise.
// Which PR: `reviewedPr` in tools/review-hint-core.mjs (unit-tested there).

import { reviewedPr } from '../../tools/review-hint-core.mjs';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let prompt;
  try {
    prompt = String(JSON.parse(raw).prompt ?? '');
  } catch {
    return;
  }
  const pr = reviewedPr(prompt);
  if (pr === null) return;
  const context =
    `Owner asked to review PR #${pr}. Invoke the project skill \`review-pr\` ` +
    `(Skill tool, args "${pr}") and follow it: it reads the risk label and picks ` +
    `the review tier. Do not call \`code-review\` directly outside that skill.`;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: context },
    }),
  );
});
