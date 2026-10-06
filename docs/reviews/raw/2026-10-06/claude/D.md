# Deep review Phase 1–4 — gói D (`packages/ui`, `apps/desktop/src/{shell,data,i18n}`) — Claude

- **SHA:** `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (kiểm `git rev-parse HEAD` trong `C:\workspace\Project-2C-review` lúc bắt đầu; worktree sạch trước và sau phiên: `git status` không có file sửa / chưa track; `pnpm build:exe` chỉ tạo output đã nằm trong `.gitignore` — `dist/`, `src-tauri/target/release/`, `src-tauri/gen/`).
- **Ngày:** 05/10/2026, Home PC. Phiên Claude sạch, không subagent. Không sửa / commit gì trong repo; probe, test tạm, exe sao chép để ở `C:\workspace\deep-review-1-4\claude\D\`.
- **Nguồn ngoài repo đã đọc:** `common\README.md`, `baseline.md`, `known.md`, `common\load\load-backup.json` (dữ liệu tải), `claude\A.md`, `claude\B.md`, `claude\C.md` (chỉ để khỏi lặp; đọc danh sách phát hiện + ghi chú "cho gói D"). **Không mở / liệt kê / tìm trong `codex\`.**
- Prompt ghi "§4 dòng gói A" nhưng gói được giao là D; làm theo dòng gói D của §4.

## 1. Phạm vi đã đọc

| Vùng | File (dòng) | Cách đọc |
|---|---|---|
| `packages/ui` | `index.ts` 1–12; `components/DataTable.tsx` 1–163; `compare-cells.ts` 1–37; `Chart.tsx` 1–77; `chart-theme.ts` 1–57; `Dialog.tsx` 1–53; `PeriodPicker.tsx` 1–168; `PeriodPicker.label.ts` 1–21; `Segmented.tsx` 1–64; `SelectField.tsx` 1–83; `TextField.tsx` 1–75; `Choices.tsx` 1–70; `Button.tsx` 1–24; `StageBadge.tsx` 1–22; `PolicyBadge.tsx` 1–13; `NavIcon.tsx` 1–63; `token-guard.ts` 1–77; `scripts/check-tokens.ts` 1–37; `tokens.css` 1–69; `theme.css` 1–76; `package.json`; `CLAUDE.md` | đọc hết |
| `packages/ui` test | `token-guard.test.ts`, `chart-theme.test.ts`, `compare-cells.test.ts`, `PeriodPicker.label.test.ts` | qua mutation (tên test bắt / không bắt), đọc đoạn khi cần |
| `shell/` | `AppShell.tsx` 1–63; `close-guard.ts` 1–30; `CloseGuard.tsx` 1–80; `ErrorBoundary.tsx` 1–49; `RePicker.tsx` 1–88; `routes.ts` 1–64; `SaveWarning.tsx` 1–15; `scope.ts` 1–77; `ScopeContext.tsx` 1–24; `ScopePicker.tsx` 1–61; `screen-error.ts` 1–17; `Sidebar.tsx` 1–58; `startup-error.ts` 1–27; `StartupError.tsx` 1–18; `useRoute.ts` 1–45 | đọc hết; test qua mutation |
| `data/` | `app-data.ts` 1–329; `AppDataContext.tsx` 1–42; `persist-queue.ts` 1–79; `tauri-storage.ts` 1–44; `today.ts` 1–58; `today.test.ts` 1–80; `app-data.test.ts` 1–148, 440–469 + tên mọi test | đọc hết code; test đọc đoạn |
| `i18n/` | `index.ts` 1–113; `vi.ts` 1–813; `index.test.ts` 1–98 | đọc hết + probe key |
| Nơi gọi (chỉ để kiểm hợp đồng / đo) | `src/main.tsx` 1–33; `src/App.tsx` 1–18; `routes/Screen.tsx` 1–21; `routes/Settings.tsx` 1–127; `routes/SettingsBackup.tsx` 60–89, 116–117, 190, 218–271; `appointments/AppointmentsScreen.tsx` 60–240, 295–320; `appointments/AppointmentDialog.tsx` 133–305; `team/PersonDialogs.tsx` 30–70, 135–160; grep mọi `errorMessage(`, `<Dialog`, `autoFocus`, `DataTable`, `kind: 'number'|'date'`; `packages/db/src/database.ts` 1–189; `errors.ts`; `apps/desktop/src-tauri/tauri.conf.json`; `vitest.config.ts` | đọc đoạn |

Công cụ đã chạy: probe mutation 75 lượt trên 121 test của phạm vi D (`vitest.mut.config.mts`, phụ lục A); `--sequence.shuffle` (seed 7, 99) và `TZ` = `America/Los_Angeles`, `Pacific/Kiritimati`; `tsc --noUnusedLocals --noUnusedParameters --incremental false` cho `apps/desktop` và `packages/ui`; probe key i18n, export, tương phản; trình duyệt (Browser pane, Chrome 152) trên `pnpm dev:web`; **exe bản release build tại SHA này** (`pnpm build:exe`, chép sang `claude\D\exe\`, chạy với `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333`, WebView2 Edg/154, nhập `load-backup.json`), điều khiển bằng Playwright `connectOverCDP` từ thư mục probe. Số đo hiệu năng ghi rõ có / không có debugger gắn vào (gắn vào làm chậm phần IPC, xem §5 P).

## 2. Phát hiện

### CL-D1

```
ID: CL-D1
Mức: Medium
Trục: C
Vị trí: packages/ui/src/components/Dialog.tsx:6, 20-22, 29-33 · apps/desktop/src/shell/CloseGuard.tsx:21-41, 61-62 · apps/desktop/src/routes/Settings.tsx:97-98 · apps/desktop/src/routes/SettingsBackup.tsx:221-222 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** `Dialog` hứa "omitted (e.g. while working), the dialog closes only through its buttons" và chặn `cancel` bằng `preventDefault()`. Chromium (Chrome 152 trong Browser pane, WebView2 Edg/154 trong exe) chỉ cho chặn `cancel` khi còn user activation chưa dùng; phím Escape không tạo activation, nên lần Escape kế tiếp bắn `cancel` với `cancelable = false` và trình duyệt tự đóng `<dialog>` (`open = false`, ra khỏi top layer) trong khi React vẫn giữ component. `Dialog` không nghe sự kiện `close`, nên caller không biết hộp đã đóng.

**Tái hiện / bằng chứng.**
1. Browser pane, `<dialog>` probe mở bằng một click, `cancel` luôn `preventDefault()`: Escape 1 → `cancels=[true]`, `open=true`; Escape 2 → `cancels=[true,false]`, `open=false`.
2. App web thật: Cài đặt → "Nạp lại…" → gõ `NẠP LẠI` → Enter → Escape, Escape khi nút đang "Đang nạp lại…" (hộp cố ý không có `onClose`) → `dialog` còn trong DOM, `open=false`: trang hết modal và nhận thao tác trong lúc `replace` chạy. Nạp lại xong thì hộp được gỡ, kết quả báo đúng.
3. Exe (dữ liệu tải): giữ `project2c.db` mở bằng `FileShare.ReadWrite` không `Delete` (đúng cách DB Browser mở, CL-C5) → thêm team "Probe Close" → cảnh báo lưu lỗi hiện → `CloseMainWindow()` → hộp "Chưa lưu được thay đổi" mở → Escape: ba lần đầu bị chặn (lần thứ ba ghi nhận `cancelable=true`; hai lần trước chưa gắn bộ đếm), lần thứ tư `cancelable=false` → `open=false`, không hộp nào hiện. Số lần Escape cần tùy user activation còn lại; ở probe 1 là lần thứ hai. Sau đó `CloseMainWindow()` thêm ba lần, lần cuối **sau khi đã nhả khóa file** (mở độc quyền thành công): tiến trình vẫn sống, không hộp, cảnh báo lưu lỗi vẫn hiện. Lý do: `closing = true` đang chờ `ask()` (`CloseGuard.tsx:35`) mà promise đó không bao giờ resolve, mọi lần bấm X sau `return` ở dòng 31.

**Ảnh hưởng.** Người dùng exe gặp một lần lưu lỗi (file bị chương trình khác mở), bấm X, rồi Escape để "thoát hộp" (phản xạ thường gặp) → không đóng được app bằng X nữa; chỉ còn tải lại trang (mất thay đổi chưa lưu, CL-D4) hoặc diệt tiến trình. Hộp "đang chạy" của Nạp lại / Nhập backup mất tác dụng chặn, nên từ UI có thể sửa dữ liệu hoặc mở thêm một lần thay dữ liệu trong lúc `replace` đang chờ backup / seed — tức mở đường từ UI tới KNOWN S-2 (ghi muộn trong khoảng chờ backup #96, hai `replace` chồng nhau #192). Phần S-2 không tái hiện lại ở đây (seed và đọc backup chạy đồng bộ vài giây nên khó canh thời điểm); bằng chứng mới là đường đi qua hộp đã không còn bị chặn.

**Đề xuất.** `Dialog` nghe `close` (hoặc nhận ra `cancel` không cancelable): khi caller chưa cho đóng thì `showModal()` lại, còn không thì gọi `onClose`. `CloseGuard` coi hộp bị đóng là "chưa trả lời" và reset `closing`. Thêm e2e Playwright: Escape ×2 trên hộp đang chạy (CDP tái hiện được, như probe 1). Cỡ ≤ 40 dòng SP + 1 e2e.

### CL-D2

```
ID: CL-D2
Mức: Low
Trục: A
Vị trí: packages/ui/src/components/Dialog.tsx:20-22 · TextField.tsx:56 · apps/desktop/src/shell/CloseGuard.tsx:68-73 · routes/appointments/AppointmentDialog.tsx:181 · routes/customers/PolicyDialogs.tsx:228, 255 · routes/appointments/RescheduleFields.tsx:92 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** `autoFocus` của các hộp thoại không có tác dụng. React không render thuộc tính `autofocus`; nó gọi `.focus()` ở pha commit, trước `useEffect` gọi `showModal()`, lúc `<dialog>` còn đóng nên focus không ăn. `showModal()` rồi chạy "dialog focusing steps": không có phần tử `[autofocus]` nên focus phần tử focus được **đầu tiên** của hộp.

**Bằng chứng.**
- Exe, hộp đóng app (CL-D1 bước 3): `document.activeElement` = BUTTON "Đóng và bỏ thay đổi chưa lưu" (nút `danger`, đứng đầu `actions`), dù code đặt `autoFocus` ở "Thử lại".
- Web: Hồ sơ KH → "Hẹn tiếp" → `AppointmentDialog` có KH cố định (`autoFocus={fixed !== undefined}` ở ô Ngày) → `activeElement` = SELECT "RE"; `document.querySelector('dialog [autofocus]')` = `null`.
- Web: "+ Team" → focus vào ô Tên team: đúng, nhưng chỉ vì ô đó tình cờ đứng đầu.

**Ảnh hưởng.** Ở hộp đóng app, Enter / Space ngay khi hộp hiện là bỏ thay đổi chưa lưu và đóng app (ngược ý định "mặc định = Thử lại"). Cùng cơ chế áp dụng cho mọi hộp có `autoFocus` không nằm ở ô đầu (đã thử Hẹn tiếp; theo code còn Phát hành HĐ `PolicyDialogs.tsx:255`, Dời lịch `RescheduleFields.tsx:92`): người dùng bàn phím phải Tab tới ô cần nhập.

**Đề xuất.** Sau `showModal()` trong `Dialog`, focus phần tử đánh dấu (vd. `[data-autofocus]`, do `Button` / `TextField` gắn khi `autoFocus`), hoặc render thuộc tính `autofocus` thật để focusing steps chọn. Một test e2e kiểm `toBeFocused()` cho hộp Hẹn tiếp. Cỡ ≤ 20 dòng SP.

### CL-D3

```
ID: CL-D3
Mức: Low
Trục: A
Vị trí: packages/ui/src/components/Dialog.tsx:15-22 ("opens on mount; the caller unmounts it to close") (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Hộp được đóng bằng cách gỡ khỏi DOM, không qua `dialog.close()`; trình duyệt chỉ trả focus về phần tử trước đó trong thuật toán `close()`, nên sau mỗi hộp thoại focus rơi về `<body>`.

**Bằng chứng.** Web: Team → bấm "+ Team" → Escape → `document.activeElement` = BODY (không phải nút "+ Team"). Không có e2e nào kiểm focus (`rg "toBeFocused|activeElement" e2e` không có kết quả).

**Ảnh hưởng.** Người dùng bàn phím / trình đọc màn hình mất vị trí sau mỗi hộp (Tab bắt đầu lại từ đầu trang, qua sidebar). Mọi màn có hộp thoại đều gặp.

**Đề xuất.** `Dialog` nhớ `document.activeElement` lúc mở; cleanup effect gọi `close()` hoặc focus lại phần tử đó nếu còn trong DOM. Gộp được với CL-D2 (cùng file). Cỡ ≤ 15 dòng SP.

### CL-D4

```
ID: CL-D4
Mức: Low
Trục: D
Vị trí: apps/desktop/src/shell/CloseGuard.tsx:15-18, 27-42 (chỉ nghe onCloseRequested) · apps/desktop/src/data/persist-queue.ts:25-29 (ảnh chụp chờ / `lost` chỉ trong bộ nhớ) · apps/desktop/src/main.tsx:24-33; không có `beforeunload` / chặn phím tải lại trong repo (rg) (f0c53eb)
Tình trạng: CONFIRMED (hệ quả khi webview tải lại); phím F5 thật trong exe: PLAUSIBLE
```

**Mô tả.** CloseGuard chỉ bắt yêu cầu đóng cửa sổ. Webview tải lại (F5 / Ctrl+R: WebView2 bật phím trình duyệt mặc định, wry để `browser_accelerator_keys: true`, theo CL-C1) không qua nó: ảnh chụp đang chờ trong `persist-queue` hoặc ảnh chụp đã lưu lỗi (`lost`) bị bỏ mà không hỏi, trang mới đọc file cũ. Gói C (CL-C1) đã nói phần Rust (xóa `.tmp`); đây là phần JS.

**Bằng chứng (exe, dữ liệu tải).** Khóa file như CL-D1 → thêm team "Probe F5" → cảnh báo "Chưa lưu được dữ liệu vào file…" → `location.reload()` qua cổng debug (tương đương F5 với app: không có `beforeunload`) → không hộp hỏi; sau khi mở lại: không còn cảnh báo, team "Probe F5" mất (`teamShown: false`). Phím F5 / Ctrl+R gửi qua CDP không đi qua accelerator của trình duyệt (`f5.mjs`: `reloaded: false` cho cả hai), nên chưa tự bấm được F5 thật; phần "F5 tải lại trong exe" dựa vào đọc code ở CL-C1.

**Ảnh hưởng.** Người dùng thấy cảnh báo lưu lỗi rồi thử F5 "cho chạy lại" → mất mọi thay đổi từ lần lưu lỗi đầu tiên, trong khi bấm X thì app hỏi (`close.unsavedBody`). Ngay cả khi lưu bình thường, mỗi lần lưu mất ≈ 130–190 ms (đo ở §5 P), nên F5 ngay sau một thao tác cũng bỏ thao tác đó.

**Đề xuất.** Trong exe: chặn F5 / Ctrl+R / Ctrl+Shift+R (keydown `preventDefault`) và menu chuột phải mặc định, hoặc `beforeunload` khi `saves.unsaved()` (cần kiểm WebView2 có hiện hộp xác nhận). Tắt accelerator ở cấu hình Tauri / wry nếu có thì là đổi cấu hình build (nhãn `build-exe`). Cỡ ≤ 30 dòng SP + test thuần cho hàm quyết định "có chặn không".

### CL-D5

```
ID: CL-D5
Mức: Low
Trục: T
Vị trí: apps/desktop/src/data/persist-queue.ts:67-73 (flush) · test apps/desktop/src/data/persist-queue.test.ts:104-149 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Điều kiện `if (!running && lost) persist(lost)` là chỗ duy nhất giữ bất biến "ảnh chụp mới nhất được ghi sau cùng" khi `flush()` (đóng app) chạy lúc đang có một lần ghi mới hơn sau một lần ghi lỗi. Mutation Q4 bỏ vế `!running` (`if (lost) persist(lost)`) sống qua toàn bộ 121 test của phạm vi D.

**Tái hiện.** Probe `probe/persist-flush.test.ts` (phụ lục C): ghi 1 lỗi → `persist(2)` (ghi chậm) → `flush()` → ghi 2 xong. Bản gốc: xanh (file cuối = 2). Dưới mutation Q4: đỏ, `expected 1 to be 2` — ảnh chụp cũ đã lỗi được ghi đè lên ảnh chụp mới.

**Ảnh hưởng.** Không có lỗi ở code hiện tại. Một lần sửa `flush` làm mất vế này sẽ không bị test bắt, và khi đó đóng app sau một lần lưu lỗi làm file lùi về dữ liệu cũ.

**Đề xuất.** Đưa probe vào `persist-queue.test.ts` (≈ 25 dòng test, không sửa SP).

### CL-D6

```
ID: CL-D6
Mức: Low
Trục: T
Vị trí: apps/desktop/src/data/app-data.ts:195-221 (current / opening), 321-329 (countRecords) · packages/ui/src/token-guard.ts:48-77 (findHardcodedSeparators) · apps/desktop/src/data/today.test.ts:34-47 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Ngoài CL-D5, các mutation sau đổi hành vi thật mà cả 121 test vẫn xanh (phụ lục A):
- **D2** `mine === current || mine === opening` → `mine === current`: bản đã migrate khi mở một file schema cũ lúc khởi động không được lưu (chỉ lưu ở lần sửa kế tiếp). Doc comment dòng 195–198 nói rõ cửa sổ `opening` phải lưu migration, nhưng không có test mở file schema cũ trong `app-data.test.ts` (test dòng 119–133 mở file đã ở schema mới nhất).
- **D12** `appointments: listPolicies(db).length`: test đếm (dòng 447–468) chỉ có team, bốn trường còn lại đều 0, nên đếm nhầm trường không bị bắt; các số này hiện ở hộp xác nhận nhập backup (10b).
- **TG3** `inComment = end < 0` → `inComment = true`: sau block comment đầu tiên, `findHardcodedSeparators` coi phần còn lại của file là comment. Gần như mọi file bắt đầu bằng `/** … */`, nên mutation này tắt kiểm `·` / `→` cứng cho hầu hết file mà test vẫn xanh (thiếu ca "code sau `*/`").
- **C2** bỏ `numeric: true` của collator: không test nào sắp chuỗi có số ("Team 2" / "Team 10", mã KH) (Nit).
- Test phụ thuộc múi giờ máy: `TZ=America/Los_Angeles` làm đỏ `today.test.ts` "tells its listener at every midnight…" (`expected 2 times, got 1`): 01/11/2026 là ngày đổi giờ ở đó (25 giờ), test giả định một ngày = `24 * 60 * 60_000` ms. Code `untilMidnight` đúng (tính theo lịch địa phương). `TZ=Pacific/Kiritimati` và giờ máy (UTC+7) xanh; xáo thứ tự (seed 7, 99) xanh. Cùng loại với CL-B12 (Nit).

**Ảnh hưởng.** Hồi quy ở các chỗ trên không bị `pnpm verify` bắt; TG3 làm `pnpm lint:tokens` báo xanh giả.

**Đề xuất.** Thêm 4 ca test: mở file schema cũ thì file được lưu bản đã migrate; `counts` với đủ năm loại khác nhau; `findHardcodedSeparators` với `/* … */ '·'` trên cùng một dòng và ở dòng sau; sắp chữ có số. `today.test.ts`: tiến tới nửa đêm kế tiếp bằng `untilMidnight` thay vì 24 giờ cố định, hoặc ghim TZ. Cỡ ≈ 60 dòng test.

### CL-D7

```
ID: CL-D7
Mức: Low
Trục: P
Vị trí: packages/ui/src/components/DataTable.tsx:88-99, 145-160 (render mọi dòng của getRowModel) · nơi dùng: routes/appointments/AppointmentsScreen.tsx:303-309, routes/customers/CustomersScreen.tsx:161-166 (f0c53eb)
Tình trạng: CONFIRMED (đo trong exe release, dữ liệu tải)
```

**Mô tả.** `DataTable` render mọi dòng (không ảo hóa, không phân trang). Mỗi lần `rows` đổi (đổi kỳ, mỗi lệnh ghi vì màn đọc lại toàn bộ — CL-B8) TanStack sắp lại và React dựng lại mọi dòng.

**Số đo** (exe release `f0c53eb`, WebView2 Edg/154, `load-backup.json` đã nhập; đo trong trang tới khung hình sau cập nhật):

| Thao tác | Dòng | Nút DOM | Thời gian |
|---|---|---|---|
| Khách hàng → "Bảng" | 1 496 | 16 547 | 378 ms |
| Khách hàng, bấm sắp "Họ tên" (3 lần) | 1 496 | | 225 / 237 / 195 ms |
| Lịch hẹn, kỳ Ngày / Tuần / Tháng | 30 / 157 / 654 | 1 112 / 2 636 / 8 600 | 50 / 72 / 99 ms |
| Lịch hẹn, kỳ Năm | 7 071 | 85 121 | 952 ms |
| Lịch hẹn kỳ Năm, bấm sắp cột Ngày (2 lần) | 7 071 | | 126 / 938 ms |
| Lịch hẹn, chọn một dòng (3 lần) | 654 / 7 071 | | 12–21 / 69–91 ms |
| Một lệnh ghi "Tạo lịch hẹn tiếp theo" (click → hộp đóng → khung hình), **không gắn debugger**, 2 lần mỗi kỳ | 659–661 / 7 077–7 079 | | Tháng 205 / 266 ms · Năm 487 / 519 ms |

Chênh ≈ 280 ms mỗi lệnh ghi giữa kỳ Năm và Tháng đến từ phần phụ thuộc số dòng (bảng 7 000 dòng + lưới năm); phần đọc lại DB giống nhau ở hai kỳ (CL-B8).

**Ảnh hưởng.** TL / RE xem Lịch hẹn kỳ Năm ở góc nhìn Toàn bộ: ≈ 1 s đứng mỗi lần đổi kỳ / sắp, ≈ 0,5 s mỗi lệnh ghi. Seed demo (≈ 6 000 lịch / năm) cùng cỡ; dữ liệu thật của một văn phòng sẽ tăng theo năm.

**Đề xuất.** Giới hạn số dòng render (phân trang hoặc "hiện thêm", không cần dependency) hoặc ảo hóa dòng (`@tanstack/react-virtual` là dependency mới → G4); `React.memo` cho hàng. Tiêu chí: kỳ Năm với dữ liệu tải, đổi kỳ / sắp < 200 ms và lệnh ghi không chậm hơn kỳ Tháng quá 50 ms. Cỡ ≈ 100–150 dòng SP.

### CL-D8

```
ID: CL-D8
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/i18n/vi.ts:4 ('app.subtitle'), 17 ('screen.placeholder') · apps/desktop/src/routes/Screen.tsx:11, 20 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** `app.subtitle` không nơi nào dùng (probe `i18n-keys.mjs`: 759 key, chỉ key này không có tham chiếu trực tiếp hay qua tiền tố mẫu; 4 key `policyForm.effect*` mà probe báo được dùng qua `` `policyForm.effect${key}` ``, `policy-form.ts:118`). Nhánh cuối của `Screen` (`t('screen.placeholder')`) không thể tới: `Route['screen']` có 7 giá trị và cả 7 đã `return` trước; doc "a screen without its content yet shows a placeholder" đã lỗi thời từ khi đủ màn.

**Ảnh hưởng.** Không ảnh hưởng người dùng; chuỗi chết nằm lại trong `vi.ts`.

**Đề xuất.** Bỏ key `app.subtitle`, `screen.placeholder` và nhánh cuối (để TypeScript kiểm đủ trường hợp, vd. `satisfies never`). Cỡ < 10 dòng.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | 0 |
| High | | | | | | | | | 0 |
| Medium | | 1 | | | | | | | 1 |
| Low | | | 1 | 1 | | 2 | 2 | | 6 |
| Nit | | | | | 1 | | | | 1 |
| **Tổng** | 0 | 1 | 1 | 1 | 1 | 2 | 2 | 0 | **8** |

Tình trạng: 8/8 CONFIRMED (CL-D4: hệ quả CONFIRMED, riêng việc phím F5 thật tải lại trong exe là PLAUSIBLE, dựa vào CL-C1). Không phát hiện nào chỉ dựa vào đọc code.

## 4. KNOWN có liên quan

- **S-2 (#96, #192):** bằng chứng mới là đường đi từ UI qua CL-D1 (hộp "đang chạy" bị Escape đóng), không phải lỗi mới của `replace`.
- **CloseGuard (#125):** các mục đã biết (đóng lúc đang seed, không có dấu hiệu đang lưu, chưa test phần React, chuỗi `BUTTON` chép) không có bằng chứng mới. CL-D1 / CL-D2 / CL-D4 là lỗi khác.
- **`DataTable` (Phase 1):** "kiểm lại cột Giờ có `tabular-nums`" — đã có: `AppointmentsScreen.tsx:158` bọc giờ trong `<span className="tabular-nums">`; cột ngày của `CustomerAppointments` là `kind: 'date'` nên ô có `tabular-nums`. Test `sortable: false` / bảng rỗng vẫn chưa có (giữ KNOWN).
- **Chart không có số liệu cho trình đọc màn hình (P8), mũi tên sắp xếp dưới 3:1 (R4), `PeriodPicker` báo đỏ sớm khi Tab (R4), `token-guard.ts:26` miễn trừ mọi `flex:` (#247):** không có gì mới. Đo lại mũi tên `↕` (`--border-strong` trên `--bg-1`): 1,76:1.
- **CL-B10** (sắp theo collation BINARY của SQLite): thêm một nơi dùng thẳng thứ tự của db: danh sách team của "Góc nhìn" (`ScopePicker.tsx:45`, `teams.map`). Với 4 team của dữ liệu tải thì thứ tự vẫn đúng; một team tên bắt đầu bằng "Đ" sẽ đứng sau "Sao Mai".
- **ACCEPTED `app-data.ts open` (`mine === current || mine === opening`):** không đổi; mutation D2 cho thấy chính vế `opening` cũng chưa có test (CL-D6).

## 5. Đã xét, không thấy

- **E — Edge case:**
  - Route: hash rỗng / lạ / thừa đoạn / `/` cuối / `%` hỏng / id có ký tự đặc biệt — test + mutation R1–R6 (R6 sống nhưng tương đương: id là ULID). `useRoute` nhớ route cuối trong `localStorage` có `try/catch`.
  - Góc nhìn: team / RE bị xóa → về cái đầu tiên; RE chuyển team → bỏ chọn (mutation SC1–SC6 đều bị bắt).
  - Ngày của app qua nửa đêm, máy ngủ, cửa sổ lấy lại focus (mutation T1–T6, D8, D9 bị bắt); hẹn giờ tới nửa đêm ≤ 24 h < giới hạn `setTimeout`; đổi giờ DST: code đúng (test đỏ do giả định 24 h → CL-D6).
  - Hàng đợi lưu: ghi chồng, ghi lỗi rồi ghi tiếp, `write` ném đồng bộ, `flush` khi rỗng / đang ghi (test + probe; khoảng trống → CL-D5).
  - Hai thao tác chồng nhau: Nạp lại / Nhập backup chạy đôi bị chặn bằng `running` + `disabled` (React xả cập nhật của sự kiện rời rạc trước sự kiện kế tiếp); chỉ bị vượt qua bằng Escape (CL-D1).
  - `Segmented` với `value` không có trong `options` thì không nút nào `tabIndex=0`: mọi nơi gọi đều truyền giá trị hợp lệ (đọc `ScopePicker`, `PeriodPicker`, các màn qua grep).
  - `ErrorBoundary` reset theo `scope` (đổi mỗi lần ghi vì `people` là mảng mới): màn lỗi lặp lại không gây vòng lặp vì `componentDidUpdate` chỉ reset khi `resetKey` đổi.
  - Chuỗi có `\` trong `vi.ts` (`exports\\`, `Project2C-data\\…`) hiện đúng một `\`; `fillSlots` không lấy tên kế thừa (`__proto__`, `constructor`; test F-19).
- **C — Đúng hợp đồng:**
  - `errorMessage` không tự lấy `error.params`: đã kiểm mọi nơi gọi với mã có chỗ trống (`TEAM_HAS_LEAD` qua `failure.params`, `TEAM_NAME_TAKEN`, `TEAM_REQUIRED`, `TRANSITION_BEFORE_LATEST` ở `CustomerDialogs.tsx:315`, `OutcomeDialog.tsx:124`, `EditOutcomeDialog.tsx:105`), không thấy chỗ trống lọt ra màn hình.
  - Nhãn so với hành vi: `settings.demo.reloadHelp` "3 team × 10 RE, ~12 tháng" khớp hằng của seed (`RES_PER_TEAM` 10, `HISTORY_DAYS` 365); "giữ 10 bản" khớp Rust (gói C); `storage.saveFailed` "sẽ được lưu lại ở lần thay đổi tiếp theo" khớp `persist-queue` (ghi cả file); `DataTable` "none → ↑ → ↓" khớp TanStack (từ ↓ ban đầu bấm một lần thì về không sắp, thứ tự gốc của màn đã là mới nhất trước).
  - Bộ đếm slot: mọi `{slot}` trong `vi.ts` thuộc `COUNT_SLOTS` hoặc `PLAIN_SLOTS` (test); không thấy slot PLAIN nào nhận số đếm ≥ 1 000.
- **D — Dữ liệu:** thứ tự trong `replace` (chờ lưu → từ chối nếu lỗi → backup → thay → đóng DB cũ sau một nhịp) và chặn ghi của DB đã bị thay (`current` / `opening`): đọc + mutation D1–D17 (D2 sống → CL-D6). `lastSave` chỉ ghi sau khi `save` thành công (D10 bị bắt). Web mode không có `persist`. Mất dữ liệu khi tải lại → CL-D4.
- **P — Hiệu năng** (exe release, dữ liệu tải 13,07 MB, median / dải):
  - Lưu qua IPC (`invoke('db_save', bytes)` như `tauri-storage.ts`), **không gắn debugger**: 9,3 MB 126–143 ms tổng, luồng chính bị chặn 10–14 ms; 13,07 MB 173–195 ms tổng, chặn 12–25 ms. Phía Rust chỉ ≈ 9 ms (CL-C), phần còn lại là chuyển body qua IPC, chạy ngoài luồng chính. Khi gắn Playwright (bật Network domain) cùng phép đo lên 205–559 ms và chặn 161–231 ms, nên các số đo khác có ghi "gắn debugger" đều có thể cao hơn thực tế ở phần lưu. Không thành phát hiện: mỗi lệnh chỉ thêm ≈ 15–25 ms trên luồng chính; hàng đợi gộp các lần lưu.
  - Mở exe tới màn đầu (route nhớ là Lịch hẹn): 609 / 614 / 627 / 620 / 668 ms (5 lần). Không thành phát hiện.
  - Đọc file backup tải để xem trước (Cài đặt → Nhập backup, không gắn debugger): 1 965 ms tới hộp xác nhận, luồng chính đứng 1 853 ms liền. Phần lớn là `importBackup` (gói B: 1,46 s, CL-B13); `countRecords` hai lần ≈ 110 ms ×2 (ghi chú gói B). Một lần mỗi lần nhập, có trạng thái "Đang đọc file…": không thành phát hiện riêng.
  - Đọc lại toàn bộ sau mỗi lệnh ghi: đã có CL-B8; số đầu-cuối của một lệnh ghi ở CL-D7.
  - Chart: `useEffect` dựng lại chart (dispose + init) mỗi khi `option` đổi; chưa đo (màn Tổng quan / Báo cáo thuộc gói F).
  - Bundle: `@tanstack/react-table` và `echarts` (chỉ module dùng) nằm trong chunk theo baseline; không có gì mới trong phạm vi D.
- **B — Bloat:** `tsc --noUnusedLocals --noUnusedParameters` sạch cho `apps/desktop` và `packages/ui`. Export không có nơi dùng trong code sản phẩm (`exports.mjs`) chỉ là type nằm trong chữ ký công khai (`ButtonVariant`, `Choice`, `DataTableSort`, `SegmentedOption`, `SelectOption`, `TokenReader`, `TokenViolation`, `ClosePort`, `ScopeState`, `ScreenErrorMessage`, `StartupMessage`, `LastSave`, `ExportedBackup`, `OpenAppDataOptions`, `DayWatcher`, `WakeEvents`, `MessageParams`) và 4 export chỉ test dùng (`compareCells`, `COUNT_SLOTS`, `PLAIN_SLOTS`, `fillSlots`): không báo. Dependency của `ui` đều dùng. Key / nhánh chết → CL-D8.
- **T — Test:** 75 mutation, 64 bị bắt, 11 sống (phụ lục A). Có nghĩa → CL-D5, CL-D6. Sống nhưng tương đương / không quan sát được qua hành vi: Q8 (báo listener cả khi không đổi), D14 (`opening` không xóa: sau khi mở thành công nó bằng `current`), D16 (không đóng DB đọc thử: rò bộ nhớ WASM, không đo qua test), R6, C3, TG2. Xáo thứ tự: xanh. Múi giờ: CL-D6. Phần React (`Dialog`, `DataTable`, `CloseGuard`…) không có unit test (KNOWN: công cụ test component là G4); e2e không kiểm focus hay Escape lặp (CL-D1–D3).
- **A — Trợ năng / i18n:**
  - Chuỗi cứng: grep văn bản JSX, `aria-label=`, `title=`, `placeholder=` dạng literal trong `packages/ui` và `shell`: không có (logo "2C" là `aria-hidden`).
  - Tương phản (`contrast.mjs`): mọi cặp chữ / nền dùng trong phạm vi ≥ 4,5:1 (thấp nhất `--text-3` trên `--bg-3` 4,89; `on-accent` trên `danger` 7,26; chữ trên nền ô ngày 9,31–10,07). Mũi tên sắp: KNOWN.
  - `DataTable` (`aria-sort` chỉ trên cột sắp được, nút trong `th`), `Segmented` (radiogroup + phím mũi tên + roving tabindex), `PeriodPicker` (group có nhãn, nút ‹ › có `aria-label`, `output aria-live`), `Choices` (fieldset / legend, radio thật), `SelectField` / `TextField` (label, `aria-describedby`, `aria-invalid`): đọc code, không thấy thiếu. Focus trong hộp thoại → CL-D2, CL-D3.
- **S — An toàn (hẹp):** tên file xuất đi qua header `x-p2c-file-name`, Rust lọc (gói C). Webview không gửi đường dẫn nào (`openFolder` chỉ nhận `'exports' | 'backups'`). File backup quá `MAX_BACKUP_BYTES` bị từ chối trước khi đọc (`SettingsBackup.tsx:66`). Không thấy gì mới.

## 6. Ghi chú cho gói sau (không phải phát hiện gói D)

- **Gói E:** chi phí một lệnh ghi ở Lịch hẹn kỳ Năm (CL-D7) gồm cả `appointmentRows` / `yearGrid` của màn; `PersonDialogs.tsx:46-57` gọi `onSaved(...)` trong cùng `try` với `data.run`, nên một lỗi của `onSaved` sau khi lệnh đã ghi sẽ hiện `error.unknown` "Dữ liệu không bị đổi" (chưa thử).
- **Gói F:** `Chart` dựng lại toàn bộ khi `option` đổi (mỗi lệnh ghi khi Tổng quan đang mở); hộp Nạp lại / Nhập backup dựa vào CL-D1.
- **Gói H:** số IPC lưu / mở exe / đọc backup ở §5 P; exe có cổng debug dùng được để đo đầu-cuối (`claude\D\exe`, `cdp.mjs`, `startup.mjs`).

## Phụ lục A — Kết quả mutation (`mutate-results-merged.json`)

Mỗi lượt phục vụ đúng một file đã đổi qua plugin `load` của Vite (repo không bị ghi), chạy 121 test của phạm vi D (`--bail=1`). Tổng: {"KILLED":64,"SURVIVED":11}.

| ID | File | Thay đổi | Kết quả | Test bắt được |
|---|---|---|---|---|
| Q1 | data/persist-queue.ts | success keeps lost snapshot | KILLED | createPersistQueue > flush() writes the latest snapshot again after a failed write |
| Q2 | data/persist-queue.ts | success leaves failed | KILLED | createPersistQueue > reports a failed write and clears it after the next successful write |
| Q3 | data/persist-queue.ts | concurrent drains | KILLED | createPersistQueue > writes one file at a time and ends with the last snapshot on disk |
| Q4 | data/persist-queue.ts | flush re-persists lost while running | SURVIVED |  |
| Q5 | data/persist-queue.ts | flush never rejects | KILLED |  |
| Q6 | data/persist-queue.ts | unsaved ignores lost | KILLED | createPersistQueue > flush() writes the latest snapshot again after a failed write |
| Q7 | data/persist-queue.ts | sync throw not wrapped | KILLED | createPersistQueue > keeps saving after a write throws before returning a promise |
| Q8 | data/persist-queue.ts | listeners on every set | SURVIVED |  |
| Q9 | data/persist-queue.ts | drain keeps first snapshot | KILLED | createPersistQueue > writes one file at a time and ends with the last snapshot on disk |
| D1 | data/app-data.ts | replaced db still saves | KILLED | reloadDemoData > never saves the replaced database again: a late write to it cannot overwrite the file |
| D2 | data/app-data.ts | opening db does not save | SURVIVED |  |
| D3 | data/app-data.ts | replace ignores failed save | KILLED | reloadDemoData > refuses while the last save failed: the backup would miss those changes |
| D4 | data/app-data.ts | replace does not wait for saves | KILLED | reloadDemoData > refuses while the last save failed: the backup would miss those changes |
| D5 | data/app-data.ts | replace without backup | KILLED | reloadDemoData > saves pending changes, backs the file up, then swaps in new simulated data anchored today |
| D6 | data/app-data.ts | previous db never closed | KILLED | reloadDemoData > closes the replaced database once the screens moved to the new one |
| D7 | data/app-data.ts | new data not saved at once | KILLED | openAppData > with no file yet loads the simulated data and saves it |
| D8 | data/app-data.ts | pinned day never moves | KILLED | openAppData > moves a pinned day on with the clock, so an app left open crosses midnight (T-126) |
| D9 | data/app-data.ts | pinned now keeps clock day | KILLED | openAppData > dates the database's writes and checks on the app's day, also after new data |
| D10 | data/app-data.ts | lastSave before the write | KILLED | the data file card > records the time and size of the last successful save, and tells subscribers |
| D11 | data/app-data.ts | lastSave listeners not told | KILLED | the data file card > records the time and size of the last successful save, and tells subscribers |
| D12 | data/app-data.ts | counts: appointments from policies | SURVIVED |  |
| D13 | data/app-data.ts | replace: no change event | KILLED | reloadDemoData > saves pending changes, backs the file up, then swaps in new simulated data anchored today |
| D14 | data/app-data.ts | opening never cleared | SURVIVED |  |
| D15 | data/app-data.ts | exportFile ignores storage | KILLED | backup files > writes a report into exports in the exe; web mode leaves it to the screen |
| D16 | data/app-data.ts | readBackup leaves db open | SURVIVED |  |
| D17 | data/app-data.ts | run: changed before command | KILLED | openAppData > run() of a rejected command rethrows and tells no one: nothing changed |
| T1 | data/today.ts | current: new object each read | KILLED | watchToday > returns the same object while the day stays the same |
| T2 | data/today.ts | midnight +2 days | KILLED | watchToday > tells its listener at every midnight, and then reads the new day |
| T3 | data/today.ts | hidden wake counts | KILLED | watchToday > reads the day again when the window gets focus or turns visible, not when it hides |
| T4 | data/today.ts | timer not cleared | KILLED | watchToday > stops its timer and its event listeners on unsubscribe |
| T5 | data/today.ts | timer not rearmed | KILLED | watchToday > tells its listener at every midnight, and then reads the new day |
| T6 | data/today.ts | focus listener not removed | KILLED | watchToday > stops its timer and its event listeners on unsubscribe |
| S1 | data/tauri-storage.ts | empty reply is a file | KILLED | tauriStorage > treats an empty reply as no file yet |
| S2 | data/tauri-storage.ts | offset sign | KILLED | tauriStorage > loads the file bytes with the local UTC offset for backup names |
| S3 | data/tauri-storage.ts | header name | KILLED | tauriStorage > writes an export as raw bytes, the file name in a header, and returns the path |
| S4 | data/tauri-storage.ts | null backup kept | KILLED | tauriStorage > asks for the newest backup name; null means none |
| S5 | data/tauri-storage.ts | command name db_save | KILLED | tauriStorage > saves by sending the raw bytes |
| S6 | data/tauri-storage.ts | backup without offset | KILLED | tauriStorage > backs the saved file up under a local-time name and returns that name |
| G1 | shell/close-guard.ts | discard means retry | KILLED | closeAfterSaving > asks instead of closing when the save fails, and closes after a successful retry |
| G2 | shell/close-guard.ts | no close after discard | KILLED | closeAfterSaving > closes at once when everything is saved |
| G3 | shell/close-guard.ts | never asks | KILLED | closeAfterSaving > asks instead of closing when the save fails, and closes after a successful retry |
| SC1 | shell/scope.ts | no team fallback | KILLED | resolveScope > falls back to the first team or RE when none is chosen or it is gone |
| SC2 | shell/scope.ts | no RE fallback | KILLED | resolveScope > falls back to the first team or RE when none is chosen or it is gone |
| SC3 | shell/scope.ts | chooseKind drops team | KILLED | chooseKind > keeps the team or RE picked when its kind is clicked again |
| SC4 | shell/scope.ts | narrow: RE of any team | KILLED | narrowScope > keeps the team when the RE picked is not one of its RE |
| SC5 | shell/scope.ts | reOptions: no team order | KILLED | reOptions > orders the RE by team, then by name, with Vietnamese letters in place |
| SC6 | shell/scope.ts | teamRes: TL included | KILLED | narrowScope > keeps the team when the RE picked is not one of its RE |
| R1 | shell/routes.ts | extra segments accepted | KILLED | parseHash > returns null for an empty or unknown hash |
| R2 | shell/routes.ts | decode throws | KILLED | parseHash > returns null for an empty or unknown hash |
| R3 | shell/routes.ts | team picker on overview | KILLED | teamPickerShown > Overview counts every team together, so it has no team to pick (spec Phase 4 §4.3) |
| R4 | shell/routes.ts | settings uses scope | KILLED | usesScope > is true only for Overview, Customers, Appointments and Reports |
| R5 | shell/routes.ts | trailing slash kept | KILLED | parseHash > ignores a trailing slash |
| R6 | shell/routes.ts | customer id not encoded | SURVIVED |  |
| E1 | shell/startup-error.ts | already-open as generic | KILLED | startupMessage > tells the user to use the window already open, without technical detail |
| E2 | shell/startup-error.ts | too-new without params | KILLED | startupMessage > asks for a newer app when the file comes from one, naming both schema versions |
| E3 | shell/screen-error.ts | screen error detail empty | KILLED | screenErrorMessage > says the screen failed, what to do, and keeps the error as the technical detail |
| I1 | i18n/index.ts | inherited names fill | KILLED | t > leaves a slot whose name the params only inherit |
| I2 | i18n/index.ts | counts not grouped | KILLED | t > groups the thousands of a count |
| I3 | i18n/index.ts | errorMessage: no known-code check | KILLED | errorMessage > falls back to a general message for a code without text, or anything else |
| I4 | i18n/index.ts | joinParts keeps empties | KILLED | joinParts > leaves out the parts not known |
| I5 | i18n/index.ts | joinParts separator without spaces | KILLED | joinParts > joins with a dot, or an arrow |
| I6 | i18n/index.ts | count slot list misses total | KILLED | t > groups the thousands of a count |
| C1 | ui/components/compare-cells.ts | tie-break reversed | KILLED | compareCellsThen > orders two cells of the same day by their tie-break, empty first |
| C2 | ui/components/compare-cells.ts | numeric collation off | SURVIVED |  |
| C3 | ui/components/compare-cells.ts | collation case/accent sensitive | SURVIVED |  |
| C4 | ui/components/compare-cells.ts | tie-break ignored | KILLED | compareCellsThen > orders two cells of the same day by their tie-break, empty first |
| CH1 | ui/components/chart-theme.ts | palette ignored | KILLED | chartTheme > colours series from the palette given, in its order |
| CH2 | ui/components/chart-theme.ts | today colour token | KILLED | chartTheme > offers a `today` style for category labels: the date-today colour, bold |
| CH3 | ui/components/chart-theme.ts | font size unparsed | KILLED | chartTheme > draws text, axes and tooltips with token colours on a transparent background |
| PL1 | ui/components/PeriodPicker.label.ts | month uses year template | KILLED | periodLabel > wraps month and year in their label templates |
| TG1 | ui/token-guard.ts | inline style always allowed | KILLED | findTokenViolations > flags inline styles, which bypass the token utilities |
| TG2 | ui/token-guard.ts | lengths after dot | SURVIVED |  |
| TG3 | ui/token-guard.ts | block comment never ends | SURVIVED |  |
| TG4 | ui/token-guard.ts | line comment ignored | KILLED | findHardcodedSeparators > lets comments use them |
| TG5 | ui/token-guard.ts | palette: white/black allowed | KILLED | findTokenViolations > flags Tailwind's default palette, which the theme removes |

## Phụ lục B — Kết quả probe (`probe-results.log`)

```
Gói D — kết quả probe (05/10/2026, Home PC, exe release f0c53eb ở claude\D\exe, WebView2 Edg/154; Browser pane Chrome 152)

== Escape trên <dialog> (Browser pane, dev:web)
probe mở bằng click: Esc1 {"cancels":[true],"closes":0,"open":true}  Esc2 {"cancels":[true,false],"closes":0,"open":false}
Nạp lại đang chạy + Esc, Esc: {"exists":true,"open":false,"text":"Nạp lại dữ liệu giả lập?… Đang nạp l…"}; sau 6 s: dialog gỡ, "Đã nạp lại dữ liệu giả lập, neo ở ngày 05/10/2026."

== CloseGuard trong exe (file khóa FileShare.ReadWrite)
addTeam 'Probe Close' → alerts: ["Chưa lưu được dữ liệu vào file…"]
CloseMainWindow #1 → dialogs [{open:true,"Chưa lưu được thay đổi…"}]
Esc, Esc → vẫn open:true
ua.js: activeElement = "BUTTON Đóng và bỏ thay đổi chưa lưu", UA Edg/154
Esc → {"cancels":1,"lastCancelable":true,"open":true}; Esc → {"cancels":2,"lastCancelable":false,"open":false}
CloseMainWindow #3, #4, #5 (sau khi nhả khóa: "file free") → alive: 42704, dialogs [{open:false}], cảnh báo vẫn hiện

== Tải lại sau lưu lỗi (exe)
addTeam 'Probe F5' → alert lưu lỗi; location.reload() → {"dialogs":[],"alerts":[],"teamShown":false}
f5.mjs (F5 / Control+R qua CDP): {"F5":{"reloaded":false},"Control+R":{"reloaded":false}}

== Focus (Browser pane)
"+ Team": activeElement INPUT (ô đầu), autofocusAttr false; Escape → activeElement BODY
Hẹn tiếp (KH cố định): activeElement SELECT "RE *", firstFocusable SELECT "RE *"

== IPC lưu (exe)
gắn debugger, 9,3 MB: saveMs 293–318 (median 299); ipc-block: syncMs 55–78, totalMs 205–559, maxGapMs 161–231
không debugger, 9,3 MB: syncMs 10–14, totalMs 126–143, maxGapMs 10–14
không debugger, 13,07 MB: syncMs 12–25, totalMs 173–195, maxGapMs 12–25

== Nhập backup tải (exe)
gắn debugger: readMs 7943, replaceMs 1702; không debugger: toDialogMs 1965, maxGapMs 1853

== Mở exe (dữ liệu tải): firstScreenMs 627, 614, 609, 668, 620

== DataTable (exe, dữ liệu tải, gắn debugger — phần render không qua IPC)
Khách hàng: toTable 378 ms, rows 1496, domNodes 16547; sortName 225/237/195; toKanban 30
Lịch hẹn: Ngày 50 ms 30 dòng 1112 nút; Tuần 72 ms 157 dòng 2636; Tháng 99 ms 654 dòng 8600; Năm 952 ms 7071 dòng 85121; sort cột Ngày 126 / 938
Chọn dòng: Tháng 21/12/19 ms (654 dòng); Năm 76/91/69 ms (7071 dòng)
Lệnh ghi (gắn debugger): Tháng 389/380, Năm 600/610
Lệnh ghi (không debugger): Tháng {clickMs 17, toFrameMs 205, rows 659}, {21, 266, 661}; Năm {19, 487, 7077}, {21, 519, 7079}

== Test theo múi giờ / thứ tự
shuffle seed 7, 99: 121/121
TZ=America/Los_Angeles: FAIL today.test.ts "tells its listener at every midnight…" expected 2 times, got 1
TZ=Pacific/Kiritimati: 121/121

== tsc --noUnusedLocals --noUnusedParameters --incremental false: apps/desktop, packages/ui sạch

== i18n-keys.mjs: keys 759, duplicates 0; unused: app.subtitle, policyForm.effectDown/Up/DownNoRe/UpNoRe (4 key sau dùng qua `policyForm.effect${key}`); t('…') thiếu trong vi: none

== contrast.mjs
6.17 fg-3/surface-1 · 5.61 fg-3/surface-2 · 4.89 fg-3/surface-3 · 8.17 fg-2/surface-2 · 6.84 accent/accent-soft · 7.26 on-accent/danger · 9.56 on-accent/accent · 6.79 danger/surface-1 · 8.94 warn/surface-0 · 9.31 / 9.95 / 10.07 fg trên nền ô ngày · 1.76 mũi tên ↕ (KNOWN)
```

## Phụ lục C — Nguồn test tạm / probe

Tất cả nằm ở `C:\workspace\deep-review-1-4\claude\D\`; exe là bản `pnpm build:exe` tại `f0c53eb` chép sang `D\exe\` (dữ liệu probe ở `D\exe\Project2C-data\`).

### `mutate.mjs`

```js
// Deep review Phase 1–4, gói D: "phá code" probe. For each mutation, runs the D-scope unit tests
// (vitest.mut.config.mts) with one file served mutated, and records killed / survived.
// The repo is never written. Usage: node mutate.mjs [name-filter]
import { appendFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const HERE = 'C:/workspace/deep-review-1-4/claude/D';
const VITEST = 'C:/workspace/Project-2C-review/node_modules/vitest/vitest.mjs';
const D = 'apps/desktop/src/data/';
const S = 'apps/desktop/src/shell/';
const I = 'apps/desktop/src/i18n/';
const U = 'packages/ui/src/';

/** [name, file, from, to] — `from` must occur exactly once in the file. */
const MUTATIONS = [
  // persist-queue.ts
  ['Q1 success keeps lost snapshot', `${D}persist-queue.ts`, '        lost = undefined;\n', '\n'],
  ['Q2 success leaves failed', `${D}persist-queue.ts`, '        setFailed(false);\n', '\n'],
  ['Q3 concurrent drains', `${D}persist-queue.ts`, 'running ??= drain();', 'running = drain();'],
  ['Q4 flush re-persists lost while running', `${D}persist-queue.ts`, 'if (!running && lost) persist(lost);', 'if (lost) persist(lost);'],
  ['Q5 flush never rejects', `${D}persist-queue.ts`, "if (failed) throw new Error('SAVE_FAILED');", ''],
  ['Q6 unsaved ignores lost', `${D}persist-queue.ts`, 'running !== undefined || lost !== undefined', 'running !== undefined'],
  ['Q7 sync throw not wrapped', `${D}persist-queue.ts`, 'await new Promise<void>((resolve) => resolve(write(bytes)));', 'await write(bytes);'],
  ['Q8 listeners on every set', `${D}persist-queue.ts`, '    if (failed === value) return;\n', '\n'],
  ['Q9 drain keeps first snapshot', `${D}persist-queue.ts`, '    waiting = bytes;\n    running', '    waiting ??= bytes;\n    running'],
  // app-data.ts
  ['D1 replaced db still saves', `${D}app-data.ts`, 'if (mine === current || mine === opening) saves.persist(snapshot);', 'saves.persist(snapshot);'],
  ['D2 opening db does not save', `${D}app-data.ts`, 'if (mine === current || mine === opening) saves.persist(snapshot);', 'if (mine === current) saves.persist(snapshot);'],
  ['D3 replace ignores failed save', `${D}app-data.ts`, '    if (saves.failed()) throw new Error(UNSAVED_CHANGES);\n', '\n'],
  ['D4 replace does not wait for saves', `${D}app-data.ts`, '    await saves.idle();\n    if (saves.failed())', '    if (saves.failed())'],
  ['D5 replace without backup', `${D}app-data.ts`, 'const backup = await storage?.backup();', 'const backup = undefined;'],
  ['D6 previous db never closed', `${D}app-data.ts`, '    previous.sqlite.close();\n', '\n'],
  ['D7 new data not saved at once', `${D}app-data.ts`, '    if (storage) saves.persist(bytes);\n', '\n'],
  ['D8 pinned day never moves', `${D}app-data.ts`, 'addDays(pinned(), daysBetween(opened, fromLocalDate(at)))', 'pinned()'],
  ['D9 pinned now keeps clock day', `${D}app-data.ts`, '        at.setFullYear(day.year, day.month - 1, day.day);\n', '\n'],
  ['D10 lastSave before the write', `${D}app-data.ts`, '    await storage.save(bytes);\n    lastSave = { at: clock(), size: bytes.byteLength };', '    lastSave = { at: clock(), size: bytes.byteLength };\n    await storage.save(bytes);'],
  ['D11 lastSave listeners not told', `${D}app-data.ts`, '    for (const listener of lastSaveListeners) listener();\n', '\n'],
  ['D12 counts: appointments from policies', `${D}app-data.ts`, 'appointments: listAppointments(db).length,', 'appointments: listPolicies(db).length,'],
  ['D13 replace: no change event', `${D}app-data.ts`, '    db = await next();\n    changed();', '    db = await next();'],
  ['D14 opening never cleared', `${D}app-data.ts`, '      if (opening === mine) opening = undefined;\n', '\n'],
  ['D15 exportFile ignores storage', `${D}app-data.ts`, 'exportFile: (name, bytes) => storage?.writeExport(name, bytes) ?? Promise.resolve(undefined),', 'exportFile: () => Promise.resolve(undefined),'],
  ['D16 readBackup leaves db open', `${D}app-data.ts`, '        imported.db.sqlite.close();\n', '\n'],
  ['D17 run: changed before command', `${D}app-data.ts`, '      const result = command(db);\n      changed();', '      changed();\n      const result = command(db);'],
  // today.ts
  ['T1 current: new object each read', `${D}today.ts`, 'if (compareDates(next, day) !== 0) day = next;', 'day = next;'],
  ['T2 midnight +2 days', `${D}today.ts`, 'at.getDate() + 1', 'at.getDate() + 2'],
  ['T3 hidden wake counts', `${D}today.ts`, "if (events.document.visibilityState === 'visible') listener();", 'listener();'],
  ['T4 timer not cleared', `${D}today.ts`, '        clearTimeout(timer);\n', '\n'],
  ['T5 timer not rearmed', `${D}today.ts`, '          listener();\n          wait();', '          listener();'],
  ['T6 focus listener not removed', `${D}today.ts`, "        events.window.removeEventListener('focus', onFocus);\n", '\n'],
  // tauri-storage.ts
  ['S1 empty reply is a file', `${D}tauri-storage.ts`, 'reply.byteLength === 0 ? undefined : new Uint8Array(reply)', 'new Uint8Array(reply)'],
  ['S2 offset sign', `${D}tauri-storage.ts`, 'utcOffsetMinutes: -timezoneOffset()', 'utcOffsetMinutes: timezoneOffset()'],
  ['S3 header name', `${D}tauri-storage.ts`, "'x-p2c-file-name'", "'x-p2c-filename'"],
  ['S4 null backup kept', `${D}tauri-storage.ts`, "((await invoke('db_latest_backup')) as string | null) ?? undefined", "(await invoke('db_latest_backup')) as string"],
  ['S5 command name db_save', `${D}tauri-storage.ts`, "await invoke('db_save', bytes);", "await invoke('db_write', bytes);"],
  ['S6 backup without offset', `${D}tauri-storage.ts`, "(await invoke('db_backup', local())) as string", "(await invoke('db_backup')) as string"],
  // close-guard.ts / CloseGuard (pure part only)
  ['G1 discard means retry', `${S}close-guard.ts`, "if ((await port.ask()) === 'discard') break;", "if ((await port.ask()) === 'retry') break;"],
  ['G2 no close after discard', `${S}close-guard.ts`, '  await port.close();\n', '\n'],
  ['G3 never asks', `${S}close-guard.ts`, '      if ((await port.ask()) === \'discard\') break;\n', '      break;\n'],
  // scope.ts
  ['SC1 no team fallback', `${S}scope.ts`, '?? teams[0];', ';'],
  ['SC2 no RE fallback', `${S}scope.ts`, '?? reps[0];', ';'],
  ['SC3 chooseKind drops team', `${S}scope.ts`, 'return kind === choice.kind ? choice : { kind };', 'return { kind };'],
  ['SC4 narrow: RE of any team', `${S}scope.ts`, 'const re = teamRes(people, scope.teamId).find((person) => person.id === reInTeam);', 'const re = people.find((person) => person.id === reInTeam);'],
  ['SC5 reOptions: no team order', `${S}scope.ts`, 'byName(a.team, b.team) || byName(a.re.name, b.re.name)', 'byName(a.re.name, b.re.name)'],
  ['SC6 teamRes: TL included', `${S}scope.ts`, "person.role === 'RE' && person.teamId === teamId", 'person.teamId === teamId'],
  // routes.ts
  ['R1 extra segments accepted', `${S}routes.ts`, '  if (rest.length > 0) return null;\n', '\n'],
  ['R2 decode throws', `${S}routes.ts`, '    return decodeURIComponent(segment);\n  } catch {\n    return null;', '    return decodeURIComponent(segment);\n  } catch {\n    throw new Error("bad");'],
  ['R3 team picker on overview', `${S}routes.ts`, "return screen !== 'overview';", 'return true;'],
  ['R4 settings uses scope', `${S}routes.ts`, "    screen === 'reports'\n", "    screen === 'reports' ||\n    screen === 'settings'\n"],
  ['R5 trailing slash kept', `${S}routes.ts`, ".replace(/\\/$/, '')", ''],
  ['R6 customer id not encoded', `${S}routes.ts`, '`#/customers/${encodeURIComponent(route.id)}`', '`#/customers/${route.id}`'],
  // screen-error / startup-error
  ['E1 already-open as generic', `${S}startup-error.ts`, '  if (error === ALREADY_OPEN) {', '  if (false) {'],
  ['E2 too-new without params', `${S}startup-error.ts`, "help: t('storage.tooNewHelp', error.params)", "help: t('storage.tooNewHelp')"],
  ['E3 screen error detail empty', `${S}screen-error.ts`, 'detail: String(error),', "detail: '',"],
  // i18n/index.ts
  ['I1 inherited names fill', `${I}index.ts`, 'if (!Object.hasOwn(params, name)) return slot;', 'if (!(name in params)) return slot;'],
  ['I2 counts not grouped', `${I}index.ts`, "typeof value === 'number' && COUNT_SLOTS.has(name) ? formatCount(value) : String(value)", 'String(value)'],
  ['I3 errorMessage: no known-code check', `${I}index.ts`, '    if (Object.hasOwn(vi, key)) return t(key as MessageKey, params);', '    return t(key as MessageKey, params);'],
  ['I4 joinParts keeps empties', `${I}index.ts`, 'parts.filter(Boolean).join', 'parts.join'],
  ['I5 joinParts separator without spaces', `${I}index.ts`, '.join(` ${t(`sep.${sep}`)} `)', '.join(t(`sep.${sep}`))'],
  ['I6 count slot list misses total', `${I}index.ts`, "  'total',\n", '\n'],
  // packages/ui
  ['C1 tie-break reversed', `${U}components/compare-cells.ts`, 'thenA < thenB ? -1 : thenA > thenB ? 1 : 0', 'thenA < thenB ? 1 : thenA > thenB ? -1 : 0'],
  ['C2 numeric collation off', `${U}components/compare-cells.ts`, "sensitivity: 'base', numeric: true", "sensitivity: 'base'"],
  ['C3 collation case/accent sensitive', `${U}components/compare-cells.ts`, "sensitivity: 'base', numeric: true", "sensitivity: 'variant', numeric: true"],
  ['C4 tie-break ignored', `${U}components/compare-cells.ts`, 'return compareCells(kind, a, b) || (thenA < thenB ? -1 : thenA > thenB ? 1 : 0);', 'return compareCells(kind, a, b);'],
  ['CH1 palette ignored', `${U}components/chart-theme.ts`, 'color: palette.map(token),', 'color: SERIES_TOKENS.map(token),'],
  ['CH2 today colour token', `${U}components/chart-theme.ts`, "token('--date-today')", "token('--accent')"],
  ['CH3 font size unparsed', `${U}components/chart-theme.ts`, "fontSize: Number.parseFloat(token('--fs-xs')),", 'fontSize: 12,'],
  ['PL1 month uses year template', `${U}components/PeriodPicker.label.ts`, "return templates.monthLabel.replace('{value}', value);", "return templates.yearLabel.replace('{value}', value);"],
  ['TG1 inline style always allowed', `${U}token-guard.ts`, "['inline-style', /\\bstyle=\\{(?!\\{ flex: [\\w.[\\]]+ \\}\\})/g],", "['inline-style', /\\bstyle=\\{(?!\\{)/g],"],
  ['TG2 lengths after dot', `${U}token-guard.ts`, '(?<![\\w.[-])', '(?<![\\w[-])'],
  ['TG3 block comment never ends', `${U}token-guard.ts`, '        inComment = end < 0;\n', '        inComment = true;\n'],
  ['TG4 line comment ignored', `${U}token-guard.ts`, '        code += line < 0 ? rest : rest.slice(0, line);', '        code += rest;'],
  ['TG5 palette: white/black allowed', `${U}token-guard.ts`, '-\\\\d{2,3}|white|black)', '-\\\\d{2,3})'],
];

const filter = process.argv[2];
const results = {};
writeFileSync(`${HERE}/mutate.log`, '');
for (const [name, file, from, to] of MUTATIONS) {
  if (filter && !name.startsWith(filter)) continue;
  const run = spawnSync(
    process.execPath,
    [VITEST, 'run', '--config', `${HERE}/vitest.mut.config.mts`, '--reporter=dot', '--bail=1'],
    { env: { ...process.env, MUT: JSON.stringify({ file, from, to }) }, encoding: 'utf8', cwd: HERE },
  );
  const out = `${run.stdout}\n${run.stderr}`;
  let verdict;
  if (/found \d+ times/.test(out)) verdict = 'BAD-MUTATION';
  else if (run.status === 0) verdict = 'SURVIVED';
  else verdict = 'KILLED';
  const failing = [...out.matchAll(/FAIL\s+(\S+)\s+>\s+([^\n]+)/g)].map((m) => `${m[1]} > ${m[2]}`)[0] ?? '';
  results[name] = { verdict, failing };
  console.log(`${verdict.padEnd(12)} ${name}${failing ? `  [${failing}]` : ''}`);
  appendFileSync(`${HERE}/mutate.log`, `\n===== ${name} (${verdict})\n${out.slice(-3000)}\n`);
}
writeFileSync(`${HERE}/mutate-results.json`, JSON.stringify(results, null, 1));
const tally = Object.values(results).reduce((t, r) => ({ ...t, [r.verdict]: (t[r.verdict] ?? 0) + 1 }), {});
console.log(JSON.stringify(tally));
```

### `vitest.mut.config.mts`

```ts
// Gói D "phá code" probe: runs the D-scope unit tests of the review worktree with ONE file served
// mutated (from the MUT env var: {file, from, to}); the repo is only read, never written.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = 'C:/workspace/Project-2C-review';
const mut = process.env.MUT ? JSON.parse(process.env.MUT) : null;
const target = mut ? resolve(ROOT, mut.file).replaceAll('\\', '/').toLowerCase() : null;

export default {
  root: ROOT,
  cacheDir: 'C:/workspace/deep-review-1-4/claude/D/.vite-cache',
  plugins: [
    {
      name: 'p2c-mutate',
      enforce: 'pre' as const,
      load(id: string) {
        if (!mut) return null;
        const clean = id.split('?')[0]!.replaceAll('\\', '/').toLowerCase();
        if (clean !== target) return null;
        const source = readFileSync(resolve(ROOT, mut.file), 'utf8').replaceAll('\r\n', '\n');
        const count = source.split(mut.from).length - 1;
        if (count !== 1) throw new Error(`mutation "${mut.from}" found ${count} times in ${mut.file}`);
        return source.replace(mut.from, mut.to);
      },
    },
  ],
  test: {
    include: [
      'apps/desktop/src/data/**/*.test.ts',
      'apps/desktop/src/shell/**/*.test.ts',
      'apps/desktop/src/i18n/**/*.test.ts',
      'packages/ui/src/**/*.test.ts',
    ],
  },
};
```

### `vitest.probe.config.mts`

```ts
// Gói D probes in ./probe, run against the review worktree's files; MUT (as in
// vitest.mut.config.mts) serves one repo file mutated. The repo is only read.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = 'C:/workspace/Project-2C-review';
const mut = process.env.MUT ? JSON.parse(process.env.MUT) : null;
const target = mut ? resolve(ROOT, mut.file).replaceAll('\\', '/').toLowerCase() : null;

export default {
  root: 'C:/workspace/deep-review-1-4/claude/D/probe',
  cacheDir: 'C:/workspace/deep-review-1-4/claude/D/.vite-cache',
  server: { fs: { allow: [ROOT, 'C:/workspace/deep-review-1-4'] } },
  plugins: [
    {
      name: 'p2c-mutate',
      enforce: 'pre' as const,
      load(id: string) {
        if (!mut) return null;
        const clean = id.split('?')[0]!.replaceAll('\\', '/').toLowerCase();
        if (clean !== target) return null;
        const source = readFileSync(resolve(ROOT, mut.file), 'utf8').replaceAll('\r\n', '\n');
        return source.replace(mut.from, mut.to);
      },
    },
  ],
  test: { include: ['**/*.test.ts'] },
};
```

### `probe/persist-flush.test.ts`

```ts
// Probe (gói D, CL-D5): flush() while a newer write is running, after an earlier write failed.
// Green on the repo code; red under mutation Q4 (`if (lost) persist(lost)`), which the repo's
// own tests let through: the older, failed snapshot is written last and the file goes back.
import { describe, expect, it } from 'vitest';
import { createPersistQueue } from 'C:/workspace/Project-2C-review/apps/desktop/src/data/persist-queue.ts';

const bytes = (n: number) => new Uint8Array([n]);

describe('persist-queue probe', () => {
  it('flush() during a running write never writes an older failed snapshot after it', async () => {
    const disk: number[] = [];
    let release: (() => void) | undefined;
    let calls = 0;
    const queue = createPersistQueue(async (b) => {
      calls++;
      if (calls === 1) throw new Error('locked'); // snapshot 1 fails
      if (calls === 2) await new Promise<void>((r) => (release = r)); // snapshot 2 is slow
      disk.push(b[0]!);
    });
    queue.persist(bytes(1));
    await queue.idle();
    expect(queue.failed()).toBe(true);

    queue.persist(bytes(2)); // a newer change while the file was locked
    await Promise.resolve();
    const flushing = queue.flush(); // the user closes the window meanwhile
    release?.();
    await flushing;

    expect(disk.at(-1)).toBe(2);
  });
});
```

### `cdp.mjs`

```js
// Probe (gói D): drives the release exe copy in D\exe through WebView2's remote debugging port.
// Usage: node cdp.mjs eval <file.js>   — runs the file's body as an async function in the page
//        node cdp.mjs key <Key> [n]    — presses a key n times (CDP input, like a user's key)
//        node cdp.mjs upload <selector> <path>
// The exe is started with WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const [, , cmd, a, b] = process.argv;
const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
let out;
if (cmd === 'eval') {
  const body = readFileSync(a, 'utf8');
  out = await page.evaluate(`(async () => { ${body} })()`);
} else if (cmd === 'key') {
  for (let i = 0; i < Number(b ?? 1); i++) await page.keyboard.press(a);
  out = 'pressed';
} else if (cmd === 'upload') {
  await page.setInputFiles(a, b);
  out = 'uploaded';
} else if (cmd === 'click') {
  await page.getByRole('button', { name: a, exact: true }).click();
  out = 'clicked';
}
console.log(JSON.stringify(out, null, 1));
await browser.close().catch(() => {});
process.exit(0);
```

### `exe-ui.mjs`

```js
// Probe (gói D): small UI steps on the exe copy for the CloseGuard / reload checks.
// Usage: node exe-ui.mjs addTeam <name> | state [teamName] | reload | escape <n>
import { createRequire } from 'node:module';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const [, , cmd, arg] = process.argv;
const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
let out;
if (cmd === 'addTeam') {
  await page.evaluate(() => (location.hash = '#/team'));
  await page.getByRole('button', { name: '+ Team' }).click();
  await page.getByLabel('Tên team').fill(arg);
  await page.getByRole('button', { name: 'Tạo team' }).click();
  await page.waitForTimeout(1500);
  out = 'added';
} else if (cmd === 'state') {
  out = await page.evaluate((team) => {
    const dialogs = [...document.querySelectorAll('dialog')].map((d) => ({
      open: d.open,
      text: d.innerText.slice(0, 80),
    }));
    const alerts = [...document.querySelectorAll('[role=alert]')].map((a) => a.innerText.slice(0, 80));
    return {
      hash: location.hash,
      dialogs,
      alerts,
      teamShown: team ? document.body.innerText.includes(team) : undefined,
    };
  }, arg);
} else if (cmd === 'reload') {
  await page.evaluate(() => location.reload());
  await page.waitForTimeout(6000);
  out = 'reloaded';
} else if (cmd === 'escape') {
  for (let i = 0; i < Number(arg ?? 1); i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }
  out = 'escaped';
}
console.log(JSON.stringify(out));
await browser.close().catch(() => {});
process.exit(0);
```

### `ua.js`

```js
const d = document.querySelector('dialog');
let cancels = 0;
d?.addEventListener('cancel', (e) => { cancels++; window.__lastCancelable = e.cancelable; });
window.__cancelCount = () => cancels;
return { ua: navigator.userAgent, active: document.activeElement?.tagName + ' ' + (document.activeElement?.textContent ?? '').slice(0, 30), hasFocus: document.hasFocus() };
```

### `cancels.js`

```js
return { cancels: window.__cancelCount?.(), lastCancelable: window.__lastCancelable, open: document.querySelector('dialog')?.open };
```

### `f5.mjs`

```js
// Probe (gói D): does F5 / Ctrl+R (sent as key input through the debug port) reload the exe's
// page? Compares performance.timeOrigin before and after.
import { createRequire } from 'node:module';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
const origin = () => page.evaluate(() => performance.timeOrigin).catch(() => null);
const out = {};
for (const key of ['F5', 'Control+R']) {
  const before = await origin();
  await page.keyboard.press(key);
  await page.waitForTimeout(3000);
  const after = await origin();
  out[key] = { reloaded: before !== after, before, after };
}
console.log(JSON.stringify(out));
await browser.close().catch(() => {});
process.exit(0);
```

### `ipc-measure.mjs`

```js
// Probe (gói D): cost of one save of the whole file over Tauri IPC (`db_save`, raw body), as
// `tauri-storage.ts` sends it, measured inside the exe's WebView2. The bytes are the probe
// folder's own project2c.db, so every write leaves the same file.
// Usage: node ipc-measure.mjs [runs]
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const runs = Number(process.argv[2] ?? 15);
const file = 'C:/workspace/deep-review-1-4/claude/D/exe/Project2C-data/project2c.db';
const b64 = readFileSync(file).toString('base64');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
const result = await page.evaluate(
  async ({ b64, runs }) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const invoke = window.__TAURI_INTERNALS__.invoke;
    const times = [];
    for (let i = 0; i < runs; i++) {
      const start = performance.now();
      await invoke('db_save', bytes);
      times.push(performance.now() - start);
    }
    // A copy as `db.export()` would hand over (a fresh Uint8Array each time).
    const copies = [];
    for (let i = 0; i < runs; i++) {
      const start = performance.now();
      const copy = bytes.slice();
      copies.push(performance.now() - start);
      void copy;
    }
    const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
    return {
      bytes: bytes.byteLength,
      saveMs: times.map((x) => Math.round(x)),
      saveMedianMs: Math.round(median(times)),
      copyMedianMs: Math.round(median(copies) * 10) / 10,
    };
  },
  { b64, runs },
);
console.log(JSON.stringify(result));
await browser.close().catch(() => {});
process.exit(0);
```

### `ipc-block.mjs`

```js
// Probe (gói D): does one `db_save` over IPC block the page's main thread? A 4 ms timer runs
// while the save is in flight; the longest gap between its ticks is the longest freeze.
// Usage: node ipc-block.mjs [runs]
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const runs = Number(process.argv[2] ?? 5);
const file = 'C:/workspace/deep-review-1-4/claude/D/exe/Project2C-data/project2c.db';
const b64 = readFileSync(file).toString('base64');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
const result = await page.evaluate(
  async ({ b64, runs }) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const invoke = window.__TAURI_INTERNALS__.invoke;
    const out = [];
    for (let r = 0; r < runs; r++) {
      let last = performance.now();
      let maxGap = 0;
      const timer = setInterval(() => {
        const now = performance.now();
        maxGap = Math.max(maxGap, now - last);
        last = now;
      }, 4);
      const start = performance.now();
      // The synchronous part of invoke (until it hands back a promise).
      const pending = invoke('db_save', bytes);
      const syncMs = performance.now() - start;
      await pending;
      const totalMs = performance.now() - start;
      clearInterval(timer);
      out.push({ syncMs: Math.round(syncMs), totalMs: Math.round(totalMs), maxGapMs: Math.round(maxGap) });
    }
    return { bytes: bytes.byteLength, out };
  },
  { b64, runs },
);
console.log(JSON.stringify(result));
await browser.close().catch(() => {});
process.exit(0);
```

### `ipc-detached.mjs`

```js
// Probe (gói D): the same save measurement as ipc-block.mjs, but run while no debugger client
// is attached (Playwright's Network domain could slow a 9 MB request body). Phase "start" plants
// the bytes and a delayed run, then disconnects; phase "read" reconnects and prints the result.
// Usage: node ipc-detached.mjs start [runs] ; (wait) ; node ipc-detached.mjs read
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const [, , phase, runsArg] = process.argv;
const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
if (phase === 'start') {
  const file = 'C:/workspace/deep-review-1-4/claude/D/exe/Project2C-data/project2c.db';
  const b64 = readFileSync(file).toString('base64');
  await page.evaluate(
    ({ b64, runs }) => {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      window.__probe = { state: 'waiting' };
      setTimeout(async () => {
        const invoke = window.__TAURI_INTERNALS__.invoke;
        const out = [];
        for (let r = 0; r < runs; r++) {
          let last = performance.now();
          let maxGap = 0;
          const timer = setInterval(() => {
            const now = performance.now();
            maxGap = Math.max(maxGap, now - last);
            last = now;
          }, 4);
          const start = performance.now();
          const pending = invoke('db_save', bytes);
          const syncMs = performance.now() - start;
          await pending;
          const totalMs = performance.now() - start;
          clearInterval(timer);
          out.push({ syncMs: Math.round(syncMs), totalMs: Math.round(totalMs), maxGapMs: Math.round(maxGap) });
          await new Promise((r) => setTimeout(r, 100));
        }
        window.__probe = { state: 'done', bytes: bytes.byteLength, out };
      }, 4000);
    },
    { b64, runs: Number(runsArg ?? 10) },
  );
  console.log('planted');
} else {
  console.log(JSON.stringify(await page.evaluate(() => window.__probe)));
}
await browser.close().catch(() => {});
process.exit(0);
```

### `exe-import.mjs`

```js
// Probe (gói D): imports common\load\load-backup.json into the exe copy through Settings → Data,
// timing the read (file → confirmation dialog) and the replace (confirm → done message).
import { createRequire } from 'node:module';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
await page.evaluate(() => (location.hash = '#/settings'));
await page.waitForSelector('input[type=file]', { state: 'attached' });
let start = Date.now();
await page.setInputFiles('input[type=file]', 'C:/workspace/deep-review-1-4/common/load/load-backup.json');
await page.getByRole('dialog').waitFor();
const readMs = Date.now() - start;
const dialogText = await page.getByRole('dialog').innerText();
start = Date.now();
await page.getByRole('button', { name: 'Backup rồi thay dữ liệu' }).click();
await page.getByText('Đã nhập backup', { exact: false }).waitFor({ timeout: 60000 });
const replaceMs = Date.now() - start;
console.log(JSON.stringify({ readMs, replaceMs, dialogText }));
await browser.close().catch(() => {});
process.exit(0);
```

### `read-detached.mjs`

```js
// Probe (gói D): Settings → Nhập backup → reading load-backup.json in the exe, with no debugger
// attached. "start" plants the file text and, after a delay, feeds it to the page's file input
// (as a user's pick would) and records the time to the confirmation dialog and the longest
// main-thread freeze; "read" prints the record. The dialog is left open (Hủy closes it).
// Usage: node read-detached.mjs start ; (wait) ; node read-detached.mjs read
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const [, , phase] = process.argv;
const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
if (phase === 'start') {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  await page.evaluate(
    ({ text }) => {
      location.hash = '#/settings';
      window.__probe = { state: 'waiting' };
      setTimeout(() => {
        const input = document.querySelector('input[type=file]');
        let last = performance.now();
        let maxGap = 0;
        const timer = setInterval(() => {
          const now = performance.now();
          maxGap = Math.max(maxGap, now - last);
          last = now;
        }, 4);
        const start = performance.now();
        const done = () => {
          clearInterval(timer);
          window.__probe = {
            state: 'done',
            toDialogMs: Math.round(performance.now() - start),
            maxGapMs: Math.round(maxGap),
          };
        };
        new MutationObserver((_, observer) => {
          if (document.querySelector('dialog[open]')) {
            observer.disconnect();
            // The timer needs one more turn to see the last gap.
            setTimeout(done, 20);
          }
        }).observe(document.body, { subtree: true, childList: true, attributes: true });
        const dt = new DataTransfer();
        dt.items.add(new File([text], 'load-backup.json'));
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }, 4000);
    },
    { text },
  );
  console.log('planted');
} else {
  console.log(JSON.stringify(await page.evaluate(() => window.__probe)));
}
await browser.close().catch(() => {});
process.exit(0);
```

### `startup.mjs`

```js
// Probe (gói D): exe start with the load data — time from navigation start to the first screen
// (Tổng quan) having content, read from the page's own clock. Run right after starting the exe.
import { createRequire } from 'node:module';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

let browser;
for (let i = 0; i < 100 && !browser; i++) {
  try {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  } catch {
    await new Promise((r) => setTimeout(r, 100));
  }
}
const page = browser.contexts()[0].pages()[0];
await page.waitForFunction(() => document.querySelector('main section, main table, main [role=img]'), null, {
  timeout: 60000,
  polling: 10,
});
const result = await page.evaluate(() => ({
  firstScreenMs: Math.round(performance.now()),
  domContentLoadedMs: Math.round(performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd ?? -1),
  seedMeasure: performance.getEntriesByName('p2c:demo-seed').map((e) => Math.round(e.duration)),
  hash: location.hash,
}));
console.log(JSON.stringify(result));
await browser.close().catch(() => {});
process.exit(0);
```

### `perf-table.js`

```js
// Probe body (gói D, run by `node cdp.mjs eval perf-table.js` in the exe with the load data):
// times the customers table (DataTable, 1 496 rows) — switching to it, sorting by name, and a
// re-render caused by a write elsewhere — until the frame after the update has painted.
const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const timed = async (act) => {
  const start = performance.now();
  act();
  const sync = performance.now() - start;
  await frame();
  return { syncMs: Math.round(sync), toFrameMs: Math.round(performance.now() - start) };
};
location.hash = '#/customers';
await wait(1500);
const radio = (name) => [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.trim() === name);
const out = {};
// Kanban first, so the switch builds the table from nothing.
radio('Kanban')?.click();
await wait(800);
out.toTable = await timed(() => radio('Bảng').click());
out.rows = document.querySelectorAll('main table tbody tr').length;
out.domNodes = document.querySelectorAll('*').length;
const header = (text) => [...document.querySelectorAll('main table th button')].find((b) => b.textContent.startsWith(text));
const sorts = [];
for (let i = 0; i < 3; i++) {
  sorts.push(await timed(() => header('Họ tên').click()));
  await wait(300);
}
out.sortName = sorts;
const back = await timed(() => radio('Kanban').click());
out.toKanban = back;
return out;
```

### `perf-appts.js`

```js
// Probe body (gói D): the appointments list (DataTable) per period kind, load data in the exe.
const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const timed = async (act) => {
  const start = performance.now();
  act();
  await frame();
  return Math.round(performance.now() - start);
};
location.hash = '#/appointments';
await wait(2000);
const radio = (name) => [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.trim() === name);
const out = {};
for (const kind of ['Ngày', 'Tuần', 'Tháng', 'Năm']) {
  const ms = await timed(() => radio(kind)?.click());
  await wait(500);
  const tables = [...document.querySelectorAll('main table')].map((t) => ({
    label: t.getAttribute('aria-label'),
    rows: t.querySelectorAll('tbody tr').length,
  }));
  out[kind] = { ms, tables, domNodes: document.querySelectorAll('*').length };
}
const header = [...document.querySelectorAll('main table th button')][0];
if (header) {
  const sorts = [];
  for (let i = 0; i < 2; i++) {
    sorts.push(await timed(() => header.click()));
    await wait(300);
  }
  out.sortFirstColumn = { column: header.textContent, sorts };
}
radio('Tháng')?.click();
return out;
```

### `perf-select.js`

```js
// Probe body (gói D): in Lịch hẹn → kỳ Năm (7 071 rows), a click on a customer name in the list
// only selects that appointment (detail panel), yet every row of the DataTable renders again.
const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const timed = async (act) => {
  const start = performance.now();
  act();
  await frame();
  return Math.round(performance.now() - start);
};
location.hash = '#/appointments';
await wait(1500);
const radio = (name) => [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.trim() === name);
const out = {};
for (const kind of ['Tháng', 'Năm']) {
  radio(kind).click();
  await wait(1500);
  const buttons = [...document.querySelectorAll('main table tbody tr td:nth-child(3) button')];
  const clicks = [];
  for (const i of [3, 10, 20]) {
    clicks.push(await timed(() => buttons[i].click()));
    await wait(300);
  }
  out[kind] = { rows: buttons.length, selectMs: clicks };
}
radio('Tháng').click();
return out;
```

### `exe-write.mjs`

```js
// Probe (gói D): one real command in the exe with the load data — "Tạo lịch hẹn tiếp theo" from
// an appointment in Lịch hẹn, with the period on Tháng and on Năm — timed in the page from the
// click on "Tạo lịch hẹn" to the frame after the dialog is gone (run + re-read + re-render).
import { createRequire } from 'node:module';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
await page.evaluate(() => (location.hash = '#/appointments'));
await page.waitForTimeout(1500);
const out = {};
let day = 7;
for (const kind of ['Tháng', 'Năm', 'Tháng', 'Năm']) {
  await page.getByRole('radio', { name: kind, exact: true }).click();
  await page.waitForTimeout(1500);
  // A past appointment: the list is newest first, so take the last one.
  await page.locator('main table tbody tr td:nth-child(3) button').last().click();
  await page.getByRole('button', { name: 'Tạo lịch hẹn tiếp theo' }).click();
  await page.getByRole('dialog').waitFor();
  await page.getByLabel('Ngày (từ hôm nay trở đi)').fill(`${String(day++).padStart(2, '0')}/10/2026`);
  const triggers = page.getByRole('dialog').getByLabel('Trigger', { exact: false }).first();
  if ((await triggers.inputValue().catch(() => 'x')) === '') await triggers.selectOption({ index: 1 });
  const ms = await page.evaluate(async () => {
    const button = [...document.querySelectorAll('dialog button')].find((b) => b.textContent.trim() === 'Tạo lịch hẹn');
    const start = performance.now();
    button.click();
    while (document.querySelector('dialog[open]')) await new Promise((r) => setTimeout(r, 5));
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    return Math.round(performance.now() - start);
  });
  const rows = await page.locator('main table tbody tr').count();
  (out[kind] ??= []).push({ ms, rows });
}
console.log(JSON.stringify(out));
await browser.close().catch(() => {});
process.exit(0);
```

### `exe-write-detached.mjs`

```js
// Probe (gói D): as exe-write.mjs, but the timed click runs after the debugger client has
// disconnected (an attached client slows the IPC part of the save). Usage:
//   node exe-write-detached.mjs prep <Tháng|Năm> <dd>  — opens the dialog, plants the timed click
//   node exe-write-detached.mjs read                   — prints the planted result
import { createRequire } from 'node:module';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const [, , phase, kind, dd] = process.argv;
const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
const page = browser.contexts()[0].pages()[0];
if (phase === 'prep') {
  await page.evaluate(() => (location.hash = '#/appointments'));
  await page.waitForTimeout(1000);
  await page.getByRole('radio', { name: kind, exact: true }).click();
  await page.waitForTimeout(1500);
  await page.locator('main table tbody tr td:nth-child(3) button').last().click();
  await page.getByRole('button', { name: 'Tạo lịch hẹn tiếp theo' }).click();
  await page.getByRole('dialog').waitFor();
  await page.getByLabel('Ngày (từ hôm nay trở đi)').fill(`${dd}/10/2026`);
  await page.evaluate(() => {
    window.__probe = { state: 'waiting' };
    setTimeout(async () => {
      const button = [...document.querySelectorAll('dialog button')].find((b) => b.textContent.trim() === 'Tạo lịch hẹn');
      const start = performance.now();
      button.click();
      const clickMs = performance.now() - start;
      while (document.querySelector('dialog[open]')) await new Promise((r) => setTimeout(r, 5));
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      window.__probe = {
        state: 'done',
        clickMs: Math.round(clickMs),
        toFrameMs: Math.round(performance.now() - start),
        rows: document.querySelectorAll('main table tbody tr').length,
      };
    }, 3000);
  });
  console.log('planted');
} else {
  console.log(JSON.stringify(await page.evaluate(() => window.__probe)));
}
await browser.close().catch(() => {});
process.exit(0);
```

### `run-write-detached.ps1`

```powershell
$ErrorActionPreference = 'Stop'
# Runs exe-write-detached.mjs for Tháng and Năm, twice each, waiting for each planted click.
Set-Location $PSScriptRoot
$day = 11
foreach ($kind in 'Tháng', 'Năm', 'Tháng', 'Năm') {
  node exe-write-detached.mjs prep $kind $day
  if ($LASTEXITCODE -ne 0) { throw "prep failed" }
  $day++
  $deadline = (Get-Date).AddSeconds(20)
  do {
    Start-Sleep -Milliseconds 1500
    $r = node exe-write-detached.mjs read
  } until ($r -match '"done"' -or (Get-Date) -gt $deadline)
  "$kind $r"
}
```

### `detail-buttons.js`

```js
const heads = [...document.querySelectorAll('main h2, main h3')].map((h) => h.textContent.trim());
const buttons = [...document.querySelectorAll('main button')].map((b) => b.textContent.trim()).filter((s) => s && s.length < 40);
return { heads, buttons: [...new Set(buttons)].slice(0, 60) };
```

### `i18n-keys.mjs`

```js
// Probe (gói D): which keys of vi.ts are referenced from the app source, literally or through a
// template prefix (`t(\`screen.${...}\`)`). Read-only; run with `node i18n-keys.mjs`.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'C:/workspace/Project-2C-review';
const SRC = join(ROOT, 'apps/desktop/src');
const viText = readFileSync(join(SRC, 'i18n/vi.ts'), 'utf8');
const keys = [...viText.matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1]);

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('vi.ts')) files.push(path);
  }
};
walk(SRC);
// e2e reads labels too, but a key used only by e2e is still dead in the product.
const sources = files
  .filter((f) => !/\.test\.tsx?$/.test(f))
  .map((f) => ({ f: relative(ROOT, f), text: readFileSync(f, 'utf8') }));
