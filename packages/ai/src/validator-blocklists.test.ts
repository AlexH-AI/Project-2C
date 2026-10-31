/** V3–V6 (prompts G5 §7, §8): blocked phrases in the texts of analysis / discovery. */
import { describe, expect, it } from 'vitest';
import { lettersAround, nfdZw } from './test-support';
import { cleanText } from './text-match';
import { validateOutput, type OutputCheckInput } from './validator';

/** NUL: K20 keeps it for the store to refuse; V3–V6 drop it (G5 §7 item 0, §14.2, DR6-142). */
const NUL = '\u0000';

const input: OutputCheckInput = { factCodes: ['F1'], missingCategories: ['ASSETS'] };

const BLOCKS = [
  'hypotheses',
  'needs',
  'painPoints',
  'themes',
  'discoveryStrategy',
  'nextBestActions',
  'personalityNotes',
] as const;

type Block = (typeof BLOCKS)[number];

/** A valid analysis whose first element of `block` reads `text`; every other text is neutral. */
function analysisWith(block: Block, text: string) {
  const element = (t: string) => ({ text: t, evidence: ['F1'] });
  const output: Record<Block, unknown[]> = {
    hypotheses: [element('KH có thể ưu tiên gia đình')],
    needs: [element('Quỹ học vấn cho con')],
    painPoints: [element('Thanh khoản khi cần tiền gấp')],
    themes: [element('Gia đình là trung tâm')],
    discoveryStrategy: [element('Làm rõ mục tiêu chính')],
    nextBestActions: [element('Hẹn buổi gặp tiếp')],
    personalityNotes: [],
  };
  output[block] =
    block === 'personalityNotes'
      ? [{ system: 'PSYCHOLOGY', ...element(text) }]
      : [element(text), ...output[block].slice(1)];
  return output;
}

const issuesOf = (block: Block, text: string) =>
  validateOutput('analysis', analysisWith(block, text), input);

const codesOf = (block: Block, text: string) => [
  ...new Set(issuesOf(block, text).map((issue) => issue.code)),
];

