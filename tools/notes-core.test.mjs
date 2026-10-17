import { describe, expect, it } from 'vitest';
import {
  allowedPatterns,
  formatRelated,
  openNotes,
  relatedNotes,
  targetPatterns,
} from './notes-core.mjs';

const FILES = [
  'apps/desktop/src/data/app-data.ts',
  'apps/desktop/src/data/app-data.test.ts',
  'apps/desktop/src-tauri/src/storage.rs',
  'apps/desktop/src/routes/customers/CustomerKyc.tsx',
  'apps/desktop/src/routes/customers/CustomerDialogs.tsx',
  'e2e/guide/shots.guide.ts',
  'tools/merge-pr.mjs',
  'packages/ai/src/index.ts',
  'packages/ai/src/run.ts',
  'packages/db/src/index.ts',
  'packages/domain/src/index.ts',
  'packages/ui/src/index.ts',
  'packages/domain/src/stats.ts',
  'e2e/perf/stats.ts',
  'apps/desktop/src/routes/appointments/appointment-form.ts',
  'docs/README.md',
];

const pathsOf = (...open) => openNotes(ledger(...open), FILES).map((note) => note.paths);

/** A ledger with the given OPEN lines and one RESOLVED / ACCEPTED line each. */
const ledger = (...open) =>
  [
    '# Sổ ghi chú review',
    '',
    '## OPEN',
    '',
    ...open,
    '',
    '## RESOLVED',
    '',
    '- `apps/desktop/src/data/app-data.ts`: đã sửa.',
    '',
    '## ACCEPTED',
    '',
    '- `apps/desktop/src-tauri/src/storage.rs`: chấp nhận.',
  ].join('\n');

describe('openNotes', () => {
  it('reads each OPEN line with the repo files it names, and its line number', () => {
    const notes = openNotes(
      ledger('- `apps/desktop/src/data/app-data.ts` (`openAppData`): kiểm.'),
      FILES,
    );
    expect(notes).toEqual([
      {
        line: 5,
        text: '`apps/desktop/src/data/app-data.ts` (`openAppData`): kiểm.',
        paths: ['apps/desktop/src/data/app-data.ts'],
      },
    ]);
  });

  it('finds a bare file name in the repo and drops a line suffix', () => {
    expect(
      pathsOf(
        '- `storage.rs` (#196): `explorer_arg` (`~377`).',
        '- `app-data.ts:249`: đo.',
        '- `tools/merge-pr.mjs:12-13`: comment.',
        '- NIT `shots.guide.ts:28–29`: câu.',
        '- `CustomerKyc.tsx:84, :153, :245`, `CustomerDialogs.tsx:~300`.',
      ),
    ).toEqual([
      ['apps/desktop/src-tauri/src/storage.rs'],
      ['apps/desktop/src/data/app-data.ts'],
      ['tools/merge-pr.mjs'],
      ['e2e/guide/shots.guide.ts'],
      [
        'apps/desktop/src/routes/customers/CustomerKyc.tsx',
        'apps/desktop/src/routes/customers/CustomerDialogs.tsx',
      ],
    ]);
  });

  it('narrows a name found in many places to the packages the note and its heading name', () => {
    expect(
      pathsOf(
        '- Phạm vi export: `packages/ai/src/run.ts` re-export từ `index.ts`.',
        '- `packages/db` (#455):',
        '  - re-export từ `index.ts`.',
      ),
    ).toEqual([
      ['packages/ai/src/run.ts', 'packages/ai/src/index.ts'],
      ['packages/db/src/index.ts'],
    ]);
  });

  it('keeps a name found in up to three places when nothing narrows it, drops it past that', () => {
    expect(pathsOf('- `stats.ts` lặp.', '- re-export từ `index.ts`.')).toEqual([
      ['packages/domain/src/stats.ts', 'e2e/perf/stats.ts'],
      [],
    ]);
  });

  it('reads a folder of two levels or more, and a path given from a folder down', () => {
    expect(
      pathsOf('- `e2e/perf/` probe; `docs/` một cấp.', '- `appointments/appointment-form.ts:112`.'),
    ).toEqual([['e2e/perf/'], ['apps/desktop/src/routes/appointments/appointment-form.ts']]);
  });

  it('expands braces in a note', () => {
    expect(pathsOf('- `packages/{ai,db}/src/index.ts`.')).toEqual([
      ['packages/ai/src/index.ts', 'packages/db/src/index.ts'],
    ]);
  });

  it('takes no code span that is not a path', () => {
    expect(
      pathsOf(
        '- `close.unsavedBody`, `trash.customer.with`, regex `\\d+`, `docs/…`, `#[cfg(any(windows, test))]`.',
      ),
    ).toEqual([[]]);
  });

  it('reports a heading only through its sub-items, which take its files when they name none', () => {
    const notes = openNotes(
      ledger(
        '- Hai ghi chú của review PR #620 — gộp vào lần chạm sau của từng file:',
        '  - `app-data.ts` (`openAppData`): kiểm.',
        '  - Mùi: `storage.rs` lặp.',
        '- Lần chạy AI, `apps/desktop/src/data/app-data.ts` (#468):',
        '  - Kết quả lần chạy nằm trong component:',
        '    - lỗi khi ở màn khác.',
      ),
      FILES,
    );
    expect(notes.map(({ line, paths }) => ({ line, paths }))).toEqual([
      { line: 6, paths: ['apps/desktop/src/data/app-data.ts'] },
      { line: 7, paths: ['apps/desktop/src-tauri/src/storage.rs'] },
      { line: 10, paths: ['apps/desktop/src/data/app-data.ts'] },
    ]);
  });

  it('never reads RESOLVED or ACCEPTED', () => {
    expect(openNotes(ledger('- Không nêu file nào.'), FILES)).toEqual([
      { line: 5, text: 'Không nêu file nào.', paths: [] },
    ]);
  });
});

