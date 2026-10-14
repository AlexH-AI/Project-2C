XONG — claude gói D, 2026-10-14 17:09

# Deep review Phase 1–6, lượt 1 — Claude, gói D (Màn nhập liệu)

## 1. Đầu phiên

- Bên: Claude (Opus 5.5), phiên sạch, chỉ đọc.
- Gói: D — Màn nhập liệu (`packages/ui/**` trừ `scripts/`, `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` trừ file AI và Hợp đồng, `routes/team/**`, `routes/Screen.tsx`, `apps/desktop/src/*`, `apps/desktop/index.html`).
- Worktree: `C:\workspace\Project-2C-review`, `git rev-parse HEAD` = `885534549808f42aec7f9af5743bbf86642ee4bd`.
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-14 16:40.
- Máy: Office Laptop `D13_THINKPAD`. Song song: phiên Codex có thể đang chạy ở `Project-2C-review-2`.
- Đã đọc trước: `common\plan.md`, `known.md`, `baseline.md`, `prompt-claude.md`; danh sách phát hiện `claude\A.md`, `B.md`, `C.md` (để không báo lại: CL-B6 đã nêu câu `storage.openFailedHelp` / `startup-error.ts`, nên gói D không nêu lại).

## 2. Phạm vi đã đọc

- Tài liệu: `CLAUDE.md` gốc, `packages/ui/CLAUDE.md`, `apps/desktop/CLAUDE.md`, `CONTEXT.md`, `.claude/rules/{i18n-ui,mockups}.md`, `docs/design/phase-3-du-lieu.md` (cả file), `docs/design/phase-6-hoan-thien.md` (cả file), mockup `docs/design/mockups/README.md`, `customer-forms.html` (5a–5f, cả file), `customer.html` (cả file), `kyc-forms.html` (7a–7e), `docs/testing/nghiem-thu-v1.md` (dòng NT-KH, NT-HS, NT-TM, mục "Lệch mockup đã biết").
- `packages/ui/src`: `index.ts`, `components/{Button,Dialog,TextField,SelectField,Choices,Segmented,DataTable,show-more,compare-cells,PeriodPicker,PeriodPicker.label,Chart,chart-theme,NavIcon,StageBadge,PolicyBadge}.tsx/.ts`, `token-guard.ts`, `tokens.css`, `theme.css`; `package.json`, `tsconfig.json`.
- `apps/desktop`: `index.html`, `src/{main.tsx,App.tsx,index.css,ui-choices.test.tsx}`, `routes/Screen.tsx`; `shell/*` (16 file SP + 6 test); `i18n/index.ts`, `i18n/vi.ts` (1 197 dòng, cả file), `i18n/index.test.ts`.
- `routes/customers` (phần D): `CustomersScreen.tsx`, `customers-view.ts`, `CustomerProfile.tsx`, `CustomerDialogs.tsx`, `CustomerKyc.tsx`, `CustomerAppointments.tsx`, `KycDialogs.tsx`, `kyc-view.ts`.
- `routes/team`: `TeamScreen.tsx`, `team-view.ts`, `PersonDialogs.tsx`, `TeamDialogs.tsx`.
- Chỗ gói khác mà D nối vào (đọc phần liên quan): `apps/desktop/src/data/{AppDataContext.tsx,tables.ts}`, `packages/db/src/{errors.ts,counts.ts}`, `team.ts:110-215` (lệnh nhân sự, `isPersonInUse`), `appointments.ts` (chữ ký lệnh), danh sách `throw new DbError` của `packages/db/src`, `packages/domain/src/kyc-fact.ts`, `period.ts` (`compareDates`, `parseQuickDate`, `toDayNumber`), `tools/size-report-core.mjs` (luật xếp gói), `tools/load-data.mjs` (loader), `packages/db/src/customers.ts` (`updateCustomerProfile`, `listStageTransitions`, `listCustomers`), `kyc.ts:95-175` (`recordKycNote`), `appointments.ts:150-190` (`recordOutcomeWithNext`), `apps/desktop/src/routes/appointments/AppointmentDialog.tsx:80`, `AppointmentsScreen.tsx:244-254`, `:626-650` (nút của lịch), `vitest.config.ts`, `eslint.config.js`, `tsconfig.base.json`, `playwright.config.ts`, `e2e/serve.mjs`, `e2e/support.ts`, `e2e/perf/probe.perf.ts` (cách đo), grep các spec e2e của gói D (`customers`, `customer-forms`, `customer-kyc`, `team`, `data-table`, `backup`).
- Mockup đối chiếu thêm: `customers.html` (khung đã đóng), `appointment-forms.html` (6c "sửa ở lịch mới", "Ý anh là" — khớp app).

## 3. Phát hiện

### CL-D1

```
ID: CL-D1
Mức: Low
Trục: C (UI ↔ lệnh), E
Vị trí: apps/desktop/src/routes/team/team-view.ts:111-119 (personUsage: không đếm người đánh giá kết quả), apps/desktop/src/routes/team/PersonDialogs.tsx:143 (inUse), :193 (câu "Nhân sự được xóa mềm…"); packages/db/src/team.ts:172 (softDeletePerson → isPersonInUse gồm reviewsLiveAppointment); apps/desktop/src/i18n/vi.ts:1114-1115 (error.PERSON_IN_USE) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Hộp 9b "Xóa nhân sự" quyết định bật / tắt nút Xóa theo `personUsage` (KH, lịch hẹn, HĐ là RE; số lịch là người phối hợp), nhưng lệnh `softDeletePerson` còn từ chối khi người đó là **người đánh giá kết quả** (D9) của một lịch chưa xóa. Một IS / TL / BD / BDM chỉ đánh giá kết quả (không phối hợp) thấy hộp ghi "Nhân sự được xóa mềm…", nút Xóa bật; bấm Xóa thì nhận câu `error.PERSON_IN_USE` nói về "KH, lịch hẹn hoặc HĐ ghi cho mình… Giữ vai trò RE" — sai với một IS, không nói lý do thật (là người đánh giá kết quả) cũng không nói cách gỡ (Sửa kết quả, bỏ người đánh giá).
- **Tái hiện / bằng chứng:** `node D\p1-reviewer-delete.mjs C:\workspace\Project-2C-review` (nguồn §7): DB mới, IS "IS Tạm" là người đánh giá một lịch Đã gặp (không phối hợp). Kết quả (`D\p1-reviewer-delete.log`):
  ```
  IS IS Tạm
    dialog usage (personUsage): {"customers":0,"appointments":0,"policies":0,"coordinating":0} → Xóa ENABLED, body "Nhân sự được xóa mềm…"
    softDeletePerson: refused PERSON_IN_USE: "Nhân sự còn KH, lịch hẹn hoặc HĐ ghi cho mình, kể cả của KH đã xóa (khôi phục KH cần RE này). Giữ vai trò RE, hoặc giữ lại thay vì xóa."
  TL TL Thử
    … → Xóa ENABLED …   softDeletePerson: deleted
  ```
- **Ảnh hưởng:** Owner / TL dọn nhân sự hỗ trợ (vd. NT-TM-14 với một IS đã từng đánh giá kết quả): bấm Xóa → câu báo sai hướng, không biết phải bỏ người đánh giá ở lịch nào. Không mất / sai dữ liệu (lệnh vẫn chặn đúng). Khác mục ACCEPTED R1 (PERSON_IN_USE đếm KH đã xóa): đây là người **không phải RE** và lịch **còn hiện** trên màn.
- **Đề xuất:** `personUsage` đếm thêm `reviewing` (lịch chưa xóa có `outcomeReviewerId` = người) và hộp 9b hiện dòng "n lịch hẹn là người đánh giá kết quả"; hoặc lệnh ném `REVIEWER_IN_USE` (đã có câu riêng) thay cho `PERSON_IN_USE` khi chỉ vướng vai người đánh giá. ≈ 15 dòng SP + 1 test `team-view.test.ts` + 1 ca `team.test.ts`.
- Ghi thêm: trên dữ liệu tải không có ca này (7 người hỗ trợ đều là người phối hợp của lịch đang hiện nên hộp đã tắt nút Xóa — `D\p2-perf.log` dòng cuối); gặp với người hỗ trợ mới thêm hoặc TL chỉ làm người đánh giá.

### CL-D7

(đánh số theo thứ tự tìm ra; đặt ở đây vì mức cao nhất của gói)

```
ID: CL-D7
Mức: Medium
Trục: C (nhãn "lịch hẹn … cũ"), D, E (luồng nhiều bước D → E → chỉ số)
Vị trí: apps/desktop/src/i18n/vi.ts:544 (customerForm.reHelp "Đổi RE: lịch hẹn và HĐ cũ vẫn tính cho RE đã ghi…"), apps/desktop/src/routes/customers/CustomerDialogs.tsx:220-222 (updateCustomerProfile, chỉ đổi customers.re_id); packages/db/src/customers.ts:130-148; packages/db/src/appointments.ts:185 (recordOutcomeWithNext: lịch tiếp theo `{ ...recorded }` giữ RE của lịch cũ); apps/desktop/src/routes/appointments/AppointmentDialog.tsx:80 ("Hẹn tiếp" điền sẵn `from.reId`); packages/db/src/appointments.ts (AppointmentDetails không có reId; rescheduleAppointment giữ RE) (8855345)
Tình trạng: CONFIRMED (hành vi); luật mong muốn cần Owner chốt
```

- **Mô tả:** Bàn giao KH (hộp 5c, đổi "RE phụ trách") chỉ đổi `customers.re_id`. Hộp nói "lịch hẹn và HĐ **cũ** vẫn tính cho RE đã ghi", nhưng cả lịch **dự kiến** (chưa diễn ra) của KH cũng ở lại với RE cũ, và mọi lịch nối tiếp sinh ra sau bàn giao cũng mang RE cũ: "Hẹn lần tiếp theo" của hộp kết quả 6c chép RE của lịch vừa ghi (không có ô RE, mockup ghi "sửa ở lịch mới" nhưng lịch Dự kiến không có lối sửa RE nào), "Hẹn tiếp" (6h) điền sẵn RE của lịch cũ. Không lệnh nào đổi được RE của một lịch (`AppointmentDetails` không có `reId`, dời lịch giữ RE); đường vòng duy nhất là xóa rồi tạo lại lịch. Kết quả: cuộc gặp do RE mới phụ trách tính "Đã gặp" và **RF cho RE cũ**; Lịch hẹn ở góc nhìn RE mới không có lịch sắp tới của KH mình phụ trách; RE cũ không xóa / đổi vai trò được vì còn "lịch hẹn ghi cho RE này".
- **Tái hiện / bằng chứng:** `node D\p7-handover.mjs` (lệnh `@p2c/db` + `periodMetrics` của `@p2c/domain`, như màn gọi; nguồn §7), `D\p7-handover.log`:
  ```
  customer RE after 5c: B
  planned meeting of today, RE: A (old)
  next appointment booked with the outcome, RE: A (old)
  rescheduled next appointment, RE: A (old)
  October, scope RE A (old): RF 1, met 1, planned 1, customers in charge 0
  October, scope RE B (new): RF 0, met 0, planned 0, customers in charge 1
  ```
- **Ảnh hưởng:** TL / Owner bàn giao KH khi RE nghỉ hoặc chia lại KH (thao tác bình thường, NT-KH-09): chỉ số RF / Đã gặp / Tỉ lệ chốt của RE cũ và RE mới (và của team nếu hai RE khác team) ở Tổng quan, Báo cáo, Excel lệch dần theo mỗi cuộc gặp sau bàn giao mà không ai thấy, trừ khi để ý cột RE của từng lịch. NT-KH-09 chỉ kiểm lịch Đã gặp và HĐ cũ nên không lộ.
- **Đề xuất (cần Owner chọn luật):** (a) 5c chuyển luôn các lịch **Dự kiến** của KH sang RE mới trong cùng transaction, hộp 5c nói rõ ("n lịch dự kiến chuyển sang RE mới"); lịch đã có kết quả giữ RE cũ như hiện nay. Hoặc (b) cho đổi RE của lịch Dự kiến (6f / dời lịch) và cho 6c / 6h điền sẵn RE **hiện tại của KH** thay cho RE của lịch cũ. (a) ≈ 40 dòng SP (`customers.ts`, `CustomerDialogs.tsx`, `vi.ts`) + test lệnh và e2e NT-KH-09 mở rộng; giữ bất biến backup luật 5 (RE của lịch chưa xóa là RE chưa xóa).

### CL-D2

```
ID: CL-D2
Mức: Low
Trục: C (mockup / danh sách nghiệm thu)
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:316-325 (FactValue không nhận `hint` trong KycNoteDialog), :132 (TextField "Giá trị" không có dòng đọc lại); docs/design/mockups/kyc-forms.html:213-215 (7b), :236-238 (7c); docs/testing/nghiem-thu-v1.md:176 (NT-HS-05) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Mockup 7b / 7c (G3) cho ô giá trị của trường tiền ("Thu nhập năm", "Tổng tài sản") dòng đọc lại `6.000.000.000 ₫ (6 tỷ)` / `40.000.000.000 ₫ (40 tỷ)` như mọi ô tiền khác của app ("Mọi ô ngày / tiền hiện ngay giá trị app đã hiểu"), và NT-HS-05 của danh sách nghiệm thu v1.0 kiểm đúng câu đó. Hộp "Ghi chú KYC" không có dòng đọc lại nào cho giá trị (trường tiền là `text` trong `kyc-fact.ts:23-27`, lưu nguyên chữ gõ). Không nằm trong "Lệch mockup đã biết" của `nghiem-thu-v1.md`.
- **Tái hiện / bằng chứng:** `node D\p3-ui.mjs` (bản web dựng riêng ở `D\web`, Edge headless; nguồn §7), log `D\p3-ui.log`:
  ```
  [7b] Thu nhập năm "6 tỷ": aria-describedby = null | dialog has "6.000.000.000": false | has "₫": false
  [7b] KYC card line: Thu nhập năm: 6 tỷ
  [7c] lines: ["Đang có: 6 tỷ (14/10/2026)"]
  ```
