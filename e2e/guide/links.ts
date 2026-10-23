import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
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

/** The targets a Markdown text points at, outside code. */
export function linkTargets(markdown: string): string[] {
  const text = markdown
    .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '')
    .replace(CODE_SPAN, '');
  return [INLINE, REFERENCE, SRC].flatMap((pattern) =>
    [...text.matchAll(pattern)].map((match) => match[1] as string),
  );
}

/** A target inside the repo, as a path from `from`'s folder; null for a URL or an anchor alone. */
export function localPath(from: string, target: string): string | null {
  if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('#')) return null;
  const path = target.replace(/[?#].*$/, '');
  return resolve(dirname(from), decodeURI(path));
}

function markdownFiles(folder: string): string[] {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith('.md') ? [path] : [];
  });
}

/** Every relative link or image of the guide that points at nothing, as `file: target`. */
export function brokenLinks(folder = GUIDE): string[] {
  return markdownFiles(folder).flatMap((file) =>
    linkTargets(readFileSync(file, 'utf8'))
      .filter((target) => {
        const path = localPath(file, target);
        return path !== null && !existsSync(path);
      })
      .map((target) => `${relative(folder, file).replaceAll('\\', '/')}: ${target}`),
  );
}

/** Each PNG of the guide with its size in bytes. */
export function imageSizes(folder = IMG): { name: string; bytes: number }[] {
  return readdirSync(folder)
    .filter((name) => name.endsWith('.png'))
    .map((name) => ({ name, bytes: statSync(join(folder, name)).size }));
}
