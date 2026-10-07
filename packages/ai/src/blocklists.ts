/**
 * Blocklists of V3–V6, taken as they are from prompts G5 §8 (Owner G5 07/10/2026): one `row` per
 * table row, its entries separated by " · " as in the file. Changing an entry means a new prompt
 * version and G5 again; a typo against that file is a bug.
 */
import { char, pattern, phrase, WORD_END as E, WORD_START as B, type Matcher } from './text-match';

/** Phrases of one G5 table row; `folded`: the row's "Bỏ dấu" column says "có". */
const row = (folded: boolean, entries: string) =>
  entries.split(' · ').map((words) => phrase(words, folded));

/** V3 — probabilities, scoring, guessing whether the KH will buy (G5 §8.1). */
const V3: readonly Matcher[] = [
  char('%'),
  ...row(true, 'phần trăm'),
  ...row(true, 'xác suất'),
  ...row(true, 'tỉ lệ chốt · tỷ lệ chốt · tỉ lệ thành công · tỷ lệ thành công'),
  ...row(
    true,
    'khả năng chốt · khả năng mua · khả năng ký · khả năng tham gia · khả năng thành công',
  ),
  ...row(true, 'khả năng cao · khả năng thấp · nhiều khả năng · ít khả năng'),
  ...row(
    true,
    'cơ hội chốt · dễ chốt · chốt được · chốt deal · chốt sale · chốt hợp đồng · chốt hđ',
  ),
  ...row(true, 'sẵn sàng mua · sẵn sàng ký · chắc chắn mua · chắc chắn ký'),
  ...row(true, 'tiềm năng mua · tiềm năng chốt · độ tin cậy · mức độ tin cậy'),
  ...row(
    true,
    'khách nóng · khách lạnh · khách ấm · hot lead · warm lead · cold lead · lead score',
  ),
  ...row(true, 'chấm điểm · điểm số · xếp hạng khách'),
];

/** V4 — insurers (a), product lines (b), product types (c) (G5 §8.2). */
const V4: readonly Matcher[] = [
  ...row(
    true,
    'prudential · pru · manulife · aia · dai-ichi · dai ichi · daiichi · fwd · generali · sun life · sunlife · chubb · hanwha · mb ageas · ageas · bidv metlife · metlife · cathay · fubon · shinhan life · phú hưng life · bảo việt · baoviet · bvnt · aviva · vietcombank-cardif · vcli · cardif · bic · pvi · bảo minh · pti · pjico · mic · vbi · liberty · tokio marine · msig · bảo long · aaa assurance',
  ),
  pattern(String.raw`${B}pru[-\s]?[a-zà-ỹđ]`, 'both'),
  ...row(
    true,
    'liên kết đơn vị · liên kết chung · unit-linked · unit linked · universal life · whole life · term life · bảo hiểm tử kỳ · bảo hiểm hỗn hợp · bảo hiểm trọn đời · bảo hiểm niên kim · niên kim · bảo hiểm đầu tư · gói bảo hiểm · sản phẩm bảo hiểm · quyền lợi bổ trợ · sản phẩm bổ trợ · rider',
  ),
];

/** V5 — personality labels, blocked outside `personalityNotes` (G5 §8.3). */
const V5: readonly Matcher[] = [
  pattern(String.raw`${B}[ie][ns][tf][jp](-[at])?${E}`, 'accented'),
  ...row(true, 'mbti · disc · enneagram · big five · big 5'),
  ...row(
    true,
    'nhóm d · nhóm i · nhóm s · nhóm c · kiểu d · kiểu i · kiểu s · kiểu c · dominance · influence · steadiness · conscientiousness',
  ),
  ...row(
    true,
    'hướng nội · hướng ngoại · introvert · extrovert · người hướng nội · người hướng ngoại',
  ),
  ...row(
    true,
    'cung hoàng đạo · cung mệnh · con giáp · ngũ hành · thần số học · nhân số học · nhóm máu',
  ),
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
  pattern(String.raw`${B}nhóm máu\s*(a|b|ab|o)${E}`, 'accented'),
];

/** V6 — citing legal texts (G5 §8.4; "khoản <số>" alone is money, Owner Q4; Q6 for "pháp luật"). */
const V6: readonly Matcher[] = [
  pattern(String.raw`${B}điều\s+\d+`, 'both'),
  pattern(String.raw`${B}khoản\s+\d+[,]?\s+điều${E}`, 'both'),
  pattern(String.raw`${B}điểm\s+[a-zđ]\s+khoản${E}`, 'both'),
  pattern(String.raw`(?<!(pháp|Pháp|PHÁP)\s+)${B}(luật|Luật|LUẬT)\s+\p{Lu}`, 'original'),
  ...row(
    true,
    'bộ luật · nghị định · thông tư · nghị quyết · văn bản hợp nhất · quyết định số · công văn số',
  ),
  pattern(String.raw`${B}\d{1,4}/\d{4}/[a-zđ0-9-]+${E}`, 'both'),
  pattern(String.raw`${B}(nđ-cp|tt-btc|qh1\d)${E}`, 'both'),
];

export const BLOCKLISTS = { V3, V4, V5, V6 } as const;
