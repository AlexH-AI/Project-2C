/**
 * Finds styling that bypasses the ADR-0013 tokens: raw colours, Tailwind arbitrary values and
 * Tailwind's default palette (removed by theme.css, so such classes would silently do nothing).
 */
export interface TokenViolation {
  line: number;
  match: string;
  rule: 'hex-colour' | 'colour-function' | 'arbitrary-value' | 'default-palette';
}

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

const RULES: ReadonlyArray<[TokenViolation['rule'], RegExp]> = [
  ['hex-colour', /#[0-9a-f]{3,8}\b/gi],
  ['colour-function', /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/gi],
  ['arbitrary-value', /\b[a-z][\w-]*-\[[^\]\s]+\]/g],
  ['default-palette', new RegExp(`\\b[a-z]+-(?:(?:${PALETTE})-\\d{2,3}|white|black)\\b`, 'g')],
];

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
