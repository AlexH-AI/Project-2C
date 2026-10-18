// The module hooks that let the commands of tools/ run the TypeScript of the packages in Node
// (T-265): @p2c/* are TypeScript with extensionless relative imports and `?raw` files, as Vite
// reads them. Node strips the types; these find `./x` as `./x.ts` or `./x/index.ts` and load a
// `?raw` file as its text. tools/ts-hooks.mjs registers them for tools/load-data.mjs and
// tools/eval-ai.mjs.
//
// Everything here takes its I/O as arguments, so it is unit-tested in ts-hooks-core.test.mjs.

import { URL } from 'node:url';

const RAW = '?raw';

/**
 * The hooks of `registerHooks` (node:module). `readText(url: URL): string` reads a `?raw` file.
 */
export function tsHooks(readText) {
  return {
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (error) {
        // Any relative specifier, a dotted name such as `./kyc.fixture` too (#474): one that
        // names a file Node can load never gets here.
        if (!specifier.startsWith('.')) throw error;
        for (const suffix of ['.ts', '/index.ts']) {
          try {
            return nextResolve(specifier + suffix, context);
          } catch {
            // Try the next one.
          }
        }
        throw error;
      }
    },
    load(url, context, nextLoad) {
      if (!url.endsWith(RAW)) return nextLoad(url, context);
      const text = readText(new URL(url.slice(0, -RAW.length)));
      return {
        format: 'module',
        source: `export default ${JSON.stringify(text)};`,
        shortCircuit: true,
      };
    },
  };
}
