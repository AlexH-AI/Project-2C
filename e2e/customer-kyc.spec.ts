import { expect, test, type Page } from '@playwright/test';

// playwright.config.ts pins "today" of the simulated data (VITE_DEMO_ANCHOR) to 15/09/2026.
const NAME = 'Bình Kiểm KYC';

async function createCustomer(page: Page) {
  await page.goto('/#/customers');
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(NAME);
  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ index: 1 });
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole('link', { name: new RegExp(NAME) }).click();
}

// DR6-30: three columns from the default window, as the mockup; narrower, the AI panel goes below.
test('the profile has three columns at 1 440 × 900, two at 1 100', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await createCustomer(page);
  const box = async (name: string) => {
    const found = await page.getByRole('region', { name, exact: true }).boundingBox();
    if (!found) throw new Error(`No region ${name}`);
    return { x: Math.round(found.x), y: Math.round(found.y) };
  };

  const kyc = await box('Dữ kiện KYC');
  const timeline = await box('Dòng thời gian');
  const ai = await box('KYC Intelligence');
  expect(kyc.x).toBeLessThan(timeline.x);
  expect(timeline.x).toBeLessThan(ai.x);
  expect([timeline.y, ai.y]).toEqual([kyc.y, kyc.y]);

  await page.setViewportSize({ width: 1100, height: 900 });
  await expect
    .poll(async () => (await box('KYC Intelligence')).x)
    .toBe((await box('Dữ kiện KYC')).x);
  expect((await box('Dòng thời gian')).x).toBeGreaterThan((await box('Dữ kiện KYC')).x);
  expect((await box('KYC Intelligence')).y).toBeGreaterThan((await box('Dòng thời gian')).y);
});

// DR6-82: a link pasted into a KYC note, or a long value of a fact, breaks inside its column; the
// column does not grow over the next one.
test('a link of 108 characters in a KYC note or a fact stays in its column at 1 440 and 1 100', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await createCustomer(page);
  const link =
    'https://www.facebook.com/profile.php?id=100089123456789&mibextid=ZbWKwL_nguyen_van_khach_hang_rat_dai_tp_hcm';
  expect(link).toHaveLength(108);
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill(`Khách gửi link ${link} để xem thêm`);
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Nơi sinh sống' });
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill(link);
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();

  /** How far the text holding the link reaches past the right edge of its column's card. */
  const past = (region: string) =>
    page.getByRole('region', { name: region, exact: true }).evaluate((card, link) => {
      const right = card.getBoundingClientRect().right;
      const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
      const reach: number[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent?.includes(link)) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        reach.push(Math.max(...[...range.getClientRects()].map((rect) => rect.right - right)));
      }
      return reach;
    }, link);
  const sideways = () =>
    page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  for (const width of [1440, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    // Found once in each card, inside it.
    await expect.poll(() => past('Dòng thời gian')).toEqual([expect.any(Number)]);
    expect((await past('Dòng thời gian'))[0], `timeline at ${width}`).toBeLessThanOrEqual(0);
    expect(await past('Dữ kiện KYC')).toHaveLength(1);
    expect((await past('Dữ kiện KYC'))[0], `KYC at ${width}`).toBeLessThanOrEqual(0);
    expect(await sideways(), `page at ${width}`).toBe(false);
  }
});

