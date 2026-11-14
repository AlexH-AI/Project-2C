import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const ZOD_MINI =
  'Take zod/mini, by that name (DR6-25): the full zod puts 62 KB back into the bundle.';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/src-tauri/target/**',
      '**/src-tauri/gen/**',
      '.scratch/**',
      // Agent worktrees (Workflow isolation: 'worktree', ADR-0001 M8) are other checkouts.
      '.claude/worktrees/**',
      // CI skips docs/ (isDocsOnly in tools/pr-core.mjs), so verify does too (R2-12).
      'docs/**',
      // The e2e report (CI writes it, an e2e-report-* artifact holds it): git ignores it, and
      // ESLint reads no .gitignore.
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // The `globals` of .ts / .tsx files are for no-global-assign, the one rule on that reads them
  // there (`window = …`; tools/lint-rules.test.mjs): typescript-eslint turns no-undef off, and a
  // tsconfig (`lib`, `types`) says which globals a package may use, but for vitest.config.ts at the
  // root, which is in no tsconfig.
  {
    files: ['apps/desktop/src/**/*.{ts,tsx}', 'packages/ui/src/**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['apps/desktop/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['packages/db/src/**/*.ts'],
    languageOptions: { globals: { crypto: 'readonly' } },
  },
  {
    // Only `zod/mini` (DR6-25): the full zod (`zod`, `zod/v4`, `zod/v3`) puts ≈ 62 KB back into
    // the bundle, and sets its `en` locale for every schema (zod's config is on globalThis).
    // Nothing else in verify sees it: dependency-cruiser lets every path of the package through
    // (review #830). A type import too, one word away from a value import; import() is left out.
    files: ['packages/*/src/**/*.{ts,tsx}', 'apps/desktop/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          // Not a pattern: with no slash, a gitignore pattern takes a `zod` at any depth (./zod),
          // and zod/mini under it.
          paths: [{ name: 'zod', message: ZOD_MINI }],
          patterns: [{ group: ['zod/*', '!zod/mini'], message: ZOD_MINI }],
        },
      ],
    },
  },
  {
    files: ['*.config.{js,ts}', '.dependency-cruiser.cjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Playwright's own `test` runs the pages on the machine's day (DR6-129): every e2e file takes
    // the `test` of e2e/fixtures.ts, a helper too, so none hands Playwright's on to a spec. The
    // user guide and the perf probe run on configs of their own (playwright.*.config.ts). Every
    // extension Playwright runs a spec of, with no testMatch in playwright.config.ts (CLR6-F14).
    files: ['e2e/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'],
    ignores: ['e2e/fixtures.ts', 'e2e/**/*.guide.ts', 'e2e/**/*.perf.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              // Its default export is `test` too.
              importNames: ['test', 'default'],
              message:
                "Take `test` from e2e/fixtures.ts: Playwright's own reads the machine's day.",
            },
          ],
        },
      ],
      // Nor a dynamic import of it, in quotes or in backticks, whatever it takes:
      // no-restricted-imports only reads `import` and `export … from`. A type taken by
      // import('@playwright/test') is a TS import type, no import when the code runs.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "ImportExpression[source.value='@playwright/test'], ImportExpression[source.quasis.0.value.cooked='@playwright/test']",
          message:
            'Take `test` from e2e/fixtures.ts, any other name by a static import: lint cannot tell what a dynamic import takes.',
        },
        {
          // A .cjs spec takes it by require(), which no-restricted-imports does not read either.
          selector: "CallExpression[callee.name='require'][arguments.0.value='@playwright/test']",
          message:
            'Write the spec in TypeScript and take `test` from e2e/fixtures.ts: lint does not tell what a require() takes.',
        },
      ],
    },
  },
);
