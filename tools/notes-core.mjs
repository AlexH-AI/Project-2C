// Pure part of tools/notes-for.mjs (T-261): which OPEN notes of the review notes ledger
// (`docs/state/review-notes.md`) name the files a task changes. Kept here so Vitest covers it.

/** The OPEN part of the ledger: from `## OPEN` to the next `## ` heading. */
function openLines(markdown) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === '## OPEN');
  if (start < 0) return [];
  const rest = lines.slice(start + 1).findIndex((l) => l.startsWith('## '));
  const end = rest < 0 ? lines.length : start + 1 + rest;
  return lines.slice(start + 1, end).map((text, i) => ({ text, line: start + 2 + i }));
}

/** The text inside each `code span` of a line. */
const codeSpans = (text) => [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

/** `dir/{a.ts,b.ts}` → `dir/a.ts`, `dir/b.ts`. */
function expandBraces(path) {
  const m = path.match(/^(.*?)\{([^{}]*)\}(.*)$/);
  return m
    ? m[2].split(',').flatMap((part) => expandBraces(`${m[1]}${part.trim()}${m[3]}`))
    : [path];
}

const FILES_FIELD = 'File / thư mục được phép sửa';

/**
 * The paths and globs an Issue may change: the code spans of its "File / thư mục được phép sửa"
 * field (`.github/ISSUE_TEMPLATE/task.yml`), read by `targetPatterns`.
 * @param {string} body the Issue body
 * @param {readonly string[]} repoFiles `git ls-files`
 * @returns {string[]}
 */
export function allowedPatterns(body, repoFiles) {
  const field = body.split(/^### /m).find((part) => part.startsWith(FILES_FIELD));
  return field ? targetPatterns(codeSpans(field.slice(FILES_FIELD.length)), repoFiles) : [];
}

/**
 * The repo paths a listed path with a `/` names, as for a note; a folder too wide to name
 * anything in particular (`tools/`) is dropped, a path the repo does not have yet (a file the task
 * adds) is kept.
 */
function listedPaths(name, files) {
  if (isGlob(name)) return [name];
  const named = pathsNamed(name, files);
  if (named.length) return named;
  const folder = `${name.replace(/\/$/, '')}/`;
  return files.some((f) => f.startsWith(folder)) ? [] : [name];
}

/**
 * Paths and globs as an Issue lists them: braces expanded, anything that is not a path dropped,
 * a path from the repo root taken as it is (`CLAUDE.md`), other short names and paths found in the
 * repo as a note's are (`backup.ts` next to a full path of `packages/db`), and each source file
 * with the test file next to it, as the field's "+ test" says.
 * @param {readonly string[]} listed
 * @param {readonly string[]} repoFiles `git ls-files`
 * @returns {string[]}
 */
export function targetPatterns(listed, repoFiles) {
  const names = listed
    .flatMap(expandBraces)
    .filter((name) => !/\s/.test(name) && /[/.]/.test(name));
  // The packages a bare name is looked for in first: those the listed paths are in.
  const packages = new Set(
    names.filter((name) => name.includes('/') && !isGlob(name)).map(packageOf),
  );
  const paths = names.flatMap((name) => {
    if (repoFiles.includes(name)) return [name];
    return name.includes('/')
      ? listedPaths(name, repoFiles)
      : filesNamed(name, repoFiles, packages);
  });
  const withTests = paths.flatMap((path) => {
    const source = path.match(/^([^*]+)\.(tsx?|mjs|js)$/);
    return source && !source[1].endsWith('.test')
      ? [path, `${source[1]}.test.${source[2]}`]
      : [path];
  });
  return [...new Set(withTests)];
}

const baseName = (path) => path.slice(path.lastIndexOf('/') + 1);

/** `packages/db`, `apps/desktop`, else the top folder: `tools`, `e2e`, `docs`. */
function packageOf(path) {
  const parts = path.split('/');
  return ['packages', 'apps'].includes(parts[0]) ? parts.slice(0, 2).join('/') : parts[0];
}

// A bare name or short path in more places than this, with nothing to narrow it, names nothing in
// particular.
const MAX_PLACES = 3;

/** A code span without the location after the name (`:249`, `:12-13`, `:~300`, `:84, :153`). */
const nameIn = (span) => span.replace(/:[~\d].*$/, '');

/**
 * The repo paths a span with a `/` names: the file, the files it ends (`appointments/x.ts`), or
 * the folder (two levels or more: `e2e/perf/`, `packages/db`) with a trailing `/`. A file path the
 * repo does not have stays as written: the change at hand may delete or rename that file.
 */
function pathsNamed(name, files) {
  if (files.includes(name)) return [name];
  const ends = files.filter((f) => f.endsWith(`/${name}`));
  if (ends.length) return ends;
  const folder = `${name.replace(/\/$/, '')}/`;
  if (files.some((f) => f.startsWith(folder))) return folder.split('/').length > 2 ? [folder] : [];
  return !isGlob(name) && /\.\w+$/.test(baseName(name)) ? [name] : [];
}

/**
 * Of the repo files a short name or path fits, those in `packages` when it fits several; failing
 * that, all of them unless they are too many to name anything in particular.
 */
function narrow(all, packages) {
  if (all.length < 2) return all;
  const near = all.filter((f) => packages.has(packageOf(f)));
  if (near.length) return near;
  return all.length > MAX_PLACES ? [] : all;
}

/**
 * The repo files a bare file name names, narrowed to `packages` when it is in several places;
 * failing that, the file of that name at the repo root (`CLAUDE.md`, `package.json`).
 */
function filesNamed(name, files, packages) {
  const all = files.filter((f) => baseName(f) === name);
  const atRoot = all.includes(name) && !all.some((f) => packages.has(packageOf(f)));
  return atRoot ? [name] : narrow(all, packages);
}

/**
 * The leaf bullets of the OPEN part, each with the repo paths it names.
 * @param {string} markdown the ledger
 * @param {readonly string[]} repoFiles `git ls-files`
 * @returns {{ line: number, text: string, paths: string[] }[]}
 */
export function openNotes(markdown, repoFiles) {
  const items = [];
  const parents = [];
  for (const { text, line } of openLines(markdown)) {
    // `s`: an item may hold U+2028 / U+2029 as they are, which `.` alone does not match.
    const bullet = text.match(/^( *)- (.*)$/s);
    if (!bullet) continue;
    const indent = bullet[1].length;
    while (parents.length && parents.at(-1).indent >= indent) parents.pop();
    const parent = parents.at(-1);
    const names = codeSpans(bullet[2])
      .map(nameIn)
      .flatMap(expandBraces)
      .filter((name) => !/\s/.test(name));
    const withPath = names
      .filter((name) => name.includes('/'))
      .map((n) => pathsNamed(n, repoFiles));
    // The packages a bare name, or a short path that ends several files, is looked for in first:
    // those this item and its headings name by a path to one file or folder.
    const packages = new Set([
      ...(parent?.packages ?? []),
      ...withPath.filter((paths) => paths.length === 1).map(([path]) => packageOf(path)),
    ]);
    const bare = names
      .filter((name) => !name.includes('/'))
      .flatMap((n) => filesNamed(n, repoFiles, packages));
    const own = [...new Set([...withPath.flatMap((paths) => narrow(paths, packages)), ...bare])];
    // A sub-item that names no file is about the files of its heading.
    const paths = own.length ? own : (parent?.paths ?? []);
    const item = { indent, line, text: bullet[2], paths, packages, heading: false };
    if (parent) parent.heading = true;
    parents.push(item);
    items.push(item);
  }
  return items
    .filter((item) => !item.heading)
    .map(({ line, text, paths }) => ({ line, text, paths }));
}

const isFolder = (path) => path.endsWith('/');
const isGlob = (path) => path.includes('*');

// `**` spans any folders (none too, before a slash), `*` stays within one folder.
const WILDCARDS = { '**/': '(?:.*/)?', '**': '.*', '*': '[^/]*' };

function globRegExp(glob) {
  const source = glob
    .split(/(\*\*\/|\*\*|\*)/)
    .map((part) => WILDCARDS[part] ?? part.replace(/[.+^$()|[\]\\{}?]/g, '\\$&'))
    .join('');
  return new RegExp(`^${source}$`);
}

/** Whether a glob or folder target holds the path, or a folder path holds the target. */
function covers(target, path) {
  if (isGlob(target)) {
    if (!isFolder(path)) return globRegExp(target).test(path);
    const fixed = target.slice(0, target.indexOf('*'));
    return fixed.startsWith(path) || (path.startsWith(fixed) && target.includes('**'));
  }
  if (isFolder(target))
    return path.startsWith(target) || (isFolder(path) && target.startsWith(path));
  return isFolder(path) && target.startsWith(path);
}

/**
 * The notes about the targets, each with only the paths that matched. `exact`: the note names a
 * target file. `area`: the rest that a target glob or folder holds, or whose folder holds a target.
 * @param {{ line: number, text: string, paths: string[] }[]} notes from `openNotes`
 * @param {readonly string[]} targets files, globs (`e2e/**`) or folders (`packages/ai/src/`)
 */
export function relatedNotes(notes, targets) {
  const exact = [];
  const area = [];
  for (const note of notes) {
    const same = note.paths.filter((path) => !isFolder(path) && targets.includes(path));
    if (same.length) {
      exact.push({ ...note, paths: same });
      continue;
    }
    const near = note.paths.filter((path) => targets.some((target) => covers(target, path)));
    if (near.length) area.push({ ...note, paths: near });
  }
  return { exact, area };
}

// How much of a note the list shows: enough to know it, the ledger line has the rest.
const SHOWN = 140;

/** The opening of a note, cut before a code span it would split (the list goes into Markdown). */
function shorten(text) {
  if (text.length <= SHOWN) return text;
  let cut = text.slice(0, SHOWN);
  if (cut.split('`').length % 2 === 0) cut = cut.slice(0, cut.lastIndexOf('`'));
  return `${cut.trimEnd()}…`;
}

const pathList = (paths) => paths.map((path) => `\`${path}\``).join(', ');

/**
 * What `notes-for` prints: the exact notes with their opening words, the area notes by line,
 * then `hint` (what to do with the exact ones).
 * @param {{ exact: object[], area: object[] }} related from `relatedNotes`
 * @param {string} head the first line: the ledger, its commit, what the files come from
 * @param {string} hint
 */
export function formatRelated({ exact, area }, head, hint) {
  if (!exact.length && !area.length) {
    return `${head}\n\nKhông có ghi chú OPEN nào nêu các file này.`;
  }
  const lines = [head];
  if (exact.length) {
    lines.push(
      '',
      `Trùng file (${exact.length}):`,
      ...exact.map((note) => `- L${note.line} ${pathList(note.paths)}: ${shorten(note.text)}`),
    );
  }
  if (area.length) {
    lines.push(
      '',
      `Trong vùng (${area.length}): đọc khi sửa gần đó, không bắt buộc trả lời.`,
      ...area.map((note) => `- L${note.line} ${pathList(note.paths)}`),
    );
  }
  if (exact.length) lines.push('', hint);
  return lines.join('\n');
}
