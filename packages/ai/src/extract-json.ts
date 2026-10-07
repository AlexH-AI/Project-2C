/**
 * The AI answers in free text (no `response_format`, spec §5.1); the output is the first JSON object
 * in it (§6.1). A ```json fence needs no special case: the object inside it is found the same way.
 */
export type ExtractedJson =
  { readonly found: true; readonly value: unknown } | { readonly found: false };

/** The first `{…}` block of `content` that parses as JSON; text braces before it are skipped. */
export function extractJson(content: string): ExtractedJson {
  for (let start = content.indexOf('{'); start !== -1; start = content.indexOf('{', start + 1)) {
    const end = closingBrace(content, start);
    if (end === -1) continue;
    try {
      return { found: true, value: JSON.parse(content.slice(start, end + 1)) };
    } catch {
      // Not JSON (e.g. "{theo mẫu}" in the prose): try the next brace.
    }
  }
  return { found: false };
}

/** Index of the `}` that closes the `{` at `start`, skipping braces inside strings; -1 if none. */
function closingBrace(content: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let i = start; i < content.length; i++) {
    const char = content[i];
    if (inString) {
      if (char === '\\') i++;
      else if (char === '"') inString = false;
    } else if (char === '"') inString = true;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return i;
  }
  return -1;
}
