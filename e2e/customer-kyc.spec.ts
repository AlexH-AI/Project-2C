import { expect, pasteAsIs, test, type Locator, type Page } from './fixtures';
import { right, scrolls, sideways } from './support';

// playwright.config.ts pins "today" of the simulated data (VITE_DEMO_ANCHOR) to 15/09/2026.
const NAME = 'Bình Kiểm KYC';

// A link the way a customer sends it: no space, nowhere to break (DR6-82, DR6-117).
const LINK =
  'https://www.facebook.com/profile.php?id=100089123456789&mibextid=ZbWKwL_nguyen_van_khach_hang_rat_dai_tp_hcm';

/**
 * How far the text holding `link` reaches past the right edge of `box`: one number per text it is
 * in, 0 or less when that text ends inside.
 */
const past = (box: Locator, link: string) =>
  box.evaluate((node, link) => {
    const edge = node.getBoundingClientRect().right;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const reach: number[] = [];
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      if (!text.textContent?.includes(link)) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      reach.push(Math.max(...[...range.getClientRects()].map((rect) => rect.right - edge)));
    }
    return reach;
  }, link);

/** `box` holds `link` in `texts` texts, each ending inside it. */
async function expectInside(box: Locator, link: string, texts: number, what: string) {
  await expect.poll(() => past(box, link), { message: what }).toHaveLength(texts);
  expect(Math.max(...(await past(box, link))), what).toBeLessThanOrEqual(0);
}

const card = (page: Page, name: string) => page.getByRole('region', { name, exact: true });

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

/**
 * A meeting today, met, whose note and next step are `text` (6a, 6c), recorded where the meetings
 * are; then back on the profile of the customer.
 */
async function meetWith(page: Page, text: string) {
  await page.getByRole('button', { name: '+ Lịch hẹn' }).click();
  const booking = page.getByRole('dialog');
  await booking.getByRole('textbox', { name: /^Ngày/ }).fill('15/9');
  await booking.getByRole('combobox', { name: /^Trigger/ }).selectOption({ label: 'Khác' });
  await booking.getByRole('button', { name: 'Tạo lịch hẹn' }).click();
  await expect(booking).toHaveCount(0);

  await page.goto('/#/appointments');
  // Today alone: the month has more rows than the list shows at first (T-150).
  await page
    .getByRole('radiogroup', { name: 'Loại kỳ' })
    .getByRole('radio', { name: 'Ngày' })
    .click();
  await page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .getByRole('button', { name: NAME })
    .click();
  const detail = page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
  await detail.getByRole('button', { name: 'Ghi kết quả' }).click();
  const outcome = page.getByRole('dialog', { name: 'Kết quả cuộc gặp' });
  await outcome
    .getByRole('radiogroup', { name: 'Nhóm sau cuộc gặp' })
    .getByRole('radio', { name: 'N4 giữ nguyên' })
    .check();
  await outcome.getByRole('textbox', { name: /^Việc tiếp theo/ }).fill(text);
  await outcome.getByRole('textbox', { name: 'Ghi chú cuộc gặp' }).fill(text);
  await outcome.getByRole('button', { name: 'Lưu kết quả' }).click();
  await expect(outcome).toHaveCount(0);
  await detail.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await expect(page.getByRole('heading', { level: 2, name: NAME, exact: true })).toBeVisible();
}

// DR6-82: a link pasted into a KYC note, or a long value of a fact, breaks inside its column; the
// column does not grow over the next one. DR6-117, DR6-127: also the note and the next step of a
// meeting, in the timeline and in the appointments card.
test('a link of 108 characters in a KYC note, a fact or a meeting stays in its column at 1 440 and 1 100', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await createCustomer(page);
  expect(LINK).toHaveLength(108);
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill(`Khách gửi link ${LINK} để xem thêm`);
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Nơi sinh sống' });
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill(LINK);
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();
  await meetWith(page, LINK);

  for (const width of [1440, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    // The timeline has it twice: the KYC note, and the meeting's line (its note, its next step).
    await expectInside(card(page, 'Dòng thời gian'), LINK, 2, `timeline at ${width}`);
    await expectInside(card(page, 'Dữ kiện KYC'), LINK, 1, `KYC at ${width}`);
    await expectInside(card(page, 'Lịch hẹn'), LINK, 1, `appointments at ${width}`);
    expect(await sideways(page), `page at ${width}`).toBe(false);
  }
});

