XONG — deepseek gói D lượt 4, 2026-10-30 21:27 (+07:00)

# DeepSeek — gói D (Màn nhập liệu) — lượt 4

## 1. Bên, gói, SHA, trạng thái, giờ, công cụ

- Bên: `deepseek` (`<ID>` = DSR4). Gói **D — Màn nhập liệu**.
- Repo: `C:\workspace\Project-2C-review`, worktree detached.
- SHA đầu phiên (`git rev-parse HEAD`): `2e51e25eb0125f56d3d938b97ef18d6873dae076` — khớp SHA ghim `2e51e25`.
- `git status --short` đầu phiên: **rỗng** (không có dòng nào). Cuối phiên: **rỗng** (phụ lục 9).
- Giờ bắt đầu: 2026-10-30 20:58 (+07:00).
- App / model / mức suy luận: **WorkBuddy v5.9.3** (`common\baseline.md`, đợt 2 bước 4), model **DeepSeek V4.1 Flash**, context **1M**, mức suy luận **cao nhất** (Thinking effort Max, chọn tay ở bộ chọn model của task). Không bật Memory (Cloud memory tắt, Local memory and skills tắt), Agent team management: Disable, Economy mode tắt.
- Phiên này là **phiên mới**: chưa có `D.md` trước đó; A, B, C đều `XONG`.
- Ngoại lệ của Owner cho quy tắc riêng 4 (tin nhắn mở phiên): được dùng agent phụ và Code review expert của app. Phiên này **không giao việc cho agent phụ** và **không mở task expert riêng** — mọi lệnh chạy trong phiên chính; lý do ở mục 8 (trục S). Quy tắc riêng 2 (thư mục cấm) giữ nguyên: phiên này **không** mở, không liệt kê, không tìm kiếm trong `claude\`, `codex\`, `-r3\`, `-r2\`, `-r1\`, `Project-2C-review-2\`; không lệnh nào chạm `C:\workspace\` ngoài đường dẫn tuyệt đối của repo, `…-r4\common\`, `…-r4\deepseek\`.

## 2. Bảng R1 / R2

### 2.1 Bảng R1 — theo mã (12 dòng gói D)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-109 | #721 → #738 | **ĐÃ SỬA** | `CustomerDialogs.tsx:233-244`: `profile = { name, … }` gửi `name` **nguyên chữ**; `KycDialogs.tsx:267`: `{ text, date, facts, material }` gửi `text` nguyên chữ. e2e `e2e/customer-forms.spec.ts:364` "refuses a name broken in a paste as the command does, then saves one as typed (5a)" — qua ở SHA ghim (69/69 + 25/25 ca của 9 spec D, phụ lục 9.1). Đột biến: `name` → `normalizeText(name)` ⇒ **1 failed** (`customer-forms.spec.ts`, `toContainText('Chữ có ký tự không lưu được')`), file trả nguyên byte | 7a: `e2e/customer-kyc.spec.ts:421` dán `'\uD83D\u{200B}\uDE00 Lan'` vào ghi chú. 5c dùng chung `profile` với 5a nên cùng một đường |
| DR6-110 | #721 → #738 | **ĐÃ SỬA** (phần D) | `customers-view.ts:161` `const clean = normalizeText(text);` trước `parseQuickDate`. Unit `customers-view.test.ts:293-303` (U+200B, U+2060, U+0085, U+FEFF, U+0007) — qua. Đột biến: bỏ `normalizeText` ⇒ **2 failed** (hai ca `parseBirthDate`), file trả nguyên byte | `parseRecordDate` (5d, 5a) đọc qua `parseQuickDate` của `domain` (gói A). `kycAmountRead` → `parseVnd` cũng trên chữ đã chuẩn hóa (T-297) |
| DR6-115 | #723 → #744 (+ #788 → #841) | **ĐÃ SỬA** | `team-view.ts:113-144` `inUseHelp`: câu theo vai trò, rồi câu Thùng rác (`person.inUseTrash` / `person.inUseSupportTrash`), tên 3 KH đầu + đếm phần còn lại. Unit `team-view.test.ts:109-180` (13 ca). Đột biến: câu hỗ trợ → câu RE + `NAMED_IN_TRASH` 3 → 1 ⇒ **3 failed**, file trả nguyên byte | e2e `team.spec.ts:493` "an RE and an IS kept only by a customer in the trash: 9b counts it as the delete does and names it (T-250)" — qua |
| DR6-116 | #723 → #744 (+ #788 → #841) | **ĐÃ SỬA** | `TeamScreen.tsx:35-45` `cardTitleOf` (xóa team → tiêu đề danh sách; xóa/đổi nhân sự → thẻ thành viên hay "Người hỗ trợ"), `:293` `key={entry.team.id}` cho phần đầu thẻ. e2e `team.spec.ts:761` (Xóa team → focus về danh sách) + `:658`, `:696` — qua. Đột biến: `case 'delete'` → `MEMBERS_TITLE` ⇒ **1 failed** (`toBeFocused`), file trả nguyên byte | Biến thể còn hở: `addPerson` khi **chưa có team nào** → `cardTitleOf` trả `MEMBERS_TITLE`, nhưng màn không có thẻ thành viên ⇒ focus về `body`. Chưa gây được bằng UI (màn Team rỗng vẫn có nút "+ Thêm" với `teamId` undefined). Ghi ở mục 8, không thành phát hiện |
| DR6-117 | #724 → #746 | **ĐÃ SỬA** | `wrap-anywhere`: `CustomerProfile.tsx:158` (tên KH), `CustomerKyc.tsx:94` (giá trị dữ kiện), `:318` (dòng cuộc gặp), `CustomerAppointments.tsx:142` (ghi chú), `KycDialogs.tsx:121`, `:331`. e2e `customer-kyc.spec.ts:114` (link 108 ký tự ở 1440 **và** 1100, đo `sideways(page) = false`) + `:201` (tên 81 chữ) — qua | Đo trên bản build web: `document.scrollWidth = clientWidth = 1100` ở 1100×700 trên hồ sơ KH |
| DR6-120 | #726 → #750, #752 → #764 (+ #782 → #807, #783 → #817) | **ĐÃ SỬA** (phần D; phần Rust ở gói B) | `SaveWarning.tsx:12-20` `SAVE_FAILED` đủ 4 nguyên nhân (`diskFull`, `readOnly`, `folderReadOnly`, `other`); `SaveWarning.test.tsx` 5 ca (mỗi câu một ca, DR6-120 ở `:24` và `:33`). Đột biến: `folderReadOnly.banner` → `storage.saveFailed` ⇒ **1 failed**, file trả nguyên byte | e2e `save-state.spec.ts:56` (DISK_FULL) + `:97` (đổi nguyên nhân giữa hai lần Thử lại) — qua |
| DR6-127 | #724 → #746 | **ĐÃ SỬA** | Cùng ca `customer-kyc.spec.ts:114`: dòng thời gian phải có **2** chỗ chứa link (ghi chú KYC + dòng cuộc gặp), thẻ Lịch hẹn 1 chỗ. Đột biến: bỏ `wrap-anywhere` ở `CustomerKyc.tsx:318` ⇒ **1 failed** (ca đó), file trả nguyên byte | Ca ghi rõ "DR6-117, DR6-127" ở comment `:112` |
| DR6-132 (a) | #729 → #755 (+ #756 → #758) | **ĐÃ SỬA** (dòng tài liệu) | `docs/design/mockups/kyc-forms.html:134` và `docs/design/phase-3-du-lieu.md:19` (§D4) nay nêu ngoại lệ "dọn sạch Thùng rác xóa hẳn KH đã xóa (TR-11)"; `phase-5-ai.md`, `05-ho-so-kh.md` không còn câu "không bao giờ xóa" (grep 0 dòng). App khớp: 5f chỉ ghi **số** ghi chú (`customerDelete.kyc`) và câu xóa mềm (`customerDelete.soft`), không hứa "không bao giờ xóa" | Dòng tài liệu, không phải mã — kiểm bằng grep + đọc 5f |
| DR6-37 | #655 → #693 (một phần), #790 → #845 | **ĐÃ SỬA** | `token-guard.ts:53-85` (`findHardcodedSeparators`) + `check-tokens.ts:26-30` chạy trong `pnpm lint:tokens`. `grep -rn "[✓○×▾▸—]"` ngoài `vi.ts` và ngoài file test: chỉ còn **comment** (`outcome-form.ts:89`, `ai-panel-view.ts:460`, `CustomerKyc.tsx:250`…), không có chuỗi nào. `join(', ')` / `join('; ')`: **0** | Ký hiệu nay là khóa `vi.ts` (`kyc.mark.*`, `appointmentForm.coordinatorRemoveMark`, `overview.compare.expanded/collapsed`). Lỗ của chính hàm này: **DSR4-D1** |
| DR6-66 | #775 → #801, #777 → #812, #790 → #845 | **ĐÃ SỬA** (phần D) | `tsc --noEmit` (đã bật `noUnusedLocals` / `noUnusedParameters` trong `tsconfig.base.json`) sạch ở cổng bước chuẩn bị; các export mà Issue nêu (helper badge thứ hai, `BADGE` export từ `CustomerKyc`, `CARD_TITLE`) không còn — `grep` chỉ thấy `classes.ts` | Quét thêm (phụ lục 9.3): 4 export **mới** chỉ test dùng (`SaveStateLine`, `SaveFailed`, `CloseDialog`, `StageHead`) + `stageSince`, `COUNT_SLOTS`, `compareCells` — cùng dạng DR6-66 nhưng không đo được chi phí; ghi ở mục 8 (trục B), không thành phát hiện |
| DR6-67 | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | **ĐÃ SỬA** (phần D) | `classes.ts` một nơi: `FOCUS` (26 chỗ dùng), `CARD` (21), `SETTINGS_SECTION` (10), `PANEL` (7), `HEADING` (37), `BADGE` (21), `ALERT` (66), `LINK` (32). `grep "m-0 text-sm font-medium text-heading"` → **chỉ** `classes.ts:20`; `grep "rounded-full border border-current px-2 py-0.5 text-xs font-semibold"` → `classes.ts:27` + `StageBadge` / `PolicyBadge` của `packages/ui` (ui không import được app — có ghi trong JSDoc) | `stageBadge` (`stage-badge.tsx:9`) là helper duy nhất vẽ `StageBadge` trong app (T-310) |
| CL3-B2 | #783 → #817 | **ĐÃ SỬA** | `SaveWarning.tsx:28-43`: nút "Thử lại" gọi `saves.flush()`, xong thì đưa focus về `heading` nếu focus còn ở nút hay `body`. e2e `save-state.spec.ts:78` kiểm cả chuỗi: Nạp lại bị từ chối kèm câu "Bấm "Thử lại"…", Thử lại lỗi lại (đổi nguyên nhân), rồi Thử lại thành công → dải mất, `saveState` = "Đã lưu 09:3x", **`h1` "Cài đặt" có focus** — qua. Đột biến: nhãn nút → `'Lưu lại'` ⇒ **1 failed**, file trả nguyên byte | KNOWN #96. Câu từ chối D7 của Nạp lại / Nhập backup / Dọn sạch có vế "Thử lại" (`vi.ts:1140`, `:1173`, `:367`) |

### 2.2 Bảng R2 — theo Issue (16 dòng gói D)

| Issue | Mục tiêu / test chấp nhận | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| #735 T-280 | Thanh trên cùng không che phần tử nhận focus (WCAG 2.4.11), 1 100 và 1 440 | **ĐÃ SỬA** | `index.css:13-20`: `main :not(dialog, dialog *) { scroll-margin-top: --spacing(20) }`, `main h2:not(dialog *) { --spacing(21) }`. `e2e/topbar-focus.spec.ts` **9/9** qua ở SHA ghim. Đột biến: `--spacing(20)` → `0px` ⇒ **2 failed** (ca "what scrolls into view keeps the height of the bar…" và "Shift+Tab to a link … under the bar brings it out"); luật `h2` còn nên 3 ca tiêu đề vẫn xanh — đúng phạm vi đột biến | Đo trên bản build web (1440×900): tiêu đề `#kyc-facts` sau `scrollIntoView` ở **84 px**, đáy thanh **59 px** ⇒ hở 25 px; `scrollMarginTop` tính được = `84px` |
| #773 T-284 | Token `--border-control` cho viền ô nhập, ô ngày Tùy chọn, mũi tên sắp xếp chưa chọn | **ĐÃ SỬA** (phần D) | `tokens.css:14` `--border-control: #687890`; dùng ở `TextField.tsx:89`, `SelectField.tsx:64`, `PeriodPicker.tsx` (ô ngày), `DataTable.tsx:186` (mũi tên ↕ chưa chọn). Hai ô tự viết ngoài `packages/ui` (Thùng rác, ChatGPT web) thuộc E / C | Lệch còn lại của cùng họ "viền điều khiển": ô chọn `Choices` dùng `--border` trong khi mockup `.choice` dùng `--border-strong` ⇒ **DSR4-D2** |
| #776 T-287 | `db`: tham chiếu nhân sự, Thùng rác / Dọn sạch, đếm RF, seed (phần D: chữ và hợp đồng badge) | **ĐÃ SỬA** (phần D) | `vi.ts:376-381`: `trash.restoreLabel.*` nhận `{record}` + `trash.restoreLabel.ofCustomer`; `trash.customer.with` đổi `{count}` → `{kycNotes}`, và `COUNT_SLOTS` (`i18n/index.ts:22`) có `kycNotes` nên vẫn nhóm nghìn. `stageBadge(stage, label = t(...))` (`stage-badge.tsx:9`) cho ô "Bản ghi" truyền chữ của `recordBadge` | Phần `db` (danh sách tham chiếu, chỉ mục `0012`) ở gói A; `recordBadge` ở E |
| #780 T-291 | Bảy luật duyệt 23/10 (phần D: ô ngày nhanh, chữ gửi lệnh) | **ĐÃ SỬA** (phần D) | 5a / 5c / 7a gửi chữ nguyên (DR6-109, đột biến đỏ). Ô ngày của 5a / 5c / 5d / 7a: `useDateField` → `parseRecordDate` báo `future` cho ngày sau hôm nay, **không** gợi ý năm trước — đúng nhóm "ô chỉ nhận ngày đã qua" của ADR-0007 phụ lục (đã kiểm ở `fixes.md` §T-291, dòng "đã kiểm trên code") | Luật 5 (gợi ý năm trước) chỉ có ở 6b / 6e (E). `{count}` của TOO_LONG ở C |
| #782 T-293 | Tiêu đề cửa sổ theo màn (quyền `core:window:allow-set-title`) | **ĐÃ SỬA** (phần D) | `AppShell.tsx:26-30`: `document.title` + `void appWindow?.setTitle(title)`; `AppWindow.setTitle` khai ở `CloseGuard.tsx:16`. e2e `navigation.spec.ts:126-137` so `titleBar` của exe sau mỗi màn — qua. Đột biến: bỏ `setTitle` ⇒ **1 failed** ("the exe gives its title bar the page's title") | Quyền trong `capabilities/default.json` (K37) ở gói B |
| #783 T-294 | Chỉ báo lưu 10d ở chân sidebar, nút Thử lại, đóng app khi đang lưu | **ĐÃ SỬA** (phần D) | `Sidebar.tsx:70-95` (`SaveStateLine`, `WEB_MODE`, thứ tự saving > failed > saved/savedAt); `SaveWarning.tsx`. `e2e/save-state.spec.ts` **5/5** qua (Đã lưu HH:MM / Đang lưu… / Chưa lưu được vào file / bản web / Thử lại / đóng khi đang lưu). Unit `Sidebar.test.tsx` 5 ca, `SaveWarning.test.tsx` 5 ca | Hai điểm mockup không vẽ (Thử lại lỗi lại không đổi gì; "Đã lưu HH:MM" không ngày) = ACCEPTED review #817, KNOWN |
| #786 T-297 | Dòng thời gian theo mockup (bộ lọc, mã F); lỗi AI giữ khi đổi màn | **ĐÃ SỬA** (phần D) | `CustomerKyc.tsx:286-291` `Segmented` "Lọc dòng thời gian"; `:296` `hidden={!shown(event)}`; `kyc-view.ts:181-185` `inTimelineFilter`; `VersionLines` `:236-245` "+ F… · kyc vN". Unit `kyc-view.test.ts:405-430`; e2e `customer-kyc.spec.ts` ca bộ lọc — qua. Đột biến (2): `hidden={false}` ⇒ **1 failed**; `inTimelineFilter('KYC')` → `true` ⇒ **1 failed** (unit) | Đo trên hồ sơ thật: 6 mục, KYC ẩn 3, Lịch hẹn ẩn 5, Tất cả ẩn 0; `hidden` cho `display:none`, cao 0 px (preflight Tailwind 4) |
| #787 T-298 | 5d "· hạ nhóm / lên nhóm"; thẻ Lịch hẹn một dòng ở 1 440; `stageSince` | **ĐÃ SỬA** (phần D) | `customers-view.ts:79-82` `stageDirection`; `CustomerDialogs.tsx:515-520` dòng "Sau khi lưu"; `CustomerAppointments.tsx:88-161` cột `w-21` / `w-30` / `w-14`, `fixed`, `compact`. Unit `customers-view.test.ts` (`stageDirection`, `profileSince`); e2e `customer-appointments.spec.ts` (1 440 một dòng) **qua**; `customer-forms.spec.ts` 5d **qua**. Đột biến: `stageDirection` → `null` ⇒ **1 failed** | Đo: hồ sơ 1 440 → 3 cột 376 px; 1 100 → 2 cột 402 px |
| #788 T-299 | Bảng thành viên giữ cách sắp khi đổi team; `resetKey`; hộp nhân sự hỏi trước khi xóa | **ĐÃ SỬA** (phần D) | `TeamScreen.tsx:322-333`: bảng **không** dựng lại theo team (`key` chỉ ở phần đầu thẻ `:293`), `resetKey={entry.team.id}` đưa team khác về 100 dòng; `PersonDialogs.tsx:126-141` hỏi trước khi xóa khi có thay đổi chưa lưu. e2e `team.spec.ts:717` (giữ cách sắp), `:745` (focus "Sửa <tên>"), `:246` (Xóa nhân sự hỏi trước) — qua. Đột biến: bỏ `resetKey` ⇒ **1 failed** ("another team shows its first 100 RE again", 111 dòng) | `PeriodPicker` (D): e2e `period-picker.spec.ts` **12/12** qua, gồm ca "refused once the focus leaves both date fields, not on Tab between them" |
| #789 T-300 | Token tương phản, `DataTable` (tách logic thuần), token-guard, ngưỡng nhánh, favicon | **ĐÃ SỬA** (phần D) | `table-view.ts` (thuần, 6 ca unit) + `DataTable.tsx:148-153`; `sortable: false` / `headerHidden` có test; mũi tên ↕ dùng `text-border-control`. Đột biến: `sorts()` → `true` ⇒ **3 failed** (3 ca `table-view.test.ts`), file trả nguyên byte | `token-guard`: luật mới chạy, nhưng có lỗ ⇒ **DSR4-D1**. Favicon / thanh trên cùng: xem T-280 |
| #790 T-301 | Dọn app: mã chết, hằng lặp, ký hiệu viết cứng | **ĐÃ SỬA** (phần D) | `classes.ts` (8 hằng, dùng 7–66 chỗ); ký hiệu ở `vi.ts`; `tsc` sạch (`noUnusedLocals`) | 4 export mới chỉ test dùng — mục 8 (trục B) |
| #797 T-303 | G3: mockup ô khóa, câu ngoài phạm vi của token viền | **ĐÃ SỬA** (dòng mockup) | `docs/design/mockups/appointment-forms.html` 6f `.input.locked` viền đứt `--border-strong`; app `LOCKED` (`appointments-view.ts`, gói E) dùng `border-dashed border-border-strong`; K36 ghi rõ WCAG 1.4.11 không đòi 3:1 cho thành phần không thao tác được | Dòng mockup; ô khóa thuộc E |
| #849 T-305 | `HEADING` / `BADGE` về `classes.ts`, `recordBadge`, `WEB_MODE.tone` | **ĐÃ SỬA** (phần D) | `classes.ts:20`, `:27`; `Sidebar.tsx:83` `WEB_MODE` có `tone`, `SettingsDataFile.tsx` (E) dùng `WEB_MODE.tone` (grep). `grep` hai chuỗi gốc: chỉ `classes.ts` (+ `StageBadge` / `PolicyBadge` của ui, có lý do) | Đồng hồ bộ chụp ảnh (F) |
| #852 T-308 | Khối logo, font slogan, icon, tiêu đề | **ĐÃ SỬA** (phần D) | `Brand.tsx` (3 ảnh `role="img"` tên `Heritas L-CRM`, slogan `<p lang="en">`), `theme.css` `@utility brand-slogan` (Playfair Display nghiêng 400, 13 px, `--brand-slogan`), `fonts.css` face cục bộ, `tokens.css:37-38`. e2e `theme.spec.ts:72` (font, `lang`, màu), `smoke.spec.ts:8`, `navigation.spec.ts:30` (logo trong khung ở cửa sổ nhỏ nhất) — qua. Đột biến: `aria-label` → `"Logo"` ⇒ **3 failed** (smoke + 2 ca navigation) | Đo 1 100×700: khối logo 142 px, nav 263 px, dòng lưu 49 px, không chồng nhau, không cuộn ngang (`scrollWidth = clientWidth = 1100`) |
| #865 T-310 | `stageBadge(label)`, `lang="en"`, `HEADING` còn sót, tên app một nguồn, `PACKAGES` | **ĐÃ SỬA** (phần D) | `stage-badge.tsx:9` có `label?`; `Brand.tsx:27` `lang="en"`; 4 tiêu đề dùng `HEADING` (grep chỉ còn `classes.ts`); `tauri-contract.test.ts` ca "names the app…" — đột biến `<title>` → `Heritas X-CRM` ⇒ **1 failed**, file trả nguyên byte | `PACKAGES` (F): `size-report` không còn dòng "Chưa xếp gói", D = 7 999 SP / 2 820 test / 87 file |
| #866 T-311 | Mục sổ phần tài liệu (dòng `.brand`, luật đếm) | **ĐÃ SỬA** (dòng tài liệu) | `docs/testing/nghiem-thu-v1.md:72` NT-CH-09 tả khối `.brand` + "cửa sổ nhỏ nhất (1 100 × 700) vẫn thấy mục Cài đặt và dòng trạng thái lưu mà không cuộn"; `:432-446` bảng "Đối chiếu mockup → mã dòng" có `.brand` → CH-09 ở cả 6 mockup. Đo lại ở 1 100×700: **đúng** (nav đáy 342, dòng lưu 651–700) | Dòng tài liệu; phần `phase-6.md` ở F |

