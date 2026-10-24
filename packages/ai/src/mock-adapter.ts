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
 * space between the words, as in `KH_SUBJECT`.
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
 * "KH" opening its clause, maybe after "Hiện / Hiện tại / Hiện nay", and up to two of "đã / đang /
 * hiện / vừa / mới / sống / ở": the KH the subject of what follows ("KH đã", "KH đang sống", "Hiện
 * KH có", "Theo chị Lan, KH là", "- KH có"), not someone's nor an object ("Người yêu của KH đã
 * có", "Người giới thiệu KH là", the review of PR #809). Its clause ends at a mark of `CLAUSE_END`
 * or at ":". Up to two, and one space between the words as a note is stored and as "anh trai" is
 * read, not `\s+`: these lookbehinds are tried at every place of a sentence, and one reading a run
 * of spaces back took a second for 36 000 of them (the review of PR #753). The look back for the
 * start of the clause is tried only where "KH" stands, and lazy: it stops at the first letter.
 */
const KH_SUBJECT = String.raw`(?<!\p{L}[^.!?;,:\n]*?)(?:[Hh]iện(?: tại| nay)? )?KH(?: (?:đã|đang|hiện|vừa|mới|sống|ở)){0,2}`;

/**
 * Not of anyone: "người" right before a phrase says it of anyone ("gói cho người đã kết hôn",
 * DR6-121), but in the KH's own "KH là người độc thân" (T-289).
 */
const NOT_OF_ANYONE = String.raw`(?<!(?<!${KH_SUBJECT} là )(?<!\p{L})người )`;

/**
 * "thì" or ":" right before "chưa / không": an answer, saying that what stands before it is not so
 * ("KH độc thân thì không", "Đã kết hôn: chưa", "nợ: không"), not a question (the review of PR
 * #809).
 */
const ANSWERED = String.raw`(?:(?<!\p{L})thì |: ?)`;

/** After a phrase, they ask it or say it is not so. */
const NOT_SO = 'chưa|không';

/** Before or after a phrase, the other way it may be. */
const OR = 'hay|hoặc';

/**
 * Not asked nor said not to be: no "chưa", "không", "hay" or "hoặc" right after the phrase, however
 * its clause goes on ("KH đã kết hôn chưa nhé", "có 2 con không nhỉ", "đã kết hôn hay còn độc
 * thân", T-289), nor an answer ("KH đã kết hôn thì không đúng", "Đã kết hôn: chưa rõ"). Not past a
 * line break, which ends the sentence (N19d): "KH đã kết hôn\nKhông hút thuốc." (T-288).
 */
const NOT_ASKED = String.raw`(?!(?:[^\S\n]*${ANSWERED}|[^\S\n]+)(?:${NOT_SO})(?!\p{L})|[^\S\n]+(?:${OR})(?!\p{L}))`;

/** A wife or a husband, and people the KH knows. */
const SPOUSE = 'vợ|chồng';
const KNOWN = 'bạn|sếp|hàng xóm|người quen|đồng nghiệp|người thân|họ hàng';

/** How the KH marries someone: "KH lấy chồng", "KH cưới vợ", "KH kết hôn với bạn". */
const MARRY = 'lấy|cưới|kết hôn với';

/** What makes the wife or husband after it someone's own: "có vợ", "sống cùng chồng", "cưới vợ". */
const WITH_PARTNER = `có|cùng|với|${MARRY}`;

/**
 * Someone other than the KH: named before a phrase in its sentence, the phrase is about them
 * (DR6-19, DR6-78). A word that may also name the KH ("cô", "ông"…) gives no proposal rather than
 * a wrong one; so do the KH's own children and brothers and sisters named first ("KH có 2 con, đã
 * kết hôn." may be about the children, "Anh chị em của KH đều đã kết hôn." is about them). "anh"
 * or "chị" alone may be the KH. Where some of these words name no one else: `NAMES_NO_ONE`,
 * `SAID_OF_THE_KH`.
 */
const PEOPLE = [
  'con|cháu|anh em|anh trai|anh họ|anh rể|anh ruột|anh của',
  'chị em|chị gái|chị họ|chị dâu|chị ruột|chị của',
  'em|ông|bà|cô|chú|bác|dì|cậu|mợ|thím|dượng|bố|mẹ|cha|má',
  SPOUSE,
  KNOWN,
].join('|');

/** The words of `PEOPLE`, in any case, and "ba" as a parent, not as a number ("ba năm"). */
const SOMEONE_ELSE = new RegExp(
  String.raw`(?<!\p{L})(?:${PEOPLE}|ba(?= (?:của|kh|anh|chị|em|ấy|ruột|nuôi)(?!\p{L})))(?!\p{L})`,
  'iu',
);

/**
 * Words of `PEOPLE` that name no one else, anywhere and in any case: inside a word that holds a kin
 * word ("bác sĩ", "cô giáo", "cô đơn", "chú ý", "chú trọng", "ghi chú"), in the heading "Chú
 * thích:" and in the couple, the KH one of them ("vợ chồng", "KH và vợ"). Not a couple someone
 * lives with or has (`WITH_PARTNER`): "KH sống cùng vợ chồng anh Nam" names them (the review of PR
 * #809). So none of these words is one of `OWN_PARTNER`, and which is read first does not matter.
 */
const NAMES_NO_ONE = new RegExp(
  String.raw`(?<!\p{L})(?:bác sĩ|cô giáo|cô đơn|chú ý|chú trọng|ghi chú|chú thích(?=:)|(?<!(?:${WITH_PARTNER}) )vợ chồng|(?<=và )(?:${SPOUSE}))(?!\p{L})`,
  'giu',
);

/**
 * The KH's own wife or husband ("KH đã có vợ", "KH sống cùng chồng", "KH cưới vợ"), not someone
 * else's ("vợ của anh Nam"), and a friend the KH marries ("KH kết hôn với bạn", "KH lấy đồng
 * nghiệp"). Only right after the KH (T-289): "Khách mới có vợ…", "KH giới thiệu anh Nam, có vợ…",
 * "KH đi dự cưới bạn…", "Người yêu của KH đã có vợ…" say it of someone else.
 */
const OWN_PARTNER = [
  String.raw`(?<=${KH_SUBJECT} (?:${WITH_PARTNER}) )(?:${SPOUSE})(?! của(?!\p{L}))`,
  String.raw`(?<=${KH_SUBJECT} (?:${MARRY}) )(?:${KNOWN})`,
].join('|');

/**
 * Words of `PEOPLE` that name no one else right after the KH: words holding a kin word that the KH
 * is or does ("KH là đàn ông / cô dâu", "KH có em bé", "KH bác bỏ") and the KH's partner
 * (`OWN_PARTNER`). Elsewhere, as before PR #753, they may name who a phrase is about: "Cô dâu đã có
 * 2 con riêng.", "Bác bỏ thuốc lá…" (the uncle quit), "KH có em bé nhất / hơn…" (the youngest, a
 * younger one), "KH có em Bé" (a name) (T-289).
 */
const SAID_OF_THE_KH = new RegExp(
  String.raw`(?:${[
    String.raw`(?<=${KH_SUBJECT} là )(?:đàn ông|cô dâu)`,
    String.raw`(?<=${KH_SUBJECT} có )em bé(?! (?:nhất|hơn)(?!\p{L}))`,
    String.raw`(?<=${KH_SUBJECT} )bác bỏ`,
    OWN_PARTNER,
  ].join('|')})(?!\p{L})`,
  'gu',
);

/**
 * The KH's partner named before a phrase in its clause is who the phrase is about ("KH lấy chồng
 * đã có 2 con riêng"), unless "và" joins them ("KH đã có vợ và 2 con") (T-289).
 */
const PARTNER_FIRST = new RegExp(String.raw`(?:${OWN_PARTNER})(?!\p{L})(?! và(?!\p{L}))`, 'u');

/** A count of people: "ba người bạn", "các anh", "2 người". */
const HOW_MANY = String.raw`một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|mấy|vài|các|những|\d+`;

/**
 * "của" and someone else right after "<n> con / bé / cháu": their children ("2 con của anh trai",
 * DR6-121). Any word of `PEOPLE`, in any case and none spared ("2 con của cô giáo", "của vợ chồng
 * anh Nam") (T-289), a count of people or "người" ("của hai người bạn", "của người khác") (T-288).
 * Sticky, tried where the count ends: the count's own pattern tells case ("2 con Lexus"), which this
 * list cannot share.
 */
const OF_SOMEONE_ELSE = new RegExp(
  String.raw`\s+của\s+(?:${PEOPLE}|${HOW_MANY}|người)(?!\p{L})`,
  'iuy',
);

const EXTRACTION_PATTERNS: readonly {
  readonly field: string;
  readonly pattern: RegExp;
  readonly value: (match: RegExpExecArray) => string;
  /** Said later in its sentence, it ends what the phrase says: "đã kết hôn … ly hôn". */
  readonly endedBy?: RegExp;
  /** Right after the phrase (a sticky regex), it makes the phrase someone else's. */
  readonly ownerAfter?: RegExp;
  /** Whether the phrase at `at`, up to `end`, is no wish of a wish word earlier in its clause. */
  readonly unwished?: (note: string, at: number, end: number) => boolean;
}[] = [
  // Narrow on purpose (CX-A4): what may mean something else gives no proposal.
  {
    field: 'childrenCount',
    pattern: new RegExp(
      [
        NOT_PLANNED_CHILDREN,
        String.raw`(?<!\p{N})(\d{1,2})\s+(?:con|bé|cháu)(?!\p{L})`,
        // A capital is a name or a brand.
        String.raw`(?!\p{Zs}+\p{Lu})(?!\s+(?:${NOT_CHILDREN})(?!\p{L}))`,
        NOT_ASKED,
      ].join(''),
      'gu',
    ),
    value: (match) => match[1]!,
    ownerAfter: OF_SOMEONE_ELSE,
    unwished: forTheChildren,
  },
  {
    field: 'maritalStatus',
    // Only "đã kết hôn": not "chưa / không muốn / … năm kết hôn" nor "đã từng kết hôn".
    pattern: new RegExp(
      String.raw`(?<=${NOT_OF_ANYONE}(?<!\p{L})đã\s+)kết hôn(?!\p{L})${NOT_ASKED}`,
      'giu',
    ),
    value: () => 'Đã kết hôn',
    endedBy: /(?<!\p{L})ly hôn(?!\p{L})/giu,
  },
  // A word of its own: "khôngđộc thân" (no space) is no more single than "không độc thân".
  {
    field: 'maritalStatus',
    pattern: new RegExp(
      String.raw`${NOT_PLANNED}${NOT_OF_ANYONE}(?<!\p{L})độc thân(?!\p{L})${NOT_ASKED}`,
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

/**
 * Said as a supposition or as what may be, before a phrase in its sentence: "nếu đã kết hôn, có 2
 * con" (DR6-78), "Có thể KH đã kết hôn." (T-289). Only before it: after it, "có thể" says what can
 * be ("KH đã kết hôn, có thể đóng phí năm").
 */
const SUPPOSED =
  /(?<!\p{L})(?:nếu|giả sử|giả thử|giả như|giả định|giá mà|giá như|lỡ như|nhỡ như|trường hợp|có thể)(?!\p{L})/iu;

/**
 * Said as a wish or a plan, before a phrase in its clause: "KH muốn có 2 con", "dự định sống độc
 * thân", "muốn đợi đến khi đã kết hôn". Anywhere before it, as the first Mock read it: how far a
 * wish reaches cannot be told by counting words ("dự định 2 năm nữa sinh thêm 1 con").
 */
const WISHED = /(?<!\p{L})(?:muốn|mong|dự định|hy vọng|hi vọng)(?!\p{L})/iu;

/**
 * Said not to be: before a phrase in its clause ("KH không có 2 con", "KH phủ nhận đã kết hôn",
 * T-288).
 */
const NEGATED = /(?<!\p{L})(?:không|chưa|chẳng|bác bỏ|phủ nhận)(?!\p{L})/iu;

/**
 * "chắc" said unsure, as a guess ("chắc là", "hỏi lại cho chắc": to be made sure of) or a doubt
 * ("không chắc chắn", "chưa biết chắc"); not "chắc" of a word that is sure or firm: "chắc chắn",
 * "chắc ăn", "biết / nắm chắc", "vững / săn / rắn chắc" (T-288).
 */
const UNSURE = String.raw`(?<!(?:vững|săn|rắn|biết|nắm) )chắc(?! (?:chắn|ăn))|(?:không|chưa|chẳng)(?: (?:biết|nắm))? chắc`;

/**
 * A guess, a question mark or a question ending the sentence, anywhere in the sentence of a phrase,
 * before it or after it: "Có lẽ KH đã kết hôn.", "KH có 2 con, hình như.", "KH đã kết hôn?"
 * (DR6-121), "Có vẻ KH đã kết hôn.", "KH đã kết hôn, dường như vậy." (T-289), "Chắc KH đã kết hôn
 * rồi.", "KH độc thân thì phải.", "KH độc thân à." (T-288), "chắc" said unsure (`UNSURE`).
 */
const GUESSED = new RegExp(
  [
    String.raw`(?<!\p{L})(?:có lẽ|hình như|nghe nói|có vẻ|dường như|${UNSURE})(?!\p{L})`,
    String.raw`(?<!\p{L})(?:thì phải|à|hả)(?=[^\p{L}\p{N}]*$)`,
    String.raw`\?`,
  ].join('|'),
  'iu',
);

/** "chưa" or "không", maybe with "nhé / nhỉ / ạ / nha / hả / à" after it, ending its clause. */
const NOT_YET = String.raw`(?:${NOT_SO})(?:\s+(?:nhé|nhỉ|ạ|nha|hả|à))?(?=[^\p{L}\p{N}]*?(?:,|$))`;

/**
 * A clause ending in `NOT_YET` asks what stands before it in its sentence: "KH đã kết hôn chưa.",
 * "Cần hỏi KH đã kết hôn, có con chưa." (T-289). Not an answer, which says so of its topic only
 * (`DENIED`).
 */
const ASKED = new RegExp(String.raw`(?<!\p{L})(?<!${ANSWERED})${NOT_YET}`, 'giu');

/**
 * A clause ending in an answer says that its topic is not so: what stands before the answer in the
 * clause, from after a "nhưng / mà / còn" there (`BUT`). "KH đã kết hôn chính thức thì chưa." and
 * "KH có 2 con riêng: không." say it of the phrase; "KH có 2 con nhưng bảo hiểm thì chưa." and "KH
 * độc thân, nợ: không." of something else (the review of PR #809).
 */
const DENIED = new RegExp(`${ANSWERED}${NOT_YET}`, 'giu');

/** What starts another topic in a clause, the one an answer at its end speaks of. */
const BUT = /(?<!\p{L})(?:nhưng|mà|còn)(?!\p{L})/giu;

/**
 * "hay" or "hoặc" before a phrase in its clause: the other way it may be ("đã kết hôn hay còn độc
 * thân", "đã kết hôn hoặc độc thân").
 */
const EITHER = new RegExp(String.raw`(?<!\p{L})(?:${OR})(?!\p{L})`, 'iu');

/** "Khi … thì": what stands between them is a condition, not a fact (DR6-121). */
const WHEN = /(?<!\p{L})khi(?!\p{L})/iu;
const THEN = /(?<!\p{L})thì(?!\p{L})/giu;

const SENTENCE_END = /[.!?;\n]/g;
const CLAUSE_END = /[.!?;,\n]/g;

/** After a count, what lets "cho" spare it from a wish: the end of its clause, or "ăn học". */
const NOTHING_MORE = new RegExp(String.raw`(?:\s+ăn học)?(?:${CLAUSE_END.source}|$)`, 'uy');

/**
 * Whether the count at `at`, up to `end`, is what a wish earlier in its clause is for, not the
 * wish: "cho" right before it and nothing more said of the children after it ("KH muốn đầu tư cho 2
 * con" wishes the investing; the children are there already). More may say they are not there
 * yet: "cho 2 con sắp sinh / tương lai" (T-289).
 */
function forTheChildren(note: string, at: number, end: number): boolean {
  return note.endsWith('cho ', at) && startsAt(NOTHING_MORE, note, end);
}

/**
 * Whether `word`, a sticky regex, matches `note` right at `at`: for what a phrase's own pattern
 * cannot hold, as a list in any case after a pattern that tells case.
 */
function startsAt(word: RegExp, note: string, at: number): boolean {
  word.lastIndex = at;
  return word.test(note);
}

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

/** `text` with the words of `PEOPLE` that name no one else there read as spaces, in their places. */
function namingPeople(text: string): string {
  const blank = (word: string) => ' '.repeat(word.length);
  return text.replace(SAID_OF_THE_KH, blank).replace(NAMES_NO_ONE, blank);
}

/** What a sentence says around its phrases, as positions in the note. */
function readSentence(sentence: Part) {
  return {
    someoneElse: firstEnd(SOMEONE_ELSE, { ...sentence, text: namingPeople(sentence.text) }),
    supposed: firstEnd(SUPPOSED, sentence),
    whenEnd: firstEnd(WHEN, sentence),
    thenStart: lastStart(THEN, sentence),
    askedUntil: lastStart(ASKED, sentence),
    guessed: GUESSED.test(sentence.text),
  };
}

/** What a clause says around its phrases, as positions in the note. */
function readClause(clause: Part) {
  return {
    negated: firstEnd(NEGATED, clause),
    either: firstEnd(EITHER, clause),
    partner: firstEnd(PARTNER_FIRST, clause),
    wished: firstEnd(WISHED, clause),
    topicAfter: lastStart(BUT, clause),
    deniedUntil: lastStart(DENIED, clause),
  };
}

/**
 * Whether the phrase starting at `at` says something of the KH (DR6-19), asked of the phrases in
 * order: no one else named and no supposition before it in its sentence ("Em trai KH còn độc
 * thân", "KH có một con trai đang sống độc thân"), no guess or "khi … thì" around it there and no
 * question after it ("KH đã kết hôn chưa."), no negation, other way, partner or wish before it in
 * its clause ("KH không có 2 con", "KH lấy chồng đã có 2 con riêng", "KH muốn có 2 con") and not
 * in the topic of an answer ending it ("KH có 2 con riêng thì chưa."). Narrow, as the patterns
 * are. `unwished`: what the wish is for, not the wish.
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
      at < inSentence.askedUntil ||
      inSentence.someoneElse <= at ||
      inSentence.supposed <= at ||
      (inSentence.whenEnd <= at && at < inSentence.thenStart) ||
      inClause.negated <= at ||
      inClause.either <= at ||
      inClause.partner <= at ||
      (inClause.topicAfter < at && at < inClause.deniedUntil) ||
      (inClause.wished <= at && !unwished)
    );
  };
}

function extraction(note: string, fields: readonly string[]): ExtractionOutput {
  const sentence = readerOf(note, SENTENCE_END);
  const ofTheKh = aboutTheKh(sentence, readerOf(note, CLAUSE_END));
  const facts = EXTRACTION_PATTERNS.filter(({ field }) => fields.includes(field))
    .flatMap(({ field, pattern, value, endedBy, ownerAfter, unwished }) => {
      const ended = endedBy && sentence((part) => lastStart(endedBy, part));
      return [...note.matchAll(pattern)]
        .map((match) => {
          const at = match.index;
          const end = at + match[0].length;
          return {
            at,
            theirs: !!ownerAfter && startsAt(ownerAfter, note, end),
            unwished: !!unwished && unwished(note, at, end),
            fact: { field, value: value(match), quote: match[0] },
          };
        })
        .filter(({ at, theirs }) => !theirs && (!ended || ended(at) < at));
    })
    .sort((a, b) => a.at - b.at)
    .filter(ofTheKh)
    .map(({ fact }) => fact);
  return { facts: facts.slice(0, 20) };
}
