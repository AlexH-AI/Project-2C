import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cruise } from 'dependency-cruiser';
import { ESLint } from 'eslint';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// The rules of the repo's own lint configs, run on code written here: a rule that no file of the repo
// breaks today would go unseen if a later edit dropped it (CLR6-C5, review of PR 1157).
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SLOW = 60_000;

describe('dependency-cruiser (.dependency-cruiser.cjs) on a tree of its own', () => {
  // The long name of the folder: a short one (8.3) would not start with the paths the rules read.
  let tree;
  beforeAll(() => {
    tree = realpathSync.native(mkdtempSync(join(tmpdir(), 'lint-rules-')));
    const files = {
      // Resolved as the real one is, so a rule on its path can see it.
      'node_modules/vitest/package.json': '{ "name": "vitest", "exports": { ".": "./index.js" } }',
      'node_modules/vitest/index.js': 'export const vi = {};\n',
      'packages/db/src/test-support.ts': "export { vi } from 'vitest';\n",
      'packages/db/src/store.test.ts': "import { vi } from './test-support';\nexport { vi };\n",
      'packages/db/src/store.ts': "export { vi } from 'vitest';\n",
      'packages/ui/src/tokens.ts': "export { vi } from 'vitest';\n",
      'apps/desktop/src/data.ts': "export { vi } from 'vitest';\n",
      'apps/desktop/src/demo.ts': "export { vi } from '../../../packages/db/src/test-support';\n",
    };
    for (const [file, text] of Object.entries(files)) {
      mkdirSync(dirname(join(tree, file)), { recursive: true });
      writeFileSync(join(tree, file), text);
    }
  });
  afterAll(() => rmSync(tree, { recursive: true, force: true }));

  it(
    'refuses a file but a test or test-support that takes vitest or a test file, as rule, from, to',
    async () => {
      const { forbidden, options } = createRequire(import.meta.url)('../.dependency-cruiser.cjs');
      // The tree has no tsconfig: its imports are relative or of node_modules.
      const { output } = await cruise(['apps', 'packages'], {
        ...options,
        tsConfig: undefined,
        baseDir: tree,
        ruleSet: { forbidden },
        validate: true,
      });
      const found = output.summary.violations
        .map(({ rule, from, to }) => [rule.name, from, to])
        .sort((a, b) => a[1].localeCompare(b[1]));
      expect(found).toEqual([
        ['vitest-only-in-tests', 'apps/desktop/src/data.ts', 'node_modules/vitest/index.js'],
        ['test-files-only-in-tests', 'apps/desktop/src/demo.ts', 'packages/db/src/test-support.ts'],
        ['vitest-only-in-tests', 'packages/db/src/store.ts', 'node_modules/vitest/index.js'],
        ['vitest-only-in-tests', 'packages/ui/src/tokens.ts', 'node_modules/vitest/index.js'],
      ]);
    },
    SLOW,
  );
});

describe('ESLint (eslint.config.js): no-global-assign reads the globals of each area', () => {
  const eslint = new ESLint({ cwd: ROOT });
  const assigns = async (code, filePath) => {
    const [{ messages }] = await eslint.lintText(code, { filePath });
    return messages.filter((message) => message.ruleId === 'no-global-assign').length;
  };

  it(
    'refuses window in the app, crypto in packages/db, process in a config at the root',
    async () => {
      expect(await assigns('window = undefined;', 'apps/desktop/src/x.ts')).toBe(1);
      expect(await assigns('window = undefined;', 'apps/desktop/src/x.tsx')).toBe(1);
      expect(await assigns('crypto = undefined;', 'packages/db/src/x.ts')).toBe(1);
      expect(await assigns('process = undefined;', 'x.config.ts')).toBe(1);
    },
    SLOW,
  );
});
