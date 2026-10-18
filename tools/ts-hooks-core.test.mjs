import { describe, expect, it } from 'vitest';
import { URL } from 'node:url';
import { tsHooks } from './ts-hooks-core.mjs';

const ROOT = 'file:///C:/repo/';
const context = { parentURL: `${ROOT}packages/db/src/seed.ts`, conditions: ['node', 'import'] };

/**
 * Node's own resolve, knowing only `files` (from the repo root); records every specifier tried
 * and every error thrown.
 */
function nodeWith(...files) {
  const known = new Set(files.map((file) => new URL(file, ROOT).href));
  const tried = [];
  const errors = [];
  const nextResolve = (specifier, ctx) => {
    tried.push(specifier);
    if (specifier.startsWith('.')) {
      const url = new URL(specifier, ctx.parentURL);
      const file = new URL(url);
      file.search = '';
      if (known.has(file.href)) return { url: url.href, format: 'module' };
    }
    const error = Object.assign(new Error(`Cannot find '${specifier}'`), {
      code: 'ERR_MODULE_NOT_FOUND',
    });
    errors.push(error);
    throw error;
  };
  return { nextResolve, tried, errors };
}

function thrown(run) {
  try {
    run();
  } catch (error) {
    return error;
  }
  throw new Error('nothing thrown');
}

const noRead = () => {
  throw new Error('read');
};

describe('tsHooks resolve', () => {
  const { resolve } = tsHooks(noRead);

  it('takes what Node finds as it is, trying nothing more', () => {
    const node = nodeWith('packages/domain/src/period.ts', 'packages/db/src/schema.sql');
    expect(resolve('../../domain/src/period.ts', context, node.nextResolve)).toEqual({
      url: `${ROOT}packages/domain/src/period.ts`,
      format: 'module',
    });
    expect(resolve('./schema.sql?raw', context, node.nextResolve)).toEqual({
      url: `${ROOT}packages/db/src/schema.sql?raw`,
      format: 'module',
    });
    expect(node.tried).toEqual(['../../domain/src/period.ts', './schema.sql?raw']);
  });

  it.each([
    ['./rows', 'packages/db/src/rows.ts'],
    ['./migrations', 'packages/db/src/migrations/index.ts'],
    ['..', 'packages/db/index.ts'],
  ])('finds an extensionless %s as %s', (specifier, file) => {
    const node = nodeWith(file);
    expect(resolve(specifier, context, node.nextResolve).url).toBe(new URL(file, ROOT).href);
  });

  it('takes ./x.ts before ./x/index.ts', () => {
    const node = nodeWith('packages/db/src/rows.ts', 'packages/db/src/rows/index.ts');
    expect(resolve('./rows', context, node.nextResolve).url).toBe(`${ROOT}packages/db/src/rows.ts`);
  });

  it('finds an extensionless name with a dot in it as a .ts file (#474)', () => {
    const node = nodeWith('packages/db/src/golden/kyc.fixture.ts');
    expect(resolve('./golden/kyc.fixture', context, node.nextResolve).url).toBe(
      `${ROOT}packages/db/src/golden/kyc.fixture.ts`,
    );
  });

  it.each(['./missing', './golden/missing.fixture'])(
    'throws the first error of %s when no file matches',
    (specifier) => {
      const node = nodeWith('packages/db/src/rows.ts');
      expect(thrown(() => resolve(specifier, context, node.nextResolve))).toBe(node.errors[0]);
      expect(node.tried.at(-1)).toBe(`${specifier}/index.ts`);
    },
  );

  it.each(['zod', 'node:missing', '@p2c/missing'])(
    'leaves a specifier that is not relative (%s) to Node',
    (specifier) => {
      const node = nodeWith();
      expect(thrown(() => resolve(specifier, context, node.nextResolve))).toBe(node.errors[0]);
      expect(node.tried).toEqual([specifier]);
    },
  );
});

describe('tsHooks load', () => {
  it('loads a ?raw file as a module whose default export is its text', () => {
    const text = 'CREATE TABLE "t" (\n  note TEXT -- it\'s `x` \\ ${y}\n);\r\n';
    const read = [];
    const { load } = tsHooks((url) => {
      read.push(url.href);
      return text;
    });
    const out = load(`${ROOT}packages/db/drizzle/0000_init.sql?raw`, {}, noRead);
    expect(read).toEqual([`${ROOT}packages/db/drizzle/0000_init.sql`]);
    expect(out).toEqual({ format: 'module', source: expect.any(String), shortCircuit: true });
    const literal = out.source.match(/^export default (.*);$/s)?.[1];
    expect(JSON.parse(literal)).toBe(text);
  });

  it('leaves every other file to Node', () => {
    const { load } = tsHooks(noRead);
    const url = `${ROOT}packages/domain/src/period.ts`;
    const ctx = { format: 'module-typescript' };
    const result = { format: 'module', source: 'export {};' };
    const calls = [];
    expect(
      load(url, ctx, (...args) => {
        calls.push(args);
        return result;
      }),
    ).toBe(result);
    expect(calls).toEqual([[url, ctx]]);
  });
});
