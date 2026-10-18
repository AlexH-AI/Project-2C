// Lets a command of tools/ run the TypeScript of the packages (T-265): import this first, then the
// TypeScript with `await import(…)`. A static import is linked before this registers the hooks of
// ts-hooks-core.mjs.

import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { tsHooks } from './ts-hooks-core.mjs';

registerHooks(tsHooks((url) => readFileSync(url, 'utf8')));