test('a new customer: birth year and gender from the profile, gate KYC_INSUFFICIENT, timeline', async ({
  page,
}) => {
  await createCustomer(page);
  const kyc = page.getByRole('region', { name: 'Dữ kiện KYC' });
  const timeline = page.getByRole('region', { name: 'Dòng thời gian' }).getByRole('listitem');

  // D2: shown read-only, edited in the customer profile.
  await expect(kyc).toContainText('1/8 hạng mục · v1');
  await expect(kyc).toContainText('Năm sinh: 1984 · sửa ở hồ sơ KH');
  await expect(kyc).toContainText('Giới tính: Nữ · sửa ở hồ sơ KH');
  await expect(kyc.getByRole('button')).toHaveCount(0);
  await expect(kyc.getByRole('textbox')).toHaveCount(0);

  // ADR-0008: the exact message, and the questions of the missing hạng mục.
  await expect(kyc).toContainText('Cổng KYC KYC_INSUFFICIENT');
  await expect(kyc.getByText('Cần chăm sóc, KYC thêm thông tin khách hàng')).toBeVisible();
  await expect(kyc.getByText('Câu hỏi gợi ý')).toBeVisible();
  await expect(
    kyc.getByText(
      'Anh/chị có thể chia sẻ đôi nét về gia đình mình — hiện anh/chị đã lập gia đình chưa ạ?',
    ),
  ).toBeVisible();

  await expect(timeline).toHaveText([
    // The first version is always material (ADR-0008 7), labelled so (NT-HS-11).
    '15/09/2026Cập nhật KYC 15/09/2026thay đổi quan trọngkyc v1',
    '15/09/2026Ghi chú hệ thốngHồ sơ KH: năm sinh 1984; giới tính Nữ',
    '15/09/2026N4tạo KH',
  ]);

  // Gender is not a cốt lõi trường: the new version is not material. The database's clock keeps
  // the pinned day, so it is dated that day: versions come before notes, the later first.
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  const dialog = page.getByRole('dialog', { name: `Sửa hồ sơ · ${NAME}` });
  await dialog.getByRole('radio', { name: 'Nam' }).check();
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(dialog).toBeHidden();

  await expect(kyc).toContainText('Giới tính: Nam');
  await expect(timeline).toHaveText([
    '15/09/2026Cập nhật KYC 15/09/2026kyc v2',
    '15/09/2026Cập nhật KYC 15/09/2026thay đổi quan trọngkyc v1',
    '15/09/2026Ghi chú hệ thốngHồ sơ KH: giới tính Nam',
    '15/09/2026Ghi chú hệ thốngHồ sơ KH: năm sinh 1984; giới tính Nữ',
    '15/09/2026N4tạo KH',
  ]);
});

test('the day of a KYC note is checked on Lưu, not while it is typed (7a, DR6-33)', async ({
  page,
}) => {
  await createCustomer(page);
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Gặp KH');
  const day = dialog.getByRole('textbox', { name: 'Ngày ghi nhận' });

  // Half typed: nothing red yet, as in the customer dialogs (5b).
  await day.fill('3');
  await expect(day).not.toHaveAttribute('aria-invalid', 'true');
  await day.fill('');
  await expect(day).not.toHaveAttribute('aria-invalid', 'true');

  await day.fill('3');
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(day).toHaveAttribute('aria-invalid', 'true');
  await expect(day).toHaveAccessibleDescription('Gõ dd/mm hoặc dd/mm/yyyy.');

  // Typing again clears it until the next Lưu.
  await day.fill('14/9');
  await expect(day).not.toHaveAttribute('aria-invalid', 'true');
  await expect(day).toHaveAccessibleDescription('Thứ Hai 14/09/2026');
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();
});

test("a fact's error leaves those of the note and its day shown (7a, review #636)", async ({
  page,
}) => {
  await createCustomer(page);
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  const note = dialog.getByRole('textbox', { name: 'Ghi chú' });
  const day = dialog.getByRole('textbox', { name: 'Ngày ghi nhận' });
  const value = dialog.getByRole('textbox', { name: 'Giá trị' });
  await day.fill('3');
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(note).toHaveAttribute('aria-invalid', 'true');
  await expect(day).toHaveAttribute('aria-invalid', 'true');

  // "Thêm dữ kiện" with no trường, then with no value: the fact's errors only.
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await expect(dialog.getByRole('alert')).toHaveText('Chọn trường.');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Nơi sinh sống' });
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await expect(dialog.getByRole('alert')).toHaveText('Nhập giá trị.');
  await expect(note).toHaveAttribute('aria-invalid', 'true');
  await expect(day).toHaveAttribute('aria-invalid', 'true');
  await expect(day).toHaveAccessibleDescription('Gõ dd/mm hoặc dd/mm/yyyy.');

  await value.fill('Thủ Đức');
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await expect(dialog.getByRole('alert')).toHaveCount(0);
  await expect(note).toHaveAttribute('aria-invalid', 'true');
  await expect(day).toHaveAttribute('aria-invalid', 'true');
});

