import { describe, expect, it } from 'vitest';
import { AI_MODELS, DEFAULT_AI_MODEL } from './models';

describe('AI_MODELS', () => {
  it('lists each model once, with the default among them', () => {
    const ids = AI_MODELS.map((model) => model.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(DEFAULT_AI_MODEL);
    expect(DEFAULT_AI_MODEL).toBe('deepseek-v4.1-flash');
  });

  it('lists the models gói Credit serves: no deepseek-v4-pro (403, Owner 09/10/2026, T-180)', () => {
    expect(AI_MODELS.map((model) => model.id)).toEqual([
      'glm-5.3',
      'kimi-k3',
      'deepseek-v4.1-flash',
    ]);
  });

  it('takes reasoning_effort on the models the real call of 09/10/2026 checked (T-179)', () => {
    // glm-5.3: low and high answer alike.
    expect(AI_MODELS.filter((model) => model.reasoningEffort).map((model) => model.id)).toEqual([
      'kimi-k3',
      'deepseek-v4.1-flash',
    ]);
  });
});