const all = sources.map((s) => s.text).join('\n');

// Template prefixes: `xxx.${` inside backticks.
const prefixes = new Set(
  [...all.matchAll(/`([a-zA-Z][\w.]*\.)\$\{/g)].map((m) => m[1]),
);
// Keys built by string concatenation 'xxx.' + ...
for (const m of all.matchAll(/'([a-zA-Z][\w.]*\.)'\s*\+/g)) prefixes.add(m[1]);

const unused = [];
const viaPrefix = [];
for (const key of keys) {
  if (all.includes(`'${key}'`) || all.includes(`"${key}"`) || all.includes(`\`${key}\``)) continue;
  const prefix = [...prefixes].find((p) => key.startsWith(p));
  if (prefix) viaPrefix.push(`${key}  (via ${prefix})`);
  else unused.push(key);
}
console.log(`keys: ${keys.length}, duplicates: ${keys.length - new Set(keys).size}`);
console.log(`prefixes: ${[...prefixes].sort().join(' ')}`);
console.log(`\nunused (${unused.length}):\n  ${unused.join('\n  ')}`);
console.log(`\nonly via prefix (${viaPrefix.length}) — first 200:\n  ${viaPrefix.slice(0, 200).join('\n  ')}`);

// Keys referenced in code but missing from vi (typecheck catches t(); this catches strings).
const referenced = new Set(
  [...all.matchAll(/\bt\(\s*'([^']+)'/g)].map((m) => m[1]),
);
const missing = [...referenced].filter((k) => !keys.includes(k));
console.log(`\nt('…') keys missing from vi: ${missing.join(', ') || 'none'}`);
```

### `exports.mjs`

```js
// Probe (gói D, trục B): exports of the D-scope files and where they are used outside their own
// file — in product code (not *.test.*) and in tests. Read-only.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'C:/workspace/Project-2C-review';
const SCOPE = ['packages/ui/src', 'apps/desktop/src/shell', 'apps/desktop/src/data', 'apps/desktop/src/i18n'];
const SEARCH = ['apps/desktop/src', 'packages', 'e2e', 'tools'];
const files = (dir) =>
  readdirSync(join(ROOT, dir)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    if (name === 'node_modules' || name === 'dist') return [];
    return statSync(join(ROOT, rel)).isDirectory() ? files(rel) : /\.(ts|tsx|mjs)$/.test(name) ? [rel] : [];
  });
