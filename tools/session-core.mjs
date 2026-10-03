// Pure helpers shared by tools/handoff.mjs, tools/status.mjs and the SessionStart hook.
// No I/O here, so they are unit-tested in session-core.test.mjs.

// Claude Code keeps at most 10,000 characters of hook output; stay below it.
export const HOOK_LIMIT = 9500;
export const BODY_TARGET = 8000;
export const BODY_MAX = 9000;

/** The single open issue labelled "handoff" (the pinned HANDOFF). */
export function pickHandoffIssue(issues) {
  if (issues.length === 0) {
    throw new Error('There is no open issue labelled "handoff": create and pin one.');
  }
  if (issues.length > 1) {
    const numbers = issues.map((i) => `#${i.number}`).join(', ');
    throw new Error(`Several open issues are labelled "handoff" (${numbers}): keep only one.`);
  }
  return issues[0];
}

/** Length rules for a new HANDOFF body: error refuses the write, warning is printed. */
export function checkBody(body) {
  const length = body.length;
  if (body.trim() === '') return { error: 'The new HANDOFF body is empty.', warning: null };
  if (length > BODY_MAX) {
    return {
      error: `HANDOFF is ${length} characters (max ${BODY_MAX}): move details to their own files.`,
      warning: null,
    };
  }
  const warning =
    length > BODY_TARGET ? `HANDOFF is ${length} characters (target <= ${BODY_TARGET}).` : null;
  return { error: null, warning };
}

/**
 * A write is safe only if the issue is still the version this machine last read,
 * so a session never overwrites a handoff written meanwhile on the other machine.
 */
export function checkWrite(cache, current) {
  if (!cache) return 'No local copy of HANDOFF: read it first (node tools/handoff.mjs read).';
  if (cache.number !== current.number) {
    return `The local copy is of #${cache.number} but the handoff issue is now #${current.number}: read it again.`;
  }
  if (cache.updatedAt !== current.updatedAt) {
    return (
      `HANDOFF #${current.number} changed since it was read here (${cache.updatedAt} -> ${current.updatedAt}): ` +
      'read it again, merge your changes, then write.'
    );
  }
  return null;
}

/** Header + body, cut so the whole output stays below HOOK_LIMIT. */
export function fitOutput(header, body, limit = HOOK_LIMIT) {
  const room = limit - header.length;
  if (body.length <= room) return header + body;
  return `${header}${body.slice(0, room - 120)}\n\n[cut here: run node tools/handoff.mjs read for the rest]\n`;
}

/** The last "REVIEW: …" comment of a PR: verdict line and the head SHA it names. */
export function latestReview(comments) {
  const reviews = comments.filter((c) => c.body.startsWith('REVIEW:'));
  if (reviews.length === 0) return null;
  const body = reviews[reviews.length - 1].body;
  const verdict = body.split('\n')[0].slice('REVIEW:'.length).trim();
  const sha = body.match(/head `([0-9a-f]{7,40})`/)?.[1] ?? null;
  return { verdict, sha };
}

/** One-line CI state from gh's statusCheckRollup (check runs and commit statuses). */
export function checksSummary(rollup) {
  let pass = 0;
  let fail = 0;
  let pending = 0;
  for (const check of rollup) {
    const result = check.conclusion || check.state || '';
    if (check.status && check.status !== 'COMPLETED') pending++;
    else if (result === 'SUCCESS') pass++;
    else if (['FAILURE', 'ERROR', 'CANCELLED', 'TIMED_OUT', 'ACTION_REQUIRED'].includes(result))
      fail++;
    else if (result === 'PENDING' || result === 'EXPECTED') pending++;
  }
  if (pass + fail + pending === 0) return 'CI none';
  return `CI ${pass} pass, ${fail} fail, ${pending} pending`;
}
