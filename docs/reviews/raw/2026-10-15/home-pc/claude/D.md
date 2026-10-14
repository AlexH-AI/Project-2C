XONG — claude gói D, 14/10/2026 01:02

# Deep review Phase 1–6, lượt 1 — Claude, gói D (Màn nhập liệu)

## 1. Thông tin phiên

- Bên: Claude (Opus 5.5)
- Gói: D — Màn nhập liệu (`packages/ui/**` trừ `scripts/`, `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` trừ file AI và Hợp đồng, `routes/team/**`, `routes/Screen.tsx`, `apps/desktop/src/*`, `apps/desktop/index.html`)
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd`
- `git status --short` đầu phiên: (rỗng)
- Giờ bắt đầu: 14/10/2026 00:04 (Home PC `DESKTOP-KDURKJP`)
- **Phiên làm tiếp:** phiên đầu bị cắt sau khi chạy xong `mutate.mjs` (00:24; log đủ 65 đột biến, `git status` sau rỗng) — đã ghi CL-D1, CL-D2; đã chạy `p1-person-delete.mjs`, `contrast.mjs`, bản web cổng 4310; `p2-perf.mjs` đã viết nhưng chưa chạy (không có log). Phiên thứ hai bắt đầu 14/10/2026 00:36, kiểm lại: HEAD `8855345…`, `git status --short` rỗng; giữ nguyên CL-D1, CL-D2 và mọi file trong `claude\D\`, làm tiếp từ: chạy `p2-perf.mjs`, đọc lại toàn bộ phạm vi (mục 2), phân loại đột biến sống, Bloat, đủ các mục còn thiếu.

- Bước 0 (phiên làm tiếp, 00:36): chữ gói `D` hợp lệ; `claude\D.md` có, dòng đầu `ĐANG LÀM — claude gói D, bắt đầu 14/10/2026 00:04` → làm tiếp; `claude\A.md` `XONG — claude gói A, 13/10/2026 22:44`, `B.md` `XONG — … 23:16`, `C.md` `XONG — … 14/10/2026 00:04`. Node v24.20.0.

## 2. Phạm vi đã đọc

Danh sách file gói D lấy đúng luật `classifyFile` của `tools/size-report-core.mjs` (`claude\D\list.mjs` → `list.log`): 73 file, **6 820 dòng SP / 1 748 dòng test** (khớp `plan.md` §3).

**Code sản phẩm (đọc hết từng dòng, ở SHA ghim; phiên thứ hai đọc lại toàn bộ):**

- `packages/ui/src`: `components/DataTable.tsx` (205), `PeriodPicker.tsx` (183), `TextField.tsx` (89), `SelectField.tsx` (87), `Dialog.tsx` (82), `Choices.tsx` (75), `Chart.tsx` (68), `Segmented.tsx` (64), `NavIcon.tsx` (63), `Button.tsx` (28), `StageBadge.tsx` (22), `PolicyBadge.tsx` (13), `chart-theme.ts` (57), `compare-cells.ts` (38), `show-more.ts` (25), `PeriodPicker.label.ts` (21), `token-guard.ts` (77), `index.ts` (17), `tokens.css` (69), `theme.css` (76), `fonts.css` (140, phần đầu + đếm 12 `@font-face`).
- `apps/desktop/src/shell`: `AppShell.tsx`, `Sidebar.tsx`, `CloseGuard.tsx`, `ErrorBoundary.tsx`, `RePicker.tsx`, `SaveWarning.tsx`, `ScopeContext.tsx`, `ScopePicker.tsx`, `StartupError.tsx`, `block-reload.ts`, `close-guard.ts`, `routes.ts`, `scope.ts`, `screen-error.ts`, `startup-error.ts`, `useRoute.ts` (781 dòng).
- `apps/desktop/src/i18n`: `index.ts` (132) hết; `vi.ts` (1 198): đọc mọi khóa của màn gói D (`customers.*`, `customer.*`, `customerForm.*`, `customerDelete.*`, `stageForm.*`, `kyc*.*`, `timeline.*`, `team.*`, `person.*`, `rePicker.*`, `scope.*`, `date.*`, `birth.*`, `error.*` mà màn gói D gặp), phần còn lại kiểm bằng script (`keys.mjs`, `slots.mjs`).
- `routes/customers`: `CustomersScreen.tsx` (252), `customers-view.ts` (159), `CustomerProfile.tsx` (277), `CustomerDialogs.tsx` (495), `KycDialogs.tsx` (500), `CustomerKyc.tsx` (286), `CustomerAppointments.tsx` (154), `kyc-view.ts` (254).
- `routes/team`: `TeamScreen.tsx` (316), `PersonDialogs.tsx` (202), `TeamDialogs.tsx` (95), `team-view.ts` (119). `routes/Screen.tsx`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `apps/desktop/index.html`.

**Code gói khác mà gói D nối vào (chỉ chỗ nối):** `apps/desktop/src/data/AppDataContext.tsx` (`useQuery`, `useTables`, `useToday`), `tables.ts` (`readTables`, `sortedByName`), `app-data.ts:200-216` (seed demo); `packages/db/src/team.ts:140-275` (`updatePerson`, `softDeletePerson`, `isPersonInUse`), `customers.ts:150-200` (`previewCustomerProfile`, `changeStageManually`, `softDeleteCustomer`), `kyc.ts:125-170` (`recordKycNote`), `packages/domain/src/period.ts` (`parseQuickDate`, `compareDates`, `toDayNumber`); `routes/SettingsBackup.tsx` (ô nhập backup, để nạp dữ liệu tải vào bản web); `KycIntelligence.tsx:120-130` (chỗ tách `{value}`); `wry-0.55.1/src/webview2/mod.rs:696-783` (xử lý cửa sổ mới của WebView2, trong cargo registry).

**Tài liệu:** `CLAUDE.md` gốc + `packages/ui/CLAUDE.md`, `apps/desktop/CLAUDE.md`, `.claude/rules/i18n-ui.md`, `tests.md`; `common\plan.md` §1–§6, `known.md`, `baseline.md`; báo cáo `claude\A.md`, `B.md`, `C.md` (tiêu đề phát hiện, mục 4–7 của C, để không báo lại); `docs/design/phase-3-du-lieu.md` (D9, bảng lệnh); `docs/testing/nghiem-thu-v1.md` §1, §4, §5, §8, "Lệch mockup đã biết", "Đối chiếu mockup"; mockup (chữ hiện ra, qua `mocktext.mjs`): `customers.html`, `customer.html`, `customer-forms.html` 5a–5f, `kyc-forms.html` 7a–7e, `team.html` 9a–9c, `phase-3-feedback.html` B1–B2, `trash.html` 11f, `README.md` của mockup.

**Test (đọc tên mọi ca, đọc kỹ chỗ cần):** `block-reload.test.ts` (hết), `i18n/index.test.ts` (tên ca), `CustomersScreen.test.tsx`, `ui-choices.test.tsx` (hết); tên ca của `customers-view.test.ts`, `kyc-view.test.ts`, `team-view.test.ts`, `routes.test.ts`, `scope.test.ts`, `close-guard.test.ts`, `startup-error.test.ts` qua `mutate.log`; e2e: `customers.spec.ts` (tên ca + phép kiểm), `customer-forms.spec.ts:215-270` (5f), `team.spec.ts:280-320` (9b), `navigation.spec.ts` (hết), `e2e/support.ts:20-80` (`asExe`), `git grep` các chuỗi cần.

## 3. Phát hiện

### CL-D1 — Hộp Xóa nhân sự (9b) không đếm việc làm "người đánh giá kết quả": cho bấm Xóa rồi lệnh từ chối bằng câu nói về RE / KH / HĐ

```
ID: CL-D1
Mức: Low
Trục: C, A
Vị trí: apps/desktop/src/routes/team/team-view.ts:111-119 (personUsage không có reviewer); apps/desktop/src/routes/team/PersonDialogs.tsx:126-129 (doc comment), :143, :163, :169-194; packages/db/src/team.ts:250-253, :266-273 (isPersonInUse gồm reviewsLiveAppointment); apps/desktop/src/i18n/vi.ts:1110-1111, :1114-1115 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** `DeletePersonDialog` quyết định "còn dữ liệu" bằng `personUsage` (KH, lịch hẹn, HĐ ghi cho RE, lịch hẹn phối hợp) trên bảng của màn; lệnh `softDeletePerson` còn chặn người **đánh giá kết quả** của một cuộc gặp chưa xóa (`reviewsLiveAppointment`). Doc comment của hộp hứa "One the screens still show records for is refused up front with the counts; records of deleted customers only show up as the command's refusal (review R1)" — nhưng cuộc gặp có người đánh giá là bản ghi màn vẫn hiện, không phải của KH đã xóa. Kết quả: hộp hiện câu xóa mềm bình thường, nút Xóa bật; bấm thì lệnh trả `PERSON_IN_USE` và hộp hiện `error.PERSON_IN_USE` ("Nhân sự còn KH, lịch hẹn hoặc HĐ ghi cho mình, kể cả của KH đã xóa … Giữ vai trò RE, hoặc giữ lại thay vì xóa.") — với một IS / TL / BDM / BD, câu này nói sai lý do và không chỉ ra cuộc gặp nào cần bỏ người đánh giá. Kèm theo, cùng hộp: khi chỉ vướng "là người phối hợp", câu hướng dẫn `person.inUseHelp` vẫn là câu của RE ("Chuyển KH sang RE khác trước (Sửa hồ sơ KH). Lịch hẹn và HĐ cũ giữ theo RE …").
- **Tái hiện:** `node p1-person-delete.mjs` (log `claude\D\p1-person-delete.log`): DB mới, IS "Phó Đức Huy" chỉ là người đánh giá của một cuộc gặp Đã gặp → `A dialog usage (personUsage) {"customers":0,"appointments":0,"policies":0,"coordinating":0}`, `A dialog inUse (any count > 0) false`, `A softDeletePerson refused PERSON_IN_USE`, câu hiện: "Nhân sự còn KH, lịch hẹn hoặc HĐ ghi cho mình, kể cả của KH đã xóa (khôi phục KH cần RE này). Giữ vai trò RE, hoặc giữ lại thay vì xóa." Trên dữ liệu tải: 0 cuộc gặp có người đánh giá (seed không đặt), mọi IS / BD / BDM / TL đều đang phối hợp nên hộp đã chặn trước (`B load data, per role` … `dialogLetsThroughButRefused: 0`) — ca chỉ gặp khi người dùng tự ghi người đánh giá. Phần câu hướng dẫn: bản web ở SHA ghim (`claude\D\web\`, cổng 4310), Team & nhân sự → Người hỗ trợ → Sửa IS "Bùi Văn Nga" → Xóa nhân sự → hộp hiện "Chưa xóa được — IS còn dữ liệu / 222 lịch hẹn là người phối hợp / Chuyển KH sang RE khác trước (Sửa hồ sơ KH). Lịch hẹn và HĐ cũ giữ theo RE đã ghi nên RE vẫn còn trong dữ liệu — cân nhắc giữ lại thay vì xóa."
- **Ảnh hưởng:** người quản lý xóa một IS / TL / BDM / BD từng được chọn làm người đánh giá (ô "Người đánh giá kết quả" ở hộp 6c / 6f) mà không phối hợp lịch nào: bấm Xóa, nhận câu báo nói về RE / KH, không biết phải bỏ người đánh giá ở cuộc gặp nào (không có danh sách). Không mất dữ liệu, có đường vòng (giữ lại người đó) → Low.
- **Đề xuất:** `personUsage` thêm `reviewing` (đếm `outcomeReviewerId === personId` trên `records.appointments`, thêm trường vào `StaffRecords`), hộp thêm một dòng "{count} lịch hẹn là người đánh giá kết quả" (khóa mới trong `vi.ts`); câu `person.inUseHelp` chỉ hiện khi vướng KH / lịch / HĐ của RE, còn vướng phối hợp / đánh giá thì một câu riêng ("bỏ người này khỏi người phối hợp / người đánh giá của các lịch đó trước", như `error.COORDINATOR_IN_USE` / `REVIEWER_IN_USE`). ≈ 15 dòng SP + ca `team-view.test.ts` cho `personUsage` có người đánh giá.

### CL-D2 — Ô "Giá trị" của dữ kiện KYC tiền (Thu nhập năm, Tổng tài sản, Nợ phải trả) không đọc lại số tiền như mockup 7b / 7c; danh mục nghiệm thu NT-HS-05 sẽ đỏ ở G7

```
ID: CL-D2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:92-148 (FactValue: TextField chỉ có hint khi được truyền), :316-324 (KycNoteDialog không truyền hint); packages/domain/src/kyc-fact.ts:23-35 (kycFieldType: chỉ text / integer / boolean); docs/design/mockups/kyc-forms.html 7b ("Giá trị — Thu nhập năm · số tiền", "6 tỷ" → "6.000.000.000 ₫ (6 tỷ)"), 7c ("40 tỷ" → "40.000.000.000 ₫ (40 tỷ)"); docs/testing/nghiem-thu-v1.md:176 (NT-HS-05) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** mockup 7b / 7c (G3 Phase 3, đã duyệt) đưa trường tiền của KYC vào dạng "số tiền": ô Giá trị có dòng đọc lại (`.read`) "6.000.000.000 ₫ (6 tỷ)" như mọi ô tiền khác của app (quy ước đầu `customer-forms.html`: "Mọi ô ngày / tiền hiện ngay giá trị app đã hiểu"). App lưu mọi trường KYC không phải số con / năm sinh / có bảo vệ là chữ (`kycFieldType` → `'text'`), hộp Ghi chú KYC không có dòng đọc lại nào cho ô Giá trị. Danh mục nghiệm thu v1.0 (T-221, 13/10) lại ghi đúng theo mockup: NT-HS-05 "Thu nhập năm `6 tỷ` đọc '6.000.000.000 ₫ (6 tỷ)'" — người thử ở G7 sẽ gặp dòng không đạt. Đây là mâu thuẫn giữa mockup (và danh mục nghiệm thu) với mô hình dữ liệu KYC đã làm (giá trị chữ, seed có "Khoảng 50 tỷ"), chưa có ở "Lệch mockup đã biết" của `nghiem-thu-v1.md` hay sổ review.
- **Tái hiện:** bản web build ở SHA ghim (chép `apps/desktop/dist` vào `claude\D\web\`, `node serve.mjs 4310`), hồ sơ một KH → **+ Ghi chú KYC** → Trường **Thu nhập năm** → gõ `6 tỷ`. `javascript_exec` trên hộp đang mở: `{"describedby": null, "next": null, "has6000": false}` — ô Giá trị không có `aria-describedby`, không có phần tử đọc lại, trong hộp không có chuỗi "6.000.000.000". `git grep "000.000.000 ₫\|annualIncome\|Thu nhập năm" -- e2e apps/desktop/src` (trừ `vi.ts`) → không có kết quả: không e2e nào kiểm điều NT-HS-05 mô tả.
- **Ảnh hưởng:** RE nhập "6 tỷ", "6tr", "6.000" cho Thu nhập năm / Tổng tài sản / Nợ phải trả không được app đọc lại nên không biết app hiểu gì (với kiểu chữ thì app lưu nguyên chữ, không sai dữ liệu). Lượt nghiệm thu G7 có một dòng sẽ không đạt hoặc phải hỏi lại Owner. Chỉ hiển thị → Low.
- **Đề xuất:** Owner chọn một trong hai (không sửa mockup cho khớp code khi chưa hỏi): (a) ghi vào "Lệch mockup đã biết" của `nghiem-thu-v1.md` và sửa NT-HS-05 (docs-only); hoặc (b) thêm dòng đọc lại không đổi kiểu lưu: với `annualIncome`, `totalAssets`, `liabilities`, khi `parseVnd` của `domain` đọc được chữ đã gõ thì `FactValue` hiện `hint` "6.000.000.000 ₫ (6 tỷ)" (`formatVnd` + `formatVndCompact`), không đọc được thì không hiện gì — ≈ 15 dòng SP (`KycDialogs.tsx`, một danh sách trường tiền trong `kyc-view.ts`) + unit test hàm đọc lại.

### CL-D3 — Hộp Giải quyết mâu thuẫn (7d) không ghi mã F của từng giá trị; danh mục nghiệm thu NT-HS-08 đòi "mỗi giá trị kèm mã F"

```
ID: CL-D3
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:393-406 (nhãn lựa chọn: giá trị + `kycResolve.source` / `systemSource`); apps/desktop/src/routes/customers/kyc-view.ts:230-254 (KycResolveOption không mang seq / mã); apps/desktop/src/i18n/vi.ts:519-520; docs/design/mockups/kyc-forms.html:274 (7d "F-10 · N-0712 · 12/07/2026"), :240 (7c "Đang có: 25 tỷ · F-05 · ghi chú N-0712 (12/07/2026)"); docs/testing/nghiem-thu-v1.md:179 (NT-HS-08) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** mockup 7d (G3 Phase 3) ghi kèm mỗi giá trị đang mâu thuẫn mã dữ kiện, mã ghi chú và ngày; Phase 5 đổi dạng mã thành `F{seq}` và đưa mã F lên danh sách Dữ kiện KYC (spec Phase 5 §6.1, NT-HS-02). Danh mục nghiệm thu v1.0 viết NT-HS-08: "mỗi giá trị kèm mã F, ghi chú, ngày". App chỉ hiện giá trị và "ghi chú dd/mm/yyyy" / "hồ sơ KH dd/mm/yyyy": `resolveKycOptions` không trả `seq`, nhãn không có mã. Hai giá trị cùng ngày (hai ghi chú một ngày) chỉ phân biệt được bằng chữ của giá trị; người đọc không đối chiếu được với dòng `F5` / `F10` ngay trên thẻ Dữ kiện KYC (và với mã F mà panel AI dẫn làm bằng chứng). Cùng kiểu ở 7c: dòng "Đang có:" không có mã F (NT-HS-06 không đòi).
- **Tái hiện:** `node --import ./hooks.mjs p3-seed-conflicts.mjs 2026-10-14` (log `claude\D\p3-seed-conflicts.log`) tìm KH có mâu thuẫn trong seed demo của bản web hôm nay: "Đỗ Gia Nhung (K-JM1H) · maritalStatus · F5="Đã kết hôn" … | F10="Ly hôn" …". Bản web ở SHA ghim (cổng 4310), hồ sơ KH đó → **Giải quyết · Tình trạng hôn nhân**; `javascript_exec` đọc hộp đang mở: `"hasF": false`, chữ hộp `"Giá trị đúng *\n\"Đã kết hôn\"\nghi chú 14/10/2025\n\"Ly hôn\"\nghi chú 23/11/2025"`, trong khi thẻ Dữ kiện KYC cùng trang có `fact-F5: Tình trạng hôn nhân: Đã kết hôn F5 · 14/10/2025`, `fact-F10: … Ly hôn F10 · 23/11/2025`.
- **Ảnh hưởng:** chỉ hiển thị; người thử G7 gặp một dòng không đạt ở NT-HS-08 (như CL-D2). RE vẫn chọn được theo giá trị.
- **Đề xuất:** `KycResolveOption` thêm `code` (`factCode(fact.seq)`), nhãn thành "F10 · ghi chú 23/11/2025" (khóa `vi.ts` có slot `{code}`); có thể làm cùng dòng "Đang có:" của 7c. ≈ 10 dòng SP + 1 ca `kyc-view.test.ts` (`resolveKycOptions` trả mã). Hoặc Owner ghi vào "Lệch mockup đã biết" và sửa NT-HS-08 (docs-only).

### CL-D4 — Bốn luật của gói D không test nào giữ: ngày "từ …" của hồ sơ KH, số "+ n KH" của cột kanban, miễn trừ ô chọn và pha capture của chặn tải lại (đột biến X5, X6, BR3, BR4 sống)

```
ID: CL-D4
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/customers/CustomerProfile.tsx:122 (since = transitions.at(-1)); apps/desktop/src/routes/customers/CustomersScreen.tsx:175 (count: length - COLUMN_LIMIT); apps/desktop/src/shell/block-reload.ts:12-14 (TEXT_FIELD bỏ checkbox / radio…), :28-34 (capture: true); apps/desktop/src/shell/block-reload.test.ts:27-37 (menuBlocked dựng `closest` giả, không qua selector thật), :12-24 (dispatch thẳng lên target, không có pha capture / bubble) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** đột biến trên file SP gói D (`claude\D\mutate.mjs`, 65 cái) — 57 bị unit test giết; 8 sống qua cả 2 755 test vitest. Bốn trong tám (X1, X3, X4, X8) có e2e giết (xem §6 T); bốn còn lại không test nào (unit hay e2e) giữ:
  - **X5** `since = transitions[0]` (ngày của lần chuyển nhóm **đầu**): dòng "từ dd/mm/yyyy" cạnh badge nhóm ở đầu hồ sơ (NT-HS-01) và phụ đề "hiện tại N2 từ …" của hộp Chuyển nhóm (5d, NT-KH-10) sai ngày mà không đỏ. `git grep` e2e không có phép kiểm nào cho "từ <ngày>" của hồ sơ hay phụ đề hộp 5d; `customers-view.test.ts` chỉ giữ `since` của thẻ kanban (CV1 bị giết), còn hồ sơ tự tính lại ở `CustomerProfile.tsx:122`.
  - **X6** `count: board.open[stage].length` (bỏ `- COLUMN_LIMIT`): link "+ n KH · xem dạng bảng" (NT-KH-02) báo dư 6. Không e2e nào tìm chữ "xem dạng bảng".
  - **BR3** checkbox tính là ô chữ: chuột phải lên ô chọn (vd. "Đánh dấu là thay đổi quan trọng" ở 7a / 7d) mở menu của WebView2 có **Refresh** — đúng thứ DR-60 chặn (tải lại webview bỏ thay đổi chưa lưu). `menuBlocked` của test giả `closest` bằng `selector.includes('textarea')`, nên selector thật không bao giờ được thử.
  - **BR4** nghe ở pha bubble: doc comment hứa "Listens in the capture phase, so no screen can let a reload through by stopping the event" nhưng test dispatch thẳng lên `EventTarget` (không có cây DOM), pha nào cũng như nhau.
- **Tái hiện:** `node mutate.mjs` (log `claude\D\mutate.log`): `X5 profile since from the first transition → SURVIVED (package D tests and the whole vitest suite: 2755 passed)`, tương tự X6, BR3, BR4. E2e không chạy cho đột biến (cổng 4173 dùng chung); kết luận "e2e không giữ" dựa trên `git grep` (§7) — X5 / X6: không có chuỗi "xem dạng bảng", không có kiểm "từ \d" ở `e2e/customer*.spec.ts`; BR3 / BR4: `blockReload` chỉ bật khi `isTauri()` (`main.tsx`); e2e có chế độ `asExe` (`e2e/support.ts:32`, giả IPC của Tauri) nên giữ được, nhưng `git grep "F5\|Control+R\|contextmenu\|button: 'right'" -- e2e` không có kết quả nào.
- **Ảnh hưởng:** sửa sau này làm sai ngày / số hiển thị, hoặc mở lại đường tải lại webview (mất thay đổi chưa lưu trên exe) mà CI vẫn xanh. Hành vi hiện tại đúng.
- **Đề xuất:** (1) `CustomerProfile` dùng chung hàm "ngày vào nhóm hiện tại" với `customerBoard` (vd. `stageSince(transitions)` trong `customers-view.ts` + 1 ca test) — hai nơi hết tính riêng; (2) tách `moreCount(column)` hoặc thêm một ca `renderToStaticMarkup` như `CustomersScreen.test.tsx` cho cột > 6 thẻ; (3) `block-reload.test.ts`: kiểm `addEventListener` được gọi với `{ capture: true }` bằng một `EventTarget` giả ghi lại tham số (không cần DOM); với selector, repo chưa có môi trường DOM cho vitest (`apps/desktop/package.json` không có jsdom / happy-dom — thêm là G4), nên giữ bằng một ca e2e `asExe`: chuột phải lên ô chọn → `contextmenu` bị `preventDefault`, lên ô chữ → không; F5 → không tải lại. ≈ 30 dòng test, ≤ 10 dòng SP.

### CL-D5 — Lùi lịch sử (nút Back của chuột, Alt+←) khi đang mở hộp nhập liệu đóng hộp và bỏ chữ đã gõ, không hỏi; exe chặn tải lại nhưng không chặn lùi

```
ID: CL-D5
Mức: Low
Trục: E
Vị trí: apps/desktop/src/shell/useRoute.ts:24-45 (route theo `hashchange`); apps/desktop/src/shell/AppShell.tsx:52-54 (`ErrorBoundary key={routeToHash(route)}` → đổi route gỡ cả màn cùng hộp đang mở); apps/desktop/src/shell/block-reload.ts:5-9, :27-41 (chỉ F5 / Ctrl+R / BrowserRefresh và menu chuột phải); apps/desktop/src/routes/customers/KycDialogs.tsx:154-236 (bản nháp ghi chú chỉ ở state của hộp) (8855345)
Tình trạng: CONFIRMED trên bản web (`history.back()`); PLAUSIBLE trên exe (nút Back của chuột / Alt+← trong WebView2 — chưa chạy exe)
```

- **Mô tả:** mọi hộp nhập liệu (Ghi chú KYC 7a, Sửa hồ sơ 5c, Khách hàng mới 5a, Nhân sự 9a, Lịch hẹn, HĐ…) là state của màn đang mở; màn đổi theo `hashchange`. Lùi lịch sử khi hộp đang mở đổi route, màn bị gỡ cùng hộp, chữ đã gõ mất, không có câu hỏi nào; Tiến lại không trả hộp về. DR-60 đã chặn tải lại webview trên exe (F5, Ctrl+R, menu có Refresh) vì nó làm mất thay đổi — nhưng lùi lịch sử (nút Back / XButton1 của chuột 5 nút, Alt+←, phím BrowserBack) không bị chặn. Ghi chú KYC dài (chép từ cuộc gặp, "Không sửa được sau khi lưu") là chỗ mất nhiều chữ nhất.
- **Tái hiện:** bản web ở SHA ghim (cổng 4310): Khách hàng → hồ sơ KH (lịch sử có 2 mục) → **+ Ghi chú KYC** → gõ "Ghi chu dai dang soan do" (`{"open":true,"value":"Ghi chu dai dang soan do"}`) → `history.back()` (như nút Back của chuột) → `{"open":false,"hash":"#/customers","h1":"Khách hàng"}`: hộp và bản nháp mất. Phím Alt+← gửi qua công cụ của khung trình duyệt (focus ở ô chữ, rồi ở nút "Sửa hồ sơ") không làm khung lùi trang nào cả, nên đường phím tắt chưa kiểm được; trên exe là PLAUSIBLE (WebView2 nhận nút Back của chuột và Alt+← như Edge).
- **Ảnh hưởng:** RE đang soạn ghi chú / hồ sơ, lỡ bấm nút Back của chuột (hay Alt+← khi focus ở nút / ô chọn): mất bản nháp, phải gõ lại. Không mất dữ liệu đã lưu → Low.
- **Đề xuất:** exe không cần lịch sử trình duyệt (sidebar là đường đi chính): `blockReload` chặn thêm `BrowserBack` / `BrowserForward`, Alt+← / Alt+→ (`keydown` capture) và nút chuột 3 / 4 (`mouseup` / `auxclick` `preventDefault`, Chromium bỏ điều hướng khi trang chặn); hoặc chung cho cả bản web: khi có `dialog[open]` có chữ đã gõ thì `hashchange` hỏi trước / đẩy lại route cũ. ≈ 10–20 dòng SP + ca `block-reload.test.ts`.

### CL-D6 — Câu lỗi lưu của hộp Sửa hồ sơ / Ghi chú KYC còn hiện sau khi đã sửa đúng ô gây lỗi

```
ID: CL-D6
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/CustomerDialogs.tsx:298-307 (Giới tính `onChange={setGender}`, không qua `edit`, nên không xóa `errors.form`); apps/desktop/src/routes/customers/KycDialogs.tsx:258-261 (ô Ghi chú chỉ xóa `errors.text`), :271 (ô Ngày ghi nhận `onChange={date.setText}`), :254 (`errors.form`) (8855345)
Tình trạng: CONFIRMED (hộp Sửa hồ sơ, bản web); hộp Ghi chú KYC: đọc code
```

- **Mô tả:** các hộp khác xóa câu lỗi lưu khi người dùng sửa bất kỳ ô nào (`useSaveFailure().edit`, `edit(field, …)`, `setErrors({})`). Hộp Sửa hồ sơ bỏ sót ô Giới tính: chọn "Chưa rõ" cho KH đã có giới tính → Lưu → `error.KYC_PROFILE_FIELD_REQUIRED`; chọn lại "Nữ" (đã hợp lệ) thì khung đỏ vẫn nói không chọn "Chưa rõ" được. Hộp Ghi chú KYC: lỗi từ lệnh (`errors.form`, vd. khóa ghi S-2 11g) chỉ mất khi chọn lại Trường, không mất khi sửa ghi chú hay ngày.
- **Tái hiện:** bản web (cổng 4310), hồ sơ Đỗ Gia Nhung → Sửa hồ sơ (Giới tính `Nữ*`) → chọn "Chưa rõ" → Lưu → chọn "Nữ": `{"afterSave":"Ngày sinh và giới tính đã có … sửa sang giá trị khác.","afterPickingNuAgain":"Ngày sinh và giới tính đã có … sửa sang giá trị khác.","checked":["Nữ"],"open":true}`. Đóng hộp bằng Escape, không lưu.
- **Ảnh hưởng:** chỉ câu báo cũ còn đứng tới lần Lưu kế (lần đó thành công và đóng hộp).
- **Đề xuất:** Giới tính `onChange={edit('form', setGender)}` (hoặc một khóa `gender`); ô Ghi chú / Ngày của 7a xóa cả `form`. ≈ 3 dòng.

### CL-D7 — Lớp "thẻ" / "khung báo" lặp ở ≥ 4 nơi, `badge` ba bản (Duplicated Code)

```
ID: CL-D7
Mức: Nit
Trục: B
Vị trí: CARD `rounded-lg border border-border bg-surface-1 p-4`: apps/desktop/src/routes/appointments/appointments-view.ts:63 (export), customers/CustomerKyc.tsx:26, customers/KycIntelligence.tsx:47, team/TeamScreen.tsx:31, viết thẳng ở customers/CustomerAppointments.tsx:126, customers/CustomerPolicies.tsx:47 (biến thể p-3 ở CustomersScreen.tsx:31, px-4 py-3 ở 5 file Settings*); ALERT: customers/CustomerDialogs.tsx:47 (export), team/PersonDialogs.tsx:9, SettingsAi.tsx:38, SettingsBackup.tsx:33; LINK: appointments-view.ts:68 (export), CustomersScreen.tsx:32, TeamScreen.tsx:34 (8855345)
Tình trạng: CONFIRMED (`git grep`, log §7)
```

- **Mô tả:** khối thẻ của mockup (`.card`) và khung báo (`.alert`) không có trong `@p2c/ui`, nên mỗi màn tự khai một hằng chuỗi class (cùng giá trị ở 6 nơi cho thẻ, 4 biến thể cho khung báo, 3 biến thể cho link). `appointments-view.ts` đã export `CARD`, `LINK` nhưng các màn khác khai lại. Ba helper `badge` (KNOWN #141) cùng loại.
- **Ảnh hưởng:** đổi kiểu thẻ / khung báo của G3 phải sửa nhiều file, dễ lệch giữa màn. Không có chi phí đo được (chuỗi class ~50 byte).
- **Đề xuất:** `Card` (hoặc hằng `CARD` / `ALERT` export từ `@p2c/ui`) dùng chung; ≈ −15 dòng, đụng ~10 file; test giữ hành vi: e2e hiện có (chọn theo role / nhãn) và `pnpm lint:tokens`. Làm cùng mục `badge` của sổ.

### CL-D8 — Vài mẩu thừa nhỏ của gói D

```
ID: CL-D8
Mức: Nit
Trục: B
Vị trí: apps/desktop/index.html:2 (`class="dark"`); apps/desktop/src/i18n/vi.ts:586 (`birth.error.empty`); apps/desktop/src/i18n/index.ts:30-90 (`PLAIN_SLOTS`, chỉ test dùng); apps/desktop/src/routes/customers/CustomerAppointments.tsx:80-121 (`useMemo` của cột phụ thuộc `onNext`) + CustomerProfile.tsx:93 (`next` tạo mới mỗi lần render) (8855345)
Tình trạng: CONFIRMED (`git grep`, đọc code; `exports.mjs` → `exports.log`)
```

- **Mô tả:** (1) `class="dark"` của `index.html` không có tác dụng: không nơi nào dùng biến thể `dark:` hay `.dark` (`git grep "dark:\|\.dark\b"` rỗng), chế độ tối do `color-scheme: dark` + token. (2) `birth.error.empty` không bao giờ hiện: `parseBirthDate` trả `{ ok: true, birth: null }` cho chuỗi rỗng trước khi gọi `parseQuickDate` (`customers-view.ts:117-118`). (3) `PLAIN_SLOTS` (59 tên slot) vào bundle chỉ để `index.test.ts:44` kiểm mọi slot đã được xếp loại. (4) `CustomerAppointments` ghi nhớ cột theo `[today, onNext]` nhưng `onNext` là hàm mới mỗi lần hồ sơ render, nên cột (và `columnDefs`, sắp xếp của `DataTable`) dựng lại mỗi lần — `useMemo` không có tác dụng (≤ 38 lịch / KH trên dữ liệu tải: không đo được chi phí).
- **Đề xuất:** bỏ `class="dark"`; bỏ khóa `birth.error.empty` (kiểu lỗi của `parseBirthDate` bỏ `'empty'`); `PLAIN_SLOTS` có thể chuyển vào file test; `next` dùng `useCallback` hoặc bỏ `useMemo`. Mỗi mục ≤ 5 dòng; test giữ: `i18n/index.test.ts`, `customers-view.test.ts`, e2e hồ sơ KH.

### CL-D9 — Năm lệch mockup nhỏ của gói D chưa có trong "Lệch mockup đã biết"; hai mockup đã duyệt ghi khác nhau tên nút tạo KH

```
ID: CL-D9
Mức: Nit
Trục: C
Vị trí: docs/design/mockups/customer.html:364 ("Kỳ Tất cả ▾" ở thẻ Lịch hẹn) ↔ apps/desktop/src/routes/customers/CustomerAppointments.tsx:123-152; customer-forms.html 5c ("Ngày sinh · trước: 1984") ↔ CustomerDialogs.tsx:291-297; kyc-forms.html:249-252 (7c khung "Nếu chọn mâu thuẫn ở trường cốt lõi → CONFLICT_RESOLUTION…") và 7a (nhãn "Mục tiêu · cốt lõi" cạnh trường) ↔ KycDialogs.tsx:110-147, :283-305; phase-3-feedback.html B2 ("+ KH mới") ↔ customers.html ("+ Khách hàng") ↔ vi.ts:526; docs/testing/nghiem-thu-v1.md:366-379 (8855345)
Tình trạng: CONFIRMED (so chữ mockup bằng `mocktext.mjs` với `vi.ts` / code; hộp 7c, 5c xem trên bản web)
```

- **Bằng chứng trên bản web (dữ liệu tải, cổng 4310):** 5c — `{"label":"Ngày sinh (năm hoặc đủ ngày)","value":"12/03/1974","hint":"12/03/1974 · 52 tuổi"}` (không có "trước: …"); 7c — Trường "Tình trạng hôn nhân" (cốt lõi) đang có "Đã kết hôn", chọn "Đánh dấu mâu thuẫn": chữ hộp chỉ có "Đang có: Đã kết hôn (25/01/2026) … Cập nhật: giá trị đang có thành cũ. Mâu thuẫn: chưa rõ giá trị nào đúng, giữ cả hai tới khi giải quyết.", `"mentionsGate": false` (không nhắc cổng / Phân tích). Hộp đóng bằng Hủy, không lưu.

- **Mô tả:** ngoài các lệch đã ghi (5d "· hạ nhóm", bộ lọc dòng thời gian, phần `customers.html` chờ Owner ở lượt L1) và CL-D2, CL-D3: (1) thẻ **Lịch hẹn** của hồ sơ (`customer.html`) có ô chọn "Kỳ Tất cả ▾", app không có; (2) 5c: chú thích ô Ngày sinh khi sửa là giá trị cũ ("trước: 1984"), app giữ "năm hoặc đủ ngày"; (3) 7c: khung cảnh báo trong hộp khi chọn "Đánh dấu mâu thuẫn" ở trường cốt lõi (cổng sẽ thành `CONFLICT_RESOLUTION`, nút Phân tích tắt), app không hiện — người dùng chỉ thấy hậu quả trên thẻ sau khi lưu; (4) 7a: mỗi dữ kiện đã thêm có nhãn hạng mục + "cốt lõi", app chỉ có tên trường; (5) hai mockup đã duyệt ghi khác nhau nút tạo KH: `customers.html` "+ Khách hàng" (app theo bản này, NT-KH-01 cũng vậy), `phase-3-feedback.html` B2 "+ KH mới" — mâu thuẫn chữ giữa hai mockup (trục C theo plan §"Đọc trước").
- **Ảnh hưởng:** không dòng nghiệm thu nào kiểm các điểm này (khác CL-D2, CL-D3), nên G7 không đỏ; chỉ là lệch mockup chưa được ghi nhận. (3) là điểm có ích nhất cho người dùng (biết trước việc đánh dấu mâu thuẫn cốt lõi sẽ chặn AI).
- **Đề xuất:** Owner chọn ghi cả năm vào "Lệch mockup đã biết" của `nghiem-thu-v1.md` (docs-only), hoặc làm (3) (≈ 10 dòng SP: khi `mode === 'conflict'` và `KYC_FIELDS[field].core` thì hiện một `p` cảnh báo, khóa mới trong `vi.ts`). Không sửa mockup cho khớp code khi chưa hỏi.

### CL-D10 — Đổi màn bằng liên kết (thẻ KH → hồ sơ, "← Khách hàng", sidebar) làm mất focus về `body`, không báo màn mới cho trình đọc màn hình

```
ID: CL-D10
Mức: Low
Trục: A
Vị trí: apps/desktop/src/shell/useRoute.ts:37-45 (đổi route, không quản focus / tiêu đề); apps/desktop/src/shell/AppShell.tsx:36-38 (`h1` của màn không có `tabIndex`, không được focus), :52 (`ErrorBoundary key={routeToHash(route)}` gỡ cả màn cũ cùng phần tử đang có focus); apps/desktop/index.html:7 (`<title>` cố định) (8855345)
Tình trạng: CONFIRMED (bản web)
```

- **Mô tả:** điều hướng là SPA theo hash: bấm (hoặc Enter) một liên kết thì màn cũ bị gỡ, phần tử có focus biến mất, focus rơi về `body`; không có vùng `aria-live` nào báo màn mới, `document.title` luôn là "Project-2C". Người dùng bàn phím mở hồ sơ từ thẻ kanban phải Tab lại từ đầu sidebar để tới nội dung; quay về bằng "← Khách hàng" thì mất vị trí thẻ vừa mở; trình đọc màn hình không nói đã sang màn nào. Hộp thoại đã làm đúng việc trả focus (`Dialog.tsx`), và hồ sơ đã có đích focus cho mã F (`DR5-38`) — riêng đổi màn thì chưa.
- **Tái hiện:** bản web (cổng 4310, dữ liệu tải): focus thẻ đầu cột N2 → Enter / bấm → hồ sơ mở, `document.activeElement` = `BODY`; focus "← Khách hàng" → bấm → màn Khách hàng, `activeElement` = `BODY`; `document.querySelectorAll('[aria-live]').length` = 0 lúc đó; `document.title` = "Project-2C". (`javascript_exec`, kết quả `{"afterProfile":{"tag":"BODY"…},"afterBack":{"tag":"BODY"…},"liveRegions":0,"titleTag":"Project-2C"}`.)
- **Ảnh hưởng:** người dùng bàn phím / trình đọc màn hình ở mọi lần đổi màn (thao tác thường); không sai dữ liệu → Low.
- **Đề xuất:** khi `canonical` đổi (không phải lần đầu), focus `h1` của màn (`tabIndex={-1}`, `preventScroll`) và đặt `document.title` = `t('screen.…')` + tên app; tùy chọn: về lại Khách hàng thì focus thẻ / dòng của KH vừa xem. ≈ 10 dòng SP (`AppShell.tsx` / `useRoute.ts`) + một ca e2e (`expect(page.getByRole('heading', { level: 1 })).toBeFocused()`).

## 4. Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `tsc -p packages/ui/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` và cùng lệnh cho `apps/desktop/tsconfig.json` (TypeScript 6.0.3 của repo; log `tsc-unused-ui.log`, `tsc-unused-app.log`) | `packages/ui`, app (gồm shell, i18n, customers, team) | exit 0 / exit 0, 0 dòng (hai cờ vốn bật ở `tsconfig.base.json`) | — |
| `node exports.mjs` (log `exports.log`): mọi `export` của 51 file SP `.ts/.tsx` gói D, tìm nơi dùng ngoài file bằng `git grep -w` ở `HEAD` | gói D | Không export runtime nào chết. Chỉ test dùng: `PLAIN_SLOTS` (59 tên slot, không dùng trong chính file), `COUNT_SLOTS` / `fillSlots` / `StageHead` / `compareCells` (vẫn dùng trong file — không thừa). 15 kiểu chỉ dùng trong file (không tốn gì lúc chạy) | CL-D8 |
| Khóa i18n: `node keys.mjs` (log `keys.log`) — 1 080 khóa của `vi.ts`, khóa viết thẳng hoặc dựng bằng template literal của code SP | `vi.ts` ↔ `apps/desktop/src` | 877 viết thẳng + 203 dựng động, 0 khóa chỉ test dùng, 0 khóa không dùng. Một khóa dựng động không bao giờ tới được: `birth.error.empty`. 58 chữ trùng giữa ≥ 2 khóa (khác nghĩa / khác màn: "Hủy", "Lưu", "Team"…) — không gộp | CL-D8 |
| Code lặp ≥ 3 nơi (`git grep` chuỗi class) | gói D (+ màn gói E dùng cùng chuỗi) | CARD ×6 cùng giá trị (+ biến thể ×6), ALERT ×4, LINK ×3, `badge` ×3 (KNOWN #141). Mục *Duplicated Code* khác của gói D đã có trong sổ (KNOWN: `role === 'RE' \|\| 'TL'` của `PersonDialogs`, lọc `reId` lặp ở `staffMetrics` / `personUsage`) — không nhắc lại | CL-D7 |
| Nhánh / chữ không tới được | `index.html`, `customers-view.ts`, `CustomerAppointments.tsx` | `class="dark"` không tác dụng; `birth.error.empty`; `useMemo` cột không có tác dụng vì `onNext` mới mỗi render | CL-D8 |
| Dependency của `packages/ui` | `packages/ui/package.json` | `@p2c/domain`, `@tanstack/react-table@9.2.4`, `echarts@6.1.0` (đăng ký đúng 4 module + `SVGRenderer`, ADR-0014) — đều dùng. Font: 12 `woff2` (4 độ đậm × 3 tập ký tự, 189 656 byte, `claude\D\web\assets`), cả 4 độ đậm đều có lớp dùng (`font-medium` 500, `font-semibold` 600, `font-bold` / `<b>` 700); `unicode-range` chỉ tải tập cần | — |
| Bundle | `common\baseline.md`, `claude\D\web\index.html` | `chart.js` 513 302 B (ECharts) được `modulepreload` ngay lúc mở app vì màn đầu mặc định Tổng quan có biểu đồ — thuộc bundle chung (gói F); code gói D nằm trong `index.js` 891 942 B, không tách được theo module khi không có visualizer (G4); `index.css` 28 364 B | — |
| `pnpm lint:deps`, `pnpm codemap` | `common\baseline.md` (cổng ở SHA ghim) | `lint:deps` 0 vi phạm (309 module); bản đồ export trong `CLAUDE.md` khớp code (`pnpm verify` xanh) — không chạy lại | — |
| Đề xuất refactor | — | CL-D7 (`Card` / hằng class dùng chung, ≈ −15 dòng, ~10 file; test giữ: e2e chọn theo role / nhãn, `pnpm lint:tokens`), CL-D8 (mỗi mục ≤ 5 dòng), CL-D4 (1) `stageSince` dùng chung cho kanban và hồ sơ (−1 phép tính lặp). Không đổi golden | CL-D4, CL-D7, CL-D8 |

## 4b. Hiệu năng

Máy: Home PC (i9-12900K), Node v24.20.0, đo 00:37 14/10. Lúc đo: CPU 3 %, đang mở `codex` (3 + dịch vụ), `opencode` (1), `muse-bin` (1), 20 `node` (một phần của bên khác), 6 `msedgewebview2`; server tĩnh `serve.mjs` cổng 4310 của phiên trước vẫn chạy (nhàn). Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` nhập bằng `importBackup` (817 ms): 1 481 KH sống, 10 334 lịch hẹn, 1 679 HĐ, 4 933 chuyển nhóm, 51 nhân sự sống. Hàm thuần + lệnh đọc của `@p2c/db` mà màn gói D gọi, không React. `node --import ./hooks.mjs p2-perf.mjs`, log `claude\D\p2-perf.log`. Trung vị (min–max), n lần.

| Thao tác (màn gói D) | n | Trung vị | Min–max | ID |
|---|---:|---:|---|---|
| `readTables` lần đọc đầu mỗi revision: teams / people / customers / appointments / policies / transitions | 7 | 0,13 / 0,25 / 5,58 / 45,06 / 5,98 / 9,81 ms | | — |
| Khách hàng sau một lần lưu: đọc lại customers + people + transitions + policies | 7 | 22,51 ms | 21,14–23,06 | — |
| `customerBoard` Toàn bộ / Team + RE trong team | 20 | 1,40 / 0,67 ms | 1,35–3,63 / 0,61–0,96 | — |
| Bảng KH (1 481 dòng): sắp Họ tên / Ngày sinh / Từ ngày | 20 | 1,01 / 4,47 / 0,61 ms | | — |
| Team & nhân sự: `groupByTeam` / `staffMetrics` (44 RE) / `personUsage` (một người) / `reOptions` | 20 | 0,01 / 5,92 / 0,19 / 0,22 ms | | — |
| Hồ sơ KH: lần đọc `useQuery` (`CustomerProfile.tsx`), KH thường / KH nhiều lịch nhất (38 lịch) | 20 | 8,31 / 8,48 ms | 7,97–13,24 / 7,97–9,35 | — |
| … trong đó `listPolicies(db)` mọi KH rồi lọc | 20 | 5,72 / 5,73 ms | | — |
| … view tính lúc render (`kycOverview` + `kycTimeline` + `outcomeResolver`) | 20 | 0,03 ms | | — |
| `previewCustomerProfile` (mỗi phím ở Sửa hồ sơ) / `countCustomerRecords` (hộp 5f) / `previewKycNote` | 20 | 0,16 / 2,01 / 0,01 ms | | — |

**Trên màn (bản web ở SHA ghim, có React).** `claude\D\web\` (bản `apps/desktop/dist` của bước chuẩn bị) do `serve.mjs` phục vụ ở cổng 4310, mở trong khung trình duyệt của Claude Code (Chromium), Cài đặt → Dữ liệu → Nhập backup dữ liệu tải (hộp 10c: "1.481 KH · 10.252 lịch hẹn · 1.674 HĐ"; đọc file → hộp xác nhận 995 ms, bấm Thay dữ liệu → xong 54 ms trong bản web). Đo khoảng 00:50–00:57 14/10; song song: tiến trình của bên khác như ở trên. **Cách đo:** khung trình duyệt bị ẩn nên `requestAnimationFrame` không chạy và `setTimeout` bị gom về nhịp ~15,6 ms; vì vậy đo từ thao tác tới lúc DOM hiện kết quả (React đã commit), dò bằng `MessageChannel` — **không gồm vẽ khung hình**, nên không so trực tiếp với `perf-ref.json` (exe, có vẽ); chỉ so với ngưỡng 200 ms. Nguồn `claude\D\p4-web-perf.js`.

| Thao tác (bản web, dữ liệu tải) | n | Trung vị | Min–max | So với | ID |
|---|---:|---:|---|---|---|
| Thẻ kanban → hồ sơ KH | 6 | 15,1 ms | 13,1–17,9 | exe `customer.open-ai` 19,6 ms (có vẽ); ngưỡng 200 | — |
| Hồ sơ → "← Khách hàng" (bảng đã đọc) / sau một lần lưu (đọc lại bảng) | 7 / 6 | 4,2 / 33,5 ms | 3,5–51 / 29,8–38,3 | | — |
| Khách hàng: Kanban → Bảng (1 481 dòng, hiện 100) / Bảng → Kanban | 6 | 4,2 / 1,0 ms | 3,2–7,2 / 0,5–4,7 | exe `customers.view-table` 17,9 ms | — |
| Sửa hồ sơ: mở hộp / một phím Họ tên / một phím Ngày sinh (dựng lại khung KYC 5c) / Hủy | 7 | 9,0 / 0,6 / 1,0 / 3,1 ms | 8,5–13,1 / 0,5–1,0 / 0,8–2,0 / 2,2–4,3 | | — |
| Sửa hồ sơ: Lưu → hộp đóng, tên mới trên hồ sơ | 6 | 15,9 ms | 14,1–19,4 | (exe còn ghi file DB ở nền, `db.save` 140 ms, không chặn màn) | — |
| Ghi chú KYC: mở hộp / chọn Trường / Thêm dữ kiện / Lưu ghi chú → dòng thời gian có ghi chú | 6 | 12,7 / 0,4 / 0,5 / 24,4 ms | 6,9–15,9 / 0,2–0,8 / 0,3–0,8 / 16,9–28,7 | | — |
| → Team & nhân sự sau một lần lưu (đọc lại customers, appointments, policies) | 6 | 59,3 ms | 55,2–94,5 | exe `reload.team` 247,5 ms (màn đầu sau tải lại, có vẽ) | — |
| Team: chọn team khác / Sửa nhân sự (mở hộp) / Xóa nhân sự (hộp 9b, `personUsage`) | 6 | 0,6 / 5,5 / 3,2 ms | | | — |
| Góc nhìn Toàn bộ → Team (hiện hàng chọn RE) / bấm một RE / Team → Toàn bộ | 1 / 5 / 1 | 3,9 / 1,2 / 2,1 ms | — / 1,0–1,6 / — | | — |

Không có phát hiện P ở gói D: mọi thao tác màn của gói D dưới 100 ms (xa ngưỡng 200 ms), mọi phép thuần dưới 10 ms trừ lần đọc bảng `appointments` mỗi revision (45 ms, Node) — phần lớn của "→ Team sau một lần lưu" (59 ms); không có phép bậc hai (`customerBoard`, `staffMetrics`, `personUsage` là lọc / đếm tuyến tính, `byStage` 6 lần lọc 1 481 thẻ). Hồ sơ KH: 70 % lần đọc `useQuery` (5,7 / 8,3 ms) là `listPolicies(db)` của **mọi** KH rồi lọc lấy một KH — nhỏ, không báo; nếu cần thì thêm lệnh đọc HĐ theo KH.

## 5. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | CL-D5 | CL-D1*, CL-D2, CL-D3 | | | | | | CL-D4 | CL-D10, (CL-D1) | 6 |
| Nit | | CL-D6, CL-D9 | | | | | CL-D7, CL-D8 | | | 4 |

\* gắn hai trục, đếm một lần ở trục chính (trục phụ trong ngoặc). 10 phát hiện; CONFIRMED 10 / 10 ở phần chính, riêng hai phần phụ là PLAUSIBLE: đường nút Back của chuột / Alt+← trên exe của CL-D5 (đã chạy `history.back()` trên bản web, chưa chạy exe) và nửa hộp Ghi chú KYC của CL-D6 (đọc code). Kết luận "e2e giết X1, X3, X4, X8" ở §6 T là theo đọc phép kiểm e2e, không chạy e2e trên đột biến. Tỉ lệ PLAUSIBLE thấp. Không có KNOWN mới: các mục của sổ chạm gói D (#141, #144, #541, token R4) chỉ được nhắc ở §6, không có bằng chứng mới.

## 6. Đã xét, không thấy

- **E — edge case.** `p5-edges.mjs` (log `p5-edges.log`): KH sinh 29/02/1984 → tuổi 41 / 42 / 44 vào 28/02/2026, 01/03/2026, 29/02/2028 (không ném lỗi; `toDayNumber` dồn 29/02 năm thường về 01/03); `parseBirthDate`: " 1984 " và "1984" + NBSP nhận, "0984", "12/3/84", "12/3", "１９８４" (chữ số toàn khổ) → "format", "1899" → ngoài 1900–2100, "2027" và "15/10/2026" → sau hôm nay, "29/02/1985" → ngày không có, rỗng → không có ngày sinh; `parseRecordDate` "31/12" ngày 14/10 → "future" (gợi ý gõ đủ năm — KNOWN R3), "29/2" năm 2026 → ngày không có; `allowedStages`: KH đóng chỉ N3 hoặc nhóm đóng còn lại, KH mở không có chính nó; `parseHash`: id có `/`, `?`, `#` đi vòng qua `routeToHash` đúng, `%` hỏng / đoạn thừa / chữ hoa → null rồi về màn đã lưu. Hộp: Escape đóng và trả focus về nút mở (bản web, hộp 7d); Sửa hồ sơ → Xóa KH… → Hủy trả về hộp cũ còn nguyên chữ (state nằm ở `CustomerFormDialog`, đọc code + e2e `customer-forms.spec.ts:250-256`); xóa KH khi hồ sơ đang mở: lần render kế `getCustomer` → `undefined` → "Không tìm thấy KH", không chạy lại `countCustomerRecords` trên KH đã xóa; tick "thay đổi quan trọng" rồi bỏ hết dữ kiện: cờ ẩn vẫn gửi nhưng `recordKycNote` bỏ qua khi không có dữ kiện (`kyc.ts:138`); góc nhìn trỏ tới team / RE đã xóa hay RE đã đổi team → về team / RE đầu hoặc cả team (`scope.ts`, SC1–SC3 bị giết). Ctrl / Shift / chuột giữa trên liên kết: app không đặt `on_new_window` (`git grep` trong `src-tauri` rỗng), `wry-0.55.1` khi không có handler thì `SetHandled(true)` → WebView2 không mở cửa sổ thứ hai. Ngoài CL-D5 không thấy gì.
- **C — hợp đồng / mockup / nhãn.** So chữ mockup (`mocktext.mjs`) với `vi.ts` / code: `customers.html`, `customer.html`, 5a–5f, 7a–7e, 9a–9c, B1–B2, 11f; so `nghiem-thu-v1.md` NT-CH-01–08, NT-KH-01–15, NT-HS-01–12, NT-TM-01–14 với chữ và hành vi của app: khớp, trừ CL-D2 (NT-HS-05), CL-D3 (NT-HS-08) và các lệch đã ghi (5d "· hạ nhóm" #141, bộ lọc dòng thời gian #462, phần `customers.html` chờ Owner ở L1, `team.html` thay bởi B1). Nhãn theo nghĩa thường: "KH đang mở" = N4–N1 (`isPipelineStage`, TV2 bị giết), "Lịch hẹn 30 ngày" = 30 ngày tính cả hôm nay (TV1, TV7), "HĐ năm yyyy" = HĐ phát hành trong năm dương lịch (TV3), "Từ ngày" = ngày vào nhóm hiện tại (CV1, CV2), số "Cả team" = cộng số các RE (`openByRe` chỉ đếm KH mở, CV3) — đúng. Ngoài CL-D1 (hộp 9b), hộp và lệnh dùng cùng luật (hộp KYC xem trước bằng chính hàm `domain` mà lệnh dùng — KV8–KV12 bị giết; 5c dùng `previewCustomerProfile` chung code ghi).
- **D — dữ liệu.** Mọi thao tác ghi của gói D đi qua `app.run` / `data.run` (10 chỗ, `git grep`), nên vào khóa ghi S-2 và hàng lưu; gói D không tự viết SQL, đọc qua `useQuery` / `useTables`; `useDatabase()` chỉ dùng cho xem trước 5c. Xóa KH / nhân sự / team đều xóa mềm (lệnh `db`); hộp 5f đếm bằng `countCustomerRecords` (cùng hàm Thùng rác dùng). Không thấy đường nào ghi dữ liệu sai từ màn gói D.
- **G — guardrail AI.** Không áp dụng trực tiếp: chỗ gói D chạm AI (`ConfirmFactDialog`, `NoteEvent`, `KycIntelligence` trong hồ sơ) dùng lại lệnh `confirmKycFact` / `markKycConflict` có `noteId`, không tự lưu — đã xét ở gói C.
- **S — ranh giới.** `git grep` `dangerouslySetInnerHTML`, `innerHTML`, `eval(`, `new Function`, `target="_blank"`: không có trong gói D; mọi `href` là hash nội bộ (`routeToHash`); chữ người dùng hiện qua React; `fillSlots` thay một lượt bằng hàm, tên "{count} $& $1" giữ nguyên (`p5-edges.log`); chặn tải lại F5 / Ctrl+R / menu (DR-60) đúng — chỉ test hở (CL-D4), lùi lịch sử chưa chặn (CL-D5).
- **P — hiệu năng.** Bảng §4b: không có phép nào gần 200 ms.
- **B — bloat.** Bảng §4.
- **T — test.** Đột biến 65 (§7): 57 bị unit test giết; 8 sống qua cả 2 755 test vitest: X1 (đổi chỗ "đã gặp" / "lần tính RF" ở 5f — e2e `customer-forms.spec.ts:244` kiểm số đã gặp đúng, số RF chỉ `\d+`: KNOWN #541), X3, X4, X8 (e2e `customer-kyc.spec.ts:119-131`, `team.spec.ts:297`, `dialog-keyboard.spec.ts:26-37` có phép kiểm đúng hành vi đó — theo đọc), X5, X6, BR3, BR4 → CL-D4. Coverage (`common\baseline.md`): `shell` 81 % vì `useRoute.ts` 0 % (hook React; e2e `navigation.spec.ts` giữ "mở lại về màn cuối", "hồ sơ giữ Khách hàng được chọn"; `customers.spec.ts:86` id lạ). Test gói D không phụ thuộc ngày hệ thống (`git grep "new Date\|Date.now\|Math.random"` trong test gói D: chỉ có ở `ai-panel-view.test.ts` — gói C — với ngày cố định).
- **A — trợ năng / i18n.** Tương phản (`contrast.mjs` → `contrast.log`, WCAG 2): mọi cặp chữ / nền gói D dùng ≥ 4,89:1 (thấp nhất `text-fg-3` trên `surface-3`), nút chính 9,56:1, nút xóa 7,26:1, viền focus 8,94:1; dưới 3:1 chỉ có thành phần không phải chữ: viền ô nhập 1,88:1, mũi tên sắp xếp 1,76:1 (KNOWN, token G3 R4), viền chip `Choices` chưa chọn 1,47:1 (cùng token `--border`, chip có chữ nhận diện; trạng thái chọn có viền accent 8,94:1) — không báo riêng. Vai trò / tên: `Choices` là `radiogroup` có `legend`, `aria-required`; `Segmented` tab-roving + phím mũi tên; sidebar `aria-current="page"`; hàng chọn RE và danh sách team `aria-pressed`; `DataTable` `aria-sort`; hộp `aria-labelledby` tiêu đề, focus vào ô `autoFocus`, trả focus khi đóng; dấu ✓ ○ ! `aria-hidden` có chữ trạng thái đi kèm. i18n: `keys.mjs` 0 khóa thừa; `slots.mjs` (log `slots.log`) 879 lời gọi `t()` tĩnh, 0 thiếu slot (4 chỗ báo là khuôn cố ý: `split('{value}')`, `withSameChat`, nhãn kỳ của `PeriodPicker`); chuỗi cứng trong JSX của gói D: chỉ dấu ngoặc kép bao giá trị ở `KycDialogs.tsx:398` (mockup 7d cũng có; cùng loại NIT `:` của #469) — không báo riêng. Ngoài CL-D10 (focus khi đổi màn) không thấy gì.

## 7. Phụ lục

**Probe / script (thư mục `claude\D\`, đều chỉ đọc repo ở SHA ghim, chỉ ghi trong `claude\D\`):**

- `hooks.mjs` — nạp TypeScript của repo trong Node (chép từ gói B qua C).
- `list.mjs` → `list.log` — danh sách file gói D theo `classifyFile` (phiên đầu).
- `p1-person-delete.mjs` → `p1-person-delete.log` (CL-D1, phiên đầu).
- `contrast.mjs` → `contrast.log` (§6 A, phiên đầu).
- `serve.mjs` — server tĩnh cho `web\` (bản `apps/desktop/dist` ở SHA ghim), cổng 4310 (phiên đầu khởi động, phiên hai dùng tiếp, tắt cuối phiên).
- `p2-perf.mjs` → `p2-perf.log` (§4b; phiên đầu viết, phiên hai chạy).
- `p3-seed-conflicts.mjs` → `p3-seed-conflicts.log` (CL-D3: KH có mâu thuẫn trong seed demo của bản web hôm nay).
- `p4-web-perf.js` — các đoạn `javascript_exec` đo thao tác màn trên bản web (§4b).
- `p5-edges.mjs` → `p5-edges.log` (§6 E).
- `mocktext.mjs` — chữ hiện ra của một mockup (so với `vi.ts`).
- `keys.mjs` → `keys.log`, `slots.mjs` → `slots.log`, `exports.mjs` → `exports.log` (§4, §6 A).
- `tsc-unused-ui.log`, `tsc-unused-app.log` (§4).
- `mutate.mjs` → `mutate.log`, `mutate-results.json`; bản gốc trước đột biến ở `orig\` (phiên đầu).
- `web\` — bản web ở SHA ghim.

**Đột biến** (`mutate.mjs`, phiên đầu 00:14–00:24: patch một file SP gói D trong worktree, chạy test gói D — `packages/ui`, `apps/desktop/src/{shell,i18n,routes/customers,routes/team}`, `ui-choices` — với `--bail=1`, sống thì chạy cả bộ vitest; trả file về từng byte, so `git show HEAD:` trước / sau; e2e **không** chạy vì cổng 4173 dùng chung). 65 đột biến:

- **Sống qua cả bộ vitest (8):** X5, X6, BR3, BR4 → CL-D4; X1 → KNOWN #541; X3, X4, X8 → có e2e kiểm đúng hành vi (theo đọc, §6 T).
- **Bị giết (57):** CV1–CV9; KV1–KV12; TV1–TV7; RT1–RT5, RT6 (chỉ ngoài tập con: `trash-view.test.ts`); SC1–SC5; CG1, CG2; BR1, BR2; SE1, SE2; I1–I5; U1, U3–U8. Tên test giết từng đột biến ở `mutate.log`.
- Dòng cuối `mutate.log`: `git status --short after: ""`.

**Thao tác trên bản web (cổng 4310; dữ liệu trong bộ nhớ của trình duyệt, không ghi gì ra đĩa):** mở hộp 7d (CL-D3); Sửa hồ sơ → "Chưa rõ" → Lưu bị từ chối → đóng (CL-D6); Ghi chú KYC + `history.back()` (CL-D5); đổi màn bằng liên kết (CL-D10); nhập dữ liệu tải qua Cài đặt → Dữ liệu và đo (§4b; lúc đo có ghi vào DB trong bộ nhớ: đổi tên vài KH, thêm 6 ghi chú KYC — chỉ trong phiên trình duyệt đó); kiểm 5c / 7c (CL-D9, đóng bằng Hủy).

**Tác dụng phụ ngoài repo:** không mở exe, không gọi dịch vụ AI, không đọc key, không chạy `pnpm e2e`; server tĩnh cổng 4310 (của phiên đầu) tắt cuối phiên; `web\load.p2cbackup` (bản chép 16 MB của dữ liệu tải, chỉ để bản web tải về) xóa cuối phiên.

**`git status --short` cuối phiên** (14/10/2026 01:02): rỗng; `git rev-parse HEAD` → `885534549808f42aec7f9af5743bbf86642ee4bd`. Cổng 4310 không còn tiến trình nghe.

**Giờ xong:** 14/10/2026 01:02 (+07:00).
