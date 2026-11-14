import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from '../fixtures';
import { brokenLinks, headingIds, linkTargets } from './links';

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

// GitHub shows the guide: it tells case apart and takes an anchor to the id of a heading (CLR6-F7).
test('brokenLinks finds a missing file, a missing anchor and a name in the wrong case', () => {
  const root = mkdtempSync(join(tmpdir(), 'guide-'));
  try {
    const guide = join(root, 'guide');
    mkdirSync(join(guide, 'img'), { recursive: true });
    writeFileSync(join(guide, 'img', 'Anh.png'), '');
    writeFileSync(join(guide, 'b.md'), '## Mục hai\n\n```\n## Trong code\n```\n');
    const links = [
      'b.md#mục-hai',
      'b.md#m%E1%BB%A5c-hai',
      '#cài-đặt--dữ-liệu',
      '#team--nhân-sự',
      '#thư-mục-project2c-data-bản-exe',
      '#lặp-1',
      '#hello-world',
      '#press-ctrl-now',
      '#tom--jerry',
      '#xem-mục-hai-trước',
      '#cài-đặt',
      'img/Anh.png',
      'https://example.com/#x',
      'b.md#không-có',
      'b.md#trong-code',
      '#không-có',
      'img/anh.png',
      'B.md',
      'c.md',
    ];
    writeFileSync(
      join(guide, 'a.md'),
      [
        '# Bắt đầu',
        '## Cài đặt → Dữ liệu',
        '## Team & nhân sự',
        '## Thư mục `Project2C-data\\` (bản exe)',
        '## Lặp',
        '## Lặp',
        // As GitHub shows them (L182): emphasis, a tag, an entity, a reference link, setext.
        '## Hello _world_',
        '## Press <kbd>Ctrl</kbd> now',
        '## Tom &amp; Jerry',
        '## Xem [mục hai][r] trước',
        'Cài đặt',
        '---',
        '[r]: b.md#mục-hai',
        ...links.map((link) => `[x](${link})`),
      ].join('\n'),
    );
    expect(brokenLinks(guide, root)).toEqual([
      'a.md: b.md#không-có',
      'a.md: b.md#trong-code',
      'a.md: #không-có',
      'a.md: img/anh.png',
      'a.md: B.md',
      'a.md: c.md',
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('headingIds takes each heading in order, ATX or setext, from the text GitHub shows', () => {
  const text = [
    '## Hello _world_',
    '## my_var và `__init__` &lt;b&gt;',
    'Cài đặt',
    '---',
    '## Cài đặt',
    'Báo **cáo**',
    '===',
    '- Không phải tiêu đề',
    '---',
    '',
    '---',
  ].join('\n');
  expect([...headingIds(text)]).toEqual([
    'hello-world',
    'my_var-và-__init__-b',
    'cài-đặt',
    'cài-đặt-1',
    'báo-cáo',
  ]);
});
