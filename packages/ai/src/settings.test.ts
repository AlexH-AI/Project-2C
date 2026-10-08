import { describe, expect, it } from 'vitest';
import type { AiModel } from './models';
import { DEFAULT_AI_SETTINGS, readAiSettings } from './settings';

const STORED = {
  provider: 'OPENCODE_GO',
  opencodePlan: 'CREDIT',
  model: 'kimi-k3',
  reasoning: 'DEFAULT',
};

const read = (value: unknown, models?: readonly AiModel[]) =>
  readAiSettings(JSON.stringify(value), models);

describe('readAiSettings (spec Phase 5 §4.1, mockup ai.html 1g, 4b)', () => {
  it('starts from Mock · the default model · Mặc định · gói Go, with no key', () => {
    expect(DEFAULT_AI_SETTINGS).toEqual({
      provider: 'MOCK',
      opencodePlan: 'GO',
      model: 'deepseek-v4.1-flash',
      reasoning: 'DEFAULT',
    });
    expect(readAiSettings(undefined)).toEqual({ settings: DEFAULT_AI_SETTINGS, problem: null });
  });

  it('reads a stored value as it is', () => {
    expect(read(STORED)).toEqual({ settings: STORED, problem: null });
  });

  it('keeps only the four settings, never anything else stored with them', () => {
    expect(read({ ...STORED, key: 'sk-secret' }).settings).toEqual(STORED);
  });

  it('falls back to the defaults as a whole when the model is no longer listed (1g)', () => {
    expect(read({ ...STORED, model: 'gpt-6' })).toEqual({
      settings: DEFAULT_AI_SETTINGS,
      problem: { kind: 'model', model: 'gpt-6' },
    });
  });

  it.each([
    ['broken JSON', '{"provider": "MOCK"'],
    ['not an object', '"MOCK"'],
    ['null', 'null'],
    ['an array', '[]'],
    ['an unknown provider', JSON.stringify({ ...STORED, provider: 'OPENAI' })],
    ['an unknown reasoning level', JSON.stringify({ ...STORED, reasoning: 'MAX' })],
    ['a model that is not text', JSON.stringify({ ...STORED, model: 5 })],
    ['no model', JSON.stringify({ provider: 'MOCK', reasoning: 'DEFAULT' })],
  ])('falls back to the defaults on %s', (_, json) => {
    expect(readAiSettings(json)).toEqual({
      settings: DEFAULT_AI_SETTINGS,
      problem: { kind: 'invalid' },
    });
  });

  it.each([
    ['missing', undefined],
    ['wrong', 'PRO'],
  ])('reads a %s gói OpenCode as gói Go, with nothing to report (P8)', (_, opencodePlan) => {
    expect(read({ ...STORED, opencodePlan })).toEqual({
      settings: { ...STORED, opencodePlan: 'GO' },
      problem: null,
    });
  });

  it('uses Mặc định on a model not checked with reasoning_effort, with nothing to report', () => {
    // Stored before, or brought by a backup: never sent to Rust (review #424).
    expect(read({ ...STORED, model: 'kimi-k3', reasoning: 'HIGH' })).toEqual({
      settings: { ...STORED, model: 'kimi-k3', reasoning: 'DEFAULT' },
      problem: null,
    });
  });

  it('keeps the reasoning level of a model that takes reasoning_effort', () => {
    const models = [{ id: 'kimi-k3', label: 'Kimi K3', reasoningEffort: true }];
    expect(read({ ...STORED, reasoning: 'HIGH' }, models).settings.reasoning).toBe('HIGH');
  });
});
