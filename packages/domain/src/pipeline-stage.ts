/** Opportunity stages, from the earliest (N4) to the most advanced (N1). See ADR-0007. */
export const PIPELINE_STAGES = ['N4', 'N3', 'N2', 'N1'] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export function isPipelineStage(value: string): value is PipelineStage {
  return (PIPELINE_STAGES as readonly string[]).includes(value);
}

/** Negative when `a` is less advanced than `b`, positive when more advanced, 0 when equal. */
export function compareStages(a: PipelineStage, b: PipelineStage): number {
  return PIPELINE_STAGES.indexOf(a) - PIPELINE_STAGES.indexOf(b);
}