- **Ảnh hưởng:** G7: dòng NT-HS-05 sẽ ghi "Lỗi". RE gõ "6tr" hay "6 ty" không thấy app hiểu thế nào trước khi lưu (giá trị lưu nguyên chữ, không sai dữ liệu). Chỉ hiển thị.
- **Đề xuất:** với trường tiền của danh mục KYC (`annualIncome`, `totalAssets`, `liabilities`… — cần chốt danh sách), truyền `hint` = `formatVnd(parseVnd(text))` + `formatVndCompact` khi đọc được (như ô FYP), không đổi kiểu lưu. ≈ 20 dòng SP (`KycDialogs.tsx`, `kyc-view.ts`) + unit test hàm hint. Hoặc Owner ghi vào "Lệch mockup đã biết" và sửa NT-HS-05 (mockup / checklist là nguồn đúng nên phương án đầu được ưu tiên).

### CL-D3

```
ID: CL-D3
Mức: Low
Trục: C (mockup customer.html)
Vị trí: apps/desktop/src/routes/customers/CustomerKyc.tsx:256-271 (sự kiện chuyển nhóm của dòng thời gian), apps/desktop/src/i18n/vi.ts:73 (customer.byMeeting 'sau cuộc gặp'); apps/desktop/src/routes/customers/CustomerAppointments.tsx:128-138 (đầu thẻ Lịch hẹn, không có ô Kỳ); docs/design/mockups/customer.html:334-335, :349-350, :364 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Hai lệch mockup `customer.html` chưa có trong "Lệch mockup đã biết" (`nghiem-thu-v1.md` chỉ ghi: mã F và bộ lọc Tất cả / KYC / Lịch hẹn của dòng thời gian):
  1. Chuyển nhóm do cuộc gặp trên **Dòng thời gian**: mockup ghi "N3 → N2 · tính 1 RF" / "N2 → N1 · không tính RF" và dòng ngày "· sau cuộc gặp lần 3"; app chỉ ghi "N3 → N2 sau cuộc gặp" — không nói RF, dù thẻ **Lịch hẹn** ngay dưới ghi "N3 → N2 · RF" cho cùng cuộc gặp.
  2. Thẻ **Lịch hẹn** của hồ sơ: mockup có ô "Kỳ Tất cả ▾" ở đầu thẻ; app không có ô lọc nào.
- **Tái hiện / bằng chứng:** `D\p3-ui.log` (KH seed "Phan Gia Chi"):
  ```
  [timeline] KH Phan Gia Chi: stage events by a meeting: ["01/10/2026 | N2 | → | N1 | sau cuộc gặp","22/07/2026 | N3 | → | N2 | sau cuộc gặp", …]
  … appointments card RF lines: ["22/07 14:00\tN3 → N2 · RF\t"]
  [appointments card] comboboxes (Kỳ filter of the mockup): 0 | meta: 5 lịch · 5 đã gặp
  ```
  NT-HS-11 đã viết theo app ("sau cuộc gặp"), nên lệch không lộ ở nghiệm thu.
- **Ảnh hưởng:** Chỉ hiển thị: RE đọc dòng thời gian không biết lần chuyển nhóm nào đã tính RF (phải nhìn sang thẻ Lịch hẹn); KH nhiều lịch không lọc theo kỳ được (bảng có "Hiện thêm" nên vẫn xem được).
- **Đề xuất:** (1) thêm "· tính RF" / "· không tính RF" theo `isRfTransition` cho sự kiện có `appointmentId` (≈ 10 dòng SP, 1 ca e2e `customer-kyc.spec.ts`); (2) ô Kỳ: hoặc làm (≈ 40 dòng, dùng lại `PeriodPicker` / bộ chọn đơn giản), hoặc Owner ghi cả hai vào "Lệch mockup đã biết".

### CL-D4

```
ID: CL-D4
Mức: Low
Trục: E, C (cùng việc, hai màn xử lý khác nhau)
Vị trí: apps/desktop/src/routes/customers/CustomersScreen.tsx:145 (CustomerFormDialog chỉ có onClose), apps/desktop/src/routes/customers/CustomerDialogs.tsx:169 (`reId` mặc định ''), :219-229 (save → onClose, không báo gì); so với apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:248-254 (appointments.createdOutside, NT-LH-20) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Ở Khách hàng với Góc nhìn = một RE (hoặc Team / RE chọn ở dải RE), tạo KH mới cho RE khác: hộp đóng, danh sách và số "n KH đang mở" không đổi, không có dòng báo nào — KH đã được tạo nhưng nằm ngoài góc nhìn. Màn Lịch hẹn gặp đúng tình huống này thì báo "Đã tạo lịch hẹn … RE này nằm ngoài góc nhìn hiện tại nên lịch không hiện ở đây; đổi góc nhìn để xem." (NT-LH-20). Ô "RE phụ trách" cũng không điền sẵn RE của góc nhìn, nên chọn nhầm RE dễ xảy ra.
- **Tái hiện / bằng chứng:** `node D\p6-outside-scope.mjs` (bản web, seed), `D\p6-outside-scope.log`:
  ```
  scope RE: Bùi Kim Hùng · Bình Minh
  before: 34 KH đang mở · 6 đã đóng
  RE field preset to the scope RE: ""
  RE picked: Hoàng Đức Nhung · Bình Minh
  after: 34 KH đang mở · 6 đã đóng
  status / alert messages on the screen: []
  new customer visible: 0
  ```
- **Ảnh hưởng:** RE / TL đang lọc theo một RE, tạo KH và tưởng chưa lưu → tạo lần hai: hai KH trùng (hai mã K-xxxx), lệch "KH theo nhóm" của Tổng quan / Báo cáo tới khi xóa bớt một. Đường vòng: đổi góc nhìn. Không mất dữ liệu.
- **Đề xuất:** như Lịch hẹn: sau `createCustomer`, KH ngoài `scope` thì hiện dòng `role="status"` (khóa mới trong `vi.ts`, vd. "Đã tạo KH … cho RE …, nằm ngoài góc nhìn hiện tại…") kèm link mở hồ sơ; và / hoặc điền sẵn RE của góc nhìn (RE hoặc RE chọn ở dải). ≈ 25 dòng SP + 1 e2e.

### CL-D5

```
ID: CL-D5
Mức: Nit
Trục: A (i18n)
Vị trí: apps/desktop/src/routes/customers/CustomerKyc.tsx:84 ("{trường}: {giá trị}"), :153 và :245 (`.join(', ')` thay cho `sep.list`), apps/desktop/src/routes/customers/KycDialogs.tsx:115-116 (`${giá trị} (${ngày})` nối bằng `'; '`), :398 (dấu ngoặc kép quanh giá trị) (8855345)
Tình trạng: CONFIRMED (đọc code + `D\hardcoded-ui.log` không thấy chuỗi chữ cứng khác)
```

