import { describe, expect, it } from 'vitest';
import { reviewedPr } from './review-hint-core.mjs';

describe('reviewedPr', () => {
  it('reads a PR number next to "review", before or after it', () => {
    expect(reviewedPr('review PR #340')).toBe(340);
    expect(reviewedPr('review pr#340')).toBe(340);
    expect(reviewedPr('Review pull request 12')).toBe(12);
    expect(reviewedPr('PR 7 cần review')).toBe(7);
  });

  it('does not take an issue number for a PR', () => {
    expect(reviewedPr('review đóng phase, sửa issue #317')).toBeNull();
    expect(reviewedPr('Issue#317 cần review')).toBeNull();
    expect(reviewedPr('review theo Issue 317')).toBeNull();
  });

  it('prefers the PR when the prompt names an issue as well', () => {
    expect(reviewedPr('review PR #5 cho issue #4')).toBe(5);
    expect(reviewedPr('issue #4: review PR #5')).toBe(5);
  });

  it('does not take a bare #N for a PR (task, issue or merge prompts)', () => {
    expect(reviewedPr('#12 review lại')).toBeNull();
    expect(reviewedPr('Làm task T-138 (#350), xem lại ghi chú review trước khi code')).toBeNull();
    expect(reviewedPr('Sửa theo review notes, task #351')).toBeNull();
    expect(reviewedPr('Đã review xong #12, giờ merge giúp anh')).toBeNull();
    expect(reviewedPr('Deep review Phase 1–4, gói G, theo kế hoạch (#347 đã merge)')).toBeNull();
  });

  it('needs review near the PR number', () => {
    expect(
      reviewedPr('review xong rồi, giờ làm tiếp task kế theo kế hoạch đã chốt, PR #12'),
    ).toBeNull();
  });

  it('in an auto-issues message, takes only a line that is just "review PR #N"', () => {
    // §3.2 of .claude/skills/auto-issues: the one brief that asks for a review.
    const brief =
      'review PR #950\n[auto-issues] [PR #950] Review head abc1234.\n' +
      'Bạn là phiên con `review-1` của pipeline auto-issues.';
    expect(reviewedPr(brief)).toBe(950);
    expect(reviewedPr(`Tin của phiên điều phối:\n${brief}`)).toBe(950);
    // Its other briefs (§3.4, §3.5, §3.7) and the Owner answers it forwards name REVIEW
    // comments and review notes next to PRs without asking for a review (review #944).
    for (const prompt of [
      '[auto-issues] [PR #950] `REVIEW: CHANGES` @abc1234 ' +
        '(https://github.com/AlexH-AI/Project-2C/pull/950#issuecomment-1). Đọc comment đó.',
      '[auto-issues] [PR #950] Đã merge (`abc1234` trên `main`). Viết PR sổ cho review của ' +
        'PR này, như PR #940:\n- Đọc mọi comment REVIEW của PR #950, mọi vòng.',
      '[auto-issues] [Sổ] Owner duyệt đề xuất. Chỉ sửa `docs/state/review-notes.md`; tiêu đề ' +
        'theo kiểu PR #936.',
      '[auto-issues] [PR #950] Quyết định Owner: "review PR #950 sai ở mục 2, không chặn"',
    ]) {
      expect(reviewedPr(prompt), prompt).toBeNull();
    }
  });

  it('skips the blocks the app writes: child reports, linked sessions, task notifications', () => {
    // What the auto-issues orchestrator got on 02/11 (#952): none of it is the Owner asking.
    for (const prompt of [
      '<system-reminder>\nSession coding-ses1 ended its turn. Report: Không chờ CI, no review.\n' +
        'AUTO-CHILD: [Issue #933] PR #946 @66019cc\n</system-reminder>',
      '<system-reminder>\nSession review-1 ended its turn. Report: REVIEW: PASS cho PR #946 ' +
        '@52434dd.\n</system-reminder>',
      '<system-reminder>\nLinked sessions now: coding-ses1 = local_1 (done, PR #946); ' +
        'review-1 = local_2 (idle); review-2 = local_3 (running)\n</system-reminder>',
      '<task-notification>\n<task-id>b1</task-id>\n<status>completed</status>\n' +
        '<summary>Background command "Wait up to 60 min for a REVIEW on PR 946\'s head" ' +
        'completed (exit code 0)</summary>\n</task-notification>',
      '<side-sessions-event>\nreview-2 ended its turn: REVIEW: CHANGES cho PR #948\n' +
        '</side-sessions-event>',
    ]) {
      expect(reviewedPr(prompt), prompt).toBeNull();
    }
  });

  it('still reads the review brief and the Owner around those blocks', () => {
    const linked =
      '<system-reminder>\nLinked sessions now: coding-ses1 = local_1 (done, PR #946); ' +
      'review-1 = local_2 (idle)\n</system-reminder>';
    // §3.2 of .claude/skills/auto-issues reaches a review session this way.
    const brief =
      '<cross-session-message from="orchestrator">\nreview PR #948\n' +
      '[auto-issues] [PR #948] Review head 1647f4e.\n</cross-session-message>';
    expect(reviewedPr(`${linked}\n${brief}`)).toBe(948);
    expect(reviewedPr(`${linked}${brief}`)).toBe(948);
    expect(reviewedPr(`${linked}\nreview PR #950 giúp anh`)).toBe(950);
    expect(reviewedPr(`${linked}review lại PR 950`)).toBe(950);
  });

  it('needs the word review', () => {
    expect(reviewedPr('sửa bug #12')).toBeNull();
    expect(reviewedPr('preview PR #12')).toBeNull();
    expect(reviewedPr('')).toBeNull();
  });
});