## 3. Phạm vi đã đọc

**Mã nguồn gói D** (đọc trọn, ở `2e51e25`):

- `packages/ui/src/`: `components/{Button,Chart,Choices,DataTable,Dialog,NavIcon,PeriodPicker,PolicyBadge,Segmented,SelectField,StageBadge,TextField,compare-cells,dialog-focus,field-notes,show-more,table-view,chart-theme}.tsx|ts`, `tokens.css` (76), `theme.css` (98), `fonts.css` (153), `index.ts`, `token-guard.ts` (85).
- `apps/desktop/src/shell/`: `AppShell.tsx` (99), `Brand.tsx` (32), `Sidebar.tsx` (95), `SaveWarning.tsx` (64), `CloseGuard.tsx` (98), `close-guard.ts` (36), `ErrorBoundary.tsx` (49), `ScopePicker.tsx` (61), `RePicker.tsx` (88), `ScopeContext.tsx` (24), `StartupError.tsx` (18), `routes.ts` (77), `scope.ts` (75), `useRoute.ts` (45), `block-reload.ts` (62), `screen-error.ts`, `startup-error.ts`.
- `apps/desktop/src/i18n/`: `index.ts` (70), `vi.ts` (1 376 — đọc phần D và toàn bộ diff).
- `apps/desktop/src/routes/customers/` (trừ file AI và Hợp đồng): `CustomerProfile.tsx` (305), `CustomersScreen.tsx` (302), `CustomerDialogs.tsx` (523), `CustomerKyc.tsx` (348), `CustomerAppointments.tsx` (193), `KycDialogs.tsx` (554), `customers-view.ts` (204), `kyc-view.ts` (392) + các file test.
- `apps/desktop/src/routes/team/`: `TeamScreen.tsx` (337), `PersonDialogs.tsx` (245), `TeamDialogs.tsx` (101), `team-view.ts` (152) + test.
- `apps/desktop/src/routes/`: `Screen.tsx` (21), `classes.ts` (33), `money-view.ts` (13), `stage-badge.tsx` (11); file gốc `App.tsx` (18), `main.tsx` (47), `index.css` (20), `ui-choices.test.tsx` (30); `apps/desktop/index.html`.
- Đọc thêm chỗ nối: `packages/ui/scripts/check-tokens.ts`, `apps/desktop/src/data/{tables,tauri-storage,persist-queue}.ts` (phần D chạm), `e2e/{topbar-focus,data-table,team,save-state,customer-kyc,customers,customer-forms,customer-appointments,period-picker,dialog-keyboard,smoke,theme,navigation}.spec.ts`, `e2e/support.ts` (`asExe`), `e2e/serve.mjs`.