- **Mô tả:** Dấu nối / dấu câu của dòng UI viết thẳng trong JSX, trong khi `vi.ts` đã có `sep.list` (', ') và quy tắc i18n là không chuỗi UI cứng; `lint:tokens` chỉ chặn `·` và `→` nên không bắt. Cùng loại với NIT đã ghi cho `KycExtraction.tsx:96` (sổ review #469).
- **Tái hiện / bằng chứng:** đọc các dòng trên; probe `D\hardcoded-ui.mjs` (quét text node / thuộc tính nhãn / literal trong JSX của gói D) không thấy chuỗi tiếng Việt cứng nào khác.
- **Ảnh hưởng:** không ai thấy khác biệt khi app chỉ có tiếng Việt; chỉ là chỗ phải nhớ khi đổi câu.
- **Đề xuất:** dùng `t('sep.list')` và khuôn câu trong `vi.ts` (vd. `kycNote.currentValue: '{value} ({date})'`). ≈ 10 dòng, gộp vào lần chạm sau của hai file.

### CL-D6

```
ID: CL-D6
Mức: Nit
Trục: T
Vị trí: vitest.config.ts:12-23 (coverage.include không có `packages/ui/src/**`, `apps/desktop/src/i18n/*.ts`); apps/desktop/src/routes/customers/customers-view.ts:124 (`year > today.year`), customers-view.test.ts:187-211 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** (1) Các file logic thuần của `packages/ui` (`show-more.ts`, `compare-cells.ts`, `PeriodPicker.label.ts`, `chart-theme.ts`, `token-guard.ts`) và `i18n/index.ts` có test nhưng nằm ngoài vùng đo coverage, nên một nhánh mới không có test sẽ không làm đỏ ngưỡng nào (các vùng khác có ngưỡng riêng, T-101). (2) Đột biến D6 (`year > today.year` → `>=`: năm sinh chỉ có năm = năm nay bị từ chối "Ngày sinh sau hôm nay") sống: test có "2027" (tương lai) và "26/09/2026" (đủ ngày, hôm nay) nhưng không có "2026" chỉ năm.
- **Tái hiện / bằng chứng:** `node D\m-run.mjs` → `D\m-run.log`: `D6 SURVIVED … Tests 16 passed (16)`; cả lượt: 41 / 43 đột biến của gói D bị giết, D29 sống nhưng tương đương (bảng §7.2).
- **Ảnh hưởng:** chỉ chất lượng test; hành vi hiện tại đúng.
- **Đề xuất:** thêm `packages/ui/src/**/*.ts` và `apps/desktop/src/i18n/index.ts` vào `coverage.include` với ngưỡng theo số đo hiện tại; thêm ca `parseBirthDate('2026', today)` → `{ ok: true, birth: { year: 2026 } }`. ≈ 10 dòng test / cấu hình.

## 4a. Bloat

| Đã chạy / đo | Trên gì | Kết quả | ID |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` (chạy tạm bằng cờ lệnh) cho `apps/desktop` và `packages/ui` | SHA ghim | exit 0 cả hai — cấu hình gốc (`tsconfig.base.json`) đã bật sẵn hai cờ, nên không có biến / tham số thừa | — |
| `D\exports.mjs`: mọi `export` của file SP gói D (169) → nơi dùng ngoài file (SP / chỉ test / không đâu) | `apps/desktop/src`, `packages`, `e2e`, `tools` | 145 dùng ở SP; 15 chỉ là **kiểu** export không ai import (`CustomerBoard`, `CustomerData`, `BirthDateResult`, `TimelineEvent`, `KycResolveOption`, `TeamView`, `StaffRecords`, `ClosePort`, `ScopeState`, `ScreenErrorMessage`, `StartupMessage`, `TokenReader`, `ShowMoreFoot`, `TokenViolation`, `MessageParams`) — xóa khi biên dịch, chi phí 0; 4 kiểu chỉ qua `index.ts` của `@p2c/ui` (`ButtonVariant`, `Choice`, `DataTableSort`, `SegmentedOption`); 5 export chỉ test dùng (`COUNT_SLOTS`, `PLAIN_SLOTS`, `fillSlots`, `StageHead`, `compareCells` — seam test có chủ ý) | không thành phát hiện (không đo được chi phí) |
| `D\i18n-keys.mjs`: 1 085 khóa `vi.ts` → có nơi gọi (chuỗi nguyên hoặc tiền tố mẫu `` `x.${…}` ``) | `apps/desktop/src` (91 file SP) | 0 khóa không ai dùng (4 khóa `policyForm.effect*` qua `` `policyForm.effect${key}` ``) | — |
| `D\hardcoded-ui.mjs`: text node / `aria-label` / `title` / `placeholder` / literal chữ trong JSX của 33 file TSX gói D | SHA ghim | không có chuỗi tiếng Việt cứng; chỉ dấu câu nối (`', '`, `'; '`, `: `, `"…"`) | CL-D5 |
| Code lặp ≥ 3 nơi (đọc) | gói D | 3 helper `badge` (đã có ở sổ #141); hằng class `CARD` (`CustomersScreen.tsx:31`, `CustomerKyc.tsx:26`, `TeamScreen.tsx:31`, thẻ Lịch hẹn viết thẳng `CustomerAppointments.tsx:126`), `LINK` (`CustomersScreen.tsx:32`, `TeamScreen.tsx:34`, `appointments-view` `LINK`), `ALERT` (`CustomerDialogs.tsx:47`, `PersonDialogs.tsx:9`) — chuỗi class Tailwind, không phải logic; không đáng tách | — |
| `lint:deps`, codemap | `common\baseline.md` (309 module, 1 244 dependency, không vi phạm; `codemap:check` xanh) | không chạy lại | — |
| Bundle: `vite build` riêng vào `D\web` | bản web ở SHA ghim | `index.js` 891 942 B (gzip 264 KB), `chart.js` 513 302 B (gzip 174 KB) được `modulepreload` và nạp ngay lúc mở (vì `@p2c/ui/src/index.ts` re-export `Chart`, và `Chart.tsx` gọi `registerModules` ở cấp module), `exceljs.min.js` 929 569 B chỉ nạp khi xuất Excel. Màn mặc định (Tổng quan) cần chart nên lợi ích tách chart chỉ có khi app mở ở màn khác; để gói F cân nhắc cùng bundle toàn cục | ghi nhận cho F, không thành phát hiện D |

Không có đề xuất refactor bloat riêng cho gói D (không có code chết chạy được).

## 4b. Hiệu năng

Máy Office Laptop `D13_THINKPAD`, 14/10/2026 16:52–17:00; song song có thể có phiên Codex ở `Project-2C-review-2` (không biết đang chạy gì). Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (sau nhập, bản ghi sống: 1 481 KH, 10 252 lịch, 1 674 HĐ, 4 883 chuyển nhóm, 51 người, 4 team). Ngưỡng: thao tác màn < 200 ms (`docs/metrics/phase-6.md`).

**Trong Node** (`D\p2-perf.mjs`, trung vị 15 lần; log `D\p2-perf.log`):

| Hàm (màn gọi) | Trung vị | Max |
|---|---:|---:|
| `readTables` đủ 6 bảng một revision (mọi màn) | 73,11 ms | 77,77 ms |
| `customerBoard` Toàn bộ / Team / RE (Khách hàng) | 1,52 / 0,44 / 0,24 ms | 3,24 ms |
| `groupByTeam` + `staffMetrics` (Team & nhân sự) | 6,66 ms | 8,84 ms |
| `reOptions` + `listPeople` + `listTeams` (hộp 5a / 5c) | 0,23 ms | 0,76 ms |
| `readProfile` của hồ sơ KH nặng nhất (38 lịch) | 9,49 ms | 12,93 ms |
| ↳ trong đó `listPolicies(db)` cả bảng rồi lọc một KH | 6,36 ms | 8,14 ms |
| `kycOverview` + `kycTimeline` của KH đó | 0,03 ms | 0,55 ms |
| `countCustomerRecords` (hộp 5f) | 2,20 ms | 2,86 ms |
| `previewCustomerProfile` (5c, mỗi lần gõ) | 0,19 ms | 1,13 ms |

**Trên bản web** (`D\p5-ui-perf.mjs`, Edge headless 1440×900, cách đo như `e2e/perf/probe.perf.ts`: từ click tới khung hình đầu có kết quả; 5 lần; log `D\p5-ui-perf.log`; số của Edge headless, không phải WebView2 của exe — cùng engine, so ngưỡng được, không so trực tiếp với `perf-ref.json`). Thao tác của gói D mà probe T-218 chưa đo:

| Thao tác | Trung vị | Min–max | Ngưỡng |
|---|---:|---:|---|
| Sidebar → Khách hàng (Kanban, Toàn bộ) | 17 ms | 7–40 | < 200 ✅ |
| Góc nhìn → Team (hiện dải RE) | 11 ms | 6–13 | < 200 ✅ |
| Bấm một RE ở dải RE | 12 ms | 6–13 | < 200 ✅ |
| Mở hồ sơ KH nhiều HĐ nhất | 28 ms | 27–38 | < 200 ✅ |
| Mở hộp Sửa hồ sơ (5c) | 7 ms | 7–11 | < 200 ✅ |
| Mở hộp Xóa KH (5f, đếm bằng SQL) | 10 ms | 9–10 | < 200 ✅ |
| Lưu Sửa hồ sơ (lệnh ghi + đọc lại hồ sơ; bản web không ghi file) | 21 ms | 18–22 | < 200 ✅ |
| Mở hộp Ghi chú KYC (7a) / Chuyển nhóm (5d) | 6 / 6 ms | 6–16 | < 200 ✅ |
| Sidebar → Team & nhân sự (sau một lần ghi: đọc lại 5 bảng) | 84 ms | 82–89 | < 200 ✅ |
| Chọn team khác | 3 ms | 2–11 | < 200 ✅ |

Số tham chiếu cùng máy của exe (`common\perf\perf-ref.json`, không đo lại): `customers.view-table` 20 ms, `customers.sort-name` 22 ms, `customer.open-ai` 23 ms, `reload.customers` 241 ms, `reload.team` 289 ms — đều trong ngưỡng / bằng nền.

Kết luận: **không có phát hiện P trong gói D.** Chỗ nặng nhất là đọc lại cả bảng sau mỗi lệnh ghi (`readTables` 73 ms trong Node, `team.open` 84 ms sau một lần ghi) và `listPolicies` cả bảng cho một hồ sơ (6,4 ms / 9,5 ms) — dưới ngưỡng nhiều lần; mục `listPolicies` đã được deep review 06/10 ghi nhận (không thành phát hiện).

## 5. Bảng đếm mức × trục

| Mức \ Trục | C | D | E | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|
| Medium | CL-D7 | (CL-D7) | (CL-D7) | | | 1 |
| Low | CL-D1, CL-D2, CL-D3, (CL-D4) | | CL-D4, (CL-D1) | | | 4 |
| Nit | | | | CL-D6 | CL-D5 | 2 |
| **Tổng** | | | | | | **7** |

(ngoặc = trục phụ của cùng phát hiện; mỗi phát hiện đếm một lần ở trục chính.) Tình trạng: 7 / 7 CONFIRMED (chạy probe / đột biến thật, lệnh và trích kết quả ở từng mục), 0 PLAUSIBLE, 0 KNOWN. CL-D7: hành vi CONFIRMED, còn luật đúng cần Owner chốt.

## 6. Đã xét, không thấy (theo trục)

- **E — Edge case:** ngày sinh `1984` / `12/3/84` / `12/3` / `31/02/1984` / `1899` / năm nay / 29-02 trong năm không nhuận (`ageOn` qua `Date.UTC` → 01/03, đúng), chuỗi rỗng / khoảng trắng (đọc `customers-view.ts` + đột biến D5–D9, D43); Enter trong ô giá trị của Ghi chú KYC khi dữ kiện chưa "Thêm" (bị chặn bằng `kycNote.error.pending`, e2e `customer-kyc.spec.ts:119`); Escape ở hộp 5f quay về hộp Sửa hồ sơ, giữ chữ đã gõ, focus về ô đầu (`D\p3-ui.log`, `D\p4-a11y.log`); hồ sơ KH đã xóa / id lạ (`customer.notFound`); team / RE của góc nhìn bị xóa (`resolveScope`, `narrowScope` + đột biến D23–D25); hai hộp chồng nhau với CloseGuard (`showModal`, lớp trên cùng). Phát hiện: CL-D1, CL-D4, CL-D7.
- **C — Hợp đồng / mockup / nhãn:** đối chiếu từng dòng `customer-forms.html` 5a–5f, `customer.html`, `kyc-forms.html` 7a–7e, NT-KH / NT-HS / NT-TM của `nghiem-thu-v1.md` với code và với bản web chạy thật (`D\p3-ui.log`, `D\p4-a11y.log`): đầu màn / Kanban / bảng Khách hàng, dải RE, 5c (khung "Khi lưu, app tự ghi vào KYC" đúng mockup, `birthYear = 1984`), 5d / 5e (lựa chọn tắt đúng ADR-0007), 5f (số đếm, câu "Dữ liệu vẫn còn…", về danh sách sau khi xóa), Team (tóm tắt "3 team · 3 TL · 30 RE · 3 người hỗ trợ", "TL · 10 RE"). Lệch chưa ghi: CL-D2, CL-D3; lệch đã biết (5d "· hạ nhóm", mã F / bộ lọc dòng thời gian, `customers.html` vòng 2) không nêu lại. Mọi mã `DbError` có câu `error.*` (test `i18n/index.test.ts`), slot `{role}` của `TEAM_REQUIRED` được `PersonDialogs.tsx:51` điền.
- **D — Dữ liệu:** gói D không ghi thẳng bảng: mọi hộp đi qua lệnh `@p2c/db` trong `data.run` (đọc từng hộp); xem trước 5c / 7a / 7d dùng chung hàm domain / db với lệnh (`previewCustomerProfile`, `previewKycNote` → `nextKycVersion`). Phát hiện liên quan dữ liệu: CL-D7.
- **G — Guardrail AI:** ngoài phạm vi gói D (file AI thuộc gói C); chỉ xét hộp 3f `ConfirmFactDialog` nằm trong `KycDialogs.tsx`: lưu qua `confirmKycFact` / `markKycConflict` như RE nhập tay, không tự lưu (đọc `KycDialogs.tsx:426-500`). Không thấy gì mới (mục preview `refused` đã có ở sổ #469).
- **S — Ranh giới:** route hash (`parseHash` giải mã an toàn, đột biến D27–D29), `localStorage` bọc try/catch (`useRoute.ts`), `fillSlots` chỉ dùng thuộc tính riêng của params (F-19, đột biến D30), không `dangerouslySetInnerHTML` trong gói D (grep), chuỗi từ DB vào chart qua `encodeHtml` (`Chart.tsx`, F-18), chặn tải lại webview (`block-reload.ts`, đột biến D34–D35), `index.html` không nạp gì ngoài bundle. Không thấy.
- **P — Hiệu năng:** §4b, không có phát hiện.
- **B — Bloat:** §4a, không có phát hiện (chỉ CL-D5 Nit về dấu câu).
- **T — Test:** 43 đột biến trên 14 file logic thuần của gói D (§7.2): 41 bị giết, D6 sống (CL-D6), D29 sống nhưng tương đương (id KH là ULID nên `encodeURIComponent` không đổi gì). Các TSX chỉ có e2e: đã đối chiếu e2e có kiểm các chốt chặn chính (lựa chọn nhóm tắt `customer-forms.spec.ts:106`, dữ kiện chưa thêm `customer-kyc.spec.ts:119`, nút Xóa nhân sự tắt `team.spec.ts:297`, foot "Hiện thêm" `data-table.spec.ts:107`); không chạy đột biến e2e (cổng 4173 dùng chung với phiên Codex). Mục e2e 5f chỉ kiểm `\d+` đã có ở sổ (#541).
- **A — Trợ năng / i18n:** tương phản mọi cặp màu chữ của token trên 4 nền + nền accent-soft ≥ 4,72 : 1 (`D\contrast.log`, AA đạt; viền 1,88 : 1 đã có ở sổ R4); hộp: tên từ tiêu đề, focus vào ô `autoFocus`, Tab vòng trong hộp, Escape đóng và trả focus về nút mở (`D\p4-a11y.log`); `Choices` là `radiogroup` có tên từ `legend` và `aria-required`; lỗi ô có `aria-invalid` + `aria-describedby`; `Segmented` đổi bằng mũi tên; dải RE `aria-pressed`. Chuỗi cứng: CL-D5. Đã biết: chart `role="img"` không có bảng số (sổ P8), ô ngoài tháng `aria-hidden` (#156).

## 7. Phụ lục

### 7.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6\claude\D\`. Probe Node nạp thẳng nguồn TS ở SHA ghim qua `hooks.mjs` (chép cách nạp của `tools/load-data.mjs`), không sửa repo. Probe giao diện chạy trên bản web dựng riêng: `pnpm exec vite build --outDir C:\workspace\deep-review-1-6\claude\D\web --emptyOutDir` (trong `apps/desktop`, không đặt `VITE_DEMO_ANCHOR`: seed theo hôm nay 14/10/2026), phục vụ bằng `serve.mjs` ở cổng **4392** (không dùng 4173), Edge headless qua `@playwright/test` của repo; không bấm nút AI nào (không mở chatgpt.com, không gọi dịch vụ AI).

| File | Việc | Log | Phát hiện |
|---|---|---|---|
| `hooks.mjs` | loader TS | — | mọi probe Node |
| `i18n-keys.mjs` | khóa `vi.ts` không ai dùng | `i18n-keys.log` | §4a |
| `hardcoded-ui.mjs` | chuỗi UI cứng trong JSX | `hardcoded-ui.log` | CL-D5 |
| `contrast.mjs` | tương phản token | `contrast.log` | §6 A |
| `p1-reviewer-delete.mjs` | hộp 9b ↔ `softDeletePerson` | `p1-reviewer-delete.log` | CL-D1 |
| `p2-perf.mjs` | hàm đọc / view trên dữ liệu tải + đếm ca CL-D1 | `p2-perf.log` | §4b, CL-D1 |
| `serve.mjs` | server tĩnh cổng 4392 | — | — |
| `p3-ui.mjs` | 7b / 7c, 5c, 5f, dòng thời gian, thẻ Lịch hẹn | `p3-ui.log` | CL-D2, CL-D3 |
| `p4-a11y.mjs` | tên, Tab, Escape, focus | `p4-a11y.log` | §6 A |
| `p5-ui-perf.mjs` | thao tác màn gói D trên dữ liệu tải | `p5-ui-perf.log` | §4b |
| `p6-outside-scope.mjs` | tạo KH ngoài góc nhìn | `p6-outside-scope.log` | CL-D4 |
| `p7-handover.mjs` | bàn giao KH, lịch dự kiến, RF | `p7-handover.log` | CL-D7 |
| `exports.mjs` | export và nơi dùng | `exports.log` | §4a |
| `m-run.mjs` | đột biến (vá → vitest → trả lại ngay) | `m-run.log` | CL-D6 |

### 7.2 Đột biến (43 lần, 16:55:12–16:55:57: 41 bị giết, 2 sống)

Chạy `node m-run.mjs C:\workspace\Project-2C-review`: mỗi đột biến khớp đúng một chỗ trong file, ghi bản vá, chạy `pnpm exec vitest run <file test của nó>` ở gốc repo, rồi ghi lại nguyên bản trong `finally`; cuối lượt `git status --short` rỗng (dòng cuối `m-run.log`).

| ID | File | Đột biến | Kết quả |
|---|---|---|---|
| D1 | `customers-view.ts` | "Từ ngày" lấy chuyển nhóm đầu thay cho mới nhất | giết |
| D2 | `customers-view.ts` | sắp thẻ cũ trước | giết |
| D3 | `customers-view.ts` | `openCount` tính cả KH đã đóng | giết |
| D4 | `customers-view.ts` | dải RE đếm cả KH đã đóng | giết |
| D5 | `customers-view.ts` | ngày ghi nhận hôm nay bị từ chối | giết |
| D6 | `customers-view.ts` | năm sinh = năm nay bị từ chối | **sống** (CL-D6) |
| D7 | `customers-view.ts` | bỏ chặn ngày sinh không có năm | giết |
| D8 | `customers-view.ts` | sinh nhật hôm nay chưa tính tuổi | giết |
| D9 | `customers-view.ts` | khóa sắp xếp năm sinh chỉ có năm | giết |
| D10 | `kyc-view.ts` | ẩn dữ kiện `conflict` | giết |
| D11 | `kyc-view.ts` | mâu thuẫn cốt lõi chỉ khi mọi trường là cốt lõi | giết |
| D12 | `kyc-view.ts` | mã F cũ trỏ dữ kiện khác giá trị | giết |
| D13 | `kyc-view.ts` | cuộc gặp xếp sau chuyển nhóm nó gây ra | giết |
| D14 | `kyc-view.ts` | đánh số mọi lịch, không chỉ lịch Đã gặp | giết |
| D15 | `kyc-view.ts` | bỏ cờ material bật tay | giết |
| D16 | `kyc-view.ts` | số phiên bản kế tiếp sai | giết |
| D17 | `kyc-view.ts` | cho chọn giá trị không phải của hồ sơ (D2) | giết |
| D18 | `kyc-view.ts` | bỏ `reverse()` (thứ tự trong cùng ngày) | giết |
| D19 | `team-view.ts` | 31 ngày thay cho 30 | giết |
| D20 | `team-view.ts` | "Người hỗ trợ" theo vai trò thay cho không team | giết |
| D21 | `team-view.ts` | HĐ phát hành mọi năm | giết |
| D22 | `team-view.ts` | TL là người cuối thay cho đầu | giết |
| D23 | `shell/scope.ts` | team đã xóa không rơi về team đầu | giết |
| D24 | `shell/scope.ts` | bấm lại loại góc nhìn mất lựa chọn | giết |
| D25 | `shell/scope.ts` | RE ngoài team vẫn được chọn | giết |
| D26 | `shell/scope.ts` | danh sách RE chỉ theo tên | giết |
| D27 | `shell/routes.ts` | nhận hash nhiều đoạn | giết |
| D28 | `shell/routes.ts` | Lịch hẹn không dùng góc nhìn | giết |
| D29 | `shell/routes.ts` | bỏ `encodeURIComponent` id KH | sống — tương đương (id ULID) |
| D30 | `i18n/index.ts` | slot nhận thuộc tính thừa kế | giết |
| D31 | `i18n/index.ts` | params của người gọi đè params của lỗi | giết |
| D32 | `i18n/index.ts` | bỏ nhóm nghìn của slot đếm | giết |
| D33 | `shell/close-guard.ts` | Escape ở hộp đóng app thành đóng luôn | giết |
| D34 | `shell/block-reload.ts` | chặn cả AltGr+R | giết |
| D35 | `shell/block-reload.ts` | chặn menu chuột phải cả trong ô nhập | giết |
| D36 | `shell/startup-error.ts` | bỏ câu riêng "ổ đĩa đầy" | giết |
| D37 | `ui/show-more.ts` | foot hiện ở đúng 100 dòng | giết |
| D38 | `ui/show-more.ts` | "Hiện thêm" luôn 100 | giết |
| D39 | `ui/compare-cells.ts` | giờ trống xếp sau | giết |
| D40 | `ui/PeriodPicker.label.ts` | nhãn năm dùng khuôn tháng | giết |
| D41 | `ui/chart-theme.ts` | bỏ qua `palette` | giết |
| D42 | `ui/token-guard.ts` | miễn trừ mọi `style={{…}}` | giết |
| D43 | `customers-view.ts` | năm sinh chỉ có năm lưu thành 01/01 | giết |

### 7.3 Nguồn probe / đột biến

Nguyên văn các file ở `claude\D\` (chép vào đây để không mất khi thư mục bị xóa sau v1.0).

#### `hooks.mjs`

```js
// Loader for probes: same as tools/load-data.mjs (TS sources with extensionless imports, ?raw).
// Import first: `import './hooks.mjs'` then dynamic-import the TS modules of the repo.
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { URL } from 'node:url';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith('.') || /\.\w+$/.test(specifier)) throw error;
      for (const suffix of ['.ts', '/index.ts']) {
        try {
          return nextResolve(specifier + suffix, context);
        } catch {
          // next
        }
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (!url.endsWith('?raw')) return nextLoad(url, context);
    const text = readFileSync(new URL(url.slice(0, -'?raw'.length)), 'utf8');
    return { format: 'module', source: `export default ${JSON.stringify(text)};`, shortCircuit: true };
  },
});
```

#### `i18n-keys.mjs`

```js
// Probe (read-only): vi.ts keys never referenced from app code, and dynamic key prefixes.
// Usage: node i18n-keys.mjs <repo>
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const repo = process.argv[2];
const src = join(repo, 'apps/desktop/src');
const viText = readFileSync(join(src, 'i18n/vi.ts'), 'utf8');
const keys = [...viText.matchAll(/^\s+'([^']+)':/gm)].map((m) => m[1]);

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) && !path.endsWith('vi.ts'))
      files.push(path);
  }
};
walk(src);
const code = files.map((f) => readFileSync(f, 'utf8')).join('\n');