describe('validateOutput — G5 §8.5 cases', () => {
  it.each([
    ['C1', 'hypotheses', 'KH có 70% khả năng tham gia', ['V3']],
    ['C2', 'hypotheses', 'Xac suat KH dong y cao', ['V3']],
    ['C3', 'hypotheses', 'KH có thể ưu tiên thanh khoản', []],
    ['C4', 'nextBestActions', 'Giữ tỷ lệ phân bổ hiện tại (F14)', []],
    ['C5', 'nextBestActions', 'Đề xuất PRU-Hành Trang Trưởng Thành', ['V4']],
    ['C6', 'nextBestActions', 'Rà lại giải pháp bảo vệ hiện có (F17)', []],
    ['C7', 'needs', 'Gói bảo hiem tron doi phù hợp', ['V4']],
    ['C8', 'hypotheses', 'KH thuộc nhóm INTJ', ['V5']],
    ['C9', 'nextBestActions', 'KH có thể tuổi Tý', ['V5']],
    ['C8b', 'personalityNotes', 'KH có thể thuộc nhóm INTJ', []],
    ['C9b', 'personalityNotes', 'KH có thể tuổi Tý, mệnh Kim', []],
    ['C9c', 'personalityNotes', 'KH có 80% là INTJ', ['V3']],
    ['C10', 'hypotheses', 'Nhân mà KH quan tâm tới con, nên hỏi thêm', []],
    ['C11', 'themes', 'Theo Điều 35 Luật Kinh doanh bảo hiểm', ['V6']],
    ['C12', 'painPoints', 'Khoản 500 triệu đáo hạn năm 2027', []],
    ['C13', 'discoveryStrategy', 'Cần chuyên gia pháp lý xác nhận về thừa kế', []],
    ['C14', 'themes', 'Nghi dinh 46/2023/ND-CP', ['V6']],
    ['C15', 'hypotheses', 'KH sẽ mua nhà năm 2027 (F12)', []],
    ['C16', 'discoveryStrategy', 'Hỏi KH đã có luật sư gia đình chưa', []],
    ['C17', 'nextBestActions', 'Hẹn lại từ 01/10 để làm rõ F10', []],
    ['C18', 'needs', 'Di chúc cần đúng pháp luật Việt Nam', []],
    ['C19', 'nextBestActions', 'Đề xuất PRULink cho KH', ['V4']],
    ['C20', 'nextBestActions', 'Hẹn KH để chốt lịch gặp tiếp', []],
    ['C21', 'hypotheses', 'KH báo mình sẽ đi công tác', []],
    ['C22', 'hypotheses', 'KH có khả năng kỹ thuật tốt', []],
    ['C23', 'themes', 'Điểm sơ bộ của buổi gặp đầu', []],
    ['C24', 'hypotheses', 'KH thuộc nhóm C-level của tập đoàn', []],
    ['C25', 'nextBestActions', 'Chốt được lịch hẹn tuần sau', []],
    ['C26', 'discoveryStrategy', 'Hỏi KH về khoản 2 điều kiện vay', []],
    ['C27', 'discoveryStrategy', 'Hỏi KH đã quyết định số tiền dành cho học phí chưa', []],
    ['C28', 'hypotheses', 'KH có dấu hiệu giữ kỷ luật KH tự đặt khi chi tiêu', []],
    ['C29', 'discoveryStrategy', 'HỎI KH ĐÃ CÓ LUẬT SƯ GIA ĐÌNH CHƯA', []],
    ['C30', 'needs', 'Đúng pHáp luật Việt Nam', []],
    ['C31', 'hypotheses', 'KH có thể gắn bó với đơn vị cũ do tin cậy người tư vấn', []],
    ['C32', 'hypotheses', 'KH có thể cần thời gian suy nghĩ quyết định', []],
    ['C33', 'hypotheses', 'KH thích nhóm màu trung tính', []],
    ['C34', 'discoveryStrategy', 'Làm rõ điều 2 vợ chồng KH còn băn khoăn', []],
    ['C35', 'hypotheses', 'KH có thể sẵn sàng mua nhà trong năm 2027 (F1)', []],
    ['C36', 'painPoints', 'Con KH cần cải thiện điểm số để du học', []],
    ['C37', 'discoveryStrategy', 'Hỏi tài khoản liên kết chung của hai vợ chồng', []],
    ['C38', 'nextBestActions', 'RE bảo viết lại mục tiêu cho rõ', []],
    ['C39', 'hypotheses', 'KH sẵn sàng mua bảo hiểm', ['V3']],
    ['C40', 'hypotheses', 'Chấm điểm KH 8/10', ['V3']],
    ['C41', 'hypotheses', 'KH có thể chốt được trong tháng này', ['V3']],
    ['C42', 'themes', 'Theo khoản 2 điều 35', ['V6']],
    ['C43', 'themes', 'Quyết định số 123/QĐ-BTC', ['V6']],
    ['C44', 'themes', 'Theo Luật BHXH', ['V6']],
    ['C44', 'themes', 'LuẬt Đất đai quy định', ['V6']],
    ['C45', 'themes', 'Theo Điều \u0663\u0665', ['V6']],
    ['C45', 'themes', 'Theo Điều \uff13\uff15', ['V6']],
    ['C46', 'hypotheses', 'KH có \uff17\uff10\uff05 cơ hội đồng ý', ['V3']],
    ['C46', 'hypotheses', 'Tỷ lệ 5\u2030', ['V3']],
    ['C46', 'hypotheses', 'KH có 70 percent cơ hội', ['V3']],
    ['C47', 'hypotheses', 'Xác-suất cao', ['V3']],
    ['C47', 'hypotheses', 'xác_suất cao', ['V3']],
    ['C48', 'hypotheses', 'KH có xác\u200bsuất đồng ý lớn', ['V3']],
    ['C49', 'nextBestActions', 'Đề xuất P\u200brudential cho KH', ['V4']],
    ['C49', 'nextBestActions', 'Đề xuất \uff21\uff29\uff21 cho KH', ['V4']],
    ['C50', 'hypotheses', 'KH có mã I\u2060NTJ', ['V5']],
    ['C50', 'needs', 'KH có mệnh\u00adKim', ['V5']],
    ['C51', 'themes', 'Theo Lu\u200bật Kinh doanh bảo hiểm', ['V6']],
    // T-257 (Owner G5 18/10/2026).
    ['C55', 'hypotheses', nfdZw('KH dễ chốt'), ['V3']],
    ['C55', 'nextBestActions', nfdZw('Bảo Việt'), ['V4']],
    ['C55', 'needs', nfdZw('KH tuổi Tý'), ['V5']],
    ['C55', 'themes', nfdZw('Theo Điều 35'), ['V6']],
    ['C55', 'themes', nfdZw('Nghị quyết 12'), ['V6']],
    ['C56', 'themes', 'Theo Điều\u200b35', ['V6']],
    ['C56', 'themes', 'Theo Điều\u206035', ['V6']],
    ['C56', 'themes', 'Luật\u200bKinh doanh bảo hiểm', ['V6']],
    ['C56', 'themes', 'Luật\u2060BHXH', ['V6']],
    ['C57', 'themes', 'khoản 2\u200bĐiều\u200b35', ['V6']],
    ['C57', 'themes', 'khoản\u20602 điều 35', ['V6']],
    ['C57', 'themes', 'điểm\u200ba\u200bkhoản 2', ['V6']],
    ['C58', 'discoveryStrategy', 'Hỏi KH đã có Luật\u200bSư gia đình chưa', []],
    ['C58', 'needs', 'Di chúc cần đúng pháp\u200bluật Việt Nam', []],
    ['C59', 'hypotheses', 'xác\u3164suất', ['V3']],
    ['C59', 'hypotheses', 'xác\u0085suất', ['V3']],
    ['C60', 'nextBestActions', 'Bảo\u034fMinh', ['V4']],
    ['C61', 'needs', '\u3164', ['V1']],
    ['C61', 'needs', '\u3164…', ['V1']],
    ['C62', 'needs', 'Định hướng nơi ở sau khi nghỉ hưu', []],
    ['C62', 'needs', 'Định hướng ngoài giờ làm việc', []],
    ['C62', 'needs', 'Định hướng nối nghiệp cho con', []],
    ['C62', 'nextBestActions', 'RE chuyển hướng nói sang mục tiêu học phí', []],
    ['C63', 'hypotheses', 'KH cần suy nghĩ định hướng đầu tư', []],
    ['C63', 'hypotheses', 'KH nghĩ định cư ở Úc', []],
    ['C63', 'hypotheses', 'KH nghỉ định kỳ hằng năm', []],
    ['C64', 'hypotheses', 'Phần lớn là khách nông thôn', []],
    ['C64', 'hypotheses', 'KH thuộc nhóm khách lãnh đạo cấp cao', []],
    ['C64', 'hypotheses', 'Ngân hàng xếp hàng khách ưu tiên riêng', []],
    ['C65', 'hypotheses', 'KH sẵn sàng kỹ lưỡng xem xét', []],
    ['C65', 'hypotheses', 'KH muốn chắc chắn kỳ hạn gửi tiền', []],
    ['C65', 'hypotheses', 'Khả năng múa của con KH', []],
    ['C65', 'hypotheses', 'KH có khả năng mưa gió vẫn đến', []],
    ['C66', 'needs', 'Hai hợp đồng cùng mệnh giá', []],
    ['C66', 'hypotheses', 'KH bỏ luật sư cũ', []],
    ['C66', 'painPoints', 'KH lo phí bảo hiểm từ kỳ tới sẽ tăng', []],
    ['C66', 'hypotheses', 'KH thường gọi bảo hiểm khi xe gặp sự cố', []],
    ['C67', 'needs', 'KH là người hướng nội', ['V5']],
    ['C67', 'needs', 'KH cung mệnh Kim', ['V5']],
    ['C67', 'needs', 'KH la nguoi huong noi', ['V5']],
    ['C67', 'needs', 'KH huong nội', ['V5']],
    ['C68', 'themes', 'Theo nghị định mới', ['V6']],
    ['C68', 'themes', 'Theo nghi dinh moi', ['V6']],
    ['C68', 'themes', 'Nghi định 46 về thuế', ['V6']],
    ['C69', 'hypotheses', 'KH là khách nóng', ['V3']],
    ['C69', 'hypotheses', 'KH la khach nong', ['V3']],
    ['C69', 'hypotheses', 'KH là khach nóng', ['V3']],
    ['C69', 'hypotheses', 'KH sẵn sàng ký ngay', ['V3']],
    ['C69', 'hypotheses', 'KH san sang ky ngay', ['V3']],
    ['C69', 'hypotheses', 'Xác suat cao', ['V3']],
    ['C70', 'needs', 'Giữ kỉ luật Thép của KH', []],
    ['C70', 'needs', 'KH tin vào qui luật Thị trường', []],
    ['C70', 'needs', 'Giữ KỈ LUẬT Thép', []],
    ['C70', 'needs', 'KH tin vào QUI LUẬT Thị trường', []],
    // T-277 (Owner G5 23/10/2026).
    ['C73', 'hypotheses', 'KH có xác\u0301 suất đồng ý cao', ['V3']],
    ['C73', 'hypotheses', 'KH có xá\u0107 suất đồng ý cao', ['V3']],
    ['C73', 'hypotheses', 'KH có xác \u0301suất đồng ý cao', ['V3']],
    ['C73', 'hypotheses', 'KH có xác\u00b4suất đồng ý cao', ['V3']],
    ['C73', 'hypotheses', 'KH có xác\u00a8suất đồng ý cao', ['V3']],
    ['C74', 'hypotheses', 'KH dễ \u0301chốt', ['V3']],
    ['C74', 'nextBestActions', 'Đề xuất Bảo\u00b4Việt', ['V4']],
    ['C74', 'needs', 'KH tuổi\u00b4Tý', ['V5']],
    ['C74', 'themes', 'Theo Điều\u00b435', ['V6']],
    ['C74', 'themes', 'Theo Luật \u0301Kinh doanh bảo hiểm', ['V6']],
    ['C75', 'hypotheses', 'KH có thể chốt\u0301 được', ['V3']],
    ['C75', 'hypotheses', 'KH có xac\u0301 suat cao', ['V3']],
    ['C75', 'hypotheses', 'Ý x\u0301xác suất', ['V3']],
    ['C76', 'hypotheses', 'KH là khách am hiểu tài chính', []],
    ['C76', 'hypotheses', 'Nhóm khách am tường thị trường chứng khoán', []],
    ['C76', 'hypotheses', 'KH là khách lanh lợi, quyết nhanh', []],
    ['C76', 'needs', 'Hỏi KH về định hướng noi theo của gia đình', []],
    ['C76', 'hypotheses', 'KH làm IT khả năng tăng thu nhập cao', []],
    ['C77', 'hypotheses', 'KH la khach am', ['V3']],
    ['C77', 'hypotheses', 'KH la khach lanh', ['V3']],
    ['C77', 'needs', 'KH huong noi', ['V5']],
    ['C77', 'hypotheses', 'KH là khach ấm', ['V3']],
    ['C77', 'hypotheses', 'KH có ít kha nang', ['V3']],
    ['C78', 'needs', 'KH chi tiêu theo định luật Pareto', []],
    ['C78', 'needs', 'Định luật Pareto đúng với chi tiêu của KH', []],
    ['C78', 'needs', 'KH giữ giới luật Phật giáo', []],
    ['C78', 'needs', 'KH giữ GIỚI LUẬT Phật giáo', []],
    ['C79', 'themes', 'Theo quy định Luật Kinh doanh bảo hiểm', ['V6']],
    ['C79', 'themes', 'Theo qui định Luật Đất đai', ['V6']],
    ['C79', 'themes', 'Theo đạo luật Doanh nghiệp', ['V6']],
    // T-323 (Owner G5 31/10/2026).
    ['C80', 'hypotheses', `phần${NUL}trăm`, ['V3']],
    ['C80', 'hypotheses', `xác${NUL}suất`, ['V3']],
    ['C80', 'hypotheses', `KH có xác ${NUL}suất đồng ý cao`, ['V3']],
    ['C80', 'hypotheses', 'xác\u0007suất', ['V3']],
    ['C81', 'nextBestActions', `Đề xuất P${NUL}rudential cho KH`, ['V4']],
    ['C81', 'hypotheses', `KH có mã I${NUL}NTJ`, ['V5']],
    ['C81', 'themes', `Theo Lu${NUL}ật Kinh doanh bảo hiểm`, ['V6']],
    ['C81', 'themes', `Theo Điều${NUL}35`, ['V6']],
    ['C82', 'themes', 'KH dùng dịch vụ môi giới Luật Kinh doanh bảo hiểm cho phép', ['V6']],
    ['C82', 'themes', 'Môi giới Luật Kinh doanh bảo hiểm 2022', ['V6']],
    ['C82', 'themes', 'MÔI GIỚI LUẬT Kinh doanh bảo hiểm', ['V6']],
    ['C82', 'themes', 'Ranh giới Luật Đất đai quy định với thửa đất của KH', ['V6']],
    ['C82', 'themes', 'KH buôn bán qua biên giới Luật Hải quan yêu cầu khai báo', ['V6']],
    ['C82', 'themes', 'Ở nhiều nước trên thế giới Luật Thừa kế khác nhau', ['V6']],
    ['C83', 'needs', 'Giới luật Phật giáo cấm sát sinh', []],
    ['C83', 'hypotheses', `KH thích${NUL}đọc sách`, []],
  ] as const)('%s: %s "%s" → %j', (_, block, text, codes) => {
    expect(codesOf(block, text)).toEqual(codes);
  });

  it.each([
    ['C71', '300 letters and 650 000 U+200B', lettersAround(650_000), ['V1']],
    ['C71', '300 letters and 701 U+200B', lettersAround(701), ['V1']],
    ['C72', '300 letters and 700 U+200B', lettersAround(700), []],
    [
      'C72',
      '300 letters written NFD and 100 U+200B',
      `${'ệ'.normalize('NFD').repeat(300)}${'\u200b'.repeat(100)}`,
      [],
    ],
  ] as const)('%s: %s', (_, __, text, codes) => {
    expect(codesOf('needs', text)).toEqual(codes);
  });
  // G5 §7 item 0: the blank Braille pattern is in the K20 set too.
  it('drops U+2800 between the words of a phrase', () => {
    expect(codesOf('hypotheses', 'xác' + String.fromCodePoint(0x2800) + 'suất')).toEqual(['V3']);
  });

  it('C71: says the string as written is too long', () => {
    expect(issuesOf('needs', lettersAround(701))).toEqual([
      { code: 'V1', path: 'needs[0].text', detail: 'quá 1 000 ký tự kể cả ký tự vô hình' },
    ]);
  });

  it('C1: one issue for "%" and one for "khả năng tham gia", at the text', () => {
    expect(issuesOf('hypotheses', 'KH có 70% khả năng tham gia')).toEqual([
      { code: 'V3', path: 'hypotheses[0].text', detail: 'có "%"' },
      { code: 'V3', path: 'hypotheses[0].text', detail: 'có "khả năng tham gia"' },
    ]);
  });

  it('C11: the article and the law are two V6 issues', () => {
    expect(issuesOf('themes', 'Theo Điều 35 Luật Kinh doanh bảo hiểm')).toEqual([
      { code: 'V6', path: 'themes[0].text', detail: 'có "Điều 35"' },
      { code: 'V6', path: 'themes[0].text', detail: 'có "Luật K"' },
    ]);
  });
});

