import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
  {
    files: ['packages/domain/**/*.ts'],
    languageOptions: { globals: {} },
  },
  {
    files: ['apps/desktop/src/**/*.{ts,tsx}', 'packages/ui/src/**/*.tsx'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['packages/db/src/**/*.ts'],
    languageOptions: { globals: { crypto: 'readonly' } },
  },
  {
    files: [
      '*.config.{js,ts}',
      '.dependency-cruiser.cjs',
      'apps/*/*.config.ts',
      'packages/*/*.config.ts',
    ],
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
    // user guide and the perf probe run on configs of their own (playwright.*.config.ts).
    files: ['e2e/**/*.ts'],
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
      ],
    },
  },
);
