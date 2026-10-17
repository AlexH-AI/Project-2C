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
);
