import { describe, expect, it } from 'vitest';
import {
  allowedPatterns,
  formatRelated,
  hintFor,
  labelledNotes,
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
  'CLAUDE.md',
  'packages/ai/CLAUDE.md',
  'packages/db/CLAUDE.md',
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

  it('narrows a short path that ends files in many places as it does a name', () => {
    expect(
      pathsOf(
        '- `packages/ai/src/run.ts` re-export từ `src/index.ts`.',
        '- `packages/db` (#455):',
        '  - re-export từ `src/index.ts`.',
        '- `src/index.ts` lặp.',
      ),
    ).toEqual([
      ['packages/ai/src/run.ts', 'packages/ai/src/index.ts'],
      ['packages/db/src/index.ts'],
      [],
    ]);
  });

  it('keeps a file path the repo no longer has, so a PR that deletes or renames it meets the note', () => {
    const notes = openNotes(
      ledger('- `tools/gone.mjs:12`: comment.', '- `gone.mjs` trần, `tools/load-*.mjs` glob.'),
      FILES,
    );
    expect(notes.map((note) => note.paths)).toEqual([['tools/gone.mjs'], []]);
    expect(relatedNotes(notes, ['tools/gone.mjs']).exact.map((note) => note.line)).toEqual([5]);
  });

  it('takes a bare name that is a file at the repo root as that file, unless a package narrows it', () => {
    expect(
      pathsOf(
        '- `CLAUDE.md:42` (Quy trình): bước.',
        '- `packages/db` (#1):',
        '  - `CLAUDE.md` codemap.',
      ),
    ).toEqual([['CLAUDE.md'], ['packages/db/CLAUDE.md']]);
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

  it('expands braces with a space after the comma (CLR6-F6)', () => {
    expect(pathsOf('- `packages/{ai, db}/src/index.ts`.')).toEqual([
      ['packages/ai/src/index.ts', 'packages/db/src/index.ts'],
    ]);
  });

  it('keeps a name found in exactly three places, drops one found in four (CLR6-F6)', () => {
    const files = ['a/q.ts', 'b/q.ts', 'c/q.ts', 'a/r.ts', 'b/r.ts', 'c/r.ts', 'd/r.ts'];
    const notes = openNotes(ledger('- `q.ts` lặp.', '- `r.ts` lặp.'), files);
    expect(notes.map((note) => note.paths)).toEqual([['a/q.ts', 'b/q.ts', 'c/q.ts'], []]);
  });

  it('reads on past a lower heading inside OPEN, up to the next section (CLR6-F6)', () => {
    const markdown = ledger('### Nhóm A', '', '- `tools/merge-pr.mjs`: comment.');
    expect(openNotes(markdown, FILES).map((note) => note.paths)).toEqual([['tools/merge-pr.mjs']]);
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

  it('reads an item that holds a line or paragraph separator as it is', () => {
    const text = '`tools/merge-pr.mjs`: tách dòng ở \u2028 và \u2029.';
    expect(openNotes(ledger(`- ${text}`), FILES)).toEqual([
      { line: 5, text, paths: ['tools/merge-pr.mjs'] },
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
    expect(allowedPatterns(ISSUE_656, FILES)).toEqual([
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
    expect(allowedPatterns('### Mục tiêu\n\n- `packages/db/src/database.ts`', FILES)).toEqual([]);
  });

  it('reads the field under its own heading, not where another field names it (CLR6-F6)', () => {
    const body = [
      '### Mục tiêu',
      '',
      'Như ô ### File / thư mục được phép sửa của `tools/y.mjs`, xem ô File / thư mục được phép sửa.',
      '',
      '### File / thư mục được phép sửa',
      '',
      '- `packages/db/src/database.ts`',
    ].join('\n');
    expect(allowedPatterns(body, FILES)).toEqual([
      'packages/db/src/database.ts',
      'packages/db/src/database.test.ts',
    ]);
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

  it('reads a glob against a folder note one folder at a time (DR6-156)', () => {
    const notes = [{ line: 1, text: 'h', paths: ['packages/ai/src/'] }];
    const seen = (target) => lines(relatedNotes(notes, [target]).area);
    for (const target of [
      'packages/*/src/schema.ts',
      'packages/ai/src/*.ts',
      'packages/**/schema.ts',
      'packages/a*/src/x/y.ts',
    ]) {
      expect(seen(target), target).toEqual([1]);
    }
    for (const target of [
      'packages/*/lib/schema.ts',
      'packages/d*/src/schema.ts',
      'packages/*/*.ts',
      'packages/*',
      // Ends at the folder's own depth: names the folder, no path below it (review lượt 5, R156b).
      'packages/*/src',
      'packages/a*/src',
    ]) {
      expect(seen(target), target).toEqual([]);
    }
  });

  // Review #926: `^a/b.*/c\.ts$` matches no path in `a/x/`, and some in `a/bx/`.
  it('meets a folder at a part with `**` and more only where the folder begins as that part', () => {
    const notes = [
      { line: 1, text: 'x', paths: ['a/x/'] },
      { line: 2, text: 'bx', paths: ['a/bx/'] },
    ];
    const seen = (target) => lines(relatedNotes(notes, [target]).area);
    expect(seen('a/b**/c.ts')).toEqual([2]);
    expect(seen('a/b**x/c.ts')).toEqual([2]);
    expect(seen('a/x**b/c.ts')).toEqual([1]);
    expect(seen('a/c**/d.ts')).toEqual([]);
    expect(seen('a/**/c.ts')).toEqual([1, 2]);
  });

  it('finds a folder note from a glob given on the command line (DR6-156)', () => {
    const notes = openNotes(ledger('- `packages/ai/src/`: kiểm schema.'), FILES);
    const targets = targetPatterns(['packages/*/src/schema.ts'], FILES);
    expect(relatedNotes(notes, targets)).toEqual({
      exact: [],
      area: [{ line: 5, text: '`packages/ai/src/`: kiểm schema.', paths: ['packages/ai/src/'] }],
    });
  });

  it('puts a note naming the very folder a target names in area', () => {
    const { exact, area } = relatedNotes(NOTES, ['e2e/perf/']);
    expect(exact).toEqual([]);
    expect(lines(area)).toEqual([12]);
  });

  it('puts a note naming a folder that holds a target folder in area (CLR6-F6)', () => {
    expect(lines(relatedNotes(NOTES, ['packages/db/src/']).area)).toEqual([15]);
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

  it('ends without the hint when only area notes name the files', () => {
    const text = formatRelated(
      { exact: [], area: [{ line: 81, text: 'e2e', paths: ['e2e/perf/'] }] },
      head,
      hint,
    );
    expect(text.split('\n').at(-1)).toBe('- L81 `e2e/perf/`');
    expect(text).not.toContain(hint);
  });

  describe('with the notes labelled for the Issue (T-428)', () => {
    const own = (line, rest, paths = []) => ({ line, text: `**[T-9 #77]** ${rest}`, paths });
    const exactOwn = own(20, '`a/app-data.ts`: sửa.', ['a/app-data.ts']);

    it('lists the labelled notes no file of the Issue names, each once', () => {
      const text = formatRelated(
        {
          exact: [exactOwn],
          area: [
            own(30, '`e2e/perf/`: đo.', ['e2e/perf/']),
            { line: 81, text: 'e2e', paths: ['e2e/x'] },
          ],
          labelled: [
            exactOwn,
            own(30, '`e2e/perf/`: đo.', ['e2e/perf/']),
            own(40, 'chữ của spec.'),
          ],
        },
        head,
        hint,
      );
      const lines = text.split('\n');
      expect(lines.filter((line) => line.startsWith('- L20 '))).toHaveLength(1);
      expect(lines).toContain('Trong vùng (1): đọc khi sửa gần đó, không bắt buộc trả lời.');
      expect(lines).toContain('Mang nhãn của Issue #77, không trùng file (2): sửa trong task.');
      expect(lines).toContain('- L30: **[T-9 #77]** `e2e/perf/`: đo.');
      expect(lines).toContain('- L40: **[T-9 #77]** chữ của spec.');
      expect(lines.at(-1)).toBe(hint);
    });

    it('prints them, and the hint, when no note names the files', () => {
      const text = formatRelated({ exact: [], area: [], labelled: [own(40, 'chữ.')] }, head, hint);
      expect(text).toBe(
        `${head}\n\nMang nhãn của Issue #77, không trùng file (1): sửa trong task.\n` +
          `- L40: **[T-9 #77]** chữ.\n\n${hint}`,
      );
    });
  });
});

describe('labelledNotes', () => {
  it('finds the notes that open with the label of the Issue, whatever files they name', () => {
    const notes = openNotes(
      ledger(
        '- **[T-9 #77]** `tools/merge-pr.mjs:12`: comment.',
        '- **[T-9 #770]** `tools/merge-pr.mjs`: Issue khác.',
        '- **[DS-1b]** như mục **[T-9 #77]** ở trên, chưa sửa.',
        '- Nhóm ghi chú của review PR #76:',
        '  - **[T-9 #77]** chữ của spec, không file nào.',
      ),
      FILES,
    );
    expect(labelledNotes(notes, 77).map((note) => note.line)).toEqual([5, 9]);
    expect(labelledNotes(notes, '77').map((note) => note.line)).toEqual([5, 9]);
    expect(labelledNotes(notes, 7)).toEqual([]);
  });
});

describe('hintFor', () => {
  it('names the label of the Issue for an Issue, with no command left to run', () => {
    const text = hintFor('issue', 77);
    expect(text).toContain('[T-… #77]');
    expect(text).toContain('Mang nhãn của Issue');
    expect(text).not.toContain('<issue>');
    expect(text).not.toMatch(/\brg\b/);
  });

  it('names the work label while an Issue is written, not an Issue number', () => {
    const text = hintFor('files');
    expect(text).toContain('[<tên việc>]');
    expect(text).not.toContain('<issue>');
    expect(text).not.toMatch(/\[T-… #/);
  });

  it('tells a PR how to answer each note, and review how to check it', () => {
    expect(hintFor('diff')).toMatch(/^Thân PR, mục "Ghi chú OPEN liên quan"/);
    expect(hintFor('pr')).toMatch(/^review-pr \(Spec\)/);
  });
});

describe('targetPatterns', () => {
  it('reads paths given on the command line as the Issue field does', () => {
    expect(
      targetPatterns(['tools/{notes-core,notes-for}.mjs', 'e2e/**', 'docs/x.md'], FILES),
    ).toEqual([
      'tools/notes-core.mjs',
      'tools/notes-core.test.mjs',
      'tools/notes-for.mjs',
      'tools/notes-for.test.mjs',
      'e2e/**',
      'docs/x.md',
    ]);
  });

  it('finds a short name or path in the repo as a note does, and drops a one-level folder', () => {
    expect(
      targetPatterns(
        [
          'packages/ai/src/run.ts',
          'index.ts',
          'appointments/appointment-form.ts',
          'tools/',
          'e2e/perf',
          'tools/new-tool.mjs',
        ],
        FILES,
      ),
    ).toEqual([
      'packages/ai/src/run.ts',
      'packages/ai/src/run.test.ts',
      'packages/ai/src/index.ts',
      'packages/ai/src/index.test.ts',
      'apps/desktop/src/routes/appointments/appointment-form.ts',
      'apps/desktop/src/routes/appointments/appointment-form.test.ts',
      'e2e/perf/',
      'tools/new-tool.mjs',
      'tools/new-tool.test.mjs',
    ]);
  });

  it('expands every brace group of a path', () => {
    expect(targetPatterns(['packages/{db,domain}/src/{a,b}.ts'], FILES)).toEqual([
      'packages/db/src/a.ts',
      'packages/db/src/a.test.ts',
      'packages/db/src/b.ts',
      'packages/db/src/b.test.ts',
      'packages/domain/src/a.ts',
      'packages/domain/src/a.test.ts',
      'packages/domain/src/b.ts',
      'packages/domain/src/b.test.ts',
    ]);
  });

  it('reads a listed path from the repo root first', () => {
    expect(targetPatterns(['packages/db/src/x.ts', 'CLAUDE.md'], FILES)).toEqual([
      'packages/db/src/x.ts',
      'packages/db/src/x.test.ts',
      'CLAUDE.md',
    ]);
  });
});
