/**
 * Mock provider (spec Phase 5 §10, D-1 item 6): for demos and e2e, only when chosen in Settings.
 * Nothing random: the answer is built from the input message alone, with fixed sentences, so the
 * same input always gives the same output. Analysis and discovery cite only the codes of the input's
 * facts list and its missing hạng mục; extraction proposes a few phrases only from a simple
 * statement about the KH (DR6-141), for the trường of the input's `fields` list only.
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
 * After "<n> con / bé", what makes them not children: figures ("con số", DR6-19), animals and things
 * ("2 con chó", "10 con bò", "2 con robot", DR6-78, DR6-121). Written small: a capital after "con"
 * is a name or a brand ("5 con Gà", "3 con Lexus").
 */
const NOT_CHILDREN = [
  'số',
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

/** "Hiện / Hiện tại / Hiện nay" before the KH: "Hiện KH có", "Hiện tại KH là đàn ông". */
const NOW = String.raw`(?:[Hh]iện(?: tại| nay)? )`;

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
const KH_SUBJECT = String.raw`(?<!\p{L}[^.!?;,:\n]*?)${NOW}?KH(?: (?:đã|đang|hiện|vừa|mới|sống|ở)){0,2}`;

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
 * "của" and someone else right after "<n> con / bé": their children ("2 con của anh trai",
 * DR6-121). Any word of `PEOPLE`, in any case and none spared ("2 con của cô giáo", "của vợ chồng
 * anh Nam") (T-289), a count of people or "người" ("của hai người bạn", "của người khác") (T-288).
 * Sticky, tried where the count ends: the count's own pattern tells case ("2 con Lexus"), which this
 * list cannot share.
 */
const OF_SOMEONE_ELSE = new RegExp(
  String.raw`\s+của\s+(?:${PEOPLE}|${HOW_MANY}|người)(?!\p{L})`,
  'iuy',
);

/*
 * DR6-141 (Owner 31/10, Q1 a): on top of the rules above, a phrase gives a proposal only as a
 * simple statement about the KH. Its clause opens on the KH (`OPENS`), or follows in its sentence a
 * first clause that does ("KH là bác sĩ, đã kết hôn"); between the KH and the phrase stand only
 * words that add nothing (`FILLER`), maybe after another clause on the same KH that a word of
 * `JOINING` ends; after it, only what each phrase lists, to the end of its clause or to such a
 * word. Every other way of saying it gives no proposal: three rounds of review each found new ways
 * a list of what stops a phrase let one through ("KH đâu có 2 con", "KH độc thân là sai").
 */

/**
 * Who a note names as the KH, opening a clause: "KH", "Khách", the KH's couple ("Hai vợ chồng",
 * "Vợ chồng KH", "KH và vợ"), maybe after "Hiện". Not "anh" or "chị" alone, which may be someone
 * else ("Anh ấy", "Chị gái"), but as the KH saying it (`SAYS`).
 */
const THE_KH = String.raw`${NOW}?(?:khách(?: hàng)?|kh(?: và (?:vợ|chồng))?|(?:hai )?vợ chồng(?: kh)?)`;

/** The KH saying it: "KH cho biết", "Chị nói" (G5 §4.1), "KH khẳng định chắc nịch". */
const SAYS = String.raw`(?:khách(?: hàng)?|kh|chị|anh) (?:nói|cho biết|kể|khẳng định|xác nhận)(?: lại)?(?: chắc nịch)?(?: (?:là|rằng))?`;

/**
 * Headings that say nothing of what follows them: "Ghi chú: KH…", "Gặp KH: KH…". A closed list, as
 * any other may say it is wrong, asked or heard ("Đính chính:", "Cần hỏi:", "Tin đồn:"), or whose
 * words they are ("Bác sĩ:") (the review of PR #917).
 */
const HEADING = String.raw`(?:ghi chú|chú ý|lưu ý|chú thích|gặp kh)\s*:\s*`;

/**
 * How a clause opens on the KH, maybe after a bullet: the KH or the KH saying it, maybe after a
 * `HEADING` and maybe with ":" ("KH: đã kết hôn"), or a field line of the KH's own, as the seed
 * writes them ("Hôn nhân: Độc thân", "KH cho biết lại Hôn nhân: …"). Sticky, tried at the start of
 * a clause or a sentence; every part starts with a word, so a run of spaces is read once.
 */
const OPENS = new RegExp(
  String.raw`\s*(?:(?:[-*•+]|\d{1,2}\))\s+)?(?:(?:${SAYS} )?(?:tình trạng )?hôn nhân\s*:|(?:${HEADING})?(?:${SAYS}(?: ${THE_KH})?|${THE_KH})(?!\p{L})(?:\s*:)?)`,
  'iuy',
);

/**
 * Words that add nothing between the KH and a phrase: "KH vẫn độc thân", "nay thì đã có 2 con".
 * Not those of `KH_SUBJECT` that may stand before whom the KH lives with or marries ("vừa / mới /
 * ở"): "KH mới có 1 con" says how many so far.
 */
const FILLER = String.raw`(?:đã|đang|hiện tại|hiện|vẫn|còn|nay|cũng|sống|là|người|thì|chắc chắn)\s+`;

/**
 * A word that ends a clause on the KH and starts another, on the same KH ("KH vừa thay việc nhưng
 * vẫn độc thân", "KH đã kết hôn và có 2 con"); not "và" before a count ("KH đã có vợ và 2 con").
 */
const JOINING = String.raw`(?:nhưng|mà|còn|vì|nên|và(?!\s+\d))(?!\p{L})`;
const JOINED = new RegExp(String.raw`(?<!\p{L})${JOINING}`, 'giu');

/** After a phrase: a particle, then the end of its clause or a word of `JOINING`. */
const CLAUSE_DONE = String.raw`(?:\s+(?:ạ|rồi|nhé))?(?:\s*(?=[.!?;,\n]|$)|\s+${JOINING})`;

/** When the KH married, after "kết hôn": "10 năm", "được 5 năm nay", "năm 2010", "khi 25 tuổi". */
const WHEN_MARRIED = String.raw`(?:(?:được|từ)\s+)?(?:(?:${HOW_MANY})\s+năm(?:\s+(?:nay|rồi|trước))?|năm\s+\d{4}|(?:khi|lúc|năm)\s+\d{1,2}\s+tuổi)`;

const EXTRACTION_PATTERNS: readonly {
  readonly field: string;
  readonly pattern: RegExp;
  readonly value: (match: RegExpExecArray) => string;
  /** Said later in its sentence, it ends what the phrase says: "đã kết hôn … ly hôn". */
  readonly endedBy?: RegExp;
  /** Right after the phrase (a sticky regex), it makes the phrase someone else's. */
  readonly ownerAfter?: RegExp;
  /** All that may stand before the phrase, from the KH or a word of `JOINING` (DR6-141). */
  readonly before: RegExp;
  /** Sticky: what may follow the phrase to the end of its clause (DR6-141). */
  readonly after: RegExp;
}[] = [
  // Narrow on purpose (CX-A4): what may mean something else gives no proposal.
  {
    field: 'childrenCount',
    pattern: new RegExp(
      [
        NOT_PLANNED_CHILDREN,
        String.raw`(?<!\p{N})(\d{1,2})\s+(?:con|bé)(?!\p{L})`,
        // A capital is a name or a brand.
        String.raw`(?!\p{Zs}+\p{Lu})(?!\s+(?:${NOT_CHILDREN})(?!\p{L}))`,
        NOT_ASKED,
      ].join(''),
      'gu',
    ),
    value: (match) => match[1]!,
    ownerAfter: OF_SOMEONE_ELSE,
    // "KH có 2 con", "KH đã có vợ và 2 con", "KH sống cùng vợ và 2 con".
    before: new RegExp(
      String.raw`^\s*(?:${FILLER})*(?:có|(?:sống|ở)\s+(?:cùng|với))\s+(?:(?:vợ|chồng)\s+và\s+)?$`,
      'iu',
    ),
    // The children described: "2 con nhỏ", "2 con trai", "2 con đang học cấp 1", "2 con của mình";
    // not another count after them, "và" (`JOINING`) or "," before it: in "2 con trai và 1 con gái",
    // "2 con gái, 1 con trai" neither is how many (the review of PR #917).
    after: new RegExp(
      String.raw`(?:\s+(?:trai|gái|nhỏ|lớn))?(?!\s*,\s*\d{1,2}\s+(?:con|bé)(?!\p{L}))(?:${CLAUSE_DONE}|\s+(?:đang|đều|đã|của)(?!\p{L}))`,
      'iuy',
    ),
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
    before: new RegExp(String.raw`^\s*(?:${FILLER})*đã\s+$`, 'iu'),
    // "đã kết hôn lại", "đã kết hôn 10 năm".
    after: new RegExp(String.raw`(?:\s+lại)?(?:\s+${WHEN_MARRIED})?${CLAUSE_DONE}`, 'iuy'),
  },
  // A word of its own: "khôngđộc thân" (no space) is no more single than "không độc thân".
  {
    field: 'maritalStatus',
    pattern: new RegExp(
      String.raw`${NOT_PLANNED}${NOT_OF_ANYONE}(?<!\p{L})độc thân(?!\p{L})${NOT_ASKED}`,
      'giu',
    ),
    value: () => 'Độc thân',
    before: new RegExp(String.raw`^\s*(?:${FILLER})*$`, 'iu'),
    after: new RegExp(CLAUSE_DONE, 'iuy'),
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
 * "chắc" said unsure (T-288): every "chắc" but that of a word that is sure or firm ("chắc chắn",
 * "chắc ăn", "chắc nịch", "biết / nắm chắc", "vững / săn / rắn / bền chắc", "ăn chắc mặc bền"), so
 * a "chắc" this list misses drops the proposals of its sentence, the safe way (CX-A4): a guess
 * ("Chắc KH…", "KH chắc là…", "KH chắc đã…"). Even before "chắn", "cho / để chắc" (to be made sure
 * of) and a doubt, "không / chưa / chẳng" and at most two words before it ("không hoàn toàn chắc
 * chắn", "chưa biết chắc"; the review of PR #812).
 */
const UNSURE = String.raw`(?<!(?<!\p{L})(?:vững|săn|rắn|bền|biết|nắm|ăn) )chắc(?! (?:chắn|ăn|nịch))|(?:cho|để) chắc|(?:không|chưa|chẳng)(?: \p{L}+){0,2} chắc`;

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

/**
 * Said to be wrong, anywhere in the sentence of a phrase: "KH độc thân, điều này sai.", "KH đã kết
 * hôn, không đúng.", "KH có 2 con, ghi nhầm." (the review of PR #917, the family of CXR4-C1). A
 * clause after a phrase may say anything else ("KH đã kết hôn, có thể đóng phí năm"), so these
 * words are listed.
 */
const RETRACTED =
  /(?<!\p{L})(?:sai|nhầm|ghi lộn|đính chính|không phải|(?:không|chưa) (?:đúng|chính xác))(?!\p{L})/iu;

/**
 * Someone named by a word for a person and a name: "anh Nam", "chị Lan", "Bà Tư". Written as such,
 * a capital after the word, so no `i` flag: with it, `\p{Lu}` takes a small letter too.
 */
const NAMED =
  /(?<!\p{L})(?:[Aa]nh|[Cc]hị|[Ee]m|[Ôô]ng|[Bb]à|[Cc]ô|[Cc]hú|[Bb]ác|[Cc]ậu|[Dd]ì|[Bb]ạn|[Ss]ếp) \p{Lu}/u;

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

/** Where `part` stops opening on the KH (`OPENS`), as a position in the note; never when it does not. */
function opening(part: Part): number | undefined {
  OPENS.lastIndex = 0;
  const opens = OPENS.exec(part.text);
  return opens ? part.start + opens[0].length : undefined;
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
    retracted: RETRACTED.test(sentence.text),
    /** Its first clause opens on the KH, so a clause after it that does not is said of the KH. */
    onTheKh: opening(sentence) !== undefined,
    /** Where someone named first ends: a clause after that may speak of them. */
    named: firstEnd(NAMED, sentence),
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
    start: clause.start,
    /** Where it stops opening on the KH; never when it does not. */
    kh: opening(clause),
    /** Where each word of `JOINED` in it starts and ends. */
    joined: [...clause.text.matchAll(JOINED)].map((word) => ({
      start: clause.start + word.index,
      end: clause.start + word.index + word[0].length,
    })),
  };
}

/** A phrase found in the note, from `at` up to `end`, and what its trường lets stand around it. */
interface Phrase {
  readonly at: number;
  readonly end: number;
  readonly before: RegExp;
  readonly after: RegExp;
}

/**
 * Whether the phrase starting at `at` says something of the KH (DR6-19), asked of the phrases in
 * order: no one else named and no supposition before it in its sentence ("Em trai KH còn độc
 * thân", "KH có một con trai đang sống độc thân"), no guess or "khi … thì" around it there and no
 * question after it ("KH đã kết hôn chưa."), no negation, other way, partner or wish before it in
 * its clause ("KH không có 2 con", "KH lấy chồng đã có 2 con riêng", "KH muốn có 2 con") and not
 * in the topic of an answer ending it ("KH có 2 con riêng thì chưa."). Narrow, as the patterns
 * are; and then a simple statement about the KH (DR6-141).
 */
function aboutTheKh(note: string, sentence: Reader, clause: Reader): (phrase: Phrase) => boolean {
  const ofSentence = sentence(readSentence);
  const ofClause = clause(readClause);
  return ({ at, end, before, after }) => {
    const inSentence = ofSentence(at);
    const inClause = ofClause(at);
    if (
      inSentence.guessed ||
      inSentence.retracted ||
      at < inSentence.askedUntil ||
      inSentence.someoneElse <= at ||
      inSentence.supposed <= at ||
      (inSentence.whenEnd <= at && at < inSentence.thenStart) ||
      inClause.negated <= at ||
      inClause.either <= at ||
      inClause.partner <= at ||
      (inClause.topicAfter < at && at < inClause.deniedUntil) ||
      inClause.wished <= at
    ) {
      return false;
    }
    // A clause that does not open on the KH follows one that does, with no one named before it in
    // between: "KH giới thiệu anh Nam, đã kết hôn" may be said of anh Nam (the review of PR #917).
    const kh =
      inClause.kh ?? (inSentence.onTheKh && at < inSentence.named ? inClause.start : undefined);
    // Before where its clause opens on the KH, a phrase is in the heading ("Độc thân: KH…").
    if (kh === undefined || at < kh) return false;
    // A word of `JOINING` ends a clause on the KH only after some of its words: right after the KH,
    // "nên" and "mà" say "should" and "if" ("KH nên có 2 con", the review of PR #917).
    const joined = inClause.joined.findLast((word) => word.end <= at);
    const from = joined && /\S/.test(note.slice(kh, joined.start)) ? joined.end : kh;
    return before.test(note.slice(from, at)) && startsAt(after, note, end);
  };
}

function extraction(note: string, fields: readonly string[]): ExtractionOutput {
  const sentence = readerOf(note, SENTENCE_END);
  const ofTheKh = aboutTheKh(note, sentence, readerOf(note, CLAUSE_END));
  const facts = EXTRACTION_PATTERNS.filter(({ field }) => fields.includes(field))
    .flatMap(({ field, pattern, value, endedBy, ownerAfter, before, after }) => {
      const ended = endedBy && sentence((part) => lastStart(endedBy, part));
      return [...note.matchAll(pattern)]
        .map((match) => {
          const at = match.index;
          const end = at + match[0].length;
          return {
            at,
            end,
            before,
            after,
            theirs: !!ownerAfter && startsAt(ownerAfter, note, end),
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
