/**
 * Mock provider (spec Phase 5 §10, D-1 item 6): for demos and e2e, only when chosen in Settings.
 * Nothing random: the answer is built from the input message alone, with fixed sentences, so the
 * same input always gives the same output. Analysis and discovery cite only the codes of the input's
 * facts list and its missing hạng mục; extraction recognises a few simple phrases said of the KH,
 * for the trường of the input's `fields` list only.
 *
 * The input is the first `user` message, a JSON block: `{ mode, facts, missingCategories, … }` for
 * analysis / discovery, `{ note, fields }` for extraction (prompts §1.1, §4.1).
 *
 * The answers themselves are `mockAnalysisOutput` / `mockDiscoveryOutput` of `schema.ts`, which the
 * seed of `db` writes too. They pass the mode's schema for every input the KYC gate lets through
 * (`kyc-gate.ts`): analysis needs at least one fact; discovery needs two strategy items, one per
 * missing hạng mục and one more when a fact is known, so the gate's facts and missing hạng mục are
 * enough. Other inputs get an answer the schema rejects, as a real model's could be.
 */
import { KYC_CATEGORIES, type KycCategory } from '@p2c/domain';
import type { AiAdapter, AiCompleteRequest, AiCompletion } from './adapter';
import { AiError } from './errors';
import { extractJson } from './extract-json';
import {
  FACT_CODE,
  mockAnalysisOutput,
  mockDiscoveryOutput,
  type ExtractionOutput,
} from './schema';

export function createMockAdapter(): AiAdapter {
  return {
    complete: async (request) => answer(request),
  };
}

function answer(request: AiCompleteRequest): AiCompletion {
  const content = request.messages.find((message) => message.role === 'user')?.content ?? '';
  const json = extractJson(content);
  if (!json.found) throw new AiError('AI_BAD_REQUEST');
  // extractJson only finds `{…}` blocks, so the value is an object.
  const input = json.value as Record<string, unknown>;
  const output =
    typeof input['note'] === 'string'
      ? extraction(input['note'], allowedFields(input['fields']))
      : (input['mode'] === 'discovery' ? mockDiscoveryOutput : mockAnalysisOutput)(
          factCodes(input['facts']),
          missingCategories(input['missingCategories']),
        );
  return { content: JSON.stringify(output), promptTokens: 0, completionTokens: 0 };
}

/** The `code` of each element of an input list (facts, missing hạng mục); none when not a list. */
function codesOf(value: unknown): unknown[] {
  const items: unknown[] = Array.isArray(value) ? value : [];
  return items.map((item) => (item as { code?: unknown } | null)?.code);
}

/** Codes of the facts list, in order; a `F…` word inside a fact's value is not a code. */
function factCodes(value: unknown): string[] {
  const codes = codesOf(value).filter(
    (code): code is string => typeof code === 'string' && FACT_CODE.test(code),
  );
  return [...new Set(codes)];
}

function missingCategories(value: unknown): KycCategory[] {
  const codes = codesOf(value);
  return KYC_CATEGORIES.filter((category) => codes.includes(category));
}

/**
 * After "<n> con / bé / cháu", what makes them not children: grandchildren ("cháu nội / ngoại"),
 * figures ("con số", DR6-19), animals and things ("2 con chó", "10 con bò", "2 con robot", DR6-78,
 * DR6-121). Written small: a capital after "con" is a name or a brand ("5 con Gà", "3 con Lexus").
 */
const NOT_CHILDREN = [
  'nội|ngoại|số',
  'chó|mèo|bò|bê|trâu|lợn|heo|gà|vịt|ngan|ngỗng|cá|tôm|cua|chim|chuột|ngựa|dê|cừu|thỏ|ong|vẹt|cún',
  'thú|vật|xe|tàu|thuyền|dao|robot',
].join('|');

/**
 * "sắp" / "sẽ" and up to two words, right before a phrase: "KH sắp có 2 con", "KH sẽ sống độc
 * thân". Only that close: either word is common in a note ("KH sẽ cân nhắc vì đã kết hôn"), and
 * the first Mock did not read them. The other wish words reach the whole clause (`WISHED`). One
 * space between the words, as in `PEOPLE`.
 */
const PLANNING = String.raw`(?<!\p{L})(?:[Ss]ắp|[Ss]ẽ)(?: \p{L}+){0,2} `;