**Diff `119e2e4..2e51e25` của gói**: 37 file SP +1 121 / −451, 13 file test +697 / −42 (`git diff --numstat`). Đọc kỹ: `shell/{AppShell,Sidebar,SaveWarning,CloseGuard,close-guard,Brand}`, `index.css`, `index.html`, `App.tsx`, `i18n/vi.ts` (toàn bộ diff), `customers/{CustomerProfile,CustomerKyc,CustomerAppointments,CustomerDialogs,KycDialogs,CustomersScreen,customers-view,kyc-view}`, `team/{TeamScreen,PersonDialogs,team-view}`, `classes.ts`, `stage-badge.tsx`, `money-view.ts`, `packages/ui/src/{components/DataTable,table-view,TextField,SelectField,PeriodPicker,Chart,field-notes,compare-cells,chart-theme,token-guard},tokens.css,theme.css,fonts.css`.

**Tài liệu**: `CLAUDE.md` (gốc), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` §4, `phase-3-du-lieu.md` §2/§3.8/§4/§6, `phase-4-chi-so.md`, `phase-5-ai.md` (phần dòng thời gian), ADR-0007 (phụ lục), ADR-0013 (phụ lục 27/10), `docs/golden/*` (đọc khi cần đối chiếu), `docs/design/mockups/{customer.html,customers.html,customer-forms.html,appointment-forms.html,settings-data.html,team.html,mockups.css,forms.css,index.html}`, `docs/testing/nghiem-thu-v1.md` (mục "Lệch mockup đã biết", NT-CH-09), `docs/reviews/2026-10-21-…-luot-3-tong-hop.md` (§6 DR6-104…134), `common/{plan.md,known.md,fixes.md,baseline.md}` (phần gói D), báo cáo A / B / C của chính mình.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Hồ sơ KH có 6 mục dòng thời gian: bấm **KYC** → **Lịch hẹn** → **Tất cả**; đếm mục ẩn/hiện và `display` tính được của `<li hidden>` | 6 mục; KYC ẩn 3, Lịch hẹn ẩn 5, Tất cả ẩn 0; `hidden` ⇒ `display:none`, cao 0 px; không mục nào mất khỏi cây (đề xuất AI còn) | — |
| 2 | Danh sách KH: Kanban (6 cột) → **Bảng** → sắp theo "Họ tên" ↑ rồi ↓; đọc `aria-sort`, 3 dòng đầu, dòng chân bảng | `aria-sort` none → ascending → descending; 100 dòng/1 200; chân "Đang hiện 100 / 1.200 khách hàng · Hiện thêm 100 khách hàng"; `tabindex="-1"` trên dòng chân | — |
| 3 | Hồ sơ KH ở 1 440×900 rồi 1 100×700: số cột, tràn ngang, khối logo / nav / dòng lưu ở sidebar | 3 cột 376 px → 2 cột 402 px; `scrollWidth = clientWidth` ở cả hai; sidebar 1 100: logo 142, nav 263, dòng lưu 651–700 (dính đáy), không chồng | — |
| 4 | Đưa một tiêu đề thẻ vào khung nhìn bằng `scrollIntoView({block:'start'})` khi trang đang ở đầu: đo đỉnh tiêu đề với đáy thanh trên cùng | Đỉnh 84 px, đáy thanh 59 px ⇒ hở 25 px; `scroll-margin-top` = `84px` (đúng `--spacing(21)`) | — |
| 5 | Chèn 300 chữ "A" vào **ô ngày** của một mục dòng thời gian (ô không có `wrap-anywhere`) rồi đo tràn ngang của `main` | `scrollWidth` 2 862 > 1 208 ⇒ tràn. **Không phải lỗi**: ô ngày chỉ chứa `dd/mm/yyyy`; ô có `wrap-anywhere` là ô chữ của cuộc gặp (ca e2e `customer-kyc.spec.ts:114` giữ) | — |
| 6 | So ô chọn 5d / 5a với `.choice` của mockup: đọc style tính được của chip chưa chọn và đã chọn | App: nền `#0b1017`, viền `#263241`, bo 10 px, đệm 4/10, chữ `#e8edf4`, đậm 400 (cả khi chọn). Mockup: nền `#18212d`, viền `#34425a`, bo 6 px, đệm 5/11, chữ `#aeb9c8`, **đậm 600** khi chọn | **DSR4-D2** |
| 7 | `findHardcodedSeparators` trên chuỗi có `//` rồi `·`, và trên chuỗi có `/*` rồi ba dòng có `·` / `✓` | Cả hai trả `[]` — không báo gì; cùng chuỗi không có `//` / `/*` thì báo đủ | **DSR4-D1** |
| 8 | Quét export của mọi file D: đếm chỗ dùng ngoài file và ngoài test | 4 export **mới** chỉ test dùng (`SaveStateLine`, `SaveFailed`, `CloseDialog`, `StageHead`) + `stageSince`, `COUNT_SLOTS`, `compareCells` (có từ trước) | mục 8 |
| 9 | Dựng lại bảng Kanban và dòng thời gian trên **dữ liệu tải** (1 481 KH, 4 884 chuyển nhóm, 1 674 HĐ) trong Node: đo `customerBoard`, `kycTimeline`, chuỗi truy vấn `readProfile` | `customerBoard` 3,4 ms (890 mở / 591 đóng), một team 0,7 ms; `kycTimeline` hồ sơ nhiều nhất (20 phiên bản, 7 ghi chú, 13 lịch) 0,0 ms; `readProfile` 8,1 ms | mục 6.2 |
| 10 | Chạy 9 spec e2e của gói ở SHA ghim, rồi gỡ từng phần sửa (9 đột biến e2e + 9 đột biến unit) xem test có đỏ | 94 ca e2e qua; **18/18 đột biến bị giết**, mọi file trả nguyên byte (phụ lục 9.1, 9.2) | bảng R |

## 5. Phát hiện mới

```
ID: DSR4-D1
Mức: Low
Trục: T
Vị trí: packages/ui/src/token-guard.ts:53-85 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: DR6-37 (T-301) · có từ trước (#306, T-103); đợt sửa sau lượt 3 (#845) mở rộng luật này thêm ✓ ○ × ▾ ▸ — nên hậu quả rộng hơn — lượt 1–3 bỏ sót
Kịch bản: 7
Mô tả: `findHardcodedSeparators` tự cắt comment bằng cách dò `//` và `/*` trên chuỗi thô, không biết
  chuỗi / template / regex, nên một `//` **trong chuỗi** cắt phần còn lại của dòng, và một `/*` **trong
  chuỗi** đặt cờ "đang trong comment" cho tới khi gặp `*/` — có khi hết file. Mọi dấu `·` `→` `✓` `○` `×`
  `▾` `▸` `—` và `.join(', ')` sau chỗ đó không bị báo, nên `pnpm lint:tokens` xanh dù có ký hiệu viết cứng.
Tái hiện / bằng chứng: `node --import ./tools/ts-hooks.mjs -e "…"` gọi thẳng hàm (phụ lục 9.3):
  - `const url = 'https://example.com'; const s = 'a · b';` → `[]`
  - "const s = \`${base}//x\`; const t = 'a · b';" → `[]`
  - `const t = 'a · b'; const url = 'https://x';` → `["hardcoded-separator:·"]` (đối chứng: báo đúng)
  - Bốn dòng, dòng đầu `const glob = 'a /* b';`, ba dòng sau có `·` / `✓` / `·` → `[]` (mất cả file)
  Trong repo có sẵn một dòng như vậy: `apps/desktop/src/data/ai-analysis.ts:68`
  (`export const CHATGPT_URL = 'https://chatgpt.com/';`) — thêm `·` vào sau trên cùng dòng thì không ai báo.
Ảnh hưởng: người viết code app. Luật này là lưới duy nhất giữ DR6-37 (ký hiệu viết cứng) khỏi tái phát;
  một dòng có URL (hoặc `/*` trong chuỗi) làm lưới thủng âm thầm. Không ảnh hưởng người dùng cuối.
Đề xuất: cắt comment bằng máy trạng thái nhỏ có trạng thái chuỗi (`'`, `"`, `` ` ``, có `\\`) thay vì
  `indexOf`; hoặc bỏ hẳn việc cắt và bỏ qua một match khi nó nằm sau `//` / trong `/* */` tính từ đầu
  dòng bằng cùng máy trạng thái. Thêm 3 ca vào `token-guard.test.ts` (chuỗi có `//`, có `/*`, có `*/`).
  Cỡ: ≤ 40 dòng SP + ~15 dòng test.
