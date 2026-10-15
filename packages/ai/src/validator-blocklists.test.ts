/** V3–V6 (prompts G5 §7, §8): blocked phrases in the texts of analysis / discovery. */
import { describe, expect, it } from 'vitest';
import { validateOutput, type OutputCheckInput } from './validator';

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
  ] as const)('%s: %s "%s" → %j', (_, block, text, codes) => {
    expect(codesOf(block, text)).toEqual(codes);
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
    expect(issuesOf('needs', 'KH nhóm máu AB')).toEqual([
      { code: 'V5', path: 'needs[0].text', detail: 'có "nhóm máu"' },
      { code: 'V5', path: 'needs[0].text', detail: 'có "nhóm máu ab"' },
    ]);
  });

  it('V6 catches "luật <Tên>" case-sensitively, not after "pháp"', () => {
    expect(codesOf('needs', 'Theo LUẬT Đất đai')).toEqual(['V6']);
    expect(codesOf('needs', 'Đúng Pháp luật Việt Nam')).toEqual([]);
    expect(codesOf('needs', 'Đúng luật hiện hành')).toEqual([]);
    expect(codesOf('needs', 'Hỏi KH về Luật sư')).toEqual([]);
  });

  // G5 §8.4: "KH", "RE" and "sư" in any case, "kỷ" and "quy" each on its own (DR6-16, DR6-61).
  it.each([
    'Giữ luật Kh tự đặt khi chi tiêu',
    'Theo luật Re đặt cho buổi gặp',
    'KH tin vào quy luật Thị trường',
    'Giữ kỷ luật Thép của KH',
  ])('V6 lets "luật" through before KH / RE or after kỷ / quy: "%s"', (text) => {
    expect(codesOf('needs', text)).toEqual([]);
  });

  it('V6 still catches the name of a law that only starts like KH', () => {
    expect(codesOf('needs', 'Theo Luật Kinh doanh bảo hiểm')).toEqual(['V6']);
    expect(codesOf('needs', 'Theo Luật Khoa học và Công nghệ')).toEqual(['V6']);
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
});
