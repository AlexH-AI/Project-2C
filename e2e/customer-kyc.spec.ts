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
    '15/09/2026Cập nhật KYC 15/09/2026kyc v1',
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
    '15/09/2026Cập nhật KYC 15/09/2026kyc v1',
    '15/09/2026Ghi chú hệ thốngHồ sơ KH: giới tính Nam',
    '15/09/2026Ghi chú hệ thốngHồ sơ KH: năm sinh 1984; giới tính Nữ',
    '15/09/2026N4tạo KH',
  ]);
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
  await expect(dialog.getByText('Sau khi lưu: KYC v2 · material')).toBeVisible();
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(dialog).toBeHidden();

  await expect(kyc).toContainText('3/8 hạng mục · v2');
  await expect(kyc).toContainText('Cổng KYC PROFILE_DISCOVERY');
  await expect(timeline.first()).toHaveText('15/09/2026Cập nhật KYC 15/09/2026kyc v2');
  await expect(timeline.filter({ hasText: /^15\/09\/2026Ghi chú KYC/ })).toHaveText(
    '15/09/2026Ghi chú KYCĐã kết hôn, 2 con; chủ DN.',
  );

  // Mockup 7c: a different value on a cốt lõi trường, flagged as a conflict.
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Vợ nói nhà có 3 con.');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Số con' });
  await expect(dialog.getByText('Đang có: 2 (15/09/2026)')).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill('3');
  await dialog.getByRole('radio', { name: /Đánh dấu mâu thuẫn/ }).check();

  // A fact picked but not added blocks the save, from the button and from Enter alike.
  const pending = dialog.getByRole('alert').filter({ hasText: 'chưa được thêm' });
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await expect(pending).toBeVisible();
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Chọn trường' });
  await expect(pending).toBeHidden();
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Số con' });
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

  // Mockup 7d: keep one value; the other becomes history.
  await kyc.getByRole('button', { name: 'Giải quyết · Số con' }).click();
  dialog = page.getByRole('dialog', { name: 'Giải quyết · Số con' });
  await dialog.getByRole('button', { name: 'Giải quyết', exact: true }).click();
  await expect(dialog.getByRole('alert')).toHaveText('Chọn giá trị đúng.');
  await dialog.getByRole('radio', { name: /^"3"/ }).check();
  await expect(dialog.getByText('Sau khi lưu: KYC v4 · cổng KYC PROFILE_DISCOVERY')).toBeVisible();
  await dialog.getByRole('button', { name: 'Giải quyết', exact: true }).click();
  await expect(dialog).toBeHidden();

  await expect(kyc).toContainText('Cổng KYC PROFILE_DISCOVERY');
  await expect(kyc).not.toContainText('Trường mâu thuẫn');
  await expect(kyc).toContainText('Số con: 3');
  await expect(kyc).not.toContainText('Số con: 2');
  await expect(kyc.getByRole('button')).toHaveCount(0);
  await expect(timeline.first()).toContainText('kyc v4');
});
