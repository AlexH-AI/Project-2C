import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { isDocsOnly } from './pr-core.mjs';

// A line number of docs/state/review-notes.md moves with every PR of the notes, so a comment that
// names a note by it, as `(L184)`, soon points at another note (DS-13, T-507 #1501). A comment
// names a note by `review #<PR>` (the review that wrote it), its `DR6-…` code or `#<Issue>`; in
// what `pnpm lint:tokens` reads, where `#1402` is a colour, by `review of PR <PR>`.

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** The code, the tests, the tools, and the two files of the mockups that the app's CSS follows. */
const SCANNED = [
  'apps/desktop/src',
  'apps/desktop/src-tauri/src',
  'packages/*/src/*', // a pathspec with `*` matches whole paths: `*` takes the `/` too
  'packages/ui/scripts',
  'e2e',
  'tools',
  'docs/design/mockups/ui2.css',
  'docs/design/mockups/ui2.js',
];

/** The test data of the notes reader (`- L115 …`), and this file. */
const LET_THROUGH = new Set(['tools/notes-core.test.mjs', 'tools/notes-line-tags.test.mjs']);

const TAG = /\bL[0-9]{2,3}\b/;

/** `path:line` of each line of `text` that names a line of the notes. */
function lineTags(path, text) {
  return text.split('\n').flatMap((line, i) => (TAG.test(line) ? [`${path}:${i + 1}`] : []));
}

/**
 * The files under `SCANNED` git has or would add: no build output, no `node_modules`. No Markdown
 * file: a README (e2e/perf has one) is a doc, as every `.md` is, and CI skips it. No file deleted
 * but not staged, which git still lists; `-z` keeps a name outside ASCII unquoted (review #1513).
 */
function scannedFiles() {
  const args = ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', ...SCANNED];
  return execFileSync('git', args, { cwd: ROOT })
    .toString()
    .split('\0')
    .filter((path) => path && !path.endsWith('.md') && existsSync(join(ROOT, path)));
}

describe('line numbers of the review notes in comments', () => {
  it('sees a tag in each form a comment wrote one, and no durable id', () => {
    const text = [
      '// as it should (L123).',
      '// L45: opening a sentence',
      '// beside a code (DR6-07, L184)',
      '// at the start of a line: L204).',
      '// (review #1398), review of PR 1402, DR6-183, #1501, L-CRM, HTML5, LL123, L1, L1234',
    ].join('\n');
    expect(lineTags('a.ts', text)).toEqual(['a.ts:1', 'a.ts:2', 'a.ts:3', 'a.ts:4']);
  });

  it('finds none in the code, the tests, the tools, ui2.css and ui2.js', () => {
    const files = scannedFiles();
    // A root that lists nothing would leave the check green: one file known in each.
    for (const known of [
      'apps/desktop/src/main.tsx',
      'apps/desktop/src-tauri/src/lib.rs',
      'packages/domain/src/number.ts',
      'packages/ui/src/tokens.css',
      'packages/ui/scripts/token-guard.ts',
      'e2e/support.ts',
      'tools/notes-core.mjs',
      'docs/design/mockups/ui2.css',
      'docs/design/mockups/ui2.js',
    ]) {
      expect(files).toContain(known);
    }
    const found = files
      .filter((file) => !LET_THROUGH.has(file))
      .flatMap((file) => {
        const bytes = readFileSync(join(ROOT, file));
        // An image (a PNG of the logo) is no comment.
        return bytes.includes(0) ? [] : lineTags(file, bytes.toString('utf8'));
      });
    expect(found).toEqual([]);
  });

  // A PR that only changes a file CI skips merges without CI; a tag it wrote there would turn the
  // Verify of the next code PR red, at a file outside that PR (review #1513).
  it('scans only files whose change makes CI run', () => {
    expect(scannedFiles().filter((file) => isDocsOnly([file]))).toEqual([]);
  });
});
