/**
 * Every entry of the G5 §8 tables, read from the approved file (DR5-03): dropping an entry from
 * `blocklists.ts`, or changing its "Bỏ dấu" column, turns a case red; so does a word of an entry
 * that `text-match.ts` lists closed (§7 item 2, §12.4) and the file does not, or the other way.
 */
import { stripDiacritics } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import guide from '../../../docs/design/phase-5-prompts.md?raw';
import { BLOCKLISTS } from './blocklists';
import { ZWSP } from './test-support';
import { matchText } from './text-match';

type Code = 'V3' | 'V4' | 'V5' | 'V6';

const SECTIONS: readonly (readonly [Code, string])[] = [
  ['V3', '### 8.1'],
  ['V4', '### 8.2'],
  ['V5', '### 8.3'],
  ['V6', '### 8.4'],
];

/** The table rows of a section, cells split at `|` but not at the escaped `\|` of a regex. */
function rowsOf(heading: string): string[][] {
  const start = guide.indexOf(heading);
  const section = guide.slice(start, guide.indexOf('\n### ', start + heading.length));
  return section
    .split('\n')
    .filter((line) => line.startsWith('|') && !line.startsWith('|---') && !line.startsWith('| Mục'))
    .map((line) =>
      line
        .slice(1, -1)
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim()),
    );
}

/**
 * What each entry of `code` finds in `text`, as written there: entries one by one, so an entry
 * found where another is (the validator names that place once) still shows.
 */
const foundIn = (code: Code, text: string) => {
  const match = matchText(text);
  return BLOCKLISTS[code].flatMap((matcher) => {
    const found = matcher(match);
    return found === null ? [] : [match.written.slice(found.start, found.end)];
  });
};

const PHRASES = SECTIONS.flatMap(([code, heading]) =>
  rowsOf(heading)
    .filter((cells) => cells.length === 2 || cells[1] === 'cụm')
    .flatMap((cells) =>
      cells[0]!.split(' · ').map((entry) => ({ code, entry, folded: cells.at(-1) === 'có' })),
    ),
);

/**
 * The rows that are not phrases (a character, a regex, the "luật <Tên>" rule), by their "Mục" cell,
 * each with texts it must catch and what it finds there, as written. A new or changed row here
 * needs its samples reviewed against the table.
 */
const SAMPLES: Record<string, readonly (readonly [string, string])[]> = {
  '`%` · `‰` (ký tự, ở bất kỳ đâu; `％`, `﹪` thành `%` qua NFKC)': [
    ['KH 70%', '%'],
    ['KH 5‰', '‰'],
  ],
  '`\\bchốt được\\b(?! (lịch\\|ngày\\|giờ\\|buổi\\|thời gian\\|thời điểm\\|cuộc hẹn\\|hẹn\\|mốc\\|kế hoạch\\|mục tiêu\\|phương án)\\b)`':
    [['KH có thể chốt được', 'chốt được']],
  '`\\b(sẵn sàng\\|tiềm năng) mua\\b(?=\\s*($\\|[.,;:!?)]\\|(bảo hiểm\\|sản phẩm\\|giải pháp\\|gói\\|hợp đồng\\|hđ)\\b))` — chỉ khi theo sau là hết câu / dấu câu / từ chỉ sản phẩm':
    [
      ['KH sẵn sàng mua.', 'sẵn sàng mua'],
      ['KH tiềm năng mua gói', 'tiềm năng mua'],
    ],
  '`\\b[ie][ns][tf][jp]( [at])?\\b` trên bản có dấu (vd. "INTJ", "ENFP-A")': [
    ['KH intj', 'intj'],
    ['KH ENFP-A', 'ENFP-A'],
  ],
  '`\\b(nhóm\\|kiểu) [disc]\\b(?! (level\\|suite)\\b)` (vd. "nhóm D"; "nhóm C-level" không khớp)': [
    ['KH nhóm D', 'nhóm D'],
    ['KH kiểu s', 'kiểu s'],
  ],
  '`\\bnhóm máu (a\\|b\\|ab\\|o)\\b`': [['KH nhóm máu O', 'nhóm máu O']],
  '`\\b(Điều\\|ĐIỀU)\\s*\\p{Nd}+` trên **bản gốc, giữ hoa thường** (vd. "Điều 35", "Điều" + U+200B + "35"; "điều 2 vợ chồng" không khớp)':
    [
      ['Theo Điều 35', 'Điều 35'],
      ['Theo ĐIỀU 7', 'ĐIỀU 7'],
      [`Theo Điều${ZWSP}35`, 'Điều35'],
    ],
  '`\\bkhoản\\s*\\p{Nd}+[,]?\\s*điều\\s*\\p{Nd}+` (vd. "khoản 2 Điều 35"; "khoản 2 điều kiện" không khớp)':
    [
      ['Xem khoản 2, điều 35', 'khoản 2, điều 35'],
      [`Xem khoản${ZWSP}2${ZWSP}điều${ZWSP}35`, 'khoản2điều35'],
    ],
  '`\\bđiểm\\s*[a-zđ]\\s*khoản\\b`': [
    ['Xem điểm đ khoản', 'điểm đ khoản'],
    [`Xem điểm${ZWSP}a${ZWSP}khoản`, 'điểmakhoản'],
  ],
  '"luật" ở **mọi kiểu hoa / thường**, có ranh giới từ trước, không đứng sau từ "pháp", "kỷ", "kỉ", "quy", "qui", "giới", hay "định" mà trước nó không phải "quy" / "qui" (mọi kiểu chữ) + khoảng trắng; theo sau là khoảng trắng (có thể không có) + một từ mở đầu bằng chữ hoa (`\\p{Lu}`) mà **không** phải "KH", "RE" hay "sư" (mọi kiểu chữ). Chạy trên **bản gốc**. Vd. khớp "Luật Kinh doanh bảo hiểm", "Luật BHXH", "LuẬt Đất đai", "Luật" + U+200B + "BHXH", "quy định Luật Kinh doanh bảo hiểm"; không khớp "Luật sư", "LUẬT SƯ", "pháp luật Việt Nam", "pHáp luật Việt Nam", "kỷ luật KH", "quy luật Thị trường", "kỉ luật Thép", "qui luật Thị trường", "định luật Pareto", "giới luật Phật giáo"':
    [
      ['Theo luật Đất đai', 'luật Đ'],
      [`Theo Luật${ZWSP}BHXH`, 'LuậtB'],
      ['Theo quy định Luật Kinh doanh bảo hiểm', 'Luật K'],
    ],
  '`\\b(quyết định\\|công văn) số\\s*\\p{Nd}` (vd. "Quyết định số 123"; "quyết định số tiền" không khớp)':
    [
      ['Quyết định số 123', 'Quyết định số 1'],
      ['Công văn số 45', 'Công văn số 4'],
    ],
  '`\\b\\p{Nd}{1,4}/\\p{Nd}{4}/[a-zđ\\p{Nd}]+\\b` (số hiệu, vd. "46/2023/NĐ-CP", "08/2022/QH15")': [
    ['Số 46/2023/abc', '46/2023/abc'],
  ],
  '`\\b(nđ cp\\|tt btc\\|qh1\\p{Nd})\\b` (`-` đã thành dấu cách ở bước 0)': [
    ['Theo NĐ-CP', 'NĐ-CP'],
    ['Theo TT-BTC', 'TT-BTC'],
    ['Khóa QH15', 'QH15'],
  ],
};

