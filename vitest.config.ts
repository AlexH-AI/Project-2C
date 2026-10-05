import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'packages/*/src/**/*.test.ts',
      'apps/*/src/**/*.test.{ts,tsx}',
      'tools/**/*.test.mjs',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'packages/domain/src/**/*.ts',
        'packages/db/src/**/*.ts',
        'apps/desktop/src/data/**/*.ts',
        'apps/desktop/src/shell/*.ts',
        'apps/desktop/src/routes/**/*-view.ts',
        'apps/desktop/src/routes/applied-filter.ts',
        'apps/desktop/src/routes/reports/report-workbook.ts',
        'apps/desktop/src/routes/**/stage-chart.ts',
      ],
      exclude: ['**/*.test.ts', '**/*.d.ts'],
      // One threshold per area, so a drop in one is not hidden by the others (T-101).
      // Numbers are the floor of what each area measured when set; raise them, never lower.
      thresholds: {
        'packages/domain/src/**': {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
        'packages/db/src/**': {
          statements: 99,
          branches: 97,
          functions: 100,
          lines: 99,
        },
        'apps/desktop/src/data/**': {
          statements: 96,
          branches: 91,
          functions: 92,
          lines: 98,
        },
        // useRoute.ts is a React hook with no unit test (no DOM in Vitest); e2e covers it.
        'apps/desktop/src/shell/*.ts': {
          statements: 75,
          branches: 86,
          functions: 77,
          lines: 75,
        },
        // Only the pure view helpers of routes are measured; the React screens are covered by e2e.
        'apps/desktop/src/routes/**': {
          statements: 99,
          branches: 92,
          functions: 99,
          lines: 99,
        },
      },
    },
  },
});