const all = SEARCH.flatMap(files).map((f) => ({ f, text: readFileSync(join(ROOT, f), 'utf8') }));
const isTest = (f) => /\.test\.|^e2e\//.test(f);

for (const file of SCOPE.flatMap(files).filter((f) => !isTest(f) && /\.tsx?$/.test(f))) {
  const text = readFileSync(join(ROOT, file), 'utf8');
  const names = [
    ...text.matchAll(/^export (?:async )?(?:function|const|class|interface|type|let)\s+(\w+)/gm),
  ].map((m) => m[1]);
  for (const name of names) {
    const re = new RegExp(`\\b${name}\\b`);
    const users = all.filter(({ f, text: t }) => f !== file && re.test(t));
    const product = users.filter(({ f }) => !isTest(f) && !f.endsWith('/index.ts'));
    const viaIndex = users.some(({ f }) => f.endsWith('packages/ui/src/index.ts'));
    const tests = users.filter(({ f }) => isTest(f));
    // Used only inside its own file counts too (an export that need not be one).
    const selfUses = (text.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length - 1;
    if (product.length === 0) {
      console.log(
        `${file}  ${name}  product=0${viaIndex ? ' (re-exported by ui index)' : ''} tests=${tests.length} selfUses=${selfUses}`,
      );
    }
  }
}
```

### `contrast.mjs`

```js
// Probe (gói D, trục A): WCAG contrast of the text / background pairs the D-scope components
// and shell use (tokens.css values; rgba backgrounds composited over the surface below them).
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = ([r, g, b, a], base) => base.map((c, i) => Math.round([r, g, b][i] * a + c * (1 - a)));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const T = {
  bg0: hex('#0b1017'), bg1: hex('#111822'), bg2: hex('#18212d'), bg3: hex('#212c3a'),
  text: hex('#e8edf4'), text2: hex('#aeb9c8'), text3: hex('#8c99ac'), accent: hex('#d9b26a'),
  onAccent: hex('#0b1017'), danger: hex('#f07e7e'), warn: hex('#f0a04b'), ok: hex('#3fd69a'),
  dateToday: hex('#9be8c0'), n4: hex('#94a3b8'), lost: hex('#f07e7e'), borderStrong: hex('#34425a'),
};
const accentSoftOn1 = over([217, 178, 106, 0.14], T.bg1);
const pastBg = over([240, 210, 110, 0.2], T.bg1);
const todayBg = over([63, 214, 154, 0.2], T.bg1);
const futureBg = over([111, 168, 255, 0.22], T.bg1);
const pairs = [
  ['text-fg-3 on surface-1 (sidebar group label, RePicker hint)', T.text3, T.bg1],
  ['text-fg-3 on surface-2 (Segmented off, RePicker chip count)', T.text3, T.bg2],
  ['text-fg-3 on surface-3 (row hover / segmented checked)', T.text3, T.bg3],
  ['text-fg-2 on surface-2 (chip off)', T.text2, T.bg2],
  ['text-accent on accent-soft (sidebar active, chip on)', T.accent, accentSoftOn1],
  ['text-on-accent on danger (danger Button)', T.onAccent, T.danger],
  ['text-on-accent on accent (primary Button)', T.onAccent, T.accent],
  ['text-danger on surface-1 (Dialog error, ErrorBoundary title)', T.danger, T.bg1],
  ['text-warn on surface-0 (SaveWarning)', T.warn, T.bg0],
  ['text-fg on date-past-bg (list date cell)', T.text, pastBg],
  ['text-fg on date-today-bg', T.text, todayBg],
  ['text-fg on date-future-bg', T.text, futureBg],
  ['sort arrow ↕ text-border-strong on surface-1 (KNOWN R4)', T.borderStrong, T.bg1],
];
for (const [name, fg, bg] of pairs) console.log(`${String(ratio(fg, bg)).padStart(5)}  ${name}`);
```

### `build-report.mjs`

```js
// Assembles claude\D.md: the report body, the mutation table, the probe results and every probe
// source, so the appendix always matches the files that produced the numbers.
import { readFileSync, writeFileSync } from 'node:fs';

const HERE = 'C:/workspace/deep-review-1-4/claude/D';
const read = (f) => readFileSync(`${HERE}/${f}`, 'utf8').replaceAll('\r\n', '\n');
const results = JSON.parse(read('mutate-results-merged.json'));
const mutateSrc = read('mutate.mjs');
const rows = [...mutateSrc.matchAll(/^\s*\['([^']+)', `\$\{(\w)\}([^`]+)`/gm)].map((m) => {
  const [name, dir, rest] = [m[1], m[2], m[3]];
  const base = { D: 'data/', S: 'shell/', I: 'i18n/', U: 'ui/' }[dir];
  const r = results[name] ?? { verdict: '?', failing: '' };
  const id = name.split(' ')[0];
  const what = name.slice(id.length + 1);
  return `| ${id} | ${base}${rest} | ${what} | ${r.verdict} | ${r.failing ? r.failing.replace(/^.*?\.test\.ts > /, '') : ''} |`;
});
const tally = Object.values(results).reduce((t, r) => ({ ...t, [r.verdict]: (t[r.verdict] ?? 0) + 1 }), {});