// The fields of Issue #656 (T-252) around "File / thư mục được phép sửa", as GitHub stores them.
const ISSUE_656 = [
  '### Tài liệu cần đọc',
  '',
  '- `docs/design/phase-6-hoan-thien.md` §5',
  '',
  '### File / thư mục được phép sửa',
  '',
  '- `packages/db/src/database.ts` + test',
  '- `apps/desktop/src/data/{app-data.ts,tauri-contract.test.ts}` + test',
  '- `apps/desktop/src-tauri/src/storage.rs` (+ test Rust trong file)',
  '- `e2e/**` (ca bàn phím)',
  '- `docs/design/phase-6-hoan-thien.md` §5 (nếu chữ về kiểm file đổi)',
  '',
  '### Interface / hợp đồng',
  '',
  '- `openAppData()` ném `DATA_DAMAGED`',
].join('\n');

describe('allowedPatterns', () => {
  it('reads the paths and globs of the field, with the test file next to each source file', () => {
    expect(allowedPatterns(ISSUE_656)).toEqual([
      'packages/db/src/database.ts',
      'packages/db/src/database.test.ts',
      'apps/desktop/src/data/app-data.ts',
      'apps/desktop/src/data/app-data.test.ts',
      'apps/desktop/src/data/tauri-contract.test.ts',
      'apps/desktop/src-tauri/src/storage.rs',
      'e2e/**',
      'docs/design/phase-6-hoan-thien.md',
    ]);
  });

  it('is empty for a body without the field', () => {
    expect(allowedPatterns('### Mục tiêu\n\n- `packages/db/src/database.ts`')).toEqual([]);
  });
});

