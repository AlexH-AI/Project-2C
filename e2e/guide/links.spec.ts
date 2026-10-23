import { expect, test } from '../fixtures';
import { linkTargets } from './links';

// The pure part of the guide's link check (check.guide.ts, which runs with the guide's own config);
// this test runs with `pnpm e2e`.

test('linkTargets reads inline links, images, reference definitions and img tags', () => {
  const text =
    '[a](01-bat-dau.md) ![b](<img/x.png> "t")\n[c]: 02-tong-quan.md\n<img src="img/y.png">';
  expect(linkTargets(text)).toEqual(['01-bat-dau.md', 'img/x.png', '02-tong-quan.md', 'img/y.png']);
});

test('linkTargets leaves out what is in code: a block, or a span of any number of backticks', () => {
  const text = [
    '```',
    '[a](fenced.md)',
    '```',
    'Gõ `[b](one.md)`, ``[c](two.md) có ` bên trong``, ```[d](three.md)``` rồi [e](kept.md).',
    // Backticks with no closing run of their length are text, not code.
    '``[f](also-kept.md)`',
  ].join('\n');
  expect(linkTargets(text)).toEqual(['kept.md', 'also-kept.md']);
});