// DR6-117: the same link as the value of a fact stays inside the box where the fact is drafted
// (7a), shown as held (7c) and picked (7d), its badge and Bỏ with it.
test('a link of 108 characters as a fact stays inside the dialogs 7a, 7c and 7d', async ({
  page,
}) => {
  await createCustomer(page);
  const other = LINK.replace('100089123456789', '100089987654321');
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  let dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  const inside = async (what: string, link: string, texts: number) => {
    await expectInside(dialog, link, texts, what);
    expect(await scrolls(dialog), `${what} scrolls sideways`).toBe(false);
  };
  const drafted = (field: string) =>
    dialog.getByRole('list', { name: 'Dữ kiện từ ghi chú này' }).getByRole('listitem').filter({
      hasText: field,
    });

  // 7a: the fact drafted, with its badge and Bỏ.
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Khách gửi link');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Nơi sinh sống' });
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill(LINK);
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await inside('7a', LINK, 1);
  const row = drafted('Nơi sinh sống');
  for (const part of [row.getByText('mới'), row.getByRole('button', { name: /^Bỏ dữ kiện/ })]) {
    expect(await right(part), '7a badge and Bỏ').toBeLessThanOrEqual(await right(dialog));
  }
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();

  // 7c: the value the trường holds, then a different one flagged as a conflict.
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Khách gửi link khác');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Nơi sinh sống' });
  await inside('7c', LINK, 1);
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill(other);
  await dialog.getByRole('radio', { name: /Đánh dấu mâu thuẫn/ }).check();
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await inside('7a conflict', other, 1);
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();

  // 7d: both values to choose from.
  await card(page, 'Dữ kiện KYC')
    .getByRole('button', { name: 'Giải quyết · Nơi sinh sống' })
    .click();
  dialog = page.getByRole('dialog', { name: 'Giải quyết · Nơi sinh sống' });
  await inside('7d', 'https://www.facebook.com/', 2);
});

// DR6-117: a name with no space breaks inside the heading; the four buttons beside it stay in the
// window.
test('a customer name of 81 letters with no space leaves the buttons of the profile in the window', async ({
  page,
}) => {
  await createCustomer(page);
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  const dialog = page.getByRole('dialog', { name: `Sửa hồ sơ · ${NAME}` });
  const name = `D${'x'.repeat(80)}`;
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(name);
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();

  for (const width of [1100, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const label of ['Sửa hồ sơ', 'Chuyển nhóm', '+ Lịch hẹn', '+ Ghi chú KYC']) {
      const button = page.getByRole('button', { name: label, exact: true });
      expect(await right(button), `${label} at ${width}`).toBeLessThanOrEqual(width);
    }
    expect(await sideways(page), `page at ${width}`).toBe(false);
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
  // A lone surrogate half.
  const pasteBroken = () => pasteAsIs(note, 'Gặp KH \uD83D');
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

// DR6-109: the dialog sends the note as typed. The command checks it can be stored before dropping
// U+200B, so the halves of an emoji around it are refused, never joined into the emoji and saved.
test('refuses a note broken in a paste as the command does (7a, DR6-109)', async ({ page }) => {
  await createCustomer(page);
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  const dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await pasteAsIs(dialog.getByRole('textbox', { name: 'Ghi chú' }), '\uD83D\u{200B}\uDE00 Lan');
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();

  await expect(
    dialog.getByRole('alert').filter({ hasText: 'Chữ có ký tự không lưu được' }),
  ).toBeVisible();
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