// Template-literal keys: `prefix.${...}` → prefix; also `prefix.${a}.${b}`.
const prefixes = new Set();
for (const m of code.matchAll(/`([a-zA-Z0-9_.]+)\.\$\{/g)) prefixes.add(m[1] + '.');
// Keys built by concatenation 'prefix.' + x
for (const m of code.matchAll(/'([a-zA-Z0-9_.]+\.)'\s*\+/g)) prefixes.add(m[1]);

const unused = [];
const dynamicOnly = [];
for (const key of keys) {
  if (code.includes(`'${key}'`) || code.includes(`"${key}"`) || code.includes('`' + key + '`')) continue;
  const prefix = [...prefixes].find((p) => key.startsWith(p));
  if (prefix) {
    dynamicOnly.push(`${key}  (via ${prefix}\${…})`);
    continue;
  }
  unused.push(key);
}
console.log(`keys: ${keys.length}, files scanned: ${files.length}`);
console.log(`prefixes: ${[...prefixes].sort().join(' ')}`);
console.log(`\nNOT referenced literally nor by a template prefix (${unused.length}):`);
for (const k of unused) console.log('  ' + k);
console.log(`\nreferenced only through a template prefix (${dynamicOnly.length}) — first 400 chars:`);
console.log('  ' + dynamicOnly.join('\n  ').slice(0, 400));
```

#### `hardcoded-ui.mjs`

```js
// Probe (read-only): UI text written straight into JSX of package D (text nodes, label-like
// attributes, string literals in {}). Usage: node hardcoded-ui.mjs <repo>
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const repo = process.argv[2];
const roots = [
  'packages/ui/src',
  'apps/desktop/src/shell',
  'apps/desktop/src/routes/customers',
  'apps/desktop/src/routes/team',
  'apps/desktop/src/routes/Screen.tsx',
  'apps/desktop/src/App.tsx',
  'apps/desktop/src/main.tsx',
];
const AI = /^(?:ai-|[\w-]*-ai-)|Ai\.tsx$|^Kyc(?:Extraction|Intelligence|WebSession|History)\.|^extraction-view\./;
const E = /^(?:CustomerPolicies|PolicyDialogs|policy-form)\./;
const files = [];
const walk = (path) => {
  if (statSync(path).isDirectory()) for (const n of readdirSync(path)) walk(join(path, n));
  else if (/\.tsx$/.test(path) && !/\.test\.tsx$/.test(path)) {
    const name = path.split(/[\\/]/).pop();
    if (!AI.test(name) && !E.test(name)) files.push(path);
  }
};
for (const r of roots) walk(join(repo, r));

const hits = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
    // JSX text between tags with a letter in it.
    for (const m of line.matchAll(/>([^<>{}]*\p{L}[^<>{}]*)</gu)) {
      if (/=>|&&|\|\||\?/.test(m[1])) continue;
      hits.push([file, i + 1, 'text', m[1].trim()]);
    }
    // A whole line of JSX text (multi-line children).
    if (/^\p{L}[\p{L}\s,.:]*$/u.test(trimmed) && !/^(return|const|let|import|export|if|else|type|interface|function)\b/.test(trimmed))
      hits.push([file, i + 1, 'line', trimmed]);
    for (const m of line.matchAll(/\b(aria-label|title|placeholder|alt|label)="([^"]*\p{L}[^"]*)"/gu))
      hits.push([file, i + 1, m[1], m[2]]);
    // `{' x '}` style literal with letters.
    for (const m of line.matchAll(/\{\s*'([^']*\p{L}[^']*)'\s*\}/gu)) hits.push([file, i + 1, 'literal', m[1]]);
    for (const m of line.matchAll(/\{\s*`([^`$]*\p{L}[^`$]*)`\s*\}/gu)) hits.push([file, i + 1, 'template', m[1]]);
  });
}
console.log(`files: ${files.length}`);
for (const [f, l, k, s] of hits) console.log(`${relative(repo, f).replaceAll('\\', '/')}:${l}  [${k}]  ${s}`);
```

#### `contrast.mjs`

```js
// Probe (read-only): WCAG contrast of the text colour tokens of packages/ui/src/tokens.css on the
// surfaces they sit on, including the translucent ones composited over their usual base.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const over = (rgba, base) => rgba.slice(0, 3).map((c, i) => Math.round(c * rgba[3] + base[i] * (1 - rgba[3])));

const T = {
  'bg-0': hex('#0b1017'),
  'bg-1': hex('#111822'),
  'bg-2': hex('#18212d'),
  'bg-3': hex('#212c3a'),
  text: hex('#e8edf4'),
  'text-2': hex('#aeb9c8'),
  'text-3': hex('#8c99ac'),
  accent: hex('#d9b26a'),
  'on-accent': hex('#0b1017'),
  'date-today': hex('#9be8c0'),
  n4: hex('#94a3b8'),
  n3: hex('#6fa8ff'),
  n2: hex('#b49afb'),
  n1: hex('#3fd69a'),
  'on-hold': hex('#e3a94f'),
  lost: hex('#f07e7e'),
  submitted: hex('#6fc8e8'),
  ok: hex('#3fd69a'),
  warn: hex('#f0a04b'),
  danger: hex('#f07e7e'),
  info: hex('#6fa8ff'),
  'border-strong': hex('#34425a'),
};
T['accent-soft/bg-1'] = over([217, 178, 106, 0.14], T['bg-1']);
T['accent-soft/bg-0'] = over([217, 178, 106, 0.14], T['bg-0']);
T['date-past-bg/bg-1'] = over([240, 210, 110, 0.2], T['bg-1']);
T['date-today-bg/bg-1'] = over([63, 214, 154, 0.2], T['bg-1']);
T['date-future-bg/bg-1'] = over([111, 168, 255, 0.22], T['bg-1']);
// Button primary/danger hover:opacity-90 over bg-1
const bgs = ['bg-0', 'bg-1', 'bg-2', 'bg-3', 'accent-soft/bg-1', 'accent-soft/bg-0'];
const fgs = ['text', 'text-2', 'text-3', 'accent', 'n4', 'n3', 'n2', 'n1', 'on-hold', 'lost', 'submitted', 'ok', 'warn', 'danger', 'info', 'date-today'];
const rows = [];
for (const f of fgs) {
  const cells = bgs.map((b) => ratio(T[f], T[b]).toFixed(2));
  rows.push(`${f.padEnd(12)} ${cells.map((c) => c.padStart(7)).join('')}`);
}
console.log(`${''.padEnd(12)} ${bgs.map((b) => b.slice(0, 7).padStart(7)).join('')}`);
console.log(rows.join('\n'));
console.log('\non-accent on accent:', ratio(T['on-accent'], T.accent).toFixed(2));
console.log('on-accent on danger (danger button):', ratio(T['on-accent'], T.danger).toFixed(2));
for (const b of ['date-past-bg/bg-1', 'date-today-bg/bg-1', 'date-future-bg/bg-1'])
  console.log(`text on ${b}:`, ratio(T.text, T[b]).toFixed(2));
console.log('border-strong on bg-0 (non-text 3:1):', ratio(T['border-strong'], T['bg-0']).toFixed(2));
console.log('\nAA: 4.5 normal text, 3.0 large (>=18.66px bold / 24px).');
```

#### `p1-reviewer-delete.mjs`

```js
// Probe P1 (read-only): Team & nhân sự → Sửa → Xóa nhân sự (mockup 9b) for an IS who is only the
// outcome reviewer (D9) of a live meeting. What the dialog counts (team-view personUsage, from the
// live tables the screen reads) vs what softDeletePerson refuses, and the message the dialog shows.
// Usage: node p1-reviewer-delete.mjs <repo>
import './hooks.mjs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const repo = process.argv[2];
const imp = (p) => import(pathToFileURL(join(repo, p)).href);
const db_ = await imp('packages/db/src/index.ts');
const { personUsage } = await imp('apps/desktop/src/routes/team/team-view.ts');
const { errorMessage } = await imp('apps/desktop/src/i18n/index.ts');

const now = new Date('2026-10-14T03:00:00Z');
const db = await db_.openDatabase({ now: () => now });
const day = (y, m, d) => ({ year: y, month: m, day: d });
try {
  const team = db_.createTeam(db, { name: 'Sao Mai' });
  const re = db_.createPerson(db, { name: 'Đỗ Khánh Linh', role: 'RE', teamId: team.id });
  const is = db_.createPerson(db, { name: 'IS Tạm', role: 'IS', teamId: null });
  const tl = db_.createPerson(db, { name: 'TL Thử', role: 'TL', teamId: team.id });
  const customer = db_.createCustomer(db, {
    name: 'Trịnh Minh Anh', reId: re.id, birthDate: null, gender: null, stage: 'N3', date: day(2026, 10, 1),
  });
  const appt = db_.scheduleAppointment(db, {
    customerId: customer.id, reId: re.id, date: day(2026, 10, 10), triggerType: 'REFERRAL',
  });
  // Met; IS Tạm decided the stage after (D9) but did not coordinate the meeting.
  db_.recordMeetingOutcome(db, appt.id, {
    status: 'MET', stageAfter: 'N2', nextStep: 'Gửi giải pháp', outcomeReviewerId: is.id,
  });

  for (const person of [is, tl]) {
    const records = {
      customers: db_.listCustomers(db),
      appointments: db_.listAppointments(db),
      policies: db_.listPolicies(db),
    };
    const usage = personUsage(person.id, records);
    const inUse = Object.values(usage).some((n) => n > 0);
    let outcome;
    try {
      db_.softDeletePerson(db, person.id);
      outcome = 'deleted';
    } catch (error) {
      outcome = `refused ${error.code}: "${errorMessage(error)}"`;
    }
    console.log(`${person.role} ${person.name}`);
    console.log(`  dialog usage (personUsage): ${JSON.stringify(usage)} → Xóa ${inUse ? 'disabled' : 'ENABLED, body "' + 'Nhân sự được xóa mềm…' + '"'}`);
    console.log(`  softDeletePerson: ${outcome}`);
  }
} finally {
  db.sqlite.close();
}
```

#### `p2-perf.mjs`

```js
// Probe P2 (read-only): the pure reads / view functions of package D on the load data
// (common\load\load-2026-10-12-seed6.p2cbackup), in Node, median of RUNS. Also counts, on the
// load data, the support staff the 9b dialog would let through while softDeletePerson refuses (CL-D1).
// Usage: node p2-perf.mjs <repo> <backup>
import './hooks.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';

const [repo, backup] = process.argv.slice(2);
const imp = (p) => import(pathToFileURL(join(repo, p)).href);
const db_ = await imp('packages/db/src/index.ts');
const dom = await imp('packages/domain/src/index.ts');
const cv = await imp('apps/desktop/src/routes/customers/customers-view.ts');
const kv = await imp('apps/desktop/src/routes/customers/kyc-view.ts');
const tv = await imp('apps/desktop/src/routes/team/team-view.ts');
const sc = await imp('apps/desktop/src/shell/scope.ts');
const { readTables } = await imp('apps/desktop/src/data/tables.ts');

const RUNS = 15;
const now = new Date('2026-10-14T03:00:00Z');
const today = { year: 2026, month: 10, day: 14 };
const t0 = performance.now();
const { db } = await db_.importBackup(readFileSync(backup, 'utf8'), { now: () => now });
console.log(`importBackup (Node): ${(performance.now() - t0).toFixed(0)} ms`);

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const time = (label, fn) => {
  const ms = [];
  let out;
  for (let i = 0; i < RUNS; i += 1) {
    const s = performance.now();
    out = fn();
    ms.push(performance.now() - s);
  }
  console.log(`${label.padEnd(58)} median ${median(ms).toFixed(2).padStart(8)} ms  max ${Math.max(...ms).toFixed(2).padStart(8)} ms`);
  return out;
};

const tables = readTables(db);
const all = {
  teams: tables.teams, people: tables.people, customers: tables.customers,
  appointments: tables.appointments, policies: tables.policies, transitions: tables.transitions,
};
console.log(`rows: customers ${all.customers.length}, appointments ${all.appointments.length}, policies ${all.policies.length}, transitions ${all.transitions.length}, people ${all.people.length}, teams ${all.teams.length}`);

time('readTables: all six lists, fresh (one revision)', () => {
  const t = readTables(db);
  return [t.teams, t.people, t.customers, t.appointments, t.policies, t.transitions].length;
});
const team = all.teams[0];
const re = all.people.find((p) => p.role === 'RE');
time('customerBoard, scope all (CustomersScreen)', () => cv.customerBoard(all, { kind: 'all' }));
time('customerBoard, scope team', () => cv.customerBoard(all, { kind: 'team', teamId: team.id }));
time('customerBoard, scope re', () => cv.customerBoard(all, { kind: 're', reId: re.id }));
time('groupByTeam + staffMetrics (TeamScreen columns)', () => {
  tv.groupByTeam(all.teams, all.people);
  return tv.staffMetrics(all.people, all, today);
});
time('reOptions + listPeople + listTeams (CustomerFormDialog readRes)', () =>
  sc.reOptions(db_.listPeople(db), db_.listTeams(db)));

// The customer with the most appointments: the heaviest profile.
const byCustomer = new Map();
for (const a of all.appointments) byCustomer.set(a.customerId, (byCustomer.get(a.customerId) ?? 0) + 1);
const [heavyId, heavyCount] = [...byCustomer].sort((a, b) => b[1] - a[1])[0];
const readProfile = (id) => {
  const customer = db_.getCustomer(db, id);
  const people = db_.listPeople(db);
  const teams = db_.listTeams(db);
  const transitions = db_.listStageTransitions(db, id);
  return {
    customer, people, teams, transitions,
    policies: db_.listPolicies(db).filter((p) => p.customerId === id),
    kyc: db_.getKycProfile(db, id),
    versions: db_.listKycVersions(db, id),
    analyses: db_.listAiAnalyses(db, id),
    appointments: db_.listAppointments(db, id),
  };
};
const profile = time(`readProfile (CustomerProfile), heaviest KH: ${heavyCount} lịch`, () => readProfile(heavyId));
time('  of which listPolicies(db) whole table + filter', () => db_.listPolicies(db).filter((p) => p.customerId === heavyId));
time('kycOverview + kycTimeline of that KH', () => {
  kv.kycOverview(profile.kyc.facts);
  return kv.kycTimeline(profile.transitions, profile.kyc.notes, profile.versions, profile.appointments);
});
time('countCustomerRecords (hộp 5f)', () => db_.countCustomerRecords(db, heavyId));
time('previewCustomerProfile (5c, every keystroke)', () =>
  db_.previewCustomerProfile(db, heavyId, { birthDate: { year: 1980 }, gender: 'FEMALE' }));

// CL-D1 on the load data: support staff with no usage on the 9b dialog that the command refuses.
const records = { customers: all.customers, appointments: all.appointments, policies: all.policies };
let gap = 0;
const support = all.people.filter((p) => p.role !== 'RE');
for (const person of support) {
  const usage = tv.personUsage(person.id, records);
  if (Object.values(usage).some((n) => n > 0)) continue;
  const reviewing = all.appointments.filter((a) => a.outcomeReviewerId === person.id).length;
  if (reviewing > 0) gap += 1;
  console.log(`  ${person.role} ${person.name}: dialog usage 0, reviewer of ${reviewing} live appointments`);
}
console.log(`support staff ${support.length}; dialog says deletable but reviewer of live meetings: ${gap}`);
db.sqlite.close();
```

#### `serve.mjs`

```js
// Static server for the web build copy in D\web (own port, not 4173). Usage: node serve.mjs <port>
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'web');
const port = Number(process.argv[2] ?? 4392);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json',
};
createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
  const file = join(root, path === '' ? 'index.html' : path);
  if (!file.startsWith(root)) return res.writeHead(403).end();
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    const body = await readFile(join(root, 'index.html'));
    res.writeHead(200, { 'content-type': TYPES['.html'] }).end(body);
  }
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
```

#### `p3-ui.mjs`

```js
// Probe P3 (read-only): UI checks on the web build copy (D\web, served by serve.mjs on 4392),
// Edge headless. Never touches the AI panel (no ChatGPT web). Usage: node p3-ui.mjs <repo>
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = process.argv[2];
const { chromium } = await import(pathToFileURL(join(repo, 'node_modules/@playwright/test/index.mjs')).href);
const BASE = 'http://127.0.0.1:4392';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const log = (...a) => console.log(...a);

try {
  await page.goto(`${BASE}/#/customers`);
  await page.getByRole('button', { name: '+ Khách hàng' }).waitFor({ timeout: 60_000 });

  // --- New customer, then a KYC note with a money trường (mockup 7b / 7c, NT-HS-05) ---------
  const NAME = 'Probe D Tiền';
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  let dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill(NAME);
  await dialog.getByRole('combobox', { name: 'RE phụ trách' }).selectOption({ index: 1 });
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('1984');
  await dialog.getByRole('radio', { name: 'Nữ' }).check();
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await dialog.waitFor({ state: 'hidden' });
  await page.getByRole('link', { name: new RegExp(NAME) }).first().click();
  await page.getByRole('region', { name: 'Dữ kiện KYC' }).waitFor();

  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Thu nhập khoảng 6 tỷ một năm.');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Thu nhập năm' });
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill('6 tỷ');
  const valueField = dialog.getByRole('textbox', { name: 'Giá trị' });
  const described = await valueField.getAttribute('aria-describedby');
  const dialogText = await dialog.innerText();
  log('[7b] Thu nhập năm "6 tỷ": aria-describedby =', described, '| dialog has "6.000.000.000":', dialogText.includes('6.000.000.000'), '| has "₫":', dialogText.includes('₫'));
  await dialog.getByRole('button', { name: 'Thêm dữ kiện' }).click();
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click();
  await dialog.waitFor({ state: 'hidden' });
  const kycText = await page.getByRole('region', { name: 'Dữ kiện KYC' }).innerText();
  log('[7b] KYC card line:', kycText.split('\n').find((l) => l.includes('Thu nhập năm')));

  // 7c: a second note with a new value of the same trường: "Đang có" and the new value.
  await page.getByRole('button', { name: '+ Ghi chú KYC' }).click();
  dialog = page.getByRole('dialog', { name: `Ghi chú KYC · ${NAME}` });
  await dialog.getByRole('textbox', { name: 'Ghi chú' }).fill('Thu nhập tăng lên 40 tỷ.');
  await dialog.getByRole('combobox', { name: 'Trường' }).selectOption({ label: 'Thu nhập năm' });
  await dialog.getByRole('textbox', { name: 'Giá trị' }).fill('40 tỷ');
  const t7c = await dialog.innerText();
  log('[7c] lines:', JSON.stringify(t7c.split('\n').filter((l) => /Đang có|40|₫/.test(l))));
  await dialog.getByRole('button', { name: 'Hủy' }).click();

  // --- 5c: preview of the KYC the profile save records (gender changed) ------------------
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  dialog = page.getByRole('dialog', { name: `Sửa hồ sơ · ${NAME}` });
  await dialog.getByRole('radio', { name: 'Nam' }).check();
  const status = dialog.getByRole('status');
  log('[5c] preview (gender → Nam):', (await status.innerText()).replace(/\s+/g, ' '));
  await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).fill('12/3/1984');
  log('[5c] preview (birth 12/3/1984):', (await status.innerText()).replace(/\s+/g, ' '));
  // 5f from the edit dialog, then Escape: back to the edit dialog with what was typed.
  await dialog.getByRole('button', { name: 'Xóa KH…' }).click();
  const del = page.getByRole('dialog', { name: `Xóa ${NAME}?` });
  log('[5f] dialog:', (await del.innerText()).replace(/\s+/g, ' '));
  await page.keyboard.press('Escape');
  await dialog.waitFor();
  log('[5f→Esc] back to edit; birth field keeps:', await dialog.getByRole('textbox', { name: /^Ngày sinh/ }).inputValue(),
    '| focused:', await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent?.slice(0, 40) ?? document.activeElement?.tagName));
  await dialog.getByRole('button', { name: 'Hủy' }).click();

  // --- A seeded profile with a meeting that moved the stage: timeline and appointments card ---
  await page.goto(`${BASE}/#/customers`);
  await page.getByRole('radio', { name: 'Bảng' }).click();
  const names = await page.getByRole('table').getByRole('link').allInnerTexts();
  let found = false;
  for (const name of names.slice(0, 60)) {
    await page.goto(`${BASE}/#/customers`);
    await page.getByRole('radio', { name: 'Bảng' }).click();
    await page.getByRole('table').getByRole('link', { name, exact: true }).first().click();
    const timeline = page.getByRole('region', { name: 'Dòng thời gian' });
    await timeline.waitFor();
    const items = await timeline.getByRole('listitem').allInnerTexts();
    const byMeeting = items.filter((i) => i.includes('sau cuộc gặp'));
    if (byMeeting.length === 0) continue;
    const card = page.getByRole('region', { name: 'Lịch hẹn' });
    const cardRf = (await card.innerText()).split('\n').filter((l) => /RF/.test(l));
    if (cardRf.length === 0) continue;
    found = true;
    log(`[timeline] KH ${name}: stage events by a meeting:`, JSON.stringify(byMeeting.map((s) => s.replace(/\n/g, ' | '))));
    log('[timeline] any "RF" in the timeline:', items.some((i) => /RF/.test(i)), '| appointments card RF lines:', JSON.stringify(cardRf));
    log('[appointments card] comboboxes (Kỳ filter of the mockup):', await card.getByRole('combobox').count(),
      '| meta:', (await card.innerText()).split('\n')[1]);
    log('[timeline] filter buttons (Tất cả / KYC / Lịch hẹn):', await timeline.getByRole('radio').count() + await timeline.getByRole('button', { name: /Tất cả|^KYC$/ }).count());
    break;
  }
  if (!found) log('[timeline] no seeded profile with an RF meeting in the first 60');
  log('page errors:', JSON.stringify(errors));
} finally {
  await browser.close();
}
```

#### `p4-a11y.mjs`

```js
// Probe P4 (read-only): accessible names, keyboard and focus on the D screens (web build copy,
// Edge headless, port 4392). Never touches the AI panel. Usage: node p4-a11y.mjs <repo>
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = process.argv[2];
const { chromium } = await import(pathToFileURL(join(repo, 'node_modules/@playwright/test/index.mjs')).href);
const BASE = 'http://127.0.0.1:4392';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });
const log = (...a) => console.log(...a);
const focused = () =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return 'none';
    const label = el.getAttribute('aria-label') ?? (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent) ?? el.textContent;
    return `${el.tagName.toLowerCase()}${el.getAttribute('type') ? `[${el.getAttribute('type')}]` : ''} "${(label ?? '').trim().slice(0, 40)}" in dialog: ${Boolean(el.closest('dialog'))}`;
  });

