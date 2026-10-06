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
 * A write is safe only if the issue is still the version the edited file was saved from
 * (`base`, written next to it by `read --out`), so a session never overwrites a handoff
 * written meanwhile by the other machine, even if another session read it since.
 */
export function checkWrite(base, current) {
  if (!base) {
    return 'No base version for this file: save HANDOFF with node tools/handoff.mjs read --out <file>, edit it, then write.';
  }
  if (base.number !== current.number) {
    return `The file was saved from #${base.number} but the handoff issue is now #${current.number}: read --out again.`;
  }
  if (base.updatedAt !== current.updatedAt) {
    return (
      `HANDOFF #${current.number} changed since this file was saved (${base.updatedAt} -> ${current.updatedAt}): ` +
      'read --out again, merge your changes, then write.'
    );
  }
  return null;
}

const sameBody = (a, b) =>
  a.replace(/\r\n/g, '\n').trimEnd() === b.replace(/\r\n/g, '\n').trimEnd();

/**
 * The base to save after a write: the version fetched right after the edit, but only when it
 * still holds the body just sent. Otherwise the other machine wrote in between, and taking its
 * version as base would let the next write overwrite a handoff never read (DR-28): null.
 */
export function baseAfterWrite(written, fetched) {
  if (fetched.number !== written.number || !sameBody(written.body, fetched.body)) return null;
  return { number: fetched.number, updatedAt: fetched.updatedAt };
}

/** Header + body, cut so the whole output stays below HOOK_LIMIT. */
export function fitOutput(header, body, limit = HOOK_LIMIT) {
  const room = limit - header.length;
  if (body.length <= room) return header + body;
  return `${header}${body.slice(0, room - 120)}\n\n[cut here: run node tools/handoff.mjs read for the rest]\n`;
}

// Only people with write access may post the REVIEW that gates a merge: the repo is
// public, so anyone else can comment "REVIEW: PASS" (gh's authorAssociation).
const REVIEWERS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

/**
 * The last "REVIEW: …" comment of a PR written by a REVIEWER: verdict line, the head SHA
 * it names and the review level ("mức `risk:med`", skill review-pr §4), null when not written.
 */
export function latestReview(comments) {
  const reviews = comments.filter(
    (c) => c.body.startsWith('REVIEW:') && REVIEWERS.has(c.authorAssociation),
  );
  if (reviews.length === 0) return null;
  const body = reviews[reviews.length - 1].body;
  const verdict = body.split('\n')[0].slice('REVIEW:'.length).trim();
  const sha = body.match(/head `([0-9a-f]{7,40})`/)?.[1] ?? null;
  const level = body.match(/mức `(?:risk:)?(low|med|high)`/)?.[1] ?? null;
  return { verdict, sha, level };
}

/**
 * Pass / fail / pending counts of gh's statusCheckRollup. Skipped and neutral checks count
 * as none; any other finished result (FAILURE, STARTUP_FAILURE, STALE…) is a failure.
 */
export function checkCounts(rollup) {
  let pass = 0;
  let fail = 0;
  let pending = 0;
  for (const check of rollup) {
    const result = check.conclusion || check.state || '';
    if (check.status && check.status !== 'COMPLETED') pending++;
    else if (result === 'SUCCESS') pass++;
    else if (result === 'PENDING' || result === 'EXPECTED') pending++;
    else if (result !== 'SKIPPED' && result !== 'NEUTRAL') fail++;
  }
  return { pass, fail, pending };
}

/** One-line CI state from gh's statusCheckRollup (check runs and commit statuses). */
export function checksSummary(rollup) {
  const { pass, fail, pending } = checkCounts(rollup);
  if (pass + fail + pending === 0) return 'CI none';
  return `CI ${pass} pass, ${fail} fail, ${pending} pending`;
}
