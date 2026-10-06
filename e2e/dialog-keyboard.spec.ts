import { expect, test, type Page } from '@playwright/test';

// Keyboard paths of the shared dialog and segmented control (DR-58, 59, 02, 76). The e2e build pins
// today to the demo anchor, Tuesday 15/09/2026 (playwright.config.ts).

/** Opens the profile of the customer of a past met appointment. */
async function openProfile(page: Page) {
  await page.goto('/#/appointments');
  const met = page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .locator('tbody tr')
    .filter({ hasText: 'Đã gặp' })
    .first();
  await met.getByRole('button').click();
  await page.getByRole('link', { name: 'Hồ sơ KH →' }).click();
  await expect(page.locator('#customer-name')).toBeVisible();
}

test('Escape, Hủy and saving each close the dialog and give focus back to its button', async ({
  page,
}) => {
  await page.goto('/#/team');
  const open = page.getByRole('button', { name: '+ Team' });
  const dialog = page.getByRole('dialog', { name: 'Team mới' });
  const name = dialog.getByRole('textbox', { name: 'Tên team' });

  await open.focus();
  await page.keyboard.press('Enter');
  await expect(name).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();

  await page.keyboard.press('Enter');
  await dialog.getByRole('button', { name: 'Hủy' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();

  await page.keyboard.press('Enter');
  await name.fill('Bình Minh 2');
  await page.keyboard.press('Enter');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Team', exact: true })).toContainText(
    'Bình Minh 2',
  );
  await expect(open).toBeFocused();
});

test('dialogs open on the field they ask for first, not on the first one', async ({ page }) => {
  await openProfile(page);

  // Hẹn tiếp: the RE is known, so the day comes first.
  const next = page
    .getByRole('table', { name: 'Lịch hẹn' })
    .getByRole('button', { name: /^Hẹn tiếp sau lịch/ })
    .first();
  await next.click();
  let dialog = page.getByRole('dialog', { name: 'Lịch hẹn tiếp theo' });
  await expect(dialog.getByRole('textbox', { name: /^Ngày/ })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(next).toBeFocused();

  // Phát hành HĐ: the issue day, under the submitted policy's fields.
  const card = page.getByRole('region', { name: 'Hợp đồng', exact: true });
  await card.getByRole('button', { name: '+ Hợp đồng' }).first().click();
  dialog = page.getByRole('dialog', { name: 'Hợp đồng mới · đã nộp' });
  await dialog.getByRole('textbox', { name: /^Ngày nộp/ }).fill('10/9');
  await dialog.getByRole('textbox', { name: /^FYP nộp/ }).fill('500tr');
  await dialog.getByRole('button', { name: 'Lưu HĐ' }).click();
  await expect(dialog).toHaveCount(0);
  await card.getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026' }).click();
  dialog = page.getByRole('dialog', { name: 'Phát hành HĐ' });
  await expect(dialog.getByRole('textbox', { name: /^Ngày phát hành/ })).toBeFocused();
});

test('Dời lịch opens on the new day', async ({ page }) => {
  await page.goto('/#/appointments');
  const planned = page
    .getByRole('table', { name: 'Danh sách lịch hẹn' })
    .locator('tbody tr')
    .filter({ hasText: 'Dự kiến' })
    .first();
  await planned.getByRole('button').click();
  await page
    .getByRole('complementary', { name: 'Chi tiết lịch hẹn' })
    .getByRole('button', { name: 'Dời lịch' })
    .click();
  await expect(page.getByRole('dialog').getByRole('textbox', { name: /^Ngày mới/ })).toBeFocused();
});

test('arrow keys move the choice around a segmented control, wrapping at both ends', async ({
  page,
}) => {
  await page.goto('/#/appointments');
  const radios = page.getByRole('radiogroup', { name: 'Loại kỳ' }).getByRole('radio');
  const count = await radios.count();
  const checked = async () => {
    for (let i = 0; i < count; i++) {
      if ((await radios.nth(i).getAttribute('aria-checked')) === 'true') return i;
    }
    return -1;
  };

  const start = await checked();
  await radios.nth(start).focus();
  await page.keyboard.press('ArrowRight');
  const right = (start + 1) % count;
  await expect(radios.nth(right)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(right)).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  const left = (start - 1 + count) % count;
  await expect(radios.nth(left)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(left)).toBeFocused();

  // Around the start: from the first, left goes to the last.
  for (let i = left; i > 0; i--) await page.keyboard.press('ArrowLeft');
  await expect(radios.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(radios.nth(count - 1)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(count - 1)).toBeFocused();
});

/**
 * Runs the web build as the exe: a stand-in for Tauri's IPC (`isTauri()`, `invoke`, events) whose
 * file commands the test steers through `window.exe`. A new database seeds as on a first start.
 */
async function asExe(page: Page) {
  await page.addInitScript(() => {
    const callbacks = new Map<number, (event: unknown) => unknown>();
    let nextId = 1;
    let closeHandler: number | undefined;
    let backupGate: Promise<void> | undefined;
    let releaseBackup = () => {};
    const exe = {
      failSaves: false,
      destroyed: false,
      holdBackup() {
        backupGate = new Promise((resolve) => (releaseBackup = resolve));
      },
      releaseBackup: () => releaseBackup(),
      requestClose() {
        if (closeHandler === undefined) throw new Error('no close listener');
        void callbacks.get(closeHandler)?.({ event: 'tauri://close-requested', id: 1 });
      },
    };
    const commands: Record<string, (args: Record<string, unknown>) => unknown> = {
      db_open: () => new ArrayBuffer(0),
      db_save: () => {
        if (exe.failSaves) throw new Error('file locked');
        return null;
      },
      db_backup: async () => {
        await backupGate;
        return 'project2c-20260915-0930.db';
      },
      db_latest_backup: () => null,
      'plugin:event|listen': (args) => {
        if (args.event === 'tauri://close-requested') closeHandler = args.handler as number;
        return nextId++;
      },
      'plugin:event|unlisten': () => null,
      'plugin:window|destroy': () => {
        exe.destroyed = true;
        return null;
      },
    };
    Object.assign(window, {
      exe,
      isTauri: true,
      __TAURI_EVENT_PLUGIN_INTERNALS__: { unregisterListener() {} },
      __TAURI_INTERNALS__: {
        metadata: { currentWindow: { label: 'main' }, currentWebview: { label: 'main' } },
        transformCallback(callback: (event: unknown) => unknown) {
          const id = nextId++;
          callbacks.set(id, callback);
          return id;
        },
        async invoke(command: string, args: Record<string, unknown>) {
          const run = commands[command];
          if (!run) throw new Error(`unexpected command ${command}`);
          return run(args);
        },
      },
    });
  });
}

interface Exe {
  failSaves: boolean;
  destroyed: boolean;
  holdBackup(): void;
  releaseBackup(): void;
  requestClose(): void;
}
declare global {
  interface Window {
    exe: Exe;
  }
}

test('a second Escape does not close the dialog of a running reload', async ({ page }) => {
  await asExe(page);
  await page.goto('/#/settings');
  await page.evaluate(() => window.exe.holdBackup());

  await page.getByRole('button', { name: 'Nạp lại…' }).click();
  const dialog = page.getByRole('dialog', { name: 'Nạp lại dữ liệu giả lập?' });
  await dialog.getByRole('textbox', { name: /^Gõ NẠP LẠI/ }).fill('NẠP LẠI');
  await page.keyboard.press('Enter');
  await expect(dialog.getByRole('button', { name: 'Đang nạp lại…' })).toBeVisible();

  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  // Still modal: the page behind cannot be used while the reload runs.
  expect(await dialog.evaluate((node) => node.matches(':modal'))).toBe(true);

  await page.evaluate(() => window.exe.releaseBackup());
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('Đã nạp lại dữ liệu giả lập');
});

test('closing the exe over a failed save: Escape leaves the window open, and closing still works', async ({
  page,
}) => {
  await asExe(page);
  await page.goto('/#/team');
  await page.evaluate(() => (window.exe.failSaves = true));
  await page.getByRole('button', { name: '+ Team' }).click();
  const create = page.getByRole('dialog', { name: 'Team mới' });
  await create.getByRole('textbox', { name: 'Tên team' }).fill('Bình Minh 2');
  await create.getByRole('button', { name: 'Tạo team' }).click();
  await expect(page.getByRole('alert')).toContainText('Chưa lưu được');

  const ask = page.getByRole('dialog', { name: 'Chưa lưu được thay đổi' });
  const requestClose = () => page.evaluate(() => window.exe.requestClose());
  const destroyed = () => page.evaluate(() => window.exe.destroyed);

  await requestClose();
  // Enter right away must not drop the changes.
  await expect(ask.getByRole('button', { name: 'Thử lại' })).toBeFocused();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(ask).toHaveCount(0);
  expect(await destroyed()).toBe(false);

  // The next close asks again; once the file can be written, "Thử lại" saves and closes.
  await requestClose();
  await expect(ask).toBeVisible();
  await page.evaluate(() => (window.exe.failSaves = false));
  await page.keyboard.press('Enter');
  await expect.poll(destroyed).toBe(true);
});
