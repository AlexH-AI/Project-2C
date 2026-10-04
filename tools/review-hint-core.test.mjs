import { describe, expect, it } from 'vitest';
import { reviewedPr } from './review-hint-core.mjs';

describe('reviewedPr', () => {
  it('reads a PR number next to "review", before or after it', () => {
    expect(reviewedPr('review PR #340')).toBe(340);
    expect(reviewedPr('review pr#340')).toBe(340);
    expect(reviewedPr('Review pull request 12')).toBe(12);
    expect(reviewedPr('#12 review lại')).toBe(12);
    expect(reviewedPr('PR 7 cần review')).toBe(7);
  });

  it('does not take an issue number for a PR', () => {
    expect(reviewedPr('review đóng phase, sửa issue #317')).toBeNull();
    expect(reviewedPr('Issue#317 cần review')).toBeNull();
    expect(reviewedPr('review theo Issue 317')).toBeNull();
  });

  it('prefers the PR when the prompt names an issue as well', () => {
    expect(reviewedPr('review PR #5 cho issue #4')).toBe(5);
    expect(reviewedPr('issue #4: review #5')).toBe(5);
  });

  it('needs the word review', () => {
    expect(reviewedPr('sửa bug #12')).toBeNull();
    expect(reviewedPr('preview PR #12')).toBeNull();
    expect(reviewedPr('')).toBeNull();
  });
});