describe('relatedNotes', () => {
  const NOTES = [
    { line: 10, text: 'a', paths: ['apps/desktop/src/data/app-data.ts'] },
    { line: 11, text: 'b', paths: ['e2e/guide/shots.guide.ts'] },
    { line: 12, text: 'c', paths: ['e2e/perf/'] },
    { line: 13, text: 'd', paths: ['packages/ai/src/run.ts', 'apps/desktop/src/data/app-data.ts'] },
    { line: 14, text: 'e', paths: [] },
    { line: 15, text: 'f', paths: ['packages/db/'] },
  ];
  const lines = (notes) => notes.map((note) => note.line);

  it('puts a note that names a target file in exact, with the files that matched', () => {
    expect(relatedNotes(NOTES, ['apps/desktop/src/data/app-data.ts'])).toEqual({
      exact: [
        { line: 10, text: 'a', paths: ['apps/desktop/src/data/app-data.ts'] },
        { line: 13, text: 'd', paths: ['apps/desktop/src/data/app-data.ts'] },
      ],
      area: [],
    });
  });

  it('puts a note under a target glob or folder, or naming a folder that holds a target, in area', () => {
    const { exact, area } = relatedNotes(NOTES, [
      'e2e/**',
      'packages/db/src/database.ts',
      'packages/ai/src/',
    ]);
    expect(exact).toEqual([]);
    expect(lines(area)).toEqual([11, 12, 13, 15]);
    expect(area[2].paths).toEqual(['packages/ai/src/run.ts']);
  });

  it('reads `*` within one folder and `**` across folders', () => {
    expect(lines(relatedNotes(NOTES, ['e2e/*.ts']).area)).toEqual([]);
    expect(lines(relatedNotes(NOTES, ['e2e/guide/*.ts']).area)).toEqual([11]);
    expect(lines(relatedNotes(NOTES, ['apps/**/app-data.ts']).area)).toEqual([10, 13]);
  });

  it('reads every other character of a glob as itself', () => {
    const notes = [{ line: 1, text: 'g', paths: ['e2e/a-spec.ts'] }];
    expect(relatedNotes(notes, ['e2e/*.spec.ts']).area).toEqual([]);
  });

  it('lists a note once, in exact when it is in both', () => {
    const { exact, area } = relatedNotes(NOTES, [
      'apps/desktop/src/data/app-data.ts',
      'packages/ai/**',
    ]);
    expect(lines(exact)).toEqual([10, 13]);
    expect(area).toEqual([]);
  });
});

describe('formatRelated', () => {
  const head = 'Ghi chú OPEN của docs/state/review-notes.md @ 88e9a75, theo PR #9 (2 file).';
  const hint = 'Thân PR trả lời từng mục "Trùng file".';
  const backticks = (line) => line.split('`').length - 1;

  it('lists each exact note with its line, files and opening words, then the area lines', () => {
    const text = formatRelated(
      {
        exact: [
          {
            line: 115,
            text: `\`app-data.ts\` (\`openAppData\`): ${'kiểm '.repeat(40)}`,
            paths: ['a/app-data.ts'],
          },
        ],
        area: [{ line: 81, text: 'e2e', paths: ['e2e/x.spec.ts', 'e2e/perf/'] }],
      },
      head,
      hint,
    );
    const lines = text.split('\n');
    expect(lines[0]).toBe(head);
    expect(lines).toContain('Trùng file (1):');
    const exact = lines.find((line) => line.startsWith('- L115 '));
    expect(exact).toMatch(/^- L115 `a\/app-data\.ts`: `app-data\.ts` \(`openAppData`\): kiểm .*…$/);
    expect(exact.length).toBeLessThan(200);
    expect(lines).toContain('Trong vùng (1): đọc khi sửa gần đó, không bắt buộc trả lời.');
    expect(lines).toContain('- L81 `e2e/x.spec.ts`, `e2e/perf/`');
    expect(lines.at(-1)).toBe(hint);
  });

  it('does not cut a note inside a code span', () => {
    const text = `Mùi: ${'x'.repeat(130)} \`remove_interrupted_backups\` lặp.`;
    const [, , , line] = formatRelated(
      { exact: [{ line: 1, text, paths: ['a.rs'] }], area: [] },
      head,
      hint,
    ).split('\n');
    expect(line).toMatch(/x…$/);
    expect(backticks(line) % 2).toBe(0);
  });

  it('says so when no note names the files', () => {
    expect(formatRelated({ exact: [], area: [] }, head, hint)).toBe(
      `${head}\n\nKhông có ghi chú OPEN nào nêu các file này.`,
    );
  });
});

describe('targetPatterns', () => {
  it('reads paths given on the command line as the Issue field does', () => {
    expect(targetPatterns(['tools/{notes-core,notes-for}.mjs', 'e2e/**', 'docs/x.md'])).toEqual([
      'tools/notes-core.mjs',
      'tools/notes-core.test.mjs',
      'tools/notes-for.mjs',
      'tools/notes-for.test.mjs',
      'e2e/**',
      'docs/x.md',
    ]);
  });
});
