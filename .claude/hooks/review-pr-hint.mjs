/* global process */
// UserPromptSubmit hook: when the Owner asks to review a PR by number,
// point Claude at the project `review-pr` skill (ADR-0017). Prints nothing otherwise.

const PR_REF = String.raw`(?:\bPR\b\s*#?\s*|\bpull request\s*#?\s*|#)(\d+)`;
const PATTERNS = [
  new RegExp(String.raw`\breview\b.{0,40}?${PR_REF}`, 'i'),
  new RegExp(String.raw`${PR_REF}.{0,40}?\breview\b`, 'i'),
];

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
  for (const pattern of PATTERNS) {
    const match = prompt.match(pattern);
    if (match) {
      const context =
        `Owner asked to review PR #${match[1]}. Invoke the project skill \`review-pr\` ` +
        `(Skill tool, args "${match[1]}") and follow it: it reads the risk label and picks ` +
        `the review tier. Do not call \`code-review\` directly outside that skill.`;
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: context },
        }),
      );
      return;
    }
  }
});