```

```
ID: DSR4-D2
Mức: Low
Trục: C
Vị trí: packages/ui/src/components/Choices.tsx:53 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: T-284 / T-300 (K36) · có từ trước, lượt 1–3 bỏ sót (Choices.tsx lần cuối đổi ở #375)
Kịch bản: 6
Mô tả: Ô chọn kiểu radio (`Choices`) vẽ khác `.choice` của mockup G3 ở sáu điểm: nền `--bg-0` thay vì
  `--bg-2` (chip **tối hơn** hộp thoại, trong khi mockup vẽ **sáng hơn**), viền `--border` thay vì
  `--border-strong`, bo góc 10 px thay vì 6 px, đệm 4/10 thay vì 5/11, chữ `--text` thay vì `--text-2`,
  và chip đang chọn **không** đậm lên (`font-weight: 600` ở `.choice.on`). Hệ quả: ô đang chọn chỉ được
  phân biệt bằng viền và nền nhấn, không bằng độ đậm; ô chưa chọn sáng bằng ô đang chọn.
Tái hiện / bằng chứng: probe Playwright trên bản build web (phụ lục 9.4), `getComputedStyle` của
  `<label>` trong `fieldset` của hộp 5a (giới tính) và 5d (nhóm):
  - app, chưa chọn: `background rgb(11,16,23)`, `border 1px rgb(38,50,65)`, `radius 10px`,
    `padding 4px 10px`, `color rgb(232,237,244)`, `font-weight 400`;
  - app, đã chọn ("Nữ"): `background rgba(217,178,106,0.14)`, `border 1px rgb(217,178,106)`,
    `font-weight 400` (không đổi độ đậm);
  - mockup `docs/design/mockups/forms.css:261-284` (đo trên `customer-forms.html`): `background
    rgb(24,33,45)`, `border 1px rgb(52,66,90)`, `radius 6px`, `padding 5px 11px`, `color
    rgb(174,185,200)`; `.choice.on` thêm `font-weight 600`.
  Ảnh: `shot-5a-gender.png`, `shot-5d-app.png`, `shot-5d-mockup.png`.
Ảnh hưởng: mọi hộp thoại có ô chọn: 5a (giới tính), 5d (nhóm), 7b / 7c (Cập nhật / Đánh dấu mâu thuẫn),
  7d (giá trị giữ lại), 3f, Cài đặt → AI (provider). Người dùng khó thấy hơn ô nào đang chọn, nhất là
  khi chỉ nhìn màu nền; không sai dữ liệu.
Đề xuất: đưa `Choices` về `.choice` của mockup: `bg-surface-2`, `border-border-strong`, `rounded-sm`,
  `px-2.75 py-1.25` (11 / 5 px), `text-fg-2`, `has-checked:font-semibold has-checked:text-fg`,
  `has-disabled:line-through` (mockup `.choice.off` có gạch ngang, app chỉ giảm 50 % độ mờ). Không cần G3
  (mockup đã duyệt). Cỡ: ~10 dòng SP + rà 6 màn; đổi hình nên chụp lại ảnh hướng dẫn ở G7.
```

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đo gì | Trên cái gì | Số | ID |
|---|---|---|---|
| `node tools/size-report.mjs` (SHA ghim) | gói D | **7 999 SP · 2 820 test · 0 sinh · 87 file** — khớp `common\baseline.md` (Δ lượt 3: +670 / +655 / 0 / +11) | — |
| `git diff --numstat 119e2e4 2e51e25` (đường dẫn gói D) | diff sửa của gói | SP **+1 121 / −451** (37 file), test **+697 / −42** (13 file) | — |
| `tsc --noEmit` (đã bật `noUnusedLocals` / `noUnusedParameters`) | toàn app + `packages/ui` | sạch ở cổng bước chuẩn bị; không có import / biến chết trong file D | — |
| Quét export (script `exports.mjs`, phụ lục 9.3) | 87 file D | 4 export **mới** chỉ test dùng: `SaveStateLine` (`Sidebar.tsx:70`), `SaveFailed` (`SaveWarning.tsx:46`), `CloseDialog` (`CloseGuard.tsx:72`), `StageHead` (`CustomersScreen.tsx:243`); 3 export cũ cùng dạng: `stageSince`, `COUNT_SLOTS`, `compareCells`. Không đo được chi phí (tree-shaken) | mục 8 |
| `grep` hai chuỗi class gốc | `apps/desktop/src` | `HEADING` và `BADGE` chỉ còn ở `classes.ts` (DR6-67 giữ) | — |
| Bundle web (số của `baseline.md`, không đo lại) | `apps/desktop/dist` | `assets/index-*.js` 884 698 B (−43 234 so lượt 3, phần lớn là `zod/mini`); `index.css` 29 752 B (+1 268) | — |

Không có phát hiện bloat: phần D tăng chủ yếu là test (+655) và code màn (thêm dòng thời gian có bộ lọc,
khối logo, dòng trạng thái lưu); mọi hằng / class dùng chung đều có ≥ 7 chỗ dùng.

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, 30/10/2026 21:1x (+07:00), máy rảnh (không chạy e2e / build song song),
Node v22.22.2, dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (1 481 KH, 4 884 chuyển nhóm,
1 674 HĐ, 51 nhân sự), `importBackup` của `@p2c/db`, 5 lần mỗi phép, trung vị (min–max):

| Phép đo | Dữ liệu | Trung vị | Ngưỡng / mốc | Kết luận |
|---|---|---:|---|---|
| `customerBoard` (cả 6 cột Kanban + 2 cột đóng) | 1 481 KH · 4 884 chuyển nhóm · 1 674 HĐ | **3,4 ms** (2,9–5,0) | màn < 200 ms (`phase-6.md`) | trong ngưỡng |
| `customerBoard` (một team) | 5 team | **0,7 ms** (0,7–0,8) | < 200 ms | trong ngưỡng |
| Dựng dòng bảng KH (1 481 dòng) | như trên | **0,0 ms** (0,0–0,1) | < 200 ms | trong ngưỡng |
| `kycTimeline` hồ sơ nhiều nhất (Võ Minh Quân: 20 phiên bản, 7 ghi chú, 13 lịch) | 1 KH | **0,0 ms** (0,0–0,5) | < 200 ms | trong ngưỡng |
| Chuỗi truy vấn `readProfile` (mở hồ sơ) | 1 KH | **8,1 ms** (7,6–8,7) | — (không có ngưỡng riêng; `reload.customers` 317 ms trên exe) | không đáng lo |
| `staffMetrics` một team (bản tương đương) | 1 team | **0,3 ms** (0,3–0,8) | < 200 ms | trong ngưỡng |

Số trên exe (dùng lại `baseline.md`, không đo lại): `reload.customers` 317 ms (−19 ms so mốc sau #656),
`customers.view-table` 19 ms, `customers.sort-name` 24 ms, `customer.open-ai` 20 ms, `db.save` 149 ms —
mọi dòng dưới ngưỡng, **không dòng nào ⚠️** theo luật nhiễu. Không có phát hiện P.

## 7. Bảng đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **2** |

Tỉ lệ PLAUSIBLE: **0/2** (cả hai CONFIRMED, có lệnh và số đo). Không có mục KNOWN mới.

## 8. Đã xét, không thấy

- **R** (12 dòng R1, 16 dòng R2): đã chạy lại tái hiện và gỡ phần sửa ở 9 chỗ (phụ lục 9.1, 9.2); mọi
  dòng kết luận ĐÃ SỬA. Không có HỒI QUY, không có SỬA MỘT PHẦN, không có CHƯA SỬA.
- **E** (edge case): hồ sơ KH **không có** mục nào (mới tạo, chưa KYC): `Timeline` hiện "Không có mục nào."
  và `kycTimeline` trả mảng rỗng — đọc `CustomerKyc.tsx:293`, `kyc-view.ts:272-295`. Hồ sơ có **20 phiên
  bản** KYC: `kycEvents` gộp đúng theo ghi chú + ngày, không mất mục nào (đo 6.2). Bảng 0 dòng
  (`DataTable` với `rows = []`): `table-view.test.ts` có ca "keeps the headers of an empty table".
  `AddPerson` khi **chưa có team**: `cardTitleOf` trả `MEMBERS_TITLE` mà màn không có thẻ đó ⇒ focus về
  `body` — chưa gây được bằng UI (màn Team rỗng vẫn có nút, `selected` undefined). Ghi lại, không thành
  phát hiện (không có đường vào bằng thao tác thường).
- **C** (hợp đồng / mockup): đối chiếu 5a, 5d, 7a–7d, dòng thời gian, thẻ Lịch hẹn, Kanban, khối logo,
  dòng trạng thái lưu với mockup. Một lệch mới: **DSR4-D2** (ô chọn). Các lệch còn lại đã có dòng ở
  "Lệch mockup đã biết" (huy hiệu "n HĐ", thẻ Lịch hẹn 120 px, 6h còn dòng "Lần gặp thứ n", câu help Case
  size ở 6c / 6f, danh sách KH thiếu bộ lọc / lý do đóng) — KNOWN, không báo lại.
- **D** (dữ liệu): màn D không ghi thẳng vào bảng; mọi thay đổi qua lệnh `db`. Đã kiểm 5a / 5c / 7a gửi
  chữ **nguyên** (DR6-109) và `parseBirthDate` đọc trên `normalizeText` (DR6-110) — hai đường dữ liệu
  chính của gói. `stageBadge(stage, label)` chỉ đổi chữ hiển thị, không đổi dữ liệu.
- **G** (guardrail AI): gói D chỉ chạm panel AI ở chỗ đọc (`KycIntelligence`, `NoteEvent` — của C). Không
  thấy đường nào để màn D gửi chữ chưa kiểm sang AI. Đã xét, không thấy.
- **S** (an toàn ranh giới): phiên này **không** giao việc cho agent phụ và **không** mở task expert, dù
  Owner cho phép: mọi phép đo cần dữ liệu tải, bản build và đột biến đều chạy được trong phiên chính, nên
  thêm một lớp (và một log thứ hai) không đổi chất lượng bằng rủi ro. Quy tắc riêng 2 giữ nguyên: không
  lệnh nào đọc / liệt kê thư mục cấm; mọi đường dẫn tuyệt đối. Không có `gh`, không `curl`, không web.
- **P**: xem 6.2 — không phát hiện.
- **B**: xem 6.1 — 4 export mới chỉ test dùng, cùng dạng DR6-66, không đo được chi phí nên chỉ ghi lại;
  không thành phát hiện (dự án đã chấp nhận cách test `renderToStaticMarkup` cho component không có
  thư viện DOM — G4: không thêm).
- **T** (chất lượng test): 9 đột biến bị giết (phụ lục 9.1, 9.2). Ba chỗ **không** có test và không phải
  lỗi: (a) `cardTitleOf` cho `create` khi chưa có team (mục E ở trên); (b) `token-guard` với chuỗi có
  `//` (DSR4-D1); (c) `SaveStateLine` ở chế độ web dài 3 dòng trong sidebar 232 px — chỉ bản web, không
  có ngưỡng, không thành phát hiện.
- **A** (trợ năng / i18n): `role="img"` + tên cho khối logo, `lang="en"` cho slogan, `role="alert"` cho
  dải lưu lỗi, `aria-sort` ở bảng, `aria-pressed` ở chip RE, `role="radiogroup"` + `aria-required` ở
  `Choices`, `hidden` (không `aria-hidden`) cho mục ngoài bộ lọc, `tabIndex={-1}` cho đích focus. Không
  thấy chỗ nào mất tên trợ năng. Tương phản dòng trạng thái lưu: `e2e/save-state.spec.ts` đo
  `lowestContrast ≥ 4.5` cho "Đã lưu HH:MM", "Chưa lưu được vào file" và dòng bản web — qua.

## 9. Phụ lục

### 9.1 Đột biến e2e (mỗi lần: chép bản gốc, vá, chạy, trả nguyên byte, so sha256)

| # | File · thay đổi | Spec chạy | Kết quả |
|---|---|---|---|
| E1 | `index.css` `--spacing(20)` → `0px` | `topbar-focus` | **2 failed** (ca "what scrolls into view…", "Shift+Tab to a link…"); luật `h2` còn nên 3 ca tiêu đề xanh |
| E2 | `CustomerKyc.tsx` `hidden={!shown(event)}` → `hidden={false}` | `customer-kyc` | **1 failed** ("the timeline filter keeps to the KYC or the appointments…") |
| E3 | `SaveWarning.tsx` nhãn nút → `'Lưu lại'` | `save-state` | **1 failed** ("Thử lại on the save warning saves at once…") |
| E4 | `TeamScreen.tsx` bỏ `resetKey={entry.team.id}` | `team` | **1 failed** ("another team shows its first 100 RE again", 111 dòng) |
| E5 | `Brand.tsx` `aria-label` → `"Logo"` | `smoke`, `navigation` | **3 failed** (smoke "app shell shows the brand…", navigation "the smallest window…", "the exe gives its title bar…") |
| E6 | `AppShell.tsx` bỏ `setTitle` | `navigation` | cùng lượt với E5: ca "the exe gives its title bar the page's title" đỏ |
| E7 | `TeamScreen.tsx` `case 'delete'` → `MEMBERS_TITLE` | `team` | **1 failed** ("by the keyboard, Xóa team leaves the focus on the list of teams…") |
| E8 | `CustomerKyc.tsx` bỏ `wrap-anywhere` ở dòng cuộc gặp | `customer-kyc` | **1 failed** ("a link of 108 characters … stays in its column…", DR6-117 / DR6-127) |
| E9 | `CustomerDialogs.tsx` `name` → `normalizeText(name)` | `customer-forms` (`-g "broken in a paste"`) | **1 failed** (DR6-109) |

Tổng e2e chạy ở SHA ghim (không đột biến): **94 ca qua**, hai lượt — lượt 1 `69 passed (1,1 phút)`
(`topbar-focus`, `data-table`, `team`, `save-state`, `customer-kyc`, `customers`), lượt 2 `25 passed
(28,2 giây)` (`period-picker`, `customer-appointments`, `dialog-keyboard`). Thêm 1 ca `customer-forms`
chạy riêng ở đột biến E9.

### 9.2 Đột biến unit

| # | File · thay đổi | Test | Kết quả |
|---|---|---|---|
| M1 | `kyc-view.ts` `inTimelineFilter('KYC')` → `true` | `kyc-view.test.ts` | **1 failed** (32 ca) |
| M2 | `customers-view.ts` bỏ `normalizeText` trong `parseBirthDate` | `customers-view.test.ts` | **2 failed** (25 ca) |
| M3 | `money-view.ts` luôn ghép phần gọn | `money-view.test.ts` | **1 failed** ("gives the full form once under a million") |
| M4 | `table-view.ts` `sorts()` → `true` | `table-view.test.ts` | **3 failed** (6 ca) |
| M5 | `field-notes.ts` đảo thứ tự dòng chú thích | `field-notes.test.ts` | **1 failed** (4 ca) |
| M6 | `team-view.ts` câu Thùng rác của hỗ trợ → câu RE; `NAMED_IN_TRASH` 3 → 1 | `team-view.test.ts` | **3 failed** (13 ca) |
| M7 | `SaveWarning.tsx` `folderReadOnly.banner` → `storage.saveFailed` | `SaveWarning.test.tsx` | **1 failed** (5 ca) |
| M8 | `customers-view.ts` `stageDirection` → `null` | `customers-view.test.ts` | **1 failed** ("lifts toward N1, lowers toward N4") |
| M9 | `index.html` `<title>` → `Heritas X-CRM` | `tauri-contract.test.ts` | **1 failed** (17 ca, ca "names the app…") |

Mọi lần đều `restored: true` (sha256 trước = sau); `git status --short` sau cả 9 + 9 đột biến: **rỗng**.

### 9.3 Script và probe (trong `…-r4\deepseek\D\`)

- `serve.mjs` — server tĩnh cho `apps/desktop/dist` ở cổng **4399** (không dùng 4173 của e2e).
- `probe-1.mjs`, `probe-2.mjs` — khối logo / dòng trạng thái lưu / Kanban / bảng / hồ sơ / bộ lọc /
  cuộn khi focus / cửa sổ 1 100×700 (Playwright, Edge, chặn mọi host ngoài `127.0.0.1`, thay
  `window.open` từ lần chạy đầu). Kết quả `probe-1.json`, `probe-2.json`.
- `probe-5a.mjs`, `probe-5d.mjs` — style tính được của ô chọn so với mockup; ảnh `shot-5a-gender.png`,
  `shot-5d-app.png`, `shot-5d-mockup.png`, `shot-profile-1440.png`, `shot-profile-1100.png`.
- `exports.mjs` — quét export của 87 file D, đếm chỗ dùng ngoài file và ngoài test.
- `perf-d.mjs` — đo 6.2 trên dữ liệu tải (Node, `ts-hooks`).
- `mutate.mjs`, `mutate-many.mjs` + `plan-*.json` — vá tạm, chạy, trả nguyên byte (in sha256 trước/sau).
- Lệnh kiểm `token-guard` (DSR4-D1):
  `node --import ./tools/ts-hooks.mjs -e "…findHardcodedSeparators(…)"` — kết quả ở mục 5.

Bản build web dùng để đo: `node node_modules/vite/bin/vite.js build` trong `apps/desktop`, **không** đặt
biến môi trường riêng; `assets/index-*.js` ra 884,69 kB (khớp 884 698 B của `baseline.md`). Bản `dist`
có sẵn lúc đầu phiên do một gói trước dựng **có** `VITE_DEMO_ANCHOR` (884 708 B) nên đã dựng lại.

### 9.4 Ghi chú về môi trường

- `pnpm` không dùng trong phiên (mọi lệnh gọi thẳng `node node_modules/…`); không chạy `pnpm eval:ai`,
  không connector, không web, không `gh`.
- Playwright ghi `test-results\` trong repo bị shim `safe-delete` của app chặn (135 file); đã chuyển
  `--output` sang `…\deepseek\D\pw`. Đây là hành vi của app, không phải của repo.
- Cổng 4173 của e2e chỉ dùng khi chạy spec (3 lần, không chạy song song với ai).

### 9.5 Trạng thái cuối phiên

`git status --short` của `C:\workspace\Project-2C-review`: **rỗng**. `git rev-parse HEAD`:
`2e51e25eb0125f56d3d938b97ef18d6873dae076`.