// DR6-83: "Bỏ" takes its row with it, the last one the whole list; the focus moves on to Trường, not
// to the page, and the dialog stays with nothing saved.
test('by the keyboard, Bỏ a fact being drafted leaves the focus on Trường (7a, DR6-83)', async ({
  page,
}) => {
  await createCustomer(page);
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  const field = dialog.getByRole('combobox', { name: 'Trường' });
  const facts = dialog.getByRole('list', { name: 'Dữ kiện từ ghi chú này' });
  for (const [label, value] of [
    ['Nơi sinh sống', 'Huế'],
    ['Nghề nghiệp', 'Kỹ sư'],
  ] as const) {
    await field.selectOption({ label });
    await dialog.getByRole('textbox', { name: 'Giá trị' }).fill(value);
    await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  }
  await expect(facts.getByRole('listitem')).toHaveCount(2);

  await dialog.getByRole('button', { name: 'Bỏ dữ kiện Nơi sinh sống' }).press('Enter');
  await expect(facts.getByRole('listitem')).toHaveText([/^Nghề nghiệp/]);
  await expect(field).toBeFocused();
  await dialog.getByRole('button', { name: 'Bỏ dữ kiện Nghề nghiệp' }).press('Enter');
  await expect(facts).toHaveCount(0);
  await expect(field).toBeFocused();
  await expect(dialog).toBeVisible();
});