const sources = [
  ['mutate.mjs', 'js'],
  ['vitest.mut.config.mts', 'ts'],
  ['vitest.probe.config.mts', 'ts'],
  ['probe/persist-flush.test.ts', 'ts'],
  ['cdp.mjs', 'js'],
  ['exe-ui.mjs', 'js'],
  ['ua.js', 'js'],
  ['cancels.js', 'js'],
  ['f5.mjs', 'js'],
  ['ipc-measure.mjs', 'js'],
  ['ipc-block.mjs', 'js'],
  ['ipc-detached.mjs', 'js'],
  ['exe-import.mjs', 'js'],
  ['read-detached.mjs', 'js'],
  ['startup.mjs', 'js'],
  ['perf-table.js', 'js'],
  ['perf-appts.js', 'js'],
  ['perf-select.js', 'js'],
  ['exe-write.mjs', 'js'],
  ['exe-write-detached.mjs', 'js'],
  ['run-write-detached.ps1', 'powershell'],
  ['detail-buttons.js', 'js'],
  ['i18n-keys.mjs', 'js'],
  ['exports.mjs', 'js'],
  ['contrast.mjs', 'js'],
  ['build-report.mjs', 'js'],
];

let out = read('D.body.md').trimEnd();
out += `\n\n## Phụ lục A — Kết quả mutation (\`mutate-results-merged.json\`)\n\n`;
out += `Mỗi lượt phục vụ đúng một file đã đổi qua plugin \`load\` của Vite (repo không bị ghi), chạy 121 test của phạm vi D (\`--bail=1\`). Tổng: ${JSON.stringify(tally)}.\n\n`;
out += `| ID | File | Thay đổi | Kết quả | Test bắt được |\n|---|---|---|---|---|\n${rows.join('\n')}\n`;
out += `\n## Phụ lục B — Kết quả probe (\`probe-results.log\`)\n\n\`\`\`\n${read('probe-results.log').trimEnd()}\n\`\`\`\n`;
out += `\n## Phụ lục C — Nguồn test tạm / probe\n\nTất cả nằm ở \`C:\\workspace\\deep-review-1-4\\claude\\D\\\`; exe là bản \`pnpm build:exe\` tại \`f0c53eb\` chép sang \`D\\exe\\\` (dữ liệu probe ở \`D\\exe\\Project2C-data\\\`).\n`;
for (const [file, lang] of sources) out += `\n### \`${file}\`\n\n\`\`\`${lang}\n${read(file).trimEnd()}\n\`\`\`\n`;
writeFileSync('C:/workspace/deep-review-1-4/claude/D.md', out);
console.log(`D.md: ${out.length} chars, ${rows.length} mutation rows, tally ${JSON.stringify(tally)}`);
```
