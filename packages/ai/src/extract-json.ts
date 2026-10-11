/**
 * The AI answers in free text (no `response_format`, spec §5.1); the output is the first JSON object
 * in it (§6.1): the first outermost `{…}` block that parses. A ```json fence needs no special case:
 * the object inside it is found the same way. A block nested in one that is not JSON is part of that
 * text and is not tried.
 *
 * A `{` that never closes (a brace in the prose, or an answer cut by `maxTokens`) is skipped and the
 * blocks inside it are tried in turn, unless the answer is known to be cut: then they are pieces of
 * the cut answer, not the answer (DR5-05).
 *
 * One pass (DR5-04): each character is read once, and the blocks given to `JSON.parse` never overlap.
 * A failed `JSON.parse` costs an exception, so after `MAX_FAILED_PARSES` of them the answer is taken
 * to hold no JSON; a real answer has one block, or a few braces of prose before it.
 */
export type ExtractedJson =
  { readonly found: true; readonly value: unknown } | { readonly found: false };

export interface ExtractOptions {
  /** The model stopped at `maxTokens` (`finishReason` `length`): the answer may end mid-block. */
  readonly cut?: boolean;
}

const NONE: ExtractedJson = { found: false };

const MAX_FAILED_PARSES = 100;

export function extractJson(content: string, { cut = false }: ExtractOptions = {}): ExtractedJson {
  let failed = 0;
  /** The block `content[start..end]` as JSON, if it is. */
  const parse = (start: number, end: number): ExtractedJson => {
    // An object starts with a key or ends at once: prose such as "{theo mẫu}" costs no exception.
    let at = start + 1;
    while (' \t\n\r'.includes(content[at]!)) at++;
    if (content[at] !== '"' && content[at] !== '}') return NONE;
    try {
      return { found: true, value: JSON.parse(content.slice(start, end + 1)) };
    } catch {
      failed++;
      return NONE;
    }
  };
  /** Where each `{` still open is; quotes and `}` outside every block are prose. */
  const open: number[] = [];
  /** The outermost blocks closed inside the first `{` still open, in order. */
  const closed: { readonly start: number; readonly end: number }[] = [];
  let inString = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (inString) {
      if (char === '\\') i++;
      else if (char === '"') inString = false;
    } else if (char === '{') open.push(i);
    else if (open.length === 0) continue;
    else if (char === '"') inString = true;
    else if (char === '}') {
      const start = open.pop()!;
      // The blocks inside this one are part of it now.
      while (closed.length > 0 && closed.at(-1)!.start > start) closed.pop();
      if (open.length > 0) {
        closed.push({ start, end: i });
      } else {
        const json = parse(start, i);
        if (json.found || failed === MAX_FAILED_PARSES) return json;
      }
    }
  }
  if (cut) return NONE;
  for (const { start, end } of closed) {
    const json = parse(start, end);
    if (json.found || failed === MAX_FAILED_PARSES) return json;
  }
  return NONE;
}
