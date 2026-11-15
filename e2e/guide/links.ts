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

const ATX = /^ {0,3}#{1,6}[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/;
const UNDERLINE = /^ {0,3}(?:=+|-+)[ \t]*$/;
/** A thematic break, `***`, `___`, `---`: a line of its own, never the text of a heading. */
const BREAK = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
/**
 * A line of text an underline makes a setext heading: no list item, quote, table row, heading nor
 * HTML ("**Lưu ý**" is text, "* Lưu ý" an item, "<!-- … -->" a block of its own).
 */
const TEXT_LINE = /^ {0,3}(?!(?:[-*+]|\d+[.)]|#{1,6})(?:[ \t]|$)|[<>|])\S/;
/** YAML front matter, which GitHub shows as a table. */
const FRONT_MATTER = /^---\n[\s\S]*?\n(?:---|\.\.\.)[ \t]*(?:\n|$)/;
/** Named entities read; another stays as written, so a link to its heading shows as broken. */
const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** Markdown out of code as GitHub shows it: links as their text, no tag nor `_` emphasis. */
const shown = (markdown: string) =>
  markdown
    .replace(/!?\[([^\]]*)\](?:\([^)]*\)|\[[^\]]*\])/g, '$1')
    // A tag by its name: not an autolink, `<https://…>` or `<…@…>`, which GitHub shows as text.
    .replace(/<\/?[a-z][a-z\d-]*(?:[\s/][^>]*)?>/gi, '')
    // A pair of `_` runs around words, not one inside a word (`my_var`, `file__name__v2`).
    .replace(/(?<![\p{L}\p{N}_])(_+)(?=\S)(.+?)(?<=\S)\1(?![\p{L}\p{N}_])/gu, '$2')
    .replace(/&(?:#(\d{1,7})|#x([\da-f]{1,6})|([a-z]+));/gi, (entity, dec, hex, name) => {
      if (!dec && !hex) {
        const named = name.toLowerCase();
        return Object.hasOwn(ENTITIES, named) ? (ENTITIES[named] as string) : entity;
      }
      const code = parseInt(dec ?? hex, dec ? 10 : 16);
      // Past Unicode, U+FFFD (CommonMark); more digits make no entity.
      return code > 0x10ffff ? '�' : String.fromCodePoint(code);
    });

/** The text of a heading as GitHub shows it; a code span as it is written, a link's too. */
function headingText(heading: string): string {
  const code: string[] = [];
  const text = heading.replace(CODE_SPAN, (span, ticks: string) => {
    code.push(span.slice(ticks.length, -ticks.length));
    return `\u{E000}${code.length - 1}\u{E001}`;
  });
  return shown(text).replace(/\u{E000}(\d+)\u{E001}/gu, (_, at: string) => code[Number(at)] ?? '');
}

/** A line after which a new paragraph starts: blank, a heading, a break or an underline. */
const endsBlock = (line: string | undefined) =>
  line === undefined || line.trim() === '' || [ATX, BREAK, UNDERLINE].some((re) => re.test(line));

/**
 * The ids GitHub gives the headings of a Markdown text, outside code, ATX ones and one-line setext
 * ones in the order they come (L182): of the text it shows, lower case, every character but
 * letters, digits, `_`, `-` and spaces left out, spaces turned to `-`, `-1`, `-2`… after a repeated
 * one (CLR6-F7). A paragraph of more lines over an underline gives none, so a link to it shows as
 * broken; GitHub would take every line of it.
 */
export function headingIds(markdown: string): Set<string> {
  const lines = markdown
    .replace(/\r\n?/g, '\n')
    .replace(FRONT_MATTER, '')
    .replace(FENCED, '')
    .split('\n');
  const seen = new Map<string, number>();
  const ids = new Set<string>();
  lines.forEach((line, i) => {
    const setext =
      TEXT_LINE.test(line) &&
      !UNDERLINE.test(line) &&
      !BREAK.test(line) &&
      endsBlock(lines[i - 1]) &&
      UNDERLINE.test(lines[i + 1] ?? '');
    const heading = ATX.exec(line)?.[1] ?? (setext ? line.trim() : undefined);
    if (heading === undefined) return;
    const id = headingText(heading)
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
      .replaceAll(' ', '-');
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    ids.add(count ? `${id}-${count}` : id);
  });
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
