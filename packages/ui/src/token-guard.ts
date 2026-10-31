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
 * `sep.list` and `sep.semicolon` hold. `: ` is joined by hand only between expressions of JSX; in
 * a template it also joins technical text (the path and detail of a validator issue).
 */
const JOINER = /^[,;] $/;

/**
 * Finds a `·` or `→`, a mark (`✓ ○ × ▾ ▸ —`, DR6-37), or parts joined by hand: `', '` or `'; '` as
 * a whole string or piece of a template (`.join(', ')`, `${a}, ${b}`), or `, ` / `; ` / `: `
 * between two expressions of JSX (`{a}: {b}`). The app joins parts through i18n (`sep.*`, a key
 * of `vi.ts`) and takes its marks from it, so they live in `vi.ts` only. Comments may use them.
 * The scan reads strings and templates, so a `//` or `/*` inside one opens no comment (DR6-145);
 * it does not read a regex literal, nor a mark written as a Unicode escape.
 */
export function findHardcodedSeparators(source: string): TokenViolation[] {
  const violations: TokenViolation[] = [];
  let line = 1;
  const report = (match: string, rule: TokenViolation['rule']) =>
    violations.push({ line, match, rule });
  // Code, a comment, a string (by its quote) or a template.
  let mode: 'code' | '//' | '/*' | "'" | '"' | '`' = 'code';
  // Where the string, or the piece of template, being read began.
  let start = 0;
  // What each `{` still open began: a `${` of a template, an expression of JSX, or code. JSX is
  // told by what comes before its `{`: the `>` of a tag (not of `=>`), or the `}` of JSX.
  const braces: ('template' | 'jsx' | 'code')[] = [];
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
    if (c === '·' || c === '→') report(c, 'hardcoded-separator');
    if ('✓○×▾▸—'.includes(c)) report(c, 'hardcoded-mark');
    if (mode !== 'code') {
      const opens = mode === '`' && source.startsWith('${', i);
      if (c === '\\') {
        if (source[++i] === '\n') line++;
      } else if (c === mode || opens) {
        if (JOINER.test(source.slice(start, i))) {
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
    if (c === '{') {
      braces.push(afterJsx || last === '>' ? 'jsx' : 'code');
    } else if (c === '}') {
      const opened = braces.pop();
      if (opened === 'template') {
        mode = '`';
        start = i + 1;
        continue;
      }
      closesJsx = opened === 'jsx';
      if (closesJsx && /^[,;:] \{/.test(source.slice(i + 1, i + 4))) {
        report(source.slice(i, i + 4), 'hardcoded-separator');
        i += 2; // on to the `{`, which opens JSX too
      }
    }
    last = c === '>' && source[i - 1] === '=' ? '=>' : c;
    afterJsx = closesJsx;
  }
  return violations;
}