/** The closed list of G5 §7 item 2 (§12.4): words that match bare in a phrase all bare only. */
const CLOSED = [
  ...(/\*\*Danh sách đóng\*\* \([^)]*\): ((?:"[^"]+"(?:, )?)+)\./.exec(guide)?.[1] ?? '').matchAll(
    /"([^"]+)"/g,
  ),
].map((match) => match[1]!);

/** G5 §8.2 b) is a regex in the prose, not a table row. */
const PRU_PREFIX = 'regex `\\bpru ?[a-zà-ỹđ]` trên bản có dấu và bản bỏ dấu';

const OTHER_ROWS = SECTIONS.flatMap(([code, heading]) =>
  rowsOf(heading)
    .filter((cells) => cells.length === 3 && cells[1] !== 'cụm')
    .map((cells) => ({ code, item: cells[0]!, kind: cells[1]! })),
);

describe('BLOCKLISTS — every phrase of G5 §8', () => {
  it('reads the tables of the file', () => {
    expect(PHRASES.length).toBeGreaterThan(150);
    expect(PHRASES).toContainEqual({ code: 'V4', entry: 'bvnt', folded: true });
  });

  it.each(PHRASES)('$code catches "$entry" (Bỏ dấu: $folded)', ({ code, entry, folded }) => {
    expect(foundIn(code, `Ghi chú ${entry} ở đây`)).toContain(entry);
    const without = stripDiacritics(entry.toLowerCase());
    if (without === entry.toLowerCase()) return;
    expect(foundIn(code, `Ghi chú ${without} ở đây`).includes(without)).toBe(folded);
  });

  it('reads the closed list of §7 item 2', () => {
    expect(CLOSED).toContain('ấm');
  });

  // §7 item 2 (DR6-23, DR6-124): one word bare, the others as they are, is caught unless the word
  // is in the closed list.
  it.each(PHRASES.filter(({ folded }) => folded))(
    '$code reads each word of "$entry" bare alone',
    ({ code, entry }) => {
      const words = entry.toLowerCase().split(' ');
      words.forEach((word, i) => {
        const bare = stripDiacritics(word);
        if (bare === word) return;
        const text = words.map((other, j) => (j === i ? bare : other)).join(' ');
        const caught = foundIn(code, `Ghi chú ${text} ở đây`).includes(text);
        expect(caught, text).toBe(!CLOSED.includes(word));
      });
    },
  );
});

describe('BLOCKLISTS — every other row of G5 §8', () => {
  it('has samples for exactly the rows of the file', () => {
    expect(OTHER_ROWS.map((row) => row.item).sort()).toEqual(Object.keys(SAMPLES).sort());
    expect(guide).toContain(PRU_PREFIX);
  });

  it.each(OTHER_ROWS)('$code catches $item', ({ code, item, kind }) => {
    for (const [text, match] of SAMPLES[item]!) {
      expect(foundIn(code, text)).toContain(match);
      // "cả bản bỏ dấu": the text without diacritics is caught too, by the folded pattern.
      const without = stripDiacritics(text.toLowerCase());
      if (without === text.toLowerCase()) continue;
      const caught = foundIn(code, without).includes(stripDiacritics(match.toLowerCase()));
      expect(caught).toBe(kind.includes('bỏ dấu'));
    }
  });

  it('V4 catches a product line glued to "pru" (§8.2 b)', () => {
    expect(foundIn('V4', 'Đề xuất PRULink')).toContain('PRUL');
  });
});
