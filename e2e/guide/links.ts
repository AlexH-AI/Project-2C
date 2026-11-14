import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const GUIDE = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/user-guide');
export const IMG = join(GUIDE, 'img');

// Inline links and images, `[text](target "title")` / `![alt](<target>)`, and reference
// definitions, `[label]: target`.
const INLINE = /!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const REFERENCE = /^\s{0,3}\[[^\]]+\]:\s*<?(\S+?)>?(?:\s+"[^"]*")?\s*$/gm;
const SRC = /<img\b[^>]*\bsrc="([^"]+)"/g;
// A code span: a run of backticks, then text up to a run of the same length (CommonMark).
const CODE_SPAN = /(?<!`)(`+)(?!`)[^\n]*?(?<!`)\1(?!`)/g;
// A fenced code block.
const FENCED = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm;

/** The targets a Markdown text points at, outside code. */
export function linkTargets(markdown: string): string[] {
  const text = markdown.replace(FENCED, '').replace(CODE_SPAN, '');
  return [INLINE, REFERENCE, SRC].flatMap((pattern) =>
    [...text.matchAll(pattern)].map((match) => match[1] as string),
  );
}

/**
 * The ids GitHub gives the headings of a Markdown text, outside code: lower case, every character
 * but letters, digits, `_`, `-` and spaces left out, spaces turned to `-`, `-1`, `-2`… after a
 * repeated one (CLR6-F7).
 */
export function headingIds(markdown: string): Set<string> {
  const text = markdown.replace(FENCED, '');
  const seen = new Map<string, number>();
  const ids = new Set<string>();
  for (const [, heading] of text.matchAll(/^ {0,3}#{1,6}[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/gm)) {
    const id = (heading as string)
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
      .replaceAll(' ', '-');
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    ids.add(count ? `${id}-${count}` : id);
  }
  return ids;
}

function markdownFiles(folder: string): string[] {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith('.md') ? [path] : [];
  });
}

/**
 * Every relative link or image of the guide that points at nothing, as `file: target`: a file that
 * is not there, with each name below `root` in the case it is written in (GitHub tells case apart,
 * Windows does not), or an `#anchor` that is no heading of the Markdown file it names.
 */
export function brokenLinks(folder = GUIDE, root = resolve(GUIDE, '../..')): string[] {
  const listings = new Map<string, string[]>();
  const names = (dir: string) => {
    if (!listings.has(dir)) listings.set(dir, existsSync(dir) ? readdirSync(dir) : []);
    return listings.get(dir) as string[];
  };
  const existsAsWritten = (path: string) => {
    const below = relative(root, path);
    if (below.startsWith('..') || isAbsolute(below)) return existsSync(path);
    let dir = root;
    for (const name of below.split(sep).filter(Boolean)) {
      if (!names(dir).includes(name)) return false;
      dir = join(dir, name);
    }
    return true;
  };
  const ids = new Map<string, Set<string>>();
  const idsOf = (file: string) => {
    if (!ids.has(file)) ids.set(file, headingIds(readFileSync(file, 'utf8')));
    return ids.get(file) as Set<string>;
  };
  const broken = (file: string, target: string) => {
    if (/^[a-z][a-z\d+.-]*:/i.test(target)) return false;
    const [, path = '', anchor = ''] = /^([^?#]*)(?:\?[^#]*)?(?:#(.*))?$/.exec(target) ?? [];
    const named = path === '' ? file : resolve(dirname(file), decodeURI(path));
    if (path !== '' && !existsAsWritten(named)) return true;
    return anchor !== '' && named.endsWith('.md') && !idsOf(named).has(decodeURIComponent(anchor));
  };
  return markdownFiles(folder).flatMap((file) =>
    linkTargets(readFileSync(file, 'utf8'))
      .filter((target) => broken(file, target))
      .map((target) => `${relative(folder, file).replaceAll('\\', '/')}: ${target}`),
  );
}

/** Each PNG of the guide with its size in bytes. */
export function imageSizes(folder = IMG): { name: string; bytes: number }[] {
  return readdirSync(folder)
    .filter((name) => name.endsWith('.png'))
    .map((name) => ({ name, bytes: statSync(join(folder, name)).size }));
}
