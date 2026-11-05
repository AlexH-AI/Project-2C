/**
 * A styling that bypasses the ADR-0013 tokens, or a separator or mark written in place of i18n
 * (`sep.*`, a key of `vi.ts`).
 */
interface TokenViolation {
  line: number;
  match: string;
  rule:
    | 'hex-colour'
    | 'colour-function'
    | 'raw-length'
    | 'inline-style'
    | 'arbitrary-value'
    | 'default-palette'
    | 'hardcoded-separator'
    | 'hardcoded-mark';
}

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

const RULES: ReadonlyArray<[TokenViolation['rule'], RegExp]> = [
  ['hex-colour', /#[0-9a-f]{3,8}\b/gi],
  ['colour-function', /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/gi],
  ['raw-length', /(?<![\w.[-])\d*\.?\d+(?:px|rem|em|vh|vw)\b/g],
  // A flex share read from data (the parts of a bar sized by count) is no design value; a number is.
  ['inline-style', /\bstyle=\{(?!\{ flex: [A-Za-z_$][\w$.[\]]* \}\})/g],
  ['arbitrary-value', /\b[a-z][\w-]*-\[[^\]\s]+\]/g],
  ['default-palette', new RegExp(`\\b[a-z]+-(?:(?:${PALETTE})-\\d{2,3}|white|black)\\b`, 'g')],
];

/**
 * Finds raw colours and lengths, inline styles, Tailwind arbitrary values and Tailwind's default
 * palette, which theme.css removes (such a class does nothing).
 */
export function findTokenViolations(source: string): TokenViolation[] {
  const violations: TokenViolation[] = [];
  source.split('\n').forEach((text, index) => {
    for (const [rule, pattern] of RULES) {
      for (const found of text.matchAll(pattern)) {
        violations.push({ line: index + 1, match: found[0], rule });
      }
    }
  });
  return violations;
}

/**
 * A whole string, or piece of a template, that only joins two parts (`', '`, `${a}; ${b}`): what
 * `sep.list` and `sep.semicolon` hold. `: ` is joined by hand only in JSX (`JSX_JOINER`); in a
 * template it also joins technical text (the path and detail of a validator issue).
 */
const JOINER = /^[,;] $/;

/** The call a whole string is an argument of (`text.split(', ')`, `names.join(', ')`). */
const CALLEE = /([\w$]+)\s*\((?:[^()[\]{}]*,)?\s*$/;

/**
 * After the `}` of an expression of JSX, a `, ` / `; ` / `: ` before the next expression or element,
 * however Prettier writes it: `{a},{' '}` then `{b}` on the next line, `{a}` then `, {b}` or
 * `,{' '}` on the next.
 */
const JSX_JOINER = /\s*(?:\{(?:' '|" ")\}\s*)?[,;:](?: +|\s*\{(?:' '|" ")\}\s*)(?=\{|<(?!\/))/y;

/** The separators (`sep.dot`, `sep.arrow`, `sep.range`) and marks of `vi.ts` (DR6-37, DR6-169). */
const MARKS = new Map<string, TokenViolation['rule']>([
  ...[...'·→–'].map((c) => [c, 'hardcoded-separator'] as const),
  ...[...'✓○×▾▸—←…“”‘’'].map((c) => [c, 'hardcoded-mark'] as const),
]);

/** Their HTML entities by name, which JSX decodes; any is found by number too (`&#183;`). */
const ENTITIES = new Map(
  'middot· rarr→ ndash– times× mdash— larr← hellip… ldquo“ rdquo” lsquo‘ rsquo’'
    .split(' ')
    .map((pair) => [pair.slice(0, -1), pair.slice(-1)] as const),
);
const ENTITY = /&(?:#(?:(\d+)|x([\da-f]+))|([a-z]+));/iy;
// The escapes of a string or a template that write one: `\u00b7`, `\u{b7}`, `\xb7`.
const ESCAPE = /u([\da-f]{4})|u\{0*([\da-f]{1,4})\}|x([\da-f]{2})/iy;

/** The rule a character of the given code breaks, if it is a separator or a mark. */
const markOf = (code: number) => (code > 0xffff ? undefined : MARKS.get(String.fromCharCode(code)));

/**
 * Finds a separator (`·`, `→`, `–`) or mark (`✓ ○ × ▾ ▸ — ← …`, curly quotes) of `vi.ts`, or parts
 * joined by hand: `', '` or `'; '` as a whole string or piece of a template (`.join(', ')`,
 * `${a}, ${b}`, `a + ', ' + b`), or `, ` / `; ` / `: ` after an expression of JSX and before the
 * next expression or element, however Prettier breaks the line (`{a}: {b}`, `{a},{' '}` then `{b}`,
 * `{a}: <b>{v}</b>`). The app joins parts through i18n (`sep.*`, a key of `vi.ts`) and takes its
 * marks from it, so they live in `vi.ts` only. Comments may use them. A mark is found as itself,
 * as an escape of a string or template (`'\u00b7'`, `'\u{b7}'`, `'\xb7'`) and as an HTML entity
 * (`&middot;`, `&#183;`, `&#xb7;`). The scan reads strings and templates, so a `//` or `/*` inside
 * one opens no comment (DR6-145).
 * Limits: it does not read a regex literal (an escape there is missed); a whole string given to a
 * call other than `.join(` (`text.split(', ')`, but `parts.push(', ')` too) reads as no joiner; a
 * joiner in JSX text beside a word (`{a}: b`) or after an element (`<b>{a}</b>, {b}`) is missed,
 * as JSX there is not told from code (`open ? <A /> : <B />`).
 */
export function findHardcodedSeparators(source: string): TokenViolation[] {
  const violations: TokenViolation[] = [];
  let line = 1;
  const report = (match: string, rule?: TokenViolation['rule']) => {
    if (rule) violations.push({ line, match, rule });
  };
  // Code, a comment, a string (by its quote) or a template.
  let mode: 'code' | '//' | '/*' | "'" | '"' | '`' = 'code';
  // Where the string, or the piece of template, being read began.
  let start = 0;
  // What each `{` still open began: a `${` of a template, an expression of JSX, or code. JSX is
  // told by what comes before its `{`: the `>` of a tag (not of `=>` or type arguments), or the
  // `}` of JSX.
  const braces: ('template' | 'jsx' | 'code')[] = [];
  // The lists of type arguments still open, each begun by a `<` right after a name
  // (`Promise<void>`) or inside another (`Promise<<T>() => T>`): Prettier spaces a `<` that
  // compares. The `>` that closes one is no tag's.
  // A tag written against a word of JSX text is taken for one too, closing or self-closing ones as
  // well (`one<b>`, `one</b>`, `one<br />`): the `{` right after it reads as code, so a joiner
  // there (`one</b>{a}, {b}`) is missed: the count can only miss a joiner, never flag one wrongly.
  let types = 0;
  let last = '';
  let afterJsx = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i]!;
    if (c === '\n') line++;
    if (mode === '//') {
      if (c === '\n') mode = 'code';
      continue;
    }
    if (mode === '/*') {
      if (source.startsWith('*/', i)) {
        mode = 'code';
        i++;
      }
      continue;
    }
    report(c, MARKS.get(c));
    if (c === '&') {
      ENTITY.lastIndex = i;
      const [found, dec, hex, name] = ENTITY.exec(source) ?? [];
      const code = dec ? Number(dec) : parseInt(hex ?? '', 16);
      if (found) report(found, name ? MARKS.get(ENTITIES.get(name) ?? '') : markOf(code));
    }
    if (mode !== 'code') {
      const opens = mode === '`' && source.startsWith('${', i);
      if (c === '\\') {
        ESCAPE.lastIndex = i + 1;
        const escape = ESCAPE.exec(source);
        if (escape) report(`\\${escape[0]}`, markOf(parseInt(escape.slice(1).join(''), 16)));
        // A line break saved as CRLF is escaped whole.
        if (source.startsWith('\r\n', i + 1)) i++;
        if (source[++i] === '\n') line++;
      } else if (c === mode || opens) {
        // A whole string given to a call: only `.join(` joins with it.
        const whole = source[start - 1] === c && /^\s*[,)]/.test(source.slice(i + 1, i + 40));
        const callee = whole
          ? CALLEE.exec(source.slice(Math.max(0, start - 200), start - 1))
          : null;
        if (JOINER.test(source.slice(start, i)) && (callee?.[1] ?? 'join') === 'join') {
          report(source.slice(start - 1, opens ? i + 2 : i + 1), 'hardcoded-separator');
        }
        if (opens) {
          braces.push('template');
          i++;
        }
        mode = 'code';
        last = c;
        afterJsx = false;
      } else if (c === '\n' && mode !== '`') {
        // No string runs past its line: that quote opened none (a quote in a regex literal).
        mode = 'code';
      }
      continue;
    }
    if (source.startsWith('//', i) || source.startsWith('/*', i)) {
      mode = source.startsWith('//', i) ? '//' : '/*';
      i++;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      mode = c;
      start = i + 1;
      continue;
    }
    if (/\s/.test(c)) continue;
    let closesJsx = false;
    if (c === '<' && (types > 0 || /[\w$]/.test(source[i - 1] ?? ''))) {
      types++;
    } else if (c === '{') {
      braces.push(afterJsx || last === '>' ? 'jsx' : 'code');
    } else if (c === '}') {
      const opened = braces.pop();
      if (opened === 'template') {
        mode = '`';
        start = i + 1;
        continue;
      }
      closesJsx = opened === 'jsx';
      JSX_JOINER.lastIndex = i + 1;
      const joiner = closesJsx ? JSX_JOINER.exec(source)?.[0] : undefined;
      if (joiner) {
        report(source.slice(i, i + joiner.length + 2).replace(/\s+/g, ' '), 'hardcoded-separator');
        line += joiner.split('\n').length - 1;
        i += joiner.length; // on to the `{`, which opens JSX too, or the `<` of an element
      }
    }
    if (c === '>' && source[i - 1] === '=') {
      last = '=>';
    } else if (c === '>' && types > 0) {
      types--;
      last = 'type>';
    } else {
      last = c;
    }
    afterJsx = closesJsx;
  }
  return violations;
}