/** Not planned: nothing of `PLANNING` right before the phrase. */
const NOT_PLANNED = String.raw`(?<!${PLANNING})`;

/**
 * Not planned, for children: what is planned is having them ("sẽ có thêm 2 con", "sắp sinh 2
 * con", "sẽ nhận nuôi 2 con"), not "KH sẽ cho 2 con đi học thêm".
 */
const NOT_PLANNED_CHILDREN = String.raw`(?<!${PLANNING}(?:có|sinh|đẻ|nhận nuôi) (?:thêm |được )?)`;

/**
 * Not of anyone: "người" right before a phrase says it of anyone ("gói cho người đã kết hôn",
 * DR6-121).
 */
const NOT_OF_ANYONE = String.raw`(?<!(?<!\p{L})người )`;

/**
 * A "cho" right before a phrase: what a wish earlier in its clause is for, not the wish itself
 * ("KH muốn đầu tư cho 2 con" wishes the investing; the children are there already).
 */
const AFTER_CHO = 'cho ';

/**
 * "cưới" of the KH marrying, not of a wedding the KH goes to: in "đám / ăn / tiệc / thiệp / lễ /
 * mừng cưới bạn", "đi cưới bạn" and "đám cưới chồng cũ" the one after it is the one marrying.
 */
const MARRYING = '(?<!(?:đám|ăn|tiệc|thiệp|lễ|mừng|đi) )cưới';

/**
 * What makes a wife or a husband the KH's own, not someone else's: "có vợ", "sống cùng vợ",
 * "lấy chồng", "và vợ", "cưới vợ".
 */
const OWN_SPOUSE = `và|có|cùng|với|lấy|${MARRYING}`;

/**
 * Someone other than the KH: named before a phrase in its sentence, the phrase is about them
 * (DR6-19, DR6-78). A word that may also name the KH ("cô", "ông"…) gives no proposal rather than
 * a wrong one; so do the KH's own children and brothers and sisters named first ("KH có 2 con, đã
 * kết hôn." may be about the children, "Anh chị em của KH đều đã kết hôn." is about them). Not
 * "vợ chồng" nor a wife or a husband of the KH ("KH và vợ", "đã có vợ", "lấy chồng"), nor a friend
 * the KH marries ("kết hôn với bạn", "cưới bạn"): the couple, the KH one of them. Not the words
 * that hold a kin word but name no one: "bác sĩ", "cô giáo", "chú ý", "ghi chú", "đàn ông",
 * "em bé"…, though a kin word before "em bé" names the baby's own ("ba / anh / chị em bé"); "ba"
 * only as a parent. One space between the words, as a note is stored and as "anh trai" is read,
 * not `\s+`: `SOMEONE_ELSE` tries each lookbehind at every place of a sentence, so one reading a
 * run of spaces back took a second for 36 000 of them (in a note that also had a phrase to read).
 */
const PEOPLE = [
  'con|cháu|anh em|anh trai|anh họ|anh rể|anh ruột|anh của',
  'chị em|chị gái|chị họ|chị dâu|chị ruột|chị của',
  String.raw`em(?! bé(?!\p{L}))|(?<!đàn )ông|bà|cô(?! (?:giáo|đơn|dâu))`,
  '(?<!ghi )chú(?! (?:ý|trọng|thích))|bác(?! (?:sĩ|bỏ))|dì|cậu|mợ|thím|dượng',
  'bố|mẹ|cha|má',
  String.raw`ba(?= (?:của|kh|anh|chị|em|ấy|ruột|nuôi)(?!\p{L}))`,
  `(?<!(?:${OWN_SPOUSE}) )vợ(?! chồng)|(?<!(?:vợ|${OWN_SPOUSE}) )chồng`,
  `(?<!(?:kết hôn với|lấy|${MARRYING}) )(?:bạn|sếp|hàng xóm|người quen|đồng nghiệp|người thân|họ hàng)`,
].join('|');

/** The words of `PEOPLE`, in any case. */
const SOMEONE_ELSE = new RegExp(String.raw`(?<!\p{L})(?:${PEOPLE})(?!\p{L})`, 'iu');

