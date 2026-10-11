/**
 * Blocklists of V3–V6, taken as they are from prompts G5 §8 (Owner G5 07/10/2026, Phase 6 round
 * 11/10/2026): one `row` per table row, its entries separated by " · " as in the file. Changing an
 * entry means a new prompt version and G5 again; a typo against that file is a bug.
 */
import { char, pattern, phrase, WORD_END as E, WORD_START as B, type Matcher } from './text-match';

/** Phrases of one G5 table row; `folded`: the row's "Bỏ dấu" column says "có". */
const row = (folded: boolean, entries: string) =>
  entries.split(' · ').map((words) => phrase(words, folded));

/** A decimal digit of any script (G5 §7 item 5): NFKC leaves "٣٥" as it is. */
const D = String.raw`\p{Nd}`;

/** Each letter of a lower case word, in either case: `ci('kỷ')` → `[kK][ỷỶ]`. */
const ci = (word: string) => Array.from(word, (c) => `[${c}${c.toUpperCase()}]`).join('');

/** V3 — probabilities, scoring, guessing whether the KH will buy (G5 §8.1). */
const V3: readonly Matcher[] = [
  char('%'),
  char('‰'),
  ...row(true, 'phần trăm · percent'),
  ...row(true, 'xác suất'),
  ...row(true, 'tỉ lệ chốt · tỷ lệ chốt · tỉ lệ thành công · tỷ lệ thành công'),
  ...row(true, 'khả năng chốt · khả năng mua · khả năng tham gia · khả năng thành công'),
  ...row(false, 'khả năng ký'),
  ...row(true, 'khả năng cao · khả năng thấp · nhiều khả năng · ít khả năng'),
  ...row(true, 'cơ hội chốt · chốt deal · chốt sale · chốt hợp đồng · chốt hđ'),
  ...row(false, 'dễ chốt'),
  pattern(
    String.raw`${B}chốt được${E}(?! (lịch|ngày|giờ|buổi|thời gian|thời điểm|cuộc hẹn|hẹn|mốc|kế hoạch|mục tiêu|phương án)${E})`,
    'both',
  ),
  pattern(
    String.raw`${B}(sẵn sàng|tiềm năng) mua${E}(?=\s*($|[.,;:!?)]|(bảo hiểm|sản phẩm|giải pháp|gói|hợp đồng|hđ)${E}))`,
    'both',
  ),
  ...row(true, 'sẵn sàng ký · chắc chắn mua · chắc chắn ký · tiềm năng chốt'),
  ...row(false, 'độ tin cậy · mức độ tin cậy'),
  ...row(
    true,
    'khách nóng · khách lạnh · khách ấm · hot lead · warm lead · cold lead · lead score',
  ),
  ...row(
    true,
    'chấm điểm KH · chấm điểm khách · điểm số KH · điểm số khách · xếp hạng KH · xếp hạng khách',
  ),
];

/** V4 — insurers (a), product lines (b), product types (c) (G5 §8.2). */
const V4: readonly Matcher[] = [
  ...row(
    true,
    'prudential · pru · manulife · aia · dai-ichi · daiichi · fwd · generali · sun life · sunlife · chubb · hanwha · mb ageas · ageas · bidv metlife · metlife · cathay · fubon · shinhan life · phú hưng life · baoviet · bvnt · aviva · vietcombank-cardif · vcli · cardif · bic · pvi · pti · pjico · mic · vbi · liberty · tokio marine · msig · bảo long · aaa assurance',
  ),
  ...row(false, 'bảo việt · bảo minh'),
  pattern(String.raw`${B}pru [a-zà-ỹđ]`, 'both'),
  ...row(
    true,
    'liên kết đơn vị · bảo hiểm liên kết · unit-linked · universal life · whole life · term life · bảo hiểm tử kỳ · bảo hiểm hỗn hợp · bảo hiểm trọn đời · bảo hiểm niên kim · niên kim · bảo hiểm đầu tư · gói bảo hiểm · sản phẩm bảo hiểm · quyền lợi bổ trợ · sản phẩm bổ trợ · rider',
  ),
];

/** V5 — personality labels, blocked outside `personalityNotes` (G5 §8.3). */
const V5: readonly Matcher[] = [
  pattern(String.raw`${B}[ie][ns][tf][jp]( [at])?${E}`, 'accented'),
  ...row(true, 'mbti · disc · enneagram · big five · big 5'),
  pattern(String.raw`${B}(nhóm|kiểu) [disc]${E}(?! (level|suite)${E})`, 'both'),
  ...row(true, 'dominance · influence · steadiness · conscientiousness'),
  ...row(
    true,
    'hướng nội · hướng ngoại · introvert · extrovert · người hướng nội · người hướng ngoại',
  ),
  ...row(true, 'cung hoàng đạo · cung mệnh · con giáp · ngũ hành · thần số học · nhân số học'),
  ...row(false, 'nhóm máu'),
  ...row(false, 'tử vi · bát tự'),
  ...row(
    false,
    'bạch dương · kim ngưu · song tử · cự giải · xử nữ · thiên bình · bọ cạp · thiên yết · nhân mã · ma kết · bảo bình · song ngư · sư tử',
  ),
  ...row(
    false,
    'tuổi tý · tuổi sửu · tuổi dần · tuổi mão · tuổi mẹo · tuổi thìn · tuổi tỵ · tuổi tị · tuổi ngọ · tuổi mùi · tuổi thân · tuổi dậu · tuổi tuất · tuổi hợi',
  ),
  ...row(false, 'mệnh kim · mệnh mộc · mệnh thủy · mệnh thuỷ · mệnh hỏa · mệnh hoả · mệnh thổ'),
  pattern(String.raw`${B}nhóm máu (a|b|ab|o)${E}`, 'accented'),
];

/**
 * "luật <Tên>" (G5 §8.4): "luật" in any case, not after "pháp" (Owner Q6), "kỷ" or "quy", before a
 * word starting with a capital that is not "KH", "RE" or "sư" (the prompt's own words, a lawyer).
 */
const LAW_NAME = String.raw`(?<!${B}(${ci('pháp')}|${ci('kỷ')}|${ci('quy')})\s+)${B}${ci('luật')}\s+(?!(KH|RE|${ci('sư')})${E})\p{Lu}`;

/** V6 — citing legal texts (G5 §8.4; "khoản <số>" alone is money, Owner Q4). */
const V6: readonly Matcher[] = [
  pattern(String.raw`${B}(Điều|ĐIỀU)\s+${D}+`, 'original'),
  pattern(String.raw`${B}khoản\s+${D}+[,]?\s+điều\s+${D}+`, 'both'),
  pattern(String.raw`${B}điểm\s+[a-zđ]\s+khoản${E}`, 'both'),
  pattern(LAW_NAME, 'original'),
  ...row(true, 'bộ luật · nghị định · thông tư · văn bản hợp nhất'),
  ...row(false, 'nghị quyết'),
  pattern(String.raw`${B}(quyết định|công văn) số\s*${D}`, 'both'),
  pattern(String.raw`${B}${D}{1,4}/${D}{4}/[a-zđ${D}]+${E}`, 'both'),
  pattern(String.raw`${B}(nđ cp|tt btc|qh1${D})${E}`, 'both'),
];

export const BLOCKLISTS = { V3, V4, V5, V6 } as const;