try {
  await page.goto(`${BASE}/#/customers`);
  const add = page.getByRole('button', { name: '+ Khách hàng' });
  await add.waitFor({ timeout: 60_000 });

  await add.click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  log('[5a] radiogroups:', JSON.stringify(await dialog.getByRole('radiogroup').evaluateAll((els) => els.map((e) => e.getAttribute('aria-required') + ' ' + e.querySelector('legend')?.textContent))));
  log('[5a] radiogroup by name "Giới tính":', await dialog.getByRole('radiogroup', { name: 'Giới tính' }).count(), '| "Nhóm ban đầu":', await dialog.getByRole('radiogroup', { name: /Nhóm ban đầu/ }).count());
  log('[5a] focus on open:', await focused());
  const order = [];
  for (let i = 0; i < 14; i += 1) {
    await page.keyboard.press('Tab');
    order.push(await focused());
  }
  log('[5a] Tab order:\n  ' + order.join('\n  '));
  // Arrow keys inside the stage radiogroup.
  await dialog.getByRole('radio', { name: 'N4' }).focus();
  await page.keyboard.press('ArrowRight');
  log('[5a] ArrowRight in Nhóm ban đầu → checked:', await dialog.getByRole('radio', { checked: true }).evaluateAll((els) => els.map((e) => e.value).join(',')));
  // Empty save: the alert, aria-invalid on fields.
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  log('[5b] alerts:', JSON.stringify(await dialog.getByRole('alert').allInnerTexts()));
  log('[5b] invalid fields:', await dialog.locator('[aria-invalid="true"]').count(), '| name describedby text:',
    await dialog.getByRole('textbox', { name: 'Họ tên' }).evaluate((e) => document.getElementById(e.getAttribute('aria-describedby') ?? '')?.textContent));
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  log('[5a] after Escape, focus back on:', await focused());

  // Segmented view switch by keyboard.
  const kanban = page.getByRole('radio', { name: 'Kanban' });
  await kanban.focus();
  await page.keyboard.press('ArrowRight');
  log('[view] ArrowRight on Cách xem → table shown:', await page.getByRole('table').count(), '| focus:', await focused());

  // Team & nhân sự.
  await page.goto(`${BASE}/#/team`);
  await page.getByRole('button', { name: '+ Nhân sự' }).waitFor();
  log('[team] team list buttons pressed:', JSON.stringify(await page.getByRole('button', { pressed: true }).allInnerTexts()));
  log('[team] summary:', (await page.locator('main').innerText()).split('\n')[0]);
  await page.getByRole('button', { name: '+ Nhân sự' }).click();
  const person = page.getByRole('dialog', { name: 'Nhân sự mới' });
  log('[9a] radiogroup Vai trò:', await person.getByRole('radiogroup', { name: /Vai trò/ }).count(), '| team select required:',
    await person.getByRole('combobox', { name: /Team/ }).getAttribute('aria-required'));
  await person.getByRole('radio', { name: 'IS' }).check();
  log('[9a] IS → team select value:', JSON.stringify(await person.getByRole('combobox', { name: /Team/ }).inputValue()),
    '| aria-required:', await person.getByRole('combobox', { name: /Team/ }).getAttribute('aria-required'));
  await page.keyboard.press('Escape');
} finally {
  await browser.close();
}
```

#### `p5-ui-perf.mjs`

```js
// Probe P5 (read-only): screen operations of package D that e2e/perf does not time, on the load
// data imported into the web build copy (D\web, port 4392), Edge headless 1440×900. Timing as
// e2e/perf/probe.perf.ts: from the click to the first painted frame that shows the result.
// Usage: node p5-ui-perf.mjs <repo> <backup>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [repo, backup] = process.argv.slice(2);
const { chromium } = await import(pathToFileURL(join(repo, 'node_modules/@playwright/test/index.mjs')).href);
const BASE = 'http://127.0.0.1:4392';
const RUNS = 5;
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