const EXTRACTION_PATTERNS: readonly {
  readonly field: string;
  readonly pattern: RegExp;
  readonly value: (match: RegExpExecArray) => string;
  /** Said later in its sentence, it ends what the phrase says: "đã kết hôn … ly hôn". */
  readonly endedBy?: RegExp;
  /** Right before the phrase, it makes the phrase no wish of a wish word earlier in its clause. */
  readonly unwishedAfter?: string;
}[] = [
  // Narrow on purpose (CX-A4): what may mean something else gives no proposal.
  {
    field: 'childrenCount',
    pattern: new RegExp(
      [
        NOT_PLANNED_CHILDREN,
        String.raw`(?<!\p{N})(\d{1,2})\s+(?:con|bé|cháu)(?!\p{L})`,
        // A capital is a name or a brand, "của <someone else>" is theirs.
        String.raw`(?!\p{Zs}+\p{Lu})(?!\s+(?:${NOT_CHILDREN})(?!\p{L}))`,
        String.raw`(?!\s+của\s+(?:${PEOPLE})(?!\p{L}))`,
      ].join(''),
      'gu',
    ),
    value: (match) => match[1]!,
    unwishedAfter: AFTER_CHO,
  },
  {
    field: 'maritalStatus',
    // Only "đã kết hôn": not "chưa / không muốn / … năm kết hôn" nor "đã từng kết hôn".
    pattern: new RegExp(String.raw`(?<=${NOT_OF_ANYONE}(?<!\p{L})đã\s+)kết hôn(?!\p{L})`, 'giu'),
    value: () => 'Đã kết hôn',
    endedBy: /(?<!\p{L})ly hôn(?!\p{L})/giu,
  },
  // A word of its own: "khôngđộc thân" (no space) is no more single than "không độc thân".
  {
    field: 'maritalStatus',
    pattern: new RegExp(
      String.raw`${NOT_PLANNED}${NOT_OF_ANYONE}(?<!\p{L})độc thân(?!\p{L})`,
      'giu',
    ),
    value: () => 'Độc thân',
  },
];

/** Trường of the input's `fields` list (prompts §4.1), so that V7 keeps what the Mock proposes. */
function allowedFields(value: unknown): string[] {
  const items: unknown[] = Array.isArray(value) ? value : [];
  return items
    .map((item) => (item as { field?: unknown } | null)?.field)
    .filter((field): field is string => typeof field === 'string');
}

/** Said as a supposition, before a phrase in its sentence: "nếu đã kết hôn, có 2 con" (DR6-78). */
const SUPPOSED =
  /(?<!\p{L})(?:nếu|giả sử|giả thử|giả như|giả định|giá mà|giá như|lỡ như|nhỡ như|trường hợp)(?!\p{L})/iu;

/**
 * Said as a wish or a plan, before a phrase in its clause: "KH muốn có 2 con", "dự định sống độc
 * thân", "muốn đợi đến khi đã kết hôn". Anywhere before it, as the first Mock read it: how far a
 * wish reaches cannot be told by counting words ("dự định 2 năm nữa sinh thêm 1 con").
 */
const WISHED = /(?<!\p{L})(?:muốn|mong|dự định|hy vọng|hi vọng)(?!\p{L})/iu;

/** Said not to be: before a phrase in its clause ("KH không có 2 con"). */
const NEGATED = /(?<!\p{L})(?:không|chưa|chẳng)(?!\p{L})/iu;

/**
 * A guess or a question mark, anywhere in the sentence of a phrase, before it or after it:
 * "Có lẽ KH đã kết hôn.", "KH có 2 con, hình như.", "KH đã kết hôn?" (DR6-121).
 */
const GUESSED = /(?<!\p{L})(?:có lẽ|hình như|nghe nói|chắc là)(?!\p{L})|\?/iu;

/** A clause ending in "chưa" or "không" asks ("KH đã kết hôn chưa."); inside a clause they do not. */
const ASKED = /(?<!\p{L})(?:chưa|không)(?!\p{L})[\p{P}\s]*$/iu;

/** "Khi … thì": what stands between them is a condition, not a fact (DR6-121). */
const WHEN = /(?<!\p{L})khi(?!\p{L})/iu;
const THEN = /(?<!\p{L})thì(?!\p{L})/giu;

const SENTENCE_END = /[.!?;\n]/g;
const CLAUSE_END = /[.!?;,\n]/g;

