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
      name: 'db-and-ai-only-on-domain',
      comment: 'packages/db and packages/ai may use packages/domain, not each other or the UI.',
      severity: 'error',
      from: { path: '^packages/(db|ai)/' },
      to: { path: '^packages/(db|ai|ui)/', pathNot: '^packages/$1/' },
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
