import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const folder = new URL('../src/components/', import.meta.url);
const sources = readdirSync(folder)
  .filter((name) => name.endsWith('.tsx'))
  .map((name) => [name, readFileSync(new URL(name, folder), 'utf8')] as const);
const home = sources.find(([name]) => name === 'FieldMarks.tsx')![1];
// The paths of `MARKS`, one `name: '…'` a line.
const marks = [
  ...home
    .slice(home.indexOf('export const MARKS'), home.indexOf('} as const'))
    .matchAll(/^\s+(\w+): '([^']+)',$/gm),
].map(([, name, path]) => [name!, path!] as const);

// Review #1402: the × of a dialog, a toast and an error line, the alert of a toast and an empty place, the
// arrows and the check of a menu and a list: each drawn in one place, `MARKS` of FieldMarks.tsx.
describe('MARKS of FieldMarks.tsx', () => {
  it('holds the six marks of the components', () => {
    expect(marks.map(([name]) => name)).toEqual([
      'close',
      'alert',
      'info',
      'down',
      'next',
      'check',
    ]);
  });

  it.each(marks)('draws %s there alone', (_, path) => {
    const drawing = sources.filter(([, text]) => text.includes(path)).map(([name]) => name);
    expect(drawing).toEqual(['FieldMarks.tsx']);
  });
});
