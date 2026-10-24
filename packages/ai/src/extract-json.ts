/**
 * The AI answers in free text (no `response_format`, spec §5.1); the output is the first JSON object
 * in it (§6.1): the first outermost `{…}` block that parses. A ```json fence needs no special case:
 * the object inside it is found the same way. A block nested in one that is not JSON is part of that
 * text and is not tried.
 *
 * A `{` that never closes (a brace in the prose, or an answer cut by `maxTokens`) is skipped and the
 * blocks inside it are tried in turn. In an answer known to be cut, one that opens an object (a quote
 * after it) may be the cut answer: the blocks inside it are pieces of it, not the answer (DR5-05).
 * A brace of the prose is read as in any answer, so a whole block after it is still taken however
 * the answer was cut after the block (Owner 23/10/2026, spec §6.1).
 *
 * A quote in the prose after an unclosed `{` makes what follows a string to a scan from that `{`, so
 * the text after it is read again, as many times as there are such braces up to `MAX_RESCANS`
 * (one is enough unless the prose is made to defeat it: each reading turns the quotes around).
 *
 * Linear (DR5-04): at most `MAX_RESCANS + 1` passes, and the blocks given to `JSON.parse` in a pass
 * never overlap. A failed `JSON.parse` costs an exception, so after `MAX_FAILED_PARSES` of them the
 * answer is taken to hold no JSON; a real answer has one block, or a few braces of prose before it.
 */
export type ExtractedJson =
  { readonly found: true; readonly value: unknown } | { readonly found: false };

export interface ExtractOptions {
  /** The model stopped at `maxTokens` (`finishReason` `length`): the answer may end mid-block. */
  readonly cut?: boolean;
}

const NONE: ExtractedJson = { found: false };

const MAX_FAILED_PARSES = 100;
const MAX_RESCANS = 3;

export function extractJson(content: string, { cut = false }: ExtractOptions = {}): ExtractedJson {
  let failed = 0;
  /** Whether the `{` at `start` opens an object: a key or its end comes first, after white space. */
  const opensObject = (start: number) => {
    let at = start + 1;
    while (' \t\n\r'.includes(content[at]!)) at++;
    return content[at] === '"' || content[at] === '}';
  };
  /** The block `content[start..end]` as JSON, if it is. */
  const parse = (start: number, end: number): ExtractedJson => {
    // Prose such as "{theo mẫu}" costs no exception.
    if (!opensObject(start)) return NONE;
    try {
      return { found: true, value: JSON.parse(content.slice(start, end + 1)) };
    } catch {
      failed++;
      return NONE;
    }
  };
  for (let from = 0, rescans = 0; ; rescans++) {
    /** Where each `{` still open is; quotes and `}` outside every block are prose. */
    const open: number[] = [];
    /** The outermost blocks closed inside the first `{` still open, in order. */
    const closed: { readonly start: number; readonly end: number }[] = [];
    let inString = false;
    let quoted = false;
    for (let i = from; i < content.length; i++) {
      const char = content[i];
      if (inString) {
        if (char === '\\') i++;
        else if (char === '"') inString = false;
      } else if (char === '{') open.push(i);
      else if (open.length === 0) continue;
      else if (char === '"') inString = quoted = true;
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
    if (open.length === 0) return NONE;
    // Where the cut answer may start: from there on, nothing is taken nor read again.
    const piece = (cut ? open.find(opensObject) : undefined) ?? Infinity;
    for (const { start, end } of closed) {
      if (start > piece) break;
      const json = parse(start, end);
      if (json.found || failed === MAX_FAILED_PARSES) return json;
    }
    if (!quoted || rescans === MAX_RESCANS || open[0] === piece) return NONE;
    // Read from the first unclosed `{` on, a quote in the prose may have taken the JSON for a
    // string: read again from right after it, a quote there being prose (review #521).
    from = open[0]! + 1;
  }
}