describe('validateOutput — V3 to V6', () => {
  it('checks every text of every block, in discovery too', () => {
    for (const block of BLOCKS) {
      expect(codesOf(block, 'Không rõ xác suất')).toEqual(['V3']);
    }
    const output = {
      hypotheses: [],
      discoveryStrategy: [
        { text: 'Hỏi về tài sản', missingCategory: 'ASSETS' },
        { text: 'Hỏi về bảo hiểm trọn đời', evidence: ['F1'] },
      ],
      nextBestActions: [{ text: 'Hẹn gặp', evidence: ['F1'] }],
      personalityNotes: [],
    };
    expect(validateOutput('discovery', output, input)).toEqual([
      { code: 'V4', path: 'discoveryStrategy[1].text', detail: 'có "bảo hiểm trọn đời"' },
    ]);
  });

  it.each([
    ['V3', 'KH thuộc nhóm khach nong'],
    ['V4', 'Rà lại hợp đồng Bao Long'],
    ['V5', 'KH co ve huong noi'],
    ['V6', 'Theo nghi dinh moi'],
    ['V6', 'Xem khoan 2 dieu 35'],
    ['V6', 'Xem diem a khoan 2'],
  ])('%s matches a text written without diacritics: "%s"', (code, text) => {
    expect(codesOf('hypotheses', text)).toEqual([code]);
  });

  it.each([
    ['tử vi', 'Xem tu vi cho KH'],
    ['bạch dương', 'Bach duong'],
    ['tuổi tý', 'KH tuoi ty'],
    ['mệnh kim', 'KH menh kim'],
  ])('V5 matches "%s" only with its diacritics', (phrase, folded) => {
    expect(codesOf('hypotheses', folded)).toEqual([]);
    expect(codesOf('hypotheses', `KH ${phrase}`)).toEqual(['V5']);
  });

  it('compares a phrase on the accented form too, where a lone combining mark is a boundary', () => {
    // NFC cannot compose "x" with U+0301; folding drops the mark and glues "x" to "xac".
    expect(codesOf('hypotheses', 'Ý x́xác suất')).toEqual(['V3']);
  });

  it('matches whole words only, whatever the case and spacing', () => {
    expect(codesOf('hypotheses', 'Thông tin chubby')).toEqual([]);
    expect(codesOf('hypotheses', 'Hợp đồng CHUBB')).toEqual(['V4']);
    expect(codesOf('hypotheses', 'Hợp đồng  Tokio\tMarine')).toEqual(['V4']);
    expect(codesOf('hypotheses', 'KH giống đồng đội')).toEqual([]);
    expect(codesOf('hypotheses', 'Hỏi về nhóm   máu O')).toEqual(['V5']);
  });

  it('V5 catches MBTI codes and blood groups by pattern', () => {
    expect(codesOf('needs', 'KH kiểu ENFP-A')).toEqual(['V5']);
    expect(codesOf('needs', 'KH nhóm máu O')).toEqual(['V5']);
  });

  it('V6 catches "luật <Tên>" case-sensitively, not after "pháp"', () => {
    expect(codesOf('needs', 'Theo LUẬT Đất đai')).toEqual(['V6']);
    expect(codesOf('needs', 'Đúng Pháp luật Việt Nam')).toEqual([]);
    expect(codesOf('needs', 'Đúng luật hiện hành')).toEqual([]);
    expect(codesOf('needs', 'Hỏi KH về Luật sư')).toEqual([]);
  });

  // G5 §8.4: "KH", "RE" and "sư" in any case, "kỷ", "kỉ", "quy" and "qui" each on its own (DR6-16,
  // DR6-61, DR6-102).
  it.each([
    'Giữ luật Kh tự đặt khi chi tiêu',
    'Theo luật Re đặt cho buổi gặp',
    'KH tin vào quy luật Thị trường',
    'Giữ kỷ luật Thép của KH',
    'KH tin vào Qui luật Thị trường',
    'Giữ Kỉ luật Thép của KH',
  ])('V6 lets "luật" through before KH / RE or after kỷ / kỉ / quy / qui: "%s"', (text) => {
    expect(codesOf('needs', text)).toEqual([]);
  });

  it('V6 still catches the name of a law that only starts like KH', () => {
    expect(codesOf('needs', 'Theo Luật Kinh doanh bảo hiểm')).toEqual(['V6']);
    expect(codesOf('needs', 'Theo Luật Khoa học và Công nghệ')).toEqual(['V6']);
  });

  // G5 §8.4 (§12.5, DR6-124 b): "định" is let through, but not the "định" of "quy định".
  it.each([
    ['KH tin vào định luật Murphy', []],
    ['KH tin vào ĐỊNH LUẬT Murphy', []],
    ['Theo quy định luật Đất đai', ['V6']],
    ['THEO QUY ĐỊNH LUẬT Đất đai', ['V6']],
    ['Theo Qui Định Luật Đất đai', ['V6']],
  ])('V6 reads "luật" after "định" by the word before it: "%s" → %j', (text, codes) => {
    expect(codesOf('needs', text)).toEqual(codes);
  });

  // G5 §8.4 (§14.3, DR6-143): "giới" is let through, but not the "giới" of "môi", "ranh", "biên",
  // "thế", each a whole word ("tranh" is not "ranh"); the "giới" of another word is the loss §14.3
  // records.
  it.each([
    ['Môi giới luật Kinh doanh bảo hiểm', ['V6']],
    ['Vì thế giới luật Phật giáo được KH giữ nghiêm', ['V6']],
    ['Vì thế, giới luật Phật giáo được KH giữ nghiêm', []],
    ['KH treo tranh giới luật Phật giáo ở phòng khách', []],
    ['Lao động nữ giới Luật Lao động có quy định riêng', []],
  ])('V6 reads "luật" after "giới" by the word before it: "%s" → %j', (text, codes) => {
    expect(codesOf('needs', text)).toEqual(codes);
  });

  // G5 §7 item 2 (§12.4, DR6-124 a): "ấm", "lạnh", "nội", "ít" match bare in a bare phrase only.
  it.each([
    ['KH là khách am', []],
    ['KH thiên về hướng noi', []],
    ['Phòng IT khả năng cao sẽ đổi', ['có "khả năng cao"']],
  ])('lets a word of the closed list through bare in a mixed phrase: "%s"', (text, details) => {
    expect(issuesOf('needs', text).map((issue) => issue.detail)).toEqual(details);
  });

  // G5 §7 item 0 (§12.2, DR6-122): a combining mark on no vowel reads as a space, and the detail
  // keeps one space between the parts.
  it.each([
    ['hypotheses', 'KH có xác\u00b4suất đồng ý cao', 'V3', 'có "xác suất"'],
    ['themes', 'Theo Điều\u00b435', 'V6', 'có "Điều 35"'],
    ['themes', 'Theo Luật \u0301Kinh doanh bảo hiểm', 'V6', 'có "Luật K"'],
  ] as const)('C73, C74: finds what a stray mark cut in two: "%s"', (block, text, code, detail) => {
    expect(issuesOf(block, text)).toEqual([{ code, path: `${block}[0].text`, detail }]);
  });

  it('reads a stray mark as a space, then one space between words and none at the ends', () => {
    expect(cleanText('\u00b4KH  xác\u00b4suất\u0301 cao\u00a8')).toBe('KH xác suất cao');
  });

  // G5 §7 item 0 (§14.2, DR6-142): NUL is dropped as an invisible character is, and the detail
  // quotes the text so cleaned.
  it.each([
    ['hypotheses', `phần${NUL}trăm`, 'V3', 'có "phầntrăm"'],
    ['nextBestActions', `Đề xuất Bảo${NUL}Việt`, 'V4', 'có "BảoViệt"'],
  ] as const)('C80, C81: finds what a NUL glued together: "%s"', (block, text, code, detail) => {
    expect(issuesOf(block, text)).toEqual([{ code, path: `${block}[0].text`, detail }]);
  });

  it('drops a NUL anywhere, then one space between words and none at the ends', () => {
    expect(cleanText(`${NUL}KH ${NUL} xác${NUL}suất${NUL}`)).toBe('KH xácsuất');
  });

  // §14.2: NUL goes with the invisible characters, before NFKC, so a mark written after one still
  // composes with its letter (as U+200B, DR6-17).
  it.each([
    ['KH dễ chốt', 'hypotheses', 'V3'],
    ['Theo Điều 35', 'themes', 'V6'],
  ] as const)('drops a NUL before each mark of "%s" written NFD', (text, block, code) => {
    const nfdNul = text.normalize('NFD').replace(/\p{M}/gu, (mark) => NUL + mark);
    expect(codesOf(block, nfdNul)).toEqual([code]);
  });

  // G5 §7 item 6: only V5 is lifted for "Thông tin tham khảo" (DR6-61).
  it.each([
    ['V4', 'KH có thể tuổi Tý, đã có hợp đồng Prudential'],
    ['V6', 'KH có thể tuổi Tý, như Điều 35 nói'],
  ])('%s still checks personalityNotes: "%s"', (code, text) => {
    expect(codesOf('personalityNotes', text)).toEqual([code]);
  });

  it('V6 catches document numbers', () => {
    expect(codesOf('needs', 'Xem 08/2022/QH15')).toEqual(['V6']);
    expect(codesOf('needs', 'Theo TT-BTC mới')).toEqual(['V6']);
  });

  it.each([
    ['V3', 'KH dễ chốt', 'KH de chot'],
    ['V3', 'KH có khả năng ký ngay', 'KH co kha nang ky ngay'],
    ['V3', 'KH có độ tin cậy cao', 'KH co do tin cay cao'],
    ['V4', 'Hợp đồng Bảo Việt', 'Hop dong Bao Viet'],
    ['V4', 'Hợp đồng Bảo Minh', 'Hop dong Bao Minh'],
    ['V5', 'KH nhóm máu hiếm', 'KH nhom mau hiem'],
    ['V6', 'Theo nghị quyết mới', 'Theo nghi quyet moi'],
  ])('%s matches "%s" only with its diacritics (G5 §10.3)', (code, accented, folded) => {
    expect(codesOf('hypotheses', accented)).toEqual([code]);
    expect(codesOf('hypotheses', folded)).toEqual([]);
  });

  it.each([
    ['V3', 'KH có thể chốt được hợp đồng'],
    ['V3', 'KH sẵn sàng mua.'],
    ['V3', 'KH sẵn sàng mua giải pháp mới'],
    ['V3', 'Tiềm năng mua sản phẩm mới'],
    ['V3', 'Xếp hạng KH theo mức chi tiêu'],
    ['V3', 'Điểm số khách hàng cao'],
    ['V5', 'KH thuộc nhóm D'],
    ['V5', 'KH kiểu S, thích ổn định'],
    ['V6', 'Theo công văn số 45'],
    ['V6', 'Xem khoan 2 dieu 35 cua luat'],
    ['V6', 'Theo Luật Hôn nhân và gia đình'],
  ])('%s still blocks a narrowed entry: "%s"', (code, text) => {
    expect(codesOf('hypotheses', text)).toEqual([code]);
  });

  it.each([
    ['V3', 'KH có xácsuất cao'],
    ['V4', 'Hợp đồng TokioMarine'],
    ['V5', 'KH thuộc nhómD'],
  ])('%s matches a phrase written without its inner space: "%s"', (code, text) => {
    expect(codesOf('hypotheses', text)).toEqual([code]);
  });

  it('V6 reads "Điều <số>" with its capital only, on the original text', () => {
    expect(issuesOf('themes', 'ĐIỀU 12 quy định')).toEqual([
      { code: 'V6', path: 'themes[0].text', detail: 'có "ĐIỀU 12"' },
    ]);
    expect(codesOf('themes', 'Theo điều 35 về thừa kế')).toEqual([]);
  });

  it('keeps at most 40 characters of the matched phrase in the detail', () => {
    const number = `12/2023/${'a'.repeat(60)}`;
    expect(issuesOf('needs', `Xem ${number}`)).toEqual([
      { code: 'V6', path: 'needs[0].text', detail: `có "${number.slice(0, 39)}…"` },
    ]);
  });

  // Review #420: the detail quotes the phrase as the model wrote it, not the entry, so the retry
  // finds it in its own text.
  it.each([
    ['with its marks', 'KH có Xác Suất cao', 'V3', 'Xác Suất'],
    ['bare', 'Xac suat KH dong y cao', 'V3', 'Xac suat'],
    ['bare in part', 'KH có xác suat cao', 'V3', 'xác suat'],
    ['with a hyphen', 'Hợp đồng Dai-ichi cũ', 'V4', 'Dai-ichi'],
    ['with a dash between its words', 'KH có xác - suất cao', 'V3', 'xác - suất'],
    ['after a dash between spaces', 'Xem hợp đồng - Prudential', 'V4', 'Prudential'],
    // Lower case writes "İ" as two code units.
    ['after a letter that lower case makes two', 'İnci có hợp đồng Prudential', 'V4', 'Prudential'],
    ['ending in such a letter', 'Hợp đồng DAIICHİ cũ', 'V4', 'DAIICHİ'],
    ['by a pattern, in its case', 'Theo QUYẾT ĐỊNH SỐ 12', 'V6', 'QUYẾT ĐỊNH SỐ 1'],
  ])('quotes the phrase as written: %s', (_, text, code, written) => {
    expect(issuesOf('themes', text)).toEqual([
      { code, path: 'themes[0].text', detail: `có "${written}"` },
    ]);
  });

  // Review #420: entries of one rule found at overlapping places are one issue, naming the whole
  // place; separate places stay separate issues (C1, C11).
  it.each([
    ['PRUDENTIAL', 'V4', 'PRUDENTIAL'],
    ['KH nhóm máu AB', 'V5', 'nhóm máu AB'],
    ['Theo khoản 2 Điều 35', 'V6', 'khoản 2 Điều 35'],
    ['Theo Bộ luật Dân sự', 'V6', 'Bộ luật D'],
    ['Gói bảo hiểm liên kết đơn vị', 'V4', 'Gói bảo hiểm liên kết đơn vị'],
  ])('names one place once: "%s"', (text, code, written) => {
    expect(issuesOf('needs', text)).toEqual([
      { code, path: 'needs[0].text', detail: `có "${written}"` },
    ]);
  });
});
