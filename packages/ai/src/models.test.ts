import { describe, expect, it } from 'vitest';
import { AI_MODELS, DEFAULT_AI_MODEL } from './models';

describe('AI_MODELS', () => {
  it('lists each model once, with the default among them', () => {
    const ids = AI_MODELS.map((model) => model.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(DEFAULT_AI_MODEL);
    expect(DEFAULT_AI_MODEL).toBe('deepseek-v4.1-flash');
  });

  it('has reasoning_effort unchecked on every model until a real call checks it', () => {
    expect(AI_MODELS.filter((model) => model.reasoningEffort)).toEqual([]);
  });
});
