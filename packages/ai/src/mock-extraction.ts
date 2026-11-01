/**
 * The Mock's extraction (spec Phase 5 §10; the adapter is `mock-adapter.ts`): from a KYC note, a
 * few phrases on the KH's hôn nhân and con, each quoted as the note writes it, the last said of
 * each trường and only from a simple statement about the KH (DR6-141, T-330). Narrow on purpose
 * (CX-A4): what may mean something else gives no proposal.
 */
import type { ExtractionOutput } from './schema';

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

/**
 * "Hiện / Hiện tại / Hiện nay / Nay" before the KH: "Hiện KH có", "Hiện tại KH là đàn ông", "KH độc
 * thân. Nay KH đã kết hôn." (T-330).
 */
const NOW = String.raw`(?:(?:[Hh]iện(?: tại| nay)?|[Nn]ay) )`;

/**
 * "KH" opening its clause, maybe after "Hiện / Hiện tại / Hiện nay", and up to two of "đã / đang /
 * hiện / vừa / mới / sống / ở": the KH the subject of what follows ("KH đã", "KH đang sống", "Hiện
 * KH có", "Theo chị Lan, KH là", "- KH có"), not someone's nor an object ("Người yêu của KH đã
 * có", "Người giới thiệu KH là", the review of PR #809). "KH" only, not "Khách" as `THE_KH`:
 * these rules spare words wherever a clause opens, and after other words "khách" may be someone
 * else (`OPENS_AFTER`): "KH đã kết hôn, khách là người độc thân". So "Khách là người độc thân"
 * gives no proposal, the safe way (the review of PR #917). Its clause ends at a mark of
 * `CLAUSE_END` or at ":". Up to two, and one space between the words as a note is stored and as
 * "anh trai" is read, not `\s+`: these lookbehinds are tried at every place of a sentence, and one
 * reading a run of spaces back took a second for 36 000 of them (the review of PR #753). The look
 * back for the start of the clause is tried only where "KH" stands, and lazy: it stops at the
 * first letter.
 */
const KH_SUBJECT = String.raw`(?<!\p{L}[^.!?;,:\n]*?)${NOW}?KH(?: (?:đã|đang|hiện|vừa|mới|sống|ở)){0,2}`;

/**
 * Not of anyone: "người", maybe with "đã", right before a phrase says it of anyone ("gói cho người
 * đã kết hôn", DR6-121; "người đã ly hôn", T-330), but in the KH's own "KH là người độc thân"
 * (T-289).
 */
const NOT_OF_ANYONE = String.raw`(?<!(?<!${KH_SUBJECT} là )(?<!\p{L})người (?:đã )?)`;

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
 * kết hôn." may be about the children, "Anh chị em của KH đều đã kết hôn." is about them), "bé"
 * as "con" ("KH có 2 bé đã lớn, độc thân.", T-330). "anh" or "chị" alone may be the KH. Where some
 * of these words name no one else: `NAMES_NO_ONE`, `SAID_OF_THE_KH`.
 */
