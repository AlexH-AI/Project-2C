/** A line under a field: its error, what the app read from the text, or its help. */
export interface FieldNote {
  id: string;
  tone: 'error' | 'read' | 'help';
  text: string;
}

/**
 * The lines under the field `id`, in the order they show, and its `aria-describedby`, which reads
 * them all: the error, or while there is none what the app read (`hint`); then the help, whatever
 * was typed.
 */
export function fieldNotes(
  id: string,
  { error, hint, help }: { error?: string; hint?: string; help?: string },
): { notes: FieldNote[]; describedBy: string | undefined } {
  const notes: FieldNote[] = [];
  const add = (tone: FieldNote['tone'], text = '') => {
    if (text) notes.push({ id: `${id}-${tone}`, tone, text });
  };
  if (error) add('error', error);
  else add('read', hint);
  add('help', help);
  return { notes, describedBy: notes.map((note) => note.id).join(' ') || undefined };
}

/**
 * The `aria-describedby` of a field that a line outside it describes too (`outside`, the id of that
 * line: what a KYC field holds already, above the field for its new value): that line first, then
 * the field's `own` lines.
 */
export function describedBy(outside: string | undefined, own: string | undefined) {
  return [outside, own].filter(Boolean).join(' ') || undefined;
}