async function timeClick(target, ready) {
  await target.evaluate((el) => el.setAttribute('data-p2c-perf', ''));
  return page.evaluate(async ({ selector, text, absent }) => {
    const met = () => {
      const hit = [...document.querySelectorAll(selector)].some((e) => text === undefined || (e.textContent ?? '').includes(text));
      return absent ? !hit : hit;
    };
    const frame = () => new Promise((r) => { requestAnimationFrame(() => r(true)); setTimeout(() => r(false), 2000); });
    const el = document.querySelector('[data-p2c-perf]');
    el.removeAttribute('data-p2c-perf');
    const start = performance.now();
    el.click();
    do {
      if (!(await frame())) return -1;
      if (performance.now() - start > 60000) return -2;
    } while (!met());
    await new Promise((r) => setTimeout(r));
    return performance.now() - start;
  }, ready);
}
const results = new Map();
const add = (name, ms) => { const a = results.get(name) ?? []; a.push(ms); results.set(name, a); };

try {
  await page.goto(`${BASE}/#/settings`);
  const section = page.getByRole('region', { name: 'Xuất / nhập backup' });
  await section.waitFor({ timeout: 60_000 });
  const t0 = Date.now();
  await section.getByLabel('Nhập backup').setInputFiles({ name: 'load.p2cbackup', mimeType: 'application/json', buffer: readFileSync(backup) });
  const confirm = page.getByRole('dialog', { name: 'Thay toàn bộ dữ liệu?' });
  await confirm.waitFor({ timeout: 120_000 });
  await confirm.getByRole('button', { name: 'Thay dữ liệu', exact: true }).click();
  await section.getByRole('status').filter({ hasText: 'Đã nhập backup' }).waitFor({ timeout: 120_000 });
  console.log(`import of the load data (web, read + confirm + replace): ${Date.now() - t0} ms`);

  // The customer with the most appointments, found in the page's own table later: use the table.
  for (let run = 0; run < RUNS; run += 1) {
    await page.goto(`${BASE}/#/overview`);
    await page.getByRole('navigation').waitFor();
    // Sidebar → Khách hàng (kanban, scope Toàn bộ).
    add('customers.open-kanban', await timeClick(page.getByRole('navigation').getByRole('link', { name: 'Khách hàng' }), { selector: 'main section[aria-label="Mất cơ hội"]' }));
    // Góc nhìn Team → RE strip.
    add('customers.scope-team', await timeClick(page.getByRole('radio', { name: 'Team', exact: true }), { selector: 'main section[aria-label^="RE của team"]' }));
    // An RE chip of the strip.
    const chip = page.locator('main section[aria-label^="RE của team"] button[aria-pressed="false"]').nth(1);
    add('customers.pick-re', await timeClick(chip, { selector: 'main section[aria-label^="RE của team"] button[aria-pressed="true"]' }));
    await page.getByRole('radio', { name: 'Toàn bộ' }).click();
    // Bảng, sort by HĐ (desc on 2nd click) to reach the customer with the most policies.
    await page.getByRole('radio', { name: 'Bảng' }).click();
    const hd = page.getByRole('columnheader', { name: /^HĐ/ }).getByRole('button');
    await hd.click();
    await hd.click();
    const first = page.getByRole('table').getByRole('link').first();
    const name = await first.innerText();
    add('customer.open-profile (most HĐ)', await timeClick(first, { selector: 'section[aria-labelledby="timeline"]' }));
    add('profile.edit-dialog (5c)', await timeClick(page.getByRole('button', { name: 'Sửa hồ sơ' }), { selector: 'dialog[open]' }));
    add('profile.delete-dialog (5f)', await timeClick(page.getByRole('button', { name: 'Xóa KH…' }), { selector: 'dialog[open] dl' }));
    await page.keyboard.press('Escape');
    await page.getByRole('dialog', { name: new RegExp(`^Sửa hồ sơ`) }).waitFor();
    // Save the profile unchanged but for the name: a write, then the profile reads again.
    const nameField = page.getByRole('dialog').getByRole('textbox', { name: 'Họ tên' });
    await nameField.fill(`${name.trim()} ${run}`);
    add('profile.save-edit (write + re-read)', await timeClick(page.getByRole('dialog').getByRole('button', { name: 'Lưu', exact: true }), { selector: 'dialog[open]', absent: true }));
    add('profile.kyc-note-dialog (7a)', await timeClick(page.getByRole('button', { name: '+ Ghi chú KYC' }), { selector: 'dialog[open]' }));
    await page.keyboard.press('Escape');
    add('profile.stage-dialog (5d)', await timeClick(page.getByRole('button', { name: 'Chuyển nhóm', exact: true }), { selector: 'dialog[open]' }));
    await page.keyboard.press('Escape');
    // Team & nhân sự: open, then pick another team.
    add('team.open', await timeClick(page.getByRole('navigation').getByRole('link', { name: 'Team & nhân sự' }), { selector: 'main table' }));
    const other = page.locator('main button[aria-pressed="false"]').first();
    add('team.select-team', await timeClick(other, { selector: 'main button[aria-pressed="true"]' }));
    if (run === RUNS - 1) {
      console.log('data check — team summary:', (await page.locator('main').innerText()).split('\n')[0]);
      await page.getByRole('navigation').getByRole('link', { name: 'Khách hàng' }).click();
      console.log('data check — customers summary:', (await page.locator('main').innerText()).split('\n')[0]);
    }
  }
  const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  for (const [name, xs] of results) {
    console.log(`${name.padEnd(40)} median ${median(xs).toFixed(0).padStart(5)} ms  min ${Math.min(...xs).toFixed(0).padStart(5)}  max ${Math.max(...xs).toFixed(0).padStart(5)}  (${xs.map((x) => x.toFixed(0)).join(', ')})`);
  }
  console.log('page errors:', JSON.stringify(errors));
} finally {
  await browser.close();
}
```

#### `p6-outside-scope.mjs`

```js
// Probe P6 (read-only): Khách hàng with Góc nhìn = one RE; "+ Khách hàng" for another RE. What the
// screen shows after Lưu KH (web build copy, port 4392, seed data). Usage: node p6-outside-scope.mjs <repo>
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = process.argv[2];
const { chromium } = await import(pathToFileURL(join(repo, 'node_modules/@playwright/test/index.mjs')).href);
const BASE = 'http://127.0.0.1:4392';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });
const summary = async () => (await page.locator('main').innerText()).split('\n')[0];
try {
  await page.goto(`${BASE}/#/customers`);
  await page.getByRole('button', { name: '+ Khách hàng' }).waitFor({ timeout: 60_000 });
  await page.getByRole('radio', { name: 'RE', exact: true }).click();
  const scopeRe = page.getByRole('combobox', { name: 'RE của góc nhìn' });
  console.log('scope RE:', await scopeRe.evaluate((s) => s.selectedOptions[0].textContent));
  console.log('before:', await summary());
  await page.getByRole('button', { name: '+ Khách hàng' }).click();
  const dialog = page.getByRole('dialog', { name: 'Khách hàng mới' });
  console.log('RE field preset to the scope RE:', JSON.stringify(await dialog.getByRole('combobox', { name: 'RE phụ trách' }).inputValue()));
  await dialog.getByRole('textbox', { name: 'Họ tên' }).fill('Probe D Ngoài Góc Nhìn');
  const re = dialog.getByRole('combobox', { name: 'RE phụ trách' });
  await re.selectOption({ index: 5 });
  console.log('RE picked:', await re.evaluate((s) => s.selectedOptions[0].textContent));
  await dialog.getByRole('button', { name: 'Lưu KH' }).click();
  await dialog.waitFor({ state: 'hidden' });
  await page.waitForTimeout(300);
  console.log('after:', await summary());
  console.log('status / alert messages on the screen:', JSON.stringify(await page.locator('main [role="status"], main [role="alert"]').allInnerTexts()));
  console.log('new customer visible:', await page.getByText('Probe D Ngoài Góc Nhìn').count());
} finally {
  await browser.close();
}
```

#### `p7-handover.mjs`

```js
// Probe P7 (read-only): a customer handed over to another RE (Sửa hồ sơ 5c, "Đổi RE") who still
// has a planned meeting. Whose meeting it stays, whose RF the outcome counts for, and whose RE the
// next appointment booked with the outcome (6c "Hẹn lần tiếp theo") takes. Commands of @p2c/db,
// metrics of @p2c/domain, as the screens call them. Usage: node p7-handover.mjs <repo>
import './hooks.mjs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = process.argv[2];
const imp = (p) => import(pathToFileURL(join(repo, p)).href);
const db_ = await imp('packages/db/src/index.ts');
const dom = await imp('packages/domain/src/index.ts');