/** A sentence or a clause of the note, with where it starts in the note. */
type Part = { readonly text: string; readonly start: number };

/** Where `word` first ends in `part`, as a position in the note; never when it is not there. */
function firstEnd(word: RegExp, part: Part): number {
  const first = word.exec(part.text);
  return first ? part.start + first.index + first[0].length : Infinity;
}

/** Where `word`, a regex with the `g` flag, last starts in `part`; never when it is not there. */
function lastStart(word: RegExp, part: Part): number {
  let last = -Infinity;
  for (const found of part.text.matchAll(word)) last = part.start + found.index;
  return last;
}

/**
 * Reads the parts of `note` that end after each mark of `ends`: `read` runs once on the part holding
 * the phrases it is asked of, in order, however many they are. So all the phrases take one pass
 * over the note, however long its parts (DR6-79).
 */
function readerOf(note: string, ends: RegExp) {
  const starts = [0, ...[...note.matchAll(ends)].map((mark) => mark.index + 1)];
  return <T>(read: (part: Part) => T): ((at: number) => T) => {
    let index = -1;
    let seen: T | undefined;
    return (at) => {
      let next = Math.max(index, 0);
      while (next + 1 < starts.length && starts[next + 1]! <= at) next++;
      if (next !== index) {
        index = next;
        const start = starts[index]!;
        seen = read({ text: note.slice(start, starts[index + 1]), start });
      }
      return seen as T;
    };
  };
}

type Reader = ReturnType<typeof readerOf>;

/** What a sentence says around its phrases, as positions in the note. */
function readSentence(sentence: Part) {
  return {
    someoneElse: firstEnd(SOMEONE_ELSE, sentence),
    supposed: firstEnd(SUPPOSED, sentence),
    whenEnd: firstEnd(WHEN, sentence),
    thenStart: lastStart(THEN, sentence),
    guessed: GUESSED.test(sentence.text),
  };
}

/** What a clause says around its phrases, as positions in the note. */
function readClause(clause: Part) {
  return {
    negated: firstEnd(NEGATED, clause),
    wished: firstEnd(WISHED, clause),
    asked: ASKED.test(clause.text),
  };
}

/**
 * Whether the phrase starting at `at` says something of the KH (DR6-19), asked of the phrases in
 * order: no one else named and no supposition before it in its sentence ("Em trai KH còn độc
 * thân", "KH có một con trai đang sống độc thân"), no guess or "khi … thì" around it there, no
 * negation or wish before it in its clause ("KH không có 2 con", "KH muốn có 2 con") and no
 * question ("KH đã kết hôn chưa."). Narrow, as the patterns are. `unwished`: what the wish is for,
 * not the wish.
 */
function aboutTheKh(
  sentence: Reader,
  clause: Reader,
): (phrase: { at: number; unwished: boolean }) => boolean {
  const ofSentence = sentence(readSentence);
  const ofClause = clause(readClause);
  return ({ at, unwished }) => {
    const inSentence = ofSentence(at);
    const inClause = ofClause(at);
    return !(
      inSentence.guessed ||
      inClause.asked ||
      inSentence.someoneElse <= at ||
      inSentence.supposed <= at ||
      (inSentence.whenEnd <= at && at < inSentence.thenStart) ||
      inClause.negated <= at ||
      (inClause.wished <= at && !unwished)
    );
  };
}

function extraction(note: string, fields: readonly string[]): ExtractionOutput {
  const sentence = readerOf(note, SENTENCE_END);
  const ofTheKh = aboutTheKh(sentence, readerOf(note, CLAUSE_END));
  const facts = EXTRACTION_PATTERNS.filter(({ field }) => fields.includes(field))
    .flatMap(({ field, pattern, value, endedBy, unwishedAfter }) => {
      const ended = endedBy && sentence((part) => lastStart(endedBy, part));
      return [...note.matchAll(pattern)]
        .map((match) => ({
          at: match.index,
          unwished: !!unwishedAfter && note.endsWith(unwishedAfter, match.index),
          fact: { field, value: value(match), quote: match[0] },
        }))
        .filter(({ at }) => !ended || ended(at) < at);
    })
    .sort((a, b) => a.at - b.at)
    .filter(ofTheKh)
    .map(({ fact }) => fact);
  return { facts: facts.slice(0, 20) };
}
