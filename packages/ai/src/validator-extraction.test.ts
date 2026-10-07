/** V7 (spec §6.4, §8): wrong extraction facts are dropped one by one. */
import { describe, expect, it } from 'vitest';
import { extractionOutputSchema } from './schema';
import { EXTRACTION_FIELDS, filterExtraction, validateOutput } from './validator';

const note =
  'Chị nói hai vợ chồng có 2 bé,\n  bé lớn năm sau vào cấp 3. Chị sinh năm 1984. ' +
  'Nhà chị đang có hợp đồng Prudential PRU-Hành Trang.';

const input = { note, fields: EXTRACTION_FIELDS };

const fact = (field: string, value: string | number | boolean, quote: string) => ({
  field,
  value,
  quote,
});

const filter = (...facts: ReturnType<typeof fact>[]) =>
  filterExtraction(extractionOutputSchema.parse({ facts }), input);

describe('EXTRACTION_FIELDS', () => {
  it('lists every trường of the catalog but those taken from the hồ sơ KH', () => {
    expect(EXTRACTION_FIELDS).toHaveLength(19);
    expect(EXTRACTION_FIELDS).not.toContain('birthYear');
    expect(EXTRACTION_FIELDS).not.toContain('gender');
    expect(EXTRACTION_FIELDS.slice(0, 2)).toEqual(['residence', 'maritalStatus']);
  });
});

describe('filterExtraction — V7', () => {
  it('keeps valid facts, with the value taken to the type of its trường', () => {
    expect(
      filter(
        fact('childrenCount', '2', 'hai vợ chồng có 2 bé'),
        fact('maritalStatus', 'Đã kết hôn', 'hai vợ chồng'),
      ),
    ).toEqual({
      kept: [
        fact('childrenCount', 2, 'hai vợ chồng có 2 bé'),
        fact('maritalStatus', 'Đã kết hôn', 'hai vợ chồng'),
      ],
      dropped: [],
    });
  });

  it('drops birthYear and gender, and a trường that is not allowed', () => {
    const result = filter(
      fact('birthYear', '1984', 'Chị sinh năm 1984'),
      fact('gender', 'Nữ', 'Chị'),
      fact('hobby', 'Golf', 'Chị'),
      fact('childrenCount', '2', 'có 2 bé'),
    );
    expect(result.kept).toEqual([fact('childrenCount', 2, 'có 2 bé')]);
    expect(result.dropped).toEqual([
      { code: 'V7', path: 'facts[0].field', detail: 'trường "birthYear" không được phép' },
      { code: 'V7', path: 'facts[1].field', detail: 'trường "gender" không được phép' },
      { code: 'V7', path: 'facts[2].field', detail: 'trường "hobby" không được phép' },
    ]);
  });

  it('never keeps birthYear or gender, even when the input lists them', () => {
    const output = extractionOutputSchema.parse({
      facts: [fact('birthYear', '1984', 'Chị sinh năm 1984'), fact('gender', 'Nữ', 'Chị')],
    });
    const result = filterExtraction(output, { note, fields: ['birthYear', 'gender'] });
    expect(result.kept).toEqual([]);
    expect(result.dropped.map((issue) => issue.path)).toEqual(['facts[0].field', 'facts[1].field']);
  });

  it('keeps at most 40 characters of an unknown trường in the detail', () => {
    const field = 'x'.repeat(100);
    expect(filter(fact(field, 'Golf', 'Chị')).dropped).toEqual([
      { code: 'V7', path: 'facts[0].field', detail: `trường "${'x'.repeat(39)}…" không được phép` },
    ]);
  });

  it('drops a value its trường cannot hold', () => {
    const result = filter(
      fact('childrenCount', 'hai', 'có 2 bé'),
      fact('hasProtection', 'có', 'đang có hợp đồng'),
      fact('hasProtection', true, 'đang có hợp đồng'),
    );
    expect(result.kept).toEqual([fact('hasProtection', true, 'đang có hợp đồng')]);
    expect(result.dropped).toEqual([
      {
        code: 'V7',
        path: 'facts[0].value',
        detail: 'giá trị không hợp với trường "childrenCount"',
      },
      {
        code: 'V7',
        path: 'facts[1].value',
        detail: 'giá trị không hợp với trường "hasProtection"',
      },
    ]);
  });

  it('drops a quote that is not in the note, comparing with white space collapsed', () => {
    const result = filter(
      fact('childrenCount', '2', 'có 2 bé, bé lớn năm sau'),
      fact('childrenCount', '3', 'có 3 bé'),
      fact('maritalStatus', 'Đã kết hôn', 'Hai vợ chồng'),
    );
    expect(result.kept).toEqual([fact('childrenCount', 2, 'có 2 bé, bé lớn năm sau')]);
    expect(result.dropped).toEqual([
      { code: 'V7', path: 'facts[1].quote', detail: 'trích dẫn không có trong ghi chú' },
      { code: 'V7', path: 'facts[2].quote', detail: 'trích dẫn không có trong ghi chú' },
    ]);
  });

  it('runs no V3–V6: the name of a contract the KH holds is a fact', () => {
    const output = {
      facts: [
        fact(
          'protectionDetails',
          'Hợp đồng Prudential PRU-Hành Trang',
          'hợp đồng Prudential PRU-Hành Trang',
        ),
      ],
    };
    expect(validateOutput('extraction', output)).toEqual([]);
    expect(filterExtraction(extractionOutputSchema.parse(output), input)).toEqual({
      kept: output.facts,
      dropped: [],
    });
  });
});
