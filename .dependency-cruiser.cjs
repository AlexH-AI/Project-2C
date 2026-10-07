/** Module boundaries from ADR-0006. */
module.exports = {
  forbidden: [
    {
      name: 'domain-is-pure',
      comment: 'packages/domain is plain TypeScript and must not import anything outside itself.',
      severity: 'error',
      from: { path: '^packages/domain/', pathNot: '\\.test\\.ts$' },
      to: { pathNot: '^packages/domain/' },
    },
    {
      name: 'packages-not-to-apps',
      comment: 'Libraries must not depend on applications.',
      severity: 'error',
      from: { path: '^packages/' },
      to: { path: '^apps/' },
    },
    {
      name: 'ai-only-on-domain-and-zod',
      comment: 'packages/ai uses only packages/domain and zod (spec Phase 5 §10).',
      severity: 'error',
      from: { path: '^packages/ai/', pathNot: '\\.test\\.ts$' },
      to: { pathNot: ['^packages/(ai|domain)/', '(^|/)node_modules/zod/'] },
    },
    {
      name: 'db-only-on-domain-and-ai-schema',
      comment:
        'packages/db uses packages/domain, and of packages/ai only its schema module, to check AI output in a backup (ADR-0006 phụ lục 07/10/2026).',
      severity: 'error',
      from: { path: '^packages/db/' },
      to: { path: '^packages/(ai|ui)/', pathNot: '^packages/ai/src/schema\\.ts$' },
    },
    {
      name: 'ai-schema-standalone',
      comment:
        'The schema module of packages/ai imports nothing else of packages/ai, so packages/db gets only the schemas.',
      severity: 'error',
      from: { path: '^packages/ai/src/schema\\.ts$' },
      to: { path: '^packages/ai/', pathNot: '^packages/ai/src/schema\\.ts$' },
    },
    {
      name: 'ui-not-to-data',
      comment: 'packages/ui is presentation only.',
      severity: 'error',
      from: { path: '^packages/ui/' },
      to: { path: '^packages/(db|ai)/' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(^|/)(dist|coverage|src-tauri)/' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.base.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'types', 'default'],
      extensions: ['.ts', '.tsx', '.js'],
    },
  },
};