// DR6-33: the refusal of Lưu, a frame over the fields, goes once the RE types again. A character
// broken in a paste passes the dialog's empty check and is refused by the command (INVALID_TEXT).
test('the frame of a refused save goes as soon as the note or its day is typed again (7a, DR6-33)', async ({
  page,
}) => {
  await createCustomer(page);
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  const note = dialog.getByRole('textbox', { name: 'Ghi chú' });
  const day = dialog.getByRole('textbox', { name: 'Ngày ghi nhận' });
  const pasteBroken = () =>
    note.evaluate((field: HTMLTextAreaElement) => {
      // A lone surrogate half, set as a paste would, past the keyboard.
      const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!;
      set.call(field, 'Gặp KH \uD83D');
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
  const refusal = dialog.getByRole('alert').filter({ hasText: 'Chữ có ký tự không lưu được' });

  await pasteBroken();
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(refusal).toBeVisible();
  await note.press('End');
  await note.press('Backspace');
  await expect(refusal).toHaveCount(0);

  await pasteBroken();
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(refusal).toBeVisible();
  await day.fill('14/9');
  await expect(refusal).toHaveCount(0);
  await expect(dialog).toBeVisible();
});

// DR6-49: a note or a value of invisible characters only is empty, said at its field as the
// command reads it; the note keeps its line breaks (Owner 16/10/2026).
test('a KYC note or value of invisible characters only is empty (7a)', async ({ page }) => {
  await createCustomer(page);
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  const note = dialog.getByRole('textbox', { name: 'Ghi chú' });

  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Nơi sinh sống' });
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill('​⁠');
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await expect(dialog.getByRole('alert')).toHaveText('Nhập giá trị.');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Chọn trường' });

  await note.fill('​\n ');
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(note).toHaveAccessibleDescription(
    'Mỗi dữ kiện phải gắn với một ghi chú có nội dung: nhập ghi chú.',
  );

  await note.fill('Đã kết hôn,  2 con\nChủ DN');
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();
  const saved = page
    .getByRole('region', { name: 'Dòng thời gian' })
    .getByRole('listitem')
    .filter({ hasText: /Ghi chú KYC/ });
  expect(await saved.innerText()).toContain('Đã kết hôn, 2 con\nChủ DN');
});

test('a KYC note confirms facts; a cốt lõi conflict blocks the gate until it is resolved', async ({
  page,
}) => {
  await createCustomer(page);
  const kyc = page.getByRole('region', { name: 'Dữ kiện KYC' });
  const timeline = page.getByRole('region', { name: 'Dòng thời gian' }).getByRole('listitem');

  // Mockup 7a: one note, several facts, one version.
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  let dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Đã kết hôn, 2 con; chủ DN.');
  await expect(dialog.getByText('Chỉ thêm ghi chú, không tạo phiên bản KYC.')).toBeVisible();
  // NT-HS-05 (mockup 7b): an amount typed for a money trường reads back; words that are no amount
  // read nothing and are kept as typed.
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Thu nhập năm' });
  const income = dialog.getByRole('textbox', { name: 'Giá trị' });
  await income.fill('6 tỷ');
  await expect(income).toHaveAccessibleDescription('6.000.000.000 ₫ (6 tỷ)');
  await income.fill('Khoảng 12 tỷ');
  await expect(income).toHaveAccessibleDescription('');
  await expect(dialog).not.toContainText('₫');
  // DR-21: a value typed for one trường is not carried over to the next one picked.
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Nơi sinh sống' });
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill('Huế');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Mục tiêu chính' });
  await expect(dialog.getByRole('textbox', { name: 'Giá trị' })).toHaveValue('');
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await expect(dialog.getByRole('alert')).toHaveText('Nhập giá trị.');
  for (const [field, value] of [
    ['Tình trạng hôn nhân', 'Đã kết hôn'],
    ['Số con', '2'],
    ['Nghề nghiệp', 'Chủ DN phân phối thiết bị y tế'],
  ]) {
    await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: field! });
    await dialog.getByRole('textbox', { name: 'Giá trị' }).fill(value!);
    await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  }
  await expect(dialog.getByRole('list', { name: 'Dữ kiện từ ghi chú này' })).toContainText(
    'Số con2mới',
  );
  await expect(dialog.getByText('Sau khi lưu: KYC v2 · thay đổi quan trọng')).toBeVisible();
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();

  await expect(kyc).toContainText('3/8 hạng mục · v2');
  await expect(kyc).toContainText('Cổng KYC PROFILE_DISCOVERY');
  await expect(timeline.first()).toHaveText(
    '15/09/2026Cập nhật KYC 15/09/2026thay đổi quan trọngkyc v2',
  );
  await expect(timeline.filter({ hasText: /^15\/09\/2026Ghi chú KYC/ })).toHaveText(
    '15/09/2026Ghi chú KYCAI trích xuấtĐã kết hôn, 2 con; chủ DN.',
  );

  // Mockup 7c: a different value on a cốt lõi trường, flagged as a conflict.
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Vợ nói nhà có 3 con.');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Số con' });
  // Mockup 7c: the value in effect with its code (F1, F2 are the birth year and gender).
  await expect(dialog.getByText('Đang có: 2 · F4 (15/09/2026)')).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill('3');
  await dialog.getByRole('radio', { name: /Đánh dấu mâu thuẫn/ }).check();

  // A fact picked but not added blocks the save, from the button and from Enter alike.
  const pending = dialog.getByRole('alert').filter({ hasText: 'chưa được thêm' });
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(pending).toBeVisible();
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Chọn trường' });
  await expect(pending).toBeHidden();
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Số con' });
  // Picked again, the trường starts over: no value, an update.
  await expect(dialog.getByRole('textbox', { name: 'Giá trị' })).toHaveValue('');
  await expect(dialog.getByRole('radio', { name: 'Cập nhật', exact: true })).toBeChecked();
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill('3');
  await dialog.getByRole('radio', { name: /Đánh dấu mâu thuẫn/ }).check();
  await dialog.getByRole('textbox', { name: 'Giá trị' }).press('Enter');
  await expect(pending).toBeVisible();
  await expect(kyc).not.toContainText('Cổng KYC CONFLICT_RESOLUTION');

  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await expect(dialog.getByRole('list', { name: 'Dữ kiện từ ghi chú này' })).toContainText(
    'Số con3mâu thuẫn',
  );
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();

  await expect(kyc).toContainText('Cổng KYC CONFLICT_RESOLUTION');
  await expect(kyc).toContainText('Trường mâu thuẫn: Số con');

  // Mockup 7d: keep one value; the other becomes history. By the keyboard: the button goes with the
  // conflict, and the focus to the top of the card, not to the page (DR6-83).
  await kyc.getByRole('button', { name: 'Giải quyết · Số con' }).press('Enter');
  dialog = page.getByRole('dialog', { name: 'Giải quyết · Số con' });
  await dialog.getByRole('button', { name: 'Giải quyết', exact: true }).click();
  await expect(dialog.getByRole('alert')).toHaveText('Chọn giá trị đúng.');
  // NT-HS-08: each value with its code, its ghi chú and day.
  const values = dialog.getByRole('radiogroup', { name: 'Giá trị đúng' });
  await expect(values).toContainText('"2"F4 · ghi chú 15/09/2026');
  await expect(values).toContainText('"3"F6 · ghi chú 15/09/2026');
  await dialog.getByRole('radio', { name: /^"3"/ }).check();
  await expect(dialog.getByText('Sau khi lưu: KYC v4 · cổng KYC PROFILE_DISCOVERY')).toBeVisible();
  await dialog.getByRole('button', { name: 'Giải quyết', exact: true }).press('Enter');
  await expect(dialog).toBeHidden();
  await expect(kyc.getByRole('heading', { name: 'Dữ kiện KYC' })).toBeFocused();

  await expect(kyc).toContainText('Cổng KYC PROFILE_DISCOVERY');
  await expect(kyc).not.toContainText('Trường mâu thuẫn');
  await expect(kyc).toContainText('Số con: 3');
  await expect(kyc).not.toContainText('Số con: 2');
  await expect(kyc.getByRole('button')).toHaveCount(0);
  await expect(timeline.first()).toContainText('kyc v4');
});
