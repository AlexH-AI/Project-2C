import { describe, expect, it } from 'vitest';
import { PIPELINE_STAGES, isPipelineStage } from './pipeline-stage';

describe('pipeline stages', () => {
  it('orders stages from the earliest (N4) to the most advanced (N1)', () => {
    expect(PIPELINE_STAGES).toEqual(['N4', 'N3', 'N2', 'N1']);
  });

  it('recognises only N1-N4 as pipeline stages', () => {
    expect(isPipelineStage('N3')).toBe(true);
    expect(isPipelineStage('N5')).toBe(false);
    expect(isPipelineStage('n3')).toBe(false);
    expect(isPipelineStage('ON_HOLD')).toBe(false);
  });
});