const PEOPLE = [
  'con|bé|cháu|anh em|anh trai|anh họ|anh rể|anh ruột|anh của',
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
 * word ("bác sĩ", "cô giáo", "cô đơn", "chú ý", "chú trọng", "ghi chú"), "bé" said of a size
 * ("nhỏ bé", "bé nhỏ / xíu / tí / hơn / nhất", T-330), in the heading "Chú thích:", in "góa vợ /
 * chồng" and in the couple, the KH one of them ("vợ chồng", "KH và vợ"). Not a couple someone
 * lives with or has (`WITH_PARTNER`): "KH sống cùng vợ chồng anh Nam" names them (the review of PR
 * #809). So none of these words is one of `OWN_PARTNER`, and which is read first does not matter.
 */
const NAMES_NO_ONE = new RegExp(
  String.raw`(?<!\p{L})(?:bác sĩ|cô giáo|cô đơn|chú ý|chú trọng|ghi chú|nhỏ bé|bé (?:nhỏ|xíu|tí|hơn|nhất)|chú thích(?=:)|g(?:óa|oá) (?:${SPOUSE})|(?<!(?:${WITH_PARTNER}) )vợ chồng|(?<=và )(?:${SPOUSE}))(?!\p{L})`,
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

/** A number in words: "hai", "mười". */
const NUMBER_WORD = 'một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười';

/** A count of people: "ba người bạn", "các anh", "2 người". */
const HOW_MANY = String.raw`${NUMBER_WORD}|mấy|vài|các|những|\d+`;

/** A count of children, in figures or in words: "1 con", "một bé". */
const COUNT = String.raw`(?:(?<!\p{N})\d{1,2}|(?<!\p{L})(?:${NUMBER_WORD}))\s+(?:con|bé)(?!\p{L})`;
const COUNTED = new RegExp(COUNT, 'giu');

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
 * simple statement about the KH. Its clause opens on the KH (`OPENS`, `OPENS_AFTER`), or follows a
 * clause of its sentence that ends on such a statement ("KH đã kết hôn, có 2 con"); between the KH
 * and the phrase stand only words that add nothing (`FILLER`); after it, only what each phrase
 * lists, to the end of its clause or to a word that starts another. Every other way of saying it
 * gives no proposal: three rounds of review each found new ways a list of what stops a phrase let
 * one through ("KH đâu có 2 con", "KH độc thân là sai"), and two more new ways to name someone a
 * later clause may speak of ("KH giới thiệu khách mới, đã kết hôn", the reviews of PR #917).
 */

/** The word a note names the KH by, opening it: "KH", "Khách", "Khách hàng". */
const KH_WORD = String.raw`(?:KH|[Kk]hách(?: hàng)?)`;

/**
 * The KH, or the KH's couple, maybe after "Hiện": `kh`, maybe with "và vợ / chồng" ("KH và vợ"),
 * or "vợ chồng", maybe after "Hai", then "KH": always when `saysKh`, else maybe ("Vợ chồng",
 * "Vợ chồng KH").
 */
function namingTheKh(kh: string, saysKh: boolean): string {
  return String.raw`${NOW}?(?:${kh}(?: và (?:vợ|chồng))?|(?:hai )?vợ chồng${saysKh ? ' kh' : '(?: kh)?'})`;
}

/**
 * Who a note names as the KH, opening it: `KH_WORD`, the KH's couple ("Hai vợ chồng", "Vợ chồng",
 * "Vợ chồng KH", "KH và vợ"), maybe after "Hiện". Not "anh" or "chị" alone, which may be someone
 * else ("Anh ấy", "Chị gái"), but as the KH saying it (`OPENS`).
 */
const THE_KH = namingTheKh(KH_WORD, false);

/** Of `THE_KH`, those that say "KH": "KH", "KH và vợ", "Vợ chồng KH", maybe after "Hiện". */
const KH_NAMED = namingTheKh('kh', true);

/** Saying it: "nói", "cho biết lại", "khẳng định chắc nịch là". */
const SAYING = String.raw`(?:nói|cho biết|kể|khẳng định|xác nhận)(?: lại)?(?: chắc nịch)?(?: (?:là|rằng))?`;

/** "KH" saying it: "KH cho biết", "KH khẳng định chắc nịch". */
const KH_SAYS = String.raw`kh ${SAYING}`;

/**
 * Headings that say nothing of what follows them: "Ghi chú: KH…", "Gặp KH: KH…". A closed list, as
 * any other may say it is wrong, asked or heard ("Đính chính:", "Cần hỏi:", "Tin đồn:"), or whose
 * words they are ("Bác sĩ:") (the review of PR #917).
 */
const HEADING = String.raw`(?:ghi chú|chú ý|lưu ý|chú thích|gặp kh)\s*:\s*`;

/** Spaces, maybe a bullet or a number, at the start of a clause: "- ", "1) ". */
const BULLET = String.raw`\s*(?:(?:[-*•+]|\d{1,2}\))\s+)?`;

/**
 * How a clause opens on the KH, maybe after a bullet: as `named` names the KH, or as `says` (the KH
 * saying it) maybe naming the KH after, maybe after a `HEADING` and maybe with ":" ("KH: đã kết
 * hôn"). Sticky, tried at the start of a clause; after the bullet every part starts with a word, so
 * a run of spaces is read once.
 */
function opener(says: string, named: string): RegExp {
  return new RegExp(
    String.raw`${BULLET}(?:${HEADING})?(?:${says}(?: ${named})?|${named})(?!\p{L})(?:\s*:)?`,
    'iuy',
  );
}

/**
 * How a note opens on the KH: `THE_KH`, or the KH saying it, "Chị nói" too (G5 §4.1). Tried at the
 * start of the clause that opens the note.
 */
const OPENS = opener(String.raw`(?:${KH_WORD}|chị|anh) ${SAYING}`, THE_KH);

/**
 * How a clause opens on the KH after other words of the note, past a comma or a sentence's end: by
 * "KH" only ("KH gặp anh Nam, KH đã kết hôn"). "Chị nói", "khách", "hai vợ chồng" there may be
 * someone named before them ("KH đi cùng chị Lan, chị nói đã kết hôn", "KH giới thiệu khách mới.
 * Khách đã kết hôn.", the review of PR #917).
 */
const OPENS_AFTER = opener(KH_SAYS, KH_NAMED);

/**
 * A field line of the KH's own, as the seed writes them, each its own sentence: "Hôn nhân: Độc
 * thân", "KH cho biết lại Hôn nhân: …". Only opening a sentence: after a comma, it may be the line
 * of someone named before it ("Chị Lan, hôn nhân: độc thân"); and said by "KH" only, as "Chị nói"
 * opening a later sentence may be someone named before (the review of PR #917). Sticky too.
 */
const FIELD_LINE = new RegExp(
  String.raw`${BULLET}(?:${KH_SAYS} )?(?:tình trạng )?hôn nhân\s*:`,
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
const STARTS_ANOTHER = String.raw`nhưng|vì|nên|và(?!\s+\d)`;
const JOINED = new RegExp(String.raw`(?<!\p{L})(?:${STARTS_ANOTHER})(?!\p{L})`, 'giu');

/** A word of `JOINED` opening a clause, right after its comma: "KH đã kết hôn, và có 2 con". Sticky. */
const JOINS_ON = new RegExp(String.raw`\s*(?:${STARTS_ANOTHER})(?!\p{L})`, 'iuy');

/**
 * After a phrase: a particle, then the end of its clause or a word that starts another, "mà" and
 * "còn" too ("KH đã kết hôn mà bảo hiểm thì chưa"). Not before a phrase: after someone, they say
 * who that one is ("một người mà / còn độc thân", the review of PR #917).
 */
const CLAUSE_DONE = String.raw`(?:\s+(?:ạ|rồi|nhé))?(?:\s*(?=[.!?;,\n]|$)|\s+(?:${STARTS_ANOTHER}|mà|còn)(?!\p{L}))`;

/**
 * When it came about, after a phrase of hôn nhân or a death: "kết hôn 10 năm", "góa vợ được 5 năm
 * nay", "ly hôn năm 2020", "kết hôn khi 25 tuổi".
 */
const SINCE = String.raw`(?:(?:được|từ)\s+)?(?:(?:${HOW_MANY})\s+năm(?:\s+(?:nay|rồi|trước))?|năm\s+\d{4}|(?:khi|lúc|năm)\s+\d{1,2}\s+tuổi)`;

/**
 * A death: "đã mất", "qua đời", "đã qua đời". "mất" alone may be anything lost ("mất việc"). One
 * space between the words, as a note is stored, so that a phrase holding it quotes no run of
 * spaces past what V1 lets a quote hold.
 */
const DIED = '(?:đã mất|(?:đã )?qua đời)';

/** After a phrase of hôn nhân or a death: when it came about, then the end of its clause. */
const DONE_SINCE = new RegExp(String.raw`(?:\s+${SINCE})?${CLAUSE_DONE}`, 'iuy');

/** Before a phrase standing on its own: only words that add nothing, from the KH. */
const ONLY_FILLER = new RegExp(String.raw`^\s*(?:${FILLER})*$`, 'iu');

/** The value a simple statement that the KH is married gives (rule 2, T-330). */
const MARRIED = 'Đã kết hôn';

/** Children who died, in figures or in words: "1 con đã mất", "Một bé qua đời" (rule 3, T-330). */
const DEAD_CHILDREN = String.raw`(?:(?<!\p{N})(\d{1,2})|(?<!\p{L})(${NUMBER_WORD})) (?:con|bé) ${DIED}(?!\p{L})`;

/** How many `DEAD_CHILDREN` died: its figures, or its number in words. */
function howManyDied(match: RegExpExecArray): number {
  return match[1] ? Number(match[1]) : NUMBER_WORD.split('|').indexOf(match[2]!.toLowerCase()) + 1;
}

/** A child, and a death said any way: "con út đã mất", "mất một con", "bé qua đời". */
const CHILD = /(?<!\p{L})(?:con|bé)(?!\p{L})/iu;
const DEATH = /(?<!\p{L})(?:mất|qua đời)(?!\p{L})/giu;

/** Matches nothing: what never is a simple statement. */
const NOTHING = /(?!)/u;

/**
 * A child said to have died in any other way than `DEAD_CHILDREN` (outside `covered`): where its
 * clause first names the child or the death, never a simple statement, so a count said before is
 * not the last value said of the KH ("KH có 2 con. Con út đã mất.", rule 3). Anything else said
 * of "con" with "mất" too, the safe way (CX-A4): "Con trai mất việc.". Only the clauses of such a
 * death are read, each once.
 */
function otherDeaths(note: string, covered: Uint8Array) {
  const deaths = [];
  let clauseEnd = 0;
  for (const death of note.matchAll(DEATH)) {
    if (death.index < clauseEnd || covered[death.index]) continue;
    let start = death.index;
    while (start > 0 && !CLAUSE_MARKS.includes(note[start - 1]!)) start--;
    clauseEnd = death.index;
    while (clauseEnd < note.length && !CLAUSE_MARKS.includes(note[clauseEnd]!)) clauseEnd++;
    const child = note.slice(start, clauseEnd).search(CHILD);
    if (child < 0) continue;
    const at = Math.min(start + child, death.index);
    deaths.push({
      at,
      end: at,
      before: NOTHING,
      after: NOTHING,
      ofChildren: true,
      field: 'childrenCount',
      quote: '',
      value: () => undefined,
    });
  }
  return deaths;
}

/** The count of children `previous` gives, less `died`; none with no count or fewer than died. */
function lessBy(previous: string | undefined, died: number): string | undefined {
  const count = Number(previous);
  return previous !== undefined && died <= count ? String(count - died) : undefined;
}

/** A phrase of hôn nhân standing as a word of its own, not planned, of anyone, asked nor denied. */
function maritalWord(word: string): RegExp {
  // The word looked for first: the lookbehinds are tried only where it stands.
  return new RegExp(
    String.raw`(?<!\p{L})(?=(?:${word})(?!\p{L}))${NOT_PLANNED}${NOT_OF_ANYONE}(?:${word})${NOT_ASKED}`,
    'giu',
  );
}

/**
 * Where the children are in life, after their count: "đang học cấp 1", "đang học đại học", "đều đã
 * đi làm", "đã lớn", "đã lập gia đình". A closed list, as all a simple statement holds: other words
 * may make them someone else's or no children yet ("2 con nhỏ của em gái", "2 bé đang trong bụng",
 * "2 con đang nuôi giúp người quen", the review of PR #917).
 */
const CHILDREN_NOW = String.raw`(?:\s+đều)?\s+(?:đang|đã)\s+(?:(?:đi\s+)?(?:học|làm)(?:\s+(?:(?:cấp|lớp)\s+\d{1,2}|mẫu giáo|tiểu học|đại học))?|lớn|trưởng thành|lập gia đình|kết hôn)`;

const EXTRACTION_PATTERNS: readonly {
  readonly field: string;
  readonly pattern: RegExp;
  /**
   * The value the phrase gives as a simple statement about the KH, from the value of the last
   * simple statement before it, if the last value said of the KH for the trường is one; none when
   * that value does not let it (rules 2 and 3, Owner 01/11): "Ly thân" only after "Đã kết hôn".
   */
  readonly value: (match: RegExpExecArray, previous: string | undefined) => string | undefined;
  /**
   * Said later in its sentence, it ends what the phrase says ("đã kết hôn … sắp ly hôn"); but not
   * inside a phrase that says something of the KH (`covered`), which gives a value of its own.
   */
  readonly endedBy?: RegExp;
  /** Right after the phrase (a sticky regex), it makes the phrase someone else's. */
  readonly ownerAfter?: RegExp;
  /** Of the children counted before it in its sentence, not of someone else (`Phrase`). */
  readonly ofChildren?: boolean;
  /** All that may stand before the phrase, from the KH or a word of `JOINED` (DR6-141). */
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
        // A capital is a name or a brand; children who died are `DEAD_CHILDREN`.
        String.raw`(?!\p{Zs}+\p{Lu})(?!\s+(?:${NOT_CHILDREN})(?!\p{L}))(?! ${DIED})`,
        NOT_ASKED,
      ].join(''),
      'gu',
    ),
    value: (match) => match[1]!,
    // "KH có 2 con nhưng đều đã mất" (Owner 31/10).
    endedBy: /(?<!\p{L})(?:đã mất|qua đời)(?!\p{L})/giu,
    ownerAfter: OF_SOMEONE_ELSE,
    // "KH có 2 con", "KH đã có vợ và 2 con", "KH sống cùng vợ và 2 con".
    before: new RegExp(
      String.raw`^\s*(?:${FILLER})*(?:có|(?:sống|ở)\s+(?:cùng|với))\s+(?:(?:vợ|chồng)\s+và\s+)?$`,
      'iu',
    ),
    // The children described: "2 con nhỏ", "2 con trai", "2 con của mình", then `CHILDREN_NOW`;
    // with no other count after them in the sentence: in "2 con trai và 1 con gái", "2 con đang
    // học, một con đã đi làm" neither is how many (the reviews of PR #917). Children who died are
    // no other count ("2 con, 1 con đã mất", rule 3).
    after: new RegExp(
      String.raw`(?![^.!?;\n]*?${COUNT}(?! ${DIED}))(?:\s+(?:trai|gái|nhỏ|lớn))?(?:\s+của\s+mình)?(?:${CHILDREN_NOW})?${CLAUSE_DONE}`,
      'iuy',
    ),
  },
  // Children who died, taken from the count said before ("KH có 2 con. Một con đã mất." is 1),
  // "đều" all of them ("KH có 2 con nhưng đều đã mất." is 0) (rule 3, Owner 31/10 – 01/11).
  {
    field: 'childrenCount',
    pattern: new RegExp(`${DEAD_CHILDREN}${NOT_ASKED}`, 'giu'),
    value: (match, previous) => lessBy(previous, howManyDied(match)),
    ofChildren: true,
    before: ONLY_FILLER,
    after: DONE_SINCE,
  },
  {
    field: 'childrenCount',
    pattern: new RegExp(String.raw`(?<!\p{L})đều ${DIED}(?!\p{L})${NOT_ASKED}`, 'giu'),
    value: (_, previous) => lessBy(previous, Number(previous)),
    ofChildren: true,
    before: ONLY_FILLER,
    after: DONE_SINCE,
  },
  {
    field: 'maritalStatus',
    // Only "đã kết hôn": not "chưa / không muốn / … năm kết hôn" nor "đã từng kết hôn".
    pattern: new RegExp(
      String.raw`(?<=${NOT_OF_ANYONE}(?<!\p{L})đã\s+)kết hôn(?!\p{L})${NOT_ASKED}`,
      'giu',
    ),
    value: () => MARRIED,
    // "ly dị / ly thân", a death ("vợ KH đã mất", "chồng qua đời", "góa") (Owner 31/10).
    endedBy: /(?<!\p{L})(?:ly (?:hôn|dị|thân)|đã mất|qua đời|g(?:óa|oá))(?!\p{L})/giu,
    before: new RegExp(String.raw`^\s*(?:${FILLER})*đã\s+$`, 'iu'),
    // "đã kết hôn lại", "đã kết hôn 10 năm".
    after: new RegExp(String.raw`(?:\s+lại)?(?:\s+${SINCE})?${CLAUSE_DONE}`, 'iuy'),
  },
  // A word of its own: "khôngđộc thân" (no space) is no more single than "không độc thân".
  {
    field: 'maritalStatus',
    pattern: maritalWord('độc thân'),
    value: () => 'Độc thân',
    before: ONLY_FILLER,
    after: new RegExp(CLAUSE_DONE, 'iuy'),
  },
  // "Ly hôn" as the seed writes it, "Góa" too, standing on their own (rule 2, Owner 31/10 – 01/11):
  // "KH đã ly hôn", "KH ly dị năm 2020", "Hôn nhân: Ly hôn", "KH góa vợ", in either spelling.
  {
    field: 'maritalStatus',
    pattern: maritalWord('ly (?:hôn|dị)'),
    value: () => 'Ly hôn',
    before: ONLY_FILLER,
    after: DONE_SINCE,
  },
  {
    field: 'maritalStatus',
    pattern: maritalWord(String.raw`g(?:óa|oá)(?: (?:${SPOUSE}))?`),
    value: () => 'Góa',
    before: ONLY_FILLER,
    after: DONE_SINCE,
  },
  // Only after a simple statement that the KH is married: "KH đã kết hôn nhưng đang ly thân", "KH
  // đã kết hôn. Vợ đã mất năm 2020." (rule 2).
  {
    field: 'maritalStatus',
    pattern: maritalWord('ly thân'),
    value: (_, previous) => (previous === MARRIED ? 'Ly thân' : undefined),
    before: ONLY_FILLER,
    after: DONE_SINCE,
  },
  {
    field: 'maritalStatus',
    pattern: new RegExp(String.raw`(?<!\p{L})(?:${SPOUSE}) ${DIED}(?!\p{L})${NOT_ASKED}`, 'giu'),
    value: (_, previous) => (previous === MARRIED ? 'Góa' : undefined),
    before: ONLY_FILLER,
    after: DONE_SINCE,
  },
];

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
 * Said to be wrong, anywhere in the note: "KH độc thân, điều này sai.", "KH đã kết hôn, không
 * đúng.", "KH có 2 con, ghi nhầm.", up to two words between "không / chưa" and "đúng / chính xác"
 * ("không còn đúng") (the reviews of PR #917, the family of CXR4-C1), in a later sentence too ("KH
 * độc thân. Điều này sai.", Owner 31/10). A clause after a phrase may say anything else ("KH đã
 * kết hôn, có thể đóng phí năm"), so these words are listed.
 */
const RETRACTED =
  /(?<!\p{L})(?:sai|nhầm|ghi lộn|đính chính|không phải|(?:không|chưa)(?: \p{L}+){0,2} (?:đúng|chính xác))(?!\p{L})/iu;

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
/** The marks of `CLAUSE_END`, each read as a character. */
const CLAUSE_MARKS = '.!?;,\n';

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

/**
 * Where `word`, a regex with the `g` flag, last starts in `part`, but at a place `skip` marks;
 * never when it is not there.
 */
function lastStart(word: RegExp, part: Part, skip?: Uint8Array): number {
  let last = -Infinity;
  for (const found of part.text.matchAll(word)) {
    const at = part.start + found.index;
    if (!skip?.[at]) last = at;
  }
  return last;
}

/**
 * Reads the parts of `note` that end after each mark of `ends`: `read` runs once on the part holding
 * the phrases it is asked of, in order, however many they are; a part with no phrase is not read.
 * So all the phrases take one pass over the note, however long its parts (DR6-79).
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

/**
 * Where `clause` stops opening on the KH, as a position in the note; never when it does not: on a
 * field line when it opens its sentence (`FIELD_LINE`, tried first: "KH cho biết lại Hôn nhân:
 * …"), then as `OPENS` when no word of the note stands before it, else as `OPENS_AFTER`.
 */
function opening(clause: Part, first: boolean, opensNote: boolean): number | undefined {
  for (const opens of [...(first ? [FIELD_LINE] : []), opensNote ? OPENS : OPENS_AFTER]) {
    opens.lastIndex = 0;
    const found = opens.exec(clause.text);
    if (found) return clause.start + found[0].length;
  }
  return undefined;
}

/** What a sentence says around its phrases, as positions in the note. */
function readSentence(sentence: Part) {
  const people = namingPeople(sentence.text);
  return {
    someoneElse: firstEnd(SOMEONE_ELSE, { ...sentence, text: people }),
    /** As `someoneElse`, but the children counted: those that children who died are of. */
    someoneElseThanChildren: firstEnd(SOMEONE_ELSE, {
      ...sentence,
      text: people.replace(COUNTED, (count) => ' '.repeat(count.length)),
    }),
    supposed: firstEnd(SUPPOSED, sentence),
    whenEnd: firstEnd(WHEN, sentence),
    thenStart: lastStart(THEN, sentence),
    askedUntil: lastStart(ASKED, sentence),
    guessed: GUESSED.test(sentence.text),
  };
}

/** What a clause says before its phrases, as positions in the note. */
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
 * The last word of `JOINED` in `clause` that ends by `at`, for positions asked in order: a cursor,
 * so all the phrases of a clause take one pass over its words (DR6-79).
 */
function joinedIn(clause: Part): (at: number) => { start: number; end: number } | undefined {
  const words = [...clause.text.matchAll(JOINED)].map((word) => ({
    start: clause.start + word.index,
    end: clause.start + word.index + word[0].length,
  }));
  let next = 0;
  return (at) => {
    while (next < words.length && words[next]!.end <= at) next++;
    return words[next - 1];
  };
}

/**
 * Reads what each clause of `note` says around its phrases, as positions in the note, for clauses
 * read in order (`readerOf`): with where it speaks of the KH, from where it opens on the KH, or
 * from its start when the clause before it ends on a phrase about the KH ("KH đã kết hôn, có 2
 * con"), in its sentence or, the clause opening a sentence, in the sentence before ("KH đã kết
 * hôn. Đã ly hôn năm 2020.", T-330). Only such a phrase carries the KH on: after any other words,
 * a clause may speak of whoever they name ("KH giới thiệu khách mới, đã kết hôn", "KH là bác sĩ,
 * Lan là y tá, độc thân"), and no list of the words that name people is ever full (the reviews of
 * PR #917). A clause is read when its first phrase that says something of the KH is asked of, and
 * all of these are asked of before the clause after it is read (`readerOf`, the phrases in order):
 * so the clause read last has told, by its `done`, whether a phrase about the KH ends it.
 */
function clausesOf(note: string) {
  let last: { end: number; endsOnTheKh: boolean } | undefined;
  /** Whether a word of the note stands before `looked`, the start of the clause read last. */
  let worded = false;
  let looked = 0;
  return (clause: Part) => {
    const first = clause.start === 0 || '.!?;\n'.includes(note[clause.start - 1]!);
    // Only the clause right before carries the KH on: one with no phrase, not read, ends on none.
    const carried = last?.end === clause.start && last.endsOnTheKh;
    worded ||= /\p{L}/u.test(note.slice(looked, clause.start));
    looked = clause.start;
    JOINS_ON.lastIndex = 0;
    const joinsOn = carried && JOINS_ON.exec(clause.text);
    const read = {
      /** Where it ends, after the mark ending it. */
      end: clause.start + clause.text.length,
      /** Where its last ":" stands; never when it has none. */
      colon: clause.text.includes(':') ? clause.start + clause.text.lastIndexOf(':') : -Infinity,
      /** Where it speaks of the KH from; never when it does not. */
      kh: opening(clause, first, !worded) ?? (carried ? clause.start : undefined),
      joined: joinedIn(clause),
      /**
       * Where the last phrase about the KH in it ends, with what it lets follow it; in a clause the
       * KH goes on to, a word of `JOINED` opening it follows the phrase ending the clause before.
       */
      doneAt: joinsOn ? clause.start + joinsOn[0].length : -1,
      /** Whether a phrase about the KH ends it: the KH goes on to the clause after it. */
      endsOnTheKh: false,
      /** A phrase about the KH in it is done at `end`, with what it lets follow it. */
      done(end: number) {
        this.doneAt = end;
        // Nothing after it in its clause but the mark ending it.
        if (end >= this.end - 1) this.endsOnTheKh = true;
      },
    };
    last = read;
    return read;
  };
}

/**
 * A phrase found in the note, from `at` up to `end`, and what its trường lets stand around it.
 */
interface Phrase {
  readonly at: number;
  readonly end: number;
  readonly before: RegExp;
  readonly after: RegExp;
  /** Of the children counted before it in its sentence: "KH có 2 con nhưng đều đã mất". */
  readonly ofChildren?: boolean;
}

/**
 * Whether the phrase starting at `at` says something of the KH (DR6-19), asked of the phrases in
 * order: no one else named and no supposition before it in its sentence ("Em trai KH còn độc
 * thân", "KH có một con trai đang sống độc thân"), no guess or "khi … thì" around it there and no
 * question after it ("KH đã kết hôn chưa."), no negation, other way, partner or wish before it in
 * its clause ("KH không có 2 con", "KH lấy chồng đã có 2 con riêng", "KH muốn có 2 con") and not
 * in the topic of an answer ending it ("KH có 2 con riêng thì chưa."). Narrow, as the patterns
 * are. Then a value said of the KH, whether or not its clause opens on the KH ("Thực ra chỉ 1
 * con.", Owner 31/10).
 */
function saysOfTheKh(sentence: Reader, clause: Reader): (phrase: Phrase) => boolean {
  const ofSentence = sentence(readSentence);
  const ofClause = clause(readClause);
  return ({ at, ofChildren }) => {
    const inSentence = ofSentence(at);
    const inClause = ofClause(at);
    return !(
      inSentence.guessed ||
      at < inSentence.askedUntil ||
      (ofChildren ? inSentence.someoneElseThanChildren : inSentence.someoneElse) <= at ||
      inSentence.supposed <= at ||
      (inSentence.whenEnd <= at && at < inSentence.thenStart) ||
      inClause.negated <= at ||
      inClause.either <= at ||
      inClause.partner <= at ||
      (inClause.topicAfter < at && at < inClause.deniedUntil) ||
      inClause.wished <= at
    );
  };
}

/**
 * Whether a phrase that says something of the KH (`saysOfTheKh`) is a simple statement about the
 * KH (DR6-141), asked of these phrases in order.
 */
function simpleStatement(note: string, clause: Reader): (phrase: Phrase) => boolean {
  const ofClause = clause(clausesOf(note));
  return ({ at, end, before, after }) => {
    const inClause = ofClause(at);
    const { kh } = inClause;
    // Only in a clause that speaks of the KH: "Độc thân: KH đã kết hôn." is one clause (":" ends
    // none) opening on no KH. A phrase never stands before `kh`: no opening holds one. A ":" after
    // the phrase makes it a heading, or the label of what follows: "KH đã kết hôn. Độc thân và có
    // 2 con: KH chưa xác nhận." (T-330: the KH carried on past a sentence's end).
    if (kh === undefined || inClause.colon > at) return false;
    // A word of `JOINED` carries the KH on only right after a phrase about the KH ("KH đã kết hôn
    // và có 2 con"): after other words, what follows it may be said of whoever they name ("KH gặp
    // người yêu cũ vì có 2 con", Owner 31/10); right after the KH, "nên" says "should" ("KH nên có
    // 2 con", the review of PR #917).
    const joined = inClause.joined(at);
    const from = joined && joined.end === inClause.doneAt ? joined.end : kh;
    if (!before.test(note.slice(from, at))) return false;
    after.lastIndex = end;
    const rest = after.exec(note);
    if (!rest) return false;
    inClause.done(end + rest[0].length);
    return true;
  };
}

/** What the Mock extracts of `note`, for the trường of `fields` only: at most one fact each. */
export function mockExtractionOutput(note: string, fields: readonly string[]): ExtractionOutput {
  if (RETRACTED.test(note)) return { facts: [] };
  const sentence = readerOf(note, SENTENCE_END);
  const clause = readerOf(note, CLAUSE_END);
  const covered = new Uint8Array(note.length);
  const saysOfPhrase = saysOfTheKh(sentence, clause);
  const phrases = EXTRACTION_PATTERNS.flatMap(
    ({ field, pattern, value, endedBy, ownerAfter, ...around }) => {
      const ended = endedBy && sentence((part) => lastStart(endedBy, part, covered));
      return [...note.matchAll(pattern)]
        .map((match) => {
          const at = match.index;
          const end = at + match[0].length;
          return {
            ...around,
            at,
            end,
            theirs: !!ownerAfter && startsAt(ownerAfter, note, end),
            /** Whether a word of `endedBy` after it in its sentence ends what it says. */
            ended: () => !!ended && ended(at) >= at,
            field,
            quote: match[0],
            value: (previous: string | undefined) => value(match, previous),
          };
        })
        .filter(({ theirs }) => !theirs);
    },
  )
    .sort((a, b) => a.at - b.at)
    .map((phrase) => ({ ...phrase, says: saysOfPhrase(phrase) }));
  // Where a phrase says something of the KH, a word of `endedBy` gives a value of its own ("KH đã
  // kết hôn nhưng vợ đã mất" is Góa, rule 2); elsewhere it still ends what a phrase before it says
  // ("KH đã kết hôn, có 2 con nhưng vợ đã mất": the wife may be a child's).
  for (const phrase of phrases) {
    if (phrase.says) covered.fill(1, phrase.at, phrase.end);
  }
  const saysOfDeath = saysOfTheKh(sentence, clause);
  const deaths = otherDeaths(note, covered).map((death) => ({
    ...death,
    says: saysOfDeath(death),
  }));
  // Every trường is read, asked for or not: a phrase about the KH ending its clause carries the KH
  // on to the next one, whichever trường it is of.
  const simple = simpleStatement(note, clause);
  const readings = [...phrases.filter(({ ended }) => !ended()), ...deaths].sort(
    (a, b) => a.at - b.at,
  );
  // Each trường takes the last value said of the KH, proposed only as a simple statement: a note
  // that corrects itself says so last ("KH độc thân, nay đã kết hôn" proposes Đã kết hôn, "KH có 2
  // con. Thực ra chỉ 1 con." nothing; rule 1, Owner 31/10 – 01/11, T-330). A value of rules 2 and
  // 3 reads the one before it.
  const last = new Map<
    string,
    { at: number; fact: { field: string; value: string; quote: string } } | null
  >();
  for (const { at, field, quote, value: valueAfter, says, ...phrase } of readings) {
    if (!says) continue;
    const isSimple = simple({ at, ...phrase });
    const value = valueAfter(last.get(field)?.fact.value);
    last.set(field, isSimple && value !== undefined ? { at, fact: { field, value, quote } } : null);
  }
  const facts = [...last.values()]
    .filter((said) => said !== null)
    .sort((a, b) => a.at - b.at)
    .map(({ fact }) => fact)
    .filter(({ field }) => fields.includes(field));
  return { facts };
}
