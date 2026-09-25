import { describe, expect, it } from 'vitest';
import { PIPELINE_STAGES, compareStages, isPipelineStage } from './pipeline-stage';

describe('pipeline stages', () => {
  it('orders stages from the earliest (N4) to the most advanced (N1)', () => {
    expect(PIPELINE_STAGES).toEqual(['N4', 'N3', 'N2', 'N1']);
  });

  it('compares stages by advancement', () => {
    expect(compareStages('N4', 'N3')).toBeLessThan(0);
    expect(compareStages('N1', 'N2')).toBeGreaterThan(0);
    expect(compareStages('N2', 'N2')).toBe(0);
  });

  it('recognises only N1-N4 as pipeline stages', () => {
    expect(isPipelineStage('N3')).toBe(true);
    expect(isPipelineStage('N5')).toBe(false);
    expect(isPipelineStage('n3')).toBe(false);
    expect(isPipelineStage('ON_HOLD')).toBe(false);
  });
});