const now = new Date('2026-10-14T03:00:00Z');
const db = await db_.openDatabase({ now: () => now });
const day = (y, m, d) => ({ year: y, month: m, day: d });
try {
  const team = db_.createTeam(db, { name: 'Sao Mai' });
  const a = db_.createPerson(db, { name: 'RE A (cũ)', role: 'RE', teamId: team.id });
  const b = db_.createPerson(db, { name: 'RE B (mới)', role: 'RE', teamId: team.id });
  const c = db_.createCustomer(db, { name: 'KH Bàn Giao', reId: a.id, birthDate: null, gender: null, stage: 'N3', date: day(2026, 9, 1) });
  // Planned before the handover, for today.
  const planned = db_.scheduleAppointment(db, { customerId: c.id, reId: a.id, date: day(2026, 10, 14), triggerType: 'REFERRAL' });
  // 5c: "Đổi RE: lịch hẹn và HĐ cũ vẫn tính cho RE đã ghi trên từng bản ghi."
  db_.updateCustomerProfile(db, c.id, { name: c.name, reId: b.id, birthDate: null, gender: null });
  console.log('customer RE after 5c:', db_.getCustomer(db, c.id).reId === b.id ? 'B' : 'A');
  console.log('planned meeting of today, RE:', db_.listAppointments(db, c.id)[0].reId === a.id ? 'A (old)' : 'B');

  // 6c: the meeting is held (by B, now in charge), N3 → N2, with "Hẹn lần tiếp theo" 20/10.
  const { next } = db_.recordOutcomeWithNext(db, planned.id,
    { status: 'MET', stageAfter: 'N2', nextStep: 'Gửi giải pháp' }, { date: day(2026, 10, 20) });
  console.log('next appointment booked with the outcome, RE:', next.reId === a.id ? 'A (old)' : 'B');

  // Can any command move a planned appointment to B? editMeetingOutcome needs an outcome;
  // AppointmentDetails has no reId; reschedule keeps the RE.
  const moved = db_.rescheduleAppointment(db, next.id, { date: day(2026, 10, 21) });
  console.log('rescheduled next appointment, RE:', moved.reId === a.id ? 'A (old)' : 'B');

  // Metrics of October per RE, as Tổng quan / Báo cáo count them.
  const data = {
    people: db_.listPeople(db), customers: db_.listCustomers(db), appointments: db_.listAppointments(db),
    transitions: db_.listStageTransitions(db), policies: db_.listPolicies(db), teams: db_.listTeams(db),
  };
  const october = dom.periodOf('month', day(2026, 10, 14));
  for (const [label, re] of [['A (old)', a], ['B (new)', b]]) {
    const m = dom.periodMetrics(data, october, { kind: 're', reId: re.id });
    const met = data.appointments.filter((x) => x.reId === re.id && x.status === 'MET').length;
    const planned = data.appointments.filter((x) => x.reId === re.id && x.status === 'SCHEDULED').length;
    console.log(`October, scope RE ${label}: RF ${m.rfCount}, met ${met}, planned ${planned}, customers in charge ${data.customers.filter((x) => x.reId === re.id).length}`);
  }
} catch (error) {
  console.log('ERROR', error);
} finally {
  db.sqlite.close();
}
```

#### `exports.mjs`

```js
// Probe (read-only): exports of the package D files and where they are used outside their own
// file — product code, tests only, or nowhere. Usage: node exports.mjs <repo>
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const repo = process.argv[2];
const AI = /^(?:ai-|[\w-]*-ai-)|Ai\.tsx$|^Kyc(?:Extraction|Intelligence|WebSession|History)\.|^extraction-view\./;
const E = /^(?:CustomerPolicies|PolicyDialogs|policy-form)\./;
const all = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === 'node_modules' || name === 'dist' || name === 'target' || name.startsWith('.')) continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|mjs)$/.test(name)) all.push(p);
  }
};
for (const d of ['apps/desktop/src', 'packages', 'e2e', 'tools']) walk(join(repo, d));
const rel = (p) => relative(repo, p).replaceAll('\\', '/');
const isTest = (p) => /\.test\.tsx?$|\.test\.mjs$|^e2e\//.test(rel(p));
const inD = (p) => {
  const r = rel(p);
  const name = r.split('/').pop();
  if (isTest(p)) return false;
  if (r.startsWith('packages/ui/src/')) return true;
  if (/^apps\/desktop\/src\/(shell|i18n)\//.test(r)) return true;
  if (/^apps\/desktop\/src\/routes\/(customers|team)\//.test(r)) return !AI.test(name) && !E.test(name);
  return r === 'apps/desktop/src/routes/Screen.tsx' || /^apps\/desktop\/src\/[^/]+\.tsx?$/.test(r);
};
const text = new Map(all.map((p) => [p, readFileSync(p, 'utf8')]));
const rows = [];
for (const file of all.filter(inD)) {
  const src = text.get(file);
  const names = [...src.matchAll(/^export (?:async )?(?:function|const|let|class|interface|type|enum) (\w+)/gm)].map((m) => m[1]);
  for (const m of src.matchAll(/^export \{([^}]+)\}/gm)) {
    for (const part of m[1].split(',')) names.push(part.trim().replace(/^type /, '').split(/\s+as\s+/).pop());
  }
  for (const name of names.filter(Boolean)) {
    const re = new RegExp(`\\b${name}\\b`);
    const users = all.filter((p) => p !== file && re.test(text.get(p)));
    const prod = users.filter((p) => !isTest(p) && !rel(p).endsWith('index.ts'));
    const viaIndex = users.filter((p) => rel(p).endsWith('index.ts') && !isTest(p));
    const tests = users.filter(isTest);
    const kind = prod.length ? 'product' : tests.length ? 'TEST ONLY' : viaIndex.length ? 'index only' : 'NOWHERE';
    // Used inside its own file too?
    const selfUses = (src.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length;
    rows.push([kind, rel(file), name, prod.length, tests.length, selfUses]);
  }
}
rows.sort((a, b) => a[0].localeCompare(b[0]));
for (const r of rows.filter((r) => r[0] !== 'product')) console.log(`${r[0].padEnd(10)} ${r[1]} :: ${r[2]} (prod users ${r[3]}, tests ${r[4]}, uses in own file ${r[5]})`);
console.log(`\n${rows.length} exports; product-used ${rows.filter((r) => r[0] === 'product').length}`);
```

#### `m-run.mjs`

```js
// Mutation runner (patch → vitest → restore at once). Each mutation must match its file exactly
// once; the file is put back byte for byte in `finally`. Usage: node m-run.mjs <repo> [ids…]
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const repo = process.argv[2];
const only = process.argv.slice(3);
const CV = 'apps/desktop/src/routes/customers/customers-view.ts';
const KV = 'apps/desktop/src/routes/customers/kyc-view.ts';
const TV = 'apps/desktop/src/routes/team/team-view.ts';
const SC = 'apps/desktop/src/shell/scope.ts';
const RT = 'apps/desktop/src/shell/routes.ts';
const I18N = 'apps/desktop/src/i18n/index.ts';
const CG = 'apps/desktop/src/shell/close-guard.ts';
const BR = 'apps/desktop/src/shell/block-reload.ts';
const SE = 'apps/desktop/src/shell/startup-error.ts';
const SM = 'packages/ui/src/components/show-more.ts';
const CC = 'packages/ui/src/components/compare-cells.ts';
const PL = 'packages/ui/src/components/PeriodPicker.label.ts';
const CT = 'packages/ui/src/components/chart-theme.ts';
const TG = 'packages/ui/src/token-guard.ts';
const T = (f) => f.replace(/\.ts$/, '.test.ts');

const M = [
  ['D1', CV, 'for (const transition of data.transitions) since.set(transition.customerId, transition.date);',
    'for (const transition of data.transitions) if (!since.has(transition.customerId)) since.set(transition.customerId, transition.date);', [T(CV)]],
  ['D2', CV, '.sort((a, b) => compareDates(b.since, a.since) ||', '.sort((a, b) => compareDates(a.since, b.since) ||', [T(CV)]],
  ['D3', CV, 'openCount: cards.length - closedCount', 'openCount: cards.length', [T(CV)]],
  ['D4', CV, 'for (const { customer } of PIPELINE_STAGES.flatMap((s) => open[s])) {', 'for (const { customer } of cards) {', [T(CV)]],
  ['D5', CV, 'return compareDates(parsed.date, today) > 0', 'return compareDates(parsed.date, today) >= 0', [T(CV)]],
  ['D6', CV, ': year > today.year;', ': year >= today.year;', [T(CV)]],
  ['D7', CV, "if (parsed.yearInferred) return { ok: false, error: 'format' };", '', [T(CV)]],
  ['D8', CV, 'today.year }, today) <= 0;', 'today.year }, today) < 0;', [T(CV)]],
  ['D9', CV, "return 'month' in birth ? formatIsoDate(birth) : String(birth.year);", "return 'month' in birth ? formatIsoDate(birth) : `${birth.year}-99`;", [T(CV)]],
  ['D10', KV, "f.category === category && f.status !== 'superseded'", "f.category === category && f.status === 'active'", [T(KV)]],
  ['D11', KV, 'conflicts.some((f) => KYC_FIELDS[f.field].core)', 'conflicts.every((f) => KYC_FIELDS[f.field].core)', [T(KV)]],
  ['D12', KV, '&& f.field === cited.field && f.value === cited.value', '&& f.field === cited.field', [T(KV)]],
  ['D13', KV, 'const RANK = { meeting: -1, stage: 0, note: 1, version: 2 } as const;', 'const RANK = { meeting: 1, stage: 0, note: 1, version: 2 } as const;', [T(KV)]],
  ['D14', KV, "number: appointment.status === 'MET' ? ++met : null,", 'number: ++met,', [T(KV)]],
  ['D15', KV, 'material: version.material || manualMaterial,', 'material: version.material,', [T(KV)]],
  ['D16', KV, '(versions.at(-1)?.seq ?? 0) + 1;', '(versions.at(-1)?.seq ?? 0) + versions.length;', [T(KV)]],
  ['D17', KV, 'disabled: KYC_FIELDS[field].fromProfile && !system,', 'disabled: false,', [T(KV)]],
  ['D18', KV, '.reverse()\n    .sort(', '.sort(', [T(KV)]],
  ['D19', TV, 'customPeriod(addDays(today, -29), today)', 'customPeriod(addDays(today, -30), today)', [T(TV)]],
  ['D20', TV, 'shared: people.filter((person) => person.teamId === null),', "shared: people.filter((person) => person.role !== 'RE' && person.role !== 'TL'),", [T(TV)]],
  ['D21', TV, '(p) => p.issuedDate && isInPeriod(p.issuedDate, year),', '(p) => p.issuedDate,', [T(TV)]],
  ['D22', TV, 'return { team, lead: leads[0], reps, tl: leads.length, re: reps.length };', 'return { team, lead: leads.at(-1), reps, tl: leads.length, re: reps.length };', [T(TV)]],
  ['D23', SC, 'const team = teams.find((t) => t.id === choice.id) ?? teams[0];', 'const team = teams.find((t) => t.id === choice.id);', [T(SC)]],
  ['D24', SC, 'return kind === choice.kind ? choice : { kind };', 'return { kind };', [T(SC)]],
  ['D25', SC, 'const re = teamRes(people, scope.teamId).find((person) => person.id === reInTeam);', 'const re = people.find((person) => person.id === reInTeam);', [T(SC)]],
  ['D26', SC, '.sort((a, b) => byName(a.team, b.team) || byName(a.re.name, b.re.name))', '.sort((a, b) => byName(a.re.name, b.re.name))', [T(SC)]],
  ['D27', RT, 'if (rest.length > 0) return null;', '', [T(RT)]],
  ['D28', RT, "screen === 'appointments' ||", '', [T(RT)]],
  ['D29', RT, '`#/customers/${encodeURIComponent(route.id)}`', '`#/customers/${route.id}`', [T(RT)]],
  ['D30', I18N, 'if (!Object.hasOwn(params, name)) return slot;', 'if (!(name in params)) return slot;', [T(I18N)]],
  ['D31', I18N, 't(key as MessageKey, { ...params, ...error.params })', 't(key as MessageKey, { ...error.params, ...params })', [T(I18N)]],
  ['D32', I18N, 'COUNT_SLOTS.has(name) ? formatCount(value) : String(value)', 'String(value)', [T(I18N)]],
  ['D33', CG, "if (choice === 'stay') return;", '', [T(CG)]],
  ['D34', BR, '(press.ctrlKey && !press.altKey &&', '(press.ctrlKey &&', [T(BR)]],
  ['D35', BR, 'if (!inTextField(event.target)) event.preventDefault();', 'event.preventDefault();', [T(BR)]],
  ['D36', SE, 'if (error.cause === DISK_FULL) {', 'if (false) {', [T(SE)]],
  ['D37', SM, 'if (total <= SHOW_MORE_STEP)', 'if (total < SHOW_MORE_STEP)', [T(SM)]],
  ['D38', SM, 'next: Math.min(SHOW_MORE_STEP, total - limit)', 'next: SHOW_MORE_STEP', [T(SM)]],
  ['D39', CC, '(thenA < thenB ? -1 : thenA > thenB ? 1 : 0)', '(thenA < thenB ? 1 : thenA > thenB ? -1 : 0)', [T(CC)]],
  ['D40', PL, "case 'year':\n      return templates.yearLabel.replace('{value}', value);", "case 'year':\n      return templates.monthLabel.replace('{value}', value);", ['packages/ui/src/components/PeriodPicker.label.test.ts']],
  ['D41', CT, 'color: palette.map(token),', 'color: SERIES_TOKENS.map(token),', [T(CT)]],
  ['D42', TG, "['inline-style', /\\bstyle=\\{(?!\\{ flex: [\\w.[\\]]+ \\}\\})/g],", "['inline-style', /\\bstyle=\\{(?!\\{)/g],", [T(TG)]],
  ['D43', CV, 'const birth = year === null ? parsed.date : { year };', 'const birth = parsed.date;', [T(CV)]],
];

const out = join(process.cwd(), 'm-run.log');
writeFileSync(out, `start ${new Date().toISOString()}\n`);
let killed = 0;
let survived = 0;
for (const [id, file, from, to, tests] of M) {
  if (only.length && !only.includes(id)) continue;
  const path = join(repo, file);
  const original = readFileSync(path, 'utf8');
  const count = original.split(from).length - 1;
  if (count !== 1) {
    appendFileSync(out, `${id} SKIP pattern found ${count}× in ${file}\n`);
    console.log(`${id} SKIP (${count}×)`);
    continue;
  }
  let status;
  try {
    writeFileSync(path, original.replace(from, () => to));
    const run = spawnSync('pnpm', ['exec', 'vitest', 'run', ...tests], { cwd: repo, shell: true, encoding: 'utf8' });
    const tail = `${run.stdout}${run.stderr}`.split('\n').filter((l) => /Tests\s+\d|Test Files|FAIL/.test(l)).slice(0, 4).join(' / ');
    status = run.status === 0 ? 'SURVIVED' : 'KILLED';
    if (status === 'KILLED') killed += 1;
    else survived += 1;
    appendFileSync(out, `${id} ${status} ${file} :: ${tail.replace(/\s+/g, ' ')}\n`);
  } finally {
    writeFileSync(path, original);
  }
  console.log(`${id} ${status}`);
}
appendFileSync(out, `killed ${killed}, survived ${survived}\n`);
const git = spawnSync('git', ['status', '--short'], { cwd: repo, encoding: 'utf8' });
appendFileSync(out, `git status --short after: [${git.stdout.trim()}]\nend ${new Date().toISOString()}\n`);
console.log(`killed ${killed}, survived ${survived}; git status: [${git.stdout.trim()}]`);
```

### 7.4 Cuối phiên

- `git -C C:\workspace\Project-2C-review status --short` cuối phiên: rỗng (như đầu phiên); `git rev-parse HEAD` = `885534549808f42aec7f9af5743bbf86642ee4bd`. Bản web dựng riêng nằm ở `claude\D\web` (ngoài repo); server cổng 4392 đã tắt.
- Không gọi dịch vụ AI, không mở chatgpt.com, không chạy `pnpm e2e` (cổng 4173 để phiên Codex dùng), không đọc thư mục của bên khác.
- Giờ xong: 2026-10-14 17:09.
