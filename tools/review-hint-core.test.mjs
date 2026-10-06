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

  it('needs the word review', () => {
    expect(reviewedPr('sửa bug #12')).toBeNull();
    expect(reviewedPr('preview PR #12')).toBeNull();
    expect(reviewedPr('')).toBeNull();
  });
});
