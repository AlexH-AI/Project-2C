// Usage: node packages/ui/scripts/check-tokens.ts <dir>...
// Fails when app code styles with raw colours or values instead of the ADR-0013 tokens.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findTokenViolations } from '../src/token-guard.ts';

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error('Usage: check-tokens <dir>...');
  process.exit(2);
}

let count = 0;
for (const dir of dirs) {
  for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.(tsx?|css)$/.test(entry.name)) continue;
    const file = join(entry.parentPath, entry.name);
    for (const v of findTokenViolations(readFileSync(file, 'utf8'))) {
      console.error(`${relative(process.cwd(), file)}:${v.line}  ${v.rule}  ${v.match}`);
      count++;
    }
  }
}

if (count > 0) {
  console.error(
    `\n${count} styling value(s) bypass the design tokens; use packages/ui tokens instead.`,
  );
  process.exit(1);
}
console.log(`Design tokens: no styling that bypasses the tokens in ${dirs.join(', ')}.`);
